// High-resolution 2D PDF inspection overlay. It shares the same PDF document
// as the 3D book but never pre-renders the full manuscript into memory.
export function createPageInspector({getDocument,getPageCount,onNavigate}) {
  const root=document.getElementById('inspector');
  const canvas=document.getElementById('inspectorCanvas');
  const scroller=document.getElementById('inspectorScroll');
  const pageField=document.getElementById('inspectorPage');
  const count=document.getElementById('inspectorTotal');
  const status=document.getElementById('inspectorStatus');
  const previous=document.getElementById('inspectorPrev');
  const next=document.getElementById('inspectorNext');
  const zoomOut=document.getElementById('inspectorZoomOut');
  const zoomIn=document.getElementById('inspectorZoomIn');
  const zoomDisplay=document.getElementById('inspectorZoomLabel');
  let activePage=1,zoom=1,renderTicket=0;
  let lastFocus=null;
  function maxPage(){return Math.max(1,getPageCount());}
  function visible(){return !root.hidden;}
  function updateUi(){
    pageField.value=activePage;
    pageField.max=maxPage();
    count.textContent='/ '+maxPage().toLocaleString();
    previous.disabled=activePage<=1;
    next.disabled=activePage>=maxPage();
    zoomDisplay.textContent=Math.round(zoom*100)+'%';
  }
  function setZoom(value){
    zoom=Math.min(2.5,Math.max(.65,value));
    const baseWidth=Math.max(280,Math.min(720,window.innerWidth-36));
    canvas.style.width=Math.round(baseWidth*zoom)+'px';
    canvas.style.maxWidth='none';
    canvas.style.height='auto';
    updateUi();
  }
  function pageNumber(p){return Math.min(maxPage(),Math.max(1,Math.floor(Number(p)||1)));}
  async function paint(){
    const ticket=++renderTicket;
    status.textContent='Rendering page…';
    try{
      const pdf=await getDocument();
      const p=await pdf.getPage(activePage);
      // A4 from PDF, but preserve any embedded source page aspect ratio.
      const rect=p.getViewport({scale:1});
      const targetWidth=window.innerWidth<720?1050:1440;
      const scale=Math.min(2.7,targetWidth/rect.width);
      const vp=p.getViewport({scale});
      const draft=document.createElement('canvas');
      draft.width=Math.max(1,Math.ceil(vp.width));
      draft.height=Math.max(1,Math.ceil(vp.height));
      const ctx=draft.getContext('2d',{alpha:false});
      ctx.fillStyle='#fff';
      ctx.fillRect(0,0,draft.width,draft.height);
      await p.render({canvasContext:ctx,viewport:vp}).promise;
      p.cleanup();
      if(ticket!==renderTicket)return;
      canvas.width=draft.width;canvas.height=draft.height;
      const destination=canvas.getContext('2d',{alpha:false});
      destination.drawImage(draft,0,0);
      status.textContent='Page '+activePage+' · full-resolution preview';
      updateUi();
      scroller.scrollTop=0;
      scroller.scrollLeft=0;
    }catch(err){
      if(ticket===renderTicket)status.textContent='Page could not be rendered.';
      console.warn('PDF inspection failed',err);
    }
  }
  function go(page, updateBook=true){
    activePage=pageNumber(page);
    updateUi();
    if(updateBook)onNavigate(activePage,{fromInspector:true});
    if(visible())paint();
  }
  function open(page){
    if(!visible())lastFocus=document.activeElement;
    root.hidden=false;
    document.body.classList.add('inspector-open');
    activePage=pageNumber(page);
    updateUi();setZoom(1);
    pageField.focus();
    paint();
  }
  function close(){
    if(!visible())return;
    root.hidden=true;
    document.body.classList.remove('inspector-open');
    renderTicket++;
    if(lastFocus&&lastFocus.isConnected)lastFocus.focus();
  }
  document.getElementById('inspectorClose').addEventListener('click',close);
  previous.addEventListener('click',()=>go(activePage-1));
  next.addEventListener('click',()=>go(activePage+1));
  pageField.addEventListener('change',()=>go(pageField.value));
  pageField.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();go(pageField.value);pageField.blur();}});
  zoomOut.addEventListener('click',()=>setZoom(zoom-.25));
  zoomIn.addEventListener('click',()=>setZoom(zoom+.25));
  root.addEventListener('click',e=>{if(e.target===root)close();});
  root.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();}
    if(e.target===pageField||e.target.tagName==='INPUT')return;
    if(e.key==='ArrowRight'){e.preventDefault();go(activePage+1);}
    if(e.key==='ArrowLeft'){e.preventDefault();go(activePage-1);}
  });
  return {open,close,visible,go,activePage:()=>activePage};
}
