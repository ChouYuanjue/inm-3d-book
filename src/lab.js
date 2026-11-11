import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const host=document.getElementById('viewer');
const status=document.getElementById('loadStatus');
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=.89;
host.insertBefore(renderer.domElement,host.firstChild);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(32,1,.01,100);
const controls=new OrbitControls(camera,renderer.domElement);
controls.enableDamping=true;controls.dampingFactor=.07;
controls.enablePan=false;controls.minDistance=.28;controls.maxDistance=1.8;
controls.maxPolarAngle=Math.PI*.90;
scene.add(new THREE.HemisphereLight(0xfffcf7,0xb6b0a4,.82));
const light=new THREE.DirectionalLight(0xffffff,1.55);light.position.set(-.6,.9,.7);scene.add(light);
const side=new THREE.DirectionalLight(0xfff2e5,.55);side.position.set(.55,.35,-.3);scene.add(side);
const rim=new THREE.DirectionalLight(0xedf0f5,.22);rim.position.set(.15,.4,.8);scene.add(rim);
let group=null,orbitRadius=.57,renderDirty=true;
const shadowCanvas=document.createElement('canvas');
shadowCanvas.width=256;shadowCanvas.height=256;
const ctx=shadowCanvas.getContext('2d');
const grad=ctx.createRadialGradient(128,128,10,128,128,125);
grad.addColorStop(0,'rgba(35,34,32,.22)');
grad.addColorStop(.55,'rgba(33,32,31,.08)');
grad.addColorStop(1,'rgba(33,32,31,0)');
ctx.fillStyle=grad;ctx.fillRect(0,0,256,256);
const tex=new THREE.CanvasTexture(shadowCanvas);
const shadow=new THREE.Mesh(new THREE.PlaneGeometry(.8,.57),
  new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,opacity:.8}));
shadow.rotation.x=-Math.PI/2;
scene.add(shadow);
let floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),
  new THREE.MeshStandardMaterial({color:0xe9e7e1,roughness:1,metalness:0}));
floor.rotation.x=-Math.PI/2;floor.position.y=-.055;
scene.add(floor);
shadow.position.y=floor.position.y+.002;
function view(x,y,z){
  camera.position.set(x,y,z).normalize().multiplyScalar(orbitRadius);
  camera.lookAt(0,0,0);controls.target.set(0,0,0);
  renderDirty=true;
}
controls.addEventListener('change',()=>{renderDirty=true;});
function frame(){
  requestAnimationFrame(frame);
  const changed=controls.update();
  if(changed||renderDirty){renderer.render(scene,camera);renderDirty=false;}
}
function resize(){
  const width=host.clientWidth,height=host.clientHeight;
  if(!width||!height)return;
  renderer.setSize(width,height,false);
  camera.aspect=width/height;camera.updateProjectionMatrix();
  renderDirty=true;
}
new ResizeObserver(resize).observe(host);
resize();frame();
new GLTFLoader().load(
  import.meta.env.BASE_URL+'lab-model.glb',
  gltf=>{
    group=gltf.scene;
    group.traverse(obj=>{
      if(obj.isMesh){
        obj.castShadow=false;obj.receiveShadow=false;
        if(obj.material){
          const m=obj.material;
          if(m.map)m.map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
          if(m.normalMap)m.normalMap.anisotropy=4;
          // Match the natural off-white reflectance of uncoated paper rather
          // than the unshaded pure-white base produced by some GLB materials.
          if(obj.name.includes('paper leaves'))m.color.multiplyScalar(.88);
          if(obj.name.includes('curved printed'))m.color.multiplyScalar(.92);
          if(obj.name.includes('board')||obj.name.includes('spine'))m.color.multiplyScalar(.88);
        }
      }
    });
    const bounds=new THREE.Box3().setFromObject(group);
    const size=bounds.getSize(new THREE.Vector3());
    const center=bounds.getCenter(new THREE.Vector3());
    group.position.sub(center);
    const verticalClearance=.018;
    group.position.y+=verticalClearance;
    scene.add(group);
    const maxDim=Math.max(size.x,size.z);
    orbitRadius=Math.max(.53,maxDim*1.29);
    floor.position.y=-size.y/2-.009+verticalClearance;
    shadow.position.y=floor.position.y+.003;
    controls.maxDistance=orbitRadius*3.2;
    controls.minDistance=orbitRadius*.32;
    view(1.0,.67,1.25);
    document.getElementById('assetCount').textContent=
      gltf.scene.children.length+' geometry groups · '+Math.round(size.x*1000)+' × '+Math.round(size.z*1000)+' mm';
    status.remove();
  },
  xhr=>{
    if(xhr.total>0)status.textContent='Loading the 3D book… '+Math.floor(xhr.loaded/xhr.total*100)+'%';
  },
  err=>{
    status.textContent='Model preview could not load. See the offline render references below.';
    console.error('Experimental GLB load error',err);
  }
);
document.getElementById('reset').addEventListener('click',()=>view(1.0,.67,1.25));
document.getElementById('above').addEventListener('click',()=>view(.15,1.45,.15));
document.getElementById('side').addEventListener('click',()=>view(0,.18,1.55));
