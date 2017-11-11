/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-10-17T16:00:00Z"),
	Finish: new Date("2017-11-21T16:00:00Z"),
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
	{i: "https://i.imgur.com/PuHTFpK.png", n: "Mount Adoption License 30 Pack", p: {gem: 9600}},
	{i: 85580, n: "Mount Adoption License", p: {gem: 400}, discount: [[1, 400], [10, 3400]]},
	{i: 85538, n: "Reforged Warhound", p: {gem: 2000}},
	{i: 67027, n: "Silver-Fed Salvage-o-Matic", p: {gem: 500}, Finish: new Date("2017-11-14T16:00:00Z")},
	{i: 85448, n: "Awakened Zealot Outfit", p: {gem: 700}},
	{i: 68577, n: "Arcane Outfit", p: {gem: 700}},
	{i: 68684, n: "Crystal Nomad Outfit", p: {gem: 700}},
	{i: 65198, n: "Fancy Winter Outfit", p: {gem: 700}},
	{i: 67398, n: "Noble Count Outfit", p: {gem: 700}},
	{i: 66658, n: "Shadow Assassin Outfit", p: {gem: 700}},
	{i: 66279, n: "Ancestral Outfit", p: {gem: 700}},
	{i: 68654, n: "Imperial Outfit", p: {gem: 700}},
	{i: 68653, n: "Crimson Lion Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: 81545, n: "Jormag Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: 80974, n: "Primordus Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: 67291, n: "Taimi's Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: 77470, n: "Winter Chimes Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 84963, n: "War God's weapon skins#Gallery", p: {blticket: 1}},
	{i: "https://i.imgur.com/e5G1iUR.png", n: "Elonian Introductory Package", p: {gem: 1800}, Finish: new Date("2017-11-14T16:00:00Z")},
	{i: 70044, n: "Butterfly Harvesting Flute", p: {gem: 1000}},
	{i: 69921, n: "Swarm Logging Flute", p: {gem: 1000}},
	{i: 69958, n: "Firefly Mining Flute", p: {gem: 1000}},
	{i: 48930, n: "Consortium Harvesting Sickle", p: {gem: 1000}, Finish: new Date("2017-11-10T16:00:00Z")},
	{i: 48955, n: "Dreamcleaver Logging Axe", p: {gem: 1000}, Finish: new Date("2017-11-10T16:00:00Z")},
	{i: 78724, n: "Focused Solar Logging Tool", p: {gem: 1000}, Finish: new Date("2017-11-10T16:00:00Z")},
	{i: 78909, n: "Glitter Bomb Harvesting Tool", p: {gem: 1000}, Finish: new Date("2017-11-10T16:00:00Z")},
	{i: 80019, n: "Scruffy Backpack", p: {gem: 400}},
	{i: 79771, n: "Fire Quiver Backpack", p: {gem: 400}},
	{i: 68612, n: "Plush Ram Backpack", p: {gem: 300}},
	{i: 39519, n: "Warrior Quaggan Backpack Cover", p: {gem: 300}}
	]
};