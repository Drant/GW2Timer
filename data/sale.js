/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promotions and sale items.
 */
GW2T_SALE_DATA = {
	isPreshown: false, // If true, will show the items on sale without needing user click toggle
	note: "", // Important note about the sale, optional
	Start: new Date("2017-04-18T16:00:00Z"),
	Finish: new Date("2017-05-02T16:00:00Z"),
	Padding: [
		{
			name: "Gem", // Gem exchange rate sample
			id: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png",
			url: "http://gw2timer.com/?page=Gem",
			price: 100,
			discount: null,
			side: 0
		},
		{
			name: "Coin", // Gold exchange rate sample
			id: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png",
			url: "http://gw2timer.com/?page=Trading",
			price: 1000000,
			discount: null,
			side: 1
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
	 *	side: 0 // Display on left (0) or right (1) column
	*/
	Items: [
	{
		Finish: new Date("2017-04-25T16:00:00Z"),
		name: "Wizard's Hat",
		id: "64757",
		price: 200,
		discount: null,
		side: 0
	},
	{
		Finish: new Date("2017-04-24T16:00:00Z"),
		name: "Belinda's Greatsword Skin",
		id: "8466",
		price: 600,
		discount: null,
		side: 0
	},
	{
		Finish: new Date("2017-04-25T16:00:00Z"),
		name: "Crystalline Dragon Wings Glider",
		id: "79704",
		price: 700,
		discount: null,
		side: 0
	},
	{
		Finish: new Date("2017-04-25T16:00:00Z"),
		name: "Crystalline Dragon Wings Backpack",
		id: "79707",
		price: 700,
		discount: null,
		side: 0
	},
	{
		name: "Chaos weapon skins#Gallery",
		id: "67028",
		price: 5,
		discount: null,
		side: 1
	},
	{
		name: "Primordus Dye Kit",
		id: "80974",
		price: 125,
		discount: [[1, 125], [5, 500], [25, 2500]],
		side: 1
	},
	{
		Finish: new Date("2017-04-24T16:00:00Z"),
		name: "Solar and Lunar Dye Kit",
		id: "80069",
		price: 125,
		discount: [[1, 125], [5, 500], [25, 2500]],
		side: 1
	},
	{
		Finish: new Date("2017-04-25T16:00:00Z"),
		name: "Shadow Dye Kit",
		id: "68786",
		price: 125,
		discount: [[1, 125], [5, 500], [25, 2500]],
		side: 1
	}
	]
};