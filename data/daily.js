/*
 * This file is used by http://gw2timer.com/daily
 * Daily achievements data and API ID association.
 */

/*
 * A month's achievements with associated days. Example of format:
 * pve: ["GATHER REGION", "ACTIVITY CONDITIONALREGION", "EVENTREGION", "BOSS"],
 * pvp: ["PVP0", "PVP1", "PROFESSIONS0", "PROFESSIONS1"],
 * wvw: ["WVW0", "WVW1", "WVW2", "WVW3"]
 */
var GW2T_DAILY_CALENDAR = {
Start: new Date("2015-11-19T00:00:00Z"),
Finish: new Date("2015-12-19T00:00:00Z"),
Days:
{
"1": {
	pve: ["Miner Shiverpeaks", "Fractal", "Kessex", null],
	pvp: ["Defender", "Capture", "Thief Necro", "Ele Ranger"],
	wvw: ["Land", "Guard", "Tower", "Keep"]
},
"2": {
	pve: ["Forager Orr", "Forger", "Caledon", null],
	pvp: ["Defender", "Kills", "War Necro", "Thief Mes"],
	wvw: ["Spender", "Kills", "Camp", "Defender"]
},
"3": {
	pve: ["Forager Jungle", "Vista Jungle", "Harathi", null],
	pvp: ["Rank", "Reward", "War Eng", "Ranger Eng"],
	wvw: ["Ruins", "Kills", "Keep", "Defender"]
},
"4": {
	pve: ["Miner Ascalon", "Vista Ascalon", "Sparkfly", null],
	pvp: ["Capture", "Kills", "Ele Mes", "Guard Thief"],
	wvw: ["Ruins", "Guard", "Camp", "Keep"]
},
"5": {
	pve: ["Lumberer Kryta", "Vista Ascalon", "Timberline", null],
	pvp: ["Reward", "Rank", "Guard Eng", "Thief Mes"],
	wvw: ["Ruins", "Kills", "Tower", "Defender"]
},
"6": {
	pve: ["Forager Orr", "Forger", "Sparkfly", null],
	pvp: ["Kills", "Capture", "War Ranger", "Ele Necro"],
	wvw: ["Guard", "Creature", "Keep", "Defender"]
},
"7": {
	pve: ["Miner Jungle", "Fractal", "Harathi", null],
	pvp: ["Rank", "Defender", "Guard Ranger", "Mes Necro"],
	wvw: ["Spender", "Ruins", "Camp", "Keep"]
},
"8": {
	pve: ["Lumberer Kryta", "Vista Kryta", "Metrica", null],
	pvp: ["Reward", "Defender", "Guard Thief", "Rev Necro"],
	wvw: ["Land", "Creature", "Defender", "Tower"]
},
"9": {
	pve: ["Miner Shiverpeaks", "Activity", "Kessex", null],
	pvp: ["Rank", "Kills", "War Eng", "Thief Ele"],
	wvw: ["Ruins", "Guard", "Defender", "Camp"]
},
"10": {
	pve: ["Forager Ascalon", "Vista Wastes", "Malchor", null],
	pvp: ["Capture", "Rank", "Guard Eng", "Ranger Thief"],
	wvw: ["Land", "Kills", "Tower", "Defender"]
},
"11": {
	pve: ["Miner Shiverpeaks", "Vista Jungle", "Snowden", null],
	pvp: ["Defender", "Kills", "Eng Ele", "Mes Necro"],
	wvw: ["Ruins", "Guard", "Camp", "Tower"]
},
"12": {
	pve: ["Lumberer Kryta", "Activity", "Dredgehaunt", null],
	pvp: ["Reward", "Rank", "Thief Ele", "Rev Necro"],
	wvw: ["Ruins", "Kills", "Tower", "Defender"]
},
"13": {
	pve: ["Miner Kryta", "Vista Ascalon", "Frostgorge", null],
	pvp: ["Capture", "Kills", "Eng Thief", "Rev Ele"],
	wvw: ["Land", "Caravan", "Defender", "Keep"]
},
"14": {
	pve: ["Lumberer Ascalon", "Forger", "Plains", null],
	pvp: ["Capture", "Defender", "Guard Ele", "Rev Mes"],
	wvw: ["Ruins", "Spender", "Camp", "Tower"]
},
"15": {
	pve: ["Forager Kryta", "Fractal", "Brisban", null],
	pvp: ["Rank", "Kills", "Guard Mes", "Rev Necro"],
	wvw: ["Caravan", "Ruins", "Camp", "Keep"]
},
"16": {
	pve: ["Lumberer Ascalon", "Activity", "Wayfarer", null],
	pvp: ["Rank", "Reward", "Guard Eng", "Ranger Mes"],
	wvw: ["Caravan", "Guard", "Defender", "Tower"]
},
"17": {
	pve: ["Miner Ascalon", "Forger", "Sparkfly", null],
	pvp: ["Capture", "Kills", "Ranger Eng", "Rev Necro"],
	wvw: ["Spender", "Kills", "Keep", "Defender"]
},
"18": {
	pve: ["Forager Orr", "Vista Kryta", "Snowden", null],
	pvp: ["Defender", "Rank", "War Thief", "Ele Mes"],
	wvw: ["Land", "Kills", "Tower", "Camp"]
},
"19": {
	pve: ["Miner Kryta", "Fractal", "Bloodtide", "Megades"],
	pvp: ["Kills", "Reward", "Guard Eng", "Rev Necro"],
	wvw: ["Guard", "Ruins", "Tower", "Defender"]
},
"20": {
	pve: ["Lumberer Jungle", "Vista Jungle", "Kessex", "SB"],
	pvp: ["Rank", "Capture", "War Mes", "Rev Necro"],
	wvw: ["Creature", "Caravan", "Camp", "Tower"]
},
"21": {
	pve: ["Forager Jungle", "Forger", "Queensdale", "Wurm"],
	pvp: ["Defender", "Capture", "War Eng", "Ranger Necro"],
	wvw: ["Land", "Ruins", "Keep", "Camp"]
},
"22": {
	pve: ["Lumberer Kryta", "Vista Ascalon", "Silverwastes", "FE"],
	pvp: ["Capture", "Rank", "War Eng", "Thief Mes"],
	wvw: ["Spender", "Land", "Tower", "Defender"]
},
"23": {
	pve: ["Miner Ascalon", "Vista Kryta", "Marches", "Maw"],
	pvp: ["Reward", "Kills", "War Guard", "Mes Necro"],
	wvw: ["Guard", "Kills", "Defender", "Camp"]
},
"24": {
	pve: ["Forager Kryta", "Vista Shiverpeaks", "Bloodtide", "Wurm"],
	pvp: ["Capture", "Defender", "Ranger Thief", "Rev Ele"],
	wvw: ["Spender", "Ruins", "Camp", "Tower"]
},
"25": {
	pve: ["Miner Shiverpeaks", "Activity", "Caledon", "Jormag"],
	pvp: ["Defender", "Reward", "Eng Mes", "Rev Necro"],
	wvw: ["Ruins", "Creature", "Camp", "Keep"]
},
"26": {
	pve: ["Miner Jungle", "Activity", "Dry", null],
	pvp: ["Kills", "Reward", "War Guard", "Thief Ele"],
	wvw: ["Ruins", "Spender", "Tower", "Keep"]
},
"27": {
	pve: ["Lumberer Ascalon", "Forger", "Plains", null],
	pvp: ["Defender", "Kills", "War Thief", "Rev Mes"],
	wvw: ["Land", "Kills", "Camp", "Tower"]
},
"28": {
	pve: ["Forager Kryta", "Vista Ascalon", "Fields", null],
	pvp: ["Reward", "Defender", "Ranger Eng", "Ele Necro"],
	wvw: ["Land", "Caravan", "Keep", "Defender"]
},
"29": {
	pve: ["Miner Shiverpeaks", "Vista Kryta", "Brisban", null],
	pvp: ["Defender", "Rank", "Guard Thief", "Rev Mes"],
	wvw: ["Ruins", "Guard", "Camp", "Defender"]
},
"30": {
	pve: ["Jungle Lumberer", "Forger", "Bloodtide", null],
	pvp: ["Reward", "Rank", "War Eng", "Rev Mes"],
	wvw: ["Caravan", "Creature", "Camp", "Keep"]
},
"31": {
	pve: ["Forager Ascalon", "Vista Shiverpeaks", "Sparkfly", null],
	pvp: ["Defender", "Kills", "Thief Necro", "Ele Ranger"],
	wvw: ["Creature", "Land", "Keep", "Camp"]
}
},

// Associate the API achievement IDs with the custom achievement nicknames
Association:
{
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
	"946": "Ruins",
	
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
	"2597": "12",
}
};