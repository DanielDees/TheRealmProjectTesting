"use strict";

//
// All of the game's loot dropping 
// calculations are done with this class
//

function Loot_Drop_System () {

	this.getPotionType = function (type) {

		switch (type) {

			case "Attack":
				return 0;
			case "Speed":
				return 1;
			case "Dexterity":
				return 2;
			case "Wizardry":
				return 3;
			case "Youth":
				return 4;
		}
	}
	this.getBowName = function (tier) {

		switch (tier) {

			case 0:
				return "Shadow Bow";
			case 1:
				return "Innocent Blood Bow";
			case 2:
				return "Sunset Bow";
		}
	}
	this.getBowLore = function (tier) {

		switch (tier) {

			case 0:
				return "Shadowy shadow lore...";
			case 1:
				return "Blood was spilled for this bow. The string has been blackened with dried blood...";
			case 2:
				return "A gift from the Sun God. This was bestowed upon the hero who rid the land of darkness long ago...";
		}
	}
	this.getArmorName = function (tier) {

		switch (tier) {

			case 0:
				return "Rusty Steel Armor";
			case 1:
				return "Swamp Armor";
			case 2:
				return "Enchanted Fire Armor";
			case 3:	
				return "Neptunian Armor";
		}
	}
	this.getArmorLore = function (tier) {

		switch (tier) {

			case 0:
				return "Forged by a local blacksmith. Nothing special, but it will work well for now...";
			case 1:
				return "Once worn by an ancient hero who saved the land...";
			case 2:
				return "Skillfully crafted in the finest armory...";
			case 3:
				return "Metal so fine only great kings wear it...";
		}
	}
	this.getPortalText = function (destination) {

		switch (destination) {

			case "GAME_SCREEN":
				return " To The Realm";
			case "BOSS_SCREEN":
				return " Fight Boss!";
		}
	}
	this.getPortalImage = function (destination) {

		switch (destination) {

			case "GAME_SCREEN":
				return portalTypes[0];
			case "BOSS_SCREEN":
				return portalTypes[1];
		}
	}
	this.getPortalFunction = function (destination) {

		//The function should check whether it is a main menu area or a dungeon, and teleport the player to either 0,0 or 4000, 4000 based on that. Enumerated types should be good here. Find a good way to check in the if statements easily.

		if (destination == "GAME_SCREEN") { 

			playerList[0].X = 4000;
			playerList[0].Y = 4000;
		};
		if (destination == "BOSS_SCREEN") { return portalTypes[1]; };
	}
	this.dropPortal = function (X, Y, destination) {

		var data = {

			X: X,
			Y: Y,
			
			destination: destination,
			name: this.getPortalText(destination),
			image: this.getPortalImage(destination),
		}

		portalList.push(new portal(data));
	}
	this.dropPotions = function (namePassed) {

		var data = {

			type: "potion",

			name: "Potion of " + namePassed,
			lore: "Increases " + namePassed + " by 1",
			image: potionList[this.getPotionType(namePassed)],
			effect: "+1 " + namePassed,
		};

	 	lootBagList[lootBagList.length - 1].addToInventory(new loot(data));
	}
	this.dropWeapons = function (tier) {
	  
	  	var minDmg = 5 + (tier * 5);
		var maxDmg = 10 + (tier * 5);

		var data = {

			type: "bow",

			bowMinDmg: minDmg,
			bowMaxDmg: maxDmg,

			name: this.getBowName(tier),
			lore: this.getBowLore(tier),
			image: weaponBowList[tier][0],
			effect: minDmg + " - " + maxDmg + " Damage",
		};

		lootBagList[lootBagList.length - 1].addToInventory(new loot(data));
	} 
	this.dropArmors = function (tier) {
	  
		var armorBoost = 10 + (10 * tier);

		var data = {

			type: "armor",

			armorHp: armorBoost,

			name: this.getArmorName(tier),
			lore: this.getArmorLore(tier),
			image: armorList[tier],
			effect: "Max HP + " + armorBoost,
		};

		lootBagList[lootBagList.length - 1].addToInventory(new loot(data));
	}
}

var Game_Loot_System = new Loot_Drop_System();

//
// End of File
//