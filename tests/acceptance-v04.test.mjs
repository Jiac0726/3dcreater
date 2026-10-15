import {test} from 'node:test';
import assert from 'node:assert/strict';
import {planScene,validateScene,applySceneEdit} from '../src/scene-spec.mjs';
const cases=[
 ['冰山果冻，有企鹅、破冰船、浮冰','polar',['iceberg','penguin','icebreaker','ice','water']],
 ['一个火山岛，有树木、小船和动物','volcano',['island','volcano','tree','boat','animal','water']],
 ['果冻实验室，使用液压机压缩果冻','lab',['jelly','press']]
];
test('AC-01: different descriptions produce genuinely different object types',()=>{
 const signatures=[];
 for(const [prompt,kind,expected] of cases){
  const scene=planScene(prompt);
  assert.equal(scene.kind,kind);
  for(const type of expected)assert.ok(scene.objects.some(o=>o.type===type),type);
  signatures.push(scene.objects.map(o=>o.type).join(','));
 }
 assert.equal(new Set(signatures).size,3);
});
test('AC-02 component catalog includes at least ten distinct types',()=>{
 const types=new Set(cases.flatMap(c=>planScene(c[0]).objects.map(o=>o.type)));
 assert.ok(types.size>=10, 'found '+types.size+' object types');
});
test('SceneSpec rejects duplicate ids and invalid vectors',()=>{
 const scene=planScene('冰山果冻');
 assert.throws(()=>validateScene({...scene,objects:[scene.objects[0],scene.objects[0]]}));
 assert.throws(()=>validateScene({...scene,objects:[{id:'bad',type:'ice',position:[NaN,0,0]}]}));
});
test('AC-04: editing changes only addressed settings',()=>{
 const before=planScene('冰山果冻，22只企鹅');
 const after=applySceneEdit(before,'改成7只企鹅，蓝莓材质');
 assert.equal(after.objects.find(o=>o.type==='penguin').count,7);
 assert.equal(after.environment.palette,'blue');
 assert.deepEqual(after.objects.find(o=>o.type==='icebreaker'),before.objects.find(o=>o.type==='icebreaker'));
});
