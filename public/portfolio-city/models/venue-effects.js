import * as T from'../vendor/three.module.js';
export function venueLighting(building){
 const motion=new T.Group(),lamps=[];motion.name='concert-roof-lighting';building.add(motion);
 const strip=(points,radius=.15)=>{const material=new T.MeshBasicMaterial({color:'#66e8fa',toneMapped:false});material.userData.liveMotion=true;const o=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),40,radius,5,false),material);o.name='concert-color-light-strip';o.castShadow=false;motion.add(o);lamps.push(material);};
 for(let j=0;j<3;j++){
  const angle=(j-1)*.36,xc=(j-1)*5.4,zc=j===1?-1.6:1.2;
  const point=(u,v)=>{const w=5.1*(.7+.3*Math.cos(v*Math.PI/2)),xx=u*w,zz=v*9;return[xc+xx*Math.cos(angle)+zz*Math.sin(angle),6.96+6.4*Math.sqrt(Math.max(0,1-u*u))*(.92+.08*Math.cos(v*Math.PI))+j*.55,zc-xx*Math.sin(angle)+zz*Math.cos(angle)];};
  for(const u of[-1,0,1])strip(Array.from({length:25},(_,i)=>point(u,i/12-1)),u===0?.12:.17);
 }
 for(const y of[1.15,5.35])strip(Array.from({length:65},(_,i)=>{const a=i/64*Math.PI*2;return[12.15*Math.cos(a),y,9.65*Math.sin(a)];}),.13);
 const effect={kind:'venue',building,motion,frames:48,duration:10,setFrame(frame,count=48){const phase=((frame%count)+count)%count/count;lamps.forEach((m,i)=>m.color.setHSL((.53+phase+i*.053)%1,.76,.48+.12*Math.sin((phase+i*.08)*Math.PI*2)));}};
 effect.setFrame(0);return effect;
}
