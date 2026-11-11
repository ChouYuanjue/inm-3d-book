import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {SignatureRig,LEAVES_PER_SIGNATURE,clamp} from './signature-rig.js';

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
  for(let layer=0;layer<2;layer++)for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const v=layer*grid+j*(nx+1)+i;
    uvs[v*2]=i/nx;uvs[v*2+1]=j/ny;
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
    quad(seam,id(0,0,j+1),id(1,0,j+1),id(1,0,j),id(0,0,j));
  }
  const geometry=new THREE.BufferGeometry();
  const indices=paper.concat(cut,seam);
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3));
  geometry.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
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
function createPageGeometry(side){
  const nx=PAGE_WIDTH_SEGMENTS,ny=PAGE_HEIGHT_SEGMENTS;
  const p=new Float32Array((nx+1)*(ny+1)*3);
  const uv=new Float32Array((nx+1)*(ny+1)*2);
  const indices=[];
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const k=j*(nx+1)+i,u=i/nx;
    uv[2*k]=side==='left'?1-u:u;uv[2*k+1]=j/ny;
    if(i<nx&&j<ny){
      const a=k,b=k+1,c=k+nx+2,d=k+nx+1;
      indices.push(a,b,c,a,c,d);
    }
  }
  const geom=new THREE.BufferGeometry();
  geom.setAttribute('position',new THREE.BufferAttribute(p,3));
  geom.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  geom.setIndex(indices);
  geom.userData={nx,ny,side};
  geom.computeVertexNormals();
  return geom;
}
function updatePage(mesh,rig,side){
  const idx=rig.visibleLeaf(side);
  mesh.visible=idx!==null&&rig.q>.98;
  if(idx===null)return;
  const {nx,ny}=mesh.geometry.userData;
  const pos=mesh.geometry.attributes.position;
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
    const pt=rig.sheetPoint(idx,side,i/nx,j/ny);
    pos.setXYZ(j*(nx+1)+i,pt.x,pt.y,pt.z+.0035);
  }
  pos.needsUpdate=true;mesh.geometry.computeVertexNormals();
  mesh.geometry.computeBoundingSphere();
}
function spineGeometry(h){
  const nu=100,nv=4;
  const positions=new Float32Array((nu+1)*(nv+1)*3);
  const uv=new Float32Array((nu+1)*(nv+1)*2);
  const indices=[];
  for(let j=0;j<=nv;j++)for(let i=0;i<=nu;i++){
    const k=j*(nu+1)+i;
    uv[k*2]=i/nu;uv[k*2+1]=j/nv;
    if(i<nu&&j<nv){
      const a=k,b=k+1,c=k+nu+2,d=k+nu+1;
      indices.push(a,b,c,a,c,d);
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.BufferAttribute(positions,3));
  g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  g.setIndex(indices);
  g.userData={nu,nv};
  return g;
}
function updateSpine(mesh,rig,h,overhang){
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
  mesh.visible=bounds.count>0&&rig.q>.58;
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

export class HardcoverMechanics{
  constructor({root,materials,dimensions,sourcePages=1248,printPages=sourcePages}){
    this.root=root;this.materials=materials;this.dimensions=dimensions;
    this.sourcePages=sourcePages;this.printPages=printPages;
    this.owned=[];
    this.signatureCount=0;
    this.signatureMeshes={left:[],right:[]};
    this.foldMeshes={left:[],right:[]};
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
    const paperMat=this.own(mat(0xf4f0e8,{side:THREE.DoubleSide}));
    // Broad, natural cut-paper surfaces. The former high-contrast line map
    // looked like impossibly thin slices and severe moire at the binding.
    const edgeMat=this.own(new THREE.MeshStandardMaterial({
      color:0xece7dc,roughness:1,metalness:0,side:THREE.DoubleSide,
      emissive:0xb2aa9c,emissiveIntensity:.29
    }));
    const bindingMat=this.own(mat(0xbdb3a4,{side:THREE.DoubleSide}));
    const foldedPaperMat=this.own(mat(0xe7e2d9,{side:THREE.DoubleSide}));
    this.signatureMaterial=[paperMat,edgeMat,bindingMat];

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
    const pageMaterial=()=>this.own(mat(0xffffff,{
      map:m.placeholder,side:THREE.DoubleSide,roughness:1
    }));
    this.leftPage=this.make(createPageGeometry('left'),pageMaterial());
    this.rightPage=this.make(createPageGeometry('right'),pageMaterial());
    this.leftPage.renderOrder=3;this.rightPage.renderOrder=3;
    this.leftPage.frustumCulled=false;this.rightPage.frustumCulled=false;

    // Case cloth is ONE continuous strip in all poses. It follows the bound
    // gathering hinges but never opens into a pair of book-page wings.
    this.spineGeometry=spineGeometry(h);
    this.spine=this.make(this.spineGeometry,
      this.own(mat(0xffffff,{map:m.spine,side:THREE.DoubleSide,bumpMap:m.clothBump||null,bumpScale:.001})));
    this.spine.frustumCulled=false;
    this.headbands=[];
    for(const sign of [-1,1]){
      const b=makeEndband(null,h,sign);
      this.root.add(b);this.headbands.push(b);
    }
    this.render(0,0,this.sourcePages,this.sourcePages,154);
  }
  render(q,spread,sourcePages,printPages,openAngle=154){
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
    updatePage(this.leftPage,rig,'left');
    updatePage(this.rightPage,rig,'right');
    const front=rig.getBoardAnchor('left'),back=rig.getBoardAnchor('right');
    this.frontPivot.position.set(front.x,0,front.z);
    this.backPivot.position.set(back.x,0,back.z);
    const tilt=rig.boardTilt*rig.q;
    this.frontPivot.rotation.y=rig.q*(Math.PI-rig.boardTilt);
    this.backPivot.rotation.y=tilt;
    this.frontPastedown.visible=rig.q>.03;
    this.backPastedown.visible=rig.q>.03;
    updateSpine(this.spine,rig,d.h,d.overhang);
    const wantedMap=q>.92?null:this.materials.spine;
    if(this.spine.material.map!==wantedMap){
      this.spine.material.map=wantedMap;
      this.spine.material.needsUpdate=true;
    }
    this.spine.material.color.set(q>.92?0xe4dacf:0xffffff);
    for(const hb of this.headbands)updateEndband(hb,rig);
    this.root.rotation.x=-q*Math.PI/2;
    this.root.position.x=-(1-q)*d.w/2;
    this.root.position.z=0;
    const floor=-d.h/2-d.overhang-.020;
    this.root.position.y=q*(floor-rig.estimatedLowestPoint());
    this.last={q,spread,sourcePages,printPages,openAngle,
      signatures:rig.count,rootArc:rig.analyze(),boardTilt:tilt};
    return this.last;
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
