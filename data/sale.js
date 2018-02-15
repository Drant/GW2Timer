/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-02-13T16:00:00Z"),
	Finish: new Date("2018-02-20T16:00:00Z"),
	Values: {}, // ID-to-Price mapping of the promoted items, to be initialized
	numPaddingItems: 2,
	/*
	 * These objects were copied from https://gw2timer.com/data/sales.js and may
	 * be augmented with these variables:
	 *	i: "", // Item ID to retrieve icon and tooltip details, or a URL to a hosted image
	 *	n: "", // Item name referencing an English wiki page
	 *	p: {gem: 400}, // Current payment for one item
	 *	url: "", // If not provided, will use name as a wiki link, optional
	 *	discount: [[1, 160, 200], [5, 640, 800], [25, 3200, 4000]] OR 200, // [[quantity, gempricecurrent, gempriceoldOptional], ...] OR gempriceoldOptional
	 *	Finish: new Date("2018-01-01T16:00:00Z"), // Time the item or discount expires, optional
	 *	side: 0 or 1 // If has this property, these padding "items" will be ignored other than for creating column headers
	*/
	Items: [
	{i: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png", n: "Gem", p: {gem: 100}, url: "https://gw2timer.com/?page=Gem", side: 0},
	{i: 68104, n: "Gifts Mail Delivery", p: {gem: 280}, discount: 350, Finish: new Date("2018-02-21T16:00:00Z")},
	{i: 49933, n: "Bouquet of Roses", p: {gem: 250}, Finish: new Date("2018-02-20T16:00:00Z")},
	{i: 43528, n: "Box of Chocolates", p: {gem: 250}, Finish: new Date("2018-02-20T16:00:00Z")},
	{i: 77804, n: "Wings of Love Glider", p: {gem: 400}, Finish: new Date("2018-02-20T16:00:00Z")},
	{i: 80067, n: "Celestial Rooster Harvesting Tool", p: {gem: 800}, discount: 1000, Finish: new Date("2018-02-20T16:00:00Z")},
	{i: 82360, n: "Imperial Guard Outfit", p: {gem: 700}},
	{i: 68654, n: "Imperial Outfit", p: {gem: 490}, discount: 700, Finish: new Date("2018-02-16T16:00:00Z")},
	{i: 68612, n: "Plush Ram Backpack", p: {gem: 210}, discount: 300, Finish: new Date("2018-02-16T16:00:00Z")},
	{i: "https://i.imgur.com/c37rlEw.png", n: "Salvager's Supplies", p: {gem: 1360}, Finish: new Date("2018-02-09T16:00:00Z")},
	{i: 86943, n: "Lucky Dog Harvesting Tool", p: {gem: 1000}},
	{i: 86739, n: "Arcane Marksman Rifle", p: {gem: 600}},	
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 86920, n: "Alchemist weapons#Gallery", p: {blticket: 1}},
	{i: 66279, n: "Ancestral Outfit", p: {gem: 700}},
	{i: 68652, n: "Red Envelope Mail Carrier", p: {gem: 600}},
	{i: 80066, n: "Celestial Rooster Glider", p: {gem: 500}},
	{i: 68655, n: "Dragon Mask Skin", p: {gem: 300}},
	{i: 68656, n: "Lion Mask Skin", p: {gem: 300}}
	]
};
