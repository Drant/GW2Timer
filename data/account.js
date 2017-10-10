/*
 * This file is used by http://gw2timer.com/account
 * Contains collated API data and supplemental metadata.
 */

/*
 * These words must be unique from the ones in the standard Dictionary object
 * because they will be added to it.
 */
var GW2T_ACCOUNT_DICTIONARY = {
	s_TEMPLATE: {de: "", es: "", fr: "",
		cs: "", it: "", pl: "", pt: "", ru: "", zh: ""},
	
	// Nouns
	s_profession: {de: "klasse", es: "profesión", fr: "profession",
		cs: "profese", it: "professione", pl: "zawód", pt: "profissão", ru: "профе́ссия", zh: "职业"},
	s_age: {de: "alter", es: "edad", fr: "âge",
		cs: "věk", it: "età", pl: "wiek", pt: "idade", ru: "возраст", zh: "年龄"},
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
	s_wallet: {de: "geldbörse", es: "cartera", fr: "portefeuille",
		cs: "peněženka", it: "portafoglio", pl: "portfel", pt: "carteira", ru: "бума́жник", zh: "钱包"},
	s_titles: {de: "titeln", es: "títulos", fr: "titres",
		cs: "tituly", it: "titoli", pl: "tytuły", pt: "títulos", ru: "названия", zh: "称号"},
	s_currencies: {de: "währung", es: "monedas", fr: "monnaies",
		cs: "měny", it: "valute", pl: "waluty", pt: "moedas", ru: "валюта", zh: "货币"},
	s_tokens: {de: "wertmarke", es: "fichas", fr: "jetons",
		cs: "žetony", it: "gettoni", pl: "żeton", pt: "fichas", ru: "жетоны", zh: "徽记"},
	s_attributes: {de: "attribute", es: "atributos", fr: "caractéristiques",
		cs: "atributy", it: "attributi", pl: "atrybuty", pt: "atributos", ru: "атрибуты", zh: "属性"},
	s_wiki: {de: "wiki", es: "wiki", fr: "wiki",
		cs: "wiki", it: "wiki", pl: "wiki", pt: "wiki", ru: "ви́ки", zh: "维基"},
	s_gallery: {de: "Katalog", es: "Galería", fr: "Galerie",
		cs: "Galerie", it: "Raccolta", pl: "Galeria", pt: "Galeria", ru: "Коллекция", zh: "图库"},
	s_tab: {de: "registerkarte", es: "pestaña", fr: "onglet",
		cs: "karta", it: "scheda", pl: "karta", pt: "guia", ru: "вкладка", zh: "选项卡"},
	s_delivery: {de: "warenlager", es: "entregas", fr: "consigne",
		cs: "dodávka", it: "consegna", pl: "dostawa", pt: "entrega", ru: "доставка", zh: "交货"},
	s_transactions: {de: "transaktionen", es: "transacciones", fr: "transactions",
		cs: "transakce", it: "transazioni", pl: "transakcje", pt: "transações", ru: "транзакций", zh: "交易"},
	s_categories: {de: "kategorien", es: "categorías", fr: "catégories",
		cs: "kategorie", it: "categorie", pl: "kategorie", pt: "categorias", ru: "категории", zh: "类别"},
	s_sum: {de: "summe", es: "suma", fr: "somme",
		cs: "součet", it: "somma", pl: "suma", pt: "soma", ru: "сумма", zh: "总和"},
	s_conversion: {de: "umrechnung", es: "conversión", fr: "conversion",
		cs: "konverze", it: "conversione", pl: "konwersja", pt: "conversão", ru: "конвертация", zh: "转换"},
	s_summary: {de: "zusammenfassung", es: "resumen", fr: "résumé",
		cs: "shrnutí", it: "sommario", pl: "streszczenie", pt: "sumário", ru: "резюме", zh: "摘要"},
	s_upgrades: {de: "aufwertungen", es: "mejoras", fr: "améliorations",
		cs: "vylepšení", it: "miglioramenti", pl: "ulepszenia", pt: "melhorias", ru: "улучшения", zh: "改进"},
	s_armor: {de: "rüstung", es: "armadura", fr: "armure",
		cs: "brnění", it: "armatura", pl: "zbroja", pt: "armadura", ru: "броня", zh: "盔甲"},
	s_weapons: {de: "waffen", es: "armas", fr: "armes",
		cs: "zbraně", it: "armi", pl: "bronie", pt: "armas", ru: "оружие", zh: "武器"},
	s_storage: {de: "speicher", es: "almacenamiento", fr: "stockage",
		cs: "úložiště", it: "memoria", pl: "pamięć", pt: "armazenamento", ru: "хранилище", zh: "存储柜"},
	
	// Verbs
	s_include: {de: "einschließen", es: "incluir", fr: "inclure",
		cs: "zahrnout", it: "includere", pl: "dołączyć", pt: "incluir", ru: "включить", zh: "包括"},
	s_exclude: {de: "ausschließen", es: "excluir", fr: "exclure",
		cs: "vyloučit", it: "escludere", pl: "wykluczyć", pt: "excluir", ru: "исключить", zh: "排除"},
	s_rename: {de: "umbenennen", es: "renombrar", fr: "renommer",
		cs: "přejmenovat", it: "rinominare", pl: "przemianować", pt: "renomear", ru: "переимено́вывать", zh: "重命名"},
	
	// Adjectives, Adverbs, Participles
	s_new: {de: "neu", es: "nuevo", fr: "nouveau",
		cs: "nový", it: "nuovo", pl: "nowy", pt: "novo", ru: "новый", zh: "新"},
	s_crafted: {de: "hergestellten", es: "fabricado", fr: "fabriqué",
		cs: "řemeslně", it: "fabbricato", pl: "sfabrykowany", pt: "fabricado", ru: "сфабрикованы", zh: "制作"},
	s_legendary: {de: "legendär", es: "legendario", fr: "légendaire",
		cs: "legendární", it: "leggendario", pl: "legendarny", pt: "lendário", ru: "легендарный", zh: "传奇"},
	s_shared: {de: "gemeinsamer", es: "compartida", fr: "partagé",
		cs: "sdílený", it: "condiviso", pl: "udostępniona", pt: "compartilhado", ru: "общий", zh: "共享"},
	s_acquired: {de: "erworben", es: "adquirido", fr: "acquis",
		cs: "nabytý", it: "acquisita", pl: "nabyty", pt: "adquirido", ru: "приобретенный", zh: "获得了"},
	s_locked: {de: "gesperrt", es: "bloqueado", fr: "verrouillé",
		cs: "uzamčený", it: "bloccato", pl: "zablokowany", pt: "bloqueado", ru: "заблокированный", zh: "锁定"},
	s_unlocked: {de: "nicht gesperrt", es: "desbloqueado", fr: "déverrouillé",
		cs: "odemčeno", it: "sbloccata", pl: "odblokowane", pt: "desbloqueado", ru: "разблокированная", zh: "解除锁定"},
	s_liquid: {de: "flüssige", es: "líquido", fr: "liquide",
		cs: "likvidní", it: "liquido", pl: "płynny", pt: "líquido", ru: "ликви́дный", zh: "流动"},
	s_appraised: {de: "schätzen", es: "apreciación", fr: "estimative",
		cs: "odhadní", it: "apprezzato", pl: "wycenionej", pt: "apreciado", ru: "оценочная", zh: "评估"}
};

/*
 * Categorized wallet currencies for generating separate lists.
 * For general currencies, coefficient property normalizes by approximating each
 * currency to 1 silver. For other currencies, it normalizes relative to the plurality.
 */
var GW2T_CURRENCY_DATA = {
	Wallet: {
		Dungeon: [
			{ id: 5, payment: "dungeon_ac", name_en: "Ascalonian Tear", name_de: "Ascalonische Träne", name_es: "Lágrima ascaloniana", name_fr: "Larme ascalonienne", name_zh: "阿斯卡隆之泪" },
			{ id: 9, payment: "dungeon_cm", name_en: "Seal of Beetletun", name_de: "Beetletuns Siegel", name_es: "Sello de Beetletun", name_fr: "Sceau de Beetletun", name_zh: "甲虫郡封印" },
			{ id: 11, payment: "dungeon_ta", name_en: "Deadly Bloom", name_de: "Tödliche Blüte", name_es: "Flor mortal", name_fr: "Pousse mortelle", name_zh: "死亡之花" },
			{ id: 10, payment: "dungeon_se", name_en: "Manifesto of the Moletariate", name_de: "Manifest des Maulwetariats", name_es: "Manifiesto del topotariado", name_fr: "Manifeste du taupinariat", name_zh: "掘洞宣言" },
			{ id: 13, payment: "dungeon_cof", name_en: "Flame Legion Charr Carving", name_de: "Flammen-Legion-Charr-Schnitzerei", name_es: "Talla de Legión Llama", name_fr: "Gravure de Légion Flamme", name_zh: "烈焰军团夏尔雕像" },
			{ id: 12, payment: "dungeon_hotw", name_en: "Symbol of Koda", name_de: "Symbol Kodas", name_es: "Símbolo de Koda", name_fr: "Symbole de Koda", name_zh: "克达之符" },
			{ id: 14, payment: "dungeon_coe", name_en: "Knowledge Crystal", name_de: "Wissenskristall", name_es: "Cristal del conocimiento", name_fr: "Cristal de connaissance", name_zh: "知识水晶" },
			{ id: 6, payment: "dungeon_arah", name_en: "Shard of Zhaitan", name_de: "Scherbe des Zhaitan", name_es: "Esquirla de Zhaitan", name_fr: "Eclat de Zhaïtan", name_zh: "泽坦碎片" },
			{ id: 7, payment: "fotm_relic", name_en: "Fractal Relic", name_de: "Fraktal-Relikt", name_es: "Reliquia fractal", name_fr: "Relique fractale", name_zh: "碎层古物" },
			{ id: 24, coefficient: 15, payment: "fotm_pristine", name_en: "Pristine Fractal Relic", name_de: "Makelloses Fraktal-Relikt", name_es: "Reliquia fractal prístina", name_fr: "Relique fractale immaculée", name_zh: "原始碎层古物" },
			{ id: 28, coefficient: 10, payment: "magnetite", name_en: "Magnetite Shard", name_de: "Magnetit-Scherbe", name_es: "Esquirla de magnetita", name_fr: "Éclat de magnétite", name_zh: "磁铁碎块" }
		],
		General: [
			{ id: 1, coefficient: 1, name_en: "Coin", name_de: "Münze", name_es: "Moneda", name_fr: "Pièce", name_zh: "钱币" },
			{ id: 4, coefficient: "gem", payment: "gem", name_en: "Gem", name_de: "Edelstein", name_es: "Gema", name_fr: "Gemme", name_zh: "宝石" },
			{ id: 2, coefficient: 1, payment: "karma", name_en: "Karma", name_de: "Karma", name_es: "Karma", name_fr: "Karma", name_zh: "业力" },
			{ id: 3, coefficient: 10000, payment: "laurel", name_en: "Laurel", name_de: "Lorbeer", name_es: "Laurel", name_fr: "Laurier", name_zh: "桂冠" },
			{ id: 16, coefficient: 10000, payment: "commendation", name_en: "Guild Commendation", name_de: "Gilden-Belobigung", name_es: "Mención de clan", name_fr: "Recommandation de guilde", name_zh: "公会奖状" },
			{ id: 29, coefficient: 5000, payment: "provisioner", name_en: "Provisioner Token", name_de: "Versorger-Marke", name_es: "Vale de suministrador", name_fr: "Coupon de fournisseur", name_zh: "供给官徽记" },
			{ id: 34, payment: "contract", name_en: "Trade Contract", name_de: "Handelsvertrag", name_es: "Contrato comercial", name_fr: "Contrat commercial", name_zh: "交易合同" },
			{ id: 35, payment: "mosaic", name_en: "Elegy Mosaic", name_de: "Elegie-Mosaik", name_es: "Mosaico de elegía", name_fr: "Mosaïque d'élégie", name_zh: "挽歌马赛克" },
			{ id: 23, coefficient: 1000, name_en: "Spirit Shard", name_de: "Geister-Scherbe", name_es: "Esquirla espiritual", name_fr: "Éclat d'esprit", name_zh: "灵魂碎片" },
			{ id: 18, coefficient: 10000, name_en: "Transmutation Charge", name_de: "Transmutations-Ladung", name_es: "Carga de transmutación", name_fr: "Charge de transmutation", name_zh: "幻化力" }
		],
		Map: [
			{ id: 25, payment: "map_dt", name_en: "Geode", name_de: "Geode", name_es: "Geoda", name_fr: "Géode", name_zh: "晶块" },
			{ id: 27, payment: "map_sw", name_en: "Bandit Crest", name_de: "Banditen-Wappen", name_es: "Enseña de bandido", name_fr: "Écu de bandit", name_zh: "强盗徽饰" },
			{ id: 19, payment: "map_vb", name_en: "Airship Part", name_de: "Luftschiff-Teil", name_es: "Pieza de aeronave", name_fr: "Pièce d'aéronef", name_zh: "飞船部件" },
			{ id: 22, payment: "map_ab", name_en: "Lump of Aurillium", name_de: "Aurilliumklumpen", name_es: "Trozo de aurilio", name_fr: "Bloc d'aurillium", name_zh: "块状赤金元素" },
			{ id: 20, payment: "map_td", name_en: "Ley Line Crystal", name_de: "Ley-Linien-Kristall", name_es: "Cristal de línea ley", name_fr: "Cristal des lignes de force", name_zh: "魔径水晶" },
			{ id: 32, coefficient: 0.1, payment: "magic", name_en: "Unbound Magic", name_de: "Entfesselte Magie", name_es: "Magia liberada", name_fr: "Magie déliée", name_zh: "未受约束的魔法" },
			{ id: 15, payment: "badge", name_en: "Badge of Honor", name_de: "Ehrenabzeichen", name_es: "Insignia de honor", name_fr: "Insigne d'honneur", name_zh: "荣誉徽章" },
			{ id: 31, payment: "proof", name_en: "Proof of Heroics", name_de: "Beweis der Heldentaten", name_es: "Prueba de hazañas", name_fr: "Preuve d'héroïsme", name_zh: "英雄证明" },
			{ id: 36, payment: "testimony", name_en: "Testimony of Heroics", name_de: "Zeugnis von Heldentaten", name_es: "Testimonio de hazañas", name_fr: "Témoignage des actes héroïques", name_zh: "英雄证明" },
			{ id: 26, coefficient: 10, name_en: "WvW Skirmish Claim Ticket", name_de: "WvW-Gefecht-Ticket", name_es: "Tique de recogida de escaramuzas WvW", name_fr: "Billet de retrait d'escarmouche McM", name_zh: "世界之战突袭兑换劵" },
			{ id: 30, coefficient: 10, name_en: "PvP League Ticket", name_de: "PvP-Liga-Ticket", name_es: "Tique de liga PvP", name_fr: "Ticket de ligue JcJ", name_zh: "PvP联赛兑换券" },
			{ id: 33, coefficient: 10, payment: "glory", name_en: "Ascended Shards of Glory", name_de: "Aufgestiegene Scherben des Ruhms", name_es: "Esquirlas de gloria ascendidas", name_fr: "Éclats de gloire élevés", name_zh: "升华荣誉碎片" }
		]
	},
	AuditWallet: {}, // Will contain a flattened version of the wallet object
	AuditCategories: { // Each entry will hold a payments object, displayed as a column in the audit table
		Wallet: null,
		Characters: null,
		Shared: null,
		Bank: null,
		Materials: null,
		Vault: null,
		Skins: null,
		Outfits: null,
		Gliders: null,
		Dyes: null,
		Minis: null,
		Carriers: null,
		Champions: null,
		Finishers: null,
		Nodes: null,
		Recipes: null,
		Buying: null,
		Selling: null
	},
	AuditCategoriesCharacters: {}, // Same format as audit categories but is a breakdown of individual characters
	AuditHistory: // Data to store for historical audit graphs, uses appraised sell price only, will include all entries from AuditCategories
	{
		Timestamps: null, // Array of ISO timestamp strings
		WalletCoin: null, // All other entries are integer arrays
		WalletKarma: null,
		WalletGem: null,
		TotalGems: null,
		TotalAppraisedSellNoGems: null,
		TotalLiquidSellNoGems: null
	},
	AuditColor: {
		WalletCoin: {color: "#fdc84e"},
		WalletKarma: {color: "#ee55cc", currency: "karma"},
		WalletGem: {color: "#66aaff", currency: "gem"},
		TotalGems: {color: "#71a3d8", currency: "gem"},
		TotalAppraisedSellNoGems: {color: "gold"},
		TotalLiquidSellNoGems: {color: "yellow"},
		Wallet: {color: "seagreen"},
		Characters: {color: "crimson"},
		Shared: {color: "firebrick"},
		Bank: {color: "orange"},
		Materials: {color: "peru"},
		Vault: {color: "saddlebrown"},
		Skins: {color: "papayawhip"},
		Outfits: {color: "peachpuff"},
		Gliders: {color: "moccasin"},
		Dyes: {color: "deepskyblue"},
		Minis: {color: "aquamarine"},
		Carriers: {color: "dodgerblue"},
		Champions: {color: "steelblue"},
		Finishers: {color: "slateblue"},
		Nodes: {color: "darkcyan"},
		Recipes: {color: "purple"},
		Buying: {color: "silver"},
		Selling: {color: "gray"}
	},
	/*
	 * Payments to show on the account audit table in this order.
	 * The ishidden property will hide that currency from presentation for some tables.
	 * ID is associated with wallet, conversion is how many copper for 1 of that currency.
	 * Color is for the progress bar under the currency amount.
	 * Conversions in array format: [paymentAmount, equivalentItemID, additionalCoinCost]
	 * Will use the TP price of the item and divide it with the currency to get a ratio.
	 */
	AuditPayments: {
		coin_liquidbuy: {id: 1, color: "#fdc84e", conversion: 1, header: "Liquid Buy"},
		coin_liquidsell: {id: 1, color: "#fdc84e", conversion: 1, header: "Liquid Sell"},
		coin_appraisedbuy: {id: 1, color: "#fdc84e", conversion: 1, header: "Appraised Buy"},
		coin_appraisedsell: {id: 1, color: "#fdc84e", conversion: 1, header: "Appraised Sell"},
		gem: {id: 4, color: "#66aaff", conversion: null}, // To be assigned by gem exchange
		karma: {id: 2, color: "#ee55cc", conversion: [5250, 24295], isliquid: true}, // Vial of Powerful Blood
		laurel: {id: 3, color: "#44dd44", conversion: [0.33, 24351], isliquid: true}, // Vicious Claw
		//cob: {color: "#e99213", conversion: [1, 47909], isappraised: true}, // Candy Corn Cob
		badge: {id: 15, color: "#8c7047", conversion: [30, 71473], isliquid: true}, // Badge of Tribute
		proof: {id: 31, color: "#ffff53", conversion: [6, 21262], isliquid: true, ishidden: true}, // Superior Catapult Blueprints
		glory: {id: 33, color: "#d675ef", conversion: 0},
		commendation: {id: 16, color: "#e9d580", conversion: [10, 41560], isliquid: true}, // Sentinel's Orichalcum Imbued Inscription
		provisioner: {id: 29, color: "#2c9c4b", conversion: [1, 15350], isappraised: true, ishidden: true}, // Rampager's Krait Morning Star
		dungeon_ac: {id: 5, color: "#73c7ee", conversion: [180, 19721], isliquid: true}, // Glob of Ectoplasm
		dungeon_cm: {id: 9, color: "#80aaa2", conversion: [180, 19721], isliquid: true}, // Glob of Ectoplasm
		dungeon_ta: {id: 11, color: "#5a5282", conversion: [180, 19721], isliquid: true}, // Glob of Ectoplasm
		dungeon_se: {id: 10, color: "#c1a390", conversion: [180, 19721], isliquid: true}, // Glob of Ectoplasm
		dungeon_cof: {id: 13, color: "#fd994c", conversion: [30, 19721], isliquid: true}, // Glob of Ectoplasm
		dungeon_hotw: {id: 12, color: "#bddbef", conversion: [30, 19721], isliquid: true}, // Glob of Ectoplasm
		dungeon_coe: {id: 14, color: "#993889", conversion: [30, 19721], isliquid: true}, // Glob of Ectoplasm
		dungeon_arah: {id: 6, color: "#aab084", conversion: [30, 19721], isliquid: true}, // Glob of Ectoplasm
		fotm_relic: {id: 7, color: "#9bffff", conversion: [1350, 37000], isappraised: true, isbound: true}, // Quiver of a Thousand Arrows
		fotm_pristine: {id: 24, color: "#6bbb44", conversion: [135, 37000], isappraised: true, isbound: true}, // Quiver of a Thousand Arrows
		//matrix: {color: "#8ce7ff", conversion: [1, 73248], isappraised: true}, // Stabilizing Matrix
		magnetite: {id: 28, color: "#27454a", conversion: [1000, 77310, 200000], isliquid: true}, // Ghostly Infusion
		map_dt: {id: 25, color: "#eeebba", conversion: 0},
		map_sw: {id: 27, color: "#ebd1a1", conversion: 0},
		map_vb: {id: 19, color: "#cecea0", conversion: 0},
		map_ab: {id: 22, color: "#d7c762", conversion: 0},
		map_td: {id: 20, color: "#42c8dd", conversion: 0},
		magic: {id: 32, color: "#ffff32", conversion: [12400, 37000], isappraised: true, isbound: true} // Quiver of a Thousand Arrows
	},
	AuditUpgrades: { // Account upgrades from the gem store
		CharacterSlot: {starting: 5, purchased: 0, gem: 800, id: "character_slot_expansion"},
		CraftingLicense: {starting: 2, purchased: 0, gem: 800, id: 42970},
		BankTab: {starting: 1, purchased: 0, gem: 600, id: 19995},
		StorageExpander: {starting: 1, purchased: 0, gem: 800, id: 42932},
		BagSlot: {starting: 5, purchased: 0, gem: 400, id: 19993},
		SharedSlot: {starting: 1, purchased: 0, gem: 560, id: 67071}
	}
};

/*
 * Quick reference API related data.
 */
var GW2T_ACCOUNT_METADATA = {
	Exchange: {
		GoldSamples: [1, 10, 100, 200, 500, 1000, 4000, 5000],
		GemSamples: [100, 125, 200, 250, 300, 350, 400, 500, 600, 700, 800, 1000, 1800, 2000]
	},
	Bank: {
		NumSlotsHorizontal: 10,
		NumSlotsVertical: 3,
		NumSlotsPerTab: 30,
		CustomTabsLimit: 20,
		SlotWidth: 72,
		SlotWidthCondensed: 52
	},
	Skins: {
		Back: [],
		Armor_Light_Helm: [], Armor_Light_Shoulders: [], Armor_Light_Coat: [], Armor_Light_Gloves: [], Armor_Light_Leggings: [], Armor_Light_Boots: [],
		Armor_Medium_Helm: [], Armor_Medium_Shoulders: [], Armor_Medium_Coat: [], Armor_Medium_Gloves: [], Armor_Medium_Leggings: [], Armor_Medium_Boots: [],
		Armor_Heavy_Helm: [], Armor_Heavy_Shoulders: [], Armor_Heavy_Coat: [], Armor_Heavy_Gloves: [], Armor_Heavy_Leggings: [], Armor_Heavy_Boots: [],
		Armor_Light_HelmAquatic: [], Armor_Medium_HelmAquatic: [], Armor_Heavy_HelmAquatic: [],
		Weapon_Axe: [],
		Weapon_Mace: [],
		Weapon_Sword: [],
		Weapon_Dagger: [],
		Weapon_Pistol: [],
		Weapon_Scepter: [],
		Weapon_Focus: [],
		Weapon_Shield: [],
		Weapon_Torch: [],
		Weapon_Warhorn: [],
		Weapon_Greatsword: [],
		Weapon_Hammer: [],
		Weapon_LongBow: [],
		Weapon_ShortBow: [],
		Weapon_Rifle: [],
		Weapon_Staff: [],
		Weapon_Harpoon: [],
		Weapon_Speargun: [],
		Weapon_Trident: []
	},
	CraftingDiscipline: {
		Tailor: 0,
		Leatherworker: 1,
		Armorsmith: 2,
		Artificer: 3,
		Huntsman: 4,
		Weaponsmith: 5,
		Scribe: 7,
		Chef: 6,
		Jeweler: 8
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
			color: "#5599ff",
			isswappable: true,
			health: "low"
		},
		warrior: {
			id: 2,
			weight: 3,
			color: "#ffaa00",
			isswappable: true,
			health: "high"
		},
		engineer: {
			id: 3,
			weight: 4,
			color: "#ffcc77",
			isswappable: false,
			health: "mid"
		},
		ranger: {
			id: 4,
			weight: 5,
			color: "#ffdd22",
			isswappable: true,
			health: "mid"
		},
		thief: {
			id: 5,
			weight: 6,
			color: "#555555",
			isswappable: true,
			health: "low"
		},
		elementalist: {
			id: 6,
			weight: 9,
			color: "#ff2200",
			isswappable: false,
			health: "low"
		},
		mesmer: {
			id: 7,
			weight: 8,
			color: "#ff4488",
			isswappable: true,
			health: "mid"
		},
		necromancer: {
			id: 8,
			weight: 7,
			color: "#33cc11",
			isswappable: true,
			health: "high"
		},
		revenant: {
			id: 9,
			weight: 1,
			color: "#ffffff",
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
	AchievementCategories: [ // Same order as in game, which is different from API
		{en: "Daily", de: "Täglich", es: "Logros diarios", fr: "Quotidien", zh: "日常"},
		97, // Daily
		88, // Daily Fractals
		142, // Daily Bloodstone Fen
		145, // Daily Ember Bay
		149, // Daily Bitterfrost Frontier
		159, // Daily Lake Doric
		163, // Daily Draconis Mons
		172, // Daily Siren's Landing
		101, // Seasonal Activities
		102, // Lunar New Year Dailies
		162, // Daily Super Adventure Festival
		{en: "Story Journal", de: "Chronik", es: "Logros de historia", fr: "Chroniques", zh: "史诗纪实"},
		68, // Gates of Maguuma
		70, // Entanglement
		71, // The Dragon's Reach, Part 1
		72, // The Dragon's Reach, Part 2
		81, // Echoes of the Past
		82, // Tangled Paths
		83, // Seeds of Truth
		100, // Point of No Return
		104, // Heart of Thorns: Act 1
		123, // Heart of Thorns: Act 2
		122, // Heart of Thorns: Act 3
		121, // Heart of Thorns: Act 4
		139, // Out of the Shadows
		144, // Rising Flames
		147, // A Crack in the Ice
		154, // The Head of the Snake
		164, // Flashpoint
		171, // One Path Ends
		188, // Path of Fire: Act 1
		183, // Path of Fire: Act 2
		187, // Path of Fire: Act 3
		{en: "General", de: "Allgemein", es: "Logros generales", fr: "Général", zh: "常规"},
		137, // Current Events
		27, // Dungeons
		51, // Twilight Arbor Aetherpath
		80, // The Silverwastes
		69, // Dry Top
		1, // Slayer
		2, // Hero
		4, // Tradesman
		5, // Explorer
		6, // Fashion
		7, // Weapon Master
		10, // Community
		11, // Hall of Monuments
		14, // Jumping Puzzles
		169, // Mastery Insights
		133, // The Shatterer
		58, // Triple Trouble
		47, // Tequatl
		16, // Bosses
		{en: "Heart of Thorns", de: "Heart of Thorns", es: "Heart of Thorns", fr: "Heart of Thorns", zh: "决战迈古玛"},
		116, // Verdant Brink
		111, // Auric Basin
		112, // Tangled Depths
		109, // Dragon's Stand
		108, // Mastery Insights
		110, // Specializations
		{en: "Path of Fire", de: "Path of Fire", es: "Path of Fire", fr: "Path of Fire", zh: "火焰之路"},
		179, // Crystal Oasis
		190, // Desert Highlands
		182, // Elon Riverlands
		176, // The Desolation
		174, // Domain of Vabbi
		181, // Crystal Desert
		189, // Mastery Insights
		178, // Specializations
		{en: "Side Stories", de: "Side Stories", es: "Side Stories", fr: "Side Stories", zh: "Side Stories"},
		175, // Knight of the Thorn
		180, // Conservation of Magic
		186, // Justice of the Blade
		177, // Anomalous Occurrences
		184, // Transfer Chaser
		{en: "Competitive", de: "Wettkampf", es: "Logros competitivos", fr: "Compétition", zh: "竞技"},
		143, // Eternal Coliseum
		152, // Forest of Niflhel
		153, // Legacy of Foefire
		141, // Revenge of the Capricorn
		156, // Battle of Kyhlo
		157, // Temple of the Silent Storm
		158, // Battle of Champion's Dusk
		160, // Spirit Watch
		161, // Skyhammer
		126, // Year of the Ascension Part I
		127, // Year of the Ascension Part IV
		129, // Year of the Ascension Part II
		130, // Year of the Ascension Part III
		3, // PvP Conqueror
		13, // World vs World
		60, // Edge of the Mists
		38, // Sanctum Sprint
		40, // Crab Toss
		39, // Southsun Survival
		35, // Belcher's Bluff
		{en: "Raids", de: "Schlachtzüge", es: "Incursiones", fr: "Raids", zh: "大型地下城"},
		124, // Spirit Vale
		134, // Salvation Pass
		138, // Stronghold of the Faithful
		155, // Bastion of the Penitent
		{en: "Fractals of the Mists", de: "Fraktale der Nebel", es: "Fractales de la Niebla", fr: "Fractales des Brumes", zh: "迷雾碎层"},
		148, // Nightmare Fractal
		170, // Shattered Observatory Fractal
		136, // Fractals of the Mists
		30, // Fractals of the Mists
		{en: "World versus World", de: "Welt gegen Welt", es: "Mundo contra Mundo", fr: "Monde contre Monde", zh: "世界之战"},
		61, // Edge of the Mists
		74, // WvW Fall Tournament 2014
		66, // WvW Spring Tournament 2014
		49, // World vs. World Season 1
		{en: "Collections", de: "Sammlungen", es: "Logros de colecciones", fr: "Collections", zh: "收藏"},
		77, // Basic Collections
		75, // Rare Collections
		117, // Specialization Collections
		114, // Legendary Weapons
		118, // Legendary Backpacks
		125, // Legendary Armor
		173, // Legendary Trinkets
		76, // Black Lion Collections
		{en: "Festival", de: "Festlicher", es: "Festivo", fr: "Festival", zh: "传统"},
		132, // Lunar New Year
		151, // Lunar New Year
		22, // Super Adventure Box: World 1
		45, // Super Adventure Box: World 2
		46, // Super Adventure Box: Tribulation Mode
		29, // Shadow of the Mad King
		119, // Shadow of the Mad King
		146, // Shadow of the Mad King
		52, // Blood and Madness
		78, // Blood and Madness
		57, // A Very Merry Wintersday
		99, // A Very Merry Wintersday
		131, // A Very Merry Wintersday
		150, // A Very Merry Wintersday
		{en: "Living Story", de: "Lebendigen Geschichte", es: "Historia viviente", fr: "Histoire vivante", zh: "世界动"},
		23, // Secret of Southsun
		25, // Dragon Bash
		26, // Sky Pirates
		28, // The Wondrous Workshop of Toymaker Tixx
		31, // Keg Brawl
		33, // Flame and Frost
		34, // Bazaar of the Four Winds
		36, // Support Ellen Kiel
		37, // Support Evon Gnashblade
		41, // Queen Jennah's Jubilee
		42, // The Queen's Gauntlet
		43, // Clockwork Chaos
		44, // Emissary Vorpp's Field Assistant
		48, // Boss Week
		50, // Twilight Assault
		53, // Tower of Nightmares
		54, // The Nightmares Within
		55, // Fractured!
		56, // The Nightmare Is Over
		59, // The Origins of Madness
		62, // Escape from Lion's Arch
		65, // The Battle for Lion's Arch
		67, // Festival of the Four Winds
		73, // Retired Achievement
		{en: "Temporary", de: "Vorübergehend", es: "Temporal", fr: "Temporaire", zh: "临时"},
		-1
	],
	WvWRank: {
		Ranks: [
			1, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120,
			150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450, 480, 510, 540, 570,
			620, 670, 720, 770, 820, 870, 920, 970, 1020, 1070, 1120, 1170, 1220, 1270, 1320,
			1395, 1470, 1545, 1620, 1695, 1770, 1845, 1920, 1995, 2070, 2145, 2220, 2295, 2370, 2445,
			2545, 2645, 2745, 2845, 2945, 3045, 3145, 3245, 3345, 3445, 3545, 3645, 3745, 3845, 3945,
			4095, 4245, 4395, 4545, 4695, 4845, 4995, 5145, 5295, 5445, 5595, 5745, 5895, 6045, 6195,
			6445, 6695, 6945, 7195, 7445, 7695, 7945, 8195, 8445, 8695, 8945, 9195, 9445, 9695, 9945
		],
		RanksPerModifier: 15,
		Modifiers: [
			{en: "", de: "", es: "", fr: "", zh: ""},
			{en: "Bronze", de: "Bronze", es: "Bronce", fr: "Bronze", zh: "青铜"},
			{en: "Silver", de: "Silber", es: "Plata", fr: "Argent", zh: "白银"},
			{en: "Gold", de: "Gold", es: "Oro", fr: "Or", zh: "黄金"},
			{en: "Platinum", de: "Platin", es: "Platino", fr: "Platine", zh: "白金"},
			{en: "Mithril", de: "Mithril", es: "Mithril", fr: "Mithril", zh: "秘银"},
			{en: "Diamond", de: "Diamant", es: "Diamante", fr: "Diamant", zh: "钻石"}
		],
		Titles: [
			{en: "Invader", de: "Eindringling", es: "Invasor", fr: "Envahisseur", zh: "入侵者"},
			{en: "Assaulter", de: "Angreifer", es: "Asaltante", fr: "Assaillant", zh: "突击兵"},
			{en: "Raider", de: "Plünderer", es: "Atracador", fr: "Pillard", zh: "掠夺者"},
			{en: "Recruit", de: "Rekrut", es: "Recluta", fr: "Recrue", zh: "新兵"},
			{en: "Scout", de: "Späher", es: "Explorador", fr: "Eclaireur", zh: "斥候"},
			{en: "Soldier", de: "Soldat", es: "Soldado", fr: "Soldat", zh: "士兵"},
			{en: "Squire", de: "Knappe", es: "Escudero", fr: "Ecuyer", zh: "侍卫"},
			{en: "Footman", de: "Infanterist", es: "Lacayo", fr: "Valet", zh: "步兵"},
			{en: "Knight", de: "Ritter", es: "Caballero", fr: "Chevalier", zh: "骑士"},
			{en: "Major", de: "Major", es: "Comandante", fr: "Major", zh: "少校"},
			{en: "Colonel", de: "Oberst", es: "Coronel", fr: "Colonel", zh: "上校"},
			{en: "General", de: "General", es: "General", fr: "Général", zh: "将军"},
			{en: "Veteran", de: "Veteran", es: "Veterano", fr: "Vétéran", zh: "老兵"},
			{en: "Champion", de: "Champion", es: "Campeón", fr: "Champion", zh: "勇士"},
			{en: "Legend", de: "Legende", es: "Leyenda", fr: "Légende", zh: "传奇"}
		]
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
	NumArmorSlots: 6
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
		"AgonyResistance": "AgonyResistance"
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
		"agonyresistance": "AgonyResistance"
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
		"qualwiderstand": "AgonyResistance"
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
		"resistenciaalaagonía": "AgonyResistance"
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
		"résistanceàlagonie": "AgonyResistance"
		//"": "MagicFind"
	}
};

/*
 * Substrings of guild emblem image URLs. Full string:
 * https://render.guildwars2.com/file/SUBSTRING.png"
 */
var GW2T_EMBLEM_DATA = {
	background: {
		"1": "B1417CDCD8320A390AB5781909F59C0FE805047D/59597",
		"2": "936BEB492B0D2BD77307FCB10DBEE51AFB5E6C64/59599",
		"3": "2B4D93FF49BF63FD470677D1D6FBADA93F669AE4/59601",
		"4": "A3050CA1A8036DC47B98E49FB7B9F1C9EACC9C26/59603",
		"5": "C5A9D610DB3CC809465566FA3CF908A4E86F0E35/59605",
		"6": "B0DA400BC0010742975A51C1C20E0894DB303F16/59607",
		"7": "0F97AE506437E81896D7D5D1009E5E322605EDE9/59609",
		"8": "0255C55764A35A06DF066278EF54993DEA03BB29/59611",
		"10": "CCDE0EBD00FCCBBEC500D03DA56505050352D803/59613",
		"11": "CD2FAB07E3B19FDFB6215852012DBFA0AE03FF93/59615",
		"12": "0EA202F8D6390EAF5CCF2794675D1EDF92213159/59617",
		"13": "AEE3C491CE629144EBCB0D3D974B99D3CB4454AE/59619",
		"14": "B9ADBC29AE0EFD9F0B5E373C0359BE28B0E75EFF/59621",
		"15": "36651B31C17997C94592BB3AD624E8BCEE045418/59623",
		"16": "BC0061DF01D8799652B8D1926060D21244D49241/59625",
		"17": "0CDC3C5AE9B3A5F71F6B39984D08492632D3B027/59627",
		"18": "56CF055ECB6C05B9B9C433ADE74E31EF0DDA972C/59629",
		"19": "0EC9B6ACA3AB03DA65FB90782806C8770E0B4BAF/59631",
		"20": "E7E465A5AA2E7B22083DFEAAA22B66AFF20D2EA3/59633",
		"21": "FD0B44A194459C0CD30E7B0B366C5B9E035BA8FC/59635",
		"22": "ACE76797DDFA37CB0C0A23E1EBFAD5A75A3A07C8/59637",
		"23": "1A417E3E02032C545B3217DFD0F11E2448DD21E3/59639",
		"24": "0761C9C8594621C65AD52D133DFC933F0DB94E65/454821",
		"25": "0EB5006B80A5B24635A4A32537600FA5AE6513EE/454823",
		"26": "A35AD5E3BD7C3DF700913D37590517917D073EAB/454825",
		"27": "FC593E03CFBD43B40C7175BE3D2A1A71B155E5B9/454827",
		"28": "5E363B0B0164CC983E773D0105CBD362A5800C73/454829"
	},
	foreground: {
		"1": "F90A286E11257C357965269863F636CCF8D11EDB/59641",
		"2": "F3F9C650FFA87BE906105829CB95D91BEC0A0746/59647",
		"3": "0D3925B962B318EF945CEB63F4F0E803DB77DF75/59653",
		"4": "9B0EB7A549B94C3BAC0B5918D6CD6314324234B9/59661",
		"5": "6E5C6E9CF77FF96123FD285A5E0509F0EEBBF87A/59667",
		"6": "B1FB4A15629C3F70A3512EC1804C71B8C1C92A25/59673",
		"7": "F61F0EAD0FD3FC629BA4C1D9DAA1F53E0859C74E/59679",
		"8": "382DA44E6334A774A593DB1B4E0E332F1220D1F6/59685",
		"9": "32E4F651EBEFF066F0C3CEBEBD09205BDFF2EC03/59691",
		"10": "087F2A6EACDEB315E499953B6A23DA1BA1D254AE/59697",
		"11": "5A9D0F32B1C9724EDB062F0E760D0845FDF1E60E/59703",
		"12": "C0B6932B4198330B2899DCCF08B500E003FE22B0/59709",
		"13": "02DECFDF484FCB567EB9BB42987C900DE5D09C4E/59715",
		"14": "D01CC9070CE8345640936ED154094454A5AF7E37/59721",
		"15": "D568C77D0379B506FE21BBBCA31FBAA008955825/59727",
		"16": "6B0019EFE0694820677DF508BC76FE2063201229/59733",
		"17": "0B281A777DBDB96E8055F799491DD07018C25C0D/59739",
		"18": "EC1804041836299BBB423613C920036A5EF1006C/59745",
		"19": "43EB1F5E0125D90166A3B9E2C02C0A077C967003/59751",
		"20": "C3B9A4C3C677FCFFEBDEA12803AD33CB9DDB73C9/59757",
		"21": "3C29DAD2252D624FA961C032B9902133D41D0697/59763",
		"22": "066B2E46E937C7E105760563C61A08FED74DAD46/59769",
		"23": "03D3D8D66A31B723D4B9A4A042F1CB1A03BA2359/59775",
		"24": "2F02E1756F4B1AC7E4ABEC0FC63DC33708CB330D/59781",
		"25": "A32D161FAEE6245655C405CB77F001441B950F35/59787",
		"26": "0D77B19CECDB71F01C77371DDCBEDBE9F702D2F7/59793",
		"27": "BD430940CC2E5127606DBF58D1F6ADDADF0629D7/59799",
		"28": "42EAED0F23E05E279B28C50CB33BED0EAE294896/59805",
		"29": "A30DB2375CAA01970E2D68ABA7914619960DC842/59811",
		"30": "2D76D1C07A08D4A50BAB5CA0ED53E47BD5D6776E/59817",
		"31": "170438CFE3B7366D7AEA5F2905B3076A75E3C1C3/59823",
		"32": "D4185C0E9907764150F5A70F09100B0F1635F051/59829",
		"33": "2F03085B7409F8FF0B4C00DA0C560504227D0F30/59835",
		"34": "71CCF9B8A364A9FE3097B442013FFA0FEC22DFFC/59841",
		"35": "5966353EF7C46D0A43D43235E393EFFB02BF1240/59847",
		"36": "06164F9B9204E13BDA957550E60F665790461D02/59853",
		"37": "09C3A821343ED7BB1CC94C1CE4308099EE35B76D/59859",
		"38": "326D977CAC38CB70B606550217E77A6D7F069C5E/59865",
		"39": "80AE02D1BD5991F85E3AD732C742DFD022170862/59871",
		"40": "C69AC665F4D279E0FD58AA3C9D97A109FF0711E7/59877",
		"41": "9717CFC3B708025838414B441B95A7F16FF8196D/59883",
		"42": "B6D231A4FD9569D303D94552036A5FB267033A5A/59889",
		"43": "754973B8AC35789E01065B44A5942F05D2D1E3F0/59895",
		"44": "FE74DBDB1871E41E6F260CD4A9DE69A93DBA357C/59901",
		"45": "4B9B679EBF077337EE014C7F78B0F8B94AA7D8FC/59907",
		"46": "D5764B91D55E7AC27531CD9F3FB8D925C6C5E0E6/59913",
		"47": "08D2B91AA1A3D7B661DCE24ABED5E9060395D5EE/59919",
		"48": "F54247B04E74C4E5EDEE9917CB5105A6D775B2E9/59925",
		"49": "C40856275ABBF533B84A050D2AAD99DAF767AF2A/59931",
		"50": "926055EBC7FE4B05043C01366DAE22243D74F1B1/59937",
		"51": "0FC967336C0B98399D9A1F927A6266DA1BE16608/59943",
		"52": "0119F47E4E3DAB090854B6B7A6B12369A8750A9B/59949",
		"53": "E8AB2107615E4717FE7E52CB686A0AC2AC5A4275/59955",
		"54": "BC7D296E311956F237553C9905EBADC9D2507AEB/59961",
		"55": "40A148B52863195ED2DCA5AF7CB3906717EAFBDF/59967",
		"56": "6B5D36805427CCBB23D331C2C377E1111F3F20B6/59973",
		"57": "129E2240FDCE984F1EE4AE7771E0CA020205FFB5/433229",
		"58": "424CF20E7BC86307063ADE49A64F14F3FF226C0F/433235",
		"59": "0B50AC0A7406061A06C97617090D4DE45C98FA9F/433241",
		"60": "27E5C99F099AF3CAAE2D27CF26D03FD3D00290F1/433247",
		"61": "060AA3C412970E1AB3A73C010D0A0914AB6EDA33/433253",
		"62": "0B6F9F3B0A9C920C2DBB231BF1DD626D6991C042/433259",
		"63": "324226114ED944C5F1C4FAB81C4205DF0F31539E/433265",
		"64": "71DC090AE2D21BF191CEEB3A92C5C56D344F37E8/433271",
		"65": "FAB2CDBF0A751903D8D5A277C77B0B051F1759AB/433277",
		"66": "05103DFE2E3B0605CED5DFAED9C40BFC61692C30/433283",
		"67": "2A219A07C6190FF2BD1F79B403C25F576169EDC5/433289",
		"68": "D85F20A90CFD4F0503593396322CF96600E4F45E/433295",
		"69": "DE28EC7A67C06623F6A73FE9D9D054A2A9A54FE2/433301",
		"70": "DB19470C5CE2146F3A642B610F5DC1AA67265340/433307",
		"71": "9B3E13DE673BDCA4F25E74AF2F5B44C7A238959E/433313",
		"72": "1C7B9601C74FEBC20C047E4F685B7F41687509BA/433319",
		"73": "44237BE5DB5165EC3A32E8C4AEC270A167DA94F3/433325",
		"74": "B5805D1DD8482253C677B842BC6130FF4A799767/433331",
		"75": "D261C0FA7F7B08C368CE3D38610ECC357F0BAA2E/433337",
		"76": "C6531A5390320221923DBB12F849CD5F54640951/454903",
		"77": "B7CA62052D0D26F5D7D29C157D905FAAF8B4075B/454909",
		"78": "E711923B5FCBCA15CE0548FDC95048FEB5A4B868/454915",
		"79": "B5A6DAE912D63CA919C6FD1734E5A702551CC82D/454921",
		"80": "9C793A53CCBEF34CDC5A61644BFB2C41D5115C41/454927",
		"81": "64C2CD159F2F6B2F170ED3C827925A164AAAD836/454933",
		"82": "A72ACC2DAA06F1D0E4967CEE234F4D67B90E91E3/454939",
		"83": "B07DEC4228AD0E99B3B972052FAFC20A9F925B42/454945",
		"84": "C83C3F0841B379F736FBCF0BCD20965A51A353A4/454951",
		"85": "506EA8BC9BBC0DA840D355374BD3F8366E5C5A72/454957",
		"86": "3EC84BE4E680240AE26123E7B373269105BDB35C/454963",
		"87": "02CD7B14505349B33FCCA4E3E9E1FF4E28FAF618/454969",
		"88": "1690030D335C15440AD8D31251C85C3E5A124906/454975",
		"89": "D62721B104039641A3DB98999F2CF1E42DB86A37/454981",
		"90": "3F7661F3447E66390F195AF70EEA3CF4AD6E25FB/454987",
		"91": "B3303766051B65F79AFF9E550D9964A073DB4C3F/454993",
		"92": "F59723D9BDFB311542F277207B740301240FABD1/454999",
		"93": "D0C010FAE925A3F04E9578EC717BDA0EBFF3011E/455005",
		"94": "04941A4157C033147D30C54733777B54F768E2F6/455011",
		"95": "9EBE516269ABF007E6D3EFB843FAACFA5B60010D/455017",
		"96": "939E42F5D9A948727209AF3ADC24281ED0BACBD2/455023",
		"97": "A14CCE3F784B0CE129EB3EA768F858580A71CA03/455029",
		"98": "3822B6D67AACA92465F494F33F13CFF207FC3569/455035",
		"99": "376AA676C5E0D6103712F9E06FE05245B0C80F76/455041",
		"100": "753F176FEA0E64F222CA5596A0B4AC5905F0210C/455047",
		"101": "C6D52DCE17B8E26F63E50706EF155B399FE82172/455053",
		"102": "3230399E031DC2B00F2859589EB1247906142BFF/455059",
		"103": "747671959E5C4FF8A64632600FA8A5E56D35C6C0/455065",
		"104": "C12B4AE82A70DE3A2EB7512E1658B6722B0F4E35/455071",
		"105": "F14EE0C61D63BD0B533EB9C6A86C792AB46E22E5/455077",
		"106": "A397A3D2000C9196E7D0FF38ADFF025FADDED9EA/455083",
		"107": "39A228A2D4AC01A76A9E2EC2AA9B62C1A5C62556/455089",
		"108": "5343F06EAE8099DF3F7FA895AAF80DC6385ABAED/455095",
		"109": "AA4158D0A6974D5AF6F0B026AF6066F07FBA6EA8/455101",
		"110": "D80CD439BFC90C5F34DB5BC6A4047494B79DFB69/455107",
		"111": "CE9D6BE4F0F2E10B733C5BFC7923AD6E08E27557/455113",
		"112": "A555D79698ACC0FB9ECC5240263ACF689D5BA77E/455119",
		"113": "6D064FB19C53253B3757A1A4B2CE6EF4EE05A601/455125",
		"114": "0226FA5D1D0F17D4BF0259041D012049BDB233B9/455131",
		"115": "2E1C7ED258C81454D65E41FB300DC1F02903E7BC/455137",
		"116": "CCCF02D9DA0C7293EFCE22C6779D64C39D110443/455143",
		"117": "2657B12199347DF1A5BBD9DDF3F0DDCDD2666909/455149",
		"118": "0E9D9238E4A2C8D229F8A11060E8C854C8146AC4/455155",
		"119": "B6E14038D66EA94BAB073AFB52383DC42B36667C/455161",
		"120": "C51C64D477C2BDF936514CECABF7314403694D72/455167",
		"121": "DDDFE76B64A492DCBD13B7079CA70360EA1EDBCE/455173",
		"122": "23B994EFA8F3307B93F80DBE7D0BC4C6B9C510BD/455179",
		"123": "F101DC74D325ACB89B7898472896DFA9791FFADB/455185",
		"124": "D60F6A9D3A19F97C9CC3315F02784C3E3CDA17DF/455191",
		"125": "D01AF45A2AEFAF6329464EB9B76214D3DBE277C5/455197",
		"126": "F9F2AE5D9AA4CE36B29F500DFC6912F9AD5EC653/455203",
		"127": "B8553799B2E9D39E14900408A7CD1F6F1BAAD910/455209",
		"128": "98555E5F7868CDE3A90524DD17F1F82F6843E216/455215",
		"129": "2306DE3644440F5492AF72AD23BD0A1BEEE034B9/455221",
		"130": "39BB0C49D7762F9BCCB95047170AE950B26FBB95/455227",
		"131": "E680FFD3490113B168E13BEA6308136274BA1D07/455233",
		"132": "56133563F91DF5537AE9B9A42006CCAFDBEA1A2D/455239",
		"133": "112941F59F5816FFE04AEBE34154E8C6B22DBB71/455245",
		"134": "C1A4FC9E4E99A7D3C9BEE647DF46D2C0F2F5FA5F/455251",
		"135": "D9D2D09C41123FC0BFAFF8124E39DD7544B30BD7/455257",
		"136": "B63AB1569413076DBC04B11E64BE2D3D0F9A37C6/455263",
		"137": "9707570C0872BF993F3C082938BBC23DF3D60419/455269",
		"138": "980894D9D763C9DBB7CEF10BAB0B6891C0B3C12F/455275",
		"139": "E2913AA7DAC0190EE89D0D387B03E8EE21E10F99/455281",
		"140": "80D3799904F2A176EA239816D46C1FC3B6F507C1/455287",
		"141": "0C80185A97D4B7719FF8BACAF0F5AE4AD816F350/455293",
		"142": "A3E9610C5B05D21D58A94B30C2770391F47B2CB7/455299",
		"143": "F6FA4CC55ADCA446E631C1083535DC930BFB20E5/455305",
		"144": "353AF97AA2C703C37EEF53F763E2D649066C0B31/455311",
		"145": "106FCD733AC3E105D1DA2D756A5C7B182759F5C6/455317",
		"146": "6D1B310B7970C69142EA9AF46CA3BB2FFDF14A07/455323",
		"147": "D65AFF76D61A5E66683ED6225B2770B60D0264C1/455329",
		"148": "F2B24A28F5C3C4CE567B47C2657375642FB21E36/455335",
		"149": "6D06E551FE2FB329FAA97B0CACC8D607FB631B3B/455341",
		"150": "D4C16F2D9322BA2420F225406207060562069092/455347",
		"151": "007B30B7C3D3E20BA03119934C9466C9BDBFF0C9/455353",
		"152": "EAFF670B510E786FB07BAA53A6D8C923ADEEBD6C/455359",
		"153": "7E0857930D7A25541A5FEBD4EC0D9312A7704476/455365",
		"154": "599C310034F7C90F7E760908D231C4FD407C0B07/455371",
		"155": "F7717F0705151148CBD1AFC510FC612996ACE5C9/455377",
		"156": "6E7A45769C45ECA80815D546A65F394349BA900D/455383",
		"157": "1B4F94553FE362C147AD65ABABA3E99D97A9BC1E/455389",
		"158": "AEBAF4A81814D6E5E0272505A16E13C7730E6716/455395",
		"159": "426A2A0DC0989BB6BE7D46DD0508240C05C7C52E/455401",
		"160": "325DC02AA8EBAE047890245661CF6CB3359ED415/455407",
		"161": "6CC490F96CF3CB01D9C8150AB5753AB02E45D761/455413",
		"162": "F85973BD0E9CD40E6D0BFD02ACC04D021CFAE557/455419",
		"163": "10C123FED832CA42AF40B6CCF6704DBA13183E9C/1301336",
		"164": "E5EC64C27EC252B6233C06009B58353E34A51166/1301338",
		"165": "536EEE764060E4C06C53DCD828B3117B75CB8010/1301340",
		"166": "B06C9D4E0E4B57541164D6FFAE50A692BDFD3F1B/1301350",
		"167": "0C07946AE63A180404E17CD8AA23CA07B63A5676/1301374",
		"168": "CA292099063E3AA84A01176ABD209608B8FE3251/1301298",
		"169": "2627C79F7958086A679A5938545804D5759829F3/1301364",
		"170": "B099E669CFB1E29A3E677675B9A82862EDFD04F3/1301388",
		"171": "CAF341BD627C0499B84D5B0E3FAE37FFBDE6C116/1301396",
		"172": "BEB02E15B5CF3F1FCB91DEF72D461B29690593E2/1301400",
		"173": "6B9DE20B1CF8F7FC03C42EB0046E53D45A947A76/1301288",
		"174": "61E1B925B36950B54BED4C7AD072281591C67EA7/1301290",
		"175": "ED133A0CCF137609CEBB77AE6E093FDBC5090219/1301292",
		"176": "A62B9DABC4743EAD444237A36D6F9AAB5C0478CE/1301294",
		"177": "6F2E12291F0D13EF5236AC6BBBE345F73DE4EB00/1301296",
		"178": "46BB7A4552670738D519045A6B12741125181BC0/1301300",
		"179": "3B4C35A41D14EACB9B0660BAE6B7AACD2F452379/1301302",
		"180": "4E3016F5D406C7BF3F1FE026C36FBA6C970D0E65/1301378",
		"181": "010219541A0AF1AB2B78E0BE90BC381BF2E1D7B7/1301304",
		"182": "7194DA2CFC71B1004D7BE42CA03E680BBE3D4DC5/1301306",
		"183": "A600106B262E25E5EFE3ED52D1326F010AE37528/1301308",
		"184": "4ED25B606370C2D8EF66DC0CAC6FF153C63DDF1B/1301310",
		"185": "19AACBFF4C705A315698A338E25DCD1763E0021A/1301312",
		"186": "15527A93364375EC47F9DD1DDA900939555FEA73/1301314",
		"187": "9D4DF26B21C93211922ED0360CED4EE204CBB52E/1301316",
		"188": "3CE5CD984A9EB7BD1E7143707C6EB1DE745017C5/1301318",
		"189": "02CED42E7E69D73A09FEF90190D3560831530818/1301320",
		"190": "C86761E7C0E40C2FD3E66EC161D25E1005D2B1DA/1301322",
		"191": "74F612BAE6243BE19352EEE4C958D0B921A87F80/1301324",
		"192": "AC1F0EFDB8A797F66FF3F4E861254373949D9916/1301326",
		"193": "B654AA717A6AFF6B391E17210AA85C0C0378CE77/1301328",
		"194": "9AACEDFF2A34FCC6DBAF1F2B1F4FA0C53E2DAD4F/1301330",
		"195": "9778A8BD4D5F91C7E814FB760D8006C3385054F5/1301332",
		"196": "2F21C908F509E909040303E80720290854130850/1301334",
		"197": "4B03D2944026C4AC02E1C953E15FC7C30DE20C40/1301342",
		"198": "A134EE470B333C7373645E5D66060B8003D34E72/1301344",
		"199": "F7214A0215E21976E89E1708EF80716E0A68CCBC/1301346",
		"200": "0418E0FF111150FC49A5FE6CEFA0B64E029BD16F/1301348",
		"201": "E1681D54F9B5E4549932B65D6BDA420108FCACBC/1301352",
		"202": "2C380877E418951A4DB59F3F032C19E09EC805E0/1301354",
		"203": "69D7132EAA633214B1410E0623A0590E522FBF44/1301356",
		"204": "D2581B3ADB1599FF1693673390C8FA0F652129F3/1301358",
		"205": "409C13B45B3007FB339EDED180086D0392A919CE/1301360",
		"206": "7558BC02ED4FA7987642029FD2A89EAD09431105/1301362",
		"207": "6D9ED9A952A6A408B90D53A42F48546F09B4CCC1/1301366",
		"208": "D81907B564BE4CD596E2F5D16FC1B0FAD20E3724/1301368",
		"209": "0124B96B33F3B2CD689779BA1869059D0F9DFA0C/1301370",
		"210": "52F2B3442F97C539D6AFE316EE560EA8E216B30C/1301372",
		"211": "012F1BE6BE98529B0190C0041CA450E500D1CF59/1301376",
		"212": "66184848C83C75A67CEE33EDDD669C37D7C15A23/1301380",
		"213": "6F43BB33700CCFD60622CAD9D36BCC600DFF1941/1301382",
		"214": "036C39A49998966F59A999EAEB5BD1F648EEE11B/1301384",
		"215": "78C809CE74B3921465E6F9B75A549FE29E06910C/1301386",
		"216": "066CF0B9D87937203A0B333D5B190B0DE7FA740F/1301390",
		"217": "F703A153F20EC0E30DABEBBD34BC7B69DF72E274/1301392",
		"218": "0106ED3FC77A031A4EFE5B0AF8060E0C054AE03C/1301394",
		"219": "6C49172562FCCC770E45E7B15E9F16BFCDD8D33D/1301398",
		"220": "7AB10D0266D7DEE94702E56A1DC3282FE2571C77/1301402",
		"221": "212CB0553B93612EED91255107373CC9EEA90CEC/1301404",
		"222": "1A0BC661E2A6DC67BB46E8DE2C97E5793E4E0F75/1301406",
		"223": "C129080F41BEEB5DA925BCF95753FF63C00EAC52/1301408",
		"224": "4808D7053F0AEF0EBFCDFE0C5F5B0E9E02D20608/1301410",
		"225": "98D9E45B4BA04175203116CE98EE7AFA0713F43E/1301412",
		"226": "48BFCA4EB325A03E6DD00A6B689BBAF1A7C7E83B/1301414",
		"227": "2FE1019E2F11787B6F4DCF6F3665790AD73B0960/1301416",
		"228": "A7B46B53FB6A672F13DCCE3FF40A7BCCD919D522/1301418",
		"229": "B3A002F000B74006B70F7C231877D413E7974467/1301420",
		"230": "4B6B0A0CB3D444490D135291D82C18A05602DBC2/1301422",
		"231": "09B3BC051911932F69DAF93032B952EC5F0D1EE1/1301424",
		"232": "63E9E96673FC3A02F1C79A1DF13DFF65D0240902/1301426",
		"233": "59100C98C1FEC39B1E0FF51B0E73AB1A77C41145/1301428",
		"234": "4004519F41AA100102BBCF0734D16CF8FA083C14/1322444",
		"235": "A045F306D71A94CC24C3FF74D4BA4BD003A8A846/1322446",
		"236": "0C073D9FC9DF174F530996F47DA8D944383AA8DD/1322450",
		"237": "F80EBFA6094A40E0C5A8763E62339323F2596D49/1322448",
		"238": "510508155E1F03CEFBF32161B9BE3A5BFAFAEEAC/1322442",
		"239": "53BFDB401455314B12BE27AED27AC7AF7DE414BF/1322458",
		"240": "1A46E09F37729302D7D5BA58F7BDF86B075FFECB/1322456",
		"241": "0D31DAFF710B5D27DF28DD9D22613A3E62F47930/1322455",
		"242": "22DDB2AF0D0EFC39FB05F2B0A3E095F90DF14642/1322453",
		"243": "AA15AC94B74D1E5FAD5E09A4033A5257C0BFED4B/1322451"
	}
};
