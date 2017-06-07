/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-06-06T16:00:00Z"),
	Finish: new Date("2017-06-20T16:00:00Z"),
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
	{i: 64740, n: "Aviator Sunglasses", p: {gem: 150}},
	{i: 63941, n: "Permanent Minstrel Finisher", p: {gem: 800}},
	{i: 49165, n: "Permanent Mystical Dragon Finisher", p: {gem: 800}},
	{i: 44888, n: "Mist Herald Back Item Skin", p: {gem: 500}},
	{i: 67356, n: "Magic Carpet", p: {gem: 250}},
	{i: 81291, n: "Magic Carpet Glider", p: {gem: 400}},
	{i: 79354, n: "Bloodstone Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-06-09T16:00:00Z")},
	{i: 43935, n: "Deathly Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-06-10T16:00:00Z")},
	{i: 63909, n: "Incarnate Light Armor Skin", p: {gem: 800}, Finish: new Date("2017-06-09T16:00:00Z")},
	{i: 63899, n: "Strider's Medium Armor Skin", p: {gem: 800}, Finish: new Date("2017-06-09T16:00:00Z")},
	{i: 63929, n: "Rampart Heavy Armor Skin", p: {gem: 800}, Finish: new Date("2017-06-09T16:00:00Z")},
	{i: 66279, n: "Ancestral Outfit", p: {gem: 700}, Finish: new Date("2017-06-13T16:00:00Z")},
	{i: 68577, n: "Arcane Outfit", p: {gem: 700}, Finish: new Date("2017-06-11T16:00:00Z")},
	{i: 64754, n: "Pirate Captain's Outfit", p: {gem: 700}, Finish: new Date("2017-06-14T16:00:00Z")},
	{i: 77676, n: "Nature's Oath Outfit", p: {gem: 700}, Finish: new Date("2017-06-14T16:00:00Z")},
	{i: 68654, n: "Imperial Outfit", p: {gem: 700}, Finish: new Date("2017-06-11T16:00:00Z")},
	{i: 78010, n: "Ironclad Outfit", p: {gem: 700}, Finish: new Date("2017-06-08T16:00:00Z")},
	{i: 69753, n: "Mad Scientist Outfit", p: {gem: 700}, Finish: new Date("2017-06-10T16:00:00Z")},
	{i: 67398, n: "Noble Count Outfit", p: {gem: 700}, Finish: new Date("2017-06-10T16:00:00Z")},
	{i: 80906, n: "Spring Promenade Outfit", p: {gem: 700}, Finish: new Date("2017-06-13T16:00:00Z")},
	{i: 67887, n: "Shoulder Scarf", p: {gem: 400}, Finish: new Date("2017-06-12T16:00:00Z")},
	{i: 64744, n: "Fuzzy Panda Hat", p: {gem: 200}, Finish: new Date("2017-06-12T16:00:00Z")},
	{i: 64739, n: "Fuzzy Quaggan Hat", p: {gem: 200}, Finish: new Date("2017-06-12T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 79140, n: "Noble's Folly Pass", p: {gem: 1000}, Finish: new Date("2017-06-09T16:00:00Z")},
	{i: 79500, n: "Lava Lounge Pass", p: {gem: 1000}, Finish: new Date("2017-06-09T16:00:00Z")},
	{i: 69478, n: "Mad Scientist's Harvesting Tool", p: {gem: 1000}, Finish: new Date("2017-06-13T16:00:00Z")},
	{i: 68799, n: "Mad Scientist's Logging Tool", p: {gem: 1000}, Finish: new Date("2017-06-13T16:00:00Z")},
	{i: 68905, n: "Mad Scientist's Mining Tool", p: {gem: 1000}, Finish: new Date("2017-06-13T16:00:00Z")},
	{i: 80987, n: "Unbound Magic Harvesting Blast", p: {gem: 900}, Finish: new Date("2017-06-07T16:00:00Z")},
	{i: 80979, n: "Unbound Magic Logging Pulse", p: {gem: 900}, Finish: new Date("2017-06-07T16:00:00Z")},
	{i: 80977, n: "Unbound Magic Mining Beam", p: {gem: 900}, Finish: new Date("2017-06-07T16:00:00Z")},
	{i: "http://i.imgur.com/o9lTCUW.png", n: "Outlaw Appearance Pack", p: {gem: 2000}},
	{i: 81223, n: "Outlaw Outfit", p: {gem: 700}},
	{i: 81242, n: "Mini Outlaw Puppy", p: {gem: 400}},
	{i: 79706, n: "Swashbuckler's Package", p: {gem: 900}, Finish: new Date("2017-06-09T16:00:00Z")},
	{i: 81240, n: "Menzies's Agony", p: {gem: 600}, Finish: new Date("2017-06-13T16:00:00Z")}
	]
};