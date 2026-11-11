import {clamp,lerp} from './signature-rig.js';

// Interpolate orientations along a sampled sheet, then integrate segment
// lengths. Turning does not linearly squash/elongate its cross-section.
export class TurningLeaf {
  constructor({from,to,fromSide,toSide,columns=64,rows=16}){
    this.from=from;this.to=to;this.fromSide=fromSide;this.toSide=toSide;
    this.fromLeaf=from.visibleLeaf(fromSide);
    this.toLeaf=to.visibleLeaf(toSide);
    this.columns=columns;this.rows=rows;this.strips=[];
    this.fromHinge=from.hingeForLeaf(this.fromLeaf);
    this.toHinge=to.hingeForLeaf(this.toLeaf);
    for(let j=0;j<=rows;j++){
      const v=j/rows,a=[],b=[],segments=[];
      for(let i=0;i<=columns;i++){
        a.push(from.sheetPoint(this.fromLeaf,fromSide,i/columns,v));
        b.push(to.sheetPoint(this.toLeaf,toSide,i/columns,v));
      }
      for(let i=0;i<columns;i++){
        const ax=a[i+1].x-a[i].x,az=a[i+1].z-a[i].z;
        const bx=b[i+1].x-b[i].x,bz=b[i+1].z-b[i].z;
        const thetaA=Math.atan2(az,ax);
        let thetaB=Math.atan2(bz,bx);
        while(thetaB-thetaA>Math.PI)thetaB-=Math.PI*2;
        while(thetaB-thetaA<-Math.PI)thetaB+=Math.PI*2;
        segments.push({a:Math.hypot(ax,az),b:Math.hypot(bx,bz),thetaA,thetaB});
      }
      this.strips.push({a,b,segments});
    }
  }
  row(j,amount,rig=null){
    const t=clamp(amount,0,1),strip=this.strips[j],v=j/this.rows;
    if(t===0)return strip.a.map(p=>({...p}));
    if(t===1)return strip.b.map(p=>({...p}));
    const a=strip.a[0],b=strip.b[0];
    let x=lerp(a.x,b.x,t),z=lerp(a.z,b.z,t);
    if(rig){
      const hinge=rig.hingeForLeaf(lerp(this.fromLeaf,this.toLeaf,t));
      x=hinge.x+lerp(a.x-this.fromHinge.x,b.x-this.toHinge.x,t);
      z=hinge.z+lerp(a.z-this.fromHinge.z,b.z-this.toHinge.z,t);
    }
    const y=lerp(a.y,b.y,t),points=[{x,y,z}],lift=Math.sin(Math.PI*t);
    for(let i=0;i<this.columns;i++){
      const u=(i+.5)/this.columns,s=strip.segments[i];
      const flex=lift*Math.sin(Math.PI*u)*(.24+.10*(v-.5));
      const angle=lerp(s.thetaA,s.thetaB,t)+flex;
      const length=lerp(s.a,s.b,t);
      x+=Math.cos(angle)*length;z+=Math.sin(angle)*length;
      points.push({x,y,z});
    }
    return points;
  }
  writePositions(attribute,amount,direction,rig=null){
    const n=this.columns;
    for(let j=0;j<=this.rows;j++){
      const points=this.row(j,amount,rig);
      // PlaneGeometry enumerates its height from +Y to -Y.
      const row=this.rows-j;
      for(let i=0;i<=n;i++){
        const p=points[direction>0?i:n-i];
        attribute.setXYZ(row*(n+1)+i,p.x,p.y,p.z+.004);
      }
    }
    attribute.needsUpdate=true;
  }
}
