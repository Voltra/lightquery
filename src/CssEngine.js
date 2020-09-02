import Sizzle from "sizzle"
import UnimplementedError from "../errors/UnimplementedError"
import lqHelpers from "../utils/helpers"

export class AbstractCssEngine{
	/**
	 * Find all the elements that match the given selector in the given context and append them to the previous results
	 * @param {string}            selector        The selector to match
	 * @param {Element|undefined} context         = undefined  The context in which to lookup elements
	 * @param {Iterable<Element>} previousResults = [] The previous set of results
	 * @returns {Iterable<Element>}
	 */
	findAll(selector, context = undefined, previousResults = []){
		throw new UnimplementedError("Call to unimplemented AbstractCssEngine#findAll(selector, [context, [previousResults]])");
	}
	
	/**
	 * Determine whether or not the given element matches the given selector
	 * @param {string}  selector The selector to match against
	 * @param {Element} element  The element to match against the selector
	 * @returns {boolean}
	 */
	matchesSelector(selector, element){
		throw new UnimplementedError("Call to unimplemented AbstractCssEngine#matchesSelector(selector, element)");
	}
	
	/**
	 * Only keep the elements that match the given selector
	 * @param {string}            selector The selector to match against
	 * @param {Iterable<Element>} elements The elements to filter
	 * @returns {Iterable<Element>}
	 */
	filterMatches(selector, elements){
		throw new UnimplementedError("Call to unimplemented AbstractCssEngine#filterMatches(selector, elements)");
	}
}

export class SizzleCssEngine extends AbstractCssEngine{
	findAll(selector, context = undefined, previousResults = []){
		return Sizzle(selector, context, previousResults);
	}
	
	matchesSelector(selector, element){
		return Sizzle.matches(element, selector);
	}
	
	filterMatches(selector, elements){
		return Sizzle.matches(selector, lqHelpers.arrayLike.toArray(elements));
	}
}

/**
 * @var {AbstractCssEngine} The css engine for lightquery
 */
export const cssEngine = new SizzleCssEngine();