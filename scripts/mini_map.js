var Game_mini_map = new mini_map();

function mini_map() {
	
	//Location
	this.X = function() { return playerList[0].X + canvas.width - 55; };
	this.Y = function() { return playerList[0].Y - 295; };

	//Dimensions
	this.width = 190;
	this.height = 190;

	//Map tiles
	this.map = [];
	this.tWidth = 9;
	this.tHeight = 9;

	//Color code
	this.playerColor = "blue";
	this.allyColor = "green";
	this.enemyColor = "red";

	this.draw = function() {

	    //MINIMAP
	    ctx.fillStyle = "#000000";
	    ctx.fillRect(this.X(), this.Y(), this.width, this.height);

	    //Returns all map map rendered if map is loaded
	    this.map = getRenderedMapmap();

	    //Loop for the number of rows
	    for (var row = 0; row < this.map.length; row++) {
	      //Loop through each tile in row
	      for (var col = 0; col < this.map[row].length; col++) {
	      	ctx.drawImage(this.map[row][col], this.X() + (col * this.tWidth), this.Y() + (row * this.tHeight), this.tWidth, this.tHeight);
	      }
	  	}

	    //Draw player on minimap
	    ctx.fillStyle = this.playerColor;
	    ctx.fillRect(this.X() + (10 * this.tWidth), this.Y() + (10 * this.tHeight), 8, 8);
	};
}