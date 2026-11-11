"""Publish the isolated INM 3D Book to the existing GitHub repository.
Uses GitHub's Git Data API because normal HTTPS Git pushes may be unreliable
in this environment. Reuses the remote manuscript blob when unchanged.
Requires: gh auth login, requests. Does not touch INM-TeX or tunnels.
"""
from __future__ import annotations

import base64
import hashlib
import subprocess
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
REPO = "ChouYuanjue/inm-3d-book"
URL = f"https://api.github.com/repos/{REPO}"
TOKEN = subprocess.check_output(["gh", "auth", "token"], text=True).strip()
session = requests.Session()
session.headers.update({
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
})

def request(method: str, endpoint: str, data: dict | None = None):
    for attempt in range(4):
        try:
            response = session.request(method, URL+endpoint, json=data, timeout=(20, 120))
            if response.ok:
                return response.json()
            if response.status_code in (400, 401, 403, 404, 409, 422):
                raise RuntimeError(f"GitHub refused {endpoint}: HTTP {response.status_code}: {response.text[:180]}")
            print(f"Retryable HTTP {response.status_code} at {endpoint}",flush=True)
        except requests.RequestException as exc:
            print(f"Network retry {attempt+1}: {str(exc)[:130]}",flush=True)
        time.sleep((attempt+1)*3)
    raise RuntimeError(f"Request failed: {endpoint}")

def git_blob_hash(content: bytes) -> str:
    return hashlib.sha1(b"blob "+str(len(content)).encode()+bytes([0])+content).hexdigest()

def main():
    ref = request("GET", "/git/ref/heads/main")
    parent = ref["object"]["sha"]
    commit = request("GET", f"/git/commits/{parent}")
    upstream = request("GET", f"/git/trees/{commit['tree']['sha']}?recursive=1")
    remote_sha = {node["path"]:node["sha"] for node in upstream["tree"] if node["type"]=="blob"}
    known_sha = set(remote_sha.values())
    files = subprocess.check_output(["git", "ls-files", "-z"],cwd=ROOT).decode().split(chr(0))
    files = [p for p in files if p]
    tree=[]
    uploaded=0
    reused=0
    for path in files:
        data = (ROOT / path).read_bytes()
        sha=git_blob_hash(data)
        entry={"path":path.replace("\\","/"),"mode":"100644","type":"blob"}
        if sha in known_sha:
            entry["sha"]=sha
            reused+=1
        else:
            try:
                content=data.decode("utf-8")
                if chr(0) in content:
                    raise ValueError("binary")
                entry["content"]=content
            except (UnicodeDecodeError,ValueError):
                print(f"Uploading new binary asset: {path} ({len(data)/1048576:.1f} MiB)",flush=True)
                blob=request("POST","/git/blobs",{
                    "content":base64.b64encode(data).decode("ascii"),
                    "encoding":"base64",
                })
                entry["sha"]=blob["sha"]
                uploaded+=1
                known_sha.add(blob["sha"])
        tree.append(entry)
    print(f"Tree: {len(tree)} files, {reused} reused, {uploaded} new binary blobs",flush=True)
    new_tree=request("POST","/git/trees",{"tree":tree})
    new_commit=request("POST","/git/commits",{
        "message":"Enhance one-volume INM reader with searchable contents and high-resolution inspection",
        "tree":new_tree["sha"],
        "parents":[parent],
    })
    updated=request("PATCH","/git/refs/heads/main",{"sha":new_commit["sha"],"force":False})
    print(f"Published {updated['object']['sha']} to {REPO}",flush=True)
    print(f"Website: https://chouyuanjue.github.io/inm-3d-book/",flush=True)
if __name__=="__main__":
    main()
