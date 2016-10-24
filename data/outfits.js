/*
 * This file is used by http://gw2timer.com/outfits
 * Cache association of the outfit to its proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_OUTFITS_HEADERS = {
	General: {name_en: "General", name_de: "General", name_es: "General", name_fr: "Général"},
	Festival: {name_en: "Festival", name_de: "Festival", name_es: "Festival", name_fr: "Festival"}
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
	{u: 29, i: 76905, n: "Crystal Arbiter Outfit", p: {gem: 2000}},
	{u: 31, i: 77282, n: "Bandit Sniper's Outfit", p: {gem: 2000}},
	{u: 32, i: 77483, n: "Slayer's Outfit", p: {gem: 700}},
	{u: 34, i: 77676, n: "Nature's Oath Outfit", p: {gem: 700}},
	{u: 35, i: 77808, n: "Crystal Savant Outfit", p: {gem: 700}},
	{u: 36, i: 78011, n: "White Mantle Outfit", p: {gem: 700}},
	{u: 38, i: 78008, n: "Gwen's Attire", p: {gem: 700}},
	{u: 37, i: 78010, n: "Ironclad Outfit", p: {gem: 700}},
	{u: 39, i: 78574, n: "Sentinel Outfit", p: {gem: 700}},
	{u: 40, i: 79220, n: "Verdant Executor Outfit", p: {gem: 700}},
	{u: 42, i: 79531, n: "Mursaat Robes", p: {gem: 700}},
	{u: 41, i: 79380, n: "Taimi Outfit", p: {gem: 700}}
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
	{u: 33, i: 77595, n: "Winter Solstice Outfit", p: {gem: 700}}
]
};
