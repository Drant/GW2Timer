/*
 * This file is used by http://gw2timer.com/dyes
 * Cache association of the color to its proper dye and category.
 */

/*
 * Category translations.
 */
var GW2T_DYES_HEADERS = {
	Starter: {name_en: "Starter", name_de: "Anfangsfarben", name_es: "Principiante", name_fr: "Couleurs de départ"},
	Common: {name_en: "Common Dyes", name_de: "Gewöhnliche Farben", name_es: "Tintes comunes", name_fr: "Teintures communes"},
	Uncommon: {name_en: "Uncommon Dyes", name_de: "Ungewöhnliche Farben", name_es: "Tintes atípicos", name_fr: "Teintures peu communes"},
	Rare: {name_en: "Rare Dyes", name_de: "Seltene Farben", name_es: "Tintes excepcionales", name_fr: "Teintures rares"},
	Flame: {name_en: "Flame Dye Kit", name_de: "Flammen-Farbkit", name_es: "Kit de tintes de Llama", name_fr: "Kit de teintures Flamme"},
	Frost: {name_en: "Frost Dye Kit", name_de: "Frost-Farbkit", name_es: "Kit de tintes de Escarcha", name_fr: "Kit de teintures Givre"},
	Tequatl: {name_en: "Deathly Dye Kit", name_de: "Tödliches Farbkit", name_es: "Kit de tintes letales", name_fr: "Kit de teintures mortelles"},
	Tower: {name_en: "Toxic Dye Kit", name_de: "Toxisches Farbkit", name_es: "Kit de tintes tóxicos", name_fr: "Kit de teintures toxiques"},
	Merry: {name_en: "Metallurgic Dye Kit", name_de: "Metallurgisches Farbkit", name_es: "Kit de tintes metalúrgicos", name_fr: "Kit de teintures métallurgiques"},
	Aftermath: {name_en: "Lion's Arch Survivors Dye Kit", name_de: "Farbkit des Löwenstein-Überlebenden", name_es: "Kit de tintes de supervivientes de Arco del León", name_fr: "Kit de teintures des survivants de l'Arche du Lion"},
	Commemorative: {name_en: "Lion's Arch Commemorative Dye Kit", name_de: "Farbkit zum Andenken an Löwenstein", name_es: "Kit de tintes conmemorativos de Arco del León", name_fr: "Kit de teintures commémoratives de l'Arche du Lion"},
	Taimi: {name_en: "Taimi's Dye Kit", name_de: "Taimis Farbkit", name_es: "Kit de tintes de Taimi", name_fr: "Kit de teintures de Taimi"},
	Glint: {name_en: "Glint's Winter Dye Kit", name_de: "Glints Winter-Farbkit", name_es: "Kit de tintes de invierno de Glint", name_fr: "Kit de teintures hivernales de Brill"},
	Crimson: {name_en: "Crimson Lion Dye Kit", name_de: "Farbkit des Karmesinroten Löwen", name_es: "Kit de tintes de león carmesí", name_fr: "Kit de teintures du lion cramoisi"},
	Shadow: {name_en: "Shadow Dye Kit", name_de: "Schatten-Farbkit", name_es: "Kit de tintes sombríos", name_fr: "Kit de teintures de l'ombre"},
	Rebuild: {name_en: "Lion's Arch Rebuild Dye Kit", name_de: "Farbkit zum Wiederaufbau Löwensteins", name_es: "Kit de tintes de la reconstrucción de Arco del León", name_fr: "Kit de teintures de la reconstruction de l'Arche du Lion"},
	Mad: {name_en: "Mad King Dye Kit", name_de: "Farbkit des Verrückten Königs", name_es: "Kit de tintes del Rey Loco", name_fr: "Kit de teintures du Roi Dément"},
	Chimes: {name_en: "Winter Chimes Dye Kit", name_de: "Winterglocken-Farbkit", name_es: "Kit de tintes de campanitas invernales", name_fr: "Kit de teintures Carillons d'hiver"},
	Shift: {name_en: "Blue Shift Dye Kit", name_de: "Blauverschiebung-Farbkit", name_es: "Kit de tintes de corrimiento al azul", name_fr: "Kit de teintures Variation de bleu"}
};

/*
 * Associated dye item with that color unlockable.
 * Categories are based on the dye window in game, with additional categories
 * from the Black Lion dyes. Colors within categories are sorted by hue.
 * u: Unlockable ID (color ID)
 * i: Item ID associated with that color
 * n: Name of color
 */
var GW2T_DYES_DATA = {
	
};
