/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-11-28T16:00:00Z"),
	Finish: new Date("2017-12-11T16:00:00Z"),
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
	{i: 85491, n: "Resplendent Avialan", p: {gem: 2000}},
	{i: 81664, n: "Mistlock Sanctuary Passkey", p: {gem: 1000}, Finish: new Date("2017-12-05T16:00:00Z")},
	{i: 85517, n: "Mini Kormeerkat", p: {gem: 350}},
	{i: 86163, n: "Elonian Landscape Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 85608, n: "Shifting Sands weapons#Gallery", p: {blticket: 1}},
	{i: "https://i.imgur.com/mIuPrbz.png", n: "Bandit Sniper Appearance Pack", p: {gem: 2000}},
	{i: 78008, n: "Gwen's Attire", p: {gem: 700}, Finish: new Date("2017-11-30T16:00:00Z")},
	{i: 78010, n: "Ironclad Outfit", p: {gem: 700}, Finish: new Date("2017-11-30T16:00:00Z")},
	{i: 69753, n: "Mad Scientist Outfit", p: {gem: 700}, Finish: new Date("2017-12-01T16:00:00Z")},
	{i: 77676, n: "Nature's Oath Outfit", p: {gem: 700}, Finish: new Date("2017-12-01T16:00:00Z")},
	{i: 81223, n: "Outlaw Outfit", p: {gem: 700}, Finish: new Date("2017-12-01T16:00:00Z")},
	{i: 64754, n: "Pirate Captain's Outfit", p: {gem: 700}, Finish: new Date("2017-12-01T16:00:00Z")},
	{i: 65195, n: "Bloody Prince's Outfit", p: {gem: 700}, Finish: new Date("2017-12-02T16:00:00Z")},
	{i: 77483, n: "Slayer's Outfit", p: {gem: 700}, Finish: new Date("2017-12-02T16:00:00Z")},
	{i: 70253, n: "Wedding Attire Outfit", p: {gem: 1000}, Finish: new Date("2017-12-02T16:00:00Z")}
	]
};