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

function modelWith(rows, queries = []) {
  return { find(query) {
    queries.push(query);
    return { lean: () => rows.filter(row => Object.entries(query).every(([key, value]) => row[key] === (value.$eq ?? value))) };
  } };
}

const approved = { category: 'travel', style: 'cute', language: 'my', length: 'short', review_status: 'approved', burmese_text: 'မင်္ဂလာပါ' };

test('exact matching requires explicit approval, Burmese, short, interest and style', async () => {
  const queries = [];
  const rows = [{ ...approved, _id: 'a' }, ...[
    { review_status: undefined }, { review_status: 'staging' }, { style: 'sweet' },
    { category: 'books' }, { language: 'en' }, { length: 'long' }
  ].map((change, i) => ({ ...approved, ...change, _id: String(i) }))];
  const model = modelWith(rows, queries);
  const result = await recommendPickupLine(model, { interest: 'travel', style: 'cute' });
  assert.equal(result.id, 'a');
  assert.equal(result.text, approved.burmese_text);
  assert.ok(result.insight.followUp);
  assert.equal(result.remaining, 0);
  assert.deepEqual(queries, [{ review_status: 'approved', language: 'my', length: 'short', category: { $eq: 'travel' }, style: { $eq: 'cute' } }]);
  assert.equal((await recommendPickupLine(model, { interest: 'food', style: 'any' })).status, 'empty');
});

test('any vibe returns actual tags and rerolls reach every unseen candidate', async () => {
  const rows = Array.from({ length: 11 }, (_, i) => ({ ...approved, _id: String(i),
    style: i % 2 ? 'cute' : 'sweet', quality_score: i < 8 ? 100 : 0, safety_score: 90 }));
  const model = modelWith(rows);
  const seenIds = [];
  for (let n = 0; n < rows.length; n++) {
    const line = await recommendPickupLine(model, { interest: 'travel', style: 'any', seenIds });
    if (n === 0) assert.ok(Number(line.id) < 8);
    assert.ok(!seenIds.includes(line.id));
    assert.equal(line.style, rows[Number(line.id)].style);
    assert.equal(line.remaining, rows.length - n - 1);
    seenIds.push(line.id);
  }
  assert.deepEqual(await recommendPickupLine(model, { interest: 'travel', style: 'any', seenIds }),
    { status: 'exhausted', total: 11, remaining: 0 });
});
