/*
 * This file is used by gw2timer.com/finishers
 * Cache association of the finisher to its proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_FINISHERS_HEADERS = {
	PvP: {name_en: "PvP", name_de: "PvP", name_es: "JcJ", name_fr: "JcJ"},
	General: {name_en: "General", name_de: "General", name_es: "General", name_fr: "Général"},
	Gem: {name_en: "Gem Store", name_de: "Edelsteinshop", name_es: "Tienda de gemas", name_fr: "Boutique aux gemmes"}
};

/*
 * Finishers to be excluded from the collate function, because no associated item exists.
 */
var GW2T_FINISHERS_BLACKLIST = {
	"30": "WvW Golden Dolyak Finisher",
	"31": "WvW Silver Dolyak Finisher", // 49462 Permanent Silver Dolyak
	"32": "WvW Bronze Dolyak Finisher",
	"47": "Third Place Trophy Finisher",
	"48": "Basic Finisher",
	"56": "4th Place World Tournament Series Finisher"
};

/*
 * Associated item with that unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of finisher
 * p: Payment type to acquire the item
 */
var GW2T_FINISHERS_DATA = {
PvP: [
	{u: 1, i: 21306, n: "Rabbit Finisher", p: {pvp: true}},
	{u: 2, i: 21307, n: "Deer Finisher", p: {pvp: true}},
	{u: 3, i: 21308, n: "Dolyak Finisher", p: {pvp: true}},
	{u: 4, i: 21313, n: "Wolf Finisher", p: {pvp: true}},
	{u: 6, i: 21312, n: "Tiger Finisher", p: {pvp: true}},
	{u: 5, i: 21314, n: "Bear Finisher", p: {pvp: true}},
	{u: 7, i: 21315, n: "Shark Finisher", p: {pvp: true}},
	{u: 8, i: 71966, n: "Phoenix Finisher", p: {pvp: true}},
	{u: 9, i: 73076, n: "Dragon Finisher", p: {pvp: true}},
	{u: 71, i: 70726, n: "Mordrem Rabbit Finisher", p: {pvp: true}},
	{u: 70, i: 71224, n: "Mordrem Deer Finisher", p: {pvp: true}},
	{u: 68, i: 73880, n: "Mordrem Dolyak Finisher", p: {pvp: true}},
	{u: 65, i: 70923, n: "Mordrem Wolf Finisher", p: {pvp: true}},
	{u: 64, i: 76748, n: "Mordrem Tiger Finisher", p: {pvp: true}},
	{u: 69, i: 70609, n: "Mordrem Bear Finisher", p: {pvp: true}},
	{u: 66, i: 76553, n: "Mordrem Shark Finisher", p: {pvp: true}},
	{u: 63, i: 71649, n: "Mordrem Phoenix Finisher", p: {pvp: true}},
	{u: 67, i: 71245, n: "Mordrem Dragon Finisher", p: {pvp: true}},
	{u: 22, i: 44937, n: "Permanent First Place Trophy Finisher", p: {pvp: true}},
	{u: 23, i: 44938, n: "Permanent Second Place Trophy Finisher", p: {pvp: true}},
	{u: 52, i: 68001, n: "Chinese World Tournament Finisher", p: {gem: 600}},
	{u: 49, i: 68008, n: "European World Tournament Finisher", p: {gem: 600}},
	{u: 50, i: 68014, n: "North American World Tournament Finisher", p: {gem: 600}},
	{u: 54, i: 68101, n: "1st Place World Tournament Series Finisher", p: {pvp: true}},
	{u: 53, i: 68103, n: "2nd Place World Tournament Series Finisher", p: {pvp: true}},
	{u: 55, i: 68100, n: "3rd Place World Tournament Series Finisher", p: {pvp: true}}
],
General: [
	{u: 20, i: 44070, n: "Permanent Gift Finisher", p: {achievement: 0}},
	{u: 21, i: 44071, n: "Permanent Snowman Finisher", p: {achievement: 0}},
	{u: 33, i: 47896, n: "Permanent Snow Globe Finisher", p: {achievement: 0}},
	{u: 24, i: 44601, n: "Permanent Twisted Watchwork Finisher"},
	{u: 10, i: 44723, n: "Permanent Cow Finisher"},
	{u: 13, i: 44877, n: "Permanent Spectre Finisher"},
	{u: 12, i: 44878, n: "Permanent Whump the Giant Finisher"},
	{u: 17, i: 44879, n: "Permanent Grave Finisher"},
	{u: 16, i: 44880, n: "Permanent Martial Finisher"},
	{u: 14, i: 44881, n: "Permanent Sanctified Finisher"},
	{u: 15, i: 44882, n: "Permanent Thornroot Finisher"},
	{u: 25, i: 47880, n: "Permanent Vigil Megalaser Finisher"},
	{u: 34, i: 47899, n: "Permanent Great Jungle Wurm Finisher"},
	{u: 44, i: 48827, n: "Permanent Ley Line Finisher"},
	{u: 26, i: 48952, n: "Permanent Toxic Offshoot Finisher"},
	{u: 27, i: 49164, n: "Permanent Ascalonian-Leader Finisher"},
	{u: 29, i: 49169, n: "Permanent Skritt-Scavenger Finisher"},
	{u: 28, i: 49954, n: "Permanent Quaggan Finisher"},
	{u: 38, i: 63873, n: "Permanent Guild Shield Finisher"},
	{u: 45, i: 64027, n: "Permanent Avatar of Death Finisher"},
	{u: 43, i: 64253, n: "Wizard Lightning Finisher"},
	{u: 39, i: 64255, n: "Permanent Golem Pummeler Finisher"},
	{u: 46, i: 67033, n: "Permanent Guild Flag Finisher"},
	{u: 51, i: 67862, n: "Chickenado Finisher"},
	{u: 57, i: 68573, n: "Permanent Pact Fleet Finisher"},
	{u: 59, i: 69786, n: "Permanent Honor Guard Finisher"},
	{u: 62, i: 70243, n: "Permanent Birthday Finisher", p: {starting: true}},
	{u: 72, i: 83722, n: "Realm Portal Spike Finisher", p: {token: 200}}
],
Gem: [
	{u: 18, i: 44068, n: "Permanent Mad King Finisher", p: {gem: 500}},
	{u: 19, i: 44069, n: "Permanent Scarecrow Finisher", p: {gem: 500}},
	{u: 11, i: 44724, n: "Permanent Super Explosive Finisher", p: {gem: 600}},
	{u: 41, i: 49165, n: "Permanent Mystical Dragon Finisher", p: {gem: 800}},
	{u: 42, i: 49952, n: "Permanent Llama Finisher", p: {gem: 800}},
	{u: 40, i: 63941, n: "Permanent Minstrel Finisher", p: {gem: 800}},
	{u: 60, i: 68107, n: "Revenant Finisher", p: {gem: 0}},
	{u: 58, i: 69616, n: "Permanent Unicorn Finisher", p: {gem: 700}},
	{u: 73, i: 85757, n: "Choya Finisher", p: {gem: 700}}
]
};
