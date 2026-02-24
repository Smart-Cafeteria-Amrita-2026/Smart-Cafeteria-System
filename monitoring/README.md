# Monitoring with Prometheus & Grafana

This folder provides a local docker-compose setup to run Prometheus and Grafana and scrape metrics from the backend.

Quick start:

1. Install backend deps and build:
   - cd backend
   - pnpm install
   - pnpm build

2. From the `monitoring` folder run:
   - docker compose up --build

Services:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (anonymous access enabled)
- Backend metrics: http://localhost:3001/metrics

Notes:
- Grafana will automatically load the Prometheus datasource and the sample dashboard defined in `grafana/dashboards`.
- If you prefer to run the backend outside Docker, update `monitoring/prometheus/prometheus.yml` targets to `host.docker.internal:3001` or run Prometheus locally and point it to the backend.
