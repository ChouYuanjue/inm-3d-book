import test from 'node:test';
import assert from 'node:assert/strict';
import {CachedPdfSource,PdfRenderQueue} from '../src/pdf-source.js';
const pdf=new TextEncoder().encode('%PDF-1.7\nTest reading copy');
function disk(){
 const entries=new Map();
 return {open:async()=>({match:async key=>entries.get(key)?.clone(),put:async(key,value)=>{entries.set(key,value.clone());},delete:async key=>entries.delete(key)})};
}
test('concurrent readers share one complete download and subsequent visits reuse the cached PDF',async()=>{
 const storage=disk();let calls=0;
 const fetcher=async()=>{calls++;return new Response(pdf);};
 const source=new CachedPdfSource('/inm.pdf',{revision:'one',fetcher,storage});
 const [a,b]=await Promise.all([source.load(),source.load()]);
 assert.equal(a,b);assert.equal(calls,1);
 const revisit=new CachedPdfSource('/inm.pdf',{revision:'one',fetcher,storage});
 assert.deepEqual(await revisit.load(),pdf);assert.equal(calls,1);assert.equal(revisit.stats.cacheHit,true);
 const updated=new CachedPdfSource('/inm.pdf',{revision:'two',fetcher,storage});
 await updated.load();assert.equal(calls,2);
});
test('failed or invalid transfers are retryable and never saved as a reading copy',async()=>{
 const storage=disk();let calls=0;
 const source=new CachedPdfSource('/inm.pdf',{revision:'one',storage,fetcher:async()=>{
  calls++;return new Response(calls===1?'<!doctype html>':pdf);
 }});
 await assert.rejects(source.load(),/Invalid/);
 assert.deepEqual(await source.load(),pdf);assert.equal(calls,2);
});
test('page rendering is serial and foreground work passes queued prefetch',async()=>{
 const queue=new PdfRenderQueue(),order=[];let release;
 const running=queue.run(async()=>{order.push('running');await new Promise(r=>{release=r;});});
 const speculative=queue.run(async()=>{order.push('prefetch');},true);
 const visible=queue.run(async()=>{order.push('visible');});
 release();await Promise.all([running,speculative,visible]);
 assert.deepEqual(order,['running','visible','prefetch']);
});
