import Callable from "./utils/Callable";
import LightqueryCollection from "./LightqueryCollection";
import InvalidArgumentError from "./errors/InvalidArgumentError";
import lqHelpers from "./utils/helpers";
import "./utils/typedefs";
import UnsupportedError from "./errors/UnsupportedError";
/**
 * @callback LightqueryFactory~selectCallback
 * @param {string} selector
 * @returns {LightqueryCollection}
 */

/**
 * @typedef {object} LightqueryFactorySelectObject
 * @property {LightqueryFactory~selectCallback} select
 */

const rethrow = e => () => function (e) {
  throw e;
}(e);
/**
 * @class
 * @classdesc Class that represents the implementation details of a lightquery factory
 */


class LightqueryFactoryImplDetails {
  /**
   * @param {LightqueryFactory} self - The LightqueryFactory instance
   * @param {typeof LightqueryCollection} [collectionClass = LightqueryCollection] - The class used to construct the result collections
   * @param {boolean} [strictMode = true] - Whether or not to throw exceptions instead of silently failing
   */
  constructor(self, collectionClass = LightqueryCollection, strictMode = true) {
    const collClass = class extends collectionClass {}; // Allows to customize on a per factory basis

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
      global: new Set()
    };
  }
  /**
   * Execute a callback if strict mode is on
   * @param {Callback} callback - The callback to execute
   */


  ifStrict(callback) {
    if (this.strictMode) callback();
  }
  /**
   * Create a lightquery collection from arguments
   * @param {...any}               args - The arguments for the constructor
   * @returns {LightqueryCollection}
   */


  factory(...args) {
    return new this.collectionClass(...args);
  }
  /**
   * A factory for an empty selection
   * @returns {LightqueryCollection}
   */


  emptySelection() {
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

class LightqueryFactory extends Callable {
  /**
   * Create a lightquery factory (that's what's behind µ)
   * @param {typeof LightqueryCollection} [collectionClass = LightqueryCollection] - The class used to construct the result collections
   * @param {boolean} [strictMode = true] - Whether or not to throw exceptions instead of silently failing
   */
  constructor(collectionClass = LightqueryCollection, strictMode = true) {
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
      value: new LightqueryFactoryImplDetails(this, collectionClass, strictMode)
    });
  }
  /**
   * @override
   * @param {Selector} selector
   * @param {DomElementType|undefined} context
   * @param {Iterable<DomElementType>|undefined} previousResults
   * @returns {LightqueryCollection}
   */


  __call(selector, context = undefined, previousResults = []) {
    try {
      if (typeof selector === "function") return this.ready(selector);else return this.__.factory(selector);
    } catch (e) {
      this.__.ifStrict(rethrow(e));

      return this.__.emptySelection();
    }
  }
  /**
   * Determine whether or not the plugin is registered
   * @param {string} pluginName - The plugin's name
   * @param {PluginType} [pluginType = defaultPluginType] - The plugin's type
   * @param {string} [nameForStrict = ""] - The name for error strings when strict mode is on
   * @returns {boolean}
   */


  hasPlugin(pluginName, pluginType = defaultPluginType, nameForStrict = "") {
    if (typeof pluginName !== "string") {
      this.__.ifStrict(() => function (e) {
        throw e;
      }(new InvalidArgumentError(`Expected pluginName to be a string in LightqueryFactory${nameForStrict}`)));

      return false;
    }

    if (typeof pluginType !== "string") {
      this.__.ifStrict(() => function (e) {
        throw e;
      }(new InvalidArgumentError(`Expected pluginType to be a string in LightqueryFactory${nameForStrict}`)));

      return false;
    }

    if (!lqHelpers.plugin.isValidPluginType(pluginType)) {
      this.__.ifStrict(() => function (e) {
        throw e;
      }(new InvalidArgumentError(`Invalid plugin type "${pluginType}" in LightqueryFactory${nameForStrict}`)));

      return false;
    }

    if (pluginType === "instance" && pluginName in LightqueryCollection.prototype) {
      this.__.ifStrict(() => function (e) {
        throw e;
      }(new InvalidArgumentError(`Invalid plugin name "${pluginName}", it's the name of a core instance method`)));

      return true;
    } else if (pluginType === "global" && pluginName in LightqueryFactory.prototype) {
      this.__.ifStrict(() => function (e) {
        throw e;
      }(new InvalidArgumentError(`Invalid plugin name "${pluginName}", it's the name of a core global method`)));

      return true;
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


  registerPlugin(pluginName, plugin, pluginType = defaultPluginType) {
    const hasPlugin = this.hasPlugin(pluginName, pluginType, "#registerPlugin(pluginName, plugin, pluginType)");
    /*
    //NOTE: Commented out for more flexibility
    if(typeof plugin !== "function")){
    	this.__.ifStrict(() => throw new InvalidArgumentError("Expected plugin to be a function or an object in LightqueryFactory#registerPlugin(pluginName, plugin, pluginType)"));
    	return this;
    }
    */

    if (hasPlugin) {
      // if plugin is already registered
      const pname = lqHelpers.string.capitalizeFirst(pluginType);

      this.__.ifStrict(() => function (e) {
        throw e;
      }(new InvalidArgumentError(`${pname} plugin "${pluginName}" already registered`)));
    } else {
      lqHelpers.plugin.doForPluginType({
        pluginType,
        onGlobal: () => this[pluginName] = plugin,
        onInstance: () => this.__.collectionClass.prototype[pluginName] = plugin,
        onUnknown: () => {
          this.__.ifStrict(() => function (e) {
            throw e;
          }(new InvalidArgumentError("Invalid pluginType in LightqueryFactory#registerPlugin(pluginName, plugin, pluginType)")));
        }
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


  removePlugin(pluginName, pluginType = defaultPluginType) {
    const hasPlugin = this.hasPlugin(pluginName, pluginType, "#removePlugin(pluginName, pluginType)");

    if (hasPlugin) {
      lqHelpers.plugin.doForPluginType({
        pluginType,
        onGlobal: () => this[pluginName] = undefined,
        onInstance: () => this.__.collectionClass.prototype[pluginName] = undefined,
        onUnknown: () => {
          this.__.ifStrict(() => function (e) {
            throw e;
          }(new InvalidArgumentError("Invalid pluginType in LightqueryFactory#removePlugin(pluginName, pluginType)")));
        }
      });

      this.__.plugins[pluginType].delete(pluginName);
    } else {
      const pname = lqHelpers.string.capitalizeFirst(pluginType);

      this.__.ifStrict(() => function (e) {
        throw e;
      }(new InvalidArgumentError(`${pname} plugin "${pluginName}" is not registered`)));
    }

    return this;
  }
  /**
   * Clone the lightquery factory (e.g. to have two separate sets of plugins)
   * @returns {LightqueryFactory}
   */


  cloneLightquery() {
    return new LightqueryFactory(this.__.collectionClass, this.__.strictMode);
  }
  /**
   * Determine whether or not strict mode is on
   * @returns {boolean}
   */


  isStrictModeOn() {
    return !!this.__.strictMode;
  }
  /**
   * Set strict mode to the given value
   * @param {boolean} newValue - Whether it should be ON or OFF
   * @returns {LightqueryFactory}
   */


  setStrictMode(newValue) {
    if (typeof newValue !== "boolean") {
      this.__.ifStrict(() => function (e) {
        throw e;
      }(new InvalidArgumentError(`Expected newValue to be a boolean in LightqueryFactory#setStrictMode(newValue)`)));
    }

    this.__.strictMode = !!newValue;
    return this;
  }
  /**
   * Enable strict mode
   * @returns {LightqueryFactory}
   */


  turnStrictModeOn() {
    return this.setStrictMode(true);
  }
  /**
   * Disable strict mode
   * @returns {LightqueryFactory}
   */


  turnStrictModeOff() {
    return this.setStrictMode(false);
  }
  /**
   * Execute a callback once the DOM is fully loaded
   * @param   {Callback}             callback - The function to execute after the DOM is loaded
   * @returns {LightqueryCollection}
   */


  ready(callback) {
    return this(document).ready(callback);
  }
  /**
   * Listen to resize events (includes orientation change)
   * @param {EventListener} listener
   * @returns {LightqueryCollection}
   */


  resize(listener) {
    return this(window).resize(listener);
  }
  /**
   * Help query using the given context as the selection root
   * @param   {DomElementType} context - The context to restrict to
   * @returns {LightqueryFactorySelectObject}
   */


  from(context) {
    return {
      select: selector => this(selector, context)
    };
  }
  /**
      * Extend an object using many objects
      * @param   {object}    target     - The object to extend
      * @param   {...object} objects - The objects to derive properties from
      * @returns {object}
      */


  extend(target, ...objects) {
    return Object.assign(target, ...objects);
  }
  /**
   * Getter/setter for CSS variables at the root
   * @param {string} variable - The CSS variable name
   * @param {string|number|undefined} value - The new value
   * @returns {LightqueryCollection|string|number|null}
   */


  cssVar(variable, value) {
    const ret = this(document.documentElement).cssVar(variable, value);
    return typeof value === "undefined" ? ret : this;
  }
  /**
   * Create DOM from an HTML string
   * @param {string} htmlString - The string that contains the HTML structure to create
   * @returns {LightqueryCollection}
   */


  create(htmlString) {
    const errorFactory = () => function (e) {
      throw e;
    }(new UnsupportedError("Cannot create DOM elements from HTML string in LightqueryFactory#create(htmlString)"));

    if (!document.createRange) this.__.ifStrict(errorFactory);
    const range = document.createRange();
    if (!range.createContextualFragment) this.__.ifStrict(errorFactory);

    try {
      const el = range.createContextualFragment(htmlString);
      return this(el);
    } catch (e) {
      this.__.ifStrict(rethrow(e));

      return this.__.emptySelection();
    }
  }

}

export default LightqueryFactory;
//# sourceMappingURL=LightqueryFactory.js.map