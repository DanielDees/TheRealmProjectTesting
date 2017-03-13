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

	//Recalculates for map zoom level 
	//Subtract 1 for seamless mini-map, 0 for grid
	this.tSize = function() { return (this.width - 0) / this.map.length; };

	//Color code
	this.playerColor = "blue";
	this.allyColor = "green";
	this.enemyColor = "red";

	//Load minimap tiles
	this.loadTiles = function() {

		//Returns all map tiles rendered if map is loaded
		this.map = Game_map_generator.getRenderedTiles();
	}
	//Draw the background/outline.
	this.drawBg = function() {

		//Background/Outline for minimap
		ctx.fillStyle = "#222";
		ctx.fillRect(this.X() - 1, this.Y() - 1, this.width + 1, this.height + 1);
	}
	//Draw player
	this.drawPlayer = function() {

		//Draw player on minimap
		ctx.fillStyle = this.playerColor;
		ctx.fillRect(this.X() + (10 * this.tSize()), this.Y() + (10 * this.tSize()), 8, 8);
	}
	//Draw map tiles
	this.drawTiles = function() {

		/*
			minimap X/Y, width, height

			playerX/Y = minimap center.
			tiles x/y = actual tile positions
			if tile x/y is within renderrange but < minimap X/Y but finishes rendering > minimap X/Y
			then divide width by amount overflowing off minimap and render.

			player rendered on top of that.
			player should be triangle pointing up.

		*/
/*
		var center = {

			X: playerList[0].X,
			Y: playerList[0].Y,
		};

		var tile = {

			X: function(col) { return this.X() + ((col * Game_map_generator.tileSize) * this.tSize()); }
		} */

		//Loop for the number of rows
		for (var row = 0; row < this.map.length; row++) {
			//Loop through each tile in row
			if (this.map[row]) { 
				for (var col = 0; col < this.map[row].length; col++) {
					ctx.fillStyle = this.map[row][col].mm_color;
					ctx.fillRect(this.X() + (col * this.tSize()), this.Y() + (row * this.tSize()), this.tSize(), this.tSize());
				}
			}
		}
	}
	//Draw minimap
	this.draw = function() {

		//Get Minimap tiles
		this.loadTiles();

		//Draw background
		this.drawBg();

		//Draw tiles
		this.drawTiles();

		//Draw player
		this.drawPlayer();
	};
}