# mm-pickupline-gen
This project is for PickUp Line generator project with Myanmar Language

## Production on Cloud Run and Atlas

The public generator and authenticated admin share one Cloud Run service.
The release hostname is `pickupline-mm.yangonai.com`. Reviewed changes to
`main` deploy after CI and security checks pass. To apply a runtime secret
change, run `gh workflow run deploy.yml --ref main`.

To queue a reviewed PR, run `gh pr merge NUMBER --auto --merge`. GitHub waits
for the required checks on an up-to-date branch. After deployment, CI checks
the public hostname, calls the generator, and verifies admin authentication.

The in-place promotion keeps the service `pickup-staging`, Atlas database
`pickup_staging`, and Infisical `staging:/pickup` as live resources.
The GitHub deployment environment named `staging` admits only `main`.
See [Cloud Run operations](deploy/cloud-run-staging/README.md).

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

Use `dev` for development and `main` for live releases.
