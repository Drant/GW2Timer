/*
 * This file is used by gw2timer.com/outfits
 * Cache association of the outfit to its proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_OUTFITS_HEADERS = {
	General: {name_en: "General", name_de: "General", name_es: "General", name_fr: "Général", name_zh: "一般"},
	Town: {name_en: "Town", name_de: "Stadtkleidung", name_es: "Ciudad", name_fr: "Ville", name_zh: "城镇服装"},
	Festival: {name_en: "Festival", name_de: "Festival", name_es: "Festival", name_fr: "Festival", name_zh: "节"}
};

/*
 * Outfits to be excluded from the collate function.
 */
var GW2T_OUTFITS_BLACKLIST = {
	
};

/*
 * Associated outfit item with that outfit unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of outfit
 * p: Payment type to acquire the item
 */
var GW2T_OUTFITS_DATA = {
General: [
	{u: 3, i: 64754, n: "Pirate Captain's Outfit", p: {gem: 700}},
	{u: 1, i: 64756, n: "Cook's Outfit", p: {gem: 700}},
	{u: 9, i: 66279, n: "Ancestral Outfit", p: {gem: 700}},
	{u: 8, i: 66658, n: "Shadow Assassin Outfit", p: {gem: 700}},
	{u: 10, i: 67040, n: "Ceremonial Plated Outfit", p: {gem: 700}},
	{u: 13, i: 67398, n: "Noble Count Outfit", p: {gem: 700}},
	{u: 15, i: 67868, n: "Arctic Explorer Outfit", p: {gem: 700}},
	{u: 14, i: 67990, n: "Jungle Explorer Outfit", p: {gem: 700}},
	{u: 16, i: 68577, n: "Arcane Outfit", p: {gem: 700}},
	{u: 17, i: 68654, n: "Imperial Outfit", p: {gem: 700}},
	{u: 18, i: 68684, n: "Crystal Nomad Outfit", p: {gem: 700}},
	{u: 20, i: 69607, n: "Balthazar's Regalia Outfit", p: {gem: 700}},
	{u: 19, i: 69623, n: "Exemplar Attire Outfit", p: {gem: 700}},
	{u: 21, i: 69662, n: "Daydreamer's Finery Outfit", p: {gem: 700}},
	{u: 22, i: 69753, n: "Mad Scientist Outfit", p: {gem: 700}},
	{u: 23, i: 69806, n: "Dwayna's Regalia Outfit", p: {gem: 700}},
	{u: 24, i: 69863, n: "Monk's Outfit", p: {gem: 700}},
	{u: 25, i: 70071, n: "Harbinger of Mordremoth Outfit", p: {gem: 700}},
	{u: 26, i: 70253, n: "Wedding Attire Outfit", p: {gem: 1000}},
	{u: 27, i: 70299, n: "Royal Guard Outfit", p: {achievement: 0}},
	{u: 30, i: 75129, n: "Lyssa's Regalia", p: {gem: 700}},
	{u: 29, i: 76905, n: "Crystal Arbiter Outfit", p: {gem: 700}},
	{u: 31, i: 77282, n: "Bandit Sniper's Outfit", p: {gem: 700}},
	{u: 32, i: 77483, n: "Slayer's Outfit", p: {gem: 700}},
	{u: 34, i: 77676, n: "Nature's Oath Outfit", p: {gem: 700}},
	{u: 35, i: 77808, n: "Crystal Savant Outfit", p: {gem: 700}},
	{u: 36, i: 78011, n: "White Mantle Outfit", p: {gem: 700}},
	{u: 38, i: 78008, n: "Gwen's Attire", p: {gem: 700}},
	{u: 37, i: 78010, n: "Ironclad Outfit", p: {gem: 700}},
	{u: 39, i: 78574, n: "Sentinel Outfit", p: {gem: 700}},
	{u: 40, i: 79220, n: "Verdant Executor Outfit", p: {gem: 700}},
	{u: 42, i: 79531, n: "Mursaat Robes", p: {gem: 700}},
	{u: 41, i: 79380, n: "Taimi's Outfit", p: {gem: 700}},
	{u: 43, i: 79671, n: "Ghostly Outfit", p: {gem: 700}},
	{u: 45, i: 79705, n: "Marjory's Shrouded Outfit", p: {gem: 700}},
	{u: 44, i: 79703, n: "Braham's Wolfblood Outfit", p: {gem: 700}},
	{u: 46, i: 80049, n: "Ice Encasement Outfit", p: {gem: 700}},
	{u: 47, i: 80077, n: "Rox's Pathfinder Outfit", p: {gem: 700}},
	{u: 48, i: 80906, n: "Spring Promenade Outfit", p: {gem: 700}},
	{u: 49, i: 80973, n: "Kasmeer's Regal Outfit", p: {gem: 700}},
	{u: 50, i: 81223, n: "Outlaw Outfit", p: {gem: 700}},
	{u: 51, i: 81548, n: "Dynamics Exo-Suit Outfit", p: {gem: 700}},
	{u: 52, i: 82075, n: "Sunspear Outfit", p: {gem: 0}},
	{u: 53, i: 83865, n: "Champion of Tyria Outfit", p: {gem: 700}},
	{u: 54, i: 82391, n: "Grenth's Regalia Outfit", p: {gem: 700}},
	{u: 56, i: 85034, n: "Forged Outfit", p: {gem: 700}},
	{u: 57, i: 85383, n: "Fallen Balthazar Outfit", p: {gem: 0}},
	{u: 58, i: 85448, n: "Awakened Zealot Outfit", p: {gem: 700}},
	{u: 72, i: 85740, n: "First Follower Desmina Outfit", p: {gem: 700}},
	{u: 55, i: 82360, n: "Imperial Guard Outfit", p: {gem: 700}},
	{u: 75, i: 87182, n: "Inquest Exo-Suit Outfit", p: {gem: 700}},
	{u: 76, i: 87477, n: "Primeval Dervish Outfit", p: {gem: 700}},
	{u: 77, i: 87548, n: "Elonian Elementalist Outfit", p: {gem: 700}},
	{u: 78, i: 88321, n: "Timekeeper Outfit", p: {gem: 700}}
],
Festival: [
	{u: 2, i: 65196, n: "Mad King's Outfit", p: {gem: 700}},
	{u: 4, i: 65201, n: "Witch's Outfit", p: {gem: 700}},
	{u: 12, i: 67374, n: "Hexed Outfit", p: {cob: 3}},
	{u: 6, i: 65195, n: "Bloody Prince's Outfit", p: {gem: 700}},
	{u: 5, i: 65194, n: "Executioner's Outfit", p: {gem: 700}},
	{u: 11, i: 67037, n: "Raiment of the Lich", p: {gem: 700}},
	{u: 28, i: 70385, n: "Lunatic Guard Outfit", p: {gem: 700}},
	{u: 7, i: 65198, n: "Fancy Winter Outfit", p: {gem: 700}},
	{u: 33, i: 77595, n: "Winter Solstice Outfit", p: {gem: 700}},
	{u: 74, i: 86637, n: "Winter Monarch Outfit", p: {gem: 700}}
],
Town: [
	{u: 60, i: 36179, n: "Common Clothing Outfit"},
	{u: 59, i: 36189, n: "Cherry Blossom Clothing Outfit"},
	{u: 64, i: 36190, n: "Country Lace Clothing Outfit"},
	{u: 67, i: 36191, n: "Ornate Clothing Outfit"},
	{u: 61, i: 36185, n: "Silk Brocade Outfit"},
	{u: 62, i: 36184, n: "Leather Hoodie Clothing Outfit"},
	{u: 63, i: 36187, n: "Casual Clothing Outfit"},
	{u: 66, i: 36200, n: "Casual Hoodie Clothing Outfit"},
	{u: 68, i: 36186, n: "Layered Vest Clothing Outfit"},
	{u: 69, i: 36188, n: "Striped Silk Clothing Outfit"},
	{u: 70, i: 36183, n: "Designer Hoodie Clothing Outfit"},
	{u: 65, i: 36176, n: "Riding Clothes Outfit"},
	{u: 71, i: 36180, n: "Khaki Clothing Outfit"},
	{u: 73, i: 36192, n: "Dragon Emblem Clothing Outfit"}
]
};
