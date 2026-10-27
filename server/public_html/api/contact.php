<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $code, bool $success, string $message): never {
    http_response_code($code);
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

$private = dirname(__DIR__, 2) . '/private';
$configFile = $private . '/smtp-config.php';
if (!is_file($configFile)) respond(503, false, 'Contact service is not configured.');
$config = require $configFile;
if (!is_array($config)) respond(503, false, 'Contact service is not configured.');

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $config['allowed_origins'] ?? [];
if ($origin !== '') {
    if (!in_array($origin, $allowed, true)) respond(403, false, 'Origin not permitted.');
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if ($origin === '') respond(403, false, 'Origin required.');
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, false, 'Method not allowed.');
if (!str_contains(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) respond(415, false, 'JSON required.');
$raw = file_get_contents('php://input', false, null, 0, 12000);
if (!is_string($raw) || strlen($raw) > 11000) respond(413, false, 'Submission is too large.');
$data = json_decode($raw, true);
if (!is_array($data)) respond(400, false, 'Invalid JSON.');
if (!empty($data['website'])) respond(200, true, 'Thank you for your enquiry.'); // Honeypot

function field(array $data, string $name, int $max): string {
    $value = $data[$name] ?? '';
    if (!is_string($value)) respond(422, false, 'Invalid field: ' . $name);
    $value = trim($value);
    if ($value === '' || strlen($value) > $max || preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $value)) {
        respond(422, false, 'Invalid field: ' . $name);
    }
    return $value;
}
$name = field($data, 'name', 100);
$company = field($data, 'company', 150);
$email = field($data, 'email', 254);
$country = field($data, 'country', 100);
$sector = field($data, 'sector', 40);
$type = field($data, 'inquiryType', 70);
$message = field($data, 'message', 5000);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, false, 'Invalid email address.');
if (preg_match('/[\r\n]/', $name)) respond(422, false, 'Invalid name.');
if (!in_array($sector, ['Industry','Commerce','Technology','Other'], true)) respond(422, false, 'Invalid sector.');
if (!in_array($type, ['Strategic partnership','Project proposal','General enquiry'], true)) respond(422, false, 'Invalid enquiry type.');
if ((function_exists('mb_strlen') ? mb_strlen($message) : strlen($message)) < 15 || (function_exists('mb_strlen') ? mb_strlen($name) : strlen($name)) < 2 || (function_exists('mb_strlen') ? mb_strlen($company) : strlen($company)) < 2) respond(422, false, 'Please complete all required fields.');
if (($data['consent'] ?? false) !== true) respond(422, false, 'Consent is required.');

// Simple shared-host-friendly rate limiter: max 5 submissions per hour per IP.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/sumathi-contact-' . hash('sha256', $ip) . '.json';
$fp = @fopen($rateFile, 'c+');
if ($fp) {
    if (flock($fp, LOCK_EX)) {
        $content = stream_get_contents($fp);
        $hits = json_decode($content ?: '[]', true);
        if (!is_array($hits)) $hits = [];
        $hits = array_values(array_filter($hits, static fn($at) => is_int($at) && $at > time() - 3600));
        if (count($hits) >= 5) { flock($fp, LOCK_UN); fclose($fp); respond(429, false, 'Too many enquiries. Please try again later.'); }
        $hits[] = time();
        ftruncate($fp, 0); rewind($fp); fwrite($fp, json_encode($hits)); fflush($fp);
        flock($fp, LOCK_UN);
    }
    fclose($fp);
}

$autoload = $private . '/vendor/autoload.php';
if (!is_file($autoload)) respond(503, false, 'Contact service is not configured.');
require_once $autoload;
$e = static fn(string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$body = '<div style="font-family:Arial,sans-serif;color:#18372c;max-width:650px;margin:auto">'
    . '<div style="background:#123e30;color:#fff;padding:20px;font-size:19px;font-weight:bold">SUMATHI VENTURES</div>'
    . '<div style="padding:22px;border:1px solid #dfe8de">'
    . '<p style="color:#55765b">New website enquiry — ' . $e($type) . '</p>'
    . '<p><b>Name:</b> ' . $e($name) . '</p><p><b>Organisation:</b> ' . $e($company) . '</p>'
    . '<p><b>Email:</b> ' . $e($email) . '</p><p><b>Country:</b> ' . $e($country) . '</p>'
    . '<p><b>Sector:</b> ' . $e($sector) . '</p><p><b>Enquiry type:</b> ' . $e($type) . '</p>'
    . '<hr><p style="white-space:pre-wrap">' . nl2br($e($message)) . '</p></div></div>';

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = (string)$config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = (string)$config['smtp_user'];
    $mail->Password = (string)$config['smtp_password'];
    $mail->Port = (int)$config['smtp_port'];
    $mail->SMTPSecure = $mail->Port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet = 'UTF-8';
    $mail->Timeout = 15;
    $mail->setFrom((string)$config['from_email'], (string)$config['from_name']);
    $mail->addAddress((string)$config['to_email']);
    $mail->addReplyTo($email, $name);
    $mail->Subject = '[Sumathi Ventures] ' . $type . ' — ' . $sector;
    $mail->isHTML(true);
    $mail->Body = $body;
    $mail->AltBody = "New enquiry\nName: $name\nOrganisation: $company\nEmail: $email\nCountry: $country\nSector: $sector\nType: $type\n\n$message";
    $mail->send();
    respond(200, true, 'Your enquiry has been sent.');
} catch (MailException $ex) {
    error_log('Sumathi contact mail delivery failed: ' . $ex->getMessage());
    respond(503, false, 'Your enquiry could not be delivered at this time. Please try again.');
} catch (Throwable $ex) {
    error_log('Sumathi contact server error: ' . $ex->getMessage());
    respond(503, false, 'Service temporarily unavailable.');
}
