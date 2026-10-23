import * as T from '../vendor/three.module.js';import{kit}from'./architecture.js';
import{specialDetails}from'./special-details.js';
export function purposeBuilding(kind,width,depth,style,variant=0,west=0,seed=0,palette=null){
 const k=kit(west,seed+variant*97+({cinema:2,mall:1,hospital:3}[kind]||0),{style,tier:'high',purpose:kind,palette}),{box,tower,roundTower,fins,tree}=k,w=width*.86,d=depth*.82,v=variant;
 box(0,.7,0,w,1.4,d,'dark');
 if(kind==='park'){box(0,.3,0,w,.6,d,'green');box(0,.65,0,w,.1,2,'stone');box(0,.7,0,2,.1,d,'stone');for(let x=-w*.4;x<=w*.4;x+=4)for(const z of[-d*.32,d*.32])tree(x,z);if(v===0){const f=new T.Mesh(new T.CylinderGeometry(2.7,3,1,24),k.m.glass);f.position.y=1;k.g.add(f);}else if(v===1){box(0,.6,0,w*.7,.15,d*.65,'metal');for(const x of[-w*.3,w*.3])box(x,1.1,0,1.2,.6,d*.45,'stone');}else{for(const x of[-w*.22,w*.22])for(const z of[-d*.18,d*.18])tree(x,z);}}
 else if(kind==='cinema'){
 box(0,3,0,w,6,d,'glass');box(0,11,-d*.06,w*.96,12,d*.86,'dark');for(const x of[-.32,0,.32])box(x*w,17.5,-d*.12,w*.27,1.2,d*.7,'metal');
 box(0,11,d*.382,w*.7,7,.45,'screen');box(0,11,d*.399,w*.33,3,.15,'metal');box(0,13,d*.403,w*.33,.8,.16,'cream');for(let i=0;i<5;i++)box(-w*.14+i*w*.07,13,d*.41,w*.03,.8,.18,'dark');box(0,6.5,d*.49,w*1.02,.8,2,'red');for(let x=-w*.4;x<=w*.4;x+=3)box(x,2,d*.51,.22,4,.35,'metal');
 box(-w*.37,10,d*.4,1.5,9,.65,'red');box(w*.37,10,d*.4,1.5,9,.65,'red');
 }else if(kind==='mall'){
 box(0,5.8,0,w,11.6,d,'stone');for(const x of[-1,1])tower(x*w*.32,-d*.05,w*.3,14+v*2,d*.84);
 box(0,7,d*.17,w*.3,14,d*.65,'glass');box(0,14.2,d*.12,w*.34,.45,d*.74,'metal');
 for(let x=-w*.42;x<=w*.42;x+=3)box(x,2.8,d*.51,2.3,4,.3,'glass');box(0,4.8,d*.55,w*.96,.6,1.8,'metal');
 }else if(kind==='hospital'){
 box(0,4,d*.15,w,8,d*.7,'cream');tower(0,-d*.13,w*.9,29+v*3,d*.72);
 box(-w*.13,24,d*.235,1.5,7,.6,'red');box(-w*.13,24,d*.24,5.5,1.5,.65,'red');box(0,4.3,d*.56,w*.46,.7,3,'red');box(0,2,d*.52,w*.3,3,.5,'glass');
 const helipad=new T.Mesh(new T.CylinderGeometry(4,4,.3,32),k.m.dark);helipad.position.set(-w*.13,29.3+v*3,-d*.18);k.g.add(helipad);for(const x of[-1.2,1.2])box(-w*.13+x,29.51+v*3,-d*.18,.35,.1,2.7,'cream');box(-w*.13,29.51+v*3,-d*.18,2.4,.1,.35,'cream');
 }else if(kind==='venue'){
 box(0,4,0,w*.92,8,d*.94,'glass');const roof=new T.Mesh(new T.SphereGeometry(1,32,16,0,Math.PI*2,0,Math.PI/2),k.m.metal);roof.scale.set(w*.51,7+v,d*.51);roof.position.y=8;k.g.add(roof);roof.castShadow=true;for(let x=-w*.4;x<=w*.4;x+=2.5)box(x,4,d*.48,.3,8,.5,'metal');
 }else if(kind==='landmark'){
 tower(0,0,w*.62,66,d*.61);fins(w*.62,66,d*.61,3);tower(w*.27,-d*.16,w*.23,52,d*.38);box(0,68,0,w*.45,4,d*.45,'metal');box(0,73,0,.65,6,.65,'metal');
 }else{
 const heights={office:44,residence:36,training:25,restaurant:18,ktv:27,club:22,foundation:38,boutique:23,studio:26,agency:45,television:31,music:30,wellness:29};const h=(heights[kind]||32)+v*3,tw=w*(kind==='restaurant'?.68:.76),td=d*.68;
  if(kind==='agency'||kind==='office'){roundTower(-w*.09,-d*.1,tw,h,td,0,kind==='agency'?8:32);box(w*.3,h*.43,-d*.25,w*.15,h*.86,d*.32,'stone');}
 else if(kind==='training'){
  // One continuous academy volume with rehearsal glazing and an auditorium roof.
  roundTower(0,-d*.06,w*.88,h,d*.81,0,32);
  const roof=new T.Mesh(new T.SphereGeometry(1,32,12,0,Math.PI*2,0,Math.PI/2),k.m.metal);
  roof.scale.set(w*.46,2.4,d*.43);roof.position.set(0,h,-d*.06);roof.rotation.x=-.055;k.g.add(roof);roof.castShadow=true;
  const canopy=box(0,7.4,d*.42,w*.77,.5,d*.17,'metal');canopy.rotation.z=-.055;
  box(0,4,d*.4,w*.59,6.5,.2,'glass');
 }
 else if(kind==='foundation'){tower(0,-d*.2,w*.78,h,d*.56);for(const side of[-1,1])box(side*w*.35,4,d*.34,w*.14,8,d*.34,'stone');box(0,8.5,d*.34,w*.84,1.1,d*.35,'metal');}
 else if(kind==='music'){tower(-w*.25,-d*.16,w*.4,h,d*.66);tower(w*.23,-d*.1,w*.42,h*.7,d*.74);}
 else if(kind==='wellness'){roundTower(0,-d*.1,w*.92,h,d*.8);}
 else if(kind==='boutique'){tower(0,-d*.08,w*.9,h,d*.8);box(0,h+.5,-d*.08,w*.94,1,d*.84,'metal');}
 else if(kind==='studio'){tower(-w*.3,-d*.25,w*.26,h,d*.4);box(w*.12,7,-d*.12,w*.65,14,d*.74,'metal');}
 else if(kind==='restaurant'){box(0,h*.36,-d*.12,w*.83,h*.72,d*.72,'wall');box(-w*.2,h*.83,-d*.15,w*.4,h*.22,d*.5,'glass');}
 else if(kind==='television'){tower(-w*.21,-d*.17,w*.42,h,d*.6);tower(w*.2,-d*.11,w*.48,h*.64,d*.72);}
 else if(kind==='club'){box(0,h*.4,-d*.14,w*.82,h*.8,d*.74,'dark');box(-w*.3,h*.5,-d*.14,w*.18,h,d*.8,'metal');}
 else tower(-w*.06,-d*.12,tw,h,td);box(0,3,d*.23,w,6,d*.53,'dark');box(0,2.6,d*.5,w*.75,3.7,.4,'glass');box(0,6.2,d*.31,w*.97,.45,d*.42,'metal');
 
 if(['ktv','club','music'].includes(kind)){box(tw*.39,h*.58,d*.235,tw*.17,h*.64,.6,'red');box(-tw*.15,10,d*.24,tw*.48,5,.5,'screen');}
 if(kind==='residence'){for(const side of[-1,1])for(let y=8;y<h-3;y+=6){box(side*tw*.32,y,d*.23,tw*.23,.3,1.1,'metal');box(side*tw*.32,y+.65,d*.275,tw*.23,1.1,.12,'glass');}for(const x of[-w*.3,w*.3])tree(x,-d*.32,h);}
 if(kind==='restaurant'||kind==='wellness'){for(const x of[-w*.34,w*.34])tree(x,d*.27,6.5);box(0,7,d*.27,w*.5,.4,d*.25,'metal');}
 if(kind==='boutique')for(const x of[-w*.3,0,w*.3])box(x,3,d*.52,.4,5,.4,'metal');
 if(kind==='ktv'){box(0,h+1,-d*.12,1.2,2,1.2,'metal');box(0,h+4,-d*.12,1.2,5,1.2,'dark');const mic=new T.Mesh(new T.SphereGeometry(2.5,16,12),k.m.metal);mic.position.set(0,h+7,-d*.12);mic.scale.set(.9,1.35,.9);k.g.add(mic);}
 if(kind==='music'){box(-w*.25,h+1,-d*.16,.7,2,.7,'metal');const disc=new T.Mesh(new T.CylinderGeometry(3.3,3.3,.45,32),k.m.dark);disc.rotation.x=Math.PI/2;disc.position.set(-w*.25,h+4,-d*.16);k.g.add(disc);const hub=new T.Mesh(new T.CylinderGeometry(.8,.8,.5,20),k.m.metal);hub.rotation.x=Math.PI/2;hub.position.copy(disc.position);k.g.add(hub);}
 if(kind==='studio'){box(0,6,d*.2,w*.94,12,d*.6,'dark');box(0,4,d*.51,w*.45,5,.5,'metal');}
 if(kind==='television'){box(0,h+3,-d*.12,.6,6,.6,'metal');const dish=new T.Mesh(new T.SphereGeometry(2.8,20,12,0,Math.PI*2,0,Math.PI/2),k.m.metal);dish.rotation.x=.55;dish.position.set(0,h+5,-d*.12);k.g.add(dish);}
 }
 // The same architectural vocabulary as the six detailed samples: a real lobby,
 // framed glazing, shallow cornices, roof equipment and planted pedestrian space.
 if(kind!=='park'){
  const front=d*.51;
  box(0,.35,front+.28,w*.78,.35,.9,'cream');
  box(0,.7,front+.1,w*.61,.3,.65,'metal');
  box(0,2.65,front+.08,w*.72,3.8,.18,'glass');
  for(let x=-w*.34;x<=w*.34+.01;x+=w*.17)box(x,2.6,front+.22,.14,3.9,.18,'cream');
  box(0,4.8,front+.45,w*.83,.3,1.45,'metal');
  for(const side of[-1,1]){
   box(side*w*.36,2.5,front+.65,.2,4.6,.2,'cream');
   box(side*w*.42,.8,d*.34,w*.11,.8,d*.17,'cream');
   box(side*w*.42,1.28,d*.34,w*.095,.2,d*.15,'green');
  }
 }
 if(kind==='hospital'){
  for(const side of[-1,1])box(side*w*.32,4.5,d*.51,w*.2,4.7,.2,'glass');
  box(-w*.13,17.5,d*.235,w*.69,.38,.35,'accent');
  for(const x of[-w*.36,-w*.22,w*.02,w*.15])box(x,15.5,d*.235,.16,25,.3,'cream');
  box(0,29.4,-d*.13,w*.92,.5,d*.74,'metal');
 }else if(kind==='training'){
  for(const side of[-1,1])box(side*w*.25,4,d*.51,.22,6,.28,side<0?'accent':'red');
  box(0,7,d*.35,w*.3,3,.3,'screen');
 }else if(kind==='restaurant'){
  // A roof terrace and supported pergola distinguish the dining pavilion.
  const top=(18+v*3)*.72;
  for(const side of[-1,1]){box(side*w*.31,top+1.3,d*.1,.2,2.6,.2,'metal');box(side*w*.31,top+1.3,-d*.34,.2,2.6,.2,'metal');}
  for(let x=-w*.34;x<=w*.34;x+=1.5)box(x,top+2.65,-d*.12,.2,.23,d*.55,'cream');
  for(let x=-w*.3;x<=w*.3;x+=w*.2){box(x,7,d*.5,w*.17,.55,1.1,'red');box(x,7.45,d*.47,w*.17,.35,.18,'cream');}
  for(const x of[-w*.31,w*.31])tree(x,-d*.3,top);
 }else if(kind==='ktv'){
  const h=27+v*3;
  for(const side of[-1,1])box(side*w*.32,h*.46,d*.225,.48,h*.76,.45,'metal');
  for(let y=8;y<h-3;y+=3.5)box(0,y,d*.23,w*.48,.22,.3,'accent');
  box(0,6.1,d*.51,w*.72,.65,.25,'red');
 }else if(kind==='club'){
  for(let x=-w*.34;x<=w*.34;x+=w*.085)box(x,10,d*.235,.28,8,.4,Math.round(x*10)%2?'accent':'red');
  box(0,5.2,d*.53,w*.88,.5,.7,'red');
 }else if(kind==='foundation'){
  for(let x=-w*.27;x<=w*.27;x+=w*.135)box(x,4.7,d*.51,.38,7.3,.4,'cream');
  box(0,9.1,d*.33,w*.82,.38,d*.38,'cream');
  box(0,16,d*.09,w*.16,8,.35,'accent');
 }else if(kind==='boutique'){
  for(const x of[-w*.3,0,w*.3]){box(x,3,d*.55,w*.23,4,.24,'glass');box(x,5.3,d*.64,w*.24,.55,1.1,'red');box(x,2.7,d*.71,.7,1.9,.35,'metal');}
  box(w*.23,13,d*.36,w*.32,.8,.3,'accent');
  for(let y=9;y<21;y+=3)box(-w*.2,y,d*.225,w*.46,.16,.2,'cream');
 }else if(kind==='studio'){
  for(let x=-w*.39;x<w*.4;x+=1.5)box(x,9,d*.51,.36,7,.4,Math.round(x*10)%3?'accent':'red');
  for(let x=-w*.12;x<w*.4;x+=w*.13){const o=box(x,14.7,-d*.1,w*.1,1.7,d*.58,'cream');o.rotation.z=.16;}
  box(0,4,d*.55,w*.38,4,.18,'glass');
 }else if(kind==='agency'){
  const h=45+v*3;
  for(const x of[-w*.28,w*.1])box(x,h*.49,d*.2,.35,h*.9,.3,'metal');
  box(-w*.09,h+.7,-d*.1,w*.6,.55,d*.5,'accent');
  box(0,6,d*.5,w*.66,1,.3,'red');
 }else if(kind==='television'){
  box(w*.19,13,d*.26,w*.44,8,.8,'metal');box(w*.19,13,d*.29+.45,w*.39,7,.1,'screen');
  for(let i=0;i<5;i++)box(w*.19+(i-2)*w*.06,12.5,d*.29+.52,w*.035,2+i%3,.1,i%2?'accent':'red');
  for(let y=9;y<28;y+=4)box(-w*.21,y,d*.135,w*.44,.18,.25,'cream');
 }else if(kind==='music'){
  for(let i=0;i<7;i++)box(-w*.25+(i-3)*w*.045,12,d*.18,w*.025,5+3*Math.sin(i*.8),.35,i%2?'metal':'red');
  box(w*.23,18,d*.28,w*.43,.5,.3,'accent');
 }else if(kind==='wellness'){
  for(let y=9;y<26;y+=5)box(0,y,d*.19,w*.63,.2,.4,'cream');
  for(const side of[-1,1]){box(side*w*.32,6.9,d*.21,w*.2,.8,d*.35,'cream');box(side*w*.32,7.4,d*.21,w*.18,.3,d*.32,'green');}
  box(0,6.8,d*.28,w*.34,.2,d*.23,'water');
 }else if(kind==='park'){
  box(0,1.55,0,4,.18,3.5,'water');
  for(const side of[-1,1])for(const z of[-d*.24,d*.24]){box(side*w*.25,1.15,z,3,.25,.9,'metal');box(side*w*.25,1.75,z-.38,3,1,.15,'cream');for(const x of[-1,1])box(side*w*.25+x,.85,z,.14,.5,.6,'dark');}
  for(const side of[-1,1]){box(side*w*.4,1,d*.34,2,.6,2,'cream');box(side*w*.4,1.4,d*.34,1.8,.3,1.8,'red');}
 }
 specialDetails(k,kind,w,d);const g=k.finish();g.userData.purposeKind=kind;g.userData.motionFace={width:w*.7,height:kind==='cinema'?11:5,z:kind==='cinema'?d*.4:d*.52};return g;
}






