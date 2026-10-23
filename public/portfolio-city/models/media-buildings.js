import{createMediaEffect,mediaModes}from'./media-effects.js';
import{sculptKit,fluidSite}from'./sculpted-architecture.js';
export function isMediaDesign(key){return mediaModes.includes(key);}
export function mediaBuilding(profile,width,depth,style='anime'){
 const key=profile.designKey;if(!isMediaDesign(key))throw Error('Unknown media building');
 const palettes={
 'aite-broadcast':{glass:'#397d9b',primary:'#d7e5df',secondary:'#d06a4d',light:'#bbcdd0',ink:'#253c59',trim:'#d9b471',leaf:'#6da088'},
 'family-broadcast':{glass:'#356b8d',primary:'#e79b58',secondary:'#62b9af',light:'#efdab9',ink:'#3d405b',trim:'#c87588',leaf:'#7ca58b'},
 'xunmei-media':{glass:'#2c6c83',primary:'#e2a350',secondary:'#d96a67',light:'#d2d8cc',ink:'#28354f',trim:'#54c6bd',leaf:'#81a58b'},
 'davinci-wings':{glass:'#3b7180',primary:'#ca8155',secondary:'#365878',light:'#ead8b6',ink:'#283b51',trim:'#d66477',leaf:'#6aa194'}};
 const k=sculptKit(style,palettes[key]),w=width,d=depth,screens=[],strips=[];fluidSite(k,w,d);
 if(key==='aite-broadcast'){
  const body=k.loft(w,d,43,{twist:.3,lobes:3,bulge:.15,lean:-.035,peak:.4});
  body.wrap(-.6,1.15,.12,.99,'primary',1.035,.06);body.wrap(2.55,4.9,.14,.88,'light',1.035,-.08);body.wrap(-.15,.52,.12,.78,'secondary',1.06,.08);
  for(const t of[.95,2.65])k.curve(Array.from({length:21},(_,i)=>body.point(t,.05+i*.95/20,1.055)),.12,'trim',36);
  screens.push(body.screen(2.12,1.02,.3,.67),body.screen(.45,-.45,.25,.5));
  k.box(0,40,0,.6,18,.6,'light');for(const side of[-1,1]){const p=k.box(side*.8,48.5,0,.22,3.5,.22,'trim');p.rotation.z=-side*.4;}
  strips.push({x:0,y:49.8,z:.35,w:.4,h:.7,d:.16});
 }else if(key==='family-broadcast'){
  const hall=k.hall(w,d,35,{peaks:2});
  k.surface((u,v)=>{const p=hall.top(.65+u*.18,v);p[1]+=.14;return p;},10,24,'secondary');
  screens.push(hall.screen(0,.18,.82,.18,.91),hall.screen(1,.18,.72,.2,.75));
  for(const u of[.12,.88])k.curve(Array.from({length:25},(_,i)=>{const p=hall.top(u,i/24);p[1]+=.12;return p;}),.12,'trim',36);
  for(let i=0;i<5;i++){const p=hall.walls(0,.3+i*.1,.22,.48);strips.push({x:p[0],y:p[1],z:p[2],w:.5,h:.2});}
 }else if(key==='xunmei-media'){
  const body=k.loft(w,d,43,{twist:1.05,lobes:3,bulge:.16,lean:.05,peak:.28});
  body.wrap(-1.8,1.15,.15,.85,'primary',1.035,.12);body.wrap(2.4,4.9,.3,.99,'secondary',1.035,-.12);body.wrap(-.1,.45,.1,.7,'secondary',1.06,.08);body.wrap(4.6,5.6,.06,.7,'light',1.04,.08);
  for(const t of[-1.7,2.5])k.curve(Array.from({length:25},(_,i)=>body.point(t,.08+i*.88/24,1.06)),.12,'trim',40);
  screens.push(body.screen(2.13,1.12,.23,.83),body.screen(.32,-.55,.22,.53));
  for(let i=0;i<3;i++){const p=body.point(1.7,.12+i*.045,1.08);strips.push({x:p[0],y:p[1],z:p[2],w:1.1,h:.13});}
 }else{
  const hall=k.hall(w,d,29,{peaks:3,fold:true});
  for(const u of[.13,.5,.86])k.curve(Array.from({length:25},(_,i)=>{const p=hall.top(u,i/24);p[1]+=.12;return p;}),.11,'trim',36);
  screens.push(hall.screen(0,.2,.8,.29,.86),hall.screen(1,.12,.84,.2,.8));
  for(let i=0;i<4;i++){const p=hall.walls(0,.25+i*.16,.18,.48);strips.push({x:p[0],y:p[1],z:p[2],w:.5,h:.2});}
 }
 k.box(0,2.6,d*.367,w*.25,3.7,.3,'ink');
 const g=k.g;g.userData.purposeKind=profile.kind;g.userData.designKey=key;g.userData.singleStructure=true;g.userData.mediaBuilding=true;g.userData.sculpted=true;
 g.userData.mediaEffect=createMediaEffect(g,key,screens,strips);return g;
}
