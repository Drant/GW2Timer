/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-11-27T16:00:00Z"),
	Finish: new Date("2018-12-18T16:00:00Z"),
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
	{i: 81548, n: "Dynamics Exo-Suit Outfit", p: {gem: 700}, Finish: new Date("2018-12-09T16:00:00Z")},
	{i: 82360, n: "Imperial Guard Outfit", p: {gem: 700}, Finish: new Date("2018-12-09T16:00:00Z")},
	{i: 68654, n: "Imperial Outfit", p: {gem: 700}, Finish: new Date("2018-12-09T16:00:00Z")},
	{i: 87477, n: "Primeval Dervish Outfit", p: {gem: 700}, Finish: new Date("2018-12-09T16:00:00Z")},
	{i: 68577, n: "Arcane Outfit", p: {gem: 700}, Finish: new Date("2018-12-08T16:00:00Z")},
	{i: 66279, n: "Ancestral Outfit", p: {gem: 700}, Finish: new Date("2018-12-08T16:00:00Z")},
	{i: 65198, n: "Fancy Winter Outfit", p: {gem: 700}, Finish: new Date("2018-12-08T16:00:00Z")},
	{i: 68684, n: "Crystal Nomad Outfit", p: {gem: 700}, Finish: new Date("2018-12-07T16:00:00Z")},
	{i: 67398, n: "Noble Count Outfit", p: {gem: 700}, Finish: new Date("2018-12-07T16:00:00Z")},
	{i: 66658, n: "Shadow Assassin Outfit", p: {gem: 700}, Finish: new Date("2018-12-07T16:00:00Z")},
	{i: "https://i.imgur.com/fb9KMVN.png", n: "The Evon Gnashblade Decorative Package", p: {gem: 3000}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 89325, n: "Distant Lands Mount Adoption License", p: {gem: 400}, discount: [[1, 400], [5, 1800], [15, 5100]], Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 89336, n: "Distant Lands Mount Select License", p: {gem: 1200}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 88226, n: "Dragon Horns", p: {gem: 166}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 88244, n: "Dragon's Eye Circlet", p: {gem: 166}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 88333, n: "Enchanted Dragon Crown", p: {gem: 166}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: "https://i.imgur.com/fb9KMVN.png", n: "The Evon Gnashblade Decorative Package", p: {gem: 3000}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 87612, n: "Pet Dog Whistle: Basenji", p: {gem: 500}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 89082, n: "Mad Realm weapon skins#Gallery", p: {blticket: 1}},
	{i: 50103, n: "Magnus's Eye Patch", p: {gem: 400}, Finish: new Date("2018-12-08T16:00:00Z")},
	{i: 79387, n: "Peg-Leg Boots Skin", p: {gem: 300}, Finish: new Date("2018-12-08T16:00:00Z")},
	{i: 79374, n: "Pirate Corsair Hat Skin", p: {gem: 300}, Finish: new Date("2018-12-08T16:00:00Z")},
	{i: 79391, n: "Pirate Hook Skin", p: {gem: 300}, Finish: new Date("2018-12-08T16:00:00Z")},
	{i: 64742, n: "Aviator Cap", p: {gem: 200}, Finish: new Date("2018-12-09T16:00:00Z")},
	{i: 64740, n: "Aviator Sunglasses", p: {gem: 150}, Finish: new Date("2018-12-09T16:00:00Z")},
	{i: 48824, n: "Scarlet's Spaulders", p: {gem: 400}, Finish: new Date("2018-12-09T16:00:00Z")},
	{i: 48817, n: "Scarlet's Grasp", p: {gem: 400}, Finish: new Date("2018-12-09T16:00:00Z")},
	{i: 81776, n: "Abaddon's Mask", p: {gem: 500}, Finish: new Date("2018-12-07T16:00:00Z")},
	{i: 81583, n: "Fuzzy Aurene Hat", p: {gem: 400}, Finish: new Date("2018-12-07T16:00:00Z")},
	{i: 64758, n: "Fuzzy Cat Hat", p: {gem: 200}, Finish: new Date("2018-12-07T16:00:00Z")},
	{i: 64753, n: "Wide Rim Glasses", p: {gem: 150}, Finish: new Date("2018-12-07T16:00:00Z")},
	{i: 88190, n: "Lightning Aspect Eye", p: {gem: 166}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 88161, n: "Sun Aspect Eye", p: {gem: 166}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 88170, n: "Wind Aspect Eye", p: {gem: 166}, Finish: new Date("2018-12-04T16:00:00Z")},
	{i: 78010, n: "Ironclad Outfit", p: {gem: 700}, Finish: new Date("2018-12-02T16:00:00Z")},
	{i: 69753, n: "Mad Scientist Outfit", p: {gem: 700}, Finish: new Date("2018-12-02T16:00:00Z")},
	{i: 77483, n: "Slayer's Outfit", p: {gem: 700}, Finish: new Date("2018-12-02T16:00:00Z")},
	{i: 85740, n: "First Follower Desmina Outfit", p: {gem: 700}, Finish: new Date("2018-12-01T16:00:00Z")},
	{i: 85034, n: "Forged Outfit", p: {gem: 700}, Finish: new Date("2018-12-01T16:00:00Z")},
	{i: 87182, n: "Inquest Exo-Suit Outfit", p: {gem: 700}, Finish: new Date("2018-12-01T16:00:00Z")}
	]
};
