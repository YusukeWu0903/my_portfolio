import * as T from '../vendor/three.module.js';
export const kinds=['office','residence','mall','cinema','venue','landmark'];
export const styles=['miniature','realistic','anime'];
const unitBox=new T.BoxGeometry(1,1,1),unitCylinder=new T.CylinderGeometry(1,1,1,40),unitBeam=new T.CylinderGeometry(1,1,1,6),leaf=new T.IcosahedronGeometry(1,1);
for(const geometry of[unitBox,unitCylinder,unitBeam,leaf])geometry.userData.shared=true;
const palettes={miniature:{stone:'#e6ddc9',glass:'#5f9d9f',dark:'#344c57',metal:'#bc9a65',accent:'#b76a59',green:'#66856a',water:'#71bbb8',roof:'#f4eddd'},realistic:{stone:'#c8c4b9',glass:'#395f74',dark:'#222d37',metal:'#8f969b',accent:'#935345',green:'#395d44',water:'#387e91',roof:'#e2e2dc'},anime:{stone:'#fff1d4',glass:'#66c4d6',dark:'#425b82',metal:'#e7b966',accent:'#e18193',green:'#77b988',water:'#65dbe1',roof:'#fff9eb'}};
export function createBuilding(kind,style='miniature',paletteOverride={}){
 const g=new T.Group(),p={...palettes[style],...paletteOverride},materials={},simple=[];g.userData={kind,style};
 const ramp=new T.DataTexture(Uint8Array.from([80,145,211,255]),4,1,T.RedFormat);ramp.minFilter=ramp.magFilter=T.NearestFilter;ramp.needsUpdate=true;
 function material(key){if(materials[key])return materials[key];const color=p[key]||key;let m;if(style==='anime')m=new T.MeshToonMaterial({color,gradientMap:ramp});else if(key==='glass'||key==='water')m=new T.MeshPhysicalMaterial({color,roughness:style==='realistic'?.16:.3,metalness:style==='realistic'?.55:.3,clearcoat:1,clearcoatRoughness:.18,envMapIntensity:style==='realistic'?1.4:.65});else m=new T.MeshStandardMaterial({color,roughness:key==='metal'?.36:.76,metalness:key==='metal'?.72:.03});materials[key]=m;return m;}
 function mesh(geo,key,x=0,y=0,z=0,sx=1,sy=1,sz=1,ry=0,batch=false){const m=new T.Mesh(geo,material(key));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.rotation.y=ry;m.castShadow=m.receiveShadow=true;g.add(m);if(batch)simple.push(m);return m;}
 const box=(x,y,z,w,h,d,key='stone',ry=0)=>mesh(unitBox,key,x,y,z,w,h,d,ry,true);
 const cyl=(x,y,z,rx,h,rz,key='stone')=>mesh(unitCylinder,key,x,y,z,rx,h,rz,0,true);
 function beam(a,b,r=.07,key='metal'){const av=new T.Vector3(...a),bv=new T.Vector3(...b),m=new T.Mesh(unitBeam,material(key));m.position.copy(av).add(bv).multiplyScalar(.5);m.scale.set(r,av.distanceTo(bv),r);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());m.castShadow=true;g.add(m);simple.push(m);return m;}
 function curve(points,r=.08,key='metal'){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a))),48,r,6,false),key);}
 function volume(poly,y,top,key='glass',topPoly=poly){const pos=[],idx=[],n=poly.length;for(const [x,z]of poly)pos.push(x,typeof y==='function'?y(x,z):y,z);for(const [x,z]of topPoly)pos.push(x,typeof top==='function'?top(x,z):top,z);const tris=T.ShapeUtils.triangulateShape(poly.map(([x,z])=>new T.Vector2(x,z)),[]);for(const[a,b,c]of tris){idx.push(c,b,a,a+n,b+n,c+n);}for(let i=0;i<n;i++){const j=(i+1)%n;idx.push(i,j,j+n,i,j+n,i+n);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const m=mesh(geo,key);m.material.side=T.DoubleSide;return m;}
 function railing(x,y,z,w,d){for(const s of [-1,1]){box(x,y+.65,z+s*d/2,w,.06,.06,'metal');for(let xx=-w/2;xx<=w/2;xx+=1.4)box(x+xx,y+.32,z+s*d/2,.045,.65,.045,'metal');}for(const s of [-1,1])box(x+s*w/2,y+.65,z,.06,.06,d,'metal');}
 function planter(x,y,z,w=3,d=1){box(x,y+.22,z,w,.44,d,'stone');for(let xx=-w/2+.3;xx<w/2;xx+=.6)mesh(leaf,'green',x+xx,y+.65,z,.5,.48,d*.55,0,true);}
 function entrance(x,z,w=8,h=4,y=0){box(x,y+h/2,z,w,h,.2,'glass');for(let k=-w/2;k<=w/2;k+=w/4)box(x+k,y+h/2,z+.13,.09,h,.12,'metal');box(x,y+h,z,w+.5,.24,2.8,'metal');for(let i=0;i<3;i++)box(x,y+.12+i*.14,z+1.5-i*.4,w+1,.22,2.4-i*.4,'stone');}
 function curtain(x,z,w,h,y=0,side=false,step=1.6){for(let q=-w/2;q<=w/2+.01;q+=step)box(side?x:x+q,y+h/2,side?z+q:z,side?.1:.065,h,side?.065:.1,'metal');for(let yy=y+2.7;yy<y+h;yy+=2.7)box(x,yy,z,side?.1:w,.07,side?w:.1,'metal');}
 function podium(w,d,h=4){box(0,h/2,0,w,h,d,'glass');box(0,.3,0,w+.5,.6,d+.5,'stone');box(0,h,0,w+.6,.38,d+.6,'stone');curtain(0,d/2+.05,w,h);curtain(-w/2-.05,0,d,h,0,true);curtain(w/2+.05,0,d,h,0,true);entrance(0,d/2+.3,Math.min(w*.5,9),h-.3);}
 if(kind==='office'){
  podium(22,18,4.5);const poly=[[-7,-6],[5,-6],[7,-4],[7,4],[4,6],[-7,6]];
  volume(poly,4.7,(x,z)=>36+(z+6)*.24,'glass');volume(poly.map(([x,z])=>[x*1.035,z*1.035]),(x,z)=>36+(z+6)*.24,(x,z)=>36.4+(z+6)*.24,'metal');
  curtain(-.7,6.04,11.5,31,5);curtain(-7.06,0,12,31,5,true);curtain(7.06,0,8,29,5,true);
  for(let x=-6;x<=4;x+=2)box(x,22,6.22,.16,33,.4,'stone');
  box(-8.6,15,-2,3,21,10,'glass');for(let y=7;y<26;y+=2.8)box(-8.6,y,-2,3.3,.12,10.3,'stone');box(-8.6,26,-2,3.6,.3,10.6,'roof');
  box(2,4.9,0,9,.2,8,'green');planter(-6,4.8,7,5);planter(7,4.8,5,3,2);box(-1,40,-1,5,1.4,4,'dark');for(let i=0;i<6;i++)box(-3+i*.8,40.8,-1,.12,.1,4,'metal');
 }else if(kind==='residence'){
  podium(23,20,4);for(let t=0;t<5;t++){const w=21-t*2.4,d=17-t*1.9,x=-t*.65,z=-t*.7,y=4+t*5.4;box(x,y+2.55,z,w,5.1,d,'glass');for(let floor=0;floor<2;floor++){const yy=y+floor*2.7;box(x,yy,z+.7,w+1,.24,d+1.8,'stone');railing(x,yy+.2,z+.7,w+.8,d+1.6);for(let xx=-w/2+.6;xx<w/2;xx+=2.6)box(x+xx,yy+1.35,z+d/2+.08,.18,2.6,.22,'stone');}planter(x+w*.28,y+5.55,z+d/2+.35,Math.max(2,w*.4),1.2);}
  box(-2.6,31.25,-2.8,11.4,.35,9.4,'roof');box(-2.5,31.46,-2.5,5.7,.12,3.6,'water');railing(-2.6,31.45,-2.8,11.2,9.2);for(const x of[-6.5,.5])for(const z of[-6,-1])box(x,32.8,z,.15,2.7,.15,'metal');for(let x=-6.6;x<1;x+=.65)box(x,34.1,-3.5,.16,.16,5.6,'metal');planter(-5.8,31.6,.7,4,1.3);
 }else if(kind==='mall'){
  podium(24,21,4);for(let t=0;t<2;t++){const y=4+t*4.2,w=22-t*3,d=18-t*2;box(0,y+1.9,-d/2+2,w,3.8,4,'glass');for(const s of[-1,1])box(s*(w/2-2.8),y+1.9,0,5.6,3.8,d,'glass');box(0,y+1.9,d/2-1.5,w,3.8,3,'glass');box(0,y+3.9,0,w+.7,.35,d+.7,'roof');curtain(0,d/2+.1,w,3.5,y);for(const s of[-1,1])planter(s*(w/2-2),y+4.15,d/2-1,3,1.2);}
  cyl(0,13.4,-1,6,2.8,4.7,'glass');const dome=mesh(new T.SphereGeometry(1,40,16,0,Math.PI*2,0,Math.PI/2),'glass',0,14.8,-1,6,2.4,4.7);dome.material.side=T.DoubleSide;
  for(let a=0;a<Math.PI*2;a+=Math.PI/8){const pts=[];for(let i=0;i<=12;i++){const q=i/12*Math.PI/2;pts.push([6.08*Math.cos(a)*Math.sin(q),14.8+2.45*Math.cos(q),-1+4.78*Math.sin(a)*Math.sin(q)]);}curve(pts,.055,'metal');}
  for(let i=0;i<6;i++){const x=-11+i*4.4;beam([x,4.4,11],[x,5.8,13],.12,'metal');}curve([[-12,5.7,12],[-6,6.6,13],[0,6.9,13.6],[6,6.6,13],[12,5.7,12]],.25,'roof');for(let x=-10;x<11;x+=3)box(x,2.1,10.65,2.6,2.9,.08,'accent');
 }else if(kind==='cinema'){
  podium(23,21,5);volume([[-11,-9],[1,-9],[1,6],[-11,6]],5,(x,z)=>13+(z+9)*.18,'dark');volume([[0,-10],[10,-10],[10,3],[0,3]],5,(x,z)=>18-x*.32,'accent');volume([[-5,0],[9,0],[9,8],[-5,8]],5,(x,z)=>13.5+x*.13,'metal');
  for(let x=-10.5;x<=0;x+=.75)box(x,9.4,6.1,.13,7.8,.2,'metal');for(let z=-8;z<=2;z+=.85)box(10.1,10.5,z,.2,10,.14,'metal');
  box(1,9.1,8.15,12,5.2,.3,'dark');box(1,9.1,8.34,10.8,4.2,.05,'glass');box(1,11.85,8.25,12.5,.15,.35,'accent');for(let x=-5;x<8;x+=.7)box(x,5.6,11.6,.22,.2,3.6,'metal');entrance(1,10.65,14,4.5);for(let x=-9;x<=9;x+=6)planter(x,.5,12.7,3.5,1.2);
 }else if(kind==='venue'){
  cyl(0,2.8,0,12,5.6,9.5,'glass');for(let a=0;a<Math.PI*2;a+=Math.PI/24)box(12*Math.cos(a),2.9,9.5*Math.sin(a),.1,5.7,.1,'metal');
  for(let j=0;j<3;j++){const positions=[],indices=[],n=32,m=20,angle=(j-1)*.36,xc=(j-1)*5.4,zc=(j===1?-1.6:1.2);const point=(u,v)=>{const w=5.1*(.7+.3*Math.cos(v*Math.PI/2)),xx=u*w,zz=v*9;return[xc+xx*Math.cos(angle)+zz*Math.sin(angle),6.8+6.4*Math.sqrt(Math.max(0,1-u*u))*(.92+.08*Math.cos(v*Math.PI))+j*.55,zc-xx*Math.sin(angle)+zz*Math.cos(angle)];};
   for(let y=0;y<=m;y++)for(let x=0;x<=n;x++)positions.push(...point(x/n*2-1,y/m*2-1));for(let y=0;y<m;y++)for(let x=0;x<n;x++){const a=y*(n+1)+x;indices.push(a,a+1,a+n+2,a,a+n+2,a+n+1);}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();const roof=mesh(geo,'roof');roof.material.side=T.DoubleSide;
   for(let v=-1;v<=1.001;v+=.25){const points=[];for(let i=0;i<=24;i++){const p=point(i/12-1,v);p[1]+=.12;points.push(p);}curve(points,.055,'metal');}for(const u of[-1,1]){const ps=[];for(let i=0;i<=20;i++)ps.push(point(u,i/10-1));curve(ps,.14,'stone');}
  }entrance(0,9.65,10,4.6);for(let i=0;i<5;i++)box(0,.15+i*.16,12.2-i*.45,20-i,.28,4-i*.45,'stone');
 }else if(kind==='landmark'){
  podium(21,19,4.5);const poly=(r)=>Array.from({length:6},(_,i)=>{const a=i/6*Math.PI*2+Math.PI/6,rr=i%2?r*.57:r;return[Math.cos(a)*rr,Math.sin(a)*rr];});let radius=10.5;
  for(const[y,h,ratio]of[[5,20,.8],[25,19,.76],[44,16,.64]]){const next=radius*ratio;volume(poly(radius),y,y+h,'glass',poly(next));const a=poly(radius),b=poly(next);for(let i=0;i<6;i++){beam([a[i][0],y,a[i][1]],[b[i][0],y+h,b[i][1]],.17,'stone');}for(let yy=y+2.5;yy<y+h;yy+=2.5){const r=radius+(next-radius)*(yy-y)/h,pp=poly(r);for(let i=0;i<6;i++)beam([pp[i][0],yy,pp[i][1]],[pp[(i+1)%6][0],yy,pp[(i+1)%6][1]],.045,'metal');}volume(poly(next*1.13),y+h,y+h+.5,'roof');if(y<44){cyl(0,y+h+.65,0,next*.66,.28,next*.66,'green');for(let a=0;a<6;a++)mesh(leaf,'green',Math.cos(a)*next*.65,y+h+1.05,Math.sin(a)*next*.65,.65,.8,.65,0,true);}radius=next;}
  for(let i=0;i<3;i++){const a=i/3*Math.PI*2,x=Math.cos(a)*2,z=Math.sin(a)*2;const top=67+i*2.4;volume([[x-1.6,z-1.5],[x+1.6,z-1.5],[x+1.1,z+1.7],[x-1.1,z+1.7]],60,(xx,zz)=>top+(xx-x)*.8,'metal');beam([x,60,z],[x*.3,top+2,z*.3],.16,'stone');}cyl(0,69,0,.3,15,.3,'metal');cyl(0,76.6,0,.16,1,.16,'accent');
 }
 // Shared primitive geometry is instanced per material, keeping detail economical.
 const buckets=new Map();g.updateMatrixWorld(true);for(const m of simple){const key=m.geometry.uuid+':'+m.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(m);}
 for(const list of buckets.values()){if(list.length<2)continue;const inst=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((m,i)=>{m.updateMatrix();inst.setMatrixAt(i,m.matrix);g.remove(m);});inst.castShadow=inst.receiveShadow=true;inst.computeBoundingSphere();g.add(inst);}
 if(style==='anime'){for(const m of [...g.children])if(m.isMesh&&!m.isInstancedMesh&&m.geometry.attributes.position.count<100){const line=new T.LineSegments(new T.EdgesGeometry(m.geometry,35),new T.LineBasicMaterial({color:'#364865',transparent:true,opacity:.48}));line.position.copy(m.position);line.rotation.copy(m.rotation);line.scale.copy(m.scale);g.add(line);}}
 g.updateMatrixWorld(true);return g;
}

