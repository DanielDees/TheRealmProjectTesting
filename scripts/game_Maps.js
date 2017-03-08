//--------------------------------------------------------------------------------
//This file has everything related to the map's generation and rendering.
//--------------------------------------------------------------------------------

//MAP TYPE is given the value of whichever map is needing to be rendered.
var MAP_TYPE = [];

//These are the game maps that can be loaded.
var REALM_MAP = [];
var BOSS_ROOM_MAP = [];
//var NEXUS_MAP = [];

//How far around the player to load map tiles from.
var MAX_MAP_SIZE = 1000;
var tileSize = 49;
var renderRange = 10 * tileSize;

function resetMap() {

  lootBagList = [];
  portalList = [];
  enemyList = [];
  bulletList = [];
  enemyBulletList = [];
  playerList[0].X = 4000;
  playerList[0].Y = 4000;
  playerList[0].isViewingLoot = [-1, -1];
  REALM_MAP = [];
  BOSS_ROOM_MAP = [];
}
function generateGameMap () {

  //Reset everything. Place players in realm.
  resetMap();
  enemies_remaining_in_realm = 100;

  var completionPercent = 0;
  var nextPercent = 0;

  //Creates a 200x200 Grid.
  for (var row = 0; row < MAX_MAP_SIZE; row++) {
    for (var col = 0; col < MAX_MAP_SIZE; col++) {

      var chance = Math.random() * 10;
      var tileX = col * tileSize;
      var tileY = row * tileSize;
      
      /* 
        Mechanic should work with a modifier to water spawning based on distance from edges of map.
        Maybe add in a lake spawn mechanic sometime later or rivers.
      */
      var elevation = Math.random() * 5;

      //Low elevation creates water.
      //if (elevation < 1) { REALM_MAP.push([waterGround[0] , realCol * tileSize, realRow * tileSize, elevation]); }
      if (chance <= 7) { REALM_MAP.push([grassGround[0] , tileX, tileY, elevation]); }
      else if (chance <= 8) { REALM_MAP.push([grassGround[1] , tileX, tileY, elevation]); }
      else if (chance <= 9) { REALM_MAP.push([grassGround[2] , tileX, tileY, elevation]); }
      else if (chance <= 10) { REALM_MAP.push([grassGround[3] , tileX, tileY, elevation]); };

    };

    completionPercent += (100 / MAX_MAP_SIZE);

    if (completionPercent >= nextPercent) { 

      //console.log("Map is " + completionPercent.toFixed(0) + "% loaded..."); 
      nextPercent += 25; 
    };
  };

  //console.log("Map Size: " + MAX_MAP_SIZE + " x " + MAX_MAP_SIZE);

  MAP_TYPE = REALM_MAP;
}
function generateBossMap () {

  //Reset everything. Place players in boss room.
  resetMap();
  
  var completionPercent = 0;
  var nextPercent = 0;

  var elevation = 10;

  for (var row = 0; row < MAX_MAP_SIZE; row++) {
    for (var col = 0; col < MAX_MAP_SIZE; col++) {
      
      var chance = Math.random() * 10;
      var tileX = col * tileSize;
      var tileY = row * tileSize;
      
      if (chance <= 7) { BOSS_ROOM_MAP.push([stoneGround[0] , tileX, tileY, elevation]); }
      else if (chance <= 8) { BOSS_ROOM_MAP.push([stoneGround[1] , tileX, tileY, elevation]); }
      else if (chance <= 9) { BOSS_ROOM_MAP.push([stoneGround[2] , tileX, tileY, elevation]); }
      else if (chance <= 10) { BOSS_ROOM_MAP.push([stoneGround[3] , tileX, tileY, elevation]); };
    };

    completionPercent += (100 / MAX_MAP_SIZE);

    if (completionPercent >= nextPercent) { 

      //console.log("Map is " + completionPercent.toFixed(0) + "% loaded..."); 
      nextPercent += 25;
    };
  };

  spawn_Game_Boss();

  //console.log("Map Size: " + MAX_MAP_SIZE + " x " + MAX_MAP_SIZE);
  MAP_TYPE = BOSS_ROOM_MAP;
}
function placeWall (row, col) {

  MAP_TILES.push([classSelectionPics[0], col * tileSize, row * tileSize]);
}
function getRenderedMapTiles() {
  
  //Holds all loaded tile data
  var tileData = [];
  var rowTileData = [];

  //Get location for map rendering
  var minX = Math.round(((playerList[0].X - renderRange) / tileSize));
  var maxX = Math.round(((playerList[0].X + renderRange) / tileSize));
  var minY = Math.round(((playerList[0].Y - renderRange) / tileSize));
  var maxY = Math.round(((playerList[0].Y + renderRange) / tileSize)); 

  //Loop through highest to lowest tiles rendered
  for (var i = minY; i <= maxY; i++) { 
    //Loop through left most to right most tiles rendered
    for (var j = minX; j <= maxX; j++) { 
      
      var k = (i * MAX_MAP_SIZE) + j;
    
      try { 
        if (k >= 0 && k < MAP_TYPE.length) { 

          //Add all tiles in row to row data
          rowTileData.push(MAP_TYPE[k][0]);
        } 
      }
      catch (err) { throw err + "\nUnable to find: MAP_TYPE["+k+"]"; };
    };

    //Add row to the loaded tile list
    tileData.push(rowTileData);
    rowTileData = [];
  };

  //Return all loaded tiles
  return tileData;
}
function drawMap () {

  //Get location for map rendering
  var minX = Math.round(((playerList[0].X - renderRange) / tileSize));
  var maxX = Math.round(((playerList[0].X + renderRange) / tileSize));
  var minY = Math.round(((playerList[0].Y - renderRange) / tileSize));
  var maxY = Math.round(((playerList[0].Y + renderRange) / tileSize)); 

  //Loop through highest to lowest tiles rendered
  for (var i = minY; i <= maxY; i++) { 
    //Loop through left most to right most tiles rendered
    for (var j = minX; j <= maxX; j++) { 
      
      //i = the row (each row being MAX_MAP_SIZE in length)
      //j = tiles over that you are.
      var k = (i * MAX_MAP_SIZE) + j;

      try { 
        if (k >= 0 && k < MAP_TYPE.length) { 
          ctx.drawImage(MAP_TYPE[k][0], MAP_TYPE[k][1], MAP_TYPE[k][2], 50, 50); 
        } 
      }
      catch (err) { throw err + "\nUnable to find: MAP_TYPE["+k+"]"; };
    };
  };
}