export type EventType = 'pothole' | 'congestion' | 'damaged_sign' | 'waterlogging';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type EventStatus = 'unverified' | 'confirmed' | 'acknowledged' | 'resolved';

export interface Coordinate { lat: number; lng: number }
export interface Route { id: string; number: string; name: string; color: string; path: Coordinate[] }
export interface Bus {
  id: string; registrationNumber: string; routeId: string; status: 'active' | 'inactive';
  latitude: number; longitude: number; speed: number; heading: number; lastSeen: string; progress: number;
}
export interface Observation {
  id: string; eventGroupId: string; busId: string; confidence: number; detectedAt: string;
  bbox: [number, number, number, number]; provider: string; inferenceMs: number;
}
export interface UrbanEvent {
  id: string; type: EventType; latitude: number; longitude: number; detectedAt: string; roadId: string;
  roadName: string; confidence: number; initialConfidence: number; severity: Severity; status: EventStatus;
  observationCount: number; observingBusIds: string[]; priority: number; priorityTier: Severity;
  priorityReasons: string[]; evidenceLabel: string; metadata: { trafficExposure: number; provider: string };
  observations: Observation[];
}
export interface Road { id: string; name: string; healthScore: number; trafficExposure: number; geometry: Coordinate[]; history: { at: string; score: number }[] }
export interface Alert { id: string; eventId: string; priority: number; status: 'open' | 'acknowledged' | 'resolved'; createdAt: string }
export interface Snapshot { buses: Bus[]; routes: Route[]; events: UrbanEvent[]; roads: Road[]; alerts: Alert[]; simulation: { running: boolean; speed: number; tick: number } }
export interface Detection { type: EventType; confidence: number; bbox: [number, number, number, number]; provider: string; inferenceMs: number }
