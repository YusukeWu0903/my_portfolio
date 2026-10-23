import {redbeanBuilding} from './redbean-building.js';
import {approvedEntertainment} from './approved-entertainment.js';
import * as T from '../vendor/three.module.js';
import {toonRamp} from './resources.js';

const colors={cinema:{ink:'#312d49',glass:'#448d9f',gold:'#e5bb68',rose:'#c44564',cream:'#f1d9aa',light:'#ffe7a0'},redbean:{ink:'#392d48',glass:'#347b82',gold:'#e9c278',rose:'#d75b69',cream:'#e8d6b2',light:'#ffe59a'},feida:{ink:'#293752',glass:'#4092a1',gold:'#e6be63',rose:'#ce5360',cream:'#e9d7b0',light:'#ffdf88'},training:{ink:'#302e51',glass:'#4795a4',gold:'#edc26b',rose:'#cf597e',cream:'#f0d9ae',light:'#fff0ad'}};
function make(type){const g=new T.Group(),m={};for(const[k,c]of Object.entries(colors[type])){m[k]=new T.MeshToonMaterial({color:c,gradientMap:toonRamp,side:T.DoubleSide});if(k==='light'){m[k].emissive.set(c);m[k].emissiveIntensity=.4;m[k].userData.liveMotion=true;}}const cube=new T.BoxGeometry(1,1,1);function box(parent,name,x,y,z,w,h,d,key,moving=false){const o=new T.Mesh(cube,m[key]);o.name=name;o.position.set(x,y,z);o.scale.set(w,h,d);o.castShadow=o.receiveShadow=!moving;parent.add(o);return o;}function tube(parent,name,points,r,key,moving=false){const o=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),48,r,7,false),m[key]);o.name=name;o.castShadow=o.receiveShadow=!moving;parent.add(o);return o;}function prism(parent,name,pts,y,h,key){const s=new T.Shape();pts.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));s.closePath();const geo=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSegments:1,bevelSize:.13,bevelThickness:.13});geo.rotateX(-Math.PI/2);geo.translate(0,y,0);const o=new T.Mesh(geo,m[key]);o.name=name;o.castShadow=o.receiveShadow=true;parent.add(o);return o;}return{g,m,box,tube,prism};}
function motion(kind,building,moving,parts,duration){const e={kind,building,motion:moving,frames:48,duration,setFrame(frame,count=48){const p=((frame%count)+count)%count/count,a=p*Math.PI*2;if(kind==='cinema'){parts.star.rotation.y=a;parts.star.rotation.z=.1*Math.sin(a);parts.lamps.forEach((o,i)=>o.material.color.setHSL((.05+p*.16+i*.055)%1,.8,.54+.14*Math.sin(a+i)));}else if(kind==='redbean')parts.reel.rotation.z=a;else if(kind==='feida')parts.hinge.rotation.x=-.12-.48*(.5-.5*Math.cos(a));else parts.spots.forEach((o,i)=>{o.rotation.z=.24*Math.sin(a+i*Math.PI);o.rotation.x=.1*Math.cos(a+i*Math.PI);});}};e.setFrame(0);return e;}

export function premiereCinema(profile,width,depth){return approvedEntertainment(profile,width,depth,'cinema');}

export function redbeanStudio(profile,width,depth){return redbeanBuilding(profile,width,depth);}

export function feidaStudio(profile,width,depth){return approvedEntertainment(profile,width,depth,'feida');}
export function trainingVenue(profile,width,depth){return approvedEntertainment(profile,width,depth,'training');}
