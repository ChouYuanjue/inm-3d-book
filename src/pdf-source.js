// One versioned PDF transfer shared by the 3D viewer and full-resolution reader.
export class CachedPdfSource {
  constructor(url,{revision,fetcher=fetch,storage=globalThis.caches}={}){
    this.url=url;this.revision=revision||'current';
    this.fetcher=(url,options)=>fetcher.call(globalThis,url,options);
    this.storage=storage;this.promise=null;
    this.stats={requests:0,bytes:0,cacheHit:false,ready:false};
  }
  load(){
    if(this.promise)return this.promise;
    this.promise=this.read().catch(error=>{this.promise=null;throw error;});
    return this.promise;
  }
  async read(){
    const key=new URL(this.url,globalThis.location?.href||'https://inm.invalid/');
    key.searchParams.set('edition',this.revision);
    let cache;
    try{cache=await this.storage?.open('inm-reading-copy-v1');}catch{}
    if(cache){
      try{
        const stored=await cache.match(key.href);
        if(stored){
          const bytes=new Uint8Array(await stored.arrayBuffer());
          if(this.valid(bytes)){this.stats.cacheHit=true;this.stats.ready=true;return bytes;}
          await cache.delete(key.href);
        }
      }catch{}
    }
    this.stats.requests++;
    const response=await this.fetcher(key.href,{cache:'force-cache',priority:'low'});
    if(!response.ok)throw new Error('Reading copy unavailable');
    const bytes=new Uint8Array(await response.arrayBuffer());
    if(!this.valid(bytes))throw new Error('Invalid reading copy');
    this.stats.bytes=bytes.byteLength;
    if(cache){try{await cache.put(key.href,new Response(bytes,{headers:{'Content-Type':'application/pdf'}}));}catch{}}
    this.stats.ready=true;return bytes;
  }
  valid(bytes){return bytes.length>8&&String.fromCharCode(...bytes.subarray(0,5))==='%PDF-';}
}
// Keep speculative page rendering from occupying every canvas on a phone.
export class PdfRenderQueue {
  constructor(){this.waiting=[];this.running=false;}
  run(task,prefetch=false){
    return new Promise((resolve,reject)=>{
      const item={task,resolve,reject,prefetch};
      if(prefetch)this.waiting.push(item);
      else{
        const firstBackground=this.waiting.findIndex(x=>x.prefetch);
        this.waiting.splice(firstBackground<0?this.waiting.length:firstBackground,0,item);
      }
      this.pump();
    });
  }
  async pump(){
    if(this.running)return;
    this.running=true;
    while(this.waiting.length){
      const item=this.waiting.shift();
      try{item.resolve(await item.task());}catch(error){item.reject(error);}
    }
    this.running=false;
  }
}
