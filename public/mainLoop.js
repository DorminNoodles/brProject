import { Vec2 } from './Vec2.js';
import { Camera } from './Camera.js';
import { e_Inputs, g_LocalInput } from './Input.js';

import {socket, sendDataToServer} from './socketIO.js';

let otherPlayers = [];
let fires = [];

var g_Canvas = $('#gameCanvas')[0];
var g_ctx = g_Canvas.getContext('2d');

var g_LocalCamera = new Camera(g_Canvas, g_ctx);
var g_GameLoopHandle;

/////////////////////TMP Player//////////////
class Player{
  constructor(){
	//   console.log(socket);
	  this.radius = 5;

	  this.color = "#FF0000";
	  this.colorLighter = "#FFFFFF";

	  this.pos = new Vec2(0, 0);
	  this.target = new Vec2(0, 0);
	  this.moveDir = new Vec2(0, 0);

    this.speed = 5;
    this.fire = false;
  }

  drawLine(start, target) {
	let dist = 1000;
	g_ctx.strokeStyle = "#FF0000";
	g_ctx.beginPath();
	g_ctx.moveTo(start.x, start.y);
	g_ctx.lineTo(start.x + target.x*dist, start.y + target.y*dist);
	g_ctx.stroke();
  }

  draw(){
	  g_ctx.save();

	  //draw Player
	  g_ctx.beginPath();
	  g_ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
	  g_ctx.fillStyle = this.colorLighter;
	  g_ctx.fill();
	  g_ctx.lineWidth = 2;
	  g_ctx.strokeStyle = this.color;
	  g_ctx.stroke();

	  //draw triangle direction
	  // calc triangle tip point (on circle's circumference);
	  var rAngle= Math.atan2(this.target.y,this.target.x);
	  var x0=this.pos.x+(this.radius+10)*Math.cos(rAngle);
	  var y0=this.pos.y+(this.radius+10)*Math.sin(rAngle);

	  // calc outer side of triangle
	  var tricx=this.pos.x+this.radius*Math.cos(rAngle);
	  var tricy=this.pos.y+this.radius*Math.sin(rAngle);

	  // calc remaining 2 triangle points
	  var x1=tricx+(5)*Math.cos(rAngle-Math.PI/2);
	  var y1=tricy+(5)*Math.sin(rAngle-Math.PI/2);
	  var x2=tricx+(5)*Math.cos(rAngle+Math.PI/2);
	  var y2=tricy+(5)*Math.sin(rAngle+Math.PI/2);

	  g_ctx.beginPath();
	  g_ctx.moveTo(x0,y0);
	  g_ctx.lineTo(x1,y1);
	  g_ctx.lineTo(x2,y2);
	  g_ctx.closePath();

	  g_ctx.fillStyle = this.color;
	  g_ctx.fill();

    if (this.fire){
		console.log(fires);
		sendDataToServer('fire', {
			startX: this.pos.x,
			startY: this.pos.y,
			endX: this.target.x,
			endY: this.target.y,
		});
		this.drawLine(this.pos, this.target);
		console.log("hey");
    }

	  g_ctx.restore();
  }

  applyInput(input){
    //Target
    this.target.x = input.mousePos.x - g_Canvas.halfWidth;
    this.target.y = input.mousePos.y - g_Canvas.halfHeight;
    this.target.normalize();

    //Movement
    this.moveDir.x = 0;
    this.moveDir.y = 0;
    if(input.bitKey & e_Inputs.LEFT)
      this.moveDir.x -= 1;
    if(input.bitKey & e_Inputs.RIGHT)
      this.moveDir.x += 1;
    if(input.bitKey & e_Inputs.UP)
      this.moveDir.y -= 1;
    if(input.bitKey & e_Inputs.DOWN)
      this.moveDir.y += 1;

    this.moveDir.normalize();

    this.fire = (input.bitKey & e_Inputs.MOUSE1);
  }

  move(delta){
	  let speed = this.speed;

	  speed *= (delta/(1000/clientInfo.tickrate));

	  this.pos.x += this.moveDir.x*speed;
	  this.pos.y += this.moveDir.y*speed;

	  sendDataToServer('updatePosition', {
		x: this.pos.x,
		y: this.pos.y
	});
  }

	displace(pos) {
		this.pos.x = pos.x;
		this.pos.y = pos.y;
  	}

}
var g_LocalPlayer = new Player();

let playersArray = [];

for (let i = 0; i < 40; i++) {
	playersArray.push(new Player());
}


//Make Module
var clientInfo = {
	refreshTime:500,

	tick:0,
	currTime:0,
	lastCurrTime:0,
	tickrate:30,
};

$( window ).resize(function() {
	g_Canvas.width = window.innerWidth;
	g_Canvas.height = window.innerHeight;
	g_Canvas.halfWidth = g_Canvas.width >> 1;
	g_Canvas.halfHeight = g_Canvas.height >> 1;
});

window.requestAnimFrame = (function() {
	return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( callback ) {
				window.setTimeout(callback, 1000 / clientInfo.tickrate);
			};
})();

function mainLoop(){
	g_GameLoopHandle = window.requestAnimFrame(mainLoop);
	gameLoop();
}

var nextUpdate = 0;
var g_delta = 0;
function gameLoop(){
	clientInfo.currTime = performance.now();
	g_delta = clientInfo.currTime - clientInfo.lastCurrTime;

	/////////////////////Tick/////////////////////
	if(clientInfo.currTime > nextUpdate){
		clientInfo.tick++;
		nextUpdate = clientInfo.currTime + 1000/ clientInfo.tickrate;
		//TODO: player apply Inputs (mouse down Off...???)

		g_LocalPlayer.applyInput(g_LocalInput.getAndSend());

	  g_LocalCamera.update({x:0,y:0});
	}
	g_LocalPlayer.move(g_delta);

	/////////////////////DRAW/////////////////////
	g_LocalCamera.view();

	//Draw Players enemy
	console.log("other players > ", otherPlayers);
	otherPlayers.forEach((el, index) => {
		// if (el.x && el.y) {
			playersArray[index].displace({x: el.x || 0.5, y: el.y || 0.5});
			playersArray[index].draw();
		// }
	})

	//Draw Player
	g_LocalPlayer.draw();

	g_ctx.font = '18pt Calibri';
	g_ctx.fillStyle = 'white';
	g_ctx.fillText(Math.round(1000/g_delta), -500, -300);

	clientInfo.lastCurrTime = clientInfo.currTime;

	//Draw fires
	fires = fires.filter(fire => {
		if (fire.time + 100 < Date.now())
			return false;
		return true;
	}).map(fire => {
		g_LocalPlayer.drawLine({
			x: fire.startX,
			y: fire.startY
		}, {
			x: fire.endX,
			y: fire.endY
		});
		return fire;
	})
}


/////////////////////SOCKET.IO//////////////////////
socket.on('positions', (data) => {
	// console.log('position from server > ', data);
	otherPlayers = data;
});
socket.on('fire', (data) => {
	const time = Date.now();
	fires.push({
		time,
		...data
	});
});

$(window).trigger('resize');
mainLoop();
