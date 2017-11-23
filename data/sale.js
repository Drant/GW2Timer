/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-10-17T16:00:00Z"),
	Finish: new Date("2017-11-28T16:00:00Z"),
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
	{i: 43100, n: "Phalanx Heavy-Armor Skin", p: {gem: 640}, discount: 800, Finish: new Date("2017-11-28T16:00:00Z")},
	{i: 43159, n: "Phoenix Light Armor Skin", p: {gem: 640}, discount: 800, Finish: new Date("2017-11-28T16:00:00Z")},
	{i: 43158, n: "Magitech Medium Armor Skin", p: {gem: 640}, discount: 800, Finish: new Date("2017-11-28T16:00:00Z")},
	{i: "https://i.imgur.com/IEbqAQ1.png", n: "Heroes Dye Pack", p: {gem: 375}},
	{i: "https://i.imgur.com/vifSGUV.png", n: "Taimi's Package", p: {gem: 2000}},
	{i: "https://i.imgur.com/fb9KMVN.png", n: "The Evon Gnashblade Decorative Package", p: {gem: 3000}},
	{i: 85538, n: "Reforged Warhound", p: {gem: 2000}, Finish: new Date("2017-11-28T16:00:00Z")},
	{i: "https://i.imgur.com/XALQHjn.png", n: "Salvaged Forged Gloves", p: {gem: 400}},
	{i: "https://i.imgur.com/9JsQuB3.png", n: "Salvaged Forged Helm", p: {gem: 400}},
	{i: "https://i.imgur.com/YwbSAGQ.png", n: "Mini Kormeerkat", p: {gem: 350}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 85608, n: "Shifting Sands weapons#Gallery", p: {blticket: 1}},
	{i: 70044, n: "Butterfly Harvesting Flute", p: {gem: 1000}},
	{i: 69921, n: "Swarm Logging Flute", p: {gem: 1000}},
	{i: 69958, n: "Firefly Mining Flute", p: {gem: 1000}},
	{i: 80987, n: "Unbound Magic Harvesting Blast", p: {gem: 900}, Finish: new Date("2017-11-28T16:00:00Z")},
	{i: 80979, n: "Unbound Magic Logging Pulse", p: {gem: 900}, Finish: new Date("2017-11-28T16:00:00Z")},
	{i: 80977, n: "Unbound Magic Mining Beam", p: {gem: 900}, Finish: new Date("2017-11-28T16:00:00Z")}
	]
};