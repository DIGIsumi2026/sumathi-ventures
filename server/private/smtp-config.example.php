<?php
/** Copy to smtp-config.php outside public_html and supply credentials privately. */
return [
    'smtp_host' => 'YOUR_SMTP_SERVER', // Confirm hostname from your email provider
    'smtp_port' => 465,
    'smtp_user' => 'YOUR_AUTHENTICATED_EMAIL@YOUR_DOMAIN',
    'smtp_password' => 'CHANGE_ME',
    'from_email' => 'YOUR_AUTHENTICATED_EMAIL@YOUR_DOMAIN',
    'from_name' => 'Sumathi Ventures Website',
    'to_email' => 'YOUR_RECEIVING_GMAIL@gmail.com',
    // Required for browser submissions (production origins + optional localhost for testing):
    'allowed_origins' => [
        'https://sumathiventures.com',
        'https://www.sumathiventures.com',
        'http://localhost:3000',
    ],
];
