# MULTI-BUS FUSION & DECISION SCIENCE MATHEMATICS
**Project:** AI-Powered Mobile Urban Intelligence Platform (SIH26124)  
**Organization:** Bharat Electronics Limited (BEL)  

---

## 1. Multi-Bus Observation Fusion

### 1.1 Problem Statement
Single-camera observations are prone to false positives (shadows, oil stains, optical distortion) and temporal fluctuations. A scalable city platform must aggregate independent observations from multiple buses over time into a high-confidence persistent issue.

### 1.2 Mathematical Formulation of Multi-Pass Fused Confidence

Let an urban issue $I$ have a set of $N$ observations:
$$\mathcal{O}(I) = \{ O_1, O_2, \dots, O_N \}$$

Each observation $O_i$ has:
- Model detection confidence $c_i \in (0, 1)$
- Bus identifier $B_i \in \mathcal{B}$
- Timestamp $t_i$

The fused event confidence $C_{fused}(I)$ is modeled using independent probability failure decay:

$$C_{fused}(I) = 1 - \prod_{i=1}^{N} \left(1 - w(O_i) \cdot c_i\right)$$

Where $w(O_i)$ is the observation independence weight:
$$w(O_i) = \begin{cases} 
1.0 & \text{if } B_i \text{ is a unique bus observing issue } I \text{ for the first time} \\
0.6 & \text{if } B_i \text{ is a recurring observation from a bus that already observed } I \\
0.4 & \text{if timestamp difference } |t_i - t_{i-1}| < 60\text{ seconds (same trip burst)}
\end{cases}$$

#### Worked Example:
- Bus 17 observes pothole: $c_1 = 0.88 \rightarrow C_{fused} = 0.88$ (88%)
- Bus 23 observes same pothole 15 mins later: $c_2 = 0.91 \rightarrow C_{fused} = 1 - (1 - 0.88)(1 - 0.91) = 1 - (0.12 \times 0.09) = 0.9892$ (98.9%)
- Bus 31 observes same pothole 2 hours later: $c_3 = 0.86 \rightarrow C_{fused} = 1 - (0.0108 \times 0.14) = 0.9985$ (99.85%)

---

## 2. Dynamic Maintenance Priority Score ($P$)

The platform produces an objective, explainable prioritization metric to rank which road defects require urgent municipal intervention.

$$P(I) = \min\left(100, \left( S(I) \times C_{fused}(I) \times T_{\text{exposure}}(S) \times R(I) \right) \cdot V_{\text{context}}(S)\right)$$

### Factor Breakdown:

1. **Defect Severity $S(I) \in [1, 10]$:**
   - Evaluated based on bounding box area ratio, depth/type classifier, and structural deformation index.
   - Pothole Grade 1 (Shallow): $S = 3\text{--}4$
   - Pothole Grade 2 (Moderate): $S = 5\text{--}7$
   - Pothole Grade 3 (Deep / Hazardous): $S = 8\text{--}10$

2. **Fused Confidence $C_{fused}(I) \in [0, 1]$:**
   - Multi-bus verified probability (from Section 1.2).

3. **Traffic Exposure Multiplier $T_{\text{exposure}}(S) \in [1.0, 3.5]$:**
   Derived from normalized vehicle volume on road segment $S$:
   $$T_{\text{exposure}}(S) = 1.0 + 2.5 \times \left( \frac{\text{Vehicles per hour}}{\text{Road Capacity}} \right)$$

4. **Recurrence & Persistence Factor $R(I) \in [1.0, 2.0]$:**
   Measures time since first detection without remediation:
   $$R(I) = 1.0 + \min\left(1.0, \frac{\Delta t_{\text{days}}}{14}\right)$$

5. **Vulnerability Context $V_{\text{context}}(S) \in [1.0, 1.4]$:**
   Geographic risk factors:
   - Within 200m of a school or hospital: $+0.2$
   - High-speed flyover or expressway: $+0.2$
   - Heavy pedestrian crossing zone: $+0.1$

---

## 3. Road Health Index (RHI)

Every road segment $S$ in the city GIS network is assigned a dynamic health score out of 100:

$$\text{RHI}(S) = \max\left(0, 100 - \sum_{k \in \text{Issues}(S)} \omega_k \cdot \left( S(k) \times C_{fused}(k) \right) \right)$$

Where $\omega_k$ is the defect class severity weight:
- Pothole: $\omega = 1.5$
- Severe Longitudinal Crack: $\omega = 0.8$
- Waterlogging: $\omega = 1.2$
- Missing Traffic Sign: $\omega = 0.6$

### RHI Tiers:
| RHI Range | Status | Color | Action Protocol |
|---|---|---|---|
| **80 – 100** | Good Condition | Green | Normal scheduled inspection |
| **50 – 79** | Moderate Deterioration | Yellow | Add to bi-weekly maintenance list |
| **0 – 49** | Critical Hazard | Red | Immediate emergency work order |

---

## 4. Traffic Density & Congestion Index

Buses continuously log vehicle counts in their forward visual field:
$$\text{Density}(S, t) = \frac{\sum_{m \in \text{Buses on } S} \text{Vehicle Count}_m}{\text{Active Track Length (km)}}$$

$$\text{Congestion Level} = \begin{cases}
\text{FREE FLOW} & \text{if Density } < 20 \text{ veh/km/lane} \\
\text{MODERATE} & \text{if } 20 \le \text{Density} < 50 \text{ veh/km/lane} \\
\text{CONGESTED} & \text{if } 50 \le \text{Density} < 90 \text{ veh/km/lane} \\
\text{SEVERE GRIDLOCK} & \text{if Density } \ge 90 \text{ veh/km/lane}
\end{cases}$$
