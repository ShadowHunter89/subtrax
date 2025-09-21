variable "project_id" {
  type = string
  description = "GCP project id"
}

variable "region" {
  type = string
  default = "us-central1"
}

variable "instance_name" {
  type = string
  default = "subtrax-redis"
}

variable "memory_size_gb" {
  type = number
  default = 1
}
