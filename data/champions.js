/*
 * This file is used by http://gw2timer.com/champions
 * Cache association of the PvP Mist Champion to its proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_CHAMPIONS_HEADERS = {
	Ossa: {name_en: "Turai Ossa", name_de: "Turai Ossa", name_es: "Turai Ossa", name_fr: "Turai Ossa", name_zh: "托雷·奥沙"},
	Nika: {name_en: "Nika", name_de: "Nika", name_es: "Nika", name_fr: "Nika", name_zh: "妮卡"},
	Tybalt: {name_en: "Tybalt", name_de: "Tybalt", name_es: "Tybalt", name_fr: "Tybalt", name_zh: "提尔伯特"},
	Grymm: {name_en: "Grymm", name_de: "Grymm", name_es: "Grymm", name_fr: "Grymm", name_zh: "格瑞恩"}
};

/*
 * Associated item with that unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of unlock
 * p: Payment type to acquire the item
 */
var GW2T_CHAMPIONS_DATA = {
Ossa: [
	//{u: 3, i: null, n: "Turai Ossa"},
	{u: 8, i: 74686, n: "Phalanx Turai Ossa"},
	{u: 9, i: 76488, n: "Radiant Turai Ossa"},
	{u: 14, i: 76461, n: "Rampart Turai Ossa"},
	{u: 17, i: 77638, n: "Festive Turai Ossa"}
],
Nika: [
	{u: 1, i: 70076, n: "Nika"},
	{u: 7, i: 72077, n: "Shadow Assassin Nika"},
	{u: 11, i: 73002, n: "Sneakthief Nika"},
	{u: 12, i: 76274, n: "Strider's Nika"},
	{u: 15, i: 77642, n: "Festive Nika"}
],
Tybalt: [
	{u: 5, i: 77754, n: "Lightbringer Tybalt Leftpaw"},
	{u: 18, i: 77684, n: "Steampunk Tybalt"},
	{u: 19, i: 77704, n: "Orrian Armor Tybalt"},
	{u: 20, i: 77691, n: "Elite Glorious Tybalt"}
],
Grymm: [
	{u: 2, i: 72443, n: "Grymm Svaard"},
	{u: 4, i: 74423, n: "Flamewalker Grymm Svaard"},
	{u: 10, i: 72772, n: "Rogue Grymm Svaard"},
	{u: 13, i: 73989, n: "Priory Grymm Svaard"},
	{u: 16, i: 77607, n: "Festive Grymm Svaard"}
]
};
