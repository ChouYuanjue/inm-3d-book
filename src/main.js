import './styles.css';
import './upgrades.css';
import './binding-upgrades.css';
import './simplified.css';
import { initBookOutline } from './toc.js';
import { createPageInspector } from './inspector.js';
import { HardcoverMechanics } from './binding.js';
import { SignatureRig } from './signature-rig.js';
import { TurningLeaf } from './turning-leaf.js';
import { PagePreviewPacks } from './page-previews.js';
import { CachedPdfSource, PdfRenderQueue } from './pdf-source.js';
import pagePreviewIndex from './page-preview-index.json';
import * as THREE from 'three';
import { FreeViewControls } from './free-view-controls.js';
// First paint uses previews; the cached PDF becomes the local rendering source.
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {makeFrontCover, makeSpine, makeBack, makeEdge, makePlaceholder, makeClothBump} from './cover.js';

let pdfEnginePromise;
async function openPdf(input){
  pdfEnginePromise ||= import('pdfjs-dist/build/pdf.mjs').then(engine=>{
    engine.GlobalWorkerOptions.workerSrc=pdfWorker;return engine;
  });
  const engine=await pdfEnginePromise;
  return engine.getDocument(input).promise;
}
const $ = id => document.getElementById(id);
const FORMATS = {
  a4:[210,297], b5:[176,250], a5:[148,210],
  royal:[170,240], sixnine:[152,229]
};
const SOURCE_PAGES=pagePreviewIndex.count;
const state={
  pages:SOURCE_PAGES, sourcePages:SOURCE_PAGES, caliper:.10,
  format:'a4', binding:'hardcover', openAngle:120,
  title:'Informal Notes on Mathematics', author:'Runnel Zhang', ink:'#07508a',
  open:false, spread:0, currentPage:1, isMoving:false, flip:null,
  coverProgress:0, coverTarget:0, coverUpload:null
};
let pdfDoc=null,pdfPromise=null,pdfSource=null,defaultPdfTask=null;
const readingCopy=new CachedPdfSource(import.meta.env.BASE_URL+'inm.pdf',{revision:pagePreviewIndex.source});
const pdfRenderQueue=new PdfRenderQueue();
let renderToken=0;
const pageCache=new Map(),readyPages=new Map();
let pageSourceVersion=0;
const MAX_CACHED_PAGES=window.innerWidth<760?12:16;
const pageTiming={};
let pagesPendingTicket=0;
const previewPacks=new PagePreviewPacks(import.meta.env.BASE_URL+'page-previews/',fetch,window.innerWidth<760?(pagePreviewIndex.mobile||pagePreviewIndex):pagePreviewIndex);
let usePagePreviews=true,previewUnavailable=false,prefetchTimer=null;
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
const controls=new FreeViewControls(camera,renderer.domElement);
controls.addEventListener('change',()=>{renderDirty=true;});
controls.minDistance=1.6;controls.maxDistance=35;
let panMode=false,userAdjustedView=false,pageJumpOpen=false;
controls.addEventListener('start',()=>{
  cameraMotion=null;userAdjustedView=true;
  if(state.flip)state.flip.autoFrame=false;
});

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
  if(!open)pageJumpOpen=false;
  $('readerNavigation').hidden=!(open&&pageJumpOpen);
  $('togglePageJump').setAttribute('aria-expanded',String(open&&pageJumpOpen));
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
  $('togglePageJump').disabled=!state.open;
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
  const next=tex||placeholderTexture;
  if(mesh.material.map===next)return;
  mesh.material.map=next;
  renderDirty=true;
}
function loadPdf(input,{isDefault=false}={}){
  usePagePreviews=isDefault;
  if(!isDefault){
  pageCache.forEach(p=>p.then(t=>{if(t&&t!==placeholderTexture)t.dispose();}).catch(()=>{}));
  pageCache.clear();readyPages.clear();pageSourceVersion++;renderToken++;
  }
  const sourceVersion=pageSourceVersion;
  pdfDoc=null;
  $('pdfState').textContent='Loading PDF…';
  pdfPromise=openPdf(input).then(doc=>{
    if(sourceVersion!==pageSourceVersion){doc.destroy();return pdfPromise;}
    pdfDoc=doc;state.sourcePages=doc.numPages;
    $('pdfState').textContent=mmWord(doc.numPages)+'-page source';
    if(!isDefault)showLoading('',false);
    updateStats();
    if(state.open&&!isDefault)setSpread(Math.min(state.spread,Math.floor((doc.numPages-1)/2)));
    return doc;
  }).catch(err=>{
    if(sourceVersion!==pageSourceVersion)return pdfPromise;
    if(isDefault){pdfPromise=null;$('pdfState').textContent='Page previews available';throw err;}
    $('pdfState').textContent='PDF unavailable';
    showLoading('Unable to load PDF pages. The 3D cover remains available.',true);
    console.error('PDF loading error',err);
    throw err;
  });
  return pdfPromise;
}
function prepareReadingCopy(){
  if(pdfSource)return pdfPromise;
  if(!defaultPdfTask){
    const version=pageSourceVersion;
    defaultPdfTask=readingCopy.load().then(bytes=>{
      if(pdfSource||version!==pageSourceVersion)return pdfPromise;
      if(pdfPromise)return pdfPromise;
      // PDF.js transfers its input to its worker; retain the cached bytes.
      return loadPdf({data:bytes.slice()},{isDefault:true});
    }).then(doc=>{
      if(!pdfSource&&doc){
        $('pdfState').textContent=mmWord(doc.numPages)+' pages · reading copy ready';
        prefetchNeighbors();
      }
      return doc;
    }).catch(error=>{defaultPdfTask=null;throw error;});
  }
  return defaultPdfTask;
}
function ensurePdf(){return pdfPromise||prepareReadingCopy();}
async function previewTexture(number){
  const started=performance.now(),blob=await previewPacks.blob(number),fetched=performance.now();
  // Decode outside the DOM image pipeline and upload the bitmap directly;
  // no full-page canvas copy competes with the 3D camera animation.
  if(typeof createImageBitmap==='function'){
    const bitmap=await createImageBitmap(blob,{imageOrientation:'flipY',premultiplyAlpha:'none',colorSpaceConversion:'none'});
    const texture=new THREE.Texture(bitmap);
    texture.flipY=false;texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    texture.needsUpdate=true;
    texture.addEventListener('dispose',()=>bitmap.close());
    pageTiming.lastImage={fetchMs:fetched-started,decodeMs:performance.now()-fetched};
    return texture;
  }
  const url=URL.createObjectURL(blob);
  try{
    const image=new Image();image.src=url;await image.decode();
    const texture=new THREE.Texture(image);texture.colorSpace=THREE.SRGBColorSpace;texture.needsUpdate=true;
    return texture;
  }finally{URL.revokeObjectURL(url);}
}
function renderPdfTexture(number,prefetch=false){
  const version=pageSourceVersion;
  return pdfRenderQueue.run(async()=>{
    if(version!==pageSourceVersion)return placeholderTexture;
    const doc=await ensurePdf();
    if(number>doc.numPages)return placeholderTexture;
    const pg=await doc.getPage(number),base=pg.getViewport({scale:1});
    const height=usePagePreviews?(window.innerWidth<760?780:1100):(window.innerWidth<760?1100:1600);
    const viewport=pg.getViewport({scale:Math.min(1.9,height/base.height)});
    const c=document.createElement('canvas');c.width=Math.ceil(viewport.width);c.height=Math.ceil(viewport.height);
    const ctx=c.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);
    await pg.render({canvasContext:ctx,viewport}).promise;
    pg.cleanup();
    pageTiming.localRenders=(pageTiming.localRenders||0)+1;
    return canvasTexture(c);
  },prefetch);
}
function pageTexture(number,prefetch=false){
  if(!number || number<1 || number>state.sourcePages)return Promise.resolve(placeholderTexture);
  if(pageCache.has(number))return pageCache.get(number);
  const sourceVersion=pageSourceVersion;
  const promise=(async()=>{
    if(usePagePreviews&&!pdfDoc&&!previewUnavailable){
      try{return await previewTexture(number);}
      catch(error){console.warn('Using PDF fallback for page previews',error);}
    }
    return renderPdfTexture(number,prefetch);
  })().then(tex=>{
    if(sourceVersion!==pageSourceVersion){if(tex!==placeholderTexture)tex.dispose();return placeholderTexture;}
    if(pageCache.get(number)===promise)readyPages.set(number,tex);
    queueMicrotask(prunePageCache);
    return tex;
  }).catch(err=>{
    if(pageCache.get(number)===promise)pageCache.delete(number);
    console.warn('Could not render page',number,err);return placeholderTexture;
  });
  pageCache.set(number,promise);
  return promise;
}
function prunePageCache(){
  const pinned=new Set([parts?.leftPage.material.map,parts?.rightPage.material.map,state.flip?.frontMat.map]);
  for(const [number,promise] of pageCache){
    if(pageCache.size<=MAX_CACHED_PAGES)break;
    const texture=readyPages.get(number);
    // Pending or currently displayed textures must survive prefetch eviction.
    if(!texture||pinned.has(texture)||Math.abs(number-state.spread*2-1)<=4)continue;
    pageCache.delete(number);readyPages.delete(number);
    if(texture!==placeholderTexture)texture.dispose();
  }
}
function cachedPageTexture(number){return readyPages.get(number)||placeholderTexture;}
function prefetchNeighbors(){
  clearTimeout(prefetchTimer);
  const center=state.spread*2+1;
  prefetchTimer=setTimeout(()=>{
    if(!state.open||state.isMoving)return;
    for(const page of [center+1,center+2,center+3,center+4,center-2,center-3])if(page>0&&page<=state.sourcePages)pageTexture(page,true);
  },180);
}
async function setSpread(index,requestedPage=null){
  if(!parts)return;
  state.spread=Math.min(Math.max(0,index),Math.ceil(state.sourcePages/2));
  state.currentPage=requestedPage===null?Math.min(state.sourcePages,state.spread*2+1):Math.min(state.sourcePages,Math.max(1,Math.floor(requestedPage)));
  const ticket=++renderToken,started=performance.now();
  pagesPendingTicket=state.open?ticket:0;
  setStacks();showPages(state.open);updateStats();
  if(!state.open)return;
  const geometryDone=performance.now();
  showLoading('Preparing the printed pages…');
  try{
    const lp=state.spread===0?0:state.spread*2;
    const rp=state.spread*2+1;
    setTextureOn(parts.leftPage,cachedPageTexture(lp));
    setTextureOn(parts.rightPage,cachedPageTexture(rp));
    const [left,right]=await Promise.all([pageTexture(lp),pageTexture(rp)]);
    if(ticket!==renderToken)return;
    if(!state.flip){setTextureOn(parts.leftPage,left);setTextureOn(parts.rightPage,right);}
    pageTiming.page=state.currentPage;pageTiming.geometryMs=geometryDone-started;pageTiming.textureMs=performance.now()-geometryDone;pageTiming.totalMs=performance.now()-started;
    pagesPendingTicket=0;
    showLoading('');prefetchNeighbors();prunePageCache();
  }catch(err){if(ticket===renderToken){pagesPendingTicket=0;showLoading('Page preview is temporarily unavailable.',true);}}
}
function ease(x){return x*x*(3-2*x);}
function setCover(open){
  if(state.isMoving)return;
  state.open=open;state.isMoving=true;
  if(!open)pagesPendingTicket=0;
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
  prunePageCache();
}
function updateFlipSurface(f,amount){
  const rig=bookMechanics.applyTurn(f.stationaryPose,amount);
  f.model.writePositions(f.geometry.attributes.position,amount,f.dir,rig);
  f.geometry.computeVertexNormals();f.geometry.computeBoundingSphere();

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
    const [front,back,under]=[first,reverse,underneath].map(cachedPageTexture);
    if(!state.isMoving||!state.open){state.isMoving=false;return;}
    const geom=new THREE.PlaneGeometry(1,1,64,16);
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
    const frontMat=new THREE.MeshBasicMaterial({
      map:front,toneMapped:false,side:THREE.FrontSide,vertexColors:true,
      polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2
    });
    const backMat=new THREE.MeshBasicMaterial({
      map:backMap,toneMapped:false,side:THREE.BackSide,vertexColors:true,
      polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2
    });
    const stationaryPose=bookMechanics.captureTurn(next);
    const model=new TurningLeaf({from:poseFrom,to:poseTo,fromSide,toSide,columns:64,rows:16});
    const group=new THREE.Group();
    const frontMesh=new THREE.Mesh(geom,frontMat);
    const backMesh=new THREE.Mesh(geom,backMat);
    frontMesh.frustumCulled=false;backMesh.frustumCulled=false;
    frontMesh.renderOrder=4;backMesh.renderOrder=4;
    group.add(frontMesh,backMesh);bookRoot.add(group);
    const f={
      group,geometry:geom,basePositions:original,frontMat,backMat,
      poseFrom,poseTo,fromSide,toSide,model,stationaryPose,
      dir,autoFrame:false,frameScale:1,
      start:performance.now(),lastTime:performance.now(),progress:0,duration:850
    };
    updateFlipSurface(f,0);
    if(dir>0)setTextureOn(parts.rightPage,under);
    else setTextureOn(parts.leftPage,under);
    state.flip=f;showLoading('');
    // Keep the sheet's texture fixed for its entire flight. Loaded pages
    // commit on landing instead of flashing onto the moving surface.
    for(const number of [first,reverse,underneath])pageTexture(number);

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
function focusView(view,animate=true){
  userAdjustedView=false;
  camera.up.set(0,1,0);
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
  if(!animate){
    cameraMotion=null;camera.position.copy(destination);controls.target.copy(target);
    controls.update();renderDirty=true;return;
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
  const preserveView=state.open&&userAdjustedView;
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
  pageJumpOpen=false;
  setSpread(Math.floor(n/2),n);
  showPages(true);
  if(!preserveView)focusView('read',false);
  history.replaceState(null,'','#p='+n);
  if(window.matchMedia('(max-width: 760px)').matches){
    setPrintSettings(false);
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
      const pdf=await openPdf({data:blob});
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
function setPrintSettings(open){
  $('sidebar').hidden=!open;
  $('sidebar').classList.toggle('mobile-open',open);
  $('toggleSettings').setAttribute('aria-expanded',String(open));
  $('toggleSettings').innerHTML=open?'Hide print settings <span>⌃</span>':'Print settings <span>⌄</span>';
}
function bindUI(){
  const backButton=document.createElement('button');
  backButton.id='viewBack';backButton.className='view-button';backButton.type='button';
  backButton.textContent='Back';backButton.title='Back cover';
  $('viewSpine').before(backButton);
  backButton.addEventListener('click',()=>{if(state.open)setCover(false);focusView('back');});
  const tools=document.createElement('div');
  tools.className='manipulation-tools';
  tools.innerHTML='<button id="moveBook" type="button" aria-pressed="false">Move</button><button id="resetBookView" type="button">Reset view</button>';
  $('viewTools').append(tools);
  $('moveBook').addEventListener('click',()=>{
    panMode=!panMode;
    controls.mouseButtons.LEFT=panMode?THREE.MOUSE.PAN:THREE.MOUSE.ROTATE;
    controls.oneFingerPan=panMode;
    controls.noRotate=panMode;
    $('moveBook').setAttribute('aria-pressed',String(panMode));
    $('moveBook').textContent=panMode?'Rotate':'Move';
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
    const opened=$('sidebar').hidden;
    setPrintSettings(opened);
    if(opened&&window.matchMedia('(max-width:760px)').matches){
      setTimeout(()=>$('sidebar').scrollIntoView({behavior:'smooth',block:'start'}),110);
    }
  });
  $('togglePageJump').addEventListener('click',()=>{
    pageJumpOpen=!pageJumpOpen;
    $('readerNavigation').hidden=!pageJumpOpen;
    $('togglePageJump').setAttribute('aria-expanded',String(pageJumpOpen));
    if(pageJumpOpen){$('readerPageInput').focus();$('readerPageInput').select();}
  });
  $('viewMenu').addEventListener('click',event=>{
    if(event.target.closest('button'))$('viewMenu').open=false;
  });
  document.addEventListener('click',event=>{
    if(!$('viewMenu').contains(event.target))$('viewMenu').open=false;
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&$('viewMenu').open){$('viewMenu').open=false;return;}
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
    controls.handleResize();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
    renderDirty=true;
    if(w<520 && !state.isMoving && !userAdjustedView && camera.position.length()<10.5){
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
initBookOutline({baseUrl:import.meta.env.BASE_URL,onJump:navigateToPage,revision:pagePreviewIndex.source});
updateStats();
requestAnimationFrame(animate);
$('pdfState').textContent=mmWord(state.sourcePages)+'-page source';
// Warm the first turn while the cover is visible; no PDF parse is needed.
setTimeout(()=>{if(usePagePreviews&&(!state.open||state.spread===0))for(const n of [1,2,3])pageTexture(n);},150);
// Download the complete reading copy once, without blocking the first view.
setTimeout(()=>prepareReadingCopy().catch(error=>console.warn('Background reading copy deferred',error)),1000);
setTimeout(()=>{
  const match=location.hash.match(/^#p=(\d+)$/);
  if(match)navigateToPage(Number(match[1]));
},0);
window.__INM_DEBUG__={
  state, dims, scene, camera, controls, renderer,
  open:()=>setCover(true),close:()=>setCover(false),
  next:()=>flipPage(1),previous:()=>flipPage(-1),
  setPageCount,focusView,jump:navigateToPage,inspect:(n)=>inspector.open(n),
  mechanics:()=>bookMechanics,pdf:()=>pdfDoc,previews:previewPacks,readingCopy,prepareReadingCopy,pageTiming
};
