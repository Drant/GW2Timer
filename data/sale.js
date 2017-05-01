/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-04-18T16:00:00Z"),
	Finish: new Date("2017-05-02T16:00:00Z"),
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
	{i: 69863, n: "Monk's Outfit", p: {gem: 420}, discount: 700},
	{i: 78667, n: "Chaos Gloves Skin", p: {gem: 400}, discount: 500},
	{i: 42584, n: "Mini Jaguar Cub", p: {gem: 400}, Finish: new Date("2017-05-08T16:00:00Z")},
	{i: 42577, n: "Mini Moa Chick", p: {gem: 400}, Finish: new Date("2017-05-08T16:00:00Z")},
	{i: 69658, n: "Mini Blue Drake Hatchling", p: {gem: 400}, Finish: new Date("2017-05-07T16:00:00Z")},
	{i: 42579, n: "Mini Hippo Calf", p: {gem: 400}, Finish: new Date("2017-05-07T16:00:00Z")},
	{i: 42578, n: "Mini Piglet", p: {gem: 400}, Finish: new Date("2017-05-07T16:00:00Z")},
	{i: 42592, n: "Mini Black Bear Cub", p: {gem: 400}, Finish: new Date("2017-05-06T16:00:00Z")},
	{i: 42582, n: "Mini Polar Bear Cub", p: {gem: 400}, Finish: new Date("2017-05-06T16:00:00Z")},
	{i: 69667, n: "Mini Bear Cub", p: {gem: 400}, Finish: new Date("2017-05-06T16:00:00Z")},
	{i: 42581, n: "Mini Arctodus Cub", p: {gem: 400}, Finish: new Date("2017-05-06T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 44602, n: "Copper-Fed Salvage-o-Matic", p: {gem: 800}},
	{i: 67027, n: "Silver-Fed Salvage-o-Matic", p: {gem: 500}},
	{i: 80981, n: "Hourglass Staff", p: {gem: 600}},
	{i: 79853, n: "Eir's Legacy Longbow", p: {gem: 600}, Finish: new Date("2017-05-02T16:00:00Z")},
	{i: 37190, n: "Consortium Chest", p: {gem: 250}, discount: [[1, 250], [5, 1100]], Finish: new Date("2017-05-02T16:00:00Z")},
	{i: 80974, n: "Primordus Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]]},
	{i: 67028, n: "Chaos weapon skins#Gallery", p: {blticket: 5}}
	]
};