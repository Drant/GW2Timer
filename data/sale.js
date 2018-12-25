/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-12-18T16:00:00Z"),
	Finish: new Date("2019-01-08T16:00:00Z"),
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
	{i: 85580, n: "Mount Adoption License", p: {gem: 400}, discount: [[1, 400], [10, 3400]], Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 89393, n: "Winter Antlers", p: {gem: 250}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 89388, n: "Enchanted Winter Antlers", p: {gem: 250}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 67868, n: "Arctic Explorer Outfit", p: {gem: 490}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 47883, n: "Stag Helm Skin", p: {gem: 300}, discount: 500, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 86507, n: "Mini Frozen Tik'Teek", p: {gem: 280}, discount: 400, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 70009, n: "White Feather Wings Glider", p: {gem: 525}, discount: 700, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 69882, n: "White Feather Wings Backpack", p: {gem: 525}, discount: 700, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 86516, n: "Freezie Crown", p: {gem: 350}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 80049, n: "Ice Encasement Outfit", p: {gem: 700}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: "https://i.imgur.com/G0wZ34L.png", n: "Cozy Wintersday Mounts Pack", p: {gem: 1600}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 89400, n: "Candy Cane Chair", p: {gem: 400}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 89428, n: "Gem Aura Outfit", p: {gem: 700}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 89433, n: "Cryomancer Glider", p: {gem: 500}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 44070, n: "Permanent Gift Finisher", p: {gem: 600}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 44071, n: "Permanent Snowman Finisher", p: {gem: 700}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 47896, n: "Permanent Snow Globe Finisher", p: {gem: 700}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 65202, n: "Festive Hat", p: {gem: 150}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 80026, n: "Ice Crown", p: {gem: 400}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 64749, n: "Sailor's Beanie", p: {gem: 200}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 67887, n: "Shoulder Scarf", p: {gem: 400}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 65200, n: "Wintersday Earmuffs", p: {gem: 25}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: "https://i.imgur.com/lbGRGqq.png", n: "Wintersday Appearance Package", p: {gem: 2000}, Finish: new Date("2018-12-25T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 89082, n: "Mad Realm weapon skins#Gallery", p: {blticket: 1}},
	{i: 86899, n: "Grand Lion Griffon Skin", p: {gem: 2000}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 89003, n: "Nightfang Griffon Skin", p: {gem: 2000}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 65202, n: "Festive Hat", p: {gem: 150}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 86715, n: "Glacial Glider", p: {gem: 500}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 88111, n: "Tremor Armadillo Roller Beetle Skin", p: {gem: 2000}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 86637, n: "Winter Monarch Outfit", p: {gem: 700}, Finish: new Date("2019-01-01T16:00:00Z")},
	{i: 87368, n: "Istani Isles—Mount Adoption License", p: {gem: 400}, discount: [[1, 400], [5, 1800]]},
	{i: 87360, n: "Istani Isles—Mount Select License", p: {gem: 1200}},
	{i: 88340, n: "Timekeeper Glider", p: {gem: 500}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 88321, n: "Timekeeper Outfit", p: {gem: 700}, Finish: new Date("2018-12-28T16:00:00Z")},
	{i: 77621, n: "Mini Angry Wintersday Gift", p: {gem: 400}, Finish: new Date("2018-12-26T16:00:00Z")},
	{i: 42978, n: "Wintersday Minis 3-Pack", p: {gem: 500}, Finish: new Date("2018-12-26T16:00:00Z")},
	{i: 80044, n: "Mini Festive Aurene", p: {gem: 400}, Finish: new Date("2018-12-27T16:00:00Z")},
	{i: 77528, n: "Snowflake Glider", p: {gem: 500}, Finish: new Date("2018-12-27T16:00:00Z")}
	]
};
