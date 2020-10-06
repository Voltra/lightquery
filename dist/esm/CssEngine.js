import Sizzle from "sizzle";
import UnimplementedError from "./errors/UnimplementedError";
import lqHelpers from "./utils/helpers";
import "./utils/typedefs";
/**
 * @class
 * @classdesc Base class for all Css selection engines
 */

class AbstractCssEngine {
  /**
   * Find all the elements that match the given selector in the given context and append them to the previous results
   * @param {string}            selector - The selector to match
   * @param {DomElementType|undefined} [context = undefined]  - The context in which to lookup elements
   * @param {Iterable<DomElementType>} [previousResults = []] - The previous set of results
   * @returns {Iterable<DomElementType>}
   * @abstract
   */
  findAll(selector, context = undefined, previousResults = []) {
    throw new UnimplementedError("Call to unimplemented AbstractCssEngine#findAll(selector, [context, [previousResults]])");
  }
  /**
   * Determine whether or not the given element matches the given selector
   * @param {string}  selector - The selector to match against
   * @param {DomElementType} element - The element to match against the selector
   * @returns {boolean}
   * @abstract
   */


  matchesSelector(selector, element) {
    throw new UnimplementedError("Call to unimplemented AbstractCssEngine#matchesSelector(selector, element)");
  }
  /**
   * Only keep the elements that match the given selector
   * @param {string}            selector - The selector to match against
   * @param {Iterable<DomElementType>} elements - The elements to filter
   * @returns {Iterable<DomElementType>}
   * @abstract
   */


  filterMatches(selector, elements) {
    throw new UnimplementedError("Call to unimplemented AbstractCssEngine#filterMatches(selector, elements)");
  }

}
/**
 * @class
 * @classdesc Css engine based on the Sizzle library
 */


class SizzleCssEngine extends AbstractCssEngine {
  /**
   * @override
   * @inheritdoc
   */
  findAll(selector, context = undefined, previousResults = []) {
    return Sizzle(selector, context, previousResults);
  }
  /**
   * @override
   * @inheritdoc
   */


  matchesSelector(selector, element) {
    return Sizzle.matchesSelector(element, selector);
  }
  /**
   * @override
   * @inheritdoc
   */


  filterMatches(selector, elements) {
    return Sizzle.matches(selector, lqHelpers.arrayLike.toArray(elements));
  }

}
/**
 * @constant {AbstractCssEngine} cssEngine - The css engine for lightquery
 */


const cssEngine = new SizzleCssEngine();
export { AbstractCssEngine, SizzleCssEngine, cssEngine };
//# sourceMappingURL=CssEngine.js.map