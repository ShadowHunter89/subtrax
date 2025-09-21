# Security & secret handling

If a secret (API key, service account JSON, private key) is accidentally committed:

1. Immediately rotate/revoke the leaked secret in the provider console (Google Cloud, Stripe, etc.).
2. Remove the file from the working tree and add its path to `.gitignore` (done).
3. After rotation, purge the secret from git history using `git-filter-repo` or `BFG` and force-push.
4. Notify collaborators and require them to reclone the repository.

This repository includes a non-destructive GitHub Action which scans pushes and PRs for secrets using gitleaks: `.github/workflows/secret-scan.yml`.

For step-by-step purge guidance, see `scripts/purge-secret-guide.ps1`.
