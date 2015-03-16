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
	U - URL management
	X - Checklists
	E - Economy
	D - Dictionary for translations
	C - Chains events
	M - Map Leaflet
	P - Populate map
	W - World vs World
	T - Time utilities and schedule
	K - Clock ticker
	I - Interface UI

*/

$(window).on("load", function() {
	
/* =============================================================================
 *  Single letter objects serve as namespaces.
 * ========================================================================== */
var O, U, X, E, D, C, M, P, W, T, K, I = {};

/* =============================================================================
 * @@Options for the user
 * ========================================================================== */
O = {
	lengthOfPrefixes: 3,
	prefixOption: "opt_",
	legalLocalStorageKeys: new Array(),

	/*
	 * These utility variables will also be stored in localStorage.
	 * O.Utilities, O.Options, and X.Checklists/Textlists share a namespace in
	 * localStorage and must together have unique variable names.
	 */
	Utilities:
	{
		programVersion: {key: "int_utlProgramVersion", value: 150312},
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
		bol_expandWB: true,
		bol_expandDT: true,
		bol_collapseChains: true,
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
		bol_displayEvents: false,
		// GPS
		bol_displayCharacter: true,
		bol_followCharacter: false,
		int_msecGPSRefresh: 250,
		// Alarm
		int_setAlarm: 0,
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
		int_sizeNotepadHeight: 500,
		// Trading
		bol_refreshPrices: true,
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
				+ "Would you like to see the <a class='urlUpdates' href='" + U.URL_META.News + "'>changes</a>?<br />"
				+ "<br />"
				+ "World Boss Rewards have been added to the chain bars.<br />"
				+ "Please <a class='urlUpdates' href='http://forum.renaka.com/topic/5775595/'>report any incorrect information</a>."
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
	randomBool: function()
	{
		return (Math.random() > 0.5) ? true : false;
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
		U.initializeAPIURLs();
	},
	
	/*
	 * Unchecks the time sensitive checklists and clear variables, ignoring
	 * the disabled/deleted ones by the user.
	 */
	clearServerSensitiveOptions: function()
	{
		var messagetime = 10;
		I.write("Daily Reset / Timestamp Expired!", messagetime);
		
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
				$("#barChain_" + chain.nexus).css({opacity: 1});
				if (X.getChecklistItem(X.Checklists.Chain, chain.nexus) !== X.ChecklistEnum.Disabled)
				{
					$("#barChain_" + chain.nexus).show();
				}
			}
			X.clearChecklist(X.Checklists.Chain, X.ChecklistJob.UncheckTheChecked);
		}
		// Update the today's chain shortcut object
		C.updateChainToday();
		
		// Subscribe to daily chain
		if (O.Options.bol_alertAutosubscribe &&
			O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription)
		{
			if (C.ChainToday)
			{
				time = $("#chnTime_" + C.ChainToday.nexus);
				if ( ! time.hasClass("chnTimeSubscribed"))
				{
					I.write("Autosubscribed to Daily World Boss: " + C.ChainToday.alias);
					time.trigger("click");
				}
			}
		}
		
		// Dungeon and Personal Checklists
		if (O.Options.bol_clearPersonalChecklistOnReset)
		{
			$("#chlDungeonUncheck").trigger("click");
			$("#chlCustomUncheck").trigger("click");
			X.clearChecklist(X.Checklists.Dungeon, X.ChecklistJob.UncheckTheChecked);
			X.clearChecklist(X.Checklists.Custom, X.ChecklistJob.UncheckTheChecked);
		}
		// Login rewards and dailies calendar
		if (I.isSectionLoaded_Daily)
		{
			P.shiftLoginTrack();
			P.regenerateDailiesCalendar();
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
			
			$("#mapOptionsDisplay label input").each(function()
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
		$("#mapOptionsDisplay label input").each(function()
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
		bol_expandDT: function()
		{
			for (var i in C.CurrentChains)
			{
				if (C.CurrentChains[i].series === C.ChainSeriesEnum.DryTop)
				{
					$("#chnDetails_" + C.CurrentChains[i].nexus).toggle(O.Options.bol_expandDT);
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
		bol_useCountdown: function()
		{
			C.updateChainsTimeHTML();
		},
		bol_showChainPaths: function()
		{
			M.setEntityGroupDisplay(M.ChainPathEntities, O.Options.bol_showChainPaths);
			M.setEntityGroupDisplay(M.DryTopEventActive, O.Options.bol_showChainPaths);
		},
		bol_displayCharacter: function()
		{
			if ( ! O.Options.bol_displayCharacter)
			{
				M.movePin(M.PinCharacter);
				M.movePin(M.PinCamera);
			}
			else
			{
				M.tickGPS();
			}
		},
		bol_showMap: function()
		{
			if (I.ModeCurrent !== I.ModeEnum.Mobile)
			{
				if (O.Options.bol_showMap)
				{
					$("#panelLeft").show();
					M.refreshMap();
				}
				else
				{
					$("#panelLeft").hide();
				}
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
			P.shiftLoginTrack();
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
		MapFloorTyria: "https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=1",
		TilesMists: "https://tiles.guildwars2.com/2/1/{z}/{x}/{y}.jpg",
		MapFloorMists: "https://api.guildwars2.com/v1/map_floor.json?continent_id=2&floor=1",
		EventNames: "https://api.guildwars2.com/v1/event_names.json",
		EventDetails: "https://api.guildwars2.com/v1/event_details.json",
		
		// Exchange
		ItemListing: "https://api.guildwars2.com/v2/commerce/listings/",
		ItemPrices: "https://api.guildwars2.com/v2/commerce/prices/",
		ItemDetails: "https://api.guildwars2.com/v1/item_details.json?item_id=",
		ItemRender: "https://render.guildwars2.com/file/",
		CoinPrice: "https://api.guildwars2.com/v2/commerce/exchange/gems?quantity=",
		GemPrice: "https://api.guildwars2.com/v2/commerce/exchange/coins?quantity=",
		ItemSearch: "http://www.gw2spidy.com/api/v0.9/json/item-search/",
		ItemData: "http://www.gw2spidy.com/api/v0.9/json/item/",
		
		// WvW
		WvWMatches: "https://api.guildwars2.com/v1/wvw/matches.json",
		WvWMatchDetails: "https://api.guildwars2.com/v1/wvw/match_details.json?match_id=",
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
		Skill: "img/map/skill.png",
		Heart: "img/map/heart.png"
	},
	
	URL_DATA:
	{
		Resource: "data/resource.js",
		Collectible: "data/collectible.js"
	},
	
	initializeAPIURLs: function()
	{
		var lang = D.getFullySupportedLanguage();
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
			else if (page === "chests")
			{
				U.Args[X.Checklists.Collectible1.urlkey] = "true";
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
			var article = U.Args[U.KeyEnum.Article];
			var go = U.Args[U.KeyEnum.Go];

			var pagestring = "?" + U.KeyEnum.Page + "=" + I.PageCurrent;
			var sectionstring = "";
			var articlestring = "";
			var gostring = "";
			var modestring = "";
			
			if (I.ModeCurrent === I.ModeEnum.Overlay ||
				I.ModeCurrent === I.ModeEnum.Mobile)
			{
				modestring = "&mode=" + I.ModeCurrent;
			}

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
			
			U.updateAddressBar(pagestring + sectionstring + articlestring + gostring + modestring);
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
				// Try going to a section name in sentence letter case
				var elem = $(I.cHeaderPrefix + I.PageCurrent + "_" + U.toFirstUpperCase(section));
				if ( ! elem.length)
				{
					// Else try going to a section name in all caps
					elem = $(I.cHeaderPrefix + I.PageCurrent + "_" + section.toUpperCase());
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
				case "drytop": {
					$("#listChainsScheduled").prev().trigger("click"); // Hide scheduled chains list
					$("#listChainsDryTop").prev().trigger("click"); // Show Dry Top list
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
			$(this).attr("href", I.cSiteURL + "out?" + escape($(this).attr("href")));
			$(this).attr("target", "_blank");
		});
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
			url = I.cSiteURL + "out?" + escape(pURL);
		}
		window.open(url, "_blank");
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
	getWikiSearchLink: function(pString)
	{
		pString = pString.replace(/ /g, "+"); // Replace spaces with plus sign
		return "http://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=" + escape(pString);
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
	 * Converts a search query to Trading Post http link.
	 * @param string pString search entry.
	 * @returns string search link.
	 */
	getTradingSearchLink: function(pString)
	{
		return "https://www.gw2tp.com/search?name=" + escape(pString);
	},
	
	/*
	 * Gets a URL to an item page from an item's ID.
	 * @param string pID of the item.
	 * @param string pName of the item.
	 * @returns string item page link.
	 */
	getTradingItemLink: function(pID, pName)
	{
		//return "https://www.gw2tp.com/item/" + escape(pID) + "#" + U.stripToSentence(pName);
		return "http://www.gw2spidy.com/item/" + escape(pID) + "#" + U.stripToSentence(pName);
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
		return "[&" + btoa(String.fromCharCode(2) + String.fromCharCode(1)
			+ String.fromCharCode(pID % 256) + String.fromCharCode(Math.floor(pID / 256))
			+ String.fromCharCode(0) + String.fromCharCode(0)) + "]";
	},
	
	/*
	 * Gets the image URL for an GW2 item.
	 * @param object pItemDetails obtained from the API.
	 * @returns string URL.
	 */
	getAssetIconURL: function(pItemDetails)
	{
		return U.URL_API.ItemRender + pItemDetails["icon_file_signature"]
			+ "/" + pItemDetails["icon_file_id"] + ".png";
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
		Dungeon: { key: "str_chlDungeon", value: "", money: 0 },
		Custom: { key: "str_chlCustom", value: "" },
		/*
		 * Collectible checklists must have the same variable name as in the map page's data.
		 * The urlkey properties must be unique from the global KeyEnum.
		 */
		Collectible0: { key: "str_chlDiveMaster", urlkey: "divemaster", value: "", cushion: new Array() },
		Collectible1: { key: "str_chlBuriedChest", urlkey: "chests", value: "", cushion: new Array() },
		Collectible2: { key: "str_chlCoinProspect", urlkey: "coinprospect", value: "", cushion: new Array() },
		Collectible3: { key: "str_chlCoinUplands", urlkey: "coinuplands", value: "", cushion: new Array() },
		Collectible4: { key: "str_chlCoinChallenger", urlkey: "coinchallenger", value: "", cushion: new Array() },
		// Individual calculator's settings
		TradingOverwrite: { key: "str_chlTradingOverwrite", value: "" },
		TradingNotify: { key: "str_chlTradingNotify", value: "" }
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
		AllUnchecked: 0,
		AllChecked: 1,
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
		CustomText: { key: "str_txlCustomText", value: new Array(), valueDefault: new Array() },
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
		// If stored list is longer than requested, then truncate it to the left
		else if (storedlist.length > pLength)
		{
			localStorage[pChecklist.key] = storedlist.substring(0, pLength);
		}
		// If stored list is shorter than requested, then concatenate it with 0's so its new length equals so
		else if (storedlist.length < pLength)
		{
			var padding = U.repeatChar(pLength - storedlist.length, X.ChecklistEnum.Unchecked);
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
			case X.ChecklistJob.AllChecked:
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
				pTextFields.each(function(pIndex)
				{
					$(this).val(pTextlist.valueDefault[pIndex]).trigger("change");
				});
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
		var bar = $("#barChain_" + pChain.nexus);
		var check = $("#chnCheck_" + pChain.nexus);
		var time = $("#chnTime_" + pChain.nexus);

		// Set the checkbox visual state as stored
		switch (X.getChecklistItem(X.Checklists.Chain, pChain.nexus))
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
		if (X.getChecklistItem(X.Checklists.ChainSubscription, pChain.nexus) ===
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
		$("#chnDelete_" + pChain.nexus).click(function()
		{
			var nexus = U.getSubintegerFromHTMLID($(this));
			var thisbar = $("#barChain_" + nexus);

			thisbar.hide("slow");
			X.setChecklistItem(X.Checklists.Chain, nexus, X.ChecklistEnum.Disabled);

			// Also update the clock icon
			K.checkoffChainIcon(nexus);
		});
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
			
			// Now that this checkbox is bound, trigger it as the state in checklist
			X.triggerCheckboxEnumState(X.Checklists.Custom, pIndex, $(this));
		});
		
		// Bind uncheck all button
		$("#chlCustomUncheck").click(function()
		{
			X.clearChecklist(X.Checklists.Custom, X.ChecklistJob.UncheckTheChecked);
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
		X.initializeTextlist(X.Textlists.CustomText, items, "Custom checklist item", 48, restore);
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
		COIN_SAMPLE: 1000000 // 100 gold
	},
	Rarity:
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
	createCoinString: function(pAmount)
	{
		if (pAmount === undefined || isFinite(pAmount) === false)
		{
			return "0.00";
		}
		pAmount = parseInt(pAmount);
		
		var gold = Math.abs(~~(pAmount / E.Exchange.COPPER_IN_GOLD));
		var silver = Math.abs(~~(pAmount / E.Exchange.SILVER_IN_GOLD) % E.Exchange.COPPER_IN_SILVER);
		var copper = Math.abs(pAmount % E.Exchange.COPPER_IN_SILVER);
		var sign = (pAmount < 0) ? "−" : "";
		
		// Leading zero for units that are right side of the leftmost unit
		if (gold > 0 && silver < T.cBASE_10)
		{
			silver = "0" + silver;
		}
		if (copper < T.cBASE_10)
		{
			copper = "0" + copper;
		}
		
		if (gold > 0)
		{
			return sign + gold + "." + silver + "." + copper;
		}
		if (silver > 0)
		{
			return sign + silver + "." + copper;
		}
		return sign + "0." + copper;
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
	 * @param int pLevel of rarity.
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
	 * Animates the input box's value or the box itself depending change.
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
	 * Calculates the trading calculator's output textboxes using input textboxes' values.
	 * @param jqobject pEntry trading calculator HTML parent.
	 */
	calculateTrading: function(pEntry)
	{
		// Constants
		var cListFee = 0.05;
		var cSellTax = 0.10;
		var cTotalTax = cListFee + cSellTax;
		var cInvertedTax = 1 - cTotalTax;
		
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
		
		var profitamount = (sell - (sell * cTotalTax) - buy) * quantity;
		var revenueamount = (sell - (sell * cSellTax)) * quantity;
		var costamount = buy * quantity;
		var listamount = (sell * cListFee) * quantity;
		var taxamount = (sell * cSellTax) * quantity;
		
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
			buy / cInvertedTax
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
			pEntry.find(".trdIcon").attr("src", U.getAssetIconURL(pData));
			pEntry.find(".trdLink").val(U.getChatlinkFromItemID(id));
		});
	},
	
	/*
	 * Retrieves prices from API and updates those boxes.
	 * @param jqobject pEntry trading calculator HTML parent.
	 */
	updateTradingPrices: function(pEntry)
	{
		var name = encodeURIComponent(pEntry.find(".trdName").val());
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
					D.speak(D.getString("buy low") + " " + name);
				}
				else
				{
					buylowelm.removeClass("trdMatched");
				}

				if (currentbuy >= buyhigh && buyhigh !== 0 && currentbuy !== 0)
				{
					nameelm.addClass("trdMatched");
					buyhighelm.addClass("trdMatched");
					D.speak(D.getString("buy high") + " " + name);
				}
				else
				{
					buyhighelm.removeClass("trdMatched");
				}

				if (currentsell <= selllow && selllow !== 0 && currentsell !== 0)
				{
					nameelm.addClass("trdMatched");
					selllowelm.addClass("trdMatched");
					D.speak(D.getString("sell low") + " " + name);
				}
				else
				{
					selllowelm.removeClass("trdMatched");
				}

				if (currentsell >= sellhigh && sellhigh !== 0 && currentsell !== 0)
				{
					nameelm.addClass("trdMatched");
					sellhighelm.addClass("trdMatched");
					D.speak(D.getString("sell high") + " " + name);
				}
				else
				{
					sellhighelm.removeClass("trdMatched");
				}
			}
		}).fail(function()
		{
			I.write("Error retrieving API data for " + U.escapeHTML(pEntry.find(".trdName").val()));
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
		
		pEntry.find(".trdName").removeClass("trdMatched");
		pEntry.find(".trdNotifyBuyLow").val("").trigger("change").removeClass("trdMatched");
		pEntry.find(".trdNotifyBuyHigh").val("").trigger("change").removeClass("trdMatched");
		pEntry.find(".trdNotifySellLow").val("").trigger("change").removeClass("trdMatched");
		pEntry.find(".trdNotifySellHigh").val("").trigger("change").removeClass("trdMatched");
	},
	
	/*
	 * Generates calculators and binds behavior.
	 */
	initializeTrading: function()
	{
		var i;
		var entry = "";
		var name, buy, sell, quantity;
		
		for (i = 0; i < O.Options.int_numTradingCalculators; i++)
		{
			entry = "#trdEntry_" + i;
			// Generate individual calculators
			$("#trdList").append(
				"<div id='trdEntry_" + i + "' class='trdEntry'>"
					+ "<div class='trdAccordion trdAccordionShut'>"
						+ "<samp><img class='trdIcon' src='" + U.URL_IMG.Placeholder + "' /></samp>"
							+ "<input class='trdItem' type='text' />"
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
							+ "<samp>[]</samp><input class='trdLink trdOutput' type='text' tabindex='-1' /><br />"
							+ "<samp>$~!</samp>"
								+ "<input class='trdNotifyBuyHigh' type='text' />"
								+ "<input class='trdCurrentBuy trdOutput' type='text' tabindex='-1' />"
								+ "<input class='trdNotifyBuyLow' type='text' />"
								+ "<label title='<dfn>" + D.getSentence("overwrite") + "</dfn>: Replace your buy and sell prices with the current prices when refreshing.'>"
									+ "<input class='trdOverwrite' type='checkbox' tabindex='-1' />&zwnj;</label><br />"
							+ "<samp>!~$</samp>"
								+ "<input class='trdNotifySellHigh' type='text' />"
								+ "<input class='trdCurrentSell trdOutput' type='text' tabindex='-1' />"
								+ "<input class='trdNotifySellLow' type='text' />"
								+ "<label title='<dfn>" + D.getSentence("notify") + "</dfn>: Turn on sound notification for this item.'>"
									+"<input class='trdNotify' type='checkbox' tabindex='-1' />&zwnj;</label>"
						+ "<br /><br /></div>"
					+ "</div>"
					+ "<div class='trdPreview'>"
						+ "<input class='trdCurrentBuy trdOutput' type='text' tabindex='-1' />"
						+ "<input class='trdCurrentSell trdOutput' type='text' tabindex='-1' />"
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
			
			// Bind name search box behavior
			$(name).on("input", $.throttle(E.cSEARCH_LIMIT, function()
			{
				var query = $(this).val();
				var entry = $(this).parents(".trdEntry");
				var resultscontainer, results;
				if (query.length < 3) // Don't search if keywords are below this length
				{
					// Reset API output boxes
					E.clearCalculator(entry);
					return;
				}

				$.getJSON(U.URL_API.ItemSearch + query, function(pData)
				{
					entry.find(".trdResultsContainer").remove();
					var thisi;
					var result, resultline;
					if (pData.results.length > 0)
					{
						// Create popup container for the items result list
						resultscontainer = $("<div class='trdResultsContainer jsRemovable'></div>")
							.insertAfter(entry.find(".trdName"));
						results = $("<div class='trdResults cntPopup'></div>").appendTo(resultscontainer);

						// Add items to the results list
						for (thisi = 0; thisi < pData.results.length && thisi < O.Options.int_numTradingResults; thisi++)
						{
							result = pData.results[thisi];
							resultline =  $("<dfn class='rarity" + result.rarity + "' data-id='" + result.data_id + "' "
								+ "data-buy='" + E.createCoinString(result.max_offer_unit_price) + "' "
								+ "data-sell='" + E.createCoinString(result.min_sale_unit_price) + "'>"
								+ "<img src='" + result.img + "'>"
								+ U.wrapSubstringHTML(result.name, query, "u") + "</dfn>").appendTo(results);
							// Bind click a result to memorize the item's ID and name
							resultline.click(function()
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
						}
					}
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
			$(entry + " .trd" + pBoxName).attr("title", "<dfn>" + D.getString(pWord) + "</dfn>" + pInfo);
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
		
		X.initializeCheckboxlist(X.Checklists.TradingOverwrite, $("#trdList .trdOverwrite"), X.ChecklistJob.AllChecked);
		X.initializeCheckboxlist(X.Checklists.TradingNotify, $("#trdList .trdNotify"), X.ChecklistJob.AllChecked);
		
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
		var ratio = 0;
		
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
			$.getJSON(U.URL_API.CoinPrice + E.Exchange.GEM_SAMPLE, function(pData)
			{
				if (pData.quantity !== undefined)
				{
					ratio = E.Exchange.GEM_SAMPLE / pData.quantity;
				}
			}).always(function()
			{
				if (ratio !== 0)
				{
					previousgeminverse = parseInt(cointogeminverse.val());
					previousmoneyinverse = E.parseMoneyString(cointomoneyinverse.val());
					
					currentgeminverse = Math.round(cointoamount * ratio);
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
		var ratio = 0;
		
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
			$.getJSON(U.URL_API.GemPrice + E.Exchange.COIN_SAMPLE, function(pData)
			{
				if (pData.quantity !== undefined)
				{
					ratio = E.Exchange.COIN_SAMPLE / pData.quantity;
				}
			}).always(function()
			{
				if (ratio !== 0)
				{
					previouscoininverse = E.parseCoinString(gemtocoininverse.val());
					currentcoininverse = Math.round(gemtoamount * ratio);
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
					D.speak(D.getString("buy gem high"));
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
					D.speak(D.getString("buy coin high"));
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
			$("#trdExchange .trd" + pBoxName).attr("title", "<dfn>" + D.getString(pPhrase) + "</dfn>");
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
		s_arrival: {de: "ankunft", es: "llegada", fr: "arrivée",
			cs: "příjezd", it: "arrivo", pl: "przyjazd", pt: "chegada", ru: "прибытие", zh: "到來"},
		s_world_boss: {de: "weltboss", es: "jefe mundo", fr: "chef monde",
			cs: "svět boss", it: "boss mondo", pl: "świat szef", pt: "chefe mundo", ru: "мир босс", zh: "世界頭目"},
		s_section: {de: "paragraph", es: "sección", fr: "section",
			cs: "oddíl", it: "sezione", pl: "sekcja", pt: "seção", ru: "параграф", zh: "節"},
		s_Vista: {de: "Aussichtspunkt", es: "Vista", fr: "Panorama"},
		s_Skill_Challenge: {de: "Fertigkeitspunkt", es: "Desafío de habilidad", fr: "Défi de compétence"},
		s_checklist: {de: "prüfliste", es: "lista de comprobación", fr: "liste de contrôle",
			cs: "kontrolní seznam", it: "elenco di controllo", pl: "lista kontrolna", pt: "lista de verificação", ru: "контрольный список", zh: "檢查清單"},
		s_subscription: {de: "abonnement", es: "suscripción", fr: "abonnement",
			cs: "předplatné", it: "sottoscrizione", pl: "abonament", pt: "assinatura", ru: "подписка", zh: "訂閱"},
		s_alarm: {de: "alarm", es: "alarma", fr: "alarme",
			cs: "alarmu", it: "allarme", pl: "alarmu", pt: "alarme", ru: "будильник", zh: "鬧鐘"},
		s_mode: {de: "modus", es: "modo", fr: "mode",
			cs: "režim", it: "modalità", pl: "tryb", pt: "modo", ru: "режим", zh: "方式"},
		s_chatlink: {de: "chatlink", es: "vínculo chat", fr: "lien chat",
			cs: "chat odkaz", it: "collegamento chat", pl: "czat łącze", pt: "link bate-papo", ru: "чат связь", zh: "連結聊天"},
		
		// Verbs
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
		s_off: {de: "aus", es: "desactivado", fr: "désactivé",
			cs: "vypnuto", it: "disattivato", pl: "wyłączany", pt: "desativado", ru: "выключено", zh: "關"},
		s_predicted: {de: "vorhergesagt", es: "previsto", fr: "prédit",
			cs: "předpovídal", it: "previsto", pl: "przewiduje", pt: "predito", ru: "предсказанный", zh: "預測"},
		s_subscribed: {de: "abonniert", es: "suscrito", fr: "souscrit",
			cs: "odebírané", it: "sottoscritti", pl: "subskrypcji", pt: "assinado", ru: "подписал", zh: "訂閱"},
		s_then: {de: "dann", es: "luego", fr: "puis",
			cs: "pak", it: "poi", pl: "potem", pt: "então", ru: "затем", zh: "接著"},
		
		// Prepositions and Conjunctions
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
		s_Dry_Top: {de: "Trockenkuppe", es: "Cima Seca", fr: "Col Aride"},
		s_Legacy_Bosses: {de: "Legacy", es: "Heredado", fr: "Hérité",
			cs: "Starší", it: "Legacy", pl: "Starsze", pt: "Herdado", ru: "Устаревший", zh: "舊版"},
		s_Orr_Temples: {de: "Tempel", es: "Templos", fr: "Temples",
			cs: "Chrámy", it: "Templi", pl: "Świątynie", pt: "Templos", ru: "Храмы", zh: "寺廟"},
		s_Full_Timetable: {de: "Zeitplan", es: "Horario", fr: "Horaire",
			cs: "Plán", it: "Programma", pl: "Harmonogram", pt: "Horário", ru: "Расписание", zh: "時間表"},
		s_news: {de: "nachrichten", es: "noticias", fr: "actualités",
			cs: "zprávy", it: "notizie", pl: "wiadomości", pt: "notícias", ru: "новости", zh: "新聞"},
		s_simple: {de: "einfach", es: "simple", fr: "simple",
			cs: "prostý", it: "semplice", pl: "prosty", pt: "simples", ru: "простой", zh: "簡單"},
		s_mobile: {de: "mobil", es: "móvil", fr: "mobile",
			cs: "mobilní", it: "mobile", pl: "mobilna", pt: "móvel", ru: "мобильный", zh: "行動"},
		s_chests: {de: "schatztruhen", es: "cofres del tesoro", fr: "coffres au trésor",
			cs: "truhly", it: "scrigni del tesoro", pl: "skrzynie", pt: "baús de tesouro", ru: "сундуки с сокровищами", zh: "寶箱"},
		
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
			cs: "Možnosti", it: "Opzioni", pl: "Opcje", pt: "Opções", ru: "Параметры", zh: "選項"}
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
		}
		// Language not found so use default instead
		return pText;
	},
	getWord: function(pText)
	{
		if (O.Options.enu_Language === O.OptionEnum.Language.Default)
		{
			return pText;
		}
		// No error checking, assume entry exists
		return (D.Phrase["s_" + pText])[O.Options.enu_Language];
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
	 * Translates multiple space separated words.
	 * @param string pString of words.
	 * @param enum pCase to change capitalization.
	 * @returns string translated.
	 */
	getString: function(pString, pCase)
	{
		if (pCase === undefined)
		{
			pCase = U.CaseEnum.Every;
		}
		
		var str = pString.split(" ");
		for (var i in str)
		{
			str[i] = D.getTranslation(str[i], D.Phrase);
		}
		return U.toCase(str.join(" "), pCase);
	},
	
	/*
	 * Gets a word and modifier string in language-dependent order in specified case.
	 * @param string pText a noun for example.
	 * @param string pModifier an adjective for example.
	 * @param enum pCase to change the phrase's capitalization.
	 * @returns string modified word phrase.
	 */
	getModifiedWord: function(pText, pModifier, pCase)
	{
		var str = "";
		if (pModifier)
		{
			var text = D.getPhrase(pText);
			var modifier = D.getPhrase(pModifier);
			str = D.isLanguageModifierFirst() ? (modifier + " " + text) : (text + " " + modifier);
		}
		else
		{
			str = D.getPhrase(pText);
		}
		
		return U.toCase(str, pCase);
	},
	
	/*
	 * Translates the header of a page.
	 * @param enum pPlate to get header.
	 */
	translatePageHeader: function(pPlate)
	{
		if (O.Options.enu_Language !== O.OptionEnum.Language.Default)
		{
			$("#plate" + pPlate + " .cntHeader").text(D.getElement("menu" + pPlate));
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
			$("#paneMenu kbd").each(function()
			{
				$(this).attr("title", "<dfn>" + D.getElement($(this).attr("id")) + "</dfn>");
				I.qTip.init($(this));
			});
			D.translatePageHeader(I.PageEnum.Options);
		}
		
		$("#optAlarmLegend").text(D.getModifiedWord("mode", "alarm", U.CaseEnum.Every));
		$("#opt_int_setAlarm").after(" " + D.getSentence("off"));
		$("#optAlarmChecklist").after(" " + D.getSentence("checklist"));
		$("#optAlarmSubscription").after(" " + D.getSentence("subscription"));
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
		zh: "火焰元素"
	},{
		en: "Golem Mark II",
		de: "Golem Typ II",
		es: "Gólem Serie II",
		fr: "Golem Marque II",
		cs: "Golem Typu II",
		it: "Golem Tipo II",
		pl: "Golem Model II",
		pt: "Golem Tipo II",
		ru: "Голем Тип II",
		zh: "魔像馬克II型"
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
		zh: "卓瑪之爪"
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
		zh: "斯瓦尼亞薩滿"
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
		zh: "超能毀滅者"
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
		zh: "暗影巨獸"
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
		zh: "碎裂巨獸"
	},{
		en: "Taidha Covington",
		de: "Taidha Covington",
		es: "Taidha Covington",
		fr: "Taidha Covington",
		cs: "Taidha Covington",
		it: "Taidha Covington",
		pl: "Taidha Covington",
		pt: "Taidha Covington",
		ru: "Таидха Цовингтон",
		zh: "泰達·科文頓"
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
		zh: "莫迪爾沃爾格斯"
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
		zh: "巨型叢林地虫"
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
		zh: "喀殼虫女王"
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
		zh: "吞噬托"
	},{
		en: "Triple Wurm",
		de: "Dreifach Wurm",
		es: "Sierpe Triple",
		fr: "Guivre Triple",
		cs: "Trojitý Červ",
		it: "Verme Triplo",
		pl: "Potrójne Robak",
		pt: "Verme Triplo",
		ru: "Тройной Червь",
		zh: "進化巨型叢林地虫"
	},{
		en: "Dry Top Q1",
		de: "Trockenkuppe Q1",
		es: "Cima Seca Q1",
		fr: "Col Aride Q1"
	},{
		en: "Dry Top Q2",
		de: "Trockenkuppe Q2",
		es: "Cima Seca Q2",
		fr: "Col Aride Q2"
	},{
		en: "Dry Top Q3",
		de: "Trockenkuppe Q3",
		es: "Cima Seca Q3",
		fr: "Col Aride Q3"
	},{
		en: "Dry Top Q4",
		de: "Trockenkuppe Q4",
		es: "Cima Seca Q4",
		fr: "Col Aride Q4"
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
		en: "Rhendak the Crazed",
		de: "Rhendak den Verrückten",
		es: "Rhendak el Perturbado",
		fr: "Rhendak le Fou",
		cs: "Poblázněný Rhendak",
		it: "Rhendak il Folle",
		pl: "Szalony Rhendak",
		pt: "Rhendak o Enlouquecido",
		ru: "Сумасшедший Рхендак",
		zh: "瘋狂 Rhendak"
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
		en: "Nebo Terrace",
		de: "Nebo-Terrasse",
		es: "Terraza de Nebo",
		fr: "Terrasse de Nebo",
		cs: "Nebo Terasa",
		it: "Terrazzo di Nebo",
		pl: "Nebo Taras",
		pt: "Esplanada de Nebo",
		ru: "Нево Терраса",
		zh: "階地 Nebo"
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
	}
	],
	
	/*
	 * Gets title of chain in opted language.
	 * @param int pIndex of chain.
	 * @returns string title.
	 */
	getChainTitle: function(pIndex)
	{
		if (C.Chains[pIndex].series === C.ChainSeriesEnum.DryTop)
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
		if (C.Chains[pIndex].series === C.ChainSeriesEnum.DryTop)
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
		
			if (I.BrowserCurrent === I.BrowserEnum.Chrome)
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
		
		// If no duration is given, then estimate speech length
		if (pDuration === undefined)
		{
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
		document.getElementById("jsTTSFrame").src = "";
		document.getElementById("jsTTSAudio").src = "";
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
	 * Gets translation for given text if using Chrome (because Google TTS
	 * is multilingual but only supports Chrome browser), else return given text.
	 * @param string pText to lookup.
	 * @param string pModifier optional adjective or adverb.
	 * @returns string translated text or given text.
	 */
	getSpeech: function(pText, pModifier)
	{
		if (I.BrowserCurrent === I.BrowserEnum.Chrome)
		{
			if (pModifier)
			{
				return D.getModifiedWord(pText, pModifier);
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
			|| I.BrowserCurrent !== I.BrowserEnum.Chrome)
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
	 * http://gw2timer.com/data/chains.js holds an array of meta event chain objects,
	 * which themselves contain an array of their events.
	 * This is referred to by the variable "C.Chains".
	 */
	Chains: GW2T_CHAIN_DATA,
	// The word and variable "nexus" is simply a chain's index number in the Chains array
	cIndexSynonym: "nexus",
	ChainToday: null,
	CurrentChainSD: {}, NextChainSD1: {}, NextChainSD2: {}, NextChainSD3: {}, NextChainSD4: {},
	CurrentChainHC: {}, NextChainHC1: {}, NextChainHC2: {}, NextChainHC3: {}, NextChainHC4: {},
	CurrentChains: [],
	CurrentChainsSD: [],
	PreviousChains1: [],
	PreviousChains2: [],
	NextChains1: [],
	cChainTitleCharLimit: 30,
	cEventTitleCharLimit: 44,
	cEventNameWidth: 320,
	ScheduledChains: [],
	DryTopChains: [],
	LegacyChains: [],
	TempleChains: [],
	ChainSeriesEnum:
	{
		Temple: 0, // Unscheduled Orr temples
		Legacy: 1, // Unscheduled chains that still gives a rare
		ScheduledCutoff: 1,
		Standard: 2, // Scheduled non-hardcore chains
		Hardcore: 3, // Scheduled challenging chains with a separate schedule from non-hardcores
		DryTop: 4 // Scheduled Dry Top chains
	},
	EventPrimacyEnum:
	{
		Optional: 0, // A failure or optional subevent; includes temple retake event which should be ignored
		Normal: 1, // A concurrent (multiple simultaneous) event that does not take the longest to complete
		Primary: 2, // An only event at the time or a concurrent event that takes the longest to complete
		Boss: 3 // The boss event, also considered a primary event
	},
	isDryTopExpanded: false,
	
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
	
	/*
	 * Refers today's chain object to the calendar's world boss, if available.
	 */
	updateChainToday: function()
	{
		var dayofmonth = (new Date()).getUTCDate();
		var boss = (T.DailyCalendar[dayofmonth].pve[3].split(" "))[0].toLowerCase();
		if (T.ChainAssociation[boss] !== undefined)
		{
			C.ChainToday = C.Chains[T.ChainAssociation[boss]];
		}
		else
		{
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
				(K["WpChain" + i]).addClass("clkWaypointClipDaily");
			}
			else
			{
				(K["WpChain" + i]).removeClass("clkWaypointClipDaily");
			}
		}

		// Chain bar
		$(".chnDaily").hide();
		if (C.ChainToday)
		{
			$("#chnDaily_" + C.ChainToday.nexus).show();
		}
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
	isChainRegular: function(pChain)
	{
		if (pChain.series === C.ChainSeriesEnum.Standard ||
			pChain.series === C.ChainSeriesEnum.Hardcore)
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
	 * Initializes the chain HTML plate with chains and their individual events.
	 * Calculates time sums for chains and pushes to array for later accessing by the ticker.
	 * @param object pChain chain to initialize.
	 */
	initializeChain: function(pChain)
	{
		var i, ii;
		var event;
		var chainextra = "";
		
		if (pChain.series !== C.ChainSeriesEnum.DryTop)
		{
			chainextra = "(" + pChain.extra[0] + ") "
				+ pChain.extra[1] + "<ins class='sixteen sixt_ec'></ins>" + " "
				+ pChain.extra[2] + "<ins class='sixteen sixt_ch'></ins>" + " "
				+ pChain.extra[3] + "<ins class='sixteen sixt_dg'></ins>" + " ";
		}
		
		/*
		 * A chain bar (HTML) is a rectangle that contains the event chain icon,
		 * chain title, time, individual events listed, and other elements.
		 * Lots of CSS IDs and classes here, so update if the CSS changed.
		 */
		$(pChain.htmllist).append(
		"<div id='barChain_" + pChain.nexus + "' class='barChain'>"
			+ "<div class='chnTitle'>"
				+ "<img id='chnIcon_" + pChain.nexus + "' src='img/chain/" + C.parseChainAlias(pChain.alias).toLowerCase() + I.cPNG + "' />"
				+ "<div id='chnCheck_" + pChain.nexus + "' class='chnCheck'></div>"
				+ "<h1 id='chnTitle_" + pChain.nexus + "'>" + C.truncateTitleString(D.getChainTitle(pChain.nexus), C.cChainTitleCharLimit) + "</h1>"
				+ "<time id='chnTime_" + pChain.nexus + "' class='chnTimeFutureFar'></time>"
				+ "<aside><img id='chnDaily_" + pChain.nexus + "' class='chnDaily' src='img/ui/daily.png' /></aside>"
			+ "</div>"
			+ "<div id='chnDetails_" + pChain.nexus + "' class='chnDetails'>"
				+ "<ol id='chnEvents_" + pChain.nexus + "' class='chnEvents'></ol>"
				+ "<div class='chnDetailsExtra'>"
					+ chainextra
					+ "<kbd id='chnDelete_" + pChain.nexus + "' title='Permanently hide this event chain (can undo in Options, Defaults).'>[x]</kbd>"
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
			var eventnamelimit = C.cEventTitleCharLimit;
			var indentEvent = function()
			{
				indentpixel = 12;
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
			"<li id='chnEvent_" + pChain.nexus + "_" + e.num + "' class='chnStep_" + pChain.nexus + "_" + e.step + "' style='margin-left:" + indentpixel +"px'>"
				+ "<ins class='evt_" + e.icon + "' title='" + eventhtmltitle + "'></ins>"
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
		
		/*
		 * Show individual events of a chain bar if clicked on, or
		 * automatically shown by the ticker function.
		 */
		$("#chnTitle_" + pChain.nexus).click(function()
		{
			$(this).parent().next().slideToggle(100);
		});
		$("#chnDetails_" + pChain.nexus).hide();
		
		// Initialize tooltips
		I.qTip.init($("#chnEvents_" + pChain.nexus + " img"));
		I.qTip.init($("#chnDetails_" + pChain.nexus + " kbd"));
		
		// Finally intialize its checklist state
		X.initializeChainChecklist(pChain);
		
	}, // End of initializeChain()
	
	/*
	 * Binds chains list expansion behavior.
	 */
	initializeUI: function()
	{
		/*
		 * Chains list collapsible headers.
		 */
		$("#plateChains header").click(function()
		{
			$(this).next().slideToggle("fast", function()
			{
				// Change the toggle icon after finish toggling
				if ($(this).is(":visible"))
				{
					var container = $(I.cPagePrefix + I.PageEnum.Chains);
					var header = $(this).prev();
					header.find("kbd").html("[-]");
					// Automatically scroll to the clicked header
					I.scrollToElement(header, container, "fast");
					
					// Scroll the map to Dry Top if it is that chain list
					if ($(this).attr("id") === "listChainsDryTop")
					{
						M.goToZone("dry", M.ZoomLevelEnum.Sky);
					}
				}
				else
				{
					$(this).prev().find("kbd").html("[+]");
				}
			});
		});
	   
	   /*
		* Add collapse text icon to headers; first one is pre-expanded.
		*/
		$("#plateChains header:not(:first)").each(function()
		{
			$(this).next().toggle(0);
			$(this).find("kbd").html("[+]");
		});
		$("#plateChains header:first").each(function()
		{
			$(this).find("kbd").html("[-]");
		});

		// Create chain bars for unscheduled chains only when manually expanded the header
		$("#listChainsDryTop").prev().one("click", function()
		{
			P.generateDryTopIcons();
			C.isDryTopExpanded = true;
		});
		$("#listChainsLegacy").prev().one("click", function()
		{
			C.LegacyChains.forEach(C.initializeChain);
			C.LegacyChains.forEach(P.drawChainPaths);
		});
		$("#listChainsTemple").prev().one("click", function()
		{
			C.TempleChains.forEach(C.initializeChain);
			C.TempleChains.forEach(P.drawChainPaths);
		});

		/*
		 * Generate a full timetable of the chains when clicked on that header.
		 */
		$("#headerTimetable").one("click", function(){
		   C.initializeTimetableHTML(); 
		});
	},

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
					chain.htmllist = "#listChainsScheduled";
					C.ScheduledChains.push(chain);
				} break;
				case C.ChainSeriesEnum.Hardcore:
				{
					chain.htmllist = "#listChainsScheduled";
					C.ScheduledChains.push(chain);
				} break;
				case C.ChainSeriesEnum.DryTop:
				{
					chain.htmllist = "#listChainsDryTop";
					C.ScheduledChains.push(chain);
					C.DryTopChains.push(chain);
				} break;
				case C.ChainSeriesEnum.Legacy:
				{
					chain.htmllist = "#listChainsLegacy";
					C.LegacyChains.push(chain);
				} break;
				case C.ChainSeriesEnum.Temple:
				{
					chain.htmllist = "#listChainsTemple";
					C.TempleChains.push(chain);
				} break;
			}

			// Unschedule chains will be initialized when their headers are clicked on
			if (C.isChainScheduled(chain))
			{
				C.initializeChain(chain);
			}
		}
		
		C.initializeUI();
		// Initialize today's chain shortcut object
		C.updateChainToday();
		// Initial recoloring of chain titles
		$("#listChainsScheduled .barChain h1, #listChainsDryTop .barChain h1")
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
	 * Updates a chain bar's time tooltip with a pre-sorted subschedule.
	 * @pre scheduleKeys array is sorted and first element is the soonest.
	 */
	updateChainTimeTooltipHTML: function(pChain)
	{
		// Update the title tootlip with that chain's schedule
		var minischedulestring = "";
		var spacer;
		var subscribetext = "<dfn>" + D.getSentence("subscribe") + "?</dfn><br />";
		if (pChain.series === C.ChainSeriesEnum.DryTop)
		{
			subscribetext = "";
		}
		for (var ii in pChain.scheduleKeys)
		{
			spacer = (parseInt(ii) === 0) ? subscribetext : " <br /> ";
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
		var sign = "⇑ ";
		
		if (pChain.series === C.ChainSeriesEnum.DryTop)
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
		var chaintab = "";
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
					switch (ithchain.series)
					{
						case C.ChainSeriesEnum.DryTop: chaintab = "#listChainsDryTop"; break;
						default: chaintab = "#listChainsScheduled";
					}
					$("#barChain_" + ithchain.nexus).appendTo(chaintab);
					
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
			if (C.isChainUnchecked(ithchain))
			{
				if ((ithchain.series === C.ChainSeriesEnum.DryTop && O.Options.bol_expandDT)
					|| (ithchain.series !== C.ChainSeriesEnum.DryTop && O.Options.bol_expandWB))
				{
					$("#chnDetails_" + ithchain.nexus).show("fast");
				}
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
			if (O.Options.bol_collapseChains)
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
		if (pChain.series === C.ChainSeriesEnum.DryTop && C.isDryTopExpanded)
		{
			for (i in pChain.events)
			{
				event = pChain.events[i];
				event.eventicon._icon.style.display = "none";
				event.eventring._icon.style.display = "none";
			}
			M.DryTopEventActive = null;
			M.DryTopEventActive = new Array();
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
				if (pChain.series === C.ChainSeriesEnum.DryTop && C.isDryTopExpanded)
				{
					event = pChain.events[$(this).attr("data-eventindex")];
					// Add active events to iterable array
					M.DryTopEventActive.push(event.eventicon);
					M.DryTopEventActive.push(event.eventring);
					
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
					$(".chnStep_" + pChain.nexus + "_" + i).show()
						.removeClass("chnEventCurrent").addClass("chnEventFuture");
				}
			}
			
			// Tour to the event on the map if opted
			if (O.Options.bol_tourPrediction && !O.Options.bol_followCharacter
				&& I.PageCurrent === I.PageEnum.Chains
				&& M.isMapAJAXDone && C.isChainUnchecked(pChain) && isregularchain
				&& $("#listChainsDryTop").is(":visible") === false)
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
					D.speak(D.getChainPronunciation(pChain) + " " + D.getSpeech("arrival") + " " + D.getSpeech("predicted"));
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
			
			// Also unsubscribe if opted
			if (O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription && I.isProgramLoaded &&
				O.Options.bol_alertUnsubscribe && isregularchain && C.isChainSubscribed(pChain))
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
		var hour = T.getTimeOffsetSinceMidnight(T.ReferenceEnum.Local, T.UnitEnum.Hours);
		
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
 * @@Map of Tyria and map control
 * ========================================================================== */
M = {
	/*
	 * http://gw2timer.com/data/zones.js contains zone (e.g. Queensdale, LA) objects
	 * with their rectangular coordinates.
	 * This is referred to by the variable "M.Zones".
	 */
	Zones: GW2T_ZONE_DATA,
	ZoneAssociation: GW2T_ZONE_ASSOCIATION, // This contains API zone IDs that associates with regular world zones
	Regions: GW2T_REGION_DATA,
	cInitialZone: "lion",
	Map: {},
	Events: {},
	Resources: {},
	Collectibles: {},
	ZoneCurrent: {},
	currentIconSize: 32,
	currentRingSize: 256,
	cICON_SIZE_STANDARD: 32,
	cRING_SIZE_MAX: 256,
	isMapInitialized: false,
	isMouseOnHUD: false,
	isMapAJAXDone: false,
	isAPIRetrieved_MAPFLOOR: false,
	isMappingIconsGenerated: false,
	isEventIconsGenerated: false,
	cLEAFLET_PATH_OPACITY: 0.5,
	cMAP_BOUND: 32768, // The map is a square
	cMAP_CENTER: [16384, 16384],
	cMAP_MOUSEMOVE_RATE: 100,
	cInertiaThreshold: 100, // Milliseconds between drag and release to flick pan
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
	
	/*
	 * All objects in the map (such as paths and markers) shall be called "entities".
	 * Markers can have custom properties assigned; they can be accessed using
	 * "THEMARKER.options.THEPROPERTY" format.
	 */
	PinPersonal: {},
	PinProgram: {},
	PinEvent: {},
	PinOver: {},
	PinCharacter: {},
	PinCamera: {},
	MappingEnum:
	{
		Sector: 0,
		Waypoint: 1,
		Landmark: 2,
		Vista: 3,
		Skill: 4,
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
		Skill: "skill_challenges",
		Heart: "tasks"
	},
	// Utility pin markers, looks like GW2 personal waypoints
	PinEntities: new Array(),
	DailyEntities: new Array(),
	JPEntities: new Array(),
	ChainPathEntities: new Array(),
	// AJAX generated sections' icons must be set to false
	isIconsGeneratedForDaily: true,
	isIconsGeneratedForResource: false,
	isIconsGeneratedForJP: true,
	isIconsGeneratedForCollectible: false,
	// Boolean to display map page icons
	isShowingIconsForDaily: true,
	isShowingIconsForResource: false,
	isShowingIconsForJP: true,
	isShowingIconsForCollectible: false,
	
	// Submap for showing maps that aren't in the API (actually Leaflet markers)
	SubmapEntities: new Array(),
	SubmapTemp: {},
	
	// Dry Top event icons and event rings map entities
	DryTopEventIcons: new Array(),
	DryTopEventRings: new Array(),
	DryTopEventActive: new Array(),
	
	/*
	 * Tells if the specified zone exists within the listing.
	 * @param string pZoneID to look up.
	 * @returns true if exists.
	 */
	isZoneValid: function(pZoneID)
	{
		if (M.ZoneAssociation[pZoneID] === undefined)
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
		return M.Zones[M.ZoneAssociation[pZoneID]];
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
	 * Gets a region's translated name if available.
	 * @param string pNick name of the region to retrieve.
	 * @returns string region name.
	 */
	getRegionName: function(pNick)
	{
		var region = M.Regions[pNick];
		if (D.isLanguageSecondary() === true)
		{
			return region[D.getFullySupportedLanguage()];
		}
		else
		{
			return region[O.OptionEnum.Language.Default];
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
			inertiaThreshold: M.cInertiaThreshold,
			doubleClickZoom: false,
			touchZoom: false, // Disable pinch to zoom
			zoomControl: I.isOnSmallDevice, // Hide the zoom UI
			attributionControl: false, // Hide the Leaflet link UI
			crs: L.CRS.Simple
		}).setView([-128, 128], M.ZoomLevelEnum.Default);
		// Because the map will interfere with scrolling the website on touch devices
		M.Map.touchZoom.disable();
		if (M.Map.tap)
		{
			M.Map.tap.disable();
		}
		
		// Set tile
		L.tileLayer(U.URL_API.TilesTyria,
		{
			continuousWorld: true
		}).addTo(M.Map);
		
		// Initialize array in zones to later hold world completion and dynamic event icons
		for (var i in M.Zones)
		{
			M.Zones[i].ZoneEntities = new Array();
			M.Zones[i].center = M.getZoneCenter(i);
			M.Zones[i].nick = i;
		}
		M.ZoneCurrent = M.Zones[M.cInitialZone];
		
		// Do other initialization functions
		M.bindHUDEventCanceler();
		P.generateSubmaps();
		P.populateMap();
		C.ScheduledChains.forEach(P.drawChainPaths)
		
		if ( ! I.isOnSmallDevice)
		{
			/*
			 * Clicking an empty place on the map highlight its coordinate.
			 */
			M.Map.on("click", function(pEvent)
			{
				if (M.isMouseOnHUD) { return; }
				var coord = M.convertLCtoGC(pEvent.latlng);
				$("#mapCoordinatesCopy")
					.val("[" + coord[0] + ", " + coord[1] + "]")
					.select();
			});

			/*
			 * Move the personal pin marker to where the user double clicks.
			 */
			M.Map.on("dblclick", function(pEvent)
			{
				if (M.isMouseOnHUD) { return; }
				M.PinPersonal.setLatLng(pEvent.latlng);
			});
		}
		
		/*
		 * Go to the coordinates in the bar when user presses enter.
		 */
		$("#mapCoordinatesCopy").onEnterKey(function()
		{
			var coord = M.parseCoordinates($(this).val());
			coord[0] = Math.floor(coord[0]);
			coord[1] = Math.floor(coord[1]);
			$("#mapCoordinatesCopy")
				.val("[" + coord[0] + ", " + coord[1] + "]")
				.select();
			
			if (coord[0] !== "" && coord.length === 2)
			{
				M.goToView(coord, M.PinPersonal);
			}
		});
		
		/*
		 * Bind map HUD buttons functions.
		 */
		$("#mapGPSButton").click(function()
		{
			// Go to character if cliked on GPS button.
			M.goToPlayer(true);
		});
		$("#mapDisplayButton").click(function()
		{
			// Hide the right panel if click on the display button.
			if (I.ModeCurrent !== I.ModeEnum.Mobile)
			{
				$("#panelRight").toggle();
				M.refreshMap();
			}
			else
			{
				document.location = "./";
			}
		});
		$("#mapCompassButton").one("mouseenter", M.bindZoneList).click(function()
		{
			// Translate and bind map zones list
			M.goToDefault();
		});
		
		// Finally
		M.isMapInitialized = true;
	},
	
	/*
	 * Informs Leaflet that the map pane was resized so it can load tiles properly.
	 */
	refreshMap: function()
	{
		if (M.isMapInitialized)
		{
			M.Map.invalidateSize();
		}
	},
	
	/*
	 * Turns a boolean on when mouse entered any GUI elements on the map, so
	 * map event handlers can ignore actions on those elements.
	 */
	bindHUDEventCanceler: function()
	{
		$("#paneHUDMap").hover(
			function() { M.isMouseOnHUD = true; },
			function() { M.isMouseOnHUD = false; }
		);
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
			if (M.isMouseOnHUD) { return; }
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
			M.adjustZoomDryTop();
		});
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
		if (pCoord[0] >= M.ZoneCurrent.rect[0][0] // x1
			&& pCoord[1] >= M.ZoneCurrent.rect[0][1] // y1
			&& pCoord[0] <= M.ZoneCurrent.rect[1][0] // x2
			&& pCoord[1] <= M.ZoneCurrent.rect[1][1]) // y2
		{
			return;
		}
		
		// Else search for new moused zone
		var i, ii1, ii2;
		var previouszone = M.ZoneCurrent.nick;
		var zonename = "";
		var entity;
		var entitytype;
		
		for (i in M.Zones) // i is the index and nickname of the zone
		{
			if (pCoord[0] >= M.Zones[i].rect[0][0]
				&& pCoord[1] >= M.Zones[i].rect[0][1]
				&& pCoord[0] <= M.Zones[i].rect[1][0]
				&& pCoord[1] <= M.Zones[i].rect[1][1])
			{
				// Hide the icons of the previously moused zone
				for (ii1 in M.Zones[previouszone].ZoneEntities)
				{
					M.Zones[previouszone].ZoneEntities[ii1]
						._icon.style.display = "none";
				}
				// Update current zone object
				M.ZoneCurrent = M.Zones[i];
				zonename = M.getZoneName(M.ZoneCurrent);
				document.getElementById("mapCoordinatesName")
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
						|| (entitytype === M.MappingEnum.Sector && O.Options.bol_displaySectors)
						|| (entitytype === M.MappingEnum.EventIcon && O.Options.bol_displayEvents)
						|| (entitytype === M.MappingEnum.EventRing && O.Options.bol_displayEvents))
					{
						entity._icon.style.display = "block";
					}
				}

				// Rescale current moused mapping markers
				M.adjustZoomMapping();
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
		var currentcoord = M.ZoneCurrent.center;
		M.showCurrentZone(M.getZoneCenter("dry"));
		M.showCurrentZone(M.getZoneCenter("rata"));
		M.showCurrentZone(currentcoord);
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
	 * Gets the center coordinates of an event.
	 * @param object pEvent an event from event_details.json
	 * @returns array of x and y coordinates.
	 * @pre map_floor.json was extracted to the M.Zones object.
	 */
	getEventCenter: function(pEvent)
	{
		var zone = M.getZoneFromID(pEvent.map_id);
		var p = pEvent.location.center; // 3D float array

		return M.convertEventCoord(p, zone);
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
		var waypointsize, landmarksize, eventiconsize, eventringsize;
		var sectorfontsize, sectoropacity;
		
		switch (currentzoom)
		{
			case 7: waypointsize = 40; landmarksize = 32; eventiconsize = 32; eventringsize = 256; break;
			case 6: waypointsize = 32; landmarksize = 24; eventiconsize = 24; eventringsize = 128; break;
			case 5: waypointsize = 26; landmarksize = 16; eventiconsize = 16; eventringsize = 64; break;
			case 4: waypointsize = 20; landmarksize = 12; eventiconsize = 12; eventringsize = 32; break;
			case 3: waypointsize = 16; landmarksize = 0; eventiconsize = 0; eventringsize = 0; break;
			default: { waypointsize = 0; landmarksize = 0; eventiconsize = 0; eventringsize = 0; }
		}
		
		switch (currentzoom)
		{
			case 7: sectorfontsize = "28px"; sectoropacity = 0.9; break;
			case 6: sectorfontsize = "20px"; sectoropacity = 0.6; break;
			case 5: sectorfontsize = "16px"; sectoropacity = 0.3; break;
			default: { sectorfontsize = "0px"; sectoropacity = 0; }
		}

		// Resize mapping icons in moused zone
		for (i in M.ZoneCurrent.ZoneEntities)
		{
			entity = M.ZoneCurrent.ZoneEntities[i];
			switch (entity.options.mappingtype)
			{
				case M.MappingEnum.Waypoint:
				{
					M.changeMarkerIcon(entity, U.URL_IMG.Waypoint, waypointsize);
				} break;
				
				case M.MappingEnum.Landmark:
				{
					M.changeMarkerIcon(entity, U.URL_IMG.Landmark, landmarksize);
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
					M.changeMarkerIcon(entity, U.URL_IMG.Vista, landmarksize);
				} break;
				
				case M.MappingEnum.Skill:
				{
					M.changeMarkerIcon(entity, U.URL_IMG.Skill, landmarksize);
				} break;
				
				case M.MappingEnum.Heart:
				{
					M.changeMarkerIcon(entity, U.URL_IMG.Heart, landmarksize);
				} break;
				
				case M.MappingEnum.Sector:
				{
					entity._icon.style.fontSize = sectorfontsize;
					entity._icon.style.opacity = sectoropacity;
					entity._icon.style.zIndex = M.cZIndexBury + 1; // Don't cover other icons
					if (O.Options.bol_displaySectors)
					{
						entity._icon.style.display = "table"; // For middle vertical alignment
					}
				} break;
				
				case M.MappingEnum.EventIcon:
				{
					M.changeMarkerIcon(entity, entity._icon.src, eventiconsize);
					entity._icon.style.zIndex = 1000;
				} break;
				
				case M.MappingEnum.EventRing:
				{
					M.changeMarkerIcon(entity, entity._icon.src, eventringsize);
					entity._icon.style.zIndex = -10000;
				} break;
			}
		}
		M.burySubmaps();
	},
	
	/*
	 * Resizes Dry Top markers and submaps so they scale with the current zoom level.
	 */
	adjustZoomDryTop: function()
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
		
		// Resize Dry Top event icons
		if (M.DryTopEventIcons.length > 0)
		{
			// Event icons are same size as waypoints, but their rings are bigger
			M.currentRingSize = M.scaleDimension(M.cRING_SIZE_MAX);

			for (i in M.DryTopEventIcons)
			{
				icon = M.DryTopEventIcons[i];
				M.changeMarkerIcon(icon, icon._icon.src, M.currentIconSize);
				icon = M.DryTopEventRings[i];
				M.changeMarkerIcon(icon, icon._icon.src, M.currentRingSize);
				// Don't make the rings overlap clickable waypoints
				M.DryTopEventIcons[i]._icon.style.zIndex = 1000;
				M.DryTopEventRings[i]._icon.style.zIndex = 1;
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
	 * Moves a pin to a map coordinate.
	 * @param object pPin to move.
	 * @param 2D array pCoord coordinates.
	 */
	movePin: function(pPin, pCoord)
	{
		if (pCoord === undefined)
		{
			pCoord = [0,0];
		}
		pPin.setLatLng(M.convertGCtoLC(pCoord));
		pPin._icon.style.zIndex = M.cZIndexRaise;
	},
	
	/*
	 * Views the map at the specifications.
	 * @param 2D array pCoord coordinates.
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
			M.movePin(pPin, pCoord);
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
	 * Views the map at the zone.
	 * @param string pNick of the zone.
	 * @param enum pZoom level.
	 */
	goToZone: function(pNick, pZoom)
	{
		var coord = M.getZoneCenter(pNick);
		M.showCurrentZone(coord);
		M.goToView(coord, null, pZoom);
	},
	
	/*
	 * Views the map at the player's position in game, as directed by the overlay.
	 * @param boolean pForce to view character regardless of options.
	 */
	goToPlayer: function(pForce)
	{
		// Verify the GPS coordinates
		if (GPSPositionArray === undefined || GPSPositionArray === null || GPSPositionArray.length !== 3)
		{
			return;
		}
		/*
		 * Sample structure of JSON:
		 * {"name": "Character Name","profession": 1,"map_id": 38,"world_id": 1234567890,"team_color_id": 9,"commander": false}
		 */
		if (GPSIdentityJSON === undefined || GPSIdentityJSON === null)
		{
			return;
		}
		if ( ! M.isZoneValid(GPSIdentityJSON["map_id"]))
		{
			M.movePin(M.PinCharacter);
			M.movePin(M.PinCamera);
			return;
		}
		
		var coord = M.convertPlayerCoord(GPSPositionArray, GPSIdentityJSON["map_id"]);
		if (coord[0] > M.cMAP_BOUND || coord[0] <= 0
			|| coord[1] > M.cMAP_BOUND || coord[1] <= 0)
		{
			return;
		}
		
		// Follow character if opted
		if (O.Options.bol_followCharacter || pForce)
		{
			M.goToView(coord, null, M.Map.getZoom());
		}
		
		// Pin character if opted
		if (O.Options.bol_displayCharacter)
		{
			M.movePin(M.PinCharacter, coord);
			M.movePin(M.PinCamera, coord);
			M.PinCamera._icon.style.zIndex = M.cZIndexBury;
		}
		var angleplayer = -(M.convertPlayerAngle(GPSDirectionArray));
		var anglecamera = -(M.convertPlayerAngle(GPSCameraArray));
		var pintransplayer = M.PinCharacter._icon.style.transform.toString();
		var pintranscamera = M.PinCamera._icon.style.transform.toString();
		if (pintransplayer.indexOf("rotate") === -1)
		{
			M.PinCharacter._icon.style.transform = pintransplayer + " rotate(" + angleplayer + "deg)";
		}
		if (pintranscamera.indexOf("rotate") === -1)
		{
			M.PinCamera._icon.style.transform = pintranscamera + " rotate(" + anglecamera + "deg)";
		}
	},
	
	/*
	 * Views the default view.
	 */
	goToDefault: function()
	{
		M.Map.setView(M.convertGCtoLC(M.cMAP_CENTER), M.ZoomLevelEnum.Default);
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
		var i;
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
				for (i in M.Zones)
				{
					if (zone.indexOf(i) !== -1)
					{
						M.goToView(M.getZoneCenter(i), null, M.ZoomLevelEnum.Bird);
						break;
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
	convertPlayerCoord: function(pPos, pZoneID)
	{
		var zone = M.getZoneFromID(pZoneID);
		var coord = new Array(3);
		coord[0] = pPos[0] * M.cMETER_TO_INCH; // x coordinate
		coord[1] = pPos[2] * M.cMETER_TO_INCH; // y coordinate
		coord[2] = pPos[1] * M.cMETER_TO_INCH; // z coordinate
		return M.convertEventCoord(coord, zone);
	},
	
	/*
	 * Converts a MumbleLink unit circle values to degrees of rotation.
	 * @param 3D array pVector [cos(t), unused, sin(t)].
	 * @returns int degrees.
	 */
	convertPlayerAngle: function(pVector)
	{
		var x = pVector[0];
		var y = pVector[2];
		if (y >= 0)
		{
			// Quadrant I and II
			return ~~(Math.acos(x) * M.cRADIAN_TO_DEGREE);
		}
		else
		{
			// Quadrant III and IV
			return ~~(M.cCIRCLE_FULL_DEGREE - Math.acos(x) * M.cRADIAN_TO_DEGREE);
		}
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
		var coordstring = pElement.attr("data-coord");
		if (M.Zones[coordstring])
		{
			return M.getZoneCenter(coordstring);
		}
		return M.parseCoordinates(coordstring);
	},
	
	/*
	 * Binds map view event handlers to all map links (dfn tag reserved) in the
	 * specified container.
	 * @param string pContainer element ID.
	 */
	bindMapLinks: function(pContainer)
	{
		$(pContainer + " dfn").each(function()
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
			M.movePin(M.PinOver, thiscoord);
		});
		pLink.mouseout(function()
		{
			M.movePin(M.PinOver);
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
		$("#mapZoneList li").each(function()
		{
			var zonenick = $(this).attr("data-zone");
			$(this).text(M.getZoneName(zonenick));
			$(this).attr("data-coord", M.getZoneCenter(zonenick).toString());
			M.bindMapLinkBehavior($(this), null, M.ZoomLevelEnum.Sky);
		});
		$("#mapZoneList h2").each(function()
		{
			var regionnick = $(this).attr("data-region");
			$(this).text(M.getRegionName(regionnick));
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
	},
	
	/*
	 * Executes GPS functions every specified milliseconds.
	 */
	tickGPS: function()
	{
		if (O.Options.bol_followCharacter || O.Options.bol_displayCharacter)
		{
			M.goToPlayer();
			window.clearTimeout(M.GPSTimeout);
			M.GPSTimeout = setTimeout(M.tickGPS, O.Options.int_msecGPSRefresh);
		}
	}
	
};

/* =============================================================================
 * @@Populate map functions and Map page generation
 * ========================================================================== */
P = {
	
	/*
	 * Create submaps that are giant markers with an image of a map area.
	 * Used for temporary zones that haven't been put in the API tileset.
	 */
	generateSubmaps: function()
	{
		//M.SubmapTemp = P.createSubmap([2048, 1536], [3713, 15681], "http://i.imgur.com/nB9kM3O.jpg");
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
	 * @param 2D array pDimension width and height of pin.
	 * @returns object Leaflet marker.
	 */
	createPin: function(pIconURL, pDimension)
	{
		if (pDimension === undefined)
		{
			pDimension = [32, 32];
		}
		return L.marker(M.convertGCtoLC([0,0]),
		{
			icon: L.icon(
			{
				iconUrl: pIconURL,
				iconSize: pDimension,
				iconAnchor: [(pDimension[0])/2, (pDimension[1])/2]
			}),
			draggable: true
		}).addTo(M.Map);
	},
	
	/*
	 * Generates map waypoints and other markers from the GW2 server API files.
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
		$.getJSON(U.URL_API.MapFloorTyria, function(pData)
		{
			var i;
			var regionid, region, zoneid, ithzone, poi;
			var zoneobj;
			var nameinlang = "name_" + D.getFullySupportedLanguage();
			var issecondarylang = D.isLanguageSecondary();
			var numofpois;
			var mappingentity;
			var icon;
			var cssclass;
			var mappingtype;
			var tooltip;

			for (regionid in pData.regions)
			{
				region = pData.regions[regionid];

				for (zoneid in region.maps)
				{
					// Don't bother parsing if not a regular world zone
					if ( ! M.ZoneAssociation[zoneid])
					{
						continue;
					}
					
					ithzone = region.maps[zoneid];
					zoneobj = M.getZoneFromID(zoneid);
					// Remember zone name
					if (issecondarylang)
					{
						zoneobj[nameinlang] = ithzone.name;
					}
					// Store zone dimension data for locating events
					zoneobj.map_rect = ithzone.map_rect;
					zoneobj.continent_rect = ithzone.continent_rect;
					
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
							case M.APIPOIEnum.Waypoint:
							{
								// Waypoints are always created, others are optional
								mappingtype = M.MappingEnum.Waypoint;
								icon = U.URL_IMG.Waypoint;
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
								icon = U.URL_IMG.Landmark;
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
								icon = U.URL_IMG.Vista;
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
							link: U.getChatlinkFromPoiID(poi.poi_id)
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
									this._icon.src = U.URL_IMG.Waypoint;
								});
								mappingentity.on("mouseover", function()
								{
									this._icon.src = U.URL_IMG.WaypointOver;
								});
							} break;
							case "landmark":
							{
								mappingentity.on("mouseout", function()
								{
									this._icon.src = U.URL_IMG.Landmark;
								});
								mappingentity.on("mouseover", function()
								{
									this._icon.src = U.URL_IMG.LandmarkOver;
								});
							} break;
						}
						// Clicking on waypoints or POIs gives a chatcode
						if (poi.type === "waypoint" || poi.type === "landmark")
						{
							mappingentity.on("click", function()
							{
								$("#mapCoordinatesCopy").val(this.options.link).select();
								$("#mapCoordinatesName").val(this.options.entityname);
							});
							M.bindMappingZoomBehavior(mappingentity, "dblclick");
						}
						else
						{
							M.bindMappingZoomBehavior(mappingentity, "click");
						}
						
						// Assign the waypoint to its zone
						zoneobj.ZoneEntities.push(mappingentity);
					}
					
					/*
					 * For API separate arrays for pois.
					 */
					if (O.Options.bol_showWorldCompletion)
					{
						// Skill Challenges
						numofpois = ithzone.skill_challenges.length;
						for (i = 0; i < numofpois; i++)
						{
							poi = ithzone.skill_challenges[i];
							mappingentity = L.marker(M.convertGCtoLC(poi.coord),
							{
								title: "<span class='" + "mapPoi" + "'>" + D.getPhrase("Skill Challenge") + "</span>",
								mappingtype: M.MappingEnum.Skill,
								icon: L.icon(
								{
									iconUrl: U.URL_IMG.Skill,
									iconSize: [16, 16],
									iconAnchor: [8, 8]
								})
							}).addTo(M.Map);
							mappingentity._icon.style.display = "none";
							M.bindMappingZoomBehavior(mappingentity, "click");
							zoneobj.ZoneEntities.push(mappingentity);
						}
						
						// Renown Hearts
						numofpois = ithzone.tasks.length;
						for (i = 0; i < numofpois; i++)
						{
							poi = ithzone.tasks[i];
							mappingentity = L.marker(M.convertGCtoLC(poi.coord),
							{
								title: "<span class='" + "mapPoi" + "'>" + poi.objective + " (" + poi.level + ")" + "</span>",
								task: poi.objective,
								mappingtype: M.MappingEnum.Heart,
								icon: L.icon(
								{
									iconUrl: U.URL_IMG.Heart,
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
								U.openExternalURL(U.getWikiLanguageLink(heartname));
							});
							zoneobj.ZoneEntities.push(mappingentity);
						}
						
						// Sector Names
						numofpois = ithzone.sectors.length;
						for (i = 0; i < numofpois; i++)
						{
							poi = ithzone.sectors[i];
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
							zoneobj.ZoneEntities.push(mappingentity);
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
		
		/*
		 * Create pin markers that can be moved by user or program.
		 * ---------------------------------------------------------------------
		 */
		M.PinPersonal = P.createPin("img/map/pin_white.png");
		M.PinProgram = P.createPin("img/map/pin_blue.png");
		M.PinEvent = P.createPin("img/map/pin_green.png");
		M.PinOver = P.createPin("img/map/pin_over.png", [128,128]);
		M.PinCharacter = P.createPin("img/map/pin_character.png", [40,40]);
		M.PinCamera = L.marker(M.convertGCtoLC([0,0]),
		{
			icon: L.icon(
			{
				iconUrl: "img/map/pin_camera.png",
				iconSize: [256,256],
				iconAnchor: [128,128]
			}),
			clickable: false,
		}).addTo(M.Map);
		
		// Add to array for iteration
		M.PinEntities.push(M.PinPersonal);
		M.PinEntities.push(M.PinProgram);
		M.PinEntities.push(M.PinEvent);
		M.PinEntities.push(M.PinOver);
		M.PinEntities.push(M.PinCharacter);
		M.PinEntities.push(M.PinCamera);
		
		// Bind pin click event to get coordinates in the coordinates bar
		for (var i in M.PinEntities)
		{
			M.PinEntities[i].on("click", function()
			{
				var coord = M.convertLCtoGC(this.getLatLng());
				$("#mapCoordinatesCopy")
					.val("[" + coord[0] + ", " + coord[1] + "]")
					.select();
			});
			M.PinEntities[i].on("dblclick", function()
			{
				M.movePin(this);
			});
		}	
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
				pName.indexOf("skill") !== -1 || // Skill challenges
				pName.indexOf("offshoot") !== -1 || // Obsolete Living Story events
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
				M.Events[(pData[i].id)] = {};
				M.Events[(pData[i].id)].name = pData[i].name;
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
				var mappingentity;
				var coord;

				var zoneobj;

				for (i in pDataInner.events)
				{
					event = pDataInner.events[i];
					searchname = event.name.toLowerCase();
					newname = (M.Events[i] !== undefined) ? M.Events[i].name : event.name;
					zoneobj = M.getZoneFromID(event.map_id);
					// Skip iterated event if...
					if (M.Events[i] === undefined // Event is not in event_names.json also
						|| zoneobj === undefined // Event is not in a world map zone
						|| isEventUnwanted(searchname) // Event is obsolete
						|| event.map_id === 988 // Ignore Dry Top
						|| event.map_id === 50) // LA
					{
						continue;
					}

					coord = M.convertGCtoLC(M.getEventCenter(event));

					// Create event's ring
					mappingentity = L.marker(coord,
					{
						clickable: false,
						mappingtype: M.MappingEnum.EventRing,
						icon: L.icon(
						{
							iconUrl: determineEventRing(event),
							iconSize: [256, 256],
							iconAnchor: [128, 128]
						})
					}).addTo(M.Map);
					mappingentity._icon.style.display = "none";
					zoneobj.ZoneEntities.push(mappingentity);

					// Create event's icon
					mappingentity = L.marker(coord,
					{
						title: "<span class='" + "mapPoi" + "'>" + newname + " (" + event.level + ")" + "</span>",
						mappingtype: M.MappingEnum.EventIcon,
						icon: L.icon(
						{
							iconUrl: determineEventIcon(searchname),
							iconSize: [48, 48],
							iconAnchor: [24, 24]
						})
					}).addTo(M.Map);
					mappingentity._icon.style.display = "none";
					M.bindMappingZoomBehavior(mappingentity, "click");
					zoneobj.ZoneEntities.push(mappingentity);
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
		/*
		 * Start tooltip plugin after the markers were loaded, because it
		 * reads the title attribute and convert them into a div "tooltip".
		 */
		I.qTip.init(".leaflet-marker-icon");
		
		if (O.Options.bol_tourPrediction && !O.Options.bol_followCharacter
			&& I.PageCurrent === I.PageEnum.Chains
			&& U.Args[U.KeyEnum.Go] === undefined)
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
		M.bindMapVisualChanges();
		M.adjustZoomMapping();
		M.adjustZoomDryTop();
		M.goToURLCoords();
		M.tickGPS();
	},
	
	/*
	 * Creates polylines for the map based on event's path data, then add event
	 * coordinates to the event names HTML so the map views the location when
	 * user clicks on it. Also creates icons for Dry Top events.
	 */
	drawChainPaths: function(pChain)
	{
		var i;
		var event, primaryevent;
		var color;
		var coords;
		
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
			M.ChainPathEntities.push(L.polyline(coords, {color: color}).addTo(M.Map));
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
					M.bindMapLinkBehavior($(this), M.PinEvent);
				}
			});
		}
	},
	
	/*
	 * Creates event icons for Dry Top chains, they will be resized by the zoomend function
	 */
	generateDryTopIcons: function()
	{
		var i, ii;
		var chain, event;
		for (i in C.DryTopChains)
		{
			chain = C.DryTopChains[i];
			for (ii in chain.events)
			{
				event = chain.events[ii];
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
				if ( ! $("#chnEvent_" + chain.nexus + "_" + event.num).hasClass("chnEventCurrent"))
				{
					event.eventring._icon.style.display = "none";
					event.eventicon._icon.style.display = "none";
				}
				M.DryTopEventRings.push(event.eventring);
				M.DryTopEventIcons.push(event.eventicon);
			}
		}
		I.qTip.init(".leaflet-marker-icon");
	},
	
	/*
	 * Initializes Login Rewards track and Dailies Calendar.
	 */
	generateAndInitializeDailies: function()
	{
		// Adjust the squares progress
		P.shiftLoginTrack();
		// Bind click squares behavior
		$("#lgnTrack ins").each(function()
		{
			$(this).click(function(){
				P.shiftLoginValue(parseInt($(this).data("i")));
			}).mouseenter(function()
			{
				$("#lgnRecordHover").text("(" + (parseInt($(this).data("i")) + 1) + ")");
			});
		});
		$("#lgnTrack").mouseleave(function()
		{
			$("#lgnRecordHover").text("");
		});
		
		$("#mapToggle_Daily").click(function()
		{
			M.isShowingIconsForDaily = !(M.isShowingIconsForDaily);
			M.setEntityGroupDisplay(M.DailyEntities, M.isShowingIconsForDaily);
		});
		
		I.qTip.init("#lgnTrack ins");
		
		// Generate dailies calendar
		P.regenerateDailiesCalendar();
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
		P.shiftLoginTrack();
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
			P.insertDailyDay(T.DailyCalendar[dayofmonth], ithdate);
		}
		
		$("#dlyCalendar div:first").addClass("dlyCurrent").next().addClass("dlyNext");
		$("#dlyCalendar .dlyEvent").each(function()
		{
			M.bindMapLinkBehavior($(this), null, M.ZoomLevelEnum.Sky);
		});
		I.qTip.init("#dlyCalendar ins");
	},
	
	/*
	 * Inserts a "day" div into the dailies calendar.
	 * @param object pDaily daily object from zones.js
	 * @param object pDate of the day.
	 */
	insertDailyDay: function(pDaily, pDate)
	{
		var pve, pvp, wvw; // Daily types
		var gather, activity, boss; // Regional dailies
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
		eventregion = "<ins class='dlyRegion dly_region_" + (M.Zones[(pve[2]).toLowerCase()])["region"] + "'>";
		if (boss[0] === "Fractal")
		{
			bosssrc = "dly_pve_" + boss[0].toLowerCase() + "_" + boss[1];
		}
		else
		{
			bosssrc = "dly_pve_boss";
			bossregion = "<ins class='dlyRegion dly_region_" + boss[1].toLowerCase() + "'>";
			bossregionclose = "</ins>";
			bosshtml = "<em><img src='img/chain/" + boss[0].toLowerCase() + I.cPNG + "' /></em>";
		}
		
		switch (pDate.getUTCDay())
		{
			case 0: dayclass = "dlySunday"; break;
			case 6: dayclass = "dlySaturday"; break;
		}

		// Generate HTML
		$("#dlyCalendar").append("<div>"
			// Day
			+ "<aside></aside>" + bosshtml + "<var class='" + dayclass + "'>" + pDate.getUTCDate() + "</var>"
			// PvE
			+ "<span><ins class='dly_daily_pve'></ins>"
			+ gatherregion + "<ins class='dly_pve_" + gather[0].toLowerCase() + "' title='" + pve[0] + "'></ins>" + gatherregionclose
			+ activityregion + "<ins class='dly_pve_" + activity[0].toLowerCase() + "' title='" + pve[1] + "'></ins>" + activityregionclose
			+ eventregion + "<ins class='dly_pve_event dlyEvent curZoomable' title='" + pve[2] + " Events'"
				+ "data-coord='" + (pve[2]).toLowerCase() + "'></ins>" + eventregionclose
			+ bossregion + "<ins class='" + bosssrc + "' title='" + pve[3] + "'></ins>" + bossregionclose + "</span>"
			// PvP
			+ "<span><ins class='dly_daily_pvp'></ins>"
			+ "<ins class='dly_pvp_" + pvp[0].toLowerCase() + "' title='" + pvp[0] + "'></ins>"
			+ "<ins class='dly_pvp_" + pvp[1].toLowerCase() + "' title='" + pvp[1] + "'></ins>"
			+ "<ins class='dly_pvp_" + pvp[2].toLowerCase() + "' title='" + pvp[2] + "'></ins>"
			+ "<ins class='dly_pvp_" + pvp[3].toLowerCase() + "' title='" + pvp[3] + "'></ins></span>"
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
	generateAndInitializeResourceNodes: function()
	{
		$.getScript(U.URL_DATA.Resource).done(function(){
		
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
		
		// Reinitialize show icons boolean
		M.displayIcons("Resource", true);
		
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
				+ U.getYouTubeLink(term + " " + I.cGameNick) + "' target='_blank'>[Y]</a> <a href='"
				+ U.getWikiLink(term) + "' target='_blank'>[W]</a></cite>");
			M.bindMapLinkBehavior($(this), null);
			
			// Make checkboxes
			$(this).after("<label><input type='checkbox' id='mapJPCheck_" + U.getSubstringFromHTMLID($(this)) + "' /></label>");
		});
		U.convertExternalLink(".mapJPList a");
		
		// Initialize localStorage
		X.initializeChecklist(X.Checklists.JP, X.Checklists.JP.length);
		
		// Count completed JPs function
		var updateJPCount = function()
		{
			var completed = X.countChecklist(X.Checklists.JP, X.ChecklistEnum.Checked);
			var total = X.Checklists.JP.length;
			$("#mapJPCounter").text(completed + "/" + total);
		};
		
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
			
			updateJPCount();
		});
		
		updateJPCount();
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
		$.getScript(U.URL_DATA.Collectible).done(function(){
			
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
					+ "<a href='" + U.getYouTubeLink(ithcollectible.name + " " + I.cGameNick) + "'>[Y]</a>&nbsp;"
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
		
		// Reinitialize show icons boolean
		M.displayIcons("Collectible", true);
		
		});
	}
};

/* =============================================================================
 * @@World vs World map and objectives
 * ========================================================================== */
W = {
	
	Map: {},
	isMapInitialized: false,
	isMouseOnHUD: false,
	isMapAJAXDone: false,
	isAPIRetrieved_MAPFLOOR: false,
	isMappingIconsGenerated: false,
	isEventIconsGenerated: false,
	cMAP_BOUND: 16384, // The map is a square
	cMAP_CENTER: [8192, 8192],
	cWVW_CENTER: [10500, 12300],
	cZoomLevelFactor: 2,
	ZoomLevelEnum:
	{
		Min: 0,
		Default: 3,
		Space: 3,
		Sky: 4,
		Bird: 5,
		Ground: 6,
		Max: 6
	},
	
	initializeMap: function()
	{
		$("#paneMap").hide();
		$("#paneWvW").show();
		
		// W.World is the actual Leaflet map object, initialize it
		W.Map = L.map("paneWvW", {
			minZoom: W.ZoomLevelEnum.Min,
			maxZoom: W.ZoomLevelEnum.Max,
			inertiaThreshold: M.cInertiaThreshold,
			doubleClickZoom: false,
			touchZoom: false, // Disable pinch to zoom
			zoomControl: I.isOnSmallDevice, // Hide the zoom UI
			attributionControl: false, // Hide the Leaflet link UI
			crs: L.CRS.Simple
		}).setView([-192, 164], W.ZoomLevelEnum.Default);
		// Because the map will interfere with scrolling the website on touch devices
		W.Map.touchZoom.disable();
		if (W.Map.tap)
		{
			W.Map.tap.disable();
		}
		
		// Set tile
		L.tileLayer(U.URL_API.TilesMists,
		{
			continuousWorld: true
		}).addTo(W.Map);
		
		if ( ! I.isOnSmallDevice)
		{
			/*
			 * Clicking an empty place on the map highlight its coordinate.
			 */
			W.Map.on("click", function(pEvent)
			{
				if (W.isMouseOnHUD) { return; }
				var coord = W.convertLCtoGC(pEvent.latlng);
				$("#wvwCoordinatesCopy")
					.val("[" + coord[0] + ", " + coord[1] + "]")
					.select();
			});

			/*
			 * Move the personal pin marker to where the user double clicks.
			 */
			W.Map.on("dblclick", function(pEvent)
			{
				if (W.isMouseOnHUD) { return; }
				W.PinPersonal.setLatLng(pEvent.latlng);
			});
		}
		
		/*
		 * Go to the coordinates in the bar when user presses enter.
		 */
		$("#wvwCoordinatesCopy").onEnterKey(function()
		{
			var coord = M.parseCoordinates($(this).val());
			coord[0] = Math.floor(coord[0]);
			coord[1] = Math.floor(coord[1]);
			$("#wvwCoordinatesCopy")
				.val("[" + coord[0] + ", " + coord[1] + "]")
				.select();
			
			if (coord[0] !== "" && coord.length === 2)
			{
				//M.goToView(coord, M.PinPersonal);
			}
		});
		
		// Finally
		W.isMapInitialized = true;
		
		W.bindMapVisualChanges();
	},
	
	/*
	 * Informs Leaflet that the map pane was resized so it can load tiles properly.
	 */
	refreshMap: function()
	{
		if (W.isMapInitialized)
		{
			W.Map.invalidateSize();
		}
	},
	
	/*
	 * Turns a boolean on when mouse entered any GUI elements on the map, so
	 * map event handlers can ignore actions on those elements.
	 */
	bindHUDEventCanceler: function()
	{
		$("#paneHUDWvW").hover(
			function() { W.isMouseOnHUD = true; },
			function() { W.isMouseOnHUD = false; }
		);
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
		W.Map.on("mousemove", $.throttle(M.cMAP_MOUSEMOVE_RATE, function(pEvent)
		{
			if (W.isMouseOnHUD) { return; }
			var coord = W.convertLCtoGC(pEvent.latlng);
			document.getElementById("wvwCoordinatesMouse")
				.value = coord[0] + ", " + coord[1];
			//M.showCurrentZone(M.convertLCtoGC(pEvent.latlng));
		}));
		
		/*
		 * At the start of a zoom change hide submaps so they do not cover the map.
		 */
		W.Map.on("zoomstart", function(pEvent)
		{
			/*if (M.SubmapEntities.length > 0)
			{
				M.setEntityGroupDisplay(M.SubmapEntities, "hide");
			}*/
		});

		/*
		 * At the end of a zoom animation, resize the map waypoint icons
		 * depending on zoom level. Hide if zoomed too far.
		 */
		W.Map.on("zoomend", function(pEvent)
		{
			/*M.adjustZoomMapping();
			M.adjustZoomDryTop();*/
		});
	},
	
	/*
	 * Converts GW2's coordinates XXXXX,XXXXX to Leaflet LatLng coordinates XXX,XXX.
	 * @param array pCoord array of two numbers.
	 * @returns LatLng Leaflet object.
	 */
	convertGCtoLC: function(pCoord)
	{
		return W.Map.unproject(pCoord, W.Map.getMaxZoom());
	},
	
	/*
	 * Converts Leaflet LatLng to GW2's 2 unit array coordinates.
	 * @param object pLatLng from Leaflet.
	 * @returns array of x and y coordinates.
	 */
	convertLCtoGC: function(pLatLng)
	{
		var coord = W.Map.project(pLatLng, W.ZoomLevelEnum.Max);
		return [Math.floor(coord.x), Math.floor(coord.y)];
	},
};

/* =============================================================================
 * @@Time utilities and schedule
 * ========================================================================== */
T = {

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
	loginTrackOfficial: 0,
	
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
	 * Gets a clipboard text of the current Dry Top events.
	 * @param pOffset from the current event frame.
	 * @returns string of events for that event frame.
	 */
	getCurrentDryTopEvents: function(pOffset)
	{
		pOffset = pOffset || 0;
		
		var now = new Date();
		var min = now.getUTCMinutes();
		var eventframe = (~~(min / T.cMINUTES_IN_EVENTFRAME) * T.cMINUTES_IN_EVENTFRAME)
			+ (pOffset * T.cMINUTES_IN_EVENTFRAME);
	
		return T.Hourly["t" + T.wrapInteger(eventframe, T.cMINUTES_IN_HOUR)] + I.siteTagCurrent;
	},
	
	// Dry Top events
	initializeHourlyDryTop: function()
	{
		if (C.DryTopChains.length <= 0)
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
		
		// Initialize Dry Top schedule
		T.initializeHourlyDryTop();
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
					minsec = sec + D.getWord("s");
				}
				else
				{
					minsec = min + D.getWord("m") + " " + sec + D.getWord("s");
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
				minsec = min + D.getWord("m");
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
			return hour + D.getWord("h") + " " + minsec;
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
	timeDaylight: {}, timeLocal: {}, timeDaytime: {}, timeBoard: {},
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
		K.timeDaytime = $("#itemTimeDayTime")[0];
		K.timeBoard = $("#itemBoardTime")[0];
		K.timestampUTC = $("#optTimestampUTC")[0];
		K.timestampLocal = $("#optTimestampLocalReset")[0];
		K.timestampServer = $("#optTimestampServerReset")[0];
		K.timestampReset = $("#optTimeTillReset")[0];
		
		K.updateTimeFrame(new Date());
		K.updateDigitalClockMinutely();
		K.updateDaytimeIcon();
		K.tickFrequent();
		K.initializeClipboard();
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
					"min-height": I.cPANEL_HEIGHT - (I.cPANE_MENU_HEIGHT) + "px"}, animationspeed,
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
				"min-height": I.cPANEL_HEIGHT - (clockpaneheight + I.cPANE_MENU_HEIGHT) + "px"}, animationspeed);
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
					M.goToView(coord, M.PinEvent);
					
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
			K.updateDigitalClockMinutely();
			// Refresh the chain time countdown opted
			if (O.Options.bol_useCountdown)
			{
				C.updateChainsTimeHTML();
			}
			K.updateWaypointsClipboard();
			
			// Alert subscribed chain
			if (O.Options.int_setAlarm === O.IntEnum.Alarm.Subscription)
			{
				K.doSubscribedSpeech(O.Options.int_alertSubscribedFirst);
				K.doSubscribedSpeech(O.Options.int_alertSubscribedSecond);
			}
			
			// If crossing a 5 minute mark
			if (min % T.cMINUTES_IN_EVENTFRAME === 0)
			{
				K.updateDaytimeIcon();
				K.updateDryTopClipboard();
			}
		}
		
		// Tick the two digital clocks below the analog clock
		K.timeLocal.innerHTML = T.getTimeFormatted();
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
		C.CurrentChainsSD = [C.CurrentChainSD, C.NextChainSD1, C.NextChainSD2, C.NextChainSD3];
		
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
				I.write("Chat link copied to clipboard :)<br />" + pEvent.data["text/plain"], 5);
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
					I.write("Chat link copied to clipboard :)<br />" + pEvent.data["text/plain"], 5);
				});
			}
		}
	},
	
	/*
	 * Updates the daytime icon based on current game daylight.
	 */
	updateDaytimeIcon: function()
	{
		var src = "img/ui/moon.png";
		if (T.isDaylight())
		{
			src = "img/ui/sun.png";
		}
		$("#itemTimeDayIcon").attr("src", src);
	},
	
	/*
	 * Updates the digital clock with minutely information.
	 */
	updateDigitalClockMinutely: function()
	{
		// Daytime clock updates time remaining
		K.timeDaytime.innerHTML = T.getDayPeriodRemaining();
		// Local clock updates additional times in tooltip
		K.timeLocal.title =
			"Anet: " + T.getTimeFormatted(
			{
				reference: T.ReferenceEnum.Server,
				wantSeconds: false
			}) + "<br />" +
			"UTC: " + T.getTimeFormatted(
			{
				reference: T.ReferenceEnum.UTC,
				wantSeconds: false,
				want24: true
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
		if (C.DryTopChains.length > 0)
		{
			document.getElementById("chnDryTopWaypoint0")
				.setAttribute(K.cZeroClipboardDataAttribute, T.getCurrentDryTopEvents());
			document.getElementById("chnDryTopWaypoint1")
				.setAttribute(K.cZeroClipboardDataAttribute, T.getCurrentDryTopEvents(1));
		}
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
	cGameNick: "GW2",
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
	cTOOLTIP_ALTERNATE_OFFSET_X: 24,
	cTOOLTIP_ADD_OFFSET_Y: 42,
	cTOOLTIP_ADD_OFFSET_X: 36,
	cTOOLTIP_MOUSEMOVE_RATE: 10,
	CLOCK_AND_MENU_HEIGHT: 0,
	
	// Content-Plate-Page and Section-Header
	isProgramLoaded: false,
	isProgramEmbedded: false,
	ModeCurrent: null,
	ModeEnum:
	{
		Website: "Website",
		Mobile: "Mobile",
		Simple: "Simple",
		Overlay: "Overlay"
	},
	cPagePrefix: "#plate",
	cMenuPrefix: "#menu",
	PageCurrent: "",
	PageEnum:
	{
		// These are the X in "menuX" and "plateX" IDs in the HTML
		Chains: "Chains",
		Map: "Map",
		WvW: "WvW",
		Help: "Help",
		Options: "Options"
	},
	// Section names must be unique, and may either be in sentence case or all caps
	SectionEnum:
	{
		Map:
		{
			Daily: "Daily",
			Resource: "Resource",
			JP: "JP",
			Collectible: "Collectible",
			TP: "TP",
			Notepad: "Notepad",
			Personal: "Personal"
			
		},
		WvW:
		{
			
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
			$(this).append("<div class='itemThrobber'><em></em></div>");
		});
		
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
		$("#mapOptions").one("mouseenter", function()
		{
			$("#mapOptionsPopup img").each(function()
			{
				$(this).attr("src", $(this).attr("data-src"));
			});
		});
		U.convertExternalLink(".linkExternal");
		
		// Bind special popup elements that can be removed if user clicks anywhere not on it
		$(document).mouseup(function(pEvent)
		{
			var elm = $(".jsRemovable");
			if ( ! elm.is(pEvent.target) && elm.has(pEvent.target).length === 0)
			{
				elm.remove();
			}
		});
		
		// The menu bar overlaps the language popup, so have to "raise" the clock pane
		$("#itemLanguage").hover(
			function() {$("#paneClock").css("z-index", 3);},
			function() {$("#paneClock").css("z-index", 0);}
		);

		// Initialize scroll bars for pre-loaded plates
		I.initializeScrollbar($("body, #plateChains, #plateOptions"));
		
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
		// Don't scroll in mobile mode because the webpage's height is dynamic
		if (I.ModeCurrent !== I.ModeEnum.Mobile)
		{
			var rate = pTime || 0;
			if (pContainerOfElement)
			{
				pContainerOfElement.animate(
				{
					scrollTop: pElement.offset().top - pContainerOfElement.offset().top
						+ pContainerOfElement.scrollTop()
				}, rate);
			}
			else
			{
				// Scroll to top of element without animation
				pElement.scrollTop(0);
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
		var i;
		var r;
		for (i in pRequests)
		{
			r = pRequests[i];
			$(r.s).animate(r.p, {duration: pSpeed, queue: false});
		}
	},
	
	/*
	 * Initializes custom scroll bar for specified element using defined settings.
	 * @param jqobject pElement to initialize.
	 */
	initializeScrollbar: function(pElement)
	{
		if (I.ModeCurrent === I.ModeEnum.Mobile)
		{
			return;
		}
		
		var wheelspeed = 1;
		switch (I.BrowserCurrent)
		{
			case I.BrowserEnum.Opera: wheelspeed = 3; break;
			case I.BrowserEnum.Firefox: wheelspeed = 3; break;
		}
		
		$(pElement).perfectScrollbar({
			wheelSpeed: wheelspeed,
			suppressScrollX: true
		});
	},
	
	/*
	 * Binds headers with the jsSection class to toggle display of its sibling
	 * container element. Creates a vertical side menu as an alternate for clicking
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
		var menubeam = $("<div class='menuBeam' id='" + beamid + "'></div>").prependTo(pPlate);
		
		// Bind beam menu animation when clicked on the bar menu icon
		if (I.ModeCurrent === I.ModeEnum.Website)
		{
			menubeam.css({right: I.cPANEL_WIDTH, top: I.CLOCK_AND_MENU_HEIGHT});
			$(I.cMenuPrefix + plate).click(function()
			{
				$("#menuBeam_" + I.PageCurrent)
					.css({right: I.cPANEL_WIDTH + I.cPANE_BEAM_LEFT, top: I.CLOCK_AND_MENU_HEIGHT})
					.animate({right: I.cPANEL_WIDTH}, "fast");
			});
		}
		else
		{
			// Don't show the beam menu for other modes
			menubeam.hide();
		}
		
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
			header.append("<sup>[+]</sup>");
			
			// Bind click the header to toggle the sibling collapsible container
			header.click(function()
			{
				var istobeexpanded = false;
				var section = U.getSubstringFromHTMLID($(this));
				$(pPlate + " .menuBeamIcon").removeClass("menuBeamIconActive");
				
				if ($(this).next().is(":visible"))
				{
					// To be collapsed
					$(this).children("sup").text("[+]");
					
					M.displayIcons(section, false); // Hide this section's map icons
					
					I[I.sectionPrefix + plate] = ""; // Nullify current section variable
				}
				else
				{
					// To be expanded
					istobeexpanded = true;
					$(this).children("sup").text("[-]");
					$(pPlate + " .menuBeamIcon[data-section='" + section + "']")
						.addClass("menuBeamIconActive");
					
					I[I.sectionPrefix + plate] = section;
				}
				U.updateQueryString();
				
				// Do the collapse/expand
				if ($(this).data("donotanimate") !== "true")
				{
					if (I.ModeCurrent === I.ModeEnum.Website)
					{
						$(this).next().toggle("fast");
					}
					else
					{
						$(this).next().toggle();
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
				else
				{
					I.scrollToElement($(pPlate));
				}
			});
			
			// Opening the section at least once will load that section's img tags
			header.one("click", function()
			{
				I.loadSectionImg($(this));
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
			$("<img class='menuBeamIcon' data-section='" + section + "' src='" + src + "' "
				+ "title='&lt;dfn&gt;" + D.getSentence("section") + ": &lt;/dfn&gt;" + headertext + "' />")
				.appendTo(menubeam).click(function()
				{
					// Hide all the collapsible sections
					$(pPlate + " header.jsSection").each(function()
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
	 * Loads images in a toggleable section, whose src attributes were initially
	 * written in the data attribute.
	 * @param jqobject pHeader to find the adjacent section tag.
	 */
	loadSectionImg: function(pHeader)
	{
		pHeader.next().find("img").each(function()
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
			$(this).text("[?]").attr("title", title);
		});
		
		I.qTip.init(pPlate + " .jsHelpCollapsible");
		I.qTip.init(pPlate + " .jsHelpTooltip");
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
				var pageprevious = I.PageCurrent;
				I.PageCurrent = plate.substring(I.cMenuPrefix.length-1, plate.length);
				I.contentCurrentPlate = I.cPagePrefix + I.PageCurrent;
				
				switch (I.PageCurrent)
				{
					case I.PageEnum.Chains:
					{
						
					} break;
					
					case I.PageEnum.Map:
					{
						M.movePin(M.PinEvent);
					} break;
					
					case I.PageEnum.WvW:
					{
						
					} break;
					
					case I.PageEnum.Help:
					{
						
					} break;
					
					default:
					{
						
					} break;
				}
				
				// Show appropriate map pane
				if (I.PageCurrent === I.PageEnum.WvW && $("#paneMap").is(":visible"))
				{
					$("#paneMap").hide();
					$("#paneWvW").show();
					W.refreshMap();
				}
				if ((I.PageCurrent === I.PageEnum.Chains ||
					I.PageCurrent === I.PageEnum.Map) && $("#paneWvW").is(":visible"))
				{
					$("#paneWvW").hide();
					$("#paneMap").show();
					M.refreshMap();
				}
				
				$("#paneContent article").hide(); // Hide all plates
				
				
				$(I.contentCurrentPlate + " .cntHeader").css({opacity: 0}).animate( // Fade page title
				{
					opacity: 1
				}, 400);
				if (I.ModeCurrent === I.ModeEnum.Website)
				{
					$(I.contentCurrentPlate).animate( // Show requested page
					{
						width: "show"
					}, 200);
				}
				$(I.contentCurrentPlate).show();
				
				// Update the address bar URL with the current page name
				U.updateQueryString();
				
				// Also hide chain paths if on the map page
				if (O.Options.bol_showChainPaths)
				{
					if (I.PageCurrent === I.PageEnum.Map)
					{
						M.setEntityGroupDisplay(M.ChainPathEntities, "hide");
						M.setEntityGroupDisplay(M.DryTopEventIcons, "hide");
						M.setEntityGroupDisplay(M.DryTopEventRings, "hide");
					}
					else
					{
						M.setEntityGroupDisplay(M.ChainPathEntities, "show");
						M.setEntityGroupDisplay(M.DryTopEventActive, "show");
					}
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
		// WvW plate
		$("#menuWvW").one("click", I.loadWvWPlate);
		// Help plate
		$("#menuHelp").one("click", I.loadHelpPlate);
		
	}, // End of menu initialization
	
	/*
	 * Macro function for various written content added functionality. Must be
	 * run at the beginning of any load function's done block.
	 */
	bindAfterAJAXContent: function(pPageEnum)
	{
		var plate = I.cPagePrefix + pPageEnum;
		I.generateSectionMenu(plate);
		I.initializeScrollbar($(plate));
		I.bindHelpButtons(plate);
		M.bindMapLinks(plate);
		// Open links on new window
		U.convertExternalLink(plate + " a");
		I.qTip.init("button");
		
		// Expand a header if requested in the URL
		U.openSectionFromURL();
		D.translatePageHeader(pPageEnum);
	},
	
	/*
	 * Loads the map page into the map content plate.
	 */
	loadMapPlate: function()
	{
		$("#plateMap").load(I.cPageURLMap, function()
		{
			I.bindAfterAJAXContent(I.PageEnum.Map);
			
			// Hide map dependent sections in mobile mode
			if (I.ModeCurrent === I.ModeEnum.Mobile)
			{
				$(".mapOnly").hide();
			}
			
			// Create daily markers
			$("#headerMap_Daily").one("click", function()
			{
				P.generateAndInitializeDailies();
				I.isSectionLoaded_Daily = true;
			});
			// Create node markers and checkboxes
			$("#headerMap_Resource").one("click", function()
			{
				P.generateAndInitializeResourceNodes();
			});
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
				P.generateAndInitializeCollectibles();
			});
			
			// Bind show map icons when clicked on header
			$("#headerMap_Daily, #headerMap_Resource, #headerMap_JP, #headerMap_Collectible").each(function()
			{
				$(this).click(function()
				{
					// Show only if the section is about to be expanded
					if ($(this).children("sup").text() === "[-]")
					{
						var section = U.getSubstringFromHTMLID($(this));
						if (M["isIconsGeneratedFor" + section])
						{
							M.displayIcons(section, true);
						}
					}
				});
			});
			
			// Create additional map related side menu icon
			$("<img class='menuBeamIcon menuBeamIconCenter' src='img/map/compass.png' "
				+ "title='&lt;dfn&gt;Map Center&lt;/dfn&gt;' />")
				.appendTo("#menuBeam_Map").click(function()
			{
				M.goToDefault();
			});
			I.qTip.init("#plateMap .menuBeamIconCenter, #plateMap label");
		});
	},
	
	/*
	 * Loads the map page into the map content plate.
	 */
	loadWvWPlate: function()
	{
		$("#plateWvW").load(I.cPageURLWvW, function()
		{
			W.initializeMap();
			I.bindAfterAJAXContent(I.PageEnum.WvW);
		});
	},
	
	/*
	 * Loads the help page into the help content plate.
	 */
	loadHelpPlate: function()
	{
		$("#plateHelp").load(I.cPageURLHelp, function()
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
		$("#mapOptions, #mapZones, #mapGPS").each(function()
		{
			$(this).hover(
				function() { $(this).find(".cntComposition").show().animate({opacity: 0.8}, animationspeed); },
				function() { $(this).find(".cntComposition").animate({opacity: 0}, animationspeed); }
			);
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
				$("#mapGPSButton").show();
				
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
				$("#itemSocial").hide();
				$("#itemLanguage").css({
					position: "fixed",
					top: "10px", right: "10px", bottom: "auto", left: "auto"
				});
				$("#itemLanguage span").css({opacity: 0.7});
				$("#itemTimeLocal").css({
					width: "220px",
					right: "auto", bottom: "160px", left: "70px",
					"text-align": "center",
					color: "#eee",
					opacity: 0.5
				});
				$("#itemTimeDaytime").css({
					width: "220px",
					top: "160px", bottom: "auto", left: "70px",
					"text-align": "center",
					color: "#eee",
					opacity: 0.5
				});
				$("#itemTimeLocalExtra").css({
					position: "fixed",
					bottom: "0px", right: "10px",
					color: "#eee",
					opacity: 0.5
				});
				I.qTip.init($("<a title='&lt;dfn&gt;Switch back to full site&lt;/dfn&gt;' href='./'>"
					+ " <img id='iconSimpleHome' src='img/ui/about.png' /></a>")
					.appendTo("#itemTimeLocalExtra"));
				$("#paneBoard").show();
				
			} break;
			case I.ModeEnum.Mobile:
			{
				$("#panelLeft").hide();
				$("head").append("<meta name='viewport' content='initial-scale=1.0, width=device-width'>");
				$("head").append("<link rel='stylesheet' type='text/css' href='gw2t-mobile.css'>");
			} break;
		}
		
		// Change CSS for overlay specific
		if (I.ModeCurrent === I.ModeEnum.Website && I.isProgramEmbedded === false)
		{
			$("#paneClockIcons img").addClass("curZoomable");
		}
		else
		{
			$("#paneClockIcons img").addClass("curClickable");
		}
		
		// Also streamline other UI elements if website is embedded in another website
		if (I.isProgramEmbedded)
		{
			$("#paneWarning").remove();
			$(".itemMapLinks a, .itemMapLinks span").hide();
		}
		
		// Include program mode in Language link
		if (I.ModeCurrent !== I.ModeEnum.Website)
		{
			$("#itemLanguagePopup a").each(function()
			{
				var link = $(this).attr("href");
				$(this).attr("href", link + "&mode=" + I.ModeCurrent);
			});
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
		I.qTip.init("a, ins, kbd, span, fieldset, label, input, button");
		
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
			// Tooltip overflows panel left edge
			if (($(window).width() - pEvent.pageX) > (I.cPANEL_WIDTH / 2))
			{
				I.qTip.offsetX = I.cTOOLTIP_ALTERNATE_OFFSET_X;
			}
			else
			{
				I.qTip.offsetX = I.cTOOLTIP_DEFAULT_OFFSET_X;
			}
		}));
		$("#panelLeft").mousemove($.throttle(I.cTOOLTIP_MOUSEMOVE_RATE, function(pEvent)
		{
			// Tooltip overflows right edge
			if (pEvent.pageX + I.cTOOLTIP_ADD_OFFSET_X > $(window).width())
			{
				I.qTip.offsetX = -(I.cTOOLTIP_MAX_WIDTH / 2) - I.cTOOLTIP_ADD_OFFSET_X;
			}
			else
			{
				I.qTip.offsetX = I.cTOOLTIP_ALTERNATE_OFFSET_X;
			}
			// Tooltip overflows bottom edge
			if ($("#qTip").height() - I.cTOOLTIP_ALTERNATE_OFFSET_X + pEvent.pageY > $(window).height())
			{
				I.qTip.offsetY = -($("#qTip").height()) - I.cTOOLTIP_ADD_OFFSET_Y;
			}
			// Tooltip overflows top edge
			else if (pEvent.pageY < I.cTOOLTIP_ADD_OFFSET_Y)
			{
				I.qTip.offsetY = I.cTOOLTIP_DEFAULT_OFFSET_Y;
			}
			else
			{
				I.qTip.offsetY = -I.cTOOLTIP_ADD_OFFSET_Y;
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