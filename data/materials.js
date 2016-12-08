/*
 * This file is used by http://gw2timer.com/catalog
 * Catalog of gizmos and consumables inventory items.
 */

/*
 * Category translations.
 */
var GW2T_MATERIALS_HEADERS = {
	Common: {name_en: "Common Crafting Materials", name_de: "Gewöhnliche Handwerksmaterialien", name_es: "Materiales de artesanía comunes", name_fr: "Matériaux d'artisanat courants", name_tw: "普通制作材料", name_zh: "普通制作材料"},
	Fine: {name_en: "Fine Crafting Materials", name_de: "Edle Handwerksmaterialien", name_es: "Materiales de artesanía selectos", name_fr: "Matériaux d'artisanat exquis", name_tw: "優質制作材料", name_zh: "优质制作材料"},
	Rare: {name_en: "Rare Crafting Materials", name_de: "Seltene Handwerksmaterialien", name_es: "Materiales de artesanía excepcionales", name_fr: "Matériaux d'artisanat rares", name_tw: "稀有制作材料", name_zh: "稀有制作材料"},
	Ascended: {name_en: "Ascended Materials", name_de: "Aufgestiegene Materialien", name_es: "Materiales ascendidos", name_fr: "Matériaux élevés", name_tw: "升華材料", name_zh: "升华材料"},
	Jewel: {name_en: "Gemstones and Jewels", name_de: "Edelsteine und Juwelen", name_es: "Gemas y joyas", name_fr: "Pierres précieuses et joyaux", name_tw: "寶石", name_zh: "宝石"},
	Cooking: {name_en: "Cooking Materials", name_de: "Zutaten zum Kochen", name_es: "Materiales de cocina", name_fr: "Matériaux de cuisine", name_tw: "烹飪材料", name_zh: "烹饪材料"},
	Festive: {name_en: "Festive Materials", name_de: "Festliche Materialien", name_es: "Materiales festivos", name_fr: "Matériaux de festival", name_tw: "節日材料", name_zh: "节日材料"}
};
var GW2T_MATERIALS_METADATA = {
	CategoryAssoc: { // Associate the API's materials category ID number with the category variable name here
		"6": "Common",
		"29": "Fine",
		"37": "Rare",
		"46": "Ascended",
		"30": "Jewel",
		"5": "Cooking",
		"38": "Festive"
	}
};

/*
 * Catalog of common items.
 * i: Item ID associated with that item
 */
var GW2T_MATERIALS_DATA = {
	Common: [19704,19679,19697,19718,19720,19792,19719,19738,19723,19710,19699,19683,19680,19739,19740,19789,19728,19733,19726,19713,19750,19688,19703,19741,19742,19794,19730,19734,19727,19714,19702,19686,19687,19743,19744,19793,19731,19736,19724,19711,19924,19681,19698,19748,19747,19791,19729,19735,19722,19709,19700,19684,19682,19745,19746,19790,19732,19737,19725,19712,19701,19685,62942,74090,77256,75241,71692,75270,71952,76799,75694,77112,75862,70426,74982],
	Fine: [24290,24342,24346,24272,24352,24284,24296,24278,24295,24358,24291,24343,24347,24273,24353,24285,24297,24279,24351,24277,24292,24344,24348,24274,24354,24286,24298,24280,24357,24289,24293,24345,24349,24275,24355,24287,24363,24281,24300,24283,24294,24341,24350,24276,24356,24288,24299,24282,37897,44941,73034,74328,74202,71641,71069],
	Rare: [24326,24321,24336,24331,24301,24306,24311,24316,24366,38014,24327,24322,24337,24332,24302,24307,24312,24317,19717,38023,24328,24323,24338,24333,24303,24308,24313,24318,24370,38024,24329,24324,24339,24334,24304,24309,24314,24319,19721,19925,24330,24325,24340,24335,24305,24310,24315,24320,19976,43772,48884,49782,66637,66650,67832,66930,66929,66931,66932,70842,68952,69466,68955,68819,68942,70851,75322,66933,70820,71581,19675,68944,73537,71428,75857,71049,75015],
	Ascended: [46731,46682,46733,46735,46742,46738,46745,46739,46744,46736,46730,46683,46732,46734,46681,46741,46740,46743,46747,76933,69434,69432,69392,73248,71994,73137],
	Jewel: [24534,24464,24466,24500,24467,24465,24501,24469,24470,24468,24889,24471,24535,24527,24472,24507,24504,24526,24503,24506,24872,24870,24874,24871,24875,24873,24876,24519,24511,24509,24473,24521,24474,24475,24520,24512,24510,24515,24522,24508,24516,37907,42006,42010,43773,76491,72315,75654,74988,70957,72504,76179,72436],
	Cooking: [12134,12238,12147,12142,12135,12246,12255,12163,12165,12236,12240,12331,12258,12256,12232,12252,12249,12248,12141,12234,12138,12137,12159,12143,12152,24359,24360,12136,12158,12151,12153,12271,12324,12155,12157,12156,12253,12161,12327,12244,12243,12241,12162,12145,12251,12245,12247,12235,12237,12239,12250,12229,12332,12336,12341,12333,12334,12335,12342,12329,12330,12337,12340,12338,12328,12339,12325,12537,12532,12534,12531,12533,12536,12535,12538,12515,12350,12518,12351,12514,12516,12517,12512,12505,12511,12504,12508,12507,12254,12506,12510,12509,12144,12502,12503,12545,12544,12546,12128,12547,12543,36731,66524,66522,73113,74242,74266,73096,73504],
	Festive: [36060,36061,36059,36041,38130,38131,38132,38133,38134,38135,43319,47909,48807,48805,48806,77651]
};