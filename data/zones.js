/* This file is used by gw2t.js and is based on http://atlas.guildwars2.com
 * Contains PVE map zone, region, and dailies data.
 */

var GW2T_REGION_DATA = {
"wastes": { en: "Maguuma Wastes", de: "Maguuma-Einöde", es: "Páramos Maguuma", fr: "Contrées sauvages de Maguuma" },
"maguuma": { en: "Maguuma", de: "Maguuma", es: "Maguuma", fr: "Maguuma" },
"kryta": { en: "Kryta", de: "Kryta", es: "Kryta", fr: "Kryte" },
"orr": { en: "Orr", de: "Orr", es: "Orr", fr: "Orr" },
"shiverpeaks": { en: "Shiverpeaks", de: "Zittergipfelgebirge", es: "Picosescalofriantes", fr: "Cimefroides" },
"ascalon": { en: "Ascalon", de: "Ascalon", es: "Ascalon", fr: "Ascalon" }
};

/*
 * This associates the zone's nick with their ID number in the API JSON for
 * access in constant time.
 */
var GW2T_ZONE_ASSOCIATION = {
	"15": "queensdale",
	"17": "harathi",
	"18": "divinity",
	"19": "ashford",
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
 * Zones are sorted by how far from the top left corner (0,0) it is.
 */
var GW2T_ZONE_DATA = {
"silverwastes":
{
	name_en: "The Silverwastes",
	name_de: "Die Silberwüste",
	name_es: "Los Páramos Argentos",
	name_fr: "Les Contrées sauvages d'Argent",
	region: "wastes",
	rect: [[3838, 14206], [5886, 15742]]
},
"dry":
{
	name_en: "Dry Top",
	name_de: "Trockenkuppe",
	name_es: "Cima Seca",
	name_fr: "Cimesèche",
	region: "wastes",
	rect: [[3840, 15742], [5888, 17152]]//[3840, 14592]
},
"rata":
{
	name_en: "Rata Sum",
	name_de: "Rata Sum",
	name_es: "Rata Sum",
	name_fr: "Rata Sum",
	region: "maguuma",
	rect: [[4608, 19710], [7168, 22270]]
},
"brisban":
{
	name_en: "Brisban Wildlands",
	name_de: "Brisban-Wildnis",
	name_es: "Selvas Brisbanas",
	name_fr: "Terres sauvages de Brisban",
	region: "maguuma",
	rect: [[5888, 14464], [9344, 17152]]
},
"metrica":
{
	name_en: "Metrica Province",
	name_de: "Provinz Metrica",
	name_es: "Provincia de Métrica",
	name_fr: "Province de Metrica",
	region: "maguuma",
	rect: [[7168, 17152], [9344, 20480]]
},
"caledon":
{
	name_en: "Caledon Forest",
	name_de: "Caledon-Wald",
	name_es: "Bosque de Caledon",
	name_fr: "Forêt de Caledon",
	region: "maguuma",
	rect: [[9344, 16128], [11264, 20096]]
},
"kessex":
{
	name_en: "Kessex Hills",
	name_de: "Kessex-Hügel",
	name_es: "Colinas Kessex",
	name_fr: "Collines de Kessex",
	region: "kryta",
	rect: [[9344, 14080], [13440, 16128]]
},
"grove":
{
	name_en: "The Grove",
	name_de: "Der Hain",
	name_es: "La Arboleda",
	name_fr: "Le Bosquet",
	region: "maguuma",
	rect: [[9728, 20096], [11136, 22144]]
},
"queensdale":
{
	name_en: "Queensdale",
	name_de: "Königintal",
	name_es: "Valle de la Reina",
	name_fr: "La Vallée de la reine",
	region: "kryta",
	rect: [[9856, 11648], [13440, 14080]]
},
"cursed":
{
	name_en: "Cursed Shore",
	name_de: "Fluchküste",
	name_es: "Ribera Maldita",
	name_fr: "Rivage maudit",
	region: "orr",
	rect: [[10112, 25216], [12160, 29312]]
},
"divinity":
{
	name_en: "Divinity's Reach",
	name_de: "Götterfels",
	name_es: "Linde de la Divinidad",
	name_fr: "Le Promontoire divin",
	region: "kryta",
	rect: [[10240, 9856], [12160, 11648]]
},
"malchor":
{
	name_en: "Malchor's Leap",
	name_de: "Malchors Sprung",
	name_es: "Salto de Malchor",
	name_fr: "Saut de Malchor",
	region: "orr",
	rect: [[10368, 23168], [14464, 25216]]
},
"southsun":
{
	name_en: "Southsun Cove",
	name_de: "Südlicht-Bucht",
	name_es: "Cala del Sol Austral",
	name_fr: "Crique de Sud-Soleil",
	region: "kryta",
	rect: [[11520, 18944], [14208, 20736]]
},
"harathi":
{
	name_en: "Harathi Hinterlands",
	name_de: "Harathi-Hinterland",
	name_es: "Interior Harathi",
	name_fr: "Hinterlands harathis",
	region: "kryta",
	rect: [[13440, 9472], [16640, 12288]]
},
"gendarran":
{
	name_en: "Gendarran Fields",
	name_de: "Gendarran-Felder",
	name_es: "Campos de Gendarran",
	name_fr: "Champs de Gendarran",
	region: "kryta",
	rect: [[13440, 12288], [17664, 14336]]
},
"straits":
{
	name_en: "Straits of Devastation",
	name_de: "Meerenge der Verwüstung",
	name_es: "Estrechos de la Devastación",
	name_fr: "Détroit de la Dévastation",
	region: "orr",
	rect: [[14464, 22400], [17792, 25216]]
},
"lion":
{
	name_en: "Lion's Arch",
	name_de: "Löwenstein",
	name_es: "Arco del León",
	name_fr: "L'Arche du Lion",
	region: "kryta",
	rect: [[15232, 14336], [17664, 15872]]
},
"bloodtide":
{
	name_en: "Bloodtide Coast",
	name_de: "Blutstrom-Küste",
	name_es: "Costa Mareasangrienta",
	name_fr: "Côte de la marée sanglante",
	region: "kryta",
	rect: [[15232, 15872], [17664, 19072]]
},
"sparkfly":
{
	name_en: "Sparkfly Fen",
	name_de: "Funkenschwärmersumpf",
	name_es: "Pantano de las Centellas",
	name_fr: "Marais de Lumillule",
	region: "maguuma",
	rect: [[15232, 19072], [17792, 22400]]
},
"lornar":
{
	name_en: "Lornar's Pass",
	name_de: "Lornars Pass",
	name_es: "Paso de Lornar",
	name_fr: "Passage de Lornar",
	region: "shiverpeaks",
	rect: [[17664, 13312], [19456, 18176]]
},
"snowden":
{
	name_en: "Snowden Drifts",
	name_de: "Schneekuhlenhöhen",
	name_es: "Cúmulos de Guaridanieve",
	name_fr: "Congères d'Antreneige",
	region: "shiverpeaks",
	rect: [[17664, 11264], [21760, 13312]]
},
"maelstrom":
{
	name_en: "Mount Maelstrom",
	name_de: "Mahlstromgipfel",
	name_es: "Monte Vorágine",
	name_fr: "Mont Maelström",
	region: "maguuma",
	rect: [[17792, 21376], [21632, 23808]]
},
"timberline":
{
	name_en: "Timberline Falls",
	name_de: "Baumgrenzen-Fälle",
	name_es: "Cataratas de Linarbórea",
	name_fr: "Chutes de la Canopée",
	region: "shiverpeaks",
	rect: [[18944, 18176], [21248, 21376]]
},
"hoelbrak":
{
	name_en: "Hoelbrak",
	name_de: "Hoelbrak",
	name_es: "Hoelbrak",
	name_fr: "Hoelbrak",
	region: "shiverpeaks",
	rect: [[19456, 13312], [21760, 14976]]
},
"dredgehaunt":
{
	name_en: "Dredgehaunt Cliffs",
	name_de: "Schauflerschreck-Klippen",
	name_es: "Acantilados de Guaridadraga",
	name_fr: "Falaises de Hantedraguerre",
	region: "shiverpeaks",
	rect: [[19456, 14976], [21760, 18176]]
},
"frostgorge":
{
	name_en: "Frostgorge Sound",
	name_de: "Eisklamm-Sund",
	name_es: "Estrecho de Gorjaescarcha",
	name_fr: "Détroit des gorges glacées",
	region: "shiverpeaks",
	rect: [[20736, 8192], [23808, 11264]]
},
"wayfarer":
{
	name_en: "Wayfarer Foothills",
	name_de: "Wanderer-Hügel",
	name_es: "Colinas del Caminante",
	name_fr: "Contreforts du Voyageur",
	region: "shiverpeaks",
	rect: [[21760, 11264], [23552, 15872]]
},
"citadel":
{
	name_en: "Black Citadel",
	name_de: "Schwarze Zitadelle",
	name_es: "Ciudadela Negra",
	name_fr: "La Citadelle noire",
	region: "ascalon",
	rect: [[23552, 13568], [25088, 15616]]
},
"diessa":
{
	name_en: "Diessa Plateau",
	name_de: "Diessa-Plateau",
	name_es: "Meseta de Diessa",
	name_fr: "Plateau de Diessa",
	region: "ascalon",
	rect: [[23552, 11264], [27136, 13568]]
},
"fireheart":
{
	name_en: "Fireheart Rise",
	name_de: "Feuerherzhügel",
	name_es: "Colina del Corazón de Fuego",
	name_fr: "Montée de Flambecœur",
	region: "ascalon",
	rect: [[23808, 8448], [27136, 11264]]
},
"ashford":
{
	name_en: "Plains of Ashford",
	name_de: "Ebenen von Aschfurt",
	name_es: "Llanuras de Ashford",
	name_fr: "Plaines d'Ashford",
	region: "ascalon",
	rect: [[25088, 13568], [29184, 15616]]
},
"marches":
{
	name_en: "Iron Marches",
	name_de: "Eisenmark",
	name_es: "Fronteras de Hierro",
	name_fr: "Marais de fer",
	region: "ascalon",
	rect: [[27136, 9472], [29184, 13568]]
},
"fields":
{
	name_en: "Fields of Ruin",
	name_de: "Felder der Verwüstung",
	name_es: "Campos de la Ruina",
	name_fr: "Champs de Ruine",
	region: "ascalon",
	rect: [[28672, 16256], [31744, 19328]]
},
"blazeridge":
{
	name_en: "Blazeridge Steppes",
	name_de: "Flammenkamm-Steppe",
	name_es: "Estepas Crestafulgurante",
	name_fr: "Les Steppes de la Strie flamboyante",
	region: "ascalon",
	rect: [[29184, 12160], [31232, 16256]]
}
};

/*
 * A month's achievements with associated days. Example of format:
 * pve: ["GATHER REGION", "ACTIVITY CONDITIONALREGION", "EVENTREGION", "BOSS REGION"],
 * pvp: ["PVP1", "PVP2", "PROFESSION1", "PROFESSION2"],
 * wvw: ["WVW1", "WVW2", "WVW3", "WVW4"]
 */
var GW2T_DAILY_CALENDAR = {
"1": {
	pve: ["Forager Orr", "Forger", "Sparkfly", "Wurm Maguuma"],
	pvp: ["Kills", "Capture", "Thief", "Engineer"],
	wvw: ["Guard", "Creature", "Keep", "Defender"]
},
"2": {
	pve: ["Miner Maguuma", "Fractal", "Harathi", "SB Kryta"],
	pvp: ["Rank", "Defender", "Guardian", "Engineer"],
	wvw: ["Spender", "Ruins", "Camp", "Keep"]
},
"3": {
	pve: ["Lumberer Kryta", "Vista Kryta", "Metrica", "Fractal 1-10"],
	pvp: ["Reward", "Defender", "Thief", "Warrior"],
	wvw: ["Land", "Creature", "Defender", "Tower"]
},
"4": {
	pve: ["Miner Shiverpeaks", "Activity", "Kessex", "Maw Shiverpeaks"],
	pvp: ["Rank", "Kills", "Ranger", "Warrior"],
	wvw: ["Ruins", "Guard", "Defender", "Camp"]
},
"5": {
	pve: ["Forager Ascalon", "Vista Wastes", "Malchor", "FE Maguuma"],
	pvp: ["Capture", "Rank", "Guardian", "Engineer"],
	wvw: ["Land", "Kills", "Tower", "Defender"]
},
"6": {
	pve: ["Miner Shiverpeaks", "Vista Maguuma", "Snowden", "Golem Maguuma"],
	pvp: ["Defender", "Kills", "Thief", "Warrior"],
	wvw: ["Ruins", "Guard", "Camp", "Tower"]
},
"7": {
	pve: ["Lumberer Kryta", "Activity", "Dredgehaunt", "FE Maguuma"],
	pvp: ["Reward", "Rank", "Ranger", "Elementalist"],
	wvw: ["Ruins", "Kills", "Tower", "Defender"]
},
"8": {
	pve: ["Miner Kryta", "Vista Ascalon", "Frostgorge", "Fractal 1-10"],
	pvp: ["Capture", "Kills", "Guardian", "Engineer"],
	wvw: ["Land", "Caravan", "Defender", "Keep"]
},
"9": {
	pve: ["Lumberer Ascalon", "Forger", "Ashford", "SB Kryta"],
	pvp: ["Capture", "Defender", "Thief", "Engineer"],
	wvw: ["Ruins", "Spender", "Camp", "Tower"]
},
"10": {
	pve: ["Forager Kryta", "Fractal", "Brisban", "Fractal 21-30"],
	pvp: ["Rank", "Kills", "Thief", "Necromancer"],
	wvw: ["Caravan", "Ruins", "Camp", "Keep"]
},
"11": {
	pve: ["Lumberer Ascalon", "Activity", "Wayfarer", "FE Maguuma"],
	pvp: ["Rank", "Reward", "Ranger", "Engineer"],
	wvw: ["Caravan", "Guard", "Defender", "Tower"]
},
"12": {
	pve: ["Miner Ascalon", "Forger", "Sparkfly", "Fractal 1-10"],
	pvp: ["Capture", "Kills", "Guardian", "Elementalist"],
	wvw: ["Spender", "Kills", "Keep", "Defender"]
},
"13": {
	pve: ["Forager Orr", "Vista Kryta", "Snowden", "Shatterer Ascalon"],
	pvp: ["Defender", "Rank", "Thief", "Necromancer"],
	wvw: ["Land", "Kills", "Tower", "Camp"]
},
"14": {
	pve: ["Miner Kryta", "Fractal", "Bloodtide", "Megades Maguuma"],
	pvp: ["Kills", "Reward", "Mesmer", "Elementalist"],
	wvw: ["Guard", "Ruins", "Tower", "Defender"]
},
"15": {
	pve: ["Lumberer Maguuma", "Vista Maguuma", "Kessex", "Fractal 1-10"],
	pvp: ["Rank", "Capture", "Guardian", "Elementalist"],
	wvw: ["Creature", "Caravan", "Camp", "Tower"]
},
"16": {
	pve: ["Forager Maguuma", "Forger", "Queensdale", "Wurm Maguuma"],
	pvp: ["Defender", "Capture", "Thief", "Engineer"],
	wvw: ["Land", "Ruins", "Keep", "Camp"]
},
"17": {
	pve: ["Lumberer Kryta", "Vista Ascalon", "Silverwastes", "Fractal 11-20"],
	pvp: ["Capture", "Rank", "Guardian", "Necromancer"],
	wvw: ["Spender", "Land", "Tower", "Defender"]
},
"18": {
	pve: ["Miner Ascalon", "Vista Kryta", "Marches", "Maw Shiverpeaks"],
	pvp: ["Reward", "Kills", "Mesmer", "Warrior"],
	wvw: ["Guard", "Kills", "Defender", "Camp"]
},
"19": {
	pve: ["Forager Kryta", "Vista Shiverpeaks", "Bloodtide", "SB Kryta"],
	pvp: ["Capture", "Defender", "Guardian", "Necromancer"],
	wvw: ["Spender", "Ruins", "Camp", "Tower"]
},
"20": {
	pve: ["Miner Shiverpeaks", "Activity", "Caledon", "Jormag Shiverpeaks"],
	pvp: ["Defender", "Reward", "Ranger", "Elementalist"],
	wvw: ["Ruins", "Creature", "Camp", "Keep"]
},
"21": {
	pve: ["Lumberer Ascalon", "Vista Maguuma", "Southsun", "Maw Shiverpeaks"],
	pvp: ["Reward", "Kills", "Guardian", "Warrior"],
	wvw: ["Land", "Caravan", "Keep", "Defender"]
},
"22": {
	pve: ["Miner Shiverpeaks", "Fractal", "Fields", "SB Kryta"],
	pvp: ["Rank", "Defender", "Thief", "Warrior"],
	wvw: ["Guard", "Kills", "Tower", "Camp"]
},
"23": {
	pve: ["Forager Ascalon", "Forger", "Frostgorge", "Fractal 1-10"],
	pvp: ["Rank", "Capture", "Thief", "Engineer"],
	wvw: ["Caravan", "Land", "Keep", "Camp"]
},
"24": {
	pve: ["Miner Ascalon", "Vista Ascalon", "Sparkfly", "Golem Maguuma"],
	pvp: ["Reward", "Kills", "Mesmer", "Engineer"],
	wvw: ["Ruins", "Caravan", "Defender", "Camp"]
},
"25": {
	pve: ["Lumberer Kryta", "Vista Shiverpeaks", "Wayfarer", "Wurm Maguuma"],
	pvp: ["Reward", "Defender", "Ranger", "Elementalist"],
	wvw: ["Caravan", "Spender", "Camp", "Tower"]
},
"26": {
	pve: ["Miner Maguuma", "Fractal", "Brisban", "Fractal 1-10"],
	pvp: ["Kills", "Capture", "Guardian", "Elementalist"],
	wvw: ["Land", "Caravan", "Tower", "Keep"]
},
"27": {
	pve: ["Lumberer Kryta", "Activity", "Metrica", "Maw Shiverpeaks"],
	pvp: ["Defender", "Rank", "Guardian", "Engineer"],
	wvw: ["Ruins", "Land", "Camp", "Tower"]
},
"28": {
	pve: ["Miner Shiverpeaks", "Vista Kryta", "Gendarran", "FE Maguuma"],
	pvp: ["Rank", "Kills", "Thief", "Warrior"],
	wvw: ["Guard", "Caravan", "Defender", "Keep"]
},
"29": {
	pve: ["Lumberer Kryta", "Vista Shiverpeaks", "Snowden", "Fractal 11-20"],
	pvp: ["Defender", "Kills", "Mesmer", "Elementalist"],
	wvw: ["Ruins", "Kills", "Camp", "Tower"]
},
"30": {
	pve: ["Forager Kryta", "Vista Orr", "Kessex", "Jormag Shiverpeaks"],
	pvp: ["Reward", "Rank", "Ranger", "Elementalist"],
	wvw: ["Caravan", "Spender", "Camp", "Defender"]
},
"31": {
	pve: ["Miner Shiverpeaks", "Forger", "Timberline", "Golem Maguuma"],
	pvp: ["Defender", "Reward", "Guardian", "Engineer"],
	wvw: ["Spender", "Land", "Tower", "Defender"]
}
};