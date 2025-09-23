// Central Firebase Admin initializer
// Tries multiple initialization methods in order of preference:
// 1) FIREBASE_SECRET_NAME + FIREBASE_PROJECT_ID -> Secret Manager
// 2) FIREBASE_SERVICE_ACCOUNT_JSON env var containing the JSON string
// 3) FIREBASE_SERVICE_ACCOUNT_BASE64 env var (base64 of JSON) - added fallback
// 4) GOOGLE_APPLICATION_CREDENTIALS (application default credentials)
// 5) local ./config/firebase.json file (development only)
const admin = require('firebase-admin');
let initialized = false;

async function initFromSecretManager(secretName, projectId) {
  // lazy-import to avoid adding dependency unless used
  const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
  const client = new SecretManagerServiceClient();
  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
  const [version] = await client.accessSecretVersion({ name });
  const payload = version.payload.data.toString('utf8');
  const svc = JSON.parse(payload);
  admin.initializeApp({ credential: admin.credential.cert(svc), storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
  initialized = true;
  // eslint-disable-next-line no-console
  console.info('Firebase Admin initialized from Secret Manager:', secretName);
}

(async () => {
  try {
    if (process.env.FIREBASE_SECRET_NAME && process.env.FIREBASE_PROJECT_ID) {
      await initFromSecretManager(process.env.FIREBASE_SECRET_NAME, process.env.FIREBASE_PROJECT_ID);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      try {
        const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
        const svc = JSON.parse(decoded);
        admin.initializeApp({ credential: admin.credential.cert(svc), storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
        initialized = true;
        // eslint-disable-next-line no-console
        console.info('Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT_BASE64');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_BASE64:', e && e.message ? e.message : e);
      }
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const svc = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(svc), storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
      initialized = true;
      // eslint-disable-next-line no-console
      console.info('Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT_JSON');
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({ credential: admin.credential.applicationDefault(), storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
      initialized = true;
      // eslint-disable-next-line no-console
      console.info('Firebase Admin initialized using application default credentials');
    } else {
      // fallback to local file for development
      // eslint-disable-next-line global-require
      const svc = require('./config/firebase.json');
      if (svc) {
        admin.initializeApp({ credential: admin.credential.cert(svc), storageBucket: process.env.FIREBASE_STORAGE_BUCKET });
        initialized = true;
        // eslint-disable-next-line no-console
        console.info('Firebase Admin initialized from local config/firebase.json');
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Firebase Admin initialization failed:', err && err.message ? err.message : err);
  }
})();

function getDb() {
  try {
    if (initialized && admin && admin.firestore) return admin.firestore();
  } catch (e) {
    // ignore
  }
  return null;
}

module.exports = { admin, initialized, getDb };
