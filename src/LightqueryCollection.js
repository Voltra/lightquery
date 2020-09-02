import { cssEngine } from "./CssEngine"
import UnsupportedError from "./errors/UnsupportedError"
import { strategies } from "./strategies/init"
import { asSequence } from "./utils/lazy"
import lqHelpers from "./utils/helpers"


/**
 * Callback to throw a prefilled NotEnoughElementsError
 * @returns {() => any}
 */
const notEnoughFor = str => () => throw new NotEnoughElementsError(`Not enough elements to apply LightqueryCollection${str})`);

export default class LightqueryCollection{
	/**
	 * Call a function once the document is loaded
	 * @param   {() => any} callback The function to call once the document is loaded
	 * @returns {LightqueryCollection} [[Description]]
	 */
	static ready(callback){
		return (new this(document)).ready(callback);
	}
	
	constructor(selector, context = undefined, previousResults = []){		
		/**
		 * Private methods and properties
		 * @readonly
		 * @memberof LightqueryCollection
		 */
		this.__ = {
			/**
			 * @private
		 	 * @readonly
			 * @property {LightqueryFactory} lightquery - Instance of lightquery factory used to get the collection
			 */
			lightquery: this.constructor.lightquery,
			
			/**
			 * Alias for LightqueryCollection#__.lightquery
			 */
			get $(){
				return this.lightquery;
			},
			
			/**
			 * @private
		 	 * @readonly
			 * @property {string|Element|Iterable<Element>} selector - The selector used to create this instance
			 */
			selector,
			
			/**
			 * @private
		 	 * @readonly
			 * @property {Iterable<Element>} previousResults - The previous results set
			 */
			previousResults,
			
			/**
			 * @private
		 	 * @readonly
			 * @property {Iterable<Element>} elements - The current result set
			 */
			elements: [],
			
			/**
			 * Make the LightqueryCollection instance iterable
			 * @param {LightqueryCollection} self - The instance to make iterable
			 * @private
		 	 * @readonly              
			 */
			makeIterable(self){
				this.elements = asSequence(this.elements)
								.filterNotNull()
								.filterNot(x => typeof x === "undefined")
								.distinct()
								.toArray();
				
				const { elements } = this;
				self[Symbol.iterator] = elements[Symbol.iterator];
				self.length = elements.length;
				
				for(const i in elements)
					self[i] = elements[i];
			},
			
			/**
			 * Generic implementation of a get/set method
			 * @template T,U,V
			 * @param {object} options
			 * @param {T|undefined} options.value - The new value
			 * @param {string} options.key - The key to which the value will be set (from the setter root)
			 * @param {U} [options.strictDefault = null] - The default value if strict mode is on
			 * @param {V} [options.looseDefault = ""] - The default value if strict mode is off
			 * @param {(e: Element) => any} [options.setterRoot = e => e] - The function to retrieve the setter root
			 * @returns {T|U|V}
			 * @private
			 * @readonly
			 */
			getSetMethod({ value, key, self, strictDefault = null, looseDefault = "", setterRoot = e => e}){
				const keys = lqHelpers.spacedListString.toArray(key);
				
				if(typeof value !== "undefined"){ // set
					if(typeof value === "function"){
						self.forEach(e => {
							keys.forEach(key => {
								const root = setterRoot(e);
								root[key] = value(root[key], root, key);
							});
						});
					}else
						self.forEach(e => {
							keys.forEach(key => setterRoot(e)[key] = value);
						});

					return self;
				}else{ // get
					const defaultValue = this.defaultValue({
						strict: null,
						loose: "",
					});

					const first = self[0];
					const firstKey = keys[0];
					return first ? setterRoot(first)[firstKey] : defaultValue;
				}
			},
			
			/**
			 * Craft a default value depending on strict mode
			 * @template T,U
			 * @param {object} values
			 * @param {T} options.strict - The default value if strict mode is on
			 * @param {U} options.loose - The default value if strict mode is off
			 * @returns {T|U}
			 */
			defaultValue({ strict, loose }){
				return this.lightquery.strictMode ? strict : loose;
			},
			
			/**
			 * Execute a callback if strict mode is on
			 * @param {() => any} callback - The callback to execute
			 */
			ifStrict(callback){
				if(this.lightquery.strictMode)
					callback();
			},
			
			/**
			 * Apply a function on the first element of a LightqueryCollection if it exists
			 * @template R,U
			 * @param {object} options
			 * @param {(first: Element) => R} options.onFirst - The function to apply on the first element
			 * @param {string} options.nameForStrict - The name to use on error in strict mode
			 * @param {LightqueryCollection} options.self - The LightqueryCollection to inspect
			 * @param {U} [options.defaultValue = false] - The default value to return if there's no elements and strict mode is off
			 * @returns {R|U}
			 * @throws {NotEnoughElementsError} if strict mode is on and there are not enough elements
			 */
			doOnFirst({ onFirst, nameForStrict, self, defaultValue = false, }){
				const first = self[0];
		
				if(!first){
					this.ifStrict(notEnoughFor(nameForStrict));
					return defaultValue;
				}

				return onFirst(first);
			},
		};
		
		const previousResultSet = [...previousResults];
		const initStrategy = strategies.find(strategy => strategy.shouldProcess(selector, context, previousResultSet));
		
		if(initStrategy)
			this.__.elements = initStrategy.process(selector, context, previousResultSet);
		else{
			this.__.ifStrict(() => throw new InvalidArgumentError(`Invalid selector "${selector}"`));
			this.__.elements = previousResultSet;
		}
		
		this.__.makeIterable(this);
	}
	
	/****************************************************************************************\
	 * Utils
	\****************************************************************************************/
	/**
	 * Execute a callback when the document is ready (only if the selector is the document)
	 * @param   {Function}             callback The event listener to bind
	 * @returns {LightqueryCollection}
	 * @throws {UnsupportedError} If it cannot attach event listeners
	 */
	ready(callback){
		if(this.selector === document){
			if(["complete", "interactive"].includes(document.readyState))
				callback.call(document);
			
			if(typeof document.addEventListener == "function"){
				document.addEventListener("DOMContentLoaded", callback, false);
			}else if(typeof window.addEventListener == "function"){
				window.addEventListener("load", callback, false);
			}else if(typeof document.attachEvent == "function"){
				document.attachEvent("onreadystatechange", callback);
			}else if(typeof window.attachEvent == "function"){
				window.attachEvent("onload", callback);
			}else
				throw new UnsupportedError("Cannot attach document ready event handler");
		}
		
		return this;
	}
	
	/**
	 * Transform the LigtqueryCollection into a sequency Sequence
	 * @returns {Sequence<Element>}
	 */
	lazy(){
		return asSequence(this.__.elements);
	}
	
	
	
	/****************************************************************************************\
	 * Iteration methods
	\****************************************************************************************/
	/**
	 * Execute a function on each element
	 * @param {(e: Element) => any} callback The function to execute
	 * @returns {LightqueryCollection}
	 */
	forEach(callback){
		for(const element of this)
			callback.call(element, element);
		
		return this;
	}
	
	map(mapper, ...args){
		if(typeof mapper === "string"){
			//TODO: String version
			return this.map(e => {
				return this.__.$(e)[mapper](...args);
			});
		}else
			return this.__.elements.map(e => mapper.call(e, e));
	}
	
	
	
	/****************************************************************************************\
	 * Single item methods
	\****************************************************************************************/
	/**
	 * Get the item at the given index
	 * @param   {number}   index The index of the item to retrieve
	 * @returns {LightqueryCollection|null} [[Description]]
	 */
	eq(index){
		const defaultValue = this.__.defaultValue({
			strict: null,
			loose: this.__.lightquery.__.emptySelection(),
		});
		
		if(index >= 0 && index < this.length)
			return this[index] ? this.__.lightquery(this[index]) : defaultValue;
		else
			return defaultValue;
	}
	
	/**
	 * Get/set the value of an input field
	 * @param   {Function|string|number|null|undefined} [value = undefined] The new value (or its factory)
	 * @returns {LightqueryCollection|string|number|null}
	 */
	val(value = undefined){
		return this.__.getSetMethod({
			value,
			key: "value",
			self: this,
		});
	}
	
	/**
	 * Get/set the html content
	 * @param   {Function|string|undefined} [value = undefined] The new HTML content
	 * @returns {LightqueryCollection|string|null}
	 */
	html(value = undefined){
		return this.__.getSetMethod({
			value,
			key: "innerHTML",
			self: this,
		});
	}
	
	/**
	 * Get/set an attribute's value
	 * @param {string} name The name of the attribute
	 * @param   {Function|string|undefined} [value = undefined] The new value
	 * @returns {LightqueryCollection|string|null}
	 */
	attr(name, value = undefined){
		return this.__.getSetMethod({
			value,
			key: name,
			self: this,
			setterRoot: e => e.attributes,
		});
	}
	
	/**
	 * Get/set a property's value
	 * @param {string} name The name of the property
	 * @param   {Function|string|undefined} [value = undefined] The new value
	 * @returns {LightqueryCollection|string|null}
	 */
	prop(name, value = undefined){
		return this.__.getSetMethod({
			value,
			key: name,
			self: this,
		});
	}
	
	/**
	 * Get/set a data attribute's value
	 * @param {string} name The name of the data attribute
	 * @param   {Function|string|undefined} [value = undefined] The new value
	 * @returns {LightqueryCollection|string|null}
	 */
	data(name, value = undefined){
		return this.__.getSetMethod({
			value,
			key: name,
			self: this,
			setterRoot: e => e.dataset,
		});
	}
	
	/**
	 * Determine whether or not the first element has the given attribute
	 * @param   {string}  attr The attribute's name
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasAttribute(attr){
		return this.__.doOnFirst({
			onFirst: first => first.hasAttribute(attr),
			defaultValue: false,
			self: this,
			nameForStrict: "#hasAttribute(attr)",
		});
	}
	
	/**
	 * Determine whether or not the first element has the given property
	 * @param   {string}  prop The property's name
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasProp(prop){
		return this.__.doOnFirst({
			onFirst: first => first.hasOwnProperty(prop),
			defaultValue: false,
			self: this,
			nameForStrict: "#hasProp(prop)",
		});
	}
	
	/**
	 * Determine whether or not the first element has the given data attribute
	 * @param   {string}  attr The data attribute's name
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasData(data){
		return this.__.doOnFirst({
			onFirst: first => data in first.dataset,
			defaultValue: false,
			self: this,
			nameForStrict: "#hasData(data)",
		});
	}
	
	/**
	 * Determine whether or not the first element has the given class applied
	 * @param   {string}  className The name of the class to have
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasClass(className){
		return this.__.doOnFirst({
			onFirst: first => first.classList.contains(className),
			defaultValue: false,
			self: this,
			nameForStrict: "#hasClass(className)",
		});
	}
}