//cf. https://hackernoon.com/creating-callable-objects-in-javascript-d21l3te1

export default class Callable extends Function{
	constructor(){
		super("return this.__bound.__call.apply(this.__bound, arguments)");
		this.__bound = this.bind(this);
		// return this.__bound;
	}
	
	__call(...args){
		throw new Error("Unimplemented Callable#__call(...args)");
	}
}