import { test, expect } from '@playwright/test';

const ZINE_ID = 'KoreaMoments1';
const TEST_CODE = process.env.TEST_CODE;

test('user can submit a comment with correct code', async ({ page }) => {
  await page.goto(`/?zine=${ZINE_ID}`, { waitUntil: 'networkidle' });

  // Debug: capture what the page looks like
  await page.screenshot({ path: 'test-results/debug.png', fullPage: true });
  console.log('Page title:', await page.title());
  console.log('Page URL:', page.url());
  console.log('Page content:', await page.content());

  // Intro and form are visible
  await expect(page.locator('#typewriter')).toBeVisible({ timeout: 15000 });
  // Fill in the form
  await page.fill('#author', 'CI Test');
  await page.fill('#location', 'GitHub Actions');
  await page.fill('#code', TEST_CODE);
  await page.fill('#body', 'Automated test comment — will be deleted');

  // Submit
  await page.click('button[type="submit"]');

  // Should redirect to homepage (no ?zine param)
  await page.waitForURL('https://bricechivu.github.io/Zines/');

  // Comment should appear on homepage
  await expect(page.locator('#zines-container')).toContainText('CI Test');
});

test('wrong code shows error and does not submit', async ({ page }) => {
  await page.goto(`/?zine=${ZINE_ID}`, { waitUntil: 'networkidle' });

  await page.fill('#code', 'WRONGCODE');
  await page.fill('#body', 'This should not be saved');
  await page.click('button[type="submit"]');

  // Should stay on same page and show error
  await expect(page.locator('#form-error')).toContainText('Wrong code');
  expect(page.url()).toContain(`zine=${ZINE_ID}`);
});