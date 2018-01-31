/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-01-30T16:00:00Z"),
	Finish: new Date("2018-02-13T16:00:00Z"),
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
	{i: 86899, n: "Grand Lion Griffon Skin", p: {gem: 2000}},
	{i: 86739, n: "Arcane Marksman Rifle", p: {gem: 600}},
	{i: 86897, n: "Jackal Rune Greaves", p: {gem: 500}},
	{i: 86904, n: "Jackal Rune Gauntlets", p: {gem: 500}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 86675, n: "Glacial weapons#Gallery", p: {blticket: 1}},
	{i: 86766, n: "Summit Chevron Springer Mount", p: {gem: 2000}, Finish: new Date("2018-02-06T16:00:00Z")},
	{i: 81594, n: "Black Lion Hunters Contract", p: {gem: 1200}, Finish: new Date("2018-02-06T16:00:00Z")},
	{i: 86786, n: "Black Lion Garden Plot Deed", p: {gem: 1000}},
	{i: 81548, n: "Dynamics Exo-Suit Outfit", p: {gem: 700}, Finish: new Date("2018-02-06T16:00:00Z")},
	{i: 83865, n: "Champion of Tyria Outfit", p: {gem: 700}, Finish: new Date("2018-02-06T16:00:00Z")},
	{i: 49021, n: "Kasmeer's Staff Skin", p: {gem: 600}, Finish: new Date("2018-01-31T16:00:00Z")},
	{i: 49015, n: "Marjory's Axe Skin", p: {gem: 600}, Finish: new Date("2018-02-01T16:00:00Z")},
	{i: 49018, n: "Marjory's Dagger Skin", p: {gem: 600}, Finish: new Date("2018-02-01T16:00:00Z")},
	{i: 86834, n: "Permanent Sandshark Finisher", p: {gem: 600}},
	{i: 70044, n: "Butterfly Harvesting Flute", p: {gem: 1000}, Finish: new Date("2018-02-06T16:00:00Z")},
	{i: 69921, n: "Swarm Logging Flute", p: {gem: 1000}, Finish: new Date("2018-02-06T16:00:00Z")},
	{i: 69958, n: "Firefly Mining Flute", p: {gem: 1000}, Finish: new Date("2018-02-06T16:00:00Z")}
	]
};
