import * as T from'../vendor/three.module.js';
// Dedicated exterior details share the building's footprint, materials and batcher.
export function specialDetails(k,kind,w,d){
 const{box,tree}=k;
 const rail=(x,y,z,ww,dd)=>{for(const s of[-1,1]){box(x,y+.6,z+s*dd/2,ww,.1,.12,'metal');box(x+s*ww/2,y+.6,z,.12,.1,dd,'metal');for(const a of[-.35,0,.35])box(x+a*ww,y+.3,z+s*dd/2,.08,.6,.08,'metal');}};
 const skylight=(x,y,z,ww,dd)=>{box(x,y,z,ww,.55,dd,'glass');for(const a of[-.4,-.2,0,.2,.4])box(x+a*ww,y+.33,z,.1,.12,dd,'metal');};
 if(kind==='boutique'){
  // A single jewellery house crowned by a large faceted roof lantern.
  const gem=new T.Mesh(new T.OctahedronGeometry(3.7,0),k.m.accent);gem.scale.set(1.25,1,.9);gem.position.set(0,27,-d*.08);k.g.add(gem);gem.castShadow=true;
  box(0,23.6,-d*.08,2,.8,2,'metal');
  for(const side of[-1,1])box(side*w*.39,12,d*.325,.32,22,.4,'metal');
  for(let y=9;y<21;y+=4){box(0,y,d*.325,w*.68,2.6,.14,'glass');box(0,y+1.5,d*.34,w*.8,.24,.5,'metal');}
  for(const x of[-w*.3,0,w*.3]){box(x,3.1,d*.57,w*.22,4.2,.2,'dark');box(x,3.1,d*.7,w*.18,3.7,.15,'glass');box(x,1.15,d*.9,w*.13,.3,.8,'cream');}
 }else if(kind==='agency'){
  // A creative office with an attached media blade and a rooftop studio pavilion.
  box(w*.3,22,-d*.25,w*.18,40,d*.35,'accent');
  box(w*.305,23,-d*.25+d*.18,w*.16,15,.6,'metal');box(w*.305,23,-d*.25+d*.18+.35,w*.135,13,.16,'screen');
  for(let i=0;i<5;i++)box(w*.305+(i-2)*w*.023,22+i*.5,-d*.25+d*.18+.47,w*.016,3+i%3,.1,i%2?'red':'accent');
  skylight(-w*.09,45.7,-d*.1,w*.4,d*.36);rail(-w*.09,45.1,-d*.1,w*.62,d*.59);
  for(let y=10;y<44;y+=6)box(-w*.09,y,d*.24,w*.57,.23,.35,'metal');
  box(-w*.26,4.1,d*.5,w*.22,6.3,.25,'glass');box(w*.26,4.1,d*.5,w*.22,6.3,.25,'glass');
 }else if(kind==='foundation'){
  skylight(0,38.6,-d*.2,w*.36,d*.28);rail(0,38.3,-d*.2,w*.7,d*.5);for(const s of[-1,1])tree(s*w*.26,-d*.2,38.6);
 }else if(kind==='training'){
  for(const side of[-1,1])skylight(side*w*.24,26.8,-d*.08,w*.12,d*.36);
 }else if(kind==='wellness'){
  skylight(0,29.5,-d*.14,w*.36,d*.34);rail(0,29.3,-d*.14,w*.67,d*.6);
 }else if(kind==='television'){
  for(const s of[-1,1])box(-w*.21+s*w*.18,15.5,d*.14,.25,30,.35,'metal');skylight(w*.2,20.5,-d*.11,w*.29,d*.43);
 }else if(kind==='music'){
  rail(w*.23,21.4,-d*.1,w*.38,d*.65);for(const s of[-1,1])tree(w*.23+s*w*.12,-d*.1,21.7);
 }else if(kind==='studio'){
  for(const z of[-d*.2,d*.08]){box(w*.12,14.3,z,w*.58,.18,.16,'metal');for(const s of[-1,1])box(w*.12+s*w*.27,10.5,z,.25,7,.25,'metal');}
 }else if(kind==='ktv'||kind==='club'){
  for(const s of[-1,1]){box(s*w*.32,4.4,d*.55,.35,6,.35,'metal');box(s*w*.34,7.7,d*.41,w*.15,.35,d*.18,'accent');}
 }
 k.g.userData.specialDetailVersion=1;
}
