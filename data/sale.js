/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-02-27T16:00:00Z"),
	Finish: new Date("2018-03-13T16:00:00Z"),
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
	{i: 66279, n: "Ancestral Outfit", p: {gem: 490}, discount: 700, Finish: new Date("2018-03-02T16:00:00Z")},
	{i: 86739, n: "Arcane Marksman Rifle", p: {gem: 600}, Finish: new Date("2018-03-06T16:00:00Z")},
	{i: 86943, n: "Lucky Dog Harvesting Tool", p: {gem: 1000}, Finish: new Date("2018-03-06T16:00:00Z")},
	{i: 85220, n: "Branded Wing Glider", p: {gem: 700}},
	{i: 85332, n: "Branded Wing Backpack", p: {gem: 700}},
	{i: 81565, n: "Mini Plush Aurene", p: {gem: 400}},
	{i: 81583, n: "Fuzzy Aurene Hat", p: {gem: 400}},
	{i: 75129, n: "Lyssa's Regalia", p: {gem: 700}},
	{i: 77738, n: "Phoenix Kite Glider", p: {gem: 400}},
	{i: 86958, n: "Mini Lucky Lantern Puppy", p: {gem: 400}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 86920, n: "Alchemist weapons#Gallery", p: {blticket: 1}},
	{i: 77291, n: "Soul River Glider", p: {gem: 375}, discount: 500, Finish: new Date("2018-03-03T16:00:00Z")},
	{i: 80066, n: "Celestial Rooster Glider", p: {gem: 375}, discount: 500, Finish: new Date("2018-03-03T16:00:00Z")},
	{i: 79380, n: "Taimi's Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-04T16:00:00Z")},
	{i: 79705, n: "Marjory's Shrouded Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-04T16:00:00Z")},
	{i: 80973, n: "Kasmeer's Regal Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-04T16:00:00Z")},
	{i: "https://i.imgur.com/e5G1iUR.png", n: "Elonian Introductory Package", p: {gem: 1530}, discount: 1800, Finish: new Date("2018-03-05T16:00:00Z")},
	{i: "https://i.imgur.com/gAiNPeZ.png", n: "Path of Fire Survival Package", p: {gem: 1700}, discount: 2000, Finish: new Date("2018-03-05T16:00:00Z")},
	{i: 79703, n: "Braham's Wolfblood Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-06T16:00:00Z")},
	{i: 80077, n: "Rox's Pathfinder Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-06T16:00:00Z")},
	{i: 79220, n: "Verdant Executor Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-06T16:00:00Z")},
	{i: 80861, n: "Shield of the Goddess", p: {gem: 480}, discount: 600, Finish: new Date("2018-03-07T16:00:00Z")},
	]
};
