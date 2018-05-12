/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-05-02T16:00:00Z"),
	Finish: new Date("2018-05-16T16:00:00Z"),
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
	{i: 87539, n: "Shrine Guardian Jackal Skin", p: {gem: 2000}, Finish: new Date("2018-05-16T16:00:00Z")},
	{i: 79721, n: "Cosmic Harvesting Tool", p: {gem: 1000}},
	{i: 79472, n: "Cosmic Logging Tool", p: {gem: 1000}},
	{i: 78731, n: "Cosmic Mining Tool", p: {gem: 1000}},
	{i: 81545, n: "Jormag Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-05-11T16:00:00Z")},
	{i: 86163, n: "Elonian Landscape Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-05-11T16:00:00Z")},
	{i: 43078, n: "Lion's Arch Commemorative Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-05-12T16:00:00Z")},
	{i: 64254, n: "Lion's Arch Survivors Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-05-12T16:00:00Z")},
	{i: 67291, n: "Taimi's Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-05-13T16:00:00Z")},
	{i: 79695, n: "Vibrant Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-05-13T16:00:00Z")},
	{i: 81548, n: "Dynamics Exo-Suit Outfit", p: {gem: 700}, Finish: new Date("2018-05-09T16:00:00Z")},
	{i: 81547, n: "Dynamics Glider Module", p: {gem: 700}},
	{i: 43100, n: "Phalanx Heavy-Armor Skin", p: {gem: 800}, Finish: new Date("2018-05-11T16:00:00Z")},
	{i: 43159, n: "Phoenix Light Armor Skin", p: {gem: 800}, Finish: new Date("2018-05-11T16:00:00Z")},
	{i: 43158, n: "Magitech Medium Armor Skin", p: {gem: 800}, Finish: new Date("2018-05-11T16:00:00Z")},
	{i: 87478, n: "Suntouched Scythe Staff Skin", p: {gem: 600}, Finish: new Date("2018-05-15T16:00:00Z")},
	{i: 87477, n: "Primeval Dervish Outfit", p: {gem: 700}},
	{i: 69664, n: "Elegant Fan Focus Skin", p: {gem: 600}, Finish: new Date("2018-04-28T16:00:00Z")},
	{i: 87429, n: "Beastslayer Glider", p: {gem: 400}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 87389, n: "Inquest Mark II#Gallery", p: {blticket: 1}},
	{i: 67032, n: "Fused Molten Sickle", p: {gem: 1000}, Finish: new Date("2018-05-15T16:00:00Z")},
	{i: 67030, n: "Fused Molten Logging Axe", p: {gem: 1000}, Finish: new Date("2018-05-15T16:00:00Z")},
	{i: 48933, n: "Molten Alliance Mining Pick", p: {gem: 1000}, Finish: new Date("2018-05-15T16:00:00Z")},
	{i: 87425, n: "Shifting Sand Mining Pick", p: {gem: 1000}, Finish: new Date("2018-05-15T16:00:00Z")}
	]
};
