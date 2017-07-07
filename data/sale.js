/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-06-20T16:00:00Z"),
	Finish: new Date("2017-07-10T16:00:00Z"),
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
	{i: 81582, n: "Winter in Summer Mystery Box", p: {gem: 0}, discount: [[1, 150], [10, 1200]]},
	{i: 80044, n: "Mini Festive Aurene", p: {gem: 400}, Finish: new Date("2017-07-08T16:00:00Z")},
	{i: 65198, n: "Fancy Winter Outfit", p: {gem: 700}, Finish: new Date("2017-07-09T16:00:00Z")},
	{i: 70009, n: "White Feather Wings Glider", p: {gem: 700}, Finish: new Date("2017-07-07T16:00:00Z")},
	{i: 69882, n: "White Feather Wings Backpack", p: {gem: 700}, Finish: new Date("2017-07-07T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 49323, n: "Tormented weapon skins#Gallery", p: {blticket: 5}},
	{i: 79702, n: "Plush Aurene Backpack Cover", p: {gem: 400}, Finish: new Date("2017-07-11T16:00:00Z")},
	{i: 81583, n: "Fuzzy Aurene Hat", p: {gem: 400}, Finish: new Date("2017-07-11T16:00:00Z")},
	{i: 81565, n: "Mini Plush Aurene", p: {gem: 400}}
	]
};