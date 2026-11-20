import { createHash, timingSafeEqual } from 'node:crypto';

const digest = value => createHash('sha256').update(value).digest();

export function authMiddleware(req, res, next) {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  const header = req.headers.authorization || '';
  if (ADMIN_USERNAME && ADMIN_PASSWORD && header.startsWith('Basic ')) {
    const actual = Buffer.from(header.slice(6), 'base64');
    const expected = digest(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);
    if (timingSafeEqual(digest(actual), expected)) return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}
