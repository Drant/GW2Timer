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
	{i: 80958, n: "Super Adventure Holo-Copter", p: {gem: 525}, discount: 700, Finish: new Date("2018-04-20T16:00:00Z")},
	{i: 80887, n: "Super Adventure Holo-Copter Backpack", p: {gem: 525}, discount: 700, Finish: new Date("2018-04-20T16:00:00Z")},
	{i: 86899, n: "Grand Lion Griffon Skin", p: {gem: 2000}},
	{i: 86766, n: "Summit Chevon Springer Skin", p: {gem: 2000}},
	{i: 85538, n: "Reforged Warhound", p: {gem: 2000}},
	{i: 86690, n: "Umbral Demon Skimmer Skin", p: {gem: 2000}},
	{i: 85491, n: "Resplendent Avialan", p: {gem: 2000}},
	{i: 79360, n: "Amethyst Aegis", p: {gem: 600}, Finish: new Date("2018-04-21T16:00:00Z")},
	{i: 69752, n: "Chain-Whip Sword Skin", p: {gem: 600}, Finish: new Date("2018-04-20T16:00:00Z")},
	{i: 87429, n: "Beastslayer Glider", p: {gem: 400}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 87389, n: "Inquest Mark II#Gallery", p: {blticket: 1}},
	{i: 87425, n: "Shifting Sand Mining Pick", p: {gem: 1000}},
	{i: 48930, n: "Consortium Harvesting Sickle", p: {gem: 1000}, Finish: new Date("2018-04-24T16:00:00Z")},
	{i: 80966, n: "Super Adventure Logging Bear", p: {gem: 1000}, Finish: new Date("2018-04-24T16:00:00Z")},
	{i: 78009, n: "Super Adventure Glider", p: {gem: 400}},
	{i: 87323, n: "Miniature Super Trio—Series 4", p: {gem: 600}, Finish: new Date("2018-04-24T16:00:00Z")},
	{i: 20000, n: "Box o' Fun", p: {gem: 32}, discount: [[1, 32, 80], [5, 128, 400]]},
	{i: 78088, n: "Super Bee Dog Mail Carrier", p: {gem: 600}, Finish: new Date("2018-04-20T16:00:00Z")},
	{i: 87311, n: "Winged Headpiece", p: {gem: 400}, Finish: new Date("2018-04-24T16:00:00Z")},
	{i: 85628, n: "Elonian Beasts Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-04-24T16:00:00Z")}
	]
};
