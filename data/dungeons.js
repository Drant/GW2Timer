/*
 * This file is used by http://gw2timer.com/dungeons
 * Cache association of account daily dungeon completion.
 */

/*
 * Category translations.
 */
var GW2T_DUNGEONS_HEADERS = {
	AC: {name_en: "Ascalonian Catacombs", name_de: "Katakomben von Ascalon", name_es: "Catacumbas Ascalonianas", name_fr: "Catacombes d'Ascalon", name_zh: "阿斯卡隆墓穴"},
	CM: {name_en: "Caudecus's Manor", name_de: "Caudecus' Anwesen", name_es: "Mansión de Caudecus", name_fr: "Manoir de Caudecus", name_zh: "考迪克斯庄园"},
	TA: {name_en: "Twilight Arbor", name_de: "Zwielichtgarten", name_es: "Pérgola del Crepúsculo", name_fr: "Tonnelle du crépuscule", name_zh: "暮光之根"},
	SE: {name_en: "Sorrow's Embrace", name_de: "Umarmung der Betrübnis", name_es: "Abrazo del Pesar", name_fr: "Étreinte des Lamentations", name_zh: "悲伤之拥"},
	COF: {name_en: "Citadel of Flame", name_de: "Flammenzitadelle", name_es: "Ciudadela de la Llama", name_fr: "Citadelle de la Flamme", name_zh: "烈焰壁垒"},
	HOTW: {name_en: "Honor of the Waves", name_de: "Zierde der Wogen", name_es: "Honor de las Olas", name_fr: "Honneur des vagues", name_zh: "海浪之誉"},
	COE: {name_en: "Crucible of Eternity", name_de: "Schmelztiegel der Ewigkeit", name_es: "Crisol de la Eternidad", name_fr: "Creuset de l'éternité", name_zh: "永恒熔炉"},
	Arah: {name_en: "Ruined City of Arah", name_de: "Ruinenstadt Arah", name_es: "Ciudad en ruinas de Arah", name_fr: "Cité en ruine d'Arah", name_zh: "亚拉城废墟"}
};

/*
 * Associated finisher item with that finisher unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of item
 * l: Label for comment
 * p: Payment reward. Path reward + 2600 copper daily + 6250 copper (5 gold / 8 paths "Dungeon Frequenter")
 */
var GW2T_DUNGEONS_DATA = {
AC: [
	{u: "hodgins", i: 16982, n: "Ascalonian_Catacombs_(explorable)#Hodgins.27s_Plan_.28Path_1.29", l: "Hodgins", p: {coin: 7600}},
	{u: "detha", i: 16982, n: "Ascalonian_Catacombs_(explorable)#Detha.27s_Plan_.28Path_2.29", l: "Detha", p: {coin: 7600}},
	{u: "tzark", i: 16982, n: "Ascalonian_Catacombs_(explorable)#Tzark.27s_Plan_.28Path_3.29", l: "Tzark", p: {coin: 7600}}
],
CM: [
	{u: "asura", i: 17274, n: "Caudecus's_Manor_(explorable)#Asura_Route_.28Path_1.29", l: "Asura", p: {coin: 6100}},
	{u: "seraph", i: 17274, n: "Caudecus's_Manor_(explorable)#Seraph_Path_.28Path_2.29", l: "Seraph", p: {coin: 6100}},
	{u: "butler", i: 17274, n: "Caudecus's_Manor_(explorable)#Butler_Path_.28Path_3.29", l: "Butler", p: {coin: 6100}}
],
TA: [
	{u: "leurent", i: 17273, n: "Twilight_Arbor_(explorable)#Leurent.27s_Path_.28up.29", l: "Leurent", p: {coin: 6100}},
	{u: "vevina", i: 17273, n: "Twilight_Arbor_(explorable)#Vevina.27s_Path_.28forward.29", l: "Vevina", p: {coin: 6100}},
	{u: "aetherpath", i: 17273, n: "Aetherpath_(Twilight_Arbor)", l: "Aetherpath", p: {coin: 9200}}
],
SE: [
	{u: "fergg", i: 17270, n: "Sorrow's_Embrace_(explorable)#Path_1", l: "Fergg", p: {coin: 6100}},
	{u: "rasalov", i: 17270, n: "Sorrow's_Embrace_(explorable)#Path_2", l: "Rasalov", p: {coin: 6100}},
	{u: "koptev", i: 17270, n: "Sorrow's_Embrace_(explorable)#Path_3", l: "Koptev", p: {coin: 6100}}
],
COF: [
	{u: "ferrah", i: 17275, n: "Citadel_of_Flame_(explorable)#Ferrah", l: "Ferrah", p: {coin: 6100}},
	{u: "magg", i: 17275, n: "Citadel_of_Flame_(explorable)#Magg", l: "Magg", p: {coin: 6100}},
	{u: "rhiannon", i: 17275, n: "Citadel_of_Flame_(explorable)#Rhiannon", l: "Rhiannon", p: {coin: 6100}}
],
HOTW: [
	{u: "butcher", i: 17277, n: "Honor_of_the_Waves_(explorable)#Path_1", l: "Butcher", p: {coin: 6100}},
	{u: "plunderer", i: 17277, n: "Honor_of_the_Waves_(explorable)#Path_2", l: "Plunderer", p: {coin: 6100}},
	{u: "zealot", i: 17277, n: "Honor_of_the_Waves_(explorable)#Path_3", l: "Zealot", p: {coin: 6100}}
],
COE: [
	{u: "submarine", i: 17276, n: "Crucible_of_Eternity_(explorable)#Path_1:_Escape_Using_the_Submarine", l: "Submarine", p: {coin: 6100}},
	{u: "teleporter", i: 17276, n: "Crucible_of_Eternity_(explorable)#Path_2:_Escape_using_the_Experimental_Teleporter", l: "Teleport", p: {coin: 6100}},
	{u: "front_door", i: 17276, n: "Crucible_of_Eternity_(explorable)#Path_3:_Escape_through_the_Front_Door", l: "Front", p: {coin: 6100}}
],
Arah: [
	{u: "jotun", i: 17272, n: "The_Ruined_City_of_Arah_(explorable)#Jotun_path_.28Path_1.29", l: "Jotun", p: {coin: 12600}},
	{u: "mursaat", i: 17272, n: "The_Ruined_City_of_Arah_(explorable)#Mursaat_path_.28Path_2.29", l: "Mursaat", p: {coin: 13100}},
	{u: "forgotten", i: 17272, n: "The_Ruined_City_of_Arah_(explorable)#Forgotten_path_.28Path_3.29", l: "Forgotten", p: {coin: 18100}},
	{u: "seer", i: 17272, n: "The_Ruined_City_of_Arah_(explorable)#Seer_path_.28Path_4.29", l: "Seer", p: {coin: 12600}}
]
};
