 //------------------------
 //All game Images are here
 //------------------------

//File locations
var PATH = {

      characters: "sprites/characters/",
      groundTiles: "sprites/groundTiles/",
      items: "sprites/items/",
      consumables: "sprites/consumables/",
      projectiles: "sprites/projectiles/",
      enemies: "sprites/enemies/",
      portals: "sprites/portals/",
      lootBags: "sprites/loot_bags/"
};

//MAP TILES

//Stone Ground types.
var stoneGround = [new Image(), new Image(), new Image(), new Image()];
      stoneGround[0].src = PATH.groundTiles + "oldStoneFloor.png";
      stoneGround[1].src = PATH.groundTiles + "oldStoneFloorCracked.png";
      stoneGround[2].src = PATH.groundTiles + "oldStoneFloorHole.png";
      stoneGround[3].src = PATH.groundTiles + "oldStoneFloorSmallCracked.png";
      
//Water Ground types.
var waterGround = [new Image()];
      waterGround[0].src = PATH.groundTiles + "shallowWater.png";

//Grassy Ground types.
var grassGround = [new Image(), new Image(), new Image(), new Image()];
      grassGround[0].src = PATH.groundTiles + "grassGround1.png";
      grassGround[1].src = PATH.groundTiles + "grassGround2.png";
      grassGround[2].src = PATH.groundTiles + "grassGround3.png";
      grassGround[3].src = PATH.groundTiles + "grassGround4.png";

//Portals
var portalTypes = [new Image(), new Image()];
      portalTypes[0].src = PATH.portals + "portal_Placeholder.png";
      portalTypes[1].src = PATH.portals + "default_portal.png";

//ENEMIES
      var enemy_bug_Pic = new Image();
      enemy_bug_Pic.src = PATH.enemies + "enemy_bug.png";
      var enemy_skull_Pic = new Image();
      enemy_skull_Pic.src = PATH.enemies + "enemy_skull.png";
      var enemy_skull_boss_Pic = new Image();
      enemy_skull_boss_Pic.src = PATH.enemies + "enemy_skull_boss.png";

//CHARACTERS
var classSelectionPics = [new Image(), new Image(), new Image()];
      classSelectionPics[0].src = PATH.characters + "characterSprite.png";
      classSelectionPics[1].src = PATH.characters + "archer_right_Pic.png";
      classSelectionPics[2].src = PATH.characters + "mage_right_Pic.png";

//Default Class
var warrior_Pics = [[new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()]];
      //===========
      warrior_Pics[0][0].src = PATH.characters + "characterSprite.png";
      warrior_Pics[0][1].src = PATH.characters + "characterSprite.png";
      warrior_Pics[0][2].src = PATH.characters + "characterSprite.png";
      //===========
      warrior_Pics[1][0].src = PATH.characters + "characterSprite.png";
      warrior_Pics[1][1].src = PATH.characters + "characterSprite.png";
      warrior_Pics[1][2].src = PATH.characters + "characterSprite.png";
      //===========
      warrior_Pics[2][0].src = PATH.characters + "characterSprite.png";
      warrior_Pics[2][1].src = PATH.characters + "characterSprite.png";
      warrior_Pics[2][2].src = PATH.characters + "characterSprite.png";
      //===========
      warrior_Pics[3][0].src = PATH.characters + "characterSprite.png";
      warrior_Pics[3][1].src = PATH.characters + "characterSprite.png";
      warrior_Pics[3][2].src = PATH.characters + "characterSprite.png";

//Archer Class
var archer_Pics = [[new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()]];
      //===========
      archer_Pics[0][0].src = PATH.characters + "archer_right_Pic.png";
      archer_Pics[0][1].src = PATH.characters + "archer_right_move1_Pic.png";
      archer_Pics[0][2].src = PATH.characters + "archer_right_Pic.png";
      //===========
      archer_Pics[1][0].src = PATH.characters + "archer_left_Pic.png";
      archer_Pics[1][1].src = PATH.characters + "archer_left_move1_Pic.png";
      archer_Pics[1][2].src = PATH.characters + "archer_left_Pic.png";
      //===========
      archer_Pics[2][0].src = PATH.characters + "archer_up_Pic.png";
      //Adjusted for distortion in player rendertoscreen.
      archer_Pics[2][1].src = PATH.characters + "archer_up_move1_Pic.png";
      archer_Pics[2][2].src = PATH.characters + "archer_up_move2_Pic.png";
      //===========
      archer_Pics[3][0].src = PATH.characters + "archer_down_Pic.png";
      //Adjusted for distortion in player rendertoscreen.
      archer_Pics[3][1].src = PATH.characters + "archer_down_move1_Pic.png";
      archer_Pics[3][2].src = PATH.characters + "archer_down_move2_Pic.png";

//Mage Class
var mage_Pics = [[new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()], [new Image(), new Image(), new Image()]];
      //===========
      mage_Pics[0][0].src = PATH.characters + "mage_right_Pic.png";
      mage_Pics[0][1].src = PATH.characters + "mage_right_move1_Pic.png";
      mage_Pics[0][2].src = PATH.characters + "mage_right_Pic.png";
      //===========
      mage_Pics[1][0].src = PATH.characters + "mage_left_Pic.png";
      mage_Pics[1][1].src = PATH.characters + "mage_left_move1_Pic.png";
      mage_Pics[1][2].src = PATH.characters + "mage_left_Pic.png";
      //===========
      mage_Pics[2][0].src = PATH.characters + "mage_up_Pic.png";
      mage_Pics[2][1].src = PATH.characters + "mage_up_move1_Pic.png";
      mage_Pics[2][2].src = PATH.characters + "mage_up_Pic.png";
      //===========
      mage_Pics[3][0].src = PATH.characters + "mage_down_Pic.png";
      mage_Pics[3][1].src = PATH.characters + "mage_down_move1_Pic.png";
      mage_Pics[3][2].src = PATH.characters + "mage_down_Pic.png";

//BULLETS
var player_Bullet_Pic = new Image();
      player_Bullet_Pic.src = PATH.projectiles + "charBullet1.png";

//ITEMS

//Weapons
var weaponBowList = [[new Image(), new Image()], [new Image(), new Image()], [new Image(), new Image()]];
      weaponBowList[0][0].src = PATH.items + "shadowBow.png";
      weaponBowList[0][1].src = PATH.projectiles + "shadowBowArrow.png";
      weaponBowList[1][0].src = PATH.items + "innocentBloodBow.png";
      weaponBowList[1][1].src = PATH.projectiles + "innocentBloodBowArrow.png";
      weaponBowList[2][0].src = PATH.items + "SunsetBow.png";
      weaponBowList[2][1].src = PATH.projectiles + "SunsetBowArrow.png";

//Armors
var armorList = [new Image(), new Image(), new Image(), new Image()];
      armorList[0].src = PATH.items + "chestplate_T1.png";
      armorList[1].src = PATH.items + "chestplate_T2.png";
      armorList[2].src = PATH.items + "chestplate_T3.png";
      armorList[3].src = PATH.items + "chestplate_T4.png";

//Consumables
var potionList = [new Image(), new Image(), new Image(), new Image(), new Image()];
      potionList[0].src = PATH.consumables + "attack_Potion.png";
      potionList[1].src = PATH.consumables + "speed_Potion.png";
      potionList[2].src = PATH.consumables + "dexterity_Potion.png";
      potionList[3].src = PATH.consumables + "wizardry_Potion.png";
      potionList[4].src = PATH.consumables + "youth_Potion.png";

//Loot Bags
var lootBagPics = [new Image()];
      lootBagPics[0].src = PATH.lootBags + "brownLootBag.png";

//----------------------
//These comments are for
//better scrolling :)
//----------------------