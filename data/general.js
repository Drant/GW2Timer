/*
 * This file is used by http://gw2timer.com
 * Map data for Kryta continent: zone, region, submaps, and dailies.
 * Dashboard time sensitive data: announcement, countdown, and sales.
 */

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
	"1015": "silverwastes",
	"1041": "dragon",
	"1043": "auric",
	"1045": "tangled",
	"1052": "verdant"
};
var GW2T_LAND_ASSOCIATION = {
	"38": "eternal",
	"350": "heart",
	"549": "kyhlo",
	"554": "niflhel",
	"795": "foefire",
	"872": "fractals",
	"875": "storm",
	"894": "spirit",
	"900": "skyhammer",
	"984": "courtyard",
	"968": "edge",
	"1011": "champion",
	"1099": "desertred",
	"1102": "desertgreen",
	"1143": "desertblue"
};
// Associate the API achievement IDs with the custom achievement nicknames
var GW2T_DAILY_ASSOCIATION = {

	// Gatherer
	"1837": "Lumberer Ascalon",
	"1838": "Forager Ascalon",
	"1968": "Lumberer Shiverpeaks",
	"1969": "Miner Jungle",
	"1970": "Lumberer Jungle",
	"1971": "Miner Kryta",
	"1972": "Lumberer Kryta",
	"1973": "Forager Jungle",
	"1974": "Forager Orr",
	"1975": "Forager Kryta",
	"1976": "Lumberer Orr",
	"1977": "Miner Orr",
	"1978": "Miner Wastes",
	"1979": "Lumberer Wastes",
	"1980": "Forager Wastes",
	"1981": "Miner Ascalon",
	"1984": "Miner Shiverpeaks",
	"1985": "Forager Shiverpeaks",
	
	// Misc
	"500": "Forger",
	"1839": "Vista Kryta",
	"1931": "Vista Jungle",
	"1932": "Vista Orr",
	"1936": "Vista Shiverpeaks",
	"1937": "Vista Wastes",
	"1938": "Vista Ascalon",
	"1939": "Activity",
	"1989": "Fractal",
	
	// Event
	"1940": "Caledon",
	"1941": "Cursed",
	"1942": "Straits",
	"1943": "Gendarran",
	"1944": "Frostgorge",
	"1945": "Brisban",
	"1947": "Sparkfly",
	"1948": "Bloodtide",
	"1949": "Southsun",
	"1950": "Maelstrom",
	"1951": "Metrica",
	"1952": "Fields",
	"1953": "Wayfarer",
	"1954": "Timberline",
	"1955": "Dry",
	"1956": "Snowden",
	"1958": "Dredgehaunt",
	"1959": "Silverwastes",
	"1960": "Harathi",
	"1961": "Malchor",
	"1962": "Marches",
	"1963": "Queensdale",
	"1964": "Plains",
	"1965": "Kessex",
	
	// Boss
	"1930": "FE",
	"1934": "Golem",
	"2026": "Jormag",
	"2022": "Maw",
	"1935": "Megades",
	"2025": "SB",
	"1983": "Shatterer",
	"1933": "Wurm",
	
	// WvW
	"437": "Guard",
	"1843": "Tower",
	"1844": "Defender",
	"1845": "Keep",
	"1846": "Kills",
	"1847": "Caravan",
	"1848": "Creature",
	"1849": "Land",
	"1850": "Camp",
	"1852": "Spender",
	"1541": "Ruins",
	"982": "Ruins",
	"946": "Monument",
	
	// PvP
	"1856": "Reward",
	"1857": "Rank",
	"1858": "Defender",
	"1861": "Kills",
	"1867": "Capture",
	
	// Profession
	"2090": "Eng Thief",
	"2091": "Mes Necro",
	"2093": "Guard Eng",
	"2096": "War Guard",
	"2098": "Guard Ranger",
	"2099": "Ranger Mes",
	"2100": "War Thief",
	"2101": "Thief Ele",
	"2102": "Thief Mes",
	"2103": "Ranger Eng",
	"2104": "Ele Mes",
	"2105": "Guard Ele",
	"2107": "Eng Ele",
	"2108": "Ele Necro",
	"2109": "Eng Mes",
	"2110": "Guard Thief",
	"2111": "War Ranger",
	"2112": "Ele Ranger",
	"2113": "Guard Mes",
	"2114": "War Eng",
	"2115": "Ranger Thief",
	"2116": "War Mes",
	"2117": "Ranger Necro",
	"2118": "Eng Necro",
	"2120": "Thief Necro",
	"2122": "War Ele",
	"2162": "Rev Ranger",
	"2317": "Rev Ele",
	"2561": "Rev Eng",
	"2611": "Rev Necro",
	"2623": "Rev Mes",
	"2640": "Rev Thief",
	
	// Fractal
	"2191": "Adept",
	"2511": "Journeyman",
	"2411": "Master",
	"2415": "Elite",
	"2166": "29",
	"2189": "21",
	"2218": "9",
	"2223": "26",
	"2229": "6",
	"2231": "13",
	"2238": "15",
	"2239": "27",
	"2245": "24",
	"2266": "35",
	"2297": "28",
	"2303": "22",
	"2308": "16",
	"2309": "36",
	"2316": "5",
	"2327": "14",
	"2329": "7",
	"2330": "30",
	"2366": "23",
	"2377": "37",
	"2405": "4",
	"2422": "8",
	"2473": "25",
	"2491": "17",
	"2492": "19",
	"2533": "31",
	"2560": "10",
	"2597": "12"
};

/*
 * Daily achievements and translations.
 */
var GW2T_DAILY_DATA = {
Activity:
{
	// Schedule array index correspond to the UTC weekday number, where 0 is Sunday
	Schedule: ["keg", "crab", "sanctum", "southsun", "crab", "sanctum", "southsun"],
	Activities: {
		sanctum: { name_en: "Sanctum Sprint", name_de: "Refugiums-Sprint", name_es: "Sprint del Sagrario", name_fr: "Course du Sanctuaire" },
		crab: { name_en: "Crab Toss", name_de: "Krebs-Wurfspiel", name_es: "Lanzamiento de cangrejos", name_fr: "Lancer de crabe" },
		keg: { name_en: "Keg Brawl", name_de: "Fasskeilerei", name_es: "Pelea de barricas", name_fr: "Bagarre de barils" },
		southsun: { name_en: "Southsun Survival", name_de: "Südlicht-Überlebenskampf", name_es: "Supervivencia Sol Austral", name_fr: "Survie à Sud-Soleil" }
	}
},
Fractal:
{
	url_en: "http://wiki-en.guildwars2.com/wiki/Fractals_of_the_Mists#Fractal_levels",
	url_de: "http://wiki-de.guildwars2.com/wiki/Fraktale_der_Nebel#Stufen",
	url_es: "http://wiki-es.guildwars2.com/wiki/Fractales_de_la_niebla",
	url_fr: "http://wiki-fr.guildwars2.com/wiki/Fractales_des_Brumes#Difficult.C3.A9_et_fractales",
	Scale:
	{
		name_en: "Recommended Fractal Scale",
		name_de: "Empfohlenes Fraktal Schwierigkeitsgrad",
		name_es: "Fractal recomendado escala",
		name_fr: "Fractale recommandée de niveau"
	}
}
};

/*
 * Locations for cross-world map travel. Coordinates are ordered by progression.
 */
var GW2T_GATEWAY_CONNECTION = {
	// The light blue vortexes at the edges of zones
	interzones: [
	[[877, 16061], [790, 16219]], // verdant to auric
	[[2394, 18790], [2915, 18296]], // auric to tangled
	[[2902, 19509], [3776, 19771]], // tangled to dragon
	[[4155, 15495], [3750, 15250]], // silverwastes to verdant
	[[5974, 15604], [5865, 15283]], // brisban to silverwastes
	[[6039, 17105], [5559, 16744]], // brisban to dry
	[[8011, 17021], [8082, 17270]], // metrica to brisban
	[[9492, 14615], [9218, 14666]], // kessex to brisban
	[[9443, 16316], [9244, 16368]], // caledon to brisban
	[[10229, 20633], [9926, 20038]], // grove to caledon
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
	[[11926, 25129], [11731, 25347]] // malchor to cursed
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
	],
	// The circular pads that cannonballs the player over the map
	launchpads: [
	{c: [[13794, 10161], [14125, 9839]], i: "http://i.imgur.com/05EZy40.png"}, // harathi
	{c: [[14628, 10642], [14684, 10351]], i: "http://i.imgur.com/pzi7QqB.png"}, // harathi
	{c: [[16123, 11449], [15715, 11526]], i: "http://i.imgur.com/LtlKlMd.png"}, // harathi
	{c: [[16719, 16097], [16790, 16379]], i: "http://i.imgur.com/4knjPzn.png"}, // bloodtide
	{c: [[16345, 20165], [15920, 20071]], i: "http://i.imgur.com/Ofvznoc.png"}, // sparkfly
	{c: [[16984, 21336], [17092, 21633]], i: "http://i.imgur.com/CKADrul.png"}, // sparkfly
	{c: [[15758, 20762], [16036, 21031]], i: "http://i.imgur.com/89HbHei.png"}, // sparkfly
	{c: [[20441, 23215], [20508, 23478]], i: "http://i.imgur.com/lsoFXtG.png"}, // maelstrom
	{c: [[21148, 22756], [21201, 22504]], i: "http://i.imgur.com/psc19cs.png"}, // maelstrom
	{c: [[29462, 18297], [29698, 18042]], i: "http://i.imgur.com/TBMgUBK.png"}, // fields
	{c: [[29637, 16740], [29530, 16996]], i: "http://i.imgur.com/wq10slX.png"}, // fields
	{c: [[31074, 16994], [30857, 17040]], i: "http://i.imgur.com/7VtKUTz.png"}, // fields
	{c: [[27655, 9992], [27820, 10306]], i: "http://i.imgur.com/bQcI0ZB.png"}, // marches
	{c: [[29771, 12832], [29751, 12716]], i: "http://i.imgur.com/XeC45o6.png"}, // blazeridge
	{c: [[29819, 12798], [29781, 12708]], i: "http://i.imgur.com/kYq3kVL.png"}, // blazeridge
	{c: [[29900, 12775], [29800, 12687]], i: "http://i.imgur.com/XvjUu86.png"}, // blazeridge
	{c: [[29646, 15191], [29645, 14997]], i: "http://i.imgur.com/vWiOGvt.png"}, // blazeridge
	{c: [[29839, 15255], [29689, 15497]], i: "http://i.imgur.com/pEE4dSa.png"}, // blazeridge
	{c: [[30527, 15382], [30258, 15615]], i: "http://i.imgur.com/OYwI6Tr.png"}, // blazeridge
	{c: [[25738, 10887], [25989, 10794]], i: "http://i.imgur.com/nLHpAY1.png"}, // fireheart
	{c: [[15224, 24113], [15138, 24433]], i: "http://i.imgur.com/Juve33P.png"}, // straits
	{c: [[13922, 24269], [13706, 24364]], i: "http://i.imgur.com/muYx0K5.png"}, // malchor
	{c: [[12708, 24331], [12352, 24504]], i: "http://i.imgur.com/20aN2Kl.png"}, // malchor
	{c: [[11912, 24958], [12203, 24781]], i: "http://i.imgur.com/v2nRrzR.png"}, // malchor
	{c: [[11248, 25762], [10899, 25948]], i: "http://i.imgur.com/Vkb74AG.png"}, // cursed
	{c: [[11122, 27381], [11248, 27635]], i: "http://i.imgur.com/20U6Gts.png"}, // cursed
	{c: [[11049, 27979], [11328, 27915]], i: "http://i.imgur.com/Yx0LBxP.png"}, // cursed
	]
};


/*
 * Target range for game skills to be laid on the map for measuring.
 */
var GW2T_RANGE_DATA = {
portal: {
	id: "portal",
	color: "pink",
	image: "portal",
	range: 5000
},
shadowtrap: {
	id: "shadowtrap",
	color: "black",
	image: "shadowtrap",
	range: 10000
}
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
 * Region categories of zones.
 */
var GW2T_REGION_DATA = {
"magus": {
	name_en: "Magus Falls",
	name_de: "Magusfälle",
	name_es: "Cataratas Magus",
	name_fr: "Chutes des mages",
	name_zh: "賢者瀑布",
	color: "yellow"
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
	color: "deepskyblue"
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
	color: "sienna"
},
"shiverpeaks": {
	name_en: "Shiverpeaks",
	name_de: "Zittergipfelgebirge",
	name_es: "Picosescalofriantes",
	name_fr: "Cimefroides",
	name_zh: "席瓦雪山",
	color: "aliceblue"
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
 * Zones are sorted by how far from the top left corner (0,0) it is.
 */
var GW2T_ZONE_DATA = {
"verdant":
{
	id: "1052",
	name_en: "Verdant Brink",
	name_de: "Grasgrüne Schwelle",
	name_es: "Umbral Verdeante",
	name_fr: "Orée d'émeraude",
	name_zh: "蒼翠邊界",
	region: "magus",
	map_rect: [[-36864, -18432], [39936, 18432]],
	continent_rect: [[640, 14592], [3840, 16128]]
},
"auric":
{
	id: "1043",
	name_en: "Auric Basin",
	name_de: "Güldener Talkessel",
	name_es: "Bassin aurique",
	name_fr: "Valle Áurico",
	name_zh: "赤金盆地",
	region: "magus",
	map_rect: [[-24576, -33792], [24576, 33792]],
	continent_rect: [[512, 16128], [2560, 18944]]
},
"tangled":
{
	id: "1045",
	name_en: "Tangled Depths",
	name_de: "Verschlungene Tiefen",
	name_es: "Profundidades Enredadas",
	name_fr: "Profondeurs verdoyantes",
	name_zh: "纏藤深淵",
	region: "magus",
	map_rect: [[-39936, -27648], [39936, 27648]],
	continent_rect: [[2560, 17408], [5888, 19712]]
},
"dragon":
{
	id: "1041",
	name_en: "Dragon's Stand",
	name_de: "Widerstand des Drachen",
	name_es: "Defensa del Dragón",
	name_fr: "Repli du Dragon",
	name_zh: "巨龍陣地",
	region: "magus",
	map_rect: [[-36864, -30720], [36864, 33792]],
	continent_rect: [[1280, 19712], [4352, 22400]]
},
"silverwastes":
{
	id: "1015",
	name_en: "The Silverwastes",
	name_de: "Die Silberwüste",
	name_es: "Los Páramos Argentos",
	name_fr: "Les Contrées sauvages d'Argent",
	name_zh: "白銀荒地",
	region: "wastes",
	map_rect: [[-24576, -18432], [24576, 18432]],
	continent_rect: [[3840, 14208], [5888, 15744]]
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
	map_rect: [[-24576, -30720], [24576, 30720]],
	continent_rect: [[3840, 15744], [5888, 17152]], continent_rect_actual: [[3840, 14592], [5888, 17152]]
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
	map_rect: [[-30720, -30720], [30720, 30720]],
	continent_rect: [[4608, 19710], [7168, 22270]]
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
	map_rect: [[-39936, -30720], [43008, 33792]],
	continent_rect: [[5888, 14464], [9344, 17152]]
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
	map_rect: [[-24576, -39936], [27648, 39936]],
	continent_rect: [[7168, 17152], [9344, 20480]]
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
	map_rect: [[-21504, -46080], [24576, 49152]],
	continent_rect: [[9344, 16128], [11264, 20096]]
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
	map_rect: [[-49152, -24576], [49152, 24576]],
	continent_rect: [[9344, 14080], [13440, 16128]]
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
	map_rect: [[-15360, -24576], [18432, 24576]],
	continent_rect: [[9728, 20096], [11136, 22144]]
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
	map_rect: [[-43008, -27648], [43008, 30720]],
	continent_rect: [[9856, 11648], [13440, 14080]]
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
	map_rect: [[-24576, -49152], [24576, 49152]],
	continent_rect: [[10112, 25216], [12160, 29312]]
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
	map_rect: [[-21504, -21504], [24576, 21504]],
	continent_rect: [[10240, 9856], [12160, 11648]]
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
	map_rect: [[-49152, -24576], [49152, 24576]],
	continent_rect: [[10368, 23168], [14464, 25216]]
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
	map_rect: [[-30720, -21504], [33792, 21504]],
	continent_rect: [[11520, 18944], [14208, 20736]]
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
	map_rect: [[-36864, -33792], [39936, 33792]],
	continent_rect: [[13440, 9472], [16640, 12288]]
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
	map_rect: [[-49152, -24576], [52224, 24576]],
	continent_rect: [[13440, 12288], [17664, 14336]]
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
	map_rect: [[-39936, -33792], [39936, 33792]],
	continent_rect: [[14464, 22400], [17792, 25216]]
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
	map_rect: [[-27648, -18432], [30720, 18432]],
	continent_rect: [[15232, 14336], [17664, 15872]]
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
	map_rect: [[-27648, -36864], [30720, 39936]],
	continent_rect: [[15232, 15872], [17664, 19072]]
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
	map_rect: [[-30720, -39936], [30720, 39936]],
	continent_rect: [[15232, 19072], [17792, 22400]]
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
	map_rect: [[-21504, -58368], [21504, 58368]],
	continent_rect: [[17664, 13312], [19456, 18176]]
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
	map_rect: [[-49152, -24576], [49152, 24576]],
	continent_rect: [[17664, 11264], [21760, 13312]]
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
	map_rect: [[-46080, -27648], [46080, 30720]],
	continent_rect: [[17792, 21376], [21632, 23808]]
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
	map_rect: [[-27648, -36864], [27648, 39936]],
	continent_rect: [[18944, 18176], [21248, 21376]]
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
	map_rect: [[-27648, -18432], [27648, 21504]],
	continent_rect: [[19456, 13312], [21760, 14976]]
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
	map_rect: [[-27648, -36864], [27648, 39936]],
	continent_rect: [[19456, 14976], [21760, 18176]]
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
	map_rect: [[-36864, -36864], [36864, 36864]],
	continent_rect: [[20736, 8192], [23808, 11264]]
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
	map_rect: [[-21504, -55296], [21504, 55296]],
	continent_rect: [[21760, 11264], [23552, 15872]]
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
	map_rect: [[-18432, -24576], [18432, 24576]],
	continent_rect: [[23552, 13568], [25088, 15616]]
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
	map_rect: [[-43008, -27648], [43008, 27648]],
	continent_rect: [[23552, 11264], [27136, 13568]]
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
	map_rect: [[-39936, -33792], [39936, 33792]],
	continent_rect: [[23808, 8448], [27136, 11264]]
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
	map_rect: [[-49152, -24576], [49152, 24576]],
	continent_rect: [[25088, 13568], [29184, 15616]]
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
	map_rect: [[-24576, -49152], [24576, 49152]],
	continent_rect: [[27136, 9472], [29184, 13568]]
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
	map_rect: [[-36864, -36864], [36864, 36864]],
	continent_rect: [[28672, 16256], [31744, 19328]]
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
	map_rect: [[-24576, -49152], [24576, 49152]],
	continent_rect: [[29184, 12160], [31232, 16256]]
}
};


/*
 * UTC bihourly events that are generated as columns in rows of meta event timelines.
 */
var GW2T_TIMELINE = [
	{
		zone: "verdant",
		color: "yellowgreen",
		Segments: [
			{ time: "00:00", duration: "00:10", primacy: 1, name_en: "Night", name_de: "Nacht", name_es: "Noche", name_fr: "Nuit", name_zh: "夜晚" },
			{ time: "00:10", duration: "00:20", primacy: 3, name_en: "Choppers", name_de: "Koptere", name_es: "Cópteros", name_fr: "Coptères", name_zh: "直升機" },
			{ time: "00:30", duration: "00:75", primacy: 2, name_en: "Daylight", name_de: "Tag", name_es: "Día", name_fr: "Journée", name_zh: "白天" },
			{ time: "01:45", duration: "00:15", primacy: 2, name_en: "Night", name_de: "Nacht", name_es: "Noche", name_fr: "Nuit", name_zh: "夜晚" }
		]
	},
	{
		zone: "auric",
		color: "gold",
		Segments: [
			{ time: "00:00", duration: "00:45", primacy: 1, name_en: "Pylons", name_de: "Pylone", name_es: "Atalayas", name_fr: "Pylônes", name_zh: "能量塔" },
			{ time: "00:45", duration: "00:15", primacy: 2, name_en: "Challenges", name_de: "Herausforderungen", name_es: "Desafíos", name_fr: "Défis", name_zh: "挑戰" },
			{ time: "01:00", duration: "00:20", primacy: 3, name_en: "Octovine", name_de: "Rankenkraken", name_es: "Octohiedra", name_fr: "Octoliane", name_zh: "八爪藤" },
			{ time: "01:20", duration: "00:10", primacy: 2, name_en: "Rest", name_de: "Verschnaufpause", name_es: "Descanso", name_fr: "Répit", name_zh: "休息" },
			{ time: "01:30", duration: "00:30", primacy: 2, name_en: "Pylons", name_de: "Pylone", name_es: "Atalayas", name_fr: "Pylônes", name_zh: "能量塔" }
		]
	},
	{
		zone: "tangled",
		color: "violet",
		Segments: [
			{ time: "00:00", duration: "00:25", primacy: 1, name_en: "Outposts", name_de: "Außenposten", name_es: "Puesto avanzados", name_fr: "Avant-postes", name_zh: "前哨" },
			{ time: "00:25", duration: "00:05", primacy: 2, name_en: "Prepare", name_de: "Vorbereiten", name_es: "Preparar", name_fr: "Préparer", name_zh: "準備" },
			{ time: "00:30", duration: "00:20", primacy: 3, name_en: "Gerent", name_de: "Potentaten", name_es: "Regente", name_fr: "Régent", name_zh: "虫王" },
			{ time: "00:50", duration: "01:10", primacy: 2, name_en: "Outposts", name_de: "Außenposten", name_es: "Puesto avanzados", name_fr: "Avant-postes", name_zh: "前哨" }
		]
	},
	{
		zone: "dragon",
		color: "skyblue",
		Segments: [
			{ time: "00:00", duration: "01:30", primacy: 1, name_en: "Assault", name_de: "Angriff", name_es: "Asalto", name_fr: "Assaut", name_zh: "突襲" },
			{ time: "01:30", duration: "00:30", primacy: 3, name_en: "Assault", name_de: "Angriff", name_es: "Asalto", name_fr: "Assaut", name_zh: "突襲" }
		]
	}
];


/*
 * Data for generating the dashboard on the map pane.
 */
var GW2T_DASHBOARD_DATA = {

/*
 * Self-announcement about the website.
 */
Announcement:
{
	content: "",
	Start: new Date("2016-01-26T16:00:00Z"),
	Finish: new Date("2016-02-02T16:00:00Z")
},

/*
 * GW2 special events, such as those announced on GuildWars2.com.
 * Requirement: Date minutes (MM in HH:MM:SS) must be divisible by 5.
 * Format:
	name: "", // Language independent, overrides others
	name_en: "",
	name_de: "",
	name_es: "",
	name_fr: "",
	official: "", // Official GW2 site news link, the prefix https://www.guildwars2.com/xx/ is pre-included
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
	name_en: "Lunar New Year",
	name_de: "Mondneujahr",
	name_es: "Año nuevo lunar",
	name_fr: "Nouvel an lunaire",
	official: "the-game/releases/january-26-2016/",
	Start: new Date("2016-01-26T17:00:00Z"),
	Finish: new Date("2016-02-09T17:00:00Z")
}/*,
{
	name_en: "PvP League Season 2",
	name_de: "PvP Liga Saison 2",
	name_es: "Segunda temporada de liga PvP",
	name_fr: "Saison 2 de la ligue JcJ",
	url_en: "https://forum-en.guildwars2.com/forum/game/pvp/Upcoming-Changes-for-PvP-League-Season-2/",
	url_de: "https://forum-de.guildwars2.com/forum/game/pvp/Kommende-nderungen-f-r-die-zweite-PvP-Liga-Saison",
	url_es: "https://forum-es.guildwars2.com/forum/game/pvp/Cambios-que-llegar-n-a-la-segunda-temporada-de-liga-PvP",
	url_fr: "https://forum-fr.guildwars2.com/forum/game/pvp/Changements-venir-pour-la-saison-2-de-la-ligue-JcJ",
	Start: new Date("2016-02-23T17:00:00Z"),
	Finish: new Date("2016-02-24T17:00:00Z")
}*/
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
	name_en: "",
	name_de: "",
	name_es: "",
	name_fr: "",
	Start: new Date("2015-10-23T07:00:00Z"),
	Finish: new Date("2015-11-06T08:00:00Z")
},

/*
 * GW2 gem store sale items.
 * Format:
	url: "", // Usually a wiki link to that item
	img: "", // ArenaNet hosted item image
	quantity: 1, // Batch sales
	pricenew: 400, // Gems value
	priceold: 800
 */
Sale: {
	isPreshown: false, // If true, will show the items on sale without needing user click toggle
	isSpecial: true,
	note: "",
	Start: new Date("2016-02-02T16:00:00Z"),
	Finish: new Date("2016-02-09T16:00:00Z"),
	Padding: {
		name: "Gem",
		img: "./img/ui/gem.png",
		quantity: 1,
		pricenew: 100,
		priceold: 0
	},
	Items: [
	{
		name: "Royal Terrace Pass",
		img: "https://render.guildwars2.com/file/470C33B838D5541D39C91DD5C65A53EFB9BCEB79/699314.png",
		quantity: 1,
		pricenew: 1000,
		priceold: 0,
		col: 0
	},
	{
		name: "Silver-Fed Salvage-o-Matic",
		img: "https://render.guildwars2.com/file/53BE1B65A817091427E30319C2B2B3777C27A319/855379.png",
		quantity: 1,
		pricenew: 500,
		priceold: 0,
		col: 0
	},
	{
		name: "Black Lion Salvage Kit",
		img: "https://render.guildwars2.com/file/2204EE5D7B1F7BEE9261CBAE3BF1DB5B027EE607/66551.png",
		quantity: 1,
		pricenew: 255,
		priceold: 300,
		col: 0
	},
	{
		name: "Red Lantern",
		img: "https://render.guildwars2.com/file/2B52C72C6E0B5A6095F5D39714CD7ED447E7B24B/941018.png",
		quantity: 1,
		pricenew: 250,
		priceold: 0,
		col: 0
	},{
		name: "Crimson Lion Dye Kit",
		img: "https://render.guildwars2.com/file/44DF293E3070550FA5700FB0CA96E14C12F89F43/947660.png",
		quantity: 1,
		pricenew: 125,
		priceold: 0,
		col: 0
	},
	{
		name: "Nature's Oath Outfit",
		img: "https://render.guildwars2.com/file/F0C5DCBAAFBF5C1BA3DB5201D19154A30D35BD57/1335090.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 1
	},
	{
		name: "Hawk Wings Glider Combo",
		img: "https://render.guildwars2.com/file/4EABD122FBD4296C7869600915EC3DD941C4BBA4/1334916.png",
		quantity: 1,
		pricenew: 700,
		priceold: 0,
		col: 1
	},
	{
		name: "Phoenix Kite Glider",
		img: "https://render.guildwars2.com/file/EDB6F1402EE407080237B9045DE8C96E59720293/1341461.png",
		quantity: 1,
		pricenew: 400,
		priceold: 0,
		col: 1
	},
	{
		name: "Confetti Mail Delivery",
		img: "https://render.guildwars2.com/file/DC800626B873260155C528297325C07635FFD41E/924620.png",
		quantity: 1,
		pricenew: 300,
		priceold: 0,
		col: 1
	}
	]
},

/*
 * Pact Supply Network Agent locations. Array indexes correspond to the UTC
 * weekday number, where 0 is Sunday.
 */
Vendor:
{
	resetHour: 8,
	name_en: "Pact Supply Network Agents",
	name_de: "Pakt-Vorratsnetzwerk-Agenten handeln",
	name_es: "Agentes de suministros del Pacto",
	name_fr: "Réseau d'agents du Pacte",
	name_zh: "特殊商人",
	Codes:
	{
		Mehem: ["[&BIsHAAA=]","[&BIcHAAA=]","[&BH8HAAA=]","[&BH4HAAA=]","[&BKsHAAA=]","[&BJQHAAA=]","[&BH8HAAA=]"],
		Fox: ["[&BDoBAAA=]","[&BEwDAAA=]","[&BEgAAAA=]","[&BMIBAAA=]","[&BF0AAAA=]","[&BMMCAAA=]","[&BNMCAAA=]"],
		Derwena: ["[&BBkAAAA=]","[&BBkAAAA=]","[&BBkAAAA=]","[&BIMAAAA=]","[&BIMAAAA=]","[&BNUGAAA=]","[&BIMAAAA=]"],
		Yana: ["[&BP8DAAA=]","[&BNIEAAA=]","[&BKgCAAA=]","[&BP0CAAA=]","[&BO4CAAA=]","[&BJsCAAA=]","[&BBEDAAA=]"],
		Katyn: ["[&BIUCAAA=]","[&BIMCAAA=]","[&BGQCAAA=]","[&BDgDAAA=]","[&BF0GAAA=]","[&BHsBAAA=]","[&BEICAAA=]"],
		Verma: ["[&BCECAAA=]","[&BA8CAAA=]","[&BIMBAAA=]","[&BPEBAAA=]","[&BOQBAAA=]","[&BNMAAAA=]","[&BBABAAA=]"]
	},
	Coords: // Changes at 08:00 UTC
	{
		Mehem: [[3995, 15900],[5038, 16227],[5682, 15515],[5345, 16212],[4348, 14822],[3907, 16445],[5691, 15212]],
		Fox: [[10202, 18168],[9978, 16945],[8728, 18923],[16795, 19804],[9162, 14943],[18926, 22037],[20252, 21585]],
		Derwena: [[13342, 15548],[13342, 15548],[13342, 15548],[11294, 12997],[11294, 12997],[13820, 20501],[11295, 12997]],
		Yana: [[16978, 23711],[15234, 24050],[14090, 23997],[11287, 25752],[17072, 23457],[14095, 24336],[11052, 28061]],
		Katyn: [[21335, 10084],[22448, 10241],[20058, 15386],[18784, 12997],[18224, 16036],[23006, 11984],[20146, 18656]],
		Verma: [[24757, 8568],[24131, 9304],[26737, 14451],[30346, 15998],[27491, 12513],[29248, 18538],[24319, 12362]]
	},
	Start: new Date("2016-02-08T00:00:00Z"),
	Finish: new Date("2016-02-09T00:00:00Z"),
	Offers: // Changes at 00:00 UTC
	{
		Mehem: { id: "43838", price: "25200" },
		Fox: { id: "43823", price: "25200" },
		Derwena: { id: "44715", price: "25200" },
		Yana: { id: "49751", price: "25200" },
		Katyn: { id: "43809", price: "25200" },
		Verma: { id: "43828", price: "25200" }
	}
}
};
