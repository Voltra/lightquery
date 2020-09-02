const helpers = {
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
		 * @param   {string}  str - The plugin type to check
		 * @returns {boolean}
		 */
		isValidPluginType(str){
			//TODO: Maybe refactor to use enum
			return typeof str == "string"
			&& ["instance", "global"].includes(str);
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
};

export default helpers;