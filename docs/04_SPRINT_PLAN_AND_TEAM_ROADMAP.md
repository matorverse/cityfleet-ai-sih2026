# SPRINT PLAN & 6-MEMBER TEAM EXECUTION ROADMAP
**Project:** AI-Powered Mobile Urban Intelligence Platform (SIH26124)  
**Organization:** Bharat Electronics Limited (BEL)  

---

## 1. 6-Member Role Matrix & Responsibilities

```
+---------------------------------------------------------------------------------------+
| MEMBER 1: Computer Vision & ML Lead                                                   |
| - Dataset acquisition (RDD2022, Roboflow road damage, custom Indian road footage).    |
| - Fine-tune YOLOv8 / YOLOv11 for road hazards (potholes, cracks, waterlogging).        |
| - Export models to ONNX / TensorRT / OpenVINO for fast edge inference.                |
| - Model evaluation benchmarks: Precision, Recall, mAP@50, Confusion Matrix.           |
+---------------------------------------------------------------------------------------+
| MEMBER 2: Edge Computing & Embedded CV Engineer                                       |
| - Video stream ingestion loop (OpenCV, FFmpeg, RTSP / video file replay).             |
| - Temporal consistency filter (3-frame tracking & persistence buffer).                |
| - Local SQLite store-and-forward queue for offline network resilience.                |
| - Edge event packager: JSON schema construction + image crop extractor.               |
+---------------------------------------------------------------------------------------+
| MEMBER 3: Backend & Data Platform Engineer                                            |
| - FastAPI async backend setup + OpenAPI interactive docs.                             |
| - PostgreSQL + PostGIS database modeling and migration scripts.                       |
| - RESTful & WebSocket APIs for real-time telemetry and event ingestion.               |
| - Object storage integration (MinIO/S3 or local static store for evidence crops).     |
+---------------------------------------------------------------------------------------+
| MEMBER 4: GIS & Analytics Engineer                                                    |
| - PostGIS spatial querying & OpenStreetMap (OSM) road network ingestion.             |
| - Multi-bus spatial-temporal clustering algorithm (ST-DBSCAN).                        |
| - Fused confidence calculation and Road Health Index (RHI) computation engine.        |
| - Vehicle density & traffic congestion aggregation pipeline.                          |
+---------------------------------------------------------------------------------------+
| MEMBER 5: Frontend & UI/UX Engineer                                                   |
| - React + Vite + TypeScript + Tailwind CSS application setup.                         |
| - MapLibre GL JS / Deck.gl interactive map with custom bus markers and defect layers. |
| - Bus cockpit/HUD view with simulated video stream and live detection telemetry.      |
| - Road Health Index rankings, priority cards, and municipal work order generator.     |
+---------------------------------------------------------------------------------------+
| MEMBER 6: System Integration, Simulation & Presentation Lead                          |
| - Multi-bus synchronized GPS & video simulation harness.                             |
| - End-to-end integration testing and edge-case failure drills.                        |
| - SIH Presentation Deck (PowerPoint / Canva) and 10-step demo script timing.          |
| - Video demo recording, backup offline demo bundle, and judge Q&A preparation.        |
+---------------------------------------------------------------------------------------+
```

---

## 2. Sprint Execution Plan

```
PHASE 1: SCOPE LOCK & DATA PREPARATION (Sprint 1)
├── Task 1.1: Finalize JSON Event & DB Schemas (Members 2, 3, 4)
├── Task 1.2: Download RDD2022 & Indian Road Video Datasets (Member 1)
├── Task 1.3: Setup Repository, Monorepo structure, Docker Compose (Member 3)
└── Task 1.4: Map GPS Traces to OSM Road Segments for Delhi/Bengaluru (Member 4)

PHASE 2: CORE SUBSYSTEM PROTOTYPING (Sprint 2)
├── Task 2.1: Train baseline YOLOv8 model on Road Defect classes (Member 1)
├── Task 2.2: Build Edge Video Ingestion + Temporal Filter (Member 2)
├── Task 2.3: Build FastAPI Ingestion Gateway + PostGIS DB (Member 3)
├── Task 2.4: Implement Multi-Bus Spatial Clustering & RHI Engine (Member 4)
└── Task 2.5: Build React GIS Map shell with Bus Markers (Member 5)

PHASE 3: INTEGRATION & FLEET FUSION (Sprint 3)
├── Task 3.1: Connect Edge Event Emitter to Backend Gateway (Members 2, 3)
├── Task 3.2: Verify Observation -> Persistent Issue Promotion (Members 3, 4)
├── Task 3.3: Connect Live WebSocket Stream to React Dashboard (Members 3, 5)
├── Task 3.4: Build Bus Telemetry & Onboard Video Player in UI (Member 5)
└── Task 3.5: Multi-bus Simulation Script (4 buses passing same spot) (Member 6)

PHASE 4: POLISH, WORK ORDERS & PRESENTATION (Sprint 4)
├── Task 4.1: UI Visual Polish (Glassmorphism, animations, dark mode) (Member 5)
├── Task 4.2: Road Health Ranking & PDF Work Order Export (Members 4, 5)
├── Task 4.3: Edge offline store-and-forward test harness (Members 2, 6)
├── Task 4.4: 10-Slide High-Impact Presentation Deck (Member 6)
└── Task 4.5: Rehearsal of 10-Step Wow Demo & Judge Q&A (All Members)
```
