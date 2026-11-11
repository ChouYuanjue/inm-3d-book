"""Export PDF bookmarks for the one-volume INM 3D reading interface.
Usage: python scripts/extract_outline.py [--pdf public/inm.pdf] [--output public/outline.json]
This only reads the compiled manuscript and never modifies the TeX source.
"""
import argparse
import json
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('--pdf',type=Path,default=ROOT/'public'/'inm.pdf')
parser.add_argument('--output',type=Path,default=ROOT/'public'/'outline.json')
args=parser.parse_args()
doc=fitz.open(args.pdf)
stack=[]
items=[]
for level,title,page in doc.get_toc(simple=True):
    label=' '.join(title.split())
    while len(stack)>=level:stack.pop()
    parent=stack[-1] if stack else ''
    items.append({'level':level,'title':label,'page':page,'section':parent})
    stack.append(label)
args.output.parent.mkdir(parents=True,exist_ok=True)
args.output.write_text(json.dumps({'pages':len(doc),'items':items},ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(f"Exported {len(items)} bookmarks over {len(doc)} pages to {args.output}")
