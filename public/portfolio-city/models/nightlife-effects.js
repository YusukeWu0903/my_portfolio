import * as T from '../vendor/three.module.js';
import{cachedAsset,unitBox}from'./resources.js';

const fragment=`
varying vec2 vUv;uniform float phase;uniform float mode;uniform float strip;
const float PI=3.14159265359;
float box(vec2 p,vec2 c,vec2 s){vec2 q=abs(p-c)-s*.5;return 1.-smoothstep(-.004,.004,max(q.x,q.y));}
float line(vec2 p,vec2 a,vec2 b,float w){vec2 d=b-a;return 1.-smoothstep(w,w+.008,length(p-a-d*clamp(dot(p-a,d)/dot(d,d),0.,1.)));}
void main(){vec2 p=vUv;float a=phase*2.*PI;vec3 c;
 if(strip>.5){float flow=pow(.5+.5*cos((p.x-phase*2.)*2.*PI),5.);c=mode<.5?mix(vec3(.5,.13,.32),vec3(1.5,.62,.3),flow):mix(vec3(.16,.08,.55),vec3(.1,1.2,1.7),flow);}
 else if(mode<.5){
  c=vec3(.09,.018,.08);vec2 q=p;q.y-=.025*sin(a);
  float note=1.-smoothstep(.09,.105,length((q-vec2(.37,.39))*vec2(.9,1.35)));
  note=max(note,line(q,vec2(.46,.4),vec2(.46,.78),.023));note=max(note,line(q,vec2(.46,.78),vec2(.68,.68),.026));
  c+=note*vec3(1.5,.65,.3);
  for(int i=0;i<7;i++){float n=float(i),h=.025+.13*(.5+.5*sin(a+n*.75));c+=box(p,vec2(.12+n*.125,.06+h*.5),vec2(.065,h))*mix(vec3(1.4,.26,.7),vec3(.2,1.1,1.2),mod(n,2.));}
  float sparkle=pow(max(0.,cos(a+length(p-vec2(.7,.7))*25.)),12.);c+=box(p,vec2(.81,.82),vec2(.02,.12))*vec3(1.2,.5,.8)*sparkle;
 }else{
  c=vec3(.018,.025,.075);float beat=.5+.5*sin(a*4.);vec2 q=(p-vec2(.5,.62))*vec2(1.3,1.);
  float r=length(q),circle=1.-smoothstep(.009,.02,abs(r-(.19+.035*beat)));
  c+=circle*vec3(.25,.3,1.6);float spoke=pow(max(0.,cos(atan(q.y,q.x)-a)),16.)*(1.-smoothstep(.16,.22,r));c+=spoke*vec3(.08,1.1,1.5);
  for(int i=0;i<12;i++){float n=float(i),h=.05+.23*(.5+.5*sin(a*2.+n*.9));c+=box(p,vec2(.045+n*.083,.08+h*.5),vec2(.047,h))*mix(vec3(.08,1.,1.4),vec3(.65,.18,1.6),mod(n,3.)*.5);}
  c+=line(p,vec2(.06,.91),vec2(.3,.91),.009)*vec3(.1,.8,1.4)*(1.+beat*.4);
 }
 gl_FragColor=vec4(c,1.);
 #include <colorspace_fragment>
}`;

export function nightlifeEffect(building,kind,screens,strips,lamps=[]){
 const mode=kind==='ktv'?0:1,motion=new T.Group();motion.name='nightlife-motion';building.add(motion);
 const material=strip=>{const m=new T.ShaderMaterial({uniforms:{phase:{value:0},mode:{value:mode},strip:{value:strip}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;vec4 p=vec4(position,1.);
#ifdef USE_INSTANCING
p=instanceMatrix*p;
#endif
gl_Position=projectionMatrix*modelViewMatrix*p;}`,fragmentShader:fragment,toneMapped:false,side:T.DoubleSide});m.userData.liveMotion=true;return m;};
 const screenMaterial=material(0),stripMaterial=material(1),plane=cachedAsset('geometry','nightlife-screen',()=>new T.PlaneGeometry(1,1));
 for(const s of screens){const mesh=new T.Mesh(plane,screenMaterial);mesh.position.set(s.x,s.y,s.z);mesh.rotation.set(s.rx||0,s.ry||0,s.rz||0);mesh.scale.set(s.w,s.h,1);mesh.name='nightlife-screen';mesh.userData.nightlifeScreen=true;motion.add(mesh);}
 if(strips.length){const mesh=new T.InstancedMesh(unitBox,stripMaterial,strips.length),obj=new T.Object3D();strips.forEach((s,i)=>{obj.position.set(s.x,s.y,s.z);obj.rotation.set(s.rx||0,s.ry||0,s.rz||0);obj.scale.set(s.w,s.h,s.d||.12);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.computeBoundingSphere();mesh.userData.noHit=true;motion.add(mesh);}
 const colors=lamps.map(({m})=>{m.userData.liveMotion=true;return m.color.clone();});
 const effect={kind:'nightlife',venueKind:kind,building,motion,frames:48,duration:kind==='ktv'?6:4.8,screenMaterial,stripMaterial,setFrame(frame,count=48){const phase=((frame%count)+count)%count/count;screenMaterial.uniforms.phase.value=stripMaterial.uniforms.phase.value=phase;lamps.forEach(({m,index=0},i)=>{const wave=.5+.5*Math.sin(phase*Math.PI*2*(mode?4:1)-index*.9);m.color.copy(colors[i]).multiplyScalar(.85+wave*.65);if(m.emissive)m.emissiveIntensity=.3+wave*.9;});}};
 effect.setFrame(0);return effect;
}
