import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('out');
const types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
};

createServer(async (request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(root, `.${pathname}${pathname.endsWith('/') ? 'index.html' : ''}`);
    if (!file.startsWith(`${root}${sep}`)) {
        response.writeHead(403).end();
        return;
    }
    try {
        const contents = await readFile(file);
        response.writeHead(200, {
            'Content-Type': types[extname(file)] || 'application/octet-stream',
        });
        response.end(contents);
    } catch {
        response.writeHead(404).end();
    }
}).listen(3100, '127.0.0.1');
