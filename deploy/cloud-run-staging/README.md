# Cloud Run staging

Project `yangonai`, region `asia-southeast1`, service `pickup-staging`.
The private service serves the frontend and API from the same origin.
For browser testing with an authorized Google identity, use
`gcloud run services proxy pickup-staging --project=yangonai --region=asia-southeast1 --port=8080`
and open `http://localhost:8080`.

The staging job runs on main after the check and security jobs pass. GitHub
uses OIDC for both Google Cloud and Infisical. The deployer publishes one
image and three Secret Manager versions per release. Each revision references
its image digest and numeric secret versions. Infisical staging at
`/pickup` is the source for the three runtime settings.

## Inventory and cleanup

Keep the local Terraform state and its backup secure. Run the following in
this directory from the checkout that provisioned staging.

```sh
terraform state list
terraform output
terraform plan -destroy -out=cleanup.tfplan
terraform show cleanup.tfplan
```

The state owns the private service and its two IAM grants, image repository,
three secrets and their IAM grants, deployer and runtime service accounts and
bindings, GitHub workload identity pool and provider, VPC, subnet, router,
NAT gateway and reserved address. A destroy removes the staging image archive
and runtime secret versions along with their parent resources.

Before teardown, stop automatic staging deployments and obtain owner approval.
Remove the Atlas access-list entry matching the Terraform `atlas_allowlist`
output and comment `pickup-staging Cloud Run NAT` **before releasing the IP**.
Then apply the reviewed destroy plan and verify the inventory is empty.
Check for residual Cloud Run network interfaces if subnet removal requires
a retry. Google retains some IAM resources in soft-deleted status.

GitHub's staging environment and Infisical project predate this stack.
The staging Atlas login is `pickup_staging_app`, scoped to `readWrite` on
`pickup_staging` in `ygai-cluster0`. Retire that login separately with approval.
Atlas cluster data, shared Google APIs and
Google-managed service agents are outside its state. For a full retirement,
review those separately. Google retains audit and usage records according to
project policy.
