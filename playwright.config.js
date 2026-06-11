import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://bricechivu.github.io/Zines',
    headless: true
  }
});