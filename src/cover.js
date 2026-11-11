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
const referenceSpineInk=new Map();
function spineInk(ink='#07508a'){
  if(referenceSpineInk.has(ink))return referenceSpineInk.get(ink);
  const rgb=[1,3,5].map(i=>parseInt(ink.slice(i,i+2),16));
  const c=canvas(340,1700),ctx=c.getContext('2d');
  ctx.drawImage(referenceArtwork.spine,0,0,340,1700);
  const pixels=ctx.getImageData(0,0,340,1700);
  for(let k=0;k<pixels.data.length;k+=4){
    const r=pixels.data[k],g=pixels.data[k+1],b=pixels.data[k+2];
    const blue=b>r+22&&g>r+8;
    const lum=.2126*r+.7152*g+.0722*b;
    const alpha=blue?Math.min(1,(b-r)/95):Math.max(0,Math.min(1,(170-lum)/105));
    pixels.data[k]=blue?rgb[0]:17;pixels.data[k+1]=blue?rgb[1]:19;
    pixels.data[k+2]=blue?rgb[2]:18;pixels.data[k+3]=Math.round(alpha*255);
  }
  ctx.putImageData(pixels,0,0);referenceSpineInk.set(ink,c);return c;
}
export function makeSpine({title=DEFAULT_TITLE,author='Runnel Zhang',ink='#07508a',spineAspect=.20}={}) {
  // Equal pixel density along and across the actual curved spine. Ink
  // elements retain their aspect ratio when the binding gets thicker.
  const h=1700,w=Math.max(16,Math.round(h*spineAspect));
  const c=canvas(w,h),ctx=c.getContext('2d');
  ctx.drawImage(referenceArtwork.front,40,450,280,250,0,0,w,h);
  const art=spineInk(ink);
  function place(sx,sy,sw,sh,desiredWidth,y){
    const width=Math.min(desiredWidth,w*.64),height=width*sh/sw;
    ctx.drawImage(art,sx,sy,sw,sh,(w-width)/2,y,width,height);
    return {width,height};
  }
  place(88,55,165,150,145,65);
  const titleSize=place(128,235,78,700,70,260);
  if(title!==DEFAULT_TITLE){
    ctx.drawImage(referenceArtwork.front,40,450,280,250,0,230,w,790);
    ctx.save();ctx.translate(w/2,260);ctx.rotate(Math.PI/2);
    let size=Math.min(60,w*.58);ctx.font='bold '+size+'px Arial, sans-serif';
    while(ctx.measureText(title).width>710&&size>8){size-=1;ctx.font='bold '+size+'px Arial, sans-serif';}
    ctx.fillStyle='#111312';ctx.fillText(title,0,size*.34);ctx.restore();
  }
  ctx.strokeStyle='#30352f';ctx.lineWidth=1.5;
  const lineWidth=Math.min(110,w*.48);
  ctx.beginPath();ctx.moveTo((w-lineWidth)/2,1010);ctx.lineTo((w+lineWidth)/2,1010);ctx.stroke();
  if(author==='Runnel Zhang')place(128,978,78,265,52,1060);
  else{
    ctx.save();ctx.translate(w/2,1060);ctx.rotate(Math.PI/2);
    let size=Math.min(42,w*.48);ctx.font='bold '+size+'px Arial, sans-serif';
    while(ctx.measureText(author).width>300&&size>8){size-=1;ctx.font='bold '+size+'px Arial, sans-serif';}
    ctx.fillStyle='#111312';ctx.fillText(author,0,size*.34);ctx.restore();
  }
  place(110,1490,120,165,102,1480);
  c.dataset.spineAspect=String(spineAspect);
  c.dataset.titleAspect=String(titleSize.width/titleSize.height);
  c.dataset.titleWidth=String(titleSize.width);
  return c;
}
export function makeBack({title=DEFAULT_TITLE,author='Runnel Zhang',ink='#07508a'}={}) {
  const c=canvas(1200,1680),ctx=c.getContext('2d');
  ctx.drawImage(referenceArtwork.front,40,450,280,250,0,0,1200,1680);

  // A restrained companion to the reference front: ivory cloth, blue ink,
  // generous margins and a cropped impression of the same architectural seal.
  ctx.save();
  ctx.globalAlpha=.075;
  ctx.drawImage(referenceArtwork.front,120,660,1040,920,310,790,950,840);
  ctx.restore();

  ctx.fillStyle=ink;
  ctx.font='20px Arial, sans-serif';

  ctx.fillStyle='#161918';
  ctx.font='bold 53px "Times New Roman", serif';
  const lines=fittedTitleLines(title);
  lines.forEach((line,i)=>ctx.fillText(line,110,245+i*65,980));
  const y=245+(lines.length-1)*65;
  ctx.strokeStyle=ink;ctx.lineWidth=3;
  ctx.beginPath();ctx.moveTo(110,y+52);ctx.lineTo(1090,y+52);ctx.stroke();

  ctx.fillStyle=ink;
  ctx.font='italic 37px "Times New Roman", serif';
  ctx.fillText('Connections across modern mathematics',110,y+151,980);

  ctx.fillStyle='#303632';
  ctx.font='29px "Times New Roman", serif';
  [
    'What makes distant branches of mathematics',
    'belong to the same landscape?',
    '',
    'Moving through algebra, analysis, geometry and topology,',
    'this volume follows ideas beyond the boundaries',
    'of a single course. Detailed arguments sit alongside',
    'worked examples and the intuitions that motivate them.',
    '',
    'A book to read in sequence, explore by curiosity,',
    'and return to as familiar ideas acquire new meaning.'
  ].forEach((line,i)=>ctx.fillText(line,110,y+250+i*49,980));

  ctx.strokeStyle=ink;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(110,1480);ctx.lineTo(1090,1480);ctx.stroke();
  ctx.fillStyle='#1c2524';
  ctx.font='bold 32px "Times New Roman", serif';
  ctx.fillText(author,110,1541,750);
  ctx.font='18px Arial, sans-serif';
  ctx.fillStyle=ink;ctx.textAlign='right';
  ctx.fillText('INM',1090,1541);
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
