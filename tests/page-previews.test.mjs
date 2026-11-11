import test from 'node:test';
import assert from 'node:assert/strict';
import {PagePreviewPacks} from '../src/page-previews.js';
const data=Uint8Array.from([73,78,77,80,71,48,48,49,1,2,3,4,5,6]);
const index={version:1,packs:['p.bin'],pages:[null,[0,8,3,100,140],[0,11,3,100,140]]};
test('page preview transfers only the requested byte ranges and reuses cached images',async()=>{
 const requests=[];
 const fake=async(url,options={})=>{
  if(url.endsWith('index.json'))return new Response(JSON.stringify(index),{status:200});
  requests.push(options.headers.Range);
  const [,a,b]=options.headers.Range.match(/bytes=(\d+)-(\d+)/);
  return new Response(data.slice(Number(a),Number(b)+1),{status:206});
 };
 const store=new PagePreviewPacks('/previews/',fake);
 const a=await store.blob(1),b=await store.blob(2);await store.blob(1);
 assert.deepEqual([...new Uint8Array(await a.arrayBuffer())],[1,2,3]);
 assert.deepEqual([...new Uint8Array(await b.arrayBuffer())],[4,5,6]);
 assert.deepEqual(requests,['bytes=8-10','bytes=11-13']);assert.equal(store.stats.bytes,6);
});
test('preview loading supports servers that ignore Range without repeating a whole pack',async()=>{
 let fetches=0;
 const fake=async url=>{
  if(url.endsWith('index.json'))return new Response(JSON.stringify(index),{status:200});
  fetches++;return new Response(data,{status:200});
 };
 const store=new PagePreviewPacks('/previews/',fake);
 const [a,b]=await Promise.all([store.blob(1),store.blob(2)]);
 assert.equal(fetches,1);
 assert.deepEqual([...new Uint8Array(await a.arrayBuffer())],[1,2,3]);
 assert.deepEqual([...new Uint8Array(await b.arrayBuffer())],[4,5,6]);
});
test('a truncated preview fails explicitly so the caller can use the original PDF',async()=>{
 const fake=async url=>url.endsWith('index.json')?new Response(JSON.stringify(index),{status:200}):new Response(new Uint8Array([1]),{status:206});
 const store=new PagePreviewPacks('/previews/',fake);
 await assert.rejects(store.blob(1),/Truncated/);
});
