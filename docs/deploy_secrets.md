# Deploying Firebase credentials and secrets

This document shows recommended ways to provide the Firebase service account to the server at runtime.

Recommended (preferred)

- Upload the service account JSON to Google Secret Manager.
- Give your runtime service account `roles/secretmanager.secretAccessor` for that secret.
- Set these environment variables in your host/deployment config:
  - `FIREBASE_SECRET_NAME` (e.g. `subtrax-firebase-key`)
  - `FIREBASE_PROJECT_ID` (your GCP project id, e.g. `subtrax-4964f`)

The application (`server/firebaseAdmin.js`) will fetch the secret at startup.

Fallbacks

If you cannot use Secret Manager, the server also supports these alternatives (in order of preference):

1) `FIREBASE_SERVICE_ACCOUNT_JSON`
   - Set the entire service account JSON as a single environment variable value.
   - Example (bash):
     ```bash
     export FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account", ... }'
     ```
   - Note: many provider UIs don't like multi-line values; quoting and escaping may be required.

2) `FIREBASE_SERVICE_ACCOUNT_BASE64`
   - Base64-encode the JSON and set it as an env var. This avoids multiline issues.
   - Create the value locally:
     ```powershell
     $json = Get-Content 'C:\Users\DELL\.secrets_backup\subtrax-4964f-b4f3e5805056.json' -Raw
     $b64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($json))
     # then paste $b64 into your host secret field for FIREBASE_SERVICE_ACCOUNT_BASE64
     ```
   - The server will decode and initialize Firebase from this value.

3) `GOOGLE_APPLICATION_CREDENTIALS`
   - Point to a file path on the host containing the credentials. Use only if your host supports writing files from secrets.

4) Application Default Credentials (ADC)
   - If the runtime environment provides ADC (e.g., GCE/GKE/Cloud Run with appropriate SA scopes), the server will initialize with `admin.credential.applicationDefault()`.

Quick host examples

- GitHub Actions: use `google-github-actions/get-secretmanager-secrets` to fetch at runtime and set envs for the job.
- Render / Vercel: prefer Secret Manager + grant runtime SA access; or set `FIREBASE_SERVICE_ACCOUNT_BASE64` in the environment.

Security notes

- Do NOT commit the JSON anywhere in the repo.
- Rotate keys regularly and use Secret Manager versions to roll over without downtime.
- Limit secret access to only the runtime service account.

If you'd like, I can add GitHub Actions examples or Render/Vercel step-by-step snippets next.

GitHub Actions: automated remote upload (zero local steps)

If you prefer not to run `gcloud` locally, you can use the included GitHub Actions workflow `./.github/workflows/auto_upload_firebase_secret.yml` to upload the Firebase service account JSON into Secret Manager.

Steps:

1. Add these repository secrets (Repository -> Settings -> Secrets -> Actions):
   - `GCP_SA_KEY` - JSON key for a short-lived GCP service account that has `roles/secretmanager.admin` in the target project. Keep this key secure and rotate/delete it after use.
   - `FIREBASE_ACCOUNT_JSON` - the Firebase service account JSON (the full JSON text) that you want to store in Secret Manager.

2. From the Actions tab, run the workflow "Upload Firebase service account to Secret Manager" (or use `workflow_dispatch`). Provide `project` and `secret_name` inputs or accept the defaults.

3. The workflow will create the secret (if needed) and add the JSON as a new version. It outputs the secret path. After it finishes, set your runtime environment variables:

   - `FIREBASE_SECRET_NAME` = the `secret_name` you used (e.g. `subtrax-firebase-key`)
   - `FIREBASE_PROJECT_ID` = the GCP project id

Security note: GitHub Actions will log limited info. Make sure `GCP_SA_KEY` is scoped to a temporary key and revoked after use if possible.