/* This file is used by gw2t.js.
 * Contains Mists continent map lands (zone), realm (region), and WvW objectives.
 */

var GW2T_REALM_DATA = {
"pvp": {
	name_en: "Player vs. Player",
	name_de: "Spieler gegen Spieler",
	name_es: "Jugador contra Jugador",
	name_fr: "Joueur contre Joueur",
	color: "gray"
},
"wvw": {
	name_en: "World vs. World",
	name_de: "Welt gegen Welt",
	name_es: "Mundo contra Mundo",
	name_fr: "Monde contre Monde",
	color: "green"
},
"fotm": {
	name_en: "Fractals of the Mists",
	name_de: "Fraktale der Nebel",
	name_es: "Fractales de la Niebla",
	name_fr: "Fractales des Brumes",
	color: "blue"
}
};

/*
 * This associates the land's nick with their ID number in the API JSON for
 * access in constant time.
 */
var GW2T_LAND_ASSOCIATION = {
	"38": "eternal",
	"94": "red",
	"95": "green",
	"96": "blue",
	"350": "lobby",
	"549": "kyhlo",
	"554": "niflhel",
	"795": "foefire",
	"834": "tutorial",
	"872": "fractals",
	"875": "storm",
	"894": "spirit",
	"900": "skyhammer",
	"984": "courtyard",
	"968": "edge"
};

/*
 * Lands are sorted by importance.
 */
var GW2T_LAND_DATA = {
"eternal":
{
	name_en: "Eternal Battlegrounds",
	name_de: "Ewige Schlachtfelder",
	name_es: "Campos de batalla eternos",
	name_fr: "Champs de bataille éternels",
	realm: "wvw",
	rect: [[8958, 12798], [12030, 15870]]
},
"red":
{
	name_en: " Borderlands",
	name_de: " Grenzlande",
	name_es: "Tierras Fronterizas de ",
	name_fr: "Territoires frontaliers ",
	realm: "wvw",
	rect: [[9214, 8958], [11774, 12542]]
},
"green":
{
	name_en: " Borderlands",
	name_de: " Grenzlande",
	name_es: "Tierras Fronterizas de ",
	name_fr: "Territoires frontaliers ",
	realm: "wvw",
	rect: [[5630, 11518], [8190, 15102]]
},
"blue":
{
	name_en: " Borderlands",
	name_de: " Grenzlande",
	name_es: "Tierras Fronterizas de ",
	name_fr: "Territoires frontaliers ",
	realm: "wvw",
	rect: [[12798, 10878], [15358, 14462]]
},
"edge":
{
	name_en: "Edge of the Mists",
	name_de: "Rand der Nebel",
	name_es: "El Borde de la Niebla",
	name_fr: "La lisière des Brumes",
	realm: "wvw",
	rect: [[5994, 8446], [9066, 11518]]
},
"fractals":
{
	name_en: "Fractals of the Mists",
	name_de: "Fraktale der Nebel",
	name_es: "Fractales de la Niebla",
	name_fr: "Fractales des Brumes",
	realm: "fotm",
	rect: [[10880, 3328], [13952, 6400]]
},
"lobby":
{
	name_en: "Heart of the Mists",
	name_de: "Herz der Nebel",
	name_es: "Corazón de la Niebla",
	name_fr: "Cœur des Brumes",
	realm: "pvp",
	rect: [[4865, 6398], [6657, 8190]]
},
"heart":
{
	name_en: "Heart of the Mists",
	name_de: "Herz der Nebel",
	name_es: "Corazón de la Niebla",
	name_fr: "Cœur des Brumes",
	realm: "pvp",
	rect: [[4865, 6398], [6657, 8190]]
},
"kyhlo":
{
	name_en: "Battle of Kyhlo",
	name_de: "Die Schlacht von Kyhlo",
	name_es: "La Batalla de Kyhlo",
	name_fr: "Bataille de Kyhlo",
	realm: "pvp",
	rect: [[3326, 5374], [4094, 6142]]
},
"niflhel":
{
	name_en: "Forest of Niflhel",
	name_de: "Der Wald von Niflhel",
	name_es: "Bosque de Niflhel",
	name_fr: "Forêt de Niflhel",
	realm: "pvp",
	rect: [[7038, 4860], [8062, 5500]]
},
"foefire":
{
	name_en: "Legacy of the Foefire",
	name_de: "Vermächtnis des Feindfeuers",
	name_es: "El Legado del Fuego Enemigo",
	name_fr: "Héritage du Fléau de feu",
	realm: "pvp",
	rect: [[2558, 8190], [3454, 9342]]
},
"storm":
{
	name_en: "Temple of the Silent Storm",
	name_de: "Tempel des stillen Sturms",
	name_es: "Templo de la Tormenta Silenciosa",
	name_fr: "Temple de la Tempête silencieuse",
	realm: "pvp",
	rect: [[4096, 9344], [5120, 9984]]
},
"spirit":
{
	name_en: "Spirit Watch",
	name_de: "Geisterwacht",
	name_es: "Vigilancia del Espíritu",
	name_fr: "Observatoire des Esprits",
	realm: "pvp",
	rect: [[1920, 5248], [2944, 6272]]
},
"skyhammer":
{
	name_en: "Skyhammer",
	name_de: "Hammer des Himmels",
	name_es: "Martillo Celestial",
	name_fr: "Marteau céleste",
	realm: "pvp",
	rect: [[7168, 7422], [8192, 8062]]
},
"courtyard":
{
	name_en: "Courtyard",
	name_de: "Hof",
	name_es: "Patio",
	name_fr: "Cour",
	realm: "pvp",
	rect: [[2048, 7040], [3072, 8064]]
}
};

/*
 * Server translated names for selecting.
 */
var GW2T_SERVER_DATA = {
"1001": {
	name_en: "Anvil Rock",
	name_de: "Rocher de l'enclume",
	name_es: "Amboss-Stein",
	name_fr: "Roca del Yunque"
},
"1002": {
	name_en: "Borlis Pass",
	name_de: "Passage de Borlis",
	name_es: "Borlis-Pass",
	name_fr: "Paso de Borlis"
},
"1003": {
	name_en: "Yak's Bend",
	name_de: "Courbe du Yak",
	name_es: "Yakbiegung",
	name_fr: "Declive del Yak"
},
"1004": {
	name_en: "Henge of Denravi",
	name_de: "Cromlech de Denravi",
	name_es: "Steinkreis von Denravi",
	name_fr: "Círculo de Denravi"
},
"1005": {
	name_en: "Maguuma",
	name_de: "Maguuma",
	name_es: "Maguuma",
	name_fr: "Maguuma"
},
"1006": {
	name_en: "Sorrow's Furnace",
	name_de: "Fourneau des lamentations",
	name_es: "Hochofen der Betrübnis",
	name_fr: "Fragua del Pesar"
},
"1007": {
	name_en: "Gate of Madness",
	name_de: "Porte de la folie",
	name_es: "Tor des Wahnsinns",
	name_fr: "Puerta de la Locura"
},
"1008": {
	name_en: "Jade Quarry",
	name_de: "Carrière de jade",
	name_es: "Jade-Steinbruch",
	name_fr: "Cantera de Jade"
},
"1009": {
	name_en: "Fort Aspenwood",
	name_de: "Fort Trembleforêt",
	name_es: "Fort Espenwald",
	name_fr: "Fuerte Aspenwood"
},
"1010": {
	name_en: "Ehmry Bay",
	name_de: "Baie d'Ehmry",
	name_es: "Ehmry-Bucht",
	name_fr: "Bahía de Ehmry"
},
"1011": {
	name_en: "Stormbluff Isle",
	name_de: "Ile de la Falaise tumultueuse",
	name_es: "Sturmklippen-Insel",
	name_fr: "Isla Cimatormenta"
},
"1012": {
	name_en: "Darkhaven",
	name_de: "Refuge noir",
	name_es: "Finsterfreistatt",
	name_fr: "Refugio Oscuro"
},
"1013": {
	name_en: "Sanctum of Rall",
	name_de: "Sanctuaire de Rall",
	name_es: "Heilige Halle von Rall",
	name_fr: "Sagrario de Rall"
},
"1014": {
	name_en: "Crystal Desert",
	name_de: "Désert de cristal",
	name_es: "Kristallwüste",
	name_fr: "Desierto de Cristal"
},
"1015": {
	name_en: "Isle of Janthir",
	name_de: "Ile de Janthir",
	name_es: "Janthir-Insel",
	name_fr: "Isla de Janthir"
},
"1016": {
	name_en: "Sea of Sorrows",
	name_de: "Mer des lamentations",
	name_es: "Meer des Leids",
	name_fr: "Mar de los Pesares"
},
"1017": {
	name_en: "Tarnished Coast",
	name_de: "Côte ternie",
	name_es: "Befleckte Küste",
	name_fr: "Costa de Bronce"
},
"1018": {
	name_en: "Northern Shiverpeaks",
	name_de: "Cimefroides nordiques",
	name_es: "Nördliche Zittergipfel",
	name_fr: "Picosescalofriantes del Norte"
},
"1019": {
	name_en: "Blackgate",
	name_de: "Portenoire",
	name_es: "Schwarztor",
	name_fr: "Puertanegra"
},
"1020": {
	name_en: "Ferguson's Crossing",
	name_de: "Croisée de Ferguson",
	name_es: "Fergusons Kreuzung",
	name_fr: "Encrucijada de Ferguson"
},
"1021": {
	name_en: "Dragonbrand",
	name_de: "Stigmate du dragon",
	name_es: "Drachenbrand",
	name_fr: "Marca del Dragón"
},
"1022": {
	name_en: "Kaineng",
	name_de: "Kaineng",
	name_es: "Kaineng",
	name_fr: "Kaineng"
},
"1023": {
	name_en: "Devona's Rest",
	name_de: "Repos de Devona",
	name_es: "Devonas Ruh",
	name_fr: "Descanso de Devona"
},
"1024": {
	name_en: "Eredon Terrace",
	name_de: "Plateau d'Eredon",
	name_es: "Eredon-Terrasse",
	name_fr: "Terraza de Eredon"
},
"2001": {
	name_en: "Fissure of Woe",
	name_de: "Fissure du malheur",
	name_es: "Riss des Kummers",
	name_fr: "Fisura de la Aflicción"
},
"2002": {
	name_en: "Desolation",
	name_de: "Désolation",
	name_es: "Ödnis",
	name_fr: "Desolación"
},
"2003": {
	name_en: "Gandara",
	name_de: "Gandara",
	name_es: "Gandara",
	name_fr: "Gandara"
},
"2004": {
	name_en: "Blacktide",
	name_de: "Noirflot",
	name_es: "Schwarzwasser",
	name_fr: "Marea Negra"
},
"2005": {
	name_en: "Ring of Fire",
	name_de: "Cercle de feu",
	name_es: "Feuerring",
	name_fr: "Anillo de fuego"
},
"2006": {
	name_en: "Underworld",
	name_de: "Outre-monde",
	name_es: "Unterwelt",
	name_fr: "Inframundo"
},
"2007": {
	name_en: "Far Shiverpeaks",
	name_de: "Lointaines Cimefroides",
	name_es: "Ferne Zittergipfel",
	name_fr: "Lejanas Picosescalofriantes"
},
"2008": {
	name_en: "Whiteside Ridge",
	name_de: "Crête de Verseblanc",
	name_es: "Weißflankgrat",
	name_fr: "Cadena Laderablanca"
},
"2009": {
	name_en: "Ruins of Surmia",
	name_de: "Ruines de Surmia",
	name_es: "Ruinen von Surmia",
	name_fr: "Ruinas de Surmia"
},
"2010": {
	name_en: "Seafarer's Rest",
	name_de: "Repos du Marin",
	name_es: "Seemannsruh",
	name_fr: "Refugio del Viajante"
},
"2011": {
	name_en: "Vabbi",
	name_de: "Vabbi",
	name_es: "Vaabi",
	name_fr: "Vabbi"
},
"2012": {
	name_en: "Piken Square",
	name_de: "Place Piken",
	name_es: "Piken-Platz",
	name_fr: "Plaza de Piken"
},
"2013": {
	name_en: "Aurora Glade",
	name_de: "Clairière de l'aurore",
	name_es: "Auroralichtung",
	name_fr: "Claro de la Aurora"
},
"2014": {
	name_en: "Gunnar's Hold",
	name_de: "Campement de Gunnar",
	name_es: "Gunnars Feste",
	name_fr: "Fuerte de Gunnar"
},
"2101": {
	name_en: "Jade Sea [FR]",
	name_de: "Mer de Jade [FR]",
	name_es: "Jademeer [FR]",
	name_fr: "Mar de Jade [FR]"
},
"2102": {
	name_en: "Fort Ranik [FR]",
	name_de: "Fort Ranik [FR]",
	name_es: "Fort Ranik [FR]",
	name_fr: "Fuerte Ranik [FR]"
},
"2103": {
	name_en: "Augury Rock [FR]",
	name_de: "Roche de l'Augure [FR]",
	name_es: "Fels der Weissagung [FR]",
	name_fr: "Roca del Augurio [FR]"
},
"2104": {
	name_en: "Vizunah Square [FR]",
	name_de: "Place de Vizunah [FR]",
	name_es: "Vizunah-Platz [FR]",
	name_fr: "Plaza de Vizunah [FR]"
},
"2105": {
	name_en: "Arborstone [FR]",
	name_de: "Pierre Arborea [FR]",
	name_es: "Arborstein [FR]",
	name_fr: "Piedra Arbórea [FR]"
},
"2201": {
	name_en: "Kodash [DE]",
	name_de: "Kodash [DE]",
	name_es: "Kodasch [DE]",
	name_fr: "Kodash [DE]"
},
"2202": {
	name_en: "Riverside [DE]",
	name_de: "Provinces fluviales [DE]",
	name_es: "Flussufer [DE]",
	name_fr: "Ribera [DE]"
},
"2203": {
	name_en: "Elona Reach [DE]",
	name_de: "Bief d'Elona [DE]",
	name_es: "Elonaspitze [DE]",
	name_fr: "Cañón de Elona [DE]"
},
"2204": {
	name_en: "Abaddon's Mouth [DE]",
	name_de: "Bouche d'Abaddon [DE]",
	name_es: "Abaddons Maul [DE]",
	name_fr: "Boca de Abaddon [DE]"
},
"2205": {
	name_en: "Drakkar Lake [DE]",
	name_de: "Lac Drakkar [DE]",
	name_es: "Drakkar-See [DE]",
	name_fr: "Lago Drakkar [DE]"
},
"2206": {
	name_en: "Miller's Sound [DE]",
	name_de: "Détroit de Miller [DE]",
	name_es: "Millersund [DE]",
	name_fr: "Estrecho de Miller [DE]"
},
"2207": {
	name_en: "Dzagonur [DE]",
	name_de: "Dzagonur [DE]",
	name_es: "Dzagonur [DE]",
	name_fr: "Dzagonur [DE]"
},
"2301": {
	name_en: "Baruch Bay [SP]",
	name_de: "Baie de Baruch [SP]",
	name_es: "Baruch-Bucht [ES]",
	name_fr: "Bahía de Baruch [ES]"
}
};