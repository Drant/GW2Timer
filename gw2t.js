/*
	GW2Timer.com timer, map, and misc single-page application driver.
	jQuery-dependent (v1.11.0), with other plugins in plugins.js.
	Coded in NetBeans; debugged in Opera Dragonfly.
	IDE recommended for viewing and collapsing code sections.
	Version: see int_programVersion - 2014.04.18 created

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
	T - Time utilities
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
 * @@Options for the user, anything that persists after reloading the website.
 * ========================================================================== */
O = {
	lengthOfPrefixes: 3,
	prefixOption: "opt_",
	legalLocalStorageNames: new Array(),

	/*
	 * These utility variables will also be stored in localStorage.
	 * O.Utilities, O.Options, and O.Checklists share a namespace in localStorage
	 * and must together have unique variable names.
	 */
	Utilities:
	{
		programVersion: {name: "int_utlProgramVersion", value: 140605},
		lastLocalResetTimestamp: {name: "int_utlLastLocalResetTimestamp", value: 0}
	},
	
	/*
	 * All of these options must have an associated input tag in the HTML that
	 * users interact with, and their IDs are in the form prefixOption + optionname.
	 * Note the three letter prefix indicating the option's data type.
	 */
	Options:
	{
		// Timer
		bol_hideChecked: false,
		bol_use24Hour: true,
		bol_compactClock: false,
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
	 * A checklist is a set of checkboxes that can have the usual unchecked,
	 * checked, and disabled states. These states are recorded as a single
	 * character in a string of numbers representing those states, and the index
	 * of a character is that checkbox's "ID". The Chl object stores checklist
	 * objects with such a string and a name for localStorage.
	 */
	Checklists:
	{
		// localStorage name-value pair: name is name, list is value
		Chain: { name: "str_chlChain", value: "" },
		JP: { name: "str_chlJP", value: "" },
		Dungeon: { name: "str_chlDungeon", value: "", money: 0 },
		Custom:
		{
			name: "str_chlCustom",
			list: "",
			nameText: "str_chlCustomText",
			textArray: new Array(),
			textArrayDefault: new Array()
		}
	},
	ChecklistEnum:
	{
		Unchecked: 0,
		Checked: 1,
		Disabled: 2
	},
	
	/*
	 * Initializes the array of strings of legal localStorage variable names so
	 * another function can later erase all unrecognized variables.
	 * @pre All legal variable names are unique.
	 */
	initializeLegalLocalStorageNames: function()
	{
		var i;
		for (i in O.Utilities)
		{
			O.legalLocalStorageNames.push(O.Utilities[i].name);
		}
		for (i in O.Options)
		{
			O.legalLocalStorageNames.push(i);
		}
		for (i in O.Checklists)
		{
			O.legalLocalStorageNames.push(O.Checklists[i].name);
		}
	},
	
	/*
	 * Checks localStorage for unrecognized variables and remove them.
	 */
	cleanLocalStorageNames: function()
	{
		var i, ii;
		var name;
		var match;
		for (i = 0; i < localStorage.length; i++)
		{
			name = localStorage.key(i);
			for (ii in O.legalLocalStorageNames)
			{
				if (name === O.legalLocalStorageNames[ii])
				{
					match = true;
					break;
				}
			}
			if (match !== true)
			{
				localStorage.removeItem(name);
			}
			else
			{
				match = false;
			}
		}
	},
	
	/*
	 * URLArguments may contain Options object's variables. Written in the form of:
	 * http://example.com/?ExampleName=ExampleValue&MoreExampleName=MoreExampleValue
	 * so if a user enters http://gw2timer.com/?bol_showClock=false then the clock
	 * will be hidden regardless of previous localStorage or the defaults here.
	 * Note that "bol_showClock" matches exactly as in the Options, otherwise
	 * it would have not overridden any Options variable.
	 */
	URLArguments: {},
	
	/*
	 * Extracts arguments from a https://en.wikipedia.org/wiki/Query_string
	 * @returns object containing the name value pairs.
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
	 * Sanitizes URLArguments value part before overriding. For example:
	 * http://gw2timer.com/?bol_showClock=falsse "falsse" defaults to "true"
	 * @param string pName of an option.
	 * @param string pValue of that option.
	 * @returns string sanitized value.
	 * @pre The name value pair matches the Options object's and numeric values
	 * have the OptionRange object initialized for legal numbers.
	 */
	sanitizeURLOptionsValue: function(pName, pValue)
	{
		var datatype = pName.substring(0, O.lengthOfPrefixes);
		var s = pValue.toLowerCase();
		switch (datatype)
		{
			case "bol":
			{
				if (s === "true" || s === "false")
				{
					return s;
				}
				return O.Options[pName].toString(); // Default boolean
			} break;
			case "int":
			{
				if (isFinite(s)) // Is a number
				{
					var integer = parseInt(s);
					if (integer >= O.OptionRange[pName][0] && integer <= O.OptionRange[pName][1])
					{
						return integer.toString();
					}
				}
				return O.OptionRange[pName][0].toString(); // Default number
			} break;
			case "flt":
			{
				if (isFinite(s)) // Is a number
				{
					var float = parseFloat(s);
					if (float >= O.OptionRange[pName][0] && float <= O.OptionRange[pName][1])
					{
						return float.toString();
					}
				}
				return O.OptionRange[pName][0].toString(); // Default number
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
		localStorage[O.Utilities.lastLocalResetTimestamp.name] = O.Utilities.lastLocalResetTimestamp.value;
	},
	
	/*
	 * Compares the local reset timestamp with yesterday's server reset time
	 * (Midnight 00:00 UTC).
	 * @returns boolean timestamp is outdated or not.
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
	 * URLArguments with same Options object's names (if available) will override both.
	 * @pre The tags are preloaded (not AJAX) and URLArguments was initialized.
	 */
	initializeOptions: function()
	{	
		O.initializeLegalLocalStorageNames();
		
		var optionname;
		for (optionname in O.Options)
		{
			/*
			 * URLArguments overrides localStorage, which overrides Options here
			 * only if such an Options variable exists.
			 */
			if (O.URLArguments[optionname] !== undefined)
			{
				/*
				 * Initialize legal numeric values by looking up the associated
				 * input tag.
				 */
				$("#" + O.prefixOption + optionname).each(function()
				{
					var inputtype = $(this).attr("type");
					if (inputtype === "radio")
					{
						// Range shall be 0 to how many radio buttons there are minus one
						O.OptionRange[optionname] = new Array(0,
							$("fieldset[name=" + optionname + "] input").length - 1);
					}
				});
				// Override localStorage
				localStorage[optionname] = O.sanitizeURLOptionsValue(
					optionname, O.URLArguments[optionname]);
			}
		}
		
		// Load or initialize input options
		for (optionname in O.Options)
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
		if (localStorage[pChecklist.name] === undefined
			|| localStorage[pChecklist.name].length !== pLength)
		{
			O.clearChecklist(pChecklist);
		}
		else
		{
			pChecklist.value = localStorage[pChecklist.name];
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
		var char = pCharacter.toString();
		if (char.length === 1 && pChecklist.value[pIndex] !== char)
		{
			var checklist = O.replaceCharAt(pChecklist.value, pIndex, char);
			localStorage[pChecklist.name] = checklist;
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
		var char = pChecklist.value.charAt(pIndex);
		
		if (pConversion === undefined || pConversion === "int")
		{
			return parseInt(char);
		}
		else if (pConversion === "boolean")
		{
			return O.intToBool(parseInt(char));
		}
		return char;
	},
	
	/*
	 * Sets a checklist object's list to all 0's.
	 * @param object pChecklist to clear.
	 * @param boolean pJob whether to just 0 out the checked items only.
	 * @pre checklist length attribute was initialized.
	 */
	clearChecklist: function(pChecklist, pJob)
	{
		var i;
		var checklist = "";
		if (pJob === "uncheck")
		{
			for (i = 0; i < pChecklist.length; i++)
			{
				if (pChecklist.value[i] === O.ChecklistEnum.Checked.toString())
				{
					checklist += "0";
				}
				else
				{
					checklist += pChecklist.value[i];
				}
			}
		}
		else
		{
			for (i = 0; i < pChecklist.length; i++)
			{
				checklist += "0";
			}
		}
		
		pChecklist.value = checklist;
		localStorage[pChecklist.name] = checklist;
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
			return O.ChecklistEnum.Disabled;
		}
		if (pElement.prop("checked") === true)
		{
			return O.ChecklistEnum.Checked;
		}
		return O.ChecklistEnum.Unchecked;
	},
	
	/*
	 * Sets a checkbox checked/disabled states based on specified enum.
	 * @param jqobject pElement checkbox to change.
	 * @param int pChecklistEnum to apply.
	 */
	setCheckboxEnumState: function(pElement, pChecklistEnum)
	{
		switch (pChecklistEnum)
		{
			case O.ChecklistEnum.Disabled:
			{
				pElement.prop("disabled", true);
				pElement.prop("checked", false);
			} break;
			case O.ChecklistEnum.Checked:
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
		var checkboxstate = O.getCheckboxEnumState(pElement);
		
		if ( (pState === O.ChecklistEnum.Checked && (checkboxstate === O.ChecklistEnum.Unchecked))
			|| (pState === O.ChecklistEnum.Unchecked && (checkboxstate === O.ChecklistEnum.Checked)) )
		{
			pElement.trigger("click");
		}
		else if (pState === O.ChecklistEnum.Disabled && checkboxstate !== O.ChecklistEnum.Disabled)
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
		var checkliststate = O.getChecklistItem(pChecklist, pIndex);
		O.triggerCheckbox(pElement, checkliststate);
	},
	
	/*
	 * Adds style classes to a label that wraps a checkbox depending on its state.
	 * @param object pChecklist to get state.
	 * @param int pIndex of state.
	 * @param jqobject pElement checkbox to style.
	 */
	styleCheckbox: function(pChecklist, pIndex, pElement)
	{
		var state = O.getChecklistItem(pChecklist, pIndex);
		switch (state)
		{
			case O.ChecklistEnum.Disabled:
			{
				pElement.parent().removeClass("chlCheckboxChecked")
					.addClass("chlCheckboxDisabled");
			} break;
			case O.ChecklistEnum.Checked:
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
		
		O.initializeChecklist(O.Checklists.Chain, C.Chains.length);
		
		for (i in C.Chains)
		{
			chain = C.Chains[i];
			
			var bar = $("#barChain_" + chain.alias);
			var check = $("#chnCheck_" + chain.alias);
			
			// Set the checkbox visual state as stored
			switch (O.getChecklistItem(O.Checklists.Chain, chain.index))
			{
				case O.ChecklistEnum.Unchecked:
				{
					// Chain is not checked off, so don't do anything
				} break;
				case O.ChecklistEnum.Checked:
				{
					bar.css({opacity: K.iconOpacityChecked});
					check.addClass("chnChecked");
					if (O.Options.bol_hideChecked)
					{
						bar.hide();
					}
				} break;
				case O.ChecklistEnum.Disabled:
				{
					bar.hide();
				} break;
			}
			
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
				switch (O.getChecklistItem(O.Checklists.Chain, index))
				{
					case O.ChecklistEnum.Unchecked:
					{
						thisbar.css({opacity: 1}).animate({opacity: K.iconOpacityChecked}, K.iconOpacitySpeed);
						$(this).addClass("chnChecked");
						O.setChecklistItem(O.Checklists.Chain, index, O.ChecklistEnum.Checked);
						
					} break;
					case O.ChecklistEnum.Checked:
					{
						thisbar.css({opacity: K.iconOpacityChecked}).animate({opacity: 1}, K.iconOpacitySpeed);
						$(this).removeClass("chnChecked");
						O.setChecklistItem(O.Checklists.Chain, index, O.ChecklistEnum.Unchecked);
					} break;
					case O.ChecklistEnum.Disabled:
					{
						thisbar.show("fast");
						O.setChecklistItem(O.Checklists.Chain, index, O.ChecklistEnum.Disabled);
					} break;
				}
				// Also autohide the chain bar if opted
				if (O.getChecklistItem(O.Checklists.Chain, index) === O.ChecklistEnum.Checked)
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
			
			// Bind the delete chain text button [x]
			$("#chnDelete_" + chain.alias).click(function()
			{
				var alias = I.getIndexFromHTMLID($(this));
				var index = $(this).data("index");
				var thisbar = $("#barChain_" + alias);

				thisbar.hide("slow");
				O.setChecklistItem(O.Checklists.Chain, index, O.ChecklistEnum.Disabled);
				
				// Also update the clock icon
				K.checkoffChainIcon(alias);
			});
		}
		
		$(".chnDetails").hide();
	},
	
	/*
	 * Gets the checklist state of a chain.
	 * @param object pChain chain to test.
	 * @returns int state (use enum).
	 */
	getChainChecklistState: function(pChain)
	{
		return O.getChecklistItem(O.Checklists.Chain, pChain.index);
	},
	
	/*
	 * Binds dungeon checkbox storage and calculator behavior.
	 */
	initializeDungeonChecklist: function()
	{
		O.initializeChecklist(O.Checklists.Dungeon, $("#chlDungeon input").length);
		
		// Load dungeon icons on demand because they are pretty large
		$("#chlDungeon .chlDungeonBar").each(function()
		{
			$(this).prepend("<img src='img/dungeon/"
				+ $(this).data("name").toLowerCase() + I.cImageMainExtension + "' />");
		});
		
		var updateCalculator = function()
		{
			var money = O.Checklists.Dungeon.money;
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
				var state = O.getCheckboxEnumState($(this));
				
				O.setChecklistItem(O.Checklists.Dungeon, pIndex, state);
				O.styleCheckbox(O.Checklists.Dungeon, pIndex, $(this));
				
				// Sum the checkbox's path money
				var calc = $("#chlDungeonCalculator");
				var money = O.Checklists.Dungeon.money;
				var sum = $(this).data("money");
				
				switch ($(this).data("mode"))
				{
					case "E": sum += calc.data("moneyaddexp"); break;
				}
				
				switch (state)
				{
					case O.ChecklistEnum.Disabled:
					{
						O.Checklists.Dungeon.money = money - sum;
					} break;
					case O.ChecklistEnum.Checked:
					{
						O.Checklists.Dungeon.money = money + sum;
					} break;
					default:
					{
						O.Checklists.Dungeon.money = money - sum;
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
						O.triggerCheckbox(checkbox, O.ChecklistEnum.Unchecked);
					}
					checkbox.prop("disabled", true).prop("checked", false);
				}
				else
				{
					checkbox.prop("disabled", false);
				}
				O.setChecklistItem(O.Checklists.Dungeon, pIndex, O.getCheckboxEnumState(checkbox));
				O.styleCheckbox(O.Checklists.Dungeon, pIndex, checkbox);
			});
		});
		
		// Restore checklist state from stored by triggering the checkboxes (behaviors already bound)
		$("#chlDungeon input").each(function(pIndex)
		{
			O.triggerCheckboxEnumState(O.Checklists.Dungeon, pIndex, $(this));
		});
		
		// Bind uncheck all button
		$("#chlDungeonUncheck").click(function()
		{
			O.clearChecklist(O.Checklists.Dungeon, "uncheck");
			$("#chlDungeon input").each(function(pIndex)
			{
				if ($(this).prop("checked") === true)
				{
					$(this).trigger("click");
				};
				O.styleCheckbox(O.Checklists.Dungeon, pIndex, $(this));
			});
		});
	},
	
	/*
	 * Binds checkbox and text field joined behavior.
	 */
	initializeCustomChecklist: function()
	{
		var checkboxes = $("#chlCustom input:checkbox");
		O.initializeChecklist(O.Checklists.Custom, checkboxes.length);
		
		checkboxes.each(function(pIndex)
		{
			$(this).change(function()
			{
				var state = O.getCheckboxEnumState($(this));
				
				O.setChecklistItem(O.Checklists.Custom, pIndex, state);
				O.styleCheckbox(O.Checklists.Custom, pIndex, $(this));
				
				if (state === O.ChecklistEnum.Checked)
				{
					$(this).parent().next().addClass("chlCustomTextChecked");
				}
				else
				{
					$(this).parent().next().removeClass("chlCustomTextChecked");
				}
			});
			
			// Now that this checkbox is bounded, trigger it as the state in checklist
			O.triggerCheckboxEnumState(O.Checklists.Custom, pIndex, $(this));
			
			// Initialize default value of associated text field
			var text = $(this).parent().next().val();
			O.Checklists.Custom.textArray.push(text);
			O.Checklists.Custom.textArrayDefault.push(text);
		});
		
		// Bind uncheck all button
		$("#chlCustomUncheck").click(function()
		{
			O.clearChecklist(O.Checklists.Custom, "uncheck");
			$("#chlCustom input:checkbox").each(function(pIndex)
			{
				if ($(this).prop("checked") === true)
				{
					$(this).trigger("click");
				};
				O.styleCheckbox(O.Checklists.Custom, pIndex, $(this));
			});
		});
		
		/*
		 * Each text fields' value will become a delimited substring in one
		 * single string to be stored in localStorage.
		 */
		var i;
		if (localStorage[O.Checklists.Custom.nameText] === undefined)
		{
			// If localStorage value is empty, replace with original values in text field
			localStorage[O.Checklists.Custom.nameText] = O.Checklists.Custom.textArray.join(I.cTextDelimiter);
		}
		else
		{
			var storedtextarray = localStorage[O.Checklists.Custom.nameText].split(I.cTextDelimiter);
			if (storedtextarray.length === O.Checklists.Custom.textArray.length)
			{
				// Load the stored text if it has same number of strings as there are text fields
				for (i in storedtextarray)
				{
					O.Checklists.Custom.textArray[i] = storedtextarray[i];
				}
			}
			else
			{
				localStorage[O.Checklists.Custom.nameText] = O.Checklists.Custom.textArray.join(I.cTextDelimiter);
			}
		}
		
		var updateStoredText = function()
		{
			var regex = "/\\" + I.cTextDelimiter + "/g";
			// Read every text fields and rewrite the string of substrings again
			$("#chlCustom input:text").each(function(pIndex)
			{
				O.Checklists.Custom.textArray[pIndex] = $(this).val().replace(regex, "");
			});
			localStorage[O.Checklists.Custom.nameText] = O.Checklists.Custom.textArray.join(I.cTextDelimiter);
		};
		
		// Bind text fields behavior
		$("#chlCustom input:text").each(function(pIndex)
		{
			// Set number of characters allowed in the text field
			$(this).attr("maxlength", "48");
			$(this).val(O.Checklists.Custom.textArray[pIndex]); // Load initialized text
			
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
				$(this).val(O.Checklists.Custom.textArrayDefault[pIndex]).trigger("change");
			});
		});
	},
	
	/*
	 * Unchecks the checklist and clear variables, but ignore chains deleted
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
				if (O.getChecklistItem(O.Checklists.Chain, chain.index) !== O.ChecklistEnum.Disabled)
				{
					$("#barChain_" + chain.alias).show();
				}
			}
			O.clearChecklist(O.Checklists.Chain, "uncheck");
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
				localStorage.removeItem(O.Checklists.Dungeon.name);
				localStorage.removeItem(O.Checklists.Custom.name);
			}
			I.write("Personal checklist cleared as opted.", messagetime);
		}
		
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
		});
		$("#opt_bol_alertSubscribed").change(function()
		{
			O.enact_bol_alertSubscribed();
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
			O.clearChecklist(O.Checklists.Chain);
			// Also unfade the clock icons, which are the current first four bosses
			for (i = 0; i < T.cNUMFRAMES_IN_HOUR; i++)
			{
				K.checkoffChainIcon(C.getCurrentChain(i).alias);
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
			var s = "";
			for (var i = 0; i < localStorage.length; i++)
			{
				var name = O.escapeHTML(localStorage.key(i));
				var value = O.escapeHTML(localStorage.getItem(name));
				s += name + ": " + value + "<br />";
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
			if (O.getChecklistItem(O.Checklists.Chain, $(this).data("index"))
				=== O.ChecklistEnum.Checked)
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
		var animationspeed = 200;
		var clockheight = 0;
		if (O.Options.bol_compactClock)
		{
			// Reposition clock items
			I.bulkAnimate([
				{s: "#itemClockFace img", p: {"border-radius": "32px"}},
				{s: "#itemClock", p: {top: "0px"}},
				{s: "#itemClockIcon0", p: {top: "4px", left: "290px"}},
				{s: "#itemClockIcon1", p: {top: "148px", left: "290px"}},
				{s: "#itemClockIcon2", p: {top: "148px", left: "4px"}},
				{s: "#itemClockIcon3", p: {top: "4px", left: "4px"}},
				{s: "#itemClockWaypoint0", p: {top: "24px", left: "274px"}},
				{s: "#itemClockWaypoint1", p: {top: "164px", left: "274px"}},
				{s: "#itemClockWaypoint2", p: {top: "164px", left: "52px"}},
				{s: "#itemClockWaypoint3", p: {top: "24px", left: "52px"}}
			], animationspeed);
			$("#itemTimeLocal").css({
				width: "100%",
				left: "auto", bottom: "90px",
				"text-align": "center",
				color: "#eee",
				opacity: 0.5
			});
			$("#itemTimeServer").css({
				width: "100%",
				top: "90px", bottom: "auto", right: "auto",
				"text-align": "center",
				color: "#eee",
				opacity: 0.5
			});
			$("#itemSocial").css({ bottom: "98px", right: "10px" });
			
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
				{s: "#itemClockFace img", p: {"border-radius": "12px"}},
				{s: "#itemClock", p: {top: "70px"}},
				{s: "#itemClockIcon0", p: {top: "4px", left: "148px"}},
				{s: "#itemClockIcon1", p: {top: "148px", left: "290px"}},
				{s: "#itemClockIcon2", p: {top: "290px", left: "148px"}},
				{s: "#itemClockIcon3", p: {top: "148px", left: "4px"}},
				{s: "#itemClockWaypoint0", p: {top: "52px", left: "164px"}},
				{s: "#itemClockWaypoint1", p: {top: "164px", left: "274px"}},
				{s: "#itemClockWaypoint2", p: {top: "274px", left: "164px"}},
				{s: "#itemClockWaypoint3", p: {top: "164px", left: "52px"}}
			], animationspeed);
			$("#itemTimeLocal").css({
				width: "auto",
				left: "10px", bottom: "10px",
				"text-align": "left",
				color: "#bbcc77",
				opacity: 1
			});
			$("#itemTimeServer").css({
				width: "auto",
				top: "auto", bottom: "10px", right: "10px",
				"text-align": "left",
				color: "#bbcc77",
				opacity: 1
			});
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
	},
	enact_bol_alertSubscribed: function()
	{
		$("#listChainsScheduled .chnTitle h2").each(function()
		{
			var details = $(this).parent().next();
			// Highlight opened chain details if subscribe option on
			if (O.Options.bol_alertSubscribed)
			{
				if (details.css("display") !== "none")
				{
					$(this).addClass("chnTitleSubscribed");
				}
				else
				{
					$(this).removeClass("chnTitleSubscribed");
				}
			}
			else
			{
				// Restore to standard chain bar view if subscribe option off
				$(this).removeClass("chnTitleSubscribed");
				$("#listChainsScheduled .chnDetails").first().show();
				$("#listChainsScheduled .chnDetails:not(:first)").hide();
			}
		});
	}
};

/* =============================================================================
 * @@Chains of events
 * ========================================================================== */
C = {
	
	/*
	 * http://gw2timer.com/metas.js holds an array of meta event chain objects,
	 * which themselves contain an array of their events.
	 * This is referred to by the variable "C.Chains".
	 */
	Chains: GW2T_CHAINS_DATA,
	CurrentChain: {},
	PreviousChain: {},
	PreviousPreviousChain: {},
	NextChain: {},
	NextNextChain: {},
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
			C.Taidha, C.Maw, C.Megades, C.FE,     // 14
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
		
		// Finally bind event handlers for the chain checklist
		O.initializeChainChecklist();
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
		var chainhtmlid = "";
		
		switch (pChain.series)
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
		"<div id='barChain_" + pChain.alias + "' class='barChain' data-index='" + pChain.index + "'>"
			+ "<div class='chnTitle'>"
				+ "<img src='img/chain/" + C.parseChainAlias(pChain.alias).toLowerCase() + ".png' />"
				+ "<div id='chnCheck_" + pChain.alias + "' class='chnCheck' data-index='" + pChain.index + "'></div>"
				+ "<h2>" + C.truncateTitleString(pChain.title, C.cChainTitleCharLimit) + "</h2>"
				+ "<time id='chnTime_" + pChain.alias + "'></time>"
			+ "</div>"
			+ "<div id='chnDetails_" + pChain.alias + "' class='chnDetails'>"
				+ "<ol id='chnEvents_" + pChain.alias + "' class='chnEvents'></ol>"
				+ "<div class='chnDetailsLinks'>"
					+ "<ins id='chnDelete_" + pChain.alias + "' data-index='" + pChain.index + "' title='Permanently hide this event chain (can undo in options).'>[x]</ins>"
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
			/*
			 * iterated event's xxxSum = the previous primary event's xxx time
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
		/*
		 * min time for the entire chain to finish is the final primary event's
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
		if (pChain.series === 0) // Scheduled events need to remember concurrent events
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
				// Minus 1 because the event numbers are 1 indexed
				C.Chains[i].events[ii].step = parseInt(C.Chains[i].events[ii].num.charAt(0)) - 1;
			}
			
			C.Chains[i].index = i;
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
	 * Tells if a chain check state is intact (not checked off or deleted).
	 * @param object pChain to get state.
	 * @returns boolean unchecked or not.
	 */
	isChainUnchecked: function(pChain)
	{
		if (O.getChainChecklistState(pChain) === O.ChecklistEnum.Unchecked)
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
	isChainBarOpen: function(pChain)
	{
		if ($("#chnDetails_" + pChain.alias).css("display") !== "none")
		{
			return true;
		}
		return false;
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
			spacer = (parseInt(ii) === 0) ? "<dfn>Schedule:</dfn><br />" : " <br /> ";
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
			
			switch (O.Options.int_setTimeStyle)
			{
				case 0:
				{
					time = C.getSecondsUntilChainStarts(ithchain);
					wantletters = true;
				} break;
				case 1:
				{
					time = C.convertScheduleIndexToLocalTime(ithchain.scheduleIndexes[0]);
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
	 * Updates the current chain bar's time as a countup since it began.
	 */
	updateCurrentChainTimeHTML: function()
	{
		var wantletters = false;
		if (O.Options.int_setTimeStyle === 0)
		{
			wantletters = true;
		}
		
		$("#chnTime_" + C.CurrentChain.alias).text("-" + T.getTimeFormatted(
			{
				want24: true,
				wantHours: false,
				wantLetters: wantletters,
				customTimeInSeconds: C.getCurrentChainElapsedTime()
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
		var ithchain;
		var timestring;
		for (var i in C.cSchedule)
		{
			ithchain = C.cSchedule[i];
			timestring = T.getTimeFormatted(
			{
				wantSeconds: false,
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
		O.enact_int_setTimeStyle();
		
		/*
		 * Now that the chains are sorted, do cosmetic updates.
		 */
		// Highlight and show the current chain bar
		$("#barChain_" + C.CurrentChain.alias).addClass("chnBarCurrent");
		// Show the current chain's pre events (details) only if subscription (by opening chain bars) is off
		if (O.Options.bol_alertSubscribed === false)
		{
			$("#chnDetails_" + C.CurrentChain.alias).show("fast");
		}
		// Still highlight the previous chain bar but collapse it
		$("#barChain_" + C.PreviousChain.alias)
			.removeClass("chnBarCurrent").addClass("chnBarPrevious");
		$("#chnDetails_" + C.PreviousChain.alias).hide();
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
			C.CurrentPrimaryEvent = pChain.primaryEvents[pPrimaryEventIndex];
			
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
			if (O.Options.bol_tourPrediction && I.contentCurrent === I.ContentEnum.Chains
					&& M.isMapAJAXDone)
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
			 * not past the timeframe, and the subscription option is off.
			 */
			if (O.Options.bol_alertAtEnd && pChain.alias === C.CurrentChain.alias
					&& O.Options.bol_alertSubscribed === false)
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
 * @@Map and map controls
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
	cLEAFLET_PATH_OPACITY: 0.5,
	cLEAFLET_ICON_SIZE: 32,
	cMAP_BOUND: 32768, // The map is a square
	cMAP_CENTER: [16384, 16384],
	cZOOM_LEVEL_DEFAULT: 3,
	cZOOM_LEVEL_MAX: 7,
	cMAP_MOUSEMOVE_RATE: 100,
	
	// Icons are initially invisible until zoomed in close enough or moused over a zone
	iconWaypoint: L.icon(
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
			maxZoom: M.cZOOM_LEVEL_MAX,
			doubleClickZoom: false,
			zoomControl: false, // the zoom UI
			attributionControl: false, // the Leaflet link UI
			crs: L.CRS.Simple
		}).setView([-128, 128], M.cZOOM_LEVEL_DEFAULT);
		
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
		M.drawChainPaths();
		M.populateMap();

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
		$("#mapCoordinatesStatic").bind("enterKey", function(pEvent)
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
	 * @param string pZoom level.
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
		switch (pZoom)
		{
			case "space": zoom = 3; break;
			case "sky": zoom = 5; break;
			default: zoom = M.cZOOM_LEVEL_MAX;
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
		var coord = M.Map.project(pLatLng, M.cZOOM_LEVEL_MAX);
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
							icon: M.iconWaypoint,
							link: M.getChatlinkFromPoiID(poi.poi_id)
						}).addTo(M.Map);
						// Initially hide all the waypoints
						waypoint._icon.style.display = "none";
						// Bind behavior
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
			if (O.Options.bol_showChainPaths === true && I.contentCurrent !== I.ContentEnum.Map)
			{
				M.setEntityGroupDisplay(M.ChainPathEntities, "show");
			}
			/*
			 * Start tooltip plugin after the markers were loaded, because it
			 * reads the title attribute and convert them into a div "tooltip".
			 */
			I.qTip.init(".leaflet-marker-icon");
			// The zoomend event handler doesn't detect the first zoom by prediction
			if (O.Options.bol_tourPrediction && I.contentCurrent === I.ContentEnum.Chains
				&& C.CurrentPrimaryEvent.num !== undefined)
			{
				for (var i in M.WaypointEntities)
				{
					M.changeMarkerIcon(M.WaypointEntities[i], M.cICON_WAYPOINT, M.cLEAFLET_ICON_SIZE);
				}
			}
			// Tour to the event on the map if opted
			if (O.Options.bol_tourPrediction && I.contentCurrent === I.ContentEnum.Chains)
			{
				$("#chnEvent_" + C.CurrentChain.alias + "_" + C.CurrentPrimaryEvent.num).trigger("click");
			}
		}).fail(function(){
			I.write(
				"Guild Wars 2 API server is unreachable.<br />"
				+ "Reasons could be:<br />"
				+ "- The GW2 server is down for maintenance.<br />"
				+ "- Your computer's time is out of sync.<br />"
				+ "- Your browser is too old (if IE then need 11+).<br />"
				+ "- This website's code encountered a bug.<br />"
				+ "Map features will be limited.<br />", 30);
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
			if (M.Map.getZoom() === M.cZOOM_LEVEL_MAX)
			{
				M.Map.setZoom(M.cZOOM_LEVEL_DEFAULT);
			}
			else
			{
				M.Map.setView(pEvent.latlng, M.cZOOM_LEVEL_MAX);
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
		O.Checklists.JP.length = $(".mapJPList dt").length;
		
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
		for (i = 0; i < O.Checklists.JP.length; i++)
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
		O.initializeChecklist(O.Checklists.JP, O.Checklists.JP.length);
		
		var i;
		for (i = 0; i < O.Checklists.JP.length; i++)
		{
			$("#mapJPCheck_" + i).each(function()
			{
				/*
				 * Read and enact the state of the JP checklist.
				 */
				// Convert the digit at ith position in the checklist string to boolean
				var stateinstring = O.getChecklistItem(O.Checklists.JP, i, "boolean");
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
				var checkboxstate = O.getCheckboxEnumState($(this));
				var checkboxindex = parseInt(I.getIndexFromHTMLID($(this)));
				if (checkboxstate === O.ChecklistEnum.Unchecked)
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
				O.setChecklistItem(O.Checklists.JP, checkboxindex, checkboxstate);
				
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
					if (M.Map.getZoom() === M.cZOOM_LEVEL_MAX)
					{
						M.Map.setZoom(M.cZOOM_LEVEL_DEFAULT);
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
			for (i = 0; i < O.Checklists.JP.length; i++)
			{
				$("#mapJPCheck_" + i).prop("checked", false)
					.parent().prev().removeClass("mapJPListNameHover");
				M.styleJPMarkers(M.JPEntities[i], M.JPEntities[i].options.dif);
				
				jpchecklist += "0";
			}
			O.Checklists.JP.value = jpchecklist;
			localStorage[O.Checklists.JP.name] = O.Checklists.JP.value;
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
		
		// If user lives in the Americas then use AM/PM time format by default
		T.cUTC_OFFSET_USER = -((new Date()).getTimezoneOffset() / T.cMINUTES_IN_HOUR);
		if (T.cUTC_OFFSET_USER <= T.cUTC_OFFSET_EASTERN
			&& T.cUTC_OFFSET_USER >= T.cUTC_OFFSET_HAWAII)
		{
			O.Options.bol_use24Hour = false;
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
					hour = (now.getUTCHours() + T.cUTC_OFFSET_SERVER + T.DST_IN_EFFECT)
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
			case "server": hour = hour + T.cUTC_OFFSET_SERVER + T.DST_IN_EFFECT; break;
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
			hour = hour + T.cHOURS_IN_DAY; // Rollover because hour can be calculated to negative
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
	iconOpacitySpeed: 200,
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
	 * Updates waypoint icons' copy text.
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
		T.TIMESTAMP_UNIX_SECONDS = T.getUNIXSeconds();
		T.SECONDS_TILL_RESET = T.cSECONDS_IN_DAY - T.getTimeOffsetSinceMidnight("utc", "seconds");
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
			if (O.Options.int_setTimeStyle === 0)
			{
				C.updateChainsTimeHTML();
			}
			K.updateWaypointsClipboard();
		}
		// If crossing a 15 minute mark (IMPORTANT)
		if (min % T.cMINUTES_IN_FRAME === 0 && sec === 0)
		{
			if (O.Options.int_setClockBackground === 0)
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
			if (O.Options.int_setClockBackground === 0)
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
		O.checkResetTimestamp();
		
		// Remember current chain to reference variable
		C.PreviousPreviousChain = C.getCurrentChain(-2);
		C.PreviousChain = C.getCurrentChain(-1);
		C.CurrentChain = C.getCurrentChain();
		C.NextChain = C.getCurrentChain(1);
		C.NextNextChain = C.getCurrentChain(2);
		
		// Sort the chains list
		C.sortChainsListHTML();
		
		// Queue the highlighting of the current chain's events
		C.queueEventsHighlight();
		
		// Alert of current chain
		if (O.Options.bol_alertAtEnd && O.Options.bol_alertSubscribed === false)
		{
			var checkedcurrent = "";
			var checkednext = "";
			if (C.isChainUnchecked(C.CurrentChain) === false)
			{
				checkedcurrent = ", checked";
			}
			if (C.isChainUnchecked(C.NextChain) === false)
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
		// Alert of subscribed chain (to subscribe is to expand a chain bar)
		if (O.Options.bol_alertSubscribed === true)
		{
			var speech1;
			var speech2;
			var averagespeechtime = 8000;
			
			if (C.isChainBarOpen(C.NextChain) && C.isChainUnchecked(C.NextChain))
			{
				speech1 = "Subscribed world boss " + C.NextChain.pronunciation + ", will start in 15 minutes. ";
			}
			if (C.isChainBarOpen(C.NextNextChain) && C.isChainUnchecked(C.NextNextChain))
			{
				speech2 = "Subscribed world boss " + C.NextNextChain.pronunciation + ", will start in half an hour";
			}
			
			if (speech1 !== undefined && speech2 === undefined)
			{
				I.speak(speech1);
			}
			else if (speech1 === undefined && speech2 !== undefined)
			{
				I.speak(speech2);
			}
			else if (speech1 !== undefined && speech2 !== undefined)
			{
				/*
				 * If have to speak both bosses then have to split the speech
				 * because of a 100 character limit for Google TTS
				 */
				I.speak(speech1);

				(function(pSpeech, pWait)
				{
					setTimeout(function()
					{
						I.speak(pSpeech);
					}, pWait);
				})(speech2, averagespeechtime);
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
		$("#itemClockFace img").each(function()
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
			K.iconChain0.attr("src", "img/chain/" + chain0.alias.toLowerCase() + I.cImageMainExtension);
			K.iconChain1.attr("src", "img/chain/" + chain1.alias.toLowerCase() + I.cImageMainExtension);
			K.iconChain2.attr("src", "img/chain/" + chain2.alias.toLowerCase() + I.cImageMainExtension);
			K.iconChain3.attr("src", "img/chain/" + chain3.alias.toLowerCase() + I.cImageMainExtension);
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
					I.write("Chat link copied to clipboard :)<br />" + $(this).data("clipboard-text"), 5);
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
	cContentPane: "#paneContent",
	cContentPrefix: "#layer",
	cMenuPrefix: "#menu",
	ContentEnum:
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
	prefixPage: "page",
	prefixSection: "section",
	
	// User information
	userBrowser: "Unknown",
	BrowserEnum:
	{
		IE: "MSIE",
		Chrome: "Chrome",
		Firefox: "Firefox",
		Opera: "Opera"
	},
	userSmallDevice: false,
	cSMALL_DEVICE_WIDTH: 800,
	cSMALL_DEVICE_HEIGHT: 600,
	cSMALL_DISPLAY_HEIGHT: 900,
	
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
		
		/*
		 * Loaded stored server sensitive timestamp if it exists, is a number,
		 * and not from the future, else initialize it.
		 */ 
		var currenttimestamp = T.getUNIXSeconds();
		var storedtimestamp = parseInt(localStorage[O.Utilities.lastLocalResetTimestamp.name]);
		if (localStorage[O.Utilities.lastLocalResetTimestamp.name] === undefined
			|| isFinite(storedtimestamp) === false
			|| storedtimestamp > currenttimestamp)
		{
			O.Utilities.lastLocalResetTimestamp.value = currenttimestamp;
			localStorage[O.Utilities.lastLocalResetTimestamp.name] = O.Utilities.lastLocalResetTimestamp.value;
		}
		else
		{
			O.Utilities.lastLocalResetTimestamp.value = storedtimestamp;
		}
		
		// Initial sync of the sleep detection variable
		K.awakeTimestampPrevious = currenttimestamp;
		
		// Parse and store the URL arguments
		O.URLArguments = O.getURLArguments();
		
		// Detect small devices
		if (window.innerWidth <= I.cSMALL_DEVICE_WIDTH && window.innerHeight <= I.cSMALL_DEVICE_HEIGHT)
		{
			I.userSmallDevice = true;
			I.write("Small device detected.<br />"
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
		// Detect small displays
		if (window.innerHeight <= I.cSMALL_DISPLAY_HEIGHT)
		{
			O.Options.bol_compactClock = true;
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
		localStorage[O.Utilities.programVersion.name] = O.Utilities.programVersion.value;
		
		// Default content layer
		I.contentCurrent = I.ContentEnum.Chains;
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
		I.enactURLArguments();
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
		I.convertExternalLink("#itemMapButtons a");
		// Fix Firefox SVG filter bug
		K.reapplyFilters();
		
		// Clean the localStorage of unrecognized variables
		O.cleanLocalStorageNames();
	},
	
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
	 * @param int pSeconds to display the console with that string.
	 * @param boolean pClear to empty the console before printing.
	 * @pre if input was from an outside source it must be escaped first!
	 */
	write: function(pString, pSeconds, pClear)
	{
		$("#jsConsoleButtons").show();
		var console = $("#jsConsole");
		var characterspersecond = 48;
		
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
			var pagestring = "?" + I.prefixPage + "=" + I.contentCurrent;
			var sectionstring = "&" + I.prefixSection + "=" + section;
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
			if (O.URLArguments[I.prefixSection] !== undefined)
			{
				$(I.cHeaderPrefix + I.contentCurrent + "_"
					+ O.URLArguments[I.prefixSection]).trigger("click");
			}
		}, 0);
	},
	
	/*
	 * Does the commands within the address bar after the site's domain name.
	 * @pre URLArguments object was initialized by extraction.
	 */
	enactURLArguments: function()
	{
		var i;
		// Go to the page (content layer) requested, as in "openPageFromURL()"
		if (O.URLArguments[I.prefixPage] !== undefined)
		{
			for (i in I.ContentEnum)
			{
				if (O.URLArguments[I.prefixPage].toLowerCase() === I.ContentEnum[i].toLowerCase())
				{
					$(I.cMenuPrefix + I.ContentEnum[i]).trigger("click");
				}
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
	 * Extracts the "index" part of an HTML element's ID. Most iterable elements'
	 * IDs were manually named as [prefix]_[Index].
	 * @param jqobject pElement to extract.
	 * @returns string name of the element's ID.
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
	 * Selects text from an element (as if a user clicked on text and dragged
	 * mouse to select the text).
	 * @param string pSelector to get the element with text.
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
			var headertext = header.text();
			// Hide the entire collapsible div tag next to the header tag
			header.next().hide();
			header.wrapInner("<span></span>");
			header.append("&nbsp;<sup>[+]</sup>");
			
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
			$("<div class='jsSectionDone'>Done reading " + headertext + "</div>")
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
				+ "title='&lt;dfn&gt;Section: &lt;/dfn&gt;" + headertext + "' />")
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
				if ($(this).next().is(":visible"))
				{
					$(this).text("[?+]");
				}
				else
				{
					$(this).text("[?-]");
				}
				$(this).next().toggle();
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
					case I.ContentEnum.Chains:
					{
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
						$("#jsTop").show();
					} break;
					case I.ContentEnum.Map:
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
					if (I.contentCurrent === I.ContentEnum.Map)
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
			M.Map.setView(M.convertGCtoLC(M.cMAP_CENTER), M.cZOOM_LEVEL_DEFAULT);
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
				M.bindMapLinkBehavior($(this), null, "sky");
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
				O.initializeDungeonChecklist();
				O.initializeCustomChecklist();
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
					var container = $(I.cContentPrefix + I.ContentEnum.Chains);
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
		$(".chnTitle h2").click(function()
		{
			var details = $(this).parent().next();
			var category = $(this).parent().parent().parent().attr("id");
			if (O.Options.bol_alertSubscribed && category === "listChainsScheduled")
			{
				// Special title for subscribed scheduled chains
				if (details.is(":visible"))
				{
					$(this).removeClass("chnTitleSubscribed");
				}
				else
				{
					$(this).addClass("chnTitleSubscribed");
				}
			}
			details.slideToggle(100);
		});

		/*
		 * Generate a full timetable of the chains when clicked on that header.
		 */
		$("#headerTimetable").one("click", function(){
		   C.initializeTimetableHTML(); 
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
		 * @param string s DOM query using standard querySelectorAll function.
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
				var c = document.querySelectorAll(s);
				for (var e = 0; e < c.length; e++)
				{
					if (a = c[e], b = a.getAttribute("title"))
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
				}
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
 *  @@Xecutions and jQuery bindings; the order matters!
 * ============================================================= */
I.initializeFirst(); // initialize variables that need to be first
O.initializeOptions(); // load stored or default options to the HTML input
C.initializeSchedule(); // compute event data and write HTML
M.initializeMap(); // instantiate the map and populate it
K.initializeClock(); // start the clock and infinite loop
I.initializeLast(); // bind event handlers for misc written content




});//]]>// END OF JQUERY NEST