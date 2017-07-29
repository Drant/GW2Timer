/*
 * This file is used by http://gw2timer.com and http://gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2017-07-18T16:00:00Z"),
	Finish: new Date("2017-08-02T16:00:00Z"),
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
	{i: 75129, n: "Lyssa's Regalia", p: {gem: 490}, discount: 700, Finish: new Date("2017-08-01T16:00:00Z")},
	{i: 69806, n: "Dwayna's Regalia Outfit", p: {gem: 490}, discount: 700, Finish: new Date("2017-08-01T16:00:00Z")},
	{i: 79288, n: "Shining Blade Backpack", p: {gem: 490}, discount: 700, Finish: new Date("2017-08-01T16:00:00Z")},
	{i: 79084, n: "Shining Blade Glider", p: {gem: 490}, discount: 700, Finish: new Date("2017-08-01T16:00:00Z")},
	{i: 82011, n: "Abaddon's Glider", p: {gem: 400}},
	{i: 81594, n: "Black Lion Hunters Contract", p: {gem: 1200}},
	{i: 81664, n: "Mistlock Sanctuary Passkey", p: {gem: 1000}},
	{i: 81912, n: "Mistlock Sanctuary Passkey (2 weeks)", p: {gem: 150}},
	{i: 50093, n: "Captain's Airship Pass (2 weeks)", p: {gem: 150}},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "http://gw2timer.com/?page=Trading", side: 1},
	{i: 81816, n: "Abaddon weapon skins#Gallery", p: {blticket: 2}},
	{i: 80861, n: "Shield of the Goddess", p: {gem: 600}, Finish: new Date("2017-08-01T16:00:00Z")},
	{i: 81548, n: "Dynamics Exo-Suit Outfit", p: {gem: 700}},
	{i: 81547, n: "Dynamics Glider Module", p: {gem: 700}},
	{i: 81557, n: "Dynamics Projector Module", p: {gem: 700}},
	{i: 79010, n: "Glide-r-Tron", p: {gem: 500}},
	{i: 79631, n: "Spectral Glider", p: {gem: 500}},
	{i: 76236, n: "Exalted Glider", p: {gem: 400}}
	]
};