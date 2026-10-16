// Localized surface-wave solver for a regular Three.js PlaneGeometry.
// Damped nearest-neighbor finite differences. Not full fluid dynamics.
export function createWaveSimulation(width=57,height=57) {
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<3||height<3||width>256||height>256) throw Error('Invalid grid');
 const size=width*height, h=new Float32Array(size),v=new Float32Array(size);
 function splash(x,z,strength=.6){
  if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(strength))throw Error('Invalid splash');
  const px=Math.max(1,Math.min(width-2,Math.round((x/6.4+.5)*(width-1))));
  const pz=Math.max(1,Math.min(height-2,Math.round((z/6.4+.5)*(height-1))));
  for(let dz=-3;dz<=3;dz++)for(let dx=-3;dx<=3;dx++){
   const xx=px+dx,zz=pz+dz;if(xx<1||xx>=width-1||zz<1||zz>=height-1)continue;
   const falloff=Math.exp(-(dx*dx+dz*dz)/4);
   v[zz*width+xx]+=strength*falloff;
  }
 }
 function step(dt=1/60,energy=.4){
  dt=Math.max(0,Math.min(dt,1/30));energy=Math.max(0,Math.min(1,energy));
  const spring=80+70*energy,damping=1.4+2.0*(1-energy);
  for(let z=1;z<height-1;z++)for(let x=1;x<width-1;x++){
   const i=z*width+x,lap=h[i-1]+h[i+1]+h[i-width]+h[i+width]-4*h[i];
   v[i]+=lap*spring*dt;v[i]*=Math.exp(-damping*dt);
  }
  for(let i=0;i<size;i++){h[i]=Math.max(-.38,Math.min(.38,h[i]+v[i]*dt));if(!Number.isFinite(h[i])){h[i]=0;v[i]=0;}}
 }
 function writeTo(attribute,base){
  if(attribute.count!==size)throw Error('Wave mesh vertex count mismatch');
  for(let i=0;i<size;i++)attribute.array[i*3+1]=base[i*3+1]+h[i];
  attribute.needsUpdate=true;
 }
 function meanEnergy(){let sum=0;for(let i=0;i<size;i++)sum+=h[i]*h[i]+v[i]*v[i]*.01;return sum/size}
 return {width,height,heights:h,velocities:v,splash,step,writeTo,meanEnergy};
}
