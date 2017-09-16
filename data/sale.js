/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-09-13T16:00:00Z"),
	Finish: new Date("2017-09-27T16:00:00Z"),
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
	{i: 64740, n: "Aviator Sunglasses", p: {gem: 150}},
	{i: 64753, n: "Wide Rim Glasses", p: {gem: 150}},
	{i: "https://i.imgur.com/u74xsUH.png", n: "Rox's Package", p: {gem: 1600}, Finish: new Date("2017-09-19T16:00:00Z")},
	{i: "https://i.imgur.com/vifSGUV.png", n: "Taimi's Package", p: {gem: 2000}, Finish: new Date("2017-09-19T16:00:00Z")},
	{i: 82391, n: "Grenth's Regalia Outfit", p: {gem: 700}},
	{i: 82666, n: "Geomancer Glider", p: {gem: 500}},
	{i: 67063, n: "Tireless Harvesting Minion", p: {gem: 1000}},
	{i: 67029, n: "Tireless Logging Minion", p: {gem: 1000}},
	{i: 48932, n: "Bone Pick", p: {gem: 1000}},
	{i: 77483, n: "Slayer's Outfit", p: {gem: 700}},
	{i: 69753, n: "Mad Scientist Outfit", p: {gem: 700}},
	{i: 77676, n: "Nature's Oath Outfit", p: {gem: 700}},
	{i: 78010, n: "Ironclad Outfit", p: {gem: 700}},
	{i: 63940, n: "Lawless Helmet Skin", p: {gem: 300}},
	{i: 42962, n: "Lawless Shoulder Skin", p: {gem: 300}},
	{i: 43525, n: "Lawless Gloves Skin", p: {gem: 300}},
	{i: 42966, n: "Lawless Boots Skin", p: {gem: 300}},
	{i: 64758, n: "Fuzzy Cat Hat", p: {gem: 200}},
	{i: 64742, n: "Aviator Cap", p: {gem: 200}},
	{i: 42951, n: "Mini Mordrem Leyleecher", p: {gem: 500}},
	{i: 77339, n: "Mini Sabetha", p: {gem: 350}},
	{i: 67838, n: "Mini Sand Giant", p: {gem: 350}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 81816, n: "Abaddon weapon skins#Gallery", p: {blticket: 2}},
	{i: 78727, n: "Macaw Wings Glider", p: {gem: 700}, Finish: new Date("2017-09-17T16:00:00Z")},
	{i: 79595, n: "Mursaat Wings Glider", p: {gem: 700}, Finish: new Date("2017-09-17T16:00:00Z")},
	{i: 79631, n: "Spectral Glider", p: {gem: 500}, Finish: new Date("2017-09-17T16:00:00Z")},
	{i: 79010, n: "Glide-r-Tron", p: {gem: 500}, Finish: new Date("2017-09-18T16:00:00Z")},
	{i: 77821, n: "Classical Glider", p: {gem: 400}, Finish: new Date("2017-09-18T16:00:00Z")},
	{i: 76236, n: "Exalted Glider", p: {gem: 400}, Finish: new Date("2017-09-18T16:00:00Z")},
	{i: 45044, n: "Mini Frostbite", p: {gem: 400}, Finish: new Date("2017-09-16T16:00:00Z")},
	{i: 79048, n: "Mini Garm", p: {gem: 350}, Finish: new Date("2017-09-16T16:00:00Z")},
	{i: 42583, n: "Mini Orange Kitten", p: {gem: 400}, Finish: new Date("2017-09-16T16:00:00Z")},
	{i: 42591, n: "Mini White Kitten", p: {gem: 400}, Finish: new Date("2017-09-16T16:00:00Z")}
	]
};