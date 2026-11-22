# mm-pickupline-gen
This project is for PickUp Line generator project with Myanmar Language

## Production on Cloudflare and Atlas

The Worker serves the Vite build and routes `/api/*` to one named Cloudflare Container. The container runs the existing Express API and uses Mongoose to connect to Atlas. It sleeps after ten idle minutes, so the first API request after an idle period can take longer. The deployment requires a Workers Paid account with Containers enabled.

### First deployment

1. Enable a workers.dev subdomain in the target account. Create an Atlas database user with `readWrite` on the application database only. Include that database name in the Atlas TLS connection string, for example `mongodb+srv://USER:PASSWORD@CLUSTER/pickuplines`. Configure Atlas network access for the container's outbound path. For a restricted Atlas IP access list, arrange fixed egress or a private network path accessible from the container before cutover.
2. If moving existing records, back up the source database and restore into a fresh Atlas database using MongoDB Database Tools. Keep admin edits paused during the final copy. Compare collection counts, including approved and legacy records. The deployment never seeds the database.
3. In GitHub Settings → Environments, create `production`. Add variables `CLOUDFLARE_ACCOUNT_ID` and `APP_URL` (initially `https://mm-pickupline-gen.<your-subdomain>.workers.dev`). Add variables `INFISICAL_IDENTITY_ID` and `INFISICAL_PROJECT_ID`. Configure the Infisical Cloud machine identity for GitHub OIDC, binding the subject to `repo:zeroday27/mm-pickupline-gen:environment:production` and granting read access only to `prod:/pickup`. Store `CLOUDFLARE_API_TOKEN`, `MONGODB_URI`, `ADMIN_USERNAME` and `ADMIN_PASSWORD` there. Scope the token to the target account with Worker script and Containers deployment access. Store the Atlas URI only in server-side secrets. Restrict deployments to `main` and configure required reviewers if manual release approval is desired.
4. After confirming Workers Paid and Atlas connectivity, set the repository variable `ENABLE_PRODUCTION_DEPLOY=true`. Require the security checks and the `check` job on pull requests to main. It builds the frontend, bundles the Worker, builds the production API image and tests admin authentication and recommendations against a disposable MongoDB. A passing main build deploys the Worker, image, assets and runtime secrets together. The final smoke check loads the site and queries Atlas through the public API.
5. Verify a recommendation and admin login on workers.dev before moving the existing hostname to the Worker. Keep the Lightsail instance and backup available through cutover. To roll back a code release, revert its commit and deploy the last working source through the same pipeline. If switching traffic back to Lightsail, reconcile writes made in Atlas since cutover first.

### Dependency inventory

CI stores a CycloneDX SBOM as the `pickup.cdx.json` workflow artifact. To enable submission on main, configure the repository variable `DEPENDENCY_TRACK_URL` with your HTTPS instance URL, set `DEPENDENCY_TRACK_PROJECT_UUID` for the existing project, and grant the production Infisical identity read access to `prod:/pickup-inventory/DEPENDENCY_TRACK_API_KEY`. Use a project-scoped upload key.

## Docker Quick Start

Run app stack:

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:3000`

## Staging Ingestion (Docker-first)

Sample staging file:

`backend/data/staging/pickuplines.sample.json`

Dry run ingest (no insert):

```bash
docker compose --profile tools run --rm ingest
```

Real insert:

```bash
docker compose --profile tools run --rm ingest npm run ingest:staging -- --file /app/backend/data/staging/pickuplines.sample.json
```

Use your own file:

```bash
docker compose --profile tools run --rm ingest npm run ingest:staging -- --file /app/backend/data/staging/your-file.json
```

## Daily log
2026-02-18: .

2026-02-18: !

2026-02-19: .

2026-02-19: !

2026-02-21: .

Use `dev` for development. Promote reviewed changes to `stag` for private Cloud Run staging, then to `main` for release. Production deployment requires the existing enable flag.
