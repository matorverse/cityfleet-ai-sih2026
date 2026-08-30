import test from 'node:test'; import assert from 'node:assert/strict'; import { distanceMeters, fusedConfidence, priorityFor, severityFor } from '../src/engine.js';
test('calculates distance and severity',()=>{assert.ok(distanceMeters({latitude:12.9716,longitude:77.5946},{latitude:12.9717,longitude:77.5946})>10);assert.equal(severityFor('pothole',.9),'high');assert.equal(severityFor('waterlogging',.9),'critical')});
test('raises fused confidence with independent buses',()=>{assert.ok(fusedConfidence([{busId:'A',confidence:.86},{busId:'B',confidence:.91}])>.97)});
test('priority rewards traffic and repeated confirmation',()=>{assert.ok(priorityFor('high',.95,3,4.7)>priorityFor('high',.8,1,2))});
