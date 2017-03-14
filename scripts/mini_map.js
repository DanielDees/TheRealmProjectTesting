var mini_map = new Game_mini_map();

function Game_mini_map() {
	
	//Location
	this.X = function() { return FRAME_OF_REFERENCE[0] + canvas.width - 194; };
	this.Y = function() { return FRAME_OF_REFERENCE[1] + 5; };

	//Dimensions
	this.width = 190;
	this.height = 190;

	//Hitbox
	this.top = function() { return this.Y(); }
	this.bottom = function() { return this.Y() + this.height; }
	this.left = function() { return this.X(); }
	this.right = function() { return this.X() + this.width; }

	//Player location (center of mini-map)
	this.playerX = function() { return this.X() + (this.width / 2) - (this.tSize() / 2); };
	this.playerY = function() { return this.Y() + (this.height / 2) - (this.tSize() / 2); };

	//Map tiles
	this.map = "No map yet";

	//Recalculates for map zoom level 
	//Subtract 1 for seamless mini-map, 0 for grid
	this.tSize = function() { return (this.width / this.map.length) / 1; };
	this.tSizeMod = function(X, Y) {

		//Get mod for x/y and dimensions
		var mod = { 
			x: 0, 
			y: 0,
			w: 0, 
			h: 0,
		};

		//Catch left side overflow
		if (X < this.X()) { 

			mod.w = X - this.left();
			mod.x = this.left() - X;
		}
		//Catch right side overflow
		if (X + this.tSize() > this.right()) { 

			mod.w = -(X + this.tSize() - this.right()); 
			mod.x = 0;
		}
		//Catch top side overflow
		if (Y < this.top()) { 

			mod.h = Y - this.top();
			mod.y = this.top() - Y;
		}
		//Catch bottom side overflow
		if (Y + this.tSize() > this.bottom()) { 

			mod.h = -(Y + this.tSize() - this.bottom()); 
			mod.y = 0;
		}

		return mod;
	};

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
		ctx.fillRect(this.playerX(), this.playerY(), this.tSize(), this.tSize());
	}
	//Draw map tiles
	this.drawTiles = function() {

		//For calculating tile locations
		var XYmod = Game_map_generator.tileSize;

		//Loop for the number of rows
		for (var row = 0; row < this.map.length; row++) {
			//Loop through each tile in row
			if (this.map[row]) { 
				for (var col = 0; col < this.map[row].length; col++) {

					//Get x/y relative to player
					var tileX = (this.map[row][col].X - playerList[0].X);
					var tileY = (this.map[row][col].Y - playerList[0].Y);

					//Convert x/y distance to minimap units
					tileX /= (XYmod / this.tSize());
					tileY /= (XYmod / this.tSize());

					//Center on player (in minimap)
					tileX += this.playerX();
					tileY += this.playerY();

					//Tile Color
					ctx.fillStyle = this.map[row][col].mm_color;

					//Remove overflow off minimap
					var tileMod = this.tSizeMod(tileX, tileY);

					//Draw
					ctx.fillRect(tileX + tileMod.x, tileY + tileMod.y, this.tSize() + tileMod.w, this.tSize() + tileMod.h);
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