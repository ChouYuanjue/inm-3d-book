// Searchable index derived from the compiled PDF's own bookmark outline.
export function initBookOutline({baseUrl, onJump}) {
  const input=document.getElementById('sectionSearch');
  const results=document.getElementById('sectionResults');
  const count=document.getElementById('outlineCount');
  let items=[];
  let debounce=null;
  const button=(entry)=>{
    const el=document.createElement('button');
    el.type='button';el.className='outline-entry outline-entry-'+entry.level;
    el.title='Go to PDF page '+entry.page;
    const text=document.createElement('span');
    text.className='outline-entry-label';
    const heading=document.createElement('strong');
    heading.textContent=entry.title;
    text.appendChild(heading);
    if(entry.level>=2&&entry.section){
      const sub=document.createElement('small');
      sub.textContent=entry.section;
      text.appendChild(sub);
    }
    const page=document.createElement('span');
    page.className='outline-page';
    page.textContent=entry.page;
    el.append(text,page);
    el.addEventListener('click',()=>onJump(entry.page));
    return el;
  };
  function render(){
    const query=input.value.trim().toLocaleLowerCase();
    results.replaceChildren();
    let visible;
    if(!query){
      visible=items.filter(x=>x.level===1);
    }else{
      const tokens=query.split(/\s+/).filter(Boolean);
      visible=items.filter(x=>{
        const corpus=(x.title+' '+x.section).toLocaleLowerCase();
        return tokens.every(t=>corpus.includes(t));
      });
      visible.sort((a,b)=>{
        const aTitle=a.title.toLowerCase(),bTitle=b.title.toLowerCase();
        const rank=x=>x===query?0:x.startsWith(query)?1:x.includes(query)?2:3;
        return rank(aTitle)-rank(bTitle)||a.level-b.level||a.page-b.page;
      });
    }
    const n=Math.min(query?18:24,visible.length);
    for(const item of visible.slice(0,n))results.append(button(item));
    if(!n){
      const none=document.createElement('div');
      none.className='outline-empty';
      none.textContent=query?'No matching headings in this manuscript.':'No PDF bookmarks found.';
      results.append(none);
    }
    count.textContent=query?visible.length.toLocaleString()+' results':items.length.toLocaleString()+' bookmarks';
  }
  input.addEventListener('input',()=>{
    window.clearTimeout(debounce);
    debounce=window.setTimeout(render,90);
  });
  count.textContent='Loading manuscript outline…';
  fetch(baseUrl+'outline.json').then(r=>{
    if(!r.ok)throw new Error('Could not fetch outline');
    return r.json();
  }).then(data=>{
    items=Array.isArray(data.items)?data.items:[];
    render();
  }).catch(error=>{
    console.warn('Index unavailable',error);
    count.textContent='Index not available';
  });
  return {render,clear:()=>{input.value='';render();}};
}
