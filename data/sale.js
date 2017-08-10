/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-08-08T16:00:00Z"),
	Finish: new Date("2017-08-22T16:00:00Z"),
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
	{i: "http://i.imgur.com/g1s48MQ.png", n: "Path of Fire Preparation Pack", p: {gem: 3500}},
	{i: 84064, n: "Fiery Blade Axe", p: {gem: 500}},
	{i: 84112, n: "Icy Blade Axe", p: {gem: 500}},
	{i: 81545, n: "Jormag Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-08-22T16:00:00Z")},
	{i: 79315, n: "Emissary's Staff", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-11T16:00:00Z")},
	{i: 79360, n: "Amethyst Aegis", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-11T16:00:00Z")},
	{i: 79365, n: "Peacock Scepter Skin", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-12T16:00:00Z")},
	{i: 79386, n: "Dragon Kama Skin", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-12T16:00:00Z")},
	{i: 8466, n: "Belinda's Greatsword Skin", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-13T16:00:00Z")},
	{i: 20004, n: "Caithe's Bloom Dagger", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-13T16:00:00Z")},
	{i: 79372, n: "Kurzick Dual Axe Skin", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-14T16:00:00Z")},
	{i: 79310, n: "Storm Bow", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-14T16:00:00Z")},
	{i: 69752, n: "Chain-Whip Sword Skin", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-15T16:00:00Z")},
	{i: 81001, n: "Replica Mirror of Lyssa", p: {gem: 480}, discount: 600, Finish: new Date("2017-08-15T16:00:00Z")},
	{i: 47897, n: "Watchwork Mining Pick", p: {gem: 750}, discount: 1000, Finish: new Date("2017-08-16T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 81816, n: "Abaddon weapon skins#Gallery", p: {blticket: 2}},
	{i: 81664, n: "Mistlock Sanctuary Passkey", p: {gem: 1000}, Finish: new Date("2017-08-15T16:00:00Z")},
	{i: 80987, n: "Unbound Magic Harvesting Blast", p: {gem: 900}},
	{i: 80979, n: "Unbound Magic Logging Pulse", p: {gem: 900}},
	{i: 80977, n: "Unbound Magic Mining Beam", p: {gem: 900}},
	{i: 82011, n: "Abaddon's Glider", p: {gem: 400}}
	]
};