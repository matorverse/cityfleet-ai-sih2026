# Deploy CityFleet AI on Render

This project runs as **two Render services**: a Node API (Express + Socket.IO) and a static frontend (Vite build). The optional Python `ai-service/` is **not** required for the demo.

## Option A — Blueprint (recommended)

1. Push this repository to GitHub (already done if you use the remote in `README`).
2. Open [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**.
3. Connect the `cityfleet-ai-sih2026` repository (or your fork).
4. Render reads [`render.yaml`](../render.yaml) and creates:
   - **cityfleet-api** — Web Service (Node)
   - **cityfleet-web** — Static Site
5. Click **Apply**. Wait for both services to finish deploying.
6. Open the **cityfleet-web** URL (e.g. `https://cityfleet-web.onrender.com`).

The static site build receives `VITE_API_URL` automatically from the API service’s public URL.

## Option B — Manual setup

### 1. API (Web Service)

| Setting | Value |
|--------|--------|
| **Environment** | Node |
| **Root directory** | *(repo root)* |
| **Build command** | `npm install` |
| **Start command** | `npm run start -w backend` |
| **Health check path** | `/api/health` |

**Environment variables**

| Key | Value |
|-----|--------|
| `NODE_VERSION` | `20` |
| `SIMULATION_TICK_MS` | `1000` (optional) |

Note the service URL, e.g. `https://cityfleet-api.onrender.com`.

### 2. Frontend (Static Site)

| Setting | Value |
|--------|--------|
| **Root directory** | *(repo root)* |
| **Build command** | `npm install && npm run build -w frontend` |
| **Publish directory** | `frontend/dist` |

**Environment variables**

| Key | Value |
|-----|--------|
| `VITE_API_URL` | `https://cityfleet-api.onrender.com` (your API URL, no trailing slash) |

Redeploy the static site whenever the API URL changes so Vite bakes in the correct value.

## Verify deployment

1. API health: `https://<api-host>/api/health` → `{"status":"ok",...}`
2. Open the static site URL.
3. Confirm the header shows **LIVE SIMULATION** (not stuck on “Connecting…”).
4. Run **1 · Pothole** and **2 · Fleet confirm** from the demo bar.

## Free tier notes

- **Cold starts:** The API sleeps after inactivity. The first load can take 30–60 seconds; refresh if the UI stays on “Connecting…”.
- **In-memory state:** Simulation data resets when the API restarts or redeploys.
- **Single instance:** Do not scale the API horizontally without shared storage; state is process-local.

## Local vs production

| | Local | Render |
|--|--------|--------|
| Frontend | `http://localhost:5173` | Static site URL |
| API | `http://localhost:4000` | Web service URL |
| Config | `.env` / `.env.example` | Render env vars + `VITE_API_URL` at build time |

## Troubleshooting

| Symptom | Fix |
|--------|-----|
| UI stuck on “Connecting…” | API cold start or wrong `VITE_API_URL`. Check `/api/health`, then rebuild the static site with the correct URL. |
| CORS / socket errors | Ensure `VITE_API_URL` uses `https://` and matches the API host exactly. |
| Build fails on Node version | Set `NODE_VERSION=20` or rely on [`.node-version`](../.node-version). |
| Demo buttons do nothing | API not running or asleep; wake it via `/api/health` then retry. |
