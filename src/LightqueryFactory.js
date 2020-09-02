import Callable from "./utils/Callable"
import LightqueryCollection from "./LightqueryCollection"
import InvalidArgumentError from "./errors/InvalidArgumentError"
import { asSequence, registerLightqueryExtensions } from "./utils/lazy"

export default class LightqueryFactory extends Callable{
	/**
	 * Create a lightquery factory (that's what's behind µ)
	 * @param   {typeof LightqueryCollection} [collectionClass = LightqueryCollection] The class used to construct the result collections
	 * @param   {boolean} [strictMode = true] Whether or not to throw exceptions instead of silently failing
	 */
	constructor(collectionClass = LightqueryCollection, strictMode = true){
		super();
		registerLightqueryExtensions(this);
		collectionClass.lightquery = this;
		
		this.__ = {
			factory: (...args) => new collectionClass(...args),
			collectionClass,
			emptySelection(){
				return this.factory("");
			},
		};
		
		this.strictMode = strictMode;
	}
	
	__call(selector, context = undefined, previousResults = []){
		if(typeof selector === "function")
			return this.ready(selector);
		else	
			return this.__.factory(selector);
	}
	
	/**
	 * Execute a callback once the DOM is fully loaded
	 * @param   {Function}             callback The function to execute after the DOM is loaded
	 * @returns {LightqueryCollection}
	 */
	ready(callback){
		return this(document).ready(callback);
	}
	
	/**
	 * Wrap an iterable in a lazy evaluated pipeline
	 * @template T
	 * @param   {Iterable<T>} iterable The iterable to wrap
	 * @returns {Sequence<T>}
	 */
	lazy(iterable){
		return asSequence(iterable);
	}
	
	/**
	 * Set the selection root to be the given context
	 * @param   {Element} context The context to restrict to
	 */
	from(context){
		return {
			select: selector => this(selector, context),
		};
	}
}