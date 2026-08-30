# CityFleet AI — SIH26124 MVP

CityFleet AI is a runnable vertical-slice prototype for the **AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet** problem. It turns simulated bus telemetry and camera detections into geotagged events, fuses independent sightings, updates road health, explains maintenance priority, and sends live updates to a GIS command center.

All locations, bus registrations, footage panels and observations are **demo/simulated data**.

## Quick start

Prerequisite: Node.js 20+ (Node 24 is tested). Python 3 is only needed if you want to run the optional AI service separately.

```powershell
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The API runs on port `4000` and the command center connects over Socket.IO.

To run the provider contract on its own:

```powershell
python ai-service/main.py
```

No model or database download is required for the MVP. Copy `.env.example` to `.env` if you need different ports or tick timing.

## Two-minute judge demo

1. Open **Command center** and use **1 · Pothole**. A new unverified geotagged road issue appears.
2. Use **2 · Fleet confirm**. Buses 004, 007 and 009 observe the same MG Road issue; the engine clusters it, raises fused confidence, sets it confirmed, recalculates priority and reduces road health.
3. Select the marker or incident card. The evidence drawer shows every observing bus and the explainable prioritization factors.
4. Use **3 · Congestion**, **4 · Road sign**, or **5 · Waterlogging** to demonstrate different detection classes.
5. Open **Operations** to acknowledge/resolve work, then **Analytics** to inspect event mix and road health.

The demo bar also starts, pauses, resets and changes the speed of all simulated buses. A reset resets vehicle positions, not the deliberately generated event session; refresh the browser/API process for a completely fresh seeded dataset.

## What is implemented

- 10 route-bound simulated buses across Bengaluru-style routes, live location updates and route layers.
- Express + Socket.IO backend with a deterministic scenario engine and real front-end updates.
- Structured data model for buses, routes, roads, events, observations, confirmations and alerts.
- Spatial/time duplicate grouping, independent-bus confidence fusion, verification status, road-health recalculation and an explainable priority score.
- Event/bus evidence drawers, operations actions, map markers, health overlays, analytics and an explicitly labelled simulated camera feed.
- `DetectionProvider` abstraction plus optional Python `/infer` service. The built-in demo provider is **not production AI**; it returns reproducible inference-shaped responses so the integration can be judged reliably.
- PostgreSQL/PostGIS-compatible schema in [database/schema.sql](database/schema.sql), with a no-configuration in-memory repository for the local judging demo.

## Repository layout

```text
frontend/     React + TypeScript + Vite command center
backend/      Express + Socket.IO simulator and intelligence engine
ai-service/   Swappable Python inference-provider contract
shared/       Cross-service TypeScript entities
database/     PostgreSQL/PostGIS schema
docs/         Architecture and existing SIH research material
```

## API overview

- `GET /api/snapshot` — live dashboard state.
- `POST /api/simulation/start|pause|reset` — simulator control.
- `POST /api/simulation/speed` `{ "speed": 1|2|4 }` — time multiplier.
- `POST /api/demo/pothole|confirmation|congestion|sign|water` — deterministic demo scenarios.
- `POST /api/events/:id/acknowledge|resolve` — operational action.
- Socket.IO `snapshot` — emitted for telemetry, event and scenario changes.

## Validation

```powershell
npm test
npm run build
```

The unit suite covers distance/severity decisions, multi-bus confidence fusion and priority escalation. The normal running demo is the end-to-end path: simulator → provider-shaped detection → event intelligence → live Socket.IO dashboard.

## Privacy and operational note

The prototype does not use personal data, ANPR or real camera footage. A real rollout would require an approved privacy impact assessment, purpose limitation, role-based access control, evidence retention/deletion policy, secure device identity, data minimization, audit trails and municipal governance.

See [docs/architecture.md](docs/architecture.md) for the architecture, fusion method and production handoff points.
