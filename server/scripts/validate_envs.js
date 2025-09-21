// Simple env validator for CI/manual runs
const requiredAny = [
  'FIREBASE_SERVICE_ACCOUNT_BASE64',
  'FIREBASE_SERVICE_ACCOUNT_JSON',
  'FIREBASE_SECRET_NAME'
];

function hasAny() {
  return requiredAny.some((k) => !!process.env[k]);
}

if (!hasAny()) {
  console.error('No Firebase credentials found in environment. Provide one of:', requiredAny.join(', '));
  process.exit(2);
}

console.log('Firebase credential environment found.');
process.exit(0);
