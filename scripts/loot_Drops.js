//
// All of the game's loot dropping 
// calculations are done with this class
//

function Loot_Drop_System () {

	this.getPotionType = function (type) {

		if (type == "Attack") { return 0; };
		if (type == "Speed") { return 1; };
		if (type == "Dexterity") { return 2; };
		if (type == "Wizardry") { return 3; };
		if (type == "Youth") { return 4; };
	}
	this.getBowName = function (tier) {

		if (tier == 0) { return "Shadow Bow"; };
		if (tier == 1) { return "Innocent Blood Bow"; };
		if (tier == 2) { return "Sunset Bow"; };
	}
	this.getBowLore = function (tier) {

		if (tier == 0) { return "Shadowy shadow lore..."; };
		if (tier == 1) { return "Blood was spilled for this bow."; };
		if (tier == 2) { return "A gift from the Sun God."; };
	}
	this.getArmorName = function (tier) {

		if (tier == 0) { return "Rusty Steel Armor"; };
		if (tier == 1) { return "Swamp Armor"; };
		if (tier == 2) { return "Enchanted Fire Armor"; };
		if (tier == 3) { return "Neptunian Armor"; };
	}
	this.getArmorLore = function (tier) {

		if (tier == 0) { return "Forged by a local blacksmith."; };
		if (tier == 1) { return "Once worn by a hero."; };
		if (tier == 2) { return "Skillfully crafted in an armory."; };
		if (tier == 3) { return "Metal so fine only kings wear it."; };
	}
	this.getPortalText = function (destination) {

		if (destination == "GAME_SCREEN") { return " To The Realm"; };
		if (destination == "BOSS_SCREEN") { return " Fight Boss!"; };
	}
	this.getPortalImage = function (destination) {

		if (destination == "GAME_SCREEN") { return portalTypes[0]; };
		if (destination == "BOSS_SCREEN") { return portalTypes[1]; };
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