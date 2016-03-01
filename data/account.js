/*
 * This file is used by http://gw2timer.com/account
 * Contains collated API data and supplemental metadata.
 */

/*
 * These words must be unique from the ones in the standard Dictionary object
 * because they will be added to it.
 */
var GW2T_ACCOUNT_DICTIONARY = {
	s_TEMPLATE: {de: "", es: "", fr: "", cs: "", it: "", pl: "", pt: "", ru: "", zh: ""},
	
	s_achievements: {de: "erfolge", es: "logros", fr: "succès",
		cs: "výsledky", it: "obiettivi", pl: "osiągnięcia", pt: "conquistas", ru: "достижения", zh: "成就"},
	s_bank: {de: "bank", es: "banco", fr: "banque",
		cs: "banka", it: "banca", pl: "bank", pt: "banco", ru: "банк", zh: "銀行"},
	s_characters: {de: "charaktere", es: "personajes", fr: "personnages",
		cs: "postavy", it: "personaggi", pl: "postacie", pt: "personagens", ru: "персонажей", zh: "人物"},
	s_guilds: {de: "gilden", es: "clanes", fr: "guildes",
		cs: "cechy", it: "clan", pl: "klany", pt: "clãs", ru: "гильдий", zh: "戰隊"},
	s_manager: {de: "manager", es: "administrador", fr: "gestionnaire",
		cs: "správce", it: "gestione", pl: "menedżer", pt: "gerenciador", ru: "диспетчер", zh: "管理員"},
	s_pvp: {de: "pvp", es: "jcj", fr: "jcj",
		cs: "hph", it: "gcg", pl: "pvp", pt: "jcj", ru: "ипи", zh: "玩家對戰"},
	s_trading: {de: "handel", es: "comercio", fr: "commerciale",
		cs: "obchod", it: "commercio", pl: "handel", pt: "comércio", ru: "продажа", zh: "貿易"},
	s_wardrobe: {de: "garderobenlager", es: "garderobe", fr: "escaparate",
		cs: "skříň", it: "armadio", pl: "szafa", pt: "roupeiro", ru: "гардероб", zh: "衣櫃"},
	
	s_profession: {de: "klasse", es: "profesión", fr: "profession",
		cs: "profese", it: "professione", pl: "zawód", pt: "profissão", ru: "профе́ссия", zh: "職業"},
	s_age: {de: "alter", es: "edad", fr: "âge",
		cs: "věk", it: "età", pl: "wiek", pt: "idade", ru: "возраст", zh: "年齡"},
	s_deaths: {de: "tode", es: "muertes", fr: "morts",
		cs: "úmrtí", it: "morti", pl: "zgonów", pt: "mortes", ru: "смертей", zh: "死亡"},
	s_lifetime: {de: "lebenszeit", es: "vida", fr: "vie",
		cs: "život", it: "vita", pl: "życie", pt: "vida", ru: "жизни", zh: "一生"},
	s_birthday: {de: "geburtstag", es: "cumpleaños", fr: "anniversaire",
		cs: "narozeniny", it: "compleanno", pl: "urodziny", pt: "aniversário", ru: "деньрожде́ния", zh: "生日"},
	s_general: {de: "allgemein", es: "general", fr: "général",
		cs: "obecné", it: "generale", pl: "ogólne", pt: "geral", ru: "общие", zh: "一般"},
	s_dungeon: {de: "verlies", es: "mazmorra", fr: "donjon",
		cs: "žalář", it: "segreta", pl: "loch", pt: "masmorra", ru: "подземелье", zh: "地牢"},
	s_currencies: {de: "währung", es: "monedas", fr: "monnaies",
		cs: "měny", it: "valute", pl: "waluty", pt: "moedas", ru: "валюта", zh: "貨幣"},
	s_tokens: {de: "wertmarke", es: "fichas", fr: "jetons",
		cs: "žetony", it: "gettoni", pl: "żeton", pt: "fichas", ru: "жетоны", zh: "令牌"},
};

/*
 * Categorized currencies for generating separate lists.
 */
var GW2T_CURRENCY_DATA = {
	Dungeon: [
		{ id: 5, name_en: "Ascalonian Tear", name_de: "Ascalonische Träne", name_es: "Lágrima ascaloniana", name_fr: "Larme ascalonienne", name_zh: "阿斯卡隆之淚" },
		{ id: 9, name_en: "Seal of Beetletun", name_de: "Beetletuns Siegel", name_es: "Sello de Beetletun", name_fr: "Sceau de Beetletun", name_zh: "甲虫郡封印" },
		{ id: 11, name_en: "Deadly Bloom", name_de: "Tödliche Blüte", name_es: "Flor mortal", name_fr: "Pousse mortelle", name_zh: "死亡之花" },
		{ id: 10, name_en: "Manifesto of the Moletariate", name_de: "Manifest des Maulwetariats", name_es: "Manifiesto del topotariado", name_fr: "Manifeste du taupinariat", name_zh: "掘洞宣言" },
		{ id: 13, name_en: "Flame Legion Charr Carving", name_de: "Flammen-Legion-Charr-Schnitzerei", name_es: "Talla de charr de la Legión de la Llama", name_fr: "Gravure de Charr de la Légion de la Flamme", name_zh: "烈焰軍團夏爾雕像" },
		{ id: 12, name_en: "Symbol of Koda", name_de: "Symbol Kodas", name_es: "Símbolo de Koda", name_fr: "Symbole de Koda", name_zh: "克達之符" },
		{ id: 14, name_en: "Knowledge Crystal", name_de: "Wissenskristall", name_es: "Cristal del conocimiento", name_fr: "Cristal de connaissance", name_zh: "知識水晶" },
		{ id: 6, name_en: "Shard of Zhaitan", name_de: "Scherbe des Zhaitan", name_es: "Esquirla de Zhaitan", name_fr: "Eclat de Zhaïtan", name_zh: "澤坦碎片" },
		{ id: 7, name_en: "Fractal Relic", name_de: "Fraktal-Relikt", name_es: "Reliquia fractal", name_fr: "Relique fractale", name_zh: "碎層古物" },
		{ id: 24, name_en: "Pristine Fractal Relic", name_de: "Makelloses Fraktal-Relikt", name_es: "Reliquia fractal prístina", name_fr: "Relique fractale immaculée", name_zh: "原始碎層古物" },
		{ id: 28, name_en: "Magnetite Shard", name_de: "Magnetit-Scherbe", name_es: "Esquirla de magnetita", name_fr: "Éclat de magnétite", name_zh: "磁鐵碎塊" }
	],
	General: [ // Coefficient normalizes by approximation each currency to 1 silver
		{ id: 1, coefficient: 0.01, name_en: "Coin", name_de: "Münze", name_es: "Moneda", name_fr: "Pièce", name_zh: "錢幣" },
		{ id: 2, coefficient: 0.01, name_en: "Karma", name_de: "Karma", name_es: "Karma", name_fr: "Karma", name_zh: "業力" },
		{ id: 3, coefficient: 100, name_en: "Laurel", name_de: "Lorbeer", name_es: "Laurel", name_fr: "Laurier", name_zh: "桂冠" },
		{ id: 4, coefficient: 10, name_en: "Gem", name_de: "Edelstein", name_es: "Gema", name_fr: "Gemme", name_zh: "寶石" },
		{ id: 15, coefficient: 1, name_en: "Badge of Honor", name_de: "Ehrenabzeichen", name_es: "Insignia de honor", name_fr: "Insigne d'honneur", name_zh: "榮譽徽章" },
		{ id: 16, coefficient: 100, name_en: "Guild Commendation", name_de: "Gilden-Belobigung", name_es: "Mención de clan", name_fr: "Recommandation de guilde", name_zh: "公會獎狀" },
		{ id: 23, coefficient: 10, name_en: "Spirit Shard", name_de: "Geister-Scherbe", name_es: "Esquirla espiritual", name_fr: "Éclat d'esprit", name_zh: "靈魂碎片" },
		{ id: 18, coefficient: 100, name_en: "Transmutation Charge", name_de: "Transmutations-Ladung", name_es: "Carga de transmutación", name_fr: "Charge de transmutation", name_zh: "幻化力" }
	],
	Map: [
		{ id: 25, name_en: "Geode", name_de: "Geode", name_es: "Geoda", name_fr: "Géode", name_zh: "晶塊" },
		{ id: 27, name_en: "Bandit Crest", name_de: "Banditen-Wappen", name_es: "Enseña de bandido", name_fr: "Écu de bandit", name_zh: "強盜徽飾" },
		{ id: 19, name_en: "Airship Part", name_de: "Luftschiff-Teil", name_es: "Pieza de aeronave", name_fr: "Pièce d'aéronef", name_zh: "飛船部件" },
		{ id: 20, name_en: "Ley Line Crystal", name_de: "Ley-Linien-Kristall", name_es: "Cristal de línea ley", name_fr: "Cristal des lignes de force", name_zh: "魔徑水晶" },
		{ id: 22, name_en: "Lump of Aurillium", name_de: "Aurilliumklumpen", name_es: "Trozo de aurilio", name_fr: "Bloc d'aurillium", name_zh: "塊狀赤金元素" },
		{ id: 29, name_en: "Provisioner Token", name_de: "Versorger-Marke", name_es: "Vale de suministrador", name_fr: "Coupon de fournisseur", name_zh: "供給官徽記" },
		{ id: 26, name_en: "WvW Tournament Claim Ticket", name_de: "WvW-Turnier-Ticket", name_es: "Tique de recogida de torneo WvW", name_fr: "Billet de retrait de tournoi McM", name_zh: "世界之戰錦標賽兌換券" },
		{ id: 30, name_en: "PvP League Ticket", name_de: "PvP-Liga-Ticket", name_es: "Tique de liga PvP", name_fr: "Ticket de ligue JcJ", name_zh: "PvP聯賽兌換券" }
	]
};

/*
 * Lookup table for items that give fractal Agony Resistance (AR), for totaling
 * a character's equipped AR.
 */
var GW2T_AGONY_DATA = {
	"37138": 5, // Versatile Simple Infusion +5
	"70852": 7, // Versatile Simple Infusion +7
	"49424": 1, // +1 Agony Infusion
	"49425": 2,
	"49426": 3,
	"49427": 4,
	"49428": 5,
	"49429": 6,
	"49430": 7,
	"49431": 8,
	"49432": 9,
	"49433": 10,
	"49434": 11,
	"49435": 12,
	"49436": 13,
	"49437": 14,
	"49438": 15,
	"49439": 16,
	"49440": 17,
	"49441": 18,
	"49442": 19,
	"49443": 20,
	"49444": 21,
	"49445": 22,
	"49446": 23,
	"49447": 24,
	"49448": 25,
	"49449": 26,
	"49450": 27,
	"49451": 28,
	"49452": 29,
	"49453": 30
};

/*
 * Quick reference API related data.
 */
var GW2T_ACCOUNT_METADATA = {
	CraftingRank: {
		Novice: 0,
		Initiate: 75,
		Apprentice: 150,
		Journeyman: 225,
		Adept: 300,
		Master: 400,
		Grandmaster: 500
	},
	Race: { // Weight for sorting player's characters by race and gender
		human_female: 10,
		human_male: 9,
		norn_female: 8,
		norn_male: 7,
		sylvari_female: 6,
		sylvari_male: 5,
		asura_female: 4,
		asura_male: 3,
		charr_female: 2,
		charr_male: 1
	},
	Profession: {
		guardian: {
			id: 1,
			weight: 2,
			color: "turquoise"
		},
		warrior: {
			id: 2,
			weight: 3,
			color: "sandybrown"
		},
		engineer: {
			id: 3,
			weight: 4,
			color: "burlyWood"
		},
		ranger: {
			id: 4,
			weight: 5,
			color: "greenyellow"
		},
		thief: {
			id: 5,
			weight: 6,
			color: "darkgray"
		},
		elementalist: {
			id: 6,
			weight: 9,
			color: "orangered"
		},
		mesmer: {
			id: 7,
			weight: 8,
			color: "violet"
		},
		necromancer: {
			id: 8,
			weight: 7,
			color: "seagreen"
		},
		revenant: {
			id: 9,
			weight: 1,
			color: "slategray"
		}
	},
	ProfAssociation: { // Corresponds to MumbleLink assignment
		"1": "guardian",
		"2": "warrior",
		"3": "engineer",
		"4": "ranger",
		"5": "thief",
		"6": "elementalist",
		"7": "mesmer",
		"8": "necromancer",
		"9": "revenant"
	},
	ProfElite: { // Corresponds to specializations.json
		"27": "dragonhunter",
		"18": "berserker",
		"43": "scrapper",
		"5": "druid",
		"7": "daredevil",
		"48": "tempest",
		"40": "chronomancer",
		"34": "reaper",
		"52": "herald"
	},
	ProfLevel: {
		Max: 80
	}
};