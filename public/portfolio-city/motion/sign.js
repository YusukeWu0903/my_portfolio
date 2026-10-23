import * as T from '../vendor/three.module.js';
export function attachSign(building){
 const stand=new T.Group();building.add(stand);const dark=new T.MeshToonMaterial({color:'#304778'}),metal=new T.MeshToonMaterial({color:'#ffe2a2'}),cyan=new T.MeshStandardMaterial({color:'#6fe6f3',emissive:'#2adfff',emissiveIntensity:2.3,roughness:.35}),pink=new T.MeshStandardMaterial({color:'#ffbedc',emissive:'#ff3f9d',emissiveIntensity:2,roughness:.4});
 const emissive=[cyan,pink];function box(parent,x,y,z,w,h,d,mat){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 for(const x of[3,7]){const base=18-x*.32;box(stand,x,(base+24)/2,-4,.35,24-base,.4,metal);}box(stand,5,23.6,-4,6,.35,2,metal);
 const pivot=new T.Group();pivot.position.set(5,27.5,-4);stand.add(pivot);box(pivot,0,0,0,14,7.5,.7,dark);
 for(const z of[-.48,.48]){box(pivot,0,3.65,z,14.35,.18,.18,cyan);box(pivot,0,-3.65,z,14.35,.18,.18,cyan);for(const x of[-7,7])box(pivot,x,0,z,.18,7.5,.18,cyan);
  const ring=new T.Mesh(new T.TorusGeometry(2.5,.15,8,48),pink);ring.position.set(-1.4,0,z*1.14);pivot.add(ring);const disc=new T.Mesh(new T.CircleGeometry(2.24,40),metal);disc.material.side=T.DoubleSide;disc.position.set(-1.4,0,z*1.12);pivot.add(disc);for(let i=0;i<5;i++){const a=i/5*Math.PI*2,hole=new T.Mesh(new T.CircleGeometry(.49,16),dark);hole.material.side=T.DoubleSide;hole.position.set(-1.4+Math.cos(a)*1.28,Math.sin(a)*1.28,z*1.2);pivot.add(hole);}for(let k=0;k<3;k++){const bar=box(pivot,3.7,k*1.4-1.4,z*1.12,3.2,.22,.12,k%2?cyan:pink);}
  const c=document.createElement('canvas');c.width=256;c.height=128;const ctx=c.getContext('2d'),grad=ctx.createRadialGradient(128,64,10,128,64,125);grad.addColorStop(0,'rgba(80,220,255,.2)');grad.addColorStop(1,'rgba(80,220,255,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,256,128);const tex=new T.CanvasTexture(c),glow=new T.Mesh(new T.PlaneGeometry(18,10),new T.MeshBasicMaterial({map:tex,transparent:true,opacity:.45,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending}));glow.position.z=z*1.3;glow.userData.noHit=true;pivot.add(glow);
 }
 const yaw=Math.atan2(142,186);return{stand,pivot,setFrame(index,count){pivot.rotation.y=yaw+index/count*Math.PI*2;emissive.forEach((m,i)=>m.emissiveIntensity=1.7+.65*Math.sin(index/count*Math.PI*4+i));building.updateMatrixWorld(true);}};
}
