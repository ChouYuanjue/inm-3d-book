// Perspective-corrected artwork extracted from the supplied book reference.
const referenceArtwork = {};
await Promise.all(['front','spine'].map(async face => {
  const image = new Image();
  image.src = import.meta.env.BASE_URL + 'reference-' + face + '.jpg';
  await image.decode();
  referenceArtwork[face] = image;
}));
function referenceCanvas(face,width,height) {
  const c=canvas(width,height);
  c.getContext('2d').drawImage(referenceArtwork[face],0,0,width,height);
  return c;
}
function isReference(title,author,ink) {
  return title===DEFAULT_TITLE && author==='Runnel Zhang' && ink==='#07508a';
}
const DEFAULT_TITLE = 'Informal Notes on Mathematics';

function canvas(width, height) {
  const el = document.createElement('canvas');
  el.width = width;
  el.height = height;
  return el;
}
function paper(ctx, width, height) {
  const fill = ctx.createLinearGradient(0, 0, width, height);
  fill.addColorStop(0, '#ebe7dd');
  fill.addColorStop(0.45, '#e8e2d5');
  fill.addColorStop(1, '#ddd7c9');
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, width, height);
  // Fine, low-contrast fibers. Fixed sequence for stable visual results.
  let x = 73119;
  const rand = () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; };
  for (let i=0;i<14500;i++) {
    const px=rand()*width, py=rand()*height;
    const light=rand()>.5;
    ctx.strokeStyle=light ? 'rgba(255,255,255,0.055)' : 'rgba(67,57,35,0.038)';
    ctx.lineWidth=rand()>.62 ? 1.15 : .55;
    ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+rand()*17+2,py+(rand()-.5)*1.1);ctx.stroke();
  }
  const highlight=ctx.createLinearGradient(0,0,width,0);
  highlight.addColorStop(0,'rgba(255,255,255,.12)');
  highlight.addColorStop(.11,'rgba(255,255,255,.055)');
  highlight.addColorStop(.92,'rgba(0,0,0,0)');
  highlight.addColorStop(1,'rgba(100,93,78,.065)');
  ctx.fillStyle=highlight;ctx.fillRect(0,0,width,height);
}

function temple(ctx,cx,cy,r,ink,light=false) {
  ctx.save();ctx.translate(cx,cy);
  const blue=ctx.createLinearGradient(-r,-r,r,r);
  blue.addColorStop(0,ink);blue.addColorStop(.5,'#1266a3');blue.addColorStop(1,ink);
  ctx.strokeStyle=blue;ctx.fillStyle=blue;ctx.lineJoin='miter';
  // Architectural pediment with an inset triangular seam.
  ctx.beginPath();ctx.moveTo(-r*.79,-r*.46);ctx.lineTo(0,-r*.97);ctx.lineTo(r*.79,-r*.46);
  ctx.lineTo(r*.74,-r*.37);ctx.lineTo(0,-r*.84);ctx.lineTo(-r*.74,-r*.37);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(-r*.72,-r*.31);ctx.lineTo(r*.72,-r*.31);ctx.lineWidth=r*.055;ctx.stroke();
  for (let i=0;i<4;i++) {
    const x=-r*.57+i*r*.38;
    ctx.beginPath();ctx.roundRect(x-r*.095,-r*.20,r*.19,r*.065,r*.025);ctx.fill();
    ctx.beginPath();ctx.moveTo(x-r*.07,-r*.11);ctx.lineTo(x+r*.07,-r*.11);ctx.lineTo(x+r*.085,r*.43);ctx.lineTo(x-r*.085,r*.43);ctx.closePath();ctx.fill();
  }
  for (let i=0;i<3;i++) {
    ctx.fillRect(-r*.78+i*r*.026,r*(.51+i*.07),r*(1.56-i*.052),r*.042);
  }
  if (light) {
    ctx.beginPath();ctx.arc(0,0,r*1.19,-.37*Math.PI,.98*Math.PI);
    ctx.lineWidth=r*.09;ctx.strokeStyle=blue;ctx.stroke();
  }
  ctx.restore();
}

function smallSeal(ctx,cx,cy,r,ink) {
  ctx.save();ctx.strokeStyle=ink;ctx.lineWidth=3.8;
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
  temple(ctx,cx,cy+3,r*.55,ink);
  ctx.restore();
}
function fittedTitleLines(title) {
  const s=(title||DEFAULT_TITLE).trim();
  if(s.toLowerCase()===DEFAULT_TITLE.toLowerCase()) return ['Informal Notes','on Mathematics'];
  const words=s.split(/\s+/);
  if(words.length<=3)return [s];
  const mid=Math.ceil(words.length/2);
  return [words.slice(0,mid).join(' '),words.slice(mid).join(' ')];
}
export function makeFrontCover({title=DEFAULT_TITLE,author='Runnel Zhang',ink='#07508a'}={}) {
  if(isReference(title,author,ink))return referenceCanvas('front',1200,1680);
  const c=canvas(1200,1680),ctx=c.getContext('2d');
  paper(ctx,1200,1680);
  // Bespoke INM imprint, deliberately distinct from a society mark.
  smallSeal(ctx,160,174,56,ink);
  ctx.fillStyle='#191a19';ctx.font='bold 20px Arial, sans-serif';ctx.fillText('INFORMAL NOTES',252,162);
  ctx.font='bold 16px Arial,sans-serif';ctx.fillText('MATHEMATICS · INM',253,188);
  ctx.strokeStyle='#171716';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(252,201);ctx.lineTo(486,201);ctx.stroke();
  const lines=fittedTitleLines(title);
  const maxChars=Math.max(...lines.map(x=>x.length));
  const fontSize=maxChars>28?59:maxChars>20?72:83;
  ctx.fillStyle='#111312';ctx.font='bold '+fontSize+'px Arial,Helvetica,sans-serif';
  ctx.textBaseline='alphabetic';
  const textX=520, textY=224;
  lines.forEach((line,i)=>ctx.fillText(line,textX,textY+i*(fontSize+11),610));
  ctx.font='bold 34px Arial,Helvetica,sans-serif';
  ctx.fillText(author,524,470,550);
  // Blue emblem with the interrupted circular arc of the user reference.
  const centerX=660,centerY=1150,r=285;
  const arc=ctx.createLinearGradient(300,850,1040,1460);
  arc.addColorStop(0,'rgba(4,83,149,.03)');
  arc.addColorStop(.35,'#1374b3');arc.addColorStop(1,'#064783');
  ctx.lineCap='butt';ctx.lineWidth=33;ctx.strokeStyle=arc;
  ctx.beginPath();ctx.arc(centerX,centerY,r*1.28,-.33*Math.PI, .87*Math.PI);ctx.stroke();
  ctx.save();ctx.translate(centerX,centerY);
  ctx.rotate(-.04);
  ctx.strokeStyle=arc;
  ctx.beginPath();ctx.arc(0,0,r*1.28,.90*Math.PI,1.04*Math.PI);ctx.stroke();
  ctx.restore();
  temple(ctx,centerX,centerY,r,ink);
  ctx.fillStyle='rgba(45,45,37,.50)';ctx.font='16px Georgia,serif';
  ctx.fillText('An independent mathematical notebook',86,1595);
  return c;
}
export function makeSpine({title=DEFAULT_TITLE,author='Runnel Zhang',ink='#07508a'}={}) {
  if(isReference(title,author,ink))return referenceCanvas('spine',340,1700);
  const c=canvas(340,1700),ctx=c.getContext('2d');
  paper(ctx,c.width,c.height);
  // Hinged bookcloth relief near either edge.
  const ridge=ctx.createLinearGradient(0,0,c.width,0);
  ridge.addColorStop(0,'rgba(92,82,60,.11)');
  ridge.addColorStop(.12,'rgba(255,255,255,.10)');
  ridge.addColorStop(.89,'rgba(255,255,255,.055)');
  ridge.addColorStop(1,'rgba(72,62,52,.16)');
  ctx.fillStyle=ridge;ctx.fillRect(0,0,c.width,c.height);
  smallSeal(ctx,c.width/2,130,55,ink);
  ctx.save();ctx.translate(178,350);ctx.rotate(Math.PI/2);
  ctx.fillStyle='#17191a';ctx.font='bold 49px Arial,Helvetica,sans-serif';
  ctx.fillText(title,0,0,820);
  ctx.strokeStyle='#4a514f';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,30);ctx.lineTo(790,30);ctx.stroke();
  ctx.font='bold 29px Arial,Helvetica,sans-serif';ctx.fillText(author,26,72,660);
  ctx.restore();
  smallSeal(ctx,c.width/2,1517,34,'#272e32');
  ctx.font='bold 24px Georgia,serif';ctx.textAlign='center';ctx.fillStyle='#27353b';ctx.fillText('INM',c.width/2,1590);
  return c;
}
export function makeBack() {
  const c=canvas(1200,1680),ctx=c.getContext('2d');
  ctx.drawImage(referenceArtwork.front,40,450,280,250,0,0,1200,1680);
  return c;
}
export function makeEdge() {
  const c=canvas(160,2048),ctx=c.getContext('2d');
  ctx.fillStyle='#f0ece3';ctx.fillRect(0,0,c.width,c.height);
  let v=98;
  const rand=()=>{v=(v*1103515245+12345)>>>0;return v/4294967296;};
  for(let y=0;y<c.height;y+=3){
    const a=.045+rand()*.14;ctx.fillStyle='rgba(106,101,89,'+a+')';ctx.fillRect(0,y,c.width,rand()>.5?1:2);
  }
  for(let i=0;i<55;i++){ctx.strokeStyle='rgba(255,255,255,.16)';ctx.beginPath();const y=rand()*c.height;ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
  return c;
}
// Small deterministic height map to give the simulated clothbound covers
// a gently woven surface in studio light. Not an AI-generated image.
export function makeClothBump(){
  const c=canvas(512,512),ctx=c.getContext('2d');
  const data=ctx.createImageData(512,512);
  let seed=9071993;
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const grain=(seed/4294967296-.5)*7;
    const warp=Math.sin(x*1.42)*Math.cos(y*1.31)*17;
    const weft=Math.sin(y*1.54)*Math.cos(x*1.27)*12;
    const n=Math.min(255,Math.max(0,Math.round(129+warp+weft+grain)));
    const k=(y*512+x)*4;
    data.data[k]=n;data.data[k+1]=n;data.data[k+2]=n;data.data[k+3]=255;
  }
  ctx.putImageData(data,0,0);
  return c;
}
export function makePlaceholder(text='INM') {
  const c=canvas(750,1060),ctx=c.getContext('2d');ctx.fillStyle='#faf9f4';ctx.fillRect(0,0,c.width,c.height);
  ctx.strokeStyle='#ebe9e2';ctx.lineWidth=2;ctx.strokeRect(52,54,c.width-104,c.height-108);
  ctx.fillStyle='#c8c6bc';ctx.font='28px Georgia,serif';ctx.textAlign='center';ctx.fillText(text,375,530);
  return c;
}
