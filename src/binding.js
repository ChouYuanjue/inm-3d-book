import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {SignatureRig,LEAVES_PER_SIGNATURE,clamp,lerp,frontCoverYaw} from './signature-rig.js';

/**
 * One case-bound volume with discrete gatherings. The spine is a continuous
 * exterior shell; inside it, separate sewn folds pivot on an evolving back arc.
 * No open-book half is extruded from a two-sided, zero-thickness wedge.
 */
const WIDTH_SEGMENTS=34;
const HEIGHT_SEGMENTS=3;
const PAGE_WIDTH_SEGMENTS=64;
const PAGE_HEIGHT_SEGMENTS=16;

function mat(color,props={}){
  return new THREE.MeshStandardMaterial({color,roughness:.96,metalness:0,...props});
}
function add(mesh,parent){
  parent.add(mesh);mesh.castShadow=false;mesh.receiveShadow=false;return mesh;
}
function bookEnds(){
  const c=document.createElement('canvas');c.width=480;c.height=680;
  const ctx=c.getContext('2d');
  ctx.fillStyle='#e7e1d5';ctx.fillRect(0,0,480,680);
  let x=6331319;
  for(let i=0;i<2700;i++){
    x=(Math.imul(x,1664525)+1013904223)>>>0;
    const u=x/4294967296;
    ctx.fillStyle='rgba(112,96,78,.021)';
    ctx.fillRect((u*9973)%480,(u*8741)%680,1.2,.55);
  }
  const texture=new THREE.CanvasTexture(c);
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
  return texture;
}
function createSignatureGeometry(w,h){
  const nx=WIDTH_SEGMENTS,ny=HEIGHT_SEGMENTS;
  const grid=(nx+1)*(ny+1);
  const vertexCount=grid*2;
  const positions=new Float32Array(vertexCount*3);
  const normals=new Float32Array(vertexCount*3);
  const uvs=new Float32Array(vertexCount*2);
  const colors=new Float32Array(vertexCount*3);
  for(let layer=0;layer<2;layer++)for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const v=layer*grid+j*(nx+1)+i;
    const u=i/nx;
    uvs[v*2]=u;uvs[v*2+1]=j/ny;
    const f=Math.min(1,u/.24),r=f*f*(3-2*f);
    // Smooth shadow inside the unprintable binding gutter; no explicit
    // opaque straight line is rendered at either page's inner edge.
    const light=.78+.22*r;
    colors[v*3]=light;colors[v*3+1]=light*.997;colors[v*3+2]=light*.985;
  }
  const paper=[],cut=[],seam=[];
  function quad(dst,a,b,c,d){
    dst.push(a,b,c,a,c,d);
  }
  function id(layer,i,j){return layer*grid+j*(nx+1)+i;}
  for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
    quad(paper,id(0,i,j),id(0,i+1,j),id(0,i+1,j+1),id(0,i,j+1));
    quad(paper,id(1,i,j+1),id(1,i+1,j+1),id(1,i+1,j),id(1,i,j));
  }
  for(let i=0;i<nx;i++){
    quad(cut,id(0,i,0),id(1,i,0),id(1,i+1,0),id(0,i+1,0));
    quad(cut,id(0,i+1,ny),id(1,i+1,ny),id(1,i,ny),id(0,i,ny));
  }
  for(let j=0;j<ny;j++){
    quad(cut,id(0,nx,j),id(1,nx,j),id(1,nx,j+1),id(0,nx,j+1));
    // No visual seam stripe: the root closure is internal to the casing.
  }
  const geometry=new THREE.BufferGeometry();
  const indices=paper.concat(cut,seam);
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3));
  geometry.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  geometry.setIndex(indices);
  geometry.addGroup(0,paper.length,0);
  geometry.addGroup(paper.length,cut.length,1);
  geometry.addGroup(paper.length+cut.length,seam.length,2);
  geometry.userData={nx,ny,grid};
  return geometry;
}
function updateSignature(mesh,rig,bounds,side){
  const {start,end,count}=bounds;
  mesh.visible=count>0;
  if(!count)return;
  const g=mesh.geometry;
  const {nx,ny,grid}=g.userData;
  const p=g.attributes.position;
  const paperHigh=(side==='left'?end-1:start);
  const paperLow=(side==='left'?start:end-1);
  for(let layer=0;layer<2;layer++){
    const sheet=layer?paperLow:paperHigh;
    for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
      const u=i/nx,v=j/ny,index=layer*grid+j*(nx+1)+i;
      const pt=rig.sheetPoint(sheet,side,u,v);
      // A signature is a folded gathering, with nonzero physical thickness
      // even along its sewn root. Cut faces connect the outermost folios.
      p.setXYZ(index,pt.x,pt.y,pt.z+(layer?-.0005:.0005));
    }
  }
  p.needsUpdate=true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
}
export function createPageGeometry(side){
  const nx=PAGE_WIDTH_SEGMENTS,ny=PAGE_HEIGHT_SEGMENTS;
  const p=new Float32Array((nx+1)*(ny+1)*3);
  const uv=new Float32Array((nx+1)*(ny+1)*2);
  const colors=new Float32Array((nx+1)*(ny+1)*3);
  const indices=[];
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const k=j*(nx+1)+i,u=i/nx;
    uv[2*k]=side==='left'?1-u:u;uv[2*k+1]=j/ny;
    const t=Math.min(1,u/.24),a=t*t*(3-2*t);
    const shade=.77+.23*a;
    colors[3*k]=shade;colors[3*k+1]=shade*.998;colors[3*k+2]=shade*.985;
    if(i<nx&&j<ny){
      const a=k,b=k+1,c=k+nx+2,d=k+nx+1;
      indices.push(a,b,c,a,c,d);
    }
  }
  const geom=new THREE.BufferGeometry();
  geom.setAttribute('position',new THREE.BufferAttribute(p,3));
  geom.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  geom.setAttribute('color',new THREE.BufferAttribute(colors,3));
  geom.setIndex(indices);
  geom.userData={nx,ny,side};
  geom.computeVertexNormals();
  return geom;
}
export function updatePage(mesh,rig,side){
  const idx=rig.visibleLeaf(side);
  mesh.visible=idx!==null&&rig.q>.98;
  if(idx===null)return;
  const {nx,ny}=mesh.geometry.userData;
  const pos=mesh.geometry.attributes.position;
  const uv=mesh.geometry.attributes.uv;
  const colors=mesh.geometry.attributes.color;
  const safe=rig.gutterSafeFraction;
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const u=i/nx,v=j/ny,k=j*(nx+1)+i;
    const pt=rig.sheetPoint(idx,side,u,v);
    pos.setXYZ(k,pt.x,pt.y,pt.z+.0035);
    // Reserve the highly bent area next to each sewing fold for unprinted
    // PDF margin. The image texture excludes the innermost source margin
    // while full unmodified text stays available in READ PDF.
    const printable=Math.max(0,(u-safe)/(1-safe));
    const tex=.085+.915*printable;
    uv.setXY(k,side==='left'?1-tex:tex,v);
    const t=Math.min(1,u/(safe*1.8)),blend=t*t*(3-2*t);
    const shade=.83+.17*blend;
    colors.setXYZ(k,shade,shade*.997,shade*.985);
  }
  pos.needsUpdate=true;
  uv.needsUpdate=true;
  colors.needsUpdate=true;
  mesh.geometry.computeVertexNormals();
  mesh.geometry.computeBoundingSphere();
}
export function spineGeometry(h,exterior=false){
  const nu=100,nv=4;
  const positions=new Float32Array((nu+1)*(nv+1)*3);
  const uv=new Float32Array((nu+1)*(nv+1)*2);
  const indices=[];
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){
    const k=j*(nu+1)+i;
    // When viewed from the OUTSIDE (-X) of a closed left-bound book,
    // the back-to-front spine axis appears screen-left to screen-right.
    // The former u=i/nu mapped the canvas in reverse: even the title
    // on the physical spine was reflected like mirror writing.
    uv[k*2]=exterior?1-i/nu:i/nu;uv[k*2+1]=j/nv;
    if(i<nu&&j<nv){
      const a=k,b=k+1,c=k+nu+2,d=k+nu+1;
      // u follows the spine from board to board, v follows its height.
      // The exterior cloth must face AWAY from the page block. Keeping
      // the former +Z winding gave the outward spine an inside-out face.
      if(exterior)indices.push(a,c,b,a,d,c);
      else indices.push(a,b,c,a,c,d);
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(positions,3));
  g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  g.setIndex(indices);
  g.userData={nu,nv};
  return g;
}
export function updateSpine(mesh,rig,h,overhang){
  const g=mesh.geometry,p=g.attributes.position;
  const {nu,nv}=g.userData;
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){
    const k=j*(nu+1)+i;
    const s=i/nu,y=(-.5+j/nv)*(h+2*overhang);
    const c=rig.spinePoint(s);
    p.setXYZ(k,c.x-.001*Math.sin(y*2),y,c.z);
  }
  p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
}
/**
 * A sewn textblock has its own backing arch when opened. This is distinct
 * from the exterior hollow-case U and produces the rounded (non-knife)
 * cross-section that a heavy book displays when viewed from the head.
 */
function updateTextblockBacking(mesh,rig,h){
  const geometry=mesh.geometry,positions=geometry.attributes.position;
  const {nu,nv}=geometry.userData;
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){
    const k=j*(nu+1)+i;
    const s=i/nu;
    const fold=rig.hingeAtFraction(s);
    const y=(-.5+j/nv)*(h-.09);
    // Recess the mull beneath the separate visible leaf roots.
    positions.setXYZ(k,fold.x,y,fold.z-.024);
  }
  positions.needsUpdate=true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
}

function makeEndband(rig,h,sign){
  const N=80;
  const geom=new THREE.BufferGeometry();
  geom.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(N*3),3));
  const mesh=new THREE.Line(geom,new THREE.LineBasicMaterial({color:0x42647a,transparent:true,opacity:.82}));
  mesh.userData={N,sign,h};
  return mesh;
}
function updateEndband(mesh,rig){
  const pos=mesh.geometry.attributes.position;
  const {N,sign,h}=mesh.userData;
  for(let i=0;i<N;i++){
    const p=rig.spinePoint(i/(N-1));
    pos.setXYZ(i,p.x,sign*(h/2-.015),p.z+.012);
  }
  pos.needsUpdate=true;
}

function foldedGatheringGeometry(){
  // Visible sewn fold of one 16-leaf gathering, not a common metal pivot.
  const around=6,across=18,positions=new Float32Array((across+1)*(around+1)*3);
  const indices=[];
  for(let i=0;i<across;i++)for(let j=0;j<around;j++){
    const a=i*(around+1)+j,b=a+around+1;
    indices.push(a,b,a+1,a+1,b,b+1);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(positions,3));
  g.setIndex(indices);
  g.userData={around,across};
  return g;
}
function updateFold(mesh,rig,bounds,side,sign){
  // Keep the physical fold axes for geometry, but do not show the thick
  // parallel highlight lines that made the center look like two ruler strips.
  mesh.visible=false;
  if(!mesh.visible)return;
  const low=rig.sheetPoint(bounds.start,side,0,sign===1?1:0);
  const high=rig.sheetPoint(bounds.end-1,side,0,sign===1?1:0);
  const g=mesh.geometry;
  const pos=g.attributes.position;
  const {around,across}=g.userData;
  const span=Math.hypot(high.x-low.x,high.z-low.z);
  const bump=Math.max(.0035,span*.34);
  const r=Math.max(.0011,rig.caliper*.92);
  for(let i=0;i<=across;i++){
    const t=i/across;
    const cx=low.x+(high.x-low.x)*t+
      (side==='left'?-1:1)*bump*Math.sin(Math.PI*t);
    const cz=low.z+(high.z-low.z)*t;
    const derivativeX=high.x-low.x+
      (side==='left'?-1:1)*bump*Math.PI*Math.cos(Math.PI*t);
    const derivativeZ=high.z-low.z;
    const len=Math.hypot(derivativeX,derivativeZ)||1;
    const normalX=-derivativeZ/len,normalZ=derivativeX/len;
    const y=sign*(rig.d.h/2-.036);
    for(let j=0;j<=around;j++){
      const a=2*Math.PI*j/around;
      const c=Math.cos(a)*r,s=Math.sin(a)*r;
      pos.setXYZ(i*(around+1)+j,
        cx+normalX*c,y+s,cz+normalZ*c);
    }
  }
  pos.needsUpdate=true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
}

/**
 * A nearly closed 624-leaf block reads as dense fine paper stock, not 39
 * identical concentric scallops. Smooth the OUTER head/tail cut of the bulk
 * stack, while retaining every independently hinged gathering beneath it.
 * A thin turned stack still shows its naturally free individual folios.
 */
function createBulkCutGeometry(){
  const nu=36,nv=76,positions=new Float32Array((nu+1)*(nv+1)*3);
  const colors=new Float32Array(positions.length);
  const indices=[];
  for(let j=0;j<nv;j++)for(let i=0;i<nu;i++){
    const a=j*(nu+1)+i,b=a+nu+1;
    indices.push(a,a+1,b+1,a,b+1,b);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(positions,3));
  g.setAttribute('color',new THREE.BufferAttribute(colors,3));
  g.setIndex(indices);g.userData={nu,nv};
  return g;
}
function updateBulkCut(mesh,rig,side,sign){
  const count=side==='left'?rig.split:rig.total-rig.split;
  const dominant=count/rig.total>.76&&count>32&&rig.q>.97;
  mesh.visible=dominant;
  if(!dominant)return;
  const top=side==='left'?rig.split-1:rig.split;
  const bottom=side==='left'?0:rig.total-1;
  const g=mesh.geometry,p=g.attributes.position,c=g.attributes.color;
  const {nu,nv}=g.userData;
  const V=sign>0?1:0;
  const y=sign*((rig.d.h-.072)/2+.0017);
  const groups=Math.min(56,count/LEAVES_PER_SIGNATURE);
  for(let j=0;j<=nv;j++){
    const layer=j/nv;
    const theta=layer*groups*2*Math.PI;
    const seam=Math.pow(Math.max(0,Math.cos(theta)),20);
    const grain=.928-.031*seam-.009*Math.sin(j*1.77)*Math.sin(j*.31)-.008*layer;
    for(let i=0;i<=nu;i++){
      const u=i/nu,k=j*(nu+1)+i;
      const sheet=lerp(bottom,top,layer);
      const point=rig.sheetPoint(sheet,side,u,V);
      const z=point.z,x=point.x;
      p.setXYZ(k,x,y,z);
      const mottling=grain-.005*Math.sin(i*.73+j*.21);
      c.setXYZ(k,mottling,mottling*.971,mottling*.936);
    }
  }
  p.needsUpdate=true;
  c.needsUpdate=true;
  g.computeVertexNormals();
  g.computeBoundingSphere();
}


export function closedPaperPoint(d,s,u,v){
  const inset=d.t*.16*Math.sin(Math.PI*s);
  return {x:lerp(-.045-inset,d.w-.018-inset,u),
    y:(v-.5)*(d.h-.072),z:d.t*(.5-s)};
}
export function closedPaperGeometry(d){
  const positions=[],uv=[],indices=[],groups=[];
  function face(nx,ny,point,reverse,material,cut){
    const start=positions.length/3,indexStart=indices.length;
    for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
      const a=i/nx,b=j/ny,p=point(a,b);positions.push(p.x,p.y,p.z);
      uv.push(a,cut?(.5-p.z/d.t):b);
    }
    for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
      const a=start+j*(nx+1)+i,c=a+nx+2,b=a+1,e=a+nx+1;
      if(reverse)indices.push(a,c,b,a,e,c);else indices.push(a,b,c,a,c,e);
    }
    groups.push([indexStart,indices.length-indexStart,material]);
  }
  face(34,100,(u,s)=>closedPaperPoint(d,s,u,1),false,0,true);
  face(34,100,(u,s)=>closedPaperPoint(d,s,u,0),true,0,true);
  face(100,3,(s,v)=>closedPaperPoint(d,s,0,v),true,0,true);
  face(100,3,(s,v)=>closedPaperPoint(d,s,1,v),false,0,true);
  face(34,3,(u,v)=>closedPaperPoint(d,0,u,v),false,1,false);
  face(34,3,(u,v)=>closedPaperPoint(d,1,u,v),true,1,false);
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);
  groups.forEach(a=>g.addGroup(...a));g.computeVertexNormals();return g;
}
export function spineRimGeometry(nu=100,nv=4){
  const segments=2*(nu+nv),g=new THREE.BufferGeometry(),indices=[];
  g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(segments*12),3));
  for(let k=0;k<segments;k++){const a=k*4;indices.push(a,a+1,a+2,a,a+2,a+3);}
  g.setIndex(indices);return g;
}
export function updateSpineShell(outer,inner,rims,thickness){
  const g=outer.geometry,p=g.attributes.position,n=g.attributes.normal;
  const ip=inner.geometry.attributes.position;
  for(let k=0;k<p.count;k++)ip.setXYZ(k,p.getX(k)-n.getX(k)*thickness,
    p.getY(k)-n.getY(k)*thickness,p.getZ(k)-n.getZ(k)*thickness);
  ip.needsUpdate=true;inner.geometry.computeVertexNormals();inner.geometry.computeBoundingSphere();
  const {nu,nv}=g.userData,boundary=[];
  for(let i=0;i<nu;i++)boundary.push([i,i+1]);
  for(let j=0;j<nv;j++)boundary.push([j*(nu+1)+nu,(j+1)*(nu+1)+nu]);
  for(let i=nu;i>0;i--)boundary.push([nv*(nu+1)+i,nv*(nu+1)+i-1]);
  for(let j=nv;j>0;j--)boundary.push([j*(nu+1),(j-1)*(nu+1)]);
  const rp=rims.geometry.attributes.position;
  boundary.forEach(([a,b],k)=>{
    [[p,a],[p,b],[ip,b],[ip,a]].forEach(([v,i],j)=>rp.setXYZ(k*4+j,v.getX(i),v.getY(i),v.getZ(i)));
  });
  rp.needsUpdate=true;rims.geometry.computeVertexNormals();rims.geometry.computeBoundingSphere();
}

export class HardcoverMechanics{
  constructor({root,materials,dimensions,sourcePages=1248,printPages=sourcePages}){
    this.root=root;this.materials=materials;this.dimensions=dimensions;
    this.sourcePages=sourcePages;this.printPages=printPages;
    this.owned=[];
    this.signatureCount=0;
    this.signatureMeshes={left:[],right:[]};
    this.foldMeshes={left:[],right:[]};
    this.bulkCutMeshes={left:[],right:[]};
    this.build();
  }
  own(material){this.owned.push(material);return material;}
  make(geometry,material,parent=this.root){
    return add(new THREE.Mesh(geometry,material),parent);
  }
  build(){
    const {w,h,t,board,overhang}=this.dimensions;
    const m=this.materials;
    this.frontPivot=add(new THREE.Group(),this.root);
    this.backPivot=add(new THREE.Group(),this.root);
    // Rounded boards with a full-cover, editable printed front/back.
    const coverW=w+overhang*2,coverH=h+overhang*2;
    const shell=()=>new RoundedBoxGeometry(coverW,coverH,board,3,Math.min(board*.23,.008));
    this.frontBoard=this.make(shell(),
      [m.cloth,m.cloth,m.cloth,m.cloth,m.front,m.cloth],this.frontPivot);
    this.backBoard=this.make(shell(),
      [m.cloth,m.cloth,m.cloth,m.cloth,m.cloth,m.back],this.backPivot);
    this.frontBoard.position.x=w/2;
    this.backBoard.position.x=w/2;

    const endMat=this.own(mat(0xffffff,{map:bookEnds(),side:THREE.DoubleSide}));
    this.frontPastedown=this.make(new THREE.PlaneGeometry(w-.075,h-.085),endMat,this.frontPivot);
    this.backPastedown=this.make(new THREE.PlaneGeometry(w-.075,h-.085),endMat,this.backPivot);
    this.frontPastedown.position.set(w/2,0,-board/2-.002);
    this.backPastedown.position.set(w/2,0,board/2+.002);
    const seamMat=this.own(mat(0xc9bfaf,{side:THREE.DoubleSide}));
    const f=this.make(new THREE.PlaneGeometry(.068,h-.04),seamMat,this.frontPivot);
    const b=this.make(new THREE.PlaneGeometry(.068,h-.04),seamMat,this.backPivot);
    f.position.set(.012,0,-board/2-.003);
    b.position.set(.012,0,board/2+.003);

    this.leftStack=add(new THREE.Group(),this.root);
    this.rightStack=add(new THREE.Group(),this.root);
    const paperMat=this.own(mat(0xf7f3eb,{side:THREE.DoubleSide,vertexColors:true}));
    // Broad, natural cut-paper surfaces. The former high-contrast line map
    // looked like impossibly thin slices and severe moire at the binding.
    const edgeMat=this.own(new THREE.MeshStandardMaterial({
      color:0xece7dc,roughness:1,metalness:0,side:THREE.DoubleSide,
      emissive:0xb2aa9c,emissiveIntensity:.29
    }));
    const bindingMat=this.own(mat(0xbdb3a4,{side:THREE.DoubleSide}));
    const foldedPaperMat=this.own(mat(0xe7e2d9,{side:THREE.DoubleSide}));
    this.signatureMaterial=[paperMat,edgeMat,bindingMat];

    // Closed gatherings form a smooth trimmed paper block, rather than
    // exposing the coarse wavy outline of every aggregated signature.
    const blockGeometry=closedPaperGeometry(this.dimensions);
    const cutMaterial=this.own(mat(0xf1ede4,{map:m.edge,side:THREE.DoubleSide}));
    const faceMaterial=this.own(mat(0xf1ede4,{side:THREE.DoubleSide}));
    this.closedBlock=this.make(blockGeometry,[cutMaterial,faceMaterial]);
    this.signatureCount=Math.ceil(this.printPages/32);
    for(const side of ['left','right']){
      for(let n=0;n<this.signatureCount;n++){
        const geom=createSignatureGeometry(w,h);
        const mesh=this.make(geom,this.signatureMaterial,
          side==='left'?this.leftStack:this.rightStack);
        mesh.userData={signature:n,side};
        mesh.frustumCulled=false;
        this.signatureMeshes[side].push(mesh);
        const folds=[];
        for(const sign of [-1,1]){
          const fold=this.make(foldedGatheringGeometry(),foldedPaperMat,
            side==='left'?this.leftStack:this.rightStack);
          fold.frustumCulled=false;
          folds.push(fold);
        }
        this.foldMeshes[side].push(folds);
      }
    }
    const bulkMaterial=this.own(new THREE.MeshStandardMaterial({
      color:0xffffff,vertexColors:true,roughness:1,metalness:0,
      side:THREE.DoubleSide,emissive:0xb9ad9f,emissiveIntensity:.08
    }));
    for(const side of ['left','right'])for(const sign of [-1,1]){
      const cut=this.make(createBulkCutGeometry(),bulkMaterial);
      cut.frustumCulled=false;
      cut.renderOrder=2;
      this.bulkCutMeshes[side].push({mesh:cut,sign});
    }
    // Do not wash out printed ink under studio lighting. Display the
    // PDF at its original sRGB contrast, while retaining the soft, local
    // gutter vignette through vertex colors.
    const pageMaterial=()=>this.own(new THREE.MeshBasicMaterial({
      map:m.placeholder,color:0xffffff,side:THREE.DoubleSide,
      vertexColors:true,toneMapped:false
    }));
    this.leftPage=this.make(createPageGeometry('left'),pageMaterial());
    this.rightPage=this.make(createPageGeometry('right'),pageMaterial());
    this.leftPage.renderOrder=3;this.rightPage.renderOrder=3;
    this.leftPage.frustumCulled=false;this.rightPage.frustumCulled=false;

    // Case cloth is ONE continuous strip in all poses. It follows the bound
    // gathering hinges but never opens into a pair of book-page wings.
    this.spineGeometry=spineGeometry(h,true);
    this.spine=this.make(this.spineGeometry,
      this.own(mat(0xffffff,{map:m.spine,side:THREE.FrontSide,bumpMap:m.clothBump||null,bumpScale:.001,emissive:0xffffff,emissiveMap:m.spine,emissiveIntensity:.16})));
    this.spineThickness=Math.max(.008,Math.min(.04,board*.82));
    this.spineLining=this.make(spineGeometry(h,false),
      this.own(mat(0xe1dacd,{side:THREE.FrontSide})));
    this.spineRims=this.make(spineRimGeometry(),this.own(mat(0xe1dacd,{side:THREE.DoubleSide})));
    this.spineLining.frustumCulled=false;this.spineRims.frustumCulled=false;
    this.sewnBacking=this.make(spineGeometry(h),
      this.own(mat(0xc7bcaa,{side:THREE.DoubleSide,roughness:1})));
    this.sewnBacking.frustumCulled=false;
    this.spine.frustumCulled=false;
    // Flexible bookcloth joins the spine shell to the cover boards.
    // Closing the case must not leave a strip of background at each hinge.
    this.caseJoints=['left','right'].map(side=>{
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(new Float32Array(12),3));
      g.setIndex([0,1,2,0,2,3]);
      const mesh=this.make(g,this.own(mat(0xd8d1c1,{side:THREE.DoubleSide})));
      mesh.frustumCulled=false; return {side,mesh};
    });
    this.headbands=[];
    for(const sign of [-1,1]){
      const b=makeEndband(null,h,sign);
      this.root.add(b);this.headbands.push(b);
    }
    this.render(0,0,this.sourcePages,this.printPages,120);
  }
  render(q,spread,sourcePages,printPages,openAngle=154){
    const previous=this.last;
    if(!this.inTurn&&previous&&previous.q===q&&previous.spread===spread&&previous.sourcePages===sourcePages&&previous.printPages===printPages&&previous.openAngle===openAngle)return previous;
    this.inTurn=false;
    const d=this.dimensions;
    const rig=new SignatureRig(d,sourcePages,spread,q,openAngle,printPages);
    this.rig=rig;
    for(const side of ['left','right']){
      const arr=this.signatureMeshes[side];
      for(let n=0;n<arr.length;n++){
        const bounds=rig.signatureBounds(n,side);
        updateSignature(arr[n],rig,bounds,side);
        updateFold(this.foldMeshes[side][n][0],rig,bounds,side,-1);
        updateFold(this.foldMeshes[side][n][1],rig,bounds,side,1);
      }
    }
    for(const side of ['left','right']){
      for(const {mesh,sign} of this.bulkCutMeshes[side]){
        updateBulkCut(mesh,rig,side,sign);
      }
    }
    this.closedBlock.visible=rig.q<.015;
    if(this.closedBlock.visible){
      for(const side of ['left','right']){
        for(const mesh of this.signatureMeshes[side])mesh.visible=false;
        for(const {mesh} of this.bulkCutMeshes[side])mesh.visible=false;
      }
    }
    updatePage(this.leftPage,rig,'left');
    updatePage(this.rightPage,rig,'right');
    const front=rig.getBoardAnchor('left'),back=rig.getBoardAnchor('right');
    this.frontPivot.position.set(front.x,0,front.z);
    this.backPivot.position.set(back.x,0,back.z);
    const tilt=rig.boardTilt*rig.q;
    // The front board must swing FORWARD toward the viewer around the
    // left-hand binding hinge. At rest its outside is +Z; turning negative
    // Y exposes its inside and crosses the fore-edge over the textblock.
    // +q*(PI+tilt) ended in the SAME pose modulo 2PI, but followed the
    // opposite (outside/backward) arc during the entire opening animation.
    this.frontPivot.rotation.y=frontCoverYaw(rig.q,rig.leftTilt);
    this.backPivot.rotation.y=-rig.q*rig.rightTilt;
    this.frontPastedown.visible=rig.q>.03;
    this.backPastedown.visible=rig.q>.03;
    for(const {side,mesh} of this.caseJoints){
      const isFront=side==='left';
      const a=rig.spinePoint(isFront?0:1),p=isFront?this.frontPivot:this.backPivot;
      const zOffset=(isFront?1:-1)*d.board/2;
      const bx=p.position.x+Math.sin(p.rotation.y)*zOffset;
      const bz=p.position.z+Math.cos(p.rotation.y)*zOffset;
      const hh=d.h/2+d.overhang;
      const v=mesh.geometry.attributes.position;
      v.setXYZ(0,a.x,-hh,a.z);v.setXYZ(1,bx,-hh,bz);
      v.setXYZ(2,bx,hh,bz);v.setXYZ(3,a.x,hh,a.z);
      v.needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingSphere();
    }
    updateSpine(this.spine,rig,d.h,d.overhang);
    updateSpineShell(this.spine,this.spineLining,this.spineRims,this.spineThickness);
    updateTextblockBacking(this.sewnBacking,rig,d.h);
    const wantedMap=this.materials.spine;
    if(this.spine.material.map!==wantedMap){
      this.spine.material.map=wantedMap;
      this.spine.material.emissiveMap=wantedMap;
      this.spine.material.needsUpdate=true;
    }
    this.spine.material.color.set(0xffffff);
    for(const hb of this.headbands){
      updateEndband(hb,rig);
      hb.visible=false; // Keep head/tail cloth free of artificial blue trim.
    }
    this.root.rotation.x=-q*Math.PI/2;
    this.root.position.x=-(1-q)*d.w/2;
    this.root.position.z=0;
    const floor=-d.h/2-d.overhang-.020;
    this.root.position.y=q*(floor-rig.estimatedLowestPoint());
    this.last={q,spread,sourcePages,printPages,openAngle,
      signatures:rig.count,rootArc:rig.analyze(),boardTilt:tilt};
    return this.last;
  }

  captureTurn(nextSpread){
    const previous={...this.last};
    function capture(root){
      const objects=[];
      root.traverse(object=>{
        const attributes={};
        if(object.geometry)for(const name of ['position','normal','uv','color']){
          const a=object.geometry.attributes[name];
          if(a)attributes[name]=Float32Array.from(a.array);
        }
        objects.push({object,visible:object.visible,position:object.position.clone(),
          quaternion:object.quaternion.clone(),scale:object.scale.clone(),attributes});
      });
      return objects;
    }
    const from=capture(this.root);
    this.render(1,nextSpread,previous.sourcePages,previous.printPages,previous.openAngle);
    const to=capture(this.root);
    this.render(1,previous.spread,previous.sourcePages,previous.printPages,previous.openAngle);
    const entries=from.map((a,i)=>{
      const b=to[i],attributes=[];
      for(const name of Object.keys(a.attributes)){
        const p=a.attributes[name],q=b.attributes[name];
        if(p.some((x,k)=>x!==q[k]))attributes.push({name,from:p,to:q});
      }
      return {from:a,to:b,attributes};
    });
    return {entries,spread:previous.spread,nextSpread,sourcePages:previous.sourcePages,
      printPages:previous.printPages,openAngle:previous.openAngle};
  }
  applyTurn(pose,amount){
    this.inTurn=true;
    const t=clamp(amount,0,1);
    for(const entry of pose.entries){
      const a=entry.from,b=entry.to,object=a.object;
      object.visible=t===0?a.visible:t===1?b.visible:a.visible&&b.visible;
      object.position.lerpVectors(a.position,b.position,t);
      object.quaternion.slerpQuaternions(a.quaternion,b.quaternion,t);
      object.scale.lerpVectors(a.scale,b.scale,t);
      for(const {name,from,to} of entry.attributes){
        const attribute=object.geometry.attributes[name],array=attribute.array;
        for(let k=0;k<array.length;k++)array[k]=lerp(from[k],to[k],t);
        attribute.needsUpdate=true;
      }
    }
    this.rig=new SignatureRig(this.dimensions,pose.sourcePages,
      lerp(pose.spread,pose.nextSpread,t),1,pose.openAngle,pose.printPages);
    return this.rig;
  }

  pageSurface(side,spread,sourcePages,u){
    const rig=new SignatureRig(this.dimensions,sourcePages,spread,1,this.last?.openAngle||154,this.last?.printPages||sourcePages);
    const idx=rig.visibleLeaf(side);
    if(idx===null)return rig.spinePoint(.5).z;
    return rig.sheetPoint(idx,side,u,.5).z;
  }
  pagePoint(side,spread,sourcePages,u,v){
    const rig=new SignatureRig(this.dimensions,sourcePages,spread,1,this.last?.openAngle||154,this.last?.printPages||sourcePages);
    const idx=rig.visibleLeaf(side);
    return idx===null?{x:0,y:0,z:0}:rig.sheetPoint(idx,side,u,v);
  }
  getTop(side,spread,sourcePages){
    return this.pageSurface(side,spread,sourcePages,0);
  }
  dispose(){
    this.root.traverse(obj=>{if(obj.geometry)obj.geometry.dispose();
      if(obj.isLine&&obj.material)obj.material.dispose();});
    for(const material of this.owned){
      if(material===this.frontPastedown.material&&material.map)material.map.dispose();
      material.dispose();
    }
    this.root.clear();
  }
}
