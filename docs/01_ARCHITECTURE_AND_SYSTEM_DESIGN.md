# SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATION
**Project:** AI-Powered Mobile Urban Intelligence Platform (SIH26124)  
**Organization:** Bharat Electronics Limited (BEL)  

---

## 1. High-Level Architectural Overview

The platform is designed around three distinct, decoupled tiers:

```
[ EDGE TIER: BUS SENSING NODES ]
  │
  ├─ Dashcam / Forward Facing Camera (1080p @ 30 FPS)
  ├─ GNSS/GPS Receiver (NMEA 0183 / 5Hz update rate)
  ├─ Local Inference Runtime (YOLOv8/11 + TensorRT / ONNX)
  ├─ Temporal Persistence Filter (3-frame verification)
  └─ Local Store-and-Forward SQLite Buffer
  │
  ▼ [Secure TLS / MQTT or REST JSON Payload (Events only, ~2 KB)]
  │
[ CENTRAL INTELLIGENCE BACKEND TIER ]
  │
  ├─ Ingestion API Gateway (FastAPI Async)
  ├─ Redis Stream / Ingest Buffer
  ├─ Geospatial Matching Engine (PostGIS Road Segment Snapping)
  ├─ Multi-Bus Fusion & Spatial-Temporal Clustering (ST-DBSCAN)
  ├─ Confidence & Priority Scoring Engine (RHI & Maintenance Priority)
  ├─ Evidence Asset Store (MinIO / S3 for Defect Crops)
  └─ Real-time Event Broadcaster (WebSockets)
  │
  ▼ [WebSockets & REST APIs]
  │
[ COMMAND & VISUALIZATION TIER ]
  │
  ├─ React 18 + TypeScript + Vite Dashboard
  ├─ MapLibre GL JS / Deck.gl Vector Tile Map
  ├─ Fleet Telemetry & Video Playback HUD
  ├─ Urban Issue Lifecycle Management & Audit Trail
  └─ Municipal Work-Order Generator & Analytics Exports
```

---

## 2. Layer 1: Edge Processing Pipeline

### 2.1 Video Ingestion & Subsampling
- Frame rate is subsampled from 30 FPS to **10–15 FPS** on the edge device to balance thermal limits, compute load, and road coverage at standard urban bus speeds ($20\text{--}50\text{ km/h}$).
- Frame skipping is dynamically modulated based on vehicle speed ($v = 0 \rightarrow$ low sample rate; $v > 30\text{ km/h} \rightarrow 15\text{ FPS}$).

### 2.2 Computer Vision Models
1. **Road Defect Detection:**
   - Model: Fine-tuned YOLOv8n/s on Road Damage Datasets (RDD2022 + Local Curated Datasets).
   - Target Classes: `pothole`, `crack_severe`, `waterlogging`, `damaged_signage`.
2. **Traffic & Vehicle Counting:**
   - Model: YOLOv8n (COCO subset: `car`, `bus`, `truck`, `motorcycle`, `auto_rickshaw`).
   - Purpose: Real-time traffic density estimation per road segment.

### 2.3 Edge Temporal Filtering Algorithm
To prevent single-frame false positives (e.g., shadows, road markings mistaken for cracks):
```python
class EdgeTemporalFilter:
    def __init__(self, persistence_threshold=3, max_frame_distance=5):
        self.buffer = []
        self.threshold = persistence_threshold
        self.max_distance = max_frame_distance

    def update(self, frame_id, detection, current_gps):
        # Match with recent detections based on IoU and spatial proximity
        matched = self._find_matching_track(detection)
        if matched:
            matched.hits += 1
            matched.last_frame = frame_id
            matched.confidences.append(detection.confidence)
            if matched.hits >= self.threshold and not matched.emitted:
                matched.emitted = True
                return self._generate_event(matched, current_gps)
        else:
            self.buffer.append(Track(detection, frame_id, current_gps))
        return None
```

### 2.4 Network Resilience: Store-and-Forward SQLite Buffer
- When cellular connectivity (4G/5G) is unavailable (e.g., underpasses, tunnels, signal dead-zones), events are stored locally in an edge SQLite database:
```sql
CREATE TABLE edge_event_queue (
    event_id TEXT PRIMARY KEY,
    payload_json TEXT NOT NULL,
    evidence_blob BLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'PENDING'
);
```
- A background worker attempts periodic synchronization with exponential backoff. Upon successful transmission, records are marked `SYNCED` and pruned.

---

## 3. Layer 2: Central Event Intelligence & Multi-Bus Fusion

### 3.1 Road Network Snapping
Incoming GPS coordinates $(lat, lon)$ are snapped to the nearest road segment from OpenStreetMap (OSM) vector geometry using PostGIS:
```sql
SELECT 
    segment_id,
    road_name,
    speed_limit,
    ST_Distance(geom, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography) AS dist_m
FROM road_segments
ORDER BY geom <-> ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
LIMIT 1;
```

### 3.2 Spatial-Temporal Clustering (ST-DBSCAN)
- Distance threshold $\epsilon_{spatial} = 15\text{ meters}$.
- Heading alignment threshold $\Delta \theta \le 60^\circ$.
- If an existing open `UrbanIssue` exists within $\epsilon_{spatial}$ on the same `road_segment_id` with matching `issue_type`:
  - The observation is linked as child evidence.
  - Centroid position is updated via weighted average:
    $$\text{Lat}_{new} = \frac{\sum c_i \cdot \text{Lat}_i}{\sum c_i}$$
  - Fused confidence and priority scores are recalculated.

---

## 4. Layer 3: Central GIS Command Dashboard

### 4.1 Interface Modules
1. **Interactive Vector Map:** Real-time rendering of all active bus locations, road health overlays (color-coded polylines), and clustered defect markers.
2. **Bus Inspector HUD:** View live/replayed camera stream, active speed, heading, route progression, and recent local detections.
3. **Issue Lifecycle Manager:** Displays verified issues, observation count, list of observing buses with timestamps, photographic evidence comparison, and manual verification/closure controls.
4. **Road Health Ranking & Work Orders:** Tabular prioritization of city roads by deterioration score, allowing municipal supervisors to export PDF/CSV maintenance work orders.

---

## 5. Security, Privacy & Data Minimization

1. **Bandwidth Minimization:** Only structured JSON data (~2 KB) and cropped defect bounding boxes (~50 KB) are transmitted over cellular networks. Video feeds remain local to the edge device.
2. **Privacy by Design:** Faces and unrelated number plates are blurred or excluded at the edge prior to evidence crop generation.
3. **Role-Based Access Control (RBAC):**
   - `Viewer`: Traffic monitoring & read-only GIS layers.
   - `Municipal Engineer`: Issue verification, priority override, work-order dispatch.
   - `Admin / Fleet Manager`: Edge device management, model deployment, system diagnostics.
