# Log Monitoring Architecture

## Overview
This setup implements the **PLG Stack** (Promtail, Loki, Grafana) for logs and **Prometheus** for metrics. All services run in Docker containers defined in `monitoring/docker-compose.yml`.

## 1. Log Flow (Qualitative Data)
This pipeline captures application logs (what it says).

### Source: Backend Application (`smc_backend`)
- **Role**: Writes logs to `stdout` (standard output) and `stderr` (standard error).
- **Mechanism**: Standard `console.log()` calls in Node.js.
- **Docker Integration**: Docker captures these streams and saves them as JSON log files on the host machine (typically in `/var/lib/docker/containers/...`).

### Collector: Promtail (`smc_promtail`)
- **Role**: Agent that reads Docker log files from the host.
- **Configuration**: `monitoring/promtail/promtail-config.yaml`
- **Mechanism**: Mounts the host's log directory (`/var/lib/docker/containers`) and "tails" the files, pushing new entries to Loki.

### Aggregator: Loki (`smc_loki`)
- **Role**: Log aggregation system (like a database for logs).
- **Mechanism**: Receives streams from Promtail and indexes them by metadata labels (e.g., `app=backend`, `env=production`) rather than full text, making it lightweight and fast.
- **Access**: Runs on port `3100`.

### Visualization: Grafana (`smc_grafana`)
- **Role**: Dashboard UI.
- **Usage**: Query logs in the "Explore" tab using the Loki datasource (e.g., `{job="docker"}`).

## 2. Metrics Flow (Quantitative Data)
This pipeline captures performance metrics (how it performs).

### Source: Backend Metrics
- **Role**: Application explicitly measures its internal state.
- **Mechanism**: Uses `prom-client` in `backend/src/index.ts` to track request duration, counters, etc.
- **Endpoint**: Exposes metrics at `http://localhost:3001/metrics` in Prometheus exposition format.

### Collector: Prometheus (`smc_prometheus`)
- **Role**: Scrapes metrics from targets at regular intervals.
- **Configuration**: `monitoring/prometheus/prometheus.yml` defines the target `backend:3001` and scrape interval (15s).

### Visualization: Grafana
- **Role**: Queries Prometheus to display graphs and gauges (e.g., "Requests per Second", "Error Rate").

## Service Relationships Diagram
```mermaid
graph LR
    subgraph "Docker Host"
        Backend[Backend App] -- writes to --> Stdout[Stdout/Stderr]
        Backend -- exposes --> Metrics[/metrics endpoint]
    end

    subgraph "Monitoring Stack"
        Stdout -- read by --> Promtail
        Promtail -- pushes to --> Loki
        Metrics -- scraped by --> Prometheus
        
        Loki -- queried by --> Grafana
        Prometheus -- queried by --> Grafana
    end
```
