import { cssEngine } from "./CssEngine"
import UnsupportedError from "./errors/UnsupportedError"
import InvalidArgumentError from "./errors/InvalidArgumentError"
import { strategies } from "./strategies/init"
import { asSequence } from "./utils/lazy"
import lqHelpers from "./utils/helpers"
import "./utils/typedefs"



/**
 * @callback LightqueryCollection~onFirst
 * @template R
 * @param {DomElementType} first
 * @returns {R}
 */

/**
 * @callback LightqueryCollection~setterRoot
 * @template X
 * @param {DomElementType} e
 * @returns {X}
 */

/**
 * @callback LightqueryCollection~setValueFactory
 * @template T,U,V
 * @param {T} oldValue
 * @param {U} destObject
 * @param {string} key
 * @returns {V}
 */

/**
 * @callback LightqueryCollection~classManipHandler
 * @param {DOMTokenList} classList - The class list to alter
 * @param {string} clazz - The class which is being altered
 * @param {DomElementType} element - The element being modified
 * @param {LightqueryCollection} $element - The LightqueryCollection instance to the element being modified
 * @returns {any}
 */




/**
 * Callback to throw a prefilled NotEnoughElementsError
 * @returns {Callback}
 */
const notEnoughFor = str => () => throw new NotEnoughElementsError(`Not enough elements to apply LightqueryCollection${str})`);

/**
 * @class
 * @classdesc Class representing the implementation details of a lightquery collection
 */
class LightqueryCollectionImplDetails{
	/**
	 * @constructor
	 * @param   {LightqueryCollection} self - The LightqueryCollection instance
	 * @param   {Selector} selector - The current selector
	 * @param   {DomElementType|undefined} context - The current context
	 * @param   {Iterable<DomElementType>} previousResults - The previous result set
	 */
	constructor(self, selector, context, previousResults){
		this.self = self;
		
		/**
		 * @readonly
		 * @property {LightqueryFactory} lightquery - Instance of lightquery factory used to get the collection
		 */
		this.lightquery = self.constructor.lightquery;
		
		/**
		 * @readonly
		 * @property {string|Element|Iterable<Element>} selector - The selector used to create this instance
		 */
		this.selector = selector;
		
		/**
		 * @readonly
		 * @property {Iterable<Element>} previousResults - The previous results set
		 */
		this.previousResults = previousResults;
		
		/**
		 * @property {Iterable<Element>} elements - The current result set
		 */
		this.elements = [];
		
		
		/**
		 * @property {LightqueryFactory} $ -  Alias for LightqueryCollectionImplDetails#lightquery
		 */
		Object.defineProperties(this, {
			$: {
				get: () => this.lightquery,
			}
		});
	}
		
	/**
	 * Make the LightqueryCollection instance iterable
	 * @private
	 * @readonly              
	 */
	makeIterable(){
		this.elements = asSequence(this.elements)
						.filterNotNull()
						.filterNot(x => typeof x === "undefined")
						.distinct()
						.toArray();

		const { elements, self } = this;
		self[Symbol.iterator] = elements[Symbol.iterator];
		self.length = elements.length;

		for(const i in elements)
			self[i] = elements[i];
	}

	/**
	 * Generic implementation of a get/set method
	 * @template T,U,V,X
	 * @param {object} options
	 * @param {T|LightqueryCollection~setValueFactory<any, X, T>|undefined} options.value - The new value
	 * @param {string} options.key - The key to which the value will be set (from the setter root)
	 * @param {U} [options.strictDefault = null] - The default value if strict mode is on
	 * @param {V} [options.looseDefault = ""] - The default value if strict mode is off
	 * @param {LightqueryCollection~setterRoot<X>} [options.setterRoot = (e => e)] - The function to retrieve the setter root
	 * @returns {T|U|V}
	 * @private
	 * @readonly
	 */
	getSetMethod({ value, key, strictDefault = null, looseDefault = "", setterRoot = e => e}){
		const keys = lqHelpers.spacedListString.toArray(key);
		const { self } = this;

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
	}

	/**
	 * Craft a default value depending on strict mode
	 * @template T,U
	 * @param {object} values
	 * @param {T} options.strict - The default value if strict mode is on
	 * @param {U} options.loose - The default value if strict mode is off
	 * @returns {T|U}
	 */
	defaultValue({ strict, loose }){
		return this.$.strictMode ? strict : loose;
	}

	/**
	 * Execute a callback if strict mode is on
	 * @param {Callback} callback - The callback to execute
	 */
	ifStrict(callback){
		if(this.$.strictMode)
			callback();
	}

	/**
	 * Apply a function on the first element of a LightqueryCollection if it exists
	 * @template R,U
	 * @param {object} options
	 * @param {LightqueryCollection~onFirst<R>} options.onFirst - The function to apply on the first element
	 * @param {string} options.nameForStrict - The name to use on error in strict mode
	 * @param {U} [options.defaultValue = false] - The default value to return if there's no elements and strict mode is off
	 * @returns {R|U}
	 * @throws {NotEnoughElementsError} if strict mode is on and there are not enough elements
	 */
	doOnFirst({ onFirst, nameForStrict, defaultValue = false, }){
		const { self } = this;
		const first = self[0];

		if(!first){
			this.ifStrict(notEnoughFor(nameForStrict));
			return defaultValue;
		}

		return onFirst(first);
	}

	/**
	 * Handle delegating to the array or by string-method reference
	 * @template T
	 * @param {object} options
	 * @param {string} options.method - The array method's name
	 * @param {string|ElementMapper<T>} options.func - The higher order function to execute on each element
	 * @param {any[]} [options.args = []] - The arguments for the string-method-reference
	 * @returns {T[]|any[]}
	 */
	arrayMethodDelegate({ method, func, args = [], }){
		const { self } = this;
		
		if(typeof func === "string"){
			return self[method](e => {
				return this.$(e)[func](...args);
			});
		}else
			return this.elements[method](e => func.call(e, e));
	}
	
	/**
	 * Handle delegating to the class list of each elements
	 * @param {object} options
	 * @param {string} options.classNames - The space separated class names
	 * @param {string} options.nameForStrict - The name to use in the error message if strict mode is on
	 * @param {LightqueryCollection~classManipHandler|undefined} options.ifHasClass - The callback to execute if the element has the class
	 * @param {LightqueryCollection~classManipHandler|undefined} options.ifDoesNotHaveClass - The callback to execute if the element does not have the class
	 * @param {LightqueryCollection~classManipHandler|undefined} options.anyCase - The callback to execute whatever the case is
	 */
	classManip({ classNames, nameForStrict, ifHasClass = () => {}, ifDoesNotHaveClass = () => {}, anyCase = () => {} }){
		const { self, $ } = this;
		
		if(typeof classNames === "string"){
			lqHelpers.spacedListString
			.toArray(classNames)
			.forEach(clazz => {
				self.forEach(elem => {
					const $elem = $(elem);

					if($elem.hasClass(clazz))
						ifHasClass(elem.classList, clazz, elem, $elem);
					else
						ifDoesNotHaveClass(elem.classList, clazz, elem, $elem);


					anyCase(elem.classList, clazz, elem, $elem);
				});
			});
		}else
			this.ifStrict(() => throw new InvalidArgumentError(`Expected argument classNames to be a string in LightqueryCollection${nameForStrict}`));

		return self;
	}
	
	/**
	 * Handle event shorthand methods
	 * @param {object} options
	 * @param {string} options.eventName - The name of the event (to listen to/trigger)
	 * @param {EventListener|undefined} options.listener - The event listener to attach
	 * @param {string} options.nameForStrict - The name to use in the error message if strict mode is on
	 */
	eventShorthand({ eventName, listener, nameForStrict }){
		const { self, $ } = this;
		
		if(typeof listener === "undefined")
			return self.trigger(eventName);
		else if(typeof listener === "function")
			return self.on(eventName, listener);
		else
			this.ifStrict(() => throw new InvalidArgumentError(`Expected argument listener to be undefined or a function in LightqueryCollection${nameForStrict}`));
	}
}


/**
 * @class
 * @classdesc Class representing the results of a lightquery operation
 */
class LightqueryCollection{
	/**
	 * Call a function once the document is loaded
	 * @param   {Callback} callback - The function to call once the document is loaded
	 * @returns {LightqueryCollection}
	 */
	static ready(callback){
		return this.lightquery(document).ready(callback);
	}
	
	/**
	 * @throws {InvalidArgumentError} If the selector is invalid
	 * @param {Selector} selector - The selector
	 * @param {DomElementType|undefined} [context = undefined] - The selection context
	 * @param {Iterable<DomElementType>} [previousResults = []] - The previous results set
	 */
	constructor(selector, context = undefined, previousResults = []){		
		/**
		 * Private methods and properties
		 * @protected
		 * @readonly
		 * @property {LightqueryCollectionImplDetails} - The protected implementation details
		 */
		this.__ = new LightqueryCollectionImplDetails(this, selector, context, previousResults);
		
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
	 * @param   {EventListener}             callback - The event listener to bind
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
	 * @returns {import("sequency").Sequence<Element>}
	 */
	lazy(){
		return asSequence(this.__.elements);
	}
	
	
	
	/****************************************************************************************\
	 * Iteration methods
	\****************************************************************************************/
	/**
	 * Execute a function on each element
	 * @param {ElementCallback} callback - The function to execute
	 * @returns {LightqueryCollection}
	 */
	forEach(callback){
		for(const element of this)
			callback.call(element, element);
		
		return this;
	}
	
	/**
	 * Map each element
	 * @param   {ElementMapper<U>|string} mapper - The mapping function
	 * @param   {...any} ...args - Arguments for string callable
	 * @returns {U[]|any[]}
	 *
	 * @example <caption>Same as <code>µ("form input").map(e => µ(e).val());</code></caption>
	 * µ("form input").map("val");
	 * 
	 * @example <caption>Same as <code>µ("form input[type="checkbox"]").map(e => µ(e).hasAttr("checked"));</code></caption>
	 * µ("form input[type="checkbox"]").map("hasAttr", "checked");
	 */
	map(mapper, ...args){
		return this.__.arrayMethodDelegate({
			method: "map",
			func: mapper,
			args,
		});
	}
	
	/**
	 * Filter elements
	 * @param   {Predicate<DomElementType>|string} predicate - The predicate function
	 * @param   {...any} ...args - Arguments for string callable
	 * @returns {LightqueryCollection}
	 *
	 * @example <caption>Same as <code>µ("form input").filter(e => µ(e).hasAttr("checked"));</code></caption>
	 * µ("form input").filter("hasAttr", "checked");
	 */
	filter(predicate, ...args){
		const arr = this.__.arrayMethodDelegate({
			method: "filter",
			func: predicate,
			args,
		});
		
		return this.__.$(arr);
	}
	
	
	
	/****************************************************************************************\
	 * Single item methods
	\****************************************************************************************/
	/**
	 * Get the item at the given index
	 * @param   {number}   index - The index of the item to retrieve
	 * @returns {LightqueryCollection|null}
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
	 * @param   {LightqueryCollection~setValueFactory<string, DomElementType, string>|string|number|null|undefined} [value = undefined] - The new value (or its factory)
	 * @returns {LightqueryCollection|string|number|null}
	 */
	val(value = undefined){
		return this.__.getSetMethod({
			value,
			key: "value",
		});
	}
	
	/**
	 * Get/set the html content
	 * @param   {LightqueryCollection~setValueFactory<string, DomElementType, string>|string|undefined} [value = undefined] - The new HTML content
	 * @returns {LightqueryCollection|string|null}
	 */
	html(value = undefined){
		return this.__.getSetMethod({
			value,
			key: "innerHTML",
		});
	}
	
	/**
	 * Get/set an attribute's value
	 * @param {string} name The name of the attribute
	 * @param   {LightqueryCollection~setValueFactory<string, DomElementType, string>|string|undefined} [value = undefined] - The new value
	 * @returns {LightqueryCollection|string|null}
	 */
	attr(name, value = undefined){
		return this.__.getSetMethod({
			value,
			key: name,
			setterRoot: e => e.attributes,
		});
	}
	
	/**
	 * Get/set a property's value
	 * @param {string} name The name of the property
	 * @param   {LightqueryCollection~setValueFactory<string, DomElementType, string>|string|undefined} [value = undefined] - The new value
	 * @returns {LightqueryCollection|string|null}
	 */
	prop(name, value = undefined){
		return this.__.getSetMethod({
			value,
			key: name,
		});
	}
	
	/**
	 * Get/set a data attribute's value
	 * @param {string} name The name of the data attribute
	 * @param   {LightqueryCollection~setValueFactory<string, DomElementType, string>|string|undefined} [value = undefined] - The new value
	 * @returns {LightqueryCollection|string|null}
	 */
	data(name, value = undefined){
		return this.__.getSetMethod({
			value,
			key: name,
			setterRoot: e => e.dataset,
		});
	}
	
	/**
	 * Determine whether or not the first element has the given attribute
	 * @param   {string}  attr - The attribute's name
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasAttr(attr){
		return this.__.doOnFirst({
			onFirst: first => first.hasAttribute(attr),
			defaultValue: false,
			nameForStrict: "#hasAttribute(attr)",
		});
	}
	
	/**
	 * Determine whether or not the first element has the given property
	 * @param   {string}  prop - The property's name
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasProp(prop){
		return this.__.doOnFirst({
			onFirst: first => first.hasOwnProperty(prop),
			defaultValue: false,
			nameForStrict: "#hasProp(prop)",
		});
	}
	
	/**
	 * Determine whether or not the first element has the given data attribute
	 * @param   {string}  attr - The data attribute's name
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasData(data){
		return this.__.doOnFirst({
			onFirst: first => data in first.dataset,
			defaultValue: false,
			nameForStrict: "#hasData(data)",
		});
	}
	
	/**
	 * Determine whether or not the first element has the given class applied
	 * @param   {string}  className - The name of the class to have
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasClass(className){
		return this.__.doOnFirst({
			onFirst: first => first.classList.contains(className),
			defaultValue: false,
			nameForStrict: "#hasClass(className)",
		});
	}
	
	matches(selector){
		return this.__.doOnFirst({
			onFirst: first => cssEngine.matchesSelector(selector, first),
			defaultValue: false,
			nameForStrict: "#matches(selector)",
		});
	}
	
	
	
	/****************************************************************************************\
	 * Multiple items methods
	\****************************************************************************************/
	/**
	 * Add the given classes to each element
	 * @param   {string}               classNames - The space separated list of classes to add
	 * @returns {LightqueryCollection}
	 * @throws {InvalidArgumentError} If classNames is not a string
	 */
	addClass(classNames){
		return this.__.classManip({
			nameForStrict: "#addClass(classNames)",
			classNames,
			ifDoesNotHaveClass(classList, clazz, elem, $elem){
				classList.add(clazz);
			},
		});
	}
	
	/**
	 * Remove the given classes from each element
	 * @param   {string}               classNames - The space separated list of classes to remove
	 * @returns {LightqueryCollection}
	 * @throws {InvalidArgumentError} If classNames is not a string
	 */
	removeClass(classNames){
		return this.__.classManip({
			nameForStrict: "#removeClass(classNames)",
			classNames,
			ifHasClass(classList, clazz, elem, $elem){
				classList.remove(clazz);
			},
		});
	}
	
	/**
	 * Toggle the given classes for each element
	 * @param   {string}               classNames - The space separated list of classes to toggle
	 * @returns {LightqueryCollection}
	 * @throws {InvalidArgumentError} If classNames is not a string
	 */
	toggleClass(classNames){
		return this.__.classManip({
			nameForStrict: "#toggleClass(classNames)",
			classNames,
			anyCase(classList, clazz, elem, $elem){
				classList.toggle(clazz);
			},
		});
	}
	
	
	/**
	 * Trigger a callback on event
	 * @param   {string}               eventNames - The spaced separated list of events to listen to
	 * @param   {EventListener}        listener   - The event listener
	 * @returns {LightqueryCollection}
	 * @throws {UnsupportedError} If it cannot attach the event listener
	 * @throws {InvalidArgumentError} If the listener is not a callable or if eventNames is not a string
	 */
	on(eventNames, listener){
		if(typeof listener === "function"){
			if(typeof eventNames === "string"){
				const events = lqHelpers.spacedListString.toArray(eventNames);
				this.forEach(el => {
					events.forEach(event => {
						if(e.addEventListener)
							e.addEventListener(event, listener);
						else if(e.attachEvent)
							e.attachEvent(`on${event}`, listener);
						else
							this.__.ifStrict(() => throw new UnsupportedError("Cannot attach event listeners"));
					});
				});
			}else
				this.__.ifStrict(() => throw new InvalidArgumentError("Expected eventNames to be a string in LightqueryCollection#on(eventNames, listener)"));
		}else
			this.__.ifStrict(() => throw new InvalidArgumentError("Invalid listener in LightqueryCollection#on(eventNames, listener)"));
		
		return this;
	}
	
	/**
	 * Unregister an event listener
	 * @param   {string}               eventNames - The spaced separated list of events to stop listening to
	 * @param   {EventListener}        listener   - The event listener that was used
	 * @returns {LightqueryCollection}
	 * @throws {UnsupportedError} If it cannot detach the event listener
	 * @throws {InvalidArgumentError} If the listener is not a callable or if eventNames is not a string
	 */
	off(eventNames, listener){
		if(typeof listener === "function"){
			if(typeof eventNames === "string"){
				const events = lqHelpers.spacedListString.toArray(eventNames);
				this.forEach(el => {
					events.forEach(event => {
						if(e.removeEventListener)
							e.removeEventListener(event, listener);
						else if(e.detachEvent)
							e.detachEvent(`on${event}`, listener);
						else
							this.__.ifStrict(() => throw new UnsupportedError("Cannot detach event listeners"));
					});
				});
			}else
				this.__.ifStrict(() => throw new InvalidArgumentError("Expected eventNames to be a string in LightqueryCollection#off(eventNames, listener)"));
		}else
			this.__.ifStrict(() => throw new InvalidArgumentError("Invalid listener in LightqueryCollection#off(eventNames, listener)"));
		
		return this;
	}
	
	/**
	 * Trigger events on each element
	 * @param {string} eventNames - The spaced separated list of events to stop listening to
	 * @param {object} [options = {}] - The event options
	 * @returns {LightqueryCollection}
	 * @throws {InvalidArgumentError} If eventNames is not a string or if options is not an object
	 */
	trigger(eventNames, options = {}){
		if(typeof eventNames !== "string")
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected eventNames to be a string in LightqueryCollection#trigger(eventNames, options)"));
		if(typeof options !== "object" || options === null)
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected options to be an object in LightqueryCollection#trigger(eventNames, options)"));
		
		const events = lqHelpers.spacedListString.toArray(eventNames);
		
		const eventObjectFactory = window.CustomEvent
			? (event, opts) => new window.CustomEvent(event, opts)
			: (event, opts) => {
				const obj = document.createEvent("CustomEvent");
				obj.initCustomEvent(event, true, true, opts);
				return obj;
			};
		
		this.forEach(el => {
			const eventOptions = this.__.$.extend({target: el}, options);			
			
			events.forEach(event => {
				const eventObj = eventObjectFactory(event, eventOptions);
				el.dispatchEvent(eventObj);
			});
		});
		
		return this;
	}
	
	
	
	/****************************************************************************************\
	 * Events shorthand
	\****************************************************************************************/
	/**
	 * Trigger (or listen to) click events
	 * @param {EventListener|undefind} [listener = undefined] - The event listener to attach
	 * @returns {LightqueryCollection}
	 * @throws {InvalidArgumentError} If the listener is neither undefined nor a callback
	 */
	click(listener = undefined){
		return this.__.eventShorthand({
			eventName: "click",
			nameForStrict: "#click(listener)",
			listener,
		})
	}
}

export default LightqueryCollection