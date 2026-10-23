import * as T from '../vendor/three.module.js';
import{kit}from'./architecture.js';
import{nightlifeEffect}from'./nightlife-effects.js';

export function roxyClub(profile,width,depth,style,mix){
 const k=kit(mix,10,{style,tier:'high',purpose:'club',palette:profile}),{box}=k,w=width*.84,d=depth*.8,h=23;
 k.m.dark.color.set('#20293e');k.m.stone.color.set(profile.wallHex).multiplyScalar(.38);k.m.metal.color.set('#7882a5');k.m.glass.color.set('#354568');
 box(0,.8,0,w,1.6,d,'dark');
 // A continuous cut-corner nightclub, with a diagonal folded crown.
 const shape=new T.Shape(),points=[[-w*.44,-d*.4],[w*.27,-d*.4],[w*.45,-d*.23],[w*.45,d*.23],[w*.27,d*.41],[-w*.3,d*.41],[-w*.45,d*.26],[-w*.45,-d*.23]];
 points.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();
 const geo=new T.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false,steps:1});geo.rotateX(-Math.PI/2);const shell=new T.Mesh(geo,k.m.stone);shell.position.y=1;shell.castShadow=shell.receiveShadow=true;shell.name='club-shell';k.g.add(shell);
 const roof=box(0,h+1.4,0,w*.88,.75,d*.77,'metal');roof.rotation.z=.06;
 // A supported angular entrance portal; all faces stay inside the same plot.
 const front=d*.415;
 box(0,3.7,front,w*.48,5.2,.2,'glass');
 for(const side of[-1,1]){const pier=box(side*w*.29,4.2,front+.42,1.05,7.2,1.1,'dark');pier.rotation.z=-side*.12;}
 box(0,7.8,front+.4,w*.65,.8,1.6,'dark');box(0,1.05,front+.8,w*.63,.3,2,'metal');
 // The large facade display is a music visualiser, not an office window grid.
 box(-w*.015,15.3,front,w*.71,11.7,.5,'dark');
 const screens=[{x:-w*.015,y:15.3,z:front+.27,w:w*.67,h:11.1},{x:w*.453+.28,y:13,z:-d*.02,w:d*.35,h:9,ry:Math.PI/2}];
 box(w*.453,13,-d*.02,.5,9.5,d*.38,'dark');
 const strips=[{x:0,y:h+1.85,z:d*.39,w:w*.85,h:.16,rz:.06},{x:0,y:8.25,z:front+1.1,w:w*.64,h:.18}];
 for(const side of[-1,1]){strips.push({x:side*w*.29,y:4.2,z:front+1,w:.16,h:6.7,rz:-side*.12});strips.push({x:side*w*.35,y:15.1,z:front+.28,w:.18,h:12.2});}
 for(const side of[-1,1]){box(side*w*.42,.75,d*.44,w*.11,.7,1.4,'metal');box(side*w*.42,1.15,d*.44,w*.09,.14,1.1,'green');}
 const g=k.finish();g.userData.purposeKind='club';g.userData.designKey=profile.designKey;g.userData.singleStructure=true;g.userData.roxyClub=true;g.userData.nightlifeEffect=nightlifeEffect(g,'club',screens,strips);return g;
}
