import {validateScene} from './scene-spec.mjs';
// Deterministic planar circle solver for editable static scene objects.
// Not a replacement for a full rigid-body engine.
const radii={iceberg:1.05,penguin:.12,icebreaker:.40,ice:.27,island:1.8,volcano:.9,tree:.22,boat:.38,animal:.26,jelly:1.0,press:.9};
export function resolveSceneOverlaps(spec,options={}){
 const next=JSON.parse(JSON.stringify(validateScene(spec))),iterations=options.iterations??6;
 if(!Number.isInteger(iterations)||iterations<1||iterations>40)throw Error('Invalid iterations');
 const items=next.objects.filter(o=>Object.hasOwn(radii,o.type)&&!(o.count>1));
 let resolved=0;
 for(let k=0;k<iterations;k++)for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
  const a=items[i],b=items[j],dx=b.position[0]-a.position[0],dz=b.position[2]-a.position[2],
  min=(radii[a.type]+radii[b.type])*.8,dist=Math.hypot(dx,dz);
  if(dist>=min)continue;
  const nx=dist<1e-7?1:dx/dist,nz=dist<1e-7?0:dz/dist,delta=(min-dist)/2;
  a.position[0]-=nx*delta;a.position[2]-=nz*delta;
  b.position[0]+=nx*delta;b.position[2]+=nz*delta;resolved++;
 }
 return {spec:validateScene(next),resolved};
}
