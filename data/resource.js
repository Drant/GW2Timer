/*
 * This file is used by http://gw2timer.com/resource
 * Resource nodes map data. Node properties:
 * c: coordinates
 * p: path (optional)
 * q: quantity (optional, number of items yield)
 */

var GW2T_RESOURCE_DATA = {
/* =============================================================================
 * @@METAL
 * ========================================================================== */
Copper: {
	name_en: "Copper",
	name_de: "Kupfer",
	name_es: "Cobre",
	name_fr: "Cuivre",
	type: "Metal",
	item: "19697",
	riches: [
	{c: [9865, 16183]}, // caledon
	{c: [10227, 17559], p: [[10106,18114],[10121,18047],[10151,17938],[10135,17674],[10206,17624],[10224,17585]]},
	{c: [11763, 13103]}, // queensdale 
	{c: [12776, 13981]},
	{c: [25771, 15365]}, // ashford
	{c: [27549, 15143], p: [[27079,15033],[27424,15167],[27474,15167],[27523,15155]]},
	],
	regulars: [
	{c: [26646, 15357]}, // ashford
	{c: [27369, 14606]},
	{c: [28610, 13653]}
	]
},	
Iron: {
	name_en: "Iron",
	name_de: "Eisen",
	name_es: "Hierro",
	name_fr: "Fer",
	type: "Metal",
	item: "19699",
	riches: [
	{c: [6327, 15041]}, // brisban
	{c: [9583, 15064], p: [[9964,15279],[9813,15212],[9636,15236],[9604,15166],[9616,15144],[9595,15102]]}, // kessex
	{c: [12640, 15579], p: [[12780,15545],[12805,15476],[12801,15439],[12747,15598],[12720,15624],[12662,15598]]},
	{c: [12697, 15954], p: [[12772,15592],[12805,15669],[12685,15714],[12706,15820],[12702,15924]]},
	{c: [16935, 14020], p: [[17193,14106],[17131,14041],[17123,13942],[17017,13936],[16958,13997]]}, // gendarran
	{c: [13548, 11110], p: [[13713,11267],[13621,11327],[13598,11305],[13572,11185],[13518,11180],[13507,11134],[13525,11128]]}, // harathi
	{c: [18348, 13444], p: [[18303,13688],[18499,13545],[18498,13464],[18400,13375],[18415,13392],[18400,13437],[18364,13442]]},
	{c: [20914, 12447], p: [[20892,12215],[20848,12470],[20860,12481],[20889,12466]]}, // snowden
	{c: [20365, 15737], p: [[20275,16037],[20166,16011],[20077,15875],[20120,15832],[20323,15786],[20347,15751]]}, // dredgehaunt
	{c: [23758, 12739], p: [[24119,12792],[23934,12642],[23813,12662],[23756,12632],[23713,12663],[23744,12718]]}, // diessa
	{c: [28961, 17355], p: [[28968,17275],[28962,17255],[29044,17253],[29026,17304],[28981,17342]]}, // fields
	{c: [31157, 15013], p: [[30647,15185],[30791,15261],[30976,15196],[31098,15189],[31144,15174],[31146,15158],[31158,15149],[31145,15110],[31152,15092],[31133,15061],[31156,15020]]} 
	],
	regulars: [
	{c: [16489, 10086]}, // harathi
	{c: [17774, 16366]}, // lornar
	{c: [24470, 13451]}, // diessa
	{c: [30905, 15375]}, // blazeridge
	]
},
Silver: {
	name_en: "Silver",
	name_de: "Silber",
	name_es: "Plata",
	name_fr: "Argent",
	type: "Metal",
	item: "19703",
	riches: [
	{c: [6949, 14732]}, // brisban
	{c: [9575, 15073]}, // kessex
	{c: [17407, 14141]}, // gendarran
	{c: [19610, 12730], p: [[19577,12858],[19507,12838],[19510,12805],[19589,12751]]}, // snowden
	{c: [17708, 14691], p: [[17866,14960],[17856,15078],[17829,15089],[17734,15040],[17708,14712]]}, // lornar
	{c: [25173, 12224]}, // diessa
	{c: [31101, 16446]} // fields
	],
	regulars: [
	{c: [20857, 12888]}, // snowden
	{c: [19249, 12515]},
	{c: [26885, 13159]} // diessa
	]
},
Gold: {
	name_en: "Gold",
	name_de: "Gold",
	name_es: "Oro",
	name_fr: "Or",
	type: "Metal",
	item: "19698",
	riches: [
	{c: [16534, 9911], p: [[15254,10003],[15237,9952],[15346,9850],[15517,9845],[15729,9888],[15872,10012],[15993,9930],[16094,9826],[16177,9789],[16423,9909],[16505,9913]]}, // harathi
	{c: [17911, 17982]}, // lornar
	{c: [20066, 17207], p: [[19938,17136],[19912,17425],[20014,17480],[20084,17450],[20128,17367],[20074,17230]]}, // dredgehaunt
	{c: [31650, 17347], p: [[31121,16979],[31268,17085],[31447,17136],[31510,17247],[31647,17304],[31645,17323]]}, // fields
	{c: [31125, 12282], p: [[30734,12716],[30849,12618],[30834,12551],[30911,12485],[31001,12492],[31018,12484],[31148,12332],[31134,12298]]} // blazeridge
	],
	regulars: [
	{c: [15933, 16436]} // bloodtide
	]
},
Platinum: {
	name_en: "Platinum",
	name_de: "Platin",
	name_es: "Platino",
	name_fr: "Platine",
	type: "Metal",
	item: "19702",
	riches: [
	{c: [16429, 18201], p: [[16248,18368],[16494,18533],[16801,18424],[16800,18355],[16665,18214],[16455,18294],[16363,18188],[16412,18167],[16420,18181]]}, // bloodtide
	{c: [15623, 20260], p: [[15937,19856],[15638,19623],[15529,19547],[15431,19675],[15482,19768],[15599,19883],[15449,19895],[15474,19980],[15460,20061],[15649,20101],[15632,20233]]}, // sparkfly
	{c: [17293, 20362], p: [[17482,20675],[17499,20645],[17486,20533],[17368,20417],[17274,20408],[17225,20350],[17239,20328],[17271,20353]]},
	{c: [17946, 22155], p: [[18218,22080],[18105,22177],[18109,22281],[18057,22276],[17982,22226],[17965,22272],[17923,22176]]}, // maelstrom
	{c: [20931, 22505]},
	{c: [19167, 19252], p: [[19377,19536],[19233,19394],[19179,19223],[19243,19207],[19215,19244],[19199,19251]]}, // timberline
	{c: [20915, 18219], p: [[21080,18918],[21059,18800],[21109,18760],[21050,18540],[21195,18497],[21104,18382],[21123,18362],[21057,18338],[20984,18426],[20998,18358],[20945,18347],[20922,18250]]}, // timberline
	{c: [27751, 9674], p: [[27918,9918],[27936,9959],[27876,10075],[27747,10099],[27591,9997],[27690,9776],[27613,9620],[27652,9603],[27729,9660]]}, // blazeridge
	{c: [29084, 9609]},
	{c: [24678, 9345], p: [[24084,9793],[24273,9816],[24396,9766],[24446,9624],[24588,9538],[24664,9373]]}, // fireheart
	{c: [26934, 9849], p: [[26811,9783],[26899,9676],[26991,9667],[26966,9803],[26913,9836],[26928,10010],[26993,10006],[26972,9880],[26952,9867]]}
	],
	regulars: [
		{c: [19181, 23244]}, // maelstrom
		{c: [27231, 13285]} // marches
	]
},
Mithril: {
	name_en: "Mithril",
	name_de: "Mithril",
	name_es: "Mithril",
	name_fr: "Mithril",
	type: "Metal",
	item: "19700",
	riches: [
	{c: [21346, 10759], p: [[21128,11158],[21204,11000],[21149,10852],[21326,10767]]}, // frostgorge
	{c: [22191, 9448], p: [[22464,8832],[22474,9033],[22397,9144],[22343,9345],[22319,9581],[22411,9605],[22489,9548],[22360,9461],[22215,9448]]},
	{c: [11039, 23931]}, // malchor
	{c: [14256, 23451]},
	{c: [10705, 27456]}, // cursed
	{c: [11658, 29142]}
	],
	regulars: [
	{c: [5275, 16130]}, // dry
	{c: [5073, 16381]},
	{c: [4961, 16478]},
	{c: [4425, 15887]},
	{c: [4352, 16256]},
	{c: [4638, 16211]},
	{c: [3921, 16199]},
	{c: [4859, 15547]}, // silver
	{c: [27087, 9023]}, // fireheart
	{c: [15003, 22732]}, // straits
	{c: [13617, 25044]}, // malchor
	{c: [11313, 26808]} // cursed
	]
},
Orichalcum: {
	name_en: "Orichalcum",
	name_de: "Orichalcum",
	name_es: "Oricalco",
	name_fr: "Orichalque",
	type: "Metal",
	item: "19701",
	riches: [
	{c: [12424, 19478]} // southsun
	],
	regulars: [
	{c: [4833, 14596]}, // silver
	{c: [4834, 14890]},
	{c: [4879, 15386]},
	{c: [3910, 16726]}, // dry
	{c: [3916, 16397]},
	{c: [4008, 16245]},
	{c: [4064, 16496]},
	{c: [4294, 16430]},
	{c: [5023, 16529]},
	{c: [5170, 16294]},
	{c: [11939, 20363]}, // southsun
	{c: [12032, 19858]},
	{c: [12530, 20204]},
	{c: [13142, 20027]},
	{c: [13293, 20430]},
	{c: [12830, 20241]},
	{c: [21241, 9412]}, // frostgorge
	{c: [21321, 8478]},
	{c: [21813, 8866]},
	{c: [22325, 9042]},
	{c: [22965, 9086]},
	{c: [23446, 9405]},
	{c: [23551, 8690]},
	{c: [11123, 24294]}, // malchor
	{c: [11615, 24632]},
	{c: [11766, 24151]},
	{c: [11812, 25099]},
	{c: [12618, 24950]},
	{c: [13464, 24281]},
	{c: [13546, 24793]},
	{c: [13320, 23362]},
	{c: [13851, 23643]},
	{c: [13972, 24954]},
	{c: [14207, 24067]},
	{c: [10324, 25702]}, // cursed
	{c: [10578, 27706]},
	{c: [10849, 25595]},
	{c: [11197, 28168]},
	{c: [11500, 25959]},
	{c: [11885, 28403]}
	]
},
Quartz: {
	name_en: "Quartz",
	name_de: "Quarz",
	name_es: "Cuarzo",
	name_fr: "Quartz",
	type: "Metal",
	item: "43773",
	riches: [
	{c: [11519, 10456]}, // divinity
	{c: [5373, 16541]}, // dry
	{c: [5347, 16621], p: [[5235,16353],[5287,16425],[5303,16567],[5314,16607],[5351,16556],[5402,16493],[5481,16448],[5504,16459],[5489,16524],[5373,16614]]},
	{c: [4529, 16799]}
	],
	regulars: [
	
	]
},
Hotspot: {
	name_en: "Hotspot",
	name_de: "Hotspot",
	name_es: "Puntocaliente",
	name_fr: "Pointchaud",
	type: "Metal",
	item: null,
	regulars: [
	{c: [14426, 11102]}, // gendarran
	{c: [16209, 17505]}, // bloodtide
	{c: [16991, 16085]},
	{c: [16699, 15999]},
	{c: [17130, 17359]},
	{c: [20412, 22297]}, // maelstrom
	{c: [18121, 22874]},
	{c: [19623, 21910]},
	{c: [20102, 21960]},
	{c: [19917, 16932]}, // dredgehaunt
	{c: [21074, 17050]},
	{c: [21048, 15718]},
	{c: [19430, 19379]}, // timberline
	{c: [19891, 20966]},
	{c: [20732, 19382]},
	{c: [22738, 9023]}, // frostgorge
	{c: [29741, 17577]}, // fields
	{c: [30717, 12686]}, // blazeridge
	{c: [30937, 16047]},
	{c: [30303, 15432]},
	{c: [29410, 12779]},
	{c: [27550, 12545]}, // marches
	{c: [28843, 12540]},
	{c: [12702, 24562]}, // malchor
	{c: [13035, 24669]},
	{c: [13935, 24845]},
	{c: [11992, 24809]},
	{c: [11035, 27095]} // cursed
	]
},
Poultry: {
	name_en: "Poultry",
	name_de: "Geflügelfleisch",
	name_es: "Avecarne",
	name_fr: "Volaille",
	type: "Metal",
	item: "24360",
	regulars: [
	{c: [27758, 11288]}, // marches
	{c: [27805, 11398]},
	{c: [27862, 11429]},
	{c: [27660, 11413]}
	]
},
/* =============================================================================
 * @@WOOD
 * ========================================================================== */
Green: {
	name_en: "Green",
	name_de: "Grüner",
	name_es: "Verde",
	name_fr: "Vert",
	type: "Wood",
	item: "19723",
	zones: ["metrica", "caledon", "brisban", "queensdale", "kessex", "wayfarer", "snowden", "ashford", "diessa"],
	offset: [0, 128]
},
Soft: {
	name_en: "Soft",
	name_de: "Geschmeidiger",
	name_es: "Blanda",
	name_fr: "Tendre",
	type: "Wood",
	item: "19726",
	zones: ["brisban", "kessex", "gendarran", "harathi", "snowden", "lornar", "diessa", "fields"],
	offset: [128, 0]
},
Seasoned: {
	name_en: "Seasoned",
	name_de: "Abgelagerter",
	name_es: "Curtida",
	name_fr: "Séché",
	type: "Wood",
	item: "19727",
	zones: ["harathi", "bloodtide", "lornar", "dredgehaunt", "timberline", "fields", "blazeridge", "marches"],
	offset: [0, -128]
},
Hard: {
	name_en: "Hard",
	name_de: "Harter",
	name_es: "Sólida",
	name_fr: "Dur",
	type: "Wood",
	item: "19724",
	zones: ["sparkfly", "maelstrom", "bloodtide", "timberline", "fireheart", "marches"],
	offset: [-128, 0]
},
Elder: {
	name_en: "Elder",
	name_de: "Alter",
	name_es: "Ancestral",
	name_fr: "Ancestral",
	type: "Wood",
	item: "19722",
	riches: [
	{c: [15575, 24851]}, // straits
	{c: [13808, 24941]} // malchor
	],
	regulars: [
	{c: [20165, 21981]}, // maelstrom
	{c: [5467, 16325]}, // dry
	{c: [5042, 16462]},
	{c: [4868, 16054]},
	{c: [4052, 16277]}
	]
},
Ancient: {
	name_en: "Ancient",
	name_de: "Antiker",
	name_es: "Antigua",
	name_fr: "Ancien",
	type: "Wood",
	item: "19725",
	riches: [
	
	],
	regulars: [
	{c: [4135, 14680]}, // silver
	{c: [4504, 16715]}, // dry
	{c: [4541, 15930]},
	{c: [4551, 16215]},
	{c: [5063, 16666]},
	{c: [5097, 14280]},
	{c: [5320, 16589]},
	{c: [12214, 20258]}, // southsun
	{c: [12274, 19941]},
	{c: [12620, 20289]},
	{c: [12906, 19772]},
	{c: [13161, 19435]},
	{c: [12519, 20405]},
	{c: [21241, 8590]}, // frostgorge
	{c: [21319, 9152]},
	{c: [22779, 8416]},
	{c: [22397, 9072]},
	{c: [22503, 8973]},
	{c: [23027, 9141]},
	{c: [23388, 9371]},
	{c: [23612, 8600]},
	{c: [12614, 23543]}, // malchor
	{c: [12339, 24633]},
	{c: [13155, 24745]},
	{c: [14041, 24646]},
	{c: [10566, 26077]}, // cursed
	{c: [10967, 27113]},
	{c: [11134, 28079]},
	{c: [11750, 28675]}
	]
},
Foxfire: {
	name_en: "Foxfire",
	name_de: "Leuchtpilz",
	name_es: "Luminiscentes",
	name_fr: "Bioluminescent",
	type: "Wood",
	item: "66933",
	riches: [
	{c: [15625, 24851]}, // straits
	{c: [13858, 24941]} // malchor
	],
	regulars: [
	{c: [20215, 21981]} // maelstrom
	]
},
/* =============================================================================
 * @@PLANT
 * ========================================================================== */
Lettuce: {
	name_en: "Lettuce",
	name_de: "Salatkopf",
	name_es: "Lechuga",
	name_fr: "Laitue",
	type: "Plant",
	item: "12238",
	riches: [
	{c: [4031, 15893]}, // dry
	{c: [10569, 16278]}, // caledon
	{c: [13101, 12254], q: 9} // queensdale
	],
	regulars: [
		
	]
},
Potato: {
	name_en: "Potato",
	name_de: "Kartoffel",
	name_es: "Patata",
	name_fr: "Patate",
	type: "Plant",
	item: "12135",
	riches: [
	{c: [8860, 19448], q: 8}, // metrica
	{c: [21930, 13888]}, // wayfarer
	{c: [28359, 15491]} // ashford
	],
	regulars: [
		
	]
},
Strawberry: {
	name_en: "Strawberry",
	name_de: "Erdbeere",
	name_es: "Fresa",
	name_fr: "Fraise",
	type: "Plant",
	item: "12253",
	riches: [
	{c: [13175, 15839], q: 8, p: [[12782,15590],[13060,15897],[13140,15902],[13150,15864]]}, // kessex
	{c: [20960, 13010], q: 8, p: [[21176,12725],[21085,12859],[21049,12878],[21031,12991],[20989,13005]]}, // snowden
	{c: [23636, 13436], q: 8, p: [[24142,13298],[24000,13297],[23826,13445],[23759,13450],[23740,13468],[23730,13538],[23760,13531],[23742,13529],[23713,13538],[23706,13555],[23691,13542],[23694,13518],[23647,13459]]} // diessa
	],
	regulars: [
		
	]
},
Spinach: {
	name_en: "Spinach",
	name_de: "Spinat",
	name_es: "Espinaca",
	name_fr: "Épinard",
	type: "Plant",
	item: "12241",
	riches: [
	{c: [9115, 17065], q: 9, p: [[9070,16326],[9101,16452],[9103,16590],[9153,16674],[9084,16844],[9108,17037]]}, // brisban
	{c: [15420, 12390], p: [[15762,12465],[15606,12370],[15520,12414],[15447,12411]]} // gendarran
	],
	regulars: [
		
	]
},
Grape: {
	name_en: "Grape",
	name_de: "Traube",
	name_es: "Uva",
	name_fr: "Raisin",
	type: "Plant",
	item: "12341",
	riches: [
	{c: [17801, 17397], q: 8}, // lornar
	{c: [31099, 19162], q: 8} // fields
	],
	regulars: [
		
	]
},
Cabbage: {
	name_en: "Cabbage",
	name_de: "Kohlkopf",
	name_es: "Repollo",
	name_fr: "Chou",
	type: "Plant",
	item: "12332",
	riches: [
	{c: [4001, 15893]}, // dry
	{c: [13880, 11060], q: 8}, // harathi
	{c: [21212, 16264]}, // dredgehaunt
	{c: [30955, 13247], q: 8} // blazeridge
	],
	regulars: [
		
	]
},

Pearlclam: {
	name_en: "Pearlclam",
	name_de: "Perlemuschel",
	name_es: "Almejaperla",
	name_fr: "Palourdeperle",
	type: "Plant",
	item: "24500",
	riches: [
	{c: [8515, 16658]} // brisban
	],
	regulars: [
		
	]
},
Vanilla: {
	name_en: "Vanilla",
	name_de: "Vanille",
	name_es: "Vainilla",
	name_fr: "Vanille",
	type: "Plant",
	item: "12234",
	riches: [
	
	],
	regulars: [
	{c: [19833, 22345]}, // maelstrom
	{c: [19839, 22821]},
	{c: [20567, 22235]}
	]
},
Pumpkin: {
	name_en: "Pumpkin",
	name_de: "Zuckerkürbis",
	name_es: "Calabaza",
	name_fr: "Potiron",
	type: "Plant",
	item: "12538",
	riches: [
	{c: [17405, 17510], q: 8, p: [[17217,17047],[17191,17259],[17362,17344],[17313,17392],[17403,17441],[17327,17471],[17379,17496]]}, // bloodtide
	{c: [27484, 10330], q: 8} // blazeridge
	],
	regulars: [
		
	]
},
Cauliflower: {
	name_en: "Cauliflower",
	name_de: "Blumenkohl",
	name_es: "Coliflor",
	name_fr: "Chou-fleur",
	type: "Plant",
	item: "12532",
	riches: [
	{c: [15620, 19894], q: 8}, // sparkfly
	{c: [19176, 19194], q: 8} // timberline
	],
	regulars: [
		
	]
},
Butternut: {
	name_en: "Butternut",
	name_de: "Butternuss",
	name_es: "Moscada",
	name_fr: "Courge",
	type: "Plant",
	item: "12511",
	riches: [
	{c: [23316, 10718], q: 8}, // frostgorge
	{c: [24342, 11048], p: [[24381,10641],[24138,11101],[24279,11099],[24322,11070]]} // fireheart
	],
	regulars: [
		
	]
},
Artichoke: {
	name_en: "Artichoke",
	name_de: "Artischocke",
	name_es: "Alcachofa",
	name_fr: "Artichaut",
	type: "Plant",
	item: "12512",
	riches: [
	{c: [20076, 22914]}, // maelstrom
	{c: [17475, 22676]} // straits
	],
	regulars: [
		
	]
},
Lemongrass: {
	name_en: "Lemongrass",
	name_de: "Zitronengras",
	name_es: "Limoncillo",
	name_fr: "Citronnelle",
	type: "Plant",
	item: "12546",
	riches: [
	
	],
	regulars: [
	{c: [17164, 23181]}, // straits
	{c: [17327, 23028]},
	{c: [17242, 22984]},
	{c: [17140, 22859]},
	{c: [17322, 24257]}
	]
},
Snowtruffle: {
	name_en: "Snowtruffle",
	name_de: "Schneetrüffel",
	name_es: "Trufanieve",
	name_fr: "Truffeneiges",
	type: "Plant",
	item: "12144",
	riches: [
	
	],
	regulars: [
	{c: [23145, 10645]}, // frostgorge
	{c: [23133, 10791]},
	{c: [23326, 10474]},
	{c: [23609, 9576]},
	{c: [23128, 9280]}
	]
},
Truffle: {
	name_en: "Truffle",
	name_de: "Trüffel",
	name_es: "Trufa",
	name_fr: "Truffe",
	type: "Plant",
	item: "12545",
	riches: [
	
	],
	regulars: [
	{c: [15592, 25101]}, // straits
	{c: [15404, 25051]},
	{c: [14820, 24726]},
	{c: [14845, 24448]},
	{c: [11171, 26983]} // cursed
	]
},
Omnomberry: {
	name_en: "Omnomberry",
	name_de: "Omnombeere",
	name_es: "Omnom",
	name_fr: "Omnom",
	type: "Plant",
	item: "12128",
	riches: [
	
	],
	regulars: [
	{c: [12001, 24499]}, // malchor
	{c: [12873, 24592]},
	{c: [13230, 24861]},
	{c: [13983, 24719]},
	{c: [10567, 26268]}, // cursed
	{c: [11069, 27131]}
	]
},
Passiflora: {
	name_en: "Passiflora",
	name_de: "Maracujablüte",
	name_es: "Florpasión",
	name_fr: "Passiflore",
	type: "Plant",
	item: "37907",
	riches: [
	
	],
	regulars: [
	{c: [13627, 20330]}, // southsun
	{c: [13567, 20141]},
	{c: [13502, 19993]},
	{c: [13740, 19938]},
	{c: [13695, 19800]},
	{c: [13885, 20059]},
	{c: [13105, 19913]},
	{c: [13201, 19787]}
	]
},
Spore: {
	name_en: "Spore",
	name_de: "Spore",
	name_es: "Espora",
	name_fr: "Spore",
	type: "Plant",
	item: "48884",
	riches: [
	
	],
	regulars: [
	{c: [9786, 14384]}, // kessex
	{c: [9878, 14406]},
	{c: [9930, 14502]},
	{c: [9630, 14850]},
	{c: [9918, 14790]},
	{c: [9820, 15200]},
	{c: [10008, 15140]},
	{c: [10080, 15560]},
	{c: [10170, 15748]},
	{c: [10226, 14684]},
	{c: [10588, 14776]},
	{c: [10914, 14798]},
	{c: [11156, 14938]},
	{c: [11798, 14886]},
	{c: [12110, 14364]},
	{c: [12348, 14472]},
	{c: [12304, 15158]},
	{c: [12096, 15526]},
	{c: [12012, 15822]},
	{c: [13152, 14452]},
	{c: [13108, 14752]},
	{c: [12866, 15332]},
	{c: [12912, 15362]},
	{c: [12928, 15838]},
	{c: [13040, 15848]}
	]
}
};