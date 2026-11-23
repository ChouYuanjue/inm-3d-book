(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();const fl="modulepreload",dl=function(i){return"/inm-3d-book/"+i},Ko={},pl=function(e,t,n){let s=Promise.resolve();if(t&&t.length>0){let l=function(c){return Promise.all(c.map(h=>Promise.resolve(h).then(d=>({status:"fulfilled",value:d}),d=>({status:"rejected",reason:d}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),o=a?.nonce||a?.getAttribute("nonce");s=l(t.map(c=>{if(c=dl(c),c in Ko)return;Ko[c]=!0;const h=c.endsWith(".css"),d=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const u=document.createElement("link");if(u.rel=h?"stylesheet":fl,h||(u.as="script"),u.crossOrigin="",u.href=c,o&&u.setAttribute("nonce",o),document.head.appendChild(u),h)return new Promise((p,x)=>{u.addEventListener("load",p),u.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return s.then(a=>{for(const o of a||[])o.status==="rejected"&&r(o.reason);return e().catch(r)})};function ml({baseUrl:i,onJump:e}){const t=document.getElementById("sectionSearch"),n=document.getElementById("sectionResults"),s=document.getElementById("outlineCount");let r=[],a=null;const o=c=>{const h=document.createElement("button");h.type="button",h.className="outline-entry outline-entry-"+c.level,h.title="Go to PDF page "+c.page;const d=document.createElement("span");d.className="outline-entry-label";const u=document.createElement("strong");if(u.textContent=c.title,d.appendChild(u),c.level>=2&&c.section){const x=document.createElement("small");x.textContent=c.section,d.appendChild(x)}const p=document.createElement("span");return p.className="outline-page",p.textContent=c.page,h.append(d,p),h.addEventListener("click",()=>e(c.page)),h};function l(){const c=t.value.trim().toLocaleLowerCase();n.replaceChildren();let h;if(!c)h=r.filter(u=>u.level===1);else{const u=c.split(/\s+/).filter(Boolean);h=r.filter(p=>{const x=(p.title+" "+p.section).toLocaleLowerCase();return u.every(g=>x.includes(g))}),h.sort((p,x)=>{const g=p.title.toLowerCase(),m=x.title.toLowerCase(),f=M=>M===c?0:M.startsWith(c)?1:M.includes(c)?2:3;return f(g)-f(m)||p.level-x.level||p.page-x.page})}const d=Math.min(c?18:24,h.length);for(const u of h.slice(0,d))n.append(o(u));if(!d){const u=document.createElement("div");u.className="outline-empty",u.textContent=c?"No matching headings in this manuscript.":"No PDF bookmarks found.",n.append(u)}s.textContent=c?h.length.toLocaleString()+" results":r.length.toLocaleString()+" bookmarks"}return t.addEventListener("input",()=>{window.clearTimeout(a),a=window.setTimeout(l,90)}),s.textContent="Loading manuscript outline…",fetch(i+"outline.json").then(c=>{if(!c.ok)throw new Error("Could not fetch outline");return c.json()}).then(c=>{r=Array.isArray(c.items)?c.items:[],l()}).catch(c=>{console.warn("Index unavailable",c),s.textContent="Index not available"}),{render:l,clear:()=>{t.value="",l()}}}function xl({getDocument:i,getPageCount:e,onNavigate:t}){const n=document.getElementById("inspector"),s=document.getElementById("inspectorCanvas"),r=document.getElementById("inspectorScroll"),a=document.getElementById("inspectorPage"),o=document.getElementById("inspectorTotal"),l=document.getElementById("inspectorStatus"),c=document.getElementById("inspectorPrev"),h=document.getElementById("inspectorNext"),d=document.getElementById("inspectorZoomOut"),u=document.getElementById("inspectorZoomIn"),p=document.getElementById("inspectorZoomLabel");let x=1,g=1,m=0,f=null;function M(){return Math.max(1,e())}function y(){return!n.hidden}function w(){a.value=x,a.max=M(),o.textContent="/ "+M().toLocaleString(),c.disabled=x<=1,h.disabled=x>=M(),p.textContent=Math.round(g*100)+"%"}function P(A){g=Math.min(2.5,Math.max(.65,A));const B=Math.max(280,Math.min(720,window.innerWidth-36));s.style.width=Math.round(B*g)+"px",s.style.maxWidth="none",s.style.height="auto",w()}function E(A){return Math.min(M(),Math.max(1,Math.floor(Number(A)||1)))}async function C(){const A=++m;l.textContent="Rendering page…";try{const z=await(await i()).getPage(x),W=z.getViewport({scale:1}),q=window.innerWidth<720?1050:1440,H=Math.min(2.7,q/W.width),ee=z.getViewport({scale:H}),V=document.createElement("canvas");V.width=Math.max(1,Math.ceil(ee.width)),V.height=Math.max(1,Math.ceil(ee.height));const ne=V.getContext("2d",{alpha:!1});if(ne.fillStyle="#fff",ne.fillRect(0,0,V.width,V.height),await z.render({canvasContext:ne,viewport:ee}).promise,z.cleanup(),A!==m)return;s.width=V.width,s.height=V.height,s.getContext("2d",{alpha:!1}).drawImage(V,0,0),l.textContent="Page "+x+" · full-resolution preview",w(),r.scrollTop=0,r.scrollLeft=0}catch(B){A===m&&(l.textContent="Page could not be rendered."),console.warn("PDF inspection failed",B)}}function U(A,B=!0){x=E(A),w(),B&&t(x,{fromInspector:!0}),y()&&C()}function S(A){y()||(f=document.activeElement),n.hidden=!1,document.body.classList.add("inspector-open"),x=E(A),w(),P(1),a.focus(),C()}function b(){y()&&(n.hidden=!0,document.body.classList.remove("inspector-open"),m++,f&&f.isConnected&&f.focus())}return document.getElementById("inspectorClose").addEventListener("click",b),c.addEventListener("click",()=>U(x-1)),h.addEventListener("click",()=>U(x+1)),a.addEventListener("change",()=>U(a.value)),a.addEventListener("keydown",A=>{A.key==="Enter"&&(A.preventDefault(),U(a.value),a.blur())}),d.addEventListener("click",()=>P(g-.25)),u.addEventListener("click",()=>P(g+.25)),n.addEventListener("click",A=>{A.target===n&&b()}),n.addEventListener("keydown",A=>{A.key==="Escape"&&(A.preventDefault(),A.stopPropagation(),b()),!(A.target===a||A.target.tagName==="INPUT")&&(A.key==="ArrowRight"&&(A.preventDefault(),U(x+1)),A.key==="ArrowLeft"&&(A.preventDefault(),U(x-1)))}),{open:S,close:b,visible:y,go:U,activePage:()=>x}}const _o="181",ci={ROTATE:0,DOLLY:1,PAN:2},gl=0,$o=1,_l=2,lc=1,hc=2,On=3,_n=0,Ot=1,mt=2,Wn=0,es=1,Jo=2,Qo=3,e0=4,vl=5,bi=100,Ml=101,bl=102,Sl=103,yl=104,El=200,Tl=201,wl=202,Al=203,Aa=204,Ca=205,Cl=206,Rl=207,Pl=208,Ll=209,Dl=210,Ul=211,Il=212,Nl=213,Fl=214,Ra=0,Pa=1,La=2,ns=3,Da=4,Ua=5,Ia=6,Na=7,uc=0,Ol=1,Bl=2,li=0,kl=1,zl=2,Vl=3,fc=4,Gl=5,Hl=6,Wl=7,dc=300,is=301,ss=302,Fa=303,Oa=304,Ir=306,rs=1e3,Gn=1001,Ba=1002,qt=1003,Xl=1004,Hs=1005,sn=1006,Xr=1007,Ei=1008,An=1009,pc=1010,mc=1011,Rs=1012,vo=1013,wi=1014,Hn=1015,hs=1016,Mo=1017,bo=1018,Ps=1020,xc=35902,gc=35899,_c=1021,vc=1022,xn=1023,Ls=1026,Ds=1027,Mc=1028,So=1029,yo=1030,Eo=1031,To=1033,gr=33776,_r=33777,vr=33778,Mr=33779,ka=35840,za=35841,Va=35842,Ga=35843,Ha=36196,Wa=37492,Xa=37496,qa=37808,Ya=37809,Za=37810,ja=37811,Ka=37812,$a=37813,Ja=37814,Qa=37815,eo=37816,to=37817,no=37818,io=37819,so=37820,ro=37821,ao=36492,oo=36494,co=36495,lo=36283,ho=36284,uo=36285,fo=36286,ql=3200,Yl=3201,bc=0,Zl=1,ni="",Ct="srgb",as="srgb-linear",Ar="linear",Je="srgb",Ni=7680,t0=519,jl=512,Kl=513,$l=514,Sc=515,Jl=516,Ql=517,eh=518,th=519,n0=35044,i0="300 es",En=2e3,Cr=2001;function yc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function Rr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function nh(){const i=Rr("canvas");return i.style.display="block",i}const s0={};function r0(...i){const e="THREE."+i.shift();console.log(e,...i)}function Le(...i){const e="THREE."+i.shift();console.warn(e,...i)}function xt(...i){const e="THREE."+i.shift();console.error(e,...i)}function Us(...i){const e=i.join(" ");e in s0||(s0[e]=!0,Le(...i))}function ih(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class Di{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Pt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let a0=1234567;const Ts=Math.PI/180,Is=180/Math.PI;function us(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Pt[i&255]+Pt[i>>8&255]+Pt[i>>16&255]+Pt[i>>24&255]+"-"+Pt[e&255]+Pt[e>>8&255]+"-"+Pt[e>>16&15|64]+Pt[e>>24&255]+"-"+Pt[t&63|128]+Pt[t>>8&255]+"-"+Pt[t>>16&255]+Pt[t>>24&255]+Pt[n&255]+Pt[n>>8&255]+Pt[n>>16&255]+Pt[n>>24&255]).toLowerCase()}function We(i,e,t){return Math.max(e,Math.min(t,i))}function wo(i,e){return(i%e+e)%e}function sh(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function rh(i,e,t){return i!==e?(t-i)/(e-i):0}function ws(i,e,t){return(1-t)*i+t*e}function ah(i,e,t,n){return ws(i,e,1-Math.exp(-t*n))}function oh(i,e=1){return e-Math.abs(wo(i,e*2)-e)}function ch(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function lh(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function hh(i,e){return i+Math.floor(Math.random()*(e-i+1))}function uh(i,e){return i+Math.random()*(e-i)}function fh(i){return i*(.5-Math.random())}function dh(i){i!==void 0&&(a0=i);let e=a0+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function ph(i){return i*Ts}function mh(i){return i*Is}function xh(i){return(i&i-1)===0&&i!==0}function gh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function _h(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function vh(i,e,t,n,s){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),d=r((e-n)/2),u=a((e-n)/2),p=r((n-e)/2),x=a((n-e)/2);switch(s){case"XYX":i.set(o*h,l*d,l*u,o*c);break;case"YZY":i.set(l*u,o*h,l*d,o*c);break;case"ZXZ":i.set(l*d,l*u,o*h,o*c);break;case"XZX":i.set(o*h,l*x,l*p,o*c);break;case"YXY":i.set(l*p,o*h,l*x,o*c);break;case"ZYZ":i.set(l*x,l*p,o*h,o*c);break;default:Le("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function $i(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Nt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const os={DEG2RAD:Ts,RAD2DEG:Is,generateUUID:us,clamp:We,euclideanModulo:wo,mapLinear:sh,inverseLerp:rh,lerp:ws,damp:ah,pingpong:oh,smoothstep:ch,smootherstep:lh,randInt:hh,randFloat:uh,randFloatSpread:fh,seededRandom:dh,degToRad:ph,radToDeg:mh,isPowerOfTwo:xh,ceilPowerOfTwo:gh,floorPowerOfTwo:_h,setQuaternionFromProperEuler:vh,normalize:Nt,denormalize:$i};class Fe{constructor(e=0,t=0){Fe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*s+e.x,this.y=r*s+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class fs{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,a,o){let l=n[s+0],c=n[s+1],h=n[s+2],d=n[s+3],u=r[a+0],p=r[a+1],x=r[a+2],g=r[a+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o>=1){e[t+0]=u,e[t+1]=p,e[t+2]=x,e[t+3]=g;return}if(d!==g||l!==u||c!==p||h!==x){let m=l*u+c*p+h*x+d*g;m<0&&(u=-u,p=-p,x=-x,g=-g,m=-m);let f=1-o;if(m<.9995){const M=Math.acos(m),y=Math.sin(M);f=Math.sin(f*M)/y,o=Math.sin(o*M)/y,l=l*f+u*o,c=c*f+p*o,h=h*f+x*o,d=d*f+g*o}else{l=l*f+u*o,c=c*f+p*o,h=h*f+x*o,d=d*f+g*o;const M=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=M,c*=M,h*=M,d*=M}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,a){const o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],d=r[a],u=r[a+1],p=r[a+2],x=r[a+3];return e[t]=o*x+h*d+l*p-c*u,e[t+1]=l*x+h*u+c*d-o*p,e[t+2]=c*x+h*p+o*u-l*d,e[t+3]=h*x-o*d-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),d=o(r/2),u=l(n/2),p=l(s/2),x=l(r/2);switch(a){case"XYZ":this._x=u*h*d+c*p*x,this._y=c*p*d-u*h*x,this._z=c*h*x+u*p*d,this._w=c*h*d-u*p*x;break;case"YXZ":this._x=u*h*d+c*p*x,this._y=c*p*d-u*h*x,this._z=c*h*x-u*p*d,this._w=c*h*d+u*p*x;break;case"ZXY":this._x=u*h*d-c*p*x,this._y=c*p*d+u*h*x,this._z=c*h*x+u*p*d,this._w=c*h*d-u*p*x;break;case"ZYX":this._x=u*h*d-c*p*x,this._y=c*p*d+u*h*x,this._z=c*h*x-u*p*d,this._w=c*h*d+u*p*x;break;case"YZX":this._x=u*h*d+c*p*x,this._y=c*p*d+u*h*x,this._z=c*h*x-u*p*d,this._w=c*h*d-u*p*x;break;case"XZY":this._x=u*h*d-c*p*x,this._y=c*p*d-u*h*x,this._z=c*h*x+u*p*d,this._w=c*h*d+u*p*x;break;default:Le("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=n+o+d;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(r-c)*p,this._z=(a-s)*p}else if(n>o&&n>d){const p=2*Math.sqrt(1+n-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(s+a)/p,this._z=(r+c)/p}else if(o>d){const p=2*Math.sqrt(1+o-n-d);this._w=(r-c)/p,this._x=(s+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+d-n-o);this._w=(a-s)/p,this._x=(r+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-s*o,this._w=a*h-n*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,s=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,s=-s,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+s*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,n=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(o0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(o0.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*n),h=2*(o*t-r*s),d=2*(r*n-a*t);return this.x=t+l*c+a*d-o*h,this.y=n+l*h+o*c-r*d,this.z=s+l*d+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return qr.copy(this).projectOnVector(e),this.sub(qr)}reflect(e){return this.sub(qr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(We(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qr=new F,o0=new fs;class Ne{constructor(e,t,n,s,r,a,o,l,c){Ne.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c)}set(e,t,n,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],p=n[5],x=n[8],g=s[0],m=s[3],f=s[6],M=s[1],y=s[4],w=s[7],P=s[2],E=s[5],C=s[8];return r[0]=a*g+o*M+l*P,r[3]=a*m+o*y+l*E,r[6]=a*f+o*w+l*C,r[1]=c*g+h*M+d*P,r[4]=c*m+h*y+d*E,r[7]=c*f+h*w+d*C,r[2]=u*g+p*M+x*P,r[5]=u*m+p*y+x*E,r[8]=u*f+p*w+x*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*r,p=c*r-a*l,x=t*d+n*u+s*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/x;return e[0]=d*g,e[1]=(s*c-h*n)*g,e[2]=(o*n-s*a)*g,e[3]=u*g,e[4]=(h*t-s*l)*g,e[5]=(s*r-o*t)*g,e[6]=p*g,e[7]=(n*l-c*t)*g,e[8]=(a*t-n*r)*g,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Yr.makeScale(e,t)),this}rotate(e){return this.premultiply(Yr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Yr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Yr=new Ne,c0=new Ne().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),l0=new Ne().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Mh(){const i={enabled:!0,workingColorSpace:as,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===Je&&(s.r=Xn(s.r),s.g=Xn(s.g),s.b=Xn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===Je&&(s.r=ts(s.r),s.g=ts(s.g),s.b=ts(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===ni?Ar:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Us("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Us("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[as]:{primaries:e,whitePoint:n,transfer:Ar,toXYZ:c0,fromXYZ:l0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Ct},outputColorSpaceConfig:{drawingBufferColorSpace:Ct}},[Ct]:{primaries:e,whitePoint:n,transfer:Je,toXYZ:c0,fromXYZ:l0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Ct}}}),i}const Ye=Mh();function Xn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ts(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Fi;class bh{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Fi===void 0&&(Fi=Rr("canvas")),Fi.width=e.width,Fi.height=e.height;const s=Fi.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=Fi}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Xn(r[a]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Xn(t[n]/255)*255):t[n]=Xn(t[n]);return{data:t,width:e.width,height:e.height}}else return Le("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Sh=0;class Ao{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Sh++}),this.uuid=us(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Zr(s[a].image)):r.push(Zr(s[a]))}else r=Zr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Zr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?bh.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Le("Texture: Unable to serialize Texture."),{})}let yh=0;const jr=new F;class yt extends Di{constructor(e=yt.DEFAULT_IMAGE,t=yt.DEFAULT_MAPPING,n=Gn,s=Gn,r=sn,a=Ei,o=xn,l=An,c=yt.DEFAULT_ANISOTROPY,h=ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:yh++}),this.uuid=us(),this.name="",this.source=new Ao(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ne,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(jr).x}get height(){return this.source.getSize(jr).y}get depth(){return this.source.getSize(jr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Le(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Le(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==dc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case rs:e.x=e.x-Math.floor(e.x);break;case Gn:e.x=e.x<0?0:1;break;case Ba:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case rs:e.y=e.y-Math.floor(e.y);break;case Gn:e.y=e.y<0?0:1;break;case Ba:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yt.DEFAULT_IMAGE=null;yt.DEFAULT_MAPPING=dc;yt.DEFAULT_ANISOTROPY=1;class gt{constructor(e=0,t=0,n=0,s=1){gt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],h=l[4],d=l[8],u=l[1],p=l[5],x=l[9],g=l[2],m=l[6],f=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-g)<.01&&Math.abs(x-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+g)<.1&&Math.abs(x+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,w=(p+1)/2,P=(f+1)/2,E=(h+u)/4,C=(d+g)/4,U=(x+m)/4;return y>w&&y>P?y<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(y),s=E/n,r=C/n):w>P?w<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(w),n=E/s,r=U/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=C/r,s=U/r),this.set(n,s,r,t),this}let M=Math.sqrt((m-x)*(m-x)+(d-g)*(d-g)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(m-x)/M,this.y=(d-g)/M,this.z=(u-h)/M,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=We(this.x,e.x,t.x),this.y=We(this.y,e.y,t.y),this.z=We(this.z,e.z,t.z),this.w=We(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=We(this.x,e,t),this.y=We(this.y,e,t),this.z=We(this.z,e,t),this.w=We(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(We(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Eh extends Di{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new gt(0,0,e,t),this.scissorTest=!1,this.viewport=new gt(0,0,e,t);const s={width:e,height:t,depth:n.depth},r=new yt(s);this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:sn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ao(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ai extends Eh{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ec extends yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=qt,this.minFilter=qt,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Th extends yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=qt,this.minFilter=qt,this.wrapR=Gn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ks{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,cn):cn.fromBufferAttribute(r,a),cn.applyMatrix4(e.matrixWorld),this.expandByPoint(cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ws.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ws.copy(n.boundingBox)),Ws.applyMatrix4(e.matrixWorld),this.union(Ws)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,cn),cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(xs),Xs.subVectors(this.max,xs),Oi.subVectors(e.a,xs),Bi.subVectors(e.b,xs),ki.subVectors(e.c,xs),Zn.subVectors(Bi,Oi),jn.subVectors(ki,Bi),pi.subVectors(Oi,ki);let t=[0,-Zn.z,Zn.y,0,-jn.z,jn.y,0,-pi.z,pi.y,Zn.z,0,-Zn.x,jn.z,0,-jn.x,pi.z,0,-pi.x,-Zn.y,Zn.x,0,-jn.y,jn.x,0,-pi.y,pi.x,0];return!Kr(t,Oi,Bi,ki,Xs)||(t=[1,0,0,0,1,0,0,0,1],!Kr(t,Oi,Bi,ki,Xs))?!1:(qs.crossVectors(Zn,jn),t=[qs.x,qs.y,qs.z],Kr(t,Oi,Bi,ki,Xs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Pn=[new F,new F,new F,new F,new F,new F,new F,new F],cn=new F,Ws=new ks,Oi=new F,Bi=new F,ki=new F,Zn=new F,jn=new F,pi=new F,xs=new F,Xs=new F,qs=new F,mi=new F;function Kr(i,e,t,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){mi.fromArray(i,r);const o=s.x*Math.abs(mi.x)+s.y*Math.abs(mi.y)+s.z*Math.abs(mi.z),l=e.dot(mi),c=t.dot(mi),h=n.dot(mi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const wh=new ks,gs=new F,$r=new F;class Nr{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):wh.setFromPoints(e).getCenter(n);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;gs.subVectors(e,this.center);const t=gs.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(gs,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($r.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(gs.copy(e.center).add($r)),this.expandByPoint(gs.copy(e.center).sub($r))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ln=new F,Jr=new F,Ys=new F,Kn=new F,Qr=new F,Zs=new F,ea=new F;class Co{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ln.copy(this.origin).addScaledVector(this.direction,t),Ln.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Jr.copy(e).add(t).multiplyScalar(.5),Ys.copy(t).sub(e).normalize(),Kn.copy(this.origin).sub(Jr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ys),o=Kn.dot(this.direction),l=-Kn.dot(Ys),c=Kn.lengthSq(),h=Math.abs(1-a*a);let d,u,p,x;if(h>0)if(d=a*l-o,u=a*o-l,x=r*h,d>=0)if(u>=-x)if(u<=x){const g=1/h;d*=g,u*=g,p=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u<=-x?(d=Math.max(0,-(-a*r+o)),u=d>0?-r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c):u<=x?(d=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(d=Math.max(0,-(a*r+o)),u=d>0?r:Math.min(Math.max(-r,-l),r),p=-d*d+u*(u+2*l)+c);else u=a>0?-r:r,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(Jr).addScaledVector(Ys,u),p}intersectSphere(e,t){Ln.subVectors(e.center,this.origin);const n=Ln.dot(this.direction),s=Ln.dot(Ln)-n*n,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,s=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,s=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,Ln)!==null}intersectTriangle(e,t,n,s,r){Qr.subVectors(t,e),Zs.subVectors(n,e),ea.crossVectors(Qr,Zs);let a=this.direction.dot(ea),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Kn.subVectors(this.origin,e);const l=o*this.direction.dot(Zs.crossVectors(Kn,Zs));if(l<0)return null;const c=o*this.direction.dot(Qr.cross(Kn));if(c<0||l+c>a)return null;const h=-o*Kn.dot(ea);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ft{constructor(e,t,n,s,r,a,o,l,c,h,d,u,p,x,g,m){ft.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,a,o,l,c,h,d,u,p,x,g,m)}set(e,t,n,s,r,a,o,l,c,h,d,u,p,x,g,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=h,f[10]=d,f[14]=u,f[3]=p,f[7]=x,f[11]=g,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ft().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/zi.setFromMatrixColumn(e,0).length(),r=1/zi.setFromMatrixColumn(e,1).length(),a=1/zi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=a*h,p=a*d,x=o*h,g=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=p+x*c,t[5]=u-g*c,t[9]=-o*l,t[2]=g-u*c,t[6]=x+p*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,p=l*d,x=c*h,g=c*d;t[0]=u+g*o,t[4]=x*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=p*o-x,t[6]=g+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,p=l*d,x=c*h,g=c*d;t[0]=u-g*o,t[4]=-a*d,t[8]=x+p*o,t[1]=p+x*o,t[5]=a*h,t[9]=g-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,p=a*d,x=o*h,g=o*d;t[0]=l*h,t[4]=x*c-p,t[8]=u*c+g,t[1]=l*d,t[5]=g*c+u,t[9]=p*c-x,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,p=a*c,x=o*l,g=o*c;t[0]=l*h,t[4]=g-u*d,t[8]=x*d+p,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*d+x,t[10]=u-g*d}else if(e.order==="XZY"){const u=a*l,p=a*c,x=o*l,g=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+g,t[5]=a*h,t[9]=p*d-x,t[2]=x*d-p,t[6]=o*h,t[10]=g*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ah,e,Ch)}lookAt(e,t,n){const s=this.elements;return Ht.subVectors(e,t),Ht.lengthSq()===0&&(Ht.z=1),Ht.normalize(),$n.crossVectors(n,Ht),$n.lengthSq()===0&&(Math.abs(n.z)===1?Ht.x+=1e-4:Ht.z+=1e-4,Ht.normalize(),$n.crossVectors(n,Ht)),$n.normalize(),js.crossVectors(Ht,$n),s[0]=$n.x,s[4]=js.x,s[8]=Ht.x,s[1]=$n.y,s[5]=js.y,s[9]=Ht.y,s[2]=$n.z,s[6]=js.z,s[10]=Ht.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],p=n[13],x=n[2],g=n[6],m=n[10],f=n[14],M=n[3],y=n[7],w=n[11],P=n[15],E=s[0],C=s[4],U=s[8],S=s[12],b=s[1],A=s[5],B=s[9],z=s[13],W=s[2],q=s[6],H=s[10],ee=s[14],V=s[3],ne=s[7],ie=s[11],ve=s[15];return r[0]=a*E+o*b+l*W+c*V,r[4]=a*C+o*A+l*q+c*ne,r[8]=a*U+o*B+l*H+c*ie,r[12]=a*S+o*z+l*ee+c*ve,r[1]=h*E+d*b+u*W+p*V,r[5]=h*C+d*A+u*q+p*ne,r[9]=h*U+d*B+u*H+p*ie,r[13]=h*S+d*z+u*ee+p*ve,r[2]=x*E+g*b+m*W+f*V,r[6]=x*C+g*A+m*q+f*ne,r[10]=x*U+g*B+m*H+f*ie,r[14]=x*S+g*z+m*ee+f*ve,r[3]=M*E+y*b+w*W+P*V,r[7]=M*C+y*A+w*q+P*ne,r[11]=M*U+y*B+w*H+P*ie,r[15]=M*S+y*z+w*ee+P*ve,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],p=e[14],x=e[3],g=e[7],m=e[11],f=e[15];return x*(+r*l*d-s*c*d-r*o*u+n*c*u+s*o*p-n*l*p)+g*(+t*l*p-t*c*u+r*a*u-s*a*p+s*c*h-r*l*h)+m*(+t*c*d-t*o*p-r*a*d+n*a*p+r*o*h-n*c*h)+f*(-s*o*h-t*l*d+t*o*u+s*a*d-n*a*u+n*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],p=e[11],x=e[12],g=e[13],m=e[14],f=e[15],M=d*m*c-g*u*c+g*l*p-o*m*p-d*l*f+o*u*f,y=x*u*c-h*m*c-x*l*p+a*m*p+h*l*f-a*u*f,w=h*g*c-x*d*c+x*o*p-a*g*p-h*o*f+a*d*f,P=x*d*l-h*g*l-x*o*u+a*g*u+h*o*m-a*d*m,E=t*M+n*y+s*w+r*P;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/E;return e[0]=M*C,e[1]=(g*u*r-d*m*r-g*s*p+n*m*p+d*s*f-n*u*f)*C,e[2]=(o*m*r-g*l*r+g*s*c-n*m*c-o*s*f+n*l*f)*C,e[3]=(d*l*r-o*u*r-d*s*c+n*u*c+o*s*p-n*l*p)*C,e[4]=y*C,e[5]=(h*m*r-x*u*r+x*s*p-t*m*p-h*s*f+t*u*f)*C,e[6]=(x*l*r-a*m*r-x*s*c+t*m*c+a*s*f-t*l*f)*C,e[7]=(a*u*r-h*l*r+h*s*c-t*u*c-a*s*p+t*l*p)*C,e[8]=w*C,e[9]=(x*d*r-h*g*r-x*n*p+t*g*p+h*n*f-t*d*f)*C,e[10]=(a*g*r-x*o*r+x*n*c-t*g*c-a*n*f+t*o*f)*C,e[11]=(h*o*r-a*d*r-h*n*c+t*d*c+a*n*p-t*o*p)*C,e[12]=P*C,e[13]=(h*g*s-x*d*s+x*n*u-t*g*u-h*n*m+t*d*m)*C,e[14]=(x*o*s-a*g*s-x*n*l+t*g*l+a*n*m-t*o*m)*C,e[15]=(a*d*s-h*o*s+h*n*l-t*d*l-a*n*u+t*o*u)*C,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,a){return this.set(1,n,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,d=o+o,u=r*c,p=r*h,x=r*d,g=a*h,m=a*d,f=o*d,M=l*c,y=l*h,w=l*d,P=n.x,E=n.y,C=n.z;return s[0]=(1-(g+f))*P,s[1]=(p+w)*P,s[2]=(x-y)*P,s[3]=0,s[4]=(p-w)*E,s[5]=(1-(u+f))*E,s[6]=(m+M)*E,s[7]=0,s[8]=(x+y)*C,s[9]=(m-M)*C,s[10]=(1-(u+g))*C,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=zi.set(s[0],s[1],s[2]).length();const a=zi.set(s[4],s[5],s[6]).length(),o=zi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],ln.copy(this);const c=1/r,h=1/a,d=1/o;return ln.elements[0]*=c,ln.elements[1]*=c,ln.elements[2]*=c,ln.elements[4]*=h,ln.elements[5]*=h,ln.elements[6]*=h,ln.elements[8]*=d,ln.elements[9]*=d,ln.elements[10]*=d,t.setFromRotationMatrix(ln),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,s,r,a,o=En,l=!1){const c=this.elements,h=2*r/(t-e),d=2*r/(n-s),u=(t+e)/(t-e),p=(n+s)/(n-s);let x,g;if(l)x=r/(a-r),g=a*r/(a-r);else if(o===En)x=-(a+r)/(a-r),g=-2*a*r/(a-r);else if(o===Cr)x=-a/(a-r),g=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,a,o=En,l=!1){const c=this.elements,h=2/(t-e),d=2/(n-s),u=-(t+e)/(t-e),p=-(n+s)/(n-s);let x,g;if(l)x=1/(a-r),g=a/(a-r);else if(o===En)x=-2/(a-r),g=-(a+r)/(a-r);else if(o===Cr)x=-1/(a-r),g=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=x,c[14]=g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const zi=new F,ln=new ft,Ah=new F(0,0,0),Ch=new F(1,1,1),$n=new F,js=new F,Ht=new F,h0=new ft,u0=new fs;class Cn{constructor(e=0,t=0,n=0,s=Cn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],d=s[2],u=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-We(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:Le("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return h0.makeRotationFromQuaternion(e),this.setFromRotationMatrix(h0,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return u0.setFromEuler(this),this.setFromQuaternion(u0,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Cn.DEFAULT_ORDER="XYZ";class Ro{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Rh=0;const f0=new F,Vi=new fs,Dn=new ft,Ks=new F,_s=new F,Ph=new F,Lh=new fs,d0=new F(1,0,0),p0=new F(0,1,0),m0=new F(0,0,1),x0={type:"added"},Dh={type:"removed"},Gi={type:"childadded",child:null},ta={type:"childremoved",child:null};class Et extends Di{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Rh++}),this.uuid=us(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new F,t=new Cn,n=new fs,s=new F(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ft},normalMatrix:{value:new Ne}}),this.matrix=new ft,this.matrixWorld=new ft,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ro,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.multiply(Vi),this}rotateOnWorldAxis(e,t){return Vi.setFromAxisAngle(e,t),this.quaternion.premultiply(Vi),this}rotateX(e){return this.rotateOnAxis(d0,e)}rotateY(e){return this.rotateOnAxis(p0,e)}rotateZ(e){return this.rotateOnAxis(m0,e)}translateOnAxis(e,t){return f0.copy(e).applyQuaternion(this.quaternion),this.position.add(f0.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(d0,e)}translateY(e){return this.translateOnAxis(p0,e)}translateZ(e){return this.translateOnAxis(m0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ks.copy(e):Ks.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),_s.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(_s,Ks,this.up):Dn.lookAt(Ks,_s,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Vi.setFromRotationMatrix(Dn),this.quaternion.premultiply(Vi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(xt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(x0),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null):xt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Dh),ta.child=e,this.dispatchEvent(ta),ta.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(x0),Gi.child=e,this.dispatchEvent(Gi),Gi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,e,Ph),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(_s,Lh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];r(e.shapes,d)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),p=a(e.animations),x=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),x.length>0&&(n.nodes=x)}return n.object=s,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}Et.DEFAULT_UP=new F(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new F,Un=new F,na=new F,In=new F,Hi=new F,Wi=new F,g0=new F,ia=new F,sa=new F,ra=new F,aa=new gt,oa=new gt,ca=new gt;class mn{constructor(e=new F,t=new F,n=new F){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),hn.subVectors(e,t),s.cross(hn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){hn.subVectors(s,t),Un.subVectors(n,t),na.subVectors(e,t);const a=hn.dot(hn),o=hn.dot(Un),l=hn.dot(na),c=Un.dot(Un),h=Un.dot(na),d=a*c-o*o;if(d===0)return r.set(0,0,0),null;const u=1/d,p=(c*l-o*h)*u,x=(a*h-o*l)*u;return r.set(1-p-x,x,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(e,t,n,s,r,a,o,l){return this.getBarycoord(e,t,n,s,In)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,In.x),l.addScaledVector(a,In.y),l.addScaledVector(o,In.z),l)}static getInterpolatedAttribute(e,t,n,s,r,a){return aa.setScalar(0),oa.setScalar(0),ca.setScalar(0),aa.fromBufferAttribute(e,t),oa.fromBufferAttribute(e,n),ca.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(aa,r.x),a.addScaledVector(oa,r.y),a.addScaledVector(ca,r.z),a}static isFrontFacing(e,t,n,s){return hn.subVectors(n,t),Un.subVectors(e,t),hn.cross(Un).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hn.subVectors(this.c,this.b),Un.subVectors(this.a,this.b),hn.cross(Un).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return mn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return mn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return mn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return mn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return mn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let a,o;Hi.subVectors(s,n),Wi.subVectors(r,n),ia.subVectors(e,n);const l=Hi.dot(ia),c=Wi.dot(ia);if(l<=0&&c<=0)return t.copy(n);sa.subVectors(e,s);const h=Hi.dot(sa),d=Wi.dot(sa);if(h>=0&&d<=h)return t.copy(s);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(Hi,a);ra.subVectors(e,r);const p=Hi.dot(ra),x=Wi.dot(ra);if(x>=0&&p<=x)return t.copy(r);const g=p*c-l*x;if(g<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(Wi,o);const m=h*x-p*d;if(m<=0&&d-h>=0&&p-x>=0)return g0.subVectors(r,s),o=(d-h)/(d-h+(p-x)),t.copy(s).addScaledVector(g0,o);const f=1/(m+g+u);return a=g*f,o=u*f,t.copy(n).addScaledVector(Hi,a).addScaledVector(Wi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Tc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},$s={h:0,s:0,l:0};function la(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ct){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ye.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=Ye.workingColorSpace){return this.r=e,this.g=t,this.b=n,Ye.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=Ye.workingColorSpace){if(e=wo(e,1),t=We(t,0,1),n=We(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=la(a,r,e+1/3),this.g=la(a,r,e),this.b=la(a,r,e-1/3)}return Ye.colorSpaceToWorking(this,s),this}setStyle(e,t=Ct){function n(r){r!==void 0&&parseFloat(r)<1&&Le("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Le("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);Le("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ct){const n=Tc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Le("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Xn(e.r),this.g=Xn(e.g),this.b=Xn(e.b),this}copyLinearToSRGB(e){return this.r=ts(e.r),this.g=ts(e.g),this.b=ts(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ct){return Ye.workingToColorSpace(Lt.copy(this),e),Math.round(We(Lt.r*255,0,255))*65536+Math.round(We(Lt.g*255,0,255))*256+Math.round(We(Lt.b*255,0,255))}getHexString(e=Ct){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ye.workingColorSpace){Ye.workingToColorSpace(Lt.copy(this),t);const n=Lt.r,s=Lt.g,r=Lt.b,a=Math.max(n,s,r),o=Math.min(n,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case n:l=(s-r)/d+(s<r?6:0);break;case s:l=(r-n)/d+2;break;case r:l=(n-s)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Ye.workingColorSpace){return Ye.workingToColorSpace(Lt.copy(this),t),e.r=Lt.r,e.g=Lt.g,e.b=Lt.b,e}getStyle(e=Ct){Ye.workingToColorSpace(Lt.copy(this),e);const t=Lt.r,n=Lt.g,s=Lt.b;return e!==Ct?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Jn),this.setHSL(Jn.h+e,Jn.s+t,Jn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Jn),e.getHSL($s);const n=ws(Jn.h,$s.h,t),s=ws(Jn.s,$s.s,t),r=ws(Jn.l,$s.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Lt=new Xe;Xe.NAMES=Tc;let Uh=0;class Ui extends Di{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uh++}),this.uuid=us(),this.name="",this.type="Material",this.blending=es,this.side=_n,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Aa,this.blendDst=Ca,this.blendEquation=bi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=t0,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ni,this.stencilZFail=Ni,this.stencilZPass=Ni,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Le(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Le(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==es&&(n.blending=this.blending),this.side!==_n&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Aa&&(n.blendSrc=this.blendSrc),this.blendDst!==Ca&&(n.blendDst=this.blendDst),this.blendEquation!==bi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ns&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==t0&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ni&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ni&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ni&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class cs extends Ui{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.combine=uc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const _t=new F,Js=new Fe;let Ih=0;class ut{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ih++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=n0,this.updateRanges=[],this.gpuType=Hn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Js.fromBufferAttribute(this,t),Js.applyMatrix3(e),this.setXY(t,Js.x,Js.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=$i(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Nt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$i(t,this.array)),t}setX(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$i(t,this.array)),t}setY(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$i(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$i(t,this.array)),t}setW(e,t){return this.normalized&&(t=Nt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Nt(t,this.array),n=Nt(n,this.array),s=Nt(s,this.array),r=Nt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==n0&&(e.usage=this.usage),e}}class wc extends ut{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Ac extends ut{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Yt extends ut{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Nh=0;const $t=new ft,ha=new Et,Xi=new F,Wt=new ks,vs=new ks,bt=new F;class Tt extends Di{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nh++}),this.uuid=us(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(yc(e)?Ac:wc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ne().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return $t.makeRotationFromQuaternion(e),this.applyMatrix4($t),this}rotateX(e){return $t.makeRotationX(e),this.applyMatrix4($t),this}rotateY(e){return $t.makeRotationY(e),this.applyMatrix4($t),this}rotateZ(e){return $t.makeRotationZ(e),this.applyMatrix4($t),this}translate(e,t,n){return $t.makeTranslation(e,t,n),this.applyMatrix4($t),this}scale(e,t,n){return $t.makeScale(e,t,n),this.applyMatrix4($t),this}lookAt(e){return ha.lookAt(e),ha.updateMatrix(),this.applyMatrix4(ha.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xi).negate(),this.translate(Xi.x,Xi.y,Xi.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Yt(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Le("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ks);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){xt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Wt.setFromBufferAttribute(r),this.morphTargetsRelative?(bt.addVectors(this.boundingBox.min,Wt.min),this.boundingBox.expandByPoint(bt),bt.addVectors(this.boundingBox.max,Wt.max),this.boundingBox.expandByPoint(bt)):(this.boundingBox.expandByPoint(Wt.min),this.boundingBox.expandByPoint(Wt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&xt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){xt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const n=this.boundingSphere.center;if(Wt.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];vs.setFromBufferAttribute(o),this.morphTargetsRelative?(bt.addVectors(Wt.min,vs.min),Wt.expandByPoint(bt),bt.addVectors(Wt.max,vs.max),Wt.expandByPoint(bt)):(Wt.expandByPoint(vs.min),Wt.expandByPoint(vs.max))}Wt.getCenter(n);let s=0;for(let r=0,a=e.count;r<a;r++)bt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(bt));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)bt.fromBufferAttribute(o,c),l&&(Xi.fromBufferAttribute(e,c),bt.add(Xi)),s=Math.max(s,n.distanceToSquared(bt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&xt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){xt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ut(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let U=0;U<n.count;U++)o[U]=new F,l[U]=new F;const c=new F,h=new F,d=new F,u=new Fe,p=new Fe,x=new Fe,g=new F,m=new F;function f(U,S,b){c.fromBufferAttribute(n,U),h.fromBufferAttribute(n,S),d.fromBufferAttribute(n,b),u.fromBufferAttribute(r,U),p.fromBufferAttribute(r,S),x.fromBufferAttribute(r,b),h.sub(c),d.sub(c),p.sub(u),x.sub(u);const A=1/(p.x*x.y-x.x*p.y);isFinite(A)&&(g.copy(h).multiplyScalar(x.y).addScaledVector(d,-p.y).multiplyScalar(A),m.copy(d).multiplyScalar(p.x).addScaledVector(h,-x.x).multiplyScalar(A),o[U].add(g),o[S].add(g),o[b].add(g),l[U].add(m),l[S].add(m),l[b].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let U=0,S=M.length;U<S;++U){const b=M[U],A=b.start,B=b.count;for(let z=A,W=A+B;z<W;z+=3)f(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const y=new F,w=new F,P=new F,E=new F;function C(U){P.fromBufferAttribute(s,U),E.copy(P);const S=o[U];y.copy(S),y.sub(P.multiplyScalar(P.dot(S))).normalize(),w.crossVectors(E,S);const A=w.dot(l[U])<0?-1:1;a.setXYZW(U,y.x,y.y,y.z,A)}for(let U=0,S=M.length;U<S;++U){const b=M[U],A=b.start,B=b.count;for(let z=A,W=A+B;z<W;z+=3)C(e.getX(z+0)),C(e.getX(z+1)),C(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new ut(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const s=new F,r=new F,a=new F,o=new F,l=new F,c=new F,h=new F,d=new F;if(e)for(let u=0,p=e.count;u<p;u+=3){const x=e.getX(u+0),g=e.getX(u+1),m=e.getX(u+2);s.fromBufferAttribute(t,x),r.fromBufferAttribute(t,g),a.fromBufferAttribute(t,m),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,g),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)bt.fromBufferAttribute(e,t),bt.normalize(),e.setXYZ(t,bt.x,bt.y,bt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let p=0,x=0;for(let g=0,m=l.length;g<m;g++){o.isInterleavedBufferAttribute?p=l[g]*o.data.stride+o.offset:p=l[g]*h;for(let f=0;f<h;f++)u[x++]=c[p++]}return new ut(u,h,d)}if(this.index===null)return Le("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Tt,n=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],p=e(u,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],d=r[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _0=new ft,xi=new Co,Qs=new Nr,v0=new F,er=new F,tr=new F,nr=new F,ua=new F,ir=new F,M0=new F,sr=new F;class jt extends Et{constructor(e=new Tt,t=new cs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){ir.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],d=r[l];h!==0&&(ua.fromBufferAttribute(d,e),a?ir.addScaledVector(ua,h):ir.addScaledVector(ua.sub(t),h))}t.add(ir)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(r),xi.copy(e.ray).recast(e.near),!(Qs.containsPoint(xi.origin)===!1&&(xi.intersectSphere(Qs,v0)===null||xi.origin.distanceToSquared(v0)>(e.far-e.near)**2))&&(_0.copy(r).invert(),xi.copy(e.ray).applyMatrix4(_0),!(n.boundingBox!==null&&xi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,xi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,g=u.length;x<g;x++){const m=u[x],f=a[m.materialIndex],M=Math.max(m.start,p.start),y=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,P=y;w<P;w+=3){const E=o.getX(w),C=o.getX(w+1),U=o.getX(w+2);s=rr(this,f,e,n,c,h,d,E,C,U),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),g=Math.min(o.count,p.start+p.count);for(let m=x,f=g;m<f;m+=3){const M=o.getX(m),y=o.getX(m+1),w=o.getX(m+2);s=rr(this,a,e,n,c,h,d,M,y,w),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let x=0,g=u.length;x<g;x++){const m=u[x],f=a[m.materialIndex],M=Math.max(m.start,p.start),y=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let w=M,P=y;w<P;w+=3){const E=w,C=w+1,U=w+2;s=rr(this,f,e,n,c,h,d,E,C,U),s&&(s.faceIndex=Math.floor(w/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const x=Math.max(0,p.start),g=Math.min(l.count,p.start+p.count);for(let m=x,f=g;m<f;m+=3){const M=m,y=m+1,w=m+2;s=rr(this,a,e,n,c,h,d,M,y,w),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Fh(i,e,t,n,s,r,a,o){let l;if(e.side===Ot?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,e.side===_n,o),l===null)return null;sr.copy(o),sr.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(sr);return c<t.near||c>t.far?null:{distance:c,point:sr.clone(),object:i}}function rr(i,e,t,n,s,r,a,o,l,c){i.getVertexPosition(o,er),i.getVertexPosition(l,tr),i.getVertexPosition(c,nr);const h=Fh(i,e,t,n,er,tr,nr,M0);if(h){const d=new F;mn.getBarycoord(M0,er,tr,nr,d),s&&(h.uv=mn.getInterpolatedAttribute(s,o,l,c,d,new Fe)),r&&(h.uv1=mn.getInterpolatedAttribute(r,o,l,c,d,new Fe)),a&&(h.normal=mn.getInterpolatedAttribute(a,o,l,c,d,new F),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new F,materialIndex:0};mn.getNormal(er,tr,nr,u.normal),h.face=u,h.barycoord=d}return h}class ds extends Tt{constructor(e=1,t=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,p=0;x("z","y","x",-1,-1,n,t,e,a,r,0),x("z","y","x",1,-1,n,t,-e,a,r,1),x("x","z","y",1,1,e,n,t,s,a,2),x("x","z","y",1,-1,e,n,-t,s,a,3),x("x","y","z",1,-1,e,t,n,s,r,4),x("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Yt(c,3)),this.setAttribute("normal",new Yt(h,3)),this.setAttribute("uv",new Yt(d,2));function x(g,m,f,M,y,w,P,E,C,U,S){const b=w/C,A=P/U,B=w/2,z=P/2,W=E/2,q=C+1,H=U+1;let ee=0,V=0;const ne=new F;for(let ie=0;ie<H;ie++){const ve=ie*A-z;for(let Be=0;Be<q;Be++){const Ze=Be*b-B;ne[g]=Ze*M,ne[m]=ve*y,ne[f]=W,c.push(ne.x,ne.y,ne.z),ne[g]=0,ne[m]=0,ne[f]=E>0?1:-1,h.push(ne.x,ne.y,ne.z),d.push(Be/C),d.push(1-ie/U),ee+=1}}for(let ie=0;ie<U;ie++)for(let ve=0;ve<C;ve++){const Be=u+ve+q*ie,Ze=u+ve+q*(ie+1),tt=u+(ve+1)+q*(ie+1),nt=u+(ve+1)+q*ie;l.push(Be,Ze,nt),l.push(Ze,tt,nt),V+=6}o.addGroup(p,V,S),p+=V,u+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ds(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ls(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(Le("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Ft(i){const e={};for(let t=0;t<i.length;t++){const n=ls(i[t]);for(const s in n)e[s]=n[s]}return e}function Oh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function Cc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ye.workingColorSpace}const Bh={clone:ls,merge:Ft};var kh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class qn extends Ui{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=kh,this.fragmentShader=zh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ls(e.uniforms),this.uniformsGroups=Oh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class Rc extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ft,this.projectionMatrix=new ft,this.projectionMatrixInverse=new ft,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Qn=new F,b0=new Fe,S0=new Fe;class tn extends Rc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Is*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ts*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Is*2*Math.atan(Math.tan(Ts*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z),Qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Qn.x,Qn.y).multiplyScalar(-e/Qn.z)}getViewSize(e,t){return this.getViewBounds(e,b0,S0),t.subVectors(S0,b0)}setViewOffset(e,t,n,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ts*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*n/c,s*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const qi=-90,Yi=1;class Vh extends Et{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new tn(qi,Yi,e,t);s.layers=this.layers,this.add(s);const r=new tn(qi,Yi,e,t);r.layers=this.layers,this.add(r);const a=new tn(qi,Yi,e,t);a.layers=this.layers,this.add(a);const o=new tn(qi,Yi,e,t);o.layers=this.layers,this.add(o);const l=new tn(qi,Yi,e,t);l.layers=this.layers,this.add(l);const c=new tn(qi,Yi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===En)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Cr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const g=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,a),e.setRenderTarget(n,2,s),e.render(t,o),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=g,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,u,p),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class Pc extends yt{constructor(e=[],t=is,n,s,r,a,o,l,c,h){super(e,t,n,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Gh extends Ai{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Pc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new ds(5,5,5),r=new qn({name:"CubemapFromEquirect",uniforms:ls(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ot,blending:Wn});r.uniforms.tEquirect.value=t;const a=new jt(s,r),o=t.minFilter;return t.minFilter===Ei&&(t.minFilter=sn),new Vh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,s);e.setRenderTarget(r)}}class Tn extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Hh={type:"move"};class fa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Tn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Tn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Tn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const g of e.hand.values()){const m=t.getJointPose(g,n),f=this._getHandJoint(c,g);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,x=.005;c.inputState.pinching&&u>p+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Hh)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Tn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class Wh extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Cn,this.environmentIntensity=1,this.environmentRotation=new Cn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Xh extends yt{constructor(e=null,t=1,n=1,s,r,a,o,l,c=qt,h=qt,d,u){super(null,a,o,l,c,h,s,r,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const da=new F,qh=new F,Yh=new Ne;class Mi{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=da.subVectors(n,t).cross(qh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(da),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Yh.getNormalMatrix(e),s=this.coplanarPoint(da).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const gi=new Nr,Zh=new Fe(.5,.5),ar=new F;class Po{constructor(e=new Mi,t=new Mi,n=new Mi,s=new Mi,r=new Mi,a=new Mi){this.planes=[e,t,n,s,r,a]}set(e,t,n,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=En,n=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],p=r[7],x=r[8],g=r[9],m=r[10],f=r[11],M=r[12],y=r[13],w=r[14],P=r[15];if(s[0].setComponents(c-a,p-h,f-x,P-M).normalize(),s[1].setComponents(c+a,p+h,f+x,P+M).normalize(),s[2].setComponents(c+o,p+d,f+g,P+y).normalize(),s[3].setComponents(c-o,p-d,f-g,P-y).normalize(),n)s[4].setComponents(l,u,m,w).normalize(),s[5].setComponents(c-l,p-u,f-m,P-w).normalize();else if(s[4].setComponents(c-l,p-u,f-m,P-w).normalize(),t===En)s[5].setComponents(c+l,p+u,f+m,P+w).normalize();else if(t===Cr)s[5].setComponents(l,u,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),gi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(gi)}intersectsSprite(e){gi.center.set(0,0,0);const t=Zh.distanceTo(e.center);return gi.radius=.7071067811865476+t,gi.applyMatrix4(e.matrixWorld),this.intersectsSphere(gi)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(ar.x=s.normal.x>0?e.max.x:e.min.x,ar.y=s.normal.y>0?e.max.y:e.min.y,ar.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(ar)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Lc extends Ui{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pr=new F,Lr=new F,y0=new ft,Ms=new Co,or=new Nr,pa=new F,E0=new F;class jh extends Et{constructor(e=new Tt,t=new Lc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Pr.fromBufferAttribute(t,s-1),Lr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Pr.distanceTo(Lr);e.setAttribute("lineDistance",new Yt(n,1))}else Le("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),or.copy(n.boundingSphere),or.applyMatrix4(s),or.radius+=r,e.ray.intersectsSphere(or)===!1)return;y0.copy(s).invert(),Ms.copy(e.ray).applyMatrix4(y0);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const p=Math.max(0,a.start),x=Math.min(h.count,a.start+a.count);for(let g=p,m=x-1;g<m;g+=c){const f=h.getX(g),M=h.getX(g+1),y=cr(this,e,Ms,l,f,M,g);y&&t.push(y)}if(this.isLineLoop){const g=h.getX(x-1),m=h.getX(p),f=cr(this,e,Ms,l,g,m,x-1);f&&t.push(f)}}else{const p=Math.max(0,a.start),x=Math.min(u.count,a.start+a.count);for(let g=p,m=x-1;g<m;g+=c){const f=cr(this,e,Ms,l,g,g+1,g);f&&t.push(f)}if(this.isLineLoop){const g=cr(this,e,Ms,l,x-1,p,x-1);g&&t.push(g)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function cr(i,e,t,n,s,r,a){const o=i.geometry.attributes.position;if(Pr.fromBufferAttribute(o,s),Lr.fromBufferAttribute(o,r),t.distanceSqToSegment(Pr,Lr,pa,E0)>n)return;pa.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(pa);if(!(c<e.near||c>e.far))return{distance:c,point:E0.clone().applyMatrix4(i.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:i}}class Lo extends yt{constructor(e,t,n,s,r,a,o,l,c){super(e,t,n,s,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Dc extends yt{constructor(e,t,n=wi,s,r,a,o=qt,l=qt,c,h=Ls,d=1){if(h!==Ls&&h!==Ds)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:d};super(u,s,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ao(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Uc extends yt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class gn extends Tt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,d=e/o,u=t/l,p=[],x=[],g=[],m=[];for(let f=0;f<h;f++){const M=f*u-a;for(let y=0;y<c;y++){const w=y*d-r;x.push(w,-M,0),g.push(0,0,1),m.push(y/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let M=0;M<o;M++){const y=M+c*f,w=M+c*(f+1),P=M+1+c*(f+1),E=M+1+c*f;p.push(y,w,E),p.push(w,P,E)}this.setIndex(p),this.setAttribute("position",new Yt(x,3)),this.setAttribute("normal",new Yt(g,3)),this.setAttribute("uv",new Yt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gn(e.width,e.height,e.widthSegments,e.heightSegments)}}class Kh extends Ui{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Xe(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class kn extends Ui{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=bc,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Cn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class $h extends Ui{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ql,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Jh extends Ui{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ic extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Qh extends Ic{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const ma=new ft,T0=new F,w0=new F;class eu{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.mapType=An,this.map=null,this.mapPass=null,this.matrix=new ft,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Po,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;T0.setFromMatrixPosition(e.matrixWorld),t.position.copy(T0),w0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(w0),t.updateMatrixWorld(),ma.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ma,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ma)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Nc extends Rc{constructor(e=-1,t=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class tu extends eu{constructor(){super(new Nc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Fr extends Ic{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new tu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class nu extends tn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class iu{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}const A0=new ft;class su{constructor(e,t,n=0,s=1/0){this.ray=new Co(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Ro,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):xt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return A0.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(A0),this}intersectObject(e,t=!0,n=[]){return po(e,this,n,t),n.sort(C0),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)po(e[s],this,n,t);return n.sort(C0),n}}function C0(i,e){return i.distance-e.distance}function po(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let a=0,o=r.length;a<o;a++)po(r[a],e,t,!0)}}class ru extends Di{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Le("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function R0(i,e,t,n){const s=au(n);switch(t){case _c:return i*e;case Mc:return i*e/s.components*s.byteLength;case So:return i*e/s.components*s.byteLength;case yo:return i*e*2/s.components*s.byteLength;case Eo:return i*e*2/s.components*s.byteLength;case vc:return i*e*3/s.components*s.byteLength;case xn:return i*e*4/s.components*s.byteLength;case To:return i*e*4/s.components*s.byteLength;case gr:case _r:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case vr:case Mr:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case za:case Ga:return Math.max(i,16)*Math.max(e,8)/4;case ka:case Va:return Math.max(i,8)*Math.max(e,8)/2;case Ha:case Wa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Xa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case qa:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Za:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ja:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case $a:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Qa:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case eo:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case to:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case no:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case io:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case so:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case ro:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case ao:case oo:case co:return Math.ceil(i/4)*Math.ceil(e/4)*16;case lo:case ho:return Math.ceil(i/4)*Math.ceil(e/4)*8;case uo:case fo:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function au(i){switch(i){case An:case pc:return{byteLength:1,components:1};case Rs:case mc:case hs:return{byteLength:2,components:1};case Mo:case bo:return{byteLength:2,components:4};case wi:case vo:case Hn:return{byteLength:4,components:1};case xc:case gc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_o}}));typeof window<"u"&&(window.__THREE__?Le("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_o);function Fc(){let i=null,e=!1,t=null,n=null;function s(r,a){t(r,a),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function ou(i){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function n(o,l,c){const h=l.array,d=l.updateRanges;if(i.bindBuffer(c,o),d.length===0)i.bufferSubData(c,0,h);else{d.sort((p,x)=>p.start-x.start);let u=0;for(let p=1;p<d.length;p++){const x=d[u],g=d[p];g.start<=x.start+x.count+1?x.count=Math.max(x.count,g.start+g.count-x.start):(++u,d[u]=g)}d.length=u+1;for(let p=0,x=d.length;p<x;p++){const g=d[p];i.bufferSubData(c,g.start*h.BYTES_PER_ELEMENT,h,g.start,g.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var cu=`#ifdef USE_ALPHAHASH
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
#endif`,fu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,du=`#ifdef USE_ALPHATEST
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
#endif`,ef=`#ifdef USE_ENVMAP
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
#endif`,tf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,sf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,af=`PhysicalMaterial material;
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
#endif`,of=`uniform sampler2D dfgLUT;
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
}`,cf=`
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
#endif`,lf=`#if defined( RE_IndirectDiffuse )
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
#endif`,hf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,uf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,ff=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,df=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,mf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,_f=`#if defined( USE_POINTS_UV )
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
#endif`,vf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ef=`#ifdef USE_MORPHTARGETS
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
#endif`,Tf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Af=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Cf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Lf=`#ifdef USE_NORMALMAP
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
#endif`,Df=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Uf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,If=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ff=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Of=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Bf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,kf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,zf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Hf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Wf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Xf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,qf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Yf=`float getShadowMask() {
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
}`,Zf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jf=`#ifdef USE_SKINNING
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
#endif`,Kf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$f=`#ifdef USE_SKINNING
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
#endif`,Jf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ed=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,td=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,nd=`#ifdef USE_TRANSMISSION
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
#endif`,id=`#ifdef USE_TRANSMISSION
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
#endif`,sd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ad=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,od=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const cd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ld=`uniform sampler2D t2D;
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
}`,hd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ud=`#ifdef ENVMAP_TYPE_CUBE
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
}`,fd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pd=`#include <common>
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
}`,md=`#if DEPTH_PACKING == 3200
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
}`,xd=`#define DISTANCE
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
}`,gd=`#define DISTANCE
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
}`,_d=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,vd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Md=`uniform float scale;
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
}`,bd=`uniform vec3 diffuse;
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
}`,Sd=`#include <common>
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
}`,yd=`uniform vec3 diffuse;
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
}`,Ed=`#define LAMBERT
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
}`,Td=`#define LAMBERT
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
}`,wd=`#define MATCAP
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
}`,Ad=`#define MATCAP
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
}`,Cd=`#define NORMAL
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
}`,Rd=`#define NORMAL
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
}`,Pd=`#define PHONG
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
}`,Ld=`#define PHONG
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
}`,Dd=`#define STANDARD
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
}`,Ud=`#define STANDARD
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
}`,Id=`#define TOON
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
}`,Nd=`#define TOON
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
}`,Fd=`uniform float size;
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
}`,Od=`uniform vec3 diffuse;
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
}`,Bd=`#include <common>
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
}`,kd=`uniform vec3 color;
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
}`,zd=`uniform float rotation;
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
}`,Vd=`uniform vec3 diffuse;
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
}`,Oe={alphahash_fragment:cu,alphahash_pars_fragment:lu,alphamap_fragment:hu,alphamap_pars_fragment:uu,alphatest_fragment:fu,alphatest_pars_fragment:du,aomap_fragment:pu,aomap_pars_fragment:mu,batching_pars_vertex:xu,batching_vertex:gu,begin_vertex:_u,beginnormal_vertex:vu,bsdfs:Mu,iridescence_fragment:bu,bumpmap_pars_fragment:Su,clipping_planes_fragment:yu,clipping_planes_pars_fragment:Eu,clipping_planes_pars_vertex:Tu,clipping_planes_vertex:wu,color_fragment:Au,color_pars_fragment:Cu,color_pars_vertex:Ru,color_vertex:Pu,common:Lu,cube_uv_reflection_fragment:Du,defaultnormal_vertex:Uu,displacementmap_pars_vertex:Iu,displacementmap_vertex:Nu,emissivemap_fragment:Fu,emissivemap_pars_fragment:Ou,colorspace_fragment:Bu,colorspace_pars_fragment:ku,envmap_fragment:zu,envmap_common_pars_fragment:Vu,envmap_pars_fragment:Gu,envmap_pars_vertex:Hu,envmap_physical_pars_fragment:ef,envmap_vertex:Wu,fog_vertex:Xu,fog_pars_vertex:qu,fog_fragment:Yu,fog_pars_fragment:Zu,gradientmap_pars_fragment:ju,lightmap_pars_fragment:Ku,lights_lambert_fragment:$u,lights_lambert_pars_fragment:Ju,lights_pars_begin:Qu,lights_toon_fragment:tf,lights_toon_pars_fragment:nf,lights_phong_fragment:sf,lights_phong_pars_fragment:rf,lights_physical_fragment:af,lights_physical_pars_fragment:of,lights_fragment_begin:cf,lights_fragment_maps:lf,lights_fragment_end:hf,logdepthbuf_fragment:uf,logdepthbuf_pars_fragment:ff,logdepthbuf_pars_vertex:df,logdepthbuf_vertex:pf,map_fragment:mf,map_pars_fragment:xf,map_particle_fragment:gf,map_particle_pars_fragment:_f,metalnessmap_fragment:vf,metalnessmap_pars_fragment:Mf,morphinstance_vertex:bf,morphcolor_vertex:Sf,morphnormal_vertex:yf,morphtarget_pars_vertex:Ef,morphtarget_vertex:Tf,normal_fragment_begin:wf,normal_fragment_maps:Af,normal_pars_fragment:Cf,normal_pars_vertex:Rf,normal_vertex:Pf,normalmap_pars_fragment:Lf,clearcoat_normal_fragment_begin:Df,clearcoat_normal_fragment_maps:Uf,clearcoat_pars_fragment:If,iridescence_pars_fragment:Nf,opaque_fragment:Ff,packing:Of,premultiplied_alpha_fragment:Bf,project_vertex:kf,dithering_fragment:zf,dithering_pars_fragment:Vf,roughnessmap_fragment:Gf,roughnessmap_pars_fragment:Hf,shadowmap_pars_fragment:Wf,shadowmap_pars_vertex:Xf,shadowmap_vertex:qf,shadowmask_pars_fragment:Yf,skinbase_vertex:Zf,skinning_pars_vertex:jf,skinning_vertex:Kf,skinnormal_vertex:$f,specularmap_fragment:Jf,specularmap_pars_fragment:Qf,tonemapping_fragment:ed,tonemapping_pars_fragment:td,transmission_fragment:nd,transmission_pars_fragment:id,uv_pars_fragment:sd,uv_pars_vertex:rd,uv_vertex:ad,worldpos_vertex:od,background_vert:cd,background_frag:ld,backgroundCube_vert:hd,backgroundCube_frag:ud,cube_vert:fd,cube_frag:dd,depth_vert:pd,depth_frag:md,distanceRGBA_vert:xd,distanceRGBA_frag:gd,equirect_vert:_d,equirect_frag:vd,linedashed_vert:Md,linedashed_frag:bd,meshbasic_vert:Sd,meshbasic_frag:yd,meshlambert_vert:Ed,meshlambert_frag:Td,meshmatcap_vert:wd,meshmatcap_frag:Ad,meshnormal_vert:Cd,meshnormal_frag:Rd,meshphong_vert:Pd,meshphong_frag:Ld,meshphysical_vert:Dd,meshphysical_frag:Ud,meshtoon_vert:Id,meshtoon_frag:Nd,points_vert:Fd,points_frag:Od,shadow_vert:Bd,shadow_frag:kd,sprite_vert:zd,sprite_frag:Vd},ce={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ne}},envmap:{envMap:{value:null},envMapRotation:{value:new Ne},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ne}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ne}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ne},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ne},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ne},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ne}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ne}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ne}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0},uvTransform:{value:new Ne}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ne},alphaMap:{value:null},alphaMapTransform:{value:new Ne},alphaTest:{value:0}}},bn={basic:{uniforms:Ft([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Ft([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Ft([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Ft([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Ft([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Ft([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Ft([ce.points,ce.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Ft([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Ft([ce.common,ce.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Ft([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Ft([ce.sprite,ce.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ne},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ne}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Ft([ce.common,ce.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Ft([ce.lights,ce.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};bn.physical={uniforms:Ft([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ne},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ne},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ne},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ne},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ne},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ne},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ne},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ne},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ne},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ne},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ne},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ne}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const lr={r:0,b:0,g:0},_i=new Cn,Gd=new ft;function Hd(i,e,t,n,s,r,a){const o=new Xe(0);let l=r===!0?0:1,c,h,d=null,u=0,p=null;function x(y){let w=y.isScene===!0?y.background:null;return w&&w.isTexture&&(w=(y.backgroundBlurriness>0?t:e).get(w)),w}function g(y){let w=!1;const P=x(y);P===null?f(o,l):P&&P.isColor&&(f(P,1),w=!0);const E=i.xr.getEnvironmentBlendMode();E==="additive"?n.buffers.color.setClear(0,0,0,1,a):E==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(y,w){const P=x(w);P&&(P.isCubeTexture||P.mapping===Ir)?(h===void 0&&(h=new jt(new ds(1,1,1),new qn({name:"BackgroundCubeMaterial",uniforms:ls(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:Ot,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(E,C,U){this.matrixWorld.copyPosition(U.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),_i.copy(w.backgroundRotation),_i.x*=-1,_i.y*=-1,_i.z*=-1,P.isCubeTexture&&P.isRenderTargetTexture===!1&&(_i.y*=-1,_i.z*=-1),h.material.uniforms.envMap.value=P,h.material.uniforms.flipEnvMap.value=P.isCubeTexture&&P.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Gd.makeRotationFromEuler(_i)),h.material.toneMapped=Ye.getTransfer(P.colorSpace)!==Je,(d!==P||u!==P.version||p!==i.toneMapping)&&(h.material.needsUpdate=!0,d=P,u=P.version,p=i.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):P&&P.isTexture&&(c===void 0&&(c=new jt(new gn(2,2),new qn({name:"BackgroundMaterial",uniforms:ls(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:_n,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=P,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=Ye.getTransfer(P.colorSpace)!==Je,P.matrixAutoUpdate===!0&&P.updateMatrix(),c.material.uniforms.uvTransform.value.copy(P.matrix),(d!==P||u!==P.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,d=P,u=P.version,p=i.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function f(y,w){y.getRGB(lr,Cc(i)),n.buffers.color.setClear(lr.r,lr.g,lr.b,w,a)}function M(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,w=1){o.set(y),l=w,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,f(o,l)},render:g,addToRenderList:m,dispose:M}}function Wd(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,a=!1;function o(b,A,B,z,W){let q=!1;const H=d(z,B,A);r!==H&&(r=H,c(r.object)),q=p(b,z,B,W),q&&x(b,z,B,W),W!==null&&e.update(W,i.ELEMENT_ARRAY_BUFFER),(q||a)&&(a=!1,w(b,A,B,z),W!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(W).buffer))}function l(){return i.createVertexArray()}function c(b){return i.bindVertexArray(b)}function h(b){return i.deleteVertexArray(b)}function d(b,A,B){const z=B.wireframe===!0;let W=n[b.id];W===void 0&&(W={},n[b.id]=W);let q=W[A.id];q===void 0&&(q={},W[A.id]=q);let H=q[z];return H===void 0&&(H=u(l()),q[z]=H),H}function u(b){const A=[],B=[],z=[];for(let W=0;W<t;W++)A[W]=0,B[W]=0,z[W]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:A,enabledAttributes:B,attributeDivisors:z,object:b,attributes:{},index:null}}function p(b,A,B,z){const W=r.attributes,q=A.attributes;let H=0;const ee=B.getAttributes();for(const V in ee)if(ee[V].location>=0){const ie=W[V];let ve=q[V];if(ve===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(ve=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(ve=b.instanceColor)),ie===void 0||ie.attribute!==ve||ve&&ie.data!==ve.data)return!0;H++}return r.attributesNum!==H||r.index!==z}function x(b,A,B,z){const W={},q=A.attributes;let H=0;const ee=B.getAttributes();for(const V in ee)if(ee[V].location>=0){let ie=q[V];ie===void 0&&(V==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),V==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor));const ve={};ve.attribute=ie,ie&&ie.data&&(ve.data=ie.data),W[V]=ve,H++}r.attributes=W,r.attributesNum=H,r.index=z}function g(){const b=r.newAttributes;for(let A=0,B=b.length;A<B;A++)b[A]=0}function m(b){f(b,0)}function f(b,A){const B=r.newAttributes,z=r.enabledAttributes,W=r.attributeDivisors;B[b]=1,z[b]===0&&(i.enableVertexAttribArray(b),z[b]=1),W[b]!==A&&(i.vertexAttribDivisor(b,A),W[b]=A)}function M(){const b=r.newAttributes,A=r.enabledAttributes;for(let B=0,z=A.length;B<z;B++)A[B]!==b[B]&&(i.disableVertexAttribArray(B),A[B]=0)}function y(b,A,B,z,W,q,H){H===!0?i.vertexAttribIPointer(b,A,B,W,q):i.vertexAttribPointer(b,A,B,z,W,q)}function w(b,A,B,z){g();const W=z.attributes,q=B.getAttributes(),H=A.defaultAttributeValues;for(const ee in q){const V=q[ee];if(V.location>=0){let ne=W[ee];if(ne===void 0&&(ee==="instanceMatrix"&&b.instanceMatrix&&(ne=b.instanceMatrix),ee==="instanceColor"&&b.instanceColor&&(ne=b.instanceColor)),ne!==void 0){const ie=ne.normalized,ve=ne.itemSize,Be=e.get(ne);if(Be===void 0)continue;const Ze=Be.buffer,tt=Be.type,nt=Be.bytesPerElement,Z=tt===i.INT||tt===i.UNSIGNED_INT||ne.gpuType===vo;if(ne.isInterleavedBufferAttribute){const $=ne.data,pe=$.stride,Ie=ne.offset;if($.isInstancedInterleavedBuffer){for(let be=0;be<V.locationSize;be++)f(V.location+be,$.meshPerAttribute);b.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let be=0;be<V.locationSize;be++)m(V.location+be);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let be=0;be<V.locationSize;be++)y(V.location+be,ve/V.locationSize,tt,ie,pe*nt,(Ie+ve/V.locationSize*be)*nt,Z)}else{if(ne.isInstancedBufferAttribute){for(let $=0;$<V.locationSize;$++)f(V.location+$,ne.meshPerAttribute);b.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let $=0;$<V.locationSize;$++)m(V.location+$);i.bindBuffer(i.ARRAY_BUFFER,Ze);for(let $=0;$<V.locationSize;$++)y(V.location+$,ve/V.locationSize,tt,ie,ve*nt,ve/V.locationSize*$*nt,Z)}}else if(H!==void 0){const ie=H[ee];if(ie!==void 0)switch(ie.length){case 2:i.vertexAttrib2fv(V.location,ie);break;case 3:i.vertexAttrib3fv(V.location,ie);break;case 4:i.vertexAttrib4fv(V.location,ie);break;default:i.vertexAttrib1fv(V.location,ie)}}}}M()}function P(){U();for(const b in n){const A=n[b];for(const B in A){const z=A[B];for(const W in z)h(z[W].object),delete z[W];delete A[B]}delete n[b]}}function E(b){if(n[b.id]===void 0)return;const A=n[b.id];for(const B in A){const z=A[B];for(const W in z)h(z[W].object),delete z[W];delete A[B]}delete n[b.id]}function C(b){for(const A in n){const B=n[A];if(B[b.id]===void 0)continue;const z=B[b.id];for(const W in z)h(z[W].object),delete z[W];delete B[b.id]}}function U(){S(),a=!0,r!==s&&(r=s,c(r.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:U,resetDefaultState:S,dispose:P,releaseStatesOfGeometry:E,releaseStatesOfProgram:C,initAttributes:g,enableAttribute:m,disableUnusedAttributes:M}}function Xd(i,e,t){let n;function s(c){n=c}function r(c,h){i.drawArrays(n,c,h),t.update(h,n,1)}function a(c,h,d){d!==0&&(i.drawArraysInstanced(n,c,h,d),t.update(h,n,d))}function o(c,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,h,0,d);let p=0;for(let x=0;x<d;x++)p+=h[x];t.update(p,n,1)}function l(c,h,d,u){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<c.length;x++)a(c[x],h[x],u[x]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,h,0,u,0,d);let x=0;for(let g=0;g<d;g++)x+=h[g]*u[g];t.update(x,n,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function qd(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(C){return!(C!==xn&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const U=C===hs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==An&&n.convert(C)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==Hn&&!U)}function l(C){if(C==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(Le("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),y=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),P=x>0,E=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:x,maxTextureSize:g,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:M,maxVaryings:y,maxFragmentUniforms:w,vertexTextures:P,maxSamples:E}}function Yd(i){const e=this;let t=null,n=0,s=!1,r=!1;const a=new Mi,o=new Ne,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const p=d.length!==0||u||n!==0||s;return s=u,n=d.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,p){const x=d.clippingPlanes,g=d.clipIntersection,m=d.clipShadows,f=i.get(d);if(!s||x===null||x.length===0||r&&!m)r?h(null):c();else{const M=r?0:n,y=M*4;let w=f.clippingState||null;l.value=w,w=h(x,u,y,p);for(let P=0;P!==y;++P)w[P]=t[P];f.clippingState=w,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,p,x){const g=d!==null?d.length:0;let m=null;if(g!==0){if(m=l.value,x!==!0||m===null){const f=p+g*4,M=u.matrixWorldInverse;o.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let y=0,w=p;y!==g;++y,w+=4)a.copy(d[y]).applyMatrix4(M,o),a.normal.toArray(m,w),m[w+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=g,e.numIntersection=0,m}}function Zd(i){let e=new WeakMap;function t(a,o){return o===Fa?a.mapping=is:o===Oa&&(a.mapping=ss),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Fa||o===Oa)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Gh(l.height);return c.fromEquirectangularTexture(i,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const ri=4,P0=[.125,.215,.35,.446,.526,.582],Si=20,jd=256,bs=new Nc,L0=new Xe;let xa=null,ga=0,_a=0,va=!1;const Kd=new F;class D0{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:a=256,position:o=Kd}=r;xa=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=N0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=I0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(xa,ga,_a),this._renderer.xr.enabled=va,e.scissorTest=!1,Zi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===is||e.mapping===ss?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xa=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:sn,minFilter:sn,generateMipmaps:!1,type:hs,format:xn,colorSpace:as,depthBuffer:!1},s=U0(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=U0(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=$d(r)),this._blurMaterial=Qd(r,e,t),this._ggxMaterial=Jd(r,e,t)}return s}_compileMaterial(e){const t=new jt(new Tt,e);this._renderer.compile(t,bs)}_sceneToCubeUV(e,t,n,s,r){const l=new tn(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,p=d.toneMapping;d.getClearColor(L0),d.toneMapping=li,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(s),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new jt(new ds,new cs({name:"PMREM.Background",side:Ot,depthWrite:!1,depthTest:!1})));const g=this._backgroundBox,m=g.material;let f=!1;const M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,f=!0):(m.color.copy(L0),f=!0);for(let y=0;y<6;y++){const w=y%3;w===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):w===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));const P=this._cubeSize;Zi(s,w*P,y>2?P:0,P,P),d.setRenderTarget(s),f&&d.render(g,l),d.render(e,l)}d.toneMapping=p,d.autoClear=u,e.background=M}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===is||e.mapping===ss;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=N0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=I0());const r=s?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Zi(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,bs)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=.05+c*.95,p=d*u,{_lodMax:x}=this,g=this._sizeLods[n],m=3*g*(n>x-ri?n-x+ri:0),f=4*(this._cubeSize-g);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=x-t,Zi(r,m,f,3*g,2*g),s.setRenderTarget(r),s.render(o,bs),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=x-n,Zi(e,m,f,3*g,2*g),s.setRenderTarget(e),s.render(o,bs)}_blur(e,t,n,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,n,s,"latitudinal",r),this._halfBlur(a,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&xt("blur direction must be either latitudinal or longitudinal!");const h=3,d=this._lodMeshes[s];d.material=c;const u=c.uniforms,p=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Si-1),g=r/x,m=isFinite(r)?1+Math.floor(h*g):Si;m>Si&&Le(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Si}`);const f=[];let M=0;for(let C=0;C<Si;++C){const U=C/g,S=Math.exp(-U*U/2);f.push(S),C===0?M+=S:C<m&&(M+=2*S)}for(let C=0;C<f.length;C++)f[C]=f[C]/M;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:y}=this;u.dTheta.value=x,u.mipInt.value=y-n;const w=this._sizeLods[s],P=3*w*(s>y-ri?s-y+ri:0),E=4*(this._cubeSize-w);Zi(t,P,E,3*w,2*w),l.setRenderTarget(t),l.render(d,bs)}}function $d(i){const e=[],t=[],n=[];let s=i;const r=i-ri+1+P0.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);e.push(o);let l=1/o;a>i-ri?l=P0[a-i+ri-1]:a===0&&(l=0),t.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,x=6,g=3,m=2,f=1,M=new Float32Array(g*x*p),y=new Float32Array(m*x*p),w=new Float32Array(f*x*p);for(let E=0;E<p;E++){const C=E%3*2/3-1,U=E>2?0:-1,S=[C,U,0,C+2/3,U,0,C+2/3,U+1,0,C,U,0,C+2/3,U+1,0,C,U+1,0];M.set(S,g*x*E),y.set(u,m*x*E);const b=[E,E,E,E,E,E];w.set(b,f*x*E)}const P=new Tt;P.setAttribute("position",new ut(M,g)),P.setAttribute("uv",new ut(y,m)),P.setAttribute("faceIndex",new ut(w,f)),n.push(new jt(P,null)),s>ri&&s--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function U0(i,e,t){const n=new Ai(i,e,t);return n.texture.mapping=Ir,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Zi(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Jd(i,e,t){return new qn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:jd,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Or(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Qd(i,e,t){const n=new Float32Array(Si),s=new F(0,1,0);return new qn({name:"SphericalGaussianBlur",defines:{n:Si,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Or(),fragmentShader:`

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
	`}function e1(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===Fa||l===Oa,h=l===is||l===ss;if(c||h){let d=e.get(o);const u=d!==void 0?d.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new D0(i)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),d.texture;if(d!==void 0)return d.texture;{const p=o.image;return c&&p&&p.height>0||h&&p&&s(p)?(t===null&&(t=new D0(i)),d=c?t.fromEquirectangular(o):t.fromCubemap(o),d.texture.pmremVersion=o.pmremVersion,e.set(o,d),o.addEventListener("dispose",r),d.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:a}}function t1(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Us("WebGLRenderer: "+n+" extension not supported."),s}}}function n1(i,e,t,n){const s={},r=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const x in u.attributes)e.remove(u.attributes[x]);u.removeEventListener("dispose",a),delete s[u.id];const p=r.get(u);p&&(e.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return s[u.id]===!0||(u.addEventListener("dispose",a),s[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const p in u)e.update(u[p],i.ARRAY_BUFFER)}function c(d){const u=[],p=d.index,x=d.attributes.position;let g=0;if(p!==null){const M=p.array;g=p.version;for(let y=0,w=M.length;y<w;y+=3){const P=M[y+0],E=M[y+1],C=M[y+2];u.push(P,E,E,C,C,P)}}else if(x!==void 0){const M=x.array;g=x.version;for(let y=0,w=M.length/3-1;y<w;y+=3){const P=y+0,E=y+1,C=y+2;u.push(P,E,E,C,C,P)}}else return;const m=new(yc(u)?Ac:wc)(u,1);m.version=g;const f=r.get(d);f&&e.remove(f),r.set(d,m)}function h(d){const u=r.get(d);if(u){const p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return r.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function i1(i,e,t){let n;function s(u){n=u}let r,a;function o(u){r=u.type,a=u.bytesPerElement}function l(u,p){i.drawElements(n,p,r,u*a),t.update(p,n,1)}function c(u,p,x){x!==0&&(i.drawElementsInstanced(n,p,r,u*a,x),t.update(p,n,x))}function h(u,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,u,0,x);let m=0;for(let f=0;f<x;f++)m+=p[f];t.update(m,n,1)}function d(u,p,x,g){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/a,p[f],g[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,u,0,g,0,x);let f=0;for(let M=0;M<x;M++)f+=p[M]*g[M];t.update(f,n,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function s1(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:xt("WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function r1(i,e,t){const n=new WeakMap,s=new gt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==d){let S=function(){C.dispose(),n.delete(o),o.removeEventListener("dispose",S)};u!==void 0&&u.texture.dispose();const p=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],M=o.morphAttributes.color||[];let y=0;p===!0&&(y=1),x===!0&&(y=2),g===!0&&(y=3);let w=o.attributes.position.count*y,P=1;w>e.maxTextureSize&&(P=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const E=new Float32Array(w*P*4*d),C=new Ec(E,w,P,d);C.type=Hn,C.needsUpdate=!0;const U=y*4;for(let b=0;b<d;b++){const A=m[b],B=f[b],z=M[b],W=w*P*4*b;for(let q=0;q<A.count;q++){const H=q*U;p===!0&&(s.fromBufferAttribute(A,q),E[W+H+0]=s.x,E[W+H+1]=s.y,E[W+H+2]=s.z,E[W+H+3]=0),x===!0&&(s.fromBufferAttribute(B,q),E[W+H+4]=s.x,E[W+H+5]=s.y,E[W+H+6]=s.z,E[W+H+7]=0),g===!0&&(s.fromBufferAttribute(z,q),E[W+H+8]=s.x,E[W+H+9]=s.y,E[W+H+10]=s.z,E[W+H+11]=z.itemSize===4?s.w:1)}}u={count:d,texture:C,size:new Fe(w,P)},n.set(o,u),o.addEventListener("dispose",S)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",a.morphTexture,t);else{let p=0;for(let g=0;g<c.length;g++)p+=c[g];const x=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function a1(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,h=l.geometry,d=e.get(l,h);if(s.get(d)!==c&&(e.update(d),s.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;s.get(u)!==c&&(u.update(),s.set(u,c))}return d}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const Oc=new yt,F0=new Dc(1,1),Bc=new Ec,kc=new Th,zc=new Pc,O0=[],B0=[],k0=new Float32Array(16),z0=new Float32Array(9),V0=new Float32Array(4);function ps(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=O0[s];if(r===void 0&&(r=new Float32Array(s),O0[s]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,i[a].toArray(r,o)}return r}function vt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Mt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Br(i,e){let t=B0[e];t===void 0&&(t=new Int32Array(e),B0[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function o1(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function c1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2fv(this.addr,e),Mt(t,e)}}function l1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vt(t,e))return;i.uniform3fv(this.addr,e),Mt(t,e)}}function h1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4fv(this.addr,e),Mt(t,e)}}function u1(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,n))return;V0.set(n),i.uniformMatrix2fv(this.addr,!1,V0),Mt(t,n)}}function f1(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,n))return;z0.set(n),i.uniformMatrix3fv(this.addr,!1,z0),Mt(t,n)}}function d1(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Mt(t,e)}else{if(vt(t,n))return;k0.set(n),i.uniformMatrix4fv(this.addr,!1,k0),Mt(t,n)}}function p1(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function m1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2iv(this.addr,e),Mt(t,e)}}function x1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;i.uniform3iv(this.addr,e),Mt(t,e)}}function g1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4iv(this.addr,e),Mt(t,e)}}function _1(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function v1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2uiv(this.addr,e),Mt(t,e)}}function M1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;i.uniform3uiv(this.addr,e),Mt(t,e)}}function b1(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4uiv(this.addr,e),Mt(t,e)}}function S1(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(F0.compareFunction=Sc,r=F0):r=Oc,t.setTexture2D(e||r,s)}function y1(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||kc,s)}function E1(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||zc,s)}function T1(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||Bc,s)}function w1(i){switch(i){case 5126:return o1;case 35664:return c1;case 35665:return l1;case 35666:return h1;case 35674:return u1;case 35675:return f1;case 35676:return d1;case 5124:case 35670:return p1;case 35667:case 35671:return m1;case 35668:case 35672:return x1;case 35669:case 35673:return g1;case 5125:return _1;case 36294:return v1;case 36295:return M1;case 36296:return b1;case 35678:case 36198:case 36298:case 36306:case 35682:return S1;case 35679:case 36299:case 36307:return y1;case 35680:case 36300:case 36308:case 36293:return E1;case 36289:case 36303:case 36311:case 36292:return T1}}function A1(i,e){i.uniform1fv(this.addr,e)}function C1(i,e){const t=ps(e,this.size,2);i.uniform2fv(this.addr,t)}function R1(i,e){const t=ps(e,this.size,3);i.uniform3fv(this.addr,t)}function P1(i,e){const t=ps(e,this.size,4);i.uniform4fv(this.addr,t)}function L1(i,e){const t=ps(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function D1(i,e){const t=ps(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function U1(i,e){const t=ps(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function I1(i,e){i.uniform1iv(this.addr,e)}function N1(i,e){i.uniform2iv(this.addr,e)}function F1(i,e){i.uniform3iv(this.addr,e)}function O1(i,e){i.uniform4iv(this.addr,e)}function B1(i,e){i.uniform1uiv(this.addr,e)}function k1(i,e){i.uniform2uiv(this.addr,e)}function z1(i,e){i.uniform3uiv(this.addr,e)}function V1(i,e){i.uniform4uiv(this.addr,e)}function G1(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||Oc,r[a])}function H1(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||kc,r[a])}function W1(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||zc,r[a])}function X1(i,e,t){const n=this.cache,s=e.length,r=Br(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),Mt(n,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||Bc,r[a])}function q1(i){switch(i){case 5126:return A1;case 35664:return C1;case 35665:return R1;case 35666:return P1;case 35674:return L1;case 35675:return D1;case 35676:return U1;case 5124:case 35670:return I1;case 35667:case 35671:return N1;case 35668:case 35672:return F1;case 35669:case 35673:return O1;case 5125:return B1;case 36294:return k1;case 36295:return z1;case 36296:return V1;case 35678:case 36198:case 36298:case 36306:case 35682:return G1;case 35679:case 36299:case 36307:return H1;case 35680:case 36300:case 36308:case 36293:return W1;case 36289:case 36303:case 36311:case 36292:return X1}}class Y1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=w1(t.type)}}class Z1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=q1(t.type)}}class j1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],n)}}}const Ma=/(\w+)(\])?(\[|\.)?/g;function G0(i,e){i.seq.push(e),i.map[e.id]=e}function K1(i,e,t){const n=i.name,s=n.length;for(Ma.lastIndex=0;;){const r=Ma.exec(n),a=Ma.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){G0(t,c===void 0?new Y1(o,i,e):new Z1(o,i,e));break}else{let d=t.map[o];d===void 0&&(d=new j1(o),G0(t,d)),t=d}}}class br{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);K1(r,a,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&n.push(a)}return n}}function H0(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const $1=37297;let J1=0;function Q1(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const W0=new Ne;function ep(i){Ye._getMatrix(W0,Ye.workingColorSpace,i);const e=`mat3( ${W0.elements.map(t=>t.toFixed(4))} )`;switch(Ye.getTransfer(i)){case Ar:return[e,"LinearTransferOETF"];case Je:return[e,"sRGBTransferOETF"];default:return Le("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function X0(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Q1(i.getShaderSource(e),o)}else return r}function tp(i,e){const t=ep(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function np(i,e){let t;switch(e){case kl:t="Linear";break;case zl:t="Reinhard";break;case Vl:t="Cineon";break;case fc:t="ACESFilmic";break;case Hl:t="AgX";break;case Wl:t="Neutral";break;case Gl:t="Custom";break;default:Le("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const hr=new F;function ip(){Ye.getLuminanceCoefficients(hr);const i=hr.x.toFixed(4),e=hr.y.toFixed(4),t=hr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Es).join(`
`)}function rp(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function ap(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),a=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:i.getAttribLocation(e,a),locationSize:o}}return t}function Es(i){return i!==""}function q0(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Y0(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const op=/^[ \t]*#include +<([\w\d./]+)>/gm;function mo(i){return i.replace(op,lp)}const cp=new Map;function lp(i,e){let t=Oe[e];if(t===void 0){const n=cp.get(e);if(n!==void 0)t=Oe[n],Le('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return mo(t)}const hp=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Z0(i){return i.replace(hp,up)}function up(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function j0(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function fp(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===lc?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===hc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===On&&(e="SHADOWMAP_TYPE_VSM"),e}function dp(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case is:case ss:e="ENVMAP_TYPE_CUBE";break;case Ir:e="ENVMAP_TYPE_CUBE_UV";break}return e}function pp(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===ss&&(e="ENVMAP_MODE_REFRACTION"),e}function mp(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case uc:e="ENVMAP_BLENDING_MULTIPLY";break;case Ol:e="ENVMAP_BLENDING_MIX";break;case Bl:e="ENVMAP_BLENDING_ADD";break}return e}function xp(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function gp(i,e,t,n){const s=i.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=fp(t),c=dp(t),h=pp(t),d=mp(t),u=xp(t),p=sp(t),x=rp(r),g=s.createProgram();let m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Es).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(Es).join(`
`),f.length>0&&(f+=`
`)):(m=[j0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Es).join(`
`),f=[j0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==li?"#define TONE_MAPPING":"",t.toneMapping!==li?Oe.tonemapping_pars_fragment:"",t.toneMapping!==li?np("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,tp("linearToOutputTexel",t.outputColorSpace),ip(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Es).join(`
`)),a=mo(a),a=q0(a,t),a=Y0(a,t),o=mo(o),o=q0(o,t),o=Y0(o,t),a=Z0(a),o=Z0(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===i0?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===i0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const y=M+m+a,w=M+f+o,P=H0(s,s.VERTEX_SHADER,y),E=H0(s,s.FRAGMENT_SHADER,w);s.attachShader(g,P),s.attachShader(g,E),t.index0AttributeName!==void 0?s.bindAttribLocation(g,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(g,0,"position"),s.linkProgram(g);function C(A){if(i.debug.checkShaderErrors){const B=s.getProgramInfoLog(g)||"",z=s.getShaderInfoLog(P)||"",W=s.getShaderInfoLog(E)||"",q=B.trim(),H=z.trim(),ee=W.trim();let V=!0,ne=!0;if(s.getProgramParameter(g,s.LINK_STATUS)===!1)if(V=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,g,P,E);else{const ie=X0(s,P,"vertex"),ve=X0(s,E,"fragment");xt("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(g,s.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+q+`
`+ie+`
`+ve)}else q!==""?Le("WebGLProgram: Program Info Log:",q):(H===""||ee==="")&&(ne=!1);ne&&(A.diagnostics={runnable:V,programLog:q,vertexShader:{log:H,prefix:m},fragmentShader:{log:ee,prefix:f}})}s.deleteShader(P),s.deleteShader(E),U=new br(s,g),S=ap(s,g)}let U;this.getUniforms=function(){return U===void 0&&C(this),U};let S;this.getAttributes=function(){return S===void 0&&C(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(g,$1)),b},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(g),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=J1++,this.cacheKey=e,this.usedTimes=1,this.program=g,this.vertexShader=P,this.fragmentShader=E,this}let _p=0;class vp{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Mp(e),t.set(e,n)),n}}class Mp{constructor(e){this.id=_p++,this.code=e,this.usedTimes=0}}function bp(i,e,t,n,s,r,a){const o=new Ro,l=new vp,c=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let p=s.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(S){return c.add(S),S===0?"uv":`uv${S}`}function m(S,b,A,B,z){const W=B.fog,q=z.geometry,H=S.isMeshStandardMaterial?B.environment:null,ee=(S.isMeshStandardMaterial?t:e).get(S.envMap||H),V=ee&&ee.mapping===Ir?ee.image.height:null,ne=x[S.type];S.precision!==null&&(p=s.getMaxPrecision(S.precision),p!==S.precision&&Le("WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const ie=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,ve=ie!==void 0?ie.length:0;let Be=0;q.morphAttributes.position!==void 0&&(Be=1),q.morphAttributes.normal!==void 0&&(Be=2),q.morphAttributes.color!==void 0&&(Be=3);let Ze,tt,nt,Z;if(ne){const Ke=bn[ne];Ze=Ke.vertexShader,tt=Ke.fragmentShader}else Ze=S.vertexShader,tt=S.fragmentShader,l.update(S),nt=l.getVertexShaderID(S),Z=l.getFragmentShaderID(S);const $=i.getRenderTarget(),pe=i.state.buffers.depth.getReversed(),Ie=z.isInstancedMesh===!0,be=z.isBatchedMesh===!0,ze=!!S.map,wt=!!S.matcap,ke=!!ee,at=!!S.aoMap,R=!!S.lightMap,Ve=!!S.bumpMap,Ge=!!S.normalMap,it=!!S.displacementMap,ge=!!S.emissiveMap,ot=!!S.metalnessMap,ye=!!S.roughnessMap,Ue=S.anisotropy>0,T=S.clearcoat>0,_=S.dispersion>0,O=S.iridescence>0,Y=S.sheen>0,K=S.transmission>0,X=Ue&&!!S.anisotropyMap,Me=T&&!!S.clearcoatMap,le=T&&!!S.clearcoatNormalMap,Ee=T&&!!S.clearcoatRoughnessMap,_e=O&&!!S.iridescenceMap,J=O&&!!S.iridescenceThicknessMap,re=Y&&!!S.sheenColorMap,Ce=Y&&!!S.sheenRoughnessMap,we=!!S.specularMap,fe=!!S.specularColorMap,Pe=!!S.specularIntensityMap,L=K&&!!S.transmissionMap,he=K&&!!S.thicknessMap,ae=!!S.gradientMap,oe=!!S.alphaMap,te=S.alphaTest>0,j=!!S.alphaHash,me=!!S.extensions;let De=li;S.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(De=i.toneMapping);const rt={shaderID:ne,shaderType:S.type,shaderName:S.name,vertexShader:Ze,fragmentShader:tt,defines:S.defines,customVertexShaderID:nt,customFragmentShaderID:Z,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:be,batchingColor:be&&z._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&z.instanceColor!==null,instancingMorph:Ie&&z.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:as,alphaToCoverage:!!S.alphaToCoverage,map:ze,matcap:wt,envMap:ke,envMapMode:ke&&ee.mapping,envMapCubeUVHeight:V,aoMap:at,lightMap:R,bumpMap:Ve,normalMap:Ge,displacementMap:u&&it,emissiveMap:ge,normalMapObjectSpace:Ge&&S.normalMapType===Zl,normalMapTangentSpace:Ge&&S.normalMapType===bc,metalnessMap:ot,roughnessMap:ye,anisotropy:Ue,anisotropyMap:X,clearcoat:T,clearcoatMap:Me,clearcoatNormalMap:le,clearcoatRoughnessMap:Ee,dispersion:_,iridescence:O,iridescenceMap:_e,iridescenceThicknessMap:J,sheen:Y,sheenColorMap:re,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:fe,specularIntensityMap:Pe,transmission:K,transmissionMap:L,thicknessMap:he,gradientMap:ae,opaque:S.transparent===!1&&S.blending===es&&S.alphaToCoverage===!1,alphaMap:oe,alphaTest:te,alphaHash:j,combine:S.combine,mapUv:ze&&g(S.map.channel),aoMapUv:at&&g(S.aoMap.channel),lightMapUv:R&&g(S.lightMap.channel),bumpMapUv:Ve&&g(S.bumpMap.channel),normalMapUv:Ge&&g(S.normalMap.channel),displacementMapUv:it&&g(S.displacementMap.channel),emissiveMapUv:ge&&g(S.emissiveMap.channel),metalnessMapUv:ot&&g(S.metalnessMap.channel),roughnessMapUv:ye&&g(S.roughnessMap.channel),anisotropyMapUv:X&&g(S.anisotropyMap.channel),clearcoatMapUv:Me&&g(S.clearcoatMap.channel),clearcoatNormalMapUv:le&&g(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&g(S.clearcoatRoughnessMap.channel),iridescenceMapUv:_e&&g(S.iridescenceMap.channel),iridescenceThicknessMapUv:J&&g(S.iridescenceThicknessMap.channel),sheenColorMapUv:re&&g(S.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&g(S.sheenRoughnessMap.channel),specularMapUv:we&&g(S.specularMap.channel),specularColorMapUv:fe&&g(S.specularColorMap.channel),specularIntensityMapUv:Pe&&g(S.specularIntensityMap.channel),transmissionMapUv:L&&g(S.transmissionMap.channel),thicknessMapUv:he&&g(S.thicknessMap.channel),alphaMapUv:oe&&g(S.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Ge||Ue),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!q.attributes.uv&&(ze||oe),fog:!!W,useFog:S.fog===!0,fogExp2:!!W&&W.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:pe,skinning:z.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:ve,morphTextureStride:Be,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&A.length>0,shadowMapType:i.shadowMap.type,toneMapping:De,decodeVideoTexture:ze&&S.map.isVideoTexture===!0&&Ye.getTransfer(S.map.colorSpace)===Je,decodeVideoTextureEmissive:ge&&S.emissiveMap.isVideoTexture===!0&&Ye.getTransfer(S.emissiveMap.colorSpace)===Je,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===mt,flipSided:S.side===Ot,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:me&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&S.extensions.multiDraw===!0||be)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return rt.vertexUv1s=c.has(1),rt.vertexUv2s=c.has(2),rt.vertexUv3s=c.has(3),c.clear(),rt}function f(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const A in S.defines)b.push(A),b.push(S.defines[A]);return S.isRawShaderMaterial===!1&&(M(b,S),y(b,S),b.push(i.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function M(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function y(S,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),S.push(o.mask)}function w(S){const b=x[S.type];let A;if(b){const B=bn[b];A=Bh.clone(B.uniforms)}else A=S.uniforms;return A}function P(S,b){let A;for(let B=0,z=h.length;B<z;B++){const W=h[B];if(W.cacheKey===b){A=W,++A.usedTimes;break}}return A===void 0&&(A=new gp(i,b,S,r),h.push(A)),A}function E(S){if(--S.usedTimes===0){const b=h.indexOf(S);h[b]=h[h.length-1],h.pop(),S.destroy()}}function C(S){l.remove(S)}function U(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:w,acquireProgram:P,releaseProgram:E,releaseShaderCache:C,programs:h,dispose:U}}function Sp(){let i=new WeakMap;function e(a){return i.has(a)}function t(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function s(a,o,l){i.get(a)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function yp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function K0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function $0(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function a(d,u,p,x,g,m){let f=i[e];return f===void 0?(f={id:d.id,object:d,geometry:u,material:p,groupOrder:x,renderOrder:d.renderOrder,z:g,group:m},i[e]=f):(f.id=d.id,f.object=d,f.geometry=u,f.material=p,f.groupOrder=x,f.renderOrder=d.renderOrder,f.z=g,f.group=m),e++,f}function o(d,u,p,x,g,m){const f=a(d,u,p,x,g,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(d,u,p,x,g,m){const f=a(d,u,p,x,g,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(d,u){t.length>1&&t.sort(d||yp),n.length>1&&n.sort(u||K0),s.length>1&&s.sort(u||K0)}function h(){for(let d=e,u=i.length;d<u;d++){const p=i[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function Ep(){let i=new WeakMap;function e(n,s){const r=i.get(n);let a;return r===void 0?(a=new $0,i.set(n,[a])):s>=r.length?(a=new $0,r.push(a)):a=r[s],a}function t(){i=new WeakMap}return{get:e,dispose:t}}function Tp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new Xe};break;case"SpotLight":t={position:new F,direction:new F,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new F,halfWidth:new F,halfHeight:new F};break}return i[e.id]=t,t}}}function wp(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let Ap=0;function Cp(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Rp(i){const e=new Tp,t=wp(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new F);const s=new F,r=new ft,a=new ft;function o(c){let h=0,d=0,u=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let p=0,x=0,g=0,m=0,f=0,M=0,y=0,w=0,P=0,E=0,C=0;c.sort(Cp);for(let S=0,b=c.length;S<b;S++){const A=c[S],B=A.color,z=A.intensity,W=A.distance,q=A.shadow&&A.shadow.map?A.shadow.map.texture:null;if(A.isAmbientLight)h+=B.r*z,d+=B.g*z,u+=B.b*z;else if(A.isLightProbe){for(let H=0;H<9;H++)n.probe[H].addScaledVector(A.sh.coefficients[H],z);C++}else if(A.isDirectionalLight){const H=e.get(A);if(H.color.copy(A.color).multiplyScalar(A.intensity),A.castShadow){const ee=A.shadow,V=t.get(A);V.shadowIntensity=ee.intensity,V.shadowBias=ee.bias,V.shadowNormalBias=ee.normalBias,V.shadowRadius=ee.radius,V.shadowMapSize=ee.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=A.shadow.matrix,M++}n.directional[p]=H,p++}else if(A.isSpotLight){const H=e.get(A);H.position.setFromMatrixPosition(A.matrixWorld),H.color.copy(B).multiplyScalar(z),H.distance=W,H.coneCos=Math.cos(A.angle),H.penumbraCos=Math.cos(A.angle*(1-A.penumbra)),H.decay=A.decay,n.spot[g]=H;const ee=A.shadow;if(A.map&&(n.spotLightMap[P]=A.map,P++,ee.updateMatrices(A),A.castShadow&&E++),n.spotLightMatrix[g]=ee.matrix,A.castShadow){const V=t.get(A);V.shadowIntensity=ee.intensity,V.shadowBias=ee.bias,V.shadowNormalBias=ee.normalBias,V.shadowRadius=ee.radius,V.shadowMapSize=ee.mapSize,n.spotShadow[g]=V,n.spotShadowMap[g]=q,w++}g++}else if(A.isRectAreaLight){const H=e.get(A);H.color.copy(B).multiplyScalar(z),H.halfWidth.set(A.width*.5,0,0),H.halfHeight.set(0,A.height*.5,0),n.rectArea[m]=H,m++}else if(A.isPointLight){const H=e.get(A);if(H.color.copy(A.color).multiplyScalar(A.intensity),H.distance=A.distance,H.decay=A.decay,A.castShadow){const ee=A.shadow,V=t.get(A);V.shadowIntensity=ee.intensity,V.shadowBias=ee.bias,V.shadowNormalBias=ee.normalBias,V.shadowRadius=ee.radius,V.shadowMapSize=ee.mapSize,V.shadowCameraNear=ee.camera.near,V.shadowCameraFar=ee.camera.far,n.pointShadow[x]=V,n.pointShadowMap[x]=q,n.pointShadowMatrix[x]=A.shadow.matrix,y++}n.point[x]=H,x++}else if(A.isHemisphereLight){const H=e.get(A);H.skyColor.copy(A.color).multiplyScalar(z),H.groundColor.copy(A.groundColor).multiplyScalar(z),n.hemi[f]=H,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const U=n.hash;(U.directionalLength!==p||U.pointLength!==x||U.spotLength!==g||U.rectAreaLength!==m||U.hemiLength!==f||U.numDirectionalShadows!==M||U.numPointShadows!==y||U.numSpotShadows!==w||U.numSpotMaps!==P||U.numLightProbes!==C)&&(n.directional.length=p,n.spot.length=g,n.rectArea.length=m,n.point.length=x,n.hemi.length=f,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=y,n.pointShadowMap.length=y,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=y,n.spotLightMatrix.length=w+P-E,n.spotLightMap.length=P,n.numSpotLightShadowsWithMaps=E,n.numLightProbes=C,U.directionalLength=p,U.pointLength=x,U.spotLength=g,U.rectAreaLength=m,U.hemiLength=f,U.numDirectionalShadows=M,U.numPointShadows=y,U.numSpotShadows=w,U.numSpotMaps=P,U.numLightProbes=C,n.version=Ap++)}function l(c,h){let d=0,u=0,p=0,x=0,g=0;const m=h.matrixWorldInverse;for(let f=0,M=c.length;f<M;f++){const y=c[f];if(y.isDirectionalLight){const w=n.directional[d];w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),d++}else if(y.isSpotLight){const w=n.spot[p];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),p++}else if(y.isRectAreaLight){const w=n.rectArea[x];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),a.identity(),r.copy(y.matrixWorld),r.premultiply(m),a.extractRotation(r),w.halfWidth.set(y.width*.5,0,0),w.halfHeight.set(0,y.height*.5,0),w.halfWidth.applyMatrix4(a),w.halfHeight.applyMatrix4(a),x++}else if(y.isPointLight){const w=n.point[u];w.position.setFromMatrixPosition(y.matrixWorld),w.position.applyMatrix4(m),u++}else if(y.isHemisphereLight){const w=n.hemi[g];w.direction.setFromMatrixPosition(y.matrixWorld),w.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:n}}function J0(i){const e=new Rp(i),t=[],n=[];function s(h){c.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function a(h){n.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function Pp(i){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new J0(i),e.set(s,[o])):r>=a.length?(o=new J0(i),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const Lp=`void main() {
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
}`;function Up(i,e,t){let n=new Po;const s=new Fe,r=new Fe,a=new gt,o=new $h({depthPacking:Yl}),l=new Jh,c={},h=t.maxTextureSize,d={[_n]:Ot,[Ot]:_n,[mt]:mt},u=new qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:Lp,fragmentShader:Dp}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const x=new Tt;x.setAttribute("position",new ut(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new jt(x,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=lc;let f=this.type;this.render=function(E,C,U){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const S=i.getRenderTarget(),b=i.getActiveCubeFace(),A=i.getActiveMipmapLevel(),B=i.state;B.setBlending(Wn),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const z=f!==On&&this.type===On,W=f===On&&this.type!==On;for(let q=0,H=E.length;q<H;q++){const ee=E[q],V=ee.shadow;if(V===void 0){Le("WebGLShadowMap:",ee,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;s.copy(V.mapSize);const ne=V.getFrameExtents();if(s.multiply(ne),r.copy(V.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ne.x),s.x=r.x*ne.x,V.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ne.y),s.y=r.y*ne.y,V.mapSize.y=r.y)),V.map===null||z===!0||W===!0){const ve=this.type!==On?{minFilter:qt,magFilter:qt}:{};V.map!==null&&V.map.dispose(),V.map=new Ai(s.x,s.y,ve),V.map.texture.name=ee.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const ie=V.getViewportCount();for(let ve=0;ve<ie;ve++){const Be=V.getViewport(ve);a.set(r.x*Be.x,r.y*Be.y,r.x*Be.z,r.y*Be.w),B.viewport(a),V.updateMatrices(ee,ve),n=V.getFrustum(),w(C,U,V.camera,ee,this.type)}V.isPointLightShadow!==!0&&this.type===On&&M(V,U),V.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(S,b,A)};function M(E,C){const U=e.update(g);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new Ai(s.x,s.y)),u.uniforms.shadow_pass.value=E.map.texture,u.uniforms.resolution.value=E.mapSize,u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(C,null,U,u,g,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(C,null,U,p,g,null)}function y(E,C,U,S){let b=null;const A=U.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(A!==void 0)b=A;else if(b=U.isPointLight===!0?l:o,i.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){const B=b.uuid,z=C.uuid;let W=c[B];W===void 0&&(W={},c[B]=W);let q=W[z];q===void 0&&(q=b.clone(),W[z]=q,C.addEventListener("dispose",P)),b=q}if(b.visible=C.visible,b.wireframe=C.wireframe,S===On?b.side=C.shadowSide!==null?C.shadowSide:C.side:b.side=C.shadowSide!==null?C.shadowSide:d[C.side],b.alphaMap=C.alphaMap,b.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,b.map=C.map,b.clipShadows=C.clipShadows,b.clippingPlanes=C.clippingPlanes,b.clipIntersection=C.clipIntersection,b.displacementMap=C.displacementMap,b.displacementScale=C.displacementScale,b.displacementBias=C.displacementBias,b.wireframeLinewidth=C.wireframeLinewidth,b.linewidth=C.linewidth,U.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const B=i.properties.get(b);B.light=U}return b}function w(E,C,U,S,b){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&b===On)&&(!E.frustumCulled||n.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,E.matrixWorld);const z=e.update(E),W=E.material;if(Array.isArray(W)){const q=z.groups;for(let H=0,ee=q.length;H<ee;H++){const V=q[H],ne=W[V.materialIndex];if(ne&&ne.visible){const ie=y(E,ne,S,b);E.onBeforeShadow(i,E,C,U,z,ie,V),i.renderBufferDirect(U,null,z,ie,E,V),E.onAfterShadow(i,E,C,U,z,ie,V)}}}else if(W.visible){const q=y(E,W,S,b);E.onBeforeShadow(i,E,C,U,z,q,null),i.renderBufferDirect(U,null,z,q,E,null),E.onAfterShadow(i,E,C,U,z,q,null)}}const B=E.children;for(let z=0,W=B.length;z<W;z++)w(B[z],C,U,S,b)}function P(E){E.target.removeEventListener("dispose",P);for(const U in c){const S=c[U],b=E.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}const Ip={[Ra]:Pa,[La]:Ia,[Da]:Na,[ns]:Ua,[Pa]:Ra,[Ia]:La,[Na]:Da,[Ua]:ns};function Np(i,e){function t(){let L=!1;const he=new gt;let ae=null;const oe=new gt(0,0,0,0);return{setMask:function(te){ae!==te&&!L&&(i.colorMask(te,te,te,te),ae=te)},setLocked:function(te){L=te},setClear:function(te,j,me,De,rt){rt===!0&&(te*=De,j*=De,me*=De),he.set(te,j,me,De),oe.equals(he)===!1&&(i.clearColor(te,j,me,De),oe.copy(he))},reset:function(){L=!1,ae=null,oe.set(-1,0,0,0)}}}function n(){let L=!1,he=!1,ae=null,oe=null,te=null;return{setReversed:function(j){if(he!==j){const me=e.get("EXT_clip_control");j?me.clipControlEXT(me.LOWER_LEFT_EXT,me.ZERO_TO_ONE_EXT):me.clipControlEXT(me.LOWER_LEFT_EXT,me.NEGATIVE_ONE_TO_ONE_EXT),he=j;const De=te;te=null,this.setClear(De)}},getReversed:function(){return he},setTest:function(j){j?$(i.DEPTH_TEST):pe(i.DEPTH_TEST)},setMask:function(j){ae!==j&&!L&&(i.depthMask(j),ae=j)},setFunc:function(j){if(he&&(j=Ip[j]),oe!==j){switch(j){case Ra:i.depthFunc(i.NEVER);break;case Pa:i.depthFunc(i.ALWAYS);break;case La:i.depthFunc(i.LESS);break;case ns:i.depthFunc(i.LEQUAL);break;case Da:i.depthFunc(i.EQUAL);break;case Ua:i.depthFunc(i.GEQUAL);break;case Ia:i.depthFunc(i.GREATER);break;case Na:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}oe=j}},setLocked:function(j){L=j},setClear:function(j){te!==j&&(he&&(j=1-j),i.clearDepth(j),te=j)},reset:function(){L=!1,ae=null,oe=null,te=null,he=!1}}}function s(){let L=!1,he=null,ae=null,oe=null,te=null,j=null,me=null,De=null,rt=null;return{setTest:function(Ke){L||(Ke?$(i.STENCIL_TEST):pe(i.STENCIL_TEST))},setMask:function(Ke){he!==Ke&&!L&&(i.stencilMask(Ke),he=Ke)},setFunc:function(Ke,Mn,on){(ae!==Ke||oe!==Mn||te!==on)&&(i.stencilFunc(Ke,Mn,on),ae=Ke,oe=Mn,te=on)},setOp:function(Ke,Mn,on){(j!==Ke||me!==Mn||De!==on)&&(i.stencilOp(Ke,Mn,on),j=Ke,me=Mn,De=on)},setLocked:function(Ke){L=Ke},setClear:function(Ke){rt!==Ke&&(i.clearStencil(Ke),rt=Ke)},reset:function(){L=!1,he=null,ae=null,oe=null,te=null,j=null,me=null,De=null,rt=null}}}const r=new t,a=new n,o=new s,l=new WeakMap,c=new WeakMap;let h={},d={},u=new WeakMap,p=[],x=null,g=!1,m=null,f=null,M=null,y=null,w=null,P=null,E=null,C=new Xe(0,0,0),U=0,S=!1,b=null,A=null,B=null,z=null,W=null;const q=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let H=!1,ee=0;const V=i.getParameter(i.VERSION);V.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(V)[1]),H=ee>=1):V.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),H=ee>=2);let ne=null,ie={};const ve=i.getParameter(i.SCISSOR_BOX),Be=i.getParameter(i.VIEWPORT),Ze=new gt().fromArray(ve),tt=new gt().fromArray(Be);function nt(L,he,ae,oe){const te=new Uint8Array(4),j=i.createTexture();i.bindTexture(L,j),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let me=0;me<ae;me++)L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY?i.texImage3D(he,0,i.RGBA,1,1,oe,0,i.RGBA,i.UNSIGNED_BYTE,te):i.texImage2D(he+me,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,te);return j}const Z={};Z[i.TEXTURE_2D]=nt(i.TEXTURE_2D,i.TEXTURE_2D,1),Z[i.TEXTURE_CUBE_MAP]=nt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[i.TEXTURE_2D_ARRAY]=nt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Z[i.TEXTURE_3D]=nt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),$(i.DEPTH_TEST),a.setFunc(ns),Ve(!1),Ge($o),$(i.CULL_FACE),at(Wn);function $(L){h[L]!==!0&&(i.enable(L),h[L]=!0)}function pe(L){h[L]!==!1&&(i.disable(L),h[L]=!1)}function Ie(L,he){return d[L]!==he?(i.bindFramebuffer(L,he),d[L]=he,L===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=he),L===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=he),!0):!1}function be(L,he){let ae=p,oe=!1;if(L){ae=u.get(he),ae===void 0&&(ae=[],u.set(he,ae));const te=L.textures;if(ae.length!==te.length||ae[0]!==i.COLOR_ATTACHMENT0){for(let j=0,me=te.length;j<me;j++)ae[j]=i.COLOR_ATTACHMENT0+j;ae.length=te.length,oe=!0}}else ae[0]!==i.BACK&&(ae[0]=i.BACK,oe=!0);oe&&i.drawBuffers(ae)}function ze(L){return x!==L?(i.useProgram(L),x=L,!0):!1}const wt={[bi]:i.FUNC_ADD,[Ml]:i.FUNC_SUBTRACT,[bl]:i.FUNC_REVERSE_SUBTRACT};wt[Sl]=i.MIN,wt[yl]=i.MAX;const ke={[El]:i.ZERO,[Tl]:i.ONE,[wl]:i.SRC_COLOR,[Aa]:i.SRC_ALPHA,[Dl]:i.SRC_ALPHA_SATURATE,[Pl]:i.DST_COLOR,[Cl]:i.DST_ALPHA,[Al]:i.ONE_MINUS_SRC_COLOR,[Ca]:i.ONE_MINUS_SRC_ALPHA,[Ll]:i.ONE_MINUS_DST_COLOR,[Rl]:i.ONE_MINUS_DST_ALPHA,[Ul]:i.CONSTANT_COLOR,[Il]:i.ONE_MINUS_CONSTANT_COLOR,[Nl]:i.CONSTANT_ALPHA,[Fl]:i.ONE_MINUS_CONSTANT_ALPHA};function at(L,he,ae,oe,te,j,me,De,rt,Ke){if(L===Wn){g===!0&&(pe(i.BLEND),g=!1);return}if(g===!1&&($(i.BLEND),g=!0),L!==vl){if(L!==m||Ke!==S){if((f!==bi||w!==bi)&&(i.blendEquation(i.FUNC_ADD),f=bi,w=bi),Ke)switch(L){case es:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Jo:i.blendFunc(i.ONE,i.ONE);break;case Qo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case e0:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:xt("WebGLState: Invalid blending: ",L);break}else switch(L){case es:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Jo:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Qo:xt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case e0:xt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:xt("WebGLState: Invalid blending: ",L);break}M=null,y=null,P=null,E=null,C.set(0,0,0),U=0,m=L,S=Ke}return}te=te||he,j=j||ae,me=me||oe,(he!==f||te!==w)&&(i.blendEquationSeparate(wt[he],wt[te]),f=he,w=te),(ae!==M||oe!==y||j!==P||me!==E)&&(i.blendFuncSeparate(ke[ae],ke[oe],ke[j],ke[me]),M=ae,y=oe,P=j,E=me),(De.equals(C)===!1||rt!==U)&&(i.blendColor(De.r,De.g,De.b,rt),C.copy(De),U=rt),m=L,S=!1}function R(L,he){L.side===mt?pe(i.CULL_FACE):$(i.CULL_FACE);let ae=L.side===Ot;he&&(ae=!ae),Ve(ae),L.blending===es&&L.transparent===!1?at(Wn):at(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),a.setFunc(L.depthFunc),a.setTest(L.depthTest),a.setMask(L.depthWrite),r.setMask(L.colorWrite);const oe=L.stencilWrite;o.setTest(oe),oe&&(o.setMask(L.stencilWriteMask),o.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),o.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),ge(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?$(i.SAMPLE_ALPHA_TO_COVERAGE):pe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ve(L){b!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),b=L)}function Ge(L){L!==gl?($(i.CULL_FACE),L!==A&&(L===$o?i.cullFace(i.BACK):L===_l?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):pe(i.CULL_FACE),A=L}function it(L){L!==B&&(H&&i.lineWidth(L),B=L)}function ge(L,he,ae){L?($(i.POLYGON_OFFSET_FILL),(z!==he||W!==ae)&&(i.polygonOffset(he,ae),z=he,W=ae)):pe(i.POLYGON_OFFSET_FILL)}function ot(L){L?$(i.SCISSOR_TEST):pe(i.SCISSOR_TEST)}function ye(L){L===void 0&&(L=i.TEXTURE0+q-1),ne!==L&&(i.activeTexture(L),ne=L)}function Ue(L,he,ae){ae===void 0&&(ne===null?ae=i.TEXTURE0+q-1:ae=ne);let oe=ie[ae];oe===void 0&&(oe={type:void 0,texture:void 0},ie[ae]=oe),(oe.type!==L||oe.texture!==he)&&(ne!==ae&&(i.activeTexture(ae),ne=ae),i.bindTexture(L,he||Z[L]),oe.type=L,oe.texture=he)}function T(){const L=ie[ne];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function _(){try{i.compressedTexImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function O(){try{i.compressedTexImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function Y(){try{i.texSubImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function K(){try{i.texSubImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function Me(){try{i.compressedTexSubImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function le(){try{i.texStorage2D(...arguments)}catch(L){L("WebGLState:",L)}}function Ee(){try{i.texStorage3D(...arguments)}catch(L){L("WebGLState:",L)}}function _e(){try{i.texImage2D(...arguments)}catch(L){L("WebGLState:",L)}}function J(){try{i.texImage3D(...arguments)}catch(L){L("WebGLState:",L)}}function re(L){Ze.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),Ze.copy(L))}function Ce(L){tt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),tt.copy(L))}function we(L,he){let ae=c.get(he);ae===void 0&&(ae=new WeakMap,c.set(he,ae));let oe=ae.get(L);oe===void 0&&(oe=i.getUniformBlockIndex(he,L.name),ae.set(L,oe))}function fe(L,he){const oe=c.get(he).get(L);l.get(he)!==oe&&(i.uniformBlockBinding(he,oe,L.__bindingPointIndex),l.set(he,oe))}function Pe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},ne=null,ie={},d={},u=new WeakMap,p=[],x=null,g=!1,m=null,f=null,M=null,y=null,w=null,P=null,E=null,C=new Xe(0,0,0),U=0,S=!1,b=null,A=null,B=null,z=null,W=null,Ze.set(0,0,i.canvas.width,i.canvas.height),tt.set(0,0,i.canvas.width,i.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:$,disable:pe,bindFramebuffer:Ie,drawBuffers:be,useProgram:ze,setBlending:at,setMaterial:R,setFlipSided:Ve,setCullFace:Ge,setLineWidth:it,setPolygonOffset:ge,setScissorTest:ot,activeTexture:ye,bindTexture:Ue,unbindTexture:T,compressedTexImage2D:_,compressedTexImage3D:O,texImage2D:_e,texImage3D:J,updateUBOMapping:we,uniformBlockBinding:fe,texStorage2D:le,texStorage3D:Ee,texSubImage2D:Y,texSubImage3D:K,compressedTexSubImage2D:X,compressedTexSubImage3D:Me,scissor:re,viewport:Ce,reset:Pe}}function Fp(i,e,t,n,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Fe,h=new WeakMap;let d;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(T,_){return p?new OffscreenCanvas(T,_):Rr("canvas")}function g(T,_,O){let Y=1;const K=Ue(T);if((K.width>O||K.height>O)&&(Y=O/Math.max(K.width,K.height)),Y<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const X=Math.floor(Y*K.width),Me=Math.floor(Y*K.height);d===void 0&&(d=x(X,Me));const le=_?x(X,Me):d;return le.width=X,le.height=Me,le.getContext("2d").drawImage(T,0,0,X,Me),Le("WebGLRenderer: Texture has been resized from ("+K.width+"x"+K.height+") to ("+X+"x"+Me+")."),le}else return"data"in T&&Le("WebGLRenderer: Image in DataTexture is too big ("+K.width+"x"+K.height+")."),T;return T}function m(T){return T.generateMipmaps}function f(T){i.generateMipmap(T)}function M(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function y(T,_,O,Y,K=!1){if(T!==null){if(i[T]!==void 0)return i[T];Le("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let X=_;if(_===i.RED&&(O===i.FLOAT&&(X=i.R32F),O===i.HALF_FLOAT&&(X=i.R16F),O===i.UNSIGNED_BYTE&&(X=i.R8)),_===i.RED_INTEGER&&(O===i.UNSIGNED_BYTE&&(X=i.R8UI),O===i.UNSIGNED_SHORT&&(X=i.R16UI),O===i.UNSIGNED_INT&&(X=i.R32UI),O===i.BYTE&&(X=i.R8I),O===i.SHORT&&(X=i.R16I),O===i.INT&&(X=i.R32I)),_===i.RG&&(O===i.FLOAT&&(X=i.RG32F),O===i.HALF_FLOAT&&(X=i.RG16F),O===i.UNSIGNED_BYTE&&(X=i.RG8)),_===i.RG_INTEGER&&(O===i.UNSIGNED_BYTE&&(X=i.RG8UI),O===i.UNSIGNED_SHORT&&(X=i.RG16UI),O===i.UNSIGNED_INT&&(X=i.RG32UI),O===i.BYTE&&(X=i.RG8I),O===i.SHORT&&(X=i.RG16I),O===i.INT&&(X=i.RG32I)),_===i.RGB_INTEGER&&(O===i.UNSIGNED_BYTE&&(X=i.RGB8UI),O===i.UNSIGNED_SHORT&&(X=i.RGB16UI),O===i.UNSIGNED_INT&&(X=i.RGB32UI),O===i.BYTE&&(X=i.RGB8I),O===i.SHORT&&(X=i.RGB16I),O===i.INT&&(X=i.RGB32I)),_===i.RGBA_INTEGER&&(O===i.UNSIGNED_BYTE&&(X=i.RGBA8UI),O===i.UNSIGNED_SHORT&&(X=i.RGBA16UI),O===i.UNSIGNED_INT&&(X=i.RGBA32UI),O===i.BYTE&&(X=i.RGBA8I),O===i.SHORT&&(X=i.RGBA16I),O===i.INT&&(X=i.RGBA32I)),_===i.RGB&&(O===i.UNSIGNED_INT_5_9_9_9_REV&&(X=i.RGB9_E5),O===i.UNSIGNED_INT_10F_11F_11F_REV&&(X=i.R11F_G11F_B10F)),_===i.RGBA){const Me=K?Ar:Ye.getTransfer(Y);O===i.FLOAT&&(X=i.RGBA32F),O===i.HALF_FLOAT&&(X=i.RGBA16F),O===i.UNSIGNED_BYTE&&(X=Me===Je?i.SRGB8_ALPHA8:i.RGBA8),O===i.UNSIGNED_SHORT_4_4_4_4&&(X=i.RGBA4),O===i.UNSIGNED_SHORT_5_5_5_1&&(X=i.RGB5_A1)}return(X===i.R16F||X===i.R32F||X===i.RG16F||X===i.RG32F||X===i.RGBA16F||X===i.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function w(T,_){let O;return T?_===null||_===wi||_===Ps?O=i.DEPTH24_STENCIL8:_===Hn?O=i.DEPTH32F_STENCIL8:_===Rs&&(O=i.DEPTH24_STENCIL8,Le("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===wi||_===Ps?O=i.DEPTH_COMPONENT24:_===Hn?O=i.DEPTH_COMPONENT32F:_===Rs&&(O=i.DEPTH_COMPONENT16),O}function P(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==qt&&T.minFilter!==sn?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function E(T){const _=T.target;_.removeEventListener("dispose",E),U(_),_.isVideoTexture&&h.delete(_)}function C(T){const _=T.target;_.removeEventListener("dispose",C),b(_)}function U(T){const _=n.get(T);if(_.__webglInit===void 0)return;const O=T.source,Y=u.get(O);if(Y){const K=Y[_.__cacheKey];K.usedTimes--,K.usedTimes===0&&S(T),Object.keys(Y).length===0&&u.delete(O)}n.remove(T)}function S(T){const _=n.get(T);i.deleteTexture(_.__webglTexture);const O=T.source,Y=u.get(O);delete Y[_.__cacheKey],a.memory.textures--}function b(T){const _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(_.__webglFramebuffer[Y]))for(let K=0;K<_.__webglFramebuffer[Y].length;K++)i.deleteFramebuffer(_.__webglFramebuffer[Y][K]);else i.deleteFramebuffer(_.__webglFramebuffer[Y]);_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer[Y])}else{if(Array.isArray(_.__webglFramebuffer))for(let Y=0;Y<_.__webglFramebuffer.length;Y++)i.deleteFramebuffer(_.__webglFramebuffer[Y]);else i.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&i.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let Y=0;Y<_.__webglColorRenderbuffer.length;Y++)_.__webglColorRenderbuffer[Y]&&i.deleteRenderbuffer(_.__webglColorRenderbuffer[Y]);_.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const O=T.textures;for(let Y=0,K=O.length;Y<K;Y++){const X=n.get(O[Y]);X.__webglTexture&&(i.deleteTexture(X.__webglTexture),a.memory.textures--),n.remove(O[Y])}n.remove(T)}let A=0;function B(){A=0}function z(){const T=A;return T>=s.maxTextures&&Le("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+s.maxTextures),A+=1,T}function W(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function q(T,_){const O=n.get(T);if(T.isVideoTexture&&ot(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&O.__version!==T.version){const Y=T.image;if(Y===null)Le("WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)Le("WebGLRenderer: Texture marked for update but image is incomplete");else{Z(O,T,_);return}}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,O.__webglTexture,i.TEXTURE0+_)}function H(T,_){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){Z(O,T,_);return}else T.isExternalTexture&&(O.__webglTexture=T.sourceTexture?T.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,O.__webglTexture,i.TEXTURE0+_)}function ee(T,_){const O=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&O.__version!==T.version){Z(O,T,_);return}t.bindTexture(i.TEXTURE_3D,O.__webglTexture,i.TEXTURE0+_)}function V(T,_){const O=n.get(T);if(T.version>0&&O.__version!==T.version){$(O,T,_);return}t.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+_)}const ne={[rs]:i.REPEAT,[Gn]:i.CLAMP_TO_EDGE,[Ba]:i.MIRRORED_REPEAT},ie={[qt]:i.NEAREST,[Xl]:i.NEAREST_MIPMAP_NEAREST,[Hs]:i.NEAREST_MIPMAP_LINEAR,[sn]:i.LINEAR,[Xr]:i.LINEAR_MIPMAP_NEAREST,[Ei]:i.LINEAR_MIPMAP_LINEAR},ve={[jl]:i.NEVER,[th]:i.ALWAYS,[Kl]:i.LESS,[Sc]:i.LEQUAL,[$l]:i.EQUAL,[eh]:i.GEQUAL,[Jl]:i.GREATER,[Ql]:i.NOTEQUAL};function Be(T,_){if(_.type===Hn&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===sn||_.magFilter===Xr||_.magFilter===Hs||_.magFilter===Ei||_.minFilter===sn||_.minFilter===Xr||_.minFilter===Hs||_.minFilter===Ei)&&Le("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,ne[_.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,ne[_.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,ne[_.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ie[_.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ie[_.minFilter]),_.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,ve[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===qt||_.minFilter!==Hs&&_.minFilter!==Ei||_.type===Hn&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,s.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function Ze(T,_){let O=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",E));const Y=_.source;let K=u.get(Y);K===void 0&&(K={},u.set(Y,K));const X=W(_);if(X!==T.__cacheKey){K[X]===void 0&&(K[X]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,O=!0),K[X].usedTimes++;const Me=K[T.__cacheKey];Me!==void 0&&(K[T.__cacheKey].usedTimes--,Me.usedTimes===0&&S(_)),T.__cacheKey=X,T.__webglTexture=K[X].texture}return O}function tt(T,_,O){return Math.floor(Math.floor(T/O)/_)}function nt(T,_,O,Y){const X=T.updateRanges;if(X.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,_.width,_.height,O,Y,_.data);else{X.sort((J,re)=>J.start-re.start);let Me=0;for(let J=1;J<X.length;J++){const re=X[Me],Ce=X[J],we=re.start+re.count,fe=tt(Ce.start,_.width,4),Pe=tt(re.start,_.width,4);Ce.start<=we+1&&fe===Pe&&tt(Ce.start+Ce.count-1,_.width,4)===fe?re.count=Math.max(re.count,Ce.start+Ce.count-re.start):(++Me,X[Me]=Ce)}X.length=Me+1;const le=i.getParameter(i.UNPACK_ROW_LENGTH),Ee=i.getParameter(i.UNPACK_SKIP_PIXELS),_e=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,_.width);for(let J=0,re=X.length;J<re;J++){const Ce=X[J],we=Math.floor(Ce.start/4),fe=Math.ceil(Ce.count/4),Pe=we%_.width,L=Math.floor(we/_.width),he=fe,ae=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Pe),i.pixelStorei(i.UNPACK_SKIP_ROWS,L),t.texSubImage2D(i.TEXTURE_2D,0,Pe,L,he,ae,O,Y,_.data)}T.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,le),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ee),i.pixelStorei(i.UNPACK_SKIP_ROWS,_e)}}function Z(T,_,O){let Y=i.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(Y=i.TEXTURE_2D_ARRAY),_.isData3DTexture&&(Y=i.TEXTURE_3D);const K=Ze(T,_),X=_.source;t.bindTexture(Y,T.__webglTexture,i.TEXTURE0+O);const Me=n.get(X);if(X.version!==Me.__version||K===!0){t.activeTexture(i.TEXTURE0+O);const le=Ye.getPrimaries(Ye.workingColorSpace),Ee=_.colorSpace===ni?null:Ye.getPrimaries(_.colorSpace),_e=_.colorSpace===ni||le===Ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);let J=g(_.image,!1,s.maxTextureSize);J=ye(_,J);const re=r.convert(_.format,_.colorSpace),Ce=r.convert(_.type);let we=y(_.internalFormat,re,Ce,_.colorSpace,_.isVideoTexture);Be(Y,_);let fe;const Pe=_.mipmaps,L=_.isVideoTexture!==!0,he=Me.__version===void 0||K===!0,ae=X.dataReady,oe=P(_,J);if(_.isDepthTexture)we=w(_.format===Ds,_.type),he&&(L?t.texStorage2D(i.TEXTURE_2D,1,we,J.width,J.height):t.texImage2D(i.TEXTURE_2D,0,we,J.width,J.height,0,re,Ce,null));else if(_.isDataTexture)if(Pe.length>0){L&&he&&t.texStorage2D(i.TEXTURE_2D,oe,we,Pe[0].width,Pe[0].height);for(let te=0,j=Pe.length;te<j;te++)fe=Pe[te],L?ae&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,fe.width,fe.height,re,Ce,fe.data):t.texImage2D(i.TEXTURE_2D,te,we,fe.width,fe.height,0,re,Ce,fe.data);_.generateMipmaps=!1}else L?(he&&t.texStorage2D(i.TEXTURE_2D,oe,we,J.width,J.height),ae&&nt(_,J,re,Ce)):t.texImage2D(i.TEXTURE_2D,0,we,J.width,J.height,0,re,Ce,J.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){L&&he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,we,Pe[0].width,Pe[0].height,J.depth);for(let te=0,j=Pe.length;te<j;te++)if(fe=Pe[te],_.format!==xn)if(re!==null)if(L){if(ae)if(_.layerUpdates.size>0){const me=R0(fe.width,fe.height,_.format,_.type);for(const De of _.layerUpdates){const rt=fe.data.subarray(De*me/fe.data.BYTES_PER_ELEMENT,(De+1)*me/fe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,De,fe.width,fe.height,1,re,rt)}_.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,fe.width,fe.height,J.depth,re,fe.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,we,fe.width,fe.height,J.depth,0,fe.data,0,0);else Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else L?ae&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,fe.width,fe.height,J.depth,re,Ce,fe.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,we,fe.width,fe.height,J.depth,0,re,Ce,fe.data)}else{L&&he&&t.texStorage2D(i.TEXTURE_2D,oe,we,Pe[0].width,Pe[0].height);for(let te=0,j=Pe.length;te<j;te++)fe=Pe[te],_.format!==xn?re!==null?L?ae&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,fe.width,fe.height,re,fe.data):t.compressedTexImage2D(i.TEXTURE_2D,te,we,fe.width,fe.height,0,fe.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):L?ae&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,fe.width,fe.height,re,Ce,fe.data):t.texImage2D(i.TEXTURE_2D,te,we,fe.width,fe.height,0,re,Ce,fe.data)}else if(_.isDataArrayTexture)if(L){if(he&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,we,J.width,J.height,J.depth),ae)if(_.layerUpdates.size>0){const te=R0(J.width,J.height,_.format,_.type);for(const j of _.layerUpdates){const me=J.data.subarray(j*te/J.data.BYTES_PER_ELEMENT,(j+1)*te/J.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,J.width,J.height,1,re,Ce,me)}_.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,J.width,J.height,J.depth,re,Ce,J.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,we,J.width,J.height,J.depth,0,re,Ce,J.data);else if(_.isData3DTexture)L?(he&&t.texStorage3D(i.TEXTURE_3D,oe,we,J.width,J.height,J.depth),ae&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,J.width,J.height,J.depth,re,Ce,J.data)):t.texImage3D(i.TEXTURE_3D,0,we,J.width,J.height,J.depth,0,re,Ce,J.data);else if(_.isFramebufferTexture){if(he)if(L)t.texStorage2D(i.TEXTURE_2D,oe,we,J.width,J.height);else{let te=J.width,j=J.height;for(let me=0;me<oe;me++)t.texImage2D(i.TEXTURE_2D,me,we,te,j,0,re,Ce,null),te>>=1,j>>=1}}else if(Pe.length>0){if(L&&he){const te=Ue(Pe[0]);t.texStorage2D(i.TEXTURE_2D,oe,we,te.width,te.height)}for(let te=0,j=Pe.length;te<j;te++)fe=Pe[te],L?ae&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,re,Ce,fe):t.texImage2D(i.TEXTURE_2D,te,we,re,Ce,fe);_.generateMipmaps=!1}else if(L){if(he){const te=Ue(J);t.texStorage2D(i.TEXTURE_2D,oe,we,te.width,te.height)}ae&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,re,Ce,J)}else t.texImage2D(i.TEXTURE_2D,0,we,re,Ce,J);m(_)&&f(Y),Me.__version=X.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function $(T,_,O){if(_.image.length!==6)return;const Y=Ze(T,_),K=_.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+O);const X=n.get(K);if(K.version!==X.__version||Y===!0){t.activeTexture(i.TEXTURE0+O);const Me=Ye.getPrimaries(Ye.workingColorSpace),le=_.colorSpace===ni?null:Ye.getPrimaries(_.colorSpace),Ee=_.colorSpace===ni||Me===le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,_.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,_.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);const _e=_.isCompressedTexture||_.image[0].isCompressedTexture,J=_.image[0]&&_.image[0].isDataTexture,re=[];for(let j=0;j<6;j++)!_e&&!J?re[j]=g(_.image[j],!0,s.maxCubemapSize):re[j]=J?_.image[j].image:_.image[j],re[j]=ye(_,re[j]);const Ce=re[0],we=r.convert(_.format,_.colorSpace),fe=r.convert(_.type),Pe=y(_.internalFormat,we,fe,_.colorSpace),L=_.isVideoTexture!==!0,he=X.__version===void 0||Y===!0,ae=K.dataReady;let oe=P(_,Ce);Be(i.TEXTURE_CUBE_MAP,_);let te;if(_e){L&&he&&t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,Pe,Ce.width,Ce.height);for(let j=0;j<6;j++){te=re[j].mipmaps;for(let me=0;me<te.length;me++){const De=te[me];_.format!==xn?we!==null?L?ae&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,0,0,De.width,De.height,we,De.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,Pe,De.width,De.height,0,De.data):Le("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,0,0,De.width,De.height,we,fe,De.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me,Pe,De.width,De.height,0,we,fe,De.data)}}}else{if(te=_.mipmaps,L&&he){te.length>0&&oe++;const j=Ue(re[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,Pe,j.width,j.height)}for(let j=0;j<6;j++)if(J){L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,re[j].width,re[j].height,we,fe,re[j].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Pe,re[j].width,re[j].height,0,we,fe,re[j].data);for(let me=0;me<te.length;me++){const rt=te[me].image[j].image;L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,0,0,rt.width,rt.height,we,fe,rt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,Pe,rt.width,rt.height,0,we,fe,rt.data)}}else{L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,we,fe,re[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Pe,we,fe,re[j]);for(let me=0;me<te.length;me++){const De=te[me];L?ae&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,0,0,we,fe,De.image[j]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+j,me+1,Pe,we,fe,De.image[j])}}}m(_)&&f(i.TEXTURE_CUBE_MAP),X.__version=K.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function pe(T,_,O,Y,K,X){const Me=r.convert(O.format,O.colorSpace),le=r.convert(O.type),Ee=y(O.internalFormat,Me,le,O.colorSpace),_e=n.get(_),J=n.get(O);if(J.__renderTarget=_,!_e.__hasExternalTextures){const re=Math.max(1,_.width>>X),Ce=Math.max(1,_.height>>X);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?t.texImage3D(K,X,Ee,re,Ce,_.depth,0,Me,le,null):t.texImage2D(K,X,Ee,re,Ce,0,Me,le,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),ge(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,Y,K,J.__webglTexture,0,it(_)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,Y,K,J.__webglTexture,X),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(T,_,O){if(i.bindRenderbuffer(i.RENDERBUFFER,T),_.depthBuffer){const Y=_.depthTexture,K=Y&&Y.isDepthTexture?Y.type:null,X=w(_.stencilBuffer,K),Me=_.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=it(_);ge(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,le,X,_.width,_.height):O?i.renderbufferStorageMultisample(i.RENDERBUFFER,le,X,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,X,_.width,_.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Me,i.RENDERBUFFER,T)}else{const Y=_.textures;for(let K=0;K<Y.length;K++){const X=Y[K],Me=r.convert(X.format,X.colorSpace),le=r.convert(X.type),Ee=y(X.internalFormat,Me,le,X.colorSpace),_e=it(_);O&&ge(_)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,_e,Ee,_.width,_.height):ge(_)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,_e,Ee,_.width,_.height):i.renderbufferStorage(i.RENDERBUFFER,Ee,_.width,_.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function be(T,_){if(_&&_.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Y=n.get(_.depthTexture);Y.__renderTarget=_,(!Y.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),q(_.depthTexture,0);const K=Y.__webglTexture,X=it(_);if(_.depthTexture.format===Ls)ge(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,K,0);else if(_.depthTexture.format===Ds)ge(_)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0,X):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,K,0);else throw new Error("Unknown depthTexture format")}function ze(T){const _=n.get(T),O=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const Y=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),Y){const K=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,Y.removeEventListener("dispose",K)};Y.addEventListener("dispose",K),_.__depthDisposeCallback=K}_.__boundDepthTexture=Y}if(T.depthTexture&&!_.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");const Y=T.texture.mipmaps;Y&&Y.length>0?be(_.__webglFramebuffer[0],T):be(_.__webglFramebuffer,T)}else if(O){_.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[Y]),_.__webglDepthbuffer[Y]===void 0)_.__webglDepthbuffer[Y]=i.createRenderbuffer(),Ie(_.__webglDepthbuffer[Y],T,!1);else{const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=_.__webglDepthbuffer[Y];i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,X)}}else{const Y=T.texture.mipmaps;if(Y&&Y.length>0?t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=i.createRenderbuffer(),Ie(_.__webglDepthbuffer,T,!1);else{const K=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,X=_.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,X),i.framebufferRenderbuffer(i.FRAMEBUFFER,K,i.RENDERBUFFER,X)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function wt(T,_,O){const Y=n.get(T);_!==void 0&&pe(Y.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),O!==void 0&&ze(T)}function ke(T){const _=T.texture,O=n.get(T),Y=n.get(_);T.addEventListener("dispose",C);const K=T.textures,X=T.isWebGLCubeRenderTarget===!0,Me=K.length>1;if(Me||(Y.__webglTexture===void 0&&(Y.__webglTexture=i.createTexture()),Y.__version=_.version,a.memory.textures++),X){O.__webglFramebuffer=[];for(let le=0;le<6;le++)if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer[le]=[];for(let Ee=0;Ee<_.mipmaps.length;Ee++)O.__webglFramebuffer[le][Ee]=i.createFramebuffer()}else O.__webglFramebuffer[le]=i.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){O.__webglFramebuffer=[];for(let le=0;le<_.mipmaps.length;le++)O.__webglFramebuffer[le]=i.createFramebuffer()}else O.__webglFramebuffer=i.createFramebuffer();if(Me)for(let le=0,Ee=K.length;le<Ee;le++){const _e=n.get(K[le]);_e.__webglTexture===void 0&&(_e.__webglTexture=i.createTexture(),a.memory.textures++)}if(T.samples>0&&ge(T)===!1){O.__webglMultisampledFramebuffer=i.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let le=0;le<K.length;le++){const Ee=K[le];O.__webglColorRenderbuffer[le]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,O.__webglColorRenderbuffer[le]);const _e=r.convert(Ee.format,Ee.colorSpace),J=r.convert(Ee.type),re=y(Ee.internalFormat,_e,J,Ee.colorSpace,T.isXRRenderTarget===!0),Ce=it(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,re,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.RENDERBUFFER,O.__webglColorRenderbuffer[le])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(O.__webglDepthRenderbuffer=i.createRenderbuffer(),Ie(O.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(X){t.bindTexture(i.TEXTURE_CUBE_MAP,Y.__webglTexture),Be(i.TEXTURE_CUBE_MAP,_);for(let le=0;le<6;le++)if(_.mipmaps&&_.mipmaps.length>0)for(let Ee=0;Ee<_.mipmaps.length;Ee++)pe(O.__webglFramebuffer[le][Ee],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Ee);else pe(O.__webglFramebuffer[le],T,_,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);m(_)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Me){for(let le=0,Ee=K.length;le<Ee;le++){const _e=K[le],J=n.get(_e);let re=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(re=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(re,J.__webglTexture),Be(re,_e),pe(O.__webglFramebuffer,T,_e,i.COLOR_ATTACHMENT0+le,re,0),m(_e)&&f(re)}t.unbindTexture()}else{let le=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(le=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,Y.__webglTexture),Be(le,_),_.mipmaps&&_.mipmaps.length>0)for(let Ee=0;Ee<_.mipmaps.length;Ee++)pe(O.__webglFramebuffer[Ee],T,_,i.COLOR_ATTACHMENT0,le,Ee);else pe(O.__webglFramebuffer,T,_,i.COLOR_ATTACHMENT0,le,0);m(_)&&f(le),t.unbindTexture()}T.depthBuffer&&ze(T)}function at(T){const _=T.textures;for(let O=0,Y=_.length;O<Y;O++){const K=_[O];if(m(K)){const X=M(T),Me=n.get(K).__webglTexture;t.bindTexture(X,Me),f(X),t.unbindTexture()}}}const R=[],Ve=[];function Ge(T){if(T.samples>0){if(ge(T)===!1){const _=T.textures,O=T.width,Y=T.height;let K=i.COLOR_BUFFER_BIT;const X=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=n.get(T),le=_.length>1;if(le)for(let _e=0;_e<_.length;_e++)t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,Me.__webglMultisampledFramebuffer);const Ee=T.texture.mipmaps;Ee&&Ee.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let _e=0;_e<_.length;_e++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),le){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Me.__webglColorRenderbuffer[_e]);const J=n.get(_[_e]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,J,0)}i.blitFramebuffer(0,0,O,Y,0,0,O,Y,K,i.NEAREST),l===!0&&(R.length=0,Ve.length=0,R.push(i.COLOR_ATTACHMENT0+_e),T.depthBuffer&&T.resolveDepthBuffer===!1&&(R.push(X),Ve.push(X),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ve)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,R))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),le)for(let _e=0;_e<_.length;_e++){t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.RENDERBUFFER,Me.__webglColorRenderbuffer[_e]);const J=n.get(_[_e]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,Me.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+_e,i.TEXTURE_2D,J,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,Me.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const _=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[_])}}}function it(T){return Math.min(s.maxSamples,T.samples)}function ge(T){const _=n.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function ot(T){const _=a.render.frame;h.get(T)!==_&&(h.set(T,_),T.update())}function ye(T,_){const O=T.colorSpace,Y=T.format,K=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||O!==as&&O!==ni&&(Ye.getTransfer(O)===Je?(Y!==xn||K!==An)&&Le("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):xt("WebGLTextures: Unsupported texture color space:",O)),_}function Ue(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=B,this.setTexture2D=q,this.setTexture2DArray=H,this.setTexture3D=ee,this.setTextureCube=V,this.rebindTextures=wt,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=at,this.updateMultisampleRenderTarget=Ge,this.setupDepthRenderbuffer=ze,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=ge}function Op(i,e){function t(n,s=ni){let r;const a=Ye.getTransfer(s);if(n===An)return i.UNSIGNED_BYTE;if(n===Mo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===bo)return i.UNSIGNED_SHORT_5_5_5_1;if(n===xc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===gc)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===pc)return i.BYTE;if(n===mc)return i.SHORT;if(n===Rs)return i.UNSIGNED_SHORT;if(n===vo)return i.INT;if(n===wi)return i.UNSIGNED_INT;if(n===Hn)return i.FLOAT;if(n===hs)return i.HALF_FLOAT;if(n===_c)return i.ALPHA;if(n===vc)return i.RGB;if(n===xn)return i.RGBA;if(n===Ls)return i.DEPTH_COMPONENT;if(n===Ds)return i.DEPTH_STENCIL;if(n===Mc)return i.RED;if(n===So)return i.RED_INTEGER;if(n===yo)return i.RG;if(n===Eo)return i.RG_INTEGER;if(n===To)return i.RGBA_INTEGER;if(n===gr||n===_r||n===vr||n===Mr)if(a===Je)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===_r)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Mr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ka||n===za||n===Va||n===Ga)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ka)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===za)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Va)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ga)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ha||n===Wa||n===Xa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ha||n===Wa)return a===Je?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Xa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===qa||n===Ya||n===Za||n===ja||n===Ka||n===$a||n===Ja||n===Qa||n===eo||n===to||n===no||n===io||n===so||n===ro)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===qa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ya)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Za)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ja)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Ka)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===$a)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ja)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Qa)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===eo)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===to)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===no)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===io)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===so)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ro)return a===Je?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ao||n===oo||n===co)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ao)return a===Je?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===oo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===co)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===lo||n===ho||n===uo||n===fo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===lo)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ho)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===uo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===fo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ps?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const Bp=`
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

}`;class zp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Uc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new qn({vertexShader:Bp,fragmentShader:kp,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new jt(new gn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Vp extends Di{constructor(e,t){super();const n=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,x=null;const g=typeof XRWebGLBinding<"u",m=new zp,f={},M=t.getContextAttributes();let y=null,w=null;const P=[],E=[],C=new Fe;let U=null;const S=new tn;S.viewport=new gt;const b=new tn;b.viewport=new gt;const A=[S,b],B=new nu;let z=null,W=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let $=P[Z];return $===void 0&&($=new fa,P[Z]=$),$.getTargetRaySpace()},this.getControllerGrip=function(Z){let $=P[Z];return $===void 0&&($=new fa,P[Z]=$),$.getGripSpace()},this.getHand=function(Z){let $=P[Z];return $===void 0&&($=new fa,P[Z]=$),$.getHandSpace()};function q(Z){const $=E.indexOf(Z.inputSource);if($===-1)return;const pe=P[$];pe!==void 0&&(pe.update(Z.inputSource,Z.frame,c||a),pe.dispatchEvent({type:Z.type,data:Z.inputSource}))}function H(){s.removeEventListener("select",q),s.removeEventListener("selectstart",q),s.removeEventListener("selectend",q),s.removeEventListener("squeeze",q),s.removeEventListener("squeezestart",q),s.removeEventListener("squeezeend",q),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",ee);for(let Z=0;Z<P.length;Z++){const $=E[Z];$!==null&&(E[Z]=null,P[Z].disconnect($))}z=null,W=null,m.reset();for(const Z in f)delete f[Z];e.setRenderTarget(y),p=null,u=null,d=null,s=null,w=null,nt.stop(),n.isPresenting=!1,e.setPixelRatio(U),e.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Le("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){o=Z,n.isPresenting===!0&&Le("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d===null&&g&&(d=new XRWebGLBinding(s,t)),d},this.getFrame=function(){return x},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",q),s.addEventListener("selectstart",q),s.addEventListener("selectend",q),s.addEventListener("squeeze",q),s.addEventListener("squeezestart",q),s.addEventListener("squeezeend",q),s.addEventListener("end",H),s.addEventListener("inputsourceschange",ee),M.xrCompatible!==!0&&await t.makeXRCompatible(),U=e.getPixelRatio(),e.getSize(C),g&&"createProjectionLayer"in XRWebGLBinding.prototype){let pe=null,Ie=null,be=null;M.depth&&(be=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,pe=M.stencil?Ds:Ls,Ie=M.stencil?Ps:wi);const ze={colorFormat:t.RGBA8,depthFormat:be,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(ze),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),w=new Ai(u.textureWidth,u.textureHeight,{format:xn,type:An,depthTexture:new Dc(u.textureWidth,u.textureHeight,Ie,void 0,void 0,void 0,void 0,void 0,void 0,pe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const pe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,pe),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),w=new Ai(p.framebufferWidth,p.framebufferHeight,{format:xn,type:An,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),nt.setContext(s),nt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ee(Z){for(let $=0;$<Z.removed.length;$++){const pe=Z.removed[$],Ie=E.indexOf(pe);Ie>=0&&(E[Ie]=null,P[Ie].disconnect(pe))}for(let $=0;$<Z.added.length;$++){const pe=Z.added[$];let Ie=E.indexOf(pe);if(Ie===-1){for(let ze=0;ze<P.length;ze++)if(ze>=E.length){E.push(pe),Ie=ze;break}else if(E[ze]===null){E[ze]=pe,Ie=ze;break}if(Ie===-1)break}const be=P[Ie];be&&be.connect(pe)}}const V=new F,ne=new F;function ie(Z,$,pe){V.setFromMatrixPosition($.matrixWorld),ne.setFromMatrixPosition(pe.matrixWorld);const Ie=V.distanceTo(ne),be=$.projectionMatrix.elements,ze=pe.projectionMatrix.elements,wt=be[14]/(be[10]-1),ke=be[14]/(be[10]+1),at=(be[9]+1)/be[5],R=(be[9]-1)/be[5],Ve=(be[8]-1)/be[0],Ge=(ze[8]+1)/ze[0],it=wt*Ve,ge=wt*Ge,ot=Ie/(-Ve+Ge),ye=ot*-Ve;if($.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(ye),Z.translateZ(ot),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),be[10]===-1)Z.projectionMatrix.copy($.projectionMatrix),Z.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const Ue=wt+ot,T=ke+ot,_=it-ye,O=ge+(Ie-ye),Y=at*ke/T*Ue,K=R*ke/T*Ue;Z.projectionMatrix.makePerspective(_,O,Y,K,Ue,T),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function ve(Z,$){$===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices($.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let $=Z.near,pe=Z.far;m.texture!==null&&(m.depthNear>0&&($=m.depthNear),m.depthFar>0&&(pe=m.depthFar)),B.near=b.near=S.near=$,B.far=b.far=S.far=pe,(z!==B.near||W!==B.far)&&(s.updateRenderState({depthNear:B.near,depthFar:B.far}),z=B.near,W=B.far),B.layers.mask=Z.layers.mask|6,S.layers.mask=B.layers.mask&3,b.layers.mask=B.layers.mask&5;const Ie=Z.parent,be=B.cameras;ve(B,Ie);for(let ze=0;ze<be.length;ze++)ve(be[ze],Ie);be.length===2?ie(B,S,b):B.projectionMatrix.copy(S.projectionMatrix),Be(Z,B,Ie)};function Be(Z,$,pe){pe===null?Z.matrix.copy($.matrixWorld):(Z.matrix.copy(pe.matrixWorld),Z.matrix.invert(),Z.matrix.multiply($.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy($.projectionMatrix),Z.projectionMatrixInverse.copy($.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Is*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(B)},this.getCameraTexture=function(Z){return f[Z]};let Ze=null;function tt(Z,$){if(h=$.getViewerPose(c||a),x=$,h!==null){const pe=h.views;p!==null&&(e.setRenderTargetFramebuffer(w,p.framebuffer),e.setRenderTarget(w));let Ie=!1;pe.length!==B.cameras.length&&(B.cameras.length=0,Ie=!0);for(let ke=0;ke<pe.length;ke++){const at=pe[ke];let R=null;if(p!==null)R=p.getViewport(at);else{const Ge=d.getViewSubImage(u,at);R=Ge.viewport,ke===0&&(e.setRenderTargetTextures(w,Ge.colorTexture,Ge.depthStencilTexture),e.setRenderTarget(w))}let Ve=A[ke];Ve===void 0&&(Ve=new tn,Ve.layers.enable(ke),Ve.viewport=new gt,A[ke]=Ve),Ve.matrix.fromArray(at.transform.matrix),Ve.matrix.decompose(Ve.position,Ve.quaternion,Ve.scale),Ve.projectionMatrix.fromArray(at.projectionMatrix),Ve.projectionMatrixInverse.copy(Ve.projectionMatrix).invert(),Ve.viewport.set(R.x,R.y,R.width,R.height),ke===0&&(B.matrix.copy(Ve.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Ie===!0&&B.cameras.push(Ve)}const be=s.enabledFeatures;if(be&&be.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&g){d=n.getBinding();const ke=d.getDepthInformation(pe[0]);ke&&ke.isValid&&ke.texture&&m.init(ke,s.renderState)}if(be&&be.includes("camera-access")&&g){e.state.unbindTexture(),d=n.getBinding();for(let ke=0;ke<pe.length;ke++){const at=pe[ke].camera;if(at){let R=f[at];R||(R=new Uc,f[at]=R);const Ve=d.getCameraImage(at);R.sourceTexture=Ve}}}}for(let pe=0;pe<P.length;pe++){const Ie=E[pe],be=P[pe];Ie!==null&&be!==void 0&&be.update(Ie,$,c||a)}Ze&&Ze(Z,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),x=null}const nt=new Fc;nt.setAnimationLoop(tt),this.setAnimationLoop=function(Z){Ze=Z},this.dispose=function(){}}}const vi=new Cn,Gp=new ft;function Hp(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,Cc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,M,y,w){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),d(m,f)):f.isMeshPhongMaterial?(r(m,f),h(m,f)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,w)):f.isMeshMatcapMaterial?(r(m,f),x(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),g(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(a(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,M,y):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ot&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ot&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const M=e.get(f),y=M.envMap,w=M.envMapRotation;y&&(m.envMap.value=y,vi.copy(w),vi.x*=-1,vi.y*=-1,vi.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(vi.y*=-1,vi.z*=-1),m.envMapRotation.value.setFromMatrix4(Gp.makeRotationFromEuler(vi)),m.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function a(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,M,y){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=y*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function h(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function d(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ot&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,f){f.matcap&&(m.matcap.value=f.matcap)}function g(m,f){const M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Wp(i,e,t,n){let s={},r={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,y){const w=y.program;n.uniformBlockBinding(M,w)}function c(M,y){let w=s[M.id];w===void 0&&(x(M),w=h(M),s[M.id]=w,M.addEventListener("dispose",m));const P=y.program;n.updateUBOMapping(M,P);const E=e.render.frame;r[M.id]!==E&&(u(M),r[M.id]=E)}function h(M){const y=d();M.__bindingPointIndex=y;const w=i.createBuffer(),P=M.__size,E=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,P,E),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,y,w),w}function d(){for(let M=0;M<o;M++)if(a.indexOf(M)===-1)return a.push(M),M;return xt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(M){const y=s[M.id],w=M.uniforms,P=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,y);for(let E=0,C=w.length;E<C;E++){const U=Array.isArray(w[E])?w[E]:[w[E]];for(let S=0,b=U.length;S<b;S++){const A=U[S];if(p(A,E,S,P)===!0){const B=A.__offset,z=Array.isArray(A.value)?A.value:[A.value];let W=0;for(let q=0;q<z.length;q++){const H=z[q],ee=g(H);typeof H=="number"||typeof H=="boolean"?(A.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,B+W,A.__data)):H.isMatrix3?(A.__data[0]=H.elements[0],A.__data[1]=H.elements[1],A.__data[2]=H.elements[2],A.__data[3]=0,A.__data[4]=H.elements[3],A.__data[5]=H.elements[4],A.__data[6]=H.elements[5],A.__data[7]=0,A.__data[8]=H.elements[6],A.__data[9]=H.elements[7],A.__data[10]=H.elements[8],A.__data[11]=0):(H.toArray(A.__data,W),W+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,B,A.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,y,w,P){const E=M.value,C=y+"_"+w;if(P[C]===void 0)return typeof E=="number"||typeof E=="boolean"?P[C]=E:P[C]=E.clone(),!0;{const U=P[C];if(typeof E=="number"||typeof E=="boolean"){if(U!==E)return P[C]=E,!0}else if(U.equals(E)===!1)return U.copy(E),!0}return!1}function x(M){const y=M.uniforms;let w=0;const P=16;for(let C=0,U=y.length;C<U;C++){const S=Array.isArray(y[C])?y[C]:[y[C]];for(let b=0,A=S.length;b<A;b++){const B=S[b],z=Array.isArray(B.value)?B.value:[B.value];for(let W=0,q=z.length;W<q;W++){const H=z[W],ee=g(H),V=w%P,ne=V%ee.boundary,ie=V+ne;w+=ne,ie!==0&&P-ie<ee.storage&&(w+=P-ie),B.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=w,w+=ee.storage}}}const E=w%P;return E>0&&(w+=P-E),M.__size=w,M.__cache={},this}function g(M){const y={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(y.boundary=4,y.storage=4):M.isVector2?(y.boundary=8,y.storage=8):M.isVector3||M.isColor?(y.boundary=16,y.storage=12):M.isVector4?(y.boundary=16,y.storage=16):M.isMatrix3?(y.boundary=48,y.storage=48):M.isMatrix4?(y.boundary=64,y.storage=64):M.isTexture?Le("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Le("WebGLRenderer: Unsupported uniform value type.",M),y}function m(M){const y=M.target;y.removeEventListener("dispose",m);const w=a.indexOf(y.__bindingPointIndex);a.splice(w,1),i.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function f(){for(const M in s)i.deleteBuffer(s[M]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}const Xp=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let Nn=null;function qp(){return Nn===null&&(Nn=new Xh(Xp,32,32,yo,hs),Nn.minFilter=sn,Nn.magFilter=sn,Nn.wrapS=Gn,Nn.wrapT=Gn,Nn.generateMipmaps=!1,Nn.needsUpdate=!0),Nn}class Yp{constructor(e={}){const{canvas:t=nh(),context:n=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const x=new Set([To,Eo,So]),g=new Set([An,wi,Rs,Ps,Mo,bo]),m=new Uint32Array(4),f=new Int32Array(4);let M=null,y=null;const w=[],P=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const E=this;let C=!1;this._outputColorSpace=Ct;let U=0,S=0,b=null,A=-1,B=null;const z=new gt,W=new gt;let q=null;const H=new Xe(0);let ee=0,V=t.width,ne=t.height,ie=1,ve=null,Be=null;const Ze=new gt(0,0,V,ne),tt=new gt(0,0,V,ne);let nt=!1;const Z=new Po;let $=!1,pe=!1;const Ie=new ft,be=new F,ze=new gt,wt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ke=!1;function at(){return b===null?ie:1}let R=n;function Ve(v,I){return t.getContext(v,I)}try{const v={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${_o}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",j,!1),t.addEventListener("webglcontextcreationerror",me,!1),R===null){const I="webgl2";if(R=Ve(I,v),R===null)throw Ve(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw v("WebGLRenderer: "+v.message),v}let Ge,it,ge,ot,ye,Ue,T,_,O,Y,K,X,Me,le,Ee,_e,J,re,Ce,we,fe,Pe,L,he;function ae(){Ge=new t1(R),Ge.init(),Pe=new Op(R,Ge),it=new qd(R,Ge,e,Pe),ge=new Np(R,Ge),it.reversedDepthBuffer&&u&&ge.buffers.depth.setReversed(!0),ot=new s1(R),ye=new Sp,Ue=new Fp(R,Ge,ge,ye,it,Pe,ot),T=new Zd(E),_=new e1(E),O=new ou(R),L=new Wd(R,O),Y=new n1(R,O,ot,L),K=new a1(R,Y,O,ot),Ce=new r1(R,it,Ue),_e=new Yd(ye),X=new bp(E,T,_,Ge,it,L,_e),Me=new Hp(E,ye),le=new Ep,Ee=new Pp(Ge),re=new Hd(E,T,_,ge,K,p,l),J=new Up(E,K,it),he=new Wp(R,ot,it,ge),we=new Xd(R,Ge,ot),fe=new i1(R,Ge,ot),ot.programs=X.programs,E.capabilities=it,E.extensions=Ge,E.properties=ye,E.renderLists=le,E.shadowMap=J,E.state=ge,E.info=ot}ae();const oe=new Vp(E,R);this.xr=oe,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const v=Ge.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Ge.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(v){v!==void 0&&(ie=v,this.setSize(V,ne,!1))},this.getSize=function(v){return v.set(V,ne)},this.setSize=function(v,I,k=!0){if(oe.isPresenting){Le("WebGLRenderer: Can't change size while VR device is presenting.");return}V=v,ne=I,t.width=Math.floor(v*ie),t.height=Math.floor(I*ie),k===!0&&(t.style.width=v+"px",t.style.height=I+"px"),this.setViewport(0,0,v,I)},this.getDrawingBufferSize=function(v){return v.set(V*ie,ne*ie).floor()},this.setDrawingBufferSize=function(v,I,k){V=v,ne=I,ie=k,t.width=Math.floor(v*k),t.height=Math.floor(I*k),this.setViewport(0,0,v,I)},this.getCurrentViewport=function(v){return v.copy(z)},this.getViewport=function(v){return v.copy(Ze)},this.setViewport=function(v,I,k,G){v.isVector4?Ze.set(v.x,v.y,v.z,v.w):Ze.set(v,I,k,G),ge.viewport(z.copy(Ze).multiplyScalar(ie).round())},this.getScissor=function(v){return v.copy(tt)},this.setScissor=function(v,I,k,G){v.isVector4?tt.set(v.x,v.y,v.z,v.w):tt.set(v,I,k,G),ge.scissor(W.copy(tt).multiplyScalar(ie).round())},this.getScissorTest=function(){return nt},this.setScissorTest=function(v){ge.setScissorTest(nt=v)},this.setOpaqueSort=function(v){ve=v},this.setTransparentSort=function(v){Be=v},this.getClearColor=function(v){return v.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor(...arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha(...arguments)},this.clear=function(v=!0,I=!0,k=!0){let G=0;if(v){let N=!1;if(b!==null){const se=b.texture.format;N=x.has(se)}if(N){const se=b.texture.type,ue=g.has(se),xe=re.getClearColor(),de=re.getClearAlpha(),Ae=xe.r,Re=xe.g,Se=xe.b;ue?(m[0]=Ae,m[1]=Re,m[2]=Se,m[3]=de,R.clearBufferuiv(R.COLOR,0,m)):(f[0]=Ae,f[1]=Re,f[2]=Se,f[3]=de,R.clearBufferiv(R.COLOR,0,f))}else G|=R.COLOR_BUFFER_BIT}I&&(G|=R.DEPTH_BUFFER_BIT),k&&(G|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",j,!1),t.removeEventListener("webglcontextcreationerror",me,!1),re.dispose(),le.dispose(),Ee.dispose(),ye.dispose(),T.dispose(),_.dispose(),K.dispose(),L.dispose(),he.dispose(),X.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",Ho),oe.removeEventListener("sessionend",Wo),fi.stop()};function te(v){v.preventDefault(),r0("WebGLRenderer: Context Lost."),C=!0}function j(){r0("WebGLRenderer: Context Restored."),C=!1;const v=ot.autoReset,I=J.enabled,k=J.autoUpdate,G=J.needsUpdate,N=J.type;ae(),ot.autoReset=v,J.enabled=I,J.autoUpdate=k,J.needsUpdate=G,J.type=N}function me(v){xt("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function De(v){const I=v.target;I.removeEventListener("dispose",De),rt(I)}function rt(v){Ke(v),ye.remove(v)}function Ke(v){const I=ye.get(v).programs;I!==void 0&&(I.forEach(function(k){X.releaseProgram(k)}),v.isShaderMaterial&&X.releaseShaderCache(v))}this.renderBufferDirect=function(v,I,k,G,N,se){I===null&&(I=wt);const ue=N.isMesh&&N.matrixWorld.determinant()<0,xe=al(v,I,k,G,N);ge.setMaterial(G,ue);let de=k.index,Ae=1;if(G.wireframe===!0){if(de=Y.getWireframeAttribute(k),de===void 0)return;Ae=2}const Re=k.drawRange,Se=k.attributes.position;let He=Re.start*Ae,$e=(Re.start+Re.count)*Ae;se!==null&&(He=Math.max(He,se.start*Ae),$e=Math.min($e,(se.start+se.count)*Ae)),de!==null?(He=Math.max(He,0),$e=Math.min($e,de.count)):Se!=null&&(He=Math.max(He,0),$e=Math.min($e,Se.count));const dt=$e-He;if(dt<0||dt===1/0)return;L.setup(N,G,xe,k,de);let pt,et=we;if(de!==null&&(pt=O.get(de),et=fe,et.setIndex(pt)),N.isMesh)G.wireframe===!0?(ge.setLineWidth(G.wireframeLinewidth*at()),et.setMode(R.LINES)):et.setMode(R.TRIANGLES);else if(N.isLine){let Te=G.linewidth;Te===void 0&&(Te=1),ge.setLineWidth(Te*at()),N.isLineSegments?et.setMode(R.LINES):N.isLineLoop?et.setMode(R.LINE_LOOP):et.setMode(R.LINE_STRIP)}else N.isPoints?et.setMode(R.POINTS):N.isSprite&&et.setMode(R.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Us("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),et.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ge.get("WEBGL_multi_draw"))et.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const Te=N._multiDrawStarts,ct=N._multiDrawCounts,qe=N._multiDrawCount,Vt=de?O.get(de).bytesPerElement:1,Ii=ye.get(G).currentProgram.getUniforms();for(let Gt=0;Gt<qe;Gt++)Ii.setValue(R,"_gl_DrawID",Gt),et.render(Te[Gt]/Vt,ct[Gt])}else if(N.isInstancedMesh)et.renderInstances(He,dt,N.count);else if(k.isInstancedBufferGeometry){const Te=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,ct=Math.min(k.instanceCount,Te);et.renderInstances(He,dt,ct)}else et.render(He,dt)};function Mn(v,I,k){v.transparent===!0&&v.side===mt&&v.forceSinglePass===!1?(v.side=Ot,v.needsUpdate=!0,Gs(v,I,k),v.side=_n,v.needsUpdate=!0,Gs(v,I,k),v.side=mt):Gs(v,I,k)}this.compile=function(v,I,k=null){k===null&&(k=v),y=Ee.get(k),y.init(I),P.push(y),k.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(y.pushLight(N),N.castShadow&&y.pushShadow(N))}),v!==k&&v.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(y.pushLight(N),N.castShadow&&y.pushShadow(N))}),y.setupLights();const G=new Set;return v.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;const se=N.material;if(se)if(Array.isArray(se))for(let ue=0;ue<se.length;ue++){const xe=se[ue];Mn(xe,k,N),G.add(xe)}else Mn(se,k,N),G.add(se)}),y=P.pop(),G},this.compileAsync=function(v,I,k=null){const G=this.compile(v,I,k);return new Promise(N=>{function se(){if(G.forEach(function(ue){ye.get(ue).currentProgram.isReady()&&G.delete(ue)}),G.size===0){N(v);return}setTimeout(se,10)}Ge.get("KHR_parallel_shader_compile")!==null?se():setTimeout(se,10)})};let on=null;function rl(v){on&&on(v)}function Ho(){fi.stop()}function Wo(){fi.start()}const fi=new Fc;fi.setAnimationLoop(rl),typeof self<"u"&&fi.setContext(self),this.setAnimationLoop=function(v){on=v,oe.setAnimationLoop(v),v===null?fi.stop():fi.start()},oe.addEventListener("sessionstart",Ho),oe.addEventListener("sessionend",Wo),this.render=function(v,I){if(I!==void 0&&I.isCamera!==!0){xt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(I),I=oe.getCamera()),v.isScene===!0&&v.onBeforeRender(E,v,I,b),y=Ee.get(v,P.length),y.init(I),P.push(y),Ie.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Z.setFromProjectionMatrix(Ie,En,I.reversedDepth),pe=this.localClippingEnabled,$=_e.init(this.clippingPlanes,pe),M=le.get(v,w.length),M.init(),w.push(M),oe.enabled===!0&&oe.isPresenting===!0){const se=E.xr.getDepthSensingMesh();se!==null&&Hr(se,I,-1/0,E.sortObjects)}Hr(v,I,0,E.sortObjects),M.finish(),E.sortObjects===!0&&M.sort(ve,Be),ke=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,ke&&re.addToRenderList(M,v),this.info.render.frame++,$===!0&&_e.beginShadows();const k=y.state.shadowsArray;J.render(k,v,I),$===!0&&_e.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=M.opaque,N=M.transmissive;if(y.setupLights(),I.isArrayCamera){const se=I.cameras;if(N.length>0)for(let ue=0,xe=se.length;ue<xe;ue++){const de=se[ue];qo(G,N,v,de)}ke&&re.render(v);for(let ue=0,xe=se.length;ue<xe;ue++){const de=se[ue];Xo(M,v,de,de.viewport)}}else N.length>0&&qo(G,N,v,I),ke&&re.render(v),Xo(M,v,I);b!==null&&S===0&&(Ue.updateMultisampleRenderTarget(b),Ue.updateRenderTargetMipmap(b)),v.isScene===!0&&v.onAfterRender(E,v,I),L.resetDefaultState(),A=-1,B=null,P.pop(),P.length>0?(y=P[P.length-1],$===!0&&_e.setGlobalState(E.clippingPlanes,y.state.camera)):y=null,w.pop(),w.length>0?M=w[w.length-1]:M=null};function Hr(v,I,k,G){if(v.visible===!1)return;if(v.layers.test(I.layers)){if(v.isGroup)k=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(I);else if(v.isLight)y.pushLight(v),v.castShadow&&y.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||Z.intersectsSprite(v)){G&&ze.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ie);const ue=K.update(v),xe=v.material;xe.visible&&M.push(v,ue,xe,k,ze.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||Z.intersectsObject(v))){const ue=K.update(v),xe=v.material;if(G&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),ze.copy(v.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),ze.copy(ue.boundingSphere.center)),ze.applyMatrix4(v.matrixWorld).applyMatrix4(Ie)),Array.isArray(xe)){const de=ue.groups;for(let Ae=0,Re=de.length;Ae<Re;Ae++){const Se=de[Ae],He=xe[Se.materialIndex];He&&He.visible&&M.push(v,ue,He,k,ze.z,Se)}}else xe.visible&&M.push(v,ue,xe,k,ze.z,null)}}const se=v.children;for(let ue=0,xe=se.length;ue<xe;ue++)Hr(se[ue],I,k,G)}function Xo(v,I,k,G){const{opaque:N,transmissive:se,transparent:ue}=v;y.setupLightsView(k),$===!0&&_e.setGlobalState(E.clippingPlanes,k),G&&ge.viewport(z.copy(G)),N.length>0&&Vs(N,I,k),se.length>0&&Vs(se,I,k),ue.length>0&&Vs(ue,I,k),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function qo(v,I,k,G){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[G.id]===void 0&&(y.state.transmissionRenderTarget[G.id]=new Ai(1,1,{generateMipmaps:!0,type:Ge.has("EXT_color_buffer_half_float")||Ge.has("EXT_color_buffer_float")?hs:An,minFilter:Ei,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ye.workingColorSpace}));const se=y.state.transmissionRenderTarget[G.id],ue=G.viewport||z;se.setSize(ue.z*E.transmissionResolutionScale,ue.w*E.transmissionResolutionScale);const xe=E.getRenderTarget(),de=E.getActiveCubeFace(),Ae=E.getActiveMipmapLevel();E.setRenderTarget(se),E.getClearColor(H),ee=E.getClearAlpha(),ee<1&&E.setClearColor(16777215,.5),E.clear(),ke&&re.render(k);const Re=E.toneMapping;E.toneMapping=li;const Se=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),y.setupLightsView(G),$===!0&&_e.setGlobalState(E.clippingPlanes,G),Vs(v,k,G),Ue.updateMultisampleRenderTarget(se),Ue.updateRenderTargetMipmap(se),Ge.has("WEBGL_multisampled_render_to_texture")===!1){let He=!1;for(let $e=0,dt=I.length;$e<dt;$e++){const pt=I[$e],{object:et,geometry:Te,material:ct,group:qe}=pt;if(ct.side===mt&&et.layers.test(G.layers)){const Vt=ct.side;ct.side=Ot,ct.needsUpdate=!0,Yo(et,k,G,Te,ct,qe),ct.side=Vt,ct.needsUpdate=!0,He=!0}}He===!0&&(Ue.updateMultisampleRenderTarget(se),Ue.updateRenderTargetMipmap(se))}E.setRenderTarget(xe,de,Ae),E.setClearColor(H,ee),Se!==void 0&&(G.viewport=Se),E.toneMapping=Re}function Vs(v,I,k){const G=I.isScene===!0?I.overrideMaterial:null;for(let N=0,se=v.length;N<se;N++){const ue=v[N],{object:xe,geometry:de,group:Ae}=ue;let Re=ue.material;Re.allowOverride===!0&&G!==null&&(Re=G),xe.layers.test(k.layers)&&Yo(xe,I,k,de,Re,Ae)}}function Yo(v,I,k,G,N,se){v.onBeforeRender(E,I,k,G,N,se),v.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),N.onBeforeRender(E,I,k,G,v,se),N.transparent===!0&&N.side===mt&&N.forceSinglePass===!1?(N.side=Ot,N.needsUpdate=!0,E.renderBufferDirect(k,I,G,N,v,se),N.side=_n,N.needsUpdate=!0,E.renderBufferDirect(k,I,G,N,v,se),N.side=mt):E.renderBufferDirect(k,I,G,N,v,se),v.onAfterRender(E,I,k,G,N,se)}function Gs(v,I,k){I.isScene!==!0&&(I=wt);const G=ye.get(v),N=y.state.lights,se=y.state.shadowsArray,ue=N.state.version,xe=X.getParameters(v,N.state,se,I,k),de=X.getProgramCacheKey(xe);let Ae=G.programs;G.environment=v.isMeshStandardMaterial?I.environment:null,G.fog=I.fog,G.envMap=(v.isMeshStandardMaterial?_:T).get(v.envMap||G.environment),G.envMapRotation=G.environment!==null&&v.envMap===null?I.environmentRotation:v.envMapRotation,Ae===void 0&&(v.addEventListener("dispose",De),Ae=new Map,G.programs=Ae);let Re=Ae.get(de);if(Re!==void 0){if(G.currentProgram===Re&&G.lightsStateVersion===ue)return jo(v,xe),Re}else xe.uniforms=X.getUniforms(v),v.onBeforeCompile(xe,E),Re=X.acquireProgram(xe,de),Ae.set(de,Re),G.uniforms=xe.uniforms;const Se=G.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Se.clippingPlanes=_e.uniform),jo(v,xe),G.needsLights=cl(v),G.lightsStateVersion=ue,G.needsLights&&(Se.ambientLightColor.value=N.state.ambient,Se.lightProbe.value=N.state.probe,Se.directionalLights.value=N.state.directional,Se.directionalLightShadows.value=N.state.directionalShadow,Se.spotLights.value=N.state.spot,Se.spotLightShadows.value=N.state.spotShadow,Se.rectAreaLights.value=N.state.rectArea,Se.ltc_1.value=N.state.rectAreaLTC1,Se.ltc_2.value=N.state.rectAreaLTC2,Se.pointLights.value=N.state.point,Se.pointLightShadows.value=N.state.pointShadow,Se.hemisphereLights.value=N.state.hemi,Se.directionalShadowMap.value=N.state.directionalShadowMap,Se.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Se.spotShadowMap.value=N.state.spotShadowMap,Se.spotLightMatrix.value=N.state.spotLightMatrix,Se.spotLightMap.value=N.state.spotLightMap,Se.pointShadowMap.value=N.state.pointShadowMap,Se.pointShadowMatrix.value=N.state.pointShadowMatrix),G.currentProgram=Re,G.uniformsList=null,Re}function Zo(v){if(v.uniformsList===null){const I=v.currentProgram.getUniforms();v.uniformsList=br.seqWithValue(I.seq,v.uniforms)}return v.uniformsList}function jo(v,I){const k=ye.get(v);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.batchingColor=I.batchingColor,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.instancingMorph=I.instancingMorph,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function al(v,I,k,G,N){I.isScene!==!0&&(I=wt),Ue.resetTextureUnits();const se=I.fog,ue=G.isMeshStandardMaterial?I.environment:null,xe=b===null?E.outputColorSpace:b.isXRRenderTarget===!0?b.texture.colorSpace:as,de=(G.isMeshStandardMaterial?_:T).get(G.envMap||ue),Ae=G.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Re=!!k.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Se=!!k.morphAttributes.position,He=!!k.morphAttributes.normal,$e=!!k.morphAttributes.color;let dt=li;G.toneMapped&&(b===null||b.isXRRenderTarget===!0)&&(dt=E.toneMapping);const pt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,et=pt!==void 0?pt.length:0,Te=ye.get(G),ct=y.state.lights;if($===!0&&(pe===!0||v!==B)){const It=v===B&&G.id===A;_e.setState(G,v,It)}let qe=!1;G.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==ct.state.version||Te.outputColorSpace!==xe||N.isBatchedMesh&&Te.batching===!1||!N.isBatchedMesh&&Te.batching===!0||N.isBatchedMesh&&Te.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Te.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Te.instancing===!1||!N.isInstancedMesh&&Te.instancing===!0||N.isSkinnedMesh&&Te.skinning===!1||!N.isSkinnedMesh&&Te.skinning===!0||N.isInstancedMesh&&Te.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Te.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Te.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Te.instancingMorph===!1&&N.morphTexture!==null||Te.envMap!==de||G.fog===!0&&Te.fog!==se||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==_e.numPlanes||Te.numIntersection!==_e.numIntersection)||Te.vertexAlphas!==Ae||Te.vertexTangents!==Re||Te.morphTargets!==Se||Te.morphNormals!==He||Te.morphColors!==$e||Te.toneMapping!==dt||Te.morphTargetsCount!==et)&&(qe=!0):(qe=!0,Te.__version=G.version);let Vt=Te.currentProgram;qe===!0&&(Vt=Gs(G,I,N));let Ii=!1,Gt=!1,ms=!1;const lt=Vt.getUniforms(),Bt=Te.uniforms;if(ge.useProgram(Vt.program)&&(Ii=!0,Gt=!0,ms=!0),G.id!==A&&(A=G.id,Gt=!0),Ii||B!==v){ge.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),lt.setValue(R,"projectionMatrix",v.projectionMatrix),lt.setValue(R,"viewMatrix",v.matrixWorldInverse);const kt=lt.map.cameraPosition;kt!==void 0&&kt.setValue(R,be.setFromMatrixPosition(v.matrixWorld)),it.logarithmicDepthBuffer&&lt.setValue(R,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&lt.setValue(R,"isOrthographic",v.isOrthographicCamera===!0),B!==v&&(B=v,Gt=!0,ms=!0)}if(N.isSkinnedMesh){lt.setOptional(R,N,"bindMatrix"),lt.setOptional(R,N,"bindMatrixInverse");const It=N.skeleton;It&&(It.boneTexture===null&&It.computeBoneTexture(),lt.setValue(R,"boneTexture",It.boneTexture,Ue))}N.isBatchedMesh&&(lt.setOptional(R,N,"batchingTexture"),lt.setValue(R,"batchingTexture",N._matricesTexture,Ue),lt.setOptional(R,N,"batchingIdTexture"),lt.setValue(R,"batchingIdTexture",N._indirectTexture,Ue),lt.setOptional(R,N,"batchingColorTexture"),N._colorsTexture!==null&&lt.setValue(R,"batchingColorTexture",N._colorsTexture,Ue));const Kt=k.morphAttributes;if((Kt.position!==void 0||Kt.normal!==void 0||Kt.color!==void 0)&&Ce.update(N,k,Vt),(Gt||Te.receiveShadow!==N.receiveShadow)&&(Te.receiveShadow=N.receiveShadow,lt.setValue(R,"receiveShadow",N.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Bt.envMap.value=de,Bt.flipEnvMap.value=de.isCubeTexture&&de.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&I.environment!==null&&(Bt.envMapIntensity.value=I.environmentIntensity),Bt.dfgLUT!==void 0&&(Bt.dfgLUT.value=qp()),Gt&&(lt.setValue(R,"toneMappingExposure",E.toneMappingExposure),Te.needsLights&&ol(Bt,ms),se&&G.fog===!0&&Me.refreshFogUniforms(Bt,se),Me.refreshMaterialUniforms(Bt,G,ie,ne,y.state.transmissionRenderTarget[v.id]),br.upload(R,Zo(Te),Bt,Ue)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(br.upload(R,Zo(Te),Bt,Ue),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&lt.setValue(R,"center",N.center),lt.setValue(R,"modelViewMatrix",N.modelViewMatrix),lt.setValue(R,"normalMatrix",N.normalMatrix),lt.setValue(R,"modelMatrix",N.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const It=G.uniformsGroups;for(let kt=0,Wr=It.length;kt<Wr;kt++){const di=It[kt];he.update(di,Vt),he.bind(di,Vt)}}return Vt}function ol(v,I){v.ambientLightColor.needsUpdate=I,v.lightProbe.needsUpdate=I,v.directionalLights.needsUpdate=I,v.directionalLightShadows.needsUpdate=I,v.pointLights.needsUpdate=I,v.pointLightShadows.needsUpdate=I,v.spotLights.needsUpdate=I,v.spotLightShadows.needsUpdate=I,v.rectAreaLights.needsUpdate=I,v.hemisphereLights.needsUpdate=I}function cl(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return b},this.setRenderTargetTextures=function(v,I,k){const G=ye.get(v);G.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),ye.get(v.texture).__webglTexture=I,ye.get(v.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:k,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,I){const k=ye.get(v);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0};const ll=R.createFramebuffer();this.setRenderTarget=function(v,I=0,k=0){b=v,U=I,S=k;let G=!0,N=null,se=!1,ue=!1;if(v){const de=ye.get(v);if(de.__useDefaultFramebuffer!==void 0)ge.bindFramebuffer(R.FRAMEBUFFER,null),G=!1;else if(de.__webglFramebuffer===void 0)Ue.setupRenderTarget(v);else if(de.__hasExternalTextures)Ue.rebindTextures(v,ye.get(v.texture).__webglTexture,ye.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Se=v.depthTexture;if(de.__boundDepthTexture!==Se){if(Se!==null&&ye.has(Se)&&(v.width!==Se.image.width||v.height!==Se.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ue.setupDepthRenderbuffer(v)}}const Ae=v.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(ue=!0);const Re=ye.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Re[I])?N=Re[I][k]:N=Re[I],se=!0):v.samples>0&&Ue.useMultisampledRTT(v)===!1?N=ye.get(v).__webglMultisampledFramebuffer:Array.isArray(Re)?N=Re[k]:N=Re,z.copy(v.viewport),W.copy(v.scissor),q=v.scissorTest}else z.copy(Ze).multiplyScalar(ie).floor(),W.copy(tt).multiplyScalar(ie).floor(),q=nt;if(k!==0&&(N=ll),ge.bindFramebuffer(R.FRAMEBUFFER,N)&&G&&ge.drawBuffers(v,N),ge.viewport(z),ge.scissor(W),ge.setScissorTest(q),se){const de=ye.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+I,de.__webglTexture,k)}else if(ue){const de=I;for(let Ae=0;Ae<v.textures.length;Ae++){const Re=ye.get(v.textures[Ae]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Ae,Re.__webglTexture,k,de)}}else if(v!==null&&k!==0){const de=ye.get(v.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,de.__webglTexture,k)}A=-1},this.readRenderTargetPixels=function(v,I,k,G,N,se,ue,xe=0){if(!(v&&v.isWebGLRenderTarget)){xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=ye.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ue!==void 0&&(de=de[ue]),de){ge.bindFramebuffer(R.FRAMEBUFFER,de);try{const Ae=v.textures[xe],Re=Ae.format,Se=Ae.type;if(!it.textureFormatReadable(Re)){xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Se)){xt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=v.width-G&&k>=0&&k<=v.height-N&&(v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+xe),R.readPixels(I,k,G,N,Pe.convert(Re),Pe.convert(Se),se))}finally{const Ae=b!==null?ye.get(b).__webglFramebuffer:null;ge.bindFramebuffer(R.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(v,I,k,G,N,se,ue,xe=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=ye.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&ue!==void 0&&(de=de[ue]),de)if(I>=0&&I<=v.width-G&&k>=0&&k<=v.height-N){ge.bindFramebuffer(R.FRAMEBUFFER,de);const Ae=v.textures[xe],Re=Ae.format,Se=Ae.type;if(!it.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const He=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,He),R.bufferData(R.PIXEL_PACK_BUFFER,se.byteLength,R.STREAM_READ),v.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+xe),R.readPixels(I,k,G,N,Pe.convert(Re),Pe.convert(Se),0);const $e=b!==null?ye.get(b).__webglFramebuffer:null;ge.bindFramebuffer(R.FRAMEBUFFER,$e);const dt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await ih(R,dt,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,He),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,se),R.deleteBuffer(He),R.deleteSync(dt),se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,I=null,k=0){const G=Math.pow(2,-k),N=Math.floor(v.image.width*G),se=Math.floor(v.image.height*G),ue=I!==null?I.x:0,xe=I!==null?I.y:0;Ue.setTexture2D(v,0),R.copyTexSubImage2D(R.TEXTURE_2D,k,0,0,ue,xe,N,se),ge.unbindTexture()};const hl=R.createFramebuffer(),ul=R.createFramebuffer();this.copyTextureToTexture=function(v,I,k=null,G=null,N=0,se=null){se===null&&(N!==0?(Us("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),se=N,N=0):se=0);let ue,xe,de,Ae,Re,Se,He,$e,dt;const pt=v.isCompressedTexture?v.mipmaps[se]:v.image;if(k!==null)ue=k.max.x-k.min.x,xe=k.max.y-k.min.y,de=k.isBox3?k.max.z-k.min.z:1,Ae=k.min.x,Re=k.min.y,Se=k.isBox3?k.min.z:0;else{const Kt=Math.pow(2,-N);ue=Math.floor(pt.width*Kt),xe=Math.floor(pt.height*Kt),v.isDataArrayTexture?de=pt.depth:v.isData3DTexture?de=Math.floor(pt.depth*Kt):de=1,Ae=0,Re=0,Se=0}G!==null?(He=G.x,$e=G.y,dt=G.z):(He=0,$e=0,dt=0);const et=Pe.convert(I.format),Te=Pe.convert(I.type);let ct;I.isData3DTexture?(Ue.setTexture3D(I,0),ct=R.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(Ue.setTexture2DArray(I,0),ct=R.TEXTURE_2D_ARRAY):(Ue.setTexture2D(I,0),ct=R.TEXTURE_2D),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const qe=R.getParameter(R.UNPACK_ROW_LENGTH),Vt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Ii=R.getParameter(R.UNPACK_SKIP_PIXELS),Gt=R.getParameter(R.UNPACK_SKIP_ROWS),ms=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,pt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,pt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ae),R.pixelStorei(R.UNPACK_SKIP_ROWS,Re),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Se);const lt=v.isDataArrayTexture||v.isData3DTexture,Bt=I.isDataArrayTexture||I.isData3DTexture;if(v.isDepthTexture){const Kt=ye.get(v),It=ye.get(I),kt=ye.get(Kt.__renderTarget),Wr=ye.get(It.__renderTarget);ge.bindFramebuffer(R.READ_FRAMEBUFFER,kt.__webglFramebuffer),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,Wr.__webglFramebuffer);for(let di=0;di<de;di++)lt&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ye.get(v).__webglTexture,N,Se+di),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ye.get(I).__webglTexture,se,dt+di)),R.blitFramebuffer(Ae,Re,ue,xe,He,$e,ue,xe,R.DEPTH_BUFFER_BIT,R.NEAREST);ge.bindFramebuffer(R.READ_FRAMEBUFFER,null),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(N!==0||v.isRenderTargetTexture||ye.has(v)){const Kt=ye.get(v),It=ye.get(I);ge.bindFramebuffer(R.READ_FRAMEBUFFER,hl),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,ul);for(let kt=0;kt<de;kt++)lt?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Kt.__webglTexture,N,Se+kt):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Kt.__webglTexture,N),Bt?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,It.__webglTexture,se,dt+kt):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,It.__webglTexture,se),N!==0?R.blitFramebuffer(Ae,Re,ue,xe,He,$e,ue,xe,R.COLOR_BUFFER_BIT,R.NEAREST):Bt?R.copyTexSubImage3D(ct,se,He,$e,dt+kt,Ae,Re,ue,xe):R.copyTexSubImage2D(ct,se,He,$e,Ae,Re,ue,xe);ge.bindFramebuffer(R.READ_FRAMEBUFFER,null),ge.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else Bt?v.isDataTexture||v.isData3DTexture?R.texSubImage3D(ct,se,He,$e,dt,ue,xe,de,et,Te,pt.data):I.isCompressedArrayTexture?R.compressedTexSubImage3D(ct,se,He,$e,dt,ue,xe,de,et,pt.data):R.texSubImage3D(ct,se,He,$e,dt,ue,xe,de,et,Te,pt):v.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,se,He,$e,ue,xe,et,Te,pt.data):v.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,se,He,$e,pt.width,pt.height,et,pt.data):R.texSubImage2D(R.TEXTURE_2D,se,He,$e,ue,xe,et,Te,pt);R.pixelStorei(R.UNPACK_ROW_LENGTH,qe),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Vt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ii),R.pixelStorei(R.UNPACK_SKIP_ROWS,Gt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ms),se===0&&I.generateMipmaps&&R.generateMipmap(ct),ge.unbindTexture()},this.initRenderTarget=function(v){ye.get(v).__webglFramebuffer===void 0&&Ue.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?Ue.setTextureCube(v,0):v.isData3DTexture?Ue.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?Ue.setTexture2DArray(v,0):Ue.setTexture2D(v,0),ge.unbindTexture()},this.resetState=function(){U=0,S=0,b=null,ge.reset(),L.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=Ye._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ye._getUnpackColorSpace()}}const Ss=new F;function Jt(i,e,t,n,s,r){const a=2*Math.PI*s/4,o=Math.max(r-2*s,0),l=Math.PI/4;Ss.copy(e),Ss[n]=0,Ss.normalize();const c=.5*a/(a+o),h=1-Ss.angleTo(i)/l;return Math.sign(Ss[t])===1?h*c:o/(a+o)+c+c*(1-h)}class Do extends ds{constructor(e=1,t=1,n=1,s=2,r=.1){const a=s*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:s,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new F,c=new F,h=new F(e,t,n).divideScalar(2).subScalar(r),d=this.attributes.position.array,u=this.attributes.normal.array,p=this.attributes.uv.array,x=d.length/6,g=new F,m=.5/a;for(let f=0,M=0;f<d.length;f+=3,M+=2)switch(l.fromArray(d,f),c.copy(l),c.x-=Math.sign(c.x)*m,c.y-=Math.sign(c.y)*m,c.z-=Math.sign(c.z)*m,c.normalize(),d[f+0]=h.x*Math.sign(l.x)+c.x*r,d[f+1]=h.y*Math.sign(l.y)+c.y*r,d[f+2]=h.z*Math.sign(l.z)+c.z*r,u[f+0]=c.x,u[f+1]=c.y,u[f+2]=c.z,Math.floor(f/x)){case 0:g.set(1,0,0),p[M+0]=Jt(g,c,"z","y",r,n),p[M+1]=1-Jt(g,c,"y","z",r,t);break;case 1:g.set(-1,0,0),p[M+0]=1-Jt(g,c,"z","y",r,n),p[M+1]=1-Jt(g,c,"y","z",r,t);break;case 2:g.set(0,1,0),p[M+0]=1-Jt(g,c,"x","z",r,e),p[M+1]=Jt(g,c,"z","x",r,n);break;case 3:g.set(0,-1,0),p[M+0]=1-Jt(g,c,"x","z",r,e),p[M+1]=1-Jt(g,c,"z","x",r,n);break;case 4:g.set(0,0,1),p[M+0]=1-Jt(g,c,"x","y",r,e),p[M+1]=1-Jt(g,c,"y","x",r,t);break;case 5:g.set(0,0,-1),p[M+0]=Jt(g,c,"x","y",r,e),p[M+1]=1-Jt(g,c,"y","x",r,t);break}}static fromJSON(e){return new Do(e.width,e.height,e.depth,e.segments,e.radius)}}const Ji=16,en=Math.PI,Dt=(i,e,t)=>Math.min(t,Math.max(e,i)),st=(i,e,t)=>i+(e-i)*t,Q0=i=>i*i*(3-2*i),Zp=(i,e)=>-i*(en-e);class Ti{constructor(e,t,n,s,r,a=t){this.d=e,this.sourceTotal=Math.max(1,Math.ceil(t/2)),this.total=Math.max(1,Math.ceil(a/2)),this.sheetsPerSignature=Ji,this.count=Math.ceil(this.total/Ji);const o=n/this.sourceTotal*this.total;this.split=Dt(Number.isInteger(n)?Math.round(o):o,0,this.total),this.position=this.split/this.total,this.q=Dt(s,0,1),this.openAngle=Dt(r,90,145),this.caliper=e.t/this.total,this.curves=new Map;const l=Math.sin(en*this.position),c=1+.13*(this.openAngle-154)/49;this.radius=e.t*(.38+.075*l)*c,this.angularSpread=(1.5+.8*l)*(.89+.11*(this.openAngle/154)),this.spineBase=-e.t/2-e.board*.9-.084;const h=(180-this.openAngle)*en/360,d=2*h;this.leftTilt=Dt(d*(1-this.position),0,1.55),this.rightTilt=Dt(d*this.position,0,1.55),this.spineEngagement=Q0(Math.sin(en*this.position)),this.boardTilt=h,this.outerRiseLeft=e.w*Math.sin(this.leftTilt),this.outerRiseRight=e.w*Math.sin(this.rightTilt),this.outerDrop=0,this.leftSupportOffset=Math.max(0,e.t/2+this.spinePoint(0).z)+e.board*.42,this.rightSupportOffset=Math.max(0,e.t/2+this.spinePoint(1).z)+e.board*.42,this.gutterSafeFraction=Dt(.075+(180-this.openAngle)/360*.16+e.t/e.w*.025,.08,.14)}signatureBounds(e,t){const n=e*Ji,s=Math.min(this.total,n+Ji);if(t==="left"){const a=Math.min(s,this.split);return{start:n,end:a,count:Math.max(0,a-n)}}const r=Math.max(n,this.split);return{start:r,end:s,count:Math.max(0,s-r)}}hingeAtFraction(e){e=Dt(e,0,1);const{t}=this.d,n=-.045-t*.16*Math.sin(en*e),s=t*(.5-e),r=en*this.position*this.q,a=n*Math.cos(r)-s*Math.sin(r),o=n*Math.sin(r)+s*Math.cos(r),l=this.angularSpread*(e-this.position),c=this.radius*Math.sin(l),h=.24+.06*Math.sin(en*this.position),d=this.spineBase+this.radius*h*Math.cos(l),u=this.spineEngagement*this.q,p=en*this.position,x=st(n*Math.cos(p)-s*Math.sin(p),c,this.spineEngagement),g=st(n*Math.sin(p)+s*Math.cos(p),d,this.spineEngagement);return{x:st(a,c,u),z:st(o,d,u),closedX:n,closedZ:s,openX:x,openZ:g}}hingeForLeaf(e){return this.hingeAtFraction((Dt(e,0,this.total-1)+.5)/this.total)}hingeForSignature(e){return this.hingeAtFraction((e+.5)*Ji/this.total)}spinePoint(e){e=Dt(e,0,1);const t=en*this.position*this.q,n=-Math.cos(t),s=-Math.sin(t),r=this.hingeAtFraction(0),a=this.hingeAtFraction(1),o=(this.d.t*(.16-.095*this.spineEngagement*this.q)+.008)*Math.sin(en*e),c=Math.max(.012,Math.min(.032,this.d.board*.9+.006))+o;return{x:st(r.x,a.x,e)+n*c,z:st(r.z,a.z,e)+s*c}}openCurve(e,t){const n=Dt(e,0,this.total-1),s=t+":"+n;if(this.curves.has(s))return this.curves.get(s);const r=this.hingeForLeaf(n),a=this.getBoardAnchor(t),o=t==="left"?this.leftTilt:this.rightTilt,l=t==="left"?-1:1,c=l*Math.cos(o),h=Math.sin(o),d=-l*Math.sin(o),u=Math.cos(o),p=t==="left"?this.split:this.total-this.split,x=t==="left"?n+.5:this.total-n-.5;let g=r.x,m=r.openZ;const f=this.d.board/2+.006;if(p<64){const H=this.hingeForLeaf(this.visibleLeaf(t)??n),ee=p-.5,V=(H.x-a.x)*d+(H.openZ-a.z)*u,ie=Math.max(f,V-ee*this.caliper)+x*this.caliper;g=H.x+(ie-V)*d,m=H.openZ+(ie-V)*u}else{const H=(g-a.x)*d+(m-a.z)*u;H<f&&(g+=(f-H)*d,m+=(f-H)*u)}const M=(g-a.x)*d+(m-a.z)*u,y=f+x*this.caliper,w=Q0(Dt(p/64,0,1)),P=Math.abs(n+.5-this.split)/this.total,E=p/this.total,C=(.012+.25*Math.pow(1-E,1.1)*Math.exp(-P/.2))*w,U=96,S=[],b=[];for(let H=0;H<=U;H++){const ee=H/U,V=ee+.28*w*(1-Math.exp(-ee/.16))*(1-ee);S.push(st(M,y,V)+C*Math.sin(en*ee)*Math.pow(1-ee,.75))}const A=this.d.w+.027;let B=0,z=A,W=A;for(let H=0;H<9;H++){let ee=0,V=0;const ne=W/U;for(let Be=1;Be<=U;Be++){const Ze=Math.hypot(ne,S[Be]-S[Be-1]);ee+=Ze,V+=W/(U*U*Math.max(Ze,1e-12))}const ie=ee-A;if(Math.abs(ie)<1e-8)break;ie>0?z=W:B=W;const ve=W-ie/Math.max(V,1e-8);W=ve>B&&ve<z?ve:(B+z)/2}b.push(0);for(let H=1;H<=U;H++)b.push(b[H-1]+Math.hypot(W/U,S[H]-S[H-1]));const q={rootX:g,rootZ:m,dx:c,dz:h,nx:d,nz:u,h0:M,heights:S,steps:b,span:W,length:A,N:U};return this.curves.set(s,q),q}sheetPoint(e,t,n,s=.5){const r=Dt(e,0,this.total-1),a=Dt(n,0,1),o=Dt(s,0,1),{w:l,h:c,t:h}=this.d,d=this.hingeForLeaf(r),u=h*.16*Math.sin(en*(r+.5)/this.total),p=st(d.closedX,l-.018-u,a),x=h/2-(r+.5)*this.caliper,g=st(d.closedZ,x,a);if(this.q===0)return{x:p,y:(o-.5)*(c-.072),z:g};const m=this.openCurve(r,t),f=a*m.steps[m.N];let M=0,y=m.N;for(;y-M>1;){const S=M+y>>1;m.steps[S]<f?M=S:y=S}const w=(f-m.steps[M])/Math.max(1e-12,m.steps[y]-m.steps[M]),P=m.span*(M+w)/m.N,E=st(m.heights[M],m.heights[y],w)-m.h0,C=m.rootX+m.dx*P+m.nx*E,U=m.rootZ+m.dz*P+m.nz*E;return{x:st(p,C,this.q),y:(o-.5)*(c-.072),z:st(g,U,this.q)}}spineFoldThickness(e,t){const{start:n,end:s,count:r}=this.signatureBounds(e,t);if(r===0)return 0;const a=this.hingeForLeaf(n),o=this.hingeForLeaf(s-1);return Math.hypot(a.x-o.x,a.z-o.z)+this.caliper}visibleLeaf(e){const t=e==="left"?this.split-1:this.split;return t>=0&&t<this.total?t:null}getBoardAnchor(e){const t=e==="left"?0:1,n=this.spinePoint(t),s=(e==="left"?1:-1)*(this.d.t/2+this.d.board/2+.006),r=n.z+this.d.board*.72-.014;return{x:st(0,n.x+(e==="left"?-.017:.017),this.q),z:st(s,r,this.q)}}estimatedLowestPoint(){let e=1/0;for(let s=0;s<=32;s++){const r=this.spinePoint(s/32);e=Math.min(e,r.z)}const t=this.getBoardAnchor("left"),n=this.getBoardAnchor("right");return e=Math.min(e,t.z-this.d.board,n.z-this.d.board),e}analyze(){const e=Math.floor(this.count/2);return{signatures:this.count,pages:this.total*2,split:this.split,position:this.position,radius:this.radius,halfOpening:this.boardTilt,coverInclinations:{left:this.leftTilt,right:this.rightTilt},spineEngagement:this.spineEngagement,supportOffset:{left:this.leftSupportOffset,right:this.rightSupportOffset},gutterSafeFraction:this.gutterSafeFraction,signatureInMiddle:{left:this.signatureBounds(e,"left"),right:this.signatureBounds(e,"right")},rootThickness:this.spineFoldThickness(e,"right")}}}const jp=34,Kp=3,$p=64,Jp=16;function Qt(i,e={}){return new kn({color:i,roughness:.96,metalness:0,...e})}function ys(i,e){return e.add(i),i.castShadow=!1,i.receiveShadow=!1,i}function Qp(){const i=document.createElement("canvas");i.width=480,i.height=680;const e=i.getContext("2d");e.fillStyle="#e7e1d5",e.fillRect(0,0,480,680);let t=6331319;for(let s=0;s<2700;s++){t=Math.imul(t,1664525)+1013904223>>>0;const r=t/4294967296;e.fillStyle="rgba(112,96,78,.021)",e.fillRect(r*9973%480,r*8741%680,1.2,.55)}const n=new Lo(i);return n.colorSpace=Ct,n.anisotropy=4,n}function e2(i,e){const t=jp,n=Kp,s=(t+1)*(n+1),r=s*2,a=new Float32Array(r*3),o=new Float32Array(r*3),l=new Float32Array(r*2),c=new Float32Array(r*3);for(let f=0;f<2;f++)for(let M=0;M<=n;M++)for(let y=0;y<=t;y++){const w=f*s+M*(t+1)+y,P=y/t;l[w*2]=P,l[w*2+1]=M/n;const E=Math.min(1,P/.24),U=.78+.22*(E*E*(3-2*E));c[w*3]=U,c[w*3+1]=U*.997,c[w*3+2]=U*.985}const h=[],d=[],u=[];function p(f,M,y,w,P){f.push(M,y,w,M,w,P)}function x(f,M,y){return f*s+y*(t+1)+M}for(let f=0;f<n;f++)for(let M=0;M<t;M++)p(h,x(0,M,f),x(0,M+1,f),x(0,M+1,f+1),x(0,M,f+1)),p(h,x(1,M,f+1),x(1,M+1,f+1),x(1,M+1,f),x(1,M,f));for(let f=0;f<t;f++)p(d,x(0,f,0),x(1,f,0),x(1,f+1,0),x(0,f+1,0)),p(d,x(0,f+1,n),x(1,f+1,n),x(1,f,n),x(0,f,n));for(let f=0;f<n;f++)p(d,x(0,t,f),x(1,t,f),x(1,t,f+1),x(0,t,f+1));const g=new Tt,m=h.concat(d,u);return g.setAttribute("position",new ut(a,3)),g.setAttribute("normal",new ut(o,3)),g.setAttribute("uv",new ut(l,2)),g.setAttribute("color",new ut(c,3)),g.setIndex(m),g.addGroup(0,h.length,0),g.addGroup(h.length,d.length,1),g.addGroup(h.length+d.length,u.length,2),g.userData={nx:t,ny:n,grid:s},g}function t2(i,e,t,n){const{start:s,end:r,count:a}=t;if(i.visible=a>0,!a)return;const o=i.geometry,{nx:l,ny:c,grid:h}=o.userData,d=o.attributes.position,u=n==="left"?r-1:s,p=n==="left"?s:r-1;for(let x=0;x<2;x++){const g=x?p:u;for(let m=0;m<=c;m++)for(let f=0;f<=l;f++){const M=f/l,y=m/c,w=x*h+m*(l+1)+f,P=e.sheetPoint(g,n,M,y);d.setXYZ(w,P.x,P.y,P.z+(x?-5e-4:5e-4))}}d.needsUpdate=!0,o.computeVertexNormals(),o.computeBoundingSphere()}function ec(i){const e=$p,t=Jp,n=new Float32Array((e+1)*(t+1)*3),s=new Float32Array((e+1)*(t+1)*2),r=new Float32Array((e+1)*(t+1)*3),a=[];for(let l=0;l<=t;l++)for(let c=0;c<=e;c++){const h=l*(e+1)+c,d=c/e;s[2*h]=i==="left"?1-d:d,s[2*h+1]=l/t;const u=Math.min(1,d/.24),x=.77+.23*(u*u*(3-2*u));if(r[3*h]=x,r[3*h+1]=x*.998,r[3*h+2]=x*.985,c<e&&l<t){const g=h,m=h+1,f=h+e+2,M=h+e+1;a.push(g,m,f,g,f,M)}}const o=new Tt;return o.setAttribute("position",new ut(n,3)),o.setAttribute("uv",new ut(s,2)),o.setAttribute("color",new ut(r,3)),o.setIndex(a),o.userData={nx:e,ny:t,side:i},o.computeVertexNormals(),o}function tc(i,e,t){const n=e.visibleLeaf(t);if(i.visible=n!==null&&e.q>.98,n===null)return;const{nx:s,ny:r}=i.geometry.userData,a=i.geometry.attributes.position,o=i.geometry.attributes.uv,l=i.geometry.attributes.color,c=e.gutterSafeFraction;for(let h=0;h<=r;h++)for(let d=0;d<=s;d++){const u=d/s,p=h/r,x=h*(s+1)+d,g=e.sheetPoint(n,t,u,p);a.setXYZ(x,g.x,g.y,g.z+.0035);const f=.085+.915*Math.max(0,(u-c)/(1-c));o.setXY(x,t==="left"?1-f:f,p);const M=Math.min(1,u/(c*1.8)),w=.83+.17*(M*M*(3-2*M));l.setXYZ(x,w,w*.997,w*.985)}a.needsUpdate=!0,o.needsUpdate=!0,l.needsUpdate=!0,i.geometry.computeVertexNormals(),i.geometry.computeBoundingSphere()}function ba(i,e=!1){const s=new Float32Array(1515),r=new Float32Array(505*2),a=[];for(let l=0;l<=4;l++)for(let c=0;c<=100;c++){const h=l*101+c;if(r[h*2]=e?1-c/100:c/100,r[h*2+1]=l/4,c<100&&l<4){const d=h,u=h+1,p=h+100+2,x=h+100+1;e?a.push(d,p,u,d,x,p):a.push(d,u,p,d,p,x)}}const o=new Tt;return o.setAttribute("position",new ut(s,3)),o.setAttribute("uv",new ut(r,2)),o.setIndex(a),o.userData={nu:100,nv:4},o}function n2(i,e,t,n){const s=i.geometry,r=s.attributes.position,{nu:a,nv:o}=s.userData;for(let l=0;l<=o;l++)for(let c=0;c<=a;c++){const h=l*(a+1)+c,d=c/a,u=(-.5+l/o)*(t+2*n),p=e.spinePoint(d);r.setXYZ(h,p.x-.001*Math.sin(u*2),u,p.z)}r.needsUpdate=!0,s.computeVertexNormals(),s.computeBoundingSphere()}function i2(i,e,t){const n=i.geometry,s=n.attributes.position,{nu:r,nv:a}=n.userData;for(let o=0;o<=a;o++)for(let l=0;l<=r;l++){const c=o*(r+1)+l,h=l/r,d=e.hingeAtFraction(h),u=(-.5+o/a)*(t-.09);s.setXYZ(c,d.x,u,d.z-.024)}s.needsUpdate=!0,n.computeVertexNormals(),n.computeBoundingSphere()}function s2(i,e,t){const s=new Tt;s.setAttribute("position",new Yt(new Float32Array(240),3));const r=new jh(s,new Lc({color:4351098,transparent:!0,opacity:.82}));return r.userData={N:80,sign:t,h:e},r}function r2(i,e){const t=i.geometry.attributes.position,{N:n,sign:s,h:r}=i.userData;for(let a=0;a<n;a++){const o=e.spinePoint(a/(n-1));t.setXYZ(a,o.x,s*(r/2-.015),o.z+.012)}t.needsUpdate=!0}function a2(){const t=new Float32Array(399),n=[];for(let r=0;r<18;r++)for(let a=0;a<6;a++){const o=r*7+a,l=o+6+1;n.push(o,l,o+1,o+1,l,l+1)}const s=new Tt;return s.setAttribute("position",new ut(t,3)),s.setIndex(n),s.userData={around:6,across:18},s}function nc(i,e,t,n,s){if(i.visible=!1,!i.visible)return;const r=e.sheetPoint(t.start,n,0,s===1?1:0),a=e.sheetPoint(t.end-1,n,0,s===1?1:0),o=i.geometry,l=o.attributes.position,{around:c,across:h}=o.userData,d=Math.hypot(a.x-r.x,a.z-r.z),u=Math.max(.0035,d*.34),p=Math.max(.0011,e.caliper*.92);for(let x=0;x<=h;x++){const g=x/h,m=r.x+(a.x-r.x)*g+(n==="left"?-1:1)*u*Math.sin(Math.PI*g),f=r.z+(a.z-r.z)*g,M=a.x-r.x+(n==="left"?-1:1)*u*Math.PI*Math.cos(Math.PI*g),y=a.z-r.z,w=Math.hypot(M,y)||1,P=-y/w,E=M/w,C=s*(e.d.h/2-.036);for(let U=0;U<=c;U++){const S=2*Math.PI*U/c,b=Math.cos(S)*p,A=Math.sin(S)*p;l.setXYZ(x*(c+1)+U,m+P*b,C+A,f+E*b)}}l.needsUpdate=!0,o.computeVertexNormals(),o.computeBoundingSphere()}function o2(){const t=new Float32Array(8547),n=new Float32Array(t.length),s=[];for(let a=0;a<76;a++)for(let o=0;o<36;o++){const l=a*37+o,c=l+36+1;s.push(l,l+1,c+1,l,c+1,c)}const r=new Tt;return r.setAttribute("position",new ut(t,3)),r.setAttribute("color",new ut(n,3)),r.setIndex(s),r.userData={nu:36,nv:76},r}function c2(i,e,t,n){const s=t==="left"?e.split:e.total-e.split,r=s/e.total>.76&&s>32&&e.q>.97;if(i.visible=r,!r)return;const a=t==="left"?e.split-1:e.split,o=t==="left"?0:e.total-1,l=i.geometry,c=l.attributes.position,h=l.attributes.color,{nu:d,nv:u}=l.userData,p=n>0?1:0,x=n*((e.d.h-.072)/2+.0017),g=Math.min(56,s/Ji);for(let m=0;m<=u;m++){const f=m/u,M=f*g*2*Math.PI,w=.928-.031*Math.pow(Math.max(0,Math.cos(M)),20)-.009*Math.sin(m*1.77)*Math.sin(m*.31)-.008*f;for(let P=0;P<=d;P++){const E=P/d,C=m*(d+1)+P,U=st(o,a,f),S=e.sheetPoint(U,t,E,p),b=S.z,A=S.x;c.setXYZ(C,A,x,b);const B=w-.005*Math.sin(P*.73+m*.21);h.setXYZ(C,B,B*.971,B*.936)}}c.needsUpdate=!0,h.needsUpdate=!0,l.computeVertexNormals(),l.computeBoundingSphere()}function ji(i,e,t,n){const s=i.t*.16*Math.sin(Math.PI*e);return{x:st(-.045-s,i.w-.018-s,t),y:(n-.5)*(i.h-.072),z:i.t*(.5-e)}}function l2(i){const e=[],t=[],n=[],s=[];function r(o,l,c,h,d,u){const p=e.length/3,x=n.length;for(let g=0;g<=l;g++)for(let m=0;m<=o;m++){const f=m/o,M=g/l,y=c(f,M);e.push(y.x,y.y,y.z),t.push(f,u?.5-y.z/i.t:M)}for(let g=0;g<l;g++)for(let m=0;m<o;m++){const f=p+g*(o+1)+m,M=f+o+2,y=f+1,w=f+o+1;h?n.push(f,M,y,f,w,M):n.push(f,y,M,f,M,w)}s.push([x,n.length-x,d])}r(34,100,(o,l)=>ji(i,l,o,1),!1,0,!0),r(34,100,(o,l)=>ji(i,l,o,0),!0,0,!0),r(100,3,(o,l)=>ji(i,o,0,l),!0,0,!0),r(100,3,(o,l)=>ji(i,o,1,l),!1,0,!0),r(34,3,(o,l)=>ji(i,0,o,l),!1,1,!1),r(34,3,(o,l)=>ji(i,1,o,l),!0,1,!1);const a=new Tt;return a.setAttribute("position",new Yt(e,3)),a.setAttribute("uv",new Yt(t,2)),a.setIndex(n),s.forEach(o=>a.addGroup(...o)),a.computeVertexNormals(),a}function h2(i=100,e=4){const t=2*(i+e),n=new Tt,s=[];n.setAttribute("position",new Yt(new Float32Array(t*12),3));for(let r=0;r<t;r++){const a=r*4;s.push(a,a+1,a+2,a,a+2,a+3)}return n.setIndex(s),n}function u2(i,e,t,n){const s=i.geometry,r=s.attributes.position,a=s.attributes.normal,o=e.geometry.attributes.position;for(let u=0;u<r.count;u++)o.setXYZ(u,r.getX(u)-a.getX(u)*n,r.getY(u)-a.getY(u)*n,r.getZ(u)-a.getZ(u)*n);o.needsUpdate=!0,e.geometry.computeVertexNormals(),e.geometry.computeBoundingSphere();const{nu:l,nv:c}=s.userData,h=[];for(let u=0;u<l;u++)h.push([u,u+1]);for(let u=0;u<c;u++)h.push([u*(l+1)+l,(u+1)*(l+1)+l]);for(let u=l;u>0;u--)h.push([c*(l+1)+u,c*(l+1)+u-1]);for(let u=c;u>0;u--)h.push([u*(l+1),(u-1)*(l+1)]);const d=t.geometry.attributes.position;h.forEach(([u,p],x)=>{[[r,u],[r,p],[o,p],[o,u]].forEach(([g,m],f)=>d.setXYZ(x*4+f,g.getX(m),g.getY(m),g.getZ(m)))}),d.needsUpdate=!0,t.geometry.computeVertexNormals(),t.geometry.computeBoundingSphere()}class f2{constructor({root:e,materials:t,dimensions:n,sourcePages:s=1248,printPages:r=s}){this.root=e,this.materials=t,this.dimensions=n,this.sourcePages=s,this.printPages=r,this.owned=[],this.signatureCount=0,this.signatureMeshes={left:[],right:[]},this.foldMeshes={left:[],right:[]},this.bulkCutMeshes={left:[],right:[]},this.build()}own(e){return this.owned.push(e),e}make(e,t,n=this.root){return ys(new jt(e,t),n)}build(){const{w:e,h:t,t:n,board:s,overhang:r}=this.dimensions,a=this.materials;this.frontPivot=ys(new Tn,this.root),this.backPivot=ys(new Tn,this.root);const o=e+r*2,l=t+r*2,c=()=>new Do(o,l,s,3,Math.min(s*.23,.008));this.frontBoard=this.make(c(),[a.cloth,a.cloth,a.cloth,a.cloth,a.front,a.cloth],this.frontPivot),this.backBoard=this.make(c(),[a.cloth,a.cloth,a.cloth,a.cloth,a.cloth,a.back],this.backPivot),this.frontBoard.position.x=e/2,this.backBoard.position.x=e/2;const h=this.own(Qt(16777215,{map:Qp(),side:mt}));this.frontPastedown=this.make(new gn(e-.075,t-.085),h,this.frontPivot),this.backPastedown=this.make(new gn(e-.075,t-.085),h,this.backPivot),this.frontPastedown.position.set(e/2,0,-s/2-.002),this.backPastedown.position.set(e/2,0,s/2+.002);const d=this.own(Qt(13221807,{side:mt})),u=this.make(new gn(.068,t-.04),d,this.frontPivot),p=this.make(new gn(.068,t-.04),d,this.backPivot);u.position.set(.012,0,-s/2-.003),p.position.set(.012,0,s/2+.003),this.leftStack=ys(new Tn,this.root),this.rightStack=ys(new Tn,this.root);const x=this.own(Qt(16249835,{side:mt,vertexColors:!0})),g=this.own(new kn({color:15525852,roughness:1,metalness:0,side:mt,emissive:11709084,emissiveIntensity:.29})),m=this.own(Qt(12432292,{side:mt})),f=this.own(Qt(15196889,{side:mt}));this.signatureMaterial=[x,g,m];const M=l2(this.dimensions),y=this.own(Qt(15855076,{map:a.edge,side:mt})),w=this.own(Qt(15855076,{side:mt}));this.closedBlock=this.make(M,[y,w]),this.signatureCount=Math.ceil(this.printPages/32);for(const C of["left","right"])for(let U=0;U<this.signatureCount;U++){const S=e2(),b=this.make(S,this.signatureMaterial,C==="left"?this.leftStack:this.rightStack);b.userData={signature:U,side:C},b.frustumCulled=!1,this.signatureMeshes[C].push(b);const A=[];for(const B of[-1,1]){const z=this.make(a2(),f,C==="left"?this.leftStack:this.rightStack);z.frustumCulled=!1,A.push(z)}this.foldMeshes[C].push(A)}const P=this.own(new kn({color:16777215,vertexColors:!0,roughness:1,metalness:0,side:mt,emissive:12168607,emissiveIntensity:.08}));for(const C of["left","right"])for(const U of[-1,1]){const S=this.make(o2(),P);S.frustumCulled=!1,S.renderOrder=2,this.bulkCutMeshes[C].push({mesh:S,sign:U})}const E=()=>this.own(new cs({map:a.placeholder,color:16777215,side:mt,vertexColors:!0,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));this.leftPage=this.make(ec("left"),E()),this.rightPage=this.make(ec("right"),E()),this.leftPage.renderOrder=3,this.rightPage.renderOrder=3,this.leftPage.frustumCulled=!1,this.rightPage.frustumCulled=!1,this.spineGeometry=ba(t,!0),this.spine=this.make(this.spineGeometry,this.own(Qt(16777215,{map:a.spine,side:_n,bumpMap:a.clothBump||null,bumpScale:.001,emissive:16777215,emissiveMap:a.spine,emissiveIntensity:.16}))),this.spineThickness=Math.max(.008,Math.min(.04,s*.82)),this.spineLining=this.make(ba(t,!1),this.own(Qt(14801613,{side:_n}))),this.spineRims=this.make(h2(),this.own(Qt(14801613,{side:mt}))),this.spineLining.frustumCulled=!1,this.spineRims.frustumCulled=!1,this.sewnBacking=this.make(ba(),this.own(Qt(13089962,{side:mt,roughness:1}))),this.sewnBacking.frustumCulled=!1,this.spine.frustumCulled=!1,this.caseJoints=["left","right"].map(C=>{const U=new Tt;U.setAttribute("position",new Yt(new Float32Array(12),3)),U.setIndex([0,1,2,0,2,3]);const S=this.make(U,this.own(Qt(14209473,{side:mt})));return S.frustumCulled=!1,{side:C,mesh:S}}),this.headbands=[];for(const C of[-1,1]){const U=s2(null,t,C);this.root.add(U),this.headbands.push(U)}this.render(0,0,this.sourcePages,this.printPages,120)}render(e,t,n,s,r=154){const a=this.last;if(!this.inTurn&&a&&a.q===e&&a.spread===t&&a.sourcePages===n&&a.printPages===s&&a.openAngle===r)return a;this.inTurn=!1;const o=this.dimensions,l=new Ti(o,n,t,e,r,s);this.rig=l;for(const x of["left","right"]){const g=this.signatureMeshes[x];for(let m=0;m<g.length;m++){const f=l.signatureBounds(m,x);t2(g[m],l,f,x),nc(this.foldMeshes[x][m][0],l,f,x,-1),nc(this.foldMeshes[x][m][1],l,f,x,1)}}for(const x of["left","right"])for(const{mesh:g,sign:m}of this.bulkCutMeshes[x])c2(g,l,x,m);if(this.closedBlock.visible=l.q<.015,this.closedBlock.visible)for(const x of["left","right"]){for(const g of this.signatureMeshes[x])g.visible=!1;for(const{mesh:g}of this.bulkCutMeshes[x])g.visible=!1}tc(this.leftPage,l,"left"),tc(this.rightPage,l,"right");const c=l.getBoardAnchor("left"),h=l.getBoardAnchor("right");this.frontPivot.position.set(c.x,0,c.z),this.backPivot.position.set(h.x,0,h.z);const d=l.boardTilt*l.q;this.frontPivot.rotation.set(0,Zp(l.q,l.leftTilt),0),this.backPivot.rotation.set(0,-l.q*l.rightTilt,0),this.frontPastedown.visible=l.q>.03,this.backPastedown.visible=l.q>.03;for(const{side:x,mesh:g}of this.caseJoints){const m=x==="left",f=l.spinePoint(m?0:1),M=m?this.frontPivot:this.backPivot,y=(m?1:-1)*o.board/2,w=M.position.x+Math.sin(M.rotation.y)*y,P=M.position.z+Math.cos(M.rotation.y)*y,E=o.h/2+o.overhang,C=g.geometry.attributes.position;C.setXYZ(0,f.x,-E,f.z),C.setXYZ(1,w,-E,P),C.setXYZ(2,w,E,P),C.setXYZ(3,f.x,E,f.z),C.needsUpdate=!0,g.geometry.computeVertexNormals(),g.geometry.computeBoundingSphere()}n2(this.spine,l,o.h,o.overhang),u2(this.spine,this.spineLining,this.spineRims,this.spineThickness),i2(this.sewnBacking,l,o.h);const u=this.materials.spine;this.spine.material.map!==u&&(this.spine.material.map=u,this.spine.material.emissiveMap=u,this.spine.material.needsUpdate=!0),this.spine.material.color.set(16777215);for(const x of this.headbands)r2(x,l),x.visible=!1;this.root.rotation.set(-e*Math.PI/2,0,0),this.root.position.x=-(1-e)*o.w/2,this.root.position.z=0;const p=-o.h/2-o.overhang-.02;return this.root.position.y=e*(p-l.estimatedLowestPoint()),this.last={q:e,spread:t,sourcePages:n,printPages:s,openAngle:r,signatures:l.count,rootArc:l.analyze(),boardTilt:d},this.last}captureTurn(e){const t={...this.last};function n(o){const l=[];return o.traverse(c=>{const h={};if(c.geometry)for(const d of["position","normal","uv","color"]){const u=c.geometry.attributes[d];u&&(h[d]=Float32Array.from(u.array))}l.push({object:c,visible:c.visible,position:c.position.clone(),quaternion:c.quaternion.clone(),scale:c.scale.clone(),attributes:h})}),l}const s=n(this.root);this.render(1,e,t.sourcePages,t.printPages,t.openAngle);const r=n(this.root);return this.render(1,t.spread,t.sourcePages,t.printPages,t.openAngle),{entries:s.map((o,l)=>{const c=r[l],h=[];for(const d of Object.keys(o.attributes)){const u=o.attributes[d],p=c.attributes[d];u.some((x,g)=>x!==p[g])&&h.push({name:d,from:u,to:p})}return{from:o,to:c,attributes:h}}),spread:t.spread,nextSpread:e,sourcePages:t.sourcePages,printPages:t.printPages,openAngle:t.openAngle}}applyTurn(e,t){this.inTurn=!0;const n=Dt(t,0,1);for(const s of e.entries){const r=s.from,a=s.to,o=r.object;o.visible=n===0?r.visible:(n===1||r.visible)&&a.visible,o.position.lerpVectors(r.position,a.position,n),o.quaternion.slerpQuaternions(r.quaternion,a.quaternion,n),o.scale.lerpVectors(r.scale,a.scale,n);for(const{name:l,from:c,to:h}of s.attributes){const d=o.geometry.attributes[l],u=d.array;for(let p=0;p<u.length;p++)u[p]=st(c[p],h[p],n);d.needsUpdate=!0}}return this.rig=new Ti(this.dimensions,e.sourcePages,st(e.spread,e.nextSpread,n),1,e.openAngle,e.printPages),this.rig}pageSurface(e,t,n,s){const r=new Ti(this.dimensions,n,t,1,this.last?.openAngle||154,this.last?.printPages||n),a=r.visibleLeaf(e);return a===null?r.spinePoint(.5).z:r.sheetPoint(a,e,s,.5).z}pagePoint(e,t,n,s,r){const a=new Ti(this.dimensions,n,t,1,this.last?.openAngle||154,this.last?.printPages||n),o=a.visibleLeaf(e);return o===null?{x:0,y:0,z:0}:a.sheetPoint(o,e,s,r)}getTop(e,t,n){return this.pageSurface(e,t,n,0)}dispose(){this.root.traverse(e=>{e.geometry&&e.geometry.dispose(),e.isLine&&e.material&&e.material.dispose()});for(const e of this.owned)e===this.frontPastedown.material&&e.map&&e.map.dispose(),e.dispose();this.root.clear()}}class d2{constructor({from:e,to:t,fromSide:n,toSide:s,columns:r=64,rows:a=16}){this.from=e,this.to=t,this.fromSide=n,this.toSide=s,this.fromLeaf=e.visibleLeaf(n),this.toLeaf=t.visibleLeaf(s),this.columns=r,this.rows=a,this.strips=[],this.fromHinge=e.hingeForLeaf(this.fromLeaf),this.toHinge=t.hingeForLeaf(this.toLeaf);for(let o=0;o<=a;o++){const l=o/a,c=[],h=[],d=[];for(let u=0;u<=r;u++)c.push(e.sheetPoint(this.fromLeaf,n,u/r,l)),h.push(t.sheetPoint(this.toLeaf,s,u/r,l));for(let u=0;u<r;u++){const p=c[u+1].x-c[u].x,x=c[u+1].z-c[u].z,g=h[u+1].x-h[u].x,m=h[u+1].z-h[u].z,f=Math.atan2(x,p);let M=Math.atan2(m,g);for(;M-f>Math.PI;)M-=Math.PI*2;for(;M-f<-Math.PI;)M+=Math.PI*2;d.push({a:Math.hypot(p,x),b:Math.hypot(g,m),thetaA:f,thetaB:M})}this.strips.push({a:c,b:h,segments:d})}}row(e,t,n=null){const s=Dt(t,0,1),r=this.strips[e],a=e/this.rows;if(s===0)return r.a.map(x=>({...x}));if(s===1)return r.b.map(x=>({...x}));const o=r.a[0],l=r.b[0];let c=st(o.x,l.x,s),h=st(o.z,l.z,s);if(n){const x=n.hingeForLeaf(st(this.fromLeaf,this.toLeaf,s));c=x.x+st(o.x-this.fromHinge.x,l.x-this.toHinge.x,s),h=x.z+st(o.z-this.fromHinge.z,l.z-this.toHinge.z,s)}const d=st(o.y,l.y,s),u=[{x:c,y:d,z:h}],p=Math.sin(Math.PI*s);for(let x=0;x<this.columns;x++){const g=(x+.5)/this.columns,m=r.segments[x],f=p*Math.sin(Math.PI*g)*(.24+.1*(a-.5)),M=st(m.thetaA,m.thetaB,s)+f,y=st(m.a,m.b,s);c+=Math.cos(M)*y,h+=Math.sin(M)*y,u.push({x:c,y:d,z:h})}return u}writePositions(e,t,n,s=null){const r=this.columns;for(let a=0;a<=this.rows;a++){const o=this.row(a,t,s),l=this.rows-a;for(let c=0;c<=r;c++){const h=o[n>0?c:r-c];e.setXYZ(l*(r+1)+c,h.x,h.y,h.z+.004)}}e.needsUpdate=!0}}class p2{constructor(e,t=fetch,n=null,s=globalThis.caches){this.baseURL=e,this.fetcher=(r,a)=>t.call(globalThis,r,a),this.manifest=n?Promise.resolve(n):null,this.packs=new Map,this.slices=new Map,this.pending=new Map,this.stats={requests:0,bytes:0,hits:0,diskHits:0},this.disk=s?s.open("inm-page-images-v1").catch(()=>null):Promise.resolve(null)}async index(){return this.manifest||(this.manifest=this.fetcher(this.baseURL+"index.json",{cache:"force-cache"}).then(async e=>{if(!e.ok)throw new Error("Preview index unavailable");const t=await e.json();if(t.version!==1||!t.pages||!t.packs)throw new Error("Invalid preview index");return t}).catch(e=>{throw this.manifest=null,e})),this.manifest}async blob(e){const t=await this.index(),n=t.pages[e];if(!n)throw new Error("Page has no preview");const[s,r,a]=n,o=t.packs[s],l=o+":"+r;if(this.slices.has(l))return this.stats.hits++,new Blob([await this.slices.get(l)],{type:"image/webp"});const c=await this.disk,h=new URL(this.baseURL+"cached-"+o+"-"+r+".webp",globalThis.location?.href||"https://inm.invalid/").href;if(c)try{const p=await c.match(h);if(p){const x=await p.arrayBuffer();return this.slices.set(l,Promise.resolve(x)),this.stats.diskHits++,new Blob([x],{type:"image/webp"})}}catch{}if(this.slices.has(l))return this.stats.hits++,new Blob([await this.slices.get(l)],{type:"image/webp"});let d;if(this.packs.has(o)){this.stats.hits++;const p=this.packs.get(o);d=Promise.resolve(this.extract(p,r,a))}else d=new Promise((p,x)=>{if(!this.pending.has(o)){const g=[];this.pending.set(o,g),setTimeout(()=>this.flush(o,g),8)}this.pending.get(o).push({offset:r,length:a,resolve:p,reject:x})});for(this.slices.set(l,d),d.catch(()=>{this.slices.get(l)===d&&this.slices.delete(l)});this.slices.size>24;)this.slices.delete(this.slices.keys().next().value);const u=await d;if(c)try{await c.put(h,new Response(u,{headers:{"Content-Type":"image/webp"}}))}catch{}return new Blob([u],{type:"image/webp"})}extract(e,t,n){if(t<8||t+n>e.byteLength)throw new Error("Truncated preview pack");return e.slice(t,t+n)}flush(e,t){this.pending.delete(e),t.sort((s,r)=>s.offset-r.offset);let n=[];for(const s of t)n.length&&(s.offset-(n.at(-1).offset+n.at(-1).length)>32768||s.offset+s.length-n[0].offset>524288)&&(this.transfer(e,n),n=[]),n.push(s);n.length&&this.transfer(e,n)}async transfer(e,t){const n=t[0].offset,s=t.at(-1).offset+t.at(-1).length;try{this.stats.requests++;const r=await this.fetcher(this.baseURL+e,{cache:"force-cache",headers:{Range:"bytes="+n+"-"+(s-1)}});if(!r.ok)throw new Error("Preview image unavailable");const a=await r.arrayBuffer();if(this.stats.bytes+=a.byteLength,r.status===206){if(a.byteLength!==s-n)throw new Error("Truncated preview image");for(const o of t)o.resolve(a.slice(o.offset-n,o.offset-n+o.length))}else{for(this.packs.set(e,a);this.packs.size>3;)this.packs.delete(this.packs.keys().next().value);const o=t.map(l=>this.extract(a,l.offset,l.length));t.forEach((l,c)=>l.resolve(o[c]))}}catch(r){for(const a of t)a.reject(r)}}}class m2{constructor(e,{revision:t,fetcher:n=fetch,storage:s=globalThis.caches}={}){this.url=e,this.revision=t||"current",this.fetcher=(r,a)=>n.call(globalThis,r,a),this.storage=s,this.promise=null,this.stats={requests:0,bytes:0,cacheHit:!1,ready:!1}}load(){return this.promise?this.promise:(this.promise=this.read().catch(e=>{throw this.promise=null,e}),this.promise)}async read(){const e=new URL(this.url,globalThis.location?.href||"https://inm.invalid/");e.searchParams.set("edition",this.revision);let t;try{t=await this.storage?.open("inm-reading-copy-v1")}catch{}if(t)try{const r=await t.match(e.href);if(r){const a=new Uint8Array(await r.arrayBuffer());if(this.valid(a))return this.stats.cacheHit=!0,this.stats.ready=!0,a;await t.delete(e.href)}}catch{}this.stats.requests++;const n=await this.fetcher(e.href,{cache:"force-cache",priority:"low"});if(!n.ok)throw new Error("Reading copy unavailable");const s=new Uint8Array(await n.arrayBuffer());if(!this.valid(s))throw new Error("Invalid reading copy");if(this.stats.bytes=s.byteLength,t)try{await t.put(e.href,new Response(s,{headers:{"Content-Type":"application/pdf"}}))}catch{}return this.stats.ready=!0,s}valid(e){return e.length>8&&String.fromCharCode(...e.subarray(0,5))==="%PDF-"}}class x2{constructor(){this.waiting=[],this.running=!1}run(e,t=!1){return new Promise((n,s)=>{const r={task:e,resolve:n,reject:s,prefetch:t};if(t)this.waiting.push(r);else{const a=this.waiting.findIndex(o=>o.prefetch);this.waiting.splice(a<0?this.waiting.length:a,0,r)}this.pump()})}async pump(){if(!this.running){for(this.running=!0;this.waiting.length;){const e=this.waiting.shift();try{e.resolve(await e.task())}catch(t){e.reject(t)}}this.running=!1}}}const g2=1,_2="49541e215e7f",v2=1248,M2=1100,b2=["chunk-00-49541e215e7f.bin","chunk-01-49541e215e7f.bin","chunk-02-49541e215e7f.bin","chunk-03-49541e215e7f.bin","chunk-04-49541e215e7f.bin","chunk-05-49541e215e7f.bin","chunk-06-49541e215e7f.bin","chunk-07-49541e215e7f.bin","chunk-08-49541e215e7f.bin","chunk-09-49541e215e7f.bin","chunk-10-49541e215e7f.bin","chunk-11-49541e215e7f.bin","chunk-12-49541e215e7f.bin","chunk-13-49541e215e7f.bin","chunk-14-49541e215e7f.bin","chunk-15-49541e215e7f.bin","chunk-16-49541e215e7f.bin","chunk-17-49541e215e7f.bin","chunk-18-49541e215e7f.bin","chunk-19-49541e215e7f.bin","chunk-20-49541e215e7f.bin","chunk-21-49541e215e7f.bin","chunk-22-49541e215e7f.bin","chunk-23-49541e215e7f.bin","chunk-24-49541e215e7f.bin","chunk-25-49541e215e7f.bin","chunk-26-49541e215e7f.bin","chunk-27-49541e215e7f.bin","chunk-28-49541e215e7f.bin","chunk-29-49541e215e7f.bin","chunk-30-49541e215e7f.bin","chunk-31-49541e215e7f.bin","chunk-32-49541e215e7f.bin","chunk-33-49541e215e7f.bin","chunk-34-49541e215e7f.bin","chunk-35-49541e215e7f.bin","chunk-36-49541e215e7f.bin","chunk-37-49541e215e7f.bin","chunk-38-49541e215e7f.bin"],S2=JSON.parse("[null,[0,8,55064,778,1100],[0,55072,1600,778,1100],[0,56672,3366,778,1100],[0,60038,1600,778,1100],[0,61638,79868,778,1100],[0,141506,1600,778,1100],[0,143106,69074,778,1100],[0,212180,88764,778,1100],[0,300944,87296,778,1100],[0,388240,94814,778,1100],[0,483054,88198,778,1100],[0,571252,91730,778,1100],[0,662982,84182,778,1100],[0,747164,90736,778,1100],[0,837900,97112,778,1100],[0,935012,97614,778,1100],[0,1032626,95930,778,1100],[0,1128556,90144,778,1100],[0,1218700,94528,778,1100],[0,1313228,100648,778,1100],[0,1413876,90898,778,1100],[0,1504774,94966,778,1100],[0,1599740,97672,778,1100],[0,1697412,90602,778,1100],[0,1788014,93950,778,1100],[0,1881964,86824,778,1100],[0,1968788,95138,778,1100],[0,2063926,90834,778,1100],[0,2154760,88392,778,1100],[0,2243152,99104,778,1100],[0,2342256,87384,778,1100],[0,2429640,98174,778,1100],[1,8,93572,778,1100],[1,93580,89960,778,1100],[1,183540,100000,778,1100],[1,283540,98578,778,1100],[1,382118,88330,778,1100],[1,470448,104600,778,1100],[1,575048,4556,778,1100],[1,579604,1600,778,1100],[1,581204,5566,778,1100],[1,586770,75738,778,1100],[1,662508,80568,778,1100],[1,743076,38068,778,1100],[1,781144,63768,778,1100],[1,844912,49468,778,1100],[1,894380,56664,778,1100],[1,951044,70632,778,1100],[1,1021676,49848,778,1100],[1,1071524,50088,778,1100],[1,1121612,55720,778,1100],[1,1177332,40540,778,1100],[1,1217872,22000,778,1100],[1,1239872,1600,778,1100],[1,1241472,61362,778,1100],[1,1302834,60702,778,1100],[1,1363536,56344,778,1100],[1,1419880,22712,778,1100],[1,1442592,49784,778,1100],[1,1492376,1600,778,1100],[1,1493976,69882,778,1100],[1,1563858,58940,778,1100],[1,1622798,76708,778,1100],[1,1699506,55576,778,1100],[2,8,78050,778,1100],[2,78058,74694,778,1100],[2,152752,80512,778,1100],[2,233264,82766,778,1100],[2,316030,78862,778,1100],[2,394892,88824,778,1100],[2,483716,27900,778,1100],[2,511616,1600,778,1100],[2,513216,71910,778,1100],[2,585126,67866,778,1100],[2,652992,81036,778,1100],[2,734028,31756,778,1100],[2,765784,73878,778,1100],[2,839662,72012,778,1100],[2,911674,74358,778,1100],[2,986032,67816,778,1100],[2,1053848,70628,778,1100],[2,1124476,82396,778,1100],[2,1206872,112110,778,1100],[2,1318982,52270,778,1100],[2,1371252,79576,778,1100],[2,1450828,84564,778,1100],[2,1535392,98570,778,1100],[2,1633962,9292,778,1100],[2,1643254,72796,778,1100],[2,1716050,75054,778,1100],[2,1791104,58070,778,1100],[2,1849174,21686,778,1100],[2,1870860,82938,778,1100],[2,1953798,91498,778,1100],[2,2045296,76068,778,1100],[2,2121364,1600,778,1100],[3,8,70402,778,1100],[3,70410,83146,778,1100],[3,153556,24026,778,1100],[3,177582,1600,778,1100],[3,179182,54618,778,1100],[3,233800,47456,778,1100],[3,281256,73294,778,1100],[3,354550,44292,778,1100],[3,398842,25348,778,1100],[3,424190,1600,778,1100],[3,425790,63408,778,1100],[3,489198,77792,778,1100],[3,566990,61040,778,1100],[3,628030,65438,778,1100],[3,693468,73530,778,1100],[3,766998,68902,778,1100],[3,835900,60730,778,1100],[3,896630,34870,778,1100],[3,931500,72148,778,1100],[3,1003648,73116,778,1100],[3,1076764,61322,778,1100],[3,1138086,59796,778,1100],[3,1197882,87882,778,1100],[3,1285764,82428,778,1100],[3,1368192,49922,778,1100],[3,1418114,1600,778,1100],[3,1419714,49384,778,1100],[3,1469098,52426,778,1100],[3,1521524,45764,778,1100],[3,1567288,53404,778,1100],[3,1620692,70372,778,1100],[3,1691064,28510,778,1100],[4,8,4008,778,1100],[4,4016,81362,778,1100],[4,85378,79258,778,1100],[4,164636,1600,778,1100],[4,166236,52592,778,1100],[4,218828,37102,778,1100],[4,255930,41278,778,1100],[4,297208,46948,778,1100],[4,344156,50340,778,1100],[4,394496,42156,778,1100],[4,436652,48638,778,1100],[4,485290,24008,778,1100],[4,509298,45886,778,1100],[4,555184,55264,778,1100],[4,610448,53530,778,1100],[4,663978,35944,778,1100],[4,699922,80186,778,1100],[4,780108,62374,778,1100],[4,842482,31892,778,1100],[4,874374,1600,778,1100],[4,875974,64106,778,1100],[4,940080,59636,778,1100],[4,999716,47412,778,1100],[4,1047128,1600,778,1100],[4,1048728,63768,778,1100],[4,1112496,59322,778,1100],[4,1171818,69308,778,1100],[4,1241126,46186,778,1100],[4,1287312,78868,778,1100],[4,1366180,1600,778,1100],[4,1367780,55662,778,1100],[4,1423442,58438,778,1100],[5,8,49896,778,1100],[5,49904,57082,778,1100],[5,106986,77326,778,1100],[5,184312,54028,778,1100],[5,238340,57756,778,1100],[5,296096,52590,778,1100],[5,348686,41944,778,1100],[5,390630,53598,778,1100],[5,444228,59400,778,1100],[5,503628,38318,778,1100],[5,541946,52388,778,1100],[5,594334,55874,778,1100],[5,650208,54370,778,1100],[5,704578,39170,778,1100],[5,743748,51520,778,1100],[5,795268,39494,778,1100],[5,834762,52130,778,1100],[5,886892,47724,778,1100],[5,934616,35356,778,1100],[5,969972,47780,778,1100],[5,1017752,68014,778,1100],[5,1085766,1600,778,1100],[5,1087366,72202,778,1100],[5,1159568,60296,778,1100],[5,1219864,49748,778,1100],[5,1269612,36366,778,1100],[5,1305978,64826,778,1100],[5,1370804,57166,778,1100],[5,1427970,63338,778,1100],[5,1491308,14614,778,1100],[5,1505922,38458,778,1100],[5,1544380,50446,778,1100],[6,8,57354,778,1100],[6,57362,47402,778,1100],[6,104764,55858,778,1100],[6,160622,46774,778,1100],[6,207396,46968,778,1100],[6,254364,49184,778,1100],[6,303548,69044,778,1100],[6,372592,1600,778,1100],[6,374192,7194,778,1100],[6,381386,82122,778,1100],[6,463508,84162,778,1100],[6,547670,52364,778,1100],[6,600034,71310,778,1100],[6,671344,52636,778,1100],[6,723980,49268,778,1100],[6,773248,61246,778,1100],[6,834494,73900,778,1100],[6,908394,47050,778,1100],[6,955444,54598,778,1100],[6,1010042,26098,778,1100],[6,1036140,39696,778,1100],[6,1075836,43200,778,1100],[6,1119036,44958,778,1100],[6,1163994,53384,778,1100],[6,1217378,39218,778,1100],[6,1256596,56910,778,1100],[6,1313506,38456,778,1100],[6,1351962,1600,778,1100],[6,1353562,64274,778,1100],[6,1417836,75310,778,1100],[6,1493146,70852,778,1100],[6,1563998,1600,778,1100],[7,8,55510,778,1100],[7,55518,66010,778,1100],[7,121528,68416,778,1100],[7,189944,26320,778,1100],[7,216264,68186,778,1100],[7,284450,46040,778,1100],[7,330490,55718,778,1100],[7,386208,73096,778,1100],[7,459304,57308,778,1100],[7,516612,49652,778,1100],[7,566264,49094,778,1100],[7,615358,50752,778,1100],[7,666110,79518,778,1100],[7,745628,71212,778,1100],[7,816840,16650,778,1100],[7,833490,1600,778,1100],[7,835090,56420,778,1100],[7,891510,49932,778,1100],[7,941442,54564,778,1100],[7,996006,74058,778,1100],[7,1070064,81600,778,1100],[7,1151664,21996,778,1100],[7,1173660,49324,778,1100],[7,1222984,61958,778,1100],[7,1284942,72826,778,1100],[7,1357768,7986,778,1100],[7,1365754,53584,778,1100],[7,1419338,44724,778,1100],[7,1464062,75496,778,1100],[7,1539558,12050,778,1100],[7,1551608,42656,778,1100],[7,1594264,85928,778,1100],[8,8,56478,778,1100],[8,56486,72056,778,1100],[8,128542,54038,778,1100],[8,182580,65070,778,1100],[8,247650,82404,778,1100],[8,330054,34738,778,1100],[8,364792,52094,778,1100],[8,416886,62302,778,1100],[8,479188,46546,778,1100],[8,525734,85144,778,1100],[8,610878,71884,778,1100],[8,682762,43316,778,1100],[8,726078,79148,778,1100],[8,805226,59000,778,1100],[8,864226,89406,778,1100],[8,953632,65542,778,1100],[8,1019174,54178,778,1100],[8,1073352,54990,778,1100],[8,1128342,55594,778,1100],[8,1183936,80892,778,1100],[8,1264828,69782,778,1100],[8,1334610,74890,778,1100],[8,1409500,73180,778,1100],[8,1482680,64016,778,1100],[8,1546696,66256,778,1100],[8,1612952,72606,778,1100],[8,1685558,75040,778,1100],[8,1760598,62692,778,1100],[8,1823290,97628,778,1100],[8,1920918,40672,778,1100],[8,1961590,74728,778,1100],[8,2036318,81936,778,1100],[9,8,64142,778,1100],[9,64150,66042,778,1100],[9,130192,61748,778,1100],[9,191940,77370,778,1100],[9,269310,54316,778,1100],[9,323626,61458,778,1100],[9,385084,75132,778,1100],[9,460216,24492,778,1100],[9,484708,75418,778,1100],[9,560126,71990,778,1100],[9,632116,48196,778,1100],[9,680312,85030,778,1100],[9,765342,55714,778,1100],[9,821056,67822,778,1100],[9,888878,87000,778,1100],[9,975878,1600,778,1100],[9,977478,5670,778,1100],[9,983148,85658,778,1100],[9,1068806,91400,778,1100],[9,1160206,24806,778,1100],[9,1185012,66694,778,1100],[9,1251706,52202,778,1100],[9,1303908,51926,778,1100],[9,1355834,40150,778,1100],[9,1395984,47506,778,1100],[9,1443490,46610,778,1100],[9,1490100,36544,778,1100],[9,1526644,1600,778,1100],[9,1528244,60362,778,1100],[9,1588606,63406,778,1100],[9,1652012,53068,778,1100],[9,1705080,31584,778,1100],[10,8,49312,778,1100],[10,49320,59782,778,1100],[10,109102,75214,778,1100],[10,184316,86456,778,1100],[10,270772,65724,778,1100],[10,336496,75640,778,1100],[10,412136,78622,778,1100],[10,490758,1600,778,1100],[10,492358,54488,778,1100],[10,546846,56242,778,1100],[10,603088,48762,778,1100],[10,651850,1600,778,1100],[10,653450,53608,778,1100],[10,707058,56342,778,1100],[10,763400,62630,778,1100],[10,826030,27110,778,1100],[10,853140,43876,778,1100],[10,897016,46674,778,1100],[10,943690,37166,778,1100],[10,980856,35880,778,1100],[10,1016736,50806,778,1100],[10,1067542,41268,778,1100],[10,1108810,42436,778,1100],[10,1151246,28322,778,1100],[10,1179568,65134,778,1100],[10,1244702,55668,778,1100],[10,1300370,58150,778,1100],[10,1358520,1600,778,1100],[10,1360120,65664,778,1100],[10,1425784,65130,778,1100],[10,1490914,77940,778,1100],[10,1568854,74194,778,1100],[11,8,53244,778,1100],[11,53252,1600,778,1100],[11,54852,65350,778,1100],[11,120202,65134,778,1100],[11,185336,72138,778,1100],[11,257474,1600,778,1100],[11,259074,48908,778,1100],[11,307982,49658,778,1100],[11,357640,61688,778,1100],[11,419328,68500,778,1100],[11,487828,64732,778,1100],[11,552560,58328,778,1100],[11,610888,48812,778,1100],[11,659700,83792,778,1100],[11,743492,59276,778,1100],[11,802768,70602,778,1100],[11,873370,61376,778,1100],[11,934746,62294,778,1100],[11,997040,73332,778,1100],[11,1070372,49380,778,1100],[11,1119752,54156,778,1100],[11,1173908,73394,778,1100],[11,1247302,36182,778,1100],[11,1283484,1600,778,1100],[11,1285084,61696,778,1100],[11,1346780,58380,778,1100],[11,1405160,54174,778,1100],[11,1459334,54170,778,1100],[11,1513504,54362,778,1100],[11,1567866,58224,778,1100],[11,1626090,6038,778,1100],[11,1632128,88748,778,1100],[12,8,91288,778,1100],[12,91296,22642,778,1100],[12,113938,68806,778,1100],[12,182744,67874,778,1100],[12,250618,65170,778,1100],[12,315788,82560,778,1100],[12,398348,61554,778,1100],[12,459902,72168,778,1100],[12,532070,72104,778,1100],[12,604174,74132,778,1100],[12,678306,79132,778,1100],[12,757438,51694,778,1100],[12,809132,66372,778,1100],[12,875504,87658,778,1100],[12,963162,95006,778,1100],[12,1058168,1600,778,1100],[12,1059768,63162,778,1100],[12,1122930,66038,778,1100],[12,1188968,53834,778,1100],[12,1242802,1600,778,1100],[12,1244402,43378,778,1100],[12,1287780,41398,778,1100],[12,1329178,45412,778,1100],[12,1374590,47764,778,1100],[12,1422354,42500,778,1100],[12,1464854,34240,778,1100],[12,1499094,34294,778,1100],[12,1533388,14104,778,1100],[12,1547492,75308,778,1100],[12,1622800,60768,778,1100],[12,1683568,41316,778,1100],[12,1724884,1600,778,1100],[13,8,72824,778,1100],[13,72832,43092,778,1100],[13,115924,41906,778,1100],[13,157830,46106,778,1100],[13,203936,57924,778,1100],[13,261860,45312,778,1100],[13,307172,39188,778,1100],[13,346360,56056,778,1100],[13,402416,66274,778,1100],[13,468690,1600,778,1100],[13,470290,51286,778,1100],[13,521576,50102,778,1100],[13,571678,59604,778,1100],[13,631282,55884,778,1100],[13,687166,51220,778,1100],[13,738386,32156,778,1100],[13,770542,39146,778,1100],[13,809688,1600,778,1100],[13,811288,66916,778,1100],[13,878204,43270,778,1100],[13,921474,56158,778,1100],[13,977632,52902,778,1100],[13,1030534,51936,778,1100],[13,1082470,51464,778,1100],[13,1133934,70954,778,1100],[13,1204888,50406,778,1100],[13,1255294,37206,778,1100],[13,1292500,32268,778,1100],[13,1324768,46590,778,1100],[13,1371358,61606,778,1100],[13,1432964,54302,778,1100],[13,1487266,66832,778,1100],[14,8,47360,778,1100],[14,47368,52914,778,1100],[14,100282,66032,778,1100],[14,166314,1600,778,1100],[14,167914,59148,778,1100],[14,227062,57880,778,1100],[14,284942,50164,778,1100],[14,335106,42710,778,1100],[14,377816,56378,778,1100],[14,434194,49928,778,1100],[14,484122,64360,778,1100],[14,548482,38852,778,1100],[14,587334,45248,778,1100],[14,632582,42734,778,1100],[14,675316,45430,778,1100],[14,720746,1600,778,1100],[14,722346,50652,778,1100],[14,772998,40370,778,1100],[14,813368,49556,778,1100],[14,862924,54414,778,1100],[14,917338,55106,778,1100],[14,972444,39124,778,1100],[14,1011568,43458,778,1100],[14,1055026,60248,778,1100],[14,1115274,22390,778,1100],[14,1137664,1600,778,1100],[14,1139264,6914,778,1100],[14,1146178,86778,778,1100],[14,1232956,93942,778,1100],[14,1326898,38076,778,1100],[14,1364974,86562,778,1100],[14,1451536,59192,778,1100],[15,8,31212,778,1100],[15,31220,1600,778,1100],[15,32820,51534,778,1100],[15,84354,41458,778,1100],[15,125812,38400,778,1100],[15,164212,47088,778,1100],[15,211300,40560,778,1100],[15,251860,49736,778,1100],[15,301596,46178,778,1100],[15,347774,45428,778,1100],[15,393202,49264,778,1100],[15,442466,42242,778,1100],[15,484708,67070,778,1100],[15,551778,53560,778,1100],[15,605338,46634,778,1100],[15,651972,44894,778,1100],[15,696866,55146,778,1100],[15,752012,34806,778,1100],[15,786818,58600,778,1100],[15,845418,55404,778,1100],[15,900822,55936,778,1100],[15,956758,48948,778,1100],[15,1005706,52546,778,1100],[15,1058252,68066,778,1100],[15,1126318,21798,778,1100],[15,1148116,1600,778,1100],[15,1149716,48956,778,1100],[15,1198672,37630,778,1100],[15,1236302,47584,778,1100],[15,1283886,35698,778,1100],[15,1319584,59758,778,1100],[15,1379342,67506,778,1100],[16,8,59974,778,1100],[16,59982,1600,778,1100],[16,61582,46606,778,1100],[16,108188,58040,778,1100],[16,166228,46510,778,1100],[16,212738,54150,778,1100],[16,266888,59332,778,1100],[16,326220,61334,778,1100],[16,387554,52482,778,1100],[16,440036,52988,778,1100],[16,493024,47896,778,1100],[16,540920,40222,778,1100],[16,581142,37032,778,1100],[16,618174,58850,778,1100],[16,677024,38672,778,1100],[16,715696,56928,778,1100],[16,772624,70644,778,1100],[16,843268,60072,778,1100],[16,903340,40908,778,1100],[16,944248,49924,778,1100],[16,994172,49448,778,1100],[16,1043620,54334,778,1100],[16,1097954,51238,778,1100],[16,1149192,65748,778,1100],[16,1214940,76052,778,1100],[16,1290992,27332,778,1100],[16,1318324,58512,778,1100],[16,1376836,43816,778,1100],[16,1420652,32478,778,1100],[16,1453130,58890,778,1100],[16,1512020,34508,778,1100],[16,1546528,47330,778,1100],[17,8,52074,778,1100],[17,52082,37744,778,1100],[17,89826,61830,778,1100],[17,151656,18590,778,1100],[17,170246,55114,778,1100],[17,225360,45666,778,1100],[17,271026,54226,778,1100],[17,325252,38586,778,1100],[17,363838,38654,778,1100],[17,402492,57504,778,1100],[17,459996,38760,778,1100],[17,498756,52004,778,1100],[17,550760,30378,778,1100],[17,581138,1600,778,1100],[17,582738,60804,778,1100],[17,643542,54752,778,1100],[17,698294,50934,778,1100],[17,749228,42160,778,1100],[17,791388,51204,778,1100],[17,842592,72468,778,1100],[17,915060,17790,778,1100],[17,932850,1600,778,1100],[17,934450,6152,778,1100],[17,940602,84140,778,1100],[17,1024742,95742,778,1100],[17,1120484,75842,778,1100],[17,1196326,67892,778,1100],[17,1264218,56088,778,1100],[17,1320306,40024,778,1100],[17,1360330,1600,778,1100],[17,1361930,65640,778,1100],[17,1427570,50786,778,1100],[18,8,68730,778,1100],[18,68738,33920,778,1100],[18,102658,34578,778,1100],[18,137236,41216,778,1100],[18,178452,35510,778,1100],[18,213962,41016,778,1100],[18,254978,37072,778,1100],[18,292050,47934,778,1100],[18,339984,57630,778,1100],[18,397614,36400,778,1100],[18,434014,48316,778,1100],[18,482330,39632,778,1100],[18,521962,51900,778,1100],[18,573862,50358,778,1100],[18,624220,70918,778,1100],[18,695138,46336,778,1100],[18,741474,44722,778,1100],[18,786196,70276,778,1100],[18,856472,12806,778,1100],[18,869278,1600,778,1100],[18,870878,68394,778,1100],[18,939272,51818,778,1100],[18,991090,59588,778,1100],[18,1050678,31736,778,1100],[18,1082414,56362,778,1100],[18,1138776,67922,778,1100],[18,1206698,56732,778,1100],[18,1263430,34626,778,1100],[18,1298056,40024,778,1100],[18,1338080,48784,778,1100],[18,1386864,46750,778,1100],[18,1433614,49144,778,1100],[19,8,48454,778,1100],[19,48462,45112,778,1100],[19,93574,65124,778,1100],[19,158698,25288,778,1100],[19,183986,46106,778,1100],[19,230092,32410,778,1100],[19,262502,46720,778,1100],[19,309222,45544,778,1100],[19,354766,36340,778,1100],[19,391106,47126,778,1100],[19,438232,49868,778,1100],[19,488100,43210,778,1100],[19,531310,26788,778,1100],[19,558098,1600,778,1100],[19,559698,51172,778,1100],[19,610870,44894,778,1100],[19,655764,40598,778,1100],[19,696362,52442,778,1100],[19,748804,61022,778,1100],[19,809826,50774,778,1100],[19,860600,56314,778,1100],[19,916914,60198,778,1100],[19,977112,46642,778,1100],[19,1023754,47392,778,1100],[19,1071146,44040,778,1100],[19,1115186,54064,778,1100],[19,1169250,68210,778,1100],[19,1237460,64826,778,1100],[19,1302286,60000,778,1100],[19,1362286,26758,778,1100],[19,1389044,49238,778,1100],[19,1438282,61032,778,1100],[20,8,45230,778,1100],[20,45238,45972,778,1100],[20,91210,35962,778,1100],[20,127172,55418,778,1100],[20,182590,56148,778,1100],[20,238738,64088,778,1100],[20,302826,44948,778,1100],[20,347774,64766,778,1100],[20,412540,43896,778,1100],[20,456436,30886,778,1100],[20,487322,46450,778,1100],[20,533772,52446,778,1100],[20,586218,49364,778,1100],[20,635582,40550,778,1100],[20,676132,22254,778,1100],[20,698386,1600,778,1100],[20,699986,63338,778,1100],[20,763324,53004,778,1100],[20,816328,60752,778,1100],[20,877080,42912,778,1100],[20,919992,39330,778,1100],[20,959322,40296,778,1100],[20,999618,34746,778,1100],[20,1034364,1600,778,1100],[20,1035964,73292,778,1100],[20,1109256,56462,778,1100],[20,1165718,64670,778,1100],[20,1230388,32480,778,1100],[20,1262868,49730,778,1100],[20,1312598,57750,778,1100],[20,1370348,57342,778,1100],[20,1427690,68824,778,1100],[21,8,65356,778,1100],[21,65364,1600,778,1100],[21,66964,71338,778,1100],[21,138302,57882,778,1100],[21,196184,83852,778,1100],[21,280036,61498,778,1100],[21,341534,68702,778,1100],[21,410236,77878,778,1100],[21,488114,63122,778,1100],[21,551236,61404,778,1100],[21,612640,60036,778,1100],[21,672676,1600,778,1100],[21,674276,6510,778,1100],[21,680786,86472,778,1100],[21,767258,84056,778,1100],[21,851314,84826,778,1100],[21,936140,38906,778,1100],[21,975046,1600,778,1100],[21,976646,61888,778,1100],[21,1038534,64408,778,1100],[21,1102942,32916,778,1100],[21,1135858,1600,778,1100],[21,1137458,45092,778,1100],[21,1182550,59242,778,1100],[21,1241792,37132,778,1100],[21,1278924,78234,778,1100],[21,1357158,57134,778,1100],[21,1414292,55570,778,1100],[21,1469862,49932,778,1100],[21,1519794,47066,778,1100],[21,1566860,43932,778,1100],[21,1610792,55264,778,1100],[22,8,47674,778,1100],[22,47682,45832,778,1100],[22,93514,51952,778,1100],[22,145466,30852,778,1100],[22,176318,54914,778,1100],[22,231232,54068,778,1100],[22,285300,52672,778,1100],[22,337972,57234,778,1100],[22,395206,71392,778,1100],[22,466598,52184,778,1100],[22,518782,76414,778,1100],[22,595196,83126,778,1100],[22,678322,38054,778,1100],[22,716376,1600,778,1100],[22,717976,62096,778,1100],[22,780072,57560,778,1100],[22,837632,45190,778,1100],[22,882822,48894,778,1100],[22,931716,54966,778,1100],[22,986682,62734,778,1100],[22,1049416,42556,778,1100],[22,1091972,1600,778,1100],[22,1093572,45700,778,1100],[22,1139272,57862,778,1100],[22,1197134,56726,778,1100],[22,1253860,59566,778,1100],[22,1313426,58130,778,1100],[22,1371556,59858,778,1100],[22,1431414,57214,778,1100],[22,1488628,1600,778,1100],[22,1490228,70682,778,1100],[22,1560910,61268,778,1100],[23,8,70250,778,1100],[23,70258,36184,778,1100],[23,106442,49466,778,1100],[23,155908,48344,778,1100],[23,204252,67328,778,1100],[23,271580,51894,778,1100],[23,323474,46146,778,1100],[23,369620,50798,778,1100],[23,420418,55666,778,1100],[23,476084,29132,778,1100],[23,505216,40220,778,1100],[23,545436,1600,778,1100],[23,547036,43862,778,1100],[23,590898,35238,778,1100],[23,626136,40796,778,1100],[23,666932,38676,778,1100],[23,705608,42832,778,1100],[23,748440,54236,778,1100],[23,802676,43846,778,1100],[23,846522,24548,778,1100],[23,871070,51768,778,1100],[23,922838,43986,778,1100],[23,966824,46924,778,1100],[23,1013748,29644,778,1100],[23,1043392,44754,778,1100],[23,1088146,43084,778,1100],[23,1131230,54818,778,1100],[23,1186048,54350,778,1100],[23,1240398,61572,778,1100],[23,1301970,72652,778,1100],[23,1374622,70590,778,1100],[23,1445212,25458,778,1100],[24,8,59328,778,1100],[24,59336,47944,778,1100],[24,107280,56402,778,1100],[24,163682,37640,778,1100],[24,201322,40794,778,1100],[24,242116,39218,778,1100],[24,281334,47200,778,1100],[24,328534,64088,778,1100],[24,392622,63704,778,1100],[24,456326,1600,778,1100],[24,457926,60956,778,1100],[24,518882,60398,778,1100],[24,579280,55976,778,1100],[24,635256,30182,778,1100],[24,665438,52718,778,1100],[24,718156,60730,778,1100],[24,778886,63252,778,1100],[24,842138,38992,778,1100],[24,881130,64946,778,1100],[24,946076,53236,778,1100],[24,999312,73734,778,1100],[24,1073046,13176,778,1100],[24,1086222,52386,778,1100],[24,1138608,42158,778,1100],[24,1180766,59440,778,1100],[24,1240206,60616,778,1100],[24,1300822,65624,778,1100],[24,1366446,52094,778,1100],[24,1418540,69734,778,1100],[24,1488274,21628,778,1100],[24,1509902,7352,778,1100],[24,1517254,80410,778,1100],[25,8,30390,778,1100],[25,30398,1600,778,1100],[25,31998,50150,778,1100],[25,82148,41416,778,1100],[25,123564,31942,778,1100],[25,155506,44034,778,1100],[25,199540,36076,778,1100],[25,235616,40050,778,1100],[25,275666,55204,778,1100],[25,330870,47782,778,1100],[25,378652,37918,778,1100],[25,416570,36968,778,1100],[25,453538,71260,778,1100],[25,524798,1600,778,1100],[25,526398,68616,778,1100],[25,595014,49080,778,1100],[25,644094,80142,778,1100],[25,724236,18086,778,1100],[25,742322,58788,778,1100],[25,801110,58148,778,1100],[25,859258,60824,778,1100],[25,920082,38934,778,1100],[25,959016,44782,778,1100],[25,1003798,54786,778,1100],[25,1058584,53000,778,1100],[25,1111584,54580,778,1100],[25,1166164,83266,778,1100],[25,1249430,61896,778,1100],[25,1311326,54236,778,1100],[25,1365562,45784,778,1100],[25,1411346,56694,778,1100],[25,1468040,68568,778,1100],[26,8,26466,778,1100],[26,26474,1600,778,1100],[26,28074,52212,778,1100],[26,80286,70254,778,1100],[26,150540,49528,778,1100],[26,200068,53628,778,1100],[26,253696,61150,778,1100],[26,314846,55822,778,1100],[26,370668,80398,778,1100],[26,451066,56162,778,1100],[26,507228,63996,778,1100],[26,571224,64926,778,1100],[26,636150,63232,778,1100],[26,699382,44786,778,1100],[26,744168,6752,778,1100],[26,750920,84236,778,1100],[26,835156,89172,778,1100],[26,924328,17856,778,1100],[26,942184,62728,778,1100],[26,1004912,86652,778,1100],[26,1091564,63160,778,1100],[26,1154724,63762,778,1100],[26,1218486,69098,778,1100],[26,1287584,56196,778,1100],[26,1343780,78152,778,1100],[26,1421932,67914,778,1100],[26,1489846,13510,778,1100],[26,1503356,1600,778,1100],[26,1504956,50676,778,1100],[26,1555632,57172,778,1100],[26,1612804,58650,778,1100],[26,1671454,38708,778,1100],[27,8,57654,778,1100],[27,57662,61310,778,1100],[27,118972,65332,778,1100],[27,184304,16980,778,1100],[27,201284,57918,778,1100],[27,259202,68458,778,1100],[27,327660,79652,778,1100],[27,407312,1600,778,1100],[27,408912,46678,778,1100],[27,455590,55992,778,1100],[27,511582,54146,778,1100],[27,565728,54864,778,1100],[27,620592,41984,778,1100],[27,662576,44490,778,1100],[27,707066,40782,778,1100],[27,747848,54480,778,1100],[27,802328,57870,778,1100],[27,860198,40742,778,1100],[27,900940,42776,778,1100],[27,943716,47150,778,1100],[27,990866,43022,778,1100],[27,1033888,38164,778,1100],[27,1072052,53904,778,1100],[27,1125956,35602,778,1100],[27,1161558,39848,778,1100],[27,1201406,1600,778,1100],[27,1203006,63212,778,1100],[27,1266218,56014,778,1100],[27,1322232,83394,778,1100],[27,1405626,76372,778,1100],[27,1481998,39474,778,1100],[27,1521472,42498,778,1100],[28,8,52628,778,1100],[28,52636,89324,778,1100],[28,141960,87848,778,1100],[28,229808,1600,778,1100],[28,231408,62868,778,1100],[28,294276,64810,778,1100],[28,359086,55268,778,1100],[28,414354,62900,778,1100],[28,477254,71406,778,1100],[28,548660,1600,778,1100],[28,550260,59672,778,1100],[28,609932,55760,778,1100],[28,665692,64302,778,1100],[28,729994,62678,778,1100],[28,792672,57122,778,1100],[28,849794,58146,778,1100],[28,907940,50514,778,1100],[28,958454,1600,778,1100],[28,960054,55758,778,1100],[28,1015812,56682,778,1100],[28,1072494,65684,778,1100],[28,1138178,1600,778,1100],[28,1139778,62874,778,1100],[28,1202652,77592,778,1100],[28,1280244,51154,778,1100],[28,1331398,1600,778,1100],[28,1332998,63068,778,1100],[28,1396066,38894,778,1100],[28,1434960,47290,778,1100],[28,1482250,64604,778,1100],[28,1546854,70000,778,1100],[28,1616854,72692,778,1100],[29,8,81386,778,1100],[29,81394,75554,778,1100],[29,156948,6684,778,1100],[29,163632,86668,778,1100],[29,250300,86288,778,1100],[29,336588,61040,778,1100],[29,397628,55162,778,1100],[29,452790,44436,778,1100],[29,497226,55462,778,1100],[29,552688,62242,778,1100],[29,614930,73142,778,1100],[29,688072,52526,778,1100],[29,740598,63182,778,1100],[29,803780,64752,778,1100],[29,868532,36972,778,1100],[29,905504,1600,778,1100],[29,907104,78564,778,1100],[29,985668,92342,778,1100],[29,1078010,56256,778,1100],[29,1134266,1600,778,1100],[29,1135866,60288,778,1100],[29,1196154,50050,778,1100],[29,1246204,60766,778,1100],[29,1306970,66464,778,1100],[29,1373434,62434,778,1100],[29,1435868,67940,778,1100],[29,1503808,26434,778,1100],[29,1530242,1600,778,1100],[29,1531842,47720,778,1100],[29,1579562,49736,778,1100],[29,1629298,53530,778,1100],[29,1682828,60556,778,1100],[30,8,68748,778,1100],[30,68756,1600,778,1100],[30,70356,43882,778,1100],[30,114238,61666,778,1100],[30,175904,43120,778,1100],[30,219024,48802,778,1100],[30,267826,51090,778,1100],[30,318916,75690,778,1100],[30,394606,81772,778,1100],[30,476378,67646,778,1100],[30,544024,29410,778,1100],[30,573434,1600,778,1100],[30,575034,71590,778,1100],[30,646624,72260,778,1100],[30,718884,52918,778,1100],[30,771802,51676,778,1100],[30,823478,49810,778,1100],[30,873288,56654,778,1100],[30,929942,59314,778,1100],[30,989256,66252,778,1100],[30,1055508,43916,778,1100],[30,1099424,1600,778,1100],[30,1101024,79786,778,1100],[30,1180810,88788,778,1100],[30,1269598,55842,778,1100],[30,1325440,58924,778,1100],[30,1384364,45130,778,1100],[30,1429494,48066,778,1100],[30,1477560,33740,778,1100],[30,1511300,1600,778,1100],[30,1512900,55150,778,1100],[30,1568050,67936,778,1100],[31,8,51048,778,1100],[31,51056,77244,778,1100],[31,128300,51472,778,1100],[31,179772,52080,778,1100],[31,231852,62466,778,1100],[31,294318,76324,778,1100],[31,370642,80352,778,1100],[31,450994,76896,778,1100],[31,527890,45662,778,1100],[31,573552,96934,778,1100],[31,670486,20360,778,1100],[31,690846,1600,778,1100],[31,692446,45664,778,1100],[31,738110,57308,778,1100],[31,795418,74036,778,1100],[31,869454,64118,778,1100],[31,933572,68230,778,1100],[31,1001802,69104,778,1100],[31,1070906,50568,778,1100],[31,1121474,27166,778,1100],[31,1148640,72878,778,1100],[31,1221518,78472,778,1100],[31,1299990,44056,778,1100],[31,1344046,77658,778,1100],[31,1421704,60938,778,1100],[31,1482642,54074,778,1100],[31,1536716,69426,778,1100],[31,1606142,73208,778,1100],[31,1679350,59308,778,1100],[31,1738658,67942,778,1100],[31,1806600,49000,778,1100],[31,1855600,39404,778,1100],[32,8,44332,778,1100],[32,44340,43624,778,1100],[32,87964,36538,778,1100],[32,124502,1600,778,1100],[32,126102,95590,778,1100],[32,221692,72628,778,1100],[32,294320,68802,778,1100],[32,363122,67838,778,1100],[32,430960,70174,778,1100],[32,501134,69138,778,1100],[32,570272,85320,778,1100],[32,655592,78170,778,1100],[32,733762,91268,778,1100],[32,825030,78098,778,1100],[32,903128,92372,778,1100],[32,995500,75412,778,1100],[32,1070912,78848,778,1100],[32,1149760,109836,778,1100],[32,1259596,81558,778,1100],[32,1341154,98680,778,1100],[32,1439834,72440,778,1100],[32,1512274,80906,778,1100],[32,1593180,54410,778,1100],[32,1647590,86948,778,1100],[32,1734538,64322,778,1100],[32,1798860,57806,778,1100],[32,1856666,82392,778,1100],[32,1939058,67696,778,1100],[32,2006754,102950,778,1100],[32,2109704,35470,778,1100],[32,2145174,7504,778,1100],[32,2152678,92242,778,1100],[33,8,89254,778,1100],[33,89262,46608,778,1100],[33,135870,82898,778,1100],[33,218768,80072,778,1100],[33,298840,86524,778,1100],[33,385364,72796,778,1100],[33,458160,69780,778,1100],[33,527940,61172,778,1100],[33,589112,75946,778,1100],[33,665058,1600,778,1100],[33,666658,73896,778,1100],[33,740554,69396,778,1100],[33,809950,66136,778,1100],[33,876086,68088,778,1100],[33,944174,44122,778,1100],[33,988296,1600,778,1100],[33,989896,52332,778,1100],[33,1042228,65450,778,1100],[33,1107678,37730,778,1100],[33,1145408,44424,778,1100],[33,1189832,57228,778,1100],[33,1247060,58150,778,1100],[33,1305210,68778,778,1100],[33,1373988,88040,778,1100],[33,1462028,70688,778,1100],[33,1532716,43050,778,1100],[33,1575766,60596,778,1100],[33,1636362,42958,778,1100],[33,1679320,44186,778,1100],[33,1723506,47582,778,1100],[33,1771088,51136,778,1100],[33,1822224,1600,778,1100],[34,8,55008,778,1100],[34,55016,57002,778,1100],[34,112018,61320,778,1100],[34,173338,62440,778,1100],[34,235778,52410,778,1100],[34,288188,44374,778,1100],[34,332562,56246,778,1100],[34,388808,73742,778,1100],[34,462550,58356,778,1100],[34,520906,70116,778,1100],[34,591022,74612,778,1100],[34,665634,51260,778,1100],[34,716894,64992,778,1100],[34,781886,59668,778,1100],[34,841554,77218,778,1100],[34,918772,1600,778,1100],[34,920372,66760,778,1100],[34,987132,68162,778,1100],[34,1055294,76098,778,1100],[34,1131392,31652,778,1100],[34,1163044,71260,778,1100],[34,1234304,64214,778,1100],[34,1298518,59350,778,1100],[34,1357868,1600,778,1100],[34,1359468,67364,778,1100],[34,1426832,55290,778,1100],[34,1482122,62828,778,1100],[34,1544950,46350,778,1100],[34,1591300,83938,778,1100],[34,1675238,75776,778,1100],[34,1751014,87176,778,1100],[34,1838190,92060,778,1100],[35,8,86956,778,1100],[35,86964,80636,778,1100],[35,167600,86560,778,1100],[35,254160,76998,778,1100],[35,331158,118962,778,1100],[35,450120,9244,778,1100],[35,459364,81332,778,1100],[35,540696,83092,778,1100],[35,623788,60964,778,1100],[35,684752,94582,778,1100],[35,779334,99224,778,1100],[35,878558,94364,778,1100],[35,972922,107806,778,1100],[35,1080728,61274,778,1100],[35,1142002,71446,778,1100],[35,1213448,77070,778,1100],[35,1290518,58694,778,1100],[35,1349212,51488,778,1100],[35,1400700,78596,778,1100],[35,1479296,94802,778,1100],[35,1574098,85812,778,1100],[35,1659910,79076,778,1100],[35,1738986,75136,778,1100],[35,1814122,60740,778,1100],[35,1874862,62706,778,1100],[35,1937568,50986,778,1100],[35,1988554,63182,778,1100],[35,2051736,76852,778,1100],[35,2128588,60578,778,1100],[35,2189166,74470,778,1100],[35,2263636,82164,778,1100],[35,2345800,86026,778,1100],[36,8,7056,778,1100],[36,7064,80930,778,1100],[36,87994,91992,778,1100],[36,179986,1600,778,1100],[36,181586,52144,778,1100],[36,233730,40788,778,1100],[36,274518,48912,778,1100],[36,323430,42780,778,1100],[36,366210,76282,778,1100],[36,442492,66886,778,1100],[36,509378,57760,778,1100],[36,567138,57260,778,1100],[36,624398,80186,778,1100],[36,704584,26366,778,1100],[36,730950,72526,778,1100],[36,803476,53894,778,1100],[36,857370,51030,778,1100],[36,908400,65838,778,1100],[36,974238,17998,778,1100],[36,992236,1600,778,1100],[36,993836,45342,778,1100],[36,1039178,57144,778,1100],[36,1096322,53958,778,1100],[36,1150280,60452,778,1100],[36,1210732,46062,778,1100],[36,1256794,79234,778,1100],[36,1336028,74924,778,1100],[36,1410952,1600,778,1100],[36,1412552,52458,778,1100],[36,1465010,68554,778,1100],[36,1533564,61442,778,1100],[36,1595006,53832,778,1100],[37,8,58362,778,1100],[37,58370,70298,778,1100],[37,128668,16814,778,1100],[37,145482,1600,778,1100],[37,147082,77042,778,1100],[37,224124,49044,778,1100],[37,273168,65394,778,1100],[37,338562,76512,778,1100],[37,415074,75202,778,1100],[37,490276,75798,778,1100],[37,566074,67068,778,1100],[37,633142,60282,778,1100],[37,693424,83118,778,1100],[37,776542,62076,778,1100],[37,838618,78242,778,1100],[37,916860,85618,778,1100],[37,1002478,69494,778,1100],[37,1071972,71734,778,1100],[37,1143706,81240,778,1100],[37,1224946,95370,778,1100],[37,1320316,83158,778,1100],[37,1403474,98676,778,1100],[37,1502150,47728,778,1100],[37,1549878,78546,778,1100],[37,1628424,78482,778,1100],[37,1706906,62438,778,1100],[37,1769344,86184,778,1100],[37,1855528,34018,778,1100],[37,1889546,81558,778,1100],[37,1971104,56040,778,1100],[37,2027144,72818,778,1100],[37,2099962,74380,778,1100],[38,8,67492,778,1100],[38,67500,74804,778,1100],[38,142304,103720,778,1100],[38,246024,85934,778,1100],[38,331958,75390,778,1100],[38,407348,73998,778,1100],[38,481346,84416,778,1100],[38,565762,94478,778,1100],[38,660240,58960,778,1100],[38,719200,106476,778,1100],[38,825676,83530,778,1100],[38,909206,113594,778,1100],[38,1022800,43610,778,1100],[38,1066410,1600,778,1100],[38,1068010,82140,778,1100],[38,1150150,68900,778,1100],[38,1219050,55422,778,1100],[38,1274472,65574,778,1100],[38,1340046,73694,778,1100],[38,1413740,67500,778,1100],[38,1481240,72124,778,1100],[38,1553364,79026,778,1100],[38,1632390,67060,778,1100],[38,1699450,62878,778,1100],[38,1762328,72060,778,1100],[38,1834388,87806,778,1100],[38,1922194,81988,778,1100],[38,2004182,108286,778,1100],[38,2112468,115858,778,1100],[38,2228326,118460,778,1100],[38,2346786,36200,778,1100],[38,2382986,1600,778,1100]]"),y2=JSON.parse('{"version":1,"source":"976d622f90f2","count":1248,"height":780,"packs":["chunk-00-976d622f90f2.bin","chunk-01-976d622f90f2.bin","chunk-02-976d622f90f2.bin","chunk-03-976d622f90f2.bin","chunk-04-976d622f90f2.bin","chunk-05-976d622f90f2.bin","chunk-06-976d622f90f2.bin","chunk-07-976d622f90f2.bin","chunk-08-976d622f90f2.bin","chunk-09-976d622f90f2.bin","chunk-10-976d622f90f2.bin","chunk-11-976d622f90f2.bin","chunk-12-976d622f90f2.bin","chunk-13-976d622f90f2.bin","chunk-14-976d622f90f2.bin","chunk-15-976d622f90f2.bin","chunk-16-976d622f90f2.bin","chunk-17-976d622f90f2.bin","chunk-18-976d622f90f2.bin","chunk-19-976d622f90f2.bin","chunk-20-976d622f90f2.bin","chunk-21-976d622f90f2.bin","chunk-22-976d622f90f2.bin","chunk-23-976d622f90f2.bin","chunk-24-976d622f90f2.bin","chunk-25-976d622f90f2.bin","chunk-26-976d622f90f2.bin","chunk-27-976d622f90f2.bin","chunk-28-976d622f90f2.bin","chunk-29-976d622f90f2.bin","chunk-30-976d622f90f2.bin","chunk-31-976d622f90f2.bin","chunk-32-976d622f90f2.bin","chunk-33-976d622f90f2.bin","chunk-34-976d622f90f2.bin","chunk-35-976d622f90f2.bin","chunk-36-976d622f90f2.bin","chunk-37-976d622f90f2.bin","chunk-38-976d622f90f2.bin"],"pages":[null,[0,8,24284,552,780],[0,24292,842,552,780],[0,25134,1624,552,780],[0,26758,842,552,780],[0,27600,40704,552,780],[0,68304,842,552,780],[0,69146,34306,552,780],[0,103452,42718,552,780],[0,146170,42396,552,780],[0,188566,46084,552,780],[0,234650,43100,552,780],[0,277750,44070,552,780],[0,321820,41358,552,780],[0,363178,43922,552,780],[0,407100,46838,552,780],[0,453938,46870,552,780],[0,500808,46032,552,780],[0,546840,42876,552,780],[0,589716,45488,552,780],[0,635204,47866,552,780],[0,683070,43702,552,780],[0,726772,45462,552,780],[0,772234,47300,552,780],[0,819534,43422,552,780],[0,862956,45528,552,780],[0,908484,41924,552,780],[0,950408,46234,552,780],[0,996642,44398,552,780],[0,1041040,43404,552,780],[0,1084444,48332,552,780],[0,1132776,42778,552,780],[0,1175554,47244,552,780],[1,8,44870,552,780],[1,44878,43956,552,780],[1,88834,47746,552,780],[1,136580,48080,552,780],[1,184660,43536,552,780],[1,228196,50438,552,780],[1,278634,2218,552,780],[1,280852,842,552,780],[1,281694,3210,552,780],[1,284904,37492,552,780],[1,322396,39004,552,780],[1,361400,18308,552,780],[1,379708,34870,552,780],[1,414578,26128,552,780],[1,440706,29678,552,780],[1,470384,37190,552,780],[1,507574,26816,552,780],[1,534390,26494,552,780],[1,560884,29818,552,780],[1,590702,22096,552,780],[1,612798,11656,552,780],[1,624454,842,552,780],[1,625296,32510,552,780],[1,657806,31270,552,780],[1,689076,29358,552,780],[1,718434,12346,552,780],[1,730780,26550,552,780],[1,757330,842,552,780],[1,758172,36626,552,780],[1,794798,31022,552,780],[1,825820,39390,552,780],[1,865210,29188,552,780],[2,8,40128,552,780],[2,40136,38842,552,780],[2,78978,42604,552,780],[2,121582,43542,552,780],[2,165124,40784,552,780],[2,205908,46492,552,780],[2,252400,14218,552,780],[2,266618,842,552,780],[2,267460,38574,552,780],[2,306034,35070,552,780],[2,341104,42154,552,780],[2,383258,16136,552,780],[2,399394,39342,552,780],[2,438736,38372,552,780],[2,477108,38618,552,780],[2,515726,35762,552,780],[2,551488,35948,552,780],[2,587436,44470,552,780],[2,631906,59320,552,780],[2,691226,27434,552,780],[2,718660,41982,552,780],[2,760642,44080,552,780],[2,804722,51654,552,780],[2,856376,4644,552,780],[2,861020,38732,552,780],[2,899752,38810,552,780],[2,938562,30422,552,780],[2,968984,11176,552,780],[2,980160,42682,552,780],[2,1022842,46638,552,780],[2,1069480,39442,552,780],[2,1108922,842,552,780],[3,8,36156,552,780],[3,36164,43162,552,780],[3,79326,11866,552,780],[3,91192,842,552,780],[3,92034,29590,552,780],[3,121624,25126,552,780],[3,146750,38924,552,780],[3,185674,23822,552,780],[3,209496,13138,552,780],[3,222634,842,552,780],[3,223476,33658,552,780],[3,257134,40700,552,780],[3,297834,31784,552,780],[3,329618,34270,552,780],[3,363888,37852,552,780],[3,401740,36248,552,780],[3,437988,31926,552,780],[3,469914,17418,552,780],[3,487332,37898,552,780],[3,525230,38272,552,780],[3,563502,32108,552,780],[3,595610,31694,552,780],[3,627304,45052,552,780],[3,672356,42250,552,780],[3,714606,25586,552,780],[3,740192,842,552,780],[3,741034,26648,552,780],[3,767682,27786,552,780],[3,795468,24648,552,780],[3,820116,27912,552,780],[3,848028,36568,552,780],[3,884596,14720,552,780],[4,8,2340,552,780],[4,2348,39600,552,780],[4,41948,38212,552,780],[4,80160,842,552,780],[4,81002,28802,552,780],[4,109804,19550,552,780],[4,129354,21500,552,780],[4,150854,24830,552,780],[4,175684,25826,552,780],[4,201510,22558,552,780],[4,224068,24922,552,780],[4,248990,13284,552,780],[4,262274,23620,552,780],[4,285894,29468,552,780],[4,315362,28004,552,780],[4,343366,18528,552,780],[4,361894,41666,552,780],[4,403560,33480,552,780],[4,437040,16076,552,780],[4,453116,842,552,780],[4,453958,33790,552,780],[4,487748,32126,552,780],[4,519874,24562,552,780],[4,544436,842,552,780],[4,545278,33370,552,780],[4,578648,30988,552,780],[4,609636,35484,552,780],[4,645120,23666,552,780],[4,668786,40966,552,780],[4,709752,842,552,780],[4,710594,29812,552,780],[4,740406,30910,552,780],[5,8,25454,552,780],[5,25462,30482,552,780],[5,55944,39922,552,780],[5,95866,27826,552,780],[5,123692,30808,552,780],[5,154500,27554,552,780],[5,182054,21328,552,780],[5,203382,27472,552,780],[5,230854,31028,552,780],[5,261882,20358,552,780],[5,282240,27024,552,780],[5,309264,28604,552,780],[5,337868,29138,552,780],[5,367006,20702,552,780],[5,387708,28126,552,780],[5,415834,20594,552,780],[5,436428,26938,552,780],[5,463366,25298,552,780],[5,488664,18108,552,780],[5,506772,25796,552,780],[5,532568,34358,552,780],[5,566926,842,552,780],[5,567768,38298,552,780],[5,606066,32178,552,780],[5,638244,26604,552,780],[5,664848,19042,552,780],[5,683890,34556,552,780],[5,718446,29946,552,780],[5,748392,34176,552,780],[5,782568,7466,552,780],[5,790034,20772,552,780],[5,810806,26788,552,780],[6,8,29864,552,780],[6,29872,25188,552,780],[6,55060,29492,552,780],[6,84552,24344,552,780],[6,108896,24952,552,780],[6,133848,25914,552,780],[6,159762,35986,552,780],[6,195748,842,552,780],[6,196590,4220,552,780],[6,200810,39246,552,780],[6,240056,41574,552,780],[6,281630,26064,552,780],[6,307694,38640,552,780],[6,346334,27854,552,780],[6,374188,25776,552,780],[6,399964,31874,552,780],[6,431838,39256,552,780],[6,471094,25036,552,780],[6,496130,29542,552,780],[6,525672,13216,552,780],[6,538888,22120,552,780],[6,561008,23166,552,780],[6,584174,24078,552,780],[6,608252,28244,552,780],[6,636496,21418,552,780],[6,657914,30348,552,780],[6,688262,19650,552,780],[6,707912,842,552,780],[6,708754,34830,552,780],[6,743584,38796,552,780],[6,782380,36818,552,780],[6,819198,842,552,780],[7,8,29798,552,780],[7,29806,35024,552,780],[7,64830,37362,552,780],[7,102192,13444,552,780],[7,115636,36544,552,780],[7,152180,25254,552,780],[7,177434,28570,552,780],[7,206004,37976,552,780],[7,243980,29964,552,780],[7,273944,26686,552,780],[7,300630,26012,552,780],[7,326642,27854,552,780],[7,354496,41812,552,780],[7,396308,36914,552,780],[7,433222,8240,552,780],[7,441462,842,552,780],[7,442304,30098,552,780],[7,472402,26524,552,780],[7,498926,29322,552,780],[7,528248,38702,552,780],[7,566950,42502,552,780],[7,609452,11234,552,780],[7,620686,25482,552,780],[7,646168,31318,552,780],[7,677486,37768,552,780],[7,715254,4456,552,780],[7,719710,28520,552,780],[7,748230,23202,552,780],[7,771432,38684,552,780],[7,810116,5820,552,780],[7,815936,22920,552,780],[7,838856,44350,552,780],[8,8,31180,552,780],[8,31188,37986,552,780],[8,69174,29884,552,780],[8,99058,34934,552,780],[8,133992,42828,552,780],[8,176820,17840,552,780],[8,194660,27656,552,780],[8,222316,32352,552,780],[8,254668,24032,552,780],[8,278700,44148,552,780],[8,322848,37682,552,780],[8,360530,21946,552,780],[8,382476,41322,552,780],[8,423798,31170,552,780],[8,454968,46584,552,780],[8,501552,35230,552,780],[8,536782,29126,552,780],[8,565908,29300,552,780],[8,595208,28948,552,780],[8,624156,42778,552,780],[8,666934,36726,552,780],[8,703660,39512,552,780],[8,743172,38130,552,780],[8,781302,34576,552,780],[8,815878,34110,552,780],[8,849988,38524,552,780],[8,888512,38920,552,780],[8,927432,34020,552,780],[8,961452,50228,552,780],[8,1011680,20258,552,780],[8,1031938,38646,552,780],[8,1070584,42940,552,780],[9,8,33438,552,780],[9,33446,35588,552,780],[9,69034,33080,552,780],[9,102114,40742,552,780],[9,142856,28328,552,780],[9,171184,31664,552,780],[9,202848,39530,552,780],[9,242378,12056,552,780],[9,254434,39638,552,780],[9,294072,37548,552,780],[9,331620,25558,552,780],[9,357178,43374,552,780],[9,400552,30254,552,780],[9,430806,35610,552,780],[9,466416,45036,552,780],[9,511452,842,552,780],[9,512294,3332,552,780],[9,515626,41150,552,780],[9,556776,44096,552,780],[9,600872,12070,552,780],[9,612942,35158,552,780],[9,648100,27040,552,780],[9,675140,26786,552,780],[9,701926,21422,552,780],[9,723348,25300,552,780],[9,748648,24722,552,780],[9,773370,19398,552,780],[9,792768,842,552,780],[9,793610,31936,552,780],[9,825546,34462,552,780],[9,860008,28990,552,780],[9,888998,15820,552,780],[10,8,26772,552,780],[10,26780,31718,552,780],[10,58498,39642,552,780],[10,98140,45892,552,780],[10,144032,35152,552,780],[10,179184,39086,552,780],[10,218270,41666,552,780],[10,259936,842,552,780],[10,260778,29324,552,780],[10,290102,30024,552,780],[10,320126,26524,552,780],[10,346650,842,552,780],[10,347492,28432,552,780],[10,375924,30250,552,780],[10,406174,32964,552,780],[10,439138,14136,552,780],[10,453274,23652,552,780],[10,476926,24382,552,780],[10,501308,19804,552,780],[10,521112,19700,552,780],[10,540812,27018,552,780],[10,567830,22058,552,780],[10,589888,22694,552,780],[10,612582,14136,552,780],[10,626718,34228,552,780],[10,660946,29920,552,780],[10,690866,30932,552,780],[10,721798,842,552,780],[10,722640,34324,552,780],[10,756964,34148,552,780],[10,791112,40508,552,780],[10,831620,39744,552,780],[11,8,27610,552,780],[11,27618,842,552,780],[11,28460,34300,552,780],[11,62760,34272,552,780],[11,97032,38062,552,780],[11,135094,842,552,780],[11,135936,26946,552,780],[11,162882,26042,552,780],[11,188924,31456,552,780],[11,220380,36274,552,780],[11,256654,34062,552,780],[11,290716,30358,552,780],[11,321074,25808,552,780],[11,346882,43448,552,780],[11,390330,31266,552,780],[11,421596,35212,552,780],[11,456808,31268,552,780],[11,488076,32556,552,780],[11,520632,39156,552,780],[11,559788,26584,552,780],[11,586372,28664,552,780],[11,615036,38766,552,780],[11,653802,18116,552,780],[11,671918,842,552,780],[11,672760,33096,552,780],[11,705856,31072,552,780],[11,736928,28836,552,780],[11,765764,28322,552,780],[11,794086,28694,552,780],[11,822780,30140,552,780],[11,852920,3572,552,780],[11,856492,42078,552,780],[12,8,43750,552,780],[12,43758,11130,552,780],[12,54888,35920,552,780],[12,90808,34856,552,780],[12,125664,33984,552,780],[12,159648,42816,552,780],[12,202464,33346,552,780],[12,235810,37602,552,780],[12,273412,39092,552,780],[12,312504,37988,552,780],[12,350492,40344,552,780],[12,390836,28160,552,780],[12,418996,35534,552,780],[12,454530,45536,552,780],[12,500066,49042,552,780],[12,549108,842,552,780],[12,549950,32250,552,780],[12,582200,35434,552,780],[12,617634,27664,552,780],[12,645298,842,552,780],[12,646140,22604,552,780],[12,668744,21748,552,780],[12,690492,23896,552,780],[12,714388,25862,552,780],[12,740250,21640,552,780],[12,761890,17840,552,780],[12,779730,18450,552,780],[12,798180,7050,552,780],[12,805230,39376,552,780],[12,844606,33136,552,780],[12,877742,21574,552,780],[12,899316,842,552,780],[13,8,38880,552,780],[13,38888,21626,552,780],[13,60514,22982,552,780],[13,83496,24680,552,780],[13,108176,30204,552,780],[13,138380,24046,552,780],[13,162426,19966,552,780],[13,182392,29980,552,780],[13,212372,34210,552,780],[13,246582,842,552,780],[13,247424,28602,552,780],[13,276026,26268,552,780],[13,302294,31750,552,780],[13,334044,28744,552,780],[13,362788,27228,552,780],[13,390016,17102,552,780],[13,407118,20736,552,780],[13,427854,842,552,780],[13,428696,35536,552,780],[13,464232,24026,552,780],[13,488258,29402,552,780],[13,517660,27832,552,780],[13,545492,27380,552,780],[13,572872,26382,552,780],[13,599254,37094,552,780],[13,636348,26444,552,780],[13,662792,19556,552,780],[13,682348,17952,552,780],[13,700300,25072,552,780],[13,725372,32104,552,780],[13,757476,28162,552,780],[13,785638,33594,552,780],[14,8,24310,552,780],[14,24318,28012,552,780],[14,52330,33574,552,780],[14,85904,842,552,780],[14,86746,31564,552,780],[14,118310,30228,552,780],[14,148538,27102,552,780],[14,175640,22204,552,780],[14,197844,29514,552,780],[14,227358,26960,552,780],[14,254318,33328,552,780],[14,287646,20818,552,780],[14,308464,24036,552,780],[14,332500,22686,552,780],[14,355186,23126,552,780],[14,378312,842,552,780],[14,379154,27654,552,780],[14,406808,21086,552,780],[14,427894,26388,552,780],[14,454282,28462,552,780],[14,482744,27910,552,780],[14,510654,21326,552,780],[14,531980,23200,552,780],[14,555180,32478,552,780],[14,587658,11006,552,780],[14,598664,842,552,780],[14,599506,3880,552,780],[14,603386,41624,552,780],[14,645010,45454,552,780],[14,690464,18302,552,780],[14,708766,45722,552,780],[14,754488,30730,552,780],[15,8,17002,552,780],[15,17010,842,552,780],[15,17852,27750,552,780],[15,45602,21352,552,780],[15,66954,20382,552,780],[15,87336,24930,552,780],[15,112266,21246,552,780],[15,133512,26194,552,780],[15,159706,24288,552,780],[15,183994,23414,552,780],[15,207408,27168,552,780],[15,234576,22560,552,780],[15,257136,35240,552,780],[15,292376,28208,552,780],[15,320584,25250,552,780],[15,345834,23704,552,780],[15,369538,28240,552,780],[15,397778,18510,552,780],[15,416288,30450,552,780],[15,446738,27388,552,780],[15,474126,29264,552,780],[15,503390,24642,552,780],[15,528032,27278,552,780],[15,555310,34812,552,780],[15,590122,10608,552,780],[15,600730,842,552,780],[15,601572,25892,552,780],[15,627464,20250,552,780],[15,647714,25218,552,780],[15,672932,18760,552,780],[15,691692,31364,552,780],[15,723056,35450,552,780],[16,8,31084,552,780],[16,31092,842,552,780],[16,31934,25904,552,780],[16,57838,30484,552,780],[16,88322,24366,552,780],[16,112688,27978,552,780],[16,140666,31638,552,780],[16,172304,31256,552,780],[16,203560,28790,552,780],[16,232350,28998,552,780],[16,261348,25518,552,780],[16,286866,21820,552,780],[16,308686,19626,552,780],[16,328312,31662,552,780],[16,359974,20812,552,780],[16,380786,29424,552,780],[16,410210,36126,552,780],[16,446336,31356,552,780],[16,477692,20866,552,780],[16,498558,26128,552,780],[16,524686,25322,552,780],[16,550008,28352,552,780],[16,578360,26526,552,780],[16,604886,33322,552,780],[16,638208,40264,552,780],[16,678472,13810,552,780],[16,692282,32100,552,780],[16,724382,22612,552,780],[16,746994,16940,552,780],[16,763934,30310,552,780],[16,794244,18160,552,780],[16,812404,24590,552,780],[17,8,27024,552,780],[17,27032,20954,552,780],[17,47986,30972,552,780],[17,78958,9530,552,780],[17,88488,28528,552,780],[17,117016,24168,552,780],[17,141184,28888,552,780],[17,170072,20380,552,780],[17,190452,20472,552,780],[17,210924,30764,552,780],[17,241688,21194,552,780],[17,262882,26708,552,780],[17,289590,15476,552,780],[17,305066,842,552,780],[17,305908,31204,552,780],[17,337112,29804,552,780],[17,366916,27062,552,780],[17,393978,22100,552,780],[17,416078,27280,552,780],[17,443358,37944,552,780],[17,481302,8758,552,780],[17,490060,842,552,780],[17,490902,3548,552,780],[17,494450,40686,552,780],[17,535136,46360,552,780],[17,581496,36494,552,780],[17,617990,35736,552,780],[17,653726,29582,552,780],[17,683308,21064,552,780],[17,704372,842,552,780],[17,705214,35176,552,780],[17,740390,27674,552,780],[18,8,35306,552,780],[18,35314,17842,552,780],[18,53156,18372,552,780],[18,71528,21258,552,780],[18,92786,18272,552,780],[18,111058,22042,552,780],[18,133100,20116,552,780],[18,153216,24954,552,780],[18,178170,30566,552,780],[18,208736,18722,552,780],[18,227458,26608,552,780],[18,254066,21114,552,780],[18,275180,27706,552,780],[18,302886,26126,552,780],[18,329012,38508,552,780],[18,367520,23666,552,780],[18,391186,22710,552,780],[18,413896,37236,552,780],[18,451132,6146,552,780],[18,457278,842,552,780],[18,458120,36890,552,780],[18,495010,27314,552,780],[18,522324,31486,552,780],[18,553810,15856,552,780],[18,569666,29766,552,780],[18,599432,34990,552,780],[18,634422,29508,552,780],[18,663930,17612,552,780],[18,681542,21762,552,780],[18,703304,25760,552,780],[18,729064,25194,552,780],[18,754258,26860,552,780],[19,8,25008,552,780],[19,25016,23560,552,780],[19,48576,34548,552,780],[19,83124,13210,552,780],[19,96334,24798,552,780],[19,121132,17310,552,780],[19,138442,24994,552,780],[19,163436,24330,552,780],[19,187766,18858,552,780],[19,206624,24582,552,780],[19,231206,25718,552,780],[19,256924,22630,552,780],[19,279554,13046,552,780],[19,292600,842,552,780],[19,293442,27678,552,780],[19,321120,24296,552,780],[19,345416,21522,552,780],[19,366938,26424,552,780],[19,393362,32718,552,780],[19,426080,27200,552,780],[19,453280,29230,552,780],[19,482510,30954,552,780],[19,513464,24584,552,780],[19,538048,24348,552,780],[19,562396,23440,552,780],[19,585836,27586,552,780],[19,613422,35332,552,780],[19,648754,34596,552,780],[19,683350,31418,552,780],[19,714768,13422,552,780],[19,728190,26606,552,780],[19,754796,32030,552,780],[20,8,23284,552,780],[20,23292,24492,552,780],[20,47784,19292,552,780],[20,67076,29754,552,780],[20,96830,29760,552,780],[20,126590,32984,552,780],[20,159574,24380,552,780],[20,183954,34518,552,780],[20,218472,22564,552,780],[20,241036,15992,552,780],[20,257028,25254,552,780],[20,282282,27726,552,780],[20,310008,25650,552,780],[20,335658,21046,552,780],[20,356704,11170,552,780],[20,367874,842,552,780],[20,368716,32824,552,780],[20,401540,27738,552,780],[20,429278,31406,552,780],[20,460684,23380,552,780],[20,484064,20208,552,780],[20,504272,21140,552,780],[20,525412,18266,552,780],[20,543678,842,552,780],[20,544520,38656,552,780],[20,583176,29394,552,780],[20,612570,33402,552,780],[20,645972,16524,552,780],[20,662496,26246,552,780],[20,688742,30828,552,780],[20,719570,29488,552,780],[20,749058,35724,552,780],[21,8,33354,552,780],[21,33362,842,552,780],[21,34204,38646,552,780],[21,72850,29890,552,780],[21,102740,43240,552,780],[21,145980,33256,552,780],[21,179236,36762,552,780],[21,215998,41304,552,780],[21,257302,34452,552,780],[21,291754,32102,552,780],[21,323856,30698,552,780],[21,354554,842,552,780],[21,355396,3838,552,780],[21,359234,41560,552,780],[21,400794,40778,552,780],[21,441572,41084,552,780],[21,482656,18902,552,780],[21,501558,842,552,780],[21,502400,32180,552,780],[21,534580,34614,552,780],[21,569194,17150,552,780],[21,586344,842,552,780],[21,587186,24476,552,780],[21,611662,31970,552,780],[21,643632,20144,552,780],[21,663776,41304,552,780],[21,705080,30890,552,780],[21,735970,29388,552,780],[21,765358,25488,552,780],[21,790846,24008,552,780],[21,814854,23596,552,780],[21,838450,28290,552,780],[22,8,24646,552,780],[22,24654,24050,552,780],[22,48704,26948,552,780],[22,75652,16734,552,780],[22,92386,28134,552,780],[22,120520,28508,552,780],[22,149028,27268,552,780],[22,176296,29936,552,780],[22,206232,37720,552,780],[22,243952,27790,552,780],[22,271742,40864,552,780],[22,312606,43516,552,780],[22,356122,18770,552,780],[22,374892,842,552,780],[22,375734,33702,552,780],[22,409436,30220,552,780],[22,439656,23756,552,780],[22,463412,25704,552,780],[22,489116,28102,552,780],[22,517218,34112,552,780],[22,551330,21724,552,780],[22,573054,842,552,780],[22,573896,24656,552,780],[22,598552,30020,552,780],[22,628572,29996,552,780],[22,658568,31140,552,780],[22,689708,30820,552,780],[22,720528,31258,552,780],[22,751786,30030,552,780],[22,781816,842,552,780],[22,782658,37044,552,780],[22,819702,33318,552,780],[23,8,37094,552,780],[23,37102,18662,552,780],[23,55764,26410,552,780],[23,82174,25472,552,780],[23,107646,35356,552,780],[23,143002,26320,552,780],[23,169322,25190,552,780],[23,194512,27448,552,780],[23,221960,29262,552,780],[23,251222,15636,552,780],[23,266858,19456,552,780],[23,286314,842,552,780],[23,287156,24192,552,780],[23,311348,18502,552,780],[23,329850,21332,552,780],[23,351182,20868,552,780],[23,372050,23426,552,780],[23,395476,28684,552,780],[23,424160,22916,552,780],[23,447076,12710,552,780],[23,459786,27978,552,780],[23,487764,22920,552,780],[23,510684,24516,552,780],[23,535200,15268,552,780],[23,550468,23378,552,780],[23,573846,22284,552,780],[23,596130,28606,552,780],[23,624736,28458,552,780],[23,653194,32474,552,780],[23,685668,37380,552,780],[23,723048,36570,552,780],[23,759618,12738,552,780],[24,8,32232,552,780],[24,32240,24816,552,780],[24,57056,29664,552,780],[24,86720,19792,552,780],[24,106512,22496,552,780],[24,129008,20260,552,780],[24,149268,24082,552,780],[24,173350,32892,552,780],[24,206242,33350,552,780],[24,239592,842,552,780],[24,240434,32886,552,780],[24,273320,32260,552,780],[24,305580,29504,552,780],[24,335084,15170,552,780],[24,350254,27698,552,780],[24,377952,32580,552,780],[24,410532,33560,552,780],[24,444092,19768,552,780],[24,463860,33588,552,780],[24,497448,28742,552,780],[24,526190,38320,552,780],[24,564510,6542,552,780],[24,571052,27354,552,780],[24,598406,21594,552,780],[24,620000,31474,552,780],[24,651474,32336,552,780],[24,683810,33430,552,780],[24,717240,28132,552,780],[24,745372,37216,552,780],[24,782588,10848,552,780],[24,793436,4128,552,780],[24,797564,38724,552,780],[25,8,14444,552,780],[25,14452,842,552,780],[25,15294,26562,552,780],[25,41856,21868,552,780],[25,63724,16692,552,780],[25,80416,23420,552,780],[25,103836,18112,552,780],[25,121948,21102,552,780],[25,143050,28488,552,780],[25,171538,24966,552,780],[25,196504,20034,552,780],[25,216538,19608,552,780],[25,236146,36802,552,780],[25,272948,842,552,780],[25,273790,36144,552,780],[25,309934,24930,552,780],[25,334864,40996,552,780],[25,375860,9242,552,780],[25,385102,31442,552,780],[25,416544,29812,552,780],[25,446356,32602,552,780],[25,478958,20462,552,780],[25,499420,23906,552,780],[25,523326,29174,552,780],[25,552500,28160,552,780],[25,580660,28036,552,780],[25,608696,44104,552,780],[25,652800,31448,552,780],[25,684248,28148,552,780],[25,712396,24442,552,780],[25,736838,29372,552,780],[25,766210,35952,552,780],[26,8,13490,552,780],[26,13498,842,552,780],[26,14340,27322,552,780],[26,41662,36998,552,780],[26,78660,26482,552,780],[26,105142,27882,552,780],[26,133024,33598,552,780],[26,166622,28540,552,780],[26,195162,41850,552,780],[26,237012,29668,552,780],[26,266680,34140,552,780],[26,300820,33638,552,780],[26,334458,33650,552,780],[26,368108,23338,552,780],[26,391446,3942,552,780],[26,395388,40506,552,780],[26,435894,42988,552,780],[26,478882,8848,552,780],[26,487730,33836,552,780],[26,521566,45106,552,780],[26,566672,31826,552,780],[26,598498,32778,552,780],[26,631276,35904,552,780],[26,667180,30130,552,780],[26,697310,40996,552,780],[26,738306,34444,552,780],[26,772750,6544,552,780],[26,779294,842,552,780],[26,780136,28048,552,780],[26,808184,30350,552,780],[26,838534,30870,552,780],[26,869404,20428,552,780],[27,8,31300,552,780],[27,31308,33308,552,780],[27,64616,35180,552,780],[27,99796,8342,552,780],[27,108138,31388,552,780],[27,139526,36572,552,780],[27,176098,41304,552,780],[27,217402,842,552,780],[27,218244,24666,552,780],[27,242910,29862,552,780],[27,272772,28418,552,780],[27,301190,28276,552,780],[27,329466,21186,552,780],[27,350652,23312,552,780],[27,373964,21788,552,780],[27,395752,28528,552,780],[27,424280,30662,552,780],[27,454942,22186,552,780],[27,477128,23274,552,780],[27,500402,24650,552,780],[27,525052,23084,552,780],[27,548136,20434,552,780],[27,568570,27978,552,780],[27,596548,18870,552,780],[27,615418,21052,552,780],[27,636470,842,552,780],[27,637312,32924,552,780],[27,670236,29314,552,780],[27,699550,42826,552,780],[27,742376,40300,552,780],[27,782676,21538,552,780],[27,804214,23540,552,780],[28,8,27678,552,780],[28,27686,45790,552,780],[28,73476,42994,552,780],[28,116470,842,552,780],[28,117312,32752,552,780],[28,150064,34798,552,780],[28,184862,29112,552,780],[28,213974,32544,552,780],[28,246518,35872,552,780],[28,282390,842,552,780],[28,283232,31768,552,780],[28,315000,28776,552,780],[28,343776,34170,552,780],[28,377946,31656,552,780],[28,409602,30102,552,780],[28,439704,29998,552,780],[28,469702,25748,552,780],[28,495450,842,552,780],[28,496292,28980,552,780],[28,525272,30008,552,780],[28,555280,35360,552,780],[28,590640,842,552,780],[28,591482,33358,552,780],[28,624840,41606,552,780],[28,666446,27376,552,780],[28,693822,842,552,780],[28,694664,33156,552,780],[28,727820,20860,552,780],[28,748680,24562,552,780],[28,773242,33270,552,780],[28,806512,37010,552,780],[28,843522,37874,552,780],[29,8,42290,552,780],[29,42298,39410,552,780],[29,81708,3930,552,780],[29,85638,42576,552,780],[29,128214,42468,552,780],[29,170682,30518,552,780],[29,201200,29186,552,780],[29,230386,23994,552,780],[29,254380,29946,552,780],[29,284326,32144,552,780],[29,316470,38206,552,780],[29,354676,27516,552,780],[29,382192,33300,552,780],[29,415492,34234,552,780],[29,449726,18866,552,780],[29,468592,842,552,780],[29,469434,42558,552,780],[29,511992,47900,552,780],[29,559892,29174,552,780],[29,589066,842,552,780],[29,589908,32570,552,780],[29,622478,26478,552,780],[29,648956,31514,552,780],[29,680470,34098,552,780],[29,714568,33480,552,780],[29,748048,36074,552,780],[29,784122,13926,552,780],[29,798048,842,552,780],[29,798890,26474,552,780],[29,825364,26530,552,780],[29,851894,29534,552,780],[29,881428,32034,552,780],[30,8,35856,552,780],[30,35864,842,552,780],[30,36706,23524,552,780],[30,60230,33156,552,780],[30,93386,22168,552,780],[30,115554,26178,552,780],[30,141732,26418,552,780],[30,168150,38706,552,780],[30,206856,43214,552,780],[30,250070,35580,552,780],[30,285650,14950,552,780],[30,300600,842,552,780],[30,301442,37536,552,780],[30,338978,36864,552,780],[30,375842,26614,552,780],[30,402456,27350,552,780],[30,429806,25632,552,780],[30,455438,30296,552,780],[30,485734,30880,552,780],[30,516614,34918,552,780],[30,551532,22724,552,780],[30,574256,842,552,780],[30,575098,42062,552,780],[30,617160,45418,552,780],[30,662578,29564,552,780],[30,692142,30106,552,780],[30,722248,24580,552,780],[30,746828,24898,552,780],[30,771726,17494,552,780],[30,789220,842,552,780],[30,790062,29570,552,780],[30,819632,35544,552,780],[31,8,26874,552,780],[31,26882,38868,552,780],[31,65750,25816,552,780],[31,91566,26984,552,780],[31,118550,32450,552,780],[31,151000,39764,552,780],[31,190764,42606,552,780],[31,233370,40170,552,780],[31,273540,23246,552,780],[31,296786,49908,552,780],[31,346694,9820,552,780],[31,356514,842,552,780],[31,357356,23956,552,780],[31,381312,30078,552,780],[31,411390,38562,552,780],[31,449952,33356,552,780],[31,483308,35736,552,780],[31,519044,35980,552,780],[31,555024,27418,552,780],[31,582442,13894,552,780],[31,596336,38806,552,780],[31,635142,41316,552,780],[31,676458,22338,552,780],[31,698796,39966,552,780],[31,738762,32102,552,780],[31,770864,29272,552,780],[31,800136,36128,552,780],[31,836264,38344,552,780],[31,874608,30604,552,780],[31,905212,35156,552,780],[31,940368,25112,552,780],[31,965480,21364,552,780],[32,8,23122,552,780],[32,23130,23262,552,780],[32,46392,18458,552,780],[32,64850,842,552,780],[32,65692,49582,552,780],[32,115274,37254,552,780],[32,152528,36254,552,780],[32,188782,35984,552,780],[32,224766,36890,552,780],[32,261656,36656,552,780],[32,298312,44470,552,780],[32,342782,40778,552,780],[32,383560,46576,552,780],[32,430136,39670,552,780],[32,469806,46774,552,780],[32,516580,39258,552,780],[32,555838,39702,552,780],[32,595540,55826,552,780],[32,651366,40946,552,780],[32,692312,50148,552,780],[32,742460,37582,552,780],[32,780042,41038,552,780],[32,821080,28242,552,780],[32,849322,45338,552,780],[32,894660,32790,552,780],[32,927450,29748,552,780],[32,957198,42572,552,780],[32,999770,35232,552,780],[32,1035002,52604,552,780],[32,1087606,17382,552,780],[32,1104988,4328,552,780],[32,1109316,44030,552,780],[33,8,42810,552,780],[33,42818,22640,552,780],[33,65458,44804,552,780],[33,110262,42108,552,780],[33,152370,44152,552,780],[33,196522,38112,552,780],[33,234634,36354,552,780],[33,270988,31106,552,780],[33,302094,38042,552,780],[33,340136,842,552,780],[33,340978,38714,552,780],[33,379692,36644,552,780],[33,416336,34804,552,780],[33,451140,36206,552,780],[33,487346,22570,552,780],[33,509916,842,552,780],[33,510758,26854,552,780],[33,537612,34406,552,780],[33,572018,19682,552,780],[33,591700,23508,552,780],[33,615208,30062,552,780],[33,645270,30516,552,780],[33,675786,35342,552,780],[33,711128,46172,552,780],[33,757300,37500,552,780],[33,794800,21916,552,780],[33,816716,31206,552,780],[33,847922,23120,552,780],[33,871042,23912,552,780],[33,894954,26412,552,780],[33,921366,26616,552,780],[33,947982,842,552,780],[34,8,29214,552,780],[34,29222,29260,552,780],[34,58482,31948,552,780],[34,90430,32822,552,780],[34,123252,28114,552,780],[34,151366,23532,552,780],[34,174898,29698,552,780],[34,204596,39242,552,780],[34,243838,30010,552,780],[34,273848,37180,552,780],[34,311028,39738,552,780],[34,350766,26056,552,780],[34,376822,35410,552,780],[34,412232,31788,552,780],[34,444020,40876,552,780],[34,484896,842,552,780],[34,485738,35762,552,780],[34,521500,34704,552,780],[34,556204,38554,552,780],[34,594758,16116,552,780],[34,610874,37174,552,780],[34,648048,33224,552,780],[34,681272,31330,552,780],[34,712602,842,552,780],[34,713444,35548,552,780],[34,748992,29154,552,780],[34,778146,32582,552,780],[34,810728,23268,552,780],[34,833996,44066,552,780],[34,878062,41246,552,780],[34,919308,45150,552,780],[34,964458,46158,552,780],[35,8,44882,552,780],[35,44890,42402,552,780],[35,87292,44058,552,780],[35,131350,39018,552,780],[35,170368,58872,552,780],[35,229240,4614,552,780],[35,233854,42148,552,780],[35,276002,41862,552,780],[35,317864,30820,552,780],[35,348684,48786,552,780],[35,397470,51862,552,780],[35,449332,50452,552,780],[35,499784,55456,552,780],[35,555240,31358,552,780],[35,586598,38198,552,780],[35,624796,39604,552,780],[35,664400,31578,552,780],[35,695978,26924,552,780],[35,722902,40610,552,780],[35,763512,48314,552,780],[35,811826,45092,552,780],[35,856918,39854,552,780],[35,896772,40484,552,780],[35,937256,32868,552,780],[35,970124,32526,552,780],[35,1002650,27300,552,780],[35,1029950,32744,552,780],[35,1062694,40392,552,780],[35,1103086,31020,552,780],[35,1134106,38954,552,780],[35,1173060,43228,552,780],[35,1216288,44944,552,780],[36,8,4178,552,780],[36,4186,39232,552,780],[36,43418,44022,552,780],[36,87440,842,552,780],[36,88282,28072,552,780],[36,116354,21616,552,780],[36,137970,25116,552,780],[36,163086,22284,552,780],[36,185370,39778,552,780],[36,225148,34850,552,780],[36,259998,29654,552,780],[36,289652,30404,552,780],[36,320056,40476,552,780],[36,360532,13160,552,780],[36,373692,39094,552,780],[36,412786,27736,552,780],[36,440522,26448,552,780],[36,466970,34170,552,780],[36,501140,8742,552,780],[36,509882,842,552,780],[36,510724,24836,552,780],[36,535560,29882,552,780],[36,565442,27600,552,780],[36,593042,31362,552,780],[36,624404,23940,552,780],[36,648344,40936,552,780],[36,689280,38460,552,780],[36,727740,842,552,780],[36,728582,28338,552,780],[36,756920,36460,552,780],[36,793380,31756,552,780],[36,825136,28304,552,780],[37,8,30974,552,780],[37,30982,36128,552,780],[37,67110,8564,552,780],[37,75674,842,552,780],[37,76516,40634,552,780],[37,117150,26606,552,780],[37,143756,33662,552,780],[37,177418,38396,552,780],[37,215814,39154,552,780],[37,254968,39890,552,780],[37,294858,35526,552,780],[37,330384,30142,552,780],[37,360526,43010,552,780],[37,403536,31422,552,780],[37,434958,40508,552,780],[37,475466,43242,552,780],[37,518708,36870,552,780],[37,555578,37892,552,780],[37,593470,41938,552,780],[37,635408,49320,552,780],[37,684728,42620,552,780],[37,727348,51490,552,780],[37,778838,23078,552,780],[37,801916,41060,552,780],[37,842976,41276,552,780],[37,884252,33258,552,780],[37,917510,43688,552,780],[37,961198,16980,552,780],[37,978178,43200,552,780],[37,1021378,28926,552,780],[37,1050304,37560,552,780],[37,1087864,39034,552,780],[38,8,35312,552,780],[38,35320,39324,552,780],[38,74644,53492,552,780],[38,128136,43990,552,780],[38,172126,39334,552,780],[38,211460,38410,552,780],[38,249870,44040,552,780],[38,293910,48440,552,780],[38,342350,30496,552,780],[38,372846,55094,552,780],[38,427940,43052,552,780],[38,470992,57696,552,780],[38,528688,21554,552,780],[38,550242,842,552,780],[38,551084,42470,552,780],[38,593554,36484,552,780],[38,630038,28962,552,780],[38,659000,35316,552,780],[38,694316,38458,552,780],[38,732774,35652,552,780],[38,768426,36730,552,780],[38,805156,40866,552,780],[38,846022,35366,552,780],[38,881388,32610,552,780],[38,913998,36562,552,780],[38,950560,46360,552,780],[38,996920,43660,552,780],[38,1040580,55410,552,780],[38,1095990,59256,552,780],[38,1155246,60310,552,780],[38,1215556,17952,552,780],[38,1233508,842,552,780]]}'),Sr={version:g2,source:_2,count:v2,height:M2,packs:b2,pages:S2,mobile:y2},Sa={type:"change"},Uo={type:"start"},Io={type:"end"},ic=1e-6,je={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM_PAN:4},ur=new Fe,ei=new Fe,E2=new F,fr=new F,ya=new F,Ki=new fs,sc=new F,dr=new F,Ea=new F,pr=new F;class T2 extends ru{constructor(e,t=null){super(e,t),this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.keys=["KeyA","KeyS","KeyD"],this.mouseButtons={LEFT:ci.ROTATE,MIDDLE:ci.DOLLY,RIGHT:ci.PAN},this.target=new F,this.state=je.NONE,this.keyState=je.NONE,this._lastPosition=new F,this._lastZoom=1,this._touchZoomDistanceStart=0,this._touchZoomDistanceEnd=0,this._lastAngle=0,this._eye=new F,this._movePrev=new Fe,this._moveCurr=new Fe,this._lastAxis=new F,this._zoomStart=new Fe,this._zoomEnd=new Fe,this._panStart=new Fe,this._panEnd=new Fe,this._pointers=[],this._pointerPositions={},this._onPointerMove=A2.bind(this),this._onPointerDown=w2.bind(this),this._onPointerUp=C2.bind(this),this._onPointerCancel=R2.bind(this),this._onContextMenu=F2.bind(this),this._onMouseWheel=N2.bind(this),this._onKeyDown=L2.bind(this),this._onKeyUp=P2.bind(this),this._onTouchStart=O2.bind(this),this._onTouchMove=B2.bind(this),this._onTouchEnd=k2.bind(this),this._onMouseDown=D2.bind(this),this._onMouseMove=U2.bind(this),this._onMouseUp=I2.bind(this),this._target0=this.target.clone(),this._position0=this.object.position.clone(),this._up0=this.object.up.clone(),this._zoom0=this.object.zoom,t!==null&&(this.connect(t),this.handleResize()),this.update()}connect(e){super.connect(e),window.addEventListener("keydown",this._onKeyDown),window.addEventListener("keyup",this._onKeyUp),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerCancel),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="none"}disconnect(){window.removeEventListener("keydown",this._onKeyDown),window.removeEventListener("keyup",this._onKeyUp),this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerCancel),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}handleResize(){const e=this.domElement.getBoundingClientRect(),t=this.domElement.ownerDocument.documentElement;this.screen.left=e.left+window.pageXOffset-t.clientLeft,this.screen.top=e.top+window.pageYOffset-t.clientTop,this.screen.width=e.width,this.screen.height=e.height}update(){this._eye.subVectors(this.object.position,this.target),this.noRotate||this._rotateCamera(),this.noZoom||this._zoomCamera(),this.noPan||this._panCamera(),this.object.position.addVectors(this.target,this._eye),this.object.isPerspectiveCamera?(this._checkDistances(),this.object.lookAt(this.target),this._lastPosition.distanceToSquared(this.object.position)>ic&&(this.dispatchEvent(Sa),this._lastPosition.copy(this.object.position))):this.object.isOrthographicCamera?(this.object.lookAt(this.target),(this._lastPosition.distanceToSquared(this.object.position)>ic||this._lastZoom!==this.object.zoom)&&(this.dispatchEvent(Sa),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom)):console.warn("THREE.TrackballControls: Unsupported camera type.")}reset(){this.state=je.NONE,this.keyState=je.NONE,this.target.copy(this._target0),this.object.position.copy(this._position0),this.object.up.copy(this._up0),this.object.zoom=this._zoom0,this.object.updateProjectionMatrix(),this._eye.subVectors(this.object.position,this.target),this.object.lookAt(this.target),this.dispatchEvent(Sa),this._lastPosition.copy(this.object.position),this._lastZoom=this.object.zoom}_panCamera(){if(ei.copy(this._panEnd).sub(this._panStart),ei.lengthSq()){if(this.object.isOrthographicCamera){const e=(this.object.right-this.object.left)/this.object.zoom/this.domElement.clientWidth,t=(this.object.top-this.object.bottom)/this.object.zoom/this.domElement.clientWidth;ei.x*=e,ei.y*=t}ei.multiplyScalar(this._eye.length()*this.panSpeed),fr.copy(this._eye).cross(this.object.up).setLength(ei.x),fr.add(E2.copy(this.object.up).setLength(ei.y)),this.object.position.add(fr),this.target.add(fr),this.staticMoving?this._panStart.copy(this._panEnd):this._panStart.add(ei.subVectors(this._panEnd,this._panStart).multiplyScalar(this.dynamicDampingFactor))}}_rotateCamera(){pr.set(this._moveCurr.x-this._movePrev.x,this._moveCurr.y-this._movePrev.y,0);let e=pr.length();e?(this._eye.copy(this.object.position).sub(this.target),sc.copy(this._eye).normalize(),dr.copy(this.object.up).normalize(),Ea.crossVectors(dr,sc).normalize(),dr.setLength(this._moveCurr.y-this._movePrev.y),Ea.setLength(this._moveCurr.x-this._movePrev.x),pr.copy(dr.add(Ea)),ya.crossVectors(pr,this._eye).normalize(),e*=this.rotateSpeed,Ki.setFromAxisAngle(ya,e),this._eye.applyQuaternion(Ki),this.object.up.applyQuaternion(Ki),this._lastAxis.copy(ya),this._lastAngle=e):!this.staticMoving&&this._lastAngle&&(this._lastAngle*=Math.sqrt(1-this.dynamicDampingFactor),this._eye.copy(this.object.position).sub(this.target),Ki.setFromAxisAngle(this._lastAxis,this._lastAngle),this._eye.applyQuaternion(Ki),this.object.up.applyQuaternion(Ki)),this._movePrev.copy(this._moveCurr)}_zoomCamera(){let e;this.state===je.TOUCH_ZOOM_PAN?(e=this._touchZoomDistanceStart/this._touchZoomDistanceEnd,this._touchZoomDistanceStart=this._touchZoomDistanceEnd,this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=os.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")):(e=1+(this._zoomEnd.y-this._zoomStart.y)*this.zoomSpeed,e!==1&&e>0&&(this.object.isPerspectiveCamera?this._eye.multiplyScalar(e):this.object.isOrthographicCamera?(this.object.zoom=os.clamp(this.object.zoom/e,this.minZoom,this.maxZoom),this._lastZoom!==this.object.zoom&&this.object.updateProjectionMatrix()):console.warn("THREE.TrackballControls: Unsupported camera type")),this.staticMoving?this._zoomStart.copy(this._zoomEnd):this._zoomStart.y+=(this._zoomEnd.y-this._zoomStart.y)*this.dynamicDampingFactor)}_getMouseOnScreen(e,t){return ur.set((e-this.screen.left)/this.screen.width,(t-this.screen.top)/this.screen.height),ur}_getMouseOnCircle(e,t){return ur.set((e-this.screen.width*.5-this.screen.left)/(this.screen.width*.5),(this.screen.height+2*(this.screen.top-t))/this.screen.width),ur}_addPointer(e){this._pointers.push(e)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t].pointerId==e.pointerId){this._pointers.splice(t,1);return}}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Fe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0].pointerId?this._pointers[1]:this._pointers[0];return this._pointerPositions[t.pointerId]}_checkDistances(){(!this.noZoom||!this.noPan)&&(this._eye.lengthSq()>this.maxDistance*this.maxDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.maxDistance)),this._zoomStart.copy(this._zoomEnd)),this._eye.lengthSq()<this.minDistance*this.minDistance&&(this.object.position.addVectors(this.target,this._eye.setLength(this.minDistance)),this._zoomStart.copy(this._zoomEnd)))}}function w2(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i))}function A2(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function C2(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchEnd(i):this._onMouseUp(),this._removePointer(i),this._pointers.length===0&&(this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp)))}function R2(i){this._removePointer(i)}function P2(){this.enabled!==!1&&(this.keyState=je.NONE,window.addEventListener("keydown",this._onKeyDown))}function L2(i){this.enabled!==!1&&(window.removeEventListener("keydown",this._onKeyDown),this.keyState===je.NONE&&(i.code===this.keys[je.ROTATE]&&!this.noRotate?this.keyState=je.ROTATE:i.code===this.keys[je.ZOOM]&&!this.noZoom?this.keyState=je.ZOOM:i.code===this.keys[je.PAN]&&!this.noPan&&(this.keyState=je.PAN)))}function D2(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case ci.DOLLY:this.state=je.ZOOM;break;case ci.ROTATE:this.state=je.ROTATE;break;case ci.PAN:this.state=je.PAN;break;default:this.state=je.NONE}const t=this.keyState!==je.NONE?this.keyState:this.state;t===je.ROTATE&&!this.noRotate?(this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr)):t===je.ZOOM&&!this.noZoom?(this._zoomStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._zoomEnd.copy(this._zoomStart)):t===je.PAN&&!this.noPan&&(this._panStart.copy(this._getMouseOnScreen(i.pageX,i.pageY)),this._panEnd.copy(this._panStart)),this.dispatchEvent(Uo)}function U2(i){const e=this.keyState!==je.NONE?this.keyState:this.state;e===je.ROTATE&&!this.noRotate?(this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY))):e===je.ZOOM&&!this.noZoom?this._zoomEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY)):e===je.PAN&&!this.noPan&&this._panEnd.copy(this._getMouseOnScreen(i.pageX,i.pageY))}function I2(){this.state=je.NONE,this.dispatchEvent(Io)}function N2(i){if(this.enabled!==!1&&this.noZoom!==!0){switch(i.preventDefault(),i.deltaMode){case 2:this._zoomStart.y-=i.deltaY*.025;break;case 1:this._zoomStart.y-=i.deltaY*.01;break;default:this._zoomStart.y-=i.deltaY*25e-5;break}this.dispatchEvent(Uo),this.dispatchEvent(Io)}}function F2(i){this.enabled!==!1&&i.preventDefault()}function O2(i){if(this._trackPointer(i),this._pointers.length===1)this.state=je.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(this._pointers[0].pageX,this._pointers[0].pageY)),this._movePrev.copy(this._moveCurr);else{this.state=je.TOUCH_ZOOM_PAN;const e=this._pointers[0].pageX-this._pointers[1].pageX,t=this._pointers[0].pageY-this._pointers[1].pageY;this._touchZoomDistanceEnd=this._touchZoomDistanceStart=Math.sqrt(e*e+t*t);const n=(this._pointers[0].pageX+this._pointers[1].pageX)/2,s=(this._pointers[0].pageY+this._pointers[1].pageY)/2;this._panStart.copy(this._getMouseOnScreen(n,s)),this._panEnd.copy(this._panStart)}this.dispatchEvent(Uo)}function B2(i){if(this._trackPointer(i),this._pointers.length===1)this._movePrev.copy(this._moveCurr),this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY));else{const e=this._getSecondPointerPosition(i),t=i.pageX-e.x,n=i.pageY-e.y;this._touchZoomDistanceEnd=Math.sqrt(t*t+n*n);const s=(i.pageX+e.x)/2,r=(i.pageY+e.y)/2;this._panEnd.copy(this._getMouseOnScreen(s,r))}}function k2(i){switch(this._pointers.length){case 0:this.state=je.NONE;break;case 1:this.state=je.TOUCH_ROTATE,this._moveCurr.copy(this._getMouseOnCircle(i.pageX,i.pageY)),this._movePrev.copy(this._moveCurr);break;case 2:this.state=je.TOUCH_ZOOM_PAN;for(let e=0;e<this._pointers.length;e++)if(this._pointers[e].pointerId!==i.pointerId){const t=this._pointerPositions[this._pointers[e].pointerId];this._moveCurr.copy(this._getMouseOnCircle(t.x,t.y)),this._movePrev.copy(this._moveCurr);break}break}this.dispatchEvent(Io)}class z2 extends T2{constructor(e,t){super(e,t),this.oneFingerPan=!1;const n=this._onTouchStart,s=this._onTouchMove,r=this._onTouchEnd;this._onTouchStart=a=>{this.oneFingerPan&&this._pointers.length===1?(this._trackPointer(a),this._onMouseDown({button:0,pageX:a.pageX,pageY:a.pageY})):n(a)},this._onTouchMove=a=>{this.oneFingerPan&&this._pointers.length===1?(this._trackPointer(a),this._onMouseMove(a)):s(a)},this._onTouchEnd=a=>{if(!this.oneFingerPan||this._pointers.length>2){r(a);return}this._onMouseUp();const o=this._pointers.filter(l=>l.pointerId!==a.pointerId);if(o.length===1){const l=this._pointerPositions[o[0].pointerId];this._onMouseDown({button:0,pageX:l.x,pageY:l.y})}},this.rotateSpeed=1.5,this.zoomSpeed=1.1,this.panSpeed=.6,this.staticMoving=!0,this.keys=[]}}const V2="/inm-3d-book/assets/pdf.worker.min-iDqQPrd3.mjs",Ci={};await Promise.all(["front","spine"].map(async i=>{const e=new Image;e.src="/inm-3d-book/reference-"+i+".jpg",await e.decode(),Ci[i]=e}));function G2(i,e,t){const n=ui(e,t);return n.getContext("2d").drawImage(Ci[i],0,0,e,t),n}function H2(i,e,t){return i===Ri&&e==="Runnel Zhang"&&t==="#07508a"}const Ri="Informal Notes on Mathematics";function ui(i,e){const t=document.createElement("canvas");return t.width=i,t.height=e,t}function W2(i,e,t){const n=i.createLinearGradient(0,0,e,t);n.addColorStop(0,"#ebe7dd"),n.addColorStop(.45,"#e8e2d5"),n.addColorStop(1,"#ddd7c9"),i.fillStyle=n,i.fillRect(0,0,e,t);let s=73119;const r=()=>(s=s*1664525+1013904223>>>0,s/4294967296);for(let o=0;o<14500;o++){const l=r()*e,c=r()*t,h=r()>.5;i.strokeStyle=h?"rgba(255,255,255,0.055)":"rgba(67,57,35,0.038)",i.lineWidth=r()>.62?1.15:.55,i.beginPath(),i.moveTo(l,c),i.lineTo(l+r()*17+2,c+(r()-.5)*1.1),i.stroke()}const a=i.createLinearGradient(0,0,e,0);a.addColorStop(0,"rgba(255,255,255,.12)"),a.addColorStop(.11,"rgba(255,255,255,.055)"),a.addColorStop(.92,"rgba(0,0,0,0)"),a.addColorStop(1,"rgba(100,93,78,.065)"),i.fillStyle=a,i.fillRect(0,0,e,t)}function Vc(i,e,t,n,s,r=!1){i.save(),i.translate(e,t);const a=i.createLinearGradient(-n,-n,n,n);a.addColorStop(0,s),a.addColorStop(.5,"#1266a3"),a.addColorStop(1,s),i.strokeStyle=a,i.fillStyle=a,i.lineJoin="miter",i.beginPath(),i.moveTo(-n*.79,-n*.46),i.lineTo(0,-n*.97),i.lineTo(n*.79,-n*.46),i.lineTo(n*.74,-n*.37),i.lineTo(0,-n*.84),i.lineTo(-n*.74,-n*.37),i.closePath(),i.fill(),i.beginPath(),i.moveTo(-n*.72,-n*.31),i.lineTo(n*.72,-n*.31),i.lineWidth=n*.055,i.stroke();for(let o=0;o<4;o++){const l=-n*.57+o*n*.38;i.beginPath(),i.roundRect(l-n*.095,-n*.2,n*.19,n*.065,n*.025),i.fill(),i.beginPath(),i.moveTo(l-n*.07,-n*.11),i.lineTo(l+n*.07,-n*.11),i.lineTo(l+n*.085,n*.43),i.lineTo(l-n*.085,n*.43),i.closePath(),i.fill()}for(let o=0;o<3;o++)i.fillRect(-n*.78+o*n*.026,n*(.51+o*.07),n*(1.56-o*.052),n*.042);r&&(i.beginPath(),i.arc(0,0,n*1.19,-.37*Math.PI,.98*Math.PI),i.lineWidth=n*.09,i.strokeStyle=a,i.stroke()),i.restore()}function X2(i,e,t,n,s){i.save(),i.strokeStyle=s,i.lineWidth=3.8,i.beginPath(),i.arc(e,t,n,0,Math.PI*2),i.stroke(),Vc(i,e,t+3,n*.55,s),i.restore()}function Gc(i){const e=(i||Ri).trim();if(e.toLowerCase()===Ri.toLowerCase())return["Informal Notes","on Mathematics"];const t=e.split(/\s+/);if(t.length<=3)return[e];const n=Math.ceil(t.length/2);return[t.slice(0,n).join(" "),t.slice(n).join(" ")]}function Hc({title:i=Ri,author:e="Runnel Zhang",ink:t="#07508a"}={}){if(H2(i,e,t))return G2("front",1200,1680);const n=ui(1200,1680),s=n.getContext("2d");W2(s,1200,1680),X2(s,160,174,56,t),s.fillStyle="#191a19",s.font="bold 20px Arial, sans-serif",s.fillText("INFORMAL NOTES",252,162),s.font="bold 16px Arial,sans-serif",s.fillText("MATHEMATICS · INM",253,188),s.strokeStyle="#171716",s.lineWidth=1.2,s.beginPath(),s.moveTo(252,201),s.lineTo(486,201),s.stroke();const r=Gc(i),a=Math.max(...r.map(x=>x.length)),o=a>28?59:a>20?72:83;s.fillStyle="#111312",s.font="bold "+o+"px Arial,Helvetica,sans-serif",s.textBaseline="alphabetic";const l=520,c=224;r.forEach((x,g)=>s.fillText(x,l,c+g*(o+11),610)),s.font="bold 34px Arial,Helvetica,sans-serif",s.fillText(e,524,470,550);const h=660,d=1150,u=285,p=s.createLinearGradient(300,850,1040,1460);return p.addColorStop(0,"rgba(4,83,149,.03)"),p.addColorStop(.35,"#1374b3"),p.addColorStop(1,"#064783"),s.lineCap="butt",s.lineWidth=33,s.strokeStyle=p,s.beginPath(),s.arc(h,d,u*1.28,-.33*Math.PI,.87*Math.PI),s.stroke(),s.save(),s.translate(h,d),s.rotate(-.04),s.strokeStyle=p,s.beginPath(),s.arc(0,0,u*1.28,.9*Math.PI,1.04*Math.PI),s.stroke(),s.restore(),Vc(s,h,d,u,t),s.fillStyle="rgba(45,45,37,.50)",s.font="16px Georgia,serif",s.fillText("An independent mathematical notebook",86,1595),n}const Ta=new Map;function q2(i="#07508a"){if(Ta.has(i))return Ta.get(i);const e=[1,3,5].map(r=>parseInt(i.slice(r,r+2),16)),t=ui(340,1700),n=t.getContext("2d");n.drawImage(Ci.spine,0,0,340,1700);const s=n.getImageData(0,0,340,1700);for(let r=0;r<s.data.length;r+=4){const a=s.data[r],o=s.data[r+1],l=s.data[r+2],c=l>a+22&&o>a+8,h=.2126*a+.7152*o+.0722*l,d=c?Math.min(1,(l-a)/95):Math.max(0,Math.min(1,(170-h)/105));s.data[r]=c?e[0]:17,s.data[r+1]=c?e[1]:19,s.data[r+2]=c?e[2]:18,s.data[r+3]=Math.round(d*255)}return n.putImageData(s,0,0),Ta.set(i,t),t}function No({title:i=Ri,author:e="Runnel Zhang",ink:t="#07508a",spineAspect:n=.2}={}){const r=Math.max(16,Math.round(1700*n)),a=ui(r,1700),o=a.getContext("2d");o.drawImage(Ci.front,40,450,280,250,0,0,r,1700);const l=q2(t);function c(u,p,x,g,m,f){const M=Math.min(m,r*.64),y=M*g/x;return o.drawImage(l,u,p,x,g,(r-M)/2,f,M,y),{width:M,height:y}}c(88,55,165,150,145,65);const h=c(128,235,78,700,70,260);if(i!==Ri){o.drawImage(Ci.front,40,450,280,250,0,230,r,790),o.save(),o.translate(r/2,260),o.rotate(Math.PI/2);let u=Math.min(60,r*.58);for(o.font="bold "+u+"px Arial, sans-serif";o.measureText(i).width>710&&u>8;)u-=1,o.font="bold "+u+"px Arial, sans-serif";o.fillStyle="#111312",o.fillText(i,0,u*.34),o.restore()}o.strokeStyle="#30352f",o.lineWidth=1.5;const d=Math.min(110,r*.48);if(o.beginPath(),o.moveTo((r-d)/2,1010),o.lineTo((r+d)/2,1010),o.stroke(),e==="Runnel Zhang")c(128,978,78,265,52,1060);else{o.save(),o.translate(r/2,1060),o.rotate(Math.PI/2);let u=Math.min(42,r*.48);for(o.font="bold "+u+"px Arial, sans-serif";o.measureText(e).width>300&&u>8;)u-=1,o.font="bold "+u+"px Arial, sans-serif";o.fillStyle="#111312",o.fillText(e,0,u*.34),o.restore()}return c(110,1490,120,165,102,1480),a.dataset.spineAspect=String(n),a.dataset.titleAspect=String(h.width/h.height),a.dataset.titleWidth=String(h.width),a}function Wc({title:i=Ri,author:e="Runnel Zhang",ink:t="#07508a"}={}){const n=ui(1200,1680),s=n.getContext("2d");s.drawImage(Ci.front,40,450,280,250,0,0,1200,1680),s.save(),s.globalAlpha=.075,s.drawImage(Ci.front,120,660,1040,920,310,790,950,840),s.restore(),s.fillStyle=t,s.font="20px Arial, sans-serif",s.fillStyle="#161918",s.font='bold 53px "Times New Roman", serif';const r=Gc(i);r.forEach((o,l)=>s.fillText(o,110,245+l*65,980));const a=245+(r.length-1)*65;return s.strokeStyle=t,s.lineWidth=3,s.beginPath(),s.moveTo(110,a+52),s.lineTo(1090,a+52),s.stroke(),s.fillStyle=t,s.font='italic 37px "Times New Roman", serif',s.fillText("Connections across modern mathematics",110,a+151,980),s.fillStyle="#303632",s.font='29px "Times New Roman", serif',["What makes distant branches of mathematics","belong to the same landscape?","","Moving through algebra, analysis, geometry and topology,","this volume follows ideas beyond the boundaries","of a single course. Detailed arguments sit alongside","worked examples and the intuitions that motivate them.","","A book to read in sequence, explore by curiosity,","and return to as familiar ideas acquire new meaning."].forEach((o,l)=>s.fillText(o,110,a+250+l*49,980)),s.strokeStyle=t,s.lineWidth=2,s.beginPath(),s.moveTo(110,1480),s.lineTo(1090,1480),s.stroke(),s.fillStyle="#1c2524",s.font='bold 32px "Times New Roman", serif',s.fillText(e,110,1541,750),s.font="18px Arial, sans-serif",s.fillStyle=t,s.textAlign="right",s.fillText("INM",1090,1541),n}function Y2(){const i=ui(160,2048),e=i.getContext("2d");e.fillStyle="#f0ece3",e.fillRect(0,0,i.width,i.height);let t=98;const n=()=>(t=t*1103515245+12345>>>0,t/4294967296);for(let s=0;s<i.height;s+=3){const r=.045+n()*.14;e.fillStyle="rgba(106,101,89,"+r+")",e.fillRect(0,s,i.width,n()>.5?1:2)}for(let s=0;s<55;s++){e.strokeStyle="rgba(255,255,255,.16)",e.beginPath();const r=n()*i.height;e.moveTo(0,r),e.lineTo(i.width,r),e.stroke()}return i}function Z2(){const i=ui(512,512),e=i.getContext("2d"),t=e.createImageData(512,512);let n=9071993;for(let s=0;s<512;s++)for(let r=0;r<512;r++){n=Math.imul(n,1664525)+1013904223>>>0;const a=(n/4294967296-.5)*7,o=Math.sin(r*1.42)*Math.cos(s*1.31)*17,l=Math.sin(s*1.54)*Math.cos(r*1.27)*12,c=Math.min(255,Math.max(0,Math.round(129+o+l+a))),h=(s*512+r)*4;t.data[h]=c,t.data[h+1]=c,t.data[h+2]=c,t.data[h+3]=255}return e.putImageData(t,0,0),i}function j2(i="INM"){const e=ui(750,1060),t=e.getContext("2d");return t.fillStyle="#faf9f4",t.fillRect(0,0,e.width,e.height),t.strokeStyle="#ebe9e2",t.lineWidth=2,t.strokeRect(52,54,e.width-104,e.height-108),t.fillStyle="#c8c6bc",t.font="28px Georgia,serif",t.textAlign="center",t.fillText(i,375,530),e}let rc;async function Xc(i){return rc||=pl(()=>import("./pdf-B75MOh95.js"),[]).then(t=>(t.GlobalWorkerOptions.workerSrc=V2,t)),(await rc).getDocument(i).promise}const Q=i=>document.getElementById(i),ac={a4:[210,297],b5:[176,250],a5:[148,210],royal:[170,240],sixnine:[152,229]},oc=1248,D={pages:oc,sourcePages:oc,caliper:.1,format:"a4",binding:"hardcover",openAngle:120,title:"Informal Notes on Mathematics",author:"Runnel Zhang",ink:"#07508a",open:!1,spread:0,currentPage:1,isMoving:!1,flip:null,coverProgress:0,coverTarget:0,coverUpload:null};let Dr=null,yn=null,yr=null,mr=null;const qc=new m2("/inm-3d-book/inm.pdf",{revision:Sr.source}),K2=new x2;let Er=0;const dn=new Map,Ns=new Map;let wn=0;const $2=window.innerWidth<760?12:16,ai={};let Tr=0;const Yc=new p2("/inm-3d-book/page-previews/",fetch,window.innerWidth<760&&Sr.mobile||Sr);let kr=!0,cc=null;const hi=Q("canvasHost"),vn=new Wh,Ut=new tn(30,1,.08,130),ht=new Yp({antialias:!0,alpha:!0,preserveDrawingBuffer:!0,powerPreference:"high-performance"});ht.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));ht.setSize(hi.clientWidth||1e3,hi.clientHeight||720);ht.outputColorSpace=Ct;ht.toneMapping=fc;ht.toneMappingExposure=.98;ht.shadowMap.enabled=!1;ht.shadowMap.type=hc;hi.appendChild(ht.domElement);let Xt=!0;const St=new z2(Ut,ht.domElement);St.addEventListener("change",()=>{Xt=!0});St.minDistance=1.6;St.maxDistance=35;let Fn=!1,zr=!1,Vn=!1;St.addEventListener("start",()=>{un=null,zr=!0,D.flip&&(D.flip.autoFrame=!1)});Ut.position.set(-5.2,.4,9.3);St.target.set(-.13,.03,0);St.update();const J2=new Qh(16776437,12041149,.85);vn.add(J2);const Rn=new Fr(16777215,1.7);Rn.position.set(-3.4,7.5,8.2);Rn.castShadow=!0;Rn.shadow.mapSize.set(2048,2048);Rn.shadow.camera.left=-9;Rn.shadow.camera.right=9;Rn.shadow.camera.top=9;Rn.shadow.camera.bottom=-9;Rn.shadow.bias=-13e-5;Rn.shadow.normalBias=.012;vn.add(Rn);const Zc=new Fr(15003386,.48);Zc.position.set(6,3,-5);vn.add(Zc);const jc=new Fr(16773856,.34);jc.position.set(-6,3,-2);vn.add(jc);const Kc=new Fr(16774889,.78);Kc.position.set(.2,3.2,-7);vn.add(Kc);const Pi=new jt(new gn(100,100),new Kh({opacity:.065}));Pi.rotation.x=-Math.PI/2;Pi.receiveShadow=!0;Pi.position.y=-1.94;vn.add(Pi);const Vr=document.createElement("canvas");Vr.width=256;Vr.height=256;const Fo=Vr.getContext("2d"),Gr=Fo.createRadialGradient(128,128,7,128,128,125);Gr.addColorStop(0,"rgba(34,36,32,.20)");Gr.addColorStop(.42,"rgba(42,44,40,.10)");Gr.addColorStop(1,"rgba(46,47,43,0)");Fo.fillStyle=Gr;Fo.fillRect(0,0,256,256);const Q2=new Lo(Vr),Zt=new jt(new gn(6,5),new cs({map:Q2,transparent:!0,depthWrite:!1,opacity:.9}));Zt.rotation.x=-Math.PI/2;Zt.position.set(0,Pi.position.y+.003,0);Zt.renderOrder=0;vn.add(Zt);const Oo=new Tn;vn.add(Oo);let Rt=null,Fs=null,Qe=null,ii,zt,si,xo,rn,Bn,oi,Ur,As,$c,At=null,un=null,yi=null;new F(0,0,0);const em=new iu;new Xe;function nn(i){const e=new Lo(i);return e.colorSpace=Ct,e.anisotropy=Math.min(8,ht.capabilities.getMaxAnisotropy()),e.needsUpdate=!0,e}function Bo(){const i=zs(),e=new Ti(i,D.sourcePages,0,0,D.openAngle,D.pages);let t=0,n=e.spinePoint(0);for(let s=1;s<=100;s++){const r=e.spinePoint(s/100);t+=Math.hypot(r.x-n.x,r.z-n.z),n=r}return{...D,spineAspect:t/(i.h+2*i.overhang)}}function tm(){ii=nn(Hc(D)),zt=nn(No(Bo())),si=nn(Wc(D)),xo=nn(Y2()),rn=nn(j2()),Bn=nn(Z2()),Bn.wrapS=rs,Bn.wrapT=rs,Bn.repeat.set(4,4),oi=new kn({map:ii,bumpMap:Bn,bumpScale:.0016,roughness:.91,metalness:0,emissive:16777215,emissiveMap:ii,emissiveIntensity:.16}),Ur=new kn({map:zt,bumpMap:Bn,bumpScale:.0016,roughness:.93,metalness:0}),As=new kn({map:si,bumpMap:Bn,bumpScale:.0016,roughness:.93,metalness:0,emissive:16777215,emissiveMap:si,emissiveIntensity:.16}),new kn({color:"#e7e1d4",roughness:1}),$c=new kn({color:"#e5dfd3",bumpMap:Bn,bumpScale:.0016,roughness:.93,metalness:0}),new kn({map:xo,roughness:1})}tm();function zs(){const[i,e]=ac[D.format]||ac.a4,t=2.7/210,n=i*t,s=e*t,r=Math.max(.035,D.pages/2*D.caliper*t),a=(D.binding==="hardcover"?2.4:.45)*t,o=(D.binding==="hardcover"?3.2:0)*t;return{mmw:i,mmh:e,w:n,h:s,t:r,board:a,overhang:o,scale:t}}function fn(i){return i.toLocaleString("en-US")}function Jc(){D.flip&&(Go(),D.isMoving=!1),Qe&&Qe.dispose();const i=zs();Fs=i;const e=nn(No(Bo()));zt&&zt.dispose(),zt=e,Ur.map=zt,Qe=new f2({root:Oo,dimensions:i,sourcePages:D.sourcePages,printPages:D.pages,materials:{cloth:$c,clothBump:Bn,front:oi,back:As,spine:zt,edge:xo,placeholder:rn}}),Rt={frontPivot:Qe.frontPivot,frontCover:Qe.frontBoard,backCover:Qe.backBoard,rightStack:Qe.rightStack,leftStack:Qe.leftStack,rightPage:Qe.rightPage,leftPage:Qe.leftPage,spine:Qe.spine},Pi.position.y=-i.h/2-i.overhang-.024,Zt.position.y=Pi.position.y+.003,Zt.scale.x=D.open?1.22:.52,Zt.scale.y=D.open?1.1:.48,ko(),Os(D.open),Yn(),Xt=!0}function Os(i){Rt&&(Qe.render(D.coverProgress,D.spread,D.sourcePages,D.pages,D.openAngle),At||(Zt.scale.x=i?1.22:.52,Zt.scale.y=i?1.1:.48),i||(Vn=!1),Q("readerNavigation").hidden=!(i&&Vn),Q("togglePageJump").setAttribute("aria-expanded",String(i&&Vn)),Q("sceneWrap").classList.toggle("is-reading",i),Xt=!0)}function ko(){Qe&&(Qe.render(D.coverProgress,D.spread,D.sourcePages,D.pages,D.openAngle),Xt=!0)}function Yn(){const i=Fs||zs(),e=D.pages/2*D.caliper;if(Q("coreThickness").textContent=e.toFixed(1),Q("sheetCount").textContent=fn(Math.ceil(D.pages/2)),Q("signatureCount").textContent=Math.ceil(D.pages/32)+" signatures",Q("physicalDimensions").textContent=i.mmw+" × "+i.mmh+" mm",Q("pageCount").value=D.pages,Q("pagesRange").value=Math.min(2e3,Math.max(100,D.pages)),Q("sourcePagesLabel").textContent="Source: "+fn(D.sourcePages),Q("sceneTitle").textContent=D.title,Q("sceneMeta").textContent=D.format.toUpperCase()+" / "+D.binding.toUpperCase()+" / "+fn(D.pages)+" PAGES",Q("scaleDetails").textContent=D.format.toUpperCase()+" · "+i.mmw+" × "+i.mmh+" mm · "+e.toFixed(1)+" mm book block",!D.open)Q("counterLabel").textContent="CLOSED VOLUME",Q("pageIndicator").textContent="1 / "+fn(D.sourcePages);else{const t=D.spread*2,n=t+1;Q("counterLabel").textContent="PAGE";const s=t>0&&t<=D.sourcePages?fn(t):"",r=n<=D.sourcePages?fn(n):"";Q("pageIndicator").textContent=(s&&r?s+"–"+r:s||r)+" / "+fn(D.sourcePages)}Q("readerPosition").max=D.sourcePages,Q("readerPageInput").max=D.sourcePages,Q("readerPosition").value=D.currentPage,document.activeElement!==Q("readerPageInput")&&(Q("readerPageInput").value=D.currentPage),Q("inspectorQuick").hidden=!D.open,Q("togglePageJump").disabled=!D.open,Q("prevPage").disabled=!D.open||D.isMoving||D.spread<=0,Q("nextPage").disabled=!D.open||D.isMoving||D.spread>=Math.ceil(D.sourcePages/2)}function xr(){const i=nn(Hc(D)),e=nn(No(Bo())),t=nn(Wc(D));ii&&ii.dispose(),zt&&zt.dispose(),si&&si.dispose(),ii=i,zt=e,si=t,oi.map=ii,oi.emissiveMap=ii,Ur.map=zt,As.map=si,As.emissiveMap=si,oi.needsUpdate=!0,Ur.needsUpdate=!0,As.needsUpdate=!0,D.coverUpload&&(oi.map=D.coverUpload),Qe&&(Qe.materials.spine=zt,Qe.spine.material.map=zt,Qe.spine.material.emissiveMap=zt,Qe.spine.material.needsUpdate=!0),Xt=!0,Yn()}function an(i,e=!1){const t=Q("loadingMsg");t.textContent=i||"",e&&i&&(clearTimeout(an.timer),an.timer=setTimeout(()=>{t.textContent===i&&(t.textContent="")},2500))}function Qi(i,e){if(!i||!i.material)return;const t=e||rn;i.material.map!==t&&(i.material.map=t,Xt=!0)}function Qc(i,{isDefault:e=!1}={}){kr=e,e||(dn.forEach(n=>n.then(s=>{s&&s!==rn&&s.dispose()}).catch(()=>{})),dn.clear(),Ns.clear(),wn++,Er++);const t=wn;return Dr=null,Q("pdfState").textContent="Loading PDF…",yn=Xc(i).then(n=>t!==wn?(n.destroy(),yn):(Dr=n,D.sourcePages=n.numPages,Q("pdfState").textContent=fn(n.numPages)+"-page source",e||an("",!1),Yn(),D.open&&!e&&Li(Math.min(D.spread,Math.floor((n.numPages-1)/2))),n)).catch(n=>{if(t!==wn)return yn;throw e?(yn=null,Q("pdfState").textContent="Page previews available",n):(Q("pdfState").textContent="PDF unavailable",an("Unable to load PDF pages. The 3D cover remains available.",!0),console.error("PDF loading error",n),n)}),yn}function zo(){if(yr)return yn;if(!mr){const i=wn;mr=qc.load().then(e=>yr||i!==wn||yn?yn:Qc({data:e.slice()},{isDefault:!0})).then(e=>(!yr&&e&&(Q("pdfState").textContent=fn(e.numPages)+" pages · reading copy ready",tl()),e)).catch(e=>{throw mr=null,e})}return mr}function el(){return yn||zo()}async function nm(i){const e=performance.now(),t=await Yc.blob(i),n=performance.now();if(typeof createImageBitmap=="function"){const r=await createImageBitmap(t,{imageOrientation:"flipY",premultiplyAlpha:"none",colorSpaceConversion:"none"}),a=new yt(r);return a.flipY=!1,a.colorSpace=Ct,a.anisotropy=Math.min(8,ht.capabilities.getMaxAnisotropy()),a.needsUpdate=!0,a.addEventListener("dispose",()=>r.close()),ai.lastImage={fetchMs:n-e,decodeMs:performance.now()-n},a}const s=URL.createObjectURL(t);try{const r=new Image;r.src=s,await r.decode();const a=new yt(r);return a.colorSpace=Ct,a.needsUpdate=!0,a}finally{URL.revokeObjectURL(s)}}function im(i,e=!1){const t=wn;return K2.run(async()=>{if(t!==wn)return rn;const n=await el();if(i>n.numPages)return rn;const s=await n.getPage(i),r=s.getViewport({scale:1}),a=kr?window.innerWidth<760?780:1100:window.innerWidth<760?1100:1600,o=s.getViewport({scale:Math.min(1.9,a/r.height)}),l=document.createElement("canvas");l.width=Math.ceil(o.width),l.height=Math.ceil(o.height);const c=l.getContext("2d",{alpha:!1});return c.fillStyle="#fff",c.fillRect(0,0,l.width,l.height),await s.render({canvasContext:c,viewport:o}).promise,s.cleanup(),ai.localRenders=(ai.localRenders||0)+1,nn(l)},e)}function Bs(i,e=!1){if(!i||i<1||i>D.sourcePages)return Promise.resolve(rn);if(dn.has(i))return dn.get(i);const t=wn,n=(async()=>{if(kr&&!Dr)try{return await nm(i)}catch(s){console.warn("Using PDF fallback for page previews",s)}return im(i,e)})().then(s=>t!==wn?(s!==rn&&s.dispose(),rn):(dn.get(i)===n&&Ns.set(i,s),queueMicrotask(Vo),s)).catch(s=>(dn.get(i)===n&&dn.delete(i),console.warn("Could not render page",i,s),rn));return dn.set(i,n),n}function Vo(){const i=new Set([Rt?.leftPage.material.map,Rt?.rightPage.material.map,D.flip?.frontMat.map]);for(const[e,t]of dn){if(dn.size<=$2)break;const n=Ns.get(e);!n||i.has(n)||Math.abs(e-D.spread*2-1)<=4||(dn.delete(e),Ns.delete(e),n!==rn&&n.dispose())}}function go(i){return Ns.get(i)||rn}function tl(){clearTimeout(cc);const i=D.spread*2+1;cc=setTimeout(()=>{if(!(!D.open||D.isMoving))for(const e of[i+1,i+2,i+3,i+4,i-2,i-3])e>0&&e<=D.sourcePages&&Bs(e,!0)},180)}async function Li(i,e=null){if(!Rt)return;D.spread=Math.min(Math.max(0,i),Math.ceil(D.sourcePages/2)),D.currentPage=e===null?Math.min(D.sourcePages,D.spread*2+1):Math.min(D.sourcePages,Math.max(1,Math.floor(e)));const t=++Er,n=performance.now();if(Tr=D.open?t:0,ko(),Os(D.open),Yn(),!D.open)return;const s=performance.now();an("Preparing the printed pages…");try{const r=D.spread===0?0:D.spread*2,a=D.spread*2+1;Qi(Rt.leftPage,go(r)),Qi(Rt.rightPage,go(a));const[o,l]=await Promise.all([Bs(r),Bs(a)]);if(t!==Er)return;D.flip||(Qi(Rt.leftPage,o),Qi(Rt.rightPage,l)),ai.page=D.currentPage,ai.geometryMs=s-n,ai.textureMs=performance.now()-s,ai.totalMs=performance.now()-n,Tr=0,an(""),tl(),Vo()}catch{t===Er&&(Tr=0,an("Page preview is temporarily unavailable.",!0))}}function wa(i){return i*i*(3-2*i)}function zn(i){D.isMoving||(D.open=i,D.isMoving=!0,i||(Tr=0),D.coverTarget=i?1:0,D.spread=i?D.spread:0,i||(Q("readerNavigation").hidden=!0,Q("sceneWrap").classList.remove("is-reading")),At={kind:"cover",from:D.coverProgress,to:D.coverTarget,start:performance.now(),duration:850},Q("openBook").innerHTML=i?"Close <span>×</span>":"Open <span>↗</span>",i?(Li(D.spread),pn("read")):(Yn(),pn("front")))}function Go(){if(!D.flip)return;const i=D.flip;i.group.parent&&i.group.parent.remove(i.group),i.geometry.dispose(),i.backMat.map&&i.backMat.map.dispose(),i.frontMat.dispose(),i.backMat.dispose(),D.flip=null,Vo()}function nl(i,e){const t=Qe.applyTurn(i.stationaryPose,e);i.model.writePositions(i.geometry.attributes.position,e,i.dir,t),i.geometry.computeVertexNormals(),i.geometry.computeBoundingSphere()}async function ti(i){if(D.isMoving)return;if(!D.open){zn(!0);return}const e=D.spread+i;if(e<0||e>Math.ceil(D.sourcePages/2))return;D.isMoving=!0,Yn();const t=D.spread,n=i>0?t*2+1:t*2,s=i>0?n+1:n-1,r=i>0?e*2+1:e>0?e*2:0;try{const[a,o,l]=[n,s,r].map(go);if(!D.isMoving||!D.open){D.isMoving=!1;return}const c=new gn(1,1,64,16),h=Float32Array.from(c.attributes.position.array),d=i>0?"right":"left",u=i>0?"left":"right",p=new Ti(Fs,D.sourcePages,t,1,D.openAngle,D.pages),x=new Ti(Fs,D.sourcePages,e,1,D.openAngle,D.pages),g=p.gutterSafeFraction,m=c.attributes.uv,f=new Float32Array(m.count*3);for(let A=0;A<m.count;A++){const B=i>0?h[3*A]+.5:.5-h[3*A],z=.085+.915*Math.max(0,(B-g)/(1-g));m.setX(A,i>0?z:1-z);const W=Math.min(1,B/(g*1.8)),q=W*W*(3-2*W),H=.83+.17*q;f[3*A]=H,f[3*A+1]=H*.997,f[3*A+2]=H*.985}m.needsUpdate=!0,c.setAttribute("color",new ut(f,3));const M=o.clone();M.wrapS=rs,M.repeat.x=-1,M.offset.x=1,M.needsUpdate=!0;const y=new cs({map:a,toneMapped:!1,side:_n,vertexColors:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),w=new cs({map:M,toneMapped:!1,side:Ot,vertexColors:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),P=Qe.captureTurn(e),E=new d2({from:p,to:x,fromSide:d,toSide:u,columns:64,rows:16}),C=new Tn,U=new jt(c,y),S=new jt(c,w);U.frustumCulled=!1,S.frustumCulled=!1,U.renderOrder=4,S.renderOrder=4,C.add(U,S),Oo.add(C);const b={group:C,geometry:c,basePositions:h,frontMat:y,backMat:w,poseFrom:p,poseTo:x,fromSide:d,toSide:u,model:E,stationaryPose:P,dir:i,autoFrame:!1,frameScale:1,start:performance.now(),lastTime:performance.now(),progress:0,duration:850};nl(b,0),i>0?Qi(Rt.rightPage,l):Qi(Rt.leftPage,l),D.flip=b,an("");for(const A of[n,s,r])Bs(A)}catch(a){console.error("Page turn failed",a),an("Could not turn the page.",!0),D.isMoving=!1,Yn()}}function il(i){if(requestAnimationFrame(il),em.getDelta(),At){Xt=!0;const t=Math.min(1,(i-At.start)/At.duration),n=wa(t);if(Zt.scale.x=os.lerp(At.to?.52:1.22,At.to?1.22:.52,n),Zt.scale.y=os.lerp(At.to?.48:1.1,At.to?1.1:.48,n),D.coverProgress=At.from+(At.to-At.from)*n,Qe.render(D.coverProgress,D.spread,D.sourcePages,D.pages,D.openAngle),t>=1){const s=At.to===1;At=null,D.isMoving=!1,Os(s),s?Li(D.spread):(D.spread=0,D.currentPage=1,Os(!1),Yn())}}if(D.flip){Xt=!0;const t=D.flip,n=Math.min(65,Math.max(0,i-t.lastTime));t.lastTime=i,t.progress=Math.min(1,t.progress+n/t.duration);const s=t.progress;if(nl(t,wa(s)),s>=1){const r=D.spread+t.dir;Go(),D.isMoving=!1,Li(r)}}if(un){Xt=!0;const t=Math.min(1,(i-un.start)/un.duration),n=wa(t);Ut.position.lerpVectors(un.from,un.to,n),St.target.lerpVectors(un.targetFrom,un.targetTo,n),t>=1&&(un=null)}const e=St.update();(Xt||e)&&(ht.render(vn,Ut),Xt=!1)}function pn(i,e=!0){zr=!1,Ut.up.set(0,1,0),document.querySelectorAll(".view-button").forEach(u=>u.classList.toggle("active",u.id==="view"+i[0].toUpperCase()+i.slice(1)));const t=Fs||zs(),n=D.open,s=Qe?.root.position.y||0,r=hi.clientWidth,a=hi.clientHeight,o=D.spread/Math.max(1,Math.ceil(D.sourcePages/2)),l=Math.abs(o-.5)*2,c=r<760?l*.25:l,h=n?new F((.5-o)*.6*c,s+.18+.75*c,0):new F(0,.05,0);let d;if(!n)i==="back"?d=new F(4,.5,-9.3):i==="spine"?d=new F(-6.8,.4,3):i==="pages"?d=new F(3.6,3.4,6):d=new F(-5.2,.4,9.3);else if(i==="spine"){Qe.root.updateMatrixWorld(!0);const u=Qe.rig.spinePoint(.5);h.copy(Qe.root.localToWorld(new F(u.x,0,u.z)));const p=o<.22?-1:o>.78?1:0;h.y+=.65,d=h.clone().add(new F(p*6.5,-3.8,-10.5))}else i==="pages"?d=new F(.2,s+8.5,2):i==="read"?d=new F(h.x-.3,s+6.4+2.5*c,4.85+.8*c):d=new F(-2.3,s+4.8,5.8);if(r<760){const u=d.clone().sub(h);let p=n?(2*t.w+.9)/(2*Math.tan(os.degToRad(Ut.fov)/2)*(r/a))*1.07:Math.max(9.8,t.h/(2*Math.tan(os.degToRad(Ut.fov)/2))*.92);u.setLength(Math.max(u.length(),p)),d=h.clone().add(u)}if(!e){un=null,Ut.position.copy(d),St.target.copy(h),St.update(),Xt=!0;return}un={from:Ut.position.clone(),to:d,targetFrom:St.target.clone(),targetTo:h,start:performance.now(),duration:900}}function wr(){At&&(At=null,D.isMoving=!1),D.coverProgress=D.open?1:0,Jc(),D.open&&(Li(D.spread),pn("read"))}function Cs(i){const e=Number(i);Number.isFinite(e)&&(D.pages=Math.min(4e3,Math.max(2,Math.round(e/2)*2)),wr())}function sm(){Cs(D.sourcePages)}function Sn(i,{fromInspector:e=!1}={}){const t=D.open&&zr,n=Math.min(D.sourcePages,Math.max(1,Math.floor(Number(i)||1)));return D.flip&&Go(),At=null,D.isMoving=!1,D.open||(D.open=!0,D.coverProgress=1,D.coverTarget=1,Q("openBook").innerHTML="Close <span>×</span>",Qe.render(1,D.spread,D.sourcePages,D.pages,D.openAngle),Zt.scale.x=1.22,Zt.scale.y=1.1),Vn=!1,Li(Math.floor(n/2),n),Os(!0),t||pn("read",!1),history.replaceState(null,"","#p="+n),window.matchMedia("(max-width: 760px)").matches&&(sl(!1),window.scrollTo({top:0,behavior:"smooth"})),n}function rm(i){if(!i)return;(async()=>{let t;if(i.type==="application/pdf"){const l=new Uint8Array(await i.arrayBuffer()),c=await Xc({data:l}),h=await c.getPage(1),d=h.getViewport({scale:1.65}),u=document.createElement("canvas");u.width=Math.round(d.width),u.height=Math.round(d.height),await h.render({canvasContext:u.getContext("2d"),viewport:d}).promise,t=u,await c.destroy()}else t=await createImageBitmap(i);const n=document.createElement("canvas");n.width=1200,n.height=1680;const s=n.getContext("2d");s.fillStyle="#e7e2d6",s.fillRect(0,0,n.width,n.height);const r=Math.max(n.width/t.width,n.height/t.height),a=t.width*r,o=t.height*r;s.drawImage(t,(n.width-a)/2,(n.height-o)/2,a,o),D.coverUpload&&D.coverUpload.dispose(),D.coverUpload=nn(n),oi.map=D.coverUpload,oi.needsUpdate=!0,an("Your cover is applied.",!0)})().catch(t=>{console.error(t),an("This cover file could not be read.",!0)})}function am(){ht.render(vn,Ut);const i=ht.domElement,e=document.createElement("a");e.href=i.toDataURL("image/png"),e.download="INM-physical-book-"+(D.open?"open":"cover")+".png",document.body.appendChild(e),e.click(),e.remove()}function sl(i){Q("sidebar").hidden=!i,Q("sidebar").classList.toggle("mobile-open",i),Q("toggleSettings").setAttribute("aria-expanded",String(i)),Q("toggleSettings").innerHTML=i?"Hide print settings <span>⌃</span>":"Print settings <span>⌄</span>"}function om(){const i=document.createElement("button");i.id="viewBack",i.className="view-button",i.type="button",i.textContent="Back",i.title="Back cover",Q("viewSpine").before(i),i.addEventListener("click",()=>{D.open&&zn(!1),pn("back")});const e=document.createElement("div");e.className="manipulation-tools",e.innerHTML='<button id="moveBook" type="button" aria-pressed="false">Move</button><button id="resetBookView" type="button">Reset view</button>',Q("viewTools").append(e),Q("moveBook").addEventListener("click",()=>{Fn=!Fn,St.mouseButtons.LEFT=Fn?ci.PAN:ci.ROTATE,St.oneFingerPan=Fn,St.noRotate=Fn,Q("moveBook").setAttribute("aria-pressed",String(Fn)),Q("moveBook").textContent=Fn?"Rotate":"Move",ht.domElement.style.cursor=Fn?"move":"grab"}),Q("resetBookView").addEventListener("click",()=>pn(D.open?"read":"front")),Q("pageCount").addEventListener("change",s=>Cs(s.target.value)),Q("pagesRange").addEventListener("input",s=>Cs(s.target.value)),Q("restorePageCount").addEventListener("click",sm),Q("format").addEventListener("change",s=>{D.format=s.target.value,wr()}),Q("paper").addEventListener("change",s=>{D.caliper=Number(s.target.value),wr()}),Q("binding").addEventListener("change",s=>{D.binding=s.target.value,wr()}),Q("openingAngle").addEventListener("input",s=>{D.openAngle=Number(s.target.value),Q("angleLabel").textContent=D.openAngle+"°",ko()}),Q("coverTitle").addEventListener("input",s=>{D.title=s.target.value||"Informal Notes on Mathematics",xr()}),Q("coverAuthor").addEventListener("input",s=>{D.author=s.target.value||"Runnel Zhang",xr()}),Q("inkColor").addEventListener("input",s=>{D.ink=s.target.value,xr()}),Q("coverUpload").addEventListener("change",s=>rm(s.target.files[0])),Q("resetCover").addEventListener("click",()=>{D.coverUpload&&D.coverUpload.dispose(),D.coverUpload=null,Q("coverUpload").value="",xr()}),Q("pdfUpload").addEventListener("change",async s=>{const r=s.target.files[0];if(r)try{yr=r,await Qc({data:new Uint8Array(await r.arrayBuffer())}),Cs(D.sourcePages),D.spread=0,D.currentPage=1,D.open&&Li(0),Q("outlineCount").textContent="The index below describes the original INM PDF.",an("Loaded your own PDF — "+fn(D.sourcePages)+" pages.",!0)}catch(a){console.error(a)}}),Q("captureBtn").addEventListener("click",am),Q("openBook").addEventListener("click",()=>zn(!D.open)),Q("prevPage").addEventListener("click",()=>ti(-1)),Q("nextPage").addEventListener("click",()=>ti(1)),Q("viewFront").addEventListener("click",()=>pn("front")),Q("viewSpine").addEventListener("click",()=>pn("spine")),Q("viewPages").addEventListener("click",()=>pn("pages")),Q("viewRead").addEventListener("click",()=>{D.open?pn("read"):zn(!0)}),Q("readerPosition").addEventListener("input",s=>{Q("readerPageInput").value=s.target.value}),Q("readerPosition").addEventListener("change",s=>Sn(s.target.value)),Q("readerPageInput").addEventListener("change",s=>Sn(s.target.value)),Q("readerPageInput").addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),Sn(s.target.value),s.target.blur())}),Q("readerGo").addEventListener("click",()=>Sn(Q("readerPageInput").value)),Q("inspectorOpen").addEventListener("click",()=>yi?.open(D.currentPage)),Q("inspectorQuick").addEventListener("click",()=>yi?.open(D.currentPage)),Q("toggleSettings").addEventListener("click",()=>{const s=Q("sidebar").hidden;sl(s),s&&window.matchMedia("(max-width:760px)").matches&&setTimeout(()=>Q("sidebar").scrollIntoView({behavior:"smooth",block:"start"}),110)}),Q("togglePageJump").addEventListener("click",()=>{Vn=!Vn,Q("readerNavigation").hidden=!Vn,Q("togglePageJump").setAttribute("aria-expanded",String(Vn)),Vn&&(Q("readerPageInput").focus(),Q("readerPageInput").select())}),Q("viewMenu").addEventListener("click",s=>{s.target.closest("button")&&(Q("viewMenu").open=!1)}),document.addEventListener("click",s=>{Q("viewMenu").contains(s.target)||(Q("viewMenu").open=!1)}),document.addEventListener("keydown",s=>{if(s.key==="Escape"&&Q("viewMenu").open){Q("viewMenu").open=!1;return}yi?.visible()||/INPUT|SELECT|TEXTAREA/.test(s.target.tagName)||((s.key==="r"||s.key==="R")&&D.open&&yi?.open(D.currentPage),s.key==="ArrowRight"&&ti(1),s.key==="ArrowLeft"&&ti(-1),s.key==="Escape"&&D.open&&zn(!1),s.key==="Home"&&Sn(1),s.key==="End"&&Sn(D.sourcePages),s.key===" "&&(s.preventDefault(),zn(!D.open)))});let t=null;ht.domElement.addEventListener("pointerdown",s=>{t={x:s.clientX,y:s.clientY}}),ht.domElement.addEventListener("dblclick",s=>{if(!D.open||D.isMoving)return;const r=ht.domElement.getBoundingClientRect(),o=(s.clientX-r.left)/r.width<.5?D.spread*2:D.spread*2+1;o>0&&o<=D.sourcePages&&yi?.open(o)}),ht.domElement.addEventListener("pointerup",s=>{if(!t)return;if(Fn||s.button!==0||!s.isPrimary){t=null;return}const r=Math.hypot(t.x-s.clientX,t.y-s.clientY);if(t=null,r>6||D.isMoving)return;const a=ht.domElement.getBoundingClientRect(),o=new Fe((s.clientX-a.left)/a.width*2-1,-((s.clientY-a.top)/a.height)*2+1),l=new su;l.setFromCamera(o,Ut);const c=[Rt.frontCover,Rt.rightPage,Rt.leftPage,Rt.rightStack,Rt.leftStack,Rt.backCover],h=l.intersectObjects(c.filter(d=>d.visible),!0);if(h.length){if(!D.open){zn(!0);return}h[0].point.x<0?ti(-1):ti(1)}}),new ResizeObserver(()=>{const s=hi.clientWidth,r=hi.clientHeight;!s||!r||(Ut.aspect=s/r,Ut.updateProjectionMatrix(),ht.setSize(s,r,!1),St.handleResize(),ht.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8)),Xt=!0,s<520&&!D.isMoving&&!zr&&Ut.position.length()<10.5&&(Ut.position.set(-3.8,1.7,11.8),St.target.set(0,.02,0),St.update()))}).observe(hi)}Jc();om();yi=xl({getDocument:el,getPageCount:()=>D.sourcePages,onNavigate:Sn});ml({baseUrl:"/inm-3d-book/",onJump:Sn});Yn();requestAnimationFrame(il);Q("pdfState").textContent=fn(D.sourcePages)+"-page source";setTimeout(()=>{if(kr&&(!D.open||D.spread===0))for(const i of[1,2,3])Bs(i)},150);setTimeout(()=>zo().catch(i=>console.warn("Background reading copy deferred",i)),1e3);setTimeout(()=>{const i=location.hash.match(/^#p=(\d+)$/);i&&Sn(Number(i[1]))},0);window.__INM_DEBUG__={state:D,dims:zs,scene:vn,camera:Ut,controls:St,renderer:ht,open:()=>zn(!0),close:()=>zn(!1),next:()=>ti(1),previous:()=>ti(-1),setPageCount:Cs,focusView:pn,jump:Sn,inspect:i=>yi.open(i),mechanics:()=>Qe,pdf:()=>Dr,previews:Yc,readingCopy:qc,prepareReadingCopy:zo,pageTiming:ai};
