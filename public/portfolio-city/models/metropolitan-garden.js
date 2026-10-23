import * as T from '../vendor/three.module.js';
import {cachedAsset,unitBox,unitCylinder} from './resources.js';
import {applyArchitecturalReflections} from './architectural-reflections.js';

// A complete authored 56-unit site. Scale uniformly; no selected-plot randomness.
const geometry=(key,make)=>cachedAsset('gardenGeometry',key,make);
function petalGeometry(){
 const p=[],idx=[],nx=12,ny=6;
 for(let i=0;i<=nx;i++)for(let j=0;j<=ny;j++){
  const u=i/nx,v=j/ny*2-1,r=1+10*u;
  p.push(r,9+3.4*u*u+1.35*v*v*Math.sin(Math.PI*u),v*(.45+3.4*Math.sin(Math.PI*u*.9)));
 }
 for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const a=i*(ny+1)+j,b=a+ny+1;idx.push(a,a+1,b,a+1,b+1,b);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function ribbon(points,width,y){
 const curve=new T.CatmullRomCurve3(points.map(([x,z])=>new T.Vector3(x,y,z)),true),p=[],idx=[],n=96;
 for(let i=0;i<=n;i++){const t=i/n,c=curve.getPointAt(t),d=curve.getTangentAt(t),normal=new T.Vector3(-d.z,0,d.x).normalize();for(const s of[-1,1])p.push(c.x+normal.x*width*.5*s,y,c.z+normal.z*width*.5*s);if(i<n){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
function poolShape(){const s=new T.Shape();for(let i=0;i<=72;i++){const a=i/72*Math.PI*2,r=1+.13*Math.cos(a*3);const x=9+8.6*r*Math.cos(a),z=2+14*r*Math.sin(a);if(i===0)s.moveTo(x,-z);else s.lineTo(x,-z);}s.closePath();return s;}
function batchStatic(root){
 const buckets=new Map();for(const o of [...root.children])if(o.isMesh&&!o.userData.animated){const key=o.geometry.uuid+':'+o.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);}
 for(const list of buckets.values())if(list.length>1){const m=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((o,i)=>{o.updateMatrix();m.setMatrixAt(i,o.matrix);root.remove(o);});m.castShadow=list[0].castShadow;m.receiveShadow=true;m.computeBoundingSphere();root.add(m);}
}
export function metropolitanGarden(width=56,depth=56){
 const root=new T.Group(),raw=new T.Group(),motion=new T.Group();root.add(raw);raw.add(motion);raw.name='metropolitan-garden-site';motion.name='garden-water-and-lights';
 raw.scale.setScalar(Math.min(width,depth)/56*.999999);
 const standard=(color,roughness=.7,metalness=.05)=>new T.MeshStandardMaterial({color,roughness,metalness});
 const m={stone:standard('#d6c7ad'),pave:standard('#f0dfbf'),grass:standard('#458566'),soil:standard('#456653'),wood:standard('#83523f'),trunk:standard('#6c5945'),leaf:standard('#387d61'),leaf2:standard('#63a578'),leaf3:standard('#a4bd72'),pink:standard('#da789b'),lavender:standard('#9d82b7'),gold:standard('#c4a267',.28,.65),canopy:new T.MeshPhysicalMaterial({color:'#f2e6cf',roughness:.27,metalness:.18,clearcoat:.7,side:T.DoubleSide}),water:new T.MeshPhysicalMaterial({color:'#329caa',roughness:.12,metalness:.25,clearcoat:1}),jet:new T.MeshPhysicalMaterial({color:'#a5ebf0',roughness:.2,metalness:.15,transparent:true,opacity:.78,depthWrite:false})};
 m.pink.side=T.DoubleSide;for(const key of['water','gold','canopy'])m[key].userData.approvedArchitecture=true;
 const warm=new T.MeshStandardMaterial({color:'#ffe4af',emissive:'#ffc980',emissiveIntensity:1.7,roughness:.4});warm.userData.liveMotion=true;
 const glowMap=cachedAsset('texture','metropolitan-garden-glow-v1',()=>{const px=new Uint8Array(64*64*4);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const i=(y*64+x)*4,r=Math.hypot(x-31.5,y-31.5)/31.5;px.set([255,255,255,Math.round(180*Math.pow(Math.max(0,1-r),2))],i);}const t=new T.DataTexture(px,64,64);t.needsUpdate=true;return t;});
 const glow=new T.MeshBasicMaterial({color:'#ffd59b',map:glowMap,transparent:true,opacity:.46,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});glow.userData.liveMotion=true;glow.userData.nightWindow=true;
 const aqua=new T.MeshBasicMaterial({color:'#96e4e4',transparent:true,opacity:.55,depthWrite:false,toneMapped:false});aqua.userData.liveMotion=true;
 m.jet.userData.liveMotion=true;
 const mesh=(geo,mat,x=0,y=0,z=0,parent=raw)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=parent!==motion;o.receiveShadow=true;parent.add(o);return o;};
 const box=(x,y,z,w,h,d,mat)=>{const o=mesh(unitBox,mat,x,y,z);o.scale.set(w,h,d);return o;};
 box(0,.23,0,55.2,.46,55.2,m.stone);box(0,.5,0,54.4,.16,54.4,m.grass);
 const route=[[-20,15],[-20,-13],[-8,-20],[13,-19],[22,-4],[20,17],[4,22],[-10,21]];
 mesh(geometry('promenade-curb-v1',()=>ribbon(route,4.3,.62)),m.stone);
 mesh(geometry('promenade-v1',()=>ribbon(route,3.5,.65)),m.pave);
 box(0,.65,25,6,.17,5,m.pave);box(-25,.65,0,5,.17,5,m.pave);box(25,.65,0,5,.17,5,m.pave);
 // Recessed organic pool, with a thick stone lip rather than a floating plane.
 const pool=geometry('pool-v1',()=>new T.ExtrudeGeometry(poolShape(),{depth:.42,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.35,bevelThickness:.15,curveSegments:8}));
 const basin=mesh(pool,m.stone,0,.75,0);basin.rotation.x=-Math.PI/2;
 const water=mesh(geometry('pool-water-v1',()=>new T.ShapeGeometry(poolShape(),12)),m.water,0,1.34,0);water.rotation.x=-Math.PI/2;water.scale.set(.96,.96,1);
 // Six raised flower petals are supported by a fluted trunk and sloping ribs.
 const trunk=mesh(unitCylinder(12),m.gold,-7,4.8,-5);trunk.scale.set(1.6,8.4,1.6);
 const petal=geometry('petal-shell-v1',petalGeometry);
 const edgeGeo=geometry('petal-rim-v1',()=>{const points=[];for(const side of[-1,1])for(let i=0;i<=24;i++){const u=side===-1?i/24:1-i/24,v=side,r=1+10*u;points.push(new T.Vector3(r,9+3.4*u*u+1.35*v*v*Math.sin(Math.PI*u),v*(.45+3.4*Math.sin(Math.PI*u*.9))));}return new T.TubeGeometry(new T.CatmullRomCurve3(points,true),48,.13,5,true);});
 for(let i=0;i<6;i++){
  const a=i/6*Math.PI*2;const shell=mesh(petal,i%3===0?m.pink:m.canopy,-7,0,-5);shell.rotation.y=a;
  const rim=mesh(edgeGeo,m.gold,-7,0,-5);rim.rotation.y=a;
  const ribs=geometry('petal-rib-v1',()=>new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,4,0),new T.Vector3(2,8.8,0),new T.Vector3(6,10.2,0),new T.Vector3(10.4,12,0)]),16,.17,5,false));const rib=mesh(ribs,m.gold,-7,0,-5);rib.rotation.y=a;
  const lamp=mesh(geometry('petal-light-v1',()=>new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(1,8.8,0),new T.Vector3(5,9.65,0),new T.Vector3(10,11.8,0)]),20,.11,5,false)),warm,-7,0,-5,motion);lamp.rotation.y=a;
 }
 const medallion=mesh(unitCylinder(48),m.pave,-7,.77,-5);medallion.scale.set(15.5,.27,15.5);
 // A timber crescent gives the pavilion a usable gathering area.
 for(let i=0;i<22;i++){const a=.15+i/21*Math.PI*1.1;const o=box(-7+Math.cos(a)*8.8,1.25,-5+Math.sin(a)*8.8,1.15,.3,2,m.wood);o.rotation.y=-a;}
 const sphere=geometry('tree-crown-v2',()=>new T.SphereGeometry(1,12,8)),flower=geometry('flower-v1',()=>new T.IcosahedronGeometry(1,0));
 const tree=(x,z,i)=>{const h=4.3+(i%3)*.7;box(x,1.8,z,.38,2.8,.38,m.trunk);const crown=mesh(sphere,[m.leaf,m.leaf2,m.leaf3][i%3],x,h,z);crown.scale.set(1.9,h*.52,1.9);const side=mesh(sphere,i%4===0?m.pink:m.leaf2,x+1.05,h-.65,z+.2);side.scale.set(1.35,1.6,1.35);};
 for(let i=0;i<9;i++){const x=-23+i*5.6;tree(x,-24,i);tree(x,24,i+9);}for(let i=0;i<7;i++){tree(-24,-18+i*6,i+18);tree(24,-18+i*6,i+25);}
 // Dense, continuous flower ribbons, batched by colour and geometry.
 for(const [cx,cz,rx,rz] of[[-15,13,6,3],[-12,-18,8,2],[12,19,7,2]])for(let i=0;i<45;i++){
  const a=i*2.39996,r=Math.sqrt((i+.5)/45),x=cx+Math.cos(a)*rx*r,z=cz+Math.sin(a)*rz*r;
  const bloom=mesh(flower,[m.pink,m.lavender,m.pave][i%3],x,.95+(i%3)*.12,z);bloom.scale.set(.48,.5,.48);
 }
 const bench=(x,z,angle)=>{for(let j=0;j<4;j++){const dx=(j-1.5)*.3;const o=box(x+Math.sin(angle)*dx,1.25,z+Math.cos(angle)*dx,3.6,.15,.22,m.wood);o.rotation.y=angle;}for(const s of[-1,1])box(x+s*Math.cos(angle)*1.35,.9,z-s*Math.sin(angle)*1.35,.2,.6,.8,m.gold);};
 for(const [x,z,a] of[[-19,5,Math.PI/2],[-13,20,0],[1,21,0],[20,12,Math.PI/2],[-16,-17,0]])bench(x,z,a);
 const halo=(x,z,size)=>{const o=mesh(geometry('ground-glow-v1',()=>new T.PlaneGeometry(1,1)),glow,x,.98,z,motion);o.rotation.x=-Math.PI/2;o.scale.setScalar(size);o.userData.noHit=true;return o;};
 halo(-7,-5,20);
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2,x=Math.cos(a)*21,z=Math.sin(a)*21;box(x,1.2,z,.22,1.2,.22,m.gold);mesh(geometry('bollard-lamp-v1',()=>new T.SphereGeometry(.26,8,6)),warm,x,1.9,z,motion);halo(x,z,5);}
 const jets=[];
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2,points=[];for(let j=0;j<=16;j++){const u=j/16,r=2.1+u*3.1;points.push(new T.Vector3(9+Math.cos(a)*r,1.4+Math.sin(Math.PI*u)*3.6,2+Math.sin(a)*r));}const jet=mesh(geometry('fountain-arc-'+i,()=>new T.TubeGeometry(new T.CatmullRomCurve3(points),20,.085,5,false)),m.jet,0,0,0,motion);jets.push(jet);}
 const ripples=[];for(let i=0;i<3;i++){const o=mesh(geometry('water-ripple-v1',()=>new T.RingGeometry(1.5,1.59,48)),aqua,9,1.37,2,motion);o.rotation.x=-Math.PI/2;ripples.push(o);}
 for(const o of[...jets,...ripples])o.userData.animated=true;
 batchStatic(raw);batchStatic(motion);
 const effect={kind:'park',building:root,motion,frames:48,duration:6,setFrame(frame,count=48){const t=((frame%count)+count)%count/count*Math.PI*2;for(let i=0;i<jets.length;i++){jets[i].scale.y=1+.11*Math.sin(t+i*Math.PI/4);}for(let i=0;i<ripples.length;i++){const s=1.2+.4*Math.sin(t+i*Math.PI*2/3);ripples[i].scale.setScalar(s);}warm.emissiveIntensity=1.7+.5*(.5+.5*Math.sin(t));aqua.opacity=.45+.12*Math.cos(t);}};
 effect.setFrame(0);root.userData={purposeKind:'park',greenSpace:3,authoredSite:true,designKey:'metropolitan-flower-garden',gardenEffect:effect,hero:true,siteFit:raw.scale.x};applyArchitecturalReflections(root);return root;
}




