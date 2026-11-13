import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {HardcoverMechanics} from '../src/binding.js';
import {frontCoverYaw} from '../src/signature-rig.js';

// Construction uses a canvas only as an image source; no GPU is needed.
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){}})})};
const dims={w:2.7,h:3.82,t:624*.1*2.7/210,board:2.4*2.7/210,overhang:3.2*2.7/210};
function mechanics(){
 const texture=new THREE.Texture(),cloth=new THREE.MeshBasicMaterial();
 return new HardcoverMechanics({root:new THREE.Group(),dimensions:dims,
  materials:{cloth,front:cloth,back:cloth,edge:texture,spine:texture,placeholder:texture}});
}
function assertBoardPose(m){
 const rig=m.rig,axis=new THREE.Vector3(0,1,0);
 const expected=new THREE.Quaternion().setFromAxisAngle(axis,frontCoverYaw(1,rig.leftTilt));
 assert.ok(m.frontPivot.quaternion.angleTo(expected)<1e-7,'front cover must retain its intended full orientation after landing');
 assert.ok(Math.abs(m.frontPivot.rotation.x)<1e-10&&Math.abs(m.frontPivot.rotation.z)<1e-10);
}
test('successive forward and backward turns never alternate the cover orientation',()=>{
 const m=mechanics();
 try{
  for(const angle of [105,120,145])for(const start of [1,5,310,615]){
   m.render(1,start,1248,1248,angle);
   for(const dir of [1,1,1,1,-1,-1,-1,-1]){
    const next=m.last.spread+dir,pose=m.captureTurn(next);
    for(const t of [0,.25,.5,.75,1])m.applyTurn(pose,t);
    m.render(1,next,1248,1248,angle);
    assertBoardPose(m);
   }
  }
 }finally{m.dispose();}
});
test('cover transforms are continuous between animation endpoints and resting poses',()=>{
 const m=mechanics();
 try{
  for(const spread of [0,5,312,619,623])for(const dir of [1,-1]){
   const next=spread+dir;if(next<0||next>624)continue;
   m.render(1,spread,1248,1248,120);
   const pose=m.captureTurn(next);
   for(const [amount,rest] of [[0,spread],[1,next]]){
    m.applyTurn(pose,amount);m.root.updateMatrixWorld(true);
    const matrices=[m.frontBoard,m.backBoard,m.spine].map(x=>x.matrixWorld.clone());
    m.render(1,rest,1248,1248,120);m.root.updateMatrixWorld(true);
    [m.frontBoard,m.backBoard,m.spine].forEach((object,i)=>{
     assert.ok(object.matrixWorld.elements.every((x,k)=>Math.abs(x-matrices[i].elements[k])<1e-10),
      'cover or spine must not jump when the turn commits');
    });
   }
  }
 }finally{m.dispose();}
});
