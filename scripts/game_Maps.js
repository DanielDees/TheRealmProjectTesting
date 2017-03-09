//--------------------------------------------------------------------------------
//This file has everything related to the map's generation and rendering.
//--------------------------------------------------------------------------------

//MAP TYPE is given the value of whichever map is needing to be rendered.
var MAP_TYPE = [];

//These are the game maps that can be loaded.
var REALM_MAP = [];
var BOSS_ROOM_MAP = [];
//var NEXUS_MAP = [];

var Game_map_generator = new Game_map_loader();

function Game_map_loader() {

  //Map X/Y length in tiles
  this.MAX_SIZE = 100;
  this.tileSize = 49;

  //Load all tiles within this range  of player
  this.renderRange = 10 * this.tileSize;

  //Clears all map, enemy, projectile, loot, and portal data.
  //Resets player to default X/Y
  this.reset = function() {

    lootBagList = [];
    portalList = [];
    enemyList = [];
    bulletList = [];
    enemyBulletList = [];
    playerList[0].X = 4000;
    playerList[0].Y = 4000;
    playerList[0].isViewingLoot = [-1, -1];
    MAP_TYPE = [];
    REALM_MAP = [];
    BOSS_ROOM_MAP = [];
  };
  //Generates the game REALM maps
  this.generateGameMap = function() {

    //Reset everything. Place players in realm.
    this.reset();

    //Number of enemies that will spawn
    enemies_remaining_in_realm = 100;

    //Creates the map grid.
    for (var row = 0; row < this.MAX_SIZE; row++) {
      for (var col = 0; col < this.MAX_SIZE; col++) {

        //Tile Data
        var data = {

          //Location
          X: this.tileSize * col,
          Y: this.tileSize * row,

          //Info
          img: waterGround[0],
          mm_color: "white",
        }

        //RNG 0 - 1
        var chance = Math.random();

        //Get tile sprite
             if (chance <= 0.7) { data.img = grassGround[0]; }
        else if (chance <= 0.8) { data.img = grassGround[1]; }
        else if (chance <= 0.9) { data.img = grassGround[2]; }
        else if (chance <= 1.0) { data.img = grassGround[3]; };

        //Mini-map color is the same for all grassGround tiles
        data.mm_color = 'rgb(' + 3 + ',' + 126 + ',' + 31 + ')';

        //Add tile to map
        REALM_MAP.push(data); 
      };
    };

    //Use REALM_MAP for rendering
    MAP_TYPE = REALM_MAP;

    //Get tile colors for mini-map
    map_tile_color_loader.load();
  };
  //Generates the BOSS map
  this.generateBossMap = function() {

    //Reset everything. Place players in boss room.
    this.reset();

    //Creates the map grid.
    for (var row = 0; row < this.MAX_SIZE; row++) {
      for (var col = 0; col < this.MAX_SIZE; col++) {

        //Tile Data
        var data = {

          //Location
          X: this.tileSize * col,
          Y: this.tileSize * row,

          //Info
          img: waterGround[0],
          mm_color: "white",
        }

        //RNG 0 - 1
        var chance = Math.random();
        
        //Get tile sprite
             if (chance <= 0.7) { data.img = stoneGround[0]; }
        else if (chance <= 0.8) { data.img = stoneGround[1]; }
        else if (chance <= 0.9) { data.img = stoneGround[2]; }
        else if (chance <= 1.0) { data.img = stoneGround[3]; };

        //Mini-map color is the same for all grassGround tiles
        data.mm_color = 'rgb(' + 167 + ',' + 185 + ',' + 185 + ')';

        //Add tile to map
        BOSS_ROOM_MAP.push(data); 
      };
    };

    //Spawn Boss
    spawn_Game_Boss();

    //Use BOSS_ROOM_MAP for rendering
    MAP_TYPE = BOSS_ROOM_MAP;

    //Get tile colors for mini-map
    map_tile_color_loader.load();
  };
  //Un-used for now, may make dungeon generator file later
  this.placeWall = function(row, col) {
    
    MAP_TILES.push([waterGround[0], col * this.tileSize, row * this.tileSize]);
  };
  //Gets tile colors for mini-map
  this.getRenderedTiles = function() {

    //Holds all loaded tile data
    var tileData = [];
    var rowTileData = [];

    //Get location for map rendering
    var minX = Math.round(((playerList[0].X - this.renderRange) / this.tileSize));
    var maxX = Math.round(((playerList[0].X + this.renderRange) / this.tileSize));
    var minY = Math.round(((playerList[0].Y - this.renderRange) / this.tileSize));
    var maxY = Math.round(((playerList[0].Y + this.renderRange) / this.tileSize)); 

    //Loop through highest to lowest tiles rendered
    for (var i = minY; i <= maxY; i++) { 
      //Loop through left most to right most tiles rendered
      for (var j = minX; j <= maxX; j++) { 

        //i = the row (each row being this.MAX_SIZE in length)
        //j = tiles over that you are.
        var tileNum = (i * this.MAX_SIZE) + j;

        try { 
          if (tileNum >= 0 && tileNum < MAP_TYPE.length) {

            //Add tile color to row data for minimap
            rowTileData.push(MAP_TILE_COLORS[tileNum]);
          } 
        }
        catch (err) { throw err + "\nUnable to find: MAP_TYPE[" + tileNum + "]"; };
      };

      //Add row to the loaded tile list
      tileData.push(rowTileData);
      //Reset the row
      rowTileData = [];
    };

    //Return all loaded tile colors
    return tileData;
  };
  //Renders all tiles within range of the player
  this.draw = function() {

    //Get location for map rendering
    var minX = Math.round(((playerList[0].X - this.renderRange) / this.tileSize));
    var maxX = Math.round(((playerList[0].X + this.renderRange) / this.tileSize));
    var minY = Math.round(((playerList[0].Y - this.renderRange) / this.tileSize));
    var maxY = Math.round(((playerList[0].Y + this.renderRange) / this.tileSize)); 

    //Loop through highest to lowest tiles rendered
    for (var i = minY; i <= maxY; i++) { 
      //Loop through left most to right most tiles rendered
      for (var j = minX; j <= maxX; j++) { 

        //i * this.MAX_SIZE = the row
        //j = column of row
        var k = (i * this.MAX_SIZE) + j;

        try { 
          if (k >= 0 && k < MAP_TYPE.length) { 
            //Draw tile images for map
            ctx.drawImage(MAP_TYPE[k].img, MAP_TYPE[k].X, MAP_TYPE[k].Y, 50, 50); 
          } 
        }
        catch (err) { throw err + "\nUnable to find: MAP_TYPE["+k+"]"; };
      };
    };
  };
}