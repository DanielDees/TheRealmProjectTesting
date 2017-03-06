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
	this.speaker = data.speaker;
	this.age = 0;

	//Style
	this.bg = data.bg || false;
	this.color = data.color || "black";

	//Format text to wrap form.
	this.wrapText = function() {

		//Break text into array of words
		var words = this.text.split(' ');
		var line = "";

		//Maximum width that a line can take up
		var maxWidth = this.width - (this.padding * 2);

		//Loop through all words
		for (var i = 0; i < words.length; i++) {
			
			//If line can have another word
			if(ctx.measureText((line + " " + words[i])).width < maxWidth) {

				//Add next word to line
				line += (words[i] + " ");
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
			line = "";
		}

		//Get the height of the textbox
		this.height = this.wrap.length * this.lineheight;
	};

	this.drawBg = function(lineCount) {

		//Background
	    ctx.fillStyle = "#DDDDDD";
	    ctx.fillRect(this.X, this.Y - (lineCount * this.lineheight), this.width, this.height + 8); 

	    //Outline for background
	    ctx.lineWidth = 0.7;
	    ctx.strokeRect(this.X, this.Y - (lineCount * this.lineheight), this.width, this.height + 8);
	}

	//Draw text
	this.draw = function(direction) {

		//Wrap text on initial draw
		if (this.wrap != []) { this.wrapText(); }

		//Draw Background (if there is one)
		if (this.bg) { this.drawBg(this.wrap.length + 1); }

		//Font color
		ctx.fillStyle = this.color;

		//Draw text
		for (var i = 0; i < this.wrap.length; i++) {
			
			//In the case of chat bubble text rises up
			if (this.bg) { ctx.fillText(this.wrap[i], this.X + this.padding, this.Y -(this.wrap.length * this.lineheight) + (i * this.lineheight)); }
			//If text goes down such as in item description
			if (!this.bg) { ctx.fillText(this.wrap[i], this.X + this.padding, this.Y + (i * this.lineheight)); }
		}
	};
}