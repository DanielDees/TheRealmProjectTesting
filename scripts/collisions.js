"use strict";

//COLLISIONS =====================

var collisions = new Game_collision_checker();

function Game_collision_checker() {

	this.collision = function(a, b) {
		
		//If error, ensure a/b have hitboxes.
		if (a.bottom() > b.top() && a.top() < b.bottom() && a.left() < b.right() && a.right() > b.left()) {

		  return true;
		}
		return false;
	};

	this.players = function() {

	};
	this.enemies = function() {

	};
	this.enemy_projectiles = function() {

		//Enemy Bullets
		for (var i= 0; i < enemyBulletList.length; i++) {
			//Players
			for (var j = 0; j < playerList.length; j++) {
				//On Collision
				if (i >= 0 && this.collision(enemyBulletList[i], playerList[j])) {
					//Damage player
					playerList[j].takeDamage(enemyBulletList[i].damage);

					//This little fracker has to exist before you die...
					if (playerList[j].HP <= 0) { playerList[j].deathScene(enemyBulletList[i].owner); }

					//Remove projectile
					enemyBulletList.splice(i, 1);
					i--;
				}
			}
		}
	};
	this.player_projectiles = function() {
		
		//Player bullets
		for (var i = 0; i < bulletList.length; i++) {
			//Enemies
			for (var j = 0; j < enemyList.length; j++) {
				//On Collision
				if (i >= 0 && this.collision(bulletList[i], enemyList[j])) {

					//Damage enemy
					enemyList[j].takeDamage(bulletList[i].damage);
					
					//Remove projectile
					bulletList.splice(i, 1);
					i--;

					//If enemy is kill :(
					if (enemyList[j].HP < 1) { 

						enemyList[j].dropLoot();
						enemyList.splice(j, 1);
						enemies_remaining_in_realm--;
						j--;
					}
				}
			}
		}
	};
	this.obstacles = function(things, thingType) {
		
		//Obstacles
		for (var i = 0; i < obstacleList.length; i++) {
			//Array passed
			for (var j = 0; j < things.length; j++) {
				//On collision
				if (this.collision(obstacleList[i], things[j])) {
					console.log("Player -> obstacle collision!");
				}
			}
		}  
	};
	//Update all collisions
	this.update = function() {
		
		this.player_projectiles();
		this.enemy_projectiles();
		this.obstacles(playerList);
	};
}
//END COLLISIONS =================