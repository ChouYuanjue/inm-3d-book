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
    const supportedOpenZ=cz*Math.cos(pi*this.position);
    // OPEN: bend around a moving neutral arc, not a common zero-thickness
    // hinge. Early pages lean to the right, late pages lean to the left.
    const phase=this.angularSpread*(s-this.position);
    const fullyOpenX=this.radius*Math.sin(phase);
    // The TEXTBLOCK spine throws UP into an arch as a sewn book opens;
    // it must not sag down into the case's U. The sewn folds distribute
    // across this concave (when viewed from the open book) back arc.
    // Book Conservation literature calls this the "throw-up" of the spine.
    const rise=.54+.12*Math.sin(pi*this.position);
    const fullyOpenZ=this.spineBase+this.radius*rise*Math.cos(phase);
    // Opening ONE page does not move all 39 gatherings into an open U.
    // The spine stays nearly in its closed cross-sectional configuration
    // near the covers; a pronounced throw-up emerges near the middle.
    const ox=lerp(cx,fullyOpenX,this.spineEngagement);
    const oz=lerp(supportedOpenZ,fullyOpenZ,this.spineEngagement);
    // Near the last pages the closed and supported-open stacks have
    // opposite front-to-back orders. Interpolating those coordinates
    // directly flattens the entire back to a line halfway through the
    // opening. Sweep its thickness around the hinge instead.
    const roll=pi*this.position*this.q;
    const turnX=-cz*Math.sin(roll)*(1-this.spineEngagement);
    return {
      x:lerp(cx,ox,this.q)+turnX,
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
    s=clamp(s,0,1);
    const roll=pi*this.position*this.q;
    const normalX=-Math.cos(roll),normalZ=-Math.sin(roll);
    // The exterior case bridges its two attachment ends independently
    // of the inward arch of the sewn paper. Transport its convex belly
    // with the case as the book rolls, including the final few leaves.
    const left=this.hingeAtFraction(0),right=this.hingeAtFraction(1);
    const belly=(this.d.t*(.16+.10*this.spineEngagement*this.q)+.013)*Math.sin(pi*s);
    const offset=.047+belly;
    return {
      x:lerp(left.x,right.x,s)+normalX*offset,
      z:lerp(left.z,right.z,s)+normalZ*offset
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
    const boardSupport=side==='left'?this.leftSupportOffset:this.rightSupportOffset;
    let openRootZ=p.openZ;
    let openForeZ=-t/2+layer*this.caliper+rising+boardSupport;
    const closedForeZ=t/2-(idx+.5)*this.caliper;
    const closedX=lerp(p.closedX,w-.018,U);
    // Page width is projected into the V of its supporting cover.
    // Previously the cover rotated but the paper extended horizontally
    // at FULL width, so the board cut THROUGH the page near its center.
    const projection=Math.cos(side==='left'?this.leftTilt:this.rightTilt);
    const sign=side==='left'?-1:1;
    const foreX=sign*(w-.018)*projection;
    const openX=lerp(p.openX,foreX,U);
    const stackLeaves=side==='left'?this.split:this.total-this.split;
    if(stackLeaves<64){
      // A nearly straight thin pile must rest ON its tilted board.
      const anchor=this.getBoardAnchor(side);
      const tilt=side==='left'?this.leftTilt:this.rightTilt;
      const planeZ=x=>anchor.z+sign*(x-anchor.x)*Math.tan(tilt)
        +this.d.board/(2*Math.cos(tilt))+layer*this.caliper+.004;
      openRootZ=Math.max(openRootZ,planeZ(p.openX));
      openForeZ=Math.max(openForeZ,planeZ(foreX));
    }
    // A real thick book's paper is steep and curved right at the sewing
    // fold, and relaxes onto the supporting pile across the sheet width.
    // This exponential shoulder has a FINITE positive tangent at U=0,
    // then its tangent falls toward that of the raised cover board.
    // This is a local inward page fold, not a symmetric global U trough.
    // A handful of turned leaves lies almost flat on its cover. Only
    // an appreciable pile develops a pronounced shoulder at the fold.
    const bendEngagement=ease(clamp(stackLeaves/64,0,1));
    const bend=U+.28*bendEngagement*(1-Math.exp(-U/.16))*(1-U);
    // The characteristic page curve is local to EACH leaf near the fold:
    // it rolls IN toward the sewing, then drapes out onto the adjacent
    // paper stack. A heavy stack is nearly a solid block; a thin stack of
    // just-turned pages curls much more freely. This is not a global U.
    const stackFraction=side==='left'?this.position:1-this.position;
    const leafDistance=Math.abs(idx-this.split)/this.total;
    const flexibility=Math.exp(-leafDistance/.20);
    const inwardCurl=(.012+.38*Math.pow(1-stackFraction,1.1)*flexibility)*bendEngagement;
    const curlProfile=Math.sin(pi*U)*Math.pow(1-U,.75);
    const bow=.005*bendEngagement*Math.sin(pi*U)*Math.sin(V*pi)*Math.cos(idx*.28);
    const openZ=lerp(openRootZ,openForeZ,bend)+inwardCurl*curlProfile+bow;
    const closedZ=lerp(p.closedZ,closedForeZ,U);
    const y=(V-.5)*(h-.072);
    const irregularity=this.q*.0012*Math.sin(idx*.87+V*13)*Math.sin(pi*U);
    // Use the same finite-thickness spine roll for each leaf's root;
    // its contribution dies away at the fore-edge (U=1).
    const rootRoll=p.x-lerp(p.closedX,p.openX,this.q);
    return {
      x:lerp(closedX,openX,this.q)+rootRoll*(1-U)+irregularity*U,
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
