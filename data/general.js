/*
 * This file is used by http://gw2timer.com
 * Contains Kryta continent map zone, region, dailies, and countdown data.
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
 * Images that are overlayed on the map, such as underground areas.
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
	pve: ["Lumberer Ascalon", "Fractal", "Malchor", "Fractal 1-10"],
	pvp: ["Kills", "Reward", "War Necro", "Thief Mes"],
	wvw: ["Ruins", "Creature", "Camp", "Defender"]
},
"2": {
	pve: ["Lumberer Jungle", "Forger", "Metrica", "Fractal 1-10"],
	pvp: ["Kills", "Capture", "War Engi", "Ranger Engi"],
	wvw: ["Land", "Guard", "Camp", "Tower"]
},
"3": {
	pve: ["Miner Wastes", "Activity", "Brisban", "Fractal 1-10"],
	pvp: ["Rank", "Defender", "Ele Mes", "Guard Thief"],
	wvw: ["Creature", "Ruins", "Tower", "Defender"]
},
"4": {
	pve: ["Forager Ascalon", "Vista Ascalon", "Fields", "Fractal 1-10"],
	pvp: ["Defender", "Capture", "Engi Thief", "Ranger Engi"],
	wvw: ["Spender", "Land", "Camp", "Keep"]
},
"5": {
	pve: ["Lumberer Ascalon", "Forger", "Caledon", "Fractal 11-20"],
	pvp: ["Reward", "Kills", "War Guard", "Ranger Engi"],
	wvw: ["Ruins", "Land", "Keep", "Defender"]
},
"6": {
	pve: ["Miner Shiverpeaks", "Fractal", "Snowden", "Fractal 1-10"],
	pvp: ["Rank", "Reward", "Ranger Thief", "Engi Ele"],
	wvw: ["Caravan", "Kills", "Camp", "Tower"]
},
"7": {
	pve: ["Forager Kryta", "Vista Orr", "Wayfarer", "Fractal 1-10"],
	pvp: ["Capture", "Reward", "War Ranger", "Guard Necro"],
	wvw: ["Land", "Guard", "Defender", "Tower"]
},
"8": {
	pve: ["Lumberer Ascalon", "Forger", "Fields", "Fractal 21-30"],
	pvp: ["Defender", "Capture", "Ranger Mes", "Guard Engi"],
	wvw: ["Land", "Spender", "Camp", "Keep"]
},
"9": {
	pve: ["Miner Jungle", "Activity", "Timberline", "Fractal 1-10"],
	pvp: ["Rank", "Defender", "War Engi", "Ranger Necro"],
	wvw: ["Ruins", "Guard", "Keep", "Camp"]
},
"10": {
	pve: ["Lumberer Shiverpeaks", "Vista Ascalon", "Metrica", "Fractal 31-40"],
	pvp: ["Kills", "Rank", "Ele Mes", "Guard Thief"],
	wvw: ["Caravan", "Kills", "Defender", "Keep"]
},
"11": {
	pve: ["Miner Jungle", "Fractal", "Frostgorge", "Fractal 1-10"],
	pvp: ["Capture", "Reward", "Engi Thief", "Ele Necro"],
	wvw: ["Land", "Caravan", "Camp", "Tower"]
},
"12": {
	pve: ["Forager Jungle", "Forger", "Southsun", "Fractal 1-10"],
	pvp: ["Capture", "Defender", "War Thief", "Guard Ranger"],
	wvw: ["Spender", "Guard", "Tower", "Defender"]
},
"13": {
	pve: ["Lumberer Kryta", "Vista Kryta", "Snowden", "Fractal 21-30"],
	pvp: ["Rank", "Defender", "Engi Mes", "Guard Ele"],
	wvw: ["Land", "Spender", "Camp", "Defender"]
},
"14": {
	pve: ["Lumberer Ascalon", "Fractal", "Fields", "Fractal 1-10"],
	pvp: ["Reward", "Kills", "War Ele", "Engi Necro"],
	wvw: ["Kills", "Land", "Keep", "Camp"]
},
"15": {
	pve: ["Forager Ascalon", "Activity", "Bloodtide", "Fractal 1-10"],
	pvp: ["Defender", "Rank", "Thief Ele", "Guard Mes"],
	wvw: ["Land", "Caravan", "Camp", "Defender"]
},
"16": {
	pve: ["Lumberer Kryta", "Vista Ascalon", "Metrica", "Fractal 1-10"],
	pvp: ["Kills", "Capture", "War Mes", "Ranger Necro"],
	wvw: ["Land", "Guard", "Tower", "Camp"]
},
"17": {
	pve: ["Lumberer Jungle", "Activity", "Dredgehaunt", "Fractal 1-10"],
	pvp: ["Kills", "Defender", "Thief Necro", "Ele Ranger"],
	wvw: ["Caravan", "Land", "Tower", "Defender"]
},
"18": {
	pve: ["Forager Jungle", "Forger", "Plains", "Fractal 1-10"],
	pvp: ["Reward", "Capture", "War Necro", "Thief Mes"],
	wvw: ["Land", "Guard", "Defender", "Camp"]
},
"19": {
	pve: ["Lumberer Ascalon", "Activity", "Kessex", "Golem"],
	pvp: ["Reward", "Rank", "War Guard", "Ranger Engi"],
	wvw: ["Kills", "Ruins", "Camp", "Defender"]
},
"20": {
	pve: ["Miner Ascalon", "Vista Maguuma", "Frostgorge", "SB"],
	pvp: ["Rank", "Defender", "Ranger Thief", "Engi Ele"],
	wvw: ["Guard", "Caravan", "Keep", "Tower"]
},
"21": {
	pve: ["Lumberer Kryta", "Fractal", "Metrica", "Fractal 1-10"],
	pvp: ["Kills", "Rank", "War Ranger", "Guard Necro"],
	wvw: ["Ruins", "Kills", "Tower", "Camp"]
},
"22": {
	pve: ["Miner Shiverpeaks", "Vista Wastes", "Snowden", "Shatterer"],
	pvp: ["Reward", "Capture", "Ranger Mes", "Guard Engi"],
	wvw: ["Guard", "Caravan", "Keep", "Camp"]
},
"23": {
	pve: ["Forager Ascalon", "Forger", "Kessex", "SB"],
	pvp: ["Kills", "Rank", "War Engi", "Ranger Necro"],
	wvw: ["Land", "Creature", "Tower", "Defender"]
},
"24": {
	pve: ["Miner Shiverpeaks", "Vista Orr", "Sparkfly", "Fractal 11-20"],
	pvp: ["Capture", "Reward", "Ele Mes", "Guard Thief"],
	wvw: ["Ruins", "Land", "Defender", "Keep"]
},
"25": {
	pve: ["Lumberer Wastes", "Fractal", "Harathi", "Wurm"],
	pvp: ["Reward", "Capture", "Engi Thief", "Ele Necro"],
	wvw: ["Guard", "Ruins", "Keep", "Camp"]
},
"26": {
	pve: ["Forager Kryta", "Vista Kryta", "Wayfarer", "Jormag"],
	pvp: ["Capture", "Defender", "War Thief", "Guard Ranger"],
	wvw: ["Ruins", "Land", "Tower", "Camp"]
},
"27": {
	pve: ["Miner Ascalon", "Vista Shiverpeaks", "Harathi", "Fractal 1-10"],
	pvp: ["Defender", "Rank", "Engi Mes", "Guard Ele"],
	wvw: ["Caravan", "Creature", "Defender", "Camp"]
},
"28": {
	pve: ["Lumberer Kryta", "Forger", "Queensdale", "Golem"],
	pvp: ["Capture", "Rank", "War Ele", "Engi Necro"],
	wvw: ["Spender", "Caravan", "Camp", "Keep"]
},
"29": {
	pve: ["Lumberer Kryta", "Fractal", "Maelstrom", "Fractal 1-10"],
	pvp: ["Defender", "Reward", "Thief Ele", "Guard Mes"],
	wvw: ["Land", "Caravan", "Defender", "Tower"]
},
"30": {
	pve: ["Forager Orr", "Vista Wastes", "Plains", "Fractal 11-20"],
	pvp: ["Capture", "Kills", "War Mes", "Guard Necro"],
	wvw: ["Spender", "Land", "Defender", "Camp"]
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

Announcement: "Have a website or a guild? <a href='http://forum.renaka.com/topic/5547304/'>Add a GW2Timer</a> clock or feature to it! "
	+ "<a title='Deutsch' href='http://gw2timer.com/?enu_Language=de'><img src='img/ui/sixteen/langde.png' /></a> "
	+ "<a title='Español' href='http://gw2timer.com/?enu_Language=es'><img src='img/ui/sixteen/langes.png' /></a> "
	+ "<a title='Français' href='http://gw2timer.com/?enu_Language=fr'><img src='img/ui/sixteen/langfr.png' /></a> "
	+ "<a title='繁體中文' href='http://gw2timer.com/?enu_Language=zh'><img src='img/ui/sixteen/langzh.png' /></a>",

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
	name_en: "Guild Week: Expeditions, Missions",
	name_de: "Gilden-Woche: Expeditionen, Missionen",
	name_es: "Semana de clan: Expediciones, Misiónes",
	name_fr: "Semaine de guilde: Expéditions, Missions",
	news: "welcome-to-guild-week",
	Start: new Date("2015-09-29T19:00:00Z"),
	Finish: new Date("2015-09-29T19:30:00Z")
},
{
	name_en: "Guild Week: Hall, Upgrades",
	name_de: "Gilden-Woche: Halle, Aufwertungen",
	name_es: "Semana de clan: Sala, Mejoras",
	name_fr: "Semaine de guilde: Hall, Améliorations",
	news: "welcome-to-guild-week",
	Start: new Date("2015-09-30T19:00:00Z"),
	Finish: new Date("2015-09-30T19:30:00Z")
},
{
	name_en: "Guild Week: Items, Arenas",
	name_de: "Gilden-Woche: Gegenständen, Arenen",
	name_es: "Semana de clan: Objetos, Arenas",
	name_fr: "Semaine de guilde: Objets, Arènes",
	news: "welcome-to-guild-week",
	Start: new Date("2015-10-01T19:00:00Z"),
	Finish: new Date("2015-10-01T19:30:00Z")
},
{
	name_en: "Final Beta Weekend",
	name_de: "Letzte Beta Weekend",
	name_es: "Último beta de fin de semana",
	name_fr: "Dernier week-end de bêta",
	news: "the-final-beta-weekend-event-begins-october-2",
	Start: new Date("2015-10-02T17:00:00Z"),
	Finish: new Date("2015-10-05T07:00:00Z")
},
{
	name_en: "Heart of Thorns Release",
	name_de: "Heart of Thorns Erscheinungs",
	name_es: "Heart of Thorns lanzamiento",
	name_fr: "Heart of Thorns sortie",
	url: "https://heartofthorns.guildwars2.com/",
	Start: new Date("2015-10-23T07:00:00Z"),
	Finish: new Date("2015-10-24T07:00:00Z")
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
	isEnabled: false,
	name_en: "Mordremoth's Minions Invade Tyria",
	name_de: "Mordremoths Diener fallen in Tyria ein",
	name_es: "Los siervos de Mordremoth invaden Tyria",
	name_fr: "Les serviteurs de Mordremoth envahissent la Tyrie",
	Start: new Date("2015-09-10T16:00:00Z"),
	Finish: new Date("2015-09-14T16:00:00Z")
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
	isPreshown: false,
	Start: new Date("2015-09-28T16:00:00Z"),
	Finish: new Date("2015-09-29T16:00:00Z"),
	Range: [25, 1000], // Gem price of the cheapest and most expensive item
	Items: [
	{
		url: "http://wiki.guildwars2.com/wiki/Gem",
		img: "./img/ui/gem.png",
		quantity: 1,
		pricenew: 100,
		priceold: 0,
		col: 1,
		isExample: true
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Frost_Wasp_Logging_Tool",
		img: "https://render.guildwars2.com/file/0227CB6C96D2AC7FC20B6D465478E9BBF3ED09D9/771066.png",
		quantity: 1,
		pricenew: 1000,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Fused_Molten_Logging_Axe",
		img: "https://render.guildwars2.com/file/E31818DD403BE127B29E214C7956BFA301F680DA/866829.png",
		quantity: 1,
		pricenew: 1000,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Fused_Molten_Sickle",
		img: "https://render.guildwars2.com/file/51782971EFC6B80F4B5BD0FB080D0CFFA37B1576/866830.png",
		quantity: 1,
		pricenew: 1000,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Molten_Alliance_Mining_Pick",
		img: "https://render.guildwars2.com/file/ACF90CA6BCD9CEEFD4D0DCEF2AA87C97B50BDC56/561815.png",
		quantity: 1,
		pricenew: 1000,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Zodiac_Light_Armor_Skin",
		img: "https://render.guildwars2.com/file/9A22FCFF1B3DDC290D5360DAC77595C86D36F9F8/740304.png",
		quantity: 1,
		pricenew: 800,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Zodiac_Medium_Armor_Skin",
		img: "https://render.guildwars2.com/file/CACA37AA4734936B5E062003940CAB4B11092F6C/740303.png",
		quantity: 1,
		pricenew: 800,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Zodiac_Heavy_Armor_Skin",
		img: "https://render.guildwars2.com/file/2793703E07C7E0D15EA2EE95E6C116DA75674F0C/740302.png",
		quantity: 1,
		pricenew: 800,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Profane_Light_Armor_Skin",
		img: "https://render.guildwars2.com/file/0DA0BEC80AF6FEBA33ABB8D463B00FB8F3F3D861/455867.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Krytan_Medium_Armor_Skin",
		img: "https://render.guildwars2.com/file/0793E7E47832AFFBFAA71A6801066E2A41606BBA/455866.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Primeval_Heavy_Armor_Skin",
		img: "https://render.guildwars2.com/file/D57103D6520ECFC07DBA564E5E76F13D96B8B1E7/455865.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 0
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Glowing_Crimson_Mask",
		img: "https://render.guildwars2.com/file/D506EF430E4BAA75E96095DED5665D6EFDBF79BC/771056.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Mask_of_the_Crown",
		img: "https://render.guildwars2.com/file/30EB5309B29F55DB5E060906C660A598A132E842/619590.png",
		quantity: 1,
		pricenew: 400,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Warrior_Quaggan_Backpack_Cover",
		img: "https://render.guildwars2.com/file/ADE839C7FBDE9B18EE07E21FD4B8AC7BA06E29EE/543837.png",
		quantity: 1,
		pricenew: 300,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Fuzzy_Bear_Hat",
		img: "https://render.guildwars2.com/file/D33AB44B1C0DDBFD3D0DB5CDB139D618AF0FE6B2/587062.png",
		quantity: 1,
		pricenew: 200,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Fuzzy_Leopard_Hat",
		img: "https://render.guildwars2.com/file/C4020218F1437D6E154DBE497F9D66B0D6294E17/771064.png",
		quantity: 1,
		pricenew: 200,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Sailor's_Beanie",
		img: "https://render.guildwars2.com/file/6BDB0CE00EB895C9375F1F7336CCB80F0265BD35/220579.png",
		quantity: 1,
		pricenew: 200,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Top_Hat",
		img: "https://render.guildwars2.com/file/B261FBF12505BBE1210D3FB0EADE00D3E5999A0A/340524.png",
		quantity: 1,
		pricenew: 200,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Reading_Glasses",
		img: "https://render.guildwars2.com/file/01DC5C169EBB7D2467FFC95F01B349FB0F52995B/220573.png",
		quantity: 1,
		pricenew: 150,
		priceold: 0,
		col: 1
	},
	{
		url: "http://wiki.guildwars2.com/wiki/Wintersday_Earmuffs",
		img: "https://render.guildwars2.com/file/E1590ED73D082F950AA2ED44021A7F795D0DD647/526118.png",
		quantity: 1,
		pricenew: 25,
		priceold: 0,
		col: 1
	}
	]
}
};
