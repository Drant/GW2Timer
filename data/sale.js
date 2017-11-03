/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-10-17T16:00:00Z"),
	Finish: new Date("2017-11-07T16:00:00Z"),
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
	{i: 67398, n: "Noble Count Outfit", p: {gem: 490}, discount: 700, Finish: new Date("2017-11-03T16:00:00Z")},
	{i: 70385, n: "Lunatic Guard Outfit", p: {gem: 490}, discount: 700, Finish: new Date("2017-11-03T16:00:00Z")},
	{i: 85448, n: "Awakened Zealot Outfit", p: {gem: 700}},
	{i: 85481, n: "Mini Choya Pumpkin Gang", p: {gem: 400}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 79619, n: "Furrocious Cat Ears", p: {gem: 400}, Finish: new Date("2017-11-03T16:00:00Z")},
	{i: 79666, n: "Hovering Mad Mirror", p: {gem: 250}, Finish: new Date("2017-11-03T16:00:00Z")},
	{i: 85437, n: "Mini Spooky Mounts Pack", p: {gem: 1600}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 67391, n: "Haunted Gramophone", p: {gem: 600}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 85496, n: "Riding Broom Glider", p: {gem: 500}},
	{i: 85506, n: "Mini Elonian Familiar", p: {gem: 400}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 79651, n: "Mini Feline Familiar", p: {gem: 350}, Finish: new Date("2017-11-03T16:00:00Z")},
	{i: 67406, n: "Candy Corn Gobbler Pack", p: {gem: 300}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 44069, n: "Permanent Scarecrow Finisher", p: {gem: 500}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 84963, n: "War God's weapon skins#Gallery", p: {blticket: 1}},
	{i: "https://i.imgur.com/od18Djw.png", n: "Dragon's Watch Dye Pack", p: {gem: 500}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 47900, n: "Metallurgic Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 74684, n: "Bat Wings Glider", p: {gem: 700}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 73939, n: "Bat Wings Backpack", p: {gem: 700}, Finish: new Date("2017-11-07T16:00:00Z")},
	{i: 81263, n: "Mercenary Backpack", p: {gem: 400}, Finish: new Date("2017-11-03T16:00:00Z")},
	{i: 78733, n: "Sloth Backpack", p: {gem: 500}, Finish: new Date("2017-11-03T16:00:00Z")},
	{i: 74219, n: "Dread Quiver Backpack", p: {gem: 350}, Finish: new Date("2017-11-05T16:00:00Z")},
	{i: 69737, n: "Daydreamer's Wings Backpack", p: {gem: 500}, Finish: new Date("2017-11-05T16:00:00Z")}
	]
};