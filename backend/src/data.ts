import type { Bus, Road, Route, UrbanEvent } from '@cityfleet/shared';

const p = (lat: number, lng: number) => ({ lat, lng });
export const routes: Route[] = [
  { id: 'R1', number: '201', name: 'Majestic – Indiranagar', color: '#2563eb', path: [p(12.976,77.571),p(12.974,77.582),p(12.971,77.594),p(12.969,77.606),p(12.972,77.620)] },
  { id: 'R2', number: '335E', name: 'Shivajinagar – Whitefield', color: '#0f766e', path: [p(12.982,77.601),p(12.978,77.615),p(12.977,77.630),p(12.982,77.649),p(12.993,77.666)] },
  { id: 'R3', number: '500D', name: 'Silk Board – Hebbal', color: '#9333ea', path: [p(12.918,77.623),p(12.941,77.611),p(12.965,77.600),p(12.987,77.594),p(13.035,77.592)] },
  { id: 'R4', number: '45', name: 'Kengeri – MG Road', color: '#c2410c', path: [p(12.955,77.481),p(12.961,77.530),p(12.969,77.570),p(12.973,77.604)] },
  { id: 'R5', number: 'V-500', name: 'Koramangala – Yeshwanthpur', color: '#be123c', path: [p(12.935,77.624),p(12.956,77.612),p(12.982,77.590),p(13.015,77.555)] },
  { id: 'R6', number: 'G-3', name: 'Jayanagar – Central', color: '#0369a1', path: [p(12.925,77.583),p(12.946,77.588),p(12.968,77.594),p(12.982,77.601)] }
];

export const roads: Road[] = [
  ['road-mg','MG Road',69,4.7,'R4'], ['road-old-airport','Old Airport Road',76,4.1,'R1'], ['road-outer-ring','Outer Ring Road',58,4.9,'R3'], ['road-whitefield','Whitefield Main Road',82,3.8,'R2'], ['road-hosur','Hosur Road',63,4.3,'R3'], ['road-kr','KR Market Road',88,3.0,'R6'], ['road-mysore','Mysore Road',74,3.6,'R4'], ['road-100ft','100 Feet Road',80,4.0,'R5']].map(([id,name,healthScore,trafficExposure,routeId]) => ({ id: id as string, name: name as string, healthScore: healthScore as number, trafficExposure: trafficExposure as number, geometry: routes.find(r => r.id === routeId)!.path, history: [{at: new Date(Date.now()-86400000).toISOString(),score: healthScore as number}] }));

const fleet = [['BUS-001','KA 01 F 1101','R1'],['BUS-002','KA 01 F 1102','R2'],['BUS-003','KA 01 F 1103','R3'],['BUS-004','KA 01 F 1104','R4'],['BUS-005','KA 01 F 1105','R5'],['BUS-006','KA 01 F 1106','R6'],['BUS-007','KA 01 F 1107','R4'],['BUS-008','KA 01 F 1108','R1'],['BUS-009','KA 01 F 1109','R4'],['BUS-010','KA 01 F 1110','R3']];
export const makeBuses = (): Bus[] => fleet.map(([id, registrationNumber, routeId], index) => {
  const route = routes.find(r => r.id === routeId)!; const progress = (index * 0.137) % 0.84; const point = route.path[Math.floor(progress * (route.path.length - 1))];
  return { id, registrationNumber, routeId, status: index === 9 ? 'inactive' : 'active', latitude: point.lat, longitude: point.lng, speed: index === 9 ? 0 : 24 + (index * 3) % 17, heading: 90, lastSeen: new Date().toISOString(), progress };
});

export const seededEvents = (): UrbanEvent[] => [
  { id:'EVT-101',type:'pothole',latitude:12.9712,longitude:77.5944,detectedAt:new Date(Date.now()-28*60000).toISOString(),roadId:'road-mg',roadName:'MG Road',confidence:.962,initialConfidence:.86,severity:'high',status:'confirmed',observationCount:3,observingBusIds:['BUS-004','BUS-007','BUS-009'],priority:92,priorityTier:'critical',priorityReasons:['High-severity road defect','3 independent bus observations','High traffic corridor','Recent confirmation'],evidenceLabel:'Simulated forward camera evidence',metadata:{trafficExposure:4.7,provider:'DemoDetectionProvider'},observations:[] },
  { id:'EVT-102',type:'congestion',latitude:12.9778,longitude:77.616,detectedAt:new Date(Date.now()-50*60000).toISOString(),roadId:'road-old-airport',roadName:'Old Airport Road',confidence:.90,initialConfidence:.78,severity:'high',status:'confirmed',observationCount:5,observingBusIds:['BUS-001','BUS-002','BUS-005','BUS-008','BUS-010'],priority:84,priorityTier:'high',priorityReasons:['Sustained high vehicle density','5 buses affected','Peak traffic corridor'],evidenceLabel:'Simulated traffic-density feed',metadata:{trafficExposure:4.4,provider:'DemoDetectionProvider'},observations:[] },
  { id:'EVT-103',type:'damaged_sign',latitude:12.957,longitude:77.529,detectedAt:new Date(Date.now()-75*60000).toISOString(),roadId:'road-mysore',roadName:'Mysore Road',confidence:.79,initialConfidence:.79,severity:'medium',status:'unverified',observationCount:1,observingBusIds:['BUS-004'],priority:46,priorityTier:'medium',priorityReasons:['Infrastructure visibility risk','Single observation awaiting verification'],evidenceLabel:'Simulated forward camera evidence',metadata:{trafficExposure:3.6,provider:'DemoDetectionProvider'},observations:[] }
];
