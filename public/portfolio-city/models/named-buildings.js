import {elegantBuilding} from './elegant-buildings.js';
import{musicBuilding}from'./music-buildings.js';
import{starKtv}from'./star-ktv.js';
import{roxyClub}from'./roxy-club.js';
import{mediaBuilding,isMediaDesign}from'./media-buildings.js';
import * as T from'../vendor/three.module.js';import{kit}from'./architecture.js';import{purposeBuilding}from'./buildings.js';import{heroBuilding,isHero}from'./hero-buildings.js';import{greenSpace}from'./green-spaces.js';
import{foundationChurch}from'./foundation-church.js';
import{musicRestaurant}from'./music-restaurant.js';
import{premiereCinema,redbeanStudio,feidaStudio,trainingVenue}from'./entertainment-buildings.js';
export function namedBuilding(profile,width,depth,style,mix,variant=0){
 const seed=Number(profile.id.slice(10)),key=profile.designKey,kind=profile.kind;
 if(kind==='cinema')return premiereCinema(profile,width,depth);
 if(kind==='training')return trainingVenue(profile,width,depth);
 if(kind==='studio'&&key==='redbean-arches')return redbeanStudio(profile,width,depth);
 if(kind==='studio'&&key==='feida-sawtooth')return feidaStudio(profile,width,depth);
 if(kind==='music')return musicBuilding(profile,width,depth,style,mix);
 if(isMediaDesign(key))return mediaBuilding(profile,width,depth,style,mix);
 if(kind==='ktv')return starKtv(profile,width,depth,style,mix);
 if(kind==='club')return roxyClub(profile,width,depth,style,mix);
 if(kind==='foundation')return foundationChurch(profile,width,depth,style,mix);
 if(['wellness','boutique','restaurant'].includes(kind))return elegantBuilding(profile,width,depth);
 if(kind==='park'){const g=greenSpace(width,depth,style,3);g.userData.designKey=key;return g;}
 if(!['studio','agency','television','music'].includes(kind)){
  const g=isHero(kind)?heroBuilding(kind,width,depth,style,0,mix,kind==='mall'?{palette:profile,frontGift:true}:{}):purposeBuilding(kind,width,depth,style,0,mix,seed,profile);
  if(isHero(kind)){const colors={'fff1d4':profile.wallHex,'66c4d6':profile.glassHex,'e18193':profile.accentHex};g.traverse(o=>{for(const m of Array.isArray(o.material)?o.material:[o.material])if(m?.color&&colors[m.color.getHexString()])m.color.set(colors[m.color.getHexString()]);});}
  g.userData.designKey=key;return g;
 }
 const k=kit(mix,seed,{style,tier:'high',purpose:kind,palette:profile}),{box,tower,roundTower,tree}=k,w=width*.86,d=depth*.82;
 box(0,.7,0,w,1.4,d,'dark');
 const screen=(x,y,z,ww,hh)=>{box(x,y,z,ww+.5,hh+.5,.6,'metal');box(x,y,z+.35,ww,hh,.15,'screen');for(let i=0;i<5;i++)box(x+(i-2)*ww*.14,y-.4+(i%2)*.5,z+.47,ww*.08,hh*.24,.1,i%2?'accent':'red');};
 const entrance=(x,z,ww)=>{box(x,2.5,z,ww,4,.2,'glass');for(const s of[-1,1])box(x+s*ww*.45,2.5,z+.15,.17,4.2,.25,'metal');box(x,4.9,z+.6,ww+1,.4,1.8,'metal');};
 if(key==='redbean-arches'){
  for(const s of[-1,1]){box(s*w*.24,5,-d*.12,w*.43,10,d*.68,'wall');const roof=new T.Mesh(new T.SphereGeometry(1,32,12,0,Math.PI*2,0,Math.PI/2),k.m.roof);roof.scale.set(w*.215,4,d*.34);roof.position.set(s*w*.24,10,-d*.12);k.g.add(roof);roof.castShadow=true;}
  box(0,15,-d*.12,w*.18,4,d*.24,'metal');for(const x of[-1.8,1.8]){const reel=new T.Mesh(new T.CylinderGeometry(1.8,1.8,.6,24),k.m.metal);reel.rotation.x=Math.PI/2;reel.position.set(x,18,-d*.12);k.g.add(reel);}screen(w*.15,7,d*.24,w*.42,4);entrance(-w*.2,d*.32,w*.3);
 }else if(key==='feida-sawtooth'){
  box(0,6,-d*.12,w*.91,12,d*.72,'wall');for(let i=0;i<4;i++){const x=-w*.34+i*w*.23;const roof=box(x,13.1,-d*.12,w*.22,1.3,d*.72,'metal');roof.rotation.z=.28;box(x+w*.105,13.1,-d*.12,.12,2.1,d*.69,'glass');}
  box(0,16,-d*.12,w*.5,5,d*.3,'dark');screen(0,16,d*.035,w*.42,3.5);entrance(-w*.1,d*.32,w*.45);
 }

 // Common pedestrian scale stays consistent while each skyline is authored above.
 box(0,3,d*.29,w,6,d*.42,'dark');entrance(0,d*.51,w*.6);for(const s of[-1,1]){box(s*w*.4,.8,d*.35,w*.12,.7,d*.16,'cream');box(s*w*.4,1.22,d*.35,w*.105,.16,d*.14,'green');}
 const g=k.finish();g.userData.purposeKind=kind;g.userData.designKey=key;g.userData.motionFace={width:w*.65,height:6,z:d*.52};return g;
}

