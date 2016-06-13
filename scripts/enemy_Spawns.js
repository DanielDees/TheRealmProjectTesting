//Enemy Class
function enemy (data) {

  //Details
  this.Image = data.image;
  this.enemyName = data.name;
  this.portalDrop = data.portalDrop;
  this.damageNumbers = [];

  //Position
  this.X = playerList[0].X + (800 * Math.cos(Math.floor((Math.random() * 360) + 1)));
  this.Y = playerList[0].Y + (800 * Math.sin(Math.floor((Math.random() * 360) + 1)));

  //Dimensions
  this.height = data.height;
  this.width = data.width;

  //Projectile
  this.bulletSpeed = 6;
  this.bulletRadius = 15;

  this.HP = data.HP;
  this.MAX_HP = data.HP;
  this.speed = data.spd;
  
  this.damage = data.attack;
  this.expGiven = data.expReward;
  this.weaponCooldown = 0;
  this.MAX_WEAPON_COOLDOWN = function () { return 125; }
  
  //Movement
  this.moveCounter = 0;
  this.detectionRange = 320;
  this.movement_Pattern = data.movementType || "random";
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
    if (chance > 800 || this.enemyName == "Game Boss") { dropPortal(this.X, this.Y, this.portalDrop); }

    playerList[0].EXP += this.expGiven;
    playerList[0].killCount++;
  }
  //Deals damage to enemy
  this.takeDamage = function(damageTaken) {

    this.HP -= damageTaken;

    var damageData = {

      damage: damageTaken,
      age: 12
    }

    this.damageNumbers.push(damageData);
  }
  //Shows enemy damage numbers
  this.showDamageNumbers = function() {

    //Damage number color
    ctx.fillStyle = "red";

    for (var i = 0; i < this.damageNumbers.length; i++) {

      var num = this.damageNumbers[i];

      //Show damage text
      ctx.fillText("-" + num.damage.toFixed(0), this.X, this.Y - num.age);

      //Increase number age
      if (num.age > 42) { this.damageNumbers.splice(i, 1); }
      else { this.damageNumbers[i].age++; }
    }
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

    //Show Damage Taken
    this.showDamageNumbers();
  }
}
//Enemy Projectiles
function enemyBullet (bulletSpeed, bulletRadius, startX, startY, angleGiven, damageGiven, ownerGiven) {

  //Position
  this.X = startX;
  this.Y = startY;

  //Dimensions
  this.height = bulletRadius;
  this.width = bulletRadius;
  
  //Info
  this.owner = ownerGiven;
  this.speed = bulletSpeed;
  this.damage = damageGiven;
  this.angle = angleGiven;

  //Hitbox
  this.top = function() { return this.Y; }
  this.bottom = function() { return this.Y + this.height; }
  this.left = function() { return this.X; }
  this.right = function() { return this.X + this.width; }

  //Movement Logic
  this.move = function() {

    this.X += (this.speed * Math.cos(this.angle));
    this.Y += (this.speed * Math.sin(this.angle));
  }
  this.draw = function() {

    ctx.fillStyle = "#F00";
    ctx.fillRect(this.X, this.Y, this.width, this.height);
  }
}

//SPAWNING SYSTEMS ===============
var GAME_ENEMIES = {

  enemy_bug: {

    //Dimensions
    height: 25,
    width: 25,
    
    //Info
    HP: 115,
    expReward: 15,
    attack: 3,
    spd: 3,

    name: "Enemy Bug",
    image: enemy_bug_Pic,
    movementType: "random",
    portalDrop: "BOSS_SCREEN"
  },
  enemy_skull: {

    //Dimensions
    height: 28,
    width: 28,
    
    //Info
    HP: 300,
    expReward: 28,
    attack: 10,
    spd: 2,

    name: "Enemy Skull",
    image: enemy_skull_Pic,
    movementType: "chase",
    portalDrop: "BOSS_SCREEN"
  },
  enemy_skull_boss: {

    //Dimensions
    height: 60,
    width: 60,
    
    //Info
    HP: 2500,
    expReward: 250,
    attack: 56,
    spd: 1,

    name: "Enemy Skull Boss",
    image: enemy_skull_boss_Pic,
    movementType: "random",
    portalDrop: "BOSS_SCREEN"
  },
  Game_Boss: {

    //Dimensions
    height: 120,
    width: 120,
    
    //Info
    HP: 40000,
    expReward: 3000,
    attack: 120,
    spd: 3,

    name: "Game Boss",
    image: enemy_skull_boss_Pic,
    movementType: "random",
    portalDrop: "GAME_SCREEN"
  },
}

function spawn_Enemy_Bug () {
  if (enemyList.length < 35) { 
    enemyList.push(new enemy(GAME_ENEMIES.enemy_bug)); 
  };
}
function spawn_Enemy_Skull () {
  if (enemyList.length < 40) { 
    enemyList.push(new enemy(GAME_ENEMIES.enemy_skull)); 
  };
}
function spawn_Enemy_Skull_Boss () {
  if (enemyList.length < 45) { 
    //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType, Enemy Name
    enemyList.push(new enemy(GAME_ENEMIES.enemy_skull_boss)); 
  };
}
function spawn_Game_Boss () {
  //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType, Enemy Name
  enemyList.push(new enemy(GAME_ENEMIES.Game_Boss));
}
function spawnEnemy () {
  
  var difficulty = (Math.random() * 1000) + 1;
  if (difficulty >= 100 + playerList[0].level) { spawn_Enemy_Bug(); };
  if (difficulty >= 700 - playerList[0].level) { spawn_Enemy_Skull(); };
  if (difficulty >= 990 - playerList[0].level) { spawn_Enemy_Skull_Boss(); };
}
//END SPAWNING SYSTEMS