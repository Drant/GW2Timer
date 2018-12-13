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
	{i: 89414, n: "Mini Trailblazer Roller Beetle", p: {gem: 0}, discount: 400, Finish: new Date("2018-12-18T16:00:00Z")},
	{i: 49149, n: "Royal Terrace Pass", p: {gem: 650}, discount: 1000, Finish: new Date("2018-12-18T16:00:00Z")},
	{i: 65202, n: "Festive Hat", p: {gem: 150}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 85528, n: "Salvaged Forged Helm", p: {gem: 400}, Finish: new Date("2018-12-17T16:00:00Z")},
	{i: 85615, n: "Salvaged Forged Gloves", p: {gem: 400}, Finish: new Date("2018-12-17T16:00:00Z")},
	{i: 64750, n: "Top Hat", p: {gem: 200}, Finish: new Date("2018-12-17T16:00:00Z")},
	{i: 68655, n: "Dragon Mask Skin", p: {gem: 300}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 68656, n: "Lion Mask Skin", p: {gem: 300}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 79014, n: "Xera's Mask", p: {gem: 400}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 64746, n: "Fuzzy Leopard Hat", p: {gem: 200}, Finish: new Date("2018-12-15T16:00:00Z")},
	{i: 64744, n: "Fuzzy Panda Hat", p: {gem: 200}, Finish: new Date("2018-12-15T16:00:00Z")},
	{i: 67857, n: "Glint's Gaze Mask", p: {gem: 500}, Finish: new Date("2018-12-15T16:00:00Z")},
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
	{i: 89082, n: "Mad Realm weapon skins#Gallery", p: {blticket: 1}},
	{i: 82011, n: "Abaddon's Glider", p: {gem: 400}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 82666, n: "Geomancer Glider", p: {gem: 500}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 88431, n: "Shattered Cathedral Glider", p: {gem: 700}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 87549, n: "Sunspear Glider", p: {gem: 400}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 48930, n: "Consortium Harvesting Sickle", p: {gem: 1000}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 48825, n: "Frost Wasp Logging Tool", p: {gem: 1000}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 48934, n: "Jack-in-the-Box Scythe", p: {gem: 1000}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 87425, n: "Shifting Sand Mining Pick", p: {gem: 1000}, Finish: new Date("2018-12-16T16:00:00Z")},
	{i: 48932, n: "Bone Pick", p: {gem: 1000}, Finish: new Date("2018-12-15T16:00:00Z")},
	{i: 67063, n: "Tireless Harvesting Minion", p: {gem: 1000}, Finish: new Date("2018-12-15T16:00:00Z")},
	{i: 67029, n: "Tireless Logging Minion", p: {gem: 1000}, Finish: new Date("2018-12-15T16:00:00Z")},
	{i: 77811, n: "Electromagnetic-Descender Glider", p: {gem: 400}, Finish: new Date("2018-12-15T16:00:00Z")},
	{i: 81291, n: "Magic Carpet Glider", p: {gem: 400}, Finish: new Date("2018-12-15T16:00:00Z")},
	{i: 76236, n: "Exalted Glider", p: {gem: 400}, Finish: new Date("2018-12-15T16:00:00Z")},
	{i: 48933, n: "Molten Alliance Mining Pick", p: {gem: 1000}, Finish: new Date("2018-12-14T16:00:00Z")},
	{i: 67032, n: "Fused Molten Sickle", p: {gem: 1000}, Finish: new Date("2018-12-14T16:00:00Z")},
	{i: 67030, n: "Fused Molten Logging Axe", p: {gem: 1000}, Finish: new Date("2018-12-14T16:00:00Z")},
	{i: 77677, n: "Hawk Wings Backpack Skin", p: {gem: 700}, Finish: new Date("2018-12-14T16:00:00Z")},
	{i: 77678, n: "Hawk Wings Glider", p: {gem: 700}, Finish: new Date("2018-12-14T16:00:00Z")},
	{i: 80484, n: "Necrotic Glider", p: {gem: 500}, Finish: new Date("2018-12-14T16:00:00Z")},
	{i: 78006, n: "Ironclad Glider", p: {gem: 500}, Finish: new Date("2018-12-14T16:00:00Z")},
	{i: 85470, n: "Desert King Glider", p: {gem: 700}, Finish: new Date("2018-12-14T16:00:00Z")}
	]
};
