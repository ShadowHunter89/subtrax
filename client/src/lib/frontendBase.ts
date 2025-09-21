// Client-side helper to determine frontend base URL at runtime
export function getFrontendBase() {
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_FRONTEND_BASE_URL) {
    return process.env.REACT_APP_FRONTEND_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }
  return '';
}
