import { test, expect } from '@playwright/test';

const ZINE_ID = 'KoreaMoments1';
const TEST_CODE = process.env.TEST_CODE;
const BASE_URL = 'https://bricechivu.github.io/Zines';

test('user can submit a comment with correct code', async ({ page }) => {
  await page.goto(`${BASE_URL}/?zine=${ZINE_ID}`, { waitUntil: 'networkidle' });

  // Wait for JS to render the form
  await page.waitForSelector('#comment-form', { timeout: 15000 });

  // Fill in the form
  await page.fill('#author', 'CI Test');
  await page.fill('#location', 'GitHub Actions');
  await page.fill('#code', TEST_CODE);
  await page.fill('#body', 'Automated test comment — will be deleted');
  await page.fill('#instagram', '@ci_test');

  // Submit
  await page.click('button[type="submit"]');

  // Should redirect to homepage
  await page.waitForURL(url => !url.toString().includes('zine='), { timeout: 15000 });

  // Comment should appear
  await page.waitForSelector('#zines-container', { timeout: 15000 });
  await expect(page.locator('#zines-container')).toContainText('CI Test');
});

test('wrong code shows error and does not submit', async ({ page }) => {
  await page.goto(`${BASE_URL}/?zine=${ZINE_ID}`, { waitUntil: 'networkidle' });

  await page.waitForSelector('#comment-form', { timeout: 15000 });

  await page.fill('#location', 'GitHub Actions');
  await page.fill('#code', 'WRONGCODE');
  await page.fill('#body', 'This should not be saved');
  await page.click('button[type="submit"]');

  // Should stay on same page and show error
  await expect(page.locator('#form-error')).toContainText('Wrong code', { timeout: 10000 });
  expect(page.url()).toContain(`zine=${ZINE_ID}`);
});