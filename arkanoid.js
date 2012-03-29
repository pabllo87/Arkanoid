function checkSupported(){
    canvas = document.getElementById('canvas');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        init();       
    } else {
        alert ("We're sorry, but your browser does not support the canvas tag. Please use any web browser other than Internet Explorer.");
    }
}

var x = 150;
var y = 150;
var dx = 2;
var dy = 4;
var WIDTH;
var HEIGHT;
var paddlex;
var paddleh;
var paddlew;
var intervalId = 0;
var rightDown = false;
var leftDown = false;
var canvasMinX = 0;
var canvasMaxX = 0;
var bricks;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;
var ballr = 10;
var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
var paddlecolor = "#FFFFFF";
var ballcolor = "#FFFFFF";
var backcolor = "#000000";

function init(){
	WIDTH = $("#canvas").width();
	HEIGHT = $("#canvas").height();
	canvasMinX = $("#canvas").offset().left;
	canvasMaxX = canvasMinX + WIDTH;
	intervalId = setInterval(draw, 10);
	init_paddle();
	initbricks();
	return intervalId;
}

function circle(x,y,r){
	ctx.beginPath();
	ctx.arc(x,y,r,0,Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

function rect(x,y,w,h){
	ctx.beginPath();
	ctx.rect(x,y,w,h);
	ctx.closePath();
	ctx.fill();
}

function clear(){
	ctx.clearRect(0,0,WIDTH,HEIGHT);
	rect(0,0,WIDTH,HEIGHT);
}

function init_paddle(){
	paddlex = WIDTH / 2;
	paddleh = 10;
	paddlew = 75;
}

function onKeyDown(evt){
	if (evt.keyCode == 39) rightDown = true;
	else if (evt.keyCode == 37) leftDown = true;
}

function onKeyUp(evt){
	if (evt.keyCode == 39) rightDown = false;
	else if (evt.keyCode == 37) leftDown = false;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function onMoudeMove(evt){
	if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX){
		paddlex = evt.pageX - canvasMinX;
	}
}

$(document).mousemove(onMoudeMove);

function initbricks(){
	NROWS = 5;
	NCOLS = 5;
	BRICKWIDTH = (WIDTH/NCOLS) - 1;
	BRICKHEIGHT = 15;
	PADDING = 1;
	
	bricks = new Array(NROWS);
	for (i=0; i < NROWS; i++){
		bricks[i] = new Array(NCOLS);
		for (j=0; j < NCOLS; j++){
			bricks[i][j] = 1;
		}
	}
}

function drawbricks(){
	for (i=0; i < NROWS; i++){
		ctx.fillStyle = rowcolors[i];
		for (j=0; j < NCOLS; j++){
			if (bricks[i][j] == 1){
				rect((j * (BRICKWIDTH + PADDING)) + PADDING,
					 (i * (BRICKHEIGHT + PADDING)) + PADDING,
					 BRICKWIDTH, BRICKHEIGHT);
			}
		}
	}
}

function draw(){
	ctx.fillStyle = backcolor;
	clear();
	ctx.fillStyle = ballcolor;
	circle(x,y, 10);
	
	if (rightDown) paddlex += 5;
	else if (leftDown) paddlex -= 5;
	ctx.fillStyle = paddlecolor;
	rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);
	
	drawbricks();
	
	rowheight = BRICKHEIGHT + PADDING;
	colwidth = BRICKWIDTH + PADDING;
	row = Math.floor(y/rowheight);
	col = Math.floor(x/colwidth);
	
	if (y < NROWS * rowheight && row >= 0 && bricks[row][col] == 1){
		dy = -dy;
		bricks[row][col] = 0;
	}
	
	if (x + dx > WIDTH || x + dx < 0)
		dx = -dx;
	
	if (y + dy < 0)
		dy = -dy;
	else if (y + dy > HEIGHT){
		if (x > paddlex && x < paddlex + paddlew)
			dy = -dy;
		else
			clearInterval(intervalId);
	}
	
	x += dx;
	y += dy;
}