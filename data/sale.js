/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-11-20T16:00:00Z"),
	Finish: new Date("2018-12-11T16:00:00Z"),
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
	{i: 20005, n: "Heroic Booster", p: {gem: 0}, discount: [[1, 150], [5, 637], [20, 2100]], Finish: new Date("2018-11-24T16:00:00Z")},
	{i: 86694, n: "Black Lion Statuette", p: {gem: 0}, Finish: new Date("2018-11-25T16:00:00Z")},
	{i: 64736, n: "Transmutation Charge", p: {gem: 0}, discount: [[5, 150], [10, 270], [25, 600]], Finish: new Date("2018-11-26T16:00:00Z")},
	{i: 19996, n: "Revive Orb", p: {gem: 0}, discount: [[1, 250], [5, 900]], Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 78474, n: "Black Lion Miniature Claim Ticket", p: {gem: 0}, discount: 100, Finish: new Date("2018-11-28T16:00:00Z")},
	{i: "https://i.imgur.com/fb9KMVN.png", n: "The Evon Gnashblade Decorative Package", p: {gem: 3000}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 87612, n: "Pet Dog Whistle: Basenji", p: {gem: 500}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 88190, n: "Lightning Aspect Eye", p: {gem: 166}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 88161, n: "Sun Aspect Eye", p: {gem: 166}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 88170, n: "Wind Aspect Eye", p: {gem: 166}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 89104, n: "Raven Helm", p: {gem: 400}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 89207, n: "Raven Mantle", p: {gem: 400}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 67027, n: "Silver-Fed Salvage-o-Matic", p: {gem: 500}, Finish: new Date("2018-11-23T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 89082, n: "Mad Realm weapon skins#Gallery", p: {blticket: 1}},
	{i: 81664, n: "Mistlock Sanctuary Passkey", p: {gem: 1000}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 89079, n: "Haunted Armor Outfit", p: {gem: 700}, Finish: new Date("2018-11-27T16:00:00Z")},
	{i: 68013, n: "Salvager's Supplies", p: {gem: 1100}, Finish: new Date("2018-11-27T16:00:00Z")}
	]
};
