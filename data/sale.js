/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-11-27T16:00:00Z"),
	Finish: new Date("2018-12-18T16:00:00Z"),
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
	{i: "https://i.imgur.com/G0wZ34L.png", n: "Cozy Wintersday Mounts Pack", p: {gem: 1600}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 77494, n: "Wintersday Wreath Backpack", p: {gem: 350}, discount: 500, Finish: new Date("2018-12-25T16:00:00Z")},
	{i: 89400, n: "Candy Cane Chair", p: {gem: 400}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 89428, n: "Gem Aura Outfit", p: {gem: 700}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 89433, n: "Cryomancer Glider", p: {gem: 500}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 44070, n: "Permanent Gift Finisher", p: {gem: 600}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 44071, n: "Permanent Snowman Finisher", p: {gem: 700}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 47896, n: "Permanent Snow Globe Finisher", p: {gem: 700}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 48931, n: "Chop-It-All Logging Axe", p: {gem: 1000}, Finish: new Date("2018-12-23T16:00:00Z")},
	{i: 78909, n: "Glitter Bomb Harvesting Tool", p: {gem: 1000}, Finish: new Date("2018-12-23T16:00:00Z")},
	{i: 49308, n: "Thresher-Sickle 5000", p: {gem: 1000}, Finish: new Date("2018-12-23T16:00:00Z")},
	{i: 47897, n: "Watchwork Mining Pick", p: {gem: 1000}, Finish: new Date("2018-12-23T16:00:00Z")},
	{i: 77738, n: "Phoenix Kite Glider", p: {gem: 400}, Finish: new Date("2018-12-23T16:00:00Z")},
	{i: 83341, n: "Sheet Music Glider", p: {gem: 400}, Finish: new Date("2018-12-23T16:00:00Z")},
	{i: 79663, n: "Bloodstone Glider", p: {gem: 500}, Finish: new Date("2018-12-22T16:00:00Z")},
	{i: 80066, n: "Celestial Rooster Glider", p: {gem: 500}, Finish: new Date("2018-12-22T16:00:00Z")},
	{i: 81548, n: "Dynamics Exo-Suit Outfit", p: {gem: 700}, Finish: new Date("2018-12-22T16:00:00Z")},
	{i: 81547, n: "Dynamics Glider Module", p: {gem: 700}, Finish: new Date("2018-12-22T16:00:00Z")},
	{i: 69478, n: "Mad Scientist's Harvesting Tool", p: {gem: 1000}, Finish: new Date("2018-12-22T16:00:00Z")},
	{i: 68799, n: "Mad Scientist's Logging Tool", p: {gem: 1000}, Finish: new Date("2018-12-22T16:00:00Z")},
	{i: 68905, n: "Mad Scientist's Mining Tool", p: {gem: 1000}, Finish: new Date("2018-12-22T16:00:00Z")},
	{i: 74684, n: "Bat Wings Glider", p: {gem: 700}, Finish: new Date("2018-12-21T16:00:00Z")},
	{i: 73939, n: "Bat Wings Backpack", p: {gem: 700}, Finish: new Date("2018-12-21T16:00:00Z")},
	{i: 77291, n: "Soul River Glider", p: {gem: 500}, Finish: new Date("2018-12-21T16:00:00Z")},
	{i: 79721, n: "Cosmic Harvesting Tool", p: {gem: 1000}, Finish: new Date("2018-12-21T16:00:00Z")},
	{i: 79472, n: "Cosmic Logging Tool", p: {gem: 1000}, Finish: new Date("2018-12-21T16:00:00Z")},
	{i: 78731, n: "Cosmic Mining Tool", p: {gem: 1000}, Finish: new Date("2018-12-21T16:00:00Z")},
	{i: 65202, n: "Festive Hat", p: {gem: 150}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 80026, n: "Ice Crown", p: {gem: 400}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 64749, n: "Sailor's Beanie", p: {gem: 200}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 67887, n: "Shoulder Scarf", p: {gem: 400}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 65200, n: "Wintersday Earmuffs", p: {gem: 25}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 89370, n: "Thunderstrike Harvesting Tool", p: {gem: 1000}, Finish: new Date("2018-12-25T16:00:00Z")},
	{i: "https://i.imgur.com/lbGRGqq.png", n: "Wintersday Appearance Package", p: {gem: 2000}, Finish: new Date("2018-12-25T16:00:00Z")},
	{i: 77621, n: "Mini Angry Wintersday Gift", p: {gem: 400}, Finish: new Date("2018-12-26T16:00:00Z")},
	{i: 42978, n: "Wintersday Minis 3-Pack", p: {gem: 500}, Finish: new Date("2018-12-26T16:00:00Z")},
	{i: 80044, n: "Mini Festive Aurene", p: {gem: 400}, Finish: new Date("2018-12-27T16:00:00Z")},
	{i: 77528, n: "Snowflake Glider", p: {gem: 500}, Finish: new Date("2018-12-27T16:00:00Z")},
	{i: 86637, n: "Winter Monarch Outfit", p: {gem: 700}, Finish: new Date("2018-12-25T16:00:00Z")},
	{i: 86715, n: "Glacial Glider", p: {gem: 500}, Finish: new Date("2018-12-25T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 89082, n: "Mad Realm weapon skins#Gallery", p: {blticket: 1}}
	]
};
