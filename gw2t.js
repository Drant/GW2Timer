/*
	GW2Timer.com timer, map, and misc single-page application driver.
	jQuery-dependent (v1.11.0), with other plugins in plugins.js.
	Coded in NetBeans; debugged in Chrome Developer Tools.
	IDE recommended for viewing and collapsing code sections.
	Version: see int_utlProgramVersion - 2014.04.18 created

	CREDITS:
	Vladimir Agafonkin - LeafletJS map library
	Ben Alman - jQuery throttle/debounce
	Stephen Chapman - DST detection
	Craig Erskine - qTip tooltip
	David Flanagan - SVG clock based on example from "JavaScript The Definitive Guide 6e"
	Jon Rohan, James M. Greene - ZeroClipboard
	Hyunje Alex Jun - JS scroll bar
	Cliff Spradlin - GW2 API Documentation
	Google and ResponsiveVoice.JS - Text-To-Speech service

	CONVENTIONS:
	Local variables are all lower case: examplevariable
	Instance variables are lower camel case: exampleVariable
	Global variables are all caps spaced by underscore: EXAMPLE_VARIABLE
	Constants are camel case and starts with "c": cExampleVariable
	Objects are camel case: ExampleObject
	Array names are plural (end with s or es): exampleElements
	Functions are lower camel case and starts with a verb: getExample()
	(function(){ // blah })(); this is an anonymous self-executing function
	~~ operator (reverse bits twice) is shorthand for parseInt and is used in integer division
	Functions that are repeated in milliseconds should use core JS instead of jQuery
	Arguments in double quotes: $("argument"), single quotes for HTML generation
	Parameters are camel case and starts with "p": function(pExampleParameter)
	CSS classes and IDs are named like instance variables: exampleID
	Allman indentation (braces align vertically) unless it is repetitive code
	4 space-size tabs, you are free to Replace All tab characters with spaces

	TABLE OF CONTENTS (Ctrl+F "AtsignAtsignLetter" to jump to section)

	O - Options for user
	U - URL management
	X - Checklists
	E - Economy
	D - Dictionary for translations
	C - Chains events
	M - Map Leaflet
	P - Populate map
	G - Generated content
	W - World vs World
	T - Time utilities and schedule
	K - Clock ticker
	I - Interface UI

*/

$(window).on("load", function() {
	
/* =============================================================================
 * Single letter objects serve as namespaces.
 * ========================================================================== */
var O, U, X, E, D, C, M, P, G, W, T, K, I = {};

/* =============================================================================
 * @@Options for the user
 * ========================================================================== */
O = {
	
	lengthOfPrefixes: 3,
	prefixOption: "opt_",
	legalLocalStorageKeys: new Array(),
	isServerReset: false,

	/*
	 * These utility variables will also be stored in localStorage.
	 * O.Utilities, O.Options, and X.Checklists/Textlists share a namespace in
	 * localStorage and must together have unique variable names.
	 */
	Utilities:
	{
		programVersion: {key: "int_utlProgramVersion", value: 151004},
		lastLocalResetTimestamp: {key: "int_utlLastLocalResetTimestamp", value: 0},
		personalPins: {key: "str_utlPersonalPins", value: ""}
	},
	
	/*
	 * Updates and notifies user of version change.
	 */
	enforceProgramVersion: function()
	{
		var currentversion = O.Utilities.programVersion.value;
		var usersversion = parseInt(localStorage[O.Utilities.programVersion.key]);
		// If is a major version, not first visit, and version is mismatch, then notify new version
		if (isFinite(usersversion) && usersversion !== currentversion)
		{
			var wait = (I.ModeCurrent === I.ModeEnum.Overlay) ? 15 : 30;
			I.clear();
			I.greet(I.cSiteName + " was updated since your last visit.<br />"
				+ "This version: " + currentversion + "<br />"
				+ "Your version: " + usersversion + "<br />"
				+ "Would you like to see the <a class='urlUpdates' href='" + U.URL_META.News + "'>changes</a>?<br />"
				+ "<br />"
				+ "<b>Right click on the map</b> to see the new world completion features.<br />"
				+ "Use the <a class='urlUpdates' href='" + U.URL_META.Overlay + "'>GPS overlay app</a> for fast world completion!<br />"
				, wait);
			U.convertExternalLink(".urlUpdates");
		}
		
		localStorage[O.Utilities.programVersion.key] = O.Utilities.programVersion.value;
	},
	
	/*
	 * All of these options should have an associated input tag in the HTML that
	 * users interact with, and their IDs are in the form prefixOption + optionkey.
	 * Note the three letter prefix indicating the option's data type.
	 */
	Options:
	{
		// Enumeration is an exception, being set by URL only
		enu_Language: "en",
		enu_Server: "1008",
		// Timer
		bol_hideChecked: false,
		bol_expandWB: true,
		bol_collapseChains: true,
		int_setClock: 0,
		int_setDimming: 0,
		int_setPredictor: 0,
		// Panel
		bol_alignPanelRight: true,
		bol_showPanel: true,
		bol_showMap: true,
		bol_showDashboard: true,
		// Map
		int_setFloor: 1,
		bol_showZoneRectangles: false,
		bol_showPersonalPaths: true,
		bol_showChainPaths: true,
		bol_tourPrediction: true,
		bol_showWorldCompletion: false,
		bol_displaySectors: true,
		bol_displayWaypoints: true,
		bol_displayPOIs: true,
		bol_displayVistas: true,
		bol_displayChallenges: true,
		bol_displayHearts: true,
		bol_displayEvents: false,
		bol_showWorldCompletionWvW: false,
		bol_displaySectorsWvW: true,
		bol_displayWaypointsWvW: true,
		bol_displayPOIsWvW: true,
		bol_displayVistasWvW: true,
		bol_displayChallengesWvW: true,
		// GPS
		bol_displayCharacter: true,
		bol_followCharacter: true,
		bol_displayCharacterWvW: true,
		bol_followCharacterWvW: false,
		int_msecGPSRefresh: 100,
		// Alarm
		int_setAlarm: 0,
		int_setVolume: 100,
		bol_alertArrival: true,
		bol_alertAtStart: true,
		bol_alertAtEnd: true,
		bol_alertChecked: false,
		int_alertSubscribedFirst: 1,
		int_alertSubscribedSecond: 15,
		bol_alertAutosubscribe: true,
		bol_alertUnsubscribe: true,
		// Tools
		int_sizeNotepadFont: 12,
		int_sizeNotepadHeight: 400,
		// Trading
		bol_refreshPrices: true,
		bol_useMainTPSearch: true,
		int_numTradingCalculators: 25,
		int_numTradingResults: 30,
		int_secTradingRefresh: 60,
		// Advanced
		int_shiftLogin: 0,
		bol_clearChainChecklistOnReset: true,
		bol_clearPersonalChecklistOnReset: true,
		bol_use24Hour: true,
		bol_detectDST: true,
		bol_useSiteTag: true
	},
	/*
	 * All Options of a numeric type must have an associated legal range to be
	 * used in sanitation of user submitted ones. This object is updated by the
	 * function O.initializeOptions() that initializes HTML input tags.
	 */
	OptionRange: {},
	/*
	 * All Options of an enumerated type ("enu") must have a matching named
	 * object of enums here.
	 */
	LanguageCode:
	{
		// This enum corresponds to the language enum and is used for Google TTS
		en: "en-US",
		de: "de-DE",
		es: "es-ES",
		fr: "fr-FR",
		cs: "cs-CZ", // Unsupported
		it: "it-IT",
		pl: "pl-PL", // Unsupported
		pt: "pt-BR", // Unsupported
		ru: "ru-RU", // Unsupported
		zh: "zh-CN"
	},
	OptionEnum:
	{
		Language:
		{
			Default: "en",
			English: "en",
			German: "de",
			Spanish: "es",
			French: "fr",
			Czech: "cs",
			Italian: "it",
			Polish: "pl",
			Portuguese: "pt",
			Russian: "ru",
			Mandarin: "zh"
		},
		Server:
		{
			AnvilRock: "1001",
			BorlisPass: "1002",
			YaksBend: "1003",
			HengeofDenravi: "1004",
			Maguuma: "1005",
			SorrowsFurnace: "1006",
			GateofMadness: "1007",
			JadeQuarry: "1008",
			FortAspenwood: "1009",
			EhmryBay: "1010",
			StormbluffIsle: "1011",
			Darkhaven: "1012",
			SanctumofRall: "1013",
			CrystalDesert: "1014",
			IsleofJanthir: "1015",
			SeaofSorrows: "1016",
			TarnishedCoast: "1017",
			NorthernShiverpeaks: "1018",
			Blackgate: "1019",
			FergusonsCrossing: "1020",
			Dragonbrand: "1021",
			Kaineng: "1022",
			DevonasRest: "1023",
			EredonTerrace: "1024",
			FissureofWoe: "2001",
			Desolation: "2002",
			Gandara: "2003",
			Blacktide: "2004",
			RingofFire: "2005",
			Underworld: "2006",
			FarShiverpeaks: "2007",
			WhitesideRidge: "2008",
			RuinsofSurmia: "2009",
			SeafarersRest: "2010",
			Vabbi: "2011",
			PikenSquare: "2012",
			AuroraGlade: "2013",
			GunnarsHold: "2014",
			JadeSea: "2101",
			FortRanik: "2102",
			AuguryRock: "2103",
			VizunahSquare: "2104",
			Arborstone: "2105",
			Kodash: "2201",
			Riverside: "2202",
			ElonaReach: "2203",
			AbaddonsMouth: "2204",
			DrakkarLake: "2205",
			MillersSound: "2206",
			Dzagonur: "2207",
			BaruchBay: "2301"
		}
	},
	/*
	 * These enums correspond to radio buttons.
	 */
	IntEnum:
	{
		Predictor:
		{
			Auto: 0,
			Min: 1,
			MinAvg: 2,
			Avg: 3
		},
		Clock:
		{
			Compact: 0,
			Full: 1,
			Bar: 2,
			None: 3
		},
		Alarm:
		{
			Off: 0,
			Checklist: 1,
			Subscription: 2
		}
	},
	
	/*
	 * Checks if the specified value is in the enum object, and returns it
	 * if found, or returns the default if not.
	 * @param string pEnumName of the enum object.
	 * @param string pEnumValue to check.
	 * @returns string valid enum or the default.
	 */
	validateEnum: function(pEnumName, pValue)
	{
		var i;
		var enumobject = O.OptionEnum[U.getVariableSuffix(pEnumName)];
		for (i in enumobject)
		{
			if (enumobject[i] === pValue)
			{
				return pValue;
			}
		}
		return O.Options[pEnumName];
	},
	
	TypeEnum:
	{
		isBoolean: "bol",
		isInteger: "int",
		isFloat: "flt",
		isEnum: "enu",
		isString: "str"
	},
	
	/*
	 * Initializes the array of strings of legal localStorage variable keys so
	 * another function can later erase all unrecognized variables.
	 * @pre All legal variable keys are unique.
	 */
	initializeLegalLocalStorageKeys: function()
	{
		var i;
		for (i in O.Utilities)
		{
			O.legalLocalStorageKeys.push(O.Utilities[i].key);
		}
		for (i in O.Options)
		{
			O.legalLocalStorageKeys.push(i);
		}
		for (i in X.Checklists)
		{
			O.legalLocalStorageKeys.push(X.Checklists[i].key);
		}
		for (i in X.Collectibles)
		{
			O.legalLocalStorageKeys.push(X.Collectibles[i].key);
		}
		for (i in X.Textlists)
		{
			O.legalLocalStorageKeys.push(X.Textlists[i].key);
		}
	},
	
	/*
	 * Checks localStorage for unrecognized variables and removes them.
	 */
	cleanLocalStorage: function()
	{
		var i, ii;
		var key;
		var match;
		for (i = 0; i < localStorage.length; i++)
		{
			key = localStorage.key(i);
			for (ii in O.legalLocalStorageKeys)
			{
				if (key === O.legalLocalStorageKeys[ii])
				{
					match = true;
					break;
				}
			}
			if (match !== true)
			{
				localStorage.removeItem(key);
			}
			else
			{
				match = false;
			}
		}
	},
	
	/*
	 * localStorage stores everything as string. This function converts the
	 * data back to the proper type.
	 * @param string pString localStorage value.
	 * @returns proper type of value.
	 */
	convertLocalStorageDataType: function(pString)
	{
		var s = pString.toLowerCase();
		if (s === "true")
		{
			return true;
		}
		if (s === "false")
		{
			return false;
		}
		if (isFinite(s)) // Is a number
		{
			if (s % 0 === 0) // Integer shouldn't have a remainder
			{
				return parseInt(s);
			}
			return parseFloat(s);
		}
		return pString;
	},
	
	/*
	 * Gets the length of a uniform associative array object.
	 * @param object pObject to count.
	 * @returns int number of subobjects in object.
	 */
	getObjectLength: function(pObject)
	{
		var count = 0;
		for (var i in pObject)
		{
			count++;
		}
		return count;
	},
	
	/*
	 * Converts an integer to boolean.
	 * @param int pInteger to convert.
	 * @returns boolean true only if integer is greater than 0.
	 */
	intToBool: function(pInteger)
	{
		if (pInteger > 0)
		{
			return true;
		}
		return false;
	},
	boolToInt: function(pBoolean)
	{
		if (pBoolean)
		{
			return 1;
		}
		return 0;
	},
	stringToBool: function(pString)
	{
		if (pString.toLowerCase() === "true")
		{
			return true;
		}
		return false;
	},
	boolToString: function(pBoolean)
	{
		if (pBoolean)
		{
			return "true";
		}
		return "false";
	},
	randomBool: function()
	{
		return (Math.random() > 0.5) ? true : false;
	},
	isInteger: function(pValue)
	{
		return !isNaN(pValue) && (function(x) { return (x | 0) === x; })(parseFloat(pValue));
	},
	
	/*
	 * Returns false if object is undefined or null or falsy, otherwise true.
	 * @param object pObject to test.
	 * @returns boolean whether object exists.
	 */
	objToBool: function(pObject)
	{
		if (pObject)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Sets the local reset timestamp to the current time.
	 */
	updateLocalResetTimestamp: function()
	{
		O.Utilities.lastLocalResetTimestamp.value = T.getUNIXSeconds();
		localStorage[O.Utilities.lastLocalResetTimestamp.key] = O.Utilities.lastLocalResetTimestamp.value;
	},
	
	/*
	 * Compares the local reset timestamp with yesterday's server reset time
	 * (Midnight 00:00 UTC) and do clearings if so.
	 * @param Date pDate.
	 */
	checkResetTimestamp: function(pDate)
	{
		var midnightoffset = T.getTimeSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Seconds);
		var yesterdaysserverresettime = T.getUNIXSeconds() - midnightoffset;
		var lastweeksserverresettime = yesterdaysserverresettime - (T.cSECONDS_IN_DAY * pDate.getUTCDay());
		var isdailyreset = (midnightoffset === 0);
		var isweeklyreset = (O.Utilities.lastLocalResetTimestamp.value < lastweeksserverresettime);
		
		// Local reset timestamp is outdated if it's before yesterday's server reset time
		if (O.Utilities.lastLocalResetTimestamp.value < yesterdaysserverresettime)
		{
			O.clearServerSensitiveOptions(isdailyreset, isweeklyreset);
		}
	},
	
	/*
	 * Gets the index of a checked radio button within a fieldset of radio buttons.
	 * @pre Radio buttons are inside a fieldset with the same "name" attribute.
	 * @returns int 0-based index of radio button.
	 */
	getIndexOfSelectedRadioButton: function(pName)
	{
		var radiobuttons = $("fieldset[name=" + pName + "] " + "input:radio[name=" + pName + "]");
		return radiobuttons.index(radiobuttons.filter(":checked"));
	},
	
	/*
	 * Sets the HTML input tag values to the localStorage's or the defaults here.
	 * URLArguments with same Options object's keys (if available) will override both.
	 * @pre The tags are preloaded (not AJAX) and URLArguments was initialized.
	 */
	initializeOptions: function()
	{
		O.initializeLegalLocalStorageKeys();

		var optionkey;
		var inputtype;
		var variabletype;
		// Load or initialize input options
		for (optionkey in O.Options)
		{
			/*
			 * Initialize legal numeric values by looking up the associated
			 * input tag.
			 */
			$("#" + O.prefixOption + optionkey).each(function()
			{
				inputtype = $(this).attr("type");
				variabletype = U.getVariablePrefix(optionkey);
				if (inputtype === "radio")
				{
					// Range shall be 0 to how many radio buttons there are minus one
					O.OptionRange[optionkey] = new Array(0,
						$("fieldset[name=" + optionkey + "] input").length - 1);
				}
				else if (inputtype === "number" || inputtype === "range")
				{
					O.OptionRange[optionkey] = new Array($(this).prop("min"), $(this).prop("max"));
				}
			});
			
			/*
			 * URLArguments overrides localStorage, which overrides Options here
			 * only if such an Options variable exists. If program is embedded
			 * then URLArguments overrides Options only, and user preferences
			 * (localStorage) will not modified.
			 */
			if (I.isProgramEmbedded)
			{
				if (U.Args[optionkey] !== undefined)
				{
					O.Options[optionkey] = O.convertLocalStorageDataType(
						U.sanitizeURLOptionsValue(optionkey, U.Args[optionkey]));
				}
			}
			else
			{
				if (U.Args[optionkey] !== undefined)
				{
					// Override localStorage
					localStorage[optionkey] = U.sanitizeURLOptionsValue(
						optionkey, U.Args[optionkey]);
				}

				// Assign default values to localStorage if they are empty
				if (localStorage[optionkey] === undefined)
				{
					localStorage[optionkey] = O.Options[optionkey];
				}
				else
				{	// Else user set options from localStorage become the new options
					O.Options[optionkey] = O.convertLocalStorageDataType(localStorage[optionkey]);
				}
			}
			
			// Update the inputs of specific types, this "loop" runs once
			$("#" + O.prefixOption + optionkey).each(function()
			{
				// Assign the retrieved values to the input tags
				inputtype = $(this).attr("type");
				variabletype = U.getVariablePrefix(optionkey);
				if (inputtype === "checkbox")
				{
					$(this).prop("checked", O.Options[optionkey]);
				}
				else if (inputtype === "number" || inputtype === "range")
				{
					$(this).val(O.Options[optionkey]);
				}
				else if (inputtype === "radio")
				{
					// Check the radio button of that index (int)
					$("input:radio[name=" + optionkey + "]:eq(" + O.Options[optionkey] + ")")
						.prop("checked", true);
				}
				
				/*
				 * Bind simple event handlers to each input tags that writes
				 * the value of the input to the options and localStorage.
				 * Note that the optionkey local variable was not reused here
				 * because this is the scope of the input's event! Have to use
				 * separate variables.
				 */
				if (inputtype === "radio")
				{
					/*
					 * Radio buttons are a special case because they are multiple
					 * input tags. They must be wrapped in a fieldset and all be
					 * given the same name attribute. One button shall hold the
					 * unique ID so the group will only be iterated once.
					 */
					$("fieldset[name=" + optionkey + "]").change(function()
					{
						var thisoptionkey = $(this).attr("name");
						O.Options[thisoptionkey] = O.getIndexOfSelectedRadioButton(thisoptionkey);
						localStorage[thisoptionkey] = O.Options[thisoptionkey];
					});
				}
				else
				{
					$(this).change(function()
					{
						var thisinputtype = $(this).attr("type");
						var thisoptionkey = $(this).attr("id").slice(O.prefixOption.length);
						
						if (thisinputtype === "checkbox")
						{
							O.Options[thisoptionkey] = $(this).prop("checked");
						}
						else if (thisinputtype === "number" || thisinputtype === "range")
						{
							// These inputs can have custom text, so sanitize them first
							var value = $(this).val();
							var integer = parseInt(value);
							if (isFinite(value) && integer >= O.OptionRange[thisoptionkey][0]
								&& integer <= O.OptionRange[thisoptionkey][1])
							{
								O.Options[thisoptionkey] = integer;
							}
							else
							{
								// Load default value if not an integer within range
								O.Options[thisoptionkey] = O.OptionRange[thisoptionkey][0];
							}
							$(this).val(O.Options[thisoptionkey]);
						}
						else
						{
							O.Options[thisoptionkey] = $(this).val();
						}
						
						localStorage[thisoptionkey] = O.Options[thisoptionkey];
					});
				}
			});
		}
		
		// Supplementary event handlers for some inputs
		O.bindOptionsInputs();
		U.initializeAPIURLs();
	},
	
	/*
	 * Unchecks the time sensitive checklists and clear variables, ignoring
	 * the disabled/deleted ones by the user.
	 * @param boolean pIsReset whether the program was running during server reset.
	 */
	clearServerSensitiveOptions: function(pIsDaily, pIsWeekly)
	{
		O.isServerReset = true;
		// Notify of the reset in console
		var messagetime = 10;
		var dailymessage = pIsDaily ? "Daily Reset!" : "Daily Timestamp Expired!";
		I.greet(dailymessage, messagetime);
		if (pIsWeekly)
		{
			var weeklymessage = pIsDaily ? "Weekly Reset!" : "Weekly Timestamp Expired!";
			I.greet(weeklymessage, messagetime);
		}
		
		// Chains checklist
		var i;
		var chain;
		var time;
		if (O.Options.bol_clearChainChecklistOnReset)
		{
			for (i in C.Chains)
			{
				chain = C.Chains[i];
				$("#chnCheck_" + chain.nexus).removeClass("chnChecked");
				$("#chnBar_" + chain.nexus).css({opacity: 1});
				if (X.getChecklistItem(X.Checklists.Chain, chain.nexus) !== X.ChecklistEnum.Disabled)
				{
					$("#chnBar_" + chain.nexus).show();
				}
			}
			X.clearChecklist(X.Checklists.Chain, X.ChecklistJob.UncheckTheChecked);
		}
		
		// Subscribe to daily chain
		if (O.Options.bol_alertAutosubscribe &&
			O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription)
		{
			C.updateChainToday();
			if (C.ChainToday)
			{
				time = $("#chnTime_" + C.ChainToday.nexus);
				if ( ! time.hasClass("chnTimeSubscribed"))
				{
					time.trigger("click");
				}
			}
		}
		
		// Dungeon and Personal Checklists
		if (O.Options.bol_clearPersonalChecklistOnReset)
		{
			X.clearCustomChecklistDaily();
			// Weekly reset is at UTC midnight on the start of Sunday
			if (pIsWeekly)
			{
				X.clearCustomChecklistWeekly();
			}
		}
		// Login rewards and dailies calendar
		if (I.isSectionLoaded_Daily)
		{
			G.shiftLoginTrack();
			G.regenerateDailiesCalendar();
		}
		
		// Finally
		I.write("", messagetime);
		O.updateLocalResetTimestamp();
	},
	
	/*
	 * Binds custom event handlers for options that need immediate visual effect.
	 */
	bindOptionsInputs: function()
	{
		var i;
		// The Enact object has functions with the same name as the Options variables
		for (i in O.Enact)
		{
			(function(pFunction){
				var query;
				var htmlid = O.prefixOption + pFunction;
				var thisinputtype = $("#" + htmlid).attr("type");
				if (thisinputtype === "radio")
				{
					query = "fieldset[name=" + pFunction + "]";
				}
				else
				{
					query = "#" + htmlid;
				}
				
				$(query).change(function()
				{
					O.Enact[pFunction]();
				});
			})(i);
		}
		// POIs are created on site load
		$("#opt_bol_showWorldCompletion").change(function()
		{
			if (O.Options.bol_showWorldCompletion === true
				&& M.isMappingIconsGenerated === false)
			{
				location.reload();
			}
			if (O.Options.bol_showWorldCompletion === false)
			{
				M.toggleLayer(M.Layer.Overview, false);
			}
			
			$("#mapOptionsCompletion label input").each(function()
			{
				X.setCheckboxEnumState($(this), X.boolToChecklistEnum(O.Options.bol_showWorldCompletion));
			});
		});
		$("#opt_bol_displayEvents").change(function()
		{
			if (O.Options.bol_displayEvents === true
				&& M.isEventIconsGenerated === false)
			{
				location.reload();
			}
			if (M.isEventIconsGenerated)
			{
				M.refreshCurrentZone();
			}
		});
		// Trigger zone in and out of current zone to toggle the icon's display
		$("#mapOptionsCompletion label input").each(function()
		{
			$(this).change(function()
			{
				if (M.isAPIRetrieved_MAPFLOOR)
				{
					M.refreshCurrentZone();
				}
			});
		});
		/*
		 * Run some enactors when the site loads (because this an initializer function).
		 * Will have to place it elsewhere if it requires data to be loaded first.
		 */
		O.Enact.int_setAlarm();
		O.Enact.bol_detectDST();
		O.Enact.bol_useSiteTag();
		O.Enact.bol_alignPanelRight(true);
		O.Enact.bol_showPanel();
		if (I.ModeCurrent !== I.ModeEnum.Simple & I.ModeCurrent !== I.ModeEnum.Tile)
		{
			O.Enact.int_setClock();
			O.Enact.int_setDimming();
			O.Enact.bol_showMap();
		}
		
		/*
		 * Button event handlers bindings (buttons don't have stored values).
		 * ---------------------------------------------------------------------
		 */
		
		/*
		 * Clears the checklist including the deleted chain.
		 */
		$("#optRestoreAllChains").click(function()
		{
			var chain;
			var display = (I.ModeCurrent === I.ModeEnum.Tile) ? "inline-block" : "block";
			for (var i in C.Chains)
			{
				chain = C.Chains[i];
				$("#chnCheck_" + chain.nexus).removeClass("chnChecked");
				$("#chnBar_" + chain.nexus).show().css({opacity: 1}).css({display: display});
				if (C.isTimetableGenerated)
				{
					$(".chnSlot_" + chain.nexus).show().css({opacity: 1}).css({display: display})
						.find(".chnCheck").removeClass("chnChecked");
				}
			}
			X.clearChecklist(X.Checklists.Chain);
			// Also unfade the clock icons, which are the current first four bosses
			for (i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
			{
				K.checkoffChainIcon(T.getStandardChain(i).nexus);
				var chainhardcore = T.getHardcoreChain(i);
				if (chainhardcore)
				{
					K.checkoffChainIcon(chainhardcore.nexus);
				}
			}
		});
		$("#optChainsExpand").click(function()
		{
			$(".chnDetails").show();
		});
		$("#optChainsCollapse").click(function()
		{
			$(".chnDetails").hide();
			I.scrollToElement($("#plateChains"));
		});
		
		/*
		 * Clears the browser storage.
		 */
		$("#optClearLocalStorage").click(function()
		{
			if (confirm(I.cSiteName + " Reset: This is will clear all options and everything you have written in this website. Continue?"))
			{
				localStorage.clear();
				location.reload();
			}
		});
		
		/*
		 * Prints the browser storage to HTML console.
		 */
		$("#optPrintLocalStorage").click(function()
		{
			var i;
			var keys = new Array();
			// Gather the keys
			for (i = 0; i < localStorage.length; i++)
			{
				var key = U.escapeHTML(localStorage.key(i));
				keys.push(key);
			}
			// Sort them alphabetically
			keys.sort();
			
			var s = "";
			// Print the key-value pairs by the key's order
			for (i in keys)
			{
				var value = U.escapeHTML(localStorage.getItem(keys[i]));
				s += keys[i] + ": " + value + "<br />";
			}
			
			I.write(s, 30, true);
		});
	},
	
	/*
	 * Functions to enact the options, for which a simple variable change is
	 * not enough. Placed inside an object so they can be iterated.
	 * -------------------------------------------------------------------------
	 */
	Enact:
	{
		int_setAlarm: function()
		{
			var icon = "img/ui/placeholder.png";
			switch (O.Options.int_setAlarm)
			{
				case O.IntEnum.Alarm.Checklist: icon = "img/ui/check.png"; break;
				case O.IntEnum.Alarm.Subscription: icon = "img/ui/subscription.png"; break;
			}
			if (O.Options.int_setAlarm === O.IntEnum.Alarm.Off)
			{
				$("#optAlarmSpeaker").attr("src", "img/ui/mute.png");
			}
			else
			{
				$("#optAlarmSpeaker").attr("src", "img/ui/speaker.png");
			}
			$("#optAlarmIcon").attr("src", icon);
		},
		int_setVolume: function()
		{
			if (D.isSpeaking() === false)
			{
				D.speak(D.getWord("alarm"));
			}
		},
		bol_hideChecked: function()
		{
			$(".chnBar").each(function()
			{
				X.hideCheckedChainBar(U.getSubintegerFromHTMLID($(this)));
			});
		},
		bol_expandWB: function()
		{
			for (var i in C.CurrentChains)
			{
				if (C.isChainRegular(C.CurrentChains[i]))
				{
					$("#chnDetails_" + C.CurrentChains[i].nexus).toggle(O.Options.bol_expandWB);
				}
			}
		},
		bol_use24Hour: function()
		{
			C.initializeTimetableHTML();
			C.updateChainsTimeHTML();
			K.updateDigitalClockMinutely();
		},
		bol_detectDST: function()
		{
			T.checkDST();
		},
		int_setClock: function()
		{
			K.setClock();
		},
		int_setDimming: function()
		{
			switch (O.Options.int_setDimming)
			{
				case 1: $("#paneClockBackground").css({opacity: 1}); break;
				case 2: $("#paneClockBackground").css({opacity: 0}); break;
			}
		},
		int_setFloor: function()
		{
			M.changeFloor(O.Options.int_setFloor);
		},
		bol_showZoneRectangles: function()
		{
			M.toggleLayer(M.Layer.ZoneRectangle, O.Options.bol_showZoneRectangles);
		},
		bol_showPersonalPaths: function()
		{
			if (M.isMapInitialized)
			{
				M.drawPersonalPath();
			}
			if (W.isMapInitialized)
			{
				W.drawPersonalPath();
			}
		},
		bol_showChainPaths: function()
		{
			M.toggleLayerArray(P.LayerArray.ChainPath, O.Options.bol_showChainPaths);
		},
		bol_displayCharacter: function()
		{
			if ( ! O.Options.bol_displayCharacter)
			{
				M.movePin(M.Pin.Character);
				M.movePin(M.Pin.Camera);
			}
			else
			{
				M.tickGPS();
				M.updateCharacter(0);
			}
		},
		bol_showPanel: function()
		{
			if (O.Options.bol_showMap && I.isMapEnabled) // Only hide panel if map is visible
			{
				$("#panelApp").toggle(O.Options.bol_showPanel);
				M.refreshMap();
				if (W.isMapInitialized)
				{
					W.refreshMap();
				}
			}
		},
		bol_alignPanelRight: function(pInitial)
		{
			if (I.isMapEnabled)
			{
				if (O.Options.bol_alignPanelRight)
				{
					// Don't realign if this function is called initially, because this is the default alignment
					if (pInitial !== true)
					{
						$("#panelApp").insertAfter("#panelMap");
						$(".paneApp").css({
							right: "0px",
							borderLeft: "1px solid #444",
							borderRight: "none",
							boxShadow: "-5px 0px 5px #223"
						});
						$("#itemLanguagePopup").css({ left: "-98px" });
						$("#cslContent").css({ left: "24px" });
					}
				}
				else
				{
					$("#panelApp").insertBefore("#panelMap");
					$(".paneApp").css({
						right: "auto",
						borderLeft: "none",
						borderRight: "1px solid #444",
						boxShadow: "5px 0px 5px #223"
					});
					$("#itemLanguagePopup").css({ left: "64px" });
					$("#cslContent").css({ left: I.cPANEL_WIDTH + 24 + "px" });
				}
			}
		},
		bol_showMap: function()
		{
			if (I.isMapEnabled)
			{
				$("#panelMap").toggle(O.Options.bol_showMap);
				M.refreshMap();
			}
		},
		bol_refreshPrices: function()
		{
			if (O.Options.bol_refreshPrices && E.isTradingCalculatorsInitialized)
			{
				E.loopRefresh();
			}
			else
			{
				E.cancelLoopRefresh();
			}
		},
		int_shiftLogin: function()
		{
			G.shiftLoginTrack();
		},
		bol_useSiteTag: function()
		{
			if (O.Options.bol_useSiteTag)
			{
				I.siteTagCurrent = I.siteTagDefault;
			}
			else
			{
				I.siteTagCurrent = "";
			}
		}
	}
};

/* =============================================================================
 * @@URL management for links and string manipulation
 * ========================================================================== */
U = {
	
	URL_META:
	{
		News: "http://forum.renaka.com/topic/5500046/",
		Overlay: "http://forum.renaka.com/topic/5546166/"
	},
	
	URL_API:
	{
		// Map
		TilesTyria: "https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg",
		MapFloorTyria: "https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=2",
		TilesMists: "https://tiles.guildwars2.com/2/1/{z}/{x}/{y}.jpg",
		MapFloorMists: "https://api.guildwars2.com/v1/map_floor.json?continent_id=2&floor=1",
		MapsList: "https://api.guildwars2.com/v1/maps.json",
		EventNames: "https://api.guildwars2.com/v1/event_names.json",
		EventDetails: "https://api.guildwars2.com/v1/event_details.json",
		
		// Exchange
		ItemListing: "https://api.guildwars2.com/v2/commerce/listings/",
		ItemPrices: "https://api.guildwars2.com/v2/commerce/prices/",
		ItemDetails: "https://api.guildwars2.com/v2/items/",
		ItemRender: "https://render.guildwars2.com/file/",
		CoinPrice: "https://api.guildwars2.com/v2/commerce/exchange/gems?quantity=",
		GemPrice: "https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=",
		ItemSearch: "http://www.gw2spidy.com/api/v0.9/json/item-search/",
		ItemSearchFallback: "http://www.gw2shinies.com/api/json/idbyname/",
		ItemData: "http://www.gw2spidy.com/api/v0.9/json/item/",
		
		// WvW
		Matches: "https://api.guildwars2.com/v1/wvw/matches.json",
		MatchDetails: "https://api.guildwars2.com/v1/wvw/match_details.json?match_id=",
		GuildDetails: "https://api.guildwars2.com/v1/guild_details.json?guild_id="
	},
	
	URL_IMG:
	{
		Placeholder: "img/ui/placeholder.png",
		Waypoint: "img/map/waypoint.png",
		WaypointOver: "img/map/waypoint_h.png",
		Landmark: "img/map/landmark.png",
		LandmarkOver: "img/map/landmark_h.png",
		Vista: "img/map/vista.png",
		Challenge: "img/map/challenge.png",
		Heart: "img/map/heart.png"
	},
	
	URL_DATA:
	{
		WvW: "data/wvw.js",
		Itinerary: "data/itinerary.js",
		// Data to load when opening a map section
		DryTop: "data/drytop.js",
		Resource: "data/resource.js",
		JP: "data/jp.js",
		Collectible: "data/collectible.js",
		Guild: "data/guild.js"
	},
	
	initializeAPIURLs: function()
	{
		var lang = D.getPartiallySupportedLanguage();
		U.URL_API.MapFloorTyria += "&lang=" + lang;
		U.URL_API.MapFloorMists += "&lang=" + lang;
		U.URL_API.EventNames += "?lang=" + lang;
	},

	/*
	 * URLArguments (Args) may contain Options object's variables. In the form of:
	 * http://example.com/?ExampleKey=ExampleValue&MoreExampleKey=MoreExampleValue
	 * so if a user enters http://gw2timer.com/?bol_showMap=false then the map
	 * will be hidden regardless of previous localStorage or the defaults here.
	 * Note that "bol_showMap" matches exactly as in the Options, otherwise
	 * it would have not overridden any Options variable. Values used apart from
	 * comparison should be sanitized first.
	 */
	Args: {},
	KeyEnum:
	{
		Page: "page",
		Section: "section",
		Article: "article",
		Mode: "mode",
		Go: "go"
	},
	
	/*
	 * Capitalization case style enum
	 */
	CaseEnum:
	{
		Original: -1,
		None: 0,
		Lower: 1,
		Sentence: 2,
		Title: 3,
		Every: 4,
		All: 5
	},
	
	/*
	 * Tells if a string is an enum of an enum object.
	 * @param string pString to test for inclusion.
	 * @param object pEnum container of enums.
	 * @returns boolean true if within.
	 */
	isEnumWithin: function(pString, pEnum)
	{
		for (var i in pEnum)
		{
			if (pEnum[i].toLowerCase() === pString.toLowerCase())
			{
				return true;
			}
		}
		return false;
	},
	
	/*
	 * Extracts arguments from a https://en.wikipedia.org/wiki/Query_string
	 * @returns object containing the key-value pairs.
	 */
	getURLArguments: function()
	{
		var urlargs = window.location.search.substr(1).split("&");
		if (urlargs === "")
		{
			return {};
		}
		
		var argsobject = {};
		for (var i = 0; i < urlargs.length; ++i)
		{
			var p = urlargs[i].split("=");
			if (p.length !== 2)
			{
				continue;
			}
			argsobject[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return argsobject;
	},
	
	/*
	 * Parses and stores the URL arguments then do appropriate changes.
	 */
	enforceURLArgumentsFirst: function()
	{
		U.Args = U.getURLArguments();
		U.enforceURLArgumentsSpecial();
		
		var i;
		// Set up program mode
		var mode = U.Args[U.KeyEnum.Mode];
		if (mode)
		{
			for (i in I.ModeEnum)
			{
				if (I.ModeEnum[i].toLowerCase() === mode.toLowerCase())
				{
					I.ModeCurrent = I.ModeEnum[i];
					break;
				}
			}
		}
		
		if (I.ModeCurrent === null)
		{
			I.ModeCurrent = I.ModeEnum.Website;
		}
		
		// Store article value, if exists
		I.ArticleCurrent = U.Args[U.KeyEnum.Article];
	},
	
	/*
	 * Does the commands within the address bar after the site's domain name.
	 * @pre URLArguments object was initialized by extraction.
	 */
	enforceURLArgumentsLast: function()
	{
		U.openPageFromURL();
	},
	
	/*
	 * Special URL keys that override others.
	 */
	enforceURLArgumentsSpecial: function()
	{
		/*
		 * The page key could've been written by the 404 webpage, which converts
		 * forward slash (/) separated directories into query strings, with
		 * the first argument as the page value. So if a user goes to the URL
		 * http://gw2timer.com/navi they will be redirected to http://gw2timer.com/?page=Navi
		 * These special pages must have unique names from the content pages.
		 */
		var i, ii;
		var ithpage;
		var go = function(pURL)
		{
			$("body").hide();
			document.location = pURL;
		};
		
		var page = U.Args[U.KeyEnum.Page];
		// Only proceed if "page" is not an actual content page
		if (page && U.isEnumWithin(page, I.PageEnum) === false)
		{
			page = page.toLowerCase();
			if (page === "navi" || page === "overlay")
			{
				go(U.URL_META.Overlay);
			}
			else if (page === "m" || page === "mobile")
			{
				U.Args[U.KeyEnum.Mode] = I.ModeEnum.Mobile;
			}
			else if (page === "s" || page === "simple")
			{
				U.Args[U.KeyEnum.Mode] = I.ModeEnum.Simple;
			}
			else if (page === "t" || page === "tile")
			{
				U.Args[U.KeyEnum.Mode] = I.ModeEnum.Tile;
			}
			else
			{
				// Check if the special page is actually a section
				for (i in I.SectionEnum)
				{
					ithpage = I.SectionEnum[i];
					for (ii in ithpage)
					{
						if (ii.toLowerCase() === page)
						{
							// Page part becomes the section, section part becomes the article
							if (U.Args[U.KeyEnum.Section] !== undefined)
							{
								U.Args[U.KeyEnum.Article] = U.Args[U.KeyEnum.Section];
							}
							U.Args[U.KeyEnum.Page] = i;
							U.Args[U.KeyEnum.Section] = ii;
							return;
						}
					}
				}
				
				// Check if the special page is actually a zone name
				for (i in M.Zones)
				{
					if (page.indexOf(i) !== -1)
					{
						U.Args[U.KeyEnum.Go] = i;
						return;
					}
				}
			}
		}
		
		// Check if the special page is actually a collectible
		for (i in X.Collectibles)
		{
			ithpage = X.Collectibles[i].urlkey;
			if (ithpage === page || U.Args[ithpage] !== undefined)
			{
				U.Args[U.KeyEnum.Page] = I.PageEnum.Map;
				U.Args[U.KeyEnum.Section] = I.SectionEnum.Map.Collectible;
				// Setting the article key will tell the generate collectibles function to do so for that one
				U.Args[U.KeyEnum.Article] = ithpage;
				return;
			}
		}
	},
	
	/*
	 * Sanitizes URLArguments value part before overriding. For example:
	 * http://gw2timer.com/?bol_showMap=falsse "falsse" defaults to "true"
	 * @param string pKey of an option.
	 * @param string pValue of that option.
	 * @returns string sanitized value.
	 * @pre The key-value pair matches the Options object's, and numeric values
	 * have the OptionRange object initialized for legal numbers.
	 */
	sanitizeURLOptionsValue: function(pKey, pValue)
	{
		var datatype = pKey.substring(0, O.lengthOfPrefixes);
		var s = pValue.toLowerCase();
		switch (datatype)
		{
			case O.TypeEnum.isBoolean:
			{
				if (s === "true" || s === "false")
				{
					return s;
				}
				return O.Options[pKey].toString(); // Default boolean
			} break;
			case O.TypeEnum.isInteger:
			{
				if (isFinite(s)) // Is a number
				{
					var theinteger = parseInt(s);
					if (theinteger >= O.OptionRange[pKey][0] && theinteger <= O.OptionRange[pKey][1])
					{
						return theinteger.toString();
					}
				}
				return O.Options[pKey].toString(); // Default number
			} break;
			case O.TypeEnum.isFloat:
			{
				if (isFinite(s)) // Is a number
				{
					var thefloat = parseFloat(s);
					if (thefloat >= O.OptionRange[pKey][0] && thefloat <= O.OptionRange[pKey][1])
					{
						return thefloat.toString();
					}
				}
				return O.Options[pKey].toString(); // Default number
			} break;
			case O.TypeEnum.isEnum:
			{
				return O.validateEnum(pKey, pValue);
			} break;
			case O.TypeEnum.isString:
			{
				return U.escapeHTML(pValue);
			} break;
		}
		return "null";
	},
	
	/*
	 * Strips all non-alphabet and non-numbers from a string using regex.
	 * @param string pString to strip.
	 * @return string stripped.
	 */
	stripToAlphanumeric: function(pString)
	{
		return pString.replace(/\W/g, "");
	},
	
	/*
	 * Strips to alphanumeric and allow spaces and some punctuation marks.
	 * @param string pString to strip.
	 * @returns string stripped.
	 */
	stripToSentence: function(pString)
	{
		return pString.replace(/[^\w\s\'\"\:\,]/gi, "");
	},
	
	/*
	 * Allows only numbers, arithmetic operators, and parantheses.
	 * @param string pString arithmetic expression.
	 * @returns string stripped.
	 */
	stripToCalculation: function(pString)
	{
		return pString.replace(/[^0-9.()\-+/*]/gi, "");
	},
	
	/*
	 * Converts a string to be all lower case except the first letter which is capitalized.
	 * @param string pString to convert.
	 * @returns string converted.
	 */
	toFirstUpperCase: function(pString)
	{
		return pString.charAt(0).toUpperCase() + pString.slice(1).toLowerCase();
	},
	toEveryUpperCase: function(pString)
	{
		var str = pString.split(" ");
		if (str.length > 1)
		{
			for (var i in str)
			{
				str[i] = U.toFirstUpperCase(str[i]);
			}
			return str.join(" ");
		}
		else
		{
			return U.toFirstUpperCase(pString);
		}
	},
	
	/*
	 * Changes letter case of a word or sentence.
	 * @param string pString to change.
	 * @returns string changed.
	 * @pre String is a readable text that starts with a letter.
	 */
	toCase: function(pString, pCase)
	{
		var i;
		var str = [];
		
		if (pCase === undefined || pCase === U.CaseEnum.None)
		{
			return pString;
		}
		if (pCase === U.CaseEnum.Title || pCase === U.CaseEnum.Every)
		{
			str = pString.split(" ");
		}
		
		switch (pCase)
		{
			case U.CaseEnum.Lower: return pString.toLowerCase();
			case U.CaseEnum.Sentence: return U.toFirstUpperCase(pString);
			case U.CaseEnum.Title:
			{
				// Capitalize the first word and the rest, but don't capitalize 2-letter words
				if (str.length > 1)
				{
					str[0] = U.toFirstUpperCase(str[0]);
					for (i = 1; i < str.length; i++)
					{
						if (str[i].length !== 2)
						{
							str[i] = U.toFirstUpperCase(str[i]);
						}
					}
					return str.join(" ");
				}
				else
				{
					return U.toFirstUpperCase(pString);
				}
			}
			case U.CaseEnum.Every:
			{
				if (str.length > 1)
				{
					for (i in str)
					{
						str[i] = U.toFirstUpperCase(str[i]);
					}
					return str.join(" ");
				}
				else
				{
					return U.toFirstUpperCase(pString);
				}
			}
			case U.CaseEnum.All: return pString.toUpperCase();
		}
		return pString;
	},
	
	/*
	 * Shortens a title/name string based on limit and add ellipses.
	 * @param string pString.
	 * @returns string truncated if it's too long.
	 */
	truncateString: function(pString, pLimit, pSuffix)
	{
		pSuffix = pSuffix || "";
		if (pString.length > pLimit)
		{
			return pString.substring(0, pLimit) + pSuffix;
		}
		return pString;
	},
	
	/*
	 * Wraps a substring with a tag if substring is found in a string.
	 * @param string pString to search in.
	 * @param string pSubstring to wrap.
	 * @param string pTag HTML tag.
	 * @returns string with substring wrapped with tag.
	 */
	wrapSubstringHTML: function(pString, pSubstring, pTag)
	{
		var start = pString.toLowerCase().indexOf(pSubstring.toLowerCase());
		var end = start + pSubstring.length;
		var str = "";
		if (start !== -1)
		{
			if (pTag === undefined)
			{
				pTag = "u";
			}
			str = pString.substring(0, start)
				+ "<" + pTag + ">" + pString.substring(start, end) + "</" + pTag + ">"
				+ pString.substring(end, pString.length);
		}
		else
		{
			str = pString;
		}
		return str;
	},
	
	/*
	 * Strips a string of HTML special characters for use in printing.
	 * @param string pString to escape.
	 * @returns string replaced string.
	 */
	escapeHTML: function(pString)
	{
		return pString
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	},
	
	/*
	 * Replaces a character in a string with a specified character.
	 * @param string pString to manipulate.
	 * @param int pIndex of the target character.
	 * @param string pCharacter the replacement.
	 * @returns string with a character at index replaced.
	 */
	replaceCharAt: function(pString, pIndex, pCharacter)
	{
		return pString.substr(0, pIndex) + pCharacter + pString.substr(pIndex + pCharacter.length);
	},
	
	/*
	 * Creates a string of specified length containing only the specified character.
	 * @param string pChar to write.
	 * @param int pLength of returned string.
	 * @returns string of repeated character.
	 */
	repeatChar: function(pChar, pLength)
	{
		return Array(pLength + 1).join(pChar);
	},
	
	/*
	 * Counts the occurences of a string within a string.
	 * @param string pString to look in.
	 * @param string pMatch to look for.
	 * @returns int count.
	 */
	countOccurrence: function(pString, pMatch)
	{
		return pString.split(pMatch).length - 1;
	},
	
	/*
	 * Updates the address bar with the given string affixed to the site base URL.
	 * This should be the only place the "history" global variable is used.
	 * @param string pString URL query string.
	 */
	updateAddressBar: function(pString)
	{
		history.replaceState("", null, pString);
		// Workaround Firefox SVG url bug
		K.reapplyFilters();
	},
	
	/*
	 * Rewrites the URL in the address bar to show the current page and section.
	 * Does not actually load anything and is only a visual effect; however, if
	 * the user presses enter with that URL (go to such a link), a separate
	 * function will load that page (content plate) and expand that section.
	 */
	updateQueryString: function()
	{
		if (I.PageCurrent !== "")
		{
			var section = I[I.sectionPrefix + I.PageCurrent];
			var article = I.ArticleCurrent;
			var go = U.Args[U.KeyEnum.Go];

			var pagestring = "?" + U.KeyEnum.Page + "=" + I.PageCurrent;
			var sectionstring = "";
			var articlestring = "";
			var gostring = "";
			var modestring = "";
			
			var title = I.PageCurrent;
			
			if (I.ModeCurrent !== I.ModeEnum.Website)
			{
				modestring = "&mode=" + I.ModeCurrent;
			}

			if (section)
			{
				sectionstring = "&" + U.KeyEnum.Section + "=" + section;
				title = section;
			}
			if (article)
			{
				articlestring = "&" + U.KeyEnum.Article + "=" + article;
			}
			if (go)
			{
				gostring = "&" + U.KeyEnum.Go + "=" + go;
			}
			
			U.updateAddressBar(pagestring + sectionstring + articlestring + gostring + modestring);
			U.updateTitle(title);
		}
	},
	updateTitle: function(pTitle)
	{
		document.title = I.cSiteName + "/" + pTitle;
	},
	
	/*
	 * Triggers the header tag associated with the requested page and section,
	 * which will cause the section beside the header to expand. This is to be
	 * called after a page has been AJAX loaded and bindings completed.
	 */
	openSectionFromURL: function()
	{
		/*
		 * Enclosed in setTimeout because without it the scroll to element
		 * animation function is glitchy (the function is called when the header
		 * is clicked so the page automatically scrolls to the header).
		 */
		setTimeout(function()
		{
			if (U.Args[U.KeyEnum.Section] !== undefined)
			{
				var section = U.stripToAlphanumeric(U.Args[U.KeyEnum.Section]);
				// Try going to a section name in sentence letter case
				var elem = $(I.cHeaderPrefix + I.PageCurrent + "_" + U.toFirstUpperCase(section));
				if ( ! elem.length)
				{
					// Else try going to a section name in all caps
					elem = $(I.cHeaderPrefix + I.PageCurrent + "_" + section.toUpperCase());
				}
				if (I.PageCurrent === I.PageEnum.Chains)
				{
					// Click the chains header to hide it because it's shown by default
					$("#headerChains_Scheduled").trigger("click");
				}
				elem.trigger("click");
			}
		}, 0);
	},
	
	/*
	 * Opens a page by triggering the clicking of the menu button.
	 * @pre All HTML has been generated.
	 */
	openPageFromURL: function()
	{
		if (U.Args[U.KeyEnum.Page] !== undefined)
		{
			var page = U.stripToAlphanumeric(U.Args[U.KeyEnum.Page]);
			for (var i in I.PageEnum)
			{
				if (page.toLowerCase() === (I.PageEnum[i]).toLowerCase())
				{
					// Found proper page, so go to it by clicking the menu button
					$(I.cMenuPrefix + I.PageEnum[i]).trigger("click");
					return;
				}
			}
			
			// Special "page" which does not match a proper page name
			page = page.toLowerCase();
			switch (page)
			{
				case "wvw": {
					$("#mapSwitchButton").trigger("click");
				} break;
			}
		}
	},
	
	/*
	 * Makes links open a new tab on an HTML page with analytics to record
	 * what link the user clicked on, then almost instantly redirect them to
	 * the proper address of the link.
	 * @param string pSelector to find tags to convert.
	 */
	convertExternalLink: function(pSelector)
	{
		$(pSelector).each(function()
		{
			$(this).attr("href", I.cSiteURL + "out/?u=" + U.encodeURL($(this).attr("href")));
			$(this).attr("target", "_blank");
		});
	},
	convertExternalURL: function(pURL)
	{
		return I.cSiteURL + "out/?u=" + U.encodeURL(pURL);
	},
	
	/*
	 * Opens a new browser tab with the requested URL.
	 * @param string pURL to go to.
	 */
	openExternalURL: function(pURL)
	{
		var url = pURL;
		if (I.ModeCurrent !== I.ModeEnum.Overlay)
		{
			url = I.cSiteURL + "out/?u=" + U.encodeURL(pURL);
		}
		window.open(url, "_blank");
	},
	
	/*
	 * Extracts the name part from a variable, as in "bol_showMap" returns "showMap".
	 * @param string pVariable full name.
	 * @returns string option name.
	 * @pre Variable name has exactly one underscore character.
	 */
	getVariableSuffix: function(pVariable)
	{
		var index = pVariable.indexOf("_");
		return pVariable.substring(index + 1, pVariable.length);
	},
	getVariablePrefix: function(pVariable)
	{
		var index = pVariable.indexOf("_");
		return pVariable.substring(0, index);
	},
	
	/*
	 * Extracts the "identifier" part of an HTML element's ID. Most iterable
	 * elements' IDs were manually named as [prefix]_[Index].
	 * @param jqobject pElement to extract.
	 * @returns string identifier of the element's ID.
	 */
	getSubstringFromHTMLID: function(pElement)
	{
		return U.getVariableSuffix(pElement.attr("id"));
	},
	/*
	 * Integer version of the ID extraction function.
	 * @param jqobject pElement to extract.
	 * @returns int identifier of the element's ID.
	 */
	getSubintegerFromHTMLID: function(pElement)
	{
		return parseInt(U.getVariableSuffix(pElement.attr("id")));
	},
	
	/*
	 * Gets the URL directory of the HTML source file
	 * @param string pPage name.
	 * @returns string path.
	 */
	getPageSrc: function(pPage)
	{
		return pPage.toLowerCase() + "src.html";
	},
	
	/*
	 * Gets a direct link to a hosted image file.
	 * @param string pCode image code.
	 * @returns URL to image.
	 * @pre image is of png format.
	 */
	getImageHosted: function(pCode)
	{
		return I.cImageHost + pCode + I.cPNG;
	},
	
	/*
	 * Encodes a string for URL usage with regards to "'" character (apostrophe).
	 * @param string pString to encode.
	 * @returns string encoded.
	 */
	encodeURL: function(pString)
	{
		return encodeURI(pString).replace(/'/g, "%27");
	},
	
	/*
	 * Converts a search query to GW2 wiki http link.
	 * @param string pString search entry.
	 * @returns string wiki link.
	 */
	getWikiLink: function(pString)
	{
		pString = pString.replace(/ /g, "_"); // Replace spaces with underscores
		return "http://wiki.guildwars2.com/wiki/" + U.encodeURL(pString);
	},
	getWikiLanguageLink: function(pString)
	{
		pString = pString.replace(/ /g, "_");
		return "http://wiki-" + D.getFullySupportedLanguage() + ".guildwars2.com/wiki/" + U.encodeURL(pString);
	},
	getWikiSearchLink: function(pString)
	{
		pString = pString.replace(/ /g, "+"); // Replace spaces with plus sign
		return "http://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=" + U.encodeURL(pString);
	},
	
	/*
	 * Generates a link to news article at the GuildWars2.com site.
	 * @param string pString suffix.
	 * @returns string URL.
	 */
	getGW2NewsLink: function(pString)
	{
		return "https://www.guildwars2.com/" + D.getFullySupportedLanguage() + "/news/" + pString;
	},
	
	/*
	 * Converts a search query to YouTube http link.
	 * @param string pString search entry.
	 * @returns string youtube link.
	 */
	getYouTubeLink: function(pString)
	{
		return "http://www.youtube.com/results?search_query=" + U.encodeURL(pString);
	},
	
	/*
	 * Converts a search query to Trading Post http link.
	 * @param string pString search entry.
	 * @returns string search link.
	 */
	getTradingSearchLink: function(pString)
	{
		return "https://www.gw2tp.com/search?name=" + U.encodeURL(pString);
	},
	
	/*
	 * Gets a URL to an item page from an item's ID.
	 * @param string pID of the item.
	 * @param string pName of the item.
	 * @returns string item page link.
	 */
	getTradingItemLink: function(pID, pName)
	{
		//return "https://www.gw2tp.com/item/" + U.getURL(pID) + "#" + U.stripToSentence(pName);
		return "http://www.gw2spidy.com/item/" + U.encodeURL(pID) + "#" + U.stripToSentence(pName);
	},
	
	/*
	 * Converts a poi_id number from maps_floor.json to a valid chat link.
	 * Code from http://virtus-gilde.de/gw2map
	 * @param int pID of the poi.
	 * @returns string chatcode.
	 */
	getChatlinkFromPoiID: function(pID)
	{
		var chatcode = String.fromCharCode(4);
		// Create unicode characters from the id
		for (var i = 0; i < 4; i++)
		{
			chatcode += String.fromCharCode((pID >> (i * 8)) & 255);
		}
		// Return base64 string with chat code tags
		return "[&" + btoa(chatcode) + "]";
	},
	
	/*
	 * Converts an item id from items.json to a valid chat link.
	 * Code from http://redd.it/zy8gb
	 * @param int pID of the item.
	 * @returns string chatcode.
	 */ 
	getChatlinkFromItemID: function(pID)
	{
		var str = "";
		try // To ignore "Failed to execute 'btoa' on 'Window'" exception
		{
			str = "[&" + btoa(String.fromCharCode(2) + String.fromCharCode(1)
			+ String.fromCharCode(pID % 256) + String.fromCharCode(Math.floor(pID / 256))
			+ String.fromCharCode(0) + String.fromCharCode(0)) + "]";
		} catch(e){};
		return str;
	}
};

/* =============================================================================
 * @@Checklist management and generation
 * ========================================================================== */
X = {
	
	/*
	 * A checklist is a set of checkboxes that can have the usual unchecked,
	 * checked, and disabled states. These states are recorded as a single
	 * character in a string of numbers representing those states, and the index
	 * of a character is that checkbox's "ID". The Checklists object stores
	 * checklists with such a string and a key for localStorage, along with
	 * supplementary attributes.
	 */
	Checklists:
	{
		// localStorage key-value pairs (key is required)
		Chain: { key: "str_chlChain", value: "" },
		ChainSubscription: { key: "str_chlChainSubscription", value: "" },
		JP: { key: "str_chlJP", value: "" },
		ResourceRich: { key: "str_chlResourceRich", value: "" },
		ResourceRegular: { key: "str_chlResourceRegular", value: "" },
		ResourceZone: { key: "str_chlResourceZone", value: "" },
		Dungeon: { key: "str_chlDungeon", value: "", money: 0 },
		CustomDaily: { key: "str_chlCustomDaily", value: "" },
		CustomWeekly: { key: "str_chlCustomWeekly", value: "" },
		// Individual calculator's settings
		TradingOverwrite: { key: "str_chlTradingOverwrite", value: "" },
		TradingNotify: { key: "str_chlTradingNotify", value: "" }
	},
	/*
	 * Collectible checklists must have the same variable name as in the map page's data.
	 * The urlkey properties must be unique from the global KeyEnum.
	 */
	Collectibles:
	{
		BuriedChests: { key: "str_chlBuriedChests", urlkey: "chests", value: ""},
		BanditChests: { key: "str_chlBanditChests", urlkey: "banditchests", value: ""},
		MatrixCubeKey: { key: "str_chlMatrixCubeKey", urlkey: "matrixcubekey", value: ""},
		LionsArchExterminator: { key: "str_chlLionsArchExterminator", urlkey: "lionsarchexterminator", value: ""},
		CoinProspect: { key: "str_chlCoinProspect", urlkey: "coinprospect", value: ""},
		CoinUplands: { key: "str_chlCoinUplands", urlkey: "coinuplands", value: ""},
		CoinChallenger: { key: "str_chlCoinChallenger", urlkey: "coinchallenger", value: ""},
		LostBadges: { key: "str_chlLostBadges", urlkey: "lostbadges", value: ""},
		GoldenLostBadges: { key: "str_chlGoldenLostBadges", urlkey: "goldenlostbadges", value: ""},
		DiveMaster: { key: "str_chlDiveMaster", urlkey: "divemaster", value: ""},
		SpeedyReader: { key: "str_chlSpeedyReader", urlkey: "speedyreader", value: ""},
		CleaningUp: { key: "str_chlCleaningUp", urlkey: "cleaningup", value: ""},
		HistoryBuff: { key: "str_chlHistoryBuff", urlkey: "historybuff", value: ""}
	},
	ChecklistEnum:
	{
		// Must be 1 character long
		Unchecked: "0",
		Checked: "1",
		Disabled: "2",
		
		Unfound: "0",
		Tracked: "1",
		Found: "2"
	},
	ChecklistJob:
	{
		UncheckAll: 0,
		CheckAll: 1,
		UncheckTheChecked: 2
	},
	
	/*
	 * A textlist is a set of text inputs or textareas that user writes in.
	 * These are stored as substrings separated by "|" in a single long string.
	 * The index between the separators represent the substring's (textarea's
	 * content) ID. Other than that, its working is similar to checklists.
	 */
	Textlists:
	{
		CustomTextDaily: { key: "str_txlCustomTextDaily", value: new Array(), valueDefault: new Array() },
		CustomTextWeekly: { key: "str_txlCustomTextWeekly", value: new Array(), valueDefault: new Array() },
		NotepadText: { key: "str_txlNotepadText", value: new Array(), valueDefault: new Array() },
		TradingItem: { key: "str_txlTradingItem", value: new Array() },
		TradingName: { key: "str_txlTradingName", value: new Array() },
		TradingBuy: { key: "str_txlTradingBuy", value: new Array() },
		TradingSell: { key: "str_txlTradingSell", value: new Array() },
		TradingQuantity: { key: "str_txlTradingQuantity", value: new Array() },
		NotifyBuyLow: { key: "str_txlNotifyBuyLow", value: new Array() },
		NotifyBuyHigh: { key: "str_txlNotifyBuyHigh", value: new Array() },
		NotifySellLow: { key: "str_txlNotifySellLow", value: new Array() },
		NotifySellHigh: { key: "str_txlNotifySellHigh", value: new Array() },
		ExchangeUnit: { key: "str_txlExchangeUnit", value: new Array() }
	},
	
	/*
	 * Converts a boolean to a checklist enum.
	 * @param string pBoolean to convert.
	 * @returns enum.
	 */
	boolToChecklistEnum: function(pBoolean)
	{
		if (pBoolean)
		{
			return X.ChecklistEnum.Checked;
		}
		return X.ChecklistEnum.Unchecked;
	},
	
	/*
	 * Creates a string for a checklist object with each character representing
	 * a state, and each index representing a check item. Also initializes the
	 * localStorage or load it as the checklist if already stored.
	 * @param object pChecklist to initialize.
	 * @param int pLength of the checklist string to construct.
	 * @param string pCustomList comma separated list of indexes (1-indexed) to be set as checked.
	 * @returns string new checklist to be assigned to a checklist variable.
	 */
	initializeChecklist: function(pChecklist, pLength, pCustomList, pJob)
	{
		var i;
		var indexes;
		var index;
		var storedlist = localStorage[pChecklist.key];
		pChecklist.length = pLength;
		
		if (pCustomList)
		{
			X.clearChecklist(pChecklist);
			indexes = pCustomList.split(",");

			for (i in indexes)
			{
				index = parseInt(indexes[i]);
				if (isFinite(index))
				{
					X.setChecklistItem(pChecklist, index - 1, X.ChecklistEnum.Checked);
				}
			}
		}
		/*
		 * If localStorage doesn't have the checklist already then it gets a
		 * default checklist string of 0's.
		 */
		else if (storedlist === undefined)
		{
			X.clearChecklist(pChecklist, pJob);
		}
		// If stored list is longer than requested, then truncate it from right to left
		else if (storedlist.length > pLength)
		{
			localStorage[pChecklist.key] = storedlist.substring(0, pLength);
		}
		// If stored list is shorter than requested, then concatenate it with 0's so its new length equals so
		else if (storedlist.length < pLength)
		{
			var padding = U.repeatChar(X.ChecklistEnum.Unchecked, pLength - storedlist.length);
			localStorage[pChecklist.key] = storedlist + padding;
		}
		
		// Either way, the stored list becomes the program's list
		pChecklist.value = localStorage[pChecklist.key];
	},
	
	/*
	 * Replaces a character in a checklist string and updates the localStorage.
	 * @param object pChecklist to modify.
	 * @param int pIndex of the character in the string.
	 * @param string pCharacter to replace the current.
	 */
	setChecklistItem: function(pChecklist, pIndex, pCharacter)
	{
		pIndex = parseInt(pIndex);
		var thechar = pCharacter.toString();
		// A character must be length 1 and different from the current
		if (thechar.length === 1 && pChecklist.value[pIndex] !== thechar
			&& pIndex >= 0
			&& pIndex < pChecklist.value.length)
		{
			var checklist = U.replaceCharAt(pChecklist.value, pIndex, thechar);
			localStorage[pChecklist.key] = checklist;
			pChecklist.value = checklist;
		}
	},
	
	/*
	 * Toggles a character in a checklist string and updates the localStorage
	 * between three possible states.
	 * @param object pChecklist to modify.
	 * @param int pIndex of the character in the string.
	 * @returns enum the new state.
	 */
	trackChecklistItem: function(pChecklist, pIndex)
	{
		pIndex = parseInt(pIndex);
		var thechar = pChecklist.value.charAt(pIndex);
		switch (thechar)
		{
			case X.ChecklistEnum.Unfound: thechar = X.ChecklistEnum.Tracked; break;
			case X.ChecklistEnum.Tracked: thechar = X.ChecklistEnum.Found; break;
			case X.ChecklistEnum.Found: thechar = X.ChecklistEnum.Unfound; break;
			default: thechar = X.ChecklistEnum.Unfound;
		}
		
		var checklist = U.replaceCharAt(pChecklist.value, pIndex, thechar);
		localStorage[pChecklist.key] = checklist;
		pChecklist.value = checklist;
		
		return thechar;
	},
	
	/*
	 * Gets the character in a checklist string at specified index.
	 * @param object pChecklist to extract.
	 * @param int pIndex of the character.
	 * @param string pConversion to convert that character to a type.
	 * @returns dynamic depending on conversion param.
	 */
	getChecklistItem: function(pChecklist, pIndex, pConversion)
	{
		var thechar = pChecklist.value.charAt(pIndex);
		
		if (pConversion === undefined)
		{
			return thechar;
		}
		if (pConversion === O.TypeEnum.isInteger)
		{
			return parseInt(thechar);
		}
		if (pConversion === O.TypeEnum.isBoolean)
		{
			// Returns false only if unchecked
			return O.intToBool(parseInt(thechar));
		}
		return thechar;
	},
	
	/*
	 * Tells if an element with a checkbox has checked state.
	 * @param object pChecklist to lookup.
	 * @param jqobject pEntry to extract checkbox index in checklist.
	 * @returns boolean true if checked.
	 */
	isChecked: function(pChecklist, pEntry)
	{
		var index = U.getSubintegerFromHTMLID(pEntry);
		if (X.getChecklistItem(pChecklist, index) === X.ChecklistEnum.Checked)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Gets indexes in a checklist that has its value as "checked".
	 * @param object pChecklist to extract.
	 * @returns string comma separated string of index numbers (1-indexed).
	 */
	getCheckedIndexes: function(pChecklist)
	{
		var i;
		var indexes = "";
		var list = pChecklist.value;
		for (i = 0; i < list.length; i++)
		{
			if (list[i] === X.ChecklistEnum.Checked)
			{
				indexes += (i+1) + ",";
			}
		}
		indexes = indexes.slice(0, -1); // Trim last extra comma
		return indexes;
	},
	
	/*
	 * Sets a checklist object's list a desired mass state.
	 * @param object pChecklist to clear.
	 * @param string pJob to check or uncheck the checklist.
	 * @pre Checklist length attribute was initialized.
	 */
	clearChecklist: function(pChecklist, pJob)
	{
		var i;
		var checklist = "";
		var value = "";
		
		switch (pJob)
		{
			case X.ChecklistJob.CheckAll:
			{
				for (i = 0; i < pChecklist.length; i++)
				{
					checklist += X.ChecklistEnum.Checked;
				}
			} break;
			case X.ChecklistJob.UncheckTheChecked:
			{
				// Only sets unchecked state on checked ones
				if (localStorage[pChecklist.key] !== undefined)
				{
					value = localStorage[pChecklist.key];
				}
				else
				{
					value = pChecklist.value;
				}
				
				for (i = 0; i < value.length; i++)
				{
					if (value[i] === X.ChecklistEnum.Checked)
					{
						checklist += X.ChecklistEnum.Unchecked;
					}
					else
					{
						checklist += value[i];
					}
				}
			} break;
			default:
			{
				for (i = 0; i < pChecklist.length; i++)
				{
					checklist += X.ChecklistEnum.Unchecked;
				}
			}
		}
		
		pChecklist.value = checklist;
		localStorage[pChecklist.key] = checklist;
	},
	
	/*
	 * Counts the checked type in a checklist.
	 * @param object pChecklist to look in.
	 * @param enum pCheckType to look for.
	 * @returns int count.
	 */
	countChecklist: function(pChecklist, pCheckType)
	{
		return U.countOccurrence(pChecklist.value, pCheckType);
	},
	
	/*
	 * Reads a checkbox element and return its checklist enum state.
	 * @param jqobject pElement to read.
	 * @returns int checklist enum.
	 */
	getCheckboxEnumState: function(pElement)
	{
		if (pElement.prop("disabled") === true)
		{
			return X.ChecklistEnum.Disabled;
		}
		if (pElement.prop("checked") === true)
		{
			return X.ChecklistEnum.Checked;
		}
		return X.ChecklistEnum.Unchecked;
	},
	
	/*
	 * Sets an input tag checkbox checked/disabled states based on specified enum.
	 * @param jqobject pElement checkbox to change.
	 * @param int pChecklistEnum to apply.
	 */
	setCheckboxEnumState: function(pElement, pChecklistEnum)
	{
		switch (pChecklistEnum)
		{
			case X.ChecklistEnum.Disabled:
			{
				pElement.prop("disabled", true);
				pElement.prop("checked", false);
			} break;
			case X.ChecklistEnum.Checked:
			{
				pElement.prop("checked", true);
			} break;
			default: pElement.prop("checked", false);
		}
		pElement.trigger("change");
	},
	
	/*
	 * Sets a checkbox to a desired state by reading it then manually triggering it.
	 * @param jqobject pElement checkbox to manipulate.
	 * @param int pState checkbox enum.
	 */
	triggerCheckbox: function(pElement, pState)
	{
		var checkboxstate = X.getCheckboxEnumState(pElement);
		
		if ( (pState === X.ChecklistEnum.Checked && (checkboxstate === X.ChecklistEnum.Unchecked))
			|| (pState === X.ChecklistEnum.Unchecked && (checkboxstate === X.ChecklistEnum.Checked)) )
		{
			pElement.trigger("click");
		}
		else if (pState === X.ChecklistEnum.Disabled && checkboxstate !== X.ChecklistEnum.Disabled)
		{
			pElement.trigger("dblclick");
		}
	},
	
	/*
	 * Triggers a checkbox based on associated state in a checklist.
	 * @param object pChecklist as target state.
	 * @param int pIndex of a state in checklist.
	 * @param jqobject pElement checkbox to manipulate.
	 */
	triggerCheckboxEnumState: function(pChecklist, pIndex, pElement)
	{
		var checkliststate = X.getChecklistItem(pChecklist, pIndex);
		X.triggerCheckbox(pElement, checkliststate);
	},
	
	/*
	 * Adds style classes to a label that wraps a checkbox depending on its state.
	 * @param object pChecklist to get state.
	 * @param int pIndex of state.
	 * @param jqobject pElement checkbox label to style.
	 * @pre In format <label><input type="checkbox" />ExampleLabel</label>.
	 */
	styleCheckbox: function(pChecklist, pIndex, pElement)
	{
		var state = X.getChecklistItem(pChecklist, pIndex);
		switch (state)
		{
			case X.ChecklistEnum.Disabled:
			{
				pElement.parent().removeClass("chlCheckboxChecked")
					.addClass("chlCheckboxDisabled");
			} break;
			case X.ChecklistEnum.Checked:
			{
				pElement.parent().removeClass("chlCheckboxDisabled")
					.addClass("chlCheckboxChecked");
			} break;
			default:
			{
				pElement.parent().removeClass("chlCheckboxDisabled")
					.removeClass("chlCheckboxChecked");
			}
		}
	},
	
	/*
	 * Initializes the checklist for a set of checkboxes and bind their standard storage behavior.
	 * @param object pChecklist for storing state.
	 * @param jqobject pCheckboxes input to bind behavior.
	 * @param enum pJob initial checkbox state.
	 * @pre These checkboxes can only have a checked and unchecked state only.
	 */
	initializeCheckboxlist: function(pChecklist, pCheckboxes, pJob)
	{
		X.initializeChecklist(pChecklist, pCheckboxes.length, null, pJob);
		
		pCheckboxes.each(function(pIndex)
		{
			$(this).change(function()
			{
				var state = X.getCheckboxEnumState($(this));
				
				X.setChecklistItem(pChecklist, pIndex, state);
			});
			
			// Now that this checkbox is bound, trigger it as the state in checklist
			X.triggerCheckboxEnumState(pChecklist, pIndex, $(this));
		});
	},
	
	/*
	 * Stores text and binds default behavior for a standard set of text fields.
	 * @param object pChecklistText for storing text in memory and storage.
	 * @param jqobject pTextFields input or textarea elements to iterate and read text.
	 * @param string pFieldName name of the text fields for notifying of change.
	 * @param int pMaxLength of characters in a text field.
	 * @param jqobject pRestoreButton to reset all text fields.
	 */
	initializeTextlist: function(pTextlist, pTextFields, pFieldName, pMaxLength, pRestoreButton)
	{
		// Initialize the pre-written text in the text fields
		pTextFields.each(function()
		{
			var text = $(this).val();
			pTextlist.value.push(text);
			if (pTextlist.valueDefault)
			{
				pTextlist.valueDefault.push(text);
			}
		});
		
		/*
		 * Each text fields' value will become a delimited substring in one
		 * single string to be stored in localStorage.
		 */
		var i;
		if (localStorage[pTextlist.key] === undefined)
		{
			// If localStorage value is empty, replace with original values in text field
			localStorage[pTextlist.key] = pTextlist.value.join(I.cTextDelimiterChar);
		}
		else
		{
			var storedtextarray = localStorage[pTextlist.key].split(I.cTextDelimiterChar);
			// Load the stored text and account for missing entries
			for (i = 0; i < pTextlist.value.length; i++)
			{
				if (storedtextarray[i])
				{
					pTextlist.value[i] = storedtextarray[i];
				}
				else
				{
					pTextlist.value[i] = "";
				}
			}
			localStorage[pTextlist.key] = pTextlist.value.join(I.cTextDelimiterChar);
		}
		
		var updateStoredText = function()
		{
			// Read every text fields and rewrite the string of substrings again
			pTextFields.each(function(pIndex)
			{
				// Do not allow delimiter in the stored string
				pTextlist.value[pIndex] = $(this).val().replace(I.cTextDelimiterRegex, "");
			});
			localStorage[pTextlist.key] = pTextlist.value.join(I.cTextDelimiterChar);
		};
		
		// Bind text fields behavior
		pTextFields.each(function(pIndex)
		{
			// Set number of characters allowed in the text field
			$(this).attr("maxlength", pMaxLength);
			$(this).val(pTextlist.value[pIndex]); // Load initialized text
			
			$(this).change(function()
			{
				if (pFieldName)
				{
					I.write(pFieldName + " #" + (pIndex + 1) + " updated.");
				}
				updateStoredText();
			});
		});
		
		// Bind restore default values button
		if (pRestoreButton)
		{
			pRestoreButton.click(function()
			{
				if (confirm("Reset texts to default?"))
				{
					pTextFields.each(function(pIndex)
					{
						$(this).val(pTextlist.valueDefault[pIndex]).trigger("change");
					});
				}
			});
		}
	},
	
	/*
	 * Loads chain checklist state as recorded in localStorage, and binds
	 * clicking behavior to the div faux checkboxes.
	 * @param object pChain to initialize.
	 * @pre Chains HTML have been initialized.
	 */
	initializeChainChecklist: function(pChain)
	{
		var bar = $("#chnBar_" + pChain.nexus);
		var check = $("#chnCheck_" + pChain.nexus);
		var time = $("#chnTime_" + pChain.nexus);

		// Set the checkbox visual state as stored
		X.reapplyChainBarState(pChain.nexus, bar, check, time);
		
		if (C.isChainRegular(pChain))
		{
			/*
			 * Bind event handler for the time clickable for subscription.
			 */
			time.click(function()
			{
				var nexus = U.getSubintegerFromHTMLID($(this));
				var slottimes = $(".chnSlot_" + nexus).find("time");

				if (X.getChecklistItem(X.Checklists.ChainSubscription, nexus) === X.ChecklistEnum.Checked)
				{
					$(this).removeClass("chnTimeSubscribed");
					slottimes.removeClass("chnTimeSubscribed");
					X.setChecklistItem(X.Checklists.ChainSubscription, nexus, X.ChecklistEnum.Unchecked);
				}
				else
				{
					$(this).addClass("chnTimeSubscribed");
					slottimes.addClass("chnTimeSubscribed");
					X.setChecklistItem(X.Checklists.ChainSubscription, nexus, X.ChecklistEnum.Checked);
					if (O.Options.int_setAlarm !== O.IntEnum.Alarm.Subscription)
					{
						I.write("Please set <img src='img/ui/speaker.png' /> to &quot;"
							+ D.getWordCapital("subscription") + "&quot; to enable alarm.");
					}
				}
			});
		}

		/*
		 * Bind event handler for the div "checkboxes".
		 */
		check.click(function()
		{
			// The ID was named so by the chain initializer, get the chain nexus
			var nexus = U.getSubintegerFromHTMLID($(this));
			var thisbar = $("#chnBar_" + nexus);
			var theseslots = $(".chnSlot_" + nexus);
			var display = (I.ModeCurrent === I.ModeEnum.Tile) ? "inline-block" : "block";
			// State of the div is stored in the Checklist object rather in the element itself
			switch (X.getChecklistItem(X.Checklists.Chain, nexus))
			{
				case X.ChecklistEnum.Unchecked:
				{
					thisbar.css({opacity: 1}).animate({opacity: K.iconOpacityChecked}, K.iconOpacitySpeed);
					if (I.ModeCurrent !== I.ModeEnum.Tile)
					{
						$("#chnDetails_" + nexus).hide("fast");
					}
					$(this).addClass("chnChecked");
					X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Checked);
					if (C.isTimetableGenerated)
					{
						theseslots.css({opacity: 1}).animate({opacity: K.iconOpacityChecked}, K.iconOpacitySpeed)
							.find(".chnCheck").addClass("chnChecked");
					}
				} break;
				case X.ChecklistEnum.Checked:
				{
					thisbar.css({opacity: 1}).show("fast").css({display: display});
					thisbar.css({opacity: K.iconOpacityChecked}).animate({opacity: 1}, K.iconOpacitySpeed);
					if (I.ModeCurrent !== I.ModeEnum.Tile)
					{
						$("#chnDetails_" + nexus).show("fast").css({display: display});
					}
					$(this).removeClass("chnChecked");
					X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Unchecked);
					if (C.isTimetableGenerated)
					{
						theseslots.show("fast").css({display: display})
							.css({opacity: K.iconOpacityChecked}).animate({opacity: 1}, K.iconOpacitySpeed)
							.find(".chnCheck").removeClass("chnChecked");
					}
				} break;
				case X.ChecklistEnum.Disabled:
				{
					thisbar.css({opacity: 1}).show("fast").css({display: display});
					if (I.ModeCurrent !== I.ModeEnum.Tile)
					{
						$("#chnDetails_" + nexus).show("fast").css({display: display});
					}
					$(this).removeClass("chnChecked");
					X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Unchecked);
					if (C.isTimetableGenerated)
					{
						theseslots.hide().css({opacity: 1})
							.find(".chnCheck").removeClass("chnChecked");
					}
				} break;
			}
			X.hideCheckedChainBar(nexus);
			// Update the icons on the clock too
			K.checkoffChainIcon(nexus);
		});

		// Bind the delete chain text button [x]
		$("#chnDelete_" + pChain.nexus).click(function()
		{
			var nexus = U.getSubintegerFromHTMLID($(this));
			$("#chnBar_" + nexus).hide("slow");
			if (C.isTimetableGenerated)
			{
				$(".chnSlot_" + nexus).hide("slow");
			}
			X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Disabled);

			// Also update the clock icon
			K.checkoffChainIcon(nexus);
		});
	},
	reapplyChainBarState: function(pIndex, pBar, pCheck, pTime)
	{
		// Chain check
		switch (X.getChecklistItem(X.Checklists.Chain, pIndex))
		{
			case X.ChecklistEnum.Unchecked:
			{
				// Bar is not checked off, so don't do anything
			} break;
			case X.ChecklistEnum.Checked:
			{
				pBar.css({opacity: K.iconOpacityChecked});
				pCheck.addClass("chnChecked");
				if (O.Options.bol_hideChecked)
				{
					pBar.hide();
				}
			} break;
			case X.ChecklistEnum.Disabled:
			{
				pBar.hide();
			} break;
		}
		
		// Chain time
		if (C.isChainRegular(C.Chains[pIndex]) &&
			X.getChecklistItem(X.Checklists.ChainSubscription, pIndex) === X.ChecklistEnum.Checked)
		{
			pTime.addClass("chnTimeSubscribed");
		}
	},
	hideCheckedChainBar: function(pIndex)
	{
		var display = (I.ModeCurrent === I.ModeEnum.Tile) ? "inline-block" : "block";
		// Hide the chain bar if opted
		if (X.getChecklistItem(X.Checklists.Chain, pIndex) === X.ChecklistEnum.Checked)
		{
			if (O.Options.bol_hideChecked)
			{
				$("#chnBar_" + pIndex).hide("fast");
				if (C.isTimetableGenerated)
				{
					$(".chnSlot_" + pIndex).hide("fast");
				}
			}
			else
			{
				$("#chnBar_" + pIndex).show("fast").css({display: display});
				if (C.isTimetableGenerated)
				{
					$(".chnSlot_" + pIndex).show("fast").css({display: display});
				}
			}
		}
	},
	
	/*
	 * Gets the checklist state of a chain.
	 * @param object pChain chain to test.
	 * @returns int state (use enum).
	 */
	getChainChecklistState: function(pChain)
	{
		return X.getChecklistItem(X.Checklists.Chain, pChain.nexus);
	},
	
	/*
	 * Prepares the personal checklist presentation.
	 */
	initializePersonalChecklist: function()
	{
		/*
		 * Setting this boolean will tell the clock ticker function to call the
		 * HTML timer update function.
		 */
		T.isCountdownToResetStarted = true;
		
		// Initially, only show the daily checklist; user clicks the buttons to toggle the various checklists
		$("#chlDungeon, #chlCustomWeekly").hide();
		
		// Buttons to toggle view between daily and weekly checklist
		$("#chlDungeonButton").click(function()
		{
			$("#chlCustomButtons button").removeClass("btnFocused");
			$(this).addClass("btnFocused");
			$("#chlCustom").hide();
			$("#chlDungeon").show().css({opacity: 0.5}).animate({opacity: 1}, 400);
			
		});
		$("#chlCustomDailyButton").addClass("btnFocused").click(function()
		{
			$("#chlCustomButtons button").removeClass("btnFocused");
			$(this).addClass("btnFocused");
			$("#chlDungeon").hide();
			$("#chlCustom").show();
			$("#chlCustomWeekly").hide();
			$("#chlCustomDaily").show().css({opacity: 0.5}).animate({opacity: 1}, 400);
		});
		$("#chlCustomWeeklyButton").click(function()
		{
			$("#chlCustomButtons button").removeClass("btnFocused");
			$(this).addClass("btnFocused");
			$("#chlDungeon").hide();
			$("#chlCustom").show();
			$("#chlCustomDaily").hide();
			$("#chlCustomWeekly").show().css({opacity: 0.5}).animate({opacity: 1}, 400);
			
		});
		
		// Initialize the checklists
		X.initializeDungeonChecklist();
		X.initializeCustomChecklist();
	},
	
	/*
	 * Binds dungeon checkbox storage and calculator behavior.
	 */
	initializeDungeonChecklist: function()
	{
		X.initializeChecklist(X.Checklists.Dungeon, $("#chlDungeon input").length);
		
		// Load dungeon icons on demand because they are pretty large
		$("#chlDungeon .chlDungeonBar").each(function()
		{
			$(this).prepend("<ins class='chl_" + $(this).data("name").toLowerCase() + "'></ins>");
		});
		
		var updateCalculator = function()
		{
			var money = X.Checklists.Dungeon.money;
			var gold = ~~(money / E.Exchange.COPPER_IN_GOLD);
			var silver = ~~(money / E.Exchange.SILVER_IN_GOLD) % E.Exchange.COPPER_IN_SILVER;
			var copper = money % E.Exchange.COPPER_IN_SILVER;
			$("#chlDungeonCalculator_Gold").text(gold);
			$("#chlDungeonCalculator_Silver").text(silver);
			$("#chlDungeonCalculator_Copper").text(copper);
		};
		
		// Update checkbox visual and do the calculation when clicked
		$("#chlDungeon input").each(function(pIndex)
		{
			// Bind checkbox behavior
			$(this).change(function()
			{
				var state = X.getCheckboxEnumState($(this));
				
				X.setChecklistItem(X.Checklists.Dungeon, pIndex, state);
				X.styleCheckbox(X.Checklists.Dungeon, pIndex, $(this));
				
				// Sum the checkbox's path money
				var calc = $("#chlDungeonCalculator");
				var money = X.Checklists.Dungeon.money;
				var sum = $(this).data("money");
				
				switch ($(this).data("mode"))
				{
					case "E": sum += calc.data("moneyaddexp"); break;
				}
				
				switch (state)
				{
					case X.ChecklistEnum.Disabled:
					{
						X.Checklists.Dungeon.money = money - sum;
					} break;
					case X.ChecklistEnum.Checked:
					{
						X.Checklists.Dungeon.money = money + sum;
					} break;
					default:
					{
						X.Checklists.Dungeon.money = money - sum;
					}
				}
				updateCalculator();
			});
		});
		// Double click a label (which wraps an input tag) to en/disable the checkbox
		$("#chlDungeon label").each(function(pIndex)
		{
			$(this).dblclick(function()
			{
				var checkbox = $(this).find("input:first-child");

				if (checkbox.prop("disabled") === false)
				{
					/*
					 * The double click triggers the click event, which causes
					 * the calculator to count the disabled checkbox, so trigger
					 * the unchecking of it first before disabling.
					 */
					if (checkbox.prop("checked") === true)
					{
						X.triggerCheckbox(checkbox, X.ChecklistEnum.Unchecked);
					}
					checkbox.prop("disabled", true).prop("checked", false);
				}
				else
				{
					checkbox.prop("disabled", false);
				}
				X.setChecklistItem(X.Checklists.Dungeon, pIndex, X.getCheckboxEnumState(checkbox));
				X.styleCheckbox(X.Checklists.Dungeon, pIndex, checkbox);
			});
		});
		
		// Restore checklist state from stored by triggering the checkboxes (behaviors already bound)
		$("#chlDungeon input").each(function(pIndex)
		{
			X.triggerCheckboxEnumState(X.Checklists.Dungeon, pIndex, $(this));
		});
		
		// Bind uncheck all button
		$("#chlDungeonUncheck").click(function()
		{
			X.clearChecklist(X.Checklists.Dungeon, X.ChecklistJob.UncheckTheChecked);
			$("#chlDungeon input").each(function(pIndex)
			{
				if ($(this).prop("checked") === true)
				{
					$(this).trigger("click");
				};
				X.styleCheckbox(X.Checklists.Dungeon, pIndex, $(this));
			});
		});
	},
	
	/*
	 * Binds checkbox and text field joined behavior.
	 */
	initializeCustomChecklist: function()
	{
		// Generate initial set of checkboxes and textboxes
		var NUM_CHECKBOXES = 12;
		// &zwnj; is an invisible character, used because empty label appears without a right border in Chrome
		var checkboxhtml = "<li><label><input type='checkbox' />&zwnj;</label><input type='text' /></li>";
		for (var i = 0; i < NUM_CHECKBOXES; i++)
		{
			$("#chlCustomListDaily").append(checkboxhtml);
			$("#chlCustomListWeekly").append(checkboxhtml);
		}
		var sampledailylist = ["Did dailies", "Gathered home nodes", "Opened JP chests", "Crafted timegates", "Fed Mawdrey, Star, Princess"];
		var sampleweeklylist = ["Did guild missions", "Farmed personal story key"];
		var insertSampleList = function(pList, pSample)
		{
			for (var i in pSample)
			{
				$(pList + " input[type='text']:eq(" + i + ")").val(pSample[i]);
			}
		};
		insertSampleList("#chlCustomListDaily", sampledailylist);
		insertSampleList("#chlCustomListWeekly", sampleweeklylist);
		
		// Bind checkboxes and textboxes behavior
		var bindCustomChecklistBehavior = function(pChecklist, pTextlist, pListName)
		{
			var checkboxes = $("#chlCustomList" + pListName + " input:checkbox");
			X.initializeChecklist(pChecklist, checkboxes.length);

			checkboxes.each(function(pIndex)
			{
				$(this).change(function()
				{
					var state = X.getCheckboxEnumState($(this));

					X.setChecklistItem(pChecklist, pIndex, state);
					X.styleCheckbox(pChecklist, pIndex, $(this));

					if (state === X.ChecklistEnum.Checked)
					{
						$(this).parent().next().addClass("chlCustomTextChecked");
					}
					else
					{
						$(this).parent().next().removeClass("chlCustomTextChecked");
					}
				});

				// Now that this checkbox is bound, trigger it as the state in checklist
				X.triggerCheckboxEnumState(pChecklist, pIndex, $(this));
			});

			// Bind uncheck all button
			$("#chlCustomUncheck" + pListName).click(function()
			{
				X.clearChecklist(pChecklist, X.ChecklistJob.UncheckTheChecked);
				$("#chlCustomList" + pListName + " input:checkbox").each(function(pIndex)
				{
					if ($(this).prop("checked"))
					{
						$(this).trigger("click");
					};
					X.styleCheckbox(pChecklist, pIndex, $(this));
				});
			});

			// Bind text fields behavior
			var items = $("#chlCustomList" + pListName + " input:text");
			var restore = $("#chlCustomRestore" + pListName);
			X.initializeTextlist(pTextlist, items, "Custom checklist item", 48, restore);
		};
		bindCustomChecklistBehavior(X.Checklists.CustomDaily, X.Textlists.CustomTextDaily, "Daily");
		bindCustomChecklistBehavior(X.Checklists.CustomWeekly, X.Textlists.CustomTextWeekly, "Weekly");
	},
	
	/*
	 * Clears the daily sensitive checklists. Called by the daily reset function.
	 */
	clearCustomChecklistDaily: function()
	{
		$("#chlDungeonUncheck").trigger("click");
		$("#chlCustomUncheckDaily").trigger("click");
		X.clearChecklist(X.Checklists.Dungeon, X.ChecklistJob.UncheckTheChecked);
		X.clearChecklist(X.Checklists.CustomDaily, X.ChecklistJob.UncheckTheChecked);
	},
	clearCustomChecklistWeekly: function()
	{
		$("#chlCustomUncheckWeekly").trigger("click");
		X.clearChecklist(X.Checklists.CustomWeekly, X.ChecklistJob.UncheckTheChecked);
	},
	
	/*
	 * Binds notepad textarea behavior and button pages behavior.
	 */
	initializeNotepad: function()
	{
		// Numbered buttons' behavior
		$("#chlNotepadButtons button").each(function(pIndex)
		{
			$(this).click(function()
			{
				// Show selected number's sheet
				$("#chlNotepadSheets textarea").hide().eq(pIndex).show()
					.css({opacity: 0.5}).animate({opacity: 1}, 400);
				$("#chlNotepadButtons button").removeClass("btnFocused");
				$(this).addClass("btnFocused");
			});
		}).first().click(); // First sheet is default view
		
		// Bind text fields behavior
		var items = $("#chlNotepadSheets textarea");
		var restore = $("#chlNotepadRestore");
		X.initializeTextlist(X.Textlists.NotepadText, items, "Notepad sheet", 4096, restore);
		// Customize notepad according to options
		items.css("height", O.Options.int_sizeNotepadHeight);
		items.css("font-size", O.Options.int_sizeNotepadFont);
		items.first().show();
	}
};

/* =============================================================================
 * @@Economy Trading Post and money
 * ========================================================================== */
E = {
	
	Exchange:
	{
		COPPER_IN_SILVER: 100,
		COPPER_IN_GOLD: 10000,
		SILVER_IN_GOLD: 100,
		
		CENTS_IN_DOLLAR: 100,
		
		GEM_PER_DOLLAR: 0.80,
		DOLLAR_PER_GEM: 1.25,
		
		GEM_SAMPLE: 100, // 100 gem
		COIN_SAMPLE: 1000000, // 100 gold
		
		TAX_LIST: 0.05,
		TAX_SOLD: 0.10,
		TAX_TOTAL: 0.15,
		TAX_INVERSE: 0.85,
		
		INFLUENCE_PER_COPPER: 0.05,
		COPPER_PER_INFLUENCE: 20,
		
		// These variable ratios will be set by API functions
		GemInCoin: 0,
		CoinInGem: 0
	},
	Rarity: // Corresponds to API names for rarity levels
	{
		Junk: 0,
		Basic: 1,
		Fine: 2,
		Masterwork: 3,
		Rare: 4,
		Exotic: 5,
		Ascended: 6,
		Legendary: 7
	},
	cNUM_ITEM_RARITIES: 8,
	
	// Timings in milliseconds
	cREFRESH_LIMIT: 5000, // Time before user is allowed to refresh all outputs again
	cSEARCH_LIMIT: 750, // Time before "as you type" search executes again
	cEXCHANGE_LIMIT: 250, // Time before "as you type" exchange executes again
	
	isTradingCalculatorsInitialized: false,
	RefreshTimeout: {},
	ProgressTimeout: {},
	ProgressWait: 0,
	ProgressTick: 0,
	SwapIndex: -1,
	
	CalculatorHistoryArray: new Array(64),
	CalcHistoryIndex: 0,
	
	copper: function(pString) { return "<copper>" + pString + "</copper>"; },
	silver: function(pString) { return "<silver>" + pString + "</silver>"; },
	gold: function(pString) { return "<gold>" + pString + "</gold>"; },
	
	/*
	 * Parses a period separated string representing those units.
	 * @param string pString to parse.
	 * @returns int the money in copper value for calculating.
	 * @pre String does not contain negative numbers.
	 */
	parseCoinString: function(pString)
	{
		if (pString === undefined || pString === null)
		{
			return 0;
		}
		
		var str = pString.split(".");
		var len = str.length;
		var copper = 0, silver = 0, gold = 0;
		
		if (len === 0)
		{
			return 0;
		}
		if (len === 1)
		{
			silver = parseInt(str[0]);
		}
		
		if (len >= 2)
		{
			copper = parseInt(str[len-1]);
			silver = parseInt(str[len-2]);
		}
		if (len === 2 && str[len-1].length === 1)
		{
			copper = copper * T.cBASE_10; // 0.1 = 10 copper
		}
		if (len >= 3)
		{
			gold = parseInt(str[len-3]);
		}
		
		if ( ! isFinite(copper)) { copper = 0; }
		if ( ! isFinite(silver)) { silver = 0; }
		if ( ! isFinite(gold)) { gold = 0; }
		
		return parseInt(copper + (silver * E.Exchange.COPPER_IN_SILVER) + (gold * E.Exchange.COPPER_IN_GOLD));
	},
	parseGemString: function(pString)
	{
		if (pString === undefined || pString === null)
		{
			return 0;
		}
		if ( ! isFinite(parseInt(pString)))
		{
			return 0;
		}
		return parseInt(pString);
	},
	parseQuantityString: function(pString)
	{
		var quantity = parseInt(pString);
		if ( ! isFinite(quantity)) { quantity = 1; }
		return quantity;
	},
	
	/*
	 * Converts a coin amount in copper to a period separated string.
	 * @param int pAmount of copper.
	 * @returns string coin for displaying.
	 */
	createCoinString: function(pAmount, pWantColor)
	{
		if (pAmount === undefined || isFinite(pAmount) === false)
		{
			return "0.00";
		}
		pAmount = parseInt(pAmount);
		
		var sep = ".";
		var sg0 = ""; var ss0 = ""; var sc0 = "";
		var sg1 = ""; var ss1 = ""; var sc1 = "";
		if (pWantColor)
		{
			// Instead of period separating the currency units, use the coin images
			sep = "";
			sg0 = "<gold>"; ss0 = "<silver>"; sc0 = "<copper>";
			sg1 = "</gold><goldcoin></goldcoin>"; ss1 = "</silver><silvercoin></silvercoin>"; sc1 = "</copper><coppercoin></coppercoin>";
		}
		
		var gold = Math.abs(~~(pAmount / E.Exchange.COPPER_IN_GOLD));
		var silver = Math.abs(~~(pAmount / E.Exchange.SILVER_IN_GOLD) % E.Exchange.COPPER_IN_SILVER);
		var copper = Math.abs(pAmount % E.Exchange.COPPER_IN_SILVER);
		var sign = (pAmount < 0) ? "−" : "";
		
		// Leading zero for units that are right side of the leftmost unit
		if (!pWantColor && (gold > 0 && silver < T.cBASE_10))
		{
			silver = "0" + silver;
		}
		if (!pWantColor && ((silver > 0 && copper < T.cBASE_10) || (copper < T.cBASE_10)))
		{
			copper = "0" + copper;
		}
		
		if (gold > 0)
		{
			return sign + sg0 + gold + sg1 + sep + ss0 + silver + ss1 + sep + sc0 + copper + sc1;
		}
		if (silver > 0)
		{
			return sign + ss0 + silver + ss1 + sep + sc0 + copper + sc1;
		}
		if (pWantColor)
		{
			// No 0 silver prefix for copper-only price if showing color
			return sc0 + copper + sc1;
		}
		return sign + ss0 + "0" + sep + ss1 + sc0 + copper + sc1;
	},
	
	/*
	 * Parses a period separated dollars and cents string.
	 * @param string pString to parse.
	 * @returns int the money in cent value for calculating.
	 * @pre String does not contain negative numbers.
	 */
	parseMoneyString: function(pString)
	{
		if (pString === undefined || pString === null)
		{
			return 0;
		}
		
		var str = pString.split(".");
		var len = str.length;
		var cent = 0, dollar = 0;
		
		if (len === 0)
		{
			return 0;
		}
		if (len === 1)
		{
			dollar = parseInt(str[0]);
		}
		
		if (len >= 2)
		{
			cent = parseInt(str[len-1]);
			dollar = parseInt(str[len-2]);
		}
		if (len >= 2 && str[len-1].length === 1)
		{
			cent = cent * T.cBASE_10; // 0.1 = 10 cent
		}
		else if (len >= 2 && str[len-1].length >= 2)
		{
			cent = parseInt(cent.toString().substring(0, 2)); // Only accept first two digits of cent
		}
		
		if ( ! isFinite(cent)) { cent = 0; }
		if ( ! isFinite(dollar)) { dollar = 0; }
		
		return parseInt(cent + (dollar * E.Exchange.CENTS_IN_DOLLAR));
	},
	
	/*
	 * Converts a money amount in cents to dollars period separated cents string.
	 * @param int pAmount of cents.
	 * @returns string money for displaying.
	 */
	createMoneyString: function(pAmount)
	{
		if (pAmount === undefined || isFinite(pAmount) === false)
		{
			return "0.00";
		}
		pAmount = parseInt(pAmount);
		
		var dollar = Math.abs(~~(pAmount / E.Exchange.CENTS_IN_DOLLAR));
		var cent = Math.abs(pAmount % E.Exchange.CENTS_IN_DOLLAR);
		var sign = (pAmount < 0) ? "−" : "";
		
		if (cent < T.cBASE_10)
		{
			cent = "0" + cent;
		}
		return sign + dollar + "." + cent;
	},
	
	/*
	 * Converts a decimal number into a decimal-less percentage.
	 * @param float pNumber to convert.
	 * @param int pPlaces decimal to keep.
	 * @returns string percentage.
	 */
	createPercentString: function(pNumber, pPlaces)
	{
		if (pNumber === undefined || isFinite(pNumber) === false)
		{
			return "0%";
		}
		if (pPlaces === undefined)
		{
			pPlaces = 0;
		}
		
		var sign = (pNumber < 0) ? "−" : "";
		return sign + Math.abs(pNumber * 100).toFixed(pPlaces) + "%";
	},
	
	/*
	 * Sets an object with an item rarity CSS class. Removes all if level is not provided.
	 * @param jqobject pEntry to remove.
	 * @param string pLevel of rarity.
	 */
	setRarityClass: function(pEntry, pLevel)
	{
		pEntry.each(function()
		{
			for (var i = 0; i < E.cNUM_ITEM_RARITIES; i++)
			{
				$(this).removeClass("rarity" + i.toString());
			}
		});
		if (E.Rarity[pLevel] !== undefined)
		{
			pEntry.addClass("rarity" + (E.Rarity[pLevel]).toString());
		}
	},
	
	/*
	 * Animates the input box's value or the box itself depending on difference.
	 * @param int pOldValue for comparison.
	 * @param int pNewValue for comparison.
	 * @param jqobject pInput to manipulate.
	 */
	animateValue: function(pInput, pOldValue, pNewValue)
	{
		if (pNewValue < pOldValue)
		{
			// Red if value went down
			pInput.css({color: "#ff2200"}).animate({color: "#ffeebb"}, 5000);
		}
		else if (pNewValue > pOldValue )
		{
			// Green if value went up
			pInput.css({color: "#44dd44"}).animate({color: "#ffeebb"}, 5000);
		}
		else
		{
			// Round the box if no change
			pInput.css({"border-radius": 32}).animate({"border-radius": 4}, 1000);
		}
	},
	
	/*
	 * Updates the coin to gem ratio and returns the AJAX object.
	 * @returns jqXHR object.
	 */
	updateCoinInGem: function()
	{
		return $.getJSON(U.URL_API.GemPrice + E.Exchange.COIN_SAMPLE, function(pData)
		{
			if (pData.quantity !== undefined)
			{
				E.Exchange.CoinInGem = E.Exchange.COIN_SAMPLE / pData.quantity;
			}
		});
	},
	updateGemInCoin: function()
	{
		return $.getJSON(U.URL_API.CoinPrice + E.Exchange.GEM_SAMPLE, function(pData)
		{
			if (pData.quantity !== undefined)
			{
				E.Exchange.GemInCoin = E.Exchange.GEM_SAMPLE / pData.quantity;
			}
		});
	},
	
	/*
	 * Deducts Trading Post tax from a value.
	 * @param int pAmount of copper.
	 * @returns int taxed value.
	 */
	deductTax: function(pAmount)
	{
		return parseInt(pAmount - pAmount * E.Exchange.TAX_TOTAL);
	},
	convertGemToMoney: function(pAmount)
	{
		return E.createMoneyString(Math.round(pAmount * E.Exchange.DOLLAR_PER_GEM));
	},
	convertMoneyToGem: function(pAmount)
	{
		return parseInt(pAmount * E.Exchange.GEM_PER_DOLLAR);
	},
	
	/*
	 * Calculates the trading calculator's output textboxes using input textboxes' values.
	 * @param jqobject pEntry trading calculator HTML parent.
	 */
	calculateTrading: function(pEntry)
	{
		// Computable data
		var buy = E.parseCoinString(pEntry.find(".trdBuy").val());
		var sell = E.parseCoinString(pEntry.find(".trdSell").val());
		var quantity = E.parseQuantityString(pEntry.find(".trdQuantity").val());
		
		// Output elements
		var cost = pEntry.find(".trdCost");
		var tax = pEntry.find(".trdTax");
		var revenue = pEntry.find(".trdRevenue");
		var profit = pEntry.find(".trdProfit");
		var breakpoint = pEntry.find(".trdBreak");
		var margin = pEntry.find(".trdMargin");
		
		var profitamount = (sell - (sell * E.Exchange.TAX_TOTAL) - buy) * quantity;
		var revenueamount = (sell - (sell * E.Exchange.TAX_SOLD)) * quantity;
		var costamount = buy * quantity;
		var listamount = (sell * E.Exchange.TAX_LIST) * quantity;
		var taxamount = (sell * E.Exchange.TAX_SOLD) * quantity;
		
		// Do calculation and put them in outputs
		cost.val("−" + E.createCoinString(Math.round(
			costamount
		)));
		tax.val("−" + E.createCoinString(Math.round(
			listamount
			)) + " + −" + E.createCoinString(Math.round(
			taxamount
		)));
		breakpoint.val(E.createCoinString(Math.round(
			buy / E.Exchange.TAX_INVERSE
		)));
		revenue.val(E.createCoinString(Math.round(
			revenueamount
		)));
		profit.val(E.createCoinString(Math.round(
			profitamount
		)));
		margin.val(E.createPercentString(
			(revenueamount / (costamount + listamount)) - 1, 2
		));

		// Color the output numbers depending on sign
		$([profit, margin]).each(function()
		{
			var roundedprofit = Math.round(profitamount);
			$(this).removeClass("trdZero trdGain trdLoss");
			if (roundedprofit === 0) { $(this).addClass("trdZero"); }
			else if (roundedprofit > 0) { $(this).addClass("trdGain"); }
			else if (roundedprofit < 0) { $(this).addClass("trdLoss"); }
		});
	},
	
	/*
	 * Retrieves non-price information about the item and updates those boxes.
	 * @param jqobject pEntry trading calculator HTML parent.
	 */
	updateTradingDetails: function(pEntry)
	{
		var name = pEntry.find(".trdName").val();
		var id = pEntry.find(".trdItem").val();
		if (isFinite(parseInt(id)) === false || name.length === 0)
		{
			return;
		}
		
		$.getJSON(U.URL_API.ItemDetails + id, function(pData)
		{
			E.setRarityClass(pEntry.find(".trdName"), pData.rarity);
			pEntry.attr("data-rarity", pData.rarity);
			pEntry.find(".trdIcon").attr("src", pData.icon);
			pEntry.find(".trdLink").val(U.getChatlinkFromItemID(id));
		});
	},
	
	/*
	 * Retrieves prices from API and updates those boxes.
	 * @param jqobject pEntry trading calculator HTML parent.
	 */
	updateTradingPrices: function(pEntry)
	{
		var name = pEntry.find(".trdName").val();
		var id = pEntry.find(".trdItem").val();
		if (isFinite(parseInt(id)) === false || name.length === 0)
		{
			return;
		}
		
		var previousbuy = 0, previoussell = 0;
		var currentbuy = 0, currentsell = 0;
		var nameelm = pEntry.find(".trdName");
		var buyelm = pEntry.find(".trdCurrentBuy");
		var sellelm = pEntry.find(".trdCurrentSell");
		var buylowelm = pEntry.find(".trdNotifyBuyLow");
		var buyhighelm = pEntry.find(".trdNotifyBuyHigh");
		var selllowelm = pEntry.find(".trdNotifySellLow");
		var sellhighelm = pEntry.find(".trdNotifySellHigh");
		var buylow = E.parseCoinString(buylowelm.val());
		var buyhigh = E.parseCoinString(buyhighelm.val());
		var selllow = E.parseCoinString(selllowelm.val());
		var sellhigh = E.parseCoinString(sellhighelm.val());

		$.getJSON(U.URL_API.ItemPrices + id, function(pData)
		{
			previousbuy = E.parseCoinString(pEntry.find(".trdCurrentBuy").first().val());
			previoussell = E.parseCoinString(pEntry.find(".trdCurrentSell").first().val());
			if (pData.buys !== undefined)
			{
				// Get highest buy order
				currentbuy = parseInt(pData.buys.unit_price);
			}
			if (pData.sells !== undefined)
			{
				// Get lowest sell listing
				currentsell = parseInt(pData.sells.unit_price);
			}
			buyelm.val(E.createCoinString(currentbuy));
			sellelm.val(E.createCoinString(currentsell));
			
			// Overwrite calculator buy and sell prices if opted
			if (X.getChecklistItem(X.Checklists.TradingOverwrite, U.getSubintegerFromHTMLID(pEntry))
					=== X.ChecklistEnum.Checked)
			{
				pEntry.find(".trdBuy").val(buyelm.val()).trigger("input");
				pEntry.find(".trdSell").val(sellelm.val()).trigger("input");
			}
		}).done(function()
		{
			// Animate prices that have changed
			E.animateValue(buyelm, previousbuy, currentbuy);
			E.animateValue(sellelm, previoussell, currentsell);
			
			// Notify if tracked price is within range
			if (X.isChecked(X.Checklists.TradingNotify, pEntry))
			{
				nameelm.removeClass("trdMatched");
				
				if (currentbuy <= buylow && buylow !== 0 && currentbuy !== 0)
				{
					nameelm.addClass("trdMatched");
					buylowelm.addClass("trdMatched");
					D.speak(D.getPhraseTitle("buy low") + " " + name);
				}
				else
				{
					buylowelm.removeClass("trdMatched");
				}

				if (currentbuy >= buyhigh && buyhigh !== 0 && currentbuy !== 0)
				{
					nameelm.addClass("trdMatched");
					buyhighelm.addClass("trdMatched");
					D.speak(D.getPhraseTitle("buy high") + " " + name);
				}
				else
				{
					buyhighelm.removeClass("trdMatched");
				}

				if (currentsell <= selllow && selllow !== 0 && currentsell !== 0)
				{
					nameelm.addClass("trdMatched");
					selllowelm.addClass("trdMatched");
					D.speak(D.getPhraseTitle("sell low") + " " + name);
				}
				else
				{
					selllowelm.removeClass("trdMatched");
				}

				if (currentsell >= sellhigh && sellhigh !== 0 && currentsell !== 0)
				{
					nameelm.addClass("trdMatched");
					sellhighelm.addClass("trdMatched");
					D.speak(D.getPhraseTitle("sell high") + " " + name);
				}
				else
				{
					sellhighelm.removeClass("trdMatched");
				}
			}
		}).fail(function()
		{
			I.write("&quot;" + U.escapeHTML(pEntry.find(".trdName").val()) + "&quot; is not a tradeable item.");
		});
	},
	updateAllTradingDetails: function()
	{
		$("#trdList .trdEntry").each(function(){ E.updateTradingDetails($(this)); });
	},
	updateAllTradingPrices: function()
	{
		$("#trdList .trdEntry").each(function(){ E.updateTradingPrices($(this)); });
	},
	
	/*
	 * Erases unneeded data from the calculator.
	 * @param jqobject pEntry of a calculator.
	 */
	clearCalculator: function(pEntry)
	{
		E.setRarityClass(pEntry.find(".trdName"));
		pEntry.find(".trdIcon").attr("src", U.URL_IMG.Placeholder);
		pEntry.find(".trdItem").val("").trigger("change");
		pEntry.find(".trdCurrentBuy").val("");
		pEntry.find(".trdCurrentSell").val("");
		pEntry.find(".trdLink").val("");
		pEntry.find(".trdResultsContainer").remove();
		
		pEntry.find(".trdNotifyBuyLow").val("").trigger("change");
		pEntry.find(".trdNotifyBuyHigh").val("").trigger("change");
		pEntry.find(".trdNotifySellLow").val("").trigger("change");
		pEntry.find(".trdNotifySellHigh").val("").trigger("change");
		E.clearMatched(pEntry);
	},
	clearMatched: function(pEntry)
	{
		pEntry.find(".trdName").removeClass("trdMatched");
		pEntry.find(".trdNotifyBuyLow").removeClass("trdMatched");
		pEntry.find(".trdNotifyBuyHigh").removeClass("trdMatched");
		pEntry.find(".trdNotifySellLow").removeClass("trdMatched");
		pEntry.find(".trdNotifySellHigh").removeClass("trdMatched");
	},
	
	/*
	 * Generates calculators and binds behavior.
	 */
	initializeTrading: function()
	{
		var i;
		var entry = "";
		var name, buy, sell, quantity;
		
		var createSearchContainer = function(pCalculator)
		{
			var resultscontainer = $("<div class='trdResultsContainer jsRemovable'></div>")
				.insertAfter(pCalculator.find(".trdName"));
			return $("<div class='trdResults cntPopup'>" + I.cThrobber + "</div>").appendTo(resultscontainer);
		};
		var insertSearchResult = function(pData, pQuery, pResultsList)
		{
			$(".trdResults .itemThrobber").remove();
			var outputline = $("<dfn class='rarity" + E.Rarity[pData.rarity] + "' data-id='" + pData.id + "'>"
			+ "<img src='" + pData.icon + "'>"
			+ U.wrapSubstringHTML(pData.name, pQuery, "u") + "</dfn>").appendTo(pResultsList);
			// Bind click a result to memorize the item's ID and name
			outputline.click(function()
			{
				var resultspopup = $(this).parents(".trdResultsContainer");
				var entry = resultspopup.parents(".trdEntry");
				// Change triggers the storage, input triggers the calculation
				entry.find(".trdItem").val($(this).data("id")).trigger("change");
				entry.find(".trdName").val($(this).text()).trigger("change");
				E.updateTradingDetails(entry);
				E.updateTradingPrices(entry);
				resultspopup.remove();
			});
		};
		
		for (i = 0; i < O.Options.int_numTradingCalculators; i++)
		{
			entry = "#trdEntry_" + i;
			// Generate individual calculators
			$("#trdList").append(
				"<div id='trdEntry_" + i + "' class='trdEntry'>"
					+ "<div class='trdAccordion trdAccordionShut'>"
						+ "<samp><img class='trdIcon' src='" + U.URL_IMG.Placeholder + "' /></samp>"
							+ "<div class='trdResultsFocus'><input class='trdName' type='text' /></div>"
						+ "<div class='trdButtons'>"
							+ "<button class='trdSearch' tabindex='-1'>S</button><button class='trdWiki' tabindex='-1'>W</button><br />"
						+ "</div>"
						+ "<div class='trdExpand'>"
							+ "<samp>$~O</samp><input class='trdBuy' type='text' />"
							+ "<samp>−$~</samp><input class='trdCost trdOutput' type='text' tabindex='-1' /><br />"
							+ "<samp>O~$</samp><input class='trdSell' type='text' />"
							+ "<samp>$=$</samp><input class='trdBreak trdOutput' type='text' tabindex='-1' /><br />"
							+ "<samp>×</samp><input class='trdQuantity' type='text' />"
							+ "<samp>−$%</samp><input class='trdTax trdOutput' type='text' tabindex='-1' /><br />"
							+ "<samp>+$</samp><input class='trdProfit trdOutput' type='text' tabindex='-1' />"
							+ "<samp>=$</samp><input class='trdRevenue trdOutput' type='text' tabindex='-1' /><br />"
							+ "<samp>+$%</samp><input class='trdMargin trdOutput' type='text' tabindex='-1' />"
							+ "<samp>[]</samp><input class='trdLink trdOutput' type='text' tabindex='-1' />"
							+ "<input class='trdItem trdOutput' type='text' /><br />"
							+ "<samp>$~!</samp>"
								+ "<input class='trdNotifyBuyHigh' type='text' />"
								+ "<input class='trdCurrentBuy trdOutput' type='text' tabindex='-1' />"
								+ "<input class='trdNotifyBuyLow' type='text' />"
								+ "<label title='<dfn>" + D.getWordCapital("overwrite") + "</dfn>: Replace your buy and sell prices with the current prices when refreshing.'>"
									+ "<input class='trdOverwrite' type='checkbox' tabindex='-1' />&zwnj;</label><br />"
							+ "<samp>!~$</samp>"
								+ "<input class='trdNotifySellHigh' type='text' />"
								+ "<input class='trdCurrentSell trdOutput' type='text' tabindex='-1' />"
								+ "<input class='trdNotifySellLow' type='text' />"
								+ "<label title='<dfn>" + D.getWordCapital("notify") + "</dfn>: Turn on sound notification for this item.'>"
									+"<input class='trdNotify' type='checkbox' tabindex='-1' />&zwnj;</label>"
						+ "<br /><br /></div>"
					+ "</div>"
					+ "<div class='trdPreview'>"
						+ "<input class='trdCurrentBuy trdOutput' type='text' tabindex='-1' />"
						+ "<input class='trdCurrentSell trdOutput' type='text' tabindex='-1' />"
						+ "<div class='trdSwap'>"
							+ "<button class='trdSwapUp' tabindex='-1'></button><button class='trdSwapDown' tabindex='-1'></button>"
						+ "</div>"
					+ "</div>"
				+ "</div>"
			);
			I.qTip.init($(entry + " .trdOverwrite").parent());
			I.qTip.init($(entry + " .trdNotify").parent());
			
			name = $(entry + " .trdName");
			buy = $(entry + " .trdBuy");
			sell = $(entry + " .trdSell");
			quantity = $(entry + " .trdQuantity");
			
			// Bind click to select all text behavior
			$(entry + " input").click(function()
			{
				$(this).select();
			});
			
			// Bind search button behavior for ith calculator
			$(entry + " .trdWiki").click(function()
			{
				var query = $(this).parents(".trdEntry").find(".trdName").val();
				U.openExternalURL(U.getWikiLink(query));
			});
			$(entry + " .trdSearch").click(function()
			{
				var id = $(this).parents(".trdEntry").find(".trdItem").val();
				var query = $(this).parents(".trdEntry").find(".trdName").val();
				if (id.length === 0)
				{
					U.openExternalURL(U.getTradingSearchLink(query));
				}
				else
				{
					U.openExternalURL(U.getTradingItemLink(id, query));
				}
			});
			
			// Bind input textboxes calculate behavior
			$([buy, sell, quantity]).each(function()
			{
				$(this).on("input", function()
				{
					E.calculateTrading($(this).parent());
				});
			});
			
			// Bind current buy/sell prices change auto flanking
			$(entry + " .trdCurrentBuy, " + entry + " .trdCurrentSell").each(function()
			{
				$(this).dblclick(function()
				{
					var price = E.parseCoinString($(this).val());
					if (price !== 0)
					{
						// Assume the inputs are siblings
						$(this).prev().val(E.createCoinString(price + 1)).trigger("change");
						$(this).next().val(E.createCoinString(price - 1)).trigger("change");
						E.updateTradingPrices($(this).parents(".trdEntry"));
					}
				});
			});
			
			// Initial registering of the swap index variable
			$(entry + " .trdSwap").hover(
				function()
				{
					$(this).parents(".trdEntry").find(".trdName").addClass("trdHovered");
					E.SwapIndex = U.getSubintegerFromHTMLID($(this).parents(".trdEntry"));
				},
				function()
				{
					$(".trdName").removeClass("trdHovered");
				}
			);
			
			// Bind swap up/down buttons to swap data between calculators (for manual rearranging)
			$(entry + " .trdSwapUp, " + entry + " .trdSwapDown").each(function()
			{
				$(this).click(function()
				{
					var i = E.SwapIndex;
					var isUp = ($(this).hasClass("trdSwapUp")) ? true : false;
					
					// Do not allow swapping outside of range
					if (isUp && i === 0)
					{
						return;
					}
					if (!isUp === $(".trdEntry").length - 1) 
					{
						return;
					}
					
					var j = isUp ? (i-1) : (i+1);
					var calcA = $("#trdEntry_" + i);
					var calcB = $("#trdEntry_" + j);
					
					// Swap text data from inputs
					var dataA = new Array();
					var dataB = new Array();
					var counterA = 0;
					var counterB = 0;
					calcA.find("input[type='text']").each(function()
					{
						dataA.push($(this).val());
					});
					calcB.find("input[type='text']").each(function()
					{
						dataB.push($(this).val());
					});
					calcA.find("input[type='text']").each(function()
					{
						$(this).val(dataB[counterA]).trigger("change");
						counterA++;
					});
					calcB.find("input[type='text']").each(function()
					{
						$(this).val(dataA[counterB]).trigger("change");
						counterB++;
					});
					// Swap item icon
					var imgA = calcA.find(".trdIcon").attr("src");
					var imgB = calcB.find(".trdIcon").attr("src");
					calcA.find(".trdIcon").attr("src", imgB);
					calcB.find(".trdIcon").attr("src", imgA);
					// Swap rarity color code of the item name
					var rarityA = calcA.attr("data-rarity");
					var rarityB = calcB.attr("data-rarity");
					calcA.attr("data-rarity", rarityB);
					calcB.attr("data-rarity", rarityA);
					E.setRarityClass(calcA.find(".trdName"), rarityB);
					E.setRarityClass(calcB.find(".trdName"), rarityA);
					// Clear matched price styles
					E.clearMatched(calcA);
					E.clearMatched(calcB);
					calcA.find(".trdName").removeClass("trdHovered");
					calcB.find(".trdName").addClass("trdHovered");
					
					// Adjust swap index
					E.SwapIndex = isUp ? (E.SwapIndex-1) : (E.SwapIndex+1);
				});
			});
			
			// Bind name search box behavior
			$(name).on("input", $.throttle(E.cSEARCH_LIMIT, function()
			{
				var query = $(this).val();
				var queryescaped = U.escapeHTML(query);
				var entry = $(this).parents(".trdEntry");
				var resultslist;
				// If keywords are below this length then ignore
				if (query.length < 3)
				{
					// Reset API output boxes
					E.clearCalculator(entry);
					return;
				}
				// If entering an item ID
				if (query.length >= 3 && O.isInteger(query))
				{
					// Create popup container for the items result list
					entry.find(".trdResultsContainer").remove();
					resultslist = createSearchContainer(entry);
					
					$.getJSON(U.URL_API.ItemDetails + query, function(pDataInner)
					{
						insertSearchResult(pDataInner, query, resultslist);
					}).fail(function()
					{
						I.write("No results found for Item ID: " + queryescaped + ".");
						entry.find(".trdResultsContainer").remove();
					});
					return;
				}
				// Else search for item name
				var serviceurl;
				var keyname_id;
				if (O.Options.bol_useMainTPSearch)
				{
					/*
					 * Main API return example:
						{
							"count"		: 50,
							"page"		: 1,
							"last_page"	: 3,
							"results"	: [{
								"data_id"		: 23654,
								"name"					: "Fake Item",
								"rarity"				: 3,
								"restriction_level"		: 72,
								"img"					: "http://www.url-to-offical-gw2-site.com/img.png",
								"type_id"				: 1,
								"sub_type_id"			: 2,
								"price_last_changed"	: "YYYY-MM-DD HH:II:SS UTC",
								"max_offer_unit_price"	: 6523,
								"min_sale_unit_price"	: 9345,
								"offer_availability"	: 1235232,
								"sale_availability"		: 203203,
								"sale_price_change_last_hour"	: 40,
								"offer_price_change_last_hour"	: 70
							, {...}]
						}
					 */
					serviceurl = U.URL_API.ItemSearch + query;
					keyname_id = "data_id";
				}
				else
				{
					/*
					 * Backup API return example:
						[{"name":"Gift of Sunrise","item_id":"19647"},
						{"name":"Sunrise Breeze Dye","item_id":"20641"}]
					 */
					serviceurl = U.URL_API.ItemSearchFallback + query;
					keyname_id = "item_id";
				}

				$.ajax({
					dataType: "json",
					url: serviceurl,
					timeout: 5000,
					success: function(pData)
				{
					entry.find(".trdResultsContainer").remove();
					var thisi;
					var resultid, resultitem;
					var resultarray = (O.Options.bol_useMainTPSearch) ? pData.results : pData;
					
					if (resultarray && resultarray.length > 0)
					{
						// Create popup container for the items result list
						resultslist = createSearchContainer(entry);

						// Add items to the results list
						for (thisi = 0; thisi < resultarray.length && thisi < O.Options.int_numTradingResults; thisi++)
						{
							resultitem = resultarray[thisi];
							resultid = parseInt(resultitem[keyname_id]);
							// Get metadata of each item in the returned search result array
							$.getJSON(U.URL_API.ItemDetails + resultid, function(pDataInner)
							{
								insertSearchResult(pDataInner, query, resultslist);
							});
						}
					}
					else
					{
						I.write("No results found for &quot;" + queryescaped + "&quot;.");
					}
				}}).fail(function()
				{
					I.write("Error retrieving search results. Current search provider may be down.<br />Switching to alternate provider...");
					$("#opt_bol_useMainTPSearch").trigger("click"); // In effect toggles between main and backup for each failure
				});
			})).onEnterKey(function()
			{
				U.openExternalURL(U.getTradingSearchLink($(this).val()));
			}).onEscapeKey(function()
			{
				$(this).parents(".trdEntry").find(".trdResultsContainer").remove();
			}).click(function()
			{
				// Clicking name box also triggers the search
				$(this).trigger("input");
			});
		}
		
		// Set the first entry with initial text as an example
		entry = "#trdEntry_" + 0;
		$(entry + " .trdIcon").attr("src", "img/ui/faq.png");
		$(entry + " .trdName").val("Bifrost");
		$(entry + " .trdBuy").val("4500.37.68");
		$(entry + " .trdSell").val("550037.68");
		$(entry + " .trdQuantity").val("1");
		$(entry).css("margin-bottom", "6px");
		
		// Set tooltip only for the first entry
		var tip = function(pBoxName, pWord, pInfo)
		{
			if (pInfo === undefined)
			{
				pInfo = "";
			}
			else
			{
				pInfo = ": " + pInfo;
			}
			$(entry + " .trd" + pBoxName).attr("title", "<dfn>" + D.getPhraseTitle(pWord) + "</dfn>" + pInfo);
		};
		tip("Name", "name");
		tip("Buy", "your buy");
		tip("Sell", "your sell");
		tip("Quantity", "quantity");
		tip("Cost", "cost", "Money needed to buy the items.");
		tip("Break", "breakpoint" , "Sell higher than this to make a profit.");
		tip("Tax", "tax", "Pay 5% fee of sell price to list, and deduct 10% tax of sell price when sold.");
		tip("Profit", "profit", "Gains after losses from buying and tax.");
		tip("Margin", "margin", "Revenue over cost and fee.");
		tip("Revenue", "revenue", "What you will receive at the trader.");
		tip("Link", "chatlink", "Paste this in game chat to see the item.");
		tip("Item", "ID", "API item number.");
		tip("NotifyBuyLow", "notify if current buy < this buy");
		tip("NotifyBuyHigh", "notify if this buy < current buy");
		tip("NotifySellLow", "notify if current sell < this sell");
		tip("NotifySellHigh", "notify if this sell < current sell");
		tip("CurrentBuy", "current buy", "Double click to flank price.");
		tip("CurrentSell", "current sell", "Double click to flank price.");
		I.qTip.init($(entry + " input"));
		
		// Initialize storage behavior of the input textboxes
		X.initializeTextlist(X.Textlists.TradingItem, $("#trdList .trdItem"), null, 16);
		X.initializeTextlist(X.Textlists.TradingName, $("#trdList .trdName"), null, 64);
		X.initializeTextlist(X.Textlists.TradingBuy, $("#trdList .trdBuy"), null, 16);
		X.initializeTextlist(X.Textlists.TradingSell, $("#trdList .trdSell"), null, 16);
		X.initializeTextlist(X.Textlists.TradingQuantity, $("#trdList .trdQuantity"), null, 16);
		X.initializeTextlist(X.Textlists.NotifyBuyLow, $("#trdList .trdNotifyBuyLow"), null, 16);
		X.initializeTextlist(X.Textlists.NotifyBuyHigh, $("#trdList .trdNotifyBuyHigh"), null, 16);
		X.initializeTextlist(X.Textlists.NotifySellLow, $("#trdList .trdNotifySellLow"), null, 16);
		X.initializeTextlist(X.Textlists.NotifySellHigh, $("#trdList .trdNotifySellHigh"), null, 16);
		
		X.initializeCheckboxlist(X.Checklists.TradingOverwrite, $("#trdList .trdOverwrite"), X.ChecklistJob.CheckAll);
		X.initializeCheckboxlist(X.Checklists.TradingNotify, $("#trdList .trdNotify"), X.ChecklistJob.CheckAll);
		
		// Trigger input textboxes to make the output textboxes update
		$("#trdList .trdSell").trigger("input");
		E.updateAllTradingDetails();
		
		// Bind toggle button to switch between accordion view or open list view of the calculators
		$("#trdToggle").click(function()
		{
			if ($("#trdEntry_0 .trdBuy").is(":visible"))
			{
				$(".trdAccordion").addClass("trdAccordionShut").removeClass("trdAccordionOpen");
				$(".trdPreview").removeClass("cssHidden");
			}
			else
			{
				$(".trdAccordion").removeClass("trdAccordionShut").addClass("trdAccordionOpen");
				$(".trdPreview").addClass("cssHidden");
			}
		});
		
		// Bind refresh button to re-download API data to refresh the calculators
		$("#trdRefresh").click($.throttle(E.cREFRESH_LIMIT, function()
		{
			E.loopRefresh(true);
		}));
		$("#trdMute").click(function()
		{
			D.resetSpeechQueue();
		});
		// Button to print all saved calculator data to console as Comma Separated Values (CSV)
		$("#trdPrint").click(function()
		{
			I.clear();
			I.write("ItemID,Name,Buy,Sell,Quantity,BuyLow,BuyHigh,SellLow,SellHigh");
			var length = X.Textlists.TradingItem.value.length;
			for (var i = 0; i < length; i++)
			{
				I.write(
					U.escapeHTML(X.Textlists.TradingItem.value[i]) + "," +
					U.escapeHTML(X.Textlists.TradingName.value[i]) + "," +
					U.escapeHTML(X.Textlists.TradingBuy.value[i]) + "," +
					U.escapeHTML(X.Textlists.TradingSell.value[i]) + "," +
					U.escapeHTML(X.Textlists.TradingQuantity.value[i]) + "," +
					U.escapeHTML(X.Textlists.NotifyBuyLow.value[i]) + "," +
					U.escapeHTML(X.Textlists.NotifyBuyHigh.value[i]) + "," +
					U.escapeHTML(X.Textlists.NotifySellLow.value[i]) + "," +
					U.escapeHTML(X.Textlists.NotifySellHigh.value[i])
				, 30);
			}
		});
	},
	
	/*
	 * Updates the respective exchanges using the input from top row.
	 */
	updateCoinTo: function(pWantAnimate)
	{
		var previousgem = 0, currentgem = 0;
		var previousmoney = 0, currentmoney = 0;
		var previousgeminverse = 0, currentgeminverse = 0;
		var previousmoneyinverse = 0, currentmoneyinverse = 0;
		var cointo = $("#trdExchange .trdCoinTo");
		var cointogem = $("#trdExchange .trdCoinToGem");
		var cointomoney = $("#trdExchange .trdCoinToMoney");
		var cointogeminverse = $("#trdExchange .trdCoinToGemInverse");
		var cointomoneyinverse = $("#trdExchange .trdCoinToMoneyInverse");
		
		var cointoamount = E.parseCoinString(cointo.val());
		if (cointoamount === 0)
		{
			cointogem.val("");
			cointomoney.val("");
			cointogeminverse.val("");
			cointomoneyinverse.val("");
		}
		else
		{
			// User's coin to gem
			$.getJSON(U.URL_API.GemPrice + cointoamount, function(pData)
			{
				if (pData.quantity !== undefined)
				{
					previousgem = parseInt(cointogem.val());
					previousmoney = E.parseMoneyString(cointomoney.val());
					currentgem = parseInt(pData.quantity);
					currentmoney = Math.round(currentgem * E.Exchange.DOLLAR_PER_GEM);
					
					cointogem.val(currentgem);
					cointomoney.val(E.createMoneyString(currentmoney));
				}
			}).always(function()
			{
				if (pWantAnimate === undefined || pWantAnimate)
				{
					E.animateValue(cointogem, previousgem, currentgem);
					E.animateValue(cointomoney, previousmoney, currentmoney);
				}
				
				if (currentgem === 0)
				{
					// Got here if value is too low be exchanged
					cointogem.val("0");
					cointomoney.val("0");
				}
			});
			
			// Gem to user's coin
			E.updateGemInCoin().always(function()
			{
				if (E.Exchange.GemInCoin !== 0)
				{
					previousgeminverse = parseInt(cointogeminverse.val());
					previousmoneyinverse = E.parseMoneyString(cointomoneyinverse.val());
					
					currentgeminverse = Math.round(cointoamount * E.Exchange.GemInCoin);
					currentmoneyinverse = Math.round(currentgeminverse * E.Exchange.DOLLAR_PER_GEM);
					cointogeminverse.val(currentgeminverse);
					cointomoneyinverse.val(E.createMoneyString(currentmoneyinverse));
					
					if (pWantAnimate === undefined || pWantAnimate)
					{
						E.animateValue(cointogeminverse, previousgeminverse, currentgeminverse);
						E.animateValue(cointomoneyinverse, previousmoneyinverse, currentmoneyinverse);
					}
				}
			});
		}
	},
	updateGemTo: function(pWantAnimate)
	{
		var previouscoin = 0, currentcoin = 0;
		var previousmoney = 0, currentmoney = 0;
		var previouscoininverse = 0, currentcoininverse = 0;
		var gemto = $("#trdExchange .trdGemTo");
		var gemtocoin = $("#trdExchange .trdGemToCoin");
		var gemtomoney = $("#trdExchange .trdGemToMoney");
		var gemtocoininverse = $("#trdExchange .trdGemToCoinInverse");
		
		var gemtoamount = gemto.val();
		if (gemtoamount === 0)
		{
			gemtocoin.val("");
			gemtomoney.val("");
		}
		else
		{
			// User's gem to coin
			$.getJSON(U.URL_API.CoinPrice + gemtoamount, function(pData)
			{
				if (pData.quantity !== undefined)
				{
					previouscoin = E.parseCoinString(gemtocoin.val());
					previousmoney = E.parseMoneyString(gemtomoney.val());
					currentcoin = parseInt(pData.quantity);
					currentmoney = parseInt(gemtoamount * E.Exchange.DOLLAR_PER_GEM);
					
					gemtocoin.val(E.createCoinString(currentcoin));
					gemtomoney.val(E.createMoneyString(currentmoney));
				}
			}).always(function()
			{
				if (pWantAnimate === undefined || pWantAnimate)
				{
					E.animateValue(gemtocoin, previouscoin, currentcoin);
					E.animateValue(gemtomoney, previousmoney, currentmoney);
				}
				
				if (currentcoin === 0)
				{
					// Got here if value is too low be exchanged
					gemtocoin.val("0");
					gemtomoney.val("0");
				}
			});
			
			// Coin to user's gem
			E.updateCoinInGem().always(function()
			{
				if (E.Exchange.CoinInGem !== 0)
				{
					previouscoininverse = E.parseCoinString(gemtocoininverse.val());
					currentcoininverse = Math.round(gemtoamount * E.Exchange.CoinInGem);
					gemtocoininverse.val(E.createCoinString(currentcoininverse));
					
					if (pWantAnimate === undefined || pWantAnimate)
					{
						E.animateValue(gemtocoininverse, previouscoininverse, currentcoininverse);
					}
				}
			});
		}
	},
	updateMoneyTo: function(pWantAnimate)
	{
		var previousgem = 0, currentgem = 0;
		var previouscoin = 0, currentcoin = 0;
		var moneyto = $("#trdExchange .trdMoneyTo");
		var moneytogem = $("#trdExchange .trdMoneyToGem");
		var moneytocoin = $("#trdExchange .trdMoneyToCoin");
		
		var moneytoamount = E.parseMoneyString(moneyto.val());
		var gems = moneytoamount * E.Exchange.GEM_PER_DOLLAR;
		if (moneytoamount === 0)
		{
			moneytogem.val("");
			moneytocoin.val("");
		}
		else
		{
			$.getJSON(U.URL_API.CoinPrice + gems, function(pData)
			{
				if (pData.quantity !== undefined)
				{
					previousgem = parseInt(moneytogem.val());
					previouscoin = E.parseCoinString(moneytocoin.val());
					currentgem = gems;
					currentcoin = parseInt(pData.quantity);
					
					moneytogem.val(gems);
					moneytocoin.val(E.createCoinString(currentcoin));
				}
			}).always(function()
			{
				if (pWantAnimate === undefined || pWantAnimate)
				{
					E.animateValue(moneytogem, previousgem, currentgem);
					E.animateValue(moneytocoin, previouscoin, currentcoin);
				}
				
				if (currentcoin === 0)
				{
					// Got here if value is too low be exchanged
					moneytogem.val("0");
					moneytocoin.val("0");
				}
			});
		}
	},
	updateNotifyCoinTo: function(pWantAnimate)
	{
		var previousgem = 0, currentgem = 0;
		var cointo = $("#trdExchange .trdNotifyCoinTo");
		var cointogem = $("#trdExchange .trdNotifyCoinToGem");
		
		var gemhighelm = $("#trdExchange .trdNotifyCoinToGemHigh");
		var gemhigh = E.parseGemString(gemhighelm.val());
		
		var cointoamount = E.parseCoinString(cointo.val());
		if (cointoamount === 0)
		{
			cointogem.val("");
		}
		else
		{
			// User's coin to gem
			$.getJSON(U.URL_API.GemPrice + cointoamount, function(pData)
			{
				if (pData.quantity !== undefined)
				{
					previousgem = parseInt(cointogem.val());
					currentgem = parseInt(pData.quantity);
					
					cointogem.val(currentgem);
				}
			}).always(function()
			{
				if (pWantAnimate === undefined || pWantAnimate)
				{
					E.animateValue(cointogem, previousgem, currentgem);
				}
				
				if (currentgem === 0)
				{
					// Got here if value is too low be exchanged
					cointogem.val("0");
				}
				else if (currentgem >= gemhigh && gemhigh !== 0)
				{
					gemhighelm.addClass("trdMatched");
					D.speak(D.getPhraseTitle("buy gem high"));
				}
				else
				{
					gemhighelm.removeClass("trdMatched");
				}
			});
		}
	},
	updateNotifyGemTo: function(pWantAnimate)
	{
		var previouscoin = 0, currentcoin = 0;
		var gemto = $("#trdExchange .trdNotifyGemTo");
		var gemtocoin = $("#trdExchange .trdNotifyGemToCoin");
		
		var coinhighelm = $("#trdExchange .trdNotifyGemToCoinHigh");
		var coinhigh = E.parseCoinString(coinhighelm.val());
		
		var gemtoamount = gemto.val();
		if (gemtoamount === 0)
		{
			gemtocoin.val("");
		}
		else
		{
			// User's gem to coin
			$.getJSON(U.URL_API.CoinPrice + gemtoamount, function(pData)
			{
				if (pData.quantity !== undefined)
				{
					previouscoin = E.parseCoinString(gemtocoin.val());
					currentcoin = parseInt(pData.quantity);
					
					gemtocoin.val(E.createCoinString(currentcoin));
				}
			}).always(function()
			{
				if (pWantAnimate === undefined || pWantAnimate)
				{
					E.animateValue(gemtocoin, previouscoin, currentcoin);
				}
				
				if (currentcoin === 0)
				{
					// Got here if value is too low be exchanged
					gemtocoin.val("0");
				}
				else if (currentcoin >= coinhigh && coinhigh !== 0)
				{
					coinhighelm.addClass("trdMatched");
					D.speak(D.getPhraseTitle("buy coin high"));
				}
				else
				{
					coinhighelm.removeClass("trdMatched");
				}
			});
		}
	},
	updateAllExchange: function()
	{
		E.updateCoinTo();
		E.updateGemTo();
		E.updateMoneyTo();
		
		E.updateNotifyCoinTo();
		E.updateNotifyGemTo();
	},
	
	/*
	 * Binds behavior of exchange input boxes.
	 */
	initializeExchange: function()
	{
		var cointo = $("#trdExchange .trdCoinTo");
		var gemto = $("#trdExchange .trdGemTo");
		var moneyto = $("#trdExchange .trdMoneyTo");
		var notifycointo = $("#trdExchange .trdNotifyCoinTo");
		var notifygemto = $("#trdExchange .trdNotifyGemTo");
		var notifycointogemhigh = $("#trdExchange .trdNotifyCoinToGemHigh");
		var notifygemtocoinhigh = $("#trdExchange .trdNotifyGemToCoinHigh");
		
		// Initial values as an example
		cointo.val("200..");
		gemto.val("4000");
		moneyto.val("50");
		
		var tip = function(pBoxName, pPhrase)
		{
			$("#trdExchange .trd" + pBoxName).attr("title", "<dfn>" + D.getPhraseTitle(pPhrase) + "</dfn>");
		};
		tip("CoinTo", "your coin");
		tip("GemTo", "your gem");
		tip("MoneyTo", "your dollar");
		tip("CoinToGem", "your coin to gem");
		tip("GemToCoin", "your gem to coin");
		tip("MoneyToGem", "your dollar to gem");
		tip("CoinToMoney", "your coin to dollar");
		tip("GemToMoney", "your gem to dollar");
		tip("MoneyToCoin", "your dollar to coin");
		tip("CoinToGemInverse", "gem to your coin");
		tip("GemToCoinInverse", "coin to your gem");
		tip("CoinToMoneyInverse", "dollar to your coin");
		
		tip("NotifyCoinTo", "your coin");
		tip("NotifyGemTo", "your gem");
		tip("NotifyCoinToGem", "your coin to current gem");
		tip("NotifyGemToCoin", "your gem to current coin");
		tip("NotifyCoinToGemHigh", "notify if current gem > this gem");
		tip("NotifyGemToCoinHigh", "notify if current coin > this coin");
		I.qTip.init($("#trdExchange input"));
		
		// Bind behavior
		$("#trdExchange input").click(function()
		{
			$(this).select();
		});
		
		cointo.on("input", $.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateCoinTo(false);
		})).onEnterKey($.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateCoinTo();
		}));
		
		gemto.on("input", $.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateGemTo(false);
		})).onEnterKey($.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateGemTo();
		}));
		
		moneyto.on("input", $.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateMoneyTo(false);
		})).onEnterKey($.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateMoneyTo();
		}));
		
		notifycointo.on("input", $.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateNotifyCoinTo(false);
		})).onEnterKey($.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateNotifyCoinTo();
		}));
		
		notifygemto.on("input", $.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateNotifyGemTo(false);
		})).onEnterKey($.throttle(E.cEXCHANGE_LIMIT, function()
		{
			E.updateNotifyGemTo();
		}));
		
		// Initialize storage behavior of inputs
		X.initializeTextlist(X.Textlists.ExchangeUnit,
			$([cointo, gemto, moneyto, notifycointo, notifygemto, notifycointogemhigh, notifygemtocoinhigh]), null, 16);
		
		// Finally, loop the refresh function
		$(".trdProgress").data("width", $(".trdProgress").width());
		E.isTradingCalculatorsInitialized = true;
		E.loopRefresh();
	},
	
	/*
	 * Cancels current loop refresh and progress bar.
	 */
	cancelLoopRefresh: function()
	{
		window.clearTimeout(E.ProgressTimeout);
		window.clearTimeout(E.RefreshTimeout);
		$(".trdProgress").width($(".trdProgress").data("width"));
	},
	
	/*
	 * Decreases the width of the progress line every second for the duration
	 * of the refresh wait time.
	 */
	animateProgress: function()
	{
		var progress = $(".trdProgress");
		if (E.ProgressTick < E.ProgressWait)
		{
			progress.width(progress.width() - (progress.data("width") / E.ProgressWait));
		}
		E.ProgressTick -= 1;
		
		E.ProgressTimeout = setTimeout(E.animateProgress, T.cMILLISECONDS_IN_SECOND);
	},
	
	/*
	 * Calls the refresh calculator function on regular interval.
	 */
	loopRefresh: function(pForce)
	{
		E.cancelLoopRefresh();
		
		if (pForce === true || O.Options.bol_refreshPrices)
		{
			E.updateAllTradingPrices();
			E.updateAllExchange();
			
			if (O.Options.bol_refreshPrices)
			{
				var wait = O.Options.int_secTradingRefresh * T.cMILLISECONDS_IN_SECOND;
				// Animate progress bar with same duration as refresh wait time
				E.ProgressTick = O.Options.int_secTradingRefresh;
				E.ProgressWait = O.Options.int_secTradingRefresh;
				E.animateProgress();
				// Repeat this function
				E.RefreshTimeout = setTimeout(E.loopRefresh, wait);
			}
		}
	},
	
	/*
	 * Binds behavior of the generic calculator.
	 */
	initializeCalculator: function()
	{
		// Calculation behavior
		$("#trdCalculation .trdCalculator").onEnterKey(function()
		{
			E.doCalculation($(this));
		}).click(function()
		{
			$(this).select();
		});
		// Assume expression input box is left sibling of the submit button
		$("#trdCalculation .trdCalcSubmit").click(function()
		{
			E.doCalculation($(this).prev());
		});
		
		// History behavior
		for (var i in E.CalculatorHistoryArray)
		{
			E.CalculatorHistoryArray[i] = "";
		}
		
		$("#trdCalculation .trdCalculator").onArrowUpKey(function()
		{
			if (E.CalcHistoryIndex === 0)
			{
				var expression = U.stripToCalculation($(this).val());
				if (E.CalculatorHistoryArray[0] !== $(this).val().toString())
				{
					E.CalculatorHistoryArray.pop();
					E.CalculatorHistoryArray.unshift(expression);
				}
			}
			if (E.CalcHistoryIndex + 1 < E.CalculatorHistoryArray.length)
			{
				E.CalcHistoryIndex++;
				$(this).val(E.CalculatorHistoryArray[E.CalcHistoryIndex]);
			}
		});
		$("#trdCalculation .trdCalculator").onArrowDownKey(function()
		{
			if (E.CalcHistoryIndex - 1 >= 0)
			{
				E.CalcHistoryIndex--;
				$(this).val(E.CalculatorHistoryArray[E.CalcHistoryIndex]);
			}
		});
	},
	
	/*
	 * Performs the expression on a generic calculator.
	 * This function uses eval(), so must sanitize user input.
	 * @param jqobject pCalculator input box containing user's expression.
	 */
	doCalculation: function(pCalculator)
	{
		var expression = U.stripToCalculation(pCalculator.val());
		var result = "";
		try
		{
			result = eval(expression);
		}
		catch (pException) {}
		
		pCalculator.val(parseFloat(result)).select();
		if (result.toString().length > 0)
		{
			E.CalculatorHistoryArray.pop();
			E.CalculatorHistoryArray.unshift(expression);
			E.CalcHistoryIndex = 0;
		}
	}
};

/* =============================================================================
 * @@Dictionary to translate readable/listenable strings
 * ========================================================================== */
D = {
	
	Dictionary:
	{
		s_TEMPLATE: {de: "", es: "", fr: "", cs: "", it: "", pl: "", pt: "", ru: "", zh: ""},
		
		// Time
		s_w: {de: "w", es: "s", fr: "s", cs: "t", it: "s", pl: "t", pt: "s", ru: "н", zh: "週"},
		s_d: {de: "t", es: "d", fr: "j", cs: "d", it: "g", pl: "d", pt: "d", ru: "д", zh: "日"},
		s_h: {de: "h", es: "h", fr: "h", cs: "h", it: "o", pl: "g", pt: "h", ru: "ч", zh: "時"},
		s_m: {de: "m", es: "m", fr: "m", cs: "m", it: "m", pl: "m", pt: "m", ru: "м", zh: "分"},
		s_s: {de: "s", es: "s", fr: "s", cs: "s", it: "s", pl: "s", pt: "s", ru: "с", zh: "秒"},
		s_hour: {de: "stunde", es: "hora", fr: "heure", cs: "hodina", it: "ora", pl: "godzinę", pt: "hora", ru: "час", zh: "時"},
		s_minute: {de: "minute", es: "minuto", fr: "minute", cs: "minuta", it: "minuto", pl: "minuta", pt: "minuto", ru: "минута", zh: "分"},
		s_second: {de: "sekunde", es: "segundo", fr: "seconde", cs: "sekunda", it: "secondo", pl: "sekund", pt: "segundo", ru: "секунду", zh: "秒"},
		s_hours: {de: "studen", es: "horas", fr: "heures", cs: "hodin", it: "secondi", pl: "godzin", pt: "horas", ru: "часов", zh: "時"},
		s_minutes: {de: "minuten", es: "minutos", fr: "minutes", cs: "minut", it: "minuti", pl: "minut", pt: "minutos", ru: "минут", zh: "分"},
		s_seconds: {de: "sekunden", es: "segundos", fr: "secondes", cs: "sekund", it: "ore", pl: "sekund", pt: "segundos", ru: "секунд", zh: "秒"},
		s_half_an_hour: {de: "eine halbe stunde", es: "media hora", fr: "demi-heure",
			cs: "půl hodiny", it: "mezz'ora", pl: "pół godziny", pt: "meia hora", ru: "полчаса", zh: "半小時"},
		
		// Nouns
		s_timers: {de: "zeitgeber", es: "temporizadores", fr: "minuteurs",
			cs: "časovače", it: "timer", pl: "czasomierzy", pt: "temporizadores", ru: "таймеров", zh: "計時器"},
		s_tools: {de: "extras", es: "herramientas", fr: "outils",
			cs: "nástroje", it: "strumenti", pl: "narzędzia", pt: "ferramentas", ru: "инструменты", zh: "工具"},
		s_help: {de: "hilfe", es: "ayuda", fr: "assistance",
			cs: "pomoci", it: "guida", pl: "pomoc", pt: "ajuda", ru: "помощь", zh: "輔助"},
		s_options: {de: "optionen", es: "opciónes", fr: "options",
			cs: "možnosti", it: "opzioni", pl: "opcje", pt: "opções", ru: "параметры", zh: "選項"},
		s_arrival: {de: "ankunft", es: "llegada", fr: "arrivée",
			cs: "příjezd", it: "arrivo", pl: "przyjazd", pt: "chegada", ru: "прибытие", zh: "到來"},
		s_world: {de: "welt", es: "mundo", fr: "monde",
			cs: "svět", it: "mondo", pl: "świat", pt: "mundo", ru: "босс", zh: "世界"},
		s_boss: {de: "boss", es: "jefe", fr: "chef",
			cs: "boss", it: "boss", pl: "szef", pt: "chefe", ru: "мировой", zh: "頭目"},
		s_event: {de: "event", es: "evento", fr: "événement",
			cs: "událost", it: "evento", pl: "wydarzenie", pt: "evento", ru: "собы́тие", zh: "事件"},
		s_section: {de: "paragraph", es: "sección", fr: "section",
			cs: "oddíl", it: "sezione", pl: "sekcja", pt: "seção", ru: "раздел", zh: "節"},
		s_map: {de: "karte", es: "mapa", fr: "carte",
			cs: "mapa", it: "mappa", pl: "mapa", pt: "mapa", ru: "ка́рта", zh: "地圖"},
		s_center: {de: "zentrum", es: "centro", fr: "centre",
			cs: "střed", it: "centro", pl: "środek", pt: "centro", ru: "центр", zh: "中心"},
		s_character: {de: "person", es: "personaje", fr: "personnage",
			cs: "postava", it: "personaggio", pl: "postać", pt: "personagem", ru: "персона́ж", zh: "人物"},
		s_completion: {de: "abschluss", es: "finalización", fr: "progression",
			cs: "dokončení", it: "completamento", pl: "ukończenie", pt: "progressão", ru: "завершение", zh: "完成"},
		s_route: {de: "route", es: "ruta", fr: "route",
			cs: "trasa", it: "percorso", pl: "trasa", pt: "rota", ru: "маршру́т", zh: "路線"},
		s_pins: {de: "nadeln", es: "agujas", fr: "aiguilles",
			cs: "jehly", it: "aghi", pl: "igły", pt: "agulhas", ru: "иглы", zh: "針"},
		s_Vista: {de: "Aussichtspunkt", es: "Vista", fr: "Panorama", zh: "鳥瞰點"},
		s_Hero_Challenge: {de: "Heldenherausforderung", es: "Desafío de héroe", fr: "Défi de héros", zh: "技能點"},
		s_checklist: {de: "prüfliste", es: "lista de comprobación", fr: "liste de contrôle",
			cs: "kontrolní seznam", it: "elenco di controllo", pl: "lista kontrolna", pt: "lista de verificação", ru: "контрольный список", zh: "檢查清單"},
		s_subscription: {de: "abonnement", es: "suscripción", fr: "abonnement",
			cs: "předplatné", it: "sottoscrizione", pl: "abonament", pt: "assinatura", ru: "подписка", zh: "訂閱"},
		s_alarm: {de: "alarm", es: "alarma", fr: "alarme",
			cs: "alarmu", it: "allarme", pl: "alarmu", pt: "alarme", ru: "будильника", zh: "鬧鐘"},
		s_mode: {de: "modus", es: "modo", fr: "mode",
			cs: "režim", it: "modalità", pl: "tryb", pt: "modo", ru: "режим", zh: "方式"},
		s_chatlink: {de: "chatlink", es: "vínculo chat", fr: "lien chat",
			cs: "chat odkaz", it: "collegamento chat", pl: "czat łącze", pt: "link bate-papo", ru: "чат связь", zh: "連結聊天"},
		s_wvw: {de: "WvW", es: "McM", fr: "McM",
			cs: "SpS", it: "McM", pl: "SkS", pt: "McM", ru: "МпМ", zh: "世界戰場"},
		
		// Verbs
		s_is: {de: "ist", es: "es", fr: "est",
			cs: "je", it: "è", pl: "jest", pt: "é", ru: "является", zh: "是"},
		s_subscribe: {de: "abonnieren", es: "subscribir", fr: "abonner",
			cs: "předplatit si", it: "sottoscrivere", pl: "abonować", pt: "assinar", ru: "подписаться", zh: "訂閱"},
		s_will_start: {de: "wird starten", es: "se iniciará", fr: "débutera",
			cs: "začne", it: "inizierà", pl: "rozpocznie się", pt: "começará", ru: "начнется", zh: "開始"},
		s_click: {de: "klicken", es: "clic", fr: "cliquer",
			cs: "kliknout", it: "clic", pl: "klikać", pt: "clicar", ru: "щелкнуть", zh: "按一下"},
		s_clear: {de: "löschen", es: "borrar", fr: "effacer",
			cs: "vymazat", it: "cancella", pl: "wyczyść", pt: "limpar", ru: "очистить", zh: "清除"},
		s_toggle: {de: "umschalten", es: "alternar", fr: "basculer",
			cs: "přepnout", it: "alterna", pl: "przełączanie", pt: "alternar", ru: "переключить", zh: "切換"},
		s_expand: {de: "erweitern", es: "expandir", fr: "développer",
			cs: "rozbalit", it: "espandere", pl: "rozwinąć", pt: "expandir", ru: "развернуть", zh: "展開"},
		s_collapse: {de: "reduzieren", es: "contraer", fr: "réduire",
			cs: "sbalit", it: "comprimere", pl: "zwinąć", pt: "recolher", ru: "свернуть", zh: "摺疊"},
		s_draw: {de: "zeichnen", es: "dibujar", fr: "dessiner",
			cs: "kreslit", it: "disegnare", pl: "rysować", pt: "desenhar", ru: "рисова́ть", zh: "画"},
		
		// Adjectives and Adverbs
		s_ago: {de: "vor", es: "hace", fr: "il ya",
			cs: "před", it: "fa", pl: "temu", pt: "há", ru: "назад", zh: "前"},
		s_also: {de: "auch", es: "también", fr: "aussi",
			cs: "také", it: "anche", pl: "też", pt: "também", ru: "то́же", zh: "也"},
		s_checked: {de: "abgehakt", es: "visto", fr: "coché",
			cs: "odškrtnout", it: "controllato", pl: "zakończony", pt: "marcado", ru: "включен", zh: "勾掉"},
		s_current: {de: "aktuelle", es: "actual", fr: "actuel",
			cs: "současný", it: "corrente", pl: "bieżący", pt: "corrente", ru: "текущий", zh: "活期"},
		s_daily: {de: "täglich", es: "diaria", fr: "quotidien",
			cs: "denní", it: "giornaliero", pl: "dzienny", pt: "diário", ru: "ежедневно", zh: "每天"},
		s_next: {de: "nächste", es: "siguiente", fr: "prochain",
			cs: "příští", it: "seguente", pl: "następny", pt: "próximo", ru: "следующий", zh: "下一"},
		s_off: {de: "aus", es: "desactivado", fr: "désactivé",
			cs: "vypnuto", it: "disattivato", pl: "wyłączany", pt: "desativado", ru: "выключено", zh: "關"},
		s_predicted: {de: "vorhergesagt", es: "previsto", fr: "prédit",
			cs: "předpovídal", it: "previsto", pl: "przewiduje", pt: "predito", ru: "предсказанный", zh: "預測"},
		s_subscribed: {de: "abonniert", es: "suscrito", fr: "souscrit",
			cs: "odebírané", it: "sottoscritti", pl: "subskrypcji", pt: "assinado", ru: "подписан", zh: "訂閱"},
		s_then: {de: "dann", es: "luego", fr: "puis",
			cs: "pak", it: "poi", pl: "potem", pt: "então", ru: "затем", zh: "接著"},
		
		// Prepositions and Conjunctions
		s_at: {de: "um", es: "a", fr: "à",
			cs: "v", it: "a", pl: "o", pt: "a", ru: "в", zh: "在"},
		s_and: {de: "und", es: "y", fr: "et",
			cs: "a", it: "e", pl: "i", pt: "e", ru: "и", zh: "和"},
		s_if: {de: "wenn", es: "si", fr: "si",
			cs: "jestliže", it: "se", pl: "jeśli", pt: "se", ru: "если", zh: "如果"},
		s_in: {de: "in", es: "en", fr: "en",
			cs: "za", it: "in", pl: "w", pt: "em", ru: "в", zh: "在"},
		s_to: {de: "zu", es: "a", fr: "contre",
			cs: "ku", it: "a", pl: "na", pt: "a", ru: "до", zh: "比"},
		
		// Automatic
		s_Scheduled_Bosses: {de: "Geplant", es: "Programado", fr: "Planifié",
			cs: "Plánované", it: "Pianificata", pl: "Zaplanowane", pt: "Agendado", ru: "Запланирован", zh: "已排程"},
		s_Dry_Top: {de: "Trockenkuppe", es: "Cima Seca", fr: "Cimesèche", zh: "干涸高地"},
		s_Legacy_Bosses: {de: "Legacy", es: "Heredado", fr: "Hérité",
			cs: "Starší", it: "Legacy", pl: "Starsze", pt: "Herdado", ru: "Устаревший", zh: "舊版"},
		s_Orr_Temples: {de: "Tempel", es: "Templos", fr: "Temples",
			cs: "Chrámy", it: "Templi", pl: "Świątynie", pt: "Templos", ru: "Храмы", zh: "寺廟"},
		s_Full_Timetable: {de: "Zeitplan", es: "Horario", fr: "Horaire",
			cs: "Plán", it: "Programma", pl: "Harmonogram", pt: "Horário", ru: "Расписание", zh: "時間表"},
		s_Gem_Store_Promotions: {de: "Edelsteinshop Aktionen", es: "Tienda de gemas promociones", fr: "Boutique aux gemmes promotions",
			cs: "Drahokam Prodejna Propagace", it: "Negozio gemma promozioni", pl: "Klejnot Sklep Promocje", pt: "Loja gema promoções", ru: "Самоцве́т Магази́н Продвижения", zh: "寶石商店促銷"},
		s_news: {de: "nachrichten", es: "noticias", fr: "actualités",
			cs: "zprávy", it: "notizie", pl: "wiadomości", pt: "notícias", ru: "новости", zh: "新聞"},
		s_simple: {de: "einfach", es: "simple", fr: "simple",
			cs: "prostý", it: "semplice", pl: "prosty", pt: "simples", ru: "простой", zh: "簡單"},
		s_mobile: {de: "mobil", es: "móvil", fr: "mobile",
			cs: "mobilní", it: "mobile", pl: "mobilna", pt: "móvel", ru: "мобильный", zh: "行動"},
		s_tile: {de: "kachel", es: "mosaico", fr: "mosaïque",
			cs: "dlaždice", it: "affianca", pl: "sąsiadująco", pt: "ladrilho", ru: "замостить", zh: "磚"},
		s_chests: {de: "truhen", es: "cofres", fr: "coffres",
			cs: "truhly", it: "scrigni", pl: "skrzynie", pt: "baús", ru: "сундуки", zh: "寶箱"},
		
		// Economy
		s_this: {de: "dieses", es: "esto", fr: "ce",
			cs: "toto", it: "questo", pl: "to", pt: "isto", ru: "это", zh: "這"},
		s_your: {de: "dein", es: "tu", fr: "ton",
			cs: "tvůj", it: "tuo", pl: "twój", pt: "teu", ru: "твой", zh: "你的"},
		s_name: {de: "namen", es: "nombre", fr: "nom",
			cs: "název", it: "nome", pl: "nazwa", pt: "nome", ru: "имя", zh: "名"},
		s_buy: {de: "kaufen", es: "comprar", fr: "acheter",
			cs: "koupit", it: "comprare", pl: "kupić", pt: "comprar", ru: "купить", zh: "買"},
		s_sell: {de: "verkaufen", es: "vender", fr: "vendre",
			cs: "prodat", it: "vendere", pl: "sprzedać", pt: "vender", ru: "продать", zh: "賣"},
		s_quantity: {de: "quantität", es: "cantidad", fr: "quantité",
			cs: "množství", it: "quantità", pl: "ilość", pt: "quantidade", ru: "количество", zh: "量"},
		s_profit: {de: "gewinn", es: "beneficio", fr: "profit",
			cs: "zisk", it: "profitto", pl: "zysk", pt: "lucro", ru: "прибыль", zh: "利潤"},
		s_cost: {de: "kosten", es: "costo", fr: "coût",
			cs: "náklady", it: "costo", pl: "koszt", pt: "custo", ru: "стоимость", zh: "成本"},
		s_breakpoint: {de: "gewinnschwelle", es: "punto muerto", fr: "seuil de rentabilité",
			cs: "bod zvratu", it: "punto di pareggio", pl: "próg rentowności", pt: "ponto de equilíbrio", ru: "точка безубыточности", zh: "收支平衡點"},
		s_tax: {de: "steuer", es: "impuestos", fr: "impôt",
			cs: "daň", it: "fiscale", pl: "podatek", pt: "fiscal", ru: "налог", zh: "稅"},
		s_revenue: {de: "einnahmen", es: "ingresos", fr: "revenus",
			cs: "příjmy", it: "entrate", pl: "dochody", pt: "receita", ru: "доходов", zh: "收入"},
		s_margin: {de: "marge", es: "margen", fr: "marge",
			cs: "marže", it: "margine", pl: "marża", pt: "margem", ru: "валовая", zh: "邊際"},
		s_low: {de: "niedrigen", es: "bajo", fr: "bas",
			cs: "nízký", it: "bassa", pl: "niski", pt: "baixa", ru: "низкая", zh: "低"},
		s_high: {de: "hohen", es: "alta", fr: "haut",
			cs: "vysoký", it: "alta", pl: "wysoki", pt: "alta", ru: "высокая", zh: "高"},
		s_notify: {de: "benachrichtigen", es: "notificar", fr: "notifier",
			cs: "oznámit", it: "notifica", pl: "powiadom", pt: "notificar", ru: "уведомить", zh: "通知"},
		s_overwrite: {de: "überschreiben", es: "sobrescribir", fr: "remplacer",
			cs: "přepsat", it: "sovrascrivi", pl: "zastąp", pt: "substituir", ru: "перезаписать", zh: "覆寫"},
		s_gem: {de: "edelsteine", es: "gema", fr: "gemme",
			cs: "klenot", it: "gemma", pl: "klejnot", pt: "gema", ru: "самоцвет", zh: "寶石"},
		s_coin: {de: "münze", es: "moneda", fr: "monnaie",
			cs: "mince", it: "moneta", pl: "moneta", pt: "moeda", ru: "монета", zh: "硬幣"},
		s_dollar: {de: "dollar", es: "dólar", fr: "dollar",
			cs: "dolar", it: "dollaro", pl: "polar", pt: "dólar", ru: "доллар", zh: "元"}
	},
	
	/*
	 * Gets a dictionary entry translated based on the opted language.
	 * @param string pText text to translate without spaces.
	 * @returns string translated text.
	 */
	getTranslation: function(pText)
	{
		// If opted language is English then just return the given text
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return pText;
		}
		
		// Else look up the text in the dictionary
		var entry;
		var value;
		var text = pText;
		if (text.indexOf(" ") !== -1)
		{
			// Spaces become underscores
			text = text.replace(/ /g, "_");
		}
		
		var entry = D.Dictionary["s_" + text];
		if (entry)
		{
			// Get the text based on user's language
			value = entry[O.Options.enu_Language];
			if (value)
			{
				return value;
			}
		}
		// Language not found so use given instead
		return pText;
	},
	getWord: function(pText)
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return pText;
		}
		// No error checking, assume entry exists
		return (D.Dictionary["s_" + pText])[O.Options.enu_Language];
	},
	getWordCapital: function(pWord)
	{
		return U.toFirstUpperCase(D.getTranslation(pWord));
	},
	
	/*
	 * Translates multiple space separated words.
	 * @param string pString of words.
	 * @param enum pCase to change capitalization.
	 * @returns string translated.
	 */
	getPhrase: function(pString, pCase)
	{
		if (pCase === undefined)
		{
			pCase = U.CaseEnum.None;
		}
		
		var str = pString.split(" ");
		if (pCase === U.CaseEnum.Original)
		{
			for (var i in str)
			{
				str[i] = D.duplicateCase(str[i], D.getTranslation(str[i].toLowerCase()));
			}
		}
		else
		{
			for (var i in str)
			{
				str[i] = D.getTranslation(str[i]);
			}
		}
		
		var text = (D.isLanguageLogographic()) ? str.join("") : str.join(" ");
		if (pCase === U.CaseEnum.None || pCase === U.CaseEnum.Original)
		{
			return text;
		}
		return U.toCase(text, pCase);
	},
	getPhraseTitle: function(pString)
	{
		return D.getPhrase(pString, U.CaseEnum.Every);
	},
	getPhraseOriginal: function(pString)
	{
		if (O.Options.enu_Language !== O.OptionEnum.Language.Default)
		{
			return D.getPhrase(pString, U.CaseEnum.Original);
		}
		return pString;
	},
	
	/*
	 * Gets a word and modifier string in language-dependent order in specified case.
	 * @param string pWord a noun for example.
	 * @param string pModifier an adjective for example.
	 * @param enum pCase to change the phrase's capitalization.
	 * @returns string modified word phrase.
	 */
	getModifiedWord: function(pWord, pModifier, pCase)
	{
		return D.getPhrase(D.orderModifier(pWord, pModifier), pCase);
	},
	orderModifier: function(pWord, pModifier)
	{
		return D.isLanguageModifierFirst() ? (pModifier + " " + pWord) : (pWord + " " + pModifier);
	},
	
	/*
	 * Duplicates the case style of a source word to the translated word.
	 * @param string pSourceWord single and without whitespace.
	 * @param string pTranslatedWord to format with the same case.
	 */
	duplicateCase: function(pSourceWord, pTranslatedWord)
	{
		// If first letter is lowercase, assume the whole word is lowercase
		var firstletter = pSourceWord.charAt(0);
		if (firstletter === firstletter.toLowerCase())
		{
			return pTranslatedWord; // The dictionary is in lowercase by default, so no need to do it again
		}
		// If first two letters are capitalized, then assume all caps
		if (pSourceWord.length > 2 && pTranslatedWord.length > 2)
		{
			var secondletter = pSourceWord.charAt(1);
			if (firstletter === firstletter.toUpperCase() && secondletter === secondletter.toUpperCase())
			{
				return pTranslatedWord.toUpperCase();
			}
		}
		// For any other conditions, capitalize the first letter of the translated word
		return pTranslatedWord.charAt(0).toUpperCase() + pTranslatedWord.slice(1);
	},
	
	/*
	 * Finds element with the translation CSS class and translates them.
	 */
	translateElements: function()
	{
		if (O.Options.enu_Language !== O.OptionEnum.Language.Default)
		{
			// Translate each word individually for these elements
			$(".jsTranslate").each(function()
			{
				$(this).text(D.getPhraseOriginal($(this).text()))
					.removeClass("jsTranslate");
			});
			// Translate the entire text content as a compound word for these elements
			$(".jsTranslateCompound").each(function()
			{
				$(this).text(D.getTranslation($(this).text()))
					.removeClass("jsTranslateCompound");
			});
		}
	},
	
	/*
	 * Does translations for preloaded (not AJAX or generated) content, also
	 * re-initializes tooltips.
	 */
	translateAfter: function()
	{
		if (O.Options.enu_Language !== O.OptionEnum.Language.Default)
		{
			// Translate tooltips
			$("#paneMenu kbd").each(function()
			{
				$(this).attr("title", "<dfn>" + D.getPhraseOriginal($(this).find(".jsTranslate").text()) + "</dfn>");
				I.qTip.init($(this));
			});
			$(".mapHUDButton").each(function()
			{
				$(this).attr("title", D.getPhraseOriginal($(this).attr("title")));
			});
			D.translateElements();
		}
		I.qTip.init(".mapHUDButton");
	},
	
	/*
	 * Tells if the user's opted language is an GW2 supported language
	 * which has translations already done.
	 * @returns boolean if fully supported.
	 */
	isLanguageFullySupported: function()
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.English
			|| O.Options.enu_Language === O.OptionEnum.Language.German
			|| O.Options.enu_Language === O.OptionEnum.Language.Spanish
			|| O.Options.enu_Language === O.OptionEnum.Language.French)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Gets the language code of the opted fully supported language, or the default if isn't.
	 * @returns string language code.
	 */
	getFullySupportedLanguage: function()
	{
		if (D.isLanguageFullySupported())
		{
			return O.Options.enu_Language;
		}
		return O.OptionEnum.Language.Default;
	},
	getPartiallySupportedLanguage: function()
	{
		if (D.isLanguageFullySupported()
			|| O.Options.enu_Language === O.OptionEnum.Language.Mandarin)
		{
			return O.Options.enu_Language;
		}
		return O.OptionEnum.Language.Default;
	},
	
	/*
	 * Retrieves the name property of an object that was prefixed with a language code.
	 * Example: Object has first level properties: name_en: "Example Name", name_de: "Weise Name"
	 * @param object pObject to extract name.
	 * @returns name in user's language.
	 */
	getNameKey: function()
	{
		return "name_" + D.getFullySupportedLanguage();
	},
	getURLKey: function()
	{
		return "url_" + D.getFullySupportedLanguage();
	},
	getObjectName: function(pObject)
	{
		if (pObject["name_" + O.Options.enu_Language] !== undefined)
		{
			return pObject["name_" + O.Options.enu_Language];
		}
		return D.getObjectDefaultName(pObject);
	},
	getObjectDefaultName: function(pObject)
	{
		return pObject["name_" + O.OptionEnum.Language.Default];
	},
	getObjectURL: function(pObject)
	{
		return pObject["url_" + D.getFullySupportedLanguage()];
	},
	
	/*
	 * Tells if the user's opted language is fully supported but not the default.
	 * @returns true if so.
	 */
	isLanguageSecondary: function()
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.German
			|| O.Options.enu_Language === O.OptionEnum.Language.Spanish
			|| O.Options.enu_Language === O.OptionEnum.Language.French)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Tells if adjective-noun or adverb-verb modifier is before the modified
	 * depending on opted language.
	 * @returns boolean true if modifier is before the modified.
	 */
	isLanguageModifierFirst: function()
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.French
			|| O.Options.enu_Language === O.OptionEnum.Language.Spanish
			|| O.Options.enu_Language === O.OptionEnum.Language.Italian
			|| O.Options.enu_Language === O.OptionEnum.Language.Portuguese
			|| O.Options.enu_Language === O.OptionEnum.Language.Mandarin)
		{
			return false;
		}
		return true;
	},
	
	/*
	 * Tells if current language uses logograms instead of letters.
	 * @returns true if logographic.
	 */
	isLanguageLogographic: function()
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Mandarin)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Gets title of chain in opted language.
	 * @param int pIndex of chain.
	 * @returns string title.
	 */
	getChainTitle: function(pChain)
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return pChain.title;
		}
		return D.getObjectName(pChain);
	},
	
	/*
	 * Gets short title of chain in opted language.
	 * @param int pIndex of chain.
	 * @returns string short title.
	 */
	getChainAlias: function(pChain)
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return pChain.alias;
		}
		return D.getChainTitle(pChain);
	},
	
	/*
	 * Plays an audio representation of provided string, using Chrome's TTS
	 * system if the user is running it. Otherwise loads a TTS sound file
	 * generated from a TTS web service into a hidden audio tag.
	 * @param string pString to convert to speech.
	 * @param float pDuration of the speech in seconds.
	 * https://developers.google.com/web/updates/2014/01/Web-apps-that-talk---Introduction-to-the-Speech-Synthesis-API?hl=en
	 * Google Speech Synthesis API:
		var msg = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices();
		msg.voice = voices[10]; // Note: some voices don't support altering params
		msg.voiceURI = "native";
		msg.volume = 1; // 0 to 1
		msg.rate = 1; // 0.1 to 10
		msg.pitch = 2; //0 to 2
		msg.text = "Hello World";
		msg.lang = "en-US";
		speechSynthesis.speak(msg);
	 */
	speechWait: 0, // In milliseconds
	speak: function(pString, pDuration)
	{
		// Chrome-only TTS service
		if (I.isSpeechSynthesisEnabled)
		{
			var msg = new SpeechSynthesisUtterance(pString);
			msg.lang = O.LanguageCode[O.Options.enu_Language];
			msg.volume = O.Options.int_setVolume / T.cPERCENT_100;
			msg.rate = 0.8;
			window.speechSynthesis.speak(msg);
			return;
		}
		
		// If using other TTS service then use custom queue system
		var doSpeak = function(pStringMacro)
		{
			var tts = document.getElementById("jsTTSAudio");
			tts.src = "http://code.responsivevoice.org/getvoice.php?tl=" + O.LanguageCode[O.Options.enu_Language] + "&sv=&vn=&pitch=0.5&rate=0.4&vol=1&t=" + pStringMacro;
			tts.volume = O.Options.int_setVolume / T.cPERCENT_100;
			tts.load();
			tts.play();
		};
		
		if (pDuration === undefined)
		{
			// If no duration is given, then estimate speech length
			var charspersecond = (D.isLanguageLogographic()) ? 4 : 12;
			pDuration = 1 + (Math.round(pString.length / charspersecond));
		}
		
		var durationms = pDuration * T.cMILLISECONDS_IN_SECOND;
		if (D.speechWait === 0)
		{
			// If no speech in queue then speak and add queue time, finally subtract after duration
			D.speechWait += durationms;
			doSpeak(pString);
			setTimeout(function()
			{
				D.speechWait -= durationms;
			}, durationms);
		}
		else
		{
			// If speech in queue then wait added queue time, finally speak and subtract after duration
			D.speechWait += durationms;
			setTimeout(function()
			{
				if (D.speechWait > 0)
				{
					doSpeak(pString);
					D.speechWait -= durationms;
				}
			}, D.speechWait - durationms);
		}
	},
	isSpeaking: function()
	{
		if (D.speechWait === 0)
		{
			return false;
		}
		return true;
	},
	stopSpeech: function()
	{
		if (I.isSpeechSynthesisEnabled)
		{
			window.speechSynthesis.cancel();
		}
		else
		{
			document.getElementById("jsTTSAudio").src = "";
		}
	},
	
	/*
	 * Stops speech if the wait time is over the threshold.
	 * @param int pSeconds threshold.
	 */
	resetSpeechQueue: function(pSeconds)
	{
		if (pSeconds === undefined)
		{
			pSeconds = 0;
		}
		
		if (D.speechWait > (pSeconds * T.cMILLISECONDS_IN_SECOND))
		{
			D.speechWait = 0;
			D.stopSpeech();
		}
	},
	
	
	/*
	 * Gets translation for given text to be spoken.
	 * @param string pText to lookup.
	 * @param string pModifier optional adjective or adverb.
	 * @returns string translated text or given text.
	 */
	getSpeech: function(pText, pModifier)
	{
		if (pModifier)
		{
			return D.getModifiedWord(pText, pModifier);
		}
		return D.getPhrase(pText);
	},
	
	/*
	 * Gets pronunciation of chain in opted language.
	 * @param object pChain to get.
	 * @returns string pronunciation.
	 */
	getChainPronunciation: function(pChain)
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Default
			|| I.BrowserCurrent !== I.BrowserEnum.Chrome)
		{
			return C.Chains[pChain.nexus].pronunciation;
		}
		return D.getChainTitle(pChain);
	},
	
	/*
	 * Sorts an array of objects by its language name.
	 * @param array pObjects.
	 */
	sortObjects: function(pObjects)
	{
		var key = D.getNameKey();
		pObjects.sort(function (a, b)
		{
			if (a[key] > b[key])
			{
				return 1;
			}
			if (a[key] < b[key])
			{
				return -1;
			}
			return 0;
		});
	}
};

/* =============================================================================
 * @@Chains of events
 * ========================================================================== */
C = {
	
	/*
	 * http://gw2timer.com/data/chains.js holds an array of meta event chain objects,
	 * which themselves contain an array of their events.
	 * This is referred to by the variable "C.Chains".
	 */
	Chains: GW2T_CHAIN_DATA,
	DryTop: {},
	// The word and variable "nexus" is simply a chain's index number in the Chains array
	cIndexSynonym: "nexus",
	ChainToday: null,
	CurrentChainSD: {}, NextChainSD1: {}, NextChainSD2: {}, NextChainSD3: {}, NextChainSD4: {},
	CurrentChainHC: {}, NextChainHC1: {}, NextChainHC2: {}, NextChainHC3: {}, NextChainHC4: {},
	CurrentChainLS: {}, NextChainLS1: {}, NextChainLS2: {},
	CurrentChains: [],
	CurrentChainsSD: [],
	PreviousChains1: [],
	PreviousChains2: [],
	NextChains1: [],
	cEventTitleCharLimit: 44,
	cEventNameWidth: 320,
	RegularChains: [], // Scheduled world bosses
	ScheduledChains: [], // Any scheduled chain
	DryTopChains: [],
	LegacyChains: [],
	TempleChains: [],
	LivingStoryChains: [],
	ChainSeriesEnum:
	{
		Temple: 0, // Unscheduled Orr temples
		Legacy: 1, // Unscheduled chains that still gives a rare
		ScheduledCutoff: 1,
		Standard: 2, // Scheduled non-hardcore chains
		Hardcore: 3, // Scheduled challenging chains with a separate schedule from non-hardcores
		ChainCutoff: 4,
		DryTop: 4, // Scheduled Dry Top chains
		LivingStory: 5
	},
	EventPrimacyEnum:
	{
		Optional: 0, // A failure or optional subevent; includes temple retake event which should be ignored
		Normal: 1, // A concurrent (multiple simultaneous) event that does not take the longest to complete
		Primary: 2, // An only event at the time or a concurrent event that takes the longest to complete
		Boss: 3 // The boss event, also considered a primary event
	},
	isDryTopGenerated: false,
	isDryTopIconsShown: false,
	isTimetableGenerated: false,
	
	/*
	 * Gets a chain from its alias.
	 * @param string pAlias.
	 * @returns object chain.
	 * @pre ChainAssociation object has the requested chain.
	 */
	getChainByAlias: function(pAlias)
	{
		return C.Chains[T.ChainAssociation[pAlias.toLowerCase()]];
	},
	getChainRegion: function(pChain)
	{
		return M.getZoneRegion(pChain.extra[0]);
	},
	
	/*
	 * Assigns today's chain object to the calendar's world boss, if available.
	 * @param boolean pIsTomorrow whether today's boss won't spawn before reset.
	 */
	updateChainToday: function(pIsTomorrow)
	{
		var date = new Date();
		pIsTomorrow = pIsTomorrow || false;
		if (pIsTomorrow === true)
		{
			date = T.addDaysToDate(date, 1);
		}
		var dayofmonth = date.getUTCDate();
		var alias = (T.DailyCalendar[dayofmonth].pve[3].split(" "))[0].toLowerCase();
		var chain;
		
		var currentmins = T.getTimeSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Minutes);
		var startmins;
		
		if (T.ChainAssociation[alias] !== undefined)
		{
			chain = C.Chains[T.ChainAssociation[alias]];
			startmins = T.convertScheduleKeyToUTCMinutes(chain.scheduleKeys[0]);
			if (pIsTomorrow === false)
			{
				if (startmins + T.cMINUTES_IN_TIMEFRAME >= currentmins)
				{
					// Make sure today's boss can still spawn before server reset at UTC midnight
					C.ChainToday = chain;
				}
				else
				{
					// Else get tomorrow's boss
					C.ChainToday = null;
					//C.updateChainToday(true);
				}
			}
			else
			{
				if (startmins + T.cMINUTES_IN_TIMEFRAME < currentmins)
				{
					C.ChainToday = chain;
				}
				else
				{
					C.ChainToday = null;
				}
			}
		}
		else
		{
			// No boss for this day
			C.ChainToday = null;
		}
	},
	
	/*
	 * Tells if specified chain is today's daily world boss.
	 * @param object pChain to compare.
	 * @returns true if daily.
	 */
	isChainToday: function(pChain)
	{
		if (C.ChainToday && pChain.nexus === C.ChainToday.nexus)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Shows the daily icon for today's daily boss, if available.
	 * @pre Used variables has been reinitialized.
	 */
	showChainDailyIcon: function()
	{
		// Reimage the waypoint icon if boss on clock is daily
		for (var i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
		{
			if (C.isChainToday(C.CurrentChainsSD[i]))
			{
				(K["WpChain" + i]).addClass("clkWaypointDaily");
			}
			else
			{
				(K["WpChain" + i]).removeClass("clkWaypointDaily");
			}
		}

		// Chain bar
		$(".chnDaily").hide();
		if (C.ChainToday)
		{
			$(".chnDaily_" + C.ChainToday.nexus).show();
		}
		// Restyle timetable
		C.updateTimetable();
	},
	
	/*
	 * Tells if a chain is timed by the schedule.
	 * @param object pChain to check.
	 * @returns boolean true if scheduled else false.
	 */
	isChainScheduled: function(pChain)
	{
		if (pChain.series > C.ChainSeriesEnum.ScheduledCutoff)
		{
			return true;
		}
		return false;
	},
	isChainWorldBoss: function(pChain)
	{
		if (pChain.series < C.ChainSeriesEnum.ChainCutoff)
		{
			return true;
		}
		return false;
	},
	isChainRegular: function(pChain)
	{
		if (pChain.series === C.ChainSeriesEnum.Standard ||
			pChain.series === C.ChainSeriesEnum.Hardcore||
			pChain.series === C.ChainSeriesEnum.LivingStory)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Returns the substring before the "XXX" delimiter in a chain alias.
	 * Used for reusing chain icons of different chains.
	 * @param string pAlias of the chain.
	 * @returns string common alias of the chain.
	 */
	parseChainAlias: function(pAlias)
	{
		if (pAlias.indexOf("XXX") !== -1)
		{
			return pAlias.split("XXX")[0];
		}
		return pAlias;
	},
	
	/*
	 * Gets the integer part of an event number, for example: "10A2" returns "10".
	 * @param string pNumber of the event.
	 * @returns string integer of the event.
	 */
	getEventStepNumber: function(pNumber)
	{
		if (pNumber.length === 1)
		{
			return pNumber;
		}
		else
		{
			var i;
			var integer = "";
			for (i = 0; i < pNumber.length; i++)
			{
				if (isFinite(pNumber.charAt(i)))
				{
					integer += pNumber.charAt(i);
				}
				else
				{
					return integer;
				}
			}
			return integer;
		}
	},

	/*
	 * Initializes the chain HTML plate with chains and their individual events.
	 * Calculates time sums for chains and pushes to array for later accessing by the ticker.
	 * @param object pChain chain to initialize.
	 */
	initializeChain: function(pChain)
	{
		var i, ii;
		var event;
		var chainextra = "";
		var chainname = D.getObjectName(pChain);
		
		if (C.isChainWorldBoss(pChain))
		{
			chainextra = "<input class='chnWaypoint' type='text' value='" + pChain.waypoint + " " + chainname + "' /> "
				+ " (" + pChain.extra[1] + ")"
					+ "<a href='" + U.convertExternalURL(U.getYouTubeLink(D.getObjectDefaultName(pChain) + " " + I.cGameNick)) + "' target='_blank'>"
					+ "<ins class='s16 s16_youtube' title='Recommended level. Click for YouTube videos.'></ins></a> "
				+ pChain.extra[2] + "<ins class='s16 s16_ecto' title='Ecto'></ins> "
				+ pChain.extra[3] + "<ins class='s16 s16_loot' title='Loot'></ins> "
				+ pChain.extra[4] + "<ins class='s16 s16_dragonite' title='Dragonite'></ins> ";
		}
		
		/*
		 * A chain bar (HTML) is a rectangle that contains the event chain icon,
		 * chain title, time, individual events listed, and other elements.
		 * Lots of CSS IDs and classes here, so update if the CSS changed.
		 */
		$(pChain.htmllist).append(
		"<div id='chnBar_" + pChain.nexus + "' class='chnBar'>"
			+ "<div class='chnTitle'>"
				+ "<img id='chnIcon_" + pChain.nexus + "' src='img/chain/" + C.parseChainAlias(pChain.alias).toLowerCase() + I.cPNG + "' />"
				+ "<samp id='chnCheck_" + pChain.nexus + "' class='chnCheck'></samp>"
				+ "<h1 id='chnTitle_" + pChain.nexus + "'>" + chainname + "</h1>"
				+ "<time id='chnTime_" + pChain.nexus + "' class='chnTimeFutureFar'></time>"
				+ "<aside><img class='chnDaily chnDaily_" + pChain.nexus + "' src='img/ui/daily.png' /></aside>"
			+ "</div>"
			+ "<div id='chnDetails_" + pChain.nexus + "' class='chnDetails'>"
				+ "<ol id='chnEvents_" + pChain.nexus + "' class='chnEvents'></ol>"
				+ "<div class='chnDetailsExtra'>"
					+ chainextra
					+ "<kbd id='chnDelete_" + pChain.nexus + "' title='Permanently hide this event chain (can undo in ▼ icon above).'></kbd>"	
				+ "</div>"
			+ "</div>"
		+ "</div>");

		/*
		 * Inserts an event with icon and necessary indentation into the ol.
		 * @param object pChain to get chain info.
		 * @param object pEvent to extract information.
		 */
		var insertEventToBarHTML = function(pChain, pEvent)
		{
			var e = pEvent;
			var b = "&lt;br /&gt;";
			var w = function(pS)
			{
				return "&lt;dfn&gt;" + pS + "&lt;/dfn&gt;";
			};
			// Tooltip when user hovers over the tiny orange event icon
			var eventhtmltitle = "";
			if (pChain.series === C.ChainSeriesEnum.DryTop)
			{
				eventhtmltitle = w("Event Number: ") + e.num + b
					+ w("Start Time: ") + e.lim + b
					+ b + "&amp;quot;" + D.getObjectName(e).replace(/["']/g, "") + "&amp;quot;";
			}
			else
			{
				eventhtmltitle = w("Event Number: ") + e.num + b
					+ w("If Success Go To: ") + e.sGotoNum + b
					+ w("If Failure Go To: ") + e.fGotoNum + b
					+ w("If Success Wait: ") + e.sInterim + b
					+ w("If Failure Wait: ") + e.fInterim + b
					+ w("Time Limit: ") + e.lim + b
					+ w("Avg to Complete: ") + e.avg + b
					+ w("Min to Complete: ") + e.min + b
					+ w("Max to Complete: ") + e.max + b
					+ b + "&amp;quot;" + D.getObjectName(e).replace(/["']/g, "") + "&amp;quot;";
			}
			
			var classsubstep = "";
			var eventnamelimit = C.cEventTitleCharLimit;
			var indentEvent = function()
			{
				classsubstep = "chnSubstep";
				eventnamelimit = C.cEventTitleCharLimit - 4;
			};
			
			/*
			 * Indent concurrent events, except the first one in the step.
			 * For example: events numbered 1A1 1A2 1B1 1B2; 1A1 and 1B1 happens
			 * at the same time. For simplicity, indent all events starting with
			 * "1" except 1A1. Events numbered like 1A 1B are short for 1A1 1B1.
			 */
			// If the event number is an integer without concurrent letters
			var step = C.getEventStepNumber(e.num);
			if (step.length !== e.num.length)
			{
				var subnum = e.num.slice(step.length);
				if (e.num.indexOf(".") !== -1) // Always indent failure events
				{
					indentEvent();
				}
				else if (e.num.length === 2)
				{
					if (subnum.indexOf("A") === -1 && subnum.indexOf("a") === -1)
					{
						indentEvent();
					}
				}
				else if (subnum.indexOf("A1") === -1 && subnum.indexOf("a1") === -1)
				{
					indentEvent();
				}
			}
			$("#chnEvents_" + pChain.nexus).append(
			"<li id='chnEvent_" + pChain.nexus + "_" + e.num + "' class='chnStep_" + pChain.nexus + "_" + e.step + " " + classsubstep + "'>"
				+ "<ins class='evt_" + e.icon + "' title='" + eventhtmltitle + "'></ins>"
				+ "<span>" + U.truncateString(D.getObjectName(e), eventnamelimit, "..") + "</span>"
			+ "</li>");
		};

		/*
		 * Initialize the chain by summing its events' min/avg/max times.
		 * The primary event array holds events temporally significant to the chain.
		 * For example: the "1A destroy chaotic materials" and "1B escort Rooba"
		 * events happen at the same time so they share the same first event
		 * number (the "step" number), but "escort Rooba" is considered primary
		 * because it takes the longest. Each event gets the three new time
		 * variables equalling how far into the chain they are.
		 */
		for (i in pChain.events)
		{
			event = pChain.events[i];
			if (event.primacy === C.EventPrimacyEnum.Primary)
			{
				pChain.primaryEvents.push(event);
			}
			else if (event.primacy === C.EventPrimacyEnum.Boss)
			{
				pChain.primaryEvents.push(event);
				// 0 because the first primary event does not have precedents
				pChain.primaryEvents[0].minSum = 0;
				pChain.primaryEvents[0].avgSum = 0;
				pChain.primaryEvents[0].minavgSum = 0;
				break;
			}
		}
		for (i = 1; i < pChain.primaryEvents.length; i++)
		{
			/*
			 * iterated event's xxxSum = the previous primary event's xxx time
			 *		+ the previous primary event's success interim
			 *		+ the previous primary event's xxxSum;
			 */
			var previoussuccessinterim = T.parseEventTime(pChain.primaryEvents[i-1].sInterim[0]);

			pChain.primaryEvents[i].minSum = T.parseEventTime(pChain.primaryEvents[i-1].min)
				+ previoussuccessinterim + pChain.primaryEvents[i-1].minSum;
			pChain.primaryEvents[i].avgSum = T.parseEventTime(pChain.primaryEvents[i-1].avg)
				+ previoussuccessinterim + pChain.primaryEvents[i-1].avgSum;
			// minavgSum = minSum + (avgSum - minSum)/2;
			pChain.primaryEvents[i].minavgSum = pChain.primaryEvents[i].minSum
				+ ~~(Math.abs(pChain.primaryEvents[i].avgSum - pChain.primaryEvents[i].minSum) / 2);
		}
		/*
		 * min time for the entire chain to finish is the final primary event's
		 * minSum plus the final primary event's min.
		 * Note that i was post-incremented in the for loop after exiting.
		 */
		i--;
		pChain.minFinish = pChain.primaryEvents[i].minSum
			+ T.parseEventTime(pChain.primaryEvents[i].min);
		pChain.avgFinish = pChain.primaryEvents[i].avgSum
			+ T.parseEventTime(pChain.primaryEvents[i].avg);
		pChain.minavgFinish = pChain.minFinish + ~~(Math.abs(pChain.avgFinish - pChain.minFinish)/2);
		
		/*
		 * Now with an array of primary events created, link the non-primary
		 * events and create HTML elements so they can be displayed in totality.
		 */
		ii = 0;
		// Unscheduled events don't need queued accessing
		if ( ! C.isChainScheduled(pChain))
		{
			for (i in pChain.events)
			{
				insertEventToBarHTML(pChain, pChain.events[i]);
			}
		}
		else // Scheduled events need to remember concurrent events
		{
			for (i in pChain.events)
			{
				// Ignore failure events and optional defense events
				if (pChain.events[i].primacy !== C.EventPrimacyEnum.Optional)
				{
					// Compare the first character of their event number
					if (C.getEventStepNumber(pChain.events[i].num)
						!== C.getEventStepNumber(pChain.primaryEvents[ii].num))
					{
						ii++;
					}
					/*
					 * Each primary event has references to their concurrent
					 * events, which will later be used to highlight them.
					 */ 
					insertEventToBarHTML(pChain, pChain.events[i]);
				}
				// If reached the boss event (which has been added), then stop looping
				if (pChain.events[i].primacy === C.EventPrimacyEnum.Boss)
				{
					break;
				}
			}
		}
		
		/*
		 * Show individual events of a chain bar if clicked on, or
		 * automatically shown by the ticker function.
		 */
		if (I.ModeCurrent !== I.ModeEnum.Tile)
		{
			$("#chnTitle_" + pChain.nexus).click(function()
			{
				$(this).parent().next().slideToggle(100);
			});
			$("#chnDetails_" + pChain.nexus).hide();
		}
		if (O.Options.enu_Language === O.OptionEnum.Language.Default && I.isMapEnabled)
		{
			$("#chnBar_" + pChain.nexus).hover(
				function() { $("#chnTitle_" + pChain.nexus).text(D.getChainTitle(pChain)); },
				function() { $("#chnTitle_" + pChain.nexus).text(D.getObjectName(pChain)); }
			);
		}
		$("#chnDetails_" + pChain.nexus + " .chnWaypoint").click(function()
		{
			$(this).select();
		});
		
		// Initialize tooltips
		I.qTip.init($("#chnDetails_" + pChain.nexus + " ins"));
		I.qTip.init($("#chnDetails_" + pChain.nexus + " kbd"));
		
		// Finally intialize its checklist state
		X.initializeChainChecklist(pChain);
		
	}, // End of initializeChain()

	/*
	 * Initializes every chain and create additional informative arrays for them.
	 * @pre Event number can only go from 1-9.
	 */
	initializeAllChains: function()
	{
		X.initializeChecklist(X.Checklists.Chain, C.Chains.length);
		X.initializeChecklist(X.Checklists.ChainSubscription, C.Chains.length);
		
		var chain;
		for (var i in C.Chains)
		{
			chain = C.Chains[i];
			/*
			 * Initialize step attribute (the first number in an event
			 * number, as in "2" in "2A1"), will be used to access events HTML.
			 */
			for (var ii in chain.events)
			{
				// Minus 1 because the event numbers are 1 indexed
				chain.events[ii].step = parseInt(C.getEventStepNumber(chain.events[ii].num)) - 1;
			}
			
			chain.nexus = parseInt(i);
			chain.isSorted = false;
			chain.primaryEvents = new Array();
			chain.scheduleKeys = new Array();
			
			switch (chain.series)
			{
				case C.ChainSeriesEnum.Standard:
				{
					chain.htmllist = "#sectionChains_Scheduled";
					C.RegularChains.push(chain);
					C.ScheduledChains.push(chain);
				} break;
				case C.ChainSeriesEnum.Hardcore:
				{
					chain.htmllist = "#sectionChains_Scheduled";
					C.RegularChains.push(chain);
					C.ScheduledChains.push(chain);
				} break;
				case C.ChainSeriesEnum.DryTop:
				{
					chain.htmllist = "#sectionChains_Drytop";
					C.DryTopChains.push(chain);
					C.ScheduledChains.push(chain);
				} break;
				case C.ChainSeriesEnum.LivingStory:
				{
					if (T.isDashboardStoryEnabled)
					{
						// Show Living Story events on the dashboard if on website or overlay mode only
						chain.htmllist = ((I.isProgramEmbedded || (I.ModeCurrent !== I.ModeEnum.Website && I.ModeCurrent !== I.ModeEnum.Overlay)))
							? "#sectionChains_Scheduled" : "#dsbStory";
						C.LivingStoryChains.push(chain);
						C.ScheduledChains.push(chain);
						T.insertChainToSchedule(chain, chain.extra);
					}
					else
					{
						continue;
					}
				} break;
				case C.ChainSeriesEnum.Legacy:
				{
					chain.htmllist = "#sectionChains_Legacy";
					C.LegacyChains.push(chain);
				} break;
				case C.ChainSeriesEnum.Temple:
				{
					chain.htmllist = "#sectionChains_Temple";
					C.TempleChains.push(chain);
				} break;
			}

			// Unschedule chains will be initialized when their headers are clicked on
			if (C.isChainScheduled(chain))
			{
				C.initializeChain(chain);
			}
		}
		
		I.initializeChainsUI();
		// Initial recoloring of chain titles
		$("#sectionChains_Scheduled .chnBar h1, #sectionChains_Drytop .chnBar h1, #dsbStory .chnBar h1")
			.addClass("chnTitleFutureFar");
	},
	
	/*
	 * Tells if a chain is active on the chain bars list.
	 * @param object pChain to verify.
	 * @returns boolean current or not.
	 */
	isChainCurrent: function(pChain)
	{
		for (var i in C.CurrentChains)
		{
			if (pChain.nexus === C.CurrentChains[i].nexus)
			{
				return true;
			}
		}
		return false;
	},
	
	/*
	 * Tells if a chain check state is intact (not checked off or deleted).
	 * @param object pChain to get state.
	 * @returns boolean unchecked or not.
	 */
	isChainUnchecked: function(pChain)
	{
		if (X.getChainChecklistState(pChain) === X.ChecklistEnum.Unchecked)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Tells if a chain bar is expanded by reading the details child element.
	 * @param object pChain to get the bar.
	 * @returns boolean shown or not.
	 */
	isChainSubscribed: function(pChain)
	{
		if (X.getChecklistItem(X.Checklists.ChainSubscription, pChain.nexus) ===
			X.ChecklistEnum.Checked)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Updates the time in the chain bars for all chains.
	 * @pre scheduleKeys array is sorted and first element is the soonest.
	 */
	updateChainsTimeHTML: function()
	{
		var i;
		var ithchain;
		var countdown;
		var time;
		
		var subscribetext = "<dfn>" + D.getPhraseTitle("click to <br/> subscribe") + "</dfn><br />";
		
		for (i in C.ScheduledChains)
		{
			ithchain = C.ScheduledChains[i];
			// Update the title tootlip with that chain's schedule
			var minischedulestring = "";
			var spacer;
			if (ithchain.series !== C.ChainSeriesEnum.DryTop)
			{
				for (var ii in ithchain.scheduleKeys)
				{
					spacer = (parseInt(ii) === 0) ? subscribetext : " <br /> ";
					minischedulestring = minischedulestring + spacer
						+ T.getTimeFormatted(
						{
							wantSeconds: false,
							customTimeInSeconds: T.convertScheduleKeyToLocalSeconds(
								ithchain.scheduleKeys[ii])
						});
				}
				$("#chnTime_" + ithchain.nexus).prop("title", minischedulestring);
			}

			// Don't change the active bars
			if (C.isChainCurrent(ithchain))
			{
				continue;
			}
			countdown = T.getTimeFormatted(
			{
				wantLetters: true,
				wantSeconds: false,
				customTimeInSeconds: T.getSecondsUntilChainStarts(ithchain)
			});
			time = T.getTimeFormatted(
			{
				wantLetters: false,
				wantSeconds: false,
				customTimeInSeconds: T.convertScheduleKeyToLocalSeconds(ithchain.scheduleKeys[0])
			});
			
			$("#chnTime_" + ithchain.nexus).html(
				countdown + "<br />" + "<sup>" + time + "</sup>"
			);
		}
		
		// Rebind tooltips for the time elements because they were updated
		I.qTip.init(".chnTitle time");
	},
	
	/*
	 * Updates the current chain bar's time as a countdown until the chain is
	 * predicted to finish, or until the next chain starts if finished.
	 */
	updateCurrentChainTimeHTML: function(pChain)
	{
		var elapsed = T.getCurrentTimeframeElapsedTime();
		var remaining = pChain.countdownToFinish - elapsed;
		var time = remaining;
		var sign = "⇑ ";
		
		if (pChain.series === C.ChainSeriesEnum.DryTop)
		{
			// Dry Top events
			var currentframe = T.getDryTopMinute();
			var nextframe = T.getDryTopMinute(1);
			time = T.getTimeFormatted(
			{
				reference: T.ReferenceEnum.UTC,
				want24: true,
				wantHours: false
			});
			
			$("#chnTime_" + pChain.nexus).text("(:" + currentframe + ") " + time);
			if (C.isDryTopIconsShown)
			{
				$("#mapDryTopTimer").html(
					"<var style='color:" + T.getCurrentDryTopColor() + "'>:" + currentframe + "</var> " + time
					+ " <var style='color:" + T.getCurrentDryTopColor(1) + "'>:" + nextframe + "</var>");
			}
		}
		else
		{
			// Other scheduled chains
			if (remaining <= 0)
			{
				time = T.cSECONDS_IN_TIMEFRAME - elapsed;
				sign = "⇓ ";
			}

			$("#chnTime_" + pChain.nexus).text(sign + T.getTimeFormatted(
				{
					wantHours: false,
					wantLetters: true,
					customTimeInSeconds: time
				})
			);
		}
	},
	
	/*
	 * Creates a list similar to the schedule chains HTML list but with bare
	 * chain titles and static schedule time.
	 */
	initializeTimetableHTML: function()
	{
		if (C.isTimetableGenerated === false)
		{
			return;
		}
		
		$("#sectionChains_Timetable").empty(); // This makes the function reuseable
		var i, ii;
		var chains;
		var ithchain;
		var timestring;
		for (i in T.Schedule)
		{
			chains = T.getScheduleSlotChainsByKey(i);
			for (ii in chains)
			{
				ithchain = chains[ii];
				// Only generate chain bars for these types
				if (ithchain.series !== C.ChainSeriesEnum.Standard
					&& ithchain.series !== C.ChainSeriesEnum.Hardcore)
				{
					break;
				}
				
				timestring = T.getTimeFormatted(
				{
					wantSeconds: false,
					customTimeInSeconds: T.convertScheduleKeyToLocalSeconds(i)
				});

				$("#sectionChains_Timetable").append(
				"<div class='chnSlot chnSlotTime_" + i + " chnSlot_" + ithchain.nexus + "' data-" + C.cIndexSynonym + "='" + ithchain.nexus + "' data-timeframe='" + i + "'>"
					+ "<div class='chnTitle'>"
						+ "<img src='img/chain/" + C.parseChainAlias(ithchain.alias).toLowerCase() + I.cPNG + "' />"
						+ "<samp class='chnCheck'></samp>"
						+ "<h1>" + D.getObjectName(ithchain) + "</h1>"
						+ "<time>" + timestring + "</time>"
						+ "<aside><img class='chnDaily chnDaily_" + ithchain.nexus + "' src='img/ui/daily.png' /></aside>"
					+ "</div>"
				+ "</div>");
			}
		}
		// Set slot visual state as stored in checklist
		for (var i in C.RegularChains)
		{
			ithchain = C.RegularChains[i];
			var slots = $(".chnSlot_" + ithchain.nexus);
			var checks = slots.find(".chnCheck");
			var times = slots.find("time");
			X.reapplyChainBarState(ithchain.nexus, slots, checks, times);
		}
		// Hover on chain slot highlight same bosses
		$(".chnTitle h1").hover(
			function() { $(".chnSlot_" + $(this).parent().parent().data(C.cIndexSynonym)).addClass("chnBarHover"); },
			function() { $(".chnSlot").removeClass("chnBarHover"); }
		);
		// Mimic check off function
		$(".chnSlot samp").click(function()
		{
			$("#chnCheck_" + C.Chains[$(this).parent().parent().data(C.cIndexSynonym)].nexus).trigger("click");
		});
		// Mimic subscription function
		$(".chnSlot time").click(function()
		{
			$("#chnTime_" + C.Chains[$(this).parent().parent().data(C.cIndexSynonym)].nexus).trigger("click");
		});
		// Special color of the reset time slot
		$(".chnSlotTime_0").addClass("chnBarReset");
		C.showChainDailyIcon();
	},
	
	/*
	 * Puts the past chains behind the current chain slots.
	 */
	updateTimetable: function()
	{
		if (C.isTimetableGenerated === false)
		{
			return;
		}
		
		var previousframe = T.getTimeframeKey(-1);
		var currentframe = T.getTimeframeKey();
		var nextframe = T.getTimeframeKey(1);
		// Also highlight timetable chain bar
		$(".chnSlotTime_" + previousframe)
			.removeClass("chnBarCurrent");
		$(".chnSlotTime_" + currentframe)
			.addClass("chnBarCurrent");
		// Current chain title
		$(".chnSlotTime_" + previousframe + " .chnTitle h1")
			.removeClass("chnTitleCurrent");
		$(".chnSlotTime_" + currentframe + " .chnTitle h1")
			.removeClass("chnTitleFuture").addClass("chnTitleCurrent");
		// Future chain title
		$(".chnSlotTime_" + nextframe + " .chnTitle h1")
			.addClass("chnTitleFuture");
		
		// Move the past time slots to the bottom, so the current slot(s) is always the top
		var currenttimeframe = T.getCurrentTimeframe();
		$(".chnSlot").each(function()
		{
			if (T.convertScheduleKeyToUTCMinutes($(this).data("timeframe")) < currenttimeframe)
			{
				$(this).appendTo("#sectionChains_Timetable");
			}
			else
			{
				// Break out of this each loop since the arranging is done
				return false;
			}
		});
		
		// Hide daily world boss beyond today's reset
		if (C.ChainToday)
		{
			$("#sectionChains_Timetable .chnDaily_" + C.ChainToday.nexus).each(function()
			{
				if (T.convertScheduleKeyToUTCMinutes($(this).closest(".chnSlot").data("timeframe")) < currenttimeframe)
				{
					$(this).hide();
				}
			});
		}
	},

	/*
	 * Sorts the scheduled chains list in the chains plate. This is
	 * called by the ticker every timeframe.
	 */
	sortChainsListHTML: function()
	{
		var numchainssorted = 0;
		var numchainstosort = C.ScheduledChains.length;
		var i = 0;
		var ii = 0;
		var chains;
		var ithchain;
		/*
		 * Look at the schedule and start with the current active chain; move
		 * that chain's HTML to the bottom of the HTML chains list, then look at
		 * the next (and so on), if it is not already sorted then also move it
		 * to the bottom. This loop stops when all scheduled events have been
		 * sorted as soonest at the top and latest at the bottom.
		 * Note that there will be timeframe gaps in the list because only the
		 * soonest chain will be sorted and later repeats of the chain are ignored.
		 */
		while (numchainssorted < numchainstosort)
		{
			chains = T.getTimeframeChains(i);
			for (ii in chains)
			{
				if (numchainssorted >= numchainstosort)
				{
					break;
				}
				
				ithchain = chains[ii];
				if (ithchain.isSorted === false)
				{
					$("#chnBar_" + ithchain.nexus).appendTo(ithchain.htmllist);
					
					ithchain.isSorted = true;
					ithchain.scheduleKeyImmediate = T.getTimeframeKey(i);
					numchainssorted++;
				}
			}
			i++;
		}
		
		for (i in C.ScheduledChains)
		{
			ithchain = C.ScheduledChains[i];
			// Reset the sorted boolean (important, else infinite loop)
			ithchain.isSorted = false;
			
			/*
			 * scheduleKeys is an array of keys to the schedule for when that
			 * chain starts. Circularly shift the array so that the soonest
			 * index is first--by concatenating the two slices of the array
			 * using that found index.
			 */
			for (ii in ithchain.scheduleKeys)
			{
				if (ithchain.scheduleKeys[ii] === ithchain.scheduleKeyImmediate)
				{
					ithchain.scheduleKeys = 
						(ithchain.scheduleKeys.slice(ii, ithchain.scheduleKeys.length))
							.concat(ithchain.scheduleKeys.slice(0, ii));
					break;
				}
			}
		}
		// Update chain time HTML
		C.updateChainsTimeHTML();
		
		/*
		 * Now that the chains are sorted, do cosmetic updates.
		 */
		for (i in C.CurrentChains)
		{
			ithchain = C.CurrentChains[i];
			// Highlight
			$("#chnBar_" + ithchain.nexus).addClass("chnBarCurrent");
			// Show the events (details)
			if (C.isChainUnchecked(ithchain))
			{
				if (I.ModeCurrent !== I.ModeEnum.Tile
					&& ((ithchain.series === C.ChainSeriesEnum.DryTop)
					|| (ithchain.series !== C.ChainSeriesEnum.DryTop && O.Options.bol_expandWB)))
				{
					$("#chnDetails_" + ithchain.nexus).show("fast");
				}
			}
			
			// Style the title and time
			$("#chnBar_" + ithchain.nexus + " h1").first()
				.removeClass("chnTitleFuture chnTitleFutureFar").addClass("chnTitleCurrent");
			$("#chnBar_" + ithchain.nexus + " time").first()
				.removeClass("chnTimeFuture chnTimeFutureFar").addClass("chnTimeCurrent");
		}

		for (i in C.PreviousChains1)
		{
			ithchain = C.PreviousChains1[i];
			// Still highlight the previous chain bar but collapse it
			$("#chnBar_" + ithchain.nexus)
				.removeClass("chnBarCurrent").addClass("chnBarPrevious");
			// Hide previous chains if opted to automatically expand before
			if (O.Options.bol_collapseChains && I.ModeCurrent !== I.ModeEnum.Tile)
			{
				$("#chnDetails_" + ithchain.nexus).hide();
			}
			
			// Style the title and time
			$("#chnBar_" + ithchain.nexus + " h1").first()
				.removeClass("chnTitleCurrent").addClass("chnTitleFutureFar");
			$("#chnBar_" + ithchain.nexus + " time").first()
				.removeClass("chnTimeCurrent").addClass("chnTimeFutureFar");
		}
		
		for (i in C.PreviousChains2)
		{
			ithchain = C.PreviousChains2[i];
			// Stop highlighting the previous previous chain bar
			$("#chnBar_" + ithchain.nexus).removeClass("chnBarPrevious");
		}
		
		for (i in C.NextChains1)
		{
			ithchain = C.NextChains1[i];
			// Style the title and time
			$("#chnBar_" + ithchain.nexus + " h1").first()
				.removeClass("chnTitleFutureFar").addClass("chnTitleFuture");
			$("#chnBar_" + ithchain.nexus + " time").first()
				.removeClass("chnTimeFutureFar").addClass("chnTimeFuture");
		}
	},
	
	/*
	 * minSum avgSum and minavgSum are the seconds since a chain began that
	 * an event of it starts. Because the time a chain starts is known, these
	 * statistical times can be used to predict when events happen and end.
	 * @param object pChainOuter to queue.
	 * @pre The sum statistics have been computed. Chains list has been sorted.
	 */
	queueEventsHighlight: function(pChainOuter)
	{
		var i;
		var chain = pChainOuter;
		var elapsed = T.getCurrentTimeframeElapsedTime();
		var wait;
		var hasfoundcurrentprimaryindex = false;
		
		/*
		 * If the user just loaded in instead of transitioning at a timeframe.
		 */
		if (elapsed > 0)
		{
			// Find the current active event and highlight it
			for (i in chain.primaryEvents)
			{
				/*
				 * For an event to be active, its start time (xxxSum) should be 
				 * <= the elapsed time, and the next event's start time
				 * should be > the elapsed time.
				 */
				wait = C.getSumBasedOnOptions(chain, i);
				if (wait >= elapsed)
				{
					if (i > 0) // Disregard the first event in the chain
					{
						C.highlightEvents(chain, parseInt(i-1));
						hasfoundcurrentprimaryindex = true;
						break;
					}
				}
			}
			/*
			 * Finished scanning the array but couldn't find active event in it,
			 * now compare with the final event's finish time.
			 */
			if (hasfoundcurrentprimaryindex === false)
			{
				wait = C.getSumBasedOnOptions(chain, -1);
				if (wait >= elapsed)
				{
					C.highlightEvents(chain, i); // Final event in progress
				}
				else
				{
					C.highlightEvents(chain, -1); // Final event finished
				}
			}
		}
		
		/*
		 * Queue the highlighting of events using setTimeout. Events that had
		 * already happened (elapsed time is greater than their start time)
		 * are ignored, and the future events are offsetted by the elapsed.
		 */
		for (i in chain.primaryEvents)
		{
			wait = C.getSumBasedOnOptions(chain, i);
			if (wait >= elapsed)
			{
				wait = wait - elapsed;
				setTimeout((function(pChain, pPrimaryEventIndex)
				{
					// Have to use this clunky nesting else the timeout gets the last iterator
					return function()
					{
						C.highlightEvents(pChain, pPrimaryEventIndex);
					};
				})(chain, parseInt(i)), wait * T.cMILLISECONDS_IN_SECOND);
			}
		}
		
		// Queued all the events' start, now queue when the chain finishes
		wait = C.getSumBasedOnOptions(chain, -1);
		if (wait >= elapsed)
		{
			wait = wait - elapsed;
			setTimeout((function(pChain)
			{
				return function()
				{
					C.highlightEvents(pChain, -1);
				};
			})(chain), wait * T.cMILLISECONDS_IN_SECOND);
		}
	},
	
	/*
	 * Does cosmestic effects to event names as they transition and view the
	 * event on the map. Also shows/hides Dry Top event icons.
	 * Also plays the alarm if it is the final event finishing.
	 * @param object pChain to read from.
	 * @param int pPrimaryEventIndex of the current active event.
	 * @pre Events HTML is generated and map is loaded.
	 */
	highlightEvents: function(pChain, pPrimaryEventIndex)
	{
		var i;
		var animationspeed = 500;
		var eventnamewidth = C.cEventNameWidth;
		var finalstep = pChain.primaryEvents.length - 1;
		var event;
		var isregularchain = C.isChainRegular(pChain);
		
		// Hide past events' markers
		if (pChain.series === C.ChainSeriesEnum.DryTop && C.isDryTopGenerated)
		{
			P.LayerArray.DryTopActive = null;
			P.LayerArray.DryTopActive = new Array();
			if (C.isDryTopIconsShown)
			{
				for (i in pChain.events)
				{
					event = pChain.events[i];
					M.toggleLayer(event.eventicon, false);
					M.toggleLayer(event.eventring, false);
				}
			}
		}
		
		// Do event highlights, -1 means the final event's finish time
		if (pPrimaryEventIndex > -1)
		{
			pChain.CurrentPrimaryEvent = pChain.primaryEvents[pPrimaryEventIndex];
			
			// Recolor past events
			for (i = 0; i < pPrimaryEventIndex; i++)
			{
				$(".chnStep_" + pChain.nexus + "_" + i)
					.removeClass("chnEventCurrent");
			}
			$(".chnStep_" + pChain.nexus + "_" + (pPrimaryEventIndex - 1))
				.css({opacity: 1}).animate({opacity: 0.5}, animationspeed,
				function()
				{
					if (pChain.series === C.ChainSeriesEnum.DryTop)
					{
						// Also hide the past events after fading if it is Dry Top events
						$(this).hide();
					}
				});
			
			// Recolor current events and animate transition
			$(".chnStep_" + pChain.nexus + "_" + pPrimaryEventIndex).each(function()
			{
				$(this).removeClass("chnEventFuture").addClass("chnEventCurrent").show()
					.css({width: 0, opacity: 0.5}).animate({width: eventnamewidth, opacity: 1}, animationspeed)
					.css({width: "auto"});
				// Also show current events' markers
				if (pChain.series === C.ChainSeriesEnum.DryTop && C.isDryTopGenerated)
				{
					event = pChain.events[$(this).attr("data-eventindex")];
					// Add active events to iterable array
					P.LayerArray.DryTopActive.push(event.eventicon);
					P.LayerArray.DryTopActive.push(event.eventring);
					// Show active Dry Top events
					if (C.isDryTopIconsShown)
					{
						M.toggleLayerArray(P.LayerArray.DryTopActive, true);
					}
				}
			});
		
			// Recolor future events
			if (pPrimaryEventIndex < pChain.primaryEvents.length)
			{
				for (i = (pPrimaryEventIndex + 1); i < pChain.primaryEvents.length; i++)
				{
					$(".chnStep_" + pChain.nexus + "_" + i).show()
						.removeClass("chnEventCurrent").addClass("chnEventFuture");
				}
			}
			
			// Tour to the event on the map if opted
			if (O.Options.bol_tourPrediction && (I.ModeCurrent !== I.ModeEnum.Overlay)
				&& I.PageCurrent === I.PageEnum.Chains
				&& M.isMapAJAXDone && C.isChainUnchecked(pChain) && isregularchain
				&& C.isDryTopIconsShown === false)
			{
				$("#chnEvent_" + pChain.nexus + "_" + pChain.CurrentPrimaryEvent.num).trigger("click");
			}
			
			// If the final event is just starting, alert if opted
			if (pPrimaryEventIndex === finalstep && O.Options.bol_alertArrival && isregularchain)
			{
				if ((O.Options.int_setAlarm === O.IntEnum.Alarm.Checklist
						&& C.isChainUnchecked(pChain))
					|| (O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription
						&& C.isChainSubscribed(pChain) && C.isChainUnchecked(pChain)))
				{
					D.speak(D.getChainPronunciation(pChain) + " " + D.getSpeech("arrival predicted"));
				}
			}
		}
		else // Finish time
		{
			pChain.CurrentPrimaryEvent = pChain.primaryEvents[finalstep];
			
			// Recolor all events
			$("#chnEvents_" + pChain.nexus + " li").show()
				.removeClass("chnEventCurrent");
			// Recolor current (final) events as past
			$(".chnStep_" + pChain.nexus + "_" + finalstep)
				.css({opacity: 1}).animate({opacity: 0.5}, animationspeed);
			
			/*
			 * Announce the next world boss and the time until it, only if it's
			 * not past the timeframe, and the subscription option is off.
			 */
			if (O.Options.int_setAlarm === O.IntEnum.Alarm.Checklist
				&& O.Options.bol_alertAtEnd && I.isProgramLoaded
				&& pChain.nexus === C.CurrentChainSD.nexus
				&& isregularchain)
			{
				var checked = ", " + D.getSpeech("checked");
				var checkedsd = "";
				var checkedhc = "";
				var wantsd = O.objToBool(C.NextChainSD1);
				var wanthc = O.objToBool(C.NextChainHC1);
				var speech = D.getSpeech("next " + D.orderModifier("boss", "world") + " is") + " ";
				
				if (C.NextChainSD1 && ( ! C.isChainUnchecked(C.NextChainSD1)))
				{
					checkedsd = checked;
				}
				if (C.NextChainHC1 && ( ! C.isChainUnchecked(C.NextChainHC1)))
				{
					checkedhc = checked;
				}
				// Don't alert if next boss is checked off and user opted not to hear
				if (O.Options.bol_alertChecked === false)
				{
					if (checkedsd.length > 0) { wantsd = false; }
					if (checkedhc.length > 0) { wanthc = false; }
				}
				
				if (wantsd && wanthc)
				{
					D.speak(speech + D.getChainPronunciation(C.NextChainSD1) + checkedsd, 5);
					D.speak(D.getSpeech("also") + ", " + D.getChainPronunciation(C.NextChainHC1) + checkedhc, 3);
				}
				else if (wantsd)
				{
					D.speak(speech + D.getChainPronunciation(C.NextChainSD1) + checkedsd, 5);
				}
				else if (wanthc)
				{
					D.speak(speech + D.getChainPronunciation(C.NextChainHC1) + checkedhc, 5);
				}
				
				if (wantsd || wanthc)
				{
					D.speak(T.getTimeTillChainFormatted(C.NextChainSD1, "speech"), 3);
				}
			}
			
			// Also unsubscribe if opted
			if (O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription && I.isProgramLoaded
				&& pChain.series !== C.ChainSeriesEnum.LivingStory
				&& O.Options.bol_alertUnsubscribe && isregularchain && C.isChainSubscribed(pChain))
			{
				$("#chnTime_" + pChain.nexus).trigger("click");
			}
		}
	},
	
	/*
	 * Gets the time an event start or a chain finishes based on user option.
	 * @param object pChain to read from.
	 * @param int pIndex of a primary event. -1 if want finish.
	 * @returns int sum statistics for that event/step.
	 */
	getSumBasedOnOptions: function(pChain, pIndex)
	{
		// Daily chain will always use min time because more players will do these
		if (C.isChainToday(pChain))
		{
			if (pIndex > -1)
			{
				return pChain.primaryEvents[pIndex].minSum;
			}
			else
			{
				pChain.countdownToFinish = pChain.minFinish;
				return pChain.minFinish;
			}
		}
		
		// Else for non daily chains use chosen statistical time
		var hour = T.getTimeSinceMidnight(T.ReferenceEnum.Local, T.UnitEnum.Hours);
		
		if (pIndex > -1)
		{
			switch (O.Options.int_setPredictor)
			{
				case O.IntEnum.Predictor.Auto:
				{
					if (hour >= 12 && hour < 18)
					{
						return pChain.primaryEvents[pIndex].minSum;
					}
					if (hour >= 18)
					{
						return pChain.primaryEvents[pIndex].minavgSum;
					}
					if (hour >= 0 && hour < 6)
					{
						return pChain.primaryEvents[pIndex].avgSum;
					}
					if (hour >= 6 && hour < 12)
					{
						return pChain.primaryEvents[pIndex].minavgSum;
					}
				} break;
				case O.IntEnum.Predictor.Min:
				{
					return pChain.primaryEvents[pIndex].minSum;
				} break;
				case O.IntEnum.Predictor.MinAvg:
				{
					return pChain.primaryEvents[pIndex].minavgSum;
				} break;
				case O.IntEnum.Predictor.Avg:
				{
					return pChain.primaryEvents[pIndex].avgSum;
				} break;
			}
			// Failsafe
			return pChain.primaryEvents[pIndex].minavgSum;
		}
		else
		{
			switch (O.Options.int_setPredictor)
			{
				case O.IntEnum.Predictor.Auto:
				{
					if (hour >= 12 && hour < 18)
					{
						pChain.countdownToFinish = pChain.minFinish;
						return pChain.minFinish;
					}
					if (hour >= 18)
					{
						pChain.countdownToFinish = pChain.minavgFinish;
						return pChain.minavgFinish;
					}
					if (hour >= 0 && hour < 6)
					{
						pChain.countdownToFinish = pChain.avgFinish;
						return pChain.avgFinish;
					}
					if (hour >= 6 && hour < 12)
					{
						pChain.countdownToFinish = pChain.minavgFinish;
						return pChain.minavgFinish;
					}
				} break;
				case O.IntEnum.Predictor.Min:
				{
					pChain.countdownToFinish = pChain.minFinish;
					return pChain.minFinish;
				} break;
				case O.IntEnum.Predictor.MinAvg:
				{
					pChain.countdownToFinish = pChain.minavgFinish;
					return pChain.minavgFinish;
				} break;
				case O.IntEnum.Predictor.Avg:
				{
					pChain.countdownToFinish = pChain.avgFinish;
					return pChain.avgFinish;
				} break;
			}
			// Failsafe
			pChain.countdownToFinish = pChain.minavgFinish;
			return pChain.minavgFinish;
		}
	}
};

/* =============================================================================
 * @@Map and map control template object
 * ========================================================================== */
M = {
	/*
	 * http://gw2timer.com/data/general.js contains zone (e.g. Queensdale, LA) objects
	 * with their rectangular coordinates.
	 * This is referred to by the variable "Zones".
	 */
	MapEnum: "map", // Type of map this map is
	Zones: GW2T_ZONE_DATA,
	ZoneAssociation: GW2T_ZONE_ASSOCIATION, // This contains API zone IDs that associates with regular world zones
	Regions: GW2T_REGION_DATA,
	Submaps: GW2T_SUBMAP_DATA,
	cInitialZone: "lion",
	Map: {},
	Floors: new Array(),
	ZoneCurrent: {},
	cICON_SIZE_STANDARD: 32,
	cRING_SIZE_MAX: 256,
	isMapInitialized: false,
	isMouseOnHUD: false,
	isUserDragging: false,
	isMapAJAXDone: false,
	isAPIRetrieved_MAPFLOOR: false,
	isItineraryRetrieved: false,
	isMappingIconsGenerated: false,
	isEventIconsGenerated: false,
	ContextLatLng: null, // Coordinates to store when user right clicks on the map
	cMAP_NUMFLOORS: 4,
	cMAP_BOUND: 32768, // The map is a square
	cMAP_CENTER: [16384, 16384],
	cMAP_CENTER_INITIAL: [-1024, 1024], // Out of map boundary so browser doesn't download tiles yet
	cMAP_MOUSEMOVE_RATE: 100,
	cInertiaThreshold: 100, // Milliseconds between drag and release to flick pan
	cZoomFactor: 2,
	ZoomEnum:
	{
		Same: -1,
		Min: 0,
		Default: 3,
		Space: 3,
		Sky: 5,
		Bird: 6,
		Ground: 7,
		Max: 7
	},
	cZIndexRaise: 999999,
	cZIndexBury: -999999,
	
	// MumbleLink data assigned by overlay program
	cMETER_TO_INCH: 39.3701,
	cCIRCLE_RIGHT_DEGREE: 90,
	cCIRCLE_HALF_DEGREE: 180,
	cCIRCLE_FULL_DEGREE: 360,
	cRADIAN_TO_DEGREE: 180 / Math.PI,
	cUNITS_TO_POINTS: 208 / 5000,
	cPOINTS_TO_UNITS: 5000 / 208,
	GPSTimeout: {},
	GPSPreviousCoord: [],
	GPSPreviousAngleCharacter: 0,
	GPSPreviousAngleCamera: 0,
	
	/*
	 * All objects in the map are called "markers". Some markers are grouped into iterable "layers".
	 * Markers in layers are destroyed and recreated into the map using the toggleLayer function.
	 * This is to reduce CPU usage when these markers are not displayed.
	 * To iterate layers: LAYER.eachLayer(function(MARKER) { MARKER.dostuff });
	 * To assign marker properties: MARKER.options.PROPERTY
	 */
	Layer: {
		Overview: new L.layerGroup(),
		Pin: new L.layerGroup(), // Utility pin markers, looks like GW2 personal waypoints
		PersonalPin: new L.layerGroup(),
		PersonalPath: new L.layerGroup(), // Path drawn from connecting player-laid pins
		ZoneRectangle: new L.layerGroup() // Rectangles colored specific to the zones' region
	},
	Pin: {
		Program: {},
		Event: {},
		Over: {},
		Character: {},
		Camera: {}
	},
	MappingEnum:
	{
		Sector: 0,
		Waypoint: 1,
		Landmark: 2,
		Vista: 3,
		Challenge: 4,
		Heart: 5,
		EventIcon: 6,
		EventRing: 7
	},
	APIPOIEnum:
	{
		Sector: "sectors",
		Waypoint: "waypoint",
		Landmark: "landmark",
		Vista: "vista",
		Challenge: "skill_challenges",
		Heart: "tasks"
	},
	
	/*
	 * Initializes the Leaflet map, adds markers, and binds events.
	 */
	initializeMap: function()
	{
		var that = this;
		var htmlidprefix = "#" + this.MapEnum;
		// ?.Map is the actual Leaflet map object, initialize it
		this.Map = L.map(this.MapEnum + "Pane", {
			minZoom: this.ZoomEnum.Min,
			maxZoom: this.ZoomEnum.Max,
			inertiaThreshold: this.cInertiaThreshold,
			doubleClickZoom: false,
			touchZoom: false, // Disable pinch to zoom
			zoomControl: I.isOnSmallDevice, // Hide the zoom UI
			attributionControl: false, // Hide the Leaflet link UI
			crs: L.CRS.Simple
		}).setView(this.cMAP_CENTER_INITIAL, this.ZoomEnum.Default); // Out of map boundary so browser doesn't download tiles yet
		// Because the map will interfere with scrolling the website on touch devices
		this.Map.touchZoom.disable();
		if (this.Map.tap)
		{
			this.Map.tap.disable();
		}
		
		// Initialize array in zones to later hold world completion and dynamic event icons
		var zone;
		for (var i in this.Zones)
		{
			zone = this.Zones[i];
			zone.center = this.computeZoneCenter(i);
			zone.nick = i;
			zone.Layers = {
				Path: new L.layerGroup(),
				Waypoint: new L.layerGroup(),
				Landmark: new L.layerGroup(),
				Vista: new L.layerGroup(),
				Challenge: new L.layerGroup(),
				Heart: new L.layerGroup(),
				Sector: new L.layerGroup(),
				EventIcon: new L.layerGroup(),
				EventRing: new L.layerGroup()
			};
			if (that.MapEnum === I.MapEnum.Tyria)
			{
				P.LayerArray.ChainPath.push(zone.Layers.Path);
			}
		}
		this.ZoneCurrent = this.Zones[this.cInitialZone];
		
		// Do other initialization functions
		var mapnumber;
		switch (this.MapEnum)
		{
			case I.MapEnum.Tyria: {
				mapnumber = 1;
				this.populateMap(I.MapEnum.Tyria);
				C.ScheduledChains.forEach(P.drawChainPaths);
			} break;
			
			case I.MapEnum.Mists: {
				mapnumber = 2;
				// Set tiles, Tyria tiles is set later to avoid loading extra images
				L.tileLayer(U.URL_API.TilesMists,
				{
					continuousWorld: true
				}).addTo(W.Map);
			} break;
		}
		
		// Initialize floors for setting the map tiles
		for (var i = 0; i < this.cMAP_NUMFLOORS; i++)
		{
			this.Floors.push(L.tileLayer("https://tiles.guildwars2.com/" + mapnumber + "/" + i + "/{z}/{x}/{y}.jpg",
			{
				continuousWorld: true
			}));
		}
		
		// Bind map click functions for non-touch devices
		if ( ! this.Map.tap)
		{
			this.bindMapClicks(this.MapEnum);
		}
		
		/*
		 * Go to the coordinates in the bar when user presses enter.
		 */
		$(htmlidprefix + "CoordinatesCopy").onEnterKey(function()
		{
			var val = $(this).val();
			// If input looks like a 2D array of coordinates, then create pins from them
			if (that.parsePersonalPath(val) === false)
			{
				switch (val.toLowerCase())
				{
					case "/identity": I.write(JSON.stringify(GPSIdentityJSON, null, 2)); break;
					case "/lock": that.Map.dragging.disable(); that.Map.scrollWheelZoom.disable(); I.write("Map locked."); break;
					case "/unlock": that.Map.dragging.enable(); that.Map.scrollWheelZoom.enable(); I.write("Map unlocked."); break;
					case "/loadpins": that.parsePersonalPath(that.loadPersonalPins()); break;
					default: that.goToArguments(val, that.Pin.Program);
				}
			}
		});
		
		/*
		 * Bind map HUD buttons functions.
		 */
		$(htmlidprefix + "GPSButton").click(function()
		{
			// Go to character if cliked on GPS button
			that.updateCharacter(1);
		}).dblclick(function()
		{
			if (that.Map.getZoom() !== that.ZoomEnum.Ground)
			{
				that.Map.setZoom(that.ZoomEnum.Ground);
			}
			else
			{
				that.Map.setZoom(that.ZoomEnum.Default);
			}
		});
		$(htmlidprefix + "DisplayButton").click(function()
		{
			// Hide the right panel if click on the display button
			$("#opt_bol_showPanel").trigger("click");
		});
		// Translate and bind map zones list
		$(htmlidprefix + "CompassButton").one("mouseenter", that.bindZoneList).click(function()
		{
			that.goToDefault();
		});
		
		// Finally
		this.isMapInitialized = true;
		this.refreshMap();
	},
	
	/*
	 * Generates map waypoints and other markers from the GW2 server API files.
	 */
	populateMap: function()
	{
		var that = this;
		/*
		 * map_floor.json sample structure of desired data
		 * Code based on API documentation.
		{
			"regions":
			{
				"1":
				{
					"name": "Shiverpeak Mountains"
					"maps":
					{
						"26":
						{
							"name": "Dredgehaunt Cliffs",
							"continent_rect": [[19456, 14976], [21760, 18176]],
							"points_of_interest":
							[{
								"poi_id": 602,
								"name": "Grey Road Waypoint",
								"type": "waypoint",
								"coord": [20684.6, 17105.3]
							},
							...
							]
						}
					}
				}
			}
		}*/
		if (I.isMapEnabled)
		{
		$.getJSON(U.URL_API.MapFloorTyria, function(pData)
		{
			var i;
			var regionid, region, zoneid, ithzone, poi;
			var zoneobj;
			var numofpois;
			var marker;
			var icon;
			var cssclass;
			var tooltip;
			var translationvista = D.getTranslation("Vista");
			var translationchallenge = D.getTranslation("Hero Challenge");

			for (regionid in pData.regions)
			{
				region = pData.regions[regionid];

				for (zoneid in region.maps)
				{
					// Don't bother parsing if not a regular world zone
					if ( ! that.ZoneAssociation[zoneid])
					{
						continue;
					}
					
					ithzone = region.maps[zoneid];
					zoneobj = that.getZoneFromID(zoneid);
					// Store zone dimension data for locating events
					zoneobj.map_rect = ithzone.map_rect;
					zoneobj.continent_rect = ithzone.continent_rect;
					var numheart = 0;
					var numwaypoint = 0;
					var numlandmark = 0;
					var numchallenge = 0;
					var numvista = 0;
					// Cover the zone with a colored rectangle signifying its region
					that.Layer.ZoneRectangle.addLayer(L.rectangle(
						that.convertGCtoLCMulti(zoneobj.rect), {
							fill: false,
							color: that.Regions[zoneobj.region].color,
							weight: 2,
							clickable: false
						}
					));
					
					/* 
					 * For waypoints, points of interest, and vistas.
					 */
					numofpois = ithzone.points_of_interest.length;
					for (i = 0; i < numofpois; i++)
					{
						poi = ithzone.points_of_interest[i];

						// Properties assignment based on POI's type
						switch (poi.type)
						{
							case that.APIPOIEnum.Waypoint:
							{
								// Waypoints are always created, others are optional
								numwaypoint++;
								icon = U.URL_IMG.Waypoint;
								cssclass = "mapWp";
								tooltip = poi.name;
							} break;
							
							case that.APIPOIEnum.Landmark:
							{
								if (O.Options.bol_showWorldCompletion === false)
								{
									continue;
								}
								numlandmark++;
								icon = U.URL_IMG.Landmark;
								cssclass = "mapPoi";
								tooltip = poi.name;
							} break;
							
							case that.APIPOIEnum.Vista:
							{
								if (O.Options.bol_showWorldCompletion === false)
								{
									continue;
								}
								numvista++;
								icon = U.URL_IMG.Vista;
								cssclass = "mapPoi";
								tooltip = translationvista;
							} break;
							
							default: continue; // Don't create marker if not desired type
						}

						marker = L.marker(that.convertGCtoLC(poi.coord),
						{
							title: "<span class='" + cssclass + "'>" + tooltip + "</span>",
							markername: poi.name,
							icon: L.icon(
							{
								iconUrl: icon,
								iconSize: [16, 16], // Initial size corresponding to default zoom level
								iconAnchor: [8, 8]
							}),
							link: U.getChatlinkFromPoiID(poi.poi_id)
						});
						
						// Bind behavior
						switch (poi.type)
						{
							case that.APIPOIEnum.Waypoint:
							{
								marker.on("mouseout", function()
								{
									try { this._icon.src = U.URL_IMG.Waypoint; } catch(e) {}
								});
								marker.on("mouseover", function()
								{
									this._icon.src = U.URL_IMG.WaypointOver;
								});
								zoneobj.Layers.Waypoint.addLayer(marker);
							} break;
							case that.APIPOIEnum.Landmark:
							{
								marker.on("mouseout", function()
								{
									// Workaround a null pointer exception when changing zones
									try { this._icon.src = U.URL_IMG.Landmark; } catch(e) {}
								});
								marker.on("mouseover", function()
								{
									this._icon.src = U.URL_IMG.LandmarkOver;
								});
								zoneobj.Layers.Landmark.addLayer(marker);
							} break;
							case that.APIPOIEnum.Vista:
							{
								zoneobj.Layers.Vista.addLayer(marker);
							} break;
						}
						// Clicking on waypoints or POIs gives a chatcode
						if (poi.type === that.APIPOIEnum.Waypoint || poi.type === that.APIPOIEnum.Landmark)
						{
							marker.on("click", function()
							{
								$("#mapCoordinatesCopy").val(this.options.link).select();
								$("#mapCoordinatesName").val(this.options.markername);
							});
							that.bindMappingZoomBehavior(marker, "dblclick");
						}
						else
						{
							that.bindMappingZoomBehavior(marker, "click");
						}
					}
					
					/*
					 * For API separate arrays for pois.
					 */
					if (O.Options.bol_showWorldCompletion)
					{
						// Hero Challenges
						numofpois = ithzone.skill_challenges.length;
						numchallenge = numofpois;
						for (i = 0; i < numofpois; i++)
						{
							poi = ithzone.skill_challenges[i];
							marker = L.marker(that.convertGCtoLC(poi.coord),
							{
								title: "<span class='" + "mapPoi" + "'>" + translationchallenge + "</span>",
								icon: L.icon(
								{
									iconUrl: U.URL_IMG.Challenge,
									iconSize: [16, 16],
									iconAnchor: [8, 8]
								})
							});
							that.bindMappingZoomBehavior(marker, "click");
							zoneobj.Layers.Challenge.addLayer(marker);
						}
						
						// Renown Hearts
						numofpois = ithzone.tasks.length;
						numheart = numofpois;
						for (i = 0; i < numofpois; i++)
						{
							poi = ithzone.tasks[i];
							marker = L.marker(that.convertGCtoLC(poi.coord),
							{
								title: "<span class='" + "mapPoi" + "'>" + poi.objective + " (" + poi.level + ")" + "</span>",
								task: poi.objective,
								icon: L.icon(
								{
									iconUrl: U.URL_IMG.Heart,
									iconSize: [16, 16],
									iconAnchor: [8, 8]
								})
							});
							marker.on("click", function(pEvent)
							{
								var heartname = this.options.task;
								// Trim trailing period if exists
								if (heartname.indexOf(".") === heartname.length - 1)
								{
									heartname = heartname.slice(0, -1);
								}
								U.openExternalURL(U.getWikiLanguageLink(heartname));
							});
							zoneobj.Layers.Heart.addLayer(marker);
						}
						
						// Sector Names
						numofpois = ithzone.sectors.length;
						for (i = 0; i < numofpois; i++)
						{
							poi = ithzone.sectors[i];
							marker = L.marker(that.convertGCtoLC(poi.coord),
							{
								clickable: false,
								icon: L.divIcon(
								{
									className: "mapSec",
									html: "<span class='mapSecIn'>" + poi.name + "</span>",
									iconSize: [512, 64],
									iconAnchor: [256, 32]
								})
							});
							zoneobj.Layers.Sector.addLayer(marker);
						}
						
						that.isMappingIconsGenerated = true;
					}
					
					// Generate POIs overview for this zone
					if (O.Options.bol_showWorldCompletion)
					{
						marker = L.marker(that.convertGCtoLC(zoneobj.center),
						{
							mappingzone: zoneobj.nick,
							riseOnHover: true,
							icon: L.divIcon(
							{
								className: "mapOverview",
								html: "<span class='mapOverviewIn'>"
									+ "<var class='mapOverviewName'>" + D.getObjectName(zoneobj) + "</var>"
									+ ((ithzone.min_level > 0) ? ("<var class='mapOverviewLevel'>"
										+ ((ithzone.min_level === 80) ? (ithzone.max_level) : (ithzone.min_level + " - " + ithzone.max_level))
									+ "</var>") : "")
									+ ((numheart > 0) ? ("<img src='img/map/heart.png' />" + numheart + " ") : "")
									+ ((numwaypoint > 0) ? ("<img src='img/map/waypoint.png' />" + numwaypoint + " ") : "")
									+ ((numlandmark > 0) ? ("<img src='img/map/landmark.png' />" + numlandmark + " ") : "")
									+ ((numchallenge > 0) ? ("<img src='img/map/challenge.png' />" + numchallenge + " ") : "")
									+ ((numvista > 0) ? ("<img src='img/map/vista.png' />" + numvista) : "")
								+ "</span>",
								iconSize: [256, 64],
								iconAnchor: [128, 32]
							})
						});
						that.bindOverviewBehavior(marker, "click");
						that.bindOverviewBehavior(marker, "contextmenu");
						that.Layer.Overview.addLayer(marker);
						that.toggleLayer(that.Layer.Overview, true);
					}
				}
			}
		}).done(function() // Map is populated by AJAX
		{
			that.isAPIRetrieved_MAPFLOOR = true;
			
			/*
			 * AJAX takes a while so can use this to advantage to delay graphics
			 * that seem out of place without a map loaded.
			 */
			if (O.Options.bol_displayEvents === false)
			{
				P.donePopulation();
			}
			
		}).fail(function()
		{
			if (I.ModeCurrent === I.ModeEnum.Website)
			{
				I.write(
				"Guild Wars 2 API server is unreachable.<br />"
				+ "Reasons could be:<br />"
				+ "- The GW2 server is down for maintenance.<br />"
				+ "- Your browser is too old (if IE then need 11+).<br />"
				+ "- Your computer's time is out of sync.<br />"
				+ "- This website's code encountered a bug.<br />"
				+ "Map features will be limited.<br />", 15);
			}
		}).always(function() // Do after AJAX regardless of success/failure
		{
			if (O.Options.bol_displayEvents === true)
			{
				P.populateEvents();
			}
			else
			{
				P.finishPopulation();
			}
		});
		}
		
		/*
		 * Create pin markers that can be moved by user or program.
		 * ---------------------------------------------------------------------
		 */
		
		this.Pin.Program = this.createPin("img/map/pin_blue.png");
		this.Pin.Event = this.createPin("img/map/pin_green.png");
		this.Pin.Over = this.createPin("img/map/pin_over.png", [128,128]);
		this.Pin.Character = this.createPin("img/map/pin_character.png", [40,40]);
		this.Pin.Camera = this.createPin("img/map/pin_camera.png", [256,256], {clickable: false});
		
		// Bind pin click event to get coordinates in the coordinates bar
		this.Layer.Pin.eachLayer(function(pMarker)
		{
			that.bindMarkerCoordBehavior(pMarker, "click");
			pMarker.on("dblclick", function()
			{
				that.movePin(this);
			});
		});
		// Right clicking on the character pin hides it
		this.Pin.Character.on("contextmenu", function()
		{
			that.movePin(this);
			that.movePin(that.Pin.Camera);
		});
		// Hide the pins, they will be shown when they are moved
		this.toggleLayer(this.Layer.Pin, false);
		
	}, // End of populateMap
	
	/*
	 * Bind mouse button functions for the map. Also binds the map custom context menu.
	 * @param enum pMapEnum.
	 */
	bindMapClicks: function(pMapEnum)
	{
		var that = this;
		var htmlidprefix = "#" + pMapEnum;
		/*
		 * Clicking an empty place on the map highlight its coordinate.
		 */
		this.Map.on("click", function(pEvent)
		{
			if (that.isMouseOnHUD) { return; }
			var coord = that.convertLCtoGC(pEvent.latlng);
			$(htmlidprefix + "CoordinatesCopy")
				.val(that.formatCoord(coord)).select();
		});

		/*
		 * Create a personal pin marker to where the user double clicks.
		 */
		this.Map.on("dblclick", function(pEvent)
		{
			if (that.isMouseOnHUD) { return; }
			that.createPersonalPin(pEvent.latlng, true);
		});
		
		/*
		 * Right clicking the map shows a custom context menu.
		 */
		this.Map.on("contextmenu", function(pEvent)
		{
			that.ContextLatLng = pEvent.latlng;
			$("#ctxMap").css({top: I.posY, left: I.posX}).show();
		});
		
		/*
		 * Bind context menu functions, same order as the HTML.
		 */
		$("#ctxMap").click(function()
		{
			$(this).hide();
		});
		$("#ctxMapCenter").click(function()
		{
			that.goToDefault();
		});
		$("#ctxMapToggleCompletion").click(function()
		{
			$("#opt_bol_showWorldCompletion").trigger("click");
		});
		$("#ctxMapDrawCompletion").click(function()
		{
			P.drawCompletionRoute();
		});
		$("#ctxMapClearPins").click(function()
		{
			that.clearPersonalPins();
		});
	},
	
	/*
	 * Bindings for map events that need to be done after AJAX has loaded the
	 * API-generated markers.
	 */
	bindMapVisualChanges: function(pMapEnum)
	{
		var that = this;
		/*
		 * Booleans to stop some map functions from activating.
		 */
		$("#paneHUDMap").hover(
			function() { that.isMouseOnHUD = true; },
			function() { that.isMouseOnHUD = false; }
		);
		$("#ctxMap").hover(
			function() { that.isMouseOnHUD = true; },
			function() { that.isMouseOnHUD = false; }
		);
		this.Map.on("dragstart", function()
		{
			that.isUserDragging = true;
		});
		this.Map.on("dragend", function()
		{
			that.isUserDragging = false;
		});
		
		/*
		 * Bind the mousemove event to update the map coordinate bar.
		 * Note that the throttle function is from a separate script. It permits
		 * the event handler to only run once every so specified milliseconds.
		 */
		this.Map.on("mousemove", $.throttle(that.cMAP_MOUSEMOVE_RATE, function(pEvent)
		{
			if (that.isMouseOnHUD || that.isUserDragging) { return; }
			that.showCurrentZone(that.convertLCtoGC(pEvent.latlng));
		}));

		/*
		 * At the end of a zoom animation, resize the map waypoint icons
		 * depending on zoom level. Hide if zoomed too far.
		 */
		this.Map.on("zoomend", function(pEvent)
		{
			that.adjustZoomMapping();
			if (pMapEnum === I.MapEnum.Tyria)
			{
				P.adjustZoomDryTop();
			}
		});
	},
	
	/*
	 * Changes the floor tile layer.
	 * @param int pFloor number.
	 */
	changeFloor: function(pFloor)
	{
		for (var i = 0; i < this.Floors.length; i++)
		{
			this.Map.removeLayer(this.Floors[i]);
		}
		this.Floors[pFloor].addTo(this.Map);
	},
	
	/*
	 * Informs Leaflet that the map pane was resized so it can load tiles properly.
	 */
	refreshMap: function()
	{
		if (this.isMapInitialized)
		{
			this.Map.invalidateSize();
		}
	},
	
	/*
	 * Tells if the specified zone exists within the listing.
	 * @param string pZoneID to look up.
	 * @returns true if exists.
	 */
	isZoneValid: function(pZoneID)
	{
		if (this.ZoneAssociation[pZoneID] === undefined)
		{
			return false;
		}
		return true;
	},
	
	/*
	 * Gets a GW2T zone object from an API zone ID.
	 * @param string pZoneID to look up.
	 * @returns object zone.
	 */
	getZoneFromID: function(pZoneID)
	{
		return this.Zones[this.ZoneAssociation[pZoneID]];
	},
	
	/*
	 * Gets a zone's translated name if available.
	 * @param string pNick name of the zone to retrieve, or a zone object itself.
	 * @returns string zone name.
	 */
	getZoneName: function(pNick)
	{
		// If pNick is an alias of a zone
		var zone;
		if (typeof(pNick) === "string" && this.Zones[pNick])
		{
			zone = this.Zones[pNick];
		}
		// If pNick is a zone that has the property
		else if (pNick["rect"])
		{
			zone = pNick;
		}
		else
		{
			return "nozonename";
		}
		
		// Now get the name
		return D.getObjectName(zone);
	},
	
	/*
	 * Gets the region nick of a zone.
	 * @param string pNick of the zone.
	 * @returns string region nick.
	 */
	getZoneRegion: function(pNick)
	{
		return this.Zones[(pNick.toLowerCase())].region;
	},
	
	/*
	 * Finds what zone the specified point is in by comparing it to the top left
	 * and bottom right coordinates of the zones, then show the zone's visuals.
	 * @param array pCoord containing x and y coordinates.
	 * @pre Zone perimeters do not intersect.
	 */
	showCurrentZone: function(pCoord)
	{
		document.getElementById("mapCoordinatesMouse")
			.value = pCoord[0] + ", " + pCoord[1];
	
		// Don't continue if mouse is still in the same zone
		if (pCoord[0] >= this.ZoneCurrent.rect[0][0] // x1
			&& pCoord[1] >= this.ZoneCurrent.rect[0][1] // y1
			&& pCoord[0] <= this.ZoneCurrent.rect[1][0] // x2
			&& pCoord[1] <= this.ZoneCurrent.rect[1][1]) // y2
		{
			return;
		}
		
		// Else search for new moused zone
		var i, ii;
		var previouszone;
		var zonename = "";
		
		for (i in this.Zones) // i is the index and nickname of the zone
		{
			if (pCoord[0] >= this.Zones[i].rect[0][0]
				&& pCoord[1] >= this.Zones[i].rect[0][1]
				&& pCoord[0] <= this.Zones[i].rect[1][0]
				&& pCoord[1] <= this.Zones[i].rect[1][1])
			{
				// Hide the icons of the previously moused zone
				previouszone = this.Zones[this.ZoneCurrent.nick];
				for (ii in previouszone.Layers)
				{
					this.Map.removeLayer(previouszone.Layers[ii]);
				}
				// Update current zone object
				this.ZoneCurrent = this.Zones[i];
				zonename = this.getZoneName(this.ZoneCurrent);
				document.getElementById("mapCoordinatesName")
					.value = zonename;

				// Reveal moused zone's icons
				if (O.Options.bol_showChainPaths && I.PageCurrent !== I.PageEnum.Map) { this.ZoneCurrent.Layers.Path.addTo(this.Map); }
				if (O.Options.bol_displayWaypoints) { this.ZoneCurrent.Layers.Waypoint.addTo(this.Map); }
				if (O.Options.bol_displayPOIs) { this.ZoneCurrent.Layers.Landmark.addTo(this.Map); }
				if (O.Options.bol_displayVistas) { this.ZoneCurrent.Layers.Vista.addTo(this.Map); }
				if (O.Options.bol_displayChallenges) { this.ZoneCurrent.Layers.Challenge.addTo(this.Map); }
				if (O.Options.bol_displayHearts) { this.ZoneCurrent.Layers.Heart.addTo(this.Map); }
				if (O.Options.bol_displaySectors) { this.ZoneCurrent.Layers.Sector.addTo(this.Map); }
				if (O.Options.bol_displayEvents) {
					this.ZoneCurrent.Layers.EventIcon.addTo(this.Map);
					this.ZoneCurrent.Layers.EventRing.addTo(this.Map);
				}

				// Re-tooltip
				I.qTip.init(".leaflet-marker-icon");
				// Rescale current moused mapping markers
				this.adjustZoomMapping();
				break; // Already found zone so stop searching
			}
		}
	},
	
	/*
	 * Simulates the action of moving the mouse outside the current zone to
	 * another and back again, so as to trigger the icon adjustment functions.
	 */
	refreshCurrentZone: function()
	{
		var currentcoord = this.ZoneCurrent.center;
		this.showCurrentZone(this.getZoneCenter("dry"));
		this.showCurrentZone(this.getZoneCenter("rata"));
		this.showCurrentZone(currentcoord);
	},
	
	/*
	 * Gets the center coordinates of a zone.
	 * @param string pNick short name of the zone.
	 * @returns array of x and y coordinates.
	 */
	computeZoneCenter: function(pNick)
	{
		var rect = this.Zones[pNick].rect;
		// x = OffsetX + (WidthOfZone/2), y = OffsetY + (HeightOfZone/2)
		var x = rect[0][0] + ~~((rect[1][0] - rect[0][0]) / 2);
		var y = rect[0][1] + ~~((rect[1][1] - rect[0][1]) / 2);
		return [x, y];
	},
	getZoneCenter: function(pNick)
	{
		return this.Zones[pNick].center;
	},
	
	/*
	 * Gets the center coordinates of an event.
	 * @param object pEvent an event from event_details.json
	 * @returns array of x and y coordinates.
	 * @pre map_floor.json was extracted to the this.Zones object.
	 */
	getEventCenter: function(pEvent)
	{
		var zone = this.getZoneFromID(pEvent.map_id);
		var p = pEvent.location.center; // 3D float array

		return this.convertEventCoord(p, zone);
	},
	
	/*
	 * Gets the dimension (of say a marker) adjusted to the specified zoom level.
	 * For example, a submap must be resized so that it is the same scale as
	 * the map's tileset. It is known that every zoom down doubles the size of
	 * the map, and vice versa. The formula below is:
	 * maxdimension / (2 ^ (maxzoomlevel - currentzoomlevel))
	 * Each zoom down increases the dimension toward the maxdimension, so when
	 * it's at maxzoomlevel, the returned dimension equals maxdimension.
	 * @param int pMaxDimension to rescale.
	 * @param int or enum pZoomLevel for adjustment.
	 */
	scaleDimension: function(pMaxDimension, pZoomLevel)
	{
		pZoomLevel = pZoomLevel || this.Map.getZoom();
		return parseInt(pMaxDimension / (Math.pow(this.cZoomFactor, (this.ZoomEnum.Max) - pZoomLevel)));
	},
	
	/*
	 * Converts a zoom level where 0 is ground level to proper level.
	 * @param int zoom level inverted.
	 * @returns int zoom level proper.
	 */
	invertZoomLevel: function(pZoomLevel)
	{
		return this.ZoomEnum.Max - T.wrapInteger(pZoomLevel, this.ZoomEnum.Max);
	},
	
	/*
	 * Resizes mapping markers so they scale with the current zoom level.
	 */
	adjustZoomMapping: function()
	{
		var that = this;
		var currentzoom = this.Map.getZoom();
		var waypointsize, landmarksize, eventiconsize, eventringsize;
		var sectorfontsize, sectoropacity;
		
		switch (currentzoom)
		{
			case 7: waypointsize = 40; landmarksize = 32; eventiconsize = 32; eventringsize = 256; break;
			case 6: waypointsize = 32; landmarksize = 24; eventiconsize = 24; eventringsize = 128; break;
			case 5: waypointsize = 26; landmarksize = 16; eventiconsize = 16; eventringsize = 64; break;
			case 4: waypointsize = 20; landmarksize = 12; eventiconsize = 12; eventringsize = 32; break;
			case 3: waypointsize = 16; landmarksize = 0; eventiconsize = 0; eventringsize = 0; break;
			case 2: waypointsize = 12; landmarksize = 0; eventiconsize = 0; eventringsize = 0; break;
			default: { waypointsize = 0; landmarksize = 0; eventiconsize = 0; eventringsize = 0; }
		}
		
		switch (currentzoom)
		{
			case 7: sectorfontsize = 28; sectoropacity = 0.9; break;
			case 6: sectorfontsize = 20; sectoropacity = 0.6; break;
			case 5: sectorfontsize = 16; sectoropacity = 0.3; break;
			default: { sectorfontsize = 0; sectoropacity = 0; }
		}
		
		// Overview on the zones
		if (O.Options.bol_showWorldCompletion)
		{
			if (currentzoom === this.ZoomEnum.Default)
			{
				this.toggleLayer(this.Layer.Overview, true);
				this.Layer.Overview.eachLayer(function(layer) {
					layer._icon.style.display = "table";
				});
			}
			else
			{
				this.toggleLayer(this.Layer.Overview, false);
			}
		}

		// Waypoints
		this.ZoneCurrent.Layers.Waypoint.eachLayer(function(layer) {
			that.changeMarkerIcon(layer, U.URL_IMG.Waypoint, waypointsize);
		});
		
		// Landmarks
		this.ZoneCurrent.Layers.Landmark.eachLayer(function(layer) {
			that.changeMarkerIcon(layer, U.URL_IMG.Landmark, landmarksize);
			if (layer._icon)
			{
				layer._icon.style.opacity = (currentzoom < that.ZoomEnum.Max) ? 0.6 : 0.8;
			}
		});
		
		// Vista
		this.ZoneCurrent.Layers.Vista.eachLayer(function(layer) {
			that.changeMarkerIcon(layer, U.URL_IMG.Vista, landmarksize);
		});
		
		// Challenge
		this.ZoneCurrent.Layers.Challenge.eachLayer(function(layer) {
			that.changeMarkerIcon(layer, U.URL_IMG.Challenge, landmarksize);
		});
		
		// Heart
		this.ZoneCurrent.Layers.Heart.eachLayer(function(layer) {
			that.changeMarkerIcon(layer, U.URL_IMG.Heart, landmarksize);
		});
		
		// Sector
		this.ZoneCurrent.Layers.Sector.eachLayer(function(layer) {
			if (layer._icon)
			{
				layer._icon.style.fontSize = sectorfontsize + "px";
				layer._icon.style.opacity = sectoropacity;
				layer._icon.style.zIndex = that.cZIndexBury + 1; // Don't cover other icons
				if (O.Options.bol_displaySectors)
				{
					layer._icon.style.display = "table"; // For middle vertical alignment
				}
			}
		});
		
		// Event Icon
		if (O.Options.bol_displayEvents)
		{
			this.ZoneCurrent.Layers.EventIcon.eachLayer(function(layer) {
				that.changeMarkerIcon(layer, layer._icon.src, eventiconsize);
				if (layer._icon)
				{
					layer._icon.style.zIndex = M.cZIndexRaise;
				}
			});

			// Event Ring
			this.ZoneCurrent.Layers.EventRing.eachLayer(function(layer) {
				that.changeMarkerIcon(layer, layer._icon.src, eventringsize);
				if (layer._icon)
				{
					layer._icon.style.zIndex = M.cZIndexBury;
				}
			});
		}
		
		// Character pin and camera FOV
		this.updateCharacter(-1);
	},
	
	/*
	 * Returns a common sized Leafet icon.
	 * @param string pIconURL of the icon image.
	 * @returns object Leaflet icon.
	 */
	createStandardIcon: function(pIconURL)
	{
		return L.icon({
			iconUrl: pIconURL,
			iconSize: [32, 32],
			iconAnchor: [16, 16]
		});
	},
	
	/*
	 * Creates a pin in the map to be assigned to a reference object.
	 * @param string pIconURL image of the marker.
	 * @param 2D array pDimension width and height of pin.
	 * @param object pOptions additional marker options.
	 * @returns object Leaflet marker.
	 */
	createPin: function(pIconURL, pDimension, pOptions)
	{
		if (pDimension === undefined)
		{
			pDimension = [32, 32];
		}
		// Default pin options
		var options = {
			icon: L.icon(
			{
				iconUrl: pIconURL,
				iconSize: pDimension,
				iconAnchor: [(pDimension[0])/2, (pDimension[1])/2]
			}),
			draggable: true
		};
		// If additional options was provided then override the default
		if (pOptions !== undefined)
		{
			for (var i in pOptions)
			{
				options[i] = pOptions[i];
			}
		}
		var marker = L.marker(this.convertGCtoLC([0,0]), options);
		this.Layer.Pin.addLayer(marker);
		return marker;
	},
	
	/*
	 * Saves the current personal pins to storage.
	 */
	savePersonalPins: function()
	{
		localStorage[O.Utilities.personalPins.key] = this.getPersonalCoords();
	},
	loadPersonalPins: function()
	{
		return localStorage[O.Utilities.personalPins.key];
	},
	
	/*
	 * Creates a personal pin.
	 * @param object pLatLng coordinates.
	 * @param boolean pWantDraw to redraw the paths (shouldn't redraw when
	 * looping this function because that's inefficient).
	 */
	createPersonalPin: function(pLatLng, pWantDraw)
	{
		var that = this;
		// Create a pin at double click location
		var marker = L.marker(pLatLng, {
			icon: L.icon(
			{
				iconUrl: "img/map/pin_white.png",
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			}),
			draggable: true,
			opacity: 0.9
		});
		this.toggleLayer(marker, true);
		this.Layer.PersonalPin.addLayer(marker);
		if (pWantDraw)
		{
			this.drawPersonalPath();
		}
		
		// Single click pin: get its coordinates and toggle its opacity
		this.bindMarkerCoordBehavior(marker, "click");
		marker.on("click", function()
		{
			if (this.options.ismarked === undefined || this.options.ismarked === false)
			{
				this.options.ismarked = true;
				this.setOpacity(0.3);
			}
			else
			{
				this.options.ismarked = false;
				this.setOpacity(1);
			}
		});
		// Double click pin: remove itself from map
		marker.on("dblclick", function()
		{
			that.toggleLayer(this, false);
			that.Layer.PersonalPin.removeLayer(this);
			that.drawPersonalPath();
		});
		// Right click pin: centers the pin on GPS character
		marker.on("contextmenu", function()
		{
			if (that.GPSPreviousCoord.length > 0)
			{
				that.movePin(this, that.GPSPreviousCoord);
			}
			else
			{
				that.movePin(this, that.Map.getCenter());
			}
			that.drawPersonalPath();
		});
		// Drag pin: redraw the personal path
		marker.on("dragend", function()
		{
			that.drawPersonalPath();
		});
	},
	
	/*
	 * Inserts a personal pin between a group of pins.
	 * @param int pPrecede index of the preceding pin.
	 * @param object pLatLng of the inserted pin.
	 */
	insertPersonalPin: function(pPrecede, pLatLng)
	{
		var latlngs = new Array();
		var i = 0;
		// Recompile pin coordinates for recreation
		this.Layer.PersonalPin.eachLayer(function(pPin){
			latlngs.push(pPin.getLatLng());
			if (i === pPrecede)
			{
				// When at the index to insert, push the provided coordinates of the new pin
				latlngs.push(pLatLng);
			}
			i++;
		});
		// Redraw the entire series of pins
		this.clearPersonalPins();
		for (i in latlngs)
		{
			this.createPersonalPin(latlngs[i]);
		}
		this.drawPersonalPath();
	},
	
	/*
	 * Removes all personal pins from the map.
	 */
	clearPersonalPins: function()
	{
		var that = this;
		this.Layer.PersonalPin.eachLayer(function(pPin){
			that.toggleLayer(pPin, false);
		});
		this.Layer.PersonalPin.clearLayers();
		this.drawPersonalPath();
	},
	
	/*
	 * Draws a path from the group of personal pins the user laid.
	 */
	drawPersonalPath: function()
	{
		var that = this;
		if (O.Options.bol_showPersonalPaths)
		{
			var path;
			var latlngs = new Array();
			var pinids = new Array();
			var length = 0;
			this.Layer.PersonalPin.eachLayer(function(pPin){
				latlngs.push(pPin.getLatLng());
				pinids.push(that.getLayerId(pPin));
				length++;
			});
			if (length > 1)
			{
				this.Layer.PersonalPath.clearLayers();
				for (var i = 0; i < length-1; i++)
				{
					// Create a single line connecting next two pins
					path = L.polyline([latlngs[i], latlngs[i+1]], {
						color: "white",
						opacity: 0.4,
						precede: i // Store the index of the preceding pin that connects the path
					});
					// Single click path: get the coordinates of all pins
					path.on("click", function()
					{
						$("#" + that.MapEnum + "CoordinatesCopy").val(that.getPersonalCoords()).select();
					});
					// Double click path: insert a pin between the two pins that connect the path
					path.on("dblclick", function(pEvent)
					{
						that.insertPersonalPin(this.options.precede, pEvent.latlng);
					});
					this.Layer.PersonalPath.addLayer(path);
				}
				this.toggleLayer(this.Layer.PersonalPath, true);
			}
			else
			{
				this.Layer.PersonalPath.clearLayers();
				this.toggleLayer(this.Layer.PersonalPath, false);
			}
		}
		else
		{
			this.Layer.PersonalPath.clearLayers();
			this.toggleLayer(this.Layer.PersonalPath, false);
		}
		// Save when any change was made to the pins
		this.savePersonalPins();
	},
	
	/*
	 * Parses a personal path string then draw it if valid.
	 * @param string pString of coordinates.
	 * @returns boolean true if valid.
	 */
	parsePersonalPath: function(pString)
	{
		var coords = this.parseCoordinatesMulti(pString);
		if (coords !== null)
		{
			this.redrawPersonalPath(coords);
			return true;
		}
		return false;
	},
	
	/*
	 * Draws a path from a given set of coordinates.
	 * @param 2D array pCoords of x y coordinates.
	 */
	redrawPersonalPath: function(pCoords)
	{
		if (pCoords.length > 0)
		{
			this.clearPersonalPins();
			for (var i in pCoords)
			{
				this.createPersonalPin(this.convertGCtoLC(pCoords[i]));
			}
			this.drawPersonalPath();
			// View the first point in the generated path
			this.goToArguments(pCoords[0]);
		}
		else
		{
			I.write("Path unavailable for this.");
		}
	},
	
	/*
	 * Gets the personal pins' coordinates.
	 * @returns string of the 2D array.
	 */
	getPersonalCoords: function()
	{
		var that = this;
		var coords = new Array();
		var length = 0;
		this.Layer.PersonalPin.eachLayer(function(pPin){
			coords.push(that.convertLCtoGC(pPin.getLatLng()));
			length++;
		});
		
		var str = "";
		if (length > 1)
		{
			str = this.compileCoordinates(coords);
		}
		else if (length === 1)
		{
			str = this.formatCoord(coords[0]);
		}
		
		return str;
	},
	
	/*
	 * Changes the marker icon's image and size (Leaflet does not have this method).
	 * @param object pMarker Leaflet marker.
	 * @param string pIconURL of the icon image.
	 * @param int pSize of icon.
	 */
	changeMarkerIcon: function(pMarker, pIconURL, pSize)
	{
		if (pSize === undefined)
		{
			pSize = this.cICON_SIZE_STANDARD;
		}
		
		pMarker.setIcon(new L.icon(
		{
			iconUrl: pIconURL,
			iconSize: [pSize, pSize],
			iconAnchor: [pSize/2, pSize/2]
		}));
	},
	
	/*
	 * Gets ID of a Leaflet layer.
	 * @param object pLayer.
	 * @returns string ID number.
	 */
	getLayerId: function(pLayer)
	{
		return pLayer["_leaflet_id"];
	},
	
	/*
	 * Toggles recreation/destruction of layers (a group of markers).
	 * @param object pLayer of markers.
	 * @param boolean pBoolean to show or hide.
	 */
	toggleLayer: function(pLayer, pBoolean)
	{
		if (pLayer === undefined)
		{
			return;
		}
		// No boolean provided so assumes toggle
		if (pBoolean === undefined)
		{
			pBoolean = !(this.Map.hasLayer(pLayer));
		}
		
		// Show if true, hide if false
		if (pBoolean)
		{
			pLayer.addTo(this.Map);
		}
		else
		{
			this.Map.removeLayer(pLayer);
		}
	},
	toggleLayerArray: function(pLayerArray, pBoolean)
	{
		for (var i in pLayerArray)
		{
			this.toggleLayer(pLayerArray[i], pBoolean);
		}
	},
	
	/*
	 * Initializes or toggle a submap, which is a Leaflet ImageOverlay over the map.
	 * Look at general.js for submap declarations.
	 * @param string pName of the submap.
	 * @param boolean pBoolean to show or hide.
	 */
	toggleSubmap: function(pName, pBoolean)
	{
		var submap = this.Submaps[pName];
		if (submap.ImageOverlay === undefined)
		{
			submap.ImageOverlay = L.imageOverlay(submap.img, this.convertGCtoLCMulti(submap.bounds));
			this.toggleSubmap(pName, pBoolean);
		}
		else
		{
			// No boolean provided so assumes toggle
			if (pBoolean === undefined)
			{
				pBoolean = !(this.Map.hasLayer(submap.ImageOverlay));
			}

			// Show if true, hide if false
			if (pBoolean)
			{
				submap.ImageOverlay.addTo(this.Map).bringToBack();
			}
			else
			{
				this.Map.removeLayer(submap.ImageOverlay);
			}
		}
	},
	toggleSubmapArray: function(pNames, pBoolean)
	{
		for (var i in pNames)
		{
			this.toggleSubmap(pNames[i], pBoolean);
		}
	},
	
	/*
	 * Moves a pin to a map coordinate.
	 * @param object pPin to move.
	 * @param 2D array or Leaflet latlng object pCoord coordinates.
	 */
	movePin: function(pPin, pCoord)
	{
		if (pCoord === undefined)
		{
			// No coordinates given means hide the pin
			this.toggleLayer(pPin, false);
		}
		else
		{
			this.toggleLayer(pPin, true);
			if (Array.isArray(pCoord))
			{
				pPin.setLatLng(this.convertGCtoLC(pCoord));
			}
			else
			{
				pPin.setLatLng(pCoord);
			}
			pPin._icon.style.zIndex = this.cZIndexRaise;
		}
	},
	
	/*
	 * Views the map at the specifications.
	 * @param 2D array pCoord coordinates.
	 * @param object pPin which to move to coordinate.
	 * @param enum pZoom level.
	 */
	goToView: function(pCoord, pZoom, pPin)
	{
		if (pPin !== undefined)
		{
			this.movePin(pPin, pCoord);
		}
		
		if (pZoom === undefined)
		{
			pZoom = this.ZoomEnum.Ground;
		}
		if (pZoom === this.ZoomEnum.Same)
		{
			pZoom = this.Map.getZoom();
		}
		this.Map.setView(this.convertGCtoLC(pCoord), pZoom);
		this.showCurrentZone(pCoord);
	},
	goToLatLng: function(pLatLng, pZoom)
	{
		if (pZoom === undefined)
		{
			pZoom = this.ZoomEnum.Ground;
		}
		if (pZoom === this.ZoomEnum.Same)
		{
			pZoom = this.Map.getZoom();
		}
		this.Map.setView(pLatLng, pZoom);
		this.showCurrentZone(this.convertLCtoGC(pLatLng));
	},
	
	/*
	 * Views the map at the zone.
	 * @param string pNick of the zone.
	 * @param enum pZoom level.
	 */
	goToZone: function(pNick, pZoom)
	{
		var coord = this.getZoneCenter(pNick);
		this.showCurrentZone(coord);
		this.goToView(coord, pZoom);
	},
	
	/*
	 * Views the default map view.
	 */
	goToDefault: function()
	{
		this.Map.setView(this.convertGCtoLC(this.cMAP_CENTER), this.ZoomEnum.Default);
	},
	
	/*
	 * Views the map at the given URL coordinates if exist.
	 * URL should be in the form of http://gw2timer.com/?go=4874,16436,1
	 * @param string pArguments of location to view.
	 * coords[0] = x coordinate.
	 * coords[1] = y coordinate.
	 * coords[2] = z coordinate (zoom level, lower value equals greater zoom-in).
	 */
	goToArguments: function(pArguments, pPin)
	{
		var i;
		var coords = [];
		var zone;
		if (pArguments)
		{
			coords = this.parseCoordinates(pArguments);
			if (coords.length === 2)
			{
				if (isFinite(coords[0]) && isFinite(coords[1]))
				{
					this.goToView(coords, this.ZoomEnum.Ground, pPin);
				}
			}
			else if (coords.length >= 3)
			{
				if (isFinite(coords[0]) && isFinite(coords[1]) && isFinite(coords[2]))
				{
					// Zoom level 0 is ground level (opposite the enum)
					var zoomlevel = this.invertZoomLevel(coords[2]);
					this.goToView([coords[0], coords[1]], zoomlevel, pPin);
				}
			}
			else
			{
				// Else assume the argument is a short name for the zone
				zone = pArguments.toLowerCase();
				if (zone === "default")
				{
					this.goToDefault();
				}
				else
				{
					for (i in this.Zones)
					{
						if (zone.indexOf(i) !== -1)
						{
							this.goToView(this.getZoneCenter(i), this.ZoomEnum.Bird);
							break;
						}
					}
				}
			}
		}
		// Only execute this function once
		U.Args[U.KeyEnum.Go] = null;
	},
	
	/*
	 * Converts GW2's coordinates XXXXX,XXXXX to Leaflet LatLng coordinates XXX,XXX.
	 * @param array pCoord array of two numbers.
	 * @returns LatLng Leaflet object.
	 */
	convertGCtoLC: function(pCoord)
	{
		return this.Map.unproject(pCoord, this.Map.getMaxZoom());
	},
	
	/*
	 * Converts multiple GW2 coordinates to multiple LatLng.
	 * @param array of arrays pCoordArrays to convert.
	 * @param int pIndexStart starting index.
	 * @returns array of LatLng.
	 */
	convertGCtoLCMulti: function(pCoordArray, pIndexStart)
	{
		pIndexStart = pIndexStart || 0;
		var i;
		var latlngs = new Array();
		for (i = pIndexStart; i < pCoordArray.length; i++)
		{
			latlngs.push(this.convertGCtoLC(pCoordArray[i]));
		}
		return latlngs;
	},
	
	/*
	 * Converts Leaflet LatLng to GW2's 2 unit array coordinates.
	 * @param object pLatLng from Leaflet.
	 * @returns array of x and y coordinates.
	 */
	convertLCtoGC: function(pLatLng)
	{
		var coord = this.Map.project(pLatLng, this.ZoomEnum.Max);
		return [Math.round(coord.x), Math.round(coord.y)];
	},
	convertLCtoGCMulti: function(pCoordArray)
	{
		var coords = new Array();
		for (var i = 0; i < pCoordArray.length; i++)
		{
			coords.push(this.convertLCtoGC(pCoordArray[i]));
		}
		return coords;
	},
	
	/*
	 * Converts a map_floor.json event coordinates to the map coordinates system.
	 * @param object pZone to translate coordinates.
	 * @param 3D float array pPos event center. Only uses [0] and [1] values.
	 * @returns 2D int array map coordinates.
	 * @pre pZone was initialized (this is asynchronous).
	 */
	convertEventCoord: function(pPos, pZone)
	{
		var cr = pZone.continent_rect; // 2D float array
		var mr = pZone.map_rect; // 2D float array
		
		// Code from http://gw2.chillerlan.net/examples/gw2maps-jquery.html
		return [
			~~(cr[0][0]+(cr[1][0]-cr[0][0])*(pPos[0]-mr[0][0])/(mr[1][0]-mr[0][0])),
			~~(cr[0][1]+(cr[1][1]-cr[0][1])*(1-(pPos[1]-mr [0][1])/(mr[1][1]-mr[0][1])))
		];
	},
	
	/*
	 * Converts a MumbleLink player coordinates to the map coordinates system.
	 * @param 3D float array pPos [latitude altitude longitude] player position.
	 * @param string pZoneID of the zone the player is in.
	 * @returns 2D int array map coordinates.
	 */
	convertGPSCoord: function(pPos, pZoneID)
	{
		var zone = this.getZoneFromID(pZoneID);
		var coord = new Array(3);
		coord[0] = pPos[0] * this.cMETER_TO_INCH; // x coordinate
		coord[1] = pPos[2] * this.cMETER_TO_INCH; // y coordinate
		coord[2] = pPos[1] * this.cMETER_TO_INCH; // z coordinate
		return this.convertEventCoord(coord, zone);
	},
	
	/*
	 * Converts a MumbleLink 3D vector values to degrees of 2D rotation.
	 * @param 3D array pVector [x, z, y].
	 * @returns float degrees.
	 */
	convertGPSAngle: function(pVector)
	{
		return Math.atan2(pVector[2], pVector[0]) * this.cRADIAN_TO_DEGREE;
	},
	
	/*
	 * Converts a coordinate string to array coordinates.
	 * @param string pString coordinates in the form of "[X, Y]" GW2 coords.
	 * @returns array of numbers.
	 */
	parseCoordinates: function(pString)
	{
		// The regex strips all characters except digits, commas, periods, and minus sign
		var coord = pString.toString().replace(/[^\d,-.]/g, "");
		return coord.split(",");
	},
	
	/*
	 * Converts an array of coordinates to a 2D array.
	 * @param string pString array in the form of "[[X1,Y1],[X2,Y2]]" GW2 coords.
	 * @returns 2D array of coordinates. null if unable to parse.
	 */
	parseCoordinatesMulti: function(pString)
	{
		var arraylengthlimit = 13;
		var s = pString.replace(/\s/g, "");
		var sarray = new Array();
		var narray = new Array();
		var coord;
		
		if (s.length >= arraylengthlimit &&
			(s.charAt(0) === "["
			&& s.charAt(1) === "["
			&& s.charAt(s.length-1) === "]"
			&& s.charAt(s.length-2) === "]"))
		{
			s = s.substring(2, s.length-2); // Trim the [[ and ]]
			sarray = s.split("],["); // Create array from assumed "separator"
			for (var i in sarray)
			{
				coord = sarray[i].split(",");
				if (coord.length === 2)
				{
					coord[0] = parseInt(coord[0]);
					coord[1] = parseInt(coord[1]);
					narray.push(coord);
				}
			}
			return narray;
		}
		return null;
	},
	
	/*
	 * Sorts an array of GW2 coordinates.
	 * @param 2D array pArray to sort.
	 */
	sortCoordinates: function(pArray, pIsNumbered)
	{
		var coord;
		// Convert to integer
		for (var i in pArray)
		{
			coord = pArray[i];
			coord[0] = Math.round(coord[0]);
			coord[1] = Math.round(coord[1]);
		}
		// Sort the array
		pArray.sort(function (a, b)
		{
			if (a[0] > b[0])
			{
				return 1;
			}
			if (a[0] < b[0])
			{
				return -1;
			}
			return 0;
		});
		// Print the result formatted
		if (pIsNumbered)
		{
			for (var i in pArray)
			{
				this.printNumberedCoordinates(pArray[i], i);
			}
		}
		else
		{
			this.printCoordinates(pArray);
		}
	},
	roundCoordinates: function(pArray)
	{
		var coord;
		// Convert to integer
		for (var i in pArray)
		{
			coord = pArray[i];
			coord[0] = Math.round(coord[0]);
			coord[1] = Math.round(coord[1]);
		}
		// Print the result formatted
		this.printCoordinates(pArray);
	},
	printNeedles: function(pNeedles)
	{
		for (var i in pNeedles)
		{
			this.printNumberedCoordinates((pNeedles[i]).c, i);
		}
	},
	formatNodes: function(pArray)
	{
		for (var i in pArray)
		{
			I.write("{c: [" + (pArray[i])[0] + ", " + (pArray[i])[1] + "]},");
		}
	},
	printNumberedCoordinates: function(pCoord, i)
	{
		I.write("{n: " + (parseInt(i)+1) + ", c: [" + pCoord[0] + ", " + pCoord[1] + "]},");
	},
	formatCoord: function(pCoord)
	{
		return "[" + pCoord[0] + ", " + pCoord[1] + "]";
	},
	compileCoordinates: function(pCoords)
	{
		var output = "";
		for (var i in pCoords)
		{
			output = output + "[" + (pCoords[i])[0] + "," + (pCoords[i])[1] + "],";
		}
		output = output.substring(0, output.length - 1); // Trim last comma
		return "[" + output + "]";
	},
	printCoordinates: function(pCoords)
	{
		I.write(this.compileCoordinates(pCoords), 30);
	},
	
	/*
	 * Converts and prints an array of LatLngs to GW2 coordinates.
	 * @param 2D array pArray.
	 * @returns 2D array.
	 */
	convertLatLngs: function(pArray)
	{
		var coords = this.convertLCtoGCMulti(pArray);
		this.printCoordinates(coords);
	},
	
	/*
	 * Gets the coordinates from the data attribute of an HTML element.
	 * @param jqobject pElement to extract from.
	 * @returns array of GW2 coordinates.
	 */
	getElementCoordinates: function(pElement)
	{
		var coordstring = pElement.attr("data-coord");
		if (this.Zones[coordstring])
		{
			return this.getZoneCenter(coordstring);
		}
		return this.parseCoordinates(coordstring);
	},
	
	/*
	 * Binds map view event handlers to all map links (dfn tag reserved) in the
	 * specified container.
	 * @param string pContainer element ID.
	 */
	bindMapLinks: function(pContainer, pZoom)
	{
		if (I.isMapEnabled === false) { return; }
		var that = this;
		$(pContainer + " dfn").each(function()
		{
			$(this).text("[" + $(this).text() + "]");
			that.bindMapLinkBehavior($(this), pZoom, that.Pin.Program);
		});
	},
	
	/*
	 * Binds specified link to move a pinpoint to the location when hovered, and
	 * to view the map location when clicked.
	 * @param jqobject pLink to bind.
	 * @param object pPin marker to move.
	 * @param string pZoom level when viewed location.
	 */
	bindMapLinkBehavior: function(pLink, pZoom, pPin)
	{
		if (I.isMapEnabled === false) { return; }
		var that = this;
		pLink.click(function()
		{
			var thiscoord = that.getElementCoordinates($(this));
			that.goToView(thiscoord, pZoom, pPin);
		});
		
		pLink.dblclick(function()
		{
			var thiscoord = that.getElementCoordinates($(this));
			if (that.Map.getZoom() === that.ZoomEnum.Max)
			{
				that.goToView(thiscoord, that.ZoomEnum.Default, pPin);
			}
			else
			{
				that.goToView(thiscoord, that.ZoomEnum.Ground, pPin);
			}
		});
		
		// Move a point pin to that location as a preview
		pLink.mouseover(function()
		{
			var thiscoord = that.getElementCoordinates($(this));
			that.movePin(that.Pin.Over, thiscoord);
		});
		pLink.mouseout(function()
		{
			that.movePin(that.Pin.Over);
		});
	},
	
	/*
	 * Binds standard zoom in/out when user do something to an icon on the map.
	 * @param object pMarker to bind.
	 * @param string pEventType like "click" or "dblclick".
	 */
	bindOverviewBehavior: function(pMarker, pEventType)
	{
		var that = this;
		pMarker.on(pEventType, function(pEvent)
		{
			that.goToZone(pMarker.options.mappingzone, that.ZoomEnum.Sky);
		});
	},
	bindMarkerZoomBehavior: function(pMarker, pEventType)
	{
		var that = this;
		pMarker.on(pEventType, function(pEvent)
		{
			if (that.Map.getZoom() === that.ZoomEnum.Max)
			{
				that.Map.setZoom(that.ZoomEnum.Default);
			}
			else
			{
				that.Map.setView(pEvent.latlng, that.ZoomEnum.Max);
			}
		});
	},
	bindMappingZoomBehavior: function(pMarker, pEventType)
	{
		var that = this;
		pMarker.on(pEventType, function(pEvent)
		{
			if (that.Map.getZoom() === that.ZoomEnum.Max)
			{
				that.Map.setZoom(that.ZoomEnum.Sky);
			}
			else
			{
				that.Map.setView(pEvent.latlng, that.ZoomEnum.Max);
			}
		});
	},
	bindMarkerCoordBehavior: function(pMarker, pEventType)
	{
		var that = this;
		pMarker.on(pEventType, function()
		{
			var coord = that.convertLCtoGC(this.getLatLng());
			$("#" + that.MapEnum + "CoordinatesCopy")
				.val(that.formatCoord(coord))
				.select();
		});
	},
	
	/*
	 * Translates the zones list in the Map page and bind click zoom behavior.
	 * @pre The translated names from the API was retrieved.
	 */
	bindZoneList: function()
	{
		$("#mapZoneList li").each(function()
		{
			var zonenick = $(this).attr("data-zone");
			$(this).text(M.getZoneName(zonenick));
			$(this).attr("data-coord", M.getZoneCenter(zonenick).toString());
			M.bindMapLinkBehavior($(this), M.ZoomEnum.Same);
		});
		$("#mapZoneList h2").each(function()
		{
			var regionnick = $(this).attr("data-region");
			$(this).text(D.getObjectName(M.Regions[regionnick]));
		});
	},
	
	/*
	 * Imitates the character pin as in the game minimap, as informed by the overlay.
	 * @param int pForceCode 1 to force update position, -1 angle, 0 both, undefined neither.
	 */
	updateCharacter: function(pForceCode)
	{
		/*
		 * Validate the GPS data before allowing updates.
		 * Sample structure of position, character angle, and camera angle:
		 * fAvatarPosition: [116.662186, 44.60492, -104.502495]
		 * fAvatarFront: [0.070094235, 0.0, 0.99754035]
		 * fCameraFront: [-0.2597584, 0.02722733, 0.9652897]
		 * Sample structure of JSON:
		 * {"name": "Character Name","profession": 1,"race": 2,"map_id": 38,"world_id": 1234567890,"team_color_id": 9,"commander": false,"fov": 0.873}
		 */
		if (GPSPositionArray === undefined || GPSPositionArray === null || GPSPositionArray.length !== 3 || this.isUserDragging)
		{
			return;
		}
		if (GPSIdentityJSON === undefined || GPSIdentityJSON === null)
		{
			return;
		}
		if (this.isZoneValid(GPSIdentityJSON["map_id"]) === false)
		{
			this.movePin(this.Pin.Character);
			this.movePin(this.Pin.Camera);
			return;
		}
		var coord = this.convertGPSCoord(GPSPositionArray, GPSIdentityJSON["map_id"]);
		if (coord[0] > this.cMAP_BOUND || coord[0] <= 0
			|| coord[1] > this.cMAP_BOUND || coord[1] <= 0)
		{
			return;
		}
		
		// Follow character if opted and position has changed (character moved)
		if ((O.Options.bol_followCharacter && this.GPSPreviousCoord[0] !== coord[0] && this.GPSPreviousCoord[1] !== coord[1])
			|| pForceCode >= 0)
		{
			this.Map.setView(this.convertGCtoLC(coord), this.Map.getZoom());
			this.showCurrentZone(coord);
			this.GPSPreviousCoord = coord;
			pForceCode = -1; // Also update pin position
		}
		
		// Pin character if opted and angle has changed (character turned)
		if (O.Options.bol_displayCharacter)
		{
			var anglecharacter = -(this.convertGPSAngle(GPSDirectionArray));
			var anglecamera = -(this.convertGPSAngle(GPSCameraArray));
			if (this.GPSPreviousAngleCharacter !== anglecharacter
				|| this.GPSPreviousAngleCamera !== anglecamera
				|| pForceCode <= 0)
			{
				this.movePin(this.Pin.Character, coord);
				this.movePin(this.Pin.Camera, coord);
				this.Pin.Camera._icon.style.zIndex = this.cZIndexBury;
				var pintranscharacter = this.Pin.Character._icon.style.transform.toString();
				var pintranscamera = this.Pin.Camera._icon.style.transform.toString();
				if (pintranscharacter.indexOf("rotate") === -1)
				{
					this.Pin.Character._icon.style.transform = pintranscharacter + " rotate(" + anglecharacter + "deg)";
				}
				if (pintranscamera.indexOf("rotate") === -1)
				{
					this.Pin.Camera._icon.style.transform = pintranscamera + " rotate(" + anglecamera + "deg)";
				}
				this.GPSPreviousAngleCharacter = anglecharacter;
				this.GPSPreviousAngleCamera = anglecamera;
			}
		}
	},
	
	/*
	 * Executes GPS functions every specified milliseconds.
	 */
	tickGPS: function()
	{
		if (O.Options.bol_followCharacter || O.Options.bol_displayCharacter)
		{
			M.updateCharacter();
			window.clearTimeout(M.GPSTimeout);
			M.GPSTimeout = setTimeout(M.tickGPS, O.Options.int_msecGPSRefresh);
		}
	}
	
};

/* =============================================================================
 * @@Populate Tyria-exclusive map properties and functions
 * ========================================================================== */
P = {
	
	Layer: {
		DryTopNicks: new L.layerGroup(), // Dry Top event names and timestamps
		Chest: new L.layerGroup() // Open world basic chests
	},
	LayerArray: {
		ChainPath: new Array(),
		Resource: new Array(),
		JP: new Array(),
		Guild_Bounty: new Array(),
		Guild_Trek: new Array(),
		Guild_Challenge: new Array(),
		Guild_Rush: new Array(),
		Guild_Puzzle: new Array(),
		DryTopIcons: new Array(),
		DryTopRings: new Array(),
		DryTopActive: new Array()
	},
	
	Events: {},
	DryTopTimer: {},
	Resources: {},
	JPs: {},
	Chests: {},
	Collectibles: {},
	Guild: {},
	
	/*
	 * Initializes the map only if the boolean set by specific modes is on.
	 */
	initializeMap: function()
	{
		if (I.isMapEnabled)
		{
			M.initializeMap();
		}
	},
	
	/*
	 * Conditions needed to do the initial zoom to event on pageload.
	 * @returns true if qualify.
	 */
	wantZoomToFirstEvent: function()
	{
		if (I.isMapEnabled && O.Options.bol_tourPrediction && (I.ModeCurrent !== I.ModeEnum.Overlay)
			&& I.PageCurrent === I.PageEnum.Chains
			&& U.Args[U.KeyEnum.Go] === undefined)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Draws a path with each link of increasing or decreasing weight, to
	 * simulate a worm crawling in a direction.
	 * @param array pCoords GW2 coordinates.
	 * @param boolean pIsObverse or reversed.
	 * @returns LayerGroup path.
	 * @pre Path has enough links to distinguish themselves.
	 */
	drawDirectedPath: function(pCoords, pIsObverse, pColor)
	{
		if (pIsObverse === undefined)
		{
			pIsObverse = true;
		}
		var latlngs = M.convertGCtoLCMulti(pCoords);
		var layergroup = new L.layerGroup();
		var numofsegments = 8;
		var iweight = (pIsObverse) ? 0 : numofsegments-1;
		pColor = pColor || "lime";
		
		for (var i = 0; i < latlngs.length - 1; i++)
		{
			layergroup.addLayer(L.polyline([latlngs[i], latlngs[i+1]], {color: pColor, weight: (iweight+2)*2}));
			iweight = (pIsObverse) ? (iweight+1) : (iweight-1);
			if (pIsObverse && iweight >= numofsegments)
			{
				iweight = 0;
			}
			else if (!pIsObverse && iweight < 0)
			{
				iweight = numofsegments-1;
			}
		}
		return layergroup;
	},
	
	/*
	 * Draws spots representing an interactable item in the game world.
	 * @param array pCoords GW2 coordinates.
	 * @param object pOptions Leaflet marker options.
	 * @returns LayerGroup circles.
	 */
	drawSpots: function(pCoords, pOptions)
	{
		var latlngs = M.convertGCtoLCMulti(pCoords);
		var layergroup = new L.layerGroup();
		var Options = {radius: 10, color: "lime", weight: 4};
		if (pOptions !== undefined)
		{
			for (var i in pOptions)
			{
				Options[i] = pOptions[i];
			}
		}
		
		for (var i in latlngs)
		{
			layergroup.addLayer(L.circleMarker(latlngs[i], Options));
		}
		return layergroup;
	},
	
	/*
	 * Draws a map completion route for the current moused zone, using the
	 * personal pins system.
	 */
	drawCompletionRoute: function()
	{
		if (M.isItineraryRetrieved)
		{
			M.redrawPersonalPath(M.ZoneCurrent.path);
		}
		else
		{
			// If route data is not loaded, load it and execute this function again
			$.getScript(U.URL_DATA.Itinerary).done(function()
			{
				for (var i in GW2T_COMPLETION_DATA)
				{
					M.Zones[i].path = GW2T_COMPLETION_DATA[i].path;
				}
				M.isItineraryRetrieved = true;
				P.drawCompletionRoute();
			});
		}
	},
	
	/*
	 * Generates icons and rings for all dynamic events.
	 */
	populateEvents: function()
	{
		// Function to filter out unwanted events
		var isEventUnwanted = function(pName)
		{
			if (pName.indexOf("guild") !== -1 || // Guild missions
				pName.indexOf("subdue") !== -1 || // Guild bounty
				pName.indexOf("challenge") !== -1 || // Hero challenges
				pName.indexOf("offshoot") !== -1 || // Obsolete events
				pName.indexOf("vigil en") !== -1 ||
				pName.indexOf("haunted") !== -1)
			{
				return true;
			}
			return false;
		};
		
		// Function to guess an event's icon (not provided by the API) based on its name
		var determineEventIcon = function(pName)
		{
			if (pName.indexOf("free") !== -1) return "img/event/release.png";
			if (pName.indexOf("rescue") !== -1) return "img/event/release.png";
			if (pName.indexOf("capture") !== -1) return "img/event/flag.png";
			if (pName.indexOf("retake") !== -1) return "img/event/flag.png";
			if (pName.indexOf("reclaim") !== -1) return "img/event/flag.png";
			if (pName.indexOf("liberate") !== -1) return "img/event/flag.png";
			if (pName.indexOf("protect") !== -1) return "img/event/shield.png";
			if (pName.indexOf("defend") !== -1) return "img/event/shield.png";
			if (pName.indexOf("escort") !== -1) return "img/event/shield.png";
			if (pName.indexOf("kill") !== -1) return "img/event/boss.png";
			if (pName.indexOf("slay") !== -1) return "img/event/boss.png";
			if (pName.indexOf("defeat") !== -1) return "img/event/boss.png";
			if (pName.indexOf("collect") !== -1) return "img/event/collect.png";
			if (pName.indexOf("help") !== -1) return "img/event/star.png";
			if (pName.indexOf("destroy") !== -1) return "img/event/cog.png";
			if (pName.indexOf("gather") !== -1) return "img/event/collect.png";
			if (pName.indexOf("bring") !== -1) return "img/event/collect.png";
			if (pName.indexOf("recover") !== -1) return "img/event/collect.png";
			if (pName.indexOf("return") !== -1) return "img/event/collect.png";
			if (pName.indexOf("retrieve") !== -1) return "img/event/collect.png";
			if (pName.indexOf("burglar") !== -1) return "img/event/fist.png";
			return "img/event/swords.png";
		};
		
		// Function to approximate the event ring as viewed in the game's minimap
		var determineEventRing = function(pEvent)
		{
			var r = pEvent.location.radius;
			switch (pEvent.location.type)
			{
				case "sphere": {
					if (r < 2000) return "img/ring/c_s.png";
					return "img/ring/c_m.png";
				}
				
				case "cylinder": {
					return "img/ring/e_m_h.png";
				}
				
				case "poly": {
					return "img/ring/e_l_h.png";
				}
			}
			
			return "img/ring/c_m.png";
		};
		
		// First, store the event names in user's language
		// Note that event_names.json does not contain obsolete events, unlike event_details.json
		$.getJSON(U.URL_API.EventNames, function(pData)
		{
			var i;
			for (i in pData)
			{
				P.Events[(pData[i].id)] = {};
				P.Events[(pData[i].id)].name = pData[i].name;
			}
		}).done(function()
		{
			// Second, retrieve the event details in the default language for filtering events
			$.getJSON(U.URL_API.EventDetails, function(pDataInner)
			{
				var i;
				var event;
				var searchname;
				var newname;
				var marker;
				var coord;

				var zoneobj;

				for (i in pDataInner.events)
				{
					event = pDataInner.events[i];
					searchname = event.name.toLowerCase();
					newname = (P.Events[i] !== undefined) ? P.Events[i].name : event.name;
					zoneobj = M.getZoneFromID(event.map_id);
					// Skip iterated event if...
					if (P.Events[i] === undefined // Event is not in event_names.json also
						|| zoneobj === undefined // Event is not in a world map zone
						|| isEventUnwanted(searchname) // Event is obsolete
						|| event.map_id === 988 // Ignore Dry Top
						|| event.map_id === 50) // LA
					{
						continue;
					}

					coord = M.convertGCtoLC(M.getEventCenter(event));

					// Create event's ring
					marker = L.marker(coord,
					{
						clickable: false,
						icon: L.icon(
						{
							iconUrl: determineEventRing(event),
							iconSize: [256, 256],
							iconAnchor: [128, 128]
						})
					});
					zoneobj.Layers.EventRing.addLayer(marker);

					// Create event's icon
					marker = L.marker(coord,
					{
						title: "<span class='" + "mapPoi" + "'>" + newname + " (" + event.level + ")" + "</span>",
						icon: L.icon(
						{
							iconUrl: determineEventIcon(searchname),
							iconSize: [48, 48],
							iconAnchor: [24, 24]
						})
					});
					M.bindMappingZoomBehavior(marker, "click");
					zoneobj.Layers.EventIcon.addLayer(marker);
				}
				M.isEventIconsGenerated = true;

			}).done(function()
			{
				P.donePopulation();
			}).fail(function()
			{

			}).always(function()
			{
				P.finishPopulation();
			});
		}).fail(function()
		{
			P.finishPopulation();
		}).always(function()
		{
			
		});
	},
	
	/*
	 * Does final touches to the map after the zone icons have been generated.
	 */
	donePopulation: function()
	{
		M.toggleLayer(M.Layer.ZoneRectangle, O.Options.bol_showZoneRectangles);
		if (P.wantZoomToFirstEvent())
		{
			// Initialize the "current moused zone" variable for showing waypoints
			M.showCurrentZone(M.getZoneCenter(M.cInitialZone));
			// Tour to the event on the map if opted
			$("#chnEvent_" + C.CurrentChainSD.nexus + "_"
				+ C.CurrentChainSD.CurrentPrimaryEvent.num).trigger("click");
		}
	},
	finishPopulation: function()
	{
		M.isMapAJAXDone = true;
		M.bindMapVisualChanges(I.MapEnum.Tyria);
		M.adjustZoomMapping();
		P.adjustZoomDryTop();
		M.goToArguments(U.Args[U.KeyEnum.Go], M.Pin.Program);
		M.tickGPS();
	},
	
	/*
	 * Creates polylines for the map based on event's path data, then add event
	 * coordinates to the event names HTML so the map views the location when
	 * user clicks on it.
	 */
	drawChainPaths: function(pChain)
	{
		if (I.isMapEnabled === false) { return; }
		var i;
		var event, primaryevent;
		var color;
		var coords;
		var pathline;
		
		if (C.isChainWorldBoss(pChain))
		{
			for (i = 0; i < pChain.primaryEvents.length; i++)
			{
				primaryevent = pChain.primaryEvents[i];

				switch (i)
				{
					case 0: color = "red"; break;
					case 1: color = "orange"; break;
					case 2: color = "yellow"; break;
					case 3: color = "lime"; break;
					case 4: color = "cyan"; break;
					case 5: color = "blue"; break;
					case 6: color = "violet"; break;
					case 7: color = "purple"; break;
					default: color = "white";
				}

				/*
				 * An event's path in the Chains object is an array of coordinates
				 * (which are themselves array of two numbers x and y). For primary
				 * events: the first entry is the event's location, the rest is
				 * the visual path of the step. Nonprimary events contain
				 * only a single entry, that is, their location.
				 */
				coords = M.convertGCtoLCMulti(primaryevent.path, 1);
				pathline = L.polyline(coords, {color: color});
				M.Zones[(pChain.extra[0])].Layers.Path.addLayer(pathline);
			}
		}

		/*
		 * Go to the event location when clicked on event name.
		 */
		var eventnum;
		for (i in pChain.events)
		{
			event = pChain.events[i];
			eventnum = event.num;
			if (eventnum.indexOf(".") !== -1)
			{
				// jQuery thinks the period is a class, escape it
				eventnum = eventnum.replace(".", "\\.");
			}
			$("#chnEvent_" + pChain.nexus + "_" + eventnum).each(function()
			{
				// Assign a data attribute to the event name
				var coord = event.path[0];
				$(this).attr("data-coord", coord[0] + "," + coord[1]);
				$(this).attr("data-eventindex", i);
				// Read the attribute and use the coordinate when clicked for touring
				if (I.ModeCurrent !== I.ModeEnum.Mobile)
				{
					M.bindMapLinkBehavior($(this), M.ZoomEnum.Ground, M.Pin.Event);
				}
			});
		}
	},
	
	/*
	 * Creates event icons for Dry Top chains, they will be resized by the zoomend function
	 */
	generateDryTop: function()
	{
		$.getScript(U.URL_DATA.DryTop).done(function()
		{
			C.DryTop = GW2T_DRYTOP_DATA;
			var i, ii;
			var chain, event, marker;
			
			// Event nicks are independent of the events themselves and are always shown on the map
			for (i in C.DryTop)
			{
				event = C.DryTop[i];
				marker = L.marker(M.convertGCtoLC(event.coord),
				{
					clickable: false,
					icon: L.divIcon(
					{
						className: "mapNick",
						html: "<span class='mapNickIn'>" + D.getObjectName(event)
							+ "<br /><ins style='color:" + event.color + "'>" + event.time + "</ins></span>",
						iconSize: [512, 64],
						iconAnchor: [256, 32]
					})
				});
				P.Layer.DryTopNicks.addLayer(marker);
			}
			M.toggleLayer(P.Layer.DryTopNicks, true);
			
			// Timer integrated on the map
			P.DryTopTimer = L.marker(M.convertGCtoLC(M.getZoneCenter("dry")),
			{
				clickable: false,
				icon: L.divIcon(
				{
					className: "mapNick",
					html: "<div class='mapNickIn' id='mapDryTopInfo'><span id='mapDryTopTimer'></span><br />"
						+ "<input id='mapDryTopClip0' type='text' /> "
						+ "<input id='mapDryTopClip1' type='text' /></div>",
					iconSize: [512, 64],
					iconAnchor: [256, 32]
				})
			});
			M.toggleLayer(P.DryTopTimer, true);
			I.qTip.init($("#mapDryTopClip0, #mapDryTopClip1").click(function()
			{
				$(this).select();
			}).hover(
				function() { M.isMouseOnHUD = true; },
				function() { M.isMouseOnHUD = false; }
			));
			
			// Create icons
			for (i in C.DryTopChains)
			{
				chain = C.DryTopChains[i];
				for (ii in chain.events)
				{
					event = chain.events[ii];
					
					event.eventring = L.marker(M.convertGCtoLC(event.path[0]),
					{
						zIndexOffset: M.cZIndexBury,
						clickable: false,
						image: "img/ring/" + event.ring + I.cPNG,
						icon: L.icon(
						{
							iconUrl: "img/ring/" + event.ring + I.cPNG,
							iconSize: [32, 32],
							iconAnchor: [16, 16]
						})
					});
					event.eventicon = L.marker(M.convertGCtoLC(event.path[0]),
					{
						title: "<span class='mapEvent'>" + D.getObjectName(event) + "</span>",
						image: "img/event/" + event.icon + I.cPNG,
						icon: L.icon(
						{
							iconUrl: "img/event/" + event.icon + I.cPNG,
							iconSize: [16, 16],
							iconAnchor: [8, 8]
						})
					});
					M.bindMappingZoomBehavior(event.eventicon, "click");
					// Show only current event icons, the highlight event function will continue this
					if ($("#chnEvent_" + chain.nexus + "_" + event.num).hasClass("chnEventCurrent"))
					{
						P.LayerArray.DryTopActive.push(event.eventicon);
						P.LayerArray.DryTopActive.push(event.eventring);
						M.toggleLayer(event.eventring, true);
						M.toggleLayer(event.eventicon, true);
					}
					
					P.LayerArray.DryTopRings.push(event.eventring);
					P.LayerArray.DryTopIcons.push(event.eventicon);
				}
			}
			I.qTip.init(".leaflet-marker-icon");
			
			// Finally
			C.isDryTopGenerated = true;
			T.initializeDryTopStrings();
			P.toggleDryTopIcons(true);
		});
	},
	
	/*
	 * Shows or hides Dry Top associated map markers.
	 * @param boolean pBoolean.
	 */
	toggleDryTopIcons: function(pBoolean)
	{
		if (C.isDryTopGenerated)
		{
			C.isDryTopIconsShown = pBoolean;
			M.toggleLayer(P.Layer.DryTopNicks, pBoolean);
			M.toggleLayer(P.DryTopTimer, pBoolean);
			if (pBoolean)
			{
				M.toggleLayerArray(P.LayerArray.DryTopActive, pBoolean);
				P.adjustZoomDryTop();
				K.updateDryTopClipboard();
			}
			else
			{
				M.toggleLayerArray(P.LayerArray.DryTopIcons, pBoolean);
				M.toggleLayerArray(P.LayerArray.DryTopRings, pBoolean);
			}
		}
	},
	
	/*
	 * Resizes Dry Top markers so they scale with the current zoom level.
	 */
	adjustZoomDryTop: function()
	{
		if (C.isDryTopIconsShown)
		{
			var i;
			var currentzoom = M.Map.getZoom();
			var icon, iconsize, ringsize;
			var nickfontsize, nickopacity;

			switch (currentzoom)
			{
				case 7: iconsize = 32; nickfontsize = 20; nickopacity = 0.9; break;
				case 6: iconsize = 28; nickfontsize = 16; nickopacity = 0.8; break;
				case 5: iconsize = 24; nickfontsize = 12; nickopacity = 0.6; break;
				case 4: iconsize = 20; nickfontsize = 0; nickopacity = 0; break;
				case 3: iconsize = 16; nickfontsize = 0; nickopacity = 0; break;
				default:
				{
					iconsize = 0; nickfontsize = 0; nickopacity = 0;
				}
			}
			
			// Event icons are same size as waypoints, but their rings are bigger
			ringsize = M.scaleDimension(M.cRING_SIZE_MAX);

			for (i in P.LayerArray.DryTopIcons)
			{
				// Icons
				icon = P.LayerArray.DryTopIcons[i];
				M.changeMarkerIcon(icon, icon.options.image, iconsize);
				// Rings
				icon = P.LayerArray.DryTopRings[i];
				M.changeMarkerIcon(icon, icon.options.image, ringsize);
			}
			
			P.Layer.DryTopNicks.eachLayer(function(layer) {
				if (layer._icon)
				{
					layer._icon.style.fontSize = nickfontsize + "px";
					layer._icon.style.opacity = nickopacity;
					layer._icon.style.zIndex = M.cZIndexBury + 1; // Don't cover other icons
					layer._icon.style.display = "table"; // For middle vertical alignment
				}
			});
			P.DryTopTimer._icon.style.fontSize = (nickfontsize*2) + "px";
			P.DryTopTimer._icon.style.opacity = nickopacity;
			P.DryTopTimer._icon.style.zIndex = M.cZIndexRaise + 1;
			P.DryTopTimer._icon.style.display = "table";
		}
	}
};

/* =============================================================================
 * @@Generate content for the sections on Map page
 * ========================================================================== */
G = {
	
	/*
	 * Initializes Login Rewards track and Dailies Calendar.
	 */
	generateAndInitializeDailies: function()
	{
		// Adjust the squares progress
		G.shiftLoginTrack();
		// Bind click squares behavior
		$("#lgnTrack ins").each(function()
		{
			$(this).click(function(){
				G.shiftLoginValue(parseInt($(this).data("i")));
			}).mouseenter(function()
			{
				$("#lgnRecordHover").text("(" + (parseInt($(this).data("i")) + 1) + ")");
			});
		});
		$("#lgnTrack").mouseleave(function()
		{
			$("#lgnRecordHover").text("");
		});
		
		I.qTip.init("#lgnTrack ins");
		
		// Generate dailies calendar
		G.regenerateDailiesCalendar();
	},
	shiftLoginTrack: function()
	{
		var DAYS_IN_TRACK = 28;
		var LOGIN_START_UNIX = T.DAILY_START_UNIX;
		T.DAYS_SINCE_DAILY_START = ~~((T.getUNIXSeconds() - LOGIN_START_UNIX) / T.cSECONDS_IN_DAY);
		var CURRENT_DAY_IN_TRACK = T.wrapInteger(T.DAYS_SINCE_DAILY_START - O.Options.int_shiftLogin, DAYS_IN_TRACK);
		var OFFICIAL_DAY_IN_TRACK = T.wrapInteger(T.DAYS_SINCE_DAILY_START, DAYS_IN_TRACK);
		
		var icurrent = 0;
		var iofficial = 0;
		// Initial CSS
		$("#lgnTrack ins").each(function()
		{
			$(this).css({"border-radius": "auto", opacity: 0.3})
				.removeClass("lgnCurrent lgnOfficial").data("i", iofficial);
			if (iofficial === OFFICIAL_DAY_IN_TRACK)
			{
				$(this).addClass("lgnOfficial");
				T.loginTrackOfficial = iofficial;
			}
			iofficial++;
		});
		// Track CSS
		$("#lgnTrack ins").each(function()
		{
			if (icurrent === CURRENT_DAY_IN_TRACK + 1)
			{
				return false; // Break from each loop
			}
			else if (icurrent === CURRENT_DAY_IN_TRACK)
			{
				$(this).addClass("lgnCurrent"); // Current day is highlighted
			}
			$(this).css({opacity: 1}); // Days unlocked becomes fully opaque
			
			icurrent++;
		});
		
		// Show statistics
		$("#lgnRecordCurrent").text((CURRENT_DAY_IN_TRACK + 1) + " / " + DAYS_IN_TRACK);
	},
	shiftLoginValue: function(pCurrent)
	{
		var DAYS_IN_TRACK = 28;
		var newshift = T.wrapInteger((T.loginTrackOfficial - pCurrent), DAYS_IN_TRACK);
		$("#opt_int_shiftLogin").val(newshift).trigger("change");
		G.shiftLoginTrack();
	},
	regenerateDailiesCalendar: function()
	{
		$("#dlyCalendar").empty();
		
		var i;
		var dayofmonth = 0;
		var ithdate;
		var DAYS_TO_SHOW = 32;
		
		for (i = 0; i < DAYS_TO_SHOW; i++)
		{
			ithdate = T.addDaysToDate(new Date(), i);
			dayofmonth = ithdate.getUTCDate();
			G.insertDailyDay(T.DailyCalendar[dayofmonth], ithdate);
		}
		
		$("#dlyCalendar div:first").addClass("dlyCurrent").next().addClass("dlyNext");
		$("#dlyCalendar .dlyEvent").each(function()
		{
			M.bindMapLinkBehavior($(this), M.ZoomEnum.Sky);
		});
		I.qTip.init("#dlyCalendar ins");
	},
	
	/*
	 * Inserts a "day" div into the dailies calendar.
	 * @param object pDaily daily object from general.js
	 * @param object pDate of the day.
	 */
	insertDailyDay: function(pDaily, pDate)
	{
		var pve, pvp, wvw; // Daily types
		var gather, activity, boss; // Regional dailies
		var prof0, prof1;
		// Prepare variables
		var dayclass = "";
		var bosssrc = "";
		var bosshtml = "";
		
		// Wrapper tags that provide the region background image
		var gatherregion = "";
		var activityregion = "";
		var eventregion = "";
		var bossregion = "";
		var gatherregionclose = "</ins>";
		var activityregionclose = "";
		var eventregionclose = "</ins>";
		var bossregionclose = "";
		

		// The rows
		pve = pDaily["pve"];
		pvp = pDaily["pvp"];
		wvw = pDaily["wvw"];
		
		// Some cells
		gather = pve[0].split(" ");
		activity = pve[1].split(" ");
		boss = pve[3].split(" ");
		gatherregion = "<ins class='dlyRegion dly_region_" + gather[1].toLowerCase() + "'>";
		if (activity[0] === "Vista")
		{
			activityregion = "<ins class='dlyRegion dly_region_" + activity[1].toLowerCase() + "'>";
			activityregionclose = "</ins>";
		}
		eventregion = "<ins class='dlyRegion dly_region_" + M.getZoneRegion(pve[2]) + "'>";
		if (boss[0] === "Fractal")
		{
			bosssrc = "dly_pve_" + boss[0].toLowerCase() + "_" + boss[1];
		}
		else
		{
			bosssrc = "dly_pve_boss";
			bossregion = "<ins class='dlyRegion dly_region_" + C.getChainRegion(C.getChainByAlias(boss[0])) + "'>";
			bossregionclose = "</ins>";
			bosshtml = "<em><img src='img/chain/" + boss[0].toLowerCase() + I.cPNG + "' /></em>";
		}
		
		prof0 = pvp[2].split(" ");
		prof1 = pvp[3].split(" ");
		
		switch (pDate.getUTCDay())
		{
			case T.DayEnum.Sunday: dayclass = "dlySunday"; break;
			case T.DayEnum.Saturday: dayclass = "dlySaturday"; break;
		}

		// Generate HTML
		$("#dlyCalendar").append("<div>"
			// Day
			+ "<aside></aside>" + bosshtml + "<var class='" + dayclass + "'>" + pDate.getUTCDate() + "</var>"
			// PvE
			+ "<span><ins class='dly_daily_pve'></ins>"
			+ gatherregion + "<ins class='dly_pve_" + gather[0].toLowerCase() + "' title='" + pve[0] + "'></ins>" + gatherregionclose
			+ activityregion + "<ins class='dly_pve_" + activity[0].toLowerCase() + "' title='" + pve[1] + "'></ins>" + activityregionclose
			+ eventregion + "<ins class='dly_pve_event dlyEvent curZoom' title='" + pve[2] + " Events'"
				+ "data-coord='" + (pve[2]).toLowerCase() + "'></ins>" + eventregionclose
			+ bossregion + "<ins class='" + bosssrc + "' title='" + pve[3] + "'></ins>" + bossregionclose + "</span>"
			// PvP
			+ "<span><ins class='dly_daily_pvp'></ins>"
			+ "<ins class='dly_pvp_" + pvp[0].toLowerCase() + "' title='" + pvp[0] + "'></ins>"
			+ "<ins class='dly_pvp_" + pvp[1].toLowerCase() + "' title='" + pvp[1] + "'></ins>"
			+ "<ins class='dly_pvp_profession_" + prof0[0].toLowerCase() + "_0' title='" + pvp[2] + "'>"
				+ "<ins class='dly_pvp_profession_" + prof0[1].toLowerCase() + "_1'></ins>" + "</ins>"
			+ "<ins class='dly_pvp_profession_" + prof1[0].toLowerCase() + "_0' title='" + pvp[3] + "'>"
				+ "<ins class='dly_pvp_profession_" + prof1[1].toLowerCase() + "_1'></ins>" + "</ins></span>"
			// WvW
			+ "<span><ins class='dly_daily_wvw'></ins>"
			+ "<ins class='dly_wvw_" + wvw[0].toLowerCase() + "' title='" + wvw[0] + "'></ins>"
			+ "<ins class='dly_wvw_" + wvw[1].toLowerCase() + "' title='" + wvw[1] + "'></ins>"
			+ "<ins class='dly_wvw_" + wvw[2].toLowerCase() + "' title='" + wvw[2] + "'></ins>"
			+ "<ins class='dly_wvw_" + wvw[3].toLowerCase() + "' title='" + wvw[3] + "'></ins></span>"
			+ "</div>");
	},
	
	/*
	 * Populates the map with resource node markers and create HTML checkboxes
	 * to toggle their display on the map.
	 */
	generateAndInitializeResources: function()
	{
		var opacityclicked = 0.3;
		var getNodeState = function(pMarker)
		{
			return X.getChecklistItem(X.Checklists["Resource" + pMarker.options.grade], pMarker.options.index);
		};
		var setNodeState = function(pMarker, pState)
		{
			X.setChecklistItem(X.Checklists["Resource" + pMarker.options.grade], pMarker.options.index, pState);
		};
		var bindNodeBehavior = function(pMarker)
		{
			M.bindMarkerZoomBehavior(pMarker, "dblclick");
			M.bindMarkerCoordBehavior(pMarker, "contextmenu");
			pMarker.on("click", function()
			{
				if (getNodeState(pMarker) === X.ChecklistEnum.Checked)
				{
					setNodeState(pMarker, X.ChecklistEnum.Unchecked);
					this.setOpacity(1);
				}
				else
				{
					setNodeState(pMarker, X.ChecklistEnum.Checked);
					this.setOpacity(opacityclicked);
				}
			});
		};
		var refreshResourcePrices = function()
		{
			// Get API prices for each resource type
			for (var i in P.Resources)
			{
				var id = P.Resources[i].item;
				if (id !== null)
				{
					(function(inneri){
						$.getJSON(U.URL_API.ItemPrices + id, function(pData)
						{
							var price = E.deductTax(pData.sells.unit_price);
							$("#nodPrice_" + inneri).html(E.createCoinString(price, true));
						});
					})(i);
				}
			}
		};
		
		$.getScript(U.URL_DATA.Resource).done(function()
		{
			P.Resources = GW2T_RESOURCE_DATA; // This object is inline in the map HTML file
			var i, ii;
			var counterrich = 0;
			var counterregular = 0;
			var counterzone = 0;
			var resource; // A type of resource, like copper ore
			var layer, marker, path;

			for (i in P.Resources)
			{
				resource = P.Resources[i];
				var name = i.toLowerCase();

				// Permanent Rich/Farm nodes
				if (resource.riches !== undefined && resource.riches.length > 0)
				{
					layer = new L.layerGroup();
					for (ii in resource.riches)
					{
						marker = L.marker(M.convertGCtoLC(resource.riches[ii].c),
						{
							grade: "Rich",
							index: counterrich,
							icon: L.divIcon(
							{
								className: "nodRich",
								html: "<img src='" + "img/node/" + name + I.cPNG + "' />",
								iconSize: [32, 32],
								iconAnchor: [16, 16]
							})
						});
						bindNodeBehavior(marker);
						// Add to array
						layer.addLayer(marker);
						// Draw path if this node has it
						if (resource.riches[ii].p !== undefined)
						{
							path = L.polyline(M.convertGCtoLCMulti(resource.riches[ii].p),
							{
								color: "white",
								dashArray: "5,10",
								opacity: 0.3
							});
							layer.addLayer(path);
						}
						counterrich++;
					}
					M.toggleLayer(layer);
					P.Layer["Resource_Rich_" + i] = layer;
					P.LayerArray.Resource.push(layer);
				}
				// Regular nodes that may spawn there
				if (resource.regulars !== undefined && resource.regulars.length > 0)
				{
					layer = new L.layerGroup();
					for (ii in resource.regulars)
					{
						marker = L.marker(M.convertGCtoLC(resource.regulars[ii].c),
						{
							grade: "Regular",
							index: counterregular,
							icon: L.divIcon(
							{
								className: "nodRegular",
								html: "<img src='" + "img/node/" + name + I.cPNG + "' />",
								iconSize: [24, 24],
								iconAnchor: [12, 12]
							})
						});
						bindNodeBehavior(marker);
						// Add to array
						layer.addLayer(marker);
						counterregular++;
					}
					M.toggleLayer(layer);
					P.Layer["Resource_Regular_" + i] = layer;
					P.LayerArray.Resource.push(layer);
				}
				// Resources with only zone locations (marker centered in map)
				if (resource.zones !== undefined)
				{
					layer = new L.layerGroup();
					for (ii in resource.zones)
					{
						var zone = resource.zones[ii];
						var coord = M.getZoneCenter(zone);
						coord[0] += resource.offset[0];
						coord[1] += resource.offset[1];
						marker = L.marker(M.convertGCtoLC(coord),
						{
							grade: "Zone",
							index: counterzone,
							icon: L.divIcon(
							{
								className: "nodZone",
								html: "<img src='" + "img/node/" + name + I.cPNG + "' />",
								iconSize: [32, 32],
								iconAnchor: [16, 16]
							})
						});
						bindNodeBehavior(marker);
						// Add to array
						layer.addLayer(marker);
						counterzone++;
					}
					M.toggleLayer(layer);
					P.Layer["Resource_Zone_" + i] = layer;
					P.LayerArray.Resource.push(layer);
				}
			}
			
			// Initialize checklist for saving nodes clicked state
			X.initializeChecklist(X.Checklists.ResourceRich, counterrich);
			X.initializeChecklist(X.Checklists.ResourceRegular, counterregular);
			X.initializeChecklist(X.Checklists.ResourceZone, counterzone);
			// Fade the node if state is so in checklist
			for (i in P.LayerArray.Resource)
			{
				P.LayerArray.Resource[i].eachLayer(function(pMarker)
				{
					if (pMarker instanceof L.Marker && getNodeState(pMarker) === X.ChecklistEnum.Checked)
					{
						pMarker.setOpacity(opacityclicked);
					}
				});
			}
			
			// Create checkboxes
			for (i in P.Resources)
			{
				resource = P.Resources[i];
				$("#nodResource_" + resource.type).append(
					"<label><input id='nod_" + i + "' type='checkbox' checked='checked' /> <img src='img/node/"
					+ i.toLowerCase() + I.cPNG + "' /> <var>" + D.getObjectName(resource) + "</var><samp id='nodPrice_" + i + "'></samp></label>");
			}
			// Bind checkboxes
			for (i in P.Resources)
			{
				$("#nod_" + i).change(function()
				{
					var thisresource = U.getSubstringFromHTMLID($(this));
					var wantshow = $(this).prop("checked");
					var wantregular = $("#nodShowRegular").prop("checked");
					M.toggleLayer(P.Layer["Resource_Rich_" + thisresource], wantshow);
					M.toggleLayer(P.Layer["Resource_Regular_" + thisresource], (wantshow && wantregular));
					M.toggleLayer(P.Layer["Resource_Zone_" + thisresource], (wantshow && wantregular));
				});
			}
			$("#mapToggle_Resource").data("checked", true).click(function()
			{
				var bool = I.toggleButtonState($(this));
				for (i in P.Resources)
				{
					$("#nod_" + i).prop("checked", bool).trigger("change");
				}
			});
			
			// Bind buttons to toggle all checkboxes of that resource category
			$("#nodToggle_ResourceMetal").click(function()
			{
				$("#nodResource_Metal input").trigger("click");
			});
			$("#nodToggle_ResourcePlant").click(function()
			{
				$("#nodResource_Plant input").trigger("click");
			});
			$("#nodToggle_ResourceWood").click(function()
			{
				$("#nodResource_Wood input").trigger("click");
			});
			
			// Bind the checkbox to show regular nodes
			$("#nodShowRegular").change(function()
			{
				var wantregular = $(this).prop("checked");
				for (var i in P.Resources)
				{
					var wantshow = $("#nod_" + i).prop("checked");
					M.toggleLayer(P.Layer["Resource_Regular_" + i], (wantshow && wantregular));
					M.toggleLayer(P.Layer["Resource_Zone_" + i], (wantshow && wantregular));
				}
			}).trigger("change");
			
			// Bind button to show the clicked map nodes again
			$("#nodUncheck").click(function()
			{
				for (var i in P.LayerArray.Resource)
				{
					P.LayerArray.Resource[i].eachLayer(function(pMarker)
					{
						if (pMarker instanceof L.Marker)
						{
							pMarker.setOpacity(1);
						}
					});
				}
				X.clearChecklist(X.Checklists.ResourceRich);
				X.clearChecklist(X.Checklists.ResourceRegular);
				X.clearChecklist(X.Checklists.ResourceZone);
			});
			
			// Bind button to refresh TP prices
			$("#nodRefresh").click(function()
			{
				refreshResourcePrices();
				I.write("Prices refreshed.");
			});
			
			// Finally
			refreshResourcePrices();
		});
	},
	
	/*
	 * Populates the map with JP location markers with different color depending
	 * on the difficulty.
	 */
	generateAndInitializeJPs: function()
	{
		var styleJPMarker = function(pMarker, pDifficulty)
		{
			pMarker.setIcon(new L.icon(
			{
				className: "jpzDifficulty" + pDifficulty,
				iconUrl: "img/map/jp.png",
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			}));
		};
		
		$.getScript(U.URL_DATA.JP).done(function()
		{
			P.JPs = GW2T_JP_DATA;
			P.Chests = GW2T_CHEST_DATA;
			X.Checklists.JP.length = O.getObjectLength(P.JPs);
			P.LayerArray.JP = new Array(X.Checklists.JP.length);
		
			var i, ii;
			for (var i in P.JPs)
			{
				/*
				 * Create JP markers.
				 */
				var jp = P.JPs[i];
				var coord = M.parseCoordinates(jp.coord);
				var type = (jp.difficulty === 4) ? "Explorer" : "JP";
				var marker = L.marker(M.convertGCtoLC(coord),
				{
					id: jp.id,
					difficulty: jp.difficulty,
					title: "<div class='mapLoc'><dfn>" + type + ":</dfn> " + D.getObjectName(jp)
						+ "<img src='" + U.getImageHosted(jp.img) + "' /></div>"
				});
				styleJPMarker(marker, jp.difficulty);
				P.LayerArray.JP[jp.id] = marker;
				M.toggleLayerArray(P.LayerArray.JP, true);
				
				/*
				 * Create JP HTML entries.
				 */
				var translatedname = D.getObjectName(jp);
				$("#jpzList_" + jp.difficulty).append(
					"<dt id='jpz_" + jp.id + "' data-coord='" + jp.coord + "'>" + translatedname + "</dt>"
					+ "<label><input type='checkbox' id='jpzCheck_" + jp.id + "' /></label>"
					+ "&nbsp;<cite><a href='"
					+ U.getYouTubeLink(translatedname + " " + I.cGameNick) + "' target='_blank'>[Y]</a> <a href='"
					+ U.getWikiLanguageLink(translatedname) + "' target='_blank'>[W]</a></cite>"
					+ "<dd>" + jp.description + "</dd>"
				);
				var jplink = $("#jpz_" + jp.id);
				jplink.attr("title", "<div class='mapLoc'><img src='" + U.getImageHosted(jp.img) + "' /></div>");
				M.bindMapLinkBehavior(jplink, M.ZoomEnum.Same);
			}
			M.bindMapLinks(".jpzList");
			U.convertExternalLink(".jpzList a");
			I.qTip.init(".jpzList dt");
			
			// Create markers for chests
			var createChestMarker = function(pObject, pType)
			{
				var coord = pObject.c;
				var newtitle = null;
				if (pObject.t)
				{
					newtitle = pObject.t;
				}
				var marker = L.marker(M.convertGCtoLC(coord),
				{
					icon: L.divIcon(
					{
						className: "mapChest" + pType,
						html: "<img src='" + "img/map/chest.png" + "' />",
						iconSize: [32, 32],
						iconAnchor: [16, 16]
					}),
					title: newtitle
				});
				M.bindMappingZoomBehavior(marker, "click");
				P.Layer.Chest.addLayer(marker);
			};
			for (i in P.Chests)
			{
				for (ii in P.Chests[i])
				{
					createChestMarker((P.Chests[i])[ii], i);
				}
			}

			// Button to toggle JP markers only
			$("#jpzToggleJP").change(function()
			{
				var state = $(this).prop("checked");
				M.toggleLayerArray(P.LayerArray.JP, state);
				if (state)
				{
					for (var i in P.LayerArray.JP)
					{
						var marker = P.LayerArray.JP[i];
						var state = X.getChecklistItem(X.Checklists.JP, marker.options.id);
						if (state === X.ChecklistEnum.Unchecked)
						{
							styleJPMarker(marker, marker.options.difficulty);
						}
						else
						{
							// Difficulty 0 is reserved for checked off JPs
							styleJPMarker(marker, 0);
						}
					}
				}
			});
			// Button to toggle chest markers only
			$("#jpzToggleChest").change(function()
			{
				M.toggleLayer(P.Layer.Chest, $(this).prop("checked"));
			});
			// Button to toggle markers display
			$("#mapToggle_JP").data("checked", true).click(function()
			{
				var bool = I.toggleButtonState($(this));
				$("#jpzToggleJP").prop("checked", bool).trigger("change");
				// Chests are not shown by default
				if ($("#jpzToggleChest").prop("checked"))
				{
					$("#jpzToggleChest").prop("checked", bool).trigger("change");
				}
			});

			I.qTip.init(".leaflet-marker-icon");
			
			/*
			 * Initialize checklist and bind marker and checkboxes together.
			 */
			X.initializeChecklist(X.Checklists.JP, X.Checklists.JP.length);

			// Count completed JPs function
			var updateJPCount = function()
			{
				var completed = X.countChecklist(X.Checklists.JP, X.ChecklistEnum.Checked);
				var total = X.Checklists.JP.length;
				$("#jpzCounter").text(completed + "/" + total);
			};

			var i;
			for (i = 0; i < X.Checklists.JP.length; i++)
			{
				$("#jpzCheck_" + i).each(function()
				{
					/*
					 * Read and enact the state of the JP checklist.
					 */
					// Convert the digit at ith position in the checklist string to boolean
					var stateinstring = X.getChecklistItem(X.Checklists.JP, i, O.TypeEnum.isBoolean);
					$(this).prop("checked", stateinstring);
					if (stateinstring === false)
					{
						$(this).parent().prev().removeClass("jpzListNameChecked");
					}
					else
					{
						$(this).parent().prev().addClass("jpzListNameChecked");
						styleJPMarker(P.LayerArray.JP[i], 0);
					}

				}).change(function()
				{
					// Get the checkbox ID that associates itself with that JP
					var checkboxstate = X.getCheckboxEnumState($(this));
					var checkboxindex = U.getSubintegerFromHTMLID($(this));
					if (checkboxstate === X.ChecklistEnum.Unchecked)
					{
						$(this).parent().prev().removeClass("jpzListNameChecked");
						styleJPMarker(P.LayerArray.JP[checkboxindex], P.LayerArray.JP[checkboxindex].options.difficulty);
					}
					else
					{
						$(this).parent().prev().addClass("jpzListNameChecked");
						styleJPMarker(P.LayerArray.JP[checkboxindex], 0);
					}

					// Rewrite the checklist string by updating the digit at the ID/index
					X.setChecklistItem(X.Checklists.JP, checkboxindex, checkboxstate);
					updateJPCount();

				}).parent().hover(
					// Highlight JP name when hovered over checkbox's label
					function()
					{
						$(this).prev().css({"text-decoration": "underline"}).trigger("mouseenter");
					},
					function()
					{
						$(this).prev().css({"text-decoration": "none"}).trigger("mouseleave");
					}
				);

				/*
				 * Duplicate the behavior of JP checklist and zoom by mirroring the
				 * action of clicking on the JP icon with the associated HTML element.
				 */
				(function(pIndex)
				{
					// Click associated checkbox when clicked
					P.LayerArray.JP[pIndex].on("click", function()
					{
						$("#jpzCheck_" + pIndex).trigger("click");
						I.scrollToElement($("#jpz_" + this.options.id), $("#plateMap"));
					});
					// Zoom in when double clicked
					P.LayerArray.JP[pIndex].on("dblclick", function()
					{
						if (M.Map.getZoom() === M.ZoomEnum.Max)
						{
							M.Map.setZoom(M.ZoomEnum.Default);
						}
						else
						{
							M.goToLatLng(this.getLatLng());
						}
					});
				})(i);
			}

			// The button to clear all JP checkboxes
			$("#jpzUncheck").click(function()
			{
				var jpchecklist = "";
				for (i = 0; i < X.Checklists.JP.length; i++)
				{
					$("#jpzCheck_" + i).prop("checked", false)
						.parent().prev().removeClass("jpzListNameChecked");
					styleJPMarker(P.LayerArray.JP[i], P.LayerArray.JP[i].options.difficulty);

					jpchecklist += "0";
				}
				X.Checklists.JP.value = jpchecklist;
				localStorage[X.Checklists.JP.key] = X.Checklists.JP.value;

				updateJPCount();
			});

			updateJPCount();
		});
	},
	
	/*
	 * Create list of collectibles and checkbox to toggle their display. The
	 * first checkbox click generates the icon.
	 */
	generateCollectiblesUI: function()
	{
		$.getScript(U.URL_DATA.Collectible).done(function()
		{
			P.Collectibles = GW2T_COLLECTIBLE_DATA;
			var i;
			var collectible;
			var translatedname;

			for (i in P.Collectibles)
			{
				// Create checkboxes
				collectible = P.Collectibles[i];
				translatedname = D.getObjectName(collectible);
				$("#cltList").append(
					"<div>"
					+ "<label style='color:" + collectible.color + "'>"
						+ "<ins class='clt_" + i.toLowerCase() + "'></ins><input id='ned_" + i + "' type='checkbox' /> " + translatedname
					+ "</label>"
					+ "<span><cite>"
						+ "<a href='" + U.getYouTubeLink(translatedname + " " + I.cGameNick) + "'>[Y]</a>&nbsp;"
						+ "<a href='" + collectible.wiki + "'>[W]</a>&nbsp;"
						+ "<a href='" + collectible.credit + "'>[C]</a>&nbsp;"
						+ "&nbsp;-&nbsp;&nbsp;</cite>"
						+ "<a id='nedUncheck_" + i + "'>Reset</a>"
					+ "</span></div>");

				// Clicking a checkbox generates the markers for that collectible type
				$("#ned_" + i).one("click", function()
				{
					var type = U.getSubstringFromHTMLID($(this));
					G.generateCollectibles(type);
					M.goToArguments(P.Collectibles[type].view);
				});
				
				// If article URL query string exists, show collectible of specified index
				if (I.ArticleCurrent)
				{
					if (I.ArticleCurrent.toLowerCase() === X.Collectibles[i].urlkey)
					{
						// Trigger the associated checkbox so the markers are generated
						$("#ned_" + i).trigger("click");
						I.ArticleCurrent = null;
					}
				}
			}
			U.convertExternalLink("#cltList cite a");

			// Toggle button will only hide icons, by unchecking the checked boxes
			$("#mapToggle_Collectible").data("checked", false).data("hideonly", true).click(function()
			{
				for (i in P.Collectibles)
				{
					if ($("#ned_" + i).prop("checked"))
					{
						$("#ned_" + i).trigger("click");
					}
				}
			});
		});
	},
	
	/*
	 * Generates the markers for a collectible type.
	 * @param string pType of the collectible.
	 */
	generateCollectibles: function(pType)
	{
		var i, number;
		var customlist = U.Args[X.Collectibles[pType].urlkey];
		var collectible = P.Collectibles[pType];
		var ithneedle;
		var stateinstring;
		var marker;
		var markertitle;
		var translatedname = D.getObjectName(collectible);
		var pathcoords = new Array();
		
		var styleCollectibleMarker = function(pMarker, pState)
		{
			pMarker.setIcon(new L.divIcon(
			{
				className: "mapNeedle" + pState,
				html: "<span style='color:" + pMarker.options.needleColor + "'>"
					+ pMarker.options.needleLabel + "</span>",
				iconSize: [16, 16],
				iconAnchor: [8, 8]
			}));
		};
		
		// Initialize checklist
		X.Collectibles[pType].length = P.Collectibles[pType].needles.length;
		X.initializeChecklist(X.Collectibles[pType], X.Collectibles[pType].length, customlist);
		
		P.LayerArray[pType] = new Array(); // Holds markers (needles)
		P.Layer[pType] = new L.layerGroup(); // Holds path connecting the markers
		
		for (i in collectible.needles)
		{
			// Read and enact the state of the ith collectible checklist
			number = parseInt(i) + 1;
			ithneedle = collectible.needles[i];
			stateinstring = X.getChecklistItem(X.Collectibles[pType], i);

			markertitle = "<div class='mapLoc'><dfn>" + translatedname + ":</dfn> #" + number;
			if (ithneedle.i)
			{
				markertitle += "<img src='" + ithneedle.i + "' />";
			}
			else if (ithneedle.t)
			{
				markertitle += "<br /><span class='mapTip'>" + ithneedle.t + "</span>";
			}
			markertitle += "</div>";

			marker = L.marker(M.convertGCtoLC(ithneedle.c),
			{
				needleIndex: i,
				needleType: pType,
				needleKey: X.Collectibles[pType].urlkey,
				needleColor: collectible.color,
				needleLabel: (ithneedle.l === undefined) ? number : ithneedle.l,
				title: markertitle
			});
			styleCollectibleMarker(marker, stateinstring);
			
			// Bind marker behavior
			marker.on("click", function(pEvent)
			{
				var newstate = X.trackChecklistItem(X.Collectibles[this.options.needleType], this.options.needleIndex);
				styleCollectibleMarker(this, newstate);
				
				// Update URL bar with list of numbers of checked markers
				var pings = X.getCheckedIndexes(X.Collectibles[this.options.needleType]);
				if (pings.length === 0)
				{
					U.updateQueryString();
				}
				else
				{
					U.updateAddressBar("?" + this.options.needleKey + "=" + pings);
				}
			});
			
			// Add to array
			P.LayerArray[pType].push(marker);
			
			// Compile coordinates for path lines
			pathcoords.push(ithneedle.c);
		}
		
		// Draw paths from markers numbered low to high
		var pathline = L.polyline(M.convertGCtoLCMulti(pathcoords),
		{
			color: "white",
			opacity: 0.2
		});
		P.Layer[pType].addLayer(pathline);
		M.toggleLayerArray(P.LayerArray[pType], true);
		M.toggleLayer(P.Layer[pType], true);
		
		// Bind checkboxes after the markers and paths have been generated for this collectible
		$("#ned_" + pType).change(function()
		{
			var state = $(this).prop("checked");
			var type = U.getSubstringFromHTMLID($(this));
			M.toggleLayerArray(P.LayerArray[type], state);
			M.toggleLayer(P.Layer[type], state);
			// Also views the map location of the collectible if box is checked
			if (state)
			{
				M.goToArguments(P.Collectibles[type].view);
				// Rebind tooltip
				I.qTip.init(".leaflet-marker-icon");
			}
		});
		$("#nedUncheck_" + pType).click(function()
		{
			var type = U.getSubstringFromHTMLID($(this));
			var markers = P.LayerArray[type];
			for (var i in markers)
			{
				styleCollectibleMarker(markers[i], X.ChecklistEnum.Unfound);
			}
			X.clearChecklist(X.Collectibles[type]);
			U.updateQueryString();
		});
	},
	
	/*
	 * Create list of guild mission types, and mission checkboxes for each type.
	 * First checkbox click generates the mission's data into the map.
	 */
	generateGuildUI: function()
	{
		hideGuildMapDrawings = function(pBook)
		{
			M.toggleLayerArray(P.LayerArray["Guild_" + pBook], false);
			$("#gldBook_" + pBook + " dfn").each(function()
			{
				I.toggleHighlight($(this), false);
			});
			if (P.Guild[pBook].usedSubmaps !== undefined)
			{
				M.toggleSubmapArray(P.Guild[pBook].usedSubmaps, false);
			}
		},
				
		finalizeGuildBook = function(pBook)
		{
			U.convertExternalLink("#gldBook_" + pBook + " a");
			I.qTip.init("#gldBook_" + pBook + " dfn");
			// Initialize clipboard for each waypoint
			$("#gldBook_" + pBook + " .cssWaypoint").each(function()
			{
				(new ZeroClipboard($(this)[0])).on("aftercopy", function(pEvent)
				{
					I.write(K.cZeroClipboardSuccessText + pEvent.data["text/plain"], 5);
				});
			});
		},
		
		$.getScript(U.URL_DATA.Guild).done(function()
		{
			P.Guild = GW2T_GUILD_DATA;
			var i;
			// Create buttons for each mission type, which generates content when first clicked
			for (i in P.Guild)
			{
				var missiontype = P.Guild[i];
				var translatedname = D.getObjectName(missiontype);
				$("#gldButtons").append("<div>"
					+ "<button class='gldButton curToggle' id='gldButton_" + i + "' "
					+ "title='<dfn>" + translatedname + "</dfn><br />gw2timer.com/guild/" + i.toLowerCase() + "'>"
					+ "<img src='img/guild/" + i.toLowerCase() + I.cPNG + "' /></button>"
					+ "<a class='cssButton' href='" + U.getYouTubeLink(translatedname + " " + I.cGameNick) + "' target='_blank'>Y</a>&nbsp;"
					+ "<a class='cssButton' href='" + D.getObjectURL(missiontype) + "' target='_blank'>W</a>"
					+ "</div>");
				$("#gldBooks").append("<div class='gldBook' id='gldBook_" + i + "'></div>");
			}
			$(".gldBook").hide();
			I.qTip.init("#gldButtons button");
			U.convertExternalLink("#gldButtons a");
			
			// Bind button to show the guild mission type
			$(".gldButton").click(function()
			{
				var missiontype = U.getSubstringFromHTMLID($(this));
				var wantshow = true;
				// If current mission type is already showing
				if ($("#gldBook_" + missiontype).is(":visible"))
				{
					hideGuildMapDrawings(missiontype);
					wantshow = false;
				}
				$(".gldBook").hide();
				if (wantshow)
				{
					$("#gldBook_" + missiontype).show();
				}
				I.updateScrollbar();
			});
			
			// Bind button to hide all guild map drawings
			$("#mapToggle_Guild").data("hideonly", true).click(function()
			{
				$(".gldButton").each(function()
				{
					hideGuildMapDrawings(U.getSubstringFromHTMLID($(this)));
					$(".gldBook").hide();
					I.updateScrollbar();
				});
				M.movePin(M.Pin.Program);
			});
			
			/*
			 * Bounty generation.
			 */
			$("#gldButton_Bounty").one("click", function()
			{
				D.sortObjects(P.Guild.Bounty.data);
				for (var i in P.Guild.Bounty.data)
				{
					var mission = P.Guild.Bounty.data[i];
					var name = D.getObjectDefaultName(mission);
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Bounty").append(
						"<div><img class='cssWaypoint' " + K.cZeroClipboardDataAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Bounty) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldBounty_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + "</dfn> "
						+ "<a href='" + U.getYouTubeLink(name + " " + I.cGameNick) + "' target='_blank'>[Y]</a> "
						+ "<a href='" + U.getWikiLink(name) + "' target='_blank'>[W]</a>"
						+ "</div>"
					);
					
					var layergroup = new L.layerGroup();
					if (mission.paths !== undefined)
					{
						for (var ii in mission.paths)
						{
							layergroup.addLayer(P.drawDirectedPath(mission.paths[ii]));
						}
					}
					if (mission.spawn !== undefined)
					{
						layergroup.addLayer(P.drawSpots(mission.spawn));
					}
					P.LayerArray.Guild_Bounty.push(layergroup);
					
					// Bind this mission's behavior
					var elm = $("#gldBounty_" + i);
					elm.attr("title", "<div class='mapLoc'><img src='" + mission.img + "' /></div>")
						.click(function()
					{
						I.toggleHighlight($(this));
						M.toggleLayer(P.LayerArray.Guild_Bounty[U.getSubintegerFromHTMLID($(this))]);
					});
					M.bindMapLinkBehavior(elm, M.invertZoomLevel(mission.coord[2]));
				}
				finalizeGuildBook("Bounty");
			});
			
			/*
			 * Trek generation.
			 */
			$("#gldButton_Trek").one("click", function()
			{
				D.sortObjects(P.Guild.Trek.data);
				for (var i in P.Guild.Trek.data)
				{
					var mission = P.Guild.Trek.data[i];
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Trek").append(
						"<div><img class='cssWaypoint' " + K.cZeroClipboardDataAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Trek) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldTrek_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + "</dfn>"
						+ "</div>"
					);
					
					var layergroup = new L.layerGroup();
					layergroup.addLayer(L.polyline(M.convertGCtoLCMulti(mission.path), {color: "gold"}));
					P.LayerArray.Guild_Trek.push(layergroup);
					
					// Bind this mission's behavior
					var elm = $("#gldTrek_" + i);
					elm.attr("title", "<div class='mapLoc'><img src='" + mission.img + "' /></div>")
						.click(function()
					{
						I.toggleHighlight($(this));
						M.toggleLayer(P.LayerArray.Guild_Trek[U.getSubintegerFromHTMLID($(this))]);
					});
					M.bindMapLinkBehavior(elm, M.ZoomEnum.Same, M.Pin.Program);
				}
				finalizeGuildBook("Trek");
			});
			
			/*
			 * Challenge generation.
			 */
			$("#gldButton_Challenge").one("click", function()
			{
				P.Guild.Challenge.usedSubmaps = new Array();
				D.sortObjects(P.Guild.Challenge.data);
				for (var i in P.Guild.Challenge.data)
				{
					var mission = P.Guild.Challenge.data[i];
					var name = D.getObjectDefaultName(mission);
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Challenge").append(
						"<div><img class='cssWaypoint' " + K.cZeroClipboardDataAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Challenge) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldChallenge_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + " - " + mission.limit + "</dfn> "
						+ "<a href='" + U.getYouTubeLink(name + " " + I.cGameNick) + "' target='_blank'>[Y]</a> "
						+ "<a href='" + U.getWikiLink(name) + "' target='_blank'>[W]</a>"
						+ "</div>"
					);
			
					// Submap image of interior map
					if (mission.submap !== undefined)
					{
						M.toggleSubmap(mission.submap, false);
						P.Guild.Challenge.usedSubmaps.push(mission.submap);
					}
					
					var layergroup = new L.layerGroup();
					layergroup.addLayer(L.polyline(M.convertGCtoLCMulti(mission.path), {color: "gold"}));
					layergroup.addLayer(P.drawSpots(mission.spawn, {color: "gold"}));
					P.LayerArray.Guild_Challenge.push(layergroup);
					
					// Bind this mission's behavior
					var elm = $("#gldChallenge_" + i);
					elm.click(function()
					{
						var index = U.getSubintegerFromHTMLID($(this));
						var submap = P.Guild.Challenge.data[index].submap;
						var state = I.toggleHighlight($(this));
						if (submap !== undefined)
						{
							M.toggleSubmap(submap, state);
						}
						M.toggleLayer(P.LayerArray.Guild_Challenge[index]);
					});
					M.bindMapLinkBehavior(elm, M.ZoomEnum.Ground, M.Pin.Program);
				}
				finalizeGuildBook("Challenge");
			});
			
			/*
			 * Rush generation.
			 */
			$("#gldButton_Rush").one("click", function()
			{
				P.Guild.Rush.usedSubmaps = new Array();
				D.sortObjects(P.Guild.Rush.data);
				for (var i in P.Guild.Rush.data)
				{
					var mission = P.Guild.Rush.data[i];
					var name = D.getObjectDefaultName(mission);
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Rush").append(
						"<div><img class='cssWaypoint' " + K.cZeroClipboardDataAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Rush) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldRush_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + "</dfn> "
						+ "<a href='" + U.getYouTubeLink(name + " " + I.cGameNick) + "' target='_blank'>[Y]</a> "
						+ "<a href='" + U.getWikiLink(name) + "' target='_blank'>[W]</a>"
						+ "</div>"
					);
					
					// Submap image of interior map
					if (mission.submap !== undefined)
					{
						M.toggleSubmap(mission.submap, false);
						P.Guild.Rush.usedSubmaps.push(mission.submap);
					}
					
					var layergroup = new L.layerGroup();
					// Path from waypoint to start
					layergroup.addLayer(L.polyline(M.convertGCtoLCMulti(mission.path), {color: "gold"}));
					// Path from start to finish
					layergroup.addLayer(L.polyline(M.convertGCtoLCMulti(mission.track), {color: "lime", dashArray: "5,10"}));
					// Markers for finish chest
					layergroup.addLayer(L.marker(M.convertGCtoLC(mission.finish), {icon: M.createStandardIcon("img/map/chest.png")}));
					// Circles for small traps
					if (mission.traps0 !== undefined)
					{
						layergroup.addLayer(P.drawSpots(mission.traps0, {radius: 5, color: "red", weight: 1, opacity: 1}));
					}
					// Circles for big traps
					if (mission.traps1 !== undefined)
					{
						layergroup.addLayer(P.drawSpots(mission.traps1, {radius: 10, color: "red", weight: 1, opacity: 1}));
					}
					// Circles for flag checkpoints
					layergroup.addLayer(P.drawSpots(mission.flags, {radius: 2, color: "gold", weight: 2, opacity: 1}));
					
					P.LayerArray.Guild_Rush.push(layergroup);
					
					// Bind this mission's behavior
					var elm = $("#gldRush_" + i);
					elm.click(function()
					{
						var index = U.getSubintegerFromHTMLID($(this));
						var submap = P.Guild.Rush.data[index].submap;
						var state = I.toggleHighlight($(this));
						if (submap !== undefined)
						{
							M.toggleSubmap(submap, state);
						}
						M.toggleLayer(P.LayerArray.Guild_Rush[index]);
					});
					M.bindMapLinkBehavior(elm, M.ZoomEnum.Ground, M.Pin.Program);
				}
				finalizeGuildBook("Rush");
			});
			
			/*
			 * Puzzle generation.
			 */
			$("#gldButton_Puzzle").one("click", function()
			{
				P.Guild.Puzzle.usedSubmaps = new Array();
				D.sortObjects(P.Guild.Puzzle.data);
				for (var i in P.Guild.Puzzle.data)
				{
					var mission = P.Guild.Puzzle.data[i];
					var name = D.getObjectDefaultName(mission);
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Puzzle").append(
						"<div><img class='cssWaypoint' " + K.cZeroClipboardDataAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Puzzle) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldPuzzle_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + " - " + mission.limit + "</dfn> "
						+ "<a href='" + U.getYouTubeLink(name + " " + I.cGameNick) + "' target='_blank'>[Y]</a> "
						+ "<a href='" + U.getWikiLink(name) + "' target='_blank'>[W]</a>"
						+ "</div>"
					);
					
					// Submap image of interior map
					if (mission.submap !== undefined)
					{
						M.toggleSubmap(mission.submap, false);
						P.Guild.Puzzle.usedSubmaps.push(mission.submap);
					}
					
					var layergroup = new L.layerGroup();
					// Circles for interactive objects
					layergroup.addLayer(P.drawSpots(mission.interactions, {color: "gold"}));
					// Markers for finish chest
					layergroup.addLayer(L.marker(M.convertGCtoLC(mission.finish), {icon: M.createStandardIcon("img/map/chest.png")}));
					
					P.LayerArray.Guild_Puzzle.push(layergroup);
					
					// Bind this mission's behavior
					var elm = $("#gldPuzzle_" + i);
					elm.click(function()
					{
						var index = U.getSubintegerFromHTMLID($(this));
						var submap = P.Guild.Puzzle.data[index].submap;
						var state = I.toggleHighlight($(this));
						if (submap !== undefined)
						{
							M.toggleSubmap(submap, state);
						}
						M.toggleLayer(P.LayerArray.Guild_Puzzle[index]);
					});
					M.bindMapLinkBehavior(elm, M.ZoomEnum.Ground, M.Pin.Program);
				}
				finalizeGuildBook("Puzzle");
			});
			
			/*
			 * Initialize influence-coin exchange.
			 */
			$("#gldInfluence input").click(function()
			{
				$(this).select();
			});
			$("#gldInfluenceToCoinInput").on("input", function()
			{
				$("#gldInfluenceToCoinOutput").val(E.createCoinString($(this).val() * E.Exchange.COPPER_PER_INFLUENCE));
			});
			$("#gldCoinToInfluenceInput").on("input", function()
			{
				$("#gldCoinToInfluenceOutput").val(E.parseCoinString($(this).val()) * E.Exchange.INFLUENCE_PER_COPPER);
			});
			
			/*
			 * Open the guild mission type if article query string is present.
			 */
			if (I.ArticleCurrent)
			{
				for (i in P.Guild)
				{
					if (I.ArticleCurrent.toLowerCase() === i.toLowerCase())
					{
						// Trigger the associated guild mission type button
						$("#gldButton_" + i).trigger("click");
						I.ArticleCurrent = null;
						break;
					}
				}
			}
		});
	}
};

/* =============================================================================
 * @@World vs World Mists map and objectives, an extension of the M object
 * ========================================================================== */
W = {
	
	MapEnum: "wvw",
	cInitialZone: "eternal",
	cMAP_BOUND: 16384,
	cMAP_CENTER: [10400, 12400], // This centers at the WvW portion of the map
	cMAP_CENTER_INITIAL: [-193.75, 162.5],
	cMAP_CENTER_ACTUAL: [8192, 8192],
	ZoomEnum:
	{
		Same: -1,
		Min: 0,
		Default: 3,
		Space: 3,
		Sky: 4,
		Bird: 5,
		Ground: 6,
		Max: 6
	},
	ServerRegionThreshold:
	{
		Range: 99,
		Americas: 1000,
		Europe: 2000,
		France: 2100,
		Germany: 2200,
		Spain: 2300
	},
	Layer: {
		PersonalPin: new L.layerGroup(),
		PersonalPath: new L.layerGroup(),
		ZoneRectangle: new L.layerGroup(),
		Pin: new L.layerGroup()
	},
	LayerArray: {
		
	},
	Pin: {
		Program: {},
		Event: {},
		Over: {},
		Character: {},
		Camera: {}
	},
	
	initializeWvW: function()
	{
		/*
		 * Merge W's unique variables and functions with M, and use that new
		 * object as W. This is a shallow copy, so objects within an object that
		 * are not shared/modified must be redeclared here in W.
		 */
		$.extend(W, $.extend({}, M, W));
		W.Zones = GW2T_LAND_DATA;
		W.ZoneAssociation = GW2T_LAND_ASSOCIATION;
		W.Regions = GW2T_REALM_DATA;
		
		W.initializeMap();
	},
};

/* =============================================================================
 * @@Time utilities and schedule, Dashboard functions
 * ========================================================================== */
T = {
	
	DashboardAnnouncement: GW2T_DASHBOARD_DATA.Announcement,
	DashboardCountdown: GW2T_DASHBOARD_DATA.Countdowns,
	DashboardStory: GW2T_DASHBOARD_DATA.Story,
	DashboardSale: GW2T_DASHBOARD_DATA.Sale,
	isDashboardEnabled: true,
	isDashboardAnnouncementEnabled: false,
	isDashboardCountdownEnabled: false,
	isDashboardCountdownTickEnabled: false,
	isDashboardStoryEnabled: false,
	isDashboardSaleEnabled: false,
	
	DailyCalendar: GW2T_DAILY_CALENDAR,
	DST_IN_EFFECT: 0, // Will become 1 and added to the server offset if DST is on
	SECONDS_TILL_RESET: 0,
	TIMESTAMP_UNIX_SECONDS: 0,
	cUTC_OFFSET_USER: 0,
	cUTC_OFFSET_SERVER: -8, // Server is Pacific Time, 8 hours behind UTC
	cUTC_OFFSET_HAWAII: -10,
	cUTC_OFFSET_EASTERN: -4,
	// Natural constants
	cMILLISECONDS_IN_SECOND: 1000,
	cMILLISECONDS_IN_MINUTE: 60000,
	cSECONDS_IN_MINUTE: 60,
	cSECONDS_IN_HOUR: 3600,
	cSECONDS_IN_DAY: 86400,
	cSECONDS_IN_WEEK: 604800,
	cMINUTES_IN_HOUR: 60,
	cMINUTES_IN_DAY: 1440,
	cHOURS_IN_MERIDIEM: 12,
	cHOURS_IN_DAY: 24,
	cDAYS_IN_WEEK: 7,
	cSECONDS_IN_TIMEFRAME: 900,
	cMINUTES_IN_TIMEFRAME: 15,
	cMINUTES_IN_DRYTOPFRAME: 5,
	cNUM_TIMEFRAMES_IN_HOUR: 4,
	cSECS_MARK_0: 0,
	cSECS_MARK_1: 900,
	cSECS_MARK_2: 1800,
	cSECS_MARK_3: 2700,
	cSECS_MARK_4: 3599,
	cBASE_10: 10,
	cPERCENT_100: 100,
	// Game constants
	DAILY_START_UNIX: 1418774400, // 2014-12-17:0000 UTC or 2014-12-16:1600 PST
	DAYS_SINCE_DAILY_START: 0,
	cDAYTIME_DAY_MINUTES: 80,
	cDAYTIME_NIGHT_MINUTES: 40,
	cDAYTIME_DAY_START: 25,
	cDAYTIME_NIGHT_START: 45,
	ReferenceEnum:
	{
		UTC: 0,
		Local: 1,
		Server: 2
	},
	UnitEnum:
	{
		Milliseconds: 0,
		Seconds: 1,
		Minutes: 2,
		Hours: 3
	},
	DayEnum:
	{
		Sunday: 0,
		Monday: 1,
		Tuesday: 2,
		Wednesday: 3,
		Thursday: 4,
		Friday: 5,
		Saturday: 6
	},
	loginTrackOfficial: 0,
	secondsTillResetWeekly: -1,
	isCountdownToResetStarted: false,
	
	DryTopSets: {},
	DryTopCodes: {},
	Schedule: {},
	
	/*
	 * Gets a clipboard text of the current Dry Top events.
	 * @param int pOffset frames from the current.
	 * @returns string of events for that event frame.
	 */
	getCurrentDryTopEvents: function(pOffset)
	{
		return T.DryTopCodes[T.getDryTopMinute(pOffset)].chat + I.siteTagCurrent;
	},
	getCurrentDryTopColor: function(pOffset)
	{
		return T.DryTopCodes[T.getDryTopMinute(pOffset)].color;
	},
	
	/*
	 * Gets the minute in the current event frame.
	 * @param int pOffset from current.
	 * @returns string minute.
	 */
	getDryTopMinute: function(pOffset)
	{
		pOffset = pOffset || 0;
		var now = new Date();
		var min = now.getUTCMinutes();
		var minute = (~~(min / T.cMINUTES_IN_DRYTOPFRAME) * T.cMINUTES_IN_DRYTOPFRAME) + (pOffset * T.cMINUTES_IN_DRYTOPFRAME);
		minute = T.wrapInteger(minute, T.cMINUTES_IN_HOUR);
		if (minute < T.cBASE_10)
		{
			minute = "0" + minute;
		}
		return minute;
	},
	
	/*
	 * Initializes Dry Top event sets to be used in clipboard text.
	 */
	initializeDryTopStrings: function()
	{
		getDryTopSet = function(pSet)
		{
			var events = T.DryTopSets[pSet];
			var str = "";
			for (var i in events)
			{
				str += D.getObjectName(events[i]) + "@" + events[i].wp + " ";
			}
			return str.trim();
		};

		T.DryTopSets = [
			[
				C.DryTop.Victims, C.DryTop.Crystals, C.DryTop.Supplies, C.DryTop.Rustbucket,
				C.DryTop.Shaman, C.DryTop.TendrilW, C.DryTop.TendrilSE, C.DryTop.Tootsie
			],[
				C.DryTop.MineE, C.DryTop.Serene, C.DryTop.Insects, C.DryTop.Bridge,
				C.DryTop.Experiment, C.DryTop.Golem, C.DryTop.Nochtli, C.DryTop.Colocal
			],[
				C.DryTop.MineNE, C.DryTop.Basket, C.DryTop.Suit, C.DryTop.Leyline, C.DryTop.Town
			],[
				C.DryTop.Mites, C.DryTop.Haze, C.DryTop.Eway, C.DryTop.Skritts0, C.DryTop.Skritts1,
				C.DryTop.Skritts2, C.DryTop.Skritts3, C.DryTop.Explosives, C.DryTop.Giant
			],[
				C.DryTop.Devourer
			],[
				C.DryTop.Mites, C.DryTop.Haze, C.DryTop.Twister, C.DryTop.Chriikkt, C.DryTop.Eway,
				C.DryTop.Skritts0, C.DryTop.Skritts1, C.DryTop.Skritts2, C.DryTop.Skritts3, C.DryTop.Chickenado
			],[
				C.DryTop.Beetle, C.DryTop.Monster
			]
		];
		
		T.DryTopCodes =
		{
			"00": {chat: ":00 " + getDryTopSet(0), color: "red"},
			"05": {chat: ":05 " + getDryTopSet(1), color: "orange"},
			"10": {chat: ":10 " + getDryTopSet(2), color: "yellow"},
			"15": {chat: ":15 " + getDryTopSet(0), color: "red"},
			"20": {chat: ":20 " + getDryTopSet(1), color: "orange"},
			"25": {chat: ":25 " + getDryTopSet(2), color: "yellow"},
			"30": {chat: ":30 " + getDryTopSet(0), color: "red"},
			"35": {chat: ":35 " + getDryTopSet(1), color: "orange"},
			"40": {chat: ":40 " + getDryTopSet(3), color: "lime"},
			"45": {chat: ":45 " + getDryTopSet(4), color: "limegreen"},
			"50": {chat: ":50 " + getDryTopSet(5), color: "dodgerblue"},
			"55": {chat: ":55 " + getDryTopSet(6), color: "orchid"}
		};
		
		K.updateDryTopClipboard();
		$("#itemDryTopClip").show();
	},
	
	ChainAssociation: {
		"fe": 0,
		"golem": 1,
		"jormag": 2,
		"maw": 3,
		"megades": 4,
		"sb": 5,
		"shatterer": 6,
		"taidha": 7,
		"ulgoth": 8,
		"wurm": 9,
		"queen": 10,
		"tequatl": 11,
		"triple": 12
	},
	
	/*
	 * Inserts a chain into the schedule.
	 * @param object pChain.
	 * @param array pTimeArray of strings of HH:MM format.
	 */
	insertChainToSchedule: function(pChain, pTimeArray)
	{
		for (var i in pTimeArray)
		{
			var time = T.parseChainTime(pTimeArray[i]);
			T.Schedule[time].c.unshift(pChain);
		}
	},
	
	// World boss chains
	initializeSchedule: function()
	{
		// Shortcut reference to the chains
		C.FE =			C.Chains[0];
		C.Golem =		C.Chains[1];
		C.Jormag =		C.Chains[2];
		C.Maw =			C.Chains[3];
		C.Megades =		C.Chains[4];
		C.SB =			C.Chains[5];
		C.Shatterer =	C.Chains[6];
		C.Taidha =		C.Chains[7];
		C.Ulgoth =		C.Chains[8];
		C.Wurm =		C.Chains[9];
		C.Queen =		C.Chains[10];
		C.Tequatl =		C.Chains[11];
		C.Triple =		C.Chains[12];
		C.DryTop0 =		C.Chains[13];
		C.DryTop1 =		C.Chains[14];
		C.DryTop2 =		C.Chains[15];
		C.DryTop3 =		C.Chains[16];
		
		/*
		 * This associative array contains all time-sensitive chains (a group of
		 * events). The "key"/slot is the time in minutes since UTC midnight,
		 * and the "value" is an object with the minutes (again for access) and
		 * the array of chains that start at that time.
		 * A "timeframe" is the quarter of an hour that a regular chain(s) is
		 * considered current and before it is replaced by the next chain(s).
		 */
		T.Schedule =
		{
			   "0": {t: "00:00", c: [C.Taidha, C.Tequatl]},
			  "15": {t: "00:15", c: [C.Maw]},
			  "30": {t: "00:30", c: [C.Megades]},
			  "45": {t: "00:45", c: [C.FE]},

			  "60": {t: "01:00", c: [C.Shatterer, C.Triple]},
			  "75": {t: "01:15", c: [C.Wurm]},
			  "90": {t: "01:30", c: [C.Ulgoth]},
			 "105": {t: "01:45", c: [C.SB]},

			 "120": {t: "02:00", c: [C.Golem, C.Queen]},
			 "135": {t: "02:15", c: [C.Maw]},
			 "150": {t: "02:30", c: [C.Jormag]},
			 "165": {t: "02:45", c: [C.FE]},

			 "180": {t: "03:00", c: [C.Taidha, C.Tequatl]},
			 "195": {t: "03:15", c: [C.Wurm]},
			 "210": {t: "03:30", c: [C.Megades]},
			 "225": {t: "03:45", c: [C.SB]},

			 "240": {t: "04:00", c: [C.Shatterer, C.Triple]},
			 "255": {t: "04:15", c: [C.Maw]},
			 "270": {t: "04:30", c: [C.Ulgoth]},
			 "285": {t: "04:45", c: [C.FE]},

			 "300": {t: "05:00", c: [C.Golem]},
			 "315": {t: "05:15", c: [C.Wurm]},
			 "330": {t: "05:30", c: [C.Jormag]},
			 "345": {t: "05:45", c: [C.SB]},

			 "360": {t: "06:00", c: [C.Taidha, C.Queen]},
			 "375": {t: "06:15", c: [C.Maw]},
			 "390": {t: "06:30", c: [C.Megades]},
			 "405": {t: "06:45", c: [C.FE]},

			 "420": {t: "07:00", c: [C.Shatterer, C.Tequatl]},
			 "435": {t: "07:15", c: [C.Wurm]},
			 "450": {t: "07:30", c: [C.Ulgoth]},
			 "465": {t: "07:45", c: [C.SB]},

			 "480": {t: "08:00", c: [C.Golem, C.Triple]},
			 "495": {t: "08:15", c: [C.Maw]},
			 "510": {t: "08:30", c: [C.Jormag]},
			 "525": {t: "08:45", c: [C.FE]},

			 "540": {t: "09:00", c: [C.Taidha]},
			 "555": {t: "09:15", c: [C.Wurm]},
			 "570": {t: "09:30", c: [C.Megades]},
			 "585": {t: "09:45", c: [C.SB]},

			 "600": {t: "10:00", c: [C.Shatterer]},
			 "615": {t: "10:15", c: [C.Maw]},
			 "630": {t: "10:30", c: [C.Ulgoth, C.Queen]},
			 "645": {t: "10:45", c: [C.FE]},

			 "660": {t: "11:00", c: [C.Golem]},
			 "675": {t: "11:15", c: [C.Wurm]},
			 "690": {t: "11:30", c: [C.Jormag, C.Tequatl]},
			 "705": {t: "11:45", c: [C.SB]},

			 "720": {t: "12:00", c: [C.Taidha]},
			 "735": {t: "12:15", c: [C.Maw]},
			 "750": {t: "12:30", c: [C.Megades, C.Triple]},
			 "765": {t: "12:45", c: [C.FE]},

			 "780": {t: "13:00", c: [C.Shatterer]},
			 "795": {t: "13:15", c: [C.Wurm]},
			 "810": {t: "13:30", c: [C.Ulgoth]},
			 "825": {t: "13:45", c: [C.SB]},

			 "840": {t: "14:00", c: [C.Golem]},
			 "855": {t: "14:15", c: [C.Maw]},
			 "870": {t: "14:30", c: [C.Jormag]},
			 "885": {t: "14:45", c: [C.FE]},

			 "900": {t: "15:00", c: [C.Taidha, C.Queen]},
			 "915": {t: "15:15", c: [C.Wurm]},
			 "930": {t: "15:30", c: [C.Megades]},
			 "945": {t: "15:45", c: [C.SB]},

			 "960": {t: "16:00", c: [C.Shatterer, C.Tequatl]},
			 "975": {t: "16:15", c: [C.Maw]},
			 "990": {t: "16:30", c: [C.Ulgoth]},
			"1005": {t: "16:45", c: [C.FE]},

			"1020": {t: "17:00", c: [C.Golem, C.Triple]},
			"1035": {t: "17:15", c: [C.Wurm]},
			"1050": {t: "17:30", c: [C.Jormag]},
			"1065": {t: "17:45", c: [C.SB]},

			"1080": {t: "18:00", c: [C.Taidha, C.Queen]},
			"1095": {t: "18:15", c: [C.Maw]},
			"1110": {t: "18:30", c: [C.Megades]},
			"1125": {t: "18:45", c: [C.FE]},

			"1140": {t: "19:00", c: [C.Shatterer, C.Tequatl]},
			"1155": {t: "19:15", c: [C.Wurm]},
			"1170": {t: "19:30", c: [C.Ulgoth]},
			"1185": {t: "19:45", c: [C.SB]},

			"1200": {t: "20:00", c: [C.Golem, C.Triple]},
			"1215": {t: "20:15", c: [C.Maw]},
			"1230": {t: "20:30", c: [C.Jormag]},
			"1245": {t: "20:45", c: [C.FE]},

			"1260": {t: "21:00", c: [C.Taidha]},
			"1275": {t: "21:15", c: [C.Wurm]},
			"1290": {t: "21:30", c: [C.Megades]},
			"1305": {t: "21:45", c: [C.SB]},

			"1320": {t: "22:00", c: [C.Shatterer]},
			"1335": {t: "22:15", c: [C.Maw]},
			"1350": {t: "22:30", c: [C.Ulgoth]},
			"1365": {t: "22:45", c: [C.FE]},

			"1380": {t: "23:00", c: [C.Golem, C.Queen]},
			"1395": {t: "23:15", c: [C.Wurm]},
			"1410": {t: "23:30", c: [C.Jormag]},
			"1425": {t: "23:45", c: [C.SB]}
		};
		
		var i, ii, iii;
		var quarter = 0;
		var slot;
		
		// Add Dry Top chains to the schedule
		for (i in T.Schedule)
		{
			T.Schedule[i].c.push(C["DryTop" + (quarter)]);
			quarter++;
			if (quarter > T.cNUM_TIMEFRAMES_IN_HOUR - 1)
			{
				quarter = 0;
			}
		}
		
		// Initialize Living Story events, if available
		if (T.DashboardStory.isEnabled)
		{
			if (T.isTimely(T.DashboardStory, new Date()))
			{
				T.isDashboardStoryEnabled = true;
			}
		}
		
		// Initialize chains
		C.ScheduledChains = new Array();
		C.initializeAllChains();
		
		for (i in T.Schedule)
		{
			// Convert all schedule time strings to minute integer
			T.Schedule[i].t = T.parseChainTime(T.Schedule[i].t);
			// Each chain gets an array of schedule keys of where it is in the schedule
			slot = T.Schedule[i];
			for (ii in C.ScheduledChains)
			{
				for (iii in slot.c)
				{
					if (C.ScheduledChains[ii].nexus === slot.c[iii].nexus)
					{
						C.ScheduledChains[ii].scheduleKeys.push(i);
						break;
					}
				}
			}
		}
		
		// Initialize for the touring function to access current active event
		C.CurrentChainSD = T.getStandardChain();
	},
	
	/*
	 * Gets the minutes for specified slot.
	 * @param int pKey of schedule slot.
	 * @returns int minutes.
	 */
	getScheduleSlotTime: function(pKey)
	{
		return T.Schedule[pKey].t;
	},
	
	/*
	 * Gets the chain array in schedule by specified key.
	 * @param string pKey of schedule slot.
	 * @returns array chains.
	 */
	getScheduleSlotChainsByKey: function(pKey)
	{
		return T.Schedule[pKey].c;
	},
	
	/*
	 * Gets the earliest minutes since UTC midnight that is divisible by the
	 * timeframe minutes.
	 * @returns int minutes.
	 */
	getCurrentTimeframe: function()
	{
		var minutes = T.getTimeSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Minutes);
		return minutes - (minutes % T.cMINUTES_IN_TIMEFRAME);
	},
	
	/*
	 * Gets the minutes since midnight UTC corresponding to a schedule slot
	 * divisible by the timeframe minutes.
	 * @param int pOffset number of timeframes from the current.
	 * @returns int minutes.
	 */
	getTimeframe: function(pOffset)
	{
		pOffset = pOffset || 0;
		var frameminute = T.getCurrentTimeframe() + (pOffset * T.cMINUTES_IN_TIMEFRAME);
		return T.wrapInteger(frameminute, T.cMINUTES_IN_DAY);
	},
	
	/*
	 * Gets an array of chains for specified timeframe.
	 * @param int pOffset number of timeframes from the current.
	 * @returns array chains, current active chains if offset is 0.
	 */
	getTimeframeChains: function(pOffset)
	{
		return T.Schedule[T.getTimeframe(pOffset)].c;
	},
	
	/*
	 * Gets a chain of particular series for specified timeframe.
	 * @param int pOffset number of timeframes from the current.
	 * @param string pSeries to filter the chains array.
	 */
	getTimeframeChainBySeries: function(pOffset, pSeries)
	{
		var i;
		var chains = T.getTimeframeChains(pOffset);
		
		for (i in chains)
		{
			if (chains[i].series === pSeries)
			{
				return chains[i];
			}
		}
		return null;
	},
	getStandardChain: function(pOffset)
	{
		return T.getTimeframeChainBySeries(pOffset, C.ChainSeriesEnum.Standard);
	},
	getHardcoreChain: function(pOffset)
	{
		/*
		 * Because there are gaps in the "hardcore schedule", the return needs
		 * to be checked before using since it can be null.
		 */
		return T.getTimeframeChainBySeries(pOffset, C.ChainSeriesEnum.Hardcore);
	},
	getLivingStoryChain: function(pOffset)
	{
		return T.getTimeframeChainBySeries(pOffset, C.ChainSeriesEnum.LivingStory);
	},
	
	/*
	 * Gets the key from current timeframe offset.
	 * @param int pOffset number of timeframes from the current.
	 * @returns string key for the schedule slot.
	 */
	getTimeframeKey: function(pOffset)
	{
		return (T.getTimeframe(pOffset)).toString();
	},
	
	/*
	 * Gets the local time in seconds for when a chain starts in the schedule.
	 * @param string pKey in the schedule.
	 * @returns int seconds since midnight local time.
	 */
	convertScheduleKeyToLocalSeconds: function(pKey)
	{
		var time = (T.getScheduleSlotTime(pKey) * T.cSECONDS_IN_MINUTE)
			- ((new Date()).getTimezoneOffset() * T.cSECONDS_IN_MINUTE);
		time = T.wrapInteger(time, T.cSECONDS_IN_DAY);

		return time;
	},
	convertScheduleKeyToUTCMinutes: function(pKey)
	{
		// Removes the time prefix from the key to get the minutes
		return parseInt(pKey);
	},
	
	/*
	 * Gets the time the current chain has been running.
	 * @returns int seconds or minutes elapsed since chain started.
	 */
	getCurrentTimeframeElapsedTime: function(pUnit)
	{
		var now = new Date();
		var min = now.getUTCMinutes();
		var sec = now.getUTCSeconds();
		
		if (pUnit === T.UnitEnum.Minutes)
		{
			return min % T.cMINUTES_IN_TIMEFRAME;
		}
		return ((min % T.cMINUTES_IN_TIMEFRAME) * T.cSECONDS_IN_MINUTE) + sec;
	},
	
	/*
	 * Gets the seconds until a chain start by subtracting the current time from
	 * the chain start time; both of which are seconds since midnight. Because
	 * the timer uses the 24 hour cyclical system, this function faces the
	 * design problem of deciding whether the chain start time is ahead or
	 * behind the local time when past midnight.
	 * @param object pChain to get start time.
	 * @returns int seconds remaining, negative if it started already.
	 * @pre Chain's scheduleKeys array was refreshed with the earliest start
	 * time at the first index.
	 */
	getSecondsUntilChainStarts: function(pChain)
	{
		var secondschain = (T.convertScheduleKeyToLocalSeconds(pChain.scheduleKeys[0]));
		var secondscurrent = T.getTimeSinceMidnight(T.ReferenceEnum.Local, T.UnitEnum.Seconds);
		var rolloverthreshold = (T.cSECONDS_IN_TIMEFRAME * T.cNUM_TIMEFRAMES_IN_HOUR); // This is 3600 seconds
		
		/*
		 * It is known that the program looks at most 4 chains ahead of the
		 * current to display the clock icons. Deal with the midnight problem by
		 * enforcing a one hour threshold before and after midnight, so for
		 * example the current time is 23:00:00 and the target chain starts at
		 * 00:15:00, it would return 01:15:00 (in seconds). Without the
		 * threshold, it would return -22:45:00.
		 */
		if (secondschain >= (T.cSECONDS_IN_DAY - rolloverthreshold)
			&& secondscurrent <= rolloverthreshold)
		{
			return (T.cSECONDS_IN_DAY - secondschain) + secondscurrent;
		}
		if (secondscurrent >= (T.cSECONDS_IN_DAY - rolloverthreshold)
			&& secondschain <= rolloverthreshold)
		{
			return (T.cSECONDS_IN_DAY - secondscurrent) + secondschain;
		}
		
		return secondschain - secondscurrent;
	},
	
	/*
	 * Gets a readable string of minutes and hours until a chain starts.
	 * @param object pChain to tell time.
	 * @param string pFormat of the time words.
	 * @returns string time string.
	 */
	getTimeTillChainFormatted: function(pChain, pFormat)
	{
		var secondsleft = T.getSecondsUntilChainStarts(pChain);
		var min = ~~(secondsleft / T.cSECONDS_IN_MINUTE) % T.cSECONDS_IN_MINUTE;
		var hour = ~~(secondsleft / T.cSECONDS_IN_HOUR);
		var minword = D.getTranslation("m");
		var hourword = D.getTranslation("h");
		
		if (pFormat === "speech")
		{
			minword = " " + D.getSpeech("minute");
			hourword = " " + D.getSpeech("hour");
			if (Math.abs(min) > 1)
			{
				minword = " " + D.getSpeech("minutes");
			}
			if (Math.abs(hour) > 1)
			{
				hourword = " " + D.getSpeech("hours");
			}
			if (hour === 0 && Math.abs(min) === 30)
			{
				min = D.getTranslation("half an hour");
				minword = "";
				hourword = "";
			}
		}
		hourword += " ";

		min = min + minword;
		if (Math.abs(secondsleft) >= T.cSECONDS_IN_HOUR)
		{
			hour = hour + hourword;
		}
		else
		{
			hour = "";
		}
		
		if (secondsleft < 0)
		{
			return " " + hour + min + " " + D.getTranslation("ago");
		}
		return " " + D.getTranslation("in") + " " + hour + min;
	},
	
	/*
	 * Gets a random integer between inclusive range.
	 * @param int pMin value.
	 * @param int pMax value.
	 * @returns int random.
	 */
	getRandomIntRange: function(pMin, pMax)
	{
		return Math.floor(Math.random() * (pMax - pMin + 1)) + pMin;
	},
	
	/*
	 * Adjusts an integer so that it is within 0 to the specified limit. Example:
	 * Integer 26 with Limit 24 returns 2. Integer -4 with Limit 24 returns 20.
	 * For use in circular arrays.
	 * @param int pInteger to readjust within limit.
	 * @param int pMax limit of the quantity.
	 * @returns int natural number rolled over.
	 */
	wrapInteger: function(pInteger, pMax)
	{
		var i = pInteger;
		// Rollover
		i = i % pMax;
		
		// Adjust for negative
		if (i < 0)
		{
			i = pMax + i;
		}
		
		return i;
	},
	
	/*
	 * Gets a stepped output of a linear equation.
	 * @param int pX
	 * @param int pMin
	 * @param int pMax
	 * @param int pDivisor
	 * @param int pMultiplier
	 * @returns int y, or pMin or pMax if out of these range.
	 */
	stepFunction: function(pX, pMin, pMax, pDivisor, pMultiplier)
	{
		var result = (~~(pX / pDivisor) * pMultiplier) + pMin;
		return (result > pMax) ? pMax : result;
	},
	
	/*
	 * Converts a time string to seconds.
	 * @param string pTime in X:XX:XX or X:XX or 0 format.
	 * @returns int seconds totaled.
	 * @pre Time string contains at most 1 "~" and at most 2 ":".
	 */
	parseEventTime: function(pTime)
	{
		/*
		 * Time string with the ~ are preformatted as the minimum time plus the
		 * window time (two time strings), for example "1:30:00~30:00" is 1.5 hour
		 * wait, and 0.5 hour window during which the next event can happen.
		 */
		var time = new Array();
		if (pTime.indexOf("~") !== -1)
		{
			time = pTime.split("~");
			// Sum the minimum wait with the expected (half) time of the window
			return T.parseEventTime(time[0]) + ~~(T.parseEventTime(time[1]) / 2);
		}
		if (pTime === "*")
		{
			return 0;
		}
		// If just a number without colons, assume it is already seconds
		if (pTime.indexOf(":") === -1)
		{
			return parseInt(pTime, T.cBASE_10);
		}

		time = pTime.split(":");
		if (time.length === 2)
		{
			return parseInt(time[0], T.cBASE_10) * T.cSECONDS_IN_MINUTE
				+ parseInt(time[1], T.cBASE_10);
		}
		if (time.length === 3)
		{
			return parseInt(time[0]) * T.cSECONDS_IN_HOUR
				+ parseInt(time[1], T.cBASE_10) * T.cSECONDS_IN_MINUTE
				+ parseInt(time[2], T.cBASE_10);
		}
		return NaN;
	},
	
	/*
	 * Converts "XX:XX" (hours:minutes) to minutes.
	 * @param string pTime to convert.
	 * @returns int minutes totaled.
	 */
	parseChainTime: function(pTime)
	{
		var time = pTime.split(":");
		return parseInt(time[0], T.cBASE_10) * T.cMINUTES_IN_HOUR
				+ parseInt(time[1], T.cBASE_10);
	},

	/*
	 * The DST global integer is added to the server hour, which is incremented if
	 * DST is in effect. The code is from http://javascript.about.com/library/bldst.htm
	 */
	checkDST: function()
	{
		Date.prototype.stdTimezoneOffset = function()
		{
			var jan = new Date(this.getFullYear(), 0, 1);
			var jul = new Date(this.getFullYear(), 6, 1);
			return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
		};
		Date.prototype.dst = function()
		{
			return this.getTimezoneOffset() < this.stdTimezoneOffset();
		};

		var now = new Date();
		T.DST_IN_EFFECT = (now.dst() && O.Options.bol_detectDST) ? 1 : 0;
	},

	/*
	 * Gets a formatted time string, arguments are taken as key-value pairs.
	 * @objparam string reference place to offset the time, default is local.
	 * @objparam boolean want24 to format as 24 hour or not (AM/PM).
	 * @objparam boolean wantLetters to format #h #m #s instead of colons. Overrides want24.
	 * @objparam boolean wantSeconds to include the seconds.
	 * @objparam int customTimeInSeconds to convert to a time string, will use
	 * current time if undefined.
	 * @returns 23:59:59 or 11:59:59 PM or 23h 59m 59s time string.
	 */
	getTimeFormatted: function(pOptions)
	{
		// Set parameter defaults
		pOptions = pOptions || {};
		if (pOptions.reference === undefined)
		{
			pOptions.reference = T.ReferenceEnum.Local;
		}
		if (pOptions.want24 === undefined)
		{
			pOptions.want24 = O.Options.bol_use24Hour;
		}
		if (pOptions.wantSeconds === undefined)
		{
			pOptions.wantSeconds = true;
		}
		if (pOptions.wantHours === undefined)
		{
			pOptions.wantHours = true;
		}
		if (pOptions.wantLetters === undefined)
		{
			pOptions.wantLetters = false;
		}
		
		var sec, min, hour;
		var now = new Date();
		
		if (pOptions.customTimeInSeconds === undefined)
		{
			switch (pOptions.reference)
			{
				case T.ReferenceEnum.Local:
				{
					sec = now.getSeconds();
					min = now.getMinutes();
					hour = now.getHours();
				} break;
				case T.ReferenceEnum.Server:
				{
					sec = now.getSeconds();
					min = now.getMinutes();
					hour = now.getUTCHours() + T.cUTC_OFFSET_SERVER + T.DST_IN_EFFECT;
					hour = T.wrapInteger(hour, T.cHOURS_IN_DAY);
				} break;
				case T.ReferenceEnum.UTC:
				{
					sec = now.getUTCSeconds();
					min = now.getUTCMinutes();
					hour = now.getUTCHours();
				} break;
			}
		}
		else
		{
			// Account for negative input
			pOptions.customTimeInSeconds = T.wrapInteger(pOptions.customTimeInSeconds, T.cSECONDS_IN_DAY);
			/*
			 * Convert specified seconds to time units. The ~~ gets rid of the
			 * decimal so / behaves like integer divide.
			 */
			sec = pOptions.customTimeInSeconds % T.cSECONDS_IN_MINUTE;
			min = ~~(pOptions.customTimeInSeconds / T.cSECONDS_IN_MINUTE) % T.cMINUTES_IN_HOUR;
			hour = ~~(pOptions.customTimeInSeconds / T.cSECONDS_IN_HOUR);
		}
		
		var minsec = "";
		// Include the seconds else don't
		if (pOptions.wantSeconds)
		{
			if (pOptions.wantLetters)
			{
				if (hour === 0 && min === 0)
				{
					minsec = sec + D.getWord("s");
				}
				else
				{
					minsec = min + D.getWord("m") + " " + sec + D.getWord("s");
				}
			}
			else if (pOptions.wantHours === false)
			{
				minsec = min + ":" + ((sec < T.cBASE_10) ? "0" + sec : sec);
			}
			else
			{
				minsec = ((min < T.cBASE_10) ? "0" + min : min) + ":" + ((sec < T.cBASE_10) ? "0" + sec : sec);
			}
		}
		else
		{
			if (pOptions.wantLetters)
			{
				minsec = min + D.getWord("m");
			}
			else
			{
				minsec = ((min < T.cBASE_10) ? "0" + min : min);
			}
		}
		
		// Possible returns
		if (pOptions.wantLetters)
		{
			if (hour === 0 || pOptions.wantHours === false)
			{
				return minsec;
			}
			return hour + D.getWord("h") + " " + minsec;
		}
		if (pOptions.want24)
		{
			if (pOptions.wantHours === false)
			{
				return minsec;
			}
			return ((hour < T.cBASE_10) ? "0" + hour : hour) + ":" + minsec;
		}
		// Else shift the hour and suffix the meridiem
		var period = " AM";
		if (hour >= T.cHOURS_IN_MERIDIEM)
		{
			if (hour > T.cHOURS_IN_MERIDIEM)
			{
				hour = hour % T.cHOURS_IN_MERIDIEM;
			}
			period = " PM";
		}
		else if (hour === 0)
		{
			hour = T.cHOURS_IN_MERIDIEM;
		}
		return hour + ":" + minsec + period;
	},
	
	/*
	 * Gets a "Days:Hours:Minutes:Seconds" string from seconds.
	 * @param int pMilliseconds of time.
	 * @returns string formatted time.
	 */
	formatMilliseconds: function(pMilliseconds, pWantDeciseconds)
	{
		var seconds = ~~(pMilliseconds / T.cMILLISECONDS_IN_SECOND);
		var deciseconds = ~~((pMilliseconds % T.cMILLISECONDS_IN_SECOND) / T.cBASE_10);
		var day, hour, min, sec;
		var daystr = "";
		var hourstr = "";
		var minstr = "";
		var secstr = "";
		var msstr = "";
		var signstr = "";
		
		if (seconds < 0)
		{
			seconds = seconds * -1;
			signstr = "−";
		}
		if (seconds >= T.cSECONDS_IN_DAY)
		{
			day = ~~(seconds / T.cSECONDS_IN_DAY);
			daystr = day + "::";
		}
		if (seconds >= T.cSECONDS_IN_HOUR)
		{
			hour = ~~(seconds / T.cSECONDS_IN_HOUR) % T.cHOURS_IN_DAY;
			hourstr = hour + ":";
			if (daystr !== "" && hour < T.cBASE_10)
			{
				hourstr = "0" + hourstr;
			}
		}
		if (seconds >= T.cSECONDS_IN_MINUTE)
		{
			min = ~~(seconds / T.cSECONDS_IN_MINUTE) % T.cMINUTES_IN_HOUR;
			minstr = min + ":";
			if (hourstr !== "" && min < T.cBASE_10)
			{
				minstr = "0" + minstr;
			}
		}
		else
		{
			minstr = "0:";
		}
		sec = seconds % T.cSECONDS_IN_MINUTE;
		secstr = sec.toString();
		if (sec < T.cBASE_10)
		{
			secstr = "0" + secstr;
		}
		if (pWantDeciseconds)
		{
			msstr = "." + deciseconds;
			if (deciseconds < T.cBASE_10)
			{
				msstr = ".0" + deciseconds;
			}
		}
		
		return signstr + daystr + hourstr + minstr + secstr + msstr;
	},
	
	/*
	 * Gets a "1w 6d 23h 59m 59s" string from seconds.
	 * @param int pSeconds of time.
	 * @returns string formatted time.
	 */
	formatSeconds: function(pSeconds, pWantSeconds)
	{
		var seconds = pSeconds;
		var week, day, hour, min, sec;
		var weekstr = "";
		var daystr = "";
		var hourstr = "";
		var minstr = "";
		var secstr = "";
		var signstr = "";
		
		if (seconds < 0)
		{
			seconds = seconds * -1;
			signstr = "−";
		}
		if (seconds >= T.cSECONDS_IN_WEEK)
		{
			week = ~~(seconds / T.cSECONDS_IN_WEEK);
			weekstr = week + D.getWord("w") + " ";
		}
		if (seconds >= T.cSECONDS_IN_DAY)
		{
			day = ~~(seconds / T.cSECONDS_IN_DAY) % T.cDAYS_IN_WEEK;
			daystr = day + D.getWord("d") + " ";
		}
		if (seconds >= T.cSECONDS_IN_HOUR)
		{
			hour = ~~(seconds / T.cSECONDS_IN_HOUR) % T.cHOURS_IN_DAY;
			hourstr = hour + D.getWord("h") + " ";
		}
		if (seconds >= T.cSECONDS_IN_MINUTE)
		{
			min = ~~(seconds / T.cSECONDS_IN_MINUTE) % T.cMINUTES_IN_HOUR;
			minstr = min + D.getWord("m") + " ";
		}
		if (pWantSeconds)
		{
			sec = seconds % T.cSECONDS_IN_MINUTE;
			secstr = sec.toString() + D.getWord("s");
		}
		
		return signstr + weekstr + daystr + hourstr + minstr + secstr;
	},
	
	/*
	 * Checks a time sensitive object if its Start and Finish date objects are
	 * within the current time.
	 */
	isTimely: function(pObject, pDate)
	{
		if (pDate >= pObject.Start && pDate <= pObject.Finish)
		{
			return true;
		}
		return false;
	},
	
	/*
	 * Tells if current UTC time is daytime in game or not (night).
	 * @returns true if daytime.
	 */
	isDaylight: function()
	{
		var now = new Date();
		var hour = now.getUTCHours();
		var min = now.getUTCMinutes();
		if (hour % 2 === 0) // If hour is even
		{
			if (min >= T.cDAYTIME_DAY_START)
			{
				return true;
			}
		}
		else // If hour is odd
		{
			if (min < T.cDAYTIME_NIGHT_START)
			{
				return true;
			}
		}
		return false;
	},
	
	/*
	 * Gets a preformatted string of the minutes of daylight or night remaining.
	 * @returns string.
	 */
	getDayPeriodRemaining: function()
	{
		var now = new Date();
		var hour = now.getUTCHours();
		var min = now.getUTCMinutes();
		var str = "";
		if (hour % 2 === 0)
		{
			if (min >= T.cDAYTIME_DAY_START)
			{
				str = (T.cDAYTIME_DAY_START + T.cDAYTIME_DAY_MINUTES - min);
			}
			else
			{
				str = (T.cDAYTIME_DAY_START - min);
			}
		}
		else
		{
			if (min < T.cDAYTIME_NIGHT_START)
			{
				str = (T.cDAYTIME_NIGHT_START - min);
			}
			else
			{
				str = (T.cDAYTIME_NIGHT_START + T.cDAYTIME_NIGHT_MINUTES - min);
			}
		}
		return str + D.getWord("m");
	},
	
	/*
	 * Gets a Date object of the previous UTC midnight
	 * @returns Date.
	 */
	getUTCMidnight: function()
	{
		return (new Date()).setUTCHours(0, 0, 0, 0);
	},

	/*
	 * Gets the time in units since midnight at the point of reference.
	 * @param string pTimeUnit time unit to convert from.
	 * @param string pReference place to offset the time, default is UTC.
	 * @returns number seconds, minutes, or hours.
	 */
	getTimeSinceMidnight: function(pReference, pTimeUnit)
	{
		pTimeUnit = pTimeUnit || T.UnitEnum.Seconds;
		pReference = pReference || T.ReferenceEnum.UTC;
		
		var now = new Date();
		var hour = now.getUTCHours();
		var min = now.getUTCMinutes();
		var sec = now.getUTCSeconds();
		
		switch (pReference)
		{
			case T.ReferenceEnum.Server: hour = hour + T.cUTC_OFFSET_SERVER + T.DST_IN_EFFECT; break;
			case T.ReferenceEnum.UTC: break;
			case T.ReferenceEnum.Local:
			{
				 hour = now.getHours();
				 min = now.getMinutes();
				 sec = now.getSeconds();
			} break;
		}
		hour = T.wrapInteger(hour, T.cHOURS_IN_DAY);

		if (pTimeUnit === T.UnitEnum.Hours)
		{ 
			return hour;
		}
		if (pTimeUnit === T.UnitEnum.Minutes)
		{
			return (hour * T.cMINUTES_IN_HOUR) + min;
		}
		// Default return seconds
		return (hour * T.cSECONDS_IN_HOUR) + (min * T.cSECONDS_IN_MINUTE) + sec;
	},
	
	/*
	 * Gets the seconds since 1970 January 1 00:00:00 UTC.
	 * @returns int seconds.
	 */
	getUNIXSeconds: function()
	{
		return ~~((new Date()).getTime() / T.cMILLISECONDS_IN_SECOND);
	},
	
	/*
	 * Increments a Date object by number of days.
	 * @param object pDate.
	 * @param int pDays to increment. Can be negative.
	 * @returns object Date.
	 */
	addDaysToDate: function(pDate, pDays)
	{
		var newdate = new Date(pDate);
		newdate.setDate(pDate.getDate() + pDays);
		return newdate;
	},
	
	/*
	 * Gets the seconds until a time in a day of the week.
	 * @param int pDay of week.
	 * @param int pOffsetSeconds since midnight (start) of that day.
	 * @returns int seconds.
	 */
	getSecondsTillWeekday: function(pTargetDay, pOffsetSeconds)
	{
		if (pOffsetSeconds === undefined)
		{
			pOffsetSeconds = 0;
		}
		var now = new Date();
		var todaysecondselapsed = T.getTimeSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Seconds);
		var todaysecondsremaining = T.cSECONDS_IN_DAY - todaysecondselapsed;
		var currentdayofweek = now.getUTCDay();
		var wholedaysecondsbetween = 0;
		if (pTargetDay > currentdayofweek)
		{
			wholedaysecondsbetween = (pTargetDay - currentdayofweek - 1) * T.cSECONDS_IN_DAY;
			return todaysecondsremaining + wholedaysecondsbetween + pOffsetSeconds;
		}
		else if (pTargetDay < currentdayofweek)
		{
			wholedaysecondsbetween = ((T.cDAYS_IN_WEEK - 1 - currentdayofweek) + pTargetDay) * T.cSECONDS_IN_DAY;
			return todaysecondsremaining + wholedaysecondsbetween + pOffsetSeconds;
		}
		// If target day is same as today
		if (pOffsetSeconds >= todaysecondselapsed)
		{
			return pOffsetSeconds - todaysecondselapsed;
		}
		else
		{
			return T.cSECONDS_IN_WEEK - (todaysecondselapsed - pOffsetSeconds);
		}
	},
	
	/*
	 * Counts down till weekly reset. For use by the personal checklist.
	 */
	updateCountdownToReset: function()
	{
		if (T.secondsTillResetWeekly < 0)
		{
			T.secondsTillResetWeekly = T.getSecondsTillWeekday(T.DayEnum.Sunday);
		}
		$("#chlCountdownToReset").text(T.formatSeconds(T.secondsTillResetWeekly, true));
		// Decrement global variable to countdown, instead of calling the compute function every time
		T.secondsTillResetWeekly--;
	},
	
	/*
	 * Initializes dashboard components.
	 * Must be executed before the clock tick function executes.
	 */
	initializeDashboard: function()
	{
		// Verify countdown: if at least one countdown has not expired
		var now = new Date();
		for (var i in T.DashboardCountdown)
		{
			if (now < T.DashboardCountdown[i].Finish)
			{
				T.isDashboardCountdownEnabled = true;
				break;
			}
		}
		
		// Verify announcement: if announcement exists
		if (T.DashboardAnnouncement.length > 0)
		{
			U.convertExternalLink($("#dsbAnnouncement").html(T.DashboardAnnouncement).find("a"));
			M.bindMapLinks("#dsbAnnouncement");
			T.isDashboardAnnouncementEnabled = true;
		}
		
		// Verify sale: if sale exists and has not expired
		if (T.DashboardSale.Items.length > 0 && T.isTimely(T.DashboardSale, now))
		{
			T.isDashboardSaleEnabled = true;
		}
		
		// Make sure at least one component of the dashboard is enabled and timely, else disable the dashboard
		if ((T.isDashboardCountdownEnabled === false
				&& T.isDashboardAnnouncementEnabled === false
				&& T.isDashboardSaleEnabled === false)
			|| T.isDashboardEnabled === false
			|| I.isMapEnabled === false
			|| O.Options.bol_showDashboard === false)
		{
			T.isDashboardEnabled = false;
			return;
		}
		T.isDashboardCountdownTickEnabled = true;
		
		// Hide the dashboard when clicked on the close button
		$("#dsbClose").click(function()
		{
			T.toggleDashboard(false);
			T.isDashboardEnabled = false;
		});
		
		// Initialize countdown entries
		if (T.isDashboardCountdownEnabled)
		{
			T.toggleDashboard(true);
			var namekey = D.getNameKey();
			var urlkey = D.getURLKey();
			var ctd;
			var name;
			var url;
			
			for (var i in T.DashboardCountdown)
			{
				// Initialize countdown properties
				ctd = T.DashboardCountdown[i];
				ctd.isTimely = true;
				ctd.StartStamp = ctd.Start.toLocaleString();
				ctd.FinishStamp = ctd.Finish.toLocaleString();
				// Use default name if available, or use the translated name
				name = (ctd.name === undefined) ? ctd[namekey] : ctd.name;
				// If available: set the URL as the official news page, the translated url, or a regular url
				url = (ctd.news === undefined) ? ctd[urlkey] : U.getGW2NewsLink(ctd.news); 
				url = (url === undefined) ? ctd.url : url;
				if (url.indexOf(I.cSiteURL) !== -1)
				{
					// Don't externalize URL if self link
					ctd.Anchor = "<a href='" + url + "'>" + name + "</a>";
				}
				else
				{
					ctd.Anchor = "<a href='" + U.convertExternalURL(url) + "' target='_blank'>" + name + "</a>";
				}
				
				/*
				 * code: the colored bullet point for activity status
				 * time: the countdown time
				 * var: the up or down arrow for start or finish start
				 * samp: the start or finish time
				 */
				$("#dsbCountdown").append(
					"<div id='dsbCountdown_" + i + "' class='dsbCountdownEntry'>"
						+ "<code>■</code>" + ctd.Anchor + " <time id='dsbCountdownTime_" + i + "'></time> <var></var> <samp></samp>"
					+ "</div>");
			}
			T.refreshDashboard(now);
		}
		
		// Initialize Living Story
		if (T.isDashboardStoryEnabled)
		{
			$("#dsbStory").before("<div id='dsbStoryTitle'>" + D.getObjectName(T.DashboardStory) + "</div>").show();
			I.initializeScrollbar("#dsbStory");
		}
		
		// Initialize sale
		if (T.isDashboardSaleEnabled)
		{
			// Create "button" to toggle list of items on sale
			$("#dsbSale").append("<div id='dsbSaleHeader' class='curToggle'><img src='img/ui/gemstore.png' /> "
				+ "<u>" + ((T.DashboardSale.Items[0].isExample === undefined) ? (T.DashboardSale.Items.length) : (T.DashboardSale.Items.length - 1)) + " "
				+ D.getTranslation("Gem Store Promotions") + "</u> "
				+ "(<span class='dsbSalePriceNew'>" + T.DashboardSale.range + "<ins class='s16 s16_gem'></ins></span>)"
				+ "<img src='img/ui/toggle.png' />"
				+ "⇓@ " + T.DashboardSale.Finish.toLocaleString()
			+"</div><div id='dsbSaleTable' class='jsScrollable'></div>");
			$("#dsbSaleHeader").click(function()
			{
				T.generateDashboardSale();
			});
			// Automatically generate the items on sale if the boolean is true
			if (T.DashboardSale.isPreshown === true)
			{
				T.generateDashboardSale();
			}
		}
	},
	
	/*
	 * Regenerates the list of items on sale in a toggle manner.
	 */
	generateDashboardSale: function()
	{
		var animationspeed = 200;
		if ($("#dsbSaleTable").is(":empty") === false)
		{
			$("#dsbSaleTable").animate({height: 0}, animationspeed, function()
			{
				$(this).css({height: "auto"}).empty();
			});
		}
		else
		{
			$("#dsbSaleTable").append(I.cThrobber);
			E.updateCoinInGem().always(function()
			{
				$("#dsbSaleTable").empty().append("<div id='dsbSaleCol0'></div><div id='dsbSaleCol1'></div>");
				if (E.Exchange.CoinInGem !== 0)
				{
					for (var i in T.DashboardSale.Items)
					{
						var item = T.DashboardSale.Items[i];
						var forhowmany = (item.quantity > 1) ? item.quantity + "/ " : "";
						var prevprice = (item.pricenew < item.priceold) ? item.priceold : "";
						var column = (item.col !== undefined) ? item.col : parseInt(i) % 2;
						$("#dsbSaleCol" + column).append("<div class='dsbSaleEntry'>"
							+"<a href='" + U.convertExternalURL(item.url) + "' target='_blank'><img class='dsbSaleIcon' src='" + item.img + "' /></a> "
							+ "<span class='dsbSalePriceOld'><del>" + forhowmany + prevprice + "</del></span> "
							+ "<span class='dsbSalePriceNew'>" + forhowmany + item.pricenew + "<ins class='s16 s16_gem'></ins></span>"
							+ "<span class='dsbSalePriceCoin'> ≈ " + E.createCoinString(Math.round(item.pricenew * E.Exchange.CoinInGem), true) + "</span>"
							+ "<span class='dsbSalePriceMoney'> = " + E.convertGemToMoney(item.pricenew) + "<ins class='s16 s16_money'></ins></span>"
						+ "</div>");
					}
				}
				var height = $("#dsbSaleTable").height();
				$("#dsbSaleTable").css({height: 0}).animate({height: height}, animationspeed, function()
				{
					$(this).css({height: "auto"});
					I.initializeScrollbar("#dsbSaleTable");
					I.updateScrollbar("#dsbSaleTable");
				});
			});
		}
	},
	
	/*
	 * Updates the countdown time in each countdown entries.
	 * Called by the clock tick function every 1 second.
	 * @param Date pDate for getting time.
	 */
	updateDashboardCountdown: function(pDate)
	{
		for (var i in T.DashboardCountdown)
		{
			var ctd = T.DashboardCountdown[i];
			if (ctd.isTimely)
			{
				var ithtime = T.formatSeconds(~~((ctd.DesiredTime.getTime() - pDate.getTime()) / T.cMILLISECONDS_IN_SECOND), true);
				document.getElementById("dsbCountdownTime_" + i).innerHTML = ithtime;
			}
		}
	},
	
	/*
	 * Refreshes timely components in the dashboard.
	 * Called by the clock tick function every 5 minutes.
	 * @param Date pDate to compare with deadlines.
	 */
	refreshDashboard: function(pDate)
	{
		// Update countdown text elements, or deactivate a countdown entry if expired
		for (var i in T.DashboardCountdown)
		{
			var ctd = T.DashboardCountdown[i];
			if (ctd.isTimely)
			{
				var countdownhtml = $("#dsbCountdown_" + i);
				var bulletclass;
				var arrow;
				var stamp;
				// Don't generate countdown for those that are past the start time
				if (pDate < ctd.Start)
				{
					ctd.DesiredTime = ctd.Start;
					bulletclass = "dsbCountdownDormant";
					arrow = "⇑@";
					stamp = ctd.StartStamp;
				}
				else if (pDate < ctd.Finish)
				{
					ctd.DesiredTime = ctd.Finish;
					bulletclass = "dsbCountdownActive";
					arrow = "⇓@";
					stamp = ctd.FinishStamp;
				}
				else
				{
					ctd.isTimely = false;
					countdownhtml.remove();
				}

				if (ctd.isTimely)
				{
					countdownhtml.find("code").removeClass().addClass(bulletclass);
					countdownhtml.find("var").text(arrow);
					countdownhtml.find("samp").text(stamp);
				}
			}
		}
		
		// Deactivate outdated Living Story
		if (T.isTimely(T.DashboardStory, pDate) === false)
		{
			T.isDashboardStoryEnabled = false;
			$("#dsbStory").hide();
		}
		
		// Deactivate outdated sale
		if (T.isTimely(T.DashboardSale, pDate) === false)
		{
			T.isDashboardSaleEnabled = false;
			$("#dsbSale").hide();
		}
	},
	
	/*
	 * Shows or hides the dashboard.
	 * @param boolean pBoolean.
	 */
	toggleDashboard: function(pBoolean)
	{
		if (T.isDashboardEnabled)
		{
			T.isDashboardCountdownTickEnabled = pBoolean;
			if (pBoolean)
			{
				$("#itemDashboard").show().css({opacity: 0}).animate({opacity: 1}, 200);
			}
			else
			{
				$("#itemDashboard").hide();
			}
		}
	}
};

/* =============================================================================
 * @@Klock analog and by-the-second and frame refreshes
 * ========================================================================== */
K = {
	
	tickerFrequency: 250, // Must be a divisor of 1000 milliseconds
	tickerSecondPrevious: null,
	awakeTimestampPrevious: 0,
	awakeTimestampTolerance: 5,
	currentFrameOffsetMinutes: 0,
	currentPredictionColor: "",
	currentDaytimeSymbol: "",
	iconOpacityChecked: 0.4,
	iconOpacitySpeed: 200,
	oldQuadrantAngle: 0,
	cDEGREES_IN_CIRCLE: 360,
	cDEGREES_IN_QUADRANT: 90,
	
	// Clock DOM elements
	handSecond: {}, handMinute: {}, handHour: {},
	clockBackground: {}, clockCircumference: {}, timeProgress: {},
	timeDaylight: {}, timeLocal: {}, timeDaytime: {}, timeSimple: {}, timeMap: {},
	timestampUTC: {}, timestampLocal: {}, timestampServer: {}, timestampReset: {},
	
	// These will be DOM elements
	WpChain0: {}, WpChain1: {}, WpChain2: {}, WpChain3: {},
	// These will be jQuery "elements"
	IconSD0: {}, IconSD1: {}, IconSD2: {}, IconSD3: {},
	IconHC0: {}, IconHC1: {}, IconHC2: {}, IconHC3: {},
	IconsStandard: new Array(),
	IconsHardcore: new Array(),
	wpClipboards: [],
	lsClipboards: [],
	cZeroClipboardDataAttribute: "data-clipboard-text", // Defined by ZeroClipboard
	cZeroClipboardSuccessText: "Chat link copied to clipboard :)<br />",
	TickerTimeout: {},
	
	/*
	 * Starts the clock.
	 */
	initializeClock: function()
	{
		// Remember frequently accessed elements
		K.handSecond = $("#clkSecondHand")[0];
		K.handMinute = $("#clkMinuteHand")[0];
		K.handHour = $("#clkHourHand")[0];
		K.clockBackground = $("#paneClockBackground")[0];
		K.clockCircumference = $("#clkCircumference")[0];
		K.timeProgress = $("#chnProgress")[0];
		K.timeLocal = $("#itemTimeLocalActual")[0];
		K.timeDaytime = $("#itemTimeDayTime")[0];
		K.timeSimple = $("#itemSimpleTime")[0];
		K.timeMap = $("#itemMapTime")[0];
		K.timestampUTC = $("#optTimestampUTC")[0];
		K.timestampLocal = $("#optTimestampLocalReset")[0];
		K.timestampServer = $("#optTimestampServerReset")[0];
		K.timestampReset = $("#optTimeTillReset")[0];
		
		T.initializeDashboard();
		K.updateTimeFrame(new Date());
		K.updateDaytimeIcon();
		K.tickFrequent();
		K.updateDigitalClockMinutely();
		K.initializeClipboard();
		
		// Other clickable elements
		$("#itemTimeLocalActual").click(function()
		{
			$("#opt_bol_use24Hour").trigger("click");
		});
	},
	
	/*
	 * Sets the clock pane's dimension and element positions according to options.
	 */
	setClock: function()
	{
		var animationspeed = 200;
		var clockpaneheight = 0;

		switch (O.Options.int_setClock)
		{
			case O.IntEnum.Clock.Compact:
			{
				$("#paneClock").show();
				$("#itemTimeLocal, #itemTimeDaytime, #itemLanguage, #itemSocial").show();
				// Reposition clock items
				I.bulkAnimate([
					{s: "#clock", p: {top: "0px", left: "70px", width: "220px", height: "220px"}},
					{s: "#paneClockFace", p: {width: "360px", height: "360px", top: "-70px", left: "0px"}},
					{s: "#paneClockIcons .iconSD", p: {"border-radius": "32px"}},
					{s: "#paneClockIcons .iconHC", p: {"border-radius": "24px"}},
					{s: "#clkIconSD0", p: {top: "4px", left: "290px"}},
					{s: "#clkIconSD1", p: {top: "148px", left: "290px"}},
					{s: "#clkIconSD2", p: {top: "148px", left: "4px"}},
					{s: "#clkIconSD3", p: {top: "4px", left: "4px"}},
					{s: "#clkIconHC0", p: {top: "52px", left: "306px"}},
					{s: "#clkIconHC1", p: {top: "132px", left: "306px"}},
					{s: "#clkIconHC2", p: {top: "132px", left: "20px"}},
					{s: "#clkIconHC3", p: {top: "52px", left: "20px"}},
					{s: "#clkWaypoint0", p: {top: "24px", left: "274px"}},
					{s: "#clkWaypoint1", p: {top: "164px", left: "274px"}},
					{s: "#clkWaypoint2", p: {top: "164px", left: "52px"}},
					{s: "#clkWaypoint3", p: {top: "24px", left: "52px"}}
				], animationspeed);
				$("#paneClockIcons .iconHC").css({width: "32px", height: "32px"});
				// Restyle text items
				$("#itemTimeLocal").css({
					width: "100%",
					right: "auto", bottom: "90px",
					"text-align": "center",
					color: "#eee",
					opacity: 0.5
				});
				$("#itemTimeDaytime").css({
					width: "100%",
					top: "90px", bottom: "auto", left: "auto",
					"text-align": "center",
					color: "#eee",
					opacity: 0.5
				});
				$("#itemLanguage").css({ bottom: "72px", left: "10px" });
				$("#itemSocial").css({ bottom: "100px", right: "10px" });

				clockpaneheight = I.cPANE_CLOCK_HEIGHT_COMPACT;
			} break;

			case O.IntEnum.Clock.Full:
			{
				$("#paneClock").show();
				$("#itemTimeLocal, #itemTimeDaytime, #itemLanguage, #itemSocial").show();
				// Reposition clock items
				I.bulkAnimate([
					{s: "#clock", p: {top: "70px", left: "70px", width: "220px", height: "220px"}},
					{s: "#paneClockFace", p: {width: "360px", height: "360px", top: "0px", left: "0px"}},
					{s: "#paneClockIcons .iconSD", p: {"border-radius": "12px"}},
					{s: "#paneClockIcons .iconHC", p: {"border-radius": "12px"}},
					{s: "#clkIconSD0", p: {top: "4px", left: "148px"}},
					{s: "#clkIconSD1", p: {top: "148px", left: "290px"}},
					{s: "#clkIconSD2", p: {top: "290px", left: "148px"}},
					{s: "#clkIconSD3", p: {top: "148px", left: "4px"}},
					{s: "#clkIconHC0", p: {top: "12px", left: "212px"}},
					{s: "#clkIconHC1", p: {top: "212px", left: "298px"}},
					{s: "#clkIconHC2", p: {top: "298px", left: "100px"}},
					{s: "#clkIconHC3", p: {top: "100px", left: "12px"}},
					{s: "#clkWaypoint0", p: {top: "52px", left: "164px"}},
					{s: "#clkWaypoint1", p: {top: "164px", left: "274px"}},
					{s: "#clkWaypoint2", p: {top: "274px", left: "164px"}},
					{s: "#clkWaypoint3", p: {top: "164px", left: "52px"}}
				], animationspeed);
				$("#paneClockIcons .iconHC").css({width: "48px", height: "48px"});
				// Restyle text items
				$("#itemTimeLocal").css({
					width: "auto",
					right: "10px", bottom: "10px",
					"text-align": "left",
					color: "#bbcc77",
					opacity: 1
				});
				$("#itemTimeDaytime").css({
					width: "auto",
					top: "auto", bottom: "10px", left: "10px",
					"text-align": "left",
					color: "#bbcc77",
					opacity: 1
				});
				$("#itemLanguage").css({ bottom: "0px", left: "10px" });
				$("#itemSocial").css({ bottom: "28px", right: "10px" });

				clockpaneheight = I.cPANE_CLOCK_HEIGHT;
			} break;

			case O.IntEnum.Clock.Bar:
			{
				$("#paneClock").show();
				$("#itemTimeLocal, #itemTimeDaytime, #itemLanguage, #itemSocial").hide();
				// Reposition clock items
				I.bulkAnimate([
					{s: "#clock", p: {top: "0px", left: "0px", width: "85px", height: "85px"}},
					{s: "#paneClockFace", p: {width: "132px", height: "132px", top: "-24px", left: "-24px"}},
					{s: "#paneClockIcons .iconSD", p: {"border-radius": "32px"}},
					{s: "#paneClockIcons .iconHC", p: {"border-radius": "24px"}},
					{s: "#clkIconSD0", p: {top: "0px", left: "82px"}},
					{s: "#clkIconSD1", p: {top: "0px", left: "152px"}},
					{s: "#clkIconSD2", p: {top: "0px", left: "222px"}},
					{s: "#clkIconSD3", p: {top: "0px", left: "292px"}},
					{s: "#clkIconHC0", p: {top: "48px", left: "98px"}},
					{s: "#clkIconHC1", p: {top: "48px", left: "168px"}},
					{s: "#clkIconHC2", p: {top: "48px", left: "238px"}},
					{s: "#clkIconHC3", p: {top: "48px", left: "308px"}},
					{s: "#clkWaypoint0", p: {top: "-8px", left: "98px"}},
					{s: "#clkWaypoint1", p: {top: "-8px", left: "168px"}},
					{s: "#clkWaypoint2", p: {top: "-8px", left: "238px"}},
					{s: "#clkWaypoint3", p: {top: "-8px", left: "308px"}}
				], animationspeed);
				$("#paneClockIcons .iconHC").css({width: "32px", height: "32px"});

				clockpaneheight = I.cPANE_CLOCK_HEIGHT_BAR;
			} break;

			case O.IntEnum.Clock.None:
			{
				/*
				 * There are three panes on the right panel: Clock, Menu, and Content
				 * all absolutely positioned, so to move them the CSS "top" attribute
				 * needs to be changed: less to go up, more to go down.
				 */
				$("#paneMenu").animate({top: 0}, animationspeed);
				$("#paneContent").animate({top: I.cPANE_MENU_HEIGHT,
					"min-height": I.cPANEL_HEIGHT_MIN - (I.cPANE_MENU_HEIGHT) + "px"}, animationspeed,
					function()
					{
						$("#paneClock").hide();
					});
			} break;
		}
		
		// Height for repositioning the beam menu, which is fixed position
		I.CLOCK_AND_MENU_HEIGHT = clockpaneheight + I.cPANE_MENU_HEIGHT;

		// Readjust panes to new height if showing clock
		if (O.Options.int_setClock !== O.IntEnum.Clock.None)
		{
			// Resize panes by animation
			$("#paneMenu").animate({top: clockpaneheight}, animationspeed);
			$("#paneClock, #paneClockWall, #paneClockBackground, #paneClockIcons")
				.animate({height: clockpaneheight}, animationspeed);

			// Readjust content pane
			$("#paneContent").animate({top: clockpaneheight + I.cPANE_MENU_HEIGHT,
				"min-height": I.cPANEL_HEIGHT_MIN - (clockpaneheight + I.cPANE_MENU_HEIGHT) + "px"}, animationspeed);
		}
		
		// Other associated elements
		switch (I.ModeCurrent)
		{
			case I.ModeEnum.Overlay: $("#itemSocial").hide(); break;
		}
	},

	/*
	 * Sets a marker (small spikes at clock circumference) to specified angle.
	 * @param object pElement element to set angle.
	 * @param int pSeconds seconds from the hour.
	 */
	setMarkerAngle: function(pElement, pSeconds)
	{
		$(pElement).attr("transform", "rotate(" + pSeconds/10 + ", 50, 50)");
	},

	/*
	 * Sets a clock element by angle.
	 * @param object pElement to set angle.
	 * @param int pAngle angle 0-360.
	 */
	rotateClockElement: function(pElement, pAngle)
	{
		pElement.setAttribute("transform", "rotate(" + pAngle + ", 50, 50)");
	},
	
	/*
	 * Removes the filter attribute from SVG elements that have them (as in
	 * the shadow effect), then re-adds the filter. Workaround for a Firefox bug
	 * https://bugzilla.mozilla.org/show_bug.cgi?id=652991
	 */
	reapplyFilters: function()
	{
		if (I.BrowserCurrent === I.BrowserEnum.Firefox)
		{
			var c = $("#clkCircumference");
			var h = $("#clkHands");
			var f1 = "url(#clkFilterShadowOuter)";
			var f2 = "url(#clkGradientCircumference)";
			var f3 = "url(#clkFilterShadowHand)";
			c.removeAttr("filter").attr("filter", f1);
			c.css("stroke", f2);
			h.removeAttr("filter").attr("filter", f3);
		}
	},
	
	/*
	 * Initializes array of clock items for iteration and binds the clock chain
	 * icons to view map event when clicked, or check off when double clicked.
	 * @pre data attribute of icon was updated to get associated chain object.
	 */
	initializeClockItems: function()
	{
		K.IconsStandard = null;
		K.IconsHardcore = null;
		K.IconsStandard = new Array(K.IconSD0, K.IconSD1, K.IconSD2, K.IconSD3);
		K.IconsHardcore = new Array(K.IconHC0, K.IconHC1, K.IconHC2, K.IconHC3);
		
		var i;
		var coord;
		
		// Change behavior of overlay mode because the user uses the clock more
		var checkbossbehavior = "click";
		var zoombossbehavior = "dblclick";
		if (I.ModeCurrent === I.ModeEnum.Website && I.isProgramEmbedded === false)
		{
			checkbossbehavior = "dblclick";
			zoombossbehavior = "click";
		}
		
		// Bind behavior
		for (i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
		{
			$([K.IconsStandard[i], K.IconsHardcore[i]]).each(function()
			{
				$(this).unbind(zoombossbehavior).on(zoombossbehavior, function()
				{
					coord = C.Chains[$(this).data(C.cIndexSynonym)].primaryEvents[0].path[0];
					M.goToView(coord, M.ZoomEnum.Ground, M.Pin.Event);
					
				}).unbind(checkbossbehavior).on(checkbossbehavior, function()
				{
					$("#chnCheck_" + C.Chains[$(this).data(C.cIndexSynonym)].nexus).trigger("click");
				});
			});
		}
	},
	
	/*
	 * Called when the user checks a chain on the checklist, this will see if
	 * that chain is on the clock, and if it is, change visual based on the
	 * check state.
	 * @param string pIndex of the chain to check off in the clock.
	 * @pre Icons jQuery objects array was initialized and icons are in
	 * proper clock position.
	 */
	checkoffChainIcon: function(pIndex)
	{
		var i;
		var chain = C.Chains[pIndex]; // Chain that is clicked on checklist
		var ithchain; // Chain that is on the clock
		var iconchain;
		
		if (chain.series === C.ChainSeriesEnum.Standard
			|| chain.series === C.ChainSeriesEnum.Hardcore)
		{
			for (i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
			{
				switch (chain.series)
				{
					case C.ChainSeriesEnum.Standard:
					{
						ithchain = T.getStandardChain(i);
						iconchain = K.IconsStandard[i];
					} break;
					case C.ChainSeriesEnum.Hardcore:
					{
						ithchain = T.getHardcoreChain(i);
						iconchain = K.IconsHardcore[i];
					} break;
				}

				// If clicked chain is on the clock
				if (ithchain && pIndex === ithchain.nexus)
				{
					if (X.getChainChecklistState(ithchain) !== X.ChecklistEnum.Unchecked)
					{
						iconchain.css({opacity: 1})
							.animate({opacity: K.iconOpacityChecked}, K.iconOpacitySpeed);
					}
					else
					{
						iconchain.css({opacity: K.iconOpacityChecked})
							.animate({opacity: 1}, K.iconOpacitySpeed);
					}
				}
			}
		}
	},
	
	/*
	 * Colors the minute hand and chain progress bar depending on current chain's prediction.
	 * @param string pColor.
	 */
	colorPrediction: function(pColor)
	{
		if (pColor !== K.currentPredictionColor)
		{
			K.currentPredictionColor = pColor;
			K.handMinute.style.stroke = pColor;
			K.timeProgress.style.background = "linear-gradient(to right, black 0%, " + pColor + " 100%)";
		}
	},

	/*
	 * Although the tick effects are supposed to happen every 1 second, the
	 * function is actually ran multiple times per second so setTimeout
	 * is in sync with the Date object.
	 */
	tickFrequent: function()
	{
		var now = new Date();
		var sec = now.getSeconds();
		if (K.tickerSecondPrevious === sec)
		{
			// If the Date second has not changed, then don't do the effects
			K.TickerTimeout = setTimeout(K.tickFrequent, K.tickerFrequency);
			return;
		}
		else
		{
			// Else update the second variable and do the effects
			K.tickerSecondPrevious = sec;
			K.tickSecond(now);
		}
	},
	
	/*
	 * Clock ticker runs every second to update the hands and do effects to the
	 * clock when appropriate, like when a chain starts at 15 minute mark.
	 */
	tickSecond: function(pDate)
	{
		/*
		 * Things in this outer block runs every second, so core JS is used
		 * instead of jQuery for performance.
		 */
		var sec = pDate.getSeconds();
		T.TIMESTAMP_UNIX_SECONDS = T.getUNIXSeconds();
		T.SECONDS_TILL_RESET = T.cSECONDS_IN_DAY - T.getTimeSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Seconds);
		var min = pDate.getMinutes();
		var hour = pDate.getHours() % T.cHOURS_IN_MERIDIEM;
		var secinhour = min*60 + sec;
		var secangle = sec*6; // 1 degree per second
		var minangle = min*6 + sec/10; // 0.1 degrees per second
		var hourangle = hour*30 + (min/60)*30; // 0.5 degrees per minute
		K.rotateClockElement(K.clockCircumference, minangle);
		K.rotateClockElement(K.handSecond, secangle);
		K.rotateClockElement(K.handMinute, minangle);
		K.rotateClockElement(K.handHour, hourangle);
		
		// Opacity value 0.0 through 1.0 based on how far into the 15 minutes frame
		var opacityadd = 1 - ((min % T.cMINUTES_IN_TIMEFRAME)*60 + sec) / (T.cSECONDS_IN_TIMEFRAME);
		// Progress bar over chains page to show how far in timeframe
		var progress = (I.ModeCurrent === I.ModeEnum.Tile)
			? ((T.cPERCENT_100 * opacityadd) + "%") : (~~(I.cPANEL_WIDTH * opacityadd) + "px");
		K.timeProgress.style.width = progress;
		
		// If crossing a 15 minute mark (IMPORTANT)
		if (min % T.cMINUTES_IN_TIMEFRAME === 0 && sec === 0)
		{
			if (O.Options.int_setDimming === 0
				&& I.ModeCurrent !== I.ModeEnum.Simple
				&& I.ModeCurrent !== I.ModeEnum.Overlay)
			{
				$(K.clockBackground).fadeTo(800, 1);
			}
			K.updateTimeFrame(pDate);
		}
		else // If crossing a 1 second mark and hasn't crossed the 15 minute mark
		{
			/*
			 * For devices that goes to sleep, check the UNIX timestamp (which
			 * is updated every second if the device is awake) to see if it's
			 * out of sync, and refresh the clock if so.
			 */
			var awaketimestampcurrent = T.TIMESTAMP_UNIX_SECONDS;
			if (K.awakeTimestampPrevious < (awaketimestampcurrent - K.awakeTimestampTolerance))
			{
				K.updateTimeFrame(pDate);
			}
			// Update the timestamp
			K.awakeTimestampPrevious = awaketimestampcurrent;
			
			// Dim the clock background
			if (O.Options.int_setDimming === 0
				&& I.ModeCurrent !== I.ModeEnum.Simple)
			{
				K.clockBackground.style.opacity = opacityadd;
			}
		}
		
		// If crossing a 1 second mark (given)
		C.CurrentChains.forEach(C.updateCurrentChainTimeHTML);
		
		// If crossing a 1 minute mark
		if (sec === 0)
		{
			K.updateDigitalClockMinutely();
			// Refresh the chain time countdown opted
			C.updateChainsTimeHTML();
			K.updateWaypointsClipboard();
			
			// Alert subscribed chain
			if (O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription)
			{
				K.doSubscribedSpeech(O.Options.int_alertSubscribedFirst);
				K.doSubscribedSpeech(O.Options.int_alertSubscribedSecond);
			}
			
			// If crossing a 5 minute mark
			if (min % T.cMINUTES_IN_DRYTOPFRAME === 0)
			{
				K.updateDaytimeIcon();
				K.updateDryTopClipboard();
				if (T.isDashboardEnabled)
				{
					T.refreshDashboard(pDate);
				}
			}
		}
		
		// Tick the two digital clocks below the analog clock
		if (I.ModeCurrent === I.ModeEnum.Simple)
		{
			K.timeSimple.innerHTML =
			T.getTimeFormatted(
			{
				want24: true,
				wantHours: false,
				wantLetters: true,
				customTimeInSeconds: T.cSECONDS_IN_TIMEFRAME - T.getCurrentTimeframeElapsedTime()
			});
		}
		K.timeLocal.innerHTML = T.getTimeFormatted();
		// Times in the Options page Debug section
		K.timestampUTC.innerHTML = T.TIMESTAMP_UNIX_SECONDS;
		K.timestampLocal.innerHTML = O.Utilities.lastLocalResetTimestamp.value;
		K.timestampServer.innerHTML = T.TIMESTAMP_UNIX_SECONDS + T.SECONDS_TILL_RESET;
		K.timestampReset.innerHTML = T.getTimeFormatted(
			{
				customTimeInSeconds: T.SECONDS_TILL_RESET, want24: true
			});
		
		// Change the minute hand if passing colored marker
		if (secinhour >= K.currentFrameOffsetMinutes
			&& secinhour < (K.currentFrameOffsetMinutes + C.CurrentChainSD.minFinish))
		{
			K.colorPrediction("lime");
		}
		else if (secinhour >= (K.currentFrameOffsetMinutes + C.CurrentChainSD.minFinish)
			&& secinhour < (K.currentFrameOffsetMinutes + C.CurrentChainSD.avgFinish))
		{
			K.colorPrediction("orange");
		}
		else if (secinhour >= (K.currentFrameOffsetMinutes + C.CurrentChainSD.avgFinish))
		{
			K.colorPrediction("red");
		}
		
		// Trigger other ticking functions
		if (T.isCountdownToResetStarted)
		{
			T.updateCountdownToReset();
		}
		if (T.isDashboardCountdownTickEnabled)
		{
			T.updateDashboardCountdown(pDate);
		}
		
		// Loop this function, can use variable to halt it
		K.TickerTimeout = setTimeout(K.tickFrequent, K.tickerFrequency);
	},
	
	/*
	 * Macro function to get a speech if the subscribed boss is within the opted time
	 * @param int pMinutes before a chain starts as set by the user.
	 */
	doSubscribedSpeech: function(pMinutes)
	{
		if (pMinutes > 0)
		{
			var minutestill = T.cMINUTES_IN_TIMEFRAME - T.getCurrentTimeframeElapsedTime(T.UnitEnum.Minutes);
			var chainsd = C.NextChainSD1;
			var chainhc = C.NextChainHC1;
			var chainls = C.NextChainLS1;
			var wantsd = false;
			var wanthc = false;
			var wantls = false;
			var speech = D.getSpeech(D.orderModifier(D.orderModifier("boss", "world"), "subscribed")) + " ";
			var wait = 5;

			// If alarm minutes is beyond the timeframe range, check the chains beyond
			if (pMinutes > T.cMINUTES_IN_TIMEFRAME)
			{
				chainsd = C.NextChainSD2;
				chainhc = C.NextChainHC2;
				chainls = C.NextChainLS2;
				minutestill += T.cMINUTES_IN_TIMEFRAME;
			}
			wantsd = O.objToBool(chainsd) && (C.isChainSubscribed(chainsd) && C.isChainUnchecked(chainsd));
			wanthc = O.objToBool(chainhc) && (C.isChainSubscribed(chainhc) && C.isChainUnchecked(chainhc));
			wantls = O.objToBool(chainls) && (C.isChainSubscribed(chainls) && C.isChainUnchecked(chainls));

			if (pMinutes === minutestill && (wantsd || wanthc))
			{
				if (wantsd && wanthc)
				{
					speech += D.getChainPronunciation(chainsd) + " " + D.getSpeech("and") + " " + D.getChainPronunciation(chainhc);
					wait = 6;
				}
				else if (wantsd)
				{
					speech += D.getChainPronunciation(chainsd);
				}
				else if (wanthc)
				{
					speech += D.getChainPronunciation(chainhc);
				}
				D.speak(speech, wait);
				D.speak(D.getSpeech("will start") + T.getTimeTillChainFormatted(chainsd, "speech"), 3);
			}
			
			// Living Story subscription comes after
			if (T.isDashboardStoryEnabled)
			{
				if (pMinutes === minutestill && wantls)
				{
					D.speak(D.getSpeech("event", "subscribed") + " " + D.getChainPronunciation(chainls), wait);
					D.speak(D.getSpeech("will start") + T.getTimeTillChainFormatted(chainls, "speech"), 3);
				}
			}
		}
	},

	/*
	 * The megaserver world bosses are spaced by 15 minutes between chain starts
	 * beginning at the hour, so time calculation can be conveniently spaced into
	 * the four quadrants of an analog clock. Most chains last much shorter than that.
	 * Q1: X:00-X:15 (or 12-3 o'clock)
	 * Q2: X:15-X:30 (or 3-6 o'clock)
	 * Q3: X:30-X:45 (or 6-9 o'clock)
	 * Q4: X:45-X:00 (or 9-12 o'clock)
	 * @param Date pTime to determine the current timeframe.
	 */
	updateTimeFrame: function(pDate)
	{
		// Check if server reset happened
		O.checkResetTimestamp(pDate);
		
		// Remember current chain to reference variable
		C.CurrentChainSD = T.getStandardChain();
		C.NextChainSD1 = T.getStandardChain(1);
		C.NextChainSD2 = T.getStandardChain(2);
		C.NextChainSD3 = T.getStandardChain(3);
		C.NextChainSD4 = T.getStandardChain(4);
		C.CurrentChainsSD = [C.CurrentChainSD, C.NextChainSD1, C.NextChainSD2, C.NextChainSD3];
		
		C.CurrentChainHC = T.getHardcoreChain();
		C.NextChainHC1 = T.getHardcoreChain(1);
		C.NextChainHC2 = T.getHardcoreChain(2);
		C.NextChainHC3 = T.getHardcoreChain(3);
		C.NextChainHC4 = T.getHardcoreChain(4);
		
		if (T.isDashboardStoryEnabled)
		{
			// These are for subscription alarm reference
			C.NextChainLS1 = T.getLivingStoryChain(1);
			C.NextChainLS2 = T.getLivingStoryChain(2);
		}
		
		C.PreviousChains2 = T.getTimeframeChains(-2);
		C.PreviousChains1 = T.getTimeframeChains(-1);
		C.CurrentChains = T.getTimeframeChains();
		C.NextChains1 = T.getTimeframeChains(1);
		
		// Sort the chains list
		C.sortChainsListHTML();
		// Initialize today's chain shortcut object
		C.updateChainToday();
		
		// Queue the highlighting of the current chain's events
		C.CurrentChains.forEach(C.queueEventsHighlight);
		
		// Update board in simple mode
		if (I.ModeCurrent === I.ModeEnum.Simple)
		{
			$("#itemSimpleCurrentSD").text(D.getObjectName(C.CurrentChainSD));
			$("#itemSimpleNextSD").text(D.getObjectName(C.NextChainSD1));
			$("#itemSimpleCurrentHC").text("");
			$("#itemSimpleNextHC").text("");
			if (C.CurrentChainHC || C.NextChainHC1)
			{
				$("#itemSimpleHC").show();
				if (C.CurrentChainHC)
				{
					$("#itemSimpleCurrentHC").text(D.getObjectName(C.CurrentChainHC));
				}
				if (C.NextChainHC1)
				{
					$("#itemSimpleNextHC").text(D.getObjectName(C.NextChainHC1));
				}
			}
			else
			{
				$("#itemSimpleHC").hide();
			}
		}
		
		// Alert current chain
		if (O.Options.int_setAlarm === O.IntEnum.Alarm.Checklist && O.Options.bol_alertAtEnd)
		{
			var checked = ", " + D.getSpeech("checked");
			var checkedcurrentsd = "";
			var checkednextsd = "";
			var checkedcurrenthc = "";
			var checkednexthc = "";
			var wantcurrentsd = O.objToBool(C.CurrentChainSD);
			var wantcurrenthc = O.objToBool(C.CurrentChainHC);
			var wantnextsd = O.objToBool(C.NextChainSD1);
			var wantnexthc = O.objToBool(C.NextChainHC1);
			var speech = D.getSpeech("world boss", "current") + " " + D.getSpeech("is") + " ";
			
			if (C.CurrentChainSD && ( ! C.isChainUnchecked(C.CurrentChainSD)))
			{
				checkedcurrentsd = checked;
			}
			if (C.CurrentChainHC && ( ! C.isChainUnchecked(C.CurrentChainHC)))
			{
				checkedcurrenthc = checked;
			}
			if (C.NextChainSD1 && ( ! C.isChainUnchecked(C.NextChainSD1)))
			{
				checkednextsd = checked;
			}
			if (C.NextChainHC1 && ( ! C.isChainUnchecked(C.NextChainHC1)))
			{
				checkednexthc = checked;
			}
			// Don't alert if current boss is checked off and user opted not to hear
			if (O.Options.bol_alertChecked === false)
			{
				if (checkedcurrentsd.length > 0) { wantcurrentsd = false; }
				if (checkedcurrenthc.length > 0) { wantcurrenthc = false; }
				if (checkednextsd.length > 0) { wantnextsd = false; }
				if (checkednexthc.length > 0) { wantnexthc = false; }
			}
			
			// Announce current bosses
			if (wantcurrentsd && wantcurrenthc)
			{
				D.speak(speech + D.getChainPronunciation(C.CurrentChainSD) + checkedcurrentsd, 5);
				D.speak(D.getSpeech("and") + ", " + D.getChainPronunciation(C.CurrentChainHC) + checkedcurrenthc, 4);
			}
			else if (wantcurrentsd)
			{
				D.speak(speech + D.getChainPronunciation(C.CurrentChainSD) + checkedcurrentsd, 5);
			}
			else if (wantcurrenthc)
			{
				D.speak(speech + D.getChainPronunciation(C.CurrentChainHC) + checkedcurrenthc, 5);
			}
			
			// Announce next bosses only if the current has been announced too
			if (wantcurrentsd || wantcurrenthc)
			{
				if (wantnextsd && wantnexthc)
				{
					D.speak(D.getSpeech("then") + ", " + D.getChainPronunciation(C.NextChainSD1) + checkednextsd, 4);
					D.speak(D.getSpeech("and") + ", " + D.getChainPronunciation(C.NextChainHC1) + checkednexthc, 4);
				}
				else if (wantnextsd)
				{
					D.speak(D.getSpeech("then") + ", " + D.getChainPronunciation(C.NextChainSD1) + checkednextsd, 4);
				}
				else if (wantnexthc)
				{
					D.speak(D.getSpeech("then") + ", " + D.getChainPronunciation(C.NextChainHC1) + checkednexthc, 4);
				}
			}
		}
		
		var sec = pDate.getSeconds();
		var min = pDate.getMinutes();
		var secinhour = min*60 + sec;
		// Blacken all markers
		$("#clkMarkers line").each(function()
		{
			$(this).attr("stroke", "black");
		});
		$("#paneClockIcons .iconSD").removeClass("clkIconCurrent clkIconNext");
		$("#paneClockIcons .iconHC").removeClass("clkIconCurrent clkIconNext");
		
		// Macro function for the following conditionals
		var repositionMarkers = function(pMarkerStart, pMarker0A, pMarker0B, pMarkerNext,
			pMarker1A, pMarker1B, pMarker2A, pMarker2B, pMarker3A, pMarker3B,
			pOffsetMark0, pOffsetMark1, pOffsetMark2, pOffsetMark3)
		{
			// Highlight active chain icon
			$([K.IconSD0, K.IconHC0]).each(function()
			{
				$(this).addClass("clkIconCurrent");
			});
			$([K.IconSD1, K.IconHC1]).each(function()
			{
				$(this).addClass("clkIconNext");
			});
			
			// Update chain markers
			K.setMarkerAngle(pMarker0A, C.CurrentChainSD.minFinish + pOffsetMark0);
			K.setMarkerAngle(pMarker0B, C.CurrentChainSD.avgFinish + pOffsetMark0);
			K.setMarkerAngle(pMarker1A, C.NextChainSD1.minFinish + pOffsetMark1);
			K.setMarkerAngle(pMarker1B, C.NextChainSD1.avgFinish + pOffsetMark1);
			K.setMarkerAngle(pMarker2A, C.NextChainSD2.minFinish + pOffsetMark2);
			K.setMarkerAngle(pMarker2B, C.NextChainSD2.avgFinish + pOffsetMark2);
			K.setMarkerAngle(pMarker3A, C.NextChainSD3.minFinish + pOffsetMark3);
			K.setMarkerAngle(pMarker3B, C.NextChainSD3.avgFinish + pOffsetMark3);
			// Update chain icons, fade if checked off
			var restyleIcon = function(pChain, pIcon)
			{
				if (pChain)
				{
					pIcon.show();
					pIcon.attr("src", "img/chain/" + pChain.alias.toLowerCase() + I.cPNG);
					pIcon.data(C.cIndexSynonym, pChain.nexus);
					if (I.ModeCurrent === I.ModeEnum.Simple)
					{
						pIcon.attr("title", D.getObjectName(pChain));
						I.qTip.init(pIcon);
					}

					if (X.getChainChecklistState(pChain) !== X.ChecklistEnum.Unchecked)
					{
						pIcon.css({opacity: K.iconOpacityChecked});
					}
					else
					{
						pIcon.css({opacity: 1});
					}
				}
				else
				{
					// Don't show icon if hardcore boss is not scheduled at that timeframe
					pIcon.hide();
				}
			};
			restyleIcon(C.CurrentChainSD, K.IconSD0);
			restyleIcon(C.NextChainSD1, K.IconSD1);
			restyleIcon(C.NextChainSD2, K.IconSD2);
			restyleIcon(C.NextChainSD3, K.IconSD3);
			restyleIcon(C.CurrentChainHC, K.IconHC0);
			restyleIcon(C.NextChainHC1, K.IconHC1);
			restyleIcon(C.NextChainHC2, K.IconHC2);
			restyleIcon(C.NextChainHC3, K.IconHC3);
			// Colorize the active chain's markers
			$(pMarkerStart).attr("stroke", "lime");
			$(pMarker0A).attr("stroke", "orange");
			$(pMarker0B).attr("stroke", "red");
			$(pMarkerNext).attr("stroke", "green");
		};
		
		// Macro function for styling various clock pane elements
		var restyleClock = function(pTimeframeMark)
		{
			var i0, i1, i2, i3;
			switch (pTimeframeMark)
			{
				case T.cSECS_MARK_0: { i0 = "0"; i1 = "1"; i2 = "2"; i3 = "3"; } break;
				case T.cSECS_MARK_1: { i0 = "1"; i1 = "2"; i2 = "3"; i3 = "0"; } break;
				case T.cSECS_MARK_2: { i0 = "2"; i1 = "3"; i2 = "0"; i3 = "1"; } break;
				case T.cSECS_MARK_3: { i0 = "3"; i1 = "0"; i2 = "1"; i3 = "2"; } break;
			}
			K.currentFrameOffsetMinutes = pTimeframeMark;

			K.WpChain0 = $("#clkWaypoint" + i0); K.IconSD0 = $("#clkIconSD" + i0);
			K.WpChain1 = $("#clkWaypoint" + i1); K.IconSD1 = $("#clkIconSD" + i1);
			K.WpChain2 = $("#clkWaypoint" + i2); K.IconSD2 = $("#clkIconSD" + i2);
			K.WpChain3 = $("#clkWaypoint" + i3); K.IconSD3 = $("#clkIconSD" + i3);
			K.IconHC0 = $("#clkIconHC" + i0);
			K.IconHC1 = $("#clkIconHC" + i1);
			K.IconHC2 = $("#clkIconHC" + i2);
			K.IconHC3 = $("#clkIconHC" + i3);
			
			C.showChainDailyIcon();
			
			repositionMarkers(
				$("#clkMarker" + i0), $("#clkMarker" + i0 + "A"), $("#clkMarker" + i0 + "B"),
				$("#clkMarker" + i1), $("#clkMarker" + i1 + "A"), $("#clkMarker" + i1 + "B"),
				$("#clkMarker" + i2 + "A"), $("#clkMarker" + i2 + "B"),
				$("#clkMarker" + i3 + "A"), $("#clkMarker" + i3 + "B"),
				T["cSECS_MARK_" + i0], T["cSECS_MARK_" + i1], T["cSECS_MARK_" + i2], T["cSECS_MARK_" + i3]
			);
	
			// Animate quadrant rotation
			var quad = document.getElementById("clkQuadrant");
			var newquadangle = parseInt(i0) * K.cDEGREES_IN_QUADRANT;
			if (newquadangle === 0 && K.oldQuadrantAngle !== 0)
			{
				newquadangle = K.cDEGREES_IN_CIRCLE;
			}
			
			$({angle: K.oldQuadrantAngle}).animate({angle: newquadangle}, {
				duration: 600,
				step: function() { K.rotateClockElement(quad, this.angle); },
				done: function() { K.rotateClockElement(quad, newquadangle); }
			});
			
			if (newquadangle === K.cDEGREES_IN_CIRCLE)
			{
				newquadangle = 0;
			}
			K.oldQuadrantAngle = newquadangle;
		};
		
		// Recolor the active event's markers and rotate clock quadrant
		// Note that clock elements' IDs are suffixed with numbers 0-3 for easy iteration
		if (secinhour >= T.cSECS_MARK_0 && secinhour < T.cSECS_MARK_1)
		{
			restyleClock(T.cSECS_MARK_0);
		}
		else if (secinhour >= T.cSECS_MARK_1 && secinhour < T.cSECS_MARK_2)
		{
			restyleClock(T.cSECS_MARK_1);
		}
		else if (secinhour >= T.cSECS_MARK_2 && secinhour < T.cSECS_MARK_3)
		{
			restyleClock(T.cSECS_MARK_2);
		}
		else if (secinhour >= T.cSECS_MARK_3 && secinhour <= T.cSECS_MARK_4)
		{
			restyleClock(T.cSECS_MARK_3);
		}
		
		// Refresh waypoints because the icon's clock position changed
		K.updateWaypointsClipboard();
		K.updateDryTopClipboard();
		K.initializeClockItems();
	},

	/*
	 * Initializes the array containing Zero Clipboard objects.
	 * Each clock waypoint icon (4 img tags) will have the data attribute set to
	 * a waypoint text by the time updater.
	 */
	initializeClipboard: function()
	{
		ZeroClipboard.config({swfPath: "bin/ZeroClipboard.swf"});
		for (var i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
		{
			K.wpClipboards.push
			(
				new ZeroClipboard(document.getElementById("clkWaypoint" + i))
			);
			/*
			 * Zero Clipboard works by superimposing an invisible Flash object 
			 * over the target (the waypoint icons). When a user click on it the
			 * data attribute of the target is loaded to the user's clipboard.
			 * The code below are additional stuff to execute after.
			 */
			K.wpClipboards[i].on("aftercopy", function(pEvent)
			{
				I.write(K.cZeroClipboardSuccessText + pEvent.data["text/plain"], 5);
			});
		}
		
		if (C.DryTopChains.length > 0)
		{
			for (var i = 0; i < 2; i++)
			{
				K.lsClipboards.push
				(
					new ZeroClipboard(document.getElementById("chnDryTopWaypoint" + i))
				);
				K.lsClipboards[i].on("aftercopy", function(pEvent)
				{
					I.write(K.cZeroClipboardSuccessText + pEvent.data["text/plain"], 5);
				});
			}
		}
	},
	
	/*
	 * Updates the daytime icon based on current game daylight.
	 */
	updateDaytimeIcon: function()
	{
		var symbol = (T.isDaylight()) ? I.Symbol.Day : I.Symbol.Night;
		K.currentDaytimeSymbol = symbol;
		$("#itemTimeDayIcon").text(symbol);
	},
	
	/*
	 * Updates the digital clock with minutely information.
	 */
	updateDigitalClockMinutely: function()
	{
		// Daytime clock updates time remaining
		var daytime = T.getDayPeriodRemaining();
		K.timeDaytime.innerHTML = daytime;
		// Clock on the map shown in overlay mode
		K.timeMap.innerHTML = T.getTimeFormatted({wantSeconds: false}) + " " + K.currentDaytimeSymbol + daytime;
		// Local clock updates additional times in tooltip
		K.timeLocal.title =
			(new Date()).toLocaleString() + "<br />" +
			"<dfn>Anet:</dfn> " + T.getTimeFormatted(
			{
				reference: T.ReferenceEnum.Server,
				wantSeconds: false
			}) + "<br />" +
			"<dfn>UTC:</dfn> " + T.getTimeFormatted(
			{
				reference: T.ReferenceEnum.UTC,
				wantSeconds: false,
				want24: true
			}) + "<br />" +
			"<dfn>Reset:</dfn> " + T.getTimeFormatted(
			{
				customTimeInSeconds: T.SECONDS_TILL_RESET, wantSeconds: false, wantLetters: true
			});
		I.qTip.init(K.timeLocal);
	},
	
	/*
	 * Updates waypoint icons' copy text.
	 * @pre The waypoint icon's position on the clock was updated.
	 * Standard bosses' schedule does not have gaps, hardcore may have gaps.
	 */
	updateWaypointsClipboard: function()
	{
		var updateWaypoint = function(pWaypoint, pChainSD, pChainHC, pChainSDAfter, pChainHCAfter)
		{
			var text = "";
			
			// Chains for the clicked timeframe
			text += pChainSD.waypoint + " " + D.getChainAlias(pChainSD);
			// If hardcore chain doesn't exist or is Triple Wurm
			if ( ! pChainHC || pChainHC.nexus === C.Triple.nexus)
			{
				text += T.getTimeTillChainFormatted(pChainSD);
			}
			else if (pChainHC.nexus !== C.Triple.nexus)
			{
				text += " " + D.getTranslation("and") + " " + pChainHC.waypoint
					+ " " + D.getChainAlias(pChainHC)
					+ T.getTimeTillChainFormatted(pChainHC);
			}
			
			// Chains for the timeframe after that
			text += ", " + D.getTranslation("then") + " " + pChainSDAfter.waypoint
				+ " " + D.getChainAlias(pChainSDAfter);
			if ( ! pChainHCAfter || pChainHCAfter.nexus === C.Triple.nexus)
			{
				text += T.getTimeTillChainFormatted(pChainSDAfter);
			}
			else if (pChainHCAfter.nexus !== C.Triple.nexus)
			{
				text += " " + D.getTranslation("and") + " " + pChainHCAfter.waypoint
					+ " " + D.getChainAlias(pChainHCAfter)
					+ T.getTimeTillChainFormatted(pChainHCAfter);
			}
			
			text = text + I.siteTagCurrent;
			pWaypoint.attr(K.cZeroClipboardDataAttribute, text);
		};
		
		updateWaypoint(K.WpChain0, C.CurrentChainSD, C.CurrentChainHC, C.NextChainSD1, C.NextChainHC1);
		updateWaypoint(K.WpChain1, C.NextChainSD1, C.NextChainHC1, C.NextChainSD2, C.NextChainHC2);
		updateWaypoint(K.WpChain2, C.NextChainSD2, C.NextChainHC2, C.NextChainSD3, C.NextChainHC3);
		updateWaypoint(K.WpChain3, C.NextChainSD3, C.NextChainHC3, C.NextChainSD4, C.NextChainHC4);
	},
	
	/*
	 * Updates the current and next Dry Top events icons' clipboard text.
	 */
	updateDryTopClipboard: function()
	{
		if (C.isDryTopIconsShown)
		{
			var s0 = T.getCurrentDryTopEvents();
			var s1 = T.getCurrentDryTopEvents(1);
			document.getElementById("chnDryTopWaypoint0")
				.setAttribute(K.cZeroClipboardDataAttribute, s0);
			document.getElementById("chnDryTopWaypoint1")
				.setAttribute(K.cZeroClipboardDataAttribute, s1);
			$("#mapDryTopClip0").val(s0);
			$("#mapDryTopClip1").val(s1);
		}
	}
};

/* =============================================================================
 * @@Interface HTML and CSS content manipulation
 * ========================================================================== */
I = {
	
	cSiteName: "GW2Timer.com",
	cSiteURL: "http://gw2timer.com/",
	cImageHost: "http://i.imgur.com/",
	cGameName: "Guild Wars 2",
	cGameNick: "GW2",
	cPNG: ".png", // Almost all used images are PNG
	cThrobber: "<div class='itemThrobber'><em></em></div>",
	cTextDelimiterChar: "|",
	cTextDelimiterRegex: /[|]/g,
	consoleTimeout: {},
	siteTagDefault: " - gw2timer.com",
	siteTagCurrent: " - gw2timer.com",
	Symbol:
	{
		Day: "☀",
		Night: "☽",
		Expand: "[+]",
		Collapse: "[−]",
		Help: "[?]"
	},
	
	// HTML/CSS pixel units
	cPANEL_WIDTH: 360,
	cPANEL_HEIGHT_MIN: 220,
	cPANE_CLOCK_HEIGHT: 360,
	cPANE_CLOCK_HEIGHT_COMPACT: 220,
	cPANE_CLOCK_HEIGHT_BAR: 85,
	cPANE_MENU_HEIGHT: 48,
	cTOOLTIP_WIDTH_MAX: 360,
	cTOOLTIP_OVERFLOW_WIDTH: 240,
	cTOOLTIP_OVERFLOW_MAX: 10,
	cTOOLTIP_DEFAULT_OFFSET_X: -180,
	cTOOLTIP_DEFAULT_OFFSET_Y: 30,
	cTOOLTIP_ALTERNATE_OFFSET_X: 24,
	cTOOLTIP_ADD_OFFSET_Y: 42,
	cTOOLTIP_ADD_OFFSET_X: 36,
	cTOOLTIP_MOUSEMOVE_RATE: 20,
	CLOCK_AND_MENU_HEIGHT: 0,
	posX: 0, // Mouse position
	posY: 0,
	
	// Content-Plate-Page and Section-Header
	isMouseOnPanel: false,
	isProgramLoaded: false,
	isProgramEmbedded: false,
	isMapEnabled: true,
	isScrollEnabled: false,
	isSpeechSynthesisEnabled: false,
	ModeCurrent: null,
	ModeEnum:
	{
		Website: "Website",
		Mobile: "Mobile",
		Simple: "Simple",
		Tile: "Tile",
		Overlay: "Overlay"
	},
	cPagePrefix: "#plate",
	cMenuPrefix: "#menu",
	PageCurrent: "",
	PagePrevious: "",
	PageEnum:
	{
		// These are the X in "menuX" and "plateX" IDs in the HTML
		Chains: "Chains",
		Map: "Map",
		Help: "Help",
		Options: "Options"
	},
	SpecialPageEnum:
	{
		WvW: "WvW",
		DryTop: "DryTop"
	},
	// Section names must be unique, and may either be in sentence case or all caps
	SectionEnum:
	{
		Chains:
		{
			DryTop: "DryTop",
			Timetable: "Timetable"
		},
		Map:
		{
			Daily: "Daily",
			Resource: "Resource",
			JP: "JP",
			Collectible: "Collectible",
			Guild: "Guild",
			TP: "TP",
			Notepad: "Notepad",
			Personal: "Personal"
		},
		Help:
		{
			FAQ: "FAQ",
			About: "About",
			Embed: "Embed",
			Scheduled: "Scheduled",
			Legacy: "Legacy",
			Temples: "Temples",
			Dungeons: "Dungeons"
		}
	},
	MapEnum:
	{
		Tyria: "map",
		Mists: "wvw"
	},
	MapCurrent: 0,
	/*
	 * Number used to open a section's subcontent, written as 1-indexed via
	 * query string, but used as 0-indexed.
	 */
	ArticleCurrent: null,
	contentCurrentPlate: "", // This is cContentPrefix + contentCurrent
	isContentLoaded_Map: false,
	isContentLoaded_Help: false,
	isSectionLoaded_Daily: false,
	sectionPrefix: "sectionCurrent_",
	cHeaderPrefix: "#header",
	
	// User information
	BrowserCurrent: "Unknown",
	BrowserEnum:
	{
		IE: 0,
		Opera: 1,
		Firefox: 2,
		Chrome: 3
	},
	isOnSmallDevice: false,
	isOnBigDevice: false,
	cSMALL_DEVICE_WIDTH: 800,
	cSMALL_DEVICE_HEIGHT: 600,
	cBIG_DISPLAY_HEIGHT: 1200,
	
	/*
	 * Does things that need to be done before everything else.
	 * @pre This function is ran before any initialization functions.
	 */
	initializeFirst: function()
	{
		// Manually clear the TTS iframe to prevent old sound from playing
		D.stopSpeech();

		// Detect iFrame embedding
		if (window !== window.top)
		{
			I.isProgramEmbedded = true;
		}
		
		// Get URL arguments and do appropriate changes
		U.enforceURLArgumentsFirst();
		I.enforceProgramMode();
		
		// Tell if DST is in effect
		T.checkDST();
		// If user lives in the Americas then use AM/PM time format by default
		T.cUTC_OFFSET_USER = -((new Date()).getTimezoneOffset() / T.cMINUTES_IN_HOUR);
		if (T.cUTC_OFFSET_USER <= T.cUTC_OFFSET_EASTERN
			&& T.cUTC_OFFSET_USER >= T.cUTC_OFFSET_HAWAII)
		{
			O.Options.bol_use24Hour = false;
		}
		
		/*
		 * Load stored server sensitive timestamp if it exists, is a number,
		 * and not from the future, else initialize it.
		 */ 
		var currenttimestamp = T.getUNIXSeconds();
		var storedtimestamp = parseInt(localStorage[O.Utilities.lastLocalResetTimestamp.key]);
		if (localStorage[O.Utilities.lastLocalResetTimestamp.key] === undefined
			|| isFinite(storedtimestamp) === false
			|| storedtimestamp > currenttimestamp)
		{
			O.Utilities.lastLocalResetTimestamp.value = currenttimestamp;
			localStorage[O.Utilities.lastLocalResetTimestamp.key] = O.Utilities.lastLocalResetTimestamp.value;
		}
		else
		{
			O.Utilities.lastLocalResetTimestamp.value = storedtimestamp;
		}
		
		// Initial sync of the sleep detection variable
		K.awakeTimestampPrevious = currenttimestamp;
		
		// Detect small devices
		if (screen.width <= I.cSMALL_DEVICE_WIDTH && screen.height <= I.cSMALL_DEVICE_HEIGHT
			&& I.ModeCurrent === I.ModeEnum.Website)
		{
			I.isOnSmallDevice = true;
		}
		// Detect big displays
		if (window.innerHeight > I.cBIG_DISPLAY_HEIGHT)
		{
			I.isOnBigDevice = true;
		}
		
		// Remember user's browser maker
		var useragent = navigator.userAgent;
		if (useragent.indexOf("MSIE") !== -1 || useragent.indexOf("Trident") !== -1)
		{
			I.BrowserCurrent = I.BrowserEnum.IE;
		}
		else if (useragent.indexOf("Chrome") !== -1)
		{
			I.BrowserCurrent = I.BrowserEnum.Chrome;
			I.isSpeechSynthesisEnabled = true;
		}
		else if (useragent.indexOf("Firefox") !== -1)
		{
			I.BrowserCurrent = I.BrowserEnum.Firefox;
		}
		else if (useragent.indexOf("Opera") !== -1)
		{
			I.BrowserCurrent = I.BrowserEnum.Opera;
		}
		
		// Add throbber to AJAX loaded pages
		$("#plateMap, #plateWvW, #plateHelp").each(function()
		{
			$(this).append(I.cThrobber);
		});
		I.qTip.start();
		
		// Default content plate
		I.PageCurrent = I.PageEnum.Chains;
	},
	
	/*
	 * Does things that need to be done after everything was initially loaded
	 * (does not count AJAX loaded content).
	 */
	initializeLast: function()
	{
		// Initializes all UI
		I.initializeTooltip();
		I.bindHelpButtons("#plateOptions");
		I.initializeUIforMenu();
		I.initializeUIForHUD();
		I.styleContextMenu("#ctxMap");
		// Bind switch map buttons
		$("#mapSwitchButton").one("click", function()
		{
			$.getScript(U.URL_DATA.WvW).done(function()
			{
				W.initializeWvW();
			});
		}).click(function()
		{
			I.toggleMap(I.MapEnum.Mists);
		});
		$("#wvwSwitchButton").click(function()
		{
			I.toggleMap(I.MapEnum.Tyria);
		});
		
		// Do special commands from the URL
		U.enforceURLArgumentsLast();
		// Open Chains section if on that page
		if (I.PageCurrent === I.PageEnum.Chains)
		{
			U.openSectionFromURL();
		}
		
		// Clear the non-load warning after everything succeeded
		$("#itemWarning").remove();
		// Bind console buttons
		$("#cslClose").click(function()
		{
			I.clear();
		});
		$("#cslSelect").click(function()
		{
			I.selectText("#cslContent");
		});
		$("#mapOptions, #wvwOptions, #mapGPS, #wvwGPS").one("mouseenter", function()
		{
			$(this).find("img").each(function()
			{
				$(this).attr("src", $(this).attr("data-src"));
			});
		});
		// Speaker icon click to preview audio
		$("#optAlarmSpeaker").click(function()
		{
			D.speak(D.getWord("alarm"));
		});
		$("#optMute").click(function()
		{
			D.stopSpeech();
		});
		$("#chnOptions").one("mouseover", function()
		{
			I.loadImg($(this));
		});
		U.convertExternalLink(".linkExternal");
		
		// Cursors on these Leaflet elements cause slowdown in IE, only add them for other browsers
		if (I.BrowserCurrent !== I.BrowserEnum.IE)
		{
			$("head").append("<style>.leaflet-clickable{cursor: url('img/cursor/pointer.cur'), pointer;}</style>");
		}
		
		// Bind special popup elements that can be removed if user clicks anywhere not on it
		$(document).mouseup(function(pEvent)
		{
			$(".jsRemovable, .jsHidable").each(function()
			{
				if ( ! $(this).is(pEvent.target) && $(this).has(pEvent.target).length === 0)
				{
					if ($(this).hasClass("jsHidable"))
					{
						$(this).hide();
					}
					if ($(this).hasClass("jsRemovable"))
					{
						$(this).remove();
					}
				}
			});
		});
		
		// The menu bar overlaps the language popup, so have to "raise" the clock pane
		$("#itemLanguage").hover(
			function() {$("#paneClock").css("z-index", 3);},
			function() {$("#paneClock").css("z-index", 1);}
		);

		// Initialize scroll bars for pre-loaded plates
		if (I.isMapEnabled)
		{
			I.initializeScrollbar("#cslContent, #plateChains, #plateOptions");
		}
		
		// Clean the localStorage of unrecognized variables
		O.cleanLocalStorage();
		
		// Update and notify user of version change
		O.enforceProgramVersion();
		
		// Post translations
		D.translateAfter();
		
		// View map event or map center
		if (P.wantZoomToFirstEvent())
		{
			$("#chnEvent_" + C.CurrentChainSD.nexus + "_"
				+ C.CurrentChainSD.CurrentPrimaryEvent.num).trigger("click");
		}
		else if (I.isMapEnabled)
		{
			M.goToDefault();
		}
		// Set tile after viewing the coordinate so it downloads the tiles last
		if (I.isMapEnabled)
		{
			M.changeFloor(O.Options.int_setFloor);
		}
		
		// Tells today's world boss closest scheduled time if server resetted
		if (O.isServerReset && C.ChainToday)
		{
			I.greet(D.getModifiedWord("boss", "daily", U.CaseEnum.Sentence) + " "
				+ D.getObjectName(C.ChainToday) + " " + D.getTranslation("will start") + " " + D.getTranslation("at") + " "
				+ T.getTimeFormatted(
				{
					wantSeconds: false,
					customTimeInSeconds: T.convertScheduleKeyToLocalSeconds(C.ChainToday.scheduleKeys[0])
				}) + " " + D.getTranslation("in") + " "
				+ T.getTimeFormatted(
				{
					wantLetters: true,
					wantSeconds: false,
					customTimeInSeconds: T.getSecondsUntilChainStarts(C.ChainToday)
				}),
			15);
		}
		
		// Finally
		I.isProgramLoaded = true;
	},
	
	/*
	 * Binds chains list expansion behavior.
	 */
	initializeChainsUI: function()
	{
		/*
		 * Chains list collapsible headers.
		 */
		$("#plateChains header").click(function()
		{
			var section = U.getSubstringFromHTMLID($(this));
			
			$(this).next().slideToggle("fast", function()
			{
				// Change the toggle icon after finish toggling
				if ($(this).is(":visible"))
				{
					// EXPANDED
					I.updateScrollbar();
					var container = $(I.cPagePrefix + I.PageEnum.Chains);
					var header = $(this).prev();
					header.find("kbd").html(I.Symbol.Collapse);
					// Automatically scroll to the clicked header
					I.scrollToElement(header, container, "fast");
					
					// Scroll the map to Dry Top if it is that chain list
					if ($(this).attr("id") === "sectionChains_Drytop")
					{
						M.goToZone("dry", M.ZoomEnum.Bird);
						I.PageCurrent = I.SpecialPageEnum.DryTop;
						U.updateTitle(I.SpecialPageEnum.DryTop);
						P.toggleDryTopIcons(true);
					}
					else
					{
						// Update current section variable
						I[I.sectionPrefix + I.PageEnum.Chains] = section;
					}
				}
				else
				{
					// COLLAPSED
					I.updateScrollbar();
					$(this).prev().find("kbd").html(I.Symbol.Expand);
					// Reset Dry Top page variable
					if ($(this).attr("id") === "sectionChains_Drytop")
					{
						I.PageCurrent = I.PageEnum.Chains;
						P.toggleDryTopIcons(false);
					}
					// Nullify current section variable
					I[I.sectionPrefix + I.PageEnum.Chains] = "";
				}
				U.updateQueryString();
			});
		});
		
		// Add collapse text icon to headers; first one is pre-expanded
		$("#plateChains header:not(:first)").each(function()
		{
			$(this).next().toggle(0);
			$(this).find("kbd").html(I.Symbol.Expand);
		});
		$("#plateChains header:first").each(function()
		{
			$(this).find("kbd").html(I.Symbol.Collapse);
		});

		// Create chain bars for unscheduled chains only when manually expanded the header
		if (I.ModeCurrent !== I.ModeEnum.Tile)
		{
			$("#headerChains_Drytop").one("click", function()
			{
				P.generateDryTop();
			});
		}
		else
		{
			$("#headerChains_Drytop").hide();
		}
		$("#headerChains_Legacy").one("click", function()
		{
			C.LegacyChains.forEach(C.initializeChain);
			C.LegacyChains.forEach(P.drawChainPaths);
			I.readjustTile();
		});
		$("#headerChains_Temple").one("click", function()
		{
			C.TempleChains.forEach(C.initializeChain);
			C.TempleChains.forEach(P.drawChainPaths);
			I.readjustTile();
		});

		// Generate a full timetable of the chains when clicked on that header
		$("#headerChains_Timetable").one("click", function(){
			C.isTimetableGenerated = true;
			C.initializeTimetableHTML();
			I.readjustTile();
		});
		I.readjustTile();
	},
	
	/*
	 * Writes an HTML string to the "console" area in the top left corner of
	 * the website that disappears after a while.
	 * @param string pString to write.
	 * @param float pSeconds to display the console with that string.
	 * @param boolean pClear to empty the console before printing.
	 * @pre If input was from an outside source it must be escaped first!
	 */
	write: function(pString, pSeconds, pClear)
	{
		$("#itemConsole").show();
		var content = $("#cslContent");
		var characterspersecond = 18;
		
		if (pString === undefined || pString === null)
		{
			pString = "emptystring";
		}
		else
		{
			pString = pString.toString();
		}
		if (pClear === undefined)
		{
			pClear = false;
		}
		if (pClear === true)
		{
			content.empty();
		}
		if (isFinite(pSeconds) === false)
		{
			/*
			 * If seconds to display was not specified, set display time
			 * based on how long the string is.
			 */
			pSeconds = 3 + parseInt(pString.length / characterspersecond);
		}
		content.append(pString + "<br />");
		I.updateScrollbar(content);
		
		// Ignore previous display time, which is how long before the console is cleared
		window.clearTimeout(I.consoleTimeout);
		I.consoleTimeout = setTimeout(function()
		{
			content.css({opacity: 1}).animate({opacity: 0}, 600, function()
			{
				$(this).empty().css({opacity: 1});
				$("#itemConsole").hide();
			});
		}, pSeconds * T.cMILLISECONDS_IN_SECOND);
	},
	greet: function(pString, pSeconds, pClear)
	{
		// For messages that are shown when the program has just loaded
		if (I.isProgramEmbedded === false)
		{
			I.write(pString, pSeconds, pClear);
		}
	},
	
	/*
	 * Clears the console of all previous text.
	 */
	clear: function()
	{
		window.clearTimeout(I.consoleTimeout);
		$("#itemConsole").hide();
		$("#cslContent").empty();
	},
	
	/*
	 * Alternative for I.write but used for testing and easier to find and remove.
	 */
	log: function(pString, pSeconds, pClear)
	{
		I.write(pString, pSeconds || 30, pClear);
	},
	
	/*
	 * Selects text from an element (as if the user clicked on text and dragged
	 * mouse to select text).
	 * @param string pSelector DOM to get the element with text.
	 */
	selectText: function(pSelector)
	{
		var element = document.querySelector(pSelector);
		var selection = window.getSelection();
		var range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	},
	
	/*
	 * Scrolls to an element at specified rate.
	 * @param jqobject pElement to scroll to.
	 * @param jqobject pContainerOfElement container with the scroll bar.
	 * @param int or string pTime duration to animate.
	 */
	scrollToElement: function(pElement, pContainerOfElement, pTime)
	{
		// Mobile mode webpage height is dynamic
		switch (I.ModeCurrent)
		{
			case I.ModeEnum.Mobile: {
				$("body").scrollTop(pElement.offset().top);
			} break;
			
			case I.ModeEnum.Tile: {
				$("#windowMain").animate(
				{
					scrollTop: pElement.offset().top - $("#windowMain").offset().top
						+ $("#windowMain").scrollTop()
				}, pTime || 0);
			} break;
			
			default: {
				if (pContainerOfElement)
				{
					pContainerOfElement.animate(
					{
						scrollTop: pElement.offset().top - pContainerOfElement.offset().top
							+ pContainerOfElement.scrollTop()
					}, pTime || 0);
				}
				else
				{
					// Scroll to top of element without animation
					pElement.scrollTop(0);
				}
			}
		}
	},
	
	/*
	 * Animates multiple elements simultaneously.
	 * @param array pRequests array of objects.
	 *	@objparam string s selector for elements.
	 *	@objparam object p properties to animate.
	 * @param int pSpeed of animation.
	 */
	bulkAnimate: function(pRequests, pSpeed)
	{
		for (var i in pRequests)
		{
			var r = pRequests[i];
			$(r.s).animate(r.p, {duration: pSpeed, queue: false});
		}
	},
	
	/*
	 * Toggles a generic highlight class to an element.
	 * @param jqobject pElement to toggle.
	 * @param boolean pBoolean manual.
	 * @returns boolean new highlight state.
	 */
	toggleHighlight: function(pElement, pBoolean)
	{
		if (pBoolean === undefined)
		{
			// Toggle
			if (pElement.hasClass("cssHighlight"))
			{
				pElement.removeClass("cssHighlight");
				return false;
			}
			else
			{
				pElement.addClass("cssHighlight");
				return true;
			}
		}
		else
		{
			// Use boolean
			if (pBoolean)
			{
				pElement.addClass("cssHighlight");
				return true;
			}
			else
			{
				pElement.removeClass("cssHighlight");
				return false;
			}
		}
	},
	
	/*
	 * Styles and translates a custom context menu.
	 * @param string pMenu name of the menu.
	 */
	styleContextMenu: function(pMenu)
	{
		$(pMenu).addClass("jsHidable").find("li").each(function()
		{
			if (O.Options.enu_Language !== O.OptionEnum.Language.Default)
			{
				$(this).text(D.getPhraseOriginal($(this).text()));
			}
			$(this).prepend("<ins class='s16 s16_bullet'></ins> ");
		});
	},
	
	/*
	 * Initializes custom scroll bar for specified element using defined settings.
	 * @param jqobject pElement to initialize.
	 */
	initializeScrollbar: function(pSelector)
	{
		if (I.isScrollEnabled === false)
		{
			try
			{
				var wheelspeed = 1;
				switch (I.BrowserCurrent)
				{
					case I.BrowserEnum.Opera: wheelspeed = 5; break;
					case I.BrowserEnum.Firefox: wheelspeed = 3; break;
				}

				$(pSelector).perfectScrollbar({
					wheelSpeed: wheelspeed,
					suppressScrollX: true
				});
			}
			catch (e) {}
		}
	},
	updateScrollbar: function(pSelector)
	{
		if (I.isScrollEnabled === false)
		{
			if (I.isMapEnabled)
			{
				try
				{
					// Update the pages if element is not specified
					if (pSelector === undefined)
					{
						$("#plateMap").perfectScrollbar("update");
						$("#plateChains").perfectScrollbar("update");
						$("#plateHelp").perfectScrollbar("update");
						$("#plateOptions").perfectScrollbar("update");
					}
					else
					{
						$(pSelector).perfectScrollbar("update");
					}
				}
				catch (e) {}
			}
			else
			{
				$("#windowMain").perfectScrollbar("update");
			}
		}
	},
	
	/*
	 * Binds headers with the jsSection class to toggle display of its sibling
	 * container element. Creates a submenu as an alternate for clicking
	 * the headers; also creates another button-like text at the bottom of the
	 * container to collapse it again.
	 * Example: <header class="jsSection">Example Title</header><div></div>
	 * That container div should contain everything that needs to be collapsed/expanded
	 * by clicking that header tag.
	 * @param string pPlate HTML ID of plate in the content pane.
	 */
	generateSectionMenu: function(pPlate)
	{
		// Don't bind unless there exists
		if ($(pPlate + " header.jsSection").length <= 0)
		{
			return;
		}
		
		var plate = pPlate.substring(I.cPagePrefix.length, pPlate.length);
		var beamid = "menuBeam_" + plate;
		var beamcontainer = $("<div class='menuBeamContainer'></div>").prependTo(pPlate);
		var menubeam = $("<div class='menuBeam' id='" + beamid + "'></div>").prependTo(beamcontainer);
		
		$(pPlate + " header.jsSection").each(function()
		{
			var header = $(this);
			var headercontent = $(this).children("var").first();
			// Translate header if available
			var headertext = headercontent.data(O.Options.enu_Language) || header.text();
			headercontent.text(headertext);
			// Hide the entire collapsible div tag next to the header tag
			header.next().hide();
			header.wrapInner("<span></span>");
			header.append("<sup>" + I.Symbol.Expand + "</sup>");
			
			// Bind click the header to toggle the sibling collapsible container
			header.click(function()
			{
				var istobeexpanded = false;
				var section = U.getSubstringFromHTMLID($(this));
				$(pPlate + " .menuBeamIcon").removeClass("menuBeamIconActive");
				
				if ($(this).next().is(":visible"))
				{
					// TO BE COLLAPSED
					$(this).children("sup").text(I.Symbol.Expand);
					
					I.displaySectionMarkers(section, false); // Hide this section's map icons
					I[I.sectionPrefix + plate] = ""; // Nullify current section variable
					
					// Show all headers again
					$(pPlate + " header.jsSection").show();
					$(pPlate + " header.cntHeader").show();
				}
				else
				{
					// TO BE EXPANDED
					istobeexpanded = true;
					$(this).children("sup").text(I.Symbol.Collapse);
					$(pPlate + " .menuBeamIcon[data-section='" + section + "']")
						.addClass("menuBeamIconActive");
					
					I.displaySectionMarkers(section, true); // Show associated map icons
					I[I.sectionPrefix + plate] = section;
					
					// If clicked from beam menu then hide the other headers to save space
					if ($(this).data("beamclicked") === true)
					{
						$(pPlate + " header.jsSection").not(this).hide();
						$(pPlate + " header.cntHeader").hide();
						$(this).removeData("beamclicked");
					}
					// Default the map view if the header has this CSS class
					if ($(this).hasClass("jsMapDefault"))
					{
						M.goToDefault();
					}
				}
				U.updateQueryString();
				
				// Do the collapse/expand
				if ($(this).data("donotanimate") !== true)
				{
					if (I.ModeCurrent === I.ModeEnum.Website)
					{
						$(this).next().toggle("fast", function()
						{
							I.updateScrollbar(pPlate);
						});
					}
					else
					{
						$(this).next().toggle();
						I.updateScrollbar(pPlate);
					}
				}
				else
				{
					$(this).next().toggle();
				}
				$(this).removeData("donotanimate");
				
				// Scroll to header if expanding, top of page if collapsing
				if (istobeexpanded)
				{
					I.scrollToElement($(this), $(pPlate), "fast");
				}
			});
			
			// Opening the section the first time will load that section's img tags
			header.one("click", function()
			{
				I.loadImg($(this).next());
			});
			
			// Create and bind the additional bottom header to collapse the container
			$("<div class='jsSectionDone'><img src='img/ui/close.png' />" + headertext + "</div>")
			.appendTo(header.next()).click(function()
			{
				$(this).parent().prev().trigger("click");
			});;
			
			/*
			 * Side menu icons as alternative for headers. Clicking an icon
			 * shows the associated header's sibling container (section) by
			 * triggering that header's handler.
			 */
			var section = U.getSubstringFromHTMLID(header);
			var src = header.find("img:eq(0)").attr("src");
			if (I.isMapEnabled || header.hasClass("mapOnly") === false)
			{
				$("<img class='menuBeamIcon' data-section='" + section + "' src='" + src + "' "
				+ "title='&lt;dfn&gt;" + D.getWordCapital("section") + ": &lt;/dfn&gt;" + headertext + "' />")
				.appendTo(menubeam).click(function()
				{
					// Hide all the collapsible sections
					$(pPlate + " header.jsSection").each(function()
					{
						if ($(this).next().is(":visible") && $(this).attr("id") !== header.attr("id"))
						{
							// Don't animate so the scrolling to the section-to-be-opened works properly
							$(this).data("donotanimate", true);
							$(this).trigger("click");
						}
					});
					// Show the requested section
					header.data("beamclicked", true);
					header.trigger("click");
				});
			}
		});

		// Side menu icon to close all the sections
		$("<img class='menuBeamIcon menuBeamIconCollapse' src='img/ui/exit.png' "
			+ "title='&lt;dfn&gt;" + D.getPhraseTitle("collapse section") + "&lt;/dfn&gt;' />")
		.prependTo(menubeam).click(function()
		{
			$(pPlate + " header.jsSection").each(function()
			{
				if ($(this).next().is(":visible"))
				{
					$(this).trigger("click");
				}
			});
			$(pPlate + " .menuBeamIcon").removeClass("menuBeamIconActive");
		});
		
		
		// Make tooltips for the beam menu icons
		I.qTip.init(pPlate + " .menuBeamIcon");
	},
	
		
	/*
	 * Shows or hides a section's map icons by triggering its toggle button.
	 * Whether the button will hide or show icons depends on its boolean data attribute.
	 * @param string pSection name.
	 * @param boolean pWantShow to show or hide its icons.
	 */
	displaySectionMarkers: function(pSection, pWantShow)
	{
		var button = $("#mapToggle_" + pSection);
		var isshown;
		var wanthideonly;
		if (button.length)
		{
			isshown = button.data("checked");
			wanthideonly = button.data("hideonly");
			
			// If toggle button only serves to hide icons
			if (wanthideonly)
			{
				if ( ! pWantShow)
				{
					button.trigger("click");
				}
			}
			// If toggle button is two-states
			else
			{
				if (pWantShow)
				{
					if ( ! isshown)
					{
						button.trigger("click");
						button.data("checked", true);
					}
				}
				else
				{
					if (isshown)
					{
						button.trigger("click");
						button.data("checked", false);
					}
				}
			}
		}
	},
	
	/*
	 * Loads a stylesheet file that was named with a prefix.
	 * @param string pName filename without extension.
	 */
	loadStylesheet: function(pName)
	{
		if (pName === I.ModeEnum.Website)
		{
			return;
		}
		$("head").append("<link rel='stylesheet' type='text/css' href='style/" + pName.toLowerCase() + ".css' />");
	},
	
	/*
	 * Converts img tags with the data-src attribute to src, thereby loading the image.
	 * @param jqobject pContainer to find img tags tag.
	 */
	loadImg: function(pContainer)
	{
		pContainer.find("img").each(function()
		{
			if ($(this).attr("data-src"))
			{
				$(this)[0].src = $(this).data("src");
			}
		});
	},
	
	/*
	 * Bind tooltip or expand collapsible behavior for [?] "buttons".
	 * @param string pPlate HTML ID of plate in the content pane.
	 */
	bindHelpButtons: function(pPlate)
	{
		// These buttons expand its sibling container which is initially hidden
		$(pPlate + " .jsHelpCollapsible").each(function()
		{
			$(this).text("[?+]").attr("title", "<dfn>More Info</dfn>");
			
			$(this).next().hide();
			$(this).click(function()
			{
				$(this).next().toggle();
				
				if ($(this).next().is(":visible"))
				{
					$(this).text("[?-]");
				}
				else
				{
					$(this).text("[?+]");
				}
			});
		});
		
		// These buttons show a tooltip with description when hovered
		$(pPlate + " .jsHelpTooltip").each(function()
		{
			var title = "<dfn>Info:</dfn> " + $(this).attr("title");
			$(this).text(I.Symbol.Help).attr("title", title);
		});
		
		I.qTip.init(pPlate + " .jsHelpCollapsible");
		I.qTip.init(pPlate + " .jsHelpTooltip");
	},
	
	/*
	 * Toggles the data attribute "checked state" of a button, which basically functions as a checkbox.
	 * @param jqobject pElement to bind.
	 * @returns boolean new toggled state.
	 */
	toggleButtonState: function(pElement)
	{
		var bool = !(pElement.data("checked"));
		pElement.data("checked", bool);
		return bool;
	},
	
	/*
	 * Menu event handlers and UI postchanges.
	 */
	initializeUIforMenu: function()
	{
		/*
		 * Preset the menu to fade all icons except the one being hovered.
		 */
		(function()
		{
			var animationspeed = 200;
			var cFadeOpacity = 0.5;
			// User hovers over the menu bar
			$("#paneMenu").hover(
				function()
				{
					$("#paneMenu kbd").each(function()
					{
						// Fade icon not being hovered over
						if ( ! $(this).is(":hover"))
						{
							$(this).animate({opacity: cFadeOpacity}, animationspeed);
						}
					});
				},
				function()
				{
					// User moused outside the menu, so stop the animations
					$("#paneMenu kbd").finish().each(function()
					{
						$(this).animate({opacity: 1}, animationspeed);
					});
				}
			);
			// User hovers over individual menu icons
			$("#paneMenu kbd").hover(
				function()
				{
					$(this).animate({opacity: 1}, animationspeed);
				},
				function()
				{
					$(this).animate({opacity: cFadeOpacity}, animationspeed);
				}
			).mousedown(function()
			{
				$(this).finish().css({opacity: cFadeOpacity});
			}).mouseup(function()
			{
				$(this).finish().css({opacity: 1});
			});
		})();

		/*
		 * Menu click icon to show respective content plate (page).
		 */
		$("#paneMenu kbd").each(function()
		{
			$(this).click(function()
			{
				var plate = $(this).attr("id");
				I.PageCurrent = plate.substring(I.cMenuPrefix.length-1, plate.length);
				I.contentCurrentPlate = I.cPagePrefix + I.PageCurrent;
				if (I.MapCurrent === I.MapEnum.Mists)
				{
					I.PagePrevious = I.PageCurrent;
				}
				switch (I.PageCurrent)
				{
					case I.PageEnum.Chains:
					{
						T.toggleDashboard(true);
					} break;
					case I.PageEnum.Map:
					{
						if (I.isMapEnabled)
						{
							M.movePin(M.Pin.Event);
						}
					} break;
				}
				$("#paneContent article").hide(); // Hide all plates
				if (I.PageCurrent !== I.PageEnum.Chains && T.isDashboardCountdownTickEnabled)
				{
					T.toggleDashboard(false);
				}
				
				// Only do animations if on regular website (to save computation)
				if (I.ModeCurrent === I.ModeEnum.Website)
				{
					$(I.contentCurrentPlate + " .cntHeader").css({opacity: 0}).animate( // Fade page title
					{
						opacity: 1
					}, 400);
					$(I.contentCurrentPlate).animate( // Show requested page
					{
						width: "show"
					}, 200);
				}
				$(I.contentCurrentPlate).show();
				
				// Update the address bar URL with the current page name
				U.updateQueryString();
				
				// Also hide chain paths if on the map page
				if (I.isMapEnabled)
				{
					M.toggleLayer(M.ZoneCurrent.Layers.Path,
						(I.PageCurrent !== I.PageEnum.Map && O.Options.bol_showChainPaths));
				}
			});
		});

		/*
		 * AJAX load the separate HTML files into the content plate when user
		 * clicks on respective menu icon. Most content are not generated until
		 * the user expand a section of the content.
		*/
		// Map plate
		$("#menuMap").one("click", I.loadMapPlate);
		// Help plate
		$("#menuHelp").one("click", I.loadHelpPlate);
		
	}, // End of menu initialization
	
	/*
	 * Switches between the API continents, and update associated variables.
	 * @param enum pMapEnum of the map.
	 */
	toggleMap: function(pMapEnum)
	{
		switch (pMapEnum)
		{
			case I.MapEnum.Tyria: {
				$("#wvwPane").hide();
				$("#mapPane").show();
				M.refreshMap();
				I.PageCurrent = I.PagePrevious;
				I.PagePrevious = I.SpecialPageEnum.WvW;
				I.MapCurrent = I.MapEnum.Tyria;
			} break;
			
			case I.MapEnum.Mists: {
				$("#mapPane").hide();
				$("#wvwPane").show();
				if (W.isMapInitialized)
				{
					W.refreshMap();
				}
				I.PagePrevious = I.PageCurrent;
				I.PageCurrent = I.SpecialPageEnum.WvW;
				I.MapCurrent = I.MapEnum.Mists;
			} break;
		}
		U.updateQueryString();
	},
	
	/*
	 * Macro function for various written content added functionality. Must be
	 * run at the beginning of any load function's done block.
	 */
	bindAfterAJAXContent: function(pPageEnum)
	{
		var plate = I.cPagePrefix + pPageEnum;
		I.generateSectionMenu(plate);
		if (I.isMapEnabled)
		{
			I.initializeScrollbar(plate);
		}
		I.bindHelpButtons(plate);
		M.bindMapLinks(plate);
		// Open links on new window
		U.convertExternalLink(plate + " a");
		I.qTip.init("button");
		
		// Expand a header if requested in the URL
		U.openSectionFromURL();
		D.translateElements();
	},
	
	/*
	 * Loads the map page into the map content plate.
	 */
	loadMapPlate: function()
	{
		I.loadStylesheet("features");
		$("#plateMap").load(U.getPageSrc("map"), function()
		{
			I.bindAfterAJAXContent(I.PageEnum.Map);
			
			// Hide map dependent sections in mobile mode
			if (I.ModeCurrent === I.ModeEnum.Mobile)
			{
				$(".mapOnly").remove();
			}
			
			// Create daily markers
			$("#headerMap_Daily").one("click", function()
			{
				G.generateAndInitializeDailies();
				I.isSectionLoaded_Daily = true;
			});
			// Create node markers and checkboxes
			$("#headerMap_Resource").one("click", function()
			{
				G.generateAndInitializeResources();
			});
			// Create JP checklist
			$("#headerMap_JP").one("click", function()
			{
				G.generateAndInitializeJPs();
			});
			// Create custom checklists
			$("#headerMap_Personal").one("click", function()
			{
				X.initializePersonalChecklist();
			});
			// Create trading calculator
			$("#headerMap_TP").one("click", function()
			{
				E.initializeCalculator();
				E.initializeTrading();
				E.initializeExchange();
			});
			// Create notepad
			$("#headerMap_Notepad").one("click", function()
			{
				X.initializeNotepad();
			});
			// Create collectible markers and checkboxes
			$("#headerMap_Collectible").one("click", function()
			{
				G.generateCollectiblesUI();
			});
			// Create guild mission subsections
			$("#headerMap_Guild").one("click", function()
			{
				G.generateGuildUI();
			});
			I.qTip.init("#plateMap label");
		});
	},
	
	/*
	 * Loads the help page into the help content plate.
	 */
	loadHelpPlate: function()
	{
		$("#plateHelp").load(U.getPageSrc("help"), function()
		{
			I.bindAfterAJAXContent(I.PageEnum.Help);
			$(".jsCopyCode").click(function()
			{
				$(this).select();
			});
		});
	},
	
	/*
	 * Binds Map pane special effects on HUD GUI elements.
	 */
	initializeUIForHUD: function()
	{
		var animationspeed = 200;
		$(".mapHUDContainer").each(function()
		{
			$(this).hover(
				function() { $(this).find(".cntComposition").show().animate({opacity: 0.8}, animationspeed); },
				function() { $(this).find(".cntComposition").animate({opacity: 0}, animationspeed); }
			);
		});
	},
	
	/*
	 * Shows an icon link to the main site without URL parameters.
	 */
	showHomeLink: function()
	{
		I.qTip.init($("<a title='&lt;dfn&gt;Switch back to full site.&lt;/dfn&gt;' href='./'>"
			+ " <img id='iconSimpleHome' src='img/ui/about.png' /></a>")
			.appendTo("#itemHome"));
	},
	
	/*
	 * Changes program look based on mode.
	 */
	enforceProgramMode: function()
	{
		I.loadStylesheet(I.ModeCurrent);
		
		switch (I.ModeCurrent)
		{
			case I.ModeEnum.Website:
			{
				$("head").append("<link rel='alternate' media='only screen and (max-width: 640px)' href='http://gw2timer.com/?mode=Mobile'>");
			} break;
			case I.ModeEnum.Overlay:
			{
				I.cPANE_MENU_HEIGHT = 32;
			} break;
			case I.ModeEnum.Simple:
			{
				I.isMapEnabled = false;
				I.showHomeLink();
				// Readjust panels
				I.readjustSimple();
				$(window).resize(function() { I.readjustSimple(); });
			} break;
			case I.ModeEnum.Mobile:
			{
				I.isMapEnabled = false;
				I.isScrollEnabled = true;
				I.showHomeLink();
				$("head").append("<meta name='viewport' content='width=device-width, initial-scale=1' />")
					.append("<link rel='canonical' href='http://gw2timer.com' />");
				$("#chnOptionsRight").prependTo("#chnOptionsPopup");
			} break;
			case I.ModeEnum.Tile:
			{
				I.isMapEnabled = false;
				K.iconOpacityChecked = 0.2;
				I.showHomeLink();
				$("#itemLanguage").prependTo("#plateChains");
				$("#chnOptionsRight").prependTo("#chnOptionsPopup");
				I.initializeScrollbar("#windowMain");
				$(window).resize(function() { I.readjustTile(); });
			} break;
		}
		
		// Change CSS for overlay specific
		if (I.ModeCurrent === I.ModeEnum.Website && I.isProgramEmbedded === false)
		{
			$("#paneClockIcons img").addClass("curZoom");
		}
		else
		{
			$("#paneClockIcons img").addClass("curClick");
		}
		
		// Also streamline other UI elements if website is embedded in another website
		if (I.isProgramEmbedded)
		{
			$("#itemWarning").remove();
			$(".itemMapPeripheral a, .itemMapPeripheral span").hide();
			T.isDashboardEnabled = false;
		}
		
		// Include program mode in Language links
		if (I.ModeCurrent !== I.ModeEnum.Website)
		{
			$("#itemLanguagePopup a").each(function()
			{
				var link = $(this).attr("href");
				$(this).attr("href", link + "&mode=" + I.ModeCurrent);
			});
			if (I.ModeCurrent !== I.ModeEnum.Overlay)
			{
				T.isDashboardEnabled = false;
			}
		}
	},
	
	/*
	 * Centers the clock in the browser window.
	 */
	readjustSimple: function()
	{
		var height = $(window).height() / 2;
		var width = $(window).width() / 2;
		var half = I.cPANE_CLOCK_HEIGHT / 2;
		$("#paneSimple").css({
			"margin-top": height - half - 72
		});
		$("#paneClock").css(
		{
			"margin-top": height - half,
			"margin-left": width - half
		});
	},
	readjustTile: function()
	{
		if (I.ModeCurrent !== I.ModeEnum.Tile)
		{
			return;
		}
		var result = T.stepFunction($(window).width(), 14, 22, 400, 3);
		$(".chnTitle h1").css({fontSize: result + "px"});
	},
	
	/*
	 * Initializes custom tooltips and sets mouse-tooltip behavior.
	 */
	initializeTooltip: function()
	{
		// Bind the following tags with the title attribute for tooltip
		I.qTip.init("#chnOptions img, a, ins, kbd, span, fieldset, label, input, button");
		$("#panelApp").hover(
			function() { I.isMouseOnPanel = true; },
			function() { I.isMouseOnPanel = false; }
		);
	},
	
	/*
	 * qTip (2008 minified) tooltip plugin by Craig Erskine http://qrayg.com
	 * Placed here instead of plugin.js because it's customizable and so small.
	 */
	qTip:
	{
		name: "qTip",
		offsetX: -180,
		offsetY: 15,
		a: null,
		/*
		 * Binds matched elements with title attribute to show a popup div with
		 * that title as content when hovered over the element.
		 * @param string s jQuery selector.
		 */
		start: function()
		{
			if (!a) var a = "qTip";
			var b = document.getElementById(a);
			b || (b = document.createElementNS ? document.createElementNS("http://www.w3.org/1999/xhtml", "div")
				: document.createElement("div"), b.setAttribute("id", a),
				document.getElementsByTagName("body").item(0).appendChild(b));
			if (document.getElementById)
			{
				this.a = document.getElementById(this.name);
				if (this.a)
				{
					document.onmousemove = $.throttle(I.cTOOLTIP_MOUSEMOVE_RATE, function(pEvent)
					{
						I.qTip.move(pEvent);
					});
				}
			}
		},
		init: function(s)
		{
			var a;
			var b = document.getElementById("qTip");
			$(s).each(function()
			{
				a = $(this)[0];
				b = a.getAttribute("title");
				if (a && b)
				{
					a.setAttribute("tiptitle", b), a.removeAttribute("title"),
						a.removeAttribute("alt"), a.onmouseover = function()
					{
						I.qTip.show(this.getAttribute("tiptitle"));
					}, a.onmouseout = function()
					{
						I.qTip.hide();
					};
				}
			});
		},
		move: function(a)
		{
			I.posX = a.pageX;
			I.posY = a.pageY;
			var tipwidth = $("#qTip").width();
			var tipheight = $("#qTip").height();
			var winwidth = $(window).width();
			var winheight = $(window).height();
			
			/*
			 * Make the tooltip appear within the visible window by detecting current
			 * tooltip size and mouse position.
			 */
			if (I.isMouseOnPanel)
			{
				/*
				$("#cslContent").html(
					x + ", " + y + "<br />"
					+ (this.a.offsetWidth) + ", " + (this.a.offsetHeight) + 
				$("#cslContent").html(pEvent.pageX + ", " + pEvent.pageY + "<br />"
					+ $("#qTip").width() + ", " + $("#qTip").height() + "<br />"
					+ $(window).width() + ", " + $(window).height());
				*/
				// Tooltip overflows bottom edge
				if (tipheight + I.posY + I.cTOOLTIP_ADD_OFFSET_Y > winheight)
				{
					I.qTip.offsetY = -(tipheight) - I.cTOOLTIP_ADD_OFFSET_Y;
				}
				else
				{
					I.qTip.offsetY = I.cTOOLTIP_DEFAULT_OFFSET_Y;
				}
				// Tooltip overflows panel right edge
				if (tipwidth >= I.cTOOLTIP_OVERFLOW_WIDTH && I.isMapEnabled && O.Options.bol_alignPanelRight)
				{
					I.qTip.offsetX = (winwidth - I.posX) - I.cPANEL_WIDTH - I.cTOOLTIP_OVERFLOW_MAX;
				}
				else if ((winwidth - I.posX) > (I.cPANEL_WIDTH / 2))
				{
					I.qTip.offsetX = I.cTOOLTIP_ALTERNATE_OFFSET_X;
				}
				else
				{
					I.qTip.offsetX = I.cTOOLTIP_DEFAULT_OFFSET_X;
				}
			}
			else // Mouse is on the map pane
			{
				// Tooltip overflows right edge
				if (I.posX + I.cTOOLTIP_ADD_OFFSET_X + tipwidth > winwidth && tipwidth > I.cTOOLTIP_WIDTH_MAX)
				{
					I.qTip.offsetX = -(tipwidth) - I.cTOOLTIP_ADD_OFFSET_X;
				}
				else
				{
					I.qTip.offsetX = I.cTOOLTIP_ALTERNATE_OFFSET_X;
				}
				// Tooltip overflows bottom edge
				if (tipheight - I.cTOOLTIP_ALTERNATE_OFFSET_X + I.posY > winheight)
				{
					I.qTip.offsetY = -(tipheight) - I.cTOOLTIP_ADD_OFFSET_Y;
				}
				// Tooltip overflows top edge
				else if (I.posY < I.cTOOLTIP_ADD_OFFSET_Y)
				{
					I.qTip.offsetY = I.cTOOLTIP_DEFAULT_OFFSET_Y;
				}
				else
				{
					I.qTip.offsetY = -I.cTOOLTIP_ADD_OFFSET_Y;
				}
			}
			
			this.a.style.left = I.posX + this.offsetX + "px";
			this.a.style.top = I.posY + this.offsetY + "px";
		},
		show: function(a)
		{
			this.a && (this.a.innerHTML = a, this.a.style.display = "block");
		},
		hide: function()
		{
			this.a && (this.a.innerHTML = "", this.a.style.display = "none");
		}
	}
};

/* =============================================================
 * Executions, the order matters!
 * ============================================================= */
I.initializeFirst(); // initialize variables that need to be first
O.initializeOptions(); // load stored or default options to the HTML input
T.initializeSchedule(); // compute event data and write HTML
P.initializeMap(); // instantiate the map and populate it
K.initializeClock(); // start the clock and infinite loop
I.initializeLast(); // bind event handlers for misc written content




});//]]>// END OF JQUERY NEST