/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-06-06T16:00:00Z"),
	Finish: new Date("2017-06-27T16:00:00Z"),
	Values: {}, // ID-to-Price mapping of the promoted items, to be initialized
	numPaddingItems: 2,
	/*
	 * These objects were copied from http://gw2timer.com/data/sales.js and may
	 * be augmented with these variables:
	 *	i: "", // Item ID to retrieve icon and tooltip details, or a URL to a hosted image
	 *	n: "", // Item name referencing an English wiki page
	 *	p: {gem: 400}, // Current payment for one item
	 *	url: "", // If not provided, will use name as a wiki link, optional
	 *	discount: [[1, 160, 200], [5, 640, 800], [25, 3200, 4000]] OR 200, // [[quantity, gempricecurrent, gempriceoldOptional], ...] OR gempriceoldOptional
	 *	Finish: new Date("2017-01-01T16:00:00Z"), // Time the item or discount expires, optional
	 *	side: 0 or 1 // If has this property, these padding "items" will be ignored other than for creating column headers
	*/
	Items: [
	{i: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png", n: "Gem", p: {gem: 100}, url: "http://gw2timer.com/?page=Gem", side: 0},
	{i: 67038, n: "Glowing Green Mask", p: {gem: 350}, discount: 500, Finish: new Date("2017-06-19T16:00:00Z")},
	{i: 64742, n: "Aviator Cap", p: {gem: 140}, discount: 200, Finish: new Date("2017-06-20T16:00:00Z")},
	{i: 81293, n: "Foefire Wraps", p: {gem: 500}},
	{i: 81412, n: "Foefire Mantle", p: {gem: 500}},
	{i: 49149, n: "Royal Terrace Pass", p: {gem: 1000}, Finish: new Date("2017-06-20T16:00:00Z")},
	{i: 50104, n: "Captain's Airship Pass", p: {gem: 1000}, Finish: new Date("2017-06-20T16:00:00Z")},
	{i: 63941, n: "Permanent Minstrel Finisher", p: {gem: 800}},
	{i: 49165, n: "Permanent Mystical Dragon Finisher", p: {gem: 800}},
	{i: 67356, n: "Magic Carpet", p: {gem: 250}},
	{i: 81291, n: "Magic Carpet Glider", p: {gem: 400}},
	{i: 43018, n: "Zodiac Light Armor Skin", p: {gem: 800}},
	{i: 43017, n: "Zodiac Medium Armor Skin", p: {gem: 800}},
	{i: 43016, n: "Zodiac Heavy Armor Skin", p: {gem: 800}},
	{i: 43102, n: "Trickster's Light-Armor Skin", p: {gem: 800}},
	{i: 43101, n: "Viper's Medium-Armor Skin", p: {gem: 800}},
	{i: 43100, n: "Phalanx Heavy-Armor Skin", p: {gem: 800}},
	{i: 70071, n: "Harbinger of Mordremoth Outfit", p: {gem: 700}},
	{i: 44888, n: "Mist Herald Back Item Skin", p: {gem: 500}},
	{i: 44607, n: "Mask of the Jubilee", p: {gem: 400}},
	{i: 80082, n: "Braham's Wolfblood Pauldrons", p: {gem: 300}},
	{i: 64755, n: "Fuzzy Bear Hat", p: {gem: 200}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 68687, n: "Lord Faren's Rapier Skin", p: {gem: 500}, Finish: new Date("2017-06-25T16:00:00Z")},
	{i: 48944, n: "Mask of the Wanderer Skin", p: {gem: 500}, Finish: new Date("2017-06-23T16:00:00Z")},
	{i: 49157, n: "Mask of the Silent Skin", p: {gem: 500}, Finish: new Date("2017-06-23T16:00:00Z")},
	{i: 44609, n: "Mask of the Crown", p: {gem: 400}, Finish: new Date("2017-06-20T16:00:00Z")},
	{i: 63940, n: "Lawless Helmet Skin", p: {gem: 300}, Finish: new Date("2017-06-22T16:00:00Z")},
	{i: 42962, n: "Lawless Shoulder Skin", p: {gem: 300}, Finish: new Date("2017-06-22T16:00:00Z")},
	{i: 43525, n: "Lawless Gloves Skin", p: {gem: 300}, Finish: new Date("2017-06-22T16:00:00Z")},
	{i: 42966, n: "Lawless Boots Skin", p: {gem: 300}, Finish: new Date("2017-06-22T16:00:00Z")},
	{i: 68655, n: "Dragon Mask Skin", p: {gem: 300}, Finish: new Date("2017-06-24T16:00:00Z")},
	{i: 68656, n: "Lion Mask Skin", p: {gem: 300}, Finish: new Date("2017-06-24T16:00:00Z")},
	{i: 64740, n: "Aviator Sunglasses", p: {gem: 150}, Finish: new Date("2017-06-20T16:00:00Z")},
	{i: 64747, n: "Inventor's Sunglasses", p: {gem: 150}, Finish: new Date("2017-06-21T16:00:00Z")},
	{i: 64748, n: "Reading Glasses", p: {gem: 150}, Finish: new Date("2017-06-21T16:00:00Z")},
	{i: 41745, n: "Frost Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-06-19T16:00:00Z")},
	{i: 68005, n: "Glint's Winter Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-06-20T16:00:00Z")},
	{i: 80974, n: "Primordus Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-06-20T16:00:00Z")},
	{i: 69934, n: "Lion's Arch Rebuild Dye Kit", p: {gem: 125},  discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2017-06-21T16:00:00Z")}
	]
};