import * as T from '../vendor/three.module.js';
import {createWellness,createBoutique,createRestaurant,setBuildingFrame} from './elegant-architecture.js';
import {applyArchitecturalReflections} from './architectural-reflections.js';
export function elegantBuilding(profile,width,depth){
 const kind=profile.kind,raw=({wellness:createWellness,boutique:createBoutique,restaurant:createRestaurant})[kind](),g=new T.Group(),fit=.999999*Math.min(width/24,depth/24);
 raw.scale.setScalar(fit);g.add(raw);
 const p=raw.userData.parts,motion=new T.Group();motion.name='elegant-architectural-motion';
 const moving=kind==='wellness'?[...p.lamps,p.fairy.root]:kind==='boutique'?[...p.lamps,p.jewel]:[...p.lamps,p.group];
 for(const o of moving){motion.add(o);o.traverse(c=>{if(c.isMesh)c.castShadow=false;});}raw.add(motion);
 const effect={kind,building:g,motion,frames:48,duration:6,setFrame(frame,count=48){setBuildingFrame(raw,frame/count*48);}};effect.setFrame(0);
 g.userData={purposeKind:kind,designKey:profile.designKey,hero:true,singleStructure:true,authoredSite:true,approvedArchitecture:true,architectureRaw:raw,siteFit:fit};
 g.userData[kind==='restaurant'?'pianoEffect':'heroEffect']=effect;
 applyArchitecturalReflections(g);return g;
}
