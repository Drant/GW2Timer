/*
 * This file is used by http://gw2timer.com
 * GW2 gem store promotions and sale items.
 */
GW2T_SALE_DATA = {
	isPreshown: false, // If true, will show the items on sale without needing user click toggle
	note: "", // Important note about the sale, optional
	Start: new Date("2017-03-07T16:00:00Z"),
	Finish: new Date("2017-04-04T16:00:00Z"),
	Countdowns: {}, // Will contain expiration date in UNIX seconds, accessed by Items array index number
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
	 *	Finish: new Date("2017-01-01T16:00:00Z"), // Time the item or discount will be removed, optional
	 *	name: "", // Item name to point to English wiki
	 *	id: "", // Item ID to retrieve icon and tooltip details, or a URL to a hosted image
	 *	url: "", // If not provided, will use name as a wiki link
	 *	price: 400, // Current gem price for one item
	 *	discount: [[1, 160, 200], [5, 640, 800], [25, 3200, 4000]] OR 200, // [[quantity, gempricecurrent, gempriceoldOptional], ...] OR gempriceoldOptional
	 *	col: 0 // Display on left (0) or right (1) column
	*/
	Items: [
	{
		Finish: new Date("2017-03-19T16:00:00Z"),
		name: "Shared Inventory Slot",
		id: "67071",
		price: 525,
		discount: [[1, 525, 700], [3, 1417, 1890], [5, 2100, 2800]],
		col: 0
	},
	{
		name: "Shield of the Goddess",
		id: "80861",
		price: 600,
		discount: null,
		col: 0
	},
	{
		name: "Mini Angry Chest",
		id: "70234",
		price: 400,
		discount: null,
		col: 0
	},
	{
		name: "Lion's Arch Rebuild Dye Kit",
		id: "69934",
		price: 125,
		discount: [[1, 125], [5, 500], [25, 2500]],
		col: 0
	},
	{
		name: "Mini Chieftain Utahein and Mini Svanir",
		id: "67281",
		price: 700,
		discount: null,
		col: 1
	},
	{
		name: "Shadow Assassin Outfit",
		id: "66658",
		price: 700,
		discount: null,
		col: 1
	},
	{
		name: "Raven's Spirit Glider",
		id: "80725",
		price: 500,
		discount: null,
		col: 1
	},
	{
		name: "Shattered Bloodstone Glider",
		id: "80795",
		price: 400,
		discount: null,
		col: 1
	},
	{
		name: "Braham's Wolfblood Pauldrons",
		id: "80082",
		price: 300,
		discount: null,
		col: 1
	}
	]
};