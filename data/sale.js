/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-12-11T16:00:00Z"),
	Finish: new Date("2017-12-26T16:00:00Z"),
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
	{i: 49149, n: "Royal Terrace Pass", p: {gem: 700}, discount: 1000, Finish: new Date("2017-12-19T16:00:00Z")},
	{i: "https://i.imgur.com/gAiNPeZ.png", n: "Path of Fire Survival Package", p: {gem: 2000}, Finish: new Date("2017-12-19T16:00:00Z")},
	{i: "https://i.imgur.com/G0wZ34L.png", n: "Cozy Wintersday Mounts Pack", p: {gem: 1600}},
	{i: 85491, n: "Resplendent Avialan", p: {gem: 2000}, Finish: new Date("2017-12-19T16:00:00Z")},
	{i: 85740, n: "First Follower Desmina Outfit", p: {gem: 700}},
	{i: 85757, n: "Permanent Choya Finisher", p: {gem: 700}},
	{i: 77528, n: "Snowflake Glider", p: {gem: 500}},
	{i: 80044, n: "Mini Festive Aurene", p: {gem: 400}},
	{i: 80026, n: "Ice Crown", p: {gem: 400}},
	{i: 67887, n: "Shoulder Scarf", p: {gem: 400}},
	{i: 64750, n: "Top Hat", p: {gem: 200}},
	{i: 65202, n: "Festive Hat", p: {gem: 150}},
	{i: 65200, n: "Wintersday Earmuffs", p: {gem: 25}},
	{i: "https://i.imgur.com/IEbqAQ1.png", n: "Heroes Dye Pack", p: {gem: 375}, Finish: new Date("2017-12-19T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 86675, n: "Glacial weapons#Gallery", p: {blticket: 1}},
	{i: 74684, n: "Bat Wings Glider", p: {gem: 700}},
	{i: 73939, n: "Bat Wings Backpack", p: {gem: 700}},
	{i: 80066, n: "Celestial Rooster Glider", p: {gem: 500}},
	{i: 77291, n: "Soul River Glider", p: {gem: 500}},
	{i: 66658, n: "Shadow Assassin Outfit", p: {gem: 700}},
	{i: 68577, n: "Arcane Outfit", p: {gem: 700}},
	{i: 66279, n: "Ancestral Outfit", p: {gem: 700}},
	{i: 68654, n: "Imperial Outfit", p: {gem: 700}},
	{i: 68684, n: "Crystal Nomad Outfit", p: {gem: 700}},
	{i: 65198, n: "Fancy Winter Outfit", p: {gem: 700}},
	{i: 67857, n: "Glint's Gaze Mask", p: {gem: 500}},
	{i: 79014, n: "Xera's Mask", p: {gem: 400}},
	{i: 68655, n: "Dragon Mask Skin", p: {gem: 300}},
	{i: 68656, n: "Lion Mask Skin", p: {gem: 300}},
	{i: 64744, n: "Fuzzy Panda Hat", p: {gem: 200}},
	{i: 64746, n: "Fuzzy Leopard Hat", p: {gem: 200}},
	{i: 64749, n: "Sailor's Beanie", p: {gem: 200}},
	{i: 64748, n: "Reading Glasses", p: {gem: 150}}
	]
};