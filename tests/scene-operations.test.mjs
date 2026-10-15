import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planScene} from '../src/scene-spec.mjs';
import {addObject,removeObject,moveObject,detectCollisions} from '../src/scene-operations.mjs';
test('add and remove object preserves other scene nodes',()=>{
 const a=planScene('冰山果冻');
 const b=addObject(a,'tree',[2,1,2]);assert.equal(b.objects.length,a.objects.length+1);
 assert.deepEqual(b.objects.slice(0,a.objects.length),a.objects);
 const c=removeObject(b,b.objects.at(-1).id);assert.deepEqual(c.objects,a.objects);
});
test('moving objects is immutable and bounded',()=>{
 const a=planScene('冰山果冻');
 const id=a.objects[0].id,b=moveObject(a,id,[4,5,6]);
 assert.deepEqual(b.objects[0].position,[4,5,6]);
 assert.notDeepEqual(a.objects[0].position,b.objects[0].position);
 assert.throws(()=>moveObject(a,id,[NaN,0,0]));
});
test('basic proximity contacts are detected',()=>{
 const a=planScene('冰山果冻');
 const b=addObject(addObject(a,'tree',[0,0,0]),'tree',[.1,0,0]);
 const ids=b.objects.slice(-2).map(o=>o.id);
 assert.ok(detectCollisions(b).some(h=>ids.includes(h.a)&&ids.includes(h.b)));
});
