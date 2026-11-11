/**
 * Sewn signature kinematics for one complete physical volume.
 *
 * A real textblock consists of nested, sewn gatherings. This approximation
 * models 16 folded leaves per signature (32 printed pages). Every signature
 * has its OWN hinge position on a shared back curve. The back is convex when
 * shut; opening redistributes the hinges over a curved arc whose center of
 * flexion follows the current page split.
 *
 * No cross-section is forced to zero at a single common gutter.
 */
export const LEAVES_PER_SIGNATURE = 16;

const pi = Math.PI;
export const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
export const lerp = (a,b,t) => a+(b-a)*t;
export const ease = t => t*t*(3-2*t);

/**
 * Opening the front board of a left-bound Western book: its free edge
 * passes in FRONT of the closed pages, then rests to their left. Positive
 * Y would produce the same end orientation after a full turn, but travel
 * behind the textblock throughout the animation.
 */
export const frontCoverYaw = (q,leftTilt) => -q*(pi-leftTilt);

export class SignatureRig {
  constructor(d,sourcePages,spread,q,openAngle,printPages=sourcePages) {
    this.d=d;
    this.sourceTotal=Math.max(1,Math.ceil(sourcePages/2));
    this.total=Math.max(1,Math.ceil(printPages/2));
    this.sheetsPerSignature=LEAVES_PER_SIGNATURE;
    this.count=Math.ceil(this.total/LEAVES_PER_SIGNATURE);
    const split=spread/this.sourceTotal*this.total;
    this.split=clamp(Number.isInteger(spread)?Math.round(split):split,0,this.total);
    this.position=this.split/this.total;
    this.q=clamp(q,0,1);
    this.openAngle=clamp(openAngle,90,145);
    this.caliper=d.t/this.total;
    this.curves=new Map();
    // Radius describes the spine's backbend, NOT the thickness of a page.
    // The neutral arc moves toward whichever side is carrying more sheets.
    const balance=Math.sin(pi*this.position);
    const angleFactor=1+.13*(this.openAngle-154)/49;
    this.radius=d.t*(.38+.075*balance)*angleFactor;
    this.angularSpread=(1.50+.80*balance)*(0.89+.11*(this.openAngle/154));
    this.spineBase=-d.t/2-d.board*.9-.084;
    // An actual thick casebound volume needs a V-supported opening:
    // the boards cannot lie flat while the textblock remains sewn.
    // Split-dependent asymmetry mirrors the different weight on each side.
    const halfOpening=(180-this.openAngle)*pi/360;
    // Near the first few pages, almost ALL weight remains in the right
    // block. Its board lies nearly horizontal; only the thin left cover
    // and a handful of pages open. The distribution reverses at the end.
    // Middle spreads share the opening between the two boards.
    const totalTilt=2*halfOpening;
    this.leftTilt=clamp(totalTilt*(1-this.position),0,1.55);
    this.rightTilt=clamp(totalTilt*this.position,0,1.55);
    this.spineEngagement=ease(Math.sin(pi*this.position));
    this.boardTilt=halfOpening;
    this.outerRiseLeft=d.w*Math.sin(this.leftTilt);
    this.outerRiseRight=d.w*Math.sin(this.rightTilt);
    this.outerDrop=0;
    // Set the bottom of each stack on its OWN raised cover board. Near
    // page 1 the left stack contains only a few leaves: without this
    // offset those leaves erroneously pass through the front board.
    // The opposite correction happens near the final pages.
    this.leftSupportOffset=Math.max(0,d.t/2+this.spinePoint(0).z)
      +d.board*.42;
    this.rightSupportOffset=Math.max(0,d.t/2+this.spinePoint(1).z)
      +d.board*.42;
    // Reserved curvature near the sewing fold. The actual PDF text is
    // read at full resolution in the inspector, outside this bound area.
    this.gutterSafeFraction=clamp(.075+(180-this.openAngle)/360*.16+
      d.t/d.w*.025,.08,.14);
  }
  signatureBounds(signature,side){
    const start=signature*LEAVES_PER_SIGNATURE;
    const end=Math.min(this.total,start+LEAVES_PER_SIGNATURE);
    if(side==='left'){
      const last=Math.min(end,this.split);
      return {start,end:last,count:Math.max(0,last-start)};
    }
    const first=Math.max(start,this.split);
    return {start:first,end,count:Math.max(0,end-first)};
  }
  hingeAtFraction(s){
    s=clamp(s,0,1);
    const {t}=this.d;
    // CLOSED: convex round-back spine, signatures run from top to bottom
    // along the same outside curvature as the closed exterior cloth case.
    const cx=-.045-t*.16*Math.sin(pi*s);
    // The CLOSED book always has its full back thickness. Multiplying
    // this by cos(pi*pagePosition) previously collapsed the whole spine
    // to a zero-thickness ridge at the middle of the manuscript, which
    // reversed its surface normal during opening and looked like an
    // inward-folding spine. Page position changes the OPEN fan instead.
    const cz=t*(.5-s);
    // Rotate the closed round-back as a complete cross-section. Applying
    // rotation only to its depth used to leave its crown on the wrong
    // side once the reading split passed the midpoint.
    const roll=pi*this.position*this.q;
    const rotatedX=cx*Math.cos(roll)-cz*Math.sin(roll);
    const rotatedZ=cx*Math.sin(roll)+cz*Math.cos(roll);
    const phase=this.angularSpread*(s-this.position);
    const fullyOpenX=this.radius*Math.sin(phase);
    const rise=.24+.06*Math.sin(pi*this.position);
    const fullyOpenZ=this.spineBase+this.radius*rise*Math.cos(phase);
    const engagement=this.spineEngagement*this.q;
    const finalRoll=pi*this.position;
    const openX=lerp(cx*Math.cos(finalRoll)-cz*Math.sin(finalRoll),fullyOpenX,this.spineEngagement);
    const openZ=lerp(cx*Math.sin(finalRoll)+cz*Math.cos(finalRoll),fullyOpenZ,this.spineEngagement);
    return {
      x:lerp(rotatedX,fullyOpenX,engagement),
      z:lerp(rotatedZ,fullyOpenZ,engagement),
      closedX:cx,closedZ:cz,openX,openZ
    };
  }
  hingeForLeaf(leaf){
    return this.hingeAtFraction((clamp(leaf,0,this.total-1)+.5)/this.total);
  }
  hingeForSignature(sig){
    return this.hingeAtFraction((sig+.5)*LEAVES_PER_SIGNATURE/this.total);
  }
  spinePoint(s){
    s=clamp(s,0,1);
    const roll=pi*this.position*this.q;
    const normalX=-Math.cos(roll),normalZ=-Math.sin(roll);
    // The exterior case bridges its two attachment ends independently
    // of the inward arch of the sewn paper. Transport its convex belly
    // with the case as the book rolls, including the final few leaves.
    const left=this.hingeAtFraction(0),right=this.hingeAtFraction(1);
    const belly=(this.d.t*(.16-.095*this.spineEngagement*this.q)+.008)*Math.sin(pi*s);
    const skin=Math.max(.012,Math.min(.032,this.d.board*.9+.006));
    const offset=skin+belly;
    return {
      x:lerp(left.x,right.x,s)+normalX*offset,
      z:lerp(left.z,right.z,s)+normalZ*offset
    };
  }
  openCurve(leaf,side){
    const idx=clamp(leaf,0,this.total-1),key=side+':'+idx;
    if(this.curves.has(key))return this.curves.get(key);
    const p=this.hingeForLeaf(idx),anchor=this.getBoardAnchor(side);
    const tilt=side==='left'?this.leftTilt:this.rightTilt,sign=side==='left'?-1:1;
    const dx=sign*Math.cos(tilt),dz=Math.sin(tilt);
    const nx=-sign*Math.sin(tilt),nz=Math.cos(tilt);
    const count=side==='left'?this.split:this.total-this.split;
    const layer=side==='left'?idx+.5:this.total-idx-.5;
    let rootX=p.x,rootZ=p.openZ;
    const minimum=this.d.board/2+.006;
    if(count<64){
      // The thin pile has a common supported sewing line, with ordered
      // normal offsets. This prevents its lower leaves crossing the face.
      const ref=this.hingeForLeaf(this.visibleLeaf(side)??idx);
      const top=count-.5;
      const refNormal=(ref.x-anchor.x)*nx+(ref.openZ-anchor.z)*nz;
      const base=Math.max(minimum,refNormal-top*this.caliper);
      const desired=base+layer*this.caliper;
      rootX=ref.x+(desired-refNormal)*nx;
      rootZ=ref.openZ+(desired-refNormal)*nz;
    }else{
      const h=(rootX-anchor.x)*nx+(rootZ-anchor.z)*nz;
      if(h<minimum){rootX+=(minimum-h)*nx;rootZ+=(minimum-h)*nz;}
    }
    const h0=(rootX-anchor.x)*nx+(rootZ-anchor.z)*nz;
    const h1=minimum+layer*this.caliper;
    const engagement=ease(clamp(count/64,0,1));
    const distance=Math.abs(idx+.5-this.split)/this.total;
    const fraction=count/this.total;
    const curl=(.012+.25*Math.pow(1-fraction,1.1)*Math.exp(-distance/.20))*engagement;
    const N=96,heights=[],steps=[];
    for(let k=0;k<=N;k++){
      const u=k/N;
      const shoulder=u+.28*engagement*(1-Math.exp(-u/.16))*(1-u);
      heights.push(lerp(h0,h1,shoulder)+curl*Math.sin(pi*u)*Math.pow(1-u,.75));
    }
    const length=this.d.w+.027;
    // Solve projected span, not paper length. The cross-section keeps
    // the same arc length on either stack, whatever its local curvature.
    let lo=0,hi=length,span=length;
    for(let iteration=0;iteration<9;iteration++){
      let sum=0,derivative=0;
      const along=span/N;
      for(let k=1;k<=N;k++){
        const segment=Math.hypot(along,heights[k]-heights[k-1]);
        sum+=segment;derivative+=span/(N*N*Math.max(segment,1e-12));
      }
      const error=sum-length;
      if(Math.abs(error)<1e-8)break;
      if(error>0)hi=span;else lo=span;
      const candidate=span-error/Math.max(derivative,1e-8);
      span=candidate>lo&&candidate<hi?candidate:(lo+hi)/2;
    }
    steps.push(0);
    for(let k=1;k<=N;k++)steps.push(steps[k-1]+Math.hypot(span/N,heights[k]-heights[k-1]));
    const curve={rootX,rootZ,dx,dz,nx,nz,h0,heights,steps,span,length,N};
    this.curves.set(key,curve);return curve;
  }
  /** u follows arc length, so printing and turning share one paper metric. */
  sheetPoint(leaf,side,u,v=.5){
    const idx=clamp(leaf,0,this.total-1),U=clamp(u,0,1),V=clamp(v,0,1);
    const {w,h,t}=this.d,p=this.hingeForLeaf(idx);
    const inset=t*.16*Math.sin(pi*(idx+.5)/this.total);
    const closedX=lerp(p.closedX,w-.018-inset,U);
    const closedForeZ=t/2-(idx+.5)*this.caliper;
    const closedZ=lerp(p.closedZ,closedForeZ,U);
    if(this.q===0)return {x:closedX,y:(V-.5)*(h-.072),z:closedZ};
    const c=this.openCurve(idx,side),target=U*c.steps[c.N];
    let lo=0,hi=c.N;
    while(hi-lo>1){const mid=(lo+hi)>>1;if(c.steps[mid]<target)lo=mid;else hi=mid;}
    const ratio=(target-c.steps[lo])/Math.max(1e-12,c.steps[hi]-c.steps[lo]);
    const along=c.span*(lo+ratio)/c.N;
    const normal=lerp(c.heights[lo],c.heights[hi],ratio)-c.h0;
    const openX=c.rootX+c.dx*along+c.nx*normal;
    const openZ=c.rootZ+c.dz*along+c.nz*normal;
    return {x:lerp(closedX,openX,this.q),y:(V-.5)*(h-.072),z:lerp(closedZ,openZ,this.q)};
  }
  /** True 3D fold thickness of an individual gathering, not a wedge. */
  spineFoldThickness(sig,side){
    const {start,end,count}=this.signatureBounds(sig,side);
    if(count===0)return 0;
    const a=this.hingeForLeaf(start),b=this.hingeForLeaf(end-1);
    return Math.hypot(a.x-b.x,a.z-b.z)+this.caliper;
  }
  visibleLeaf(side){
    const idx=side==='left'?this.split-1:this.split;
    return idx>=0&&idx<this.total?idx:null;
  }
  getBoardAnchor(side){
    const s=side==='left'?0:1;
    const k=this.spinePoint(s);
    const closedZ=(side==='left'?1:-1)*(this.d.t/2+this.d.board/2+.006);
    const openZ=k.z+this.d.board*.72-.014;
    return {
      x:lerp(0,k.x+(side==='left'?-0.017:.017),this.q),
      z:lerp(closedZ,openZ,this.q)
    };
  }
  estimatedLowestPoint(){
    let lowest=Infinity;
    for(let i=0;i<=32;i++){
      const p=this.spinePoint(i/32);
      lowest=Math.min(lowest,p.z);
    }
    const a=this.getBoardAnchor('left'),b=this.getBoardAnchor('right');
    lowest=Math.min(lowest,a.z-this.d.board,b.z-this.d.board);
    return lowest;
  }
  analyze(){
    const middle=Math.floor(this.count/2);
    return {
      signatures:this.count,
      pages:this.total*2,
      split:this.split,
      position:this.position,
      radius:this.radius,
      halfOpening:this.boardTilt,
      coverInclinations:{left:this.leftTilt,right:this.rightTilt},
      spineEngagement:this.spineEngagement,
      supportOffset:{left:this.leftSupportOffset,right:this.rightSupportOffset},
      gutterSafeFraction:this.gutterSafeFraction,
      signatureInMiddle:{
        left:this.signatureBounds(middle,'left'),
        right:this.signatureBounds(middle,'right')
      },
      rootThickness:this.spineFoldThickness(middle,'right')
    };
  }
}
