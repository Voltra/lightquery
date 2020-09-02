import Callable from "./utils/Callable"
import LightqueryCollection from "./LightqueryCollection"
import InvalidArgumentError from "./errors/InvalidArgumentError"
import { asSequence, registerLightqueryExtensions } from "./utils/lazy"

/**
 * @callback LightqueryFactory~selectCallback
 * @param {string} selector
 * @returns {LightqueryCollection}
 */

/**
 * @class
 * @classdesc Class that represents the factory function to query the DOM with lightquery
 */
class LightqueryFactory extends Callable{
	/**
	 * Create a lightquery factory (that's what's behind µ)
	 * @param   {typeof LightqueryCollection} [collectionClass = LightqueryCollection] - The class used to construct the result collections
	 * @param   {boolean} [strictMode = true] - Whether or not to throw exceptions instead of silently failing
	 */
	constructor(collectionClass = LightqueryCollection, strictMode = true){
		super();
		registerLightqueryExtensions(this);
		collectionClass.lightquery = this;
		
		/**
		 * Private methods and properties
		 * @protected
		 * @readonly
		 */
		this.__ = {
			/**
			 * Create a lightquery collection from arguments
			 * @param {...any} args - The arguments for the constructor
			 * @returns {LightqueryCollection}
			 */
			factory: (...args) => new collectionClass(...args),
			
			/**
			 * @property {typeof LightqueryCollection} - The class used to generate a results collection
			 */
			collectionClass,
			
			/**
			 * A factory for an empty selection
			 * @returns {LightqueryCollection}
			 */
			emptySelection(){
				return this.factory("");
			},
		};
		
		/**
		 * @member {boolean} - Whether or not to use strict mode with this factory
		 */
		this.strictMode = strictMode;
	}
	
	/**
	 * @override
	 * @inheritdoc
	 */
	__call(selector, context = undefined, previousResults = []){
		if(typeof selector === "function")
			return this.ready(selector);
		else	
			return this.__.factory(selector);
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
	 * Wrap an iterable in a lazy evaluated pipeline
	 * @template T
	 * @param   {Iterable<T>} iterable - The iterable to wrap
	 * @returns {import("sequency").Sequence<T>}
	 */
	lazy(iterable){
		return asSequence(iterable);
	}
	
	/**
	 * Help query using the given context as the selection root 
	 * @param   {Element} context - The context to restrict to
	 * @returns {{select: LightqueryFactory~selectCallback}}
	 */
	from(context){
		return {
			select: selector => this(selector, context),
		};
	}
}


export default LightqueryFactory