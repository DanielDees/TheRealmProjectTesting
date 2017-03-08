var mini_map = new Game_mini_map();

function Game_mini_map() {
	
	//Location
	this.X = function() { return FRAME_OF_REFERENCE[0] + canvas.width - 194; };
	this.Y = function() { return FRAME_OF_REFERENCE[1] + 5; };

	//Dimensions
	this.width = 190;
	this.height = 190;

	//Map tiles
	this.map = "No map yet";
	this.tWidth = 9;
	this.tHeight = 9;

	//Color code
	this.playerColor = "blue";
	this.allyColor = "green";
	this.enemyColor = "red";

	this.draw = function() {

	    //Background/Outline for minimap
	    ctx.fillStyle = "#000";
	    ctx.fillRect(this.X() - 1, this.Y() - 1, this.width + 1, this.height + 1);

	    //Returns all map tiles rendered if map is loaded
	    this.map = getRenderedMapTiles();

	    //Loop for the number of is
	    for (var i = 0; i < this.map.length; i++) {
	      //Loop through each tile in i
	      for (var j = 0; j < this.map[i].length; j++) {
	      	ctx.drawImage(this.map[i][j], this.X() + (j * this.tWidth), this.Y() + (i * this.tHeight), this.tWidth, this.tHeight);
	      }
	  	}

	    //Draw player on minimap
	    ctx.fillStyle = this.playerColor;
	    ctx.fillRect(this.X() + (10 * this.tWidth), this.Y() + (10 * this.tHeight), 8, 8);
	};
}