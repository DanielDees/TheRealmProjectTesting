//GAME CLASSES ===================
function player () {
  
  //Position
  this.X = 4000;
  this.Y = 4000;

  //Dimensions
  this.height = 40;
  this.width = 40;

  //Username
  this.name = defaultNamesList[Math.floor((Math.random() * defaultNamesList.length) + 0).toFixed(0)];
  this.ImageArray = archer_Pics;
  this.Image = archer_Pics[3][0];
  this.timeToSpriteChange = 0;

  //Death Stats
  this.deathGlory = 0;
  this.killCount = 0;
  this.killedBy = "Nothing???";

  //Weapon and Sprite
  this.bulletImage = player_Bullet_Pic;

  //Speed
  this.speed = 100;
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
  this.damageNumbers = [];

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

  //Weapon
  this.fireWeapon = function() {

    if (this.weaponCooldown <= 0) {

      //Player data generating projectile
      var data = {

        //Location
        X: this.X + this.width / 2,
        Y: this.Y + this.height / 2,

        //Dimensions
        width: 26,
        height: 26,

        //Stats
        spd: 10,
        damage: (this.damage / 10) * this.damageVariance(),
        lifeTime: 0.5 * 62.5,

        //Rendering info
        angle: null,
        image: this.bulletImage,
      }

      bulletList.push(new playerBullet(data));

      this.weaponCooldown = this.MAX_WEAPON_COOLDOWN();
    }
  }
  //Special Ability
  //Update this function to take the ability of special item in equipment slot once equipment has been added.
  this.use_ability = function() {

    if (this.specialCooldown <= 0 && this.MP >= this.special_MP_cost) {
      
      var bombProjectiles = 20;
      var dgInc = (360 / bombProjectiles);

      //Spellbomb
      for (var i = 1; i <= bombProjectiles; i++) { 

        //Player data generating projectiles
        var data = {

          //Location
          X: mouse.X,
          Y: mouse.Y,

          //Dimensions
          width: 26,
          height: 26,

          //Stats
          spd: 10,
          damage: (this.damage / 10) * this.damageVariance(),
          lifeTime: 0.5 * 62.5,

          //Rendering info
          angle: (i * dgInc) * (Math.PI / 180),
          image: this.bulletImage,
        }

        bulletList.push(new playerBullet(data));
      }

      this.MP -= this.special_MP_cost;
      this.specialCooldown = this.MAX_SPECIAL_COOLDOWN;
    }
  }
  //This function is under construction. Getting ready for equipment application.
  this.updateEquipment = function() {

    for (maxDmg in weaponSlot.item) {
      
      this.maxWeaponDamage = maxDmg;

    }
    for (minDmg in weaponSlot.item) {
      
      this.minWeaponDamage = minDmg;

    }
  }
  this.updateInventory = function() {

    for (var j = 0; j < this.inventory.length; j++) {

      if (this.inventory[j].item) {
        
        //When not clicking
        if (!mouse.clicked) {

          //Item moving/swapping
          for (var k = 0; k < this.inventory.length; k++) {

            //If mouse was released over slot k
            if (mouseIsTouching(this.inventory[k]) && mouse.item) {

              //Move/Swap item to new inventory slot
              if (hitboxIntersectCheck(this.inventory[j].item, this.inventory[k])) {

                swapItems(this.inventory[k], this.inventory[j]);
                break;
              }
            }
          }
          //Release items
          if (this.inventory[j].item) {

            //Update inventory slot to ensure item is in proper location. This prevents random item dropping.
            this.inventory[j].draw(1);

            //Drop item on ground.
            if (this.inventory[j].item.X < this.inventory[0].left() - 36 || this.isViewingLoot[0] != -1 && (this.inventory[j].item.Y > this.inventory[5].bottom())) {
              
              this.dropItemFromSlot(j);
              break;
            }
            //Release item and return to slot if not dropped.
            if (this.inventory[j].item.beingHeld) { 

              mouse.item = null;
              this.inventory[j].item.beingHeld = false;
            }
          }
        }
      }
    }
  }
  this.drawEquipmentSlots = function(i) {

    //Equipment inventory
    for (var col = 0; col < 4; col++) {
      
      var topInv = 372;
      if (this.equipInv.length < 4) { 

          //Default X, Y, col, row, itemGiven
          this.equipInv.push(new inventorySlot(canvas.width - 184, topInv, col, 0));
      }
      else { this.equipInv[col].draw(i); }

      //Draw Item Description
      if (!mouse.clicked && this.equipInv[col].item) {

        drawItemDescription(this.equipInv[col].item); 
      }
    }
  }
  this.drawInventorySlots = function(i) {
      
    //Item Inventory
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
      if (!mouse.clicked && this.inventory[col].item) { 

        drawItemDescription(this.inventory[col].item); 
      }
    }
  }
  this.drawInventory = function() {

    //Perform all movement/item swapping needed.
    this.updateInventory();

    //Draw slots on first pass, items on second.
    for (var i = 0; i < 2; i++) {
      
      //Draw Equipment Slots
      this.drawEquipmentSlots(i);

      //Draw Item Inventory
      this.drawInventorySlots(i);
    }
  }
  this.dropItemFromSlot = function(i) {

    //Drop into existing loot bag.
    if (this.isViewingLoot[0] != -1) {

      //Item moving/swapping with loot bag
      for (var k = 0; k < 8; k++) {

        //Move/Swap item to loot bag inventory slot
        if (mouseIsTouching(lootBagList[this.isViewingLoot[0]].inventory[k]) && mouse.item) {

          swapItems(this.inventory[i], lootBagList[this.isViewingLoot[0]].inventory[k]);
          break;
        }
        //If not dropping item into specific slot
        else if (mouse.X < canvas.width - 190 + FRAME_OF_REFERENCE[0]) {

          //Drop into loot bag being viewed
          lootBagList[this.isViewingLoot[0]].addToInventory(this.inventory[i].item);

          //Clear item from it's original slot
          this.inventory[i].item = null;
          break;
        }
        //If not dropped into inventory slot, return to original slot
        else {

          this.inventory[i].item.beingHeld = false;
        }
      }
    }
    //Create new loot bag and drop
    else if (this.isViewingLoot[0] == -1) {

      lootBagList.push(new lootBag(this.X, this.Y, lootBagPics[0]));
      lootBagList[lootBagList.length - 1].addToInventory(this.inventory[i].item);

      //Clear item from it's original slot
      this.inventory[i].item = null;
    }
  }
  //Leveling up
  this.levelUp = function() {
    
    while (this.level < this.MAX_level && this.EXP >= this.levelExpReq) {
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
  //Movement
  this.move = function() {

    //Single directional movement

    //UP
    if (keys.W && !keys.A && !keys.D) { this.Y -= this.speedFormula; }
    //LEFT
    if (keys.A && !keys.W && !keys.S) { this.X -= this.speedFormula; }
    //DOWN
    if (keys.S && !keys.A && !keys.D) { this.Y += this.speedFormula; }
    //RIGHT
    if (keys.D && !keys.W && !keys.S) { this.X += this.speedFormula; }

    //Two keys pressed

    //UP-RIGHT
    if (keys.W && keys.A && !keys.D) { this.Y -= this.speedFormula / Math.sqrt(2); }
    //UP-LEFT
    if (keys.W && !keys.A && keys.D) { this.Y -= this.speedFormula / Math.sqrt(2); }
    //LEFT-UP
    if (keys.A && keys.W && !keys.S) { this.X -= this.speedFormula / Math.sqrt(2); }
    //LEFT-DOWN
    if (keys.A && !keys.W && keys.S) { this.X -= this.speedFormula / Math.sqrt(2); }
    //DOWN-LEFT
    if (keys.S && keys.A && !keys.D) { this.Y += this.speedFormula / Math.sqrt(2); }
    //DOWN-RIGHT
    if (keys.S && !keys.A && keys.D) { this.Y += this.speedFormula / Math.sqrt(2); }
    //RIGHT-UP
    if (keys.D && keys.W && !keys.S) { this.X += this.speedFormula / Math.sqrt(2); }
    //RIGHT-DOWN
    if (keys.D && !keys.W && keys.S) { this.X += this.speedFormula / Math.sqrt(2); }
  }
  //Deals damage to player
  this.takeDamage = function(damageTaken) {

    this.HP -= damageTaken;

    var damageData = {

      damage: damageTaken,
      age: 10
    }

    this.damageNumbers.push(damageData);
  }
  //Shows player damage numbers
  this.showDamageNumbers = function() {

    //Damage number color
    ctx.fillStyle = "red";

    for (var i = 0; i < this.damageNumbers.length; i++) {

      var num = this.damageNumbers[i];

      //Show damage text
      ctx.fillText("-" + num.damage.toFixed(0), this.X + 8, this.Y - num.age);

      //Increase number age
      if (num.age > 40) { this.damageNumbers.splice(i, 1); }
      else { this.damageNumbers[i].age++; }
    }
  }
  //Draw Player
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
function playerBullet (data) {

  //Position
  this.X = data.X;
  this.Y = data.Y;

  //Dimensions
  this.height = data.height;
  this.width = data.width;

  //Calculates angle of attack
  var deltaY = -(playerList[0].Y + (playerList[0].height / 2) - mouse.Y);
  var deltaX = -(playerList[0].X + (playerList[0].width / 2) - mouse.X);

  //Convert from Degrees to Rad
  this.angle = data.angle || getMouseAngle("rad");

  this.damage = data.damage;
  this.spd = data.spd;

  this.lifeTime = data.lifeTime;
  this.Image = data.image;
  
  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  //Movement Logic
  this.move = function() {

    this.X += this.spd * Math.cos(this.angle);
    this.Y += this.spd * Math.sin(this.angle);
    this.lifeTime--;
  }
  this.draw = function() {

    //Save original X/Y canvas rendering
    ctx.save();

    //Move projectile to X:0 Y:0
    ctx.translate(this.X, this.Y);
    ctx.rotate(this.angle + (45 * (Math.PI / 180)));

    //Draw Image centered on X:0 Y:0
    ctx.drawImage(this.Image, -(this.width / 2), -(this.height / 2), this.width, this.height);

    //Restore original X/Y canvas rendering
    ctx.restore();
  }
}
function loot (data) {

  //Position
  this.X = 10;
  this.Y = 10;

  //Dimensions
  this.height = 32;
  this.width = 32;

  //Info
  this.itemType = data.type;
  this.image = data.image;
  this.beingHeld = false;

  this.itemName = data.name || "Item Name";
  this.itemEffectText = data.effect || "Item Effect";
  this.itemDescription = data.lore || "Item Lore";

  //Effect
  this.itemEffect = data.itemEffect;
  
  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  //Gives Loot
  this.give = function() {
    
    //Perfrom item action
    if (this.itemEffect) { this.itemEffect(); }

    if (this.image == potionList[1] && playerList[0].speed < playerList[0].MAX_SPEED) { 

      playerList[0].speed++; 
      playerList[0].speedFormula = 3 + (7 * (playerList[0].speed / 100));
    }
    if (this.image == potionList[0]) { playerList[0].damage++; }
    if (this.image == potionList[2] && playerList[0].dexterity < playerList[0].MAX_DEXTERITY) { 

      playerList[0].dexterity++; 
    }
    if (this.image == potionList[3] && playerList[0].wizardry < playerList[0].MAX_WIZARDRY) { playerList[0].wizardry++; }
    if (this.image == potionList[4] && playerList[0].youth < playerList[0].MAX_YOUTH) { playerList[0].youth++; }
    if (this.image == armorList[0]) { playerList[0].MAX_HP += 10; }
    if (this.image == armorList[1]) { playerList[0].MAX_HP += 20; }
    if (this.image == armorList[2]) { playerList[0].MAX_HP += 30; }
    if (this.image == armorList[3]) { playerList[0].MAX_HP += 40; }
    if (this.image == weaponBowList[0][0]) { 

      playerList[0].bulletImage = weaponBowList[0][1];
      playerList[0].maxWeaponDamage = 10;
      playerList[0].minWeaponDamage = 5;
    }
    if (this.image == weaponBowList[1][0]) { 

      playerList[0].bulletImage = weaponBowList[1][1]; 
      playerList[0].maxWeaponDamage = 25;
      playerList[0].minWeaponDamage = 15;
    }
    if (this.image == weaponBowList[2][0]) { 

      playerList[0].bulletImage = weaponBowList[2][1]; 
      playerList[0].maxWeaponDamage = 45;
      playerList[0].minWeaponDamage = 30;
    }
  }
  //Check if mouse holding this
  this.hold = function() {

    //Select item if clicking it and not holding anything else
    if (mouseIsTouching(this) && !mouse.item || this.beingHeld) {
      
      this.beingHeld = true;
      mouse.item = this;

      //Center on mouse
      this.X = mouse.X - (this.width / 2);
      this.Y = mouse.Y - (this.height / 2);
    }
    //Remove item from hand if not clicking.
    else if (!mouse.clicked && this.beingHeld) {

      this.beingHeld = false;
      mouse.item = null;
    }
  }
  //Draw Item
  this.draw = function() {

    ctx.drawImage(this.image, this.X, this.Y, this.width, this.height);
  }
}
function lootBag (defaultX, defaultY, imageGiven) {

  //Position
  this.X = defaultX;
  this.Y = defaultY;

  //Dimensions
  this.height = 25;
  this.width = 25;

  //Info
  this.ID = { 

    value: Math.random(),
    type: "lootbag"
  };

  this.sprite = imageGiven;
  this.lifeTime = 30 * 62.5;
  this.inventory = [];
  
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

      if (this.inventory[i].item) { return false; }
    }

    //Delete self if empty
    lootBagList.splice(lootBagList.indexOf(this), 1);
  }
  this.drawInventory = function() {

    //Create Inventory
    this.createInventory();

    for (var j = 0; j < this.inventory.length; j++) {

      if (this.inventory[j].item) {

        if (!(mouse.clicked && this.inventory[j].item.beingHeld)) {

          //Item move/swap with other slots
          for (var k = 0; k < this.inventory.length; k++) {

            //If mouse was released over slot k
            if (mouseIsTouching(this.inventory[k]) && mouse.item) {

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
            if (mouseIsTouching(playerList[0].inventory[k]) && mouse.item) {

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

              mouse.item = null;
              this.inventory[j].item.beingHeld = false;
            }
          }
        }
      }
    }
    //Draw slots on first pass, items on second
    for (var i = 0; i < 2; i++) {
      for (var col = 0; col < 8; col++) {

        this.inventory[col].draw(i);

        //Draw Item Description
        if (!mouse.clicked && this.inventory[col].item) { 

          drawItemDescription(this.inventory[col].item); 
        }
      }
    }

    //Delete self if Empty
    this.checkIfEmpty();
  }
  this.draw = function() {

    ctx.fillStyle = "#9E6F31";
    ctx.drawImage(this.sprite, this.X, this.Y, 35, 28);
    this.lifeTime--;
  }
}
function inventorySlot (defaultX, defaultY, col, row, itemGiven) {

  //Dimensions
  this.width = 40;
  this.height = 40;

  //Position
  this.X = defaultX + (this.width * col) - (this.width * 4 * row) + (3 * col - (row * 12));
  this.Y = defaultY + (this.height * row) + (row * 3);

  this.item = itemGiven;

  this.top = function() { return this.Y + FRAME_OF_REFERENCE[1]; }
  this.bottom = function() { return this.Y + this.height + FRAME_OF_REFERENCE[1]; }
  this.left = function() { return this.X + FRAME_OF_REFERENCE[0]; }
  this.right = function() { return this.X + this.width + FRAME_OF_REFERENCE[0]; }

  this.draw = function(i) {

    if (mouse.clicked) {

      //Check if giving item
      this.giveItem();

      //Hold item
      if (this.item) { this.item.hold(); }
    }

    //If item in slot not being held
    if (this.item && !this.item.beingHeld) {

      //Return item to slot
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

      //Draw inventory slot item
      this.item.draw();
    }
  }
  this.giveItem = function() {

    //Give item and delete it
    if (keys.SHIFT && mouseIsTouching(this) && this.item && !mouse.item) { 

      this.item.give(); 
      this.item = null;
      mouse.clicked = false;
    }
  }
}
function portal (data) {

  //Position
  this.X = data.X;
  this.Y = data.Y;

  //Dimensions
  this.height = 42;
  this.width = 42;

  //Info
  this.ID = { 

    value: Math.random(),
    type: "portal",
  };

  this.Image = data.image;
  this.name = data.name;
  this.destination = data.destination;

  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  this.draw = function() {

    ctx.drawImage(this.Image, this.X, this.Y, this.height, this.width);
  }

  //Button info
  this.buttonData = {

    //Location
    X: function() { return (canvas.width - 180 + FRAME_OF_REFERENCE[0]) },
    Y: function() { return (canvas.height - 50 + FRAME_OF_REFERENCE[1]) },

    //Text
    text: this.name,
    font: "20px Arial",
    color: "#FFF",

    //Action
    action: function() { screenType = data.destination; },
  }

  //Create button
  this.button = new button(this.buttonData);

  this.drawButton = function () {

    //View Portal if touching it and not viewing another portal.
    if (hitboxIntersectCheck(this, playerList[0]) && (playerList[0].isViewingLoot[1] == -1 || playerList[0].isViewingLoot[1] == this.ID)) {
        
        //Show portal button        
        this.button.draw();

        playerList[0].isViewingLoot[1] = this.ID;
    }
    else if (playerList[0].isViewingLoot[1] == this.ID) {

      playerList[0].isViewingLoot[1] = -1;
    }
  }
}
function progressBar (data) {

  //Location
  this.X = data.X;
  this.Y = data.Y;

  //Text Location
  this.textX = data.textX;
  this.textY = data.textY;

  //Dimensions
  this.width = data.width || 175;
  this.height = data.height || 18;

  //Colors
  this.bgColor = data.bgColor || "grey";
  this.barColor = data.barColor || "white";

  //Fill level
  this.min = data.min || "Not Specified";

  //Max bar value
  this.max = data.max || "Not Specified";

  //Hitbox
  this.top = function() { return this.Y(); }
  this.bottom = function() { return this.Y() + this.height; }
  this.left = function() { return this.X(); }
  this.right = function() { return this.X() + this.width; }

  this.draw = function() {

    //Bar background
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(this.X(), this.Y(), this.width, this.height);

    //Bar fill level
    ctx.fillStyle = this.barColor();
    ctx.fillRect(this.X(), this.Y(), this.width * (this.min() / this.max()), this.height);

    //Text
    if (mouseIsTouching(this)) {

      ctx.fillStyle = "white";
      ctx.fillText(this.min() + " / " + this.max(), this.textX(), this.textY());
    }
  }
}
function button (data) {

  //Location
  this.X = data.X;
  this.Y = data.Y;

  //Dimensions
  this.width = data.width;
  this.height = data.height || parseInt(data.font) + 10;

  //Text
  this.text = data.text || "Not Specified";
  this.textHeight = parseInt(data.font);

  //Style
  this.font = data.font || "25px Palatino";
  this.blur = data.blur || 10;
  this.color = data.color || "white";
  this.bgColor = data.bgColor || "#696969";
  this.hoverColor = data.hoverColor || "#EBE1A0";

  //Function button performs
  this.action = data.action;

  //Hitbox
  this.top = function() { return this.Y(); }
  this.bottom = function() { return this.Y() + this.height; }
  this.left = function() { return this.X(); }
  this.right = function() { return this.X() + this.width; }

  this.draw = function() {

    //Change font size before measuring
    ctx.font = this.font;
    this.width = ctx.measureText(this.text).width + 15;

    //Button rectangle
    ctx.fillStyle = this.bgColor;
    ctx.fillRect(this.X(), this.Y(), this.width, this.height);

    //Make hitbox for button visible
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#DDD";
    //ctx.strokeRect(this.X(), this.Y(), this.width, this.height);

    //On mouseover
    if (mouseIsTouching(this)) {

      //Change text color
      ctx.fillStyle = this.hoverColor;

      //On click
      if (mouse.clicked) {

        //Debug
        //console.log("Positon: " + playerList[0].X.toFixed(0) + "x | " + playerList[0].Y.toFixed(0) + "y" + "\nGame Screen: " + screenType);
        
        //Execute action
        if (this.action) { this.action(); }

        mouse.clicked = false;
      }
    }
    //Normal text color
    else { ctx.fillStyle = this.color; }

    //Draw text
    ctx.shadowBlur = this.blur;
    ctx.fillText(this.text, this.X() + 6, this.Y() + this.textHeight);
    ctx.shadowBlur = 0;
  }
}
function obstacle (data) {

  //Location
  this.X = data.X;
  this.Y = data.Y;

  //Dimensions
  this.width = data.width;
  this.height = data.height;

  //Sprite
  this.image = data.image;

  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  //Draw
  this.draw = function() {

    ctx.drawImage(this.image, this.X, this.Y, this.width, this.height);
  };
}
//END GAME CLASSES ===============