import test from 'node:test';
import assert from 'node:assert/strict';
import {SignatureRig} from '../src/signature-rig.js';
import {TurningLeaf} from '../src/turning-leaf.js';
const dims={w:2.7,h:3.82,t:624*.1*2.7/210,board:2.4*2.7/210,overhang:3.2*2.7/210};
const length=points=>points.slice(1).reduce((sum,p,k)=>sum+Math.hypot(p.x-points[k].x,p.z-points[k].z),0);
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
function model(spread,dir=1,pages=1248){
 const d={...dims,t:dims.t*pages/1248};
 const a=new SignatureRig(d,1248,spread,1,120,pages),b=new SignatureRig(d,1248,spread+dir,1,120,pages);
 return new TurningLeaf({from:a,to:b,fromSide:dir>0?'right':'left',toSide:dir>0?'left':'right',rows:4});
}
test('resting and turning paper retain the same cross-section length',()=>{
 for(const pages of [200,1248,2000])for(const spread of [1,5,30,156,312,619]){
  const m=model(spread,1,pages);
  for(const t of [0,.05,.2,.5,.8,.95,1]){
   const points=m.row(2,t);
   assert.ok(Math.abs(length(points)-(dims.w+.027))<.0005,'the sheet must bend rather than stretch');
   assert.ok(points.every(p=>[p.x,p.y,p.z].every(Number.isFinite)));
  }
 }
});
test('lift-off and landing exactly match the two curved stack surfaces',()=>{
 for(const spread of [0,1,5,30,312,619,623])for(const dir of [1,-1]){
  if(spread+dir<0||spread+dir>624)continue;
  const m=model(spread,dir);
  for(const [t,rig,leaf,side] of [[0,m.from,m.fromLeaf,m.fromSide],[1,m.to,m.toLeaf,m.toSide]]){
   for(const row of [0,2,4]){
    const points=m.row(row,t);
    for(let i=0;i<points.length;i++)assert.ok(distance(points[i],rig.sheetPoint(leaf,side,i/m.columns,row/m.rows))<1e-9);
   }
  }
 }
});
test('forward and backward turns follow the same curved sheet in reverse',()=>{
 for(const spread of [0,5,30,312,619]){
  const forward=model(spread),backward=model(spread+1,-1);
  for(const t of [.1,.3,.5,.7,.9]){
   const a=forward.row(2,t),b=backward.row(2,1-t);
   a.forEach((p,i)=>assert.ok(distance(p,b[i])<1e-8));
  }
 }
});
test('the lifted sheet has a distributed bend instead of a rigid vertical blade',()=>{
 const m=model(5),points=m.row(2,.5),a=points[0],b=points.at(-1);
 const span=Math.hypot(b.x-a.x,b.z-a.z);
 const deviation=Math.max(...points.map(p=>Math.abs((p.x-a.x)*(b.z-a.z)-(p.z-a.z)*(b.x-a.x))/span));
 assert.ok(deviation>.035,'the turn needs curvature across the width');
 assert.ok(points.at(-1).z>a.z+1.5,'the free edge lifts clear of the supporting stack');
});
test('unturned heavy stacks keep a curved fore-edge through fractional page transfers',()=>{
 for(const spread of [.1,.3,.5,.8,5.2,30.5]){
  const rig=new SignatureRig(dims,1248,spread,1,120);
  const outer=rig.sheetPoint(rig.total-1,'right',1,.5),middle=rig.sheetPoint(rig.total/2,'right',1,.5);
  assert.ok(outer.x-middle.x>.035,'the fore-edge is a curved section, not a rectangular extrusion');
 }
});

test('turning sheet clears the curved stationary reading surfaces away from the sewing',()=>{
 for(const spread of [1,5,30,156,312,619]){
  const m=model(spread);
  for(const t of [.05,.15,.3,.5,.7,.85,.95]){
   const points=m.row(2,t);
   for(const side of ['left','right']){
    const ia=m.from.visibleLeaf(side),ib=m.to.visibleLeaf(side);
    if(ia===null||ib===null)continue;
    const surface=u=>{
      const a=m.from.sheetPoint(ia,side,u,.5),b=m.to.sheetPoint(ib,side,u,.5);
      return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t};
    };
    const a=surface(0),b=surface(1);
    for(let k=4;k<=m.columns;k++){
      const p=points[k];
      if(p.x<Math.min(a.x,b.x)||p.x>Math.max(a.x,b.x))continue;
      let lo=0,hi=1;
      for(let j=0;j<22;j++){
        const mid=(lo+hi)/2,s=surface(mid);
        if((b.x>a.x)===(s.x<p.x))lo=mid;else hi=mid;
      }
      const below=surface((lo+hi)/2);
      assert.ok(p.z+.004>=below.z+.0035-1e-4,'flying leaf must not pass through resting pile: spread='+spread+' t='+t+' u='+k/m.columns);
    }
   }
  }
 }
});
