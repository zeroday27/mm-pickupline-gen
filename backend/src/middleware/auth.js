import { timingSafeEqual } from 'node:crypto';

export function authMiddleware(req, res, next) {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  const header = req.headers.authorization || '';
  if (ADMIN_USERNAME && ADMIN_PASSWORD && header.startsWith('Basic ')) {
    const actual = Buffer.from(header.slice(6), 'base64');
    const expected = Buffer.from(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);
    if (actual.length === expected.length && timingSafeEqual(actual, expected)) return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}
