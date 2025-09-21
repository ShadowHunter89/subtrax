// server/config/firebase-admin.js
// Firebase Admin SDK configuration for server-side operations
const admin = require('firebase-admin');

// Service account configuration - use environment variables in production
const serviceAccount = {
  type: "service_account",
  project_id: "subtrax-4964f",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || "0584aed4d854dfe2aec7015fe5a1a1e6e6a5df71",
  private_key: process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrQ72dzHp3JEpz\ncntA1OVx+Ecv/kYInMDV0ntXaPWFqv/vHNE70M2+zvZ4NXe55EHCy4XbzR1PiH80\nzGfVxCxIUJLSA8ycrHxi/4zGxE/hAYxaQ9kAtXYWtIQ41wOiMRxjqJtLowSnO/bb\nCjlA002gmPbWZXg8recjz32CfRBaqhSXUBBEfENr/InWpaLZcZPRxBPCEIknslPl\nyezvv/t7sxRRU9fii0xsBRQXHwAFkqfLW8gZhKNRY8VQcbunLcAWC/Y63szral5o\nbJmN7Iyb55+Yyp5k5VIDLhofrV9wmwKm6F45COdzxuJLN/RcCJVV5JVbeCQgafMi\nW1jR+qB3AgMBAAECggEABK8rIgREOzr+YE76yQipp+bbB5iEUNr8uTxzDC5+PKQz\nMNaQcHrjDbt6aUpJFogENnA7nonrKdA5bnfCxUmCzo2Jnn3lHEnpcwm7T3pyFtzk\nelmNt2O/MZrJXQagflCqjp0/dh+k0nAk7dPHQhslbeWRJscKtVoqTsPvkmCaUGh3\n6e4ZzCQ9v4+HXWGyvaQNj6vCKzr5JXJnDmNCdX3Gxn59tCx3Jb7gqZ8xIZwqdEyk\nFuY8p2Sk8e5SbiIjjHGaLKoowwymUdpsWP8efldKagniQ4Gf/wexwQJ0eOSIBTPJ\nhjpLgJHjwgRg+2C5z5EhwMBA1Q7SMO8KTSJjNhtqCQKBgQDx2uKcZ3V8cYpdVzB0\neK7uWclBHyIuTgspo+cUWKXcn4SuwdWTjTXT0unqVfsEOiR/nokaEzuet/VL7wjo\ndrX/AbQGzchIo0W/Uh4k3Jms7qwlZrH/W5KgA4ZJsEt3i/fw4oBgoI6BAhcL1Mch\nVysEDi8BApcHtYl4EezKpRjfOQKBgQC1R/U9RccGauACztrrxtUvCok8CYZmyW+u\nG5DkDRteKTFwZB+/Vx2SO94AS1hjad9bAyUmL81uxfPQXNRXJAVpfo1Jum+nRYmi\nz9S0m+6UXW0iczycX0WWQ1IypMusqXd6Tq3d6NQK6Vkl1RlSXsb06XLxfbRNXg/K\nhF9eC/HNLwKBgQCburxFx1xgB9/3IEgkBv1knk23b+ubc0c+xbnqYPZTrCdMO6Vh\nQADT5zAVYs2huCp+Pj+7mXy/Q2ZgQYcz4BRqIdegtepr0y369k5Qn/cX4grYflrI\nuVcdT4etdSXy0R6SbdYJ4fhAW28pgBXEgxNApj1f4iILpbnhpXEaPtpYCQKBgHpu\nB7WC+6Bc679ZvsZ/uZiUkAyJDkk6//7hRSCPrY0RWv9hz4MlLaaGYi9ms2IorZ1E\n6YD5xc9rR3fQSeQ0Qqd1vawuipu4vfTEUg5MRXvUARHELAob2d5axxfG7ntE1Jk4\nq/nz9ckMwZVobzqPIeVkCKoJ0Ixz20xVzCazAHInAoGADLfRvicZep1SlmFwwgZq\nTQqtJWeGPY+UP5ZKUgkOGqXarTEZ6jwtP7UeULUCMw8HveoO/N0NryMKf1Zly2Ye\n3XTkI59VU2IJyJOTvabepDx7eRQSTkud8K1eQqd/9Cn+DGBUDwQElv6LQFgFlR/a\n87c/oKLHROzZEBPBdsfUSRo=\n-----END PRIVATE KEY-----\n",
  client_email: process.env.FIREBASE_CLIENT_EMAIL || "secret-uploader@subtrax-4964f.iam.gserviceaccount.com",
  client_id: process.env.FIREBASE_CLIENT_ID || "109373183728030860797",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/secret-uploader%40subtrax-4964f.iam.gserviceaccount.com`,
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: "subtrax-4964f"
  });
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };