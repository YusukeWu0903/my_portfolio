import * as T from'../vendor/three.module.js';import{kit}from'./architecture.js';
export function musicRestaurant(profile,width,depth,style,mix){
 const k=kit(mix,7,{style,tier:'high',purpose:'restaurant',palette:profile}),{box,tree}=k,w=width*.86,d=depth*.82,h=10.5;
 k.m.glass.transparent=true;k.m.glass.opacity=.7;k.m.glass.depthWrite=false;
 box(0,.7,0,w,1.4,d,'stone');box(0,6,0,w*.94,10,d*.89,'glass');box(0,h,0,w,1,d,'metal');box(0,1.8,0,w*.9,.25,d*.85,'cream');
 for(const s of[-1,1]){for(let x=-w*.43;x<=w*.44;x+=w*.14)box(x,6,s*d*.45,.15,9,.22,'metal');for(let z=-d*.4;z<=d*.41;z+=d*.2)box(s*w*.47,6,z,.18,9,.14,'metal');}
 box(0,8,0,w*.96,.18,d*.91,'metal');box(0,4,d*.46,w*.94,.16,.2,'metal');box(0,2.5,d*.48,w*.24,4,.15,'glass');box(0,4.8,d*.55,w*.42,.3,1.8,'metal');
 for(const x of[-w*.27,w*.27])for(const z of[-d*.23,d*.15]){box(x,3,z,2.6,.25,2,'cream');box(x,2.35,z,.3,1.2,.3,'metal');for(const s of[-1,1])box(x+s*1.6,2.6,z,1.1,1.7,.8,'red');}
 for(const s of[-1,1]){box(s*w*.4,h+.7,-d*.3,w*.13,.5,d*.18,'cream');box(s*w*.4,h+1,-d*.3,w*.12,.2,d*.17,'green');tree(s*w*.4,d*.28);}
 const g=k.finish(),piano=new T.Group(),black=new T.MeshStandardMaterial({color:'#283342',roughness:.22,metalness:.35}),ivory=new T.MeshStandardMaterial({color:'#fff4d8',roughness:.4}),gold=new T.MeshStandardMaterial({color:'#e8bd69',roughness:.32,metalness:.5}),cube=new T.BoxGeometry(1,1,1);for(const m of[black,ivory,gold])m.userData.liveMotion=true;
 const add=(parent,x,y,z,ww,hh,dd,mat)=>{const o=new T.Mesh(cube,mat);o.position.set(x,y,z);o.scale.set(ww,hh,dd);o.castShadow=o.receiveShadow=true;parent.add(o);return o;};
 const shape=new T.Shape();shape.moveTo(-3,2.8);shape.lineTo(3,2.8);shape.lineTo(3,0);shape.bezierCurveTo(3,-4,-3,-4,-3,0);shape.closePath();const bodyGeo=new T.ExtrudeGeometry(shape,{depth:.5,bevelEnabled:true,bevelSize:.12,bevelThickness:.08,bevelSegments:2,steps:1});bodyGeo.rotateX(Math.PI/2);const body=new T.Mesh(bodyGeo,black);body.position.y=2.4;body.castShadow=true;piano.add(body);
 for(const[x,z]of[[-2.2,1.6],[2.2,1.6],[0,-2.3]])add(piano,x,1.2,z,.35,2.4,.35,black);
 const lidPivot=new T.Group();lidPivot.position.set(-3,2.65,0);lidPivot.rotation.z=.3;piano.add(lidPivot);const lid=new T.Mesh(bodyGeo,black);lid.position.x=3;lid.scale.y=.2;lidPivot.add(lid);lid.castShadow=true;add(piano,2.4,3.4,-.5,.12,1.8,.12,gold);
 add(piano,0,2.1,3.35,6.3,.4,1.6,black);const keys=[];for(let i=0;i<12;i++){const pivot=new T.Group();pivot.position.set(-2.75+i*.5,2.4,2.8);piano.add(pivot);add(pivot,0,0,.7,.46,.18,1.4,ivory);keys.push(pivot);}
 const sharps=[];for(const i of[0,1,3,4,5,7,8,10]){const pivot=new T.Group();pivot.position.set(-2.5+i*.5,2.62,2.8);piano.add(pivot);add(pivot,0,0,.4,.23,.19,.8,black);sharps.push({pivot,index:i});}add(piano,0,.85,5.1,3.3,.35,1.2,black);for(const s of[-1,1])add(piano,s*1.2,.4,5.1,.2,.8,.7,gold);
 const platform=new T.Mesh(new T.CylinderGeometry(5.8,5.8,.45,48),gold);platform.position.y=-.1;piano.add(platform);
 const note=(x,z,yy,mirror)=>{const head=new T.Mesh(new T.SphereGeometry(.65,16,12),black);head.position.set(x,yy,z);head.scale.set(1.2,.65,.65);piano.add(head);add(piano,x+.65,yy+1.8,z,.18,3.7,.18,gold);const flag=add(piano,x+1.1,yy+3.4,z,.9,.2,.25,gold);flag.rotation.z=mirror*.35;};note(-5,0,1,1);note(4.7,-1,1.4,-1);
 const scale=Math.min(w/16,d/14);piano.scale.setScalar(scale);piano.position.set(0,h+.8,-d*.06);g.add(piano);
 const effect={building:g,motion:piano,kind:'restaurant',frames:48,duration:4,setFrame(frame,count=48){const f=((frame%count)+count)%count*48/count,index=Math.floor(f/4),press=Math.sin(f%4/4*Math.PI);keys.forEach((p,i)=>p.rotation.x=i===index?press*.14:0);sharps.forEach(({pivot,index:i})=>pivot.rotation.x=i===index?press*.12:0);}};effect.setFrame(0);g.userData={...g.userData,purposeKind:'restaurant',designKey:profile.designKey,pianoEffect:effect};return g;
}
