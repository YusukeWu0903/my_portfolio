import * as T from '../vendor/three.module.js';
import {cachedAsset,unitBox} from './resources.js';
// Geometry only: no building photograph, image plane or external model.
const sphere=cachedAsset('geometry','approved-topiary-v1',()=>new T.SphereGeometry(1,12,8));
export const palette={
 stone:physical('#c4b49c',.38,.08),ivory:physical('#e0d0ae',.31,.12),
 navy:physical('#162737',.34,.25),ink:physical('#22283b',.38,.18),
 glass:physical('#247d92',.17,.52),paleGlass:physical('#79c4ca',.2,.4),
 darkGlass:physical('#164254',.19,.54),gold:physical('#d0a05c',.24,.67),
 rose:physical('#ad3e62',.29,.32),ruby:physical('#982c4a',.25,.3),
 coral:physical('#df765c',.29,.25),slate:physical('#45566b',.3,.4),
 copper:physical('#a26642',.31,.6),green:physical('#306947',.7,0),
 lawn:physical('#52775a',.85,0),soil:physical('#383c36',.8,0),
 light:physical('#ffe0a0',.3,.1,1.4),pinkLight:physical('#ed7395',.3,.05,.8),
 blueLight:physical('#65ceda',.3,.05,.65),paving:physical('#657477',.65,.04),
 carpet:physical('#8f2943',.8,0)
};
for(const m of Object.values(palette))m.userData.approvedArchitecture=true;
for(const key of ['glass','paleGlass','darkGlass'])palette[key].userData.architectureWindow=true;
for(const key of ['light','pinkLight','blueLight'])palette[key].userData.liveMotion=true;
function physical(color,roughness,metalness,emissiveIntensity=0){
 return cachedAsset('approvedArchitectureMaterial',JSON.stringify([color,roughness,metalness,emissiveIntensity]),()=>new T.MeshPhysicalMaterial({color,roughness,metalness,clearcoat:.55,clearcoatRoughness:.22,
 emissive:color,emissiveIntensity,envMapIntensity:.9}));
}
function mesh(g,name,geometry,material){const m=new T.Mesh(geometry,material);m.name=name;m.castShadow=m.receiveShadow=true;g.add(m);return m;}
function box(g,name,x,y,z,w,h,d,material){const m=mesh(g,name,unitBox,material);m.position.set(x,y,z);m.scale.set(w,h,d);return m;}
function ball(g,x,y,z,rx,ry,rz,material){const m=mesh(g,'topiary',sphere,material);m.position.set(x,y,z);m.scale.set(rx,ry,rz);return m;}
function cylinder(g,name,x,y,z,r,h,material,axis='y',segments=24){const m=mesh(g,name,new T.CylinderGeometry(r,r,h,segments),material);m.position.set(x,y,z);if(axis==='z')m.rotation.x=Math.PI/2;return m;}
function tube(g,name,points,r,material){return mesh(g,name,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a))),Math.max(16,points.length*3),r,8,false),material);}
function lineTube(g,name,points,r,material){const path=new T.CurvePath();for(let i=1;i<points.length;i++)path.add(new T.LineCurve3(new T.Vector3(...points[i-1]),new T.Vector3(...points[i])));return mesh(g,name,new T.TubeGeometry(path,Math.max(12,points.length*4),r,8,false),material);}
function shapeMesh(g,name,shape,depth,material,bevel=.12){return mesh(g,name,new T.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelSize:bevel,bevelThickness:bevel,bevelSegments:2,steps:1,curveSegments:20}),material);}
function footprint(g,name,pts,y,h,material,bevel=.18){const sh=new T.Shape();pts.forEach(([x,z],i)=>i?sh.lineTo(x,z):sh.moveTo(x,z));sh.closePath();const m=shapeMesh(g,name,sh,h,material,bevel);m.geometry.rotateX(-Math.PI/2);m.position.y=y;return m;}
function roundedPlan(w,d,r=.9){const pts=[];for(const [cx,cz,start]of[[w/2-r,d/2-r,0],[-w/2+r,d/2-r,90],[-w/2+r,-d/2+r,180],[w/2-r,-d/2+r,270]])for(let j=0;j<=4;j++){const a=(start+j*22.5)*Math.PI/180;pts.push([cx+r*Math.cos(a),cz+r*Math.sin(a)]);}return pts;}
function surface(g,name,rows,material){const pos=[],idx=[];for(const pair of rows)for(const v of pair)pos.push(...v);for(let i=0;i<rows.length-1;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}const ge=new T.BufferGeometry();ge.setAttribute('position',new T.Float32BufferAttribute(pos,3));ge.setIndex(idx);ge.computeVertexNormals();const mat=cachedAsset('approvedArchitectureSurface',material.uuid,()=>{const m=material.clone();m.side=T.DoubleSide;return m;});return mesh(g,name,ge,mat);}
function triangle(g,name,a,b,c,material){return surface(g,name,[[a,b],[c,c]],material);}
function site(g){const P=palette;
 box(g,'site-base',0,-.5,0,26,1,58,P.slate);box(g,'paved-forecourt',0,.04,0,25.7,.12,57.7,P.paving);
 for(const x of[-12,12]){box(g,'planted-strip',x,.2,-1,1.1,.28,51,P.lawn);for(const z of[-21,-8,6,20]){box(g,'stone-planter',x,.7,z,1.5,1.1,1.6,P.ivory);ball(g,x,1.65,z,.74,.9,.74,P.green);}}
 for(let x=-10;x<=10;x+=2)box(g,'forecourt-paving-joint',x,.12,27.1,.035,.015,2.9,P.slate);
}
function entry(g,x,z,width=6,height=5){const P=palette;
 box(g,'entry-deep-frame',x,height/2+.35,z,width+.7,height+.6,.5,P.navy);
 box(g,'entry-glazing',x,height/2+.35,z+.3,width,height,.16,P.paleGlass);
 for(let i=-1;i<=1;i++)box(g,'door-mullion',x+i*width/3,height/2+.35,z+.45,.1,height,.12,P.gold);
 for(const dx of[-.38,.38])box(g,'door-handle',x+dx,2.4,z+.57,.09,.75,.11,P.gold);
 for(let k=0;k<3;k++)box(g,'entry-step',x,.15+k*.16,z+1.4-k*.45,width+2,.23,2-k*.45,P.ivory);
}
function pane(g,x,y,z,w,h,front=true,material=palette.glass){const P=palette;
 if(front){box(g,'window-frame',x,y,z,w+.16,h+.14,.2,P.navy);box(g,'reflective-glazing',x,y,z+(z<0?-.13:.13),w,h,.08,material);}
 else{box(g,'window-frame',x,y,z,.2,h+.14,w+.16,P.navy);box(g,'reflective-glazing',x+(x>0?.13:-.13),y,z,.08,h,w,material);}
}
function floorRing(g,y,w,d,P=palette.gold){box(g,'front-floor-belt',0,y,d/2,w,.24,.32,P);box(g,'back-floor-belt',0,y,-d/2,w,.24,.32,P);for(const x of[-w/2,w/2])box(g,'side-floor-belt',x,y,0,.32,.24,d,P);}
function spotlight(g,x,y,z){const P=palette;
 cylinder(g,'spotlight-plinth',x,y-.7,z,.55,.4,P.navy);box(g,'attached-light-pedestal',x,y-.15,z,.5,.85,.5,P.gold);
 const p=new T.Group();p.name='moving-spotlight';p.position.set(x,y+.5,z);g.add(p);
 box(p,'light-yoke-left',-.78,0,0,.17,1.5,.4,P.gold);box(p,'light-yoke-right',.78,0,0,.17,1.5,.4,P.gold);
 cylinder(p,'light-housing',0,.2,.1,.64,1.7,P.navy,'z');cylinder(p,'light-rim',0,.2,1,.68,.16,P.gold,'z');
 cylinder(p,'light-lens',0,.2,1.1,.5,.08,P.light,'z');
 return p;
}
function batchBoxes(root){const byMaterial=new Map();for(const o of [...root.children])if(o.isMesh&&o.geometry===unitBox){let arr=byMaterial.get(o.material);if(!arr)byMaterial.set(o.material,arr=[]);arr.push(o);}
 for(const [material,arr]of byMaterial){const im=new T.InstancedMesh(unitBox,material,arr.length);im.name='shared-facade-and-structure';arr.forEach((o,i)=>{o.updateMatrix();im.setMatrixAt(i,o.matrix);root.remove(o);});im.castShadow=im.receiveShadow=true;im.instanceMatrix.needsUpdate=true;root.add(im);}
}
function finish(g,kind,parts){batchBoxes(g);g.userData={kind,parts,frames:48,singleStructure:true};return g;}
export function createTraining(){const P=palette,g=new T.Group();site(g);
 // A joined, enclosed academy with three storeys and double-height rehearsal rooms.
 footprint(g,'continuous-academy-envelope',[[-11.2,-24],[11.2,-24],[11.2,23.6],[5.6,23.6],[5.6,19],[-5.6,19],[-5.6,23.6],[-11.2,23.6]],.4,18.2,P.stone);
 for(const y of[3.8,9.5,15.2]){
  for(let x=-8.4;x<=8.5;x+=2.8){if(Math.abs(x)>5.2)pane(g,x,y,24.15,2.35,4.5,true,((x+9)|0)%3?P.glass:P.paleGlass);pane(g,x,y,-24.18,2.35,4.5,true,P.darkGlass);}
  for(const x of[-11.3,11.3])for(let z=-20.5;z<=20.6;z+=4.1)pane(g,x,y,z,3.4,4.5,false,z>3?P.glass:P.darkGlass);
 }
 for(const y of[.8,6.7,12.3,18.5])floorRing(g,y,22.9,48.6,y===12.3?P.gold:P.ivory);
 for(const x of[-10.4,-4.5,4.5,10.4]){box(g,'front-structural-column',x,9.9,24.4,.48,18.6,.6,P.ivory);box(g,'column-gold-inlay',x+.18,10,24.75,.08,18,.08,P.gold);}
 // Berry-coloured acoustic panels flank the central rehearsal glazing.
 for(const x of[-8.1,8.1]){box(g,'acoustic-banner',x,11.7,24.6,1.3,8.8,.2,P.rose);tube(g,'banner-metal-inlay',[[x-.38,8.1,24.76],[x+.38,11.7,24.76],[x-.38,15.2,24.76]],.045,P.gold);}
 // Curved rehearsal atrium: glazing encloses actual small room bays.
 const atriumGlass=cachedAsset('approvedArchitectureMaterial','atrium-glass-v1',()=>{const m=P.glass.clone();m.transparent=true;m.opacity=.43;m.depthWrite=false;m.side=T.DoubleSide;return m;});
 for(const y of[.9,6.7,12.3,18.5]){box(g,'atrium-floor-slab',0,y,22.4,11,.25,6.4,P.ivory);const rim=[];for(let j=0;j<=20;j++){const t=j/20;rim.push([-5.4+10.8*t,y,24.1+1.25*Math.sin(t*Math.PI)]);}tube(g,'bowed-atrium-floor-edge',rim,.14,P.gold);}
 for(const [level,y]of[3.8,9.5,15.2].entries()){
  box(g,'warm-rehearsal-room-backwall',0,y,19.22,10.4,4.8,.15,level===1?P.rose:P.ivory);
  for(let j=0;j<8;j++){const t0=j/8,t1=(j+1)/8,x0=-5.4+10.8*t0,x1=-5.4+10.8*t1,z0=24.1+1.25*Math.sin(t0*Math.PI),z1=24.1+1.25*Math.sin(t1*Math.PI);surface(g,'bowed-rehearsal-glass',[[[x0,y-2.6,z0],[x0,y+2.6,z0]],[[x1,y-2.6,z1],[x1,y+2.6,z1]]],atriumGlass);box(g,'atrium-vertical-metal-mullion',x0,y,z0+.06,.09,5.2,.13,P.gold);}
  box(g,'rehearsal-warm-ceiling-strip',0,y+2.3,22.6,8.6,.08,.16,P.light);
 }
 for(const x of[-4,4]){box(g,'dance-barre-support',x,8.3,22.7,.12,2.2,.12,P.gold);box(g,'dance-barre-support',x,14,22.7,.12,2.2,.12,P.gold);}
 for(const y of[9.1,14.8])box(g,'dance-practice-barre',0,y,22.7,8.3,.12,.14,P.gold);
 entry(g,0,25.45,6.8,5.9);
 // A filled, supported fan canopy, rather than loose floating roof ribbons.
 const sh=new T.Shape();sh.moveTo(-5.8,0);sh.absarc(0,0,5.8,Math.PI,0,true);sh.lineTo(-5.8,0);
 const shell=shapeMesh(g,'solid-fan-stage-canopy',sh,1.55,P.ruby,.12);shell.position.set(0,6.6,24.7);
 for(let i=0;i<9;i++){const a=i/8*Math.PI;tube(g,'fan-canopy-gold-rib',[[0,6.7,26.4],[5.65*Math.cos(a),6.7+5.65*Math.sin(a),26.4]],.09,P.gold);}
 const arch=[];for(let i=0;i<=32;i++){const a=i/32*Math.PI;arch.push([5.9*Math.cos(a),6.6+5.9*Math.sin(a),26.4]);}tube(g,'canopy-outer-metal-edge',arch,.18,P.gold);
 for(const x of[-5.9,5.9])box(g,'canopy-support-pier',x,3.6,25.1,.55,6.8,.8,P.ivory);
 footprint(g,'roof-terrace-parapet',roundedPlan(22.6,48.4,.9),18.8,.5,P.gold);
 box(g,'rehearsal-roof-lantern',0,19.8,-2,13.7,1.8,29,P.navy);
 const roofRows=[];for(let i=0;i<=30;i++){const t=i/30,x=-6.9+13.8*t,y=20+2.0*Math.sin(t*Math.PI);roofRows.push([[x,y,-17],[x,y,13]]);}surface(g,'curved-rehearsal-skylight-shell',roofRows,P.glass);
 for(const z of[-17,13]){const edge=[];for(let i=0;i<=24;i++){const t=i/24;edge.push([-6.9+13.8*t,20.15+2*Math.sin(t*Math.PI),z]);}tube(g,'vaulted-skylight-edge',edge,.15,P.gold);}
 for(let z=-15;z<=11;z+=2.5){const rr=[];for(let i=0;i<=18;i++){const t=i/18;rr.push([-6.8+13.6*t,20.2+2*Math.sin(t*Math.PI),z]);}tube(g,'curved-lantern-rib',rr,.07,P.gold);}
 const lamps=[spotlight(g,-8.1,20.3,18.2),spotlight(g,8.1,20.3,18.2)];
 return finish(g,'training',{lamps});}
export function createFeida(){const P=palette,g=new T.Group();site(g);
 footprint(g,'joined-production-headquarters',roundedPlan(22.8,49.3,.6),.4,20,P.navy);
 // Soundstage acoustic skin and a continuous glazed office bay in front.
 for(const x of[-11.55,11.55])for(let z=-23;z<14;z+=2){box(g,'soundstage-vertical-rib',x,10.7,z,.26,19.5,.14,z%4===-3?P.rose:P.slate);}
 for(const y of[4.2,10,15.8]){for(let x=-9.6;x<=1.8;x+=2.8)pane(g,x,y,24.9,2.4,4.6,true,P.glass);for(let z=14;z<=23;z+=3.4)pane(g,-11.55,y,z,2.9,4.6,false,P.paleGlass);}
 for(const y of[1,7.1,12.9,19]){box(g,'office-floor-ribbon',-5.3,y,25.08,13,.25,.3,P.gold);box(g,'office-side-floor-ribbon',-11.7,y,18,.3,.25,14,P.coral);}
 for(const x of[-10.9,-2])box(g,'office-metal-column',x,10.7,25.16,.3,19,.34,P.gold);
 entry(g,-5.4,25.35,6.2,5.7);
 // Bowed glazed office bay gives the studio a shaped headquarters frontage.
 for(const y of[3.8,9.6,15.4])for(let j=0;j<8;j++){const t0=j/8,t1=(j+1)/8,x0=-10.8+10*t0,x1=-10.8+10*t1,z0=25.12+1.1*Math.sin(t0*Math.PI),z1=25.12+1.1*Math.sin(t1*Math.PI);surface(g,'bowed-office-window',[[[x0,y-2.5,z0],[x0,y+2.5,z0]],[[x1,y-2.5,z1],[x1,y+2.5,z1]]],j%3?P.glass:P.paleGlass);box(g,'office-bay-mullion',x0,y,z0+.07,.1,5,.15,P.gold);}
 for(const y of[1,7,12.8,18.6]){const p=[];for(let j=0;j<=24;j++){const t=j/24;p.push([-10.8+10*t,y,25.2+1.1*Math.sin(t*Math.PI)]);}tube(g,'curved-office-floor-edge',p,.16,P.gold);}
 for(const z of[-21,-17,-13,5,9])box(g,'soundstage-acoustic-accent',11.75,11.2,z,.12,15.6,.32,z<0?P.coral:P.gold);
 // The large soundstage door is recessed into the east wall.
 box(g,'soundstage-door-deep-recess',11.6,7.6,-5,.3,13.8,12.4,P.ink);
 box(g,'soundstage-rolling-door',11.85,7.5,-5,.12,12.9,10.8,P.slate);
 for(let y=1.5;y<=13.7;y+=.65)box(g,'rolling-door-horizontal-slat',11.95,y,-5,.1,.08,10.7,P.navy);
 for(const z of[-11.3,1.3]){box(g,'soundstage-door-portal',12.05,8,z,.3,15.2,.6,P.rose);box(g,'door-portal-light',12.23,8,z,.08,14.6,.12,P.gold);}
 box(g,'loading-door-header',12.05,15.7,-5,.4,.7,13.2,P.gold);
 // A closed folded roof, made from connected roof facets.
 const a=[-11.6,20.7,-24.7],b=[11.6,20.7,-24.7],c=[11.6,20.7,24.7],d=[-11.6,20.7,24.7],e=[-4,27,-14],f=[4,23,5];
 triangle(g,'folded-roof-ruby',a,d,e,P.ruby);triangle(g,'folded-roof-slate',a,b,e,P.slate);
 triangle(g,'folded-roof-bronze',b,f,e,P.copper);triangle(g,'folded-roof-coral',b,c,f,P.rose);
 triangle(g,'folded-roof-midnight',c,d,f,P.navy);triangle(g,'folded-roof-inner',d,e,f,P.slate);
 for(const pts of[[a,e,b],[d,e,f,c],[a,d,c,b,a]])lineTube(g,'connected-folded-roof-edge',pts,.13,P.gold);
 // Front movie marque: a real disk, ring and spokes plus a left-hinged clapper.
 const sign=new T.Group();sign.position.set(5.1,18.8,25.5);g.add(sign);
 cylinder(sign,'film-reel-disc',0,0,0,3,.45,P.gold,'z',48);cylinder(sign,'reel-center',0,0,.38,.55,.3,P.coral,'z');
 for(let i=0;i<6;i++){const a=i/6*Math.PI*2;cylinder(sign,'reel-recess',1.75*Math.cos(a),1.75*Math.sin(a),.27,.66,.04,P.ink,'z',20);}
 const rim=mesh(sign,'reel-outer-rim',new T.TorusGeometry(3,.14,8,48),P.gold);rim.position.z=.28;
 box(g,'clapper-fixed-board',4.9,23.6,25.5,8.6,2.5,.5,P.ink);
 for(let x=1.4;x<=8.5;x+=1.45){const q=box(g,'clapper-fixed-stripe',x,24.7,25.85,.7,.5,.1,P.ivory);q.rotation.z=-.4;}
 const hinge=new T.Group();hinge.position.set(.6,25.0,25.5);g.add(hinge);box(hinge,'clapper-moving-bar',4,.3,0,8.6,.8,.6,P.gold);
 for(let x=.7;x<8;x+=1.45){const q=box(hinge,'clapper-moving-stripe',x,.3,.36,.65,.78,.08,P.ink);q.rotation.z=-.4;}
 // Solid film ribbon curls over the entrance.
 const ribbon=[];for(let i=0;i<=28;i++){const t=i/28,x=-10+20*t,y=9.1+5.7*t+1.3*Math.sin(t*Math.PI),z=25.7+1.3*Math.sin(t*Math.PI);ribbon.push([[x,y-.64,z],[x,y+.64,z]]);}
 surface(g,'cinematic-film-ribbon',ribbon,P.gold);
 for(let i=0;i<18;i++){const t=i/17,x=-9.7+19.4*t,y=9.1+5.7*t+1.3*Math.sin(t*Math.PI),z=25.76+1.3*Math.sin(t*Math.PI);for(const dy of[-.42,.42])box(g,'film-strip-perforation',x,y+dy,z,.45,.22,.08,P.ink);}
 return finish(g,'feida',{reel:sign,hinge});}
export function createCinema(){const P=palette,g=new T.Group();site(g);
 footprint(g,'fully-connected-cinema-podium',roundedPlan(23,49.5,1.3),.4,13.9,P.ruby);
 // The left auditorium joins the front foyer and the right tower continuously.
 footprint(g,'left-auditorium-mass',[[-11.3,-23],[-2,-24.5],[3,-19],[3,20],[-1,24.5],[-10.8,24.5],[-11.8,19]],.7,17.1,P.ink);
 for(const y of[4,9.3]){for(let x=-9.6;x<=9.7;x+=2.8)pane(g,x,y,24.9,2.3,4.5,true,P.glass);for(let z=-19;z<=20;z+=4)pane(g,-11.8,y,z,3.3,4.5,false,P.darkGlass);}
 for(const y of[1.1,6.8,12.6]){box(g,'lobby-front-band',0,y,25.13,22.8,.25,.34,P.gold);box(g,'lobby-side-band',-12,y,0,.3,.25,47,P.copper);}
 entry(g,-3.6,25.35,6.8,5.8);
 // Rounded auditorium crown joins the straight lobby and the swept tower.
 const auditorium=cylinder(g,'curved-auditorium-shell',-4.5,11.1,-1,1,13.8,P.copper);auditorium.scale.set(7.2,1,19);
 const drumRoof=cylinder(g,'auditorium-drum-roof',-4.5,18.2,-1,1,.5,P.ruby);drumRoof.scale.set(7.4,1,19.3);
 const drumEdge=[];for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;drumEdge.push([-4.5+7.45*Math.cos(a),18.55,-1+19.35*Math.sin(a)]);}tube(g,'auditorium-curved-crown',drumEdge,.18,P.gold);box(g,'auditorium-roof-skylight',-4.5,18.65,-1,5.5,.16,25,P.darkGlass);
 for(let i=0;i<14;i++){const a=-Math.PI/2+i/13*Math.PI,x=-4.5-7.25*Math.cos(a),z=-1+19*Math.sin(a);box(g,'auditorium-vertical-rib',x,13.5,z,.22,8.8,.22,P.gold);}
 for(const z of[-14,-4,6,16]){box(g,'cinema-side-poster-frame',11.7,7.4,z,.22,9.7,6.3,P.gold);box(g,'cinema-side-poster',11.85,7.4,z,.1,9.1,5.8,z<0?P.ink:P.darkGlass);const motif=cylinder(g,'poster-graphic-orbit',12,8,z,1.35,.1,z<0?P.rose:P.gold,'z');motif.rotation.x=0;motif.rotation.z=Math.PI/2;box(g,'poster-graphic-light-line',12.15,5.2,z,.06,.18,4.4,P.light);}
 // Swept fan tower: a true solid profile, extruded across its width.
 const towerTop=z=>39-19*((z+24)/48)+2.1*Math.sin(((z+24)/48)*Math.PI);
 const sh=new T.Shape();sh.moveTo(-24,.4);sh.lineTo(24,.4);sh.lineTo(24,towerTop(24));for(let z=22;z>=-24;z-=2)sh.lineTo(z,towerTop(z));sh.closePath();
 for(let bladeIndex=0;bladeIndex<3;bladeIndex++){
 const factor=1-bladeIndex*.13,xEdge=11.2-bladeIndex*2.4;
 const blade=shapeMesh(g,'joined-swept-fan-blade',sh,2.4,P.navy,.12),pp=blade.geometry.attributes.position;
 for(let i=0;i<pp.count;i++){const a=pp.getX(i),b=pp.getY(i),c=pp.getZ(i);pp.setXYZ(i,xEdge-c,b*factor,a);}blade.geometry.computeVertexNormals();
 const topRows=[],topEdge=[];for(let z=-24;z<=24;z+=2){const y=towerTop(z)*factor+.16;topRows.push([[xEdge-2.35,y,z],[xEdge,y,z]]);topEdge.push([xEdge,y+.08,z]);}
 surface(g,'glossy-fan-blade-roof',topRows,bladeIndex%2?P.glass:P.darkGlass);tube(g,'stepped-fan-crown-edge',topEdge,.14,P.gold);
}
 // Glazing panels and ribs are all attached to the swept tower.
 for(let z=-21.5;z<23;z+=4.7){const h=towerTop(z)-2.2;for(const x of[3.86,11.38]){const hh=x<4?h*.74:h;box(g,'fan-tower-glazing',x,hh/2+.8,z,.12,hh,4.25,z<0?P.darkGlass:P.glass);box(g,'tower-vertical-bronze-rib',x+.1,hh/2+1,z+2.2,.2,hh+1,.13,P.gold);for(let y=6;y<hh;y+=5.8)box(g,'glass-tower-floor-line',x+.15,y,z,.12,.1,4.3,P.copper);}}
 const crown=[];for(let z=-24;z<=24;z+=2)crown.push([11.55,towerTop(z)+.2,z]);tube(g,'fan-tower-continuous-crown',crown,.24,P.gold);
 for(const z of[-22,-13,-4]){const h=towerTop(z);box(g,'fan-roof-upright',11.7,h/2,z,.24,h,.45,P.copper);}
 // Broad curved premiere canopy is a filled roof with a lit front edge.
 const rows=[],edge=[];for(let i=0;i<=36;i++){const t=i/36,x=-11.7+23.4*t,y=12.5+3.5*Math.sin(t*Math.PI),z=25.6+1.2*Math.sin(t*Math.PI);rows.push([[x,y,z-2.9],[x,y,z]]);edge.push([x,y,z+.08]);}
 surface(g,'solid-premiere-entrance-canopy',rows,P.ruby);tube(g,'canopy-metal-rim',edge,.26,P.gold);
 const bulbs=[];for(let i=0;i<=26;i++){const t=i/26,b=ball(g,-11.5+23*t,12.15+3.5*Math.sin(t*Math.PI),25.8+1.2*Math.sin(t*Math.PI),.14,.14,.14,P.light);b.material=P.light.clone();b.material.userData.shared=false;b.material.userData.liveMotion=true;bulbs.push(b);}
 box(g,'premiere-red-carpet',-3.6,.25,27.1,7.5,.13,3.1,P.carpet);
 for(const x of[-8.1,.9])for(const z of[26.4,28.2]){cylinder(g,'carpet-stanchion',x,1.1,z,.12,1.6,P.gold);ball(g,x,1.95,z,.2,.2,.2,P.gold);}
 for(const x of[-8.1,.9])tube(g,'velvet-carpet-rope',[[x,1.8,26.4],[x,1.4,27.3],[x,1.8,28.2]],.055,P.ruby);
 // Five-point extruded star on an attached structural stand.
 box(g,'marquee-structural-stand',1,19.1,24.1,.45,7,.6,P.gold);
 const star=new T.Group();star.position.set(1,22.2,24.8);g.add(star);
 const ss=new T.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,rr=i%2?1.55:3.5;i?ss.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ss.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ss.closePath();shapeMesh(star,'rotating-gold-film-star',ss,.75,P.gold,.12);
 const sr=mesh(star,'star-orbit-ring',new T.TorusGeometry(3.35,.14,8,56),P.copper);sr.rotation.x=.72;
 return finish(g,'cinema',{star,bulbs});}
export function setBuildingFrame(g,frame){const phase=((frame%48)+48)%48/48,a=phase*Math.PI*2,{kind,parts}=g.userData;
 if(kind==='training')parts.lamps.forEach((p,i)=>{p.rotation.y=.32*Math.sin(a+i*Math.PI);p.rotation.x=.18+.08*Math.cos(a+i*Math.PI);});
 if(kind==='feida'){parts.reel.rotation.z=a;parts.hinge.rotation.z=.03+.31*(.5-.5*Math.cos(a));}
 if(kind==='cinema'){parts.star.rotation.y=a;parts.star.rotation.z=.055*Math.sin(a);parts.bulbs.forEach((b,i)=>{b.material.emissiveIntensity=.65+.65*(.5+.5*Math.sin(a*2-i*.55));});}
}
export function measureBuilding(g){let triangles=0,meshes=0,instances=0;g.traverse(o=>{if(o.isMesh){meshes++;const n=o.isInstancedMesh?o.count:1;instances+=n;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*n;}});g.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(g);return {triangles,meshes,instances,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}};}
