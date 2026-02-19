# mm-pickupline-gen
This project is for PickUp Line generator project with Myanmar Language

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
