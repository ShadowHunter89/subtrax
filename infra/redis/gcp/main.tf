/*
GCP Redis (Cloud Memorystore) Terraform scaffold.
Replace variables and uncomment provider configuration when using.
*/
/*
provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_redis_instance" "default" {
  name           = var.instance_name
  tier           = "STANDARD_HA"
  memory_size_gb = var.memory_size_gb
  region         = var.region
  alternative_location_id = var.fallback_region
}

output "host" {
  value = google_redis_instance.default.host
}

output "port" {
  value = google_redis_instance.default.port
}
*/
