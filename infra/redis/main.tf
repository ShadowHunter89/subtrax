/*
Basic Terraform scaffolding for provisioning a managed Redis instance.
This is a template — choose your cloud provider module (GCP, AWS, Azure) and fill in provider configuration.
*/
terraform {
  required_version = ">= 1.0"
}

provider "null" {}

output "note" {
  value = "This is a placeholder. Replace with your provider (google_redis_instance, aws_elasticache_cluster, etc.)"
}
