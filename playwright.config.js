import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH }
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 850 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 850 } } }
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4174 --strictPort',
    url: 'http://127.0.0.1:4174'
  }
});
