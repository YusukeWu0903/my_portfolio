import * as T from '../vendor/three.module.js';
// Cached assets belong to the renderer session, not to an individual parcel.
const stores=new Map();
export function cachedAsset(bucket,key,create,limit=768){let store=stores.get(bucket);if(!store)stores.set(bucket,store=new Map());if(store.has(key))return store.get(key);const value=create();if(store.size<limit){value.userData??={};value.userData.shared=true;store.set(key,value);}return value;}
export const unitBox=cachedAsset('geometry','box',()=>new T.BoxGeometry(1,1,1));
export function unitCylinder(segments){return cachedAsset('geometry','cylinder:'+segments,()=>new T.CylinderGeometry(.5,.5,1,segments));}
export const toonRamp=cachedAsset('texture','ramp',()=>{const t=new T.DataTexture(new Uint8Array([100,155,213,255]),4,1,T.RedFormat);t.minFilter=t.magFilter=T.NearestFilter;t.needsUpdate=true;return t;});
export function releaseResources(root,extra=[]){const geometries=new Set(),materials=new Set(extra),textures=new Set();root?.traverse(o=>{if(o.isInstancedMesh)o.dispose();o.shadow?.dispose();if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m)materials.add(m);});for(const m of materials)for(const k of ['map','emissiveMap','gradientMap'])if(m[k])textures.add(m[k]);for(const t of textures)if(!t.userData?.shared)t.dispose();for(const m of materials)if(!m.userData?.shared)m.dispose();for(const g of geometries)if(!g.userData?.shared)g.dispose();}
export function resourceStats(){return Object.fromEntries([...stores].map(([k,v])=>[k,v.size]));}
