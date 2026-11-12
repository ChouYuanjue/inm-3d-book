// Coalesce adjacent pages into one byte-range request. The app supplies the
// build-time index so a cold page view never waits for an index round trip.
export class PagePreviewPacks {
  constructor(baseURL,fetcher=fetch,manifest=null){
    this.baseURL=baseURL;this.fetcher=(url,options)=>fetcher.call(globalThis,url,options);
    this.manifest=manifest?Promise.resolve(manifest):null;
    this.packs=new Map();this.slices=new Map();this.pending=new Map();
    this.stats={requests:0,bytes:0,hits:0};
  }
  async index(){
    if(!this.manifest)this.manifest=this.fetcher(this.baseURL+'index.json',{cache:'force-cache'}).then(async r=>{
      if(!r.ok)throw new Error('Preview index unavailable');
      const index=await r.json();
      if(index.version!==1||!index.pages||!index.packs)throw new Error('Invalid preview index');
      return index;
    }).catch(error=>{this.manifest=null;throw error;});
    return this.manifest;
  }
  async blob(number){
    const index=await this.index(),entry=index.pages[number];
    if(!entry)throw new Error('Page has no preview');
    const [pack,offset,length]=entry,key=index.packs[pack],sliceKey=key+':'+offset;
    if(this.slices.has(sliceKey)){
      this.stats.hits++;return new Blob([await this.slices.get(sliceKey)],{type:'image/webp'});
    }
    let task;
    if(this.packs.has(key)){
      this.stats.hits++;
      const bytes=this.packs.get(key);
      task=Promise.resolve(this.extract(bytes,offset,length));
    }else{
      task=new Promise((resolve,reject)=>{
        if(!this.pending.has(key)){
          const queue=[];this.pending.set(key,queue);
          setTimeout(()=>this.flush(key,queue),0);
        }
        this.pending.get(key).push({offset,length,resolve,reject});
      });
    }
    this.slices.set(sliceKey,task);
    // Failed transfers can be retried; never cache a rejected promise.
    task.catch(()=>{if(this.slices.get(sliceKey)===task)this.slices.delete(sliceKey);});
    while(this.slices.size>24)this.slices.delete(this.slices.keys().next().value);
    return new Blob([await task],{type:'image/webp'});
  }
  extract(bytes,offset,length){
    if(offset<8||offset+length>bytes.byteLength)throw new Error('Truncated preview pack');
    return bytes.slice(offset,offset+length);
  }
  flush(key,queue){
    this.pending.delete(key);queue.sort((a,b)=>a.offset-b.offset);
    // Never pull the intervening pages when two unrelated jumps overlap.
    let group=[];
    for(const item of queue){
      if(group.length&&(item.offset-(group.at(-1).offset+group.at(-1).length)>32768||
        item.offset+item.length-group[0].offset>524288)){
        this.transfer(key,group);group=[];
      }
      group.push(item);
    }
    if(group.length)this.transfer(key,group);
  }
  async transfer(key,group){
    const start=group[0].offset,end=group.at(-1).offset+group.at(-1).length;
    try{
      this.stats.requests++;
      const r=await this.fetcher(this.baseURL+key,{cache:'force-cache',headers:{Range:'bytes='+start+'-'+(end-1)}});
      if(!r.ok)throw new Error('Preview image unavailable');
      const bytes=await r.arrayBuffer();this.stats.bytes+=bytes.byteLength;
      if(r.status===206){
        if(bytes.byteLength!==end-start)throw new Error('Truncated preview image');
        for(const item of group)item.resolve(bytes.slice(item.offset-start,item.offset-start+item.length));
      }else{
        this.packs.set(key,bytes);
        while(this.packs.size>3)this.packs.delete(this.packs.keys().next().value);
        // Validate the entire batch before resolving any of its pages.
        const slices=group.map(item=>this.extract(bytes,item.offset,item.length));
        group.forEach((item,i)=>item.resolve(slices[i]));
      }
    }catch(error){for(const item of group)item.reject(error);}
  }
}
