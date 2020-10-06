/**
 * Polyfill a method
 * @template T
 * @param {Class<T>} constructor - The constructor to add the polyfill to
 * @param {string} methodName - The name of the method to polyfill
 * @param {Function} method - The function that serves as polyfill
 */
const polyfillMethod = (constructor, methodName, method) => {
	if(methodName in  constructor.prototype)
		return;

	constructor.prototype[methodName] = method;
};

polyfillMethod(Array, "some", function(predicate){
	/**
	 * @this Array
	 */

	for(const i in this){
		if(predicate(this[i], i, this))
			return true;
	}

	return false;
});

polyfillMethod(Array, "every", function(predicate){
	/**
	 * @this Array
	 */

	for(const i in this){
		if(!predicate(this[i], i, this))
			return false;
	}

	return true;
});
