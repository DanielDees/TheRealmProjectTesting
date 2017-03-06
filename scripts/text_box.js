function textbox(data) {
	
	//Location
	this.X = data.X;
	this.Y = data.Y;

	//Dimensions
	this.height = data.height || 280;
	this.width = data.width || 200;
	this.padding = data.padding || 10;

	//Text
	this.text = data.text;
	this.wrap = [];

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
	};

	//Draw text
	this.draw = function() {

		//Wrap text on initial draw
		if (this.wrap != []) { this.wrapText(); }

		for (var i = 0; i < this.wrap.length; i++) {
			
			ctx.fillText(this.wrap[i], this.X + this.padding, this.Y + (i * 20));
		}
	};
}