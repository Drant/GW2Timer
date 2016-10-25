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
	// Zones
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
	"1052": "verdant",
	"1165": "bloodstone",
	"1175": "ember",
	// Instances
	"1069": "precipice",
	"1071": "precipice",
	"1076": "precipice",
	"1104": "precipice",
	"1124": "precipice",
	"1144": "precipice",
	"1068": "gilded",
	"1101": "gilded",
	"1107": "gilded",
	"1108": "gilded",
	"1121": "gilded",
	"1125": "gilded"
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
	"1171": "coliseum",
	"94": "alpinered",
	"96": "alpineblue",
	"95": "alpinegreen",
	"1099": "desertred",
	"1143": "desertblue",
	"1102": "desertgreen"
};
// Associate the API achievement IDs with the custom achievement nicknames
var GW2T_DAILY_ASSOCIATION = {

	// Gatherer
	"1837": "Lumberer Ascalon [30717,12686]",
	"1838": "Forager Ascalon [28360,15491]",
	"1968": "Lumberer Shiverpeaks [19735,20482]",
	"1969": "Miner Jungle [6328,15041]",
	"1970": "Lumberer Jungle [20166,21981]",
	"1971": "Miner Kryta [16936,14020]",
	"1972": "Lumberer Kryta [16669,16040]",
	"1973": "Forager Jungle [20077,22914]",
	"1974": "Forager Orr [17475,22676]",
	"1975": "Forager Kryta [15420,12390]",
	"1976": "Lumberer Orr [13808,24941]",
	"1977": "Miner Orr [14256,23451]",
	"1978": "Miner Wastes [5373,16541]",
	"1979": "Lumberer Wastes [4858,15450]",
	"1980": "Forager Wastes [4001,15893]",
	"1981": "Miner Ascalon [28961,17355]",
	"1984": "Miner Shiverpeaks [19241,19209]",
	"1985": "Forager Shiverpeaks [20960,13010]",
	"2912": "Forager Heart [3359,14678]",
	"2937": "Lumberer Heart [2291,14246]",
	"2957": "Miner Heart [2974,14229]",
	
	// Vista
	"1839": "Vista Kryta [17096,14790]",
	"1931": "Vista Jungle [10605,20960]",
	"1932": "Vista Orr [16934,23611]",
	"1936": "Vista Shiverpeaks [21092,14515]",
	"1937": "Vista Wastes [5615,15302]",
	"1938": "Vista Ascalon [24403,13856]",
	"2983": "Vista Heart [3243,14779]",
	
	// Misc
	"500": "Forger",
	"1939": "Activity",
	"1989": "Fractal",
	
	// Adventure
	"2891": "Adventure FlyingCircus Heart [1524,14830]",
	"2905": "Adventure DroneRace Heart [5391,19461]",
	"2915": "Adventure FallenMasks Heart [1210,17092]",
	"2919": "Adventure SalvagePit Heart [3136,15967]",
	"2922": "Adventure HaywirePunchomaticBattle Heart [4493,18553]",
	"2936": "Adventure TendrilTorchers Heart [3665,15722]",
	"2942": "Adventure TheFloorIsLava Heart [610,16691]",
	"2960": "Adventure LeylineRun Heart [3488,19229]",
	"2969": "Adventure SanctumScramble Heart [1763,18027]",
	"2973": "Adventure BeetleFeast Heart [4548,17730]",
	"2975": "Adventure BugsintheBranches Heart [3682,14925]",
	"2980": "Adventure AFungusAmongUs Heart [1018,18374]",
	"2984": "Adventure OnWingsofGold Heart [1830,17389]",
	"2987": "Adventure ShootingGallery Heart [2040,15974]",
	"2988": "Adventure ScrapRifleFieldTest Heart [5402,18917]",
	
	// JP
	"1872": "JP TheLongWayAround Orr [16527,23647]",
	"1873": "JP ForgottenStream Orr [11415,26582]",
	"1874": "JP GoffsLoot Kryta [11481,14335]",
	"1875": "JP TearsofItlaocol Jungle [9516,17345]",
	"1876": "JP RebelsSeclusion Ascalon [26906,9674]",
	"1877": "JP WindyCaveTreasure Shiverpeaks [18322,14297]",
	"1878": "JP MagellansMemento Shiverpeaks [23434,10877]",
	"1879": "JP ShipofSorrows Orr [15044,22718]",
	"1880": "JP Grounded Orr [11656,28757]",
	"1881": "JP DontTouchtheShiny Jungle [10126,17694]",
	"1882": "JP BadNeighborhood Kryta [11717,11915]",
	"1883": "JP ForsakenFortune Shiverpeaks [19658,15653]",
	"1884": "JP VexasLab Ascalon [26066,9837]",
	"1885": "JP CrazesFolly Ascalon [30901,12471]",
	"1886": "JP ChaosCrystalCavern Ascalon [27345,13106]",
	"1887": "JP ProfessorPortmattsLab Jungle [15726,16423]",
	"1888": "JP GoemmsLab Jungle [9235,18967]",
	"1889": "JP UrmaugsSecret Kryta [17399,14591]",
	"1890": "JP BrandedMine Ascalon [28948,16834]",
	"1891": "JP BehemGauntlet Ascalon [31116,15198]",
	"1892": "JP CollapsedObservatory Kryta [12781,15876]",
	"1893": "JP AntreofAdjournment Orr [13598,24798]",
	"1894": "JP SkippingStones Kryta [12780,19377]",
	"1895": "JP ShamansRookery Shiverpeaks [22074,13584]",
	"1896": "JP ShatteredIceRuins Shiverpeaks [22075,9112]",
	"1897": "JP ScavengersChasm Orr [13610,25044]",
	"1898": "JP SpelunkersDelve Jungle [10635,20000]",
	"1899": "JP SwashbucklersCove Kryta [16670,14183]",
	"1900": "JP OnlyZuhl Shiverpeaks [21062,18805]",
	"1901": "JP HiddenGarden Jungle [21357,21885]",
	"1902": "JP LoreclawExpanse Ascalon [28465,15425]",
	"1904": "JP KingJalissRefuge Shiverpeaks [21490,12271]",
	"1905": "JP GriffonrookRun Shiverpeaks [18077,17118]",
	"1906": "JP GrendichGamble Ascalon [25136,12227]",
	"1907": "JP ConundrumCubed Jungle [17958,21624]",
	"1908": "JP CoddlersCove Shiverpeaks [20756,20878]",
	"1909": "JP HexfoundryUnhinged Jungle [17545,21917]",
	"1910": "JP FawcettsBounty Kryta [14330,9653]",
	"1912": "JP SpekkssLaboratory Jungle [9492,18652]",
	"1913": "JP DarkReverie Jungle [10963,19197]",
	"1914": "JP CrimsonPlateau Ascalon [26258,13026]",
	"1915": "JP TribulationCaverns Shiverpeaks [19718,17986]",
	"1916": "JP TribulationRiftScaffolding Shiverpeaks [19819,17950]",
	"1917": "JP UnderNewManagement Kryta [13884,20428]",
	"1918": "JP ViziersTower Orr [16325,24485]",
	"1919": "JP BuriedArchives Orr [11078,29012]",
	"1920": "JP WallBreachBlitz Ascalon [25530,13388]",
	"1923": "JP WeyandtsRevenge Kryta [17210,15481]",
	"1924": "JP CrashSite Wastes [5380,16514]",
	"1926": "JP DemongrubPits Kryta [13202,13674]",
	"1927": "JP PigIronQuarry Ascalon [25986,10719]",
	"1929": "JP MorgansSpiral Jungle [10963,19197]",
	
	// Event
	"1940": "Event Caledon",
	"1941": "Event Cursed",
	"1942": "Event Straits",
	"1943": "Event Gendarran",
	"1944": "Event Frostgorge",
	"1945": "Event Brisban",
	"1946": "Event Blazeridge",
	"1947": "Event Sparkfly",
	"1948": "Event Bloodtide",
	"1949": "Event Southsun",
	"1950": "Event Maelstrom",
	"1951": "Event Metrica",
	"1952": "Event Fields",
	"1953": "Event Wayfarer",
	"1954": "Event Timberline",
	"1955": "Event Dry",
	"1956": "Event Snowden",
	"1957": "Event Lornar",
	"1958": "Event Dredgehaunt",
	"1959": "Event Silverwastes",
	"1960": "Event Harathi",
	"1961": "Event Malchor",
	"1962": "Event Marches",
	"1963": "Event Queensdale",
	"1964": "Event Plains",
	"1965": "Event Kessex",
	"1966": "Event Fireheart",
	"1967": "Event Diessa",
	"2910": "Event Auric",
	"2924": "Event Dragon",
	"2945": "Event Verdant",
	"2968": "Event Tangled",
	
	// Boss
	"1930": "Boss FE",
	"1934": "Boss Golem",
	"2026": "Boss Jormag",
	"2022": "Boss Maw",
	"1935": "Boss Megades",
	"2025": "Boss SB",
	"1983": "Boss Shatterer",
	"1933": "Boss Wurm",
	
	// Dungeon
	"2893": "Dungeon AC Ascalon [27666,13972]",
	"2901": "Dungeon COF Ascalon [26928,8711]",
	"2914": "Dungeon CM Kryta [13277,11943]",
	"2917": "Dungeon SE Shiverpeaks [19687,17707]",
	"2931": "Dungeon HOTW Shiverpeaks [22451,8816]",
	"2953": "Dungeon COE Jungle [20982,21888]",
	"2959": "Dungeon TA Jungle [9573,16564]",
	"2938": "Dungeon Arah Orr [12028,27690]",
	
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
	"1851": "Ranker",
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
	"2816": "Matches",
	"2817": "Stats",
	
	// Profession
	"2090": "Eng Thief",
	"2091": "Mes Necro",
	"2093": "Guard Eng",
	"2094": "Guard Necro",
	"2096": "War Guard",
	"2097": "War Necro",
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
	"2398": "Rev War",
	"2464": "Rev Guard",
	"2561": "Rev Eng",
	"2611": "Rev Necro",
	"2623": "Rev Mes",
	"2640": "Rev Thief",
	
	// Fractal Scales
	"2405": "4",
	"2316": "5",
	"2229": "6",
	"2329": "7",
	"2422": "8",
	"2218": "9",
	"2560": "10",
	"2153": "11",
	"2597": "12",
	"2231": "13",
	"2327": "14",
	"2238": "15",
	"2308": "16",
	"2491": "17",
	"2492": "19",
	"2189": "21",
	"2303": "22",
	"2366": "23",
	"2245": "24",
	"2473": "25",
	"2223": "26",
	"2239": "27",
	"2297": "28",
	"2166": "29",
	"2330": "30",
	"2533": "31",
	"2363": "32",
	"2244": "33",
	"2592": "34",
	"2266": "35",
	"2309": "36",
	"2377": "37",
	"2171": "40",
	"2598": "41",
	
	// Fractal Islands
	"2889": "Underground",
	"2890": "Volcanic",
	"2892": "Swamp",
	"2895": "Thaumanova",
	"2896": "Urban",
	"2897": "Urban",
	"2898": "Aquatic",
	"2899": "Maitrin",
	"2900": "Aquatic",
	"2902": "Uncategorized",
	"2903": "Furnace",
	"2907": "Urban",
	"2908": "Volcanic",
	"2909": "Aetherblade",
	"2911": "Volcanic",
	"2916": "Snowblind",
	"2918": "Snowblind",
	"2923": "Ocean",
	"2925": "Uncategorized",
	"2926": "Cliffside",
	"2927": "Aetherblade",
	"2928": "Aetherblade",
	"2929": "Underground",
	"2930": "Cliffside",
	"2932": "Maitrin",
	"2934": "Molten",
	"2935": "Swamp",
	"2939": "Uncategorized",
	"2940": "Uncategorized",
	"2941": "Urban",
	"2944": "Furnace",
	"2947": "Underground",
	"2948": "Aetherblade",
	"2949": "Snowblind",
	"2950": "Underground",
	"2952": "Snowblind",
	"2954": "Ocean",
	"2955": "Furnace",
	"2956": "Aquatic",
	"2958": "Cliffside",
	"2961": "Swamp",
	"2962": "Maitrin",
	"2964": "Aquatic",
	"2966": "Molten",
	"2967": "Thaumanova",
	"2971": "Ocean",
	"2972": "Swamp",
	"2976": "Furnace",
	"2977": "Cliffside",
	"2978": "Maitrin",
	"2979": "Molten",
	"2981": "Thaumanova",
	"2985": "Molten",
	"2986": "Ocean",
	"2989": "Volcanic",
	"2991": "Thaumanova",
	"3038": "Chaos",
	"3044": "Chaos",
	"3045": "Chaos",
	"3063": "Chaos"
};

/*
 * Daily achievements and translations.
 */
var GW2T_DAILY_DATA = {
AccessEnum:
{
	GW2: "GuildWars2",
	HoT: "HeartOfThorns",
	Max: "HeartOfThorns"
},
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
	url_es: "http://wiki-es.guildwars2.com/wiki/Fractales_de_la_niebla#Niveles_Fractales",
	url_fr: "http://wiki-fr.guildwars2.com/wiki/Fractales_des_Brumes#Difficult.C3.A9_et_fractales",
	Scale:
	{
		name_en: "Recommended Fractal Scale",
		name_de: "Empfohlenes Fraktal Schwierigkeitsgrad",
		name_es: "Fractal recomendado escala",
		name_fr: "Fractale recommandée de niveau"
	},
	Epoch: new Date("2016-09-04T00:00:00Z"),
	Schedule: [
		// Week A, 0 index is Sunday
		["Snowblind", "Chaos", "Aquatic"],
		["Ocean", "Underground", "Urban"],
		["Aetherblade", "Furnace", "Thaumanova"],
		["Cliffside", "Molten", "Maitrin"],
		["Swamp", "Ocean", "Uncategorized"],
		["Aquatic", "Snowblind", "Thaumanova"],
		["Aetherblade", "Uncategorized", "Volcanic"],
		// Week B
		["Cliffside", "Urban", "Chaos"],
		["Underground", "Volcanic", "Maitrin"],
		["Snowblind", "Ocean", "Swamp"],
		["Chaos", "Uncategorized", "Urban"],
		["Cliffside", "Furnace", "Maitrin"],
		["Underground", "Thaumanova", "Molten"],
		["Volcanic", "Swamp", "Aetherblade"]
	]
}
};

/*
 * Locations for cross-world map travel. Coordinates are ordered by progression.
 */
var GW2T_GATEWAY_CONNECTION = {
	// The light blue vortexes at the edges of zones
	interborders: [
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
	interzones: [
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
	// Skritt Tunnels, Nuhoch Wallows, and other within zone teleports
	intrazones: [
	[[5754, 15219], [4929, 15359]], // silverwastes
	[[4942, 15550], [4429, 14751]], // silverwastes
	[[4730, 14951], [5205, 14296]], // silverwastes
	[[5063, 15002], [4319, 15337]], // silverwastes
	[[4815, 15589], [4784, 15606]], // silverwastes
	[[2028, 15461], [2082, 15597]], // verdant
	[[2778, 15132], [2778, 15201]], // verdant
	[[810, 17777], [1185, 18496]], // auric
	[[1423, 16995], [1470, 18080]], // auric
	[[1970, 18729], [2118, 17772]], // auric
	[[1060, 17395], [2286, 17520]], // auric
	[[965, 16732], [2030, 16413]], // auric
	[[1531, 16403], [2490, 17495]], // auric
	[[5090, 18256], [4609, 18419]], // tangled
	[[4371, 18477], [4328, 17935]], // tangled
	[[3854, 17666], [4323, 17881]], // tangled
	[[3873, 18618], [4264, 17881]], // tangled
	[[2940, 18530], [3571, 17704]], // tangled
	[[3606, 18087], [3743, 18275]], // tangled
	[[3631, 19087], [3538, 19162]], // tangled
	[[5101, 19099], [5152, 19007]], // tangled
	[[3721, 20383], [4149, 20777]] // dragon
	],
	// The circular pads that cannonballs the player over the map
	launchpads: [
	{c: [[5100, 29397], [5456, 30042]]},
	{c: [[6813, 29739], [6508, 29537]]},
	{c: [[6049, 29316], [5501, 29897]]},
	{c: [[6387, 29286], [6021, 29313]]},
	{c: [[6822, 28872], [6694, 29200]]},
	{c: [[6860, 29092], [7005, 28800]]},
	{c: [[6574, 28954], [6985, 29132]]},
	{c: [[7005, 28905], [6607, 29185]]},
	{c: [[7544, 29690], [7047, 29484]]},
	{c: [[7047, 29484], [6505, 29536]]},
	{c: [[7089, 28731], [7299, 29043]]},
	{c: [[7299, 29043], [7926, 28981]]},
	{c: [[7926, 28981], [7927, 29466]]},
	{c: [[7927, 29466], [7394, 29416]]},
	{c: [[7394, 29416], [6927, 29988]]},
	{c: [[5501, 29895], [5275, 29520]]},
	{c: [[5275, 29520], [5081, 29125]]},
	{c: [[5081, 29125], [5261, 28883]]},
	{c: [[5770, 30532], [5456, 30044]]},
	{c: [[6162, 30119], [6073, 29718]]},
	{c: [[6073, 29718], [6242, 29374]]},
	{c: [[6242, 29374], [6505, 29536]]},
	{c: [[5457, 30042], [6074, 29718]]},
	{c: [[6505, 29536], [6535, 29093]]},
	{c: [[6423, 29888], [6850, 29999]]},
	{c: [[6216, 30103], [6423, 29888]]},
	{c: [[6986, 30318], [6310, 29799]]},
	{c: [[6200, 30230], [7052, 30403]]},
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
	{c: [[11049, 27979], [11328, 27915]], i: "http://i.imgur.com/Yx0LBxP.png"} // cursed
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
"ring": {
	name_en: "Ring of Fire",
	name_de: "Feuerring",
	name_es: "Anillo de Fuego",
	name_fr: "Cercle de feu",
	name_zh: "火焰之環",
	color: "firebrick"
},
"heart": {
	name_en: "Heart of Maguuma",
	name_de: "Herz von Maguuma",
	name_es: "Corazón de Maguuma",
	name_fr: "Cœur de Maguuma",
	name_zh: "邁古瑪腹地",
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
"ember":
{
	id: "1175",
	name_en: "Ember Bay",
	name_de: "Glutbucht",
	name_es: "Bahía de las Ascuas",
	name_fr: "Baie des Braises",
	name_zh: "余燼海灣",
	region: "ring",
	map_rect: [[-46080, -46080], [46080, 46080]],
	continent_rect: [[4606, 27134], [8446, 30974]]
},
"bloodstone":
{
	id: "1165",
	name_en: "Bloodstone Fen",
	name_de: "Blutsteinfenn",
	name_es: "Pantano de la Hematites",
	name_fr: "Marais de la pierre de sang",
	name_zh: "血石沼澤",
	region: "heart",
	map_rect: [[-18432, -6144], [18432, 9216]],
	continent_rect: [[2048, 13954], [3584, 14594]]
},
"verdant":
{
	id: "1052",
	name_en: "Verdant Brink",
	name_de: "Grasgrüne Schwelle",
	name_es: "Umbral Verdeante",
	name_fr: "Orée d'émeraude",
	name_zh: "蒼翠邊界",
	region: "heart",
	map_rect: [[-36864, -18432], [39936, 18432]],
	continent_rect: [[640, 14592], [3840, 16128]]
},
"auric":
{
	id: "1043",
	name_en: "Auric Basin",
	name_de: "Güldener Talkessel",
	name_es: "Valle Áurico",
	name_fr: "Bassin aurique",
	name_zh: "赤金盆地",
	region: "heart",
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
	region: "heart",
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
	region: "heart",
	map_rect: [[-36864, -30720], [36864, 33792]],
	continent_rect: [[1280, 19712], [4352, 22400]]
},
"precipice":
{
	id: "1069",
	name_en: "Lost Precipice",
	name_de: "Verlorener Abgrund",
	name_es: "Precipicio Perdido",
	name_fr: "Précipice perdu",
	name_zh: "失落懸崖",
	region: "heart",
	map_rect: [[-15360, -15360], [15360, 15360]],
	continent_rect: [[768, 13312], [2048, 14592]]
},
"gilded":
{
	id: "1068",
	name_en: "Gilded Hollow",
	name_de: "Vergoldete Senke",
	name_es: "Cueva Dorada",
	name_fr: "Caverne dorée",
	name_zh: "鍍金山洞",
	region: "heart",
	map_rect: [[-15360, -15360], [15360, 15360]],
	continent_rect: [[2560, 16128], [3840, 17408]]
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
		isWB: true,
		name_en: "World Bosses", name_de: "Weltbosses", name_es: "Jefe mundo", name_fr: "Chef monde", name_zh: "頭目世界",
		Segments: [
			{ time: "00:00", duration: "00:15", primacy: 2},
			{ time: "00:15", duration: "00:15", primacy: 2},
			{ time: "00:30", duration: "00:15", primacy: 2},
			{ time: "00:45", duration: "00:15", primacy: 2},
			{ time: "01:00", duration: "00:15", primacy: 2},
			{ time: "01:15", duration: "00:15", primacy: 2},
			{ time: "01:30", duration: "00:15", primacy: 2},
			{ time: "01:45", duration: "00:15", primacy: 2}
		]
	},
	{
		zone: "verdant",
		Segments: [
			{ time: "00:00", duration: "00:10", primacy: 1, name_en: "Night", name_de: "Nacht", name_es: "Noche", name_fr: "Nuit", name_zh: "夜晚" },
			{ time: "00:10", duration: "00:20", primacy: 3, name_en: "Choppers", name_de: "Koptern", name_es: "Autogiros", name_fr: "Hélicos", name_zh: "直升機" },
			{ time: "00:30", duration: "00:75", primacy: 2, name_en: "Daylight", name_de: "Tag", name_es: "Día", name_fr: "Journée", name_zh: "白天" },
			{ time: "01:45", duration: "00:15", primacy: 2, name_en: "Night", name_de: "Nacht", name_es: "Noche", name_fr: "Nuit", name_zh: "夜晚" }
		]
	},
	{
		zone: "auric",
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
		Segments: [
			{ time: "00:00", duration: "00:25", primacy: 1, name_en: "Outposts", name_de: "Außenposten", name_es: "Puesto avanzados", name_fr: "Avant-postes", name_zh: "前哨" },
			{ time: "00:25", duration: "00:05", primacy: 2, name_en: "Prepare", name_de: "Vorbereiten", name_es: "Preparar", name_fr: "Préparer", name_zh: "準備" },
			{ time: "00:30", duration: "00:20", primacy: 3, name_en: "Gerent", name_de: "Potentaten", name_es: "Regente", name_fr: "Régent", name_zh: "虫王" },
			{ time: "00:50", duration: "01:10", primacy: 2, name_en: "Outposts", name_de: "Außenposten", name_es: "Puesto avanzados", name_fr: "Avant-postes", name_zh: "前哨" }
		]
	},
	{
		name_en: "Dragon's Stand & Dry Top", name_de: "Widerstand des Drachen & Trockenkuppe", name_es: "Defensa del Dragón & Cima Seca", name_fr: "Repli du Dragon & Cimesèche", name_zh: "巨龍陣地 和 干涸高地",
		Segments: [
			{ time: "00:00", duration: "00:40", primacy: 1, name_en: "", name_de: "", name_es: "", name_fr: "", name_zh: "" },
			{ time: "00:40", duration: "00:20", primacy: 2, name_en: "Sandstorm!", name_de: "Sandsturm!", name_es: "¡Tormenta!", name_fr: "Tempête !", name_zh: "沙塵暴！" },
			{ time: "01:00", duration: "00:30", primacy: 1, name_en: "", name_de: "", name_es: "", name_fr: "", name_zh: "" },
			{ time: "01:30", duration: "00:10", primacy: 3, name_en: "Assault", name_de: "Angriff", name_es: "Asalto", name_fr: "Assaut", name_zh: "突襲" },
			{ time: "01:40", duration: "00:20", primacy: 2, name_en: "Sandstorm!", name_de: "Sandsturm!", name_es: "¡Tormenta!", name_fr: "Tempête !", name_zh: "沙塵暴！" }
		]
	}
];


/*
 * Data for generating the dashboard on the map panel.
 */
var GW2T_DASHBOARD_DATA = {

/*
 * Self-announcement about the website.
 */
Announcement:
{
	// "<img src='img/ui/pages/account.png' /> <a href='http://gw2timer.com/?page=Catalog' title='gw2timer.com/catalog'>Account Catalog</a> browse outfits, finishers, mail carriers, gliders, nodes."
	pve: "<dfn data-coord='[[16459,14575],[16369,14555],[16248,14618],[15990,14655],[15924,14414],[15742,14745],[15896,14779],[15960,14922],[16286,15063],[16371,15137],[16639,15339],[17329,15141]]'>Carving Pumpkins</dfn> in Lion's Arch, <a href='http://gw2timer.com/pumpkins'>more</a>. Account <a href='http://gw2timer.com/?page=Audit'>audit</a> and <a href='http://gw2timer.com/?page=Catalog'>catalog</a> now load fast.",
	wvw: "<a href='https://forum-en.guildwars2.com/forum/game/wuv/WvW-Poll-6-June-World-Linking-Schedule-CLOSED/page/3#post6196507'>World relinking</a> on October 28.",
	Start: new Date("2016-10-11T16:00:00Z"),
	Finish: new Date("2016-10-28T16:00:00Z"),
	Messages: // Greeting messages shown upon site load
	{
		Forger: "Today is <a href='http://wiki.guildwars2.com/wiki/Chest_of_the_Mystic'>Daily Forger</a>, "
			+ "forge 4 cheap <a href='http://wiki.guildwars2.com/wiki/Minor_Sigil_of_Earth'>minor sigils</a> "
			+ "for a free Mystic Coin."
	}
},

/*
 * GW2 special events, such as those announced on GuildWars2.com.
 * Requirement: Date minutes (MM in HH:MM:SS) must be divisible by 5.
 * Format:
 *	name: "", // Language independent, overrides others
 *	name_en: "",
 *	name_de: "",
 *	name_es: "",
 *	name_fr: "",
 *	official: "", // Official GW2 site news link, the prefix https://www.guildwars2.com/xx/ is pre-included
 *	url: "", // Language independent, overrides others
 *	url_en: "",
 *	url_de: "",
 *	url_es: "",
 *	url_fr: "",
 *	Start: new Date("2015-07-10T19:00:00Z"),
 *	Finish: new Date("2015-07-13T19:00:00Z")
 */
Countdown: {
	Events: [
	/*{
		name_en: "PvP League Season 5",
		name_de: "PvP Liga Saison 5",
		name_es: "Temporada 5 de liga PvP",
		name_fr: "Saison 5 de la ligue JcJ",
		url: "http://i.imgur.com/dEObOLZ.png",
		Start: new Date("2016-08-09T17:00:00Z"),
		Finish: new Date("2016-08-10T17:00:00Z")
	}*/
	/*{ // 8 weeks cycle, on Thursday, 11-10 to 11-17
		name_en: "Frostgorge Map Rewards",
		name_de: "Eisklamm Karten-Bonus",
		name_es: "Bonificación de mapa Gorjaescarcha",
		name_fr: "Bonus de carte Gorges glacées",
		name_zh: "霜谷之音地圖獎金",
		url: "https://www.reddit.com/r/Guildwars2/comments/4sv5s1/frostgorge_sound_map_rewards_powerful_blood/",
		Start: new Date("2016-11-10T20:00:00Z"),
		Finish: new Date("2016-11-17T20:00:00Z")
	}*/
	{
		name_en: "Halloween 2016",
		name_de: "Halloween 2016",
		name_es: "Halloween 2016",
		name_fr: "Halloween 2016",
		name_zh: "萬聖夜2016",
		official: "news/shadow-of-the-mad-king-is-live/",
		Start: new Date("2016-10-18T16:00:00Z"),
		Finish: new Date("2016-11-01T16:00:00Z")
	},
	{ // Last Friday of even numbered months
		name_en: "WvW Re-linking",
		name_de: "WvW Wieder-verbindung",
		name_es: "McM Re-unificación",
		name_fr: "McM Ré-association",
		name_zh: "世界戰場重新統一",
		url_en: "https://forum-en.guildwars2.com/forum/game/wuv/WvW-Poll-6-June-World-Linking-Schedule-CLOSED/page/3#post6196507",
		url_de: "https://forum-de.guildwars2.com/forum/game/wuv/WvW-Abstimmung-vom-6-Juni-Zeitplan-f-r-Weltenverbindung-Ergebnisse/first#post500378",
		url_es: "https://forum-es.guildwars2.com/forum/game/wuv/Encuesta-de-WvW-del-6-de-junio-Frecuencia-de-la-unificaci-n-de-mundos-Cerrada/first#post121282",
		url_fr: "https://forum-fr.guildwars2.com/forum/game/wuv/Sondage-McM-du-6-juin-Programme-de-l-association-de-mondes-ferm/first#post292620",
		Start: new Date("2016-10-28T18:00:00Z"),
		Finish: new Date("2016-10-29T02:00:00Z")
	}
	]
},

/*
 * Living Story events.
 */
Story:
{
	isEnabled: true,
	name_en: "Shadow of the Mad King",
	name_de: "Der Schatten des Verrückten Königs",
	name_es: "La sombra del Rey Loco",
	name_fr: "L’Ombre du Roi Dément",
	name_zh: "瘋王聖旨",
	url: "",
	Start: new Date("2016-10-18T16:00:00Z"),
	Finish: new Date("2016-11-01T16:00:00Z")
},

/*
 * GW2 gem store sale items.
 * Format:
 *	name: "", // Item name to point to English wiki
 *	id: "", // Item ID to retrieve icon and tooltip details, or a URL to a hosted image
 *	price: 400, // Current gem price for one item
 *	discount: [[1, 160, 200], [5, 640, 800], [25, 3200, 4000]] OR 200, // [[quantity, gempricecurrent, gempriceoldOptional], ...] OR gempriceoldOptional
 *	col: 0 // Display on left (0) or right (1) column
 */
Sale: {
	isPreshown: false, // If true, will show the items on sale without needing user click toggle
	note: "", // Important note about the sale, optional
	Start: new Date("2016-10-18T16:00:00Z"),
	Finish: new Date("2016-10-25T16:00:00Z"),
	Padding: {
		name: "Gem",
		id: "https://render.guildwars2.com/file/220061640ECA41C0577758030357221B4ECCE62C/502065.png",
		price: 100,
		discount: null
	},
	Items: [
	{
		name: "Mad King's Outfit",
		id: "36366",
		price: 700,
		discount: null,
		col: 0
	},
	{
		name: "Black Wings Glider Combo",
		id: "68685",
		price: 700,
		discount: null,
		col: 0
	},
	{
		name: "Ghoul Backpack and Mini Pack",
		id: "71323",
		price: 600,
		discount: null,
		col: 0
	},
	{
		name: "Candy Corn Gobbler Pack",
		id: "67393",
		price: 300,
		discount: null,
		col: 0
	},
	{
		name: "Mad King Dye Kit",
		id: "70367",
		price: 125,
		discount: [[1, 125], [5, 500], [25, 2500]],
		col: 0
	},
	{
		name: "Bone Pick",
		id: "48932",
		price: 1000,
		discount: null,
		col: 1
	},
	{
		name: "Tireless Harvesting Minion",
		id: "67063",
		price: 1000,
		discount: null,
		col: 1
	},
	{
		name: "Tireless Logging Minion",
		id: "67029",
		price: 1000,
		discount: null,
		col: 1
	},
	{
		name: "Furrocious Cat Ears",
		id: "79619",
		price: 400,
		discount: null,
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
	name_en: "Pact Supply",
	name_de: "Pakt-Vorratsnetzwerk",
	name_es: "Ssuministros Pacto",
	name_fr: "Réseau Pacte",
	name_zh: "特殊商人",
	Codes:
	{
		Mehem: ["[&BIsHAAA=]","[&BIcHAAA=]","[&BH8HAAA=]","[&BH4HAAA=]","[&BKsHAAA=]","[&BJQHAAA=]","[&BH8HAAA=]"],
		Fox: ["[&BDoBAAA=]","[&BEwDAAA=]","[&BEgAAAA=]","[&BMIBAAA=]","[&BF0AAAA=]","[&BMMCAAA=]","[&BNMCAAA=]"],
		Derwena: ["[&BC0AAAA=]","[&BKYBAAA=]","[&BBkAAAA=]","[&BKEAAAA=]","[&BIMAAAA=]","[&BNUGAAA=]","[&BJIBAAA=]"],
		Yana: ["[&BP8DAAA=]","[&BNIEAAA=]","[&BKgCAAA=]","[&BP0CAAA=]","[&BO4CAAA=]","[&BJsCAAA=]","[&BBEDAAA=]"],
		Katyn: ["[&BIUCAAA=]","[&BIMCAAA=]","[&BGQCAAA=]","[&BDgDAAA=]","[&BF0GAAA=]","[&BHsBAAA=]","[&BEICAAA=]"],
		Verma: ["[&BCECAAA=]","[&BA8CAAA=]","[&BIMBAAA=]","[&BPEBAAA=]","[&BOQBAAA=]","[&BNMAAAA=]","[&BBABAAA=]"]
	},
	Coords: // Changes at 08:00 UTC
	{
		Mehem: [[3995, 15900],[5038, 16227],[5682, 15515],[5345, 16212],[4348, 14822],[3907, 16445],[5691, 15212]],
		Fox: [[10202, 18168],[9978, 16945],[8728, 18923],[16795, 19804],[9162, 14943],[18926, 22037],[20252, 21585]],
		Derwena: [[17170, 17325],[17058, 16107],[13342, 15548],[16017, 12086],[11294, 12997],[13820, 20501],[16661, 12794]],
		Yana: [[16978, 23711],[15234, 24050],[14090, 23997],[11287, 25752],[17072, 23457],[14095, 24336],[11052, 28061]],
		Katyn: [[21335, 10084],[22448, 10241],[20058, 15386],[18784, 12997],[18224, 16036],[23006, 11984],[20146, 18656]],
		Verma: [[24757, 8568],[24131, 9304],[26737, 14451],[30346, 15998],[27491, 12513],[29248, 18538],[24319, 12362]]
	},
	Start: new Date("2016-10-25T00:00:00Z"),
	Finish: new Date("2016-10-26T00:00:00Z"),
	Products: { "44713":44948, "44714":44949, "43482":43450, "43798":43774, "43799":43775, "43800":43866, "43802":43778, "43803":43777, "43804":43780, "43805":43781, "43806":43782, "43807":43783, "43808":43784, "43809":43785, "43810":43786, "43811":43787, "43812":43788, "43813":43789, "43814":43790, "43815":43791, "43816":43792, "43817":43793, "43818":43794, "43819":43795, "43820":43796, "43821":43797, "43822":43844, "43823":43845, "43824":43846, "43825":43847, "43826":43852, "43827":43848, "43828":43849, "43829":43850, "43830":43851, "43831":43853, "43832":43854, "43833":43855, "43834":43856, "43835":43857, "43836":43858, "43837":43859, "43838":43860, "43839":43861, "43840":43862, "43841":43865, "43842":43863, "43843":43864, "44647":44952, "44648":44953, "44649":44951, "44650":44954, "44651":44955, "44652":44956, "44653":44959, "44654":44958, "44655":44957, "44656":44946, "44657":44945, "44658":44947, "44659":44943, "44660":44942, "44661":44944, "44662":44949, "44663":44948, "44664":44950, "43483":43451, "43484":43449, "44715":44943, "44716":44942, "44717":44946, "44718":44945, "48908":48907, "48909":48907, "48910":48907, "48912":48911, "48913":48911, "48914":48911, "48918":48915, "48919":48916, "48920":48917, "48922":48921, "49734":49865, "49735":49866, "49736":49823, "49737":49782, "49739":49801, "49741":49733, "49742":49783, "49743":49784, "49744":49785, "49745":49786, "49746":49787, "49747":49788, "49748":49789, "49749":49790, "49750":49791, "49751":49792, "49752":49793, "49753":49794, "49754":49795, "49755":49796, "49756":49797, "49757":49798, "49758":49799, "49759":49804, "49760":49805, "49761":49781, "49762":49807, "49763":49808, "49764":49809, "49765":49810, "49766":49811, "49767":49812, "49768":49813, "49769":49814, "49770":49815, "49771":49816, "49772":49803, "49773":49806, "49774":49818, "49775":49819, "49777":49821, "49778":49817, "49779":49822, "49780":49824, "50019":50018, "50021":50020, "50023":50022, "67961":67522, "67962":67531, "67963":67524, "67964":67529, "67965":67530, "67966":67528, "73199":74525, "75473":72446 },
	Prices: {"43799":12600, "49737":12600, "43798":12600, "49734": 12600, "49738":50400, "49739":50400, "49740":50400},
	PriceDefault: 25200,
	Offers: // Changes at 00:00 UTC, "id" is recipe item ID, "price" is in karma, "product" is the crafted item
	{
		Mehem: { id: "43822" },
		Fox: { id: "49736" },
		Derwena: { id: "44659" },
		Yana: { id: "43830" },
		Katyn: { id: "43821" },
		Verma: { id: "49734" }
	}
}
};
