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
	{i: 44068, n: "Permanent Mad King Finisher", p: {gem: 300}, discount: 500, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 44069, n: "Permanent Scarecrow Finisher", p: {gem: 300}, discount: 500},
	{i: 44070, n: "Permanent Gift Finisher", p: {gem: 360}, discount: 600, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 44071, n: "Permanent Snowman Finisher", p: {gem: 420}, discount: 700, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 47896, n: "Permanent Snow Globe Finisher", p: {gem: 420}, discount: 700, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 44724, n: "Permanent Super Explosive Finisher", p: {gem: 360}, discount: 600, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 49165, n: "Permanent Mystical Dragon Finisher", p: {gem: 480}, discount: 800, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 49952, n: "Permanent Llama Finisher", p: {gem: 480}, discount: 800, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 63941, n: "Permanent Minstrel Finisher", p: {gem: 480}, discount: 800, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 69616, n: "Permanent Unicorn Finisher", p: {gem: 420}, discount: 700, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 85757, n: "Permanent Choya Finisher", p: {gem: 560}, discount: 700, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 86834, n: "Permanent Sandshark Finisher", p: {gem: 480}, discount: 600, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 85437, n: "Mini Spooky Mounts Pack", p: {gem: 1600}},
	{i: 87548, n: "Elonian Elementalist Outfit", p: {gem: 700}},
	{i: 87530, n: "Choya Logging Tool", p: {gem: 1000}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 87389, n: "Inquest Mark II#Gallery", p: {blticket: 1}},
	{i: 44839, n: "Zodiac weapon skins#Gallery", p: {blticket: 3}, Finish: new Date("2018-06-12T16:00:00Z")},
	{i: 77898, n: "Dominator weapon skins#Gallery", p: {blticket: 3}, Finish: new Date("2018-06-12T16:00:00Z")},
	{i: 69623, n: "Exemplar Attire Outfit", p: {gem: 700}, Finish: new Date("2018-05-30T16:00:00Z")},
	{i: 67990, n: "Jungle Explorer Outfit", p: {gem: 700}, Finish: new Date("2018-05-30T16:00:00Z")},
	{i: 80906, n: "Spring Promenade Outfit", p: {gem: 700}, Finish: new Date("2018-05-30T16:00:00Z")},
	{i: 77282, n: "Bandit Sniper's Outfit", p: {gem: 700}, Finish: new Date("2018-05-31T16:00:00Z")},
	{i: 81223, n: "Outlaw Outfit", p: {gem: 700}, Finish: new Date("2018-05-31T16:00:00Z")},
	{i: 78574, n: "Sentinel Outfit", p: {gem: 700}, Finish: new Date("2018-05-31T16:00:00Z")},
	{i: 78011, n: "White Mantle Outfit", p: {gem: 700}, Finish: new Date("2018-05-31T16:00:00Z")},
	{i: 76905, n: "Crystal Arbiter Outfit", p: {gem: 700}, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 85740, n: "First Follower Desmina Outfit", p: {gem: 700}, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 82360, n: "Imperial Guard Outfit", p: {gem: 700}, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 42870, n: "Aetherblade Light Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 42869, n: "Aetherblade Medium Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 42868, n: "Aetherblade Heavy Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-01T16:00:00Z")},
	{i: 63909, n: "Incarnate Light Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-03T16:00:00Z")},
	{i: 63899, n: "Strider's Medium Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-03T16:00:00Z")},
	{i: 63929, n: "Rampart Heavy Armor Skin", p: {gem: 800}, Finish: new Date("2018-06-03T16:00:00Z")}
	]
};
