import Callable from "./utils/Callable"
import LightqueryCollection from "./LightqueryCollection"
import InvalidArgumentError from "./errors/InvalidArgumentError"
import lqHelpers from "./utils/helpers"
import "./utils/typedefs"

/**
 * @callback LightqueryFactory~selectCallback
 * @param {string} selector
 * @returns {LightqueryCollection}
 */

/**
 * @typedef {object} LightqueryFactorySelectObject
 * @property {LightqueryFactory~selectCallback} select
 */


/**
 * @class
 * @classdesc Class that represents the implementation details of a lightquery factory
 */
class LightqueryFactoryImplDetails{
	/**
	 * @param {LightqueryFactory} self - The LightqueryFactory instance
	 * @param {typeof LightqueryCollection} [collectionClass = LightqueryCollection] - The class used to construct the result collections
	 * @param {boolean} [strictMode = true] - Whether or not to throw exceptions instead of silently failing
	 */
	constructor(self, collectionClass = LightqueryCollection, strictMode = true){
	    const collClass = class extends collectionClass{}; // Allows to customize on a per factory basis
        collClass.lightquery = self;

		/**
		 * @property {typeof LightqueryCollection} - The class used to generate a results collection
		 */
		this.collectionClass = collClass;
		this.strictMode = strictMode;



		/**
		 * @property {{instance: Set<string>, global: Set<string>}} plugins - Sets of registered plugins
		 */
		this.plugins = {
			instance: new Set(),
			global: new Set(),
		};
	}

	/**
	 * Execute a callback if strict mode is on
	 * @param {Callback} callback - The callback to execute
	 */
	ifStrict(callback){
		if(this.strictMode)
			callback();
	}

	/**
	 * Create a lightquery collection from arguments
	 * @param {...any}               args - The arguments for the constructor
	 * @returns {LightqueryCollection}
	 */
	factory(...args){
		return new this.collectionClass(...args);
	}

	/**
	 * A factory for an empty selection
	 * @returns {LightqueryCollection}
	 */
	emptySelection(){
		return this.factory("");
	}
}

/**
 * @constant {PluginType} defaultPluginType
 * @default
 */
const defaultPluginType = "instance";

/**
 * @class
 * @classdesc Class that represents the factory function to query the DOM with lightquery
 */
class LightqueryFactory extends Callable{
	/**
	 * Create a lightquery factory (that's what's behind µ)
	 * @param {typeof LightqueryCollection} [collectionClass = LightqueryCollection] - The class used to construct the result collections
	 * @param {boolean} [strictMode = true] - Whether or not to throw exceptions instead of silently failing
	 */
	constructor(collectionClass = LightqueryCollection, strictMode = true){
		super();

		/**
		 * Private methods and properties
		 * @protected
		 * @readonly
		 * @property {LightqueryFactoryImplDetails} __ - The protected implementation details
		 */
		Object.defineProperty(this, "__", {
			enumerable: false,
			writable: false,
			configurable: false,
			value: new LightqueryFactoryImplDetails(this, collectionClass, strictMode),
		});

		/**
		 * @member {boolean} - Whether or not to use strict mode with this factory
		 */
		this.strictMode = strictMode;
	}

	/**
	 * @override
	 * @param {DomElementType|NodeList|Iterable<DomElementType>|Callback} selector
	 * @param {DomElementType|undefined} context
	 * @param {Iterable<DomElementType>} previousResults
	 * @returns {LightqueryCollection}
	 */
	__call(selector, context = undefined, previousResults = []){
		if(typeof selector === "function")
			return this.ready(selector);
		else
			return this.__.factory(selector);
	}

    /**
     * Determine whether or not the plugin is registered
     * @param {string} pluginName - The plugin's name
     * @param {PluginType} [pluginType = defaultPluginType] - The plugin's type
     * @param {string} [nameForStrict = ""] - The name for error strings when strict mode is on
     * @returns {boolean}
     */
	hasPlugin(pluginName, pluginType = defaultPluginType, nameForStrict = ""){
        if(typeof pluginName !== "string"){
            this.__.ifStrict(() => throw new InvalidArgumentError(`Expected pluginName to be a string in LightqueryFactory${nameForStrict}`));
            return false;
        }

        if(typeof pluginType !== "string"){
            this.__.ifStrict(() => throw new InvalidArgumentError(`Expected pluginType to be a string in LightqueryFactory${nameForStrict}`));
            return false;
        }

	    if(!lqHelpers.plugin.isValidPluginType(pluginType)){
	        this.__.ifStrict(() => throw new InvalidArgumentError(`Invalid plugin type "${pluginType}" in LightqueryFactory${nameForStrict}`));
	        return false;
        }

        const pluginRepo = this.__.plugins[pluginType];
	    return pluginRepo.has(pluginName);
    }

    /**
     * Register a plugin
     * @param {string} pluginName
     * @param {Function|any} plugin
     * @param {PluginType} pluginType
     * @returns {LightqueryFactory}
     */
	registerPlugin(pluginName, plugin, pluginType = defaultPluginType){
	    const hasPlugin = this.hasPlugin(pluginName, pluginType, "#registerPlugin(pluginName, plugin, pluginType)");

		/*
		//NOTE: Commented out for more flexibility
		if(typeof plugin !== "function")){
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected plugin to be a function or an object in LightqueryFactory#registerPlugin(pluginName, plugin, pluginType)"));
			return this;
		}
		*/

		if(hasPlugin){ // if plugin is already registered
            const pname = lqHelpers.string.capitalizeFirst(pluginType);
			this.__.ifStrict(() => throw new InvalidArgumentError(`${pname} plugin "${pluginName}" already registered`));
		}else{
			lqHelpers.plugin.doForPluginType({
				pluginType,
				onGlobal: () => this[pluginName] = plugin,
				onInstance: () => this.__.collectionClass.prototype[pluginName] = plugin,
				onUnknown: () => {
					this.__.ifStrict(() => throw new InvalidArgumentError("Invalid pluginType in LightqueryFactory#registerPlugin(pluginName, plugin, pluginType)"));
				},
			});

			this.__.plugins[pluginType].add(pluginName);
		}

		return this;
	}

    /**
     * Remove a registered plugin
     * @param pluginName
     * @param pluginType
     * @returns {LightqueryFactory}
     */
	removePlugin(pluginName, pluginType = defaultPluginType){
	    const hasPlugin = this.hasPlugin(pluginName, pluginType, "#removePlugin(pluginName, pluginType)");

	    if(hasPlugin){
	        lqHelpers.plugin.doForPluginType({
                pluginType,
                onGlobal: () => this[pluginName] = undefined,
                onInstance: () => this.__.collectionClass.prototype[pluginName] = undefined,
                onUnknown: () => {
                    this.__.ifStrict(() => throw new InvalidArgumentError("Invalid pluginType in LightqueryFactory#removePlugin(pluginName, pluginType)"));
                },
            });

            this.__.plugins[pluginType].delete(pluginName);
        }else{
	        const pname = lqHelpers.string.capitalizeFirst(pluginType);
	        this.__.ifStrict(() => throw new InvalidArgumentError(`${pname} plugin "${pluginName}" is not registered`));
        }

	    return this;
    }

	/**
	 * Execute a callback once the DOM is fully loaded
	 * @param   {Callback}             callback - The function to execute after the DOM is loaded
	 * @returns {LightqueryCollection}
	 */
	ready(callback){
		return this(document).ready(callback);
	}

	/**
	 * Help query using the given context as the selection root
	 * @param   {DomElementType} context - The context to restrict to
	 * @returns {LightqueryFactorySelectObject}
	 */
	from(context){
		return {
			select: selector => this(selector, context),
		};
	}

	/**
     * Extend an object using many objects
     * @param   {object}    target     - The object to extend
     * @param   {...object} objects - The objects to derive properties from
     * @returns {object}
     */
	extend(target, ...objects){
		return Object.assign(target, ...objects);
	}
}


export default LightqueryFactory
