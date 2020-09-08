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
		collectionClass.lightquery = self;
		
		/**
		 * @property {typeof LightqueryCollection} - The class used to generate a results collection
		 */
		this.collectionClass = collectionClass;
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
	
	registerPlugin(pluginName, method, pluginType = defaultPluginType){
		if(typeof pluginName !== "string"){
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected pluginName to be a string in LightqueryFactory#registerPlugin(pluginName, method, pluginType)"));
			return this;
		}
		
		if(typeof method !== "function"){
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected method to be a function in LightqueryFactory#registerPlugin(pluginName, method, pluginType)"));
			return this;
		}
		
		if(typeof pluginType !== "string"){
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected pluginType to be a string in LightqueryFactory#registerPlugin(pluginName, method, pluginType)"));
			return this;
		}
		
		if(!lqHelpers.plugin.isValidPluginType(pluginType)){
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected pluginType to be either \"global\" or \"instance\" in LightqueryFactory#registerPlugin(pluginName, method, pluginType)"));
			return this;
		}
		
		const pluginRepo = this.__.plugins[pluginType];
		
		if(pluginRepo.has(pluginName)){ // if plugin is already registered
			this.__.ifStrict(() => throw new InvalidArgumentError(`${pluginType} plugin "${pluginName}" already registered`));
			return this;
		}else{
			lqHelpers.plugin.doForPluginType({
				pluginType,
				onGlobal(){},
				onInstance(){},
				onUnknown: () => {
					this.__.ifStrict(() => throw new InvalidArgumentError("Invalid pluginType in LightqueryFactory#registerPlugin(pluginName, method, pluginType)"));
				}
			});
		}
		
		pluginRepo.add(pluginName);
		//TODO: Finalize plugin system
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
	 * @param   {...object} ...objects - The objects to derive properties from
	 * @returns {object}
	 */
	extend(target, ...objects){
		return Object.assign(target, ...objects);
	}
}


export default LightqueryFactory