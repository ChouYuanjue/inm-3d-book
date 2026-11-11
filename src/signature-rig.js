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

export class SignatureRig {
  constructor(d,sourcePages,spread,q,openAngle,printPages=sourcePages) {
    this.d=d;
    this.sourceTotal=Math.max(1,Math.ceil(sourcePages/2));
    this.total=Math.max(1,Math.ceil(printPages/2));
    this.sheetsPerSignature=LEAVES_PER_SIGNATURE;
    this.count=Math.ceil(this.total/LEAVES_PER_SIGNATURE);
    this.split=clamp(Math.round(spread/this.sourceTotal*this.total),0,this.total);
    this.position=this.split/this.total;
    this.q=clamp(q,0,1);
    this.openAngle=clamp(openAngle,90,145);
    this.caliper=d.t/this.total;
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
    const bias=(.5-this.position)*.15;
    this.leftTilt=clamp(halfOpening+bias,.18,1.10);
    this.rightTilt=clamp(halfOpening-bias,.18,1.10);
    this.boardTilt=halfOpening;
    this.outerRiseLeft=(d.w-.08)*Math.sin(this.leftTilt);
    this.outerRiseRight=(d.w-.08)*Math.sin(this.rightTilt);
    this.outerDrop=0;
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
    const cz=t*(.5-s);
    // OPEN: bend around a moving neutral arc, not a common zero-thickness
    // hinge. Early pages lean to the right, late pages lean to the left.
    const phase=this.angularSpread*(s-this.position);
    const ox=this.radius*Math.sin(phase);
    // The TEXTBLOCK spine throws UP into an arch as a sewn book opens;
    // it must not sag down into the case's U. The sewn folds distribute
    // across this concave (when viewed from the open book) back arc.
    // Book Conservation literature calls this the "throw-up" of the spine.
    const rise=.54+.12*Math.sin(pi*this.position);
    const oz=this.spineBase+this.radius*rise*Math.cos(phase);
    return {
      x:lerp(cx,ox,this.q),
      z:lerp(cz,oz,this.q),
      closedX:cx,closedZ:cz,openX:ox,openZ:oz
    };
  }
  hingeForLeaf(leaf){
    return this.hingeAtFraction((clamp(leaf,0,this.total-1)+.5)/this.total);
  }
  hingeForSignature(sig){
    return this.hingeAtFraction((sig+.5)*LEAVES_PER_SIGNATURE/this.total);
  }
  spinePoint(s){
    const h=this.hingeAtFraction(s);
    const outwardClosed=.047+.013*Math.sin(pi*s);
    // The independent HOLLOW CASE back stays low and curves in the
    // opposite direction. The gap below the raised textblock is real space
    // between two different surfaces, not a zero-thickness wedge.
    const phase=this.angularSpread*(s-this.position);
    const hollowZ=this.spineBase-.057+
      this.radius*.40*(1-Math.cos(phase));
    return {
      x:lerp(h.closedX-outwardClosed,h.openX,this.q),
      z:lerp(h.closedZ,hollowZ,this.q)
    };
  }
  /** x,y,z surface location for a *physical* sheet, in book coordinates. */
  sheetPoint(leaf,side,u,v=0.5){
    const {w,h,t}=this.d;
    const idx=clamp(leaf,0,this.total-1);
    const p=this.hingeForLeaf(idx);
    const U=clamp(u,0,1),V=clamp(v,0,1);
    // A right stack is indexed from its top toward the bottom. The left
    // stack is indexed from its bottom toward its top.
    const layer=side==='left'?idx+.5:this.total-idx-.5;
    const rising=side==='left'?this.outerRiseLeft:this.outerRiseRight;
    // The fore-edge is raised by the physical board V-angle, with the
    // signature's own leaf-stack thickness preserved. The previous sign
    // error dropped the outer edge and fabricated knife-shaped wedges.
    const openForeZ=-t/2+layer*this.caliper+rising;
    const closedForeZ=t/2-(idx+.5)*this.caliper;
    const closedX=lerp(p.closedX,w-.018,U);
    const openX=lerp(p.openX,(side==='left'?-1:1)*(w-.018),U);
    // Curvature starts steeply beside each section's sewing fold, gradually
    // relaxes outward. The root NEVER loses the signatures' thickness.
    // Finite slope at BOTH ends: the old pow(U,.63) had an infinite
    // derivative at the sewn fold and produced the visible sharp cusp.
    // This rounded shoulder unwinds into a gently inclined outer leaf.
    // A thick sewn signature cannot make a knife-edge at the gutter.
    // A cubic shoulder and a quadratic fore-edge term give zero first
    // derivative at the fold and a finite tilted tangent at the free edge.
    const smoothShoulder=U*U*(3-2*U);
    const bend=.58*smoothShoulder+.42*U*U;
    const bow=Math.sin(pi*U)*(0.006+
      0.004*Math.cos(idx*.24))*Math.sin(V*pi);
    const localRoll=.024*Math.sin(pi*U)**2*
      (1-.35*Math.abs(this.position-.5));
    const openZ=lerp(p.openZ,openForeZ,bend)+bow+localRoll;
    const closedZ=lerp(p.closedZ,closedForeZ,U);
    const y=(V-.5)*(h-.072);
    const irregularity=this.q*.0012*Math.sin(idx*.87+V*13)*Math.sin(pi*U);
    return {
      x:lerp(closedX,openX,this.q)+irregularity*U,
      y,z:lerp(closedZ,openZ,this.q)
    };
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
      gutterSafeFraction:this.gutterSafeFraction,
      signatureInMiddle:{
        left:this.signatureBounds(middle,'left'),
        right:this.signatureBounds(middle,'right')
      },
      rootThickness:this.spineFoldThickness(middle,'right')
    };
  }
}
