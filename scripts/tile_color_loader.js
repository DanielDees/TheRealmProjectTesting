//Stores the rgb values for all tiles in map
var MAP_TILE_COLORS = [];

map_tile_color_loader = new Game_map_tile_color_loader();

//Grabs the average color of a sprite and returns the RGB value for it.
function Game_map_tile_color_loader() {
	
	this.load = function() {

		//Empty old color values
		MAP_TILE_COLORS = [];

		var rowData = [];

		//Loop through all rows on map
		for (var i = 0; i < MAP_TYPE.length; i++) {
			//Loop through all tiles in row
			for (var j = 0; j < MAP_TYPE[i].length; j++) {
				//Get color from each tile and add to list
				rowData.push(MAP_TYPE[i][j].mm_color);
			}

			//Add row of tile colors to list
			MAP_TILE_COLORS.push(rowData);
			//Reset row
			rowData = [];
		}
	};
}