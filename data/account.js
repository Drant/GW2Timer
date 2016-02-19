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
};

/*
 * Quick reference API related data.
 */
var GW2T_ACCOUNT_METADATA = {
	Profession: {
		guardian: {
			color: "blue"
		},
		warrior: {
			color: "brown"
		},
		engineer: {
			color: "blue"
		},
		ranger: {
			color: "yellow"
		},
		thief: {
			color: "black"
		},
		elementalist: {
			color: "red"
		},
		mesmer: {
			color: "pink"
		},
		necromancer: {
			color: "green"
		},
		revenant: {
			color: "gray"
		}
	},
	ProfAssociation: {
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
	ProfElite: {
		"27": "dragonhunter",
		"18": "berserker",
		"43": "scrapper",
		"5": "druid",
		"7": "daredevil",
		"48": "tempest",
		"40": "chronomancer",
		"34": "reaper",
		"52": "herald"
	}
};