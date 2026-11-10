import * as THREE from 'three';

/**
 * Parametric case-bound, hollow-back hardcover.
 *
 * Axis convention for the book in its own local frame:
 *   X: fore edges, spine and gutter at x=0
 *   Y: spine length (head/tail)
 *   Z: paper thickness, positive toward the front board
 *
 * Opening switches the volume from upright to lying on the desk. Each board
 * pivots on a different joint; the book block turns into two fanned stacks,
 * paper enters a rounded gutter, and the case spine opens into a hanging
 * hollow-back cloth strip under the sewn spine of the text block.
 *
 * This is a plausible visual model of case-bound hardcover mechanics,
 * not a manufacturing-grade finite-element simulation.
 */
const sq = n => n*n;
const clamp = (n,a,b)=>Math.max(a,Math.min(b,n));
export function topProfile(u){
  return 1-0.185*Math.exp(-u*12.5)-0.012*sq(Math.sin(Math.PI*u));
}
function bottomProfile(u){
  return 0.145*Math.exp(-u*11.5);
}
function makePlain(color, other={}){
  return new THREE.MeshStandardMaterial({color,roughness:1,metalness:0,...other});
}

function curvedStackGeometry(w,h,side){
  // Cross-section has an upward-curving underside at the binding, so there is
  // no rectangular slab in the gutter. Extrude this section along the spine.
  const shape=new THREE.Shape(), margin=.043, N=44, wEnd=w-.07;
  for(let i=0;i<=N;i++){
    const x=margin+(wEnd-margin)*i/N, u=x/w;
    const pos=side*x,z=bottomProfile(u);
    if(i===0)shape.moveTo(pos,z);else shape.lineTo(pos,z);
  }
  for(let i=N;i>=0;i--){
    const x=margin+(wEnd-margin)*i/N,u=x/w;
    shape.lineTo(side*x,topProfile(u));
  }
  shape.closePath();
  const geo=new THREE.ExtrudeGeometry(shape,{
    steps:1,depth:h-.085,bevelEnabled:false,curveSegments:5
  });
  // Extrusion XY -> real world XZ; its extruded depth becomes -Y.
  geo.rotateX(Math.PI/2);
  geo.translate(0,(h-.085)/2,0);
  return geo;
}
function pageGeometry(w,h,side){
  const geo=new THREE.PlaneGeometry(w-.135,h-.14,36,8);
  geo.translate(side*w/2,0,0);
  const pos=geo.attributes.position;
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),y=pos.getY(i);
    const u=clamp(Math.abs(x)/w,0,1);
    const yFract=clamp((y/h+.5),0,1);
    // Keep the printed sheet entirely above the book-block skin. Allowing a
    // negative micro-bow made the paper intersect the block in gray blotches.
    const arch=.008*Math.sin(Math.PI*u)*(0.5+0.5*Math.cos(yFract*Math.PI*2));
    pos.setZ(i,topProfile(u)+arch);
  }
  pos.needsUpdate=true;geo.computeVertexNormals();
  return geo;
}
function endpaperTexture(){
  const c=document.createElement('canvas');c.width=512;c.height=750;
  const ctx=c.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,512,750);
  grad.addColorStop(0,'#eee9df');grad.addColorStop(1,'#dcd9cd');
  ctx.fillStyle=grad;ctx.fillRect(0,0,512,750);
  for(let i=0;i<160;i++){
    ctx.strokeStyle='rgba(70,77,75,.032)';
    ctx.lineWidth=.4;
    const y=(i*21.345)%750;
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y+3);ctx.stroke();
  }
  ctx.strokeStyle='rgba(70,101,109,.24)';ctx.lineWidth=1.5;
  ctx.strokeRect(24,22,464,706);
  const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;
  return tex;
}

function layerLines(w,h,side,material){
  const n=78,vertices=new Float32Array(n*2*3);
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(vertices,3));
  const line=new THREE.LineSegments(geo,material);
  line.userData.segments=n;
  line.userData.side=side;
  line.userData.w=w;line.userData.h=h;
  return line;
}
function refreshLayerLines(line,thick){
  const pos=line.geometry.attributes.position.array;
  const n=line.userData.segments;
  for(let i=0;i<n;i++){
    const z=.014+thick*(i+.48)/n;
    const x=line.userData.side*(line.userData.w-.065);
    const head=(line.userData.h-.11)*.5;
    pos[i*6]=x;pos[i*6+1]=-head;pos[i*6+2]=z;
    pos[i*6+3]=x;pos[i*6+4]=head;pos[i*6+5]=z;
  }
  line.geometry.attributes.position.needsUpdate=true;
}

function signatureCutLines(w,h,side,head,material){
  // View the head/tail of a real thick book: these are many slightly curved,
  // tightly layered sheet edges, not a single flat opaque wall.
  const nSheets=84,steps=41,vertices=[];
  const hFace=(h-.085)/2;
  const y=(head?1:-1)*(hFace+.0025);
  const xMin=.043,xMax=w-.07;
  for(let j=1;j<=nSheets;j++){
    const frac=j/(nSheets+1);
    const a=0.5+0.5*Math.sin(j*12.9898)*Math.cos(j*17.173);
    for(let i=0;i<steps;i++){
      const toPoint=(k)=>{
        const x=xMin+(xMax-xMin)*k/steps,u=x/w;
        const below=bottomProfile(u),above=topProfile(u);
        const z=below+(above-below)*frac+.0005*a;
        return [side*x,y,z];
      };
      vertices.push(...toPoint(i),...toPoint(i+1));
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  const lines=new THREE.LineSegments(geo,material);
  lines.renderOrder=2;
  return lines;
}
function spineMaterial(spineTexture){
  return new THREE.MeshStandardMaterial({
    map:spineTexture,roughness:.93,metalness:0,side:THREE.DoubleSide
  });
}
function dynamicSpineGeometry(h){
  const segs=44;
  const arr=new Float32Array((segs+1)*2*3);
  const uv=new Float32Array((segs+1)*2*2);
  const indices=[];
  for(let i=0;i<=segs;i++){
    const u=i/segs;
    uv[i*4]=u;uv[i*4+1]=0;
    uv[i*4+2]=u;uv[i*4+3]=1;
    if(i<segs){
      const a=i*2;
      indices.push(a,a+1,a+2,a+2,a+1,a+3);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(arr,3));
  geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}
function spineCoords(u,q,d,openAngle=154){
  const {t,board}=d;
  // CLOSED: convex outside of the vertical spine, wide along Z (thickness).
  const closedX=-.077-Math.min(.16,t*.20)*Math.sin(Math.PI*u);
  const closedZ=(u-.5)*(t+board*2);
  // OPEN: loose case spine arches below the book block, between its boards.
  // This is a hollow-back: there is visible air between the case and signatures.
  const spread=(clamp(openAngle,105,174)-105)/69;
  // A tighter opening curls the cloth deeper; near-flat opening widens it.
  const wing=Math.max(.11,Math.min(.23,t*.29))*(.76+.33*spread);
  const sag=(t*.23+.038)*(1.20-.33*spread);
  const openX=(u*2-1)*wing;
  const openZ=-t/2-board-.015-sag*Math.sin(Math.PI*u);
  return {
    x:closedX*(1-q)+openX*q,
    z:closedZ*(1-q)+openZ*q
  };
}

export class HardcoverMechanics {
  constructor({root,materials,dimensions}){
    this.root=root;
    this.materials=materials;
    this.dimensions=dimensions;
    this.owned=[];
    this.build();
  }
  add(geom,mat,parent){
    const mesh=new THREE.Mesh(geom,mat);
    mesh.castShadow=true;mesh.receiveShadow=true;
    parent.add(mesh);return mesh;
  }
  own(material){this.owned.push(material);return material;}
  build(){
    const {w,h,t,board,overhang}=this.dimensions;
    const m=this.materials;
    // Back board is the fixed right-hand case panel. The offset between the
    // board and the cloth spine makes the joint visible when opened.
    this.backPivot=new THREE.Group();
    this.backPivot.position.set(.055,0,-t/2-board/2-.008);
    this.root.add(this.backPivot);
    this.backBoard=this.add(
      new THREE.BoxGeometry(w+overhang*2,h+overhang*2,board),
      [m.cloth,m.cloth,m.cloth,m.cloth,m.cloth,m.back],
      this.backPivot
    );
    this.backBoard.position.x=(w+overhang)/2;
    this.backPastedown=this.add(
      new THREE.PlaneGeometry(w-.09,h-.09),
      this.own(new THREE.MeshStandardMaterial({map:endpaperTexture(),roughness:1,side:THREE.DoubleSide})),
      this.backPivot
    );
    this.backPastedown.position.set(w/2,0,board/2+.0009);
    this.backPastedown.castShadow=false;

    // Front case turns over the hollow-back attachment and rests to the LEFT.
    this.frontPivot=new THREE.Group();
    this.root.add(this.frontPivot);
    this.frontBoard=this.add(
      new THREE.BoxGeometry(w+overhang*2,h+overhang*2,board),
      [m.cloth,m.cloth,m.cloth,m.cloth,m.front,m.cloth],
      this.frontPivot
    );
    this.frontBoard.position.x=(w+overhang)/2;
    this.frontPastedown=this.add(
      new THREE.PlaneGeometry(w-.09,h-.09),
      this.backPastedown.material,
      this.frontPivot
    );
    this.frontPastedown.position.set(w/2,0,-board/2-.001);
    this.frontPastedown.castShadow=false;

    this.rightPivot=new THREE.Group();
    this.leftPivot=new THREE.Group();
    this.root.add(this.rightPivot,this.leftPivot);

    // Signature blocks have rounded gutter edges and curved interior.
    this.blockMaterial=this.own(new THREE.MeshStandardMaterial({
      map:m.edge,color:0xf8f7f2,roughness:1,metalness:0,
      side:THREE.DoubleSide
    }));
    this.rightStack=this.add(curvedStackGeometry(w,h,1),this.blockMaterial,this.rightPivot);
    this.leftStack=this.add(curvedStackGeometry(w,h,-1),this.blockMaterial,this.leftPivot);

    this.rightPage=this.add(
      pageGeometry(w,h,1),
      this.own(new THREE.MeshStandardMaterial({
        map:m.placeholder,side:THREE.DoubleSide,roughness:1,metalness:0
      })),
      this.rightPivot
    );
    this.leftPage=this.add(
      pageGeometry(w,h,-1),
      this.own(new THREE.MeshStandardMaterial({
        map:m.placeholder,side:THREE.DoubleSide,roughness:1,metalness:0
      })),
      this.leftPivot
    );
    this.rightPage.userData.ownedMaterial=false;
    this.leftPage.userData.ownedMaterial=false;
    this.rightPage.position.z=.012;
    this.leftPage.position.z=.012;
    this.leftPage.castShadow=false;this.rightPage.castShadow=false;
    this.rightPage.renderOrder=3;this.leftPage.renderOrder=3;

    this.foreEdgeLineMaterial=this.own(new THREE.LineBasicMaterial({
      color:0x8a8376,transparent:true,opacity:.39,depthWrite:false
    }));
    this.rightGrain=layerLines(w,h,1,this.foreEdgeLineMaterial);
    this.leftGrain=layerLines(w,h,-1,this.foreEdgeLineMaterial);
    this.rightPivot.add(this.rightGrain);
    this.leftPivot.add(this.leftGrain);
    this.cutLinesMaterial=this.own(new THREE.LineBasicMaterial({
      color:0x8a8275,transparent:true,opacity:.42,depthWrite:false
    }));
    this.rightHead=signatureCutLines(w,h,1,true,this.cutLinesMaterial);
    this.rightTail=signatureCutLines(w,h,1,false,this.cutLinesMaterial);
    this.leftHead=signatureCutLines(w,h,-1,true,this.cutLinesMaterial);
    this.leftTail=signatureCutLines(w,h,-1,false,this.cutLinesMaterial);
    this.rightPivot.add(this.rightHead,this.rightTail);
    this.leftPivot.add(this.leftHead,this.leftTail);

    // Actual case spine: one flexible cloth surface (NOT a rectangular stick).
    this.spineGeometry=dynamicSpineGeometry(h);
    this.spine=this.add(this.spineGeometry,spineMaterial(m.spine),this.root);
    this.spine.castShadow=false;
    // Sewn signature liner, visible in the gutter above the hanging case.
    this.liner=this.add(
      new THREE.CylinderGeometry(.025,.025,h-.07,12),
      this.own(makePlain(0xcac2b2)),
      this.root
    );
    this.liner.position.set(0,0,-t/2+.057);
    this.liner.castShadow=false;
    // Bookcloth strips covering the hinge joints near the outside boards.
    this.jointMaterial=this.own(makePlain(0xb5aea0,{side:THREE.DoubleSide}));
    this.leftJoint=this.add(new THREE.PlaneGeometry(.078,h-.035),this.jointMaterial,this.root);
    this.rightJoint=this.add(new THREE.PlaneGeometry(.078,h-.035),this.jointMaterial,this.root);
    this.leftJoint.castShadow=false;this.rightJoint.castShadow=false;

    this.headBandMat=this.own(new THREE.LineBasicMaterial({color:0x516779,transparent:true,opacity:.9}));
    this.headBandTop=new THREE.Line(new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(new Float32Array(45*3),3)),this.headBandMat);
    this.headBandBottom=new THREE.Line(new THREE.BufferGeometry().setAttribute('position',
      new THREE.Float32BufferAttribute(new Float32Array(45*3),3)),this.headBandMat);
    this.root.add(this.headBandTop,this.headBandBottom);
    this.render(0,0,1,1248,154);
  }

  render(q,spread,sourcePages,printPages,openAngle=154){
    const d=this.dimensions,{w,h,t,board,overhang}=d;
    q=clamp(q,0,1);
    const turn=clamp(spread*2/Math.max(sourcePages,1),0,1);
    const left=t*turn,right=t*(1-turn);
    // Heavily bound volumes do not flatten to a 180-degree plane naturally.
    const theta=THREE.MathUtils.degToRad((180-clamp(openAngle,105,174))/2);
    this.bookOpenAngle=openAngle;

    this.backPivot.rotation.y=-theta*q;
    this.frontPivot.rotation.y=-(Math.PI-theta)*q;
    this.frontPivot.position.set(-.055*q,0,(t/2+board/2+.008)*(1-q)+(-t/2-board/2-.008)*q);
    this.rightPivot.rotation.y=-theta*q;
    this.leftPivot.rotation.y=theta*q;
    this.rightPivot.position.z=-t/2;
    this.leftPivot.position.z=-t/2;

    const layerR=Math.max(.002,q?right:t), layerL=Math.max(.002,left);
    this.rightStack.scale.z=layerR;
    this.leftStack.scale.z=layerL;
    this.rightPage.scale.z=layerR;
    this.leftPage.scale.z=layerL;
    refreshLayerLines(this.rightGrain,layerR);
    refreshLayerLines(this.leftGrain,layerL);
    this.rightHead.scale.z=layerR;this.rightTail.scale.z=layerR;
    this.leftHead.scale.z=layerL;this.leftTail.scale.z=layerL;
    // Right stack stays visible in closed book; left stack is created by actual
    // turned signatures, not another giant block permanently floating left.
    this.leftStack.visible=q>.88&&spread>0;
    this.leftGrain.visible=this.leftStack.visible;
    this.leftHead.visible=this.leftStack.visible;
    this.leftTail.visible=this.leftStack.visible;
    this.leftPage.visible=q>.98&&spread>0;
    this.rightPage.visible=q>.98;
    this.rightGrain.visible=true;
    this.frontPastedown.visible=q>.08;
    this.backPastedown.visible=q>.08;

    // Change from standing in a product mockup to reading on a desk.
    this.root.rotation.x=-(Math.PI/2)*q;
    this.root.position.x=-w/2*(1-q);
    const floor=-h/2-overhang-.02;
    const angleFraction=(clamp(openAngle,105,174)-105)/69;
    const sag=(t*.23+.038)*(1.20-.33*angleFraction);
    const lowZ=-t/2-board-.015-sag;
    this.root.position.y=q*(floor-lowZ);
    this.root.position.z=0;
    // Opened spine has an actual hollow between bookblock and exterior cloth.
    const pos=this.spineGeometry.attributes.position;
    for(let i=0;i<=44;i++){
      const u=i/44,point=spineCoords(u,q,d,openAngle);
      pos.setXYZ(i*2,point.x,-h/2-overhang,point.z);
      pos.setXYZ(i*2+1,point.x,h/2+overhang,point.z);
    }
    pos.needsUpdate=true;
    this.spineGeometry.computeVertexNormals();
    // The exposed surface inside the hollow-back case is plain cloth.
    // Exterior spine lettering is on the other side while the book is open.
    const caseMaterial=this.spine.material;
    const visibleMap=q>.84?null:this.materials.spine;
    if(caseMaterial.map!==visibleMap){
      caseMaterial.map=visibleMap;
      caseMaterial.color.set(q>.84?0xe8e1d3:0xffffff);
      caseMaterial.needsUpdate=true;
    }

    const linerZ= -t/2+.057 + q*Math.min(t*.14,.11);
    this.liner.position.set(0,0,linerZ);
    this.liner.visible=q>.75;

    // Moving cloth joints sit between the boards and the case spine.
    // The French joints remain attached to the case in both states.
    // One follows the turning front board; the other follows the back board.
    this.leftJoint.position.set(-.045,0,(t/2+board/2+.003)*(1-q)+(-t/2-board/2-.004)*q);
    this.rightJoint.position.set(.035,0,-t/2-board/2-.004);
    this.leftJoint.rotation.y=-(Math.PI-theta)*q;
    this.rightJoint.rotation.y=-theta*q;
    this.leftJoint.visible=true;
    this.rightJoint.visible=true;

    // Subtle blue headband at head and tail of the hollow case spine.
    for(const [band,sign] of [[this.headBandTop,1],[this.headBandBottom,-1]]){
      const buf=band.geometry.attributes.position;
      for(let i=0;i<=44;i++){
        const u=i/44,p=spineCoords(u,q,d,openAngle);
        buf.setXYZ(i,p.x,(h/2+overhang)*sign,p.z+.008);
      }
      buf.needsUpdate=true;
    }
    return {left,right,theta};
  }
  getTop(side,spread,sourcePages) {
    const t=this.dimensions.t;
    const left=t*clamp(spread*2/Math.max(1,sourcePages),0,1);
    const right=t-left;
    const thickness=side==='left'?left:right;
    return -t/2+thickness*topProfile(0);
  }
  dispose(){
    this.root.traverse(obj=>{
      if(obj.geometry)obj.geometry.dispose();
    });
    // The page maps belong to the shared PDF texture cache, not to a model
    // instance. Rebuilding geometry must never invalidate cached PDF pages.
    for(const mat of this.owned){
      if(mat===this.backPastedown.material && mat.map)mat.map.dispose();
      mat.dispose();
    }
    this.spine.material.dispose();
    this.headBandMat.dispose();
    this.root.clear();
  }
}
