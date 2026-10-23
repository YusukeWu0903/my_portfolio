import * as T from '../vendor/three.module.js';
import{cachedAsset,unitBox,unitCylinder,toonRamp}from'./resources.js';
// Stable variation is tied to building identity, never to frame timing or array order.
export function noise(seed,salt=0){const n=Math.sin(seed*127.1+salt*311.7)*43758.5453123;return n-Math.floor(n);}
export function districtMix(centres,x,z){
 const a=centres.find(c=>c.id==='CentreWest'),b=centres.find(c=>c.id==='CentreEast');
 const span=Math.max(32,Math.hypot(a.x-b.x,a.z-b.z)),dw=Math.hypot(x-a.x,z-a.z),de=Math.hypot(x-b.x,z-b.z);
 // A broad, slightly meandering transition instead of a nearest-core colour boundary.
 const t=T.MathUtils.clamp(.5+(de-dw)/(span*1.22)+.10*Math.sin(z/29),0,1);return t*t*(3-2*t);
}
const profiles=[
 {id:'terracotta',body:'#ad6b54',trim:'#bd987b',roof:'#665d55',glass:'#456774',rough:.83,metal:.04,open:.42,warm:1.5,cool:.12},
 {id:'limestone',body:'#c1b69a',trim:'#a7987d',roof:'#777c79',glass:'#626f69',rough:.78,metal:.05,open:.48,warm:1.5,cool:.45},
 {id:'bronze',body:'#776052',trim:'#c3a16a',roof:'#5d6262',glass:'#655b50',rough:.48,metal:.35,open:.57,warm:.8,cool:.2},
 {id:'olive-stone',body:'#8a9580',trim:'#b8b39a',roof:'#5e6965',glass:'#3f6260',rough:.75,metal:.07,open:.48,warm:.65,cool:.3},
 {id:'graphite',body:'#5b626a',trim:'#a6a7a5',roof:'#484f56',glass:'#374d60',rough:.54,metal:.25,open:.61,warm:.8,cool:.85},
 {id:'champagne',body:'#b7a88c',trim:'#d0c2a5',roof:'#717572',glass:'#75756a',rough:.45,metal:.25,open:.65,warm:.8,cool:.65},
 {id:'sage-glass',body:'#6c9c91',trim:'#b0bfb4',roof:'#637977',glass:'#417b76',rough:.28,metal:.42,open:.87,warm:.65,cool:1.1},
 {id:'blue-glass',body:'#548eac',trim:'#a2b6c3',roof:'#5c7383',glass:'#326a91',rough:.25,metal:.5,open:.9,warm:.2,cool:1.8},
 {id:'slate',body:'#7e8c9b',trim:'#b8bcc5',roof:'#5c6573',glass:'#425e7d',rough:.38,metal:.32,open:.72,warm:.5,cool:1.2},
 {id:'silver',body:'#a5b7ba',trim:'#c6d0cc',roof:'#687b80',glass:'#56858e',rough:.3,metal:.5,open:.83,warm:.4,cool:1.3}
];
const finishPalettes={
 hospital:['#f9f0db','#61c5c3','#f6d589','#69b9cb','#ed7185'],
 training:['#c6e9db','#85b9df','#f1ca77','#79bdcf','#bb91d1'],
 restaurant:['#eaa17f','#68bdb3','#f4d087','#629ea3','#d87276'],
 ktv:['#bc83ba','#6cbfd0','#f3ce85','#6388b7','#f188ab'],
 club:['#7384b4','#a595d3','#eaca85','#77bec8','#ef88ad'],
 foundation:['#eee3bf','#77b4ac','#d3ad6c','#7aabb5','#b87670'],
 boutique:['#efc0c8','#8dccc1','#eac476','#96b9d0','#d878a0'],
 studio:['#8d9dc3','#72c3d1','#f3cd7a','#648da9','#e9999d'],
 agency:['#a3d9cf','#a8b3df','#efd18c','#71b7c8','#d68fac'],
 television:['#8fcedb','#6ba4c4','#eac877','#5986b0','#e997ab'],
 music:['#7ec8c4','#91acd7','#f4cb7d','#628eb5','#ee92a3'],
 wellness:['#c4dfba','#7ec5bf','#d8b67e','#7fb7bb','#cf9bab'],
 park:['#e8d9bc','#7dc7ca','#edc77c','#80b6bb','#e8a3be']
};
export function kit(mix,seed=0,options={}){
 mix=typeof mix==='boolean'?(mix?1:0):mix;
 const weights=profiles.map(p=>p.cool+(p.warm-p.cool)*mix),total=weights.reduce((a,b)=>a+b,0);let pick=noise(seed,7)*total,index=0;
 while(index<profiles.length-1&&(pick-=weights[index])>0)index++;
 const source=profiles[index],tier=options.tier||'low',authored=!!options.tier,anime=(options.style||'anime')==='anime',hero=tier==='high';
 const brighten=(c,t)=>'#'+new T.Color(c).lerp(new T.Color('#fff2d8'),t).getHexString();
 const palette=options.palette?[options.palette.wallHex,options.palette.glassHex,'#edc77c',options.palette.glassHex,options.palette.accentHex]:finishPalettes[options.purpose],p={...source,body:brighten(source.body,hero?.26:.18),trim:brighten(source.trim,.32),roof:brighten(source.roof,.42),glass:brighten(source.glass,.14)};
 if(!authored)Object.assign(p,{body:brighten(source.body,.08),trim:brighten(source.trim,.16),roof:brighten(source.roof,.25),glass:brighten(source.glass,.07)});
 if(palette)Object.assign(p,{body:palette[0],roof:palette[0],trim:palette[2],glass:palette[3]});
 const g=new T.Group(),cube=unitBox,ramp=toonRamp;
 const asset=(bucket,key,create)=>hero?create():cachedAsset(bucket,key,create);
 const material=(color,roughness=.65,metalness=.08)=>asset('solid',[anime,color,roughness,metalness].join('|'),()=>anime?new T.MeshToonMaterial({color,gradientMap:ramp}):new T.MeshStandardMaterial({color,roughness,metalness}));
 // World-space floor proportions: a short podium must not inherit a tower's 24 rows.
 const facades=new Map();
 const wallFor=(ww=14,hh=35)=>{
  const rows=Math.max(1,Math.round(hh/2.8)),cols=Math.max(2,Math.round(ww/(p.open>.8?1.7:2.15))),key=cols+':'+rows;
  if(facades.has(key))return facades.get(key);
  const mat=asset('facade',JSON.stringify([anime,tier,p.body,p.trim,p.glass,p.open,rows,cols]),()=>{
  const c=document.createElement('canvas');c.width=256;c.height=512;const x=c.getContext('2d'),cw=256/cols,ch=512/rows;
  x.fillStyle=p.body;x.fillRect(0,0,256,512);
  const pw=.43+p.open*.38,ph=.52+p.open*.21;
  for(let r=0;r<rows;r++)for(let col=0;col<cols;col++){
   const a=col*cw+cw*(1-pw)/2,b=r*ch+ch*(1-ph)/2;
   x.fillStyle=p.trim;x.globalAlpha=.24;x.fillRect(col*cw,r*ch,1,ch);x.fillRect(0,r*ch,256,1);x.globalAlpha=1;
   x.fillStyle='#405c73';x.fillRect(a-1,b-1,cw*pw+2,ch*ph+2);
   x.fillStyle=p.glass;x.fillRect(a,b,cw*pw,ch*ph);
   x.fillStyle='#c4e8ee';x.globalAlpha=.28+((col+r)%3)*.07;x.fillRect(a,b,cw*pw*.26,ch*ph);x.globalAlpha=.48;x.fillRect(a,b+ch*ph*.82,cw*pw,ch*ph*.1);x.globalAlpha=1;
   x.fillStyle=p.trim;x.fillRect(a,b+ch*ph,cw*pw,Math.max(1,ch*.035));
  }
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
  const mat=anime?new T.MeshToonMaterial({color:'#ffffff',gradientMap:ramp}):new T.MeshStandardMaterial({color:'#ffffff',roughness:p.rough,metalness:p.metal});mat.map=tex;mat.userData.facadeGrid={rows,cols,pw,ph};mat.userData.finishTier=tier;return mat;});if(mat.userData.shared)mat.map.userData.shared=true;facades.set(key,mat);return mat;
 };
 const m={wall:wallFor(),stone:material(p.body),dark:material('#425b78'),glass:material(p.glass,.25,.25),metal:material(p.trim,.38,.25),roof:material(p.roof,.8),red:material(palette?.[4]||'#df8a9e'),cream:material('#fff1d4'),green:material('#7cb98d'),accent:material(palette?.[1]||brighten(p.glass,.18)),water:material('#79d8de'),screen:material('#53648f')};
 m.screen.emissive.set('#78508c');m.screen.emissiveIntensity=.15;
 const box=(px,y,z,ww,hh,dd,key='wall')=>{const o=new T.Mesh(cube,key==='wall'?wallFor(ww,hh):m[key]);o.position.set(px,y,z);o.scale.set(ww,hh,dd);o.castShadow=o.receiveShadow=true;g.add(o);return o;};
 const tower=(px,z,ww,hh,dd,y=0)=>{const o=box(px,y+hh/2,z,ww,hh,dd);o.material=[wallFor(dd,hh),wallFor(dd,hh),m.roof,m.dark,wallFor(ww,hh),wallFor(ww,hh)];box(px,y+hh+.12,z,ww+.1,.24,dd+.1,'metal');
  for(const side of[-1,1]){box(px+side*(ww/2-.12),y+hh/2,z+dd/2+.03,.2,hh,.16,'metal');box(px,y+hh+.45,z+side*(dd/2-.12),ww,.65,.16,'cream');}
  for(const side of[-1,1])box(px+side*(ww/2-.1),y+hh+.45,z,.16,.65,dd,'cream');
  if(tier!=='low')for(let a=-ww/2+2.5;a<ww/2-1;a+=3.8)box(px+a,y+hh/2,z+dd/2+.08,.1,hh,.13,'metal');return o;
 };
 const roundTower=(px,z,ww,hh,dd,y=0,segments=32)=>{const o=new T.Mesh(unitCylinder(segments),[wallFor(Math.PI*(ww+dd)/2,hh),m.roof,m.dark]);o.scale.set(ww,hh,dd);o.position.set(px,y+hh/2,z);o.castShadow=o.receiveShadow=true;g.add(o);return o;};
 const fins=(ww,hh,dd,spacing=3)=>{for(let a=-ww/2+.4;a<ww/2;a+=spacing){box(a,hh/2,dd/2+.12,.18,hh,.23,'metal');box(a,hh/2,-dd/2-.12,.18,hh,.23,'metal');}};
 const tree=(px,z,y=0)=>{box(px,y+1,z,.22,2,.22,'dark');const o=new T.Mesh(new T.IcosahedronGeometry(1.3,1),m.green);o.position.set(px,y+2.5,z);o.scale.y=1.4;g.add(o);o.castShadow=true;};
 const finish=()=>{const used=new Set();g.traverse(o=>(Array.isArray(o.material)?o.material:[o.material]).forEach(mat=>{if(mat)used.add(mat);}));for(const mat of new Set([...Object.values(m),...facades.values()]))if(!used.has(mat)&&!mat.userData.shared){if(!mat.map?.userData.shared)mat.map?.dispose();mat.dispose();}const groups=new Map();for(const o of [...g.children])if(o.geometry===cube&&!Array.isArray(o.material)){const key=o.material.uuid;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o);}for(const list of groups.values())if(list.length>1){const inst=new T.InstancedMesh(cube,list[0].material,list.length);list.forEach((o,i)=>{o.updateMatrix();inst.setMatrixAt(i,o.matrix);g.remove(o);});inst.castShadow=inst.receiveShadow=true;inst.computeBoundingSphere();g.add(inst);}g.userData.sampleKind='district';g.userData.architectureV2=true;g.userData.materialFamily=p.id;g.userData.districtMix=mix;g.userData.finishTier=tier;return g;};
 return{g,box,tower,roundTower,fins,tree,m,finish};
}
export function createDistrictBuilding(tier,variant,w,h,d,style,mix=0,seed=0){
 const k=kit(mix,seed+variant*97,{style,tier}),{box,tower,roundTower,fins}=k;
 const v=variant%(tier==='low'?2:5);
 const ratio=.72+.24*noise(seed,31),depthRatio=.64+.29*noise(seed,37);w*=ratio;d*=depthRatio;
 box(0,1,0,w,2,d,'dark');
 if(tier==='low'){
  if(v===0){tower(0,0,w,h,d);box(-w*.38,h*.43,-d*.1,w*.17,h*.86,d*.84,'stone');}
  else{tower(-w*.12,-d*.09,w*.71,h,d*.77);tower(w*.32,d*.1,w*.3,h*.68,d*.8);}
 }else{
  if(v===0){tower(0,0,w*.8,h,d*.82);box(w*.36,h*.46,-d*.08,w*.16,h*.92,d*.65,'stone');if(noise(seed,8)>.55)fins(w*.8,h,d*.82,2.8);}
  if(v===1){tower(-w*.26,-d*.08,w*.46,h,d*.78);tower(w*.27,d*.08,w*.42,h*(.66+.19*noise(seed,12)),d*.8);box(0,2.1,0,w,3.8,d,'stone');}
  if(v===2){roundTower(0,0,w,h,d*.9);box(-w*.33,h*.45,-d*.25,w*.23,h*.9,d*.32,'stone');}
  if(v===3){tower(-w*.26,0,w*.43,h,d);tower(w*.18,-d*.29,w*.63,h*.76,d*.4);box(0,2,d*.25,w,3,d*.5,'glass');}
  if(v===4){roundTower(-w*.12,0,w*.77,h,d*.9,0,8);tower(w*.33,-d*.17,w*.28,h*.86,d*.57);box(0,h+.35,0,w*.34,.7,d*.38,'metal');}
 }
 box(0,1.5,d*.48,w*.55,2.5,.35,'glass');
 // A restrained street-level base gives ordinary buildings the same crafted finish.
 box(0,3,d*.49,w*.74,.22,1,'metal');
 for(const side of[-1,1])box(side*w*.3,1.4,d*.5,.12,2.8,.16,'cream');
 box(0,.3,d*.52,w*.72,.35,.65,'cream');
 if(tier==='mid'){box(-w*.3,.7,d*.36,w*.19,.8,d*.2,'cream');box(-w*.3,1.13,d*.36,w*.17,.18,d*.18,'green');box(w*.25,h+.7,-d*.1,w*.18,1.1,d*.18,'roof');}
 k.g.userData.silhouette=v;k.g.userData.tier=tier;return k.finish();
}



