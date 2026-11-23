import { test, expect } from '@playwright/test';

test('match an interest, reroll and remember seen lines after refresh', async ({ page }) => {
  const options = ['sweet', 'cute'].map(style => ({ category: 'tech', style, count: 1 }));
  await page.route('**/api/pickup-lines/options', route => route.fulfill({ json: options }));
  const rows = options.map((row, i) => ({ ...row, id: String(i + 1).padStart(24, '0'), text: 'မင်္ဂလာပါ ' + i }));
  await page.route('**/api/generate', async route => {
    const { interest, style, language, seenIds } = route.request().postDataJSON();
    expect([interest, language]).toEqual(['tech', 'my']);
    const matching = rows.filter(row => style === 'any' || style === row.style);
    const unseen = matching.filter(row => !seenIds.includes(row.id));
    await route.fulfill({ json: unseen.length ? { ...unseen[0], total: matching.length, remaining: unseen.length - 1 }
      : { status: 'exhausted', total: matching.length, remaining: 0 } });
  });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const button = name => page.getByRole('button', { name, exact: true });
  await button('Food').click();
  await expect(page.getByRole('status')).toContainText('No approved Food');
  await button('Tech').click();
  await expect(button('Romantic')).toHaveCount(0);
  await button('Any vibe').click();
  await button('Shoot my shot').click();
  await expect(page.locator('.tag-vibe')).toHaveText('Sweet');
  await button('Another one').click();
  await expect(page.locator('.tag-vibe')).toHaveText('Cute');
  await expect(page.getByRole('status')).toContainText('seen all 2');
  await page.reload();
  await button('Tech').click();
  await button('Cute').click();
  await button('Shoot my shot').click();
  await expect(page.getByRole('status')).toContainText('seen all 1');
  await button('Choose another vibe or interest').click();
  await expect(button('Any vibe')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'sign in to the line lab.' })).toBeVisible();
});
