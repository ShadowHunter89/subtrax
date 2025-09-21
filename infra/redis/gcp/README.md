# GCP Redis Terraform module

This folder contains a minimal Terraform scaffold to provision a Google Cloud Memorystore Redis instance.

Prerequisites:
- Terraform installed (>=1.0)
- `gcloud` installed and authenticated, or a service account key configured for Terraform

Quick run:

```bash
cd infra/redis/gcp
terraform init
terraform apply -var-file=example.tfvars
```

After apply, outputs `host` and `port` will be printed. Compose them into `REDIS_URL` and store in your host env or CI secrets.

Security note: ensure your service account used by Terraform has least privilege (compute/network/redis permissions as needed) and rotate keys.
