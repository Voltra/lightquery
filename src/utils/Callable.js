import UnimplementedError from "../errors/UnimplementedError"

//cf. https://hackernoon.com/creating-callable-objects-in-javascript-d21l3te1

class Callable extends Function{
	constructor(){
		super("return this.__bound.__call.apply(this.__bound, arguments)");
		this.__bound = this.bind(this);
		return this.__bound;
	}
	
	/**
	 * Code to execute when the callable is invoked
	 * @private
	 * @param {...any} ...args - The invokation arguments
	 * @throws {UnimplementedError} If not implemented
	 */
	__call(...args){
		throw new UnimplementedError("Unimplemented Callable#__call(...args)");
	}
}

export default Callable