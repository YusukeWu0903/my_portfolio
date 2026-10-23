import * as T from '../vendor/three.module.js';
import {cachedAsset,unitBox} from './resources.js';
const sphere=cachedAsset('geometry','elegant-topiary-v1',()=>new T.SphereGeometry(1,12,8));
function mat(color,roughness=.3,metalness=.15,emission=0){return cachedAsset('elegantPhysical',JSON.stringify([color,roughness,metalness,emission]),()=>{const m=new T.MeshPhysicalMaterial({color,roughness,metalness,clearcoat:.65,clearcoatRoughness:.2,emissive:color,emissiveIntensity:emission,envMapIntensity:1});m.userData.approvedArchitecture=true;return m;});}
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
export function createWellness(){const g=new T.Group();landscape(g);const f=x=>5.1+3.65*Math.cos(x/9.6*Math.PI/2),outline=[[-9.6,-9.1],[9.6,-9.1],...frontPoints(f,9.6)];
 plan(g,'continuous-eight-floor-wellness',outline,.4,35.9,P.pearl,.15);
 for(const y of[2.2,6.8,11.1,15.4,19.7,24,28.3,32.6]){band(g,'curved-sea-glass-facade',-8.9,8.9,x=>f(x)+.18,y,3.0,P.glass,24);for(let x=-8.4;x<=8.5;x+=1.4){const z=f(x)+.25;beam(g,'champagne-facade-grille',[x,y-.1,z],[x,y+3.15,z],.045,P.gold);}
 for(let x=-7.6;x<=8;x+=2.55)windowBox(g,x,y+1.4,-9.28,2.05,2.65,.1,P.shadowGlass);
 for(const x of[-9.78,9.78])for(let z=-6.8;z<=4;z+=3)box(g,'side-glazed-room',x,y+1.4,z,.1,2.65,2.35,P.shadowGlass);}
 for(const y of[.8,5.9,10.35,14.65,18.95,23.25,27.55,31.85,36.25]){const rim=frontPoints(x=>f(x)+.3,9.6).reverse().map(([x,z])=>[x,y,z]);tube(g,'continuous-pearl-floor-ribbon',rim,.14,y===10.35?P.gold:P.pearl);}
 // A pair of joined pearl wings rises into a shallow roof wave, with no detached tower.
 for(const s of[-1,1]){const points=[];for(let i=0;i<=22;i++){const z=-9+17*i/22,y=36.6+1.3*Math.sin(i/22*Math.PI);points.push([s*9.35,y,z]);}tube(g,'sculpted-pearl-roof-shoulder',points,.38,P.pearl);tube(g,'shoulder-brass-inlay',points.map(([x,y,z])=>[x+s*.03,y+.22,z]),.055,P.gold);}
 plan(g,'closed-pearl-roof',outline,36.35,.42,P.pearl,.15);
 // The facade remains a usable building: entry, glass lobby and supported fan canopy.
 entry(g,0,8.56,4.8);const canopyPts=[[-4.6,8.2],[4.6,8.2],[4.9,9.8],[3.4,10.45],[-3.4,10.45],[-4.9,9.8]];plan(g,'supported-lobby-canopy',canopyPts,5.1,.33,P.pearl,.16);
 for(const x of[-4.25,4.25])box(g,'canopy-column',x,2.8,9.35,.2,5.1,.2,P.gold);
 const pearlWave=[];for(let i=0;i<=36;i++){const x=-9.6+i*19.2/36,y=32.8+2.5*Math.sin((x/9.6)*1.15),z=f(x)+.4;pearlWave.push([x,y,z]);}for(let i=0;i<pearlWave.length-1;i++){const [x,y,z]=pearlWave[i],[xx,yy,zz]=pearlWave[i+1];panel(g,'flowing-pearl-facade-sash',[[x,y-.62,z],[xx,yy-.62,zz],[xx,yy+.62,zz],[x,y+.62,z]],P.pearl);}tube(g,'flowing-sash-gold-rim',pearlWave.map(([x,y,z])=>[x,y+.64,z+.03]),.055,P.gold);
 const lamps=[];for(let i=0;i<7;i++){const x=-7.8+i*2.6,m=glow('#f4cd9c');lamps.push(box(g,'facade-breathing-lamp',x,10.3,f(x)+.47,1.5,.09,.09,m));}
 // Discreet rooftop garden inset into the complete roof, not another pavilion.
 box(g,'roof-garden-planter',0,36.7,-4.7,10.5,.55,5.5,P.gold);box(g,'roof-garden-soil',0,37.0,-4.7,10,.12,5,P.soil);for(const x of[-3.5,0,3.5])ball(g,'roof-garden-shrub',x,37.35,-4.7,1.3,.42,1.6,P.leaf);
 const fairy=fairySilhouette(g,f);return finish(g,'wellness',{lamps,fairy});}
export function createBoutique(){const g=new T.Group();landscape(g);
 const outline=[[-9.8,-7.7],[-7.3,-9.5],[8,-9.5],[9.8,-7.5],[9.8,5.9],[7.7,8.1],[3.5,8.1],[0,9.5],[-3.5,8.1],[-7.6,8.1],[-9.8,5.9]];
 plan(g,'emerald-jewellery-upper-floors',outline,5.5,9.6,P.emerald,.12);box(g,'boutique-rear-shop-envelope',0,2.9,-2.4,19.4,5,13.4,P.emerald);for(const x of[-9.6,9.6])box(g,'shop-structural-side',x,3,5.4,.38,5.2,5.3,P.emerald);
 for(const y of[.8,5.6,10.4,15.2])plan(g,'thin-brass-cornice',outline.map(([x,z])=>[x*1.018,z*1.018]),y,.16,P.gold,.06);
 // Large display bays have three connected planes, like cut gemstones.
 for(const cx of[-6,0,6]){const z=cx===0?9.55:8.15,w=cx===0?2.4:2.1;
 const verts=[[[cx-w,1.3,z],[cx,1.3,z+1.05],[cx,5.0,z+1.05],[cx-w,5.0,z]],[[cx,1.3,z+1.05],[cx+w,1.3,z],[cx+w,5,z],[cx,5,z+1.05]]];
 const showGlass=mat('#a1cec3',.15,.2);showGlass.userData.architectureWindow=true;showGlass.transparent=true;showGlass.opacity=.38;showGlass.depthWrite=false;for(const v of verts){panel(g,'faceted-display-window',v,showGlass);for(let i=0;i<4;i++)beam(g,'brass-display-outline',v[i],v[(i+1)%4],.055,P.gold);}
 box(g,'jewel-display-plinth',cx,1.6,z+.16,1.2,.55,.55,P.ivory);
 const gem=mesh(g,'window-jewel',new T.OctahedronGeometry(.48,0),cx===0?P.pink:P.gold);gem.position.set(cx,2.5,z+.3);}
 // Continuous upper glazing with attached diagonal mullions.
 for(const cx of[-6,0,6]){const z=cx===0?9.95:8.6;windowBox(g,cx,8,z,4.7,3.3,.08,P.shadowGlass);windowBox(g,cx,12.6,z,4.7,2.55,.08,P.glass);
 beam(g,'diagonal-luxury-mullion',[cx-2.2,10.9,z+.28],[cx,14.1,z+.28],.075,P.gold);beam(g,'diagonal-luxury-mullion',[cx,14.1,z+.28],[cx+2.2,10.9,z+.28],.075,P.gold);}
 for(const x of[-10.03,10.03])for(const z of[-5.8,-1.4,3])for(const y of[3.2,8,12.5])box(g,'side-window',x,y,z,.12,2.7,3.1,P.shadowGlass);
 for(let x=-7;x<=7;x+=3.5)for(const y of[3.2,8,12.5])windowBox(g,x,y,-9.68,2.9,2.65,.1);
 // Faceted hip roof is attached to all four edges.
 const peak=[.4,18.2,-1.1],edges=[[-9.8,15.4,-8],[8,15.4,-9.5],[9.8,15.4,6],[0,15.4,9.5],[-9.8,15.4,6]];
 for(let i=0;i<edges.length;i++){panel(g,'emerald-cut-roof-facet',[edges[i],edges[(i+1)%edges.length],peak],i%2?P.emeraldLight:P.emerald);beam(g,'roof-facet-seam',edges[i],peak,.055,P.gold);}
 // Door at the left-cut corner has an unmistakable covered shop entrance.
 entry(g,-6,9.35,3.5);plan(g,'folded-brass-entry-canopy',[[-8.8,8.8],[-3.1,8.8],[-3.1,10.2],[-6,10.8],[-8.8,10.2]],5.2,.25,P.gold,.07);
 const jewel=new T.Group();jewel.position.set(1.6,22.5,1.1);jewel.scale.setScalar(2.5);g.add(jewel);cyl(g,'roof-jewel-stand',1.6,19.1,1.1,.24,5.4,P.gold);
 const gem=mesh(jewel,'rotating-cut-crystal',new T.OctahedronGeometry(1.65,0),P.pink);gem.scale.set(1.1,.78,1.1);
 for(const z of[-.08,.08]){const ring=mesh(jewel,'gold-diamond-setting',new T.TorusGeometry(1.65,.055,6,4),P.gold);ring.position.z=z;ring.rotation.z=Math.PI/4;}
 const lamps=[];for(let i=0;i<8;i++){const m=glow('#f6d397');lamps.push(box(g,'window-gold-glint',-8.4+i*2.4,5.8,8.4,.65,.09,.12,m));}
 return finish(g,'boutique',{jewel,lamps});}
function piano(g){const group=new T.Group();group.position.set(-.4,13.25,-1);group.scale.setScalar(1.55);g.add(group);const sh=new T.Shape();sh.moveTo(-3.4,2.9);sh.lineTo(3.4,2.9);sh.lineTo(3.4,.4);sh.bezierCurveTo(3.5,-2,1.7,-4.3,-.5,-4.3);sh.bezierCurveTo(-3.4,-4.3,-3.4,-2.2,-3.4,.4);sh.closePath();
 const ge=new T.ExtrudeGeometry(sh,{depth:.52,steps:1,bevelEnabled:true,bevelSize:.1,bevelThickness:.08,bevelSegments:2,curveSegments:24});ge.rotateX(Math.PI/2);
 const body=mesh(group,'grand-piano-case',ge,P.black);body.position.y=2.3;
 for(const [x,z]of[[-2.7,2],[2.7,2],[0,-3]]){box(group,'piano-leg',x,1.05,z,.25,2.1,.25,P.black);cyl(group,'piano-caster',x,.14,z,.22,.16,P.gold);}
 const lidPivot=new T.Group();lidPivot.position.set(-3.4,2.68,0);lidPivot.rotation.z=.4;group.add(lidPivot);const lid=mesh(lidPivot,'raised-grand-piano-lid',ge,P.black);lid.position.x=3.4;lid.scale.y=.22;
 beam(group,'lid-support',[2.5,2.4,-1],[2.5,4.1,-1],.055,P.gold);
 box(group,'piano-keyboard-bed',0,2.22,3.5,7,.3,1.7,P.gold);const keys=[],blackKeys=[];
 for(let i=0;i<18;i++){const p=new T.Group();p.position.set(-3.17+i*.373,2.48,2.8);group.add(p);box(p,'ivory-key',0,0,.62,.35,.16,1.3,P.ivory);keys.push(p);}
 for(let i=0;i<17;i++)if(![2,6].includes(i%7)){const p=new T.Group();p.position.set(-2.99+i*.373,2.63,2.85);group.add(p);box(p,'ebony-key',0,0,.36,.17,.18,.78,P.black);blackKeys.push({p,i});}
 box(group,'piano-bench-seat',0,1.4,5.35,3,.35,1.2,P.ruby);for(const x of[-1.1,1.1])for(const z of[4.95,5.75])box(group,'piano-bench-leg',x,.7,z,.12,1.4,.12,P.gold);
 const notes=[];for(const [i,x,z]of[[0,-5,-1],[1,5,-2.3]]){const n=new T.Group();n.position.set(x*.96,3.1+i*.5,z);n.scale.setScalar(1.65);group.add(n);ball(n,'music-note-head',0,0,0,.56,.33,.2,P.gold);box(n,'music-note-stem',.45,1.3,0,.12,2.65,.15,P.gold);beam(n,'music-note-flag',[.45,2.6,0],[1.1,2.2,0],.1,P.gold);notes.push({n,y:n.position.y});}
 group.traverse(o=>{if(o.isMesh)o.castShadow=false;});return {group,keys,blackKeys,notes,lidPivot};}
export function createRestaurant(){const g=new T.Group();landscape(g);const f=x=>5.65+3.05*Math.cos(x/9.8*Math.PI/2),outline=[[-9.8,-9.1],[9.8,-9.1],...frontPoints(f,9.8)];
 plan(g,'continuous-restaurant-floor',outline,.4,.5,P.wood,.14);
 // Solid back and service sides; front is a genuinely hollow double-height dining room.
 box(g,'back-service-wall',0,5.5,-8.5,19.4,10.1,1.1,P.wood);for(const x of[-9.3,9.3])box(g,'side-wall',x,5.5,-3,.6,10.1,11.8,P.wood);
 const clear=mat('#a9cecd',.13,.17);clear.userData.architectureWindow=true;clear.transparent=true;clear.opacity=.32;clear.depthWrite=false;
 band(g,'double-height-dining-glass',-9.65,9.65,x=>f(x),1,9.3,clear,28);
 for(const x of[-9.7,9.7])panel(g,'side-front-glazing',[[x,1,2.9],[x,1,7.4],[x,10.3,7.4],[x,10.3,2.9]],clear);
 for(let x=-9;x<=9;x+=1.8){const z=f(x)+.06;box(g,'brass-glass-mullion',x,5.7,z,.095,9.4,.11,P.gold);}
 // A mezzanine at the rear, visibly connected inside the same envelope.
 box(g,'mezzanine-floor',0,5.7,-4.6,18,.32,6.6,P.cream);for(const x of[-8.4,8.4])box(g,'interior-structural-column',x,5.3,-1.2,.25,9.8,.25,P.gold);
 for(const x of[-7.9,7.9])box(g,'balcony-rail-post',x,6.4,-1.1,.1,1.2,.1,P.gold);box(g,'mezzanine-balustrade',0,6.9,-1.1,16,.1,.1,P.gold);
 for(const x of[-5.5,5.5])for(const z of[-4.5,3.7]){cyl(g,'dining-table-top',x,2.5,z,1.28,.15,P.cream);cyl(g,'table-pedestal',x,1.7,z,.14,1.6,P.gold);for(const s of[-1,1]){box(g,'chair-seat',x+s*1.7,1.5,z,.8,.18,.8,P.ruby);box(g,'chair-upholstered-back',x+s*1.85,2,z,.18,1.2,.85,P.ruby);for(const dz of[-.3,.3])for(const dx of[-.25,.25])box(g,'chair-brass-leg',x+s*1.7+dx,1.13,z+dz,.06,.6,.06,P.gold);}}
 for(let x=-7.8;x<=8;x+=2.6)for(const y of[3.1,8.1])windowBox(g,x,y,-9.11,2.1,2.5,.1,P.shadowGlass);
 for(const x of[-6,0,6]){beam(g,'pendant-cable',[x,10,-.2],[x,7.7,-.2],.035,P.gold);const shade=mesh(g,'brass-pendant',new T.ConeGeometry(.65,.6,20,1,true),P.gold);shade.position.set(x,7.4,-.2);ball(g,'pendant-bulb',x,7.15,-.2,.2,.2,.2,glow('#f4d49a'));}
 plan(g,'closed-wine-roof-deck',outline,10.7,.55,P.ruby,.18);
 // Filled rising wine-coloured lip follows the facade; no floating ribbon skeleton.
 const roofEdge=[];for(let i=0;i<=40;i++){const x=-10+i*.5,z=f(x)+.65,y=11.5+1.1*Math.sin((x+10)/20*Math.PI);roofEdge.push([x,y,z]);panel(g,'sculpted-solid-eave',[[x-.26,10.85,z-.85],[x+.26,10.85,z-.85],[x+.26,y,z],[x-.26,y,z]],P.ruby);}
 tube(g,'sweeping-brass-eave',roofEdge,.13,P.gold);
 const stage=new T.Shape();stage.moveTo(-6.5,5.9);stage.bezierCurveTo(-7.5,1,-6.5,-6.8,-2,-6.8);stage.bezierCurveTo(3.5,-7.7,7.1,-2.8,6.8,3.2);stage.lineTo(6.8,5.9);stage.closePath();plan(g,'curved-integrated-piano-roof',stage.getPoints(40).map(v=>[v.x,v.y]),11.3,1.9,P.ruby,.18);
 const music=piano(g);entry(g,0,8.85,4,2.8);for(const x of[-4.3,4.3])box(g,'doorway-fluted-panel',x,2.6,8.85,.55,4.5,.35,P.wood);
 const lamps=[];for(let i=0;i<=18;i++){const x=-9.5+i*19/18,m=glow('#edb36b');lamps.push(ball(g,'rhythmic-eave-lamp',x,11.4+1.1*Math.sin((x+10)/20*Math.PI),f(x)+.72,.095,.095,.095,m));}
 return finish(g,'restaurant',{...music,lamps});}
export function setBuildingFrame(g,frame){const p=((frame%48)+48)%48/48,a=p*Math.PI*2,{kind,parts}=g.userData;
 if(kind==='wellness'){parts.lamps.forEach((o,i)=>o.material.emissiveIntensity=.35+.8*(.5+.5*Math.sin(a-i*.3)));animateFairy(parts.fairy,a);}
 if(kind==='boutique'){parts.jewel.rotation.y=a*2;parts.jewel.rotation.z=.16*Math.sin(a);parts.jewel.position.y=22.5+.5*Math.sin(a);parts.lamps.forEach((o,i)=>o.material.emissiveIntensity=.3+.8*Math.pow(Math.max(0,Math.cos(a-i*.55)),6));}
 if(kind==='restaurant'){parts.lidPivot.rotation.z=.4+.13*Math.sin(a);const f=p*48,index=Math.floor(f/2.6667)%18,k=Math.sin(f%2.6667/2.6667*Math.PI);parts.keys.forEach((o,i)=>o.rotation.x=(i===index||i===(index+4)%18)?k*.38:0);parts.blackKeys.forEach(({p:o,i})=>o.rotation.x=(i===index||i===(index+4)%18)?k*.32:0);parts.notes.forEach(({n,y},i)=>{n.position.y=y+.85*Math.sin(a+i*Math.PI);n.rotation.z=.22*Math.sin(a+i);n.rotation.y=.24*Math.sin(a+i*.7);});parts.lamps.forEach((o,i)=>o.material.emissiveIntensity=.35+.55*(.5+.5*Math.sin(a*2-i*.45)));}
}
export function measureBuilding(g){let triangles=0,meshes=0,instances=0;g.traverse(o=>{if(o.isMesh){meshes++;const n=o.isInstancedMesh?o.count:1;instances+=n;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*n;}});g.updateMatrixWorld(true);const b=new T.Box3().setFromObject(g);return {triangles,meshes,instances,bounds:{min:b.min.toArray(),max:b.max.toArray()}};}

const doubleSided=new Map();
function sideMaterial(m){if(!doubleSided.has(m)){const v=cachedAsset('elegantSurface',m.uuid,()=>{const c=m.clone();c.side=T.DoubleSide;return c;});doubleSided.set(m,v);}return doubleSided.get(m);}
function mergeStatic(g){const groups=new Map();for(const o of [...g.children])if(o.isMesh&&!o.isInstancedMesh&&!o.material.userData.liveMotion){const key=o.material.uuid;let arr=groups.get(key);if(!arr)groups.set(key,arr=[]);arr.push(o);}for(const arr of groups.values()){if(arr.length<2)continue;const pos=[],norm=[],indices=[];for(const o of arr){o.updateMatrix();const a=o.geometry.attributes.position,n=o.geometry.attributes.normal,base=pos.length/3,normalMatrix=new T.Matrix3().getNormalMatrix(o.matrix);for(let i=0;i<a.count;i++){const p=new T.Vector3().fromBufferAttribute(a,i).applyMatrix4(o.matrix);pos.push(p.x,p.y,p.z);const v=new T.Vector3().fromBufferAttribute(n,i).applyMatrix3(normalMatrix).normalize();norm.push(v.x,v.y,v.z);}const ix=o.geometry.index;if(ix)for(const i of ix.array)indices.push(base+i);else for(let i=0;i<a.count;i++)indices.push(base+i);g.remove(o);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new T.Float32BufferAttribute(norm,3));geo.setIndex(indices);const out=mesh(g,'merged-static-architectural-surfaces',geo,arr[0].material);out.castShadow=arr.some(o=>o.castShadow);}}

function fairySilhouette(g,front){
 const root=new T.Group();root.name='facade-glowing-fairy';g.add(root);
 const core=new T.MeshBasicMaterial({color:'#fbd0ac',side:T.DoubleSide}),edge=new T.MeshBasicMaterial({color:'#fc8eb4',transparent:true,opacity:.9,side:T.DoubleSide}),halo=new T.MeshBasicMaterial({color:'#f585b5',transparent:true,opacity:.16,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide});
 for(const m of [core,edge,halo])m.userData.liveMotion=true;
 const moving=[],sparkles=[];
 function create(name,shape,material,zoffset=.8,wing=false){const geo=new T.ShapeGeometry(shape,24),pos=geo.attributes.position,base=Array.from(pos.array);for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setXYZ(i,x,y+21,front(x)+zoffset);}geo.computeVertexNormals();const o=mesh(root,name,geo,material);o.castShadow=false;if(wing)moving.push({o,base,zoffset});return o;}
 const silhouette=new T.Shape();silhouette.moveTo(-.52,5.5);silhouette.bezierCurveTo(-1.4,4.9,-1.45,4.1,-.8,3.0);silhouette.quadraticCurveTo(-.35,2.1,-.85,1.3);silhouette.bezierCurveTo(-1.4,.3,-2,-1.7,-2.45,-2.4);silhouette.quadraticCurveTo(-1,-2.8,1.7,-2.25);silhouette.quadraticCurveTo(1.2,-.3,.6,1.6);silhouette.quadraticCurveTo(.3,2.6,.95,3.6);silhouette.quadraticCurveTo(1.55,4.65,.8,5.5);silhouette.closePath();
 create('fairy-fitted-dress-silhouette',silhouette,core);
 function shape(name,fn,m=core){const sh=new T.Shape();fn(sh);create(name,sh,m);}
 const head=ball(root,'fairy-head',.05,27.25,front(.05)+.9,.66,.85,.13,core);head.castShadow=false;
 shape('fairy-flowing-hair',s=>{s.moveTo(-.5,7);s.bezierCurveTo(-1.6,6.9,-1.4,5,-1.9,3.6);s.quadraticCurveTo(-.45,3.9,-.45,5.8);s.quadraticCurveTo(.1,6.4,.7,6.4);s.quadraticCurveTo(.8,7.6,-.5,7);});
 shape('fairy-left-raised-arm',s=>{s.moveTo(-.85,5.1);s.lineTo(-3,6.6);s.lineTo(-4.1,8.1);s.lineTo(-4.45,7.9);s.lineTo(-3.45,5.9);s.lineTo(-1.05,3.9);s.closePath();});
 shape('fairy-right-graceful-arm',s=>{s.moveTo(.9,4.9);s.lineTo(2.7,3.2);s.lineTo(4.1,3.9);s.lineTo(4.35,3.5);s.lineTo(2.6,2.5);s.lineTo(.5,4);s.closePath();});
 shape('fairy-two-legs',s=>{s.moveTo(-1.2,-2.4);s.lineTo(-.75,-4.4);s.lineTo(-2.2,-6.2);s.lineTo(-1.65,-6.5);s.lineTo(-.05,-4.8);s.lineTo(.25,-2.4);s.lineTo(.55,-4.2);s.lineTo(2.1,-5.9);s.lineTo(2.55,-5.5);s.lineTo(1.25,-3.7);s.lineTo(1.05,-2.3);s.closePath();});
 for(const sign of [-1,1]){
  const s=new T.Shape();s.moveTo(sign*.6,3.9);s.bezierCurveTo(sign*2.5,8.5,sign*6.2,9,sign*8,7);s.bezierCurveTo(sign*7.4,3.1,sign*4.9,1.4,sign*1,2.3);s.bezierCurveTo(sign*4.4,2.4,sign*6.3,-.4,sign*5.2,-2.4);s.bezierCurveTo(sign*2.8,-2.3,sign*.9,-.2,sign*.6,3.9);s.closePath();
  create('fairy-luminous-wing',s,edge,.72,true);
  const larger=new T.Shape();s.getPoints(24).forEach((v,i)=>{const x=v.x*1.045,y=3+(v.y-3)*1.045;i?larger.lineTo(x,y):larger.moveTo(x,y);});larger.closePath();create('fairy-soft-wing-glow',larger,halo,.68,true);
 }
 for(let i=0;i<7;i++){const x=-6.8+i*2.2,y=29+(i%3)*1.7,sh=new T.Shape(),rr=i%2?.25:.4;for(let j=0;j<8;j++){const a=j*Math.PI/4,r=j%2?rr*.25:rr;const xx=x+Math.cos(a)*r,yy=y-21+Math.sin(a)*r;j?sh.lineTo(xx,yy):sh.moveTo(xx,yy);}sh.closePath();const m=core.clone();m.transparent=true;m.userData.liveMotion=true;const o=create('fairy-twinkle',sh,m,1.1);sparkles.push(o);}
 root.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;}});
 return {root,moving,core,edge,halo,sparkles,front};
}
function animateFairy(f,a){const stretch=.78+.22*Math.cos(a),wave=.5+.5*Math.sin(a);f.core.color.setRGB(1,.71+.12*wave,.65+.12*wave);f.edge.opacity=.7+.28*wave;f.halo.opacity=.12+.18*wave;
 for(const {o,base,zoffset}of f.moving){const pos=o.geometry.attributes.position;for(let i=0;i<pos.count;i++){const x=base[i*3]*stretch,y=base[i*3+1];pos.setXYZ(i,x,y+21,f.front(x)+zoffset);}pos.needsUpdate=true;o.geometry.computeBoundingSphere();}
 f.sparkles.forEach((o,i)=>o.material.opacity=.25+.75*Math.pow(.5+.5*Math.sin(a*2-i*.9),2));
}
