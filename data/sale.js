/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-11-06T16:00:00Z"),
	Finish: new Date("2018-11-20T16:00:00Z"),
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
	{i: 89086, n: "Firestorm Logging Tool", p: {gem: 1000}, Finish: new Date("2018-11-20T16:00:00Z")},
	{i: 81664, n: "Mistlock Sanctuary Passkey", p: {gem: 1000}, Finish: new Date("2018-11-20T16:00:00Z")},
	{i: 88108, n: "Storm Gloves", p: {gem: 500}, Finish: new Date("2018-11-09T16:00:00Z")},
	{i: 78667, n: "Chaos Gloves Skin", p: {gem: 500}, Finish: new Date("2018-11-09T16:00:00Z")},
	{i: 68612, n: "Plush Ram Backpack", p: {gem: 300}, Finish: new Date("2018-11-09T16:00:00Z")},
	{i: 39519, n: "Warrior Quaggan Backpack Cover", p: {gem: 300}, Finish: new Date("2018-11-09T16:00:00Z")},
	{i: 89079, n: "Haunted Armor Outfit", p: {gem: 700}, Finish: new Date("2018-11-13T16:00:00Z")},
	{i: 89030, n: "Arachnid Glider", p: {gem: 700}, Finish: new Date("2018-11-13T16:00:00Z")},
	{i: 74684, n: "Bat Wings Glider", p: {gem: 700}, Finish: new Date("2018-11-13T16:00:00Z")},
	{i: 73939, n: "Bat Wings Backpack", p: {gem: 700}, Finish: new Date("2018-11-13T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88406, n: "Equinox weapon skins#Gallery", p: {blticket: 1}},
	{i: 87478, n: "Suntouched Scythe Staff Skin", p: {gem: 600}, Finish: new Date("2018-11-11T16:00:00Z")},
	{i: 79360, n: "Amethyst Aegis", p: {gem: 600}, Finish: new Date("2018-11-11T16:00:00Z")},
	{i: 79310, n: "Storm Bow", p: {gem: 600}, Finish: new Date("2018-11-11T16:00:00Z")},
	{i: 20004, n: "Caithe's Bloom Dagger", p: {gem: 600}, Finish: new Date("2018-11-10T16:00:00Z")},
	{i: 42663, n: "Rox's Quiver Backpack Cover", p: {gem: 600}, Finish: new Date("2018-11-10T16:00:00Z")},
	{i: 42659, n: "Rox's Short Bow Skin", p: {gem: 600}, Finish: new Date("2018-11-10T16:00:00Z")},
	{i: 80861, n: "Shield of the Goddess", p: {gem: 600}, Finish: new Date("2018-11-09T16:00:00Z")},
	{i: 81240, n: "Menzies's Agony", p: {gem: 600}, Finish: new Date("2018-11-09T16:00:00Z")},
	{i: 85192, n: "Trained Choya Hammer Skin", p: {gem: 600}, Finish: new Date("2018-11-09T16:00:00Z")}
	]
};
