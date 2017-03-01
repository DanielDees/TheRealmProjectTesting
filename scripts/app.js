//VERSION INFO
var versionInfo = "Version 1.2.D";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//For image sharpness
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false; /// future

//Re-implement when you remove spacing between map tiles.
document.getElementById("myCanvas").style.background = "url('sprites/groundTiles/oldStoneFloor.png') repeat";
document.getElementById("myCanvas").style.backgroundSize = "50px";
var backgroundPos = [0, 0];
var GAME_FPS = 60;
var whichSlot = "None";
//Location screen renders at top left.
var FRAME_OF_REFERENCE = [0, 0];
//Selects random user name.
var defaultNamesList = ["Yammo", "Mish", "Netuno", "Pridon", "Kamini", "Ellil", "Zanoo", "Nin", "Noroen", "Vypio", "Terg", "Rarmom", "Tsang", "Oitzo", "Oopu", "Oorbo", "Asham", "Iti", "Tish", "Scell", "Er", "Othvo", "Yivoo", "Glaspio", "Luoten", "Zythe"];
//Portals
var portalList = [];
//Player(s)
var playerList = [new player()];
//Enemies
var enemies_remaining_in_realm = 100;
var enemyList = [];
//Projectiles
var bulletList = [];
var enemyBulletList = [];
//Loot
var lootBagList = [];
//Screen

//Change to switch-case object. Pseudo-code ahead.
/*

var screenType = {
  
  location: MAIN_MENU,

  render: function() {
  
    switch:

      case MAIN_MENU:
        drawMainMenu();
        break;

      case BOSS_SCREEN:
        drawBossScreen();
        break;

      etc...
  }
}

Another possibility is to have a list of screentypes
and just render whichever ones are true

var screenType = {
  
  MAIN_MENU:    true,
  GAME_MAP:     false,
  BOSS_ROOM:    false,
  OPTIONS:      false,
  INSTRUCTIONS: false,
  CHAR_SELECT:  false,
}

*/
var screenType = "MAIN_MENU";

//DRAW STUFF =====================
function displayLootBags() {

  for (var i = 0; i < lootBagList.length; i++) {
    
    lootBagList[i].draw();

    if (lootBagList[i].inventory.length < 1 || lootBagList[i].lifeTime < 1) { 

      lootBagList.splice(i, 1); 
    }
  }
}
function displayItemDrops () {

  //Display items in loot bag being stood over.
  for (var i = 0; i < lootBagList.length; i++) {

    //Only allows one loot bag to be seen at a time. No overlapping loot bags. If viewing loot, only view i.
    if (hitboxIntersectCheck(playerList[0], lootBagList[i]) && (playerList[0].isViewingLoot[0] == -1 || playerList[0].isViewingLoot[0] == i)) {
      
      playerList[0].isViewingLoot[0] = i;
      lootBagList[i].drawInventory();
    }
    else if ((!hitboxIntersectCheck(playerList[0], lootBagList[i]) && playerList[0].isViewingLoot[0] == i) || playerList[0].isViewingLoot[0] >= lootBagList.length) {

      playerList[0].isViewingLoot[0] = -1;
    }
  }
  //Reset if no loot bags.
  if (lootBagList.length == 0) { playerList[0].isViewingLoot[0] = -1; }
}
function drawPortals () {

  for (var i = 0; i < portalList.length; i++) { portalList[i].draw(); }
}
function drawPortalEntryButton() {

  for (var i = 0; i < portalList.length; i++) { portalList[i].drawButton(); }
}
//SIDE-BAR DISPLAY ===============
function displayStats () {

  //Top left of player screen
  var absX = playerList[0].X - 250;
  var absY = playerList[0].Y - 300;

  //Lines for box of displaying stats
  ctx.fillStyle = "#000";
  ctx.fillRect(canvas.width - 200 + absX, 0 + absY, 2, canvas.height);
  ctx.fillStyle = "#333";
  ctx.fillRect(canvas.width - 198  + absX, 0 + absY, 198, canvas.height);

  //MINIMAP
  ctx.fillStyle = "#000000";
  ctx.fillRect(canvas.width - 195  + absX, 5 + absY, 190, 190);

  //Stats
  ctx.fillStyle = "Orange";
  ctx.shadowBlur = 3;
  ctx.fillText("Glory: " + playerList[0].deathGlory, canvas.width - 275  + absX, 20 + absY);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#BBB";
  ctx.fillText("Name: " + playerList[0].name, canvas.width - 190  + absX, 212 + absY);
  ctx.fillText("Level: " + playerList[0].level, canvas.width - 190  + absX, 230 + absY);
  ctx.font = "14px black Palatino";
  ctx.fillText("Attack: " + playerList[0].damage, canvas.width - 185  + absX, 320 + absY);
  ctx.fillText("Speed: " + playerList[0].speed.toFixed(0), canvas.width - 95  + absX, 320 + absY);
  ctx.fillText("Wizardry: " + playerList[0].wizardry, canvas.width - 185  + absX, 340 + absY);
  ctx.fillText("Dexterity: " + playerList[0].dexterity, canvas.width - 95  + absX, 340 + absY);
  ctx.fillText("Youth: " + playerList[0].youth, canvas.width - 185 + absX, 360 + absY);

  drawDebugInfo(absX, absY);

  ctx.font = "18px Palatino";

  drawExpBar();
  drawHpBar();
  drawManaBar();
}
function drawExpBar() {

  var data = {

    X: function() { return canvas.width + playerList[0].X - 440; },
    Y: function() { return playerList[0].Y - 60; },

    textX: function() { return canvas.width + playerList[0].X - 390; },
    textY: function() { return playerList[0].Y - 44; },

    width: 175,
    height: 18,

    bgColor: function() { return "grey" },
    barColor: function() {

      //Exp Bar
      if (playerList[0].level < playerList[0].MAX_level) { return "#0A0"; }

      //Glory Bar
      else { return "orange"; }
    },

    min: function() { 

      playerList[0].glory = playerList[0].EXP / 2000;

      //Exp Bar
      if (playerList[0].level < playerList[0].MAX_level) { return playerList[0].EXP; }

      //Glory Bar
      else { return playerList[0].glory.toFixed(0); }
    },
    max: function() { 

      playerList[0].glory = playerList[0].EXP / 2000;

      //Exp Bar
      if (playerList[0].level < playerList[0].MAX_level) { return playerList[0].levelExpReq; }

      //Glory Bar
      else { return playerList[0].glory.toFixed(0); }
    },
  }

  var expBar = new progressBar(data);
  expBar.draw();
}
function drawHpBar () {

  var data = {

    X: function() { return canvas.width + playerList[0].X - 440; },
    Y: function() { return playerList[0].Y - 40; },

    textX: function() { return canvas.width + playerList[0].X - 390; },
    textY: function() { return playerList[0].Y - 24; },

    width: 175,
    height: 18,

    bgColor: function() { return "grey"; },
    barColor: function() { return "#CD3333"; },

    min: function() { return playerList[0].HP.toFixed(0); },
    max: function() { return playerList[0].MAX_HP.toFixed(0); },
  }

  var hpBar = new progressBar(data);
  hpBar.draw();
}
function drawManaBar () {

  var data = {

    X: function() { return canvas.width + playerList[0].X - 440; },
    Y: function() { return playerList[0].Y - 20; },

    textX: function() { return canvas.width + playerList[0].X - 390; },
    textY: function() { return playerList[0].Y - 4; },

    width: 175,
    height: 18,

    bgColor: function() { return "grey"; },
    barColor: function() { return "#05C"; },

    min: function() { return playerList[0].MP.toFixed(0); },
    max: function() { return playerList[0].MAX_MP.toFixed(0); },
  }

  var manaBar = new progressBar(data);
  manaBar.draw();
}
// END SIDE-BAR DISPLAY ==========
function drawPlayer () {

  for (var i = 0; i < playerList.length; i++) { playerList[i].draw(); }
}
function drawPlayerBullet() {

  for (var i = 0; i < bulletList.length; i++) { bulletList[i].draw(); }
}
function drawPlayerInventory () {

  playerList[0].drawInventory();
}
function drawEnemy () {

  for (var i = 0; i < enemyList.length; i++) { enemyList[i].draw(); }
}
function drawEnemyBullet () {

  for (var i = 0; i < enemyBulletList.length; i++) { enemyBulletList[i].draw(); }
}
function showDamageTaken () {
  
  ctx.font = "16px Palatino";

  //Enemy Damage Numbers
  for (var i = 0; i < enemyList.length; i++) { enemyList[i].showDamageNumbers(); }
  //Player Damage Numbers
  for (var i = 0; i < playerList.length; i++) { playerList[i].showDamageNumbers(); }
}
//END DRAWING STUFF ==============
//MOVE STUFF =====================
function movePlayer () {

  for (var i = 0; i < playerList.length; i++) { playerList[i].move(); }

    //Updates sprites.
    var maxTime = 30;
    playerList[0].timeToSpriteChange++;
    if (playerList[0].timeToSpriteChange >= maxTime * 2) { 

      playerList[0].timeToSpriteChange = 0;
    }
   if (!keys.ENTER) {
    //Movement
    if (keys.W) { 
      if (playerList[0].timeToSpriteChange >= maxTime) {

        playerList[0].Image = playerList[0].ImageArray[2][1];
      } 
      else {

        playerList[0].Image = playerList[0].ImageArray[2][2];
      }
    }
    if (keys.A) { 
      if (playerList[0].timeToSpriteChange >= maxTime) {

        playerList[0].Image = playerList[0].ImageArray[1][1];
      } 
      else {

        playerList[0].Image = playerList[0].ImageArray[1][2];
      }
    }
    if (keys.S) { 
      if (playerList[0].timeToSpriteChange >= maxTime) {

        playerList[0].Image = playerList[0].ImageArray[3][1];
      } 
      else {

        playerList[0].Image = playerList[0].ImageArray[3][2];
      }
    }
    if (keys.D) { 
      if (playerList[0].timeToSpriteChange >= maxTime) {

        playerList[0].Image = playerList[0].ImageArray[0][1];
      } 
      else {

        playerList[0].Image = playerList[0].ImageArray[0][2];
      }
    }
  }
}      
function moveEnemy () {

  for (var i = 0; i < enemyList.length; i++) { enemyList[i].move(); }
}
function movePlayerBullet () {

  for (var i = 0; i < bulletList.length; i++) {
    
    bulletList[i].move();

    if (bulletList[i].lifeTime <= 0) { bulletList.splice(i, 1); }
  }
}
function moveEnemyBullet () {

  for (var i = 0; i < enemyBulletList.length; i++) { enemyBulletList[i].move(); }
}
function backgroundScrollingScene() {

  backgroundPos[0] -= 0.2;
  backgroundPos[1] -= 0.2;
  document.getElementById("myCanvas").style.backgroundPosition = backgroundPos[0] + "px " + backgroundPos[1] + "px";     
}
function replenishPlayerStats () {

  if (playerList[0].EXP >= playerList[0].levelExpReq) { playerList[0].levelUP(); }
  if (playerList[0].MP < playerList[0].MAX_MP) { playerList[0].MP += (0.001 * playerList[0].wizardry); }
  if (playerList[0].HP < playerList[0].MAX_HP) { playerList[0].HP += (0.0015 * playerList[0].youth); }
  if (playerList[0].weaponCooldown > 0) { playerList[0].weaponCooldown--; }
  if (playerList[0].specialCooldown > 0) { playerList[0].specialCooldown--; }

  for (var i = 0; i < enemyList.length; i++) { enemyList[i].weaponCooldown--; }

  if (enemyList.length > 0) { 
    for (var i = 0; i < enemyList.length; i++) {
      if (enemyList[i].weaponCooldown <= 0) { enemyList[i].fireWeapon(); }
    }
  }
}
//END MOVE STUFF =================
//COLLISIONS =====================
function checkCollisions () {

  //Player bullets
  for (var i = 0; i < bulletList.length; i++) {
    //Enemies
    for (var j = 0; j < enemyList.length; j++) {
      //On Collision
      if (i >= 0 && hitboxIntersectCheck(bulletList[i], enemyList[j])) {

        enemyList[j].takeDamage(bulletList[i].damage);
        bulletList.splice(i, 1);
        i--;
        
        if (enemyList[j].HP < 1) { 

          enemyList[j].dropLoot();
          enemyList.splice(j, 1);
          enemies_remaining_in_realm--;
          j--;
        }
      }
    }
  }
  //Enemy Bullets
  for (var i= 0; i < enemyBulletList.length; i++) {
    //Players
    for (var j = 0; j < playerList.length; j++) {
      //On Collision
      if (i >= 0 && hitboxIntersectCheck(enemyBulletList[i], playerList[j])) {

        playerList[j].takeDamage(enemyBulletList[i].damage);
        enemyBulletList.splice(i, 1);
        i--;

        if (playerList[j].HP <= 0) { playerList[j].deathScene(enemyBulletList[i].owner); }
      }
    }
  }
}
//END COLLISIONS =================
//RANDOM TOOLS
function hitboxIntersectCheck (a, b) {

  //If error, ensure items have this.height / this.width.
  if (a.bottom() > b.top() && a.top() < b.bottom() && a.left() < b.right() && a.right() > b.left()) {

    return true;
  }

  return false;
}
function mouseIsTouching (item) {

  //If error, ensure items have this.height / this.width.
  try {
    if (mouse.Y < item.bottom() && mouse.Y > item.top() && mouse.X > item.left() && mouse.X < item.right()) {

      return true;
    }
  }
  catch (err) { throw "mouseIsTouching() can't evaluate: " + item; }

  return false;
}
function drawItemDescription (myThingy) {

  if (mouseIsTouching(myThingy)) {

    //Box
    ctx.fillStyle = "#AAA";
    ctx.fillRect(mouse.X, mouse.Y, -200, -280);
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 3;
    ctx.strokeRect(mouse.X, mouse.Y, -200, -280);

    //Text
    ctx.fillStyle = "#111";
    ctx.fillText(myThingy.itemName, mouse.X - 190, mouse.Y - 260);
    ctx.font = "14px Palatino";
    ctx.fillText(myThingy.itemEffectText, mouse.X - 190, mouse.Y - 230);
    ctx.fillText(myThingy.itemDescription, mouse.X - 190, mouse.Y - 200);
  }
}
function isEqualTo () {

  //Check if item is not equal to any other being passed.
  for (var i = 1; i < arguments.length; i++) {

    if (arguments[0] == arguments[i]) { return true; }
  }

  return false;
}
var lastKnownLocation = [playerList[0].X, playerList[0].isViewingLoot];

function placeButtonHere (text, X, Y, screenTypeGiven, font, buttonColor, functionToPerform) {

  //Ctx.save/restore can bug out buttons (no frame_of_reference check).

  ctx.font = font;
  //Adjust hitbox for size of text.
  var width = ctx.measureText(text).width + 15;
  var height = parseInt(font) + 10;
  var textHeight = parseInt(font);
  ctx.fillStyle = buttonColor;
  ctx.fillRect(X, Y, width, height);

  //Make hitbox for button visible
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#DDD";
  //ctx.strokeRect(X, Y, width, height);

  //If mouse is over button
  if (mouse.X > X && mouse.X < X + width && mouse.Y > Y && mouse.Y < Y + height) {
    
    //Hover color
    ctx.fillStyle = "#EBE1A0";

    if (mouse.clicked) {

      //For debug
      console.log("Positon: " + playerList[0].X + "x | " + playerList[0].Y + "y" + "\nGame Screen: " + screenType);
      
      //Function that button executes on click.
      if (functionToPerform) { functionToPerform(); }

      screenType = screenTypeGiven;
      mouse.clicked = false;
    }
  }
  
  ctx.shadowBlur = 10;
  ctx.fillText(text, X + 6, Y + textHeight);
  ctx.shadowBlur = 0;
}
function swapItems(a, b) {

  //Javascript only passes objects by reference, everything else is passed by value. So don't directly swap items.
  var temp = a.item;

  a.item = b.item;
  b.item = temp;
}
function getMouseAngle(type) {

  //Calculate center of player.
  var deltaX = playerList[0].X + (playerList[0].width / 2) - mouse.X;
  var deltaY = playerList[0].Y + (playerList[0].height / 2) - mouse.Y;

  //Find angle in Rad
  var angle = Math.atan2(deltaY, deltaX);

  //Convert from Rad to Degrees
  angle *= (180 / Math.PI);

  //Make angle positive on 360 degree values
  angle += 180;

  //Convert to Rad if necessary
  if (type == "rad") { angle *= (Math.PI / 180); }
  
  return angle;
}
function getAngleTo(entityFrom, entityTo, type) {

  //Calculate center of player.
  var deltaX = entityFrom.X + (entityFrom.width / 2) - entityTo.X;
  var deltaY = entityFrom.Y + (entityFrom.height / 2) - entityTo.Y;

  //Find angle in Rad
  var angle = Math.atan2(deltaY, deltaX);

  //Convert from Rad to Degrees
  angle *= (180 / Math.PI);

  //Make angle positive on 360 degree values
  angle += 180;

  //Convert to Rad if necessary
  if (type == "rad") { angle *= (Math.PI / 180); }

  //Return angle in Degrees
  return angle;
}
function drawDebugInfo(absX, absY) {

  //FOR BUG TESTING
  ctx.fillStyle = "red";

  var mouseItem;
  if (mouse.item) { mouseItem = mouse.item.itemName; }

  //Comment/uncomment to hide/show
  var info = [
    //["Portals", portalList.length], 
    //["LootBags", lootBagList.length], 
    //["ViewingLoot", playerList[0].isViewingLoot], 
    //["X", playerList[0].X.toFixed(0)], 
    //["Y", playerList[0].Y.toFixed(0)],
    ["Slot", whichSlot],
    //["ScreenType", screenType], 
    //["FRAME_OF_REFERENCE", FRAME_OF_REFERENCE[0].toFixed(0) + "x | " + FRAME_OF_REFERENCE[1].toFixed(0) + "y"],
    //["mouse.clicked", mouse.clicked],
    //["mouse.item", mouseItem],
    //["mouse.X", mouse.X.toFixed(0)],
    //["mouse.Y", mouse.Y.toFixed(0)],
    ["mouseAngle", getMouseAngle().toFixed(0) + "°"],
    ["mouseAngle", getMouseAngle("rad").toFixed(2) + " Rad"],
  ];

  for (var i = 0; i < info.length; i++) {
    
    ctx.fillText(info[i][0] + ": " + info[i][1], 20 + absX, 30 + (20 * i) + absY);
  }
}
function findNearestPlayer(entity) {

  var closest = {

    name: "Nobody Nearby",

    X: 9999999,
    Y: 9999999,

    distance: 999999,
    angle: 999,
  };

  for (var i = 0; i < playerList.length; i++) {
    
    var Xdistance = entity.X - playerList[i].X;
    var Ydistance = entity.Y - playerList[i].Y;

    var totalDistance = Xdistance + Ydistance;

    if (totalDistance < closest.distance && entity.name != playerList[i].name) {

      closest.name = playerList[i].name;
      closest.X = playerList[i].X;
      closest.Y = playerList[i].Y;
      closest.distance = totalDistance;
    }
  }

  return closest;
}
//END RANDOM TOOLS
//GAME SCREEN WINDOW =============
function checkFrameOfReference(Xgiven, Ygiven) {

  var x = FRAME_OF_REFERENCE[0] - Xgiven;
  var y = FRAME_OF_REFERENCE[1] - Ygiven;
  
  //Changes game's frame of reference so the player is centered on screen.
  if (FRAME_OF_REFERENCE[0] != Xgiven || FRAME_OF_REFERENCE[1] != Ygiven) {

    ctx.translate(x, y);

    mouse.X -= x;
    mouse.Y -= y;

    FRAME_OF_REFERENCE[0] = Xgiven;
    FRAME_OF_REFERENCE[1] = Ygiven;
  }
}
function drawGameScreen () {

  ctx.font = "16px Palatino";
  ctx.clearRect(playerList[0].X - 600, playerList[0].Y - 600, canvas.width + 1200, canvas.height + 1200);

  //Ensure game map is generated and being used.
  if (screenType == "GAME_SCREEN" && MAP_TYPE != REALM_MAP) { generateGameMap(); }
  if (screenType == "BOSS_SCREEN" && MAP_TYPE != BOSS_ROOM_MAP) { generateBossMap(); }

  if ((screenType == "GAME_SCREEN" && MAP_TYPE == REALM_MAP) || (screenType == "BOSS_SCREEN" && MAP_TYPE == BOSS_ROOM_MAP)) {

    //For bug testing.
    whichSlot = "None";
    for (var p = 0; p < playerList[0].inventory.length; p++) {
      if (mouseIsTouching(playerList[0].inventory[p])) {

        whichSlot = "Inventory: " + (p + 1);
      }
    }
    for (var p = 0; p < playerList[0].equipInv.length; p++) {
      if (mouseIsTouching(playerList[0].equipInv[p])) {

        whichSlot = "Equipment: " + (p + 1);
      }
    }

    //Move stuff
    moveEnemyBullet();
    movePlayer();
    moveEnemy();

    if (((mouse.clicked && !mouse.item) || keys.T)) { playerList[0].fireWeapon(); }
    if (keys.B) { playerList[0].use_ability(); }

    movePlayerBullet();
    checkCollisions();
    checkFrameOfReference(playerList[0].X - 250, playerList[0].Y - 300);
    replenishPlayerStats();

    //MAP
    drawMap(MAP_TYPE);

    //Loot
    drawPortals();
    displayLootBags();

    //Entities
    drawPlayer();
    drawEnemy();

    //Projectiles
    drawPlayerBullet();
    drawEnemyBullet();
    showDamageTaken();

    //CHAT
    if (keys.ENTER) { activateChat(); }
    displayChat();
    displayStats();

    //INVENTORY SLOTS
    drawPlayerInventory();
    if (playerList[0].isViewingLoot[1] == -1) { displayItemDrops(); }
    if (playerList[0].isViewingLoot[0] == -1) { drawPortalEntryButton(); }

    //Render items being held by mouse
    mouse.drawItem();
  }

  if (isEqualTo(screenType, "MAIN_MENU", "INSTRUCTIONS", "DEATH_SCREEN", "OPTIONS")) { 

    backgroundScrollingScene(); 
    checkFrameOfReference(0, 0);
  }
  if (screenType == "MAIN_MENU") { drawMainMenu(); }
  if (screenType == "INSTRUCTIONS") { drawInstructionsScreen(); }
  if (screenType == "DEATH_SCREEN") { drawDeathScreen(); }
  if (screenType == "OPTIONS") { drawOptionsMenu(); }
  if (screenType == "CLASS_SELECTION") { drawClassSelectionScreen(); }
}
/* function drawMainMenuScreen () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#696969";
  ctx.fillRect(0, 400, canvas.width, 90);

  //Main Menu Buttons
  placeButtonHere("Play", 340, 423, "CLASS_SELECTION", "35px Palatino", "#696969");
  placeButtonHere("Instructions", 445, 430, "INSTRUCTIONS", "25px Palatino", "#696969");
  placeButtonHere("Options", 220, 430, "OPTIONS", "25px Palatino", "#696969");

  ctx.font = "40px Palatino";
  ctx.fillStyle = "#CC0000";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#000";
  ctx.fillText("The Realm Project", canvas.width / 3.4, 200);
  ctx.shadowBlur = 0;

  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
} 
function drawOptionsScreen () {
   
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#696969";
  ctx.fillRect(233, 130, 310, 300);
  
  ctx.font = "30px Palatino";
  ctx.fillStyle = "#DDD";
  ctx.fillText("OPTIONS", (canvas.width / 3) + 55, 200);
  
  if (gameBackgroundMusic.volume < 0.1) {

      placeButtonHere("Enable Music!", 305, 260, "OPTIONS", "25px Palatino", "#696969", unMuteGame);

  } else { placeButtonHere("Disable Music!", 305, 260, "OPTIONS", "25px Palatino", "#696969", muteGame); }

  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);

  placeButtonHere("Back to Main", 310, 360, "MAIN_MENU", "25px Palatino", "#696969");
} */
function drawInstructionsScreen () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#696969";
  ctx.fillRect( 233, 130, 310, 300);

  ctx.font = "30px Palatino";
  ctx.fillStyle = "#DDD";
  ctx.fillText("INSTRUCTIONS", (canvas.width / 3) + 10, 200);
  
  ctx.font = "16px Palatino";
  ctx.fillText("'WASD' to move, Special is 'SpaceBar'", 258, 250);
  ctx.fillText("Click to fire, 'T' is autofire", 260, 290);
  ctx.fillText("'ENTER' to chat.", 330, 330);

  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);

  placeButtonHere("Back to Main", 310, 360, "MAIN_MENU", "25px Palatino", "#696969");
}
function drawDeathScreen () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(playerList[0].ImageArray[0][0], (canvas.width / 2) - 32, 80, 64, 64);

  ctx.font = "28px Palatino";
  ctx.fillStyle = "#888";
  ctx.fillText(playerList[0].name + " was killed", (canvas.width / 3) + 30, 200);
  
  ctx.font = "18px Palatino";
  if (playerList[0].level < 50) { ctx.fillText("Died at level: " + playerList[0].level, 240, 250); }
  else { ctx.fillText("Died with " + playerList[0].glory.toFixed(0) + " renowned Glory", 240, 250); }

  ctx.fillText("Killed by: " + playerList[0].killedBy, 240, 270);

  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
  
  placeButtonHere("Back to Main", 350, canvas.height - 80, "MAIN_MENU", "25px Palatino", "#222");
}
function drawClassSelectionScreen () {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(30, 30, 30, 0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#696969";
  ctx.fillRect(0, 400, canvas.width, 90);

  //Main Menu Buttons
  placeButtonHere("Start", 340, 423, "GAME_SCREEN", "35px Palatino", "#696969");
  placeButtonHere("Main Menu", 445, 430, "MAIN_MENU", "25px Palatino", "#696969");
  placeButtonHere("Options", 220, 430, "OPTIONS", "25px Palatino", "#696969");

  ctx.font = "30px Palatino";
  ctx.fillStyle = "#CC0000";
  ctx.shadowBlur = 10;
  ctx.fillText("Class Selection", 290, 200);
  ctx.shadowBlur = 0;

  for (var i = 0; i < classSelectionPics.length; i++) {
    if (mouse.X > 260 + (i * 90) && mouse.X < 260 + (i * 90) + 64 && mouse.Y > canvas.height / 2 && mouse.Y < (canvas.height / 2) + 64) {

      ctx.shadowColor = "white";

      if (mouse.clicked) { 

        playerList[0].Image = classSelectionPics[i];

        if (i == 0) { playerList[0].ImageArray = warrior_Pics; }
        if (i == 1) { playerList[0].ImageArray = archer_Pics; }
        if (i == 2) { playerList[0].ImageArray = mage_Pics; }

        screenType = "GAME_SCREEN";
      }
    }
    ctx.shadowBlur = 10;
    ctx.drawImage(classSelectionPics[i], 260 + (i * 90), canvas.height / 2, 64, 64);
    ctx.shadowBlur = 0;
    ctx.shadowColor = "#000";
  }

  ctx.font = "16px Palatino";
  ctx.fillStyle = "#008888";
  ctx.fillText(versionInfo + " - Game by ExplorersX", 15, 30);
}
function drawCreditsScreen () {

  //To be implemented later...
}
//END GAME SCREEN WINDOW =========
//RUNTIME FUNCTIONS ==============

var generateEnemies = setInterval(function() { if (screenType == "GAME_SCREEN" && (enemies_remaining_in_realm - enemyList.length) > 0) { spawnEnemy(); } } , 1000000);
var bossSpeak = setInterval(function() { 

  if (enemies_remaining_in_realm > 0) {

    var messageData = {

      text: "THERE ARE " + enemies_remaining_in_realm + " ENEMIES REMAINING!",
      Y: 16,
      age: 401,
      speaker: "Game Boss"
    }

    chatLog.push(messageData);

  } else {

    var messageData = {

        text: "YOU MUST PAY FOR YOUR SINS!!!",
        Y: 16,
        age: 201,
        speaker: "Game Boss"
    }

    chatLog.push(messageData);
    screenType = "BOSS_SCREEN";
    lastKnownLocation = [playerList[0].X, playerList[0].isViewingLoot];
    if (lastKnownLocation[0] < 4000) {

      console.log("X: " + lastKnownLocation[0] + "\nViewing Loot: " + lastKnownLocation[1] + "\nGame Screen: " + screenType);
    }
    
  }
  for (var i = 0; i < chatLog.length; i++) { chatLog[i].Y += 20; }

 } , 60000);
var drawTheGame = setInterval(drawGameScreen, (1000 / GAME_FPS));

//--------------------------------
//END OF FILE
//--------------------------------