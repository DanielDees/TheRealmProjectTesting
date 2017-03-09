//Stores the rgb values for all tiles in map
var MAP_TILE_COLORS = [];

map_tile_color_loader = new Game_map_tile_color_loader();

//Grabs the average color of a sprite and returns the RGB value for it.
function Game_map_tile_color_loader() {
	
    this.load = function() {

        //Empty old color values
        MAP_TILE_COLORS = [];

        //Loop through all tiles on map
        for (var i = 0; i < MAP_TYPE.length; i++) {
            //Get color from each tile and add to list
            MAP_TILE_COLORS.push(MAP_TYPE[i].mm_color);
        }

        //Debug
        console.log(MAP_TILE_COLORS.length + " map tile colors loaded...");
    };
}