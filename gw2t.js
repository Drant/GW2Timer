/*
	GW2Timer.com timer, map, and misc single-page application driver.
	jQuery-dependent (v1.11.0), with other plugins in plugins.js.
	Coded in NetBeans; debugged in Chrome Developer Tools.
	IDE recommended for viewing and collapsing code sections.
	Version: see int_utlProgramVersion - 2014.04.18 created

	LIBRARIES:
	Below are inline libraries, for the rest, see http://gw2timer.com/plugins.js
	Vladimir Agafonkin - LeafletJS map library
	Craig Erskine - qTip tooltip
	David Flanagan - SVG clock based on example from "JavaScript The Definitive Guide 6e"
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
	Parameters are camel case and start with "p": function(pExampleParameter)
	Parameters inside loops start with "i": forEach(function(iExampleParameter){})
	CSS classes and IDs are named like instance variables: exampleID
	Allman indentation (braces align vertically) unless it is repetitive code
	4 space-size tabs, you are free to Replace All tab characters with spaces

	TABLE OF CONTENTS (Ctrl+F "AtsignAtsignLetter" to jump to section)

	O - Options for user
	U - URL management
	A - Account management
	X - Checklists
	E - Economy
	D - Dictionary for translations
	C - Chains events
	M - Map Leaflet
	P - Populate map
	G - Generated content
	W - World vs World
	T - Time utilities and schedule
	B - Dashboard and timeline
	K - Clock ticker
	I - Interface UI

*/

$(window).on("load", function() {
	
/* =============================================================================
 * Single letter objects serve as namespaces.
 * ========================================================================== */
var O, U, A, X, E, D, C, M, P, G, W, T, B, K, I = {};

/* =============================================================================
 * @@Options for the user
 * ========================================================================== */
O = {
	
	lengthOfPrefixes: 3,
	prefixOption: "opt_",
	legalLocalStorageKeys: [],
	isServerReset: false,

	/*
	 * These utility variables will also be stored in localStorage.
	 * O.Utilities, O.Options, and X.Checklists/Textlists share a namespace in
	 * localStorage and must together have unique variable names.
	 */
	Utilities:
	{
		programVersion: {key: "int_utlProgramVersion", value: 160209},
		lastLocalResetTimestamp: {key: "int_utlLastLocalResetTimestamp", value: 0},
		APITokens: {key: "obj_utlAPITokens", value: []},
		BackupPins: {key: "obj_utlBackupPins", value: []},
		BackupPinsWvW: {key: "obj_utlBackupPinsWvW", value: []},
		StoredPins: {key: "obj_utlStoredPins", value: []},
		StoredPinsWvW: {key: "obj_utlStoredPinsWvW", value: []},
		StoredWeapons: {key: "obj_utlStoredWeapons", value: []},
		StoredWeaponsWvW: {key: "obj_utlStoredWeaponsWvW", value: []}
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
				+ "Would you like to see the <a class='urlUpdates' href='" + U.URL_META.News + "'>changes</a>?<br />", wait);
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
		// Enumeration is an exception, being set by URL or special functions only
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
		bol_showTimeline: true,
		bol_opaqueTimeline: false,
		bol_hideHUD: true,
		// Map
		int_setFloor: 1,
		int_setInitialZoom: 3,
		int_setInitialZoomWvW: 3,
		bol_showCoordinatesBar: true,
		bol_showZoneBorders: false,
		bol_showZoneGateways: false,
		bol_showPersonalPaths: true,
		bol_showChainPaths: true,
		bol_tourPrediction: true,
		bol_showWorldCompletion: false,
		bol_showZoneOverview: true,
		bol_displaySectors: true,
		bol_displayWaypoints: true,
		bol_displayPOIs: true,
		bol_displayVistas: true,
		bol_displayChallenges: true,
		bol_displayHearts: true,
		bol_displayEvents: false,
		bol_showWorldCompletionWvW: false,
		bol_showZoneOverviewWvW: true,
		bol_displaySectorsWvW: true,
		bol_displayWaypointsWvW: true,
		bol_displayPOIsWvW: true,
		bol_displayVistasWvW: true,
		bol_displayChallengesWvW: true,
		// WvW
		int_secWvWRefresh: 10,
		int_numLogEntries: 128,
		bol_showLog: true,
		bol_opaqueLog: false,
		bol_maximizeLog: false,
		bol_logRedHome: true,
		bol_logGreenHome: true,
		bol_logBlueHome: true,
		bol_logCenter: true,
		bol_logNarrate: false,
		bol_narrateRedHome: true,
		bol_narrateGreenHome: true,
		bol_narrateBlueHome: true,
		bol_narrateCenter: true,
		bol_narrateClaimed: true,
		bol_narrateCamp: true,
		bol_narrateTower: true,
		bol_narrateKeep: true,
		bol_narrateCastle: true,
		bol_showLeaderboard: true,
		bol_opaqueLeaderboard: false,
		bol_condenseLeaderboard: false,
		bol_showDestructibles: false,
		bol_showObjectiveLabels: true,
		bol_showSecondaries: false,
		// GPS
		bol_displayCharacter: true,
		bol_followCharacter: true,
		bol_displayCharacterWvW: true,
		bol_followCharacterWvW: false,
		int_msecGPSRefresh: 100,
		// Alarm
		int_setAlarm: 0,
		int_setVolume: 75,
		bol_alertArrival: true,
		bol_alertAtStart: true,
		bol_alertAtEnd: true,
		bol_alertChecked: false,
		int_alertSubscribedFirst: 1,
		int_alertSubscribedSecond: 15,
		bol_alertAutosubscribe: true,
		bol_alertUnsubscribe: true,
		// Tools
		int_minStopwatchAlert: 5,
		str_textStopwatchAlert: "Alert, alert, alert!",
		int_sizeStopwatchFont: 64,
		int_sizeNotepadFont: 12,
		int_sizeNotepadHeight: 400,
		// Trading
		bol_refreshPrices: true,
		bol_useMainTPSearch: true,
		int_numTradingCalculators: 25,
		int_numTradingResults: 30,
		int_secTradingRefresh: 60,
		// Advanced
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
	VoiceCode:
	{
		// This enum corresponds to the voices available from window.speechSynthesis.getVoices() array
		en: "Google US English",
		de: "Google Deutsch",
		es: "Google español",
		fr: "Google français",
		cs: "native",
		it: "Google italiano",
		pl: "Google polski",
		pt: "Google português do Brasil",
		ru: "Google русский",
		zh: "Google 國語（臺灣）"
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
	 * Sorts an array of objects by the provided key name, or language name if not.
	 * @param array pObjects.
	 * @param string pKeyName, optional.
	 * @param boolean pIsDescending order, optional. Ascending is default order.
	 */
	sortObjects: function(pObjects, pKeyName, pIsDescending)
	{
		var key = (pKeyName) ? pKeyName : D.getNameKey();
		if (pIsDescending)
		{
			pObjects.sort(function(a, b)
			{
				if (a[key] < b[key])
				{
					return 1;
				}
				if (a[key] > b[key])
				{
					return -1;
				}
				return 0;
			});
		}
		else
		{
			pObjects.sort(function(a, b)
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
		var inputobj;
		// Load or initialize input options
		for (optionkey in O.Options)
		{
			inputobj = $("#" + O.prefixOption + optionkey);
			inputtype = inputobj.attr("type");
			variabletype = U.getVariablePrefix(optionkey);
			
			/*
			 * Initialize legal numeric values by looking up the associated
			 * input tag.
			 */
			if (inputtype === "radio")
			{
				// Range shall be 0 to how many radio buttons there are minus one
				O.OptionRange[optionkey] = new Array(0, $("fieldset[name=" + optionkey + "] input").length - 1);
			}
			else if (inputtype === "number" || inputtype === "range")
			{
				O.OptionRange[optionkey] = new Array(inputobj.prop("min"), inputobj.prop("max"));
			}
			
			/*
			 * URLArguments overrides localStorage, which overrides Options here
			 * only if such an Options variable exists. If program is embedded
			 * then URLArguments overrides Options only, and user preferences
			 * (localStorage) will not modified. Strings may not be overriden by URL.
			 */
			if (I.isProgramEmbedded)
			{
				if (U.Args[optionkey] !== undefined && variabletype !== O.TypeEnum.isString)
				{
					O.Options[optionkey] = O.convertLocalStorageDataType(
						U.sanitizeURLOptionsValue(optionkey, U.Args[optionkey]));
				}
			}
			else
			{
				if (U.Args[optionkey] !== undefined && variabletype !== O.TypeEnum.isString)
				{
					// Override localStorage
					localStorage[optionkey] = U.sanitizeURLOptionsValue(optionkey, U.Args[optionkey]);
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
			
			// Assign the retrieved values to the input tags
			O.setInputValue(inputobj, O.Options[optionkey]);

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
				inputobj.change(function()
				{
					var thisoptionkey = $(this).attr("id").slice(O.prefixOption.length);
					O.Options[thisoptionkey] = O.getInputValue($(this), thisoptionkey);
					localStorage[thisoptionkey] = O.Options[thisoptionkey];
				});
			}
		}
		
		// Supplementary event handlers for some inputs
		O.bindOptionsInputs();
		U.initializeAPIURLs();
	},
	
	/*
	 * Sets the value of an input tag.
	 * @param string pInput to read.
	 * @param polymorphic pValue.
	 */
	setInputValue: function(pInput, pValue)
	{
		var inputobj = $(pInput);
		var inputtype = inputobj.attr("type");

		// Assign the retrieved values to the cloned input
		if (inputtype === "checkbox")
		{
			inputobj.prop("checked", pValue);
		}
		else if (inputtype === "number" || inputtype === "range")
		{
			inputobj.val(pValue);
		}
		else if (inputtype === "radio")
		{
			// Check the radio button of that index (int)
			$("input:radio[name=" + inputobj.attr("name") + "]:eq(" + pValue + ")")
				.prop("checked", true);
		}
		else
		{
			inputobj.val(pValue);
		}
	},
	
	/*
	 * Gets the value of an input tag.
	 * @param string pInput to read.
	 * @param string pOptionKey name of an option for range validation.
	 */
	getInputValue: function(pInput, pOptionKey)
	{
		var inputobj = $(pInput);
		var inputtype = inputobj.attr("type");
		var value;

		if (inputtype === "checkbox")
		{
			value = inputobj.prop("checked");
		}
		else if (inputtype === "number" || inputtype === "range")
		{
			// These inputs can have custom text, so sanitize them first
			var value = inputobj.val();
			var integer = parseInt(value);
			if (isFinite(value) && integer >= O.OptionRange[pOptionKey][0]
				&& integer <= O.OptionRange[pOptionKey][1])
			{
				value = integer;
			}
			else
			{
				// Load default value if not an integer within range
				value = O.OptionRange[pOptionKey][0];
			}
			inputobj.val(value);
		}
		else
		{
			value = inputobj.val();
		}

		return value;
	},
	
	/*
	 * Makes an input tag behave the same as an Options input tag.
	 * @param jqobject pCloneInput input tag.
	 * @param string pOptionKey name of an option.
	 */
	mimicInput: function(pCloneInput, pOptionKey)
	{
		var inputclone = $(pCloneInput);
		// Initialize the value of the clone
		O.setInputValue(inputclone, O.Options[pOptionKey]);
		
		// If the cloned input value has changed then mimic that to the original
		var inputobj = $("#" + O.prefixOption + pOptionKey);
		inputclone.change(function()
		{
			var value = O.getInputValue($(this), pOptionKey);
			O.setInputValue(inputobj, value);
			inputobj.trigger("change");
		});
		// If the original input value has changed, then superficially change the cloned input
		inputobj.change(function()
		{
			O.setInputValue(inputclone, O.Options[pOptionKey]);
		});
		return inputclone;
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
		// Update the daily object
		T.getDaily({isReset: true});
		
		// Chains checklist
		var i;
		var chain;
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
		// Daily achievements
		if (I.isSectionLoaded_Daily)
		{
			G.generateAndInitializeDailies();
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
			(function(iFunction){
				var query;
				var htmlid = O.prefixOption + iFunction;
				var thisinputtype = $("#" + htmlid).attr("type");
				if (thisinputtype === "radio")
				{
					query = "fieldset[name=" + iFunction + "]";
				}
				else
				{
					query = "#" + htmlid;
				}
				
				$(query).change(function()
				{
					O.Enact[iFunction]();
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
			
			$("#mapOptionsCompletion label input").each(function()
			{
				X.setCheckboxEnumState($(this), X.boolToChecklistEnum(O.Options.bol_showWorldCompletion));
			});
		});
		$("#opt_bol_showWorldCompletionWvW").change(function()
		{
			if (O.Options.bol_showWorldCompletionWvW === true
				&& W.isMappingIconsGenerated === false)
			{
				location.reload();
			}
			
			$("#wvwOptionsCompletion label input").each(function()
			{
				X.setCheckboxEnumState($(this), X.boolToChecklistEnum(O.Options.bol_showWorldCompletionWvW));
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
		$("#wvwOptionsCompletion label input").each(function()
		{
			$(this).change(function()
			{
				if (W.isAPIRetrieved_MAPFLOOR)
				{
					W.refreshCurrentZone();
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
		O.Enact.bol_showTimeline();
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
			I.scrollToElement("#plateChains");
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
			var keys = [];
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
			
			I.write(s, 0, true);
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
		bol_logNarrate: function()
		{
			if (O.Options.bol_logNarrate === false)
			{
				D.stopSpeech();
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
					var elm = $("#chnDetails_" + C.CurrentChains[i].nexus);
					if (O.Options.bol_expandWB)
					{
						elm.show("fast");
					}
					else
					{
						elm.hide("fast");
					}
				}
			}
		},
		bol_use24Hour: function()
		{
			C.initializeTimetableHTML();
			C.updateChainsTimeHTML();
			K.updateDigitalClockMinutely();
			B.updateTimelineLegend();
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
		int_setInitialZoom: function()
		{
			M.Map.setZoom(O.Options.int_setInitialZoom);
		},
		int_setInitialZoomWvW: function()
		{
			W.Map.setZoom(O.Options.int_setInitialZoomWvW);
		},
		bol_showZoneBorders: function()
		{
			P.drawZoneBorders();
		},
		bol_showZoneGateways: function()
		{
			P.drawZoneGateways();
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
				P.tickGPS();
				P.updateCharacter(0);
			}
		},
		bol_displayCharacterWvW: function()
		{
			if ( ! O.Options.bol_displayCharacterWvW)
			{
				W.movePin(W.Pin.Character);
				W.movePin(W.Pin.Camera);
			}
			else
			{
				P.tickGPS();
				P.updateCharacter(0);
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
				if (A.isAccountInitialized)
				{
					A.adjustAccountPanel();
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
						$(".mapExpandButton").css({right: 0, left: "auto"});
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
					$(".mapExpandButton").css({right: "auto", left: 0});
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
		bol_showCoordinatesBar: function()
		{
			M.toggleCoordinatesBar();
		},
		bol_hideHUD: function()
		{
			if (O.Options.bol_hideHUD === false)
			{
				$("#mapHUDBoxes").show();
			}
		},
		bol_showTimeline: function()
		{
			if (O.Options.bol_showTimeline)
			{
				if (B.isTimelineGenerated)
				{
					B.toggleTimeline(true);
					return;
				}
				else
				{
					B.generateTimeline();
					O.Enact.bol_opaqueTimeline();
				}
			}
			else
			{
				B.toggleTimeline(false);
			}
		},
		bol_opaqueTimeline: function()
		{
			var background;
			if (O.Options.bol_opaqueTimeline)
			{
				if (I.ModeCurrent === I.ModeEnum.Overlay)
				{
					background = "linear-gradient(to right, #111 0%, #383838 50%, #111 100%)";
				}
				else
				{
					background = "rgba(0, 0, 0, 0.6)";
				}
			}
			else
			{
				background = "none";
			}
			$("#itemTimeline").css({background: background});
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
		},
		bol_showLog: function()
		{
			W.toggleLog();
		},
		bol_opaqueLog: function()
		{
			W.opaqueLog();
		},
		bol_maximizeLog: function()
		{
			W.toggleLogHeight();
		},
		bol_showLeaderboard: function()
		{
			W.toggleLeaderboard();
		},
		bol_opaqueLeaderboard: function()
		{
			W.opaqueLeaderboard();
		},
		bol_condenseLeaderboard: function()
		{
			W.toggleLeaderboardWidth(true);
		},
		bol_showSecondaries: function()
		{
			W.toggleSecondaries(true);
		},
		bol_showDestructibles: function()
		{
			W.toggleWalls(true);
		},
		bol_showObjectiveLabels: function()
		{
			W.toggleObjectiveLabels();
		}
	}
};

/* =============================================================================
 * @@URL management for links and string manipulation
 * ========================================================================== */
U = {
	
	CommandPrefix: "/",
	URL_META:
	{
		News: "http://forum.renaka.com/topic/5500046/",
		Overlay: "http://forum.renaka.com/topic/5546166/"
	},
	
	URL_API:
	{
		// Achievements
		Daily: "https://api.guildwars2.com/v2/achievements/daily",
		Tomorrow: "https://api.guildwars2.com/v2/achievements/daily/tomorrow",
		Fractal: "https://api.guildwars2.com/v2/achievements/categories/88",
		
		// Map
		LangKey: "",
		TilesTyria: "https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg",
		TilesMists: "https://tiles.guildwars2.com/2/1/{z}/{x}/{y}.jpg",
		MapFloorTyria: "https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=1",
		MapFloorMists: "https://api.guildwars2.com/v1/map_floor.json?continent_id=2&floor=1",
		MapsList: "https://api.guildwars2.com/v1/maps.json",
		EventNames: "https://api.guildwars2.com/v1/event_names.json",
		EventDetails: "https://api.guildwars2.com/v1/event_details.json",
		
		// Exchange
		ItemListing: "https://api.guildwars2.com/v2/commerce/listings/",
		ItemPrices: "https://api.guildwars2.com/v2/commerce/prices/",
		ItemDatabase: "https://api.guildwars2.com/v2/items",
		ItemDetails: "https://api.guildwars2.com/v2/items/",
		ItemRender: "https://render.guildwars2.com/file/",
		CoinPrice: "https://api.guildwars2.com/v2/commerce/exchange/gems?quantity=",
		GemPrice: "https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=",
		ItemSearch: "http://www.gw2spidy.com/api/v0.9/json/item-search/",
		ItemSearchFallback: "http://www.gw2shinies.com/api/json/idbyname/",
		
		// WvW
		Match: "https://api.guildwars2.com/v2/wvw/matches?world=",
		Matches: "https://api.guildwars2.com/v2/wvw/matches/",
		GuildDetails: "https://api.guildwars2.com/v1/guild_details.json?guild_id=",
		MatchFallback: "https://api.guildwars2.com/v1/wvw/match_details.json?match_id=",
		MatchesFallback: "https://api.guildwars2.com/v1/wvw/matches.json",
		
		// Other
		Worlds: "https://api.guildwars2.com/v2/worlds",
		Prefix: "https://api.guildwars2.com/v2/",
		TextToSpeech: "http://code.responsivevoice.org/getvoice.php?tl="
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
		Account: "data/account.js",
		WvW: "data/wvw.js",
		Itinerary: "data/itinerary.js",
		// Data to load when opening a map page section
		Unscheduled: "data/chains-add.js",
		Daily: "data/daily.js",
		DryTop: "data/drytop.js",
		Resource: "data/resource.js",
		JP: "data/jp.js",
		Collectible: "data/collectible.js",
		Guild: "data/guild.js"
	},
	
	initializeAPIURLs: function()
	{
		var lang = D.getPartiallySupportedLanguage();
		U.URL_API.LangKey = "?lang=" + lang;
		var langsuffix = "&lang=" + lang;
		
		U.URL_API.Worlds += U.URL_API.LangKey + "&ids=";
		U.URL_API.MapFloorTyria += langsuffix;
		U.URL_API.MapFloorMists += langsuffix;
		U.URL_API.EventNames += langsuffix;
		U.URL_API.TextToSpeech += lang + "&sv=&vn=&pitch=0.5&rate=0.4";
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
		Go: "go",
		Draw: "draw"
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
	 * Interprets and executes a command string, which may be a console command
	 * or a map data string.
	 * @param string pString command.
	 * @param object pMapObject which map to execute.
	 * @param enum pZoom level, optional.
	 */
	interpretCommand: function(pString, pMapObject, pZoom, pPin)
	{
		if (pString.indexOf(I.cConsoleCommandPrefix) === 0)
		{
			// If input starts with a console command
			U.parseConsoleCommand(pString, pMapObject);
		}
		else if (pMapObject.parsePersonalPath(pString) === false)
		{
			// If input looks like a 2D array of coordinates, then create pins from them
			pMapObject.goToArguments(pString, pZoom, pPin);
		}
	},
	
	/*
	 * Executes a console command.
	 * @param string pString command.
	 * @param object pMapObject which map the command was executed from.
	 */
	parseConsoleCommand: function(pString, pMapObject)
	{
		var that = pMapObject;
		var args = pString.substring(1, pString.length).split(" "); // Trim the command prefix character
		var argstr = pString.substring(pString.indexOf(" ") + 1, pString.length);
		var command = args[0].toLowerCase();
		
		var Commands = {
			clear: {usage: "Clears the console screen.", f: function()
			{
				I.clear();
			}},
			speak: {usage: "Speaks the given text. <em>Parameters: str_text</em>", f: function()
			{
				D.speak(argstr);
			}},
			gps: {usage: "Prints GPS location information.", f: function()
			{
				I.write("Position: " + GPSPositionArray + "<br />Direction: " + GPSDirectionArray + "<br />Camera: " + GPSCameraArray, 0);
			}},
			identity: {usage: "Prints GPS general information.", f: function()
			{
				I.write(U.formatJSON(GPSIdentityJSON), 0);
			}},
			lock: {usage: "Map cannot be moved.", f: function()
			{
				that.Map.dragging.disable(); that.Map.scrollWheelZoom.disable(); I.write("Map locked.");
			}},
			unlock: {usage: "Map can be moved.", f: function()
			{
				that.Map.dragging.enable(); that.Map.scrollWheelZoom.enable(); I.write("Map unlocked.");
			}},
			nct: {usage: "Disables the map's context menu.", f: function()
			{
				that.Map.off("contextmenu"); I.write("Map context menu disabled.");
			}},
			link: {usage: "Prints a coordinates URL of the current map view.", f: function()
			{
				I.write(I.cSiteURL + that.convertLCtoGC(that.Map.getCenter()), 0, true);
			}},
			dart: {usage: "Draws personal pins at random map locations. <em>Parameters: int_quantity</em>", f: function()
			{
				that.drawRandom(args[1]);
			}},
			nodes: {usage: "Prints a list of ordered coordinates. <em>Parameters: arr_coordinates</em>", f: function()
			{
				P.printNodes(P.sortCoordinates(M.parseCoordinatesMulti(args[1])));
			}},
			decode: {usage: "Decodes a chatlink to a number ID. <em>Parameters: str_chatlink</em>", f: function()
			{
				I.write(U.getGameIDFromChatlink(args[1], true), 0);
			}},
			api: {usage: "Prints the output of an API URL &quot;" + U.URL_API.Prefix + "&quot;. <em>Parameters: str_apiurlsuffix, int_limit (optional), str_querystring (optional)</em>", f: function()
			{
				U.printAPI(args[1], args[2], args[3]);
			}},
			acc: {usage: "Prints the output of an account API URL &quot;"
				+ U.URL_API.Prefix + "&quot;. Token must be initialized from the account page. <em>Parameters: str_apiurlsuffix</em>. Replace spaces with &quot;%20&quot;", f: function()
			{
				if (args[1] === undefined)
				{
					I.write("Available account API URL suffixes:");
					for (var i in A.URL)
					{
						I.write(A.URL[i], 0);
					}
				}
				else
				{
					A.printAccount(args[1]);
				}
			}},
			daily: {usage: "Prints the daily achievements.", f: function()
			{
				U.printDaily();
			}},
			item: {usage: "Prints an item's information. <em>Parameters: int_itemid</em>", f: function()
			{
				U.printAPI("items/" + args[1]);
			}},
			items: {usage: "Prints the highest numbered item IDs in the API. <em>Parameters: int_offset</em>", f: function()
			{
				U.printItemsAPI(args[1]);
			}},
			events: {usage: "Prints the event names of the current zone, dynamic events option must be enabled.", f: function()
			{
				P.printZoneEvents();
			}},
			help: {usage: "Prints this help message.", f: function()
			{
				I.write("Available console commands:<br />");
				var s = "";
				for (var i in Commands)
				{
					s += "<b>" + i + "</b> - " + Commands[i].usage + "<br />";
				}
				I.write(s, 0);
			}},
			test: {usage: "Test function for debugging.", f: function()
			{
				U.URL_API.Match = args[1];
			}}
		};
		// Execute the command by finding it in the object
		if (Commands[command] !== undefined)
		{
			(Commands[command].f)();
		}
	},
	
	/*
	 * Prints a v2 API endpoint by querying each element in the array it
	 * returned, or just the object.
	 * @param string pString of API
	 * @param int pLimit of array elements to print.
	 * @param string pArgs arguments for the API url.
	 */
	printAPI: function(pString, pLimit, pArgs)
	{
		I.write("Gathering elements...");
		pLimit = parseInt(pLimit) || Number.POSITIVE_INFINITY;
		var array = [];
		var counter = 0;
		var args = (pArgs === undefined) ? "" : pArgs;
		var url = U.URL_API.Prefix + pString;
		var printResult = function(pArray)
		{
			I.clear();
			pArray.sort();
			for (var i = 0; i < pArray.length; i++)
			{
				printIcon(pArray[i]);
				I.write(pArray[i], 0);
			}
		};
		var printIcon = function(pData)
		{
			var data = (typeof pData === "string") ? JSON.parse(pData) : pData;
			if (data.icon)
			{
				I.write("<img class='cssRight' src='" + U.escapeHTML(data.icon) + "' />", 0);
			}
		};
		
		$.get(url + args, function(pData)
		{
			var length = (pData.length === undefined) ? 0 : pData.length;
			if (Array.isArray(pData))
			{
				I.write("Retrieved array:<br />" + U.formatJSON(pData), 0);
				var successlength = length;
				for (var i = 0; i < length; i++)
				{
					if (i === pLimit)
					{
						break;
					}
					(function(iIndex)
					{
						$.getJSON(url + "/" + pData[iIndex] + args, function(pDataInner)
						{
							I.write("Retrieved an element: " + iIndex);
							array.push(U.formatJSON(pDataInner));
						}).done(function()
						{
							// Print the result when all elements have been queried
							if (counter === successlength - 1 || counter === pLimit - 1)
							{
								printResult(array);
							}
							counter++;
						}).fail(function()
						{
							successlength--;
							if (counter === successlength - 1 || counter === pLimit - 1)
							{
								printResult(array);
							}
							I.write("Unable to retrieve API array element at: " + U.escapeHTML(url + "/" + pData[iIndex]), 0);
						});
					})(i);
				}
			}
			else
			{
				printIcon(pData);
				I.write(U.formatJSON(pData), 0);
			}
		}).fail(function()
		{
			I.write("Unable to retrieve API at: " + U.escapeHTML(url), 0);
		});
	},
	
	/*
	 * Gets the latest items that was added to the API item database.
	 * @param int pSmartIndex if positive, will list that many latest items;
	 * if negative, will list the item at that index, from end of the array.
	 * @returns string of item details.
	 */
	printItemsAPI: function(pSmartIndex)
	{
		if (O.isInteger(pSmartIndex) === false)
		{
			I.write("Invalid reverse index.");
			return;
		}
		else
		{
			I.write("Retrieving items...");
			pSmartIndex = parseInt(pSmartIndex);
		}
		
		if (E.ItemsArray.length === 0)
		{
			$.get(U.URL_API.ItemDatabase, function(pData)
			{
				E.ItemsArray = pData;
			}).done(function()
			{
				U.printItemsAPI(pSmartIndex);
			}).fail(function()
			{
				I.write("Unable to retrieve API items database.");
			});
		}
		else
		{
			var requesteditem = 0;
			var index = 0;
			if (pSmartIndex <= 0)
			{
				index = E.ItemsArray.length + pSmartIndex - 1;
				requesteditem = E.ItemsArray[index];
				$.getJSON(U.URL_API.ItemDetails + requesteditem, function(pData)
				{
					I.write("<img class='cssLeft' src='" + pData.icon + "' />" + U.formatJSON(pData), 0);
				}).fail(function()
				{
					I.write("Unable to retrieve item: " + index);
				});
			}
			else
			{
				I.clear();
				for (var i = 0; i < pSmartIndex; i++)
				{
					index = E.ItemsArray.length - pSmartIndex - 1 - i;
					requesteditem = E.ItemsArray[index];
					$.getJSON(U.URL_API.ItemDetails + requesteditem, function(pData)
					{
						I.write("<img class='cssLeft' src='" + pData.icon + "' />" + U.formatJSON(pData), 0);
					}).fail(function()
					{
						I.write("Unable to retrieve item: " + index);
					});
				}
			}
			
		}
	},
	
	/*
	 * Prints today's API daily achievements arrays in alias form.
	 */
	printDaily: function()
	{
		if (T.DailyToday !== null)
		{
			var d = T.DailyToday;
			var str = "pve: [&quot;" + d.pve[0] + "&quot;, &quot;" + d.pve[1] + "&quot;, &quot;" + d.pve[2] + "&quot;, &quot;" + d.pve[3] + "&quot;],<br />"
				+ "pvp: [&quot;" + d.pvp[0] + "&quot;, &quot;" + d.pvp[1] + "&quot;, &quot;" + d.pvp[2] + "&quot;, &quot;" + d.pvp[3] + "&quot;],<br />"
				+ "wvw: [&quot;" + d.wvw[0] + "&quot;, &quot;" + d.wvw[1] + "&quot;, &quot;" + d.wvw[2] + "&quot;, &quot;" + d.wvw[3] + "&quot;]";
			I.write(str, 0);
		}
		else
		{
			I.write("API daily achievements object is invalid.");
		}
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
		// Remember the initial page when the site loaded
		if (page !== undefined)
		{
			I.PageInitial = page.toLowerCase();
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
	 * Gets string representation of JSON object, with default parameters.
	 * @param object pObject.
	 * @returns string.
	 */
	formatJSON: function(pObject)
	{
		return JSON.stringify(pObject, null, 2);
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
	stripToAlphanumericDash: function(pString)
	{
		return pString.replace(/[^a-zA-Z0-9\-]/g, "");
	},
	stripToColorString: function(pString)
	{
		// Allow only alphanumeric and number sign (color word or a hexadecimal color)
		return pString.replace(/[^a-zA-Z0-9#]/g, "");
	},
	stripToVariable: function(pString)
	{
		// Disallow spaces and ranges of programming characters !/:@[^`{~
		return pString.replace(/ /g, "_").replace(/[0-9\u0021-\u002f\u003a-\u0040\u005b-\u005e\u0060\u007b-\u007e]/g, "");
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
	 * Shortens a title/name string based on limit, and add ellipses.
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
			.replace(/'/g, "&#39;");
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
	 * @param string pParamOptions additional query string options.
	 */
	updateQueryString: function(pParamOptions)
	{
		if (I.PageCurrent !== "")
		{
			var section = I.SectionCurrent[I.PageCurrent];
			var article = I.ArticleCurrent;
			var go = U.Args[U.KeyEnum.Go];

			var pagestring = "?" + U.KeyEnum.Page + "=" + I.PageCurrent;
			var sectionstring = "";
			var articlestring = "";
			var gostring = "";
			var modestring = "";
			pParamOptions = (pParamOptions === undefined) ? "" : "&" + pParamOptions;
			
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
			
			U.updateAddressBar(pagestring + sectionstring + articlestring + gostring + modestring + pParamOptions);
			U.updateTitle(title);
			U.updateLanguageLinks(pagestring + sectionstring + modestring);
		}
	},
	updateTitle: function(pTitle)
	{
		document.title = I.cSiteName + "/" + pTitle;
	},
	
	/*
	 * Updates the href attribute of the language links for the user to change
	 * language, while also keeping the current URL path.
	 */
	updateLanguageLinks: function(pQuery)
	{
		$(".linkLanguage").each(function()
		{
			var lang = $(this).attr("data-lang");
			var suffixes = "";
			if (pQuery === undefined)
			{
				// This should be assigned when the website loads for the first time
				suffixes = (I.ModeCurrent === I.ModeEnum.Website) ? ("?enu_Language=" + lang) : ("?enu_Language=" + lang + "&mode=" + I.ModeCurrent);
			}
			else
			{
				// This should be assigned when the user changes to a different page
				suffixes = pQuery + "&enu_Language=" + lang;
			}
			$(this).attr("href", "./" + suffixes);
		});
	},
	
	/*
	 * Triggers the button or header associated with the requested page and section,
	 * which will cause that section to expand/show. This is to be called after
	 * a page has been AJAX loaded and bindings completed.
	 * @objparam string prefix HTML ID prefix of the button to trigger, optional.
	 * @objparam string section name to override URL's, optional.
	 * @objparam string initialsection to open initially, optional.
	 * @objparam string button HTML ID of the button to trigger, optional.
	 */
	openSectionFromURL: function(pOptions)
	{
		var settings = $.extend({
			prefix: I.cHeaderPrefix + I.PageCurrent + "_",
			section: null,
			initialsection: null,
			button: null
		}, pOptions);
		
		/*
		 * Enclosed in setTimeout because without it the scroll to element
		 * animation function is glitchy (the function is called when the header
		 * is clicked so the page automatically scrolls to the header).
		 */
		setTimeout(function()
		{
			var section = U.Args[U.KeyEnum.Section];
			// If section was specified in the URL arguments
			if (section !== undefined)
			{
				section = U.stripToAlphanumeric(section);
				var elm = $(null);
				if (typeof settings.button === "string")
				{
					if (settings.section !== undefined
						&& settings.section.toLowerCase() === section.toLowerCase())
					{
						elm = $(settings.button);
					}
				}
				else
				{
					// Try going to a section name in sentence letter case
					elm = $(settings.prefix + U.toFirstUpperCase(section));
					if ( ! elm.length)
					{
						// Else try going to a section name in all caps
						elm = $(settings.prefix + section.toUpperCase());
					}
					if (I.PageCurrent === I.PageEnum.Chains)
					{
						// Click the chains header to hide it because it's shown by default
						$("#headerChains_Scheduled").trigger("click");
					}
				}
				elm.trigger("click");
			}
			// If section was specified by the function call
			else if (typeof settings.initialsection === "string")
			{
				$(settings.prefix + settings.initialsection).trigger("click");
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
				case "account": {
					$("#mapAccountButton").trigger("click");
				} break;
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
		// Prefixes the outgoing page to the URL
		return I.cSiteURL + "out/?u=" + U.encodeURL(pURL);
	},
	convertExternalAnchor: function(pURL)
	{
		// This is to be placed within the property of an <a> tag
		return " href='" + I.cSiteURL + "out/?u=" + U.encodeURL(pURL) + "' target='_blank' ";
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
		return "page/" + pPage.toLowerCase() + ".html";
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
	getGW2OfficialLink: function(pString)
	{
		return "https://www.guildwars2.com/" + D.getFullySupportedLanguage() + "/" + pString;
	},
	
	/*
	 * Converts a search query to YouTube http link.
	 * @param string pString search entry.
	 * @returns string youtube link.
	 */
	getYouTubeLink: function(pString)
	{
		return "http://www.youtube.com/results?search_query=" + U.encodeURL(pString + " " + I.cGameNick);
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
		//return "https://www.gw2tp.com/item/" + U.encodeURL(pID) + "#" + U.stripToSentence(pName);
		return "http://www.gw2spidy.com/item/" + U.encodeURL(pID) + "#" + U.stripToSentence(pName);
	},
	
	/*
	 * Gets an image URL from a third party provider for a guild banner.
	 * @param string pName of the guild.
	 * @returns string URL.
	 */
	getGuildBannerURL: function(pName)
	{
		if (pName)
		{
			var name = U.escapeHTML((pName.split(" ").join("-")).toLowerCase());
			return "http://guilds.gw2w2w.com/guilds/" + name + "/128.svg";
		}
		return "img/ui/placeholder.png";
	},
	
	/*
	 * Converts a poi_id number from maps_floor.json to a valid chatlink.
	 * Code from http://virtus-gilde.de/gw2map
	 * @param int pID of the poi.
	 * @returns string chatlink.
	 */
	getChatlinkFromPoiID: function(pID)
	{
		var chatlink = String.fromCharCode(4);
		// Create unicode characters from the id
		for (var i = 0; i < 4; i++)
		{
			chatlink += String.fromCharCode((pID >> (i * 8)) & 255);
		}
		// Return base64 string with chat code tags
		return "[&" + btoa(chatlink) + "]";
	},
	
	/*
	 * Converts an item id from items.json to a valid chatlink.
	 * Code from http://redd.it/zy8gb
	 * @param int pID of the item.
	 * @returns string chatlink.
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
	},

	/*
	 * Converts a chatlink to a plain number ID.
	 * @param string pChatlink.
	 * @param boolean pWantType if to return the type of the ID also, optional.
	 * @returns int number or null if invalid.
	 * Code from http://wiki.guildwars2.com/wiki/MediaWiki:ChatLinkSearch.js
	 */
	getGameIDFromChatlink: function(pChatlink, pWantType)
	{
		var decodeChatLink = function(pCode)
		{
			var binary = window.atob(pCode);
			var octets = new Array(binary.length);
			for (var i = 0; i < binary.length; i++)
			{
				octets[i] = binary.charCodeAt(i);
			}
			return octets;
		};
		
		var id = null;
		// Extract the code portion of the chatlink [&CODE]
		if (typeof pChatlink === "string" && pChatlink.indexOf("[&") === 0 && pChatlink.indexOf("]" === pChatlink.length - 1))
		{
			pChatlink = pChatlink.substring(2, pChatlink.length - 1);
		}
		
		try
		{
			var data = decodeChatLink(pChatlink);
			var id = data[2] << 8 | data[1];
			var type = null;
			switch (data[0])
			{
				case 2: {
					type = "item";
					id = data[3] << 8 | data[2];
					id = (data.length > 4 ? data[4] << 16 : 0) | id;
					
				} break;
				case 4: type = "location"; break;
				case 6: type = "skill"; break;
				case 8: type = "trait"; break;
				case 9: type = "recipe"; break;
				case 10: type = "skin"; break;
				case 11: type = "outfit"; break;	
			}
		}
		catch(e)
		{
			I.write("Invalid chatlink to decode.");
		}

		return (pWantType === undefined) ? id : id + " (" + type + ")";
	}
};

/* =============================================================================
 * @@Account API key management and views
 * ========================================================================== */
A = {
	
	TokenCurrent: null,
	CharacterCurrent: null,
	isAccountInitialized: false,
	Metadata: {}, // Prewritten data loaded along with account page
	Data: { // Cache for retrieved API data objects and arrays
		Account: {},
		Items: {},
		Characters: [],
		CharacterNames: null,
		Guilds: {}, // Guild details objects, accessed using the guild IDs
		Wallet: {}
	},
	URL: { // Account data type and URL substring
		Account: "account",
		Achievements: "account/achievements",
		Bank: "account/bank",
		Dyes: "account/dyes",
		Materials: "account/materials",
		Minis: "account/minis",
		Skins: "account/skins",
		Wallet: "account/wallet",
		Characters: "characters",
		Transactions: "commerce/transactions", // suffixed by "current" or "history", then "buys" or "sells"
		Stats: "pvp/stats",
		Games: "pvp/games",
		TokenInfo: "tokeninfo"
	},
	Permissions: { // Corresponds to tokeninfo.json permissions array
		account: null,
		builds: null,
		characters: null,
		guilds: null,
		inventories: null,
		progression: null,
		pvp: null,
		tradingpost: null,
		wallet: null,
		unlocks: null
	},
	
	/*
	 * Gets an authenticated API URL to retrieve account data.
	 * @param enum pSuffix type of account data.
	 * @returns string.
	 * @pre Token for use (API key) variable was initialized.
	 */
	getURL: function(pSuffix)
	{
		var divider = (pSuffix.indexOf("?") !== -1) ? "&" : "?";
		return "https://api.guildwars2.com/v2/" + pSuffix + divider + "access_token=" + A.TokenCurrent;
	},
	
	/*
	 * Sets the appearance of the account page global progress bar.
	 * @param float pPercent 0 to 1. Leave undefined to reset the bar.
	 */
	setProgressBar: function(pPercent)
	{
		var progress = $("#accProgress");
		if (pPercent === undefined)
		{
			progress.css({opacity: 1}).animate({opacity: 0}, 800, function()
			{
				$(this).css({width: "0px", opacity: 1});
			});
		}
		else
		{
			progress.animate({width: pPercent * T.cPERCENT_100 + "%", opacity: 1}, 50);
		}
	},
	
	/*
	 * Initializes common UI for the account panel.
	 */
	initializeAccount: function()
	{
		// Add new words to the dictionary
		D.addDictionary(GW2T_ACCOUNT_DICTIONARY);
		A.Metadata = GW2T_ACCOUNT_METADATA;
		
		// Initialize common UI
		var panel = $("#panelAccount");
		I.initializeScrollbar(panel);
		U.convertExternalLink("#accHelp a");
		A.initializeMenu();
		
		// Bind the window buttons
		$("#accExpand").click(function()
		{
			$("#mapDisplayButton").trigger("click");
		});
		$("#accClose").click(function()
		{
			$("#mapAccountButton").trigger("click");
		});
		
		// Initialize API keys
		A.initializeTokens();
		
		// Initialize tooltips and translate
		I.qTip.init($("#panelAccount").find("a, label, button, kbd, img"));
		$("#accContent .jsTranslate").each(function()
		{
			$(this).text(D.getPhraseOriginal($(this).text()))
				.removeClass("jsTranslate");
		});
		
		// Initialize the console, which is the same as the map's coordinates bar
		$("#accConsole").onEnterKey(function()
		{
			var val = $(this).val();
			var str = (val.charAt(0) === U.CommandPrefix) ? val : U.CommandPrefix + val;
			U.parseConsoleCommand(str, M);
		});
	
		// Finally
		A.adjustAccountPanel();
		A.isAccountInitialized = true;
	},
	
	/*
	 * Binds functionality of the account page menu bar.
	 * A menu item views its associated section, and can also contains menu icons,
	 * which views the section's subsections if available.
	 */
	initializeMenu: function()
	{
		var menu = $("#accMenu");
		for (var i in I.SectionEnum.Account)
		{
			var sectionname = I.SectionEnum.Account[i];
			var sectionnamelow = sectionname.toLowerCase();
			var menubutton = $("<aside id='accMenu" + sectionname + "' class='accMenu curClick'>"
				+ "<span>"
					+ "<img class='accMenuIcon accMenuIconMain' src='img/account/menu/" + sectionnamelow + I.cPNG + "' />"
					+ "<var class='accMenuTitle'>" + D.getPhraseOriginal(sectionname) + "</var>"
				+ "</span>"
				+ "<span class='accMenuSubsection' style='display:none;'></span>"
			+ "</aside>");
			menu.append(menubutton);
			(function(iButton, iSectionName)
			{
				// Clicking on a button shows the associated section
				iButton.click(function()
				{
					// Highlight the clicked button
					$(".accMenu").removeClass("accMenuFocused").find(".accMenuSubsection").hide();
					$(this).addClass("accMenuFocused").find(".accMenuSubsection").show();
					$(".accMenu").find(".accMenuIcon").removeClass("accMenuButtonFocused");
					$(this).find(".accMenuIconMain").addClass("accMenuButtonFocused");
					// Show the section
					$(".accPlatter").hide();
					var section = $("#accPlatter" + iSectionName);
					section.fadeIn(400, function()
					{
						A.adjustAccountPanel();
					});
					// Show the main subsection
					section.find(".accDish").hide();
					section.find(".accDishMain").show();
					// Update address
					I.SectionCurrent[I.SpecialPageEnum.Account] =
						(iSectionName === I.SectionEnum.Account.Mananger) ? "" : iSectionName;
					U.updateQueryString();
				});
				
				var subsections = $("#accPlatter" + iSectionName).find(".accDish");
				if (subsections.length)
				{
					var subbuttons = iButton.find(".accMenuSubsection");
					subbuttons.append("<img src='img/account/view.png' />");
					subsections.each(function()
					{
						if ($(this).hasClass("accDishMain") === false)
						{
							var subsectionname = U.getSubstringFromHTMLID($(this));
							var subbutton = $("<img class='accMenuSubbutton accMenuIcon' src='img/account/menu/" + subsectionname.toLowerCase() + I.cPNG + "' />");
							subbuttons.append(subbutton);
							(function(iSubbutton, iSubsection)
							{
								iSubbutton.click(function(iEvent)
								{
									iEvent.stopPropagation();
									iSubsection.parent().find(".accDish").hide();
									iSubsection.show();
									// Highlight the button
									$(this).parent().parent().find(".accMenuIcon").removeClass("accMenuButtonFocused");
									$(this).addClass("accMenuButtonFocused");
								});
							})(subbutton, $(this));
						}
					});
				}
			})(menubutton, sectionname);
		}
		
		$("#accMenuCharacters").click(function()
		{
			A.generateAndInitializeCharacters();
		});
		
		// Open the section if specified in the URL
		$("#accPlatterManager").show();
		U.openSectionFromURL({prefix: "#accMenu", initialsection: I.SectionEnum.Account.Mananger});
	},
	
	/*
	 * Adjusts the content portion of the account panel.
	 */
	adjustAccountPanel: function()
	{
		$("#accOverhead").css({width: + $("#accContent").width() + "px"});
		$("#accOverheadPadding").css({height: $("#accOverhead").height() + "px"});
		I.updateScrollbar("#panelAccount");
	},
	
	/*
	 * Initializes the API keys manager and their storage.
	 */
	initializeTokens: function()
	{
		var tokenslimit = 32;
		var tokens = localStorage[O.Utilities.APITokens.key];
		try
		{
			tokens = JSON.parse(tokens);
		}
		catch(e) {}
		if (tokens === undefined)
		{
			tokens = [];
			tokens.push(A.createToken("Example Key Name", "EXAMPLE-API-KEY-PLEASE-REPLACE-WITH-YOUR-OWN-HERE"));
		}
		for (var i = 0; i < tokens.length; i++)
		{
			var token = tokens[i];
			A.insertTokenRow(token.name, token.key, token.isUsed);
		}
		A.saveTokens();
		A.loadToken();
		
		// Bind button to add another token/row
		$("#accTokenNew").click(function()
		{
			if (O.Utilities.APITokens.value.length < tokenslimit)
			{
				A.insertTokenRow("", "");
				A.saveTokens();
			}
			else
			{
				I.write("API tokens limit reached.");
			}
		});
	},
	
	/*
	 * Creates a token object which contains a token's name and the API key string.
	 * @param string pName.
	 * @param pAPIKey pAPIKey.
	 * @returns object.
	 */
	createToken: function(pName, pAPIKey)
	{
		return {
			name: pName,
			key: pAPIKey
		};
	},
	
	/*
	 * Reads text from the token inputs then serialize and store them.
	 */
	saveTokens: function()
	{
		var tokens = [];
		$(".accToken").each(function()
		{
			var name = U.escapeHTML($(this).find(".accTokenName").val());
			var key = U.stripToAlphanumericDash($(this).find(".accTokenKey").val());
			var token = A.createToken(name, key);
			if ($(this).find(".accTokenUse").hasClass("btnFocused"))
			{
				token.isUsed = true;
			}
			tokens.push(token);
		});
		var obj = O.Utilities.APITokens;
		obj.value = tokens;
		localStorage[obj.key] = JSON.stringify(obj.value);
	},
	
	/*
	 * Readies the account panel for the current API key.
	 */
	loadToken: function()
	{
		if (A.TokenCurrent === null)
		{
			return;
		}
		
		// Reset variables so the sections will reload the account data
		for (var i in A.Permissions)
		{
			A.Permissions[i] = null;
		}
		A.Data.CharacterNames = null;
		
		// Initialize permissions
		$.getJSON(A.getURL(A.URL.TokenInfo), function(pData)
		{
			for (var i in pData.permissions)
			{
				var permission = pData.permissions[i];
				A.Permissions[permission] = true;
			}
		}).fail(function()
		{
			A.printError("account");
		});
	},
	
	/*
	 * Prints standard API key error message to the console.
	 * @param string pRequestType the permission requested.
	 * @param string pStatus from AJAX.
	 */
	printError: function(pRequestType, pStatus)
	{
		if (pStatus === "error")
		{
			I.write("Unable to retrieve response. ArenaNet API servers may be down.");
		}
		else
		{
			I.write("Unable to retrieve data for this key from ArenaNet API servers.");
		}
		I.write(A.TokenCurrent);
		if (pRequestType)
		{
			I.write("Requested permission: " + pRequestType, 5);
		}
	},
	
	/*
	 * Prints data from an account API.
	 * @param string pURLSuffix.
	 */
	printAccount: function(pURLSuffix)
	{
		I.write("Loading " + pURLSuffix + "...", 0);
		$.ajax({
			dataType: "json",
			url: A.getURL(pURLSuffix),
			cache: false,
			success: function(pData, pStatus, pRequest)
			{
				I.write(U.formatJSON(pData), 0);
			},
			error: function(pRequest, pStatus)
			{
				A.printError(null, pStatus);
			}
		});
	},
	
	/*
	 * Inserts a token (row) into the API key manager.
	 * @param string pName.
	 * @param string pAPIKey.
	 */
	insertTokenRow: function(pName, pAPIKey, pIsUsed)
	{
		var token = $("<div class='accToken'></div>").appendTo("#accManager");
		var key = $("<input class='accTokenKey' type='text' value='" + pAPIKey + "' maxlength='128' />").appendTo(token);
		var name = $("<input class='accTokenName' type='text' value='" + pName + "' maxlength='64' />").appendTo(token);
		var buttons = $("<div class='accTokenButtons'></div>").appendTo(token);
		var use = $("<button class='accTokenUse'><img src='img/ui/check.png' /></button>").appendTo(buttons);
		var del = $("<button class='accTokenDelete'><img src='img/ui/default.png' /></button>").appendTo(buttons);
		var swap = $("<span class='btnSwap'></span>").appendTo(buttons);
		var swapup = $("<button class='btnSwapUp'></button>").appendTo(swap);
		var swapdown = $("<button class='btnSwapDown'></button>").appendTo(swap);
		
		// Use the token if specified
		if (pIsUsed !== undefined && pIsUsed === true)
		{
			A.TokenCurrent = U.stripToAlphanumericDash(pAPIKey);
			use.addClass("btnFocused");
		}
		
		// Button to use this token's API key
		use.click(function()
		{
			var str = key.val();
			if (str.length > 0)
			{
				$("#accManager button").removeClass("btnFocused");
				use.addClass("btnFocused");
				A.TokenCurrent = U.stripToAlphanumericDash(str);
				A.loadToken();
				A.saveTokens();
			}
			else
			{
				I.write("Please enter a valid API key.");
			}
		});
		// Button to delete this token
		del.click(function()
		{
			var str = key.val();
			if (O.Utilities.APITokens.value.length > 1)
			{
				// Ask for confirmation if key is not empty
				if (str.length > 0)
				{
					if (confirm("Delete this API token?"))
					{
						token.remove();
						A.saveTokens();
					}
				}
				else
				{
					token.remove();
					A.saveTokens();
				}
			}
			else
			{
				I.write("Must have at least one API token.");
			}
		});
		// Autoselect the input boxes on click and save on change
		$([name, key]).each(function()
		{
			$(this).click(function()
			{
				$(this).select();
			}).change(function()
			{
				A.saveTokens();
			});
		});
		// Highlight the row when hovered on a button
		buttons.hover(
			function()
			{
				name.addClass("accTokenHovered");
				key.addClass("accTokenHovered");
			},
			function()
			{
				name.removeClass("accTokenHovered");
				key.removeClass("accTokenHovered");
			}
		);
		// Button to raise or lower the token's row order
		$([swapup, swapdown]).each(function()
		{
			$(this).click(function()
			{
				if ($(this).hasClass("btnSwapUp"))
				{
					if (token.prev().hasClass("accToken")) // Prevent out of bounds
					{
						token.insertBefore(token.prev());
					}
				}
				else
				{
					if (token.next().hasClass("accToken"))
					{
						token.insertAfter(token.next());
					}
				}
				A.saveTokens();
			});
		});
	},
	
	/*
	 * Initializes the characters subpage.
	 */
	generateAndInitializeCharacters: function()
	{
		// Don't retrieve if already did
		if (A.Data.CharacterNames !== null)
		{
			return;
		}
		
		$("#chrSummary, #chrStatistics ul").empty();
		$(".chrWallet").remove();
		$(".chrStats").hide();
		var platter = $("#accPlatterCharacters");
		platter.prepend(I.cThrobber);
		$.getJSON(A.getURL(A.URL.Characters), function(pData)
		{
			I.removeThrobber(platter);
			var charindex = 0;
			var numfetched = 0;
			var numcharacters = pData.length;
			A.Data.CharacterNames = pData;
			A.CharacterCurrent = null;
			A.Data.Characters = null;
			A.Data.Characters = new Array(numcharacters);
			A.Data.CharacterNames.forEach(function(iCharacter)
			{
				$("#chrSelection").append("<li id='chrSelection_" + charindex + "' class='curClick'></li>");
				$("#chrUsage").append("<li id='chrUsage_" + charindex + "'></li>");
				$("#chrSeniority").append("<li id='chrSeniority_" + charindex + "'></li>");
				(function(iIndex)
				{
					$.ajax({
						dataType: "json",
						url: A.getURL(A.URL.Characters + "/" + U.encodeURL(iCharacter)),
						cache: true,
						success: function(pData, pStatus, pRequest)
						{
							// Check retrieval progress
							A.Data.Characters[iIndex] = pData;
							(A.Data.Characters[iIndex]).charindex = iIndex;
							(A.Data.Characters[iIndex]).charname = U.escapeHTML(pData.name);
							A.generateCharactersSelection(pData);
							numfetched++;
							A.setProgressBar(numfetched / numcharacters);
							if (numfetched === numcharacters)
							{
								A.setProgressBar();
								A.generateCharactersStatistics();
							}
						},
						error: function(pRequest, pStatus)
						{
							I.write("Error retrieving data for character: " + U.escapeHTML(iCharacter));
						}
					});
				})(charindex);
				charindex++;
			});
		}).fail(function()
		{
			I.removeThrobber(platter);
			A.printError("characters");
		});
	},
	
	/*
	 * Generates a row in the first column showing common information about a character.
	 * @param object pCharacter characters data.
	 */
	generateCharactersSelection: function(pCharacter)
	{
		// Gets the profession icon or elite spec icon if available from the character data
		var getProfession = function(pCharacterInner)
		{
			var icon = (pCharacterInner.profession).toLowerCase();
			pCharacterInner.charicon = icon;
			if (pCharacterInner.specializations && pCharacterInner.specializations.pve)
			{
				var specs = pCharacterInner.specializations.pve;
				for (var i = 0; i < specs.length; i++)
				{
					if (specs[i])
					{
						// If one of the character's specs is found to be in the elite spec
						var specid = specs[i].id;
						if (A.Metadata.ProfElite[specid] !== undefined)
						{
							icon = A.Metadata.ProfElite[specid];
							pCharacterInner.charicon = icon; // Remember the icon
							break;
						}
					}
				}
			}
			return icon;
		};
		
		// Get active crafting disciplines
		var craftused = "";
		var crafttooltip = "";
		if (pCharacter.crafting && pCharacter.crafting.length > 0)
		{
			pCharacter.crafting.forEach(function(iCraft)
			{
				var trivial = (iCraft.rating >= A.Metadata.CraftingRank.Master) ? "" : "chrTrivial";
				var craftstr = "<b class='" + trivial + "'><ins class='acc_craft acc_craft_" + (iCraft.discipline).toLowerCase() + "'></ins>"
					+ "<sup class='chrCraftingRating'>" + iCraft.rating + "</sup></b> ";
				if (iCraft.active)
				{
					craftused += craftstr;
				}
				crafttooltip += craftstr + " ";
			});
		}
		
		// SELECTION COLUMN (left)
		var charvalue = A.Metadata.Race[(pCharacter.race).toLowerCase() + "_" + (pCharacter.gender).toLowerCase()] || 1;
		var professionvalue = (A.Metadata.Profession[(pCharacter.profession).toLowerCase()]).weight;
		var trivial = (pCharacter.level === A.Metadata.ProfLevel.Max) ? "" : "chrTrivial";
		$("#chrSelection_" + pCharacter.charindex).append(
			"<img class='chrPortrait' src='img/account/characters/" + (pCharacter.race).toLowerCase() + "_" + (pCharacter.gender).toLowerCase() + I.cPNG + "' />"
			+ "<var id='chrName_" + pCharacter.charindex + "' class='chrName' data-value='" + charvalue + "'>" + pCharacter.charname + "</var>"
			+ "<span class='chrCommitment' data-value='" + professionvalue + "'>"
				+ "<var class='chrProfession " + trivial + "'>"
					+ "<ins class='chrProfessionIcon acc_prof acc_prof_" + getProfession(pCharacter) + "'></ins><sup>" + pCharacter.level + "</sup></var>"
				+ "<var class='chrCrafting'>" + craftused + "</var>"
			+ "</span>"
			+ "<img class='chrProceed' src='img/account/view.png' />")
		.click(function()
		{
			var charindex = U.getSubintegerFromHTMLID($(this));
			if (A.CharacterCurrent === charindex)
			{
				A.CharacterCurrent = null;
				$(this).find(".chrProceed").animate({rotation: 0}, {duration: 200, queue: false});
			}
			else
			{
				A.CharacterCurrent = charindex;
				$(".chrProceed").animate({rotation: 0}, {duration: 200, queue: false});
				$(this).find(".chrProceed").animate({rotation: 90}, {duration: 200, queue: false});
			}
		});
		// Additional information as tooltip
		I.qTip.init($("#chrSelection_" + pCharacter.charindex).find(".chrCommitment").attr("title", crafttooltip));
	},
	
	/*
	 * Generates the columns for presenting the character's data values.
	 */
	generateCharactersStatistics: function()
	{
		var now = new Date();
		var nowmsec = now.getTime();
		var hourstr = D.getWord("h");
		var daystr = D.getWord("d");
		var yearstr = D.getWord("y");
		var highestage = 0;
		var highestdeaths = 0;
		var highestlifetime = 0;
		var totalage = 0;
		var totaldeaths = 0;
		
		// First loop to find max values for age and deaths
		A.Data.Characters.forEach(function(iData)
		{
			if (highestage < iData.age)
			{
				highestage = iData.age;
			}
			if (highestdeaths < iData.deaths)
			{
				highestdeaths = iData.deaths;
			}
			iData.charlifetime = ~~((nowmsec - (new Date(iData.created)).getTime()) / T.cMILLISECONDS_IN_SECOND);
			if (highestlifetime < iData.charlifetime)
			{
				highestlifetime = iData.charlifetime;
			}
		});
		// Write a row for each character
		A.Data.Characters.forEach(function(iData)
		{
			var name = "<abbr>" + U.escapeHTML(iData.name) + "</abbr>";
			// USAGE COLUMN (middle)
			totalage += iData.age; // Seconds
			totaldeaths += iData.deaths;
			var age = Math.round(iData.age / T.cSECONDS_IN_HOUR);
			var agepercent = (iData.age / highestage) * T.cPERCENT_100;
			var deathpercent = (iData.deaths / highestdeaths) * T.cPERCENT_100;
			var usage = "<var class='chrAge' title='" + T.formatSeconds(iData.age) + "' data-value='" + age + "'>" + age + hourstr + "</var>"
				+ "<span class='chrHoverName'>" + name + "<samp><s class='cssRight' style='width:" + agepercent + "%'></s></samp>"
					+ "<samp><s style='width:" + deathpercent + "%'></s></samp></span>"
				+ "<var class='chrDeaths' title='" + T.parseRatio(age / iData.deaths, 3) + "' data-value='" + iData.deaths + "'>" + iData.deaths + "x</var>";
			$("#chrUsage_" + iData.charindex).append(usage);
			// SENIORITY COLUMN (right)
			var birthdate = (new Date(iData.created)).toLocaleString();
			var birthdays = ~~(iData.charlifetime / T.cSECONDS_IN_YEAR);
			var lifetime = ~~(iData.charlifetime / T.cSECONDS_IN_DAY);
			var lifetimepercent = (iData.charlifetime / highestlifetime) * T.cPERCENT_100;
			var birthdaysince = ~~((iData.charlifetime % T.cSECONDS_IN_YEAR) / T.cSECONDS_IN_DAY);
			var birthdaytill = T.cDAYS_IN_YEAR - birthdaysince;
			var birthdaypercent = (birthdaysince / T.cDAYS_IN_YEAR) * T.cPERCENT_100;
			var seniority = "<var class='chrLifetime' data-value='" + iData.charlifetime + "'>" + lifetime + daystr + " (" + birthdays + yearstr + ")</var>"
				+ "<span class='chrHoverName'>" + name + "<samp><s class='cssRight' style='width:" + lifetimepercent + "%'></s></samp>"
					+ "<samp><s style='width:" + birthdaypercent + "%'></s></samp></span>"
				+ "<var class='chrBirthday' data-value='" + birthdaysince + "'>" + birthdaytill + daystr + "</var>"
				+ "<var class='chrBirthdate'>" + birthdate + "</var>";
			$("#chrSeniority_" + iData.charindex).append(seniority);
		});
		// Highlight the character's name when hovered over a statistics row
		$(".chrStats li").hover(
			function() { $("#chrSelection_" + U.getSubstringFromHTMLID($(this))).css({outline: "1px solid red"}); },
			function() { $("#chrSelection_" + U.getSubstringFromHTMLID($(this))).css({outline: "none"}); }
		);
		// Insert header above the columns
		var sym = " <b class='chrHeaderToggle'>" + I.Symbol.TriDown + "</b>";
		$("#chrSelection").prepend("<li class='chrHeader'><var class='chrHeaderLeft curClick' data-classifier='chrName'>"
			+ A.Data.Characters.length + " "
			+ D.getWordCapital("characters") + sym + "</var><var class='chrHeaderRight curClick' data-classifier='chrCommitment'>"
			+ D.getWordCapital("profession") + sym + "</var></li>");
		$("#chrUsage").prepend("<li class='chrHeader'><var class='chrHeaderLeft curClick' data-classifier='chrAge'>"
			+ D.getWordCapital("age") + sym + "</var><var class='chrHeaderRight curClick' data-classifier='chrDeaths'>"
			+ D.getWordCapital("deaths") + sym + "</var></li>");
		$("#chrSeniority").prepend("<li class='chrHeader'><var class='chrHeaderLeft curClick' data-classifier='chrLifetime'>"
			+ D.getWordCapital("lifetime") + sym + "</var><var class='chrHeaderRight curClick' data-classifier='chrBirthday'>"
			+ D.getWordCapital("birthday") + sym + "</var></li>");
		// Header click to sort the columns
		$(".chrHeaderLeft, .chrHeaderRight").click(function()
		{
			A.toggleSortableHeader($(this));
			A.sortCharacters($(this).attr("data-classifier"), $(this).data("isdescending"));
		});
		// SUMMARY MARQUEE (top)
		$.getJSON(A.getURL(A.URL.Account), function(pData)
		{
			A.Data.Account = pData;
			var accountname = U.escapeHTML(((pData.name).split("."))[0]); // Omit the identifier number from the account name
			var totalagehour = Math.round(totalage / T.cSECONDS_IN_HOUR);
			var accountbirthdate = new Date(pData.created);
			var accountlifetime = ~~((nowmsec - accountbirthdate.getTime()) / T.cMILLISECONDS_IN_SECOND);
			var accountbirthdaysince = T.formatSeconds(accountlifetime).trim();
			var commandership = (pData.commander) ? "" : "chrTrivial";
			var access = (pData.access) ? "" : "chrTrivial";
			var accountadditional = "<span id='chrAccountMisc'>"
				+ "<dfn title='" + U.escapeHTML(pData.id) + "'>" + U.escapeHTML(pData.name) + "</dfn><br />" + accountbirthdate.toLocaleString() + "<br />"
				+ "<img class='" + commandership +  "' src='img/account/commander.png' />"
				+ "<img class='" + access +  "' src='img/account/access_hot.png' /> "
				+ "<img src='img/account/fractal.png' />" + (pData.fractal_level || "?") + " "
				+ "<img src='img/account/daily.png' />" + (pData.daily_ap || "?") + " "
				+ "<img src='img/account/monthly.png' />" + (pData.monthly_ap || "?")
			+ "</span><br />";
			var summary = "<var id='chrAccountName'>" + accountname + "</var>"
				+ accountadditional
				+ "<var id='chrAccountServer'></var><br />"
				+ "<var id='chrAccountAge' title='" + T.formatSeconds(totalage) + "'>" + totalagehour + hourstr + "</var> / "
					+ "<var id='chrAccountDeaths' title='" + T.parseRatio(totalagehour / totaldeaths, 3) + "'>" + totaldeaths + "x</var> &nbsp; "
					+ "<var id='chrAccountLifetime'>" + accountbirthdaysince +  "</var>";
			$("#chrSummary").append(summary);
			I.qTip.init("#chrSummary var");
			// Insert server name
			$.getJSON(U.URL_API.Worlds + pData.world, function(pDataInner)
			{
				if (Array.isArray(pDataInner) && pDataInner.length > 0)
				{
					$("#chrAccountServer").text(pDataInner[0].name);
				}
			});
			// Retrieve and insert guilds
			A.initializeGuilds(pData.guilds);
			A.initializeWallet();
			// Finally for the summary
			$("#chrSummary").show("fast");
		});
		
		// Finally
		I.qTip.init("#accPlatterCharacters var");
		$(".chrStats").show("fast");
	},
	
	/*
	 * Rearranges all the characters columns based on one column's data values.
	 * @param string pClassifier class names of data containing cells.
	 * @param boolean pOrder descending if true, ascending if false.
	 */
	sortCharacters: function(pClassifier, pOrder)
	{
		var sortable = [];
		$("." + pClassifier).each(function()
		{
			sortable.push({
				// Get the index from the list item containing the value
				index: U.getSubintegerFromHTMLID($(this).parent()),
				value: parseInt($(this).attr("data-value"))
			});
		});
		O.sortObjects(sortable, "value", pOrder);
		
		// Sort all the rows using the new order
		for (var i = 0; i < sortable.length; i++)
		{
			var index = sortable[i].index;
			$("#chrSelection_" + index).appendTo("#chrSelection");
			$("#chrUsage_" + index).appendTo("#chrUsage");
			$("#chrSeniority_" + index).appendTo("#chrSeniority");
		}
	},
	
	/*
	 * Caches guild details objects and writes guild information where needed.
	 * @param array pGuilds containing guild IDs.
	 */
	initializeGuilds: function(pGuilds)
	{
		if (pGuilds === undefined || pGuilds === null || pGuilds.length <= 0)
		{
			return;
		}
		
		// Add guild information to HTML
		var finalizeGuilds = function()
		{
			// Guild tag next to each character's name
			A.Data.Characters.forEach(function(iCharacter)
			{
				if (iCharacter.guild)
				{
					var guildtag = "<sup class='chrTag'>[" + (A.Data.Guilds[iCharacter.guild]).tag + "]" + "</sup>";
					$("#chrName_" + iCharacter.charindex).append(guildtag);
				}
			});
			
			var guildheader = "<li class='chrHeader'><var class='chrHeaderLeft'>" + D.getWordCapital("guilds") + "</var></li>";
			$("#chrGuilds").append(guildheader);
			for (var i in pGuilds)
			{
				var guild = A.Data.Guilds[(pGuilds[i])];
				var banner = U.getGuildBannerURL(guild.guild_name);
				var guildrow = "<li class='chrGuild'><span class='chrGuildHover'><img class='chrGuildBanner' src='" + banner + "' />"
						+ "<img class='chrGuildBanner chrGuildBannerLarge' src='" + banner + "' /></span>"
					+ "<var class='chrGuildName'>" + guild.guild_name + " [" + guild.tag + "]</var></li>";
				$("#chrGuilds").append(guildrow);
			}
		};
		
		// Fetch the guild details from the array of guild IDs
		var numfetched = 0;
		for (var i = 0; i < pGuilds.length; i++)
		{
			// Only fetch if haven't cached it
			if (A.Data.Guilds[(pGuilds[i])] === undefined)
			{
				$.getJSON(U.URL_API.GuildDetails + pGuilds[i], function(pData)
				{
					A.Data.Guilds[pData.guild_id] = pData;
					numfetched++;
					if (numfetched === pGuilds.length)
					{
						finalizeGuilds();
					}
				});
			}
			else
			{
				numfetched++;
				if (numfetched === pGuilds.length)
				{
					finalizeGuilds();
				}
			}
			
		}
	},
	
	/*
	 * Initializes the wallet object and generate columns (categorized wallets) for currencies.
	 */
	initializeWallet: function()
	{
		var generateWallet = function(pWallet, pName)
		{
			// Prepare HTML
			var wallet = $("<ul id='chrWallet_" + pName + "' class='chrStats chrWallet'></ul>").insertBefore("#chrGuilds");
			var header = "";
			switch (pName)
			{
				case "General": header = D.getModifiedWord("currencies", "general", U.CaseEnum.Every); break;
				case "Dungeon": header = D.getModifiedWord("tokens", "dungeon", U.CaseEnum.Every); break;
				case "Map": header = D.getModifiedWord("tokens", "map", U.CaseEnum.Every); break;
			}
			var sym = " <b class='chrHeaderToggle'>" + I.Symbol.TriDown + "</b>";
			wallet.append("<li class='chrHeader'><var class='chrHeaderLeft curClick'>" + header + sym + "</var></li>");
			A.bindSortableList(wallet);
			
			// First loop to find max value of the wallet
			var value, amount, coef, amountstr;
			for (var i = 0; i < pWallet.length; i++)
			{
				amount = A.Data.Wallet[(pWallet[i].id)];
				amount = (amount === undefined || amount === null) ? 0 : amount;
				coef = pWallet[i].coefficient;
				// Adjust the value so the currencies can be compared
				pWallet[i].value = (coef === undefined) ? amount : (amount * coef);
			}
			var max = T.getMinMax(pWallet, "value").max;
			
			// Generate the currencies for this wallet
			for (var i = 0; i < pWallet.length; i++)
			{
				var currency = pWallet[i];
				amount = A.Data.Wallet[currency.id];
				amount = (amount === undefined || amount === null) ? 0 : amount;
				amountstr = amount.toLocaleString();
				value = currency.value;
				switch (currency.id)
				{
					case 1: amountstr = E.createCoinString(amount, true); break;
					case 2: amountstr = E.createKarmaString(amount, true); break;
					case 3: amountstr = E.createLaurelString(amount, true); break;
					case 4: amountstr = E.createGemString(amount, true); break;
				}

				var percent = (value / max) * T.cPERCENT_100;
				var name = D.getObjectName(currency);
				var link = U.getWikiLanguageLink(name);
				wallet.append("<li data-value='" + value + "'>"
					+ "<var class='chrWalletAmount'>" + amountstr + "</var>"
					+ "<ins class='acc_wallet acc_wallet_" + currency.id + "'></ins>"
					+ "<var class='chrWalletCurrency'><a class='chrWalletLink'" + U.convertExternalAnchor(link) + ">" + name + "</a></var>"
					+ "<samp><s style='width:" + percent + "%'></s></samp>"
				+ "</li>");
			}
		};
		
		$.getJSON(A.getURL(A.URL.Wallet), function(pData)
		{
			A.Data.Wallet = null;
			A.Data.Wallet = {};
			// Convert the API array of currency objects into an associative array of currency IDs and values
			for (var i = 0; i < pData.length; i++)
			{
				var currency = pData[i];
				A.Data.Wallet[currency.id] = parseInt(currency.value);
			}

			var wallets = GW2T_CURRENCY_DATA;
			for (var i in wallets)
			{
				generateWallet(wallets[i], i);
			}
		});
	},
	
	/*
	 * Binds a sortable list by binding its clickable header.
	 * @param jqobject pList to bind.
	 */
	bindSortableList: function(pList)
	{
		var header = $(pList).find("li").first();
		header.click(function()
		{
			A.toggleSortableHeader($(this));
			A.sortList($(this).parent(), $(this).data("isdescending"));
		});
	},
	
	/*
	 * Toggles the icon and boolean data value of a header.
	 * @param jqobject pHeader to bind.
	 */
	toggleSortableHeader: function(pHeader)
	{
		var header = $(pHeader);
		// Sort and toggle the boolean
		var isdescending = header.data("isdescending");
		if (isdescending === undefined)
		{
			isdescending = false;
		}
		header.data("isdescending", !isdescending);
		// Change symbol
		var symbol = (isdescending) ? I.Symbol.TriUp : I.Symbol.TriDown;
		header.find(".chrHeaderToggle").html(symbol);
	},
	
	/*
	 * Sorts a list with a single set of numeric data.
	 * @param jqobject pColumn to sort.
	 * @param boolean pOrder descending if true, ascending if false.
	 * @pre Each list item in the column has the data-value attribute initialized.
	 */
	sortList: function(pList, pOrder)
	{
		var list = $(pList);
		var sortable = [];
		// Loop every list items, except the first which is the header
		list.find("li").slice(1).each(function()
		{
			sortable.push({
				item: $(this),
				value: parseFloat($(this).attr("data-value"))
			});
		});
		O.sortObjects(sortable, "value", pOrder);
		
		for (var i = 0; i < sortable.length; i++)
		{
			(sortable[i].item).appendTo(list);
		}
	},
	
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
		Chest: { key: "str_chlChest", value: "" },
		ResourceRich: { key: "str_chlResourceRich", value: "" },
		ResourceRegular: { key: "str_chlResourceRegular", value: "" },
		ResourceHotspot: { key: "str_chlResourceHotspot", value: "" },
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
		// Temporary
		//LivingStory: { key: "str_chlWintersdayOrphans", urlkey: "orphans", value: ""},
		// Repeatable
		NoxiousPods: { key: "str_chlNoxiousPods", urlkey: "noxiouspods", value: ""},
		CrystallizedCaches: { key: "str_chlCrystallizedCaches", urlkey: "crystallizedcaches", value: ""},
		ExaltedChests: { key: "str_chlExaltedChests", urlkey: "exaltedchests", value: ""},
		AirshipCargo: { key: "str_chlAirshipCargo", urlkey: "airshipcargo", value: ""},
		BuriedChests: { key: "str_chlBuriedChests", urlkey: "chests", value: ""},
		BanditChests: { key: "str_chlBanditChests", urlkey: "banditchests", value: ""},
		MatrixCubeKey: { key: "str_chlMatrixCubeKey", urlkey: "matrixcubekey", value: ""},
		// Heart of Thorns
		ItzelTotems: { key: "str_chlItzelTotems", urlkey: "itzeltotems", value: ""},
		PriorySeals: { key: "str_chlPriorySeals", urlkey: "prioryseals", value: ""},
		AuricTablets: { key: "str_chlAuricTablets", urlkey: "aurictablets", value: ""},
		ExaltedMasks: { key: "str_chlExaltedMasks", urlkey: "exaltedmasks", value: ""},
		// Pre-expansion
		LionsArchExterminator: { key: "str_chlLionsArchExterminator", urlkey: "lionsarchexterminator", value: ""},
		CoinProspect: { key: "str_chlCoinProspect", urlkey: "coinprospect", value: ""},
		CoinUplands: { key: "str_chlCoinUplands", urlkey: "coinuplands", value: ""},
		CoinChallenger: { key: "str_chlCoinChallenger", urlkey: "coinchallenger", value: ""},
		LostBadges: { key: "str_chlLostBadges", urlkey: "lostbadges", value: ""},
		GoldenLostBadges: { key: "str_chlGoldenLostBadges", urlkey: "goldenlostbadges", value: ""},
		DiveMaster: { key: "str_chlDiveMaster", urlkey: "divemaster", value: ""},
		SpeedyReader: { key: "str_chlSpeedyReader", urlkey: "speedyreader", value: ""},
		CleaningUp: { key: "str_chlCleaningUp", urlkey: "cleaningup", value: ""},
		HistoryBuff: { key: "str_chlHistoryBuff", urlkey: "historybuff", value: ""},
		// Hero progress
		Strongboxes: { key: "str_chlStrongboxes", urlkey: "strongboxes", value: ""},
		MasteryInsight: { key: "str_chlMasteryInsight", urlkey: "masteryinsight", value: ""},
		HeroChallenge: { key: "str_chlHeroChallenge", urlkey: "herochallenge", value: ""}
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
		CustomTextDaily: { key: "str_txlCustomTextDaily", value: [], valueDefault: [] },
		CustomTextWeekly: { key: "str_txlCustomTextWeekly", value: [], valueDefault: [] },
		NotepadText: { key: "str_txlNotepadText", value: [], valueDefault: [] },
		TradingItem: { key: "str_txlTradingItem", value: [] },
		TradingName: { key: "str_txlTradingName", value: [] },
		TradingBuy: { key: "str_txlTradingBuy", value: [] },
		TradingSell: { key: "str_txlTradingSell", value: [] },
		TradingQuantity: { key: "str_txlTradingQuantity", value: [] },
		NotifyBuyLow: { key: "str_txlNotifyBuyLow", value: [] },
		NotifyBuyHigh: { key: "str_txlNotifyBuyHigh", value: [] },
		NotifySellLow: { key: "str_txlNotifySellLow", value: [] },
		NotifySellHigh: { key: "str_txlNotifySellHigh", value: [] },
		ExchangeUnit: { key: "str_txlExchangeUnit", value: [] }
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
	 * @param enum pJob to check or uncheck the checklist.
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
	 * Programmatically selects an option in a fieldset input.
	 */
	setFieldsetState: function(pName, pOrder)
	{
		$("fieldset[name='" + pName + "'] input:eq(" + pOrder + ")").trigger("click");
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
		
		pCheckboxes.each(function(iIndex)
		{
			$(this).change(function()
			{
				var state = X.getCheckboxEnumState($(this));
				
				X.setChecklistItem(pChecklist, iIndex, state);
			});
			
			// Now that this checkbox is bound, trigger it as the state in checklist
			X.triggerCheckboxEnumState(pChecklist, iIndex, $(this));
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
			// Load the stored text and regard missing entries
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
			pTextFields.each(function(iIndex)
			{
				// Do not allow delimiter in the string to be stored
				pTextlist.value[iIndex] = $(this).val().replace(I.cTextDelimiterRegex, "");
			});
			localStorage[pTextlist.key] = pTextlist.value.join(I.cTextDelimiterChar);
		};
		
		// Bind text fields behavior
		pTextFields.each(function(iIndex)
		{
			$(this).attr("maxlength", pMaxLength); // Set number of characters allowed in the text field
			$(this).val(pTextlist.value[iIndex]); // Load initialized text
			
			$(this).change(function()
			{
				if (pFieldName)
				{
					I.write(pFieldName + " #" + (iIndex + 1) + " updated.");
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
					pTextFields.each(function(iIndex)
					{
						$(this).val(pTextlist.valueDefault[iIndex]).trigger("change");
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
		$("#chlDungeon input").each(function(iIndex)
		{
			// Bind checkbox behavior
			$(this).change(function()
			{
				var state = X.getCheckboxEnumState($(this));
				
				X.setChecklistItem(X.Checklists.Dungeon, iIndex, state);
				X.styleCheckbox(X.Checklists.Dungeon, iIndex, $(this));
				
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
		$("#chlDungeon label").each(function(iIndex)
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
				X.setChecklistItem(X.Checklists.Dungeon, iIndex, X.getCheckboxEnumState(checkbox));
				X.styleCheckbox(X.Checklists.Dungeon, iIndex, checkbox);
			});
		});
		
		// Restore checklist state from stored by triggering the checkboxes (behaviors already bound)
		$("#chlDungeon input").each(function(iIndex)
		{
			X.triggerCheckboxEnumState(X.Checklists.Dungeon, iIndex, $(this));
		});
		
		// Bind uncheck all button
		$("#chlDungeonUncheck").click(function()
		{
			X.clearChecklist(X.Checklists.Dungeon, X.ChecklistJob.UncheckTheChecked);
			$("#chlDungeon input").each(function(iIndex)
			{
				if ($(this).prop("checked") === true)
				{
					$(this).trigger("click");
				};
				X.styleCheckbox(X.Checklists.Dungeon, iIndex, $(this));
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
		var insertSampleList = function(pList)
		{
			var samples = $(pList).attr("data-samples").split(I.cTextDelimiterChar);
			for (var i = 0; i < samples.length; i++)
			{
				$(pList + " input[type='text']:eq(" + i + ")").val(samples[i]);
			}
		};
		insertSampleList("#chlCustomListDaily");
		insertSampleList("#chlCustomListWeekly");
		
		// Bind checkboxes and textboxes behavior
		var bindCustomChecklistBehavior = function(pChecklist, pTextlist, pListName)
		{
			var checkboxes = $("#chlCustomList" + pListName + " input:checkbox");
			X.initializeChecklist(pChecklist, checkboxes.length);

			checkboxes.each(function(iIndex)
			{
				$(this).change(function()
				{
					var state = X.getCheckboxEnumState($(this));

					X.setChecklistItem(pChecklist, iIndex, state);
					X.styleCheckbox(pChecklist, iIndex, $(this));

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
				X.triggerCheckboxEnumState(pChecklist, iIndex, $(this));
			});

			// Bind uncheck all button
			$("#chlCustomUncheck" + pListName).click(function()
			{
				X.clearChecklist(pChecklist, X.ChecklistJob.UncheckTheChecked);
				$("#chlCustomList" + pListName + " input:checkbox").each(function(iIndex)
				{
					if ($(this).prop("checked"))
					{
						$(this).trigger("click");
					};
					X.styleCheckbox(pChecklist, iIndex, $(this));
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
		$("#chlNotepadButtons button").each(function(iIndex)
		{
			$(this).click(function()
			{
				// Show selected number's sheet
				$("#chlNotepadSheets textarea").hide().eq(iIndex).show()
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
	ItemsArray: [],
	RefreshTimeout: {},
	ProgressTimeout: {},
	ProgressWait: 0,
	ProgressTick: 0,
	SwapIndex: -1,
	
	CalculatorHistoryArray: new Array(64),
	CalcHistoryIndex: 0,
	
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
	 * Formats a currency amount and appends a currency unit icon.
	 * @param string pCurrency as defined in the CSS as a custom HTML tag that
	 * has color attribute associated with that currency.
	 * @param int pAmount.
	 * @param boolean pWantColor whether to colorize the amount.
	 * @returns HTML string.
	 */
	createCurrencyString: function(pCurrency, pAmount, pWantColor)
	{
		if (pAmount === undefined || isFinite(pAmount) === false)
		{
			return "0";
		}
		pAmount = parseInt(pAmount);
		
		var c = pCurrency;
		var s0 = "";
		var s1 = "";
		var s2 = "<" + c + "unit></" + c + "unit>";
		if (pWantColor)
		{
			s0 = "<" + c + ">";
			s1 = "</" + c + ">";
		}
		return s0 + pAmount.toLocaleString() + s1 + s2;
	},
	createKarmaString: function(pAmount, pWantColor)
	{
		return E.createCurrencyString("karma", pAmount, pWantColor);
	},
	createLaurelString: function(pAmount, pWantColor)
	{
		return E.createCurrencyString("laurel", pAmount, pWantColor);
	},
	createGemString: function(pAmount, pWantColor)
	{
		return E.createCurrencyString("gem", pAmount, pWantColor);
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
		for (var i = 0; i < E.cNUM_ITEM_RARITIES; i++)
		{
			pEntry.removeClass("rarity" + i.toString());
		}
		if (E.Rarity[pLevel] !== undefined)
		{
			pEntry.addClass("rarity" + (E.Rarity[pLevel]).toString());
		}
	},
	
	/*
	 * Gets a rarity CSS class from a rarity name.
	 * @param string pRarity.
	 * @returns string CSS class.
	 */
	getRarityClass: function(pRarity)
	{
		return "rarity" + E.Rarity[pRarity];
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
	convertGemToCoin: function(pAmount)
	{
		return E.createCoinString(Math.round(pAmount * E.Exchange.CoinInGem), true);
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
		var quantity = T.parseQuantity(pEntry.find(".trdQuantity").val());
		
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
		
		$.ajax({
			dataType: "json",
			url: U.URL_API.ItemDetails + id,
			cache: false,
			success: function(pData)
		{
			E.setRarityClass(pEntry.find(".trdName"), pData.rarity);
			pEntry.attr("data-rarity", pData.rarity);
			pEntry.find(".trdIcon").attr("src", pData.icon);
			pEntry.find(".trdLink").val(U.getChatlinkFromItemID(id));
		}});
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

		$.ajax({
			dataType: "json",
			url: U.URL_API.ItemPrices + id,
			cache: false,
			success: function(pData)
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
		}}).done(function()
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
			I.removeThrobber(".trdResults");
			var outputline = $("<dfn class='" + E.getRarityClass(pData.rarity) + "' data-id='" + pData.id + "'>"
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
						+ "<abbr><img class='trdIcon' src='" + U.URL_IMG.Placeholder + "' /></abbr>"
							+ "<div class='trdResultsFocus'><input class='trdName' type='text' /></div>"
						+ "<div class='trdButtons'>"
							+ "<button class='trdSearch' tabindex='-1'>S</button><button class='trdWiki' tabindex='-1'>W</button><br />"
						+ "</div>"
						+ "<div class='trdExpand'>"
							+ "<abbr>$~O</abbr><input class='trdBuy' type='text' />"
							+ "<abbr>−$~</abbr><input class='trdCost trdOutput' type='text' tabindex='-1' /><br />"
							+ "<abbr>O~$</abbr><input class='trdSell' type='text' />"
							+ "<abbr>$=$</abbr><input class='trdBreak trdOutput' type='text' tabindex='-1' /><br />"
							+ "<abbr>×</abbr><input class='trdQuantity' type='text' />"
							+ "<abbr>−$%</abbr><input class='trdTax trdOutput' type='text' tabindex='-1' /><br />"
							+ "<abbr>+$</abbr><input class='trdProfit trdOutput' type='text' tabindex='-1' />"
							+ "<abbr>=$</abbr><input class='trdRevenue trdOutput' type='text' tabindex='-1' /><br />"
							+ "<abbr>+$%</abbr><input class='trdMargin trdOutput' type='text' tabindex='-1' />"
							+ "<abbr>[]</abbr><input class='trdLink trdOutput' type='text' tabindex='-1' />"
							+ "<input class='trdItem trdOutput' type='text' /><br />"
							+ "<abbr>$~!</abbr>"
								+ "<input class='trdNotifyBuyHigh' type='text' />"
								+ "<input class='trdCurrentBuy trdOutput' type='text' tabindex='-1' />"
								+ "<input class='trdNotifyBuyLow' type='text' />"
								+ "<label title='<dfn>" + D.getWordCapital("overwrite") + "</dfn>: Replace your buy and sell prices with the current prices when refreshing.'>"
									+ "<input class='trdOverwrite' type='checkbox' tabindex='-1' />&zwnj;</label><br />"
							+ "<abbr>!~$</abbr>"
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
						+ "<div class='btnSwap'>"
							+ "<button class='btnSwapUp' tabindex='-1'></button><button class='btnSwapDown' tabindex='-1'></button>"
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
			$(entry + " .btnSwap").hover(
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
			$(entry + " .btnSwapUp, " + entry + " .btnSwapDown").each(function()
			{
				$(this).click(function()
				{
					var i = E.SwapIndex;
					var isUp = ($(this).hasClass("btnSwapUp")) ? true : false;
					
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
					var dataA = [];
					var dataB = [];
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
							// Get information of each item in the returned search result array
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
		$(entry + " .trdIcon").attr("src", "img/ui/question.png");
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
	 * Performs the expression on the arithmetic calculator.
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
		catch (e) {}
		
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
		s_y: {de: "j", es: "a", fr: "a", cs: "r", it: "a", pl: "r", pt: "a", ru: "г", zh: "年"},
		s_w: {de: "w", es: "s", fr: "s", cs: "t", it: "s", pl: "t", pt: "s", ru: "н", zh: "週"},
		s_d: {de: "t", es: "d", fr: "j", cs: "d", it: "g", pl: "d", pt: "d", ru: "д", zh: "日"},
		s_h: {de: "h", es: "h", fr: "h", cs: "h", it: "o", pl: "g", pt: "h", ru: "ч", zh: "時"},
		s_m: {de: "m", es: "m", fr: "m", cs: "m", it: "m", pl: "m", pt: "m", ru: "м", zh: "分"},
		s_s: {de: "s", es: "s", fr: "s", cs: "s", it: "s", pl: "s", pt: "s", ru: "с", zh: "秒"},
		s_hour: {de: "stunde", es: "hora", fr: "heure", cs: "hodina", it: "ora", pl: "godzinę", pt: "hora", ru: "час", zh: "時"},
		s_minute: {de: "minute", es: "minuto", fr: "minute", cs: "minuta", it: "minuto", pl: "minuta", pt: "minuto", ru: "минута", zh: "分"},
		s_second: {de: "sekunde", es: "segundo", fr: "seconde", cs: "sekunda", it: "secondo", pl: "sekund", pt: "segundo", ru: "секунду", zh: "秒"},
		s_hours: {de: "stunden", es: "horas", fr: "heures", cs: "hodin", it: "secondi", pl: "godzin", pt: "horas", ru: "часов", zh: "時"},
		s_minutes: {de: "minuten", es: "minutos", fr: "minutes", cs: "minut", it: "minuti", pl: "minut", pt: "minutos", ru: "минут", zh: "分"},
		s_seconds: {de: "sekunden", es: "segundos", fr: "secondes", cs: "sekund", it: "ore", pl: "sekund", pt: "segundos", ru: "секунд", zh: "秒"},
		s_half_an_hour: {de: "eine halbe stunde", es: "media hora", fr: "demi-heure",
			cs: "půl hodiny", it: "mezz'ora", pl: "pół godziny", pt: "meia hora", ru: "полчаса", zh: "半小時"},
		
		// Nouns
		s_account: {de: "account", es: "cuenta", fr: "compte",
			cs: "účet", it: "account", pl: "konto", pt: "conta", ru: "счёт", zh: "帳戶​​"},
		s_key: {de: "schlüssel", es: "tecla", fr: "clé",
			cs: "klávesa", it: "chiave", pl: "klawisz", pt: "chave", ru: "ключ", zh: "索引鍵"},
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
		s_section: {de: "abschnitt", es: "sección", fr: "section",
			cs: "oddíl", it: "sezione", pl: "sekcja", pt: "seção", ru: "раздел", zh: "節"},
		s_map: {de: "karte", es: "mapa", fr: "carte",
			cs: "mapa", it: "mappa", pl: "mapa", pt: "mapa", ru: "ка́рта", zh: "地圖"},
		s_center: {de: "zentrum", es: "centro", fr: "centre",
			cs: "střed", it: "centro", pl: "środek", pt: "centro", ru: "центр", zh: "中心"},
		s_completion: {de: "abschluss", es: "finalización", fr: "progression",
			cs: "dokončení", it: "completamento", pl: "ukończenie", pt: "progressão", ru: "завершение", zh: "完成"},
		s_route: {de: "route", es: "ruta", fr: "route",
			cs: "trasa", it: "percorso", pl: "trasa", pt: "rota", ru: "маршру́т", zh: "路線"},
		s_pins: {de: "stecknadel", es: "alfileres", fr: "épingles",
			cs: "špendlík", it: "spilli", pl: "szpilka", pt: "alfinetes", ru: "була́вка", zh: "大頭針"},
		s_range: {de: "reichweite", es: "alcance", fr: "portée",
			cs: "dosah", it: "portata", pl: "zasięg", pt: "alcance", ru: "дальность", zh: "射程"},
		s_lock: {de: "sperre", es: "bloqueo", fr: "verrou",
			cs: "zámek", it: "blocco", pl: "zablokuj", pt: "bloqueio", ru: "блокировка", zh: "鎖定"},
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
		s_stopwatch: {de: "stoppuhr", es: "cronómetro", fr: "chronomètre",
			cs: "stopky", it: "cronografo", pl: "stoper", pt: "cronômetro", ru: "секундомер", zh: "碼錶"},
		
		// Verbs
		s_is: {de: "ist", es: "es", fr: "est",
			cs: "je", it: "è", pl: "jest", pt: "é", ru: "является", zh: "是"},
		s_subscribe: {de: "abonnieren", es: "subscribir", fr: "abonner",
			cs: "předplatit si", it: "sottoscrivere", pl: "abonować", pt: "assinar", ru: "подписаться", zh: "訂閱"},
		s_will_start: {de: "wird starten", es: "se iniciará", fr: "débutera",
			cs: "začne", it: "inizierà", pl: "rozpocznie się", pt: "começará", ru: "начнется", zh: "開始"},
		s_click: {de: "klicken", es: "clic", fr: "cliquer",
			cs: "kliknout", it: "clic", pl: "klikać", pt: "clicar", ru: "щелкнуть", zh: "按一下"},
		s_load: {de: "laden", es: "cargar", fr: "charger",
			cs: "načíst", it: "caricare", pl: "załaduj", pt: "carregar", ru: "загрузить", zh: "載入"},
		s_save: {de: "speichern", es: "guardar", fr: "enregistrer",
			cs: "uložit", it: "salvare", pl: "zapisać", pt: "salvar", ru: "сохранить", zh: "儲存"},
		s_clear: {de: "löschen", es: "borrar", fr: "effacer",
			cs: "vymazat", it: "cancella", pl: "wyczyść", pt: "limpar", ru: "очистить", zh: "清除"},
		s_toggle: {de: "umschalten", es: "alternar", fr: "basculer",
			cs: "přepnout", it: "alterna", pl: "przełączanie", pt: "alternar", ru: "переключить", zh: "切換"},
		s_expand: {de: "erweiter", es: "expandir", fr: "développer",
			cs: "rozbalit", it: "espandere", pl: "rozwinąć", pt: "expandir", ru: "развернуть", zh: "展開"},
		s_collapse: {de: "verkleiner", es: "contraer", fr: "réduire",
			cs: "sbalit", it: "comprimere", pl: "zwinąć", pt: "recolher", ru: "свернуть", zh: "摺疊"},
		s_draw: {de: "zeichnen", es: "dibujar", fr: "dessiner",
			cs: "kreslit", it: "disegnare", pl: "rysować", pt: "desenhar", ru: "рисова́ть", zh: "画"},
		s_undo: {de: "rückgängig", es: "deshacer", fr: "annuler",
			cs: "zpět", it: "annullare", pl: "cofnąć", pt: "desfazer", ru: "отменить", zh: "復原"},
		s_optimize: {de: "optimieren", es: "optimizar", fr: "optimiser",
			cs: "optimalizovat", it: "ottimizzare", pl: "optymalizować", pt: "otimizar", ru: "оптимизировать", zh: "最佳化"},
		
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
		s_Gem_Store_Promotions: {de: "Edelsteinshop Aktionen", es: "Promociones gemas", fr: "Promotions gemmes",
			cs: "Drahokam Prodejna Propagace", it: "Negozio gemma promozioni", pl: "Klejnot Sklep Promocje", pt: "Loja gema promoções", ru: "Самоцве́т Магази́н Продвижения", zh: "寶石商店促銷"},
		s_forum: {de: "forum", es: "foro", fr: "forum",
			cs: "fórum", it: "forum", pl: "forum", pt: "fórum", ru: "форум", zh: "論壇"},
		s_simple: {de: "einfach", es: "simple", fr: "simple",
			cs: "prostý", it: "semplice", pl: "prosty", pt: "simples", ru: "простой", zh: "簡單"},
		s_mobile: {de: "mobil", es: "móvil", fr: "mobile",
			cs: "mobilní", it: "mobile", pl: "mobilna", pt: "móvel", ru: "мобильный", zh: "行動"},
		s_tile: {de: "kacheln", es: "mosaico", fr: "mosaïque",
			cs: "dlaždice", it: "affianca", pl: "sąsiadująco", pt: "ladrilho", ru: "замостить", zh: "磚"},
		
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
		s_quantity: {de: "anzahl", es: "cantidad", fr: "quantité",
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
		s_margin: {de: "gewinnspanne", es: "margen", fr: "marge",
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
	 * Adds new words to the dictionary from an object of the same structure.
	 * Note that the words have to be unique from the ones here.
	 * @param object pDictionary.
	 */
	addDictionary: function(pDictionary)
	{
		for (var i in pDictionary)
		{
			D.Dictionary[i] = pDictionary[i];
		}
	},
	
	/*
	 * Gets a dictionary entry translated based on the opted language.
	 * @param string pText text to translate without spaces.
	 * @returns string translated text.
	 */
	getTranslation: function(pText)
	{
		// If opted language is English then just return the given text
		if (D.isLanguageDefault())
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
		if (D.isLanguageDefault())
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
				var title = $(this).attr("title");
				if (title !== undefined)
				{
					$(this).attr("title", D.getPhraseOriginal(title));
				}
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
	isLanguageDefault: function()
	{
		return O.Options.enu_Language === O.OptionEnum.Language.Default;
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
	getObjectNick: function(pObject)
	{
		if (pObject["nick_" + O.Options.enu_Language] !== undefined)
		{
			return pObject["nick_" + O.Options.enu_Language];
		}
		return D.getObjectDefaultNick(pObject);
	},
	getObjectDefaultName: function(pObject)
	{
		return pObject["name_" + O.OptionEnum.Language.Default];
	},
	getObjectDefaultNick: function(pObject)
	{
		return pObject["nick_" + O.OptionEnum.Language.Default];
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
		if (D.isLanguageDefault())
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
		if (D.isLanguageDefault())
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
		var volume = (O.Options.int_setVolume / T.cPERCENT_100).toFixed(2);
		
		// Chrome-only TTS service
		try {
			if (I.isSpeechSynthesisEnabled && I.ModeCurrent !== I.ModeEnum.Overlay)
			{
				var msg = new SpeechSynthesisUtterance(pString);
				/*
				 * Chrome bug https://code.google.com/p/chromium/issues/detail?id=582455
				 * Workaround is to manually set the voice. When the bug is fixed, can
				 * just set only the lang property and have the voice set automatically.
				 */
				//msg.lang = O.LanguageCode[O.Options.enu_Language];
				msg.voice = window.speechSynthesis.getVoices().filter(function(iVoice)
				{
					return iVoice.name === O.VoiceCode[O.Options.enu_Language];
				})[0];
				msg.volume = volume;
				msg.rate = 0.8;
				window.speechSynthesis.speak(msg);
				return;
			}
		}
		catch (e) {
			I.isSpeechSynthesisEnabled = false;
		}
		
		// If using other TTS service then use custom queue system
		var doSpeak = function(pStringMacro)
		{
			var tts = document.getElementById("jsTTSAudio");
			tts.src = U.URL_API.TextToSpeech + "&vol=" + volume + "&t=" + pStringMacro;
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
		
		// Prevent the speech queue to be too long, reset if it is
		var secmaxspeechduration = 30;
		D.resetSpeechQueue(secmaxspeechduration);
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
	getSpeechWord: function(pText, pModifier)
	{
		if (pModifier)
		{
			return D.getModifiedWord(pText, pModifier);
		}
		return D.getPhrase(pText);
	},
		
	/*
	 * Adds spaces to a string so each letter is spoken separately.
	 * "SoS" returns "S O S" but "Mag" returns "Mag" (no change).
	 * @param string pString.
	 * @returns string of period separated initials.
	 */
	getSpeechInitials: function(pString, pWantTrim)
	{
		// If the last character of the string is lowercase, then don't do anything
		var finalchar = pString.charAt(pString.length - 1);
		if (finalchar === finalchar.toLowerCase())
		{
			return pString;
		}
		// Otherwise make initials
		if (pWantTrim)
		{
			pString = pString.replace(/ /g, "");
		}
		pString = pString.toUpperCase();
		var str = "";
		var char = "";
		for (var i = 0; i < pString.length; i++)
		{
			char = pString.charAt(i);
			str += (char === " ") ? char : (char + " ");
		}
		return str;
	},
	
	/*
	 * Gets a phrase such as " in 1 minute" or " in 15 minutes".
	 * @param int pTime amount of time units.
	 * @param string pUnit of time.
	 * @returns string phrase.
	 */
	getPluralTime: function(pTime, pUnit)
	{
		if (pTime > 1)
		{
			pUnit += "s";
		}
		return " " + D.getWord("in") + " " + pTime + " " + D.getWord(pUnit);
	},
	
	/*
	 * Gets pronunciation of chain in opted language.
	 * @param object pChain to get.
	 * @returns string pronunciation.
	 */
	getChainPronunciation: function(pChain)
	{
		if (D.isLanguageDefault()
			|| I.BrowserCurrent !== I.BrowserEnum.Chrome)
		{
			return C.Chains[pChain.nexus].pronunciation;
		}
		return D.getChainTitle(pChain);
	}
};

/* =============================================================================
 * @@Chains of events
 * ========================================================================== */
C = {
	
	/*
	 * http://gw2timer.com/data/chains.js initially holds an array of scheduled
	 * meta event chain objects, which themselves contain an array of their events.
	 * This is referred to by the variable "C.Chains". It will be added with
	 * unscheduled chains when the user opens that section on the chains page.
	 */
	Chains: GW2T_CHAIN_DATA,
	ChainAssociation: {},
	UnscheduledChainsLength: GW2T_CHAIN_ADD_LENGTH,
	DryTop: {},
	// The word and variable "nexus" is simply a chain's index number in the Chains array
	cIndexSynonym: "nexus",
	ChainToday: null,
	ChainTomorrow: null,
	ChainDummy: {alias: "dummy"},
	CurrentChainSD: {}, NextChainSD1: {}, NextChainSD2: {}, NextChainSD3: {}, NextChainSD4: {},
	CurrentChainHC: {}, NextChainHC1: {}, NextChainHC2: {}, NextChainHC3: {}, NextChainHC4: {},
	NextChainLS1: {}, NextChainLS2: {},
	NextChainsMS1: [], NextChainsMS2: [],
	CurrentChains: [],
	CurrentChainsSD: [],
	PreviousChains1: [],
	PreviousChains2: [],
	NextChains1: [],
	cEventTitleCharLimit: 44,
	cEventNameWidth: 320,
	TempleChains: [],
	LegacyChains: [],
	UnscheduledChains: [],
	ScheduledChains: [], // Any scheduled chain
	RegularChains: [], // Scheduled world bosses
	MiscellaneousChains: [],
	DryTopChains: [],
	LivingStoryChains: [],
	ChainSeriesEnum:
	{
		Temple: 0, // Unscheduled Orr temples
		Legacy: 1, // Unscheduled chains that still gives a rare
		ScheduledCutoff: 2,
		Standard: 2, // Scheduled non-hardcore chains
		Hardcore: 3, // Scheduled challenging chains with a separate schedule from non-hardcores
		WorldBossCuttoff: 3,
		Miscellaneous: 4, // Any scheduled chains not already defined here
		DryTop: 5, // Scheduled Dry Top chains
		LivingStory: 6 // Seasonal events
	},
	EventPrimacyEnum:
	{
		Optional: 0, // A failure or optional subevent; includes temple retake event which should be ignored
		Normal: 1, // A concurrent (multiple simultaneous) event that does not take the longest to complete
		Primary: 2, // An only event at the time or a concurrent event that takes the longest to complete
		Boss: 3 // The boss event, also considered a primary event
	},
	isUnscheduledChainsLoaded: false,
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
		return C.Chains[C.ChainAssociation[pAlias.toLowerCase()]];
	},
	getChainRegion: function(pChain)
	{
		return M.getZoneRegion(pChain.zone);
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
	 * Shows or hides the daily icon for today's boss depending on availability.
	 * @pre Used variables has been reinitialized.
	 */
	refreshChainDailyIcon: function()
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
		if (pChain.series >= C.ChainSeriesEnum.ScheduledCutoff)
		{
			return true;
		}
		return false;
	},
	isChainWorldBoss: function(pChain)
	{
		if (pChain.series <= C.ChainSeriesEnum.WorldBossCuttoff)
		{
			return true;
		}
		return false;
	},
	isChainRegular: function(pChain)
	{
		if (pChain.series === C.ChainSeriesEnum.Standard ||
			pChain.series === C.ChainSeriesEnum.Hardcore ||
			pChain.series === C.ChainSeriesEnum.Miscellaneous ||
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
	 * @pre Event number can only go from 1-9.
	 */
	initializeChain: function(pChain)
	{
		var i, ii;
		var event;
		var chainextra = "";
		var chainname = D.getObjectName(pChain);
		
		/*
		 * Initialize step attribute (the first number in an event
		 * number, as in "2" in "2A1"), will be used to access events HTML.
		 */
		for (i in pChain.events)
		{
			// Minus 1 because the event numbers are 1 indexed
			pChain.events[i].step = parseInt(C.getEventStepNumber(pChain.events[i].num)) - 1;
		}
		pChain.isSorted = false;
		pChain.primaryEvents = [];
		pChain.scheduleKeys = [];
		
		if (pChain.waypoint !== undefined)
		{
			chainextra = "<input class='chnWaypoint' type='text' value='" + pChain.waypoint + " " + chainname + "' /> "
				+ " (" + pChain.level + ")"
					+ "<a" + U.convertExternalAnchor(U.getYouTubeLink(D.getObjectDefaultName(pChain))) + ">"
					+ "<ins class='s16 s16_youtube' title='Recommended level. Click for YouTube videos.'></ins></a> ";
		}
		if (pChain.reward !== undefined)
		{
			for (i in pChain.reward)
			{
				chainextra += pChain.reward[i] + "<ins class='s16 s16_" + i + "' title='" + i + "'></ins> ";
			}
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
				+ "<kbd id='chnCheck_" + pChain.nexus + "' class='chnCheck'></kbd>"
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
		if (D.isLanguageDefault() && I.isMapEnabled)
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
	 * Categorizes and initializes scheduled chains, which are already in the
	 * main chains array.
	 */
	initializeScheduledChains: function()
	{
		var chain;
		var length = C.Chains.length;
		for (var i = 0; i < length; i++)
		{
			// Unschedule chains will be initialized when their headers are clicked on
			chain = C.Chains[i];
			chain.nexus = i;
			C.ChainAssociation[(chain.alias.toLowerCase())] = chain.nexus;

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
				case C.ChainSeriesEnum.Miscellaneous:
				{
					chain.htmllist = "#sectionChains_Scheduled";
					C.MiscellaneousChains.push(chain);
					C.ScheduledChains.push(chain);
				} break;
				case C.ChainSeriesEnum.LivingStory:
				{
					if (B.isDashboardStoryEnabled)
					{
						// Show Living Story events on the dashboard if on website or overlay mode only
						chain.htmllist = ((I.isProgramEmbedded || (I.ModeCurrent !== I.ModeEnum.Website && I.ModeCurrent !== I.ModeEnum.Overlay)))
							? "#sectionChains_Scheduled" : "#dsbStory";
						C.LivingStoryChains.push(chain);
						C.ScheduledChains.push(chain);
						T.insertChainToSchedule(chain);
					}
					else
					{
						continue;
					}
				} break;
			}
			C.initializeChain(chain);
		}
	},
	
	/*
	 * Loads the unscheduled chains data then categorizes and initializes them.
	 */
	initializeUnscheduledChains: function()
	{
		if (C.isUnscheduledChainsLoaded === false)
		{
			$.getScript(U.URL_DATA.Unscheduled).done(function()
			{
				if (C.isUnscheduledChainsLoaded)
				{
					return;
				}
				
				// Add them to the main chains array
				var unscheduledchains = GW2T_CHAIN_UNSCHEDULED;
				var oldlength = C.Chains.length;
				for (var i = 0; i < unscheduledchains.length; i++)
				{
					C.Chains.push(unscheduledchains[i]);
				}
				
				// Initialize them
				var chain;
				var newlength = C.Chains.length;
				for (var i = oldlength; i < newlength; i++)
				{
					chain = C.Chains[i];
					chain.nexus = i;

					switch (chain.series)
					{
						case C.ChainSeriesEnum.Temple:
						{
							chain.htmllist = "#sectionChains_Temple";
							C.TempleChains.push(chain);
							C.UnscheduledChains.push(chain);
						} break;
						case C.ChainSeriesEnum.Legacy:
						{
							chain.htmllist = "#sectionChains_Legacy";
							C.LegacyChains.push(chain);
							C.UnscheduledChains.push(chain);
						} break;
					}
					C.initializeChain(chain);
					P.drawChainPaths(chain);
				}
				C.isUnscheduledChainsLoaded = true;
			});
		}
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
		var sign = I.Symbol.ArrowUp + " ";
		
		if (pChain.series === C.ChainSeriesEnum.DryTop && C.isDryTopGenerated)
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
				sign = I.Symbol.ArrowDown + " ";
			}

			$("#chnTime_" + pChain.nexus).text(sign + T.getTimeFormatted(
				{
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
					&& ithchain.series !== C.ChainSeriesEnum.Hardcore
					&& ithchain.series !== C.ChainSeriesEnum.Miscellaneous)
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
						+ "<kbd class='chnCheck'></kbd>"
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
		$(".chnSlot .chnCheck").click(function()
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
		C.refreshChainDailyIcon();
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
				if (O.Options.bol_expandWB && (I.ModeCurrent !== I.ModeEnum.Tile))
				{
					$("#chnDetails_" + ithchain.nexus).show("fast", function()
					{
						I.updateScrollbar();
					});
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
			if (O.Options.bol_collapseChains && (I.ModeCurrent !== I.ModeEnum.Tile))
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
				setTimeout((function(iChain, iPrimaryEventIndex)
				{
					// Have to use this clunky nesting else the timeout gets the last iterator
					return function()
					{
						C.highlightEvents(iChain, iPrimaryEventIndex);
					};
				})(chain, parseInt(i)), wait * T.cMILLISECONDS_IN_SECOND);
			}
		}
		
		// Queued all the events' start, now queue when the chain finishes
		wait = C.getSumBasedOnOptions(chain, -1);
		if (wait >= elapsed)
		{
			wait = wait - elapsed;
			setTimeout((function(iChain)
			{
				return function()
				{
					C.highlightEvents(iChain, -1);
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
			P.LayerArray.DryTopActive = [];
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
					D.speak(D.getChainPronunciation(pChain) + " " + D.getSpeechWord("arrival predicted"));
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
				var checked = ", " + D.getSpeechWord("checked");
				var checkedsd = "";
				var checkedhc = "";
				var wantsd = O.objToBool(C.NextChainSD1);
				var wanthc = O.objToBool(C.NextChainHC1);
				var speech = D.getSpeechWord("next " + D.orderModifier("boss", "world") + " is") + " ";
				
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
					D.speak(D.getSpeechWord("also") + ", " + D.getChainPronunciation(C.NextChainHC1) + checkedhc, 3);
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
			
			// Also unsubscribe from world boss chains if opted
			if (O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription && O.Options.bol_alertUnsubscribe && I.isProgramLoaded
				&& C.isChainWorldBoss(pChain) && C.isChainSubscribed(pChain))
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
	 * http://gw2timer.com/data/general.js contains zone (e.g. Queensdale, LA)
	 * objects with their rectangular coordinates.
	 * This is referred to by the variable "Zones".
	 * Each zone will be assigned with LayerGroup of world completion markers,
	 * they can be accessed by the format: zonevariable.Layers.LandmarkType
	 * where LandmarkType may be Waypoint, Vista, or others.
	 */
	MapEnum: "map", // Type of map this map is
	OptionSuffix: "", // Tyria map has unsuffixed option variable names
	Zones: GW2T_ZONE_DATA,
	ZoneAssociation: GW2T_ZONE_ASSOCIATION, // This contains API zone IDs that associates with regular world zones
	Regions: GW2T_REGION_DATA,
	Submaps: GW2T_SUBMAP_DATA,
	Weapons: GW2T_RANGE_DATA,
	cInitialZone: "lion",
	Map: {},
	Floors: [],
	ZoneCurrent: {},
	numPins: 0,
	cICON_SIZE_STANDARD: 32,
	cRING_SIZE_MAX: 256,
	isMapInitialized: false,
	isMouseOnHUD: false,
	isUserDragging: false,
	isZoneLocked: false,
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
		Adaptive: -2,
		Same: -1,
		Min: 0,
		Overview: 3,
		Default: 3,
		Space: 3,
		Sky: 5,
		Bird: 6,
		Ground: 7,
		Max: 7
	},
	cZIndexRaise: 999999,
	cZIndexBury: -999999,
	
	// Geometry and velocity constants
	cCIRCLE_RIGHT_DEGREE: 90,
	cCIRCLE_HALF_DEGREE: 180,
	cCIRCLE_FULL_DEGREE: 360,
	cRADIAN_TO_DEGREE: 180 / Math.PI,
	cUNITS_TO_POINTS: 1 / 24, // Map coordinates "points" versus game range "units"
	cPOINTS_TO_UNITS: 24, // 1 game "unit" is 1 "inch"
	cUNITS_TO_METERS: 0.0254,
	cMETERS_TO_UNITS: 1 / 0.0254,
	cUNITS_PER_SECOND: 386, // Units traveled in one second while on swiftness buff
	// MumbleLink data assigned by overlay program
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
		Overview: new L.layerGroup(), // Stats of zone's number of world completion icons
		Pin: new L.layerGroup(), // Utility pin markers, looks like GW2 personal waypoints
		PersonalPin: new L.layerGroup(),
		PersonalPath: new L.layerGroup(), // Path drawn from connecting player-laid pins
		WeaponIcon: new L.layerGroup(), // A weapon icon with its radius circle
		WeaponCircle: new L.layerGroup()
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
		var initialzoom = O.Options["int_setInitialZoom" + P.SuffixCurrent];
		
		// ?.Map is the actual Leaflet map object, initialize it
		this.Map = L.map(this.MapEnum + "Pane", {
			minZoom: this.ZoomEnum.Min,
			maxZoom: this.ZoomEnum.Max,
			inertiaThreshold: this.cInertiaThreshold,
			doubleClickZoom: false,
			touchZoom: false, // Disable pinch to zoom
			zoomControl: I.isTouchEnabled, // Hide the zoom UI
			attributionControl: false, // Hide the Leaflet link UI
			crs: L.CRS.Simple
		}).setView(this.cMAP_CENTER_INITIAL, initialzoom); // Out of map boundary so browser doesn't download tiles yet
		// Because the map will interfere with scrolling the website on touch devices
		this.Map.touchZoom.disable();
		if (this.Map.tap)
		{
			this.Map.tap.disable();
		}
		
		// Initialize LayerGroup in zones to later hold world completion and dynamic event icons
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
			if (that.MapEnum === P.MapEnum.Tyria)
			{
				P.LayerArray.ChainPath.push(zone.Layers.Path);
			}
		}
		this.ZoneCurrent = this.Zones[this.cInitialZone];
		
		// Do other initialization functions
		var mapnumber;
		switch (this.MapEnum)
		{
			case P.MapEnum.Tyria: {
				mapnumber = 1;
				this.createPins();
				P.populateMap(M);
				P.drawZoneBorders();
				P.drawZoneGateways();
				C.ScheduledChains.forEach(P.drawChainPaths);
			} break;
			
			case P.MapEnum.Mists: {
				mapnumber = 2;
				// Set tiles, Tyria tiles is set later to avoid loading extra images
				L.tileLayer(U.URL_API.TilesMists,
				{
					continuousWorld: true
				}).addTo(W.Map);
				this.createPins();
				P.populateMap(W);
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
		if (!I.isTouchEnabled)
		{
			this.bindMapClicks();
		}
		
		/*
		 * Go to the coordinates in the bar when user presses enter.
		 */
		$(htmlidprefix + "CoordinatesCopy").onEnterKey(function()
		{
			var val = $(this).val();
			U.interpretCommand(val, that, that.ZoomEnum.Ground, that.Pin.Program);
		});
		
		/*
		 * Bind map HUD buttons functions.
		 */
		$(htmlidprefix + "GPSButton").click(function()
		{
			// Go to character if cliked on GPS button
			P.updateCharacter(1);
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
			// Replicate display button
			if (I.isTouchEnabled === false)
			{
				$("#opt_bol_showPanel").trigger("click");
			}
		});
		$(htmlidprefix + "ExpandButton").click(function()
		{
			// Hide the right panel if click on the display button
			$("#opt_bol_showPanel").trigger("click");
		});
		// Translate and bind map zones list
		$(htmlidprefix + "CompassButton").one("mouseenter", that.bindZoneList(that)).click(function()
		{
			that.goToDefault();
		}).dblclick(function()
		{
			that.Map.setZoom(that.Map.getZoom() - 1); // Zoom out one level
		});
		
		// Finally
		this.isMapInitialized = true;
		this.refreshMap();
	},
	
	/*
	 * Create pin markers that can be moved by user or program.
	 */
	createPins: function()
	{
		if (!I.isMapEnabled)
		{
			return;
		}
		var that = this;
		this.Pin.Program = this.createPin("img/map/pin_blue.png");
		this.Pin.Event = this.createPin("img/map/pin_green.png");
		this.Pin.Over = this.createPin("img/map/pin_over.png", [128,128]);
		this.Pin.Character = this.createPin("img/map/pin_character.png", [40,40]);
		this.Pin.Camera = this.createPin("img/map/pin_camera.png", [256,256], {clickable: false});
		
		// Bind pin click event to get coordinates in the coordinates bar
		this.Layer.Pin.eachLayer(function(iMarker)
		{
			that.bindMarkerCoordBehavior(iMarker, "click");
			that.bindMarkerZoomBehavior(iMarker, "contextmenu");
			iMarker.on("dblclick", function()
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
	},
	
	/*
	 * Bind mouse button functions for the map. Also binds the map custom context menu.
	 * @param enum pMapEnum.
	 */
	bindMapClicks: function()
	{
		var that = this;
		var htmlidprefix = "#" + that.MapEnum;
		
		/*
		 * Shows or hides coordinates bar.
		 */
		this.toggleCoordinatesBar(); // Apply initial appearance
		$(htmlidprefix + "CoordinatesToggle").click(function()
		{
			$("#opt_bol_showCoordinatesBar").trigger("click");
		});
		
		/*
		 * Clicking an empty place on the map highlight its coordinate.
		 */
		this.Map.on("click", function(pEvent)
		{
			if (that.isMouseOnHUD) { return; }
			var coord = that.convertLCtoGC(pEvent.latlng);
			that.outputCoordinatesCopy(P.formatCoord(coord));
		});

		/*
		 * Create a personal pin marker to where the user double clicks.
		 */
		this.Map.on("dblclick", function(pEvent)
		{
			if (that.isMouseOnHUD) { return; }
			that.saveBackupPins();
			that.createPersonalPin(pEvent.latlng, true, true);
		});

		/*
		 * Right clicking the map shows a custom context menu.
		 */
		this.Map.on("contextmenu", function(pEvent)
		{
			that.ContextLatLng = pEvent.latlng;
			$(htmlidprefix + "Context").css({top: I.posY, left: I.posX}).show();
		});
		
		/*
		 * Bind context menu functions.
		 */
		$(htmlidprefix + "Context").click(function()
		{
			$(this).hide();
		});
		$(htmlidprefix + "ContextCenter").click(function()
		{
			that.goToDefault();
		});
		$(htmlidprefix + "ContextRange").one("mouseenter", function()
		{
			that.initializeWeaponPlacer(that);
		});
		$(htmlidprefix + "ContextPins").one("mouseenter", function()
		{
			that.initializePinStorage(that);
		});
		$(htmlidprefix + "ContextUndoPins").click(function()
		{
			that.loadBackupPins();
		});
		$(htmlidprefix + "ContextClearPins").click(function()
		{
			that.clearPersonalPins();
		});
		$(htmlidprefix + "ContextChatlinkPins").click(function()
		{
			if (that.isPersonalPinsLaid())
			{
				P.printClosestWaypoints();
			}
		});
		$(htmlidprefix + "ContextOptimizePins").click(function()
		{
			if (that.isPersonalPinsLaid())
			{
				that.optimizePersonalPath();
			}
		});
		$(htmlidprefix + "ContextToggleLock").click(function()
		{
			that.isZoneLocked = !that.isZoneLocked;
			if (that.isZoneLocked)
			{
				I.write("Map locked to zone: " + D.getObjectName(that.ZoneCurrent));
			}
			else
			{
				I.write("Map zoning unlocked.");
			}
		});
		$(htmlidprefix + "ContextToggleCompletion").click(function()
		{
			$("#opt_bol_showWorldCompletion" + that.OptionSuffix).trigger("click");
		});
		
		// Map exclusive functions
		switch (that.MapEnum)
		{
			case P.MapEnum.Tyria:
			{
				$(htmlidprefix + "ContextToggleHUD").click(function()
				{
					$(htmlidprefix + "HUDBoxes").toggle();
				});
				$(htmlidprefix + "ContextDrawCompletion").click(function()
				{
					P.drawCompletionRoute();
				});
			} break;
			case P.MapEnum.Mists:
			{
				
			} break;
		}
	},
	
	/*
	 * Toggles both the Tyria and Mists map's coordinates bars.
	 */
	toggleCoordinatesBar: function()
	{
		$(".mapCoordinatesBar input").toggle(O.Options["bol_showCoordinatesBar"]);
	},
	
	/*
	 * Sets the value provided to the coordinates bar.
	 * @param string pText to output.
	 */
	outputCoordinatesCopy: function(pText)
	{
		var htmlidprefix = "#" + this.MapEnum;
		$(htmlidprefix + "CoordinatesCopy").val(pText).select();
	},
	outputCoordinatesName: function(pText)
	{
		var htmlidprefix = "#" + this.MapEnum;
		$(htmlidprefix + "CoordinatesName").val(pText);
	},
	
	/*
	 * Bindings for map events that need to be done after AJAX has loaded the
	 * API-generated markers.
	 */
	bindMapVisualChanges: function()
	{
		var that = this;
		var htmlidprefix = "#" + that.MapEnum;
		/*
		 * Booleans to stop some map functions from activating.
		 */
		$(htmlidprefix + "HUDPane").hover(
			function() { that.isMouseOnHUD = true; },
			function() { that.isMouseOnHUD = false; }
		);
		$(htmlidprefix + "Context").hover(
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
		 * At the end of a zoom animation, resize the map icons depending on
		 * zoom level. Hide if zoomed too far.
		 */
		this.Map.on("zoomend", function(pEvent)
		{
			that.adjustZoomMapping();
			if (that.MapEnum === P.MapEnum.Tyria)
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
		if (typeof pNick === "string" && this.Zones[pNick])
		{
			zone = this.Zones[pNick];
		}
		// If pNick is a zone that has the property
		else if (typeof pNick === "object")
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
	getZoneNick: function(pZone)
	{
		return this.ZoneAssociation[pZone.id];
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
	 * Gets the zone a coordinates reside in.
	 * @param array pCoord.
	 * @returns object zone if found else null.
	 */
	getZoneFromCoord: function(pCoord)
	{
		for (var i in this.Zones) // i is the index and nickname of the zone
		{
			if (pCoord[0] >= this.Zones[i].continent_rect[0][0]
				&& pCoord[1] >= this.Zones[i].continent_rect[0][1]
				&& pCoord[0] <= this.Zones[i].continent_rect[1][0]
				&& pCoord[1] <= this.Zones[i].continent_rect[1][1])
			{
				return this.Zones[i];
			}
		}
		return null;
	},
	
	/*
	 * Finds what zone the specified point is in by comparing it to the top left
	 * and bottom right coordinates of the zones, then show the zone's visuals.
	 * @param array pCoord containing x and y coordinates.
	 * @pre Zone perimeters do not intersect.
	 */
	showCurrentZone: function(pCoord)
	{
		var that = this;
		var htmlidprefix = that.MapEnum;
		
		document.getElementById(htmlidprefix + "CoordinatesMouse")
			.value = pCoord[0] + ", " + pCoord[1];
	
		// Don't continue if mouse is still in the same zone
		if (pCoord[0] >= this.ZoneCurrent.continent_rect[0][0] // x1
			&& pCoord[1] >= this.ZoneCurrent.continent_rect[0][1] // y1
			&& pCoord[0] <= this.ZoneCurrent.continent_rect[1][0] // x2
			&& pCoord[1] <= this.ZoneCurrent.continent_rect[1][1] // y2
			|| this.isZoneLocked === true)
		{
			return;
		}
		
		// Else search for new moused zone
		var zonename = "";
		var previouszone;
		var testzone = this.getZoneFromCoord(pCoord); // Search for the zone
		
		if (testzone !== null)
		{
			// Hide the icons of the previously moused zone
			previouszone = this.Zones[this.ZoneCurrent.nick];
			for (var i in previouszone.Layers)
			{
				this.Map.removeLayer(previouszone.Layers[i]);
			}
			// Update current zone object
			this.ZoneCurrent = testzone;
			zonename = this.getZoneName(this.ZoneCurrent);
			document.getElementById(htmlidprefix + "CoordinatesName").value = zonename;

			// Reveal moused zone's icons
			switch (that.MapEnum)
			{
				case P.MapEnum.Tyria:
				{
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
				} break;
				case P.MapEnum.Mists:
				{
					if (O.Options.bol_displayWaypointsWvW) { this.ZoneCurrent.Layers.Waypoint.addTo(this.Map); }
					if (O.Options.bol_displayPOIsWvW) { this.ZoneCurrent.Layers.Landmark.addTo(this.Map); }
					if (O.Options.bol_displayVistasWvW) { this.ZoneCurrent.Layers.Vista.addTo(this.Map); }
					if (O.Options.bol_displayChallengesWvW) { this.ZoneCurrent.Layers.Challenge.addTo(this.Map); }
					if (O.Options.bol_displaySectorsWvW) { this.ZoneCurrent.Layers.Sector.addTo(this.Map); }
				} break;
			}

			// Re-tooltip
			I.qTip.init(".leaflet-marker-icon");
			// Rescale current moused mapping markers
			this.adjustZoomMapping();
		}
	},
	
	/*
	 * Simulates the action of moving the mouse outside the current zone to
	 * another and back again, so as to trigger the icon adjustment functions.
	 */
	refreshCurrentZone: function()
	{
		var currentcoord = this.ZoneCurrent.center;
		switch (this.MapEnum)
		{
			case P.MapEnum.Tyria:
			{
				// These specimen zone are chosen because they are the top of the array
				this.showCurrentZone(this.getZoneCenter("verdant"));
				this.showCurrentZone(this.getZoneCenter("auric"));
			} break;
			case P.MapEnum.Mists:
			{
				this.showCurrentZone(this.getZoneCenter("edge"));
				this.showCurrentZone(this.getZoneCenter("eternal"));
			} break;
		}
		this.showCurrentZone(currentcoord);
	},
	
	/*
	 * Gets the center coordinates of a zone.
	 * @param string pNick short name of the zone.
	 * @returns array of x and y coordinates.
	 */
	computeZoneCenter: function(pNick)
	{
		var rect = this.Zones[pNick].continent_rect;
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
		var p = pEvent.location.center; // 2D float array

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
		return this.ZoomEnum.Max - pZoomLevel;
	},
	
	/*
	 * Resizes mapping markers so they scale with the current zoom level.
	 */
	adjustZoomMapping: function()
	{
		var that = this;
		var currentzoom = this.Map.getZoom();
		var zoomindex = this.invertZoomLevel(currentzoom);
		
		var ZoomValues = {
			// The first index is the max zoom-in level
			waypoint: [40, 32, 26, 20, 16, 12, 0, 0],
			landmark: [32, 24, 16, 12, 0, 0, 0, 0],
			eventicon: [32, 24, 16, 12, 0, 0, 0, 0],
			eventring: [256, 128, 64, 32, 0, 0, 0, 0],
			sectorfont: [28, 20, 16, 0, 0, 0, 0, 0],
			sectoropacity: [0.9, 0.6, 0.3, 0, 0, 0, 0, 0],
			objicon: [38, 38, 38, 38, 32, 24, 16, 0],
			objtimerfont: [18, 17, 16, 15, 14, 13, 12, 0],
			objinfofont: [14, 13, 12, 11, 10, 9, 0, 0],
			objumbrella: [96, 96, 96, 96, 64, 32, 24, 0],
			spawnfont: [28, 24, 20, 16, 12, 8, 0, 0],
			spawnopacity: [0.9, 0.9, 0.8, 0.7, 0.6, 0.5, 0, 0],
			wallweight: [10, 8, 6, 4, 2, 0, 0, 0]
		};
		var getZoomValue = function(pKey)
		{
			return (ZoomValues[pKey])[zoomindex];
		};
		var waypointsize = getZoomValue("waypoint");
		var landmarksize = getZoomValue("landmark");
		var eventiconsize =  getZoomValue("eventicon");
		var eventringsize = getZoomValue("eventring");
		var sectorfont = getZoomValue("sectorfont");
		var sectoropacity = getZoomValue("sectoropacity");
		var objiconsize = getZoomValue("objicon");
		var objtimerfont = getZoomValue("objtimerfont");
		var objinfofont = getZoomValue("objinfofont");
		var objumbrella = getZoomValue("objumbrella");
		var spawnfont = getZoomValue("spawnfont");
		var spawnopacity = getZoomValue("spawnopacity");
		var wallweight = getZoomValue("wallweight");
		
		var completionboolean;
		var overviewboolean;
		var sectorboolean;
		
		switch (this.MapEnum)
		{
			case P.MapEnum.Tyria:
			{
				// Event Icon
				if (O.Options.bol_displayEvents)
				{
					this.ZoneCurrent.Layers.EventIcon.eachLayer(function(iLayer) {
						that.resizeMarkerIcon(iLayer, eventiconsize);
						if (iLayer._icon)
						{
							iLayer._icon.style.zIndex = M.cZIndexRaise;
						}
					});

					// Event Ring
					this.ZoneCurrent.Layers.EventRing.eachLayer(function(iLayer) {
						that.resizeMarkerIcon(iLayer, eventringsize);
						if (iLayer._icon)
						{
							iLayer._icon.style.zIndex = M.cZIndexBury;
						}
					});
				}
				overviewboolean = O.Options.bol_showZoneOverview;
				completionboolean = O.Options.bol_showWorldCompletion;
				sectorboolean = O.Options.bol_displaySectors;
			} break;
			case P.MapEnum.Mists:
			{
				// Objective
				$(".objIcon").css({width: objiconsize, height: objiconsize});
				$(".objProgressBar").css({width: objiconsize});
				$(".objTimer").css({fontSize: objtimerfont});
				$(".objInfo").css({fontSize: objinfofont});
				$(".objUmbrella").css({width: objumbrella, height: objumbrella});
				// World Completion
				overviewboolean = O.Options.bol_showZoneOverviewWvW;
				completionboolean = O.Options.bol_showWorldCompletionWvW;
				sectorboolean = O.Options.bol_displaySectorsWvW;
				// Server spawn area labels
				this.Layer.SpawnLabel.eachLayer(function(iLayer) {
					iLayer._icon.style.fontSize = spawnfont + "px";
					iLayer._icon.style.opacity = spawnopacity;
					iLayer._icon.style.zIndex = that.cZIndexBury + 1;
					iLayer._icon.style.display = "table";
				});
				// Secondary objectives
				this.Layer.Secondaries.eachLayer(function(iLayer) {
					that.resizeMarkerIcon(iLayer, landmarksize);
				});
				// Destructible walls and gates paths
				this.Layer.Destructible.eachLayer(function(iLayer) {
					iLayer.setStyle({weight: wallweight});
				});
			} break;
		}
		
		// Adjust range circles
		this.Layer.WeaponCircle.eachLayer(function(iLayer) {
			iLayer.setRadius(that.getZoomedDistance(iLayer.options.trueradius));
		});
		
		// Overview on the zones
		if (completionboolean && overviewboolean)
		{
			if (currentzoom === this.ZoomEnum.Overview)
			{
				this.toggleLayer(this.Layer.Overview, true);
				this.Layer.Overview.eachLayer(function(iLayer) {
					iLayer._icon.style.display = "table";
				});
			}
			else
			{
				this.toggleLayer(this.Layer.Overview, false);
			}
		}
		else
		{
			this.toggleLayer(this.Layer.Overview, false);
		}

		// Waypoints
		this.ZoneCurrent.Layers.Waypoint.eachLayer(function(iLayer) {
			that.resizeMarkerIcon(iLayer, waypointsize);
		});
		
		// Landmarks
		this.ZoneCurrent.Layers.Landmark.eachLayer(function(iLayer) {
			that.resizeMarkerIcon(iLayer, landmarksize);
			if (iLayer._icon)
			{
				iLayer._icon.style.opacity = (currentzoom < that.ZoomEnum.Max) ? 0.6 : 0.8;
			}
		});
		
		// Vista
		this.ZoneCurrent.Layers.Vista.eachLayer(function(iLayer) {
			that.resizeMarkerIcon(iLayer, landmarksize);
		});
		
		// Challenge
		this.ZoneCurrent.Layers.Challenge.eachLayer(function(iLayer) {
			that.resizeMarkerIcon(iLayer, landmarksize);
		});
		
		// Heart
		this.ZoneCurrent.Layers.Heart.eachLayer(function(iLayer) {
			that.resizeMarkerIcon(iLayer, landmarksize);
		});
		
		// Sector
		this.ZoneCurrent.Layers.Sector.eachLayer(function(iLayer) {
			if (iLayer._icon)
			{
				iLayer._icon.style.fontSize = sectorfont + "px";
				iLayer._icon.style.opacity = sectoropacity;
				iLayer._icon.style.zIndex = that.cZIndexBury + 1; // Don't cover other icons
				if (sectorboolean)
				{
					iLayer._icon.style.display = "table"; // For middle vertical alignment
				}
			}
		});
		
		// Character pin and camera FOV
		P.updateCharacter(-1);
	},
	
	/*
	 * Calculates a new distance from an inherent distance based on current map zoom level.
	 */
	getZoomedDistance: function(pDistance)
	{
		return pDistance / Math.pow(2, this.ZoomEnum.Max - this.Map.getZoom());
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
	 * Initializes the personal pin storage system.
	 */
	initializePinStorage: function(pMapObject)
	{
		var that = pMapObject;
		var initializeStoredPins = function(pQuantity)
		{
			var obj = O.Utilities["StoredPins" + that.OptionSuffix];
			// First make a new array with desired length
			obj.value = new Array(pQuantity);
			var key = obj.key;
			// Try to overwrite it with the stored arrays, if this fails then the value property is unchanged (a blank array)
			try
			{
				obj.value = JSON.parse(localStorage[key]);
			}
			catch(e) {}
		};
		var saveStoredPins = function(pIndex)
		{
			var obj = O.Utilities["StoredPins" + that.OptionSuffix];
			var coords = that.getPersonalCoords();
			if (coords.length > 0)
			{
				obj.value[pIndex] = coords;
				localStorage[obj.key] = JSON.stringify(obj.value);
			}
			else
			{
				that.isPersonalPinsLaid();
			}
		};
		var loadStoredPins = function(pIndex)
		{
			var obj = O.Utilities["StoredPins" + that.OptionSuffix];
			that.redrawPersonalPath(obj.value[pIndex]);
		};
		
		var htmlidprefix = "#" + that.MapEnum;
		// Generate the load/save items when user opens the Pins context menu for the first time
		var numslots = 8;
		var wordload = D.getWordCapital("load");
		var wordsave = D.getWordCapital("save");
		initializeStoredPins(numslots);
		for (var i = 0; i < numslots; i++)
		{
			$(htmlidprefix + "ContextLoadPins").append("<li data-index='" + i + "'>" + wordload + " #" + (i+1) + "</li>");
			$(htmlidprefix + "ContextSavePins").append("<li data-index='" + i + "'>" + wordsave + " #" + (i+1) + "</li>");
		}
		// Bind behavior for the created list items
		$(htmlidprefix + "ContextLoadPins li").click(function()
		{
			loadStoredPins($(this).attr("data-index"));
		});
		$(htmlidprefix + "ContextSavePins li").click(function()
		{
			saveStoredPins($(this).attr("data-index"));
		});
	},
	
	/*
	 * Saves the current personal pins as backup. This is to be called when the
	 * user manually adds and inserts a pin.
	 */
	saveBackupPins: function()
	{
		var obj = O.Utilities["BackupPins" + this.OptionSuffix];
		localStorage[obj.key] = JSON.stringify(this.getPersonalCoords());
	},
	loadBackupPins: function()
	{
		var obj = O.Utilities["BackupPins" + this.OptionSuffix];
		try
		{
			obj.value = JSON.parse(localStorage[obj.key]);
		}
		catch(e) {}
		this.redrawPersonalPath(obj.value, null);
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
		var url = (this.numPins === 0) ? "img/map/pin_red.png" : "img/map/pin_white.png";
		var marker = L.marker(pLatLng,
		{
			icon: L.icon(
			{
				iconUrl: url,
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			}),
			draggable: true,
			opacity: 0.9
		});
		this.toggleLayer(marker, true);
		this.Layer.PersonalPin.addLayer(marker);
		this.numPins++;
		if (pWantDraw)
		{
			this.drawPersonalPath();
		}
		
		// Single click pin: get its coordinates and toggle its opacity
		this.bindMarkerCoordBehavior(marker, "click");
		marker.on("click", function()
		{
			if (this.options.isMarked === undefined || this.options.isMarked === false)
			{
				this.options.isMarked = true;
				this.setOpacity(0.3);
			}
			else
			{
				this.options.isMarked = false;
				this.setOpacity(1);
			}
		});
		// Double click pin: remove itself from map
		marker.on("dblclick", function()
		{
			that.toggleLayer(this, false);
			that.Layer.PersonalPin.removeLayer(this);
			that.drawPersonalPath();
			that.numPins--;
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
		var latlngs = [];
		var i = 0;
		// Recompile pin coordinates for recreation
		this.Layer.PersonalPin.eachLayer(function(iPin) {
			latlngs.push(iPin.getLatLng());
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
		this.Layer.PersonalPin.eachLayer(function(iPin) {
			that.toggleLayer(iPin, false);
		});
		this.Layer.PersonalPin.clearLayers();
		this.drawPersonalPath();
		this.numPins = 0;
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
			var latlngs = [];
			var pinids = [];
			var length = 0;
			this.Layer.PersonalPin.eachLayer(function(iPin) {
				latlngs.push(iPin.getLatLng());
				pinids.push(P.getLayerId(iPin));
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
						that.outputCoordinatesCopy(that.getPersonalString());
						that.outputPinsRange();
					});
					// Double click path: insert a pin between the two pins that connect the path
					path.on("dblclick", function(pEvent)
					{
						that.saveBackupPins();
						that.insertPersonalPin(this.options.precede, pEvent.latlng);
					});
					this.Layer.PersonalPath.addLayer(path);
				}
				this.toggleLayer(this.Layer.PersonalPath, true);
				that.outputPinsRange();
			}
			else
			{
				this.toggleLayer(this.Layer.PersonalPath, false);
				this.Layer.PersonalPath.clearLayers();
			}
		}
		else
		{
			this.toggleLayer(this.Layer.PersonalPath, false);
			this.Layer.PersonalPath.clearLayers();
		}
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
	 * @param string pZoomArgs for map view.
	 */
	redrawPersonalPath: function(pCoords, pZoomArgs)
	{
		if (pCoords !== undefined && pCoords !== null && pCoords.length > 0)
		{
			this.clearPersonalPins();
			for (var i in pCoords)
			{
				this.createPersonalPin(this.convertGCtoLC(pCoords[i]));
			}
			this.drawPersonalPath();
			// View the first point in the generated path
			if (pZoomArgs !== null)
			{
				if (pZoomArgs === undefined)
				{
					this.goToArguments(pCoords[0]);
				}
				else
				{
					this.goToArguments(pZoomArgs);
				}
			}
		}
		else
		{
			I.write("Path unavailable for this.");
		}
	},
	
	/*
	 * Outputs the total game "unit" range distance for the pins.
	 */
	outputPinsRange: function()
	{
		var distance = 0;
		var markers = this.Layer.PersonalPin.getLayers();
		var length = markers.length - 1;
		
		for (var i = 0; i < length; i++)
		{
			distance += P.getDistanceBetweenCoords(
				this.convertLCtoGC(markers[i].getLatLng()),
				this.convertLCtoGC(markers[i+1].getLatLng())
			);
		}
		var units = ~~(distance * this.cPOINTS_TO_UNITS);
		var time = T.formatSeconds(Math.ceil(units / this.cUNITS_PER_SECOND), true);
		this.outputCoordinatesName(units + " " + D.getWord("range") + " (" + time + ")");
	},
	
	/*
	 * Tells if there is at least one personal pin laid on the map.
	 * @returns boolean.
	 */
	isPersonalPinsLaid: function()
	{
		if (this.Layer.PersonalPin.getLayers().length === 0)
		{
			I.write("No personal pins to work with. Double click on the map to lay pins.");
			return false;
		}
		return true;
	},
	
	/*
	 * Redraws the path with a shorter distance, only the starting point is not changed.
	 */
	optimizePersonalPath: function(pStart)
	{
		this.redrawPersonalPath(P.getGreedyPath(this.getPersonalCoords(), pStart));
	},
	
	/*
	 * Draw pins in random coordinates.
	 * @param pQuantity pins to draw.
	 */
	drawRandom: function(pQuantity)
	{
		var qty = parseInt(pQuantity);
		if (qty === 0 || qty > 1000 || this.numPins > 1000 || qty === undefined)
		{
			return;
		}
		
		var x, y;
		for (var i = 0; i < qty; i++)
		{
			x = T.getRandomIntRange(0, this.cMAP_BOUND);
			y = T.getRandomIntRange(0, this.cMAP_BOUND);
			this.createPersonalPin(this.convertGCtoLC([x, y]));
		}
		this.drawPersonalPath();
	},
	
	/*
	 * Gets the personal pins' coordinates.
	 * @returns string of the 2D array.
	 */
	getPersonalCoords: function()
	{
		var that = this;
		var coords = [];
		this.Layer.PersonalPin.eachLayer(function(iPin) {
			coords.push(that.convertLCtoGC(iPin.getLatLng()));
		});
		return coords;
	},
	getPersonalString: function()
	{
		return JSON.stringify(this.getPersonalCoords());
	},
	
	/*
	 * Gets the closest marker to the specified coordinates.
	 * @param array pCoord.
	 * @param object pLayerGroup markers to scan.
	 * @param boolean wantCoord to return coordinate instead of the marker object.
	 * @returns object Leaflet marker.
	 * @pre Coordinates must be inside a zone.
	 */
	getClosestLocation: function(pCoord, pLayerGroup)
	{
		var that = this;
		var distance;
		var mindistance = Number.POSITIVE_INFINITY;
		var minmarker = null;
		
		pLayerGroup.eachLayer(function(iLayer) {
			distance = P.getDistanceBetweenCoords(pCoord, that.convertLCtoGC(iLayer.getLatLng()));
			if (distance < mindistance)
			{
				mindistance = distance;
				minmarker = iLayer;
			}
		});
		return minmarker;
	},
	
	/*
	 * Writes context menu elements for placing weapons with range circles on the map.
	 */
	initializeWeaponPlacer: function(pMapObject)
	{
		var that = pMapObject;
		var htmlidprefix = "#" + that.MapEnum;
		var iconsperline = 5;
		var rangemaxvalue = 20000;
		var colormaxlength = 32;
		var importmaxlength = 8192;
		
		var weaponsmenu = $(htmlidprefix + "ContextRangeList");
		I.preventPropagation(weaponsmenu);
		var counter = 0;
		for (var i in that.Weapons)
		{
			var weapon = that.Weapons[i];
			if (weapon.isPlaceable === false)
			{
				continue;
			}
			counter++;
			var weaponbutton = $("<img src='img/wvw/range/" + weapon.image + I.cPNG + "' />");
			
			// Tooltip
			var title = (weapon.tooltip !== undefined) ? weapon.tooltip : D.getWordCapital("range") + " " + weapon.range;
			weaponbutton.attr("title", title);
			
			// Add weapon
			weaponsmenu.append(weaponbutton);
			if (counter % iconsperline === 0)
			{
				weaponsmenu.append("<br />");
			}
			(function(iWeapon)
			{
				weaponbutton.click(function()
				{
					that.createWeapon(iWeapon, that.ContextLatLng);
				});
			})(weapon);
		}
		
		// Button: lay a custom range weapon
		var custombutton = $("<img src='img/wvw/range/custom.png' "
			+ "title='<dfn>Lay a custom weapon on the map</dfn><br />using the range and color specified below.' />")
			.click(function()
			{
				var cw = {
					id: "custom",
					image: "custom",
					range: parseInt($(htmlidprefix + "RangeCustomRange").val()),
					color: U.stripToColorString($(htmlidprefix + "RangeCustomColor").val())
				};
				that.createWeapon(cw, that.ContextLatLng);
			});
		weaponsmenu.append(custombutton);
		
		// Button: clear all weapons
		var clearbutton = $("<img src='img/ui/default.png' "
			+ "title='<dfn>Delete all weapons on the map.</dfn><br />After laying a weapon on the map:<br />"
			+ "Drag it to move it.<br />Right click to center it.<br />Double click to delete it.' />")
			.click(function()
			{
				that.clearWeapons();
			});
		weaponsmenu.append(clearbutton);
		
		// Inputs: attributes for the custom range weapon
		weaponsmenu.append("<br /><span id='" + that.MapEnum + "RangeCustom' class='mapRangeCustom'><input id='"
			+ that.MapEnum + "RangeCustomRange' type='number' value='1200' min='0' max='"
				+ rangemaxvalue + "' step='100' style='width:64px' class='cssInputText' />"
			+ "<input id='" + that.MapEnum + "RangeCustomColor' type='text' value='#ffffff' maxlength='"
				+ colormaxlength + "' style='width:96px' class='cssInputText' />"
			+ "</span>");
		
		// Custom range input press enter
		$(htmlidprefix + "RangeCustomRange, " + htmlidprefix + "RangeCustomColor").onEnterKey(function()
		{
			custombutton.trigger("click");
		});
		
		// Buttons and inputs to import and export weapon placement
		var exportbutton  = $("<img src='img/ui/export.png' "
			+ "title='<dfn>(Export) Prints in data format the weapons</dfn> currently placed on the map.<br />"
			+ "The outputted text can be copied to share your weapons placement.' />")
			.click(function()
			{
				if (that.isWeaponsLaid())
				{
					I.write(U.escapeHTML(JSON.stringify(that.serializeWeapons())), 0, true);
				}
			});
		var importbutton = $("<img src='img/ui/import.png' id='" + that.MapEnum + "RangeImportButton' "
			+ "title='<dfn>(Import) Reads data from the text input box</dfn> on the right.<br />"
			+ "Weapons will be reconstructed from these pasted text data.' />")
			.click(function()
			{
				var str = $(htmlidprefix + "RangeImportText").val();
				try {
					var arsenal = JSON.parse(str);
					if (Array.isArray(arsenal))
					{
						that.redrawWeapons(arsenal);
					}
				}
				catch (e) {
					I.write("Invalid data string for importing weapons.");
				};
			});
		var importtext = $("<input id='" + that.MapEnum + "RangeImportText' type='text' value='' maxlength='"
			+ importmaxlength + "' style='width:96px' class='cssInputText' />")
			.onEnterKey(function()
			{
				$(htmlidprefix + "RangeImportButton").trigger("click");
			});
		weaponsmenu.append(exportbutton).append(importbutton).append(importtext);
		
		// Allow interaction with the inputs within the context menu
		weaponsmenu.find("input").click(function(iEvent)
		{
			iEvent.stopPropagation();
		});
		
		// The menu entry to draw standard siege placement
		$("#wvwContextDrawWeapons").click(function()
		{
			W.redrawDefaultWeapons();
		});
		
		// Finally
		I.qTip.init(".mapContextRangeList img");
		that.initializeWeaponStorage();
	},
	
	/*
	 * Initializes the weapon range storage system.
	 */
	initializeWeaponStorage: function()
	{
		var that = this;
		var initializeStoredWeapons = function(pQuantity)
		{
			var obj = O.Utilities["StoredWeapons" + that.OptionSuffix];
			// First make a new array with desired length
			obj.value = new Array(pQuantity);
			var key = obj.key;
			// Try to overwrite it with the stored arrays, if this fails then the value property is unchanged (a blank array)
			try
			{
				obj.value = JSON.parse(localStorage[key]);
			}
			catch(e) {}
		};
		var saveStoredWeapons = function(pIndex)
		{
			var obj = O.Utilities["StoredWeapons" + that.OptionSuffix];
			var weapons = that.serializeWeapons();
			if (weapons.length > 0)
			{
				obj.value[pIndex] = weapons;
				localStorage[obj.key] = JSON.stringify(obj.value);
			}
			else
			{
				that.isWeaponsLaid();
			}
		};
		var loadStoredWeapons = function(pIndex)
		{
			var obj = O.Utilities["StoredWeapons" + that.OptionSuffix];
			that.redrawWeapons(obj.value[pIndex]);
		};
		
		var htmlidprefix = "#" + that.MapEnum;
		// Generate the load/save items when user opens the Weapons context menu for the first time
		var numslots = 8;
		var wordload = D.getWordCapital("load");
		var wordsave = D.getWordCapital("save");
		initializeStoredWeapons(numslots);
		for (var i = 0; i < numslots; i++)
		{
			$(htmlidprefix + "ContextLoadWeapons").append("<li data-index='" + i + "'>" + wordload + " #" + (i+1) + "</li>");
			$(htmlidprefix + "ContextSaveWeapons").append("<li data-index='" + i + "'>" + wordsave + " #" + (i+1) + "</li>");
		}
		// Bind behavior for the created list items
		$(htmlidprefix + "ContextLoadWeapons li").click(function()
		{
			loadStoredWeapons($(this).attr("data-index"));
		});
		$(htmlidprefix + "ContextSaveWeapons li").click(function()
		{
			saveStoredWeapons($(this).attr("data-index"));
		});
	},
	
	/*
	 * Gets an array of objects with properties needed to reconstruct the weapons on the map.
	 * @returns array of objects.
	 */
	serializeWeapons: function()
	{
		var that = this;
		var weapons = [];
		that.Layer.WeaponCircle.eachLayer(function(iLayer)
		{
			// Store only the weapon ID and location
			var weapon = {
				id: iLayer.options.weaponid,
				coord: that.convertLCtoGC(iLayer.getLatLng())
			};
			// If it is a custom weapon, then also store the custom color and range
			if (iLayer.options.weaponid === "custom")
			{
				weapon.color = (iLayer.options.color).toLowerCase();
				weapon.range = parseInt(iLayer.options.weaponrange);
			}
			weapons.push(weapon);
		});
		return weapons;
	},
	
	/*
	 * Reconstructs a placement of weapons on the map.
	 * @param array pArsenal of weapons and their location.
	 * @param array pOffset x and y coordinates offset, optional.
	 * @pre Weapons' placement was stored as game coordinates, not LatLng.
	 */
	redrawWeapons: function(pArsenal, pOffset)
	{
		if (pArsenal !== undefined && pArsenal !== null && pArsenal.length > 0)
		{
			this.clearWeapons();
			for (var i in pArsenal)
			{
				var weapon = pArsenal[i];
				var coord = (pOffset !== undefined) ? [weapon.coord[0] + pOffset[0], weapon.coord[1] + pOffset[1]] : weapon.coord;
				// If it is not a custom weapon, then use the default properties via that weapon ID
				var weapontomake = null;
				if (weapon.id === "custom"
					&& weapon.range !== undefined
					&& weapon.color !== undefined
					&& weapon.coord !== undefined)
				{
					weapontomake = {
						id: weapon.id,
						image: "custom",
						coord: coord,
						range: parseInt(weapon.range),
						color: U.stripToColorString(weapon.color)
					};
				}
				else if (this.Weapons[weapon.id] !== undefined)
				{
					weapontomake = this.Weapons[weapon.id];
				}
				
				// Only draw if it is a valid weapon object
				if (weapontomake !== null)
				{
					this.createWeapon(weapontomake, this.convertGCtoLC(coord));
				}
				else
				{
					I.write("Failed parsing a weapon.");
				}
			}
		}
		else
		{
			I.write("Arsenal unavailable for this.");
		}
	},
	
	/*
	 * Draws the standard siege placement for the current zone.
	 */
	redrawDefaultWeapons: function()
	{
		var placementname = W.Metadata.PlacementAssociation[W.ZoneCurrent.nick];
		var offset = W.Metadata.Offsets[W.ZoneCurrent.nick];
		if (offset !== undefined)
		{
			var arsenal = W.Placement[placementname].Siege;
			W.redrawWeapons(arsenal, offset);
		}
	},
	
	/*
	 * Tells if there is at least one personal pin laid on the map.
	 * @returns boolean.
	 */
	isWeaponsLaid: function()
	{
		if (this.Layer.WeaponIcon.getLayers().length === 0)
		{
			I.write("No weapons to work with. Lay weapons from the map's &quot;Range&quot; context menu.");
			return false;
		}
		return true;
	},
	
	/*
	 * Places a range marker icon and circle circumference on the map.
	 * @param object pWeapon.
	 * @param object pLatLng location of the weapon.
	 * @pre LatLng variable was assigned when the user right clicked on the map.
	 */
	createWeapon: function(pWeapon, pLatLng)
	{
		var that = this;
		// The circle indcating the range
		var trueradius = pWeapon.range * M.cUNITS_TO_POINTS;
		var radius = this.getZoomedDistance(trueradius);
		var circle = L.circleMarker(pLatLng, {
			clickable: false,
			weaponid: pWeapon.id,
			weaponrange: pWeapon.range,
			trueradius: trueradius,
			radius: radius,
			color: pWeapon.color,
			weight: 2,
			opacity: pWeapon.opacity || 0.8,
			fillOpacity: pWeapon.fillOpacity || 0.1
		});
		this.Layer.WeaponCircle.addLayer(circle);
		this.toggleLayer(circle);
		
		// The interactive icon allowing the user to relocate the circle
		var weapon = L.marker(pLatLng,
		{
			circle: circle,
			icon: L.icon(
			{
				className: "mapWeapon",
				iconUrl: "img/wvw/range/" + pWeapon.image + I.cPNG,
				iconSize: [24, 24],
				iconAnchor: [12, 12]
			}),
			draggable: true,
			opacity: 0.9
		});
		that.bindMarkerCoordBehavior(weapon, "click");
		
		// Bind placed range icon behavior
		weapon.on("drag", function()
		{
			this.options.circle.setLatLng(this.getLatLng());
		});
		weapon.on("dblclick", function()
		{
			that.removeWeapon(this);
		});
		weapon.on("contextmenu", function()
		{
			if (that.GPSPreviousCoord.length > 0)
			{
				that.movePin(this, that.GPSPreviousCoord);
			}
			else
			{
				that.movePin(this, that.Map.getCenter());
			}
			this.options.circle.setLatLng(this.getLatLng());
		});
		this.Layer.WeaponIcon.addLayer(weapon);
		this.toggleLayer(weapon);
	},
	
	/*
	 * Removes a placed weapon from the map and associated container objects.
	 * @param object pMarker.
	 */
	removeWeapon: function(pMarker)
	{
		// Remove its range circle before removing the weapon
		this.toggleLayer(pMarker.options.circle, false);
		this.Layer.WeaponCircle.removeLayer(pMarker.options.circle);
		// Remove the weapon itself
		this.toggleLayer(pMarker, false);
		this.Layer.WeaponIcon.removeLayer(pMarker);
	},
	
	/*
	 * Removes all weapons from the map.
	 */
	clearWeapons: function()
	{
		var that = this;
		this.Layer.WeaponIcon.eachLayer(function(iLayer)
		{
			that.removeWeapon(iLayer);
		});
		this.Layer.WeaponCircle.clearLayers();
		this.Layer.WeaponIcon.clearLayers();
	},
	
	/*
	 * Changes the marker icon's image and size (Leaflet does not have this method).
	 * @param object pMarker Leaflet marker.
	 * @param string pIconURL of the icon image.
	 * @param int pSize of icon.
	 */
	resizeMarkerIcon: function(pMarker, pSize)
	{
		if (pSize === undefined)
		{
			pSize = this.cICON_SIZE_STANDARD;
		}
		
		pMarker.setIcon(new L.icon(
		{
			iconUrl: pMarker.options.icon.options.iconUrl,
			iconSize: [pSize, pSize],
			iconAnchor: [pSize/2, pSize/2]
		}));
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
	 * @param enum pZoom level or object with integer "offset" key.
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
		else if (pZoom === this.ZoomEnum.Same)
		{
			pZoom = this.Map.getZoom();
		}
		else if (pZoom === this.ZoomEnum.Adaptive)
		{
			pZoom = this.getAdaptiveZoom();
		}
		else if (typeof pZoom === "object" && pZoom.offset !== undefined)
		{
			pZoom = this.getAdaptiveZoom(pZoom.offset);
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
	 * Gets a zoom level that depends on the user's screen width.
	 * @param int pOffset from the returned zoom.
	 * @returns int zoom level.
	 */
	getAdaptiveZoom: function(pOffset)
	{
		if (pOffset === undefined)
		{
			pOffset = 0;
		}
		var zoom;
		var winwidth = $(window).width();
		
		if (winwidth >= I.ScreenWidth.Huge)
		{
			zoom = this.ZoomEnum.Default + 1;
		}
		else if (winwidth >= I.ScreenWidth.Large)
		{
			zoom = this.ZoomEnum.Default;
		}
		else if (winwidth >= I.ScreenWidth.Medium)
		{
			zoom = this.ZoomEnum.Default - 1;
		}
		else
		{
			zoom = this.ZoomEnum.Default - 2;
		}
		return zoom + pOffset;
	},
	
	/*
	 * Views the default map view.
	 */
	goToDefault: function(pZoom)
	{
		if (pZoom === undefined)
		{
			pZoom = this.getAdaptiveZoom();
		}
		this.Map.setView(this.convertGCtoLC(this.cMAP_CENTER), pZoom);
	},
	
	/*
	 * Views the map at the given URL coordinates if exist.
	 * URL should be in the form of http://gw2timer.com/?go=4874,16436,1
	 * @param string pArguments of location to view.
	 * @param enum pZoom level, optional.
	 * @param object pPin pin, optional.
	 * coords[0] = x coordinate.
	 * coords[1] = y coordinate.
	 * coords[2] = z coordinate (zoom level, lower value equals greater zoom-in).
	 */
	goToArguments: function(pArguments, pZoom, pPin)
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
					this.goToView(coords, pZoom, pPin);
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
							this.goToView(this.getZoneCenter(i), this.ZoomEnum.Sky);
							break;
						}
					}
				}
			}
		}
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
		var latlngs = [];
		for (i = pIndexStart; i < pCoordArray.length; i++)
		{
			latlngs.push(this.convertGCtoLC(pCoordArray[i]));
		}
		return latlngs;
	},
	
	/*
	 * Converts two coordinates [[X1, Y2], [X2, Y2]] to two LatLng's.
	 * @param 2D array pSegmentArray.
	 * @returns array.
	 */
	convertGCtoLCDual: function(pSegmentArray)
	{
		return [this.convertGCtoLC(pSegmentArray[0]), this.convertGCtoLC(pSegmentArray[1])];
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
		var coords = [];
		for (var i = 0; i < pCoordArray.length; i++)
		{
			coords.push(this.convertLCtoGC(pCoordArray[i]));
		}
		return coords;
	},
	
	/*
	 * Converts a map_floor.json event coordinates to the map coordinates system.
	 * @param 2D float array pPos event center. Only uses [0] and [1] values.
	 * @param object pZone to translate coordinates.
	 * @returns 2D int array map coordinates.
	 * @pre pZone was initialized (this is asynchronous).
	 */
	convertEventCoord: function(pPos, pZone)
	{
		var cr = pZone.continent_rect; // 2D float array
		var mr = pZone.map_rect; // 2D float array
		/*
		 * Dry Top's actual (API) continent_rect overlaps Silverwastes, so use
		 * the actual only when it is to convert Event or GPS coordinates.
		 */
		if (pZone.id === "988")
		{
			cr = pZone.continent_rect_actual;
		}
		
		// Code from http://gw2.chillerlan.net/examples/gw2maps-jquery.html
		return [
			~~(cr[0][0]+(cr[1][0]-cr[0][0])*(pPos[0]-mr[0][0])/(mr[1][0]-mr[0][0])),
			~~(cr[0][1]+(cr[1][1]-cr[0][1])*(1-(pPos[1]-mr [0][1])/(mr[1][1]-mr[0][1])))
		];
	},
	
	/*
	 * Converts a MumbleLink player coordinates to the map coordinates system.
	 * @param 2D float array pPos [latitude altitude longitude] player position.
	 * @param string pZoneID of the zone the player is in.
	 * @returns 2D int array map coordinates.
	 */
	convertGPSCoord: function(pPos, pZoneID)
	{
		var zone = this.getZoneFromID(pZoneID);
		var coord = new Array(3);
		coord[0] = pPos[0] * this.cMETERS_TO_UNITS; // x coordinate
		coord[1] = pPos[2] * this.cMETERS_TO_UNITS; // y coordinate
		coord[2] = pPos[1] * this.cMETERS_TO_UNITS; // z coordinate
		return this.convertEventCoord(coord, zone);
	},
	
	/*
	 * Converts a MumbleLink 3D vector values to degrees of 2D rotation.
	 * @param 2D array pVector [x, z, y].
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
	 * Converts a string of coordinates to a 2D array.
	 * @param string pString array in the form of "[[X1,Y1],[X2,Y2]]" GW2 coords.
	 * @returns 2D array of coordinates. null if unable to parse.
	 */
	parseCoordinatesMulti: function(pString)
	{
		var arraylengthlimit = 13;
		var s = pString.replace(/\s/g, "");
		var sarray = [];
		var narray = [];
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
					coord[0] = Math.round(coord[0]);
					coord[1] = Math.round(coord[1]);
					narray.push(coord);
				}
			}
			return narray;
		}
		return null;
	},
	
	/*
	 * Converts and prints an array of LatLngs to GW2 coordinates.
	 * @param 2D array pArray.
	 * @returns 2D array.
	 */
	convertLatLngs: function(pArray)
	{
		var coords = this.convertLCtoGCMulti(pArray);
		P.printCoordinates(coords);
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
	 * @param enum pZoom level.
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
	 * @param enum pZoom level when viewed location.
	 */
	bindMapLinkBehavior: function(pLink, pZoom, pPin)
	{
		if (I.isMapEnabled === false || pLink === undefined || pLink === null) { return; }
		var that = this;
		pLink.click(function()
		{
			var command = $(this).attr("data-coord");
			U.interpretCommand(command, that, pZoom, pPin);
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
				that.Map.zoomIn();
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
	 * Binds standard behavior when user do something to an icon on the map.
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
	bindMarkerZoomBehavior: function(pMarker, pEventType, pZoomOut)
	{
		var that = this;
		if (pZoomOut === undefined)
		{
			pZoomOut = that.ZoomEnum.Default;
		}
		
		pMarker.on(pEventType, function(pEvent)
		{
			if (that.Map.getZoom() === that.ZoomEnum.Max)
			{
				var center = that.Map.getCenter();
				if (~~(center.lat) === ~~(pEvent.latlng.lat)
					&& ~~(center.lng) === ~~(pEvent.latlng.lng))
				{
					// If maxed zoom and centered on the marker, then zoom out
					that.Map.setZoom(pZoomOut);
				}
				else
				{
					// If maxed zoom and not centered on the marker, then center on the marker
					that.Map.setView(pEvent.latlng, that.Map.getZoom());
				}
			}
			else
			{
				// All other cases zoom and center on the marker
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
			that.outputCoordinatesCopy(P.formatCoord(coord));
		});
	},
	bindMarkerWikiBehavior: function(pMarker, pEventType)
	{
		pMarker.on(pEventType, function(pEvent)
		{
			var name = this.options.wiki;
			// Trim trailing period if exists
			if (name.indexOf(".") === name.length - 1)
			{
				name = name.slice(0, -1);
			}
			U.openExternalURL(U.getWikiLink(name));
		});
	},
	
	/*
	 * Translates the zones list in the Map page and bind click zoom behavior.
	 * @pre The translated names from the API was retrieved.
	 */
	bindZoneList: function(pMapObject)
	{
		var that = pMapObject;
		var htmlidprefix = "#" + that.MapEnum;
		$(htmlidprefix + "ZoneList li").each(function()
		{
			var zonenick = $(this).attr("data-zone");
			$(this).text(that.getZoneName(zonenick));
			$(this).attr("data-coord", that.getZoneCenter(zonenick).toString());
			that.bindMapLinkBehavior($(this), {offset: 1});
		});
		$(htmlidprefix + "ZoneList h2").each(function()
		{
			var regionnick = $(this).attr("data-region");
			$(this).text(D.getObjectName(that.Regions[regionnick]));
		});
	}	
};

/* =============================================================================
 * @@Populate shared and independent map properties and functions
 * ========================================================================== */
P = {
	
	SuffixCurrent: "", // Map options with suffix to differentiate for which map
	MapCurrent: "map", // The map currently displayed on the website
	GPSCurrent: null, // The map which the player resides in game
	MapEnum:
	{
		Tyria: "map",
		Mists: "wvw"
	},
	
	Layer: {
		ZoneBorder: new L.layerGroup(), // Rectangles colored specific to the zones' region
		ZoneGateway: new L.layerGroup(), // Interzone and intergate connections
		DryTopNicks: new L.layerGroup(), // Dry Top event names and timestamps
		Chest: new L.layerGroup()
	},
	LayerArray: {
		ChainPath: [],
		Resource: [],
		JP: [],
		Guild_Bounty: [],
		Guild_Trek: [],
		Guild_Challenge: [],
		Guild_Rush: [],
		Guild_Puzzle: [],
		DryTopIcons: [],
		DryTopRings: [],
		DryTopActive: []
	},
	
	Events: {},
	DryTopTimer: {},
	Resources: {},
	JPs: {},
	Chests: {},
	Collectibles: {},
	Guild: {},
	GPSTimeout: {},
	
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
	 * Generates map waypoints and other markers from the GW2 server API files.
	 */
	populateMap: function(pMapObject)
	{
		if (!I.isMapEnabled)
		{
			return;
		}
		var that = pMapObject;
		var url;
		var completionboolean = O.Options["bol_showWorldCompletion" + that.OptionSuffix];
		switch (that.MapEnum)
		{
			case P.MapEnum.Tyria: {
				url = U.URL_API.MapFloorTyria;
			} break;
			
			case P.MapEnum.Mists: {
				url = U.URL_API.MapFloorMists;
				// Exit this entire function if using the Mists map but have completion option off
				if (completionboolean === false)
				{
					return;
				}
			} break;
		}
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
		$.getJSON(url, function(pData)
		{
			var i;
			var regionid, region, zoneid, apizone, poi;
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
					
					apizone = region.maps[zoneid];
					zoneobj = that.getZoneFromID(zoneid);
					var numheart = 0;
					var numwaypoint = 0;
					var numlandmark = 0;
					var numchallenge = 0;
					var numvista = 0;
					
					/* 
					 * For waypoints, points of interest, and vistas.
					 */
					numofpois = apizone.points_of_interest.length;
					for (i = 0; i < numofpois; i++)
					{
						poi = apizone.points_of_interest[i];

						// Properties assignment based on POI's type
						switch (poi.type)
						{
							case that.APIPOIEnum.Waypoint:
							{
								// Waypoints are always created for Tyria, others are optional
								numwaypoint++;
								icon = U.URL_IMG.Waypoint;
								cssclass = "mapWp";
								tooltip = poi.name;
							} break;
							
							case that.APIPOIEnum.Landmark:
							{
								if (completionboolean === false)
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
								if (completionboolean === false)
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
							id: poi.poi_id
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
						// Clicking on waypoints or POIs gives a chatlink
						if (poi.type === that.APIPOIEnum.Waypoint || poi.type === that.APIPOIEnum.Landmark)
						{
							marker.on("click", function()
							{
								that.outputCoordinatesCopy(U.getChatlinkFromPoiID(this.options.id));
								that.outputCoordinatesName(this.options.markername);
							});
							marker.on("dblclick", function(pEvent)
							{
								U.openExternalURL(U.getWikiLanguageLink(this.options.markername));
							});
							that.bindMarkerZoomBehavior(marker, "contextmenu", that.ZoomEnum.Sky);
						}
						else
						{
							that.bindMarkerZoomBehavior(marker, "click", that.ZoomEnum.Sky);
							that.bindMarkerZoomBehavior(marker, "contextmenu", that.ZoomEnum.Sky);
						}
					}
					
					/*
					 * For API separate arrays for pois.
					 */
					if (completionboolean)
					{
						// Hero Challenges
						numofpois = apizone.skill_challenges.length;
						numchallenge = numofpois;
						for (i = 0; i < numofpois; i++)
						{
							poi = apizone.skill_challenges[i];
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
							that.bindMarkerZoomBehavior(marker, "click", that.ZoomEnum.Sky);
							that.bindMarkerZoomBehavior(marker, "contextmenu", that.ZoomEnum.Sky);
							zoneobj.Layers.Challenge.addLayer(marker);
						}
						
						// Renown Hearts
						numofpois = apizone.tasks.length;
						numheart = numofpois;
						for (i = 0; i < numofpois; i++)
						{
							poi = apizone.tasks[i];
							marker = L.marker(that.convertGCtoLC(poi.coord),
							{
								title: "<span class='" + "mapPoi" + "'>" + poi.objective + " (" + poi.level + ")" + "</span>",
								wiki: poi.objective,
								icon: L.icon(
								{
									iconUrl: U.URL_IMG.Heart,
									iconSize: [16, 16],
									iconAnchor: [8, 8]
								})
							});
							M.bindMarkerWikiBehavior(marker, "click");
							M.bindMarkerZoomBehavior(marker, "contextmenu", that.ZoomEnum.Sky);
							zoneobj.Layers.Heart.addLayer(marker);
						}
						
						// Sector Names
						numofpois = apizone.sectors.length;
						for (i = 0; i < numofpois; i++)
						{
							poi = apizone.sectors[i];
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
					if (completionboolean)
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
									+ ((apizone.min_level > 0) ? ("<var class='mapOverviewLevel'>"
										+ ((apizone.min_level === 80) ? (apizone.max_level) : (apizone.min_level + " - " + apizone.max_level))
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
			if (that.MapEnum === P.MapEnum.Tyria && O.Options.bol_displayEvents === false)
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
				+ "- The ArenaNet server is down for maintenance.<br />"
				+ "- Your browser is too old (if IE then need 11+).<br />"
				+ "- Your computer's time is out of sync.<br />"
				+ "- This website's code encountered a bug.<br />"
				+ "Map features will be limited.<br />", 20);
			}
		}).always(function() // Do after AJAX regardless of success/failure
		{
			switch (that.MapEnum)
			{
				case P.MapEnum.Tyria: {
					if (O.Options.bol_displayEvents === true)
					{
						P.populateEvents();
					}
					else
					{
						P.finishPopulation();
					}
				} break;

				case P.MapEnum.Mists: {
					W.finishPopulation();
				} break;
			}
		});
	}, // End of populateMap
	
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
				pName.indexOf("hero ch") !== -1 || // Hero challenges
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
			if (pName.indexOf("salvage") !== -1) return "img/event/collect.png";
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
						wiki: event.name,
						icon: L.icon(
						{
							iconUrl: determineEventIcon(searchname),
							iconSize: [48, 48],
							iconAnchor: [24, 24]
						})
					});
					M.bindMarkerWikiBehavior(marker, "click");
					M.bindMarkerZoomBehavior(marker, "contextmenu");
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
	}, // end of populateEvents
	
	/*
	 * Does final touches to the map after the icons have been generated.
	 */
	donePopulation: function()
	{
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
		// Do visual changes
		M.isMapAJAXDone = true;
		M.bindMapVisualChanges();
		M.adjustZoomMapping();
		P.adjustZoomDryTop();
		
		// Execute query string commands if available
		var qsgo = U.Args[U.KeyEnum.Go];
		var qsdraw = U.Args[U.KeyEnum.Draw];
		if (qsgo !== undefined)
		{
			M.goToArguments(qsgo, M.ZoomEnum.Ground, M.Pin.Program);
			U.Args[U.KeyEnum.Go] = null;
		}
		if (qsdraw !== undefined)
		{
			M.parsePersonalPath(qsdraw);
		}
		
		// Start GPS if on overlay
		if (I.ModeCurrent === I.ModeEnum.Overlay)
		{
			P.tickGPS();
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
	 * Gets ID of a Leaflet layer.
	 * @param object pLayer.
	 * @returns string ID number.
	 */
	getLayerId: function(pLayer)
	{
		return pLayer["_leaflet_id"];
	},
	
	/*
	 * Gets the object containing the layers.
	 * @param object pLayerGroup
	 * @returns object iterable.
	 */
	getLayerGroup: function(pLayerGroup)
	{
		return pLayerGroup["_layers"];
	},
	
	/*
	 * Sorts an array of GW2 coordinates.
	 * @param 2D array pArray to sort.
	 */
	sortCoordinates: function(pCoords, pIsNumbered)
	{
		var coord;
		// Convert to integer
		for (var i in pCoords)
		{
			coord = pCoords[i];
			coord[0] = Math.round(coord[0]);
			coord[1] = Math.round(coord[1]);
		}
		// Sort the array
		pCoords.sort(function (a, b)
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
			for (var i in pCoords)
			{
				this.printNumberedCoordinates(pCoords[i], i);
			}
		}
		else
		{
			return pCoords;
		}
	},
	roundCoordinates: function(pCoords)
	{
		var coord;
		// Convert to integer
		for (var i in pCoords)
		{
			coord = pCoords[i];
			coord[0] = Math.round(coord[0]);
			coord[1] = Math.round(coord[1]);
		}
		// Print the result formatted
		this.printCoordinates(pCoords);
	},
	printNeedles: function(pNeedles)
	{
		for (var i in pNeedles)
		{
			this.printNumberedCoordinates((pNeedles[i]).c, i);
		}
	},
	printNodes: function(pCoords, pIsNumbered)
	{
		for (var i = 0; i < pCoords.length; i++)
		{
			var numprefix = (pIsNumbered) ? ("n: " + (i+1) + ", ") : "";
			I.write("{" + numprefix + "c: [" + (pCoords[i])[0] + ", " + (pCoords[i])[1] + "]},", 0);
		}
	},
	printNumberedCoordinates: function(pCoord, i)
	{
		I.write("{n: " + (parseInt(i)+1) + ", c: [" + pCoord[0] + ", " + pCoord[1] + "]},", 0);
	},
	formatCoord: function(pCoord)
	{
		return "[" + pCoord[0] + ", " + pCoord[1] + "]";
	},
	compileCoordinates: function(pCoords)
	{
		var output = "";
		for (var i = 0; i < pCoords.length; i++)
		{
			output += (pCoords[i] === null) ? "null," : "[" + (pCoords[i])[0] + "," + (pCoords[i])[1] + "],";
		}
		output = output.substring(0, output.length - 1); // Trim last comma
		return "[" + output + "]";
	},
	printCoordinates: function(pCoords)
	{
		I.write(this.compileCoordinates(pCoords), 0);
	},
	
	/*
	 * Prints a series of text inputs for the user to copy waypoint chatlinks
	 * that are closest to each personal pins.
	 * @returns int number of waypoints to be used.
	 */
	printClosestWaypoints: function()
	{
		var CHATLINKS_PER_MESSAGE = 12; // Maximum to fit chat message limit
		var DISTANCE_MINIMUM = 500; // The distance between two coordinates must be greater than this to include a new waypoint
		var html = "";
		var chatlink;
		var chatlinks = [""]; // First element is a dummy for comparison
		var coordpin;
		var coordprev = [0, 0];
		var distancetoprevious = 0;
		var zone, waypoint;
		
		M.Layer.PersonalPin.eachLayer(function(iLayer)
		{
			coordpin = M.convertLCtoGC(iLayer.getLatLng());
			zone = M.getZoneFromCoord(coordpin);
			if (zone !== null)
			{
				waypoint = M.getClosestLocation(coordpin, zone.Layers.Waypoint);
				chatlink = "";
				if (waypoint !== null)
				{
					chatlink = U.getChatlinkFromPoiID(waypoint.options.id);
					distancetoprevious = P.getDistanceBetweenCoords(coordpin, coordprev);
					// Don't append consecutively duplicate waypoints or if distance between is too short
					if (chatlinks[chatlinks.length - 1] !== chatlink && distancetoprevious > DISTANCE_MINIMUM)
					{
						chatlinks.push(chatlink);
					}
					coordprev = coordpin;
				}
			}
		});
		chatlinks.shift(); // Remove the first dummy element
		
		if (chatlinks.length > 0)
		{
			// A message contains a limited quantity of chatlinks/waypoints
			var nummessages = Math.ceil(chatlinks.length / CHATLINKS_PER_MESSAGE);
			var numwaypoints = 0;
			var html = "<div id='jsWaypointLinks'>Copy the codes below and<br />paste them in game chat to <br />follow the route:<br />";
			for (var i = 0; i < nummessages; i++)
			{
				// Each message gets its own input box
				html += "<input type='text'  class='cssInputText' value='";
				for (var ii = CHATLINKS_PER_MESSAGE * i;
						ii < (CHATLINKS_PER_MESSAGE * (i+1));
						ii++)
				{
					if (numwaypoints >= chatlinks.length)
					{
						// If reached the end of the array
						break;
					}
					html += " " + (ii+1) + "-&gt;" + chatlinks[ii]; // Chatlinks divider
					numwaypoints++;
				}
				html += "' /> Message " + (i+1) + "<br />";
			}
			html += "</div>";
			
			// Output the input boxes containing the chatlinks
			I.write(html, 0, true);
			$("#jsWaypointLinks .cssInputText").click(function()
			{
				$(this).select();
			});
		}
		else
		{
			I.write("Pins must first be placed and be inside zones in order to create chatlinks.");
		}
		// Return the number of waypoints
		return numwaypoints;
	},
	
	/*
	 * Gets the distance between two points.
	 * @param array pCoordA.
	 * @param array pCoordB.
	 * @returns float distance.
	 */
	getDistanceBetweenCoords: function(pCoordA, pCoordB)
	{
		return Math.sqrt(Math.pow(pCoordA[0] - pCoordB[0], 2) + Math.pow(pCoordA[1] - pCoordB[1], 2));
	},
	getUnitsBetweenCoords: function(pCoordA, pCoordB)
	{
		return ~~(P.getDistanceBetweenCoords(pCoordA, pCoordB) * M.cPOINTS_TO_UNITS);
	},
	
	/*
	 * Gets a nearest-immediate-neighbor path from an array of coordinates.
	 * @param 2D array pCoords of GW2 coordinates.
	 * @param int pStart index of the optional starting coordinate.
	 * @returns 2D array path.
	 */
	getGreedyPath: function(pCoords, pStart)
	{
		var array = pCoords;
		if (pStart !== undefined)
		{
			// Do initial swapping for selected starting coordinates
			var temp = array[0];
			array[0] = array[pStart];
			array[pStart] = temp;
		}
		
		var currentcoord = array[0];
		var indexofclosest = 0;
		var length = array.length;
		
		for (var i = 0; i < length; i++)
		{
			var prevmindistance = Number.POSITIVE_INFINITY;
			// Scan through coordinates and find the closest to the current point
			for (var ii = i; ii < length; ii++)
			{
				var ithdistance = P.getDistanceBetweenCoords(currentcoord, array[ii]);
				if (ithdistance <= prevmindistance)
				{
					indexofclosest = ii;
					prevmindistance = ithdistance;
				}
			}
			/*
			 * Rewrite the array with the closest adjacent points, example:
			 * [A, B, C, D, E] where B was found to be closest to A, and C was
			 * found closest to B in the order they were scanned.
			 */
			currentcoord = array[indexofclosest];
			array[indexofclosest] = array[i];
			array[i] = currentcoord;
		}
		
		return array;
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
	 * Prints the current zone's event names and coordinates.
	 */
	printZoneEvents: function()
	{
		if (M.isEventIconsGenerated)
		{
			M.ZoneCurrent.Layers.EventIcon.eachLayer(function(iLayer) {
				I.write("<input type='text' class='cssInputText' value='[" + M.convertLCtoGC(iLayer.getLatLng()) + "]' /> " + iLayer.options.task, 0);
			});
		}
		else
		{
			I.write("Event icons have not been generated.");
		}
	},
	
	/*
	 * Generates border rectangles on initial call. Otherwise toggle visibility.
	 */
	drawZoneBorders: function()
	{
		if (O.Options.bol_showZoneBorders
			&& P.Layer.ZoneBorder.getLayers().length === 0)
		{
			for (var i in M.Zones)
			{
				var zoneobj = M.Zones[i];
				// Cover the zone with a colored border signifying its region
				P.Layer.ZoneBorder.addLayer(L.rectangle(
					M.convertGCtoLCMulti(zoneobj.continent_rect), {
						fill: false,
						color: M.Regions[zoneobj.region].color,
						weight: 2,
						clickable: false
					}
				));
			}
		}
		M.toggleLayer(P.Layer.ZoneBorder, O.Options.bol_showZoneBorders);
	},
	
	/*
	 * Generates gateway icons on initial call. Otherwise toggle visibility.
	 */
	drawZoneGateways: function()
	{
		if (O.Options.bol_showZoneGateways
			&& P.Layer.ZoneGateway.getLayers().length === 0)
		{
			var marker, path;
			var interzones = GW2T_GATEWAY_CONNECTION.interzones;
			var intergates = GW2T_GATEWAY_CONNECTION.intergates;
			var launchpads = GW2T_GATEWAY_CONNECTION.launchpads;
			
			var drawGateway = function(pCoord, pImage, pOpacity, pTitle)
			{
				pTitle = (pTitle === undefined) ? null : pTitle;
				var marker = L.marker(M.convertGCtoLC(pCoord),
				{
					icon: L.icon(
					{
						iconUrl: pImage,
						iconSize: [32, 32], // Initial size corresponding to default zoom level
						iconAnchor: [16, 16]
					}),
					opacity: pOpacity || 0.6,
					title: pTitle
				});
				M.bindMarkerZoomBehavior(marker, "click");
				M.bindMarkerZoomBehavior(marker, "contextmenu");
				return marker;
			};
			
			for (var i in interzones)
			{
				// Draw the two gateways
				for (var ii in interzones[i])
				{
					marker = drawGateway((interzones[i])[ii], "img/map/gateway_zone.png");
					P.Layer.ZoneGateway.addLayer(marker);
				}
			}
			for (var i in intergates)
			{
				// Draw the two asura gates
				for (var ii in intergates[i])
				{
					marker = drawGateway((intergates[i])[ii], "img/map/gateway_gate.png");
					P.Layer.ZoneGateway.addLayer(marker);
				}
				// Draw the line connecting the gate
				path = L.polyline(M.convertGCtoLCDual(intergates[i]),
				{
					color: "purple",
					opacity: 0.2
				});
				P.Layer.ZoneGateway.addLayer(path);
			}
			for (var i in launchpads)
			{
				var tooltip = "<div class='mapLoc'><img src='" + (launchpads[i]).i + "' /></div>";
				// Draw the launchpad (first inner coordinates)
				marker = drawGateway((launchpads[i]).c[0], "img/map/launchpad.png", 1, tooltip);
				P.Layer.ZoneGateway.addLayer(marker);
				// Draw the line trajectory
				path = L.polyline(M.convertGCtoLCDual(launchpads[i].c),
				{
					color: "gold",
					opacity: 0.2
				});
				P.Layer.ZoneGateway.addLayer(path);
			}
			I.qTip.init(".leaflet-marker-icon");
		}
		M.toggleLayer(P.Layer.ZoneGateway, O.Options.bol_showZoneGateways);
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
				M.Zones[(pChain.zone)].Layers.Path.addLayer(pathline);
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
			C.DryTop = GW2T_DRYTOP_EVENTS;
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
						wiki: D.getObjectName(event),
						icon: L.icon(
						{
							iconUrl: "img/event/" + event.icon + I.cPNG,
							iconSize: [16, 16],
							iconAnchor: [8, 8]
						})
					});
					M.bindMarkerWikiBehavior(event.eventicon, "click");
					M.bindMarkerZoomBehavior(event.eventicon, "contextmenu");
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
				I.qTip.init($("#mapDryTopClip0, #mapDryTopClip1").click(function()
				{
					$(this).select();
				}).hover(
					function() { M.isMouseOnHUD = true; },
					function() { M.isMouseOnHUD = false; }
				));
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
				M.resizeMarkerIcon(icon, iconsize);
				// Rings
				icon = P.LayerArray.DryTopRings[i];
				M.resizeMarkerIcon(icon, ringsize);
			}
			
			P.Layer.DryTopNicks.eachLayer(function(iLayer) {
				if (iLayer._icon)
				{
					iLayer._icon.style.fontSize = nickfontsize + "px";
					iLayer._icon.style.opacity = nickopacity;
					iLayer._icon.style.zIndex = M.cZIndexBury + 1; // Don't cover other icons
					iLayer._icon.style.display = "table"; // For middle vertical alignment
				}
			});
			P.DryTopTimer._icon.style.fontSize = (nickfontsize*2) + "px";
			P.DryTopTimer._icon.style.opacity = nickopacity;
			P.DryTopTimer._icon.style.zIndex = M.cZIndexRaise + 1;
			P.DryTopTimer._icon.style.display = "table";
		}
	},
	
	/*
	 * Checks whether the player is in a Tyria or a Mists associated zone then
	 * switch the map automatically if it is not already displayed.
	 */
	switchMapCheck: function()
	{
		if (GPSIdentityJSON === undefined || GPSIdentityJSON === null)
		{
			return;
		}
		
		var previousmap = P.GPSCurrent;
		var currentnick = GPSIdentityJSON["map_id"];
		var htmlidprefix = "#" + P.MapCurrent;
		
		// Get the map the player is in
		if (M.ZoneAssociation[currentnick] !== undefined)
		{
			P.GPSCurrent = P.MapEnum.Tyria;
		}
		else if (W.ZoneAssociation[currentnick] !== undefined)
		{
			P.GPSCurrent = P.MapEnum.Mists;
		}
		
		// If the player has changed the map in game and the website's map is different from it, then switch the website's map
		if (P.GPSCurrent !== previousmap && P.GPSCurrent !== P.MapCurrent)
		{
			$(htmlidprefix + "SwitchButton").trigger("click");
		}
	},
	
	/*
	 * Imitates the character pin as in the game minimap, as informed by the overlay.
	 * This function is shared by the Tyria and Mists maps.
	 * @param int pForceCode 1 to force update position, -1 angle, 0 both, undefined neither.
	 */
	updateCharacter: function(pForceCode)
	{
		var that;
		var followboolean = O.Options["bol_followCharacter" + P.SuffixCurrent];
		var displayboolean = O.Options["bol_displayCharacter" + P.SuffixCurrent];
		switch (P.MapCurrent)
		{
			case P.MapEnum.Tyria: { that = M; } break;
			case P.MapEnum.Mists: { that = W; } break;
		}
		
		/*
		 * Validate the GPS data before allowing updates.
		 * Sample structure of position, character angle, and camera angle:
		 * fAvatarPosition: [116.662186, 44.60492, -104.502495]
		 * fAvatarFront: [0.070094235, 0.0, 0.99754035]
		 * fCameraFront: [-0.2597584, 0.02722733, 0.9652897]
		 * Sample structure of JSON:
		 * {"name": "Character Name","profession": 1,"race": 2,"map_id": 38,"world_id": 1234567890,"team_color_id": 9,"commander": false,"fov": 0.873}
		 */
		if (GPSPositionArray === undefined || GPSPositionArray === null || GPSPositionArray.length !== 3 || that.isUserDragging)
		{
			return;
		}
		if (GPSIdentityJSON === undefined || GPSIdentityJSON === null)
		{
			return;
		}
		if (that.isZoneValid(GPSIdentityJSON["map_id"]) === false)
		{
			that.movePin(that.Pin.Character);
			that.movePin(that.Pin.Camera);
			return;
		}
		var coord = that.convertGPSCoord(GPSPositionArray, GPSIdentityJSON["map_id"]);
		if (coord[0] > that.cMAP_BOUND || coord[0] <= 0
			|| coord[1] > that.cMAP_BOUND || coord[1] <= 0)
		{
			return;
		}
		
		// Follow character if opted and position has changed (character moved)
		if ((followboolean && that.GPSPreviousCoord[0] !== coord[0] && that.GPSPreviousCoord[1] !== coord[1])
			|| pForceCode >= 0)
		{
			that.Map.setView(that.convertGCtoLC(coord), that.Map.getZoom());
			that.showCurrentZone(coord);
			that.GPSPreviousCoord = coord;
			pForceCode = -1; // Also update pin position
		}
		
		// Pin character if opted and angle has changed (character turned)
		if (displayboolean)
		{
			var anglecharacter = -(that.convertGPSAngle(GPSDirectionArray));
			var anglecamera = -(that.convertGPSAngle(GPSCameraArray));
			if (that.GPSPreviousAngleCharacter !== anglecharacter
				|| that.GPSPreviousAngleCamera !== anglecamera
				|| pForceCode <= 0)
			{
				that.movePin(that.Pin.Character, coord);
				that.movePin(that.Pin.Camera, coord);
				that.Pin.Camera._icon.style.zIndex = that.cZIndexBury;
				var pintranscharacter = that.Pin.Character._icon.style.transform.toString();
				var pintranscamera = that.Pin.Camera._icon.style.transform.toString();
				if (pintranscharacter.indexOf("rotate") === -1)
				{
					that.Pin.Character._icon.style.transform = pintranscharacter + " rotate(" + anglecharacter + "deg)";
				}
				if (pintranscamera.indexOf("rotate") === -1)
				{
					that.Pin.Camera._icon.style.transform = pintranscamera + " rotate(" + anglecamera + "deg)";
				}
				that.GPSPreviousAngleCharacter = anglecharacter;
				that.GPSPreviousAngleCamera = anglecamera;
			}
		}
	},
	
	/*
	 * Executes GPS functions every specified milliseconds.
	 */
	tickGPS: function()
	{
		if (O.Options["bol_followCharacter" + P.SuffixCurrent]
			|| O.Options["bol_displayCharacter" + P.SuffixCurrent])
		{
			P.updateCharacter();
			window.clearTimeout(P.GPSTimeout);
			P.GPSTimeout = setTimeout(function()
			{
				P.tickGPS();
			}, O.Options.int_msecGPSRefresh);
		}
	}
};

/* =============================================================================
 * @@Generate content for the sections on Map page
 * ========================================================================== */
G = {
	
	/*
	 * Initializes or regenerates the daily achievements box.
	 */
	generateAndInitializeDailies: function()
	{
		var now = new Date();
		var finalizeDailies = function()
		{
			$("#dlyCalendar div:first").addClass("dlyCurrent").next().addClass("dlyNext");
			$("#dlyCalendar .dlyEvent").each(function()
			{
				M.bindMapLinkBehavior($(this), M.ZoomEnum.Sky);
			});
			I.bindPseudoCheckbox("#dlyCalendar ins");
			I.qTip.init("#dlyCalendar ins");
		};
		
		// Regenerate the whole section
		$("#dlyHeader, #dlyCalendar, #dlyActivity").empty();
		I.removeThrobber("#dlyContainer");
		$("#dlyHeader").html(now.toLocaleString(window.navigator.language, {
			year: "numeric", month: "numeric", day: "numeric", weekday: "long"
		}));

		// Get daily activity
		var activity = T.Daily.Activity;
		var activityalias = activity.Schedule[now.getUTCDay()];
		var activityname = D.getObjectName(activity.Activities[activityalias]);
		$("#dlyActivity").html("<h2><img src='img/daily/activities/" + activityalias + I.cPNG + "' />"
			+ " <a" + U.convertExternalAnchor(U.getWikiLanguageLink(activityname)) + ">" + activityname + "</a> <ins class='dly dly_pve_activity'></ins></h2>");
		
		// Generate daily achievement boxes
		$("#dlyCalendar").after(I.cThrobber);
		T.getDaily().done(function()
		{
			G.insertDailyDay(T.DailyToday, now); // Today's dailies
			T.getDaily({getTomorrow: true}).done(function() // Tomorrow's dailies
			{
				I.removeThrobber("#dlyContainer");
				G.insertDailyDay(T.DailyTomorrow, T.addDaysToDate(now, 1));
				finalizeDailies();
			});
		}).fail(function()
		{
			I.write("Unable to retrieve daily API.");
		});
		
		// Daily fractal scale numbers
		$.getJSON(U.URL_API.Fractal, function(pData)
		{
			// The daily scale are located in these API array indexes for that URL
			var fractal = T.Daily.Fractal;
			var tier0 = T.DailyAssociation[(pData.achievements[0])];
			var tier1 = T.DailyAssociation[(pData.achievements[4])];
			
			if (tier0 !== undefined && tier1 !== undefined)
			{
				$("#dlyHeader").append(" <ins class='dly dly_pve_fractal'></ins><a title='" + D.getObjectName(fractal.Scale) + "' "
					+ U.convertExternalAnchor(D.getObjectURL(fractal)) + ">" + tier0 + "+" + tier1 + "</a>");
				I.qTip.init("#dlyHeader a");
			}
		}).fail(function()
		{
			I.write("Unable to retrieve daily fractal API.");
		});
	},
	
	/*
	 * Inserts a "day" div into the dailies calendar.
	 * @param object pDaily daily object from general.js
	 * @param object pDate of the day.
	 */
	insertDailyDay: function(pDaily, pDate)
	{
		var pve, pvp, wvw; // Daily types
		var gather, activity; // Regional dailies
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
		gatherregion = "<ins class='dlyRegion dly_region_" + gather[1].toLowerCase() + "'>";
		if (activity[0] === "Vista")
		{
			activityregion = "<ins class='dlyRegion dly_region_" + activity[1].toLowerCase() + "'>";
			activityregionclose = "</ins>";
		}
		eventregion = "<ins class='dlyRegion dly_region_" + M.getZoneRegion(pve[2]) + "'>";
		if (pve[3] !== null)
		{
			bosssrc = "dly_pve_boss";
			bossregion = "<ins class='dlyRegion dly_region_" + C.getChainRegion(C.getChainByAlias(pve[3])) + "'>";
			bossregionclose = "</ins>";
			bosshtml = "<em><img src='img/chain/" + pve[3].toLowerCase() + I.cPNG + "' /></em>";
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
		var reapplyNodesState = function()
		{
			// Fade the node if state is so in checklist
			for (var i in P.LayerArray.Resource)
			{
				P.LayerArray.Resource[i].eachLayer(function(iLayer)
				{
					if (iLayer instanceof L.Marker && getNodeState(iLayer) === X.ChecklistEnum.Checked)
					{
						iLayer.setOpacity(opacityclicked);
					}
				});
			}
		};
		var bindNodeBehavior = function(pMarker)
		{
			M.bindMarkerZoomBehavior(pMarker, "contextmenu");
			M.bindMarkerCoordBehavior(pMarker, "dblclick");
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
						$.ajax({
							dataType: "json",
							url: U.URL_API.ItemPrices + id,
							cache: false,
							success: function(pData)
						{
							var price = E.deductTax(pData.sells.unit_price);
							$("#nodPrice_" + inneri).html(E.createCoinString(price, true));
							P.Resources[inneri].price = price;
						}});
					})(i);
				}
			}
		};
		var getNodeQuantity = function(pResource, pGrade)
		{
			return (GW2T_RESOURCE_YIELD[pResource.type])[pGrade];
		};
		var initializePermanentNodes = function()
		{
			var i, ii;
			var counterrich = 0;
			var resource; // A type of resource, like copper ore
			var layer, marker, path;

			for (i in P.Resources)
			{
				resource = P.Resources[i];
				P.Resources[i].price = 0; // Also initialize price property
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
							name: i,
							quantity: getNodeQuantity(resource, "Rich"),
							index: counterrich,
							coord: resource.riches[ii].c,
							icon: L.divIcon(
							{
								className: "nodRich",
								html: "<img src='" + "img/node/" + name + I.cPNG + "' />",
								iconSize: [32, 32],
								iconAnchor: [16, 16]
							}),
							isNode: true
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
			}
			
			// Initialize checklist for saving nodes clicked state
			X.initializeChecklist(X.Checklists.ResourceRich, counterrich);
			reapplyNodesState();
		};
		var initializePossibleNodes = function()
		{
			var i, ii;
			var counterregular = 0;
			var counterhotspot = 0;
			var resource; // A type of resource, like copper ore
			var layer, marker;
			
			for (i in P.Resources)
			{
				resource = P.Resources[i];
				P.Resources[i].price = 0; // Also initialize price property
				var name = i.toLowerCase();
				
				// Regular nodes that may spawn there
				if (resource.regulars !== undefined && resource.regulars.length > 0)
				{
					layer = new L.layerGroup();
					for (ii in resource.regulars)
					{
						marker = L.marker(M.convertGCtoLC(resource.regulars[ii].c),
						{
							grade: "Regular",
							name: i,
							quantity: getNodeQuantity(resource, "Regular"),
							index: counterregular,
							coord: resource.regulars[ii].c,
							icon: L.divIcon(
							{
								className: "nodRegular",
								html: "<img src='" + "img/node/" + name + I.cPNG + "' />",
								iconSize: [24, 24],
								iconAnchor: [12, 12]
							}),
							isNode: true
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
				// Resources nodes that may spawn in the vicinity
				if (resource.hotspots !== undefined)
				{
					layer = new L.layerGroup();
					for (ii in resource.hotspots)
					{
						marker = L.marker(M.convertGCtoLC(resource.hotspots[ii].c),
						{
							grade: "Hotspot",
							name: i,
							quantity: getNodeQuantity(resource, "Hotspot"),
							index: counterhotspot,
							coord: resource.hotspots[ii].c,
							icon: L.divIcon(
							{
								className: "nodHotspot",
								html: "<img src='" + "img/node/" + name + I.cPNG + "' />",
								iconSize: [24, 24],
								iconAnchor: [12, 12]
							}),
							isNode: true
						});
						bindNodeBehavior(marker);
						// Add to array
						layer.addLayer(marker);
						counterhotspot++;
					}
					M.toggleLayer(layer);
					P.Layer["Resource_Hotspot_" + i] = layer;
					P.LayerArray.Resource.push(layer);
				}
			}
			
			X.initializeChecklist(X.Checklists.ResourceRegular, counterregular);
			X.initializeChecklist(X.Checklists.ResourceHotspot, counterhotspot);
			reapplyNodesState();
		};
		
		$.getScript(U.URL_DATA.Resource).done(function()
		{
			var i;
			var resource;
			P.Resources = GW2T_RESOURCE_DATA;
			initializePermanentNodes(); // Only create rich node markers initially
			
			// Create checkboxes
			for (i in P.Resources)
			{
				resource = P.Resources[i];
				$("#nodResource_" + resource.type).append(
					"<label><input id='nod_" + i + "' type='checkbox' checked='checked' /> <img src='img/node/"
					+ i.toLowerCase() + I.cPNG + "' /> <abbr>" + D.getObjectName(resource) + "</abbr><var id='nodPrice_" + i + "'></var></label>");
			}
			// Bind checkboxes
			for (i in P.Resources)
			{
				$("#nod_" + i).change(function()
				{
					var thisresource = U.getSubstringFromHTMLID($(this));
					var wantshow = $(this).prop("checked");
					var wantregular = $("#nodShowPossible").prop("checked");
					M.toggleLayer(P.Layer["Resource_Rich_" + thisresource], wantshow);
					M.toggleLayer(P.Layer["Resource_Regular_" + thisresource], (wantshow && wantregular));
					M.toggleLayer(P.Layer["Resource_Hotspot_" + thisresource], (wantshow && wantregular));
				});
			}
			
			// Bind button to toggle all checkboxes
			$("#mapToggle_Resource").data("checked", true).click(function()
			{
				var bool = I.toggleButtonState($(this));
				for (i in P.Resources)
				{
					$("#nod_" + i).prop("checked", bool).trigger("change");
				}
			});
			
			// Bind button to generate a route from the currently visible and unchecked permanent nodes
			$("#nodRoute").click(function()
			{
				M.clearPersonalPins();
				var i = 0;
				var coords = [];
				var coord;
				var eastmostcoord = Number.POSITIVE_INFINITY;
				var indexofeastmostcoord;
				
				var WAYPOINT_COPPER_AVERAGE = $("#nod_int_coinWaypointAverage").val();
				var TIME_SECOND_AVERAGE = $("#nod_int_secNodeVisitAverage").val();
				var waypointcost = 0;
				var timecost = 0;
				var sumprice = 0;
				
				// Gather the coordinates of valid resource node markers
				M.Map.eachLayer(function(iLayer) {
					if (iLayer instanceof L.Marker && iLayer.options.isNode
						&& getNodeState(iLayer) === X.ChecklistEnum.Unchecked)
					{
						/*
						 * Sum the price with the node's single resource price times the output of the node.
						 * The price was initialized the TP refresh function.
						 * The quantity was initialized by the marker initialization function.
						 */
						sumprice += P.Resources[(iLayer.options.name)].price * iLayer.options.quantity;
						
						// Find eastmost coordinate to use it as the starting point
						coords.push(iLayer.options.coord);
						coord = (coords[i])[0];
						if (coord < eastmostcoord)
						{
							eastmostcoord = coord;
							indexofeastmostcoord = i;
						}
						i++;
					}
				});
				var numnodes = coords.length;
				
				if (numnodes > 0)
				{
					// The eastmost coordinates will be the starting point of the optimized path
					M.redrawPersonalPath(P.getGreedyPath(coords, indexofeastmostcoord), "default");
					waypointcost = P.printClosestWaypoints() * WAYPOINT_COPPER_AVERAGE;
					timecost = numnodes * TIME_SECOND_AVERAGE;
					var summary = "Gather Profit: <span class='cssRight'>" + E.createCoinString(sumprice, true) + "</span><br />"
						+ "Waypoint Cost: <span class='cssRight'>" + E.createCoinString(waypointcost, true) + "</span><br />"
						+ "</br >"
						+ "Net Profit: <span class='cssRight'>" + E.createCoinString(sumprice - waypointcost, true) + "</span><br />"
						+ "<br />"
						+ "Nodes to Visit: <span class='cssRight'>" + numnodes + "</span><br />"
						+ "Estimated Time: <span class='cssRight'>" + T.getTimeFormatted({customTimeInSeconds: timecost, wantLetters: true}) + "</span>";
					I.write(summary, 0);
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
			$("#nodShowPossible").one("click", function()
			{
				// Only create the non-rich nodes when the user has chosen to show
				initializePossibleNodes();
			});
			$("#nodShowPossible").change(function()
			{
				var wantregular = $(this).prop("checked");
				for (var i in P.Resources)
				{
					var wantshow = $("#nod_" + i).prop("checked");
					M.toggleLayer(P.Layer["Resource_Regular_" + i], (wantshow && wantregular));
					M.toggleLayer(P.Layer["Resource_Hotspot_" + i], (wantshow && wantregular));
				}
			}).trigger("change");
			
			// Bind button to show the clicked map nodes again
			$("#nodUncheck").click(function()
			{
				for (var i in P.LayerArray.Resource)
				{
					P.LayerArray.Resource[i].eachLayer(function(iLayer)
					{
						if (iLayer instanceof L.Marker)
						{
							iLayer.setOpacity(1);
						}
					});
				}
				X.clearChecklist(X.Checklists.ResourceRich);
				X.clearChecklist(X.Checklists.ResourceRegular);
				X.clearChecklist(X.Checklists.ResourceHotspot);
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
			X.Checklists.JP.length = O.getObjectLength(P.JPs);
			P.LayerArray.JP = new Array(X.Checklists.JP.length);
		
			for (var i in P.JPs)
			{
				/*
				 * Create JP markers.
				 */
				var jp = P.JPs[i];
				var type = (jp.difficulty === 4) ? "Explorer" : "JP";
				var marker = L.marker(M.convertGCtoLC(jp.coord),
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
					+ U.getYouTubeLink(translatedname) + "'>[Y]</a> <a href='"
					+ U.getWikiLanguageLink(translatedname) + "'>[W]</a></cite>"
					+ "<dd>" + jp.description + "</dd>"
				);
				var jplink = $("#jpz_" + jp.id);
				jplink.attr("title", "<div class='mapLoc'><img src='" + U.getImageHosted(jp.img) + "' /></div>");
				M.bindMapLinkBehavior(jplink, M.ZoomEnum.Same);
			}
			M.bindMapLinks(".jpzList");
			U.convertExternalLink(".jpzList a");
			I.qTip.init(".jpzList dt");

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

			// Bind behavior
			for (var i = 0; i < X.Checklists.JP.length; i++)
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
				(function(iIndex)
				{
					// Click associated checkbox when clicked
					var marker = P.LayerArray.JP[iIndex];
					marker.on("click", function()
					{
						$("#jpzCheck_" + iIndex).trigger("click");
						I.scrollToElement("#jpz_" + this.options.id, "#plateMap");
					});
					M.bindMarkerZoomBehavior(marker, "contextmenu");
				})(i);
			}

			// The button to clear all JP checkboxes
			$("#jpzUncheckJP").click(function()
			{
				for (i = 0; i < X.Checklists.JP.length; i++)
				{
					$("#jpzCheck_" + i).prop("checked", false)
						.parent().prev().removeClass("jpzListNameChecked");
					styleJPMarker(P.LayerArray.JP[i], P.LayerArray.JP[i].options.difficulty);
				}
				X.clearChecklist(X.Checklists.JP);

				updateJPCount();
			});

			updateJPCount();
			G.generateAndInitializeChests();
		});
	},
	
	/*
	 * Populates the map with chest icons. These are found in the open world and
	 * unrelated to chests found within JPs. Should be run after the JP function.
	 */
	generateAndInitializeChests: function()
	{
		P.Chests = GW2T_CHEST_DATA;
		var numofchests = P.Chests.Basic.length + P.Chests.Splendid.length;
		X.initializeChecklist(X.Checklists.Chest, numofchests);
		
		var i, ii;
		var counter = 0;
		var opacityclicked = 0.3;
		var getNodeState = function(pMarker)
		{
			return X.getChecklistItem(X.Checklists.Chest, pMarker.options.index);
		};
		var setNodeState = function(pMarker, pState)
		{
			X.setChecklistItem(X.Checklists.Chest, pMarker.options.index, pState);
		};
		var refreshNodeState = function()
		{
			P.Layer.Chest.eachLayer(function(iMarker)
			{
				if (getNodeState(iMarker) === X.ChecklistEnum.Checked)
				{
					iMarker.setOpacity(opacityclicked);
				}
				else
				{
					iMarker.setOpacity(1);
				}
			});
		};
		var createChestMarker = function(pObject, pType, pID)
		{
			var newtitle = null;
			if (pObject.t)
			{
				newtitle = pObject.t;
			}
			var marker = L.marker(M.convertGCtoLC(pObject.c),
			{
				index: pID,
				icon: L.divIcon(
				{
					className: "mapChest" + pType,
					html: "<img src='" + "img/map/chest.png" + "' />",
					iconSize: [32, 32],
					iconAnchor: [16, 16]
				}),
				title: newtitle
			});
			marker.on("click", function()
			{
				if (getNodeState(this) === X.ChecklistEnum.Checked)
				{
					setNodeState(this, X.ChecklistEnum.Unchecked);
					this.setOpacity(1);
				}
				else
				{
					setNodeState(this, X.ChecklistEnum.Checked);
					this.setOpacity(opacityclicked);
				}
			});
			M.bindMarkerZoomBehavior(marker, "contextmenu");
			P.Layer.Chest.addLayer(marker);
		};
		
		// Create the chests
		for (i in P.Chests)
		{
			for (ii in P.Chests[i])
			{
				createChestMarker((P.Chests[i])[ii], i, counter);
				counter++;
			}
		}

		// Checkbox to toggle chest markers
		$("#jpzToggleChest").change(function()
		{
			M.toggleLayer(P.Layer.Chest, $(this).prop("checked"));
			refreshNodeState();
		});
		
		// The button to "uncheck" all chests
		$("#jpzUncheckChest").click(function()
		{
			X.clearChecklist(X.Checklists.Chest);
			refreshNodeState();
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
			var defaultname;
			
			for (i in P.Collectibles)
			{
				// Create checkboxes
				collectible = P.Collectibles[i];
				translatedname = D.getObjectName(collectible);
				defaultname = D.getObjectDefaultName(collectible);
				$("#cltList").append(
					"<div>"
					+ "<label style='color:" + collectible.color + "'>"
						+ "<ins class='clt_" + i.toLowerCase() + "'></ins><input id='ned_" + i + "' type='checkbox' /> " + translatedname
					+ "</label>"
					+ "<span><cite>"
						+ "<a href='" + U.getYouTubeLink(defaultname) + "'>[Y]</a>&nbsp;"//
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
			// Scroll to the section now that the list is generated
			I.scrollToElement("#headerMap_Collectible", "#plateMap");
		});
	},
	
	/*
	 * Generates the markers for a collectible type.
	 * @param string pType of the collectible.
	 */
	generateCollectibles: function(pType)
	{
		var i, number, extreme;
		var customlist = U.Args[X.Collectibles[pType].urlkey];
		var collectible = P.Collectibles[pType];
		var ithneedle;
		var stateinstring;
		var marker, pathline, pathstyle;
		var markertitle;
		var translatedname = D.getObjectName(collectible);
		
		var styleCollectibleMarker = function(pMarker, pState)
		{
			pMarker.setIcon(new L.divIcon(
			{
				className: "mapNeedle" + pState + " mapNeedleExtreme" + pMarker.options.needleExtreme,
				html: "<span style='color:" + pMarker.options.needleColor + "'>"
					+ pMarker.options.needleLabel + "</span>",
				iconSize: [16, 16],
				iconAnchor: [8, 8]
			}));
		};
		
		// Initialize checklist
		X.Collectibles[pType].length = P.Collectibles[pType].needles.length;
		X.initializeChecklist(X.Collectibles[pType], X.Collectibles[pType].length, customlist);
		
		P.LayerArray[pType] = []; // Holds markers (needles)
		P.Layer[pType] = new L.layerGroup(); // Holds path connecting the markers
		
		for (i = 0; i < collectible.needles.length; i++)
		{
			// Read and enact the state of the ith collectible checklist
			number = i + 1;
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

			// The "extreme" enum indicates the needle is an extremity or sub-extremity of the path
			if ((i === 0 || i === collectible.needles.length - 1))
			{
				extreme = 0;
			}
			else
			{
				extreme = ((ithneedle.e === undefined) ? "" : ithneedle.e);
			}
			
			marker = L.marker(M.convertGCtoLC(ithneedle.c),
			{
				needleExtreme: extreme,
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
			M.bindMarkerZoomBehavior(marker, "contextmenu");
			
			// Add to array
			P.LayerArray[pType].push(marker);
			
			// Draw a segment from the current and next needle's coordinates
			if (i < collectible.needles.length - 1)
			{
				pathstyle = (ithneedle.e === 2) ? "5,15" : "1";
				pathline = L.polyline(M.convertGCtoLCDual([ithneedle.c, (collectible.needles[i+1]).c]),
				{
					color: "lime",
					dashArray: pathstyle,
					opacity: 0.5
				});
				P.Layer[pType].addLayer(pathline);
			}
		}
		
		// Draw paths from markers numbered low to high
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
				I.initializeClipboard($(this)[0]);
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
					+ "<button class='gldButton curToggle btnTab' id='gldButton_" + i
						+ "' style='background-size:cover; background-image:url(img/guild/" + i.toLowerCase() + I.cPNG + ")' "
						+ "title='<dfn>" + translatedname + "</dfn><br />gw2timer.com/guild/" + i.toLowerCase() + "'></button>"
					+ "<a class='cssButton' href='" + U.getYouTubeLink(translatedname) + "'>Y</a>&nbsp;"
					+ "<a class='cssButton' href='" + D.getObjectURL(missiontype) + "'>W</a>"
					+ "</div>");
				$("#gldBooks").append("<div class='gldBook' id='gldBook_" + i + "'></div>");
			}
			$(".gldBook").hide();
			I.qTip.init("#gldButtons button");
			U.convertExternalLink("#gldButtons a");
			
			// Bind button to show the guild mission type
			$(".gldButton").click(function()
			{
				$(".gldButton").removeClass("btnFocused");
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
					$(this).addClass("btnFocused");
					$("#gldBook_" + missiontype).show();
				}
				I.updateScrollbar();
			});
			
			// Bind button to hide all guild map drawings
			$("#mapToggle_Guild").data("hideonly", true).click(function()
			{
				$(".gldButton").removeClass("btnFocused").each(function()
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
				O.sortObjects(P.Guild.Bounty.data);
				for (var i in P.Guild.Bounty.data)
				{
					var mission = P.Guild.Bounty.data[i];
					var name = D.getObjectDefaultName(mission);
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Bounty").append(
						"<div><img class='cssWaypoint jsClip' " + K.cClipboardAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Bounty) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldBounty_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + "</dfn> "
						+ "<a href='" + U.getYouTubeLink(name) + "'>[Y]</a> "
						+ "<a href='" + U.getWikiLink(name) + "'>[W]</a>"
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
				O.sortObjects(P.Guild.Trek.data);
				for (var i in P.Guild.Trek.data)
				{
					var mission = P.Guild.Trek.data[i];
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Trek").append(
						"<div><img class='cssWaypoint' " + K.cClipboardAttribute
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
					M.bindMapLinkBehavior(elm, M.ZoomEnum.Ground, M.Pin.Program);
				}
				finalizeGuildBook("Trek");
			});
			
			/*
			 * Challenge generation.
			 */
			$("#gldButton_Challenge").one("click", function()
			{
				P.Guild.Challenge.usedSubmaps = [];
				O.sortObjects(P.Guild.Challenge.data);
				for (var i in P.Guild.Challenge.data)
				{
					var mission = P.Guild.Challenge.data[i];
					var name = D.getObjectDefaultName(mission);
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Challenge").append(
						"<div><img class='cssWaypoint' " + K.cClipboardAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Challenge) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldChallenge_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + " - " + mission.limit + "</dfn> "
						+ "<a href='" + U.getYouTubeLink(name) + "'>[Y]</a> "
						+ "<a href='" + U.getWikiLink(name) + "'>[W]</a>"
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
				P.Guild.Rush.usedSubmaps = [];
				O.sortObjects(P.Guild.Rush.data);
				for (var i in P.Guild.Rush.data)
				{
					var mission = P.Guild.Rush.data[i];
					var name = D.getObjectDefaultName(mission);
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Rush").append(
						"<div><img class='cssWaypoint' " + K.cClipboardAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Rush) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldRush_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + "</dfn> "
						+ "<a href='" + U.getYouTubeLink(name) + "'>[Y]</a> "
						+ "<a href='" + U.getWikiLink(name) + "'>[W]</a>"
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
				P.Guild.Puzzle.usedSubmaps = [];
				O.sortObjects(P.Guild.Puzzle.data);
				for (var i in P.Guild.Puzzle.data)
				{
					var mission = P.Guild.Puzzle.data[i];
					var name = D.getObjectDefaultName(mission);
					var translatedname = D.getObjectName(mission);
					
					$("#gldBook_Puzzle").append(
						"<div><img class='cssWaypoint' " + K.cClipboardAttribute
						+ "='" + mission.wp + " " + D.getObjectName(P.Guild.Puzzle) + ": " + translatedname + "' src='img/ui/placeholder.png' /> "
						+ "<dfn id='gldPuzzle_" + i + "' data-coord='[" + mission.coord[0] + "," + mission.coord[1] + "]'>" + translatedname + " - " + mission.limit + "</dfn> "
						+ "<a href='" + U.getYouTubeLink(name) + "'>[Y]</a> "
						+ "<a href='" + U.getWikiLink(name) + "'>[W]</a>"
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
	OptionSuffix: "WvW",
	ZoneAssociation: GW2T_LAND_ASSOCIATION,
	cInitialZone: "eternal",
	cMAP_BOUND: 16384,
	cMAP_CENTER: [10750, 12414], // This centers on the WvW portion of the map
	cMAP_CENTER_INITIAL: [-193.96875, 167.96875],
	cMAP_CENTER_ACTUAL: [8192, 8192],
	ZoomEnum:
	{
		Adaptive: -2,
		Same: -1,
		Min: 0,
		Overview: 2,
		Default: 3,
		Space: 3,
		Sky: 4,
		Bird: 5,
		Ground: 6,
		Max: 6
	},
	Layer: {
		Overview: new L.layerGroup(),
		Pin: new L.layerGroup(),
		PersonalPin: new L.layerGroup(),
		PersonalPath: new L.layerGroup(),
		WeaponIcon: new L.layerGroup(), // weapon icon
		WeaponCircle: new L.layerGroup(), // weapon radius circle
		Destructible: new L.layerGroup(), // destructibles walls and gates
		Secondaries: new L.layerGroup(), // sentries, shrines, ruins, supply depots
		Objective: new L.layerGroup(), // camps, towers, keeps
		SpawnLabel: new L.layerGroup() // server name over their map spawns
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
	
	/*
	 * WvW exclusive properties.
	 */
	LocaleThreshold:
	{
		Range: 99,
		Americas: 1000,
		Europe: 2000,
		France: 2100,
		Germany: 2200,
		Spain: 2300
	},
	LocaleEnum:
	{
		Americas: "Americas",
		Europe: "Europe"
	},
	LocaleCurrent: null,
	BorderlandsCurrent: null,
	BorderlandsEnum: {
		Alpine: "Alpine",
		Desert: "Desert"
	},
	isWvWLoaded: false,
	Metadata: {},
	Servers: {}, // Server names and translations
	Matches: null, // For fallback API, array containing objects with same structure as "worlds" subobject in matches.json
	MatchupCurrent: null, // Example: { "red": 1019, "blue": 1008, "green": 1003 }
	Objectives: {},
	ObjectiveTimeout: {},
	Weapons: {},
	Placement: {},
	MapType: {}, // Corresponds to "worlds" object from match API
	LandEnum: {}, // Corresponds to "map_type" property of objectives
	ObjectiveEnum: {}, // Corresponds to "type" property of objectives
	OwnerEnum: {}, // Corresponds to "owner" property from match API
	OwnerCurrent: null, // The color of the user's selected server
	MatchupIDCurrent: null,
	isObjectiveTickEnabled: false,
	isObjectiveTimerTickEnabled: false,
	isAPIFailed: false,
	isFallbackEnabled: false,
	numFailedAPICalls: 0,
	cOWNERS_PER_TIER: 3,
	cSECONDS_IMMUNITY: 300, // Righteous Indignation time
	cMILLISECONDS_IMMUNITY: 300000,
	MatchFinishTime: null,
	secTillWvWReset: null,
	numSiegeSupply: 0,
	
	/*
	 * Initializes the WvW map and starts the objective state and time functions.
	 */
	initializeWvW: function()
	{
		/*
		 * Merge W's unique variables and functions with M, and use that new
		 * object as W. This is a shallow copy, so objects within an object that
		 * are not shared/modified must be redeclared here in W.
		 */
		$.extend(W, $.extend({}, M, W));
		W.Zones = GW2T_LAND_DATA;
		W.Regions = GW2T_REALM_DATA;
		W.Servers = GW2T_SERVER_DATA;
		W.Objectives = GW2T_OBJECTIVE_DATA;
		W.Weapons = GW2T_WEAPON_DATA;
		W.Placement = GW2T_PLACEMENT_DATA;
		W.Metadata = GW2T_WVW_METADATA;
		W.MapType = W.Metadata.MapType;
		W.LandEnum = W.Metadata.LandEnum;
		W.ObjectiveEnum = W.Metadata.ObjectiveEnum;
		W.OwnerEnum = W.Metadata.OwnerEnum;
		
		W.initializeMap();
		W.populateWvW();
		W.initializeLeaderboard();
		W.initializeLog();
		W.reinitializeServerChange();
		W.generateServerList();
		I.styleContextMenu("#wvwContext");
		U.convertExternalLink("#wvwHelpLinks a");
		$("#wvwToolsButton").one("mouseenter", W.initializeSupplyCalculator);
		// Finally
		W.isWvWLoaded = true;
		// Show leaderboard the first time if requested by URL
		U.openSectionFromURL({button: "#lboRegion", section: "Leaderboard"});
	},
	
	/*
	 * Generates the WvW objectives markers.
	 */
	populateWvW: function()
	{
		W.BorderlandsCurrent = W.BorderlandsEnum.Desert;
		var obj;
		var marker;
		for (var i in W.Objectives)
		{
			obj = W.Objectives[i];
			marker = L.marker(this.convertGCtoLC(obj.coord),
			{
				clickable: true,
				riseOnHover: true,
				icon: L.divIcon(
				{
					className: "",
					html: "<div id='obj_" + obj.id + "' class='objContainer'>"
							+ "<span class='objUmbrellaContainer'><span class='objUmbrellaOuter'><span id='objUmbrella_" + obj.id + "' class='objUmbrella'></span></span></span>"
							+ "<time id='objTimer_" + obj.id + "' class='objTimer'></time>"
							+ "<span class='objProgressContainer'><span id='objProgressBar_" + obj.id
								+ "' class='objProgressBar'><var id='objProgress_" + obj.id + "' class='objProgress'></var></span></span>"
							+ "<span class='objIconContainer'><img id='objIcon_" + obj.id
								+ "' class='objIcon' data-src='img/wvw/objectives/" + (obj.type).toLowerCase() + "_' src='img/ui/placeholder.png'/></span>"
							+ "<span class='objInfo'><cite id='objClaim_" + obj.id + "'></cite> <cite id='objAge_" + obj.id + "'></cite></span>"
						+ "</div>",
					iconSize: [38, 38],
					iconAnchor: [19, 19]
				})
			});
			this.bindMarkerZoomBehavior(marker, "contextmenu");
			obj.Marker = marker;
			this.Layer.Objective.addLayer(marker);
		}
		this.toggleLayer(this.Layer.Objective, true);
		
		// Generate labels over servers' map spawn points, the names will be reassigned by the objective function
		var labels = W.Metadata.SpawnLabels;
		for (var i in labels)
		{
			var labelmap = labels[i];
			for (var ii in labelmap)
			{
				var coord = labelmap[ii];
				marker = L.marker(this.convertGCtoLC(coord),
				{
					clickable: false,
					icon: L.divIcon(
					{
						className: "mapSec",
						html: "<span class='mapSecIn wvwSpawnLabel wvwColor" + ii + "' data-owner='" + ii + "'></span>",
						iconSize: [512, 64],
						iconAnchor: [256, 32]
					})
				});
				this.Layer.SpawnLabel.addLayer(marker);
			}
		}
		this.toggleLayer(this.Layer.SpawnLabel, true);
		
		// Hide map labels if opted
		W.toggleObjectiveLabels();
		
		// The function below would have been called already if world completion icons were generated
		if (O.Options.bol_showWorldCompletionWvW === false)
		{
			W.finishPopulation();
		}
	},
	
	/*
	 * Does final touches to the map after the icons have been generated.
	 */
	finishPopulation: function()
	{
		W.toggleSecondaries();
		W.toggleWalls();
		W.bindMapVisualChanges();
		W.adjustZoomMapping();
		if (I.ModeCurrent === I.ModeEnum.Overlay)
		{
			P.tickGPS();
		}
	},
	
	/*
	 * Creates secondary objective markers or toggle them if already created.
	 */
	toggleSecondaries: function(pWantAdjust)
	{
		if (O.Options.bol_showSecondaries
			&& W.Layer.Secondaries.getLayers().length === 0)
		{
			var drawSecondary = function(pCoords, pImage, pZoneNick)
			{
				if (pCoords === undefined)
				{
					return;
				}
				for (var i in pCoords)
				{
					var offset = W.Metadata.Offsets[pZoneNick];
					var coord = pCoords[i];
					var marker = L.marker(W.convertGCtoLC([coord[0] + offset[0], coord[1] + offset[1]]),
					{
						clickable: false,
						icon: L.icon(
						{
							iconUrl: "img/wvw/secondaries/" + pImage + I.cPNG,
							iconSize: [32, 32],
							iconAnchor: [16, 16]
						}),
						opacity: 0.9
					});
					W.Layer.Secondaries.addLayer(marker);
				}
			};

			for (var i in W.Placement)
			{
				var pl = W.Placement[i];
				for (var ii in pl.ZoneNicks)
				{
					var nick = pl.ZoneNicks[ii];
					drawSecondary(pl.ShrineEarth, "shrine_earth", nick);
					drawSecondary(pl.ShrineFire, "shrine_fire", nick);
					drawSecondary(pl.ShrineAir, "shrine_air", nick);
					drawSecondary(pl.Sentry, "sentry", nick);
					drawSecondary(pl.Depot, "depot", nick);
				}
			}
			if (pWantAdjust)
			{
				W.adjustZoomMapping();
			}
		}
		W.toggleLayer(W.Layer.Secondaries, O.Options.bol_showSecondaries);
	},
	
	/*
	 * Draws paths representing destructible walls on the map or toggle them if
	 * already drawn.
	 */
	toggleWalls: function(pWantAdjust)
	{
		var barricadecolor = "coral";
		var wallcolor = "orange";
		var gatecolor = "yellow";
		
		if (O.Options.bol_showDestructibles
			&& W.Layer.Destructible.getLayers().length === 0)
		{
			var drawWall = function(pCoords, pColor, pZoneNick)
			{
				var offset = W.Metadata.Offsets[pZoneNick];
				for (var i in pCoords)
				{
					var coord = pCoords[i];
					var coordA = [(coord[0])[0] + offset[0], (coord[0])[1] + offset[1]];
					var coordB = [(coord[1])[0] + offset[0], (coord[1])[1] + offset[1]];
					var path = L.polyline(W.convertGCtoLCDual([coordA, coordB]),
					{
						clickable: false,
						color: pColor,
						opacity: 0.8,
						weight: 10,
						lineCap: "butt"
					});
					W.Layer.Destructible.addLayer(path);
				}
			};
			
			for (var i in W.Placement)
			{
				var pl = W.Placement[i];
				for (var ii in pl.ZoneNicks)
				{
					var nick = pl.ZoneNicks[ii];
					drawWall(pl.Barricade, barricadecolor, nick);
					drawWall(pl.Wall, wallcolor, nick);
					drawWall(pl.Gate, gatecolor, nick);
				}
			}
			if (pWantAdjust)
			{
				W.adjustZoomMapping();
			}
		}
		W.toggleLayer(W.Layer.Destructible, O.Options.bol_showDestructibles);
	},
	
	/*
	 * Toggles display of objective labels below its icon.
	 */
	toggleObjectiveLabels: function()
	{
		$(".objInfo, .wvwSpawnLabel").toggle(O.Options.bol_showObjectiveLabels);
	},
	
	/*
	 * Gets the WvW metadata entry translations.
	 * @param string pString.
	 */
	getName: function(pEntry)
	{
		return D.getObjectName(W.Metadata[pEntry]);
	},
	getNick: function(pEntry)
	{
		return D.getObjectNick(W.Metadata[pEntry]);
	},
	
	/*
	 * Gets the server object from an owner string, such as "Green".
	 * @param string pOwner.
	 * @returns object server.
	 */
	getServerFromOwner: function(pOwner)
	{
		var serverid = W.MatchupCurrent[pOwner.toLowerCase()];
		// Neutral owner
		if (serverid === undefined)
		{
			return W.Metadata.Neutral;
		}
		return W.Servers[serverid];
	},
	
	/*
	 * Gets a translated borderlands name.
	 * @param object pServer to get the server name, or an objective object.
	 * @param boolean pFullServer or false to get nick, optional.
	 * @param boolean pFullBorderlands or false to get nick, optional.
	 * @returns string phrase.
	 */
	getBorderlandsString: function(pServer, pFullServer, pFullBorderlands)
	{
		var server = (typeof pServer === "string") ? W.Servers[W.MatchupCurrent[pServer]] : pServer;
		var serverstr, blstr;
		
		// If the server is actually an objective object
		var maptype = pServer["map_type"];
		if (maptype !== undefined)
		{
			var land = W.MapType[maptype];
			if (land === "center")
			{
				// EBG does not include server name, so just return it here
				return W.getNick("Center");
			}
			else
			{
				server = W.Servers[(W.MatchupCurrent[land])];
			}
		}
		
		// Get the full strings abbreviated or not
		serverstr = (pFullServer) ? D.getObjectName(server) : D.getObjectNick(server);
		blstr = (pFullBorderlands) ? W.getName("Borderlands") : W.getNick("Borderlands");
		
		// Adjust to grammar
		return D.orderModifier(blstr, serverstr);
	},
	
	/*
	 * Gets an objective's nick, or generate one if it has a direction property.
	 * @param pObject pObjective.
	 * @param boolean pFullDirection or false for abbreviated compass direction.
	 */
	getObjectiveNick: function(pObjective, pFullDirection)
	{
		// Example: "Northwest Camp", "East Keep"
		if (pObjective.direction !== undefined)
		{
			var dirstr = (pFullDirection) ? W.getName(pObjective.direction) : W.getNick(pObjective.direction);
			var typestr = W.getName(pObjective.type);
			return dirstr + " " + typestr;
		}
		// Example: "Garrison"
		else if (pObjective.alias !== undefined)
		{
			return W.getName(pObjective.alias);
		}
		// Example: "Stonemist", "Umberglade"
		return D.getObjectNick(pObjective);
	},
	
	/*
	 * Gets the points worth for an objective type.
	 * @param string pObjectiveType such as "Camp".
	 * @returns int value.
	 */
	getObjectiveTypeValue: function(pObjectiveName)
	{
		return W.Metadata.ObjectiveType[pObjectiveName].Value.each;
	},
	getTotalPPTPossible: function()
	{
		return W.Metadata.ObjectiveType.Total.Value.all;
	},
	
	/*
	 * Gets the tier number from the match id. Example "2-5" returns 5.
	 * @param object pData matchup from API.
	 * @returns int tier.
	 */
	getMatchupTier: function(pData)
	{
		var key = (W.isFallbackEnabled) ? "match_id" : "id";
		return parseInt((pData[key].split("-"))[1]);
	},
	
	/*
	 * Generates a list of servers for the user to choose from.
	 */
	generateServerList: function()
	{
		// Put the server objects into an array so they can be alphabetized according to language
		var servers = [];
		for (var i in W.Servers)
		{
			servers.push(W.Servers[i]);
		}
		O.sortObjects(servers);
		
		// Write the list
		var server;
		var list = $("#wvwServerList");
		var selected;
		for (var i in servers)
		{
			server = servers[i];
			selected = (server.id === O.Options.enu_Server) ? "selected" : "";
			list.append("<option value='" + server.id + "' " + selected + ">" + D.getObjectName(server) + "</option>");
		}
		
		// Bind server name select function
		list.change(function()
		{
			// Save the server ID
			var serverid = $(this).val();
			O.Options.enu_Server = serverid;
			localStorage["enu_Server"] = O.Options.enu_Server;
			// Update address bar
			U.updateQueryString("enu_Server=" + serverid);
			// Restart the system
			W.reinitializeServerChange();
		});
		
		// Prevent map scroll from interfering when using the list
		I.preventPropagation(list);
		I.blinkElement(list, 5000, 250);
	},
	
	/*
	 * Generates stats of all servers in a server region.
	 */
	initializeLeaderboard: function()
	{
		// Bind the log window buttons
		$("#lboToggle").click(function()
		{
			$("#opt_bol_showLeaderboard").trigger("click");
		});
		$("#lboCondense").click(function()
		{
			$("#opt_bol_condenseLeaderboard").trigger("click");
		});
		$("#lboRegion").click(function()
		{
			W.toggleRegionLeaderboard();
		});
		$("#lboOpaque").click(function()
		{
			$("#opt_bol_opaqueLeaderboard").trigger("click");
		});
		
		// Apply the leaderboard appearance options
		W.toggleLeaderboard();
		W.opaqueLeaderboard();
		W.toggleLeaderboardWidth();
		I.initializeScrollbar("#lboOther");
	},
	
	/*
	 * Retrieves data for all servers in the region and generates a scoreboard
	 * for each.
	 */
	toggleRegionLeaderboard: function()
	{
		var lb = $("#lboOther");
		// Toggle by adding or emptying content
		if (lb.is(":empty") === false || W.LocaleCurrent === null)
		{
			lb.animate({height: 0}, "fast", function()
			{
				lb.empty().css({height: "auto"});
			});
			return;
		}
		
		var matchids = W.Metadata.MatchIDs[W.LocaleCurrent];
		// Gather data for all matches for current server region
		for (var i in matchids)
		{
			var matchid = matchids[i];
			var url = (W.isFallbackEnabled) ? (U.URL_API.MatchFallback + matchid) : (U.URL_API.Matches + matchid);
			var htmlid = "lboOther_" + matchid;
			
			// Skip the current matchup because it is already shown
			if (matchid === W.MatchupIDCurrent)
			{
				continue;
			}
			lb.append("<div id='" + htmlid + "'></div>");
			(function(iID, iMatchID)
			{
				$.getJSON(url, function(pData)
				{
					var ithmatch = (W.isFallbackEnabled) ? W.Matches[iMatchID] : pData.worlds;
					W.insertScoreboard(pData, ithmatch, $("#" + iID));
					W.readjustLeaderboard();
					I.updateScrollbar("#lboOther");
				});
			})(htmlid, matchid);
		}
	},
	
	/*
	 * Inserts a matchup/tier scoreboard into the leaderboard.
	 * @param object pData from matches API.
	 * @param object pMatchup from matches API.
	 * @param jqobject pContainer to insert the scoreboard in, optional.
	 */
	insertScoreboard: function(pData, pMatchup, pContainer)
	{
		// Converts a v1 style "scores" array to v2 style object if using fallback
		var convertScores = function(pScores)
		{
			if (W.isFallbackEnabled)
			{
				return {
					red: pScores[0],
					blue: pScores[1],
					green: pScores[2]
				};
			}
			return pScores;
		};
		
		/*
		 * Collate objective points from each borderlands.
		 */
		pMatchup = pMatchup || W.MatchupCurrent;
		var map, obj, apiobj, landprefix, objid;
		var land, value, nativeowner;
		var numowners = W.Metadata.Owners.length;
		var tier = W.getMatchupTier(pData);
		var scores = convertScores(pData.scores);
		var PPT = {};
		var wantserver = true;
		// Initialize variables for the temp object
		for (var i in W.Metadata.Owners)
		{
			var owner = W.Metadata.Owners[i];
			PPT[owner] = {};
			(PPT[owner]).Total = 0;
			(PPT[owner])[W.LandEnum.GreenHome] = 0;
			(PPT[owner])[W.LandEnum.BlueHome] = 0;
			(PPT[owner])[W.LandEnum.RedHome] = 0;
			(PPT[owner])[W.LandEnum.Center] = 0;
			for (var ii in W.Metadata.Owners) // The division of "native" land in EBG
			{
				(PPT[owner])[W.LandEnum.Center + (W.Metadata.Owners[ii])] = 0;
			}
		}
		// Assign the values
		for (var i in pData.maps)
		{
			map = pData.maps[i];
			landprefix = W.Metadata.LandPrefix[map.type];
			for (var ii in map.objectives)
			{
				apiobj = map.objectives[ii];
				objid = (W.isFallbackEnabled) ? landprefix + apiobj.id : apiobj.id;
				obj = W.Objectives[objid];
				owner = apiobj.owner;
				land = obj.map_type; // Example: "RedHome"
				value = W.getObjectiveTypeValue(obj.type);
				nativeowner = obj.nativeowner;
				if (owner !== W.OwnerEnum.Neutral)
				{
					(PPT[owner]).Total += value;
					(PPT[owner])[land] += value;
					if (land === W.LandEnum.Center)
					{
						// Example: In EBG, Red took objectives that were natively owned by Green's side, such as Lowlands
						(PPT[owner])[W.LandEnum.Center + nativeowner] += value;
					}
				}
			}
		}
		
		/*
		 * Decide appropriate container to insert the scoreboard.
		 */
		var lb;
		if (pContainer === undefined)
		{
			lb = $("#lboCurrent");
			lb.empty();
			if (I.ModeCurrent === I.ModeEnum.Overlay || I.isProgramEmbedded)
			{
				wantserver = false;
			}
		}
		else
		{
			lb = pContainer;
		}
		var html = "<section>";
		for (var i = 0; i < numowners; i++)
		{
			/*
			 * Prepare variables to be inserted into the HTML.
			 */
			var owner = W.Metadata.Owners[i]; // Example: "Green" as in data
			var ownerkey = owner.toLowerCase(); // Example: "green" as in match API
			var rank = ((tier - 1) * W.cOWNERS_PER_TIER) + (i+1);
			var serverid = pMatchup[ownerkey];
			var servername = U.escapeHTML(D.getObjectName(W.Servers[serverid]));
			var serverstr = (wantserver) ? "<aside class='lboRank'>" + rank + ".</aside><aside class='lboName'>&nbsp;<a href='/"
				+ "?page=WvW&enu_Server=" + serverid + "'>" + servername + "</a></aside>" : "";
			var score = scores[ownerkey];
			var scorehighest = (T.getMinMax(scores)).max;
			var scorepercent = (scores[ownerkey] / scorehighest) * T.cPERCENT_100;
			var ppttotal = (PPT[owner]).Total;
			var pptpercent = (ppttotal / W.getTotalPPTPossible()) * T.cPERCENT_100;
			var kdstr = "";
			if (pData.kills !== undefined && W.isFallbackEnabled === false)
			{
				var kills = (pData.kills !== undefined) ? pData.kills[ownerkey] : "";
				var deaths = (pData.deaths !== undefined) ? pData.deaths[ownerkey] : "";
				var kdratio = T.parseRatio((kills / deaths), 3);
				var kdpercent = T.parseRatio(kills / (kills + deaths)) * T.cPERCENT_100;
				kdstr = "<aside class='lboKD' title='<dfn>Kills to Deaths ratio:</dfn> " + kdratio + "'>"
					+ "<var class='lboKills'>" + kills.toLocaleString() + "</var>"
					+ "<samp><s style='width:" + kdpercent + "%'><mark></mark></s></samp>"
					+ "<var class='lboDeaths'>" + deaths.toLocaleString() + "</var>"
				+ "</aside>";
			}
			
			/*
			 * Server Focus is PPT from ownership of non-native objectives (including EBG).
			 */
			var focuses = [];
			var scoredifferences = [];
			var otherservers = [];
			for (var ii = 0; ii < numowners; ii++)
			{
				var otherowner = W.Metadata.Owners[ii];
				var otherownerkey = otherowner.toLowerCase();
				if (otherowner !== owner)
				{
					var focus = (PPT[owner])[otherowner + "Home"] + (PPT[owner])[W.LandEnum.Center + otherowner];
					focuses.push(focus);
					var difference = score - scores[otherownerkey];
					scoredifferences.push(difference);
					var otherserver = W.Servers[(pMatchup[otherownerkey])];
					otherservers.push(U.escapeHTML(D.getObjectName(otherserver)));
				}
			}
			var totalfocus = (focuses[0] + focuses[1]);
			var focusApercent, focusBpercent;
			var focusclass = "";
			if (totalfocus > 0)
			{
				focusApercent = Math.round((focuses[0] / totalfocus) * T.cPERCENT_100);
				focusBpercent = Math.round((focuses[1] / totalfocus) * T.cPERCENT_100);
			}
			else
			{
				focusApercent = 0;
				focusBpercent = 0;
				focusclass = "lboFocusZero";
			}
			
			/*
			 * Borderlands Focus is score from non-native borderlands (excluding EBG).
			 */
			var blscoreA, blscoreB;
			for (var ii in pData.maps)
			{
				var map = pData.maps[ii];
				var mapscores = convertScores(map.scores);
				switch (map.type)
				{
					case ((W.Metadata.Opposites[owner])[0] + "Home"): blscoreA = mapscores[ownerkey]; break;
					case ((W.Metadata.Opposites[owner])[1] + "Home"): blscoreB = mapscores[ownerkey]; break;
				}
			}
			var totalblscore = blscoreA + blscoreB;
			var blscoreApercent, blscoreBpercent;
			var blscoreclass = "";
			if (totalblscore > 0)
			{
				blscoreApercent = Math.round((blscoreA / totalblscore) * T.cPERCENT_100);
				blscoreBpercent = Math.round((blscoreB / totalblscore) * T.cPERCENT_100);
			}
			else
			{
				blscoreApercent = 0;
				blscoreBpercent = 0;
				blscoreclass = "lboFocusZero";
			}
			
			/*
			 * Write the HTML.
			 */
			html += "<article class='lboServer lboServer" + owner + "'>"
				+ serverstr
				+ "<aside class='lboScore' title='<dfn>" + scoredifferences[0] + " points</dfn> away from " + otherservers[0]
				+ "<br /><dfn>" + scoredifferences[1] + " points</dfn> away from " + otherservers[1] + "'>"
					+ "<var>" + score.toLocaleString() + "</var>"
					+ "<samp><s style='width:" + scorepercent + "%'></s></samp>"
				+ "</aside>"
				+ "<aside class='lboPPT' title='<dfn>Points-Per-Tick (PPT)</dfn>'>"
					+ "<samp><s style='width:" + pptpercent + "%'></s></samp>"
					+ "<var>+" + ppttotal + "</var>"
				+ "</aside>"
				+ "<aside class='lboLand' title='<dfn>PPT per borderlands</dfn>'>"
					+ "<var class='lboPPTGreen'>+" + (PPT[owner])[W.LandEnum.GreenHome] + "</var>"
					+ "<var class='lboPPTBlue'>+" + (PPT[owner])[W.LandEnum.BlueHome] + "</var>"
					+ "<var class='lboPPTRed'>+" + (PPT[owner])[W.LandEnum.RedHome] + "</var>"
					+ "<var class='lboPPTCenter'>+" + (PPT[owner])[W.LandEnum.Center] + "</var>"
				+ "</aside>"
				+ "<aside class='lboFocus lboFocus" + owner + "' title='<dfn>Server Focus (PPT Now)</dfn><br />"
						+ "<dfn>" + focuses[0] + " PPT</dfn> earnable from " + otherservers[0] + " native objectives<br />"
						+ "<dfn>" + focuses[1] + " PPT</dfn> earnable from " + otherservers[1] + " native objectives'>"
					+ "<var class='lboFocusA'>" + focusApercent + "%</var>"
					+ "<samp class='" + focusclass + "'><s style='width:" + focusApercent + "%'><mark></mark></s></samp>"
					+ "<var class='lboFocusB'>" + focusBpercent + "%</var>"
				+ "</aside>"
				+ kdstr
				+ "<aside class='lboFocus lboFocus" + owner + "' title='<dfn>Server Focus (Points Matchup)</dfn><br />"
						+ "<dfn>" + blscoreA + " points</dfn> earned from " + otherservers[0] + " Borderlands<br />"
						+ "<dfn>" + blscoreB + " points</dfn> earned from " + otherservers[1] + " Borderlands'>"
					+ "<var class='lboFocusA'>" + blscoreApercent + "%</var>"
					+ "<samp class='" + blscoreclass + "'><s style='width:" + blscoreApercent + "%'><mark></mark></s></samp>"
					+ "<var class='lboFocusB'>" + blscoreBpercent + "%</var>"
				+ "</aside>"
			+ "</article>";
		}
		html += "</section>";
		
		lb.append(html);
		I.qTip.init(lb.find("aside"));
		
		if (O.Options.bol_condenseLeaderboard)
		{
			W.toggleLeaderboardWidth();
		}
	},
	
	/*
	 * Toggles the leaderboard display.
	 */
	toggleLeaderboard: function()
	{
		if (O.Options.bol_showLeaderboard)
		{
			W.updateObjectives();
			$("#lboCurrent, #lboOther").show("fast", function()
			{
				$("#lboContainer").css({padding: "8px"});
			});
			$(".lboExtra").show();
		}
		else
		{
			$("#lboCurrent, #lboOther").hide("fast", function()
			{
				$("#lboContainer").css({padding: 0});
			});
			$(".lboExtra").hide();
		}
	},
	opaqueLeaderboard: function()
	{
		var background = (O.Options.bol_opaqueLeaderboard) ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.2)";
		$("#lboContainer").css({background: background});
	},
	
	/*
	 * Condenses the leaderboard or revert it.
	 */
	toggleLeaderboardWidth: function(pWantAnimate)
	{
		var isshown = !O.Options.bol_condenseLeaderboard;
		var elms = $(".lboRank, .lboName, .lboFocus");
		if (pWantAnimate)
		{
			if (isshown)
			{
				elms.show("fast");
			}
			else
			{
				elms.hide("fast");
			}
		}
		else
		{
			elms.toggle(isshown);
		}
	},
	readjustLeaderboard: function()
	{
		$("#lboOther").css({maxHeight: $(window).height() - $("#lboCurrent").height() * 2});
	},
	
	/*
	 * Writes the base HTML of the capture history log.
	 */
	initializeLog: function()
	{
		// Initialize element properties
		$("#wvwLogContainer").show();
		$("#logWindow").data("oldHeight", $("#logWindow").height());
		
		// Bind the log window buttons
		$("#logToggle").click(function()
		{
			$("#opt_bol_showLog").trigger("click");
		});
		$("#logExpand").click(function()
		{
			$("#opt_bol_maximizeLog").trigger("click");
		});
		$("#logOpaque").click(function()
		{
			$("#opt_bol_opaqueLog").trigger("click");
		});
		// Apply the log appearance options
		W.toggleLog();
		W.opaqueLog();
		W.toggleLogHeight();
		I.initializeScrollbar("#logWindow");
		
		// Bind the checkboxes to filter log entries
		for (var i in W.MapType)
		{
			(function(iFilter)
			{
				$("#opt_bol_log" + iFilter).change(function()
				{
					if (O.Options["bol_log" + iFilter])
					{
						$(".logEntry" + iFilter).show("fast", function() { I.updateScrollbar("#logWindow"); });
					}
					else
					{
						$(".logEntry" + iFilter).hide("fast", function() { I.updateScrollbar("#logWindow"); });
					}
				}).parent().dblclick(function()
				{
					// If double clicked the checkbox, then uncheck all the others except itself
					$("#logFilters input:checkbox").each(function()
					{
						X.setCheckboxEnumState($(this), X.ChecklistEnum.Unchecked);
					});
					X.setCheckboxEnumState($("#opt_bol_log" + iFilter), X.ChecklistEnum.Checked);
				});
			})(i);
		}
		
		// Label the narration filters
		var blstr = W.getName("Borderlands");
		$("#opt_bol_narrateRedHome").next().html(D.orderModifier(blstr, W.getName("Red")));
		$("#opt_bol_narrateGreenHome").next().html(D.orderModifier(blstr, W.getName("Green")));
		$("#opt_bol_narrateBlueHome").next().html(D.orderModifier(blstr, W.getName("Blue")));
		$("#opt_bol_narrateCenter").next().html(W.getName("Center"));
		$("#opt_bol_narrateCamp").next().html(W.getName("Camp"));
		$("#opt_bol_narrateTower").next().html(W.getName("Tower"));
		$("#opt_bol_narrateKeep").next().html(W.getName("Keep"));
		$("#opt_bol_narrateCastle").next().html(W.getName("Castle"));
		$("#opt_bol_narrateClaimed").next().html(W.getName("Claimed"));
		
		// Mimic the master volumn slider
		I.preventPropagation(O.mimicInput("#logNarrateVolume", "int_setVolume"));
		
		// Bind local time clock
		$("#logTime").click(function()
		{
			$("#opt_bol_use24Hour").trigger("click");
			// Update the timestamps of the log entries
			$("#logWindow li time").each(function()
			{
				var timestr = T.getTimeFormatted({customTimeInDate: new Date($(this).attr("data-time"))}); 
				$(this).html(timestr);
			});
		});
	},
	
	/*
	 * Toggles the log display.
	 */
	toggleLog: function()
	{
		if (O.Options.bol_showLog)
		{
			$("#wvwLog, .logExtra").show("fast");
		}
		else
		{
			$("#wvwLog, .logExtra").hide("fast");
		}
	},
	opaqueLog: function()
	{
		var background = (O.Options.bol_opaqueLog) ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.1)";
		$("#wvwLog").css({background: background});
	},
	
	/*
	 * Adjusts the log window height.
	 */
	toggleLogHeight: function()
	{
		var log = $("#logWindow");
		var windowheight = $(window).height();
		var oldheight = log.data("oldHeight");
		var newheight = windowheight - oldheight;

		if (O.Options.bol_maximizeLog)
		{
			if (newheight < oldheight)
			{
				newheight = oldheight;
			}
			log.show().animate({height: newheight}, 200, function()
			{
				I.updateScrollbar(log);
				O.Options.bol_maximizeLog = true;
			});
		}
		else
		{
			log.show().animate({height: oldheight}, 200, function()
			{
				I.updateScrollbar(log);
				O.Options.bol_maximizeLog = false;
			});
		}
	},
	
	/*
	 * Resizes the log if the browser window covers it.
	 */
	readjustLog: function()
	{
		if ($("#wvwLog").height() > $(window).height())
		{
			$("#logExpand").trigger("click").trigger("click");
		}
	},
	
	/*
	 * Adds an entry to the WvW log.
	 * @param string pString to insert.
	 * @param string pClass of the log entry, such as the map the event happened in.
	 * @param string pISOTime of the event, optional
	 * @param boolean pIsDisplayed whether shown initially.
	 */
	addLogEntry: function(pString, pClass, pISOTime, pIsDisplayed)
	{
		pString = pString || "";
		pClass = pClass || "";
		var timestr = "";
		if (pISOTime === undefined)
		{
			timestr = T.getTimeFormatted();
			pISOTime = (new Date()).toISOString();
		}
		else
		{
			timestr = T.getTimeFormatted({customTimeInDate: new Date(pISOTime)});
		}
		var entry = $("<li class='logEntry " + pClass + "'><time data-time='" + pISOTime + "'>" + timestr + "</time><span>" + pString + "</span></li>")
			.prependTo("#logWindow");
		this.bindMapLinkBehavior(entry.find("dfn"));
		
		// Animate the new entry
		if (pIsDisplayed === false)
		{
			entry.hide();
		}
		else
		{
			var width = entry.width();
			entry.css({width: 0}).animate({width: width}, 400, function()
			{
				$(this).removeAttr("style");
			});
		}
		
		// Delete an old entry if over max limit
		var entries = $(".logEntry");
		if (entries.length > O.Options.int_numLogEntries)
		{
			entries.last().remove();
		}
		I.updateScrollbar("#logWindow");
	},
	
	/*
	 * Adds an entry pertaining to objectives.
	 * @param object pObjective.
	 * @param boolean pIsClaim if it is an objective claim, optional.
	 */
	addLogEntryObjective: function(pObjective, pIsClaim)
	{
		var prevobjectiveicon = "<img src='img/wvw/objectives/" + (pObjective.type + "_" + pObjective.prevowner).toLowerCase() + I.cPNG + "' />";
		var objectiveicon = "<img src='img/wvw/objectives/" + (pObjective.type + "_" + pObjective.owner).toLowerCase() + I.cPNG + "' />";
		var objectivenick = W.getObjectiveNick(pObjective, false);
		
		// Claiming shows the guild tag instead of the previous objective icon
		var isotime;
		if (pIsClaim)
		{
			prevobjectiveicon = objectiveicon;
			objectiveicon = "<cite>[" + pObjective.tag + "]</cite>";
			isotime = pObjective.claimed_at;
		}
		else
		{
			isotime = pObjective.last_flipped;
		}
		var str = prevobjectiveicon + " ⇒ " + objectiveicon + " <dfn data-coord='" + pObjective.coord + "'>" + objectivenick + "</dfn>";
		var land = pObjective.map_type;
		var cssclass = "logEntry" + land;
		
		// The entry will be added, but only shown if opted
		var isdisplayed = true;
		if ((land === W.LandEnum.RedHome && O.Options.bol_logRedHome === false)
			|| (land === W.LandEnum.GreenHome && O.Options.bol_logBlueHome === false)
			|| (land === W.LandEnum.BlueHome && O.Options.bol_logGreenHome === false)
			|| (land === W.LandEnum.Center && O.Options.bol_logCenter === false))
		{
			isdisplayed = false;
		}
		W.addLogEntry(str, cssclass, isotime, isdisplayed);
		
		// Narrate the capture event if opted
		if (O.Options.bol_logNarrate)
		{
			W.narrateLog(pObjective, pIsClaim);
		}
	},
	
	/*
	 * Speaks the objective that was captured and the capturer.
	 * @param object pObjective.
	 * @param boolean pIsClaim if it is an objective claim, optional.
	 */
	narrateLog: function(pObjective, pIsClaim)
	{
		// Do not proceed if does not pass the opted filters
		var land = pObjective.map_type;
		var type = pObjective.type;
		if ((pIsClaim && O.Options.bol_narrateClaimed === false)
			|| (land === W.LandEnum.RedHome && O.Options.bol_narrateRedHome === false)
			|| (land === W.LandEnum.GreenHome && O.Options.bol_narrateGreenHome === false)
			|| (land === W.LandEnum.BlueHome && O.Options.bol_narrateBlueHome === false)
			|| (land === W.LandEnum.Center && O.Options.bol_narrateCenter === false)
			|| (type === W.ObjectiveEnum.Camp && O.Options.bol_narrateCamp === false)
			|| (type === W.ObjectiveEnum.Tower && O.Options.bol_narrateTower === false)
			|| (type === W.ObjectiveEnum.Keep && O.Options.bol_narrateKeep === false)
			|| (type === W.ObjectiveEnum.Castle && O.Options.bol_narrateCastle === false))
		{
			return;
		}
		
		var objstr = W.getObjectiveNick(pObjective, true);
		var ownerstr;
		if (pIsClaim)
		{
			ownerstr = D.getSpeechInitials(pObjective.tag);
		}
		else if (pObjective.owner === W.OwnerCurrent)
		{
			ownerstr = W.getName("Us");
		}
		else
		{
			ownerstr = D.getObjectName(W.getServerFromOwner(pObjective.owner));
		}
		// Only include the borderlands string if user opted for more than one land filter
		var blstr = ($("#logNarrateLand input:checked").length > 1) ? (W.getBorderlandsString(pObjective, true, true) + ". ") : "";
		var verbstr;
		if (pIsClaim)
		{
			verbstr = W.getName("Claimed");
		}
		else if (pObjective.owner === pObjective.nativeowner)
		{
			verbstr = W.getName("Retaken");
		}
		else
		{
			verbstr = W.getName("Captured");
		}
		
		// Separated to two speeches so the pause is longer
		var speech1 = blstr + objstr;
		var speech2 = verbstr + " " + ownerstr;
		D.speak(speech1);
		D.speak(speech2);
	},
	
	/*
	 * Generates the siege supply calculator.
	 */
	initializeSupplyCalculator: function()
	{
		var addSupply = function(pElement, pSupply)
		{
			var blcount = pElement.html();
			// Blank blueprint count means 0 blueprints requested
			blcount = (blcount === "") ? 0 : parseInt(blcount);
			if (pSupply < 0 && blcount === 0)
			{
				return;
			}
			var increment = (pSupply < 0) ? -1 : 1;

			W.numSiegeSupply += pSupply;
			$("#splNeed").html(W.numSiegeSupply);
			// If after increment the blueprint count is 0, then make it blank
			var finalblcount = blcount + increment;
			if (finalblcount === 0)
			{
				pElement.removeClass("splAdded");
				finalblcount = "";
			}
			else
			{
				pElement.addClass("splAdded");
			}
			pElement.html(finalblcount);
		};
		
		I.preventPropagation("#wvwSupply");
		for (var i in W.Metadata.Blueprints)
		{
			for (var ii in W.Weapons)
			{
				if (W.Weapons[ii].type === "field")
				{
					var bp = W.Metadata.Blueprints[i];
					var blueprint = $("<ins class='spl spl_" + bp.toLowerCase() + "_" + ii + "'></ins>");
					var supply = W.Weapons[ii].supply[i];
					$("#splBlueprints" + bp).append(blueprint);
					(function(iSupply)
					{
						blueprint.click(function()
						{
							addSupply($(this), iSupply);
							$("#splHave").trigger("input");
						});
						blueprint.contextmenu(function()
						{
							addSupply($(this), -1 * iSupply);
							$("#splHave").trigger("input");
							return false; // Prevents context menu popping up
						});
					})(supply);
				}
			}
		}
		
		// Bind reset button
		$("#splReset").click(function()
		{
			$("#splBlueprints ins").html("").removeClass("splAdded");
			$("#splNeed").html("0");
			W.numSiegeSupply = 0;
			$("#splHave").trigger("input");
		});
		
		// Bind supply have input
		$("#splHave").click(function()
		{
			$(this).select();
		}).on("input", function()
		{
			var value = T.parseQuantity($(this).val(), 0) - W.numSiegeSupply;
			var elm = $("#splRemain").html(value);
			I.colorizeValue(elm, value);
		});
	},
	
	/*
	 * Updates the server names for the current match wherever it is shown.
	 */
	updateParticipants: function()
	{
		if (W.MatchupCurrent !== null)
		{
			var redserver = W.Servers[W.MatchupCurrent["red"]];
			var greenserver = W.Servers[W.MatchupCurrent["green"]];
			var blueserver = W.Servers[W.MatchupCurrent["blue"]];
			for (var i in W.MatchupCurrent)
			{
				if (W.MatchupCurrent[i] === O.Options.enu_Server)
				{
					W.OwnerCurrent = U.toFirstUpperCase((i).toString());
				}
			}
			// Log server borderlands names
			$("#opt_bol_logRedHome").next().html(W.getBorderlandsString(redserver, true, false));
			$("#opt_bol_logGreenHome").next().html(W.getBorderlandsString(greenserver, true, false));
			$("#opt_bol_logBlueHome").next().html(W.getBorderlandsString(blueserver, true, false));
			$("#opt_bol_logCenter").next().html(W.getName("Center"));
			
			// Compass zone links borderlands names
			$("#wvwZoneLinkGreen").text(W.getBorderlandsString(greenserver, true, true));
			$("#wvwZoneLinkRed").text(W.getBorderlandsString(redserver, true, true));
			$("#wvwZoneLinkBlue").text(W.getBorderlandsString(blueserver, true, true));
			
			// Initial messages in the log window
			W.addLogEntry($("#wvwHelpLinks").html() + "<br /><br />");
			W.addLogEntry(D.getObjectNick(greenserver)
				+ " : " + D.getObjectNick(blueserver) + " : " + D.getObjectNick(redserver));
			
			// Update map spawn labels
			$(".wvwSpawnLabel").each(function()
			{
				var label = D.getObjectName(W.getServerFromOwner($(this).attr("data-owner")));
				$(this).html(label);
			});
		}
	},
	
	/*
	 * Resets objective properties and updates the objectives.
	 * @param boolean pWipeLog;
	 */
	reinitializeServerChange: function(pWipeLog)
	{
		// Initialize properties to be later compared within the API
		for (var i in W.Objectives)
		{
			var obj = W.Objectives[i];
			obj.isImmune = false; // Boolean if is recently captured
			obj.owner = null; // String owner
			obj.last_flipped = null; // String ISO time
			obj.last_flipped_msec = null; // Integer
			obj.claimed_by = "none"; // String guild ID, the API can have actual "null" values
			obj.claimed_at = null; // String ISO time
		}
		W.LocaleCurrent = (O.Options.enu_Server >= W.LocaleThreshold.Europe)
			? W.LocaleEnum.Europe : W.LocaleEnum.Americas;
		W.MatchupIDCurrent = null;
		W.MatchFinishTime = null;
		W.MatchupCurrent = null;
		$(".objUmbrellaContainer").hide();
		$(".objTimer").empty();
		$(".objProgressBar").hide();
		$("#lboCurrent").empty().append(I.cThrobber);
		$("#lboOther").empty();
		if (pWipeLog !== false)
		{
			$("#logWindow").empty();
		}
		
		// Stop the previous timeout and call the update function with initialization
		W.toggleObjectiveTick(false);
		W.toggleObjectiveTick(true);
	},
	
	/*
	 * Checks for changes in the match API data and updates objectives state.
	 */
	updateObjectives: function()
	{
		var maxattemptsuntilfallback = 3;
		var nowmsec = (new Date()).getTime();
		var succeedReconnection = function()
		{
			W.numFailedAPICalls = 0;
			W.isAPIFailed = false;
			W.isFallbackEnabled = false;
			I.write("WvW data connection reestablished at " + T.getTimeFormatted());
		};
		if (W.isFallbackEnabled)
		{
			W.updateObjectivesFallback();
		}
		
		// Attempt to retrieve objectives data
		$.ajax({
			dataType: "json",
			url: U.URL_API.Match + O.Options.enu_Server,
			cache: false, // Prevents keeping stale data
			success: function(pData)
		{
			if (W.isFallbackEnabled)
			{
				succeedReconnection();
				W.reinitializeServerChange(false);
				return;
			}
			
			var map, obj, apiobj;
			var numobjflipped = 0;
			var maxobjflipped = 12;
			var istoomanyflips = false;
			for (var i in pData.maps)
			{
				map = pData.maps[i];
				for (var ii in map.objectives)
				{
					apiobj = map.objectives[ii];
					obj = W.Objectives[apiobj.id];
					/*
					 * Only update the objectives if they have changed server ownership.
					 */
					if (obj.last_flipped !== apiobj.last_flipped)
					{
						if (obj.last_flipped !== null)
						{
							numobjflipped++;
						}
						// Reinitialize properties
						obj.last_flipped = apiobj.last_flipped;
						obj.last_flipped_msec = (new Date(apiobj.last_flipped)).getTime();
						obj.prevowner = obj.owner;
						obj.owner = apiobj.owner;
						W.updateObjectiveIcon(obj);
						W.updateObjectiveAge(obj);
						W.updateObjectiveTooltip(obj);
						
						// Mark the objective as immune if it is recently captured
						if ((nowmsec - obj.last_flipped_msec) < W.cMILLISECONDS_IMMUNITY
								&& obj.owner !== W.OwnerEnum.Neutral) // If it is owned by Neutral (no immunity) then it is WvW reset
						{
							W.Objectives[obj.id].isImmune = true;
							$("#objProgressBar_" + obj.id).show().find("var").css({width: "0%"}).animate({width: "100%"}, 800);
						}
					}
					/*
					 * Only update guild tag labels if claiming has changed.
					 */
					if (obj.claimed_by !== apiobj.claimed_by)
					{
						obj.prevclaimed_by = obj.claimed_by;
						obj.claimed_by = apiobj.claimed_by;
						obj.claimed_at = apiobj.claimed_at;
						W.updateObjectiveClaim(obj);
					}
					// If these many objectives flipped after an update then there might be an error with the API
					if (numobjflipped > maxobjflipped)
					{
						istoomanyflips = true;
						break;
					}
				}
				if (numobjflipped > maxobjflipped)
				{
					istoomanyflips = true;
					break;
				}
			}
			// Initialize stagnant variables once
			if (W.MatchFinishTime !== pData.end_time)
			{
				W.MatchFinishTime = pData.end_time;
				W.secTillWvWReset = ~~(((new Date(W.MatchFinishTime)).getTime() - nowmsec) / T.cMILLISECONDS_IN_SECOND);
				W.MatchupIDCurrent = pData.id;
				W.MatchupCurrent = pData.worlds;
				W.updateParticipants();
			}
			
			// Update scoreboard
			if (O.Options.bol_showLeaderboard)
			{
				W.insertScoreboard(pData);
			}
			
			// Check for errors
			if (istoomanyflips)
			{
				D.stopSpeech();
				W.reinitializeServerChange(false);
				W.addLogEntry("Restarted due to API error.");
				I.write("Too many objectives updated. ArenaNet API servers may be having problems.");
			}
			if (W.isAPIFailed)
			{
				succeedReconnection();
			}
		}}).fail(function()
		{
			if (W.isFallbackEnabled === false)
			{
				W.numFailedAPICalls++;
				if (W.numFailedAPICalls > maxattemptsuntilfallback)
				{
					W.isFallbackEnabled = true;
					W.updateObjectives();
					I.write("Too many failed API retrievals. Switched to backup API server.", 0);
				}
				else
				{
					if (W.isAPIFailed === false)
					{
						W.isAPIFailed = true;
						// If failed near reset then tell so, otherwise generic error
						var errormessage = (W.secTillWvWReset !== null && W.secTillWvWReset < 10 * T.cSECONDS_IN_MINUTE)
							? "WvW reset is happening soon." : "The map will refresh automatically when ArenaNet servers are back online.";
						I.write("Unable to retrieve WvW data during " + T.getTimeFormatted() + ". Please wait...<br />" + errormessage, 0);
					}
				}
			}
		});
	},
	
	/*
	 * Converts a v1 API matches.json match object to a v2 API worlds object.
	 * @param object pMatch.
	 * @returns object worlds.
	 */
	convertMatchup: function(pMatch)
	{
		return {
			red: pMatch.red_world_id,
			blue: pMatch.blue_world_id,
			green: pMatch.green_world_id
		};
	},
	
	/*
	 * Uses the v1 API to get objectives state. Reconstructs data as v2 API
	 * style objects so they can be reused.
	 */
	updateObjectivesFallback: function()
	{
		var now = new Date();
		var nowiso = now.toISOString();
		var nowmsec = now.getTime();
		// First find the matchup for the selected server
		if (W.MatchupIDCurrent === null || W.Matches === null)
		{
			$.ajax({
				dataType: "json",
				url: U.URL_API.MatchesFallback,
				cache: false,
				success: function(pData)
				{
					if (W.isFallbackEnabled === false)
					{
						return;
					}
					W.Matches = {};
					for (var i in pData.wvw_matches)
					{
						var match = pData.wvw_matches[i];
						var serverid = parseInt(O.Options.enu_Server);
						W.Matches[match.wvw_match_id] = W.convertMatchup(match);
						// Execute this function again now that the match ID is found
						if (match.red_world_id === serverid
							|| match.blue_world_id === serverid
							|| match.green_world_id === serverid)
						{
							W.MatchupIDCurrent = match.wvw_match_id;
							W.MatchFinishTime = match.end_time;
							W.secTillWvWReset = ~~(((new Date(W.MatchFinishTime)).getTime() - nowmsec) / T.cMILLISECONDS_IN_SECOND);
							// Duplicate the structure the v2 matches API "worlds" subobject
							W.MatchupCurrent = W.Matches[W.MatchupIDCurrent];
							W.updateParticipants();
							W.updateObjectivesFallback();
						}
					}
				}
			});
		}
		else
		{
			$.ajax({
				dataType: "json",
				url: U.URL_API.MatchFallback + W.MatchupIDCurrent,
				cache: false,
				success: function(pData)
				{
					if (W.isFallbackEnabled === false)
					{
						return;
					}
					var map, obj, apiobj, landprefix;
					var pastfar = new Date(nowmsec - W.cMILLISECONDS_IMMUNITY);
					var pastnear = new Date(nowmsec - (O.Options.int_secWvWRefresh * T.cMILLISECONDS_IN_SECOND));
					for (var i in pData.maps)
					{
						map = pData.maps[i];
						landprefix = W.Metadata.LandPrefix[map.type];
						for (var ii in map.objectives)
						{
							apiobj = map.objectives[ii];
							obj = W.Objectives[landprefix + apiobj.id];
							/*
							 * Only update the objectives if they have changed server ownership.
							 */
							var past = (obj.owner === null) ? pastfar : pastnear;
							if (obj.owner !== apiobj.owner)
							{
								// Reinitialize properties
								obj.last_flipped = past.toISOString();
								obj.last_flipped_msec = past.getTime();
								obj.prevowner = obj.owner;
								obj.owner = apiobj.owner;
								W.updateObjectiveIcon(obj);
								W.updateObjectiveAge(obj);
								W.updateObjectiveTooltip(obj);

								// Mark the objective as immune if it is recently captured
								if ((nowmsec - obj.last_flipped_msec) < W.cMILLISECONDS_IMMUNITY
										&& obj.owner !== W.OwnerEnum.Neutral) // If it is owned by Neutral (no immunity) then it is WvW reset
								{
									W.Objectives[obj.id].isImmune = true;
									$("#objProgressBar_" + obj.id).show().find("var").css({width: "0%"}).animate({width: "100%"}, 800);
								}
							}
							/*
							 * Only update guild tag labels if claiming has changed.
							 */
							if (obj.claimed_by !== apiobj.owner_guild)
							{
								obj.prevclaimed_by = obj.claimed_by;
								obj.claimed_by = apiobj.owner_guild;
								obj.claimed_at = nowiso;
								W.updateObjectiveClaim(obj);
							}
						}
					}

					// Update scoreboard
					if (O.Options.bol_showLeaderboard)
					{
						W.insertScoreboard(pData);
					}
				}
			});
		}
	},
	
	/*
	 * Refreshes the objective's icon, which is also its color, to the current owner.
	 * @param object pObjective.
	 */
	updateObjectiveIcon: function(pObjective)
	{
		// Update objective visuals
		var animationspeed = 2000;
		var objumbrella = $("#objUmbrella_" + pObjective.id); // A big circle over the objective icon
		var objicon = $("#objIcon_" + pObjective.id);
		var prevwidth = objicon.css("width");

		// If the objective is being reassigned from a known previous owner
		if (pObjective.prevowner !== null && pObjective.owner !== W.OwnerEnum.Neutral)
		{
			var prevcolor = W.Metadata[pObjective.prevowner].color;
			var color = W.Metadata[pObjective.owner].color;
			objumbrella.parent().parent().show(); // Show the umbrella container
			// Color the umbrella notification circle and blink it
			objumbrella.css({borderColor: prevcolor, boxShadow: "0px 0px 10px " + prevcolor});
			I.bloatElement(objumbrella, 1000, 100);
			// Squash the icon to 0 width, then change the icon image and stretch it back to previous width
			(function(iOwner, iUmbrella, iColor)
			{
				objicon.css({width: prevwidth}).animate({width: 0}, animationspeed, function()
				{
					iUmbrella.css({borderColor: iColor, boxShadow: "0px 0px 10px " + iColor});
					$(this).attr("src", $(this).attr("data-src") + (iOwner).toLowerCase() + I.cPNG)
						.animate({width: prevwidth}, animationspeed, function()
						{
							iUmbrella.parent().parent().hide();
							W.adjustZoomMapping();
						});
				});
			})(pObjective.owner, objumbrella, color);
			// Log the change of ownership
			W.addLogEntryObjective(pObjective);
		}
		else
		{
			// If it is the first initialization (no previous known owner), then just assign the icons
			objicon.attr("src", objicon.attr("data-src") + (pObjective.owner).toLowerCase() + I.cPNG);
		}
	},
	
	/*
	 * Updates the HTML timer of recently captured objectives. To be called by
	 * the clock tick second function.
	 */
	updateObjectiveTimers: function()
	{
		var obj;
		var msec = (new Date()).getTime();
		var msecage, msecremaining, percentremaining;
		var msectolerance = 30000;
		
		for (var i in W.Objectives)
		{
			obj = W.Objectives[i];
			// Update the Righteous Indigntation timers
			if (obj.isImmune)
			{
				msecage = msec - obj.last_flipped_msec;
				msecremaining = W.cMILLISECONDS_IMMUNITY - msecage;
				percentremaining = (msecremaining / W.cMILLISECONDS_IMMUNITY) * T.cPERCENT_100;
				if (msecremaining > 0 && msecage + msectolerance > 0)
				{
					document.getElementById("objTimer_" + obj.id).innerHTML = T.formatMilliseconds(msecremaining);
					document.getElementById("objProgress_" + obj.id).style.width = percentremaining + "%";
				}
				else if (msecage + msectolerance <= 0)
				{
					if (T.isTimeOutOfSync === false)
					{
						W.addLogEntry("Negative time detected. Your computer's time may be <a"
							+ U.convertExternalAnchor("https://www.google.com/search?q=synchronize+time") + ">out of sync!</a>");
						T.isTimeOutOfSync = true;
					}
				}
				else
				{
					// If the objective has become capturable
					$("#objTimer_" + obj.id).html("");
					$("#objProgressBar_" + obj.id).css({opacity: 1}).animate({opacity: 0}, 2000, function()
					{
						$(this).css({opacity: 1}).hide();
					});
					$("#objIcon_" + obj.id).css({opacity: 0}).animate({opacity: 1}, 2000);
					obj.isImmune = false;
					W.updateObjectiveAge(obj);
				}
			}
		}
	},
	
	/*
	 * Updates the label showing an objective's time since it was last captured.
	 * @param object pObjective.
	 */
	updateObjectiveAge: function(pObjective)
	{
		var msecage = (new Date()).getTime() - pObjective.last_flipped_msec;
		// Minutely updates
		$("#objAge_" + pObjective.id).html(T.getShorthandTime(msecage));
	},
	updateAllObjectiveAge: function()
	{
		// To be called minutely by the clock tick second function
		for (var i in W.Objectives)
		{
			W.updateObjectiveAge(W.Objectives[i]);
		}
	},
	
	/*
	 * Updates the label showing the guild tag of who claimed the objective.
	 * @param object pObjective.
	 */
	updateObjectiveClaim: function(pObjective)
	{
		if (pObjective.claimed_by === null || pObjective.claimed_by === undefined)
		{
			// If the objective was previously claimed but has become unclaimed
			pObjective.guild_name = null;
			pObjective.tag = null;
			W.updateObjectiveTooltip(pObjective);
			$("#objClaim_" + pObjective.id).empty();
		}
		else
		{
			// If the objective changed claimers
			$.getJSON(U.URL_API.GuildDetails + pObjective.claimed_by, function(pData)
			{
				pObjective.guild_name = pData.guild_name;
				pObjective.tag = pData.tag;
				W.updateObjectiveTooltip(pObjective);
				var label = $("#objClaim_" + pObjective.id);
				var prevcolor = label.css("color");
				label.html("[" + pObjective.tag + "]");
				// Also animate if guild has changed from previous known claimer
				if (pObjective.prevclaimed_by !== "none")
				{
					I.blinkElement(label, 2000, 200);
					label.css({color: "#ffffff"}).animate({color: prevcolor}, 4000);
					W.addLogEntryObjective(pObjective, true);
				}
			});
		}
	},
	
	/*
	 * Rewrites the objective marker's HTML tooltip with the current objective's
	 * properties data. To be called when objective changed owner or claim.
	 * @param object pObjective.
	 */
	updateObjectiveTooltip: function(pObjective)
	{
		// Initialize tooltip behavior for ith icon
		var obj = pObjective;
		var icon = $("#objIcon_" + obj.id);
		var claim = "";
		if (obj.claimed_by !== null)
		{
			claim = "<br /><dfn>Claim:</dfn> " + (new Date(obj.claimed_at)).toLocaleString()
				+ "<br /><dfn>Guild:</dfn> " + U.escapeHTML(obj.guild_name + " [" + obj.tag + "]")
				+ "<div class='cssCenter'><img class='objTooltipBanner' src='" + U.getGuildBannerURL(obj.guild_name) + "' /></div>";
		}
		
		var title = "<div class='objTooltip'>"
			+ "<dfn class='objTooltipName'>" + D.getObjectName(obj) + "</dfn>"
			+ "<br /><dfn>Owner:</dfn> " + (new Date(obj.last_flipped)).toLocaleString()
			+ claim
		+ "</div>";
		I.qTip.init(icon.attr("title", title));
	},
	
	/*
	 * Starts or stops the objectives tick function and sets associated variables.
	 * @param boolean pBoolean true to start.
	 */
	toggleObjectiveTick: function(pBoolean)
	{
		if (pBoolean)
		{
			W.isObjectiveTickEnabled = pBoolean;
			W.tickObjectives();
			W.isObjectiveTimerTickEnabled = pBoolean;
		}
		else
		{
			window.clearTimeout(W.ObjectiveTimeout);
			W.isObjectiveTickEnabled = pBoolean;
			W.isObjectiveTimerTickEnabled = pBoolean;
		}
	},
	
	/*
	 * Executes the update objectives function every few seconds.
	 */
	tickObjectives: function()
	{
		if (W.isObjectiveTickEnabled)
		{
			W.updateObjectives();
			window.clearTimeout(W.ObjectiveTimeout);
			W.ObjectiveTimeout = setTimeout(function()
			{
				W.tickObjectives();
			}, O.Options.int_secWvWRefresh * T.cMILLISECONDS_IN_SECOND);
		}
	}
};

/* =============================================================================
 * @@Time utilities, schedule, daily, and numeric functions
 * ========================================================================== */
T = {
	
	Daily: GW2T_DAILY_DATA,
	DailyAssociation: GW2T_DAILY_ASSOCIATION,
	DailyToday: null,
	DailyTomorrow: null,
	Schedule: {},
	DryTopSets: {},
	DryTopCodes: {},
	
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
	cSECONDS_IN_YEAR: 31536000,
	cMINUTES_IN_HOUR: 60,
	cMINUTES_IN_2_HOURS: 120,
	cMINUTES_IN_DAY: 1440,
	cHOURS_IN_MERIDIEM: 12,
	cHOURS_IN_DAY: 24,
	cDAYS_IN_WEEK: 7,
	cDAYS_IN_YEAR: 365,
	cSECONDS_IN_TIMEFRAME: 900,
	cMINUTES_IN_TIMEFRAME: 15,
	cMINUTES_IN_MINIFRAME: 5,
	cNUM_TIMEFRAMES_IN_HOUR: 4,
	cSECS_MARK_0: 0,
	cSECS_MARK_1: 900,
	cSECS_MARK_2: 1800,
	cSECS_MARK_3: 2700,
	cSECS_MARK_4: 3599,
	cBASE_10: 10,
	cPERCENT_100: 100,
	// Game constants
	WEEKLY_RESET_DAY: 1, // Monday 00:00 UTC
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
	isTimeOutOfSync: false,
	secondsTillResetWeekly: -1,
	isCountdownToResetStarted: false,
	
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
		var minute = (~~(min / T.cMINUTES_IN_MINIFRAME) * T.cMINUTES_IN_MINIFRAME) + (pOffset * T.cMINUTES_IN_MINIFRAME);
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

		T.DryTopSets = GW2T_DRYTOP_SETS;
		T.DryTopCodes = GW2T_DRYTOP_CODES;
		for (var i in T.DryTopCodes) // Initialize chatcodes
		{
			T.DryTopCodes[i].chat += getDryTopSet(T.DryTopCodes[i].set);
		}
		
		K.updateDryTopClipboard();
		$("#itemDryTopClip").show();
	},
	
	/*
	 * Initializes a slot in the schedule. All units are in minutes since UTC midnight.
	 * @param int pTime minute.
	 * Example of expected schedule:
	 *	T.Schedule =
	 *	{
	 *	   "0": {SchedTime: 0 SchedChains: [C.Taidha, C.Tequatl]},
	 *	  "15": {SchedTime: 15, SchedChains: [C.Maw]},
	 *	  "30": {SchedTime: 30, SchedChains: [C.Megades]},
	 *	  "45": {SchedTime: 45, SchedChains: [C.FE]},
	 *		...
	 *	}
	 */
	initializeScheduleSlot: function(pTime)
	{
		if (T.Schedule[pTime] === undefined)
		{
			T.Schedule[pTime] = {SchedTime: pTime, SchedChains: []};
		}
	},
	
	/*
	 * Inserts a chain into the schedule.
	 * @param object pChain.
	 * @param array/object pTime array of strings of HH:MM format,
	 * or an object with the timing pattern:
	 * hourInitial: the first UTC hour the chain starts on.
	 * hourMultiplier: the repetition on every so hours.
	 * minuteOffset: the UTC minutes from those hours.
	 */
	insertChainToSchedule: function(pChain)
	{
		var utcminute = 0;
		var timing = pChain.timing;
		// If given an array of start times
		if (Array.isArray(timing))
		{
			for (var i in timing)
			{
				utcminute = T.parseChainTime(timing[i]);
				T.initializeScheduleSlot(utcminute);
				T.Schedule[utcminute].SchedChains.push(pChain);
			}
		}
		// If given a pattern of the start times
		else
		{
			for (utcminute = (timing.hourInitial * T.cMINUTES_IN_HOUR) + timing.minuteOffset;
				utcminute < T.cMINUTES_IN_DAY;
				utcminute += timing.hourMultiplier * T.cMINUTES_IN_HOUR)
			{
				T.initializeScheduleSlot(utcminute);
				T.Schedule[utcminute].SchedChains.push(pChain);
			}
		}
	},
	
	// World boss chains
	initializeSchedule: function()
	{
		var i, ii, iii;
		var slot;
		
		// Initialize Living Story events, if available
		if (B.DashboardStory.isEnabled)
		{
			if (T.isTimely(B.DashboardStory, new Date()))
			{
				B.isDashboardStoryEnabled = true;
			}
		}
		
		// Initialize chains
		X.initializeChecklist(X.Checklists.Chain, C.Chains.length + C.UnscheduledChainsLength);
		X.initializeChecklist(X.Checklists.ChainSubscription, C.Chains.length + C.UnscheduledChainsLength);
		C.initializeScheduledChains();
		I.initializeChainsUI();
		// Initial recoloring of chain titles
		$("#sectionChains_Scheduled .chnBar h1, #sectionChains_Drytop .chnBar h1, #dsbStory .chnBar h1")
			.addClass("chnTitleFutureFar");
		
		// Every scheduled chain gets an array of schedule keys (UTC minutes) of where it is in the schedule
		for (i in C.ScheduledChains)
		{
			T.insertChainToSchedule(C.ScheduledChains[i]);
		}
		for (i in T.Schedule)
		{
			slot = T.Schedule[i];
			for (ii in C.ScheduledChains)
			{
				for (iii in slot.SchedChains)
				{
					if (C.ScheduledChains[ii].nexus === slot.SchedChains[iii].nexus)
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
		return T.Schedule[pKey].SchedTime;
	},
	
	/*
	 * Gets the chain array in schedule by specified key.
	 * @param string pKey of schedule slot.
	 * @returns array chains.
	 */
	getScheduleSlotChainsByKey: function(pKey)
	{
		return T.Schedule[pKey].SchedChains;
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
		return T.Schedule[T.getTimeframe(pOffset)].SchedChains;
	},
	
	/*
	 * Gets a chain of particular series for specified timeframe.
	 * @param int pOffset number of timeframes from the current.
	 * @param string pSeries to filter the chains array.
	 */
	getTimeframeChainBySeries: function(pOffset, pSeries)
	{
		var chains = T.getTimeframeChains(pOffset);
		
		for (var i in chains)
		{
			if (chains[i].series === pSeries)
			{
				return chains[i];
			}
		}
		return null;
	},
	getTimeframeChainsBySeries: function(pOffset, pSeries)
	{
		var chains = T.getTimeframeChains(pOffset);
		var retchains = [];
		
		for (var i in chains)
		{
			if (chains[i].series === pSeries)
			{
				retchains.push(chains[i]);
			}
		}
		return retchains;
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
	getMiscellaneousChains: function(pOffset)
	{
		return T.getTimeframeChainsBySeries(pOffset, C.ChainSeriesEnum.Miscellaneous);
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
		return T.wrapInteger(time, T.cSECONDS_IN_DAY);
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
			minword = " " + D.getSpeechWord("minute");
			hourword = " " + D.getSpeechWord("hour");
			if (Math.abs(min) > 1)
			{
				minword = " " + D.getSpeechWord("minutes");
			}
			if (Math.abs(hour) > 1)
			{
				hourword = " " + D.getSpeechWord("hours");
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
	 * Gets the lowest and highest value inside an array.
	 * @param array pArray.
	 * @param string pProperty of array if the value is a property.
	 * @returns object contains min and max values, and their key/index.
	 */
	getMinMax: function(pArray, pProperty)
	{
		var hasprop = !(pProperty === undefined);
		var min = Number.POSITIVE_INFINITY;
		var max = Number.NEGATIVE_INFINITY;
		var minkey = null;
		var maxkey = null;
		var ith;
		for (var i in pArray)
		{
			ith = hasprop ? (pArray[i])[pProperty] : pArray[i];
			if (ith < min)
			{
				min = ith;
				minkey = i;
			}
			if (ith > max)
			{
				max = ith;
				maxkey = i;
			}
		}
		return {min: min, max: max, minkey: minkey, maxkey: maxkey};
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
	 * Parses a counting number.
	 * @param number or string pQuantity.
	 * @param number pDefault value.
	 * @returns cleaned quantity.
	 */
	parseQuantity: function(pQuantity, pDefault)
	{
		if (pDefault === undefined)
		{
			pDefault = 1;
		}
		var quantity = parseInt(pQuantity);
		if ( ! isFinite(quantity)) { quantity = pDefault; }
		return quantity;
	},
	
	/*
	 * Parses a quotient.
	 * @param number pRatio.
	 * @param int pDigits of decimals to show.
	 * @returns cleaned decimal.
	 */
	parseRatio: function(pRatio, pDigits)
	{
		if (pRatio === 0 || isNaN(pRatio))
		{
			return 0;
		}
		else if (pRatio === 1 || pRatio === Number.POSITIVE_INFINITY || pRatio === Number.NEGATIVE_INFINITY)
		{
			return 1;
		}
		return (pDigits !== undefined) ? pRatio.toFixed(pDigits) : pRatio;
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
		var time = [];
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
		var settings = $.extend({
			reference: T.ReferenceEnum.Local,
			want24: O.Options.bol_use24Hour,
			wantSeconds: true,
			wantHours: true,
			wantLetters: false
		}, pOptions);
		
		var sec, min, hour;
		var now = (settings.customTimeInDate === undefined) ? (new Date()) : settings.customTimeInDate;
		if (settings.customTimeInSeconds === undefined)
		{
			switch (settings.reference)
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
			// Regard negative input
			settings.customTimeInSeconds = T.wrapInteger(settings.customTimeInSeconds, T.cSECONDS_IN_DAY);
			/*
			 * Convert specified seconds to time units. The ~~ gets rid of the
			 * decimal so / behaves like integer divide.
			 */
			sec = settings.customTimeInSeconds % T.cSECONDS_IN_MINUTE;
			min = ~~(settings.customTimeInSeconds / T.cSECONDS_IN_MINUTE) % T.cMINUTES_IN_HOUR;
			hour = ~~(settings.customTimeInSeconds / T.cSECONDS_IN_HOUR);
		}
		
		var minsec = "";
		// Include the seconds else don't
		if (settings.wantSeconds)
		{
			if (settings.wantLetters)
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
			else if (settings.wantHours === false)
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
			if (settings.wantLetters)
			{
				minsec = min + D.getWord("m");
			}
			else
			{
				minsec = ((min < T.cBASE_10) ? "0" + min : min);
			}
		}
		
		// Possible returns
		if (settings.wantLetters)
		{
			if (hour === 0 || settings.wantHours === false)
			{
				return minsec;
			}
			return hour + D.getWord("h") + " " + minsec;
		}
		if (settings.want24)
		{
			if (settings.wantHours === false)
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
	 * Gets a "0m" "1m" "59m" "1h" "25h" single unit approximated time string.
	 * @param int pMilliseconds of time.
	 * @returns string shorthand.
	 */
	getShorthandTime: function(pMilliseconds)
	{
		var seconds = ~~(pMilliseconds / T.cMILLISECONDS_IN_SECOND);
		// Return minutes
		if (seconds < T.cSECONDS_IN_MINUTE)
		{
			return 0 + D.getWord("m");
		}
		if (seconds < T.cSECONDS_IN_HOUR)
		{
			return (~~(seconds / T.cSECONDS_IN_MINUTE) % T.cMINUTES_IN_HOUR) + D.getWord("m");
		}
		// Return hours
		return ~~(seconds / T.cSECONDS_IN_HOUR) + D.getWord("h");
	},
	
	/*
	 * Gets a "Days:Hours:Minutes:Seconds" string from seconds.
	 * @param int pMilliseconds of time.
	 * @returns string formatted time.
	 */
	formatMilliseconds: function(pMilliseconds, pWantDeciseconds)
	{
		var seconds = ~~(pMilliseconds / T.cMILLISECONDS_IN_SECOND);
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
			var deciseconds = ~~((pMilliseconds % T.cMILLISECONDS_IN_SECOND) / T.cBASE_10);
			msstr = "." + deciseconds;
			if (deciseconds < T.cBASE_10)
			{
				msstr = ".0" + deciseconds;
			}
		}
		
		return signstr + daystr + hourstr + minstr + secstr + msstr;
	},
	
	/*
	 * Gets a "1w 6d 23h 59m 59s" string from seconds. Years is used instead of
	 * weeks if the time is that long.
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
		if (seconds < T.cSECONDS_IN_YEAR)
		{
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
		}
		else
		{
			if (seconds >= T.cSECONDS_IN_YEAR)
			{
				week = ~~(seconds / T.cSECONDS_IN_YEAR);
				weekstr = week + D.getWord("y") + " ";
			}
			if (seconds >= T.cSECONDS_IN_DAY)
			{
				day = ~~(seconds / T.cSECONDS_IN_DAY) % T.cDAYS_IN_YEAR;
				daystr = day + D.getWord("d") + " ";
			}
		}
		// Include hms only if duration is less than a year
		if (seconds < T.cSECONDS_IN_YEAR)
		{
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
		}
		
		return signstr + weekstr + daystr + hourstr + minstr + secstr;
	},
	formatMinutes: function(pMinutes)
	{
		return T.formatSeconds(pMinutes * T.cSECONDS_IN_MINUTE);
	},
	
	/*
	 * Checks a time sensitive object if its Start and Finish date objects are
	 * within the current time.
	 * @param object pObject to check.
	 * @param Date pDate time to compare with.
	 * @param int pGracePeriod seconds to add to the finish time, optional.
	 */
	isTimely: function(pObject, pDate, pGracePeriod)
	{
		var finish = (pGracePeriod === undefined)
			? pObject.Finish : (new Date(pObject.Finish.getTime() + pGracePeriod * T.cMILLISECONDS_IN_SECOND));
		if (pDate >= pObject.Start && pDate <= finish)
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
	 * Gets the minutes elapsed in the current even hour of UTC.
	 * Example: 14:00 = 0, 14:20 = 20, 15:59 = 119, 16:00 = 0
	 * @returns int minutes.
	 */
	getCurrentBihourlyMinutesUTC: function()
	{
		var now = new Date();
		return ((now.getUTCHours() % 2) * T.cMINUTES_IN_HOUR) + now.getUTCMinutes();
	},
	
	/*
	 * Gets the timestamp for the current two-hour period.
	 * @param int pOffset minutes since the start of the current even hour.
	 * @returns string timestamp.
	 */
	getCurrentBihourlyTimestampLocal: function(pOffset)
	{
		var now = new Date();
		var hour = now.getUTCHours();
		var evenhour = (hour % 2 === 0) ? hour : (hour - 1);
		
		var time = ((evenhour * T.cMINUTES_IN_HOUR)) - now.getTimezoneOffset();
		time = T.wrapInteger(time, T.cMINUTES_IN_DAY);
		return T.getTimeFormatted({
			customTimeInSeconds: ((time + pOffset) * T.cSECONDS_IN_MINUTE),
			wantSeconds: false
		});
	},
	
	/*
	 * Gets the seconds until a time in a day of the week.
	 * @param int pDay of week.
	 * @param int pOffsetSeconds since midnight (start) of that day.
	 * @returns int seconds.
	 */
	getSecondsTillUTCWeekday: function(pTargetDay, pOffsetSeconds)
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
			T.secondsTillResetWeekly = T.getSecondsTillUTCWeekday(T.WEEKLY_RESET_DAY);
		}
		$("#chlCountdownToReset").text(T.formatSeconds(T.secondsTillResetWeekly, true));
		// Decrement global variable to countdown, instead of calling the compute function every time
		T.secondsTillResetWeekly--;
	},
	
	/*
	 * Converts an API daily object to a nickname based object with similar structure
	 * @param object pObj from API.
	 * @returns object reformatted.
	 */
	convertDailyObject: function(pObj)
	{
		var daily = {};
		var a = T.DailyAssociation;
		// Trim non-max level dailies
		for (var i = pObj.pve.length - 1; i >= 0; i--)
		{
			if ((pObj.pve[i]).level.max < I.cLevelMax)
			{
				pObj.pve.splice(i, 1);
			}
		}
		// Turn the achievement IDs into achievement nicknames
		var u = "unknown";
		daily.pve = [a[(pObj.pve[0].id)] || u, a[(pObj.pve[1].id)] || u, a[(pObj.pve[2].id)] || u, a[(pObj.pve[3].id)] || u];
		daily.pvp = [a[(pObj.pvp[0].id)] || u, a[(pObj.pvp[1].id)] || u, a[(pObj.pvp[2].id)] || u, a[(pObj.pvp[3].id)] || u];
		daily.wvw = [a[(pObj.wvw[0].id)] || u, a[(pObj.wvw[1].id)] || u, a[(pObj.wvw[2].id)] || u, a[(pObj.wvw[3].id)] || u];
		return daily;
	},
	
	/*
	 * Extracts the daily world boss from a daily object.
	 * @param object pDaily that was converted from the API object.
	 * @returns object chain or null if invalid boss.
	 */
	extractDailyChain: function(pDaily)
	{
		var alias = pDaily.pve[3];
		alias = (alias !== undefined && alias !== null) ? alias.toLowerCase() : null;
		if (alias !== null && C.ChainAssociation[alias] !== undefined)
		{
			return C.getChainByAlias(alias);
		}
		return null;
	},
	
	/*
	 * Initializes the daily object and the today chain object.
	 * @objparam boolean getTomorrow whether to get tomorrow's daily object instead.
	 * @objparam boolean setTomorrow whether to set today's daily object as tomorrow's.
	 * @objparam boolean isReset whether to also do daily reset related functions.
	 * @returns jqXHR object.
	 */
	getDaily: function(pOptions)
	{
		pOptions = pOptions || {};
		var retrywaitminutes = 3;
		var url = U.URL_API.Daily;
		if (pOptions.getTomorrow || pOptions.setTomorrow)
		{
			url = U.URL_API.Tomorrow;
		}
		
		return $.getJSON(url, function(pData)
		{
			if (pOptions.getTomorrow) // Get tomorrow
			{
				T.DailyTomorrow = T.convertDailyObject(pData);
				C.ChainTomorrow = T.extractDailyChain(T.DailyTomorrow);
			}
			else // Get today
			{
				T.DailyToday = T.convertDailyObject(pData);
				// Initialize today chain object
				var dailychain = T.extractDailyChain(T.DailyToday);
				var currentmins = T.getTimeSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Minutes);
				var startmins;

				if (dailychain !== null)
				{
					startmins = T.convertScheduleKeyToUTCMinutes(dailychain.scheduleKeys[0]);
					
					if (pOptions.setTomorrow)
					{
						C.ChainToday = dailychain; // SUCCESS SET TOMORROW
					}
					else
					{
						/*
						 * If the today chain object was already parsed, make sure that
						 * the retrieved API daily object is different from it, in case
						 * the API server was not updated immediately at reset time.
						 */
						if (C.ChainToday !== null && pOptions.isReset)
						{
							var previousalias = C.ChainToday.alias;
							C.ChainToday = null; // Single recursion base case
							C.refreshChainDailyIcon();
							if (dailychain.alias === previousalias)
							{
								// Wait a while and retrieve the daily object hoping it is updated
								setTimeout(function()
								{
									T.getDaily({isReset: true});
								},  retrywaitminutes * T.cMILLISECONDS_IN_MINUTE);
								return;
							}
						}

						// Make sure today's boss can still spawn before server reset at UTC midnight
						if (startmins + T.cMINUTES_IN_TIMEFRAME >= currentmins)
						{
							C.ChainToday = dailychain; // SUCCESS SET TODAY
						}
						// Else get tomorrow's boss
						else
						{
							T.getDaily({setTomorrow: true});
						}
					}
				}
				else
				{
					// No boss for this day
					C.ChainToday = null;
				}

				/*
				 * If successfully retrieved today chain object.
				 */
				if (C.ChainToday)
				{
					// Update daily icons
					C.refreshChainDailyIcon();

					if (pOptions.isReset === true)
					{
						// Tell today's world boss closest scheduled time if server resetted
						if (O.isServerReset)
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

						// Subscribe to daily chain
						if (O.Options.bol_alertAutosubscribe &&
							O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription)
						{
							var subscriptionbutton = $("#chnTime_" + C.ChainToday.nexus);
							if ( ! subscriptionbutton.hasClass("chnTimeSubscribed"))
							{
								subscriptionbutton.trigger("click");
							}
						}
					}
				}
			}
		});
	}
	
};

/* =============================================================================
 * @@Board dashboard and timeline
 * ========================================================================== */
B = {
	
	DashboardAnnouncement: GW2T_DASHBOARD_DATA.Announcement,
	DashboardCountdown: GW2T_DASHBOARD_DATA.Countdowns,
	DashboardStory: GW2T_DASHBOARD_DATA.Story,
	DashboardSale: GW2T_DASHBOARD_DATA.Sale,
	DashboardVendor: GW2T_DASHBOARD_DATA.Vendor,
	isDashboardEnabled: true,
	isDashboardAnnouncementEnabled: false,
	isDashboardCountdownEnabled: false,
	isDashboardCountdownTickEnabled: false,
	isDashboardStoryEnabled: false,
	isDashboardSaleEnabled: false,
	isDashboardVendorEnabled: false,
	
	Timeline: GW2T_TIMELINE,
	isTimelineEnabled: true,
	isTimelineGenerated: false,

	/*
	 * Initializes dashboard components.
	 * Must be executed before the clock tick function executes.
	 */
	initializeDashboard: function()
	{
		var now = new Date();
		// Verify countdown: if at least one countdown has not expired
		for (var i in B.DashboardCountdown)
		{
			if (now < B.DashboardCountdown[i].Finish)
			{
				B.isDashboardCountdownEnabled = true;
				break;
			}
		}
		
		// Verify announcement: if announcement exists
		if (B.DashboardAnnouncement.content.length > 0 && T.isTimely(B.DashboardAnnouncement, now))
		{
			U.convertExternalLink($("#dsbAnnouncement").html(B.DashboardAnnouncement.content).find("a"));
			M.bindMapLinks("#dsbAnnouncement");
			B.isDashboardAnnouncementEnabled = true;
		}
		
		// Verify sale: if sale exists and has not expired
		if (B.DashboardSale.Items.length > 0 && T.isTimely(B.DashboardSale, now))
		{
			B.isDashboardSaleEnabled = true;
		}
		// Verify vendor: if has not expired
		if (T.isTimely(B.DashboardVendor, now, T.cSECONDS_IN_DAY))
		{
			B.isDashboardVendorEnabled = true;
		}
		
		// Make sure at least one component of the dashboard is enabled, else disable the dashboard
		if ((B.isDashboardCountdownEnabled === false
				&& B.isDashboardAnnouncementEnabled === false
				&& B.isDashboardSaleEnabled === false
				&& B.isDashboardVendorEnabled === false)
			|| B.isDashboardEnabled === false
			|| I.isMapEnabled === false
			|| O.Options.bol_showDashboard === false)
		{
			B.isDashboardEnabled = false;
			return;
		}
		else
		{
			B.toggleDashboard(true);
			B.isDashboardCountdownTickEnabled = true;
		}
		
		// Button to toggle the dashboard
		$("#dsbToggle").click(function()
		{
			$("#dsbContainer").toggle("fast");
		});
		
		// Initialize countdown entries
		if (B.isDashboardCountdownEnabled)
		{
			var namekey = D.getNameKey();
			var urlkey = D.getURLKey();
			var ctd;
			var countdownname;
			var url;
			
			for (var i in B.DashboardCountdown)
			{
				// Initialize countdown properties
				ctd = B.DashboardCountdown[i];
				ctd.isTimely = true;
				ctd.StartStamp = ctd.Start.toLocaleString();
				ctd.FinishStamp = ctd.Finish.toLocaleString();
				// Use default name if available, or use the translated name
				countdownname = (ctd.name === undefined) ? ctd[namekey] : ctd.name;
				// If available: set the URL as the official news page, the translated url, or a regular url
				url = (ctd.official === undefined) ? ctd[urlkey] : U.getGW2OfficialLink(ctd.official);
				url = (url === undefined) ? ctd.url : url;
				if (url.indexOf(I.cSiteURL) !== -1)
				{
					// Don't externalize URL if self link
					ctd.Anchor = "<a href='" + url + "'>" + countdownname + "</a>";
				}
				else
				{
					ctd.Anchor = "<a" + U.convertExternalAnchor(url) + ">" + countdownname + "</a>";
				}
				
				/*
				 * code: the colored bullet point for activity status
				 * time: the countdown time
				 * abbr: the up or down arrow for start or finish start
				 * var: the start or finish time
				 */
				$("#dsbCountdown").append(
					"<div id='dsbCountdown_" + i + "' class='dsbCountdownEntry'>"
						+ "<code>" + I.Symbol.Block + "</code>" + ctd.Anchor + " <time id='dsbCountdownTime_" + i + "'></time> <abbr></abbr> <var></var>"
					+ "</div>");
			}
			I.qTip.init("#dsbCountdown");
			B.refreshDashboard(now);
		}
		
		// Initialize Living Story
		if (B.isDashboardStoryEnabled)
		{
			$("#dsbStory").before("<div id='dsbStoryTitle'>" + D.getObjectName(B.DashboardStory) + "</div>").show();
			I.initializeScrollbar("#dsbStory");
		}
		
		// Initialize sale
		if (B.isDashboardSaleEnabled)
		{
			var icon = ((B.DashboardSale.isSpecial) ? "gemstore_special" : "gemstore") + I.cPNG;
			var range = T.getMinMax(B.DashboardSale.Items, "price");
			var rangestr = (range.min === range.max) ? range.max : (range.min + "-" + range.max);
			// Create "button" to toggle list of items on sale
			$("#dsbSale").append("<div><kbd id='dsbSaleHeader' class='curToggle'><img src='img/ui/" + icon + "' /> "
				+ "<u>" + B.DashboardSale.Items.length + " "
				+ D.getTranslation("Gem Store Promotions") + "</u> "
				+ "(<span class='dsbSalePriceCurrent'>" + rangestr + "<ins class='s16 s16_gem'></ins></span>)"
				+ "<img id='dsbSaleToggleIcon' src='img/ui/toggle.png' /></kbd>"
				+ "⇓@ " + B.DashboardSale.Finish.toLocaleString()
			+ "</div><div id='dsbSaleTable' class='jsScrollable'></div>");
			// Add a "padding" item if the columns are not equal length
			var ncol0 = 0, ncol1 = 0;
			for (var i in B.DashboardSale.Items)
			{
				if (B.DashboardSale.Items[i].col === 0)
				{
					ncol0++;
				}
				else
				{
					ncol1++;
				}
			}
			if (ncol0 < ncol1)
			{
				B.DashboardSale.Padding.col = 0;
				B.DashboardSale.Items.unshift(B.DashboardSale.Padding);
			}
			else if (ncol0 > ncol1)
			{
				B.DashboardSale.Padding.col = 1;
				B.DashboardSale.Items.unshift(B.DashboardSale.Padding);
			}
			// Bind buttons
			$("#dsbSaleHeader").click(function()
			{
				B.generateDashboardSale();
			});
			// Automatically generate the items on sale if the boolean is true
			I.toggleToggleIcon("#dsbSaleToggleIcon", B.DashboardSale.isPreshown);
			if (B.DashboardSale.isPreshown === true)
			{
				B.generateDashboardSale();
			}
		}
		
		// Initialize vendor
		if (B.isDashboardVendorEnabled)
		{
			B.generateDashboardVendorHeader();
		}
	},
	
	/*
	 * Regenerates the list of items on sale in a toggle manner.
	 */
	generateDashboardSale: function()
	{
		var animationspeed = 200;
		var table = $("#dsbSaleTable");
		
		if (table.is(":empty") === false)
		{
			I.toggleToggleIcon("#dsbSaleToggleIcon", false);
			table.animate({height: 0}, animationspeed, function()
			{
				$(this).css({height: "auto"}).empty();
			});
		}
		else
		{
			table.append(I.cThrobber);
			E.updateCoinInGem().always(function()
			{
				I.toggleToggleIcon("#dsbSaleToggleIcon", true);
				table.empty();
				if (B.DashboardSale.note.length > 0)
				{
					table.append("<div>Note: " + B.DashboardSale.note + "</div>");
				}
				table.append("<div id='dsbSaleCol0'></div><div id='dsbSaleCol1'></div>");
				if (E.Exchange.CoinInGem !== 0)
				{
					var gemstr = "<ins class='s16 s16_gem'></ins>";
					for (var i = 0; i < B.DashboardSale.Items.length; i++)
					{
						var item = B.DashboardSale.Items[i];
						var wiki = U.getWikiSearchLink(item.name);
						var video = U.getYouTubeLink(item.name);
						var column = (item.col !== undefined) ? item.col : parseInt(i) % 2;
						var oldprice = "";
						oldprice = (O.isInteger(item.discount)) ? item.discount : oldprice;
						oldprice = (Array.isArray(item.discount) && item.discount.length > 2) ? ((item.discount[0])[2]) : oldprice;
						oldprice = (oldprice !== "") ? ("<span class='dsbSalePriceOld'>" + oldprice + "</span> ") : oldprice;
						var discounts = "";
						if (item.discount && Array.isArray(item.discount))
						{
							discounts += "<span class='dsbDiscount'>";
							for (var ii = 0; ii < item.discount.length; ii++)
							{
								var disc = item.discount[ii];
								var oldpriceinner = (disc.length > 2) ? ("<span class='dsbSalePriceOld'>" + disc[2] + "</span> ") : "";
								var divisorstr = (disc[0] > 1) ? ("/" + disc[0] + " = " + Math.ceil(disc[1] / disc[0]) + gemstr) : "";
								discounts += oldpriceinner + "<span class='dsbSalePriceCurrent'>" + disc[1] + gemstr + divisorstr + "</span>"
									+ " ≈ " + E.convertGemToCoin(disc[1]) + "<br />";
							}
							discounts += "</span>";
						}
						$("#dsbSaleCol" + column).append("<div class='dsbSaleEntry'>"
							+"<a" + U.convertExternalAnchor(wiki) + "><img class='dsbSaleIcon' src='" + item.img + "' /></a> "
							+ "<span class='dsbSaleVideo'><a" + U.convertExternalAnchor(video) + "'><ins class='s16 s16_youtube'></ins></a></span> "
							+ oldprice
							+ "<span class='dsbSalePriceCurrent'>" + item.price + gemstr + "</span>"
							+ "<span class='dsbSalePriceCoin'> ≈ " + E.convertGemToCoin(item.price) + "</span>"
							+ "<span class='dsbSalePriceMoney'> = " + E.convertGemToMoney(item.price) + "<ins class='s16 s16_money'></ins></span>"
							+ discounts
						+ "</div>");
					}
				}
				var height = table.height();
				table.css({height: 0}).animate({height: height}, animationspeed, function()
				{
					$(this).css({height: "auto"});
					I.initializeScrollbar("#dsbSaleTable");
					I.updateScrollbar("#dsbSaleTable");
				});
			});
		}
	},
	
	/*
	 * Generates the header for the vendor feature.
	 */
	generateDashboardVendorHeader: function()
	{
		var weekdaylocation = B.getDashboardVendorWeekday();
		var vendorname = D.getObjectName(B.DashboardVendor);
		var vendorcodes = "";
		for (var i in B.DashboardVendor.Codes)
		{
			vendorcodes += i + "@" + (B.DashboardVendor.Codes[i])[weekdaylocation] + " ";
		}
		vendorcodes += "- " + vendorname;
		$("#dsbVendor").empty().append("<div><kbd id='dsbVendorHeader' class='curToggle' "
			+  "title='<dfn>Updated:</dfn> " + B.DashboardVendor.Start.toLocaleString(window.navigator.language, {
					year: "numeric", month: "numeric", day: "numeric", hour: "numeric", weekday: "long" })
				+ "'><img src='img/map/vendor_karma.png' /> "
			+ "<u>" + vendorname + "</u>"
			+ "<img id='dsbVendorToggleIcon' src='img/ui/toggle.png' /></kbd>"
			+ "<a" + U.convertExternalAnchor("http://wiki.guildwars2.com/wiki/Pact_Supply_Network_Agent")
				+ "title='Items restock at daily reset.<br />Vendors relocate 8 hours after that.<br />Limit 1 purchase per vendor.'>Info</a> "
			+ "<u class='curZoom' id='dsbVendorDraw'>" + D.getPhrase("draw route", U.CaseEnum.Sentence) + "</u>"
			+ "&nbsp;<input id='dsbVendorCodes' class='cssInputText' type='text' value='" + vendorcodes + "' /> "
		+ "</div><div id='dsbVendorTable' class='jsScrollable'></div>");

		// Bind buttons
		I.preventPropagation("#dsbVendorCodes").click(function()
		{
			$(this).select();
		});
		$("#dsbVendorHeader").click(function()
		{
			B.generateDashboardVendor();
		});
		$("#dsbVendorDraw").click(function()
		{
			if ($(this).data("hasDrawn") !== true)
			{
				var coords = [];
				for (var i in B.DashboardVendor.Coords)
				{
					var coord = (B.DashboardVendor.Coords[i])[weekdaylocation];
					if (coord !== undefined)
					{
						coords.push(coord);
					}
				}
				M.redrawPersonalPath(P.getGreedyPath(coords), "default");
				$(this).data("hasDrawn", true);
			}
			else
			{
				M.clearPersonalPins();
				$(this).data("hasDrawn", false);
			}
		});
		I.toggleToggleIcon("#dsbVendorToggleIcon", B.DashboardSale.isPreshown);
	},
	
	/*
	 * Generates the vendor offered.
	 */
	generateDashboardVendor: function()
	{
		var animationspeed = 200;
		var weekdaylocation = B.getDashboardVendorWeekday();
		var table = $("#dsbVendorTable");
		var numoffers = O.getObjectLength(B.DashboardVendor.Offers);
		
		if (table.is(":empty") === false)
		{
			I.toggleToggleIcon("#dsbVendorToggleIcon", false);
			table.animate({height: 0}, animationspeed, function()
			{
				$(this).css({height: "auto"}).empty();
			});
		}
		else
		{
			I.toggleToggleIcon("#dsbVendorToggleIcon", true);
			table.empty();
			table.append(I.cThrobber);
			for (var i in B.DashboardVendor.Offers)
			{
				(function(iIndex)
				{
					var offer = B.DashboardVendor.Offers[iIndex];
					$.getJSON(U.URL_API.ItemDetails + offer.id + U.URL_API.LangKey, function(pData)
					{
						var wikiquery = (D.isLanguageDefault()) ? pData.name : offer.id;
						table.append("<div class='dsbVendorEntry'>"
							+ "<a" + U.convertExternalAnchor(U.getWikiSearchLink(wikiquery)) + "><img class='dsbVendorIcon' src='" + pData.icon + "' /></a> "
							+ "<span id='dsbVendorItem_" + iIndex + "' class='dsbVendorItem curZoom " + E.getRarityClass(pData.rarity)
								+ "' data-coord='" + (B.DashboardVendor.Coords[iIndex])[weekdaylocation] + "'>" + pData.name + "</span> "
							+ "<span class='dsbVendorPriceKarma'>" + E.createKarmaString(offer.price) + "</span>"
							+ "<span class='dsbVendorPriceCoin' id='dsbVendorPriceCoin_" + iIndex + "'></span>"
						+ "</div>");
						// Get TP prices also
						$.getJSON(U.URL_API.ItemPrices + offer.id, function(pData)
						{
							$("#dsbVendorPriceCoin_" + iIndex).html(" ≈ " + E.createCoinString(E.deductTax(pData.sells.unit_price), true));
						}).fail(function()
						{
							$("#dsbVendorPriceCoin_" + iIndex).html(" = " + E.createCoinString(0, true));
						});
						M.bindMapLinkBehavior($("#dsbVendorItem_" + iIndex), M.ZoomEnum.Ground, M.Pin.Program);
					}).done(function()
					{
						// Finalize the table after every offer has been added
						if ($(".dsbVendorEntry").length === numoffers)
						{
							finalizeVendorTable();
						}
					}).fail(function()
					{
						table.empty();
						I.write("Unable to retrieve item: <a" + U.convertExternalAnchor(U.getWikiSearchLink(offer.id)) + ">"
							+ offer.id + "</a>. ArenaNet API servers may be down.", 0);
					});
				})(i);
			}
		}
		
		var finalizeVendorTable = function()
		{
			$(".dsbVendorItem").each(function()
			{
				M.bindMapLinkBehavior($(this));
			});
			var height = table.height();
			table.css({height: 0}).animate({height: height}, animationspeed, function()
			{
				$(this).css({height: "auto"});
				I.initializeScrollbar("#dsbVendorTable");
				I.updateScrollbar("#dsbVendorTable");
			});
			if (T.isTimely(B.DashboardVendor, new Date()) === false)
			{
				$("#dsbVendorTable").prepend("Note: These items have expired.");
			}
			I.removeThrobber(table);
		};
	},
	getDashboardVendorWeekday: function()
	{
		var now = new Date();
		var weekday = now.getUTCDay();
		var hour = now.getUTCHours();
		return (hour < B.DashboardVendor.resetHour) ? T.wrapInteger(weekday - 1, T.cDAYS_IN_WEEK) : weekday;
	},
	
	/*
	 * Updates the countdown time in each countdown entries.
	 * Called by the clock tick function every 1 second.
	 * @param Date pDate for getting time.
	 */
	updateDashboardCountdown: function(pDate)
	{
		for (var i in B.DashboardCountdown)
		{
			var ctd = B.DashboardCountdown[i];
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
		var hour = pDate.getUTCHours();
		var minute = pDate.getUTCMinutes();
		
		// Update countdown text elements, or deactivate a countdown entry if expired
		for (var i in B.DashboardCountdown)
		{
			var ctd = B.DashboardCountdown[i];
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
					arrow = I.Symbol.ArrowUp + "@";
					stamp = ctd.StartStamp;
				}
				else if (pDate < ctd.Finish)
				{
					ctd.DesiredTime = ctd.Finish;
					bulletclass = "dsbCountdownActive";
					arrow = I.Symbol.ArrowDown + "@";
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
					countdownhtml.find("abbr").text(arrow);
					countdownhtml.find("var").text(stamp);
				}
			}
		}
		
		// Deactivate outdated Living Story
		if (T.isTimely(B.DashboardStory, pDate) === false)
		{
			B.isDashboardStoryEnabled = false;
			$("#dsbStory").hide();
		}
		
		// Deactivate outdated sale
		if (T.isTimely(B.DashboardSale, pDate) === false)
		{
			B.isDashboardSaleEnabled = false;
			$("#dsbSale").hide();
		}
		
		// Refresh vendor header at its specific time
		if (T.isTimely(B.DashboardVendor, pDate)
			&& hour === B.DashboardVendor.resetHour && minute === 0)
		{
			B.generateDashboardVendorHeader();
		}
	},
	
	/*
	 * Shows or hides the dashboard.
	 * @param boolean pBoolean.
	 */
	toggleDashboard: function(pBoolean)
	{
		if (pBoolean === undefined)
		{
			pBoolean = !($("#itemDashboard").is(":visible"));
		}
		if (O.Options.bol_showDashboard && B.isDashboardEnabled)
		{
			if (pBoolean)
			{
				$("#itemDashboard").show().css({opacity: 0}).animate({opacity: 1}, 200);
			}
			else
			{
				$("#itemDashboard").hide();
			}
		}
	},
	
	/*
	 * Generates the timeline HTML.
	 */
	generateTimeline: function()
	{
		B.isTimelineGenerated = true;
		// Container for all the timelines
		$("#itemTimeline").show()
		var container = $("#tmlContainer").append("<div class='tmlLine curToggle' id='tmlLegend'></div>");
		B.updateTimelineLegend();
		$("#tmlLegend").click(function()
		{
			$("#opt_bol_use24Hour").trigger("click");
		});
		// Create timings header
		for (var i in B.Timeline)
		{
			var chain = B.Timeline[i];
			var name = (chain.zone === undefined) ? D.getObjectName(chain) : U.escapeHTML(M.getZoneName(chain.zone));
			// Container for segments of a timeline (chain)
			var line = $("<div class='tmlLine' title='<dfn>" + name + "</dfn>'></div>").appendTo(container);
			for (var ii in chain.Segments)
			{
				// Segments of a timeline (event)
				var event = chain.Segments[ii];
				var segmentprefix = "";
				switch (event.primacy)
				{
					case C.EventPrimacyEnum.Normal: segmentprefix = I.Symbol.Ellipsis; break;
					case C.EventPrimacyEnum.Boss: segmentprefix = I.Symbol.Star + " "; break;
				}
				var linename = (parseInt(ii) === 0) ? ("<b class='tmlLineName'>" + name + "</b>") : "";
				event.duration = T.parseChainTime(event.duration);
				event.time = T.parseChainTime(event.time);
				var width = (event.duration / T.cMINUTES_IN_2_HOURS) * T.cPERCENT_100;
				line.append("<div class='tmlSegment' style='width:" + width + "%' data-start='" + event.time + "' data-finish='" + (event.time + event.duration)
					+ "'><div class='tmlSegmentContent'>" + linename + "<span class='tmlSegmentName'>" + segmentprefix + D.getObjectName(event)
					+ "</span><span class='tmlSegmentCountdown'></span></div></div>");
			}
		}
		// Bind window buttons
		$("#tmlToggle").click(function()
		{
			$("#tmlContainer").toggle("fast");
		});
		$("#tmlDelete").click(function()
		{
			$("#opt_bol_showTimeline").prop("checked", false).trigger("change");
			B.toggleTimeline(false);
			B.isTimelineEnabled = false;
		});
		$("#tmlOpaque").click(function()
		{
			$("#opt_bol_opaqueTimeline").trigger("click");
		});
		// Initialize
		I.qTip.init(".tmlLine");
		B.updateTimelineSegments();
		B.updateTimelineIndicator();
	},
	
	/*
	 * Moves the "minute hand" and updates countdowns. Should be called every 1 minute.
	 */
	updateTimelineIndicator: function()
	{
		if (!B.isTimelineGenerated)
		{
			return;
		}
		var currentminute = T.getCurrentBihourlyMinutesUTC();
		var offset = (currentminute / T.cMINUTES_IN_2_HOURS) * T.cPERCENT_100;
		$("#tmlIndicator").css({left: offset + "%"});
		$(".tmlLineName").css({left: offset + "%"});
		// Update the countdowns next to the segment names
		$(".tmlSegment").each(function()
		{
			var countdown = $(this).find(".tmlSegmentCountdown");
			if ($(this).hasClass("tmlSegmentActive"))
			{
				// If active then show time remaining
				countdown.html(I.Symbol.ArrowUp + T.formatMinutes($(this).data("finish") - currentminute));
			}
			else
			{
				// If inactive then show time until
				countdown.html(I.Symbol.ArrowDown + T.formatMinutes(T.wrapInteger(($(this).data("start") - currentminute), T.cMINUTES_IN_2_HOURS)));
			}
		});
	},
	
	/*
	 * Highlights the active segments. Should be called every 5 minutes.
	 */
	updateTimelineSegments: function()
	{
		if (!B.isTimelineGenerated)
		{
			return;
		}
		var currentminute = T.getCurrentBihourlyMinutesUTC();
		$(".tmlSegment").each(function()
		{
			if (currentminute >= $(this).data("start") && currentminute < $(this).data("finish"))
			{
				if (!$(this).hasClass("tmlSegmentActive"))
				{
					$(this).css({opacity: 0}).animate({opacity: 1}, 1000);
					$(this).addClass("tmlSegmentActive");
				}
			}
			else
			{
				$(this).removeClass("tmlSegmentActive");
			}
		});
		// Refresh the legend if approached new bihour
		if (currentminute === 0)
		{
			B.updateTimelineLegend();
		}
		else
		{
			// Update the timestamp just behind the indicator with future time
			var timestampminute = currentminute - T.cMINUTES_IN_MINIFRAME;
			$("#tmlSegmentTimestamp_" + timestampminute)
				.html(T.getCurrentBihourlyTimestampLocal(timestampminute + T.cMINUTES_IN_2_HOURS))
				.addClass("tmlSegmentTimestampFutureFar")
				.parent().css({opacity: 0}).animate({opacity: 1}, 1000);
		}
	},
	
	/*
	 * Fills the legend line with timestamps. Should be called every 120 minutes.
	 */
	updateTimelineLegend: function()
	{
		if (!B.isTimelineGenerated)
		{
			return;
		}
		var currentminute = T.getCurrentBihourlyMinutesUTC();
		var line = $("#tmlLegend").empty();
		var divisions = T.cMINUTES_IN_2_HOURS / T.cMINUTES_IN_MINIFRAME;
		var half = divisions / 2;
		var ithminute, timestamp;
		for (var i = 0; i < divisions; i++)
		{
			var width = T.cPERCENT_100 / divisions;
			var hourclass = (i === 0 || i === half) ? "tmlSegmentTimestampHour" : "";
			var tenseclass = "";
			ithminute = T.cMINUTES_IN_MINIFRAME * i;
			if (ithminute < currentminute - T.cMINUTES_IN_MINIFRAME)
			{
				// Timestamps behind the current minute indicator becomes two hours ahead
				timestamp = T.getCurrentBihourlyTimestampLocal(ithminute + T.cMINUTES_IN_2_HOURS);
				tenseclass = "tmlSegmentTimestampFutureFar";
			}
			else
			{
				timestamp = T.getCurrentBihourlyTimestampLocal(ithminute);
			}
			line.append("<div class='tmlSegment' style='width:" + width + "%'><div class='tmlSegmentContent'>"
				+ "<span id='tmlSegmentTimestamp_" + ithminute + "' class='tmlSegmentTimestamp " + hourclass + " " + tenseclass + "'>" + timestamp + "</span></div></div>");
		}
	},
	
	/*
	 * Shows or hides the timeline.
	 * @param boolean pBoolean.
	 */
	toggleTimeline: function(pBoolean)
	{
		if (pBoolean === undefined)
		{
			pBoolean = !($("#itemTimeline").is(":visible"));
		}
		if (O.Options.bol_showTimeline && B.isTimelineEnabled)
		{
			if (pBoolean)
			{
				$("#itemTimeline").show().css({opacity: 0}).animate({opacity: 1}, 200);
			}
			else
			{
				$("#itemTimeline").hide();
			}
		}
		else if (O.Options.bol_showTimeline === false)
		{
			$("#itemTimeline").hide();
		}
	}
};

/* =============================================================================
 * @@Klock analog and by-the-second and frame refreshes
 * ========================================================================== */
K = {
	
	tickerFrequency: 250, // Must be a divisor of 1000 milliseconds
	tickerSecondPrevious: null,
	stopwatchFrequency: 50,
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
	paneSizePrevious: 0,
	
	// Clock DOM elements
	handSecond: {}, handMinute: {}, handHour: {},
	clockBackground: {}, clockCircumference: {}, timeProgress0: {}, timeProgress1: {},
	timeDaylight: {}, timeLocal: {}, timeDaytime: {}, timeSimple: {}, timeMap: {}, timeWvW: {}, timeLog: {}, countdownWvW: {},
	timestampUTC: {}, timestampLocal: {}, timestampServer: {}, timestampReset: {},
	stopwatchUp: {}, stopwatchDown: {},
	
	// These will be DOM elements
	WpChain0: {}, WpChain1: {}, WpChain2: {}, WpChain3: {},
	// These will be jQuery "elements"
	IconSD0: {}, IconSD1: {}, IconSD2: {}, IconSD3: {},
	IconHC0: {}, IconHC1: {}, IconHC2: {}, IconHC3: {},
	IconsStandard: [],
	IconsHardcore: [],
	lsClipboards: [],
	cClipboardAttribute: "data-clipboard-text",
	cClipboardSuccessText: "Chat link copied to clipboard :)<br />",
	TickerTimeout: {},
	
	// Stopwatch properties
	StopwatchTimeout: {},
	StopwatchTimestamp: 0,
	StopwatchTimesleep: 0,
	isStopwatchPaused: false,
	StopwatchTimerStart: 0,
	StopwatchTimerFinish: 0,
	
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
		K.timeProgress0 = $("#chnProgress0")[0];
		K.timeProgress1 = $("#chnProgress1")[0];
		K.timeLocal = $("#itemTimeLocalActual")[0];
		K.timeDaytime = $("#itemTimeDayTime")[0];
		K.timeSimple = $("#itemSimpleTime")[0];
		K.timeMap = $("#mapTime")[0];
		K.timeWvW = $("#wvwTime")[0];
		K.timeLog = $("#logTime")[0];
		K.countdownWvW = $("#lboCountdown")[0];
		K.timestampUTC = $("#optTimestampUTC")[0];
		K.timestampLocal = $("#optTimestampLocalReset")[0];
		K.timestampServer = $("#optTimestampServerReset")[0];
		K.timestampReset = $("#optTimeTillReset")[0];
		K.stopwatchUp = $("#watUp")[0];
		K.stopwatchDown = $("#watDown")[0];
		
		B.initializeDashboard();
		K.updateTimeFrame(new Date()); // This also calls the server reset check function
		T.getDaily();
		K.updateDaytimeIcon();
		K.tickFrequent();
		K.updateDigitalClockMinutely();
		K.initializeClipboard();
		//K.refreshFestival();
		
		// Other clickable elements
		$("#itemTimeLocalActual").click(function()
		{
			$("#opt_bol_use24Hour").trigger("click");
		});
		
		// Toggle clock pane shortcut button
		$("#clkToggle").click(function()
		{
			if (O.Options.int_setClock !== O.IntEnum.Clock.None)
			{
				K.paneSizePrevious = O.Options.int_setClock;
				X.setFieldsetState("int_setClock", O.IntEnum.Clock.None);
			}
			else
			{
				X.setFieldsetState("int_setClock", K.paneSizePrevious);
			}
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
			$("#paneClock, #paneClockWall, #paneClockBackground, #paneClockIcons, #paneClockCanvas")
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
					// Coordinates of the final event in the chain
					var event = C.Chains[$(this).data(C.cIndexSynonym)].primaryEvents;
					coord = event[(event.length-1)].path[0];
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
			K.timeProgress0.style.background = "linear-gradient(to right, black 0%, " + pColor + " 100%)";
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
		var localtime = T.getTimeFormatted();
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
		var percent = (T.cPERCENT_100 * opacityadd);
		K.timeProgress0.style.width = percent + "%";
		K.timeProgress1.style.width = (100 - percent) + "%";
		
		/*
		 * If crossing a 15 minute mark (IMPORTANT).
		 */
		if (min % T.cMINUTES_IN_TIMEFRAME === 0 && sec === 0)
		{
			if (O.Options.int_setDimming === 0
				&& I.ModeCurrent !== I.ModeEnum.Simple)
			{
				$(K.clockBackground).fadeTo(800, 1);
			}
			$(K.timeProgress0).css({width: "0%"}).animate({width: "100%"}, 800);
			$(K.timeProgress1).css({width: "100%"}).animate({width: "0%"}, 800);
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
		
		if (sec === 0)
		{
			/*
			 * If crossing a 5 minute mark.
			 */
			if (min % T.cMINUTES_IN_MINIFRAME === 0)
			{
				K.updateDaytimeIcon();
				K.updateDryTopClipboard();
				B.updateTimelineSegments();
				if (B.isDashboardEnabled)
				{
					B.refreshDashboard(pDate);
				}
			}
			
			/*
			 * If crossing a 1 minute mark.
			 */
			//K.refreshFestival();
			K.updateDigitalClockMinutely();
			B.updateTimelineIndicator();
			// Refresh the chain time countdown opted
			C.updateChainsTimeHTML();
			K.updateWaypointsClipboard();
			
			// Alert subscribed chain
			if (O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription)
			{
				K.doSubscribedSpeech(O.Options.int_alertSubscribedFirst);
				K.doSubscribedSpeech(O.Options.int_alertSubscribedSecond);
			}
		}
		
		// Mode dependent repeated functions
		switch (I.ModeCurrent)
		{
			case I.ModeEnum.Simple:
			{
				// Tick the two digital clocks below the analog clock
				K.timeSimple.innerHTML =
				T.getTimeFormatted(
				{
					want24: true,
					wantHours: false,
					wantLetters: true,
					customTimeInSeconds: T.cSECONDS_IN_TIMEFRAME - T.getCurrentTimeframeElapsedTime()
				});
			} break;
			
			case I.ModeEnum.Overlay:
			{
				P.switchMapCheck();
			} break; 
		}
		
		K.timeLocal.innerHTML = localtime;
		// Times in the Options page Debug section
		K.timestampUTC.innerHTML = T.TIMESTAMP_UNIX_SECONDS;
		K.timestampLocal.innerHTML = O.Utilities.lastLocalResetTimestamp.value;
		K.timestampServer.innerHTML = T.TIMESTAMP_UNIX_SECONDS + T.SECONDS_TILL_RESET;
		K.timestampReset.innerHTML = T.getTimeFormatted(
		{
			customTimeInSeconds: T.SECONDS_TILL_RESET,
			want24: true
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
		if (B.isDashboardCountdownTickEnabled)
		{
			B.updateDashboardCountdown(pDate);
		}
		if (K.StopwatchTimerStart !== 0)
		{
			K.tickStopwatchDown();
		}
		if (W.isObjectiveTimerTickEnabled)
		{
			K.timeLog.innerHTML = localtime;
			W.updateObjectiveTimers();
			if (W.MatchFinishTime !== null)
			{
				K.countdownWvW.innerHTML = T.formatSeconds(W.secTillWvWReset--, true);
			}
			if (sec === 0)
			{
				W.updateAllObjectiveAge();
			}
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
			var wantms = false;
			var speechwb = "";
			var speechms = "";

			// If alarm minutes is beyond the timeframe range, check the chains beyond
			if (pMinutes > T.cMINUTES_IN_TIMEFRAME)
			{
				chainsd = C.NextChainSD2;
				chainhc = C.NextChainHC2;
				chainls = C.NextChainLS2;
				minutestill += T.cMINUTES_IN_TIMEFRAME;
			}
			
			if (pMinutes === minutestill)
			{
				// Make sure the chain is not null/undefined (if it does not exist in the time slot)
				var conjunction = " " + D.getSpeechWord("and") + " ";
				var timephrase = " " + D.getSpeechWord("will start") + D.getPluralTime(minutestill, "minute");
				
				speechwb = D.getSpeechWord(D.orderModifier(D.orderModifier("boss", "world"), "subscribed")) + " ";
				wantsd = O.objToBool(chainsd) && (C.isChainSubscribed(chainsd) && C.isChainUnchecked(chainsd));
				wanthc = O.objToBool(chainhc) && (C.isChainSubscribed(chainhc) && C.isChainUnchecked(chainhc));
				wantls = O.objToBool(chainls) && (C.isChainSubscribed(chainls) && C.isChainUnchecked(chainls));
				
				if (wantsd || wanthc)
				{
					if (wantsd && wanthc)
					{
						speechwb += D.getChainPronunciation(chainsd) + conjunction + D.getChainPronunciation(chainhc);
					}
					else if (wantsd)
					{
						speechwb += D.getChainPronunciation(chainsd);
					}
					else if (wanthc)
					{
						speechwb += D.getChainPronunciation(chainhc);
					}
					D.speak(speechwb);
					D.speak(timephrase);
				}

				// Miscellaneous chains can happen simultaneously in a timeframe
				var chainms;
				var chainsms = (pMinutes > T.cMINUTES_IN_TIMEFRAME) ? C.NextChainsMS2 : C.NextChainsMS1;
				if (chainsms.length > 0)
				{
					speechms = D.getSpeechWord("event", "subscribed") + " ";
					for (var i = 0; i < chainsms.length; i++)
					{
						chainms = chainsms[i];
						if (O.objToBool(chainms) && (C.isChainSubscribed(chainms) && C.isChainUnchecked(chainms)))
						{
							speechms += D.getChainPronunciation(chainms);
							// Append a conjunction between names
							if (i+1 < chainsms.length && chainsms.length > 1)
							{
								speechms += conjunction;
							}
							wantms = true;
						}
					}
					if (wantms)
					{
						speechms += timephrase;
						D.speak(speechms);
					}
				}

				// Living Story chain
				if (B.isDashboardStoryEnabled && wantls)
				{
					D.speak(D.getSpeechWord("event", "subscribed") + " " + D.getChainPronunciation(chainls));
					D.speak(timephrase);
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
		
		if (B.isDashboardStoryEnabled)
		{
			// These are for subscription alarm reference
			C.NextChainLS1 = T.getLivingStoryChain(1);
			C.NextChainLS2 = T.getLivingStoryChain(2);
		}
		C.NextChainsMS1 = T.getMiscellaneousChains(1);
		C.NextChainsMS2 = T.getMiscellaneousChains(2);
		
		C.PreviousChains2 = T.getTimeframeChains(-2);
		C.PreviousChains1 = T.getTimeframeChains(-1);
		C.CurrentChains = T.getTimeframeChains();
		C.NextChains1 = T.getTimeframeChains(1);
		
		// Sort the chains list
		C.sortChainsListHTML();
		
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
			var checked = ", " + D.getSpeechWord("checked");
			var checkedcurrentsd = "";
			var checkednextsd = "";
			var checkedcurrenthc = "";
			var checkednexthc = "";
			var wantcurrentsd = O.objToBool(C.CurrentChainSD);
			var wantcurrenthc = O.objToBool(C.CurrentChainHC);
			var wantnextsd = O.objToBool(C.NextChainSD1);
			var wantnexthc = O.objToBool(C.NextChainHC1);
			var speech = D.getSpeechWord("world boss", "current") + " " + D.getSpeechWord("is") + " ";
			
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
				D.speak(D.getSpeechWord("and") + ", " + D.getChainPronunciation(C.CurrentChainHC) + checkedcurrenthc, 4);
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
					D.speak(D.getSpeechWord("then") + ", " + D.getChainPronunciation(C.NextChainSD1) + checkednextsd, 4);
					D.speak(D.getSpeechWord("and") + ", " + D.getChainPronunciation(C.NextChainHC1) + checkednexthc, 4);
				}
				else if (wantnextsd)
				{
					D.speak(D.getSpeechWord("then") + ", " + D.getChainPronunciation(C.NextChainSD1) + checkednextsd, 4);
				}
				else if (wantnexthc)
				{
					D.speak(D.getSpeechWord("then") + ", " + D.getChainPronunciation(C.NextChainHC1) + checkednexthc, 4);
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
			
			C.refreshChainDailyIcon();
			
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
	 * Initializes the array containing Clipboard objects.
	 * Each clock waypoint icon (4 img tags) will have the data attribute set to
	 * a waypoint text by the time updater.
	 */
	initializeClipboard: function()
	{
		for (var i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
		{
			I.initializeClipboard("#clkWaypoint" + i);
		}
		
		if (C.DryTopChains.length > 0)
		{
			for (var i = 0; i < 2; i++)
			{
				I.initializeClipboard("#chnDryTopWaypoint" + i);
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
		var maptime = T.getTimeFormatted({wantSeconds: false}) + " " + K.currentDaytimeSymbol + daytime;
		// Clock on the map shown in overlay mode
		K.timeMap.innerHTML = maptime;
		K.timeWvW.innerHTML = maptime;
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
			var ignoredchain = C.getChainByAlias("triplewurm");
			
			// Chains for the clicked timeframe
			text += pChainSD.waypoint + " " + D.getChainAlias(pChainSD);
			// If hardcore chain doesn't exist or is Triple Wurm
			if ( ! pChainHC || pChainHC.nexus === ignoredchain.nexus)
			{
				text += T.getTimeTillChainFormatted(pChainSD);
			}
			else if (pChainHC.nexus !== ignoredchain.nexus)
			{
				text += " " + D.getTranslation("and") + " " + pChainHC.waypoint
					+ " " + D.getChainAlias(pChainHC)
					+ T.getTimeTillChainFormatted(pChainHC);
			}
			
			// Chains for the timeframe after that
			text += ", " + D.getTranslation("then") + " " + pChainSDAfter.waypoint
				+ " " + D.getChainAlias(pChainSDAfter);
			if ( ! pChainHCAfter || pChainHCAfter.nexus === ignoredchain.nexus)
			{
				text += T.getTimeTillChainFormatted(pChainSDAfter);
			}
			else if (pChainHCAfter.nexus !== ignoredchain.nexus)
			{
				text += " " + D.getTranslation("and") + " " + pChainHCAfter.waypoint
					+ " " + D.getChainAlias(pChainHCAfter)
					+ T.getTimeTillChainFormatted(pChainHCAfter);
			}
			
			text = text + I.siteTagCurrent;
			pWaypoint.attr(K.cClipboardAttribute, text);
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
				.setAttribute(K.cClipboardAttribute, s0);
			document.getElementById("chnDryTopWaypoint1")
				.setAttribute(K.cClipboardAttribute, s1);
			$("#mapDryTopClip0").val(s0);
			$("#mapDryTopClip1").val(s1);
		}
	},
	
	initializeStopwatch: function()
	{
		// Bind toggle button on top of the digits
		$("#watToggle").click(function()
		{
			$("#itemStopwatch").toggle("fast");
		});
		
		// Start button acts as Start/Pause/Resume
		$("#watStart").click(function()
		{
			$("#watToggle").show();
			$("#itemStopwatch").show().css("font-size", O.Options.int_sizeStopwatchFont);
			var nowms = (new Date()).getTime();
			// Start the first time
			if (K.StopwatchTimestamp === 0)
			{
				K.StopwatchTimestamp = (new Date()).getTime();
				K.tickStopwatchUp();
			}
			// Resume after pause
			else if (K.isStopwatchPaused)
			{
				K.isStopwatchPaused = false;
				K.StopwatchTimestamp = K.StopwatchTimestamp + (nowms - K.StopwatchTimesleep);
				K.tickStopwatchUp();
			}
			// Pause
			else
			{
				window.clearTimeout(K.StopwatchTimeout);
				K.StopwatchTimesleep = nowms;
				K.isStopwatchPaused = true;
			}
		});
		
		// Stop button resets the countup
		$("#watStop").click(function()
		{
			if (K.StopwatchTimerStart === 0)
			{
				// Only the toggle button if the personal timer isn't running also
				$("#watToggle").hide();
			}
			window.clearTimeout(K.StopwatchTimeout);
			K.isStopwatchPaused = false;
			K.StopwatchTimestamp = 0;
			K.stopwatchUp.innerHTML = "";
		});
		
		// Lap button prints the current moment
		$("#watLap").click(function()
		{
			if (K.StopwatchTimestamp !== 0)
			{
				I.write(K.stopwatchUp.innerHTML, 0);
			}
			else
			{
				I.write("Stopwatch must be running to lap time.");
			}
		});
		
		// Personal timer
		$("#watTimerStart").click(function()
		{
			$("#watToggle").show();
			$("#itemStopwatch").show().css("font-size", O.Options.int_sizeStopwatchFont);
			K.StopwatchTimerStart = (new Date()).getTime();
			K.StopwatchTimerFinish = K.StopwatchTimerStart + (O.Options.int_minStopwatchAlert * T.cMILLISECONDS_IN_MINUTE);
			// Initial call to the update function
			K.tickStopwatchDown();
		});
		$("#watTimerStop").click(function()
		{
			if (K.StopwatchTimestamp === 0)
			{
				// Only the toggle button if the stopwatch isn't running also
				$("#watToggle").hide();
			}
			K.StopwatchTimerStart = 0;
			K.stopwatchDown.innerHTML = "";
		});
		$("#chnOptionsStopwatchDown input").click(function()
		{
			$(this).select();
		});
	},
	
	/*
	 * Updates the stopwatch countup.
	 */
	tickStopwatchUp: function()
	{
		var elapsedms = (new Date()).getTime() - K.StopwatchTimestamp;
		K.stopwatchUp.innerHTML = T.formatMilliseconds(elapsedms, true);
		K.StopwatchTimeout = setTimeout(function()
		{
			K.tickStopwatchUp();
		}, K.stopwatchFrequency);
	},
	
	/*
	 * Updates the personal countdown timer.
	 * To be called by the clock tick second function.
	 */
	tickStopwatchDown: function()
	{
		var msec = K.StopwatchTimerFinish - (new Date()).getTime();
		if (msec > 0)
		{
			K.stopwatchDown.innerHTML = T.getTimeFormatted({
				customTimeInSeconds: parseInt(msec / T.cMILLISECONDS_IN_SECOND),
				wantLetters: true
			});
		}
		else
		{
			// If negative then timer has finished
			$("#watTimerStop").trigger("click");
			var speech = O.Options.str_textStopwatchAlert;
			D.speak(speech);
		}
	},
	
	/*
	 * Festival decorative function.
	 */
	refreshFestival: function()
	{
		var numsnowflakes = 144;
		var canvas = document.getElementById("paneClockCanvas");
		var context = canvas.getContext("2d");
		// Erase previous snowflakes
		context.clearRect(0, 0, canvas.width, canvas.height);
		// Sprinkle new snowflakes
		var x, y;
		for (var i = 0; i < numsnowflakes; i++)
		{
			x = T.getRandomIntRange(0, canvas.width);
			y = T.getRandomIntRange(0, canvas.height);
			context.fillStyle = "rgba(255,255,255,255)";
			context.fillRect(x, y, 1, 1);
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
	cLevelMax: 80,
	cAJAXGlobalTimeout: 30000, // milliseconds
	cPNG: ".png", // Almost all used images are PNG
	cThrobber: "<div class='itemThrobber'><em></em></div>",
	cConsoleCommandPrefix: "/",
	cTextDelimiterChar: "|",
	cTextDelimiterRegex: /[|]/g,
	consoleTimeout: {},
	siteTagDefault: " - gw2timer.com",
	siteTagCurrent: " - gw2timer.com",
	Symbol:
	{
		ArrowUp: "⇑",
		ArrowDown: "⇓",
		TriUp: "▲",
		TriDown: "▼",
		TriRight: "►",
		TriLeft: "◄",
		Block: "■",
		Star: "☆",
		Ellipsis: "…",
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
	isTouchEnabled: false,
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
	PageInitial: "",
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
		Account: "Account",
		WvW: "WvW",
		DryTop: "DryTop"
	},
	// Section names must be unique, and may either be in sentence case or all caps
	SectionEnum:
	{
		Chains:
		{
			Scheduled: "Scheduled",
			DryTop: "DryTop",
			Legacy: "Legacy",
			Temple: "Temple",
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
			Schedules: "Schedules",
			Legacies: "Legacies",
			Temples: "Temples",
			Dungeons: "Dungeons"
		},
		Account:
		{
			Mananger: "Manager",
			Characters: "Characters",
			Bank: "Bank",
			Wardrobe: "Wardrobe",
			Trading: "Trading",
			PVP: "PVP",
			Guilds: "Guilds",
			Achievements: "Achievements"
		}
	},
	/*
	 * Number used to open a section's subcontent, written as 1-indexed via
	 * query string, but used as 0-indexed.
	 */
	SectionCurrent: {},
	ArticleCurrent: null,
	contentCurrentPlate: "", // This is cContentPrefix + contentCurrent
	isContentLoaded_Map: false,
	isContentLoaded_Help: false,
	isSectionLoaded_Daily: false,
	cHeaderPrefix: "#header",
	
	// User information
	BrowserCurrent: -1,
	BrowserEnum:
	{
		Unknown: -1,
		IE: 0,
		Opera: 1,
		Firefox: 2,
		Chrome: 3
	},
	// Screen width in pixels, for determining map zoom values
	ScreenWidth:
	{
		Huge: 2560,
		Large: 1024,
		Medium: 640
	},
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
		I.isTouchEnabled = typeof window.ontouchstart !== "undefined";
		
		// Get URL arguments and do appropriate changes
		U.enforceURLArgumentsFirst();
		I.enforceProgramMode();
		U.updateLanguageLinks();
		
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
		
		// Tailor the initial zoom for WvW so its map fits at least vertically
		if (screen.height >= 800)
		{
			O.Options.int_setInitialZoomWvW = 3;
		}
		else if (screen.height >= 480)
		{
			O.Options.int_setInitialZoomWvW = 4;
		}
		else
		{
			O.Options.int_setInitialZoomWvW = 5;
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
		}
		else if (useragent.indexOf("Firefox") !== -1)
		{
			I.BrowserCurrent = I.BrowserEnum.Firefox;
		}
		else if (useragent.indexOf("Opera") !== -1)
		{
			I.BrowserCurrent = I.BrowserEnum.Opera;
		}
		
		// Detect TTS capability
		try {
			if (window.speechSynthesis)
			{
				I.isSpeechSynthesisEnabled = true;
				// Automatically reload the asynchronous voices
				window.speechSynthesis.onvoiceschanged = function()
				{
					window.speechSynthesis.getVoices();
				};
			}
		}
		catch (e) {}
		
		// Set the maximum wait time for all non-custom AJAX requests, such as getJSON
		$.ajaxSetup({ timeout: I.cAJAXGlobalTimeout });
		
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
		I.bindWindowResize();
		I.initializeUIForMenu();
		I.initializeUIForHUD();
		I.styleContextMenu("#mapContext");
		// Bind switch map buttons
		$("#mapSwitchButton").one("click", function()
		{
			I.loadStylesheet("wvw");
			I.loadImg("#wvwHUDPane .mapHUDButton");
			$("#lboCurrent").append(I.cThrobber);
			/*
			 * WvW requires CSS to be loaded first before scripts execute.
			 * To know that the CSS has been loaded, a CSS property is checked,
			 * and this property must be changed here also if it was changed in
			 * the stylesheet.
			 */
			var waitForWvWStylesheet = setInterval(function()
			{
				if ($("#wvwLeaderboard").css("position") === "absolute")
				{
					window.clearInterval(waitForWvWStylesheet);
					$.getScript(U.URL_DATA.WvW).done(function()
					{
						W.initializeWvW();
					});
				}
			}, 100);
		}).click(function()
		{
			I.toggleMap(P.MapEnum.Mists);
		});
		$("#wvwSwitchButton").click(function()
		{
			I.toggleMap(P.MapEnum.Tyria);
		});
		// Bind account button
		$("#mapAccountButton, #wvwAccountButton").one("click", function()
		{
			if (A.isAccountInitialized === false)
			{
				I.loadStylesheet("account");
				$("#panelAccount").load(U.getPageSrc("account"), function()
				{
					$.getScript(U.URL_DATA.Account).done(function()
					{
						A.initializeAccount();
					});
				});
			}
		}).click(function()
		{
			I.toggleAccount();
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
		$("#cslToggle").click(function()
		{
			$("#cslContent").toggle("fast");
		});
		$(".mapHUDContainer").one("mouseenter", function()
		{
			$(this).find("img").each(function()
			{
				$(this).attr("src", $(this).attr("data-src"));
			});
		});
		// Initialize the elements in the chain options popup
		$("#chnOptions").one("mouseenter", function()
		{
			I.loadImg($(this));
			K.initializeStopwatch();
			$("#optAlarmSpeaker").click(function()
			{
				D.speak(D.getWord("alarm"));
			});
			$("#optMute").click(function()
			{
				D.stopSpeech();
			});
		});
		// Make all links to other sites open a new tab
		U.convertExternalLink(".linkExternal");
		
		// Cursors on these Leaflet elements cause slowdown in IE, only add them for other browsers
		if (I.BrowserCurrent !== I.BrowserEnum.IE)
		{
			$("head").append("<style>.leaflet-clickable{cursor: url('img/cursor/pointer.cur'), pointer;}</style>");
		}
		
		// Bind special popup elements that can be removed if user clicks anywhere not on it
		$(document).mouseup(function(iEvent)
		{
			$(".jsRemovable, .jsHidable").each(function()
			{
				if ( ! $(this).is(iEvent.target) && $(this).has(iEvent.target).length === 0)
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
			// The follow option will do the viewing instead
			M.goToDefault(O.Options.int_setInitialZoom);
		}
		// Set tile after viewing the coordinate so it downloads the tiles last
		if (I.isMapEnabled)
		{
			if (I.PageInitial === "wvw")
			{
				$("#wvwSwitchButton").one("click", function()
				{
					M.changeFloor(O.Options.int_setFloor);
				});
			}
			else
			{
				M.changeFloor(O.Options.int_setFloor);
			}
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
					
					// View the map at Dry Top if it is that chain list
					if ($(this).attr("id") === "sectionChains_Drytop")
					{
						M.goToZone("dry", M.ZoomEnum.Bird);
						I.PageCurrent = I.SpecialPageEnum.DryTop;
						U.updateTitle(I.SpecialPageEnum.DryTop);
						P.toggleDryTopIcons(true);
						$("#mapHUDBoxes").hide();
					}
					else
					{
						// Update current section variable, ignore if on Scheduled section of Chains page
						I.SectionCurrent[I.PageEnum.Chains] = (section === I.SectionEnum.Chains.Scheduled) ? "" : section;
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
						$("#mapHUDBoxes").show();
					}
					// Nullify current section variable
					I.SectionCurrent[I.PageEnum.Chains] = "";
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
			C.initializeUnscheduledChains(C.LegacyChains);
			I.readjustTile();
		});
		$("#headerChains_Temple").one("click", function()
		{
			C.initializeUnscheduledChains(C.TempleChains);
			I.readjustTile();
		});
		
		// Button to toggle the chain bar expand option
		$("#chnToggle").click(function()
		{
			$("#opt_bol_expandWB").trigger("click");
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
	 * @param float pSeconds to display the console with that string. 0 for infinite.
	 * @param boolean pClear to empty the console before printing.
	 * @pre If input was from an outside source it must be escaped first!
	 */
	write: function(pString, pSeconds, pClear)
	{
		$("#itemConsole").show();
		var content = $("#cslContent").show();
		var characterspersecond = 18;
		
		if (pString === undefined)
		{
			pString = "undefinedstring";
		}
		else if (pString === null)
		{
			pString = "nullstring";
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
		// Only queue to clear the console if seconds is not set as so
		if (pSeconds !== 0)
		{
			I.consoleTimeout = setTimeout(function()
			{
				content.css({opacity: 1}).animate({opacity: 0}, 600, function()
				{
					$(this).empty().css({opacity: 1});
					$("#itemConsole").hide();
				});
			}, pSeconds * T.cMILLISECONDS_IN_SECOND);
		}
	},
	greet: function(pString, pSeconds, pClear)
	{
		// For messages that are shown when the program has just loaded
		if (I.isProgramEmbedded === false && I.PageInitial !== "wvw")
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
	log: function(pString, pClear)
	{
		I.write(pString, 0, pClear);
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
	 * @param string pElement selector to scroll to.
	 * @param string pContainerOfElement selector container with the scroll bar.
	 * @param int or string pTime duration to animate.
	 */
	scrollToElement: function(pElement, pContainerOfElement, pTime)
	{
		pElement = $(pElement);
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
					pContainerOfElement = $(pContainerOfElement);
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
	 * Finds throbber elements (spinning icon used before AJAX content is loaded)
	 * and removes it.
	 * @param string pContainer selector.
	 */
	removeThrobber: function(pContainer)
	{
		$(pContainer).find(".itemThrobber").remove();
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
		for (var i = 0; i < pRequests.length; i++)
		{
			var r = pRequests[i];
			$(r.s).animate(r.p, {duration: pSpeed, queue: false});
		}
	},
	
	/*
	 * Toggles a standard arrowhead icon by rotating it.
	 * @param string pSelector of the element.
	 * @param boolean pBoolean true is open state, false is closed state.
	 */
	toggleToggleIcon: function(pSelector, pBoolean)
	{
		if (pBoolean)
		{
			$(pSelector).animate({rotation: 0}, 200);
		}
		else
		{
			$(pSelector).animate({rotation: -90}, 200);
		}
	},
	
	/*
	 * Shows and hides an element to create a blinking effect.
	 * @param string pSelector of the element.
	 * @param int pDuration in milliseconds.
	 * @param int pSpeed in milliseconds.
	 * @post Element is shown at the final frame.
	 */
	bloatElement: function(pSelector, pDuration, pSpeed)
	{
		var times = parseInt(pDuration / pSpeed);
		// Have to have even numbered times so show and hide equals
		times = (times % 2 === 0) ? times : times + 1;
		var isshown = true;
		for (var i = 0; i < times; i++)
		{
			if (isshown)
			{
				$(pSelector).hide(pSpeed);
			}
			else
			{
				$(pSelector).show(pSpeed);
			}
			isshown = !isshown;
		}
	},
	blinkElement: function(pSelector, pDuration, pSpeed)
	{
		var times = parseInt(pDuration / pSpeed);
		// Have to have even numbered times so show and hide equals
		times = (times % 2 === 0) ? times : times + 1;
		var isshown = true;
		var counter = 1;
		var elm = $(pSelector);
		
		var interval = setInterval(function()
		{
			if (isshown)
			{
				elm.css({visibility: "hidden"});
			}
			else
			{
				elm.css({visibility: "visibile"});
			}
			isshown = !isshown;
			if (counter === times)
			{
				clearInterval(interval);
			}
			counter++;
		}, pSpeed);
	},
	
	/*
	 * Colors the text of an element depending on its numeric value.
	 * @param jqobject pElement.
	 * @param int pValue to compare.
	 * @param int pLimit to compare.
	 */
	colorizeValue: function(pElement, pValue, pLimit)
	{
		var elm = $(pElement);
		elm.removeClass("cssLimitEqual cssLimitWithin cssLimitExceed");
		var cssclass;
		
		if (pLimit === undefined)
		{
			cssclass = (pValue > 0) ? "cssLimitWithin" : ((pValue < 0) ? "cssLimitExceed" : "cssLimitEqual");
		}
		else
		{
			cssclass = (pValue <= pLimit) ? "cssLimitWithin" : "cssLimitExceed";
		}
		elm.addClass(cssclass);
		return elm;
	},
	
	/*
	 * Toggles a generic highlight class to an element.
	 * @param jqobject pElement to toggle.
	 * @param boolean pBoolean manual.
	 * @returns boolean new highlight state.b
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
			if ($(this).hasClass("jsIgnore") === false)
			{
				// If it is a menu item
				if ($(this).hasClass("itemContextSubmenu") === false)
				{
					if (O.Options.enu_Language !== O.OptionEnum.Language.Default)
					{
						$(this).text(D.getPhraseOriginal($(this).text()));
					}
				}
				// If it is a label for a submenu
				else
				{
					var label = $(this).find("> span");
					label.html(D.getPhraseOriginal(label.text())).append(" <kbd>" + I.Symbol.TriRight + "</kbd>");
				}
				// Add bullet point decoration
				$(this).prepend("<ins class='s16 s16_bullet'></ins> ");
			}
		});
	},
	
	/*
	 * Stops map DOM events from interfering with an element.
	 * @param string pSelector of elements to be protected.
	 */
	preventPropagation: function(pSelector)
	{
		return $(pSelector).each(function()
		{
			var elm = L.DomUtil.get($(this)[0]);
			if (!L.Browser.touch)
			{
				L.DomEvent.disableClickPropagation(elm);
				L.DomEvent.on(elm, "mousewheel", L.DomEvent.stopPropagation);
				L.DomEvent.on(elm, "contextmenu", L.DomEvent.stopPropagation);
			}
			else
			{
				L.DomEvent.on(elm, "click", L.DomEvent.stopPropagation);
			}
		});
	},
	
	/*
	 * Binds an element for clipboard behavior.
	 * @param string or DOM element pSelector for selecting the element.
	 * @returns object Clipboard.
	 */
	initializeClipboard: function(pSelector)
	{
		var cb = new Clipboard(pSelector);
		cb.on("success", function(pEvent)
		{
			I.write(K.cClipboardSuccessText + pEvent.text, 5);
		});
		return cb;
	},
	
	/*
	 * Initializes custom scroll bar for specified element using defined settings.
	 * Container requirements: position relative, overflow hidden.
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
					I.SectionCurrent[plate] = ""; // Nullify current section variable
					
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
					I.SectionCurrent[plate] = section;
					
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
					I.scrollToElement($(this), pPlate, "fast");
				}
			});
			
			// Opening the section the first time will load that section's img tags
			header.one("click", function()
			{
				I.loadImg($(this).next());
			});
			
			// Create and bind the additional bottom header to collapse the container
			$("<div class='curClick jsSectionDone'><img src='img/ui/close.png' />" + headertext + "</div>")
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
	 * Loads a stylesheet file from the default directory.
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
		var elms = (typeof pContainer === "string") ? $(pContainer) : pContainer.find("img");
		elms.each(function()
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
	 * Makes an element have a checkbox change appearance behavior, but does not
	 * actually write to any checklist.
	 * @param string pSelector to bind.
	 * @param float pOpacity when the element is checked.
	 */
	bindPseudoCheckbox: function(pSelector, pOpacity)
	{
		if (pOpacity === undefined)
		{
			pOpacity = 0.3;
		}
		$(pSelector).click(function()
		{
			if ($(this).data("checked") !== true)
			{
				$(this).css({opacity: pOpacity});
				$(this).data("checked", true);
			}
			else
			{
				$(this).css({opacity: 1});
				$(this).data("checked", false);
			}
		});
	},
	
	/*
	 * Menu event handlers and UI postchanges.
	 */
	initializeUIForMenu: function()
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
				if (P.MapCurrent === P.MapEnum.Mists)
				{
					I.PagePrevious = I.PageCurrent;
				}
				switch (I.PageCurrent)
				{
					case I.PageEnum.Chains:
					{
						if (O.Options.bol_hideHUD)
						{
							$("#mapHUDBoxes").show();
						}
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
				if (I.PageCurrent !== I.PageEnum.Chains && O.Options.bol_hideHUD)
				{
					$("#mapHUDBoxes").hide();
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
			case P.MapEnum.Tyria: {
				$("#wvwPane").hide();
				$("#mapPane").show();
				M.refreshMap();
				I.PageCurrent = I.PagePrevious;
				I.PagePrevious = I.SpecialPageEnum.WvW;
				P.MapCurrent = P.MapEnum.Tyria;
				P.SuffixCurrent = M.OptionSuffix;
			} break;
			
			case P.MapEnum.Mists: {
				$("#mapPane").hide();
				$("#wvwPane").show();
				if (W.isMapInitialized)
				{
					W.refreshMap();
				}
				I.PagePrevious = I.PageCurrent;
				I.PageCurrent = I.SpecialPageEnum.WvW;
				P.MapCurrent = P.MapEnum.Mists;
				P.SuffixCurrent = W.OptionSuffix;
			} break;
		}
		U.updateQueryString();
	},
	
	/*
	 * Shows or hides the account panel.
	 */
	toggleAccount: function()
	{
		var panel = $("#panelAccount");
		var content = $("#accContent");
		if (panel.is(":visible")) // Hide
		{
			content.hide();
			panel.css({width: "100%"}).animate({width: 0}, "fast", function()
			{
				$(this).hide();
				if (I.isMapEnabled && O.Options.bol_showMap)
				{
					$("#panelMap").show();
					switch (P.MapCurrent)
					{
						case P.MapEnum.Tyria: {
							$("#mapPane").show();
							M.refreshMap();
						} break;

						case P.MapEnum.Mists: {
							$("#wvwPane").show();
							if (W.isMapInitialized)
							{
								W.refreshMap();
							}
						} break;
					}
				}
			});
			I.PageCurrent = I.PagePrevious;
			I.PagePrevious = I.SpecialPageEnum.Account;
		}
		else // Show
		{
			panel.show().css({width: 0}).animate({width: "100%"}, "fast", function()
			{
				content.show();
				A.adjustAccountPanel();
			});
			I.PagePrevious = I.PageCurrent;
			I.PageCurrent = I.SpecialPageEnum.Account;
			$("#panelMap").hide();
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
				I.loadImg("#mapGPSButton");
			} break;
			case I.ModeEnum.Simple:
			{
				I.isMapEnabled = false;
				I.showHomeLink();
				// Readjust panels
				$("#itemTimeline").appendTo("#panelApp");
				I.readjustSimple();
			} break;
			case I.ModeEnum.Mobile:
			{
				I.isMapEnabled = false;
				I.isScrollEnabled = true;
				I.showHomeLink();
				$("head").append("<meta name='viewport' content='width=device-width, initial-scale=1' />")
					.append("<link rel='canonical' href='http://gw2timer.com' />");
			} break;
			case I.ModeEnum.Tile:
			{
				I.isMapEnabled = false;
				K.iconOpacityChecked = 0.2;
				I.showHomeLink();
				$("#itemLanguage").prependTo("#plateChains");
				// Show the timeline if the website is not embedded
				if (I.isProgramEmbedded)
				{
					// Less whitespace for embedded window
					$("<style type='text/css'>.chnBar, .chnSlot {margin-bottom:4px !important; margin-right: 4px !important;}</style>").appendTo("head");
				}
				else
				{
					var timelinemargintop = parseInt($("#chnProgressBar").css("margin-top"));
					$("#itemTimeline").prependTo("#panelApp");
					// Move the chain progress bar to the top of the screen if scrolled past the timeline
					$("#windowMain").scroll(function(){
						if ($("#itemTimeline").is(":visible"))
						{
							$("#chnProgressBar").css("margin-top", Math.max(
								-$("#itemTimeline").outerHeight(true) + timelinemargintop,
								-$("#windowMain").scrollTop())
							);
						}
						else
						{
							$("#chnProgressBar").css("margin-top", timelinemargintop);
						}
					});
				}
				I.initializeScrollbar("#windowMain");
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
			$(".mapHUDLinks").hide();
			B.isDashboardEnabled = false;
		}
		
		// Disable dashboard for non-using modes
		if (I.ModeCurrent !== I.ModeEnum.Website)
		{
			if (I.ModeCurrent !== I.ModeEnum.Overlay)
			{
				B.isDashboardEnabled = false;
			}
		}
	},
	
	/*
	 * Binds functions that activate when the user resizes the browser/screen/window.
	 */
	bindWindowResize: function()
	{
		$(window).on("resize", $.throttle(200, function()
		{
			/*
			 * Resize elements' CSS properties to be more legible in the current window size.
			 */
			switch (I.ModeCurrent)
			{
				case I.ModeEnum.Simple: I.readjustSimple(); break;
				case I.ModeEnum.Tile: I.readjustTile(); break;
			}
			/*
			 * Resize elements that may have overflowed when the user resized the browser.
			 */
			if (W.isWvWLoaded)
			{
				W.readjustLeaderboard();
				W.readjustLog();
			}
			if (A.isAccountInitialized)
			{
				A.adjustAccountPanel();
			}
		}));
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
		I.qTip.init("#chnOptions img, a, ins, kbd, span, time, fieldset, label, input, button");
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
			if (I.isTouchEnabled)
			{
				return;
			}
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
				if (I.posX + I.cTOOLTIP_ADD_OFFSET_X + tipwidth > winwidth)
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