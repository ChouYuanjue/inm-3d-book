import './styles.css';
import './upgrades.css';
import './binding-upgrades.css';
import './simplified.css';
import { initBookOutline } from './toc.js';
import { createPageInspector } from './inspector.js';
import { HardcoverMechanics } from './binding.js';
import { SignatureRig } from './signature-rig.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf.mjs';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {makeFrontCover, makeSpine, makeBack, makeEdge, makePlaceholder, makeClothBump} from './cover.js';

GlobalWorkerOptions.workerSrc = pdfWorker;
const $ = id => document.getElementById(id);
const FORMATS = {
  a4:[210,297], b5:[176,250], a5:[148,210],
  royal:[170,240], sixnine:[152,229]
};
const SOURCE_PAGES=1248;
const state={
  pages:SOURCE_PAGES, sourcePages:SOURCE_PAGES, caliper:.10,
  format:'a4', binding:'hardcover', openAngle:120,
  title:'Informal Notes on Mathematics', author:'Runnel Zhang', ink:'#07508a',
  open:false, spread:0, currentPage:1, isMoving:false, flip:null,
  coverProgress:0, coverTarget:0, coverUpload:null
};
let pdfDoc=null,pdfPromise=null,pdfSource=null;
let renderToken=0;
const pageCache=new Map();
const MAX_CACHED_PAGES=16;
const host=$('canvasHost');
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(30,1,.08,130);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
renderer.setSize(host.clientWidth||1000,host.clientHeight||720);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=0.98;
renderer.shadowMap.enabled=false; // soft contact shadow is cheaper and cleaner for this viewer
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);
let renderDirty=true;
const controls=new OrbitControls(camera,renderer.domElement);
controls.addEventListener('change',()=>{renderDirty=true;});
controls.enableDamping=true;controls.dampingFactor=.055;
controls.enablePan=true;controls.screenSpacePanning=true;
controls.zoomToCursor=true;controls.panSpeed=.85;
controls.minDistance=1.6;controls.maxDistance=35;
let panMode=false;
controls.addEventListener('start',()=>{cameraMotion=null;});

controls.maxPolarAngle=Math.PI*.91;
controls.minPolarAngle=Math.PI*.11;
camera.position.set(-5.2,.4,9.3);
controls.target.set(-.13,.03,0);
controls.update();

const ambient=new THREE.HemisphereLight(0xfffcf5,0xb7bbbd,.85);scene.add(ambient);
const key=new THREE.DirectionalLight(0xffffff,1.7);
key.position.set(-3.4,7.5,8.2);
key.castShadow=true;
key.shadow.mapSize.set(2048,2048);
key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=9;key.shadow.camera.bottom=-9;
key.shadow.bias=-.00013;key.shadow.normalBias=.012;
scene.add(key);
const fill=new THREE.DirectionalLight(0xe4eefa,.48);fill.position.set(6,3,-5);scene.add(fill);
const side=new THREE.DirectionalLight(0xfff2e0,.34);side.position.set(-6,3,-2);scene.add(side);
const cutLight=new THREE.DirectionalLight(0xfff6e9,.78);cutLight.position.set(.2,3.2,-7);scene.add(cutLight);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.065}));
floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=-1.94;scene.add(floor);
// A low-frequency contact shadow complements the physically cast shadows and
// removes the disconnected "floating product mockup" appearance.
const contactShadowCanvas=document.createElement('canvas');
contactShadowCanvas.width=256;contactShadowCanvas.height=256;
const shadowCtx=contactShadowCanvas.getContext('2d');
const shadowGrad=shadowCtx.createRadialGradient(128,128,7,128,128,125);
shadowGrad.addColorStop(0,'rgba(34,36,32,.20)');
shadowGrad.addColorStop(.42,'rgba(42,44,40,.10)');
shadowGrad.addColorStop(1,'rgba(46,47,43,0)');
shadowCtx.fillStyle=shadowGrad;shadowCtx.fillRect(0,0,256,256);
const contactTexture=new THREE.CanvasTexture(contactShadowCanvas);
const contactShadow=new THREE.Mesh(new THREE.PlaneGeometry(6,5),
  new THREE.MeshBasicMaterial({map:contactTexture,transparent:true,depthWrite:false,opacity:.90}));
contactShadow.rotation.x=-Math.PI/2;contactShadow.position.set(0,floor.position.y+.003,0);
contactShadow.renderOrder=0;scene.add(contactShadow);

const bookRoot=new THREE.Group();scene.add(bookRoot);
let parts=null,geometryParams=null,bookMechanics=null;
let coverTexture,spineTexture,backTexture,edgeTexture,placeholderTexture,clothBump;
let frontMaterial,spineMaterial,backMaterial,insideMaterial,clothMaterial,edgeMaterial;
let motion=null,cameraMotion=null;
let inspector=null;
const up=new THREE.Vector3(0,0,0);
const clock=new THREE.Clock();
const tmpColor=new THREE.Color();

function canvasTexture(c) {
  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  t.needsUpdate=true;
  return t;
}
function spineArtOptions(){
  const d=dims(),rig=new SignatureRig(d,state.sourcePages,0,0,state.openAngle,state.pages);
  let arc=0,previous=rig.spinePoint(0);
  for(let k=1;k<=100;k++){
    const p=rig.spinePoint(k/100);
    arc+=Math.hypot(p.x-previous.x,p.z-previous.z);previous=p;
  }
  return {...state,spineAspect:arc/(d.h+2*d.overhang)};
}
function makeMats() {
  coverTexture=canvasTexture(makeFrontCover(state));
  spineTexture=canvasTexture(makeSpine(spineArtOptions()));
  backTexture=canvasTexture(makeBack(state));
  edgeTexture=canvasTexture(makeEdge());
  placeholderTexture=canvasTexture(makePlaceholder());
  clothBump=canvasTexture(makeClothBump());
  clothBump.wrapS=THREE.RepeatWrapping;clothBump.wrapT=THREE.RepeatWrapping;
  clothBump.repeat.set(4,4);
  frontMaterial=new THREE.MeshStandardMaterial({map:coverTexture,bumpMap:clothBump,bumpScale:.0016,roughness:.91,metalness:0,emissive:0xffffff,emissiveMap:coverTexture,emissiveIntensity:.16});
  spineMaterial=new THREE.MeshStandardMaterial({map:spineTexture,bumpMap:clothBump,bumpScale:.0016,roughness:.93,metalness:0});
  backMaterial=new THREE.MeshStandardMaterial({map:backTexture,bumpMap:clothBump,bumpScale:.0016,roughness:.93,metalness:0,emissive:0xffffff,emissiveMap:backTexture,emissiveIntensity:.16});
  insideMaterial=new THREE.MeshStandardMaterial({color:'#e7e1d4',roughness:1});
  clothMaterial=new THREE.MeshStandardMaterial({color:'#e5dfd3',bumpMap:clothBump,bumpScale:.0016,roughness:.93,metalness:0});
  edgeMaterial=new THREE.MeshStandardMaterial({map:edgeTexture,roughness:1});
}
makeMats();
function dims(){
  const [mmw,mmh]=FORMATS[state.format]||FORMATS.a4;
  const scale=2.7/210;
  const w=mmw*scale,h=mmh*scale;
  const t=Math.max(.035,(state.pages/2)*state.caliper*scale);
  const board=(state.binding==='hardcover'?2.4:.45)*scale;
  const overhang=(state.binding==='hardcover'?3.2:0)*scale;
  return {mmw,mmh,w,h,t,board,overhang,scale};
}
function materialSet(top,other,back) {
  return [other,other,other,other,top,back||other];
}
function mmWord(n){return n.toLocaleString('en-US');}
function rebuildBook(){
  if(state.flip){removeFlip();state.isMoving=false;}
  if(bookMechanics)bookMechanics.dispose();
  const d=dims();geometryParams=d;
  const newSpine=canvasTexture(makeSpine(spineArtOptions()));
  if(spineTexture)spineTexture.dispose();
  spineTexture=newSpine;spineMaterial.map=spineTexture;
  bookMechanics=new HardcoverMechanics({
    root:bookRoot,
    dimensions:d,
    sourcePages:state.sourcePages,
    printPages:state.pages,
    materials:{
      cloth:clothMaterial,
      clothBump,
      front:frontMaterial,
      back:backMaterial,
      spine:spineTexture,
      edge:edgeTexture,
      placeholder:placeholderTexture
    }
  });
  parts={
    frontPivot:bookMechanics.frontPivot,
    frontCover:bookMechanics.frontBoard,
    backCover:bookMechanics.backBoard,
    rightStack:bookMechanics.rightStack,
    leftStack:bookMechanics.leftStack,
    rightPage:bookMechanics.rightPage,
    leftPage:bookMechanics.leftPage,
    spine:bookMechanics.spine
  };
  floor.position.y=-d.h/2-d.overhang-.024;
  contactShadow.position.y=floor.position.y+.003;
  contactShadow.scale.x=state.open?1.22:.52;
  contactShadow.scale.y=state.open?1.10:.48;
  setStacks();
  showPages(state.open);
  updateStats();
  renderDirty=true;
}
function showPages(open){
  if(!parts)return;
  bookMechanics.render(state.coverProgress,state.spread,state.sourcePages,state.pages,state.openAngle);
  if(!motion){contactShadow.scale.x=open?1.22:.52;contactShadow.scale.y=open?1.10:.48;}
  $('readerNavigation').hidden=!open;
  $('sceneWrap').classList.toggle('is-reading',open);
  renderDirty=true;
}
function setStacks(){
  if(!bookMechanics)return;
  bookMechanics.render(state.coverProgress,state.spread,state.sourcePages,state.pages,state.openAngle);
  renderDirty=true;
}
function updateStats(){
  const d=geometryParams||dims();
  const thickness=(state.pages/2)*state.caliper;
  $('coreThickness').textContent=thickness.toFixed(1);
  $('sheetCount').textContent=mmWord(Math.ceil(state.pages/2));
  $('signatureCount').textContent=Math.ceil(state.pages/32)+' signatures';
  $('physicalDimensions').textContent=d.mmw+' × '+d.mmh+' mm';
  $('pageCount').value=state.pages;
  $('pagesRange').value=Math.min(2000,Math.max(100,state.pages));
  $('sourcePagesLabel').textContent='Source: '+mmWord(state.sourcePages);
  $('sceneTitle').textContent=state.title;
  $('sceneMeta').textContent=state.format.toUpperCase()+' / '+state.binding.toUpperCase()+' / '+mmWord(state.pages)+' PAGES';
  $('scaleDetails').textContent=state.format.toUpperCase()+' · '+d.mmw+' × '+d.mmh+' mm · '+thickness.toFixed(1)+' mm book block';
  if(!state.open){
    $('counterLabel').textContent='CLOSED VOLUME';
    $('pageIndicator').textContent='1 / '+mmWord(state.sourcePages);
  } else {
    const left=state.spread*2;
    const right=left+1;
    $('counterLabel').textContent='PAGE';
    const leftText=left>0&&left<=state.sourcePages?mmWord(left):'';
    const rightText=right<=state.sourcePages?mmWord(right):'';
    $('pageIndicator').textContent=(leftText&&rightText?leftText+'–'+rightText:(leftText||rightText))+' / '+mmWord(state.sourcePages);
  }
  $('readerPosition').max=state.sourcePages;
  $('readerPageInput').max=state.sourcePages;
  $('readerPosition').value=state.currentPage;
  if(document.activeElement!==$('readerPageInput'))$('readerPageInput').value=state.currentPage;
  $('inspectorQuick').hidden=!state.open;
  $('prevPage').disabled=!state.open||state.isMoving||state.spread<=0;
  $('nextPage').disabled=!state.open||state.isMoving||state.spread>=Math.ceil(state.sourcePages/2);
}
function applyCover() {
  const freshFront=canvasTexture(makeFrontCover(state));
  const freshSpine=canvasTexture(makeSpine(spineArtOptions()));
  const freshBack=canvasTexture(makeBack(state));
  if(coverTexture)coverTexture.dispose();
  if(spineTexture)spineTexture.dispose();
  if(backTexture)backTexture.dispose();
  coverTexture=freshFront;spineTexture=freshSpine;backTexture=freshBack;
  frontMaterial.map=coverTexture;frontMaterial.emissiveMap=coverTexture;spineMaterial.map=spineTexture;backMaterial.map=backTexture;backMaterial.emissiveMap=backTexture;
  frontMaterial.needsUpdate=true;spineMaterial.needsUpdate=true;backMaterial.needsUpdate=true;
  if(state.coverUpload)frontMaterial.map=state.coverUpload;
  if(bookMechanics){
    bookMechanics.materials.spine=spineTexture;
    bookMechanics.spine.material.map=spineTexture;
    bookMechanics.spine.material.emissiveMap=spineTexture;
    bookMechanics.spine.material.needsUpdate=true;
  }
  renderDirty=true;
  updateStats();
}
function showLoading(message,short=false){
  const el=$('loadingMsg');el.textContent=message||'';
  if(short&&message){clearTimeout(showLoading.timer);showLoading.timer=setTimeout(()=>{if(el.textContent===message)el.textContent='';},2500);}
}
function setTextureOn(mesh,tex){
  if(!mesh||!mesh.material)return;
  mesh.material.map=tex||placeholderTexture;
  mesh.material.needsUpdate=true;
  renderDirty=true;
}
function loadPdf(input){
  pageCache.forEach(p=>p.then(t=>{if(t&&t!==placeholderTexture)t.dispose();}).catch(()=>{}));
  pageCache.clear();pdfDoc=null;renderToken++;
  $('pdfState').textContent='Loading PDF…';
  const task=getDocument(input);
  pdfPromise=task.promise.then(doc=>{
    pdfDoc=doc;state.sourcePages=doc.numPages;
    $('pdfState').textContent=mmWord(doc.numPages)+'-page source';
    showLoading('',false);
    updateStats();
    if(state.open)setSpread(Math.min(state.spread,Math.floor((doc.numPages-1)/2)));
    return doc;
  }).catch(err=>{
    $('pdfState').textContent='PDF unavailable';
    showLoading('Unable to load PDF pages. The 3D cover remains available.',true);
    console.error('PDF loading error',err);
    throw err;
  });
  return pdfPromise;
}
function ensurePdf(){
  if(!pdfPromise)loadPdf({url:import.meta.env.BASE_URL+'inm.pdf',disableAutoFetch:false,rangeChunkSize:131072});
  return pdfPromise;
}
function pageTexture(number){
  if(!number || number<1 || number>state.sourcePages)return Promise.resolve(placeholderTexture);
  if(pageCache.has(number))return pageCache.get(number);
  const promise=ensurePdf().then(async doc=>{
    if(number>doc.numPages)return placeholderTexture;
    const pg=await doc.getPage(number);
    // High-resolution real PDF page textures (the enlarged reader uses
    // its own independent zoomable render pipeline).
    const viewport=pg.getViewport({scale:2.18});
    const c=document.createElement('canvas');
    c.width=Math.ceil(viewport.width);
    c.height=Math.ceil(viewport.height);
    const ctx=c.getContext('2d',{alpha:false});
    ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
    await pg.render({canvasContext:ctx,viewport}).promise;
    pg.cleanup();
    return canvasTexture(c);
  }).catch(err=>{
    console.warn('Could not render page',number,err);
    return placeholderTexture;
  });
  pageCache.set(number,promise);
  if(pageCache.size>MAX_CACHED_PAGES){
    for(const [key,value] of pageCache){
      if(pageCache.size<=MAX_CACHED_PAGES)break;
      if(Math.abs(key-state.spread*2-1)>5) {
        pageCache.delete(key);
        value.then(tex=>{if(tex!==placeholderTexture)tex.dispose();}).catch(()=>{});
      }
    }
  }
  return promise;
}
async function setSpread(index,requestedPage=null){
  if(!parts)return;
  state.spread=Math.min(Math.max(0,index),Math.ceil(state.sourcePages/2));
  state.currentPage=requestedPage===null?Math.min(state.sourcePages,state.spread*2+1):Math.min(state.sourcePages,Math.max(1,Math.floor(requestedPage)));
  const ticket=++renderToken;
  setStacks();showPages(state.open);updateStats();
  if(!state.open)return;
  showLoading('Preparing the printed pages…');
  try{
    const lp=state.spread===0?0:state.spread*2;
    const rp=state.spread*2+1;
    const [left,right]=await Promise.all([pageTexture(lp),pageTexture(rp)]);
    if(ticket!==renderToken)return;
    setTextureOn(parts.leftPage,left);
    setTextureOn(parts.rightPage,right);
    showLoading('');
  }catch(err){if(ticket===renderToken)showLoading('Page preview is temporarily unavailable.',true);}
}
function ease(x){return x*x*(3-2*x);}
function setCover(open){
  if(state.isMoving)return;
  state.open=open;state.isMoving=true;
  state.coverTarget=open?1:0;
  state.spread=open?state.spread:0;
  if(!open){
    $('readerNavigation').hidden=true;
    $('sceneWrap').classList.remove('is-reading');
  }
  motion={kind:'cover',from:state.coverProgress,to:state.coverTarget,start:performance.now(),duration:850};
  $('openBook').innerHTML=open?'Close <span>×</span>':'Open <span>↗</span>';
  if(open){setSpread(state.spread);focusView('read');}
  else {updateStats();focusView('front');}
}
function removeFlip(){
  if(!state.flip)return;
  const f=state.flip;
  if(f.group.parent)f.group.parent.remove(f.group);
  f.geometry.dispose();
  if(f.backMat.map)f.backMat.map.dispose();
  f.frontMat.dispose();f.backMat.dispose();
  state.flip=null;
}
function updateFlipSurface(f,amount){
  const geometry=f.geometry, positions=geometry.attributes.position;
  const original=f.basePositions;
  const w=geometryParams.w;
  const lift=Math.sin(Math.PI*amount);
  for(let i=0;i<positions.count;i++){
    const sx=original[i*3],sy=original[i*3+1];
    const u=f.dir>0?sx+.5:.5-sx,v=sy+.5;
    const a=f.poseFrom.sheetPoint(f.leaf,f.fromSide,u,v);
    const b=f.poseTo.sheetPoint(f.leaf,f.toSide,u,v);
    // The sheet remains rooted in its own signature fold. The outer edge
    // rises into a standing curved leaf before settling on the opposite stack.
    const arc=Math.sin(Math.PI*u);
    // Leaf flexes SIDEWAYS during the turn. Without this bow every sheet
    // was a rigid, razor-thin vertical blade at the animation midpoint.
    const x=THREE.MathUtils.lerp(a.x,b.x,amount)+
      lift*(f.dir>0?1:-1)*.22*arc+
      lift*.044*arc*(v-.5);
    const z=THREE.MathUtils.lerp(a.z,b.z,amount)+
      lift*(w*.80*u+.18*arc);
    const y=THREE.MathUtils.lerp(a.y,b.y,amount)+
      lift*.023*Math.sin(Math.PI*u)*Math.sin(v*Math.PI);
    positions.setXYZ(i,x,y,z+.004);
  }
  positions.needsUpdate=true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}
async function flipPage(dir){
  if(state.isMoving)return;
  if(!state.open){setCover(true);return;}
  const next=state.spread+dir;
  if(next<0||next>Math.ceil(state.sourcePages/2))return;
  state.isMoving=true;updateStats();
  const current=state.spread;
  const first=dir>0?current*2+1:current*2;
  const reverse=dir>0?first+1:first-1;
  const underneath=dir>0?next*2+1:(next>0?next*2:0);
  try{
    const [front,back,under]=await Promise.all([
      pageTexture(first),pageTexture(reverse),pageTexture(underneath)
    ]);
    if(!state.isMoving||!state.open){state.isMoving=false;return;}
    const geom=new THREE.PlaneGeometry(1,1,48,12);
    const original=Float32Array.from(geom.attributes.position.array);
    const fromSide=dir>0?'right':'left',toSide=dir>0?'left':'right';
    const poseFrom=new SignatureRig(geometryParams,state.sourcePages,current,1,state.openAngle,state.pages);
    const poseTo=new SignatureRig(geometryParams,state.sourcePages,next,1,state.openAngle,state.pages);
    // The real sewing fold reserves an unprinted gutter even while
    // the page arches vertically. It is invisible in the book display.
    const safe=poseFrom.gutterSafeFraction;
    const attrUV=geom.attributes.uv;
    const vertexColors=new Float32Array(attrUV.count*3);
    for(let i=0;i<attrUV.count;i++){
      const u=dir>0?original[3*i]+.5:.5-original[3*i];
      const sourceU=.085+.915*Math.max(0,(u-safe)/(1-safe));
      attrUV.setX(i,dir>0?sourceU:1-sourceU);
      const t=Math.min(1,u/(safe*1.8)),e=t*t*(3-2*t),shade=.83+.17*e;
      vertexColors[3*i]=shade;
      vertexColors[3*i+1]=shade*.997;
      vertexColors[3*i+2]=shade*.985;
    }
    attrUV.needsUpdate=true;
    geom.setAttribute('color',new THREE.BufferAttribute(vertexColors,3));
    const backMap=back.clone();
    backMap.wrapS=THREE.RepeatWrapping;backMap.repeat.x=-1;backMap.offset.x=1;
    backMap.needsUpdate=true;
    const frontMat=new THREE.MeshStandardMaterial({
      map:front,roughness:.98,side:THREE.FrontSide,vertexColors:true
    });
    const backMat=new THREE.MeshStandardMaterial({
      map:backMap,roughness:.98,side:THREE.BackSide,vertexColors:true
    });
    const group=new THREE.Group();
    const frontMesh=new THREE.Mesh(geom,frontMat);
    const backMesh=new THREE.Mesh(geom,backMat);
    frontMesh.frustumCulled=false;backMesh.frustumCulled=false;
    group.add(frontMesh,backMesh);bookRoot.add(group);
    const f={
      group,geometry:geom,basePositions:original,frontMat,backMat,
      poseFrom,poseTo,fromSide,toSide,leaf:dir>0?current:current-1,
      dir,start:performance.now(),lastTime:performance.now(),progress:0,duration:850
    };
    updateFlipSurface(f,0);
    if(dir>0)setTextureOn(parts.rightPage,under);
    else setTextureOn(parts.leftPage,under);
    state.flip=f;showLoading('');
  }catch(err){
    console.error('Page turn failed',err);
    showLoading('Could not turn the page.',true);
    state.isMoving=false;updateStats();
  }
}
function animate(time){
  requestAnimationFrame(animate);
  const delta=clock.getDelta();
  if(motion){
    renderDirty=true;
    const k=Math.min(1,(time-motion.start)/motion.duration),v=ease(k);
    contactShadow.scale.x=THREE.MathUtils.lerp(motion.to? .52:1.22,motion.to?1.22:.52,v);
    contactShadow.scale.y=THREE.MathUtils.lerp(motion.to? .48:1.10,motion.to?1.10:.48,v);
    state.coverProgress=motion.from+(motion.to-motion.from)*v;
    bookMechanics.render(state.coverProgress,state.spread,state.sourcePages,state.pages,state.openAngle);
    if(k>=1){
      const wasOpen=motion.to===1;
      motion=null;state.isMoving=false;showPages(wasOpen);
      if(wasOpen)setSpread(state.spread);
      else {state.spread=0;state.currentPage=1;showPages(false);updateStats();}
    }
  }
  if(state.flip){
    renderDirty=true;
    const f=state.flip;
    // Cap a single frame's time step. On software WebGL or a busy phone
    // a long PDF render must not cause the entire page turn to disappear.
    const dt=Math.min(65,Math.max(0,time-f.lastTime));
    f.lastTime=time;
    f.progress=Math.min(1,f.progress+dt/f.duration);
    const k=f.progress;
    updateFlipSurface(f,ease(k));
    if(k>=1){
      const nextSpread=state.spread+f.dir;
      removeFlip();state.isMoving=false;setSpread(nextSpread);
    }
  }
  if(cameraMotion){
    renderDirty=true;
    const k=Math.min(1,(time-cameraMotion.start)/cameraMotion.duration),v=ease(k);
    camera.position.lerpVectors(cameraMotion.from,cameraMotion.to,v);
    controls.target.lerpVectors(cameraMotion.targetFrom,cameraMotion.targetTo,v);
    if(k>=1)cameraMotion=null;
  }
  const controlsChanged=controls.update();
  if(renderDirty||controlsChanged){renderer.render(scene,camera);renderDirty=false;}
}
function focusView(view){
  document.querySelectorAll('.view-button').forEach(x=>x.classList.toggle('active',x.id==='view'+view[0].toUpperCase()+view.slice(1)));
  const d=geometryParams||dims();
  const opened=state.open;
  const worldRootY=bookMechanics?.root.position.y||0;
  const width=host.clientWidth,height=host.clientHeight;
  const pos=state.spread/Math.max(1,Math.ceil(state.sourcePages/2));
  const edge=Math.abs(pos-.5)*2;
  // On the first/last spreads, one board stands high over an almost
  // closed solid textblock. The same camera framing as the middle would
  // crop the raised board and the printed page.
  const edgeFraming=width<760?edge*.25:edge;
  const target=opened?
    new THREE.Vector3((.5-pos)*.6*edgeFraming,
      worldRootY+.18+.75*edgeFraming,0):
    new THREE.Vector3(0,.05,0);
  let destination;
  if(!opened){
    if(view==='back')destination=new THREE.Vector3(4.0,.5,-9.3);
    else if(view==='spine')destination=new THREE.Vector3(-6.8,.4,3.0);
    else if(view==='pages')destination=new THREE.Vector3(3.6,3.4,6.0);
    else destination=new THREE.Vector3(-5.2,.4,9.3);
  }else{
    // Look toward the head of the book so the bowed case spine, shoulders,
    // and two stacks are visible in cross-section rather than from overhead.
    if(view==='spine'){
      bookMechanics.root.updateMatrixWorld(true);
      const p=bookMechanics.rig.spinePoint(.5);
      target.copy(bookMechanics.root.localToWorld(new THREE.Vector3(p.x,0,p.z)));
      // View the outside of the curved case from below its backing.
      const side=pos<.22?-1:pos>.78?1:0;
      target.y+=.65;
      destination=target.clone().add(new THREE.Vector3(side*6.5,-3.8,-10.5));
    }
    else if(view==='pages')destination=new THREE.Vector3(.2,worldRootY+8.5,2.0);
    else if(view==='read')destination=new THREE.Vector3(
      target.x-.30,worldRootY+6.4+2.5*edgeFraming,4.85+.8*edgeFraming);
    else destination=new THREE.Vector3(-2.3,worldRootY+4.8,5.8);
  }
  if(width<760){
    const direction=destination.clone().sub(target);
    let minDist=opened?
      ((2*d.w+.90)/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)*(width/height)))*1.07:
      Math.max(9.8,d.h/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2))*.92);
    direction.setLength(Math.max(direction.length(),minDist));
    destination=target.clone().add(direction);
  }
  cameraMotion={
    from:camera.position.clone(),to:destination,
    targetFrom:controls.target.clone(),targetTo:target,
    start:performance.now(),duration:900
  };
}
function printUpdate(){
  if(motion){motion=null;state.isMoving=false;}
  state.coverProgress=state.open?1:0;
  rebuildBook();
  if(state.open){setSpread(state.spread);focusView('read');}
}
function setPageCount(value){
  const n=Number(value);
  if(!Number.isFinite(n))return;
  state.pages=Math.min(4000,Math.max(2,Math.round(n/2)*2));
  printUpdate();
}
function resetToSource(){setPageCount(state.sourcePages);}
// A PDF page always belongs to one physical two-page spread. Page 1 is the
// right-hand recto; page 2 is the first left-hand verso.
function navigateToPage(page,{fromInspector=false}={}){
  const n=Math.min(state.sourcePages,Math.max(1,Math.floor(Number(page)||1)));
  if(state.flip)removeFlip();
  motion=null;
  state.isMoving=false;
  if(!state.open){
    state.open=true;
    state.coverProgress=1;
    state.coverTarget=1;
    $('openBook').innerHTML='Close <span>×</span>';
    bookMechanics.render(1,state.spread,state.sourcePages,state.pages,state.openAngle);
    contactShadow.scale.x=1.22;contactShadow.scale.y=1.10;
  }
  setSpread(Math.floor(n/2),n);
  showPages(true);
  focusView('read');
  history.replaceState(null,'','#p='+n);
  if(window.matchMedia('(max-width: 760px)').matches){
    $('sidebar').classList.remove('mobile-open');
    $('toggleSettings').innerHTML='Print settings <span>⌄</span>';
    window.scrollTo({top:0,behavior:'smooth'});
  }
  return n;
}
function chooseCoverFromBlob(file){
  if(!file)return;
  const load=async()=>{
    let image;
    if(file.type==='application/pdf'){
      const blob=new Uint8Array(await file.arrayBuffer());
      const pdf=await getDocument({data:blob}).promise;
      const pg=await pdf.getPage(1);
      const vp=pg.getViewport({scale:1.65});
      const c=document.createElement('canvas');c.width=Math.round(vp.width);c.height=Math.round(vp.height);
      await pg.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
      image=c;await pdf.destroy();
    } else {
      image=await createImageBitmap(file);
    }
    const c=document.createElement('canvas');c.width=1200;c.height=1680;
    const ctx=c.getContext('2d');ctx.fillStyle='#e7e2d6';ctx.fillRect(0,0,c.width,c.height);
    const k=Math.max(c.width/image.width,c.height/image.height);
    const iw=image.width*k,ih=image.height*k;
    ctx.drawImage(image,(c.width-iw)/2,(c.height-ih)/2,iw,ih);
    if(state.coverUpload)state.coverUpload.dispose();
    state.coverUpload=canvasTexture(c);
    frontMaterial.map=state.coverUpload;frontMaterial.needsUpdate=true;
    showLoading('Your cover is applied.',true);
  };
  load().catch(err=>{console.error(err);showLoading('This cover file could not be read.',true);});
}
function saveImage(){
  renderer.render(scene,camera);
  const canvas=renderer.domElement;
  const link=document.createElement('a');
  link.href=canvas.toDataURL('image/png');
  link.download='INM-physical-book-'+(state.open?'open':'cover')+'.png';
  document.body.appendChild(link);link.click();link.remove();
}
function bindUI(){
  const backButton=document.createElement('button');
  backButton.id='viewBack';backButton.className='view-button';backButton.type='button';
  backButton.textContent='BACK';backButton.title='Back cover';
  $('viewSpine').before(backButton);
  backButton.addEventListener('click',()=>{if(state.open)setCover(false);focusView('back');});
  const tools=document.createElement('div');
  tools.className='manipulation-tools';
  tools.innerHTML='<button id="moveBook" type="button" aria-pressed="false">MOVE</button><button id="resetBookView" type="button">RESET VIEW</button><span>Right-drag to move · Scroll to zoom</span>';
  $('sceneWrap').append(tools);
  $('moveBook').addEventListener('click',()=>{
    panMode=!panMode;
    controls.mouseButtons.LEFT=panMode?THREE.MOUSE.PAN:THREE.MOUSE.ROTATE;
    controls.touches.ONE=panMode?THREE.TOUCH.PAN:THREE.TOUCH.ROTATE;
    $('moveBook').setAttribute('aria-pressed',String(panMode));
    $('moveBook').textContent=panMode?'ROTATE':'MOVE';
    renderer.domElement.style.cursor=panMode?'move':'grab';
  });
  $('resetBookView').addEventListener('click',()=>focusView(state.open?'read':'front'));

  $('pageCount').addEventListener('change',ev=>setPageCount(ev.target.value));
  $('pagesRange').addEventListener('input',ev=>setPageCount(ev.target.value));
  $('restorePageCount').addEventListener('click',resetToSource);
  $('format').addEventListener('change',ev=>{state.format=ev.target.value;printUpdate();});
  $('paper').addEventListener('change',ev=>{state.caliper=Number(ev.target.value);printUpdate();});
  $('binding').addEventListener('change',ev=>{state.binding=ev.target.value;printUpdate();});
  $('openingAngle').addEventListener('input',ev=>{state.openAngle=Number(ev.target.value);$('angleLabel').textContent=state.openAngle+'°';setStacks();});
  $('coverTitle').addEventListener('input',ev=>{state.title=ev.target.value||'Informal Notes on Mathematics';applyCover();});
  $('coverAuthor').addEventListener('input',ev=>{state.author=ev.target.value||'Runnel Zhang';applyCover();});
  $('inkColor').addEventListener('input',ev=>{state.ink=ev.target.value;applyCover();});
  $('coverUpload').addEventListener('change',ev=>chooseCoverFromBlob(ev.target.files[0]));
  $('resetCover').addEventListener('click',()=>{
    if(state.coverUpload)state.coverUpload.dispose();state.coverUpload=null;
    $('coverUpload').value='';applyCover();
  });
  $('pdfUpload').addEventListener('change',async ev=>{
    const file=ev.target.files[0];if(!file)return;
    try{
      pdfSource=file;await loadPdf({data:new Uint8Array(await file.arrayBuffer())});
      setPageCount(state.sourcePages);
      state.spread=0;state.currentPage=1;if(state.open)setSpread(0);
      $('outlineCount').textContent='The index below describes the original INM PDF.';
      showLoading('Loaded your own PDF — '+mmWord(state.sourcePages)+' pages.',true);
    }catch(err){console.error(err);}
  });
  $('captureBtn').addEventListener('click',saveImage);
  $('openBook').addEventListener('click',()=>setCover(!state.open));
  $('prevPage').addEventListener('click',()=>flipPage(-1));
  $('nextPage').addEventListener('click',()=>flipPage(1));
  $('viewFront').addEventListener('click',()=>focusView('front'));
  $('viewSpine').addEventListener('click',()=>focusView('spine'));
  $('viewPages').addEventListener('click',()=>focusView('pages'));
  $('viewRead').addEventListener('click',()=>{if(!state.open)setCover(true);else focusView('read');});
  $('readerPosition').addEventListener('input',ev=>{$('readerPageInput').value=ev.target.value;});
  $('readerPosition').addEventListener('change',ev=>navigateToPage(ev.target.value));
  $('readerPageInput').addEventListener('change',ev=>navigateToPage(ev.target.value));
  $('readerPageInput').addEventListener('keydown',ev=>{if(ev.key==='Enter'){ev.preventDefault();navigateToPage(ev.target.value);ev.target.blur();}});
  $('readerGo').addEventListener('click',()=>navigateToPage($('readerPageInput').value));
  $('inspectorOpen').addEventListener('click',()=>inspector?.open(state.currentPage));
  $('inspectorQuick').addEventListener('click',()=>inspector?.open(state.currentPage));
  $('toggleSettings').addEventListener('click',()=>{
    const el=$('sidebar'),opened=el.classList.toggle('mobile-open');
    $('toggleSettings').innerHTML=opened?'Hide print settings <span>⌃</span>':'Print settings <span>⌄</span>';
    if(opened)setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),110);
  });
  document.addEventListener('keydown',e=>{
    if(inspector?.visible())return;
    if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
    if(e.key==='r'||e.key==='R'){if(state.open)inspector?.open(state.currentPage);}
    if(e.key==='ArrowRight')flipPage(1);
    if(e.key==='ArrowLeft')flipPage(-1);
    if(e.key==='Escape'&&state.open)setCover(false);
    if(e.key==='Home')navigateToPage(1);
    if(e.key==='End')navigateToPage(state.sourcePages);
    if(e.key===' '){e.preventDefault();setCover(!state.open);}
  });
  let mouseStart=null;
  renderer.domElement.addEventListener('pointerdown',ev=>{mouseStart={x:ev.clientX,y:ev.clientY};});
  renderer.domElement.addEventListener('dblclick',ev=>{
    if(!state.open||state.isMoving)return;
    const rect=renderer.domElement.getBoundingClientRect();
    const x=(ev.clientX-rect.left)/rect.width;
    const page=x<.5?state.spread*2:state.spread*2+1;
    if(page>0&&page<=state.sourcePages)inspector?.open(page);
  });
  renderer.domElement.addEventListener('pointerup',ev=>{
    if(!mouseStart)return;
    if(panMode||ev.button!==0||!ev.isPrimary){mouseStart=null;return;}
    const distance=Math.hypot(mouseStart.x-ev.clientX,mouseStart.y-ev.clientY);
    mouseStart=null;if(distance>6||state.isMoving)return;
    const rect=renderer.domElement.getBoundingClientRect();
    const xy=new THREE.Vector2(((ev.clientX-rect.left)/rect.width)*2-1,-((ev.clientY-rect.top)/rect.height)*2+1);
    const ray=new THREE.Raycaster();ray.setFromCamera(xy,camera);
    const meshes=[parts.frontCover,parts.rightPage,parts.leftPage,parts.rightStack,parts.leftStack,parts.backCover];
    const hits=ray.intersectObjects(meshes.filter(x=>x.visible),true);
    if(!hits.length)return;
    if(!state.open){setCover(true);return;}
    // After opening, the gutter is at world x=0. The previous threshold
    // accidentally treated much of the left page as a right-hand page.
    if(hits[0].point.x<0)flipPage(-1);else flipPage(1);
  });
  const resizeObserver=new ResizeObserver(()=>{
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
    camera.aspect=w/h;camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
    renderDirty=true;
    if(w<520 && !state.isMoving && camera.position.length()<10.5){
      camera.position.set(-3.8,1.7,11.8);
      controls.target.set(0,.02,0);
      controls.update();
    }
  });
  resizeObserver.observe(host);
}
rebuildBook();
bindUI();
inspector=createPageInspector({
  getDocument:ensurePdf,
  getPageCount:()=>state.sourcePages,
  onNavigate:navigateToPage
});
initBookOutline({baseUrl:import.meta.env.BASE_URL,onJump:navigateToPage});
updateStats();
requestAnimationFrame(animate);
setTimeout(()=>{
  ensurePdf().then(()=>{
    const match=location.hash.match(/^#p=(\d+)$/);
    if(match)navigateToPage(Number(match[1]));
  }).catch(()=>{});
},600);
window.__INM_DEBUG__={
  state, dims, scene, camera, controls, renderer,
  open:()=>setCover(true),close:()=>setCover(false),
  next:()=>flipPage(1),previous:()=>flipPage(-1),
  setPageCount,focusView,jump:navigateToPage,inspect:(n)=>inspector.open(n),
  mechanics:()=>bookMechanics,pdf:()=>pdfDoc
};
