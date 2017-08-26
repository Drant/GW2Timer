/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-08-08T16:00:00Z"),
	Finish: new Date("2017-08-29T16:00:00Z"),
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
	{i: 83517, n: "Season 1 Memory Box - Scarlet vs. Lion's Arch", p: {gem: 0}, discount: [[1, 200], [10, 1500]]},
	{i: 83073, n: "Season 1 Memory Box - Flame and Festivals", p: {gem: 0}, discount: [[1, 200], [10, 1500]], Finish: new Date("2017-08-29T17:00:00Z")},
	{i: 19993, n: "Bag Slot Expansion", p: {gem: 280}, discount: 400, Finish: new Date("2017-08-27T17:00:00Z")},
	{i: 35991, n: "Total Makeover Kit", p: {gem: 105}, discount: [[1, 350], [5, 1400]], Finish: new Date("2017-08-27T17:00:00Z")},
	{i: 35989, n: "Name Change Contract", p: {gem: 400}, discount: 800, Finish: new Date("2017-08-28T17:00:00Z")},
	{i: 19995, n: "Bank Tab Expansion", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-29T17:00:00Z")},
	{i: 19980, n: "Black Lion Chest Key", p: {gem: 93}, discount: [[1, 125], [5, 450], [25, 2100]], Finish: new Date("2017-08-29T17:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 81816, n: "Abaddon weapon skins#Gallery", p: {blticket: 2}},
	{i: "http://i.imgur.com/GwhNI7D.png", n: "Champion of Tyria Package", p: {gem: 1800}},
	{i: 79707, n: "Crystalline Dragon Wings Backpack", p: {gem: 700}, Finish: new Date("2017-09-01T17:00:00Z")},
	{i: 79704, n: "Crystalline Dragon Wings Glider", p: {gem: 700}, Finish: new Date("2017-09-01T17:00:00Z")},
	{i: 64756, n: "Cook's Outfit", p: {gem: 700}, Finish: new Date("2017-09-01T17:00:00Z")},
	{i: 69863, n: "Monk's Outfit", p: {gem: 700}, Finish: new Date("2017-09-01T17:00:00Z")},
	{i: 83865, n: "Champion of Tyria Outfit", p: {gem: 700}},
	{i: 83341, n: "Sheet Music Glider", p: {gem: 400}},
	{i: 84782, n: "Mini Squire Aurene", p: {gem: 400}},
	{i: 81776, n: "Abaddon's Mask", p: {gem: 500}},
	{i: 68681, n: "Snow Owl Mail Carrier", p: {gem: 350}}
	]
};