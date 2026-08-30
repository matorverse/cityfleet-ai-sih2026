# SIH 2026 PRESENTATION DECK & PITCH STRATEGY
**Problem Statement ID:** SIH26124  
**Organization:** Bharat Electronics Limited (BEL)  
**Project Title:** AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet  

---

## 1. 10-Slide Pitch Presentation Structure

### Slide 1: Title & Identity
- **Headline:** CityFleet AI — Mobile Urban Intelligence & Road Infrastructure Platform
- **Sub-headline:** Transforming Public Bus Fleets into a Distributed, Real-Time Urban Sensing Grid
- **Details:** Team Name, Problem Statement ID: SIH26124, Ministry/Org: Bharat Electronics Limited (BEL)
- **Visuals:** High-res mockup of GIS Command Center with bus nodes and live defect telemetry.

### Slide 2: The Problem: Urban Infrastructure Blindspots
- **Points:**
  - Traditional road monitoring relies on fixed CCTV (covers <3% of road network), slow/costly manual surveys, and delayed citizen complaints.
  - Potholes and road degradation cause severe traffic slowdowns, vehicle damage, and thousands of fatal accidents annually.
  - Municipal bodies lack a real-time, objective, prioritized maintenance backlog.
- **Visuals:** Side-by-side comparison: Fixed CCTV cone vs. Massive coverage trace of a bus route.

### Slide 3: The Breakthrough Solution: Fleet as a Sensor
- **Points:**
  - Public buses already travel predictable, extensive routes daily across all city arteries.
  - By mounting edge AI compute and forward cameras on existing buses, we turn every vehicle into a mobile sensing node.
  - Transmits **structured metadata events** rather than continuous heavy video streams.
- **Key Metric:** 500 buses cover >90% of a Tier-1 city's road network every 6 hours.

### Slide 4: System Architecture (3-Tier Model)
- **Diagram:**
  1. **Edge Tier:** Bus camera + GPS $\rightarrow$ YOLOv8/11 Inference $\rightarrow$ Temporal Persistence Filter $\rightarrow$ Store-and-Forward SQLite.
  2. **Central Fusion Tier:** FastAPI + PostGIS $\rightarrow$ ST-DBSCAN Spatial Clustering $\rightarrow$ Multi-Bus Fused Confidence & Priority Engine.
  3. **Command GIS Tier:** Real-time MapLibre/Deck.gl UI $\rightarrow$ Road Health Index (RHI) $\rightarrow$ Automated Work Order Dispatch.

### Slide 5: Core Innovation: Multi-Bus Event Fusion
- **Points:**
  - *Raw Observation $\neq$ Final Urban Issue.*
  - A single detection might be noisy; when Bus 17, Bus 23, and Bus 31 independently observe the same defect within 15 meters, confidence escalates from 88% to 99.8%.
  - Eliminates duplicate entries and provides an undeniable, multi-angle audit trail with photographic proof.

### Slide 6: Intelligent Decision Science: Road Health & Priority Index
- **Formulas & Explanation:**
  - **Dynamic Maintenance Priority:** $\text{Priority} = (\text{Severity} \times C_{fused} \times \text{Traffic Exposure} \times \text{Recurrence}) \cdot \text{Vulnerability}$
  - **Road Health Index (RHI):** 0 to 100 score per road segment.
  - Tells authorities not just *where* defects are, but *which road to fix first* to maximize public impact and minimize traffic disruption.

### Slide 7: Real-Time Traffic & Density Intelligence
- **Points:**
  - Simultaneous vehicle detection and optical flow density computation.
  - Generates live congestion heatmaps and road occupancy metrics alongside infrastructure health.
  - Fuses traffic volume with road defect severity to prioritize high-congestion corridors.

### Slide 8: Live Demonstration Workflow
- **Steps:**
  1. City overview with live moving buses on scheduled routes.
  2. Bus 17 onboard camera detects pothole at coordinates $(X, Y)$ $\rightarrow$ Map drops unconfirmed marker.
  3. Bus 23 arrives 15 mins later $\rightarrow$ Fuses observation $\rightarrow$ Marker turns orange (Confidence: 94%).
  4. Bus 31 confirms $\rightarrow$ High priority work order auto-generated for Municipal Ward.

### Slide 9: Feasibility, Scalability & BEL Alignment
- **Points:**
  - **Hardware Ready:** Runs on standard dashcams paired with low-power edge hardware (NVIDIA Jetson Nano/Orin or Raspberry Pi 5 + Hailo-8).
  - **Bandwidth Efficiency:** >99.2% cellular data reduction vs. raw video streaming.
  - **Defense & Civil Dual-Use:** Direct synergy with BEL’s smart city, tactical fleet management, and border/perimeter patrol surveillance systems.

### Slide 10: Conclusion & Future Roadmap
- **Roadmap:**
  - Phase 1: Core Road Defect & Traffic MVP (Current SIH Scope).
  - Phase 2: Waterlogging, damaged signage, divider intrusion alerts.
  - Phase 3: Autonomous work-order dispatch integration with Smart City ICCC (Integrated Command and Control Centres).
- **Final Note:** *"From Reactive Repairs to Proactive Urban Intelligence."*

---

## 2. Judge Q&A Defense Master Sheet

| Question | Winning Response |
|---|---|
| **"Why not just use smartphones mounted on cars?"** | Smartphone mounts suffer from severe vibration, inconsistent angles, overheating, battery drain, and lack of dedicated GNSS accuracy. Public buses provide dedicated, stable mounting heights, continuous power, fixed route repeatability, and official government operational jurisdiction. |
| **"How do you handle GPS drift in dense urban areas (urban canyons)?"** | We employ topological map-snapping using PostGIS vector road networks. Even with 5-10m GPS drift, events are snapped to the nearest road corridor and clustered within a 15m radius buffer. |
| **"Isn't edge hardware too expensive for every bus?"** | Edge inference can be performed on cost-effective AI accelerators ($50-$150 range like Hailo-8 or Jetson Orin Nano). Furthermore, the cost is offset by saving millions in delayed road repairs and manual survey tenders. |
| **"What about privacy and passenger/pedestrian data?"** | Our pipeline follows strict Privacy-by-Design principles. Processing happens locally at the edge; faces and number plates are blurred, and only tight bounding box crops of road defects are transmitted to the cloud. |
| **"What if cellular connectivity drops in a tunnel or remote route?"** | Our edge agent incorporates an offline-first SQLite store-and-forward buffer that queues events and automatically pushes them via idempotent APIs once network connectivity resumes. |
