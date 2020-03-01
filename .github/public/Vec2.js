export class Vec2{
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  addN(v){
    if(!isNaN(v))
      return new Vec2(this.x + v, this.y + v);
    return new Vec2(this.x + v.x, this.y + v.y);
  }
  minN(v){
    if(!isNaN(v))
      return new Vec2(this.x - v, this.y - v);
    return new Vec2(this.x - v.x, this.y - v.y);
  }
  divN(v){
    if(!isNaN(v))
      return new Vec2(this.x / v, this.y / v);
    return new Vec2(this.x / v.x, this.y / v.y);
  }
  mulN(v){
    if(!isNaN(v))
      return new Vec2(this.x * v, this.y * v);
    return new Vec2(this.x * v.x, this.y * v.y);
  }

  add(v){
    if(!isNaN(v)){
      this.x += v;
      this.y += v;
      return;
    }
    this.x += v.x;
    this.y += v.y;
  }
  min(v){
    if(!isNaN(v)){
      this.x -= v;
      this.y -= v;
      return;
    }
    this.x -= v.x;
    this.y -= v.y;
  }
  div(v){
    if(!isNaN(v)){
      this.x /= v;
      this.y /= v;
      return;
    }
    this.x /= v.x;
    this.y /= v.y;
  }
  mul(v){
    if(!isNaN(v)){
      this.x *= v;
      this.y *= v;
      return;
    }
    this.x *= v.x;
    this.y *= v.y;
  }


  normalize(){
  	var length = Math.sqrt(this.x*this.x + this.y*this.y);
  	if(length != 0){
  		this.x /= length;
  		this.y /= length;
  	}
  }


}
