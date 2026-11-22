terraform {
  required_version = ">= 1.6"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }
}

locals {
  project = "yangonai"
  region  = "asia-southeast1"
  name    = "pickup-staging"
  labels  = { application = "mm-pickupline-gen", environment = "staging" }
}

provider "google" {
  project = local.project
  region  = local.region
}

resource "google_compute_network" "staging" {
  name                    = local.name
  auto_create_subnetworks = false
}
resource "google_compute_subnetwork" "staging" {
  name          = local.name
  network       = google_compute_network.staging.id
  ip_cidr_range = "10.42.0.0/24"
}
resource "google_compute_address" "egress" {
  name   = local.name
  labels = local.labels
}
resource "google_compute_router" "staging" {
  name    = local.name
  network = google_compute_network.staging.id
}
resource "google_compute_router_nat" "staging" {
  name                               = local.name
  router                             = google_compute_router.staging.name
  nat_ip_allocate_option             = "MANUAL_ONLY"
  nat_ips                            = [google_compute_address.egress.self_link]
  source_subnetwork_ip_ranges_to_nat = "LIST_OF_SUBNETWORKS"
  subnetwork {
    name                    = google_compute_subnetwork.staging.id
    source_ip_ranges_to_nat = ["ALL_IP_RANGES"]
  }
}

resource "google_artifact_registry_repository" "staging" {
  location      = local.region
  repository_id = local.name
  format        = "DOCKER"
  labels        = local.labels
}

resource "google_service_account" "runtime" {
  account_id = "pickup-staging-runtime"
}
resource "google_service_account" "deploy" {
  account_id = "pickup-staging-deploy"
}

resource "google_iam_workload_identity_pool" "staging" {
  workload_identity_pool_id = "pickup-staging"
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.staging.workload_identity_pool_id
  workload_identity_pool_provider_id = "github"
  attribute_mapping                  = { "google.subject" = "assertion.sub" }
  attribute_condition = join(" && ", [
    "assertion.repository_id == '880826703'",
    "assertion.repository_owner_id == '86004494'",
    "assertion.sub == 'repo:zeroday27/mm-pickupline-gen:environment:staging'",
    "assertion.ref == 'refs/heads/stag'",
    "assertion.workflow_ref == 'zeroday27/mm-pickupline-gen/.github/workflows/deploy.yml@refs/heads/stag'"
  ])
  oidc { issuer_uri = "https://token.actions.githubusercontent.com" }
}

resource "google_service_account_iam_member" "github" {
  service_account_id = google_service_account.deploy.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principal://iam.googleapis.com/${google_iam_workload_identity_pool.staging.name}/subject/repo:zeroday27/mm-pickupline-gen:environment:staging"
}

resource "google_cloud_run_v2_service" "staging" {
  name                = local.name
  location            = local.region
  deletion_protection = false
  labels              = local.labels
  template {
    service_account = google_service_account.runtime.email
    scaling {
      min_instance_count = 0
      max_instance_count = 1
    }
    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"
      resources {
        limits   = { cpu = "1", memory = "512Mi" }
        cpu_idle = true
      }
    }
    vpc_access {
      egress = "ALL_TRAFFIC"
      network_interfaces {
        network    = google_compute_network.staging.name
        subnetwork = google_compute_subnetwork.staging.name
      }
    }
  }
  lifecycle {
    ignore_changes = [template[0].containers, template[0].revision, client, client_version]
  }
}

resource "google_cloud_run_v2_service_iam_member" "deploy" {
  for_each = toset(["roles/run.developer", "roles/run.invoker"])
  location = local.region
  name     = google_cloud_run_v2_service.staging.name
  role     = each.value
  member   = "serviceAccount:${google_service_account.deploy.email}"
}

resource "google_service_account_iam_member" "act_as_runtime" {
  service_account_id = google_service_account.runtime.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.deploy.email}"
}
resource "google_artifact_registry_repository_iam_member" "push" {
  location   = local.region
  repository = google_artifact_registry_repository.staging.name
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.deploy.email}"
}

resource "google_secret_manager_secret" "runtime" {
  for_each  = toset(["MONGODB_URI", "ADMIN_USERNAME", "ADMIN_PASSWORD"])
  secret_id = "${local.name}-${lower(replace(each.key, "_", "-"))}"
  labels    = local.labels
  replication {
    auto {}
  }
}
resource "google_secret_manager_secret_iam_member" "read" {
  for_each  = google_secret_manager_secret.runtime
  secret_id = each.value.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.runtime.email}"
}
resource "google_secret_manager_secret_iam_member" "publish" {
  for_each  = google_secret_manager_secret.runtime
  secret_id = each.value.id
  role      = "roles/secretmanager.secretVersionAdder"
  member    = "serviceAccount:${google_service_account.deploy.email}"
}
output "atlas_allowlist" { value = "${google_compute_address.egress.address}/32" }
output "identity_provider" { value = google_iam_workload_identity_pool_provider.github.name }
output "service_url" { value = google_cloud_run_v2_service.staging.uri }
