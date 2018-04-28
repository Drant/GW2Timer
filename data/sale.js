/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-04-17T16:00:00Z"),
	Finish: new Date("2018-05-01T16:00:00Z"),
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
	{i: 78008, n: "Gwen's Attire", p: {gem: 490}, discount: 700, Finish: new Date("2018-05-04T16:00:00Z")},
	{i: 69863, n: "Monk's Outfit", p: {gem: 490}, discount: 700, Finish: new Date("2018-05-04T16:00:00Z")},
	{i: 70300, n: "Mini Bonebreaker", p: {gem: 350}, Finish: new Date("2018-05-04T16:00:00Z")},
	{i: 85517, n: "Mini Kormeerkat", p: {gem: 350}, Finish: new Date("2018-05-04T16:00:00Z")},
	{i: 84998, n: "Mini Maraca Choya Pinata", p: {gem: 400}, Finish: new Date("2018-05-04T16:00:00Z")},
	{i: 84782, n: "Mini Squire Aurene", p: {gem: 400}, Finish: new Date("2018-05-04T16:00:00Z")},
	{i: 84873, n: "Mini Zaishen Puppy", p: {gem: 400}, Finish: new Date("2018-05-04T16:00:00Z")},
	{i: 81594, n: "Black Lion Hunters Contract", p: {gem: 1200}},
	{i: 86786, n: "Black Lion Garden Plot Deed", p: {gem: 1000}},
	{i: 87478, n: "Suntouched Scythe Staff Skin", p: {gem: 600}},
	{i: 87477, n: "Primeval Dervish Outfit", p: {gem: 700}},
	{i: 86899, n: "Grand Lion Griffon Skin", p: {gem: 2000}, Finish: new Date("2018-05-01T16:00:00Z")},
	{i: 86766, n: "Summit Chevon Springer Skin", p: {gem: 2000}, Finish: new Date("2018-05-01T16:00:00Z")},
	{i: 85538, n: "Reforged Warhound", p: {gem: 2000}, Finish: new Date("2018-05-01T16:00:00Z")},
	{i: 86690, n: "Umbral Demon Skimmer Skin", p: {gem: 2000}, Finish: new Date("2018-05-01T16:00:00Z")},
	{i: 85491, n: "Resplendent Avialan", p: {gem: 2000}, Finish: new Date("2018-05-01T16:00:00Z")},
	{i: 79853, n: "Eir's Legacy Longbow", p: {gem: 600}, Finish: new Date("2018-05-01T16:00:00Z")},
	{i: 69664, n: "Elegant Fan Focus Skin", p: {gem: 600}, Finish: new Date("2018-04-28T16:00:00Z")},
	{i: 87429, n: "Beastslayer Glider", p: {gem: 400}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 87389, n: "Inquest Mark II#Gallery", p: {blticket: 1}},
	{i: 67840, n: "Mini Drooburt's Ghost", p: {gem: 350}, Finish: new Date("2018-05-03T16:00:00Z")},
	{i: 80860, n: "Mini Krytan Floppy Fish", p: {gem: 350}, Finish: new Date("2018-05-03T16:00:00Z")},
	{i: 42951, n: "Mini Mordrem Leyleecher", p: {gem: 500}, Finish: new Date("2018-05-03T16:00:00Z")},
	{i: 81565, n: "Mini Plush Aurene", p: {gem: 400}, Finish: new Date("2018-05-03T16:00:00Z")},
	{i: 77675, n: "Mini Zintl Cavalier", p: {gem: 350}, Finish: new Date("2018-05-03T16:00:00Z")},
	{i: 69690, n: "Mini Beetle", p: {gem: 500}, Finish: new Date("2018-05-02T16:00:00Z")},
	{i: 79693, n: "Mini Bloodstone Rock", p: {gem: 350}, Finish: new Date("2018-05-02T16:00:00Z")},
	{i: 77339, n: "Mini Sabetha", p: {gem: 350}, Finish: new Date("2018-05-02T16:00:00Z")},
	{i: 67838, n: "Mini Sand Giant", p: {gem: 350}, Finish: new Date("2018-05-02T16:00:00Z")},
	{i: 42960, n: "Mini Scruffy", p: {gem: 500}, Finish: new Date("2018-05-02T16:00:00Z")},
	{i: 87425, n: "Shifting Sand Mining Pick", p: {gem: 1000}}
	]
};
