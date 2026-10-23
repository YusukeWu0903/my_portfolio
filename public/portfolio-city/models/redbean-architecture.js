import * as T from '../vendor/three.module.js';
import {cachedAsset,unitBox} from './resources.js';
const sphere=cachedAsset('geometry','redbean-topiary-v1',()=>new T.SphereGeometry(1,12,8));
function mat(color,roughness=.3,metalness=.15,emission=0){return cachedAsset('redbeanPhysical',JSON.stringify([color,roughness,metalness,emission]),()=>{const m=new T.MeshPhysicalMaterial({color,roughness,metalness,clearcoat:.65,clearcoatRoughness:.2,emissive:color,emissiveIntensity:emission,envMapIntensity:1});m.userData.approvedArchitecture=true;return m;});}
export const palette={slate:mat('#425565',.48),stone:mat('#beb7a3',.5),navy:mat('#293844',.4),glass:mat('#457f85',.17,.44),ivory:mat('#e8dbc6',.35),paleGlass:mat('#a6cccb',.19,.4)};
const P={pearl:mat('#e0d9ce',.3,.12),cream:mat('#c5b5a0',.42,.08),gold:mat('#c6a46a',.23,.72),dark:mat('#24363d',.35,.24),glass:mat('#639d9f',.17,.42),shadowGlass:mat('#244b56',.17,.48),emerald:mat('#164e45',.26,.28),emeraldLight:mat('#397c6d',.24,.25),ruby:mat('#7d2442',.27,.29),wood:mat('#68453d',.45,.1),black:mat('#17252a',.19,.37),ivory:mat('#f4e5c5',.33,.08),soil:mat('#3e4942',.85,0),grass:mat('#4d7357',.8),leaf:mat('#34634d',.72),pink:mat('#b98691',.29,.2),paving:mat('#8c9895',.68,.01)};
for(const m of [P.glass,P.shadowGlass,palette.glass,palette.paleGlass])m.userData.architectureWindow=true;
function mesh(g,n,geo,m){const o=new T.Mesh(geo,m);o.name=n;o.castShadow=o.receiveShadow=true;g.add(o);return o;}
function box(g,n,x,y,z,w,h,d,m){const o=mesh(g,n,unitBox,m);o.position.set(x,y,z);o.scale.set(w,h,d);return o;}
function ball(g,n,x,y,z,rx,ry,rz,m){const o=mesh(g,n,sphere,m);o.position.set(x,y,z);o.scale.set(rx,ry,rz);return o;}
function cyl(g,n,x,y,z,r,h,m,seg=24){const o=mesh(g,n,new T.CylinderGeometry(r,r,h,seg),m);o.position.set(x,y,z);return o;}
function tube(g,n,points,r,m){return mesh(g,n,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),Math.max(16,points.length*3),r,6,false),m);}
function beam(g,n,a,b,r,m){const A=new T.Vector3(...a),B=new T.Vector3(...b),o=mesh(g,n,new T.CylinderGeometry(r,r,A.distanceTo(B),8),m);o.position.copy(A).add(B).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),B.sub(A).normalize());return o;}
function plan(g,n,points,y,h,m,bevel=.12){const s=new T.Shape();points.forEach(([x,z],i)=>i?s.lineTo(x,-z):s.moveTo(x,-z));s.closePath();const geo=new T.ExtrudeGeometry(s,{depth:h,steps:1,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:2,curveSegments:16});geo.rotateX(-Math.PI/2);const o=mesh(g,n,geo,m);o.position.y=y;return o;}
function panel(g,n,verts,m){const geo=new T.BufferGeometry(),indices=[];for(let i=1;i<verts.length-1;i++)indices.push(0,i,i+1);geo.setAttribute('position',new T.Float32BufferAttribute(verts.flat(),3));geo.setIndex(indices);geo.computeVertexNormals();const o=mesh(g,n,geo,m);o.material=sideMaterial(m);return o;}
function glow(color){const m=mat(color,.28,.05,.7).clone();m.userData.shared=false;m.userData.liveMotion=true;return m;}
function landscape(g){box(g,'24x24-parcel',0,-.4,0,24,.8,24,palette.slate);box(g,'paving',0,.03,0,23.8,.12,23.8,P.paving);
 for(const x of[-11,11]){box(g,'green-border',x,.2,0,1,.22,21,P.grass);for(const z of[-8,0,8]){box(g,'planter',x,.5,z,1.1,.7,1.4,P.cream);ball(g,'topiary',x,1.25,z,.5,.7,.62,P.leaf);}}
 for(let x=-9;x<=9;x+=3)box(g,'paving-joint',x,.105,10.5,.035,.01,2.2,P.dark);}
function entry(g,x,z,width=4,y=2.7){box(g,'entrance-recess',x,y,z,width+.45,4.8,.3,P.dark);box(g,'entry-glass',x,y,z+.19,width,4.5,.1,P.glass);for(const dx of[-width/2,0,width/2])box(g,'brass-door-frame',x+dx,y,z+.3,.09,4.7,.12,P.gold);for(const dx of[-.22,.22])box(g,'door-handle',x+dx,y,z+.41,.06,.7,.1,P.gold);for(let i=0;i<2;i++)box(g,'entry-step',x,.18+i*.15,z+.7-i*.28,width+1,.2,1.2-i*.28,P.pearl);}
function band(g,n,x0,x1,zfn,y,h,m,parts=24){for(let i=0;i<parts;i++){const a=x0+(x1-x0)*i/parts,b=x0+(x1-x0)*(i+1)/parts,za=zfn(a),zb=zfn(b);panel(g,n,[[a,y,za],[b,y,zb],[b,y+h,zb],[a,y+h,za]],m);}}
function batch(g){const groups=new Map();for(const o of [...g.children])if(o.isMesh&&o.geometry===unitBox&&!o.material.userData.liveMotion){let arr=groups.get(o.material);if(!arr)groups.set(o.material,arr=[]);arr.push(o);}for(const [m,arr]of groups){const im=new T.InstancedMesh(unitBox,m,arr.length);im.name='batched-facade-and-landscape';arr.forEach((o,i)=>{o.updateMatrix();im.setMatrixAt(i,o.matrix);g.remove(o);});im.castShadow=im.receiveShadow=true;g.add(im);}}
function finish(g,kind,parts){g.traverse(o=>{if(o.isMesh&&o.material?.userData.liveMotion)o.castShadow=false;});if(parts.jewel)parts.jewel.traverse(o=>{if(o.isMesh)o.castShadow=false;});batch(g);mergeStatic(g);g.userData={kind,parts,frames:48,singleStructure:true};return g;}
function frontPoints(fn,w=10,n=28){return Array.from({length:n+1},(_,i)=>{const x=w-i*2*w/n;return[x,fn(x)];});}
function windowBox(g,x,y,z,w,h,d=.1,m=P.shadowGlass){box(g,'window-recess',x,y,z,w+.15,h+.15,d+.1,P.dark);box(g,'reflective-window',x,y,z+(z<0?-.12:.12),w,h,d,m);}

export function createRedbean(){
 const g=new T.Group();landscape(g);
 const R={brick:mat('#91434a',.36,.12),wine:mat('#642b3c',.29,.22),stone:mat('#cfbfa5',.34,.13),glass:mat('#396f7b',.16,.44),darkGlass:mat('#213e4d',.18,.46),bronze:mat('#ba9056',.23,.7),ink:mat('#262d37',.3,.3)};
 R.glass.userData.architectureWindow=R.darkGlass.userData.architectureWindow=true;
 const outline=[[-10,-9.4],[10,-9.4],[10,6.5],[8,8],[5.9,8],[5.9,3.8],[-5.9,3.8],[-5.9,8],[-8,8],[-10,6.5]];
 plan(g,'continuous-enclosed-film-headquarters',outline,.4,27.9,R.brick,.15);
 // Full six-storey structural wings and real loading entrance to the rear studio.
 for(const y of[.85,5.2,9.7,14.2,18.7,23.2,28.4]){for(const x of[-8,8])box(g,'stone-facade-belt',x,y,8.18,4,.25,.45,R.stone);for(const x of[-10.15,10.15])box(g,'side-stone-floor-belt',x,y,-1.2,.25,.25,16.8,R.stone);}
 for(const y of[2.9,7.4,11.9,16.4,20.9,25.4]){for(const x of[-8,8]){windowBox(g,x,y,8.2,2.8,3.1,.12,R.glass);box(g,'brass-window-sill',x,y-1.7,8.44,3.1,.16,.4,R.bronze);}for(const x of[-10.18,10.18])for(const z of[-6.8,-2.8,1.2,5.2]){box(g,'side-window-frame',x,y,z,.22,3.35,2.85,R.ink);box(g,'side-reflective-window',x+Math.sign(x)*.14,y,z,.08,3.05,2.55,R.darkGlass);}}
 for(const x of[-9.6,-5.8,5.8,9.6]){box(g,'front-stone-pier',x,14.45,8.25,.36,28.2,.42,R.stone);box(g,'pier-bronze-inlay',x,14.45,8.5,.07,27.6,.08,R.bronze);}
 for(let y=1.8;y<28;y+=1.1)for(const x of[-10.23,10.23])box(g,'subtle-brick-mortar-course',x,y,-1.2,.025,.035,16.1,R.stone);
 box(g,'rear-soundstage-loading-door',0,3.8,-9.6,7.6,6.8,.2,R.ink);
 for(let y=1.2;y<=6.9;y+=.6)box(g,'loading-door-horizontal-rib',0,y,-9.75,7.4,.07,.12,R.bronze);
 for(const x of[-8.3,8.3])for(const y of[3.4,8.3,12.6,17.1,21.6,26.1])windowBox(g,x,y,-9.6,2.3,2.7,.1,R.darkGlass);
 for(const x of[-3.7,0,3.7])for(const y of[11.5,16,20.5,25])windowBox(g,x,y,-9.6,2.8,3.5,.1,R.glass);
 // A true hollow curved lobby: glazing in front of a recessed wall, visible floor and balcony.
 const front=x=>8.15+.92*Math.cos(x/5.9*Math.PI/2),clear=mat('#92c2c5',.15,.2);clear.transparent=true;clear.opacity=.43;clear.depthWrite=false;clear.userData.architectureWindow=true;
 const lobby=[[-5.9,3.7],[5.9,3.7],...frontPoints(front,5.9)];
 plan(g,'joined-lobby-floor',lobby,.45,.25,R.stone,.05);
 band(g,'curved-double-height-lobby',-5.9,5.9,x=>front(x),.8,26,clear,28);
 for(let x=-5.6;x<=5.7;x+=1.4){const z=front(x)+.08;box(g,'lobby-brass-mullion',x,13.75,z,.1,25.8,.14,R.bronze);}
 for(const y of[6.5,11,15.5,20]){box(g,'lobby-mezzanine-floor',0,y,5.0,11.5,.26,2.4,R.stone);
 box(g,'interior-balustrade',0,y+1.1,6.15,10.8,.1,.12,R.bronze);for(const x of[-5,0,5])box(g,'interior-balcony-post',x,y+.6,6.15,.1,1.0,.12,R.bronze);}
 plan(g,'closed-lobby-roof',lobby,26.9,.65,R.stone,.1);
 // Attached barrel vault over the soundstage is a solid roof, not a loose ribbon.
 const vaultShape=new T.Shape();vaultShape.moveTo(-10.05,14.8);vaultShape.lineTo(10.05,14.8);vaultShape.bezierCurveTo(7.2,17.3,-7.2,17.3,-10.05,14.8);vaultShape.closePath();
 const vaultGeo=new T.ExtrudeGeometry(vaultShape,{depth:12.8,steps:1,bevelEnabled:true,bevelSize:.12,bevelThickness:.1,bevelSegments:2,curveSegments:28});const vault=mesh(g,'closed-soundstage-barrel-vault',vaultGeo,R.wine);vault.position.z=-9.4;vault.position.y=13.5;
 // A single attached Art Deco central crown grows out of the continuous roof.
 box(g,'integral-central-office-crown',0,18.5,-1.0,8.6,7.4,8.8,R.stone);
 box(g,'stepped-central-upper-crown',0,22.1,-1.3,6.9,2.6,7.5,R.brick);
 box(g,'bronze-central-crown-cap',0,23.55,-1.3,7.25,.32,7.8,R.bronze);
 for(const x of[-3.75,-2.5,0,2.5,3.75]){box(g,'art-deco-crown-glazing',x,18.4,3.48,x===0?1.6:.7,5.7,.12,R.glass);box(g,'art-deco-crown-bronze-fin',x+.48,18.5,3.6,.1,6.8,.2,R.bronze);}
 for(const x of[-4.4,4.4])for(const z of[-3.8,-.7,2.3])box(g,'crown-side-glazing',x,18.5,z,.12,5.5,2.1,R.darkGlass);
 // Broad supported premiere-era canopy; film perforations belong to a filled ribbon.
 const edge=[];for(let i=0;i<=32;i++){const x=-6.7+i*13.4/32,y=6.4+.6*Math.cos(x/6.7*Math.PI/2),z=10.05+.3*Math.cos(x/6.7*Math.PI/2);edge.push([x,y,z]);if(i<32){const xx=x+13.4/32,yy=6.4+.6*Math.cos(xx/6.7*Math.PI/2),zz=10.05+.3*Math.cos(xx/6.7*Math.PI/2);panel(g,'filled-filmstrip-entrance-canopy',[[x,y,8.6],[xx,yy,8.6],[xx,yy,zz],[x,y,z]],R.wine);}}
 tube(g,'canopy-bronze-lip',edge,.13,R.bronze);
 for(const x of[-6.25,6.25])box(g,'canopy-structural-column',x,3.3,9.7,.19,6.1,.19,R.bronze);
 for(let x=-6;x<=6;x+=.8){box(g,'filmstrip-perforation',x,6.3+.6*Math.cos(x/6.7*Math.PI/2),10.4,.31,.18,.11,R.stone);}
 entry(g,0,9.25,4.5);
 for(const x of[-4.5,4.5]){box(g,'front-planter',x,.7,10.4,1.7,.75,1.15,R.stone);ball(g,'entrance-shrub',x,1.45,10.4,.7,.5,.5,P.leaf);}
 // A perforated reel with actual holes and a visible spindle, large enough for city view.
 const reel=new T.Group();reel.name='rotating-film-reel';reel.position.set(0,36.9,4.25);g.add(reel);
 const shape=new T.Shape();shape.absarc(0,0,3.3,0,Math.PI*2,false);
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5,hole=new T.Path();hole.absarc(Math.cos(a)*1.87,Math.sin(a)*1.87,.65,0,Math.PI*2,true);shape.holes.push(hole);}
 const disk=mesh(reel,'real-perforated-film-reel',new T.ExtrudeGeometry(shape,{depth:.4,steps:1,bevelEnabled:true,bevelSize:.07,bevelThickness:.06,bevelSegments:2,curveSegments:24}),R.bronze);
 const hub=cyl(reel,'film-reel-centre-hub',0,0,.4,.54,.65,R.wine,24);hub.rotation.x=Math.PI/2;
 const rim=mesh(reel,'reel-polished-rim',new T.TorusGeometry(3.25,.1,6,64),R.stone);rim.position.z=.43;
 box(g,'reel-sign-attached-support',0,33.5,4.1,.35,4.8,.35,R.bronze);
 reel.traverse(o=>{if(o.isMesh)o.castShadow=false;});
 const lamps=[];for(let i=0;i<15;i++){const x=-6.2+i*12.4/14,m=glow('#f6c78e');lamps.push(ball(g,'marquee-chase-light',x,6.15+.6*Math.cos(x/6.7*Math.PI/2),10.45,.12,.12,.12,m));}
 for(const o of g.children)if(o.name.includes('crown'))o.position.y+=13.5;return finish(g,'redbean',{reel,lamps});
}
export function setBuildingFrame(g,frame){const a=((frame%48)+48)%48/48*Math.PI*2,p=g.userData.parts;p.reel.rotation.z=a;p.lamps.forEach((o,i)=>o.material.emissiveIntensity=.35+.9*(.5+.5*Math.sin(a*2-i*.65)));}

export function measureBuilding(g){let triangles=0,meshes=0,instances=0;g.traverse(o=>{if(o.isMesh){meshes++;const n=o.isInstancedMesh?o.count:1;instances+=n;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*n;}});g.updateMatrixWorld(true);const b=new T.Box3().setFromObject(g);return {triangles,meshes,instances,bounds:{min:b.min.toArray(),max:b.max.toArray()}};}

const doubleSided=new Map();
function sideMaterial(m){if(!doubleSided.has(m)){const v=cachedAsset('redbeanSurface',m.uuid,()=>{const c=m.clone();c.side=T.DoubleSide;return c;});doubleSided.set(m,v);}return doubleSided.get(m);}
function mergeStatic(g){const groups=new Map();for(const o of [...g.children])if(o.isMesh&&!o.isInstancedMesh&&!o.material.userData.liveMotion){const key=o.material.uuid;let arr=groups.get(key);if(!arr)groups.set(key,arr=[]);arr.push(o);}for(const arr of groups.values()){if(arr.length<2)continue;const pos=[],norm=[],indices=[];for(const o of arr){o.updateMatrix();const a=o.geometry.attributes.position,n=o.geometry.attributes.normal,base=pos.length/3,normalMatrix=new T.Matrix3().getNormalMatrix(o.matrix);for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(o.matrix);pos.push(p.x,p.y,p.z);const v=new T.Vector3().fromBufferAttribute(n,i).applyMatrix3(normalMatrix).normalize();norm.push(v.x,v.y,v.z);}const ix=o.geometry.index;if(ix)for(const i of ix.array)indices.push(base+i);else for(let i=0;i<a.count;i++)indices.push(base+i);g.remove(o);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new T.Float32BufferAttribute(norm,3));geo.setIndex(indices);const out=mesh(g,'merged-static-architectural-surfaces',geo,arr[0].material);out.castShadow=arr.some(o=>o.castShadow);}}

