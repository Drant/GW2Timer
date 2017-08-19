/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-08-08T16:00:00Z"),
	Finish: new Date("2017-08-29T16:00:00Z"),
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
	{i: 83073, n: "Season 1 Memory Box - Flame and Festivals", p: {gem: 0}, discount: [[1, 200], [10, 1500]]},{i: 77649, n: "Mini Arrowhead", p: {gem: 200}, discount: 400, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 67841, n: "Mini Avatar of the Tree", p: {gem: 175}, discount: 350, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 79693, n: "Mini Bloodstone Rock", p: {gem: 175}, discount: 350, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 67840, n: "Mini Drooburt's Ghost", p: {gem: 175}, discount: 350, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 69656, n: "Mini Fox Kit", p: {gem: 200}, discount: 400, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 45044, n: "Mini Frostbite", p: {gem: 200}, discount: 400, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 79048, n: "Mini Garm", p: {gem: 175}, discount: 350, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 42583, n: "Mini Orange Kitten", p: {gem: 200}, discount: 400, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 67839, n: "Mini Pact Airship", p: {gem: 175}, discount: 350, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 69790, n: "Mini Rock", p: {gem: 175}, discount: 350, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 42960, n: "Mini Scruffy", p: {gem: 250}, discount: 500, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 69672, n: "Mini Snow Cougar Cub", p: {gem: 200}, discount: 400, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 42591, n: "Mini White Kitten", p: {gem: 200}, discount: 400, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 70191, n: "Mini Wyvern", p: {gem: 175}, discount: 350, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 69621, n: "Miniature Moose", p: {gem: 175}, discount: 350, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 42932, n: "Storage Expander", p: {gem: 640}, discount: 800, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: "character_slot_expansion", n: "Character Slot Expansion", p: {gem: 560}, discount: 800, Finish: new Date("2017-08-21T17:00:00Z")},
	{i: 77808, n: "Crystal Savant Outfit", p: {gem: 490}, discount: 700, Finish: new Date("2017-08-22T17:00:00Z")},
	{i: 69623, n: "Exemplar Attire Outfit", p: {gem: 490}, discount: 700, Finish: new Date("2017-08-22T17:00:00Z")},
	{i: 77270, n: "Golden Feather Wings Backpack", p: {gem: 560}, discount: 700, Finish: new Date("2017-08-22T17:00:00Z")},
	{i: 77269, n: "Golden Feather Wings Glider", p: {gem: 560}, discount: 700, Finish: new Date("2017-08-22T17:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 81816, n: "Abaddon weapon skins#Gallery", p: {blticket: 2}},
	{i: 80725, n: "Raven's Spirit Glider", p: {gem: 500}, Finish: new Date("2017-08-22T16:00:00Z")},
	{i: 80919, n: "Super Cloud Glider", p: {gem: 500}, Finish: new Date("2017-08-22T16:00:00Z")},
	{i: 81776, n: "Abaddon's Mask", p: {gem: 500}},
	{i: "http://i.imgur.com/g1s48MQ.png", n: "Path of Fire Preparation Pack", p: {gem: 3500}},
	{i: 82152, n: "Black Lion Instant Level 80 Ticket", p: {gem: 2000}},
	{i: 84064, n: "Fiery Blade Axe", p: {gem: 500}, Finish: new Date("2017-08-22T17:00:00Z")},
	{i: 84112, n: "Icy Blade Axe", p: {gem: 500}, Finish: new Date("2017-08-22T17:00:00Z")},
	{i: 80987, n: "Unbound Magic Harvesting Blast", p: {gem: 900}, Finish: new Date("2017-08-22T17:00:00Z")},
	{i: 80979, n: "Unbound Magic Logging Pulse", p: {gem: 900}, Finish: new Date("2017-08-22T17:00:00Z")},
	{i: 80977, n: "Unbound Magic Mining Beam", p: {gem: 900}, Finish: new Date("2017-08-22T17:00:00Z")}
	]
};