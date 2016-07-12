//LOOT DROPS
function getPotionType (type) {

	if (type == "Attack") { return 0; };
	if (type == "Speed") { return 1; };
	if (type == "Dexterity") { return 2; };
	if (type == "Wizardry") { return 3; };
	if (type == "Youth") { return 4; };
}
function getBowName (tier) {

	if (tier == 0) { return "Shadow Bow"; };
	if (tier == 1) { return "Innocent Blood Bow"; };
	if (tier == 2) { return "Sunset Bow"; };
}
function getBowLore (tier) {

	if (tier == 0) { return "Shadowy shadow lore..."; };
	if (tier == 1) { return "Blood was spilled for this bow."; };
	if (tier == 2) { return "A gift from the Sun God."; };
}
function getArmorName (tier) {

	if (tier == 0) { return "Rusty Steel Armor"; };
	if (tier == 1) { return "Swamp Armor"; };
	if (tier == 2) { return "Enchanted Fire Armor"; };
	if (tier == 3) { return "Neptunian Armor"; };
}
function getArmorLore (tier) {

	if (tier == 0) { return "Forged by a local blacksmith."; };
	if (tier == 1) { return "Once worn by a hero."; };
	if (tier == 2) { return "Skillfully crafted in an armory."; };
	if (tier == 3) { return "Metal so fine only kings wear it."; };
}
function getPortalText (destination) {

	if (destination == "GAME_SCREEN") { return " To The Realm"; };
	if (destination == "BOSS_SCREEN") { return " Fight Boss!"; };
}
function getPortalImage (destination) {

	if (destination == "GAME_SCREEN") { return portalTypes[0]; };
	if (destination == "BOSS_SCREEN") { return portalTypes[1]; };
}

function getPortalFunction (destination) {

	//The function should check whether it is a main menu area or a dungeon, and teleport the player to either 0,0 or 4000, 4000 based on that. Enumerated types should be good here. Find a good way to check in the if statements easily.

	if (destination == "GAME_SCREEN") { 

		playerList[0].X = 4000;
		playerList[0].Y = 4000;
	};
	if (destination == "BOSS_SCREEN") { return portalTypes[1]; };
}
function dropPortal (X, Y, destination) {

	var data = {

		X: X,
		Y: Y,
		
		destination: destination,
		name: getPortalText(destination),
		image: getPortalImage(destination),
	}

	portalList.push(new portal(data));
}
function dropPotions (namePassed) {
  
  	var potionType = getPotionType(namePassed);
	var potionName = "Potion of " + namePassed;
	var potionEffect = "+1 " + namePassed;
	var potionImage = potionList[potionType];

	var data = {

		type: "potion",

		name: potionName,
		lore: namePassed,
		image: potionImage,
		effect: potionEffect,
	};

 	lootBagList[lootBagList.length - 1].addToInventory(new loot(data));
}
function dropWeapons (tier) {
  
  	var minDmg = 5 + (tier * 5);
	var maxDmg = 10 + (tier * 5);
	var bowName = getBowName(tier);
	var bowLore = getBowLore(tier);
	var bowEffectDescription = minDmg + " - " + maxDmg + " Damage";
	var bowImage = weaponBowList[tier][0];

	var data = {

		type: "bow",

		bowMinDmg: minDmg,
		bowMaxDmg: maxDmg,

		name: bowName,
		lore: bowLore,
		image: bowImage,
		effect: bowEffectDescription,
	};

	lootBagList[lootBagList.length - 1].addToInventory(new loot(data));
} 
function dropArmors (tier) {
  
	var armorName = getArmorName(tier);
	var armorLore = getArmorLore(tier);
	var armorImage = armorList[tier];
	var armorBoost = 10 + (10 * tier);
	var armorEffectDescription = "Max HP + " + armorBoost;

	var data = {

		type: "armor",

		armorHp: armorBoost,

		name: armorName,
		lore: armorLore,
		image: armorImage,
		effect: armorEffectDescription,
	};

	lootBagList[lootBagList.length - 1].addToInventory(new loot(data));
}
//END LOOT DROPS ====================