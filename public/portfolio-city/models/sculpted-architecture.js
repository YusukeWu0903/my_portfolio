import * as T from '../vendor/three.module.js';
import{unitBox,toonRamp}from'./resources.js';

// Continuous envelopes and roof fields. No stacks of unrelated boxes or annexes.
export function sculptKit(style,colors){
 const g=new T.Group(),m=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,style==='anime'?new T.MeshToonMaterial({color,gradientMap:toonRamp,side:T.DoubleSide}):new T.MeshStandardMaterial({color,roughness:key==='glass'?.25:.48,metalness:key==='glass'?.45:.22,side:T.DoubleSide})]));
 // Architectural edge LEDs retain their authored colour at night.
 m.trim.userData.liveMotion=true;m.trim.emissive.copy(m.trim.color);m.trim.emissiveIntensity=.55;
 function mesh(geometry,material){const o=new T.Mesh(geometry,typeof material==='string'?m[material]:material);o.castShadow=o.receiveShadow=true;g.add(o);return o;}
 function box(x,y,z,w,h,d,key){const o=mesh(unitBox,key);o.position.set(x,y,z);o.scale.set(w,h,d);return o;}
 function surface(point,nu,nv,key){const positions=[],uv=[],indices=[];for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){positions.push(...point(i/nu,j/nv));uv.push(i/nu,j/nv);}for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){const a=j*(nu+1)+i;indices.push(a,a+nu+1,a+1,a+1,a+nu+1,a+nu+2);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();if(key!==undefined)mesh(geo,key);return geo;}
 function curve(points,r,key,segments=40){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),segments,r,5,false),key);}
 function loft(w,d,h,{twist=0,lobes=2,bulge=.1,lean=.04,peak=.25}={}){
  const point=(t,v,offset=1)=>{const a=t+twist*v,rad=1+bulge*Math.cos(lobes*t+.6)+.05*Math.sin(v*Math.PI),taper=1-.14*v;return[w*.35*rad*taper*Math.cos(a)*offset+w*lean*Math.sin(v*Math.PI*1.1),1+v*h*(1-peak*.5+peak*.5*Math.sin(t+.4)),d*.36*rad*taper*Math.sin(a)*offset+d*.025*Math.sin(v*Math.PI*2)];};
  surface((u,v)=>point(u*Math.PI*2,v),48,12,'glass');
  for(let i=0;i<6;i++)curve(Array.from({length:17},(_,j)=>point(i/6*Math.PI*2,.02+j*.95/16,1.012)),.045,'light',24);
  surface((u,v)=>{const p=point(u*Math.PI*2,1);return[p[0]*v,1+h*(1-peak*.5)+(p[1]-(1+h*(1-peak*.5)))*v,p[2]*v];},48,5,'light');
  const wrap=(t0,t1,v0,v1,key,offset=1.035,sweep=0)=>surface((u,v)=>point(t0+(t1-t0)*u,Math.max(.015,Math.min(1,v0+(v1-v0)*v+sweep*Math.sin(u*Math.PI))),offset),36,8,key);
  const screen=(t0,t1,v0,v1)=>{wrap(t0-.03,t1+.03,v0-.012,v1+.012,'ink',1.055);return{geometry:surface((u,v)=>point(t0+(t1-t0)*u,v0+(v1-v0)*v,1.075),24,7)};};
  return{point,wrap,screen};
 }
 function hall(w,d,h,{peaks=3,fold=false}={}){
  const plan=(x,z)=>[x*w*.405*(1-.09*Math.cos(z*Math.PI))+w*.025*Math.sin(z*Math.PI),z*d*.405*(1-.09*Math.cos(x*Math.PI))];
  const height=(x,z)=>{let sum=0;for(let i=0;i<peaks;i++){const span=peaks===2?.9:1.2,centre=-span/2+i*span/(peaks-1)+.1*Math.sin(z*2+i),distance=Math.abs(x-centre),weight=fold?Math.max(0,1-distance/.43):Math.exp(-distance*distance/(peaks===2?.13:.075));sum+=weight*(i===1?1:i===0?.62:.76);}return 5.5+h*sum*(.86+.14*Math.cos((z+.15)*Math.PI*.6));};
  const top=(u,v)=>{const x=u*2-1,z=v*2-1,[px,pz]=plan(x,z);return[px,height(x,z),pz];};
  const walls=(side,u,v,offset=0)=>{let x,z;if(side===0){x=u*2-1;z=1;}else if(side===1){x=1;z=1-u*2;}else if(side===2){x=1-u*2;z=-1;}else{x=-1;z=u*2-1;}const[px,pz]=plan(x,z);return[px+(side===1?offset:side===3?-offset:0),1+(height(x,z)-1)*v,pz+(side===0?offset:side===2?-offset:0)];};
  for(let i=0;i<peaks;i++)surface((u,v)=>top((i+u)/peaks,v),fold?10:20,24,['primary','light','secondary'][i%3]);
  for(let side=0;side<4;side++)surface((u,v)=>walls(side,u,v),32,8,'glass');
  for(const side of[0,1]){for(const v of[.3,.62])curve(Array.from({length:25},(_,i)=>walls(side,i/24,v,.05)),.045,'trim',24);for(let i=1;i<5;i++)curve(Array.from({length:9},(_,j)=>walls(side,i/5,j/8,.06)),.04,'light',10);}
  for(let i=1;i<peaks;i++)curve(Array.from({length:25},(_,j)=>{const p=top(i/peaks,j/24);p[1]+=.08;return p;}),.11,'trim',32);
  const screen=(side,u0,u1,v0,v1)=>{const minimum=Math.min(...Array.from({length:49},(_,i)=>walls(side,u0+(u1-u0)*i/48,1)[1])),y0=1+(minimum-1)*v0,y1=1+(minimum-1)*v1;const point=(u,v,offset,extra=0)=>{const p=walls(side,u0-extra+(u1-u0+extra*2)*u,0,offset);p[1]=y0-extra*20+(y1-y0+extra*40)*v;return p;};surface((u,v)=>point(u,v,.2,.012),24,7,'ink');return{geometry:surface((u,v)=>point(u,v,.35),24,7)};};
  return{top,walls,screen};
 }
 return{g,m,mesh,box,surface,curve,loft,hall};
}

export function fluidSite(k,w,d){k.box(0,.4,0,w*.91,.8,d*.91,'ink');k.box(0,1.2,d*.4,w*.36,.25,1.7,'trim');for(const side of[-1,1]){k.box(side*w*.37,1,d*.37,w*.12,.55,d*.13,'light');k.box(side*w*.37,1.32,d*.37,w*.1,.1,d*.11,'leaf');}}
