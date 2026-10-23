import * as T from '../vendor/three.module.js';
export function musicEffect(building,theme,parts){
 const motion=new T.Group();motion.name='music-motion';building.add(motion);
 // Rotating details cast no animated ground shadows. Their supports stay static.
 const {record,arm,stars,bars}=parts,obj=new T.Object3D();
 if(record)record.userData.liveMotion=true;if(arm)arm.userData.liveMotion=true;
 const effect={kind:'music',theme,building,motion,frames:48,duration:theme==='records'?8:6,parts,setFrame(frame,count=48){const f=((frame%count)+count)%count/count,a=f*Math.PI*2;
  if(record){record.rotation.y=a;arm.rotation.y=.035*Math.sin(a*2);arm.position.y=1+.025*Math.sin(a*4);}
  if(stars){stars.userData.positions.forEach((p,i)=>{obj.position.set(...p);const scale=.45+.75*(.5+.5*Math.sin(a+i*1.7));obj.scale.setScalar(scale);obj.rotation.set(0,a*.5,Math.PI/8);obj.updateMatrix();stars.setMatrixAt(i,obj.matrix);});stars.instanceMatrix.needsUpdate=true;stars.frustumCulled=false;}
  if(bars){bars.userData.positions.forEach((p,i)=>{const h=1.1+3.2*(.5+.5*Math.sin(a*2+i*.85));obj.position.set(p[0],p[1]+h/2,p[2]);obj.rotation.set(0,0,0);obj.scale.set(.32,h,.18);obj.updateMatrix();bars.setMatrixAt(i,obj.matrix);});bars.instanceMatrix.needsUpdate=true;bars.frustumCulled=false;}
 }};effect.setFrame(0);return effect;
}
