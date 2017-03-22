/*
 * This file is used by http://gw2timer.com/gliders
 * Cache association of the glider to its proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_GLIDERS_HEADERS = {
	Dyeable: {name_en: "Dyeable", name_de: "Färbbar", name_es: "Teñible", name_fr: "Teinté", name_zh: "可染色"},
	Colored: {name_en: "Colored", name_de: "Farbig", name_es: "Colorado", name_fr: "Coloré", name_zh: "有色"}
};

/*
 * Associated finisher item with that finisher unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of unlock
 * p: Payment type to acquire the item
 */
var GW2T_GLIDERS_DATA = {
Dyeable: [
	{u: 7, i: 72252, n: "Crystal Arbiter Glider", p: {gem: 2000}},
	{u: 12, i: 77646, n: "Ugly Wool Glider", p: {gem: 0}},
	{u: 14, i: 77738, n: "Phoenix Kite Glider", p: {gem: 400}},
	{u: 17, i: 77821, n: "Classical Glider", p: {gem: 400}},
	{u: 19, i: 78006, n: "Ironclad Glider", p: {gem: 500}},
	{u: 24, i: 78768, n: "Moth Wings Glider", p: {gem: 700}},
	{u: 25, i: 78790, n: "Floral Glider", p: {gem: 400}},
	{u: 26, i: 79016, n: "White Mantle Glider", p: {gem: 400}},
	{u: 27, i: 79010, n: "Glide-r-Tron", p: {gem: 500}},
	{u: 28, i: 79084, n: "Shining Blade Glider", p: {gem: 700}},
	{u: 31, i: 79631, n: "Spectral Glider", p: {gem: 500}},
	{u: 37, i: 80484, n: "Necrotic Glider", p: {gem: 500}},
	{u: 39, i: 80725, n: "Raven's Spirit Glider", p: {gem: 500}}
],
Colored: [
	{u: 5, i: 67054, n: "Heart of Thorns Glider", p: {gem: 0}},
	{u: 11, i: 77474, n: "The Ascension Glider", p: {craft: true}},
	{u: 22, i: 74155, n: "Ad Infinitum Glider", p: {craft: true}},
	{u: 3, i: 70009, n: "White Feather Wings Glider", p: {gem: 700}},
	{u: 1, i: 70048, n: "Black Feather Wings Glider", p: {gem: 700}},
	{u: 6, i: 74684, n: "Bat Wings Glider", p: {gem: 700}},
	{u: 4, i: 76236, n: "Exalted Glider", p: {gem: 400}},
	{u: 8, i: 77269, n: "Golden Feather Wings Glider", p: {gem: 700}},
	{u: 9, i: 77291, n: "Soul River Glider", p: {gem: 2000}},
	{u: 10, i: 77528, n: "Snowflake Glider", p: {gem: 500}},
	{u: 13, i: 77678, n: "Hawk Wings Glider", p: {gem: 700}},
	{u: 15, i: 77804, n: "Wings of Love Glider", p: {gem: 400}},
	{u: 16, i: 77811, n: "Electromagnetic-Descender Glider", p: {gem: 400}},
	{u: 18, i: 78007, n: "Bubble Glider", p: {gem: 500}},
	{u: 20, i: 78009, n: "Super Adventure Glider", p: {gem: 400}},
	{u: 21, i: 78025, n: "Phoenix Glider", p: {gem: 400}},
	{u: 23, i: 78727, n: "Macaw Wings Glider", p: {gem: 700}},
	{u: 30, i: 79595, n: "Mursaat Wings Glider", p: {gem: 700}},
	{u: 33, i: 79663, n: "Bloodstone Glider", p: {gem: 500}},
	{u: 32, i: 79660, n: "Grasping Phantom Glider", p: {gem: 0}},
	{u: 34, i: 79704, n: "Crystalline Dragon Wings Glider", p: {gem: 700}},
	{u: 35, i: 80018, n: "Infinirarium Glider", p: {gem: 0}},
	{u: 36, i: 80066, n: "Celestial Rooster Glider", p: {gem: 500}},
	{u: 38, i: 80795, n: "Shattered Bloodstone Glider", p: {gem: 400}}
]
};
