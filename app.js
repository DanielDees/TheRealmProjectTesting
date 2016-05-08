//====================
//Start of app.js file
//====================

//The HTML5 Canvas element
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var GAME_FPS = 60;


function draw () {}
function move () {}
function runGame () {

	//Clears screen before repaint
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//Always move before drawing.
	move();

	//Draw Everything to screen
	draw();
}

var draw = setInterval(runGame, (1000 / GAME_FPS));

//==================
//End of app.js file
//==================