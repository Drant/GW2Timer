/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-08-21T16:00:00Z"),
	Finish: new Date("2018-09-19T16:00:00Z"),
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
	{i: 88404, n: "Novelty Selection Box", p: {gem: 0}, discount: 250, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 79698, n: "Customer Appreciation Package", p: {gem: 0}, discount: 125, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 77649, n: "Mini Arrowhead", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 80371, n: "Mini Demmi Beetlestone", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 79048, n: "Mini Garm", p: {gem: 175}, discount: 350, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 79361, n: "Mini Jungle Lord Faren", p: {gem: 175}, discount: 350, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 84998, n: "Mini Maraca Choya Pinata", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 69621, n: "Miniature Moose", p: {gem: 175}, discount: 350, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 42583, n: "Mini Orange Kitten", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 81242, n: "Mini Outlaw Puppy", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 67839, n: "Mini Pact Airship", p: {gem: 175}, discount: 350, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 69790, n: "Mini Rock", p: {gem: 175}, discount: 350, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 42960, n: "Mini Scruffy", p: {gem: 250}, discount: 500, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 84782, n: "Mini Squire Aurene", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 42591, n: "Mini White Kitten", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 70191, n: "Mini Wyvern", p: {gem: 175}, discount: 350, Finish: new Date("2018-09-11T16:00:00Z")},
	{i: 88431, n: "Shattered Cathedral Glider", p: {gem: 700}},
	{i: 88226, n: "Dragon Horns", p: {gem: 166}},
	{i: 88244, n: "Dragon's Eye Circlet", p: {gem: 166}},
	{i: 88333, n: "Enchanted Dragon Crown", p: {gem: 166}},
	{i: 88409, n: "Emblazoned Dragon Throne", p: {gem: 600}},
	{i: 88462, n: "Dragon Emblem Balloon", p: {gem: 250}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88077, n: "Desert King weapon skins#Gallery", p: {blticket: 1}},
	{i: 85580, n: "Mount Adoption License", p: {gem: 400}, discount: [[1, 400], [10, 3400]], Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 43018, n: "Zodiac Light Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-12T16:00:00Z")},
	{i: 43017, n: "Zodiac Medium Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-12T16:00:00Z")},
	{i: 43016, n: "Zodiac Heavy Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-12T16:00:00Z")},
	{i: 64745, n: "Ringmaster's Hat", p: {gem: 200}, Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 68574, n: "Shadow of the Dragon Helmet Skin", p: {gem: 300}, Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 68575, n: "Shadow of the Dragon Shoulder Skin", p: {gem: 300}, Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 68576, n: "Shadow of the Dragon Gloves Skin", p: {gem: 300}, Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 64755, n: "Fuzzy Bear Hat", p: {gem: 200}, Finish: new Date("2018-09-08T16:00:00Z")},
	{i: 64751, n: "Fuzzy Quaggan Hat with Bow", p: {gem: 200}, Finish: new Date("2018-09-08T16:00:00Z")},
	{i: 44607, n: "Mask of the Jubilee", p: {gem: 400}, Finish: new Date("2018-09-08T16:00:00Z")},
	{i: 44608, n: "Mask of the Queen", p: {gem: 400}, Finish: new Date("2018-09-08T16:00:00Z")},
	{i: 80082, n: "Braham's Wolfblood Pauldrons", p: {gem: 300}, Finish: new Date("2018-09-09T16:00:00Z")},
	{i: 63891, n: "Glowing Crimson Mask", p: {gem: 500}, Finish: new Date("2018-09-09T16:00:00Z")},
	{i: 79316, n: "Shattered Bloodstone Circlet", p: {gem: 400},Finish: new Date("2018-09-09T16:00:00Z")},
	{i: 64743, n: "Sport Sunglasses", p: {gem: 150}, Finish: new Date("2018-09-09T16:00:00Z")},
	{i: 78667, n: "Chaos Gloves Skin", p: {gem: 500}, Finish: new Date("2018-09-10T16:00:00Z")},
	{i: 84014, n: "Swaggering Hat", p: {gem: 400}, Finish: new Date("2018-09-10T16:00:00Z")},
	{i: 88258, n: "Mordremoth Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-09-11T16:00:00Z")}
	]
};
