import { cssEngine } from "./CssEngine"
import UnsupportedError from "./errors/UnsupportedError"
import InvalidArgumentError from "./errors/InvalidArgumentError"
import { strategies } from "./strategies/init"
import lqHelpers from "./utils/helpers"
import "./utils/typedefs"
import NotEnoughElementsError from "./errors/NotEnoughElementsError";



/**
 * @callback LightqueryCollection~onFirst
 * @template R
 * @param {Element} first
 * @returns {R}
 */

/**
 * @callback LightqueryCollection~setterRoot
 * @template X
 * @param {Element} e
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
 * @param {Element} element - The element being modified
 * @param {LightqueryCollection} $element - The LightqueryCollection instance to the element being modified
 * @returns {any}
 */




/**
 * Callback to throw a prefilled NotEnoughElementsError
 * @returns {Callback}
 */
const notEnoughFor = str => () => throw new NotEnoughElementsError(`Not enough elements to apply LightqueryCollection${str})`);


/**
 * Predicates to satisfy to be an element of a lightquery collection
 */
const checks = [
	e => typeof e !== "undefined",
	e => e !== null,
];

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
			},
		});
	}

	__cleanElements(elements){
		const uniques = new WeakSet();
		const ret = [];

		for(const element of elements){
			const passAllChecks = [
				...checks,
				e => !uniques.has(e),
			].every(check => check(element));

			if(passAllChecks){
				ret.push(element);
				uniques.add(element);
			}
		}

		return ret;

		/*
			asSequence(this.elements)
			.filterNotNull()
			.filterNot(x => typeof x === "undefined")
			.distinct()
			.toArray();
		*/
	}

	/**
	 * Make the LightqueryCollection instance iterable
	 * @private
	 * @readonly
	 */
	makeIterable(){
		this.elements = this.__cleanElements(this.elements);

		const { elements, self } = this;

		Object.defineProperties(self, {
			[Symbol.iterator]: {
				get(){
					return elements[Symbol.iterator];
				},
			},
			length: {
				enumerable: true,
				get(){
					return elements.length;
				},
			},
		});

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
						const root = setterRoot(this.getElement(e));
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

			const first = this.getElement(self[0]);
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
		this.$.__.ifStrict(callback);
	}

	/**
	 * Apply a function on the first element of a LightqueryCollection if it exists
	 * @template R, U
	 * @param {object} options
	 * @param {LightqueryCollection~onFirst<R>} options.onFirst - The function to apply on the first element
	 * @param {string} options.nameForStrict - The name to use on error in strict mode
	 * @param {U} [options.defaultValue = false] - The default value to return if there's no elements and strict mode is off
	 * @returns {R|U}
	 * @throws {NotEnoughElementsError} if strict mode is on and there are not enough elements
	 */
	doOnFirst({ onFirst, nameForStrict, defaultValue = false, }){
		const { self } = this;
		const first = this.getElement(self[0]);

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
			return this.elements[method](e => {
                const el = this.getElement(e);
			    return func.call(el, el);
			});
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
				    const element = this.getElement(elem);
					const $elem = $(element);

					if($elem.hasClass(clazz))
						ifHasClass(element.classList, clazz, element, $elem);
					else
						ifDoesNotHaveClass(element.classList, clazz, element, $elem);


					anyCase(element.classList, clazz, element, $elem);
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
		const { self } = this;

		if(typeof listener === "undefined")
			return self.trigger(eventName);
		else if(typeof listener === "function")
			return self.on(eventName, listener);
		else
			this.ifStrict(() => throw new InvalidArgumentError(`Expected argument listener to be undefined or a function in LightqueryCollection${nameForStrict}`));

		return self;
	}

    /**
     * Get the value of a CSS property
     * @param {DomElementType} element - The element to get properties for
     * @param {string} property - The name of the property
     * @returns {string}
     */
	getCssProperty(element, property){
	    const styles = getComputedStyle(this.getElement(element));
	    return styles[property];
    }

    /**
     * Set the value of a CSS property
     * @param {DomElementType} element - The element to set properties for
     * @param {string} property - The name of the property
     * @param {number|string} value - The new value
     */
    setCssProperty(element, property, value){
        this.getElement(element).style[property] = value;
    }

    /**
     * Get an element from a DOM element
     * @param {DomElementType} domEl
     * @returns {Element}
     */
    getElement(domEl){
        return lqHelpers.elements.getElement(domEl);
    }

    /**
     * Filter an array based on a CSS selector
     * @param {Element[]} ret
     * @param {string|undefined} selector
     * @returns {LightqueryCollection}
     */
    selectorFiltering(ret, selector){
        switch(typeof selector){
            case "undefined":
                return this.$(ret);

            case "string":
                return this.$(ret.filter(el => cssEngine.matchesSelector(selector, el)));

            default:
                this.ifStrict(() => throw new InvalidArgumentError("Expected selector to be a string or undefined in LightqueryCollection#children(selector)"));
                return this.$.__.emptySelection();
        }
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
		return this.__.$(document).ready(callback);
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
		 * @property {LightqueryCollectionImplDetails} __ - The protected implementation details
		 */
		Object.defineProperty(this, "__", {
			enumerable: false,
			configurable: false,
			writable: false,
			value: new LightqueryCollectionImplDetails(this, selector, context, previousResults)
		});

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
		if(this.__.selector === document){
			if(["complete", "interactive"].includes(document.readyState))
				callback.call(document);

			if(typeof document.addEventListener == "function"){
				document.addEventListener("DOMContentLoaded", callback, false);
			}else
				throw new UnsupportedError("Cannot attach document ready event handler");
		}

		return this;
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
     * @template U
	 * @param   {ElementMapper<U>|string} mapper - The mapping function
	 * @param   {...any} args - Arguments for string callable
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
	 * @param   {...any} args - Arguments for string callable
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

    /**
     * Reduce the set of elements to a single return value
     * @template T
     * @param {ElementReducer<T>} reducer - The reducing function
     * @param {T|undefined} acc - The initial value of the accumulator
     * @returns {T|undefined}
     */
	reduce(reducer, acc = undefined){
	    return this.__.elements.reduce(reducer, acc);
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
     * Get the first item
     * @returns {LightqueryCollection|null}
     */
	first(){
	    return this.eq(0);
    }

    /**
     * Get the last item
     * @returns {LightqueryCollection|null}
     */
    last(){
	    return this.eq(this.length - 1);
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
			nameForStrict: "#hasAttribute(attr)",
			onFirst: first => first.hasAttribute(attr),
			defaultValue: false,
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
			nameForStrict: "#hasProp(prop)",
			onFirst: first => first.hasOwnProperty(prop),
			defaultValue: false,
		});
	}

	/**
	 * Determine whether or not the first element has the given data attribute
	 * @param   {string}  data - The data attribute's name
	 * @returns {boolean}
	 * @throws {NotEnoughElementsError} If strict mode is on and there are no elements
	 */
	hasData(data){
		return this.__.doOnFirst({
			nameForStrict: "#hasData(data)",
			onFirst: first => data in first.dataset,
			defaultValue: false,
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
			nameForStrict: "#hasClass(className)",
			onFirst: first => first.classList.contains(className),
			defaultValue: false,
		});
	}

    /**
     * Determine whether or not the first element matches the given selector
     * @template R
     * @param {string} selector - The CSS selector to match against
     * @returns {R|boolean}
     */
	matches(selector){
		return this.__.doOnFirst({
			nameForStrict: "#matches(selector)",
			onFirst: first => cssEngine.matchesSelector(selector, first),
			defaultValue: false,
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
						if(el.addEventListener)
							el.addEventListener(event, listener);
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

		const eventObjectFactory = (event, opts) => new window.CustomEvent(event, opts);

		this.forEach(el => {
			const eventOptions = this.__.$.extend({target: el}, options);

			events.forEach(event => {
				const eventObj = eventObjectFactory(event, eventOptions);
				el.dispatchEvent(eventObj);
			});
		});

		return this;
	}

    /**
     * Get the closest element matching the given selector
     * @param {string} selector - The CSS selector for the closest elements to find
     * @returns {LightqueryCollection}
     */
	closest(selector){
	    if(typeof selector !== "string"){
	        this.__.ifStrict(() => throw new InvalidArgumentError("Expected selector to be a string in LightqueryCollection#closest(selector)"));
	        return this;
        }

	    const closests = this.map(el => el.closest(selector));
	    return this.__.$(closests);
    }

    /**
     * Get all the children (that optionally match the given selector)
     * @param {string|undefined} selector - The CSS selector to restrict children to
     * @return {LightqueryCollection}
     */
    children(selector = undefined){
	    const ret = this.reduce((children, el) => {
	        if(el.children.length > 0)
	            children.push(lqHelpers.arrayLike.toArray(el.children));

	        return children;
        }, []);

	    return this.__.selectorFiltering(ret, selector);
    }

    /**
     * Get all the parents (filtering by the given selector if there is any)
     * @param {string|undefined} selector - The CSS selector to restrict parents to
     * @returns {LightqueryCollection}
     */
    parent(selector = undefined){
        const ret = this.reduce((arr, el) => {
            if(el.parentElement)
                arr.push(el.parentElement);

            return arr;
        }, []);

        return this.__.selectorFiltering(ret, selector);
    }

    /**
     * Get all the predecessors (parents), filtering by the given selector if there is any
     * @param {string|undefined} selector  - The CSS selector to restrict predecessors to
     * @returns {LightqueryCollection}
     */
    parents(selector = undefined){
        const ret = this.reduce((arr, el) => {
            let cur = el;

            while(cur.parentElement){
                arr.push(cur.parentElement);
                cur = cur.parentElement;
            }

            return arr;
        }, []);

        return this.__.selectorFiltering(ret, selector);
    }

    /**
     * Get all the descendants (filtering by the given selector if any)
     * @param {string|undefined} selector - The selector to restrict descendants to
     * @returns {LightqueryCollection}
     */
    find(selector = undefined){
        const ret = this.reduce((arr, el) => {
            const $found = this.__.$(selector || "*", el);
            arr.push(...$found.__.elements);
            return arr;
        }, []);

        return this.__.$(ret);
    }

    /**
     * Reduce the set to the elements that have at least one descendant that matches the selector
     * @param {string} selector
     * @returns {LightqueryCollection}
     */
    has(selector){
        if(typeof selector !== "string"){
            this.__.ifStrict(() => throw new InvalidArgumentError("Expected selector to be a string in LightqueryCollection#has(selector)"));
            return this.__.$.__.emptySelection();
        }

        return this.filter(e => this.__.$(e).find(selector));
    }



	/****************************************************************************************\
	 * DOM based
    \****************************************************************************************/
	/**
	 * Append the given elements to the first result of the results set
	 * @param {ElementsOrLightquery} elements - The elements to append
	 * @returns {LightqueryCollection}
	 */
	append(elements){
        const nameForStrict = "#append(elements)";

        return this.__.doOnFirst({
            onFirst: el => {
                lqHelpers.elements.forElements({
                    elements,
                    LightqueryCollection,
                    nameForStrict,

                    onElement: e => el.append(e),
                    onElements: e => el.append(...e),
                });

                return this;
            },
            nameForStrict,
            defaultValue: this,
        });

    }

	/**
	 * Appends the result set to the given element
	 * @param {ElementOrLightquery|string} element - The element to append to (or a CSS selector to it)
	 * @returns {LightqueryCollection}
	 */
	appendTo(element){
		if(element instanceof LightqueryCollection){
			this.__.$(element).append(this);
		}else if(lqHelpers.elements.isElement(element)){
			this.__.$(this.__.getElement(element)).append(this);
		}else if(typeof element === "string"){
			this.appendTo(this.__.$(element));
		}else{
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected element to be an Element, a LightqueryCollection or a CSS selector in LightqueryCollection#appendTo(element)"));
		}

		return this;
    }

	/**
	 * Prepend the given elements to the first result of the results set
	 * @param {ElementsOrLightquery} elements - The elements to prepend
	 * @returns {LightqueryCollection}
	 */
	prepend(elements){
		const nameForStrict = "#append(elements)";

		return this.__.doOnFirst({
			onFirst: el => {
				lqHelpers.elements.forElements({
					elements,
					LightqueryCollection,

					onElement: e => el.prepend(e),
					onElements: e => el.prepend(...e),
					nameForStrict,
				});
			},
			defaultValue: this,
			nameForStrict,
		});
	}

	/**
	 * Appends the result set to the given element
	 * @param {ElementOrLightquery|string} element - The element to append to (or a CSS selector to it)
	 * @returns {LightqueryCollection}
	 */
	prependTo(element){
		if(element instanceof LightqueryCollection){
			this.__.$(element).prepend(this);
		}else if(lqHelpers.elements.isElement(element)){
			this.__.$(this.__.getElement(element)).prepend(this);
		}else if(typeof element === "string"){
			this.prependTo(this.__.$(element));
		}else{
			this.__.ifStrict(() => throw new InvalidArgumentError("Expected element to be an Element, a LightqueryCollection or a CSS selector in LightqueryCollection#prependTo(element)"));
		}

		return this;
	}



    /****************************************************************************************\
     * Misc.
    \****************************************************************************************/
    /**
     * Add elements to the set of results
     * @param {Selector} selector - The selector for the new elements
     * @param {DomElementType|undefined} context
     * @returns {LightqueryCollection}
     */
	add(selector, context = undefined){
	    const $others = this.__.$(selector, context);

	    const elems = [
            ...this.__.elements,
            ...$others.__.elements,
        ];

	    return this.__.$(elems);
    }

    /**
     * Getter/setter for CSS properties
     * @param {string|string[]|Record<string, string|number>} properties - The property (or properties) to get/set
     * @param {string|number|undefined} value - The new value of the property (or properties)
     * @returns {LightqueryCollection|string|number|null}
     */
    css(properties, value = undefined){
        if(typeof value === "undefined"){
            if(properties instanceof Array){ // get all values from first
                return this.__.doOnFirst({
                    nameForStrict: "#css(properties, value)",
                    defaultValue: {},
                    onFirst: el => {
                        return properties.reduce((ret, property) => {
                            if(typeof property !== "string"){
                                this.__.ifStrict(() => throw new InvalidArgumentError(`Property "${property}" is not a string`));
                            }else
                                ret[property] = this.__.getCssProperty(el, property);

                            return ret;
                        }, {});
                    },
                });
            }else if(properties && typeof properties === "object"){ // set all values for all
                Object.entries(properties)
                    .forEach(([prop, val]) => {
                        this.forEach(el => this.__.setCssProperty(el, prop, val));
                    });

                return this;
            }else if(typeof properties === "string"){ // get value from first
                return this.__.doOnFirst({
                    nameForStrict: "#css(properties, value)",
                    defaultValue: "",
                    onFirst: el => this.__.getCssProperty(el, properties),
                });
            }else{
                this.__.ifStrict(() => throw new InvalidArgumentError("Invalid properties in LightqueryCollection#css(properties, value)"));
                return "";
            }
        }else{ // set values for all
            const props = properties instanceof Array ? properties : [properties];

            this.forEach(el => props.forEach(prop => {
                if(typeof prop !== "string"){
                    this.__.ifStrict(() => throw new InvalidArgumentError(`Property "${prop}" is not a string`));
                    return;
                }

                this.__.setCssProperty(el, prop, value);
            }));

            return this;
        }
    }

    /**
     * Getter/setter for CSS variables at the root
     * @param {string} variable - The CSS variable name
     * @param {string|number|undefined} value - The new value
     * @returns {LightqueryCollection|string|number|null}
     */
    cssVar(variable, value){
        if(typeof variable !== "string"){
            this.__.ifStrict(() => throw new InvalidArgumentError("Expected variable to be a string in LightqueryCollection#cssVar(variable, value)"));
            return typeof value === "undefined" ? null : this;
        }

        const varname = lqHelpers.css_variables.regex.no_trailing.test(variable) ? `--${variable}` : variable;

        if(typeof value === "undefined"){ // get
            return this.__.doOnFirst({
                nameForStrict: "#cssVar(variable, value)",
                defaultValue: null,
                onFirst: el => getComputedStyle(el).getPropertyValue(varname),
            });
        }else // set
            return this.forEach(el => el.style.setProperty(varname, value));
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

    /**
     * Listen to hovering events
     * @param {EventListener} onEnter - The listener to call on enter
     * @param {EventListener} onLeave - The listener to call on leave
     * @returns {LightqueryCollection}
     */
	hover(onEnter, onLeave){
		return this.on("mouseenter", onEnter)
					.on("mouseleave", onLeave);
	}

    /**
     * Listen to resize events (includes orientation change)
     * @param {EventListener} listener - The event listener to attach
     * @returns {LightqueryCollection}
     */
	resize(listener){
	    if(this.__.selector !== window){
	        this.__.ifStrict(() => throw new InvalidArgumentError("Can only attach resize events on the window object"));
	        return this;
        }

	    return this.on("resize orientationchange", listener);
    }
}

export default LightqueryCollection
