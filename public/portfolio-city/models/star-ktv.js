import * as T from'../vendor/three.module.js';
import{kit}from'./architecture.js';
import{nightlifeEffect}from'./nightlife-effects.js';
export function starKtv(profile,width,depth,style,mix){
 const k=kit(mix,9,{style,tier:'high',purpose:'ktv',palette:profile}),{box}=k,w=width*.8,d=depth*.78,h=34;
 const plum=new T.MeshStandardMaterial({color:profile.wallHex,roughness:.38,metalness:.28});plum.color.multiplyScalar(.62);
 const pink=new T.MeshStandardMaterial({color:profile.accentHex,emissive:profile.accentHex,emissiveIntensity:.35,roughness:.3,metalness:.3}),blue=new T.MeshStandardMaterial({color:profile.glassHex,emissive:profile.glassHex,emissiveIntensity:.25,roughness:.25,metalness:.5});
 const mesh=(geo,mat,x,y,z,sx=1,sy=1,sz=1)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=o.receiveShadow=true;k.g.add(o);return o;};
 // All facade details share the exact taper and eight-sided orientation.
 const roofY=h+2,zc=-d*.04,angle=Math.PI/8,apothem=Math.cos(angle),radiusAt=y=>.5-.09*(y-2)/h,frontAt=y=>zc+d*apothem*radiusAt(y),slope=.09*d*apothem/h;
 box(0,1,0,w,2,d,'dark');
 const shell=mesh(new T.CylinderGeometry(.41,.5,1,8).rotateY(angle),plum,0,h/2+2,zc,w,h,d);
 shell.name='ktv-shell';
 const lamps=[{m:pink,index:0},{m:blue,index:3}],screens=[];
 for(let i=0;i<6;i++){const y=6+i*4.5,r=radiusAt(y)+.009,color=new T.Color(i%2?profile.glassHex:profile.accentHex).lerp(new T.Color(['#f06fae','#55c6d1','#eec365'][i%3]),.72),mat=new T.MeshBasicMaterial({color,toneMapped:false});lamps.push({m:mat,index:i});
  const rim=mesh(new T.CylinderGeometry(r,r,.28,8,true).rotateY(angle),mat,0,y,zc,w,1,d);rim.name='ktv-wave-band';rim.castShadow=false;
 }
 // The straight front facet carries two recessed speakers in a shared panel.
 const front=new T.Group();front.position.set(0,18,frontAt(18)+.05);front.rotation.x=-Math.atan(slope);k.g.add(front);front.name='ktv-audio-panel';
 const panel=(geo,mat,x,y,z,sx=1,sy=1,sz=1)=>{const o=new T.Mesh(geo,mat);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=o.receiveShadow=true;front.add(o);return o;};
 panel(new T.BoxGeometry(w*.27,21,.55),k.m.dark,0,0,.15);
 for(const side of[-1,1])panel(new T.BoxGeometry(.14,21.3,.2),k.m.metal,side*w*.14,0,.4);
 for(const y of[-5.3,5.3]){
  const radius=w*.105;
  panel(new T.CylinderGeometry(radius,radius,.35,32),k.m.dark,0,y,.55).rotation.x=Math.PI/2;
  panel(new T.TorusGeometry(radius,.18,8,40),pink,0,y,.8);
  panel(new T.SphereGeometry(radius*.37,24,16),blue,0,y,.85,1,1,.4);
 }
 for(let i=-2;i<=2;i++)panel(new T.BoxGeometry(.25,1.1+Math.abs(i)*.55,.15),blue,i*.62,0,.65);
 // Flush side-facet equaliser inlays are quads sampled from the shell surface.
 const sidePanel=(side,y,height)=>{
  const theta=side*Math.PI/4,half=.13;
  const pts=[];for(const[yy,delta]of[[y-height/2,-half],[y-height/2,half],[y+height/2,half],[y+height/2,-half]]){
   const r=radiusAt(yy)*apothem+.009,t=theta+delta;
   // r/cos(delta) projects a point onto this planar octagon facet.
   const rr=r/Math.cos(delta);pts.push(w*rr*Math.sin(t),yy,zc+d*rr*Math.cos(t));
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pts,3));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();
  const m=mesh(geo,side<0?blue:pink,0,0,0);m.material.side=T.DoubleSide;m.name='ktv-side-inlay';
 };
 for(const side of[-1,1])for(let i=0;i<5;i++)sidePanel(side,10+i*4,1.8);
 // Note displays follow the sloping side facets, without cutting into the shell.
 for(const side of[-1,1]){const y=20,t=side*Math.PI/4,r=radiusAt(y)*apothem+.025;screens.push({x:w*r*Math.sin(t),y,z:zc+d*r*Math.cos(t),w:3,h:8,ry:t,rx:-Math.atan(slope)});}
 // A compact entrance canopy meets the shell; no competing fan geometry.
 const doorZ=frontAt(4)+.15;
 box(0,3.8,doorZ,w*.25,4.4,.45,'glass');
 box(0,6.4,doorZ+.5,w*.35,.45,2,'metal');
 for(const side of[-1,1])box(side*w*.15,3.5,doorZ+.6,.24,5.5,.3,'accent');
 box(0,1.2,doorZ+.7,w*.36,.35,2,'metal');
 // A level roof plinth supports a tilted microphone. Its base is not tilted.
 const plinth=mesh(new T.CylinderGeometry(3.1,3.35,.65,32),k.m.metal,0,roofY+.325,zc);plinth.name='ktv-mic-plinth';
 const mic=new T.Group();mic.position.set(0,roofY+.65,zc);mic.rotation.z=-.26;k.g.add(mic);mic.name='ktv-microphone';
 const part=(geo,mat,y)=>{const o=new T.Mesh(geo,mat);o.position.y=y;o.castShadow=true;mic.add(o);return o;};
 part(new T.SphereGeometry(1.05,20,12),k.m.metal,.8);
 part(new T.CylinderGeometry(.75,.9,6.5,24),k.m.metal,4);
 const head=part(new T.SphereGeometry(3,20,12),k.m.dark,9.2);head.scale.set(1,1.2,1);
 for(let i=-2;i<=2;i++){const yy=i*.65,r=3*Math.sqrt(1-(yy/3.6)**2)+.06;const ring=part(new T.TorusGeometry(r,.1,6,40),pink,9.2+yy);ring.rotation.x=Math.PI/2;}
 // Crown star is wholly above the roof and has its own visible bracket.
 const sx=-w*.25,sz=zc+.5;const bracket=mesh(new T.BoxGeometry(.35,2.6,.5),k.m.metal,sx,roofY+1.3,sz);bracket.name='ktv-star-bracket';
 const shape=new T.Shape();for(let i=0;i<10;i++){const a=Math.PI/2+i*Math.PI/5,r=i%2?1.1:2.35,x=Math.cos(a)*r,y=Math.sin(a)*r;i?shape.lineTo(x,y):shape.moveTo(x,y);}shape.closePath();
 const star=mesh(new T.ExtrudeGeometry(shape,{depth:.4,bevelEnabled:true,bevelSize:.08,bevelThickness:.08,bevelSegments:1,steps:1}),k.m.metal,sx,roofY+3.8,sz);star.name='ktv-crown-star';
 // The entrance star clears both the canopy and the lower speaker ring.
 const entryStar=mesh(new T.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:false}),pink,0,8.6,doorZ+1.05,.66,.66,1);entryStar.name='ktv-entry-star';entryStar.castShadow=false;
 box(0,7.25,doorZ+.8,.26,1.1,.3,'metal');
 const g=k.finish();g.userData.purposeKind='ktv';g.userData.designKey=profile.designKey;g.userData.starKtv=true;g.userData.singleStructure=true;g.userData.ktvSurface={roofY,width:w,depth:d,zc,bodyHeight:h};g.userData.nightlifeEffect=nightlifeEffect(g,'ktv',screens,[],lamps);return g;
}
