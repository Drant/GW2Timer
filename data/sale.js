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
	{i: 88404, n: "Novelty Selection Box", p: {gem: 0}, discount: 250, Finish: new Date("2018-09-03T16:00:00Z")},
	{i: 79698, n: "Customer Appreciation Package", p: {gem: 0}, discount: 125, Finish: new Date("2018-09-03T16:00:00Z")},
	{i: 44602, n: "Copper-Fed Salvage-o-Matic", p: {gem: 520}, discount: 800, Finish: new Date("2018-09-03T16:00:00Z")},
	{i: 67027, n: "Silver-Fed Salvage-o-Matic", p: {gem: 325}, discount: 500, Finish: new Date("2018-09-03T16:00:00Z")},
	{i: 67881, n: "Aviator's Memory Box", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-02T16:00:00Z")},
	{i: 36172, n: "Bobblehead Laboratory", p: {gem: 200}, discount: 400, Finish: new Date("2018-09-02T16:00:00Z")},
	{i: 66342, n: "Water Fight Balloon Bucket", p: {gem: 250}, discount: 500, Finish: new Date("2018-09-02T16:00:00Z")},
	{i: 19995, n: "Bank Tab Expansion", p: {gem: 420}, discount: 600, Finish: new Date("2018-09-02T16:00:00Z")},
	{i: 88409, n: "Emblazoned Dragon Throne", p: {gem: 600}},
	{i: 88462, n: "Dragon Emblem Balloon", p: {gem: 250}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88077, n: "Desert King weapon skins#Gallery", p: {blticket: 1}},
	{i: 88339, n: "Black Lion Backpack and Glider Voucher", p: {gem: 630}, discount: [[1, 630], [5, 2450], [10, 3500]], Finish: new Date("2018-09-04T16:00:00Z")},
	{i: 88308, n: "Black Lion Glider Voucher", p: {gem: 360}, discount: [[1, 360], [5, 1400], [10, 2000]], Finish: new Date("2018-09-04T16:00:00Z")},
	{i: 88305, n: "Black Lion Outfit Ticket", p: {gem: 630}, discount: [[1, 630], [5, 2450], [10, 3500]], Finish: new Date("2018-09-04T16:00:00Z")},
	{i: 88260, n: "Black Lion Weapons Voucher", p: {gem: 540}, discount: [[1, 540], [5, 2100], [10, 3000]], Finish: new Date("2018-09-04T16:00:00Z")},
	{i: 85580, n: "Mount Adoption License", p: {gem: 400}, discount: [[1, 400], [10, 3400]], Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 64745, n: "Ringmaster's Hat", p: {gem: 200}, Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 68574, n: "Shadow of the Dragon Helmet Skin", p: {gem: 300}, Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 68575, n: "Shadow of the Dragon Shoulder Skin", p: {gem: 300}, Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 68576, n: "Shadow of the Dragon Gloves Skin", p: {gem: 300}, Finish: new Date("2018-09-07T16:00:00Z")},
	{i: 64755, n: "Fuzzy Bear Hat", p: {gem: 200}, Finish: new Date("2018-09-08T16:00:00Z")},
	{i: 64751, n: "Fuzzy Quaggan Hat with Bow", p: {gem: 200}, Finish: new Date("2018-09-08T16:00:00Z")},
	{i: 44607, n: "Mask of the Jubilee", p: {gem: 400}, Finish: new Date("2018-09-08T16:00:00Z")},
	{i: 44608, n: "Mask of the Queen", p: {gem: 400}, Finish: new Date("2018-09-08T16:00:00Z")}
	]
};
