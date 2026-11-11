// Page images share binary packs, but Range requests transfer only the
// selected image. Servers without Range support fall back to bounded packs.
export class PagePreviewPacks {
  constructor(baseURL,fetcher=fetch){
    this.baseURL=baseURL;this.fetcher=(url,options)=>fetcher.call(globalThis,url,options);this.manifest=null;
    this.packs=new Map();this.slices=new Map();this.probes=new Map();this.rangeSupported=false;
    this.stats={requests:0,bytes:0,hits:0};
  }
  async index(){
    if(!this.manifest)this.manifest=this.fetcher(this.baseURL+'index.json',{cache:'no-cache'}).then(async r=>{
      if(!r.ok)throw new Error('Preview index unavailable');
      const index=await r.json();
      if(index.version!==1||!index.pages||!index.packs)throw new Error('Invalid preview index');
      return index;
    });
    return this.manifest;
  }
  async blob(number){
    const index=await this.index(),entry=index.pages[number];
    if(!entry)throw new Error('Page has no preview');
    const [pack,offset,length]=entry,key=index.packs[pack],sliceKey=key+':'+offset;
    const extract=bytes=>{
      if(offset<8||offset+length>bytes.byteLength)throw new Error('Truncated preview pack');
      return bytes.slice(offset,offset+length);
    };
    if(this.slices.has(sliceKey)){this.stats.hits++;return new Blob([await this.slices.get(sliceKey)],{type:'image/webp'});}
    const task=(async()=>{
      if(this.packs.has(key)){this.stats.hits++;return extract(this.packs.get(key));}
      if(!this.rangeSupported&&this.probes.has(key)){
        await this.probes.get(key);
        if(this.packs.has(key)){this.stats.hits++;return extract(this.packs.get(key));}
      }
      this.stats.requests++;
      const request=this.fetcher(this.baseURL+key,{
        cache:'force-cache',headers:{Range:'bytes='+offset+'-'+(offset+length-1)}
      }).then(async r=>{
        if(!r.ok)throw new Error('Preview image unavailable');
        const bytes=await r.arrayBuffer();this.stats.bytes+=bytes.byteLength;
        if(r.status===206){
          this.rangeSupported=true;
          if(bytes.byteLength!==length)throw new Error('Truncated preview image');
          return bytes;
        }
        this.packs.set(key,bytes);
        while(this.packs.size>3)this.packs.delete(this.packs.keys().next().value);
        return extract(bytes);
      });
      if(!this.rangeSupported)this.probes.set(key,request);
      try{return await request;}finally{this.probes.delete(key);}
    })();
    this.slices.set(sliceKey,task);
    while(this.slices.size>16)this.slices.delete(this.slices.keys().next().value);
    return new Blob([await task],{type:'image/webp'});
  }
}
