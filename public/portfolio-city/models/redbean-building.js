import * as T from '../vendor/three.module.js';
import {createRedbean,setBuildingFrame} from './redbean-architecture.js';
import {applyArchitecturalReflections} from './architectural-reflections.js';
export function redbeanBuilding(profile,width,depth){
 const raw=createRedbean(),g=new T.Group(),fit=.999999*Math.min(width/24,depth/24);raw.scale.setScalar(fit);g.add(raw);
 const p=raw.userData.parts,motion=new T.Group();motion.name='redbean-authored-motion';
 for(const part of [p.reel,...p.lamps]){motion.add(part);part.traverse(o=>{if(o.isMesh)o.castShadow=false;});}raw.add(motion);
 const effect={kind:'redbean',building:g,motion,frames:48,duration:6,setFrame(frame,count=48){setBuildingFrame(raw,frame/count*48);}};effect.setFrame(0);
 g.userData={purposeKind:'studio',designKey:profile.designKey,hero:true,heroEffect:effect,singleStructure:true,authoredSite:true,approvedArchitecture:true,architectureRaw:raw,siteFit:fit,storeys:6};
 applyArchitecturalReflections(g);return g;
}
