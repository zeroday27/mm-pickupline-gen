import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';

const origin = process.env.APP_URL || 'http://127.0.0.1:3000';
const health = new URL('/api/health', origin);
let ready = false;
for (let attempt = 0; attempt < 40; attempt++) {
  try {
    const res = await fetch(health, { signal: AbortSignal.timeout(5000) });
    if (res.ok && (await res.json()).status === 'ok') {
      ready = true;
      break;
    }
  } catch { /* Container startup can temporarily interrupt the connection. */ }
  await delay(2000);
}
assert.ok(ready, 'MongoDB readiness check failed');
assert.equal((await fetch(new URL('/api/admin/login', origin))).status, 401);

if (process.argv.includes('--production')) {
  const page = await fetch(new URL('/', origin));
  assert.equal(page.status, 200);
  assert.match(await page.text(), /id="root"/);
  const lines = await fetch(new URL('/api/pickup-lines?category=travel', origin));
  assert.ok(lines.ok && Array.isArray(await lines.json()));
} else {
  const admin = new URL('/api/admin/pickup-lines', origin);
  const headers = { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from('ci:ci-only').toString('base64') };
  const line = { text: 'CI sample', category: 'travel', style: 'cute' };
  const created = await fetch(admin, { method: 'POST', headers, body: JSON.stringify(line) });
  assert.equal(created.status, 201);
  const item = new URL(admin.href + '/' + (await created.json())._id);
  const matching = await fetch(new URL('/api/pickup-lines?category=travel&style=cute', origin));
  assert.equal(matching.status, 200);
  assert.deepEqual((await matching.json()).map(row => row.text), [line.text]);
  const otherCategory = await fetch(new URL('/api/pickup-lines?category=music', origin));
  assert.deepEqual(await otherCategory.json(), []);
  const generated = await fetch(new URL('/api/generate', origin), {
    method: 'POST', headers, body: JSON.stringify({ interest: 'travel', style: 'cute' })
  });
  assert.equal(generated.status, 200);
  assert.equal((await generated.json()).text, line.text);
  const edited = await fetch(item, { method: 'PUT', headers, body: JSON.stringify({ review_status: 'staging' }) });
  assert.equal(edited.status, 200);
  const publicList = await fetch(new URL('/api/pickup-lines', origin));
  assert.deepEqual(await publicList.json(), []);
  const staged = await fetch(new URL(admin.href + '?category=travel&style=cute&review_status=staging&search=sample'), { headers });
  assert.equal(staged.status, 200);
  const listing = await staged.json();
  assert.equal(listing.total, 1);
  assert.deepEqual(listing.pickupLines.map(row => row.text), [line.text]);
  const removed = await fetch(item, { method: 'DELETE', headers });
  assert.equal(removed.status, 200);

}
