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
