/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-05-02T16:00:00Z"),
	Finish: new Date("2017-05-16T16:00:00Z"),
	Values: {}, // ID-to-Price mapping of the promoted items, to be initialized
	numPaddingItems: 2,
	/*
	 * These objects were copied from http://gw2timer.com/data/sales.js and may
	 * be augmented with these variables:
	 *	n: "", // Item name referencing an English wiki page
	 *	i: "", // Item ID to retrieve icon and tooltip details, or a URL to a hosted image
	 *	p: {gem: 400}, // Current payment for one item
	 *	url: "", // If not provided, will use name as a wiki link, optional
	 *	discount: [[1, 160, 200], [5, 640, 800], [25, 3200, 4000]] OR 200, // [[quantity, gempricecurrent, gempriceoldOptional], ...] OR gempriceoldOptional
	 *	Finish: new Date("2017-01-01T16:00:00Z"), // Time the item or discount expires, optional
	 *	side: 0 or 1 // If has this property, these padding "items" will be ignored other than for creating column headers
	*/
	Items: [
	{i: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png", n: "Gem", p: {gem: 100}, url: "http://gw2timer.com/?page=Gem", side: 0},
	{i: 43159, n: "Phoenix Light Armor Skin", p: {gem: 640}, discount: 800},
	{i: 43102, n: "Trickster's Light-Armor Skin", p: {gem: 640}, discount: 800},
	{i: 79531, n: "Mursaat Robes", p: {gem: 490}, discount: 700},
	{i: 77811, n: "Electromagnetic-Descender Glider", p: {gem: 308}, discount: 400},
	{i: 78771, n: "Electromagnetic Ascender", p: {gem: 192}, discount: 250},
	{i: 81001, n: "Replica Mirror of Lyssa", p: {gem: 600}},
	{i: 80973, n: "Kasmeer's Regal Outfit", p: {gem: 700}},
	{i: 80984, n: "Vine-Touched Destroyer Wings", p: {gem: 700}},
	{i: 80985, n: "Vine-Touched Destroyer Glider", p: {gem: 700}},
	{i: 49021, n: "Kasmeer's Staff Skin", p: {gem: 600}, Finish: new Date("2017-05-16T16:00:00Z")},
	{i: 49015, n: "Marjory's Axe Skin", p: {gem: 600}, Finish: new Date("2017-05-16T16:00:00Z")},
	{i: 49018, n: "Marjory's Dagger Skin", p: {gem:600}, Finish: new Date("2017-05-16T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 79721, n: "Cosmic Harvesting Tool", p: {gem: 1000}},
	{i: 79472, n: "Cosmic Logging Tool", p: {gem: 1000}},
	{i: 78731, n: "Cosmic Mining Tool", p: {gem: 1000}},
	{i: 42960, n: "Mini Scruffy", p: {gem: 500}},
	{i: 45044, n: "Mini Frostbite", p: {gem: 400}},
	{i: 77649, n: "Mini Arrowhead", p: {gem: 400}},
	{i: 67839, n: "Mini Pact Airship", p: {gem: 350}},
	{i: 67841, n: "Mini Avatar of the Tree", p: {gem: 350}},
	{i: 67840, n: "Mini Drooburt's Ghost", p: {gem: 350}},
	{i: 70191, n: "Mini Wyvern", p: {gem: 350}},
	{i: 69621, n: "Miniature Moose", p: {gem: 350}},
	{i: 47900, n: "Metallurgic Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-05-16T16:00:00Z")}
	]
};