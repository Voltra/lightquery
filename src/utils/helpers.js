import "./typedefs"
import InvalidArgumentError from "../errors/InvalidArgumentError";

const helpers = {
    string: {
        /**
         * Capitalize the first letter of a string
         * @param {string} str - The string to capitalize
         * @returns {string}
         */
        capitalizeFirst(str){
            const first = str.charAt(0).toUpperCase();
            const rest = str.substring(1);

            return `${first}${rest}`;
        },
    },
    spacedListString: {
        regex: /(\S)\s+(\S)/g,
        replacement: "$1 $2",
        splitter: " ",
		/**
		 * Convert a spaced list string to an array of strings
		 * @param   {string}   str - The spaced list string to convert
		 * @returns {string[]}
		 */
		toArray(str){
			return str
			.replace(this.regex, this.replacement)
			.split(this.splitter);
		},
    },
    css_variables: {
        regex: {
            trailing: /^--\w+(?:\w|-)*$/,
            no_trailing: /^\w+(?:\w|-)*$/,
        },
    },
    functions: {
        valid_name_regex: /^[$µA-Z_][0-9A-Z_$µ]*$/i,
        valid_firstChar_regex: /^[$A-Z_]$/i,
        invalid_otherChar_regex: /[^0-9A-Z_$]/ig,
		/**
		 * Construct a new function name from the given seed
		 * @param   {string} str - The seed
		 * @returns {string}
		 */
		newName(str){
			if(this.valid_name_regex.test(str))
				return str;

			if(!this.valid_firstChar_regex.test(str.charAt(0)))
				return this.newName(`$${str}`);

			return str.replace(this.invalid_otherChar_regex, "_");
		},
    },
    plugin: {
		/**
		 * Determine whether or not the given plugin string is a valid plugin type
		 * @param   {string|PluginType}  str - The plugin type to check
		 * @returns {boolean}
		 */
		isValidPluginType(str){
			//TODO: Maybe refactor to use enum
			return typeof str == "string"
			&& ["instance", "global"].includes(str);
		},
		doForPluginType({ pluginType, onGlobal, onInstance, onUnknown }){
			switch(pluginType){
				case "global":
					return onGlobal();

				case "instance":
					return onInstance();

				default:
					return onUnknown();
			}
		},
	},
    constructorLQ: {
        baseName: "lightqueryObject",
        nameRegex: /^lightqueryObject(\d*)$/,
    },
    arrayLike: {
		/**
		 * Transform an array like object to an actual array
		 * @param   {Iterable|any} arrayLike - The object to convert to an array
		 * @returns {Array}
		 */
		toArray(arrayLike){
			if(arrayLike instanceof Array)
				return arrayLike;

			return [].slice.call(arrayLike);
		},
	},
    array: {
		/**
		 * Determine whether or not an array is empty
		 * @param   {Array|Iterable|any} arr - The array
		 * @returns {boolean}
		 */
		isEmpty(arr){
			return arr.length === 0
			||  arr == []
			|| arr == new Array();
		},
	},
    elements: {
		/**
		 * Get an element from a DOM element
		 * @param {DomElementType} domEl
		 * @returns {Element}
		 */
    	getElement(domEl){
			if(domEl instanceof Document || domEl instanceof Window)
				return this.getElement(document.documentElement);
			else if(domEl instanceof Element)
				return domEl
			else // DocumentFragment
				return domEl; //TODO: Check if OK (or if ShadowRoot should even be part of type alias)
		},

		/**
		 * Determine whether or not the given element is a DOM element
		 * @param el
		 * @returns {boolean}
		 */
        isElement(el){
            return el && (el instanceof Node || el instanceof Element || el instanceof DocumentFragment);
        },

		/**
		 * Execute code for each element
		 * @param {object} args
		 * @param {ElementsOrLightquery} args.elements - The elements to execute code for
		 * @param {ElementCallback} args.onElement - The callback for single elements
		 * @param {ElementsCallback} args.onElements - The callback for iterable of elements
		 * @param {string} args.nameForStrict - The name for error messages if strict mode is on
		 * @param {typeof LightqueryCollection} args.LightqueryCollection - The class for the lightquery result set
		 */
        forElements({ elements, onElement, onElements, nameForStrict, LightqueryCollection }){
            if(elements instanceof LightqueryCollection || elements instanceof NodeList){
                onElements(elements);
            }else if(this.isElement(elements)){
                onElement(this.getElement(elements));
            }else{
                if(elements.forEach){
                    elements.forEach(e => {
                        if(!this.isElement(e)){
                            this.__.ifStrict(() => throw new InvalidArgumentError(`Expected elements to contain (only) elements in LightqueryCollection${nameForStrict}`));
                        }else{
                            onElement(this.getElement(e));
                        }
                    });
                }else{
                    this.__.ifStrict(() => throw new InvalidArgumentError(`Expected elements to be iterable or an element in LightqueryCollection${nameForStrict}`));
                }
            }
        }
    },
};

export default helpers;
