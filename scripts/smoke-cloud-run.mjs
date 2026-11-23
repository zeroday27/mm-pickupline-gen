import assert from 'node:assert/strict';

const origin = new URL(process.env.APP_URL);
assert.equal(origin.protocol, 'https:');
const request = (path, options) => fetch(new URL(path, origin), {
  ...options, redirect: 'error', signal: AbortSignal.timeout(100_000)
});

const health = await request('/api/health');
assert.equal(health.status, 200);
assert.equal((await health.json()).status, 'ok');

for (const path of ['/', '/admin']) {
  const page = await request(path);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /id="root"/);
}

assert.equal((await request('/api/admin/pickup-lines')).status, 401);

const lines = await request('/api/pickup-lines');
assert.equal(lines.status, 200);
const catalogue = await lines.json();
assert.ok(Array.isArray(catalogue) && catalogue.length > 0, 'Expected public pickup lines');

const options = await request('/api/pickup-lines/options');
assert.equal(options.status, 200);
const [pair] = await options.json();
assert.ok(pair?.count > 0, 'Expected an available interest and vibe');
const recommendation = await request('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ interest: pair.category, style: pair.style, language: 'my' })
});
assert.equal(recommendation.status, 200);
const { source, text, category, style, id } = await recommendation.json();
assert.equal(category, pair.category);
assert.equal(style, pair.style);
assert.ok(id);
assert.equal(source, 'database_curated');
assert.ok(typeof text === 'string' && text.trim(), 'Expected a pickup line');
assert.ok(catalogue.some(line => (line.burmese_text || line.text) === text),
  'Expected the recommendation in the public catalogue');
