/*
 * This file is used by http://gw2timer.com/carriers
 * Cache association of the mail carrier to its proper item and category.
 */

/*
 * Category translations.
 */
var GW2T_CARRIERS_HEADERS = {
	Normal: {name_en: "Normal", name_de: "Normal", name_es: "Normal", name_fr: "Normal", name_zh: "正常"},
	Gem: {name_en: "Gem Store", name_de: "Edelsteinshop", name_es: "Tienda de gemas", name_fr: "Boutique aux gemmes)", name_zh: "宝石商店"}
};

/*
 * Associated item with that unlockable.
 * u: Unlockable ID (unlock ID)
 * i: Item ID associated with that unlock
 * n: Name of unlock
 * p: Payment type to acquire the item
 */
var GW2T_CARRIERS_DATA = {
Normal: [
	{u: 10, i: 69745, n: "Raven Mail Carrier"},
	{u: 9, i: 69774, n: "Parrot Mail Carrier"},
	{u: 15, i: 79341, n: "Anniversary Mail Carrier", p: {starting: true}}
],
Gem: [
	{u: 6, i: 67355, n: "Ghostly Mail Courier", p: {gem: 500}},
	{u: 13, i: 67863, n: "Exalted Mail Courier", p: {gem: 500}},
	{u: 1, i: 68102, n: "Confetti Mail Delivery", p: {gem: 300}},
	{u: 3, i: 68104, n: "Gifts Mail Delivery", p: {gem: 350}},
	{u: 5, i: 68106, n: "Griffon Mail Carrier", p: {gem: 500}},
	{u: 7, i: 68652, n: "Red Envelope Mail Carrier", p: {gem: 600}},
	{u: 8, i: 68681, n: "Snow Owl Mail Carrier", p: {gem: 350}},
	{u: 2, i: 68682, n: "Sylvari Seed Pod Mail Carrier", p: {gem: 350}},
	{u: 11, i: 69628, n: "Aviator Quaggan Mail Carrier", p: {gem: 500}},
	{u: 12, i: 69715, n: "Revenant Mail Carrier", p: {gem: 350}},
	{u: 14, i: 78088, n: "Super Bee Dog Mail Carrier", p: {gem: 0}},
	{u: 16, i: 81215, n: "Hounds of Balthazar Mail Carrier", p: {gem: 0}},
]
};
