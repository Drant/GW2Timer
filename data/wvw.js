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
