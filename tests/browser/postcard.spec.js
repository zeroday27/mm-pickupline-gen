import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const texts = ['Pokemon Master တွေလို မင်းရဲ့ နှလုံးသားကို Catch လုပ်ချင်တယ် ⚡💝',
  'နွေးထွေးတဲ့ လက်ဖက်ရည်တစ်ခွက် ❤️ '.repeat(16).trim()];

async function openResult(page) {
  let index = 0;
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.route('**/api/pickup-lines/options', route => route.fulfill({ json: [{ category: 'gaming', style: 'funny', count: 2 }] }));
  await page.route('**/api/generate', route => {
    const i = index++;
    return route.fulfill({ json: { id: String(i + 1).padStart(24, '0'), text: texts[i],
      category: 'gaming', style: 'funny', total: 2, remaining: 1 - i } });
  });
  await page.goto('/');
  for (const name of ['Gaming', 'Funny', 'Shoot my shot']) await page.getByRole('button', { name, exact: true }).click();
  await expect(page.locator('.postcardCredit')).toHaveText('made with ❤️ by Yangon AI');
  await expect(page.getByText('Say this', { exact: true })).toHaveCount(0);
}

test('Copy text preserves the line and Share and Chat attach each current PNG', async ({ page }) => {
  await page.addInitScript(() => {
    window.cards = [];
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async value => { window.copied = value; } } });
    Object.defineProperty(navigator, 'canShare', { value: data => data.files?.[0]?.type === 'image/png' });
    Object.defineProperty(navigator, 'share', { value: async data => {
      const file = data.files[0];
      const bitmap = await createImageBitmap(file);
      window.cards.push({ width: bitmap.width, height: bitmap.height, name: file.name, keys: Object.keys(data) });
      bitmap.close();
      throw new DOMException('Cancelled', 'AbortError');
    } });
  });
  await openResult(page);
  await page.getByRole('button', { name: 'Copy text' }).click();
  expect(await page.evaluate(() => window.copied)).toBe(texts[0]);
  await page.getByRole('button', { name: 'Share postcard' }).click();
  await expect.poll(() => page.evaluate(() => window.cards.length)).toBe(1);
  await expect(page.getByRole('dialog')).toBeHidden();
  await page.getByRole('button', { name: 'Another one (1 left)' }).click();
  await page.getByRole('button', { name: 'Send postcard to chat' }).click();
  await expect.poll(() => page.evaluate(() => window.cards.length)).toBe(2);
  const [first, next] = await page.evaluate(() => window.cards);
  expect(first.width).toBe(1080);
  expect(first.height).toBe(720);
  expect(next.height).toBeGreaterThan(first.height);
  expect(next.name).not.toBe(first.name);
  expect(next.keys).toEqual(['files']);
});

test('unsupported file sharing opens a downloadable PNG', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'canShare', { value: () => false }));
  await openResult(page);
  await page.getByRole('button', { name: 'Send postcard to chat' }).click();
  const dialog = page.getByRole('dialog', { name: 'Save postcard' });
  await expect(dialog.getByRole('img', { name: texts[0] })).toBeVisible();
  const pending = page.waitForEvent('download');
  await dialog.getByRole('link', { name: 'Save PNG' }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toMatch(/^yangon-ai-.+\.png$/);
  expect((await readFile(await download.path())).subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  await dialog.getByRole('button', { name: 'Close' }).click();
  await expect(dialog).toBeHidden();
});
