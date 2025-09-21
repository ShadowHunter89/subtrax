Redis provisioning (Terraform)
=============================

This folder contains a placeholder Terraform module to provision a managed Redis instance. Pick your cloud provider and replace the module with the appropriate resource:

- Google Cloud: `google_redis_instance` (Cloud Memorystore)
- AWS: `aws_elasticache_replication_group` or `aws_elasticache_cluster`
- Azure: Azure Cache for Redis

After provisioning, set `REDIS_URL` in your runtime environment as `redis://:password@host:6379`.
