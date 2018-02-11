/*
 * This file is used by gw2timer.com/nodes
 * Cache association of home instance nodes to their proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_NODES_HEADERS = {
	Gathering: {name_en: "Gathering", name_de: "Sammel", name_es: "Recolección", name_fr: "Récolte", name_zh: "采集"},
	Chest: {name_en: "Chest", name_de: "Truhe", name_es: "Cofre", name_fr: "Coffre", name_zh: "宝箱"},
	Special: {name_en: "Special", name_de: "Spezial", name_es: "Especial", name_fr: "Spéciales", name_zh: "特殊"}
};

/*
 * Associated finisher item with that finisher unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of item
 * p: Payment type to acquire the item
 */
var GW2T_NODES_DATA = {
Special: [
	{u: "krait_obelisk", i: 48875, n: "Krait Obelisk Shard", p: {laurel: 25}},
	{u: "quartz_node", i: 43902, n: "Gift of Quartz", p: {laurel: 25}},
	{u: "candy_corn_node", i: 48804, n: "Gift of Candy Corn", p: {laurel: 25}},
	{u: "king_sized_candy_corn", i: 79646, n: "Greater Gift of Candy Corn", p: {cob: 5}},
	{u: "sprocket_generator", i: 49825, n: "Gift of Sprockets", p: {laurel: 25}},
	{u: "bloodstone_crystals", i: 79217, n: "Bloodstone Crystal Node", p: {coin: 500000}},
	{u: "petrified_stump", i: 79898, n: "Petrified Wood Node", p: {coin: 500000}},
	{u: "winterberry_bush", i: 79903, n: "Winterberry Bush Node", p: {coin: 500000}},
	{u: "jade_fragment", i: 80450, n: "Jade Fragment Node", p: {coin: 500000}},
	{u: "primordial_orchid", i: 81115, n: "Fire Orchid Node", p: {coin: 500000}},
	{u: "orrian_oyster", i: 81696, n: "Orrian Oyster Node", p: {coin: 500000}},
	{u: "brandstone_node", i: 86297, n: "Brandstone Node", p: {coin: 500000}}
],
Gathering: [
	{u: "hunters_contract", i: 81594, n: "Black Lion Hunters Contract", p: {gem: 1200}},
	{u: "garden_plot_deed", i: 86786, n: "Black Lion Garden Plot Deed", p: {gem: 1000}},
	{u: "basic_harvesting_nodes", i: 67290, n: "Basic Harvesting Node Pack", p: {gem: 800}},
	{u: "basic_lumber_nodes", i: 66769, n: "Basic Lumber Node Pack", p: {gem: 800}},
	{u: "basic_ore_nodes", i: 44884, n: "Basic Ore Node Pack", p: {gem: 800}},
	{u: "basic_cloth_rack", i: 67842, n: "Basic Cloth Rack", p: {gem: 800}},
	{u: "advanced_cloth_rack", i: 81853, n: "Advanced Cloth Rack", p: {gem: 800}},
	{u: "basic_leather_rack", i: 78019, n: "Basic Leather Rack", p: {gem: 800}},
	{u: "advanced_leather_rack", i: 81852, n: "Advanced Leather Rack", p: {gem: 800}},
	{u: "lotus_node", i: 68096, n: "Lotus Harvesting Node"},
	{u: "ghost_pepper_node", i: 68093, n: "Ghost Pepper Harvesting Node"},
	{u: "omnomberry_node", i: 68089, n: "Omnomberry Harvesting Node"},
	{u: "snow_truffle_node", i: 68092, n: "Snow Truffle Harvesting Node"},
	{u: "orrian_truffle_node", i: 68095, n: "Orrian Truffle Harvesting Node"},
	{u: "flaxseed_node", i: 79063, n: "Flaxseed Harvesting Node"},
	{u: "hard_wood_node", i: 79085, n: "Hard Wood Logging Node"},
	{u: "elder_wood_node", i: 68090, n: "Elder Wood Logging Node"},
	{u: "ancient_wood_node", i: 68091, n: "Ancient Wood Logging Node"},
	{u: "iron_ore_node", i: 79260, n: "Iron Ore Mining Node"},
	{u: "platinum_ore_node", i: 68097, n: "Platinum Mining Node"},
	{u: "mithril_ore_node", i: 68098, n: "Mithril Mining Node"},
	{u: "orichalcum_ore_node", i: 68094, n: "Orichalcum Mining Node"}
],
Chest: [
	{u: "enchanted_treasure_chest", i: 67234, n: "Enchanted Treasure Chest", p: {achievement: 0}},
	{u: "wintersday_tree", i: 68367, n: "Gift of Magnanimity", p: {achievement: 0}},
	{u: "bandit_chest", i: 68495, n: "Personal Bandit Chest", p: {achievement: 0}},
	{u: "aurilium_node", i: 73798, n: "Aurillium Node", p: {achievement: 0}},
	{u: "airship_cargo", i: 78468, n: "Personal Airship Cargo Voucher", p: {map_vb: 250}},
	{u: "exalted_chest", i: 78582, n: "Personal Exalted Chest Voucher", p: {map_ab: 250}},
	{u: "crystallized_supply_cache", i: 78549, n: "Personal Crystallized Supply Cache Voucher", p: {map_td: 250}}
]
};
