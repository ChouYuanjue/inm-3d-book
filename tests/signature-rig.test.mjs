import test from 'node:test';
import assert from 'node:assert/strict';
import {SignatureRig,LEAVES_PER_SIGNATURE} from '../src/signature-rig.js';
const dims={w:2.7,h:3.82,t:624*.1*2.7/210,board:2.4*2.7/210,overhang:3.2*2.7/210};

test('1,248 pages make 39 nonzero-thickness sewn gatherings',()=>{
  const r=new SignatureRig(dims,1248,312,1,154);
  assert.equal(r.total,624);
  assert.equal(r.count,39);
  assert.equal(LEAVES_PER_SIGNATURE,16);
  for(let sig=0;sig<r.count;sig++){
    const left=r.signatureBounds(sig,'left');
    const right=r.signatureBounds(sig,'right');
    assert.equal(left.count+right.count,16);
    if(left.count>=2)assert.ok(r.spineFoldThickness(sig,'left')>.001);
    if(right.count>=2)assert.ok(r.spineFoldThickness(sig,'right')>.001);
  }
  assert.equal(r.signatureBounds(19,'left').count,8);
  assert.equal(r.signatureBounds(19,'right').count,8);
});

test('spine curvature changes as the reading point moves',()=>{
  const a=new SignatureRig(dims,1248,0,1,154);
  const b=new SignatureRig(dims,1248,312,1,154);
  const c=new SignatureRig(dims,1248,624,1,154);
  assert.notEqual(a.hingeAtFraction(0).x,b.hingeAtFraction(0).x);
  assert.notEqual(b.hingeAtFraction(1).x,c.hingeAtFraction(1).x);
  assert.notEqual(a.hingeAtFraction(.5).x,b.hingeAtFraction(.5).x);
  assert.notEqual(a.radius,b.radius);
});

test('closed spine follows convex exterior outline',()=>{
  const r=new SignatureRig(dims,1248,0,0,154);
  const a=r.hingeAtFraction(0),b=r.hingeAtFraction(.5),c=r.hingeAtFraction(1);
  assert.ok(b.x<a.x);
  assert.ok(b.x<c.x);
  assert.ok(r.spinePoint(.5).x<b.x);
  assert.ok(a.z>b.z&&b.z>c.z);
});

test('first, middle and last leaf visibility are well-defined',()=>{
  const first=new SignatureRig(dims,1248,0,1,154);
  const middle=new SignatureRig(dims,1248,312,1,154);
  const last=new SignatureRig(dims,1248,624,1,154);
  assert.equal(first.visibleLeaf('left'),null);
  assert.equal(first.visibleLeaf('right'),0);
  assert.equal(middle.visibleLeaf('left'),311);
  assert.equal(middle.visibleLeaf('right'),312);
  assert.equal(last.visibleLeaf('left'),623);
  assert.equal(last.visibleLeaf('right'),null);
});

test('physical page count changes actual signature count and sheet thickness',()=>{
  const a=new SignatureRig(dims,1248,312,1,154,1248);
  const b=new SignatureRig({...dims,t:100*.1*2.7/210},1248,312,1,154,2000);
  assert.equal(a.count,39);
  assert.equal(b.count,63);
  assert.equal(b.total,1000);
  assert.equal(b.split,500);
  assert.ok(b.signatureBounds(62,'left').count>=0);
});

test('paper at the fold has finite gathering thickness for every opening angle',()=>{
  for(const angle of [105,120,154,174]){
    const r=new SignatureRig(dims,1248,312,1,angle);
    const s=19;
    const bound=r.signatureBounds(s,'right');
    const first=r.sheetPoint(bound.start,'right',0,.5);
    const last=r.sheetPoint(bound.end-1,'right',0,.5);
    assert.ok(Math.hypot(first.x-last.x,first.z-last.z)>r.caliper*2);
    for(const u of [0,.02,.1,.3,.6,.9,1]){
      const p=r.sheetPoint(bound.start,'right',u,.5);
      assert.ok([p.x,p.y,p.z].every(Number.isFinite));
    }
  }
});


test('thick book opens as a supported V, with lifted boards on both sides',()=>{
  const rig=new SignatureRig(dims,1248,312,1,120);
  assert.ok(Math.abs(rig.leftTilt-Math.PI/6)<.005);
  assert.ok(Math.abs(rig.rightTilt-Math.PI/6)<.005);
  assert.ok(rig.outerRiseLeft>1.1&&rig.outerRiseRight>1.1);
  assert.ok(rig.gutterSafeFraction>.08&&rig.gutterSafeFraction<.15);
  assert.ok(rig.openAngle<=145);
});

test('sewn textblock arches above, separate hollow case spine droops below',()=>{
  const rig=new SignatureRig(dims,1248,312,1,120);
  const middle=rig.hingeAtFraction(.5).z;
  const left=rig.hingeAtFraction(0).z;
  const right=rig.hingeAtFraction(1).z;
  assert.ok(middle>left&&middle>right);
  const caseCenter=rig.spinePoint(.5).z;
  const caseLeft=rig.spinePoint(0).z;
  const caseRight=rig.spinePoint(1).z;
  assert.ok(caseCenter<caseLeft&&caseCenter<caseRight);
  assert.ok(middle-caseCenter>.12);
});

test('curled page has a finite, non-cusped inward shoulder',()=>{
  const rig=new SignatureRig(dims,1248,312,1,120);
  const at=u=>rig.sheetPoint(312,'right',u,.5);
  const p0=at(0),p1=at(.005),p2=at(.01),p3=at(.20),p4=at(.4),p5=at(1);
  const startSlope=(p1.z-p0.z)/(p1.x-p0.x);
  const nextSlope=(p2.z-p1.z)/(p2.x-p1.x);
  assert.ok(startSlope>.06&&startSlope<3.5,'root has a real inward fold with finite slope');
  assert.ok(Math.abs(nextSlope-startSlope)<.12,'no singular tangent jump');
  assert.ok(p3.z>p2.z&&p4.z>p3.z&&p5.z>p4.z);
});


test('near the first pages the heavy right block stays flat and the small left side curls',()=>{
  const start=new SignatureRig(dims,1248,1,1,120);
  const right=start.sheetPoint(1,'right',.5,.5);
  const outer=start.sheetPoint(1,'right',1,.5);
  assert.ok(Math.abs(right.z-outer.z)<.07,'bulk right block must not become a wedge');
  assert.ok(start.spineEngagement<.001,'the entire spine must stay almost closed');
  assert.ok(start.leftTilt>.95&&start.rightTilt<.02,
     'front board swings up while heavy back board stays horizontal');
  const thin=start.sheetPoint(0,'left',.20,.5);
  const root=start.sheetPoint(0,'left',0,.5);
  const free=start.sheetPoint(0,'left',1,.5);
  const linear=root.z+(free.z-root.z)*.2;
  assert.ok(thin.z>linear+.10,'the first folded-over leaf curls inward');
});

test('last pages mirror the first: heavy left stack is flat',()=>{
  const end=new SignatureRig(dims,1248,623,1,120);
  const left=end.sheetPoint(end.visibleLeaf('left'),'left',.5,.5);
  const outer=end.sheetPoint(end.visibleLeaf('left'),'left',1,.5);
  assert.ok(Math.abs(left.z-outer.z)<.08);
  assert.ok(end.spineEngagement<.001);
  assert.ok(end.leftTilt<.02&&end.rightTilt>.95);
});

test('middle pages engage the whole spine and have inward curved folds',()=>{
  const mid=new SignatureRig(dims,1248,312,1,120);
  const root=mid.sheetPoint(312,'right',0,.5);
  const shoulder=mid.sheetPoint(312,'right',.20,.5);
  const outer=mid.sheetPoint(312,'right',1,.5);
  const linear=root.z+.2*(outer.z-root.z);
  assert.ok(mid.spineEngagement>.99);
  assert.ok(shoulder.z>linear+.10,'page shoulder must roll inward before spreading');
  assert.ok(Math.abs(mid.leftTilt-mid.rightTilt)<.001);
});


test('curled folios follow the raised cover projection instead of intersecting it',()=>{
  const d=dims;
  for(const spread of [1,5,30,312,594,620,623]){
    const rig=new SignatureRig(d,1248,spread,1,120);
    for(const side of ['left','right']){
      const leaf=rig.visibleLeaf(side);
      if(leaf===null)continue;
      const tilt=side==='left'?rig.leftTilt:rig.rightTilt;
      const p=rig.sheetPoint(leaf,side,1,.5);
      const sign=side==='left'?-1:1;
      assert.ok(Math.abs(p.x-sign*(d.w-.018)*Math.cos(tilt))<.0001,
        'folio outer edge must follow the rotated board footprint');
    }
  }
});

test('thin stack sits above the raised front or back board at early and late pages',()=>{
  for(const [spread,side,sheet] of [[5,'left',0],[619,'right',623]]){
    const rig=new SignatureRig(dims,1248,spread,1,120);
    const p=rig.sheetPoint(sheet,side,1,.5);
    const tilt=side==='left'?rig.leftTilt:rig.rightTilt;
    const board=rig.getBoardAnchor(side);
    const boardSurface=board.z+(dims.w-.018)*Math.sin(tilt);
    assert.ok(p.z>boardSurface+.005,'printed paper must not sink into the cover');
  }
});
