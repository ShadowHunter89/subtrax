// smoke-check: require the firebaseAdmin initializer and print initialization status
const path = require('path');
try {
  // require the initializer which runs its async init immediately
  const { initialized } = require(path.join('..', 'firebaseAdmin'));
  // initialized may still be false because init attempts are async; wait a short time
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.log('firebaseAdmin.initialized =', initialized);
    // If initialized is false, print a note — workflows that use secret manager should show initialization logs too
    if (!initialized) {
      // eslint-disable-next-line no-console
      console.warn('Warning: firebaseAdmin.initialized is false. Check workflow logs for initialization source messages.');
      process.exit(1);
    }
    process.exit(0);
  }, 1500);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Error requiring firebaseAdmin:', err && err.message ? err.message : err);
  process.exit(2);
}
