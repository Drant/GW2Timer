/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promotions and sale items.
 */
GW2T_SALE_DATA = {
	isPreshown: false, // If true, will show the items on sale without needing user click toggle
	note: "", // Important note about the sale, optional
	Start: new Date("2017-03-07T16:00:00Z"),
	Finish: new Date("2017-04-04T16:00:00Z"),
	Padding: [
		{
			name: "Gem", // Gem exchange rate sample
			id: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png",
			url: "http://gw2timer.com/?page=Gem",
			price: 100,
			discount: null,
			col: 0
		},
		{
			name: "Coin", // Gold exchange rate sample
			id: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png",
			url: "http://gw2timer.com/?page=Trading",
			price: 1000000,
			discount: null,
			col: 1
		}
	],
	Values: {}, // ID-to-Price mapping of the promoted items, to be initialized
	/*
	 * Format:
	 *	Finish: new Date("2017-01-01T16:00:00Z"), // Time the item or discount expires, optional
	 *	name: "", // Item name referencing an English wiki page
	 *	id: "", // Item ID to retrieve icon and tooltip details, or a URL to a hosted image
	 *	url: "", // If not provided, will use name as a wiki link, optional
	 *	price: 400, // Current gem price for one item
	 *	discount: [[1, 160, 200], [5, 640, 800], [25, 3200, 4000]] OR 200, // [[quantity, gempricecurrent, gempriceoldOptional], ...] OR gempriceoldOptional
	 *	col: 0 // Display on left (0) or right (1) column
	*/
	Items: [
	{
		Finish: new Date("2017-03-30T16:00:00Z"),
		name: "Crystal Arbiter Glider",
		id: "72252",
		price: 300,
		discount: 500,
		col: 0
	},
	{
		Finish: new Date("2017-03-30T16:00:00Z"),
		name: "Classical Glider",
		id: "77821",
		price: 240,
		discount: 400,
		col: 0
	},
	{
		Finish: new Date("2017-03-30T16:00:00Z"),
		name: "Exalted Glider",
		id: "76236",
		price: 240,
		discount: 400,
		col: 0
	},
	{
		name: "Spring Promenade Outfit",
		id: "80906",
		price: 700,
		discount: null,
		col: 1
	},
	{
		name: "Mini Krytan Floppy Fish",
		id: "80860",
		price: 350,
		discount: null,
		col: 1
	}
	]
};