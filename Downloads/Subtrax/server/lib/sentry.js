let Sentry = null;
try {
  const SentryNode = require('@sentry/node');
  Sentry = SentryNode;
} catch (e) {
  // @sentry/node not installed; Sentry calls will be no-ops
}

function init() {
  const dsn = process.env.SENTRY_DSN;
  if (Sentry && dsn) {
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
    console.info('Sentry initialized');
    return Sentry;
  }
  return null;
}

module.exports = { init, Sentry };