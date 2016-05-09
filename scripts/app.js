//VERSION INFO
var versionInfo = "Version 1.2.B";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
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
//Damage Numbers
var playerDamageNumberList = [];
var damageNumberList = [];
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
  },
}

*/
var screenType = "MAIN_MENU";

//GAME OBJECTS ===================
function player () {
   
  //Username
  this.userName = defaultNamesList[Math.floor((Math.random() * defaultNamesList.length) + 0).toFixed(0)];
  this.ImageArray = [];
  this.Image = archer_Pics;
  this.timeToSpriteChange = 0;
  //Death Stats
  this.deathGlory = 0;
  this.killCount = 0;
  this.killedBy = "Nothing???";
  //Weapon and Sprite
  this.bulletImage = player_Bullet_Pic;
  //Speed
  this.speed = 15;
  this.speedFormula = 3 + (7 * (this.speed / 100));
  this.MAX_SPEED = 100;
  //Damage
  this.maxWeaponDamage = 5;
  this.minWeaponDamage = 1;
  this.damageVariance = function () { return (Math.random() * this.maxWeaponDamage) + this.minWeaponDamage; }
  this.damage = 100;
  //Dexterity
  this.dexterity = 200;
  this.MAX_DEXTERITY = 200;
  this.weaponCooldown = 0;
  this.MAX_WEAPON_COOLDOWN = function () { return 125 / (1 + (this.dexterity / 8)); }
  //Position and Dimensions
  this.X = 4000;
  this.Y = 4000;
  this.height = 40;
  this.width = 40;
  //Exp/Leveling
  this.EXP = 0;
  this.MAX_level = 25;
  this.level = 1;
  this.levelExpReq = 100;
  this.glory = 0;
  //HP
  this.HP = 200;
  this.MAX_HP = 200;
  this.youth = 300;
  this.MAX_YOUTH = 1000;
  //MP
  this.MP = 150;
  this.MAX_MP = 150;
  this.wizardry = 200;
  this.MAX_WIZARDRY = 400;
  //Specials
  this.special_MP_cost = 20;
  this.specialCooldown = 0;
  this.MAX_SPECIAL_COOLDOWN = 20;
  //isViewingLoot used to only see one loot bag at a time.
  this.isViewingLoot = [-1, -1];
  this.mouseOccupied = false;
  //Inventory
  this.inventory = [];
  this.inventoryInitialized = false;
  //Equipment
  this.equipInv = [];
  
  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  this.drawInventory = function() {

    for (var j = 0; j < this.inventory.length; j++) {

      if (this.inventory[j].item) {

        //Give Item if Shift Clicking
        if (mouseClicked && keys.SHIFT && mouseIsTouching(this.inventory[j]) && !this.mouseOccupied) {

          this.inventory[j].giveItem();
          break;
        }
        //Select item if clicking it and not holding anything else
        if (mouseClicked && mouseIsTouching(this.inventory[j].item) && !this.mouseOccupied) {
          
          this.inventory[j].item.beingHeld = true;
        }
        //Hold item while mouse is held
        else if (mouseClicked && this.inventory[j].item.beingHeld && this.mouseOccupied) {

          //Prevent else statement...
        }
        //When not clicking
        else {

          //Item moving/swapping
          for (var k = 0; k < this.inventory.length; k++) {

            //If mouse was released over slot k
            if (mouseIsTouching(this.inventory[k]) && this.mouseOccupied) {

              //Move/Swap item to new inventory slot
              if (hitboxIntersectCheck(this.inventory[j].item, this.inventory[k])) {

                swapItems(this.inventory[k], this.inventory[j]);
                break;
              }
            }
          }
          //Release items when not clicking
          if (this.inventory[j].item) {

            //Update inventory slot to ensure item is in proper location. This prevents random item dropping.
            this.inventory[j].draw(1);

            //Drop item on ground.
            if (this.inventory[j].item.X < this.inventory[0].left() - 36 || this.isViewingLoot[0] != -1 && (this.inventory[j].item.Y > this.inventory[5].bottom())) {
              
              this.dropItemFromSlot(j);
              break;
            }
            //I have no idea how this if statement block interacts with the rest of the program, but it makes things work.
            if (this.inventory[j].item.beingHeld) { 

              this.mouseOccupied = false;
              this.inventory[j].item.beingHeld = false;
            }
          }
        }
      }
    }

    //Draw slots on first pass, items on second.
    for (var i = 0; i < 2; i++) {
      //Equipment inventory
      for (var col = 0; col < 4; col++) {
        
        var topInv = 372;
        if (this.equipInv.length < 4) { 

            //Default X, Y, col, row, itemGiven
            this.equipInv.push(new inventorySlot(canvas.width - 184, topInv, col, 0));
        }
        else { this.equipInv[col].draw(i); }

        //Draw Item Description
        if (!mouseClicked && this.equipInv[col].item) {

          drawItemDescription(this.equipInv[col].item); 
        }
      }
      //If inventory isn't drawn then items will not appear. This way inventory slots are not layered, but all in one layer.
      for (var col = 0; col < 8; col++) {

        var row = 0;
        if (col >= 4) { row = 1; }
        var topInv = 420;

        if (this.inventory.length < 8) { 

          //Default X, Y, col, row, itemGiven
          this.inventory.push(new inventorySlot(canvas.width - 184, topInv, col, row)); 
        }
        else { this.inventory[col].draw(i); }

        //Draw Item Description
        if (!mouseClicked && this.inventory[col].item) { 

          drawItemDescription(this.inventory[col].item); 
        }
      }
    }
  }
  this.dropItemFromSlot = function(j) {

    //Drop into existing loot bag.
    if (this.isViewingLoot[0] != -1) {

      //Item moving/swapping with loot bag
      for (var k = 0; k < 8; k++) {

        //If mouse was released over slot k
        if (mouseIsTouching(lootBagList[this.isViewingLoot[0]].inventory[k]) && this.mouseOccupied) {

          //Move/Swap item to loot bag inventory slot
          if (hitboxIntersectCheck(this.inventory[j].item, lootBagList[this.isViewingLoot[0]].inventory[k])) {

            swapItems(this.inventory[j], lootBagList[this.isViewingLoot[0]].inventory[k]);
            break;
          }
        }
      }
    }
    //Create new loot bag and drop.
    else if (this.isViewingLoot[0] == -1) {

      lootBagList.push(new lootBag(this.X, this.Y, lootBagPics[0]));
      lootBagList[lootBagList.length - 1].addToInventory(this.inventory[j].item);

      //Clear item from it's original slot.
      this.inventory[j].item = null;
    }
  }
  //Leveling up
  this.levelUP = function() {
    
    if (this.level < this.MAX_level) {
      //Dexterity
      this.dexterity += Math.floor((Math.random() * 5) + 2);
      //HP
      this.MAX_HP += Math.floor((Math.random() * 40) + 16);
      this.HP = this.MAX_HP;
      //MP
      this.wizardry += Math.floor((Math.random() * 3) + 1); 
      this.MAX_MP += Math.floor((Math.random() * 15) + 6);
      this.MP = this.MAX_MP;
      //Attack
      this.damage += Math.floor((Math.random() * 3) + 1);
      //Speed
      this.speed += Math.floor((Math.random() * 2));
      this.speedFormula = 3 + (7 * (this.speed / 100));
      //Youth
      this.youth += Math.floor((Math.random() * 4) + 1);
      //EXP
      this.EXP -= this.levelExpReq;
      this.level++;
      this.levelExpReq += 150;

      if (this.EXP >= this.levelExpReq) { this.levelUP(); }
    }
  }
  //Death Scene
  this.deathScene = function(enemyKilledBy) {

    //Reset Player
    this.HP = this.MAX_HP;
    this.MP = this.MAX_MP;
    this.isViewingLoot = [-1, -1];
    this.X = 4000;
    this.Y = 4000;

    //Remove all Entities
    enemyList = [];
    enemyBulletList = [];
    bulletList = [];
    damageNumberList = [];
    playerDamageNumberList = [];
    lootBagList = [];
    portalList = [];

    //Show Death screen
    screenType = "DEATH_SCREEN";
    this.deathGlory += this.glory;
    this.killedBy = enemyKilledBy;
  }
  //Movement Logic
  this.move = function() {

    if (keys.W) { this.Y -= this.speedFormula; }
    if (keys.A) { this.X -= this.speedFormula; }
    if (keys.S) { this.Y += this.speedFormula; }
    if (keys.D) { this.X += this.speedFormula; }
  } 
  this.draw = function() { 

    //Image of player
    if (!isEqualTo(this.Image, archer_Pics[3][1], archer_Pics[2][1], archer_Pics[1][1], archer_Pics[0][1], mage_Pics[3][1], mage_Pics[2][1], mage_Pics[1][1], mage_Pics[0][1])) {

      ctx.drawImage(this.Image, this.X, this.Y, this.width, this.height);
    }
    else {

      var subtractionValue = 5;
      var shiftValue = 0;

      //Modify for other size sprites.
      if (this.Image == archer_Pics[2][1]) { subtractionValue = 6; }
      if (this.Image == mage_Pics[2][1]) { subtractionValue = 6; }
      if (this.Image == archer_Pics[1][1]) { shiftValue = 5; }
      if (this.Image == mage_Pics[1][1]) { shiftValue = 5; }
      if (this.Image == mage_Pics[3][1]) { shiftValue = 5; }

      ctx.drawImage(this.Image, this.X + shiftValue, this.Y, this.width - subtractionValue, this.height);
    }
  }
}
function playerBullet (defaultXspeed, defaultYspeed, defaultHeight, defaultWidth, angleSend, mouseXSent, mouseYSent, imageGiven) {

  //Calculates angle of attack
  var deltaY = playerList[0].Y + (playerList[0].height / 2) - mouseY;
  var deltaX = playerList[0].X + (playerList[0].width / 2) - mouseX;
  this.angle = angleSend * (Math.PI / 180) || Math.atan2(-deltaY, -deltaX);

  this.damage = (playerList[0].damage / 10) * playerList[0].damageVariance();
  this.Xspeed = defaultXspeed;
  this.Yspeed = defaultYspeed;
  this.X = mouseXSent || playerList[0].X + (playerList[0].width / 2);
  this.Y = mouseYSent || playerList[0].Y + (playerList[0].height / 2);
  this.height = defaultHeight;
  this.width = defaultWidth;
  this.lifeTime = 0.5 * 62.5;
  this.Image = imageGiven;
  
  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  //Movement Logic
  this.move = function() {

    this.X = this.X + (this.Xspeed * Math.cos(this.angle));
    this.Y = this.Y + (this.Yspeed * Math.sin(this.angle));
    this.lifeTime--;
  }
  this.draw = function() {

    //Rotates Image based on angle fired at.
    ctx.save();
    ctx.translate(this.X - 5, this.Y - 5);
    ctx.rotate(this.angle + (45 * (Math.PI / 180)));
    ctx.drawImage(this.Image, -(this.width / 2), -(this.height / 2), this.width, this.height);
    ctx.restore();
  }
}
function enemy (defaultHP, expReward, attackDamage, defaultSpeed, defaultHeight, defaultWidth, spriteGiven, movementType, nameGiven, portalType) {

  this.HP = defaultHP;
  this.MAX_HP = defaultHP;
  this.speed = defaultSpeed;
  this.X = playerList[0].X + (800 * Math.cos(Math.floor((Math.random() * 360) + 1)));
  this.Y = playerList[0].Y + (800 * Math.sin(Math.floor((Math.random() * 360) + 1)));
  this.height = defaultHeight;
  this.width = defaultWidth;
  this.bulletSpeed = 6;
  this.bulletRadius = 15;
  this.damage = attackDamage;
  this.expGiven = expReward;
  this.weaponCooldown = 0;
  this.MAX_WEAPON_COOLDOWN = function () { return 125; }
  this.Image = spriteGiven;
  this.enemyName = nameGiven;
  this.detectionRange = 320;

  this.moveCounter = 0;
  this.movement_Pattern = movementType || "random";
  this.movement = "left";
  
  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  //Weapon
  this.fireWeapon = function() {

    var deltaY = this.Y - playerList[0].Y;
    var deltaX = this.X - playerList[0].X;
    var angleSend = Math.atan2(-deltaY, -deltaX);

    enemyBulletList.push(new enemyBullet(this.bulletSpeed, this.bulletRadius, this.X, this.Y, angleSend ,this.damage, this.enemyName));
    this.weaponCooldown = this.MAX_WEAPON_COOLDOWN();
  }
  //Movement Logic
  this.move = function() {

    if (this.Y > playerList[0].Y + 220 || this.X > playerList[0].X + 220 || this.Y < playerList[0].Y - 220 || this.X < playerList[0].X - 220) {

      //UP
      if (this.Y > playerList[0].Y + 150) { this.Y -= this.speed; }
      //LEFT
      if (this.X > playerList[0].X + 150) { this.X -= this.speed; }
      //DOWN
      if (this.Y < playerList[0].Y - 150) { this.Y += this.speed; }
      //RIGHT
      if (this.X < playerList[0].X - 150) { this.X += this.speed; }

    }
    //Enemy should re-randomize movement every duration specified.
    if (this.movement_Pattern == "random") { movement_Pattern_Random(this); }
    else if (this.movement_Pattern == "chase") { movement_Pattern_Chase(this); }
  }
  //Drops loot when killed
  this.dropLoot = function() {

    lootBagList.push(new lootBag(this.X, this.Y, lootBagPics[0]));

    var potionNames = ["Attack", "Speed", "Dexterity", "Wizardry", "Youth"];

    for (var i = 0; i < potionNames.length; i++) {

      var chance = (Math.random() * 1000) + 1;
      if (chance > 980) { dropPotions(potionNames[i]); }
    }
    for (var i = 0; i < 3; i++) {

      var chance = (Math.random() * 1000) + 1;
      if (chance > 900) { dropWeapons(i); }
    }
    for (var i = 0; i < 4; i++) {

      var chance = (Math.random() * 1000) + 1;
      if (chance > 970) { dropArmors(i); }
    }

    //Delete bag if empty.
    lootBagList[lootBagList.length - 1].checkIfEmpty();

    var chance = (Math.random() * 1000) + 1;
    if (chance > 800 && this.enemyName != "Game Boss") { dropPortal(this.X, this.Y, "BOSS_SCREEN"); }
    if (this.enemyName == "Game Boss") { dropPortal(this.X, this.Y, "GAME_SCREEN"); }

    playerList[0].EXP += this.expGiven;
    playerList[0].killCount++;
  }
  //Draws enemy to screen
  this.draw = function() {

    //Image              
    ctx.drawImage(this.Image, this.X, this.Y, this.width, this.height);
    //HP Bar
    ctx.fillStyle = "#CC0000";
    ctx.fillRect(this.X, this.Y - 8, this.width - 3, 5);
    ctx.fillStyle = "#00BB00";
    ctx.fillRect(this.X, this.Y - 8, this.HP * ((this.width - 3) / this.MAX_HP), 5);
  }
}
function enemyBullet (bulletSpeed, bulletRadius, startX, startY, angleGiven, damageGiven, ownerGiven) {

  this.height = bulletRadius;
  this.width = bulletRadius;
  this.X = startX;
  this.Y = startY;
  this.speed = bulletSpeed;
  this.angle = angleGiven;
  this.damage = damageGiven;
  this.owner = ownerGiven;

  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  //Movement Logic
  this.move = function() {

    this.X = this.X + (this.speed * Math.cos(this.angle));
    this.Y = this.Y + (this.speed * Math.sin(this.angle));
  }
  this.draw = function() {

    ctx.fillStyle = "#F00";
    ctx.fillRect(this.X, this.Y, this.width, this.height);
  }
}
function loot (imageGiven, nameGiven, effectTextGiven, descriptionGiven) {

  this.X = 10;
  this.Y = 10;
  this.height = 32;
  this.width = 32;
  this.typeOfItem = imageGiven;
  this.beingHeld = false;

  this.itemName = nameGiven || "Item Name";
  this.itemEffectText = effectTextGiven || "Item Description";
  this.itemDescription = descriptionGiven || "Item Lore";
  
  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  //Gives Loot
  this.giveItem = function() {
      
    if (this.typeOfItem == potionList[1] && playerList[0].speed < playerList[0].MAX_SPEED) { 

      playerList[0].speed++; 
      playerList[0].speedFormula = 3 + (7 * (playerList[0].speed / 100));
    }
    if (this.typeOfItem == potionList[0]) { playerList[0].damage++; }
    if (this.typeOfItem == potionList[2] && playerList[0].dexterity < playerList[0].MAX_DEXTERITY) { 

      playerList[0].dexterity++; 
    }
    if (this.typeOfItem == potionList[3] && playerList[0].wizardry < playerList[0].MAX_WIZARDRY) { playerList[0].wizardry++; }
    if (this.typeOfItem == potionList[4] && playerList[0].youth < playerList[0].MAX_YOUTH) { playerList[0].youth++; }
    if (this.typeOfItem == armorList[0]) { playerList[0].MAX_HP += 10; }
    if (this.typeOfItem == armorList[1]) { playerList[0].MAX_HP += 20; }
    if (this.typeOfItem == armorList[2]) { playerList[0].MAX_HP += 30; }
    if (this.typeOfItem == armorList[3]) { playerList[0].MAX_HP += 40; }
    if (this.typeOfItem == weaponBowList[0][0]) { 

      playerList[0].bulletImage = weaponBowList[0][1];
      playerList[0].maxWeaponDamage = 10;
      playerList[0].minWeaponDamage = 5;
    }
    if (this.typeOfItem == weaponBowList[1][0]) { 

      playerList[0].bulletImage = weaponBowList[1][1]; 
      playerList[0].maxWeaponDamage = 25;
      playerList[0].minWeaponDamage = 15;
    }
    if (this.typeOfItem == weaponBowList[2][0]) { 

      playerList[0].bulletImage = weaponBowList[2][1]; 
      playerList[0].maxWeaponDamage = 45;
      playerList[0].minWeaponDamage = 30;
    }
  }
}
function lootBag (defaultX, defaultY, imageGiven) {

  this.X = defaultX;
  this.Y = defaultY;
  this.height = 25;
  this.width = 25;
  this.lifeTime = 30 * 62.5;
  this.sprite = imageGiven;
  this.inventory = [];
  this.ID = Math.random();

  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  this.createInventory = function() {

    for (var col = this.inventory.length; col < 8; col++) {

      var row = 0;
      if (col >= 4) { row = 1; }
      var topInv = 510;

      if (this.inventory.length < 8) { 

        //Default X, Y, col, row, itemGiven
        this.inventory.push(new inventorySlot(canvas.width - 184, topInv, col, row));
      }
    }
  }
  this.addToInventory = function(item) {

  	//Create Inventory
  	this.createInventory();

  	for (var i = 0; i < this.inventory.length; i++) {

  		//If slot is empty, put item in it.
  		if (!this.inventory[i].item) { 

  			this.inventory[i].item = item; 
  			break;
  		}
  	}
  }
 	this.checkIfEmpty = function() {

		for (var i = 0; i < this.inventory.length; i++) {

  		if (this.inventory[i].item) { return false;	}
  	}

  	//Delete self if empty
  	lootBagList.splice(lootBagList.indexOf(this), 1);
 	}
  this.drawInventory = function() {

  	//Create Inventory
  	this.createInventory();

  	for (var j = 0; j < this.inventory.length; j++) {

      if (this.inventory[j].item) {

        //Give Item if Shift Clicking
        if (mouseClicked && keys.SHIFT && mouseIsTouching(this.inventory[j]) && !playerList[0].mouseOccupied) {

          this.inventory[j].giveItem();
          this.checkIfEmpty();
          break;
        }
        //Select item if clicking it and not holding anything else
        if (mouseClicked && mouseIsTouching(this.inventory[j].item) && !playerList[0].mouseOccupied) {
          
          this.inventory[j].item.beingHeld = true;
        }
        //Hold item while mouse is held
        else if (mouseClicked && this.inventory[j].item.beingHeld && playerList[0].mouseOccupied) {

          //Prevent else statement...
        }
        //When not clicking
        else {

          //Item move/swap with other slots
          for (var k = 0; k < this.inventory.length; k++) {

            //If mouse was released over slot k
            if (mouseIsTouching(this.inventory[k]) && playerList[0].mouseOccupied) {

              //Move/Swap item to new inventory slot
              if (hitboxIntersectCheck(this.inventory[j].item, this.inventory[k])) {

                swapItems(this.inventory[k], this.inventory[j]);
                break;
              }
            }
          }
        	//Item move/swap to player inventory
          for (var k = 0; k < playerList[0].inventory.length; k++) {

            //If mouse was released over slot k
            if (mouseIsTouching(playerList[0].inventory[k]) && playerList[0].mouseOccupied) {

              //Move/Swap item to new inventory slot
              if (hitboxIntersectCheck(this.inventory[j].item, playerList[0].inventory[k])) {

                swapItems(playerList[0].inventory[k], this.inventory[j]);

                //Delete lootbag if empty.
                this.checkIfEmpty();
                break;
              }
            }
          }
          //Release items when not clicking
          if (this.inventory[j].item) {

            //I have no idea how this if statement block interacts with the rest of the program, but it makes things work.
            if (this.inventory[j].item.beingHeld) { 

              playerList[0].mouseOccupied = false;
              this.inventory[j].item.beingHeld = false;
            }
          }
        }
      }
    }
	  //Draw slots on first pass, items on second.
	  for (var i = 0; i < 2; i++) {
	    for (var col = 0; col < 8; col++) {

    		this.inventory[col].draw(i);

	      //Draw Item Description
	      if (!mouseClicked && this.inventory[col].item) { 

	        drawItemDescription(this.inventory[col].item); 
	      }
	    }
  	}
  }
  this.draw = function() {

    ctx.fillStyle = "#9E6F31";
    ctx.drawImage(this.sprite, this.X, this.Y, 35, 28);
    this.lifeTime--;
  }
}
function inventorySlot (defaultX, defaultY, col, row, itemGiven) {

  this.width = 40;
  this.height = 40;
  this.X = defaultX + (this.width * col) - (this.width * 4 * row) + (3 * col - (row * 12));
  this.Y = defaultY + (this.height * row) + (row * 3);

  this.item = itemGiven;

  this.top = function() { return this.Y + FRAME_OF_REFERENCE[1]; }
  this.bottom = function() { return this.Y + this.height + FRAME_OF_REFERENCE[1]; }
  this.left = function() { return this.X + FRAME_OF_REFERENCE[0]; }
  this.right = function() { return this.X + this.width + FRAME_OF_REFERENCE[0]; }

  this.draw = function(i) {

    //If item in slot is being held by mouse
    if (this.item && this.item.beingHeld) {

      this.item.X = mouseX - (this.width / 2);
      this.item.Y = mouseY - (this.height / 2);
      playerList[0].mouseOccupied = true;

    } else if (this.item) {

      //Return item in slot to inventory position when not being held.
      this.item.X = this.left() + 4;
      this.item.Y = this.top() + 4;
    }
    //Draw slots on first pass, items on second pass.
    if (i == 0) {

      //Draw inventory slot
      ctx.fillStyle = "#CCC";
      ctx.fillRect(this.left(), this.top(), this.width, this.height);
      ctx.fillStyle = "#000";
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.strokeRect(this.left(), this.top(), this.width, this.height);

      //Draw numbers on inventory slot if empty
      if (!this.item) {

        ctx.font = "16px Palatino";
        ctx.fillText(col + 1, this.left() + this.width / 2.7, this.top() + this.height / 1.6);
      }
    }
    else if (this.item) {

      //Draw inventory slot's item
      ctx.drawImage(this.item.typeOfItem, this.item.X, this.item.Y, this.item.width, this.item.height);
    }
  }
  this.giveItem = function() {

    //Give item and delete it
    if (this.item) { 

      this.item.giveItem(); 
      this.item = null;
      mouseClicked = false;
    }
  }
}
function portal (defaultX, defaultY, nameGiven, destinationGiven, spriteGiven) {

  this.X = defaultX;
  this.Y = defaultY;
  this.height = 42;
  this.width = 42;
  this.Image = spriteGiven;
  this.name = nameGiven;
  this.destination = destinationGiven;
  this.ID = Math.random();

  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  this.draw = function() {

    ctx.drawImage(this.Image, this.X, this.Y, this.height, this.width);
  }
  this.drawButton = function () {

  	//View Portal if touching it and not viewing another portal.
    if (hitboxIntersectCheck(this, playerList[0]) && (playerList[0].isViewingLoot[1] == -1 || playerList[0].isViewingLoot[1] == this.ID)) {
 
        placeButtonHere(this.name, canvas.width - 180 + FRAME_OF_REFERENCE[0], canvas.height - 50 + FRAME_OF_REFERENCE[1], this.destination, "20px Arial", "#696969");

        playerList[0].isViewingLoot[1] = this.ID;
    }
    else if (playerList[0].isViewingLoot[1] == this.ID) {

      playerList[0].isViewingLoot[1] = -1;
    }
  }
}
//END GAME OBJECTS ===============
//MOVEMENT PATTERNS ==============
function movement_Pattern_Random (thing) {

  if (thing.moveCounter > 15) {

    var chance = Math.random() * 5;

    if (chance <= 1 && (thing.X > playerList[0].X + 100 || thing.X < playerList[0].X - 100)) { 
      thing.movement = "left"; 
    }
    else if (chance <= 2 && (thing.X < playerList[0].X + 100 || thing.X < playerList[0].X - 100)) { 
      thing.movement = "right";
    }
    else if (chance <= 3 && (thing.Y < playerList[0].Y + 100 || thing.Y < playerList[0].Y - 100)) { 
      thing.movement = "up"; 
    }
    else if (chance <= 4 && (thing.Y < playerList[0].Y + 100 || thing.Y < playerList[0].Y - 100)) { 
      thing.movement = "down"; 
    }
    else { thing.movement = "stopped"; }

    thing.moveCounter = 0;
  }

  if (thing.movement == "up") { thing.Y -= thing.speed / 2; }
  if (thing.movement == "left") { thing.X -= thing.speed / 2; }
  if (thing.movement == "down") { thing.Y += thing.speed / 2; }
  if (thing.movement == "right") { thing.X += thing.speed / 2; }

  thing.moveCounter++;
}
function movement_Pattern_Chase (thing) {

  if (thing.Y > playerList[0].Y + 20 || thing.X > playerList[0].X + 20 || thing.Y < playerList[0].Y - 20 || thing.X < playerList[0].X - 20) {

    //UP
    if (thing.Y > playerList[0].Y) { thing.Y -= thing.speed; }
    //LEFT
    if (thing.X > playerList[0].X) { thing.X -= thing.speed; }
    //DOWN
    if (thing.Y < playerList[0].Y) { thing.Y += thing.speed; }
    //RIGHT
    if (thing.X < playerList[0].X) { thing.X += thing.speed; }

  }

  if (thing.moveCounter > 15) {

    var chance = Math.random() * 5;

    if (chance <= 1 && (thing.X > playerList[0].X + 100 || thing.X < playerList[0].X - 100)) { 
      thing.movement = "left"; 
    }
    else if (chance <= 2 && (thing.X < playerList[0].X + 100 || thing.X < playerList[0].X - 100)) { 
      thing.movement = "right";
    }
    else if (chance <= 3 && (thing.Y < playerList[0].Y + 100 || thing.Y < playerList[0].Y - 100)) { 
      thing.movement = "up"; 
    }
    else if (chance <= 4 && (thing.Y < playerList[0].Y + 100 || thing.Y < playerList[0].Y - 100)) { 
      thing.movement = "down"; 
    }
    else { thing.movement = "stopped"; }

    thing.moveCounter = 0;
  }

  if (thing.movement == "up") { thing.Y -= thing.speed / 2; }
  if (thing.movement == "left") { thing.X -= thing.speed / 2; }
  if (thing.movement == "down") { thing.Y += thing.speed / 2; }
  if (thing.movement == "right") { thing.X  += thing.speed / 2; }

  thing.moveCounter++;
}
//END MOVEMENT PATTERNS ==========
//PLAYER BULLETS =================
function spellBomb () {

  for (var i = 0; i < 21; i++) { newBullet(i * 18, mouseX, mouseY); }

  playerList[0].MP -= playerList[0].special_MP_cost;
  playerList[0].specialCooldown = playerList[0].MAX_SPECIAL_COOLDOWN;
} 
function newBullet (angleSend, mouseXSent, mouseYSent) { 
  //Xspeed, Yspeed, width, height, anglesend, mouseXsent, mouseYsent, Image
  bulletList.push(new playerBullet(10, 10, 26, 26, angleSend, mouseXSent, mouseYSent, playerList[0].bulletImage));

  playerList[0].weaponCooldown = playerList[0].MAX_WEAPON_COOLDOWN();
}
//END PLAYER BULLETS =============
//DRAW STUFF =====================
function displayLootBags() {

  for (var j = 0; j < lootBagList.length; j++) {
    
    lootBagList[j].draw();

    if (lootBagList[j].inventory.length < 1 || lootBagList[j].lifeTime < 1) { 

      lootBagList.splice(j, 1); 
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
  ctx.fillText("Name: " + playerList[0].userName, canvas.width - 190  + absX, 212 + absY);
  ctx.fillText("Level: " + playerList[0].level, canvas.width - 190  + absX, 230 + absY);
  ctx.font = "14px black Palatino";
  ctx.fillText("Attack: " + playerList[0].damage, canvas.width - 185  + absX, 320 + absY);
  ctx.fillText("Speed: " + playerList[0].speed.toFixed(0), canvas.width - 95  + absX, 320 + absY);
  ctx.fillText("Wizardry: " + playerList[0].wizardry, canvas.width - 185  + absX, 340 + absY);
  ctx.fillText("Dexterity: " + playerList[0].dexterity, canvas.width - 95  + absX, 340 + absY);
  ctx.fillText("Youth: " + playerList[0].youth, canvas.width - 185 + absX, 360 + absY);

  drawDebugInfo(absX, absY);

  ctx.font = "18px Palatino";
  drawExpBar(absX, absY, canvas.width + FRAME_OF_REFERENCE[0]);
  drawHpBar(absX, absY, canvas.width + FRAME_OF_REFERENCE[0]);
  drawManaBar(absX, absY, canvas.width + FRAME_OF_REFERENCE[0]);
}
function drawDebugInfo(absX, absY) {

  //FOR BUG TESTING
  ctx.fillStyle = "red";

  //Comment/uncomment to hide/show
  var info = [
  	["Portals", portalList.length], 
  	["LootBags", lootBagList.length], 
  	["ViewingLoot", playerList[0].isViewingLoot], 
  	//["X", playerList[0].X.toFixed(0)], 
  	//["Y", playerList[0].Y.toFixed(0)],
  	["Slot", whichSlot],
  	//["ScreenType", screenType], 
  	//["FRAME_OF_REFERENCE", FRAME_OF_REFERENCE[0].toFixed(0) + "x | " + FRAME_OF_REFERENCE[1].toFixed(0) + "y"], 
  	//["mouseX", mouseX.toFixed(0)], 
  	//["mouseY", mouseY.toFixed(0)]
  ];

  for (var i = 0; i < info.length; i++) {
  	
  	ctx.fillText(info[i][0] + ": " + info[i][1], 20 + absX, 30 + (20 * i) + absY);
  }
}
function drawExpBar(absX, absY, rightOfScreen) {

  //Exp Bar
  ctx.fillStyle = "grey";
  ctx.fillRect(canvas.width - 190 + absX, 240 + absY, 150, 18);

  if (playerList[0].level < playerList[0].MAX_level) { 

    ctx.fillStyle = "#00AA00"; 
    ctx.fillRect(canvas.width - 190 + absX, 240 + absY, playerList[0].EXP * (150 / playerList[0].levelExpReq), 18);
  }

  //Glory Bar
  else { 

    ctx.fillStyle = "orange";
    ctx.fillRect(canvas.width - 190 + absX, 240 + absY, 150, 18);
  }

  //Display Level Text
  if (mouseX > rightOfScreen - 190 && mouseX < rightOfScreen - 36 && mouseY > 242 + FRAME_OF_REFERENCE[1] && mouseY < 262 + FRAME_OF_REFERENCE[1]) {

    ctx.fillStyle = "white";

    if (playerList[0].level < playerList[0].MAX_level) { 

      ctx.fillText(playerList[0].EXP.toFixed(0) + " / " + playerList[0].levelExpReq, canvas.width - 150 + absX, 256 + absY); 

    } else { 

      playerList[0].glory = playerList[0].EXP / 2000;
      ctx.fillText(playerList[0].glory.toFixed(0), canvas.width - 125 + absX, 256 + absY); 
    }
  }
}
function drawHpBar (absX, absY, rightOfScreen) {

  //HP Bar
  ctx.fillStyle = "grey";
  ctx.fillRect(canvas.width - 190 + absX, 260 + absY, 150, 18);
  ctx.fillStyle = "#CC0000";
  ctx.fillRect(canvas.width - 190 + absX, 260 + absY, playerList[0].HP * (150 / playerList[0].MAX_HP), 18);

  //Display HP Text
  if (mouseX > rightOfScreen - 190 && mouseX < rightOfScreen - 36 && mouseY > 262 + FRAME_OF_REFERENCE[1] && mouseY < 282 + FRAME_OF_REFERENCE[1]) {

    ctx.fillStyle = "white";
    ctx.fillText(playerList[0].HP.toFixed(0) + " / " + playerList[0].MAX_HP, canvas.width - 150 + absX, 276 + absY);
  }
}
function drawManaBar (absX, absY, rightOfScreen) {

  //Mana Bar
  ctx.fillStyle = "grey";
  ctx.fillRect(canvas.width - 190 + absX, 280 + absY, 150, 18);
  ctx.fillStyle = "#0000FF";
  ctx.fillRect(canvas.width - 190 + absX, 280 + absY, playerList[0].MP * (150 / playerList[0].MAX_MP), 18);

  //Display Mana Text
  if (mouseX > rightOfScreen - 190 && mouseX < rightOfScreen - 36 && mouseY > 282 + FRAME_OF_REFERENCE[1] && mouseY < 302 + FRAME_OF_REFERENCE[1]) {

    ctx.fillStyle = "white";
    ctx.fillText(playerList[0].MP.toFixed(0) + " / " + playerList[0].MAX_MP, canvas.width - 150 + absX, 296 + absY);
  }
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
  ctx.fillStyle = "red";

  //Enemies Damage
  for (var i = 0; i < damageNumberList.length; i++) {
    for (var j = 0; j < enemyList.length; j++) {
      if (damageNumberList[i][4] == j) { 

        damageNumberList[i][1] = enemyList[j].X; 
        damageNumberList[i][2] = enemyList[j].Y - (damageNumberList[i][3] + 12); 
      }
    }

    ctx.fillText("-" + damageNumberList[i][0], damageNumberList[i][1], damageNumberList[i][2]);
    damageNumberList[i][3]++;

    if (damageNumberList[i][3] > 30) { damageNumberList.splice(i, 1); }
  }
  //Players Damage
  for (var i = 0; i < playerDamageNumberList.length; i++) {
    for (var j = 0; j < playerList.length; j++) {
      if (playerDamageNumberList[i][4] == j) { 

        playerDamageNumberList[i][1] = playerList[j].X; 
        playerDamageNumberList[i][2] = playerList[j].Y - (playerDamageNumberList[i][3] + 12); 
      }
    }

    ctx.fillText("-" + playerDamageNumberList[i][0], playerDamageNumberList[i][1], playerDamageNumberList[i][2]);
    playerDamageNumberList[i][3]++;

    if (playerDamageNumberList[i][3] > 30) { playerDamageNumberList.splice(i, 1); }
  }
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

  var i = 0;
  var p = 0;

  //Player bullets
  for (var k = 0; k < bulletList.length; k++) {
    //Enemies
    for (var j = 0; j < enemyList.length; j++) {
      
      if (i >= 0 && hitboxIntersectCheck(bulletList[i], enemyList[j])) {

        enemyList[j].HP -= bulletList[i].damage;
        damageNumberList.push([bulletList[i].damage.toFixed(0), enemyList[j].X, enemyList[j].Y - 10, 0, j]);
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
    i++;
  }
  //Enemy Bullets
  for (var k = 0; k < enemyBulletList.length; k++) {
    //Players
    for (var j = 0; j < playerList.length; j++) {
      
      if (p >= 0 && hitboxIntersectCheck(enemyBulletList[p], playerList[j])) {

        //Detect which enemy bullet came from.
        var bulletOwner = enemyBulletList[p].owner;

        playerList[j].HP -= enemyBulletList[p].damage;
        playerDamageNumberList.push([enemyBulletList[p].damage, playerList[j].X, playerList[j].Y - 10, 0, j]);
        enemyBulletList.splice(p, 1);
        p--;

        if (playerList[j].HP <= 0) { playerList[j].deathScene(bulletOwner); }
      }
    }
    p++;
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
    if (mouseY < item.bottom() && mouseY > item.top() && mouseX > item.left() && mouseX < item.right()) {

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
    ctx.fillRect(mouseX, mouseY, -200, -280);
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 3;
    ctx.strokeRect(mouseX, mouseY, -200, -280);

    //Text
    ctx.fillStyle = "#111";
    ctx.fillText(myThingy.itemName, mouseX - 190, mouseY - 260);
    ctx.font = "14px Palatino";
    ctx.fillText(myThingy.itemEffectText, mouseX - 190, mouseY - 230);
    ctx.fillText(myThingy.itemDescription, mouseX - 190, mouseY - 200);
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
  ctx.fillRect(X, Y, width, height);

  //Make hitbox for button visible
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#DDD";
  //ctx.strokeRect(X, Y, width, height);

  //If mouse is over button
  if (mouseX > X && mouseX < X + width && mouseY > Y && mouseY < Y + height) {
    
    //Hover color
    ctx.fillStyle = "#EBE1A0";

    if (mouseClicked) {

      //For debug
      console.log("Positon: " + playerList[0].X + "x | " + playerList[0].Y + "y" + "\nGame Screen: " + screenType);
      
      //Function that button executes on click.
      if (functionToPerform) { functionToPerform(); }

      screenType = screenTypeGiven;
      mouseClicked = false;
    }
  }
  
  ctx.shadowColor = "#000";
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
//END RANDOM TOOLS
//GAME SCREEN WINDOW =============
function checkFrameOfReference(Xgiven, Ygiven) {

  var x = FRAME_OF_REFERENCE[0] - Xgiven;
  var y = FRAME_OF_REFERENCE[1] - Ygiven;
  
  //Changes game's frame of reference so the player is centered on screen.
  if (FRAME_OF_REFERENCE[0] != Xgiven || FRAME_OF_REFERENCE[1] != Ygiven) {

    ctx.translate(x, y);

    mouseX -= x;
    mouseY -= y;

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

    if ((mouseClicked || keys.T) && playerList[0].weaponCooldown <= 0 && !playerList[0].mouseOccupied) { newBullet(); }
    if (keys.B && playerList[0].MP >= playerList[0].special_MP_cost && playerList[0].specialCooldown <= 0) { spellBomb(); }

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
  }

  if (isEqualTo(screenType, "MAIN_MENU", "INSTRUCTIONS", "DEATH_SCREEN", "OPTIONS")) { 

  	backgroundScrollingScene(); 
  	checkFrameOfReference(0, 0);
  }
  if (screenType == "MAIN_MENU") { drawMainMenuScreen(); }
  if (screenType == "INSTRUCTIONS") { drawInstructionsScreen(); }
  if (screenType == "DEATH_SCREEN") { drawDeathScreen(); }
  if (screenType == "OPTIONS") { drawOptionsScreen(); }
  if (screenType == "CLASS_SELECTION") { drawClassSelectionScreen(); }
}
function drawMainMenuScreen () {

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
}
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
  ctx.fillText(playerList[0].userName + " was killed", (canvas.width / 3) + 30, 200);
  
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
  ctx.shadowColor = "#000";
  ctx.fillText("Class Selection", 290, 200);
  ctx.shadowBlur = 0;

  for (var i = 0; i < classSelectionPics.length; i++) {
    if (mouseX > 260 + (i * 90) && mouseX < 260 + (i * 90) + 64 && mouseY > canvas.height / 2 && mouseY < (canvas.height / 2) + 64) {

      ctx.shadowColor = "white";

      if (mouseClicked) { 

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

    chatLog.push(["THERE ARE " + enemies_remaining_in_realm + " ENEMIES REMAINING!", 16, 201, "Game Boss"]);

  } else {

    chatLog.push(["YOU MUST PAY FOR YOUR SINS!!!", 16, 201, "Game Boss"]);
    screenType = "BOSS_SCREEN";
    lastKnownLocation = [playerList[0].X, playerList[0].isViewingLoot];
    if (lastKnownLocation[0] < 4000) {

      console.log("X: " + lastKnownLocation[0] + "\nViewing Loot: " + lastKnownLocation[1] + "\nGame Screen: " + screenType);
    }
    
  }
  for (var i = 0; i < chatLog.length; i++) { chatLog[i][1] += 20; }

 } , 60000);
var drawTheGame = setInterval(drawGameScreen, (1000 / GAME_FPS));

//--------------------------------
//END OF FILE
//--------------------------------