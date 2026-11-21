"""Build desktop and mobile page-image packs, with a bundled versioned index."""
from pathlib import Path
from concurrent.futures import ProcessPoolExecutor
import fitz,io,json,hashlib,time
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
PDF=ROOT/'public/inm.pdf'
OUT=ROOT/'public/page-previews'
PER_PACK=32
def render_pack(task):
    pack_index,start,end,digest,height,quality,mobile=task
    doc=fitz.open(PDF);data=bytearray(b'INMPG001');entries=[]
    for n in range(start,end):
        page=doc[n];scale=height/page.rect.height
        pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
        image=Image.frombytes('RGB',(pix.width,pix.height),pix.samples)
        buffer=io.BytesIO();image.save(buffer,format='WEBP',quality=quality,method=4)
        encoded=buffer.getvalue();offset=len(data);data.extend(encoded)
        entries.append([pack_index,offset,len(encoded),pix.width,pix.height])
    name=f'chunk-{pack_index:02d}-{digest}.bin'
    (OUT/name).write_bytes(data)
    return pack_index,name,entries,len(data)
def tier(height,quality):
    digest=hashlib.sha256(PDF.read_bytes()+f'webp-{height}-{quality}-v2'.encode()).hexdigest()[:12]
    count=len(fitz.open(PDF))
    tasks=[(i,start,min(count,start+PER_PACK),digest,height,quality,height<1000) for i,start in enumerate(range(0,count,PER_PACK))]
    packs=[None]*len(tasks);pages=[None]*(count+1);total=0
    with ProcessPoolExecutor(max_workers=4) as pool:
        for i,name,entries,size in pool.map(render_pack,tasks):
            packs[i]=name;start=tasks[i][1]
            for k,entry in enumerate(entries):pages[start+k+1]=entry
            total+=size
    manifest={'version':1,'source':digest,'count':count,'height':height,'packs':packs,'pages':pages}
    print(json.dumps({'height':height,'pages':count,'bytes':total}),flush=True)
    return manifest
def main():
    started=time.perf_counter();OUT.mkdir(parents=True,exist_ok=True)
    desktop=tier(1100,82);mobile=tier(780,76);desktop['mobile']=mobile
    content=json.dumps(desktop,separators=(',',':'))
    (OUT/'index.json').write_text(content,encoding='utf-8')
    (ROOT/'src/page-preview-index.json').write_text(content,encoding='utf-8')
    names=set(desktop['packs']+mobile['packs'])
    for old in OUT.glob('*.bin'):
        if old.name not in names:old.unlink()
    print(json.dumps({'seconds':round(time.perf_counter()-started,1)}),flush=True)
if __name__=='__main__':main()
