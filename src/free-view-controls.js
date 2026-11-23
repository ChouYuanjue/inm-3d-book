import {TrackballControls} from 'three/addons/controls/TrackballControls.js';

// Trackball rotation transports camera.up, allowing continuous pole crossings.
// Route a single touch through the existing pan handler when Move is selected;
// two-finger pan/pinch remains the native TrackballControls gesture.
export class FreeViewControls extends TrackballControls {
  constructor(camera,element){
    super(camera,element);
    this.oneFingerPan=false;
    const start=this._onTouchStart,move=this._onTouchMove,end=this._onTouchEnd;
    this._onTouchStart=event=>{
      if(this.oneFingerPan&&this._pointers.length===1){
        this._trackPointer(event);
        this._onMouseDown({button:0,pageX:event.pageX,pageY:event.pageY});
      }else start(event);
    };
    this._onTouchMove=event=>{
      if(this.oneFingerPan&&this._pointers.length===1){
        this._trackPointer(event);this._onMouseMove(event);
      }else move(event);
    };
    this._onTouchEnd=event=>{
      if(!this.oneFingerPan||this._pointers.length>2){end(event);return;}
      this._onMouseUp();
      const remaining=this._pointers.filter(p=>p.pointerId!==event.pointerId);
      if(remaining.length===1){
        const p=this._pointerPositions[remaining[0].pointerId];
        this._onMouseDown({button:0,pageX:p.x,pageY:p.y});
      }
    };
    this.rotateSpeed=1.5;
    this.zoomSpeed=1.1;
    this.panSpeed=.6;
    this.staticMoving=true;
    this.keys=[];
  }
}
