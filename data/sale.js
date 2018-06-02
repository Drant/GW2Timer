/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-05-15T16:00:00Z"),
	Finish: new Date("2018-06-12T16:00:00Z"),
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
	{i: 19980, n: "Black Lion Chest Key", p: {gem: 100}, discount: [[1, 100, 125], [5, 359, 450], [25, 1680, 2100]]},
	{i: 43018, n: "Zodiac Light Armor Skin", p: {gem: 800}},
	{i: 43017, n: "Zodiac Medium Armor Skin", p: {gem: 800}},
	{i: 43016, n: "Zodiac Heavy Armor Skin", p: {gem: 800}},
	{i: 87539, n: "Shrine Guardian Jackal Skin", p: {gem: 2000}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 85437, n: "Mini Spooky Mounts Pack", p: {gem: 1600}},
	{i: 87548, n: "Elonian Elementalist Outfit", p: {gem: 700}},
	{i: 83865, n: "Champion of Tyria Outfit", p: {gem: 700}},
	{i: 70071, n: "Harbinger of Mordremoth Outfit", p: {gem: 700}},
	{i: 69863, n: "Monk's Outfit", p: {gem: 700}},
	{i: 70253, n: "Wedding Attire Outfit", p: {gem: 1000}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 67040, n: "Ceremonial Plated Outfit", p: {gem: 700}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 79531, n: "Mursaat Robes", p: {gem: 700}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 85481, n: "Mini Choya Pumpkin Gang", p: {gem: 400}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 84998, n: "Mini Maraca Choya Pinata", p: {gem: 400}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 85192, n: "Trained Choya Hammer Skin", p: {gem: 600}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 64759, n: "Fuzzy Hylek Hat", p: {gem: 200}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 64739, n: "Fuzzy Quaggan Hat", p: {gem: 200}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 49031, n: "Toxic Gloves Skin", p: {gem: 400}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 49024, n: "Toxic Mantle Skin", p: {gem: 400}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 87530, n: "Choya Logging Tool", p: {gem: 1000}},
	{i: 80987, n: "Unbound Magic Harvesting Blast", p: {gem: 900}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 80979, n: "Unbound Magic Logging Pulse", p: {gem: 900}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: 80977, n: "Unbound Magic Mining Beam", p: {gem: 900}, Finish: new Date("2018-06-05T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 87389, n: "Inquest Mark II#Gallery", p: {blticket: 1}},
	{i: 44839, n: "Zodiac weapon skins#Gallery", p: {blticket: 3}, Finish: new Date("2018-06-12T16:00:00Z")},
	{i: 77898, n: "Dominator weapon skins#Gallery", p: {blticket: 3}, Finish: new Date("2018-06-12T16:00:00Z")},
	{i: 78007, n: "Bubble Glider", p: {gem: 500}, Finish: new Date("2018-06-08T16:00:00Z")},
	{i: 72252, n: "Crystal Arbiter Glider", p: {gem: 500}, Finish: new Date("2018-06-08T16:00:00Z")},
	{i: 77738, n: "Phoenix Kite Glider", p: {gem: 400}, Finish: new Date("2018-06-08T16:00:00Z")},
	{i: 79084, n: "Shining Blade Glider", p: {gem: 700}, Finish: new Date("2018-06-08T16:00:00Z")},
	{i: 79288, n: "Shining Blade Backpack", p: {gem: 700}, Finish: new Date("2018-06-08T16:00:00Z")},
	{i: 63909, n: "Incarnate Light Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-02T16:00:00Z")},
	{i: 63899, n: "Strider's Medium Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-02T16:00:00Z")},
	{i: 63929, n: "Rampart Heavy Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-02T16:00:00Z")},
	{i: 64747, n: "Inventor's Sunglasses", p: {gem: 150}, Finish: new Date("2018-06-06T16:00:00Z")},
	{i: 67038, n: "Glowing Green Mask", p: {gem: 500}, Finish: new Date("2018-06-06T16:00:00Z")},
	{i: 66309, n: "Wreath of Cooperation", p: {gem: 400}, Finish: new Date("2018-06-06T16:00:00Z")}
	]
};
