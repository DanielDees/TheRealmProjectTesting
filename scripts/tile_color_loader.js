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
		for (var row = 0; row < MAP_TYPE.length; row++) {
			//Loop through all tiles in row
			for (var col = 0; col < MAP_TYPE[row].length; col++) {
				//Get info from each tile and add to list
				var data = {

					//Location
					X: MAP_TYPE[row][col].X,
					Y: MAP_TYPE[row][col].Y,

					//Color
					mm_color: MAP_TYPE[row][col].mm_color,
				}

				rowData.push(data);
			}

			//Add row of tile colors to list
			MAP_TILE_COLORS.push(rowData);
			//Reset row
			rowData = [];
		}
	};
}