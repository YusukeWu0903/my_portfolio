import * as T from'../vendor/three.module.js';import{kit}from'./architecture.js';
export function foundationChurch(profile,width,depth,style,mix){
 const k=kit(mix,5,{style,tier:'high',purpose:'foundation',palette:profile}),{box,tree}=k,w=width*.7,d=depth*.79,wall=10.2,peak=15.5;
 // Stone courses use a texture so the distant map stays light on geometry.
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#a69f91';ctx.fillRect(0,0,256,256);const stones=[.15,.3,.05,.4,.22].map(t=>'#'+new T.Color(profile.wallHex).lerp(new T.Color('#827e78'),t).getHexString());for(let row=0;row<10;row++)for(let col=-1;col<7;col++){const x=col*43+(row%2)*21,y=row*26;ctx.fillStyle=stones[(row*7+col+10)%stones.length];ctx.fillRect(x+1,y+1,40,23);}const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;k.m.stone.map=texture;k.m.stone.color.set('#ffffff');k.m.roof.color.set('#71818b');k.m.metal.color.set('#526c60');k.m.glass.color.set('#71978a');
 box(0,.35,0,w+2,.7,d+2,'cream');box(0,wall/2+.7,0,w,wall,d,'stone');
 const triangle=(z,reverse=false)=>{const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([-w/2,wall+.7,z,w/2,wall+.7,z,0,peak+.7,z],3));geo.setIndex(reverse?[2,1,0]:[0,1,2]);geo.computeVertexNormals();const m=new T.Mesh(geo,k.m.stone);m.material.side=T.DoubleSide;k.g.add(m);};triangle(d/2);triangle(-d/2,true);
 const rise=peak-wall,half=w/2+.55,slope=Math.hypot(half,rise),angle=Math.atan2(rise,half);for(const s of[-1,1]){const roof=box(s*half/2,wall+.7+rise/2,0,slope,.35,d+1.35,'roof');roof.rotation.z=-s*angle;for(let z=-d*.44;z<=d*.45;z+=1.4){const seam=box(s*half/2,wall+.9+rise/2,z,slope,.06,.08,'metal');seam.rotation.z=-s*angle;}}
 const arch=(x,y,z,ww,hh,material,ry=0)=>{const r=ww/2,shape=new T.Shape();shape.moveTo(-r,0);shape.lineTo(-r,hh-r);shape.absarc(0,hh-r,r,Math.PI,0,true);shape.lineTo(r,0);shape.closePath();const m=new T.Mesh(new T.ShapeGeometry(shape,24),material);m.position.set(x,y,z);m.rotation.y=ry;k.g.add(m);return m;};
 arch(0,.7,d/2+.12,4.8,7.4,k.m.metal);arch(0,.9,d/2+.18,4.15,6.9,k.m.glass);box(0,3.6,d/2+.28,.16,5.5,.14,'metal');box(0,5.3,d/2+.28,4.2,.16,.14,'metal');
 for(const s of[-1,1]){arch(s*w*.31,2.2,d/2+.1,2.3,7.2,k.m.metal);arch(s*w*.31,2.4,d/2+.17,1.95,6.75,k.m.glass);box(s*w*.31,6.2,d/2+.24,.1,7.5,.12,'metal');}
 for(const x of[-1.5,1.5]){box(x,11.8,d/2+.1,1.15,4.2,.18,'metal');box(x,11.8,d/2+.22,.9,3.85,.1,'glass');}
 for(const s of[-1,1])for(const z of[-d*.33,0,d*.31]){box(s*(w/2+.08),5.5,z,.15,6.5,3.8,'metal');box(s*(w/2+.16),5.5,z,.12,6.1,3.4,'glass');box(s*(w/2+.24),5.5,z,.1,.14,3.5,'metal');}
 // A square belfry, pyramidal roof and cross match the authored scene background.
 const tz=-d*.08;box(0,18.5,tz,4.5,7,4.5,'stone');for(const s of[-1,1]){arch(0,18.3,tz+s*2.29,2.1,3.3,k.m.dark,s<0?Math.PI:0);arch(s*2.29,18.3,tz,2.1,3.3,k.m.dark,s*Math.PI/2);}box(0,22.2,tz,4.9,.35,4.9,'cream');const cap=new T.Mesh(new T.ConeGeometry(3.65,3.8,4),k.m.stone);cap.rotation.y=Math.PI/4;cap.position.set(0,24.2,tz);k.g.add(cap);cap.castShadow=true;box(0,28,tz,.35,5,.35,'metal');box(0,28.7,tz,2.8,.35,.35,'metal');
 for(const s of[-1,1]){box(s*w*.35,1,d*.54,w*.24,.6,1.4,'cream');box(s*w*.35,1.5,d*.54,w*.22,.4,1.2,'green');tree(s*(w/2+1.5),-d*.25);}
 box(0,.5,d*.57,5,.2,2,'cream');box(0,.3,d*.65,6,.2,1.1,'cream');const g=k.finish();g.userData.purposeKind='foundation';g.userData.designKey=profile.designKey;g.userData.church=true;return g;
}

