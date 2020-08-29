const helpers = {
    spacedListString: {
        regex: /(\S)\s+(\S)/g,
        replacement: "$1 $2",
        splitter: " ",
		toArray(str){
			return str
			.replace(this.regex, this.replacement)
			.split(this..splitter);
		},
    },
    css_variables: {
        regex: {
            trailing: /^--\w+(?:\w|-)*$/,
            no_trailing: /^\w+(?:\w|-)*$/,
        }
    },
    functions: {
        valid_name_regex: /^[$µA-Z_][0-9A-Z_$µ]*$/i,
        valid_firstChar_regex: /^[$A-Z_]$/i,
        invalid_otherChar_regex: /[^0-9A-Z_$]/ig,
		newName(str){
			if(this.valid_name_regex.test(str))
				return str;

			if(!this.valid_firstChar_regex.test(str.charAt(0)))
				return this.newName(`$${str}`);

			return str.replace(this.invalid_otherChar_regex, "_");
		},
    },
    plugin: {
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
		toArray(arrayLike){
			return [].slice.call(arrayLike);
		}
	},
    array: {
		isEmpty(arr){
			return arr.length === 0
			||  arr == []
			|| arr == new Array();
		}
	},
};

export default helpers;