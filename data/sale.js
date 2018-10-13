/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-10-09T16:00:00Z"),
	Finish: new Date("2018-10-31T16:00:00Z"),
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
	{i: 88979, n: "Black Lion Expedition Contract", p: {gem: 1000}, Finish: new Date("2018-10-16T16:00:00Z")},
	{i: "https://i.imgur.com/ch0zrT3.png", n: "Foefire Armor Package", p: {gem: 1040}, discount: 1500, Finish: new Date("2018-10-16T16:00:00Z")},
	{i: 85437, n: "Mini Spooky Mounts Pack", p: {gem: 1600}, Finish: new Date("2018-10-31T16:00:00Z")},
	{i: 81412, n: "Foefire Mantle", p: {gem: 500}, Finish: new Date("2018-10-16T16:00:00Z")},
	{i: 88108, n: "Storm Gloves", p: {gem: 500}, Finish: new Date("2018-10-16T16:00:00Z")},
	{i: 65194, n: "Executioner's Outfit", p: {gem: 700}, Finish: new Date("2018-10-31T16:00:00Z")},
	{i: 70385, n: "Lunatic Guard Outfit", p: {gem: 700}, Finish: new Date("2018-10-31T16:00:00Z")},
	{i: 86897, n: "Jackal Rune Greaves", p: {gem: 500}},
	{i: 88451, n: "Night Watch Stool", p: {gem: 400}, Finish: new Date("2018-10-16T16:00:00Z")},
	{i: 88983, n: "Scaled Dragon Wings Glider", p: {gem: 700}, Finish: new Date("2018-10-23T16:00:00Z")},
	{i: 88992, n: "Scaled Dragon Wings Backpack", p: {gem: 700}, Finish: new Date("2018-10-23T16:00:00Z")},
	{i: 88775, n: "Dreadnought Raptor Skin", p: {gem: 2000}},
	{i: 88808, n: "Zafirah's Tactical Outfit", p: {gem: 700}},
	{i: 88759, n: "Zafirah's Rifle Skin", p: {gem: 600}},
	{i: 88394, n: "World Boss Portal Device", p: {gem: 400}},
	{i: 88431, n: "Shattered Cathedral Glider", p: {gem: 700}},
	{i: 85496, n: "Riding Broom Glider", p: {gem: 500}, Finish: new Date("2018-10-19T16:00:00Z")},
	{i: 85506, n: "Mini Elonian Familiar", p: {gem: 400}, Finish: new Date("2018-10-19T16:00:00Z")},
	{i: 79651, n: "Mini Feline Familiar", p: {gem: 350}, Finish: new Date("2018-10-19T16:00:00Z")},
	{i: 86786, n: "Black Lion Garden Plot Deed", p: {gem: 1000}, Finish: new Date("2018-10-19T16:00:00Z")},
	{i: 81594, n: "Black Lion Hunters Contract", p: {gem: 1200}, Finish: new Date("2018-10-19T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88406, n: "Equinox weapon skins#Gallery", p: {blticket: 1}},
	{i: 84963, n: "War God's weapon skins#Gallery", p: {blticket: 2}},
	{i: 80987, n: "Unbound Magic Harvesting Blast", p: {gem: 900}, Finish: new Date("2018-10-16T16:00:00Z")},
	{i: 80979, n: "Unbound Magic Logging Pulse", p: {gem: 900}, Finish: new Date("2018-10-16T16:00:00Z")},
	{i: 80977, n: "Unbound Magic Mining Beam", p: {gem: 900}, Finish: new Date("2018-10-16T16:00:00Z")}
	]
};
