// Simple admin auth middleware: when ADMIN_API_KEY is set, require Authorization: Bearer <key>
module.exports = function adminAuth(req, res, next) {
  const key = process.env.ADMIN_API_KEY;
  if (!key) {
    // dev mode: no admin key set, allow through
    return next();
  }
  const auth = req.headers['authorization'] || req.query.admin_key;
  if (!auth) return res.status(401).json({ ok: false, error: 'admin authorization required' });
  // accept both 'Bearer KEY' and plain key via query param
  if (auth.startsWith && auth.startsWith('Bearer ')) {
    const provided = auth.split(' ')[1].trim();
    if (provided === key) return next();
    return res.status(403).json({ ok: false, error: 'invalid admin key' });
  }
  // query param or raw header value
  if (auth === key) return next();
  return res.status(403).json({ ok: false, error: 'invalid admin key' });
};
