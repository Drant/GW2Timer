/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-08-29T16:00:00Z"),
	Finish: new Date("2017-09-13T16:00:00Z"),
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
	{i: 79698, n: "Customer Appreciation Package", p: {gem: 0}},
	{i: 83517, n: "Season 1 Memory Box - Scarlet vs. Lion's Arch", p: {gem: 0}, discount: [[1, 200], [10, 1500]], Finish: new Date("2017-09-04T16:00:00Z")},
	{i: "http://i.imgur.com/AKzkrkI.png", n: "Kasmeer's Package", p: {gem: 1600}},
	{i: "http://i.imgur.com/7KQdXAx.png", n: "Marjory's Package", p: {gem: 1600}},
	{i: 84014, n: "Swaggering Hat", p: {gem: 400}},
	{i: 65195, n: "Bloody Prince's Outfit", p: {gem: 700}},
	{i: 78008, n: "Gwen's Attire", p: {gem: 700}},
	{i: 77483, n: "Slayer's Outfit", p: {gem: 700}},
	{i: 69753, n: "Mad Scientist Outfit", p: {gem: 700}},
	{i: 83865, n: "Champion of Tyria Outfit", p: {gem: 700}},
	{i: 83341, n: "Sheet Music Glider", p: {gem: 400}},
	{i: 84782, n: "Mini Squire Aurene", p: {gem: 400}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 81816, n: "Abaddon weapon skins#Gallery", p: {blticket: 2}},
	{i: 79721, n: "Cosmic Harvesting Tool", p: {gem: 1000}, Finish: new Date("2017-09-04T16:00:00Z")},
	{i: 79472, n: "Cosmic Logging Tool", p: {gem: 1000}, Finish: new Date("2017-09-04T16:00:00Z")},
	{i: 78731, n: "Cosmic Mining Tool", p: {gem: 1000}, Finish: new Date("2017-09-04T16:00:00Z")},
	{i: 67040, n: "Ceremonial Plated Outfit", p: {gem: 700}, Finish: new Date("2017-09-03T16:00:00Z")},
	{i: 69662, n: "Daydreamer's Finery Outfit", p: {gem: 700}, Finish: new Date("2017-09-03T16:00:00Z")},
	{i: 63891, n: "Glowing Crimson Mask", p: {gem: 500}, Finish: new Date("2017-09-08T16:00:00Z")},
	{i: 79316, n: "Shattered Bloodstone Circlet", p: {gem: 400}, Finish: new Date("2017-09-08T16:00:00Z")},
	{i: 68574, n: "Shadow of the Dragon Helmet Skin", p: {gem: 300}, Finish: new Date("2017-09-09T16:00:00Z")},
	{i: 68575, n: "Shadow of the Dragon Shoulder Skin", p: {gem: 300}, Finish: new Date("2017-09-09T16:00:00Z")},
	{i: 68576, n: "Shadow of the Dragon Gloves Skin", p: {gem: 300}, Finish: new Date("2017-09-09T16:00:00Z")},
	{i: 64745, n: "Ringmaster's Hat", p: {gem: 200}, Finish: new Date("2017-09-08T16:00:00Z")},
	{i: 64743, n: "Sport Sunglasses", p: {gem: 150}, Finish: new Date("2017-09-08T16:00:00Z")}
	]
};