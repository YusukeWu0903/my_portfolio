import * as T from'../vendor/three.module.js';import{createBuilding}from'../styles/buildings.js';import{createEffects}from'../motion-lite/effects.js';
import{premiumVariant}from'./premium-variants.js';
import{venueLighting}from'./venue-effects.js';
const heroKinds=new Set(['office','residence','mall','cinema','venue','landmark']);
export function isHero(kind){return heroKinds.has(kind);}
export function heroBuilding(kind,width,depth,style='anime',variant=0,mix=.5,options={}){
 if(kind==='office'&&variant===3||kind==='landmark'&&[4,5].includes(variant))return premiumVariant(kind,width,depth,style,mix,variant===5?2:1);
 const palette=options.palette,raw=createBuilding(kind,style,palette?{stone:palette.wallHex,roof:palette.wallHex,accent:palette.accentHex,glass:palette.glassHex}:{});raw.traverse(o=>{for(const m of(Array.isArray(o.material)?o.material:[o.material]))if(m?.color){const c=m.color.getHexString();if(c==='fff1d4')m.color.set(mix>.58?'#fff0d0':'#ecf4ee');if(c==='fff9eb')m.color.set('#fff9eb');if(c==='66c4d6')m.color.set(mix>.58?'#a0d6cf':'#66c4d6');if(c==='e18193'&&variant)m.color.set(variant===1?'#bb86b9':'#e98f73');if(c==='e7b966'&&variant===2)m.color.set('#beced1');}});const wrapper=new T.Group();raw.userData.sampleKind=kind;wrapper.add(raw);let effect;
 if(kind==='cinema'){
  // Raise auditorium floors before adding the sign, retaining its exact dimensions.
  const stretch=Math.max(1,Math.min(2.2,depth/width*.9));
  for(const child of raw.children){child.position.y*=1.2;child.scale.y*=1.2;child.position.z*=stretch;child.scale.z*=stretch;}
  raw.userData.connectedAuditorium=true;
 }
 if(['cinema','mall','landmark'].includes(kind)){
  const groups=['cinema','mall','landmark'].map(k=>{if(k===kind)return raw;const g=new T.Group();g.userData.sampleKind=k;return g;});
  const all=createEffects({newGroups:groups});effect=all.find(e=>e.kind===kind);
  for(const e of all)if(e!==effect)e.building.traverse(o=>{o.geometry?.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m?.dispose());});
 }
 if(kind==='venue')effect=venueLighting(raw);
 if(effect)effect.motion.traverse(o=>{for(const m of(Array.isArray(o.material)?o.material:[o.material]))if(m)m.userData.liveMotion=true;});
 const cube=new T.BoxGeometry(1,1,1),gold=new T.MeshToonMaterial({color:'#efc675'}),rose=new T.MeshToonMaterial({color:'#e985b1'}),navy=new T.MeshToonMaterial({color:'#344d77'});
 const box=(x,y,z,w,h,d,mat)=>{const o=new T.Mesh(cube,mat);o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;raw.add(o);return o;};
 if(kind==='mall'){
  if(options.frontGift){
   // The sign sits above the front entrance; the skylight ends at z=3.7.
   const sign=new T.Group();sign.position.set(0,15,9.1);sign.name='gift-front-sign';raw.add(sign);
   const signBox=(x,y,z,w,h,d,mat)=>{const o=new T.Mesh(cube,mat);o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;sign.add(o);return o;};
   const giftMat=new T.MeshToonMaterial({color:palette.accentHex});
   signBox(0,0,0,6.2,5.2,1.8,giftMat);signBox(0,2.7,0,6.6,.5,2.1,giftMat);
   signBox(0,0,1,.62,5.3,.13,gold);signBox(0,0,1.07,6.25,.5,.14,gold);
   for(const side of[-1,1]){const pts=[new T.Vector3(0,2.9,0),new T.Vector3(side*1.9,4.8,0),new T.Vector3(side*2.4,3.5,0),new T.Vector3(0,2.9,0)];const bow=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),32,.16,8,false),gold);bow.castShadow=true;sign.add(bow);}
   const bracket=box(0,12,8.3,4,.8,2,navy);bracket.name='gift-sign-bracket';
  }else{
   box(-7,14,-3,1,4,1,navy);box(-7,17,-3,6,5,2.5,rose);
   const pts=[];for(let i=0;i<=24;i++){const a=i/24*Math.PI;pts.push(new T.Vector3(-7+2.1*Math.cos(a),19.3+2.7*Math.sin(a),-3));}
   const handle=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.22,6,false),gold);raw.add(handle);handle.castShadow=true;box(-7,16.7,-1.7,3,.4,.12,gold);
  }
 }
 const warm=new T.MeshBasicMaterial({color:'#ffd19b',toneMapped:false});warm.userData.nightWindow=true;
 const pane=(x,y,z,w,h)=>{box(x,y,z,w,h,.045,warm);};
 if(kind==='office')for(let y=7;y<35;y+=2.7)for(let x=-5.4;x<5;x+=1.9)if((Math.round(y*10+x*10)%5+5)%5<2)pane(x,y,6.1,.85,1.25);
 if(kind==='residence')for(let t=0;t<5;t++){const w=21-t*2.4,d=17-t*1.9,x=-t*.65,z=-t*.7;for(let f=0;f<2;f++)for(let a=-w/2+1;a<w/2;a+=2.6)if((Math.round(a*10)+t+f)%3===0)pane(x+a,5.35+t*5.4+f*2.7,z+d/2+.04,1.5,1.65);}
 if(kind==='mall')for(let x=-9;x<=9;x+=3)pane(x,2.2,10.62,1.8,2.2);
 if(kind==='cinema')for(let x=-6;x<8;x+=2)pane(x,2.4,10.8,1,2.3);
 const bb=new T.Box3().setFromObject(raw),size=bb.getSize(new T.Vector3()),centre=bb.getCenter(new T.Vector3()),s=Math.min((width-2)/size.x,(depth-2)/size.z,kind==='venue'?3:1.8);
 raw.scale.set(s,Math.min(kind==='venue'?1.6:1.12,s*1.13),s);raw.position.set(-centre.x*s,0,-centre.z*s);
 if(kind==='cinema'){
  // Keep the existing tower and rotating sign together on the right. The
  // connected auditorium is authored in parcel coordinates, not tower scale.
  raw.position.x+=(width-2-size.x*s)/2;
  const structure=new T.Group();structure.name='cinema-connected-structure';wrapper.remove(raw);structure.add(raw);wrapper.add(structure);
  const wall=new T.MeshToonMaterial({color:'#45597b'}),trim=new T.MeshToonMaterial({color:'#e8bd72'}),glass=new T.MeshToonMaterial({color:'#66bdcf'}),dark=new T.MeshToonMaterial({color:'#26354f'}),cube=new T.BoxGeometry(1,1,1);
  const add=(name,x,y,z,w,h,d,material)=>{const o=new T.Mesh(cube,material);o.name=name;o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=true;structure.add(o);return o;};
  const w=width-3.6,d=Math.min(depth-4,19),front=d/2;
  add('cinema-connected-auditorium',0,8.5,0,w,12,d,wall);
  add('cinema-continuous-base',0,1.4,0,w+.5,2.5,d+.8,dark);
  add('cinema-connected-roof',0,14.7,0,w+.3,.45,d+.3,trim);
  add('cinema-connected-glazing',0,7.8,front+.09,w-1,7.5,.15,glass);
  for(let x=-w/2+1;x<w/2;x+=2.4)add('cinema-front-mullion',x,7.8,front+.22,.13,7.7,.15,trim);
  for(const y of[5.5,10.2])add('cinema-connected-floor-line',0,y,front+.24,w-.5,.16,.2,trim);
  add('cinema-entrance-canopy',-w*.24,4.2,front+.5,w*.35,.35,1.1,dark);
  raw.name='cinema-right-main';wrapper.userData.connectedWidth=w;
 }
 wrapper.userData={...wrapper.userData,sampleKind:'district',purposeKind:kind,heroEffect:effect,heroRaw:raw,hero:true,singleStructure:true,frontGift:!!options.frontGift};
 return wrapper;
}





