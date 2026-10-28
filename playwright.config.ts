import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    workers: 1,
    timeout: 30000,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:3100',
        channel:
            process.env.PLAYWRIGHT_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined),
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'node tests/serve-export.mjs',
        url: 'http://127.0.0.1:3100',
        reuseExistingServer: !process.env.CI,
    },
});
