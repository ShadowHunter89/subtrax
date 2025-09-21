# Deployment and production readiness

This document describes the steps to finish provisioning and deploying Subtrax in a production-ready way.

## 1) Firebase service account (Secret Manager)

We recommend storing the Firebase service account JSON in Google Secret Manager. There is a manual workflow and an automated GitHub Actions workflow included.

- Option A (recommended): Use the included GitHub Action `upload_firebase_secret.yml`.
  - Create repository secrets:
    - `GCP_SA_KEY` — the JSON key of a GCP service account with `roles/secretmanager.admin` for the target project.
    - `FIREBASE_ACCOUNT_JSON` — the Firebase service account JSON content.
    - `FIREBASE_PROJECT_ID` — the GCP project id.
  - Run the workflow under Actions → Upload Firebase Secret.
  - The workflow writes a secret named `firebase-service-account` by default.

- Option B: Set runtime environment variables directly on your host:
  - `FIREBASE_SERVICE_ACCOUNT_BASE64` — base64 encoded JSON, or
  - `FIREBASE_SERVICE_ACCOUNT_JSON` — raw JSON string, or
  - set `GOOGLE_APPLICATION_CREDENTIALS` to point to a file on the host containing the JSON.

## 2) CI smoke check for Firebase init

The CI workflow `ci_smoke.yml` contains a `smoke-firebase-init` job. To enable it, set either:
- `FIREBASE_SERVICE_ACCOUNT_BASE64` (repo secret), or
- `FIREBASE_SECRET_NAME` and `FIREBASE_PROJECT_ID` and `GCP_SA_KEY` (repo secrets) — the workflow will authenticate and pull the secret from Secret Manager then run the smoke check.

The smoke check runs `server/scripts/checkFirebaseInit.js` which verifies the `firebaseAdmin` initializer can initialize using available credentials.

## 3) Redis for idempotency and reconciliation

Idempotency and reconciliation rely on Redis. Provision a managed Redis instance (Cloud Memorystore, Redis Labs, AWS Elasticache) and set the `REDIS_URL` environment variable in staging/production.

Example `REDIS_URL`:
```
redis://:password@redis-host.example.com:6379
```

## 4) EasyPaisa & JazzCash production wiring

- JazzCash: already implemented in `server/payments/jazzcashAdapter.js`. Provide production credentials via env vars:
  - `JAZZCASH_MERCHANT_ID`, `JAZZCASH_PASSWORD`, `JAZZCASH_INTEGRITY_SALT`, `JAZZCASH_CHECKOUT_URL`.

- EasyPaisa: `server/payments/easypaisaAdapter.js` includes a sandbox bypass when `EASYPAYSA_API_KEY` is missing. To enable production, supply `EASYPAYSA_API_KEY` and set `EASYPAYSA_CHECKOUT_URL`.

## 5) Deployment hosts

The app is host-agnostic. Set these envs for your host:
- `FRONTEND_BASE_URL` or `FRONTEND_ALLOWED_ORIGINS` (server) / `REACT_APP_FRONTEND_BASE_URL` (client)
- `REDIS_URL`
- Firebase secrets as described above

## 6) Cleanup

After verifying all hosts and secrets are working and any remaining developers have recloned, you can remove the backup artifacts (`client-git-backup.git`, `.git_backup`). We removed those locally for you.

## 7) Trouble-shooting

- If CI `smoke-firebase-init` fails: check workflow logs for which initialization path was attempted (Secret Manager vs base64 vs JSON vs ADC) and ensure secrets are present and correct.
- If webhooks fail verification: confirm provider keys and webhook secrets are configured in env variables.

If you'd like I can also add provider-specific environment examples or a terraform script to automate Redis/Secret Manager provisioning.

## Quick commands (PowerShell)

1) Provision GCP Redis using `gcloud` helper (requires gcloud SDK and permissions):

```powershell
# run with your project and desired region
.\scripts\create_gcp_redis.ps1 -ProjectId my-project -Region us-central1 -InstanceId subtrax-redis -MemoryGb 1
```

2) Encode firebase service account JSON to base64 for repo secret:

```powershell
.\scripts\encode_firebase_base64.ps1 -FilePath path\to\service-account.json | Set-Clipboard
# then paste into GitHub repo secret FIREBASE_SERVICE_ACCOUNT_BASE64
```

3) Upload firebase JSON via the GitHub Actions workflow (after adding secrets `GCP_SA_KEY`, `FIREBASE_ACCOUNT_JSON`, `FIREBASE_PROJECT_ID`)

Use the Actions → Upload Firebase Secret workflow in GitHub.

