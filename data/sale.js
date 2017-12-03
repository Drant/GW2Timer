/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-11-28T16:00:00Z"),
	Finish: new Date("2017-12-11T16:00:00Z"),
	Values: {}, // ID-to-Price mapping of the promoted items, to be initialized
	numPaddingItems: 2,
	/*
	 * These objects were copied from http://gw2timer.com/data/sales.js and may
	 * be augmented with these variables:
	 *	i: "", // Item ID to retrieve icon and tooltip details, or a URL to a hosted image
	 *	n: "", // Item name referencing an English wiki page
	 *	p: {gem: 400}, // Current payment for one item
	 *	url: "", // If not provided, will use name as a wiki link, optional
	 *	discount: [[1, 160, 200], [5, 640, 800], [25, 3200, 4000]] OR 200, // [[quantity, gempricecurrent, gempriceoldOptional], ...] OR gempriceoldOptional
	 *	Finish: new Date("2017-01-01T16:00:00Z"), // Time the item or discount expires, optional
	 *	side: 0 or 1 // If has this property, these padding "items" will be ignored other than for creating column headers
	*/
	Items: [
	{i: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png", n: "Gem", p: {gem: 100}, url: "http://gw2timer.com/?page=Gem", side: 0},
	{i: 85491, n: "Resplendent Avialan", p: {gem: 2000}},
	{i: 81664, n: "Mistlock Sanctuary Passkey", p: {gem: 1000}, Finish: new Date("2017-12-05T16:00:00Z")},
	{i: 85517, n: "Mini Kormeerkat", p: {gem: 350}},
	{i: 86163, n: "Elonian Landscape Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 85608, n: "Shifting Sands weapons#Gallery", p: {blticket: 1}},
	{i: 66658, n: "Shadow Assassin Outfit", p: {gem: 700}},
	{i: 68577, n: "Arcane Outfit", p: {gem: 700}},
	{i: 66279, n: "Ancestral Outfit", p: {gem: 700}},
	{i: 68654, n: "Imperial Outfit", p: {gem: 700}},
	{i: 68684, n: "Crystal Nomad Outfit", p: {gem: 700}},
	{i: 65198, n: "Fancy Winter Outfit", p: {gem: 700}},
	{i: 63940, n: "Lawless Helmet Skin", p: {gem: 300}, Finish: new Date("2017-12-09T16:00:00Z")},
	{i: 42962, n: "Lawless Shoulder Skin", p: {gem: 300}, Finish: new Date("2017-12-09T16:00:00Z")},
	{i: 43525, n: "Lawless Gloves Skin", p: {gem: 300}, Finish: new Date("2017-12-09T16:00:00Z")},
	{i: 42966, n: "Lawless Boots Skin", p: {gem: 300}, Finish: new Date("2017-12-09T16:00:00Z")},
	{i: 77811, n: "Electromagnetic-Descender Glider", p: {gem: 400}, Finish: new Date("2017-12-07T16:00:00Z")},
	{i: 78771, n: "Electromagnetic Ascender", p: {gem: 250}, Finish: new Date("2017-12-07T16:00:00Z")},
	{i: 80484, n: "Necrotic Glider", p: {gem: 500}, Finish: new Date("2017-12-07T16:00:00Z")},
	{i: "https://i.imgur.com/mIuPrbz.png", n: "Bandit Sniper Appearance Pack", p: {gem: 2000}},
	{i: 82011, n: "Abaddon's Glider", p: {gem: 400}, Finish: new Date("2017-12-06T16:00:00Z")},
	{i: 78006, n: "Ironclad Glider", p: {gem: 500}, Finish: new Date("2017-12-06T16:00:00Z")},
	{i: 81291, n: "Magic Carpet Glider", p: {gem: 400}, Finish: new Date("2017-12-06T16:00:00Z")},
	{i: 77677, n: "Hawk Wings Backpack Skin", p: {gem: 700}, Finish: new Date("2017-12-06T16:00:00Z")},
	{i: 77678, n: "Hawk Wings Glider", p: {gem: 700}, Finish: new Date("2017-12-06T16:00:00Z")},
	{i: 64742, n: "Aviator Cap", p: {gem: 200}, Finish: new Date("2017-12-08T16:00:00Z")},
	{i: 64740, n: "Aviator Sunglasses", p: {gem: 150}, Finish: new Date("2017-12-08T16:00:00Z")},
	{i: 64758, n: "Fuzzy Cat Hat", p: {gem: 200}, Finish: new Date("2017-12-08T16:00:00Z")},
	{i: 64753, n: "Wide Rim Glasses", p: {gem: 150}, Finish: new Date("2017-12-08T16:00:00Z")}
	]
};