/*
 * This file is used by gw2timer.com and gw2timer.com/gem
 * GW2 gem store promoted and discounted items.
 */
GW2T_SALE_DATA = {
	note: "", // Important note about the sale, optional
	Start: new Date("2018-03-06T16:00:00Z"),
	Finish: new Date("2018-03-13T16:00:00Z"),
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
	{i: 67027, n: "Silver-Fed Salvage-o-Matic", p: {gem: 400}, discount: 500, Finish: new Date("2018-03-07T16:00:00Z")},
	{i: 67857, n: "Glint's Gaze Mask", p: {gem: 500}, Finish: new Date("2018-03-07T16:00:00Z")},
	{i: 64749, n: "Sailor's Beanie", p: {gem: 200}, Finish: new Date("2018-03-07T16:00:00Z")},
	{i: 79014, n: "Xera's Mask", p: {gem: 400}, Finish: new Date("2018-03-07T16:00:00Z")},
	{i: 87202, n: "Mini Branded Mounts Pack", p: {gem: 1600}, Finish: new Date("2018-03-13T16:00:00Z")},
	{i: 48817, n: "Scarlet's Grasp", p: {gem: 240}, discount: 400, Finish: new Date("2018-03-08T16:00:00Z")},
	{i: 48824, n: "Scarlet's Spaulders", p: {gem: 240}, discount: 400, Finish: new Date("2018-03-08T16:00:00Z")},
	{i: 49024, n: "Toxic Mantle Skin", p: {gem: 240}, discount: 400, Finish: new Date("2018-03-08T16:00:00Z")},
	{i: 49031, n: "Toxic Gloves Skin", p: {gem: 240}, discount: 400, Finish: new Date("2018-03-08T16:00:00Z")},
	{i: 84014, n: "Swaggering Hat", p: {gem: 280}, discount: 400, Finish: new Date("2018-03-09T16:00:00Z")},
	{i: 81776, n: "Abaddon's Mask", p: {gem: 350}, discount: 500, Finish: new Date("2018-03-09T16:00:00Z")},
	{i: 80026, n: "Ice Crown", p: {gem: 280}, discount: 400, Finish: new Date("2018-03-09T16:00:00Z")},
	{i: 67395, n: "Reap-r-Tron", p: {gem: 600}, discount: 1000, Finish: new Date("2018-03-10T16:00:00Z")},
	{i: 67394, n: "Log-r-Tron", p: {gem: 600}, discount: 1000, Finish: new Date("2018-03-10T16:00:00Z")},
	{i: 67396, n: "Mine-r-Tron", p: {gem: 600}, discount: 1000, Finish: new Date("2018-03-10T16:00:00Z")},
	{i: 67071, n: "Shared Inventory Slot", p: {gem: 560}, discount: [[1, 560, 700], [3, 1512, 1890], [5, 2240, 2800]], Finish: new Date("2018-03-11T16:00:00Z")},
	{i: 67356, n: "Magic Carpet", p: {gem: 162}, discount: 250, Finish: new Date("2018-03-12T16:00:00Z")},
	{i: 81291, n: "Magic Carpet Glider", p: {gem: 260}, discount: 400, Finish: new Date("2018-03-12T16:00:00Z")},
	{i: 49931, n: "Riding Broom", p: {gem: 162}, discount: 250, Finish: new Date("2018-03-12T16:00:00Z")},
	{i: 85496, n: "Riding Broom Glider", p: {gem: 325}, discount: 500, Finish: new Date("2018-03-12T16:00:00Z")},
	{i: 69607, n: "Balthazar's Regalia Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-13T16:00:00Z")},
	{i: 82391, n: "Grenth's Regalia Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-13T16:00:00Z")},
	{i: 75129, n: "Lyssa's Regalia", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-13T16:00:00Z")},
	{i: 69806, n: "Dwayna's Regalia Outfit", p: {gem: 560}, discount: 700, Finish: new Date("2018-03-13T16:00:00Z")},
	{i: "https://render.guildwars2.com/file/98457F504BA2FAC8457F532C4B30EDC23929ACF9/619316.png", n: "Coin", p: {coin: 1000000}, url: "https://gw2timer.com/?page=Trading", side: 1},
	{i: 86920, n: "Alchemist weapons#Gallery", p: {blticket: 1}},
	{i: 64759, n: "Fuzzy Hylek Hat", p: {gem: 200}},
	{i: 64739, n: "Fuzzy Quaggan Hat", p: {gem: 200}},
	{i: 66309, n: "Wreath of Cooperation", p: {gem: 400}},
	{i: 81583, n: "Fuzzy Aurene Hat", p: {gem: 400}, Finish: new Date("2018-03-13T16:00:00Z")},
	{i: 79702, n: "Plush Aurene Backpack Cover", p: {gem: 400}, Finish: new Date("2018-03-13T16:00:00Z")},
	{i: 85332, n: "Branded Wing Backpack", p: {gem: 700}},
	{i: 85220, n: "Branded Wing Glider", p: {gem: 700}},
	{i: 75129, n: "Lyssa's Regalia", p: {gem: 700}},
	{i: 68655, n: "Dragon Mask Skin", p: {gem: 300}, Finish: new Date("2018-03-08T16:00:00Z")},
	{i: 64746, n: "Fuzzy Leopard Hat", p: {gem: 200}, Finish: new Date("2018-03-08T16:00:00Z")},
	{i: 64744, n: "Fuzzy Panda Hat", p: {gem: 200}, Finish: new Date("2018-03-08T16:00:00Z")},
	{i: 81776, n: "Abaddon's Mask", p: {gem: 500}, Finish: new Date("2018-03-08T16:00:00Z")},
	{i: 80026, n: "Ice Crown", p: {gem: 400}, Finish: new Date("2018-03-09T16:00:00Z")},
	{i: 84014, n: "Swaggering Hat", p: {gem: 400}, Finish: new Date("2018-03-09T16:00:00Z")},
	{i: 64748, n: "Reading Glasses", p: {gem: 150}, Finish: new Date("2018-03-10T16:00:00Z")},
	{i: 67887, n: "Shoulder Scarf", p: {gem: 400}, Finish: new Date("2018-03-10T16:00:00Z")},
	{i: 64750, n: "Top Hat", p: {gem: 200}, Finish: new Date("2018-03-10T16:00:00Z")},
	{i: 65200, n: "Wintersday Earmuffs", p: {gem: 25}, Finish: new Date("2018-03-10T16:00:00Z")},
	{i: 85496, n: "Riding Broom Glider", p: {gem: 500}, Finish: new Date("2018-03-12T16:00:00Z")},
	{i: 86786, n: "Black Lion Garden Plot Deed", p: {gem: 1000}, Finish: new Date("2018-03-13T16:00:00Z")},
	{i: 86898, n: "Zhaitan Dye Kit", p: {gem: 125}, discount: [[1, 125], [5, 500], [25, 2500]], Finish: new Date("2018-03-13T16:00:00Z")}
	]
};
