
/* 

	The Text Container is meant to be a function 
		that automatically formats text to fit
		within a box of any spefified size.

	When working properly the Text Container should:
		1. Auto Wrap text exceeding the box's bounds.
		2. Display text on a background.
		3. Be customizable (text-color, bg-color, height, width, etc...).

*/

function textContainer(data) {
	
	//Location
	this.X = data.X;
	this.Y = data.Y;

	//Dimensions
	this.height = data.height || -280;
	this.width = data.width || -200;

	//Text
	this.text = data.text;

	//Style
	this.textColor = data.textColor;
	this.bgColor = data.bgColor;
	this.font = data.font;

	//Format text to wrapped form.
	this.wrapText = function() {


	}

	//Draw
	this.draw = function() {


	};
}