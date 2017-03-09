//VERSION INFO
var versionInfo = "Version 1.2.F";

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

  //For sprite location
  var direction = undefined;
  var W = 2;
  var A = 1;
  var S = 3;
  var D = 0;

  for (var i = 0; i < playerList.length; i++) { playerList[i].move(); }

  //Updates sprites.
  var maxTime = 30;
  playerList[0].timeToSpriteChange++;

  if (playerList[0].timeToSpriteChange >= maxTime * 2) { 

    playerList[0].timeToSpriteChange = 0;
  }

  //When not in chat
  if (!keys.ENTER) {

    //Movement direction
    if (keys.W) { direction = W; }
    if (keys.A) { direction = A; }
    if (keys.S) { direction = S; }
    if (keys.D) { direction = D; }

    //Cannot just do if(direction) because D evaluates to false
    if (direction != undefined) { 
      if (playerList[0].timeToSpriteChange >= maxTime) {

        playerList[0].Image = playerList[0].ImageArray[direction][1];
      } 
      else {

        playerList[0].Image = playerList[0].ImageArray[direction][2];
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
function backgroundScrollingScene () {

  backgroundPos[0] -= 0.2;
  backgroundPos[1] -= 0.2;
  document.getElementById("myCanvas").style.backgroundPosition = backgroundPos[0] + "px " + backgroundPos[1] + "px";     
}
function replenishPlayerStats () {

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
  if (screenType == "GAME_SCREEN" && MAP_TYPE != REALM_MAP) { Game_map_generator.generateGameMap(); }
  if (screenType == "BOSS_SCREEN" && MAP_TYPE != BOSS_ROOM_MAP) { Game_map_generator.generateBossMap(); }

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
    Game_map_generator.draw();

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
    if (keys.ENTER) { chat.activate(); }
    chat.draw();

    //Side bar
    side_bar.draw();

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
  if (screenType == "MAIN_MENU") { main_menu.draw(); }
  if (screenType == "INSTRUCTIONS") { instructions_menu.draw(); }
  if (screenType == "DEATH_SCREEN") { death_menu.draw(); }
  if (screenType == "OPTIONS") { options_menu.draw(); }
  if (screenType == "CLASS_SELECTION") { class_selection_menu.draw(); }
}
//END GAME SCREEN WINDOW =========
//RUNTIME FUNCTIONS ==============

var generateEnemies = setInterval(function() { if (screenType == "GAME_SCREEN" && (enemies_remaining_in_realm - enemyList.length) > 0) { spawnEnemy(); } } , 1000000);
var bossSpeak = setInterval(function() { 

  var bossText = "NO_BOSS_TEXT";

  if (enemies_remaining_in_realm > 0) {

    bossText = "THERE ARE " + enemies_remaining_in_realm + " ENEMIES REMAINING!";

  } else {

    bossText = "YOU MUST PAY FOR YOUR SINS!!!";
    screenType = "BOSS_SCREEN";
  }

  //Message info
  var messageData = {

    //Location
    X: 10 + FRAME_OF_REFERENCE[0],
    Y: 16,

    //Dimensions
    width: 300,

    //Text
    text: bossText,
    global: true,
    globalColor: "#FB4F51FF",

    //Info
    speaker: "Game Boss",
  };
  
  //Add message to global chat
  chat.log.push(new textbox(messageData));

  //The wrapText function sets the height of the textbox
  if(!chat.log[chat.log.length - 1].height) { chat.log[chat.log.length - 1].wrapText(); }

  //Increase Ypos of text on left of screen.
  for (var i = 0; i < chat.log.length; i++) { 

    //Move chat on left of screen up the new message's height
    chat.log[i].Y += (chat.log[chat.log.length - 1].height + 5);
  }

 } , 60000);
var drawTheGame = setInterval(drawGameScreen, (1000 / GAME_FPS));

//--------------------------------
//END OF FILE
//--------------------------------