import * as T from '../vendor/three.module.js';
import {kit} from './architecture.js';
import {cachedAsset,unitBox} from './resources.js';
import {upgradeSkylineMaterials} from './skyline-materials.js';
function polygon(w,d,c){return [[w/2-c,d/2],[w*.15,d/2],[0,d*.37],[-w*.15,d/2],[-w/2+c,d/2],[-w/2,d/2-c],[-w/2,-d/2+c],[-w/2+c,-d/2],[-w*.15,-d/2],[0,-d*.37],[w*.15,-d/2],[w/2-c,-d/2],[w/2,-d/2+c],[w/2,d/2-c]];}
// Each wall is its own planar quad, with UV x proportional to actual wall width.
// Vertical sides are never mapped through a taper or a change of footprint.
function prismGeometry(w,d,h,c){return cachedAsset('geometry',`landmark-prism-v2:${w}:${d}:${h}:${c}`,()=>{
 const poly=polygon(w,d,c),p=[],uv=[],idx=[],n=poly.length;
 for(let i=0;i<n;i++){const a=poly[i],b=poly[(i+1)%n],base=p.length/3,len=Math.hypot(a[0]-b[0],a[1]-b[1]);p.push(a[0],0,a[1],a[0],h,a[1],b[0],0,b[1],b[0],h,b[1]);uv.push(0,0,0,1,len/w,0,len/w,1);idx.push(base,base+1,base+2,base+2,base+1,base+3);}
 const sides=idx.length;
 for(const top of [true,false]){const base=p.length/3;for(const[x,z]of poly){p.push(x,top?h:0,z);uv.push(x/w+.5,z/d+.5);}for(const tri of T.ShapeUtils.triangulateShape(poly.map(([x,z])=>new T.Vector2(x,z)),[]))idx.push(...(top?[base+tri[0],base+tri[2],base+tri[1]]:tri.map(i=>base+i)));}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.addGroup(0,sides,0);geo.addGroup(sides,(n-2)*3,1);geo.addGroup(sides+(n-2)*3,(n-2)*3,2);geo.computeVertexNormals();geo.userData.verticalFacadeQuads=n;return geo;
});}
function crownBladeGeo(w,d,h){return cachedAsset('geometry',`landmark-crown-blade-v2:${w}:${d}:${h}`,()=>{
 const shape=new T.Shape();shape.moveTo(-w/2,0);shape.lineTo(w/2,0);shape.lineTo(w*.16,h);shape.lineTo(-w*.33,h-2.5);shape.closePath();return new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelThickness:.08,bevelSize:.08,bevelSegments:1,curveSegments:1});
});}
export function tieredLandmark(width=24,depth=24,style='anime',mix=.5){
 const w=Math.min(width-3,22),d=Math.min(depth-3,21),k=kit(mix,821,{tier:'mid',style,palette:{wallHex:'#739aa9',glassHex:'#568aa7',accentHex:'#d3bc80'}}),{box}=k,belts=[],sections=[];
 const prism=(name,ww,dd,y,h,material='wall')=>{const m=box(0,y,0,ww,h,dd,material),wall=m.material;m.geometry=prismGeometry(ww,dd,h,Math.min(ww,dd)*.16);m.scale.set(1,1,1);m.position.set(0,y,0);m.material=material==='wall'?[wall,k.m.roof,k.m.dark]:wall;m.name=name;return m;};
 box(0,1,0,w,2,d,'dark');prism('landmark-public-podium',w*.94,d*.93,2,5,'glass');
 // Broad shoulders and full vertical floors distinguish the tower from a cone.
 const tiers=[[7,27,.84,.78],[34,25,.70,.65],[59,20,.55,.52]];
 for(let t=0;t<tiers.length;t++){
  const[y,h,sx,sz]=tiers[t],ww=w*sx,dd=d*sz,body=prism('landmark-vertical-section-'+t,ww,dd,y,h);body.userData.landmarkSection=t;sections.push({y,h,width:ww,depth:dd});
  for(let floor=1;floor<h/2.7;floor++){const band=prism('landmark-floor-band',ww+.06,dd+.06,y+floor*2.7,.10,'metal');band.userData.noHit=true;}
  const belt=prism('landmark-shoulder-'+t,ww+.4,dd+.4,y+h-.55,.8,'metal');belts.push({y:y+h-.1,w:ww+.44,d:dd+.44});
  const points=polygon(ww,dd,Math.min(ww,dd)*.16);for(const[x,z]of points){const rib=box(x,y+h/2,z,.22,h,.22,'cream');rib.name='landmark-structural-rib';}
  if(t<2){const green=prism('landmark-sky-garden-'+t,ww*.92,dd*.92,y+h+.2,.18,'green');green.userData.noHit=true;}
 }
 // A visible, occupied observatory supports the three asymmetric metal blades.
 prism('landmark-crown-observatory',w*.32,d*.30,79,5,'glass');
 const blades=[];const crown=new T.Group();crown.name='landmark-metal-crown';k.g.add(crown);
 for(let i=0;i<3;i++){
  const a=i/3*Math.PI*2+Math.PI/6,blade=new T.Mesh(crownBladeGeo(3.2,1.4,10.5+i*1.5),k.m.metal);blade.position.set(Math.cos(a)*w*.15,78.4,Math.sin(a)*d*.15);blade.rotation.y=-a+Math.PI/2;blade.castShadow=true;crown.add(blade);blade.updateMatrix();blades.push(blade);
 }
 box(0,87,0,.28,11,.28,'metal');
 // Glazed lobby, braced canopy and layered entrance steps remain readable.
 box(0,4.3,d*.47+.05,w*.56,4.2,.18,'glass');box(0,6.6,d*.47+.6,w*.64,.4,2.2,'metal');for(const side of[-1,1])box(side*w*.28,4.2,d*.49,.28,4.3,.28,'cream');
 for(let i=0;i<3;i++)box(0,.35+i*.22,d*.47+1-i*.3,w*(.64-i*.04),.3,1.5-i*.2,'stone');
 for(const side of[-1,1]){box(side*w*.43,2.15,-d*.12,w*.09,.25,d*.55,'green');const tree=new T.Mesh(cachedAsset('geometry','landmark-small-tree-v2',()=>new T.IcosahedronGeometry(.72,1)),k.m.green);tree.position.set(side*w*.43,3.4,-d*.3);k.g.add(tree);}
 const root=k.finish(),bandBatches=new Map();
 for(const mesh of [...root.children])if(mesh.name==='landmark-floor-band'){
  const key=mesh.geometry.uuid+':'+mesh.material.uuid;if(!bandBatches.has(key))bandBatches.set(key,[]);bandBatches.get(key).push(mesh);
 }
 for(const list of bandBatches.values()){
  const batch=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((m,i)=>{m.updateMatrix();batch.setMatrixAt(i,m.matrix);root.remove(m);});batch.name='landmark-floor-band-batch';batch.userData.noHit=true;batch.castShadow=batch.receiveShadow=true;batch.computeBoundingSphere();root.add(batch);
 }
 upgradeSkylineMaterials(root,0,k.m);
 const env=blades[0].material.envMap,gold=cachedAsset('landmarkTrim','champagne-v2',()=>{const m=new T.MeshPhysicalMaterial({color:'#ceb581',roughness:.28,metalness:.72,clearcoat:.5,envMap:env,envMapIntensity:1.1});m.userData.approvedArchitecture=true;return m;});for(const blade of blades)blade.material=gold;root.traverse(o=>{if(o.name.startsWith('landmark-shoulder-'))o.material=gold;});
 const motion=new T.Group();motion.name='landmark-zoned-lighting';root.add(motion);const mats=[];
 const lamp=(geo,position,scale,zone,index)=>{const mat=new T.MeshBasicMaterial({color:zone==='crown'?'#8cecff':'#efc488',toneMapped:false});mat.userData.liveMotion=true;mat.userData.lightZone=zone;const mesh=new T.Mesh(geo,mat);mesh.position.copy(position);mesh.scale.copy(scale);mesh.userData.noHit=true;mesh.userData.landmarkLightZone=zone;mesh.userData.lightIndex=index;motion.add(mesh);mats.push({mat,zone,index});};
 // Thin shoulder outlines and crown contours, without animated shadow maps.
 for(let i=0;i<belts.length;i++){
  const b=belts[i],pts=polygon(b.w,b.d,Math.min(b.w,b.d)*.16).map(([x,z])=>new T.Vector3(x,b.y,z));pts.push(pts[0].clone());const geo=cachedAsset('geometry',`landmark-belt-light-v2:${w}:${d}:${i}`,()=>{const path=new T.CurvePath();for(let j=0;j<pts.length-1;j++)path.add(new T.LineCurve3(pts[j],pts[j+1]));return new T.TubeGeometry(path,48,.08,4,false);});lamp(geo,new T.Vector3(),new T.Vector3(1,1,1),'belt',i);
 }
 for(let i=0;i<3;i++){
  const blade=blades[i],h=10.5+i*1.5,points=[new T.Vector3(-1.6,.4,1.5),new T.Vector3(-1.056,h-2.5,1.5),new T.Vector3(.512,h,1.5)].map(p=>p.applyMatrix4(blade.matrix));const geo=cachedAsset('geometry',`landmark-crown-light-v2:${w}:${d}:${i}`,()=>new T.TubeGeometry(new T.CatmullRomCurve3(points),16,.13,5,false));lamp(geo,new T.Vector3(),new T.Vector3(1,1,1),'crown',i);
 }
 for(const side of[-1,1])lamp(unitBox,new T.Vector3(side*w*.22,67,d*.262),new T.Vector3(.13,14,.12),'facade',side<0?0:1);
 root.userData={...root.userData,purposeKind:'landmark',hero:true,singleStructure:true,premiumVariant:2,landmarkSections:sections,planarWindowMapping:true};
 root.userData.heroEffect={kind:'landmark',building:root,motion,frames:48,duration:8,setFrame(f,n=48){const a=(((f%n)+n)%n)/n*Math.PI*2;for(const{mat,zone,index}of mats){const wave=.5+.5*Math.sin(a-index*.9);if(zone==='crown')mat.color.setHSL(.52+.08*Math.sin(a+index*.6),.65,.40+.26*wave);else if(zone==='belt')mat.color.set('#edc18a').multiplyScalar(.42+.58*wave);else mat.color.set('#84d2e5').multiplyScalar(.4+.6*wave);}}};
 root.userData.heroEffect.setFrame(0);return root;
}