import * as T from '../vendor/three.module.js';
import {cachedAsset} from './resources.js';

// Texture grids retain the existing geometry budget and share their CPU sources
// across both the city and the independent thumbnail WebGL contexts.
const palettes=[
 {glass:'#76b6d2',frame:'#385d72',metal:'#c3d8e1',roof:'#506b7b'},
 {glass:'#a9b9b7',frame:'#665e51',metal:'#d8b574',roof:'#716c60'},
 {glass:'#72bcb0',frame:'#305e60',metal:'#bedbd0',roof:'#426f6c'},
 {glass:'#849fc6',frame:'#3b4860',metal:'#c9c8db',roof:'#505970'}
];
function reflectionEnvironment(){return cachedAsset('texture','skyline-reflection-city-v1',()=>{
 const faces=[];
 for(let side=0;side<6;side++){
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),sky=x.createLinearGradient(0,0,0,256);
  sky.addColorStop(0,'#edf7ff');sky.addColorStop(.42,'#8cb8d6');sky.addColorStop(.64,'#4d718e');sky.addColorStop(1,'#1e354d');x.fillStyle=sky;x.fillRect(0,0,256,256);
  // Broad reflected neighbours remain readable at the fixed elevated game view.
  for(let j=0;j<5;j++){const a=(j*63+side*23)%256,w=17+(j%3)*12,h=108+(j*37+side*13)%130;x.fillStyle=j%2?'#314b66':'#d7e8f3';x.fillRect(a,256-h,w,h);x.fillStyle=j%2?'#55768d':'#9ebed1';x.fillRect(a+w*.7,256-h,w*.3,h);}
  const shine=x.createLinearGradient(0,0,256,256);shine.addColorStop(0,'rgba(255,255,255,0)');shine.addColorStop(.43,'rgba(255,255,255,0)');shine.addColorStop(.5,'rgba(255,255,255,.7)');shine.addColorStop(.57,'rgba(255,255,255,0)');shine.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=shine;x.fillRect(0,0,256,256);faces.push(c);
 }
 const t=new T.CubeTexture(faces);t.colorSpace=T.SRGBColorSpace;t.needsUpdate=true;return t;
});}
function physical(key,values){return cachedAsset('skyline-physical',key,()=>{const m=new T.MeshPhysicalMaterial(values);m.userData.approvedArchitecture=true;m.userData.skylineGlassUpgrade=true;return m;});}
function facade(variant,grid){
 const {rows,cols}=grid,p=palettes[variant],pw=.94,ph=.88,key=`v1:${variant}:${rows}:${cols}`;
 const mapFor=type=>cachedAsset('texture',`skyline-${type}:${key}`,()=>{
  const c=document.createElement('canvas');c.width=512;c.height=1024;const x=c.getContext('2d'),cw=c.width/cols,ch=c.height/rows;
  x.fillStyle=type==='color'?p.frame:type==='roughness'?'#737373':'#b8b8b8';x.fillRect(0,0,c.width,c.height);
  for(let r=0;r<rows;r++)for(let col=0;col<cols;col++){
   const color=new T.Color(p.glass).multiplyScalar(1+(((col*7+r*3)%5)-2)*.017);
   x.fillStyle=type==='color'?'#'+color.getHexString():type==='roughness'?'#202020':'#a3a3a3';
   x.fillRect((col+(1-pw)/2)*cw,(r+(1-ph)/2)*ch,cw*pw,ch*ph);
  }
  const t=new T.CanvasTexture(c);if(type==='color')t.colorSpace=T.SRGBColorSpace;t.anisotropy=4;return t;
 });
 const m=physical('facade:'+key,{color:'#ffffff',map:mapFor('color'),roughness:1,roughnessMap:mapFor('roughness'),metalness:1,metalnessMap:mapFor('metalness'),clearcoat:.85,clearcoatRoughness:.16,envMapIntensity:1.65});
 m.userData.facadeGrid={rows,cols,pw,ph};m.userData.finishTier='high';m.userData.architectureWindow=true;return m;
}
export function upgradeSkylineMaterials(root,variant,source){
 const p=palettes[variant],glass=physical('glass:'+variant,{color:p.glass,roughness:.12,metalness:.62,clearcoat:1,clearcoatRoughness:.13,envMapIntensity:1.35});
 glass.userData.architectureWindow=true;
 const trim=physical('trim:'+variant,{color:p.metal,roughness:.27,metalness:.78,clearcoat:.5,envMapIntensity:1.05});
 const roof=physical('roof:'+variant,{color:p.roof,roughness:.4,metalness:.48,envMapIntensity:.85});
 const replace=m=>m?.userData.facadeGrid?facade(variant,m.userData.facadeGrid):m===source.glass?glass:m===source.metal||m===source.cream?trim:m===source.roof?roof:m;
 root.traverse(o=>{if(o.material)o.material=Array.isArray(o.material)?o.material.map(replace):replace(o.material);});
 const env=reflectionEnvironment();root.traverse(o=>{for(const m of Array.isArray(o.material)?o.material:[o.material])if(m?.userData.skylineGlassUpgrade)m.envMap=env;});root.userData.skylineMaterialVersion=1;
}