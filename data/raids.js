/*
 * This file is used by http://gw2timer.com/raids
 * Cache association of account weekly raid completion.
 */

/*
 * Category translations.
 */
var GW2T_RAIDS_HEADERS = {
	SpiritVale: {name_en: "Spirit Vale", name_de: "Geistertal", name_es: "Valle Espiritual", name_fr: "Vallée des esprits", name_zh: "灵魂山谷"},
	SalvationPass: {name_en: "Salvation Pass", name_de: "Erlösungspass", name_es: "Paso de la Salvación", name_fr: "Passage de la rédemption", name_zh: "救赎小道"},
	StrongholdOfTheFaithful: {name_en: "Stronghold of the Faithful", name_de: "Festung der Treuen", name_es: "Fortaleza de los Fieles", name_fr: "Forteresse des Fidèles", name_zh: "信仰要塞"},
	BastionOfThePenitent: {name_en: "Bastion of the Penitent", name_de: "Bastion der Bußfertigen", name_es: "Bastión del Penitente", name_fr: "Bastion du pénitent", name_zh: "忏悔者堡垒"}
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
	{u: "vale_guardian", i: 77334, n: "Vale Guardian"},
	{u: "spirit_woods", i: 79490, n: "Spirit Woods"},
	{u: "gorseval", i: 77296, n: "Gorseval"},
	{u: "sabetha", i: 77339, n: "Sabetha"}
],
SalvationPass: [
	{u: "slothasor", i: 77870, n: "Slothasor"},
	{u: "bandit_trio", i: 78003, n: "Bandit Trio"},
	{u: "matthias", i: 77911, n: "Matthias"}
],
StrongholdOfTheFaithful: [
	{u: "escort", i: 78828, n: "McLeod"},
	{u: "keep_construct", i: 78890, n: "Keep Construct"},
	{u: "twisted_castle", i: 78902, n: "Twisted Castle"},
	{u: "xera", i: 78815, n: "Xera"}
],
BastionOfThePenitent: [
	{u: "cairn", i: 80562, n: "Cairn the Indomitable"},
	{u: "mursaat_overseer", i: 80224, n: "Mursaat Overseer"},
	{u: "samarog", i: 80218, n: "Samarog"},
	{u: "deimos", i: 80222, n: "Deimos"}
]
};
