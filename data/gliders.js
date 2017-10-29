/*
 * This file is used by http://gw2timer.com/gliders
 * Cache association of the glider to its proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_GLIDERS_HEADERS = {
	Dyeable: {name_en: "Dyeable", name_de: "Färbbar", name_es: "Teñible", name_fr: "Teinté", name_zh: "可染色"},
	Colored: {name_en: "Colored", name_de: "Farbig", name_es: "Colorado", name_fr: "Coloré", name_zh: "有色"},
	Combo: {name_en: "Backpack-Glider", name_de: "Rücken-Gleitschirm", name_es: "Espalda-Planeador", name_fr: "Pièce de dos-Deltaplanes", name_zh: "背部物品皮肤‧滑翔翼"}
};

/*
 * Associated item with that unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of unlock
 * l: Number of dye channels
 * p: Payment type to acquire the item
 */
var GW2T_GLIDERS_DATA = {
Dyeable: [
	{u: 7, i: 72252, n: "Crystal Arbiter Glider", l: "2", p: {gem: 500}},
	{u: 12, i: 77646, n: "Ugly Wool Glider", l: "2", p: {gem: 0}},
	{u: 14, i: 77738, n: "Phoenix Kite Glider", l: "2", p: {gem: 400}},
	{u: 17, i: 77821, n: "Classical Glider", l: "2", p: {gem: 400}},
	{u: 19, i: 78006, n: "Ironclad Glider", l: "2", p: {gem: 500}},
	{u: 25, i: 78790, n: "Floral Glider", l: "2", p: {gem: 400}},
	{u: 26, i: 79016, n: "White Mantle Glider", l: "2", p: {gem: 400}},
	{u: 27, i: 79010, n: "Glide-r-Tron", l: "2", p: {gem: 500}},
	{u: 31, i: 79631, n: "Spectral Glider", l: "2", p: {gem: 500}},
	{u: 37, i: 80484, n: "Necrotic Glider", l: "1", p: {gem: 500}},
	{u: 38, i: 80725, n: "Raven's Spirit Glider", l: "2", p: {gem: 500}},
	{u: 50, i: 83341, n: "Sheet Music Glider", l: "2", p: {gem: 400}},
	{u: 53, i: 85496, n: "Riding Broom Glider", p: {gem: 500}}
],
Colored: [
	{u: 5, i: 67054, n: "Heart of Thorns Glider", l: "", p: {gem: 0}},
	{u: 4, i: 76236, n: "Exalted Glider", l: "", p: {gem: 400}},
	{u: 9, i: 77291, n: "Soul River Glider", l: "", p: {gem: 500}},
	{u: 10, i: 77528, n: "Snowflake Glider", l: "", p: {gem: 500}},
	{u: 15, i: 77804, n: "Wings of Love Glider", l: "", p: {gem: 400}},
	{u: 16, i: 77811, n: "Electromagnetic-Descender Glider", l: "", p: {gem: 400}},
	{u: 18, i: 78007, n: "Bubble Glider", l: "", p: {gem: 500}},
	{u: 20, i: 78009, n: "Super Adventure Glider", l: "", p: {gem: 400}},
	{u: 21, i: 78025, n: "Phoenix Glider", l: "", p: {gem: 400}},
	{u: 33, i: 79663, n: "Bloodstone Glider", l: "", p: {gem: 500}},
	{u: 32, i: 79660, n: "Grasping Phantom Glider", l: "", p: {gem: 0}},
	{u: 35, i: 80018, n: "Infinirarium Glider", l: "", p: {gem: 0}},
	{u: 36, i: 80066, n: "Celestial Rooster Glider", l: "", p: {gem: 500}},
	{u: 39, i: 80795, n: "Shattered Bloodstone Glider", l: "", p: {gem: 400}},
	{u: 41, i: 80919, n: "Super Cloud Glider", l: "", p: {gem: 500}},
	{u: 44, i: 81291, n: "Magic Carpet Glider", l: "", p: {gem: 400}},	
	{u: 46, i: 82011, n: "Abaddon's Glider", l: "", p: {gem: 400}},
	{u: 49, i: 82666, n: "Geomancer Glider", l: "", p: {gem: 500}}
],
Combo: [ // The audit function depends on this named category for ignoring duplicate backpack-glider skin
	{u: 11, i: 77474, n: "The Ascension Glider", l: "", p: {craft: true}},
	{u: 22, i: 74155, n: "Ad Infinitum Glider", l: "", p: {craft: true}},
	{u: 3, i: 70009, n: "White Feather Wings Glider", l: "", p: {gem: 700}},
	{u: 1, i: 70048, n: "Black Feather Wings Glider", l: "", p: {gem: 700}},
	{u: 6, i: 74684, n: "Bat Wings Glider", l: "", p: {gem: 700}},
	{u: 8, i: 77269, n: "Golden Feather Wings Glider", l: "", p: {gem: 700}},
	{u: 13, i: 77678, n: "Hawk Wings Glider", l: "", p: {gem: 700}},
	{u: 23, i: 78727, n: "Macaw Wings Glider", l: "", p: {gem: 700}},
	{u: 24, i: 78768, n: "Moth Wings Glider", l: "", p: {gem: 700}},
	{u: 28, i: 79084, n: "Shining Blade Glider", l: "", p: {gem: 700}},
	{u: 30, i: 79595, n: "Mursaat Wings Glider", l: "", p: {gem: 700}},
	{u: 34, i: 79704, n: "Crystalline Dragon Wings Glider", l: "", p: {gem: 700}},
	{u: 40, i: 80958, n: "Super Adventure Holo-Copter", l: "", p: {gem: 700}},
	{u: 42, i: 80985, n: "Vine-Touched Destroyer Glider", l: "2", p: {gem: 700}},
	{u: 45, i: 81547, n: "Dynamics Glider Module", l: "", p: {gem: 700}},
	{u: 47, i: 81888, n: "Feathers of the Zephyr", l: "", p: {gem: 0}},
	{u: 48, i: 82671, n: "Largos Fin Glider", l: "2", p: {gem: 700}},
	{u: 51, i: 85220, n: "Branded Wing Glider", p: {gem: 700}}
]
};
