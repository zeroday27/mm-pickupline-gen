import assert from 'node:assert/strict';

const origin = new URL(process.env.APP_URL);
assert.equal(origin.protocol, 'https:');
assert.ok(origin.hostname.endsWith('.run.app'));
const headers = { 'X-Serverless-Authorization': 'Bearer ' + process.env.RUN_ID_TOKEN };
const get = path => fetch(new URL(path, origin), {
  headers, redirect: 'error', signal: AbortSignal.timeout(100_000)
});
const health = await get('/api/health');
assert.equal(health.status, 200);
assert.equal((await health.json()).status, 'ok');
for (const path of ['/', '/admin']) {
  const page = await get(path);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /id="root"/);
}
assert.equal((await get('/api/admin/login')).status, 401);
const lines = await get('/api/pickup-lines?category=travel');
assert.equal(lines.status, 200);
assert.ok(Array.isArray(await lines.json()));
