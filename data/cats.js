/*
 * This file is used by http://gw2timer.com/cats
 * Cache association of home instance cats to their proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_CATS_HEADERS = {
	Black: {name_en: "Black Cats", name_de: "Schwarze", name_es: "Negro", name_fr: "Noir", name_zh: "黑色"},
	Orange: {name_en: "Orange Cats", name_de: "Orange", name_es: "Naranja", name_fr: "Orange", name_zh: "橙色"},
	White: {name_en: "White Cats", name_de: "Weiße", name_es: "Blanco", name_fr: "Blanc", name_zh: "白色"},
	Special: {name_en: "Special Cats", name_de: "Spezial", name_es: "Especial", name_fr: "Spéciales", name_zh: "特殊"}
};

/*
 * Associated finisher item with that finisher unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of item
 * t: Label for comment
 */
var GW2T_CATS_DATA = {
Black: [
	{u: 6, i: 66539, n: "Bowl of Prickly Pear Sorbet", t: "Black cat with snowball.", p: {craft: true}},
	{u: 7, i: 38213, n: "Bowl of Ginger-Lime Ice Cream", t: "Black cat with snowball."},
	{u: 8, i: 38210, n: "Bowl of Saffron-Mango Ice Cream", t: "Black cat with snowball."},
	{u: 9, i: 38211, n: "Bowl of Peach Raspberry Swirl Ice Cream", t: "Black cat with snowball."},
	{u: 10, i: 24360, n: "Slab of Poultry Meat", t: "Black kitten at day."},
	{u: 12, i: 12213, n: "Cheeseburger", t: "Warrior black cat fights cat."},
	{u: 13, i: 20318, n: "Mystery Tonic (beast)", t: "Mesmer black cat fights cat.", p: {craft: true}},
	{u: 14, i: 8752, n: "Healing Seed Pod", t: "Ranger black cat with frog.", p: {coin: 40}},
	{u: 15, i: 72575, n: "Bowl of Curry Mussel Soup", t: "Guardian black cat fights cat.", p: {craft: true}},
	{u: 16, i: 8517, n: "Slice of Rainbow Cake", t: "Elementalist black cat fights cat.", p: {coin: 40}},
	{u: 17, i: 67371, n: "Flask of Pumpkin Oil", t: "Engineer black cat fights cat."},
	{u: 18, i: 12134, n: "Carrot", t: "Revenant black cat fights cat."},
	{u: 19, i: 8764, n: "Harpy Feathers", t: "Thief black cat fights cat.", p: {coin: 40}},
	{u: 20, i: 8535, n: "Grumble Cake", t: "Necromancer black cat fights cat."}
],
Orange: [
	{u: 3, i: 12148, n: "Spicy Flank Steak", t: "Orange cat near harvesting nodes."},
	{u: 4, i: 12429, n: "Spicier Flank Steak", t: "Orange cat near harvesting nodes."},
	{u: 5, i: 12466, n: "Plate of Fire Flank Steak", t: "Orange cat near harvesting nodes."},
	{u: 21, i: 12466, n: "Plate of Fire Flank Steak", t: "Stranded Skritt orange cat."},
	{u: 22, i: 12544, n: "Ghost Pepper", t: "Orange cat near harvesting nodes."},
	{u: 25, i: 80050, n: "Super-Hot Poultry and Leek Soup", t: "Orange cat by a Pot of Cat-Made Soup.", p: {achievement: 0}},
	{u: 26, i: 80060, n: "Super-Hot Poultry and Winter Vegetable Soup", t: "Orange cat by a Pot of Cat-Made Soup.", p: {achievement: 0}},
	{u: 27, i: 79988, n: "Super-Hot Lemongrass Poultry Soup", t: "Orange cat by a Pot of Cat-Made Soup.", p: {achievement: 0}},
	{u: 28, i: 80056, n: "Super-Hot Saffron-Scented Poultry Soup", t: "Orange cat by a Pot of Cat-Made Soup.", p: {achievement: 0}}
],
White: [
	{u: 1, i: 24360, n: "Slab of Poultry Meat", t: "Gray cat by entrance."},
	{u: 2, i: 12209, n: "Grilled Poultry", t: "Gray cat by entrance."},
	{u: 11, i: 24360, n: "Slab of Poultry Meat", t: "White kitten at night."}
],
Special: [
	{u: 23, i: 23763, n: "Frog in a Jar", t: "Feline familiar near Raw Candy Corn node.", p: {karma: 721}},
	{u: 24, i: 79842, n: "Koda's Breath", t: "Snow leopard cub following.", p: {achievement: 0}},
	{u: 29, i: 68409, n: "Bowl of Bloodstone Goulash", t: "Lady Wisteria Whiskington near Bloodstone Crystals.", p: {coin: 8}},
	{u: 30, i: 8055, n: "Unknown", t: "Bundle."},
	{u: 31, i: 8055, n: "Unknown", t: "Unused."},
	{u: 32, i: 36076, n: "Strawberry Ghost", t: "Ghost cat."}
]
};
