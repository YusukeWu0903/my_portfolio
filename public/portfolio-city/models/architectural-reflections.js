import * as T from '../vendor/three.module.js';
import {cachedAsset} from './resources.js';
// CPU-backed cube faces can be shared by the editor and thumbnail renderers.
// Each renderer owns its internally generated PMREM, so no render-target texture
// is accidentally passed from one WebGL context to another.
function environment(){
 if(typeof document==='undefined')return null;
 return cachedAsset('texture','approved-architecture-reflections-v1',()=>{
  const faces=[];for(let i=0;i<6;i++){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#dceaf3');gr.addColorStop(.47,'#a7c7dc');gr.addColorStop(.5,'#738f9e');gr.addColorStop(1,'#34424d');x.fillStyle=gr;x.fillRect(0,0,256,256);if(i!==3){x.fillStyle=i%2?'#e8f2f6':'#ffffff';x.fillRect(34+i*7,16,30,112);x.fillStyle='#c5dfed';x.fillRect(165,6,15,137);}faces.push(c);}
  const tex=new T.CubeTexture(faces);tex.colorSpace=T.SRGBColorSpace;tex.needsUpdate=true;return tex;
 });
}
export function applyArchitecturalReflections(root){const tex=environment();if(!tex)return;root.traverse(o=>{for(const m of Array.isArray(o.material)?o.material:[o.material])if(m?.userData.approvedArchitecture&&m.envMap!==tex){m.envMap=tex;m.needsUpdate=true;}});}
