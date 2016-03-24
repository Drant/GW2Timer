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
	s_attributes: {de: "attribute", es: "atributos", fr: "caractéristiques",
		cs: "atributy", it: "attributi", pl: "atrybuty", pt: "atributos", ru: "атрибуты", zh: "屬性"}
};

/*
 * Categorized currencies for generating separate lists.
 * For general currencies, coefficient property normalizes by approximation each
 * currency to 1 silver. For other currencies, it normalizes relative to all.
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
		{ id: 24, coefficient: 15, name_en: "Pristine Fractal Relic", name_de: "Makelloses Fraktal-Relikt", name_es: "Reliquia fractal prístina", name_fr: "Relique fractale immaculée", name_zh: "原始碎層古物" },
		{ id: 28, coefficient: 10, name_en: "Magnetite Shard", name_de: "Magnetit-Scherbe", name_es: "Esquirla de magnetita", name_fr: "Éclat de magnétite", name_zh: "磁鐵碎塊" }
	],
	General: [
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
 * Quick reference API related data.
 */
var GW2T_ACCOUNT_METADATA = {
	Bank: {
		NumSlotsHorizontal: 10,
		NumSlotsVertical: 3,
		NumSlotsPerTab: 30
	},
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
			color: "turquoise",
			isswappable: true,
			health: "low"
		},
		warrior: {
			id: 2,
			weight: 3,
			color: "sandybrown",
			isswappable: true,
			health: "high"
		},
		engineer: {
			id: 3,
			weight: 4,
			color: "burlyWood",
			isswappable: false,
			health: "mid"
		},
		ranger: {
			id: 4,
			weight: 5,
			color: "greenyellow",
			isswappable: true,
			health: "mid"
		},
		thief: {
			id: 5,
			weight: 6,
			color: "darkgray",
			isswappable: true,
			health: "low"
		},
		elementalist: {
			id: 6,
			weight: 9,
			color: "orangered",
			isswappable: false,
			health: "low"
		},
		mesmer: {
			id: 7,
			weight: 8,
			color: "violet",
			isswappable: true,
			health: "mid"
		},
		necromancer: {
			id: 8,
			weight: 7,
			color: "seagreen",
			isswappable: true,
			health: "high"
		},
		revenant: {
			id: 9,
			weight: 1,
			color: "slategray",
			isswappable: true,
			health: "mid"
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

/*
 * Metadata for equipment items and presentation.
 */
var GW2T_EQUIPMENT_DATA = {
	// The ordering of equipment slots to generate the equipment window
	ColumnLeft: ["Helm", "Shoulders", "Coat", "Gloves", "Leggings", "Boots", "WeaponA1", "WeaponA2", "WeaponB1", "WeaponB2"],
	ColumnRight: ["Backpack", "Accessory1", "Accessory2", "Amulet", "Ring1", "Ring2", "Sickle", "Axe", "Pick", "HelmAquatic", "WeaponAquaticA", "WeaponAquaticB"],
	BriefRight: ["Backpack", "Accessory1", "Accessory2", "Amulet", "Ring1", "Ring2"], // Item names for right column
	AttributableSlots: {Helm: 1, Shoulders: 1, Coat: 1, Gloves: 1, Leggings: 1, Boots: 1, WeaponA1: 1, WeaponA2: 1, Backpack: 1, Accessory1: 1, Accessory2: 1, Amulet: 1, Ring1: 1, Ring2: 1},
	ArmorSlots: {Helm: 1, Shoulders: 1, Coat: 1, Gloves: 1, Leggings: 1, Boots: 1},
	ToggleableSlots: {Helm: 1, Shoulders: 1, Gloves: 1, Backpack: 1},
	NumArmorSlots: 6,
	GatheringCharges: {Sickle: 50, Axe: 100, Pick: 100},
	SalvageCharges: {
		"23038": 15, // Crude Salvage Kit
		"23040": 25, // Basic Salvage Kit
		"23041": 25, // Fine Salvage Kit
		"23042": 25, // Journeyman's Salvage Kit
		"23043": 25, // Master's Salvage Kit
		"23045": 250, // Mystic Salvage Kit
		"19986": 25 // Black Lion Salvage Kit
	}
};

/*
 * Metadata for item attributes and character stats.
 */
var GW2T_ATTRIBUTE_DATA = {
	// Ordering of icons for displaying the attributes window
	ColumnLeft: ["Power", "Toughness", "Vitality", "Precision", "Ferocity", "ConditionDamage", "Expertise", "Concentration", "AgonyResistance"],
	ColumnRight: ["Profession", "Armor", "Health", "CriticalChance", "CriticalDamage", "HealingPower", "ConditionDuration", "BoonDuration", "MagicFind"],
	// Constructor for standard attributes-containing object
	Base: function()
	{
		this.Power = 0,
		this.Toughness = 0;
		this.Armor = 0;
		this.Vitality = 0;
		this.Health = 0;
		this.Precision = 0;
		this.CriticalChance = 0;
		this.Ferocity = 0;
		this.CriticalDamage = 0;
		this.ConditionDamage = 0;
		this.HealingPower = 0;
		this.Expertise = 0;
		this.ConditionDuration = 0;
		this.Concentration = 0;
		this.BoonDuration = 0;
		this.AgonyResistance = 0;
		this.MagicFind = 0;
	},
	PrimaryGrowth: [ // The attribute points the player gains at a level (the ith array index)
		37, 7, 7, 7, 7, 7, 7, 7, 7, 7,     //  1-10
		0, 10, 0, 10, 0, 10, 0, 10, 0, 10, // 11-20
		0, 14, 0, 14, 0, 15, 0, 16, 0, 16, // 21-30
		0, 20, 0, 20, 0, 20, 0, 20, 0, 20, // 31-40
		0, 24, 0, 24, 0, 25, 0, 26, 0, 26, // 41-50
		0, 30, 0, 30, 0, 30, 0, 30, 0, 30, // 51-60
		0, 34, 0, 34, 0, 35, 0, 36, 0, 36, // 61-70
		0, 44, 0, 44, 0, 45, 0, 46, 0, 46  // 71-80
	],
	PrimaryPoints: [ // The computed summation
		37, 44, 51, 58, 65, 72, 79, 86, 93, 100,
		100, 110, 110, 120, 120, 130, 130, 140, 140, 150,
		150, 164, 164, 178, 178, 193, 193, 209, 209, 225,
		225, 245, 245, 265, 265, 285, 285, 305, 305, 325,
		325, 349, 349, 373, 373, 398, 398, 424, 424, 450,
		450, 480, 480, 510, 510, 540, 540, 570, 570, 600,
		600, 634, 634, 668, 668, 703, 703, 739, 739, 775,
		775, 819, 819, 863, 863, 908, 908, 954, 954, 1000 // 1000 base attributes at level 80
	],
	PrecisionDivisor: [ // Precision divided by this number to get critical chance
		1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0,
		2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3.0,
		3.2, 3.4, 3.6, 3.8, 4.0, 4.2, 4.4, 4.6, 4.8, 5.0,
		5.2, 5.4, 5.6, 5.8, 6.0, 6.2, 6.4, 6.6, 6.8, 7.0,
		7.3, 7.6, 7.9, 8.2, 8.5, 8.8, 9.1, 9.4, 9.7, 10.0,
		10.3, 10.6, 10.9, 11.2, 11.5, 11.8, 12.1, 12.4, 12.7, 13.0,
		13.4, 13.8, 14.2, 14.6, 15.0, 15.4, 15.8, 16.2, 16.6, 17.0,
		17.4, 17.8, 18.2, 18.6, 19.0, 19.4, 19.8, 20.2, 20.6, 21.0 // Divide by 21 at level 80
	],
	SecondaryDivisorRatio: 7/5, // Divide the precision divisor by this ratio to get the secondary attributes' divisor
	HealthGrowth: { // Additional health points per level, key corresponds to profession health property
		high: {
			"19": 28,  //  1-19
			"39": 70,  // 20-39
			"59": 140, // 40-59
			"79": 210, // 60-79
			"80": 280  //    80
		},
		mid: {
			"19": 18,
			"39": 45,
			"59": 90,
			"79": 135,
			"80": 180
		},
		low: {
			"19": 5,
			"39": 12.5,
			"59": 25,
			"79": 37.5,
			"80": 50
		}
	},
	Constants: {
		BASE_CRITICALCHANCE: 4, // percentage
		BASE_CRITICALDAMAGE: 150, // percentage
		VITALITY_IN_HEALTH: 0.1 // For 1 HP
	},
	/*
	 * Standardize the attribute names in order to parse attributes and buff
	 * descriptions from item details.
	 */
	KeyAttributes: { // Corresponds to "attributes" property
		"Power": "Power",
		"Toughness": "Toughness",
		//"": "Armor",
		"Vitality": "Vitality",
		//"": "Health",
		"Precision": "Precision",
		//"": "CriticalChance",
		"CritDamage": "Ferocity",
		//"": "CriticalDamage",
		"ConditionDamage": "ConditionDamage",
		"Healing": "HealingPower",
		"ConditionDuration": "Expertise",
		//"": "ConditionDuration",
		"BoonDuration": "Concentration",
		//"": "BoonDuration",
		//"": "AgonyResistance",
		//"": "MagicFind"
	},
	KeyType: { // 0 for numbers, 1 for percentages
		Power: 0,
		Toughness: 0,
		Armor: 0,
		Vitality: 0,
		Health: 0,
		Precision: 0,
		CriticalChance: 1,
		Ferocity: 0,
		CriticalDamage: 1,
		ConditionDamage: 0,
		HealingPower: 0,
		Expertise: 0,
		ConditionDuration: 1,
		Concentration: 0,
		BoonDuration: 1,
		AgonyResistance: 0,
		MagicFind: 1
	},
	KeyDescription_en: { // Corresponds to keywords in buff "description" property (after being stripped to letters and lowercased)
		"power": "Power",
		"toughness": "Toughness",
		//"": "Armor",
		"vitality": "Vitality",
		//"": "Health",
		"precision": "Precision",
		"criticalchance": "CriticalChance",
		"ferocity": "Ferocity",
		//"": "CriticalDamage",
		"conditiondamage": "ConditionDamage",
		"healing": "HealingPower",
		"expertise": "Expertise",
		"conditionduration": "ConditionDuration",
		"concentration": "Concentration",
		"boonduration": "BoonDuration",
		"agonyresistance": "AgonyResistance",
		//"": "MagicFind"
	},
	KeyDescription_de: {
		"kraft": "Power",
		"zähigkeit": "Toughness",
		//"": "Armor",
		"vitalität": "Vitality",
		//"": "Health",
		"präzision": "Precision",
		"kritischetrefferchance": "CriticalChance",
		"wildheit": "Ferocity",
		//"": "CriticalDamage",
		"zustandsschaden": "ConditionDamage",
		"heilkraft": "HealingPower",
		"fachkenntnis": "Expertise",
		"zustandsdauer": "ConditionDuration",
		"konzentration": "Concentration",
		"segensdauer": "BoonDuration",
		"qualwiderstand": "AgonyResistance",
		//"": "MagicFind"
	},
	KeyDescription_es: {
		"potencia": "Power",
		"dureza": "Toughness",
		//"": "Armor",
		"vitalidad": "Vitality",
		//"": "Health",
		"precisión": "Precision",
		"probabilidaddedañocrítico": "CriticalChance",
		"ferocidad": "Ferocity",
		//"": "CriticalDamage",
		"dañodecondición": "ConditionDamage",
		"poderdecuración": "HealingPower",
		"pericia": "Expertise",
		"duracióndecondición": "ConditionDuration",
		"concentración": "Concentration",
		"duracióndebendición": "BoonDuration",
		"resistenciaalaagonía": "AgonyResistance",
		//"": "MagicFind"
	},
	KeyDescription_fr: {
		"Puissance": "Power",
		"robustesse": "Toughness",
		//"": "Armor",
		"vitalité": "Vitality",
		//"": "Health",
		"précision": "Precision",
		"chancedecoupcritique": "CriticalChance",
		"férocité": "Ferocity",
		//"": "CriticalDamage",
		"dégâtsparaltération": "ConditionDamage",
		"guérison": "HealingPower",
		"expertise": "Expertise",
		"duréedaltération": "ConditionDuration",
		"concentration": "Concentration",
		"duréedavantage": "BoonDuration",
		"résistanceàlagonie": "AgonyResistance",
		//"": "MagicFind"
	}
};