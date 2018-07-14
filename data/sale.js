/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-06-26T16:00:00Z"),
	Finish: new Date("2018-07-17T16:00:00Z"),
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
	{i: 87564, n: "Venom Warblade", p: {gem: 600}},
	{i: 88111, n: "Tremor Armadillo Roller Beetle Skin", p: {gem: 2000}},
	{i: 87701, n: "Volatile Magic Harvesting Tool", p: {gem: 1000}},
	{i: 87954, n: "Volatile Magic Logging Tool", p: {gem: 1000}},
	{i: 87841, n: "Volatile Magic Mining Tool", p: {gem: 1000}},
	{i: 86898, n: "Zhaitan Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-13T16:00:00Z")},
	{i: 68653, n: "Crimson Lion Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-14T16:00:00Z")},
	{i: 78734, n: "Blue Shift Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-14T16:00:00Z")},
	{i: 80974, n: "Primordus Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-14T16:00:00Z")},
	{i: 68786, n: "Shadow Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-15T16:00:00Z")},
	{i: 79354, n: "Bloodstone Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-15T16:00:00Z")},
	{i: 67291, n: "Taimi's Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-15T16:00:00Z")},
	{i: 77470, n: "Winter Chimes Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-16T16:00:00Z")},
	{i: 86163, n: "Elonian Landscape Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-16T16:00:00Z")},
	{i: 81545, n: "Jormag Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-17T16:00:00Z")},
	{i: 80069, n: "Solar and Lunar Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-17T16:00:00Z")},
	{i: 79695, n: "Vibrant Dye Kit", p: {gem: 93}, discount: [[1, 93, 125], [5, 375, 500], [25, 1875, 2500]], Finish: new Date("2018-07-17T16:00:00Z")},
	{i: 87603, n: "Awakened Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: 87478, n: "Suntouched Scythe Staff Skin", p: {gem: 600}, Finish: new Date("2018-07-16T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88077, n: "Desert King#Gallery", p: {blticket: 1}},
	{i: 39131, n: "Plush Quaggan Backpack Cover", p: {gem: 300}, Finish: new Date("2018-07-07T16:00:00Z")},
	{i: 67405, n: "Replica Job-o-Tron Backpack", p: {gem: 500}, Finish: new Date("2018-07-07T16:00:00Z")},
	{i: 43159, n: "Phoenix Light Armor Skin", p: {gem: 800}, Finish: new Date("2018-07-13T16:00:00Z")},
	{i: 43158, n: "Magitech Medium Armor Skin", p: {gem: 800}, Finish: new Date("2018-07-13T16:00:00Z")},
	{i: 43157, n: "Braham's Heavy Armor Skin", p: {gem: 800}, Finish: new Date("2018-07-13T16:00:00Z")},
	{i: 69737, n: "Daydreamer's Wings Backpack", p: {gem: 500}, Finish: new Date("2018-07-13T16:00:00Z")},
	{i: 78733, n: "Sloth Backpack", p: {gem: 500}, Finish: new Date("2018-07-13T16:00:00Z")},
	{i: 79702, n: "Plush Aurene Backpack Cover", p: {gem: 400}, Finish: new Date("2018-07-13T16:00:00Z")},
	{i: 74219, n: "Dread Quiver Backpack", p: {gem: 350}, Finish: new Date("2018-07-14T16:00:00Z")},
	{i: 81263, n: "Mercenary Backpack", p: {gem: 400}, Finish: new Date("2018-07-14T16:00:00Z")},
	{i: 80725, n: "Raven's Spirit Glider", p: {gem: 500}, Finish: new Date("2018-07-17T16:00:00Z")},
	{i: 87311, n: "Winged Headpiece", p: {gem: 400}, Finish: new Date("2018-07-17T16:00:00Z")},
	{i: 84998, n: "Mini Maraca Choya Pinata", p: {gem: 400}},
	{i: 67835, n: "Pact Airship Balloon", p: {gem: 500}},
	{i: 84782, n: "Mini Squire Aurene", p: {gem: 400}},
	{i: 70191, n: "Mini Wyvern", p: {gem: 350}},
	{i: 42591, n: "Mini White Kitten", p: {gem: 400}},
	{i: 42960, n: "Mini Scruffy", p: {gem: 500}},
	{i: 81242, n: "Mini Outlaw Puppy", p: {gem: 400}},
	{i: 79361, n: "Mini Jungle Lord Faren", p: {gem: 350}},
	{i: 80371, n: "Mini Demmi Beetlestone", p: {gem: 400}}
	]
};
