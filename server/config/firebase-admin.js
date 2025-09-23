// server/config/firebase-admin.js
// Firebase Admin SDK configuration for server-side operations
// Delegate to central firebaseAdmin initializer to avoid duplicate initialization
const { admin, getDb, initialized } = require('../firebaseAdmin');

module.exports = { admin, db: getDb, initialized };