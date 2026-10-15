import {validateScene} from './scene-spec.mjs';
const TYPES=new Set(['iceberg','penguin','icebreaker','ice','water','island','volcano','tree','boat','animal','jelly','press']);
const clone=s=>JSON.parse(JSON.stringify(validateScene(s)));
const limit=(v,a,b)=>Math.min(b,Math.max(a,v));
export function addObject(scene,type,position=[0,1,0]){
 if(!TYPES.has(type))throw Error('Unsupported object type');
 if(!Array.isArray(position)||position.length!==3||!position.every(Number.isFinite))throw Error('Invalid position');
 const next=clone(scene),existing=new Set(next.objects.map(o=>o.id));let i=1,id=type+'-'+i;
 while(existing.has(id))id=type+'-'+(++i);
 next.objects.push({id,type,position:[...position],scale:[1,1,1],behaviors:[]});
 return validateScene(next);
}
export function removeObject(scene,id){
 const next=clone(scene),n=next.objects.length;next.objects=next.objects.filter(o=>o.id!==id);
 if(n===next.objects.length)throw Error('Object not found');
 return validateScene(next);
}
export function moveObject(scene,id,position){
 const next=clone(scene),obj=next.objects.find(o=>o.id===id);
 if(!obj)throw Error('Object not found');
 if(!Array.isArray(position)||position.length!==3||!position.every(Number.isFinite))throw Error('Invalid position');
 obj.position=position.map(x=>limit(x,-50,50));return validateScene(next);
}
export function detectCollisions(scene,threshold=.65){
 validateScene(scene);
 const objects=scene.objects.filter(o=>!['water'].includes(o.type)),hits=[];
 for(let i=0;i<objects.length;i++)for(let j=i+1;j<objects.length;j++){
 const a=objects[i],b=objects[j];
 const d=Math.hypot(...a.position.map((v,k)=>v-b.position[k]));
 if(d<threshold)hits.push({a:a.id,b:b.id,distance:d});
 }return hits;
}
