"use strict";

//GAME CLASSES ===================
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
              if (collisions.collision(this.inventory[j].item, this.inventory[k])) {

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
              if (collisions.collision(this.inventory[j].item, playerList[0].inventory[k])) {

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
    if (collisions.collision(this, playerList[0]) && (playerList[0].isViewingLoot[1] == -1 || playerList[0].isViewingLoot[1] == this.ID)) {
        
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
  this.bgColor = data.bgColor || "#6E6E6E";
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
  this.image = data.img;

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