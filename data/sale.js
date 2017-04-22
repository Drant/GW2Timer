/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promotions and sale items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-04-18T16:00:00Z"),
	Finish: new Date("2017-05-02T16:00:00Z"),
	numPaddingItems: 2,
	Values: {}, // ID-to-Price mapping of the promoted items, to be initialized
	/*
	 * These objects were copied from http://gw2timer.com/data/sales.js and may
	 * be augmented with these variables:
	 *	n: "", // Item name referencing an English wiki page
	 *	i: "", // Item ID to retrieve icon and tooltip details, or a URL to a hosted image
	 *	p: {gem: 400}, // Current payment for one item
	 *	url: "", // If not provided, will use name as a wiki link, optional
	 *	discount: [[1, 160, 200], [5, 640, 800], [25, 3200, 4000]] OR 200, // [[quantity, gempricecurrent, gempriceoldOptional], ...] OR gempriceoldOptional
	 *	Finish: new Date("2017-01-01T16:00:00Z"), // Time the item or discount expires, optional
	 *	side: 0 or 1 // If has this property, these padding "items" will be ignored other than for creating column headers
	*/
	Items: [
		{i: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png", n: "Gem", p: {gem: 100}, url: "http://gw2timer.com/?page=Gem", side: 0},
		{i: 64757, n: "Wizard's Hat", p: {gem: 200}, Finish: new Date("2017-04-25T16:00:00Z")},
		{i: 79386, n: "Dragon Kama Skin", p: {gem: 600}, Finish: new Date("2017-04-25T16:00:00Z")},
		{i: 8466, n: "Belinda's Greatsword Skin", p: {gem: 600}, Finish: new Date("2017-04-24T16:00:00Z")},
		{i: 79704, n: "Crystalline Dragon Wings Glider", p: {gem: 700}, Finish: new Date("2017-04-25T16:00:00Z")},
		{i: 79707, n: "Crystalline Dragon Wings Backpack", p: {gem: 700}, Finish: new Date("2017-04-25T16:00:00Z")},
		{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
		{i: 67028, n: "Chaos weapon skins#Gallery", p: {blticket: 5}},
		{i: 80974, n: "Primordus Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
		{i: 80069, n: "Solar and Lunar Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-04-24T16:00:00Z")},
		{i: 68786, n: "Shadow Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-04-25T16:00:00Z")}
	]
};