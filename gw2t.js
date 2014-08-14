/*
	GW2Timer.com timer, map, and misc single-page application driver.
	jQuery-dependent (v1.11.0), with other plugins in plugins.js.
	Coded in NetBeans; debugged in Opera Dragonfly.
	IDE recommended for viewing and collapsing code sections.
	Version: see int_utlProgramVersion - 2014.04.18 created

	CREDITS:
	Vladimir Agafonkin - LeafletJS map library
	Ben Alman - jQuery throttle/debounce
	Stephen Chapman - DST detection
	Craig Erskine - qTip tooltip
	David Flanagan - SVG clock based on example from "JavaScript The Definitive Guide 6e"
	Jon Rohan, James M. Greene - ZeroClipboard
	Cliff Spradlin - GW2 API Documentation
	Google and TTS-API.COM - Text-To-Speech service

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
	X - Checklists
	D - Dictionary for translations
	C - Chains events
	M - Map Leaflet
	P - Populate map
	T - Time utilities and schedule
	K - Clock ticker
	U - URL management
	I - Interface UI

*/

$(window).on("load", function() {
	
/* =============================================================================
 *  Single letter objects serve as namespaces.
 * ========================================================================== */
var O, X, D, C, M, P, T, K, U, I = {};

/* =============================================================================
 * @@Options for the user
 * ========================================================================== */
O = {
	lengthOfPrefixes: 3,
	prefixOption: "opt_",
	legalLocalStorageKeys: new Array(),

	/*
	 * These utility variables will also be stored in localStorage.
	 * O.Utilities, O.Options, and X.Checklists share a namespace in localStorage
	 * and must together have unique variable names.
	 */
	Utilities:
	{
		programVersion: {key: "int_utlProgramVersion", value: 140812},
		lastLocalResetTimestamp: {key: "int_utlLastLocalResetTimestamp", value: 0}
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
		// Timer
		bol_hideChecked: false,
		bol_expandEvents: true,
		bol_useCountdown: true,
		int_setClock: 0,
		int_setDimming: 0,
		int_setPredictor: 0,
		// Map
		bol_tourPrediction: true,
		bol_showChainPaths: true,
		bol_showMap: true,
		bol_showWorldCompletion: false,
		bol_displaySectors: true,
		bol_displayWaypoints: true,
		bol_displayPOIs: true,
		bol_displayVistas: true,
		bol_displaySkills: true,
		bol_displayHearts: true,
		// Alarm
		bol_enableSound: false,
		bol_alertAtStart: true,
		bol_alertAtEnd: true,
		bol_alertChecked: true,
		bol_alertSubscribed: false,
		int_alertSubscribedFirst: 5,
		int_alertSubscribedSecond: 15,
		// Advanced
		bol_clearChainChecklistOnReset: true,
		bol_clearPersonalChecklistOnReset: true,
		bol_useSiteTag: true,
		bol_detectDST: true,
		bol_use24Hour: true
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
		var enumobject = O.OptionEnum[O.getVariableSuffix(pEnumName)];
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
	 * Extracts the name part from a variable, as in "bol_showMap" returns "showMap".
	 * @param string pVariable full name.
	 * @returns string option name.
	 * @pre Variable name has exactly one underscore character.
	 */
	getVariableSuffix: function(pVariable)
	{
		return pVariable.split("_")[1];
	},
	getVariablePrefix: function(pVariable)
	{
		return pVariable.split("_")[0];
	},
	
	/*
	 * Updates and notifies user of version change.
	 */
	enforceProgramVersion: function()
	{
		var currentversion = O.Utilities.programVersion.value;
		var usersversion = parseInt(localStorage[O.Utilities.programVersion.key]);
		// If not first visit and version is mismatch, notify new version
		if (isFinite(usersversion) && usersversion !== currentversion)
		{
			var wait = 20;
			if (I.ModeCurrent === I.ModeEnum.Overlay)
			{
				wait = 10;
			}
			I.clear();
			I.write(I.cSiteName + " was updated since your last visit.<br />"
				+ "This version: " + currentversion + "<br />"
				+ "Your version: " + usersversion + "<br />"
				+ "Would you like to see the <a class='urlUpdates' href='http://forum.renaka.com/topic/5500046/'>changes</a>?<br />"
				+ "<br />"
				+ "New in this version:<br />"
				+ "- Dry Top Challenger Cliffs events. Click the gold stars on the clock area to auto-copy chatlinks.<br />"
				+ "- Map completion icons. Hover over the compass button on the map to see map options.<br />"
				, wait);
			U.convertExternalLink(".urlUpdates");
		}
		
		localStorage[O.Utilities.programVersion.key] = O.Utilities.programVersion.value;
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
	 */
	checkResetTimestamp: function()
	{
		var yesterdaysserverresettime = T.getUNIXSeconds() - T.getTimeOffsetSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Seconds);
		
		// Local reset timestamp is outdated if it's before yesterday's server reset time
		if (O.Utilities.lastLocalResetTimestamp.value < yesterdaysserverresettime)
		{
			O.clearServerSensitiveOptions();
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
				variabletype = O.getVariablePrefix(optionkey);
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
				variabletype = O.getVariablePrefix(optionkey);
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
	},
	
	/*
	 * Unchecks the time sensitive checklists and clear variables, ignoring
	 * the disabled/deleted ones.
	 * by the user.
	 */
	clearServerSensitiveOptions: function()
	{
		var messagetime = 10;
		I.write("Daily Reset / Timestamp Expired!", messagetime);
		
		var i;
		if (O.Options.bol_clearChainChecklistOnReset)
		{
			var chain;
			for (i in C.Chains)
			{
				chain = C.Chains[i];
				$("#chnCheck_" + chain.nexus).removeClass("chnChecked");
				$("#barChain_" + chain.nexus).css({opacity: 1});
				if (X.getChecklistItem(X.Checklists.Chain, chain.nexus) !== X.ChecklistEnum.Disabled)
				{
					$("#barChain_" + chain.nexus).show();
				}
			}
			X.clearChecklist(X.Checklists.Chain, "uncheck");
		}
		
		if (O.Options.bol_clearPersonalChecklistOnReset)
		{
			
			if (I.isSectionLoadedMap_Personal === true)
			{
				$("#chlDungeonUncheck").trigger("click");
				$("#chlCustomUncheck").trigger("click");
			}
			else
			{
				X.clearChecklist(X.Checklists.Dungeon, "preuncheck");
				X.clearChecklist(X.Checklists.Custom, "preuncheck");
			}
		}
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
		// Leaflet map breaks when it is shown after being hidden, so have to reload
		$("#opt_bol_showMap").change(function()
		{
			if (O.Options.bol_showMap)
			{
				location.reload();
			}
		});
		// POIs are created on site load
		$("#opt_bol_showWorldCompletion").change(function()
		{
			if (O.Options.bol_showWorldCompletion === true
				&& M.isMappingIconsGenerated === false)
			{
				location.reload();
			}
			
			$("#mapOptionsDisplay label input").each(function()
			{
				X.setCheckboxEnumState($(this), X.boolToChecklistEnum(O.Options.bol_showWorldCompletion));
			});
		});
		// Trigger zone in and out of current zone to toggle the icon's display
		$("#mapOptionsDisplay label input").each(function()
		{
			$(this).change(function()
			{
				if (M.isAPIRetrieved_MAPFLOOR)
				{
					var currentcoord = M.ZoneCurrent.center;
					M.showCurrentZone(M.getZoneCenter("dry"));
					M.showCurrentZone(M.getZoneCenter("rata"));
					M.showCurrentZone(currentcoord);
				}
			});
		});
		/*
		 * Run some enactors when the site loads (because this an initializer function).
		 * Will have to place it elsewhere if it requires data to be loaded first.
		 */
		O.Enact.bol_hideChecked();
		O.Enact.bol_detectDST();
		O.Enact.bol_useSiteTag();
		if (I.ModeCurrent !== I.ModeEnum.Simple)
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
			for (var i in C.Chains)
			{
				chain = C.Chains[i];
				$("#chnCheck_" + chain.nexus).removeClass("chnChecked");
				$("#barChain_" + chain.nexus).show().css({opacity: 1});
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
			$("#menuChains").trigger("click");
		});
		
		/*
		 * Clears the browser storage.
		 */
		$("#optClearLocalStorage").click(function()
		{
			localStorage.clear();
			location.reload();
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
		bol_hideChecked: function()
		{
			$(".barChain").each(function()
			{
				if (X.getChecklistItem(X.Checklists.Chain, U.getSubintegerFromHTMLID($(this)))
					=== X.ChecklistEnum.Checked)
				{
					if (O.Options.bol_hideChecked)
					{
						$(this).hide();
					}
					else
					{
						$(this).show();
					}
				}
			});
		},
		bol_expandEvents: function()
		{
			for (var i in C.CurrentChains)
			{
				$("#chnDetails_" + C.CurrentChains[i].nexus).toggle(O.Options.bol_expandEvents);
			}
		},
		bol_use24Hour: function()
		{
			C.initializeTimetableHTML();
			C.updateChainsTimeHTML();
		},
		bol_detectDST: function()
		{
			T.DST_IN_EFFECT = (O.Options.bol_detectDST) ? 1 : 0;
		},
		int_setClock: function()
		{
			var animationspeed = 200;
			var clockpaneheight = 0;
			
			switch (O.Options.int_setClock)
			{
				case O.IntEnum.Clock.Compact:
				{
					$("#paneClock").show();
					$("#itemTimeLocal, #itemTimeServer, #itemLanguage, #itemSocial").show();
					// Reposition clock items
					I.bulkAnimate([
						{s: "#itemClock", p: {top: "0px", left: "70px", width: "220px", height: "220px"}},
						{s: "#paneClockFace", p: {width: "360px", height: "360px", top: "-70px", left: "0px"}},
						{s: "#paneClockIcons .iconSD", p: {"border-radius": "32px"}},
						{s: "#paneClockIcons .iconHC", p: {"border-radius": "24px"}},
						{s: "#itemClockIconSD0", p: {top: "4px", left: "290px"}},
						{s: "#itemClockIconSD1", p: {top: "148px", left: "290px"}},
						{s: "#itemClockIconSD2", p: {top: "148px", left: "4px"}},
						{s: "#itemClockIconSD3", p: {top: "4px", left: "4px"}},
						{s: "#itemClockIconHC0", p: {top: "52px", left: "306px"}},
						{s: "#itemClockIconHC1", p: {top: "132px", left: "306px"}},
						{s: "#itemClockIconHC2", p: {top: "132px", left: "20px"}},
						{s: "#itemClockIconHC3", p: {top: "52px", left: "20px"}},
						{s: "#itemClockWaypoint0", p: {top: "24px", left: "274px"}},
						{s: "#itemClockWaypoint1", p: {top: "164px", left: "274px"}},
						{s: "#itemClockWaypoint2", p: {top: "164px", left: "52px"}},
						{s: "#itemClockWaypoint3", p: {top: "24px", left: "52px"}},
						{s: "#itemClockStar0", p: {top: "-10px", left: "138px"}},
						{s: "#itemClockStar1", p: {top: "-10px", left: "190px"}}
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
					$("#itemTimeServer").css({
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
					$("#itemTimeLocal, #itemTimeServer, #itemLanguage, #itemSocial").show();
					// Reposition clock items
					I.bulkAnimate([
						{s: "#itemClock", p: {top: "70px", left: "70px", width: "220px", height: "220px"}},
						{s: "#paneClockFace", p: {width: "360px", height: "360px", top: "0px", left: "0px"}},
						{s: "#paneClockIcons .iconSD", p: {"border-radius": "12px"}},
						{s: "#paneClockIcons .iconHC", p: {"border-radius": "12px"}},
						{s: "#itemClockIconSD0", p: {top: "4px", left: "148px"}},
						{s: "#itemClockIconSD1", p: {top: "148px", left: "290px"}},
						{s: "#itemClockIconSD2", p: {top: "290px", left: "148px"}},
						{s: "#itemClockIconSD3", p: {top: "148px", left: "4px"}},
						{s: "#itemClockIconHC0", p: {top: "12px", left: "212px"}},
						{s: "#itemClockIconHC1", p: {top: "212px", left: "298px"}},
						{s: "#itemClockIconHC2", p: {top: "298px", left: "100px"}},
						{s: "#itemClockIconHC3", p: {top: "100px", left: "12px"}},
						{s: "#itemClockWaypoint0", p: {top: "52px", left: "164px"}},
						{s: "#itemClockWaypoint1", p: {top: "164px", left: "274px"}},
						{s: "#itemClockWaypoint2", p: {top: "274px", left: "164px"}},
						{s: "#itemClockWaypoint3", p: {top: "164px", left: "52px"}},
						{s: "#itemClockStar0", p: {top: "280px", left: "286px"}},
						{s: "#itemClockStar1", p: {top: "280px", left: "328px"}}
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
					$("#itemTimeServer").css({
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
					$("#itemTimeLocal, #itemTimeServer, #itemLanguage, #itemSocial").hide();
					// Reposition clock items
					I.bulkAnimate([
						{s: "#itemClock", p: {top: "0px", left: "0px", width: "85px", height: "85px"}},
						{s: "#paneClockFace", p: {width: "132px", height: "132px", top: "-24px", left: "-24px"}},
						{s: "#paneClockIcons .iconSD", p: {"border-radius": "32px"}},
						{s: "#paneClockIcons .iconHC", p: {"border-radius": "24px"}},
						{s: "#itemClockIconSD0", p: {top: "0px", left: "82px"}},
						{s: "#itemClockIconSD1", p: {top: "0px", left: "152px"}},
						{s: "#itemClockIconSD2", p: {top: "0px", left: "222px"}},
						{s: "#itemClockIconSD3", p: {top: "0px", left: "292px"}},
						{s: "#itemClockIconHC0", p: {top: "48px", left: "98px"}},
						{s: "#itemClockIconHC1", p: {top: "48px", left: "168px"}},
						{s: "#itemClockIconHC2", p: {top: "48px", left: "238px"}},
						{s: "#itemClockIconHC3", p: {top: "48px", left: "308px"}},
						{s: "#itemClockWaypoint0", p: {top: "-8px", left: "98px"}},
						{s: "#itemClockWaypoint1", p: {top: "-8px", left: "168px"}},
						{s: "#itemClockWaypoint2", p: {top: "-8px", left: "238px"}},
						{s: "#itemClockWaypoint3", p: {top: "-8px", left: "308px"}},
						{s: "#itemClockStar0", p: {top: "-16px", left: "0px"}},
						{s: "#itemClockStar1", p: {top: "-16px", left: "53px"}}
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
					$(I.cContentPane).animate({top: I.cPANE_MENU_HEIGHT,
						"min-height": I.cPANEL_HEIGHT - (I.cPANE_MENU_HEIGHT) + "px"}, animationspeed,
						function()
						{
							$("#paneClock").hide();
						});
				} break;
			}

			// Readjust panes to new height if showing clock
			if (O.Options.int_setClock !== O.IntEnum.Clock.None)
			{
				// Resize panes by animation
				$("#paneMenu").animate({top: clockpaneheight}, animationspeed);
				$("#paneClock, #paneClockWall, #paneClockBackground, #paneClockIcons")
					.animate({height: clockpaneheight}, animationspeed);
			
				// Readjust content pane
				$(I.cContentPane).animate({top: clockpaneheight + I.cPANE_MENU_HEIGHT,
					"min-height": I.cPANEL_HEIGHT - (clockpaneheight + I.cPANE_MENU_HEIGHT) + "px"}, animationspeed);
			}
			if (I.ModeCurrent === I.ModeEnum.Overlay)
			{
				$("#itemSocial").hide();
			}
		},
		int_setDimming: function()
		{
			switch (O.Options.int_setDimming)
			{
				case 1: $("#paneClockBackground").css({opacity: 1}); break;
				case 2: $("#paneClockBackground").css({opacity: 0}); break;
			}
		},
		bol_useCountdown: function()
		{
			C.updateChainsTimeHTML();
		},
		bol_showChainPaths: function()
		{
			M.setEntityGroupDisplay(M.ChainPathEntities, O.Options.bol_showChainPaths);
			M.setEntityGroupDisplay(M.StoryEventActive, O.Options.bol_showChainPaths);
		},
		bol_showMap: function()
		{
			if (O.Options.bol_showMap)
			{
				$("#paneMap").show();
			}
			else
			{
				$("#paneMap").hide();
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
		}
	}
};

/* =============================================================================
 * @@Checklist management
 * ========================================================================== */
X = {
	
	/*
	 * A checklist is a set of checkboxes that can have the usual unchecked,
	 * checked, and disabled states. These states are recorded as a single
	 * character in a string of numbers representing those states, and the index
	 * of a character is that checkbox's "ID". The Checklists object stores
	 * checklists with such a string and a key for localStorage, along with
	 * supplementary objects.
	 */
	Checklists:
	{
		// localStorage key-value pairs (key is required)
		Chain: { key: "str_chlChain", value: "" },
		ChainSubscription: { key: "str_chlChainSubscription", value: "" },
		JP: { key: "str_chlJP", value: "" },
		Dungeon: { key: "str_chlDungeon", value: "", money: 0 },
		Custom: { key: "str_chlCustom", value: "" },
		CustomText: { key: "str_chlCustomText", value: new Array(), valueDefault: new Array() },
		NotepadText: { key: "str_chlNotepadText", value: new Array(), valueDefault: new Array() },
		/*
		 * Collectible checklists must have the same variable name as in the map page's data.
		 * The urlkey properties must be unique from the global KeyEnum.
		 */
		Collectible0: { key: "str_chlDiveMaster", urlkey: "divemaster", value: "", cushion: new Array() },
		Collectible1: { key: "str_chlBuriedChest", urlkey: "chests", value: "", cushion: new Array() },
		Collectible2: { key: "str_chlCoinProspect", urlkey: "coinprospect", value: "", cushion: new Array() },
		Collectible3: { key: "str_chlCoinUplands", urlkey: "coinuplands", value: "", cushion: new Array() },
		Collectible4: { key: "str_chlCoinChallenger", urlkey: "coinchallenger", value: "", cushion: new Array() }
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
	initializeChecklist: function(pChecklist, pLength, pCustomList)
	{
		var i;
		var indexes;
		var index;
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
		 * If localStorage doesn't have the checklist already or if it's an
		 * improper length then it gets a default checklist string of 0's.
		 */
		else if (localStorage[pChecklist.key] === undefined
			|| localStorage[pChecklist.key].length !== pLength)
		{
			X.clearChecklist(pChecklist);
		}
		else
		{
			pChecklist.value = localStorage[pChecklist.key];
		}
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
			&& pIndex <= pChecklist.value.length - 1)
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
	 * Sets a checklist object's list to all 0's.
	 * @param object pChecklist to clear.
	 * @param boolean pJob whether to just 0 out the checked items only.
	 * @pre Checklist length attribute was initialized.
	 */
	clearChecklist: function(pChecklist, pJob)
	{
		var i;
		var checklist = "";
		var value = "";
		
		switch (pJob)
		{
			case "uncheck":
			{
				for (i = 0; i < pChecklist.length; i++)
				{
					if (pChecklist.value[i] === X.ChecklistEnum.Checked)
					{
						checklist += X.ChecklistEnum.Unchecked;
					}
					else
					{
						checklist += pChecklist.value[i];
					}
				}
			} break;
			case "preuncheck":
			{
				value = localStorage[pChecklist.key];
				if (value !== undefined)
				{
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
	 * Loads chain checklist state as recorded in localStorage, and binds
	 * clicking behavior to the div faux checkboxes.
	 * @pre Chains have been initialized.
	 */
	initializeChainChecklist: function()
	{
		var i;
		var chain;
		
		X.initializeChecklist(X.Checklists.Chain, C.Chains.length);
		X.initializeChecklist(X.Checklists.ChainSubscription, C.Chains.length);
		
		for (i in C.Chains)
		{
			chain = C.Chains[i];
			
			var bar = $("#barChain_" + chain.nexus);
			var check = $("#chnCheck_" + chain.nexus);
			var time = $("#chnTime_" + chain.nexus);
			
			// Set the checkbox visual state as stored
			switch (X.getChecklistItem(X.Checklists.Chain, chain.nexus))
			{
				case X.ChecklistEnum.Unchecked:
				{
					// Chain is not checked off, so don't do anything
				} break;
				case X.ChecklistEnum.Checked:
				{
					bar.css({opacity: K.iconOpacityChecked});
					check.addClass("chnChecked");
					if (O.Options.bol_hideChecked)
					{
						bar.hide();
					}
				} break;
				case X.ChecklistEnum.Disabled:
				{
					bar.hide();
				} break;
			}
			
			// Set the time visual state as stored (subscribed or not)
			if (X.getChecklistItem(X.Checklists.ChainSubscription, chain.nexus) ===
					X.ChecklistEnum.Checked)
			{
				time.addClass("chnTimeSubscribed");
			}
			
			/*
			 * Bind event handler for the time clickable for subscription.
			 */
			time.click(function()
			{
				var nexus = U.getSubintegerFromHTMLID($(this));
				
				if (X.getChecklistItem(X.Checklists.ChainSubscription, nexus) === X.ChecklistEnum.Checked)
				{
					$(this).removeClass("chnTimeSubscribed");
					X.setChecklistItem(X.Checklists.ChainSubscription, nexus, X.ChecklistEnum.Unchecked);
				}
				else
				{
					$(this).addClass("chnTimeSubscribed");
					X.setChecklistItem(X.Checklists.ChainSubscription, nexus, X.ChecklistEnum.Checked);
				}
			});
			
			/*
			 * Bind event handler for the div "checkboxes".
			 */
			check.click(function()
			{
				// The ID was named so by the chain initializer, get the chain nexus
				var nexus = U.getSubintegerFromHTMLID($(this));
				var thisbar = $("#barChain_" + nexus);
				// State of the div is stored in the Checklist object rather in the element itself
				switch (X.getChecklistItem(X.Checklists.Chain, nexus))
				{
					case X.ChecklistEnum.Unchecked:
					{
						thisbar.css({opacity: 1}).animate({opacity: K.iconOpacityChecked}, K.iconOpacitySpeed);
						$("#chnDetails_" + nexus).hide("fast");
						$(this).addClass("chnChecked");
						X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Checked);
					} break;
					case X.ChecklistEnum.Checked:
					{
						thisbar.css({opacity: 1}).show("fast");
						thisbar.css({opacity: K.iconOpacityChecked}).animate({opacity: 1}, K.iconOpacitySpeed);
						$("#chnDetails_" + nexus).show("fast");
						$(this).removeClass("chnChecked");
						X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Unchecked);
					} break;
					case X.ChecklistEnum.Disabled:
					{
						thisbar.css({opacity: 1}).show("fast");
						$("#chnDetails_" + nexus).show("fast");
						$(this).removeClass("chnChecked");
						X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Unchecked);
					} break;
				}
				// Also autohide the chain bar if opted
				if (X.getChecklistItem(X.Checklists.Chain, nexus) === X.ChecklistEnum.Checked)
				{
					if (O.Options.bol_hideChecked)
					{
						thisbar.hide("fast");
					}
					else
					{
						thisbar.show("fast");
					}
				}
				// Update the icons on the clock too
				K.checkoffChainIcon(nexus);
			});
			
			// Bind the delete chain text button [x]
			$("#chnDelete_" + chain.nexus).click(function()
			{
				var nexus = U.getSubintegerFromHTMLID($(this));
				var thisbar = $("#barChain_" + nexus);

				thisbar.hide("slow");
				X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Disabled);
				
				// Also update the clock icon
				K.checkoffChainIcon(nexus);
			});
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
	 * Binds dungeon checkbox storage and calculator behavior.
	 */
	initializeDungeonChecklist: function()
	{
		X.initializeChecklist(X.Checklists.Dungeon, $("#chlDungeon input").length);
		
		// Load dungeon icons on demand because they are pretty large
		$("#chlDungeon .chlDungeonBar").each(function()
		{
			$(this).prepend("<img src='img/dungeon/"
				+ $(this).data("name").toLowerCase() + I.cPNG + "' />");
		});
		
		var updateCalculator = function()
		{
			var money = X.Checklists.Dungeon.money;
			var gold = ~~(money / 10000);
			var silver = ~~(money / 100) % 100;
			var copper = money % 100;
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
			X.clearChecklist(X.Checklists.Dungeon, "uncheck");
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
		var checkboxes = $("#chlCustom input:checkbox");
		X.initializeChecklist(X.Checklists.Custom, checkboxes.length);
		
		checkboxes.each(function(pIndex)
		{
			$(this).change(function()
			{
				var state = X.getCheckboxEnumState($(this));
				
				X.setChecklistItem(X.Checklists.Custom, pIndex, state);
				X.styleCheckbox(X.Checklists.Custom, pIndex, $(this));
				
				if (state === X.ChecklistEnum.Checked)
				{
					$(this).parent().next().addClass("chlCustomTextChecked");
				}
				else
				{
					$(this).parent().next().removeClass("chlCustomTextChecked");
				}
			});
			
			// Now that this checkbox is bounded, trigger it as the state in checklist
			X.triggerCheckboxEnumState(X.Checklists.Custom, pIndex, $(this));
		});
		
		// Bind uncheck all button
		$("#chlCustomUncheck").click(function()
		{
			X.clearChecklist(X.Checklists.Custom, "uncheck");
			$("#chlCustom input:checkbox").each(function(pIndex)
			{
				if ($(this).prop("checked") === true)
				{
					$(this).trigger("click");
				};
				X.styleCheckbox(X.Checklists.Custom, pIndex, $(this));
			});
		});
		
		// Bind text fields behavior
		var items = $("#chlCustom input:text");
		var restore = $("#chlCustomRestore");
		X.initializeText(X.Checklists.CustomText, items, "Custom checklist item", 48, restore);
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
		items.first().show();
		X.initializeText(X.Checklists.NotepadText, items, "Notepad sheet", 4096, restore);
	},
	
	/*
	 * Stores text and binds default behavior for a standard set of text fields.
	 * @param object pChecklistText for storing text in memory and storage.
	 * @param jqobject pTextFields input or textarea elements to iterate and read text.
	 * @param string pFieldName name of the text fields for notifying of change.
	 * @param int pMaxLength of characters in a text field.
	 * @param jqobject pRestoreButton to reset all text fields.
	 */
	initializeText: function(pChecklistText, pTextFields, pFieldName, pMaxLength, pRestoreButton)
	{
		// Initialize the pre-written text in the text fields
		pTextFields.each(function()
		{
			var text = $(this).val();
			pChecklistText.value.push(text);
			pChecklistText.valueDefault.push(text);
		});
		
		/*
		 * Each text fields' value will become a delimited substring in one
		 * single string to be stored in localStorage.
		 */
		var i;
		if (localStorage[pChecklistText.key] === undefined)
		{
			// If localStorage value is empty, replace with original values in text field
			localStorage[pChecklistText.key] = pChecklistText.value.join(I.cTextDelimiterChar);
		}
		else
		{
			var storedtextarray = localStorage[pChecklistText.key].split(I.cTextDelimiterChar);
			if (storedtextarray.length === pTextFields.length)
			{
				// Load the stored text if it has same number of strings as there are text fields
				for (i in storedtextarray)
				{
					pChecklistText.value[i] = storedtextarray[i];
				}
			}
			else
			{
				localStorage[pChecklistText.key] = pChecklistText.value.join(I.cTextDelimiterChar);
			}
		}
		
		var updateStoredText = function()
		{
			// Read every text fields and rewrite the string of substrings again
			pTextFields.each(function(pIndex)
			{
				pChecklistText.value[pIndex] = $(this).val().replace(I.cTextDelimiterRegex, "");
			});
			localStorage[pChecklistText.key] = pChecklistText.value.join(I.cTextDelimiterChar);
		};
		
		// Bind text fields behavior
		pTextFields.each(function(pIndex)
		{
			// Set number of characters allowed in the text field
			$(this).attr("maxlength", pMaxLength);
			$(this).val(pChecklistText.value[pIndex]); // Load initialized text
			
			$(this).change(function()
			{
				I.write(pFieldName + " #" + (pIndex + 1) + " updated.");
				updateStoredText();
			});
		});
		
		// Bind restore button
		pRestoreButton.click(function()
		{
			pTextFields.each(function(pIndex)
			{
				$(this).val(pChecklistText.valueDefault[pIndex]).trigger("change");
			});
		});
	}
};

/* =============================================================================
 * @@Dictionary to translate readable/listenable strings
 * ========================================================================== */
D = {
	
	/*
	 * Dictionaries
	 */
	Phrase:
	{
		s_TEMPLATE: {de: "", es: "", fr: "", cs: "", it: "", pl: "", pt: "", ru: "", zh: ""},
		
		// Time
		s_h: {de: "s", es: "h", fr: "h", cs: "h", it: "o", pl: "g", pt: "h", ru: "ч", zh: "時"},
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
		s_world_boss: {de: "weltboss", es: "jefe mundo", fr: "chef monde",
			cs: "svět boss", it: "boss mondo", pl: "świat szef", pt: "chefe mundo", ru: "мир босс", zh: "世界頭目"},
		s_section: {de: "paragraph", es: "sección", fr: "section",
			cs: "oddíl", it: "sezione", pl: "sekcja", pt: "seção", ru: "параграф", zh: "節"},
		s_Vista: {de: "Aussichtspunkt", es: "Vista", fr: "Panorama"},
		s_Skill_Challenge: {de: "Fertigkeitspunkt", es: "Desafío de habilidad", fr: "Défi de compétence"},
		
		// Verbs
		s_done_reading: {de: "ende gelesen", es: "terminado de leer", fr: "fini de lire",
			cs: "dokončil čtení", it: "finito di leggere", pl: "przeczytaniu", pt: "leitura terminou", ru: "закончите читать", zh: "讀完"},
		s_is: {de: "ist", es: "es", fr: "est",
			cs: "je", it: "è", pl: "jest", pt: "é", ru: "является", zh: "是"},
		s_subscribe: {de: "abonnieren", es: "subscribir", fr: "abonner",
			cs: "předplatit si", it: "sottoscrivere", pl: "abonować", pt: "assinar", ru: "подписываться", zh: "訂閱"},
		s_will_start: {de: "wird starten", es: "se iniciará", fr: "débutera",
			cs: "začne", it: "inizierà", pl: "rozpocznie się", pt: "começará", ru: "начнется", zh: "開始"},
		
		// Adjectives and Adverbs
		s_ago: {de: "vor", es: "hace", fr: "il ya",
			cs: "před", it: "fa", pl: "temu", pt: "há", ru: "назад", zh: "前"},
		s_also: {de: "auch", es: "también", fr: "aussi",
			cs: "také", it: "anche", pl: "też", pt: "também", ru: "то́же", zh: "也"},
		s_checked: {de: "abgehakt", es: "visto", fr: "coché",
			cs: "odškrtnout", it: "controllato", pl: "zakończony", pt: "marcado", ru: "галочка", zh: "勾掉"},
		s_current: {de: "aktuelle", es: "actual", fr: "actuel",
			cs: "současný", it: "corrente", pl: "bieżący", pt: "corrente", ru: "текущий", zh: "活期"},
		s_next: {de: "nächste", es: "siguiente", fr: "prochain",
			cs: "příští", it: "seguente", pl: "następny", pt: "próximo", ru: "следующий", zh: "下一"},
		s_subscribed: {de: "abonniert", es: "suscrito", fr: "souscrit",
			cs: "odebírané", it: "sottoscritti", pl: "subskrypcji", pt: "assinado", ru: "подписал", zh: "訂閱"},
		s_then: {de: "dann", es: "luego", fr: "puis",
			cs: "pak", it: "poi", pl: "potem", pt: "então", ru: "затем", zh: "接著"},
		
		// Prepositions and Conjunctions
		s_and: {de: "und", es: "y", fr: "et",
			cs: "a", it: "e", pl: "i", pt: "e", ru: "и", zh: "和"},
		s_in: {de: "in", es: "en", fr: "en",
			cs: "za", it: "in", pl: "w", pt: "em", ru: "в", zh: "在"},
		
		// Automatic
		s_Scheduled_Bosses: {de: "Geplant", es: "Programado", fr: "Planifié",
			cs: "Plánované", it: "Pianificata", pl: "Zaplanowane", pt: "Agendado", ru: "Запланирован", zh: "已排程"},
		s_Legacy_Bosses: {de: "Legacy", es: "Heredado", fr: "Hérité",
			cs: "Starší", it: "Legacy", pl: "Starsze", pt: "Herdado", ru: "Устаревший", zh: "舊版"},
		s_Orr_Temples: {de: "Tempel", es: "Templos", fr: "Temples",
			cs: "Chrámy", it: "Templi", pl: "Świątynie", pt: "Templos", ru: "Храмы", zh: "寺廟"},
		s_Full_Timetable: {de: "Zeitplan", es: "Horario", fr: "Horaire",
			cs: "Plán", it: "Programma", pl: "Harmonogram", pt: "Horário", ru: "Расписание", zh: "時間表"},
		s_news: {de: "nachrichten", es: "noticias", fr: "actualités",
			cs: "zprávy", it: "notizie", pl: "wiadomości", pt: "notícias", ru: "новости", zh: "新聞"},
		s_simple_mode: {de: "einfach modus", es: "modo simple", fr: "mode simple",
			cs: "prostý režim", it: "modalità semplice", pl: "prosty tryb", pt: "modo simples", ru: "простой режим", zh: "方式簡單"},
		s_chests: {de: "schatztruhen", es: "cofres del tesoro", fr: "coffres au trésor",
			cs: "truhly", it: "scrigni del tesoro", pl: "skrzynie", pt: "baús de tesouro", ru: "сундуки с сокровищами", zh: "寶箱"}
	},
	
	Element:
	{
		s_TEMPLATE: {de: "", es: "", fr: "", cs: "", it: "", pl: "", pt: "", ru: "", zh: ""},

		s_menuChains: {de: "Ketten", es: "Cadenas", fr: "Chaînes",
			cs: "Řetězy", it: "Catene", pl: "Łańcuchy", pt: "Cadeias", ru: "Цепи", zh: "鏈"},
		s_menuMap: {de: "Werkzeuge", es: "Útiles", fr: "Outils",
			cs: "Nástroje", it: "Strumenti", pl: "Narzędzia", pt: "Ferramentas", ru: "Средства", zh: "工具"},
		s_menuWvW: {de: "WvW", es: "WvW", fr: "WvW",
			cs: "WvW", it: "WvW", pl: "WvW", pt: "WvW", ru: "WvW", zh: "WvW"},
		s_menuHelp: {de: "Hilfe", es: "Ayuda", fr: "Assistance",
			cs: "Pomoci", it: "Guida", pl: "Pomoc", pt: "Ajuda", ru: "Помощь", zh: "輔助"},
		s_menuOptions: {de: "Optionen", es: "Opciónes", fr: "Options",
			cs: "Možnosti", it: "Opzioni", pl: "Opcje", pt: "Opções", ru: "Параметры", zh: "選項"},
		s_opt_bol_alertSubscribed: {
			de: "<dfn>Alarm Modus:</dfn><br />☐ = Checkliste<br />☑ = Abonnement",
			es: "<dfn>Modo de Alarma:</dfn><br />☐ = Lista de Verificación<br />☑ = Suscripción",
			fr: "<dfn>Mode d'Alarme:</dfn><br />☐ = Check-list<br />☑ = Abonnement",
			cs: "<dfn>Režim Alarmu:</dfn><br />☐ = Kontrolní Seznam<br />☑ = Předplatné",
			it: "<dfn>Modalità di Allarme:</dfn><br />☐ = Elenco di Controllo<br />☑ = Sottoscrizione",
			pl: "<dfn>Alarmu Tryb:</dfn><br />☐ = Lista Kontrolna<br />☑ = Abonament",
			pt: "<dfn>Modo de Alarme:</dfn><br />☐ = Lista de Verificação<br />☑ = Assinatura",
			ru: "<dfn>Будильник Режим:</dfn><br />☐ = Контрольный Список<br />☑ = Подписка",
			zh: "<dfn>鬧鐘方式:</dfn><br />☐ = 清單<br />☑ = 訂閱"
		}
	},
	
	/*
	 * Gets a phrase translated based on the opted language.
	 * @param string pText text to translate without spaces.
	 * @returns string translated text.
	 */
	getTranslation: function(pText, pDictionary)
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
		
		var entry = pDictionary["s_" + text];
		if (entry)
		{
			// Get the text based on user's language
			value = entry[O.Options.enu_Language];
			if (value)
			{
				return value;
			}
			// Language not found so use default instead
			return pText;
		}
		// No such text exist for translation
		return "notranslation";
	},
	
	/*
	 * Gets translation of specified text using phrase dictionary.
	 * @param string pText to lookup.
	 * @returns string translated phrase.
	 */
	getPhrase: function(pText)
	{
		return D.getTranslation(pText, D.Phrase);
	},
	getSentence: function(pText)
	{
		return U.toFirstUpperCase(D.getTranslation(pText, D.Phrase));
	},
	getElement: function(pID)
	{
		return D.getTranslation(pID, D.Element);
	},
	
	/*
	 * Translates the header of a page.
	 * @param enum pLayer to get header.
	 */
	translatePageHeader: function(pLayer)
	{
		if (O.Options.enu_Language !== O.OptionEnum.Language.Default)
		{
			$("#layer" + pLayer + " .cntHeader").text(D.getElement("menu" + pLayer));
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
			// Translate text in single HTML elements
			$(".jsTranslate").each(function()
			{
				$(this).text(D.getPhrase($(this).text()));
			});
			
			// Translate tooltips
			$(".menuButton").each(function()
			{
				$(this).attr("title", "<dfn>" + D.getElement($(this).attr("id")) + "</dfn>");
				I.qTip.init($(this));
			});
			$("#opt_bol_alertSubscribed").each(function()
			{
				$(this).parent().attr("title", D.getElement($(this).attr("id")));
				I.qTip.init($(this).parent());
			});
			D.translatePageHeader(I.PageEnum.Options);
		}
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
		
	// Must be in the same order as the chain nexuses
	ChainTitle: [
	{
		en: "Fire Elemental",
		de: "Feuerelementar",
		es: "Elemental de Fuego",
		fr: "Elémentaire de Feu",
		cs: "Ohnivý Elementál",
		it: "Elementale del Fuoco",
		pl: "Ognisty Żywioł",
		pt: "Fogo Elemental",
		ru: "Огонь Элементаль",
		zh: "火元素"
	},{
		en: "Golem Mark II",
		de: "Inquestur-Golem Typ II",
		es: "Gólem Serie II de la Inquisa",
		fr: "Golem Marque II de l'Enqueste",
		cs: "Golem Typu II",
		it: "Golem Tipo II",
		pl: "Golem Model II",
		pt: "Golem Tipo II",
		ru: "Следствие Голем Тип II",
		zh: "Inquest 的魔像2型"
	},{
		en: "Claw of Jormag",
		de: "Klaue Jormags",
		es: "Garra de Jormag",
		fr: "Griffe de Jormag",
		cs: "Dráp Jormag",
		it: "Artiglio di Jormag",
		pl: "Szpon Jormaga",
		pt: "Garra de Jormag",
		ru: "Йормаг Коготь",
		zh: "爪的 Jormag"
	},{
		en: "Svanir Shaman",
		de: "Schamanenoberhaupt der Svanir",
		es: "Jefe Chamán Svanir",
		fr: "Chef Chamane de Svanir",
		cs: "Hlavní Svanir Šaman",
		it: "Capo Sciamano Svanir",
		pl: "Wódz Szamanów Svanira",
		pt: "Chefe Xamã Svanir",
		ru: "Главный Шаман Сванир",
		zh: "Svanir 的首席薩滿"
	},{
		en: "Megadestroyer",
		de: "Megazerstörer",
		es: "Megadestructor",
		fr: "Mégadestructeur",
		cs: "Meganičitel",
		it: "Megadistruttore",
		pl: "Wielkiniszczyciel",
		pt: "Megadestruidor",
		ru: "Мегадеструктор",
		zh: "Megadestroyer"
	},{
		en: "Shadow Behemoth",
		de: "Schatten-Behemoth",
		es: "Behemot de las Sombras",
		fr: "Béhémoth des Ombres",
		cs: "Stín Behemoth",
		it: "Behemoth d'Ombra",
		pl: "Mroczny Behemot",
		pt: "Behemoth de Sombra",
		ru: "Бегемот из Тени",
		zh: "影子的巨獸"
	},{
		en: "The Shatterer",
		de: "Den Zerschmetterer",
		es: "El Asolador",
		fr: "Le Destructeur",
		cs: "Shatterer",
		it: "Il Shatterer",
		pl: "Shatterer",
		pt: "O Shatterer",
		ru: "Шаттерер",
		zh: "Shatterer"
	},{
		en: "Taidha Covington",
		de: "Admiral Taidha Covington",
		es: "Almirante Taidha Covington",
		fr: "Amirale Taidha Covington",
		cs: "Admirál Taidha Covington",
		it: "Ammiraglio Taidha Covington",
		pl: "Admirał Taidha Covington",
		pt: "Almirante Taidha Covington",
		ru: "Адмирал Таидха Цовингтон",
		zh: "海軍上將 Taidha Covington"
	},{
		en: "Modniir Ulgoth",
		de: "Ulgoth den Modniir",
		es: "Ulgoth el Modniir",
		fr: "Ulgoth le Modniir",
		cs: "Ulgoth na Modniir",
		it: "Ulgoth il Modniir",
		pl: "Modniir Ulgoth",
		pt: "Ulgoth o Modniir",
		ru: "Улготх в Модниир",
		zh: "Ulgoth 的 Modniir"
	},{
		en: "Great Jungle Wurm",
		de: "Großen Dschungelwurm",
		es: "Gran Sierpe de la Selva",
		fr: "Grande Guivre de la Jungle",
		cs: "Velká Džungle Červ",
		it: "Grande Verme Giungla",
		pl: "Wielki Robak z Dżungli",
		pt: "Grande Verme Selva",
		ru: "Великий Червь из Джунглей",
		zh: "大叢林蠕蟲"
	},{
		en: "Karka Queen",
		de: "Karka-Königin",
		es: "Reina Karka",
		fr: "Reine Karka",
		cs: "Karka Královna",
		it: "Regina Karka",
		pl: "Karka Królowa",
		pt: "Rainha Karka",
		ru: "Карка Королева",
		zh: "女王 Karka"
	},{
		en: "Tequatl the Sunless",
		de: "Tequatl den Sonnenlosen",
		es: "Tequatl el Sombrío",
		fr: "Tequatl le Sans-soleil",
		cs: "Tequatl Bez Slunce",
		it: "Tequatl il Senza Sole",
		pl: "Tequatl ma Słońca",
		pt: "Tequatl o Sem Sol",
		ru: "Теqуатл Тусклый",
		zh: "Tequatl 沒有陽光"
	},{
		en: "Three Headed Wurm",
		de: "Dreiköpfig Wurm",
		es: "Sierpe de Tres Cabezas",
		fr: "Guivre à Trois Têtes",
		cs: "Tři Vedl Červ",
		it: "Verme a Tre Teste",
		pl: "Trzygłowy Robak",
		pt: "Verme de Três Cabeças",
		ru: "Трехголовый Червь",
		zh: "蟲三頭"
	},{
		en: "The Dragon's Reach II Q1",
		de: "Im Bann des Drachen II Q1",
		es: "El Alcance del Dragón II Q1",
		fr: "L'ombre du Dragon II Q1"
	},{
		en: "The Dragon's Reach II Q2",
		de: "Im Bann des Drachen II Q2",
		es: "El Alcance del Dragón II Q2",
		fr: "L'ombre du Dragon II Q2"
	},{
		en: "The Dragon's Reach II Q3",
		de: "Im Bann des Drachen II Q3",
		es: "El Alcance del Dragón II Q3",
		fr: "L'ombre du Dragon II Q3"
	},{
		en: "The Dragon's Reach II Q4",
		de: "Im Bann des Drachen II Q4",
		es: "El Alcance del Dragón II Q4",
		fr: "L'ombre du Dragon II Q4"
	},{
		en: "Fire Shaman",
		de: "Feuerschamanen",
		es: "Chamán de Fuego",
		fr: "Chamane de Feu",
		cs: "Požární Šaman",
		it: "Sciamano Fuoco",
		pl: "Ognia Szaman",
		pt: "Xamã Fogo",
		ru: "Oгня Шаман",
		zh: "火薩滿"
	},{
		en: "Foulbear Chieftain",
		de: "Faulbär-Häuptling",
		es: "Cabecilla de Osoinmundo",
		fr: "Chef Oursefol",
		cs: "Foulbear Náčelník",
		it: "Capo Foulbear",
		pl: "Faulwódz Niedźwiedź",
		pt: "Chefe Foulbear",
		ru: "Фолмедведь Вождь",
		zh: "臭熊頭目"
	},{
		en: "Dredge Commissar",
		de: "Schaufler-Kommissar",
		es: "Comisario Draga",
		fr: "Kommissar Draguerre",
		cs: "Vybagrovat Komisař",
		it: "Commissario Dragare",
		pl: "Pogłębiarka Komisarza",
		pt: "Comissário Dragar",
		ru: "Драги Комиссар",
		zh: "疏浚政委"
	},{
		en: "Eye of Zhaitan",
		de: "Auge des Zhaitan",
		es: "Ojo de Zhaitan",
		fr: "Œil de Zhaïtan",
		cs: "Oko Zhaitan",
		it: "Occhio Zhaitan",
		pl: "Oko Zhaitan",
		pt: "Olho de Zhaitan",
		ru: "Глаз Жаитан",
		zh: "眼的 Zhaitan"
	},{
		en: "Lyssa",
		de: "Verderbte Hohepriesterin der Lyssa",
		es: "Suma Sacerdotisa Corrupta de Lyssa",
		fr: "Grande Prêtresse Corrompue de Lyssa",
		cs: "Lyssa Chrám",
		it: "Tempio di Lyssa",
		pl: "Lyssa Świątynia",
		pt: "Templo de Lyssa",
		ru: "Лысса Храм",
		zh: "Lyssa 的寺廟"
	},{
		en: "Dwayna",
		de: "Besessene Dwayna-Statue",
		es: "Estatua Poseída de Dwayna",
		fr: "Statue Possédée de Dwayna",
		cs: "Dwayna Chrám",
		it: "Tempio di Dwayna",
		pl: "Dwayna Świątynia",
		pt: "Templo de Dwayna",
		ru: "Дwаына Храм",
		zh: "Dwayna 的寺廟"
	},{
		en: "Melandru",
		de: "Auferstandenen Priester der Melandru",
		es: "Sacerdote de Melandru Resurgido",
		fr: "Prêtre Revenant de Melandru",
		cs: "Melandru Chrám",
		it: "Tempio di Melandru",
		pl: "Melandru Świątynia",
		pt: "Templo de Melandru",
		ru: "Меландру Храм",
		zh: "Melandru 的寺廟"
	},{
		en: "Grenth",
		de: "Auferstandenen Priester des Grenth",
		es: "Sacerdote de Grenth Resurgido",
		fr: "Prêtre Revenant de Grenth",
		cs: "Grenth Chrám",
		it: "Tempio di Grenth",
		pl: "Grenth Świątynia",
		pt: "Templo de Grenth",
		ru: "Грентх Храм",
		zh: "Grenth 的寺廟"
	},{
		en: "Arah",
		de: "Tore von Arah",
		es: "Puertas de Arah",
		fr: "Portes d'Arah",
		cs: "Arah Brány",
		it: "Porte di Arah",
		pl: "Arah Bramy",
		pt: "Portões de Ará",
		ru: "Ворота Арах",
		zh: "Arah 的寺廟"
	},{
		en: "Balthazar",
		de: "Auferstandenen Priester des Balthasar",
		es: "Sacerdote de Balthazar Resurgido",
		fr: "Prêtre Revenant de Balthazar",
		cs: "Balthazar Chrám",
		it: "Tempio di Balthazar",
		pl: "Świątynia Balthazar",
		pt: "Templo de Balthazar",
		ru: "Балтхазар Храм",
		zh: "Balthazar 的寺廟"
	},{
		en: "Balthazar North",
		de: "Nord Invasion von Orr",
		es: "Invasión del Norte de Orr",
		fr: "Invasion du Nord de Orr",
		cs: "Severní Invaze Orr",
		it: "Invasione Settentrionale di Orr",
		pl: "Północnej Inwazja Orr",
		pt: "Invasão Norte de Orr",
		ru: "Северная Вторжение Орр",
		zh: "北部入侵 Orr"
	},{
		en: "Balthazar Central",
		de: "Zentral Invasion von Orr",
		es: "Invasión Central de Orr",
		fr: "Invasion Central de Orr",
		cs: "Centrální Invaze Orr",
		it: "Invasione Centrale di Orr",
		pl: "Centralny Inwazja Orr",
		pt: "Invasão Central Orr",
		ru: "Центральный Вторжение Орр",
		zh: "中部入侵 Orr"
	},{
		en: "Balthazar South",
		de: "Invasion der Südlichen Orr",
		es: "Invasión del Sur de Orr",
		fr: "Invasion du Sud de Orr",
		cs: "Jižní Invaze Orr",
		it: "Invasione del Sud di Orr",
		pl: "Południowej Inwazja Orr",
		pt: "Invasão do Sul de Orr",
		ru: "Южный Вторжение Орр",
		zh: "南部入侵 Orr"
	}
	],
	
	/*
	 * Gets title of chain in opted language.
	 * @param int pIndex of chain.
	 * @returns string title.
	 */
	getChainTitle: function(pIndex)
	{
		if (C.Chains[pIndex].series === C.ChainSeriesEnum.Story)
		{
			if (D.isLanguageFullySupported())
			{
				return (D.ChainTitle[pIndex])[O.Options.enu_Language];
			}
			else
			{
				return (D.ChainTitle[pIndex])[O.OptionEnum.Language.Default];
			}
		}
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return C.Chains[pIndex].title;
		}
		return (D.ChainTitle[pIndex])[O.Options.enu_Language];
	},
	getChainTitleAny: function(pIndex)
	{
		if (C.Chains[pIndex].series === C.ChainSeriesEnum.Story)
		{
			return C.Chains[pIndex].title;
		}
		return (D.ChainTitle[pIndex])[O.Options.enu_Language];
	},
	
	/*
	 * Gets short title of chain in opted language.
	 * @param int pIndex of chain.
	 * @returns string short title.
	 */
	getChainAlias: function(pIndex)
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return C.Chains[pIndex].alias;
		}
		return D.getChainTitle(pIndex);
	},
	
	/*
	 * Gets name of event in opted language.
	 * @param object pEvent to lookup.
	 * @returns string name.
	 */
	getEventName: function(pEvent)
	{
		if (pEvent["name_" + O.Options.enu_Language])
		{
			return pEvent["name_" + O.Options.enu_Language];
		}
		return pEvent["name_en"];
	},
	
	/*
	 * Loads a TTS sound file generated from a TTS web service into a hidden
	 * iframe. The sound plays automatically after changing the iframe's src via
	 * the browser's builtin media player.
	 * @param string pString to convert to speech.
	 * @param float pDuration of the speech in seconds.
	 * @pre pString does not exceed 100 characters (Google TTS limit).
	 */
	speechWait: 0, // In milliseconds
	speak: function(pString, pDuration)
	{
		var doSpeak = function(pStringMacro)
		{
			var url;
			var tts;
		
			if (I.BrowserUser === I.BrowserEnum.Chrome)
			{
				/*
				 * Google TTS seems to only work with their browser; using it on
				 * Firefox gives "Video playback aborted due to a network error"
				 */
				tts = document.getElementById("jsTTSFrame");
				url = "http://translate.google.com/translate_tts?tl="
					+ O.Options.enu_Language + "&q=" + pStringMacro;
				tts.src = url;
			}
			else
			{
				tts = document.getElementById("jsTTSAudio");
				url = "http://tts-api.com/tts.mp3?q=" + pStringMacro;
				tts.src = url;
				tts.load();
				tts.play();
			}
		};
		
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
				doSpeak(pString);
				D.speechWait -= durationms;
			}, D.speechWait - durationms);
		}
	},
	
	/*
	 * Gets translation for given text if using Chrome (because Google TTS
	 * is multilingual but only supports Chrome browser), else return given text.
	 * @param string pText to lookup.
	 * @param string pModifier optional adjective or adverb.
	 * @returns string translated text or given text.
	 */
	getSpeech: function(pText, pModifier)
	{
		if (I.BrowserUser === I.BrowserEnum.Chrome)
		{
			if (pModifier)
			{
				if (D.isLanguageModifierFirst())
				{
					return D.getPhrase(pModifier) + " " + D.getPhrase(pText);
				}
				else
				{
					return D.getPhrase(pText) + " " + D.getPhrase(pModifier);
				}
			}
			return D.getPhrase(pText);
		}
		else
		{
			if (pModifier)
			{
				return pModifier + pText;
			}
			return pText;
		}
	},
	
	/*
	 * Gets pronunciation of chain in opted language.
	 * @param object pChain to get.
	 * @returns string pronunciation.
	 */
	getChainPronunciation: function(pChain)
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Default
			|| I.BrowserUser !== I.BrowserEnum.Chrome)
		{
			return C.Chains[pChain.nexus].pronunciation;
		}
		return D.getChainTitle(pChain.nexus);
	}
};

/* =============================================================================
 * @@Chains of events
 * ========================================================================== */
C = {
	
	/*
	 * http://gw2timer.com/chains.js holds an array of meta event chain objects,
	 * which themselves contain an array of their events.
	 * This is referred to by the variable "C.Chains".
	 */
	Chains: GW2T_CHAIN_DATA,
	// The word and variable "nexus" is simply a chain's index number in the Chains array
	cIndexSynonym: "nexus",
	CurrentChainSD: {}, NextChainSD1: {}, NextChainSD2: {}, NextChainSD3: {}, NextChainSD4: {},
	CurrentChainHC: {}, NextChainHC1: {}, NextChainHC2: {}, NextChainHC3: {}, NextChainHC4: {},
	CurrentChains: [],
	PreviousChains1: [],
	PreviousChains2: [],
	NextChains1: [],
	cChainTitleCharLimit: 30,
	ScheduledChains: [],
	StoryChains: [],
	LegacyChains: [],
	TempleChains: [],
	ChainSeriesEnum:
	{
		Temple: 0, // Unscheduled Orr temples
		Legacy: 1, // Unscheduled chains that still gives a rare
		ScheduledCutoff: 1,
		Standard: 2, // Scheduled non-hardcore chains
		Hardcore: 3, // Scheduled challenging chains with a separate schedule from non-hardcores
		Story: 4 // Scheduled Living Story chains
	},
	EventPrimacyEnum:
	{
		Optional: 0, // A failure or optional subevent; includes temple retake event which should be ignored
		Normal: 1, // A concurrent (multiple simultaneous) event that does not take the longest to complete
		Primary: 2, // An only event at the time or a concurrent event that takes the longest to complete
		Boss: 3 // The boss event, also considered a primary event
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
	 * Shortens a title/name string so it fits the chain bar and add ellipses.
	 * @param string pString.
	 * @returns string truncated if it's too long.
	 */
	truncateTitleString: function(pString, pLimit, pSuffix)
	{
		pSuffix = pSuffix || "";
		if (pString.length > pLimit)
		{
			return pString.substring(0, pLimit) + pSuffix;
		}
		return pString;
	},
	
	/*
	 * Sets the chain bar icon to the proper.
	 * @param object pChain to reference.
	 */
	styleBarIcon: function(pChain)
	{
		document.getElementById("chnIcon_" + pChain.nexus).src = "img/chain/"
			+ C.parseChainAlias(pChain.alias).toLowerCase() + I.cPNG;
	},

	/*
	 * Initializes the chain HTML layer presentation with chains and their
	 * individual events. Calculates time sums for chains and pushes to array
	 * for later accessing by the ticker. 
	 * @param object pChain chain to initialize.
	 */
	initializeChainAndHTML: function(pChain)
	{
		var i, ii;
		var event;
		var chainlistid = "";
		
		switch (pChain.series)
		{
			case C.ChainSeriesEnum.Standard:
			{
				chainlistid = "#listChainsScheduled";
				C.ScheduledChains.push(pChain);
			} break;
			case C.ChainSeriesEnum.Hardcore:
			{
				chainlistid = "#listChainsScheduled";
				C.ScheduledChains.push(pChain);
			} break;
			case C.ChainSeriesEnum.Story:
			{
				chainlistid = "#listChainsScheduled";
				C.ScheduledChains.push(pChain);
				C.StoryChains.push(pChain);
			} break;
			case C.ChainSeriesEnum.Legacy:
			{
				chainlistid = "#listChainsLegacy";
				C.LegacyChains.push(pChain);
			} break;
			case C.ChainSeriesEnum.Temple:
			{
				chainlistid = "#listChainsTemple";
				C.TempleChains.push(pChain);
			} break;
		}
		
		/*
		 * A chain bar (HTML) is a rectangle that contains the event chain icon,
		 * chain title, time, individual events listed, and other elements.
		 * Lots of CSS IDs and classes here, so update if the CSS changed.
		 */
		$(chainlistid).append(
		"<div id='barChain_" + pChain.nexus + "' class='barChain'>"
			+ "<div class='chnTitle'>"
				+ "<img id='chnIcon_" + pChain.nexus + "' src='' />"
				+ "<div id='chnCheck_" + pChain.nexus + "' class='chnCheck'></div>"
				+ "<h1 id='chnTitle_" + pChain.nexus + "'>" + C.truncateTitleString(D.getChainTitle(pChain.nexus), C.cChainTitleCharLimit) + "</h1>"
				+ "<time id='chnTime_" + pChain.nexus + "' class='chnTimeFutureFar'></time>"
			+ "</div>"
			+ "<div id='chnDetails_" + pChain.nexus + "' class='chnDetails'>"
				+ "<ol id='chnEvents_" + pChain.nexus + "' class='chnEvents'></ol>"
				+ "<div class='chnDetailsLinks'>"
					+ "<ins id='chnDelete_" + pChain.nexus + "' title='Permanently hide this event chain (can undo in Options).'>[x]</ins>"
				+ "</div>"
		+ "</div>");
		// Initially only show/download icons for the scheduled chains list
		if (C.isChainScheduled(pChain))
		{
			C.styleBarIcon(pChain);
		}

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
			if (pChain.series === C.ChainSeriesEnum.Story)
			{
				eventhtmltitle = w("Event Number: ") + e.num + b
					+ w("Start Time: ") + e.lim + b
					+ b + "&amp;quot;" + D.getEventName(e).replace(/["']/g, "") + "&amp;quot;";
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
					+ b + "&amp;quot;" + D.getEventName(e).replace(/["']/g, "") + "&amp;quot;";
			}
			
			var indentpixel = 0;
			var eventnamelimit = 44;
			var indentEvent = function()
			{
				indentpixel = 12;
				eventnamelimit = 40;
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
			"<li id='chnEvent_" + pChain.nexus + "_" + e.num + "' class='chnStep_" + pChain.nexus + "_" + e.step + "' style='margin-left:" + indentpixel +"px'>"
				+ "<img src='img/event/" + e.icon + I.cPNG + "' title='" + eventhtmltitle + "'/>"
				+ "<span>" + C.truncateTitleString(D.getEventName(e), eventnamelimit, "..") + "</span>"
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
	}, // End of initializeChains()

	/*
	 * Initializes every chain and create additional informative arrays for them.
	 * @pre Event number can only go from 1-9.
	 */
	initializeAllChains: function()
	{
		for (var i in C.Chains)
		{
			/*
			 * Initialize step attribute (the first number in an event
			 * number, as in "2" in "2A1"), will be used to access events HTML.
			 */
			for (var ii in C.Chains[i].events)
			{
				// Minus 1 because the event numbers are 1 indexed
				C.Chains[i].events[ii].step = parseInt(C.getEventStepNumber(C.Chains[i].events[ii].num)) - 1;
			}
			
			C.Chains[i].nexus = parseInt(i);
			C.Chains[i].isSorted = false;
			C.Chains[i].primaryEvents = new Array();
			C.Chains[i].scheduleKeys = new Array();
			C.initializeChainAndHTML(C.Chains[i]);
		}
		// Collapse all chain bars
		$(".chnDetails").hide();
		// Initial recoloring of chain titles
		$("#listChainsScheduled .barChain h1").addClass("chnTitleFutureFar");
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
	 * Updates a chain bar's time tooltip with a pre-sorted subschedule.
	 * @pre scheduleKeys array is sorted and first element is the soonest
	 */
	updateChainTimeTooltipHTML: function(pChain)
	{
		// Update the title tootlip with that chain's schedule
		var minischedulestring = "";
		var spacer;
		for (var ii in pChain.scheduleKeys)
		{
			spacer = (parseInt(ii) === 0) ? "<dfn>" + D.getSentence("subscribe") + "?</dfn><br />" : " <br /> ";
			minischedulestring = minischedulestring + spacer
				+ T.getTimeFormatted(
				{
					wantSeconds: false,
					customTimeInSeconds: T.convertScheduleKeyToLocalSeconds(
						pChain.scheduleKeys[ii])
				});
		}
		$("#chnTime_" + pChain.nexus).prop("title", minischedulestring);
	},
	
	/*
	 * Updates the time in the chain bars for all chains.
	 */
	updateChainsTimeHTML: function()
	{
		var i;
		var ithchain;
		var time;
		var wantletters = false;
		for (i in C.ScheduledChains)
		{
			ithchain = C.ScheduledChains[i];
			C.updateChainTimeTooltipHTML(ithchain);
			// Don't change the active bars
			if (C.isChainCurrent(ithchain))
			{
				continue;
			}
			
			if (O.Options.bol_useCountdown)
			{
				time = T.getSecondsUntilChainStarts(ithchain);
					wantletters = true;
			}
			else
			{
				time = T.convertScheduleKeyToLocalSeconds(ithchain.scheduleKeys[0]);
					wantletters = false;
			}
			
			$("#chnTime_" + ithchain.nexus).text(T.getTimeFormatted(
				{
					wantLetters: wantletters,
					wantSeconds: false,
					customTimeInSeconds: time
				})
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
		var sign = "-";
		
		if (pChain.series === C.ChainSeriesEnum.Story)
		{
			$("#chnTime_" + pChain.nexus).text(T.getTimeFormatted(
				{
					reference: T.ReferenceEnum.UTC,
					want24: true,
					wantHours: false
				})
			);
		}
		else
		{
			if (remaining <= 0)
			{
				time = T.cSECONDS_IN_TIMEFRAME - elapsed;
				sign = "−";
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
		$("#listChainsTimetable").empty(); // This makes the function reuseable
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

				$("#listChainsTimetable").append(
				"<div class='barChainDummy barChainDummy_" + i + "'>"
					+ "<div class='chnTitle'>"
						+ "<img src='img/chain/" + C.parseChainAlias(ithchain.alias).toLowerCase() + I.cPNG + "' />"
						+ "<h1>" + C.truncateTitleString(D.getChainTitleAny(ithchain.nexus), C.cChainTitleCharLimit) + "</h1>"
						+ "<time>" + timestring + "</time>"
					+ "</div>"
				+ "</div>");
			}
		}
		// Highlight current chain
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey())
			.addClass("chnBarCurrent");
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey() + " .chnTitle h1")
			.addClass("chnTitleCurrent");
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey(1) + " .chnTitle h1")
			.addClass("chnTitleFuture");
	},
   
	/*
	 * Sorts the scheduled chains list in the chains content layer. This is
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
					$("#barChain_" + ithchain.nexus).appendTo("#listChainsScheduled");
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
		O.Enact.bol_useCountdown();
		
		/*
		 * Now that the chains are sorted, do cosmetic updates.
		 */
		for (i in C.CurrentChains)
		{
			ithchain = C.CurrentChains[i];
			// Highlight
			$("#barChain_" + ithchain.nexus).addClass("chnBarCurrent");
			// Show the events (details)
			if (C.isChainUnchecked(ithchain) && O.Options.bol_expandEvents)
			{
				$("#chnDetails_" + ithchain.nexus).show("fast");
			}
			
			// Style the title and time
			$("#barChain_" + ithchain.nexus + " h1").first()
				.removeClass("chnTitleFuture chnTitleFutureFar").addClass("chnTitleCurrent");
			$("#barChain_" + ithchain.nexus + " time").first()
				.removeClass("chnTimeFuture chnTimeFutureFar").addClass("chnTimeCurrent");
		}

		for (i in C.PreviousChains1)
		{
			ithchain = C.PreviousChains1[i];
			// Still highlight the previous chain bar but collapse it
			$("#barChain_" + ithchain.nexus)
				.removeClass("chnBarCurrent").addClass("chnBarPrevious");
			// Hide previous chains if opted to automatically expand before
			if (O.Options.bol_expandEvents)
			{
				$("#chnDetails_" + ithchain.nexus).hide();
			}
			
			// Style the title and time
			$("#barChain_" + ithchain.nexus + " h1").first()
				.removeClass("chnTitleCurrent").addClass("chnTitleFutureFar");
			$("#barChain_" + ithchain.nexus + " time").first()
				.removeClass("chnTimeCurrent").addClass("chnTimeFutureFar");
		}
		
		for (i in C.PreviousChains2)
		{
			ithchain = C.PreviousChains2[i];
			// Stop highlighting the previous previous chain bar
			$("#barChain_" + ithchain.nexus).removeClass("chnBarPrevious");
		}
		
		for (i in C.NextChains1)
		{
			ithchain = C.NextChains1[i];
			// Style the title and time
			$("#barChain_" + ithchain.nexus + " h1").first()
				.removeClass("chnTitleFutureFar").addClass("chnTitleFuture");
			$("#barChain_" + ithchain.nexus + " time").first()
				.removeClass("chnTimeFutureFar").addClass("chnTimeFuture");
		}
		
		// Also highlight timetable chain bar
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey(-1))
			.removeClass("chnBarCurrent");
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey())
			.addClass("chnBarCurrent");
		// Current chain title
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey(-1) + " .chnTitle h1")
			.removeClass("chnTitleCurrent");
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey() + " .chnTitle h1")
			.removeClass("chnTitleFuture").addClass("chnTitleCurrent");
		// Future chain title
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey(1) + " .chnTitle h1")
			.addClass("chnTitleFuture");
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
			// Gray out all of the scheduled chain's events
			$(".barChain:not(.barChainCurrent) .chnEvents li").addClass("chnEventPast");
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
	 * event on the map. Also shows/hides event icons if the story chains exists.
	 * Also plays the alarm if it is the final event finishing.
	 * @param object pChain to read from.
	 * @param int pPrimaryEventIndex of the current active event.
	 * @pre Events HTML is generated and map is loaded.
	 */
	highlightEvents: function(pChain, pPrimaryEventIndex)
	{
		var i;
		var animationspeed = 500;
		var eventnamewidth = 320;
		var finalstep = pChain.primaryEvents.length - 1;
		var event;
		
		// Hide past events' markers
		if (pChain.series === C.ChainSeriesEnum.Story)
		{
			for (i in pChain.events)
			{
				event = pChain.events[i];
				event.eventicon._icon.style.display = "none";
				event.eventring._icon.style.display = "none";
			}
			M.StoryEventActive = null;
			M.StoryEventActive = new Array();
		}
		
		// Do event highlights, -1 means the final event's finish time
		if (pPrimaryEventIndex > -1)
		{
			pChain.CurrentPrimaryEvent = pChain.primaryEvents[pPrimaryEventIndex];
			
			// Recolor past events
			for (i = 0; i < pPrimaryEventIndex; i++)
			{
				$(".chnStep_" + pChain.nexus + "_" + i)
					.removeClass("chnEventCurrent").addClass("chnEventPast");
			}
			$(".chnStep_" + pChain.nexus + "_" + (pPrimaryEventIndex - 1))
				.css({opacity: 1}).animate({opacity: 0.5}, animationspeed);
			
			// Recolor current events and animate transition
			$(".chnStep_" + pChain.nexus + "_" + pPrimaryEventIndex).each(function()
			{
				$(this).removeClass("chnEventPast chnEventFuture").addClass("chnEventCurrent")
					.css({width: 0, opacity: 0.5}).animate({width: eventnamewidth, opacity: 1}, animationspeed)
					.css({width: "auto"});
				// Also show current events' markers
				if (pChain.series === C.ChainSeriesEnum.Story)
				{
					event = pChain.events[$(this).attr("data-eventindex")];
					// Add active events to iterable array
					M.StoryEventActive.push(event.eventicon);
					M.StoryEventActive.push(event.eventring);
					
					// Show only if not on map page
					if (I.PageCurrent !== I.PageEnum.Map)
					{
						event.eventicon._icon.style.display = "block";
						event.eventring._icon.style.display = "block";
					}
				}
				M.burySubmaps();
			});
		
			// Recolor future events
			if (pPrimaryEventIndex < pChain.primaryEvents.length)
			{
				for (i = (pPrimaryEventIndex + 1); i < pChain.primaryEvents.length; i++)
				{
					$(".chnStep_" + pChain.nexus + "_" + i)
						.removeClass("chnEventCurrent").addClass("chnEventFuture");
				}
			}
			
			// Tour to the event on the map if opted
			if (O.Options.bol_tourPrediction && I.PageCurrent === I.PageEnum.Chains
				&& M.isMapAJAXDone && C.isChainUnchecked(pChain))
			{
				$("#chnEvent_" + pChain.nexus + "_" + pChain.CurrentPrimaryEvent.num).trigger("click");
			}
		}
		else // Finish time
		{
			pChain.CurrentPrimaryEvent = pChain.primaryEvents[finalstep];
			
			// Recolor all events
			$("#chnEvents_" + pChain.nexus + " li").removeClass("chnEventCurrent").addClass("chnEventPast");
			// Recolor current (final) events as past
			$(".chnStep_" + pChain.nexus + "_" + finalstep)
				.css({opacity: 1}).animate({opacity: 0.5}, animationspeed);
			
			/*
			 * Announce the next world boss and the time until it, only if it's
			 * not past the timeframe, and the subscription option is off.
			 */
			if (O.Options.bol_enableSound && O.Options.bol_alertAtEnd && I.isProgramLoaded
				&& pChain.nexus === C.CurrentChainSD.nexus
				&& pChain.series !== C.ChainSeriesEnum.Story
				&& O.Options.bol_alertSubscribed === false)
			{
				var checked = ", " + D.getSpeech("checked");
				var checkedsd = "";
				var checkedhc = "";
				var wantsd = O.objToBool(C.NextChainSD1);
				var wanthc = O.objToBool(C.NextChainHC1);
				var speech = D.getSpeech("world boss", "next") + " " + D.getSpeech("is") + " ";
				
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
		var hour = T.getTimeOffsetSinceMidnight(T.ReferenceEnum.Server, T.UnitEnum.Hours);
		
		if (pIndex > -1)
		{
			switch (O.Options.int_setPredictor)
			{
				case O.IntEnum.Predictor.Auto:
				{
					// North American playtime in server hour
					if (hour >= 16 && hour < 20)
					{
						return pChain.primaryEvents[pIndex].minSum;
					}
					if (hour >= 20 && hour < 23)
					{
						return pChain.primaryEvents[pIndex].minavgSum;
					}
					if (hour >= 23 || hour < 12)
					{
						return pChain.primaryEvents[pIndex].avgSum;
					}
					if (hour >= 12 && hour < 16)
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
		}
		else
		{
			switch (O.Options.int_setPredictor)
			{
				case O.IntEnum.Predictor.Auto:
				{
					if (hour >= 16 && hour < 20)
					{
						pChain.countdownToFinish = pChain.minFinish;
						return pChain.minFinish;
					}
					if (hour >= 20 && hour < 23)
					{
						pChain.countdownToFinish = pChain.minavgFinish;
						return pChain.minavgFinish;
					}
					if (hour >= 23 || hour < 12)
					{
						pChain.countdownToFinish = pChain.avgFinish;
						return pChain.avgFinish;
					}
					if (hour >= 12 && hour < 16)
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
		}
	}
};

/* =============================================================================
 * @@Map and map control
 * ========================================================================== */
M = {
	/*
	 * http://gw2timer.com/zones.js contains zone (e.g. Queensdale, LA) objects
	 * with their rectangular coordinates.
	 * This is referred to by the variable "M.Zones".
	 */
	Zones: GW2T_ZONE_DATA,
	ZoneAssociations: GW2T_ZONE_ASSOCIATION, // This contains API zone IDs that associates with regular world zones
	cInitialZone: "lion",
	Map: {},
	Resources: {},
	Collectibles: {},
	isMapAJAXDone: false,
	ZoneCurrent: {},
	mousedZoneIndex: null,
	currentIconSize: 32,
	currentRingSize: 256,
	cICON_SIZE_STANDARD: 32,
	cRING_SIZE_MAX: 256,
	cURL_API_TILES: "https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg",
	cURL_API_MAPFLOOR: "https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=1",
	isAPIRetrieved_MAPFLOOR: false,
	isMappingIconsGenerated: false,
	cICON_WAYPOINT: "img/map/waypoint.png",
	cICON_WAYPOINTOVER: "img/map/waypoint_h.png",
	cICON_LANDMARK: "img/map/landmark.png",
	cICON_LANDMARKOVER: "img/map/landmark_h.png",
	cICON_VISTA: "img/map/vista.png",
	cICON_SKILL: "img/map/skill.png",
	cICON_HEART: "img/map/heart.png",
	cLEAFLET_PATH_OPACITY: 0.5,
	cMAP_BOUND: 32768, // The map is a square
	cMAP_CENTER: [16384, 16384],
	cMAP_MOUSEMOVE_RATE: 100,
	cZoomLevelFactor: 2,
	ZoomLevelEnum:
	{
		Min: 0,
		Default: 3,
		Space: 3,
		Sky: 5,
		Bird: 6,
		Ground: 7,
		Max: 7
	},
	cZIndexBury: -999999,
	
	PinPersonal: {},
	PinProgram: {},
	PinEvent: {},
	PinOver: {},
	/*
	 * All objects in the map (such as paths and markers) shall be called "entities".
	 * Markers can have custom properties assigned; they can be accessed using
	 * "THEMARKER.options.THEPROPERTY" format.
	 */
	MappingEnum:
	{
		Sector: 0,
		Waypoint: 1,
		Landmark: 2,
		Vista: 3,
		Skill: 4,
		Heart: 5
	},
	APIPOIEnum:
	{
		Sector: "sectors",
		Waypoint: "waypoint",
		Landmark: "landmark",
		Vista: "vista",
		Skill: "skill_challenges",
		Heart: "tasks"
	},
	// Utility pin markers, looks like GW2 personal waypoints
	PinEntities: new Array(),
	DailyEntities: new Array(),
	JPEntities: new Array(),
	ChainPathEntities: new Array(),
	isShowingIconsForDaily: true,
	isShowingIconsForResource: false,
	isShowingIconsForJP: true,
	isShowingIconsForCollectible: false,
	
	// Submap for showing maps that aren't in the API (actually Leaflet markers)
	SubmapEntities: new Array(),
	SubmapTemp: {},
	
	// Story event icons and event rings map entities
	StoryEventIcons: new Array(),
	StoryEventRings: new Array(),
	StoryEventActive: new Array(),
	
	/*
	 * Gets a GW2T zone object from an API zone ID.
	 * @param pString zone ID.
	 */
	getZoneFromID: function(pString)
	{
		return M.Zones[M.ZoneAssociations[pString]];
	},
	
	/*
	 * Gets a zone's translated name if available.
	 * @param string pNick name of the zone to retrieve, or a zone object itself.
	 * @returns string zone name.
	 */
	getZoneName: function(pNick)
	{
		// Polymorphic function
		var zone;
		if (typeof(pNick) === "string" && M.Zones[pNick])
		{
			zone = M.Zones[pNick];
		}
		else if (pNick["name"])
		{
			zone = pNick;
		}
		else
		{
			return "nozonename";
		}
		
		// Now get the name
		if (M.isAPIRetrieved_MAPFLOOR && D.isLanguageSecondary() === true)
		{
			return zone["name_" + D.getFullySupportedLanguage()];
		}
		else
		{
			return zone["name"];
		}
	},
	
	/*
	 * Initializes the Leaflet map, adds markers, and binds events.
	 */
	initializeMap: function()
	{
		// M.Map is the actual Leaflet map object, initialize it
		M.Map = L.map("paneMap", {
			minZoom: M.ZoomLevelEnum.Min,
			maxZoom: M.ZoomLevelEnum.Max,
			inertiaThreshold: 100, // Milliseconds between drag and release to flick pan
			doubleClickZoom: false,
			zoomControl: false, // Hide the zoom UI
			attributionControl: false, // Hide the Leaflet link UI
			crs: L.CRS.Simple
		}).setView([-128, 128], M.ZoomLevelEnum.Default);
		
		// Set layers
		L.tileLayer(M.cURL_API_TILES,
		{
			continuousWorld: true
		}).addTo(M.Map);
		
		// Initialize array in zones to later hold waypoint map markers
		for (var i in M.Zones)
		{
			M.Zones[i].ZoneEntities = new Array();
			M.Zones[i].center = M.getZoneCenter(i);
			M.Zones[i].nick = i;
		}
		
		// Do other initialization functions
		P.generateSubmaps();
		P.populateMap();
		P.drawChainPaths();

		/*
		 * Clicking an empty place on the map highlight its coordinate.
		 */
		M.Map.on("click", function(pEvent)
		{
			var coord = M.convertLCtoGC(pEvent.latlng);
			$("#mapCoordinatesStatic")
				.val("[" + coord[0] + ", " + coord[1] + "]")
				.select();
		});
		
		/*
		 * Move the personal pin marker to where the user double clicks.
		 */
		M.Map.on("dblclick", function(pEvent)
		{
			M.PinPersonal.setLatLng(pEvent.latlng);
		});
		
		/*
		 * Go to the coordinates in the bar when user presses enter.
		 */
		$("#mapCoordinatesStatic").bind("enterKey", function()
		{
			var coord = M.parseCoordinates($(this).val());
			coord[0] = Math.floor(coord[0]);
			coord[1] = Math.floor(coord[1]);
			$("#mapCoordinatesStatic")
				.val("[" + coord[0] + ", " + coord[1] + "]")
				.select();
			
			if (coord[0] !== "" && coord.length === 2)
			{
				M.goToView(coord, M.PinPersonal);
			}
		}).keyup(function(pEvent)
		{
			if(pEvent.keyCode === 13) // code for Enter key
			{
				$(this).trigger("enterKey");
			}
		});
		
		/*
		 * Hide the right panel if click on the map compass.
		 */
		$("#mapCompassButton").click(function()
		{
			$("#panelRight").toggle();
		});
	}, // End of map initialization
	
	/*
	 * Finds what zone the specified point is in by comparing it to the top left
	 * and bottom right coordinates of the zones, then show the zone's visuals.
	 * @param array pCoord containing x and y coordinates.
	 * @pre Zone perimeters do not intersect.
	 */
	showCurrentZone: function(pCoord)
	{
		document.getElementById("mapCoordinatesDynamic")
			.value = pCoord[0] + ", " + pCoord[1];
		
		var i, ii1, ii2;
		var zonename = "";
		var entity;
		var entitytype;
		
		for (i in M.Zones)
		{
			var zonex1 = M.Zones[i].rect[0][0];
			var zoney1 = M.Zones[i].rect[0][1];
			var zonex2 = M.Zones[i].rect[1][0];
			var zoney2 = M.Zones[i].rect[1][1];

			if (pCoord[0] >= zonex1
				&& pCoord[0] <= zonex2
				&& pCoord[1] >= zoney1
				&& pCoord[1] <= zoney2)
			{
				/*
				 * If got here then i is the index of the current moused zone.
				 * To not waste computation, only update the coordinates bar and
				 * reveal the zone waypoints if the found zone is different from
				 * the previously moused zone.
				 */
				if (i !== M.mousedZoneIndex)
				{
					// Note that the master index was initialized as null
					if (M.mousedZoneIndex !== null)
					{
						// Hide the icons of the previously moused zone
						for (ii1 in M.Zones[M.mousedZoneIndex].ZoneEntities)
						{
							M.Zones[M.mousedZoneIndex].ZoneEntities[ii1]
								._icon.style.display = "none";
						}
					}
					// Update the master moused zone index to the current index
					M.mousedZoneIndex = i;
					M.ZoneCurrent = M.Zones[i];
					zonename = M.getZoneName(M.ZoneCurrent);
					document.getElementById("mapCoordinatesRegion")
						.value = zonename;
					
				
					// Reveal moused zone's icons
					for (ii2 in M.ZoneCurrent.ZoneEntities)
					{
						entity = M.ZoneCurrent.ZoneEntities[ii2];
						entitytype = entity.options.mappingtype;
						if ( (entitytype === M.MappingEnum.Waypoint && O.Options.bol_displayWaypoints)
							|| (entitytype === M.MappingEnum.Landmark && O.Options.bol_displayPOIs)
							|| (entitytype === M.MappingEnum.Vista && O.Options.bol_displayVistas)
							|| (entitytype === M.MappingEnum.Skill && O.Options.bol_displaySkills)
							|| (entitytype === M.MappingEnum.Heart && O.Options.bol_displayHearts)
							|| (entitytype === M.MappingEnum.Sector && O.Options.bol_displaySectors) )
						{
							entity._icon.style.display = "block";
						}
					}
					
					// Rescale current moused mapping markers
					M.adjustZoomMapping();
				}
				return; // Already found zone so stop searching
			}
		}
	},
	
	/*
	 * Gets the center coordinates of a zone.
	 * @param string pNick short name of the zone.
	 * @returns array of x and y coordinates.
	 */
	getZoneCenter: function(pNick)
	{
		var rect = M.Zones[pNick].rect;
		// x = OffsetX + (WidthOfZone/2), y = OffsetY + (HeightOfZone/2)
		var x = rect[0][0] + ~~((rect[1][0] - rect[0][0]) / 2);
		var y = rect[0][1] + ~~((rect[1][1] - rect[0][1]) / 2);
		return [x, y];
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
		pZoomLevel = pZoomLevel || M.Map.getZoom();
		return parseInt(pMaxDimension / (Math.pow(M.cZoomLevelFactor, (M.ZoomLevelEnum.Max) - pZoomLevel)));
	},
	
	/*
	 * Resizes mapping markers so they scale with the current zoom level.
	 */
	adjustZoomMapping: function()
	{
		var i;
		var entity;
		var currentzoom = M.Map.getZoom();
		var waypointsize, landmarksize;
		var sectorfontsize, sectoropacity;
		
		switch (currentzoom)
		{
			case 7: waypointsize = 40; landmarksize = 32; break;
			case 6: waypointsize = 32; landmarksize = 24; break;
			case 5: waypointsize = 26; landmarksize = 16; break;
			case 4: waypointsize = 20; landmarksize = 0; break;
			case 3: waypointsize = 16; landmarksize = 0; break;
			default: { waypointsize = 0; landmarksize = 0; }
		}

		// Resize mapping icons in moused zone
		for (i in M.ZoneCurrent.ZoneEntities)
		{
			entity = M.ZoneCurrent.ZoneEntities[i];
			switch (entity.options.mappingtype)
			{
				case M.MappingEnum.Waypoint:
				{
					M.changeMarkerIcon(entity, M.cICON_WAYPOINT, waypointsize);
				} break;
				
				case M.MappingEnum.Landmark:
				{
					M.changeMarkerIcon(entity, M.cICON_LANDMARK, landmarksize);
					// Fade icon if not in max zoom
					if (currentzoom < M.ZoomLevelEnum.Max)
					{
						entity._icon.style.opacity = 0.6;
					}
					else
					{
						entity._icon.style.opacity = 0.8;
					}
				} break;
				
				case M.MappingEnum.Vista:
				{
					M.changeMarkerIcon(entity, M.cICON_VISTA, landmarksize);
				} break;
				
				case M.MappingEnum.Skill:
				{
					M.changeMarkerIcon(entity, M.cICON_SKILL, landmarksize);
				} break;
				
				case M.MappingEnum.Heart:
				{
					M.changeMarkerIcon(entity, M.cICON_HEART, landmarksize);
				} break;
				
				case M.MappingEnum.Sector:
				{
					switch (currentzoom)
					{
						case 7: sectorfontsize = "28px"; sectoropacity = 0.9; break;
						case 6: sectorfontsize = "20px"; sectoropacity = 0.6; break;
						case 5: sectorfontsize = "16px"; sectoropacity = 0.3; break;
						default: { sectorfontsize = "0px"; sectoropacity = 0;  }
					}
					entity._icon.style.fontSize = sectorfontsize;
					entity._icon.style.opacity = sectoropacity;
					entity._icon.style.zIndex = M.cZIndexBury + 1; // Don't cover other icons
					if (O.Options.bol_displaySectors)
					{
						entity._icon.style.display = "table"; // For middle vertical alignment
					}
				} break;
			}
		}
		M.burySubmaps();
	},
	
	/*
	 * Resizes story markers and submaps so they scale with the current zoom level.
	 */
	adjustZoomEvent: function()
	{
		var i;
		var currentzoom = M.Map.getZoom();
		var icon;
		var submap;
		var submapwidth;
		var submapheight;
		
		switch (currentzoom)
		{
			case 7: M.currentIconSize = 32; break;
			case 6: M.currentIconSize = 28; break;
			case 5: M.currentIconSize = 24; break;
			case 4: M.currentIconSize = 20; break;
			case 3: M.currentIconSize = 16; break;
			default:
			{
				M.currentIconSize = 0;
			}
		}
		
		// Rescale submaps if exist
		if (M.SubmapEntities.length > 0)
		{
			M.setEntityGroupDisplay(M.SubmapEntities, "show");
			for (i in M.SubmapEntities)
			{
				submap = M.SubmapEntities[i];
				submapwidth = M.scaleDimension(submap.spatiality.maxwidth);
				submapheight = M.scaleDimension(submap.spatiality.maxheight);

				submap.setIcon(new L.icon(
				{
					iconUrl: submap._icon.src,
					iconSize: [submapwidth, submapheight],
					iconAnchor: [0, 0]
				}));
				// Bury the submaps so other markers are visible
				M.SubmapEntities[i]._icon.style.zIndex = M.cZIndexBury;
			}
		}
		
		// Resize story event icons if exist
		if (M.StoryEventIcons.length > 0)
		{
			// Event icons are same size as waypoints, but their rings are bigger
			M.currentRingSize = M.scaleDimension(M.cRING_SIZE_MAX);

			for (i in M.StoryEventIcons)
			{
				icon = M.StoryEventIcons[i];
				M.changeMarkerIcon(icon, icon._icon.src, M.currentIconSize);
				icon = M.StoryEventRings[i];
				M.changeMarkerIcon(icon, icon._icon.src, M.currentRingSize);
				// Don't make the rings overlap clickable waypoints
				M.StoryEventIcons[i]._icon.style.zIndex = 1000;
				M.StoryEventRings[i]._icon.style.zIndex = 1;
			}
		}
	},
	
	/*
	 * Sets the submaps' z-index extremely low so other markers are visible.
	 */
	burySubmaps: function()
	{
		if (M.SubmapEntities.length > 0)
		{
			for (var i in M.SubmapEntities)
			{
				M.SubmapEntities[i]._icon.style.zIndex = M.cZIndexBury;
			}
		}
	},
	
	/*
	 * Bindings for map events that need to be done after AJAX has loaded the
	 * API-generated markers.
	 */
	bindMapVisualChanges: function()
	{
		/*
		 * Bind the mousemove event to update the map coordinate bar.
		 * Note that the throttle function is from a separate script. It permits
		 * the event handler to only run once every so specified milliseconds.
		 */
		M.Map.on("mousemove", $.throttle(M.cMAP_MOUSEMOVE_RATE, function(pEvent)
		{
			M.showCurrentZone(M.convertLCtoGC(pEvent.latlng));
		}));
		
		/*
		 * At the start of a zoom change hide submaps so they do not cover the map.
		 */
		M.Map.on("zoomstart", function(pEvent)
		{
			if (M.SubmapEntities.length > 0)
			{
				M.setEntityGroupDisplay(M.SubmapEntities, "hide");
			}
		});

		/*
		 * At the end of a zoom animation, resize the map waypoint icons
		 * depending on zoom level. Hide if zoomed too far.
		 */
		M.Map.on("zoomend", function(pEvent)
		{
			M.adjustZoomMapping();
			M.adjustZoomEvent();
		});
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
			pSize = M.cICON_SIZE_STANDARD;
		}
		
		pMarker.setIcon(new L.icon(
		{
			iconUrl: pIconURL,
			iconSize: [pSize, pSize],
			iconAnchor: [pSize/2, pSize/2]
		}));
	},
	
	/*
	 * Macro function for toggling map entities display (Leaflet doesn't have a
	 * hide/show markers and paths method except through its own UI).
	 * @param array pEntityGroup objects like paths and markers.
	 * @param string pDisplay to show or hide.
	 */
	setEntityGroupDisplay: function(pEntityGroup, pDisplay)
	{
		var i;
		var display;
		var entity;
		
		if (pDisplay === false || pDisplay === "hide" || pDisplay < 0)
		{
			display = "none";
		}
		else
		{
			display = "block";
		}
		
		for (i in pEntityGroup)
		{
			entity = pEntityGroup[i];
			if (entity._container !== undefined) // If it's a vector (like paths)
			{
				entity._container.style.display = display;
			}
			else // If it's a marker
			{
				entity._icon.style.display = display;
			}
		}
	},
	
	/*
	 * Views the map at the specifications.
	 * @param array pCoord two number coordinates.
	 * @param object pPin which to move to coordinate.
	 * @param enum pZoom level.
	 */
	goToView: function(pCoord, pPin, pZoom)
	{
		if (pPin === undefined)
		{
			pPin = M.PinProgram;
		}
		if (pPin !== null)
		{
			pPin.setLatLng(M.convertGCtoLC(pCoord));
		}
		
		var zoom;
		if (pZoom)
		{
			zoom = pZoom;
		}
		else
		{
			zoom = M.ZoomLevelEnum.Ground;
		}
		M.Map.setView(M.convertGCtoLC(pCoord), zoom);
		M.showCurrentZone(pCoord);
	},
	
	/*
	 * Views the map at the given URL coordinates if exist.
	 * URL should be in the form of http://gw2timer.com/?go=[4874,16436,1]
	 * coords[0] = x coordinate.
	 * coords[1] = y coordinate.
	 * coords[2] = z coordinate (zoom level, lower value equals greater zoom-in).
	 */
	goToURLCoords: function()
	{
		var args = U.Args[U.KeyEnum.Go];
		var coords = [];
		var zone;
		if (args)
		{
			coords = M.parseCoordinates(args);
			if (coords.length === 2)
			{
				if (isFinite(coords[0]) && isFinite(coords[1]))
				{
					M.goToView(coords, M.PinPersonal);
				}
			}
			else if (coords.length >= 3)
			{
				if (isFinite(coords[0]) && isFinite(coords[1]) && isFinite(coords[2]))
				{
					var zoomlevel = M.ZoomLevelEnum.Max - T.wrapInteger(coords[2], M.ZoomLevelEnum.Max);
					M.goToView([coords[0], coords[1]], M.PinPersonal, zoomlevel);
				}
			}
			else
			{
				// Else assume the argument is a short name for the zone
				zone = args.toLowerCase();
				if (M.Zones[zone])
				{
					M.goToView(M.getZoneCenter(zone), null, M.ZoomLevelEnum.Bird);
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
		return M.Map.unproject(pCoord, M.Map.getMaxZoom());
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
			latlngs.push(M.convertGCtoLC(pCoordArray[i]));
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
		var coord = M.Map.project(pLatLng, M.ZoomLevelEnum.Max);
		return [Math.floor(coord.x), Math.floor(coord.y)];
	},
	
	/*
	 * Converts a coordinate string to array coordinates.
	 * @param string pString coordinates in the form of "[X, Y]" GW2 coords.
	 * @returns array pCoord array of numbers.
	 */
	parseCoordinates: function(pString)
	{
		// The regex strips all characters except digits, commas, periods, and minus sign
		var coord = pString.replace(/[^\d,-.]/g, "");
		return coord.split(",");
	},
	
	/*
	 * Gets the coordinates from the data attribute of an HTML element.
	 * @param jqobject pElement to extract from.
	 * @returns array of GW2 coordinates.
	 */
	getElementCoordinates: function(pElement)
	{
		return M.parseCoordinates(pElement.attr("data-coord"));
	},

	/*
	 * Converts a poi_id number from maps_floor.json to a valid chat link.
	 * Code from http://virtus-gilde.de/gw2map
	 */ 
	getChatlinkFromPoiID: function(pPoiID)
	{
	   var chatcode = String.fromCharCode(4);

		// Create unicode characters from the id
	   for (var i = 0; i < 4; i++)
	   {
		   chatcode += String.fromCharCode((pPoiID >> (i * 8)) & 255);
	   }

	   // Return base64 string with chat code tags
	   return "[&" + btoa(chatcode) + "]";
	},
	
	/*
	 * Binds map view event handlers to all map links (ins tag reserved) in the
	 * specified container.
	 * @param string pContainer element ID.
	 */
	bindMapLinks: function(pContainer)
	{
		$(pContainer + " ins").each(function()
		{
			$(this).text("[" + $(this).text() + "]");
			M.bindMapLinkBehavior($(this), M.PinProgram);
		});
	},
	
	/*
	 * Binds specified link to move a pinpoint to the location when hovered, and
	 * to view the map location when clicked.
	 * @param jqobject pLink to bind.
	 * @param object pPin marker to move.
	 * @param string pZoom level when viewed location.
	 */
	bindMapLinkBehavior: function(pLink, pPin, pZoom)
	{
		pLink.click(function()
		{
			var thiscoord = M.getElementCoordinates($(this));
			M.goToView(thiscoord, pPin, pZoom);
		});
		
		// Move a point pin to that location as a preview
		pLink.mouseover(function()
		{
			var thiscoord = M.getElementCoordinates($(this));
			M.PinOver.setLatLng(M.convertGCtoLC(thiscoord));
		});
		pLink.mouseout(function()
		{
			M.PinOver.setLatLng(M.convertGCtoLC([0,0]));
		});
	},
	
	/*
	 * Binds standard zoom in/out when user do something to an icon on the map.
	 * @param object pMarker to bind.
	 * @param string pEventType like "click" or "dblclick".
	 */
	bindMarkerZoomBehavior: function(pMarker, pEventType)
	{
		pMarker.on(pEventType, function(pEvent)
		{
			if (M.Map.getZoom() === M.ZoomLevelEnum.Max)
			{
				M.Map.setZoom(M.ZoomLevelEnum.Default);
			}
			else
			{
				M.Map.setView(pEvent.latlng, M.ZoomLevelEnum.Max);
			}
		});
	},
	bindMappingZoomBehavior: function(pMarker, pEventType)
	{
		pMarker.on(pEventType, function(pEvent)
		{
			if (M.Map.getZoom() === M.ZoomLevelEnum.Max)
			{
				M.Map.setZoom(M.ZoomLevelEnum.Sky);
			}
			else
			{
				M.Map.setView(pEvent.latlng, M.ZoomLevelEnum.Max);
			}
		});
	},
	
	/*
	 * Translates the zones list in the Map page and bind click zoom behavior.
	 * @pre The translated names from the API was retrieved.
	 */
	bindZoneList: function()
	{
		$("#layerMap .mapZones li").each(function()
		{
			var zonenick = $(this).attr("data-zone");
			$(this).text(M.getZoneName(zonenick));
			$(this).attr("data-coord", M.getZoneCenter(zonenick).toString());
			M.bindMapLinkBehavior($(this), null, M.ZoomLevelEnum.Sky);
		});
	},
	
	/*
	 * Hides all the Map page's section icons by triggering the toggle button of each section.
	 */
	displayIcons: function(pSection, pWantShow)
	{
		var i;
		// Hide all icons if no parameters given
		if (pSection === undefined || pSection === null)
		{
			if (M.isShowingIconsForDaily)
			{
				$("#mapToggle_Daily").trigger("click");
			}
			
			if (M.isShowingIconsForResource)
			{
				$("#mapToggle_Resource").trigger("click");
			}
			else
			{
				$("#mapToggle_Resource").trigger("click").trigger("click");
			}
			
			if (M.isShowingIconsForCollectible)
			{
				$("#mapToggle_Collectible").trigger("click");
			}
			else
			{
				$("#mapToggle_Collectible").trigger("click").trigger("click");
			}
			
			if (M.isShowingIconsForJP)
			{
				$("#mapToggle_JP").trigger("click");
			}
		}
		else
		{
			if (pWantShow)
			{
				if ( ! M["isShowingIconsFor" + pSection])
				{
					$("#mapToggle_" + pSection).trigger("click");
				}
				
				// If article URL query string exists, only show collectible of specified index
				if (I.ArticleCurrent >= 0)
				{
					switch (pSection)
					{
						case "Collectible":
						{
							for (i in M.Collectibles)
							{
								if ("Collectible" + I.ArticleCurrent !== i)
								{
									// Trigger the unchecking of the non-target collectible type, thereby hiding it
									$("#ned_" + i).trigger("click");
								}
							}
						} break;
					}
					// Nullify article value so this selective display only executes once
					U.Args[U.KeyEnum.Article] = null;
				}
			}
			else
			{
				if (pSection === "Resource")
				{
					if (M["isShowingIconsFor" + pSection])
					{
						$("#mapToggle_" + pSection).trigger("click");
					}
					else
					{
						$("#mapToggle_" + pSection).trigger("click").trigger("click");
					}
				}
				else if (pSection === "Collectible")
				{
					if (M["isShowingIconsFor" + pSection])
					{
						$("#mapToggle_" + pSection).trigger("click");
					}
					else
					{
						$("#mapToggle_" + pSection).trigger("click").trigger("click");
					}
				}
				else
				{
					if (M["isShowingIconsFor" + pSection])
					{
						$("#mapToggle_" + pSection).trigger("click");
					}
				}
				
			}
		}
	}
	
};

/* =============================================================================
 * @@Populate map functions and Map page
 * ========================================================================== */
P = {
	
	/*
	 * Create submaps that are giant markers with an image of a map area.
	 * Used for temporary zones that hasn't been put in the API tileset.
	 */
	generateSubmaps: function()
	{
		M.SubmapTemp = P.createSubmap([2048, 1536], [3713, 15681], "http://i.imgur.com/nB9kM3O.jpg");
	},
	
	/*
	 * Creates and returns a submap.
	 * @param int[] pDimensions width and height array.
	 * @param int[] pCoord x,y array.
	 * @param string pURL image of submap.
	 * @returns object Leaflet marker.
	 */
	createSubmap: function(pDimensions, pCoord, pURL)
	{
		var width = M.scaleDimension(pDimensions[0]);
		var height = M.scaleDimension(pDimensions[1]);
		var submap = L.marker(M.convertGCtoLC([pCoord[0], pCoord[1]]),
		{
			icon: L.icon(
			{
				iconUrl: pURL,
				iconSize: [width, height],
				iconAnchor: [0, 0]
			}),
			draggable: false,
			clickable: false
		}).addTo(M.Map);
		submap.spatiality = {maxwidth: pDimensions[0], maxheight: pDimensions[1]};
		M.SubmapEntities.push(submap);
		return submap;
	},
	
	/*
	 * Creates a pin in the map to be assigned to a reference object.
	 * @param string pIconURL image of the marker.
	 * @returns object Leaflet marker.
	 */
	createPin: function(pIconURL)
	{
		return L.marker(M.convertGCtoLC([0,0]),
		{
			icon: L.icon(
			{
				iconUrl: pIconURL,
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			}),
			draggable: true
		}).addTo(M.Map);
	},
	
	/*
	 * Initializes map waypoints and other markers from the GW2 server API files.
	 */
	populateMap: function()
	{
		M.cURL_API_MAPFLOOR += "&lang=" + D.getFullySupportedLanguage();
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
		$.getJSON(M.cURL_API_MAPFLOOR, function(pData)
		{//
			var i;
			var region, zoneid, zone, poi;
			var numofpois;
			var mappingentity;
			var icon;
			var cssclass;
			var mappingtype;
			var tooltip;

			for (region in pData.regions)
			{
				region = pData.regions[region];

				for (zoneid in region.maps)
				{
					// Don't bother parsing if not a regular world zone
					if ( ! M.ZoneAssociations[zoneid])
					{
						continue;
					}
					
					zone = region.maps[zoneid];
					// Remember zone name
					if (D.isLanguageSecondary())
					{
						M.getZoneFromID(zoneid)["name_" + D.getFullySupportedLanguage()] = zone.name;
					}
					
					/* 
					 * For waypoints, points of interest, and vistas.
					 */
					numofpois = zone.points_of_interest.length;
					for (i = 0; i < numofpois; i++)
					{
						poi = zone.points_of_interest[i];

						// Properties assignment based on POI's type
						switch (poi.type)
						{
							case M.APIPOIEnum.Waypoint:
							{
								// Waypoints are always created, others are optional
								mappingtype = M.MappingEnum.Waypoint;
								icon = M.cICON_WAYPOINT;
								cssclass = "mapWp";
								tooltip = poi.name;
							} break;
							
							case M.APIPOIEnum.Landmark:
							{
								if (O.Options.bol_showWorldCompletion === false)
								{
									continue;
								}
								mappingtype = M.MappingEnum.Landmark;
								icon = M.cICON_LANDMARK;
								cssclass = "mapPoi";
								tooltip = poi.name;
							} break;
							
							case M.APIPOIEnum.Vista:
							{
								if (O.Options.bol_showWorldCompletion === false)
								{
									continue;
								}
								mappingtype = M.MappingEnum.Vista;
								icon = M.cICON_VISTA;
								cssclass = "mapPoi";
								tooltip = D.getPhrase("Vista");
							} break;
							
							default: continue; // Don't create marker if not desired type
						}

						mappingentity = L.marker(M.convertGCtoLC(poi.coord),
						{
							title: "<span class='" + cssclass + "'>" + tooltip + "</span>",
							entityname: poi.name,
							mappingtype: mappingtype,
							icon: L.icon(
							{
								iconUrl: icon,
								iconSize: [16, 16], // Initial size corresponding to default zoom level
								iconAnchor: [8, 8]
							}),
							link: M.getChatlinkFromPoiID(poi.poi_id)
						}).addTo(M.Map);
						// Initially hide all the icons
						mappingentity._icon.style.display = "none";
						// Bind behavior
						switch (poi.type)
						{
							case "waypoint":
							{
								mappingentity.on("mouseout", function()
								{
									this._icon.src = M.cICON_WAYPOINT;
								});
								mappingentity.on("mouseover", function()
								{
									this._icon.src = M.cICON_WAYPOINTOVER;
								});
							} break;
							case "landmark":
							{
								mappingentity.on("mouseout", function()
								{
									this._icon.src = M.cICON_LANDMARK;
								});
								mappingentity.on("mouseover", function()
								{
									this._icon.src = M.cICON_LANDMARKOVER;
								});
							} break;
						}
						// Clicking on waypoints or POIs gives a chatcode
						if (poi.type === "waypoint" || poi.type === "landmark")
						{
							mappingentity.on("click", function()
							{
								$("#mapCoordinatesStatic").val(this.options.link).select();
								$("#mapCoordinatesRegion").val(this.options.entityname);
							});
							M.bindMappingZoomBehavior(mappingentity, "dblclick");
						}
						else
						{
							M.bindMappingZoomBehavior(mappingentity, "click");
						}
						
						// Assign the waypoint to its zone
						M.getZoneFromID(zoneid).ZoneEntities.push(mappingentity);
					}
					
					/*
					 * For API separate arrays for pois.
					 */
					if (O.Options.bol_showWorldCompletion)
					{
						// Skill Challenges
						numofpois = zone.skill_challenges.length;
						for (i = 0; i < numofpois; i++)
						{
							poi = zone.skill_challenges[i];
							mappingentity = L.marker(M.convertGCtoLC(poi.coord),
							{
								title: "<span class='" + "mapPoi" + "'>" + D.getPhrase("Skill Challenge") + "</span>",
								mappingtype: M.MappingEnum.Skill,
								icon: L.icon(
								{
									iconUrl: M.cICON_SKILL,
									iconSize: [16, 16],
									iconAnchor: [8, 8]
								})
							}).addTo(M.Map);
							mappingentity._icon.style.display = "none";
							M.bindMappingZoomBehavior(mappingentity, "click");
							M.getZoneFromID(zoneid).ZoneEntities.push(mappingentity);
						}
						
						// Renown Hearts
						numofpois = zone.tasks.length;
						for (i = 0; i < numofpois; i++)
						{
							poi = zone.tasks[i];
							mappingentity = L.marker(M.convertGCtoLC(poi.coord),
							{
								title: "<span class='" + "mapPoi" + "'>" + poi.objective + " (" + poi.level + ")" + "</span>",
								task: poi.objective,
								mappingtype: M.MappingEnum.Heart,
								icon: L.icon(
								{
									iconUrl: M.cICON_HEART,
									iconSize: [16, 16],
									iconAnchor: [8, 8]
								})
							}).addTo(M.Map);
							mappingentity._icon.style.display = "none";
							mappingentity.on("click", function(pEvent)
							{
								var heartname = this.options.task;
								// Trim trailing period if exists
								if (heartname.indexOf(".") === heartname.length - 1)
								{
									heartname = heartname.slice(0, -1);
								}
								window.open(U.convertExternalURL(U.getWikiLanguageLink(heartname)), "_blank");
							});
							M.getZoneFromID(zoneid).ZoneEntities.push(mappingentity);
						}
						
						// Sector Names
						numofpois = zone.sectors.length;
						for (i = 0; i < numofpois; i++)
						{
							poi = zone.sectors[i];
							mappingentity = L.marker(M.convertGCtoLC(poi.coord),
							{
								clickable: false,
								mappingtype: M.MappingEnum.Sector,
								icon: L.divIcon(
								{
									className: "mapSec",
									html: "<span class='mapSecIn'>" + poi.name + "</span>",
									iconSize: [512, 64],
									iconAnchor: [256, 32]
								})
							}).addTo(M.Map);
							mappingentity._icon.style.display = "none";
							M.getZoneFromID(zoneid).ZoneEntities.push(mappingentity);
						}
						
						M.isMappingIconsGenerated = true;
					}
				}
			}
		}).done(function() // Map is populated by AJAX
		{
			M.isAPIRetrieved_MAPFLOOR = true;
			
			/*
			 * AJAX takes a while so can use this to advantage to delay graphics
			 * that seem out of place without a map loaded.
			 */
			if (O.Options.bol_showChainPaths === true && I.PageCurrent !== I.PageEnum.Map)
			{
				M.setEntityGroupDisplay(M.ChainPathEntities, "show");
			}
			
			if (O.Options.bol_tourPrediction && I.PageCurrent === I.PageEnum.Chains
				&& U.Args[U.KeyEnum.Go] === undefined)
			{
				// Initialize the "current moused zone" variable for showing waypoints
				M.showCurrentZone(M.getZoneCenter(M.cInitialZone));
				// Tour to the event on the map if opted
				$("#chnEvent_" + C.CurrentChainSD.nexus + "_"
					+ C.CurrentChainSD.CurrentPrimaryEvent.num).trigger("click");
			}
			/*
			 * Start tooltip plugin after the markers were loaded, because it
			 * reads the title attribute and convert them into a div "tooltip".
			 */
			I.qTip.init(".leaflet-marker-icon");
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
				+ "Map features will be limited.<br />", 30);
			}
		}).always(function() // Do after AJAX regardless of success/failure
		{
			M.isMapAJAXDone = true;
			M.bindMapVisualChanges();
			M.adjustZoomMapping();
			M.adjustZoomEvent();
			M.goToURLCoords();
		});
		
		/*
		 * Create pin markers that can be moved by user or program.
		 * ---------------------------------------------------------------------
		 */
		M.PinPersonal = P.createPin("img/map/pin_white.png");
		M.PinProgram = P.createPin("img/map/pin_blue.png");
		M.PinEvent = P.createPin("img/map/pin_green.png");
		M.PinOver = L.marker(M.convertGCtoLC([0,0]),
		{
			icon: L.icon(
			{
				iconUrl: "img/map/pin_over.png",
				iconSize: [128, 128],
				iconAnchor: [64, 64]
			}),
			draggable: true
		}).addTo(M.Map);
		
		// Add to array for iteration
		M.PinEntities.push(M.PinPersonal);
		M.PinEntities.push(M.PinProgram);
		M.PinEntities.push(M.PinEvent);
		M.PinEntities.push(M.PinOver);
		
		// Bind pin click event to get coordinates in the coordinates bar
		for (var i in M.PinEntities)
		{
			M.PinEntities[i].on("click", function()
			{
				var coord = M.convertLCtoGC(this.getLatLng());
				$("#mapCoordinatesStatic")
					.val("[" + coord[0] + ", " + coord[1] + "]")
					.select();
			});
			M.PinEntities[i].on("dblclick", function()
			{
				this.setLatLng(M.convertGCtoLC([0,0]));
			});
		}	
	}, // End of populateMap
	
	/*
	 * Creates polylines for the map based on event's path data, then add event
	 * coordinates to the event names HTML so the map views the location when
	 * user clicks on it. Also creates icons for story events if exist.
	 */
	drawChainPaths: function()
	{
		var i, ii;
		var chain, event, primaryevent;
		var color;
		var coords;
		
		for (i in C.Chains)
		{
			chain = C.Chains[i];
			for (ii = 0; ii < chain.primaryEvents.length; ii++)
			{
				primaryevent = chain.primaryEvents[ii];

				switch (ii)
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
				M.ChainPathEntities.push(L.polyline(coords, {color: color}).addTo(M.Map));
			}
			
			/*
			 * Go to the event location when clicked on event name.
			 */
			var eventnum;
			for (ii in chain.events)
			{
				event = chain.events[ii];
				eventnum = event.num;
				if (eventnum.indexOf(".") !== -1)
				{
					// jQuery thinks the period is a class, escape it
					eventnum = eventnum.replace(".", "\\.");
				}
				$("#chnEvent_" + chain.nexus + "_" + eventnum).each(function()
				{
					// Assign a data attribute to the event name
					var coord = event.path[0];
					$(this).attr("data-coord", coord[0] + "," + coord[1]);
					$(this).attr("data-eventindex", ii);
					// Read the attribute and use the coordinate when clicked for touring
					M.bindMapLinkBehavior($(this), M.PinEvent);
				});
				
				// Create event icons for story chains, they will be resized by the zoomend function
				if (chain.series === C.ChainSeriesEnum.Story)
				{
					event.eventring = L.marker(M.convertGCtoLC(event.path[0]),
					{
						clickable: false,
						icon: L.icon(
						{
							iconUrl: "img/ring/" + event.ring + I.cPNG,
							iconSize: [32, 32],
							iconAnchor: [16, 16]
						})
					}).addTo(M.Map);
					event.eventicon = L.marker(M.convertGCtoLC(event.path[0]),
					{
						title: "<span class='mapEvent'>" + D.getEventName(event) + "</span>",
						icon: L.icon(
						{
							iconUrl: "img/event/" + event.icon + I.cPNG,
							iconSize: [16, 16],
							iconAnchor: [8, 8]
						})
					}).addTo(M.Map);
					// Initially hide all event icons, the highlight event functions will show them
					event.eventring._icon.style.display = "none";
					event.eventicon._icon.style.display = "none";
					M.StoryEventRings.push(event.eventring);
					M.StoryEventIcons.push(event.eventicon);
				}
			}
		}
		
		// Initially hide paths, unhide when map populating is complete
		M.setEntityGroupDisplay(M.ChainPathEntities, "hide");
	},
	
	/*
	 * Populates the map with dailies location markers.
	 */
	generateAndInitializeDailies: function()
	{
		$(".mapDailyLists dt").each(function()
		{
			M.bindMapLinkBehavior($(this), null);
			
			var coord = M.getElementCoordinates($(this));
			var type = U.getSubstringFromHTMLID($(this).parent());
			var marker = L.marker(M.convertGCtoLC(coord),
			{
				title: "<div class='mapLoc'><dfn>Daily:</dfn> " + type + "</div>"
			}).addTo(M.Map);
			marker.setIcon(new L.icon(
			{
				iconUrl: "img/daily/" + type.toLowerCase() + I.cPNG,
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			}));
			marker._icon.style.opacity = "0.9";
			M.bindMarkerZoomBehavior(marker, "click");
			
			// Add to array
			M.DailyEntities.push(marker);
		});
		
		$("#mapToggle_Daily").click(function()
		{
			M.isShowingIconsForDaily = !(M.isShowingIconsForDaily);
			M.setEntityGroupDisplay(M.DailyEntities, M.isShowingIconsForDaily);
		});
		
		I.qTip.init(".leaflet-marker-icon");
	},
	
	/*
	 * Populates the map with resource node markers and create HTML checkboxes
	 * to toggle their display on the map.
	 */
	generateAndInitializeResourceNodes: function()
	{
		M.Resources = GW2T_RESOURCE_DATA; // This object is inline in the map HTML file
		var i, ii;
		var resource; // A type of resource, like copper ore
		var marker;
		
		var styleMarker = function(pMarker, pResource)
		{
			pMarker.setIcon(new L.icon(
			{
				iconUrl: "img/node/" + pResource.toLowerCase() + I.cPNG,
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			}));
			pMarker._icon.style.borderRadius = "16px";
			pMarker._icon.style.opacity = "0.9";
			pMarker._icon.style.border = "2px solid lime";
			
			M.bindMarkerZoomBehavior(pMarker, "click");
		};
		
		for (i in M.Resources)
		{
			resource = M.Resources[i];
			resource.NodeEntities = new Array();
			
			// Resources with specific node locations
			if (resource.nodes !== undefined)
			{
				for (ii in resource.nodes)
				{
					marker = L.marker(M.convertGCtoLC(resource.nodes[ii])).addTo(M.Map);
					styleMarker(marker, i);
					if (resource.approx === true)
					{
						marker._icon.style.border = "2px dotted lime";
					}
					// Add to array
					resource.NodeEntities.push(marker);
				}
			}
			// Resources with only zone locations (marker centered in map)
			else if (resource.zones !== undefined)
			{
				for (ii in resource.zones)
				{
					var zone = resource.zones[ii];
					var coord = M.getZoneCenter(zone);
					coord[0] += resource.offset[0];
					coord[1] += resource.offset[1];
					marker = L.marker(M.convertGCtoLC(coord)).addTo(M.Map);
					styleMarker(marker, i);
					marker._icon.style.border = "2px dashed lime";
					// Add to array
					resource.NodeEntities.push(marker);
				}
			}
		}
		
		// Create checkboxes
		for (i in M.Resources)
		{
			resource = M.Resources[i];
			$("#mapResource_" + resource.type).append(
				"<label><input id='nod_" + i + "' type='checkbox' /> <img src='img/node/" + i.toLowerCase() + I.cPNG + "' /> " + i + "</label>");
		}
		// Bind checkboxes
		for (i in M.Resources)
		{
			$("#nod_" + i).change(function()
			{
				var thisresource = U.getSubstringFromHTMLID($(this));
				M.setEntityGroupDisplay(M.Resources[thisresource].NodeEntities, $(this).prop("checked"));
			});
		}
		$("#mapToggle_Resource").click(function()
		{
			M.isShowingIconsForResource = !(M.isShowingIconsForResource);
			for (i in M.Resources)
			{
				$("#nod_" + i).prop("checked", M.isShowingIconsForResource);
				M.setEntityGroupDisplay(M.Resources[i].NodeEntities, M.isShowingIconsForResource);
			}
		});
	},
	
	/*
	 * Styles the border color of JP icons based on difficulty.
	 * @param object pMarker to recolor.
	 * @param int pDifficulty for color.
	 */
	styleJPMarkers: function(pMarker, pDifficulty)
	{
		var border = "2px solid lime";
		switch (pDifficulty)
		{
			case 1: border = "2px solid orange"; break;
			case 2: border = "2px solid red"; break;
		}
		pMarker._icon.style.border = border;
	},
	
	/*
	 * Populates the map with JP location markers with different color depending
	 * on the difficulty.
	 */
	generateAndInitializeJPs: function()
	{
		X.Checklists.JP.length = $(".mapJPList dt").length;
		
		var i;
		var createJPMarkers = function(pElement, pID, pDifficulty)
		{
			var coord = M.getElementCoordinates(pElement);
			var marker = L.marker(M.convertGCtoLC(coord),
			{
				id: pID,
				dif: pDifficulty,
				title: "<div class='mapLoc'><dfn>JP:</dfn> " + pElement.text()
					+ "<img src='" + U.getImageHosted(pElement.data("img")) + "' /></div>"
			}).addTo(M.Map);
			marker.setIcon(new L.icon(
			{
				iconUrl: "img/ui/jp.png",
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			}));
			marker._icon.style.borderRadius = "50%";
			marker._icon.style.opacity = "0.9";
			P.styleJPMarkers(marker, pDifficulty);
			
			// Add to array
			M.JPEntities.push(marker);
		};
		
		// Create the markers, each set pertains to one "mapJPList"
		for (i = 0; i < X.Checklists.JP.length; i++)
		{
			$("#mapJP_" + i).each(function()
			{
				createJPMarkers($(this), U.getSubstringFromHTMLID($(this)),
					$(this).parent().data("jpdif"));
			});
		}
		
		$("#mapToggle_JP").click(function()
		{
			M.isShowingIconsForJP = !(M.isShowingIconsForJP);
			M.setEntityGroupDisplay(M.JPEntities, M.isShowingIconsForJP);
		});
		
		I.qTip.init(".leaflet-marker-icon");
	},
	
	/*
	 * Creates checkboxes next to JP names and bind event handlers for storing
	 * their states as a combined string of 0s and 1s.
	 */
	generateAndInitializeJPChecklistHTML: function()
	{
		// Bind JP links
		$(".mapJPList dt").each(function()
		{
			var term = $(this).text();
			$(this).after("&nbsp;<cite><a href='"
				+ U.getYouTubeLink(term + " " + I.cGameName) + "' target='_blank'>[Y]</a> <a href='"
				+ U.getWikiLink(term) + "' target='_blank'>[W]</a></cite>");
			M.bindMapLinkBehavior($(this), null);
			
			// Make checkboxes
			$(this).after("<label><input type='checkbox' id='mapJPCheck_" + U.getSubstringFromHTMLID($(this)) + "' /></label>");
		});
		U.convertExternalLink(".mapJPList a");
		
		// Initialize localStorage
		X.initializeChecklist(X.Checklists.JP, X.Checklists.JP.length);
		
		var i;
		for (i = 0; i < X.Checklists.JP.length; i++)
		{
			$("#mapJPCheck_" + i).each(function()
			{
				/*
				 * Read and enact the state of the JP checklist.
				 */
				// Convert the digit at ith position in the checklist string to boolean
				var stateinstring = X.getChecklistItem(X.Checklists.JP, i, O.TypeEnum.isBoolean);
				$(this).prop("checked", stateinstring);
				if (stateinstring === false)
				{
					$(this).parent().prev().removeClass("mapJPListNameHover");
				}
				else
				{
					$(this).parent().prev().addClass("mapJPListNameHover");
					M.JPEntities[i]._icon.style.border = "2px solid black";
				}
				
			}).change(function()
			{
				// Get the checkbox ID that associates itself with that JP
				var checkboxstate = X.getCheckboxEnumState($(this));
				var checkboxindex = U.getSubintegerFromHTMLID($(this));
				if (checkboxstate === X.ChecklistEnum.Unchecked)
				{
					$(this).parent().prev().removeClass("mapJPListNameHover");
					P.styleJPMarkers(M.JPEntities[checkboxindex], M.JPEntities[checkboxindex].options.dif);
				}
				else
				{
					$(this).parent().prev().addClass("mapJPListNameHover");
					M.JPEntities[checkboxindex]._icon.style.border = "2px solid black";
				}
				
				// Rewrite the checklist string by updating the digit at the ID/index
				X.setChecklistItem(X.Checklists.JP, checkboxindex, checkboxstate);
				
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
				M.JPEntities[pIndex].on("click", function()
				{
					$("#mapJPCheck_" + pIndex).trigger("click");
				});
				// Zoom in when double clicked
				M.JPEntities[pIndex].on("dblclick", function()
				{
					if (M.Map.getZoom() === M.ZoomLevelEnum.Max)
					{
						M.Map.setZoom(M.ZoomLevelEnum.Default);
					}
					else
					{
						$("#mapJP_" + pIndex).trigger("click");
					}
				});
			})(i);
		}
		
		// The button to clear all JP checkboxes
		$("#mapJPUncheck").click(function()
		{
			var jpchecklist = "";
			for (i = 0; i < X.Checklists.JP.length; i++)
			{
				$("#mapJPCheck_" + i).prop("checked", false)
					.parent().prev().removeClass("mapJPListNameHover");
				P.styleJPMarkers(M.JPEntities[i], M.JPEntities[i].options.dif);
				
				jpchecklist += "0";
			}
			X.Checklists.JP.value = jpchecklist;
			localStorage[X.Checklists.JP.key] = X.Checklists.JP.value;
		});
	},
	
	/*
	 * Styles the border color of collectible markers based on state.
	 * @param object pMarker to recolor.
	 * @param enum pState for color.
	 */
	styleCollectibleMarker: function(pMarker, pState)
	{
		switch (pState)
		{
			case X.ChecklistEnum.Unfound: pMarker._icon.style.border = "2px solid lime"; break;
			case X.ChecklistEnum.Tracked: pMarker._icon.style.border = "2px solid red"; break;
			case X.ChecklistEnum.Found: pMarker._icon.style.border = "2px solid white"; break;
		}
	},
	
	/*
	 * Populates the map with collectible markers and create HTML checkboxes
	 * to toggle their display on the map. Each collectible type has a "cushion"
	 * array to store "needle" markers, which act as checkboxes in the map.
	 */
	generateAndInitializeCollectibles: function()
	{
		M.Collectibles = GW2T_COLLECTIBLE_DATA; // This object is inline in the map HTML file
		var i, ii, number;
		var customlist;
		var ithcollectible;
		var ithneedle;
		var stateinstring;
		var marker;
		var markertitle;
		
		var styleMarker = function(pMarker, pIndex, pState, pColor)
		{
			pMarker.setIcon(new L.divIcon(
			{
				className: "mapNeedle",
				html: "<span style='color:" + pColor + "'>" + pIndex + "</span>",
				iconSize: [16, 16],
				iconAnchor: [8, 8]
			}));
			pMarker._icon.style.borderRadius = "16px";
			pMarker._icon.style.opacity = "0.9";
			P.styleCollectibleMarker(pMarker, pState);
			
			// Bind marker behavior
			pMarker.on("click", function(pEvent)
			{
				var type = this.options.needleType;
				var key = this.options.needleKey;
				var index = this.options.needleIndex;
				var newstate = X.trackChecklistItem(X.Checklists[type], index);
				P.styleCollectibleMarker(this, newstate);
				
				// Update URL bar with list of numbers of checked markers
				var pings = X.getCheckedIndexes(X.Checklists[type]);
				if (pings.length === 0)
				{
					U.updateQueryString();
				}
				else
				{
					U.updateAddressBar("?" + key + "=" + pings);
				}
			});
		};
		
		for (i in M.Collectibles)
		{
			customlist = U.Args[X.Checklists[i].urlkey];
			X.Checklists[i].length = M.Collectibles[i].needles.length;
			X.initializeChecklist(X.Checklists[i], X.Checklists[i].length, customlist);
		
			ithcollectible = M.Collectibles[i];
			ithcollectible.NeedleEntities = new Array();
			
			for (ii in ithcollectible.needles)
			{
				/*
				 * Read and enact the state of the ith collectible checklist.
				 */
				number = parseInt(ii) + 1;
				ithneedle = ithcollectible.needles[ii];
				stateinstring = X.getChecklistItem(X.Checklists[i], ii);
				
				markertitle = "<div class='mapLoc'><dfn>" + ithcollectible.name + ":</dfn> #" + number;
				if (ithneedle.i)
				{
					markertitle += "<img src='" + U.getImageHosted(ithneedle.i) + "' />";
				}
				else if (ithneedle.t)
				{
					markertitle += "<br /><span class='mapTip'>" + ithneedle.t + " (User Contributed)</span>";
				}
				markertitle += "</div>";
				
				marker = L.marker(M.convertGCtoLC(ithneedle.c),
				{
					needleIndex: ii,
					needleType: i,
					needleKey: X.Checklists[i].urlkey,
					title: markertitle
				}).addTo(M.Map);
				styleMarker(marker, number, stateinstring, ithcollectible.color);
				// Add to arrays
				X.Checklists[i].cushion.push(marker);
				ithcollectible.NeedleEntities.push(marker);
			}
			
			// Create checkboxes
			ithcollectible = M.Collectibles[i];
			$("#mapCollectibleList").append(
				"<div><label style='color:" + ithcollectible.color + "'><input id='ned_" + i + "' type='checkbox' /> " + ithcollectible.name + "</label>"
				+ "<span class='cssRight'><cite>"
					+ "<a href='" + U.getYouTubeLink(ithcollectible.name + " " + I.cGameName) + "'>[Y]</a>&nbsp;"
					+ "<a href='" + ithcollectible.wiki + "'>[W]</a>&nbsp;"
					+ "<a href='" + ithcollectible.credit + "'>[C]</a>&nbsp;"
					+ "&nbsp;-&nbsp;&nbsp;</cite>"
					+ "<a id='nedUncheck_" + i + "' class='cssRight'>Reset</a>"
				+ "</span></div>");
			
			// Bind checkboxes
			$("#ned_" + i).change(function()
			{
				var collectibletype = U.getSubstringFromHTMLID($(this));
				M.setEntityGroupDisplay(M.Collectibles[collectibletype].NeedleEntities, $(this).prop("checked"));
			});
			$("#nedUncheck_" + i).click(function()
			{
				var collectibletype = U.getSubstringFromHTMLID($(this));
				var thiscushion = X.Checklists[collectibletype].cushion;
				for (var thisi in thiscushion)
				{
					P.styleCollectibleMarker(thiscushion[thisi], X.ChecklistEnum.Unfound);
				}
				X.clearChecklist(X.Checklists[collectibletype]);
				U.updateQueryString();
			});
		}
		I.qTip.init(".mapNeedle");
		U.convertExternalLink("#mapCollectibleList cite a");
		
		$("#mapToggle_Collectible").click(function()
		{
			M.isShowingIconsForCollectible = !(M.isShowingIconsForCollectible);
			for (i in M.Collectibles)
			{
				$("#ned_" + i).prop("checked", M.isShowingIconsForCollectible);
				M.setEntityGroupDisplay(M.Collectibles[i].NeedleEntities, M.isShowingIconsForCollectible);
			}
		});
	}
};

/* =============================================================================
 * @@Time utilities and schedule
 * ========================================================================== */
T = {

	DST_IN_EFFECT: 0, // Will become 1 and added to the server offset if DST is on
	SECONDS_TILL_RESET: 0,
	TIMESTAMP_UNIX_SECONDS: 0,
	cUTC_OFFSET_USER: 0,
	cUTC_OFFSET_SERVER: -8, // Server is Pacific Time, 8 hours behind UTC
	cUTC_OFFSET_HAWAII: -10,
	cUTC_OFFSET_EASTERN: -4,
	cMILLISECONDS_IN_SECOND: 1000,
	cSECONDS_IN_MINUTE: 60,
	cSECONDS_IN_HOUR: 3600,
	cSECONDS_IN_DAY: 86400,
	cMINUTES_IN_HOUR: 60,
	cMINUTES_IN_DAY: 1440,
	cHOURS_IN_MERIDIEM: 12,
	cHOURS_IN_DAY: 24,
	cSECONDS_IN_TIMEFRAME: 900,
	cMINUTES_IN_TIMEFRAME: 15,
	cMINUTES_IN_EVENTFRAME: 5,
	cNUM_TIMEFRAMES_IN_HOUR: 4,
	cSECS_MARK_0: 0,
	cSECS_MARK_1: 900,
	cSECS_MARK_2: 1800,
	cSECS_MARK_3: 2700,
	cSECS_MARK_4: 3599,
	cBASE_10: 10,
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
	
	Events:
	{
		numOfSets: 7,
		
		en0: "Supplies@[&BJcHAAA=] Rustbucket@[&BJYHAAA=] TendrilW@[&BIYHAAA=] Shaman@[&BIsHAAA=]"
			+ " Victims@[&BIwHAAA=] Tootsie@[&BHYHAAA=] Crystals@[&BHIHAAA=] TendrilSE@[&BHMHAAA=]",
		en1: "Beetles@[&BJYHAAA=] Bridge@[&BIkHAAA=] Experiment@[&BIwHAAA=] Golem@[&BIoHAAA=]"
			+ " Nochtli@[&BHkHAAA=] COLOCAL@[&BHwHAAA=] Serene@[&BHQHAAA=] MineE@[&BHsHAAA=]",
		en2: "Suit@[&BJMHAAA=] Leyline@[&BIMHAAA=] Town@[&BH4HAAA=] Basket@[&BHMHAAA=] MineNE@[&BH0HAAA=]",
		en3: "Eway@[&BJcHAAA=] Giant@[&BIwHAAA=] Skritts@[&BIwHAAA=] Mites@[&BHUHAAA=] Haze@[&BHIHAAA=] Explosives@[&BH4HAAA=]",
		en4: "DEVOURER(2)@[&BHkHAAA=] Giant@[&BIwHAAA=]",
		en5: "Eway@[&BJcHAAA=] Chrii'kkt(4)@[&BIoHAAA=] Skritts@[&BIwHAAA=] Chickenado@[&BI4HAAA=] TWISTER(3)@[&BHoHAAA=] Haze@[&BHIHAAA=]",
		en6: "Beetle(5)@[&BJcHAAA=] Monster(4)@[&BHoHAAA=]",
		
		de0: "Vorräte@[&BJcHAAA=] Schrotteimer@[&BJYHAAA=] DschungelrankeW@[&BIYHAAA=] Schamanin@[&BIsHAAA=]"
			+ " Unfallopfer@[&BIwHAAA=] Tootsie@[&BHYHAAA=] Kristalle@[&BHIHAAA=] DschungelrankeSO@[&BHMHAAA=]",
		de1: "Käfern@[&BJYHAAA=] Rankenbrücke@[&BIkHAAA=] Experimente@[&BIwHAAA=] Golem@[&BIoHAAA=]"
			+ " Nochtli@[&BHkHAAA=] COLOCAL@[&BHwHAAA=] Serene@[&BHQHAAA=] MinenO@[&BHsHAAA=]",
		de2: "Aspektanzug@[&BJMHAAA=] Leylinien@[&BIMHAAA=] Kleinstadt@[&BH4HAAA=] Drachenkorb@[&BHMHAAA=] MinenNO@[&BH0HAAA=]",
		de3: "Eway@[&BJcHAAA=] Riesen@[&BIwHAAA=] Skritt@[&BIwHAAA=] Staubmilben@[&BHUHAAA=] Dunst@[&BHIHAAA=] Sprengstoff@[&BH4HAAA=]",
		de4: "VERSCHLINGER(2)@[&BHkHAAA=] Riesen@[&BIwHAAA=]",
		de5: "Eway@[&BJcHAAA=] Chrii'kkt(4)@[&BIoHAAA=] Skritt@[&BIwHAAA=] Hühnado@[&BI4HAAA=] STAUBWIRBELWIND(3)@[&BHoHAAA=] Dunst@[&BHIHAAA=]",
		de6: "Riesenkäfer(5)@[&BJcHAAA=] Staubmonster(4)@[&BHoHAAA=]",
		
		es0: "Suministros@[&BJcHAAA=] Chatarro@[&BJYHAAA=] ZarcilloO@[&BIYHAAA=] Chamán@[&BIsHAAA=]"
			+ " Víctimas@[&BIwHAAA=] Ñique@[&BHYHAAA=] Cristales@[&BHIHAAA=] ZarcilloSE@[&BHMHAAA=]",
		es1: "Escarabajos@[&BJYHAAA=] Puente@[&BIkHAAA=] Experimento@[&BIwHAAA=] Gólem@[&BIoHAAA=]"
			+ " Nochtli@[&BHkHAAA=] COLOCAL@[&BHwHAAA=] Serene@[&BHQHAAA=] MinaE@[&BHsHAAA=]",
		es2: "Traje@[&BJMHAAA=] Líneasley@[&BIMHAAA=] Villa@[&BH4HAAA=] Cestas@[&BHMHAAA=] MinaNE@[&BH0HAAA=]",
		es3: "Eway@[&BJcHAAA=] Gigante@[&BIwHAAA=] Skritt@[&BIwHAAA=] Ácaros@[&BHUHAAA=] Bruma@[&BHIHAAA=] Explosivos@[&BH4HAAA=]",
		es4: "DEVORADORA(2)@[&BHkHAAA=] Gigante@[&BIwHAAA=]",
		es5: "Eway@[&BJcHAAA=] Chrii'kkt(4)@[&BIoHAAA=] Skritt@[&BIwHAAA=] Pollonado@[&BI4HAAA=] HURACÁN(3)@[&BHoHAAA=] Bruma@[&BHIHAAA=]",
		es6: "Escarabajo(5)@[&BJcHAAA=] Monstruo(4)@[&BHoHAAA=]",
		
		fr0: "Provisions@[&BJcHAAA=] Tadrouille@[&BJYHAAA=] VrilleO@[&BIYHAAA=] Chamane@[&BIsHAAA=]"
			+ " Survivants@[&BIwHAAA=] Bipbip@[&BHYHAAA=] Cristales@[&BHIHAAA=] VrilleSE@[&BHMHAAA=]",
		fr1: "Scarabées@[&BJYHAAA=] Pont@[&BIkHAAA=] Expériences@[&BIwHAAA=] Golem@[&BIoHAAA=]"
			+ " Nochtli@[&BHkHAAA=] COLOCAL@[&BHwHAAA=] Serene@[&BHQHAAA=] MineE@[&BHsHAAA=]",
		fr2: "Combinaison@[&BJMHAAA=] Lignesforce@[&BIMHAAA=] Bourg@[&BH4HAAA=] Panier@[&BHMHAAA=] MineNE@[&BH0HAAA=]",
		fr3: "Eway@[&BJcHAAA=] Géant@[&BIwHAAA=] Skritts@[&BIwHAAA=] Acarides@[&BHUHAAA=] Haze@[&BHIHAAA=] Explosifs@[&BH4HAAA=]",
		fr4: "DÉVOREUSE(2)@[&BHkHAAA=] Géant@[&BIwHAAA=]",
		fr5: "Eway@[&BJcHAAA=] Chrii'kkt(4)@[&BIoHAAA=] Skritts@[&BIwHAAA=] Poulenade@[&BI4HAAA=] TORNADE(3)@[&BHoHAAA=] Haze@[&BHIHAAA=]",
		fr6: "Scarabée(5)@[&BJcHAAA=] Monstre(4)@[&BHoHAAA=]"
	},
	Schedule: {},
	Hourly: {},
	
	/**
	 * Gets a clipboard text of the current Living Story events.
	 * @param pOffset from the current event frame.
	 * @returns string of events for that event frame.
	 */
	getCurrentStoryEvents: function(pOffset)
	{
		pOffset = pOffset || 0;
		
		var now = new Date();
		var min = now.getUTCMinutes();
		var eventframe = (~~(min / T.cMINUTES_IN_EVENTFRAME) * T.cMINUTES_IN_EVENTFRAME)
			+ (pOffset * T.cMINUTES_IN_EVENTFRAME);
	
		return T.Hourly["t" + T.wrapInteger(eventframe, T.cMINUTES_IN_HOUR)] + I.siteTagCurrent;
	},
	
	// Living Story events
	initializeHourly: function()
	{
		if (C.StoryChains.length <= 0)
		{
			return;
		}
		
		var i;
		var language = O.OptionEnum.Language.Default;

		if (D.isLanguageFullySupported())
		{
			language = O.Options.enu_Language;
		}
		for (i = 0; i < T.Events.numOfSets; i++)
		{
			T.Events["Set" + i] = T.Events[language + i];
		}
		
		T.Hourly =
		{
			 t0: ":00 " + T.Events.Set0,
			 t5: ":05 " + T.Events.Set1,
			t10: ":10 " + T.Events.Set2,
			t15: ":15 " + T.Events.Set0,
			t20: ":20 " + T.Events.Set1,
			t25: ":25 " + T.Events.Set2,
			t30: ":30 " + T.Events.Set0,
			t35: ":35 " + T.Events.Set1,
			t40: ":40 " + T.Events.Set3,
			t45: ":45 " + T.Events.Set4,
			t50: ":50 " + T.Events.Set5,
			t55: ":55 " + T.Events.Set6
		};
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
		C.Story0 =		C.Chains[13];
		C.Story1 =		C.Chains[14];
		C.Story2 =		C.Chains[15];
		C.Story3 =		C.Chains[16];
		
		/*
		 * This "hash table" contains all time-sensitive chains (a group of
		 * events). The "key"/slot is the time in minutes, and the "value" is an 
		 * object with the minutes (again for access) and the array of chains
		 * that start at that time.
		 * A "Timeframe" is the quarter of an hour that a regular chain(s) is
		 * considered current and before it is replaced by the next chain(s).
		 */
		T.Schedule =
		{
			   t0: {t: "00:00", c: [C.Taidha, C.Tequatl]},
			  t15: {t: "00:15", c: [C.Maw]},
			  t30: {t: "00:30", c: [C.Megades]},
			  t45: {t: "00:45", c: [C.FE]},

			  t60: {t: "01:00", c: [C.Shatterer, C.Triple]},
			  t75: {t: "01:15", c: [C.Wurm]},
			  t90: {t: "01:30", c: [C.Ulgoth]},
			 t105: {t: "01:45", c: [C.SB]},

			 t120: {t: "02:00", c: [C.Golem, C.Queen]},
			 t135: {t: "02:15", c: [C.Maw]},
			 t150: {t: "02:30", c: [C.Jormag]},
			 t165: {t: "02:45", c: [C.FE]},

			 t180: {t: "03:00", c: [C.Taidha, C.Tequatl]},
			 t195: {t: "03:15", c: [C.Wurm]},
			 t210: {t: "03:30", c: [C.Megades]},
			 t225: {t: "03:45", c: [C.SB]},

			 t240: {t: "04:00", c: [C.Shatterer, C.Triple]},
			 t255: {t: "04:15", c: [C.Maw]},
			 t270: {t: "04:30", c: [C.Ulgoth]},
			 t285: {t: "04:45", c: [C.FE]},

			 t300: {t: "05:00", c: [C.Golem]},
			 t315: {t: "05:15", c: [C.Wurm]},
			 t330: {t: "05:30", c: [C.Jormag]},
			 t345: {t: "05:45", c: [C.SB]},

			 t360: {t: "06:00", c: [C.Taidha, C.Queen]},
			 t375: {t: "06:15", c: [C.Maw]},
			 t390: {t: "06:30", c: [C.Megades]},
			 t405: {t: "06:45", c: [C.FE]},

			 t420: {t: "07:00", c: [C.Shatterer, C.Tequatl]},
			 t435: {t: "07:15", c: [C.Wurm]},
			 t450: {t: "07:30", c: [C.Ulgoth]},
			 t465: {t: "07:45", c: [C.SB]},

			 t480: {t: "08:00", c: [C.Golem, C.Triple]},
			 t495: {t: "08:15", c: [C.Maw]},
			 t510: {t: "08:30", c: [C.Jormag]},
			 t525: {t: "08:45", c: [C.FE]},

			 t540: {t: "09:00", c: [C.Taidha]},
			 t555: {t: "09:15", c: [C.Wurm]},
			 t570: {t: "09:30", c: [C.Megades]},
			 t585: {t: "09:45", c: [C.SB]},

			 t600: {t: "10:00", c: [C.Shatterer]},
			 t615: {t: "10:15", c: [C.Maw]},
			 t630: {t: "10:30", c: [C.Ulgoth, C.Queen]},
			 t645: {t: "10:45", c: [C.FE]},

			 t660: {t: "11:00", c: [C.Golem]},
			 t675: {t: "11:15", c: [C.Wurm]},
			 t690: {t: "11:30", c: [C.Jormag, C.Tequatl]},
			 t705: {t: "11:45", c: [C.SB]},

			 t720: {t: "12:00", c: [C.Taidha]},
			 t735: {t: "12:15", c: [C.Maw]},
			 t750: {t: "12:30", c: [C.Megades, C.Triple]},
			 t765: {t: "12:45", c: [C.FE]},

			 t780: {t: "13:00", c: [C.Shatterer]},
			 t795: {t: "13:15", c: [C.Wurm]},
			 t810: {t: "13:30", c: [C.Ulgoth]},
			 t825: {t: "13:45", c: [C.SB]},

			 t840: {t: "14:00", c: [C.Golem]},
			 t855: {t: "14:15", c: [C.Maw]},
			 t870: {t: "14:30", c: [C.Jormag]},
			 t885: {t: "14:45", c: [C.FE]},

			 t900: {t: "15:00", c: [C.Taidha, C.Queen]},
			 t915: {t: "15:15", c: [C.Wurm]},
			 t930: {t: "15:30", c: [C.Megades]},
			 t945: {t: "15:45", c: [C.SB]},

			 t960: {t: "16:00", c: [C.Shatterer, C.Tequatl]},
			 t975: {t: "16:15", c: [C.Maw]},
			 t990: {t: "16:30", c: [C.Ulgoth]},
			t1005: {t: "16:45", c: [C.FE]},

			t1020: {t: "17:00", c: [C.Golem, C.Triple]},
			t1035: {t: "17:15", c: [C.Wurm]},
			t1050: {t: "17:30", c: [C.Jormag]},
			t1065: {t: "17:45", c: [C.SB]},

			t1080: {t: "18:00", c: [C.Taidha, C.Queen]},
			t1095: {t: "18:15", c: [C.Maw]},
			t1110: {t: "18:30", c: [C.Megades]},
			t1125: {t: "18:45", c: [C.FE]},

			t1140: {t: "19:00", c: [C.Shatterer, C.Tequatl]},
			t1155: {t: "19:15", c: [C.Wurm]},
			t1170: {t: "19:30", c: [C.Ulgoth]},
			t1185: {t: "19:45", c: [C.SB]},

			t1200: {t: "20:00", c: [C.Golem, C.Triple]},
			t1215: {t: "20:15", c: [C.Maw]},
			t1230: {t: "20:30", c: [C.Jormag]},
			t1245: {t: "20:45", c: [C.FE]},

			t1260: {t: "21:00", c: [C.Taidha]},
			t1275: {t: "21:15", c: [C.Wurm]},
			t1290: {t: "21:30", c: [C.Megades]},
			t1305: {t: "21:45", c: [C.SB]},

			t1320: {t: "22:00", c: [C.Shatterer]},
			t1335: {t: "22:15", c: [C.Maw]},
			t1350: {t: "22:30", c: [C.Ulgoth]},
			t1365: {t: "22:45", c: [C.FE]},

			t1380: {t: "23:00", c: [C.Golem, C.Queen]},
			t1395: {t: "23:15", c: [C.Wurm]},
			t1410: {t: "23:30", c: [C.Jormag]},
			t1425: {t: "23:45", c: [C.SB]}
		};
		
		var i, ii, iii;
		var quarter = 0;
		var slot;
		
		// Add story chains to the schedule
		for (i in T.Schedule)
		{
			T.Schedule[i].c.push(C["Story" + (quarter)]);
			quarter++;
			if (quarter > T.cNUM_TIMEFRAMES_IN_HOUR - 1)
			{
				quarter = 0;
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
		
		// Finally bind event handlers for the chain checklist
		X.initializeChainChecklist();
		// Initialize for the touring function to access current active event
		C.CurrentChainSD = T.getStandardChain();
		
		// Initialize Living Story schedule
		T.initializeHourly();
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
		var minutes = T.getTimeOffsetSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Minutes);
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
		return T.Schedule["t" + T.getTimeframe(pOffset)].c;
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
	
	/*
	 * Gets the key from current timeframe offset.
	 * @param int pOffset number of timeframes from the current.
	 * @returns string key for the schedule slot.
	 */
	getTimeframeKey: function(pOffset)
	{
		return "t" + T.getTimeframe(pOffset);
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
		var secondscurrent = T.getTimeOffsetSinceMidnight(T.ReferenceEnum.Local, T.UnitEnum.Seconds);
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
		var minword = D.getPhrase("m");
		var hourword = D.getPhrase("h");
		
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
				min = D.getSpeech("half an hour");
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
			return " " + hour + min + " " + D.getPhrase("ago");
		}
		return " " + D.getPhrase("in") + " " + hour + min;
	},
	
	/*
	 * Gets a random integer between inclusive range.
	 * @param int pMin value.
	 * @param int pMax value.
	 * @returns int random.
	 */
	randIntRange: function(pMin, pMax)
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
		if (now.dst() && O.Options.bol_detectDST === false)
		{
			T.DST_IN_EFFECT = 1;
		}
		
		// If user lives in the Americas then use AM/PM time format by default
		T.cUTC_OFFSET_USER = -((new Date()).getTimezoneOffset() / T.cMINUTES_IN_HOUR);
		if (T.cUTC_OFFSET_USER <= T.cUTC_OFFSET_EASTERN
			&& T.cUTC_OFFSET_USER >= T.cUTC_OFFSET_HAWAII)
		{
			O.Options.bol_use24Hour = false;
		}
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
	getTimeFormatted: function(pArgs)
	{
		// Set parameter defaults
		pArgs = pArgs || {};
		if (pArgs.reference === undefined)
		{
			pArgs.reference = T.ReferenceEnum.Local;
		}
		if (pArgs.want24 === undefined)
		{
			pArgs.want24 = O.Options.bol_use24Hour;
		}
		if (pArgs.wantSeconds === undefined)
		{
			pArgs.wantSeconds = true;
		}
		if (pArgs.wantHours === undefined)
		{
			pArgs.wantHours = true;
		}
		if (pArgs.wantLetters === undefined)
		{
			pArgs.wantLetters = false;
		}
		
		var sec, min, hour;
		var now = new Date();
		
		if (pArgs.customTimeInSeconds === undefined)
		{
			switch (pArgs.reference)
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
			pArgs.customTimeInSeconds = T.wrapInteger(pArgs.customTimeInSeconds, T.cSECONDS_IN_DAY);
			/*
			 * Convert specified seconds to time units. The ~~ gets rid of the
			 * decimal so / behaves like integer divide.
			 */
			sec = pArgs.customTimeInSeconds % T.cSECONDS_IN_MINUTE;
			min = ~~(pArgs.customTimeInSeconds / T.cSECONDS_IN_MINUTE) % T.cMINUTES_IN_HOUR;
			hour = ~~(pArgs.customTimeInSeconds / T.cSECONDS_IN_HOUR);
		}
		
		var minsec = "";
		// Include the seconds else don't
		if (pArgs.wantSeconds)
		{
			if (pArgs.wantLetters)
			{
				if (hour === 0 && min === 0)
				{
					minsec = sec + "s";
				}
				else
				{
					minsec = min + "m" + " " + sec + "s";
				}
			}
			else if (pArgs.wantHours === false)
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
			if (pArgs.wantLetters)
			{
				minsec = min + "m";
			}
			else
			{
				minsec = ((min < T.cBASE_10) ? "0" + min : min);
			}
		}
		
		// Possible returns
		if (pArgs.wantLetters)
		{
			if (hour === 0 || pArgs.wantHours === false)
			{
				return minsec;
			}
			return hour + "h " + minsec;
		}
		if (pArgs.want24)
		{
			if (pArgs.wantHours === false)
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
	 * Gets the time in units since midnight at the point of reference.
	 * @param string pTimeUnit time unit to convert from.
	 * @param string pReference place to offset the time, default is UTC.
	 * @returns number seconds, minutes, or hours.
	 */
	getTimeOffsetSinceMidnight: function(pReference, pTimeUnit)
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
	}
};

/* =============================================================================
 *  @@Klock analog and by-the-second and frame refreshes
 * ========================================================================== */
K = {
	
	tickerFrequency: 250, // Must be a divisor of 1000 milliseconds
	tickerSecondPrevious: null,
	awakeTimestampPrevious: 0,
	awakeTimestampTolerance: 5,
	currentFrameOffsetMinutes: 0,
	iconOpacityChecked: 0.4,
	iconOpacitySpeed: 200,
	oldQuadrantAngle: 0,
	cDEGREES_IN_CIRCLE: 360,
	cDEGREES_IN_QUADRANT: 90,
	
	// Clock DOM elements
	handSecond: {}, handMinute: {}, handHour: {},
	clockBackground: {}, clockCircumference: {},
	timeLocal: {}, timeServer: {}, timeBoard: {},
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
		K.timeLocal = $("#itemTimeLocalActual")[0];
		K.timeServer = $("#itemTimeServer")[0];
		K.timeBoard = $("#itemBoardTime")[0];
		K.timestampUTC = $("#optTimestampUTC")[0];
		K.timestampLocal = $("#optTimestampLocalReset")[0];
		K.timestampServer = $("#optTimestampServerReset")[0];
		K.timestampReset = $("#optTimeTillReset")[0];
		
		K.updateTimeFrame(new Date());
		K.tickFrequent();
		K.initializeClipboard();
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
		if (I.BrowserUser === I.BrowserEnum.Firefox)
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
		for (i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
		{
			$([K.IconsStandard[i], K.IconsHardcore[i]]).each(function()
			{
				$(this).unbind("dblclick").dblclick(function()
				{
					coord = C.Chains[$(this).data(C.cIndexSynonym)].primaryEvents[0].path[0];
					M.goToView(coord, M.PinEvent);
					
				}).unbind("click").click(function()
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
		T.SECONDS_TILL_RESET = T.cSECONDS_IN_DAY - T.getTimeOffsetSinceMidnight(T.ReferenceEnum.UTC, T.UnitEnum.Seconds);
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
			// Refresh the chain time countdown opted
			if (O.Options.bol_useCountdown)
			{
				C.updateChainsTimeHTML();
			}
			K.updateWaypointsClipboard();
			
			// Alert subscribed chain
			if (O.Options.bol_alertSubscribed === true && O.Options.bol_enableSound)
			{
				K.doSubscribedSpeech(O.Options.int_alertSubscribedFirst);
				K.doSubscribedSpeech(O.Options.int_alertSubscribedSecond);
			}
			
			// If crossing a 5 minute mark
			if (min % T.cMINUTES_IN_EVENTFRAME === 0)
			{
				K.updateStoryClipboard();
			}
		}
		
		// Tick the two digital clocks below the analog clock
		K.timeLocal.innerHTML = T.getTimeFormatted();
		K.timeServer.innerHTML = "(" +
			T.getTimeFormatted(
			{
				reference: T.ReferenceEnum.Server,
				wantSeconds: false
			}) + ")";
		K.timeBoard.innerHTML =
			T.getTimeFormatted(
			{
				want24: true,
				wantHours: false,
				wantLetters: true,
				customTimeInSeconds: T.cSECONDS_IN_TIMEFRAME - T.getCurrentTimeframeElapsedTime()
			});
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
			K.handMinute.style.stroke = "lime";
		}
		else if (secinhour >= (K.currentFrameOffsetMinutes + C.CurrentChainSD.minFinish)
			&& secinhour < (K.currentFrameOffsetMinutes + C.CurrentChainSD.avgFinish))
		{
			K.handMinute.style.stroke = "orange";
		}
		else if (secinhour >= (K.currentFrameOffsetMinutes + C.CurrentChainSD.avgFinish))
		{
			K.handMinute.style.stroke = "red";
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
			var wantsd = false;
			var wanthc = false;
			var speech = D.getSpeech("world boss", "subscribed") + " ";
			var wait = 5;

			if (pMinutes > T.cMINUTES_IN_TIMEFRAME)
			{
				chainsd = C.NextChainSD2;
				chainhc = C.NextChainHC2;
				minutestill += T.cMINUTES_IN_TIMEFRAME;
			}
			wantsd = O.objToBool(chainsd) && (C.isChainSubscribed(chainsd) && C.isChainUnchecked(chainsd));
			wanthc = O.objToBool(chainhc) && (C.isChainSubscribed(chainhc) && C.isChainUnchecked(chainhc));

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
	updateTimeFrame: function(pTime)
	{
		// Check if server reset happened
		O.checkResetTimestamp();
		
		// Remember current chain to reference variable
		C.CurrentChainSD = T.getStandardChain();
		C.NextChainSD1 = T.getStandardChain(1);
		C.NextChainSD2 = T.getStandardChain(2);
		C.NextChainSD3 = T.getStandardChain(3);
		C.NextChainSD4 = T.getStandardChain(4);
		
		C.CurrentChainHC = T.getHardcoreChain();
		C.NextChainHC1 = T.getHardcoreChain(1);
		C.NextChainHC2 = T.getHardcoreChain(2);
		C.NextChainHC3 = T.getHardcoreChain(3);
		C.NextChainHC4 = T.getHardcoreChain(4);
		
		C.PreviousChains2 = T.getTimeframeChains(-2);
		C.PreviousChains1 = T.getTimeframeChains(-1);
		C.CurrentChains = T.getTimeframeChains();
		C.NextChains1 = T.getTimeframeChains(1);
		
		// Sort the chains list
		C.sortChainsListHTML();
		
		// Queue the highlighting of the current chain's events
		C.CurrentChains.forEach(C.queueEventsHighlight);
		
		// Update board in simple mode
		$("#itemBoardCurrentSD").text(D.getChainTitleAny(C.CurrentChainSD.nexus));
		$("#itemBoardNextSD").text(D.getChainTitleAny(C.NextChainSD1.nexus));
		$("#itemBoardCurrentHC").text("");
		$("#itemBoardNextHC").text("");
		if (C.CurrentChainHC || C.NextChainHC1)
		{
			$("#itemBoardHC").show();
			if (C.CurrentChainHC)
			{
				$("#itemBoardCurrentHC").text(D.getChainTitleAny(C.CurrentChainHC.nexus));
			}
			if (C.NextChainHC1)
			{
				$("#itemBoardNextHC").text(D.getChainTitleAny(C.NextChainHC1.nexus));
			}
		}
		else
		{
			$("#itemBoardHC").hide();
		}
		
		// Alert current chain
		if (O.Options.bol_alertAtEnd && O.Options.bol_alertSubscribed === false
			&& O.Options.bol_enableSound)
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
			else if  (wantcurrenthc)
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
		
		var sec = pTime.getSeconds();
		var min = pTime.getMinutes();
		var secinhour = min*60 + sec;
		// Blacken all markers
		$("#clkMarkers line").each(function()
		{
			$(this).attr("stroke", "black");
		});
		$("#paneClockIcons .iconSD").css(
		{
			"border": "1px solid black",
			"box-shadow": "0px 0px 10px black"
		});
		$("#paneClockIcons .iconHC").css(
		{
			"border": "1px solid black",
			"box-shadow": "0px 0px 10px black"
		});
		
		// Macro function for the following conditionals
		var repositionMarkers = function(pMarkerStart, pMarker0A, pMarker0B, pMarkerNext,
			pMarker1A, pMarker1B, pMarker2A, pMarker2B, pMarker3A, pMarker3B,
			pOffsetMark0, pOffsetMark1, pOffsetMark2, pOffsetMark3)
		{
			// Highlight active chain icon
			$([K.IconSD0, K.IconHC0]).each(function()
			{
				$(this).css(
				{
					"border": "1px solid lime",
					"box-shadow": "0px 0px 10px lime"
				});
			});
			$([K.IconSD1, K.IconHC1]).each(function()
			{
				$(this).css(
				{
					"border": "1px solid green",
					"box-shadow": "0px 0px 10px green"
				});
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
						pIcon.attr("title", D.getChainTitleAny(pChain.nexus));
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

			K.WpChain0 = $("#itemClockWaypoint" + i0)[0]; K.IconSD0 = $("#itemClockIconSD" + i0);
			K.WpChain1 = $("#itemClockWaypoint" + i1)[0]; K.IconSD1 = $("#itemClockIconSD" + i1);
			K.WpChain2 = $("#itemClockWaypoint" + i2)[0]; K.IconSD2 = $("#itemClockIconSD" + i2);
			K.WpChain3 = $("#itemClockWaypoint" + i3)[0]; K.IconSD3 = $("#itemClockIconSD" + i3);
			K.IconHC0 = $("#itemClockIconHC" + i0);
			K.IconHC1 = $("#itemClockIconHC" + i1);
			K.IconHC2 = $("#itemClockIconHC" + i2);
			K.IconHC3 = $("#itemClockIconHC" + i3);
			
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
		K.updateStoryClipboard();
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
				new ZeroClipboard(document.getElementById("itemClockWaypoint" + i))
			);
			/*
			 * Zero Clipboard works by superimposing an invisible Flash object 
			 * over the target (the waypoint icons). When a user click on it the
			 * data attribute of the target is loaded to the user's clipboard.
			 * The code below are additional stuff to execute after.
			 */
			K.wpClipboards[i].on("aftercopy", function(pEvent)
			{
				I.write("Chat link copied to clipboard :)<br />" + pEvent.data["text/plain"], 5);
			});
		}
		
		if (C.StoryChains.length > 0)
		{
			for (var i = 0; i < 2; i++)
			{
				K.lsClipboards.push
				(
					new ZeroClipboard(document.getElementById("itemClockStar" + i))
				);
				K.lsClipboards[i].on("aftercopy", function(pEvent)
				{
					I.write("Chat link copied to clipboard :)<br />" + pEvent.data["text/plain"], 5);
				});
			}
		}
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
			text += pChainSD.waypoint + " " + D.getChainAlias(pChainSD.nexus);
			if ( ! pChainHC)
			{
				text += T.getTimeTillChainFormatted(pChainSD);
			}
			else
			{
				text += " " + D.getPhrase("and") + " " + pChainHC.waypoint
					+ " " + D.getChainAlias(pChainHC.nexus)
					+ T.getTimeTillChainFormatted(pChainHC);
			}
			
			// Chains for the timeframe after that
			text += ", " + D.getPhrase("then") + " " + pChainSDAfter.waypoint
				+ " " + D.getChainAlias(pChainSDAfter.nexus);
			if ( ! pChainHCAfter)
			{
				text += T.getTimeTillChainFormatted(pChainSDAfter);
			}
			else
			{
				text += " " + D.getPhrase("and") + " " + pChainHCAfter.waypoint
					+ " " + D.getChainAlias(pChainHCAfter.nexus)
					+ T.getTimeTillChainFormatted(pChainHCAfter);
			}
			
			text = text + I.siteTagCurrent;
			pWaypoint.setAttribute(K.cZeroClipboardDataAttribute, text);
		};
		
		updateWaypoint(K.WpChain0, C.CurrentChainSD, C.CurrentChainHC, C.NextChainSD1, C.NextChainHC1);
		updateWaypoint(K.WpChain1, C.NextChainSD1, C.NextChainHC1, C.NextChainSD2, C.NextChainHC2);
		updateWaypoint(K.WpChain2, C.NextChainSD2, C.NextChainHC2, C.NextChainSD3, C.NextChainHC3);
		updateWaypoint(K.WpChain3, C.NextChainSD3, C.NextChainHC3, C.NextChainSD4, C.NextChainHC4);
	},
	
	/*
	 * Updates the current and next Living Story events icons' clipboard text.
	 */
	updateStoryClipboard: function()
	{
		if (C.StoryChains.length > 0)
		{
			document.getElementById("itemClockStar0")
				.setAttribute(K.cZeroClipboardDataAttribute, T.getCurrentStoryEvents());
			document.getElementById("itemClockStar1")
				.setAttribute(K.cZeroClipboardDataAttribute, T.getCurrentStoryEvents(1));
		}
	}
};

/* =============================================================================
 * @@URL management for links and string manipulation
 * ========================================================================== */
U = {

	/*
	 * URLArguments (Args) may contain Options object's variables. In the form of:
	 * http://example.com/?ExampleKey=ExampleValue&MoreExampleKey=MoreExampleValue
	 * so if a user enters http://gw2timer.com/?bol_showMap=false then the map
	 * will be hidden regardless of previous localStorage or the defaults here.
	 * Note that "bol_bol_showMap" matches exactly as in the Options, otherwise
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
		I.ArticleCurrent = parseInt(U.Args[U.KeyEnum.Article]);
		
		if (isFinite(I.ArticleCurrent))
		{
			I.ArticleCurrent = I.ArticleCurrent - 1;
		}
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
		var i;
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
			if (page === "navi")
			{
				go("http://forum.renaka.com/topic/5546166/");
			}
			else if (page === "m" || page === "simple")
			{
				U.Args[U.KeyEnum.Mode] = I.ModeEnum.Simple;
			}
			else if (page === "chests")
			{
				U.Args[X.Checklists.Collectible1.urlkey] = "true";
			}
			else
			{
				// Also check if the special page is actually a zone name
				for (i in M.Zones)
				{
					if (page.indexOf(i) !== -1)
					{
						U.Args[U.KeyEnum.Go] = i;
						break;
					}
				}
			}
		}
		
		// Else if special page is not specified
		var chests = U.Args[X.Checklists.Collectible1.urlkey];
		if (chests)
		{
			U.Args[U.KeyEnum.Page] = I.PageEnum.Map;
			U.Args[U.KeyEnum.Section] = I.SectionEnum.Map.Collectible;
			U.Args[U.KeyEnum.Article] = "2";
			U.Args[U.KeyEnum.Go] = "4816,16443,1";
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
	 * Converts a string to be all lower case except the first letter which is capitalized.
	 * @param string pString to convert.
	 * @returns string converted.
	 */
	toFirstUpperCase: function(pString)
	{
		return pString.charAt(0).toUpperCase() + pString.slice(1).toLowerCase();
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
	 * function will load that page (content layer) and expand that section.
	 */
	updateQueryString: function()
	{
		if (I.PageCurrent !== "")
		{
			var section = I[I.sectionPrefix + I.PageCurrent];
			var article = U.Args[U.KeyEnum.Article];
			var go = U.Args[U.KeyEnum.Go];

			var pagestring = "?" + U.KeyEnum.Page + "=" + I.PageCurrent;
			var sectionstring = "";
			var articlestring = "";
			var gostring = "";

			if (section)
			{
				sectionstring = "&" + U.KeyEnum.Section + "=" + section;
			}
			if (article)
			{
				articlestring = "&" + U.KeyEnum.Article + "=" + article;
			}
			if (go)
			{
				gostring = "&" + U.KeyEnum.Go + "=" + go;
			}
			
			U.updateAddressBar(pagestring + sectionstring + articlestring + gostring);
		}
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
				$(I.cHeaderPrefix + I.PageCurrent + "_" + U.toFirstUpperCase(section)).trigger("click");
			}
		}, 0);
	},
	openPageFromURL: function()
	{
		if (U.Args[U.KeyEnum.Page] !== undefined)
		{
			var page = U.stripToAlphanumeric(U.Args[U.KeyEnum.Page]);
			$(I.cMenuPrefix + U.toFirstUpperCase(page)).trigger("click");
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
		if (I.ModeCurrent !== I.ModeEnum.Overlay)
		{
			$(pSelector).each(function()
			{
				$(this).attr("href", I.cSiteURL + "out?" + escape($(this).attr("href")));
				$(this).attr("target", "_blank");
			});
		}
	},
	convertExternalURL: function(pURL)
	{
		if (I.ModeCurrent !== I.ModeEnum.Overlay)
		{
			return I.cSiteURL + "out?" + escape(pURL);
		}
		return pURL;
	},
	
	/*
	 * Extracts the "identifier" part of an HTML element's ID. Most iterable
	 * elements' IDs were manually named as [prefix]_[Index].
	 * @param jqobject pElement to extract.
	 * @returns string identifier of the element's ID.
	 */
	getSubstringFromHTMLID: function(pElement)
	{
		return O.getVariableSuffix(pElement.attr("id"));
	},
	/*
	 * Integer version of the ID extraction function.
	 * @param jqobject pElement to extract.
	 * @returns int identifier of the element's ID.
	 */
	getSubintegerFromHTMLID: function(pElement)
	{
		return parseInt(O.getVariableSuffix(pElement.attr("id")));
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
	 * Converts a search query to GW2 wiki http link.
	 * @param string pString search entry.
	 * @returns string wiki link.
	 */
	getWikiLink: function(pString)
	{
		pString = pString.replace(/ /g, "_"); // Replace spaces with underscores
		return "http://wiki.guildwars2.com/wiki/" + escape(pString);
	},
	getWikiLanguageLink: function(pString)
	{
		pString = pString.replace(/ /g, "_");
		return "http://wiki-" + D.getFullySupportedLanguage() + ".guildwars2.com/wiki/" + escape(pString);
	},
	
	/*
	 * Converts a search query to YouTube http link.
	 * @param string pString search entry.
	 * @returns string youtube link.
	 */
	getYouTubeLink: function(pString)
	{
		return "http://www.youtube.com/results?search_query=" + escape(pString);
	}
};

/* =============================================================================
 * @@Interface HTML and CSS content manipulation
 * ========================================================================== */
I = {
	
	cSiteName: "GW2Timer.com",
	cSiteURL: "http://gw2timer.com/",
	cPageURLMap: "mapsrc.html",
	cPageURLHelp: "helpsrc.html",
	cPageURLWvW: "wvwsrc.html",
	cImageHost: "http://i.imgur.com/",
	cGameName: "Guild Wars 2",
	cPNG: ".png", // Almost all used images are PNG
	cTextDelimiterChar: "|",
	cTextDelimiterRegex: /[|]/g,
	consoleTimeout: {},
	siteTagDefault: " - gw2timer.com",
	siteTagCurrent: " - gw2timer.com",
	
	// HTML/CSS pixel units
	cPANEL_WIDTH: 360,
	cPANEL_HEIGHT: 580,
	cPANE_CLOCK_HEIGHT: 360,
	cPANE_CLOCK_HEIGHT_COMPACT: 220,
	cPANE_CLOCK_HEIGHT_BAR: 85,
	cPANE_MENU_HEIGHT: 48,
	cPANE_BEAM_LEFT: -41,
	cTOOLTIP_MAX_WIDTH: 360,
	cTOOLTIP_DEFAULT_OFFSET_X: -180,
	cTOOLTIP_DEFAULT_OFFSET_Y: 30,
	cTOOLTIP_ADD_OFFSET_Y: 42,
	cTOOLTIP_ADD_OFFSET_X: 36,
	cTOOLTIP_MOUSEMOVE_RATE: 10,
	
	// Content-Layer-Page and Section-Header
	isProgramLoaded: false,
	isProgramEmbedded: false,
	ModeCurrent: null,
	ModeEnum:
	{
		Website: "Website",
		Simple: "Simple",
		Overlay: "Overlay"
	},
	cContentPane: "#paneContent",
	cContentPrefix: "#layer",
	cMenuPrefix: "#menu",
	PageCurrent: "",
	PageEnum:
	{
		// These are the X in "menuX" and "layerX" IDs in the HTML
		Chains: "Chains",
		Map: "Map",
		WvW: "WvW",
		Help: "Help",
		Options: "Options"
	},
	SectionEnum:
	{
		Map:
		{
			Zone: "Zone",
			Daily: "Daily",
			Resource: "Resource",
			JP: "JP",
			Personal: "Personal",
			Collectible: "Collectible"
		},
		Help:
		{
			FAQ: "FAQ",
			About: "About",
			Scheduled: "Scheduled",
			Legacy: "Legacy",
			Temples: "Temples",
			Dungeons: "Dungeons"
		}
	},
	/*
	 * Number used to open a section's subcontent, written as 1-indexed via
	 * query string, but used as 0-indexed.
	 */
	ArticleCurrent: null,
	contentCurrentLayer: "", // This is cContentPrefix + contentCurrent
	isContentLoaded_Map: false,
	isContentLoaded_Help: false,
	isSectionLoadedMap_Personal: false,
	sectionPrefix: "sectionCurrent_",
	sectionCurrent_Map: "",
	sectionCurrent_Help: "",
	cHeaderPrefix: "#header",
	
	// User information
	BrowserUser: "Unknown",
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
		document.getElementById("jsTTSFrame").src = "";

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
		if (useragent.indexOf("MSIE") !== -1)
		{
			I.BrowserUser = I.BrowserEnum.IE;
		}
		else if (useragent.indexOf("Chrome") !== -1)
		{
			I.BrowserUser = I.BrowserEnum.Chrome;
		}
		else if (useragent.indexOf("Firefox") !== -1)
		{
			I.BrowserUser = I.BrowserEnum.Firefox;
		}
		else if (useragent.indexOf("Opera") !== -1)
		{
			I.BrowserUser = I.BrowserEnum.Opera;
		}
		
		// Default content layer
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
		I.bindHelpButtons("#layerOptions");
		I.initializeUIforMenu();
		I.initializeUIforChains();
		// Do special commands from the URL
		U.enforceURLArgumentsLast();
		// Clear the non-load warning after everything succeeded
		$("#paneWarning").remove();
		// Bind console buttons
		$("#jsConsoleButtonClose").click(function()
		{
			I.clear();
		});
		$("#jsConsoleButtonSelect").click(function()
		{
			I.selectText("#jsConsole");
		});
		U.convertExternalLink(".linkExternal");
		
		// The menu bar overlaps the language popup, so have to "raise" the clock pane
		$("#itemLanguage").hover(
			function() {$("#paneClock").css("z-index", 3);},
			function() {$("#paneClock").css("z-index", 0);}
		);
		
		// Clean the localStorage of unrecognized variables
		O.cleanLocalStorage();
		
		// Update and notify user of version change
		O.enforceProgramVersion();
		
		// Post translations
		D.translateAfter();
		
		I.isProgramLoaded = true;
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
		$("#jsConsoleButtons").show();
		var console = $("#jsConsole");
		var characterspersecond = 24;
		
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
			console.empty();
		}
		if (isFinite(pSeconds) === false)
		{
			/*
			 * If seconds to display was not specified, set display time
			 * based on how long the string is.
			 */
			pSeconds = 3 + parseInt(pString.length / characterspersecond);
		}
		console.append(pString + "<br />");
		
		// Ignore previous display time, which is how long before the console is cleared
		window.clearTimeout(I.consoleTimeout);
		I.consoleTimeout = setTimeout(function()
		{
			console.css({opacity: 1}).animate({opacity: 0}, 600, function()
			{
				$(this).empty().css({opacity: 1});
				$("#jsConsoleButtons").hide();
			});
		}, pSeconds * T.cMILLISECONDS_IN_SECOND);
	},
	
	/*
	 * Clears the console of all previous text.
	 */
	clear: function()
	{
		window.clearTimeout(I.consoleTimeout);
		$("#jsConsoleButtons").hide();
		$("#jsConsole").empty();
	},
	
	/*
	 * Alternative for I.write but used for testing and easier to find and remove.
	 */
	log: function(pString, pSeconds, pClear)
	{
		if (pSeconds === undefined)
		{
			pSeconds = 30;
		}
		I.write(pString, pSeconds, pClear);
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
		var rate = pTime || 0;
		pContainerOfElement.animate(
		{
			scrollTop: pElement.offset().top - pContainerOfElement.offset().top
				+ pContainerOfElement.scrollTop()
		}, rate);
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
		var i;
		var r;
		for (i in pRequests)
		{
			r = pRequests[i];
			$(r.s).animate(r.p, {duration: pSpeed, queue: false});
		}
	},
	
	/*
	 * Creates a single-level table of content for a composition (writings) layer.
	 * Example: <div class="jsTableOfContents" id="jsTOC_LAYERNAME"></div>
	 * will be filled with links to the h1 headers in that layer.
	 * @param string pLayer HTML ID of layer in the content pane.
	 */
	generateTableOfContent: function(pLayer)
	{
		if ($(pLayer + " .jsTableOfContents").hasClass("jsTableOfContents"))
		{
			var layername = pLayer.substring(1, pLayer.length);
			$(pLayer + " .jsTableOfContents").append("<h2>Table of Contents</h2><ol></ol>");

			// Convert every h1 tag
			$(pLayer + " h1").each(function()
			{
				// Scroll to top when clicked the header
				var headertext = $(this).text();
				var headertextstripped = U.stripToAlphanumeric(headertext);
				$(this).html(headertext + "<span class='tocTop'> \u2191</span>");
				$(this).click(function()
				{
					I.scrollToElement($("#jsTOC_" + I.PageCurrent), $(I.contentCurrentLayer), "fast");
				}).attr("id", "toc_" + layername + "_" + headertextstripped);
				// Add ToC list entries that scrolls to the headers when clicked
				$("<li>" + headertext + "</li>").appendTo($(pLayer + " .jsTableOfContents ol"))
					.click(function()
					{
						I.scrollToElement($("#toc_" + layername + "_" + headertextstripped),
							$(I.contentCurrentLayer), "fast");
					});
			});
		}
	},
	
	/*
	 * Binds headers with the jsSection class to toggle display of its sibling
	 * container element. Creates a vertical side menu as an alternate for clicking
	 * the headers; also creates another button-like text at the bottom of the
	 * container to collapse it again.
	 * Example: <header class="jsSection">Example Title</header><div></div>
	 * That container div should contain everything that needs to be collapsed/expanded
	 * by clicking that header tag.
	 * @param string pLayer HTML ID of layer in the content pane.
	 */
	generateSectionMenu: function(pLayer)
	{
		// Don't bind unless there exists
		if ($(pLayer + " header.jsSection").length <= 0)
		{
			return;
		}
		
		var layer = pLayer.substring(I.cContentPrefix.length, pLayer.length);
		var beamid = "menuBeam_" + layer;
		var menubeam = $("<div class='menuBeam' id='" + beamid + "'></div>").prependTo(pLayer);
		
		// Bind beam menu animation when clicked on the bar menu icon
		$(I.cMenuPrefix + layer).click(function()
		{
			$("#menuBeam_" + I.PageCurrent).css({left: 0}).animate({left: I.cPANE_BEAM_LEFT}, "fast");
		});
		
		$(pLayer + " header.jsSection").each(function()
		{
			var header = $(this);
			var headercontent = $(this).children("var").first();
			// Translate header if available
			var headertext = headercontent.data(O.Options.enu_Language) || header.text();
			headercontent.text(headertext);
			// Hide the entire collapsible div tag next to the header tag
			header.next().hide();
			header.wrapInner("<span></span>");
			header.append("<sup>[+]</sup>");
			
			// Bind click the header to toggle the sibling collapsible container
			header.click(function()
			{	
				var section = U.getSubstringFromHTMLID($(this));
				$(pLayer + " .menuBeamIcon").removeClass("menuBeamIconActive");
				
				if ($(this).next().is(":visible"))
				{
					// To be collapsed
					$(this).children("sup").text("[+]");
					
					M.displayIcons(section, false); // Hide this section's map icons
					
					I[I.sectionPrefix + layer] = ""; // Nullify current section variable
				}
				else
				{
					// To be expanded
					$(this).children("sup").text("[-]");
					$(pLayer + " .menuBeamIcon[data-section='" + section + "']")
						.addClass("menuBeamIconActive");
					
					I[I.sectionPrefix + layer] = section;
				}
				U.updateQueryString();
				
				// Do the collapse/expand
				if ($(this).data("donotanimate") !== "true")
				{
					$(this).next().toggle("fast");
					I.scrollToElement($(this), $(pLayer), "fast");
				}
				else
				{
					$(this).next().toggle();
				}
				$(this).removeData("donotanimate");
			});
			
			// Create and bind the additional bottom header to collapse the container
			$("<div class='jsSectionDone'>" + D.getSentence("done reading") + " " + headertext + "</div>")
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
			$("<img class='menuBeamIcon' data-section='" + section + "' src='" + src + "' "
				+ "title='&lt;dfn&gt;" + D.getSentence("section") + ": &lt;/dfn&gt;" + headertext + "' />")
				.appendTo(menubeam).click(function()
				{
					// Hide all the collapsible sections
					$(pLayer + " header.jsSection").each(function()
					{
						if ($(this).next().is(":visible") && $(this).attr("id") !== header.attr("id"))
						{
							// Don't animate so the scrolling to the section-to-be-opened works properly
							$(this).data("donotanimate", "true");
							$(this).trigger("click");
						}
					});
					// Show the requested section
					header.trigger("click");
				});
		});

		// Side menu icon to close all the sections
		$("<img class='menuBeamIcon' src='img/ui/exit.png' "
			+ "title='&lt;dfn&gt;Close All Sections&lt;/dfn&gt;' />")
			.appendTo(menubeam).click(function()
			{
				$(pLayer + " header.jsSection").each(function()
				{
					if ($(this).next().is(":visible"))
					{
						$(this).trigger("click");
					}
				});
				$(pLayer + " .menuBeamIcon").removeClass("menuBeamIconActive");
			});
		
		
		// Make tooltips for the beam menu icons
		I.qTip.init(pLayer + " .menuBeamIcon");
	},
	
	/*
	 * Bind tooltip or expand collapsible behavior for [?] "buttons".
	 * @param string pLayer HTML ID of layer in the content pane.
	 */
	bindHelpButtons: function(pLayer)
	{
		// These buttons expand its sibling container which is initially hidden
		$(pLayer + " .jsHelpCollapsible").each(function()
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
		$(pLayer + " .jsHelpTooltip").each(function()
		{
			var title = "<dfn>Info:</dfn> " + $(this).attr("title");
			$(this).text("[?]").attr("title", title);
		});
		
		I.qTip.init(pLayer + " .jsHelpCollapsible");
		I.qTip.init(pLayer + " .jsHelpTooltip");
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
					$(".menuButton").each(function()
					{
						// Fade icon not being hovered over
						if (!$(this).is(":hover"))
						{
							$(this).animate({opacity: cFadeOpacity}, animationspeed);
						}
					});
				},
				function()
				{
					// User moused outside the menu, so stop the animations
					$(".menuButton").finish().each(function()
					{
						$(this).animate({opacity: 1}, animationspeed);
					});
				}
		   );
		   // User hovers over individual menu icons
		   $(".menuButton").hover(
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
		 * Menu click icon to show respective content layer (page).
		 */
		$(".menuButton").each(function()
		{
			$(this).click(function()
			{
				var layer = $(this).attr("id");
				I.PageCurrent = layer.substring(I.cMenuPrefix.length-1, layer.length);
				I.contentCurrentLayer = I.cContentPrefix + I.PageCurrent;
				
				switch (I.PageCurrent)
				{
					case I.PageEnum.Chains:
					{
						$("#jsTop").hide();
						/*
						 * Get the current event map view it by triggering
						 * the binded event names.
						 */ 
						if (O.Options.bol_tourPrediction)
						{
							$("#chnEvent_" + C.CurrentChainSD.nexus + "_"
								+ C.CurrentChainSD.CurrentPrimaryEvent.num).trigger("click");
						}
					} break;
					
					case I.PageEnum.Map:
					{
						$("#jsTop").show();
						$("#jsCenter").trigger("click");
						M.PinEvent.setLatLng(M.convertGCtoLC([0,0]));
					} break;
					
					case I.PageEnum.WvW:
					{
						$("#jsTop").hide();
					} break;
					
					case I.PageEnum.Help:
					{
						$("#jsTop").show();
					} break;
					
					default:
					{
						$("#jsTop").hide();
					} break;
				}
				
				$("#paneContent article").hide(); // Hide all layers
				$(I.contentCurrentLayer + " .cntHeader").css({opacity: 0}).animate( // Fade page title
				{
					opacity: 1
				}, 400);
				$(I.contentCurrentLayer).animate( // Show clicked layer
				{
					width: "show"
				}, 200);
				// Update the address bar URL with the current layer name
				U.updateQueryString();
				
				// Also hide chain paths if on the map layer
				if (O.Options.bol_showChainPaths)
				{
					if (I.PageCurrent === I.PageEnum.Map)
					{
						M.setEntityGroupDisplay(M.ChainPathEntities, "hide");
						M.setEntityGroupDisplay(M.StoryEventIcons, "hide");
						M.setEntityGroupDisplay(M.StoryEventRings, "hide");
					}
					else
					{
						M.setEntityGroupDisplay(M.ChainPathEntities, "show");
						M.setEntityGroupDisplay(M.StoryEventActive, "show");
					}
				}
			});
		});

	   /*
		* AJAX load the separate HTML files into the content layer when user
		* clicks on respective menu icon. Most content are not generated until
		* the user expand a section of the content.
		*/
		// Map layer
		$("#menuMap").one("click", I.loadMapLayer);
		// Help layer
		$("#menuHelp").one("click", I.loadHelpLayer);
	   
	   /*
		* Scroll to top arrow text button.
		*/
		$("#jsTop").click(function()
		{
			$(I.contentCurrentLayer).animate({scrollTop: 0}, "fast");
		});
		/*
		 * Center view the map button.
		 */
		$("#jsCenter").click(function()
		{
			M.Map.setView(M.convertGCtoLC(M.cMAP_CENTER), M.ZoomLevelEnum.Default);
		});
	   
	}, // End of menu initialization
	
	/*
	 * Macro function for various written content added functionality. Must be
	 * run at the beginning of any load function's done block.
	 */
	bindAfterAJAXContent: function(pLayer)
	{
		I.generateTableOfContent(pLayer);
		I.generateSectionMenu(pLayer);
		I.bindHelpButtons(pLayer);
		M.bindMapLinks(pLayer);
		// Open links on new window
		U.convertExternalLink(pLayer + " a");
		I.qTip.init("button");
	},
	
	/*
	 * Loads the help page into the help content layer.
	 */
	loadHelpLayer: function()
	{
		$("#layerHelp").load(I.cPageURLHelp, function()
		{
			I.bindAfterAJAXContent("#layerHelp");
			$(".jsCopyCode").click(function()
			{
				$(this).select();
			});
			
			// Expand a header if requested in the URL
			U.openSectionFromURL();
			
			// Lastly
			D.translatePageHeader(I.PageEnum.Help);
			I.isContentLoaded_Help = true;
		});
	},
	
	/*
	 * Loads the map page into the map content layer.
	 */
	loadMapLayer: function()
	{
		$("#layerMap").load(I.cPageURLMap, function()
		{
			I.bindAfterAJAXContent("#layerMap");
			
			// Translate and bind map zones list
			$("#headerMap_Zone").one("click", M.bindZoneList);
			// Create daily markers
			$("#headerMap_Daily").one("click", P.generateAndInitializeDailies);
			// Create node markers and checkboxes
			$("#headerMap_Resource").one("click", P.generateAndInitializeResourceNodes);
			// Create JP checklist
			$("#headerMap_JP").one("click", function()
			{
				P.generateAndInitializeJPs();
				P.generateAndInitializeJPChecklistHTML();
			});
			// Create custom checklists
			$("#headerMap_Personal").one("click", function()
			{
				X.initializeDungeonChecklist();
				X.initializeCustomChecklist();
				I.isSectionLoadedMap_Personal = true;
			});
			// Create notepad
			$("#headerMap_Notepad").one("click", function()
			{
				X.initializeNotepad();
			});
			// Create collectible markers and checkboxes
			$("#headerMap_Collectible").one("click", P.generateAndInitializeCollectibles);
			
			// Bind show map icons when clicked on header
			$("#headerMap_Daily, #headerMap_Resource, #headerMap_JP, #headerMap_Collectible").each(function()
			{
				$(this).click(function()
				{
					// Show only if the section is about to be expanded
					if ($(this).children("sup").text() === "[-]")
					{
						M.displayIcons(U.getSubstringFromHTMLID($(this)), true);
					}
				});
			});
			
			// Create additional map related side menu icon
			$("<img class='menuBeamIcon menuBeamIconCenter' src='img/map/star.png' "
				+ "title='&lt;dfn&gt;Map Center&lt;/dfn&gt;' />")
				.appendTo("#menuBeam_Map").click(function()
			{
				$("#jsCenter").trigger("click");
			});
			I.qTip.init("#layerMap .menuBeamIconCenter, #layerMap label");
			
			// Expand a header if requested in the URL
			U.openSectionFromURL();
			
			// Lastly
			D.translatePageHeader(I.PageEnum.Map);
			I.isContentLoaded_Map = true;
		});
	},
	
	/*
	 * Events' event handlers and UI postchanges.
	 */
	initializeUIforChains: function()
	{
		/*
		 * Chains list collapsible headers.
		 */
		$("#layerChains header").click(function()
		{
			$(this).next().slideToggle("fast", function()
			{
				// Change the toggle icon after finish toggling
				if ($(this).is(":visible"))
				{
					var container = $(I.cContentPrefix + I.PageEnum.Chains);
					var header = $(this).prev();
					header.find("ins").html("[-]");
					// Automatically scroll to the clicked header
					I.scrollToElement(header, container, "fast");
				}
				else
				{
					$(this).prev().find("ins").html("[+]");
				}
			});
		});
	   
	   /*
		* Add collapse text icon to headers; first one is pre-expanded.
		*/
		$("#layerChains header:not(:first)").each(function()
		{
			$(this).next().toggle(0);
			$(this).find("ins").html("[+]");
		});
		$("#layerChains header:first").each(function()
		{
			$(this).find("ins").html("[-]");
		});

		// Download chain bar icons for unscheduled chains only when manually expanded the header
		$("#listChainsLegacy").prev().one("click", function()
		{
			C.LegacyChains.forEach(C.styleBarIcon);
		});
		$("#listChainsTemple").prev().one("click", function()
		{
			C.TempleChains.forEach(C.styleBarIcon);
		});

		/*
		 * Show individual events of a chain bar if clicked on, or
		 * automatically shown by the ticker function.
		 */
		$(".chnTitle h1").click(function()
		{
			$(this).parent().next().slideToggle(100);
		});

		/*
		 * Generate a full timetable of the chains when clicked on that header.
		 */
		$("#headerTimetable").one("click", function(){
		   C.initializeTimetableHTML(); 
		});
	},
	
	/*
	 * Changes program look based on mode.
	 */
	enforceProgramMode: function()
	{
		switch (I.ModeCurrent)
		{
			case I.ModeEnum.Overlay:
			{
				// Remove elements extraneous or intrusive to overlay mode
				$("#paneWarning").remove();
				$(".itemMapLinks a, .itemMapLinks span, #itemSocial").hide();
				// Resize fonts and positions appropriate for smaller view
				$("#jsConsole").css(
				{
					top: "12px", left: "12px",
					"font-size": "12px"
				});
				$("#jsConsoleButtons").css(
				{
					right: "0px", left: "auto", bottom: "0px"
				});
				
			} break;
			case I.ModeEnum.Simple:
			{	
				// Readjust panels
				$("#panelLeft, #paneMenu, #paneContent").hide();
				$("#panelRight").css(
				{
					background: "radial-gradient(ellipse at center, #333 0%, #222 50%, #111 100%)"
				});
				
				// Readjust clock pane
				$("#paneClock").css(
				{
					top: "auto", right: "auto", bottom: "auto", left: "auto",
					border: "none",
					"box-shadow": "none"
				});
				I.readjustSimpleClock();
				$(window).resize(function() { I.readjustSimpleClock(); });
				$("#paneClockWall, #paneClockBackground").css({opacity: 0});
				
				// Readjust clock elements
				$("#itemTimeServer, #itemSocial").hide();
				$("#itemLanguage").css({
					position: "fixed",
					top: "10px", right: "10px", bottom: "auto", left: "auto"
				});
				$("#itemClockStar0").css({ top: "68px", left: "122px" });
				$("#itemClockStar1").css({ top: "68px", left: "206px" });
				$("#itemLanguage span").css({opacity: 0.7});
				$("#itemLanguageChoices a").each(function()
				{
					var link = $(this).attr("href");
					$(this).attr("href", link + "&mode=Simple");
				});
				$("#itemTimeLocal").css({
					position: "fixed",
					bottom: "0px",
					color: "#eee",
					opacity: 0.5
				});
				I.qTip.init($("<a title='&lt;dfn&gt;Shortcut to this page&lt;/dfn&gt;: gw2timer.com/m' href='./'>"
					+ " <img id='iconSimpleHome' src='img/ui/about.png' /></a>")
					.appendTo("#itemTimeLocalExtra"));
				$("#paneBoard").show();
				
			} break;
		}
		
		// Also streamline other UI elements if website is embedded in another website
		if (I.isProgramEmbedded)
		{
			$("#paneWarning").remove();
			$(".itemMapLinks a, .itemMapLinks span").hide();
		}
	},
	
	/*
	 * Centers the clock in the browser window.
	 */
	readjustSimpleClock: function()
	{
		var height = $(window).height() / 2;
		var width = $(window).width() / 2;
		var half = I.cPANE_CLOCK_HEIGHT / 2;
		$("#paneBoard").css({
			"margin-top": height - half - 72
		});
		$("#paneClock").css(
		{
			"margin-top": height - half,
			"margin-left": width - half
		});
	},
	
	/*
	 * Initializes custom tooltips and sets mouse-tooltip behavior.
	 */
	initializeTooltip: function()
	{
		// Bind the following tags with the title attribute for tooltip
		I.qTip.init("a, ins, span, img, fieldset, label, input, button, .menuButton");
		
		/*
		 * Make the tooltip appear within the visible window by detecting current
		 * tooltip size and mouse position.
		 */
		$("#panelRight").mousemove($.throttle(I.cTOOLTIP_MOUSEMOVE_RATE, function(pEvent)
		{
			/*
			$("#jsConsole").html(pEvent.pageX + ", " + pEvent.pageY + "<br />"
				+ $("#qTip").width() + ", " + $("#qTip").height() + "<br />"
				+ $(window).width() + ", " + $(window).height());
			*/
			// Tooltip overflows bottom edge
			if ($("#qTip").height() + pEvent.pageY + I.cTOOLTIP_ADD_OFFSET_Y
				> $(window).height())
			{
				I.qTip.offsetY = -($("#qTip").height()) - I.cTOOLTIP_ADD_OFFSET_Y;
			}
			else
			{
				I.qTip.offsetY = I.cTOOLTIP_DEFAULT_OFFSET_Y;
			}
			I.qTip.offsetX = I.cTOOLTIP_DEFAULT_OFFSET_X;
		}));
		$("#panelLeft").mousemove($.throttle(I.cTOOLTIP_MOUSEMOVE_RATE, function(pEvent)
		{
			// Tooltip overflows right edge
			if (I.cTOOLTIP_MAX_WIDTH + pEvent.pageX + I.cTOOLTIP_ADD_OFFSET_X > $(window).width())
			{
				I.qTip.offsetX = -(I.cTOOLTIP_MAX_WIDTH) - I.cTOOLTIP_ADD_OFFSET_X;
			}
			else
			{
				I.qTip.offsetX = 24;
			}
			// Tooltip overflows bottom edge
			if ($("#qTip").height() - 24 + pEvent.pageY > $(window).height())
			{
				I.qTip.offsetY = -($("#qTip").height()) - I.cTOOLTIP_ADD_OFFSET_Y;
			}
			// Tooltip overflows top edge
			else if (pEvent.pageY < 42)
			{
				I.qTip.offsetY = 32;
			}
			else
			{
				I.qTip.offsetY = -42;
			}
		}));
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
		init: function(s)
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
					document.onmousemove = function(a)
					{
						I.qTip.move(a);
					};
				}
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
			}
		},
		move: function(a)
		{
			var x = 0,
				y = 0;
			document.all ? (x = document.documentElement && document.documentElement.scrollLeft
				? document.documentElement.scrollLeft : document.body.scrollLeft,
				y = document.documentElement && document.documentElement.scrollTop
				? document.documentElement.scrollTop : document.body.scrollTop,
				x += window.event.clientX, y += window.event.clientY
			) : (x = a.pageX, y = a.pageY);
			/*
			$("#jsConsole").html(
				x + ", " + y + "<br />"
				+ (this.a.offsetWidth) + ", " + (this.a.offsetHeight) + "<br />"
				+ window.innerWidth + ", " + window.innerHeight);
			 */
			this.a.style.left = x + this.offsetX + "px";
			this.a.style.top = y + this.offsetY + "px";
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
 *  Executions, the order matters!
 * ============================================================= */
I.initializeFirst(); // initialize variables that need to be first
O.initializeOptions(); // load stored or default options to the HTML input
T.initializeSchedule(); // compute event data and write HTML
M.initializeMap(); // instantiate the map and populate it
K.initializeClock(); // start the clock and infinite loop
I.initializeLast(); // bind event handlers for misc written content




});//]]>// END OF JQUERY NEST