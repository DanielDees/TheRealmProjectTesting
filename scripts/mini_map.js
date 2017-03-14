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
	this.tSize = function() { return (this.width / (this.map.length  - 1)) / 1; };

	//Modify tile overflow on minimap
	this.tSizeMod = function(X, Y) {

		//Get mod for x/y and dimensions
		var mod = { 
			X: 0, 
			Y: 0,
			W: 0, 
			H: 0,
		};

		//Catch left side overflow
		if (X < this.X()) { 

			mod.W = X - this.left();
			mod.X = this.left() - X;
		}
		//Catch right side overflow
		if (X + this.tSize() > this.right()) { 

			mod.W = -(X + this.tSize() - this.right()); 
			mod.X = 0;
		}
		//Catch top side overflow
		if (Y < this.top()) { 

			mod.H = Y - this.top();
			mod.Y = this.top() - Y;
		}
		//Catch bottom side overflow
		if (Y + this.tSize() > this.bottom()) { 

			mod.H = -(Y + this.tSize() - this.bottom()); 
			mod.Y = 0;
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
	this.getMiniMapPosition = function(X, Y) {

		//For converting X/Y units
		var mod = Game_map_generator.tileSize;

		//Store x/y
		var pos = { X: 0, Y: 0, };

		//Get x/y relative to player
		pos.X = (X - playerList[0].X);
		pos.Y = (Y - playerList[0].Y);

		//Convert x/y distance to minimap units
		pos.X /= (mod / this.tSize());
		pos.Y /= (mod / this.tSize());

		//Center on player (in minimap)
		pos.X += this.playerX();
		pos.Y += this.playerY();

		//Return mini-map X/Y
		return pos;
	}
	//Draw player
	this.drawPlayer = function() {

		//Draw player on minimap
		ctx.fillStyle = this.playerColor;
		ctx.fillRect(this.playerX(), this.playerY(), this.tSize(), this.tSize());
	}
	this.drawEnemies = function() {

		//Draw enemies on minimap
		ctx.fillStyle = this.enemyColor;

		//Check all enemies
		for (var i = 0; i < enemyList.length; i++) {

			//Modify X/Y values
			var pos = this.getMiniMapPosition(enemyList[i].X, enemyList[i].Y);

			//Remove overflow
			var mod = this.tSizeMod(pos.X, pos.Y);

			//Don't load off-minimap enemies
			if (pos.X + this.tSize() < this.left() || 
				pos.X > this.right() || 
				pos.Y + this.tSize() < this.top() || 
				pos.Y > this.bottom()) { continue; };

			//Draw
			ctx.fillRect(pos.X + mod.X, pos.Y + mod.Y, this.tSize() + mod.W, this.tSize() + mod.H);
		}
	}
	//Draw map tiles
	this.drawTiles = function() {

		//Loop for the number of rows
		for (var row = 0; row < this.map.length; row++) {
			//Loop through each tile in row
			if (this.map[row]) { 
				for (var col = 0; col < this.map[row].length; col++) {

					//Modify X/Y values
					var pos = this.getMiniMapPosition(this.map[row][col].X, this.map[row][col].Y);

					//Remove overflow
					var mod = this.tSizeMod(pos.X, pos.Y);

					//Tile Color
					ctx.fillStyle = this.map[row][col].mm_color;

					//Draw
					ctx.fillRect(pos.X + mod.X, pos.Y + mod.Y, this.tSize() + mod.W, this.tSize() + mod.H);
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

		//Draw enemies
		this.drawEnemies();

		//Draw player
		this.drawPlayer();
	};
}