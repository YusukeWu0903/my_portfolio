import * as T from '../vendor/three.module.js';
import{sculptKit,fluidSite}from'./sculpted-architecture.js';
import{musicEffect}from'./music-effects.js';

export function musicBuilding(profile,width,depth,style='anime'){
 const records=profile.designKey==='zhensheng-records',colors=records?{glass:'#33878f',primary:'#c99458',secondary:'#c85e68',light:'#ead7b7',ink:'#302a43',trim:'#e4b66e',leaf:'#589880'}:{glass:'#375e8d',primary:'#65c3d1',secondary:'#8968a5',light:'#dce5df',ink:'#252f54',trim:'#edbc68',leaf:'#5ca99a'};
 const k=sculptKit(style,colors),{g,mesh,box,curve}=k,w=width,d=depth;fluidSite(k,w,d);
 let record,arm,stars,bars;
 if(records){
  const body=k.loft(w,d,27,{twist:.5,lobes:2,bulge:.16,peak:.32});
  // A copper/coral spiral is part of the enclosing skin, not balcony slabs.
  body.wrap(-.8,Math.PI*1.4,.12,.5,'primary',1.035,.23);
  body.wrap(Math.PI*.85,Math.PI*2,.52,.95,'secondary',1.04,-.14);
  for(const v of[.22,.57,.86])curve(Array.from({length:49},(_,i)=>body.point(i/48*Math.PI*2,v,1.046)),.095,'trim',48);
  box(0,3.2,d*.355,w*.3,4,.3,'ink');
  // A supported tilted turntable caps the continuous shell.
  const plinth=mesh(new T.CylinderGeometry(2.5,3.2,4,24),'primary');plinth.position.y=25;
  const rig=new T.Group();rig.position.set(0,29,0);rig.rotation.x=.22;g.add(rig);
  const housing=new T.Mesh(new T.CylinderGeometry(5.7,5.3,.8,40),k.m.primary);housing.position.y=-.75;housing.castShadow=false;rig.add(housing);
  record=new T.Group();record.name='record-spin';rig.add(record);
  const add=(parent,geometry,key,x,y,z)=>{const o=new T.Mesh(geometry,k.m[key]);o.position.set(x,y,z);o.castShadow=false;parent.add(o);return o;};
  add(record,new T.CylinderGeometry(5.6,5.6,.65,48),'ink',0,0,0);
  for(const r of[3,4.1,5.15]){const groove=add(record,new T.TorusGeometry(r,.055,5,48),'trim',0,.36,0);groove.rotation.x=Math.PI/2;}
  const label=add(record,new T.CylinderGeometry(1.65,1.65,.08,32),'secondary',0,.37,0);label.material=new T.MeshBasicMaterial({color:'#dd736d',toneMapped:false});label.material.userData.liveMotion=true;
  const marker=add(record,new T.BoxGeometry(.4,.12,1.1),'light',.6,.47,.3);marker.material=new T.MeshBasicMaterial({color:'#f2dfaf',toneMapped:false});marker.material.userData.liveMotion=true;
  add(record,new T.CylinderGeometry(.18,.18,.25,12),'trim',0,.55,0);
  arm=new T.Group();arm.position.set(4.75,1,-2.6);arm.name='record-tonearm';rig.add(arm);
  add(arm,new T.CylinderGeometry(.45,.45,1.6,16),'primary',0,-.25,0);
  const points=[[0,.3,0],[-.5,.3,3],[-2.4,-.25,5]];
  const needleMat=new T.MeshBasicMaterial({color:'#dddcc8',toneMapped:false});needleMat.userData.liveMotion=true;const tube=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,.16,6,false),needleMat);tube.castShadow=false;arm.add(tube);
  const stylus=add(arm,new T.BoxGeometry(.7,.3,.9),'secondary',-2.4,-.4,5);stylus.rotation.y=-.65;
 }else{
  const hall=k.hall(w,d,27,{peaks:3});
  // Three connected roof waves carry complementary cyan, silver and violet skins.
  for(const u of[.15,.49,.83])curve(Array.from({length:25},(_,i)=>{const p=hall.top(u,i/24);p[1]+=.12;return p;}),.13,'trim',36);
  box(0,3,d*.365,w*.33,4.3,.3,'ink');
  const starGeo=new T.OctahedronGeometry(.68,0),starMaterial=new T.MeshBasicMaterial({color:new T.Color('#f5d58c').multiplyScalar(2.2),toneMapped:false});starMaterial.userData.liveMotion=true;
  stars=new T.InstancedMesh(starGeo,starMaterial,12);stars.castShadow=false;stars.userData.noHit=true;stars.name='galaxy-stars';
  const points=Array.from({length:12},(_,i)=>{const p=hall.top(.13+(i%4)*.23,.15+Math.floor(i/4)*.34);p[1]+=.55;return p;});stars.userData.positions=points;g.add(stars);
  const barMaterial=new T.MeshBasicMaterial({color:'#8ce4e5',toneMapped:false});barMaterial.userData.liveMotion=true;
  bars=new T.InstancedMesh(new T.BoxGeometry(1,1,1),barMaterial,9);bars.castShadow=false;bars.userData.noHit=true;bars.name='galaxy-equaliser';
  // Along the flowing facade, rather than detached rectangular antennae.
  bars.userData.positions=Array.from({length:9},(_,i)=>{const p=hall.walls(0,.24+i*.06,.35,.5);return p;});g.add(bars);
 }
 g.userData.purposeKind='music';g.userData.designKey=profile.designKey;g.userData.singleStructure=true;g.userData.sculpted=true;
 g.userData.musicEffect=musicEffect(g,records?'records':'galaxy',{record,arm,stars,bars});return g;
}
