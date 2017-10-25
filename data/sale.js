/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-10-17T16:00:00Z"),
	Finish: new Date("2017-11-01T16:00:00Z"),
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
	{i: 48714, n: "Hallows Fortune Fireworks", p: {gem: 0}, discount: 200},
	{i: 85437, n: "Mini Spooky Mounts Pack", p: {gem: 1600}},
	{i: 67406, n: "Candy Corn Gobbler Pack", p: {gem: 300}},
	{i: 65197, n: "Devil Horns", p: {gem: 200}},
	{i: 65201, n: "Witch's Outfit", p: {gem: 700}, Finish: new Date("2017-10-31T16:00:00Z")},
	{i: 65196, n: "Mad King's Outfit", p: {gem: 700}, Finish: new Date("2017-10-27T16:00:00Z")},
	{i: 65194, n: "Executioner's Outfit", p: {gem: 700}, Finish: new Date("2017-10-27T16:00:00Z")},
	{i: 44068, n: "Permanent Mad King Finisher", p: {gem: 500}},
	{i: 71323, n: "Ghoul Backpack", p: {gem: 240}, discount: 300},
	{i: 73815, n: "Mini Ghoul Legs", p: {gem: 240}, discount: 300},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 84963, n: "War God's weapon skins#Gallery", p: {blticket: 1}},
	{i: "https://i.imgur.com/c61OMk9.png", n: "Enemies Dye Pack", p: {gem: 500}},
	{i: 79695, n: "Vibrant Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-10-31T16:00:00Z")},
	{i: 47900, n: "Metallurgic Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: 81412, n: "Foefire Mantle", p: {gem: 500}, Finish: new Date("2017-10-31T16:00:00Z")},
	{i: 81293, n: "Foefire Wraps", p: {gem: 500}, Finish: new Date("2017-10-31T16:00:00Z")},
	{i: 85282, n: "Foefire Greaves", p: {gem: 500}, Finish: new Date("2017-10-31T16:00:00Z")},
	{i: 84873, n: "Mini Zaishen Puppy", p: {gem: 400}}
	]
};