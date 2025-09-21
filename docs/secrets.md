# Secrets & Firebase Admin

Recommended flow:

1. Upload your service-account JSON to Secret Manager (or your host's secret store).
2. Set these env vars in your runtime:
   - `FIREBASE_SECRET_NAME` (example: `subtrax-firebase-key`)
   - `FIREBASE_PROJECT_ID` (example: `subtrax-4964f`)
3. The server will automatically fetch the secret at startup and initialize Firebase Admin.

Examples:

GitHub Actions can fetch the secret from Google Secret Manager or you can provide the JSON via repository secrets (not recommended).

Render/Other hosts: grant runtime service account permission to access the secret and the server will use the service account identity to fetch the secret.
