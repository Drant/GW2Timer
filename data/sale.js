/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-01-09T16:00:00Z"),
	Finish: new Date("2018-01-23T16:00:00Z"),
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
	 *	Finish: new Date("2018-01-01T16:00:00Z"), // Time the item or discount expires, optional
	 *	side: 0 or 1 // If has this property, these padding "items" will be ignored other than for creating column headers
	*/
	Items: [
	{i: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png", n: "Gem", p: {gem: 100}, url: "http://gw2timer.com/?page=Gem", side: 0},
	{i: 86786, n: "Black Lion Garden Plot Deed", p: {gem: 1000}},
	{i: 79698, n: "Customer Appreciation Package", p: {gem: 0}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 86675, n: "Glacial weapons#Gallery", p: {blticket: 1}},
	{i: 86690, n: "Umbral Demon Skimmer Skin", p: {gem: 1600}, Finish: new Date("2018-01-16T16:00:00Z")},
	{i: 77595, n: "Winter Solstice Outfit", p: {gem: 700}, Finish: new Date("2018-01-16T16:00:00Z")},
	{i: 77581, n: "Mini Snow Flurry Dragon", p: {gem: 500}, Finish: new Date("2018-01-16T16:00:00Z")},
	{i: 86507, n: "Mini Frozen Tik'Teek", p: {gem: 400}, Finish: new Date("2018-01-16T16:00:00Z")},
	{i: 80854, n: "Bloodstone Ascender", p: {gem: 250}, Finish: new Date("2018-01-16T16:00:00Z")},
	{i: 80795, n: "Shattered Bloodstone Glider", p: {gem: 400}, Finish: new Date("2018-01-16T16:00:00Z")}
	]
};
