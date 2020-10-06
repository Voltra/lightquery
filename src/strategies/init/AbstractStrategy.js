import UnimplementedError from "../../errors/UnimplementedError"

export default class AbstractStrategy{
	/**
	 * Determine whether or not it should process the given selector
	 * @param {any}               selector        The selector to process
 	 * @param {DomElementType|undefined} context         The context to get elements from
 	 * @param {Iterable<DomElementType>} previousResults The previous set of results
	 * @returns {boolean}
	 */
	shouldProcess(selector, context = undefined, previousResults = []){
		throw new UnimplementedError("Call to unimplemented AbstractStrategy#shouldProcess(selector)");
	}

	/**
	 * Processes the given selector
	 * @param {any}               selector        The selector to process
 	 * @param {DomElementType|undefined} context         The context to get elements from
 	 * @param {Iterable<DomElementType>} previousResults The previous set of results
	 * @returns {Iterable<DomElementType>}
	 */
	process(selector, context = undefined, previousResults = []){
		throw new UnimplementedError("Call to unimplemented AbstractStrategy#process(selector)");
	}
}
