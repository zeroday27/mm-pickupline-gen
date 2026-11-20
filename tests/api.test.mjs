import assert from 'node:assert/strict';
import test from 'node:test';
import { authMiddleware } from '../backend/src/middleware/auth.js';
import { recommendPickupLine } from '../backend/src/services/recommendationService.js';

test('basic auth accepts complete credentials including colons and fails closed', t => {
  const original = { ...process.env };
  t.after(() => {
    for (const key of ['ADMIN_USERNAME', 'ADMIN_PASSWORD']) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  });
  process.env.ADMIN_USERNAME = 'editor';
  process.env.ADMIN_PASSWORD = 'test:only';
  const authorize = value => authMiddleware({ headers: { authorization: 'Basic ' + Buffer.from(value).toString('base64') } },
    { status: code => ({ json: () => code }) }, () => 200);
  assert.equal(authorize('editor:test:only'), 200);
  assert.equal(authorize('editor:test'), 401);
  delete process.env.ADMIN_PASSWORD;
  assert.equal(authorize('editor:'), 401);
});

test('every fallback query restricts visibility to approved and legacy records', async () => {
  const queries = [];
  const model = { find(query) { queries.push(query); return { limit: () => [] }; } };
  assert.equal(await recommendPickupLine(model, { interest: 'tech', style: 'cute' }), null);
  assert.ok(queries.length > 1);
  for (const query of queries) assert.deepEqual(query.$or, [
    { review_status: 'approved' }, { review_status: { $exists: false } }
  ]);
});

test('an exact match returns the curated Burmese text and its insight', async () => {
  const model = { find: () => ({ limit: () => [{ category: 'tech', style: 'cute', burmese_text: 'မင်္ဂလာပါ' }] }) };
  const result = await recommendPickupLine(model, { interest: 'tech', style: 'cute' });
  assert.equal(result.text, 'မင်္ဂလာပါ');
  assert.equal(result.source, 'database_curated');
  assert.ok(result.insight.followUp);
});
