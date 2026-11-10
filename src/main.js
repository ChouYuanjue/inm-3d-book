import './styles.css';
import './upgrades.css';
import { initBookOutline } from './toc.js';
import { createPageInspector } from './inspector.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf.mjs';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {makeFrontCover, makeSpine, makeBack, makeEdge, makePlaceholder} from './cover.js';

GlobalWorkerOptions.workerSrc = pdfWorker;
const $ = id => document.getElementById(id);
const FORMATS = {
  a4:[210,297], b5:[176,250], a5:[148,210],
  royal:[170,240], sixnine:[152,229]
};
const SOURCE_PAGES=1248;
const state={
  pages:SOURCE_PAGES, sourcePages:SOURCE_PAGES, caliper:.10,
  format:'a4', binding:'hardcover',
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
const camera=new THREE.PerspectiveCamera(37,1,.08,130);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
renderer.setSize(host.clientWidth||1000,host.clientHeight||720);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.12;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
host.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.055;
controls.enablePan=false;controls.minDistance=3.3;controls.maxDistance=15;
controls.maxPolarAngle=Math.PI*.91;
controls.minPolarAngle=Math.PI*.11;
camera.position.set(-3.15,1.38,7.85);
controls.target.set(-.13,.03,0);
controls.update();

const ambient=new THREE.HemisphereLight(0xfffcf5,0xb7bbbd,1.25);scene.add(ambient);
const key=new THREE.DirectionalLight(0xffffff,2.35);
key.position.set(-3.4,7.5,8.2);
key.castShadow=true;
key.shadow.mapSize.set(2048,2048);
key.shadow.camera.left=-9;key.shadow.camera.right=9;key.shadow.camera.top=9;key.shadow.camera.bottom=-9;
key.shadow.bias=-.00013;key.shadow.normalBias=.012;
scene.add(key);
const fill=new THREE.DirectionalLight(0xe4eefa,.72);fill.position.set(6,3,-5);scene.add(fill);
const side=new THREE.DirectionalLight(0xfff2e0,.37);side.position.set(-6,3,-2);scene.add(side);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.ShadowMaterial({opacity:.13}));
floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=-1.94;scene.add(floor);

const bookRoot=new THREE.Group();scene.add(bookRoot);
let parts=null,geometryParams=null;
let coverTexture,spineTexture,backTexture,edgeTexture,placeholderTexture;
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
function makeMats() {
  coverTexture=canvasTexture(makeFrontCover(state));
  spineTexture=canvasTexture(makeSpine(state));
  backTexture=canvasTexture(makeBack(state));
  edgeTexture=canvasTexture(makeEdge());
  placeholderTexture=canvasTexture(makePlaceholder());
  frontMaterial=new THREE.MeshStandardMaterial({map:coverTexture,roughness:.94,metalness:0});
  spineMaterial=new THREE.MeshStandardMaterial({map:spineTexture,roughness:.94,metalness:0});
  backMaterial=new THREE.MeshStandardMaterial({map:backTexture,roughness:.93,metalness:0});
  insideMaterial=new THREE.MeshStandardMaterial({color:'#e7e1d4',roughness:1});
  clothMaterial=new THREE.MeshStandardMaterial({color:'#e5dfd0',roughness:.96,metalness:0});
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
function disposeGeom(group) {
  group.traverse(obj=>{if(obj.geometry)obj.geometry.dispose();if(obj.userData&&obj.userData.ownedMaterial&&obj.material)obj.material.dispose();});
  group.clear();
}
function rebuildBook(){
  if(state.flip){removeFlip();state.isMoving=false;}
  disposeGeom(bookRoot);
  const d=dims();geometryParams=d;
  const {w,h,t,board,overhang}=d;
  const upper=t/2,lower=-t/2;
  const pageEdgeMats=[edgeMaterial,edgeMaterial,edgeMaterial,edgeMaterial,insideMaterial,insideMaterial];
  const rightStack=new THREE.Mesh(new THREE.BoxGeometry(w-.068,h-.07,1),pageEdgeMats);
  rightStack.position.set(.024,0,0);rightStack.castShadow=true;rightStack.receiveShadow=true;bookRoot.add(rightStack);
  const leftStack=new THREE.Mesh(new THREE.BoxGeometry(w-.068,h-.07,1),pageEdgeMats);
  leftStack.position.x=-w+.024;leftStack.castShadow=true;leftStack.receiveShadow=true;
  leftStack.visible=false;bookRoot.add(leftStack);

  const backCover=new THREE.Mesh(
    new THREE.BoxGeometry(w+overhang*2,h+overhang*2,board),
    materialSet(clothMaterial,clothMaterial,backMaterial));
  backCover.position.z=lower-board/2-.012;backCover.castShadow=true;backCover.receiveShadow=true;bookRoot.add(backCover);

  const spine=new THREE.Mesh(
    new THREE.BoxGeometry(Math.max(.04,board*1.35),h+overhang*2,t+board*2+.02),
    [clothMaterial,spineMaterial,clothMaterial,clothMaterial,clothMaterial,clothMaterial]);
  spine.position.set(-w/2-Math.max(.04,board*1.35)*.45,0,-.005);
  spine.castShadow=true;spine.receiveShadow=true;bookRoot.add(spine);

  const frontPivot=new THREE.Group();
  frontPivot.position.set(-w/2,0,upper+board/2+.01);
  const frontCover=new THREE.Mesh(
    new THREE.BoxGeometry(w+overhang*2,h+overhang*2,board),
    materialSet(frontMaterial,clothMaterial,insideMaterial));
  frontCover.position.x=w/2;
  frontCover.castShadow=true;frontCover.receiveShadow=true;
  frontPivot.add(frontCover);bookRoot.add(frontPivot);

  const pagePlaneGeo=new THREE.PlaneGeometry(w-.11,h-.13,1,1);
  const rightPage=new THREE.Mesh(pagePlaneGeo,new THREE.MeshStandardMaterial({map:placeholderTexture,roughness:1,side:THREE.DoubleSide,metalness:0}));
  rightPage.position.x=.024;rightPage.position.z=upper+.019;
  rightPage.visible=false;rightPage.receiveShadow=true;bookRoot.add(rightPage);
  const leftPage=new THREE.Mesh(pagePlaneGeo.clone(),new THREE.MeshStandardMaterial({map:placeholderTexture,roughness:1,side:THREE.DoubleSide,metalness:0}));
  leftPage.position.x=-w+.024;leftPage.position.z=upper+.019;leftPage.visible=false;bookRoot.add(leftPage);
  rightPage.userData.ownedMaterial=true;leftPage.userData.ownedMaterial=true;
  parts={rightStack,leftStack,backCover,spine,frontPivot,frontCover,rightPage,leftPage};
  floor.position.y=-h/2-overhang-.018;
  const openT=state.coverProgress;
  frontPivot.rotation.y=-Math.PI*openT;
  frontPivot.position.z=upper+(board/2)-openT*(t+board);
  setStacks();
  showPages(state.open);
  updateStats();
}
function showPages(open){
  if(!parts)return;
  parts.rightPage.visible=open;
  parts.leftPage.visible=open&&state.spread>0;
  parts.leftStack.visible=open&&state.spread>0;
  $('readerNavigation').hidden=!open;
  $('sceneWrap').classList.toggle('is-reading',open);
}
function setStacks(){
  if(!parts)return;
  const d=geometryParams, t=d.t;
  // The printed-page count is an independent mockup setting. When it differs
  // from the PDF's length, page block motion follows the relative reading position.
  const moved=Math.min(state.pages,Math.max(0,state.pages*(state.spread*2)/Math.max(1,state.sourcePages)));
  const leftThick=Math.max(.002,t*moved/state.pages);
  const rightThick=Math.max(.002,t*(1-moved/state.pages));
  parts.rightStack.scale.z=state.open?rightThick:t;
  parts.rightStack.position.z=state.open?(-t/2+rightThick/2):0;
  parts.leftStack.scale.z=leftThick;
  parts.leftStack.position.z=-t/2+leftThick/2;
  parts.leftPage.position.z=-t/2+leftThick+.022;
  parts.rightPage.position.z=state.open?(-t/2+rightThick+.022):(t/2+.022);
  if(parts.spine)parts.spine.visible=true;
}
function updateStats(){
  const d=geometryParams||dims();
  const thickness=(state.pages/2)*state.caliper;
  $('coreThickness').textContent=thickness.toFixed(1);
  $('sheetCount').textContent=mmWord(Math.ceil(state.pages/2));
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
    $('counterLabel').textContent='READING THE MANUSCRIPT';
    $('pageIndicator').textContent=(left>0?mmWord(left)+'–':'')+mmWord(Math.min(right,state.sourcePages))+' / '+mmWord(state.sourcePages);
  }
  $('readerPosition').max=state.sourcePages;
  $('readerPageInput').max=state.sourcePages;
  $('readerPosition').value=state.currentPage;
  if(document.activeElement!==$('readerPageInput'))$('readerPageInput').value=state.currentPage;
  $('prevPage').disabled=!state.open||state.isMoving||state.spread<=0;
  $('nextPage').disabled=state.isMoving||(state.open&&state.spread*2+1>=state.sourcePages);
}
function applyCover() {
  const freshFront=canvasTexture(makeFrontCover(state));
  const freshSpine=canvasTexture(makeSpine(state));
  const freshBack=canvasTexture(makeBack(state));
  if(coverTexture)coverTexture.dispose();
  if(spineTexture)spineTexture.dispose();
  if(backTexture)backTexture.dispose();
  coverTexture=freshFront;spineTexture=freshSpine;backTexture=freshBack;
  frontMaterial.map=coverTexture;spineMaterial.map=spineTexture;backMaterial.map=backTexture;
  frontMaterial.needsUpdate=true;spineMaterial.needsUpdate=true;backMaterial.needsUpdate=true;
  if(state.coverUpload)frontMaterial.map=state.coverUpload;
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
    const viewport=pg.getViewport({scale:1.32});
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
  state.spread=Math.min(Math.max(0,index),Math.ceil(state.sourcePages/2)-1);
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
  if(!open){showPages(false);state.spread=0;state.currentPage=1;}
  motion={kind:'cover',from:state.coverProgress,to:state.coverTarget,start:performance.now(),duration:850};
  $('openBook').innerHTML=open?'Close the book <span>×</span>':'Open the book <span>↗</span>';
  if(open){setSpread(state.spread);focusView('read');}
  else {updateStats();focusView('front');}
}
function removeFlip(){
  if(!state.flip)return;
  const f=state.flip;
  if(f.group.parent)f.group.parent.remove(f.group);
  f.geometry.dispose();
  f.backMat.map.dispose();
  f.frontMat.dispose();f.backMat.dispose();
  state.flip=null;
}
async function flipPage(dir){
  if(state.isMoving)return;
  if(!state.open){setCover(true);return;}
  const next=state.spread+dir;
  if(next<0||next>=Math.ceil(state.sourcePages/2))return;
  state.isMoving=true;updateStats();
  const oldSpread=state.spread;
  const leaf=dir>0?(oldSpread*2+1):(next*2+1);
  showLoading('Turning page '+mmWord(leaf)+'…');
  try{
    const [front,back,under]=await Promise.all([
      pageTexture(leaf), pageTexture(leaf+1),
      pageTexture(next*2+1)
    ]);
    if(!state.isMoving||!state.open){state.isMoving=false;return;}
    const d=geometryParams,{w,h}=d;
    const geometry=new THREE.PlaneGeometry(w-.11,h-.13,34,12);
    geometry.translate((w-.11)/2+.055,0,0);
    const basePositions=Float32Array.from(geometry.attributes.position.array);
    const backMap=back.clone();backMap.wrapS=THREE.RepeatWrapping;
    backMap.repeat.x=-1;backMap.offset.x=1;backMap.needsUpdate=true;
    const frontMat=new THREE.MeshStandardMaterial({map:front,roughness:1,side:THREE.FrontSide});
    const backMat=new THREE.MeshStandardMaterial({map:backMap,roughness:1,side:THREE.BackSide});
    const flipFront=new THREE.Mesh(geometry,frontMat);
    const flipBack=new THREE.Mesh(geometry,backMat);
    flipFront.castShadow=true;flipFront.receiveShadow=true;
    const group=new THREE.Group();
    group.add(flipFront,flipBack);
    const rightSurface=parts.rightPage.position.z;
    const leftSurface=parts.leftPage.position.z;
    group.position.set(-w/2,0,dir>0?rightSurface+.024:leftSurface+.024);
    bookRoot.add(group);
    if(dir>0)setTextureOn(parts.rightPage,under);
    const f={group,geometry,basePositions,frontMat,backMat,from:dir>0?0:-Math.PI,to:dir>0?-Math.PI:0,dir,start:performance.now(),duration:660};
    state.flip=f;
    showLoading('');
  }catch(err){
    console.error('Page turn failed',err);
    showLoading('Could not render this page.',true);
    state.isMoving=false;updateStats();
  }
}
function animate(time){
  requestAnimationFrame(animate);
  const delta=clock.getDelta();
  if(motion){
    const k=Math.min(1,(time-motion.start)/motion.duration),v=ease(k);
    state.coverProgress=motion.from+(motion.to-motion.from)*v;
    const d=geometryParams;
    parts.frontPivot.rotation.y=-Math.PI*state.coverProgress;
    parts.frontPivot.position.z=d.t/2+(d.board/2)-state.coverProgress*(d.t+d.board);
    if(k>=1){
      const wasOpen=motion.to===1;
      motion=null;state.isMoving=false;showPages(wasOpen);
      if(wasOpen)setSpread(state.spread);else updateStats();
    }
  }
  if(state.flip){
    const f=state.flip;
    const k=Math.min(1,(time-f.start)/f.duration),v=ease(k);
    f.group.rotation.y=f.from+(f.to-f.from)*v;
    const attr=f.geometry.attributes.position,pos=attr.array,old=f.basePositions,w=geometryParams.w;
    for(let i=0;i<attr.count;i++){
      const x=old[i*3],u=Math.min(1,Math.max(0,x/w));
      pos[i*3+2]=Math.sin(u*Math.PI)*Math.sin(Math.PI*v)*.17 + (Math.sin(u*11+v*7)*.003*Math.sin(Math.PI*v));
    }
    attr.needsUpdate=true;f.geometry.computeVertexNormals();
    if(k>=1){
      const nextSpread=state.spread+f.dir;
      removeFlip();state.isMoving=false;setSpread(nextSpread);
    }
  }
  if(cameraMotion){
    const k=Math.min(1,(time-cameraMotion.start)/cameraMotion.duration),v=ease(k);
    camera.position.lerpVectors(cameraMotion.from,cameraMotion.to,v);
    controls.target.lerpVectors(cameraMotion.targetFrom,cameraMotion.targetTo,v);
    if(k>=1)cameraMotion=null;
  }
  controls.update();
  renderer.render(scene,camera);
}
function focusView(view){
  document.querySelectorAll('.view-button').forEach(x=>x.classList.toggle('active',x.id==='view'+view[0].toUpperCase()+view.slice(1)));
  const d=geometryParams||dims();
  const target=state.open?new THREE.Vector3(-d.w*.48,.10,0):new THREE.Vector3(0,.05,0);
  let destination;
  const smallScreen=host.clientWidth<520;
  if(view==='spine'){
    destination=state.open?new THREE.Vector3(-d.w*2.2,1.2,6.4):new THREE.Vector3(-5.2,1.2,5.0);
  } else if(view==='read') {
    destination=state.open?new THREE.Vector3(-d.w*.50,4.7,6.65):new THREE.Vector3(-2.6,3.25,7.3);
  } else if(view==='pages') {
    destination=state.open?new THREE.Vector3(-d.w*.45,3.15,7.7):new THREE.Vector3(3.7,3.7,5.8);
  } else {
    destination=state.open?new THREE.Vector3(-d.w*.50,1.3,8.9):new THREE.Vector3(-3.0,1.25,7.8);
  }
  if(smallScreen){destination.multiplyScalar(1.40);}
  cameraMotion={
    from:camera.position.clone(),to:destination,
    targetFrom:controls.target.clone(),targetTo:target,
    start:performance.now(),duration:850
  };
}
function printUpdate(){
  if(motion){motion=null;state.isMoving=false;}
  state.coverProgress=state.open?1:0;
  rebuildBook();
  if(state.open)setSpread(state.spread);
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
    $('openBook').innerHTML='Close the book <span>×</span>';
    const d=geometryParams||dims();
    parts.frontPivot.rotation.y=-Math.PI;
    parts.frontPivot.position.z=d.t/2+d.board/2-(d.t+d.board);
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
  $('pageCount').addEventListener('change',ev=>setPageCount(ev.target.value));
  $('pagesRange').addEventListener('input',ev=>setPageCount(ev.target.value));
  $('restorePageCount').addEventListener('click',resetToSource);
  $('format').addEventListener('change',ev=>{state.format=ev.target.value;printUpdate();});
  $('paper').addEventListener('change',ev=>{state.caliper=Number(ev.target.value);printUpdate();});
  $('binding').addEventListener('change',ev=>{state.binding=ev.target.value;printUpdate();});
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
  $('toggleSettings').addEventListener('click',()=>{
    const el=$('sidebar'),opened=el.classList.toggle('mobile-open');
    $('toggleSettings').innerHTML=opened?'Hide print settings <span>⌃</span>':'Print settings <span>⌄</span>';
    if(opened)setTimeout(()=>el.scrollIntoView({behavior:'smooth',block:'start'}),110);
  });
  document.addEventListener('keydown',e=>{
    if(inspector?.visible())return;
    if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
    if(e.key==='ArrowRight')flipPage(1);
    if(e.key==='ArrowLeft')flipPage(-1);
    if(e.key==='Escape'&&state.open)setCover(false);
    if(e.key==='Home')navigateToPage(1);
    if(e.key==='End')navigateToPage(state.sourcePages);
    if(e.key===' '){e.preventDefault();setCover(!state.open);}
  });
  let mouseStart=null;
  renderer.domElement.addEventListener('pointerdown',ev=>{mouseStart={x:ev.clientX,y:ev.clientY};});
  renderer.domElement.addEventListener('pointerup',ev=>{
    if(!mouseStart)return;
    const distance=Math.hypot(mouseStart.x-ev.clientX,mouseStart.y-ev.clientY);
    mouseStart=null;if(distance>6||state.isMoving)return;
    const rect=renderer.domElement.getBoundingClientRect();
    const xy=new THREE.Vector2(((ev.clientX-rect.left)/rect.width)*2-1,-((ev.clientY-rect.top)/rect.height)*2+1);
    const ray=new THREE.Raycaster();ray.setFromCamera(xy,camera);
    const meshes=[parts.frontCover,parts.rightPage,parts.leftPage,parts.rightStack,parts.leftStack,parts.backCover];
    const hits=ray.intersectObjects(meshes.filter(x=>x.visible),false);
    if(!hits.length)return;
    if(!state.open){setCover(true);return;}
    if(hits[0].point.x< -geometryParams.w/2-.14)flipPage(-1);else flipPage(1);
  });
  const resizeObserver=new ResizeObserver(()=>{
    const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
    camera.aspect=w/h;camera.updateProjectionMatrix();
    renderer.setSize(w,h,false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
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
  state, dims, scene, renderer,
  open:()=>setCover(true),close:()=>setCover(false),
  next:()=>flipPage(1),previous:()=>flipPage(-1),
  setPageCount,focusView,jump:navigateToPage,inspect:(n)=>inspector.open(n),pdf:()=>pdfDoc
};
