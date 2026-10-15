import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHistory} from '../src/history.mjs';
import {generateScene,parseModelScene,createServer} from '../server.mjs';
import {planScene} from '../src/scene-spec.mjs';
test('AC-05 undo redo preserves states',()=>{
 const h=createHistory({n:1});h.push({n:2});h.push({n:3});
 assert.deepEqual(h.undo(),{n:2});assert.deepEqual(h.undo(),{n:1});
 assert.deepEqual(h.redo(),{n:2});h.push({n:8});assert.equal(h.canRedo,false);
});
test('AI response is validated, invalid models rejected',()=>{
 assert.equal(parseModelScene(JSON.stringify(planScene('冰山'))).kind,'polar');
 assert.throws(()=>parseModelScene('{"objects":[{"type":"evil"}]}'));
});
test('HTTP generate works without model credentials',async()=>{
 const old=process.env.SCENE_AI_API_KEY;delete process.env.SCENE_AI_API_KEY;
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{const address=server.address();
 const res=await fetch('http://127.0.0.1:'+address.port+'/api/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:'火山岛有小船'})});
 const data=await res.json();assert.equal(res.status,200);assert.equal(data.spec.kind,'volcano');assert.equal(data.mode,'rules');
 }finally{await new Promise(resolve=>server.close(resolve));if(old)process.env.SCENE_AI_API_KEY=old}
});
