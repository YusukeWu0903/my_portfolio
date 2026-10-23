import * as T from'../vendor/three.module.js';import{kit}from'./architecture.js';
import{metropolitanGarden}from'./metropolitan-garden.js';
export function greenSpace(width,depth,style,variant=0){
 if(variant===3)return metropolitanGarden(width,depth);
 const k=kit(.5,0,{style,tier:'high',purpose:'park'}),{box,tree}=k,w=width*.92,d=depth*.92;
 box(0,.2,0,w,.4,d,'cream');box(0,.46,0,w-.7,.15,d-.7,'green');
 const pool=(x,z,ww,dd)=>{box(x,.62,z,ww+.7,.35,dd+.7,'cream');box(x,.83,z,ww,.08,dd,'water');};
 const bench=(x,z)=>{box(x,1,z,2.5,.25,.8,'metal');box(x,1.5,z-.35,2.5,.9,.12,'cream');for(const s of[-1,1])box(x+s*.9,.7,z,.15,.5,.6,'dark');};
 if(variant===0){
  box(0,.57,0,w*.55,.18,d*.61,'stone');box(0,.6,0,w,.12,2,'cream');box(0,.6,0,2,.12,d,'cream');
  for(const[r,y]of[[3.7,.8],[2.8,1.05],[1.15,1.8]]){const m=new T.Mesh(new T.CylinderGeometry(r,r,.25,40),r===2.8?k.m.water:k.m.cream);m.position.y=y;k.g.add(m);}box(0,1.6,0,.45,1.4,.45,'metal');
  for(const s of[-1,1]){for(const z of[-d*.32,d*.32]){tree(s*w*.33,z);bench(s*w*.21,z);}box(s*w*.38,.8,0,w*.11,.6,d*.2,'cream');box(s*w*.38,1.15,0,w*.095,.25,d*.18,'red');}
 }else if(variant===1){
  box(0,.61,0,w,.16,2.2,'cream');box(-w*.12,.6,0,1.8,.16,d,'cream');
  for(const s of[-1,1])for(const z of[-d*.28,d*.28]){box(s*w*.3,.8,z,w*.25,.5,d*.24,'cream');box(s*w*.3,1.1,z,w*.23,.15,d*.22,'red');for(const a of[-.08,.08])for(const b of[-.06,.06])box(s*w*.3+w*a,1.28,z+d*b,w*.07,.22,d*.04,'accent');}
  for(const s of[-1,1])for(const z of[-d*.31,d*.31])tree(s*w*.44,z);
  for(const s of[-1,1])box(s*w*.12,2.2,-d*.27,.2,3.2,.2,'metal');for(let x=-w*.17;x<=w*.17;x+=1.2)box(x,3.85,-d*.27,.18,.2,d*.25,'cream');bench(w*.24,0);bench(-w*.3,0);
 }else{
  pool(w*.1,-d*.06,w*.39,d*.48);box(0,.96,d*.06,w*.7,.22,1.7,'metal');
  for(let x=-w*.4;x<w*.45;x+=Math.max(3,w*.15))for(const z of[-d*.36,d*.37])tree(x,z);
  for(const z of[-d*.1,d*.13])tree(-w*.35,z);bench(-w*.16,d*.3);bench(w*.26,d*.3);
  for(const s of[-1,1])box(-w*.1+s*1.4,1.22,d*.06,.12,.5,1.7,'cream');
 }
 const g=k.finish();g.userData.purposeKind='park';g.userData.greenSpace=variant;return g;
}
