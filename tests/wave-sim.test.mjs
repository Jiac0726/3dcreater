import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createWaveSimulation} from '../src/wave-sim.mjs';
test('wave impulse propagates and remains finite',()=>{
 const sim=createWaveSimulation(57,57);sim.splash(0,0,.7);
 let max=0;for(let i=0;i<180;i++){sim.step(1/60,.5);max=Math.max(max,...sim.heights)}
 assert.ok(max>0);assert.ok(sim.heights.every(Number.isFinite));assert.ok(sim.velocities.every(Number.isFinite));
 assert.ok(Number.isFinite(sim.meanEnergy()));
});
test('invalid impulses cannot poison the mesh',()=>{
 const sim=createWaveSimulation(13,13);
 assert.throws(()=>sim.splash(NaN,0));
 assert.throws(()=>createWaveSimulation(1,2));
});
