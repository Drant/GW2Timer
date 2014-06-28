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
	T - Time utilities
	K - Clock SVG
	I - Interface UI

*/

$(window).on("load", function() {
	
/* =============================================================================
 *  Single letter objects serve as namespaces.
 * ========================================================================== */
var O = {}; // options
var X = {}; // checklists
var D = {}; // dictionary
var C = {}; // chains
var M = {}; // map
var T = {}; // time
var K = {}; // clock
var I = {}; // interface

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
		programVersion: {key: "int_utlProgramVersion", value: 140624},
		lastLocalResetTimestamp: {key: "int_utlLastLocalResetTimestamp", value: 0}
	},
	
	/*
	 * All of these options should have an associated input tag in the HTML that
	 * users interact with, and their IDs are in the form prefixOption + optionkey.
	 * Note the three letter prefix indicating the option's data type.
	 */
	Options:
	{
		// Generic
		enu_Language: "en",
		// Timer
		bol_hideChecked: false,
		bol_use24Hour: true,
		bol_compactClock: true,
		bol_showClock: true,
		int_setClockBackground: 0,
		int_setTimeStyle: 0,
		int_setPredictor: 0,
		// Map
		bol_tourPrediction: true,
		bol_showChainPaths: true,
		bol_showMap: true,
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
		bol_detectDST: true
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
			Dutch: "nl",
			Polish: "pl",
			Russian: "ru",
			Mandarin: "zh"
		}
	},
	
	/*
	 * Checks if the specified value is within the enum object, and returns it
	 * if found, or returns the default if not.
	 * @param string pEnumName of the enum object.
	 * @param string pEnumValue to check.
	 * @returns string valid enum or the default.
	 */
	validateEnum: function(pEnumName, pValue)
	{
		var i;
		var enumobject = O.OptionEnum[pEnumName];
		for (i in enumobject)
		{
			if (enumobject[i] === pValue)
			{
				return pValue;
			}
		}
		return O.Options["enu_" + pEnumName];
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
			I.write(I.cSiteName + " was updated since your last visit.<br />"
			+ "This version: " + currentversion + "<br />"
			+ "Your version: " + usersversion + "<br />"
			+ "Would you like to see the <a id='urlUpdates' href='http://forum.renaka.com/topic/5500046/'>changes</a>?<br />", 20);
			I.convertExternalLink("#urlUpdates");
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
	 * Checks localStorage for unrecognized variables and remove them.
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
	 * URLArguments may contain Options object's variables. Written in the form of:
	 * http://example.com/?ExampleKey=ExampleValue&MoreExampleKey=MoreExampleValue
	 * so if a user enters http://gw2timer.com/?bol_showClock=false then the clock
	 * will be hidden regardless of previous localStorage or the defaults here.
	 * Note that "bol_showClock" matches exactly as in the Options, otherwise
	 * it would have not overridden any Options variable. Values used apart from
	 * comparison should be sanitized first.
	 */
	URLArguments: {},
	
	/*
	 * Extracts arguments from a https://en.wikipedia.org/wiki/Query_string
	 * @returns object containing the key-value pairs.
	 */
	getURLArguments: function()
	{
		var urlargs = window.location.search.substr(1).split('&');
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
		O.URLArguments = O.getURLArguments();
		
		var i;
		var ismodeset = false;
		// Set up program mode
		if (O.URLArguments[I.URLKeyMode])
		{
			var mode = O.URLArguments[I.URLKeyMode];
			for (i in I.programModeEnum)
			{
				if (I.programModeEnum[i].toLowerCase() === mode.toLowerCase())
				{
					I.programMode = I.programModeEnum[i];
					ismodeset = true;
					break;
				}
			}
		}
		if (ismodeset === false)
		{
			I.programMode = I.programModeEnum.Website;
		}
	},
	
	/*
	 * Sanitizes URLArguments value part before overriding. For example:
	 * http://gw2timer.com/?bol_showClock=falsse "falsse" defaults to "true"
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
			case "bol":
			{
				if (s === "true" || s === "false")
				{
					return s;
				}
				return O.Options[pKey].toString(); // Default boolean
			} break;
			case "int":
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
			case "flt":
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
			case "enu":
			{
				var enumname = pKey.split("_")[1];
				return O.validateEnum(enumname, pValue);
			} break;
			case "str":
			{
				return O.escapeHTML(pValue);
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
	 * Converts an integer to boolean. For use by radio buttons with two choices.
	 * @param int pInteger to convert.
	 * @returns boolean boolean of integer.
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
	 * Returns false if object is undefined or null or falsie, otherwise true.
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
		var yesterdaysserverresettime = T.getUNIXSeconds() - T.getTimeOffsetSinceMidnight("utc", "seconds");
		
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
		// Load or initialize input options
		for (optionkey in O.Options)
		{
			/*
			 * Initialize legal numeric values by looking up the associated
			 * input tag.
			 */
			$("#" + O.prefixOption + optionkey).each(function()
			{
				var inputtype = $(this).attr("type");
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
			if (I.programMode === I.programModeEnum.Embedded)
			{
				if (O.URLArguments[optionkey] !== undefined)
				{
					O.Options[optionkey] = O.convertLocalStorageDataType(
					O.sanitizeURLOptionsValue(optionkey, O.URLArguments[optionkey]));
				}
			}
			else
			{
				if (O.URLArguments[optionkey] !== undefined)
				{
					// Override localStorage
					localStorage[optionkey] = O.sanitizeURLOptionsValue(
						optionkey, O.URLArguments[optionkey]);
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
				var inputtype = $(this).attr("type");
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
				$("#chnCheck_" + chain.alias).removeClass("chnChecked");
				$("#barChain_" + chain.alias).css({opacity: 1});
				if (X.getChecklistItem(X.Checklists.Chain, chain.index) !== X.ChecklistEnum.Disabled)
				{
					$("#barChain_" + chain.alias).show();
				}
			}
			X.clearChecklist(X.Checklists.Chain, "uncheck");
			I.write("Chains checklist cleared as opted.", messagetime);
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
			I.write("Personal checklist cleared as opted.", messagetime);
		}
		I.write("", messagetime);
		
		O.updateLocalResetTimestamp();
	},
	
	/*
	 * Binds custom event handlers for options that need immediate visual effect.
	 */
	bindOptionsInputs: function()
	{
		$("#opt_bol_hideChecked").change(function()
		{
			O.enact_bol_hideChecked();
		});
		$("#opt_bol_use24Hour").change(function()
		{
			O.enact_bol_use24Hour();
		});
		$("#opt_bol_detectDST").change(function()
		{
			O.enact_bol_detectDST();
		});
		$("#opt_bol_compactClock").change(function()
		{
			O.enact_bol_compactClock();
		});
		$("#opt_bol_showClock").change(function()
		{
			O.enact_bol_showClock();
		});
		$("fieldset[name=int_setClockBackground]").change(function()
		{
			O.enact_int_setClockBackground();
		});
		$("fieldset[name=int_setTimeStyle]").change(function()
		{
			O.enact_int_setTimeStyle();
		});
		$("#opt_bol_showChainPaths").change(function()
		{
			O.enact_bol_showChainPaths();
		});
		$("#opt_bol_showMap").change(function()
		{
			O.enact_bol_showMap();
			// Leaflet map breaks when it is shown after being hidden, so have to reload
			if (O.Options.bol_showMap)
			{
				location.reload();
			}
		});
		/*
		 * Run enactors when the page loads (because this an initializer function).
		 * Will have to place it elsewhere if it requires data to be loaded first.
		 */
		O.enact_bol_hideChecked();
		O.enact_bol_detectDST();
		O.enact_bol_compactClock();
		O.enact_bol_showClock();
		O.enact_int_setClockBackground();
		O.enact_bol_showMap();
		
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
				$("#chnCheck_" + chain.alias).removeClass("chnChecked");
				$("#barChain_" + chain.alias).show().css({opacity: 1});
			}
			X.clearChecklist(X.Checklists.Chain);
			// Also unfade the clock icons, which are the current first four bosses
			for (i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
			{
				K.checkoffChainIcon(T.getStandardChain(i).index);
				var chainhardcore = T.getHardcoreChain(i);
				if (chainhardcore)
				{
					K.checkoffChainIcon(chainhardcore.index);
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
				var key = O.escapeHTML(localStorage.key(i));
				keys.push(key);
			}
			// Sort them alphabetically
			keys.sort();
			
			var s = "";
			// Print the key-value pairs by the key's order
			for (i in keys)
			{
				var value = O.escapeHTML(localStorage.getItem(keys[i]));
				s += keys[i] + ": " + value + "<br />";
			}
			
			I.write(s, 30, true);
		});
	},
	
	/*
	 * Functions to enact the options, for which a simple variable change is
	 * not enough.
	 * -------------------------------------------------------------------------
	 */
	enact_bol_hideChecked: function()
	{
		$(".barChain").each(function()
		{
			if (X.getChecklistItem(X.Checklists.Chain, $(this).data("index"))
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
	enact_bol_use24Hour: function()
	{
		C.initializeTimetableHTML();
		C.updateChainsTimeHTML();
	},
	enact_bol_detectDST: function()
	{
		T.DST_IN_EFFECT = (O.Options.bol_detectDST) ? 1 : 0;
	},
	enact_bol_compactClock: function()
	{
		if (I.programMode === I.programModeEnum.Simple)
		{
			return;
		}
		
		var animationspeed = 200;
		var clockheight = 0;
		if (O.Options.bol_compactClock)
		{
			// Reposition clock items
			I.bulkAnimate([
				{s: "#itemClockFace .iconSD", p: {"border-radius": "32px"}},
				{s: "#itemClockFace .iconHC", p: {"border-radius": "24px"}},
				{s: "#itemClock", p: {top: "0px"}},
				{s: "#itemClockIconStandard0", p: {top: "4px", left: "290px"}},
				{s: "#itemClockIconStandard1", p: {top: "148px", left: "290px"}},
				{s: "#itemClockIconStandard2", p: {top: "148px", left: "4px"}},
				{s: "#itemClockIconStandard3", p: {top: "4px", left: "4px"}},
				{s: "#itemClockIconHardcore0", p: {top: "52px", left: "306px"}},
				{s: "#itemClockIconHardcore1", p: {top: "132px", left: "306px"}},
				{s: "#itemClockIconHardcore2", p: {top: "132px", left: "20px"}},
				{s: "#itemClockIconHardcore3", p: {top: "52px", left: "20px"}},
				{s: "#itemClockWaypoint0", p: {top: "24px", left: "274px"}},
				{s: "#itemClockWaypoint1", p: {top: "164px", left: "274px"}},
				{s: "#itemClockWaypoint2", p: {top: "164px", left: "52px"}},
				{s: "#itemClockWaypoint3", p: {top: "24px", left: "52px"}}
			], animationspeed);
			$("#itemClockFace .iconHC").css({width: "32px", height: "32px"});
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
			
			// Resize panes by animation
			if (O.Options.bol_showClock)
			{
				clockheight = I.cPANE_CLOCK_HEIGHT_COMPACT;
			}
			$("#paneMenu").animate({top: clockheight}, animationspeed);
			$("#paneClock, #paneClockBack, #paneClockBackground, #itemClockFace")
				.animate({height: I.cPANE_CLOCK_HEIGHT_COMPACT}, animationspeed);
			
			// Readjust content pane
			$(I.cContentPane).css({"min-height": I.cPANEL_HEIGHT
				- (I.cPANE_CLOCK_HEIGHT_COMPACT + I.cPANE_MENU_HEIGHT) + "px"});
	
			// Readjust content pane
			if (O.Options.bol_showClock)
			{
				$(I.cContentPane).animate({top: clockheight + I.cPANE_MENU_HEIGHT,
					"min-height": I.cPANEL_HEIGHT
					- (I.cPANE_CLOCK_HEIGHT_COMPACT + I.cPANE_MENU_HEIGHT) + "px"}, animationspeed);
			}
			else
			{
				$(I.cContentPane).animate({top: clockheight + I.cPANE_MENU_HEIGHT}, animationspeed)
					.css({"min-height": I.cPANEL_HEIGHT - (I.cPANE_MENU_HEIGHT) + "px"});
			}
		}
		else
		{
			// Reposition clock items
			I.bulkAnimate([
				{s: "#itemClockFace .iconSD", p: {"border-radius": "12px"}},
				{s: "#itemClockFace .iconHC", p: {"border-radius": "12px"}},
				{s: "#itemClock", p: {top: "70px"}},
				{s: "#itemClockIconStandard0", p: {top: "4px", left: "148px"}},
				{s: "#itemClockIconStandard1", p: {top: "148px", left: "290px"}},
				{s: "#itemClockIconStandard2", p: {top: "290px", left: "148px"}},
				{s: "#itemClockIconStandard3", p: {top: "148px", left: "4px"}},
				{s: "#itemClockIconHardcore0", p: {top: "12px", left: "212px"}},
				{s: "#itemClockIconHardcore1", p: {top: "212px", left: "298px"}},
				{s: "#itemClockIconHardcore2", p: {top: "298px", left: "100px"}},
				{s: "#itemClockIconHardcore3", p: {top: "100px", left: "12px"}},
				{s: "#itemClockWaypoint0", p: {top: "52px", left: "164px"}},
				{s: "#itemClockWaypoint1", p: {top: "164px", left: "274px"}},
				{s: "#itemClockWaypoint2", p: {top: "274px", left: "164px"}},
				{s: "#itemClockWaypoint3", p: {top: "164px", left: "52px"}}
			], animationspeed);
			$("#itemClockFace .iconHC").css({width: "48px", height: "48px"});
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
			
			// Resize panes by animation
			if (O.Options.bol_showClock)
			{
				clockheight = I.cPANE_CLOCK_HEIGHT;
			}
			$("#paneMenu").animate({top: clockheight}, animationspeed);
			$("#paneClock, #paneClockBack, #paneClockBackground, #itemClockFace")
				.animate({height: I.cPANE_CLOCK_HEIGHT}, animationspeed);
		
			// Readjust content pane
			if (O.Options.bol_showClock)
			{
				$(I.cContentPane).animate({top: (clockheight + I.cPANE_MENU_HEIGHT),
					"min-height": I.cPANEL_HEIGHT
					- (I.cPANE_CLOCK_HEIGHT + I.cPANE_MENU_HEIGHT) + "px"}, animationspeed);
			}
			else
			{
				$(I.cContentPane).animate({top: (clockheight + I.cPANE_MENU_HEIGHT),
					"min-height": I.cPANEL_HEIGHT
					- (I.cPANE_MENU_HEIGHT) + "px"}, animationspeed);
			}
		}
		
		K.reapplyFilters();
	},
	enact_bol_showClock: function()
	{
		if (I.programMode === I.programModeEnum.Simple)
		{
			return;
		}
		/*
		 * There are three panes on the right panel: Clock, Menu, and Content
		 * all absolutely positioned, so to move them the CSS "top" attribute
		 * needs to be changed: less to go up, more to go down.
		 */
		var animationspeed = 200;
		if (O.Options.bol_showClock)
		{
			var clockheight = I.cPANE_CLOCK_HEIGHT;
			if (O.Options.bol_compactClock)
			{
				clockheight = I.cPANE_CLOCK_HEIGHT_COMPACT;
			}
			$("#paneClock").show();
			$("#paneMenu").animate({top: clockheight}, animationspeed);
			
			// Readjust content pane
			if (O.Options.bol_compactClock)
			{
				$(I.cContentPane).animate({top: (clockheight + I.cPANE_MENU_HEIGHT),
					"min-height": I.cPANEL_HEIGHT
					- (I.cPANE_CLOCK_HEIGHT_COMPACT + I.cPANE_MENU_HEIGHT) + "px"}, animationspeed);
			}
			else
			{
				$(I.cContentPane).animate({top: (clockheight + I.cPANE_MENU_HEIGHT),
					"min-height": I.cPANEL_HEIGHT
					- (I.cPANE_CLOCK_HEIGHT + I.cPANE_MENU_HEIGHT) + "px"}, animationspeed);
			}
		}
		else
		{
			$("#paneMenu").animate({top: 0}, animationspeed);
			$(I.cContentPane).animate({top: I.cPANE_MENU_HEIGHT,
				"min-height": I.cPANEL_HEIGHT - (I.cPANE_MENU_HEIGHT) + "px"}, animationspeed,
			function()
			{
				$("#paneClock").hide();
			});
		}
		
		K.reapplyFilters();
	},
	enact_int_setClockBackground: function()
	{
		switch (O.Options.int_setClockBackground)
		{
			case 1: $("#paneClockBackground").css({opacity: 1}); break;
			case 2: $("#paneClockBackground").css({opacity: 0}); break;
		}
	},
	enact_int_setTimeStyle: function()
	{
		C.updateChainsTimeHTML();
	},
	enact_bol_showChainPaths: function()
	{
		M.setEntityGroupDisplay(M.ChainPathEntities, O.Options.bol_showChainPaths);
	},
	enact_bol_showMap: function()
	{
		if (O.Options.bol_showMap)
		{
			$("#paneMap").show();
		}
		else
		{
			$("#paneMap").hide();
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
	 * checklists with such a string and a key for localStorage.
	 */
	Checklists:
	{
		// localStorage key-value pairs (key is required)
		Chain: { key: "str_chlChain", value: "" },
		ChainSubscription: { key: "str_chlChainSubscription", value: "" },
		JP: { key: "str_chlJP", value: "" },
		Dungeon: { key: "str_chlDungeon", value: "", money: 0 },
		Custom: { key: "str_chlCustom", value: "" },
		CustomText:
		{
			key: "str_chlCustomText",
			value: new Array(),
			valueDefault: new Array()
		}
	},
	ChecklistEnum:
	{
		Unchecked: "0",
		Checked: "1",
		Disabled: "2"
	},
	
	/*
	 * Creates a string for a checklist object with each character representing
	 * a state, and each index representing a check item. Also initializes the
	 * localStorage or load it as the checklist if already stored.
	 * @param object pChecklist to initialize.
	 * @param int pLength of the checklist string to construct.
	 * @returns string new checklist to be assigned to a checklist variable.
	 */
	initializeChecklist: function(pChecklist, pLength)
	{		
		pChecklist.length = pLength;
		/*
		 * If localStorage doesn't have the checklist already or if it's an
		 * improper length then it gets a default checklist string of 0's.
		 */
		if (localStorage[pChecklist.key] === undefined
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
	 * @returns string new checklist to be assigned to a checklist variable.
	 */
	setChecklistItem: function(pChecklist, pIndex, pCharacter)
	{
		// A character must be length 1 and different from the current
		var thechar = pCharacter.toString();
		if (thechar.length === 1 && pChecklist.value[pIndex] !== thechar)
		{
			var checklist = O.replaceCharAt(pChecklist.value, pIndex, thechar);
			localStorage[pChecklist.key] = checklist;
			pChecklist.value = checklist;
		}
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
		if (pConversion === "int")
		{
			return parseInt(thechar);
		}
		if (pConversion === "boolean")
		{
			return O.intToBool(parseInt(thechar));
		}
		return thechar;
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
			
			var bar = $("#barChain_" + chain.alias);
			var check = $("#chnCheck_" + chain.alias);
			var time = $("#chnTime_" + chain.alias);
			
			// Set the checkbox visual state as stored
			switch (X.getChecklistItem(X.Checklists.Chain, chain.index))
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
			if (X.getChecklistItem(X.Checklists.ChainSubscription, chain.index) ===
					X.ChecklistEnum.Checked)
			{
				time.addClass("chnTimeSubscribed");
			}
			
			/*
			 * Bind event handler for the time clickable for subscription.
			 */
			time.click(function()
			{
				var index = $(this).data("index");
				
				if (X.getChecklistItem(X.Checklists.ChainSubscription, index) === X.ChecklistEnum.Checked)
				{
					$(this).removeClass("chnTimeSubscribed");
					X.setChecklistItem(X.Checklists.ChainSubscription, index, X.ChecklistEnum.Unchecked);
				}
				else
				{
					$(this).addClass("chnTimeSubscribed");
					X.setChecklistItem(X.Checklists.ChainSubscription, index, X.ChecklistEnum.Checked);
				}
			});
			
			/*
			 * Bind event handler for the div "checkboxes".
			 */
			check.click(function()
			{
				// The ID was named so by the chain initializer, get the chain alias
				var alias = I.getIndexFromHTMLID($(this));
				var index = $(this).data("index");
				var thisbar = $("#barChain_" + alias);
				// State of the div is stored in the Checklist object rather in the element itself
				switch (X.getChecklistItem(X.Checklists.Chain, index))
				{
					case X.ChecklistEnum.Unchecked:
					{
						thisbar.css({opacity: 1}).animate({opacity: K.iconOpacityChecked}, K.iconOpacitySpeed);
						$(this).addClass("chnChecked");
						X.setChecklistItem(X.Checklists.Chain, index, X.ChecklistEnum.Checked);
					} break;
					case X.ChecklistEnum.Checked:
					{
						thisbar.css({opacity: 1}).show("fast");
						thisbar.css({opacity: K.iconOpacityChecked}).animate({opacity: 1}, K.iconOpacitySpeed);
						$(this).removeClass("chnChecked");
						X.setChecklistItem(X.Checklists.Chain, index, X.ChecklistEnum.Unchecked);
					} break;
					case X.ChecklistEnum.Disabled:
					{
						thisbar.css({opacity: 1}).show("fast");
						$(this).removeClass("chnChecked");
						X.setChecklistItem(X.Checklists.Chain, index, X.ChecklistEnum.Unchecked);
					} break;
				}
				// Also autohide the chain bar if opted
				if (X.getChecklistItem(X.Checklists.Chain, index) === X.ChecklistEnum.Checked)
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
				K.checkoffChainIcon(index);
			});
			
			// Bind the delete chain text button [x]
			$("#chnDelete_" + chain.alias).click(function()
			{
				var alias = I.getIndexFromHTMLID($(this));
				var index = $(this).data("index");
				var thisbar = $("#barChain_" + alias);

				thisbar.hide("slow");
				X.setChecklistItem(X.Checklists.Chain, index, X.ChecklistEnum.Disabled);
				
				// Also update the clock icon
				K.checkoffChainIcon(index);
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
		return X.getChecklistItem(X.Checklists.Chain, pChain.index);
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
				+ $(this).data("name").toLowerCase() + I.cImageMainExtension + "' />");
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
			
			// Initialize default value of associated text field
			var text = $(this).parent().next().val();
			X.Checklists.CustomText.value.push(text);
			X.Checklists.CustomText.valueDefault.push(text);
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
		
		/*
		 * Each text fields' value will become a delimited substring in one
		 * single string to be stored in localStorage.
		 */
		var i;
		if (localStorage[X.Checklists.CustomText.key] === undefined)
		{
			// If localStorage value is empty, replace with original values in text field
			localStorage[X.Checklists.CustomText.key] = X.Checklists.CustomText.value.join(I.cTextDelimiter);
		}
		else
		{
			var storedtextarray = localStorage[X.Checklists.CustomText.key].split(I.cTextDelimiter);
			if (storedtextarray.length === X.Checklists.CustomText.value.length)
			{
				// Load the stored text if it has same number of strings as there are text fields
				for (i in storedtextarray)
				{
					X.Checklists.CustomText.value[i] = storedtextarray[i];
				}
			}
			else
			{
				localStorage[X.Checklists.CustomText.key] = X.Checklists.CustomText.value.join(I.cTextDelimiter);
			}
		}
		
		var updateStoredText = function()
		{
			var regex = "/\\" + I.cTextDelimiter + "/g";
			// Read every text fields and rewrite the string of substrings again
			$("#chlCustom input:text").each(function(pIndex)
			{
				X.Checklists.CustomText.value[pIndex] = $(this).val().replace(regex, "");
			});
			localStorage[X.Checklists.CustomText.key] = X.Checklists.CustomText.value.join(I.cTextDelimiter);
		};
		
		// Bind text fields behavior
		$("#chlCustom input:text").each(function(pIndex)
		{
			// Set number of characters allowed in the text field
			$(this).attr("maxlength", 48);
			$(this).val(X.Checklists.CustomText.value[pIndex]); // Load initialized text
			
			$(this).change(function()
			{
				I.write("Custom checklist item #" + (pIndex + 1) + " updated.");
				updateStoredText();
			});
		});
		
		// Bind restore text button
		$("#chlCustomRestore").click(function()
		{
			$("#chlCustom input:text").each(function(pIndex)
			{
				$(this).val(X.Checklists.CustomText.valueDefault[pIndex]).trigger("change");
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
		s_TEMPLATE: {de: "", es: "", fr: "", nl: "", pl: "", ru: "", zh: ""},
		
		// Time
		s_s: {de: "s", es: "s", fr: "s", nl: "s", pl: "s", ru: "с", zh: "秒"},
		s_m: {de: "m", es: "m", fr: "m", nl: "m", pl: "m", ru: "м", zh: "分"},
		s_h: {de: "s", es: "h", fr: "h", nl: "u", pl: "g", ru: "ч", zh: "時"},
		s_second: {de: "sekunde", es: "segundo", fr: "seconde", nl: "seconde", pl: "sekund", ru: "секунду", zh: "秒"},
		s_minute: {de: "minute", es: "minuto", fr: "minute", nl: "minuut", pl: "minuta", ru: "минута", zh: "分"},
		s_hour: {de: "stunde", es: "hora", fr: "heure", nl: "uur", pl: "godzinę", ru: "час", zh: "時"},
		s_seconds: {de: "sekunden", es: "segundos", fr: "secondes", nl: "seconden", pl: "sekund", ru: "секунд", zh: "秒"},
		s_minutes: {de: "minuten", es: "minutos", fr: "minutes", nl: "minuten", pl: "minut", ru: "минут", zh: "分"},
		s_hours: {de: "studen", es: "horas", fr: "heures", nl: "uur", pl: "godzin", ru: "часов", zh: "時"},
		s_half_an_hour: {de: "eine halbe stunde", es: "media hora", fr: "demi-heure", nl: "een half uur", pl: "pół godziny", ru: "полчаса", zh: "半小時"},
		
		// Nouns
		s_world_boss: {de: "weltendgegner", es: "jefe mundo", fr: "chef monde", nl: "wereld eindbaas", pl: "świat szef", ru: "мир босс", zh: "世界頭目"},
		s_section: {de: "paragraph", es: "sección", fr: "section", nl: "paragraaf", pl: "sekcja", ru: "параграф", zh: "節"},
		
		// Verbs
		s_done_reading: {de: "ende gelesen", es: "terminado de leer", fr: "fini de lire", nl: "klaar met lezen", pl: "przeczytaniu", ru: "закончите читать", zh: "讀完"},
		s_is: {de: "ist", es: "es", fr: "est", nl: "is", pl: "jest", ru: "является", zh: "是"},
		s_subscribe: {de: "abonnieren", es: "subscribir", fr: "abonner", nl: "abonneren", pl: "abonować", ru: "подписываться", zh: "訂閱"},
		s_will_start: {de: "wird starten", es: "se iniciará", fr: "débutera", nl: "zal starten", pl: "rozpocznie się", ru: "начнется", zh: "開始"},
		
		// Adjectives and Adverbs
		s_ago: {de: "vor", es: "hace", fr: "il ya", nl: "geleden", pl: "temu", ru: "назад", zh: "前"},
		s_also: {de: "auch", es: "también", fr: "aussi", nl: "ook", pl: "też", ru: "то́же", zh: "也"},
		s_checked: {de: "abgehakt", es: "visto", fr: "coché", nl: "afgevinkt", pl: "zakończony", ru: "галочка", zh: "勾掉"},
		s_current: {de: "aktuelle", es: "actual", fr: "actuel", nl: "huidige", pl: "bieżący", ru: "текущий", zh: "活期"},
		s_next: {de: "nächste", es: "siguiente", fr: "prochain", nl: "volgende", pl: "następny", ru: "следующий", zh: "下一"},
		s_subscribed: {de: "abonniert", es: "suscrito", fr: "souscrit", nl: "geabonneerd", pl: "subskrypcji", ru: "подписал", zh: "訂閱"},
		s_then: {de: "dann", es: "luego", fr: "puis", nl: "dan", pl: "potem", ru: "затем", zh: "接著"},
		
		// Prepositions and Conjunctions
		s_and: {de: "und", es: "y", fr: "et", nl: "en", pl: "i", ru: "и", zh: "和"},
		s_in: {de: "in", es: "en", fr: "en", nl: "in", pl: "w", ru: "в", zh: "在"}
	},
	
	Element:
	{
		s_TEMPLATE: {de: "", es: "", fr: "", nl: "", pl: "", ru: "", zh: ""},

		s_linkModeSimple: {de: "einfach modus", es: "modo simple", fr: "mode simple", nl: "eenvoudig modus", pl: "prosty tryb", ru: "простой Режим", zh: "方式簡單"},
		s_menuChains: {de: "Zeitplan", es: "Horario", fr: "Horaire", nl: "Dienstregeling", pl: "Harmonogram", ru: "Расписание", zh: "時間表"},
		s_menuMap: {de: "Werkzeuge", es: "Útiles", fr: "Outils", nl: "Gereedschap", pl: "Narzędzia", ru: "Инструментарий", zh: "工具"},
		s_menuHelp: {de: "Hilfe", es: "Ayuda", fr: "Assistance", nl: "Hulp", pl: "Pomoc", ru: "Помощь", zh: "輔助"},
		s_menuOptions: {de: "Optionen", es: "Opciónes", fr: "Options", nl: "Opties", pl: "Opcje", ru: "Опции", zh: "選項"},
		s_opt_bol_alertSubscribed: {
			de: "<dfn>Alarm Modus:</dfn><br />☐ = Checkliste<br />☑ = Abonnement",
			es: "<dfn>Modo de Alarma:</dfn><br />☐ = Lista de Verificación<br />☑ = Suscripción",
			fr: "<dfn>Mode d'Alarme:</dfn><br />☐ = Check-list<br />☑ = Abonnement",
			nl: "<dfn>Alarm Modus:</dfn><br />☐ = Checklist<br />☑ = Abonnement",
			pl: "<dfn>Alarmu Tryb:</dfn><br />☐ = Lista Kontrolna<br />☑ = Abonament",
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
		return O.toFirstUpperCase(D.getTranslation(pText, D.Phrase));
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
	 * Does translations for preloaded (not AJAX or generated) content.
	 */
	translateAfter: function()
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return;
		}
		
		$("#linkModeSimple").text(D.getElement("linkModeSimple"));
		$("#paneMenu span").each(function()
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
	},
		
	// Must be in the same order as the chain indexes
	ChainTitle: [
	{
		en: "Fire Elemental",
		de: "Feuerelementar",
		es: "Elemental de Fuego",
		fr: "Elémentaire de Feu",
		nl: "Vuurelement",
		pl: "Ognisty Żywioł",
		ru: "Огонь Элементаль",
		zh: "火元素"
	},{
		en: "Golem Mark II",
		de: "Inquestur-Golem Typ II",
		es: "Gólem Serie II de la Inquisa",
		fr: "Golem Marque II de l'Enqueste",
		nl: "Inquest Golem versie 2",
		pl: "Golem Model 2",
		ru: "Следствие Голем Тип II",
		zh: "勘驗魔像2型"
	},{
		en: "Claw of Jormag",
		de: "Klaue Jormags",
		es: "Garra de Jormag",
		fr: "Griffe de Jormag",
		nl: "Jormags Klauw",
		pl: "Szpon Jormaga",
		ru: "Йормаг Коготь",
		zh: "Jormag 爪"
	},{
		en: "Svanir Shaman",
		de: "Schamanenoberhaupt der Svanir",
		es: "Jefe Chamán Svanir",
		fr: "Chef Chamane de Svanir",
		nl: "Svanirs Sjamaan",
		pl: "Wódz Szamanów Svanira",
		ru: "Главный Шаман Сванир",
		zh: "Svanir 的首席薩滿"
	},{
		en: "Megadestroyer",
		de: "Megazerstörer",
		es: "Megadestructor",
		fr: "Mégadestructeur",
		nl: "Megadestroyer",
		pl: "Wielki Niszczyciel",
		ru: "Мегадеструктор",
		zh: "兆豐析構函數"
	},{
		en: "Shadow Behemoth",
		de: "Schatten-Behemoth",
		es: "Behemot de las Sombras",
		fr: "Béhémoth des Ombres",
		nl: "Schaduw Behemoth",
		pl: "Mroczny Behemot",
		ru: "Бегемот из тени",
		zh: "影子的巨獸"
	},{
		en: "The Shatterer",
		de: "Den Zerschmetterer",
		es: "El Asolador",
		fr: "Le Destructeur",
		nl: "De Vermorzelaar",
		pl: "Shatterer",
		ru: "Шаттерер",
		zh: "析構函數"
	},{
		en: "Taidha Covington",
		de: "Admiral Taidha Covington",
		es: "Almirante Taidha Covington",
		fr: "Amirale Taidha Covington",
		nl: "Admiraal Taidha Covington",
		pl: "Admirał Taidha Covington",
		ru: "Адмирал Таидха Цовингтон",
		zh: "海軍上將 Taidha Covington"
	},{
		en: "Modniir Ulgoth",
		de: "Ulgoth den Modniir",
		es: "Ulgoth el Modniir",
		fr: "Ulgoth le Modniir",
		nl: "Modniir Ulgoth",
		pl: "Modniir Ulgoth",
		ru: "Улготх в Модниир",
		zh: "Ulgoth 的 Modniir"
	},{
		en: "Great Jungle Wurm",
		de: "Großen Dschungelwurm",
		es: "Gran Sierpe de la Selva",
		fr: "Grande Guivre de la Jungle",
		nl: "Grote Jungleworm",
		pl: "Wielki Robak z Dżungli",
		ru: "Великий Червь из джунглей",
		zh: "大叢林蠕蟲"
	},{
		en: "Karka Queen",
		de: "Karka-Königin",
		es: "Reina Karka",
		fr: "Reine Karka",
		nl: "Karkakoningin",
		pl: "Karka Królowa",
		ru: "Карка Королева",
		zh: "女王 Karka"
	},{
		en: "Tequatl",
		de: "Tequatl den Sonnenlosen",
		es: "Tequatl el Sombrío",
		fr: "Tequatl le Sans-soleil",
		nl: "Tequatl de Zonloze",
		pl: "Tequatl ma Słońca",
		ru: "Теqуатл Тусклый",
		zh: "Tequatl 在沒有陽光"
	},{
		en: "Triple Wurms",
		de: "Drei Würmer",
		es: "Tres Sierpes",
		fr: "Trois Guivres",
		nl: "De drie Wormen",
		pl: "Trzy Wielkie Robaki",
		ru: "Три Черви",
		zh: "三蠕蟲"
	},{
		en: "Fire Shaman",
		de: "Feuerschamanen",
		es: "Chamán de Fuego",
		fr: "Chamane de Feu",
		nl: "Vuursjamaan",
		pl: "Ognia Szaman",
		ru: "Oгня Шаман",
		zh: "火薩滿"
	},{
		en: "Foulbear Chieftain",
		de: "Faulbär-Häuptling",
		es: "Cabecilla de Osoinmundo",
		fr: "Chef Oursefol",
		nl: "Hoofdman foute Beer",
		pl: "Faulwódz Niedźwiedź",
		ru: "Фолмедведь Вождь",
		zh: "臭熊頭目"
	},{
		en: "Dredge Commissar",
		de: "Schaufler-Kommissar",
		es: "Comisario Draga",
		fr: "Kommissar Draguerre",
		nl: "Commissaris Baggeraar",
		pl: "Pogłębiarka Komisarza",
		ru: "Драги Комиссар",
		zh: "疏通政委"
	},{
		en: "Eye of Zhaitan",
		de: "Auge des Zhaitan",
		es: "Ojo de Zhaitan",
		fr: "Œil de Zhaïtan",
		nl: "Oog van Zhaitan",
		pl: "Oko Zhaitan",
		ru: "Глаз Жаитан",
		zh: "Zhaitan 的眼"
	},{
		en: "Lyssa",
		de: "Verderbte Hohepriesterin der Lyssa",
		es: "Suma Sacerdotisa Corrupta de Lyssa",
		fr: "Grande Prêtresse Corrompue de Lyssa",
		nl: "Tempel van Lyssa",
		pl: "Lyssa Świątynia",
		ru: "Лысса Храм",
		zh: "Lyssa 的寺廟"
	},{
		en: "Dwayna",
		de: "Besessene Dwayna-Statue",
		es: "Estatua Poseída de Dwayna",
		fr: "Statue Possédée de Dwayna",
		nl: "Tempel van Dwayna",
		pl: "Dwayna Świątynia",
		ru: "Дwаына Храм",
		zh: "Dwayna 的寺廟"
	},{
		en: "Melandru",
		de: "Auferstandenen Priester der Melandru",
		es: "Sacerdote de Melandru Resurgido",
		fr: "Prêtre Revenant de Melandru",
		nl: "Tempel van Melandru",
		pl: "Melandru Świątynia",
		ru: "Меландру Храм",
		zh: "Melandru 的寺廟"
	},{
		en: "Grenth",
		de: "Auferstandenen Priester des Grenth",
		es: "Sacerdote de Grenth Resurgido",
		fr: "Prêtre Revenant de Grenth",
		nl: "Tempel van Grenth",
		pl: "Grenth Świątynia",
		ru: "Грентх Храм",
		zh: "Grenth 的寺廟"
	},{
		en: "Arah",
		de: "Tore von Arah",
		es: "Puertas de Arah",
		fr: "Portes d'Arah",
		nl: "Poorten van Arah",
		pl: "Arah Bramy",
		ru: "Ворота Арах",
		zh: "Arah 的寺廟"
	},{
		en: "Balthazar",
		de: "Auferstandenen Priester des Balthasar",
		es: "Sacerdote de Balthazar Resurgido",
		fr: "Prêtre Revenant de Balthazar",
		nl: "Tempel van Balthazar",
		pl: "Świątynia Balthazar",
		ru: "Балтхазар Храм",
		zh: "Balthazar 的寺廟"
	},{
		en: "Balthazar North",
		de: "Nord Invasion von Orr",
		es: "Invasión del Norte de Orr",
		fr: "Invasion du Nord de Orr",
		nl: "Noordelijke Invasie van Orr",
		pl: "Północnej Inwazja Orr",
		ru: "Северная Вторжение Орр",
		zh: "北部入侵 Orr"
	},{
		en: "Balthazar Central",
		de: "Zentral Invasion von Orr",
		es: "Invasión Central de Orr",
		fr: "Invasion Central de Orr",
		nl: "Centrale Invasie van Orr",
		pl: "Centralny Inwazja Orr",
		ru: "Центральный Вторжение Орр",
		zh: "中部入侵 Orr"
	},{
		en: "Balthazar South",
		de: "Invasion der Südlichen Orr",
		es: "Invasión del Sur de Orr",
		fr: "Invasion du Sud de Orr",
		nl: "Zuidelijke Invasie van Orr",
		pl: "Południowej Inwazja Orr",
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
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return C.Chains[pIndex].title;
		}
		return (D.ChainTitle[pIndex])[O.Options.enu_Language];
	},
	getChainTitleAny: function(pIndex)
	{
		return (D.ChainTitle[pIndex])[O.Options.enu_Language];
	},
	
	/*
	 * Gets short title of chain in opted language.
	 * @param int pIndex of chain.
	 * @returns string short title.
	 */
	getChainNick: function(pIndex)
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
			var tts = document.getElementById("jsTTS");
		
			if (I.userBrowser === I.BrowserEnum.Chrome)
			{
				/*
				 * Google TTS seems to only work with their browser; using it on
				 * Firefox gives "Video playback aborted due to a network error"
				 */
				url = "http://translate.google.com/translate_tts?tl="
					+ O.Options.enu_Language + "&q=" + pStringMacro;
			}
			else
			{
				url = "http://tts-api.com/tts.mp3?q=" + pStringMacro;
			}
			tts.src = url;
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
		if (I.userBrowser === I.BrowserEnum.Chrome)
		{
			if (pModifier)
			{
				// Reverse the order of adjective-noun or adverb-verb depending on language.
				if (O.Options.enu_Language === O.OptionEnum.Language.French
					|| O.Options.enu_Language === O.OptionEnum.Language.Spanish
					|| O.Options.enu_Language === O.OptionEnum.Language.Mandarin)
				{
					return D.getPhrase(pText) + " " + D.getPhrase(pModifier);
				}
				else
				{
					return D.getPhrase(pModifier) + " " + D.getPhrase(pText);
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
			|| I.userBrowser !== I.BrowserEnum.Chrome)
		{
			return C.Chains[pChain.index].pronunciation;
		}
		return D.getChainTitle(pChain.index);
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
	Chains: GW2T_CHAINS_DATA,
	CurrentChainSD: {},
	NextChainSD1: {},
	NextChainSD2: {},
	NextChainSD3: {},
	NextChainSD4: {},
	CurrentChainHC: {},
	NextChainHC1: {},
	NextChainHC2: {},
	NextChainHC3: {},
	NextChainHC4: {},
	CurrentChains: [],
	PreviousChains1: [],
	PreviousChains2: [],
	NextChains1: [],
	cChainTitleCharLimit: 30,
	ChainSeriesEnum:
	{
		Temple: 0, // Unscheduled Orr temples
		Legacy: 1, // Unscheduled chains that still gives a rare
		ScheduledCutoff: 2,
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
	PredictorEnum:
	{
		Auto: 0,
		Min: 1,
		MinAvg: 2,
		Avg: 3
	},
	
	/*
	* Gets a chain object from the big chain object array.
	* @param string pAlias alias of the chain.
	* @returns object chain.
	*/
	getChainFromAlias: function(pAlias)
	{
		for (var i in C.Chains)
		{
			if (C.Chains[i].alias === pAlias)
			{
				return C.Chains[i];
			}
		}
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
	 * Initializes the chain HTML layer presentation with chains and their
	 * individual events. Calculates time sums for chains and pushes to array
	 * for later accessing by the ticker. 
	 * @param object pChain chain to initialize.
	 */
	initializeChainAndHTML: function(pChain)
	{
		var i, ii;
		var event;
		var chainhtmlid = "";
		
		switch (pChain.series)
		{
			case C.ChainSeriesEnum.Standard: chainhtmlid = "#listChainsScheduled"; break;
			case C.ChainSeriesEnum.Hardcore: chainhtmlid = "#listChainsScheduled"; break;
			case C.ChainSeriesEnum.Story: chainhtmlid = "#listChainsScheduled"; break;
			case C.ChainSeriesEnum.Legacy: chainhtmlid = "#listChainsUnscheduled"; break;
			case C.ChainSeriesEnum.Temple: chainhtmlid = "#listChainsTemple"; break;
		}
		
		/*
		 * A chain bar (HTML) is a rectangle that contains the event chain icon,
		 * chain title, time, individual events listed, and other elements.
		 * Lots of CSS IDs and classes here, so update if the CSS changed.
		 */
		$(chainhtmlid).append(
		"<div id='barChain_" + pChain.alias + "' class='barChain' data-index='" + pChain.index + "'>"
			+ "<div class='chnTitle'>"
				+ "<img src='img/chain/" + C.parseChainAlias(pChain.alias).toLowerCase() + ".png' />"
				+ "<div id='chnCheck_" + pChain.alias + "' class='chnCheck' data-index='" + pChain.index + "'></div>"
				+ "<h1>" + C.truncateTitleString(D.getChainTitle(pChain.index), C.cChainTitleCharLimit) + "</h1>"
				+ "<time class='chnTimeFutureFar' id='chnTime_" + pChain.alias + "' data-index='" + pChain.index + "'></time>"
			+ "</div>"
			+ "<div id='chnDetails_" + pChain.alias + "' class='chnDetails'>"
				+ "<ol id='chnEvents_" + pChain.alias + "' class='chnEvents'></ol>"
				+ "<div class='chnDetailsLinks'>"
					+ "<ins id='chnDelete_" + pChain.alias + "' data-index='" + pChain.index + "' title='Permanently hide this event chain (can undo in Options).'>[x]</ins>"
				+ "</div>"
		+ "</div>");

		/*
		 * Inserts an event with icon and necessary indentation into the ol.
		 * @param string pEventListHTMLID of the ordered list.
		 * @param object pEvent to extract data.
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
			var eventhtmltitle = w("Event Number: ") + e.num + b
				+ w("If Success Go To: ") + e.sGotoNum + b
				+ w("If Failure Go To: ") + e.fGotoNum + b
				+ w("If Success Wait: ") + e.sInterim + b
				+ w("If Failure Wait: ") + e.fInterim + b
				+ w("Time Limit: ") + e.lim + b
				+ w("Avg to Complete: ") + e.avg + b
				+ w("Min to Complete: ") + e.min + b
				+ w("Max to Complete: ") + e.max + b
				+ b + "&amp;quot;" + D.getEventName(e).replace(/["']/g, "") + "&amp;quot;";
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
			if (e.num.length > 1)
			{
				var subnum = e.num.slice(1);
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
			$("#chnEvents_" + pChain.alias).append(
			"<li id='chnEvent_" + pChain.alias + "_" + e.num + "' class='chnStep_" + pChain.alias + "_" + e.step + "' style='margin-left:" + indentpixel +"px'>"
				+ "<img src='img/event/" + e.icon + ".png' title='" + eventhtmltitle + "'/>"
				+ "<span>" + C.truncateTitleString(D.getEventName(e), eventnamelimit, ".") + "." + "</span>"
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
		if (pChain.series === C.ChainSeriesEnum.Temple
			|| pChain.series === C.ChainSeriesEnum.Legacy)
		{
			for (i in pChain.events)
			{
				insertEventToBarHTML(pChain, pChain.events[i]);
			}
		}
		else // Scheduled events need to remember concurrent events
		{
			C.ScheduledChains.push(pChain); // Initialize the shortcut reference array
			
			for (i in pChain.events)
			{
				// Ignore failure events and optional defense events
				if (pChain.events[i].primacy !== C.EventPrimacyEnum.Optional)
				{
					// Compare the first character of their event number
					if (pChain.events[i].num.charAt(0) !== pChain.primaryEvents[ii].num.charAt(0))
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
				C.Chains[i].events[ii].step = parseInt(C.Chains[i].events[ii].num.charAt(0)) - 1;
			}
			
			C.Chains[i].index = parseInt(i);
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
	 * Tells if a chain is an active on the chains list.
	 * @param object pChain to verify.
	 * @returns boolean current or not.
	 */
	isChainCurrent: function(pChain)
	{
		for (var i in C.CurrentChains)
		{
			if (pChain.alias === C.CurrentChains[i].alias)
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
		if (X.getChecklistItem(X.Checklists.ChainSubscription, pChain.index) ===
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
		$("#chnTime_" + pChain.alias).prop("title", minischedulestring);
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
			
			switch (O.Options.int_setTimeStyle)
			{
				case 0:
				{
					time = T.getSecondsUntilChainStarts(ithchain);
					wantletters = true;
				} break;
				case 1:
				{
					time = T.convertScheduleKeyToLocalSeconds(ithchain.scheduleKeys[0]);
					wantletters = false;
				} break;
			}
			
			$("#chnTime_" + ithchain.alias).text(T.getTimeFormatted(
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
		var wantletters = false;
		
		if (O.Options.int_setTimeStyle === 0)
		{
			wantletters = true;
		}
		if (remaining <= 0)
		{
			time = T.cSECONDS_IN_TIMEFRAME - elapsed;
			sign = "−";
		}
		
		$("#chnTime_" + pChain.alias).text(sign + T.getTimeFormatted(
			{
				want24: true,
				wantHours: false,
				wantLetters: wantletters,
				customTimeInSeconds: time
			})
		);
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
						+ "<img src='img/chain/" + C.parseChainAlias(ithchain.alias).toLowerCase() + ".png' />"
						+ "<h1>" + C.truncateTitleString(D.getChainTitle(ithchain.index), C.cChainTitleCharLimit) + "</h1>"
						+ "<time>" + timestring + "</time>"
					+ "</div>"
				+ "</div>");
			}
		}
		// Highlight current chain
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey())
			.addClass("chnBarCurrent");
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
					$("#barChain_" + ithchain.alias).appendTo("#listChainsScheduled");
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
		O.enact_int_setTimeStyle();
		
		/*
		 * Now that the chains are sorted, do cosmetic updates.
		 */
		for (i in C.CurrentChains)
		{
			ithchain = C.CurrentChains[i];
			// Highlight and show the current chain bar
			$("#barChain_" + ithchain.alias).addClass("chnBarCurrent");
			// Show the current chain's pre events (details)
			if (C.isChainUnchecked(ithchain))
			{
				$("#chnDetails_" + ithchain.alias).show("fast");
			}
			
			// Style the title and time
			$("#barChain_" + ithchain.alias + " h1").first()
				.removeClass("chnTitleFuture chnTitleFutureFar").addClass("chnTitleCurrent");
			$("#barChain_" + ithchain.alias + " time").first()
				.removeClass("chnTimeFuture chnTimeFutureFar").addClass("chnTimeCurrent");
		}

		for (i in C.PreviousChains1)
		{
			ithchain = C.PreviousChains1[i];
			// Still highlight the previous chain bar but collapse it
			$("#barChain_" + ithchain.alias)
				.removeClass("chnBarCurrent").addClass("chnBarPrevious");
			$("#chnDetails_" + ithchain.alias).hide();
			
			// Style the title and time
			$("#barChain_" + ithchain.alias + " h1").first()
				.removeClass("chnTitleCurrent").addClass("chnTitleFutureFar");
			$("#barChain_" + ithchain.alias + " time").first()
				.removeClass("chnTimeCurrent").addClass("chnTimeFutureFar");
		}
		
		for (i in C.PreviousChains2)
		{
			ithchain = C.PreviousChains2[i];
			// Stop highlighting the previous previous chain bar
			$("#barChain_" + ithchain.alias).removeClass("chnBarPrevious");
		}
		
		for (i in C.NextChains1)
		{
			ithchain = C.NextChains1[i];
			// Style the title and time
			$("#barChain_" + ithchain.alias + " h1").first()
				.removeClass("chnTitleFutureFar").addClass("chnTitleFuture");
			$("#barChain_" + ithchain.alias + " time").first()
				.removeClass("chnTimeFutureFar").addClass("chnTimeFuture");
		}
		
		// Also highlight timetable chain bar
		$("#listChainsTimetable .barChainDummy").removeClass("chnBarCurrent");
		$("#listChainsTimetable .barChainDummy_" + T.getTimeframeKey())
			.addClass("chnBarCurrent");
	},
	
	/*
	 * minSum avgSum and minavgSum are the seconds since a chain began that
	 * an event of it starts. Because the time a chain starts is known, these
	 * statistical times can be used to predict when events happen and end.
	 * @param object pChainOuter to queue.
	 * @pre The sum statistics have been computed.
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
			$("#listChainsScheduled .chnEvents li").addClass("chnEventPast");
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
					if (i > 0)
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
	 * event on the map. Also plays the alarm if it is the final event finishing.
	 * @param object pChain to read from.
	 * @param int pPrimaryEventIndex of the current active event.
	 * @pre Events HTML is generated and map is loaded.
	 */
	highlightEvents: function(pChain, pPrimaryEventIndex)
	{
		var i;
		var animationspeed = 500;
		var eventnamewidth = 320;
		
		if (pPrimaryEventIndex > -1) // -1 means the final event's finish time
		{
			pChain.CurrentPrimaryEvent = pChain.primaryEvents[pPrimaryEventIndex];
			
			// Recolor past events
			for (i = 0; i < pPrimaryEventIndex; i++)
			{
				$(".chnStep_" + pChain.alias + "_" + i)
					.removeClass("chnEventCurrent").addClass("chnEventPast");
			}
			$(".chnStep_" + pChain.alias + "_" + (pPrimaryEventIndex - 1))
				.css({opacity: 1}).animate({opacity: 0.5}, animationspeed);
			
			// Recolor current events and animate transition
			$(".chnStep_" + pChain.alias + "_" + pPrimaryEventIndex)
				.removeClass("chnEventPast chnEventFuture").addClass("chnEventCurrent")
				.css({width: 0, opacity: 0.5}).animate({width: eventnamewidth, opacity: 1}, animationspeed)
				.css({width: "auto"});
		
			// Recolor future events
			if (pPrimaryEventIndex < pChain.primaryEvents.length)
			{
				for (i = (pPrimaryEventIndex + 1); i < pChain.primaryEvents.length; i++)
				{
					$(".chnStep_" + pChain.alias + "_" + i)
						.removeClass("chnEventCurrent").addClass("chnEventFuture");
				}
			}
			
			// Tour to the event on the map if opted
			if (O.Options.bol_tourPrediction && I.contentCurrent === I.PageEnum.Chains
				&& M.isMapAJAXDone)
			{
				$("#chnEvent_" + pChain.alias + "_" + pChain.CurrentPrimaryEvent.num).trigger("click");
			}
		}
		else // Finish time
		{
			pChain.CurrentPrimaryEvent = pChain.primaryEvents[pChain.primaryEvents.length - 1];
			
			$("#chnEvents_" + pChain.alias + " li").removeClass("chnEventCurrent")
				.addClass("chnEventPast").last().css({opacity: 1}).animate({opacity: 0.5}, 500);
			
			/*
			 * Announce the next world boss and the time until it, only if it's
			 * not past the timeframe, and the subscription option is off.
			 */
			if (O.Options.bol_enableSound && O.Options.bol_alertAtEnd && I.isProgramLoaded
				&& pChain.alias === C.CurrentChainSD.alias
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
				if (O.Options.bol_alertChecked)
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
		var hour = T.getTimeOffsetSinceMidnight("server", "hours");
		
		if (pIndex > -1)
		{
			switch (O.Options.int_setPredictor)
			{
				case C.PredictorEnum.Auto:
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
				case C.PredictorEnum.Min:
				{
					return pChain.primaryEvents[pIndex].minSum;
				} break;
				case C.PredictorEnum.MinAvg:
				{
					return pChain.primaryEvents[pIndex].minavgSum;
				} break;
				case C.PredictorEnum.Avg:
				{
					return pChain.primaryEvents[pIndex].avgSum;
				} break;
			}
		}
		else
		{
			switch (O.Options.int_setPredictor)
			{
				case C.PredictorEnum.Auto:
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
				case C.PredictorEnum.Min:
				{
					pChain.countdownToFinish = pChain.minFinish;
					return pChain.minFinish;
				} break;
				case C.PredictorEnum.MinAvg:
				{
					pChain.countdownToFinish = pChain.minavgFinish;
					return pChain.minavgFinish;
				} break;
				case C.PredictorEnum.Avg:
				{
					pChain.countdownToFinish = pChain.avgFinish;
					return pChain.avgFinish;
				} break;
			}
		}
	}
};

/* =============================================================================
 * @@Map and map content
 * ========================================================================== */
M = {
	/*
	 * http://gw2timer.com/zones.js contains zone (e.g. Queensdale, LA) objects
	 * with their rectangular coordinates.
	 * This is referred to by the variable "M.Zones".
	 */
	Zones: GW2T_ZONES_DATA,
	Resources: {},
	isMapAJAXDone: false,
	mousedZoneIndex: null,
	currentIconSize: 32,
	cURL_API_TILES: "https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg",
	cURL_API_MAPFLOOR: "https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=1",
	cICON_WAYPOINT: "img/map/waypoint.png",
	cICON_WAYPOINTOVER: "img/map/waypoint_h.png",
	cLEAFLET_PATH_OPACITY: 0.5,
	cLEAFLET_ICON_SIZE: 32,
	cMAP_BOUND: 32768, // The map is a square
	cMAP_CENTER: [16384, 16384],
	cMAP_MOUSEMOVE_RATE: 100,
	ZoomLevelEnum:
	{
		Current: 0, // This variable is dynamic
		Default: 3,
		Space: 3,
		Sky: 5,
		Ground: 7,
		Max: 7
	},
	
	// Icons are initially invisible until zoomed in close enough or moused over a zone
	IconWaypoint: L.icon(
	{
		iconUrl: "img/map/waypoint.png",
		iconSize: [16, 16],
		iconAnchor: [8, 8]
	}),
	/*
	 * Waypoint markers will be stored in the M.Zones object for each zone.
	 * This is a shortcut reference array for all the waypoints.
	 */
	cPinZIndex: 10,
	PinPersonal: {},
	PinProgram: {},
	PinEvent: {},
	PinOver: {},
	// All objects in the map (such as paths and markers) shall be called "entities"
	WaypointEntities: new Array(),
	PinEntities: new Array(), // Utility pin markers, looks like GW2 personal waypoints
	DailyEntities: new Array(),
	JPEntities: new Array(),
	ChainPathEntities: new Array(),
	isShowingIconsForDaily: true,
	isShowingIconsForResource: false,
	isShowingIconsForJP: true,
	
	/*
	 * Initializes the Leaflet map, adds markers, and binds events.
	 */
	initializeMap: function()
	{
		// M.Map is the actual Leaflet map object, initialize it
		M.Map = L.map("paneMap", {
			minZoom: 0,
			maxZoom: M.ZoomLevelEnum.Max,
			doubleClickZoom: false,
			zoomControl: false, // the zoom UI
			attributionControl: false, // the Leaflet link UI
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
			M.Zones[i].waypoints = new Array();
		}
		
		// Do other initialization functions
		M.populateMap();
		M.drawChainPaths();

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
	 */
	showCurrentZone: function(pCoord)
	{
		document.getElementById("mapCoordinatesDynamic")
			.value = pCoord[0] + ", " + pCoord[1];
		
		var i, ii1, ii2;
		
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
				 * If got here then i is the index of the current moused
				 * zone. To not waste computation, only update the
				 * coordinates bar and reveal the zone waypoints if the
				 * found zone is different from the previously moused zone.
				 */
				if (i !== M.mousedZoneIndex)
				{
					// Note that the master index was initialized as null
					if (M.mousedZoneIndex !== null)
					{
						// Hide the waypoints of the previously moused zone
						for (ii1 in M.Zones[M.mousedZoneIndex].waypoints)
						{
							M.Zones[M.mousedZoneIndex].waypoints[ii1]
								._icon.style.display = "none";
						}
					}
					// Update the master moused zone index to the current index
					M.mousedZoneIndex = i;
					var mousedzone = M.Zones[i];
					document.getElementById("mapCoordinatesRegion")
						.value = mousedzone.name;
					// Reveal moused zone waypoints
					for (ii2 in mousedzone.waypoints)
					{
						mousedzone.waypoints[ii2]._icon.style.display = "block";
					}
				}
				return; // Already found zone so stop searching
			}
		}
	},
	
	/*
	 * Gets the center coordinates of a zone.
	 * @param string pZone nickname of the map.
	 * @returns array of x and y coordinates.
	 */
	getZoneCenter: function(pZone)
	{
		var rect = M.Zones[pZone].rect;
		// x = OffsetX + (WidthOfZone/2), y = OffsetY + (HeightOfZone/2)
		var x = rect[0][0] + ~~((rect[1][0] - rect[0][0]) / 2);
		var y = rect[0][1] + ~~((rect[1][1] - rect[0][1]) / 2);
		return [x, y];
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
		 * At the end of a zoom animation, resize the map waypoint icons
		 * depending on zoom level. Hide if zoomed too far.
		 */
		M.Map.on("zoomend", function(pEvent)
		{
			var currentzoom = this.getZoom();
			M.ZoomLevelEnum.Current = currentzoom;
			M.currentIconSize = 0;
			
			// Resize all waypoint icons in all zones
			switch (currentzoom)
			{
				case 7: M.currentIconSize = 32; break;
				case 6: M.currentIconSize = 28; break;
				case 5: M.currentIconSize = 24; break;
				case 4: M.currentIconSize = 20; break;
				case 3: M.currentIconSize = 16; break;
			}
			for (var i in M.WaypointEntities)
			{
				M.changeMarkerIcon(M.WaypointEntities[i], M.cICON_WAYPOINT, M.currentIconSize);
			}
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
			pSize = M.cLEAFLET_ICON_SIZE;
		}
		
		pMarker.setIcon(new L.icon(
		{
			iconUrl: pIconURL,
			iconSize: [pSize, pSize],
			iconAnchor: [pSize/2, pSize/2]
		}));
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
			draggable: true,
			zIndexOffset: M.cPinZIndex
		}).addTo(M.Map);
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
	 * View the map at the specifications.
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
		return [coord.x, coord.y];
	},
	
	/*
	 * Converts a coordinate string to array coordinates.
	 * @param string pString coordinates in the form of "[X, Y]" GW2 coords.
	 * @returns array pCoord array of two numbers.
	 */
	parseCoordinates: function(pString)
	{
		// The regex strips all characters except digits, comma, and minus sign
		var coord = pString.replace(/[^\d,-]/g, "");
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
	 * Initializes map waypoints and other markers from the GW2 server API files.
	 */
	populateMap: function()
	{
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
		{
			var region, gamemap, i, ii, numofpois, poi;

			for (region in pData.regions)
			{
				region = pData.regions[region];

				for (gamemap in region.maps)
				{
					gamemap = region.maps[gamemap];

					numofpois = gamemap.points_of_interest.length;
					for (i = 0; i < numofpois; i++)
					{
						poi = gamemap.points_of_interest[i];

						if (poi.type !== "waypoint")
						{
							continue;
						}

						var waypoint = L.marker(M.convertGCtoLC(poi.coord),
						{
							title: "<span class='mapLoc'><dfn>" + poi.name + "</dfn></span>",
							waypoint: poi.name,
							icon: M.IconWaypoint,
							link: M.getChatlinkFromPoiID(poi.poi_id)
						}).addTo(M.Map);
						// Initially hide all the waypoints
						waypoint._icon.style.display = "none";
						// Bind behavior
						waypoint.on("mouseover", function()
						{
							this._icon.src = M.cICON_WAYPOINTOVER;
						});
						waypoint.on("mouseout", function()
						{
							this._icon.src = M.cICON_WAYPOINT;
						});
						waypoint.on("click", function()
						{
							$("#mapCoordinatesStatic").val(this.options.link).select();
							$("#mapCoordinatesRegion").val(this.options.waypoint);
						});
						M.bindMarkerZoomBehavior(waypoint, "dblclick");
						
						// Assign the waypoint to its zone
						for (ii in M.Zones)
						{
							if (M.Zones[ii].name === gamemap.name)
							{
								M.Zones[ii].waypoints.push(waypoint);
							}
						}
						// Assign the waypoint to a single pool
						M.WaypointEntities.push(waypoint);
					}
				}
			}
		}).done(function() // Map is populated by AJAX
		{
			/*
			 * AJAX takes a while so can use this to advantage to delay graphics
			 * that seem out of place without a map loaded.
			 */
			if (O.Options.bol_showChainPaths === true && I.contentCurrent !== I.PageEnum.Map)
			{
				M.setEntityGroupDisplay(M.ChainPathEntities, "show");
			}
			
			if (O.Options.bol_tourPrediction && I.contentCurrent === I.PageEnum.Chains)
			{
				// Initialize the "current moused zone" variable for showing waypoints
				M.showCurrentZone(M.getZoneCenter("la"));
				// The zoomend event handler doesn't detect the first zoom by prediction
				for (var i in M.WaypointEntities)
				{
					M.changeMarkerIcon(M.WaypointEntities[i], M.cICON_WAYPOINT, M.cLEAFLET_ICON_SIZE);
				}
				// Tour to the event on the map if opted
				$("#chnEvent_" + C.CurrentChainSD.alias + "_"
					+ C.CurrentChainSD.CurrentPrimaryEvent.num).trigger("click");
			}
			/*
			 * Start tooltip plugin after the markers were loaded, because it
			 * reads the title attribute and convert them into a div "tooltip".
			 */
			I.qTip.init(".leaflet-marker-icon");
		}).fail(function()
		{
			if (I.programMode === I.programModeEnum.Website)
			{
				I.write(
				"Guild Wars 2 API server is unreachable.<br />"
				+ "Reasons could be:<br />"
				+ "- The GW2 server is down for maintenance.<br />"
				+ "- Your computer's time is out of sync.<br />"
				+ "- Your browser is too old (if IE then need 11+).<br />"
				+ "- This website's code encountered a bug.<br />"
				+ "Map features will be limited.<br />", 30);
			}
		}).always(function() // Do after AJAX regardless of success/failure
		{
			M.isMapAJAXDone = true;
			M.bindMapVisualChanges();
		});
		
		/*
		 * Create pin markers that can be moved by user or program.
		 * ---------------------------------------------------------------------
		 */
		M.PinPersonal = M.createPin("img/map/pin_white.png");
		M.PinProgram = M.createPin("img/map/pin_blue.png");
		M.PinEvent = M.createPin("img/map/pin_green.png");
		M.PinOver = L.marker(M.convertGCtoLC([0,0]),
		{
			icon: L.icon(
			{
				iconUrl: "img/map/pin_over.png",
				iconSize: [128, 128],
				iconAnchor: [64, 64]
			}),
			draggable: true,
			zIndexOffset: M.cPinZIndex
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
	 * user clicks on it.
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
				$("#chnEvent_" + chain.alias + "_" + eventnum).each(function()
				{
					// Assign a data attribute to the event name
					var coord = event.path[0];
					$(this).attr("data-coord", coord[0] + "," + coord[1]);
					// Read the attribute and use the coordinate when clicked for touring
					M.bindMapLinkBehavior($(this), M.PinEvent);
				});
			}
		}
		
		// Initially hide paths, unhide when map populating is complete
		M.setEntityGroupDisplay(M.ChainPathEntities, "hide");
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
	
	/*
	 * Populates the map with dailies location markers.
	 */
	generateAndInitializeDailies: function()
	{
		$(".mapDailyLists dt").each(function()
		{
			M.bindMapLinkBehavior($(this), null);
			
			var coord = M.getElementCoordinates($(this));
			var type = I.getIndexFromHTMLID($(this).parent());
			var marker = L.marker(M.convertGCtoLC(coord),
			{
				title: "<div class='mapLoc'><dfn>Daily:</dfn> " + type + "</div>"
			}).addTo(M.Map);
			marker.setIcon(new L.icon(
			{
				iconUrl: "img/daily/" + type.toLowerCase() + I.cImageMainExtension,
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
		M.Resources = GW2T_RESOURCES_DATA; // This object is embedded in the map HTML file
		var i, ii;
		var resource; // A type of resource, like copper ore
		var marker;
		
		var styleMarker = function(pMarker, pResource)
		{
			pMarker.setIcon(new L.icon(
			{
				iconUrl: "img/node/" + pResource.toLowerCase() + I.cImageMainExtension,
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
			// Resources with only zone locations (dummy marker in the center)
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
			var resource = M.Resources[i];
			$("#mapResource_" + resource.type).append(
				"<label><input id='nod_" + i + "' type='checkbox' /> <img src='img/node/" + i.toLowerCase() + ".png' /> " + i + "</label>");
		}
		// Bind checkboxes
		for (i in M.Resources)
		{
			$("#nod_" + i).change(function()
			{
				var thisresource = I.getIndexFromHTMLID($(this));
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
					+ "<img src='" + I.cImageHost + pElement.data("img") + I.cImageMainExtension + "' /></div>"
			}).addTo(M.Map);
			marker.setIcon(new L.icon(
			{
				iconUrl: "img/ui/jp.png",
				iconSize: [32, 32],
				iconAnchor: [16, 16]
			}));
			marker._icon.style.borderRadius = "50%";
			marker._icon.style.opacity = "0.9";
			M.styleJPMarkers(marker, pDifficulty);
			
			// Add to array
			M.JPEntities.push(marker);
		};
		
		// Create the markers, each set pertains to one "mapJPList"
		for (i = 0; i < X.Checklists.JP.length; i++)
		{
			$("#mapJP_" + i).each(function()
			{
				createJPMarkers($(this), I.getIndexFromHTMLID($(this)),
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
				+ I.getYouTubeLink(term + " Guild Wars 2") + "' target='_blank'>[Y]</a> <a href='"
				+ I.getWikiLink(term) + "' target='_blank'>[W]</a></cite>");
			M.bindMapLinkBehavior($(this), null);
			
			// Make checkboxes
			$(this).after("<label><input type='checkbox' id='mapJPCheck_" + I.getIndexFromHTMLID($(this)) + "' /></label>");
		});
		I.convertExternalLink(".mapJPList a");
		
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
				var stateinstring = X.getChecklistItem(X.Checklists.JP, i, "boolean");
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
				var checkboxindex = parseInt(I.getIndexFromHTMLID($(this)));
				if (checkboxstate === X.ChecklistEnum.Unchecked)
				{
					$(this).parent().prev().removeClass("mapJPListNameHover");
					M.styleJPMarkers(M.JPEntities[checkboxindex], M.JPEntities[checkboxindex].options.dif);
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
				M.styleJPMarkers(M.JPEntities[i], M.JPEntities[i].options.dif);
				
				jpchecklist += "0";
			}
			X.Checklists.JP.value = jpchecklist;
			localStorage[X.Checklists.JP.key] = X.Checklists.JP.value;
		});
	},
	
	/*
	 * Hides all the map icons by triggering the toggle button of each map section.
	 */
	displayIcons: function(pSection, pWantShow)
	{
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
 * @@Time utilities and constants
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
	cNUM_TIMEFRAMES_IN_HOUR: 4,
	cSECS_MARK_0: 0,
	cSECS_MARK_1: 900,
	cSECS_MARK_2: 1800,
	cSECS_MARK_3: 2700,
	cSECS_MARK_4: 3599,
	cBASE_10: 10,
	
	Schedule: {},
	
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
		
		C.ScheduledChains = new Array();
		C.initializeAllChains();
		
		var i, ii, iii;
		var slot;
		
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
					if (C.ScheduledChains[ii].alias === slot.c[iii].alias)
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
		var minutes = T.getTimeOffsetSinceMidnight("utc", "minutes");
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
	 * @returns int key for the schedule slot.
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
		
		if (pUnit === "minutes")
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
		var secondscurrent = T.getTimeOffsetSinceMidnight("local", "seconds");
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
	 * @objparam boolean wantLetters to format #h #m #s instead of colons.
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
			pArgs.reference = "local";
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
				case "local":
				{
					sec = now.getSeconds();
					min = now.getMinutes();
					hour = now.getHours();
				} break;
				case "server":
				{
					sec = now.getSeconds();
					min = now.getMinutes();
					hour = now.getUTCHours() + T.cUTC_OFFSET_SERVER + T.DST_IN_EFFECT;
					hour = T.wrapInteger(hour, T.cHOURS_IN_DAY);
				} break;
				case "utc":
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
				minsec = min + "." + ((sec < T.cBASE_10) ? "0" + sec : sec);
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
			return hour + ":" + minsec;
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
		pTimeUnit = pTimeUnit || "seconds";
		pReference = pReference || "utc";
		
		var now = new Date();
		var hour = now.getUTCHours();
		var min = now.getUTCMinutes();
		var sec = now.getUTCSeconds();
		
		switch (pReference)
		{
			case "server": hour = hour + T.cUTC_OFFSET_SERVER + T.DST_IN_EFFECT; break;
			case "utc": break;
			case "local":
			{
				 hour = now.getHours();
				 min = now.getMinutes();
				 sec = now.getSeconds();
			} break;
		}
		hour = T.wrapInteger(hour, T.cHOURS_IN_DAY);

		if (pTimeUnit === "hours")
		{ 
			return hour;
		}
		if (pTimeUnit === "minutes")
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
	oldSectorAngle: 0,
	cDEGREES_IN_CIRCLE: 360,
	cDEGREES_IN_QUADRANT: 90,
	
	// These will be DOM elements
	WpChain0: {}, WpChain1: {}, WpChain2: {}, WpChain3: {},
	// These will be jQuery "elements"
	IconSD0: {}, IconSD1: {}, IconSD2: {}, IconSD3: {},
	IconHC0: {}, IconHC1: {}, IconHC2: {}, IconHC3: {},
	IconsStandard: new Array(),
	IconsHardcore: new Array(),
	wpClipboards: [],
	cWpClipboardDataAttribute: "data-clipboard-text", // Defined by ZeroClipboard
	TickerTimeout: {},
	
	/*
	 * Starts the clock.
	 */
	initializeClock: function()
	{
		K.updateTimeFrame(new Date());
		K.tickSecond();
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
	 * the shadow effect), then re-adds the filter. This is used because Firefox
	 * has a bug that causes the clock's circumference and hand to disappear
	 * when the whole clock is moved visually.
	 */
	reapplyFilters: function()
	{
		if (I.userBrowser === I.BrowserEnum.Firefox)
		{
			var e1 = $("#clkCircumference");
			var e2 = $("#clkHands");
			var f1 = e1.attr("filter");
			var f2 = e2.attr("filter");
			e1.removeAttr("filter").attr("filter", f1);
			e2.removeAttr("filter").attr("filter", f2);
		}
	},
	
	/*
	 * Initializes array of clock items for iteration and binds the clock chain
	 * icons to view map event when clicked, or check off when double clicked.
	 * @pre data-index attribute of icon was updated to get associated chain object.
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
					coord = C.Chains[$(this).data("index")].primaryEvents[0].path[0];
					M.goToView(coord, M.PinEvent);
					
				}).unbind("click").click(function()
				{
					$("#chnCheck_" + C.Chains[$(this).data("index")].alias).trigger("click");
				});
			});
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
			text += pChainSD.waypoint + " " + D.getChainNick(pChainSD.index);
			if ( ! pChainHC)
			{
				text += T.getTimeTillChainFormatted(pChainSD);
			}
			else
			{
				text += " " + D.getPhrase("and") + " " + pChainHC.waypoint
					+ " " + D.getChainNick(pChainHC.index)
					+ T.getTimeTillChainFormatted(pChainHC);
			}
			
			// Chains for the timeframe after that
			text += ", " + D.getPhrase("then") + " " + pChainSDAfter.waypoint
				+ " " + D.getChainNick(pChainSDAfter.index);
			if ( ! pChainHCAfter)
			{
				text += T.getTimeTillChainFormatted(pChainSDAfter);
			}
			else
			{
				text += " " + D.getPhrase("and") + " " + pChainHCAfter.waypoint
					+ " " + D.getChainNick(pChainHCAfter.index)
					+ T.getTimeTillChainFormatted(pChainHCAfter);
			}
			
			text = text + " - " + I.cSiteName.toLowerCase();
			pWaypoint.setAttribute(K.cWpClipboardDataAttribute, text);
		};
		
		updateWaypoint(K.WpChain0, C.CurrentChainSD, C.CurrentChainHC, C.NextChainSD1, C.NextChainHC1);
		updateWaypoint(K.WpChain1, C.NextChainSD1, C.NextChainHC1, C.NextChainSD2, C.NextChainHC2);
		updateWaypoint(K.WpChain2, C.NextChainSD2, C.NextChainHC2, C.NextChainSD3, C.NextChainHC3);
		updateWaypoint(K.WpChain3, C.NextChainSD3, C.NextChainHC3, C.NextChainSD4, C.NextChainHC4);
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
				if (ithchain && pIndex === ithchain.index)
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
	 * Clock ticker runs every second to update the hands and do effects to the
	 * clock when appropriate, like when a chain starts at 15 minute mark.
	 */
	tickSecond: function()
	{
		/*
		 * Although the effects are supposed to happen every 1 second, this
		 * function is actually ran multiple times per second so setTimeout
		 * is in sync with the Date object.
		 */
		var now = new Date();
		var sec = now.getSeconds();
		if (K.tickerSecondPrevious === sec)
		{
			// If the Date second has not changed, then don't do the effects
			K.TickerTimeout = setTimeout(K.tickSecond, K.tickerFrequency);
			return;
		}
		else
		{
			// Else update the second variable and do the effects
			K.tickerSecondPrevious = sec;
		}
		
		/*
		 * Things in this outer block runs every second, so core JS is used
		 * instead of jQuery for performance.
		 */
		T.TIMESTAMP_UNIX_SECONDS = T.getUNIXSeconds();
		T.SECONDS_TILL_RESET = T.cSECONDS_IN_DAY - T.getTimeOffsetSinceMidnight("utc", "seconds");
		var min = now.getMinutes();
		var hour = now.getHours() % T.cHOURS_IN_MERIDIEM;
		var secinhour = min*60 + sec;
		var secangle = sec*6; // 1 degree per second
		var minangle = min*6 + sec/10; // 0.1 degrees per second
		var hourangle = hour*30 + (min/60)*30; // 0.5 degrees per minute
		var sechand = document.getElementById("clkSecondHand");
		var minhand = document.getElementById("clkMinuteHand");
		var hourhand = document.getElementById("clkHourHand");
		K.rotateClockElement(sechand, secangle);
		K.rotateClockElement(minhand, minangle);
		K.rotateClockElement(hourhand, hourangle);
		
		// Opacity value 0.0 through 1.0 based on how far into the 15 minutes frame
		var opacityAdd = 1 - ((min % T.cMINUTES_IN_TIMEFRAME)*60 + sec) / (T.cSECONDS_IN_TIMEFRAME);
		var clockbackground = document.getElementById("paneClockBackground");
		
		// If crossing a 15 minute mark (IMPORTANT)
		if (min % T.cMINUTES_IN_TIMEFRAME === 0 && sec === 0)
		{
			if (O.Options.int_setClockBackground === 0 && I.programMode !== I.programModeEnum.Simple)
			{
				$(clockbackground).fadeTo(800, 1);
			}
			K.updateTimeFrame(now);
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
				K.updateTimeFrame(now);
			}
			// Update the timestamp
			K.awakeTimestampPrevious = awaketimestampcurrent;
			
			// Dim the clock background
			if (O.Options.int_setClockBackground === 0 && I.programMode !== I.programModeEnum.Simple)
			{
				clockbackground.style.opacity = opacityAdd;
			}
		}
		
		// Macro function to get a speech if the subscribed boss is within the opted time
		var doSubscribedSpeech = function(pMinutes)
		{
			if (pMinutes > 0)
			{
				var minutestill = T.cMINUTES_IN_TIMEFRAME - T.getCurrentTimeframeElapsedTime("minutes");
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
		};
		
		// If crossing a 1 second mark (given)
		C.CurrentChains.forEach(C.updateCurrentChainTimeHTML);
		
		// If crossing a 1 minute mark
		if (sec === 0)
		{
			// Refresh the chain time countdown opted
			if (O.Options.int_setTimeStyle === 0)
			{
				C.updateChainsTimeHTML();
			}
			K.updateWaypointsClipboard();
			
			// Alert subscribed chain
			if (O.Options.bol_alertSubscribed === true && O.Options.bol_enableSound)
			{
				doSubscribedSpeech(O.Options.int_alertSubscribedFirst);
				doSubscribedSpeech(O.Options.int_alertSubscribedSecond);
			}
		}
		
		// Tick the two digital clocks below the analog clock
		document.getElementById("itemTimeLocalActual").innerHTML = T.getTimeFormatted();
		document.getElementById("itemTimeServer").innerHTML = "(" +
			T.getTimeFormatted(
			{
				reference: "server",
				wantSeconds: false
			}) + ")";
		document.getElementById("itemBoardTime").innerHTML =
			T.getTimeFormatted(
			{
				want24: true,
				wantHours: false,
				wantLetters: true,
				customTimeInSeconds: T.cSECONDS_IN_TIMEFRAME - T.getCurrentTimeframeElapsedTime()
			});
		// Times in the Options page Debug section
		document.getElementById("optTimestampUTC").innerHTML = T.TIMESTAMP_UNIX_SECONDS;
		document.getElementById("optTimestampLocalReset").innerHTML =
			O.Utilities.lastLocalResetTimestamp.value;
		document.getElementById("optTimestampServerReset").innerHTML =
			T.TIMESTAMP_UNIX_SECONDS + T.SECONDS_TILL_RESET;
		document.getElementById("optTimeTillReset").innerHTML = T.getTimeFormatted(
			{
				customTimeInSeconds: T.SECONDS_TILL_RESET, want24: true
			});
		
		// Change the minute hand if passing colored marker
		if (secinhour >= K.currentFrameOffsetMinutes
			&& secinhour < (K.currentFrameOffsetMinutes + C.CurrentChainSD.minFinish))
		{
			minhand.style.stroke = "lime";
		}
		else if (secinhour >= (K.currentFrameOffsetMinutes + C.CurrentChainSD.minFinish)
			&& secinhour < (K.currentFrameOffsetMinutes + C.CurrentChainSD.avgFinish))
		{
			minhand.style.stroke = "orange";
		}
		else if (secinhour >= (K.currentFrameOffsetMinutes + C.CurrentChainSD.avgFinish))
		{
			minhand.style.stroke = "red";
		}

		// Loop this function, can use variable to halt it
		K.TickerTimeout = setTimeout(K.tickSecond, K.tickerFrequency);
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
		$("#itemBoardCurrentSD").text(D.getChainTitleAny(C.CurrentChainSD.index));
		$("#itemBoardNextSD").text(D.getChainTitleAny(C.NextChainSD1.index));
		$("#itemBoardCurrentHC").text("");
		$("#itemBoardNextHC").text("");
		if (C.CurrentChainHC || C.NextChainHC1)
		{
			$("#itemBoardHC").show();
			if (C.CurrentChainHC)
			{
				$("#itemBoardCurrentHC").text(D.getChainTitleAny(C.CurrentChainHC.index));
			}
			if (C.NextChainHC1)
			{
				$("#itemBoardNextHC").text(D.getChainTitleAny(C.NextChainHC1.index));
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
		$("#itemClockFace .iconSD").css(
		{
			"border": "1px solid black",
			"box-shadow": "0px 0px 10px black"
		});
		$("#itemClockFace .iconHC").css(
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
					pIcon.attr("src", "img/chain/" + pChain.alias.toLowerCase() + I.cImageMainExtension);
					pIcon.data("index", pChain.index);
					if (I.programMode === I.programModeEnum.Simple)
					{
						pIcon.attr("title", D.getChainTitleAny(pChain.index));
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

			K.WpChain0 = $("#itemClockWaypoint" + i0)[0]; K.IconSD0 = $("#itemClockIconStandard" + i0);
			K.WpChain1 = $("#itemClockWaypoint" + i1)[0]; K.IconSD1 = $("#itemClockIconStandard" + i1);
			K.WpChain2 = $("#itemClockWaypoint" + i2)[0]; K.IconSD2 = $("#itemClockIconStandard" + i2);
			K.WpChain3 = $("#itemClockWaypoint" + i3)[0]; K.IconSD3 = $("#itemClockIconStandard" + i3);
			K.IconHC0 = $("#itemClockIconHardcore" + i0);
			K.IconHC1 = $("#itemClockIconHardcore" + i1);
			K.IconHC2 = $("#itemClockIconHardcore" + i2);
			K.IconHC3 = $("#itemClockIconHardcore" + i3);
			
			repositionMarkers(
				$("#clkMarker" + i0), $("#clkMarker" + i0 + "A"), $("#clkMarker" + i0 + "B"),
				$("#clkMarker" + i1), $("#clkMarker" + i1 + "A"), $("#clkMarker" + i1 + "B"),
				$("#clkMarker" + i2 + "A"), $("#clkMarker" + i2 + "B"),
				$("#clkMarker" + i3 + "A"), $("#clkMarker" + i3 + "B"),
				T["cSECS_MARK_" + i0], T["cSECS_MARK_" + i1], T["cSECS_MARK_" + i2], T["cSECS_MARK_" + i3]
			);
	
			// Animate sector rotation
			var newsectorangle = parseInt(i0) * K.cDEGREES_IN_QUADRANT;
			if (newsectorangle === 0 && K.oldSectorAngle !== 0)
			{
				newsectorangle = K.cDEGREES_IN_CIRCLE;
			}
			
			$({angle: K.oldSectorAngle}).animate({angle: newsectorangle}, {
				duration: 600,
				step: function() { K.rotateClockElement(document.getElementById("clkSector"), this.angle); },
				done: function() { K.rotateClockElement(document.getElementById("clkSector"), newsectorangle); }
			});
			
			if (newsectorangle === K.cDEGREES_IN_CIRCLE)
			{
				newsectorangle = 0;
			}
			K.oldSectorAngle = newsectorangle;
		};
		
		// Recolor the active event's markers and rotate clock sector
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
		K.initializeClockItems();
	},

	/*
	 * Initializes the array containing Zero Clipboard objects.
	 * Each clock waypoint icon (4 img tags) will have the data attribute set to
	 * a waypoint text by the time updater.
	 */
	initializeClipboard: function()
	{
		for (var i = 0; i < T.cNUM_TIMEFRAMES_IN_HOUR; i++)
		{
			K.wpClipboards.push
			(
				new ZeroClipboard(document.getElementById("itemClockWaypoint" + i),
				{
					moviePath: "bin/ZeroClipboard.swf"
				})
			);
			/*
			 * Zero Clipboard works by overlaying an invisible Flash object over the
			 * target (the waypoint icons). When a user click on it the data
			 * attribute of the target is loaded to the user's clipboard. The code
			 * below are additional stuff to execute after.
			 */
			// Adobe Flash is loaded to enable copy to clipboard
			K.wpClipboards[i].on("load", function(pClient)
			{
				pClient.on("complete", function(pClientInner, pArgs)
				{
					// Temporarily change the waypoint icon to a copy/paste icon
					$(this).attr("src", "img/ui/copy.png");
					var elm = this;
					setTimeout(function()
					{
						$(elm).attr("src", M.cICON_WAYPOINT);
					}, 400);
					I.write("Chat link copied to clipboard :)<br />"
						+ this.getAttribute(K.cWpClipboardDataAttribute), 5);
				});
			});
		}
	}
};

/* =============================================================================
 * @@Interface and UI/jQuery bindings in HTML
 * ========================================================================== */
I = {
	cSiteName: "GW2Timer.com",
	cSiteURL: "http://gw2timer.com/",
	cPageURLMap: "map.html",
	cPageURLHelp: "help.html",
	cImageHost: "http://i.imgur.com/",
	cImageMainExtension: ".png", // Almost all used images are PNG
	cTextDelimiter: "|",
	consoleTimeout: {},
	
	// HTML/CSS pixel units
	cPANEL_WIDTH: 360,
	cPANEL_HEIGHT: 720,
	cPANE_CLOCK_HEIGHT: 360,
	cPANE_CLOCK_HEIGHT_COMPACT: 220,
	cPANE_MENU_HEIGHT: 48,
	cPANE_BEAM_LEFT: -41,
	cTOOLTIP_DEFAULT_OFFSET_X: -180,
	cTOOLTIP_DEFAULT_OFFSET_Y: 30,
	cTOOLTIP_ADD_OFFSET_Y: 42,
	cTOOLTIP_ADD_OFFSET_X: 36,
	
	// Content-Layer-Page and Section-Header
	isProgramLoaded: false,
	programMode: null,
	programModeEnum:
	{
		Website: "Website",
		Simple: "Simple",
		Overlay: "Overlay",
		Embedded: "Embedded"
	},
	cContentPane: "#paneContent",
	cContentPrefix: "#layer",
	cMenuPrefix: "#menu",
	PageEnum:
	{
		// These are the X in "menuX" and "layerX" IDs in the HTML
		Chains: "Chains",
		Map: "Map",
		Help: "Help",
		Options: "Options"
	},
	contentCurrent: "",
	contentCurrentLayer: "", // This is cContentPrefix + contentCurrent
	isContentLoaded_Map: false,
	isContentLoaded_Help: false,
	isSectionLoadedMap_Personal: false,
	sectionPrefix: "sectionCurrent_",
	sectionCurrent_Map: "",
	sectionCurrent_Help: "",
	cHeaderPrefix: "#header",
	URLKeyPage: "page",
	URLKeySection: "section",
	URLKeyMode: "mode",
	
	// User information
	userBrowser: "Unknown",
	BrowserEnum:
	{
		IE: 0,
		Opera: 1,
		Firefox: 2,
		Chrome: 3
	},
	userSmallDevice: false,
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
		document.getElementById("jsTTS").src = "";
		
		// Tell if DST is in effect
		T.checkDST();
		
		// Detect iFrame embedding
		if (window !== window.top)
		{
			I.programMode = I.programModeEnum.Embedded;
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
		
		// Get URL arguments and do appropriate changes
		O.enforceURLArgumentsFirst();
		
		// Detect small devices
		if (window.innerWidth <= I.cSMALL_DEVICE_WIDTH && window.innerHeight <= I.cSMALL_DEVICE_HEIGHT
			&& I.programMode === I.programModeEnum.Website)
		{
			I.userSmallDevice = true;
			I.write("Small device detected.<br />"
				+ "Map features have been turned off by default for better performance.<br />"
				+ "Do you want to use the <a href='./?mode=Simple'>simple clock mode?</a><br />", 15);
			/*
			 * Turn off map features if small screen, note that localStorage will
			 * override these if they were previously stored.
			 */
			O.Options.bol_tourPrediction = false;
			O.Options.bol_showChainPaths = false;
			O.Options.bol_showMap = false;
		}
		// Detect big displays
		if (window.innerHeight > I.cBIG_DISPLAY_HEIGHT)
		{
			O.Options.bol_compactClock = false;
		}
		
		// Remember user's browser maker
		var useragent = navigator.userAgent;
		if (useragent.indexOf("MSIE") !== -1)
		{
			I.userBrowser = I.BrowserEnum.IE;
		}
		else if (useragent.indexOf("Chrome") !== -1)
		{
			I.userBrowser = I.BrowserEnum.Chrome;
		}
		else if (useragent.indexOf("Firefox") !== -1)
		{
			I.userBrowser = I.BrowserEnum.Firefox;
		}
		else if (useragent.indexOf("Opera") !== -1)
		{
			I.userBrowser = I.BrowserEnum.Opera;
		}
		
		// Default content layer
		I.contentCurrent = I.PageEnum.Chains;
	},
	
	/*
	 * Does things that need to be done after everything was initially loaded
	 * (does not count AJAX loaded content).
	 */
	initializeLast: function()
	{
		// Initializes all UI
		I.initializeTooltip();
		I.initializeUIforMenu();
		I.initializeUIforChains();
		// Do special commands from the URL
		I.enforceURLArgumentsLast();
		// Clear the non-load warning after everything succeeded
		$("#paneWarning").remove();
		// Bind console buttons
		$("#jsConsoleButtonClose").click(function()
		{
			$("#jsConsoleButtons").hide();
			$("#jsConsole").empty();
		});
		$("#jsConsoleButtonSelect").click(function()
		{
			I.selectText("#jsConsole");
		});
		I.convertExternalLink(".linkExternal");
		// Fix Firefox SVG filter bug
		K.reapplyFilters();
		
		// The menu bar overlaps the language popup, so have to "raise" the clock pane
		$("#itemLanguage").hover(
			function() {$("#paneClock").css("z-index", 3);},
			function() {$("#paneClock").css("z-index", 0);}
		);
		
		// Clean the localStorage of unrecognized variables
		O.cleanLocalStorage();
		
		// Update and notify user of version change
		O.enforceProgramVersion();
		I.enforceProgramMode();
		
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
		
		if (pString === undefined)
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
	 * Alias for I.write but used for testing and easier to find and remove.
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
	 * Rewrites the URL in the address bar to show the current page and section.
	 * Does not actually load anything and is only a visual effect; however, if
	 * the user presses enter with that URL (go to such a link), a separate
	 * function will load that page (content layer) and expand that section.
	 */
	updateAddressBar: function()
	{
		if (I.contentCurrent !== "")
		{
			var section = I[I.sectionPrefix + I.contentCurrent];
			var pagestring = "?" + I.URLKeyPage + "=" + I.contentCurrent;
			var sectionstring = "&" + I.URLKeySection + "=" + section;
			if (section !== "" && section !== undefined)
			{
				history.replaceState("", null, pagestring + sectionstring);
			}
			else
			{
				history.replaceState("", null, pagestring);
			}			
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
			if (O.URLArguments[I.URLKeySection] !== undefined)
			{
				var section = O.stripToAlphanumeric(O.toFirstUpperCase(O.URLArguments[I.URLKeySection]));
				$(I.cHeaderPrefix + I.contentCurrent + "_" + section).trigger("click");
			}
		}, 0);
	},
	openPageFromURL: function()
	{
		if (O.URLArguments[I.URLKeyPage] !== undefined)
		{
			var page = O.stripToAlphanumeric(O.toFirstUpperCase(O.URLArguments[I.URLKeyPage]));
			$(I.cMenuPrefix + page).trigger("click");
		}
	},
	
	/*
	 * Does the commands within the address bar after the site's domain name.
	 * @pre URLArguments object was initialized by extraction.
	 */
	enforceURLArgumentsLast: function()
	{
		I.openPageFromURL();
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
			$(this).attr("href", I.cSiteURL + "out?" + escape($(this).attr("href")));
			$(this).attr("target", "_blank");
		});
	},
	
	/*
	 * Extracts the "index" part of an HTML element's ID. Most iterable elements'
	 * IDs were manually named as [prefix]_[Index].
	 * @param jqobject pElement to extract.
	 * @returns string pseudoindex of the element's ID.
	 */
	getIndexFromHTMLID: function(pElement)
	{
		return pElement.attr("id").split("_")[1];
	},
	
	/*
	 * Converts a search query to GW2 wiki http link.
	 * @param string pString search entry.
	 * @returns string wiki link.
	 */
	getWikiLink: function(pString)
	{
		pString = pString.replace(/ /g,"_"); // Replace spaces with underscores
		return "http://wiki.guildwars2.com/wiki/" + escape(pString);
	},
	
	/*
	 * Converts a search query to YouTube http link.
	 * @param string pString search entry.
	 * @returns string youtube link.
	 */
	getYouTubeLink: function(pString)
	{
		return "http://www.youtube.com/results?search_query=" + escape(pString);
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
				var headertextstripped = O.stripToAlphanumeric(headertext);
				$(this).html(headertext + "<span class='tocTop'> \u2191</span>");
				$(this).click(function()
				{
					I.scrollToElement($("#jsTOC_" + I.contentCurrent), $(I.contentCurrentLayer), "fast");
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
	 * container element. Creates a vertical side menu as an alias for clicking
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
			$("#menuBeam_" + I.contentCurrent).css({left: 0}).animate({left: I.cPANE_BEAM_LEFT}, "fast");
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
				var section = I.getIndexFromHTMLID($(this));
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
				I.updateAddressBar();
				
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
			 * Side menu icons as alias for headers. Clicking an icon shows the
			 * associated header's sibling container (section) by triggering
			 * that header's handler.
			 */
			var section = I.getIndexFromHTMLID(header);
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
					I.scrollToElement($(this), $(pLayer), "fast");
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
					$("#paneMenu span").each(function()
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
					$("#paneMenu span").finish().each(function()
					{
						$(this).animate({opacity: 1}, animationspeed);
					});
				}
		   );
		   // User hovers over individual menu icons
		   $("#paneMenu span").hover(
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
		$("#paneMenu span").each(function()
		{
			$(this).click(function()
			{
				var layer = $(this).attr("id");
				I.contentCurrent = layer.substring(I.cMenuPrefix.length-1, layer.length);
				I.contentCurrentLayer = I.cContentPrefix + I.contentCurrent;
				
				switch (I.contentCurrent)
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
							$("#chnEvent_" + C.CurrentChainSD.alias + "_"
								+ C.CurrentChainSD.CurrentPrimaryEvent.num).trigger("click");
						}
					} break;
					case I.PageEnum.Help:
					{
						$("#jsTop").show();
					} break;
					case I.PageEnum.Map:
					{
						$("#jsTop").show();
						$("#jsCenter").trigger("click");
						M.PinEvent.setLatLng(M.convertGCtoLC([0,0]));
					} break;
					default:
					{
						$("#jsTop").hide();
					} break;
				}
				
				$("#paneContent article").hide(); // Hide all layers
				$(I.contentCurrentLayer + " .cntHeader").css({opacity: 0})
					.animate( // Fade page title
				{
					opacity: 1
				}, 400);
				$(I.contentCurrentLayer).animate( // Show clicked layer
				{
					width: "show"
				}, 200);
				// Update the address bar URL with the current layer name
				I.updateAddressBar();
				
				// Also hide chain paths if on the map layer
				if (O.Options.bol_showChainPaths)
				{
					if (I.contentCurrent === I.PageEnum.Map)
					{
						M.setEntityGroupDisplay(M.ChainPathEntities, "hide");
					}
					else
					{
						M.setEntityGroupDisplay(M.ChainPathEntities, "show");
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
		I.convertExternalLink(pLayer + " a");
	},
	
	/*
	 * Loads the help page into the help content layer.
	 */
	loadHelpLayer: function()
	{
		$("#layerHelp").load(I.cPageURLHelp, function()
		{
			I.bindAfterAJAXContent("#layerHelp");
			
			// Expand a header if requested in the URL
			I.openSectionFromURL();
			
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

			// Bind map zone links
			$(".mapZones li").each(function()
			{
				M.bindMapLinkBehavior($(this), null, M.ZoomLevelEnum.Sky);
			});
			// Create daily markers
			$("#headerMap_Daily").one("click", M.generateAndInitializeDailies);
			// Create node markers and checkboxes
			$("#headerMap_Resource").one("click", M.generateAndInitializeResourceNodes);
			// Create JP checklist
			$("#headerMap_JP").one("click", function()
			{
				M.generateAndInitializeJPs();
				M.generateAndInitializeJPChecklistHTML();
			});
			// Create custom checklists
			$("#headerMap_Personal").one("click", function()
			{
				X.initializeDungeonChecklist();
				X.initializeCustomChecklist();
				I.isSectionLoadedMap_Personal = true;
			});
			
			// Bind show map icons when clicked on header
			$("#headerMap_Daily, #headerMap_Resource, #headerMap_JP").each(function()
			{
				$(this).click(function()
				{
					// Show only if the section is about to be expanded
					if ($(this).children("sup").text() === "[-]")
					{
						M.displayIcons(I.getIndexFromHTMLID($(this)), true);
					}
				});
			});

			// Create additional map related side menu icon
			$("<img class='menuBeamIcon menuBeamIconCenter' src='img/map/star.png' "
				+ "title='&lt;dfn&gt;Map Center&lt;/dfn&gt;' />")
				.appendTo("#menuBeam_Map")
			.click(function()
			{
				$("#jsCenter").trigger("click");
			});
			I.qTip.init("#layerMap .menuBeamIconCenter, #layerMap label");
			
			// Expand a header if requested in the URL
			I.openSectionFromURL();
			
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
		switch (I.programMode)
		{
			case I.programModeEnum.Overlay:
			{
				$("#itemLanguage, #itemSocial").hide();
			} break;
			case I.programModeEnum.Simple:
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
				$("#paneClockBack, #paneClockBackground").css({opacity: 0});
				
				// Readjust clock elements
				$("#itemTimeServer, #itemSocial").hide();
				$("#itemLanguage").css({
					position: "fixed",
					top: "10px",
					right: "10px",
					bottom: "auto",
					left: "auto"
				});
				$("#itemLanguage span").css({opacity: 0.7});
				$("#itemLanguageChoices a").each(function()
				{
					var link = $(this).attr("href");
					$(this).attr("href", link + "&mode=Simple");
				});
				$("#itemTimeLocal").css({
					position: "fixed",
					color: "#eee",
					opacity: 0.5
				});
				I.qTip.init($("<a title='&lt;dfn&gt;Shortcut to this page&lt;/dfn&gt;: gw2timer.com/m' href='./'> [+]</a>")
					.appendTo("#itemTimeLocalExtra"));
				$("#paneBoard").show();
				
			} break;
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
		I.qTip.init("a, ins, span, img, fieldset, label, input, button");
		
		/*
		 * Make the tooltip appear top of the cursor instead of below if it's too
		 * near the bottom of the window (to avoid overflow).
		*/
		$("#panelRight").mousemove(function(pEvent)
		{
			/*
			$("#jsConsole").html(pEvent.pageX + ", " + pEvent.pageY + "<br />"
				+ $("#qTip").width() + ", " + $("#qTip").height() + "<br />"
				+ $(window).width() + ", " + $(window).height());
			*/
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
		});
		$("#panelLeft").mousemove(function(pEvent)
		{
			if ($("#qTip").width() + pEvent.pageX + I.cTOOLTIP_ADD_OFFSET_X > $("#paneMap").width())
			{
				I.qTip.offsetX = -($("#qTip").width()) - I.cTOOLTIP_ADD_OFFSET_X;
			}
			else
			{
				I.qTip.offsetX = 24;
			}
			if ($("#qTip").height() - 24 + pEvent.pageY > $(window).height())
			{
				I.qTip.offsetY = -($("#qTip").height()) - I.cTOOLTIP_ADD_OFFSET_Y;
			}
			else
			{
				I.qTip.offsetY = -42;
			}
		});
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
				if (this.a = document.getElementById(this.name)) document.onmousemove = function(a)
				{
					I.qTip.move(a);
				};
				$(s).each(function()
				{
					if (a = $(this)[0], b = a.getAttribute("title"))
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
 *  Executions and jQuery bindings; the order matters!
 * ============================================================= */
I.initializeFirst(); // initialize variables that need to be first
O.initializeOptions(); // load stored or default options to the HTML input
T.initializeSchedule(); // compute event data and write HTML
M.initializeMap(); // instantiate the map and populate it
K.initializeClock(); // start the clock and infinite loop
I.initializeLast(); // bind event handlers for misc written content




});//]]>// END OF JQUERY NEST