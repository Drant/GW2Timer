/*
 * This file is used by gw2timer.com/raids
 * Cache association of account weekly raid completion.
 */

/*
 * Category translations.
 */
var GW2T_RAIDS_HEADERS = {
	SpiritVale: {name_en: "Spirit Vale", name_de: "Geistertal", name_es: "Valle Espiritual", name_fr: "Vallée des esprits", name_zh: "灵魂山谷"},
	SalvationPass: {name_en: "Salvation Pass", name_de: "Erlösungspass", name_es: "Paso de la Salvación", name_fr: "Passage de la rédemption", name_zh: "救赎小道"},
	StrongholdOfTheFaithful: {name_en: "Stronghold of the Faithful", name_de: "Festung der Treuen", name_es: "Fortaleza de los Fieles", name_fr: "Forteresse des Fidèles", name_zh: "信仰要塞"},
	BastionOfThePenitent: {name_en: "Bastion of the Penitent", name_de: "Bastion der Bußfertigen", name_es: "Bastión del Penitente", name_fr: "Bastion du pénitent", name_zh: "忏悔者堡垒"},
	HallOfChains: {name_en: "Hall of Chains", name_de: "Halle der Ketten", name_es: "Sala de las Cadenas", name_fr: "Salle des chaînes", name_zh: "锁链殿堂"},
	MythwrightGambit: {name_en: "Mythwright Gambit", name_de: "Mythenschreiber-Wagnis", name_es: "Forjador de Mitos", name_fr: "Gambit de forgeconte", name_zh: "秘法对决"},
	TheKeyOfAhdashim: {name_en: "The Key of Ahdashim", name_de: "Schlüssel von Ahdashim", name_es: "La Llave de Ahdashim", name_fr: "La clé d'Ahdashim", name_zh: "阿达西姆之钥"}
};

/*
 * Associated finisher item with that finisher unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of item
 * l: Label for comment
 */
var GW2T_RAIDS_DATA = {
SpiritVale: [
	{u: "vale_guardian", i: 77334, n: "Spirit_Vale#Vale_Guardian", l: "Guardian"},
	{u: "spirit_woods", i: 79490, n: "Spirit_Vale#Spirit_Woods", l: "Spirit"},
	{u: "gorseval", i: 77296, n: "Spirit_Vale#Gorseval_the_Multifarious", l: "Gorseval"},
	{u: "sabetha", i: 77339, n: "Spirit_Vale#Sabetha_the_Saboteur", l: "Sabetha"}
],
SalvationPass: [
	{u: "slothasor", i: 77870, n: "Salvation_Pass#Slothasor", l: "Slothasor"},
	{u: "bandit_trio", i: 78003, n: "Salvation_Pass#Prison_Camp_encounter", l: "Bandit"},
	{u: "matthias", i: 77911, n: "Salvation_Pass#Matthias_Gabrel", l: "Matthias"}
],
StrongholdOfTheFaithful: [
	{u: "escort", i: 78828, n: "Stronghold_of_the_Faithful#Siege_the_Stronghold", l: "McLeod"},
	{u: "keep_construct", i: 78890, n: "Stronghold_of_the_Faithful#Keep_Construct", l: "Construct"},
	{u: "twisted_castle", i: 78902, n: "Stronghold_of_the_Faithful#Twisted_Castle", l: "Castle"},
	{u: "xera", i: 78815, n: "Stronghold_of_the_Faithful#Xera", l: "Xera"}
],
BastionOfThePenitent: [
	{u: "cairn", i: 80562, n: "Bastion_of_the_Penitent#Cairn_the_Indomitable", l: "Cairn"},
	{u: "mursaat_overseer", i: 80224, n: "Bastion_of_the_Penitent#Mursaat_Overseer", l: "Overseer"},
	{u: "samarog", i: 80218, n: "Bastion_of_the_Penitent#Samarog", l: "Samarog"},
	{u: "deimos", i: 80327, n: "Bastion_of_the_Penitent#Deimos", l: "Deimos"}
],
HallOfChains: [
	{u: "soulless_horror", i: 86076, n: "Hall_of_Chains#Soulless_Horror", l: "Horror"},
	{u: "river_of_souls", i: 77291, n: "Hall_of_Chains#River_of_Souls", l: "River"},
	{u: "statues_of_grenth", i: 85667, n: "Hall_of_Chains#Statues_of_Grenth", l: "Statues"},
	{u: "voice_in_the_void", i: 85998, n: "Hall_of_Chains#The_Voice_in_the_Void", l: "Voice"}
],
MythwrightGambit: [
	{u: "conjured_amalgamate", i: 88543, n: "Mythwright_Gambit#Conjured_Amalgamate", l: "Amalgamate"},
	{u: "twin_largos", i: 82671, n: "Mythwright_Gambit#Largos_Twins:_Nikare_and_Kenut", l: "Twins"},
	{u: "qadim", i: 88587, n: "Mythwright_Gambit#Qadim", l: "Qadim"}
],
TheKeyOfAhdashim: [
	{u: "gate", i: 87133, n: "The_Key_of_Ahdashim#Walkthrough", l: "Gate"},
	{u: "adina", i: 91151, n: "The_Key_of_Ahdashim#Cardinal_Adina", l: "Adina"},
	{u: "sabir", i: 91254, n: "The_Key_of_Ahdashim#Cardinal_Sabir", l: "Sabir"},
	{u: "qadim_the_peerless", i: 88906, n: "The_Key_of_Ahdashim#Qadim_the_Peerless", l: "Qadim"}
]
};
