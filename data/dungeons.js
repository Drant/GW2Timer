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
 */
var GW2T_DUNGEONS_DATA = {
AC: [
	{u: "hodgins", i: 16982, n: "Ascalonian Catacombs", l: "Hodgins", p: {coin: 7600}},
	{u: "detha", i: 16982, n: "Ascalonian Catacombs", l: "Detha", p: {coin: 7600}},
	{u: "tzark", i: 16982, n: "Ascalonian Catacombs", l: "Tzark", p: {coin: 7600}}
],
CM: [
	{u: "asura", i: 17274, n: "Caudecus's Manor", l: "Asura", p: {coin: 6100}},
	{u: "seraph", i: 17274, n: "Caudecus's Manor", l: "Seraph", p: {coin: 6100}},
	{u: "butler", i: 17274, n: "Caudecus's Manor", l: "Butler", p: {coin: 6100}}
],
TA: [
	{u: "leurent", i: 17273, n: "Twilight Arbor", l: "Leurent", p: {coin: 6100}},
	{u: "vevina", i: 17273, n: "Twilight Arbor", l: "Vevina", p: {coin: 6100}},
	{u: "aetherpath", i: 17273, n: "Twilight Arbor", l: "Aetherpath", p: {coin: 9200}}
],
SE: [
	{u: "fergg", i: 17270, n: "Sorrow's Embrace", l: "Fergg", p: {coin: 6100}},
	{u: "rasalov", i: 17270, n: "Sorrow's Embrace", l: "Rasalov", p: {coin: 6100}},
	{u: "koptev", i: 17270, n: "Sorrow's Embrace", l: "Koptev", p: {coin: 6100}}
],
COF: [
	{u: "ferrah", i: 17275, n: "Citadel of Flame", l: "Ferrah", p: {coin: 6100}},
	{u: "magg", i: 17275, n: "Citadel of Flame", l: "Magg", p: {coin: 6100}},
	{u: "rhiannon", i: 17275, n: "Citadel of Flame", l: "Rhiannon", p: {coin: 6100}}
],
HOTW: [
	{u: "butcher", i: 17277, n: "Honor of the Waves", l: "Butcher", p: {coin: 6100}},
	{u: "plunderer", i: 17277, n: "Honor of the Waves", l: "Plunderer", p: {coin: 6100}},
	{u: "zealot", i: 17277, n: "Honor of the Waves", l: "Zealot", p: {coin: 6100}}
],
COE: [
	{u: "submarine", i: 17276, n: "Crucible of Eternity", l: "Submarine", p: {coin: 6100}},
	{u: "teleporter", i: 17276, n: "Crucible of Eternity", l: "Teleport", p: {coin: 6100}},
	{u: "front_door", i: 17276, n: "Crucible of Eternity", l: "Front", p: {coin: 6100}}
],
Arah: [
	{u: "jotun", i: 17272, n: "Ruined City of Arah", l: "Jotun", p: {coin: 12600}},
	{u: "mursaat", i: 17272, n: "Ruined City of Arah", l: "Mursaat", p: {coin: 13100}},
	{u: "forgotten", i: 17272, n: "Ruined City of Arah", l: "Forgotten", p: {coin: 18100}},
	{u: "seer", i: 17272, n: "Ruined City of Arah", l: "Seer", p: {coin: 12600}}
]
};
