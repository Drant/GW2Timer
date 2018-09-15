/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-08-21T16:00:00Z"),
	Finish: new Date("2018-09-19T16:00:00Z"),
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
	{i: "character_slot_expansion", n: "Character Slot Expansion", p: {gem: 520}, discount: 800, Finish: new Date("2018-09-15T16:00:00Z")},
	{i: 88394, n: "World Boss Portal Device", p: {gem: 400}},
	{i: 88431, n: "Shattered Cathedral Glider", p: {gem: 700}},
	{i: 88226, n: "Dragon Horns", p: {gem: 166}},
	{i: 88244, n: "Dragon's Eye Circlet", p: {gem: 166}},
	{i: 88333, n: "Enchanted Dragon Crown", p: {gem: 166}},
	{i: 88409, n: "Emblazoned Dragon Throne", p: {gem: 600}},
	{i: 88462, n: "Dragon Emblem Balloon", p: {gem: 250}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88406, n: "Equinox weapon skins#Gallery", p: {blticket: 1}},
	{i: 67040, n: "Ceremonial Plated Outfit", p: {gem: 700}, Finish: new Date("2018-09-14T16:00:00Z")},
	{i: 64756, n: "Cook's Outfit", p: {gem: 700}, Finish: new Date("2018-09-14T16:00:00Z")},
	{i: 70253, n: "Wedding Attire Outfit", p: {gem: 1000}, Finish: new Date("2018-09-14T16:00:00Z")},
	{i: 43102, n: "Trickster's Light-Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-13T16:00:00Z")},
	{i: 43101, n: "Viper's Medium-Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-13T16:00:00Z")},
	{i: 43100, n: "Phalanx Heavy-Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-13T16:00:00Z")},
	{i: 43018, n: "Zodiac Light Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-12T16:00:00Z")},
	{i: 43017, n: "Zodiac Medium Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-12T16:00:00Z")},
	{i: 43016, n: "Zodiac Heavy Armor Skin", p: {gem: 800}, Finish: new Date("2018-09-12T16:00:00Z")},
	{i: 69662, n: "Daydreamer's Finery Outfit", p: {gem: 700}, Finish: new Date("2018-09-15T16:00:00Z")},
	{i: 70071, n: "Harbinger of Mordremoth Outfit", p: {gem: 700}, Finish: new Date("2018-09-15T16:00:00Z")},
	{i: 69863, n: "Monk's Outfit", p: {gem: 700}, Finish: new Date("2018-09-15T16:00:00Z")},
	{i: 83865, n: "Champion of Tyria Outfit", p: {gem: 700}, Finish: new Date("2018-09-16T16:00:00Z")},
	{i: 77808, n: "Crystal Savant Outfit", p: {gem: 700}, Finish: new Date("2018-09-16T16:00:00Z")},
	{i: 87548, n: "Elonian Elementalist Outfit", p: {gem: 700}, Finish: new Date("2018-09-16T16:00:00Z")},
	{i: 79531, n: "Mursaat Robes", p: {gem: 700}, Finish: new Date("2018-09-16T16:00:00Z")},
	{i: 88355, n: "Choya Mining Tool", p: {gem: 1000}, Finish: new Date("2018-09-18T16:00:00Z")},
	{i: 78010, n: "Ironclad Outfit", p: {gem: 700}},
	{i: 69753, n: "Mad Scientist Outfit", p: {gem: 700}},
	{i: 77483, n: "Slayer's Outfit", p: {gem: 700}},
	{i: 87539, n: "Shrine Guardian Jackal Skin", p: {gem: 2000}},
	{i: 87701, n: "Volatile Magic Harvesting Tool", p: {gem: 1000}},
	{i: 87954, n: "Volatile Magic Logging Tool", p: {gem: 1000}},
	{i: 87841, n: "Volatile Magic Mining Tool", p: {gem: 1000}},
	{i: 43576, n: "Flamekissed Light Armor Skin", p: {gem: 800}},
	{i: 43575, n: "Flamewalker Medium Armor Skin", p: {gem: 800}},
	{i: 43574, n: "Flamewrath Heavy Armor Skin", p: {gem: 800}},
	{i: 81776, n: "Abaddon's Mask", p: {gem: 500}},
	{i: 64742, n: "Aviator Cap", p: {gem: 200}},
	{i: 64740, n: "Aviator Sunglasses", p: {gem: 150}},
	{i: 64753, n: "Wide Rim Glasses", p: {gem: 150}},
	{i: 81583, n: "Fuzzy Aurene Hat", p: {gem: 400}},
	{i: 64758, n: "Fuzzy Cat Hat", p: {gem: 200}},
	{i: 48817, n: "Scarlet's Grasp", p: {gem: 400}},
	{i: 48824, n: "Scarlet's Spaulders", p: {gem: 400}},
	{i: 63940, n: "Lawless Helmet Skin", p: {gem: 300}},
	{i: 42962, n: "Lawless Shoulder Skin", p: {gem: 300}},
	{i: 42966, n: "Lawless Boots Skin", p: {gem: 300}}
	]
};
