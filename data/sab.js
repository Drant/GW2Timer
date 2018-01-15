/*
 * This file is used by gw2timer.com/sab
 * ID association of Super Adventure Box character progression.
 */

/*
 * Category translations.
 */
var GW2T_SAB_HEADERS = {
	Infantile: {name_en: "Infantile Completion", name_de: "Kinderleichter", name_es: "Infantil", name_fr: "Infantile", name_zh: "简单"},
	Normal: {name_en: "Normal Completion", name_de: "Normaler", name_es: "Normal", name_fr: "Normal", name_zh: "正常"},
	Tribulation: {name_en: "Tribulation Completion", name_de: "Bockschwerer", name_es: "Difícil", name_fr: "Tribulation", name_zh: "苦难"},
	Unlocks: {name_en: "Unlocks", name_de: "Freischaltungen", name_es: "Desbloquearán", name_fr: "Déverrouillés", name_zh: "解锁"},
	Songs: {name_en: "Songs", name_de: "Lieder", name_es: "Canciones", name_fr: "Chansons", name_zh: "歌曲"}
};

/*
 * Associated icons and names with that unlock.
 * u: Unlock ID
 * n: Name of item
 * l: Label over the slot
 * t: Tooltip, if not provided name will be used
 */
var GW2T_SAB_DATA = {
Infantile: [
	{u: "zones_13", i: "mode_infantile", n: "Sunny Glade", l: "1-1"},
	{u: "zones_14", i: "mode_infantile", n: "Dark Woods", l: "1-2"},
	{u: "zones_15", i: "mode_infantile", n: "Kingdom of Fungus", l: "1-3"},
	{u: "zones_16", i: "mode_infantile", n: "Rapids", l: "2-1"},
	{u: "zones_17", i: "mode_infantile", n: "Pain Cliffs", l: "2-2"},
	{u: "zones_18", i: "mode_infantile", n: "Storm Top", l: "2-3"}
],
Normal: [
	{u: "zones_1", i: "mode_normal", n: "Sunny Glade", l: "1-1"},
	{u: "zones_2", i: "mode_normal", n: "Dark Woods", l: "1-2"},
	{u: "zones_3", i: "mode_normal", n: "Kingdom of Fungus", l: "1-3"},
	{u: "zones_4", i: "mode_normal", n: "Rapids", l: "2-1"},
	{u: "zones_5", i: "mode_normal", n: "Pain Cliffs", l: "2-2"},
	{u: "zones_6", i: "mode_normal", n: "Storm Top", l: "2-3"}
],
Tribulation: [
	{u: "zones_25", i: "mode_tribulation", n: "Sunny Glade", l: "1-1"},
	{u: "zones_26", i: "mode_tribulation", n: "Dark Woods", l: "1-2"},
	{u: "zones_27", i: "mode_tribulation", n: "Kingdom of Fungus", l: "1-3"},
	{u: "zones_28", i: "mode_tribulation", n: "Rapids", l: "2-1"},
	{u: "zones_29", i: "mode_tribulation", n: "Pain Cliffs", l: "2-2"},
	{u: "zones_30", i: "mode_tribulation", n: "Storm Top", l: "2-3"}
],
Unlocks: [
	{u: "unlocks_1", i: "chain_stick", n: "Chain Sticks"},
	{u: "unlocks_3", i: "slingshot", n: "Slingshot"},
	{u: "unlocks_6", i: "whip", n: "Whip"},
	{u: "unlocks_9", i: "mini_bomb", n: "Mini Bomb"},
	{u: "unlocks_12", i: "candle", n: "Candle (Super Adventure Box)"},
	{u: "unlocks_13", i: "torch", n: "Torch (Super Adventure Box)"},
	{u: "unlocks_15", i: "wooden_whistle", n: "Wooden Whistle"},
	{u: "unlocks_18", i: "digger", n: "Digger"},
	{u: "unlocks_19", i: "nice_scoop", n: "Nice Scoop"},
	{u: "unlocks_21", i: "glove_of_wisdom", n: "Glove Of Wisdom"},
	{u: "unlocks_24", i: "bauble_purse", n: "Bauble Purse"},
	{u: "unlocks_25", i: "bauble_tote_bag", n: "Bauble Tote Bag"},
	{u: "unlocks_27", i: "moto_breath", n: "Moto's Breath"},
	{u: "unlocks_28", i: "moto_finger", n: "Moto's Finger"},
	{u: "unlocks_31", i: "health_vessel_1", n: "Health Vessel"},
	{u: "unlocks_32", i: "health_vessel_2", n: "Health Vessel"},
	{u: "unlocks_34", i: "medium_health_potion", n: "Medium Health Bottle"}
],
Songs: [
	{u: "songs_1", i: "song", n: "Wooden_Whistle#Songs", l: "Secret", t: "Secret Song"},
	{u: "songs_2", i: "song", n: "Wooden_Whistle#Songs", l: "Gatekeeper", t: "Gatekeeper Lullaby"},
	{u: "songs_3", i: "song", n: "Wooden_Whistle#Songs", l: "Shatter", t: "Shatter Serenade"}
]
};

