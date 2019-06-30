/*
 * This file is used by gw2timer.com/materials
 * Reordering of material categories.
 */

/*
 * Category translations.
 */
var GW2T_MATERIALS_HEADERS = {
	Basic: {name_en: "Basic Crafting Materials", name_de: "Einfache Handwerksmaterialien", name_es: "Materiales de artesanía básicos", name_fr: "Matériaux d'artisanat basiques", name_zh: "普通制作材料"},
	Intermediate: {name_en: "Intermediate Crafting Materials", name_de: "Gehobene Handwerksmaterialien", name_es: "Materiales de artesanía intermedios", name_fr: "Matériaux d'artisanat intermédiaires", name_zh: "中级制作材料"},
	Advanced: {name_en: "Advanced Crafting Materials", name_de: "Hochentwickelte Handwerksmaterialien", name_es: "Materiales de artesanía avanzados", name_fr: "Matériaux d'artisanat avancés", name_zh: "高级制作材料"},
	Ascended: {name_en: "Ascended Materials", name_de: "Aufgestiegene Materialien", name_es: "Materiales ascendidos", name_fr: "Matériaux élevés", name_zh: "升华材料"},
	Jewel: {name_en: "Gemstones and Jewels", name_de: "Edelsteine und Juwelen", name_es: "Gemas y joyas", name_fr: "Pierres précieuses et joyaux", name_zh: "宝石"},
	Cooking: {name_en: "Cooking Materials", name_de: "Zutaten zum Kochen", name_es: "Materiales de cocina", name_fr: "Matériaux de cuisine", name_zh: "烹饪材料"},
	Ingredients: {name_en: "Cooking Ingredients", name_de: "Kochzutaten", name_es: "Ingredientes de cocina", name_fr: "Ingrédients culinaires", name_zh: "烹饪食材"},
	Scribing: {name_en: "Scribing Materials", name_de: "Schreibmaterialien", name_es: "Materiales de escribanía", name_fr: "Matériaux d'illustration", name_zh: "抄写材料"},
	Festive: {name_en: "Festive Materials", name_de: "Festliche Materialien", name_es: "Materiales festivos", name_fr: "Matériaux de festival", name_zh: "节日材料"}
};
var GW2T_MATERIALS_METADATA = {
	CategoryAssoc: { // Associate the API's materials category ID number with the category variable name here
		"6": "Basic",
		"29": "Intermediate",
		"37": "Advanced",
		"46": "Ascended",
		"30": "Jewel",
		"5": "Cooking",
		"49": "Ingredients",
		"50": "Scribing",
		"38": "Festive"
	}
};

/*
 * Catalog of common items.
 * i: Item ID associated with that item
 */
var GW2T_MATERIALS_DATA = {
Basic: [19704,19679,19697,19718,19720,19792,19719,19738,19723,19710,19699,19683,19680,19739,19740,19789,19728,19733,19726,19713,19750,19688,19703,19741,19742,19794,19730,19734,19727,19714,19702,19686,19687,19743,19744,19793,19731,19736,19724,19711,19924,19681,19698,19748,19747,19791,19729,19735,19722,19709,19700,19684,19682,19745,19746,19790,19732,19737,19725,19712,19701,19685,62942,75075,74090,77256,76839,75241,71692,75270,71952,76799,75694,77112,75862,70426,74982,89140,89271],
Intermediate: [24290,24342,24346,24272,24352,24284,24296,24278,37897,44941,24291,24343,24347,24273,24353,24285,24297,24279,50025,71641,24292,24344,24348,24274,24354,24286,24298,24280,73034,71069,24293,24345,24349,24275,24355,24287,24363,24281,74328,74202,24294,24341,24350,24276,24356,24288,24299,24282,76254,70718,24295,24358,24351,24277,24357,24289,24300,24283,82582,83757,83103,83284,86269,86967,87153],
Advanced: [24326,24321,24336,24331,24301,24306,24311,24316,66930,68952,24327,24322,24337,24332,24302,24307,24312,24317,66929,69466,24328,24323,24338,24333,24303,24308,24313,24318,66931,68955,24329,24324,24339,24334,24304,24309,24314,24319,66932,68819,24330,24325,24340,24335,24305,24310,24315,24320,70842,68942,71428,38014,19675,19976,19721,19925,19663,19676,79418,77302,75857,38023,24366,19717,24370,66766,72205,74356,43772,66637,71049,38024,79280,79469,79899,80332,81127,81706,70851,66650,75015,73834,48884,49782,66933,66902,68944,73537,75322,67832,70820,71581,82678,83322,82796,86069,85828,86977,87645,88955,89537,90783,88485,89098,89141,89182,89103,89258,89216],
Ascended: [46731,46682,46733,46735,46742,46738,46745,46739,46744,46736,46730,46683,46732,46734,46681,46741,46740,46743,46747,76933,69434,69432,69392,73248,71994,73137,49424,46752,49523,46746,80714,80775,80723,80831,80743,80686,80791,80794,80763,80781,79230,86093,87528,79410,79445,79784,80380,81051,81961,82069,86120,87031,87711,88738,89947,90390],
Jewel: [24534,24464,24466,24500,24467,24465,24501,24469,24470,24468,24889,24471,24535,24527,24472,24507,24504,24526,24503,24506,24872,24870,24874,24871,24875,24873,24876,24519,24511,24509,24473,24521,24474,24475,24520,24512,24510,24515,24522,24508,24516,37907,42006,42010,43773,76491,72315,75654,74988,70957,72504,76179,72436,24884,24772,24773,24502,68063],
Cooking: [12134,12238,12147,12142,12135,12246,12255,12163,12165,12236,12240,12331,12258,12256,12232,12252,12249,12248,12141,12234,12138,12137,12159,12143,12152,24359,24360,12136,12158,12151,12153,12271,12324,12155,12157,12156,12253,12161,12327,12244,12243,12241,12162,12145,12251,12245,12247,12235,12237,12239,12250,12229,12332,12336,12341,12333,12334,12335,12342,12329,12330,12337,12340,12338,12328,12339,12325,12537,12532,12534,12531,12533,12536,12535,12538,12515,12350,12518,12351,12514,12516,12517,12512,12505,12511,12504,12508,12507,12254,12506,12510,12509,12144,12502,12503,12545,12544,12546,12128,12547,12543,36731,66524,66522,73113,74242,74266,73096,73504,81837,82991,82866,82806,84696,83195],
Ingredients: [12169,12166,12199,12206,12167,38216,12176,12496,12178,12267,12170,12263,12202,12268,12179,36052,12172,12519,12132,82527,82915],
Scribing: [76708,72579,76876,71724,71583,75570,76518,70926,72433,75762,70437,74852,72920,72022,75181,72349,72955,70454,73471,70647,75739,70714,71112,71938,72795,71171,70765,71146,70931,76146,76411,71702,72462,72497,71613,73964,72925,74768,72826,74763,71336,71136,75738,73186,72549,74877,76297,70489,74719,71473,74681,71148,77236,77131,73174,74860,73839,70933,72598,76453,82656,82118,84752,82523,84146,82428,82239,82996,82761],
Festive: [36041,47909,36060,48807,36061,48806,36059,48805,86601,86627,77651,38130,38131,38132,38133,38134,38135,43319,43320]
};