function textbox(data) {
	
	//Location
	this.X = data.X;
	this.Y = data.Y;

	//Dimensions
	this.height = 0;
	this.lineheight = data.lineheight || 20;
	this.width = data.width || 200;
	this.padding = data.padding || 10;

	//Text
	this.text = data.text;
	this.wrap = [];

	//Info
	this.speaker = data.speaker || "Not sure who said this...";
	this.age = 0;

	//Style
	this.bg = data.bg || false;
	this.global = data.global || false;
	this.color = data.color || "black";
	this.globalColor = data.globalColor || "white";

	//Format text to wrap form.
	this.wrapText = function(input) {

		//Default calculation is for global chat
		if (!input) { input = this.speaker + ": " + this.text; }

		//Break text into array of words
		var words = input.split(' ');
		var line = "";

		//Maximum width that a line can take up
		var maxWidth = this.width - (this.padding * 2);

		//Loop through all words
		for (var i = 0; i < words.length; i++) {
			
			//If line can have another word
			if(ctx.measureText((line + " " + words[i])).width < maxWidth) {

				//Add next word to line
				line += words[i] + " ";
			}
			//If line cannot be added to
			else { 

				this.wrap.push(line); 
				line = words[i] + " "; 
			};
		}
		//Add final line
		if (this.wrap[this.wrap.length -1] != line) { 

			this.wrap.push(line); 
		}

		var longestLine = 0;

		//Find longest line of text.
		for (var i = 0; i < this.wrap.length; i++) {
			if (longestLine < ctx.measureText(this.wrap[i]).width) {
				longestLine = ctx.measureText(this.wrap[i]).width;
			}
		}

		//Get the dimensions of the textbox
		this.height = this.wrap.length * this.lineheight;
		this.width = longestLine + (this.padding * 2);
	};

	this.drawBg = function(line) {

		//If only one line, only cover that section in background
		//Will need to readjust the text bubble based on width of
		//the text before implementing
		//if (this.wrap.length == 1) { this.width = ctx.measureText(this.wrap).width + (this.padding * 2) - 3; }

		//Background
		ctx.strokeStyle = "#000";
	    ctx.fillStyle = "#DDDDDD";
	    ctx.fillRect(this.X - (this.width / 2), this.Y - (line * this.lineheight), this.width, this.height + 8); 

	    //Outline for background
	    ctx.lineWidth = 0.7;
	    ctx.strokeRect(this.X - (this.width / 2), this.Y - (line * this.lineheight), this.width, this.height + 8);
	}

	//Draw text
	this.draw = function(direction) {

		//If in global chat, include speaker name length for proper height calculation
		if (this.global) { this.wrapText(); }

		//Wrap text on initial draw
		if (!this.global) { this.wrapText(this.text); }

		//Draw Background (if there is one)
		if (this.bg) { this.drawBg(this.wrap.length + 1); }

		//Font color
		if (!this.global) { ctx.fillStyle = this.color; }
		if (this.global) { ctx.fillStyle = this.globalColor; }

		//Draw text
		for (var i = 0; i < this.wrap.length; i++) {
			
			//In the case of chat bubble text rises up
			if (this.bg) { ctx.fillText(this.wrap[i], this.X + this.padding - (this.width / 2), this.Y -(this.wrap.length * this.lineheight) + (i * this.lineheight)); }
			//If text goes down such as in item description
			if (!this.bg) { ctx.fillText(this.wrap[i], this.X + this.padding, this.Y + (i * this.lineheight)); }
		}
	};
}