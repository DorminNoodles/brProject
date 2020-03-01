import { Vec2 } from './Vec2.js';

export class Camera{
  constructor(canvas, ctx){
	  this.center = new Vec2(0,0);
	  this.scale = 1;

    this.ctx = ctx;
    this.canvas = canvas
  }

  //call Before view()
  //pos {x:,y:}
  update(pos){
  	this.center = pos;
  };

  //call Before Draw world
  view(){
    //Set position + clear
  	this.ctx.setTransform(this.scale,0,0,this.scale,this.canvas.halfWidth/this.scale-this.center.x,this.canvas.halfHeight/this.scale-this.center.y);
  	this.ctx.clearRect(this.center.x-this.canvas.halfWidth,this.center.y-this.canvas.halfHeight, this.canvas.width, this.canvas.height);
  };

  //call Before Draw HUD
  HUDview(){
  	this.ctx.setTransform(1,0,0,1,0,0);
  };
};

