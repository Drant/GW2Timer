/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-07-10T16:00:00Z"),
	Finish: new Date("2017-07-18T16:00:00Z"),
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
	{i: "http://i.imgur.com/nUcEfzX.png", n: "Dynamics Exo-Suit Appearance Pack", p: {gem: 1500}},
	{i: 81548, n: "Dynamics Exo-Suit Outfit", p: {gem: 700}},
	{i: 81547, n: "Dynamics Glider Module", p: {gem: 700}},
	{i: 81557, n: "Dynamics Projector Module", p: {gem: 700}},
	{i: 80019, n: "Scruffy Backpack", p: {gem: 280}, discount: 400, Finish: new Date("2017-07-17T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 68743, n: "Shadow weapon skins#Gallery", p: {blticket: 5}, Finish: new Date("2017-07-25T16:00:00Z")},
	{i: 78745, n: "Moth Wings Backpack", p: {gem: 700}, Finish: new Date("2017-07-14T16:00:00Z")},
	{i: 78768, n: "Moth Wings Glider", p: {gem: 700}, Finish: new Date("2017-07-14T16:00:00Z")},
	{i: 78007, n: "Bubble Glider", p: {gem: 500}, Finish: new Date("2017-07-15T16:00:00Z")},
	{i: 72252, n: "Crystal Arbiter Glider", p: {gem: 500}, Finish: new Date("2017-07-16T16:00:00Z")},
	{i: 80484, n: "Necrotic Glider", p: {gem: 500}, Finish: new Date("2017-07-16T16:00:00Z")},
	{i: 77738, n: "Phoenix Kite Glider", p: {gem: 400}, Finish: new Date("2017-07-14T16:00:00Z")},
	{i: 78790, n: "Floral Glider", p: {gem: 400}, Finish: new Date("2017-07-15T16:00:00Z")}
	]
};