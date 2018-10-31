/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-10-09T16:00:00Z"),
	Finish: new Date("2018-11-06T16:00:00Z"),
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
	{i: 89079, n: "Haunted Armor Outfit", p: {gem: 700}, Finish: new Date("2018-11-13T16:00:00Z")},
	{i: 89030, n: "Arachnid Glider", p: {gem: 700}, Finish: new Date("2018-11-13T16:00:00Z")},
	{i: 71323, n: "Ghoul Backpack", p: {gem: 195}, discount: 300, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 73815, n: "Mini Ghoul Legs", p: {gem: 195}, discount: 300, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 82391, n: "Grenth's Regalia Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 74684, n: "Bat Wings Glider", p: {gem: 700}, Finish: new Date("2018-11-13T16:00:00Z")},
	{i: 73939, n: "Bat Wings Backpack", p: {gem: 700}, Finish: new Date("2018-11-13T16:00:00Z")},
	{i: 48714, n: "Hallows Fortune Fireworks", p: {gem: 0}, discount: 200, Finish: new Date("2018-11-02T16:00:00Z")},
	{i: 44068, n: "Permanent Mad King Finisher", p: {gem: 350}, discount: 500, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 44069, n: "Permanent Scarecrow Finisher", p: {gem: 350}, discount: 500, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 70048, n: "Black Feather Wings Glider", p: {gem: 490}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 68686, n: "Black Feather Wings Backpack", p: {gem: 490}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 69882, n: "White Feather Wings Backpack", p: {gem: 490}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 70009, n: "White Feather Wings Glider", p: {gem: 490}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 77270, n: "Golden Feather Wings Backpack", p: {gem: 490}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 77269, n: "Golden Feather Wings Glider", p: {gem: 490}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 65196, n: "Mad King's Outfit", p: {gem: 525}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 65201, n: "Witch's Outfit", p: {gem: 525}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 47890, n: "Grenth Hood Skin", p: {gem: 375}, discount: 500, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 65203, n: "Phantom's Hood", p: {gem: 150}, discount: 200, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 65195, n: "Bloody Prince's Outfit", p: {gem: 525}, discount: 700, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 88995, n: "Festive Harvest Chair", p: {gem: 600}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 67406, n: "Candy Corn Gobbler Pack", p: {gem: 300}, discount: 200, Finish: new Date("2018-11-02T16:00:00Z")},
	{i: 85437, n: "Mini Spooky Mounts Pack", p: {gem: 1600}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 65194, n: "Executioner's Outfit", p: {gem: 700}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 70385, n: "Lunatic Guard Outfit", p: {gem: 700}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 67391, n: "Haunted Gramophone", p: {gem: 600}, Finish: new Date("2018-11-02T16:00:00Z")},
	{i: 79666, n: "Hovering Mad Mirror", p: {gem: 250}, Finish: new Date("2018-11-02T16:00:00Z")},
	{i: 85481, n: "Mini Choya Pumpkin Gang", p: {gem: 400}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 87311, n: "Winged Headpiece", p: {gem: 400}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88406, n: "Equinox weapon skins#Gallery", p: {blticket: 1}},
	{i: 89082, n: "Mad Realm weapon skins#Gallery", p: {blticket: 1}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 88979, n: "Black Lion Expedition Contract", p: {gem: 1000}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 81412, n: "Foefire Mantle", p: {gem: 500}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 88108, n: "Storm Gloves", p: {gem: 500}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 85282, n: "Foefire Greaves", p: {gem: 500}, Finish: new Date("2018-11-06T16:00:00Z")},
	{i: 81263, n: "Mercenary Backpack", p: {gem: 400}, Finish: new Date("2018-11-02T16:00:00Z")},
	{i: 81565, n: "Mini Plush Aurene", p: {gem: 400}, Finish: new Date("2018-11-02T16:00:00Z")},
	{i: 78733, n: "Sloth Backpack", p: {gem: 500}, Finish: new Date("2018-11-02T16:00:00Z")},
	{i: 69737, n: "Daydreamer's Wings Backpack", p: {gem: 500}, Finish: new Date("2018-11-04T16:00:00Z")},
	{i: 74219, n: "Dread Quiver Backpack", p: {gem: 350}, Finish: new Date("2018-11-04T16:00:00Z")}
	]
};
