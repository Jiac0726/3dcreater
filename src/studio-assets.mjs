// Original procedural art direction inspired by polar material studies.
// Generated geometry only; no third-party source or artwork embedded.
export function createStudioKit(THREE, world) {
 const material=(color,roughness=.65,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
 const place=(parent,geo,mat,x=0,y=0,z=0)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);return m};
 const iceMaterial=new THREE.MeshPhysicalMaterial({color:0xe2f8fa,roughness:.19,metalness:.04,transparent:true,opacity:.89,transmission:.08,clearcoat:.48,clearcoatRoughness:.16,flatShading:true});
 const snowMat=material(0xf4f9f5,.93);
 const deepMat=material(0x66949d,.72);
 const dark=material(0x243d43,.72), white=material(0xf6f6ec,.88), orange=material(0xe3a54a,.64);
 const scarlet=material(0xae5953,.38),steel=material(0x68828a,.37,.27);
 const hash=i=>{const v=Math.sin(i*127.1+13.37)*43758.5453;return v-Math.floor(v)};
 function iceberg(parent,x=0,y=0,z=0,size=1,seed=0){
  const group=new THREE.Group();group.position.set(x,y,z);group.scale.setScalar(size);parent.add(group);
  let verts=[],rings=[[0,1.07],[.33,.96],[.94,.79],[1.75,.50],[2.45,.12]];
  const N=11;
  for(let ring=0;ring<rings.length-1;ring++)for(let j=0;j<N;j++){
   const angle=j*Math.PI*2/N,next=(j+1)*Math.PI*2/N;
   const point=(r,a,layer,idx)=>{
    const twist=1+.12*(hash(seed+idx*13+layer*17)-.5);
    return [Math.cos(a)*r*twist,layer,Math.sin(a)*r*.86*twist];
   };
   const [lo,r0]=rings[ring],[hi,r1]=rings[ring+1];
   const a=point(r0,angle,lo,j),b=point(r0,next,lo,j+1),c=point(r1,angle,hi,j),d=point(r1,next,hi,j+1);
   verts.push(...a,...b,...c,...b,...d,...c);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.computeVertexNormals();
  const cliff=place(group,geo,iceMaterial,0,0,0);cliff.material.side=THREE.DoubleSide;
  const cap=place(group,new THREE.ConeGeometry(.25,.72,5),snowMat,-.08,2.42,-.07);
  cap.rotation.z=.24;
  for(let j=0;j<7;j++){
   const a=j*2.4+seed,r=.26+.39*hash(seed+j);
   const spike=place(group,new THREE.ConeGeometry(.10+.09*hash(j+seed),.40+.43*hash(j*5+seed),4),j%2?iceMaterial:snowMat,
    Math.cos(a)*r,1.78+.16*hash(j+seed),Math.sin(a)*r);
   spike.rotation.z=(hash(j*11+seed)-.5)*.27;
  }
  return group;
 }
 function penguin(parent,x,z,scale=.8){
  const g=new THREE.Group();g.position.set(x,.86,z);g.scale.setScalar(scale);parent.add(g);
  place(g,new THREE.SphereGeometry(.13,12,10),dark,0,.19,0).scale.set(.87,1.43,.78);
  place(g,new THREE.SphereGeometry(.103,12,10),white,0,.18,.08).scale.set(.78,1.04,.48);
  place(g,new THREE.SphereGeometry(.096,12,10),dark,0,.415,0);
  place(g,new THREE.ConeGeometry(.045,.13,5),orange,0,.37,.115).rotation.x=Math.PI/2;
  for(const sign of [-1,1]){
   place(g,new THREE.SphereGeometry(.019,8,8),white,sign*.042,.445,.077);
   place(g,new THREE.SphereGeometry(.01,7,7),dark,sign*.042,.446,.093);
   const flipper=place(g,new THREE.SphereGeometry(.06,9,7),dark,sign*.13,.18,0);
   flipper.scale.set(.42,1.8,.7);flipper.rotation.z=sign*.26;
   place(g,new THREE.SphereGeometry(.047,7,6),orange,sign*.06,.035,.075).scale.set(.8,.30,1.5);
  }
  g.userData.phase=hash(x*17+z*91)*6.28;
  return g;
 }
 function ship(parent,x,y,z){
  const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);
  const hull=place(g,new THREE.BoxGeometry(.46,.24,1.03),scarlet,0,0,0);
  const bow=place(g,new THREE.ConeGeometry(.235,.43,5),scarlet,0,0,-.62);bow.rotation.x=Math.PI/2;
  place(g,new THREE.BoxGeometry(.46,.075,.93),white,0,.15,0);
  place(g,new THREE.BoxGeometry(.30,.23,.38),white,0,.28,.10);
  place(g,new THREE.BoxGeometry(.24,.16,.25),steel,0,.48,.14);
  place(g,new THREE.BoxGeometry(.27,.06,.29),dark,0,.58,.13);
  const chimney=place(g,new THREE.CylinderGeometry(.058,.068,.23,10),steel,0,.53,-.27);
  for(let i=0;i<4;i++)for(const sign of [-1,1]){
   place(g,new THREE.BoxGeometry(.015,.065,.055),dark,sign*.157,.35,-.02+i*.10);
  }
  place(g,new THREE.CylinderGeometry(.01,.01,.42,7),dark,0,.74,-.10);
  place(g,new THREE.SphereGeometry(.04,8,6),orange,0,.96,-.10);
  return g;
 }
 function diorama(){
  const block=place(world,new THREE.BoxGeometry(6.75,.7,6.75),
   new THREE.MeshPhysicalMaterial({color:0x8acacd,transparent:true,opacity:.35,roughness:.10,metalness:.04,depthWrite:false,side:THREE.DoubleSide}),0,.12,0);
  const bottom=place(world,new THREE.BoxGeometry(6.75,.11,6.75),deepMat,0,-.27,0);
  const highlight=new THREE.LineSegments(
   new THREE.EdgesGeometry(new THREE.BoxGeometry(6.75,.7,6.75)),
   new THREE.LineBasicMaterial({color:0xcaf2ee,transparent:true,opacity:.31})
  );highlight.position.y=.12;world.add(highlight);
  const shore=new THREE.Group();world.add(shore);
  const peninsula=place(shore,new THREE.CylinderGeometry(.98,1.16,.39,13),snowMat,1.65,.76,1.49);
  peninsula.scale.z=.76;
  for(let i=0;i<11;i++){
   const a=i*2.399+1,r=.18+.72*Math.sqrt((i+1)/12);
   const x=1.65+Math.cos(a)*r,z=1.49+Math.sin(a)*r*.65;
   const rock=place(shore,new THREE.DodecahedronGeometry(.08+.13*hash(i*8),0),i%4===0?deepMat:snowMat,x,.99,z);
   rock.scale.y=.43+.7*hash(i+4);
  }
  for(let i=0;i<23;i++){
   const a=hash(i+3)*6.28,r=1.9+hash(i+17)*.5;
   const p=place(shore,new THREE.DodecahedronGeometry(.08+.14*hash(i+19),0),i%4===0?deepMat:snowMat,
    -1.45+Math.cos(a)*r,.60,-1.10+Math.sin(a)*r);
   p.scale.y=.4+.65*hash(i+1);
  }
  return {block,bottom,shore};
 }
 return {iceberg,penguin,ship,diorama};
}
