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
            MAP_TILE_COLORS.push(this.getColor(MAP_TYPE[i][0]));
        }

        //Debug
        console.log(MAP_TILE_COLORS.length + " map tile colors loaded...");
    };

    this.getColor = function(tile) {

        //Grab every 4th pixel's color to average
        var blockSize = 4;

        //Image data
        var data = ctx.getImageData(0, 0, tile.width, tile.height);

        //Pixels in sprite
        var length = data.data.length;

        //Stores color values
        var rgb = { r:0, g:0, b:0 };

        //Number of pixels measured for averaging
        var count = 0;
        
        //Loop through sprite's pixels
        for (var i = 0; i < length; i += (blockSize * 4)) {

            //Check pixel #i 
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];

            count++;
        }

        //Floor the values
        rgb.r = Math.floor((rgb.r / count));
        rgb.g = Math.floor((rgb.g / count));
        rgb.b = Math.floor((rgb.b / count));
        
        //Return RGB value
        return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
    };
}