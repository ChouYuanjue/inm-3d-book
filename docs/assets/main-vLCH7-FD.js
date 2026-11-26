(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const dl="modulepreload",fl=function(i){return"/inm-3d-book/"+i},Ko={},pl=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let c=function(l){return Promise.all(l.map(h=>Promise.resolve(h).then(f=>({status:"fulfilled",value:f}),f=>({status:"rejected",reason:f}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=a?.nonce||a?.getAttribute("nonce");s=c(t.map(l=>{if(l=fl(l),l in Ko)return;Ko[l]=!0;const h=l.endsWith(".css"),f=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${f}`))return;const u=document.createElement("link");if(u.rel=h?"stylesheet":dl,h||(u.as="script"),u.crossOrigin="",u.href=l,o&&u.setAttribute("nonce",o),document.head.appendChild(u),h)return new Promise((p,x)=>{u.addEventListener("load",p),u.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};function ml({baseUrl:i,onJump:e,revision:t}){const n=document.getElementById("sectionSearch"),s=document.getElementById("sectionResults"),r=document.getElementById("outlineCount");let a=[],o=null;const c=h=>{const f=document.createElement("button");f.type="button",f.className="outline-entry outline-entry-"+h.level,f.title="Go to PDF page "+h.page;const u=document.createElement("span");u.className="outline-entry-label";const p=document.createElement("strong");if(p.textContent=h.title,u.appendChild(p),h.level>=2&&h.section){const g=document.createElement("small");g.textContent=h.section,u.appendChild(g)}const x=document.createElement("span");return x.className="outline-page",x.textContent=h.page,f.append(u,x),f.addEventListener("click",()=>e(h.page)),f};function l(){const h=n.value.trim().toLocaleLowerCase();s.replaceChildren();let f;if(!h)f=a.filter(p=>p.level===1);else{const p=h.split(/\s+/).filter(Boolean);f=a.filter(x=>{const g=(x.title+" "+x.section).toLocaleLowerCase();return p.every(m=>g.includes(m))}),f.sort((x,g)=>{const m=x.title.toLowerCase(),d=g.title.toLowerCase(),M=y=>y===h?0:y.startsWith(h)?1:y.includes(h)?2:3;return M(m)-M(d)||x.level-g.level||x.page-g.page})}const u=Math.min(h?18:24,f.length);for(const p of f.slice(0,u))s.append(c(p));if(!u){const p=document.createElement("div");p.className="outline-empty",p.textContent=h?"No matching headings in this manuscript.":"No PDF bookmarks found.",s.append(p)}r.textContent=h?f.length.toLocaleString()+" results":a.length.toLocaleString()+" bookmarks"}return n.addEventListener("input",()=>{window.clearTimeout(o),o=window.setTimeout(l,90)}),r.textContent="Loading manuscript outline…",fetch(i+"outline.json"+(t?"?edition="+encodeURIComponent(t):"")).then(h=>{if(!h.ok)throw new Error("Could not fetch outline");return h.json()}).then(h=>{a=Array.isArray(h.items)?h.items:[],l()}).catch(h=>{console.warn("Index unavailable",h),r.textContent="Index not available"}),{render:l,clear:()=>{n.value="",l()}}}function xl({getDocument:i,getPageCount:e,onNavigate:t}){const n=document.getElementById("inspector"),s=document.getElementById("inspectorCanvas"),r=document.getElementById("inspectorScroll"),a=document.getElementById("inspectorPage"),o=document.getElementById("inspectorTotal"),c=document.getElementById("inspectorStatus"),l=document.getElementById("inspectorPrev"),h=document.getElementById("inspectorNext"),f=document.getElementById("inspectorZoomOut"),u=document.getElementById("inspectorZoomIn"),p=document.getElementById("inspectorZoomLabel");let x=1,g=1,m=0,d=null;function M(){return Math.max(1,e())}function y(){return!n.hidden}function w(){a.value=x,a.max=M(),o.textContent="/ "+M().toLocaleString(),l.disabled=x<=1,h.disabled=x>=M(),p.textContent=Math.round(g*100)+"%"}function P(A){g=Math.min(2.5,Math.max(.65,A));const B=Math.max(280,Math.min(720,window.innerWidth-36));s.style.width=Math.round(B*g)+"px",s.style.maxWidth="none",s.style.height="auto",w()}function E(A){return Math.min(M(),Math.max(1,Math.floor(Number(A)||1)))}async function C(){const A=++m;c.textContent="Rendering page…";try{const z=await(await i()).getPage(x),W=z.getViewport({scale:1}),q=window.innerWidth<720?1050:1440,H=Math.min(2.7,q/W.width),ee=z.getViewport({scale:H}),V=document.createElement("canvas");V.width=Math.max(1,Math.ceil(ee.width)),V.height=Math.max(1,Math.ceil(ee.height));const ne=V.getContext("2d",{alpha:!1});if(ne.fillStyle="#fff",ne.fillRect(0,0,V.width,V.height),await z.render({canvasContext:ne,viewport:ee}).promise,z.cleanup(),A!==m)return;s.width=V.width,s.height=V.height,s.getContext("2d",{alpha:!1}).drawImage(V,0,0),c.textContent="Page "+x+" · full-resolution preview",w(),r.scrollTop=0,r.scrollLeft=0}catch(B){A===m&&(c.textContent="Page could not be rendered."),console.warn("PDF inspection failed",B)}}function U(A,B=!0){x=E(A),w(),B&&t(x,{fromInspector:!0}),y()&&C()}function S(A){y()||(d=document.activeElement),n.hidden=!1,document.body.classList.add("inspector-open"),x=E(A),w(),P(1),a.focus(),C()}function b(){y()&&(n.hidden=!0,document.body.classList.remove("inspector-open"),m++,d&&d.isConnected&&d.focus())}return document.getElementById("inspectorClose").addEventListener("click",b),l.addEventListener("click",()=>U(x-1)),h.addEventListener("click",()=>U(x+1)),a.addEventListener("change",()=>U(a.value)),a.addEventListener("keydown",A=>{A.key==="Enter"&&(A.preventDefault(),U(a.value),a.blur())}),f.addEventListener("click",()=>P(g-.25)),u.addEventListener("click",()=>P(g+.25)),n.addEventListener("click",A=>{A.target===n&&b()}),n.addEventListener("keydown",A=>{A.key==="Escape"&&(A.preventDefault(),A.stopPropagation(),b()),!(A.target===a||A.target.tagName==="INPUT")&&(A.key==="ArrowRight"&&(A.preventDefault(),U(x+1)),A.key==="ArrowLeft"&&(A.preventDefault(),U(x-1)))}),{open:S,close:b,visible:y,go:U,activePage:()=>x}}const _o="181",ci={ROTATE:0,DOLLY:1,PAN:2},gl=0,$o=1,_l=2,lc=1,hc=2,On=3,_n=0,Ot=1,mt=2,Wn=0,es=1,Jo=2,Qo=3,e0=4,vl=5,bi=100,Ml=101,bl=102,Sl=103,yl=104,El=200,Tl=201,wl=202,Al=203,Aa=204,Ca=205,Cl=206,Rl=207,Pl=208,Ll=209,Dl=210,Ul=211,Il=212,Nl=213,Fl=214,Ra=0,Pa=1,La=2,is=3,Da=4,Ua=5,Ia=6,Na=7,uc=0,Ol=1,Bl=2,li=0,kl=1,zl=2,Vl=3,dc=4,Gl=5,Hl=6,Wl=7,fc=300,ss=301,rs=302,Fa=303,Oa=304,Ir=306,as=1e3,Gn=1001,Ba=1002,qt=1003,Xl=1004,Ws=1005,sn=1006,Xr=1007,Ei=1008,An=1009,pc=1010,mc=1011,Ps=1012,vo=1013,wi=1014,Hn=1015,us=1016,Mo=1017,bo=1018,Ls=1020,xc=35902,gc=35899,_c=1021,vc=1022,xn=1023,Ds=1026,Us=1027,Mc=1028,So=1029,yo=1030,Eo=1031,To=1033,_r=33776,vr=33777,Mr=33778,br=33779,ka=35840,za=35841,Va=35842,Ga=35843,Ha=36196,Wa=37492,Xa=37496,qa=37808,Ya=37809,Za=37810,ja=37811,Ka=37812,$a=37813,Ja=37814,Qa=37815,eo=37816,to=37817,no=37818,io=37819,so=37820,ro=37821,ao=36492,oo=36494,co=36495,lo=36283,ho=36284,uo=36285,fo=36286,ql=3200,Yl=3201,bc=0,Zl=1,ni="",Ct="srgb",os="srgb-linear",Ar="linear",Je="srgb",Ni=7680,t0=519,jl=512,Kl=513,$l=514,Sc=515,Jl=516,Ql=517,eh=518,th=519,n0=35044,i0="300 es",En=2e3,Cr=2001;function yc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function nh(){const i=Rr("canvas");return i.style.display="block",i}const s0={};function r0(...i){const e="THREE."+i.shift();console.log(e,...i)}function Le(...i){const e="THREE."+i.shift();console.warn(e,...i)}function xt(...i){const e="THREE."+i.shift();console.error(e,...i)}function Is(...i){const e=i.join(" ");e in s0||(s0[e]=!0,Le(...i))}function ih(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class Di{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Pt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let a0=1234567;const ws=Math.PI/180,Ns=180/Math.PI;function ds(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pt[i&255]+Pt[i>>8&255]+Pt[i>>16&255]+Pt[i>>24&255]+"-"+Pt[e&255]+Pt[e>>8&255]+"-"+Pt[e>>16&15|64]+Pt[e>>24&255]+"-"+Pt[t&63|128]+Pt[t>>8&255]+"-"+Pt[t>>16&255]+Pt[t>>24&255]+Pt[n&255]+Pt[n>>8&255]+Pt[n>>16&255]+Pt[n>>24&255]).toLowerCase()}function We(i,e,t){return Math.max(e,Math.min(t,i))}function wo(i,e){return(i%e+e)%e}function sh(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function rh(i,e,t){return i!==e?(t-i)/(e-i):0}function As(i,e,t){return(1-t)*i+t*e}function ah(i,e,t,n){return As(i,e,1-Math.exp(-t*n))}function oh(i,e=1){return e-Math.abs(wo(i,e*2)-e)}function ch(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function lh(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function hh(i,e){return i+Math.floor(Math.random()*(e-i+1))}function uh(i,e){return i+Math.random()*(e-i)}function dh(i){return i*(.5-Math.random())}function fh(i){i!==void 0&&(a0=i);let e=a0+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ph(i){return i*ws}function mh(i){return i*Ns}function xh(i){return(i&i-1)===0&&i!==0}function gh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function _h(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function vh(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),c=a(t/2),l=r((e+n)/2),h=a((e+n)/2),f=r((e-n)/2),u=a((e-n)/2),p=r((n-e)/2),x=a((n-e)/2);switch(s){case"XYX":i.set(o*h,c*f,c*u,o*l);break;case"YZY":i.set(c*u,o*h,c*f,o*l);break;case"ZXZ":i.set(c*f,c*u,o*h,o*l);break;case"XZX":i.set(o*h,c*x,c*p,o*l);break;case"YXY":i.set(c*p,o*h,c*x,o*l);break;case"ZYZ":i.set(c*x,c*p,o*h,o*l);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function $i(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const cs={DEG2RAD:ws,RAD2DEG:Ns,generateUUID:ds,clamp:We,euclideanModulo:wo,mapLinear:sh,inverseLerp:rh,lerp:As,damp:ah,pingpong:oh,smoothstep:ch,smootherstep:lh,randInt:hh,randFloat:uh,randFloatSpread:dh,seededRandom:fh,degToRad:ph,radToDeg:mh,isPowerOfTwo:xh,ceilPowerOfTwo:gh,floorPowerOfTwo:_h,setQuaternionFromProperEuler:vh,normalize:Nt,denormalize:$i};class Fe{constructor(e=0,t=0){Fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class fs{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3],u=r[a+0],p=r[a+1],x=r[a+2],g=r[a+3];if(o<=0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=f;return}if(o>=1){e[t+0]=u,e[t+1]=p,e[t+2]=x,e[t+3]=g;return}if(f!==g||c!==u||l!==p||h!==x){let m=c*u+l*p+h*x+f*g;m<0&&(u=-u,p=-p,x=-x,g=-g,m=-m);let d=1-o;if(m<.9995){const M=Math.acos(m),y=Math.sin(M);d=Math.sin(d*M)/y,o=Math.sin(o*M)/y,c=c*d+u*o,l=l*d+p*o,h=h*d+x*o,f=f*d+g*o}else{c=c*d+u*o,l=l*d+p*o,h=h*d+x*o,f=f*d+g*o;const M=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=M,l*=M,h*=M,f*=M}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=r[a],u=r[a+1],p=r[a+2],x=r[a+3];return e[t]=o*x+h*f+c*p-l*u,e[t+1]=c*x+h*u+l*f-o*p,e[t+2]=l*x+h*p+o*u-c*f,e[t+3]=h*x-o*f-c*u-l*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,c=Math.sin,l=o(n/2),h=o(s/2),f=o(r/2),u=c(n/2),p=c(s/2),x=c(r/2);switch(a){case"XYZ":this._x=u*h*f+l*p*x,this._y=l*p*f-u*h*x,this._z=l*h*x+u*p*f,this._w=l*h*f-u*p*x;break;case"YXZ":this._x=u*h*f+l*p*x,this._y=l*p*f-u*h*x,this._z=l*h*x-u*p*f,this._w=l*h*f+u*p*x;break;case"ZXY":this._x=u*h*f-l*p*x,this._y=l*p*f+u*h*x,this._z=l*h*x+u*p*f,this._w=l*h*f-u*p*x;break;case"ZYX":this._x=u*h*f-l*p*x,this._y=l*p*f+u*h*x,this._z=l*h*x-u*p*f,this._w=l*h*f+u*p*x;break;case"YZX":this._x=u*h*f+l*p*x,this._y=l*p*f+u*h*x,this._z=l*h*x-u*p*f,this._w=l*h*f-u*p*x;break;case"XZY":this._x=u*h*f-l*p*x,this._y=l*p*f-u*h*x,this._z=l*h*x+u*p*f,this._w=l*h*f+u*p*x;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],c=t[9],l=t[2],h=t[6],f=t[10],u=n+o+f;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(a-s)*p}else if(n>o&&n>f){const p=2*Math.sqrt(1+n-o-f);this._w=(h-c)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+l)/p}else if(o>f){const p=2*Math.sqrt(1+o-n-f);this._w=(r-l)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+f-n-o);this._w=(a-s)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+a*o+s*l-r*c,this._y=s*h+a*c+r*o-n*l,this._z=r*h+a*l+n*c-s*o,this._w=a*h-n*o-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let c=1-t;if(o<.9995){const l=Math.acos(o),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,n=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(o0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(o0.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,c=e.w,l=2*(a*s-o*n),h=2*(o*t-r*s),f=2*(r*n-a*t);return this.x=t+c*l+a*f-o*h,this.y=n+c*h+o*l-r*f,this.z=s+c*f+r*h-a*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,c=t.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qr.copy(this).projectOnVector(e),this.sub(qr)}reflect(e){return this.sub(qr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qr=new F,o0=new fs;class Ne{constructor(e,t,n,s,r,a,o,c,l){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l)}set(e,t,n,s,r,a,o,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=a,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],h=n[4],f=n[7],u=n[2],p=n[5],x=n[8],g=s[0],m=s[3],d=s[6],M=s[1],y=s[4],w=s[7],P=s[2],E=s[5],C=s[8];return r[0]=a*g+o*M+c*P,r[3]=a*m+o*y+c*E,r[6]=a*d+o*w+c*C,r[1]=l*g+h*M+f*P,r[4]=l*m+h*y+f*E,r[7]=l*d+h*w+f*C,r[2]=u*g+p*M+x*P,r[5]=u*m+p*y+x*E,r[8]=u*d+p*w+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8];return t*a*h-t*o*l-n*r*h+n*o*c+s*r*l-s*a*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=h*a-o*l,u=o*c-h*r,p=l*r-a*c,x=t*f+n*u+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/x;return e[0]=f*g,e[1]=(s*l-h*n)*g,e[2]=(o*n-s*a)*g,e[3]=u*g,e[4]=(h*t-s*c)*g,e[5]=(s*r-o*t)*g,e[6]=p*g,e[7]=(n*c-l*t)*g,e[8]=(a*t-n*r)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*a+l*o)+a+e,-s*l,s*c,-s*(-l*a+c*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Yr.makeScale(e,t)),this}rotate(e){return this.premultiply(Yr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Yr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Yr=new Ne,c0=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),l0=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mh(){const i={enabled:!0,workingColorSpace:os,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Je&&(s.r=Xn(s.r),s.g=Xn(s.g),s.b=Xn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Je&&(s.r=ts(s.r),s.g=ts(s.g),s.b=ts(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ni?Ar:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Is("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Is("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[os]:{primaries:e,whitePoint:n,transfer:Ar,toXYZ:c0,fromXYZ:l0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ct},outputColorSpaceConfig:{drawingBufferColorSpace:Ct}},[Ct]:{primaries:e,whitePoint:n,transfer:Je,toXYZ:c0,fromXYZ:l0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ct}}}),i}const Ye=Mh();function Xn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ts(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Fi;class bh{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Fi===void 0&&(Fi=Rr("canvas")),Fi.width=e.width,Fi.height=e.height;const s=Fi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Fi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Xn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Xn(t[n]/255)*255):t[n]=Xn(t[n]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Sh=0;class Ao{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Sh++}),this.uuid=ds(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Zr(s[a].image)):r.push(Zr(s[a]))}else r=Zr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Zr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?bh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}let yh=0;const jr=new F;class yt extends Di{constructor(e=yt.DEFAULT_IMAGE,t=yt.DEFAULT_MAPPING,n=Gn,s=Gn,r=sn,a=Ei,o=xn,c=An,l=yt.DEFAULT_ANISOTROPY,h=ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yh++}),this.uuid=ds(),this.name="",this.source=new Ao(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(jr).x}get height(){return this.source.getSize(jr).y}get depth(){return this.source.getSize(jr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==fc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case as:e.x=e.x-Math.floor(e.x);break;case Gn:e.x=e.x<0?0:1;break;case Ba:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case as:e.y=e.y-Math.floor(e.y);break;case Gn:e.y=e.y<0?0:1;break;case Ba:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yt.DEFAULT_IMAGE=null;yt.DEFAULT_MAPPING=fc;yt.DEFAULT_ANISOTROPY=1;class gt{constructor(e=0,t=0,n=0,s=1){gt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],f=c[8],u=c[1],p=c[5],x=c[9],g=c[2],m=c[6],d=c[10];if(Math.abs(h-u)<.01&&Math.abs(f-g)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+g)<.1&&Math.abs(x+m)<.1&&Math.abs(l+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(l+1)/2,w=(p+1)/2,P=(d+1)/2,E=(h+u)/4,C=(f+g)/4,U=(x+m)/4;return y>w&&y>P?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=E/n,r=C/n):w>P?w<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),n=E/s,r=U/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=C/r,s=U/r),this.set(n,s,r,t),this}let M=Math.sqrt((m-x)*(m-x)+(f-g)*(f-g)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-x)/M,this.y=(f-g)/M,this.z=(u-h)/M,this.w=Math.acos((l+p+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Eh extends Di{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new gt(0,0,e,t),this.scissorTest=!1,this.viewport=new gt(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new yt(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:sn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ao(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ai extends Eh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ec extends yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=qt,this.minFilter=qt,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Th extends yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=qt,this.minFilter=qt,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class zs{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,cn):cn.fromBufferAttribute(r,a),cn.applyMatrix4(e.matrixWorld),this.expandByPoint(cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Xs.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xs.copy(n.boundingBox)),Xs.applyMatrix4(e.matrixWorld),this.union(Xs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,cn),cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(gs),qs.subVectors(this.max,gs),Oi.subVectors(e.a,gs),Bi.subVectors(e.b,gs),ki.subVectors(e.c,gs),Zn.subVectors(Bi,Oi),jn.subVectors(ki,Bi),pi.subVectors(Oi,ki);let t=[0,-Zn.z,Zn.y,0,-jn.z,jn.y,0,-pi.z,pi.y,Zn.z,0,-Zn.x,jn.z,0,-jn.x,pi.z,0,-pi.x,-Zn.y,Zn.x,0,-jn.y,jn.x,0,-pi.y,pi.x,0];return!Kr(t,Oi,Bi,ki,qs)||(t=[1,0,0,0,1,0,0,0,1],!Kr(t,Oi,Bi,ki,qs))?!1:(Ys.crossVectors(Zn,jn),t=[Ys.x,Ys.y,Ys.z],Kr(t,Oi,Bi,ki,qs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Pn=[new F,new F,new F,new F,new F,new F,new F,new F],cn=new F,Xs=new zs,Oi=new F,Bi=new F,ki=new F,Zn=new F,jn=new F,pi=new F,gs=new F,qs=new F,Ys=new F,mi=new F;function Kr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){mi.fromArray(i,r);const o=s.x*Math.abs(mi.x)+s.y*Math.abs(mi.y)+s.z*Math.abs(mi.z),c=e.dot(mi),l=t.dot(mi),h=n.dot(mi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>o)return!1}return!0}const wh=new zs,_s=new F,$r=new F;class Nr{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):wh.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;_s.subVectors(e,this.center);const t=_s.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(_s,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($r.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(_s.copy(e.center).add($r)),this.expandByPoint(_s.copy(e.center).sub($r))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ln=new F,Jr=new F,Zs=new F,Kn=new F,Qr=new F,js=new F,ea=new F;class Co{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ln.copy(this.origin).addScaledVector(this.direction,t),Ln.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Jr.copy(e).add(t).multiplyScalar(.5),Zs.copy(t).sub(e).normalize(),Kn.copy(this.origin).sub(Jr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Zs),o=Kn.dot(this.direction),c=-Kn.dot(Zs),l=Kn.lengthSq(),h=Math.abs(1-a*a);let f,u,p,x;if(h>0)if(f=a*c-o,u=a*o-c,x=r*h,f>=0)if(u>=-x)if(u<=x){const g=1/h;f*=g,u*=g,p=f*(f+a*u+2*o)+u*(a*f+u+2*c)+l}else u=r,f=Math.max(0,-(a*u+o)),p=-f*f+u*(u+2*c)+l;else u=-r,f=Math.max(0,-(a*u+o)),p=-f*f+u*(u+2*c)+l;else u<=-x?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-c),r),p=-f*f+u*(u+2*c)+l):u<=x?(f=0,u=Math.min(Math.max(-r,-c),r),p=u*(u+2*c)+l):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-c),r),p=-f*f+u*(u+2*c)+l);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),p=-f*f+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Jr).addScaledVector(Zs,u),p}intersectSphere(e,t){Ln.subVectors(e.center,this.origin);const n=Ln.dot(this.direction),s=Ln.dot(Ln)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(e.min.z-u.z)*f,c=(e.max.z-u.z)*f):(o=(e.max.z-u.z)*f,c=(e.min.z-u.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Ln)!==null}intersectTriangle(e,t,n,s,r){Qr.subVectors(t,e),js.subVectors(n,e),ea.crossVectors(Qr,js);let a=this.direction.dot(ea),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Kn.subVectors(this.origin,e);const c=o*this.direction.dot(js.crossVectors(Kn,js));if(c<0)return null;const l=o*this.direction.dot(Qr.cross(Kn));if(l<0||c+l>a)return null;const h=-o*Kn.dot(ea);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dt{constructor(e,t,n,s,r,a,o,c,l,h,f,u,p,x,g,m){dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,c,l,h,f,u,p,x,g,m)}set(e,t,n,s,r,a,o,c,l,h,f,u,p,x,g,m){const d=this.elements;return d[0]=e,d[4]=t,d[8]=n,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=c,d[2]=l,d[6]=h,d[10]=f,d[14]=u,d[3]=p,d[7]=x,d[11]=g,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/zi.setFromMatrixColumn(e,0).length(),r=1/zi.setFromMatrixColumn(e,1).length(),a=1/zi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const u=a*h,p=a*f,x=o*h,g=o*f;t[0]=c*h,t[4]=-c*f,t[8]=l,t[1]=p+x*l,t[5]=u-g*l,t[9]=-o*c,t[2]=g-u*l,t[6]=x+p*l,t[10]=a*c}else if(e.order==="YXZ"){const u=c*h,p=c*f,x=l*h,g=l*f;t[0]=u+g*o,t[4]=x*o-p,t[8]=a*l,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=p*o-x,t[6]=g+u*o,t[10]=a*c}else if(e.order==="ZXY"){const u=c*h,p=c*f,x=l*h,g=l*f;t[0]=u-g*o,t[4]=-a*f,t[8]=x+p*o,t[1]=p+x*o,t[5]=a*h,t[9]=g-u*o,t[2]=-a*l,t[6]=o,t[10]=a*c}else if(e.order==="ZYX"){const u=a*h,p=a*f,x=o*h,g=o*f;t[0]=c*h,t[4]=x*l-p,t[8]=u*l+g,t[1]=c*f,t[5]=g*l+u,t[9]=p*l-x,t[2]=-l,t[6]=o*c,t[10]=a*c}else if(e.order==="YZX"){const u=a*c,p=a*l,x=o*c,g=o*l;t[0]=c*h,t[4]=g-u*f,t[8]=x*f+p,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-l*h,t[6]=p*f+x,t[10]=u-g*f}else if(e.order==="XZY"){const u=a*c,p=a*l,x=o*c,g=o*l;t[0]=c*h,t[4]=-f,t[8]=l*h,t[1]=u*f+g,t[5]=a*h,t[9]=p*f-x,t[2]=x*f-p,t[6]=o*h,t[10]=g*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ah,e,Ch)}lookAt(e,t,n){const s=this.elements;return Ht.subVectors(e,t),Ht.lengthSq()===0&&(Ht.z=1),Ht.normalize(),$n.crossVectors(n,Ht),$n.lengthSq()===0&&(Math.abs(n.z)===1?Ht.x+=1e-4:Ht.z+=1e-4,Ht.normalize(),$n.crossVectors(n,Ht)),$n.normalize(),Ks.crossVectors(Ht,$n),s[0]=$n.x,s[4]=Ks.x,s[8]=Ht.x,s[1]=$n.y,s[5]=Ks.y,s[9]=Ht.y,s[2]=$n.z,s[6]=Ks.z,s[10]=Ht.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],h=n[1],f=n[5],u=n[9],p=n[13],x=n[2],g=n[6],m=n[10],d=n[14],M=n[3],y=n[7],w=n[11],P=n[15],E=s[0],C=s[4],U=s[8],S=s[12],b=s[1],A=s[5],B=s[9],z=s[13],W=s[2],q=s[6],H=s[10],ee=s[14],V=s[3],ne=s[7],ie=s[11],ve=s[15];return r[0]=a*E+o*b+c*W+l*V,r[4]=a*C+o*A+c*q+l*ne,r[8]=a*U+o*B+c*H+l*ie,r[12]=a*S+o*z+c*ee+l*ve,r[1]=h*E+f*b+u*W+p*V,r[5]=h*C+f*A+u*q+p*ne,r[9]=h*U+f*B+u*H+p*ie,r[13]=h*S+f*z+u*ee+p*ve,r[2]=x*E+g*b+m*W+d*V,r[6]=x*C+g*A+m*q+d*ne,r[10]=x*U+g*B+m*H+d*ie,r[14]=x*S+g*z+m*ee+d*ve,r[3]=M*E+y*b+w*W+P*V,r[7]=M*C+y*A+w*q+P*ne,r[11]=M*U+y*B+w*H+P*ie,r[15]=M*S+y*z+w*ee+P*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],c=e[9],l=e[13],h=e[2],f=e[6],u=e[10],p=e[14],x=e[3],g=e[7],m=e[11],d=e[15];return x*(+r*c*f-s*l*f-r*o*u+n*l*u+s*o*p-n*c*p)+g*(+t*c*p-t*l*u+r*a*u-s*a*p+s*l*h-r*c*h)+m*(+t*l*f-t*o*p-r*a*f+n*a*p+r*o*h-n*l*h)+d*(-s*o*h-t*c*f+t*o*u+s*a*f-n*a*u+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],c=e[6],l=e[7],h=e[8],f=e[9],u=e[10],p=e[11],x=e[12],g=e[13],m=e[14],d=e[15],M=f*m*l-g*u*l+g*c*p-o*m*p-f*c*d+o*u*d,y=x*u*l-h*m*l-x*c*p+a*m*p+h*c*d-a*u*d,w=h*g*l-x*f*l+x*o*p-a*g*p-h*o*d+a*f*d,P=x*f*c-h*g*c-x*o*u+a*g*u+h*o*m-a*f*m,E=t*M+n*y+s*w+r*P;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/E;return e[0]=M*C,e[1]=(g*u*r-f*m*r-g*s*p+n*m*p+f*s*d-n*u*d)*C,e[2]=(o*m*r-g*c*r+g*s*l-n*m*l-o*s*d+n*c*d)*C,e[3]=(f*c*r-o*u*r-f*s*l+n*u*l+o*s*p-n*c*p)*C,e[4]=y*C,e[5]=(h*m*r-x*u*r+x*s*p-t*m*p-h*s*d+t*u*d)*C,e[6]=(x*c*r-a*m*r-x*s*l+t*m*l+a*s*d-t*c*d)*C,e[7]=(a*u*r-h*c*r+h*s*l-t*u*l-a*s*p+t*c*p)*C,e[8]=w*C,e[9]=(x*f*r-h*g*r-x*n*p+t*g*p+h*n*d-t*f*d)*C,e[10]=(a*g*r-x*o*r+x*n*l-t*g*l-a*n*d+t*o*d)*C,e[11]=(h*o*r-a*f*r-h*n*l+t*f*l+a*n*p-t*o*p)*C,e[12]=P*C,e[13]=(h*g*s-x*f*s+x*n*u-t*g*u-h*n*m+t*f*m)*C,e[14]=(x*o*s-a*g*s-x*n*c+t*g*c+a*n*m-t*o*m)*C,e[15]=(a*f*s-h*o*s+h*n*c-t*f*c-a*n*u+t*o*u)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,c=e.z,l=r*a,h=r*o;return this.set(l*a+n,l*o-s*c,l*c+s*o,0,l*o+s*c,h*o+n,h*c-s*a,0,l*c-s*o,h*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,c=t._w,l=r+r,h=a+a,f=o+o,u=r*l,p=r*h,x=r*f,g=a*h,m=a*f,d=o*f,M=c*l,y=c*h,w=c*f,P=n.x,E=n.y,C=n.z;return s[0]=(1-(g+d))*P,s[1]=(p+w)*P,s[2]=(x-y)*P,s[3]=0,s[4]=(p-w)*E,s[5]=(1-(u+d))*E,s[6]=(m+M)*E,s[7]=0,s[8]=(x+y)*C,s[9]=(m-M)*C,s[10]=(1-(u+g))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=zi.set(s[0],s[1],s[2]).length();const a=zi.set(s[4],s[5],s[6]).length(),o=zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],ln.copy(this);const l=1/r,h=1/a,f=1/o;return ln.elements[0]*=l,ln.elements[1]*=l,ln.elements[2]*=l,ln.elements[4]*=h,ln.elements[5]*=h,ln.elements[6]*=h,ln.elements[8]*=f,ln.elements[9]*=f,ln.elements[10]*=f,t.setFromRotationMatrix(ln),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=En,c=!1){const l=this.elements,h=2*r/(t-e),f=2*r/(n-s),u=(t+e)/(t-e),p=(n+s)/(n-s);let x,g;if(c)x=r/(a-r),g=a*r/(a-r);else if(o===En)x=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Cr)x=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=f,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=x,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=En,c=!1){const l=this.elements,h=2/(t-e),f=2/(n-s),u=-(t+e)/(t-e),p=-(n+s)/(n-s);let x,g;if(c)x=1/(a-r),g=a/(a-r);else if(o===En)x=-2/(a-r),g=-(a+r)/(a-r);else if(o===Cr)x=-1/(a-r),g=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=f,l[9]=0,l[13]=p,l[2]=0,l[6]=0,l[10]=x,l[14]=g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const zi=new F,ln=new dt,Ah=new F(0,0,0),Ch=new F(1,1,1),$n=new F,Ks=new F,Ht=new F,h0=new dt,u0=new fs;class Cn{constructor(e=0,t=0,n=0,s=Cn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],c=s[1],l=s[5],h=s[9],f=s[2],u=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-We(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(We(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return h0.makeRotationFromQuaternion(e),this.setFromRotationMatrix(h0,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return u0.setFromEuler(this),this.setFromQuaternion(u0,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cn.DEFAULT_ORDER="XYZ";class Ro{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Rh=0;const d0=new F,Vi=new fs,Dn=new dt,$s=new F,vs=new F,Ph=new F,Lh=new fs,f0=new F(1,0,0),p0=new F(0,1,0),m0=new F(0,0,1),x0={type:"added"},Dh={type:"removed"},Gi={type:"childadded",child:null},ta={type:"childremoved",child:null};class Et extends Di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Rh++}),this.uuid=ds(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new F,t=new Cn,n=new fs,s=new F(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new Ne}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ro,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.premultiply(Vi),this}rotateX(e){return this.rotateOnAxis(f0,e)}rotateY(e){return this.rotateOnAxis(p0,e)}rotateZ(e){return this.rotateOnAxis(m0,e)}translateOnAxis(e,t){return d0.copy(e).applyQuaternion(this.quaternion),this.position.add(d0.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(f0,e)}translateY(e){return this.translateOnAxis(p0,e)}translateZ(e){return this.translateOnAxis(m0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?$s.copy(e):$s.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),vs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(vs,$s,this.up):Dn.lookAt($s,vs,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Vi.setFromRotationMatrix(Dn),this.quaternion.premultiply(Vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(xt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(x0),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null):xt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Dh),ta.child=e,this.dispatchEvent(ta),ta.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(x0),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,e,Ph),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(vs,Lh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];r(e.shapes,f)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(r(e.materials,this.material[c]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];s.animations.push(r(e.animations,c))}}if(t){const o=a(e.geometries),c=a(e.materials),l=a(e.textures),h=a(e.images),f=a(e.shapes),u=a(e.skeletons),p=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){const c=[];for(const l in o){const h=o[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Et.DEFAULT_UP=new F(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new F,Un=new F,na=new F,In=new F,Hi=new F,Wi=new F,g0=new F,ia=new F,sa=new F,ra=new F,aa=new gt,oa=new gt,ca=new gt;class mn{constructor(e=new F,t=new F,n=new F){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),hn.subVectors(e,t),s.cross(hn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){hn.subVectors(s,t),Un.subVectors(n,t),na.subVectors(e,t);const a=hn.dot(hn),o=hn.dot(Un),c=hn.dot(na),l=Un.dot(Un),h=Un.dot(na),f=a*l-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,p=(l*c-o*h)*u,x=(a*h-o*c)*u;return r.set(1-p-x,x,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(e,t,n,s,r,a,o,c){return this.getBarycoord(e,t,n,s,In)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,In.x),c.addScaledVector(a,In.y),c.addScaledVector(o,In.z),c)}static getInterpolatedAttribute(e,t,n,s,r,a){return aa.setScalar(0),oa.setScalar(0),ca.setScalar(0),aa.fromBufferAttribute(e,t),oa.fromBufferAttribute(e,n),ca.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(aa,r.x),a.addScaledVector(oa,r.y),a.addScaledVector(ca,r.z),a}static isFrontFacing(e,t,n,s){return hn.subVectors(n,t),Un.subVectors(e,t),hn.cross(Un).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),hn.cross(Un).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return mn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return mn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return mn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return mn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return mn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Hi.subVectors(s,n),Wi.subVectors(r,n),ia.subVectors(e,n);const c=Hi.dot(ia),l=Wi.dot(ia);if(c<=0&&l<=0)return t.copy(n);sa.subVectors(e,s);const h=Hi.dot(sa),f=Wi.dot(sa);if(h>=0&&f<=h)return t.copy(s);const u=c*f-h*l;if(u<=0&&c>=0&&h<=0)return a=c/(c-h),t.copy(n).addScaledVector(Hi,a);ra.subVectors(e,r);const p=Hi.dot(ra),x=Wi.dot(ra);if(x>=0&&p<=x)return t.copy(r);const g=p*l-c*x;if(g<=0&&l>=0&&x<=0)return o=l/(l-x),t.copy(n).addScaledVector(Wi,o);const m=h*x-p*f;if(m<=0&&f-h>=0&&p-x>=0)return g0.subVectors(r,s),o=(f-h)/(f-h+(p-x)),t.copy(s).addScaledVector(g0,o);const d=1/(m+g+u);return a=g*d,o=u*d,t.copy(n).addScaledVector(Hi,a).addScaledVector(Wi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Tc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},Js={h:0,s:0,l:0};function la(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ye.workingColorSpace){if(e=wo(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=la(a,r,e+1/3),this.g=la(a,r,e),this.b=la(a,r,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=Ct){function n(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ct){const n=Tc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xn(e.r),this.g=Xn(e.g),this.b=Xn(e.b),this}copyLinearToSRGB(e){return this.r=ts(e.r),this.g=ts(e.g),this.b=ts(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ct){return Ye.workingToColorSpace(Lt.copy(this),e),Math.round(We(Lt.r*255,0,255))*65536+Math.round(We(Lt.g*255,0,255))*256+Math.round(We(Lt.b*255,0,255))}getHexString(e=Ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Lt.copy(this),t);const n=Lt.r,s=Lt.g,r=Lt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let c,l;const h=(o+a)/2;if(o===a)c=0,l=0;else{const f=a-o;switch(l=h<=.5?f/(a+o):f/(2-a-o),a){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Lt.copy(this),t),e.r=Lt.r,e.g=Lt.g,e.b=Lt.b,e}getStyle(e=Ct){Ye.workingToColorSpace(Lt.copy(this),e);const t=Lt.r,n=Lt.g,s=Lt.b;return e!==Ct?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Jn),this.setHSL(Jn.h+e,Jn.s+t,Jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Jn),e.getHSL(Js);const n=As(Jn.h,Js.h,t),s=As(Jn.s,Js.s,t),r=As(Jn.l,Js.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Lt=new Xe;Xe.NAMES=Tc;let Uh=0;class Ui extends Di{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uh++}),this.uuid=ds(),this.name="",this.type="Material",this.blending=es,this.side=_n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Aa,this.blendDst=Ca,this.blendEquation=bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=t0,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ni,this.stencilZFail=Ni,this.stencilZPass=Ni,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==es&&(n.blending=this.blending),this.side!==_n&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Aa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ca&&(n.blendDst=this.blendDst),this.blendEquation!==bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==is&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==t0&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ni&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ni&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ni&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const c=r[o];delete c.metadata,a.push(c)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class ls extends Ui{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const _t=new F,Qs=new Fe;let Ih=0;class ut{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ih++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=n0,this.updateRanges=[],this.gpuType=Hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Qs.fromBufferAttribute(this,t),Qs.applyMatrix3(e),this.setXY(t,Qs.x,Qs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=$i(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$i(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$i(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$i(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$i(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==n0&&(e.usage=this.usage),e}}class wc extends ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ac extends ut{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Yt extends ut{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Nh=0;const $t=new dt,ha=new Et,Xi=new F,Wt=new zs,Ms=new zs,bt=new F;class Tt extends Di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nh++}),this.uuid=ds(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(yc(e)?Ac:wc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ne().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return ha.lookAt(e),ha.updateMatrix(),this.applyMatrix4(ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xi).negate(),this.translate(Xi.x,Xi.y,Xi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Yt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){xt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Wt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&xt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){xt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const n=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];Ms.setFromBufferAttribute(o),this.morphTargetsRelative?(bt.addVectors(Wt.min,Ms.min),Wt.expandByPoint(bt),bt.addVectors(Wt.max,Ms.max),Wt.expandByPoint(bt)):(Wt.expandByPoint(Ms.min),Wt.expandByPoint(Ms.max))}Wt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(bt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],c=this.morphTargetsRelative;for(let l=0,h=o.count;l<h;l++)bt.fromBufferAttribute(o,l),c&&(Xi.fromBufferAttribute(e,l),bt.add(Xi)),s=Math.max(s,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&xt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){xt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ut(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let U=0;U<n.count;U++)o[U]=new F,c[U]=new F;const l=new F,h=new F,f=new F,u=new Fe,p=new Fe,x=new Fe,g=new F,m=new F;function d(U,S,b){l.fromBufferAttribute(n,U),h.fromBufferAttribute(n,S),f.fromBufferAttribute(n,b),u.fromBufferAttribute(r,U),p.fromBufferAttribute(r,S),x.fromBufferAttribute(r,b),h.sub(l),f.sub(l),p.sub(u),x.sub(u);const A=1/(p.x*x.y-x.x*p.y);isFinite(A)&&(g.copy(h).multiplyScalar(x.y).addScaledVector(f,-p.y).multiplyScalar(A),m.copy(f).multiplyScalar(p.x).addScaledVector(h,-x.x).multiplyScalar(A),o[U].add(g),o[S].add(g),o[b].add(g),c[U].add(m),c[S].add(m),c[b].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let U=0,S=M.length;U<S;++U){const b=M[U],A=b.start,B=b.count;for(let z=A,W=A+B;z<W;z+=3)d(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const y=new F,w=new F,P=new F,E=new F;function C(U){P.fromBufferAttribute(s,U),E.copy(P);const S=o[U];y.copy(S),y.sub(P.multiplyScalar(P.dot(S))).normalize(),w.crossVectors(E,S);const A=w.dot(c[U])<0?-1:1;a.setXYZW(U,y.x,y.y,y.z,A)}for(let U=0,S=M.length;U<S;++U){const b=M[U],A=b.start,B=b.count;for(let z=A,W=A+B;z<W;z+=3)C(e.getX(z+0)),C(e.getX(z+1)),C(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ut(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const s=new F,r=new F,a=new F,o=new F,c=new F,l=new F,h=new F,f=new F;if(e)for(let u=0,p=e.count;u<p;u+=3){const x=e.getX(u+0),g=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,g),a.fromBufferAttribute(t,m),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),o.fromBufferAttribute(n,x),c.fromBufferAttribute(n,g),l.fromBufferAttribute(n,m),o.add(h),c.add(h),l.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(g,c.x,c.y,c.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let u=0,p=t.count;u<p;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(o,c){const l=o.array,h=o.itemSize,f=o.normalized,u=new l.constructor(c.length*h);let p=0,x=0;for(let g=0,m=c.length;g<m;g++){o.isInterleavedBufferAttribute?p=c[g]*o.data.stride+o.offset:p=c[g]*h;for(let d=0;d<h;d++)u[x++]=l[p++]}return new ut(u,h,f)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Tt,n=this.index.array,s=this.attributes;for(const o in s){const c=s[o],l=e(c,n);t.setAttribute(o,l)}const r=this.morphAttributes;for(const o in r){const c=[],l=r[o];for(let h=0,f=l.length;h<f;h++){const u=l[h],p=e(u,n);c.push(p)}t.morphAttributes[o]=c}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,u=l.length;f<u;f++){const p=l[f];h.push(p.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],f=r[l];for(let u=0,p=f.length;u<p;u++)h.push(f[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let l=0,h=a.length;l<h;l++){const f=a[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _0=new dt,xi=new Co,er=new Nr,v0=new F,tr=new F,nr=new F,ir=new F,ua=new F,sr=new F,M0=new F,rr=new F;class jt extends Et{constructor(e=new Tt,t=new ls){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){sr.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=o[c],f=r[c];h!==0&&(ua.fromBufferAttribute(f,e),a?sr.addScaledVector(ua,h):sr.addScaledVector(ua.sub(t),h))}t.add(sr)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(r),xi.copy(e.ray).recast(e.near),!(er.containsPoint(xi.origin)===!1&&(xi.intersectSphere(er,v0)===null||xi.origin.distanceToSquared(v0)>(e.far-e.near)**2))&&(_0.copy(r).invert(),xi.copy(e.ray).applyMatrix4(_0),!(n.boundingBox!==null&&xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,xi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,g=u.length;x<g;x++){const m=u[x],d=a[m.materialIndex],M=Math.max(m.start,p.start),y=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,P=y;w<P;w+=3){const E=o.getX(w),C=o.getX(w+1),U=o.getX(w+2);s=ar(this,d,e,n,l,h,f,E,C,U),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),g=Math.min(o.count,p.start+p.count);for(let m=x,d=g;m<d;m+=3){const M=o.getX(m),y=o.getX(m+1),w=o.getX(m+2);s=ar(this,a,e,n,l,h,f,M,y,w),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,g=u.length;x<g;x++){const m=u[x],d=a[m.materialIndex],M=Math.max(m.start,p.start),y=Math.min(c.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,P=y;w<P;w+=3){const E=w,C=w+1,U=w+2;s=ar(this,d,e,n,l,h,f,E,C,U),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),g=Math.min(c.count,p.start+p.count);for(let m=x,d=g;m<d;m+=3){const M=m,y=m+1,w=m+2;s=ar(this,a,e,n,l,h,f,M,y,w),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Fh(i,e,t,n,s,r,a,o){let c;if(e.side===Ot?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,e.side===_n,o),c===null)return null;rr.copy(o),rr.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(rr);return l<t.near||l>t.far?null:{distance:l,point:rr.clone(),object:i}}function ar(i,e,t,n,s,r,a,o,c,l){i.getVertexPosition(o,tr),i.getVertexPosition(c,nr),i.getVertexPosition(l,ir);const h=Fh(i,e,t,n,tr,nr,ir,M0);if(h){const f=new F;mn.getBarycoord(M0,tr,nr,ir,f),s&&(h.uv=mn.getInterpolatedAttribute(s,o,c,l,f,new Fe)),r&&(h.uv1=mn.getInterpolatedAttribute(r,o,c,l,f,new Fe)),a&&(h.normal=mn.getInterpolatedAttribute(a,o,c,l,f,new F),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:c,c:l,normal:new F,materialIndex:0};mn.getNormal(tr,nr,ir,u.normal),h.face=u,h.barycoord=f}return h}class ps extends Tt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const c=[],l=[],h=[],f=[];let u=0,p=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Yt(l,3)),this.setAttribute("normal",new Yt(h,3)),this.setAttribute("uv",new Yt(f,2));function x(g,m,d,M,y,w,P,E,C,U,S){const b=w/C,A=P/U,B=w/2,z=P/2,W=E/2,q=C+1,H=U+1;let ee=0,V=0;const ne=new F;for(let ie=0;ie<H;ie++){const ve=ie*A-z;for(let Be=0;Be<q;Be++){const Ze=Be*b-B;ne[g]=Ze*M,ne[m]=ve*y,ne[d]=W,l.push(ne.x,ne.y,ne.z),ne[g]=0,ne[m]=0,ne[d]=E>0?1:-1,h.push(ne.x,ne.y,ne.z),f.push(Be/C),f.push(1-ie/U),ee+=1}}for(let ie=0;ie<U;ie++)for(let ve=0;ve<C;ve++){const Be=u+ve+q*ie,Ze=u+ve+q*(ie+1),tt=u+(ve+1)+q*(ie+1),nt=u+(ve+1)+q*ie;c.push(Be,Ze,nt),c.push(Ze,tt,nt),V+=6}o.addGroup(p,V,S),p+=V,u+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ps(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function hs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ft(i){const e={};for(let t=0;t<i.length;t++){const n=hs(i[t]);for(const s in n)e[s]=n[s]}return e}function Oh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Cc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const Bh={clone:hs,merge:Ft};var kh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qn extends Ui{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kh,this.fragmentShader=zh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=hs(e.uniforms),this.uniformsGroups=Oh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Rc extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new F,b0=new Fe,S0=new Fe;class tn extends Rc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Ns*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ws*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Ns*2*Math.atan(Math.tan(ws*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z)}getViewSize(e,t){return this.getViewBounds(e,b0,S0),t.subVectors(S0,b0)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ws*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;r+=a.offsetX*s/c,t-=a.offsetY*n/l,s*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const qi=-90,Yi=1;class Vh extends Et{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new tn(qi,Yi,e,t);s.layers=this.layers,this.add(s);const r=new tn(qi,Yi,e,t);r.layers=this.layers,this.add(r);const a=new tn(qi,Yi,e,t);a.layers=this.layers,this.add(a);const o=new tn(qi,Yi,e,t);o.layers=this.layers,this.add(o);const c=new tn(qi,Yi,e,t);c.layers=this.layers,this.add(c);const l=new tn(qi,Yi,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,c]=t;for(const l of t)this.remove(l);if(e===En)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Cr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,c,l,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(f,u,p),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class Pc extends yt{constructor(e=[],t=ss,n,s,r,a,o,c,l,h){super(e,t,n,s,r,a,o,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gh extends Ai{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Pc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new ps(5,5,5),r=new qn({name:"CubemapFromEquirect",uniforms:hs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ot,blending:Wn});r.uniforms.tEquirect.value=t;const a=new jt(s,r),o=t.minFilter;return t.minFilter===Ei&&(t.minFilter=sn),new Vh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class Tn extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hh={type:"move"};class da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Tn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Tn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Tn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){a=!0;for(const g of e.hand.values()){const m=t.getJointPose(g,n),d=this._getHandJoint(l,g);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],u=h.position.distanceTo(f.position),p=.02,x=.005;l.inputState.pinching&&u>p+x?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=p-x&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hh)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Tn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Wh extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Xh extends yt{constructor(e=null,t=1,n=1,s,r,a,o,c,l=qt,h=qt,f,u){super(null,a,o,c,l,h,s,r,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const fa=new F,qh=new F,Yh=new Ne;class Mi{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=fa.subVectors(n,t).cross(qh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(fa),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Yh.getNormalMatrix(e),s=this.coplanarPoint(fa).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new Nr,Zh=new Fe(.5,.5),or=new F;class Po{constructor(e=new Mi,t=new Mi,n=new Mi,s=new Mi,r=new Mi,a=new Mi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],c=r[2],l=r[3],h=r[4],f=r[5],u=r[6],p=r[7],x=r[8],g=r[9],m=r[10],d=r[11],M=r[12],y=r[13],w=r[14],P=r[15];if(s[0].setComponents(l-a,p-h,d-x,P-M).normalize(),s[1].setComponents(l+a,p+h,d+x,P+M).normalize(),s[2].setComponents(l+o,p+f,d+g,P+y).normalize(),s[3].setComponents(l-o,p-f,d-g,P-y).normalize(),n)s[4].setComponents(c,u,m,w).normalize(),s[5].setComponents(l-c,p-u,d-m,P-w).normalize();else if(s[4].setComponents(l-c,p-u,d-m,P-w).normalize(),t===En)s[5].setComponents(l+c,p+u,d+m,P+w).normalize();else if(t===Cr)s[5].setComponents(c,u,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(e){gi.center.set(0,0,0);const t=Zh.distanceTo(e.center);return gi.radius=.7071067811865476+t,gi.applyMatrix4(e.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(or.x=s.normal.x>0?e.max.x:e.min.x,or.y=s.normal.y>0?e.max.y:e.min.y,or.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(or)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Lc extends Ui{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pr=new F,Lr=new F,y0=new dt,bs=new Co,cr=new Nr,pa=new F,E0=new F;class jh extends Et{constructor(e=new Tt,t=new Lc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Pr.fromBufferAttribute(t,s-1),Lr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Pr.distanceTo(Lr);e.setAttribute("lineDistance",new Yt(n,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),cr.copy(n.boundingSphere),cr.applyMatrix4(s),cr.radius+=r,e.ray.intersectsSphere(cr)===!1)return;y0.copy(s).invert(),bs.copy(e.ray).applyMatrix4(y0);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),x=Math.min(h.count,a.start+a.count);for(let g=p,m=x-1;g<m;g+=l){const d=h.getX(g),M=h.getX(g+1),y=lr(this,e,bs,c,d,M,g);y&&t.push(y)}if(this.isLineLoop){const g=h.getX(x-1),m=h.getX(p),d=lr(this,e,bs,c,g,m,x-1);d&&t.push(d)}}else{const p=Math.max(0,a.start),x=Math.min(u.count,a.start+a.count);for(let g=p,m=x-1;g<m;g+=l){const d=lr(this,e,bs,c,g,g+1,g);d&&t.push(d)}if(this.isLineLoop){const g=lr(this,e,bs,c,x-1,p,x-1);g&&t.push(g)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function lr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Pr.fromBufferAttribute(o,s),Lr.fromBufferAttribute(o,r),t.distanceSqToSegment(Pr,Lr,pa,E0)>n)return;pa.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(pa);if(!(l<e.near||l>e.far))return{distance:l,point:E0.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Lo extends yt{constructor(e,t,n,s,r,a,o,c,l){super(e,t,n,s,r,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Dc extends yt{constructor(e,t,n=wi,s,r,a,o=qt,c=qt,l,h=Ds,f=1){if(h!==Ds&&h!==Us)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:f};super(u,s,r,a,o,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ao(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Uc extends yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class gn extends Tt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),c=Math.floor(s),l=o+1,h=c+1,f=e/o,u=t/c,p=[],x=[],g=[],m=[];for(let d=0;d<h;d++){const M=d*u-a;for(let y=0;y<l;y++){const w=y*f-r;x.push(w,-M,0),g.push(0,0,1),m.push(y/o),m.push(1-d/c)}}for(let d=0;d<c;d++)for(let M=0;M<o;M++){const y=M+l*d,w=M+l*(d+1),P=M+1+l*(d+1),E=M+1+l*d;p.push(y,w,E),p.push(w,P,E)}this.setIndex(p),this.setAttribute("position",new Yt(x,3)),this.setAttribute("normal",new Yt(g,3)),this.setAttribute("uv",new Yt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gn(e.width,e.height,e.widthSegments,e.heightSegments)}}class Kh extends Ui{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Xe(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class kn extends Ui{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bc,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class $h extends Ui{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ql,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Jh extends Ui{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ic extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Qh extends Ic{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ma=new dt,T0=new F,w0=new F;class eu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.mapType=An,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Po,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;T0.setFromMatrixPosition(e.matrixWorld),t.position.copy(T0),w0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(w0),t.updateMatrixWorld(),ma.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ma,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ma)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Nc extends Rc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,a=r+l*this.view.width,o-=h*this.view.offsetY,c=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class tu extends eu{constructor(){super(new Nc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fr extends Ic{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new tu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class nu extends tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class iu{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const A0=new dt;class su{constructor(e,t,n=0,s=1/0){this.ray=new Co(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Ro,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):xt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return A0.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(A0),this}intersectObject(e,t=!0,n=[]){return po(e,this,n,t),n.sort(C0),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)po(e[s],this,n,t);return n.sort(C0),n}}function C0(i,e){return i.distance-e.distance}function po(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)po(r[a],e,t,!0)}}class ru extends Di{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Le("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function R0(i,e,t,n){const s=au(n);switch(t){case _c:return i*e;case Mc:return i*e/s.components*s.byteLength;case So:return i*e/s.components*s.byteLength;case yo:return i*e*2/s.components*s.byteLength;case Eo:return i*e*2/s.components*s.byteLength;case vc:return i*e*3/s.components*s.byteLength;case xn:return i*e*4/s.components*s.byteLength;case To:return i*e*4/s.components*s.byteLength;case _r:case vr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Mr:case br:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case za:case Ga:return Math.max(i,16)*Math.max(e,8)/4;case ka:case Va:return Math.max(i,8)*Math.max(e,8)/2;case Ha:case Wa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Xa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case qa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Za:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ja:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case $a:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case eo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case to:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case no:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case io:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case so:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ro:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ao:case oo:case co:return Math.ceil(i/4)*Math.ceil(e/4)*16;case lo:case ho:return Math.ceil(i/4)*Math.ceil(e/4)*8;case uo:case fo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function au(i){switch(i){case An:case pc:return{byteLength:1,components:1};case Ps:case mc:case us:return{byteLength:2,components:1};case Mo:case bo:return{byteLength:2,components:4};case wi:case vo:case Hn:return{byteLength:4,components:1};case xc:case gc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_o}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_o);function Fc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ou(i){const e=new WeakMap;function t(o,c){const l=o.array,h=o.usage,f=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),o.onUploadCallback();let p;if(l instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)p=i.HALF_FLOAT;else if(l instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=i.SHORT;else if(l instanceof Uint32Array)p=i.UNSIGNED_INT;else if(l instanceof Int32Array)p=i.INT;else if(l instanceof Int8Array)p=i.BYTE;else if(l instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,o),f.length===0)i.bufferSubData(l,0,h);else{f.sort((p,x)=>p.start-x.start);let u=0;for(let p=1;p<f.length;p++){const x=f[u],g=f[p];g.start<=x.start+x.count+1?x.count=Math.max(x.count,g.start+g.count-x.start):(++u,f[u]=g)}f.length=u+1;for(let p=0,x=f.length;p<x;p++){const g=f[p];i.bufferSubData(l,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(i.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const l=e.get(o);if(l===void 0)e.set(o,t(o,c));else if(l.version<o.version){if(l.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,o,c),l.version=o.version}}return{get:s,remove:r,update:a}}var cu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,lu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,du=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,fu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,mu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,gu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_u=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,vu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mu=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Su=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,yu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Eu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Au=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Cu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Ru=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Pu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Lu=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Du=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Uu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Iu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nu=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Fu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ou=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Bu="gl_FragColor = linearToOutputTexel( gl_FragColor );",ku=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,zu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Vu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,Gu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Hu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Wu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Xu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,qu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Yu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Zu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ju=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ku=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,$u=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ju=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ed=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,td=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nd=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,id=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,sd=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rd=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,ad=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 uv = vec2( roughness, dotNV );
	return texture2D( dfgLUT, uv ).rg;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNV * dotNV), 0.0, dotNV), material.roughness );
	vec2 dfgL = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNL * dotNL), 0.0, dotNL), material.roughness );
	vec3 FssEss_V = material.specularColor * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColor * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColor + ( 1.0 - material.specularColor ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,od=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,cd=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ld=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,hd=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ud=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fd=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,md=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,gd=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_d=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vd=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Md=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,bd=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sd=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yd=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ed=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Td=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,wd=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ad=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rd=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Pd=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ld=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dd=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ud=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Id=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Nd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Od=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bd=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zd=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hd=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Wd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Xd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,qd=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Yd=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zd=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,jd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Kd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,$d=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ef=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,tf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,nf=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,sf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,af=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,of=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,df=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ff=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,mf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,xf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,gf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,_f=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bf=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,yf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ef=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tf=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wf=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Af=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cf=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Rf=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Pf=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lf=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Df=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Uf=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,If=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nf=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ff=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Of=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Bf=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kf=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,zf=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vf=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:cu,alphahash_pars_fragment:lu,alphamap_fragment:hu,alphamap_pars_fragment:uu,alphatest_fragment:du,alphatest_pars_fragment:fu,aomap_fragment:pu,aomap_pars_fragment:mu,batching_pars_vertex:xu,batching_vertex:gu,begin_vertex:_u,beginnormal_vertex:vu,bsdfs:Mu,iridescence_fragment:bu,bumpmap_pars_fragment:Su,clipping_planes_fragment:yu,clipping_planes_pars_fragment:Eu,clipping_planes_pars_vertex:Tu,clipping_planes_vertex:wu,color_fragment:Au,color_pars_fragment:Cu,color_pars_vertex:Ru,color_vertex:Pu,common:Lu,cube_uv_reflection_fragment:Du,defaultnormal_vertex:Uu,displacementmap_pars_vertex:Iu,displacementmap_vertex:Nu,emissivemap_fragment:Fu,emissivemap_pars_fragment:Ou,colorspace_fragment:Bu,colorspace_pars_fragment:ku,envmap_fragment:zu,envmap_common_pars_fragment:Vu,envmap_pars_fragment:Gu,envmap_pars_vertex:Hu,envmap_physical_pars_fragment:ed,envmap_vertex:Wu,fog_vertex:Xu,fog_pars_vertex:qu,fog_fragment:Yu,fog_pars_fragment:Zu,gradientmap_pars_fragment:ju,lightmap_pars_fragment:Ku,lights_lambert_fragment:$u,lights_lambert_pars_fragment:Ju,lights_pars_begin:Qu,lights_toon_fragment:td,lights_toon_pars_fragment:nd,lights_phong_fragment:id,lights_phong_pars_fragment:sd,lights_physical_fragment:rd,lights_physical_pars_fragment:ad,lights_fragment_begin:od,lights_fragment_maps:cd,lights_fragment_end:ld,logdepthbuf_fragment:hd,logdepthbuf_pars_fragment:ud,logdepthbuf_pars_vertex:dd,logdepthbuf_vertex:fd,map_fragment:pd,map_pars_fragment:md,map_particle_fragment:xd,map_particle_pars_fragment:gd,metalnessmap_fragment:_d,metalnessmap_pars_fragment:vd,morphinstance_vertex:Md,morphcolor_vertex:bd,morphnormal_vertex:Sd,morphtarget_pars_vertex:yd,morphtarget_vertex:Ed,normal_fragment_begin:Td,normal_fragment_maps:wd,normal_pars_fragment:Ad,normal_pars_vertex:Cd,normal_vertex:Rd,normalmap_pars_fragment:Pd,clearcoat_normal_fragment_begin:Ld,clearcoat_normal_fragment_maps:Dd,clearcoat_pars_fragment:Ud,iridescence_pars_fragment:Id,opaque_fragment:Nd,packing:Fd,premultiplied_alpha_fragment:Od,project_vertex:Bd,dithering_fragment:kd,dithering_pars_fragment:zd,roughnessmap_fragment:Vd,roughnessmap_pars_fragment:Gd,shadowmap_pars_fragment:Hd,shadowmap_pars_vertex:Wd,shadowmap_vertex:Xd,shadowmask_pars_fragment:qd,skinbase_vertex:Yd,skinning_pars_vertex:Zd,skinning_vertex:jd,skinnormal_vertex:Kd,specularmap_fragment:$d,specularmap_pars_fragment:Jd,tonemapping_fragment:Qd,tonemapping_pars_fragment:ef,transmission_fragment:tf,transmission_pars_fragment:nf,uv_pars_fragment:sf,uv_pars_vertex:rf,uv_vertex:af,worldpos_vertex:of,background_vert:cf,background_frag:lf,backgroundCube_vert:hf,backgroundCube_frag:uf,cube_vert:df,cube_frag:ff,depth_vert:pf,depth_frag:mf,distanceRGBA_vert:xf,distanceRGBA_frag:gf,equirect_vert:_f,equirect_frag:vf,linedashed_vert:Mf,linedashed_frag:bf,meshbasic_vert:Sf,meshbasic_frag:yf,meshlambert_vert:Ef,meshlambert_frag:Tf,meshmatcap_vert:wf,meshmatcap_frag:Af,meshnormal_vert:Cf,meshnormal_frag:Rf,meshphong_vert:Pf,meshphong_frag:Lf,meshphysical_vert:Df,meshphysical_frag:Uf,meshtoon_vert:If,meshtoon_frag:Nf,points_vert:Ff,points_frag:Of,shadow_vert:Bf,shadow_frag:kf,sprite_vert:zf,sprite_frag:Vf},ce={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},bn={basic:{uniforms:Ft([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Ft([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Ft([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Ft([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Ft([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Ft([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Ft([ce.points,ce.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Ft([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Ft([ce.common,ce.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Ft([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Ft([ce.sprite,ce.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Ft([ce.common,ce.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Ft([ce.lights,ce.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};bn.physical={uniforms:Ft([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const hr={r:0,b:0,g:0},_i=new Cn,Gf=new dt;function Hf(i,e,t,n,s,r,a){const o=new Xe(0);let c=r===!0?0:1,l,h,f=null,u=0,p=null;function x(y){let w=y.isScene===!0?y.background:null;return w&&w.isTexture&&(w=(y.backgroundBlurriness>0?t:e).get(w)),w}function g(y){let w=!1;const P=x(y);P===null?d(o,c):P&&P.isColor&&(d(P,1),w=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(y,w){const P=x(w);P&&(P.isCubeTexture||P.mapping===Ir)?(h===void 0&&(h=new jt(new ps(1,1,1),new qn({name:"BackgroundCubeMaterial",uniforms:hs(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:Ot,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,C,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),_i.copy(w.backgroundRotation),_i.x*=-1,_i.y*=-1,_i.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),h.material.uniforms.envMap.value=P,h.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Gf.makeRotationFromEuler(_i)),h.material.toneMapped=Ye.getTransfer(P.colorSpace)!==Je,(f!==P||u!==P.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,f=P,u=P.version,p=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):P&&P.isTexture&&(l===void 0&&(l=new jt(new gn(2,2),new qn({name:"BackgroundMaterial",uniforms:hs(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=P,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=Ye.getTransfer(P.colorSpace)!==Je,P.matrixAutoUpdate===!0&&P.updateMatrix(),l.material.uniforms.uvTransform.value.copy(P.matrix),(f!==P||u!==P.version||p!==i.toneMapping)&&(l.material.needsUpdate=!0,f=P,u=P.version,p=i.toneMapping),l.layers.enableAll(),y.unshift(l,l.geometry,l.material,0,0,null))}function d(y,w){y.getRGB(hr,Cc(i)),n.buffers.color.setClear(hr.r,hr.g,hr.b,w,a)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,w=1){o.set(y),c=w,d(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(y){c=y,d(o,c)},render:g,addToRenderList:m,dispose:M}}function Wf(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(b,A,B,z,W){let q=!1;const H=f(z,B,A);r!==H&&(r=H,l(r.object)),q=p(b,z,B,W),q&&x(b,z,B,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,w(b,A,B,z),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function c(){return i.createVertexArray()}function l(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function f(b,A,B){const z=B.wireframe===!0;let W=n[b.id];W===void 0&&(W={},n[b.id]=W);let q=W[A.id];q===void 0&&(q={},W[A.id]=q);let H=q[z];return H===void 0&&(H=u(c()),q[z]=H),H}function u(b){const A=[],B=[],z=[];for(let W=0;W<t;W++)A[W]=0,B[W]=0,z[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:B,attributeDivisors:z,object:b,attributes:{},index:null}}function p(b,A,B,z){const W=r.attributes,q=A.attributes;let H=0;const ee=B.getAttributes();for(const V in ee)if(ee[V].location>=0){const ie=W[V];let ve=q[V];if(ve===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(ve=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(ve=b.instanceColor)),ie===void 0||ie.attribute!==ve||ve&&ie.data!==ve.data)return!0;H++}return r.attributesNum!==H||r.index!==z}function x(b,A,B,z){const W={},q=A.attributes;let H=0;const ee=B.getAttributes();for(const V in ee)if(ee[V].location>=0){let ie=q[V];ie===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor));const ve={};ve.attribute=ie,ie&&ie.data&&(ve.data=ie.data),W[V]=ve,H++}r.attributes=W,r.attributesNum=H,r.index=z}function g(){const b=r.newAttributes;for(let A=0,B=b.length;A<B;A++)b[A]=0}function m(b){d(b,0)}function d(b,A){const B=r.newAttributes,z=r.enabledAttributes,W=r.attributeDivisors;B[b]=1,z[b]===0&&(i.enableVertexAttribArray(b),z[b]=1),W[b]!==A&&(i.vertexAttribDivisor(b,A),W[b]=A)}function M(){const b=r.newAttributes,A=r.enabledAttributes;for(let B=0,z=A.length;B<z;B++)A[B]!==b[B]&&(i.disableVertexAttribArray(B),A[B]=0)}function y(b,A,B,z,W,q,H){H===!0?i.vertexAttribIPointer(b,A,B,W,q):i.vertexAttribPointer(b,A,B,z,W,q)}function w(b,A,B,z){g();const W=z.attributes,q=B.getAttributes(),H=A.defaultAttributeValues;for(const ee in q){const V=q[ee];if(V.location>=0){let ne=W[ee];if(ne===void 0&&(ee==="instanceMatrix"&&b.instanceMatrix&&(ne=b.instanceMatrix),ee==="instanceColor"&&b.instanceColor&&(ne=b.instanceColor)),ne!==void 0){const ie=ne.normalized,ve=ne.itemSize,Be=e.get(ne);if(Be===void 0)continue;const Ze=Be.buffer,tt=Be.type,nt=Be.bytesPerElement,Z=tt===i.INT||tt===i.UNSIGNED_INT||ne.gpuType===vo;if(ne.isInterleavedBufferAttribute){const $=ne.data,pe=$.stride,Ie=ne.offset;if($.isInstancedInterleavedBuffer){for(let be=0;be<V.locationSize;be++)d(V.location+be,$.meshPerAttribute);b.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let be=0;be<V.locationSize;be++)m(V.location+be);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let be=0;be<V.locationSize;be++)y(V.location+be,ve/V.locationSize,tt,ie,pe*nt,(Ie+ve/V.locationSize*be)*nt,Z)}else{if(ne.isInstancedBufferAttribute){for(let $=0;$<V.locationSize;$++)d(V.location+$,ne.meshPerAttribute);b.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let $=0;$<V.locationSize;$++)m(V.location+$);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let $=0;$<V.locationSize;$++)y(V.location+$,ve/V.locationSize,tt,ie,ve*nt,ve/V.locationSize*$*nt,Z)}}else if(H!==void 0){const ie=H[ee];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(V.location,ie);break;case 3:i.vertexAttrib3fv(V.location,ie);break;case 4:i.vertexAttrib4fv(V.location,ie);break;default:i.vertexAttrib1fv(V.location,ie)}}}}M()}function P(){U();for(const b in n){const A=n[b];for(const B in A){const z=A[B];for(const W in z)h(z[W].object),delete z[W];delete A[B]}delete n[b]}}function E(b){if(n[b.id]===void 0)return;const A=n[b.id];for(const B in A){const z=A[B];for(const W in z)h(z[W].object),delete z[W];delete A[B]}delete n[b.id]}function C(b){for(const A in n){const B=n[A];if(B[b.id]===void 0)continue;const z=B[b.id];for(const W in z)h(z[W].object),delete z[W];delete B[b.id]}}function U(){S(),a=!0,r!==s&&(r=s,l(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:U,resetDefaultState:S,dispose:P,releaseStatesOfGeometry:E,releaseStatesOfProgram:C,initAttributes:g,enableAttribute:m,disableUnusedAttributes:M}}function Xf(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function a(l,h,f){f!==0&&(i.drawArraysInstanced(n,l,h,f),t.update(h,n,f))}function o(l,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let p=0;for(let x=0;x<f;x++)p+=h[x];t.update(p,n,1)}function c(l,h,f,u){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<l.length;x++)a(l[x],h[x],u[x]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,f);let x=0;for(let g=0;g<f;g++)x+=h[g]*u[g];t.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function qf(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==xn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const U=C===us&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==An&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Hn&&!U)}function c(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Le("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=x>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:x,maxTextureSize:g,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:w,vertexTextures:P,maxSamples:E}}function Yf(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Mi,o=new Ne,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const p=f.length!==0||u||n!==0||s;return s=u,n=f.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){t=h(f,u,0)},this.setState=function(f,u,p){const x=f.clippingPlanes,g=f.clipIntersection,m=f.clipShadows,d=i.get(f);if(!s||x===null||x.length===0||r&&!m)r?h(null):l();else{const M=r?0:n,y=M*4;let w=d.clippingState||null;c.value=w,w=h(x,u,y,p);for(let P=0;P!==y;++P)w[P]=t[P];d.clippingState=w,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=M}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,u,p,x){const g=f!==null?f.length:0;let m=null;if(g!==0){if(m=c.value,x!==!0||m===null){const d=p+g*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<d)&&(m=new Float32Array(d));for(let y=0,w=p;y!==g;++y,w+=4)a.copy(f[y]).applyMatrix4(M,o),a.normal.toArray(m,w),m[w+3]=a.constant}c.value=m,c.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function Zf(i){let e=new WeakMap;function t(a,o){return o===Fa?a.mapping=ss:o===Oa&&(a.mapping=rs),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Fa||o===Oa)if(e.has(a)){const c=e.get(a).texture;return t(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Gh(c.height);return l.fromEquirectangularTexture(i,a),e.set(a,l),a.addEventListener("dispose",s),t(l.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const ri=4,P0=[.125,.215,.35,.446,.526,.582],Si=20,jf=256,Ss=new Nc,L0=new Xe;let xa=null,ga=0,_a=0,va=!1;const Kf=new F;class D0{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Kf}=r;xa=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,o),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=N0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=I0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(xa,ga,_a),this._renderer.xr.enabled=va,e.scissorTest=!1,Zi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ss||e.mapping===rs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xa=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:us,format:xn,colorSpace:os,depthBuffer:!1},s=U0(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=U0(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=$f(r)),this._blurMaterial=Qf(r,e,t),this._ggxMaterial=Jf(r,e,t)}return s}_compileMaterial(e){const t=new jt(new Tt,e);this._renderer.compile(t,Ss)}_sceneToCubeUV(e,t,n,s,r){const c=new tn(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,p=f.toneMapping;f.getClearColor(L0),f.toneMapping=li,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new jt(new ps,new ls({name:"PMREM.Background",side:Ot,depthWrite:!1,depthTest:!1})));const g=this._backgroundBox,m=g.material;let d=!1;const M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,d=!0):(m.color.copy(L0),d=!0);for(let y=0;y<6;y++){const w=y%3;w===0?(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[y],r.y,r.z)):w===1?(c.up.set(0,0,l[y]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[y],r.z)):(c.up.set(0,l[y],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[y]));const P=this._cubeSize;Zi(s,w*P,y>2?P:0,P,P),f.setRenderTarget(s),d&&f.render(g,c),f.render(e,c)}f.toneMapping=p,f.autoClear=u,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===ss||e.mapping===rs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=N0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=I0());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const c=this._cubeSize;Zi(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(a,Ss)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const c=a.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(l*l-h*h),u=.05+l*.95,p=f*u,{_lodMax:x}=this,g=this._sizeLods[n],m=3*g*(n>x-ri?n-x+ri:0),d=4*(this._cubeSize-g);c.envMap.value=e.texture,c.roughness.value=p,c.mipInt.value=x-t,Zi(r,m,d,3*g,2*g),s.setRenderTarget(r),s.render(o,Ss),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=x-n,Zi(e,m,d,3*g,2*g),s.setRenderTarget(e),s.render(o,Ss)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&xt("blur direction must be either latitudinal or longitudinal!");const h=3,f=this._lodMeshes[s];f.material=l;const u=l.uniforms,p=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Si-1),g=r/x,m=isFinite(r)?1+Math.floor(h*g):Si;m>Si&&Le(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);const d=[];let M=0;for(let C=0;C<Si;++C){const U=C/g,S=Math.exp(-U*U/2);d.push(S),C===0?M+=S:C<m&&(M+=2*S)}for(let C=0;C<d.length;C++)d[C]=d[C]/M;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=d,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:y}=this;u.dTheta.value=x,u.mipInt.value=y-n;const w=this._sizeLods[s],P=3*w*(s>y-ri?s-y+ri:0),E=4*(this._cubeSize-w);Zi(t,P,E,3*w,2*w),c.setRenderTarget(t),c.render(f,Ss)}}function $f(i){const e=[],t=[],n=[];let s=i;const r=i-ri+1+P0.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let c=1/o;a>i-ri?c=P0[a-i+ri-1]:a===0&&(c=0),t.push(c);const l=1/(o-2),h=-l,f=1+l,u=[h,h,f,h,f,f,h,h,f,f,h,f],p=6,x=6,g=3,m=2,d=1,M=new Float32Array(g*x*p),y=new Float32Array(m*x*p),w=new Float32Array(d*x*p);for(let E=0;E<p;E++){const C=E%3*2/3-1,U=E>2?0:-1,S=[C,U,0,C+2/3,U,0,C+2/3,U+1,0,C,U,0,C+2/3,U+1,0,C,U+1,0];M.set(S,g*x*E),y.set(u,m*x*E);const b=[E,E,E,E,E,E];w.set(b,d*x*E)}const P=new Tt;P.setAttribute("position",new ut(M,g)),P.setAttribute("uv",new ut(y,m)),P.setAttribute("faceIndex",new ut(w,d)),n.push(new jt(P,null)),s>ri&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function U0(i,e,t){const n=new Ai(i,e,t);return n.texture.mapping=Ir,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Jf(i,e,t){return new qn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:jf,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Or(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Qf(i,e,t){const n=new Float32Array(Si),s=new F(0,1,0);return new qn({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Or(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function I0(){return new qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Or(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function N0(){return new qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Or(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Or(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function e1(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===Fa||c===Oa,h=c===ss||c===rs;if(l||h){let f=e.get(o);const u=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new D0(i)),f=l?t.fromEquirectangular(o,f):t.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const p=o.image;return l&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new D0(i)),f=l?t.fromEquirectangular(o):t.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",r),f.texture):null}}}return o}function s(o){let c=0;const l=6;for(let h=0;h<l;h++)o[h]!==void 0&&c++;return c===l}function r(o){const c=o.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function t1(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Is("WebGLRenderer: "+n+" extension not supported."),s}}}function n1(i,e,t,n){const s={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&e.remove(u.index);for(const x in u.attributes)e.remove(u.attributes[x]);u.removeEventListener("dispose",a),delete s[u.id];const p=r.get(u);p&&(e.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(f,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function c(f){const u=f.attributes;for(const p in u)e.update(u[p],i.ARRAY_BUFFER)}function l(f){const u=[],p=f.index,x=f.attributes.position;let g=0;if(p!==null){const M=p.array;g=p.version;for(let y=0,w=M.length;y<w;y+=3){const P=M[y+0],E=M[y+1],C=M[y+2];u.push(P,E,E,C,C,P)}}else if(x!==void 0){const M=x.array;g=x.version;for(let y=0,w=M.length/3-1;y<w;y+=3){const P=y+0,E=y+1,C=y+2;u.push(P,E,E,C,C,P)}}else return;const m=new(yc(u)?Ac:wc)(u,1);m.version=g;const d=r.get(f);d&&e.remove(d),r.set(f,m)}function h(f){const u=r.get(f);if(u){const p=f.index;p!==null&&u.version<p.version&&l(f)}else l(f);return r.get(f)}return{get:o,update:c,getWireframeAttribute:h}}function i1(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function c(u,p){i.drawElements(n,p,r,u*a),t.update(p,n,1)}function l(u,p,x){x!==0&&(i.drawElementsInstanced(n,p,r,u*a,x),t.update(p,n,x))}function h(u,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,u,0,x);let m=0;for(let d=0;d<x;d++)m+=p[d];t.update(m,n,1)}function f(u,p,x,g){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<u.length;d++)l(u[d]/a,p[d],g[d]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,u,0,g,0,x);let d=0;for(let M=0;M<x;M++)d+=p[M]*g[M];t.update(d,n,1)}}this.setMode=s,this.setIndex=o,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function s1(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:xt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function r1(i,e,t){const n=new WeakMap,s=new gt;function r(a,o,c){const l=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==f){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};u!==void 0&&u.texture.dispose();const p=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],d=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let y=0;p===!0&&(y=1),x===!0&&(y=2),g===!0&&(y=3);let w=o.attributes.position.count*y,P=1;w>e.maxTextureSize&&(P=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const E=new Float32Array(w*P*4*f),C=new Ec(E,w,P,f);C.type=Hn,C.needsUpdate=!0;const U=y*4;for(let b=0;b<f;b++){const A=m[b],B=d[b],z=M[b],W=w*P*4*b;for(let q=0;q<A.count;q++){const H=q*U;p===!0&&(s.fromBufferAttribute(A,q),E[W+H+0]=s.x,E[W+H+1]=s.y,E[W+H+2]=s.z,E[W+H+3]=0),x===!0&&(s.fromBufferAttribute(B,q),E[W+H+4]=s.x,E[W+H+5]=s.y,E[W+H+6]=s.z,E[W+H+7]=0),g===!0&&(s.fromBufferAttribute(z,q),E[W+H+8]=s.x,E[W+H+9]=s.y,E[W+H+10]=s.z,E[W+H+11]=z.itemSize===4?s.w:1)}}u={count:f,texture:C,size:new Fe(w,P)},n.set(o,u),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let g=0;g<l.length;g++)p+=l[g];const x=o.morphTargetsRelative?1:1-p;c.getUniforms().setValue(i,"morphTargetBaseInfluence",x),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function a1(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,f=e.get(c,h);if(s.get(f)!==l&&(e.update(f),s.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return f}function a(){s=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:a}}const Oc=new yt,F0=new Dc(1,1),Bc=new Ec,kc=new Th,zc=new Pc,O0=[],B0=[],k0=new Float32Array(16),z0=new Float32Array(9),V0=new Float32Array(4);function ms(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=O0[s];if(r===void 0&&(r=new Float32Array(s),O0[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function vt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Mt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Br(i,e){let t=B0[e];t===void 0&&(t=new Int32Array(e),B0[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function o1(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function c1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2fv(this.addr,e),Mt(t,e)}}function l1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vt(t,e))return;i.uniform3fv(this.addr,e),Mt(t,e)}}function h1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4fv(this.addr,e),Mt(t,e)}}function u1(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,n))return;V0.set(n),i.uniformMatrix2fv(this.addr,!1,V0),Mt(t,n)}}function d1(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,n))return;z0.set(n),i.uniformMatrix3fv(this.addr,!1,z0),Mt(t,n)}}function f1(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,n))return;k0.set(n),i.uniformMatrix4fv(this.addr,!1,k0),Mt(t,n)}}function p1(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function m1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2iv(this.addr,e),Mt(t,e)}}function x1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;i.uniform3iv(this.addr,e),Mt(t,e)}}function g1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4iv(this.addr,e),Mt(t,e)}}function _1(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function v1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2uiv(this.addr,e),Mt(t,e)}}function M1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;i.uniform3uiv(this.addr,e),Mt(t,e)}}function b1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4uiv(this.addr,e),Mt(t,e)}}function S1(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(F0.compareFunction=Sc,r=F0):r=Oc,t.setTexture2D(e||r,s)}function y1(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||kc,s)}function E1(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||zc,s)}function T1(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Bc,s)}function w1(i){switch(i){case 5126:return o1;case 35664:return c1;case 35665:return l1;case 35666:return h1;case 35674:return u1;case 35675:return d1;case 35676:return f1;case 5124:case 35670:return p1;case 35667:case 35671:return m1;case 35668:case 35672:return x1;case 35669:case 35673:return g1;case 5125:return _1;case 36294:return v1;case 36295:return M1;case 36296:return b1;case 35678:case 36198:case 36298:case 36306:case 35682:return S1;case 35679:case 36299:case 36307:return y1;case 35680:case 36300:case 36308:case 36293:return E1;case 36289:case 36303:case 36311:case 36292:return T1}}function A1(i,e){i.uniform1fv(this.addr,e)}function C1(i,e){const t=ms(e,this.size,2);i.uniform2fv(this.addr,t)}function R1(i,e){const t=ms(e,this.size,3);i.uniform3fv(this.addr,t)}function P1(i,e){const t=ms(e,this.size,4);i.uniform4fv(this.addr,t)}function L1(i,e){const t=ms(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function D1(i,e){const t=ms(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function U1(i,e){const t=ms(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function I1(i,e){i.uniform1iv(this.addr,e)}function N1(i,e){i.uniform2iv(this.addr,e)}function F1(i,e){i.uniform3iv(this.addr,e)}function O1(i,e){i.uniform4iv(this.addr,e)}function B1(i,e){i.uniform1uiv(this.addr,e)}function k1(i,e){i.uniform2uiv(this.addr,e)}function z1(i,e){i.uniform3uiv(this.addr,e)}function V1(i,e){i.uniform4uiv(this.addr,e)}function G1(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Oc,r[a])}function H1(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||kc,r[a])}function W1(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||zc,r[a])}function X1(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Bc,r[a])}function q1(i){switch(i){case 5126:return A1;case 35664:return C1;case 35665:return R1;case 35666:return P1;case 35674:return L1;case 35675:return D1;case 35676:return U1;case 5124:case 35670:return I1;case 35667:case 35671:return N1;case 35668:case 35672:return F1;case 35669:case 35673:return O1;case 5125:return B1;case 36294:return k1;case 36295:return z1;case 36296:return V1;case 35678:case 36198:case 36298:case 36306:case 35682:return G1;case 35679:case 36299:case 36307:return H1;case 35680:case 36300:case 36308:case 36293:return W1;case 36289:case 36303:case 36311:case 36292:return X1}}class Y1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=w1(t.type)}}class Z1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=q1(t.type)}}class j1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Ma=/(\w+)(\])?(\[|\.)?/g;function G0(i,e){i.seq.push(e),i.map[e.id]=e}function K1(i,e,t){const n=i.name,s=n.length;for(Ma.lastIndex=0;;){const r=Ma.exec(n),a=Ma.lastIndex;let o=r[1];const c=r[2]==="]",l=r[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===s){G0(t,l===void 0?new Y1(o,i,e):new Z1(o,i,e));break}else{let f=t.map[o];f===void 0&&(f=new j1(o),G0(t,f)),t=f}}}class Sr{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);K1(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function H0(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const $1=37297;let J1=0;function Q1(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const W0=new Ne;function ep(i){Ye._getMatrix(W0,Ye.workingColorSpace,i);const e=`mat3( ${W0.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(i)){case Ar:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function X0(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Q1(i.getShaderSource(e),o)}else return r}function tp(i,e){const t=ep(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function np(i,e){let t;switch(e){case kl:t="Linear";break;case zl:t="Reinhard";break;case Vl:t="Cineon";break;case dc:t="ACESFilmic";break;case Hl:t="AgX";break;case Wl:t="Neutral";break;case Gl:t="Custom";break;default:Le("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ur=new F;function ip(){Ye.getLuminanceCoefficients(ur);const i=ur.x.toFixed(4),e=ur.y.toFixed(4),t=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Ts).join(`
`)}function rp(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ap(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Ts(i){return i!==""}function q0(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Y0(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const op=/^[ \t]*#include +<([\w\d./]+)>/gm;function mo(i){return i.replace(op,lp)}const cp=new Map;function lp(i,e){let t=Oe[e];if(t===void 0){const n=cp.get(e);if(n!==void 0)t=Oe[n],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return mo(t)}const hp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Z0(i){return i.replace(hp,up)}function up(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function j0(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function dp(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===lc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===hc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===On&&(e="SHADOWMAP_TYPE_VSM"),e}function fp(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ss:case rs:e="ENVMAP_TYPE_CUBE";break;case Ir:e="ENVMAP_TYPE_CUBE_UV";break}return e}function pp(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===rs&&(e="ENVMAP_MODE_REFRACTION"),e}function mp(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case uc:e="ENVMAP_BLENDING_MULTIPLY";break;case Ol:e="ENVMAP_BLENDING_MIX";break;case Bl:e="ENVMAP_BLENDING_ADD";break}return e}function xp(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function gp(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const c=dp(t),l=fp(t),h=pp(t),f=mp(t),u=xp(t),p=sp(t),x=rp(r),g=s.createProgram();let m,d,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Ts).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Ts).join(`
`),d.length>0&&(d+=`
`)):(m=[j0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Ts).join(`
`),d=[j0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==li?"#define TONE_MAPPING":"",t.toneMapping!==li?Oe.tonemapping_pars_fragment:"",t.toneMapping!==li?np("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,tp("linearToOutputTexel",t.outputColorSpace),ip(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Ts).join(`
`)),a=mo(a),a=q0(a,t),a=Y0(a,t),o=mo(o),o=q0(o,t),o=Y0(o,t),a=Z0(a),o=Z0(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",t.glslVersion===i0?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===i0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=M+m+a,w=M+d+o,P=H0(s,s.VERTEX_SHADER,y),E=H0(s,s.FRAGMENT_SHADER,w);s.attachShader(g,P),s.attachShader(g,E),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function C(A){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(g)||"",z=s.getShaderInfoLog(P)||"",W=s.getShaderInfoLog(E)||"",q=B.trim(),H=z.trim(),ee=W.trim();let V=!0,ne=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,P,E);else{const ie=X0(s,P,"vertex"),ve=X0(s,E,"fragment");xt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+q+`
`+ie+`
`+ve)}else q!==""?Le("WebGLProgram: Program Info Log:",q):(H===""||ee==="")&&(ne=!1);ne&&(A.diagnostics={runnable:V,programLog:q,vertexShader:{log:H,prefix:m},fragmentShader:{log:ee,prefix:d}})}s.deleteShader(P),s.deleteShader(E),U=new Sr(s,g),S=ap(s,g)}let U;this.getUniforms=function(){return U===void 0&&C(this),U};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(g,$1)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=J1++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=P,this.fragmentShader=E,this}let _p=0;class vp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Mp(e),t.set(e,n)),n}}class Mp{constructor(e){this.id=_p++,this.code=e,this.usedTimes=0}}function bp(i,e,t,n,s,r,a){const o=new Ro,c=new vp,l=new Set,h=[],f=s.logarithmicDepthBuffer,u=s.vertexTextures;let p=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return l.add(S),S===0?"uv":`uv${S}`}function m(S,b,A,B,z){const W=B.fog,q=z.geometry,H=S.isMeshStandardMaterial?B.environment:null,ee=(S.isMeshStandardMaterial?t:e).get(S.envMap||H),V=ee&&ee.mapping===Ir?ee.image.height:null,ne=x[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&Le("WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const ie=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ve=ie!==void 0?ie.length:0;let Be=0;q.morphAttributes.position!==void 0&&(Be=1),q.morphAttributes.normal!==void 0&&(Be=2),q.morphAttributes.color!==void 0&&(Be=3);let Ze,tt,nt,Z;if(ne){const Ke=bn[ne];Ze=Ke.vertexShader,tt=Ke.fragmentShader}else Ze=S.vertexShader,tt=S.fragmentShader,c.update(S),nt=c.getVertexShaderID(S),Z=c.getFragmentShaderID(S);const $=i.getRenderTarget(),pe=i.state.buffers.depth.getReversed(),Ie=z.isInstancedMesh===!0,be=z.isBatchedMesh===!0,ze=!!S.map,wt=!!S.matcap,ke=!!ee,at=!!S.aoMap,R=!!S.lightMap,Ve=!!S.bumpMap,Ge=!!S.normalMap,it=!!S.displacementMap,ge=!!S.emissiveMap,ot=!!S.metalnessMap,ye=!!S.roughnessMap,Ue=S.anisotropy>0,T=S.clearcoat>0,_=S.dispersion>0,O=S.iridescence>0,Y=S.sheen>0,K=S.transmission>0,X=Ue&&!!S.anisotropyMap,Me=T&&!!S.clearcoatMap,le=T&&!!S.clearcoatNormalMap,Ee=T&&!!S.clearcoatRoughnessMap,_e=O&&!!S.iridescenceMap,J=O&&!!S.iridescenceThicknessMap,re=Y&&!!S.sheenColorMap,Ce=Y&&!!S.sheenRoughnessMap,we=!!S.specularMap,de=!!S.specularColorMap,Pe=!!S.specularIntensityMap,L=K&&!!S.transmissionMap,he=K&&!!S.thicknessMap,ae=!!S.gradientMap,oe=!!S.alphaMap,te=S.alphaTest>0,j=!!S.alphaHash,me=!!S.extensions;let De=li;S.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(De=i.toneMapping);const rt={shaderID:ne,shaderType:S.type,shaderName:S.name,vertexShader:Ze,fragmentShader:tt,defines:S.defines,customVertexShaderID:nt,customFragmentShaderID:Z,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:be,batchingColor:be&&z._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&z.instanceColor!==null,instancingMorph:Ie&&z.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:os,alphaToCoverage:!!S.alphaToCoverage,map:ze,matcap:wt,envMap:ke,envMapMode:ke&&ee.mapping,envMapCubeUVHeight:V,aoMap:at,lightMap:R,bumpMap:Ve,normalMap:Ge,displacementMap:u&&it,emissiveMap:ge,normalMapObjectSpace:Ge&&S.normalMapType===Zl,normalMapTangentSpace:Ge&&S.normalMapType===bc,metalnessMap:ot,roughnessMap:ye,anisotropy:Ue,anisotropyMap:X,clearcoat:T,clearcoatMap:Me,clearcoatNormalMap:le,clearcoatRoughnessMap:Ee,dispersion:_,iridescence:O,iridescenceMap:_e,iridescenceThicknessMap:J,sheen:Y,sheenColorMap:re,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:de,specularIntensityMap:Pe,transmission:K,transmissionMap:L,thicknessMap:he,gradientMap:ae,opaque:S.transparent===!1&&S.blending===es&&S.alphaToCoverage===!1,alphaMap:oe,alphaTest:te,alphaHash:j,combine:S.combine,mapUv:ze&&g(S.map.channel),aoMapUv:at&&g(S.aoMap.channel),lightMapUv:R&&g(S.lightMap.channel),bumpMapUv:Ve&&g(S.bumpMap.channel),normalMapUv:Ge&&g(S.normalMap.channel),displacementMapUv:it&&g(S.displacementMap.channel),emissiveMapUv:ge&&g(S.emissiveMap.channel),metalnessMapUv:ot&&g(S.metalnessMap.channel),roughnessMapUv:ye&&g(S.roughnessMap.channel),anisotropyMapUv:X&&g(S.anisotropyMap.channel),clearcoatMapUv:Me&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:le&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:J&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:re&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&g(S.sheenRoughnessMap.channel),specularMapUv:we&&g(S.specularMap.channel),specularColorMapUv:de&&g(S.specularColorMap.channel),specularIntensityMapUv:Pe&&g(S.specularIntensityMap.channel),transmissionMapUv:L&&g(S.transmissionMap.channel),thicknessMapUv:he&&g(S.thicknessMap.channel),alphaMapUv:oe&&g(S.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Ge||Ue),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!q.attributes.uv&&(ze||oe),fog:!!W,useFog:S.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:pe,skinning:z.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Be,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:De,decodeVideoTexture:ze&&S.map.isVideoTexture===!0&&Ye.getTransfer(S.map.colorSpace)===Je,decodeVideoTextureEmissive:ge&&S.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(S.emissiveMap.colorSpace)===Je,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===mt,flipSided:S.side===Ot,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:me&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&S.extensions.multiDraw===!0||be)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return rt.vertexUv1s=l.has(1),rt.vertexUv2s=l.has(2),rt.vertexUv3s=l.has(3),l.clear(),rt}function d(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const A in S.defines)b.push(A),b.push(S.defines[A]);return S.isRawShaderMaterial===!1&&(M(b,S),y(b,S),b.push(i.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function M(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function y(S,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),S.push(o.mask)}function w(S){const b=x[S.type];let A;if(b){const B=bn[b];A=Bh.clone(B.uniforms)}else A=S.uniforms;return A}function P(S,b){let A;for(let B=0,z=h.length;B<z;B++){const W=h[B];if(W.cacheKey===b){A=W,++A.usedTimes;break}}return A===void 0&&(A=new gp(i,b,S,r),h.push(A)),A}function E(S){if(--S.usedTimes===0){const b=h.indexOf(S);h[b]=h[h.length-1],h.pop(),S.destroy()}}function C(S){c.remove(S)}function U(){c.dispose()}return{getParameters:m,getProgramCacheKey:d,getUniforms:w,acquireProgram:P,releaseProgram:E,releaseShaderCache:C,programs:h,dispose:U}}function Sp(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,c){i.get(a)[o]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function yp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function K0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function $0(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(f,u,p,x,g,m){let d=i[e];return d===void 0?(d={id:f.id,object:f,geometry:u,material:p,groupOrder:x,renderOrder:f.renderOrder,z:g,group:m},i[e]=d):(d.id=f.id,d.object=f,d.geometry=u,d.material=p,d.groupOrder=x,d.renderOrder=f.renderOrder,d.z=g,d.group=m),e++,d}function o(f,u,p,x,g,m){const d=a(f,u,p,x,g,m);p.transmission>0?n.push(d):p.transparent===!0?s.push(d):t.push(d)}function c(f,u,p,x,g,m){const d=a(f,u,p,x,g,m);p.transmission>0?n.unshift(d):p.transparent===!0?s.unshift(d):t.unshift(d)}function l(f,u){t.length>1&&t.sort(f||yp),n.length>1&&n.sort(u||K0),s.length>1&&s.sort(u||K0)}function h(){for(let f=e,u=i.length;f<u;f++){const p=i[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:h,sort:l}}function Ep(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new $0,i.set(n,[a])):s>=r.length?(a=new $0,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Tp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Xe};break;case"SpotLight":t={position:new F,direction:new F,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new F,halfWidth:new F,halfHeight:new F};break}return i[e.id]=t,t}}}function wp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Ap=0;function Cp(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Rp(i){const e=new Tp,t=wp(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new F);const s=new F,r=new dt,a=new dt;function o(l){let h=0,f=0,u=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,x=0,g=0,m=0,d=0,M=0,y=0,w=0,P=0,E=0,C=0;l.sort(Cp);for(let S=0,b=l.length;S<b;S++){const A=l[S],B=A.color,z=A.intensity,W=A.distance,q=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=B.r*z,f+=B.g*z,u+=B.b*z;else if(A.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(A.sh.coefficients[H],z);C++}else if(A.isDirectionalLight){const H=e.get(A);if(H.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ee=A.shadow,V=t.get(A);V.shadowIntensity=ee.intensity,V.shadowBias=ee.bias,V.shadowNormalBias=ee.normalBias,V.shadowRadius=ee.radius,V.shadowMapSize=ee.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=A.shadow.matrix,M++}n.directional[p]=H,p++}else if(A.isSpotLight){const H=e.get(A);H.position.setFromMatrixPosition(A.matrixWorld),H.color.copy(B).multiplyScalar(z),H.distance=W,H.coneCos=Math.cos(A.angle),H.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),H.decay=A.decay,n.spot[g]=H;const ee=A.shadow;if(A.map&&(n.spotLightMap[P]=A.map,P++,ee.updateMatrices(A),A.castShadow&&E++),n.spotLightMatrix[g]=ee.matrix,A.castShadow){const V=t.get(A);V.shadowIntensity=ee.intensity,V.shadowBias=ee.bias,V.shadowNormalBias=ee.normalBias,V.shadowRadius=ee.radius,V.shadowMapSize=ee.mapSize,n.spotShadow[g]=V,n.spotShadowMap[g]=q,w++}g++}else if(A.isRectAreaLight){const H=e.get(A);H.color.copy(B).multiplyScalar(z),H.halfWidth.set(A.width*.5,0,0),H.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=H,m++}else if(A.isPointLight){const H=e.get(A);if(H.color.copy(A.color).multiplyScalar(A.intensity),H.distance=A.distance,H.decay=A.decay,A.castShadow){const ee=A.shadow,V=t.get(A);V.shadowIntensity=ee.intensity,V.shadowBias=ee.bias,V.shadowNormalBias=ee.normalBias,V.shadowRadius=ee.radius,V.shadowMapSize=ee.mapSize,V.shadowCameraNear=ee.camera.near,V.shadowCameraFar=ee.camera.far,n.pointShadow[x]=V,n.pointShadowMap[x]=q,n.pointShadowMatrix[x]=A.shadow.matrix,y++}n.point[x]=H,x++}else if(A.isHemisphereLight){const H=e.get(A);H.skyColor.copy(A.color).multiplyScalar(z),H.groundColor.copy(A.groundColor).multiplyScalar(z),n.hemi[d]=H,d++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;const U=n.hash;(U.directionalLength!==p||U.pointLength!==x||U.spotLength!==g||U.rectAreaLength!==m||U.hemiLength!==d||U.numDirectionalShadows!==M||U.numPointShadows!==y||U.numSpotShadows!==w||U.numSpotMaps!==P||U.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=g,n.rectArea.length=m,n.point.length=x,n.hemi.length=d,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=w+P-E,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,U.directionalLength=p,U.pointLength=x,U.spotLength=g,U.rectAreaLength=m,U.hemiLength=d,U.numDirectionalShadows=M,U.numPointShadows=y,U.numSpotShadows=w,U.numSpotMaps=P,U.numLightProbes=C,n.version=Ap++)}function c(l,h){let f=0,u=0,p=0,x=0,g=0;const m=h.matrixWorldInverse;for(let d=0,M=l.length;d<M;d++){const y=l[d];if(y.isDirectionalLight){const w=n.directional[f];w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),f++}else if(y.isSpotLight){const w=n.spot[p];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),p++}else if(y.isRectAreaLight){const w=n.rectArea[x];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),a.identity(),r.copy(y.matrixWorld),r.premultiply(m),a.extractRotation(r),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){const w=n.point[u];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),u++}else if(y.isHemisphereLight){const w=n.hemi[g];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(m),g++}}}return{setup:o,setupView:c,state:n}}function J0(i){const e=new Rp(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:o,setupLightsView:c,pushLight:r,pushShadow:a}}function Pp(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new J0(i),e.set(s,[o])):r>=a.length?(o=new J0(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Lp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Dp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Up(i,e,t){let n=new Po;const s=new Fe,r=new Fe,a=new gt,o=new $h({depthPacking:Yl}),c=new Jh,l={},h=t.maxTextureSize,f={[_n]:Ot,[Ot]:_n,[mt]:mt},u=new qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:Lp,fragmentShader:Dp}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const x=new Tt;x.setAttribute("position",new ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new jt(x,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lc;let d=this.type;this.render=function(E,C,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const S=i.getRenderTarget(),b=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),B=i.state;B.setBlending(Wn),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const z=d!==On&&this.type===On,W=d===On&&this.type!==On;for(let q=0,H=E.length;q<H;q++){const ee=E[q],V=ee.shadow;if(V===void 0){Le("WebGLShadowMap:",ee,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ne=V.getFrameExtents();if(s.multiply(ne),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ne.x),s.x=r.x*ne.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ne.y),s.y=r.y*ne.y,V.mapSize.y=r.y)),V.map===null||z===!0||W===!0){const ve=this.type!==On?{minFilter:qt,magFilter:qt}:{};V.map!==null&&V.map.dispose(),V.map=new Ai(s.x,s.y,ve),V.map.texture.name=ee.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ie=V.getViewportCount();for(let ve=0;ve<ie;ve++){const Be=V.getViewport(ve);a.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),B.viewport(a),V.updateMatrices(ee,ve),n=V.getFrustum(),w(C,U,V.camera,ee,this.type)}V.isPointLightShadow!==!0&&this.type===On&&M(V,U),V.needsUpdate=!1}d=this.type,m.needsUpdate=!1,i.setRenderTarget(S,b,A)};function M(E,C){const U=e.update(g);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ai(s.x,s.y)),u.uniforms.shadow_pass.value=E.map.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(C,null,U,u,g,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(C,null,U,p,g,null)}function y(E,C,U,S){let b=null;const A=U.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(A!==void 0)b=A;else if(b=U.isPointLight===!0?c:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const B=b.uuid,z=C.uuid;let W=l[B];W===void 0&&(W={},l[B]=W);let q=W[z];q===void 0&&(q=b.clone(),W[z]=q,C.addEventListener("dispose",P)),b=q}if(b.visible=C.visible,b.wireframe=C.wireframe,S===On?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:f[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,U.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const B=i.properties.get(b);B.light=U}return b}function w(E,C,U,S,b){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===On)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,E.matrixWorld);const z=e.update(E),W=E.material;if(Array.isArray(W)){const q=z.groups;for(let H=0,ee=q.length;H<ee;H++){const V=q[H],ne=W[V.materialIndex];if(ne&&ne.visible){const ie=y(E,ne,S,b);E.onBeforeShadow(i,E,C,U,z,ie,V),i.renderBufferDirect(U,null,z,ie,E,V),E.onAfterShadow(i,E,C,U,z,ie,V)}}}else if(W.visible){const q=y(E,W,S,b);E.onBeforeShadow(i,E,C,U,z,q,null),i.renderBufferDirect(U,null,z,q,E,null),E.onAfterShadow(i,E,C,U,z,q,null)}}const B=E.children;for(let z=0,W=B.length;z<W;z++)w(B[z],C,U,S,b)}function P(E){E.target.removeEventListener("dispose",P);for(const U in l){const S=l[U],b=E.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}const Ip={[Ra]:Pa,[La]:Ia,[Da]:Na,[is]:Ua,[Pa]:Ra,[Ia]:La,[Na]:Da,[Ua]:is};function Np(i,e){function t(){let L=!1;const he=new gt;let ae=null;const oe=new gt(0,0,0,0);return{setMask:function(te){ae!==te&&!L&&(i.colorMask(te,te,te,te),ae=te)},setLocked:function(te){L=te},setClear:function(te,j,me,De,rt){rt===!0&&(te*=De,j*=De,me*=De),he.set(te,j,me,De),oe.equals(he)===!1&&(i.clearColor(te,j,me,De),oe.copy(he))},reset:function(){L=!1,ae=null,oe.set(-1,0,0,0)}}}function n(){let L=!1,he=!1,ae=null,oe=null,te=null;return{setReversed:function(j){if(he!==j){const me=e.get("EXT_clip_control");j?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),he=j;const De=te;te=null,this.setClear(De)}},getReversed:function(){return he},setTest:function(j){j?$(i.DEPTH_TEST):pe(i.DEPTH_TEST)},setMask:function(j){ae!==j&&!L&&(i.depthMask(j),ae=j)},setFunc:function(j){if(he&&(j=Ip[j]),oe!==j){switch(j){case Ra:i.depthFunc(i.NEVER);break;case Pa:i.depthFunc(i.ALWAYS);break;case La:i.depthFunc(i.LESS);break;case is:i.depthFunc(i.LEQUAL);break;case Da:i.depthFunc(i.EQUAL);break;case Ua:i.depthFunc(i.GEQUAL);break;case Ia:i.depthFunc(i.GREATER);break;case Na:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}oe=j}},setLocked:function(j){L=j},setClear:function(j){te!==j&&(he&&(j=1-j),i.clearDepth(j),te=j)},reset:function(){L=!1,ae=null,oe=null,te=null,he=!1}}}function s(){let L=!1,he=null,ae=null,oe=null,te=null,j=null,me=null,De=null,rt=null;return{setTest:function(Ke){L||(Ke?$(i.STENCIL_TEST):pe(i.STENCIL_TEST))},setMask:function(Ke){he!==Ke&&!L&&(i.stencilMask(Ke),he=Ke)},setFunc:function(Ke,Mn,on){(ae!==Ke||oe!==Mn||te!==on)&&(i.stencilFunc(Ke,Mn,on),ae=Ke,oe=Mn,te=on)},setOp:function(Ke,Mn,on){(j!==Ke||me!==Mn||De!==on)&&(i.stencilOp(Ke,Mn,on),j=Ke,me=Mn,De=on)},setLocked:function(Ke){L=Ke},setClear:function(Ke){rt!==Ke&&(i.clearStencil(Ke),rt=Ke)},reset:function(){L=!1,he=null,ae=null,oe=null,te=null,j=null,me=null,De=null,rt=null}}}const r=new t,a=new n,o=new s,c=new WeakMap,l=new WeakMap;let h={},f={},u=new WeakMap,p=[],x=null,g=!1,m=null,d=null,M=null,y=null,w=null,P=null,E=null,C=new Xe(0,0,0),U=0,S=!1,b=null,A=null,B=null,z=null,W=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,ee=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=ee>=1):V.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=ee>=2);let ne=null,ie={};const ve=i.getParameter(i.SCISSOR_BOX),Be=i.getParameter(i.VIEWPORT),Ze=new gt().fromArray(ve),tt=new gt().fromArray(Be);function nt(L,he,ae,oe){const te=new Uint8Array(4),j=i.createTexture();i.bindTexture(L,j),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let me=0;me<ae;me++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(he,0,i.RGBA,1,1,oe,0,i.RGBA,i.UNSIGNED_BYTE,te):i.texImage2D(he+me,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,te);return j}const Z={};Z[i.TEXTURE_2D]=nt(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),$(i.DEPTH_TEST),a.setFunc(is),Ve(!1),Ge($o),$(i.CULL_FACE),at(Wn);function $(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function pe(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function Ie(L,he){return f[L]!==he?(i.bindFramebuffer(L,he),f[L]=he,L===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=he),L===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=he),!0):!1}function be(L,he){let ae=p,oe=!1;if(L){ae=u.get(he),ae===void 0&&(ae=[],u.set(he,ae));const te=L.textures;if(ae.length!==te.length||ae[0]!==i.COLOR_ATTACHMENT0){for(let j=0,me=te.length;j<me;j++)ae[j]=i.COLOR_ATTACHMENT0+j;ae.length=te.length,oe=!0}}else ae[0]!==i.BACK&&(ae[0]=i.BACK,oe=!0);oe&&i.drawBuffers(ae)}function ze(L){return x!==L?(i.useProgram(L),x=L,!0):!1}const wt={[bi]:i.FUNC_ADD,[Ml]:i.FUNC_SUBTRACT,[bl]:i.FUNC_REVERSE_SUBTRACT};wt[Sl]=i.MIN,wt[yl]=i.MAX;const ke={[El]:i.ZERO,[Tl]:i.ONE,[wl]:i.SRC_COLOR,[Aa]:i.SRC_ALPHA,[Dl]:i.SRC_ALPHA_SATURATE,[Pl]:i.DST_COLOR,[Cl]:i.DST_ALPHA,[Al]:i.ONE_MINUS_SRC_COLOR,[Ca]:i.ONE_MINUS_SRC_ALPHA,[Ll]:i.ONE_MINUS_DST_COLOR,[Rl]:i.ONE_MINUS_DST_ALPHA,[Ul]:i.CONSTANT_COLOR,[Il]:i.ONE_MINUS_CONSTANT_COLOR,[Nl]:i.CONSTANT_ALPHA,[Fl]:i.ONE_MINUS_CONSTANT_ALPHA};function at(L,he,ae,oe,te,j,me,De,rt,Ke){if(L===Wn){g===!0&&(pe(i.BLEND),g=!1);return}if(g===!1&&($(i.BLEND),g=!0),L!==vl){if(L!==m||Ke!==S){if((d!==bi||w!==bi)&&(i.blendEquation(i.FUNC_ADD),d=bi,w=bi),Ke)switch(L){case es:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Jo:i.blendFunc(i.ONE,i.ONE);break;case Qo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case e0:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:xt("WebGLState: Invalid blending: ",L);break}else switch(L){case es:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Jo:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Qo:xt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case e0:xt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:xt("WebGLState: Invalid blending: ",L);break}M=null,y=null,P=null,E=null,C.set(0,0,0),U=0,m=L,S=Ke}return}te=te||he,j=j||ae,me=me||oe,(he!==d||te!==w)&&(i.blendEquationSeparate(wt[he],wt[te]),d=he,w=te),(ae!==M||oe!==y||j!==P||me!==E)&&(i.blendFuncSeparate(ke[ae],ke[oe],ke[j],ke[me]),M=ae,y=oe,P=j,E=me),(De.equals(C)===!1||rt!==U)&&(i.blendColor(De.r,De.g,De.b,rt),C.copy(De),U=rt),m=L,S=!1}function R(L,he){L.side===mt?pe(i.CULL_FACE):$(i.CULL_FACE);let ae=L.side===Ot;he&&(ae=!ae),Ve(ae),L.blending===es&&L.transparent===!1?at(Wn):at(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const oe=L.stencilWrite;o.setTest(oe),oe&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ge(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?$(i.SAMPLE_ALPHA_TO_COVERAGE):pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ve(L){b!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),b=L)}function Ge(L){L!==gl?($(i.CULL_FACE),L!==A&&(L===$o?i.cullFace(i.BACK):L===_l?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pe(i.CULL_FACE),A=L}function it(L){L!==B&&(H&&i.lineWidth(L),B=L)}function ge(L,he,ae){L?($(i.POLYGON_OFFSET_FILL),(z!==he||W!==ae)&&(i.polygonOffset(he,ae),z=he,W=ae)):pe(i.POLYGON_OFFSET_FILL)}function ot(L){L?$(i.SCISSOR_TEST):pe(i.SCISSOR_TEST)}function ye(L){L===void 0&&(L=i.TEXTURE0+q-1),ne!==L&&(i.activeTexture(L),ne=L)}function Ue(L,he,ae){ae===void 0&&(ne===null?ae=i.TEXTURE0+q-1:ae=ne);let oe=ie[ae];oe===void 0&&(oe={type:void 0,texture:void 0},ie[ae]=oe),(oe.type!==L||oe.texture!==he)&&(ne!==ae&&(i.activeTexture(ae),ne=ae),i.bindTexture(L,he||Z[L]),oe.type=L,oe.texture=he)}function T(){const L=ie[ne];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function Y(){try{i.texSubImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function K(){try{i.texSubImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function Me(){try{i.compressedTexSubImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function le(){try{i.texStorage2D(...arguments)}catch(L){L("WebGLState:",L)}}function Ee(){try{i.texStorage3D(...arguments)}catch(L){L("WebGLState:",L)}}function _e(){try{i.texImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function J(){try{i.texImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function re(L){Ze.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),Ze.copy(L))}function Ce(L){tt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),tt.copy(L))}function we(L,he){let ae=l.get(he);ae===void 0&&(ae=new WeakMap,l.set(he,ae));let oe=ae.get(L);oe===void 0&&(oe=i.getUniformBlockIndex(he,L.name),ae.set(L,oe))}function de(L,he){const oe=l.get(he).get(L);c.get(he)!==oe&&(i.uniformBlockBinding(he,oe,L.__bindingPointIndex),c.set(he,oe))}function Pe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ne=null,ie={},f={},u=new WeakMap,p=[],x=null,g=!1,m=null,d=null,M=null,y=null,w=null,P=null,E=null,C=new Xe(0,0,0),U=0,S=!1,b=null,A=null,B=null,z=null,W=null,Ze.set(0,0,i.canvas.width,i.canvas.height),tt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:$,disable:pe,bindFramebuffer:Ie,drawBuffers:be,useProgram:ze,setBlending:at,setMaterial:R,setFlipSided:Ve,setCullFace:Ge,setLineWidth:it,setPolygonOffset:ge,setScissorTest:ot,activeTexture:ye,bindTexture:Ue,unbindTexture:T,compressedTexImage2D:_,compressedTexImage3D:O,texImage2D:_e,texImage3D:J,updateUBOMapping:we,uniformBlockBinding:de,texStorage2D:le,texStorage3D:Ee,texSubImage2D:Y,texSubImage3D:K,compressedTexSubImage2D:X,compressedTexSubImage3D:Me,scissor:re,viewport:Ce,reset:Pe}}function Fp(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Fe,h=new WeakMap;let f;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(T,_){return p?new OffscreenCanvas(T,_):Rr("canvas")}function g(T,_,O){let Y=1;const K=Ue(T);if((K.width>O||K.height>O)&&(Y=O/Math.max(K.width,K.height)),Y<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const X=Math.floor(Y*K.width),Me=Math.floor(Y*K.height);f===void 0&&(f=x(X,Me));const le=_?x(X,Me):f;return le.width=X,le.height=Me,le.getContext("2d").drawImage(T,0,0,X,Me),Le("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+X+"x"+Me+")."),le}else return"data"in T&&Le("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),T;return T}function m(T){return T.generateMipmaps}function d(T){i.generateMipmap(T)}function M(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(T,_,O,Y,K=!1){if(T!==null){if(i[T]!==void 0)return i[T];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let X=_;if(_===i.RED&&(O===i.FLOAT&&(X=i.R32F),O===i.HALF_FLOAT&&(X=i.R16F),O===i.UNSIGNED_BYTE&&(X=i.R8)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(X=i.R8UI),O===i.UNSIGNED_SHORT&&(X=i.R16UI),O===i.UNSIGNED_INT&&(X=i.R32UI),O===i.BYTE&&(X=i.R8I),O===i.SHORT&&(X=i.R16I),O===i.INT&&(X=i.R32I)),_===i.RG&&(O===i.FLOAT&&(X=i.RG32F),O===i.HALF_FLOAT&&(X=i.RG16F),O===i.UNSIGNED_BYTE&&(X=i.RG8)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(X=i.RG8UI),O===i.UNSIGNED_SHORT&&(X=i.RG16UI),O===i.UNSIGNED_INT&&(X=i.RG32UI),O===i.BYTE&&(X=i.RG8I),O===i.SHORT&&(X=i.RG16I),O===i.INT&&(X=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(X=i.RGB8UI),O===i.UNSIGNED_SHORT&&(X=i.RGB16UI),O===i.UNSIGNED_INT&&(X=i.RGB32UI),O===i.BYTE&&(X=i.RGB8I),O===i.SHORT&&(X=i.RGB16I),O===i.INT&&(X=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),O===i.UNSIGNED_INT&&(X=i.RGBA32UI),O===i.BYTE&&(X=i.RGBA8I),O===i.SHORT&&(X=i.RGBA16I),O===i.INT&&(X=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),_===i.RGBA){const Me=K?Ar:Ye.getTransfer(Y);O===i.FLOAT&&(X=i.RGBA32F),O===i.HALF_FLOAT&&(X=i.RGBA16F),O===i.UNSIGNED_BYTE&&(X=Me===Je?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function w(T,_){let O;return T?_===null||_===wi||_===Ls?O=i.DEPTH24_STENCIL8:_===Hn?O=i.DEPTH32F_STENCIL8:_===Ps&&(O=i.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===wi||_===Ls?O=i.DEPTH_COMPONENT24:_===Hn?O=i.DEPTH_COMPONENT32F:_===Ps&&(O=i.DEPTH_COMPONENT16),O}function P(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==qt&&T.minFilter!==sn?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function E(T){const _=T.target;_.removeEventListener("dispose",E),U(_),_.isVideoTexture&&h.delete(_)}function C(T){const _=T.target;_.removeEventListener("dispose",C),b(_)}function U(T){const _=n.get(T);if(_.__webglInit===void 0)return;const O=T.source,Y=u.get(O);if(Y){const K=Y[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&S(T),Object.keys(Y).length===0&&u.delete(O)}n.remove(T)}function S(T){const _=n.get(T);i.deleteTexture(_.__webglTexture);const O=T.source,Y=u.get(O);delete Y[_.__cacheKey],a.memory.textures--}function b(T){const _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(_.__webglFramebuffer[Y]))for(let K=0;K<_.__webglFramebuffer[Y].length;K++)i.deleteFramebuffer(_.__webglFramebuffer[Y][K]);else i.deleteFramebuffer(_.__webglFramebuffer[Y]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[Y])}else{if(Array.isArray(_.__webglFramebuffer))for(let Y=0;Y<_.__webglFramebuffer.length;Y++)i.deleteFramebuffer(_.__webglFramebuffer[Y]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let Y=0;Y<_.__webglColorRenderbuffer.length;Y++)_.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[Y]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=T.textures;for(let Y=0,K=O.length;Y<K;Y++){const X=n.get(O[Y]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),a.memory.textures--),n.remove(O[Y])}n.remove(T)}let A=0;function B(){A=0}function z(){const T=A;return T>=s.maxTextures&&Le("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),A+=1,T}function W(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function q(T,_){const O=n.get(T);if(T.isVideoTexture&&ot(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&O.__version!==T.version){const Y=T.image;if(Y===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{Z(O,T,_);return}}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function H(T,_){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){Z(O,T,_);return}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function ee(T,_){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){Z(O,T,_);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function V(T,_){const O=n.get(T);if(T.version>0&&O.__version!==T.version){$(O,T,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}const ne={[as]:i.REPEAT,[Gn]:i.CLAMP_TO_EDGE,[Ba]:i.MIRRORED_REPEAT},ie={[qt]:i.NEAREST,[Xl]:i.NEAREST_MIPMAP_NEAREST,[Ws]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[Xr]:i.LINEAR_MIPMAP_NEAREST,[Ei]:i.LINEAR_MIPMAP_LINEAR},ve={[jl]:i.NEVER,[th]:i.ALWAYS,[Kl]:i.LESS,[Sc]:i.LEQUAL,[$l]:i.EQUAL,[eh]:i.GEQUAL,[Jl]:i.GREATER,[Ql]:i.NOTEQUAL};function Be(T,_){if(_.type===Hn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===sn||_.magFilter===Xr||_.magFilter===Ws||_.magFilter===Ei||_.minFilter===sn||_.minFilter===Xr||_.minFilter===Ws||_.minFilter===Ei)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,ne[_.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,ne[_.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,ne[_.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ie[_.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ie[_.minFilter]),_.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ve[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===qt||_.minFilter!==Ws&&_.minFilter!==Ei||_.type===Hn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Ze(T,_){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",E));const Y=_.source;let K=u.get(Y);K===void 0&&(K={},u.set(Y,K));const X=W(_);if(X!==T.__cacheKey){K[X]===void 0&&(K[X]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),K[X].usedTimes++;const Me=K[T.__cacheKey];Me!==void 0&&(K[T.__cacheKey].usedTimes--,Me.usedTimes===0&&S(_)),T.__cacheKey=X,T.__webglTexture=K[X].texture}return O}function tt(T,_,O){return Math.floor(Math.floor(T/O)/_)}function nt(T,_,O,Y){const X=T.updateRanges;if(X.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,Y,_.data);else{X.sort((J,re)=>J.start-re.start);let Me=0;for(let J=1;J<X.length;J++){const re=X[Me],Ce=X[J],we=re.start+re.count,de=tt(Ce.start,_.width,4),Pe=tt(re.start,_.width,4);Ce.start<=we+1&&de===Pe&&tt(Ce.start+Ce.count-1,_.width,4)===de?re.count=Math.max(re.count,Ce.start+Ce.count-re.start):(++Me,X[Me]=Ce)}X.length=Me+1;const le=i.getParameter(i.UNPACK_ROW_LENGTH),Ee=i.getParameter(i.UNPACK_SKIP_PIXELS),_e=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let J=0,re=X.length;J<re;J++){const Ce=X[J],we=Math.floor(Ce.start/4),de=Math.ceil(Ce.count/4),Pe=we%_.width,L=Math.floor(we/_.width),he=de,ae=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pe),i.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,Pe,L,he,ae,O,Y,_.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,le),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ee),i.pixelStorei(i.UNPACK_SKIP_ROWS,_e)}}function Z(T,_,O){let Y=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(Y=i.TEXTURE_3D);const K=Ze(T,_),X=_.source;t.bindTexture(Y,T.__webglTexture,i.TEXTURE0+O);const Me=n.get(X);if(X.version!==Me.__version||K===!0){t.activeTexture(i.TEXTURE0+O);const le=Ye.getPrimaries(Ye.workingColorSpace),Ee=_.colorSpace===ni?null:Ye.getPrimaries(_.colorSpace),_e=_.colorSpace===ni||le===Ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);let J=g(_.image,!1,s.maxTextureSize);J=ye(_,J);const re=r.convert(_.format,_.colorSpace),Ce=r.convert(_.type);let we=y(_.internalFormat,re,Ce,_.colorSpace,_.isVideoTexture);Be(Y,_);let de;const Pe=_.mipmaps,L=_.isVideoTexture!==!0,he=Me.__version===void 0||K===!0,ae=X.dataReady,oe=P(_,J);if(_.isDepthTexture)we=w(_.format===Us,_.type),he&&(L?t.texStorage2D(i.TEXTURE_2D,1,we,J.width,J.height):t.texImage2D(i.TEXTURE_2D,0,we,J.width,J.height,0,re,Ce,null));else if(_.isDataTexture)if(Pe.length>0){L&&he&&t.texStorage2D(i.TEXTURE_2D,oe,we,Pe[0].width,Pe[0].height);for(let te=0,j=Pe.length;te<j;te++)de=Pe[te],L?ae&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,de.width,de.height,re,Ce,de.data):t.texImage2D(i.TEXTURE_2D,te,we,de.width,de.height,0,re,Ce,de.data);_.generateMipmaps=!1}else L?(he&&t.texStorage2D(i.TEXTURE_2D,oe,we,J.width,J.height),ae&&nt(_,J,re,Ce)):t.texImage2D(i.TEXTURE_2D,0,we,J.width,J.height,0,re,Ce,J.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){L&&he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,we,Pe[0].width,Pe[0].height,J.depth);for(let te=0,j=Pe.length;te<j;te++)if(de=Pe[te],_.format!==xn)if(re!==null)if(L){if(ae)if(_.layerUpdates.size>0){const me=R0(de.width,de.height,_.format,_.type);for(const De of _.layerUpdates){const rt=de.data.subarray(De*me/de.data.BYTES_PER_ELEMENT,(De+1)*me/de.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,De,de.width,de.height,1,re,rt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,de.width,de.height,J.depth,re,de.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,we,de.width,de.height,J.depth,0,de.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?ae&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,de.width,de.height,J.depth,re,Ce,de.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,we,de.width,de.height,J.depth,0,re,Ce,de.data)}else{L&&he&&t.texStorage2D(i.TEXTURE_2D,oe,we,Pe[0].width,Pe[0].height);for(let te=0,j=Pe.length;te<j;te++)de=Pe[te],_.format!==xn?re!==null?L?ae&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,de.width,de.height,re,de.data):t.compressedTexImage2D(i.TEXTURE_2D,te,we,de.width,de.height,0,de.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?ae&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,de.width,de.height,re,Ce,de.data):t.texImage2D(i.TEXTURE_2D,te,we,de.width,de.height,0,re,Ce,de.data)}else if(_.isDataArrayTexture)if(L){if(he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,we,J.width,J.height,J.depth),ae)if(_.layerUpdates.size>0){const te=R0(J.width,J.height,_.format,_.type);for(const j of _.layerUpdates){const me=J.data.subarray(j*te/J.data.BYTES_PER_ELEMENT,(j+1)*te/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,J.width,J.height,1,re,Ce,me)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,re,Ce,J.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,we,J.width,J.height,J.depth,0,re,Ce,J.data);else if(_.isData3DTexture)L?(he&&t.texStorage3D(i.TEXTURE_3D,oe,we,J.width,J.height,J.depth),ae&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,re,Ce,J.data)):t.texImage3D(i.TEXTURE_3D,0,we,J.width,J.height,J.depth,0,re,Ce,J.data);else if(_.isFramebufferTexture){if(he)if(L)t.texStorage2D(i.TEXTURE_2D,oe,we,J.width,J.height);else{let te=J.width,j=J.height;for(let me=0;me<oe;me++)t.texImage2D(i.TEXTURE_2D,me,we,te,j,0,re,Ce,null),te>>=1,j>>=1}}else if(Pe.length>0){if(L&&he){const te=Ue(Pe[0]);t.texStorage2D(i.TEXTURE_2D,oe,we,te.width,te.height)}for(let te=0,j=Pe.length;te<j;te++)de=Pe[te],L?ae&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,re,Ce,de):t.texImage2D(i.TEXTURE_2D,te,we,re,Ce,de);_.generateMipmaps=!1}else if(L){if(he){const te=Ue(J);t.texStorage2D(i.TEXTURE_2D,oe,we,te.width,te.height)}ae&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,re,Ce,J)}else t.texImage2D(i.TEXTURE_2D,0,we,re,Ce,J);m(_)&&d(Y),Me.__version=X.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function $(T,_,O){if(_.image.length!==6)return;const Y=Ze(T,_),K=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+O);const X=n.get(K);if(K.version!==X.__version||Y===!0){t.activeTexture(i.TEXTURE0+O);const Me=Ye.getPrimaries(Ye.workingColorSpace),le=_.colorSpace===ni?null:Ye.getPrimaries(_.colorSpace),Ee=_.colorSpace===ni||Me===le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);const _e=_.isCompressedTexture||_.image[0].isCompressedTexture,J=_.image[0]&&_.image[0].isDataTexture,re=[];for(let j=0;j<6;j++)!_e&&!J?re[j]=g(_.image[j],!0,s.maxCubemapSize):re[j]=J?_.image[j].image:_.image[j],re[j]=ye(_,re[j]);const Ce=re[0],we=r.convert(_.format,_.colorSpace),de=r.convert(_.type),Pe=y(_.internalFormat,we,de,_.colorSpace),L=_.isVideoTexture!==!0,he=X.__version===void 0||Y===!0,ae=K.dataReady;let oe=P(_,Ce);Be(i.TEXTURE_CUBE_MAP,_);let te;if(_e){L&&he&&t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,Pe,Ce.width,Ce.height);for(let j=0;j<6;j++){te=re[j].mipmaps;for(let me=0;me<te.length;me++){const De=te[me];_.format!==xn?we!==null?L?ae&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,0,0,De.width,De.height,we,De.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,Pe,De.width,De.height,0,De.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,0,0,De.width,De.height,we,de,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,Pe,De.width,De.height,0,we,de,De.data)}}}else{if(te=_.mipmaps,L&&he){te.length>0&&oe++;const j=Ue(re[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,Pe,j.width,j.height)}for(let j=0;j<6;j++)if(J){L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,re[j].width,re[j].height,we,de,re[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Pe,re[j].width,re[j].height,0,we,de,re[j].data);for(let me=0;me<te.length;me++){const rt=te[me].image[j].image;L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,0,0,rt.width,rt.height,we,de,rt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,Pe,rt.width,rt.height,0,we,de,rt.data)}}else{L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,we,de,re[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Pe,we,de,re[j]);for(let me=0;me<te.length;me++){const De=te[me];L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,0,0,we,de,De.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,Pe,we,de,De.image[j])}}}m(_)&&d(i.TEXTURE_CUBE_MAP),X.__version=K.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function pe(T,_,O,Y,K,X){const Me=r.convert(O.format,O.colorSpace),le=r.convert(O.type),Ee=y(O.internalFormat,Me,le,O.colorSpace),_e=n.get(_),J=n.get(O);if(J.__renderTarget=_,!_e.__hasExternalTextures){const re=Math.max(1,_.width>>X),Ce=Math.max(1,_.height>>X);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,X,Ee,re,Ce,_.depth,0,Me,le,null):t.texImage2D(K,X,Ee,re,Ce,0,Me,le,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),ge(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,K,J.__webglTexture,0,it(_)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,K,J.__webglTexture,X),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(T,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,T),_.depthBuffer){const Y=_.depthTexture,K=Y&&Y.isDepthTexture?Y.type:null,X=w(_.stencilBuffer,K),Me=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=it(_);ge(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,le,X,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,le,X,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,X,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Me,i.RENDERBUFFER,T)}else{const Y=_.textures;for(let K=0;K<Y.length;K++){const X=Y[K],Me=r.convert(X.format,X.colorSpace),le=r.convert(X.type),Ee=y(X.internalFormat,Me,le,X.colorSpace),_e=it(_);O&&ge(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,_e,Ee,_.width,_.height):ge(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_e,Ee,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Ee,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function be(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(_.depthTexture);Y.__renderTarget=_,(!Y.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),q(_.depthTexture,0);const K=Y.__webglTexture,X=it(_);if(_.depthTexture.format===Ds)ge(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(_.depthTexture.format===Us)ge(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function ze(T){const _=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const Y=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),Y){const K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,Y.removeEventListener("dispose",K)};Y.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=Y}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const Y=T.texture.mipmaps;Y&&Y.length>0?be(_.__webglFramebuffer[0],T):be(_.__webglFramebuffer,T)}else if(O){_.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[Y]),_.__webglDepthbuffer[Y]===void 0)_.__webglDepthbuffer[Y]=i.createRenderbuffer(),Ie(_.__webglDepthbuffer[Y],T,!1);else{const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=_.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,X)}}else{const Y=T.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Ie(_.__webglDepthbuffer,T,!1);else{const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,X)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(T,_,O){const Y=n.get(T);_!==void 0&&pe(Y.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&ze(T)}function ke(T){const _=T.texture,O=n.get(T),Y=n.get(_);T.addEventListener("dispose",C);const K=T.textures,X=T.isWebGLCubeRenderTarget===!0,Me=K.length>1;if(Me||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=_.version,a.memory.textures++),X){O.__webglFramebuffer=[];for(let le=0;le<6;le++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[le]=[];for(let Ee=0;Ee<_.mipmaps.length;Ee++)O.__webglFramebuffer[le][Ee]=i.createFramebuffer()}else O.__webglFramebuffer[le]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let le=0;le<_.mipmaps.length;le++)O.__webglFramebuffer[le]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Me)for(let le=0,Ee=K.length;le<Ee;le++){const _e=n.get(K[le]);_e.__webglTexture===void 0&&(_e.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&ge(T)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let le=0;le<K.length;le++){const Ee=K[le];O.__webglColorRenderbuffer[le]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[le]);const _e=r.convert(Ee.format,Ee.colorSpace),J=r.convert(Ee.type),re=y(Ee.internalFormat,_e,J,Ee.colorSpace,T.isXRRenderTarget===!0),Ce=it(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,re,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.RENDERBUFFER,O.__webglColorRenderbuffer[le])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ie(O.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Be(i.TEXTURE_CUBE_MAP,_);for(let le=0;le<6;le++)if(_.mipmaps&&_.mipmaps.length>0)for(let Ee=0;Ee<_.mipmaps.length;Ee++)pe(O.__webglFramebuffer[le][Ee],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ee);else pe(O.__webglFramebuffer[le],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);m(_)&&d(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let le=0,Ee=K.length;le<Ee;le++){const _e=K[le],J=n.get(_e);let re=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(re=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(re,J.__webglTexture),Be(re,_e),pe(O.__webglFramebuffer,T,_e,i.COLOR_ATTACHMENT0+le,re,0),m(_e)&&d(re)}t.unbindTexture()}else{let le=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(le=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,Y.__webglTexture),Be(le,_),_.mipmaps&&_.mipmaps.length>0)for(let Ee=0;Ee<_.mipmaps.length;Ee++)pe(O.__webglFramebuffer[Ee],T,_,i.COLOR_ATTACHMENT0,le,Ee);else pe(O.__webglFramebuffer,T,_,i.COLOR_ATTACHMENT0,le,0);m(_)&&d(le),t.unbindTexture()}T.depthBuffer&&ze(T)}function at(T){const _=T.textures;for(let O=0,Y=_.length;O<Y;O++){const K=_[O];if(m(K)){const X=M(T),Me=n.get(K).__webglTexture;t.bindTexture(X,Me),d(X),t.unbindTexture()}}}const R=[],Ve=[];function Ge(T){if(T.samples>0){if(ge(T)===!1){const _=T.textures,O=T.width,Y=T.height;let K=i.COLOR_BUFFER_BIT;const X=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=n.get(T),le=_.length>1;if(le)for(let _e=0;_e<_.length;_e++)t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);const Ee=T.texture.mipmaps;Ee&&Ee.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let _e=0;_e<_.length;_e++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),le){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Me.__webglColorRenderbuffer[_e]);const J=n.get(_[_e]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,J,0)}i.blitFramebuffer(0,0,O,Y,0,0,O,Y,K,i.NEAREST),c===!0&&(R.length=0,Ve.length=0,R.push(i.COLOR_ATTACHMENT0+_e),T.depthBuffer&&T.resolveDepthBuffer===!1&&(R.push(X),Ve.push(X),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ve)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,R))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),le)for(let _e=0;_e<_.length;_e++){t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,Me.__webglColorRenderbuffer[_e]);const J=n.get(_[_e]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,J,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&c){const _=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function it(T){return Math.min(s.maxSamples,T.samples)}function ge(T){const _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function ot(T){const _=a.render.frame;h.get(T)!==_&&(h.set(T,_),T.update())}function ye(T,_){const O=T.colorSpace,Y=T.format,K=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==os&&O!==ni&&(Ye.getTransfer(O)===Je?(Y!==xn||K!==An)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):xt("WebGLTextures: Unsupported texture color space:",O)),_}function Ue(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(l.width=T.naturalWidth||T.width,l.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(l.width=T.displayWidth,l.height=T.displayHeight):(l.width=T.width,l.height=T.height),l}this.allocateTextureUnit=z,this.resetTextureUnits=B,this.setTexture2D=q,this.setTexture2DArray=H,this.setTexture3D=ee,this.setTextureCube=V,this.rebindTextures=wt,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=at,this.updateMultisampleRenderTarget=Ge,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=ge}function Op(i,e){function t(n,s=ni){let r;const a=Ye.getTransfer(s);if(n===An)return i.UNSIGNED_BYTE;if(n===Mo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===bo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===pc)return i.BYTE;if(n===mc)return i.SHORT;if(n===Ps)return i.UNSIGNED_SHORT;if(n===vo)return i.INT;if(n===wi)return i.UNSIGNED_INT;if(n===Hn)return i.FLOAT;if(n===us)return i.HALF_FLOAT;if(n===_c)return i.ALPHA;if(n===vc)return i.RGB;if(n===xn)return i.RGBA;if(n===Ds)return i.DEPTH_COMPONENT;if(n===Us)return i.DEPTH_STENCIL;if(n===Mc)return i.RED;if(n===So)return i.RED_INTEGER;if(n===yo)return i.RG;if(n===Eo)return i.RG_INTEGER;if(n===To)return i.RGBA_INTEGER;if(n===_r||n===vr||n===Mr||n===br)if(a===Je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===_r)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===_r)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Mr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===br)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ka||n===za||n===Va||n===Ga)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ka)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===za)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Va)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ga)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ha||n===Wa||n===Xa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ha||n===Wa)return a===Je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Xa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===qa||n===Ya||n===Za||n===ja||n===Ka||n===$a||n===Ja||n===Qa||n===eo||n===to||n===no||n===io||n===so||n===ro)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===qa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ya)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Za)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ja)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ka)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$a)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ja)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===eo)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===to)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===no)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===io)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===so)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ro)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ao||n===oo||n===co)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ao)return a===Je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===oo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===co)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===lo||n===ho||n===uo||n===fo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===lo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ho)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===uo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===fo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ls?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Bp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,kp=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class zp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Uc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new qn({vertexShader:Bp,fragmentShader:kp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new jt(new gn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Vp extends Di{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",c=1,l=null,h=null,f=null,u=null,p=null,x=null;const g=typeof XRWebGLBinding<"u",m=new zp,d={},M=t.getContextAttributes();let y=null,w=null;const P=[],E=[],C=new Fe;let U=null;const S=new tn;S.viewport=new gt;const b=new tn;b.viewport=new gt;const A=[S,b],B=new nu;let z=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let $=P[Z];return $===void 0&&($=new da,P[Z]=$),$.getTargetRaySpace()},this.getControllerGrip=function(Z){let $=P[Z];return $===void 0&&($=new da,P[Z]=$),$.getGripSpace()},this.getHand=function(Z){let $=P[Z];return $===void 0&&($=new da,P[Z]=$),$.getHandSpace()};function q(Z){const $=E.indexOf(Z.inputSource);if($===-1)return;const pe=P[$];pe!==void 0&&(pe.update(Z.inputSource,Z.frame,l||a),pe.dispatchEvent({type:Z.type,data:Z.inputSource}))}function H(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",ee);for(let Z=0;Z<P.length;Z++){const $=E[Z];$!==null&&(E[Z]=null,P[Z].disconnect($))}z=null,W=null,m.reset();for(const Z in d)delete d[Z];e.setRenderTarget(y),p=null,u=null,f=null,s=null,w=null,nt.stop(),n.isPresenting=!1,e.setPixelRatio(U),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return f===null&&g&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",H),s.addEventListener("inputsourceschange",ee),M.xrCompatible!==!0&&await t.makeXRCompatible(),U=e.getPixelRatio(),e.getSize(C),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Ie=null,be=null;M.depth&&(be=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=M.stencil?Us:Ds,Ie=M.stencil?Ls:wi);const ze={colorFormat:t.RGBA8,depthFormat:be,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(ze),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),w=new Ai(u.textureWidth,u.textureHeight,{format:xn,type:An,depthTexture:new Dc(u.textureWidth,u.textureHeight,Ie,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const pe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,pe),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),w=new Ai(p.framebufferWidth,p.framebufferHeight,{format:xn,type:An,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await s.requestReferenceSpace(o),nt.setContext(s),nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ee(Z){for(let $=0;$<Z.removed.length;$++){const pe=Z.removed[$],Ie=E.indexOf(pe);Ie>=0&&(E[Ie]=null,P[Ie].disconnect(pe))}for(let $=0;$<Z.added.length;$++){const pe=Z.added[$];let Ie=E.indexOf(pe);if(Ie===-1){for(let ze=0;ze<P.length;ze++)if(ze>=E.length){E.push(pe),Ie=ze;break}else if(E[ze]===null){E[ze]=pe,Ie=ze;break}if(Ie===-1)break}const be=P[Ie];be&&be.connect(pe)}}const V=new F,ne=new F;function ie(Z,$,pe){V.setFromMatrixPosition($.matrixWorld),ne.setFromMatrixPosition(pe.matrixWorld);const Ie=V.distanceTo(ne),be=$.projectionMatrix.elements,ze=pe.projectionMatrix.elements,wt=be[14]/(be[10]-1),ke=be[14]/(be[10]+1),at=(be[9]+1)/be[5],R=(be[9]-1)/be[5],Ve=(be[8]-1)/be[0],Ge=(ze[8]+1)/ze[0],it=wt*Ve,ge=wt*Ge,ot=Ie/(-Ve+Ge),ye=ot*-Ve;if($.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ye),Z.translateZ(ot),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),be[10]===-1)Z.projectionMatrix.copy($.projectionMatrix),Z.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const Ue=wt+ot,T=ke+ot,_=it-ye,O=ge+(Ie-ye),Y=at*ke/T*Ue,K=R*ke/T*Ue;Z.projectionMatrix.makePerspective(_,O,Y,K,Ue,T),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ve(Z,$){$===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices($.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let $=Z.near,pe=Z.far;m.texture!==null&&(m.depthNear>0&&($=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),B.near=b.near=S.near=$,B.far=b.far=S.far=pe,(z!==B.near||W!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),z=B.near,W=B.far),B.layers.mask=Z.layers.mask|6,S.layers.mask=B.layers.mask&3,b.layers.mask=B.layers.mask&5;const Ie=Z.parent,be=B.cameras;ve(B,Ie);for(let ze=0;ze<be.length;ze++)ve(be[ze],Ie);be.length===2?ie(B,S,b):B.projectionMatrix.copy(S.projectionMatrix),Be(Z,B,Ie)};function Be(Z,$,pe){pe===null?Z.matrix.copy($.matrixWorld):(Z.matrix.copy(pe.matrixWorld),Z.matrix.invert(),Z.matrix.multiply($.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy($.projectionMatrix),Z.projectionMatrixInverse.copy($.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Ns*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(u===null&&p===null))return c},this.setFoveation=function(Z){c=Z,u!==null&&(u.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(Z){return d[Z]};let Ze=null;function tt(Z,$){if(h=$.getViewerPose(l||a),x=$,h!==null){const pe=h.views;p!==null&&(e.setRenderTargetFramebuffer(w,p.framebuffer),e.setRenderTarget(w));let Ie=!1;pe.length!==B.cameras.length&&(B.cameras.length=0,Ie=!0);for(let ke=0;ke<pe.length;ke++){const at=pe[ke];let R=null;if(p!==null)R=p.getViewport(at);else{const Ge=f.getViewSubImage(u,at);R=Ge.viewport,ke===0&&(e.setRenderTargetTextures(w,Ge.colorTexture,Ge.depthStencilTexture),e.setRenderTarget(w))}let Ve=A[ke];Ve===void 0&&(Ve=new tn,Ve.layers.enable(ke),Ve.viewport=new gt,A[ke]=Ve),Ve.matrix.fromArray(at.transform.matrix),Ve.matrix.decompose(Ve.position,Ve.quaternion,Ve.scale),Ve.projectionMatrix.fromArray(at.projectionMatrix),Ve.projectionMatrixInverse.copy(Ve.projectionMatrix).invert(),Ve.viewport.set(R.x,R.y,R.width,R.height),ke===0&&(B.matrix.copy(Ve.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Ie===!0&&B.cameras.push(Ve)}const be=s.enabledFeatures;if(be&&be.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&g){f=n.getBinding();const ke=f.getDepthInformation(pe[0]);ke&&ke.isValid&&ke.texture&&m.init(ke,s.renderState)}if(be&&be.includes("camera-access")&&g){e.state.unbindTexture(),f=n.getBinding();for(let ke=0;ke<pe.length;ke++){const at=pe[ke].camera;if(at){let R=d[at];R||(R=new Uc,d[at]=R);const Ve=f.getCameraImage(at);R.sourceTexture=Ve}}}}for(let pe=0;pe<P.length;pe++){const Ie=E[pe],be=P[pe];Ie!==null&&be!==void 0&&be.update(Ie,$,l||a)}Ze&&Ze(Z,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),x=null}const nt=new Fc;nt.setAnimationLoop(tt),this.setAnimationLoop=function(Z){Ze=Z},this.dispose=function(){}}}const vi=new Cn,Gp=new dt;function Hp(i,e){function t(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function n(m,d){d.color.getRGB(m.fogColor.value,Cc(i)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function s(m,d,M,y,w){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(m,d):d.isMeshToonMaterial?(r(m,d),f(m,d)):d.isMeshPhongMaterial?(r(m,d),h(m,d)):d.isMeshStandardMaterial?(r(m,d),u(m,d),d.isMeshPhysicalMaterial&&p(m,d,w)):d.isMeshMatcapMaterial?(r(m,d),x(m,d)):d.isMeshDepthMaterial?r(m,d):d.isMeshDistanceMaterial?(r(m,d),g(m,d)):d.isMeshNormalMaterial?r(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?c(m,d,M,y):d.isSpriteMaterial?l(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,t(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===Ot&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,t(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===Ot&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,t(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,t(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const M=e.get(d),y=M.envMap,w=M.envMapRotation;y&&(m.envMap.value=y,vi.copy(w),vi.x*=-1,vi.y*=-1,vi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),m.envMapRotation.value.setFromMatrix4(Gp.makeRotationFromEuler(vi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function c(m,d,M,y){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*M,m.scale.value=y*.5,d.map&&(m.map.value=d.map,t(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function l(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,t(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,t(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function u(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function p(m,d,M){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ot&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,d){d.matcap&&(m.matcap.value=d.matcap)}function g(m,d){const M=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Wp(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(M,y){const w=y.program;n.uniformBlockBinding(M,w)}function l(M,y){let w=s[M.id];w===void 0&&(x(M),w=h(M),s[M.id]=w,M.addEventListener("dispose",m));const P=y.program;n.updateUBOMapping(M,P);const E=e.render.frame;r[M.id]!==E&&(u(M),r[M.id]=E)}function h(M){const y=f();M.__bindingPointIndex=y;const w=i.createBuffer(),P=M.__size,E=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,P,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,w),w}function f(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return xt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const y=s[M.id],w=M.uniforms,P=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let E=0,C=w.length;E<C;E++){const U=Array.isArray(w[E])?w[E]:[w[E]];for(let S=0,b=U.length;S<b;S++){const A=U[S];if(p(A,E,S,P)===!0){const B=A.__offset,z=Array.isArray(A.value)?A.value:[A.value];let W=0;for(let q=0;q<z.length;q++){const H=z[q],ee=g(H);typeof H=="number"||typeof H=="boolean"?(A.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,B+W,A.__data)):H.isMatrix3?(A.__data[0]=H.elements[0],A.__data[1]=H.elements[1],A.__data[2]=H.elements[2],A.__data[3]=0,A.__data[4]=H.elements[3],A.__data[5]=H.elements[4],A.__data[6]=H.elements[5],A.__data[7]=0,A.__data[8]=H.elements[6],A.__data[9]=H.elements[7],A.__data[10]=H.elements[8],A.__data[11]=0):(H.toArray(A.__data,W),W+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,y,w,P){const E=M.value,C=y+"_"+w;if(P[C]===void 0)return typeof E=="number"||typeof E=="boolean"?P[C]=E:P[C]=E.clone(),!0;{const U=P[C];if(typeof E=="number"||typeof E=="boolean"){if(U!==E)return P[C]=E,!0}else if(U.equals(E)===!1)return U.copy(E),!0}return!1}function x(M){const y=M.uniforms;let w=0;const P=16;for(let C=0,U=y.length;C<U;C++){const S=Array.isArray(y[C])?y[C]:[y[C]];for(let b=0,A=S.length;b<A;b++){const B=S[b],z=Array.isArray(B.value)?B.value:[B.value];for(let W=0,q=z.length;W<q;W++){const H=z[W],ee=g(H),V=w%P,ne=V%ee.boundary,ie=V+ne;w+=ne,ie!==0&&P-ie<ee.storage&&(w+=P-ie),B.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=w,w+=ee.storage}}}const E=w%P;return E>0&&(w+=P-E),M.__size=w,M.__cache={},this}function g(M){const y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Le("WebGLRenderer: Unsupported uniform value type.",M),y}function m(M){const y=M.target;y.removeEventListener("dispose",m);const w=a.indexOf(y.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function d(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:c,update:l,dispose:d}}const Xp=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Nn=null;function qp(){return Nn===null&&(Nn=new Xh(Xp,32,32,yo,us),Nn.minFilter=sn,Nn.magFilter=sn,Nn.wrapS=Gn,Nn.wrapT=Gn,Nn.generateMipmaps=!1,Nn.needsUpdate=!0),Nn}class Yp{constructor(e={}){const{canvas:t=nh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const x=new Set([To,Eo,So]),g=new Set([An,wi,Ps,Ls,Mo,bo]),m=new Uint32Array(4),d=new Int32Array(4);let M=null,y=null;const w=[],P=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let C=!1;this._outputColorSpace=Ct;let U=0,S=0,b=null,A=-1,B=null;const z=new gt,W=new gt;let q=null;const H=new Xe(0);let ee=0,V=t.width,ne=t.height,ie=1,ve=null,Be=null;const Ze=new gt(0,0,V,ne),tt=new gt(0,0,V,ne);let nt=!1;const Z=new Po;let $=!1,pe=!1;const Ie=new dt,be=new F,ze=new gt,wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ke=!1;function at(){return b===null?ie:1}let R=n;function Ve(v,I){return t.getContext(v,I)}try{const v={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${_o}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",j,!1),t.addEventListener("webglcontextcreationerror",me,!1),R===null){const I="webgl2";if(R=Ve(I,v),R===null)throw Ve(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw v("WebGLRenderer: "+v.message),v}let Ge,it,ge,ot,ye,Ue,T,_,O,Y,K,X,Me,le,Ee,_e,J,re,Ce,we,de,Pe,L,he;function ae(){Ge=new t1(R),Ge.init(),Pe=new Op(R,Ge),it=new qf(R,Ge,e,Pe),ge=new Np(R,Ge),it.reversedDepthBuffer&&u&&ge.buffers.depth.setReversed(!0),ot=new s1(R),ye=new Sp,Ue=new Fp(R,Ge,ge,ye,it,Pe,ot),T=new Zf(E),_=new e1(E),O=new ou(R),L=new Wf(R,O),Y=new n1(R,O,ot,L),K=new a1(R,Y,O,ot),Ce=new r1(R,it,Ue),_e=new Yf(ye),X=new bp(E,T,_,Ge,it,L,_e),Me=new Hp(E,ye),le=new Ep,Ee=new Pp(Ge),re=new Hf(E,T,_,ge,K,p,c),J=new Up(E,K,it),he=new Wp(R,ot,it,ge),we=new Xf(R,Ge,ot),de=new i1(R,Ge,ot),ot.programs=X.programs,E.capabilities=it,E.extensions=Ge,E.properties=ye,E.renderLists=le,E.shadowMap=J,E.state=ge,E.info=ot}ae();const oe=new Vp(E,R);this.xr=oe,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const v=Ge.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Ge.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(v){v!==void 0&&(ie=v,this.setSize(V,ne,!1))},this.getSize=function(v){return v.set(V,ne)},this.setSize=function(v,I,k=!0){if(oe.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}V=v,ne=I,t.width=Math.floor(v*ie),t.height=Math.floor(I*ie),k===!0&&(t.style.width=v+"px",t.style.height=I+"px"),this.setViewport(0,0,v,I)},this.getDrawingBufferSize=function(v){return v.set(V*ie,ne*ie).floor()},this.setDrawingBufferSize=function(v,I,k){V=v,ne=I,ie=k,t.width=Math.floor(v*k),t.height=Math.floor(I*k),this.setViewport(0,0,v,I)},this.getCurrentViewport=function(v){return v.copy(z)},this.getViewport=function(v){return v.copy(Ze)},this.setViewport=function(v,I,k,G){v.isVector4?Ze.set(v.x,v.y,v.z,v.w):Ze.set(v,I,k,G),ge.viewport(z.copy(Ze).multiplyScalar(ie).round())},this.getScissor=function(v){return v.copy(tt)},this.setScissor=function(v,I,k,G){v.isVector4?tt.set(v.x,v.y,v.z,v.w):tt.set(v,I,k,G),ge.scissor(W.copy(tt).multiplyScalar(ie).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(v){ge.setScissorTest(nt=v)},this.setOpaqueSort=function(v){ve=v},this.setTransparentSort=function(v){Be=v},this.getClearColor=function(v){return v.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor(...arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha(...arguments)},this.clear=function(v=!0,I=!0,k=!0){let G=0;if(v){let N=!1;if(b!==null){const se=b.texture.format;N=x.has(se)}if(N){const se=b.texture.type,ue=g.has(se),xe=re.getClearColor(),fe=re.getClearAlpha(),Ae=xe.r,Re=xe.g,Se=xe.b;ue?(m[0]=Ae,m[1]=Re,m[2]=Se,m[3]=fe,R.clearBufferuiv(R.COLOR,0,m)):(d[0]=Ae,d[1]=Re,d[2]=Se,d[3]=fe,R.clearBufferiv(R.COLOR,0,d))}else G|=R.COLOR_BUFFER_BIT}I&&(G|=R.DEPTH_BUFFER_BIT),k&&(G|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",j,!1),t.removeEventListener("webglcontextcreationerror",me,!1),re.dispose(),le.dispose(),Ee.dispose(),ye.dispose(),T.dispose(),_.dispose(),K.dispose(),L.dispose(),he.dispose(),X.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Ho),oe.removeEventListener("sessionend",Wo),di.stop()};function te(v){v.preventDefault(),r0("WebGLRenderer: Context Lost."),C=!0}function j(){r0("WebGLRenderer: Context Restored."),C=!1;const v=ot.autoReset,I=J.enabled,k=J.autoUpdate,G=J.needsUpdate,N=J.type;ae(),ot.autoReset=v,J.enabled=I,J.autoUpdate=k,J.needsUpdate=G,J.type=N}function me(v){xt("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function De(v){const I=v.target;I.removeEventListener("dispose",De),rt(I)}function rt(v){Ke(v),ye.remove(v)}function Ke(v){const I=ye.get(v).programs;I!==void 0&&(I.forEach(function(k){X.releaseProgram(k)}),v.isShaderMaterial&&X.releaseShaderCache(v))}this.renderBufferDirect=function(v,I,k,G,N,se){I===null&&(I=wt);const ue=N.isMesh&&N.matrixWorld.determinant()<0,xe=al(v,I,k,G,N);ge.setMaterial(G,ue);let fe=k.index,Ae=1;if(G.wireframe===!0){if(fe=Y.getWireframeAttribute(k),fe===void 0)return;Ae=2}const Re=k.drawRange,Se=k.attributes.position;let He=Re.start*Ae,$e=(Re.start+Re.count)*Ae;se!==null&&(He=Math.max(He,se.start*Ae),$e=Math.min($e,(se.start+se.count)*Ae)),fe!==null?(He=Math.max(He,0),$e=Math.min($e,fe.count)):Se!=null&&(He=Math.max(He,0),$e=Math.min($e,Se.count));const ft=$e-He;if(ft<0||ft===1/0)return;L.setup(N,G,xe,k,fe);let pt,et=we;if(fe!==null&&(pt=O.get(fe),et=de,et.setIndex(pt)),N.isMesh)G.wireframe===!0?(ge.setLineWidth(G.wireframeLinewidth*at()),et.setMode(R.LINES)):et.setMode(R.TRIANGLES);else if(N.isLine){let Te=G.linewidth;Te===void 0&&(Te=1),ge.setLineWidth(Te*at()),N.isLineSegments?et.setMode(R.LINES):N.isLineLoop?et.setMode(R.LINE_LOOP):et.setMode(R.LINE_STRIP)}else N.isPoints?et.setMode(R.POINTS):N.isSprite&&et.setMode(R.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Is("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),et.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ge.get("WEBGL_multi_draw"))et.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Te=N._multiDrawStarts,ct=N._multiDrawCounts,qe=N._multiDrawCount,Vt=fe?O.get(fe).bytesPerElement:1,Ii=ye.get(G).currentProgram.getUniforms();for(let Gt=0;Gt<qe;Gt++)Ii.setValue(R,"_gl_DrawID",Gt),et.render(Te[Gt]/Vt,ct[Gt])}else if(N.isInstancedMesh)et.renderInstances(He,ft,N.count);else if(k.isInstancedBufferGeometry){const Te=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,ct=Math.min(k.instanceCount,Te);et.renderInstances(He,ft,ct)}else et.render(He,ft)};function Mn(v,I,k){v.transparent===!0&&v.side===mt&&v.forceSinglePass===!1?(v.side=Ot,v.needsUpdate=!0,Hs(v,I,k),v.side=_n,v.needsUpdate=!0,Hs(v,I,k),v.side=mt):Hs(v,I,k)}this.compile=function(v,I,k=null){k===null&&(k=v),y=Ee.get(k),y.init(I),P.push(y),k.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(y.pushLight(N),N.castShadow&&y.pushShadow(N))}),v!==k&&v.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(y.pushLight(N),N.castShadow&&y.pushShadow(N))}),y.setupLights();const G=new Set;return v.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const se=N.material;if(se)if(Array.isArray(se))for(let ue=0;ue<se.length;ue++){const xe=se[ue];Mn(xe,k,N),G.add(xe)}else Mn(se,k,N),G.add(se)}),y=P.pop(),G},this.compileAsync=function(v,I,k=null){const G=this.compile(v,I,k);return new Promise(N=>{function se(){if(G.forEach(function(ue){ye.get(ue).currentProgram.isReady()&&G.delete(ue)}),G.size===0){N(v);return}setTimeout(se,10)}Ge.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let on=null;function rl(v){on&&on(v)}function Ho(){di.stop()}function Wo(){di.start()}const di=new Fc;di.setAnimationLoop(rl),typeof self<"u"&&di.setContext(self),this.setAnimationLoop=function(v){on=v,oe.setAnimationLoop(v),v===null?di.stop():di.start()},oe.addEventListener("sessionstart",Ho),oe.addEventListener("sessionend",Wo),this.render=function(v,I){if(I!==void 0&&I.isCamera!==!0){xt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(I),I=oe.getCamera()),v.isScene===!0&&v.onBeforeRender(E,v,I,b),y=Ee.get(v,P.length),y.init(I),P.push(y),Ie.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Z.setFromProjectionMatrix(Ie,En,I.reversedDepth),pe=this.localClippingEnabled,$=_e.init(this.clippingPlanes,pe),M=le.get(v,w.length),M.init(),w.push(M),oe.enabled===!0&&oe.isPresenting===!0){const se=E.xr.getDepthSensingMesh();se!==null&&Hr(se,I,-1/0,E.sortObjects)}Hr(v,I,0,E.sortObjects),M.finish(),E.sortObjects===!0&&M.sort(ve,Be),ke=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,ke&&re.addToRenderList(M,v),this.info.render.frame++,$===!0&&_e.beginShadows();const k=y.state.shadowsArray;J.render(k,v,I),$===!0&&_e.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=M.opaque,N=M.transmissive;if(y.setupLights(),I.isArrayCamera){const se=I.cameras;if(N.length>0)for(let ue=0,xe=se.length;ue<xe;ue++){const fe=se[ue];qo(G,N,v,fe)}ke&&re.render(v);for(let ue=0,xe=se.length;ue<xe;ue++){const fe=se[ue];Xo(M,v,fe,fe.viewport)}}else N.length>0&&qo(G,N,v,I),ke&&re.render(v),Xo(M,v,I);b!==null&&S===0&&(Ue.updateMultisampleRenderTarget(b),Ue.updateRenderTargetMipmap(b)),v.isScene===!0&&v.onAfterRender(E,v,I),L.resetDefaultState(),A=-1,B=null,P.pop(),P.length>0?(y=P[P.length-1],$===!0&&_e.setGlobalState(E.clippingPlanes,y.state.camera)):y=null,w.pop(),w.length>0?M=w[w.length-1]:M=null};function Hr(v,I,k,G){if(v.visible===!1)return;if(v.layers.test(I.layers)){if(v.isGroup)k=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(I);else if(v.isLight)y.pushLight(v),v.castShadow&&y.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||Z.intersectsSprite(v)){G&&ze.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ie);const ue=K.update(v),xe=v.material;xe.visible&&M.push(v,ue,xe,k,ze.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||Z.intersectsObject(v))){const ue=K.update(v),xe=v.material;if(G&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),ze.copy(v.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),ze.copy(ue.boundingSphere.center)),ze.applyMatrix4(v.matrixWorld).applyMatrix4(Ie)),Array.isArray(xe)){const fe=ue.groups;for(let Ae=0,Re=fe.length;Ae<Re;Ae++){const Se=fe[Ae],He=xe[Se.materialIndex];He&&He.visible&&M.push(v,ue,He,k,ze.z,Se)}}else xe.visible&&M.push(v,ue,xe,k,ze.z,null)}}const se=v.children;for(let ue=0,xe=se.length;ue<xe;ue++)Hr(se[ue],I,k,G)}function Xo(v,I,k,G){const{opaque:N,transmissive:se,transparent:ue}=v;y.setupLightsView(k),$===!0&&_e.setGlobalState(E.clippingPlanes,k),G&&ge.viewport(z.copy(G)),N.length>0&&Gs(N,I,k),se.length>0&&Gs(se,I,k),ue.length>0&&Gs(ue,I,k),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function qo(v,I,k,G){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[G.id]===void 0&&(y.state.transmissionRenderTarget[G.id]=new Ai(1,1,{generateMipmaps:!0,type:Ge.has("EXT_color_buffer_half_float")||Ge.has("EXT_color_buffer_float")?us:An,minFilter:Ei,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace}));const se=y.state.transmissionRenderTarget[G.id],ue=G.viewport||z;se.setSize(ue.z*E.transmissionResolutionScale,ue.w*E.transmissionResolutionScale);const xe=E.getRenderTarget(),fe=E.getActiveCubeFace(),Ae=E.getActiveMipmapLevel();E.setRenderTarget(se),E.getClearColor(H),ee=E.getClearAlpha(),ee<1&&E.setClearColor(16777215,.5),E.clear(),ke&&re.render(k);const Re=E.toneMapping;E.toneMapping=li;const Se=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),y.setupLightsView(G),$===!0&&_e.setGlobalState(E.clippingPlanes,G),Gs(v,k,G),Ue.updateMultisampleRenderTarget(se),Ue.updateRenderTargetMipmap(se),Ge.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let $e=0,ft=I.length;$e<ft;$e++){const pt=I[$e],{object:et,geometry:Te,material:ct,group:qe}=pt;if(ct.side===mt&&et.layers.test(G.layers)){const Vt=ct.side;ct.side=Ot,ct.needsUpdate=!0,Yo(et,k,G,Te,ct,qe),ct.side=Vt,ct.needsUpdate=!0,He=!0}}He===!0&&(Ue.updateMultisampleRenderTarget(se),Ue.updateRenderTargetMipmap(se))}E.setRenderTarget(xe,fe,Ae),E.setClearColor(H,ee),Se!==void 0&&(G.viewport=Se),E.toneMapping=Re}function Gs(v,I,k){const G=I.isScene===!0?I.overrideMaterial:null;for(let N=0,se=v.length;N<se;N++){const ue=v[N],{object:xe,geometry:fe,group:Ae}=ue;let Re=ue.material;Re.allowOverride===!0&&G!==null&&(Re=G),xe.layers.test(k.layers)&&Yo(xe,I,k,fe,Re,Ae)}}function Yo(v,I,k,G,N,se){v.onBeforeRender(E,I,k,G,N,se),v.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),N.onBeforeRender(E,I,k,G,v,se),N.transparent===!0&&N.side===mt&&N.forceSinglePass===!1?(N.side=Ot,N.needsUpdate=!0,E.renderBufferDirect(k,I,G,N,v,se),N.side=_n,N.needsUpdate=!0,E.renderBufferDirect(k,I,G,N,v,se),N.side=mt):E.renderBufferDirect(k,I,G,N,v,se),v.onAfterRender(E,I,k,G,N,se)}function Hs(v,I,k){I.isScene!==!0&&(I=wt);const G=ye.get(v),N=y.state.lights,se=y.state.shadowsArray,ue=N.state.version,xe=X.getParameters(v,N.state,se,I,k),fe=X.getProgramCacheKey(xe);let Ae=G.programs;G.environment=v.isMeshStandardMaterial?I.environment:null,G.fog=I.fog,G.envMap=(v.isMeshStandardMaterial?_:T).get(v.envMap||G.environment),G.envMapRotation=G.environment!==null&&v.envMap===null?I.environmentRotation:v.envMapRotation,Ae===void 0&&(v.addEventListener("dispose",De),Ae=new Map,G.programs=Ae);let Re=Ae.get(fe);if(Re!==void 0){if(G.currentProgram===Re&&G.lightsStateVersion===ue)return jo(v,xe),Re}else xe.uniforms=X.getUniforms(v),v.onBeforeCompile(xe,E),Re=X.acquireProgram(xe,fe),Ae.set(fe,Re),G.uniforms=xe.uniforms;const Se=G.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Se.clippingPlanes=_e.uniform),jo(v,xe),G.needsLights=cl(v),G.lightsStateVersion=ue,G.needsLights&&(Se.ambientLightColor.value=N.state.ambient,Se.lightProbe.value=N.state.probe,Se.directionalLights.value=N.state.directional,Se.directionalLightShadows.value=N.state.directionalShadow,Se.spotLights.value=N.state.spot,Se.spotLightShadows.value=N.state.spotShadow,Se.rectAreaLights.value=N.state.rectArea,Se.ltc_1.value=N.state.rectAreaLTC1,Se.ltc_2.value=N.state.rectAreaLTC2,Se.pointLights.value=N.state.point,Se.pointLightShadows.value=N.state.pointShadow,Se.hemisphereLights.value=N.state.hemi,Se.directionalShadowMap.value=N.state.directionalShadowMap,Se.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Se.spotShadowMap.value=N.state.spotShadowMap,Se.spotLightMatrix.value=N.state.spotLightMatrix,Se.spotLightMap.value=N.state.spotLightMap,Se.pointShadowMap.value=N.state.pointShadowMap,Se.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=Re,G.uniformsList=null,Re}function Zo(v){if(v.uniformsList===null){const I=v.currentProgram.getUniforms();v.uniformsList=Sr.seqWithValue(I.seq,v.uniforms)}return v.uniformsList}function jo(v,I){const k=ye.get(v);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.batchingColor=I.batchingColor,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.instancingMorph=I.instancingMorph,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function al(v,I,k,G,N){I.isScene!==!0&&(I=wt),Ue.resetTextureUnits();const se=I.fog,ue=G.isMeshStandardMaterial?I.environment:null,xe=b===null?E.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:os,fe=(G.isMeshStandardMaterial?_:T).get(G.envMap||ue),Ae=G.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Re=!!k.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Se=!!k.morphAttributes.position,He=!!k.morphAttributes.normal,$e=!!k.morphAttributes.color;let ft=li;G.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(ft=E.toneMapping);const pt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,et=pt!==void 0?pt.length:0,Te=ye.get(G),ct=y.state.lights;if($===!0&&(pe===!0||v!==B)){const It=v===B&&G.id===A;_e.setState(G,v,It)}let qe=!1;G.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==ct.state.version||Te.outputColorSpace!==xe||N.isBatchedMesh&&Te.batching===!1||!N.isBatchedMesh&&Te.batching===!0||N.isBatchedMesh&&Te.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Te.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Te.instancing===!1||!N.isInstancedMesh&&Te.instancing===!0||N.isSkinnedMesh&&Te.skinning===!1||!N.isSkinnedMesh&&Te.skinning===!0||N.isInstancedMesh&&Te.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Te.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Te.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Te.instancingMorph===!1&&N.morphTexture!==null||Te.envMap!==fe||G.fog===!0&&Te.fog!==se||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==_e.numPlanes||Te.numIntersection!==_e.numIntersection)||Te.vertexAlphas!==Ae||Te.vertexTangents!==Re||Te.morphTargets!==Se||Te.morphNormals!==He||Te.morphColors!==$e||Te.toneMapping!==ft||Te.morphTargetsCount!==et)&&(qe=!0):(qe=!0,Te.__version=G.version);let Vt=Te.currentProgram;qe===!0&&(Vt=Hs(G,I,N));let Ii=!1,Gt=!1,xs=!1;const lt=Vt.getUniforms(),Bt=Te.uniforms;if(ge.useProgram(Vt.program)&&(Ii=!0,Gt=!0,xs=!0),G.id!==A&&(A=G.id,Gt=!0),Ii||B!==v){ge.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),lt.setValue(R,"projectionMatrix",v.projectionMatrix),lt.setValue(R,"viewMatrix",v.matrixWorldInverse);const kt=lt.map.cameraPosition;kt!==void 0&&kt.setValue(R,be.setFromMatrixPosition(v.matrixWorld)),it.logarithmicDepthBuffer&&lt.setValue(R,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&lt.setValue(R,"isOrthographic",v.isOrthographicCamera===!0),B!==v&&(B=v,Gt=!0,xs=!0)}if(N.isSkinnedMesh){lt.setOptional(R,N,"bindMatrix"),lt.setOptional(R,N,"bindMatrixInverse");const It=N.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),lt.setValue(R,"boneTexture",It.boneTexture,Ue))}N.isBatchedMesh&&(lt.setOptional(R,N,"batchingTexture"),lt.setValue(R,"batchingTexture",N._matricesTexture,Ue),lt.setOptional(R,N,"batchingIdTexture"),lt.setValue(R,"batchingIdTexture",N._indirectTexture,Ue),lt.setOptional(R,N,"batchingColorTexture"),N._colorsTexture!==null&&lt.setValue(R,"batchingColorTexture",N._colorsTexture,Ue));const Kt=k.morphAttributes;if((Kt.position!==void 0||Kt.normal!==void 0||Kt.color!==void 0)&&Ce.update(N,k,Vt),(Gt||Te.receiveShadow!==N.receiveShadow)&&(Te.receiveShadow=N.receiveShadow,lt.setValue(R,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Bt.envMap.value=fe,Bt.flipEnvMap.value=fe.isCubeTexture&&fe.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&I.environment!==null&&(Bt.envMapIntensity.value=I.environmentIntensity),Bt.dfgLUT!==void 0&&(Bt.dfgLUT.value=qp()),Gt&&(lt.setValue(R,"toneMappingExposure",E.toneMappingExposure),Te.needsLights&&ol(Bt,xs),se&&G.fog===!0&&Me.refreshFogUniforms(Bt,se),Me.refreshMaterialUniforms(Bt,G,ie,ne,y.state.transmissionRenderTarget[v.id]),Sr.upload(R,Zo(Te),Bt,Ue)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Sr.upload(R,Zo(Te),Bt,Ue),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&lt.setValue(R,"center",N.center),lt.setValue(R,"modelViewMatrix",N.modelViewMatrix),lt.setValue(R,"normalMatrix",N.normalMatrix),lt.setValue(R,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const It=G.uniformsGroups;for(let kt=0,Wr=It.length;kt<Wr;kt++){const fi=It[kt];he.update(fi,Vt),he.bind(fi,Vt)}}return Vt}function ol(v,I){v.ambientLightColor.needsUpdate=I,v.lightProbe.needsUpdate=I,v.directionalLights.needsUpdate=I,v.directionalLightShadows.needsUpdate=I,v.pointLights.needsUpdate=I,v.pointLightShadows.needsUpdate=I,v.spotLights.needsUpdate=I,v.spotLightShadows.needsUpdate=I,v.rectAreaLights.needsUpdate=I,v.hemisphereLights.needsUpdate=I}function cl(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(v,I,k){const G=ye.get(v);G.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),ye.get(v.texture).__webglTexture=I,ye.get(v.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:k,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,I){const k=ye.get(v);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0};const ll=R.createFramebuffer();this.setRenderTarget=function(v,I=0,k=0){b=v,U=I,S=k;let G=!0,N=null,se=!1,ue=!1;if(v){const fe=ye.get(v);if(fe.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(R.FRAMEBUFFER,null),G=!1;else if(fe.__webglFramebuffer===void 0)Ue.setupRenderTarget(v);else if(fe.__hasExternalTextures)Ue.rebindTextures(v,ye.get(v.texture).__webglTexture,ye.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Se=v.depthTexture;if(fe.__boundDepthTexture!==Se){if(Se!==null&&ye.has(Se)&&(v.width!==Se.image.width||v.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ue.setupDepthRenderbuffer(v)}}const Ae=v.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(ue=!0);const Re=ye.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Re[I])?N=Re[I][k]:N=Re[I],se=!0):v.samples>0&&Ue.useMultisampledRTT(v)===!1?N=ye.get(v).__webglMultisampledFramebuffer:Array.isArray(Re)?N=Re[k]:N=Re,z.copy(v.viewport),W.copy(v.scissor),q=v.scissorTest}else z.copy(Ze).multiplyScalar(ie).floor(),W.copy(tt).multiplyScalar(ie).floor(),q=nt;if(k!==0&&(N=ll),ge.bindFramebuffer(R.FRAMEBUFFER,N)&&G&&ge.drawBuffers(v,N),ge.viewport(z),ge.scissor(W),ge.setScissorTest(q),se){const fe=ye.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+I,fe.__webglTexture,k)}else if(ue){const fe=I;for(let Ae=0;Ae<v.textures.length;Ae++){const Re=ye.get(v.textures[Ae]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Ae,Re.__webglTexture,k,fe)}}else if(v!==null&&k!==0){const fe=ye.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,fe.__webglTexture,k)}A=-1},this.readRenderTargetPixels=function(v,I,k,G,N,se,ue,xe=0){if(!(v&&v.isWebGLRenderTarget)){xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=ye.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ue!==void 0&&(fe=fe[ue]),fe){ge.bindFramebuffer(R.FRAMEBUFFER,fe);try{const Ae=v.textures[xe],Re=Ae.format,Se=Ae.type;if(!it.textureFormatReadable(Re)){xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Se)){xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=v.width-G&&k>=0&&k<=v.height-N&&(v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+xe),R.readPixels(I,k,G,N,Pe.convert(Re),Pe.convert(Se),se))}finally{const Ae=b!==null?ye.get(b).__webglFramebuffer:null;ge.bindFramebuffer(R.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(v,I,k,G,N,se,ue,xe=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=ye.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ue!==void 0&&(fe=fe[ue]),fe)if(I>=0&&I<=v.width-G&&k>=0&&k<=v.height-N){ge.bindFramebuffer(R.FRAMEBUFFER,fe);const Ae=v.textures[xe],Re=Ae.format,Se=Ae.type;if(!it.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const He=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,He),R.bufferData(R.PIXEL_PACK_BUFFER,se.byteLength,R.STREAM_READ),v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+xe),R.readPixels(I,k,G,N,Pe.convert(Re),Pe.convert(Se),0);const $e=b!==null?ye.get(b).__webglFramebuffer:null;ge.bindFramebuffer(R.FRAMEBUFFER,$e);const ft=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await ih(R,ft,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,He),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,se),R.deleteBuffer(He),R.deleteSync(ft),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,I=null,k=0){const G=Math.pow(2,-k),N=Math.floor(v.image.width*G),se=Math.floor(v.image.height*G),ue=I!==null?I.x:0,xe=I!==null?I.y:0;Ue.setTexture2D(v,0),R.copyTexSubImage2D(R.TEXTURE_2D,k,0,0,ue,xe,N,se),ge.unbindTexture()};const hl=R.createFramebuffer(),ul=R.createFramebuffer();this.copyTextureToTexture=function(v,I,k=null,G=null,N=0,se=null){se===null&&(N!==0?(Is("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=N,N=0):se=0);let ue,xe,fe,Ae,Re,Se,He,$e,ft;const pt=v.isCompressedTexture?v.mipmaps[se]:v.image;if(k!==null)ue=k.max.x-k.min.x,xe=k.max.y-k.min.y,fe=k.isBox3?k.max.z-k.min.z:1,Ae=k.min.x,Re=k.min.y,Se=k.isBox3?k.min.z:0;else{const Kt=Math.pow(2,-N);ue=Math.floor(pt.width*Kt),xe=Math.floor(pt.height*Kt),v.isDataArrayTexture?fe=pt.depth:v.isData3DTexture?fe=Math.floor(pt.depth*Kt):fe=1,Ae=0,Re=0,Se=0}G!==null?(He=G.x,$e=G.y,ft=G.z):(He=0,$e=0,ft=0);const et=Pe.convert(I.format),Te=Pe.convert(I.type);let ct;I.isData3DTexture?(Ue.setTexture3D(I,0),ct=R.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Ue.setTexture2DArray(I,0),ct=R.TEXTURE_2D_ARRAY):(Ue.setTexture2D(I,0),ct=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const qe=R.getParameter(R.UNPACK_ROW_LENGTH),Vt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Ii=R.getParameter(R.UNPACK_SKIP_PIXELS),Gt=R.getParameter(R.UNPACK_SKIP_ROWS),xs=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,pt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,pt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ae),R.pixelStorei(R.UNPACK_SKIP_ROWS,Re),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Se);const lt=v.isDataArrayTexture||v.isData3DTexture,Bt=I.isDataArrayTexture||I.isData3DTexture;if(v.isDepthTexture){const Kt=ye.get(v),It=ye.get(I),kt=ye.get(Kt.__renderTarget),Wr=ye.get(It.__renderTarget);ge.bindFramebuffer(R.READ_FRAMEBUFFER,kt.__webglFramebuffer),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,Wr.__webglFramebuffer);for(let fi=0;fi<fe;fi++)lt&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ye.get(v).__webglTexture,N,Se+fi),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ye.get(I).__webglTexture,se,ft+fi)),R.blitFramebuffer(Ae,Re,ue,xe,He,$e,ue,xe,R.DEPTH_BUFFER_BIT,R.NEAREST);ge.bindFramebuffer(R.READ_FRAMEBUFFER,null),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(N!==0||v.isRenderTargetTexture||ye.has(v)){const Kt=ye.get(v),It=ye.get(I);ge.bindFramebuffer(R.READ_FRAMEBUFFER,hl),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,ul);for(let kt=0;kt<fe;kt++)lt?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Kt.__webglTexture,N,Se+kt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Kt.__webglTexture,N),Bt?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,It.__webglTexture,se,ft+kt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,It.__webglTexture,se),N!==0?R.blitFramebuffer(Ae,Re,ue,xe,He,$e,ue,xe,R.COLOR_BUFFER_BIT,R.NEAREST):Bt?R.copyTexSubImage3D(ct,se,He,$e,ft+kt,Ae,Re,ue,xe):R.copyTexSubImage2D(ct,se,He,$e,Ae,Re,ue,xe);ge.bindFramebuffer(R.READ_FRAMEBUFFER,null),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else Bt?v.isDataTexture||v.isData3DTexture?R.texSubImage3D(ct,se,He,$e,ft,ue,xe,fe,et,Te,pt.data):I.isCompressedArrayTexture?R.compressedTexSubImage3D(ct,se,He,$e,ft,ue,xe,fe,et,pt.data):R.texSubImage3D(ct,se,He,$e,ft,ue,xe,fe,et,Te,pt):v.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,se,He,$e,ue,xe,et,Te,pt.data):v.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,se,He,$e,pt.width,pt.height,et,pt.data):R.texSubImage2D(R.TEXTURE_2D,se,He,$e,ue,xe,et,Te,pt);R.pixelStorei(R.UNPACK_ROW_LENGTH,qe),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Vt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ii),R.pixelStorei(R.UNPACK_SKIP_ROWS,Gt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,xs),se===0&&I.generateMipmaps&&R.generateMipmap(ct),ge.unbindTexture()},this.initRenderTarget=function(v){ye.get(v).__webglFramebuffer===void 0&&Ue.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Ue.setTextureCube(v,0):v.isData3DTexture?Ue.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Ue.setTexture2DArray(v,0):Ue.setTexture2D(v,0),ge.unbindTexture()},this.resetState=function(){U=0,S=0,b=null,ge.reset(),L.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}const ys=new F;function Jt(i,e,t,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),c=Math.PI/4;ys.copy(e),ys[n]=0,ys.normalize();const l=.5*a/(a+o),h=1-ys.angleTo(i)/c;return Math.sign(ys[t])===1?h*l:o/(a+o)+l+l*(1-h)}class Do extends ps{constructor(e=1,t=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const c=new F,l=new F,h=new F(e,t,n).divideScalar(2).subScalar(r),f=this.attributes.position.array,u=this.attributes.normal.array,p=this.attributes.uv.array,x=f.length/6,g=new F,m=.5/a;for(let d=0,M=0;d<f.length;d+=3,M+=2)switch(c.fromArray(f,d),l.copy(c),l.x-=Math.sign(l.x)*m,l.y-=Math.sign(l.y)*m,l.z-=Math.sign(l.z)*m,l.normalize(),f[d+0]=h.x*Math.sign(c.x)+l.x*r,f[d+1]=h.y*Math.sign(c.y)+l.y*r,f[d+2]=h.z*Math.sign(c.z)+l.z*r,u[d+0]=l.x,u[d+1]=l.y,u[d+2]=l.z,Math.floor(d/x)){case 0:g.set(1,0,0),p[M+0]=Jt(g,l,"z","y",r,n),p[M+1]=1-Jt(g,l,"y","z",r,t);break;case 1:g.set(-1,0,0),p[M+0]=1-Jt(g,l,"z","y",r,n),p[M+1]=1-Jt(g,l,"y","z",r,t);break;case 2:g.set(0,1,0),p[M+0]=1-Jt(g,l,"x","z",r,e),p[M+1]=Jt(g,l,"z","x",r,n);break;case 3:g.set(0,-1,0),p[M+0]=1-Jt(g,l,"x","z",r,e),p[M+1]=1-Jt(g,l,"z","x",r,n);break;case 4:g.set(0,0,1),p[M+0]=1-Jt(g,l,"x","y",r,e),p[M+1]=1-Jt(g,l,"y","x",r,t);break;case 5:g.set(0,0,-1),p[M+0]=Jt(g,l,"x","y",r,e),p[M+1]=1-Jt(g,l,"y","x",r,t);break}}static fromJSON(e){return new Do(e.width,e.height,e.depth,e.segments,e.radius)}}const Ji=16,en=Math.PI,Dt=(i,e,t)=>Math.min(t,Math.max(e,i)),st=(i,e,t)=>i+(e-i)*t,Q0=i=>i*i*(3-2*i),Zp=(i,e)=>-i*(en-e);class Ti{constructor(e,t,n,s,r,a=t){this.d=e,this.sourceTotal=Math.max(1,Math.ceil(t/2)),this.total=Math.max(1,Math.ceil(a/2)),this.sheetsPerSignature=Ji,this.count=Math.ceil(this.total/Ji);const o=n/this.sourceTotal*this.total;this.split=Dt(Number.isInteger(n)?Math.round(o):o,0,this.total),this.position=this.split/this.total,this.q=Dt(s,0,1),this.openAngle=Dt(r,90,145),this.caliper=e.t/this.total,this.curves=new Map;const c=Math.sin(en*this.position),l=1+.13*(this.openAngle-154)/49;this.radius=e.t*(.38+.075*c)*l,this.angularSpread=(1.5+.8*c)*(.89+.11*(this.openAngle/154)),this.spineBase=-e.t/2-e.board*.9-.084;const h=(180-this.openAngle)*en/360,f=2*h;this.leftTilt=Dt(f*(1-this.position),0,1.55),this.rightTilt=Dt(f*this.position,0,1.55),this.spineEngagement=Q0(Math.sin(en*this.position)),this.boardTilt=h,this.outerRiseLeft=e.w*Math.sin(this.leftTilt),this.outerRiseRight=e.w*Math.sin(this.rightTilt),this.outerDrop=0,this.leftSupportOffset=Math.max(0,e.t/2+this.spinePoint(0).z)+e.board*.42,this.rightSupportOffset=Math.max(0,e.t/2+this.spinePoint(1).z)+e.board*.42,this.gutterSafeFraction=Dt(.075+(180-this.openAngle)/360*.16+e.t/e.w*.025,.08,.14)}signatureBounds(e,t){const n=e*Ji,s=Math.min(this.total,n+Ji);if(t==="left"){const a=Math.min(s,this.split);return{start:n,end:a,count:Math.max(0,a-n)}}const r=Math.max(n,this.split);return{start:r,end:s,count:Math.max(0,s-r)}}hingeAtFraction(e){e=Dt(e,0,1);const{t}=this.d,n=-.045-t*.16*Math.sin(en*e),s=t*(.5-e),r=en*this.position*this.q,a=n*Math.cos(r)-s*Math.sin(r),o=n*Math.sin(r)+s*Math.cos(r),c=this.angularSpread*(e-this.position),l=this.radius*Math.sin(c),h=.24+.06*Math.sin(en*this.position),f=this.spineBase+this.radius*h*Math.cos(c),u=this.spineEngagement*this.q,p=en*this.position,x=st(n*Math.cos(p)-s*Math.sin(p),l,this.spineEngagement),g=st(n*Math.sin(p)+s*Math.cos(p),f,this.spineEngagement);return{x:st(a,l,u),z:st(o,f,u),closedX:n,closedZ:s,openX:x,openZ:g}}hingeForLeaf(e){return this.hingeAtFraction((Dt(e,0,this.total-1)+.5)/this.total)}hingeForSignature(e){return this.hingeAtFraction((e+.5)*Ji/this.total)}spinePoint(e){e=Dt(e,0,1);const t=en*this.position*this.q,n=-Math.cos(t),s=-Math.sin(t),r=this.hingeAtFraction(0),a=this.hingeAtFraction(1),o=(this.d.t*(.16-.095*this.spineEngagement*this.q)+.008)*Math.sin(en*e),l=Math.max(.012,Math.min(.032,this.d.board*.9+.006))+o;return{x:st(r.x,a.x,e)+n*l,z:st(r.z,a.z,e)+s*l}}openCurve(e,t){const n=Dt(e,0,this.total-1),s=t+":"+n;if(this.curves.has(s))return this.curves.get(s);const r=this.hingeForLeaf(n),a=this.getBoardAnchor(t),o=t==="left"?this.leftTilt:this.rightTilt,c=t==="left"?-1:1,l=c*Math.cos(o),h=Math.sin(o),f=-c*Math.sin(o),u=Math.cos(o),p=t==="left"?this.split:this.total-this.split,x=t==="left"?n+.5:this.total-n-.5;let g=r.x,m=r.openZ;const d=this.d.board/2+.006;if(p<64){const H=this.hingeForLeaf(this.visibleLeaf(t)??n),ee=p-.5,V=(H.x-a.x)*f+(H.openZ-a.z)*u,ie=Math.max(d,V-ee*this.caliper)+x*this.caliper;g=H.x+(ie-V)*f,m=H.openZ+(ie-V)*u}else{const H=(g-a.x)*f+(m-a.z)*u;H<d&&(g+=(d-H)*f,m+=(d-H)*u)}const M=(g-a.x)*f+(m-a.z)*u,y=d+x*this.caliper,w=Q0(Dt(p/64,0,1)),P=Math.abs(n+.5-this.split)/this.total,E=p/this.total,C=(.012+.25*Math.pow(1-E,1.1)*Math.exp(-P/.2))*w,U=96,S=[],b=[];for(let H=0;H<=U;H++){const ee=H/U,V=ee+.28*w*(1-Math.exp(-ee/.16))*(1-ee);S.push(st(M,y,V)+C*Math.sin(en*ee)*Math.pow(1-ee,.75))}const A=this.d.w+.027;let B=0,z=A,W=A;for(let H=0;H<9;H++){let ee=0,V=0;const ne=W/U;for(let Be=1;Be<=U;Be++){const Ze=Math.hypot(ne,S[Be]-S[Be-1]);ee+=Ze,V+=W/(U*U*Math.max(Ze,1e-12))}const ie=ee-A;if(Math.abs(ie)<1e-8)break;ie>0?z=W:B=W;const ve=W-ie/Math.max(V,1e-8);W=ve>B&&ve<z?ve:(B+z)/2}b.push(0);for(let H=1;H<=U;H++)b.push(b[H-1]+Math.hypot(W/U,S[H]-S[H-1]));const q={rootX:g,rootZ:m,dx:l,dz:h,nx:f,nz:u,h0:M,heights:S,steps:b,span:W,length:A,N:U};return this.curves.set(s,q),q}sheetPoint(e,t,n,s=.5){const r=Dt(e,0,this.total-1),a=Dt(n,0,1),o=Dt(s,0,1),{w:c,h:l,t:h}=this.d,f=this.hingeForLeaf(r),u=h*.16*Math.sin(en*(r+.5)/this.total),p=st(f.closedX,c-.018-u,a),x=h/2-(r+.5)*this.caliper,g=st(f.closedZ,x,a);if(this.q===0)return{x:p,y:(o-.5)*(l-.072),z:g};const m=this.openCurve(r,t),d=a*m.steps[m.N];let M=0,y=m.N;for(;y-M>1;){const S=M+y>>1;m.steps[S]<d?M=S:y=S}const w=(d-m.steps[M])/Math.max(1e-12,m.steps[y]-m.steps[M]),P=m.span*(M+w)/m.N,E=st(m.heights[M],m.heights[y],w)-m.h0,C=m.rootX+m.dx*P+m.nx*E,U=m.rootZ+m.dz*P+m.nz*E;return{x:st(p,C,this.q),y:(o-.5)*(l-.072),z:st(g,U,this.q)}}spineFoldThickness(e,t){const{start:n,end:s,count:r}=this.signatureBounds(e,t);if(r===0)return 0;const a=this.hingeForLeaf(n),o=this.hingeForLeaf(s-1);return Math.hypot(a.x-o.x,a.z-o.z)+this.caliper}visibleLeaf(e){const t=e==="left"?this.split-1:this.split;return t>=0&&t<this.total?t:null}getBoardAnchor(e){const t=e==="left"?0:1,n=this.spinePoint(t),s=(e==="left"?1:-1)*(this.d.t/2+this.d.board/2+.006),r=n.z+this.d.board*.72-.014;return{x:st(0,n.x+(e==="left"?-.017:.017),this.q),z:st(s,r,this.q)}}estimatedLowestPoint(){let e=1/0;for(let s=0;s<=32;s++){const r=this.spinePoint(s/32);e=Math.min(e,r.z)}const t=this.getBoardAnchor("left"),n=this.getBoardAnchor("right");return e=Math.min(e,t.z-this.d.board,n.z-this.d.board),e}analyze(){const e=Math.floor(this.count/2);return{signatures:this.count,pages:this.total*2,split:this.split,position:this.position,radius:this.radius,halfOpening:this.boardTilt,coverInclinations:{left:this.leftTilt,right:this.rightTilt},spineEngagement:this.spineEngagement,supportOffset:{left:this.leftSupportOffset,right:this.rightSupportOffset},gutterSafeFraction:this.gutterSafeFraction,signatureInMiddle:{left:this.signatureBounds(e,"left"),right:this.signatureBounds(e,"right")},rootThickness:this.spineFoldThickness(e,"right")}}}const jp=34,Kp=3,$p=64,Jp=16;function Qt(i,e={}){return new kn({color:i,roughness:.96,metalness:0,...e})}function Es(i,e){return e.add(i),i.castShadow=!1,i.receiveShadow=!1,i}function Qp(){const i=document.createElement("canvas");i.width=480,i.height=680;const e=i.getContext("2d");e.fillStyle="#e7e1d5",e.fillRect(0,0,480,680);let t=6331319;for(let s=0;s<2700;s++){t=Math.imul(t,1664525)+1013904223>>>0;const r=t/4294967296;e.fillStyle="rgba(112,96,78,.021)",e.fillRect(r*9973%480,r*8741%680,1.2,.55)}const n=new Lo(i);return n.colorSpace=Ct,n.anisotropy=4,n}function e2(i,e){const t=jp,n=Kp,s=(t+1)*(n+1),r=s*2,a=new Float32Array(r*3),o=new Float32Array(r*3),c=new Float32Array(r*2),l=new Float32Array(r*3);for(let d=0;d<2;d++)for(let M=0;M<=n;M++)for(let y=0;y<=t;y++){const w=d*s+M*(t+1)+y,P=y/t;c[w*2]=P,c[w*2+1]=M/n;const E=Math.min(1,P/.24),U=.78+.22*(E*E*(3-2*E));l[w*3]=U,l[w*3+1]=U*.997,l[w*3+2]=U*.985}const h=[],f=[],u=[];function p(d,M,y,w,P){d.push(M,y,w,M,w,P)}function x(d,M,y){return d*s+y*(t+1)+M}for(let d=0;d<n;d++)for(let M=0;M<t;M++)p(h,x(0,M,d),x(0,M+1,d),x(0,M+1,d+1),x(0,M,d+1)),p(h,x(1,M,d+1),x(1,M+1,d+1),x(1,M+1,d),x(1,M,d));for(let d=0;d<t;d++)p(f,x(0,d,0),x(1,d,0),x(1,d+1,0),x(0,d+1,0)),p(f,x(0,d+1,n),x(1,d+1,n),x(1,d,n),x(0,d,n));for(let d=0;d<n;d++)p(f,x(0,t,d),x(1,t,d),x(1,t,d+1),x(0,t,d+1));const g=new Tt,m=h.concat(f,u);return g.setAttribute("position",new ut(a,3)),g.setAttribute("normal",new ut(o,3)),g.setAttribute("uv",new ut(c,2)),g.setAttribute("color",new ut(l,3)),g.setIndex(m),g.addGroup(0,h.length,0),g.addGroup(h.length,f.length,1),g.addGroup(h.length+f.length,u.length,2),g.userData={nx:t,ny:n,grid:s},g}function t2(i,e,t,n){const{start:s,end:r,count:a}=t;if(i.visible=a>0,!a)return;const o=i.geometry,{nx:c,ny:l,grid:h}=o.userData,f=o.attributes.position,u=n==="left"?r-1:s,p=n==="left"?s:r-1;for(let x=0;x<2;x++){const g=x?p:u;for(let m=0;m<=l;m++)for(let d=0;d<=c;d++){const M=d/c,y=m/l,w=x*h+m*(c+1)+d,P=e.sheetPoint(g,n,M,y);f.setXYZ(w,P.x,P.y,P.z+(x?-5e-4:5e-4))}}f.needsUpdate=!0,o.computeVertexNormals(),o.computeBoundingSphere()}function ec(i){const e=$p,t=Jp,n=new Float32Array((e+1)*(t+1)*3),s=new Float32Array((e+1)*(t+1)*2),r=new Float32Array((e+1)*(t+1)*3),a=[];for(let c=0;c<=t;c++)for(let l=0;l<=e;l++){const h=c*(e+1)+l,f=l/e;s[2*h]=i==="left"?1-f:f,s[2*h+1]=c/t;const u=Math.min(1,f/.24),x=.77+.23*(u*u*(3-2*u));if(r[3*h]=x,r[3*h+1]=x*.998,r[3*h+2]=x*.985,l<e&&c<t){const g=h,m=h+1,d=h+e+2,M=h+e+1;a.push(g,m,d,g,d,M)}}const o=new Tt;return o.setAttribute("position",new ut(n,3)),o.setAttribute("uv",new ut(s,2)),o.setAttribute("color",new ut(r,3)),o.setIndex(a),o.userData={nx:e,ny:t,side:i},o.computeVertexNormals(),o}function tc(i,e,t){const n=e.visibleLeaf(t);if(i.visible=n!==null&&e.q>.98,n===null)return;const{nx:s,ny:r}=i.geometry.userData,a=i.geometry.attributes.position,o=i.geometry.attributes.uv,c=i.geometry.attributes.color,l=e.gutterSafeFraction;for(let h=0;h<=r;h++)for(let f=0;f<=s;f++){const u=f/s,p=h/r,x=h*(s+1)+f,g=e.sheetPoint(n,t,u,p);a.setXYZ(x,g.x,g.y,g.z+.0035);const d=.085+.915*Math.max(0,(u-l)/(1-l));o.setXY(x,t==="left"?1-d:d,p);const M=Math.min(1,u/(l*1.8)),w=.83+.17*(M*M*(3-2*M));c.setXYZ(x,w,w*.997,w*.985)}a.needsUpdate=!0,o.needsUpdate=!0,c.needsUpdate=!0,i.geometry.computeVertexNormals(),i.geometry.computeBoundingSphere()}function ba(i,e=!1){const s=new Float32Array(1515),r=new Float32Array(505*2),a=[];for(let c=0;c<=4;c++)for(let l=0;l<=100;l++){const h=c*101+l;if(r[h*2]=e?1-l/100:l/100,r[h*2+1]=c/4,l<100&&c<4){const f=h,u=h+1,p=h+100+2,x=h+100+1;e?a.push(f,p,u,f,x,p):a.push(f,u,p,f,p,x)}}const o=new Tt;return o.setAttribute("position",new ut(s,3)),o.setAttribute("uv",new ut(r,2)),o.setIndex(a),o.userData={nu:100,nv:4},o}function n2(i,e,t,n){const s=i.geometry,r=s.attributes.position,{nu:a,nv:o}=s.userData;for(let c=0;c<=o;c++)for(let l=0;l<=a;l++){const h=c*(a+1)+l,f=l/a,u=(-.5+c/o)*(t+2*n),p=e.spinePoint(f);r.setXYZ(h,p.x-.001*Math.sin(u*2),u,p.z)}r.needsUpdate=!0,s.computeVertexNormals(),s.computeBoundingSphere()}function i2(i,e,t){const n=i.geometry,s=n.attributes.position,{nu:r,nv:a}=n.userData;for(let o=0;o<=a;o++)for(let c=0;c<=r;c++){const l=o*(r+1)+c,h=c/r,f=e.hingeAtFraction(h),u=(-.5+o/a)*(t-.09);s.setXYZ(l,f.x,u,f.z-.024)}s.needsUpdate=!0,n.computeVertexNormals(),n.computeBoundingSphere()}function s2(i,e,t){const s=new Tt;s.setAttribute("position",new Yt(new Float32Array(240),3));const r=new jh(s,new Lc({color:4351098,transparent:!0,opacity:.82}));return r.userData={N:80,sign:t,h:e},r}function r2(i,e){const t=i.geometry.attributes.position,{N:n,sign:s,h:r}=i.userData;for(let a=0;a<n;a++){const o=e.spinePoint(a/(n-1));t.setXYZ(a,o.x,s*(r/2-.015),o.z+.012)}t.needsUpdate=!0}function a2(){const t=new Float32Array(399),n=[];for(let r=0;r<18;r++)for(let a=0;a<6;a++){const o=r*7+a,c=o+6+1;n.push(o,c,o+1,o+1,c,c+1)}const s=new Tt;return s.setAttribute("position",new ut(t,3)),s.setIndex(n),s.userData={around:6,across:18},s}function nc(i,e,t,n,s){if(i.visible=!1,!i.visible)return;const r=e.sheetPoint(t.start,n,0,s===1?1:0),a=e.sheetPoint(t.end-1,n,0,s===1?1:0),o=i.geometry,c=o.attributes.position,{around:l,across:h}=o.userData,f=Math.hypot(a.x-r.x,a.z-r.z),u=Math.max(.0035,f*.34),p=Math.max(.0011,e.caliper*.92);for(let x=0;x<=h;x++){const g=x/h,m=r.x+(a.x-r.x)*g+(n==="left"?-1:1)*u*Math.sin(Math.PI*g),d=r.z+(a.z-r.z)*g,M=a.x-r.x+(n==="left"?-1:1)*u*Math.PI*Math.cos(Math.PI*g),y=a.z-r.z,w=Math.hypot(M,y)||1,P=-y/w,E=M/w,C=s*(e.d.h/2-.036);for(let U=0;U<=l;U++){const S=2*Math.PI*U/l,b=Math.cos(S)*p,A=Math.sin(S)*p;c.setXYZ(x*(l+1)+U,m+P*b,C+A,d+E*b)}}c.needsUpdate=!0,o.computeVertexNormals(),o.computeBoundingSphere()}function o2(){const t=new Float32Array(8547),n=new Float32Array(t.length),s=[];for(let a=0;a<76;a++)for(let o=0;o<36;o++){const c=a*37+o,l=c+36+1;s.push(c,c+1,l+1,c,l+1,l)}const r=new Tt;return r.setAttribute("position",new ut(t,3)),r.setAttribute("color",new ut(n,3)),r.setIndex(s),r.userData={nu:36,nv:76},r}function c2(i,e,t,n){const s=t==="left"?e.split:e.total-e.split,r=s/e.total>.76&&s>32&&e.q>.97;if(i.visible=r,!r)return;const a=t==="left"?e.split-1:e.split,o=t==="left"?0:e.total-1,c=i.geometry,l=c.attributes.position,h=c.attributes.color,{nu:f,nv:u}=c.userData,p=n>0?1:0,x=n*((e.d.h-.072)/2+.0017),g=Math.min(56,s/Ji);for(let m=0;m<=u;m++){const d=m/u,M=d*g*2*Math.PI,w=.928-.031*Math.pow(Math.max(0,Math.cos(M)),20)-.009*Math.sin(m*1.77)*Math.sin(m*.31)-.008*d;for(let P=0;P<=f;P++){const E=P/f,C=m*(f+1)+P,U=st(o,a,d),S=e.sheetPoint(U,t,E,p),b=S.z,A=S.x;l.setXYZ(C,A,x,b);const B=w-.005*Math.sin(P*.73+m*.21);h.setXYZ(C,B,B*.971,B*.936)}}l.needsUpdate=!0,h.needsUpdate=!0,c.computeVertexNormals(),c.computeBoundingSphere()}function ji(i,e,t,n){const s=i.t*.16*Math.sin(Math.PI*e);return{x:st(-.045-s,i.w-.018-s,t),y:(n-.5)*(i.h-.072),z:i.t*(.5-e)}}function l2(i){const e=[],t=[],n=[],s=[];function r(o,c,l,h,f,u){const p=e.length/3,x=n.length;for(let g=0;g<=c;g++)for(let m=0;m<=o;m++){const d=m/o,M=g/c,y=l(d,M);e.push(y.x,y.y,y.z),t.push(d,u?.5-y.z/i.t:M)}for(let g=0;g<c;g++)for(let m=0;m<o;m++){const d=p+g*(o+1)+m,M=d+o+2,y=d+1,w=d+o+1;h?n.push(d,M,y,d,w,M):n.push(d,y,M,d,M,w)}s.push([x,n.length-x,f])}r(34,100,(o,c)=>ji(i,c,o,1),!1,0,!0),r(34,100,(o,c)=>ji(i,c,o,0),!0,0,!0),r(100,3,(o,c)=>ji(i,o,0,c),!0,0,!0),r(100,3,(o,c)=>ji(i,o,1,c),!1,0,!0),r(34,3,(o,c)=>ji(i,0,o,c),!1,1,!1),r(34,3,(o,c)=>ji(i,1,o,c),!0,1,!1);const a=new Tt;return a.setAttribute("position",new Yt(e,3)),a.setAttribute("uv",new Yt(t,2)),a.setIndex(n),s.forEach(o=>a.addGroup(...o)),a.computeVertexNormals(),a}function h2(i=100,e=4){const t=2*(i+e),n=new Tt,s=[];n.setAttribute("position",new Yt(new Float32Array(t*12),3));for(let r=0;r<t;r++){const a=r*4;s.push(a,a+1,a+2,a,a+2,a+3)}return n.setIndex(s),n}function u2(i,e,t,n){const s=i.geometry,r=s.attributes.position,a=s.attributes.normal,o=e.geometry.attributes.position;for(let u=0;u<r.count;u++)o.setXYZ(u,r.getX(u)-a.getX(u)*n,r.getY(u)-a.getY(u)*n,r.getZ(u)-a.getZ(u)*n);o.needsUpdate=!0,e.geometry.computeVertexNormals(),e.geometry.computeBoundingSphere();const{nu:c,nv:l}=s.userData,h=[];for(let u=0;u<c;u++)h.push([u,u+1]);for(let u=0;u<l;u++)h.push([u*(c+1)+c,(u+1)*(c+1)+c]);for(let u=c;u>0;u--)h.push([l*(c+1)+u,l*(c+1)+u-1]);for(let u=l;u>0;u--)h.push([u*(c+1),(u-1)*(c+1)]);const f=t.geometry.attributes.position;h.forEach(([u,p],x)=>{[[r,u],[r,p],[o,p],[o,u]].forEach(([g,m],d)=>f.setXYZ(x*4+d,g.getX(m),g.getY(m),g.getZ(m)))}),f.needsUpdate=!0,t.geometry.computeVertexNormals(),t.geometry.computeBoundingSphere()}class d2{constructor({root:e,materials:t,dimensions:n,sourcePages:s=1310,printPages:r=s}){this.root=e,this.materials=t,this.dimensions=n,this.sourcePages=s,this.printPages=r,this.owned=[],this.signatureCount=0,this.signatureMeshes={left:[],right:[]},this.foldMeshes={left:[],right:[]},this.bulkCutMeshes={left:[],right:[]},this.build()}own(e){return this.owned.push(e),e}make(e,t,n=this.root){return Es(new jt(e,t),n)}build(){const{w:e,h:t,t:n,board:s,overhang:r}=this.dimensions,a=this.materials;this.frontPivot=Es(new Tn,this.root),this.backPivot=Es(new Tn,this.root);const o=e+r*2,c=t+r*2,l=()=>new Do(o,c,s,3,Math.min(s*.23,.008));this.frontBoard=this.make(l(),[a.cloth,a.cloth,a.cloth,a.cloth,a.front,a.cloth],this.frontPivot),this.backBoard=this.make(l(),[a.cloth,a.cloth,a.cloth,a.cloth,a.cloth,a.back],this.backPivot),this.frontBoard.position.x=e/2,this.backBoard.position.x=e/2;const h=this.own(Qt(16777215,{map:Qp(),side:mt}));this.frontPastedown=this.make(new gn(e-.075,t-.085),h,this.frontPivot),this.backPastedown=this.make(new gn(e-.075,t-.085),h,this.backPivot),this.frontPastedown.position.set(e/2,0,-s/2-.002),this.backPastedown.position.set(e/2,0,s/2+.002);const f=this.own(Qt(13221807,{side:mt})),u=this.make(new gn(.068,t-.04),f,this.frontPivot),p=this.make(new gn(.068,t-.04),f,this.backPivot);u.position.set(.012,0,-s/2-.003),p.position.set(.012,0,s/2+.003),this.leftStack=Es(new Tn,this.root),this.rightStack=Es(new Tn,this.root);const x=this.own(Qt(16249835,{side:mt,vertexColors:!0})),g=this.own(new kn({color:15525852,roughness:1,metalness:0,side:mt,emissive:11709084,emissiveIntensity:.29})),m=this.own(Qt(12432292,{side:mt})),d=this.own(Qt(15196889,{side:mt}));this.signatureMaterial=[x,g,m];const M=l2(this.dimensions),y=this.own(Qt(15855076,{map:a.edge,side:mt})),w=this.own(Qt(15855076,{side:mt}));this.closedBlock=this.make(M,[y,w]),this.signatureCount=Math.ceil(this.printPages/32);for(const C of["left","right"])for(let U=0;U<this.signatureCount;U++){const S=e2(),b=this.make(S,this.signatureMaterial,C==="left"?this.leftStack:this.rightStack);b.userData={signature:U,side:C},b.frustumCulled=!1,this.signatureMeshes[C].push(b);const A=[];for(const B of[-1,1]){const z=this.make(a2(),d,C==="left"?this.leftStack:this.rightStack);z.frustumCulled=!1,A.push(z)}this.foldMeshes[C].push(A)}const P=this.own(new kn({color:16777215,vertexColors:!0,roughness:1,metalness:0,side:mt,emissive:12168607,emissiveIntensity:.08}));for(const C of["left","right"])for(const U of[-1,1]){const S=this.make(o2(),P);S.frustumCulled=!1,S.renderOrder=2,this.bulkCutMeshes[C].push({mesh:S,sign:U})}const E=()=>this.own(new ls({map:a.placeholder,color:16777215,side:mt,vertexColors:!0,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));this.leftPage=this.make(ec("left"),E()),this.rightPage=this.make(ec("right"),E()),this.leftPage.renderOrder=3,this.rightPage.renderOrder=3,this.leftPage.frustumCulled=!1,this.rightPage.frustumCulled=!1,this.spineGeometry=ba(t,!0),this.spine=this.make(this.spineGeometry,this.own(Qt(16777215,{map:a.spine,side:_n,bumpMap:a.clothBump||null,bumpScale:.001,emissive:16777215,emissiveMap:a.spine,emissiveIntensity:.16}))),this.spineThickness=Math.max(.008,Math.min(.04,s*.82)),this.spineLining=this.make(ba(t,!1),this.own(Qt(14801613,{side:_n}))),this.spineRims=this.make(h2(),this.own(Qt(14801613,{side:mt}))),this.spineLining.frustumCulled=!1,this.spineRims.frustumCulled=!1,this.sewnBacking=this.make(ba(),this.own(Qt(13089962,{side:mt,roughness:1}))),this.sewnBacking.frustumCulled=!1,this.spine.frustumCulled=!1,this.caseJoints=["left","right"].map(C=>{const U=new Tt;U.setAttribute("position",new Yt(new Float32Array(12),3)),U.setIndex([0,1,2,0,2,3]);const S=this.make(U,this.own(Qt(14209473,{side:mt})));return S.frustumCulled=!1,{side:C,mesh:S}}),this.headbands=[];for(const C of[-1,1]){const U=s2(null,t,C);this.root.add(U),this.headbands.push(U)}this.render(0,0,this.sourcePages,this.printPages,120)}render(e,t,n,s,r=154){const a=this.last;if(!this.inTurn&&a&&a.q===e&&a.spread===t&&a.sourcePages===n&&a.printPages===s&&a.openAngle===r)return a;this.inTurn=!1;const o=this.dimensions,c=new Ti(o,n,t,e,r,s);this.rig=c;for(const x of["left","right"]){const g=this.signatureMeshes[x];for(let m=0;m<g.length;m++){const d=c.signatureBounds(m,x);t2(g[m],c,d,x),nc(this.foldMeshes[x][m][0],c,d,x,-1),nc(this.foldMeshes[x][m][1],c,d,x,1)}}for(const x of["left","right"])for(const{mesh:g,sign:m}of this.bulkCutMeshes[x])c2(g,c,x,m);if(this.closedBlock.visible=c.q<.015,this.closedBlock.visible)for(const x of["left","right"]){for(const g of this.signatureMeshes[x])g.visible=!1;for(const{mesh:g}of this.bulkCutMeshes[x])g.visible=!1}tc(this.leftPage,c,"left"),tc(this.rightPage,c,"right");const l=c.getBoardAnchor("left"),h=c.getBoardAnchor("right");this.frontPivot.position.set(l.x,0,l.z),this.backPivot.position.set(h.x,0,h.z);const f=c.boardTilt*c.q;this.frontPivot.rotation.set(0,Zp(c.q,c.leftTilt),0),this.backPivot.rotation.set(0,-c.q*c.rightTilt,0),this.frontPastedown.visible=c.q>.03,this.backPastedown.visible=c.q>.03;for(const{side:x,mesh:g}of this.caseJoints){const m=x==="left",d=c.spinePoint(m?0:1),M=m?this.frontPivot:this.backPivot,y=(m?1:-1)*o.board/2,w=M.position.x+Math.sin(M.rotation.y)*y,P=M.position.z+Math.cos(M.rotation.y)*y,E=o.h/2+o.overhang,C=g.geometry.attributes.position;C.setXYZ(0,d.x,-E,d.z),C.setXYZ(1,w,-E,P),C.setXYZ(2,w,E,P),C.setXYZ(3,d.x,E,d.z),C.needsUpdate=!0,g.geometry.computeVertexNormals(),g.geometry.computeBoundingSphere()}n2(this.spine,c,o.h,o.overhang),u2(this.spine,this.spineLining,this.spineRims,this.spineThickness),i2(this.sewnBacking,c,o.h);const u=this.materials.spine;this.spine.material.map!==u&&(this.spine.material.map=u,this.spine.material.emissiveMap=u,this.spine.material.needsUpdate=!0),this.spine.material.color.set(16777215);for(const x of this.headbands)r2(x,c),x.visible=!1;this.root.rotation.set(-e*Math.PI/2,0,0),this.root.position.x=-(1-e)*o.w/2,this.root.position.z=0;const p=-o.h/2-o.overhang-.02;return this.root.position.y=e*(p-c.estimatedLowestPoint()),this.last={q:e,spread:t,sourcePages:n,printPages:s,openAngle:r,signatures:c.count,rootArc:c.analyze(),boardTilt:f},this.last}captureTurn(e){const t={...this.last};function n(o){const c=[];return o.traverse(l=>{const h={};if(l.geometry)for(const f of["position","normal","uv","color"]){const u=l.geometry.attributes[f];u&&(h[f]=Float32Array.from(u.array))}c.push({object:l,visible:l.visible,position:l.position.clone(),quaternion:l.quaternion.clone(),scale:l.scale.clone(),attributes:h})}),c}const s=n(this.root);this.render(1,e,t.sourcePages,t.printPages,t.openAngle);const r=n(this.root);return this.render(1,t.spread,t.sourcePages,t.printPages,t.openAngle),{entries:s.map((o,c)=>{const l=r[c],h=[];for(const f of Object.keys(o.attributes)){const u=o.attributes[f],p=l.attributes[f];u.some((x,g)=>x!==p[g])&&h.push({name:f,from:u,to:p})}return{from:o,to:l,attributes:h}}),spread:t.spread,nextSpread:e,sourcePages:t.sourcePages,printPages:t.printPages,openAngle:t.openAngle}}applyTurn(e,t){this.inTurn=!0;const n=Dt(t,0,1);for(const s of e.entries){const r=s.from,a=s.to,o=r.object;o.visible=n===0?r.visible:(n===1||r.visible)&&a.visible,o.position.lerpVectors(r.position,a.position,n),o.quaternion.slerpQuaternions(r.quaternion,a.quaternion,n),o.scale.lerpVectors(r.scale,a.scale,n);for(const{name:c,from:l,to:h}of s.attributes){const f=o.geometry.attributes[c],u=f.array;for(let p=0;p<u.length;p++)u[p]=st(l[p],h[p],n);f.needsUpdate=!0}}return this.rig=new Ti(this.dimensions,e.sourcePages,st(e.spread,e.nextSpread,n),1,e.openAngle,e.printPages),this.rig}pageSurface(e,t,n,s){const r=new Ti(this.dimensions,n,t,1,this.last?.openAngle||154,this.last?.printPages||n),a=r.visibleLeaf(e);return a===null?r.spinePoint(.5).z:r.sheetPoint(a,e,s,.5).z}pagePoint(e,t,n,s,r){const a=new Ti(this.dimensions,n,t,1,this.last?.openAngle||154,this.last?.printPages||n),o=a.visibleLeaf(e);return o===null?{x:0,y:0,z:0}:a.sheetPoint(o,e,s,r)}getTop(e,t,n){return this.pageSurface(e,t,n,0)}dispose(){this.root.traverse(e=>{e.geometry&&e.geometry.dispose(),e.isLine&&e.material&&e.material.dispose()});for(const e of this.owned)e===this.frontPastedown.material&&e.map&&e.map.dispose(),e.dispose();this.root.clear()}}class f2{constructor({from:e,to:t,fromSide:n,toSide:s,columns:r=64,rows:a=16}){this.from=e,this.to=t,this.fromSide=n,this.toSide=s,this.fromLeaf=e.visibleLeaf(n),this.toLeaf=t.visibleLeaf(s),this.columns=r,this.rows=a,this.strips=[],this.fromHinge=e.hingeForLeaf(this.fromLeaf),this.toHinge=t.hingeForLeaf(this.toLeaf);for(let o=0;o<=a;o++){const c=o/a,l=[],h=[],f=[];for(let u=0;u<=r;u++)l.push(e.sheetPoint(this.fromLeaf,n,u/r,c)),h.push(t.sheetPoint(this.toLeaf,s,u/r,c));for(let u=0;u<r;u++){const p=l[u+1].x-l[u].x,x=l[u+1].z-l[u].z,g=h[u+1].x-h[u].x,m=h[u+1].z-h[u].z,d=Math.atan2(x,p);let M=Math.atan2(m,g);for(;M-d>Math.PI;)M-=Math.PI*2;for(;M-d<-Math.PI;)M+=Math.PI*2;f.push({a:Math.hypot(p,x),b:Math.hypot(g,m),thetaA:d,thetaB:M})}this.strips.push({a:l,b:h,segments:f})}}row(e,t,n=null){const s=Dt(t,0,1),r=this.strips[e],a=e/this.rows;if(s===0)return r.a.map(x=>({...x}));if(s===1)return r.b.map(x=>({...x}));const o=r.a[0],c=r.b[0];let l=st(o.x,c.x,s),h=st(o.z,c.z,s);if(n){const x=n.hingeForLeaf(st(this.fromLeaf,this.toLeaf,s));l=x.x+st(o.x-this.fromHinge.x,c.x-this.toHinge.x,s),h=x.z+st(o.z-this.fromHinge.z,c.z-this.toHinge.z,s)}const f=st(o.y,c.y,s),u=[{x:l,y:f,z:h}],p=Math.sin(Math.PI*s);for(let x=0;x<this.columns;x++){const g=(x+.5)/this.columns,m=r.segments[x],d=p*Math.sin(Math.PI*g)*(.24+.1*(a-.5)),M=st(m.thetaA,m.thetaB,s)+d,y=st(m.a,m.b,s);l+=Math.cos(M)*y,h+=Math.sin(M)*y,u.push({x:l,y:f,z:h})}return u}writePositions(e,t,n,s=null){const r=this.columns;for(let a=0;a<=this.rows;a++){const o=this.row(a,t,s),c=this.rows-a;for(let l=0;l<=r;l++){const h=o[n>0?l:r-l];e.setXYZ(c*(r+1)+l,h.x,h.y,h.z+.004)}}e.needsUpdate=!0}}class p2{constructor(e,t=fetch,n=null,s=globalThis.caches){this.baseURL=e,this.fetcher=(r,a)=>t.call(globalThis,r,a),this.manifest=n?Promise.resolve(n):null,this.packs=new Map,this.slices=new Map,this.pending=new Map,this.stats={requests:0,bytes:0,hits:0,diskHits:0},this.disk=s?s.open("inm-page-images-v1").catch(()=>null):Promise.resolve(null)}async index(){return this.manifest||(this.manifest=this.fetcher(this.baseURL+"index.json",{cache:"force-cache"}).then(async e=>{if(!e.ok)throw new Error("Preview index unavailable");const t=await e.json();if(t.version!==1||!t.pages||!t.packs)throw new Error("Invalid preview index");return t}).catch(e=>{throw this.manifest=null,e})),this.manifest}async blob(e){const t=await this.index(),n=t.pages[e];if(!n)throw new Error("Page has no preview");const[s,r,a]=n,o=t.packs[s],c=o+":"+r;if(this.slices.has(c))return this.stats.hits++,new Blob([await this.slices.get(c)],{type:"image/webp"});const l=await this.disk,h=new URL(this.baseURL+"cached-"+o+"-"+r+".webp",globalThis.location?.href||"https://inm.invalid/").href;if(l)try{const p=await l.match(h);if(p){const x=await p.arrayBuffer();return this.slices.set(c,Promise.resolve(x)),this.stats.diskHits++,new Blob([x],{type:"image/webp"})}}catch{}if(this.slices.has(c))return this.stats.hits++,new Blob([await this.slices.get(c)],{type:"image/webp"});let f;if(this.packs.has(o)){this.stats.hits++;const p=this.packs.get(o);f=Promise.resolve(this.extract(p,r,a))}else f=new Promise((p,x)=>{if(!this.pending.has(o)){const g=[];this.pending.set(o,g),setTimeout(()=>this.flush(o,g),8)}this.pending.get(o).push({offset:r,length:a,resolve:p,reject:x})});for(this.slices.set(c,f),f.catch(()=>{this.slices.get(c)===f&&this.slices.delete(c)});this.slices.size>24;)this.slices.delete(this.slices.keys().next().value);const u=await f;if(l)try{await l.put(h,new Response(u,{headers:{"Content-Type":"image/webp"}}))}catch{}return new Blob([u],{type:"image/webp"})}extract(e,t,n){if(t<8||t+n>e.byteLength)throw new Error("Truncated preview pack");return e.slice(t,t+n)}flush(e,t){this.pending.delete(e),t.sort((s,r)=>s.offset-r.offset);let n=[];for(const s of t)n.length&&(s.offset-(n.at(-1).offset+n.at(-1).length)>32768||s.offset+s.length-n[0].offset>524288)&&(this.transfer(e,n),n=[]),n.push(s);n.length&&this.transfer(e,n)}async transfer(e,t){const n=t[0].offset,s=t.at(-1).offset+t.at(-1).length;try{this.stats.requests++;const r=await this.fetcher(this.baseURL+e,{cache:"force-cache",headers:{Range:"bytes="+n+"-"+(s-1)}});if(!r.ok)throw new Error("Preview image unavailable");const a=await r.arrayBuffer();if(this.stats.bytes+=a.byteLength,r.status===206){if(a.byteLength!==s-n)throw new Error("Truncated preview image");for(const o of t)o.resolve(a.slice(o.offset-n,o.offset-n+o.length))}else{for(this.packs.set(e,a);this.packs.size>3;)this.packs.delete(this.packs.keys().next().value);const o=t.map(c=>this.extract(a,c.offset,c.length));t.forEach((c,l)=>c.resolve(o[l]))}}catch(r){for(const a of t)a.reject(r)}}}class m2{constructor(e,{revision:t,fetcher:n=fetch,storage:s=globalThis.caches}={}){this.url=e,this.revision=t||"current",this.fetcher=(r,a)=>n.call(globalThis,r,a),this.storage=s,this.promise=null,this.stats={requests:0,bytes:0,cacheHit:!1,ready:!1}}load(){return this.promise?this.promise:(this.promise=this.read().catch(e=>{throw this.promise=null,e}),this.promise)}async read(){const e=new URL(this.url,globalThis.location?.href||"https://inm.invalid/");e.searchParams.set("edition",this.revision);let t;try{t=await this.storage?.open("inm-reading-copy-v1")}catch{}if(t)try{const r=await t.match(e.href);if(r){const a=new Uint8Array(await r.arrayBuffer());if(this.valid(a))return this.stats.cacheHit=!0,this.stats.ready=!0,a;await t.delete(e.href)}}catch{}this.stats.requests++;const n=await this.fetcher(e.href,{cache:"force-cache",priority:"low"});if(!n.ok)throw new Error("Reading copy unavailable");const s=new Uint8Array(await n.arrayBuffer());if(!this.valid(s))throw new Error("Invalid reading copy");if(this.stats.bytes=s.byteLength,t)try{await t.put(e.href,new Response(s,{headers:{"Content-Type":"application/pdf"}}))}catch{}return this.stats.ready=!0,s}valid(e){return e.length>8&&String.fromCharCode(...e.subarray(0,5))==="%PDF-"}}class x2{constructor(){this.waiting=[],this.running=!1}run(e,t=!1){return new Promise((n,s)=>{const r={task:e,resolve:n,reject:s,prefetch:t};if(t)this.waiting.push(r);else{const a=this.waiting.findIndex(o=>o.prefetch);this.waiting.splice(a<0?this.waiting.length:a,0,r)}this.pump()})}async pump(){if(!this.running){for(this.running=!0;this.waiting.length;){const e=this.waiting.shift();try{e.resolve(await e.task())}catch(t){e.reject(t)}}this.running=!1}}}const g2=1,_2="66f0da6dc129",v2=1310,M2=1100,b2=["chunk-00-66f0da6dc129.bin","chunk-01-66f0da6dc129.bin","chunk-02-66f0da6dc129.bin","chunk-03-66f0da6dc129.bin","chunk-04-66f0da6dc129.bin","chunk-05-66f0da6dc129.bin","chunk-06-66f0da6dc129.bin","chunk-07-66f0da6dc129.bin","chunk-08-66f0da6dc129.bin","chunk-09-66f0da6dc129.bin","chunk-10-66f0da6dc129.bin","chunk-11-66f0da6dc129.bin","chunk-12-66f0da6dc129.bin","chunk-13-66f0da6dc129.bin","chunk-14-66f0da6dc129.bin","chunk-15-66f0da6dc129.bin","chunk-16-66f0da6dc129.bin","chunk-17-66f0da6dc129.bin","chunk-18-66f0da6dc129.bin","chunk-19-66f0da6dc129.bin","chunk-20-66f0da6dc129.bin","chunk-21-66f0da6dc129.bin","chunk-22-66f0da6dc129.bin","chunk-23-66f0da6dc129.bin","chunk-24-66f0da6dc129.bin","chunk-25-66f0da6dc129.bin","chunk-26-66f0da6dc129.bin","chunk-27-66f0da6dc129.bin","chunk-28-66f0da6dc129.bin","chunk-29-66f0da6dc129.bin","chunk-30-66f0da6dc129.bin","chunk-31-66f0da6dc129.bin","chunk-32-66f0da6dc129.bin","chunk-33-66f0da6dc129.bin","chunk-34-66f0da6dc129.bin","chunk-35-66f0da6dc129.bin","chunk-36-66f0da6dc129.bin","chunk-37-66f0da6dc129.bin","chunk-38-66f0da6dc129.bin","chunk-39-66f0da6dc129.bin","chunk-40-66f0da6dc129.bin"],S2=JSON.parse("[null,[0,8,55048,778,1100],[0,55056,1600,778,1100],[0,56656,3366,778,1100],[0,60022,1600,778,1100],[0,61622,79892,778,1100],[0,141514,1600,778,1100],[0,143114,69258,778,1100],[0,212372,88806,778,1100],[0,301178,87224,778,1100],[0,388402,94786,778,1100],[0,483188,87542,778,1100],[0,570730,95574,778,1100],[0,666304,83416,778,1100],[0,749720,89084,778,1100],[0,838804,95558,778,1100],[0,934362,93792,778,1100],[0,1028154,97630,778,1100],[0,1125784,95606,778,1100],[0,1221390,88636,778,1100],[0,1310026,99304,778,1100],[0,1409330,93610,778,1100],[0,1502940,98316,778,1100],[0,1601256,97722,778,1100],[0,1698978,91666,778,1100],[0,1790644,93814,778,1100],[0,1884458,89836,778,1100],[0,1974294,92588,778,1100],[0,2066882,93836,778,1100],[0,2160718,87496,778,1100],[0,2248214,98528,778,1100],[0,2346742,84146,778,1100],[0,2430888,95568,778,1100],[1,8,93042,778,1100],[1,93050,92402,778,1100],[1,185452,102062,778,1100],[1,287514,95850,778,1100],[1,383364,88050,778,1100],[1,471414,100884,778,1100],[1,572298,72326,778,1100],[1,644624,1600,778,1100],[1,646224,5566,778,1100],[1,651790,75830,778,1100],[1,727620,80614,778,1100],[1,808234,38118,778,1100],[1,846352,63768,778,1100],[1,910120,49484,778,1100],[1,959604,56664,778,1100],[1,1016268,70648,778,1100],[1,1086916,49848,778,1100],[1,1136764,50098,778,1100],[1,1186862,55720,778,1100],[1,1242582,40518,778,1100],[1,1283100,22000,778,1100],[1,1305100,1600,778,1100],[1,1306700,61362,778,1100],[1,1368062,60716,778,1100],[1,1428778,56344,778,1100],[1,1485122,22738,778,1100],[1,1507860,49784,778,1100],[1,1557644,1600,778,1100],[1,1559244,69882,778,1100],[1,1629126,58940,778,1100],[1,1688066,76708,778,1100],[1,1764774,55580,778,1100],[2,8,78050,778,1100],[2,78058,74720,778,1100],[2,152778,80512,778,1100],[2,233290,82772,778,1100],[2,316062,78862,778,1100],[2,394924,88840,778,1100],[2,483764,27900,778,1100],[2,511664,1600,778,1100],[2,513264,71910,778,1100],[2,585174,67862,778,1100],[2,653036,81036,778,1100],[2,734072,31764,778,1100],[2,765836,73878,778,1100],[2,839714,72076,778,1100],[2,911790,74358,778,1100],[2,986148,67838,778,1100],[2,1053986,70628,778,1100],[2,1124614,82372,778,1100],[2,1206986,112110,778,1100],[2,1319096,52310,778,1100],[2,1371406,79576,778,1100],[2,1450982,84602,778,1100],[2,1535584,98570,778,1100],[2,1634154,9302,778,1100],[2,1643456,72796,778,1100],[2,1716252,75080,778,1100],[2,1791332,58070,778,1100],[2,1849402,21692,778,1100],[2,1871094,82938,778,1100],[2,1954032,91442,778,1100],[2,2045474,76068,778,1100],[2,2121542,1600,778,1100],[3,8,70402,778,1100],[3,70410,83152,778,1100],[3,153562,24026,778,1100],[3,177588,1600,778,1100],[3,179188,54618,778,1100],[3,233806,47430,778,1100],[3,281236,73294,778,1100],[3,354530,44268,778,1100],[3,398798,25348,778,1100],[3,424146,1600,778,1100],[3,425746,63408,778,1100],[3,489154,77842,778,1100],[3,566996,61040,778,1100],[3,628036,65436,778,1100],[3,693472,73530,778,1100],[3,767002,68916,778,1100],[3,835918,60730,778,1100],[3,896648,34890,778,1100],[3,931538,72148,778,1100],[3,1003686,73100,778,1100],[3,1076786,61322,778,1100],[3,1138108,59806,778,1100],[3,1197914,87882,778,1100],[3,1285796,82452,778,1100],[3,1368248,49922,778,1100],[3,1418170,1600,778,1100],[3,1419770,49384,778,1100],[3,1469154,52426,778,1100],[3,1521580,45764,778,1100],[3,1567344,53400,778,1100],[3,1620744,70372,778,1100],[3,1691116,28726,778,1100],[4,8,4008,778,1100],[4,4016,81548,778,1100],[4,85564,87938,778,1100],[4,173502,1600,778,1100],[4,175102,52592,778,1100],[4,227694,37114,778,1100],[4,264808,41278,778,1100],[4,306086,46950,778,1100],[4,353036,50340,778,1100],[4,403376,42170,778,1100],[4,445546,48638,778,1100],[4,494184,24024,778,1100],[4,518208,45886,778,1100],[4,564094,55252,778,1100],[4,619346,53530,778,1100],[4,672876,35956,778,1100],[4,708832,80186,778,1100],[4,789018,62362,778,1100],[4,851380,31892,778,1100],[4,883272,1600,778,1100],[4,884872,64106,778,1100],[4,948978,59662,778,1100],[4,1008640,47412,778,1100],[4,1056052,1600,778,1100],[4,1057652,63768,778,1100],[4,1121420,59322,778,1100],[4,1180742,69308,778,1100],[4,1250050,46204,778,1100],[4,1296254,78868,778,1100],[4,1375122,1600,778,1100],[4,1376722,55662,778,1100],[4,1432384,58438,778,1100],[5,8,49896,778,1100],[5,49904,57086,778,1100],[5,106990,77326,778,1100],[5,184316,54032,778,1100],[5,238348,57756,778,1100],[5,296104,52626,778,1100],[5,348730,41944,778,1100],[5,390674,53598,778,1100],[5,444272,59400,778,1100],[5,503672,38334,778,1100],[5,542006,52388,778,1100],[5,594394,55882,778,1100],[5,650276,54370,778,1100],[5,704646,39212,778,1100],[5,743858,51520,778,1100],[5,795378,39516,778,1100],[5,834894,52130,778,1100],[5,887024,47754,778,1100],[5,934778,35356,778,1100],[5,970134,47786,778,1100],[5,1017920,68014,778,1100],[5,1085934,1600,778,1100],[5,1087534,72202,778,1100],[5,1159736,60290,778,1100],[5,1220026,49748,778,1100],[5,1269774,36380,778,1100],[5,1306154,64826,778,1100],[5,1370980,57156,778,1100],[5,1428136,63338,778,1100],[5,1491474,14608,778,1100],[5,1506082,38458,778,1100],[5,1544540,50424,778,1100],[6,8,57354,778,1100],[6,57362,47368,778,1100],[6,104730,55858,778,1100],[6,160588,46816,778,1100],[6,207404,46968,778,1100],[6,254372,49208,778,1100],[6,303580,69044,778,1100],[6,372624,1600,778,1100],[6,374224,100846,778,1100],[6,475070,96124,778,1100],[6,571194,94928,778,1100],[6,666122,82858,778,1100],[6,748980,100600,778,1100],[6,849580,82956,778,1100],[6,932536,86890,778,1100],[6,1019426,78474,778,1100],[6,1097900,72504,778,1100],[6,1170404,82716,778,1100],[6,1253120,94046,778,1100],[6,1347166,111622,778,1100],[6,1458788,94230,778,1100],[6,1553018,97704,778,1100],[6,1650722,97406,778,1100],[6,1748128,96608,778,1100],[6,1844736,31108,778,1100],[6,1875844,1600,778,1100],[6,1877444,7194,778,1100],[6,1884638,82584,778,1100],[6,1967222,84378,778,1100],[6,2051600,52272,778,1100],[6,2103872,71256,778,1100],[6,2175128,52696,778,1100],[7,8,49294,778,1100],[7,49302,61274,778,1100],[7,110576,74066,778,1100],[7,184642,47108,778,1100],[7,231750,54634,778,1100],[7,286384,26120,778,1100],[7,312504,39688,778,1100],[7,352192,43212,778,1100],[7,395404,44978,778,1100],[7,440382,53374,778,1100],[7,493756,39238,778,1100],[7,532994,56942,778,1100],[7,589936,38436,778,1100],[7,628372,1600,778,1100],[7,629972,64312,778,1100],[7,694284,75304,778,1100],[7,769588,70830,778,1100],[7,840418,1600,778,1100],[7,842018,55492,778,1100],[7,897510,65954,778,1100],[7,963464,68332,778,1100],[7,1031796,26312,778,1100],[7,1058108,68252,778,1100],[7,1126360,46156,778,1100],[7,1172516,55816,778,1100],[7,1228332,73264,778,1100],[7,1301596,57346,778,1100],[7,1358942,49664,778,1100],[7,1408606,49248,778,1100],[7,1457854,51072,778,1100],[7,1508926,79526,778,1100],[7,1588452,71204,778,1100],[8,8,16670,778,1100],[8,16678,1600,778,1100],[8,18278,56338,778,1100],[8,74616,49916,778,1100],[8,124532,54528,778,1100],[8,179060,74006,778,1100],[8,253066,81570,778,1100],[8,334636,21824,778,1100],[8,356460,49340,778,1100],[8,405800,62038,778,1100],[8,467838,72826,778,1100],[8,540664,8094,778,1100],[8,548758,53646,778,1100],[8,602404,44776,778,1100],[8,647180,75542,778,1100],[8,722722,12090,778,1100],[8,734812,42642,778,1100],[8,777454,85876,778,1100],[8,863330,56418,778,1100],[8,919748,72546,778,1100],[8,992294,54052,778,1100],[8,1046346,65020,778,1100],[8,1111366,82988,778,1100],[8,1194354,34726,778,1100],[8,1229080,51996,778,1100],[8,1281076,62332,778,1100],[8,1343408,46510,778,1100],[8,1389918,85120,778,1100],[8,1475038,71938,778,1100],[8,1546976,43336,778,1100],[8,1590312,79196,778,1100],[8,1669508,59068,778,1100],[9,8,89420,778,1100],[9,89428,65588,778,1100],[9,155016,54666,778,1100],[9,209682,55008,778,1100],[9,264690,55670,778,1100],[9,320360,80922,778,1100],[9,401282,69576,778,1100],[9,470858,74886,778,1100],[9,545744,73190,778,1100],[9,618934,64038,778,1100],[9,682972,66282,778,1100],[9,749254,72698,778,1100],[9,821952,75014,778,1100],[9,896966,62740,778,1100],[9,959706,97672,778,1100],[9,1057378,40670,778,1100],[9,1098048,74382,778,1100],[9,1172430,81928,778,1100],[9,1254358,63984,778,1100],[9,1318342,66012,778,1100],[9,1384354,61822,778,1100],[9,1446176,77354,778,1100],[9,1523530,54140,778,1100],[9,1577670,61360,778,1100],[9,1639030,75108,778,1100],[9,1714138,24500,778,1100],[9,1738638,75376,778,1100],[9,1814014,71372,778,1100],[9,1885386,48134,778,1100],[9,1933520,84954,778,1100],[9,2018474,55664,778,1100],[9,2074138,67800,778,1100],[10,8,86804,778,1100],[10,86812,1600,778,1100],[10,88412,5670,778,1100],[10,94082,85806,778,1100],[10,179888,91612,778,1100],[10,271500,24806,778,1100],[10,296306,66776,778,1100],[10,363082,52252,778,1100],[10,415334,51904,778,1100],[10,467238,40188,778,1100],[10,507426,47524,778,1100],[10,554950,46686,778,1100],[10,601636,36598,778,1100],[10,638234,1600,778,1100],[10,639834,60368,778,1100],[10,700202,63518,778,1100],[10,763720,53076,778,1100],[10,816796,31608,778,1100],[10,848404,49320,778,1100],[10,897724,59782,778,1100],[10,957506,75170,778,1100],[10,1032676,85950,778,1100],[10,1118626,65762,778,1100],[10,1184388,75760,778,1100],[10,1260148,78622,778,1100],[10,1338770,1600,778,1100],[10,1340370,54494,778,1100],[10,1394864,56210,778,1100],[10,1451074,48760,778,1100],[10,1499834,1600,778,1100],[10,1501434,53348,778,1100],[10,1554782,56332,778,1100],[11,8,62546,778,1100],[11,62554,27084,778,1100],[11,89638,43920,778,1100],[11,133558,46660,778,1100],[11,180218,37186,778,1100],[11,217404,35954,778,1100],[11,253358,51308,778,1100],[11,304666,41318,778,1100],[11,345984,42488,778,1100],[11,388472,28350,778,1100],[11,416822,65162,778,1100],[11,481984,55488,778,1100],[11,537472,57644,778,1100],[11,595116,1600,778,1100],[11,596716,65640,778,1100],[11,662356,65216,778,1100],[11,727572,78008,778,1100],[11,805580,74150,778,1100],[11,879730,53240,778,1100],[11,932970,1600,778,1100],[11,934570,65342,778,1100],[11,999912,65070,778,1100],[11,1064982,71936,778,1100],[11,1136918,1600,778,1100],[11,1138518,48990,778,1100],[11,1187508,49716,778,1100],[11,1237224,61690,778,1100],[11,1298914,68542,778,1100],[11,1367456,64836,778,1100],[11,1432292,58396,778,1100],[11,1490688,48842,778,1100],[11,1539530,83814,778,1100],[12,8,59286,778,1100],[12,59294,70642,778,1100],[12,129936,60938,778,1100],[12,190874,62262,778,1100],[12,253136,73322,778,1100],[12,326458,49338,778,1100],[12,375796,54122,778,1100],[12,429918,73496,778,1100],[12,503414,36176,778,1100],[12,539590,1600,778,1100],[12,541190,61728,778,1100],[12,602918,58370,778,1100],[12,661288,54162,778,1100],[12,715450,54210,778,1100],[12,769660,54442,778,1100],[12,824102,58232,778,1100],[12,882334,6038,778,1100],[12,888372,89010,778,1100],[12,977382,90956,778,1100],[12,1068338,22672,778,1100],[12,1091010,68820,778,1100],[12,1159830,67900,778,1100],[12,1227730,65136,778,1100],[12,1292866,82624,778,1100],[12,1375490,61592,778,1100],[12,1437082,72078,778,1100],[12,1509160,72052,778,1100],[12,1581212,74104,778,1100],[12,1655316,79156,778,1100],[12,1734472,51682,778,1100],[12,1786154,66404,778,1100],[12,1852558,87450,778,1100],[13,8,94998,778,1100],[13,95006,1600,778,1100],[13,96606,63444,778,1100],[13,160050,65912,778,1100],[13,225962,53802,778,1100],[13,279764,1600,778,1100],[13,281364,43418,778,1100],[13,324782,41450,778,1100],[13,366232,45440,778,1100],[13,411672,47840,778,1100],[13,459512,42502,778,1100],[13,502014,34440,778,1100],[13,536454,34324,778,1100],[13,570778,14100,778,1100],[13,584878,75316,778,1100],[13,660194,60852,778,1100],[13,721046,41268,778,1100],[13,762314,1600,778,1100],[13,763914,72814,778,1100],[13,836728,43102,778,1100],[13,879830,41930,778,1100],[13,921760,46082,778,1100],[13,967842,57940,778,1100],[13,1025782,45346,778,1100],[13,1071128,39124,778,1100],[13,1110252,56058,778,1100],[13,1166310,66272,778,1100],[13,1232582,1600,778,1100],[13,1234182,51220,778,1100],[13,1285402,50002,778,1100],[13,1335404,59500,778,1100],[13,1394904,55848,778,1100],[14,8,51162,778,1100],[14,51170,32088,778,1100],[14,83258,39088,778,1100],[14,122346,1600,778,1100],[14,123946,67036,778,1100],[14,190982,43358,778,1100],[14,234340,56354,778,1100],[14,290694,52954,778,1100],[14,343648,51992,778,1100],[14,395640,51544,778,1100],[14,447184,70984,778,1100],[14,518168,50388,778,1100],[14,568556,37180,778,1100],[14,605736,32334,778,1100],[14,638070,46624,778,1100],[14,684694,61562,778,1100],[14,746256,54320,778,1100],[14,800576,66858,778,1100],[14,867434,47320,778,1100],[14,914754,53516,778,1100],[14,968270,66052,778,1100],[14,1034322,1600,778,1100],[14,1035922,59134,778,1100],[14,1095056,57762,778,1100],[14,1152818,50160,778,1100],[14,1202978,42718,778,1100],[14,1245696,56470,778,1100],[14,1302166,49922,778,1100],[14,1352088,64356,778,1100],[14,1416444,38872,778,1100],[14,1455316,45278,778,1100],[14,1500594,42728,778,1100],[15,8,45352,778,1100],[15,45360,1600,778,1100],[15,46960,50614,778,1100],[15,97574,40000,778,1100],[15,137574,49556,778,1100],[15,187130,54388,778,1100],[15,241518,55108,778,1100],[15,296626,39116,778,1100],[15,335742,43448,778,1100],[15,379190,60256,778,1100],[15,439446,22384,778,1100],[15,461830,1600,778,1100],[15,463430,6914,778,1100],[15,470344,86530,778,1100],[15,556874,94092,778,1100],[15,650966,48478,778,1100],[15,699444,85962,778,1100],[15,785406,59158,778,1100],[15,844564,31198,778,1100],[15,875762,1600,778,1100],[15,877362,51126,778,1100],[15,928488,41524,778,1100],[15,970012,38496,778,1100],[15,1008508,47088,778,1100],[15,1055596,40664,778,1100],[15,1096260,49834,778,1100],[15,1146094,46336,778,1100],[15,1192430,45506,778,1100],[15,1237936,49272,778,1100],[15,1287208,42148,778,1100],[15,1329356,66966,778,1100],[15,1396322,53580,778,1100],[16,8,46648,778,1100],[16,46656,44896,778,1100],[16,91552,55122,778,1100],[16,146674,34828,778,1100],[16,181502,58520,778,1100],[16,240022,55346,778,1100],[16,295368,55908,778,1100],[16,351276,48940,778,1100],[16,400216,52448,778,1100],[16,452664,67990,778,1100],[16,520654,21786,778,1100],[16,542440,1600,778,1100],[16,544040,48880,778,1100],[16,592920,37600,778,1100],[16,630520,47582,778,1100],[16,678102,35614,778,1100],[16,713716,59726,778,1100],[16,773442,67420,778,1100],[16,840862,59912,778,1100],[16,900774,1600,778,1100],[16,902374,46698,778,1100],[16,949072,58140,778,1100],[16,1007212,46598,778,1100],[16,1053810,54222,778,1100],[16,1108032,59426,778,1100],[16,1167458,61434,778,1100],[16,1228892,52510,778,1100],[16,1281402,52994,778,1100],[16,1334396,47810,778,1100],[16,1382206,40268,778,1100],[16,1422474,37038,778,1100],[16,1459512,58824,778,1100],[17,8,38656,778,1100],[17,38664,56942,778,1100],[17,95606,70674,778,1100],[17,166280,60662,778,1100],[17,226942,40922,778,1100],[17,267864,49944,778,1100],[17,317808,49358,778,1100],[17,367166,54328,778,1100],[17,421494,51238,778,1100],[17,472732,65764,778,1100],[17,538496,76024,778,1100],[17,614520,27346,778,1100],[17,641866,58480,778,1100],[17,700346,43808,778,1100],[17,744154,32496,778,1100],[17,776650,58838,778,1100],[17,835488,34524,778,1100],[17,870012,47366,778,1100],[17,917378,52098,778,1100],[17,969476,37774,778,1100],[17,1007250,61866,778,1100],[17,1069116,18608,778,1100],[17,1087724,55160,778,1100],[17,1142884,45740,778,1100],[17,1188624,54246,778,1100],[17,1242870,38612,778,1100],[17,1281482,38656,778,1100],[17,1320138,57516,778,1100],[17,1377654,38764,778,1100],[17,1416418,52018,778,1100],[17,1468436,30390,778,1100],[17,1498826,1600,778,1100],[18,8,60730,778,1100],[18,60738,54708,778,1100],[18,115446,50928,778,1100],[18,166374,42134,778,1100],[18,208508,51104,778,1100],[18,259612,72446,778,1100],[18,332058,17780,778,1100],[18,349838,1600,778,1100],[18,351438,77514,778,1100],[18,428952,64336,778,1100],[18,493288,86338,778,1100],[18,579626,74750,778,1100],[18,654376,76566,778,1100],[18,730942,50220,778,1100],[18,781162,75112,778,1100],[18,856274,62016,778,1100],[18,918290,90424,778,1100],[18,1008714,87878,778,1100],[18,1096592,69144,778,1100],[18,1165736,76390,778,1100],[18,1242126,28212,778,1100],[18,1270338,1600,778,1100],[18,1271938,6152,778,1100],[18,1278090,84260,778,1100],[18,1362350,95906,778,1100],[18,1458256,86532,778,1100],[18,1544788,68078,778,1100],[18,1612866,56016,778,1100],[18,1668882,40098,778,1100],[18,1708980,1600,778,1100],[18,1710580,65686,778,1100],[18,1776266,50842,778,1100],[19,8,68346,778,1100],[19,68354,33936,778,1100],[19,102290,34510,778,1100],[19,136800,40872,778,1100],[19,177672,35362,778,1100],[19,213034,41030,778,1100],[19,254064,37012,778,1100],[19,291076,47944,778,1100],[19,339020,57604,778,1100],[19,396624,36402,778,1100],[19,433026,48386,778,1100],[19,481412,39668,778,1100],[19,521080,51892,778,1100],[19,572972,50468,778,1100],[19,623440,71022,778,1100],[19,694462,46360,778,1100],[19,740822,44760,778,1100],[19,785582,70308,778,1100],[19,855890,12814,778,1100],[19,868704,1600,778,1100],[19,870304,68434,778,1100],[19,938738,51818,778,1100],[19,990556,59522,778,1100],[19,1050078,31778,778,1100],[19,1081856,56392,778,1100],[19,1138248,67898,778,1100],[19,1206146,56730,778,1100],[19,1262876,34634,778,1100],[19,1297510,40018,778,1100],[19,1337528,48800,778,1100],[19,1386328,46816,778,1100],[19,1433144,49160,778,1100],[20,8,48558,778,1100],[20,48566,45116,778,1100],[20,93682,65186,778,1100],[20,158868,25288,778,1100],[20,184156,46030,778,1100],[20,230186,32394,778,1100],[20,262580,46718,778,1100],[20,309298,45498,778,1100],[20,354796,36304,778,1100],[20,391100,47104,778,1100],[20,438204,49840,778,1100],[20,488044,43226,778,1100],[20,531270,26814,778,1100],[20,558084,1600,778,1100],[20,559684,51128,778,1100],[20,610812,44930,778,1100],[20,655742,40598,778,1100],[20,696340,52428,778,1100],[20,748768,61030,778,1100],[20,809798,50792,778,1100],[20,860590,56300,778,1100],[20,916890,60210,778,1100],[20,977100,46704,778,1100],[20,1023804,47382,778,1100],[20,1071186,44046,778,1100],[20,1115232,54110,778,1100],[20,1169342,68258,778,1100],[20,1237600,64750,778,1100],[20,1302350,60076,778,1100],[20,1362426,26784,778,1100],[20,1389210,49194,778,1100],[20,1438404,60994,778,1100],[21,8,45258,778,1100],[21,45266,45984,778,1100],[21,91250,35962,778,1100],[21,127212,55450,778,1100],[21,182662,56126,778,1100],[21,238788,64134,778,1100],[21,302922,44886,778,1100],[21,347808,64736,778,1100],[21,412544,43848,778,1100],[21,456392,30864,778,1100],[21,487256,46428,778,1100],[21,533684,52006,778,1100],[21,585690,49310,778,1100],[21,635000,40126,778,1100],[21,675126,22262,778,1100],[21,697388,1600,778,1100],[21,698988,63376,778,1100],[21,762364,53048,778,1100],[21,815412,60992,778,1100],[21,876404,42948,778,1100],[21,919352,39366,778,1100],[21,958718,40292,778,1100],[21,999010,34734,778,1100],[21,1033744,1600,778,1100],[21,1035344,73370,778,1100],[21,1108714,56512,778,1100],[21,1165226,64744,778,1100],[21,1229970,32378,778,1100],[21,1262348,49710,778,1100],[21,1312058,57790,778,1100],[21,1369848,57322,778,1100],[21,1427170,68824,778,1100],[22,8,65308,778,1100],[22,65316,1600,778,1100],[22,66916,71382,778,1100],[22,138298,57862,778,1100],[22,196160,83848,778,1100],[22,280008,61474,778,1100],[22,341482,68692,778,1100],[22,410174,77894,778,1100],[22,488068,63208,778,1100],[22,551276,61392,778,1100],[22,612668,60016,778,1100],[22,672684,1600,778,1100],[22,674284,92138,778,1100],[22,766422,67998,778,1100],[22,834420,81444,778,1100],[22,915864,87450,778,1100],[22,1003314,89842,778,1100],[22,1093156,90248,778,1100],[22,1183404,44292,778,1100],[22,1227696,1600,778,1100],[22,1229296,6510,778,1100],[22,1235806,86710,778,1100],[22,1322516,84044,778,1100],[22,1406560,84654,778,1100],[22,1491214,38818,778,1100],[22,1530032,1600,778,1100],[22,1531632,61852,778,1100],[22,1593484,64136,778,1100],[22,1657620,32902,778,1100],[22,1690522,1600,778,1100],[22,1692122,45080,778,1100],[22,1737202,59280,778,1100],[23,8,37108,778,1100],[23,37116,78308,778,1100],[23,115424,57132,778,1100],[23,172556,55642,778,1100],[23,228198,49964,778,1100],[23,278162,47098,778,1100],[23,325260,43918,778,1100],[23,369178,55310,778,1100],[23,424488,47656,778,1100],[23,472144,45838,778,1100],[23,517982,52334,778,1100],[23,570316,30848,778,1100],[23,601164,54912,778,1100],[23,656076,53810,778,1100],[23,709886,52608,778,1100],[23,762494,57252,778,1100],[23,819746,71480,778,1100],[23,891226,52240,778,1100],[23,943466,76576,778,1100],[23,1020042,83296,778,1100],[23,1103338,38046,778,1100],[23,1141384,1600,778,1100],[23,1142984,62022,778,1100],[23,1205006,57742,778,1100],[23,1262748,45176,778,1100],[23,1307924,48898,778,1100],[23,1356822,54556,778,1100],[23,1411378,62364,778,1100],[23,1473742,42612,778,1100],[23,1516354,1600,778,1100],[23,1517954,45888,778,1100],[23,1563842,58022,778,1100],[24,8,56656,778,1100],[24,56664,58954,778,1100],[24,115618,58348,778,1100],[24,173966,60032,778,1100],[24,233998,57234,778,1100],[24,291232,1600,778,1100],[24,292832,71000,778,1100],[24,363832,61358,778,1100],[24,425190,70768,778,1100],[24,495958,36216,778,1100],[24,532174,49560,778,1100],[24,581734,48430,778,1100],[24,630164,67464,778,1100],[24,697628,52228,778,1100],[24,749856,45832,778,1100],[24,795688,50808,778,1100],[24,846496,55566,778,1100],[24,902062,29156,778,1100],[24,931218,40202,778,1100],[24,971420,1600,778,1100],[24,973020,43690,778,1100],[24,1016710,35120,778,1100],[24,1051830,40568,778,1100],[24,1092398,38646,778,1100],[24,1131044,42966,778,1100],[24,1174010,54262,778,1100],[24,1228272,43872,778,1100],[24,1272144,24572,778,1100],[24,1296716,51822,778,1100],[24,1348538,44010,778,1100],[24,1392548,46980,778,1100],[24,1439528,29648,778,1100],[25,8,44774,778,1100],[25,44782,43154,778,1100],[25,87936,54946,778,1100],[25,142882,54344,778,1100],[25,197226,61576,778,1100],[25,258802,72692,778,1100],[25,331494,70602,778,1100],[25,402096,25472,778,1100],[25,427568,59304,778,1100],[25,486872,47904,778,1100],[25,534776,56354,778,1100],[25,591130,37514,778,1100],[25,628644,40492,778,1100],[25,669136,38988,778,1100],[25,708124,47108,778,1100],[25,755232,64044,778,1100],[25,819276,63604,778,1100],[25,882880,1600,778,1100],[25,884480,60884,778,1100],[25,945364,60366,778,1100],[25,1005730,55894,778,1100],[25,1061624,30224,778,1100],[25,1091848,52742,778,1100],[25,1144590,60756,778,1100],[25,1205346,63320,778,1100],[25,1268666,39038,778,1100],[25,1307704,65032,778,1100],[25,1372736,53378,778,1100],[25,1426114,73716,778,1100],[25,1499830,13188,778,1100],[25,1513018,52382,778,1100],[25,1565400,41904,778,1100],[26,8,59462,778,1100],[26,59470,60624,778,1100],[26,120094,65610,778,1100],[26,185704,52318,778,1100],[26,238022,70014,778,1100],[26,308036,21628,778,1100],[26,329664,7352,778,1100],[26,337016,80858,778,1100],[26,417874,30486,778,1100],[26,448360,1600,778,1100],[26,449960,50098,778,1100],[26,500058,41438,778,1100],[26,541496,31910,778,1100],[26,573406,44018,778,1100],[26,617424,36072,778,1100],[26,653496,40022,778,1100],[26,693518,55206,778,1100],[26,748724,47776,778,1100],[26,796500,37902,778,1100],[26,834402,36956,778,1100],[26,871358,71298,778,1100],[26,942656,1600,778,1100],[26,944256,68568,778,1100],[26,1012824,49034,778,1100],[26,1061858,80148,778,1100],[26,1142006,18096,778,1100],[26,1160102,58816,778,1100],[26,1218918,58212,778,1100],[26,1277130,60842,778,1100],[26,1337972,38976,778,1100],[26,1376948,44780,778,1100],[26,1421728,54832,778,1100],[27,8,53042,778,1100],[27,53050,54594,778,1100],[27,107644,83270,778,1100],[27,190914,61908,778,1100],[27,252822,54276,778,1100],[27,307098,45886,778,1100],[27,352984,56768,778,1100],[27,409752,68656,778,1100],[27,478408,26498,778,1100],[27,504906,1600,778,1100],[27,506506,52204,778,1100],[27,558710,70242,778,1100],[27,628952,49460,778,1100],[27,678412,53648,778,1100],[27,732060,61198,778,1100],[27,793258,55856,778,1100],[27,849114,80490,778,1100],[27,929604,56264,778,1100],[27,985868,64036,778,1100],[27,1049904,65040,778,1100],[27,1114944,63284,778,1100],[27,1178228,44794,778,1100],[27,1223022,6752,778,1100],[27,1229774,84264,778,1100],[27,1314038,88970,778,1100],[27,1403008,17882,778,1100],[27,1420890,62776,778,1100],[27,1483666,86692,778,1100],[27,1570358,63172,778,1100],[27,1633530,63818,778,1100],[27,1697348,69102,778,1100],[27,1766450,56164,778,1100],[28,8,78146,778,1100],[28,78154,67948,778,1100],[28,146102,13512,778,1100],[28,159614,1600,778,1100],[28,161214,50578,778,1100],[28,211792,57146,778,1100],[28,268938,58668,778,1100],[28,327606,38732,778,1100],[28,366338,57686,778,1100],[28,424024,61336,778,1100],[28,485360,65346,778,1100],[28,550706,16980,778,1100],[28,567686,57946,778,1100],[28,625632,68564,778,1100],[28,694196,79684,778,1100],[28,773880,1600,778,1100],[28,775480,46702,778,1100],[28,822182,56116,778,1100],[28,878298,54476,778,1100],[28,932774,54870,778,1100],[28,987644,41988,778,1100],[28,1029632,44504,778,1100],[28,1074136,40778,778,1100],[28,1114914,54484,778,1100],[28,1169398,57848,778,1100],[28,1227246,41068,778,1100],[28,1268314,42812,778,1100],[28,1311126,47132,778,1100],[28,1358258,43026,778,1100],[28,1401284,38170,778,1100],[28,1439454,53690,778,1100],[28,1493144,35646,778,1100],[29,8,39848,778,1100],[29,39856,1600,778,1100],[29,41456,62848,778,1100],[29,104304,55964,778,1100],[29,160268,83214,778,1100],[29,243482,75864,778,1100],[29,319346,39352,778,1100],[29,358698,42460,778,1100],[29,401158,52448,778,1100],[29,453606,89308,778,1100],[29,542914,87830,778,1100],[29,630744,1600,778,1100],[29,632344,62822,778,1100],[29,695166,64876,778,1100],[29,760042,55248,778,1100],[29,815290,62844,778,1100],[29,878134,71374,778,1100],[29,949508,1600,778,1100],[29,951108,59682,778,1100],[29,1010790,55800,778,1100],[29,1066590,64340,778,1100],[29,1130930,62702,778,1100],[29,1193632,57174,778,1100],[29,1250806,58142,778,1100],[29,1308948,50522,778,1100],[29,1359470,1600,778,1100],[29,1361070,55746,778,1100],[29,1416816,56672,778,1100],[29,1473488,65708,778,1100],[29,1539196,1600,778,1100],[29,1540796,62892,778,1100],[29,1603688,77616,778,1100],[30,8,51128,778,1100],[30,51136,1600,778,1100],[30,52736,63666,778,1100],[30,116402,38902,778,1100],[30,155304,46974,778,1100],[30,202278,64490,778,1100],[30,266768,69970,778,1100],[30,336738,72740,778,1100],[30,409478,81294,778,1100],[30,490772,75376,778,1100],[30,566148,6684,778,1100],[30,572832,86628,778,1100],[30,659460,86554,778,1100],[30,746014,62036,778,1100],[30,808050,55214,778,1100],[30,863264,44440,778,1100],[30,907704,55438,778,1100],[30,963142,62252,778,1100],[30,1025394,73060,778,1100],[30,1098454,52516,778,1100],[30,1150970,63136,778,1100],[30,1214106,64838,778,1100],[30,1278944,36946,778,1100],[30,1315890,1600,778,1100],[30,1317490,78600,778,1100],[30,1396090,92456,778,1100],[30,1488546,56508,778,1100],[30,1545054,1600,778,1100],[30,1546654,60320,778,1100],[30,1606974,50114,778,1100],[30,1657088,60848,778,1100],[30,1717936,66520,778,1100],[31,8,61966,778,1100],[31,61974,67980,778,1100],[31,129954,26452,778,1100],[31,156406,1600,778,1100],[31,158006,47686,778,1100],[31,205692,49756,778,1100],[31,255448,53610,778,1100],[31,309058,60530,778,1100],[31,369588,68812,778,1100],[31,438400,1600,778,1100],[31,440000,43708,778,1100],[31,483708,61048,778,1100],[31,544756,43000,778,1100],[31,587756,48690,778,1100],[31,636446,50990,778,1100],[31,687436,75668,778,1100],[31,763104,81746,778,1100],[31,844850,67744,778,1100],[31,912594,29394,778,1100],[31,941988,1600,778,1100],[31,943588,71552,778,1100],[31,1015140,72250,778,1100],[31,1087390,52934,778,1100],[31,1140324,51738,778,1100],[31,1192062,49860,778,1100],[31,1241922,56648,778,1100],[31,1298570,59316,778,1100],[31,1357886,66236,778,1100],[31,1424122,43958,778,1100],[31,1468080,1600,778,1100],[31,1469680,79852,778,1100],[31,1549532,88766,778,1100],[32,8,55920,778,1100],[32,55928,58940,778,1100],[32,114868,45216,778,1100],[32,160084,48110,778,1100],[32,208194,33762,778,1100],[32,241956,1600,778,1100],[32,243556,55102,778,1100],[32,298658,68076,778,1100],[32,366734,51084,778,1100],[32,417818,77194,778,1100],[32,495012,51420,778,1100],[32,546432,52098,778,1100],[32,598530,62428,778,1100],[32,660958,76292,778,1100],[32,737250,80500,778,1100],[32,817750,76924,778,1100],[32,894674,45640,778,1100],[32,940314,97020,778,1100],[32,1037334,20370,778,1100],[32,1057704,1600,778,1100],[32,1059304,45678,778,1100],[32,1104982,57344,778,1100],[32,1162326,74042,778,1100],[32,1236368,64208,778,1100],[32,1300576,68278,778,1100],[32,1368854,69208,778,1100],[32,1438062,50602,778,1100],[32,1488664,27218,778,1100],[32,1515882,72906,778,1100],[32,1588788,78526,778,1100],[32,1667314,44082,778,1100],[32,1711396,77736,778,1100],[33,8,61426,778,1100],[33,61434,54088,778,1100],[33,115522,69448,778,1100],[33,184970,73264,778,1100],[33,258234,59646,778,1100],[33,317880,67990,778,1100],[33,385870,48964,778,1100],[33,434834,39464,778,1100],[33,474298,44352,778,1100],[33,518650,43664,778,1100],[33,562314,36590,778,1100],[33,598904,1600,778,1100],[33,600504,95634,778,1100],[33,696138,72670,778,1100],[33,768808,68858,778,1100],[33,837666,67840,778,1100],[33,905506,70214,778,1100],[33,975720,69172,778,1100],[33,1044892,85346,778,1100],[33,1130238,78182,778,1100],[33,1208420,91298,778,1100],[33,1299718,78144,778,1100],[33,1377862,92500,778,1100],[33,1470362,75474,778,1100],[33,1545836,78856,778,1100],[33,1624692,109828,778,1100],[33,1734520,81546,778,1100],[33,1816066,98768,778,1100],[33,1914834,72752,778,1100],[33,1987586,80938,778,1100],[33,2068524,54466,778,1100],[33,2122990,87062,778,1100],[34,8,64296,778,1100],[34,64304,57820,778,1100],[34,122124,82624,778,1100],[34,204748,67786,778,1100],[34,272534,102964,778,1100],[34,375498,35492,778,1100],[34,410990,7504,778,1100],[34,418494,92918,778,1100],[34,511412,88862,778,1100],[34,600274,46438,778,1100],[34,646712,82880,778,1100],[34,729592,79974,778,1100],[34,809566,86436,778,1100],[34,896002,72700,778,1100],[34,968702,69662,778,1100],[34,1038364,61082,778,1100],[34,1099446,75946,778,1100],[34,1175392,1600,778,1100],[34,1176992,73910,778,1100],[34,1250902,69462,778,1100],[34,1320364,66022,778,1100],[34,1386386,68170,778,1100],[34,1454556,44130,778,1100],[34,1498686,1600,778,1100],[34,1500286,52392,778,1100],[34,1552678,65534,778,1100],[34,1618212,37758,778,1100],[34,1655970,44474,778,1100],[34,1700444,57206,778,1100],[34,1757650,58096,778,1100],[34,1815746,68758,778,1100],[34,1884504,88072,778,1100],[35,8,70726,778,1100],[35,70734,43112,778,1100],[35,113846,60670,778,1100],[35,174516,43032,778,1100],[35,217548,44402,778,1100],[35,261950,48044,778,1100],[35,309994,51178,778,1100],[35,361172,1600,778,1100],[35,362772,55016,778,1100],[35,417788,57000,778,1100],[35,474788,61340,778,1100],[35,536128,62462,778,1100],[35,598590,52410,778,1100],[35,651000,44402,778,1100],[35,695402,56274,778,1100],[35,751676,73744,778,1100],[35,825420,58362,778,1100],[35,883782,70110,778,1100],[35,953892,74632,778,1100],[35,1028524,51220,778,1100],[35,1079744,64984,778,1100],[35,1144728,59652,778,1100],[35,1204380,77260,778,1100],[35,1281640,1600,778,1100],[35,1283240,66740,778,1100],[35,1349980,68204,778,1100],[35,1418184,76072,778,1100],[35,1494256,31634,778,1100],[35,1525890,71230,778,1100],[35,1597120,64212,778,1100],[35,1661332,59350,778,1100],[35,1720682,1600,778,1100],[36,8,67412,778,1100],[36,67420,55298,778,1100],[36,122718,62794,778,1100],[36,185512,45968,778,1100],[36,231480,83762,778,1100],[36,315242,75606,778,1100],[36,390848,87160,778,1100],[36,478008,91958,778,1100],[36,569966,86806,778,1100],[36,656772,80178,778,1100],[36,736950,86296,778,1100],[36,823246,76898,778,1100],[36,900144,118896,778,1100],[36,1019040,9260,778,1100],[36,1028300,81340,778,1100],[36,1109640,83086,778,1100],[36,1192726,60948,778,1100],[36,1253674,94552,778,1100],[36,1348226,99204,778,1100],[36,1447430,94368,778,1100],[36,1541798,107754,778,1100],[36,1649552,61234,778,1100],[36,1710786,71486,778,1100],[36,1782272,77082,778,1100],[36,1859354,58754,778,1100],[36,1918108,51560,778,1100],[36,1969668,78652,778,1100],[36,2048320,94798,778,1100],[36,2143118,85822,778,1100],[36,2228940,79050,778,1100],[36,2307990,75096,778,1100],[36,2383086,60824,778,1100],[37,8,62318,778,1100],[37,62326,51032,778,1100],[37,113358,63268,778,1100],[37,176626,76862,778,1100],[37,253488,60676,778,1100],[37,314164,74508,778,1100],[37,388672,82236,778,1100],[37,470908,86104,778,1100],[37,557012,7056,778,1100],[37,564068,81580,778,1100],[37,645648,99428,778,1100],[37,745076,22442,778,1100],[37,767518,52168,778,1100],[37,819686,40822,778,1100],[37,860508,48922,778,1100],[37,909430,42778,778,1100],[37,952208,76272,778,1100],[37,1028480,66894,778,1100],[37,1095374,57734,778,1100],[37,1153108,57260,778,1100],[37,1210368,80054,778,1100],[37,1290422,26368,778,1100],[37,1316790,72532,778,1100],[37,1389322,53964,778,1100],[37,1443286,51050,778,1100],[37,1494336,65826,778,1100],[37,1560162,17998,778,1100],[37,1578160,1600,778,1100],[37,1579760,45318,778,1100],[37,1625078,57198,778,1100],[37,1682276,54008,778,1100],[37,1736284,60532,778,1100],[38,8,46046,778,1100],[38,46054,79242,778,1100],[38,125296,74924,778,1100],[38,200220,1600,778,1100],[38,201820,52500,778,1100],[38,254320,68572,778,1100],[38,322892,61442,778,1100],[38,384334,53860,778,1100],[38,438194,58390,778,1100],[38,496584,69762,778,1100],[38,566346,16832,778,1100],[38,583178,1600,778,1100],[38,584778,77020,778,1100],[38,661798,49048,778,1100],[38,710846,65452,778,1100],[38,776298,76022,778,1100],[38,852320,75196,778,1100],[38,927516,75768,778,1100],[38,1003284,66776,778,1100],[38,1070060,60360,778,1100],[38,1130420,83108,778,1100],[38,1213528,61998,778,1100],[38,1275526,78274,778,1100],[38,1353800,85764,778,1100],[38,1439564,69340,778,1100],[38,1508904,71588,778,1100],[38,1580492,81108,778,1100],[38,1661600,95184,778,1100],[38,1756784,83146,778,1100],[38,1839930,98502,778,1100],[38,1938432,47668,778,1100],[38,1986100,78444,778,1100],[39,8,78188,778,1100],[39,78196,61916,778,1100],[39,140112,86094,778,1100],[39,226206,34080,778,1100],[39,260286,81168,778,1100],[39,341454,56024,778,1100],[39,397478,72782,778,1100],[39,470260,74242,778,1100],[39,544502,67418,778,1100],[39,611920,74758,778,1100],[39,686678,103036,778,1100],[39,789714,86036,778,1100],[39,875750,75378,778,1100],[39,951128,73988,778,1100],[39,1025116,84350,778,1100],[39,1109466,94474,778,1100],[39,1203940,58912,778,1100],[39,1262852,105754,778,1100],[39,1368606,83496,778,1100],[39,1452102,113744,778,1100],[39,1565846,43618,778,1100],[39,1609464,1600,778,1100],[39,1611064,82194,778,1100],[39,1693258,68968,778,1100],[39,1762226,55438,778,1100],[39,1817664,65650,778,1100],[39,1883314,73774,778,1100],[39,1957088,67538,778,1100],[39,2024626,72180,778,1100],[39,2096806,79026,778,1100],[39,2175832,67136,778,1100],[39,2242968,62910,778,1100],[40,8,72040,778,1100],[40,72048,87790,778,1100],[40,159838,81944,778,1100],[40,241782,107868,778,1100],[40,349650,115870,778,1100],[40,465520,118462,778,1100],[40,583982,36186,778,1100],[40,620168,1600,778,1100],[40,621768,101256,778,1100],[40,723024,79142,778,1100],[40,802166,99976,778,1100],[40,902142,71948,778,1100],[40,974090,63350,778,1100],[40,1037440,81384,778,1100],[40,1118824,67096,778,1100],[40,1185920,74140,778,1100],[40,1260060,68348,778,1100],[40,1328408,1600,778,1100],[40,1330008,103526,778,1100],[40,1433534,90688,778,1100],[40,1524222,86914,778,1100],[40,1611136,80516,778,1100],[40,1691652,85422,778,1100],[40,1777074,92518,778,1100],[40,1869592,100642,778,1100],[40,1970234,89182,778,1100],[40,2059416,86906,778,1100],[40,2146322,108740,778,1100],[40,2255062,55788,778,1100],[40,2310850,1600,778,1100]]"),y2=JSON.parse('{"version":1,"source":"b70e7c534eba","count":1310,"height":780,"packs":["chunk-00-b70e7c534eba.bin","chunk-01-b70e7c534eba.bin","chunk-02-b70e7c534eba.bin","chunk-03-b70e7c534eba.bin","chunk-04-b70e7c534eba.bin","chunk-05-b70e7c534eba.bin","chunk-06-b70e7c534eba.bin","chunk-07-b70e7c534eba.bin","chunk-08-b70e7c534eba.bin","chunk-09-b70e7c534eba.bin","chunk-10-b70e7c534eba.bin","chunk-11-b70e7c534eba.bin","chunk-12-b70e7c534eba.bin","chunk-13-b70e7c534eba.bin","chunk-14-b70e7c534eba.bin","chunk-15-b70e7c534eba.bin","chunk-16-b70e7c534eba.bin","chunk-17-b70e7c534eba.bin","chunk-18-b70e7c534eba.bin","chunk-19-b70e7c534eba.bin","chunk-20-b70e7c534eba.bin","chunk-21-b70e7c534eba.bin","chunk-22-b70e7c534eba.bin","chunk-23-b70e7c534eba.bin","chunk-24-b70e7c534eba.bin","chunk-25-b70e7c534eba.bin","chunk-26-b70e7c534eba.bin","chunk-27-b70e7c534eba.bin","chunk-28-b70e7c534eba.bin","chunk-29-b70e7c534eba.bin","chunk-30-b70e7c534eba.bin","chunk-31-b70e7c534eba.bin","chunk-32-b70e7c534eba.bin","chunk-33-b70e7c534eba.bin","chunk-34-b70e7c534eba.bin","chunk-35-b70e7c534eba.bin","chunk-36-b70e7c534eba.bin","chunk-37-b70e7c534eba.bin","chunk-38-b70e7c534eba.bin","chunk-39-b70e7c534eba.bin","chunk-40-b70e7c534eba.bin"],"pages":[null,[0,8,24320,552,780],[0,24328,842,552,780],[0,25170,1624,552,780],[0,26794,842,552,780],[0,27636,40704,552,780],[0,68340,842,552,780],[0,69182,34416,552,780],[0,103598,42724,552,780],[0,146322,42544,552,780],[0,188866,46072,552,780],[0,234938,42334,552,780],[0,277272,46372,552,780],[0,323644,41538,552,780],[0,365182,43502,552,780],[0,408684,46352,552,780],[0,455036,45370,552,780],[0,500406,47168,552,780],[0,547574,45992,552,780],[0,593566,43124,552,780],[0,636690,47702,552,780],[0,684392,45372,552,780],[0,729764,47234,552,780],[0,776998,46902,552,780],[0,823900,44360,552,780],[0,868260,45170,552,780],[0,913430,43480,552,780],[0,956910,44490,552,780],[0,1001400,45376,552,780],[0,1046776,42618,552,780],[0,1089394,47800,552,780],[0,1137194,41112,552,780],[0,1178306,46934,552,780],[1,8,44520,552,780],[1,44528,45396,552,780],[1,89924,49054,552,780],[1,138978,46740,552,780],[1,185718,42878,552,780],[1,228596,48744,552,780],[1,277340,34528,552,780],[1,311868,842,552,780],[1,312710,3210,552,780],[1,315920,37572,552,780],[1,353492,39040,552,780],[1,392532,18296,552,780],[1,410828,34870,552,780],[1,445698,26122,552,780],[1,471820,29678,552,780],[1,501498,37126,552,780],[1,538624,26816,552,780],[1,565440,26492,552,780],[1,591932,29818,552,780],[1,621750,22076,552,780],[1,643826,11656,552,780],[1,655482,842,552,780],[1,656324,32510,552,780],[1,688834,31272,552,780],[1,720106,29358,552,780],[1,749464,12330,552,780],[1,761794,26550,552,780],[1,788344,842,552,780],[1,789186,36626,552,780],[1,825812,31016,552,780],[1,856828,39390,552,780],[1,896218,29238,552,780],[2,8,40128,552,780],[2,40136,38842,552,780],[2,78978,42604,552,780],[2,121582,43572,552,780],[2,165154,40784,552,780],[2,205938,46438,552,780],[2,252376,14218,552,780],[2,266594,842,552,780],[2,267436,38574,552,780],[2,306010,35076,552,780],[2,341086,42154,552,780],[2,383240,16150,552,780],[2,399390,39342,552,780],[2,438732,38390,552,780],[2,477122,38618,552,780],[2,515740,35784,552,780],[2,551524,35948,552,780],[2,587472,44460,552,780],[2,631932,59320,552,780],[2,691252,27414,552,780],[2,718666,41982,552,780],[2,760648,44110,552,780],[2,804758,51654,552,780],[2,856412,4650,552,780],[2,861062,38732,552,780],[2,899794,38816,552,780],[2,938610,30422,552,780],[2,969032,11200,552,780],[2,980232,42682,552,780],[2,1022914,46648,552,780],[2,1069562,39442,552,780],[2,1109004,842,552,780],[3,8,36156,552,780],[3,36164,43150,552,780],[3,79314,11866,552,780],[3,91180,842,552,780],[3,92022,29590,552,780],[3,121612,25140,552,780],[3,146752,38924,552,780],[3,185676,23836,552,780],[3,209512,13138,552,780],[3,222650,842,552,780],[3,223492,33658,552,780],[3,257150,40684,552,780],[3,297834,31784,552,780],[3,329618,34270,552,780],[3,363888,37852,552,780],[3,401740,36268,552,780],[3,438008,31926,552,780],[3,469934,17432,552,780],[3,487366,37898,552,780],[3,525264,38246,552,780],[3,563510,32108,552,780],[3,595618,31694,552,780],[3,627312,45052,552,780],[3,672364,42232,552,780],[3,714596,25586,552,780],[3,740182,842,552,780],[3,741024,26648,552,780],[3,767672,27786,552,780],[3,795458,24648,552,780],[3,820106,27928,552,780],[3,848034,36568,552,780],[3,884602,14740,552,780],[4,8,2340,552,780],[4,2348,39726,552,780],[4,42074,42618,552,780],[4,84692,842,552,780],[4,85534,28802,552,780],[4,114336,19534,552,780],[4,133870,21500,552,780],[4,155370,24854,552,780],[4,180224,25826,552,780],[4,206050,22558,552,780],[4,228608,24922,552,780],[4,253530,13292,552,780],[4,266822,23620,552,780],[4,290442,29478,552,780],[4,319920,28004,552,780],[4,347924,18530,552,780],[4,366454,41666,552,780],[4,408120,33458,552,780],[4,441578,16076,552,780],[4,457654,842,552,780],[4,458496,33790,552,780],[4,492286,32134,552,780],[4,524420,24562,552,780],[4,548982,842,552,780],[4,549824,33370,552,780],[4,583194,31004,552,780],[4,614198,35484,552,780],[4,649682,23680,552,780],[4,673362,40966,552,780],[4,714328,842,552,780],[4,715170,29812,552,780],[4,744982,30910,552,780],[5,8,25454,552,780],[5,25462,30494,552,780],[5,55956,39922,552,780],[5,95878,27854,552,780],[5,123732,30808,552,780],[5,154540,27562,552,780],[5,182102,21328,552,780],[5,203430,27470,552,780],[5,230900,31028,552,780],[5,261928,20374,552,780],[5,282302,27024,552,780],[5,309326,28626,552,780],[5,337952,29138,552,780],[5,367090,20692,552,780],[5,387782,28126,552,780],[5,415908,20614,552,780],[5,436522,26938,552,780],[5,463460,25278,552,780],[5,488738,18108,552,780],[5,506846,25796,552,780],[5,532642,34358,552,780],[5,567000,842,552,780],[5,567842,38298,552,780],[5,606140,32196,552,780],[5,638336,26604,552,780],[5,664940,19050,552,780],[5,683990,34556,552,780],[5,718546,29964,552,780],[5,748510,34176,552,780],[5,782686,7470,552,780],[5,790156,20772,552,780],[5,810928,26812,552,780],[6,8,29864,552,780],[6,29872,25198,552,780],[6,55070,29492,552,780],[6,84562,24332,552,780],[6,108894,24952,552,780],[6,133846,25952,552,780],[6,159798,35986,552,780],[6,195784,842,552,780],[6,196626,52736,552,780],[6,249362,48996,552,780],[6,298358,49958,552,780],[6,348316,43422,552,780],[6,391738,52724,552,780],[6,444462,42788,552,780],[6,487250,45066,552,780],[6,532316,41556,552,780],[6,573872,36518,552,780],[6,610390,42524,552,780],[6,652914,47382,552,780],[6,700296,58088,552,780],[6,758384,48296,552,780],[6,806680,49434,552,780],[6,856114,50890,552,780],[6,907004,48872,552,780],[6,955876,15268,552,780],[6,971144,842,552,780],[6,971986,4220,552,780],[6,976206,39216,552,780],[6,1015422,41568,552,780],[6,1056990,26100,552,780],[6,1083090,38636,552,780],[6,1121726,27844,552,780],[7,8,25764,552,780],[7,25772,31826,552,780],[7,57598,39278,552,780],[7,96876,25094,552,780],[7,121970,29538,552,780],[7,151508,13240,552,780],[7,164748,22092,552,780],[7,186840,23170,552,780],[7,210010,24080,552,780],[7,234090,28214,552,780],[7,262304,21444,552,780],[7,283748,30400,552,780],[7,314148,19656,552,780],[7,333804,842,552,780],[7,334646,34810,552,780],[7,369456,38808,552,780],[7,408264,36818,552,780],[7,445082,842,552,780],[7,445924,29746,552,780],[7,475670,35034,552,780],[7,510704,37354,552,780],[7,548058,13426,552,780],[7,561484,36572,552,780],[7,598056,25316,552,780],[7,623372,28602,552,780],[7,651974,38042,552,780],[7,690016,29988,552,780],[7,720004,26704,552,780],[7,746708,26028,552,780],[7,772736,27908,552,780],[7,800644,41756,552,780],[7,842400,36920,552,780],[8,8,8240,552,780],[8,8248,842,552,780],[8,9090,30068,552,780],[8,39158,26512,552,780],[8,65670,29292,552,780],[8,94962,38774,552,780],[8,133736,42524,552,780],[8,176260,11230,552,780],[8,187490,25526,552,780],[8,213016,31358,552,780],[8,244374,37800,552,780],[8,282174,4466,552,780],[8,286640,28536,552,780],[8,315176,23206,552,780],[8,338382,38664,552,780],[8,377046,5832,552,780],[8,382878,23004,552,780],[8,405882,44368,552,780],[8,450250,31260,552,780],[8,481510,37958,552,780],[8,519468,29910,552,780],[8,549378,34966,552,780],[8,584344,42910,552,780],[8,627254,17842,552,780],[8,645096,27638,552,780],[8,672734,32340,552,780],[8,705074,24048,552,780],[8,729122,44136,552,780],[8,773258,37692,552,780],[8,810950,21948,552,780],[8,832898,41300,552,780],[8,874198,31176,552,780],[9,8,46586,552,780],[9,46594,35266,552,780],[9,81860,29156,552,780],[9,111016,29324,552,780],[9,140340,28952,552,780],[9,169292,42750,552,780],[9,212042,36754,552,780],[9,248796,39546,552,780],[9,288342,38170,552,780],[9,326512,34618,552,780],[9,361130,34114,552,780],[9,395244,38548,552,780],[9,433792,38924,552,780],[9,472716,34144,552,780],[9,506860,50226,552,780],[9,557086,20276,552,780],[9,577362,38650,552,780],[9,616012,42956,552,780],[9,658968,33416,552,780],[9,692384,35554,552,780],[9,727938,33012,552,780],[9,760950,40736,552,780],[9,801686,28296,552,780],[9,829982,31658,552,780],[9,861640,39524,552,780],[9,901164,12054,552,780],[9,913218,39596,552,780],[9,952814,37556,552,780],[9,990370,25532,552,780],[9,1015902,43458,552,780],[9,1059360,30216,552,780],[9,1089576,35610,552,780],[10,8,44952,552,780],[10,44960,842,552,780],[10,45802,3332,552,780],[10,49134,41312,552,780],[10,90446,44050,552,780],[10,134496,12044,552,780],[10,146540,35188,552,780],[10,181728,27064,552,780],[10,208792,26800,552,780],[10,235592,21456,552,780],[10,257048,25288,552,780],[10,282336,24744,552,780],[10,307080,19396,552,780],[10,326476,842,552,780],[10,327318,31944,552,780],[10,359262,34438,552,780],[10,393700,29006,552,780],[10,422706,15840,552,780],[10,438546,26770,552,780],[10,465316,31702,552,780],[10,497018,39658,552,780],[10,536676,46370,552,780],[10,583046,35158,552,780],[10,618204,39112,552,780],[10,657316,41674,552,780],[10,698990,842,552,780],[10,699832,29320,552,780],[10,729152,30054,552,780],[10,759206,26430,552,780],[10,785636,842,552,780],[10,786478,28428,552,780],[10,814906,30246,552,780],[11,8,32940,552,780],[11,32948,14106,552,780],[11,47054,23664,552,780],[11,70718,24214,552,780],[11,94932,19812,552,780],[11,114744,19752,552,780],[11,134496,27064,552,780],[11,161560,22064,552,780],[11,183624,22714,552,780],[11,206338,14148,552,780],[11,220486,34230,552,780],[11,254716,29956,552,780],[11,284672,30938,552,780],[11,315610,842,552,780],[11,316452,34282,552,780],[11,350734,34166,552,780],[11,384900,40504,552,780],[11,425404,40060,552,780],[11,465464,27842,552,780],[11,493306,842,552,780],[11,494148,34292,552,780],[11,528440,34262,552,780],[11,562702,38022,552,780],[11,600724,842,552,780],[11,601566,26974,552,780],[11,628540,26024,552,780],[11,654564,31446,552,780],[11,686010,36322,552,780],[11,722332,34074,552,780],[11,756406,30456,552,780],[11,786862,25832,552,780],[11,812694,43440,552,780],[12,8,31238,552,780],[12,31246,35202,552,780],[12,66448,31220,552,780],[12,97668,32312,552,780],[12,129980,39162,552,780],[12,169142,26590,552,780],[12,195732,28688,552,780],[12,224420,38772,552,780],[12,263192,18126,552,780],[12,281318,842,552,780],[12,282160,33118,552,780],[12,315278,31106,552,780],[12,346384,28736,552,780],[12,375120,28370,552,780],[12,403490,28720,552,780],[12,432210,30150,552,780],[12,462360,3572,552,780],[12,465932,42118,552,780],[12,508050,43714,552,780],[12,551764,11162,552,780],[12,562926,35930,552,780],[12,598856,34852,552,780],[12,633708,33970,552,780],[12,667678,42894,552,780],[12,710572,33342,552,780],[12,743914,37584,552,780],[12,781498,39104,552,780],[12,820602,38020,552,780],[12,858622,40376,552,780],[12,898998,28194,552,780],[12,927192,35538,552,780],[12,962730,45568,552,780],[13,8,48888,552,780],[13,48896,842,552,780],[13,49738,32234,552,780],[13,81972,35370,552,780],[13,117342,27658,552,780],[13,145000,842,552,780],[13,145842,22634,552,780],[13,168476,21774,552,780],[13,190250,23914,552,780],[13,214164,25904,552,780],[13,240068,21740,552,780],[13,261808,17894,552,780],[13,279702,18448,552,780],[13,298150,7064,552,780],[13,305214,39352,552,780],[13,344566,33170,552,780],[13,377736,21620,552,780],[13,399356,842,552,780],[13,400198,38868,552,780],[13,439066,21634,552,780],[13,460700,22988,552,780],[13,483688,24730,552,780],[13,508418,30208,552,780],[13,538626,24048,552,780],[13,562674,20516,552,780],[13,583190,29954,552,780],[13,613144,34176,552,780],[13,647320,842,552,780],[13,648162,28518,552,780],[13,676680,26252,552,780],[13,702932,31700,552,780],[13,734632,28740,552,780],[14,8,27170,552,780],[14,27178,17068,552,780],[14,44246,20698,552,780],[14,64944,842,552,780],[14,65786,35554,552,780],[14,101340,24148,552,780],[14,125488,29404,552,780],[14,154892,27844,552,780],[14,182736,27346,552,780],[14,210082,26402,552,780],[14,236484,37088,552,780],[14,273572,26496,552,780],[14,300068,19556,552,780],[14,319624,17970,552,780],[14,337594,25064,552,780],[14,362658,32122,552,780],[14,394780,28114,552,780],[14,422894,33636,552,780],[14,456530,24302,552,780],[14,480832,28008,552,780],[14,508840,33576,552,780],[14,542416,842,552,780],[14,543258,31582,552,780],[14,574840,30240,552,780],[14,605080,27094,552,780],[14,632174,22200,552,780],[14,654374,29508,552,780],[14,683882,26974,552,780],[14,710856,33360,552,780],[14,744216,20862,552,780],[14,765078,24026,552,780],[14,789104,22722,552,780],[15,8,23120,552,780],[15,23128,842,552,780],[15,23970,27692,552,780],[15,51662,21092,552,780],[15,72754,26368,552,780],[15,99122,28448,552,780],[15,127570,27916,552,780],[15,155486,21142,552,780],[15,176628,23228,552,780],[15,199856,32518,552,780],[15,232374,11016,552,780],[15,243390,842,552,780],[15,244232,3880,552,780],[15,248112,41732,552,780],[15,289844,45568,552,780],[15,335412,23536,552,780],[15,358948,45682,552,780],[15,404630,30728,552,780],[15,435358,16874,552,780],[15,452232,842,552,780],[15,453074,27490,552,780],[15,480564,21380,552,780],[15,501944,20418,552,780],[15,522362,24980,552,780],[15,547342,21244,552,780],[15,568586,26220,552,780],[15,594806,24318,552,780],[15,619124,23420,552,780],[15,642544,27192,552,780],[15,669736,22554,552,780],[15,692290,35234,552,780],[15,727524,28202,552,780],[16,8,25248,552,780],[16,25256,23712,552,780],[16,48968,28256,552,780],[16,77224,18522,552,780],[16,95746,30440,552,780],[16,126186,27372,552,780],[16,153558,29222,552,780],[16,182780,24620,552,780],[16,207400,27218,552,780],[16,234618,34762,552,780],[16,269380,10588,552,780],[16,279968,842,552,780],[16,280810,25868,552,780],[16,306678,20154,552,780],[16,326832,25216,552,780],[16,352048,18712,552,780],[16,370760,31332,552,780],[16,402092,35468,552,780],[16,437560,31040,552,780],[16,468600,842,552,780],[16,469442,25964,552,780],[16,495406,30486,552,780],[16,525892,24338,552,780],[16,550230,27732,552,780],[16,577962,31340,552,780],[16,609302,31296,552,780],[16,640598,28772,552,780],[16,669370,29038,552,780],[16,698408,25486,552,780],[16,723894,21858,552,780],[16,745752,19616,552,780],[16,765368,31666,552,780],[17,8,20806,552,780],[17,20814,29406,552,780],[17,50220,36108,552,780],[17,86328,31374,552,780],[17,117702,20876,552,780],[17,138578,26152,552,780],[17,164730,25300,552,780],[17,190030,28372,552,780],[17,218402,26532,552,780],[17,244934,33292,552,780],[17,278226,40190,552,780],[17,318416,13814,552,780],[17,332230,32074,552,780],[17,364304,22638,552,780],[17,386942,16846,552,780],[17,403788,30344,552,780],[17,434132,18168,552,780],[17,452300,24610,552,780],[17,476910,27052,552,780],[17,503962,21162,552,780],[17,525124,30986,552,780],[17,556110,9528,552,780],[17,565638,28484,552,780],[17,594122,24156,552,780],[17,618278,28908,552,780],[17,647186,20370,552,780],[17,667556,20494,552,780],[17,688050,30770,552,780],[17,718820,21194,552,780],[17,740014,26734,552,780],[17,766748,15458,552,780],[17,782206,842,552,780],[18,8,31192,552,780],[18,31200,29758,552,780],[18,60958,27002,552,780],[18,87960,22064,552,780],[18,110024,27244,552,780],[18,137268,37860,552,780],[18,175128,8758,552,780],[18,183886,842,552,780],[18,184728,40680,552,780],[18,225408,33264,552,780],[18,258672,44876,552,780],[18,303548,39456,552,780],[18,343004,39396,552,780],[18,382400,26034,552,780],[18,408434,39360,552,780],[18,447794,33200,552,780],[18,480994,46168,552,780],[18,527162,45660,552,780],[18,572822,35960,552,780],[18,608782,39738,552,780],[18,648520,14110,552,780],[18,662630,842,552,780],[18,663472,3548,552,780],[18,667020,40816,552,780],[18,707836,46402,552,780],[18,754238,41652,552,780],[18,795890,35726,552,780],[18,831616,29600,552,780],[18,861216,21082,552,780],[18,882298,842,552,780],[18,883140,35112,552,780],[18,918252,27682,552,780],[19,8,35296,552,780],[19,35304,17854,552,780],[19,53158,18338,552,780],[19,71496,21298,552,780],[19,92794,18200,552,780],[19,110994,22050,552,780],[19,133044,20092,552,780],[19,153136,24960,552,780],[19,178096,30606,552,780],[19,208702,18722,552,780],[19,227424,26626,552,780],[19,254050,21420,552,780],[19,275470,27680,552,780],[19,303150,26500,552,780],[19,329650,38532,552,780],[19,368182,23700,552,780],[19,391882,22698,552,780],[19,414580,37282,552,780],[19,451862,6140,552,780],[19,458002,842,552,780],[19,458844,36828,552,780],[19,495672,27340,552,780],[19,523012,31428,552,780],[19,554440,15866,552,780],[19,570306,29796,552,780],[19,600102,34990,552,780],[19,635092,29508,552,780],[19,664600,17624,552,780],[19,682224,21764,552,780],[19,703988,25802,552,780],[19,729790,25166,552,780],[19,754956,26866,552,780],[20,8,25038,552,780],[20,25046,23570,552,780],[20,48616,34592,552,780],[20,83208,13246,552,780],[20,96454,24768,552,780],[20,121222,17362,552,780],[20,138584,24972,552,780],[20,163556,24334,552,780],[20,187890,18856,552,780],[20,206746,24572,552,780],[20,231318,25692,552,780],[20,257010,22642,552,780],[20,279652,13044,552,780],[20,292696,842,552,780],[20,293538,27672,552,780],[20,321210,24306,552,780],[20,345516,21516,552,780],[20,367032,26438,552,780],[20,393470,32732,552,780],[20,426202,27228,552,780],[20,453430,29198,552,780],[20,482628,30968,552,780],[20,513596,24592,552,780],[20,538188,24358,552,780],[20,562546,23436,552,780],[20,585982,27598,552,780],[20,613580,35342,552,780],[20,648922,34640,552,780],[20,683562,31436,552,780],[20,714998,13414,552,780],[20,728412,26602,552,780],[20,755014,32060,552,780],[21,8,23282,552,780],[21,23290,24532,552,780],[21,47822,19296,552,780],[21,67118,29762,552,780],[21,96880,30048,552,780],[21,126928,33020,552,780],[21,159948,24386,552,780],[21,184334,34530,552,780],[21,218864,22578,552,780],[21,241442,15990,552,780],[21,257432,24998,552,780],[21,282430,27678,552,780],[21,310108,25614,552,780],[21,335722,21046,552,780],[21,356768,11160,552,780],[21,367928,842,552,780],[21,368770,32828,552,780],[21,401598,27672,552,780],[21,429270,31410,552,780],[21,460680,23374,552,780],[21,484054,20250,552,780],[21,504304,21166,552,780],[21,525470,18270,552,780],[21,543740,842,552,780],[21,544582,38756,552,780],[21,583338,29416,552,780],[21,612754,33408,552,780],[21,646162,16522,552,780],[21,662684,26210,552,780],[21,688894,30820,552,780],[21,719714,29522,552,780],[21,749236,35708,552,780],[22,8,33332,552,780],[22,33340,842,552,780],[22,34182,38634,552,780],[22,72816,29890,552,780],[22,102706,43562,552,780],[22,146268,33242,552,780],[22,179510,36754,552,780],[22,216264,41312,552,780],[22,257576,34424,552,780],[22,292000,32080,552,780],[22,324080,30680,552,780],[22,354760,842,552,780],[22,355602,48242,552,780],[22,403844,37034,552,780],[22,440878,43458,552,780],[22,484336,45778,552,780],[22,530114,47382,552,780],[22,577496,46656,552,780],[22,624152,22576,552,780],[22,646728,842,552,780],[22,647570,3838,552,780],[22,651408,41432,552,780],[22,692840,40710,552,780],[22,733550,41074,552,780],[22,774624,18868,552,780],[22,793492,842,552,780],[22,794334,32164,552,780],[22,826498,34636,552,780],[22,861134,17152,552,780],[22,878286,842,552,780],[22,879128,24490,552,780],[22,903618,31998,552,780],[23,8,20178,552,780],[23,20186,41342,552,780],[23,61528,30886,552,780],[23,92414,29392,552,780],[23,121806,25500,552,780],[23,147306,24020,552,780],[23,171326,23602,552,780],[23,194928,28300,552,780],[23,223228,24648,552,780],[23,247876,24066,552,780],[23,271942,26942,552,780],[23,298884,16742,552,780],[23,315626,28118,552,780],[23,343744,28532,552,780],[23,372276,27296,552,780],[23,399572,29898,552,780],[23,429470,37756,552,780],[23,467226,27968,552,780],[23,495194,41186,552,780],[23,536380,43658,552,780],[23,580038,18778,552,780],[23,598816,842,552,780],[23,599658,33700,552,780],[23,633358,30324,552,780],[23,663682,23700,552,780],[23,687382,25672,552,780],[23,713054,28508,552,780],[23,741562,34254,552,780],[23,775816,21774,552,780],[23,797590,842,552,780],[23,798432,24840,552,780],[23,823272,30078,552,780],[24,8,30460,552,780],[24,30468,30834,552,780],[24,61302,30800,552,780],[24,92102,31314,552,780],[24,123416,30058,552,780],[24,153474,842,552,780],[24,154316,37048,552,780],[24,191364,33368,552,780],[24,224732,37130,552,780],[24,261862,18654,552,780],[24,280516,26428,552,780],[24,306944,25542,552,780],[24,332486,35322,552,780],[24,367808,26366,552,780],[24,394174,25144,552,780],[24,419318,27470,552,780],[24,446788,29276,552,780],[24,476064,15652,552,780],[24,491716,19440,552,780],[24,511156,842,552,780],[24,511998,24220,552,780],[24,536218,18502,552,780],[24,554720,21312,552,780],[24,576032,20848,552,780],[24,596880,23506,552,780],[24,620386,28736,552,780],[24,649122,22914,552,780],[24,672036,12710,552,780],[24,684746,27982,552,780],[24,712728,22972,552,780],[24,735700,24586,552,780],[24,760286,15276,552,780],[25,8,23404,552,780],[25,23412,22522,552,780],[25,45934,28640,552,780],[25,74574,28474,552,780],[25,103048,32520,552,780],[25,135568,37394,552,780],[25,172962,36566,552,780],[25,209528,12718,552,780],[25,222246,32208,552,780],[25,254454,24804,552,780],[25,279258,29656,552,780],[25,308914,19786,552,780],[25,328700,22112,552,780],[25,350812,20194,552,780],[25,371006,24050,552,780],[25,395056,32864,552,780],[25,427920,33398,552,780],[25,461318,842,552,780],[25,462160,32840,552,780],[25,495000,32218,552,780],[25,527218,29476,552,780],[25,556694,15186,552,780],[25,571880,27732,552,780],[25,599612,32630,552,780],[25,632242,33600,552,780],[25,665842,19776,552,780],[25,685618,33618,552,780],[25,719236,28786,552,780],[25,748022,38242,552,780],[25,786264,6554,552,780],[25,792818,27354,552,780],[25,820172,21618,552,780],[26,8,31484,552,780],[26,31492,32378,552,780],[26,63870,33448,552,780],[26,97318,28166,552,780],[26,125484,37188,552,780],[26,162672,10860,552,780],[26,173532,4128,552,780],[26,177660,38946,552,780],[26,216606,14490,552,780],[26,231096,842,552,780],[26,231938,26620,552,780],[26,258558,21772,552,780],[26,280330,16692,552,780],[26,297022,23500,552,780],[26,320522,18144,552,780],[26,338666,21108,552,780],[26,359774,28482,552,780],[26,388256,24952,552,780],[26,413208,20050,552,780],[26,433258,19614,552,780],[26,452872,36804,552,780],[26,489676,842,552,780],[26,490518,36164,552,780],[26,526682,24944,552,780],[26,551626,40994,552,780],[26,592620,9252,552,780],[26,601872,31408,552,780],[26,633280,29778,552,780],[26,663058,32600,552,780],[26,695658,20480,552,780],[26,716138,23906,552,780],[26,740044,29210,552,780],[27,8,28126,552,780],[27,28134,28048,552,780],[27,56182,44142,552,780],[27,100324,31454,552,780],[27,131778,28188,552,780],[27,159966,24480,552,780],[27,184446,29378,552,780],[27,213824,35998,552,780],[27,249822,13472,552,780],[27,263294,842,552,780],[27,264136,27334,552,780],[27,291470,37008,552,780],[27,328478,26506,552,780],[27,354984,27860,552,780],[27,382844,33572,552,780],[27,416416,28594,552,780],[27,445010,41854,552,780],[27,486864,29684,552,780],[27,516548,34136,552,780],[27,550684,33694,552,780],[27,584378,33618,552,780],[27,617996,23374,552,780],[27,641370,3942,552,780],[27,645312,40594,552,780],[27,685906,42996,552,780],[27,728902,8864,552,780],[27,737766,33844,552,780],[27,771610,45140,552,780],[27,816750,31818,552,780],[27,848568,32766,552,780],[27,881334,35932,552,780],[27,917266,30150,552,780],[28,8,40986,552,780],[28,40994,34752,552,780],[28,75746,6548,552,780],[28,82294,842,552,780],[28,83136,28040,552,780],[28,111176,30342,552,780],[28,141518,30864,552,780],[28,172382,20424,552,780],[28,192806,31308,552,780],[28,224114,33310,552,780],[28,257424,35192,552,780],[28,292616,8346,552,780],[28,300962,31328,552,780],[28,332290,36614,552,780],[28,368904,41298,552,780],[28,410202,842,552,780],[28,411044,24678,552,780],[28,435722,29890,552,780],[28,465612,28422,552,780],[28,494034,28282,552,780],[28,522316,21182,552,780],[28,543498,23352,552,780],[28,566850,21780,552,780],[28,588630,28552,552,780],[28,617182,30692,552,780],[28,647874,22198,552,780],[28,670072,23194,552,780],[28,693266,24928,552,780],[28,718194,23076,552,780],[28,741270,20434,552,780],[28,761704,27964,552,780],[28,789668,19146,552,780],[29,8,21284,552,780],[29,21292,842,552,780],[29,22134,33154,552,780],[29,55288,29034,552,780],[29,84322,42744,552,780],[29,127066,40202,552,780],[29,167268,21482,552,780],[29,188750,23514,552,780],[29,212264,27664,552,780],[29,239928,45744,552,780],[29,285672,42960,552,780],[29,328632,842,552,780],[29,329474,32750,552,780],[29,362224,34986,552,780],[29,397210,29120,552,780],[29,426330,32578,552,780],[29,458908,35878,552,780],[29,494786,842,552,780],[29,495628,31764,552,780],[29,527392,28810,552,780],[29,556202,34172,552,780],[29,590374,31684,552,780],[29,622058,30146,552,780],[29,652204,30034,552,780],[29,682238,25748,552,780],[29,707986,842,552,780],[29,708828,28990,552,780],[29,737818,30010,552,780],[29,767828,35320,552,780],[29,803148,842,552,780],[29,803990,33372,552,780],[29,837362,41556,552,780],[30,8,27398,552,780],[30,27406,842,552,780],[30,28248,33174,552,780],[30,61422,20838,552,780],[30,82260,24576,552,780],[30,106836,33270,552,780],[30,140106,36992,552,780],[30,177098,37878,552,780],[30,214976,42286,552,780],[30,257262,39482,552,780],[30,296744,3930,552,780],[30,300674,42614,552,780],[30,343288,42652,552,780],[30,385940,31052,552,780],[30,416992,29298,552,780],[30,446290,23988,552,780],[30,470278,29904,552,780],[30,500182,32148,552,780],[30,532330,38286,552,780],[30,570616,27484,552,780],[30,598100,33302,552,780],[30,631402,34220,552,780],[30,665622,18866,552,780],[30,684488,842,552,780],[30,685330,42544,552,780],[30,727874,47842,552,780],[30,775716,29146,552,780],[30,804862,842,552,780],[30,805704,32666,552,780],[30,838370,26512,552,780],[30,864882,31558,552,780],[30,896440,34086,552,780],[31,8,33474,552,780],[31,33482,36134,552,780],[31,69616,13930,552,780],[31,83546,842,552,780],[31,84388,26468,552,780],[31,110856,26562,552,780],[31,137418,29586,552,780],[31,167004,32014,552,780],[31,199018,35822,552,780],[31,234840,842,552,780],[31,235682,23294,552,780],[31,258976,33134,552,780],[31,292110,22120,552,780],[31,314230,26188,552,780],[31,340418,26412,552,780],[31,366830,38682,552,780],[31,405512,43170,552,780],[31,448682,35618,552,780],[31,484300,14982,552,780],[31,499282,842,552,780],[31,500124,37544,552,780],[31,537668,36864,552,780],[31,574532,26678,552,780],[31,601210,27362,552,780],[31,628572,25646,552,780],[31,654218,30300,552,780],[31,684518,30878,552,780],[31,715396,34942,552,780],[31,750338,22722,552,780],[31,773060,842,552,780],[31,773902,42074,552,780],[31,815976,45416,552,780],[32,8,29628,552,780],[32,29636,30112,552,780],[32,59748,24410,552,780],[32,84158,24964,552,780],[32,109122,17508,552,780],[32,126630,842,552,780],[32,127472,29578,552,780],[32,157050,35566,552,780],[32,192616,27138,552,780],[32,219754,39318,552,780],[32,259072,25798,552,780],[32,284870,26998,552,780],[32,311868,32444,552,780],[32,344312,39710,552,780],[32,384022,42608,552,780],[32,426630,40200,552,780],[32,466830,23236,552,780],[32,490066,49846,552,780],[32,539912,9814,552,780],[32,549726,842,552,780],[32,550568,23972,552,780],[32,574540,30072,552,780],[32,604612,38570,552,780],[32,643182,33418,552,780],[32,676600,35758,552,780],[32,712358,35982,552,780],[32,748340,27438,552,780],[32,775778,13916,552,780],[32,789694,38614,552,780],[32,828308,41334,552,780],[32,869642,22348,552,780],[32,891990,39982,552,780],[33,8,32152,552,780],[33,32160,29408,552,780],[33,61568,36130,552,780],[33,97698,38394,552,780],[33,136092,30688,552,780],[33,166780,35180,552,780],[33,201960,25096,552,780],[33,227056,21328,552,780],[33,248384,23112,552,780],[33,271496,23260,552,780],[33,294756,18490,552,780],[33,313246,842,552,780],[33,314088,49610,552,780],[33,363698,37310,552,780],[33,401008,36300,552,780],[33,437308,36016,552,780],[33,473324,36920,552,780],[33,510244,36684,552,780],[33,546928,44478,552,780],[33,591406,41170,552,780],[33,632576,46598,552,780],[33,679174,39654,552,780],[33,718828,46828,552,780],[33,765656,39282,552,780],[33,804938,39736,552,780],[33,844674,55862,552,780],[33,900536,40946,552,780],[33,941482,50128,552,780],[33,991610,37652,552,780],[33,1029262,41004,552,780],[33,1070266,28260,552,780],[33,1098526,45376,552,780],[34,8,32780,552,780],[34,32788,29810,552,780],[34,62598,42554,552,780],[34,105152,35240,552,780],[34,140392,52642,552,780],[34,193034,17366,552,780],[34,210400,4328,552,780],[34,214728,44124,552,780],[34,258852,42688,552,780],[34,301540,22658,552,780],[34,324198,44812,552,780],[34,369010,42156,552,780],[34,411166,44122,552,780],[34,455288,38080,552,780],[34,493368,36300,552,780],[34,529668,31184,552,780],[34,560852,38028,552,780],[34,598880,842,552,780],[34,599722,38730,552,780],[34,638452,36548,552,780],[34,675000,34796,552,780],[34,709796,36212,552,780],[34,746008,22598,552,780],[34,768606,842,552,780],[34,769448,26846,552,780],[34,796294,34458,552,780],[34,830752,19706,552,780],[34,850458,23564,552,780],[34,874022,30076,552,780],[34,904098,30592,552,780],[34,934690,35370,552,780],[34,970060,46212,552,780],[35,8,37470,552,780],[35,37478,21948,552,780],[35,59426,31202,552,780],[35,90628,23162,552,780],[35,113790,23928,552,780],[35,137718,26464,552,780],[35,164182,26586,552,780],[35,190768,842,552,780],[35,191610,29222,552,780],[35,220832,29298,552,780],[35,250130,31952,552,780],[35,282082,32852,552,780],[35,314934,27800,552,780],[35,342734,23548,552,780],[35,366282,29672,552,780],[35,395954,39266,552,780],[35,435220,30032,552,780],[35,465252,37218,552,780],[35,502470,39746,552,780],[35,542216,26026,552,780],[35,568242,35424,552,780],[35,603666,31694,552,780],[35,635360,40380,552,780],[35,675740,842,552,780],[35,676582,35648,552,780],[35,712230,34680,552,780],[35,746910,38548,552,780],[35,785458,16128,552,780],[35,801586,37198,552,780],[35,838784,33248,552,780],[35,872032,31328,552,780],[35,903360,842,552,780],[36,8,35540,552,780],[36,35548,29162,552,780],[36,64710,32594,552,780],[36,97304,23262,552,780],[36,120566,44294,552,780],[36,164860,41224,552,780],[36,206084,45120,552,780],[36,251204,46112,552,780],[36,297316,44806,552,780],[36,342122,42310,552,780],[36,384432,43954,552,780],[36,428386,38934,552,780],[36,467320,58940,552,780],[36,526260,4622,552,780],[36,530882,42038,552,780],[36,572920,42058,552,780],[36,614978,30812,552,780],[36,645790,48788,552,780],[36,694578,51834,552,780],[36,746412,50378,552,780],[36,796790,55470,552,780],[36,852260,31356,552,780],[36,883616,38210,552,780],[36,921826,39612,552,780],[36,961438,31618,552,780],[36,993056,26960,552,780],[36,1020016,40568,552,780],[36,1060584,48312,552,780],[36,1108896,45076,552,780],[36,1153972,39882,552,780],[36,1193854,40472,552,780],[36,1234326,32900,552,780],[37,8,32518,552,780],[37,32526,27286,552,780],[37,59812,32814,552,780],[37,92626,40426,552,780],[37,133052,31078,552,780],[37,164130,38956,552,780],[37,203086,43262,552,780],[37,246348,44944,552,780],[37,291292,4178,552,780],[37,295470,39330,552,780],[37,334800,47658,552,780],[37,382458,11228,552,780],[37,393686,28092,552,780],[37,421778,21614,552,780],[37,443392,25118,552,780],[37,468510,22288,552,780],[37,490798,39772,552,780],[37,530570,34890,552,780],[37,565460,29660,552,780],[37,595120,30424,552,780],[37,625544,40490,552,780],[37,666034,13174,552,780],[37,679208,39092,552,780],[37,718300,27744,552,780],[37,746044,26456,552,780],[37,772500,34158,552,780],[37,806658,8740,552,780],[37,815398,842,552,780],[37,816240,24854,552,780],[37,841094,29902,552,780],[37,870996,27636,552,780],[37,898632,31330,552,780],[38,8,23946,552,780],[38,23954,40950,552,780],[38,64904,38440,552,780],[38,103344,842,552,780],[38,104186,28368,552,780],[38,132554,36512,552,780],[38,169066,31778,552,780],[38,200844,28332,552,780],[38,229176,31038,552,780],[38,260214,36246,552,780],[38,296460,8560,552,780],[38,305020,842,552,780],[38,305862,40642,552,780],[38,346504,26604,552,780],[38,373108,33656,552,780],[38,406764,38470,552,780],[38,445234,39104,552,780],[38,484338,39890,552,780],[38,524228,35546,552,780],[38,559774,30122,552,780],[38,589896,43004,552,780],[38,632900,31424,552,780],[38,664324,40532,552,780],[38,704856,43228,552,780],[38,748084,36882,552,780],[38,784966,37856,552,780],[38,822822,41912,552,780],[38,864734,49328,552,780],[38,914062,42574,552,780],[38,956636,51512,552,780],[38,1008148,23092,552,780],[38,1031240,41068,552,780],[39,8,41256,552,780],[39,41264,33160,552,780],[39,74424,43662,552,780],[39,118086,17008,552,780],[39,135094,43220,552,780],[39,178314,28924,552,780],[39,207238,37528,552,780],[39,244766,38942,552,780],[39,283708,35356,552,780],[39,319064,39316,552,780],[39,358380,53500,552,780],[39,411880,43940,552,780],[39,455820,39368,552,780],[39,495188,38432,552,780],[39,533620,44010,552,780],[39,577630,48398,552,780],[39,626028,30498,552,780],[39,656526,55104,552,780],[39,711630,43050,552,780],[39,754680,57712,552,780],[39,812392,21538,552,780],[39,833930,842,552,780],[39,834772,42524,552,780],[39,877296,36536,552,780],[39,913832,28972,552,780],[39,942804,35324,552,780],[39,978128,38470,552,780],[39,1016598,35656,552,780],[39,1052254,36738,552,780],[39,1088992,40896,552,780],[39,1129888,35424,552,780],[39,1165312,32640,552,780],[40,8,36508,552,780],[40,36516,46358,552,780],[40,82874,43664,552,780],[40,126538,55436,552,780],[40,181974,59264,552,780],[40,241238,60306,552,780],[40,301544,17952,552,780],[40,319496,842,552,780],[40,320338,52586,552,780],[40,372924,41830,552,780],[40,414754,51840,552,780],[40,466594,36502,552,780],[40,503096,33756,552,780],[40,536852,43038,552,780],[40,579890,35204,552,780],[40,615094,39018,552,780],[40,654112,34340,552,780],[40,688452,842,552,780],[40,689294,52626,552,780],[40,741920,46506,552,780],[40,788426,45726,552,780],[40,834152,40222,552,780],[40,874374,43774,552,780],[40,918148,46696,552,780],[40,964844,52440,552,780],[40,1017284,46898,552,780],[40,1064182,44442,552,780],[40,1108624,55324,552,780],[40,1163948,27418,552,780],[40,1191366,842,552,780]]}'),ns={version:g2,source:_2,count:v2,height:M2,packs:b2,pages:S2,mobile:y2},Sa={type:"change"},Uo={type:"start"},Io={type:"end"},ic=1e-6,je={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4},dr=new Fe,ei=new Fe,E2=new F,fr=new F,ya=new F,Ki=new fs,sc=new F,pr=new F,Ea=new F,mr=new F;class T2 extends ru{constructor(e,t=null){super(e,t),this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:ci.ROTATE,MIDDLE:ci.DOLLY,RIGHT:ci.PAN},this.target=new F,this.state=je.NONE,this.keyState=je.NONE,this._lastPosition=new F,this._lastZoom=1,this._touchZoomDistanceStart=0,this._touchZoomDistanceEnd=0,this._lastAngle=0,this._eye=new F,this._movePrev=new Fe,this._moveCurr=new Fe,this._lastAxis=new F,this._zoomStart=new Fe,this._zoomEnd=new Fe,this._panStart=new Fe,this._panEnd=new Fe,this._pointers=[],this._pointerPositions={},this._onPointerMove=A2.bind(this),this._onPointerDown=w2.bind(this),this._onPointerUp=C2.bind(this),this._onPointerCancel=R2.bind(this),this._onContextMenu=F2.bind(this),this._onMouseWheel=N2.bind(this),this._onKeyDown=L2.bind(this),this._onKeyUp=P2.bind(this),this._onTouchStart=O2.bind(this),this._onTouchMove=B2.bind(this),this._onTouchEnd=k2.bind(this),this._onMouseDown=D2.bind(this),this._onMouseMove=U2.bind(this),this._onMouseUp=I2.bind(this),this._target0=this.target.clone(),this._position0=this.object.position.clone(),this._up0=this.object.up.clone(),this._zoom0=this.object.zoom,t!==null&&(this.connect(t),this.handleResize()),this.update()}connect(e){super.connect(e),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="none"}disconnect(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}handleResize(){const e=this.domElement.getBoundingClientRect(),t=this.domElement.ownerDocument.documentElement;this.screen.left=e.left+window.pageXOffset-t.clientLeft,this.screen.top=e.top+window.pageYOffset-t.clientTop,this.screen.width=e.width,this.screen.height=e.height}update(){this._eye.subVectors(this.object.position,this.target),this.noRotate||this._rotateCamera(),this.noZoom||this._zoomCamera(),this.noPan||this._panCamera(),this.object.position.addVectors(this.target,this._eye),this.object.isPerspectiveCamera?(this._checkDistances(),this.object.lookAt(this.target),this._lastPosition.distanceToSquared(this.object.position)>ic&&(this.dispatchEvent(Sa),this._lastPosition.copy(this.object.position))):this.object.isOrthographicCamera?(this.object.lookAt(this.target),(this._lastPosition.distanceToSquared(this.object.position)>ic||this._lastZoom!==this.object.zoom)&&(this.dispatchEvent(Sa),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type.")}reset(){this.state=je.NONE,this.keyState=je.NONE,this.target.copy(this._target0),this.object.position.copy(this._position0),this.object.up.copy(this._up0),this.object.zoom=this._zoom0,this.object.updateProjectionMatrix(),this._eye.subVectors(this.object.position,this.target),this.object.lookAt(this.target),this.dispatchEvent(Sa),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom}_panCamera(){if(ei.copy(this._panEnd).sub(this._panStart),ei.lengthSq()){if(this.object.isOrthographicCamera){const e=(this.object.right-this.object.left)/this.object.zoom/this.domElement.clientWidth,t=(this.object.top-this.object.bottom)/this.object.zoom/this.domElement.clientWidth;ei.x*=e,ei.y*=t}ei.multiplyScalar(this._eye.length()*this.panSpeed),fr.copy(this._eye).cross(this.object.up).setLength(ei.x),fr.add(E2.copy(this.object.up).setLength(ei.y)),this.object.position.add(fr),this.target.add(fr),this.staticMoving?this._panStart.copy(this._panEnd):this._panStart.add(ei.subVectors(this._panEnd,this._panStart).multiplyScalar(this.dynamicDampingFactor))}}_rotateCamera(){mr.set(this._moveCurr.x-this._movePrev.x,this._moveCurr.y-this._movePrev.y,0);let e=mr.length();e?(this._eye.copy(this.object.position).sub(this.target),sc.copy(this._eye).normalize(),pr.copy(this.object.up).normalize(),Ea.crossVectors(pr,sc).normalize(),pr.setLength(this._moveCurr.y-this._movePrev.y),Ea.setLength(this._moveCurr.x-this._movePrev.x),mr.copy(pr.add(Ea)),ya.crossVectors(mr,this._eye).normalize(),e*=this.rotateSpeed,Ki.setFromAxisAngle(ya,e),this._eye.applyQuaternion(Ki),this.object.up.applyQuaternion(Ki),this._lastAxis.copy(ya),this._lastAngle=e):!this.staticMoving&&this._lastAngle&&(this._lastAngle*=Math.sqrt(1-this.dynamicDampingFactor),this._eye.copy(this.object.position).sub(this.target),Ki.setFromAxisAngle(this._lastAxis,this._lastAngle),this._eye.applyQuaternion(Ki),this.object.up.applyQuaternion(Ki)),this._movePrev.copy(this._moveCurr)}_zoomCamera(){let e;this.state===je.TOUCH_ZOOM_PAN?(e=this._touchZoomDistanceStart/this._touchZoomDistanceEnd,this._touchZoomDistanceStart=this._touchZoomDistanceEnd,this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=cs.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(e=1+(this._zoomEnd.y-this._zoomStart.y)*this.zoomSpeed,e!==1&&e>0&&(this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=cs.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),this.staticMoving?this._zoomStart.copy(this._zoomEnd):this._zoomStart.y+=(this._zoomEnd.y-this._zoomStart.y)*this.dynamicDampingFactor)}_getMouseOnScreen(e,t){return dr.set((e-this.screen.left)/this.screen.width,(t-this.screen.top)/this.screen.height),dr}_getMouseOnCircle(e,t){return dr.set((e-this.screen.width*.5-this.screen.left)/(this.screen.width*.5),(this.screen.height+2*(this.screen.top-t))/this.screen.width),dr}_addPointer(e){this._pointers.push(e)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t].pointerId==e.pointerId){this._pointers.splice(t,1);return}}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Fe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0].pointerId?this._pointers[1]:this._pointers[0];return this._pointerPositions[t.pointerId]}_checkDistances(){(!this.noZoom||!this.noPan)&&(this._eye.lengthSq()>this.maxDistance*this.maxDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.maxDistance)),this._zoomStart.copy(this._zoomEnd)),this._eye.lengthSq()<this.minDistance*this.minDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.minDistance)),this._zoomStart.copy(this._zoomEnd)))}}function w2(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i))}function A2(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function C2(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchEnd(i):this._onMouseUp(),this._removePointer(i),this._pointers.length===0&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp)))}function R2(i){this._removePointer(i)}function P2(){this.enabled!==!1&&(this.keyState=je.NONE,window.addEventListener("keydown",this._onKeyDown))}function L2(i){this.enabled!==!1&&(window.removeEventListener("keydown",this._onKeyDown),this.keyState===je.NONE&&(i.code===this.keys[je.ROTATE]&&!this.noRotate?this.keyState=je.ROTATE:i.code===this.keys[je.ZOOM]&&!this.noZoom?this.keyState=je.ZOOM:i.code===this.keys[je.PAN]&&!this.noPan&&(this.keyState=je.PAN)))}function D2(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ci.DOLLY:this.state=je.ZOOM;break;case ci.ROTATE:this.state=je.ROTATE;break;case ci.PAN:this.state=je.PAN;break;default:this.state=je.NONE}const t=this.keyState!==je.NONE?this.keyState:this.state;t===je.ROTATE&&!this.noRotate?(this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr)):t===je.ZOOM&&!this.noZoom?(this._zoomStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._zoomEnd.copy(this._zoomStart)):t===je.PAN&&!this.noPan&&(this._panStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._panEnd.copy(this._panStart)),this.dispatchEvent(Uo)}function U2(i){const e=this.keyState!==je.NONE?this.keyState:this.state;e===je.ROTATE&&!this.noRotate?(this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY))):e===je.ZOOM&&!this.noZoom?this._zoomEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY)):e===je.PAN&&!this.noPan&&this._panEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY))}function I2(){this.state=je.NONE,this.dispatchEvent(Io)}function N2(i){if(this.enabled!==!1&&this.noZoom!==!0){switch(i.preventDefault(),i.deltaMode){case 2:this._zoomStart.y-=i.deltaY*.025;break;case 1:this._zoomStart.y-=i.deltaY*.01;break;default:this._zoomStart.y-=i.deltaY*25e-5;break}this.dispatchEvent(Uo),this.dispatchEvent(Io)}}function F2(i){this.enabled!==!1&&i.preventDefault()}function O2(i){if(this._trackPointer(i),this._pointers.length===1)this.state=je.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(this._pointers[0].pageX,this._pointers[0].pageY)),this._movePrev.copy(this._moveCurr);else{this.state=je.TOUCH_ZOOM_PAN;const e=this._pointers[0].pageX-this._pointers[1].pageX,t=this._pointers[0].pageY-this._pointers[1].pageY;this._touchZoomDistanceEnd=this._touchZoomDistanceStart=Math.sqrt(e*e+t*t);const n=(this._pointers[0].pageX+this._pointers[1].pageX)/2,s=(this._pointers[0].pageY+this._pointers[1].pageY)/2;this._panStart.copy(this._getMouseOnScreen(n,s)),this._panEnd.copy(this._panStart)}this.dispatchEvent(Uo)}function B2(i){if(this._trackPointer(i),this._pointers.length===1)this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY));else{const e=this._getSecondPointerPosition(i),t=i.pageX-e.x,n=i.pageY-e.y;this._touchZoomDistanceEnd=Math.sqrt(t*t+n*n);const s=(i.pageX+e.x)/2,r=(i.pageY+e.y)/2;this._panEnd.copy(this._getMouseOnScreen(s,r))}}function k2(i){switch(this._pointers.length){case 0:this.state=je.NONE;break;case 1:this.state=je.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr);break;case 2:this.state=je.TOUCH_ZOOM_PAN;for(let e=0;e<this._pointers.length;e++)if(this._pointers[e].pointerId!==i.pointerId){const t=this._pointerPositions[this._pointers[e].pointerId];this._moveCurr.copy(this._getMouseOnCircle(t.x,t.y)),this._movePrev.copy(this._moveCurr);break}break}this.dispatchEvent(Io)}class z2 extends T2{constructor(e,t){super(e,t),this.oneFingerPan=!1;const n=this._onTouchStart,s=this._onTouchMove,r=this._onTouchEnd;this._onTouchStart=a=>{this.oneFingerPan&&this._pointers.length===1?(this._trackPointer(a),this._onMouseDown({button:0,pageX:a.pageX,pageY:a.pageY})):n(a)},this._onTouchMove=a=>{this.oneFingerPan&&this._pointers.length===1?(this._trackPointer(a),this._onMouseMove(a)):s(a)},this._onTouchEnd=a=>{if(!this.oneFingerPan||this._pointers.length>2){r(a);return}this._onMouseUp();const o=this._pointers.filter(c=>c.pointerId!==a.pointerId);if(o.length===1){const c=this._pointerPositions[o[0].pointerId];this._onMouseDown({button:0,pageX:c.x,pageY:c.y})}},this.rotateSpeed=1.5,this.zoomSpeed=1.1,this.panSpeed=.6,this.staticMoving=!0,this.keys=[]}}const V2="/inm-3d-book/assets/pdf.worker.min-iDqQPrd3.mjs",Ci={};await Promise.all(["front","spine"].map(async i=>{const e=new Image;e.src="/inm-3d-book/reference-"+i+".jpg",await e.decode(),Ci[i]=e}));function G2(i,e,t){const n=ui(e,t);return n.getContext("2d").drawImage(Ci[i],0,0,e,t),n}function H2(i,e,t){return i===Ri&&e==="Runnel Zhang"&&t==="#07508a"}const Ri="Informal Notes on Mathematics";function ui(i,e){const t=document.createElement("canvas");return t.width=i,t.height=e,t}function W2(i,e,t){const n=i.createLinearGradient(0,0,e,t);n.addColorStop(0,"#ebe7dd"),n.addColorStop(.45,"#e8e2d5"),n.addColorStop(1,"#ddd7c9"),i.fillStyle=n,i.fillRect(0,0,e,t);let s=73119;const r=()=>(s=s*1664525+1013904223>>>0,s/4294967296);for(let o=0;o<14500;o++){const c=r()*e,l=r()*t,h=r()>.5;i.strokeStyle=h?"rgba(255,255,255,0.055)":"rgba(67,57,35,0.038)",i.lineWidth=r()>.62?1.15:.55,i.beginPath(),i.moveTo(c,l),i.lineTo(c+r()*17+2,l+(r()-.5)*1.1),i.stroke()}const a=i.createLinearGradient(0,0,e,0);a.addColorStop(0,"rgba(255,255,255,.12)"),a.addColorStop(.11,"rgba(255,255,255,.055)"),a.addColorStop(.92,"rgba(0,0,0,0)"),a.addColorStop(1,"rgba(100,93,78,.065)"),i.fillStyle=a,i.fillRect(0,0,e,t)}function Vc(i,e,t,n,s,r=!1){i.save(),i.translate(e,t);const a=i.createLinearGradient(-n,-n,n,n);a.addColorStop(0,s),a.addColorStop(.5,"#1266a3"),a.addColorStop(1,s),i.strokeStyle=a,i.fillStyle=a,i.lineJoin="miter",i.beginPath(),i.moveTo(-n*.79,-n*.46),i.lineTo(0,-n*.97),i.lineTo(n*.79,-n*.46),i.lineTo(n*.74,-n*.37),i.lineTo(0,-n*.84),i.lineTo(-n*.74,-n*.37),i.closePath(),i.fill(),i.beginPath(),i.moveTo(-n*.72,-n*.31),i.lineTo(n*.72,-n*.31),i.lineWidth=n*.055,i.stroke();for(let o=0;o<4;o++){const c=-n*.57+o*n*.38;i.beginPath(),i.roundRect(c-n*.095,-n*.2,n*.19,n*.065,n*.025),i.fill(),i.beginPath(),i.moveTo(c-n*.07,-n*.11),i.lineTo(c+n*.07,-n*.11),i.lineTo(c+n*.085,n*.43),i.lineTo(c-n*.085,n*.43),i.closePath(),i.fill()}for(let o=0;o<3;o++)i.fillRect(-n*.78+o*n*.026,n*(.51+o*.07),n*(1.56-o*.052),n*.042);r&&(i.beginPath(),i.arc(0,0,n*1.19,-.37*Math.PI,.98*Math.PI),i.lineWidth=n*.09,i.strokeStyle=a,i.stroke()),i.restore()}function X2(i,e,t,n,s){i.save(),i.strokeStyle=s,i.lineWidth=3.8,i.beginPath(),i.arc(e,t,n,0,Math.PI*2),i.stroke(),Vc(i,e,t+3,n*.55,s),i.restore()}function Gc(i){const e=(i||Ri).trim();if(e.toLowerCase()===Ri.toLowerCase())return["Informal Notes","on Mathematics"];const t=e.split(/\s+/);if(t.length<=3)return[e];const n=Math.ceil(t.length/2);return[t.slice(0,n).join(" "),t.slice(n).join(" ")]}function Hc({title:i=Ri,author:e="Runnel Zhang",ink:t="#07508a"}={}){if(H2(i,e,t))return G2("front",1200,1680);const n=ui(1200,1680),s=n.getContext("2d");W2(s,1200,1680),X2(s,160,174,56,t),s.fillStyle="#191a19",s.font="bold 20px Arial, sans-serif",s.fillText("INFORMAL NOTES",252,162),s.font="bold 16px Arial,sans-serif",s.fillText("MATHEMATICS · INM",253,188),s.strokeStyle="#171716",s.lineWidth=1.2,s.beginPath(),s.moveTo(252,201),s.lineTo(486,201),s.stroke();const r=Gc(i),a=Math.max(...r.map(x=>x.length)),o=a>28?59:a>20?72:83;s.fillStyle="#111312",s.font="bold "+o+"px Arial,Helvetica,sans-serif",s.textBaseline="alphabetic";const c=520,l=224;r.forEach((x,g)=>s.fillText(x,c,l+g*(o+11),610)),s.font="bold 34px Arial,Helvetica,sans-serif",s.fillText(e,524,470,550);const h=660,f=1150,u=285,p=s.createLinearGradient(300,850,1040,1460);return p.addColorStop(0,"rgba(4,83,149,.03)"),p.addColorStop(.35,"#1374b3"),p.addColorStop(1,"#064783"),s.lineCap="butt",s.lineWidth=33,s.strokeStyle=p,s.beginPath(),s.arc(h,f,u*1.28,-.33*Math.PI,.87*Math.PI),s.stroke(),s.save(),s.translate(h,f),s.rotate(-.04),s.strokeStyle=p,s.beginPath(),s.arc(0,0,u*1.28,.9*Math.PI,1.04*Math.PI),s.stroke(),s.restore(),Vc(s,h,f,u,t),s.fillStyle="rgba(45,45,37,.50)",s.font="16px Georgia,serif",s.fillText("An independent mathematical notebook",86,1595),n}const Ta=new Map;function q2(i="#07508a"){if(Ta.has(i))return Ta.get(i);const e=[1,3,5].map(r=>parseInt(i.slice(r,r+2),16)),t=ui(340,1700),n=t.getContext("2d");n.drawImage(Ci.spine,0,0,340,1700);const s=n.getImageData(0,0,340,1700);for(let r=0;r<s.data.length;r+=4){const a=s.data[r],o=s.data[r+1],c=s.data[r+2],l=c>a+22&&o>a+8,h=.2126*a+.7152*o+.0722*c,f=l?Math.min(1,(c-a)/95):Math.max(0,Math.min(1,(170-h)/105));s.data[r]=l?e[0]:17,s.data[r+1]=l?e[1]:19,s.data[r+2]=l?e[2]:18,s.data[r+3]=Math.round(f*255)}return n.putImageData(s,0,0),Ta.set(i,t),t}function No({title:i=Ri,author:e="Runnel Zhang",ink:t="#07508a",spineAspect:n=.2}={}){const r=Math.max(16,Math.round(1700*n)),a=ui(r,1700),o=a.getContext("2d");o.drawImage(Ci.front,40,450,280,250,0,0,r,1700);const c=q2(t);function l(u,p,x,g,m,d){const M=Math.min(m,r*.64),y=M*g/x;return o.drawImage(c,u,p,x,g,(r-M)/2,d,M,y),{width:M,height:y}}l(88,55,165,150,145,65);const h=l(128,235,78,700,70,260);if(i!==Ri){o.drawImage(Ci.front,40,450,280,250,0,230,r,790),o.save(),o.translate(r/2,260),o.rotate(Math.PI/2);let u=Math.min(60,r*.58);for(o.font="bold "+u+"px Arial, sans-serif";o.measureText(i).width>710&&u>8;)u-=1,o.font="bold "+u+"px Arial, sans-serif";o.fillStyle="#111312",o.fillText(i,0,u*.34),o.restore()}o.strokeStyle="#30352f",o.lineWidth=1.5;const f=Math.min(110,r*.48);if(o.beginPath(),o.moveTo((r-f)/2,1010),o.lineTo((r+f)/2,1010),o.stroke(),e==="Runnel Zhang")l(128,978,78,265,52,1060);else{o.save(),o.translate(r/2,1060),o.rotate(Math.PI/2);let u=Math.min(42,r*.48);for(o.font="bold "+u+"px Arial, sans-serif";o.measureText(e).width>300&&u>8;)u-=1,o.font="bold "+u+"px Arial, sans-serif";o.fillStyle="#111312",o.fillText(e,0,u*.34),o.restore()}return l(110,1490,120,165,102,1480),a.dataset.spineAspect=String(n),a.dataset.titleAspect=String(h.width/h.height),a.dataset.titleWidth=String(h.width),a}function Wc({title:i=Ri,author:e="Runnel Zhang",ink:t="#07508a"}={}){const n=ui(1200,1680),s=n.getContext("2d");s.drawImage(Ci.front,40,450,280,250,0,0,1200,1680),s.save(),s.globalAlpha=.075,s.drawImage(Ci.front,120,660,1040,920,310,790,950,840),s.restore(),s.fillStyle=t,s.font="20px Arial, sans-serif",s.fillStyle="#161918",s.font='bold 53px "Times New Roman", serif';const r=Gc(i);r.forEach((o,c)=>s.fillText(o,110,245+c*65,980));const a=245+(r.length-1)*65;return s.strokeStyle=t,s.lineWidth=3,s.beginPath(),s.moveTo(110,a+52),s.lineTo(1090,a+52),s.stroke(),s.fillStyle=t,s.font='italic 37px "Times New Roman", serif',s.fillText("Connections across modern mathematics",110,a+151,980),s.fillStyle="#303632",s.font='29px "Times New Roman", serif',["What makes distant branches of mathematics","belong to the same landscape?","","Moving through algebra, analysis, geometry and topology,","this volume follows ideas beyond the boundaries","of a single course. Detailed arguments sit alongside","worked examples and the intuitions that motivate them.","","A book to read in sequence, explore by curiosity,","and return to as familiar ideas acquire new meaning."].forEach((o,c)=>s.fillText(o,110,a+250+c*49,980)),s.strokeStyle=t,s.lineWidth=2,s.beginPath(),s.moveTo(110,1480),s.lineTo(1090,1480),s.stroke(),s.fillStyle="#1c2524",s.font='bold 32px "Times New Roman", serif',s.fillText(e,110,1541,750),s.font="18px Arial, sans-serif",s.fillStyle=t,s.textAlign="right",s.fillText("INM",1090,1541),n}function Y2(){const i=ui(160,2048),e=i.getContext("2d");e.fillStyle="#f0ece3",e.fillRect(0,0,i.width,i.height);let t=98;const n=()=>(t=t*1103515245+12345>>>0,t/4294967296);for(let s=0;s<i.height;s+=3){const r=.045+n()*.14;e.fillStyle="rgba(106,101,89,"+r+")",e.fillRect(0,s,i.width,n()>.5?1:2)}for(let s=0;s<55;s++){e.strokeStyle="rgba(255,255,255,.16)",e.beginPath();const r=n()*i.height;e.moveTo(0,r),e.lineTo(i.width,r),e.stroke()}return i}function Z2(){const i=ui(512,512),e=i.getContext("2d"),t=e.createImageData(512,512);let n=9071993;for(let s=0;s<512;s++)for(let r=0;r<512;r++){n=Math.imul(n,1664525)+1013904223>>>0;const a=(n/4294967296-.5)*7,o=Math.sin(r*1.42)*Math.cos(s*1.31)*17,c=Math.sin(s*1.54)*Math.cos(r*1.27)*12,l=Math.min(255,Math.max(0,Math.round(129+o+c+a))),h=(s*512+r)*4;t.data[h]=l,t.data[h+1]=l,t.data[h+2]=l,t.data[h+3]=255}return e.putImageData(t,0,0),i}function j2(i="INM"){const e=ui(750,1060),t=e.getContext("2d");return t.fillStyle="#faf9f4",t.fillRect(0,0,e.width,e.height),t.strokeStyle="#ebe9e2",t.lineWidth=2,t.strokeRect(52,54,e.width-104,e.height-108),t.fillStyle="#c8c6bc",t.font="28px Georgia,serif",t.textAlign="center",t.fillText(i,375,530),e}let rc;async function Xc(i){return rc||=pl(()=>import("./pdf-B75MOh95.js"),[]).then(t=>(t.GlobalWorkerOptions.workerSrc=V2,t)),(await rc).getDocument(i).promise}const Q=i=>document.getElementById(i),ac={a4:[210,297],b5:[176,250],a5:[148,210],royal:[170,240],sixnine:[152,229]},oc=ns.count,D={pages:oc,sourcePages:oc,caliper:.1,format:"a4",binding:"hardcover",openAngle:120,title:"Informal Notes on Mathematics",author:"Runnel Zhang",ink:"#07508a",open:!1,spread:0,currentPage:1,isMoving:!1,flip:null,coverProgress:0,coverTarget:0,coverUpload:null};let Dr=null,yn=null,yr=null,xr=null;const qc=new m2("/inm-3d-book/inm.pdf",{revision:ns.source}),K2=new x2;let Er=0;const fn=new Map,Fs=new Map;let wn=0;const $2=window.innerWidth<760?12:16,ai={};let Tr=0;const Yc=new p2("/inm-3d-book/page-previews/",fetch,window.innerWidth<760&&ns.mobile||ns);let kr=!0,cc=null;const hi=Q("canvasHost"),vn=new Wh,Ut=new tn(30,1,.08,130),ht=new Yp({antialias:!0,alpha:!0,preserveDrawingBuffer:!0,powerPreference:"high-performance"});ht.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));ht.setSize(hi.clientWidth||1e3,hi.clientHeight||720);ht.outputColorSpace=Ct;ht.toneMapping=dc;ht.toneMappingExposure=.98;ht.shadowMap.enabled=!1;ht.shadowMap.type=hc;hi.appendChild(ht.domElement);let Xt=!0;const St=new z2(Ut,ht.domElement);St.addEventListener("change",()=>{Xt=!0});St.minDistance=1.6;St.maxDistance=35;let Fn=!1,zr=!1,Vn=!1;St.addEventListener("start",()=>{un=null,zr=!0,D.flip&&(D.flip.autoFrame=!1)});Ut.position.set(-5.2,.4,9.3);St.target.set(-.13,.03,0);St.update();const J2=new Qh(16776437,12041149,.85);vn.add(J2);const Rn=new Fr(16777215,1.7);Rn.position.set(-3.4,7.5,8.2);Rn.castShadow=!0;Rn.shadow.mapSize.set(2048,2048);Rn.shadow.camera.left=-9;Rn.shadow.camera.right=9;Rn.shadow.camera.top=9;Rn.shadow.camera.bottom=-9;Rn.shadow.bias=-13e-5;Rn.shadow.normalBias=.012;vn.add(Rn);const Zc=new Fr(15003386,.48);Zc.position.set(6,3,-5);vn.add(Zc);const jc=new Fr(16773856,.34);jc.position.set(-6,3,-2);vn.add(jc);const Kc=new Fr(16774889,.78);Kc.position.set(.2,3.2,-7);vn.add(Kc);const Pi=new jt(new gn(100,100),new Kh({opacity:.065}));Pi.rotation.x=-Math.PI/2;Pi.receiveShadow=!0;Pi.position.y=-1.94;vn.add(Pi);const Vr=document.createElement("canvas");Vr.width=256;Vr.height=256;const Fo=Vr.getContext("2d"),Gr=Fo.createRadialGradient(128,128,7,128,128,125);Gr.addColorStop(0,"rgba(34,36,32,.20)");Gr.addColorStop(.42,"rgba(42,44,40,.10)");Gr.addColorStop(1,"rgba(46,47,43,0)");Fo.fillStyle=Gr;Fo.fillRect(0,0,256,256);const Q2=new Lo(Vr),Zt=new jt(new gn(6,5),new ls({map:Q2,transparent:!0,depthWrite:!1,opacity:.9}));Zt.rotation.x=-Math.PI/2;Zt.position.set(0,Pi.position.y+.003,0);Zt.renderOrder=0;vn.add(Zt);const Oo=new Tn;vn.add(Oo);let Rt=null,Os=null,Qe=null,ii,zt,si,xo,rn,Bn,oi,Ur,Cs,$c,At=null,un=null,yi=null;new F(0,0,0);const em=new iu;new Xe;function nn(i){const e=new Lo(i);return e.colorSpace=Ct,e.anisotropy=Math.min(8,ht.capabilities.getMaxAnisotropy()),e.needsUpdate=!0,e}function Bo(){const i=Vs(),e=new Ti(i,D.sourcePages,0,0,D.openAngle,D.pages);let t=0,n=e.spinePoint(0);for(let s=1;s<=100;s++){const r=e.spinePoint(s/100);t+=Math.hypot(r.x-n.x,r.z-n.z),n=r}return{...D,spineAspect:t/(i.h+2*i.overhang)}}function tm(){ii=nn(Hc(D)),zt=nn(No(Bo())),si=nn(Wc(D)),xo=nn(Y2()),rn=nn(j2()),Bn=nn(Z2()),Bn.wrapS=as,Bn.wrapT=as,Bn.repeat.set(4,4),oi=new kn({map:ii,bumpMap:Bn,bumpScale:.0016,roughness:.91,metalness:0,emissive:16777215,emissiveMap:ii,emissiveIntensity:.16}),Ur=new kn({map:zt,bumpMap:Bn,bumpScale:.0016,roughness:.93,metalness:0}),Cs=new kn({map:si,bumpMap:Bn,bumpScale:.0016,roughness:.93,metalness:0,emissive:16777215,emissiveMap:si,emissiveIntensity:.16}),new kn({color:"#e7e1d4",roughness:1}),$c=new kn({color:"#e5dfd3",bumpMap:Bn,bumpScale:.0016,roughness:.93,metalness:0}),new kn({map:xo,roughness:1})}tm();function Vs(){const[i,e]=ac[D.format]||ac.a4,t=2.7/210,n=i*t,s=e*t,r=Math.max(.035,D.pages/2*D.caliper*t),a=(D.binding==="hardcover"?2.4:.45)*t,o=(D.binding==="hardcover"?3.2:0)*t;return{mmw:i,mmh:e,w:n,h:s,t:r,board:a,overhang:o,scale:t}}function dn(i){return i.toLocaleString("en-US")}function Jc(){D.flip&&(Go(),D.isMoving=!1),Qe&&Qe.dispose();const i=Vs();Os=i;const e=nn(No(Bo()));zt&&zt.dispose(),zt=e,Ur.map=zt,Qe=new d2({root:Oo,dimensions:i,sourcePages:D.sourcePages,printPages:D.pages,materials:{cloth:$c,clothBump:Bn,front:oi,back:Cs,spine:zt,edge:xo,placeholder:rn}}),Rt={frontPivot:Qe.frontPivot,frontCover:Qe.frontBoard,backCover:Qe.backBoard,rightStack:Qe.rightStack,leftStack:Qe.leftStack,rightPage:Qe.rightPage,leftPage:Qe.leftPage,spine:Qe.spine},Pi.position.y=-i.h/2-i.overhang-.024,Zt.position.y=Pi.position.y+.003,Zt.scale.x=D.open?1.22:.52,Zt.scale.y=D.open?1.1:.48,ko(),Bs(D.open),Yn(),Xt=!0}function Bs(i){Rt&&(Qe.render(D.coverProgress,D.spread,D.sourcePages,D.pages,D.openAngle),At||(Zt.scale.x=i?1.22:.52,Zt.scale.y=i?1.1:.48),i||(Vn=!1),Q("readerNavigation").hidden=!(i&&Vn),Q("togglePageJump").setAttribute("aria-expanded",String(i&&Vn)),Q("sceneWrap").classList.toggle("is-reading",i),Xt=!0)}function ko(){Qe&&(Qe.render(D.coverProgress,D.spread,D.sourcePages,D.pages,D.openAngle),Xt=!0)}function Yn(){const i=Os||Vs(),e=D.pages/2*D.caliper;if(Q("coreThickness").textContent=e.toFixed(1),Q("sheetCount").textContent=dn(Math.ceil(D.pages/2)),Q("signatureCount").textContent=Math.ceil(D.pages/32)+" signatures",Q("physicalDimensions").textContent=i.mmw+" × "+i.mmh+" mm",Q("pageCount").value=D.pages,Q("pagesRange").value=Math.min(2e3,Math.max(100,D.pages)),Q("sourcePagesLabel").textContent="Source: "+dn(D.sourcePages),Q("sceneTitle").textContent=D.title,Q("sceneMeta").textContent=D.format.toUpperCase()+" / "+D.binding.toUpperCase()+" / "+dn(D.pages)+" PAGES",Q("scaleDetails").textContent=D.format.toUpperCase()+" · "+i.mmw+" × "+i.mmh+" mm · "+e.toFixed(1)+" mm book block",!D.open)Q("counterLabel").textContent="CLOSED VOLUME",Q("pageIndicator").textContent="1 / "+dn(D.sourcePages);else{const t=D.spread*2,n=t+1;Q("counterLabel").textContent="PAGE";const s=t>0&&t<=D.sourcePages?dn(t):"",r=n<=D.sourcePages?dn(n):"";Q("pageIndicator").textContent=(s&&r?s+"–"+r:s||r)+" / "+dn(D.sourcePages)}Q("readerPosition").max=D.sourcePages,Q("readerPageInput").max=D.sourcePages,Q("readerPosition").value=D.currentPage,document.activeElement!==Q("readerPageInput")&&(Q("readerPageInput").value=D.currentPage),Q("inspectorQuick").hidden=!D.open,Q("togglePageJump").disabled=!D.open,Q("prevPage").disabled=!D.open||D.isMoving||D.spread<=0,Q("nextPage").disabled=!D.open||D.isMoving||D.spread>=Math.ceil(D.sourcePages/2)}function gr(){const i=nn(Hc(D)),e=nn(No(Bo())),t=nn(Wc(D));ii&&ii.dispose(),zt&&zt.dispose(),si&&si.dispose(),ii=i,zt=e,si=t,oi.map=ii,oi.emissiveMap=ii,Ur.map=zt,Cs.map=si,Cs.emissiveMap=si,oi.needsUpdate=!0,Ur.needsUpdate=!0,Cs.needsUpdate=!0,D.coverUpload&&(oi.map=D.coverUpload),Qe&&(Qe.materials.spine=zt,Qe.spine.material.map=zt,Qe.spine.material.emissiveMap=zt,Qe.spine.material.needsUpdate=!0),Xt=!0,Yn()}function an(i,e=!1){const t=Q("loadingMsg");t.textContent=i||"",e&&i&&(clearTimeout(an.timer),an.timer=setTimeout(()=>{t.textContent===i&&(t.textContent="")},2500))}function Qi(i,e){if(!i||!i.material)return;const t=e||rn;i.material.map!==t&&(i.material.map=t,Xt=!0)}function Qc(i,{isDefault:e=!1}={}){kr=e,e||(fn.forEach(n=>n.then(s=>{s&&s!==rn&&s.dispose()}).catch(()=>{})),fn.clear(),Fs.clear(),wn++,Er++);const t=wn;return Dr=null,Q("pdfState").textContent="Loading PDF…",yn=Xc(i).then(n=>t!==wn?(n.destroy(),yn):(Dr=n,D.sourcePages=n.numPages,Q("pdfState").textContent=dn(n.numPages)+"-page source",e||an("",!1),Yn(),D.open&&!e&&Li(Math.min(D.spread,Math.floor((n.numPages-1)/2))),n)).catch(n=>{if(t!==wn)return yn;throw e?(yn=null,Q("pdfState").textContent="Page previews available",n):(Q("pdfState").textContent="PDF unavailable",an("Unable to load PDF pages. The 3D cover remains available.",!0),console.error("PDF loading error",n),n)}),yn}function zo(){if(yr)return yn;if(!xr){const i=wn;xr=qc.load().then(e=>yr||i!==wn||yn?yn:Qc({data:e.slice()},{isDefault:!0})).then(e=>(!yr&&e&&(Q("pdfState").textContent=dn(e.numPages)+" pages · reading copy ready",tl()),e)).catch(e=>{throw xr=null,e})}return xr}function el(){return yn||zo()}async function nm(i){const e=performance.now(),t=await Yc.blob(i),n=performance.now();if(typeof createImageBitmap=="function"){const r=await createImageBitmap(t,{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}),a=new yt(r);return a.flipY=!1,a.colorSpace=Ct,a.anisotropy=Math.min(8,ht.capabilities.getMaxAnisotropy()),a.needsUpdate=!0,a.addEventListener("dispose",()=>r.close()),ai.lastImage={fetchMs:n-e,decodeMs:performance.now()-n},a}const s=URL.createObjectURL(t);try{const r=new Image;r.src=s,await r.decode();const a=new yt(r);return a.colorSpace=Ct,a.needsUpdate=!0,a}finally{URL.revokeObjectURL(s)}}function im(i,e=!1){const t=wn;return K2.run(async()=>{if(t!==wn)return rn;const n=await el();if(i>n.numPages)return rn;const s=await n.getPage(i),r=s.getViewport({scale:1}),a=kr?window.innerWidth<760?780:1100:window.innerWidth<760?1100:1600,o=s.getViewport({scale:Math.min(1.9,a/r.height)}),c=document.createElement("canvas");c.width=Math.ceil(o.width),c.height=Math.ceil(o.height);const l=c.getContext("2d",{alpha:!1});return l.fillStyle="#fff",l.fillRect(0,0,c.width,c.height),await s.render({canvasContext:l,viewport:o}).promise,s.cleanup(),ai.localRenders=(ai.localRenders||0)+1,nn(c)},e)}function ks(i,e=!1){if(!i||i<1||i>D.sourcePages)return Promise.resolve(rn);if(fn.has(i))return fn.get(i);const t=wn,n=(async()=>{if(kr&&!Dr)try{return await nm(i)}catch(s){console.warn("Using PDF fallback for page previews",s)}return im(i,e)})().then(s=>t!==wn?(s!==rn&&s.dispose(),rn):(fn.get(i)===n&&Fs.set(i,s),queueMicrotask(Vo),s)).catch(s=>(fn.get(i)===n&&fn.delete(i),console.warn("Could not render page",i,s),rn));return fn.set(i,n),n}function Vo(){const i=new Set([Rt?.leftPage.material.map,Rt?.rightPage.material.map,D.flip?.frontMat.map]);for(const[e,t]of fn){if(fn.size<=$2)break;const n=Fs.get(e);!n||i.has(n)||Math.abs(e-D.spread*2-1)<=4||(fn.delete(e),Fs.delete(e),n!==rn&&n.dispose())}}function go(i){return Fs.get(i)||rn}function tl(){clearTimeout(cc);const i=D.spread*2+1;cc=setTimeout(()=>{if(!(!D.open||D.isMoving))for(const e of[i+1,i+2,i+3,i+4,i-2,i-3])e>0&&e<=D.sourcePages&&ks(e,!0)},180)}async function Li(i,e=null){if(!Rt)return;D.spread=Math.min(Math.max(0,i),Math.ceil(D.sourcePages/2)),D.currentPage=e===null?Math.min(D.sourcePages,D.spread*2+1):Math.min(D.sourcePages,Math.max(1,Math.floor(e)));const t=++Er,n=performance.now();if(Tr=D.open?t:0,ko(),Bs(D.open),Yn(),!D.open)return;const s=performance.now();an("Preparing the printed pages…");try{const r=D.spread===0?0:D.spread*2,a=D.spread*2+1;Qi(Rt.leftPage,go(r)),Qi(Rt.rightPage,go(a));const[o,c]=await Promise.all([ks(r),ks(a)]);if(t!==Er)return;D.flip||(Qi(Rt.leftPage,o),Qi(Rt.rightPage,c)),ai.page=D.currentPage,ai.geometryMs=s-n,ai.textureMs=performance.now()-s,ai.totalMs=performance.now()-n,Tr=0,an(""),tl(),Vo()}catch{t===Er&&(Tr=0,an("Page preview is temporarily unavailable.",!0))}}function wa(i){return i*i*(3-2*i)}function zn(i){D.isMoving||(D.open=i,D.isMoving=!0,i||(Tr=0),D.coverTarget=i?1:0,D.spread=i?D.spread:0,i||(Q("readerNavigation").hidden=!0,Q("sceneWrap").classList.remove("is-reading")),At={kind:"cover",from:D.coverProgress,to:D.coverTarget,start:performance.now(),duration:850},Q("openBook").innerHTML=i?"Close <span>×</span>":"Open <span>↗</span>",i?(Li(D.spread),pn("read")):(Yn(),pn("front")))}function Go(){if(!D.flip)return;const i=D.flip;i.group.parent&&i.group.parent.remove(i.group),i.geometry.dispose(),i.backMat.map&&i.backMat.map.dispose(),i.frontMat.dispose(),i.backMat.dispose(),D.flip=null,Vo()}function nl(i,e){const t=Qe.applyTurn(i.stationaryPose,e);i.model.writePositions(i.geometry.attributes.position,e,i.dir,t),i.geometry.computeVertexNormals(),i.geometry.computeBoundingSphere()}async function ti(i){if(D.isMoving)return;if(!D.open){zn(!0);return}const e=D.spread+i;if(e<0||e>Math.ceil(D.sourcePages/2))return;D.isMoving=!0,Yn();const t=D.spread,n=i>0?t*2+1:t*2,s=i>0?n+1:n-1,r=i>0?e*2+1:e>0?e*2:0;try{const[a,o,c]=[n,s,r].map(go);if(!D.isMoving||!D.open){D.isMoving=!1;return}const l=new gn(1,1,64,16),h=Float32Array.from(l.attributes.position.array),f=i>0?"right":"left",u=i>0?"left":"right",p=new Ti(Os,D.sourcePages,t,1,D.openAngle,D.pages),x=new Ti(Os,D.sourcePages,e,1,D.openAngle,D.pages),g=p.gutterSafeFraction,m=l.attributes.uv,d=new Float32Array(m.count*3);for(let A=0;A<m.count;A++){const B=i>0?h[3*A]+.5:.5-h[3*A],z=.085+.915*Math.max(0,(B-g)/(1-g));m.setX(A,i>0?z:1-z);const W=Math.min(1,B/(g*1.8)),q=W*W*(3-2*W),H=.83+.17*q;d[3*A]=H,d[3*A+1]=H*.997,d[3*A+2]=H*.985}m.needsUpdate=!0,l.setAttribute("color",new ut(d,3));const M=o.clone();M.wrapS=as,M.repeat.x=-1,M.offset.x=1,M.needsUpdate=!0;const y=new ls({map:a,toneMapped:!1,side:_n,vertexColors:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),w=new ls({map:M,toneMapped:!1,side:Ot,vertexColors:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),P=Qe.captureTurn(e),E=new f2({from:p,to:x,fromSide:f,toSide:u,columns:64,rows:16}),C=new Tn,U=new jt(l,y),S=new jt(l,w);U.frustumCulled=!1,S.frustumCulled=!1,U.renderOrder=4,S.renderOrder=4,C.add(U,S),Oo.add(C);const b={group:C,geometry:l,basePositions:h,frontMat:y,backMat:w,poseFrom:p,poseTo:x,fromSide:f,toSide:u,model:E,stationaryPose:P,dir:i,autoFrame:!1,frameScale:1,start:performance.now(),lastTime:performance.now(),progress:0,duration:850};nl(b,0),i>0?Qi(Rt.rightPage,c):Qi(Rt.leftPage,c),D.flip=b,an("");for(const A of[n,s,r])ks(A)}catch(a){console.error("Page turn failed",a),an("Could not turn the page.",!0),D.isMoving=!1,Yn()}}function il(i){if(requestAnimationFrame(il),em.getDelta(),At){Xt=!0;const t=Math.min(1,(i-At.start)/At.duration),n=wa(t);if(Zt.scale.x=cs.lerp(At.to?.52:1.22,At.to?1.22:.52,n),Zt.scale.y=cs.lerp(At.to?.48:1.1,At.to?1.1:.48,n),D.coverProgress=At.from+(At.to-At.from)*n,Qe.render(D.coverProgress,D.spread,D.sourcePages,D.pages,D.openAngle),t>=1){const s=At.to===1;At=null,D.isMoving=!1,Bs(s),s?Li(D.spread):(D.spread=0,D.currentPage=1,Bs(!1),Yn())}}if(D.flip){Xt=!0;const t=D.flip,n=Math.min(65,Math.max(0,i-t.lastTime));t.lastTime=i,t.progress=Math.min(1,t.progress+n/t.duration);const s=t.progress;if(nl(t,wa(s)),s>=1){const r=D.spread+t.dir;Go(),D.isMoving=!1,Li(r)}}if(un){Xt=!0;const t=Math.min(1,(i-un.start)/un.duration),n=wa(t);Ut.position.lerpVectors(un.from,un.to,n),St.target.lerpVectors(un.targetFrom,un.targetTo,n),t>=1&&(un=null)}const e=St.update();(Xt||e)&&(ht.render(vn,Ut),Xt=!1)}function pn(i,e=!0){zr=!1,Ut.up.set(0,1,0),document.querySelectorAll(".view-button").forEach(u=>u.classList.toggle("active",u.id==="view"+i[0].toUpperCase()+i.slice(1)));const t=Os||Vs(),n=D.open,s=Qe?.root.position.y||0,r=hi.clientWidth,a=hi.clientHeight,o=D.spread/Math.max(1,Math.ceil(D.sourcePages/2)),c=Math.abs(o-.5)*2,l=r<760?c*.25:c,h=n?new F((.5-o)*.6*l,s+.18+.75*l,0):new F(0,.05,0);let f;if(!n)i==="back"?f=new F(4,.5,-9.3):i==="spine"?f=new F(-6.8,.4,3):i==="pages"?f=new F(3.6,3.4,6):f=new F(-5.2,.4,9.3);else if(i==="spine"){Qe.root.updateMatrixWorld(!0);const u=Qe.rig.spinePoint(.5);h.copy(Qe.root.localToWorld(new F(u.x,0,u.z)));const p=o<.22?-1:o>.78?1:0;h.y+=.65,f=h.clone().add(new F(p*6.5,-3.8,-10.5))}else i==="pages"?f=new F(.2,s+8.5,2):i==="read"?f=new F(h.x-.3,s+6.4+2.5*l,4.85+.8*l):f=new F(-2.3,s+4.8,5.8);if(r<760){const u=f.clone().sub(h);let p=n?(2*t.w+.9)/(2*Math.tan(cs.degToRad(Ut.fov)/2)*(r/a))*1.07:Math.max(9.8,t.h/(2*Math.tan(cs.degToRad(Ut.fov)/2))*.92);u.setLength(Math.max(u.length(),p)),f=h.clone().add(u)}if(!e){un=null,Ut.position.copy(f),St.target.copy(h),St.update(),Xt=!0;return}un={from:Ut.position.clone(),to:f,targetFrom:St.target.clone(),targetTo:h,start:performance.now(),duration:900}}function wr(){At&&(At=null,D.isMoving=!1),D.coverProgress=D.open?1:0,Jc(),D.open&&(Li(D.spread),pn("read"))}function Rs(i){const e=Number(i);Number.isFinite(e)&&(D.pages=Math.min(4e3,Math.max(2,Math.round(e/2)*2)),wr())}function sm(){Rs(D.sourcePages)}function Sn(i,{fromInspector:e=!1}={}){const t=D.open&&zr,n=Math.min(D.sourcePages,Math.max(1,Math.floor(Number(i)||1)));return D.flip&&Go(),At=null,D.isMoving=!1,D.open||(D.open=!0,D.coverProgress=1,D.coverTarget=1,Q("openBook").innerHTML="Close <span>×</span>",Qe.render(1,D.spread,D.sourcePages,D.pages,D.openAngle),Zt.scale.x=1.22,Zt.scale.y=1.1),Vn=!1,Li(Math.floor(n/2),n),Bs(!0),t||pn("read",!1),history.replaceState(null,"","#p="+n),window.matchMedia("(max-width: 760px)").matches&&(sl(!1),window.scrollTo({top:0,behavior:"smooth"})),n}function rm(i){if(!i)return;(async()=>{let t;if(i.type==="application/pdf"){const c=new Uint8Array(await i.arrayBuffer()),l=await Xc({data:c}),h=await l.getPage(1),f=h.getViewport({scale:1.65}),u=document.createElement("canvas");u.width=Math.round(f.width),u.height=Math.round(f.height),await h.render({canvasContext:u.getContext("2d"),viewport:f}).promise,t=u,await l.destroy()}else t=await createImageBitmap(i);const n=document.createElement("canvas");n.width=1200,n.height=1680;const s=n.getContext("2d");s.fillStyle="#e7e2d6",s.fillRect(0,0,n.width,n.height);const r=Math.max(n.width/t.width,n.height/t.height),a=t.width*r,o=t.height*r;s.drawImage(t,(n.width-a)/2,(n.height-o)/2,a,o),D.coverUpload&&D.coverUpload.dispose(),D.coverUpload=nn(n),oi.map=D.coverUpload,oi.needsUpdate=!0,an("Your cover is applied.",!0)})().catch(t=>{console.error(t),an("This cover file could not be read.",!0)})}function am(){ht.render(vn,Ut);const i=ht.domElement,e=document.createElement("a");e.href=i.toDataURL("image/png"),e.download="INM-physical-book-"+(D.open?"open":"cover")+".png",document.body.appendChild(e),e.click(),e.remove()}function sl(i){Q("sidebar").hidden=!i,Q("sidebar").classList.toggle("mobile-open",i),Q("toggleSettings").setAttribute("aria-expanded",String(i)),Q("toggleSettings").innerHTML=i?"Hide print settings <span>⌃</span>":"Print settings <span>⌄</span>"}function om(){const i=document.createElement("button");i.id="viewBack",i.className="view-button",i.type="button",i.textContent="Back",i.title="Back cover",Q("viewSpine").before(i),i.addEventListener("click",()=>{D.open&&zn(!1),pn("back")});const e=document.createElement("div");e.className="manipulation-tools",e.innerHTML='<button id="moveBook" type="button" aria-pressed="false">Move</button><button id="resetBookView" type="button">Reset view</button>',Q("viewTools").append(e),Q("moveBook").addEventListener("click",()=>{Fn=!Fn,St.mouseButtons.LEFT=Fn?ci.PAN:ci.ROTATE,St.oneFingerPan=Fn,St.noRotate=Fn,Q("moveBook").setAttribute("aria-pressed",String(Fn)),Q("moveBook").textContent=Fn?"Rotate":"Move",ht.domElement.style.cursor=Fn?"move":"grab"}),Q("resetBookView").addEventListener("click",()=>pn(D.open?"read":"front")),Q("pageCount").addEventListener("change",s=>Rs(s.target.value)),Q("pagesRange").addEventListener("input",s=>Rs(s.target.value)),Q("restorePageCount").addEventListener("click",sm),Q("format").addEventListener("change",s=>{D.format=s.target.value,wr()}),Q("paper").addEventListener("change",s=>{D.caliper=Number(s.target.value),wr()}),Q("binding").addEventListener("change",s=>{D.binding=s.target.value,wr()}),Q("openingAngle").addEventListener("input",s=>{D.openAngle=Number(s.target.value),Q("angleLabel").textContent=D.openAngle+"°",ko()}),Q("coverTitle").addEventListener("input",s=>{D.title=s.target.value||"Informal Notes on Mathematics",gr()}),Q("coverAuthor").addEventListener("input",s=>{D.author=s.target.value||"Runnel Zhang",gr()}),Q("inkColor").addEventListener("input",s=>{D.ink=s.target.value,gr()}),Q("coverUpload").addEventListener("change",s=>rm(s.target.files[0])),Q("resetCover").addEventListener("click",()=>{D.coverUpload&&D.coverUpload.dispose(),D.coverUpload=null,Q("coverUpload").value="",gr()}),Q("pdfUpload").addEventListener("change",async s=>{const r=s.target.files[0];if(r)try{yr=r,await Qc({data:new Uint8Array(await r.arrayBuffer())}),Rs(D.sourcePages),D.spread=0,D.currentPage=1,D.open&&Li(0),Q("outlineCount").textContent="The index below describes the original INM PDF.",an("Loaded your own PDF — "+dn(D.sourcePages)+" pages.",!0)}catch(a){console.error(a)}}),Q("captureBtn").addEventListener("click",am),Q("openBook").addEventListener("click",()=>zn(!D.open)),Q("prevPage").addEventListener("click",()=>ti(-1)),Q("nextPage").addEventListener("click",()=>ti(1)),Q("viewFront").addEventListener("click",()=>pn("front")),Q("viewSpine").addEventListener("click",()=>pn("spine")),Q("viewPages").addEventListener("click",()=>pn("pages")),Q("viewRead").addEventListener("click",()=>{D.open?pn("read"):zn(!0)}),Q("readerPosition").addEventListener("input",s=>{Q("readerPageInput").value=s.target.value}),Q("readerPosition").addEventListener("change",s=>Sn(s.target.value)),Q("readerPageInput").addEventListener("change",s=>Sn(s.target.value)),Q("readerPageInput").addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),Sn(s.target.value),s.target.blur())}),Q("readerGo").addEventListener("click",()=>Sn(Q("readerPageInput").value)),Q("inspectorOpen").addEventListener("click",()=>yi?.open(D.currentPage)),Q("inspectorQuick").addEventListener("click",()=>yi?.open(D.currentPage)),Q("toggleSettings").addEventListener("click",()=>{const s=Q("sidebar").hidden;sl(s),s&&window.matchMedia("(max-width:760px)").matches&&setTimeout(()=>Q("sidebar").scrollIntoView({behavior:"smooth",block:"start"}),110)}),Q("togglePageJump").addEventListener("click",()=>{Vn=!Vn,Q("readerNavigation").hidden=!Vn,Q("togglePageJump").setAttribute("aria-expanded",String(Vn)),Vn&&(Q("readerPageInput").focus(),Q("readerPageInput").select())}),Q("viewMenu").addEventListener("click",s=>{s.target.closest("button")&&(Q("viewMenu").open=!1)}),document.addEventListener("click",s=>{Q("viewMenu").contains(s.target)||(Q("viewMenu").open=!1)}),document.addEventListener("keydown",s=>{if(s.key==="Escape"&&Q("viewMenu").open){Q("viewMenu").open=!1;return}yi?.visible()||/INPUT|SELECT|TEXTAREA/.test(s.target.tagName)||((s.key==="r"||s.key==="R")&&D.open&&yi?.open(D.currentPage),s.key==="ArrowRight"&&ti(1),s.key==="ArrowLeft"&&ti(-1),s.key==="Escape"&&D.open&&zn(!1),s.key==="Home"&&Sn(1),s.key==="End"&&Sn(D.sourcePages),s.key===" "&&(s.preventDefault(),zn(!D.open)))});let t=null;ht.domElement.addEventListener("pointerdown",s=>{t={x:s.clientX,y:s.clientY}}),ht.domElement.addEventListener("dblclick",s=>{if(!D.open||D.isMoving)return;const r=ht.domElement.getBoundingClientRect(),o=(s.clientX-r.left)/r.width<.5?D.spread*2:D.spread*2+1;o>0&&o<=D.sourcePages&&yi?.open(o)}),ht.domElement.addEventListener("pointerup",s=>{if(!t)return;if(Fn||s.button!==0||!s.isPrimary){t=null;return}const r=Math.hypot(t.x-s.clientX,t.y-s.clientY);if(t=null,r>6||D.isMoving)return;const a=ht.domElement.getBoundingClientRect(),o=new Fe((s.clientX-a.left)/a.width*2-1,-((s.clientY-a.top)/a.height)*2+1),c=new su;c.setFromCamera(o,Ut);const l=[Rt.frontCover,Rt.rightPage,Rt.leftPage,Rt.rightStack,Rt.leftStack,Rt.backCover],h=c.intersectObjects(l.filter(f=>f.visible),!0);if(h.length){if(!D.open){zn(!0);return}h[0].point.x<0?ti(-1):ti(1)}}),new ResizeObserver(()=>{const s=hi.clientWidth,r=hi.clientHeight;!s||!r||(Ut.aspect=s/r,Ut.updateProjectionMatrix(),ht.setSize(s,r,!1),St.handleResize(),ht.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8)),Xt=!0,s<520&&!D.isMoving&&!zr&&Ut.position.length()<10.5&&(Ut.position.set(-3.8,1.7,11.8),St.target.set(0,.02,0),St.update()))}).observe(hi)}Jc();om();yi=xl({getDocument:el,getPageCount:()=>D.sourcePages,onNavigate:Sn});ml({baseUrl:"/inm-3d-book/",onJump:Sn,revision:ns.source});Yn();requestAnimationFrame(il);Q("pdfState").textContent=dn(D.sourcePages)+"-page source";setTimeout(()=>{if(kr&&(!D.open||D.spread===0))for(const i of[1,2,3])ks(i)},150);setTimeout(()=>zo().catch(i=>console.warn("Background reading copy deferred",i)),1e3);setTimeout(()=>{const i=location.hash.match(/^#p=(\d+)$/);i&&Sn(Number(i[1]))},0);window.__INM_DEBUG__={state:D,dims:Vs,scene:vn,camera:Ut,controls:St,renderer:ht,open:()=>zn(!0),close:()=>zn(!1),next:()=>ti(1),previous:()=>ti(-1),setPageCount:Rs,focusView:pn,jump:Sn,inspect:i=>yi.open(i),mechanics:()=>Qe,pdf:()=>Dr,previews:Yc,readingCopy:qc,prepareReadingCopy:zo,pageTiming:ai};
