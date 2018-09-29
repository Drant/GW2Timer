/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-09-19T16:00:00Z"),
	Finish: new Date("2018-10-09T16:00:00Z"),
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
	{i: 87360, n: "Istani Isles—Mount Select License", p: {gem: 720}, discount: 1200, Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 85580, n: "Mount Adoption License", p: {gem: 320}, discount: [[1, 320, 400], [10, 2720, 3400]], Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 88775, n: "Dreadnought Raptor Skin", p: {gem: 2000}},
	{i: 88808, n: "Zafirah's Tactical Outfit", p: {gem: 700}},
	{i: 88759, n: "Zafirah's Rifle Skin", p: {gem: 600}},
	{i: 88394, n: "World Boss Portal Device", p: {gem: 400}},
	{i: 88431, n: "Shattered Cathedral Glider", p: {gem: 700}},
	{i: 70300, n: "Mini Bonebreaker", p: {gem: 350}},
	{i: 81565, n: "Mini Plush Aurene", p: {gem: 400}},
	{i: 67838, n: "Mini Sand Giant", p: {gem: 350}},
	{i: 77675, n: "Mini Zintl Cavalier", p: {gem: 350}},
	{i: 85517, n: "Mini Kormeerkat", p: {gem: 350}, Finish: new Date("2018-10-05T16:00:00Z")},
	{i: 80860, n: "Mini Krytan Floppy Fish", p: {gem: 350}, Finish: new Date("2018-10-05T16:00:00Z")},
	{i: 42951, n: "Mini Mordrem Leyleecher", p: {gem: 500}, Finish: new Date("2018-10-05T16:00:00Z")},
	{i: 77339, n: "Mini Sabetha", p: {gem: 350}, Finish: new Date("2018-10-05T16:00:00Z")},
	{i: 48930, n: "Consortium Harvesting Sickle", p: {gem: 1000}, Finish: new Date("2018-10-03T16:00:00Z")},
	{i: 48825, n: "Frost Wasp Logging Tool", p: {gem: 1000}, Finish: new Date("2018-10-03T16:00:00Z")},
	{i: 48934, n: "Jack-in-the-Box Scythe", p: {gem: 1000}, Finish: new Date("2018-10-03T16:00:00Z")},
	{i: 87425, n: "Shifting Sand Mining Pick", p: {gem: 1000}, Finish: new Date("2018-10-03T16:00:00Z")},
	{i: 77811, n: "Electromagnetic-Descender Glider", p: {gem: 400}, Finish: new Date("2018-09-29T16:00:00Z")},
	{i: 76236, n: "Exalted Glider", p: {gem: 400}, Finish: new Date("2018-09-29T16:00:00Z")},
	{i: 81291, n: "Magic Carpet Glider", p: {gem: 400}, Finish: new Date("2018-09-29T16:00:00Z")},
	{i: 82011, n: "Abaddon's Glider", p: {gem: 400}, Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 82666, n: "Geomancer Glider", p: {gem: 500}, Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 67032, n: "Fused Molten Sickle", p: {gem: 1000}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 67030, n: "Fused Molten Logging Axe", p: {gem: 1000}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 48933, n: "Molten Alliance Mining Pick", p: {gem: 1000}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 67063, n: "Tireless Harvesting Minion", p: {gem: 1000}, Finish: new Date("2018-10-04T16:00:00Z")},
	{i: 67029, n: "Tireless Logging Minion", p: {gem: 1000}, Finish: new Date("2018-10-04T16:00:00Z")},
	{i: 48932, n: "Bone Pick", p: {gem: 1000}, Finish: new Date("2018-10-04T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 88406, n: "Equinox weapon skins#Gallery", p: {blticket: 1}},
	{i: 84963, n: "War God's weapon skins#Gallery", p: {blticket: 2}},
	{i: 42583, n: "Mini Orange Kitten", p: {gem: 400}, Finish: new Date("2018-09-29T16:00:00Z")},
	{i: 81242, n: "Mini Outlaw Puppy", p: {gem: 400}, Finish: new Date("2018-09-29T16:00:00Z")},
	{i: 84782, n: "Mini Squire Aurene", p: {gem: 400}, Finish: new Date("2018-09-29T16:00:00Z")},
	{i: 42591, n: "Mini White Kitten", p: {gem: 400}, Finish: new Date("2018-09-29T16:00:00Z")},
	{i: 77649, n: "Mini Arrowhead", p: {gem: 400}, Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 79048, n: "Mini Garm", p: {gem: 350}, Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 84998, n: "Mini Maraca Choya Pinata", p: {gem: 400}, Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 69621, n: "Miniature Moose", p: {gem: 350}, Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 42960, n: "Mini Scruffy", p: {gem: 500}, Finish: new Date("2018-09-30T16:00:00Z")},
	{i: 88226, n: "Dragon Horns", p: {gem: 166}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 88244, n: "Dragon's Eye Circlet", p: {gem: 166}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 88333, n: "Enchanted Dragon Crown", p: {gem: 166}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 87701, n: "Volatile Magic Harvesting Tool", p: {gem: 1000}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 87954, n: "Volatile Magic Logging Tool", p: {gem: 1000}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 87841, n: "Volatile Magic Mining Tool", p: {gem: 1000}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 87539, n: "Shrine Guardian Jackal Skin", p: {gem: 2000}, Finish: new Date("2018-10-02T16:00:00Z")},
	{i: 81567, n: "God-Slayer Longbow", p: {gem: 350}, Finish: new Date("2018-10-05T16:00:00Z")},
	{i: 81560, n: "God-Slayer Short Bow", p: {gem: 350}, Finish: new Date("2018-10-05T16:00:00Z")},
	{i: 44888, n: "Mist Herald Back Item Skin", p: {gem: 500}, Finish: new Date("2018-10-05T16:00:00Z")}
	]
};
