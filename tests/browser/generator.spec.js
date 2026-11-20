import { test, expect } from '@playwright/test';

test('choose preferences, generate a Burmese line and open admin', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Burmese pickup lines.', { useInnerText: true });
  await page.getByLabel('I am a…').selectOption('other');
  await page.getByLabel('Their interest').selectOption('tech');
  await page.getByText('Cute', { exact: true }).click();
  await page.route('**/api/generate', async route => {
    expect(route.request().postDataJSON()).toMatchObject({ interest: 'tech', style: 'cute', language: 'my' });
    await route.fulfill({ json: { text: 'မင်္ဂလာပါ', isAI: false } });
  });
  await page.getByRole('button', { name: 'Find my line' }).click();
  await expect(page.getByText('မင်္ဂလာပါ', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/admin');
  await expect(page.getByText('Admin Login')).toBeVisible();
});
