/**
 * @typedef {Element|Document|ShadowRoot} DomElementType
 */

/**
 * @typedef {DomElementType|NodeList|Iterable<DomElementType>} DomElements
 */

/**
 * @typedef	{string|DomElements|Callback} Selector
 */

/**
 * @typedef {"instance"|"global"} PluginType
 */

/**
 * @callback Callback
 * @returns {any}
 */

/**
 * @callback EventListener
 * @param {Event|undefined} e
 * @returns {any}
 */

/**
 * @callback ElementCallback
 * @param {DomElementType} e
 * @returns {any}
 */

/**
 * @callback MapperFunction
 * @template T,U
 * @param {T} item
 * @returns {U}
 */

/**
 * @callback Predicate
 * @template T
 * @param {T} item
 * @returns {boolean}
 */

/**
 * @callback ElementMapper
 * @template T
 * @param {DomElementType} e
 * @returns {T}
 */
