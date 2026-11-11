"""Build compact, indexed page-image packs for the 3D reader."""
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import fitz,io,json,hashlib,time
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
PDF=ROOT/'public/inm.pdf'
OUT=ROOT/'public/page-previews'
HEIGHT=1600
PER_PACK=32
def render_pack(task):
    pack_index,start,end,digest=task
    doc=fitz.open(PDF);data=bytearray(b'INMPG001');entries=[]
    for n in range(start,end):
        page=doc[n];pix=page.get_pixmap(matrix=fitz.Matrix(HEIGHT/page.rect.height,HEIGHT/page.rect.height),alpha=False)
        image=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
        buffer=io.BytesIO();image.save(buffer,format='WEBP',quality=88,method=4)
        encoded=buffer.getvalue();offset=len(data);data.extend(encoded)
        entries.append([pack_index,offset,len(encoded),pix.width,pix.height])
    name=f'chunk-{pack_index:02d}-{digest}.bin'
    (OUT/name).write_bytes(data)
    return pack_index,name,entries,len(data)
def main():
    started=time.perf_counter();OUT.mkdir(parents=True,exist_ok=True)
    digest=hashlib.sha256(PDF.read_bytes()).hexdigest()[:12]
    count=len(fitz.open(PDF));tasks=[(i,start,min(count,start+PER_PACK),digest) for i,start in enumerate(range(0,count,PER_PACK))]
    packs=[None]*len(tasks);pages=[None]*(count+1);total=0
    with ProcessPoolExecutor(max_workers=4) as pool:
        for i,name,entries,size in pool.map(render_pack,tasks):
            packs[i]=name;start=tasks[i][1]
            for k,entry in enumerate(entries):pages[start+k+1]=entry
            total+=size
            print(f'Pack {i+1}/{len(tasks)}: {size/1024:.0f} KiB',flush=True)
    manifest={'version':1,'source':digest,'count':count,'height':HEIGHT,'packs':packs,'pages':pages}
    (OUT/'index.json').write_text(json.dumps(manifest,separators=(',',':')),encoding='utf-8')
    print(json.dumps({'pages':count,'packs':len(packs),'bytes':total,'seconds':round(time.perf_counter()-started,1)}),flush=True)
if __name__=='__main__':main()
