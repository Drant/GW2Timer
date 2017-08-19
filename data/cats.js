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
	Yellow: {name_en: "Yellow Cats", name_de: "Gelb", name_es: "Amarillo", name_fr: "Jaune", name_zh: "黄色"},
	White: {name_en: "White Cats", name_de: "Weiße", name_es: "Blanco", name_fr: "Blanc", name_zh: "白色"},
	Special: {name_en: "Special Cats", name_de: "Spezial", name_es: "Especial", name_fr: "Spéciales", name_zh: "特殊"}
};

/*
 * Associated finisher item with that finisher unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of item
 * l: Label over the slot
 * t: Text for tooltip comment
 */
var GW2T_CATS_DATA = {
Black: [
	{u: 6, i: 66539, n: "Bowl of Prickly Pear Sorbet", l: "#6", t: "Black cat with snowball.", p: {craft: true}},
	{u: 7, i: 38213, n: "Bowl of Ginger-Lime Ice Cream", l: "#7", t: "Black cat with snowball."},
	{u: 8, i: 38210, n: "Bowl of Saffron-Mango Ice Cream", l: "#8", t: "Black cat with snowball."},
	{u: 9, i: 38211, n: "Bowl of Peach Raspberry Swirl Ice Cream", l: "#9", t: "Black cat with snowball."},
	{u: 10, i: 24360, n: "Slab of Poultry Meat", l: "#10 ☀", t: "Black kitten at day."},
	{u: 12, i: 12213, n: "Cheeseburger", l: "#12", t: "Warrior black cat fights cat."},
	{u: 13, i: 20318, n: "Mystery Tonic (beast)", l: "#13", t: "Mesmer black cat fights cat.", p: {craft: true}},
	{u: 14, i: 8752, n: "Healing Seed Pod", l: "#14", t: "Ranger black cat with frog.", p: {coin: 40}},
	{u: 15, i: 72575, n: "Bowl of Curry Mussel Soup", l: "#15", t: "Guardian black cat fights cat.", p: {craft: true}},
	{u: 16, i: 8517, n: "Slice of Rainbow Cake", l: "#16", t: "Elementalist black cat fights cat.", p: {coin: 40}},
	{u: 17, i: 67371, n: "Flask of Pumpkin Oil", l: "#17", t: "Engineer black cat fights cat."},
	{u: 18, i: 12134, n: "Carrot", l: "#18", t: "Revenant black cat fights cat."},
	{u: 19, i: 8764, n: "Harpy Feathers (consumable)", l: "#19", t: "Thief black cat fights cat.", p: {coin: 40}},
	{u: 20, i: 8535, n: "Grumble Cake", l: "#20", t: "Necromancer black cat fights cat."}
],
Orange: [
	{u: 3, i: 12148, n: "Spicy Flank Steak", l: "#3", t: "Orange cat near harvesting nodes."},
	{u: 4, i: 12429, n: "Spicier Flank Steak", l: "#4", t: "Orange cat near harvesting nodes."},
	{u: 5, i: 12466, n: "Plate of Fire Flank Steak", l: "#5", t: "Orange cat near harvesting nodes."},
	{u: 21, i: 12466, n: "Plate of Fire Flank Steak", l: "#21", t: "Stranded Skritt orange cat."},
	{u: 22, i: 12544, n: "Ghost Pepper", l: "#22", t: "Orange cat near harvesting nodes."},
	{u: 25, i: 80050, n: "Super-Hot Poultry and Leek Soup", l: "#25", t: "Orange cat by a Pot of Cat-Made Soup.", p: {achievement: 0}},
	{u: 26, i: 80060, n: "Super-Hot Poultry and Winter Vegetable Soup", l: "#26", t: "Orange cat by a Pot of Cat-Made Soup.", p: {achievement: 0}},
	{u: 27, i: 79988, n: "Super-Hot Lemongrass Poultry Soup", l: "#27", t: "Orange cat by a Pot of Cat-Made Soup.", p: {achievement: 0}},
	{u: 28, i: 80056, n: "Super-Hot Saffron-Scented Poultry Soup", l: "#28", t: "Orange cat by a Pot of Cat-Made Soup.", p: {achievement: 0}}
],
Yellow: [
	{u: 33, i: 41909, n: "Cat (Pain Cliffs)", l: "#33", t: "Yellow striped cat with Super Adventure Box aura."}
],
White: [
	{u: 1, i: 24360, n: "Slab of Poultry Meat", l: "#1", t: "Gray cat by entrance."},
	{u: 2, i: 12209, n: "Grilled Poultry", l: "#2", t: "Gray cat by entrance."},
	{u: 11, i: 24360, n: "Slab of Poultry Meat", l: "#11 ☽", t: "White kitten at night."}
],
Special: [
	{u: 23, i: 23763, n: "Frog in a Jar", l: "#23", t: "Feline Familiar near Raw Candy Corn node.", p: {karma: 721}},
	{u: 24, i: 79842, n: "Koda's Flame", l: "#24", t: "Snow leopard cub following player.", p: {achievement: 0}},
	{u: 29, i: 68409, n: "Bowl of Bloodstone Goulash", l: "#29", t: "Lady Wisteria Whiskington near Bloodstone Crystal node.", p: {coin: 8}},
	{u: 32, i: 36076, n: "Strawberry Ghost", l: "#32 ☽", t: "Ghost cat."},
	{u: 35, i: 81743, n: "Cube of Stabilized Dark Energy", l: "#35", t: "Simon celestial cat."},
	{u: 36, i: 78473, n: "1 Gold", l: "#36", t: "Holographic cat."},
	{u: 37, i: 19678, n: "Gift of Battle", l: "#37", t: "Blue Catmander."},
	{u: 38, i: 78320, n: "Can of Spicy Meat Chili", l: "#38", t: "Yellow Catmander."}
]
};
