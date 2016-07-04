//Enemy AI Scripts

//MOVEMENT PATTERNS ==============
function movement_Pattern_Random (enemy) {

  if (enemy.moveCounter > 15) {

    var chance = Math.random() * 5;

    if (chance <= 1 && (enemy.X > playerList[0].X + 100 || enemy.X < playerList[0].X - 100)) { 
      enemy.movement = "left"; 
    }
    else if (chance <= 2 && (enemy.X < playerList[0].X + 100 || enemy.X < playerList[0].X - 100)) { 
      enemy.movement = "right";
    }
    else if (chance <= 3 && (enemy.Y < playerList[0].Y + 100 || enemy.Y < playerList[0].Y - 100)) { 
      enemy.movement = "up"; 
    }
    else if (chance <= 4 && (enemy.Y < playerList[0].Y + 100 || enemy.Y < playerList[0].Y - 100)) { 
      enemy.movement = "down"; 
    }
    else { enemy.movement = "stopped"; }

    enemy.moveCounter = 0;
  }

  if (enemy.movement == "up") { enemy.Y -= enemy.speed / 2; }
  if (enemy.movement == "left") { enemy.X -= enemy.speed / 2; }
  if (enemy.movement == "down") { enemy.Y += enemy.speed / 2; }
  if (enemy.movement == "right") { enemy.X += enemy.speed / 2; }

  enemy.moveCounter++;
}
function movement_Pattern_Chase (enemy) {

  if (enemy.Y > playerList[0].Y + 20 || enemy.X > playerList[0].X + 20 || enemy.Y < playerList[0].Y - 20 || enemy.X < playerList[0].X - 20) {

    //UP
    if (enemy.Y > playerList[0].Y) { enemy.Y -= enemy.speed; }
    //LEFT
    if (enemy.X > playerList[0].X) { enemy.X -= enemy.speed; }
    //DOWN
    if (enemy.Y < playerList[0].Y) { enemy.Y += enemy.speed; }
    //RIGHT
    if (enemy.X < playerList[0].X) { enemy.X += enemy.speed; }

  }

  if (enemy.moveCounter > 15) {

    var chance = Math.random() * 5;

    if (chance <= 1 && (enemy.X > playerList[0].X + 100 || enemy.X < playerList[0].X - 100)) { 
      enemy.movement = "left"; 
    }
    else if (chance <= 2 && (enemy.X < playerList[0].X + 100 || enemy.X < playerList[0].X - 100)) { 
      enemy.movement = "right";
    }
    else if (chance <= 3 && (enemy.Y < playerList[0].Y + 100 || enemy.Y < playerList[0].Y - 100)) { 
      enemy.movement = "up"; 
    }
    else if (chance <= 4 && (enemy.Y < playerList[0].Y + 100 || enemy.Y < playerList[0].Y - 100)) { 
      enemy.movement = "down"; 
    }
    else { enemy.movement = "stopped"; }

    enemy.moveCounter = 0;
  }

  if (enemy.movement == "up") { enemy.Y -= enemy.speed / 2; }
  if (enemy.movement == "left") { enemy.X -= enemy.speed / 2; }
  if (enemy.movement == "down") { enemy.Y += enemy.speed / 2; }
  if (enemy.movement == "right") { enemy.X  += enemy.speed / 2; }

  enemy.moveCounter++;
}
function movement_Pattern_Orbit (enemy, parent) {

	/* 
		The current location of the enemy in relation to its parent should be calculated. 
		
		Then the enemy should attempt to orbit the parent in a direction (clockwise/counterclockwise)
			after calculating the ratio of x to y movement required to make a circle at whatever distance
			it is orbiting.
		
		Enemy should also move away from parent to a specified orbiting distance.

		If the parent enemy is killed or cannot be found, enemy will look for closest enemy of the same type
			as its old parent and move to it until it can orbit that one.

		If no viable enemy parents are within its parent detection radius (somewhat large, maybe 5000px), then enemy
			will orbit and attack nearest player within its player detection radius.
	*/

}
function movement_Pattern_Evade (enemy, player) {

	/*
		On receiving this AI, the enemy will run away from the nearest player within its player detection radius.

		The enemy will calculate its current angle in relation to the player and move outwards from that angle.
	*/
}
//END MOVEMENT PATTERNS ==========


//End Of File 