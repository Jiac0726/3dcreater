import {planScene,validateScene,applySceneEdit} from "../src/scene-spec.mjs";
import assert from "node:assert/strict";
import {test} from "node:test";
test("AC-01 three prompts produce distinct scene graphs",()=>{
 const a=planScene("冰山果冻，22只企鹅，破冰船和浮冰");
 const b=planScene("火山岛，火山喷发，小船与动物");
 const c=planScene("果冻实验室，液压机压碎果冻");
 assert.deepEqual([a.kind,b.kind,c.kind],["polar","volcano","lab"]);
 assert.equal(new Set([a,b,c].map(x=>x.objects.map(o=>o.type).join(","))).size,3);
});
test("v0.2 validates object shapes and counts",()=>{
 assert.throws(()=>validateScene({...planScene("冰山"),objects:[{id:"x",type:"evil",position:[0,0,0]}]}));
 assert.throws(()=>validateScene({...planScene("冰山"),objects:[{id:"x",type:"ice",position:[NaN,0,0]}]}));
});
test("AC-04 edits preserve unchanged objects",()=>{
 const s=planScene("冰山和22只企鹅");
 const n=applySceneEdit(s,"改成7只企鹅，蓝莓材质");
 assert.equal(n.objects.find(o=>o.type==="penguin").count,7);
 assert.equal(n.environment.palette,"blue");
 assert.deepEqual(n.objects.find(o=>o.type==="icebreaker"),s.objects.find(o=>o.type==="icebreaker"));
 assert.equal(s.objects.find(o=>o.type==="penguin").count,22);
});
