//VERSION INFO
var versionInfo = "Version 1.2.E";

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

        //Damage player
        playerList[j].takeDamage(enemyBulletList[i].damage);

        //This little fracker has to exist before you die...
        if (playerList[j].HP <= 0) { playerList[j].deathScene(enemyBulletList[i].owner); }

        //Remove Projectile
        enemyBulletList.splice(i, 1);
        i--;
      }
    }
  }
}
//END COLLISIONS =================
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
  if (screenType == "INSTRUCTIONS") { drawInstructionsMenu(); }
  if (screenType == "DEATH_SCREEN") { drawDeathScreen(); }
  if (screenType == "OPTIONS") { drawOptionsMenu(); }
  if (screenType == "CLASS_SELECTION") { drawClassSelectionScreen(); }
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