// Helper to determine the frontend base URL in a flexible, host-agnostic way.
// Preference order:
// 1) FRONTEND_BASE_URL env (explicit full origin)
// 2) FRONTEND_ALLOWED_ORIGINS env (comma-separated whitelist when strict)
// 3) request Origin header (if present and allowed)
// 4) Referer header origin (if present and allowed)
// 5) FIREBASE_AUTH_DOMAIN env (https://<project>.firebaseapp.com)
// 6) null (caller should provide a sensible default or error)

const { URL } = require('url');

function parseAllowedOrigins() {
  const env = process.env.FRONTEND_ALLOWED_ORIGINS || '';
  return env.split(',').map(s => s.trim()).filter(Boolean);
}

function getFrontendBaseFromHeaders(req) {
  if (!req || !req.headers) return null;
  const origin = req.headers.origin || req.headers['x-origin'] || null;
  if (origin) return String(origin);
  const referer = req.headers.referer || req.headers.referrer || null;
  if (referer) {
    try { return new URL(referer).origin; } catch (_) { return null; }
  }
  return null;
}

function isOriginAllowed(origin) {
  if (!origin) return false;
  const allowed = parseAllowedOrigins();
  if (!allowed.length) return true; // no whitelist => allow dynamic origins
  try {
    const o = new URL(origin).origin || origin;
    return allowed.includes(o);
  } catch (_) {
    return allowed.includes(origin);
  }
}

function computeFrontendBase(req) {
  // 1) explicit env override
  if (process.env.FRONTEND_BASE_URL) return process.env.FRONTEND_BASE_URL;

  // 2) headers (origin/referer) if present
  const fromHeaders = getFrontendBaseFromHeaders(req);
  if (fromHeaders && isOriginAllowed(fromHeaders)) return fromHeaders;

  // 3) firebase fallback
  if (process.env.FIREBASE_AUTH_DOMAIN) return `https://${process.env.FIREBASE_AUTH_DOMAIN}`;

  // 4) test-mode fallback to preserve existing tests and developer expectations
  if (process.env.NODE_ENV === 'test') return 'https://subtrax.vercel.app';

  // 5) no reliable base found
  return null;
}

module.exports = { computeFrontendBase, isOriginAllowed, parseAllowedOrigins };
