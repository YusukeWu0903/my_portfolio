import * as T from '../vendor/three.module.js';
import {tieredLandmark} from './landmark-sections.js';
import {kit} from './architecture.js';
import {cachedAsset,unitBox} from './resources.js';
import {upgradeSkylineMaterials} from './skyline-materials.js';
function outline(w,d,r){const pts=[];for(const [cx,cz,start] of [[w/2-r,d/2-r,0],[-w/2+r,d/2-r,90],[-w/2+r,-d/2+r,180],[w/2-r,-d/2+r,270]])for(let j=0;j<=4;j++){const a=(start+j*90/4)*Math.PI/180;pts.push([cx+Math.cos(a)*r,cz+Math.sin(a)*r]);}return pts;}
// One connected, UV-mapped envelope. Floor lines stay horizontal on sloping roofs.
function envelope(key,rings,height){return cachedAsset('geometry','premium-envelope:'+key,()=>{const p=[],uv=[],idx=[],n=rings[0].length,dist=[0];for(let i=0;i<n;i++){const a=rings[0][i],b=rings[0][(i+1)%n];dist.push(dist.at(-1)+Math.hypot(a[0]-b[0],a[2]-b[2]));}for(let l=0;l<rings.length;l++)for(let i=0;i<=n;i++){const v=rings[l][i%n];p.push(...v);uv.push(dist[i]/dist.at(-1),v[1]/height);}for(let l=0;l<rings.length-1;l++)for(let i=0;i<n;i++){const a=l*(n+1)+i,b=a+n+1;idx.push(a,b,a+1,a+1,b,b+1);}const sideCount=idx.length;for(const [ring,top]of[[0,false],[rings.length-1,true]]){const start=ring*(n+1);for(let i=1;i<n-1;i++)idx.push(...(top?[start,start+i+1,start+i]:[start,start+i,start+i+1]));}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.addGroup(0,sideCount,0);g.addGroup(sideCount,(n-2)*3,2);g.addGroup(sideCount+(n-2)*3,(n-2)*3,1);g.computeVertexNormals();if(key.startsWith("landmark")){const flat=g.toNonIndexed();flat.computeVertexNormals();g.dispose();return flat;}return g;});}
export function premiumVariant(kind,width=24,depth=24,style='anime',mix=.5,edition=1){
 if(kind==='landmark'&&edition===2)return tieredLandmark(width,depth,style,mix);
 if(!['office','landmark'].includes(kind))throw Error('Unknown premium variant');
 const k=kit(mix,kind==='office'?820:821,{tier:'mid',style,palette:{wallHex:'#7aaebc',glassHex:'#5789a0',accentHex:'#d0bd8b'}}),{box}=k,w=Math.min(width-3,22),d=Math.min(depth-3,21),isOffice=kind==='office',h=isOffice?48:88;
 box(0,1,0,w,2,d,'dark');box(0,2.5,0,w*.94,1,d*.94,'stone');
 const shape=isOffice?outline(w*.78,d*.78,Math.min(w,d)*.15):[[w*.28,d*.4],[-w*.28,d*.4],[-w*.43,d*.23],[-w*.43,-d*.23],[-w*.28,-d*.4],[w*.28,-d*.4],[w*.43,-d*.23],[w*.43,d*.23]];
 const rings=isOffice?[shape.map(([x,z])=>[x,3,z]),shape.map(([x,z])=>[x,h+4*x/w,z])]:[[3,1],[48,.75],[71,.43],[83,.15]].map(([y,s])=>shape.map(([x,z])=>[x*s,y,z*s]));
 const body=k.roundTower(0,0,w*.78,h,d*.78);body.geometry=envelope(kind+':'+w+':'+d,rings,h);body.scale.set(1,1,1);body.position.set(0,0,0);body.name=isOffice?'rounded-slant-office-envelope':'tapered-crystal-landmark-envelope';
 // A legible recessed lobby and a supported canopy belong to the same tower.
 box(0,4.1,d*.405,w*.53,4.4,.18,'glass');box(0,6.5,d*.43,w*.61,.45,1.9,'metal');for(const s of[-1,1])box(s*w*.27,4.2,d*.46,.22,4.4,.22,'metal');
 const rim=new T.Mesh(cachedAsset('geometry','premium-roof-rim:'+kind+':'+w+':'+d,()=>new T.TubeGeometry(new T.CatmullRomCurve3(rings.at(-1).map(v=>new T.Vector3(...v)),true,'centripetal'),64,.13,6,true)),k.m.metal);rim.name='integrated-crown-rim';k.g.add(rim);
 if(isOffice){box(-w*.31,23,-d*.27,w*.09,40,d*.24,'stone');box(w*.25,3.2,-d*.28,w*.2,.5,d*.2,'green');}
 else{const spire=new T.Mesh(cachedAsset('geometry','premium-crystal-tip',()=>new T.ConeGeometry(1,1,8)),k.m.metal);spire.scale.set(w*.065,8,d*.06);spire.position.y=87;k.g.add(spire);}
 for(const side of[-1,1]){box(side*w*.44,3.04,0,w*.08,.12,d*.67,'green');const tree=new T.Mesh(cachedAsset('geometry','premium-tree',()=>new T.IcosahedronGeometry(.75,1)),k.m.green);tree.position.set(side*w*.44,4.4,-d*.25);tree.scale.y=1.4;k.g.add(tree);}
 const root=k.finish();upgradeSkylineMaterials(root,isOffice?0:3,k.m);
 root.userData={...root.userData,purposeKind:kind,hero:true,singleStructure:true,premiumVariant:1};
 if(!isOffice){const motion=new T.Group(),materials=[];root.add(motion);for(let i=0;i<4;i++){const mat=new T.MeshBasicMaterial({color:'#a5ecff',toneMapped:false});mat.userData.liveMotion=true;materials.push(mat);const light=new T.Mesh(unitBox,mat);light.position.set((i%2?1:-1)*w*.06,81+(i>1?3:0),d*.061);light.scale.set(.2,5,.16);light.userData.noHit=true;motion.add(light);}root.userData.heroEffect={kind:'landmark',building:root,motion,frames:48,duration:8,setFrame(f,n=48){const a=((f%n)+n)%n/n*Math.PI*2;materials.forEach((m,i)=>m.color.setHSL(.54+.04*Math.sin(a+i*.8),.6,.65+.1*Math.sin(a+i*.8)));}};}
 return root;
}