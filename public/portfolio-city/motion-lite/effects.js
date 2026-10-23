import * as T from '../vendor/three.module.js';import{attachSign}from'../motion/sign.js';
export function createEffects(city){
 const cinema=city.newGroups.find(g=>g.userData.sampleKind==='cinema'),sign=attachSign(cinema);sign.pivot.traverse(o=>o.castShadow=false);
 const entries=[{id:'MotionCinema',kind:'cinema',building:cinema,motion:sign.pivot,frames:48,duration:6,moves:true,setFrame:(f,n=48)=>sign.setFrame(f,n)}];
 const mall=city.newGroups.find(g=>g.userData.sampleKind==='mall'),strip=new T.Group(),lights=[];mall.add(strip);
 for(let i=0;i<16;i++){const x=-11.2+i*1.5,y=5.8+.95*(1-(x/12)**2),z=12.2+1.1*(1-(x/12)**2),m=new T.Mesh(new T.BoxGeometry(1.28,.3,.38),new T.MeshBasicMaterial({color:'#6df4ff',toneMapped:false}));m.position.set(x,y,z);strip.add(m);lights.push(m.material);}
 entries.push({id:'MotionMall',kind:'mall',building:mall,motion:strip,frames:12,duration:1.5,moves:false,setFrame(f,n=12){for(let i=0;i<lights.length;i++){const wave=(Math.cos((i/lights.length-f/n)*Math.PI*2)+1)/2;lights[i].color.set(i%4===0?'#ffc7ed':'#63f4ff').multiplyScalar(.12+.88*wave**4);}}});
 const landmark=city.newGroups.find(g=>g.userData.sampleKind==='landmark'),crown=new T.Group(),crownMaterials=[];landmark.add(crown);
 for(let j=0;j<3;j++){const a=j/3*Math.PI*2,x=Math.cos(a)*2,z=Math.sin(a)*2,pts=[new T.Vector3(x,60.8,z),new T.Vector3(x,66.8+j*2.4,z),new T.Vector3(x*.3,69+j*2.4,z*.3)],m=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),20,.16,6,false),new T.MeshBasicMaterial({color:j===1?'#ff9eda':'#6af1ff',toneMapped:false}));crown.add(m);crownMaterials.push(m.material);}
 const ring=new T.Mesh(new T.TorusGeometry(3.05,.12,6,48),new T.MeshBasicMaterial({color:'#98edff',toneMapped:false}));ring.rotation.x=Math.PI/2;ring.position.y=60.8;crown.add(ring);crownMaterials.push(ring.material);
 entries.push({id:'MotionLandmark',kind:'landmark',building:landmark,motion:crown,frames:24,duration:3,moves:false,setFrame(f,n=24){crownMaterials.forEach((m,i)=>{const pulse=(Math.sin(f/n*Math.PI*2-i*.9)+1)/2;m.color.set(i===1?'#ff9eda':'#6af1ff').multiplyScalar(.12+.88*pulse);});}});
 for(const e of entries){e.motion.traverse(o=>o.castShadow=false);e.setFrame(0);}
 return entries;
}
