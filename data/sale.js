/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-05-15T16:00:00Z"),
	Finish: new Date("2018-05-29T16:00:00Z"),
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
	{i: "https://i.imgur.com/fb9KMVN.png", n: "The Evon Gnashblade Decorative Package", p: {gem: 3000}},
	{i: 87539, n: "Shrine Guardian Jackal Skin", p: {gem: 2000}, Finish: new Date("2018-05-16T16:00:00Z")},
	{i: 87530, n: "Choya Logging Tool", p: {gem: 1000}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 87389, n: "Inquest Mark II#Gallery", p: {blticket: 1}},
	{i: 42592, n: "Mini Black Bear Cub", p: {gem: 400}},
	{i: 42579, n: "Mini Hippo Calf", p: {gem: 400}},
	{i: 42584, n: "Mini Jaguar Cub", p: {gem: 400}},
	{i: 70234, n: "Mini Angry Chest", p: {gem: 400}},
	{i: 42581, n: "Mini Arctodus Cub", p: {gem: 400}},
	{i: 42592, n: "Mini Black Bear Cub", p: {gem: 400}},
	{i: 69656, n: "Mini Fox Kit", p: {gem: 400}},
	{i: 69672, n: "Mini Snow Cougar Cub", p: {gem: 400}},
	{i: 67841, n: "Mini Avatar of the Tree", p: {gem: 350}},
	{i: 42593, n: "Mini Lion Cub", p: {gem: 400}},
	{i: 42577, n: "Mini Moa Chick", p: {gem: 400}},
	{i: 42578, n: "Mini Piglet", p: {gem: 400}},
	{i: 42582, n: "Mini Polar Bear Cub", p: {gem: 400}}
	]
};
