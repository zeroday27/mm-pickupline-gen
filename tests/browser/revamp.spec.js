import { test, expect } from '@playwright/test';

// Synthetic data only.
const line = {
  text: 'မင်းကို တွေ့တော့ ကမ္ဘာကြီး ခဏရပ်သွားတယ်',
  id: '000000000000000000000001', category: 'music', style: 'flirty', remaining: 0, total: 1, isAI: false,
  insight: { whyItWorks: 'ရိုးရှင်းပြီး ချစ်စရာကောင်းတယ်', followUp: 'ကော်ဖီ တစ်ခွက်လောက် သွားသောက်ရအောင်' }
};
const adminLines = [
  { _id: 'line-001', burmese_text: 'စမ်းသပ် စာကြောင်း တစ်', category: 'tech', style: 'cute', review_status: 'staging', quality_score: 72, safety_score: 96, tags: ['pun'] },
  { _id: 'line-002', burmese_text: 'စမ်းသပ် စာကြောင်း နှစ်', category: 'music', style: 'funny', review_status: 'approved', quality_score: 88, safety_score: 99, tags: [] }
];

const viewports = [
  { width: 360, height: 640 },
  { width: 390, height: 844 },
  { width: 834, height: 1194 },
  { width: 1440, height: 900 }
];

// Viewports are set per describe, so run these once instead of per project.
const runOnce = () => test.skip(test.info().project.name !== 'desktop', 'viewport set explicitly');
const fitsScreen = page => page.evaluate(() => document.scrollingElement.scrollHeight <= innerHeight);

async function mockGenerate(page, delay = 0) {
  await page.route('**/api/pickup-lines/options', route => route.fulfill({ json: [{ category: 'music', style: 'flirty', count: 1 }] }));
  await page.route('**/api/generate', async route => {
    if (delay) await new Promise(r => setTimeout(r, delay));
    await route.fulfill({ json: line });
  });
}

async function pickAll(page) {
  await page.getByRole('button', { name: 'Music', exact: true }).click();
  await page.getByRole('button', { name: 'Flirty', exact: true }).click();
}

for (const viewport of viewports) {
  test.describe(`public app at ${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });
    test('pick, think, result without page scroll', async ({ page }) => {
    runOnce();
      await mockGenerate(page);
      await page.goto('/');
      const cta = page.getByRole('button', { name: 'Pick an interest and vibe' });
      await expect(cta).toBeDisabled();
      expect(await fitsScreen(page)).toBe(true);
      await pickAll(page);
      await expect(page.getByRole('button', { name: 'Music', exact: true })).toHaveAttribute('aria-pressed', 'true');
      await page.getByRole('button', { name: 'Shoot my shot' }).click();
      await expect(page.locator('.thinkingView')).toBeVisible();
      await expect(page.getByText('cooking your line')).toBeVisible();
      await expect(page.getByLabel(line.text, { exact: true })).toBeVisible({ timeout: 6000 });
      await expect(page.getByRole('button', { name: 'Copy line' })).toBeVisible();
      expect(await fitsScreen(page)).toBe(true);
    });
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('result appears without the orbit animation', async ({ page }) => {
    runOnce();
    await mockGenerate(page, 150);
    await page.goto('/');
    await pickAll(page);
    await page.getByRole('button', { name: 'Shoot my shot' }).click();
    await expect(page.locator('.thinkingView')).toBeVisible();
    expect(await page.locator('.track').first().evaluate(el => getComputedStyle(el).animationName)).toBe('none');
    await expect(page.getByLabel(line.text, { exact: true })).toBeVisible({ timeout: 2000 });
    const wordOpacity = await page.locator('.linecard p span').last().evaluate(el => getComputedStyle(el).opacity);
    expect(wordOpacity).toBe('1');
  });
});

test.describe('admin on phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test('list renders and the editor opens', async ({ page }) => {
    runOnce();
    await page.route('**/api/admin/login', route => route.fulfill({ json: { ok: true } }));
    await page.route('**/api/admin/pickup-lines?**', route => route.fulfill({ json: { pickupLines: adminLines, total: adminLines.length, pages: 1 } }));
    await page.goto('/admin');
    await page.getByLabel('Username').fill('test-admin');
    await page.getByLabel('Password', { exact: true }).fill('synthetic-password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'review queue' })).toBeVisible();
    await expect(page.locator('.row')).toHaveCount(2);
    const editor = page.getByRole('complementary', { name: 'Line editor' });
    await expect(editor).toBeHidden();
    await page.locator('.row').first().click();
    await expect(editor).toBeVisible();
    await expect(editor.getByRole('button', { name: '0/4 checked' })).toBeDisabled();
    expect(await fitsScreen(page)).toBe(true);
    await editor.getByRole('button', { name: 'Back to queue' }).click();
    await expect(editor).toBeHidden();
  });
});
