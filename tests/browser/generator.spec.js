import { test, expect } from '@playwright/test';

test('choose preferences, generate a Burmese line and open admin', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('burmese.');
  await page.getByRole('button', { name: 'Secret', exact: true }).click();
  await page.getByRole('button', { name: 'Tech', exact: true }).click();
  await page.getByRole('button', { name: 'Cute', exact: true }).click();
  await page.route('**/api/generate', async route => {
    expect(route.request().postDataJSON()).toMatchObject({ identity: 'other', interest: 'tech', style: 'cute', language: 'my' });
    await route.fulfill({ json: { text: 'မင်္ဂလာပါ', isAI: false } });
  });
  await page.getByRole('button', { name: 'Shoot my shot' }).click();
  await expect(page.getByLabel('မင်္ဂလာပါ', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'sign in to the line lab.' })).toBeVisible();
});
