import * as T from '../vendor/three.module.js';
import{cachedAsset,unitBox}from'./resources.js';

// All content is graphical. One uniform update per frame; no canvas uploads,
// frame atlases, particles, additional lights or animated shadow maps.
export const mediaModes=['aite-broadcast','family-broadcast','xunmei-media','davinci-wings'];
const fragmentShader=`
varying vec2 vUv;
uniform float phase;
uniform float mode;
const float PI=3.14159265359;
float rect(vec2 p,vec2 c,vec2 s){vec2 q=abs(p-c)-s*.5;return 1.-smoothstep(-.003,.003,max(q.x,q.y));}
float ring(vec2 p,float r,float width){return 1.-smoothstep(width,width+.008,abs(length(p)-r));}
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
void main(){
 vec2 p=vUv;float a=phase*2.*PI;vec3 col=vec3(.018,.035,.085);
 if(mode<.5){
  // News ident: a flat globe, moving meridians, radar sweep and a ticker.
  col+=vec3(.015,.06,.09)*(.5+.5*sin(p.x*14.+p.y*8.));
  vec2 q=(p-vec2(.36,.58))*vec2(1.35,1.);float sphere=1.-smoothstep(.29,.30,length(q));
  float grid=pow(.5+.5*cos(q.y*52.),25.)+pow(.5+.5*cos((q.x+.06*sin(a))*48.),28.);
  col=mix(col,vec3(.035,.2,.32),sphere);col+=vec3(.09,.7,.87)*min(1.,grid)*sphere*.65;
  col+=vec3(.3,1.,1.1)*ring(q,.3,.007);
  float beam=pow(max(0.,cos(atan(q.y,q.x)-a)),20.)*sphere;
  col+=beam*vec3(.08,.6,.75);
  for(int i=0;i<4;i++){float y=.72-float(i)*.1;col+=rect(p,vec2(.77,y),vec2(.29-float(i)*.035,.025))*vec3(.65,.85,.9);}
  col=mix(col,vec3(.025,.18,.27),rect(p,vec2(.5,.12),vec2(1.,.16)));
  col+=rect(vec2(fract(p.x+phase),p.y),vec2(.37,.12),vec2(.31,.025))*vec3(.65,1.,1.05);
  col+=rect(p,vec2(.85,.91),vec2(.22,.055))*vec3(.95,.25,.22);
 }else if(mode<1.5){
  // Variety ident: a colourful pixel heart, confetti and dancing bars.
  col=vec3(.13,.025,.22)+vec3(.1,.025,.12)*sin(p.x*7.+p.y*4.+a);
  vec2 q=(floor(p*vec2(30.,18.))+.5)/vec2(30.,18.);vec2 h=(q-vec2(.5,.58))*vec2(2.3,2.5);
  h.y-=.045*sin(a);float base=h.x*h.x+h.y*h.y-.28;float heart=base*base*base-h.x*h.x*h.y*h.y*h.y;
  float mask=1.-smoothstep(-.003,.006,heart);
  col=mix(col,vec3(1.15,.25+.12*sin(a),.48),mask);
  for(int i=0;i<8;i++){float n=float(i);float x=.06+n*.125,y=fract(.12+n*.17+phase);col+=rect(p,vec2(x,y),vec2(.025,.055))*mix(vec3(.15,.8,1.),vec3(1.,.8,.22),mod(n,2.));
   float bar=.055+.1*(.5+.5*sin(a+n));col+=rect(p,vec2(x,bar*.5),vec2(.065,bar))*vec3(.5,.75,1.);}
 }else if(mode<2.5){
  // Vertical campaign loop: shopping icon / gem / target, cyan-magenta scan.
  col=vec3(.03,.035,.14);float band=pow(.5+.5*cos((p.y-phase)*2.*PI),12.);
  col+=vec3(.08,.45,.6)*band;vec2 q=(p-vec2(.5,.58))*vec2(1.45,.8);
  float scene=floor(phase*3.);float icon=0.;
  if(scene<.5){icon=rect(q,vec2(0.,-.045),vec2(.48,.24));icon=max(icon,ring((q-vec2(0.,.08))*vec2(1.,1.3),.12,.02)*step(.08,q.y));}
  else if(scene<1.5){vec2 r=rot(PI*.25)*q;icon=1.-smoothstep(.16,.18,max(abs(r.x),abs(r.y)));}
  else{icon=ring(q,.22,.018)+ring(q,.12,.018);}
  col=mix(col,vec3(1.,.22,.65),clamp(icon,0.,1.));
  for(int i=0;i<5;i++){float y=.11+float(i)*.045;col+=rect(p,vec2(.5,y),vec2(.65-float(i)*.06,.012))*vec3(.25,.85,1.);}
  col+=rect(p,vec2(.08,fract(phase+.2)),vec2(.018,.24))*vec3(.3,1.,1.2);
 }else{
  // Design studio: rotating folded geometry and a warm travelling light band.
  col=vec3(.055,.035,.14);vec2 q=(p-vec2(.5,.55))*vec2(1.55,1.);
  vec2 r=rot(a)*q;float diamond=1.-smoothstep(.20,.22,abs(r.x)+abs(r.y));
  vec2 s=rot(-a*.5)*q;float inner=1.-smoothstep(.085,.095,max(abs(s.x),abs(s.y)));
  col=mix(col,vec3(1.1,.63,.18),diamond);col=mix(col,vec3(.26,.76,.9),inner);
  col+=ring(q,.31,.006)*vec3(.9,.7,.5);
  col+=rect(p,vec2(fract(phase),.11),vec2(.28,.025))*vec3(1.1,.8,.35);
  col+=rect(p,vec2(.14,.84),vec2(.13,.018))*vec3(.7,.65,.85);
 }
 // LED pixel lattice remains subtle enough to read from the city camera.
 col*=.9+.1*step(.08,fract(p.x*80.))*step(.08,fract(p.y*48.));
 gl_FragColor=vec4(col,1.);
 #include <colorspace_fragment>
}`;

export function createMediaEffect(building,designKey,screens,strips){
 const index=mediaModes.indexOf(designKey);if(index<0)throw Error('Unknown media design');
 const motion=new T.Group();motion.name='media-motion';building.add(motion);
 const screenMaterial=new T.ShaderMaterial({uniforms:{phase:{value:0},mode:{value:index}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader,toneMapped:false,side:T.DoubleSide});
 screenMaterial.userData.liveMotion=true;
 const plane=cachedAsset('geometry','media-screen',()=>new T.PlaneGeometry(1,1));
 for(const s of screens){const mesh=new T.Mesh(s.geometry||plane,screenMaterial);if(!s.geometry){mesh.position.set(s.x,s.y,s.z);mesh.scale.set(s.w,s.h,1);mesh.rotation.y=s.angle||0;}mesh.name='media-screen';mesh.userData.mediaScreen=true;motion.add(mesh);}
 const baseColors=index===0?['#58d6ed','#77b9ff']:index===1?['#ff83b6','#ffd17b']:index===2?['#5bdfdb','#f18cce']:['#edc17b','#a3a4e5'];
 const lamps=baseColors.map(c=>{const mat=new T.MeshBasicMaterial({color:c,toneMapped:false});mat.userData.liveMotion=true;return{mat,color:new T.Color(c)};});
 for(let j=0;j<lamps.length;j++){const positions=strips.filter((s,i)=>i%2===j);if(!positions.length)continue;const mesh=new T.InstancedMesh(unitBox,lamps[j].mat,positions.length),obj=new T.Object3D();positions.forEach((s,i)=>{obj.position.set(s.x,s.y,s.z);obj.rotation.set(0,0,s.angle||0);obj.scale.set(s.w,s.h,s.d||.13);obj.updateMatrix();mesh.setMatrixAt(i,obj.matrix);});mesh.computeBoundingSphere();mesh.userData.noHit=true;motion.add(mesh);}
 const effect={kind:'media',designKey,building,motion,frames:48,duration:[8,6,9,8][index],screenMaterial,setFrame(frame,count=48){const phase=((frame%count)+count)%count/count;screenMaterial.uniforms.phase.value=phase;lamps.forEach(({mat,color},i)=>{const wave=.5+.5*Math.sin(phase*Math.PI*2*(index===0?2:index===2?3:1)+i*(index===3?Math.PI:1.7));mat.color.copy(color).multiplyScalar(1.1+.85*wave);});}};
 effect.setFrame(0);return effect;
}
