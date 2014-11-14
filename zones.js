/* This file is used by gw2t.js and is based on http://atlas.guildwars2.com
 */

var GW2T_REGION_DATA = {
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
"dry":
{
	name: "Dry Top",
	region: "maguuma",
	rect: [[3840, 15742], [5888, 17152]]//[3840, 14592]
},
"silverwastes":
{
	name: "The Silverwastes",
	region: "maguuma",
	rect: [[3838, 14206], [5886, 15742]]
},
"rata":
{
	name: "Rata Sum",
	region: "maguuma",
	rect: [[4608, 19648], [7168, 22208]]
},
"brisban":
{
	name: "Brisban Wildlands",
	region: "maguuma",
	rect: [[5888, 14464], [9344, 17152]]
},
"metrica":
{
	name: "Metrica Province",
	region: "maguuma",
	rect: [[7168, 17152], [9344, 20480]]
},
"caledon":
{
	name: "Caledon Forest",
	region: "maguuma",
	rect: [[9344, 16128], [11264, 20096]]
},
"kessex":
{
	name: "Kessex Hills",
	region: "kryta",
	rect: [[9344, 14080], [13440, 16128]]
},
"grove":
{
	name: "The Grove",
	region: "maguuma",
	rect: [[9728, 20096], [11136, 22144]]
},
"queensdale":
{
	name: "Queensdale",
	region: "kryta",
	rect: [[9856, 11648], [13440, 14080]]
},
"cursed":
{
	name: "Cursed Shore",
	region: "orr",
	rect: [[10112, 25216], [12160, 29312]]
},
"divinity":
{
	name: "Divinity's Reach",
	region: "kryta",
	rect: [[10240, 9856], [12160, 11648]]
},
"malchor":
{
	name: "Malchor's Leap",
	region: "orr",
	rect: [[10368, 23168], [14464, 25216]]
},
"southsun":
{
	name: "Southsun Cove",
	region: "kryta",
	rect: [[11520, 18944], [14208, 20736]]
},
"harathi":
{
	name: "Harathi Hinterlands",
	region: "kryta",
	rect: [[13440, 9472], [16640, 12288]]
},
"gendarran":
{
	name: "Gendarran Fields",
	region: "kryta",
	rect: [[13440, 12288], [17664, 14336]]
},
"straits":
{
	name: "Straits of Devastation",
	region: "orr",
	rect: [[14464, 22400], [17792, 25216]]
},
"lion":
{
	name: "Lion's Arch",
	region: "kryta",
	rect: [[15232, 14336], [17664, 15872]]
},
"bloodtide":
{
	name: "Bloodtide Coast",
	region: "kryta",
	rect: [[15232, 15872], [17664, 19072]]
},
"sparkfly":
{
	name: "Sparkfly Fen",
	region: "maguuma",
	rect: [[15232, 19072], [17792, 22400]]
},
"lornar":
{
	name: "Lornar's Pass",
	region: "shiverpeaks",
	rect: [[17664, 13312], [19456, 18176]]
},
"snowden":
{
	name: "Snowden Drifts",
	region: "shiverpeaks",
	rect: [[17664, 11264], [21760, 13312]]
},
"maelstrom":
{
	name: "Mount Maelstrom",
	region: "maguuma",
	rect: [[17792, 21376], [21632, 23808]]
},
"timberline":
{
	name: "Timberline Falls",
	region: "shiverpeaks",
	rect: [[18944, 18176], [21248, 21376]]
},
"hoelbrak":
{
	name: "Hoelbrak",
	region: "shiverpeaks",
	rect: [[19456, 13312], [21760, 14976]]
},
"dredgehaunt":
{
	name: "Dredgehaunt Cliffs",
	region: "shiverpeaks",
	rect: [[19456, 14976], [21760, 18176]]
},
"frostgorge":
{
	name: "Frostgorge Sound",
	region: "shiverpeaks",
	rect: [[20736, 8192], [23808, 11264]]
},
"wayfarer":
{
	name: "Wayfarer Foothills",
	region: "shiverpeaks",
	rect: [[21760, 11264], [23552, 15872]]
},
"citadel":
{
	name: "Black Citadel",
	region: "ascalon",
	rect: [[23552, 13568], [25088, 15616]]
},
"diessa":
{
	name: "Diessa Plateau",
	region: "ascalon",
	rect: [[23552, 11264], [27136, 13568]]
},
"fireheart":
{
	name: "Fireheart Rise",
	region: "ascalon",
	rect: [[23808, 8448], [27136, 11264]]
},
"ashford":
{
	name: "Plains of Ashford",
	region: "ascalon",
	rect: [[25088, 13568], [29184, 15616]]
},
"marches":
{
	name: "Iron Marches",
	region: "ascalon",
	rect: [[27136, 9472], [29184, 13568]]
},
"fields":
{
	name: "Fields of Ruin",
	region: "ascalon",
	rect: [[28672, 16256], [31744, 19328]]
},
"blazeridge":
{
	name: "Blazeridge Steppes",
	region: "ascalon",
	rect: [[29184, 12160], [31232, 16256]]
}
};
