import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/**
 * INM case-bound book. The spine is one compact, continuous piece of bookcloth.
 * It NEVER unfolds with the leaves. Only cover boards pivot on their own joints.
 * A shaped stack on each side represents signatures fanning out from the gutter.
 *
 * Local coordinate system: X = fore edge; Y = spine length; Z = thickness.
 * Closed: both covers face +X, front at +Z. Open: left cover points -X,
 * back cover +X. The model as a whole reclines onto a desk when opened.
 */
const clamp = (x,a,b)=>Math.min(b,Math.max(a,x));
const smooth = x => x*x*(3-2*x);
const normalize = (v,max)=>clamp(v/max,0,1);
export const topProfile = u => 1-0.19*Math.exp(-10*u);
const bottomProfile=u=>0.055*Math.exp(-12*u);
const PAPER_WIDTH_MARGIN=0.065;
const GUTTER_GAP=0.042;

function plain(color,extra={}){
  return new THREE.MeshStandardMaterial({color,roughness:.94,metalness:0,...extra});
}
function endpaperTexture(){
  const c=document.createElement('canvas');c.width=640;c.height=900;
  const ctx=c.getContext('2d');
  const g=ctx.createLinearGradient(0,0,c.width,c.height);
  g.addColorStop(0,'#ede7da');g.addColorStop(.55,'#e7e2d7');g.addColorStop(1,'#dedacc');
  ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);
  let seed=1539261;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  for(let i=0;i<2400;i++){
    const x=rand()*c.width,y=rand()*c.height;
    ctx.fillStyle=rand()>.5?'rgba(255,255,255,.07)':'rgba(92,87,63,.035)';
    ctx.fillRect(x,y,1+rand()*3,.25+rand());
  }
  ctx.strokeStyle='rgba(74,104,115,.21)';ctx.lineWidth=1.4;
  ctx.strokeRect(29,29,582,842);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  tex.anisotropy=4;
  return tex;
}

function blockGeometry(w,h,side){
  const shape=new THREE.Shape();
  const N=56, xMin=.035, xMax=w-PAPER_WIDTH_MARGIN;
  for(let i=0;i<=N;i++){
    const x=xMin+(xMax-xMin)*i/N,u=normalize(x,w);
    if(!i)shape.moveTo(side*x,bottomProfile(u));
    else shape.lineTo(side*x,bottomProfile(u));
  }
  for(let i=N;i>=0;i--){
    const x=xMin+(xMax-xMin)*i/N,u=normalize(x,w);
    shape.lineTo(side*x,topProfile(u));
  }
  shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{
    steps:1,depth:h-.07,bevelEnabled:false,curveSegments:1
  });
  geo.rotateX(Math.PI/2);
  geo.translate(0,(h-.07)/2,0);
  geo.userData.basePositions=Float32Array.from(geo.attributes.position.array);
  return geo;
}
function sheetGeometry(w,h,side){
  const geo=new THREE.PlaneGeometry(w-.115,h-.135,54,8);
  geo.translate(side*w/2,0,0);
  geo.userData.basePositions=Float32Array.from(geo.attributes.position.array);
  return geo;
}
function spineGeometry(h){
  const segments=72,coords=new Float32Array((segments+1)*6);
  const uvs=new Float32Array((segments+1)*4);
  const indices=[];
  for(let i=0;i<=segments;i++){
    const u=i/segments;
    uvs[4*i]=u;uvs[4*i+1]=0;uvs[4*i+2]=u;uvs[4*i+3]=1;
    if(i<segments){
      const k=i*2;indices.push(k,k+1,k+2,k+2,k+1,k+3);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setIndex(indices);
  geo.setAttribute('position',new THREE.BufferAttribute(coords,3));
  geo.setAttribute('uv',new THREE.BufferAttribute(uvs,2));
  return geo;
}
function laminatedCutGeometry(w,h,side,kind,material){
  // Each visible signature cut is a *surface made of hundreds of narrow paper
  // lamellae*, with its own soft color gradient. This preserves the layer
  // structure under any page-count change and eliminates the solid gray slab.
  const layers=kind==='fore'?108:82;
  const sections=kind==='fore'?4:21;
  const n=layers*sections*6;
  const geometry=new THREE.BufferGeometry();
  const positions=new Float32Array(n*3);
  const normals=new Float32Array(n*3);
  const colors=new Float32Array(n*3);
  const metadata=new Float32Array(n*3);
  const baseDarker=new THREE.Color('#c4baad');
  const baseLighter=new THREE.Color('#f6f1e7');
  const baseMiddle=new THREE.Color('#eee8dc');
  const normal=kind==='fore'?[side,0,0]:[0,kind==='head'?1:-1,0];
  let v=0;
  for(let j=0;j<layers;j++){
    const f0=j/layers,f1=(j+1)/layers;
    const wobble=Math.sin(j*11.77)*Math.cos(j*3.87);
    const mid=baseMiddle.clone().lerp(baseLighter,.13+.07*wobble);
    const low=baseDarker.clone().lerp(mid,.61+.06*wobble);
    const high=mid.clone().lerp(baseLighter,.14);
    for(let i=0;i<sections;i++){
      const u0=(.035+(w-.035-PAPER_WIDTH_MARGIN)*i/sections)/w;
      const u1=(.035+(w-.035-PAPER_WIDTH_MARGIN)*(i+1)/sections)/w;
      const y0=-(h/2-.041)+(h-.082)*i/sections;
      const y1=-(h/2-.041)+(h-.082)*(i+1)/sections;
      const corners=kind==='fore'
        ?[[1,f0,y0],[1,f0,y1],[1,f1,y1],[1,f1,y0]]
        :[[u0,f0,0],[u1,f0,0],[u1,f1,0],[u0,f1,0]];
      for(const [corner,shade] of [[0,low],[1,low],[2,high],[0,low],[2,high],[3,high]]){
        const [u,f,y]=corners[corner],o=v*3;
        metadata[o]=u;metadata[o+1]=f;metadata[o+2]=y;
        normals[o]=normal[0];normals[o+1]=normal[1];normals[o+2]=normal[2];
        colors[o]=shade.r;colors[o+1]=shade.g;colors[o+2]=shade.b;
        v++;
      }
    }
  }
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3));
  geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const mesh=new THREE.Mesh(geometry,material);
  mesh.userData={meta:metadata,kind,side,w,h};
  mesh.castShadow=false;
  mesh.receiveShadow=false;
  mesh.frustumCulled=false;
  mesh.renderOrder=2;
  return mesh;
}
function updateLaminatedCut(mesh,thick,drop,fan,gutter,openFraction){
  const {meta,kind,side,w,h}=mesh.userData;
  const pos=mesh.geometry.attributes.position;
  const count=pos.count;
  const headY=(h/2-.035)+.005;
  for(let i=0;i<count;i++){
    const o=i*3,u=meta[o],f=meta[o+1],y=meta[o+2];
    const z=fanHeight(u,f,thick,drop,fan,gutter,openFraction);
    if(kind==='fore'){
      pos.setXYZ(i,side*(w-PAPER_WIDTH_MARGIN+.005),y,z);
    }else{
      pos.setXYZ(i,side*u*w,(kind==='head'?1:-1)*headY,z);
    }
  }
  pos.needsUpdate=true;
}
function clothSpineCoords(u,q,t,board,sag){
  // Closed: the broad curved BACK of a book, spanning the entire thickness.
  const z0=-t/2-board/2-.008;
  const r=Math.min(.16,t*.17);
  const closedX=-.045-r*Math.sin(Math.PI*u);
  const closedZ=z0+(t+board+.016)*u;
  // Open: the *same intact casing*, tucked compactly behind the sewn spine.
  // It is a narrow downward U, not two spreading wings or an unfolded board.
  const openX=GUTTER_GAP*(1-2*u)-.006*Math.sin(Math.PI*u);
  const openZ=z0-sag*Math.sin(Math.PI*u);
  return [THREE.MathUtils.lerp(closedX,openX,q),
          THREE.MathUtils.lerp(closedZ,openZ,q)];
}
function fanHeight(u,f,thick,drop,fan,gutter,openFraction){
  const flow=1-Math.exp(-u*12);
  const closed=thick*(bottomProfile(u)+(topProfile(u)-bottomProfile(u))*f);
  const open=gutter*(1-flow)+(thick*f-drop*u+fan*u*u*(.10+.90*f))*flow;
  return THREE.MathUtils.lerp(closed,open,openFraction);
}
function placeStack(geom,thick,drop,fan,w,gutter,openFraction){
  const pos=geom.attributes.position;
  const base=geom.userData.basePositions;
  for(let i=0;i<pos.count;i++){
    const x=base[i*3],y=base[i*3+1],z=base[i*3+2];
    const u=normalize(Math.abs(x),w);
    const lower=bottomProfile(u),upper=topProfile(u);
    const fraction=clamp((z-lower)/(upper-lower),0,1);
    pos.setZ(i,fanHeight(u,fraction,thick,drop,fan,gutter,openFraction));
  }
  pos.needsUpdate=true;
  geom.computeVertexNormals();
  geom.computeBoundingSphere();
}
function placeSheet(geo,thick,drop,fan,w,gutter,openFraction,offset=.015){
  const pos=geo.attributes.position,base=geo.userData.basePositions;
  for(let i=0;i<pos.count;i++){
    const x=base[i*3],y=base[i*3+1],u=normalize(Math.abs(x),w);
    const ripple=.0025*Math.sin(Math.PI*u)*(1+Math.cos(y*7.5))*.5;
    pos.setZ(i,fanHeight(u,1,thick,drop,fan,gutter,openFraction)+offset+ripple);
  }
  pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();
}

export class HardcoverMechanics{
  constructor({root,materials,dimensions}){
    this.root=root;this.materials=materials;this.dimensions=dimensions;
    this.materialsOwned=[];this.last=null;this.build();
  }
  own(m){this.materialsOwned.push(m);return m;}
  add(geo,mat,parent=this.root){
    const o=new THREE.Mesh(geo,mat);o.castShadow=true;o.receiveShadow=true;
    parent.add(o);return o;
  }
  build(){
    const {w,h,t,board,overhang}=this.dimensions;
    const m=this.materials;
    const coverW=w+overhang*2,coverH=h+overhang*2;
    const coverGeom=()=>new RoundedBoxGeometry(coverW,coverH,board,3,Math.min(.009,board*.24));
    this.backPivot=new THREE.Group();this.root.add(this.backPivot);
    this.backBoard=this.add(coverGeom(),
      [m.cloth,m.cloth,m.cloth,m.cloth,m.cloth,m.back],this.backPivot);
    this.backBoard.position.x=w/2;
    this.frontPivot=new THREE.Group();this.root.add(this.frontPivot);
    this.frontBoard=this.add(coverGeom(),
      [m.cloth,m.cloth,m.cloth,m.cloth,m.front,m.cloth],this.frontPivot);
    this.frontBoard.position.x=w/2;
    const endpaperMat=this.own(new THREE.MeshStandardMaterial({
      map:endpaperTexture(),side:THREE.DoubleSide,roughness:1
    }));
    this.backPastedown=this.add(new THREE.PlaneGeometry(w-.09,h-.11),endpaperMat,this.backPivot);
    this.backPastedown.position.set(w/2,0,board/2+.003);
    this.backPastedown.castShadow=false;
    this.frontPastedown=this.add(new THREE.PlaneGeometry(w-.09,h-.11),endpaperMat,this.frontPivot);
    this.frontPastedown.position.set(w/2,0,-board/2-.003);
    this.frontPastedown.castShadow=false;

    // Bookcloth joint follows each *cover board*, never the turning leaves.
    const jointMat=this.own(plain(0xccc4b3,{side:THREE.DoubleSide}));
    this.frontJoint=this.add(new THREE.PlaneGeometry(.075,h-.05),jointMat,this.frontPivot);
    this.frontJoint.position.set(.005,0,-board/2-.006);
    this.backJoint=this.add(new THREE.PlaneGeometry(.075,h-.05),jointMat,this.backPivot);
    this.backJoint.position.set(.005,0,board/2+.006);
    this.frontJoint.castShadow=false;this.backJoint.castShadow=false;

    this.leftPivot=new THREE.Group();this.rightPivot=new THREE.Group();
    this.root.add(this.leftPivot,this.rightPivot);
    const paperCut=this.own(new THREE.MeshStandardMaterial({map:m.edge,color:0xffffff,roughness:.97,metalness:0,side:THREE.DoubleSide}));
    const paperEdge=this.own(plain(0xf0ece5,{side:THREE.DoubleSide}));
    this.paperMaterial=paperCut;
    this.rightStack=this.add(blockGeometry(w,h,1),[paperCut,paperEdge],this.rightPivot);
    this.leftStack=this.add(blockGeometry(w,h,-1),[paperCut,paperEdge],this.leftPivot);
    const pageMat=()=>this.own(new THREE.MeshStandardMaterial({
      map:m.placeholder,roughness:1,metalness:0,side:THREE.DoubleSide
    }));
    this.rightPage=this.add(sheetGeometry(w,h,1),pageMat(),this.rightPivot);
    this.leftPage=this.add(sheetGeometry(w,h,-1),pageMat(),this.leftPivot);
    this.rightPage.castShadow=false;this.leftPage.castShadow=false;
    this.rightPage.renderOrder=3;this.leftPage.renderOrder=3;
    // A stack shows countless sheet ends on three visible cut surfaces.
    const cutMat=this.own(new THREE.MeshStandardMaterial({
      vertexColors:true,side:THREE.DoubleSide,roughness:1,metalness:0
    }));
    this.crossSections={};
    for(const side of ['left','right']){
      const sign=side==='right'?1:-1;
      for(const kind of ['head','tail','fore']){
        const cut=laminatedCutGeometry(w,h,sign,kind,cutMat);
        this.crossSections[side+'_'+kind]=cut;
        (sign===1?this.rightPivot:this.leftPivot).add(cut);
      }
    }
    // The casing spine is one narrow continuous piece, not a movable panel.
    this.spineGeometry=spineGeometry(h);
    this.spine=this.add(this.spineGeometry,
      this.own(new THREE.MeshStandardMaterial({
        map:m.spine,roughness:.96,metalness:0,side:THREE.DoubleSide
      }))
    );
    this.spine.castShadow=false;
    // The sewn spine and small contrasting headbands are *inside* the casing.
    this.sewnBack=this.add(new THREE.CylinderGeometry(.028,.028,h-.085,12),
      this.own(plain(0xbcb2a3)),this.root);
    this.sewnBack.castShadow=false;
    this.headbands=[];
    for(const sign of [-1,1]){
      const tube=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,.09,9),
        this.own(plain(0x607984)));
      tube.rotation.z=Math.PI/2;
      tube.castShadow=false;
      tube.position.set(0,sign*(h/2-.04),-t/2+.026);
      this.root.add(tube);
      this.headbands.push(tube);
    }
    // Thin seam between the printed leaves at the gutter, not a fabric flap.
    this.gutterLine=this.add(new THREE.CylinderGeometry(.008,.008,h-.14,8),
      this.own(plain(0xbbb3a4)),this.root);
    this.gutterLine.castShadow=false;
    this.render(0,0,1248,1248,154);
  }
  render(q,spread,sourcePages,printPages,openAngle=154){
    const {w,h,t,board,overhang}=this.dimensions;
    q=clamp(q,0,1);
    const position=clamp(spread*2/Math.max(1,sourcePages),0,1);
    const layerLeft=t*position*q,layerRight=t*(1-position*q);
    // Cover boards form a restrained V; flexible leaves curve independently.
    const pageAngle=(180-clamp(openAngle,105,174))*Math.PI/180;
    const boardAngle=clamp(pageAngle*.20,.026,.155);
    const coverTilt=boardAngle*q;
    const boardDrop=w*Math.sin(coverTilt);
    const pageFan=q*(.13+Math.min(.28,pageAngle*.27));
    const spineSag=clamp(boardDrop*.83,.085,Math.max(.13,t*.35));
    const zBase=-t/2+.008;
    // A rounded sewn spine makes the sheets converge at the inner gutter.
    // The textblock gradually fans out into the full page-stack thickness at
    // the fore edge; this is a curved signature profile, not a solid slab.
    const gutter=t*(.19+.42*Math.abs(1-2*position));
    const zBoard=-t/2-board/2-.009;

    this.backPivot.position.set(GUTTER_GAP*q,0,zBoard);
    // Back cover extends +X; its outer tip drops slightly towards the desk.
    this.backPivot.rotation.y=coverTilt;
    this.frontPivot.position.set(-GUTTER_GAP*q,0,THREE.MathUtils.lerp(t/2+board/2+.009,zBoard,q));
    // Front cover swings to -X but does not carry any part of the spine.
    this.frontPivot.rotation.y=q*(Math.PI-boardAngle);
    this.backPastedown.visible=q>.07;this.frontPastedown.visible=q>.07;

    for(const side of ['left','right']){
      const right=side==='right';
      const pivot=right?this.rightPivot:this.leftPivot;
      const thickness=right?layerRight:layerLeft;
      const stack=right?this.rightStack:this.leftStack;
      const page=right?this.rightPage:this.leftPage;
      const amount=clamp(thickness/(Math.max(.02,t*.30)),0,1);
      const fan=pageFan*amount;
      const drop=boardDrop;
      pivot.position.set((right?1:-1)*GUTTER_GAP*q,0,zBase);
      placeStack(stack.geometry,Math.max(.001,thickness),drop,fan,w,gutter,q);
      placeSheet(page.geometry,Math.max(.001,thickness),drop,fan,w,gutter,q);
      stack.visible=right||((position>0)&&q>.70);
      page.visible=q>.985&&(right||position>0);
      for(const kind of ['head','tail','fore']){
        const cut=this.crossSections[side+'_'+kind];
        cut.visible=stack.visible;
        updateLaminatedCut(cut,Math.max(.001,thickness),drop,fan,gutter,q);
      }
    }

    // The *same* case spine remains narrow and continuous throughout opening.
    // There are no extra side panels, unfolding ribbons, or detachable parts.
    const vert=this.spineGeometry.attributes.position;
    for(let i=0;i<=72;i++){
      const u=i/72,[x,z]=clothSpineCoords(u,q,t,board,spineSag);
      vert.setXYZ(2*i,x,-(h-.045)/2,z);
      vert.setXYZ(2*i+1,x,(h-.045)/2,z);
    }
    vert.needsUpdate=true;this.spineGeometry.computeVertexNormals();
    const mat=this.spine.material;
    const spineMap=q>.88?null:this.materials.spine;
    if(mat.map!==spineMap){
      mat.map=spineMap;mat.color.set(q>.88?0xdcd5c7:0xffffff);mat.needsUpdate=true;
    }
    // Tiny sewn inner spine, visible only as a central crease or endband.
    const gutterZ=zBase+gutter-.018;
    this.gutterLine.position.set(0,0,gutterZ);
    this.gutterLine.visible=q>.985&&position>.01&&position<.99;
    this.sewnBack.position.set(0,0,zBase+.020);
    this.sewnBack.visible=q>.88;
    for(const hb of this.headbands){
      hb.position.z=zBase+.025;
      hb.visible=q>.75;
    }
    // Stand upright in the cover view; recline as one object to open the book.
    this.root.rotation.x=-q*Math.PI/2;
    this.root.position.x=-(1-q)*w/2;
    const boardTip=zBoard-boardDrop-board*.7;
    const spineBottom=zBoard-spineSag-.019;
    const low=Math.min(boardTip,spineBottom);
    const floor=-h/2-overhang-.020;
    this.root.position.y=q*(floor-low);
    this.root.position.z=0;
    this.last={q,spread,position,layerLeft,layerRight,boardAngle,boardDrop,pageAngle,spineSag,spineBottom,boardTip};
    return this.last;
  }
  pageSurface(side,spread,sourcePages,u){
    const {w,t}=this.dimensions;
    const fraction=clamp(spread*2/Math.max(1,sourcePages),0,1);
    const thick=t*(side==='left'?fraction:1-fraction);
    const gutter=t*(.19+.42*Math.abs(1-2*fraction));
    const angle=this.last?.pageAngle??((180-154)*Math.PI/180);
    const boardAngle=clamp(angle*.20,.026,.155);
    const drop=w*Math.sin(boardAngle);
    const fan=(.13+Math.min(.28,angle*.27))*clamp(thick/Math.max(.02,t*.30),0,1);
    return -t/2+.008+fanHeight(u,1,thick,drop,fan,gutter,1);
  }
  getTop(side,spread,sourcePages){
    return this.pageSurface(side,spread,sourcePages,0);
  }
  dispose(){
    this.root.traverse(o=>{if(o.geometry)o.geometry.dispose();});
    for(const mat of this.materialsOwned){
      if(mat===this.frontPastedown.material && mat.map)mat.map.dispose();
      mat.dispose();
    }
    this.root.clear();
  }
}
