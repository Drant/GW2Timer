/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-11-06T16:00:00Z"),
	Finish: new Date("2018-11-20T16:00:00Z"),
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
	{i: 89104, n: "Raven Helm", p: {gem: 400}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 89207, n: "Raven Mantle", p: {gem: 400}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 20349, n: "Upgrade Extractor", p: {gem: 250}, discount: [[3, 250, 750], [10, 700, 2200], [25, 1500, 5000]], Finish: new Date("2018-11-20T16:00:00Z")},
	{i: 88154, n: "Desert Racer Mount Select License", p: {gem: 720}, discount: 1200, Finish: new Date("2018-11-17T16:00:00Z")},
	{i: 88200, n: "Desert Racer Mount Adoption License", p: {gem: 400}, discount: [[1, 320, 400], [5, 1490, 1800], [15, 4800, 5100]], Finish: new Date("2018-11-17T16:00:00Z")},
	{i: 89086, n: "Firestorm Logging Tool", p: {gem: 1000}, Finish: new Date("2018-11-20T16:00:00Z")},
	{i: 81664, n: "Mistlock Sanctuary Passkey", p: {gem: 1000}, Finish: new Date("2018-11-20T16:00:00Z")},
	{i: 88108, n: "Storm Gloves", p: {gem: 500}, Finish: new Date("2018-11-16T16:00:00Z")},
	{i: 78667, n: "Chaos Gloves Skin", p: {gem: 500}, Finish: new Date("2018-11-16T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 89082, n: "Mad Realm weapon skins#Gallery", p: {blticket: 1}},
	{i: 89030, n: "Arachnid Glider", p: {gem: 700}, Finish: new Date("2018-11-20T16:00:00Z")},
	{i: 89003, n: "Nightfang Griffon Skin", p: {gem: 2000}, Finish: new Date("2018-11-20T16:00:00Z")},
	{i: 86739, n: "Arcane Marksman Rifle", p: {gem: 600}, Finish: new Date("2018-11-14T16:00:00Z")},
	{i: 69752, n: "Chain-Whip Sword Skin", p: {gem: 600}, Finish: new Date("2018-11-14T16:00:00Z")},
	{i: 79315, n: "Emissary's Staff", p: {gem: 600}, Finish: new Date("2018-11-14T16:00:00Z")}
	]
};
