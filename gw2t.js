/*
	GW2Timer.com timer, map, and misc single-page application driver.
	jQuery-dependent (v1.11.0), with other plugins in plugins.js.
	Coded in NetBeans; debugged in Opera Dragonfly.
	IDE recommended for viewing and collapsing code sections.
	Version: 2014.05.21 modified - 2010.04.18 created

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
	C - Chains events
	M - Map Leaflet
	T - Time variables
	K - Clock SVG
	I - Interface UI
	X - Executions of functions to load the application

*/

$(window).on("load", function() {
	
/* =============================================================================
 *  Single letter objects serve as namespaces.
 * ========================================================================== */
var O = {}; // options
var C = {}; // chains
var M = {}; // map
var T = {}; // time
var K = {}; // clock
var I = {}; // interface

/* =============================================================================
 * @@Options for the user
 * ========================================================================== */
O = {
	int_programVersion: 1405212357,
	programVersionName: "int_programVersion",
	
	prefixOption: "opt_",
	prefixChain: "chn_",
	prefixJP: "jp_",
	
	/*
	 * This UNIX time variable should be updated whenever a server reset related
	 * option was changed by the user, such as checking off a chain. It will be
	 * compared to the server reset time as to automatically clear "yesterday's"
	 * options. Server reset is at UTC midnight, DST is irrelevant.
	 */
	lastServerSensitiveActionTimestamp: 0,
	lastSSATName: "int_lastServerSensitiveActionTimestamp",
	
	/*
	 * All of these options must have an associated input tag in the HTML that
	 * users interact with, and their IDs are in the form prefixOption + optionname.
	 * Note the three letter prefix indicating the option's data type.
	 */
	Options:
	{
		// Timer
		bol_hideChecked: false,
		bol_use24Hour: false,
		bol_showClock: true,
		int_dimClockBackground: 0,
		int_useTimeCountdown: 1,
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
		// Advanced
		bol_clearOnServerReset: true,
		bol_detectDST: true
	},
	
	Checklist: {},
	ChecklistEnum:
	{
		Unchecked: 0,
		Checked: 1,
		Deleted: -1
	},
	
	JPChecklist: "", // Will use 0s and 1s as a long string rather than separate variables
	JPChecklistName: "JPChecklist",
	numOfJPs: 0,
	
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
	 * Sets the server sensitive timestamp to the current time.
	 */
	updateSSTimestamp: function()
	{
		O.lastServerSensitiveActionTimestamp = T.getUNIXSeconds();
		localStorage[O.lastSSATName] = O.lastServerSensitiveActionTimestamp;
	},
	
	/*
	 * Compares the SST with yesterday's server reset time.
	 * @returns boolean timestamp is outdated or not.
	 */
	isSSTimestampOutdated: function()
	{
		var yesterdaysserverreset = T.getUNIXSeconds() - T.getTimeOffsetSinceMidnight("utc", "seconds");
		
		if (O.lastServerSensitiveActionTimestamp <= yesterdaysserverreset)
		{
			return true;
		}
		return false;
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
	 * @pre The tags are preloaded (not AJAX).
	 */
	initializeOptions: function()
	{
		// Load or initialize server sensitive timestamp
		if (localStorage[O.lastSSATName] === undefined)
		{
			localStorage[O.lastSSATName] = T.getUNIXSeconds();
		}
		else
		{
			O.lastServerSensitiveActionTimestamp = parseInt(localStorage[O.lastSSATName]);
		}
		
		// Load or initialize input options
		for (var optionname in O.Options)
		{
			// Assign default values to localStorage if they are empty
			if (localStorage[optionname] === undefined)
			{
				localStorage[optionname] = O.Options[optionname];
			}
			else
			{	// Else user set options from localStorage become the new options
				O.Options[optionname] = O.convertLocalStorageDataType(localStorage[optionname]);
			}
			// Update the inputs with specific name format, this "loop" runs once
			$("#" + O.prefixOption + optionname).each(function()
			{
				// Assign the retrieved values to the input tags
				var inputtype = $(this).attr("type");
				if (inputtype === "checkbox")
				{
					$(this).prop("checked", O.Options[optionname]);
				}
				else if (inputtype === "range")
				{
					$(this).val(O.Options[optionname]);
				}
				else if (inputtype === "radio")
				{
					// Check the radio button of that index (int)
					$("input:radio[name=" + optionname + "]:eq(" + O.Options[optionname] + ")")
						.prop("checked", true);
				}
				
				/*
				 * Bind simple event handlers to each input tags that writes
				 * the value of the input to the options and localStorage.
				 * Note that the optionname local variable was not reused here
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
					$("fieldset[name=" + optionname + "]").change(function()
					{
						var thisoptionname = $(this).attr("name");
						O.Options[thisoptionname] = O.getIndexOfSelectedRadioButton(thisoptionname);
						localStorage[thisoptionname] = O.Options[thisoptionname];
					});
				}
				else
				{
					$(this).change(function()
					{
						var thisoptionname = $(this).attr("id").slice(O.prefixOption.length);
						if (inputtype === "checkbox")
						{
							O.Options[thisoptionname] = $(this).prop("checked");
						}
						else
						{
							O.Options[thisoptionname] = $(this).val();
						}
						localStorage[thisoptionname] = O.Options[thisoptionname];
					});
				}
			});
		}
		
		// Supplementary event handlers for some inputs
		O.bindOptionsInputs();
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
		var optionname;
		for (i in C.Chains)
		{
			chain = C.Chains[i];
			optionname = O.prefixChain + chain.alias;
			O.Checklist[optionname] = O.ChecklistEnum.Unchecked; // Initialize the checklist object
			// Assign default value to localStorage if it is empty
			if (localStorage[optionname] === undefined)
			{
				localStorage[optionname] = O.ChecklistEnum.Unchecked;
			}
			else
			{	// Else user checklist from localStorage becomes the new checklist
				O.Checklist[optionname] = parseInt(localStorage[optionname]);
			}
			
			var bar = $("#barChain_" + chain.alias);
			var check = $("#chnCheck_" + chain.alias);
			
			if (O.isSSTimestampOutdated() === false)
			{
				switch (O.Checklist[optionname])
				{
					case O.ChecklistEnum.Unchecked:
					{
						// Chain is not checked off, so don't do anything
					} break;
					case O.ChecklistEnum.Checked:
					{
						bar.css({opacity: 1}).animate({opacity: 0.4}, 200);
						check.addClass("chnChecked");
						if (O.Options.bol_hideChecked)
						{
							bar.hide();
						}
					} break;
					case O.ChecklistEnum.Deleted:
					{
						bar.hide();
					} break;
				}
			}
			else if (O.Options.bol_clearOnServerReset)
			{
				O.clearServerSensitiveOptions();
			}
			
			/*
			 * Bind event handler for the div "checkboxes".
			 */
			check.click(function()
			{
				O.updateSSTimestamp();
				// The ID was named so by the chain initializer, get the chain alias
				var alias = $(this).attr("id").split("_")[1];
				var thisoptionname = O.prefixChain + alias;
				var thisbar = $("#barChain_" + alias);
				// State of the div is stored in the Checklist object rather in the element itself
				switch (O.Checklist[thisoptionname])
				{
					case O.ChecklistEnum.Unchecked:
					{
						thisbar.css({opacity: 1}).animate({opacity: 0.4}, 200);
						$(this).addClass("chnChecked");
						O.Checklist[thisoptionname] = 1;
						
					} break;
					case O.ChecklistEnum.Checked:
					{
						thisbar.css({opacity: 0.4}).animate({opacity: 1}, 200);
						$(this).removeClass("chnChecked");
						O.Checklist[thisoptionname] = 0;
					} break;
					case O.ChecklistEnum.Deleted:
					{
						thisbar.show("fast");
						O.Checklist[thisoptionname] = 0;
					} break;
				}
				localStorage[thisoptionname] = O.Checklist[thisoptionname];
				// Also autohide the chain bar if opted
				if (O.Checklist[thisoptionname] === O.ChecklistEnum.Checked)
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
				K.checkoffChainIcon(alias);
			});
			
			// Bind the delete [x] chain text button
			$("#chnDelete_" + chain.alias).click(function()
			{
				var alias = $(this).attr("id").split("_")[1];
				var thisoptionname = O.prefixChain + alias;
				var thisbar = $("#barChain_" + alias);

				thisbar.hide("slow");
				O.Checklist[thisoptionname] = O.ChecklistEnum.Deleted;
				localStorage[thisoptionname] = O.Checklist[thisoptionname];
				
				// Also update the clock icon
				K.checkoffChainIcon(alias);
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
		return O.Checklist[O.prefixChain + pChain.alias];
	},
	
	/*
	 * Unchecks the checklist and clear variables, but ignore chains deleted
	 * by the user.
	 */
	clearServerSensitiveOptions: function()
	{
		var chain;
		var optionname;
		for (var i in C.Chains)
		{
			chain = C.Chains[i];
			optionname = O.prefixChain + chain.alias;
			$("#chnCheck_" + chain.alias).removeClass("chnChecked");
			$("#barChain_" + chain.alias).css({opacity: 1});
			if (O.Checklist[optionname] !== O.ChecklistEnum.Deleted)
			{
				$("#barChain_" + chain.alias).show();
				O.Checklist[optionname] = O.ChecklistEnum.Unchecked;
				localStorage[optionname] = O.Checklist[optionname];
			}
		}
		
		O.updateSSTimestamp();
	},
	
	/*
	 * Creates checkboxes next to JP names and bind event handlers for storing
	 * their states as a combined string of 0s and 1s, which the index 0 is the
	 * first JP in the list.
	 */
	generateAndInitializeJPChecklist: function()
	{
		// Make checkboxes
		$(".mapJP dt").each(function()
		{
			$(this).after("<input type='checkbox' id='mapJP_" + O.numOfJPs + "' />");
			O.JPChecklist += "0";
			O.numOfJPs++;
		});
		
		// Initialize localStorage
		if (localStorage[O.JPChecklistName] === undefined)
		{
			localStorage[O.JPChecklistName] = O.JPChecklist;
		}
		else
		{
			O.JPChecklist = localStorage[O.JPChecklistName];
		}
		
		var i; // This is the JP checkbox ID number
		for (i = 0; i < O.numOfJPs; i++)
		{
			$("#mapJP_" + i).each(function()
			{
				// Convert the digit at ith position in the checklist string to boolean
				var stateinstring = O.intToBool(parseInt(O.JPChecklist.charAt(i)));
				$(this).prop("checked", stateinstring);
				if (stateinstring === false)
				{
					$(this).prev().css({color: "#ffcc77"});
				}
				else
				{
					$(this).prev().css({color: "#ffff00"});
				}
				
			}).change(function()
			{
				// Get the checkbox ID that associates itself with that JP
				var stateincheckbox = O.boolToInt($(this).prop("checked")).toString();
				var checkboxindex = parseInt($(this).attr("id").split("_")[1]);
				if (stateincheckbox === "0")
				{
					$(this).prev().css({color: "#ffcc77"});
				}
				else
				{
					$(this).prev().css({color: "#ffff00"});
				}
				
				// Rewrite the checklist string by updating the digit at the ID/index
				O.JPChecklist = O.replaceCharAt(O.JPChecklist, checkboxindex, stateincheckbox);
				localStorage[O.JPChecklistName] = O.JPChecklist;
			}).hover(
				// Highlight JP name when hovered over checkbox
				function()
				{
					$(this).prev().css({"text-decoration": "underline"});
				},
				function()
				{
					$(this).prev().css({"text-decoration": "none"});
				}
			);
		}
		
		// The button to clear all JP checkboxes
		$("#btnJPsUncheck").click(function()
		{
			var jpchecklist = "";
			for (i = 0; i < O.numOfJPs; i++)
			{
				$("#mapJP_" + i).prop("checked", false)
					.prev().css({color: "#ffcc77"});
				jpchecklist += "0";
			}
			O.JPChecklist = jpchecklist;
			localStorage[O.JPChecklistName] = O.JPChecklist;
		});
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
		$("#opt_bol_showClock").change(function()
		{
			O.enact_bol_showClock();
		});
		$("fieldset[name=int_dimClockBackground]").change(function()
		{
			O.enact_int_dimClockBackground();
		});
		$("fieldset[name=int_useTimeCountdown]").change(function()
		{
			O.enact_int_useTimeCountdown();
		});
		$("#opt_bol_showChainPaths").change(function()
		{
			O.enact_bol_showChainPaths();
		});
		$("#opt_bol_showMap").change(function()
		{
			O.enact_bol_showMap();
		});
		/*
		 * Run enactors when the page loads (because this an initializer function).
		 * Will have to place it elsewhere if it requires data to be loaded first.
		 */
		O.enact_bol_hideChecked();
		O.enact_bol_detectDST();
		O.enact_bol_showClock();
		O.enact_int_dimClockBackground();
		O.enact_bol_showMap();
		
		/*
		 * Button event handlers bindings (buttons don't have stored values).
		 * ---------------------------------------------------------------------
		 */
		
		/*
		 * Clears the checklist including the deleted chain.
		 */
		$("#btnRestoreAllChains").click(function()
		{
			var chain;
			var optionname;
			for (var i in C.Chains)
			{
				chain = C.Chains[i];
				optionname = O.prefixChain + chain.alias;
				$("#chnCheck_" + chain.alias).removeClass("chnChecked");
				$("#barChain_" + chain.alias).show().css({opacity: 1});
				O.Checklist[optionname] = O.ChecklistEnum.Unchecked;
				localStorage[optionname] = O.Checklist[optionname];
			}
			// Also unfade the clock icons, which are the current first four bosses
			for (i = 0; i < T.cNUMFRAMES_IN_HOUR; i++)
			{
				K.checkoffChainIcon(C.getCurrentChain(i).alias);
			}
			
			O.updateSSTimestamp();
			$("#menuChains").trigger("click");
		});
		
		/*
		 * Clears the browser storage.
		 */
		$("#btnClearLocalStorage").click(function()
		{
			localStorage.clear();
			location.reload();
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
			var alias = $(this).attr("id").split("_")[1];
			var thisoptionname = O.prefixChain + alias;
			if (O.Checklist[thisoptionname] === O.ChecklistEnum.Checked)
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
	enact_bol_showClock: function()
	{
		/*
		 * There are three panes on the right panel: Clock, Menu, and Content
		 * all absolutely positioned, so to move them the CSS "top" attribute
		 * needs to be changed: less to go up, more to go down.
		 */
		var animationspeed = 200;
		if (O.Options.bol_showClock)
		{
			$("#paneClock").show();
			$("#paneMenu").animate({top: I.cPANE_CLOCK_HEIGHT}, animationspeed);
			$("#paneContent").animate({top: (I.cPANE_CLOCK_HEIGHT
				+ I.cPANE_MENU_HEIGHT)}, animationspeed);
		}
		else
		{
			$("#paneMenu").animate({top: 0}, animationspeed);
			$("#paneContent").animate({top: I.cPANE_MENU_HEIGHT}, animationspeed, function()
			{
				$("#paneClock").hide();
			});
		}
	},
	enact_int_dimClockBackground: function()
	{
		switch (O.Options.int_dimClockBackground)
		{
			case 1: $("#paneClockBackground").css({opacity: 1}); break;
			case 2: $("#paneClockBackground").css({opacity: 0}); break;
		}
	},
	enact_int_useTimeCountdown: function()
	{
		C.updateChainsTimeHTML();
	},
	enact_bol_showChainPaths: function()
	{
		if (O.Options.bol_showChainPaths)
		{
			M.setLayerGroupDisplay(M.PathLayer, "show");
		}
		else
		{
			M.setLayerGroupDisplay(M.PathLayer, "hide");
		}
	},
	enact_bol_showMap: function()
	{
		if (O.Options.bol_showMap)
		{
			//$("#paneMap").css({visibility: "visible"});
			$("#panelLeft").show();
		}
		else
		{
			//$("#paneMap").css({visibility: "hidden"});
			$("#panelLeft").hide();
		}
	},
};

/* =============================================================================
 * @@Chains of events
 * ========================================================================== */
C = {
	
	/*
	 * http://gw2timer.com/metas.js holds a giant object containing an array of
	 * meta event chains, which themselves contain an array of their events.
	 * This is referred to by the variable "C.Chains".
	 */
	Chains: GW2T_CHAINS_DATA,
	CurrentChain: {},
	PreviousChain: {},
	PreviousPreviousChain: {},
	NextChain: {},
	cChainTitleCharLimit: 30,
	CurrentPrimaryEvent: {},
	
	initializeSchedule: function()
	{
	   // Shortcut reference to the chains
		C.FE = C.getChainFromAlias("FE");
		C.Golem = C.getChainFromAlias("Golem");
		C.Jormag = C.getChainFromAlias("Jormag");
		C.Karka = C.getChainFromAlias("Karka");
		C.Maw = C.getChainFromAlias("Maw");
		C.Megades = C.getChainFromAlias("Megades");
		C.SB = C.getChainFromAlias("SB");
		C.Shatterer = C.getChainFromAlias("Shatterer");
		C.Taidha = C.getChainFromAlias("Taidha");
		C.Ulgoth = C.getChainFromAlias("Ulgoth");
		C.Wurm = C.getChainFromAlias("Wurm");
		C.Tequatl = C.getChainFromAlias("Tequatl");
		C.Triple = C.getChainFromAlias("TripleWurm");
		C.TBD = C.getChainFromAlias("TBD");
		
		/*
		 * This circular array corresponds to Anet's megaserver WB list.
		 * The array starts at midnight UTC; each chain is a 15 minute frame,
		 * and each line represents one hour.
		 */
		C.cSchedule =
		[
			// 0       15       30       45
			C.Shatterer, C.Maw, C.Ulgoth, C.FE,   // 0
			C.Karka, C.Wurm, C.Golem, C.SB,       // 1
			C.Tequatl, C.Maw, C.Jormag, C.FE,     // 2
			C.Triple, C.Wurm, C.Taidha, C.SB,     // 3
			C.Megades, C.Maw, C.TBD, C.FE,        // 4
			C.Shatterer, C.Wurm, C.Ulgoth, C.SB,  // 5
			C.Golem, C.Maw, C.Jormag, C.FE,       // 6
			C.Shatterer, C.Wurm, C.Ulgoth, C.SB,  // 7
			C.Golem, C.Maw, C.Jormag, C.FE,       // 8
			C.Taidha, C.Wurm, C.Megades, C.SB,    // 9
			C.TBD, C.Maw, C.Karka, C.FE,          // 10
			C.Shatterer, C.Wurm, C.Tequatl, C.SB, // 11
			C.Ulgoth, C.Maw, C.Triple, C.FE,      // 12
			C.Golem, C.Wurm, C.Jormag, C.SB,      // 13
			C.Taidha, C.Wurm, C.Megades, C.FE,    // 14
			C.TBD, C.Wurm, C.Shatterer, C.SB,     // 15
			C.Karka, C.Maw, C.Ulgoth, C.FE,       // 16
			C.Tequatl, C.Wurm, C.Golem, C.SB,     // 17
			C.Triple, C.Maw, C.Jormag, C.FE,      // 18
			C.Taidha, C.Wurm, C.Megades, C.SB,    // 19
			C.TBD, C.Maw, C.Shatterer, C.FE,      // 20
			C.Ulgoth, C.Wurm, C.Golem, C.SB,      // 21
			C.Jormag, C.Maw, C.Taidha, C.FE,      // 22
			C.Megades, C.Wurm, C.TBD, C.SB        // 23
		];
		
		C.ScheduledChains = new Array();
		C.initializeAllChains();
		
		// Each chain gets an array of indexes of where it is in the schedule
		for (var i in C.cSchedule)
		{
			for (var ii in C.ScheduledChains)
			{
				if (C.ScheduledChains[ii].alias === C.cSchedule[i].alias)
				{
					C.ScheduledChains[ii].scheduleIndexes.push(i);
					break;
				}
			}
		}
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
	 * Gets a chain object for that time of day in the schedule.
	 * @param int pOffset chain index offset (e.g. to get the following chain)
	 * @returns object chain.
	 */
	getCurrentChain: function(pOffset)
	{
		return C.cSchedule[C.getCurrentIndexOfSchedule(pOffset)];
	},
	getCurrentIndexOfSchedule: function(pOffset)
	{
		if (pOffset === undefined)
		{
			pOffset = 0;
		}
		pOffset = pOffset % C.cSchedule.length;
		if (pOffset < 0)
		{
			pOffset = C.cSchedule.length + pOffset;
		}
		var utctimeinminutes = T.getTimeOffsetSinceMidnight("utc", "minutes");
		return ((parseInt(utctimeinminutes / T.cMINUTES_IN_FRAME))
			+ pOffset) % C.cSchedule.length;
	},

	/*
	 * Converts a time string to seconds.
	 * @param string pTime in X:XX:XX or X:XX or 0 format.
	 * @returns int seconds totaled.
	 * @pre time string contains at most 1 "~" and at most 2 ":".
	 */
	parseEventTime: function(pTime)
	{
		/* Time string with the ~ are preformatted as the minimum time plus the
		 * window time (two time strings), for example "1:30:00~30:00" is 1.5 hour
		 * wait, and 0.5 hour window during which the next event can happen.
		 */
		var time = new Array();
		if (pTime.indexOf("~") !== -1)
		{
			time = pTime.split("~");
			// Sum the minimum wait with the expected (half) time of the window
			return C.parseEventTime(time[0]) + ~~(C.parseEventTime(time[1]) / 2);
		}
		if (pTime === "*")
		{
			return 0;
		}
		// If just a number without colons, assume it is already seconds
		if (pTime.indexOf(":") === -1)
		{
			return parseInt(pTime, 10);
		}

		time = pTime.split(":");
		if (time.length === 2)
		{
			return parseInt(time[0], 10) * T.cSECONDS_IN_MINUTE
					+ parseInt(time[1], 10);
		}
		if (time.length === 3)
		{
			return parseInt(time[0]) * T.cSECONDS_IN_HOUR
					+ parseInt(time[1], 10) * T.cSECONDS_IN_MINUTE
					+ parseInt(time[2], 10);
		}
		return NaN;
	},
	
	/*
	 * Returns the substring before the "XXX" delimiter in a chain alias.
	 * Used for reusing chain icons of different chains.
	 * @param string pAlias of the chain
	 * @returns string common alias of the chain
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
	 * Calculates time sums for chains and push to array for later accessing by
	 * the ticker. Initializes the chain HTML layer presentation with chains
	 * and their individual events.
	 * @param object pChain chain to initialize.
	 */
	initializeChainAndHTML: function(pChain)
	{
		var i, ii;
		var event;
		var chaindivision = parseInt(pChain.serial.charAt(0));
		var chainhtmlid = "";
		
		switch (chaindivision)
		{
			case 0: chainhtmlid = "#listChainsScheduled"; break;
			case 1: chainhtmlid = "#listChainsUnscheduled"; break;
			case 2: chainhtmlid = "#listChainsTemple"; break;
			default: return;
		}
		
		/* 
		 * A chain bar (HTML) is a rectangle that contains the event chain icon,
		 * chain title, time, individual events listed, and other elements.
		 * Lots of CSS IDs and classes here, so update if the CSS changed.
		 */
		$(chainhtmlid).append(
		"<div id='barChain_" + pChain.alias + "' class='barChain'>"
			+ "<div class='chnTitle'>"
				+ "<img src='img/chain/" + C.parseChainAlias(pChain.alias).toLowerCase() + ".png' />"
				+ "<div id='chnCheck_" + pChain.alias + "' class='chnCheck'></div>"
				+ "<h2>" + C.truncateTitleString(pChain.title, C.cChainTitleCharLimit) + "</h2>"
				+ "<time id='chnTime_" + pChain.alias + "'></time>"
			+ "</div>"
			+ "<div id='chnDetails_" + pChain.alias + "' class='chnDetails'>"
				+ "<ol id='chnEvents_" + pChain.alias + "' class='chnEvents'></ol>"
				+ "<div class='chnDetailsLinks'>"
					+ "<ins id='chnDelete_" + pChain.alias + "' title='Permanently hide this event chain (can undo in options).'>[x]</ins>"
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
				return "&lt;span style=\"color:#ffcc77\"&gt;" + pS + "&lt;/span&gt;";
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
				+ b + "&amp;quot;" + e.name.replace(/["']/g, "") + "&amp;quot;";
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
				+ "<span>" + C.truncateTitleString(e.name, eventnamelimit, ".") + "." + "</span>"
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
		 * 
		 * Primacy Numbers:
		 * 0 - A failure or optional subevent; includes temple retake event which should be ignored
		 * 1 - A concurrent (multiple simultaneous) event that does not take the longest to complete
		 * 2 - An only event at the time or a concurrent event that takes the longest to complete
		 * 3 - The boss event
		 * Events with primacy numbers 2 and 3 are primary events.
		 */
		for (i in pChain.events)
		{
			event = pChain.events[i];
			if (event.primacy === 2)
			{
				pChain.primaryEvents.push(event);
			}
			else if (event.primacy === 3)
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
			/* iterated event's xxxSum = the previous primary event's xxx time
			 *		+ the previous primary event's success interim
			 *		+ the previous primary event's xxxSum;
			 */
			var previoussuccessinterim = C.parseEventTime(pChain.primaryEvents[i-1].sInterim[0]);

			pChain.primaryEvents[i].minSum = C.parseEventTime(pChain.primaryEvents[i-1].min)
				+ previoussuccessinterim + pChain.primaryEvents[i-1].minSum;
			pChain.primaryEvents[i].avgSum = C.parseEventTime(pChain.primaryEvents[i-1].avg)
				+ previoussuccessinterim + pChain.primaryEvents[i-1].avgSum;
			// minavgSum = minSum + (avgSum - minSum)/2;
			pChain.primaryEvents[i].minavgSum = pChain.primaryEvents[i].minSum
				+ ~~(Math.abs(pChain.primaryEvents[i].avgSum - pChain.primaryEvents[i].minSum) / 2);
		}
		/* min time for the entire chain to finish is the final primary event's
		 * minSum plus the final primary event's min.
		 * Note that i was post-incremented in the for loop after exiting.
		 */
		i--;
		pChain.minFinish = pChain.primaryEvents[i].minSum
			+ C.parseEventTime(pChain.primaryEvents[i].min);
		pChain.avgFinish = pChain.primaryEvents[i].avgSum
			+ C.parseEventTime(pChain.primaryEvents[i].avg);
		pChain.minavgFinish = pChain.minFinish + ~~(Math.abs(pChain.avgFinish - pChain.minFinish)/2);
		
		/*
		 * Now with an array of primary events created, link the non-primary
		 * events and create HTML elements so they can be displayed in totality.
		 */
		ii = 0;
		if (chaindivision === 0) // Scheduled events need to remember concurrent events
		{
			C.ScheduledChains.push(pChain); // Initialize the shortcut reference array
			
			for (i in pChain.events)
			{
				// Ignore failure events and optional defense events
				if (pChain.events[i].primacy > 0)
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
				if (pChain.events[i].primacy === 3)
				{
					break;
				}
			}
		}
		else // Unscheduled events don't need queued accessing
		{
			for (i in pChain.events)
			{
				insertEventToBarHTML(pChain, pChain.events[i]);
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
				C.Chains[i].events[ii].step = parseInt(C.Chains[i].events[ii].num.charAt(0)) - 1;
			}
			
			C.Chains[i].isSorted = false;
			C.Chains[i].primaryEvents = new Array();
			C.Chains[i].scheduleIndexes = new Array();
			C.initializeChainAndHTML(C.Chains[i]);
		}
	},
	
	/*
	 * Gets the local time in seconds for when a chain starts in the schedule.
	 * @param int pScheduleIndex of a chain.
	 * @returns int seconds since midnight local time.
	 */
	convertScheduleIndexToLocalTime: function(pScheduleIndex)
	{
		pScheduleIndex = pScheduleIndex % C.cSchedule.length;
		if (pScheduleIndex < 0)
		{
			pScheduleIndex = C.cSchedule.length - pScheduleIndex;
		}
		
		var time = (pScheduleIndex * T.cMINUTES_IN_FRAME * T.cSECONDS_IN_MINUTE)
			- ((new Date()).getTimezoneOffset() * T.cSECONDS_IN_MINUTE);
		if (time < 0)
		{
			time = T.cSECONDS_IN_DAY + time;
		}
		return time;
	},
	
	/*
	 * Gets the time the current chain has been running.
	 * @returns int seconds elapsed since chain started.
	 */
	getCurrentChainElapsedTime: function()
	{
		var now = new Date();
		var min = now.getUTCMinutes();
		var sec = now.getUTCSeconds();
		return ((min % T.cMINUTES_IN_FRAME) * T.cSECONDS_IN_MINUTE) + sec;
		// Less efficient method
		/*return Math.abs(getSecondsUntilChainStarts(C.CurrentChain));*/
	},
	
	/*
	 * Gets the seconds until a chain start by subtracting the current time from
	 * the chain start time; both of which are seconds since midnight. Because
	 * the timer uses the 24 hour cyclical system, this function faces the
	 * design problem of deciding whether the chain start time is ahead or
	 * behind the local time when past midnight.
	 * @param object pChain to get start time.
	 * @returns int seconds remaining, negative if it started already.
	 * @pre Chain's scheduleIndexes array was refreshed with the earliest start
	 * time at the first index.
	 */
	getSecondsUntilChainStarts: function(pChain)
	{
		var secondschain = (C.convertScheduleIndexToLocalTime(pChain.scheduleIndexes[0]));
		var secondscurrent = T.getTimeOffsetSinceMidnight("local", "seconds");
		var rolloverthreshold = (T.cSECONDS_IN_FRAME * T.cNUMFRAMES_IN_HOUR); // This is 3600 seconds
		
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
	 * Updates a chain bar's time tooltip with a pre-sorted subschedule.
	 * @pre scheduleIndexes array is sorted and first element is the soonest
	 */
	updateChainTimeTooltipHTML: function(pChain)
	{
		// Update the title tootlip with that chain's schedule
		var minischedulestring = "";
		var spacer;
		for (var ii in pChain.scheduleIndexes)
		{
			spacer = (parseInt(ii) === 0) ? "Schedule: " : " -- ";
			minischedulestring = minischedulestring + spacer
				+ T.getTimeFormatted(
				{
					wantSeconds: false,
					customTimeInSeconds: C.convertScheduleIndexToLocalTime(
						pChain.scheduleIndexes[ii])
				});
		}
		$("#chnTime_" + pChain.alias).prop("title", minischedulestring);
	},
	
	/*
	 * Updates the time in the chain bars for all chains.
	 */
	updateChainsTimeHTML: function()
	{
		var ithchain;
		var time;
		var wantletters = false;
		for (var i in C.ScheduledChains)
		{
			ithchain = C.ScheduledChains[i];
			C.updateChainTimeTooltipHTML(ithchain);
			// Don't change the first bar
			if (ithchain.alias === C.CurrentChain.alias)
			{
				continue;
			}
			
			switch (O.Options.int_useTimeCountdown)
			{
				case 0:
				{
					time = C.convertScheduleIndexToLocalTime(ithchain.scheduleIndexes[0]);
				} break;
				case 1:
				{
					time = C.getSecondsUntilChainStarts(ithchain);
					wantletters = true;
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
	},
	
	/*
	 * Update the current chain bar's time as a countup since it began.
	 */
	updateCurrentChainTimeHTML: function()
	{
		$("#chnTime_" + C.CurrentChain.alias).text("-" + T.getTimeFormatted(
			{
				want24: true,
				wantHours: false,
				wantLetters: O.intToBool(O.Options.int_useTimeCountdown),
				customTimeInSeconds: C.getCurrentChainElapsedTime()
			})
		);
	},
	
	/*
	 * Create a list similar to the schedule chains HTML list but with bare
	 * chain titles and static schedule time.
	 */
	initializeTimetableHTML: function()
	{
		$("#listChainsTimetable").empty(); // This makes the function reuseable
		var ithchain;
		var timestring;
		for (var i in C.cSchedule)
		{
			ithchain = C.cSchedule[i];
			timestring = T.getTimeFormatted(
			{
				wantSeconds: O.Options.bol_use24Hour,
				customTimeInSeconds: C.convertScheduleIndexToLocalTime(i)
			});
			
			$("#listChainsTimetable").append(
			"<div class='barChainDummy'>"
				+ "<div class='chnTitle chnTitleFutureFar'>"
					+ "<img src='img/chain/" + C.parseChainAlias(ithchain.alias).toLowerCase() + ".png' />"
					+ "<h2>" + C.truncateTitleString(ithchain.title, C.cChainTitleCharLimit) + "</h2>"
					+ "<time>" + timestring + "</time>"
				+ "</div>"
			+ "</div>");
		}
		// Highlight current chain
		$("#listChainsTimetable .barChainDummy:eq(" + C.CurrentChain.scheduleIndexes[0] + ")")
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
			// The index function automatically rolls over the schedule
			var scheduleindex = C.getCurrentIndexOfSchedule(i);
			ithchain = C.cSchedule[scheduleindex];
			if (ithchain.isSorted === false)
			{
				$("#barChain_" + ithchain.alias).appendTo("#listChainsScheduled");
				ithchain.isSorted = true;
				ithchain.scheduleIndexImmediate = scheduleindex;
				numchainssorted++;
			}
			i++;
		}
		
		for (i in C.ScheduledChains)
		{
			ithchain = C.ScheduledChains[i];
			// Reset the sorted boolean (important, else infinite loop)
			ithchain.isSorted = false;
			
			/*
			 * scheduleIndexes is a "subarray" containing indexes of the main
			 * schedule pertaining to that chain alone. Circularly shift the
			 * array so that the soonest index is first--by concatenating the
			 * two slices of the array using that found index.
			 */
			for (ii in ithchain.scheduleIndexes)
			{
				if (parseInt(ithchain.scheduleIndexes[ii]) ===
					parseInt(ithchain.scheduleIndexImmediate))
				{
					ithchain.scheduleIndexes = 
						(ithchain.scheduleIndexes.slice(ii, ithchain.scheduleIndexes.length))
							.concat(ithchain.scheduleIndexes.slice(0, ii));
					break;
				}
			}
		}
		// Update chain time HTML
		O.enact_int_useTimeCountdown();
		
		/*
		 * Now that the chains are sorted, do cosmetic updates.
		 */
		$("#listChainsScheduled .chnDetails").hide();
		// Highlight and show the current chain bar
		$("#barChain_" + C.CurrentChain.alias).addClass("chnBarCurrent");
		$("#chnDetails_" + C.CurrentChain.alias).show("fast");
		// Still highlight the previous chain bar
		$("#barChain_" + C.PreviousChain.alias)
			.removeClass("chnBarCurrent").addClass("chnBarPrevious");
		// Stop highlighting the previous previous chain bar
		$("#barChain_" + C.PreviousPreviousChain.alias).removeClass("chnBarPrevious");
		// Also highlight timetable chain bar
		$("#listChainsTimetable .barChainDummy").removeClass("chnBarCurrent");
		$("#listChainsTimetable .barChainDummy:eq(" + C.CurrentChain.scheduleIndexes[0] + ")")
			.addClass("chnBarCurrent");
		
		// Style the chain title according to order
		$("#listChainsScheduled .chnTitle h2").each(function(pIndex)
		{
			$(this).removeClass("chnTitleCurrent chnTitleFuture chnTitleFutureFar");
			if (pIndex === 0)
			{
				$(this).addClass("chnTitleCurrent");
			}
			else if (pIndex === 1)
			{
				$(this).addClass("chnTitleFuture");
			}
			else
			{
				$(this).addClass("chnTitleFutureFar");
			}
		});
		$("#listChainsScheduled .chnTitle time").each(function(pIndex)
		{
			$(this).removeClass("chnTimeCurrent chnTimeFuture chnTimeFutureFar");
			if (pIndex === 0)
			{
				$(this).addClass("chnTimeCurrent");
			}
			else if (pIndex === 1)
			{
				$(this).addClass("chnTimeFuture");
			}
			else
			{
				$(this).addClass("chnTimeFutureFar");
			}
		});
	},
	
	/*
	 * minSum avgSum and minavgSum are the seconds since a chain began that
	 * an event of it starts. Because the time a chain start is known, these
	 * statistical times can be used to predict when events happen and end.
	 * @pre The sum statistics have been computed.
	 */
	queueEventsHighlight: function()
	{
		var i;
		var chain = C.CurrentChain;
		var elapsed = C.getCurrentChainElapsedTime();
		var wait;
		var hasfoundcurrentprimaryindex = false;
		
		// If the user just loaded in instead of transitioning at a timeframe
		if (elapsed > 0)
		{
			// Gray out all of the scheduled chain's events
			$("#listChainsScheduled .chnEvents li").addClass("chnEventPast");
			// Find the current active event and highlight it
			for (i in chain.primaryEvents)
			{
				/*
				 * For an event to active, its start time (xxxSum) should be 
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
			C.CurrentPrimaryEvent = pChain.primaryEvents[pPrimaryEventIndex];
			
			// Recolor the past events
			for (i = 0; i < pPrimaryEventIndex; i++)
			{
				$(".chnStep_" + pChain.alias + "_" + i)
					.removeClass("chnEventCurrent").addClass("chnEventPast");
			}
			$(".chnStep_" + pChain.alias + "_" + (pPrimaryEventIndex - 1))
				.css({opacity: 1}).animate({opacity: 0.5}, animationspeed);
			
			// Recolor the current events and animate transition
			$(".chnStep_" + pChain.alias + "_" + pPrimaryEventIndex)
				.removeClass("chnEventPast chnEventFuture").addClass("chnEventCurrent")
				.css({width: 0, opacity: 0.5}).animate({width: eventnamewidth, opacity: 1}, animationspeed).css({width: "auto"});
		
			// Recolor the future events
			if (pPrimaryEventIndex < pChain.primaryEvents.length)
			{
				for (i = (pPrimaryEventIndex + 1); i < pChain.primaryEvents.length; i++)
				{
					$(".chnStep_" + pChain.alias + "_" + i)
						.removeClass("chnEventCurrent").addClass("chnEventFuture");
				}
			}
			
			// Tour to the event on the map if opted
			if (O.Options.bol_tourPrediction && I.currentContent === I.ContentEnum.Chains)
			{
				$("#chnEvent_" + pChain.alias + "_" + C.CurrentPrimaryEvent.num).trigger("click");
			}
		}
		else // Finish time
		{
			$("#chnEvents_" + pChain.alias + " li").removeClass("chnEventCurrent")
				.addClass("chnEventPast").last().css({opacity: 1}).animate({opacity: 0.5}, 500);
			
			/*
			 * Announce the next world boss and the time until it, only if it's
			 * not past the timeframe.
			 */
			if (O.Options.bol_alertAtEnd && pChain.alias === C.CurrentChain.alias)
			{
				var secondsleft = T.cSECONDS_IN_FRAME - C.getCurrentChainElapsedTime();
				var sec = secondsleft % 60;
				var min = ~~(secondsleft / 60) % 60;
				var secstr = " second";
				var minstr = " minute";
				
				// Tell the minutes left, or seconds if it's less than a minute left
				if (secondsleft > T.cSECONDS_IN_MINUTE)
				{
					if (min > 1)
					{
						minstr += "s";
					}
					sec = "";
					min = min + minstr;
				}
				else
				{
					if (sec > 1)
					{
						secstr += "s";
					}
					sec = sec + secstr;
					min = "";
				}
				
				var checked = "";
				var nextchain = C.getCurrentChain(1);
				if (O.getChainChecklistState(nextchain) !== O.ChecklistEnum.Unchecked)
				{
					checked = ", checked";
				}
				// Don't alert if next boss is checked off and user opted not to hear
				if ( ! (checked.length > 0 && O.Options.bol_alertChecked === false))
				{
					I.speak("Next world boss is " + nextchain.pronunciation
						+ ", in " + min + sec + checked);
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
				case 0:
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
				case 1:
				{
					return pChain.primaryEvents[pIndex].minSum;
				} break;
				case 2:
				{
					return pChain.primaryEvents[pIndex].minavgSum;
				} break;
				case 3:
				{
					return pChain.primaryEvents[pIndex].avgSum;
				} break;
			}
		}
		else
		{
			switch (O.Options.int_setPredictor)
			{
				case 0:
				{
					if (hour >= 16 && hour < 20)
					{
						return pChain.minFinish;
					}
					if (hour >= 20 && hour < 23)
					{
						return pChain.minavgFinish;
					}
					if (hour >= 23 || hour < 12)
					{
						return pChain.avgFinish;
					}
					if (hour >= 12 && hour < 16)
					{
						return pChain.minavgFinish;
					}
				} break;
				case 1:
				{
					return pChain.minFinish;
				} break;
				case 2:
				{
					return pChain.minavgFinish;
				} break;
				case 3:
				{
					return pChain.avgFinish;
				} break;
			}
		}
	}
};

/* =============================================================================
 * @@Map
 * ========================================================================== */
M = {
	/*
	 * http://gw2timer.com/zones.js holds an array of zones (e.g. Queensdale, LA)
	 * objects containing their rectangular coordinates.
	 * This is referred to by the variable "M.Zones".
	 */
	Zones: GW2T_ZONES_DATA,
	Nodes: {},
	mousedZoneIndex: -1,
	cURL_API_TILES: "https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg",
	cURL_API_MAPFLOOR: "https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=1",
	cICON_WAYPOINT: "img/event/waypoint.png",
	cICON_PIN_PERSONAL: "img/map/pin_white.png",
	cICON_PIN_PROGRAM: "img/map/pin_blue.png",
	cICON_PIN_EVENT: "img/map/pin_green.png",
	cLEAFLET_PATH_OPACITY: 0.5,
	cLEAFLET_ICON_SIZE: 32,
	cMAP_BOUND: 32768, // The map is a square
	cMAP_CENTER: [16384, 16384],
	cINITIAL_ZOOM_LEVEL: 3,
	cMAX_ZOOM_LEVEL: 7,
	cMAP_MOUSEMOVE_RATE: 100,
	
	// Icons are initially invisible until zoomed in close enough or moused over a zone
	iconWaypoint: L.icon(
	{
		iconUrl: "img/event/waypoint.png",
		iconSize: [16, 16],
		iconAnchor: [8, 8]
	}),
	iconPinPersonal: L.icon(
	{
		iconUrl: "img/map/pin_white.png",
		iconSize: [32, 32],
		iconAnchor: [16, 16]
	}),
	iconPinProgram: L.icon(
	{
		iconUrl: "img/map/pin_blue.png",
		iconSize: [32, 32],
		iconAnchor: [16, 16]
	}),
	iconPinEvent: L.icon(
	{
		iconUrl: "img/map/pin_green.png",
		iconSize: [32, 32],
		iconAnchor: [16, 16]
	}),
	/*
	 * Waypoint markers will be stored in the M.Zones object for each zone.
	 * This is a shortcut reference array for all the waypoints.
	 */
	PinPersonal: {},
	PinProgram: {},
	PinEvent: {},
	Waypoints: new Array(),
	Pins: new Array(), // General Leaflet markers
	PathLayer: {},
	
	/*
	 * Initializes the Leaflet map, adds markers, and binds events.
	 */
	initializeMap: function()
	{
		// M.Map is the actual Leaflet map object, initialize it
		M.Map = L.map("paneMap", {
			minZoom: 0,
			maxZoom: M.cMAX_ZOOM_LEVEL,
			doubleClickZoom: false,
			zoomControl: false, // the zoom UI
			attributionControl: false, // the Leaflet link UI
			crs: L.CRS.Simple
		}).setView([-133, 133], M.cINITIAL_ZOOM_LEVEL);
		
		// Set layers
		L.tileLayer(M.cURL_API_TILES,
		{
			continuousWorld: true
		}).addTo(M.Map);
		
		M.PathLayer = L.layerGroup();
		
		// Initialize array to later hold waypoint map markers
		for (var i in M.Zones)
		{
			M.Zones[i].waypoints = new Array();
		}
		
		// Do other initialization functions
		M.drawChainPaths();
		M.populateMap();

		/*
		 * Clicking an empty place on the map highlight its coordinate.
		 */
		M.Map.on("click", function(pEvent)
		{
			var mouseposition = M.Map.project(pEvent.latlng, M.cMAX_ZOOM_LEVEL);
			$("#mapCoordinatesStatic")
				.val("[" + mouseposition.x + ", " + mouseposition.y + "]")
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
		$("#mapCoordinatesStatic").bind("enterKey", function(pEvent)
		{
			var coord = M.parseCoordinates($(this).val());
			if (coord[0] !== "" && coord.length === 2)
			{
				M.goToView(coord);
				M.PinPersonal.setLatLng(M.convertGCtoLC(coord));
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
			var i, ii1, ii2;
			var mouseposition = M.Map.project(pEvent.latlng, M.cMAX_ZOOM_LEVEL);
			document.getElementById("mapCoordinatesDynamic")
				.value = mouseposition.x + ", " + mouseposition.y;

			/*
			 * Figure out what zone the mouse is over by comparing mouse coordinates
			 * to the top left and bottom right coordinates of the zones.
			 */
			for (i in M.Zones)
			{
				var zonex1 = M.Zones[i].rect[0][0];
				var zoney1 = M.Zones[i].rect[0][1];
				var zonex2 = M.Zones[i].rect[1][0];
				var zoney2 = M.Zones[i].rect[1][1];

				if (mouseposition.x >= zonex1
					&& mouseposition.x <= zonex2
					&& mouseposition.y >= zoney1
					&& mouseposition.y <= zoney2)
				{
					/*
					 * If got here then i is the index of the current moused
					 * zone. To not waste computation, only update the
					 * coordinates bar and reveal the zone waypoints if the
					 * found zone is different from the previously moused zone.
					 */
					if (i !== M.mousedZoneIndex)
					{
						// Note that the master index was initialized as -1
						if (M.mousedZoneIndex !== -1)
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
		}));

		/*
		 * At the end of a zoom animation, resize the map waypoint icons
		 * depending on zoom level. Hide if zoomed too far.
		 */
		M.Map.on("zoomend", function(pEvent)
		{
			var currentzoom = this.getZoom();
			var newiconsize = 0;
			
			// Resize all waypoint icons in all zones
			switch (currentzoom)
			{
				case 7: newiconsize = 32; break;
				case 6: newiconsize = 28; break;
				case 5: newiconsize = 24; break;
				case 4: newiconsize = 20; break;
				case 3: newiconsize = 16; break;
			}
			for (var i in M.Waypoints)
			{
				M.changeMarkerIcon(M.Waypoints[i], M.cICON_WAYPOINT, newiconsize);
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
	 * Macro function for toggling LayerGroup display (Leaflet doesn't have a
	 * hide/show LayerGroup method except through its own UI).
	 * @param object pLayerGroup container of objects like paths and markers.
	 * @param string pDisplay to show or hide.
	 */
	setLayerGroupDisplay: function(pLayerGroup, pDisplay)
	{
		var display;
		if (pDisplay === undefined)
		{
			pDisplay = "toggle";
		}
		switch (pDisplay)
		{
			case "hide": display = "none"; break;
			case "show": display = "block"; break;
			case "toggle":
			{
				pLayerGroup.eachLayer(function(pLayer)
				{
					var currentstyle = pLayer._container.style.display;
					if (currentstyle === "block")
					{
						currentstyle = "none";
					}
					else
					{
						currentstyle = "block";
					}
					return;
				});
			}
		}
		
		pLayerGroup.eachLayer(function(pLayer)
		{
			pLayer._container.style.display = display;
		});
	},
	
	/*
	 * View the map at the specifications.
	 * @param array pCoord two number coordinates.
	 * @param string pZoom level.
	 * @param boolean pWantPin whether to move the program pin icon there.
	 */
	goToView: function(pCoord, pPin, pZoom)
	{
		if (pPin === undefined)
		{
			pPin = M.PinProgram;
		}
		else
		{
			pPin.setLatLng(M.convertGCtoLC(pCoord));
		}
		
		var zoom;
		switch (pZoom)
		{
			case "space": zoom = 3; break;
			case "sky": zoom = 5; break;
			default: zoom = M.cMAX_ZOOM_LEVEL;
		}
		M.Map.setView(M.convertGCtoLC(pCoord), zoom);
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
	 * Convert's Leaflet LatLng to GW2's 2 unit array coordinates.
	 * @param object pLatLng from Leaflet.
	 * @returns array of x and y.
	 */
	convertLCtoGC: function(pLatLng)
	{
		var coord = M.Map.project(pLatLng, M.cMAX_ZOOM_LEVEL);
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
							title: "<span class='mapWP'>" + poi.name + "</span>",
							waypoint: poi.name,
							icon: M.iconWaypoint,
							link: M.getChatlinkFromPoiID(poi.poi_id)
						}).addTo(M.Map);
						// Initially hide all the waypoints
						waypoint._icon.style.display = "none";
						waypoint.on("click", function()
						{
							$("#mapCoordinatesStatic").val(this.options.link).select();
							$("#mapCoordinatesRegion").val(this.options.waypoint);
						});
						
						// Assign the waypoint to its zone
						for (ii in M.Zones)
						{
							if (M.Zones[ii].name === gamemap.name)
							{
								M.Zones[ii].waypoints.push(waypoint);
							}
						}
						// Assign the waypoint to a single pool
						M.Waypoints.push(waypoint);
					}
				}
			}
		}).done(function() // Map is populated by AJAX
		{
			/*
			 * AJAX takes a while so can use this to advantage to delay graphics
			 * that seem out of place without a map loaded.
			 */
			if (O.Options.bol_showChainPaths === true && I.currentContent !== I.ContentEnum.Map)
			{
				M.setLayerGroupDisplay(M.PathLayer, "show");
			}
			// The zoomend event handler doesn't detect the first zoom by prediction
			if (O.Options.bol_tourPrediction && C.CurrentPrimaryEvent.num)
			{
				for (var i in M.Waypoints)
				{
					M.changeMarkerIcon(M.Waypoints[i], M.cICON_WAYPOINT, M.cLEAFLET_ICON_SIZE);
				}
			}
		}).fail(function(){
			I.writeConsole(
				"Guild Wars 2 API server is unreachable.<br />"
				+ "Reasons could be:<br />"
				+ "- The GW2 server is down for maintenance.<br />"
				+ "- Your computer's time is out of sync.<br />"
				+ "- Your browser does not have the necessary features.<br />"
				+ "- This website's code encountered a bug.<br />"
				+ "Map features will be limited.<br />", 30);
		}).always(function() // Do after AJAX regardless of success/failure
		{
			M.bindMapVisualChanges();
			/*
			 * Start tooltip plugin after the markers were loaded, because it
			 * reads the title attribute and convert them into div "tooltips".
			 */
			qTip.init();
		});
		
		/*
		 * Create pin markers that can be moved by user or program.
		 */
		M.PinPersonal = L.marker(M.convertGCtoLC([0,0]),
		{
			icon: M.iconPinPersonal,
			draggable: true
		}).addTo(M.Map);
		M.PinProgram = L.marker(M.convertGCtoLC([0,0]),
		{
			icon: M.iconPinProgram,
			draggable: true
		}).addTo(M.Map);
		M.PinEvent = L.marker(M.convertGCtoLC([0,0]),
		{
			icon: M.iconPinEvent,
			draggable: true
		}).addTo(M.Map);
		// Add to array for iteration
		M.Pins.push(M.PinPersonal);
		M.Pins.push(M.PinProgram);
		M.Pins.push(M.PinEvent);
		
		// Bind pin click event to get coordinates in the coordinates bar
		for (var i in M.Pins)
		{
			M.Pins[i].on("click", function()
			{
				var coord = M.convertLCtoGC(this.getLatLng());
				$("#mapCoordinatesStatic")
					.val("[" + coord[0] + ", " + coord[1] + "]")
					.select();
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
				M.PathLayer.addLayer(L.polyline(coords, {color: color}));
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
					$(this).attr("data-eventcoord", coord[0] + "," + coord[1]);
					// Read the attribute and use the coordinate when clicked
					$(this).click(function()
					{
						var thiscoord = $(this).attr("data-eventcoord").split(",");
						M.goToView(thiscoord, M.PinEvent);
					});
				});
			}
		}
		
		// Initially hide paths, unhide when map populating is complete
		M.PathLayer.addTo(M.Map);
		M.setLayerGroupDisplay(M.PathLayer, "hide");
	},
	
	/*
	 * Binds map view event handlers to all map links in the specified container.
	 * @param string pContainer element ID.
	 */
	bindMapLinks: function(pContainer)
	{
		$(pContainer + " ins").each(function()
		{
			$(this).text("[" + $(this).text() + "]");
			$(this).click(function()
			{
				var thiscoord = M.parseCoordinates($(this).attr("data-coord"));
				M.goToView(thiscoord, M.PinProgram);
			});
		});
	}
	
};

/* =============================================================================
 * @@Time utilities
 * ========================================================================== */
T = {

	cSERVER_UTC_OFFSET: -8, // server is Pacific Time, 8 hours behind UTC
	DST_IN_EFFECT: 0, // will become 1 and added to the server offset if DST is on
	cMILLISECONDS_IN_SECOND: 1000,
	cSECONDS_IN_MINUTE: 60,
	cSECONDS_IN_HOUR: 3600,
	cSECONDS_IN_DAY: 86400,
	cMINUTES_IN_HOUR: 60,
	cMINUTES_IN_DAY: 1440,
	cHOURS_IN_DAY: 24,
	cSECONDS_IN_FRAME: 900,
	cMINUTES_IN_FRAME: 15,
	cNUMFRAMES_IN_HOUR: 4,
	cSECS_F1_MARK: 0,
	cSECS_F2_MARK: 900,
	cSECS_F3_MARK: 1800,
	cSECS_F4_MARK: 2700,
	cSECS_F0_MARK: 3599,

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
	},

	/*
	 * Gets a formatted time string, arguments are taken as name value pairs.
	 * @objparam string reference place to offset the time, default is local.
	 * @objparam boolean want24 to format as 24 hour or not (AM/PM).
	 * @objparam boolean wantLetters to format #h #m #s instead of colons.
	 * @objparam boolean wantSeconds to include the seconds.
	 * @objparam int customTimeInSeconds to convert to a time string, will use
	 * current time if undefined.
	 * @returns 23:59:59 or 11:59:59 PM or 23h 59h 59s time string.
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
					hour = (now.getUTCHours() + T.cSERVER_UTC_OFFSET + T.DST_IN_EFFECT)
						% T.cHOURS_IN_DAY;
					if (hour < 0)
					{
						hour = T.cHOURS_IN_DAY + hour;
					}
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
			pArgs.customTimeInSeconds = pArgs.customTimeInSeconds % T.cSECONDS_IN_DAY;
			if (pArgs.customTimeInSeconds < 0)
			{
				pArgs.customTimeInSeconds = T.cSECONDS_IN_DAY + pArgs.customTimeInSeconds;
			}
			/*
			 * Convert specified seconds to time units. The ~~ gets rid of the
			 * decimal so / behaves like integer divide.
			 */
			sec = pArgs.customTimeInSeconds % 60;
			min = ~~(pArgs.customTimeInSeconds / 60) % 60;
			hour = ~~(pArgs.customTimeInSeconds / 3600);
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
				minsec = min + "." + ((sec < 10) ? "0" + sec : sec);
			}
			else
			{
				minsec = ((min < 10) ? "0" + min : min) + ":" + ((sec < 10) ? "0" + sec : sec);
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
				minsec = ((min < 10) ? "0" + min : min);
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
		if (hour > 12)
		{
			hour = hour % 12;
			period = " PM";
		}
		else if (hour === 0)
		{
			hour = 12;
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
			case "server": hour = hour + T.cSERVER_UTC_OFFSET + T.DST_IN_EFFECT; break;
			case "utc": break;
			case "local":
			{
				 hour = now.getHours();
				 min = now.getMinutes();
				 sec = now.getSeconds();
			} break;
		}
		if (hour < 0)
		{
			hour = hour + T.cHOURS_IN_DAY; // rollover because hour can be calculated to negative
		}

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
	
	awakeTimestampPrevious: 0,
	awakeTimestampTolerance: 5,
	currentFrameOffsetMinutes: 0,
	cClockEventsLimit: 4, // Number of events on the clock
	iconOpacityChecked: 0.4,
	wp0: document.getElementById("itemClockWaypoint0"),
	wp1: document.getElementById("itemClockWaypoint1"),
	wp2: document.getElementById("itemClockWaypoint2"),
	wp3: document.getElementById("itemClockWaypoint3"),
	wpChain0: {}, // These will be DOM elements
	wpChain1: {},
	wpChain2: {},
	wpChain3: {},
	iconChain0: {}, // These will be jQuery "elements"
	iconChain1: {},
	iconChain2: {},
	iconChain3: {},
	iconChains: new Array(),
	wpClipboards: [],
	cWpClipboardDataAttribute: "data-clipboard-text", // Defined by ZeroClipboard
	tickerTimeout: {},

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
	 * Initializes array of clock items for iteration.
	 */
	initializeClockItems: function()
	{
		K.iconChains = null;
		K.iconChains = new Array();
		K.iconChains.push(K.iconChain0);
		K.iconChains.push(K.iconChain1);
		K.iconChains.push(K.iconChain2);
		K.iconChains.push(K.iconChain3);
	},
	
	/*
	 * Update waypoint icons' copy text.
	 * @pre The waypoint icon's position on the clock was updated.
	 */
	updateWaypointsClipboard: function()
	{
		var getTimeTillChainFormatted = function(pChain)
		{
			var secondsleft = C.getSecondsUntilChainStarts(pChain);
			var min = ~~(secondsleft / 60) % 60;
			var hour = ~~(secondsleft / 3600);
			
			min = min + "m";
			if (Math.abs(secondsleft) >= T.cSECONDS_IN_HOUR)
			{
				hour = hour + "h ";
			}
			else
			{
				hour = "";
			}

			return " in " + hour + min;
		};
		var chain0 = C.getCurrentChain();
		var chain1 = C.getCurrentChain(1);
		var chain2 = C.getCurrentChain(2);
		var chain3 = C.getCurrentChain(3);
		var chain4 = C.getCurrentChain(4);
		K.wpChain0.setAttribute(K.cWpClipboardDataAttribute, chain0.waypoint
			+ " " + chain0.alias + getTimeTillChainFormatted(chain0) + " then " + chain1.alias
			+ getTimeTillChainFormatted(chain1) + " - " + I.cSiteName);
		K.wpChain1.setAttribute(K.cWpClipboardDataAttribute, chain1.waypoint
			+ " " + chain1.alias + getTimeTillChainFormatted(chain1) + " then " + chain2.alias
			+ getTimeTillChainFormatted(chain2) + " - " + I.cSiteName);
		K.wpChain2.setAttribute(K.cWpClipboardDataAttribute, chain2.waypoint
			+ " " + chain2.alias + getTimeTillChainFormatted(chain2) + " then " + chain3.alias
			+ getTimeTillChainFormatted(chain3) + " - " + I.cSiteName);
		K.wpChain3.setAttribute(K.cWpClipboardDataAttribute, chain3.waypoint
			+ " " + chain3.alias + getTimeTillChainFormatted(chain3) + " then " + chain4.alias
			+ getTimeTillChainFormatted(chain4) + " - " + I.cSiteName);
	},
	
	/*
	 * Called when the user checks a chain on the checklist, this will see if
	 * that chain is on the clock, and if it is, change visual based on the
	 * check state.
	 * @param string pAlias of the chain to check off in the clock.
	 * @pre iconChains jQuery objects array was initialized and icons are in
	 * proper clock position.
	 */
	checkoffChainIcon: function(pAlias)
	{
		var i;
		var chain;
		var iconchain;
		for (i = 0; i < T.cNUMFRAMES_IN_HOUR; i++)
		{
			chain = C.getCurrentChain(i);
			iconchain = K.iconChains[i];
			if (pAlias === chain.alias)
			{
				if (O.getChainChecklistState(chain) !== O.ChecklistEnum.Unchecked)
				{
					iconchain.css({opacity: K.iconOpacityChecked});
				}
				else
				{
					iconchain.css({opacity: 1});
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
		 * Things in this outer block runs every second, so core JS is used
		 * instead of jQuery for performance.
		 */
		var now = new Date();
		var sec = now.getSeconds();
		var min = now.getMinutes();
		var hour = now.getHours() % 12;
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
		var opacityAdd = 1 - ((min % T.cMINUTES_IN_FRAME)*60 + sec) / (T.cSECONDS_IN_FRAME);
		var clockbackground = document.getElementById("paneClockBackground");
		
		// If crossing a 1 second mark (given)
		C.updateCurrentChainTimeHTML();
		// If crossing a 1 minute mark
		if (sec === 0)
		{
			// Refresh the chain time countdown opted
			if (O.Options.int_useTimeCountdown === 1)
			{
				C.updateChainsTimeHTML();
			}
			K.updateWaypointsClipboard();
		}
		// If crossing a 15 minute mark (IMPORTANT)
		if (min % T.cMINUTES_IN_FRAME === 0 && sec === 0)
		{
			if (O.Options.int_dimClockBackground === 0)
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
			var awaketimestampcurrent = T.getUNIXSeconds();
			if (K.awakeTimestampPrevious < (awaketimestampcurrent - K.awakeTimestampTolerance))
			{
				K.updateTimeFrame(now);
			}
			// Update the timestamp
			K.awakeTimestampPrevious = awaketimestampcurrent;
			
			// Dim the clock background
			if (O.Options.int_dimClockBackground === 0)
			{
				clockbackground.style.opacity = opacityAdd;
			}
		}
		// Tick the two digital clocks below the analog clock
		document.getElementById("itemTimeLocal").innerHTML =
			T.getTimeFormatted();
		document.getElementById("itemTimeServer").innerHTML = "(" +
			T.getTimeFormatted(
			{
				reference: "server",
				wantSeconds: false
			}) + ")";
		// Change the minute hand if passing colored marker
		if (secinhour >= K.currentFrameOffsetMinutes
			&& secinhour < (K.currentFrameOffsetMinutes + C.CurrentChain.minFinish))
		{
			minhand.style.stroke = "lime";
		}
		else if (secinhour >= (K.currentFrameOffsetMinutes + C.CurrentChain.minFinish)
			&& secinhour < (K.currentFrameOffsetMinutes + C.CurrentChain.avgFinish))
		{
			minhand.style.stroke = "orange";
		}
		else if (secinhour >= (K.currentFrameOffsetMinutes + C.CurrentChain.avgFinish))
		{
			minhand.style.stroke = "red";
		}

		// Loop this function, can use variable to halt it
		K.tickerTimeout = setTimeout(K.tickSecond, 1000);
	},

	/*
	 * The megaserver world bosses are spaced by 15 minutes between chain starts
	 * beginning at the hour, so time calculation can be conveniently spaced into
	 * the four quadrants of an analog clock. Most chains last much shorter than that.
	 * Q1: X:00-X:15 (or 12-3 o'clock)
	 * Q2: X:15-X:30 (or 3-6 o'clock)
	 * Q3: X:30-X:45 (or 6-9 o'clock)
	 * Q4: X:45-X:00 (or 9-12 o'clock)
	 */
	updateTimeFrame: function(pTime)
	{
		// Check if server reset happened
		if (O.isSSTimestampOutdated() === true && O.Options.bol_clearOnServerReset === true)
		{
			O.clearServerSensitiveOptions();
		}
		
		// Remember current chain to reference variable
		C.PreviousPreviousChain = C.getCurrentChain(-2);
		C.PreviousChain = C.getCurrentChain(-1);
		C.CurrentChain = C.getCurrentChain();
		C.NextChain = C.getCurrentChain(1);
		
		// Sort the chains list
		C.sortChainsListHTML();
		
		// Queue the highlighting of the current chain's events
		C.queueEventsHighlight();
		
		// Alert of current chain
		if (O.Options.bol_alertAtEnd)
		{
			var checkedcurrent = "";
			var checkednext = "";
			if (O.getChainChecklistState(C.CurrentChain) !== O.ChecklistEnum.Unchecked)
			{
				checkedcurrent = ", checked";
			}
			if (O.getChainChecklistState(C.NextChain) !== O.ChecklistEnum.Unchecked)
			{
				checkednext = ", checked";
			}
			// Don't alert if current boss is checked off and user opted not to hear
			if ( ! (checkedcurrent.length > 0 && O.Options.bol_alertChecked === false))
			{
				I.speak("Current world boss is " + C.CurrentChain.pronunciation
					+ checkedcurrent + ". Followed by " + C.NextChain.pronunciation + checkednext);
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
		$(".itemClockIcon img").each(function()
		{
			$(this).css(
			{
				"border": "1px solid black",
				"box-shadow": "0px 0px 10px black"
			});
		});
		// Macro function for the following conditionals
		var restyleClock = function(pMarkerStart, pMarker0A, pMarker0B, pMarkerNext,
			pMarker1A, pMarker1B, pMarker2A, pMarker2B, pMarker3A, pMarker3B,
			pOffsetMark0, pOffsetMark1, pOffsetMark2, pOffsetMark3)
		{
			// Highlight active chain icon
			K.iconChain0.css(
			{
				"border": "1px solid lime",
				"box-shadow": "0px 0px 10px lime"
			});
			K.iconChain1.css(
			{
				"border": "1px solid green",
				"box-shadow": "0px 0px 10px green"
			});
			// Chain shortcuts
			var chain0 = C.getCurrentChain();
			var chain1 = C.getCurrentChain(1);
			var chain2 = C.getCurrentChain(2);
			var chain3 = C.getCurrentChain(3);
			// Update chain markers
			K.setMarkerAngle(pMarker0A, chain0.minFinish + pOffsetMark0);
			K.setMarkerAngle(pMarker0B, chain0.avgFinish + pOffsetMark0);
			K.setMarkerAngle(pMarker1A, chain1.minFinish + pOffsetMark1);
			K.setMarkerAngle(pMarker1B, chain1.avgFinish + pOffsetMark1);
			K.setMarkerAngle(pMarker2A, chain2.minFinish + pOffsetMark2);
			K.setMarkerAngle(pMarker2B, chain2.avgFinish + pOffsetMark2);
			K.setMarkerAngle(pMarker3A, chain3.minFinish + pOffsetMark3);
			K.setMarkerAngle(pMarker3B, chain3.avgFinish + pOffsetMark3);
			// Update chain icons, fade if checked off
			var fadeIcons = function(pChain, pIcon)
			{
				if (O.getChainChecklistState(pChain) !== O.ChecklistEnum.Unchecked)
				{
					$(pIcon).css({opacity: K.iconOpacityChecked});
				}
				else
				{
					$(pIcon).css({opacity: 1});
				}
			};
			K.iconChain0.attr("src", "img/chain/" + chain0.alias.toLowerCase() + ".png");
			K.iconChain1.attr("src", "img/chain/" + chain1.alias.toLowerCase() + ".png");
			K.iconChain2.attr("src", "img/chain/" + chain2.alias.toLowerCase() + ".png");
			K.iconChain3.attr("src", "img/chain/" + chain3.alias.toLowerCase() + ".png");
			fadeIcons(chain0, K.iconChain0);
			fadeIcons(chain1, K.iconChain1);
			fadeIcons(chain2, K.iconChain2);
			fadeIcons(chain3, K.iconChain3);
			// Colorize the active chain's markers
			$(pMarkerStart).attr("stroke", "lime");
			$(pMarker0A).attr("stroke", "orange");
			$(pMarker0B).attr("stroke", "red");
			$(pMarkerNext).attr("stroke", "green");
		};
		// Recolor the active event's markers and rotate clock sector
		// Note that clock elements' IDs are suffixed with numbers 0-3 for easy iteration
		if (secinhour >= T.cSECS_F1_MARK && secinhour < T.cSECS_F2_MARK)
		{
			K.currentFrameOffsetMinutes = T.cSECS_F1_MARK;
			K.wpChain0 = K.wp0; K.iconChain0 = $("#itemClockIcon0");
			K.wpChain1 = K.wp1; K.iconChain1 = $("#itemClockIcon1");
			K.wpChain2 = K.wp2; K.iconChain2 = $("#itemClockIcon2");
			K.wpChain3 = K.wp3; K.iconChain3 = $("#itemClockIcon3");
			K.rotateClockElement($("#clkSector")[0], 0);
			restyleClock($("#clkMarker0"), $("#clkMarker0A"), $("#clkMarker0B"), $("#clkMarker1"),
				$("#clkMarker1A"), $("#clkMarker1B"), $("#clkMarker2A"), $("#clkMarker2B"), $("#clkMarker3A"), $("#clkMarker3B"),
				T.cSECS_F1_MARK, T.cSECS_F2_MARK, T.cSECS_F3_MARK, T.cSECS_F4_MARK);
		}
		else if (secinhour >= T.cSECS_F2_MARK && secinhour < T.cSECS_F3_MARK)
		{
			K.currentFrameOffsetMinutes = T.cSECS_F2_MARK;
			K.wpChain0 = K.wp1; K.iconChain0 = $("#itemClockIcon1");
			K.wpChain1 = K.wp2; K.iconChain1 = $("#itemClockIcon2");
			K.wpChain2 = K.wp3; K.iconChain2 = $("#itemClockIcon3");
			K.wpChain3 = K.wp0; K.iconChain3 = $("#itemClockIcon0");
			K.rotateClockElement($("#clkSector")[0], 90);
			restyleClock($("#clkMarker1"), $("#clkMarker1A"), $("#clkMarker1B"), $("#clkMarker2"),
				$("#clkMarker2A"), $("#clkMarker2B"), $("#clkMarker3A"), $("#clkMarker3B"), $("#clkMarker0A"), $("#clkMarker0B"),
				T.cSECS_F2_MARK, T.cSECS_F3_MARK, T.cSECS_F4_MARK, T.cSECS_F1_MARK);
		}
		else if (secinhour >= T.cSECS_F3_MARK && secinhour < T.cSECS_F4_MARK)
		{
			K.currentFrameOffsetMinutes = T.cSECS_F3_MARK;
			K.wpChain0 = K.wp2; K.iconChain0 = $("#itemClockIcon2");
			K.wpChain1 = K.wp3; K.iconChain1 = $("#itemClockIcon3");
			K.wpChain2 = K.wp0; K.iconChain2 = $("#itemClockIcon0");
			K.wpChain3 = K.wp1; K.iconChain3 = $("#itemClockIcon1");
			K.rotateClockElement($("#clkSector")[0], 180);
			restyleClock($("#clkMarker2"), $("#clkMarker2A"), $("#clkMarker2B"), $("#clkMarker3"),
				$("#clkMarker3A"), $("#clkMarker3B"), $("#clkMarker0A"), $("#clkMarker0B"), $("#clkMarker1A"), $("#clkMarker1B"),
				T.cSECS_F3_MARK, T.cSECS_F4_MARK, T.cSECS_F1_MARK, T.cSECS_F2_MARK);
		}
		else if (secinhour >= T.cSECS_F4_MARK && secinhour <= T.cSECS_F0_MARK)
		{
			K.currentFrameOffsetMinutes = T.cSECS_F4_MARK;
			K.wpChain0 = K.wp3; K.iconChain0 = $("#itemClockIcon3");
			K.wpChain1 = K.wp0; K.iconChain1 = $("#itemClockIcon0");
			K.wpChain2 = K.wp1; K.iconChain2 = $("#itemClockIcon1");
			K.wpChain3 = K.wp2; K.iconChain3 = $("#itemClockIcon2");
			K.rotateClockElement($("#clkSector")[0], 270);
			restyleClock($("#clkMarker3"), $("#clkMarker3A"), $("#clkMarker3B"), $("#clkMarker0"),
				$("#clkMarker0A"), $("#clkMarker0B"), $("#clkMarker1A"), $("#clkMarker1B"), $("#clkMarker2A"), $("#clkMarker2B"),
				T.cSECS_F4_MARK, T.cSECS_F1_MARK, T.cSECS_F2_MARK, T.cSECS_F3_MARK);
		}
		
		// Refresh waypoints because the icon's clock position changed
		K.updateWaypointsClipboard();
		K.initializeClockItems();
		
		// Rebind the clock chain icons to view map event when clicked
		var i;
		var coord;
		for (i = 0; i < T.cNUMFRAMES_IN_HOUR; i++)
		{
			K.iconChains[i].unbind("click");
			(function(pIndex)
			{
				K.iconChains[pIndex].click(function()
				{
					coord = C.getCurrentChain(pIndex).primaryEvents[0].path[0];
					M.goToView(coord, M.PinEvent);
				});
			})(i);
		}
	},

	/*
	 * Initializes the array containing Zero Clipboard objects.
	 * Each clock waypoint icon (4 img tags) will have the data attribute set to
	 * a waypoint text by the time updater.
	 */
	initializeClipboard: function()
	{
		for (var i = 0; i < K.cClockEventsLimit; i++)
		{
			K.wpClipboards.push
			(
				new ZeroClipboard(document.getElementById("itemClockWaypoint" + i),
				{
					moviePath: "bin/ZeroClipboard.swf"
				})
			);
			/* Zero Clipboard works by overlaying an invisible Flash object over the
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
				});
			});
		}
	}
}; // END OF K OBJECT

/* =============================================================================
 * @@Interface and UI/jQuery bindings in HTML
 * ========================================================================== */
I = {
	cContentPane: "#paneContent",
	cSiteName: "GW2Timer.com",
	consoleTimeout: {},
	
	// HTML/CSS pixel units
	cPANE_CLOCK_HEIGHT: 360,
	cPANE_MENU_HEIGHT: 48,
	cTOOLTIP_DEFAULT_OFFSET_X: -180,
	cTOOLTIP_DEFAULT_OFFSET_Y: 30,
	cTOOLTIP_ADD_OFFSET_Y: 45,
	cTOOLTIP_ADD_OFFSET_X: 35,
	
	ContentEnum:
	{
		// These are the X in "menuX" and "layerX" IDs in the HTML
		Chains: "Chains",
		Map: "Map",
		Help: "Help",
		Options: "Options"
	},
	userBrowser: "Unknown",
	BrowserEnum:
	{
		IE: "MSIE",
		Chrome: "Chrome",
		Firefox: "Firefox",
		Opera: "Opera"
	},
	userSmallScreen: false,
	smallScreenWidth: 800,
	smallScreenHeight: 600,
	
	/*
	 * Loads a TTS sound file generated from a TTS web service into a hidden
	 * iframe. The sound plays automatically after changing the iframe's src via
	 * the browser's builtin media player.
	 * @param string pString to convert to speech.
	 */
	speak: function(pString)
	{
		if (O.Options.bol_enableSound)
		{
			var url;
			var tts = document.getElementById("jsTTS");

			if (I.userBrowser === I.BrowserEnum.Chrome)
			{
				/*
				 * Google TTS seems to only work with their browser; using it on
				 * Firefox gives "Video playback aborted due to a network error"
				 * Note that GTTS has a 100 character URL limit.
				 */
				url = "http://translate.google.com/translate_tts?tl=en&q=" + escape(pString);
			}
			else
			{
				url = "http://tts-api.com/tts.mp3?q=" + escape(pString);
			}
			tts.src = url;
		}
	},
	
	/*
	 * Writes an HTML string to the "console" area in the top left corner of
	 * the website that disappears after a while.
	 * @param string pString to write.
	 * @param int pSeconds until the console is cleared.
	 */
	writeConsole: function(pString, pSeconds)
	{
		$("#jsConsole").html(pString);
		
		window.clearTimeout(I.consoleTimeout);
		I.consoleTimeout = setTimeout(function()
		{
			$("#jsConsole").css({opacity: 1}).animate({opacity: 0}, 400, function()
			{
				$(this).empty().css({opacity: 1});
			});
		}, pSeconds * T.cMILLISECONDS_IN_SECOND);
	},
	
	/*
	 * Does things that need to be done before everything else.
	 * @pre This function is ran before any initialization functions.
	 */
	initializeFirst: function()
	{
		// Clear initial non-load warning the moment JavaScript is ran
		$("#jsConsole").empty();
		
		// Manually clear the TTS iframe to prevent old sound from playing
		document.getElementById("jsTTS").src = "";
		
		// Initial sync of the sleep detection variable
		K.awakeTimestampPrevious = T.getUNIXSeconds();
		
		// Detect small screen devices
		if (window.innerWidth <= I.smallScreenWidth && window.innerHeight <= I.smallScreenHeight)
		{
			I.userSmallScreen = true;
			I.writeConsole("Small screen detected.<br />"
				+ "Map features have been turned off by default for better performance.<br />"
				+ "You can re-enable them in the options.<br />", 10);
			/*
			 * Turn off map features if small screen, note that localStorage will
			 * override these if they were previously stored.
			 */
			O.Options.bol_tourPrediction = false;
			O.Options.bol_showChainPaths = false;
			O.Options.bol_showMap = false;
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
		
		// Remember the program's version
		localStorage[O.programVersionName] = O.programVersion;
		
		// Default content tab
		I.currentContent = I.ContentEnum.Chains;
	},
	
	/*
	 * Gets the ?query=argument&example=etc arguments.
	 * @returns object containing the value pairs.
	 */
	getURLArguments: function()
	{
		var urlargs = window.location.search.substr(1).split('&');

		if (urlargs === "") return {};
		var argsobject = {};
		for (var i = 0; i < urlargs.length; ++i)
		{
			var p = urlargs[i].split("=");
			if (p.length !== 2) continue;
			argsobject[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		return argsobject;
	},
	
	/*
	 * Converts a search to GW2 wiki http link.
	 * @param string pString search entry.
	 * @returns string wiki link.
	 */
	getWikiLink: function(pString)
	{
		pString = pString.replace(/ /g,"_"); // Replace spaces with underscores
		return "http://wiki.guildwars2.com/wiki/" + escape(pString);
	},
	
	/*
	 * Converts a search to YouTube http link.
	 * @param string pString search entry.
	 * @returns string youtube link.
	 */
	getYouTubeLink: function(pString)
	{
		return "http://www.youtube.com/results?search_query=" + escape(pString);
	},
	
	/*
	 * Makes the tooltip appear top of the cursor instead of below if it's too
	 * near the bottom of the window (to avoid overflow).
	 */
	initializeTooltip: function()
	{
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
				qTip.offsetY = -($("#qTip").height()) - I.cTOOLTIP_ADD_OFFSET_Y;
			}
			else
			{
				qTip.offsetY = I.cTOOLTIP_DEFAULT_OFFSET_Y;
			}
			qTip.offsetX = I.cTOOLTIP_DEFAULT_OFFSET_X;
		});
		$("#panelLeft").mousemove(function(pEvent)
		{
			if ($("#qTip").width() + pEvent.pageX + I.cTOOLTIP_ADD_OFFSET_X > $("#paneMap").width())
			{
				qTip.offsetX = -($("#qTip").width());
			}
			else
			{
				qTip.offsetY = -50;
				qTip.offsetX = 0;
			}
		});
	},
	
	/*
	 * Scrolls to an element at specified rate.
	 * @param jqelement pElement to scroll to.
	 * @param jqelement pContainerOfElement container with the scroll bar.
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
	 * Creates a single-level table of content for a composition (writings) layer.
	 * @param string pLayer HTML ID of layer in the content pane.
	 */
	generateTableOfContent: function(pLayer)
	{
		var layername = pLayer.substring(1, pLayer.length);
		$(pLayer + " .jsTableOfContents").append("<h2>Table of Contents</h2><ol></ol>");
		
		// Iterate over every h1 tag in the layer except the first
		$(pLayer + " h1:not(:first)").each(function()
		{
			// Scroll to top when clicked the header
			var headertext = $(this).text();
			var headertextstripped = headertext.replace(/[^a-zA-Z0-9]/, "");
			$(this).html(headertext + "<span class='tocTop'> \u2191</span>");
			$(this).click(function()
			{
				I.scrollToElement($("#jsTOC_" + I.currentContent), $(I.currentContentLayer), "fast");
			}).attr("id", "toc_" + layername + "_" + headertextstripped);
			// Add ToC list entries that scrolls to the headers when clicked
			$("<li>" + headertext + "</li>").appendTo($(pLayer + " .jsTableOfContents ol"))
				.click(function()
				{
					I.scrollToElement($("#toc_" + layername + "_" + headertextstripped),
						$(I.currentContentLayer), "fast");
				});
		});
	},
	
	/*
	 * Binds element with the collapsible class to toggle display of its sibling
	 * container element. Also creates another button-like element at the bottom
	 * of the container to collapse it again.
	 * @param string pLayer HTML ID of layer in the content pane.
	 */
	bindCollapsible: function(pLayer)
	{
		$(pLayer + " .jsCollapsible").each(function()
		{
			var header = $(this);
			header.next().append("<div class='jsCollapsibleDone'>Done reading " + header.text() + "</div>");
			header.next().hide();
			// Bind click the header to toggle the sibling collapsible container
			header.click(function()
			{
				$(this).next().toggle("fast");
				I.scrollToElement($(this), $(pLayer), "fast");
			});
		});
		
		// Bind the additional bottom header to collapse the container
		$(pLayer + " .jsCollapsibleDone").each(function()
		{
			$(this).click(function()
			{
				$(this).parent().hide("fast");		
			});
		});
	},
	
	/*
	 * Initializes all UI.
	 */
	initializeUI: function()
	{
		I.initializeTooltip();
		I.initializeUIforMenu();
		I.initializeUIforChains();
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
		   var cAnimationSpeed = 200;
		   var cFadeOpacity = 0.5;
		   // User hovers over the menu bar
		   $("#paneMenu").hover(
			   function()
			   {
				   $("#paneMenu div").each(function()
				   {
					   // Fade icon not being hovered over
					   if (!$(this).is(":hover"))
					   {
						   $(this).animate({opacity: cFadeOpacity}, cAnimationSpeed);
					   }
				   });
			   },
			   function()
			   {
				   // User moused outside the menu, so stop the animations
				   $("#paneMenu div").finish().each(function()
				   {
					   $(this).animate({opacity: 1}, cAnimationSpeed);
				   });
			   }
		   );
		   // User hovers over individual menu icons
		   $("#paneMenu div").hover(
			   function()
			   {
				   $(this).animate({opacity: 1}, cAnimationSpeed);
			   },
			   function()
			   {
				   $(this).animate({opacity: cFadeOpacity}, cAnimationSpeed);
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
		 * Menu click icon to show respective content layer.
		 */
		$("#paneMenu div").each(function()
		{
			/* The menu buttons' IDs are named as menuSomething, change this if
			 * it was changed in the HTML.
			 */
			var menuprefix = "menu";

			$(this).click(function()
			{
				var layer = $(this).attr("id");
				I.currentContent = layer.substring(menuprefix.length, layer.length);
				I.currentContentLayer = "#layer" + I.currentContent;
				
				if (O.Options.bol_showChainPaths)
				{
					switch (I.currentContent)
					{
						case I.ContentEnum.Chains:
						{
							M.setLayerGroupDisplay(M.PathLayer, "show");
							$("#jsTop").hide();
							/*
							 * Get the current event map view it by triggering
							 * the binded event names.
							 */ 
							if (O.Options.bol_tourPrediction)
							{
								$("#chnEvent_" + C.CurrentChain.alias + "_"
									+ C.CurrentPrimaryEvent.num).trigger("click");
							}
						} break;
						case I.ContentEnum.Help:
						{
							M.setLayerGroupDisplay(M.PathLayer, "show");
							$("#jsTop").show();
						} break;
						case I.ContentEnum.Map:
						{
							M.setLayerGroupDisplay(M.PathLayer, "hide");
							$("#jsTop").show();
						} break;
						default:
						{
							M.setLayerGroupDisplay(M.PathLayer, "show");
							$("#jsTop").hide();
						} break;
					}
				}
				
				$("#paneContent article").hide(); // Hide all layers
				$(I.currentContentLayer + " h1").first()
					.css({opacity: 0}).animate( // Fade in the first header tag
				{
					opacity: 1
				}, 400);
				$(I.currentContentLayer).animate( // Show clicked layer
				{
					width: "show"
				}, 200);
			});
		});

	   /*
		* AJAX load the separate HTML files into the content layer when user
		* clicks on respective menu icon.
		* ----------------------------------------------------------------------
		*/
	   
	   // Macro function for various written content added functionality
		var bindAfterAJAXContent = function(pLayer)
		{
			I.generateTableOfContent(pLayer);
			I.bindCollapsible(pLayer);
			M.bindMapLinks(pLayer);
		};
	   
	   /*
		* Help layer.
		*/
	   $("#menuHelp").click(function()
	   {
		   $("#layerHelp").each(function()
		   {
			   if ($(this).is(":empty"))
			   {
					// Help layer contains map links
					$(this).load("help.html", function()
					{
						bindAfterAJAXContent("#layerHelp");
						
						// Open links on new window
						$("a").attr("target", "_blank");
					});
					// Unbind this event handler
					$("#menuHelp").unbind("mousedown");
			   }
		   });
	   });
	   
	   /*
		* Map layer.
		*/
	   $("#menuMap").click(function()
	   {
		   $("#layerMap").each(function()
		   {
			   if ($(this).is(":empty"))
			   {
					// Help layer contains map links
					$(this).load("map.html", function()
					{
						bindAfterAJAXContent("#layerMap");
						
						// Bind map zone links
						$(".mapZones li").each(function()
						{
							$(this).click(function()
							{
								var thiscoord = M.parseCoordinates($(this).attr("data-coord"));
								M.goToView(thiscoord, M.PinProgram, "sky");
							});
						});
						// Bind JP links
						$(".mapJP dt").each(function()
						{
							var term = $(this).text();
							$(this).after("&nbsp;<a href='" + I.getYouTubeLink(term + " Guild Wars 2")
								+ "'>[Y]</a> <a href='" + I.getWikiLink(term) + "'>[W]</a>");
							$(this).click(function()
							{
								var thiscoord = M.parseCoordinates($(this).attr("data-coord"));
								M.goToView(thiscoord, M.PinProgram);
							});
						});
						// Bind JP checklist
						O.generateAndInitializeJPChecklist();
						// Bind resource node links
						$(".mapNodes dt").each(function()
						{
							$(this).click(function()
							{
								var thiscoord = M.parseCoordinates($(this).attr("data-coord"));
								M.goToView(thiscoord, M.PinProgram);
							});
						});
						// Make URL links open on new window
						$("a").attr("target", "_blank");
					});
					// Unbind this event handler
					$("#menuMap").unbind("mousedown");
			   }
		   });
	   });
	   
	   /*
		* Scroll to top arrow text button.
		*/
		$("#jsTop").click(function()
		{
			$(I.currentContentLayer).animate({scrollTop: 0}, "fast");
		});
	   
	}, // End of menu initialization
	
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
					var container = $("#layer" + I.ContentEnum.Chains);
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
		$(".chnDetails:not(:first)").hide();
		$(".chnTitle h2").click(function()
		{
			$(this).parent().next().slideToggle(100);
		});

		/*
		 * Generate a full timetable of the chains when clicked on that header.
		 */
		$("#headerTimetable").one("click", function(){
		   C.initializeTimetableHTML(); 
		});
	}
};

/* =============================================================
 *  @@Xecutions and jQuery bindings; the order matters!
 * ============================================================= */
T.checkDST(); // tell if DST is in effect
I.initializeFirst(); // initialize variables that need to be first
O.initializeOptions(); // load stored or default options to the HTML input
C.initializeSchedule(); // compute event data and write HTML
O.initializeChainChecklist(); // bind event handlers for checklist
M.initializeMap(); // instantantiate the map and populate it
K.updateTimeFrame(new Date()); // initial refresh of the clock
K.tickSecond(); // start infinite loop clock
K.initializeClipboard(); // bind Flash to the waypoint icons for clipboard
I.initializeUI(); // bind event handlers for misc written content




});//]]>// END OF JQUERY NEST