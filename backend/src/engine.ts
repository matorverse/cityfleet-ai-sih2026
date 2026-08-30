import { randomUUID } from 'node:crypto';
import type { Alert, Bus, Detection, EventType, Road, Severity, UrbanEvent } from '@cityfleet/shared';
import { routes } from './data.js';

const severityWeight: Record<Severity, number> = { low: 2, medium: 4, high: 7, critical: 10 };
export const distanceMeters = (a:{latitude:number;longitude:number}, b:{latitude:number;longitude:number}) => { const rad = Math.PI/180; const x=(b.longitude-a.longitude)*rad*Math.cos((a.latitude+b.latitude)*rad/2); const y=(b.latitude-a.latitude)*rad; return Math.sqrt(x*x+y*y)*6371000; };
export const severityFor = (type:EventType, confidence:number): Severity => {
  if (type === 'waterlogging' && confidence >= .84) return 'critical';
  if (type === 'pothole' && confidence >= .82) return 'high';
  if (type === 'congestion' && confidence >= .80) return 'high';
  return confidence >= .72 ? 'medium' : 'low';
};
export const fusedConfidence = (observations: { busId:string; confidence:number }[]) => {
  const seen = new Set<string>(); let remaining = 1;
  for (const observation of observations) { const weight = seen.has(observation.busId) ? .6 : 1; seen.add(observation.busId); remaining *= 1 - Math.min(.98, observation.confidence * weight); }
  return Number((1 - remaining).toFixed(3));
};
export const priorityFor = (severity:Severity, confidence:number, observations:number, traffic:number) => {
  const score = Math.min(99, Math.round(severityWeight[severity] * 1.25 * confidence * (1 + Math.min(observations,4)*.17) * traffic * 2.35));
  return score;
};
export const tierFor = (score:number): Severity => score >= 85 ? 'critical' : score >= 65 ? 'high' : score >= 38 ? 'medium' : 'low';
export const updateRoadHealth = (road:Road, events:UrbanEvent[]) => { const impact = events.filter(e=>e.roadId===road.id && e.status!=='resolved').reduce((sum,e)=>sum + severityWeight[e.severity] * e.confidence * (e.observationCount > 1 ? 1.25 : 1),0); road.healthScore = Math.max(0, Math.round(100-impact*2.2)); road.history.push({at:new Date().toISOString(),score:road.healthScore}); if(road.history.length>30) road.history.shift(); };

export class IntelligenceEngine {
  constructor(private events: UrbanEvent[], private roads: Road[], private alerts: Alert[]) {}
  ingest(bus:Bus, detection:Detection, roadId:string): UrbanEvent {
    const now = new Date().toISOString(); const road = this.roads.find(r=>r.id===roadId)!;
    const match = this.events.find(e => e.type===detection.type && e.status!=='resolved' && distanceMeters({latitude:e.latitude,longitude:e.longitude},{latitude:bus.latitude,longitude:bus.longitude}) <= 75 && Date.now()-new Date(e.detectedAt).getTime() < 8*3600_000);
    const observation = {id:randomUUID(),eventGroupId:match?.id ?? '',busId:bus.id,confidence:detection.confidence,detectedAt:now,bbox:detection.bbox,provider:detection.provider,inferenceMs:detection.inferenceMs};
    if (match) {
      observation.eventGroupId=match.id; match.observations.push(observation); match.observationCount=match.observations.length; match.observingBusIds=[...new Set([...match.observingBusIds,bus.id])]; match.confidence=fusedConfidence(match.observations); if(match.observingBusIds.length>=2) match.status='confirmed'; match.priority=priorityFor(match.severity,match.confidence,match.observationCount,road.trafficExposure); match.priorityTier=tierFor(match.priority); match.priorityReasons = [`${match.observingBusIds.length} independent bus observation${match.observingBusIds.length===1?'':'s'}`, `${Math.round(match.confidence*100)}% fused confidence`, road.trafficExposure>=4?'High traffic corridor':'Active monitored corridor']; this.refresh(road); return match;
    }
    const severity=severityFor(detection.type,detection.confidence); const event:UrbanEvent={id:`EVT-${Date.now().toString().slice(-6)}`,type:detection.type,latitude:bus.latitude,longitude:bus.longitude,detectedAt:now,roadId:road.id,roadName:road.name,confidence:detection.confidence,initialConfidence:detection.confidence,severity,status:'unverified',observationCount:1,observingBusIds:[bus.id],priority:priorityFor(severity,detection.confidence,1,road.trafficExposure),priorityTier:'low',priorityReasons:['New observation awaiting fleet verification'],evidenceLabel:'Simulated camera frame — DemoDetectionProvider',metadata:{trafficExposure:road.trafficExposure,provider:detection.provider},observations:[observation]}; event.priorityTier=tierFor(event.priority); this.events.unshift(event); this.alerts.unshift({id:randomUUID(),eventId:event.id,priority:event.priority,status:'open',createdAt:now}); this.refresh(road); return event;
  }
  private refresh(road:Road) { updateRoadHealth(road,this.events); }
}
export class DemoDetectionProvider { name='DemoDetectionProvider'; detect(type:EventType, confidence:number): Detection { return {type,confidence,bbox:[.32,.48,.28,.22],provider:this.name,inferenceMs:28}; } }
export const pointAt = (bus:Bus) => { const route=routes.find(r=>r.id===bus.routeId)!; const scaled=bus.progress*(route.path.length-1); const i=Math.min(route.path.length-2,Math.floor(scaled)); const t=scaled-i; const a=route.path[i],b=route.path[i+1]; return {latitude:a.lat+(b.lat-a.lat)*t,longitude:a.lng+(b.lng-a.lng)*t,heading:Math.atan2(b.lng-a.lng,b.lat-a.lat)*180/Math.PI}; };
