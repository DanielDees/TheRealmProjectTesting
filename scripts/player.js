function player () {
  
  //Position
  this.X = 4000;
  this.Y = 4000;

  //Dimensions
  this.height = 40;
  this.width = 40;

  //Username
  this.name = defaultNamesList[Math.floor((Math.random() * defaultNamesList.length))];
  this.ImageArray = archer_Pics;
  this.Image = archer_Pics[3][0];
  this.timeToSpriteChange = 0;
  this.dmgLog = [];

  //Death Stats
  this.glory = function() { return parseInt((this.EXP / 2000).toFixed(0)); };
  this.deathGlory = 0;
  this.killCount = 0;
  this.killedBy = "Nothing???";

  //Weapon and Sprite
  this.bulletImage = player_Bullet_Pic;

  //Speed
  this.spd = 30;
  this.MAX_SPD = 100;
  this.speedFormula = function() { return 3 + (7 * (this.spd / 100)); };

  //Damage
  this.dmg = 100;
  this.maxWeaponDamage = 5;
  this.minWeaponDamage = 1;
  this.damageVariance = function () { return (Math.random() * this.maxWeaponDamage) + this.minWeaponDamage; }

  //Dexterity
  this.dex = 200;
  this.MAX_DEX = 200;
  this.weaponCooldown = 0;
  this.MAX_WEAPON_COOLDOWN = function () { return 125 / (1 + (this.dex / 8)); }

  //Exp/Leveling
  this.EXP = 0;
  this.levelExpReq = 100;
  this.level = 1;
  this.MAX_level = 25;

  //HP
  this.HP = 200;
  this.MAX_HP = 200;

  //HP regen
  this.vit = 300;
  this.MAX_VIT = 1000;

  //MP
  this.MP = 150;
  this.MAX_MP = 150;

  //MP regen
  this.wis = 200;
  this.MAX_WIS = 400;

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
  this.top    = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left   = function() { return this.X; }
  this.right  = function() { return this.X + this.width; }

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
        damage: (this.dmg / 10) * this.damageVariance(),
        
        //Lifetime in seconds
        lifeTime: 0.5 * GAME_FPS,

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
          damage: (this.dmg / 10) * this.damageVariance(),
          lifeTime: 0.5 * GAME_FPS,

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
      //dex
      this.MAX_HP += Math.floor((Math.random() * 40) + 16);
      this.MAX_MP += Math.floor((Math.random() * 15) + 6);
      this.dex += Math.floor((Math.random() * 5) + 2);
      this.wis += Math.floor((Math.random() * 3) + 1); 
      this.dmg += Math.floor((Math.random() * 3) + 1);
      this.spd += Math.floor((Math.random() * 3) + 1);
      this.vit += Math.floor((Math.random() * 4) + 1);
      //EXP
      this.EXP -= this.levelExpReq;
      this.level++;
      this.levelExpReq += 150;

      //Refill Hp/Mp
      this.HP = this.MAX_HP;
      this.MP = this.MAX_MP;
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
    this.deathGlory += this.glory();
    this.killedBy = enemyKilledBy;
  }
  //Movement
  this.move = function() {

    //Single directional movement

    //UP
    if (keys.W && !keys.A && !keys.D) { this.Y -= this.speedFormula(); }
    //LEFT
    if (keys.A && !keys.W && !keys.S) { this.X -= this.speedFormula(); }
    //DOWN
    if (keys.S && !keys.A && !keys.D) { this.Y += this.speedFormula(); }
    //RIGHT
    if (keys.D && !keys.W && !keys.S) { this.X += this.speedFormula(); }

    //Two keys pressed

    //UP-RIGHT
    if (keys.W && keys.A && !keys.D) { this.Y -= this.speedFormula() / Math.sqrt(2); }
    //UP-LEFT
    if (keys.W && !keys.A && keys.D) { this.Y -= this.speedFormula() / Math.sqrt(2); }
    //LEFT-UP
    if (keys.A && keys.W && !keys.S) { this.X -= this.speedFormula() / Math.sqrt(2); }
    //LEFT-DOWN
    if (keys.A && !keys.W && keys.S) { this.X -= this.speedFormula() / Math.sqrt(2); }
    //DOWN-LEFT
    if (keys.S && keys.A && !keys.D) { this.Y += this.speedFormula() / Math.sqrt(2); }
    //DOWN-RIGHT
    if (keys.S && !keys.A && keys.D) { this.Y += this.speedFormula() / Math.sqrt(2); }
    //RIGHT-UP
    if (keys.D && keys.W && !keys.S) { this.X += this.speedFormula() / Math.sqrt(2); }
    //RIGHT-DOWN
    if (keys.D && !keys.W && keys.S) { this.X += this.speedFormula() / Math.sqrt(2); }
  }
  //Deals damage to player
  this.takeDamage = function(damageTaken) {

    this.HP -= damageTaken;

    var data = {

      damage: damageTaken,
      age: 10,
    }

    this.dmgLog.push(data);
  }
  //Shows player damage numbers
  this.showDamage = function() {

    //Damage number color
    ctx.fillStyle = "red";

    for (var i = 0; i < this.dmgLog.length; i++) {

      //Show damage text
      ctx.fillText("-" + this.dmgLog[i].damage.toFixed(0), this.X + 8, this.Y - this.dmgLog[i].age);

      //Increase number age
      if (this.dmgLog[i].age > 40) { this.dmgLog.splice(i, 1); }
      else { this.dmgLog[i].age++; }
    }
  }
  //Draw Player
  this.draw = function() { 

    //Image of player
    if (!isEqualTo(this.Image, archer_Pics[3][1], archer_Pics[2][1], archer_Pics[1][1], archer_Pics[0][1], mage_Pics[3][1], mage_Pics[2][1], mage_Pics[1][1], mage_Pics[0][1])) {

      ctx.drawImage(this.Image, this.X, this.Y, this.width, this.height);
    }
    else {

      var sub = 5;
      var shift = 0;

      //Modify for other size sprites.
      if (this.Image == archer_Pics[2][1]) { sub = 6; }
      if (this.Image == mage_Pics[2][1]) { sub = 6; }
      if (this.Image == archer_Pics[1][1]) { shift = 5; }
      if (this.Image == mage_Pics[1][1]) { shift = 5; }
      if (this.Image == mage_Pics[3][1]) { shift = 5; }

      ctx.drawImage(this.Image, this.X + shift, this.Y, this.width - sub, this.height);
    }
  }
}