import * as T from '../vendor/three.module.js';
import {createTraining,createFeida,createCinema,setBuildingFrame} from './approved-architecture.js';
import {applyArchitecturalReflections} from './architectural-reflections.js';
export function approvedEntertainment(profile,width,depth,kind){
 const raw=({training:createTraining,feida:createFeida,cinema:createCinema})[kind]();
 const g=new T.Group(),rotated=width>depth,fit=.999999*Math.min(width/(rotated?58:26),depth/(rotated?26:58));
 raw.scale.setScalar(fit);if(rotated)raw.rotation.y=-Math.PI/2;g.add(raw);
 const parts=raw.userData.parts,motion=new T.Group();motion.name='authored-architectural-motion';
 const moving=kind==='training'?parts.lamps:kind==='feida'?[parts.reel,parts.hinge]:[parts.star,...parts.bulbs];
 for(const part of moving){motion.add(part);part.traverse(o=>{if(o.isMesh)o.castShadow=false;});}raw.add(motion);
 if(kind==='training')for(const p of parts.lamps)p.name='swinging-spotlight';
 if(kind==='feida')parts.hinge.name='opening-clapperboard-hinge';
 if(kind==='cinema'){parts.star.name='rotating-star-film-sign';parts.star.children.find(o=>o.name==='rotating-gold-film-star').name='rotating-star-marquee';raw.getObjectByName('fully-connected-cinema-podium').name='premiere-connected-auditorium';raw.getObjectByName('joined-swept-fan-blade').name='fan-shaped-glass-tower';}
 const effect={kind,building:g,motion,frames:48,duration:6,setFrame(frame,count=48){setBuildingFrame(raw,frame/count*48);}};
 effect.setFrame(0);g.userData={purposeKind:kind==='feida'?'studio':kind,designKey:profile.designKey,hero:true,heroEffect:effect,singleStructure:true,authoredSite:true,approvedArchitecture:true,connectedWidth:width,architectureRaw:raw,siteRotation:raw.rotation.y,siteFit:fit};
 applyArchitecturalReflections(g);return g;
}
