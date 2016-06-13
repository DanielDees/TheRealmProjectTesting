//SPAWNING SYSTEMS ===============

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
  if (difficulty >= 990 - playerList[0].level) { spawn_Enemy_Skull_Boss(); }
  else if (difficulty >= 700 - playerList[0].level) { spawn_Enemy_Skull(); }
  else if (difficulty >= 100 + playerList[0].level) { spawn_Enemy_Bug(); }
}
//END SPAWNING SYSTEMS