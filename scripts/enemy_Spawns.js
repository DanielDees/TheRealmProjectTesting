//SPAWNING SYSTEMS ===============

function spawn_Enemy_Bug () {
  if (enemyList.length < 35) { 
    //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType, Enemy Name
    enemyList.push(new enemy(115, 15, 3, 3, 25, 25, enemy_bug_Pic, "random", "Enemy Bug", "BOSS_SCREEN")); 
  };
}
function spawn_Enemy_Skull () {
  if (enemyList.length < 40) { 
    //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType, Enemy Name
    enemyList.push(new enemy(300, 28, 10, 2, 28, 28, enemy_skull_Pic, "chase", "Enemy Skull", "BOSS_SCREEN")); 
  };
}
function spawn_Enemy_Skull_Boss () {
  if (enemyList.length < 45) { 
    //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType, Enemy Name
    enemyList.push(new enemy(2500, 250, 56, 1, 60, 60, enemy_skull_boss_Pic, "random", "Enemy Skull Boss", "BOSS_SCREEN")); 
  };
}
function spawn_Game_Boss () {
  //HP, expReward, attackDamage, speed, width, height, imageGiven, movementType, Enemy Name
  enemyList.push(new enemy(40000, 3000, 120, 3, 120, 120, enemy_skull_boss_Pic, "random", "Game Boss", "GAME_SCREEN"));
}
function spawnEnemy () {
  
  var difficulty = (Math.random() * 1000) + 1;
  if (difficulty >= 100 + playerList[0].level) { spawn_Enemy_Bug(); };
  if (difficulty >= 700 - playerList[0].level) { spawn_Enemy_Skull(); };
  if (difficulty >= 990 - playerList[0].level) { spawn_Enemy_Skull_Boss(); };
}
//END SPAWNING SYSTEMS