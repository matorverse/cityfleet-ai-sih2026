# SIH 2026 — PROJECT MASTER DOCUMENT & CONTEXT BLUEPRINT
**Problem Statement ID:** SIH26124  
**Problem Statement Title:** AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet  
**Organization:** Bharat Electronics Limited (BEL)  
**Category:** Software | **Theme:** Fitness & Sports / Smart Infrastructure & Urban Mobility  
**Project Codename:** *CityFleet AI / UrbanSense / FleetPulse AI*

---

## 1. Executive Summary & Core Philosophy

### The Big Shift
Traditional urban monitoring relies on fixed CCTV (geographically blind outside camera cones), periodic manual surveys (costly, slow), and citizen complaints (reactive, inconsistent, delayed). 

**The Solution:** Turn existing public transit fleets (buses) into a **distributed, mobile, AI-powered urban sensing grid**. As buses traverse scheduled city routes, edge cameras and AI processors detect road anomalies (potholes, structural damage, waterlogging) and traffic dynamics in real-time, geotagging and transmitting lightweight structured events rather than raw video feeds.

### The 3 Levels of Intelligence
```
   ┌─────────────────────────────────────────────────────────────┐
   │ LEVEL 1: PERCEPTION (Edge Node / On-Bus AI)                 │
   │ "I detect a pothole with confidence 0.88 at GPS [X, Y]"     │
   └──────────────────────────────┬──────────────────────────────┘
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ LEVEL 2: UNDERSTANDING (Fleet Event Fusion Engine)          │
   │ "3 different buses (B17, B23, B31) confirmed defect at RS-4"│
   │ -> Synthesized into Persistent Urban Issue #P-1042           │
   └──────────────────────────────┬──────────────────────────────┘
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ LEVEL 3: DECISION SUPPORT (GIS Command & Prioritization)    │
   │ "Road Health = 42/100. Heavy traffic exposure. Priority: 1" │
   │ -> Actionable maintenance & traffic dispatch orders         │
   └─────────────────────────────────────────────────────────────┘
```

> **North Star Loop:**  
> `OBSERVE → UNDERSTAND → GEOTAG → VERIFY → AGGREGATE → PRIORITIZE → ACT → OBSERVE AGAIN`

---

## 2. System Architecture

```
+-----------------------------------------------------------------------------------+
| LAYER 1: EDGE SENSING NODES (Buses)                                               |
|  [Dashcam / Road Camera] + [GPS / GNSS Module] + [Edge Compute: Jetson / Mini-PC] |
|  - Frame Preprocessing & Optical Flow / Frame Subsampling                         |
|  - Real-time Object & Defect Detection (YOLOv8/v11 fine-tuned for Road Hazards)  |
|  - Vehicle Detection & Density Counting                                           |
|  - Temporal Filter (N-frame persistence threshold to suppress false positives)    |
|  - Store-and-Forward SQLite Buffer (Offline network resilience)                   |
|  - Transmits: JSON Event Payloads + Bounding Box Evidence Snapshot               |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / MQTT (JSON Payloads)
                                           v
+-----------------------------------------------------------------------------------+
| LAYER 2: CENTRAL EVENT INTELLIGENCE BACKEND (FastAPI + PostGIS + Redis)           |
|  - Ingestion Gateway & Authentication                                             |
|  - Deduplication & Spatial-Temporal Clustering (ST-DBSCAN / Road-Segment Snap)   |
|  - Multi-Bus Event Fusion Engine (Observation -> Persistent Issue Promotion)     |
|  - Confidence & Recurrence Matrix Calculator                                      |
|  - Road Health Index (RHI) & Maintenance Priority Scoring Engine                  |
|  - Traffic Density Aggregator & Historical Heatmap Builder                        |
|  - Relational & Geo Storage (PostgreSQL + PostGIS, TimescaleDB, MinIO for Images) |
+------------------------------------------+----------------------------------------+
                                           | REST APIs / WebSockets
                                           v
+-----------------------------------------------------------------------------------+
| LAYER 3: CENTRAL GIS COMMAND & INTELLIGENCE DASHBOARD (React + MapLibre/Deck.gl)  |
|  - Live / Simulated Fleet Map with Real-time GPS Telemetry & Active Routes        |
|  - Interactive Urban Issue Markers (Color-coded by Severity & Verification state)|
|  - Road Segment Health Scoring & Maintenance Priority Matrix                      |
|  - Bus Detail Inspector (Feed simulation, telemetry, detection stream)           |
|  - Issue Deep Dive: Observation history, multi-bus audit trail, image evidence    |
|  - Traffic Flow & Congestion Heatmaps                                             |
|  - Exportable Work Orders for Municipal Authorities                               |
+-----------------------------------------------------------------------------------+
```

---

## 3. Data Schemas & Contracts

### 3.1 Edge Event Payload (`EdgeObservationEvent`)
```json
{
  "event_id": "EVT-2026-0829-10421",
  "bus_id": "BUS-017",
  "route_id": "ROUTE-12A",
  "timestamp": "2026-08-29T10:42:17.320Z",
  "location": {
    "latitude": 28.613939,
    "longitude": 77.209021,
    "altitude_m": 216.4,
    "heading_deg": 142.5,
    "speed_kmh": 34.2
  },
  "detection": {
    "class_name": "pothole",
    "model_confidence": 0.91,
    "severity_hint": "HIGH",
    "bbox_normalized": [0.42, 0.65, 0.28, 0.18],
    "frame_persistence_count": 4
  },
  "evidence": {
    "image_hash": "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    "snapshot_base64_or_s3_url": "s3://fleet-evidence/2026/08/29/EVT-2026-0829-10421.jpg"
  }
}
```

### 3.2 Persistent Urban Issue Schema (`UrbanIssue`)
```json
{
  "issue_id": "ISSUE-P-1042",
  "issue_type": "POTHOLE",
  "status": "VERIFIED_ACTIVE",
  "road_segment_id": "RS-DEL-MG-381",
  "road_name": "Mahatma Gandhi Marg, Sector 4",
  "centroid": {
    "latitude": 28.613945,
    "longitude": 77.209018
  },
  "first_observed_at": "2026-08-29T08:15:10Z",
  "last_observed_at": "2026-08-29T12:04:15Z",
  "observation_count": 3,
  "unique_buses_count": 3,
  "observing_buses": ["BUS-017", "BUS-023", "BUS-031"],
  "fused_confidence": 0.965,
  "severity_score": 8.5,
  "maintenance_priority_score": 88.4,
  "priority_tier": "CRITICAL",
  "traffic_exposure_level": "VERY_HIGH",
  "observations": [
    {
      "observation_id": "EVT-2026-0829-08151",
      "bus_id": "BUS-017",
      "timestamp": "2026-08-29T08:15:10Z",
      "confidence": 0.88,
      "evidence_url": "/api/v1/evidence/EVT-2026-0829-08151.jpg"
    },
    {
      "observation_id": "EVT-2026-0829-09452",
      "bus_id": "BUS-023",
      "timestamp": "2026-08-29T09:45:22Z",
      "confidence": 0.91,
      "evidence_url": "/api/v1/evidence/EVT-2026-0829-09452.jpg"
    },
    {
      "observation_id": "EVT-2026-0829-12041",
      "bus_id": "BUS-031",
      "timestamp": "2026-08-29T12:04:15Z",
      "confidence": 0.86,
      "evidence_url": "/api/v1/evidence/EVT-2026-0829-12041.jpg"
    }
  ]
}
```

---

## 4. Multi-Bus Fusion & Decision Science

### 4.1 Spatial-Temporal Clustering Rule
When a new observation $O_{new} = (\text{lat}, \text{lon}, t, \text{class}, c_{model}, \text{bus})$ arrives:
1. **Candidate Lookup:** Query spatial index (PostGIS `ST_DWithin`) within radius $R \le 15\text{m}$ on the same road segment with matching defect class.
2. **Direction / Vector Alignment:** Verify angle between travel headings ($\Delta \theta \le 60^\circ$ or opposite lane checks).
3. **Fusion Decision:**
   - If match found $\rightarrow$ Append $O_{new}$ to existing `UrbanIssue`, recalculate centroid, update observation count, recalculate fused confidence and priority.
   - If no match found $\rightarrow$ Instantiate tentative `UrbanIssue` (Status: `UNCONFIRMED_SINGLE_PASS`).

### 4.2 Multi-Pass Fused Confidence Formulation
Independent observations from distinct buses increase certainty exponentially:
$$\text{Fused Confidence } C_{fused} = 1 - \prod_{i=1}^{N} (1 - w_i \cdot c_i)$$
Where:
- $c_i$ is the model confidence of observation $i$.
- $w_i = 1.0$ if from a unique bus, or $w_i = 0.6$ if from the same bus on a subsequent pass.
- $N$ is total observation count.

*Example:* 3 observations with $c_1=0.88, c_2=0.91, c_3=0.86$ from 3 distinct buses yield:
$$C_{fused} = 1 - (1 - 0.88)(1 - 0.91)(1 - 0.86) = 1 - (0.12 \times 0.09 \times 0.14) = 1 - 0.001512 = 0.9985 \ (99.8\%)$$

### 4.3 Maintenance Priority Score ($P$)
$$\text{Priority } P = \left( \text{Severity} \times C_{fused} \times T_{\text{exposure}} \times R_{\text{factor}} \right) \cdot V_{\text{context}}$$
Where:
- **$\text{Severity}$** $\in [1, 10]$: Derived from defect dimensions/depth class.
- **$C_{fused}$** $\in [0, 1]$: Multi-bus verified confidence.
- **$T_{\text{exposure}}$** $\in [1, 5]$: Traffic density multiplier (derived from vehicle count / bus ridership on that road).
- **$R_{\text{factor}}$** $\in [1, 2]$: Recurrence multiplier (increases if sightings persist across days).
- **$V_{\text{context}}$** $\in [1.0, 1.5]$: Vulnerability multiplier (e.g., near school zones, hospitals, high-speed flyovers, bus stops).

### 4.4 Road Health Index ($\text{RHI}$)
For a given road segment $S$:
$$\text{RHI}(S) = \max\left(0, 100 - \sum_{k \in \text{Issues}(S)} \left( \text{Severity}_k \times C_{fused, k} \times \text{Weight}_k \right)\right)$$
- **Score 80–100:** Good Condition (Green)
- **Score 50–79:** Moderate Degradation (Yellow)
- **Score < 50:** Critical Maintenance Required (Red)

---

## 5. Technology Stack

| Component | Selected Technology | Rationale |
|---|---|---|
| **Edge Vision & AI** | Python 3.10+, OpenCV, YOLOv8 / YOLOv11 (Ultralytics), ByteTrack | High inference speed (25-45 FPS), strong road defect benchmark support |
| **Edge Runtime & Queue** | SQLite (store-and-forward), Requests / MQTT client | Ensures zero data loss during tunnel / dead-zone transit |
| **Backend Framework** | FastAPI (Python) | High-performance async I/O, native ML model integration, OpenAPI specs |
| **Database & GIS Engine** | PostgreSQL 16 + PostGIS 3.4 | Industry-standard spatial indexing (`GIST`), geodesic spatial math |
| **Caching & Pub/Sub** | Redis | Fast ingestion queue, WebSocket bus telemetry broadcasting |
| **Object Storage (Evidence)** | MinIO / S3 | Lightweight storage for bounding box evidence crops & video snapshots |
| **Frontend Framework** | React 18+ / Vite + TypeScript + Tailwind CSS | High responsiveness, dynamic state management, rich animations |
| **GIS Visualization** | MapLibre GL JS / Deck.gl + Mapbox Vector Tiles | Hardware-accelerated map rendering for 100+ moving buses & heatmaps |
| **Fleet Simulation Engine** | Python simulation harness with real GPX/GeoJSON traces | Reproducible multi-bus synchronized demo without live fleet hardware |

---

## 6. Hackathon Demo Workflow ("The 10-Step Wow Demo")

1. **City Overview:** Open command center showing active city map (e.g. Delhi / Bengaluru / Pune) with 4-6 animated buses moving along actual public routes.
2. **Select Bus 17:** Click Bus 17 $\rightarrow$ camera viewport opens showing onboard forward dashcam footage and real-time telemetry (speed, heading, route).
3. **First Detection:** Bus 17 hits a pothole. Bounding box triggers with `[POTHOLE - Conf: 88%]`.
4. **Geotag & Map Marker:** Event generates instant ping on GIS map as `P-1042 (Unconfirmed - 1 Sighting)`.
5. **Select Bus 23:** Switch to Bus 23 travelling 15 minutes later on the same corridor.
6. **Second Detection:** Bus 23 encounters the same physical location. AI detects pothole (`Conf: 91%`).
7. **Fusion In Action:** System alerts: *"Observation fused with P-1042"*. Marker turns orange, sightings = 2, confidence rises to 94%.
8. **Third Confirmation (Bus 31):** Bus 31 passes by. Sightings = 3, marker turns Red (`Confirmed Issue`).
9. **Traffic Aggregation:** Live traffic layer shows heavy vehicle density on that road segment ($T_{exposure} = 4.2$).
10. **Priority Escalation:** Road segment drops to `RHI: 41/100 (CRITICAL)`. Dashboard generates high-priority maintenance work-order card with evidence trail.

---

## 7. 6-Member Team Ownership & Deliverables

```
+-------------------------------------------------------------------------------+
| Member 1: CV / ML Lead                                                        |
| Primary: Model selection (YOLOv8/11), dataset curation (RDD2022/local),        |
|          fine-tuning, precision/recall/mAP metrics, confusion matrix.         |
+-------------------------------------------------------------------------------+
| Member 2: CV & Edge Systems Engineer                                          |
| Primary: Video ingestion loop, inference optimization (ONNX/TensorRT),        |
|          temporal consistency filter, SQLite store-and-forward, edge payload. |
+-------------------------------------------------------------------------------+
| Member 3: Backend & Data Platform Engineer                                    |
| Primary: FastAPI endpoints, WebSocket event stream, DB schemas,               |
|          auth & access control, evidence storage microservice.                |
+-------------------------------------------------------------------------------+
| Member 4: GIS & Analytics Engineer                                            |
| Primary: PostGIS spatial queries, Multi-bus clustering (ST-DBSCAN),           |
|          Road Health Index (RHI) math, traffic density aggregation engine.    |
+-------------------------------------------------------------------------------+
| Member 5: Frontend & UI/UX Engineer                                           |
| Primary: React + MapLibre dashboard, bus telemetry HUD, interactive popups,   |
|          dark/glassmorphism design, analytics charts, road ranking tables.    |
+-------------------------------------------------------------------------------+
| Member 6: Integration, QA & Pitch Lead                                        |
| Primary: End-to-end multi-bus simulation harness, demo orchestration,         |
|          presentation deck (PPT), judge Q&A defense, failure fallback drills. |
+-------------------------------------------------------------------------------+
```

---

## 8. Presentation & Pitch Assets

### 1-Sentence Pitch
> *"We turn public buses into a city-wide mobile sensing network that uses edge AI and fleet-level data fusion to continuously detect, verify, and prioritize road and traffic problems on an actionable GIS command platform."*

### 30-Second Elevator Pitch
> *"Cities rely heavily on fixed cameras with limited coverage, expensive manual inspections, and delayed citizen complaints to discover road hazards. But public transit buses already traverse every major artery daily with cameras and GPS. Our platform transforms every bus into an intelligent edge sensor that detects defects and traffic conditions in real-time. When multiple buses independently observe the same issue, our central engine fuses those observations into a single verified urban issue and computes a dynamic Road Health Priority score. The result is a scalable, cost-effective command platform that tells municipal authorities not just what is happening on their roads, but exactly what needs attention first."*

### Key Judge Defense Points
1. **"Why not fixed CCTV?"** $\rightarrow$ Fixed CCTV only covers static intersections (< 3% of road network). Buses cover 100s of kilometers daily at near-zero incremental infrastructure cost.
2. **"Why edge AI instead of cloud streaming?"** $\rightarrow$ Streaming 1080p/4K video from 500 buses consumes massive cellular bandwidth (terabytes/day) and raises severe privacy issues. Edge AI reduces bandwidth by >99% by transmitting only structured JSON events and small cropped evidence.
3. **"What if GPS is noisy or drifted?"** $\rightarrow$ We snap observations to vector road network segments (OSM) and use bounding spatial clustering ($\le 15\text{m}$) coupled with multi-pass confirmation to eliminate GPS jitter.
4. **"What if connectivity drops in tunnels/remote areas?"** $\rightarrow$ Edge nodes utilize a local store-and-forward SQLite buffer that automatically synchronizes once cellular handshake resumes.
5. **"Is this replacing road engineers?"** $\rightarrow$ No. It is an intelligent decision-support system that provides objective, audited, and prioritized maintenance backlogs.

---

## 9. Next Steps for Implementation
1. **Simulation Harness & Test Data:** Prepare video clips (dashcam road videos) and synchronized GPX GPS trajectories.
2. **Edge Processing Engine:** Prototype video inference + temporal filter + JSON event generator.
3. **Backend & PostGIS Service:** Setup FastAPI + PostGIS schema + spatial fusion endpoint.
4. **Interactive Dashboard:** Build React + MapLibre UI with live fleet tracking, issue markers, and bus telemetry.
5. **SIH Presentation Deck:** Draft 10-slide high-impact pitch presentation.
