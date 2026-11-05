import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'ui.spec.js',
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4175/',
    browserName: 'chromium',
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4175/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
