/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-07-17T16:00:00Z"),
	Finish: new Date("2018-07-31T16:00:00Z"),
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
	{i: 88190, n: "Lightning Aspect Eye", p: {gem: 166}},
	{i: 88161, n: "Sun Aspect Eye", p: {gem: 166}},
	{i: 88170, n: "Wind Aspect Eye", p: {gem: 166}},
	{i: 42967, n: "Lightning Kite", p: {gem: 250}, discount: 500, Finish: new Date("2018-07-31T16:00:00Z")},
	{i: 43076, n: "Wind Kite", p: {gem: 250}, discount: 500, Finish: new Date("2018-07-31T16:00:00Z")},
	{i: 43487, n: "Sun Kite", p: {gem: 250}, discount: 500, Finish: new Date("2018-07-31T16:00:00Z")},
	{i: 88111, n: "Tremor Armadillo Roller Beetle Skin", p: {gem: 2000}},
	{i: 87564, n: "Venom Warblade", p: {gem: 600}},
	{i: 88108, n: "Storm Gloves", p: {gem: 500}},
	{i: 85470, n: "Desert King Glider", p: {gem: 700}},
	{i: 88114, n: "Desert King Reliquary Backpiece", p: {gem: 700}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88077, n: "Desert King weapon skins#Gallery", p: {blticket: 1}},
	{i: 66230, n: "Phoenix weapon skins#Gallery", p: {blticket: 5}},
	{i: "https://i.imgur.com/mIuPrbz.png", n: "Bandit Sniper Appearance Pack", p: {gem: 2000}, Finish: new Date("2018-07-27T16:00:00Z")},
	{i: "https://i.imgur.com/WCB4gGK.png", n: "Outlaw Appearance Pack", p: {gem: 2000}, Finish: new Date("2018-07-27T16:00:00Z")},
	{i: "https://i.imgur.com/RoBhHfY.png", n: "White Mantle Appearance Pack", p: {gem: 2000}, Finish: new Date("2018-07-27T16:00:00Z")},
	{i: 87478, n: "Suntouched Scythe Staff Skin", p: {gem: 600}, Finish: new Date("2018-07-27T16:00:00Z")},
	{i: 87182, n: "Inquest Exo-Suit Outfit", p: {gem: 700}, Finish: new Date("2018-07-27T16:00:00Z")},
	{i: 87477, n: "Primeval Dervish Outfit", p: {gem: 700}, Finish: new Date("2018-07-27T16:00:00Z")}
	]
};
