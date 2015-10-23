/*
 * This file is used by http://gw2timer.com
 * Contains Kryta continent map zone, region, dailies, countdown, and sales data.
 */

var GW2T_REGION_DATA = {
"heart": {
	name_en: "Heart of Maguuma",
	name_de: "Herz von Maguuma",
	name_es: "Corazón de Maguuma",
	name_fr: "Cœur de Maguuma",
	name_zh: "邁古瑪的心",
	color: "gray"
},
"wastes": {
	name_en: "Maguuma Wastes",
	name_de: "Maguuma-Einöde",
	name_es: "Páramos Maguuma",
	name_fr: "Contrées sauvages de Maguuma",
	name_zh: "邁古瑪荒野",
	color: "wheat"
},
"jungle": {
	name_en: "Maguuma Jungle",
	name_de: "Maguuma-Dschungel",
	name_es: "Jungla de Maguuma",
	name_fr: "Jungle de Maguuma",
	name_zh: "晦暗海岸",
	color: "cyan"
},
"kryta": {
	name_en: "Kryta",
	name_de: "Kryta",
	name_es: "Kryta",
	name_fr: "Kryte",
	name_zh: "科瑞塔",
	color: "lightgreen"
},
"orr": {
	name_en: "Orr",
	name_de: "Orr",
	name_es: "Orr",
	name_fr: "Orr",
	name_zh: "歐爾遺跡",
	color: "darkgoldenrod"
},
"shiverpeaks": {
	name_en: "Shiverpeaks",
	name_de: "Zittergipfelgebirge",
	name_es: "Picosescalofriantes",
	name_fr: "Cimefroides",
	name_zh: "席瓦雪山",
	color: "lightskyblue"
},
"ascalon": {
	name_en: "Ascalon",
	name_de: "Ascalon",
	name_es: "Ascalon",
	name_fr: "Ascalon",
	name_zh: "阿斯卡隆",
	color: "orange"
}
};

/*
 * This associates the zone's nick with their ID number in the API JSON for
 * access in constant time.
 */
var GW2T_ZONE_ASSOCIATION = {
	"15": "queensdale",
	"17": "harathi",
	"18": "divinity",
	"19": "plains",
	"20": "blazeridge",
	"21": "fields",
	"22": "fireheart",
	"23": "kessex",
	"24": "gendarran",
	"25": "marches",
	"26": "dredgehaunt",
	"27": "lornar",
	"28": "wayfarer",
	"29": "timberline",
	"30": "frostgorge",
	"31": "snowden",
	"32": "diessa",
	"34": "caledon",
	"35": "metrica",
	"39": "maelstrom",
	"50": "lion",
	"51": "straits",
	"53": "sparkfly",
	"54": "brisban",
	"62": "cursed",
	"65": "malchor",
	"73": "bloodtide",
	"91": "grove",
	"139": "rata",
	"218": "citadel",
	"326": "hoelbrak",
	"873": "southsun",
	"988": "dry",
	"1015": "silverwastes"
};

/*
 * Locations for cross-world map travel. Coordinates are ordered west to east.
 */
var GW2T_GATEWAY_CONNECTION = {
	// The light blue vortexes at the edges of zones
	interzones: [
	[[5865, 15283], [5974, 15604]], // silverwastes to brisban
	[[5559, 16744], [6039, 17105]], // dry to brisban
	[[8011, 17021], [8082, 17270]], // metrica to brisban
	[[9218, 14666], [9492, 14615]], // brisban to kessex
	[[9244, 16368], [9443, 16316]], // brisban to caledon
	[[9926, 20038], [10229, 20633]], // caledon to grove
	[[9130, 17658], [9435, 17664]], // metrica to caledon
	[[11061, 16191], [11090, 16023]], // caledon to kessex
	[[12232, 14028], [12234, 14141]], // kessex to queensdale
	[[10301, 14182], [10476, 13932]], // kessex to queensdale
	[[13353, 14230], [13561, 14110]], // kessex to gendarran
	[[11245, 11602], [11021, 11934]], // divinity to queensdale
	[[13327, 12613], [13523, 12681]], // queensdale to gendarran
	[[14344, 12335], [14341, 12140]], // gendarran to harathi
	[[15718, 12361], [15749, 12195]], // gendarran to harathi
	[[17487, 13631], [17758, 13600]], // gendarran to lornar
	[[17544, 12749], [17780, 12754]], //gendarran to snowden
	[[15879, 14217], [16119, 14380]], // gendarran to lion
	[[16823, 15764], [16767, 15921]], // lion to bloodtide
	[[17448, 15031], [17786, 15120]], // lion to lornar
	[[17545, 16082], [17784, 16001]], // bloodtide to lornar
	[[17602, 17798], [17795, 17828]], // bloodtide to lornar
	[[15542, 18835], [15529, 19192]], // bloodtide to sparkfly
	[[19344, 16580], [19618, 16380]], // lornar to dredgehaunt
	[[19035, 18066], [19184, 18273]], // lornar to timberline
	[[20665, 17971], [20618, 18243]], // dredgehaunt to timberline
	[[19107, 13401], [19178, 13188]], // snowden to lornar
	[[21645, 11577], [22032, 11797]], // snowden to wayfarer
	[[20977, 11386], [21044, 11204]], // snowden to frostgorge
	[[21428, 14519], [22148, 14491]], // hoelbrak to wayfarer
	[[21086, 14721], [20942, 15114]], // hoelbrak to dredgehaunt
	[[23110, 11450], [23061, 11163]], // wayfarer to frostgorge
	[[23356, 11968], [23680, 11995]], // wayfarer to diessa
	[[23706, 9704], [23993, 9741]], // frostgorge to fireheart
	[[24301, 13685], [24090, 13465]], // citadel to diessa
	[[25049, 14227], [25270, 14411]], // citadel to plains
	[[26719, 13660], [26847, 13506]], // plains to diessa
	[[29104, 14842], [29269, 14884]], // plains to blazeridge
	[[28217, 13642], [28194, 13489]], // plains to marches
	[[30932, 16429], [30928, 16180]], // fields to blazeridge
	[[29314, 12615], [29103, 12452]], // blazeridge to marches
	[[27235, 10757], [27059, 10748]], // marches to fireheart
	[[19532, 21222], [19583, 21431]], // timberline to maelstrom
	[[17643, 21789], [17882, 21744]], // sparkfly to maelstrom
	[[16978, 22219], [16980, 22547]], // sparkfly to straits
	[[17870, 23464], [17679, 23537]], // maelstrom to straits
	[[14575, 24541], [14352, 24600]], // straits to malchor
	[[11926, 25129], [11731, 25347]], // malchor to cursed
	],
	// The purple asura gates that mostly connect cities
	intergates: [
	[[6114, 20837], [7281, 20046]], // rata to metrica
	[[6095, 20859], [5946, 21489]], // rata to incubationlab
	[[6073, 20856], [5514, 21765]], // rata to dawnsidequay
	[[5774, 20768], [5248, 19931]], // rata to applieddevelopmentlab
	[[5772, 20802], [5407, 20840]], // rata to snaffmemoriallab
	[[5796, 20806], [5290, 21885]], // rata to antidawnanchorage
	[[16646, 14662], [13872, 20331]], // lion to southsun
	[[16680, 14699], [20501, 14271]], // lion to hoelbrak
	[[16663, 14799], [24051, 14060]], // lion to citadel
	[[16621, 14815], [10450, 20912]], // lion to grove
	[[16550, 14759], [6003, 20530]], // lion to rata
	[[16592, 14666], [11341, 11005]], // lion to divinity
	[[11937, 10966], [29065, 18418]], // divinity to fields
	[[17390, 23393], [16706, 12619]], // forttrinity to vigilkeep
	[[17418, 23392], [16672, 16653]], // forttrinity to chantryofsecrets
	[[17442, 23401], [17815, 15000]] // forttrinity to durmandpriory
	]
};

/*
 * Images that are overlaid on the map, such as caves and underground areas.
 */
var GW2T_SUBMAP_DATA = {
angvarstrove: {
	img: "http://i.imgur.com/LuiwbAK.png", 
	bounds: [[17660, 11230], [18610, 11930]]
},
bonerattlercaverns: {
	img: "http://i.imgur.com/TyGZI9H.png", 
	bounds: [[13482, 11605], [15032, 12205]]
},
brandedmine: {
	img: "http://i.imgur.com/XdXqXTL.png",
	bounds: [[28674, 16701], [28984, 16951]]
},
dostoevskypeak: {
	img: "http://i.imgur.com/l0PyKxS.png", 
	bounds: [[20120, 16395], [20920, 17195]]
},
fionnghualascratch: {
	img: "http://i.imgur.com/6ELssZW.png",
	bounds: [[19718, 19035], [20268, 19785]]
},
highdencaves: {
	img: "http://i.imgur.com/V71MHb1.png", 
	bounds: [[31230, 16900], [31730, 17700]]
},
langmarestate: {
	img: "http://i.imgur.com/KUMY9HD.png", 
	bounds: [[25054, 14859], [25804, 15659]]
},
posternuscaverns: {
	img: "http://i.imgur.com/rFdG4jD.png", 
	bounds: [[17665, 14295], [18065, 15115]]
},
proxemicslab: {
	img: "http://i.imgur.com/shk8IVE.png", 
	bounds: [[5880, 14440], [6230, 15290]]
},
sawtoothbaycaves: {
	img: "http://i.imgur.com/SnaczAR.png", 
	bounds: [[13245, 19980], [13445, 20180]]
},
spidernestcavern: {
	img: "http://i.imgur.com/XCSCoDD.png", 
	bounds: [[25141, 11313], [25641, 11753]]
}
};

/*
 * Zones are sorted by how far from the top left corner (0,0) it is.
 */
var GW2T_ZONE_DATA = {
"silverwastes":
{
	id: "1015",
	name_en: "The Silverwastes",
	name_de: "Die Silberwüste",
	name_es: "Los Páramos Argentos",
	name_fr: "Les Contrées sauvages d'Argent",
	name_zh: "白銀荒地",
	region: "wastes",
	rect: [[3838, 14206], [5886, 15742]]
},
"dry":
{
	id: "988",
	name_en: "Dry Top",
	name_de: "Trockenkuppe",
	name_es: "Cima Seca",
	name_fr: "Cimesèche",
	name_zh: "干涸高地",
	region: "wastes",
	rect: [[3840, 15742], [5888, 17152]]//[3840, 14592]
},
"rata":
{
	id: "139",
	name_en: "Rata Sum",
	name_de: "Rata Sum",
	name_es: "Rata Sum",
	name_fr: "Rata Sum",
	name_zh: "拉塔索姆",
	region: "jungle",
	rect: [[4608, 19710], [7168, 22270]]
},
"brisban":
{
	id: "54",
	name_en: "Brisban Wildlands",
	name_de: "Brisban-Wildnis",
	name_es: "Selvas Brisbanas",
	name_fr: "Terres sauvages de Brisban",
	name_zh: "布裡斯班野地",
	region: "jungle",
	rect: [[5888, 14464], [9344, 17152]]
},
"metrica":
{
	id: "35",
	name_en: "Metrica Province",
	name_de: "Provinz Metrica",
	name_es: "Provincia de Métrica",
	name_fr: "Province de Metrica",
	name_zh: "度量領域",
	region: "jungle",
	rect: [[7168, 17152], [9344, 20480]]
},
"caledon":
{
	id: "34",
	name_en: "Caledon Forest",
	name_de: "Caledon-Wald",
	name_es: "Bosque de Caledon",
	name_fr: "Forêt de Caledon",
	name_zh: "卡勒頓之森",
	region: "jungle",
	rect: [[9344, 16128], [11264, 20096]]
},
"kessex":
{
	id: "23",
	name_en: "Kessex Hills",
	name_de: "Kessex-Hügel",
	name_es: "Colinas Kessex",
	name_fr: "Collines de Kessex",
	name_zh: "凱席斯山",
	region: "kryta",
	rect: [[9344, 14080], [13440, 16128]]
},
"grove":
{
	id: "91",
	name_en: "The Grove",
	name_de: "Der Hain",
	name_es: "La Arboleda",
	name_fr: "Le Bosquet",
	name_zh: "聖林之地",
	region: "jungle",
	rect: [[9728, 20096], [11136, 22144]]
},
"queensdale":
{
	id: "15",
	name_en: "Queensdale",
	name_de: "Königintal",
	name_es: "Valle de la Reina",
	name_fr: "La Vallée de la reine",
	name_zh: "女王谷",
	region: "kryta",
	rect: [[9856, 11648], [13440, 14080]]
},
"cursed":
{
	id: "62",
	name_en: "Cursed Shore",
	name_de: "Fluchküste",
	name_es: "Ribera Maldita",
	name_fr: "Rivage maudit",
	name_zh: "詛咒海岸",
	region: "orr",
	rect: [[10112, 25216], [12160, 29312]]
},
"divinity":
{
	id: "18",
	name_en: "Divinity's Reach",
	name_de: "Götterfels",
	name_es: "Linde de la Divinidad",
	name_fr: "Le Promontoire divin",
	name_zh: "神佑之城",
	region: "kryta",
	rect: [[10240, 9856], [12160, 11648]]
},
"malchor":
{
	id: "65",
	name_en: "Malchor's Leap",
	name_de: "Malchors Sprung",
	name_es: "Salto de Malchor",
	name_fr: "Saut de Malchor",
	name_zh: "馬爾科之躍",
	region: "orr",
	rect: [[10368, 23168], [14464, 25216]]
},
"southsun":
{
	id: "873",
	name_en: "Southsun Cove",
	name_de: "Südlicht-Bucht",
	name_es: "Cala del Sol Austral",
	name_fr: "Crique de Sud-Soleil",
	name_zh: "南陽海灣",
	region: "kryta",
	rect: [[11520, 18944], [14208, 20736]]
},
"harathi":
{
	id: "17",
	name_en: "Harathi Hinterlands",
	name_de: "Harathi-Hinterland",
	name_es: "Interior Harathi",
	name_fr: "Hinterlands harathis",
	name_zh: "哈拉希腹地",
	region: "kryta",
	rect: [[13440, 9472], [16640, 12288]]
},
"gendarran":
{
	id: "24",
	name_en: "Gendarran Fields",
	name_de: "Gendarran-Felder",
	name_es: "Campos de Gendarran",
	name_fr: "Champs de Gendarran",
	name_zh: "甘達拉戰區",
	region: "kryta",
	rect: [[13440, 12288], [17664, 14336]]
},
"straits":
{
	id: "51",
	name_en: "Straits of Devastation",
	name_de: "Meerenge der Verwüstung",
	name_es: "Estrechos de la Devastación",
	name_fr: "Détroit de la Dévastation",
	name_zh: "浩劫海峽",
	region: "orr",
	rect: [[14464, 22400], [17792, 25216]]
},
"lion":
{
	id: "50",
	name_en: "Lion's Arch",
	name_de: "Löwenstein",
	name_es: "Arco del León",
	name_fr: "L'Arche du Lion",
	name_zh: "獅子拱門",
	region: "kryta",
	rect: [[15232, 14336], [17664, 15872]]
},
"bloodtide":
{
	id: "73",
	name_en: "Bloodtide Coast",
	name_de: "Blutstrom-Küste",
	name_es: "Costa Mareasangrienta",
	name_fr: "Côte de la marée sanglante",
	name_zh: "血潮海岸",
	region: "kryta",
	rect: [[15232, 15872], [17664, 19072]]
},
"sparkfly":
{
	id: "53",
	name_en: "Sparkfly Fen",
	name_de: "Funkenschwärmersumpf",
	name_es: "Pantano de las Centellas",
	name_fr: "Marais de Lumillule",
	name_zh: "閃螢沼澤",
	region: "jungle",
	rect: [[15232, 19072], [17792, 22400]]
},
"lornar":
{
	id: "27",
	name_en: "Lornar's Pass",
	name_de: "Lornars Pass",
	name_es: "Paso de Lornar",
	name_fr: "Passage de Lornar",
	name_zh: "羅納通道",
	region: "shiverpeaks",
	rect: [[17664, 13312], [19456, 18176]]
},
"snowden":
{
	id: "31",
	name_en: "Snowden Drifts",
	name_de: "Schneekuhlenhöhen",
	name_es: "Cúmulos de Guaridanieve",
	name_fr: "Congères d'Antreneige",
	name_zh: "漂流雪境",
	region: "shiverpeaks",
	rect: [[17664, 11264], [21760, 13312]]
},
"maelstrom":
{
	id: "39",
	name_en: "Mount Maelstrom",
	name_de: "Mahlstromgipfel",
	name_es: "Monte Vorágine",
	name_fr: "Mont Maelström",
	name_zh: "漩渦山",
	region: "jungle",
	rect: [[17792, 21376], [21632, 23808]]
},
"timberline":
{
	id: "29",
	name_en: "Timberline Falls",
	name_de: "Baumgrenzen-Fälle",
	name_es: "Cataratas de Linarbórea",
	name_fr: "Chutes de la Canopée",
	name_zh: "林線瀑布",
	region: "shiverpeaks",
	rect: [[18944, 18176], [21248, 21376]]
},
"hoelbrak":
{
	id: "326",
	name_en: "Hoelbrak",
	name_de: "Hoelbrak",
	name_es: "Hoelbrak",
	name_fr: "Hoelbrak",
	name_zh: "霍布雷克",
	region: "shiverpeaks",
	rect: [[19456, 13312], [21760, 14976]]
},
"dredgehaunt":
{
	id: "26",
	name_en: "Dredgehaunt Cliffs",
	name_de: "Schauflerschreck-Klippen",
	name_es: "Acantilados de Guaridadraga",
	name_fr: "Falaises de Hantedraguerre",
	name_zh: "掘洞懸崖",
	region: "shiverpeaks",
	rect: [[19456, 14976], [21760, 18176]]
},
"frostgorge":
{
	id: "30",
	name_en: "Frostgorge Sound",
	name_de: "Eisklamm-Sund",
	name_es: "Estrecho de Gorjaescarcha",
	name_fr: "Détroit des gorges glacées",
	name_zh: "霜谷之音",
	region: "shiverpeaks",
	rect: [[20736, 8192], [23808, 11264]]
},
"wayfarer":
{
	id: "28",
	name_en: "Wayfarer Foothills",
	name_de: "Wanderer-Hügel",
	name_es: "Colinas del Caminante",
	name_fr: "Contreforts du Voyageur",
	name_zh: "旅者丘陵",
	region: "shiverpeaks",
	rect: [[21760, 11264], [23552, 15872]]
},
"citadel":
{
	id: "218",
	name_en: "Black Citadel",
	name_de: "Schwarze Zitadelle",
	name_es: "Ciudadela Negra",
	name_fr: "La Citadelle noire",
	name_zh: "黑煙壁壘",
	region: "ascalon",
	rect: [[23552, 13568], [25088, 15616]]
},
"diessa":
{
	id: "32",
	name_en: "Diessa Plateau",
	name_de: "Diessa-Plateau",
	name_es: "Meseta de Diessa",
	name_fr: "Plateau de Diessa",
	name_zh: "底耶沙高地",
	region: "ascalon",
	rect: [[23552, 11264], [27136, 13568]]
},
"fireheart":
{
	id: "22",
	name_en: "Fireheart Rise",
	name_de: "Feuerherzhügel",
	name_es: "Colina del Corazón de Fuego",
	name_fr: "Montée de Flambecœur",
	name_zh: "炎心高地",
	region: "ascalon",
	rect: [[23808, 8448], [27136, 11264]]
},
"plains":
{
	id: "19",
	name_en: "Plains of Ashford",
	name_de: "Ebenen von Aschfurt",
	name_es: "Llanuras de Ashford",
	name_fr: "Plaines d'Ashford",
	name_zh: "阿什福德平原",
	region: "ascalon",
	rect: [[25088, 13568], [29184, 15616]]
},
"marches":
{
	id: "25",
	name_en: "Iron Marches",
	name_de: "Eisenmark",
	name_es: "Fronteras de Hierro",
	name_fr: "Marais de fer",
	name_zh: "鋼鐵平原",
	region: "ascalon",
	rect: [[27136, 9472], [29184, 13568]]
},
"fields":
{
	id: "21",
	name_en: "Fields of Ruin",
	name_de: "Felder der Verwüstung",
	name_es: "Campos de la Ruina",
	name_fr: "Champs de Ruine",
	name_zh: "廢墟原野",
	region: "ascalon",
	rect: [[28672, 16256], [31744, 19328]]
},
"blazeridge":
{
	id: "20",
	name_en: "Blazeridge Steppes",
	name_de: "Flammenkamm-Steppe",
	name_es: "Estepas Crestafulgurante",
	name_fr: "Les Steppes de la Strie flamboyante",
	name_zh: "裂脊草原",
	region: "ascalon",
	rect: [[29184, 12160], [31232, 16256]]
}
};

/*
 * A month's achievements with associated days. Example of format:
 * pve: ["GATHER REGION", "ACTIVITY CONDITIONALREGION", "EVENTREGION", "BOSS"],
 * pvp: ["PVP0", "PVP1", "PROFESSIONS0", "PROFESSIONS1"],
 * wvw: ["WVW0", "WVW1", "WVW2", "WVW3"]
 */
var GW2T_DAILY_CALENDAR = {
"1": {
	pve: ["Miner Shiverpeaks", "Fractal", "Kessex", "Fractal 1-10"],
	pvp: ["Defender", "Capture", "Thief Necro", "Ele Ranger"],
	wvw: ["Land", "Guard", "Tower", "Keep"]
},
"2": {
	pve: ["Forager Orr", "Forger", "Caledon", "Fractal 21-30"],
	pvp: ["Defender", "Kills", "War Necro", "Thief Mes"],
	wvw: ["Spender", "Kills", "Camp", "Defender"]
},
"3": {
	pve: ["Forager Jungle", "Vista Jungle", "Harathi", "Fractal 1-10"],
	pvp: ["Rank", "Reward", "War Eng", "Ranger Eng"],
	wvw: ["Ruins", "Kills", "Keep", "Defender"]
},
"4": {
	pve: ["Miner Ascalon", "Vista Ascalon", "Sparkfly", "Fractal 11-20"],
	pvp: ["Capture", "Kills", "Ele Mes", "Guard Thief"],
	wvw: ["Ruins", "Guard", "Camp", "Keep"]
},
"5": {
	pve: ["Lumberer Wastes", "Forger", "Straits", "Fractal 1-10"],
	pvp: ["Rank", "Reward", "Eng Thief", "Ranger Eng"],
	wvw: ["Caravan", "Ruins", "Camp", "Keep"]
},
"6": {
	pve: ["Miner Orr", "Vista Shiverpeaks", "Frostgorge", "Fractal 1-10"],
	pvp: ["Kills", "Defender", "War Guard", "Ranger Eng"],
	wvw: ["Guard", "Caravan", "Defender", "Camp"]
},
"7": {
	pve: ["Forager Ascalon", "Activity", "Fields", "Fractal 1-10"],
	pvp: ["Kills", "Rank", "Ranger Thief", "Eng Ele"],
	wvw: ["Land", "Spender", "Defender", "Tower"]
},
"8": {
	pve: ["Lumberer Ascalon", "Forger", "Brisban", "Fractal 1-10"],
	pvp: ["Rank", "Capture", "War Ranger", "Guard Necro"],
	wvw: ["Ruins", "Kills", "Tower", "Camp"]
},
"9": {
	pve: ["Miner Kryta", "Vista Orr", "Maelstrom", "Fractal 31-40"],
	pvp: ["Defender", "Reward", "Ranger Mes", "Guard Eng"],
	wvw: ["Spender", "Land", "Defender", "Camp"]
},
"10": {
	pve: ["Forager Orr", "Vista Ascalon", "Bloodtide", "Fractal 1-10"],
	pvp: ["Rank", "Reward", "War Eng", "Ranger Necro"],
	wvw: ["Ruins", "Guard", "Camp", "Defender"]
},
"11": {
	pve: ["Lumberer Kryta", "Vista Shiverpeaks", "Plains", "Fractal 1-10"],
	pvp: ["Capture", "Defender", "Ele Mes", "Guard Thief"],
	wvw: ["Land", "Caravan", "Keep", "Camp"]
},
"12": {
	pve: ["Miner Wastes", "Activity", "Kessex", "Fractal 1-10"],
	pvp: ["Capture", "Reward", "Eng Thief", "Ele Necro"],
	wvw: ["Land", "Guard", "Tower", "Camp"]
},
"13": {
	pve: ["Forager Ascalon", "Vista Jungle", "Dredgehaunt", "Fractal 1-10"],
	pvp: ["Rank", "Reward", "War Thief", "Guard Ranger"],
	wvw: ["Ruins", "Land", "Tower", "Defender"]
},
"14": {
	pve: ["Lumberer Shiverpeaks", "Forger", "Snowden", "Fractal 1-10"],
	pvp: ["Kills", "Rank", "Eng Mes", "Guard Ele"],
	wvw: ["Spender", "Ruins", "Keep", "Defender"]
},
"15": {
	pve: ["Miner Shiverpeaks", "Activity", "Metrica", "Fractal 1-10"],
	pvp: ["Defender", "Reward", "War Ele", "Eng Necro"],
	wvw: ["Creature", "Kills", "Keep", "Camp"]
},
"16": {
	pve: ["Lumberer Wastes", "Fractal", "Harathi", "Fractal 1-10"],
	pvp: ["Capture", "Rank", "Thief Ele", "Guard Mes"],
	wvw: ["Ruins", "Land", "Defender", "Tower"]
},
"17": {
	pve: ["Forager Orr", "Vista Orr", "Frostgorge", "Fractal 1-10"],
	pvp: ["Defender", "Kills", "War Mes", "Ranger Necro"],
	wvw: ["Spender", "Guard", "Camp", "Keep"]
},
"18": {
	pve: ["Miner Shiverpeaks", "Vista Shiverpeaks", "Queensdale", "Fractal 1-10"],
	pvp: ["Capture", "Rank", "Thief Necro", "Ele Ranger"],
	wvw: ["Ruins", "Land", "Defender", "Camp"]
},
"19": {
	pve: ["Lumberer Ascalon", "Vista Ascalon", "Southsun", "Fractal 1-10"],
	pvp: ["Defender", "Kills", "War Necro", "Thief Mes"],
	wvw: ["Kills", "Ruins", "Defender", "Tower"]
},
"20": {
	pve: ["Forager Orr", "Fractal", "Caledon", "SB"],
	pvp: ["Capture", "Kills", "War Guard", "Ranger Eng"],
	wvw: ["Spender", "Caravan", "Tower", "Camp"]
},
"21": {
	pve: ["Miner Shiverpeaks", "Forger", "Timberline", "Golem"],
	pvp: ["Defender", "Reward", "Ranger Thief", "Eng Ele"],
	wvw: ["Creature", "Guard", "Defender", "Keep"]
},
"22": {
	pve: ["Lumberer Jungle", "Activity", "Snowden", "Fractal 1-10"],
	pvp: ["Defender", "Capture", "War Ranger", "Guard Necro"],
	wvw: ["Caravan", "Kills", "Camp", "Tower"]
},
"23": {
	pve: ["Miner Wastes", "Vista Jungle", "Fields", "Jormag"],
	pvp: ["Kills", "Rank", "War Ele", "Rev Necro"],
	wvw: ["Spender", "Land", "Tower", "Camp"]
},
"24": {
	pve: ["Miner Shiverpeaks", "Vista Orr", "Sparkfly", "Fractal 11-20"],
	pvp: ["Capture", "Reward", "Ele Mes", "Guard Thief"],
	wvw: ["Ruins", "Land", "Defender", "Keep"]
},
"25": {
	pve: ["Lumberer Wastes", "Fractal", "Harathi", "Fractal 1-10"],
	pvp: ["Reward", "Capture", "Eng Thief", "Ele Necro"],
	wvw: ["Guard", "Ruins", "Keep", "Camp"]
},
"26": {
	pve: ["Forager Kryta", "Vista Kryta", "Wayfarer", "Fractal 1-10"],
	pvp: ["Capture", "Defender", "War Thief", "Guard Ranger"],
	wvw: ["Ruins", "Land", "Tower", "Camp"]
},
"27": {
	pve: ["Miner Ascalon", "Vista Shiverpeaks", "Harathi", "Fractal 1-10"],
	pvp: ["Defender", "Rank", "Eng Mes", "Guard Ele"],
	wvw: ["Caravan", "Creature", "Defender", "Camp"]
},
"28": {
	pve: ["Lumberer Kryta", "Forger", "Queensdale", "Fractal 1-10"],
	pvp: ["Capture", "Rank", "War Ele", "Eng Necro"],
	wvw: ["Spender", "Caravan", "Camp", "Keep"]
},
"29": {
	pve: ["Forager Ascalon", "Activity", "Marches", "Fractal 1-10"],
	pvp: ["Capture", "Reward", "Thief Ele", "Guard Mes"],
	wvw: ["Land", "Kills", "Defender", "Tower"]
},
"30": {
	pve: ["Lumberer Kryta", "Vista Wastes", "Gendarran", "Fractal 1-10"],
	pvp: ["Rank", "Reward", "War Mes", "Guard Necro"],
	wvw: ["Guard", "Caravan", "Defender", "Camp"]
},
"31": {
	pve: ["Forager Ascalon", "Vista Shiverpeaks", "Sparkfly", "Fractal 1-10"],
	pvp: ["Defender", "Kills", "Thief Necro", "Ele Ranger"],
	wvw: ["Creature", "Land", "Keep", "Camp"]
}
};

/*
 * Data for generating the dashboard on the map pane.
 */
var GW2T_DASHBOARD_DATA = {

Announcement: "Do you like using gw2timer.com? Recommend it your friends and new players!",

/*
 * GW2 special events, such as those announced on GuildWars2.com.
 * Requirement: Date minutes (MM in HH:MM:SS) must be divisible by 5.
 * Format:
	name: "", // Language independent, overrides others
	name_en: "",
	name_de: "",
	name_es: "",
	name_fr: "",
	news: "", // Official GW2 site news link
	url: "", // Language independent, overrides others
	url_en: "",
	url_de: "",
	url_es: "",
	url_fr: "",
	Start: new Date("2015-07-10T19:00:00Z"),
	Finish: new Date("2015-07-13T19:00:00Z")
 */
Countdowns: [
{
	name_en: "New WvW Reset (NA)",
	name_de: "Neue WvW Zurücksetzen (NA)",
	name_es: "Nuevo WvW restablecer (NA)",
	name_fr: "Nouveau McM réinitialiser (NA)",
	url_en: "https://forum-en.guildwars2.com/forum/game/wuv/WvW-and-the-Heart-of-Thorns-Release",
	url_de: "https://forum-de.guildwars2.com/forum/game/wuv/WvW-und-Release-von-Heart-of-Thorns",
	url_es: "https://forum-es.guildwars2.com/forum/game/wuv/WvW-y-el-lanzamiento-de-Heart-of-Thorns",
	url_fr: "https://forum-fr.guildwars2.com/forum/game/wuv/Sortie-de-Heart-of-Thorns-et-McM",
	Start: new Date("2015-10-22T16:00:00Z"),
	Finish: new Date("2015-10-25T01:00:00Z")
},
{
	name_en: "New WvW Reset (EU)",
	name_de: "Neue WvW Zurücksetzen (EU)",
	name_es: "Nuevo WvW restablecer (EU)",
	name_fr: "Nouveau McM réinitialiser (EU)",
	url_en: "https://forum-en.guildwars2.com/forum/game/wuv/WvW-and-the-Heart-of-Thorns-Release",
	url_de: "https://forum-de.guildwars2.com/forum/game/wuv/WvW-und-Release-von-Heart-of-Thorns",
	url_es: "https://forum-es.guildwars2.com/forum/game/wuv/WvW-y-el-lanzamiento-de-Heart-of-Thorns",
	url_fr: "https://forum-fr.guildwars2.com/forum/game/wuv/Sortie-de-Heart-of-Thorns-et-McM",
	Start: new Date("2015-10-22T16:00:00Z"),
	Finish: new Date("2015-10-24T18:00:00Z")
},
{
	name_en: "Halloween Is Coming!",
	name_de: "Halloween naht!",
	name_es: "¡Se acerca Halloween!",
	name_fr: "Halloween approche !",
	news: "halloween-is-coming",
	Start: new Date("2015-10-23T07:00:00Z"),
	Finish: new Date("2015-10-31T07:00:00Z")
},
{
	name_en: "ArenaNet at Halloween",
	name_de: "ArenaNet an Halloween",
	name_es: "ArenaNet en Halloween",
	name_fr: "ArenaNet à Halloween",
	url_en: "https://forum-en.guildwars2.com/forum/game/gw2/Halloween-Event-Yay",
	url_de: "https://forum-de.guildwars2.com/forum/game/gw2/Halloween-Event-2",
	url_es: "https://forum-es.guildwars2.com/forum/game/game/Evento-de-Halloween",
	url_fr: "https://forum-fr.guildwars2.com/forum/game/game/v-nement-d-Halloween",
	Start: new Date("2015-10-30T16:00:00Z"),
	Finish: new Date("2015-10-31T07:00:00Z")
}
],
/*
 * Living Story events.
 * Format:
	isEnabled: true, // Manual enable switch
	name_en: "", // Title to show above the list of Living Story timers
	name_de: "",
	name_es: "",
	name_fr: "",
	Start: new Date("2015-09-10T16:00:00Z"), // Living Story timers will be disabled if not within these times
	Finish: new Date("2015-09-14T16:00:00Z")
 */
Story:
{
	isEnabled: true,
	name_en: "Shadow of the Mad King",
	name_de: "Schatten des Verrückten Königs",
	name_es: "La sombra del Rey Loco",
	name_fr: "Ombre du Roi Dément",
	Start: new Date("2015-10-23T07:00:00Z"),
	Finish: new Date("2015-10-31T07:00:00Z")
},
/*
 * GW2 gem store sale items.
 * Format:
	url: "", // Usually a wiki link to that item
	img: "", // ArenaNet hosted item image
	quantity: 1, // Batch sales
	pricenew: 400, // Gems quantity
	priceold: 800
 */
Sale: {
	isPreshown: false, // If true, will show the items on sale without needing user click toggle
	Start: new Date("2015-10-06T16:00:00Z"),
	Finish: new Date("2015-11-03T16:00:00Z"),
	range: "500-3500",
	Items: [
	/*{
		url: "http://wiki.guildwars2.com/wiki/Gem",
		img: "./img/ui/gem.png",
		quantity: 1,
		pricenew: 100,
		priceold: 0,
		col: 1,
		isExample: true
	},*/
	{
		url: "http://wiki.guildwars2.com/wiki/Crystal_Arbiter_Appearance_Pack",
		img: "http://i.imgur.com/AuYSBAV.png",
		quantity: 1,
		pricenew: 2000,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Bat_Wings_Glider_Combo",
		img: "http://i.imgur.com/iVa4PwL.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Butterfly Wings Backpack",
		img: "https://render.guildwars2.com/file/DF22D8F8EFF9FC476372020D4F3555A7074F7521/1024006.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Harbinger_of_Mordremoth_Outfit",
		img: "https://render.guildwars2.com/file/806576D20DA0426BB1D8E55A1CC50AF52806C33A/1024051.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Executioner's_Outfit",
		img: "https://render.guildwars2.com/file/606BC169F95F7FF8470DD2CE6D30016AD5B646EA/648164.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Bloody_Prince's_Outfit",
		img: "https://render.guildwars2.com/file/0297679A65D858DFC61B9C02ECC4964FDEC7AA1A/648158.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Mad_King's_Outfit",
		img: "https://render.guildwars2.com/file/041DC1695CF0DD1A4438D45ACB036C510E1AFFB4/499488.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Witch's_Outfit",
		img: "https://render.guildwars2.com/file/F90DEF6BD1FA9EE60DC93BA31B0D367EBA60EC7A/499499.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Raiment_of_the_Lich",
		img: "https://render.guildwars2.com/file/5A4C04B84D5C7BA4CB7E7C0804D83FC0EE38BA1B/882252.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Character_Jump_Start",
		img: "http://i.imgur.com/k4DetY1.png",
		quantity: 1,
		pricenew: 3500,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Permanent_Mad_King_Finisher",
		img: "https://render.guildwars2.com/file/FBF45CE54777DF1FF4940EA1A6083658A574727F/499519.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Permanent_Scarecrow_Finisher",
		img: "https://render.guildwars2.com/file/3849FBC850B9A872FBEFEFF5F852AE4434F33D51/499518.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Costumed_Mini_3-Pack",
		img: "https://render.guildwars2.com/file/29F135C235EDCCCCB3C714B70D24EEB907F69B5A/648175.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Miniature_Spooky_Trio",
		img: "https://render.guildwars2.com/file/37DEE7E6294BD4D9345001C750BB37991A1931B8/499442.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Bone_Pick",
		img: "https://render.guildwars2.com/file/9827C507181C6B305EA026C2F1EB7448AA390CD5/638367.png",
		quantity: 1,
		pricenew: 1000,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Tireless_Harvesting_Minion",
		img: "https://render.guildwars2.com/file/66A0544916B86F1E00F173ABB9555FC6FDCECBE0/882264.png",
		quantity: 1,
		pricenew: 1000,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Tireless_Logging_Minion",
		img: "https://render.guildwars2.com/file/20A17F9B7356EE37FEB1003B66D46DBF755B4D91/882250.png",
		quantity: 1,
		pricenew: 1000,
		priceold: 0,
		col: 1
	}
	]
}
};
