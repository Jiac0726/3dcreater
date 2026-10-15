import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planScene} from '../src/scene-spec.mjs';
import {addObject} from '../src/scene-operations.mjs';
import {resolveSceneOverlaps} from '../src/physics.mjs';
test('planar collision solver separates overlapping objects without mutation',()=>{
 const base=planScene('冰山果冻');
 const a=addObject(addObject(base,'tree',[0,1,0]),'tree',[0,1,0]);
 const result=resolveSceneOverlaps(a);
 const [p,q]=result.spec.objects.slice(-2);
 assert.ok(Math.hypot(p.position[0]-q.position[0],p.position[2]-q.position[2])>.35);
 assert.deepEqual(a.objects.slice(-2).map(x=>x.position),[[0,1,0],[0,1,0]]);
 assert.ok(result.resolved>0);
});
test('solver keeps all object positions finite',()=>{
 const spec=planScene('火山岛');
 const result=resolveSceneOverlaps(spec);
 assert.ok(result.spec.objects.every(x=>x.position.every(Number.isFinite)));
});
