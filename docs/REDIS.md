# Redis provisioning and local development

This project uses Redis for webhook idempotency and reconciliation. Use a managed Redis for production/staging and run a local instance for development.

Local dev options

- Docker Compose (provided):

  ```bash
  docker compose -f docker-compose.redis.yml up -d
  # then set env in your shell (PowerShell):
  $env:REDIS_URL = 'redis://127.0.0.1:6379'
  ```

- Run a local Redis binary if you prefer.

Production/staging

- Provision a managed Redis (Cloud Memorystore, AWS Elasticache, Redis Labs).
- Configure your host env `REDIS_URL` with the proper host, port and authentication.

Example `REDIS_URL`:
```
redis://:password@redis-host.example.com:6379
```

GitHub Actions

The CI contains an `integration-tests-with-redis` job that starts a Redis service and runs server tests using `REDIS_URL=redis://127.0.0.1:6379`.

Security

- Do not commit password or hostnames into the repo. Use your host's secret storage or GitHub Actions secrets for storing connection strings.

*** End File