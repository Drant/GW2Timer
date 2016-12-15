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
	
	// Section names
	s_manager: {de: "manager", es: "administrador", fr: "gestionnaire",
		cs: "správce", it: "gestione", pl: "menedżer", pt: "gerenciador", ru: "диспетчер", zh: "管理员"},
	s_bank: {de: "bank", es: "banco", fr: "banque",
		cs: "banka", it: "banca", pl: "bank", pt: "banco", ru: "банк", zh: "银行"},
	s_vault: {de: "tresor", es: "arcón", fr: "coffre",
		cs: "trezor", it: "volta", pl: "kufer", pt: "tesouro", ru: "сундук", zh: "保险箱"},
	s_materials: {de: "materialien", es: "materiales", fr: "matériaux",
		cs: "materiály", it: "materiale", pl: "materiały", pt: "materiais", ru: "материалы", zh: "物料"},
	s_wardrobe: {de: "garderobenlager", es: "garderobe", fr: "garderobe",
		cs: "skříň", it: "armadio", pl: "szafa", pt: "roupeiro", ru: "гардероб", zh: "衣柜"},
	s_outfits: {de: "kleidungssets", es: "atuendos", fr: "tenues",
		cs: "oblečení", it: "abiti", pl: "strój", pt: "vestuário", ru: "костюмы", zh: "服装"},
	s_dyes: {de: "farben", es: "tintes", fr: "teintures",
		cs: "barviva", it: "tinturi", pl: "barwniki", pt: "tinturas", ru: "красители", zh: "染料"},
	s_minis: {de: "miniaturen", es: "miniaturas", fr: "miniatures",
		cs: "miniatury", it: "miniature", pl: "miniatury", pt: "miniaturas", ru: "миниатюры", zh: "微缩模型"},
	s_finishers: {de: "todesstöße", es: "remates", fr: "coups de grâce",
		cs: "finišer", it: "finitore", pl: "apreter", pt: "arrematador", ru: "финишер", zh: "终结者"},
	s_carriers: {de: "briefboten", es: "carteros", fr: "messagers",
		cs: "kurýři", it: "corrieri", pl: "kurierzy", pt: "correios", ru: "курьеры", zh: "快递"},
	s_gliders: {de: "gleitschirm", es: "planeador", fr: "deltaplanes",
		cs: "kluzáky", it: "alianti", pl: "szybowce", pt: "planadores", ru: "планеры", zh: "滑翔机"},
	s_characters: {de: "charaktere", es: "personajes", fr: "personnages",
		cs: "postavy", it: "personaggi", pl: "postacie", pt: "personagens", ru: "персонажей", zh: "人物"},
	s_hero: {de: "heldin", es: "héroe", fr: "héros",
		cs: "hrdina", it: "eroe", pl: "bohater", pt: "herói", ru: "геро́й", zh: "主角"},
	s_equipment: {de: "ausrüstung", es: "equipamiento", fr: "equipement",
		cs: "vybavení", it: "equipaggiamento", pl: "sprzęt", pt: "equipamento", ru: "обору́дование", zh: "设备"},
	s_inventory: {de: "inventar", es: "inventario", fr: "inventaire",
		cs: "inventář", it: "inventario", pl: "inwentarz", pt: "inventário", ru: "инвента́рь", zh: "库存"},
	s_ascended: {de: "aufgestiegen", es: "ascendido", fr: "élevé",
		cs: "vystoupal", it: "asceso", pl: "wstąpił", pt: "ascendeu", ru: "вознесся", zh: "登高"},
	s_recipes: {de: "rezepte", es: "recetas", fr: "recettes",
		cs: "recepty", it: "ricette", pl: "recepty", pt: "receitas", ru: "рецепты", zh: "食谱"},
	s_crafting: {de: "handwerkskunst", es: "artesanía", fr: "artisanat",
		cs: "řemeslo", it: "mestiere", pl: "rzemiosło", pt: "ofício", ru: "ремесло", zh: "手艺"},
	s_trading: {de: "handel", es: "comercio", fr: "commerciale",
		cs: "obchod", it: "commercio", pl: "handel", pt: "comércio", ru: "продажа", zh: "贸易"},
	s_recent: {de: "aktuell", es: "reciente", fr: "récent",
		cs: "poslední", it: "recenti", pl: "ostatnie", pt: "recente", ru: "последние", zh: "最近"},
	s_museum: {de: "museum", es: "museo", fr: "musée",
		cs: "muzeum", it: "museo", pl: "muzeum", pt: "museu", ru: "музей", zh: "博物馆"},
	s_pvp: {de: "pvp", es: "jcj", fr: "jcj",
		cs: "hph", it: "gcg", pl: "pvp", pt: "jcj", ru: "ипи", zh: "玩家对战"},
	
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
	s_skins: {de: "skins", es: "diseños", fr: "apparences",
		cs: "vzhledy", it: "apparenze", pl: "karnacje", pt: "desenhos", ru: "конструкции", zh: "皮肤"},
	s_currencies: {de: "währung", es: "monedas", fr: "monnaies",
		cs: "měny", it: "valute", pl: "waluty", pt: "moedas", ru: "валюта", zh: "货币"},
	s_tokens: {de: "wertmarke", es: "fichas", fr: "jetons",
		cs: "žetony", it: "gettoni", pl: "żeton", pt: "fichas", ru: "жетоны", zh: "令牌"},
	s_attributes: {de: "attribute", es: "atributos", fr: "caractéristiques",
		cs: "atributy", it: "attributi", pl: "atrybuty", pt: "atributos", ru: "атрибуты", zh: "属性"},
	s_wiki: {de: "wiki", es: "wiki", fr: "wiki",
		cs: "wiki", it: "wiki", pl: "wiki", pt: "wiki", ru: "ви́ки", zh: "维基"},
	s_item: {de: "gegenstand", es: "objeto", fr: "objet",
		cs: "objekt", it: "oggetto", pl: "obiekt", pt: "objeto", ru: " объе́кт", zh: "物体"},
	s_gallery: {de: "Katalog", es: "Galería", fr: "Galerie",
		cs: "Galerie", it: "Raccolta", pl: "Galeria", pt: "Galeria", ru: "Коллекция", zh: "图库"},
	s_tab: {de: "registerkarte", es: "pestaña", fr: "onglet",
		cs: "karta", it: "scheda", pl: "karta", pt: "guia", ru: "вкладка", zh: "选项卡"},
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
	s_buying: {de: "kaufen", es: "comprando", fr: "achat en cours",
		cs: "nákup", it: "comprando", pl: "kupuje", pt: "comprando", ru: "покупаю", zh: "目前买"},
	s_selling: {de: "verkaufen", es: "vendiendo", fr: "vente en cours",
		cs: "prodávat", it: "vendendo", pl: "sprzedaje", pt: "vendendo", ru: "продаю", zh: "目前卖"},
	s_bought: {de: "gekauft", es: "comprado", fr: "achats historique",
		cs: "koupil", it: "comprato", pl: "kupiłem", pt: "comprei", ru: "купил", zh: "买了"},
	s_sold: {de: "verkauft", es: "vendido", fr: "ventes historique",
		cs: "prodal", it: "venduto", pl: "sprzedał", pt: "vendi", ru: "продал", zh: "卖了"},
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
			{ id: 24, payment: "fotm_pristine", coefficient: 15, name_en: "Pristine Fractal Relic", name_de: "Makelloses Fraktal-Relikt", name_es: "Reliquia fractal prístina", name_fr: "Relique fractale immaculée", name_zh: "原始碎层古物" },
			{ id: 28, payment: "raid_ft", coefficient: 10, name_en: "Magnetite Shard", name_de: "Magnetit-Scherbe", name_es: "Esquirla de magnetita", name_fr: "Éclat de magnétite", name_zh: "磁铁碎块" }
		],
		General: [
			{ id: 1, coefficient: 1, name_en: "Coin", name_de: "Münze", name_es: "Moneda", name_fr: "Pièce", name_zh: "钱币" },
			{ id: 4, coefficient: "gem", payment: "gem", name_en: "Gem", name_de: "Edelstein", name_es: "Gema", name_fr: "Gemme", name_zh: "宝石" },
			{ id: 2, coefficient: 1, payment: "karma", name_en: "Karma", name_de: "Karma", name_es: "Karma", name_fr: "Karma", name_zh: "业力" },
			{ id: 3, coefficient: 10000, payment: "laurel", name_en: "Laurel", name_de: "Lorbeer", name_es: "Laurel", name_fr: "Laurier", name_zh: "桂冠" },
			{ id: 15, coefficient: 100, payment: "badge", name_en: "Badge of Honor", name_de: "Ehrenabzeichen", name_es: "Insignia de honor", name_fr: "Insigne d'honneur", name_zh: "荣誉徽章" },
			{ id: 31, coefficient: 500, payment: "proof", name_en: "Proof of Heroics", name_de: "Beweis der Heldentaten", name_es: "Prueba de hazañas", name_fr: "Preuve d'héroïsme", name_zh: "英雄证明" },
			{ id: 16, coefficient: 10000, payment: "commendation", name_en: "Guild Commendation", name_de: "Gilden-Belobigung", name_es: "Mención de clan", name_fr: "Recommandation de guilde", name_zh: "公会奖状" },
			{ id: 29, coefficient: 5000, payment: "provisioner", name_en: "Provisioner Token", name_de: "Versorger-Marke", name_es: "Vale de suministrador", name_fr: "Coupon de fournisseur", name_zh: "供给官徽记" },
			{ id: 23, coefficient: 1000, name_en: "Spirit Shard", name_de: "Geister-Scherbe", name_es: "Esquirla espiritual", name_fr: "Éclat d'esprit", name_zh: "灵魂碎片" },
			{ id: 18, coefficient: 10000, name_en: "Transmutation Charge", name_de: "Transmutations-Ladung", name_es: "Carga de transmutación", name_fr: "Charge de transmutation", name_zh: "幻化力" }
		],
		Map: [
			{ id: 25, payment: "map_dt", name_en: "Geode", name_de: "Geode", name_es: "Geoda", name_fr: "Géode", name_zh: "" },
			{ id: 27, payment: "map_sw", name_en: "Bandit Crest", name_de: "Banditen-Wappen", name_es: "Enseña de bandido", name_fr: "Écu de bandit", name_zh: "强盗徽饰" },
			{ id: 19, payment: "map_vb", name_en: "Airship Part", name_de: "Luftschiff-Teil", name_es: "Pieza de aeronave", name_fr: "Pièce d'aéronef", name_zh: "飞船部件" },
			{ id: 22, payment: "map_ab", name_en: "Lump of Aurillium", name_de: "Aurilliumklumpen", name_es: "Trozo de aurilio", name_fr: "Bloc d'aurillium", name_zh: "块状赤金元素" },
			{ id: 20, payment: "map_td", name_en: "Ley Line Crystal", name_de: "Ley-Linien-Kristall", name_es: "Cristal de línea ley", name_fr: "Cristal des lignes de force", name_zh: "魔径水晶" },
			{ id: 32, coefficient: 0.1, payment: "magic", name_en: "Unbound Magic", name_de: "Entfesselte Magie", name_es: "Magia liberada", name_fr: "Magie déliée", name_zh: "未受约束的魔法" },
			{ id: 26, name_en: "WvW Tournament Claim Ticket", name_de: "WvW-Turnier-Ticket", name_es: "Tique de recogida de torneo WvW", name_fr: "Billet de retrait de tournoi McM", name_zh: "世界之战锦标赛兑换券" },
			{ id: 30, coefficient: 10, name_en: "PvP League Ticket", name_de: "PvP-Liga-Ticket", name_es: "Tique de liga PvP", name_fr: "Ticket de ligue JcJ", name_zh: "PvP联赛兑换券" }
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
		Dyes: null,
		Minis: null,
		Finishers: null,
		Recipes: null,
		Buying: null,
		Selling: null
	},
	AuditCategoriesCharacters: {}, // Same format as audit categories but is a breakdown of individual characters
	AuditHistory: // Data to store for historical audit graphs, uses appraised sell price only, will include all entries from AuditCategories
	{
		Timestamps: null, // Array of ISO timestamp strings
		WalletCoin: null, // All other entries are integer arrays
		TotalGems: null,
		TotalAppraisedSellNoGems: null,
		TotalLiquidSellNoGems: null
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
		badge: {id: 15, color: "#8c7047", conversion: [30, 71473], isliquid: true}, // Badge of Tribute
		proof: {id: 31, color: "#ffff53", conversion: [6, 21262], isliquid: true, ishidden: true}, // Superior Catapult Blueprints
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
		raid_ft: {id: 28, color: "#27454a", conversion: [1000, 77310, 200000], isliquid: true}, // Zojja Doublet
		map_dt: {id: 25, color: "#eeebba", conversion: 0},
		map_sw: {id: 27, color: "#ebd1a1", conversion: 0},
		map_vb: {id: 19, color: "#cecea0", conversion: 0},
		map_ab: {id: 22, color: "#d7c762", conversion: 0},
		map_td: {id: 20, color: "#42c8dd", conversion: 0},
		magic: {id: 32, color: "#ffff32", conversion: [12400, 37000], isappraised: true, isbound: true} // Quiver of a Thousand Arrows
	},
	AuditUpgrades: { // Account upgrades from the gem store
		CharacterSlot: {starting: 5, purchased: 0, gem: 800, id: 20125},
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
	ProfLevel: {
		Max: 80
	},
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
			{en: "", de: "", es: "", fr: ""},
			{en: "Bronze", de: "Bronze", es: "Bronce", fr: "Bronze"},
			{en: "Silver", de: "Silber", es: "Plata", fr: "Argent"},
			{en: "Gold", de: "Gold", es: "Oro", fr: "Or"},
			{en: "Platinum", de: "Platin", es: "Platino", fr: "Platine"},
			{en: "Mithril", de: "Mithril", es: "Mithril", fr: "Mithril"},
			{en: "Diamond", de: "Diamant", es: "Diamante", fr: "Diamant"}
		],
		Titles: [
			{en: "Invader", de: "Eindringling", es: "Invasor", fr: "Envahisseur"},
			{en: "Assaulter", de: "Angreifer", es: "Asaltador", fr: "Agresseur"},
			{en: "Raider", de: "Plünderer", es: "Asaltante", fr: "Raider"},
			{en: "Recruit", de: "Rekrut", es: "Recluta", fr: "Recrue"},
			{en: "Scout", de: "Späher", es: "Explorador", fr: "Éclaireur"},
			{en: "Soldier", de: "Soldat", es: "Soldado", fr: "Soldat"},
			{en: "Squire", de: "Knappe", es: "Escudero", fr: "Écuyer"},
			{en: "Footman", de: "Infanterist", es: "Lacayo", fr: "Valet de pied"},
			{en: "Knight", de: "Ritter", es: "Caballero", fr: "Chevalier"},
			{en: "Major", de: "Major", es: "Comandante", fr: "Commandant"},
			{en: "Colonel", de: "Oberst", es: "Coronel", fr: "Colonel"},
			{en: "General", de: "General", es: "General", fr: "Général"},
			{en: "Veteran", de: "Veteran", es: "Veterano", fr: "Vétéran"},
			{en: "Champion", de: "Champion", es: "Campeón", fr: "Champion"},
			{en: "Legend", de: "Legende", es: "Leyenda", fr: "Légende"}
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
	NumArmorSlots: 6,
	GatheringCharges: {Foraging: 50, Logging: 100, Mining: 100},
	SalvageCharges: {
		"23038": 15, // Crude Salvage Kit
		"23040": 25, // Basic Salvage Kit
		"23041": 25, // Fine Salvage Kit
		"23042": 25, // Journeyman's Salvage Kit
		"23043": 25, // Master's Salvage Kit
		"23045": 250, // Mystic Salvage Kit
		"19986": 25, // Black Lion Salvage Kit
		"73481": 20 // Ascended Salvage Kit
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