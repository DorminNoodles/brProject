import { Vec2 } from './Vec2.js';

export var e_Inputs = {
	LEFT: (1 << 0),
	UP: (1 << 1),
	RIGHT: (1 << 2),
	DOWN: (1 << 3),
	MOUSE1: (1 << 4),
};

let _InputKeys = {
  81:e_Inputs.LEFT,//q
  37:e_Inputs.LEFT,//left

  68:e_Inputs.RIGHT,//d
  39:e_Inputs.RIGHT,//right

  90:e_Inputs.UP,//z
  38:e_Inputs.UP,//up

  83:e_Inputs.DOWN,//s
  40:e_Inputs.DOWN,//down
}

class Inputs{
  constructor(){
    this.bitKey = 0;
    this.mousePos = new Vec2(0,0);
	  this.lastOutgoingInputNumber = 0;
	  this.lastOutgoingTime = 0;

    this.lastInputList = [];
  }

  getAndSend(){
    /*
    this.lastOutgoingInputNumber++;
    this.lastOutgoingTime = clientInfo.currTime;

	  var input = {tx:this.mousePosX,ty:this.mousePosY, btn:this.bitKey, inputSequenceNumber:this.lastOutgoingInputNumber, emitTime: clientInfo.currTime};

	  //client reconciliation
	  this.lastInputList.push(input);

	  //TODO: current TICK + dont send if serverState.tick not changed
	  //g_NetData.addToSendList('i',inputs); //TODO: filter + add Info
    */

    return this;
  }

  onKeyDown(event){
    let c = event.keyCode;

    if(c in _InputKeys)
      this.bitKey |= _InputKeys[c];
  }

	onKeyUp(event){
		var c = event.keyCode;

    if(c in _InputKeys)
      this.bitKey &= ~_InputKeys[c];
	}
};

export var g_LocalInput = new Inputs();

$(document).mousedown(function(event){
  g_LocalInput.bitKey |= e_Inputs.MOUSE1;
});

$(document).mouseup(function(event){
  g_LocalInput.bitKey &= ~e_Inputs.MOUSE1;
});

$(document).mousemove(function(event){
	g_LocalInput.mousePos.x = event.clientX;
	g_LocalInput.mousePos.y = event.clientY;
});

$( window ).keydown(function(event){
	g_LocalInput.onKeyDown(event);
});

$( window ).keyup(function(event){
	g_LocalInput.onKeyUp(event);
});

