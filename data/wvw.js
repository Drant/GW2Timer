/*
 * This file is used by http://gw2timer.com/wvw
 * Contains Mists continent map lands (zone), realm (region), and WvW objectives.
 */

var GW2T_REALM_DATA = {
"pvp": {
	name_en: "Player vs. Player",
	name_de: "Spieler gegen Spieler",
	name_es: "Jugador contra Jugador",
	name_fr: "Joueur contre Joueur",
	name_zh: "PvP",
	color: "gray"
},
"wvw": {
	name_en: "World vs. World",
	name_de: "Welt gegen Welt",
	name_es: "Mundo contra Mundo",
	name_fr: "Monde contre Monde",
	name_zh: "世界之戰",
	color: "green"
},
"fotm": {
	name_en: "Fractals of the Mists",
	name_de: "Fraktale der Nebel",
	name_es: "Fractales de la Niebla",
	name_fr: "Fractales des Brumes",
	name_zh: "迷霧碎層",
	color: "blue"
}
};

/*
 * Lands are sorted by importance.
 */
var GW2T_LAND_DATA = {
"eternal": // south side
{
	id: "38",
	name_en: "Eternal Battlegrounds",
	name_de: "Ewige Schlachtfelder",
	name_es: "Campos de batalla eternos",
	name_fr: "Champs de bataille éternels",
	name_zh: "永恆戰場",
	region: "wvw",
	map_rect: [[-36864, -36864], [36864, 36864]],
	continent_rect: [[8958, 12798], [12030, 15870]]
},
"desertred": // north side
{
	id: "1099",
	name_en: "Red Borderlands",
	name_de: "Rot Grenzlande",
	name_es: "Tierras Fronterizas de rojo",
	name_fr: "Territoires frontaliers rouge",
	name_zh: "沙漠邊境之地紅色",
	region: "wvw",
	map_rect: [[-36864, -36864], [36864, 36864]],
	continent_rect: [[9214, 8958], [12286, 12030]]
},
"desertgreen": // east side
{
	id: "1102",
	name_en: "Green Borderlands",
	name_de: "Grün Grenzlande",
	name_es: "Tierras Fronterizas de verde",
	name_fr: "Territoires frontaliers vert",
	name_zh: "沙漠邊境之地綠色的",
	region: "wvw",
	map_rect: [[-36864, -36864], [36864, 36864]],
	continent_rect: [[5630, 11518], [8702, 14590]]
},
"desertblue": // west side
{
	id: "1143",
	name_en: "Blue Borderlands",
	name_de: "Blau Grenzlande",
	name_es: "Tierras Fronterizas de azul",
	name_fr: "Territoires frontaliers bleu",
	name_zh: "沙漠邊境之地藍色",
	region: "wvw",
	map_rect: [[-36864, -36864], [36864, 36864]],
	continent_rect: [[12798, 10878], [15870, 13950]]
},
"edge":
{
	id: "968",
	name_en: "Edge of the Mists",
	name_de: "Rand der Nebel",
	name_es: "El Borde de la Niebla",
	name_fr: "La lisière des Brumes",
	name_zh: "迷霧邊界",
	region: "wvw",
	map_rect: [[-36864, -36864], [36864, 36864]],
	continent_rect: [[5994, 8446], [9066, 11518]]
},
"fractals":
{
	id: "872",
	name_en: "Fractals of the Mists",
	name_de: "Fraktale der Nebel",
	name_es: "Fractales de la Niebla",
	name_fr: "Fractales des Brumes",
	name_zh: "迷霧碎層",
	region: "fotm",
	map_rect: [[-36864, -36864], [36864, 36864]],
	continent_rect: [[10880, 3328], [13952, 6400]]
},
"heart":
{
	id: "350",
	name_en: "Heart of the Mists",
	name_de: "Herz der Nebel",
	name_es: "Corazón de la Niebla",
	name_fr: "Cœur des Brumes",
	name_zh: "迷霧之心",
	region: "pvp",
	map_rect: [[-21504, -21504], [21504, 21504]],
	continent_rect: [[4865, 6398], [6657, 8190]]
},
"kyhlo":
{
	id: "549",
	name_en: "Battle of Kyhlo",
	name_de: "Die Schlacht von Kyhlo",
	name_es: "La Batalla de Kyhlo",
	name_fr: "Bataille de Kyhlo",
	name_zh: "凱洛城之戰",
	region: "pvp",
	map_rect: [[-9216, -9216], [9216, 9216]],
	continent_rect: [[3326, 5374], [4094, 6142]]
},
"niflhel":
{
	id: "554",
	name_en: "Forest of Niflhel",
	name_de: "Der Wald von Niflhel",
	name_es: "Bosque de Niflhel",
	name_fr: "Forêt de Niflhel",
	name_zh: "尼菲爾森林",
	region: "pvp",
	map_rect: [[-12288, -6144], [12288, 9216]],
	continent_rect: [[7038, 4860], [8062, 5500]]
},
"foefire":
{
	id: "795",
	name_en: "Legacy of the Foefire",
	name_de: "Vermächtnis des Feindfeuers",
	name_es: "El Legado del Fuego Enemigo",
	name_fr: "Héritage du Fléau de feu",
	name_zh: "煉獄的遺產",
	region: "pvp",
	map_rect: [[-9216, -12288], [12288, 15360]],
	continent_rect: [[2558, 8190], [3454, 9342]]
},
"storm":
{
	id: "875",
	name_en: "Temple of the Silent Storm",
	name_de: "Tempel des stillen Sturms",
	name_es: "Templo de la Tormenta Silenciosa",
	name_fr: "Temple de la Tempête silencieuse",
	name_zh: "靜風神殿",
	region: "pvp",
	map_rect: [[-12288, -6144], [12288, 9216]],
	continent_rect: [[4096, 9344], [5120, 9984]]
},
"spirit":
{
	id: "894",
	name_en: "Spirit Watch",
	name_de: "Geisterwacht",
	name_es: "Vigilancia del Espíritu",
	name_fr: "Observatoire des Esprits",
	name_zh: "眾靈守望",
	region: "pvp",
	map_rect: [[-12288, -12288], [12288, 12288]],
	continent_rect: [[1920, 5248], [2944, 6272]]
},
"skyhammer":
{
	id: "900",
	name_en: "Skyhammer",
	name_de: "Hammer des Himmels",
	name_es: "Martillo Celestial",
	name_fr: "Marteau céleste",
	name_zh: "天空巨錘",
	region: "pvp",
	map_rect: [[-12288, -6144], [12288, 9216]],
	continent_rect: [[7168, 7422], [8192, 8062]]
},
"courtyard":
{
	id: "984",
	name_en: "Courtyard",
	name_de: "Hof",
	name_es: "Patio",
	name_fr: "Cour",
	name_zh: "庭院",
	region: "pvp",
	map_rect: [[-12288, -12288], [12288, 12288]],
	continent_rect: [[2048, 7040], [3072, 8064]]
},
"champion":
{
	id: "1011",
	name_en: "Battle of Champion's Dusk",
	name_de: "Die Schlacht von Champions Dämmerung",
	name_es: "Batalla del Crepúsculo del Campeón",
	name_fr: "Bataille du crépuscule du Champion",
	name_zh: "末日英雄之战",
	region: "pvp",
	map_rect: [[-12288, -6144], [12288, 9216]],
	continent_rect: [[8448, 7680], [9472, 8320]]
}
};

/*
 * Server translated names for selecting.
 */
var GW2T_SERVER_DATA = {
"1001": {
	id: 1001,
	name_en: "Anvil Rock",
	name_de: "Rocher de l'enclume",
	name_es: "Amboss-Stein",
	name_fr: "Roca del Yunque",
	name_zh: "鐵砧石"
},
"1002": {
	id: 1002,
	name_en: "Borlis Pass",
	name_de: "Passage de Borlis",
	name_es: "Borlis-Pass",
	name_fr: "Paso de Borlis",
	name_zh: "波裡斯小徑"
},
"1003": {
	id: 1003,
	name_en: "Yak's Bend",
	name_de: "Courbe du Yak",
	name_es: "Yakbiegung",
	name_fr: "Declive del Yak",
	name_zh: "牦牛拐角"
},
"1004": {
	id: 1004,
	name_en: "Henge of Denravi",
	name_de: "Cromlech de Denravi",
	name_es: "Steinkreis von Denravi",
	name_fr: "Círculo de Denravi",
	name_zh: "德拉維石陣"
},
"1005": {
	id: 1005,
	name_en: "Maguuma",
	name_de: "Maguuma",
	name_es: "Maguuma",
	name_fr: "Maguuma",
	name_zh: "邁古瑪"
},
"1006": {
	id: 1006,
	name_en: "Sorrow's Furnace",
	name_de: "Fourneau des lamentations",
	name_es: "Hochofen der Betrübnis",
	name_fr: "Fragua del Pesar",
	name_zh: "悲傷熔爐"
},
"1007": {
	id: 1007,
	name_en: "Gate of Madness",
	name_de: "Porte de la folie",
	name_es: "Tor des Wahnsinns",
	name_fr: "Puerta de la Locura",
	name_zh: "瘋狂之門"
},
"1008": {
	id: 1008,
	name_en: "Jade Quarry",
	name_de: "Carrière de jade",
	name_es: "Jade-Steinbruch",
	name_fr: "Cantera de Jade",
	name_zh: "翠玉礦洞"
},
"1009": {
	id: 1009,
	name_en: "Fort Aspenwood",
	name_de: "Fort Trembleforêt",
	name_es: "Fort Espenwald",
	name_fr: "Fuerte Aspenwood",
	name_zh: "白楊堡壘"
},
"1010": {
	id: 1010,
	name_en: "Ehmry Bay",
	name_de: "Baie d'Ehmry",
	name_es: "Ehmry-Bucht",
	name_fr: "Bahía de Ehmry",
	name_zh: "艾瑪海灣"
},
"1011": {
	id: 1011,
	name_en: "Stormbluff Isle",
	name_de: "Ile de la Falaise tumultueuse",
	name_es: "Sturmklippen-Insel",
	name_fr: "Isla Cimatormenta",
	name_zh: "暴風崖島"
},
"1012": {
	id: 1012,
	name_en: "Darkhaven",
	name_de: "Refuge noir",
	name_es: "Finsterfreistatt",
	name_fr: "Refugio Oscuro",
	name_zh: "暗黑庇護所"
},
"1013": {
	id: 1013,
	name_en: "Sanctum of Rall",
	name_de: "Sanctuaire de Rall",
	name_es: "Heilige Halle von Rall",
	name_fr: "Sagrario de Rall",
	name_zh: "羅爾聖所"
},
"1014": {
	id: 1014,
	name_en: "Crystal Desert",
	name_de: "Désert de cristal",
	name_es: "Kristallwüste",
	name_fr: "Desierto de Cristal",
	name_zh: "水晶沙漠"
},
"1015": {
	id: 1015,
	name_en: "Isle of Janthir",
	name_de: "Ile de Janthir",
	name_es: "Janthir-Insel",
	name_fr: "Isla de Janthir",
	name_zh: "珍瑟之島"
},
"1016": {
	id: 1016,
	name_en: "Sea of Sorrows",
	name_de: "Mer des lamentations",
	name_es: "Meer des Leids",
	name_fr: "Mar de los Pesares",
	name_zh: "悲傷之海"
},
"1017": {
	id: 1017,
	name_en: "Tarnished Coast",
	name_de: "Côte ternie",
	name_es: "Befleckte Küste",
	name_fr: "Costa de Bronce",
	name_zh: "晦暗海岸"
},
"1018": {
	id: 1018,
	name_en: "Northern Shiverpeaks",
	name_de: "Cimefroides nordiques",
	name_es: "Nördliche Zittergipfel",
	name_fr: "Picosescalofriantes del Norte",
	name_zh: "北席瓦雪山"
},
"1019": {
	id: 1019,
	name_en: "Blackgate",
	name_de: "Portenoire",
	name_es: "Schwarztor",
	name_fr: "Puertanegra",
	name_zh: "黑暗之門"
},
"1020": {
	id: 1020,
	name_en: "Ferguson's Crossing",
	name_de: "Croisée de Ferguson",
	name_es: "Fergusons Kreuzung",
	name_fr: "Encrucijada de Ferguson",
	name_zh: "弗格森渡口"
},
"1021": {
	id: 1021,
	name_en: "Dragonbrand",
	name_de: "Stigmate du dragon",
	name_es: "Drachenbrand",
	name_fr: "Marca del Dragón",
	name_zh: "烙印之地"
},
"1022": {
	id: 1022,
	name_en: "Kaineng",
	name_de: "Kaineng",
	name_es: "Kaineng",
	name_fr: "Kaineng",
	name_zh: "凱寧"
},
"1023": {
	id: 1023,
	name_en: "Devona's Rest",
	name_de: "Repos de Devona",
	name_es: "Devonas Ruh",
	name_fr: "Descanso de Devona",
	name_zh: "德佛娜之眠"
},
"1024": {
	id: 1024,
	name_en: "Eredon Terrace",
	name_de: "Plateau d'Eredon",
	name_es: "Eredon-Terrasse",
	name_fr: "Terraza de Eredon",
	name_zh: "伊雷登平台"
},
"2001": {
	id: 2001,
	name_en: "Fissure of Woe",
	name_de: "Fissure du malheur",
	name_es: "Riss des Kummers",
	name_fr: "Fisura de la Aflicción",
	name_zh: "悲嘆縫隙"
},
"2002": {
	id: 2002,
	name_en: "Desolation",
	name_de: "Désolation",
	name_es: "Ödnis",
	name_fr: "Desolación",
	name_zh: "荒蕪廢墟"
},
"2003": {
	id: 2003,
	name_en: "Gandara",
	name_de: "Gandara",
	name_es: "Gandara",
	name_fr: "Gandara",
	name_zh: "甘達拉"
},
"2004": {
	id: 2004,
	name_en: "Blacktide",
	name_de: "Noirflot",
	name_es: "Schwarzwasser",
	name_fr: "Marea Negra",
	name_zh: "黑潮"
},
"2005": {
	id: 2005,
	name_en: "Ring of Fire",
	name_de: "Cercle de feu",
	name_es: "Feuerring",
	name_fr: "Anillo de fuego",
	name_zh: "火焰之環"
},
"2006": {
	id: 2006,
	name_en: "Underworld",
	name_de: "Outre-monde",
	name_es: "Unterwelt",
	name_fr: "Inframundo",
	name_zh: "地下世界"
},
"2007": {
	id: 2007,
	name_en: "Far Shiverpeaks",
	name_de: "Lointaines Cimefroides",
	name_es: "Ferne Zittergipfel",
	name_fr: "Lejanas Picosescalofriantes",
	name_zh: "席瓦雪山遠境"
},
"2008": {
	id: 2008,
	name_en: "Whiteside Ridge",
	name_de: "Crête de Verseblanc",
	name_es: "Weißflankgrat",
	name_fr: "Cadena Laderablanca",
	name_zh: "白際山脊"
},
"2009": {
	id: 2009,
	name_en: "Ruins of Surmia",
	name_de: "Ruines de Surmia",
	name_es: "Ruinen von Surmia",
	name_fr: "Ruinas de Surmia",
	name_zh: "瑟米亞廢墟"
},
"2010": {
	id: 2010,
	name_en: "Seafarer's Rest",
	name_de: "Repos du Marin",
	name_es: "Seemannsruh",
	name_fr: "Refugio del Viajante",
	name_zh: "航海者之寧"
},
"2011": {
	id: 2011,
	name_en: "Vabbi",
	name_de: "Vabbi",
	name_es: "Vaabi",
	name_fr: "Vabbi",
	name_zh: "瓦比"
},
"2012": {
	id: 2012,
	name_en: "Piken Square",
	name_de: "Place Piken",
	name_es: "Piken-Platz",
	name_fr: "Plaza de Piken",
	name_zh: "派肯廣場"
},
"2013": {
	id: 2013,
	name_en: "Aurora Glade",
	name_de: "Clairière de l'aurore",
	name_es: "Auroralichtung",
	name_fr: "Claro de la Aurora",
	name_zh: "曙光林地"
},
"2014": {
	id: 2014,
	name_en: "Gunnar's Hold",
	name_de: "Campement de Gunnar",
	name_es: "Gunnars Feste",
	name_fr: "Fuerte de Gunnar",
	name_zh: "納爾要塞"
},
"2101": {
	id: 2101,
	name_en: "Jade Sea [FR]",
	name_de: "Mer de Jade [FR]",
	name_es: "Jademeer [FR]",
	name_fr: "Mar de Jade [FR]",
	name_zh: "翠玉之海[ FR ]"
},
"2102": {
	id: 2102,
	name_en: "Fort Ranik [FR]",
	name_de: "Fort Ranik [FR]",
	name_es: "Fort Ranik [FR]",
	name_fr: "Fuerte Ranik [FR]",
	name_zh: "拉尼克堡[ FR ]"
},
"2103": {
	id: 2103,
	name_en: "Augury Rock [FR]",
	name_de: "Roche de l'Augure [FR]",
	name_es: "Fels der Weissagung [FR]",
	name_fr: "Roca del Augurio [FR]",
	name_zh: "預言之石[ FR ]"
},
"2104": {
	id: 2104,
	name_en: "Vizunah Square [FR]",
	name_de: "Place de Vizunah [FR]",
	name_es: "Vizunah-Platz [FR]",
	name_fr: "Plaza de Vizunah [FR]",
	name_zh: "薇茹廣場[ FR ]"
},
"2105": {
	id: 2105,
	name_en: "Arborstone [FR]",
	name_de: "Pierre Arborea [FR]",
	name_es: "Arborstein [FR]",
	name_fr: "Piedra Arbórea [FR]",
	name_zh: "亞博之石 [ FR ]"
},
"2201": {
	id: 2201,
	name_en: "Kodash [DE]",
	name_de: "Kodash [DE]",
	name_es: "Kodasch [DE]",
	name_fr: "Kodash [DE]",
	name_zh: "聖潔之石 [ DE ]"
},
"2202": {
	id: 2202,
	name_en: "Riverside [DE]",
	name_de: "Provinces fluviales [DE]",
	name_es: "Flussufer [DE]",
	name_fr: "Ribera [DE]",
	name_zh: "河畔[ DE ]"
},
"2203": {
	id: 2203,
	name_en: "Elona Reach [DE]",
	name_de: "Bief d'Elona [DE]",
	name_es: "Elonaspitze [DE]",
	name_fr: "Cañón de Elona [DE]",
	name_zh: "伊倫娜海岸[ DE ]"
},
"2204": {
	id: 2204,
	name_en: "Abaddon's Mouth [DE]",
	name_de: "Bouche d'Abaddon [DE]",
	name_es: "Abaddons Maul [DE]",
	name_fr: "Boca de Abaddon [DE]",
	name_zh: "阿伯頓之口[ DE ]"
},
"2205": {
	id: 2205,
	name_en: "Drakkar Lake [DE]",
	name_de: "Lac Drakkar [DE]",
	name_es: "Drakkar-See [DE]",
	name_fr: "Lago Drakkar [DE]",
	name_zh: "德拉克湖[ DE ]"
},
"2206": {
	id: 2206,
	name_en: "Miller's Sound [DE]",
	name_de: "Détroit de Miller [DE]",
	name_es: "Millersund [DE]",
	name_fr: "Estrecho de Miller [DE]",
	name_zh: "米勒之聲[ DE ]"
},
"2207": {
	id: 2207,
	name_en: "Dzagonur [DE]",
	name_de: "Dzagonur [DE]",
	name_es: "Dzagonur [DE]",
	name_fr: "Dzagonur [DE]",
	name_zh: "扎格諾[ DE ]"
},
"2301": {
	id: 2301,
	name_en: "Baruch Bay [SP]",
	name_de: "Baie de Baruch [SP]",
	name_es: "Baruch-Bucht [ES]",
	name_fr: "Bahía de Baruch [ES]",
	name_zh: "巴魯克海灣[ SP ]"
}
};

/*
 * Objectives in WvW capturable map locations.
 */
var GW2T_OBJECTIVE_DATA = {
"38-1": {
	map_type: "Center",
	type: "Keep",
	name_en: "Overlook",
	name_de: "Aussichtspunkt von",
	name_es: "Mirador",
	name_fr: "Belvédère",
	name_zh: "眺望台",
	id: "38-1",
	map_id: "38",
	coord: [10764, 13656]
},
"38-2": {
	map_type: "Center",
	type: "Keep",
	name_en: "Valley",
	name_de: "Tal von",
	name_es: "Valle",
	name_fr: "Vallée",
	name_zh: "溪谷",
	id: "38-2",
	map_id: "38",
	coord: [11490, 15122]
},
"38-3": {
	map_type: "Center",
	type: "Keep",
	name_en: "Lowlands",
	name_de: "Tiefland von",
	name_es: "Tierras bajas",
	name_fr: "Basses terres",
	name_zh: "低地",
	id: "38-3",
	map_id: "38",
	coord: [9604, 15130]
},
"38-4": {
	map_type: "Center",
	type: "Camp",
	name_en: "Golanta Clearing",
	name_de: "Golanta-Lichtung",
	name_es: "Claro Golanta",
	name_fr: "Clairière de Golanta",
	name_zh: "格蘭塔空地",
	id: "38-4",
	map_id: "38",
	coord: [10203, 15437]
},
"38-5": {
	map_type: "Center",
	type: "Camp",
	name_en: "Pangloss Rise",
	name_de: "Pangloss-Anhöhe",
	name_es: "Colina Pangloss",
	name_fr: "Montée de Pangloss",
	name_zh: "潘樂高地",
	id: "38-5",
	map_id: "38",
	coord: [11280, 13737]
},
"38-6": {
	map_type: "Center",
	type: "Camp",
	name_en: "Speldan Clearcut",
	name_de: "Speldan-Kahlschlag",
	name_es: "Claro Espeldia",
	name_fr: "Forêt rasée de Speldan",
	name_zh: "斯佩爾丹營地",
	id: "38-6",
	map_id: "38",
	coord: [9841, 13546]
},
"38-7": {
	map_type: "Center",
	type: "Camp",
	name_en: "Danelon Passage",
	name_de: "Danelon-Passage",
	name_es: "Pasaje Danelon",
	name_fr: "Passage Danelon",
	name_zh: "丹隆之廊",
	id: "38-7",
	map_id: "38",
	coord: [11038, 15556]
},
"38-8": {
	map_type: "Center",
	type: "Camp",
	name_en: "Umberglade Woods",
	name_de: "Umberlichtung-Forst",
	name_es: "Bosques Clarosombra",
	name_fr: "Bois d'Ombreclair",
	name_zh: "褐沼樹林",
	id: "38-8",
	map_id: "38",
	coord: [11562, 14470]
},
"38-9": {
	map_type: "Center",
	type: "Castle",
	name_en: "Stonemist Castle",
	name_de: "Schloss Steinnebel",
	name_es: "Castillo Piedraniebla",
	name_fr: "Château Brumepierre",
	name_zh: "石雲堡",
	id: "38-9",
	map_id: "38",
	coord: [10606, 14576]
},
"38-10": {
	map_type: "Center",
	type: "Camp",
	name_en: "Rogue's Quarry",
	name_de: "Schurkenbruch",
	name_es: "Cantera del Pícaro",
	name_fr: "Carrière du voleur",
	name_zh: "盜賊採石場",
	id: "38-10",
	map_id: "38",
	coord: [9571, 14423]
},
"38-11": {
	map_type: "Center",
	type: "Tower",
	name_en: "Aldon's Ledge",
	name_de: "Aldons Vorsprung",
	name_es: "Cornisa de Aldon",
	name_fr: "Corniche d'Aldon",
	name_zh: "阿爾丹暗礁",
	id: "38-11",
	map_id: "38",
	coord: [9414, 14793]
},
"38-12": {
	map_type: "Center",
	type: "Tower",
	name_en: "Wildcreek Run",
	name_de: "Wildbach-Strecke",
	name_es: "Pista Arroyosalvaje",
	name_fr: "Piste du ruisseau sauvage",
	name_zh: "野溪急道",
	id: "38-12",
	map_id: "38",
	coord: [9906, 14625]
},
"38-13": {
	map_type: "Center",
	type: "Tower",
	name_en: "Jerrifer's Slough",
	name_de: "Jerrifers Sumpfloch",
	name_es: "Cenagal de Jerrifer",
	name_fr: "Bourbier de Jerrifer",
	name_zh: "杰裡弗泥潭",
	id: "38-13",
	map_id: "38",
	coord: [9806, 15406]
},
"38-14": {
	map_type: "Center",
	type: "Tower",
	name_en: "Klovan Gully",
	name_de: "Klovan-Senke",
	name_es: "Barranco Klovan",
	name_fr: "Petit ravin de Klovan",
	name_zh: "科洛文水渠",
	id: "38-14",
	map_id: "38",
	coord: [10172, 15082]
},
"38-15": {
	map_type: "Center",
	type: "Tower",
	name_en: "Langor Gulch",
	name_de: "Langor-Schlucht",
	name_es: "Barranco Langor",
	name_fr: "Ravin de Langor",
	name_zh: "朗格爾峽谷",
	id: "38-15",
	map_id: "38",
	coord: [11453, 15491]
},
"38-16": {
	map_type: "Center",
	type: "Tower",
	name_en: "Quentin Lake",
	name_de: "Quentin-See",
	name_es: "Lago Quentin",
	name_fr: "Lac Quentin",
	name_zh: "昆汀湖",
	id: "38-16",
	map_id: "38",
	coord: [10850, 15224]
},
"38-17": {
	map_type: "Center",
	type: "Tower",
	name_en: "Mendon's Gap",
	name_de: "Mendons Spalt",
	name_es: "Zanja de Mendon",
	name_fr: "Faille de Mendon",
	name_zh: "曼敦峽谷",
	id: "38-17",
	map_id: "38",
	coord: [10257, 13514]
},
"38-18": {
	map_type: "Center",
	type: "Tower",
	name_en: "Anzalias Pass",
	name_de: "Anzalias-Pass",
	name_es: "Paso Anzalias",
	name_fr: "Col d'Anzalias",
	name_zh: "真語小徑",
	id: "38-18",
	map_id: "38",
	coord: [10189, 14082]
},
"38-19": {
	map_type: "Center",
	type: "Tower",
	name_en: "Ogrewatch Cut",
	name_de: "Ogerwacht-Kanal",
	name_es: "Tajo de la Guardia del Ogro",
	name_fr: "Percée de Gardogre",
	name_zh: "食人魔山路",
	id: "38-19",
	map_id: "38",
	coord: [11011, 13850]
},
"38-20": {
	map_type: "Center",
	type: "Tower",
	name_en: "Veloka Slope",
	name_de: "Veloka-Hang",
	name_es: "Pendiente Veloka",
	name_fr: "Flanc de Veloka",
	name_zh: "維羅卡斜坡",
	id: "38-20",
	map_id: "38",
	coord: [11090, 13488]
},
"38-21": {
	map_type: "Center",
	type: "Tower",
	name_en: "Durios Gulch",
	name_de: "Durios-Schlucht",
	name_es: "Barranco Durios",
	name_fr: "Ravin de Durios",
	name_zh: "德裡尤斯峽谷",
	id: "38-21",
	map_id: "38",
	coord: [11156, 14528]
},
"38-22": {
	map_type: "Center",
	type: "Tower",
	name_en: "Bravost Escarpment",
	name_de: "Bravost-Abhang",
	name_es: "Escarpadura Bravost",
	name_fr: "Falaise de Bravost",
	name_zh: "斗膽懸崖",
	id: "38-22",
	map_id: "38",
	coord: [11766, 14794]
},
"1099-99": {
	map_type: "RedHome",
	type: "Camp",
	name_en: "Hamm's Lab",
	name_de: "Hamms Labor",
	name_es: "Laboratorio de Hamm",
	name_fr: "Laboratoire de Hamm",
	name_zh: "漢姆的實驗室",
	id: "1099-99",
	map_id: "1099",
	coord: [10743, 9482]
},
"1099-100": {
	map_type: "RedHome",
	type: "Camp",
	name_en: "Bauer Farmstead",
	name_de: "Bauer-Gehöft",
	name_es: "Hacienda de Bauer",
	name_fr: "Ferme Bauer",
	name_zh: "鮑爾的農場",
	id: "1099-100",
	map_id: "1099",
	coord: [11889, 11291]
},
"1099-101": {
	map_type: "RedHome",
	type: "Camp",
	name_en: "McLain's Encampment",
	name_de: "McLains Lager",
	name_es: "Campamento de McLain",
	name_fr: "Campement de McLain",
	name_zh: "麥克萊恩的營地",
	id: "1099-101",
	map_id: "1099",
	coord: [9584, 11295]
},
"1099-102": {
	map_type: "RedHome",
	type: "Tower",
	name_en: "O'del Academy",
	name_de: "O'del-Akademie",
	name_es: "Academia O'del",
	name_fr: "Académie de O'del",
	name_zh: "歐黛學院",
	id: "1099-102",
	map_id: "1099",
	coord: [9832, 9508]
},
"1099-104": {
	map_type: "RedHome",
	type: "Tower",
	name_en: "Eternal Necropolis",
	name_de: "Ewige Nekropole",
	name_es: "Necrópolis Eterna",
	name_fr: "Nécropole éternelle",
	name_zh: "永恆魂都",
	id: "1099-104",
	map_id: "1099",
	coord: [11739, 9654]
},
"1099-105": {
	map_type: "RedHome",
	type: "Tower",
	name_en: "Crankshaft Depot",
	name_de: "Kurbelwellen-Depot",
	name_es: "Depósito de Palancamanijas",
	name_fr: "Dépôt Vilebrequin",
	name_zh: "機軸補給站",
	id: "1099-105",
	map_id: "1099",
	coord: [11257, 11551]
},
"1099-106": {
	map_type: "RedHome",
	type: "Keep",
	name_en: "Blistering Undercroft",
	name_de: "Brennende Gruft",
	name_es: "Sótano Achicharrante",
	name_fr: "Crypte embrasée",
	name_zh: "沸騰墓穴",
	id: "1099-106",
	map_id: "1099",
	coord: [9328, 10634]
},
"1099-109": {
	map_type: "RedHome",
	type: "Camp",
	name_en: "Roy's Refuge",
	name_de: "Roys Zuflucht",
	name_es: "Refugio de Roy",
	name_fr: "Refuge de Roy",
	name_zh: "羅伊的避難所",
	id: "1099-109",
	map_id: "1099",
	coord: [12100, 10019]
},
"1099-110": {
	map_type: "RedHome",
	type: "Tower",
	name_en: "Parched Outpost",
	name_de: "Verdörrter Außenposten",
	name_es: "Puesto Avanzado Abrasado",
	name_fr: "Avant-poste dévasté",
	name_zh: "焦枯前哨",
	id: "1099-110",
	map_id: "1099",
	coord: [10244, 11331]
},
"1099-113": {
	map_type: "RedHome",
	type: "Keep",
	name_en: "Stoic Rampart",
	name_de: "Stoischer Festungswall",
	name_es: "Muralla Estoica",
	name_fr: "Rempart stoïque",
	name_zh: "堅忍壁壘",
	id: "1099-113",
	map_id: "1099",
	coord: [10777, 10120]
},
"1099-114": {
	map_type: "RedHome",
	type: "Keep",
	name_en: "Osprey's Palace",
	name_de: "Fischadler-Palast",
	name_es: "Palacio del Águila Pescadora",
	name_fr: "Palais du balbuzard",
	name_zh: "魚鷹宮殿",
	id: "1099-114",
	map_id: "1099",
	coord: [12203, 10706]
},
"1099-115": {
	map_type: "RedHome",
	type: "Camp",
	name_en: "Boettiger's Hideaway",
	name_de: "Boettigers Versteck",
	name_es: "Escondrijo de Boettiger",
	name_fr: "Antre de Boettiger",
	name_zh: "波提加的藏匿點",
	id: "1099-115",
	map_id: "1099",
	coord: [9313, 9994]
},
"1099-116": {
	map_type: "RedHome",
	type: "Camp",
	name_en: "Dustwhisper Well",
	name_de: "Brunnen des Staubflüsterns",
	name_es: "Pozo del Murmullo de Polvo",
	name_fr: "Puits du Souffle-poussière",
	name_zh: "塵語之井",
	id: "1099-116",
	map_id: "1099",
	coord: [10747, 11854]
},
"1102-99": {
	map_type: "GreenHome",
	type: "Camp",
	name_en: "Lesh's Lab",
	name_de: "Leshs Labor",
	name_es: "Laboratorio de Lesh",
	name_fr: "Laboratoire de Lesh",
	name_zh: "萊希的實驗室",
	id: "1102-99",
	map_id: "1102",
	coord: [7159, 12042]
},
"1102-100": {
	map_type: "GreenHome",
	type: "Camp",
	name_en: "Barrett Farmstead",
	name_de: "Barrett-Gehöft",
	name_es: "Hacienda de Barrett",
	name_fr: "Ferme Barrett",
	name_zh: "巴裡特的農場",
	id: "1102-100",
	map_id: "1102",
	coord: [8305, 13851]
},
"1102-101": {
	map_type: "GreenHome",
	type: "Camp",
	name_en: "Patrick's Encampment",
	name_de: "Patricks Lager",
	name_es: "Campamento de Patrick",
	name_fr: "Campement de Patrick",
	name_zh: "帕特裡克的營地",
	id: "1102-101",
	map_id: "1102",
	coord: [6000, 13855]
},
"1102-102": {
	map_type: "GreenHome",
	type: "Tower",
	name_en: "Y'lan Academy",
	name_de: "Y'lan-Akademie",
	name_es: "Academia Y'lan",
	name_fr: "Académie de Y'lan",
	name_zh: "依蘭學院",
	id: "1102-102",
	map_id: "1102",
	coord: [6248, 12068]
},
"1102-104": {
	map_type: "GreenHome",
	type: "Tower",
	name_en: "Deathless Necropolis",
	name_de: "Todlose Nekropole",
	name_es: "Necrópolis Inmortal",
	name_fr: "Nécropole immortelle",
	name_zh: "不死魂都",
	id: "1102-104",
	map_id: "1102",
	coord: [8155, 12214]
},
"1102-105": {
	map_type: "GreenHome",
	type: "Tower",
	name_en: "Sparkplug Depot",
	name_de: "Zündfunken-Depot",
	name_es: "Depósito de Bujías",
	name_fr: "Dépôt Bougie",
	name_zh: "火塞補給站",
	id: "1102-105",
	map_id: "1102",
	coord: [7673, 14111]
},
"1102-106": {
	map_type: "GreenHome",
	type: "Keep",
	name_en: "Scorching Undercroft",
	name_de: "Versengende Gruft",
	name_es: "Sótano Abrasador",
	name_fr: "Crypte cuisante",
	name_zh: "焦熱墓穴",
	id: "1102-106",
	map_id: "1102",
	coord: [5744, 13194]
},
"1102-109": {
	map_type: "GreenHome",
	type: "Camp",
	name_en: "Norfolk's Refuge",
	name_de: "Norfolks Zuflucht",
	name_es: "Refugio de Norfolk",
	name_fr: "Refuge de Norfolk",
	name_zh: "諾弗克的避難所",
	id: "1102-109",
	map_id: "1102",
	coord: [8516, 12579]
},
"1102-110": {
	map_type: "GreenHome",
	type: "Tower",
	name_en: "Withered Outpost",
	name_de: "Welker Außenposten",
	name_es: "Puesto Avanzado Desolado",
	name_fr: "Avant-poste ravagé",
	name_zh: "凋零前哨",
	id: "1102-110",
	map_id: "1102",
	coord: [6660, 13891]
},
"1102-113": {
	map_type: "GreenHome",
	type: "Keep",
	name_en: "Impassive Rampart",
	name_de: "Unbeeindruckter Festungswall",
	name_es: "Muralla Imperturbable",
	name_fr: "Rempart impassible",
	name_zh: "無情壁壘",
	id: "1102-113",
	map_id: "1102",
	coord: [7193, 12680]
},
"1102-114": {
	map_type: "GreenHome",
	type: "Keep",
	name_en: "Harrier's Palace",
	name_de: "Weihen-Palast",
	name_es: "Palacio del Aguilucho",
	name_fr: "Palais du circaète",
	name_zh: "鷂鷹宮殿",
	id: "1102-114",
	map_id: "1102",
	coord: [8619, 13266]
},
"1102-115": {
	map_type: "GreenHome",
	type: "Camp",
	name_en: "Hughe's Hideaway",
	name_de: "Hughes Versteck",
	name_es: "Escondrijo de Hughe",
	name_fr: "Antre de Hughe",
	name_zh: "休赫的藏匿點",
	id: "1102-115",
	map_id: "1102",
	coord: [5729, 12554]
},
"1102-116": {
	map_type: "GreenHome",
	type: "Camp",
	name_en: "Smashedhope Well",
	name_de: "Brunnen der Zerschlagenen Hoffnung",
	name_es: "Pozo Tragaesperanza",
	name_fr: "Puits du Rêve-brisé",
	name_zh: "絕望之井",
	id: "1102-116",
	map_id: "1102",
	coord: [7163, 14414]
},
"1143-99": {
	map_type: "BlueHome",
	type: "Camp",
	name_en: "Zakk's Lab",
	name_de: "Zakks Labor",
	name_es: "Laboratorio de Zakk",
	name_fr: "Laboratoire de Zakk",
	name_zh: "扎科的實驗室",
	id: "1143-99",
	map_id: "1143",
	coord: [14327, 11402]
},
"1143-100": {
	map_type: "BlueHome",
	type: "Camp",
	name_en: "Gee Farmstead",
	name_de: "Gee-Gehöft",
	name_es: "Hacienda de Gee",
	name_fr: "Ferme Gee",
	name_zh: "基的農場",
	id: "1143-100",
	map_id: "1143",
	coord: [15473, 13211]
},
"1143-101": {
	map_type: "BlueHome",
	type: "Camp",
	name_en: "Habib's Encampment",
	name_de: "Habibs Lager",
	name_es: "Campamento de Habib",
	name_fr: "Campement d'Habib",
	name_zh: "哈比伯的營地",
	id: "1143-101",
	map_id: "1143",
	coord: [13168, 13215]
},
"1143-102": {
	map_type: "BlueHome",
	type: "Tower",
	name_en: "Kay'li Academy",
	name_de: "Kay'li-Akademie",
	name_es: "Academia Kay'li",
	name_fr: "Académie de Kay'li",
	name_zh: "凱立學院",
	id: "1143-102",
	map_id: "1143",
	coord: [13416, 11428]
},
"1143-104": {
	map_type: "BlueHome",
	type: "Tower",
	name_en: "Undying Necropolis",
	name_de: "Unsterbliche Nekropole",
	name_es: "Necrópolis Imperecedera",
	name_fr: "Nécropole impérissable",
	name_zh: "不朽魂都",
	id: "1143-104",
	map_id: "1143",
	coord: [15323, 11574]
},
"1143-105": {
	map_type: "BlueHome",
	type: "Tower",
	name_en: "Flywheel Depot",
	name_de: "Schwungrad-Depot",
	name_es: "Depósito de Volantes",
	name_fr: "Dépôt Engrenage",
	name_zh: "飛輪補給站",
	id: "1143-105",
	map_id: "1143",
	coord: [14841, 13471]
},
"1143-106": {
	map_type: "BlueHome",
	type: "Keep",
	name_en: "Torrid Undercroft",
	name_de: "Glühende Gruft",
	name_es: "Sótano Sofocante",
	name_fr: "Crypte torride",
	name_zh: "酷熱墓穴",
	id: "1143-106",
	map_id: "1143",
	coord: [12912, 12554]
},
"1143-109": {
	map_type: "BlueHome",
	type: "Camp",
	name_en: "Olivier's Refuge",
	name_de: "Oliviers Zuflucht",
	name_es: "Refugio de Olivier",
	name_fr: "Refuge d'Olivier",
	name_zh: "奧立弗的避難所",
	id: "1143-109",
	map_id: "1143",
	coord: [15684, 11939]
},
"1143-110": {
	map_type: "BlueHome",
	type: "Tower",
	name_en: "Barren Outpost",
	name_de: "Öder Außenposten",
	name_es: "Puesto Avanzado Abandonado",
	name_fr: "Avant-poste délabré",
	name_zh: "貧瘠前哨",
	id: "1143-110",
	map_id: "1143",
	coord: [13828, 13251]
},
"1143-113": {
	map_type: "BlueHome",
	type: "Keep",
	name_en: "Hardened Rampart",
	name_de: "Stahlharter Festungswall",
	name_es: "Muralla Endurecida",
	name_fr: "Rempart durci",
	name_zh: "防護壁壘",
	id: "1143-113",
	map_id: "1143",
	coord: [14361, 12040]
},
"1143-114": {
	map_type: "BlueHome",
	type: "Keep",
	name_en: "Shrike's Palace",
	name_de: "Würger-Palast",
	name_es: "Palacio del Alcaudón",
	name_fr: "Palais de la pie-grièche",
	name_zh: "烏鶇宮殿",
	id: "1143-114",
	map_id: "1143",
	coord: [15787, 12626]
},
"1143-115": {
	map_type: "BlueHome",
	type: "Camp",
	name_en: "Berdrow's Hideaway",
	name_de: "Berdrows Versteck",
	name_es: "Escondrijo de Berdrow",
	name_fr: "Antre de Berdrow",
	name_zh: "貝德羅的藏匿點",
	id: "1143-115",
	map_id: "1143",
	coord: [12897, 11914]
},
"1143-116": {
	map_type: "BlueHome",
	type: "Camp",
	name_en: "Lastgasp Well",
	name_de: "Brunnen des Letzten Schnaufers",
	name_es: "Pozo del Último Suspiro",
	name_fr: "Puits du Dernier-soupir",
	name_zh: "瀕死之井",
	id: "1143-116",
	map_id: "1143",
	coord: [14331, 13774]
}
};

/*
 * Objective type translations.
 */
var GW2T_OBJECTIVE_TYPE = {
	"Camp": {
		value: 5,
		name_en: "Camp",
		name_de: "Lager",
		name_es: "Campamento",
		name_fr: "Camp",
		name_zh: "營地"
	},
	"Tower": {
		value: 10,
		name_en: "Tower",
		name_de: "Turm",
		name_es: "Torre",
		name_fr: "Tour",
		name_zh: "塔樓"
	},
	"Keep": {
		value: 25,
		name_en: "Keep",
		name_de: "Feste",
		name_es: "Fortaleza",
		name_fr: "Fort",
		name_zh: "要塞"
	},
	"Castle": {
		value: 35,
		name_en: "Castle",
		name_de: "Schloss",
		name_es: "Castillo",
		name_fr: "Château",
		name_zh: "城堡"
	},
	"Borderlands": {
		name_en: "Borderlands",
		name_de: "Grenzlande",
		name_es: "Tierras Fronterizas de",
		name_fr: "Territoires frontaliers",
		name_zh: "沙漠邊境之地"
	}
};
