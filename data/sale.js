/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-06-12T16:00:00Z"),
	Finish: new Date("2018-06-26T16:00:00Z"),
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
	{i: 44602, n: "Copper-Fed Salvage-o-Matic", p: {gem: 560}, discount: 800, Finish: new Date("2018-06-15T16:00:00Z")},
	{i: 67027, n: "Silver-Fed Salvage-o-Matic", p: {gem: 350}, discount: 500, Finish: new Date("2018-06-15T16:00:00Z")},
	{i: "https://i.imgur.com/AKzkrkI.png", n: "Kasmeer's Package", p: {gem: 1360}, discount: 1600, Finish: new Date("2018-06-15T16:00:00Z")},
	{i: "https://i.imgur.com/7KQdXAx.png", n: "Marjory's Package", p: {gem: 1360}, discount: 1600, Finish: new Date("2018-06-15T16:00:00Z")},
	{i: "https://i.imgur.com/u74xsUH.png", n: "Rox's Package", p: {gem: 1360}, discount: 1600, Finish: new Date("2018-06-15T16:00:00Z")},
	{i: "https://i.imgur.com/vifSGUV.png", n: "Taimi's Package", p: {gem: 1700}, discount: 2000, Finish: new Date("2018-06-15T16:00:00Z")},
	{i: "https://i.imgur.com/ODWMADq.png", n: "Braham's Bitterfrost Frontier Pack", p: {gem: 1700}, discount: 2000, Finish: new Date("2018-06-15T16:00:00Z")},
	{i: 87564, n: "Venom Warblade", p: {gem: 600}},
	{i: 80854, n: "Bloodstone Ascender", p: {gem: 250}},
	{i: 77821, n: "Classical Glider", p: {gem: 400}},
	{i: 79010, n: "Glide-r-Tron", p: {gem: 500}},
	{i: 80985, n: "Vine-Touched Destroyer Glider", p: {gem: 700}},
	{i: 87549, n: "Sunspear Glider", p: {gem: 400}},
	{i: 85437, n: "Mini Spooky Mounts Pack", p: {gem: 1600}},
	{i: 87548, n: "Elonian Elementalist Outfit", p: {gem: 700}},
	{i: 83865, n: "Champion of Tyria Outfit", p: {gem: 700}},
	{i: 70071, n: "Harbinger of Mordremoth Outfit", p: {gem: 700}},
	{i: 69863, n: "Monk's Outfit", p: {gem: 700}},
	{i: 87530, n: "Choya Logging Tool", p: {gem: 1000}},
	{i: 84014, n: "Swaggering Hat", p: {gem: 400}},
	{i: 78667, n: "Chaos Gloves Skin", p: {gem: 500}},
	{i: 63891, n: "Glowing Crimson Mask", p: {gem: 500}},
	{i: 80082, n: "Braham's Wolfblood Pauldrons", p: {gem: 300}},
	{i: 80795, n: "Shattered Bloodstone Glider", p: {gem: 400}},
	{i: 64755, n: "Fuzzy Bear Hat", p: {gem: 200}},
	{i: 64751, n: "Fuzzy Quaggan Hat with Bow", p: {gem: 200}},
	{i: 44607, n: "Mask of the Jubilee", p: {gem: 400}},
	{i: 44608, n: "Mask of the Queen", p: {gem: 400}},
	{i: 78727, n: "Macaw Wings Glider", p: {gem: 700}},
	{i: 78732, n: "Macaw Wings Backpack", p: {gem: 700}},
	{i: 79595, n: "Mursaat Wings Glider", p: {gem: 700}},
	{i: 79523, n: "Mursaat Wings Backpack", p: {gem: 700}},
	{i: 79631, n: "Spectral Glider", p: {gem: 500}},
	{i: 68574, n: "Shadow of the Dragon Helmet Skin", p: {gem: 300}},
	{i: 68575, n: "Shadow of the Dragon Shoulder Skin", p: {gem: 300}},
	{i: 68576, n: "Shadow of the Dragon Gloves Skin", p: {gem: 300}},
	{i: 64745, n: "Ringmaster's Hat", p: {gem: 200}},
	{i: 64743, n: "Sport Sunglasses", p: {gem: 150}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 87389, n: "Inquest Mark II#Gallery", p: {blticket: 1}},
	{i: 70234, n: "Mini Angry Chest", p: {gem: 400}, Finish: new Date("2018-06-20T16:00:00Z")},
	{i: 42581, n: "Mini Arctodus Cub", p: {gem: 400}, Finish: new Date("2018-06-20T16:00:00Z")},
	{i: 69656, n: "Mini Fox Kit", p: {gem: 400}, Finish: new Date("2018-06-20T16:00:00Z")},
	{i: 42593, n: "Mini Lion Cub", p: {gem: 400}, Finish: new Date("2018-06-20T16:00:00Z")},
	{i: 69672, n: "Mini Snow Cougar Cub", p: {gem: 400}, Finish: new Date("2018-06-20T16:00:00Z")},
	{i: 67841, n: "Mini Avatar of the Tree", p: {gem: 350}, Finish: new Date("2018-06-19T16:00:00Z")},
	{i: 69667, n: "Mini Bear Cub", p: {gem: 400}, Finish: new Date("2018-06-19T16:00:00Z")},
	{i: 42577, n: "Mini Moa Chick", p: {gem: 400}, Finish: new Date("2018-06-19T16:00:00Z")},
	{i: 42578, n: "Mini Piglet", p: {gem: 400}, Finish: new Date("2018-06-19T16:00:00Z")},
	{i: 42582, n: "Mini Polar Bear Cub", p: {gem: 400}, Finish: new Date("2018-06-19T16:00:00Z")}
	]
};
