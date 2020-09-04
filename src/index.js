import LightqueryFactory from "./LightqueryFactory"
import LightqueryCollection from "./LightqueryCollection"

/**
 * @constant {LightqueryFactory} µ - Global lightquery factory function
 */
const µ = new LightqueryFactory(LightqueryCollection, true);

/**
 * @constant {LightqueryFactory} $ - Alias for {@link µ}
 */
const $ = µ;

/**
 * @constant {LightqueryFactory} lq - Alias for {@link µ}
 */
const lq = µ;

/**
 * @constant {LightqueryFactory} lightquery - Alias for {@link µ}
 */
const lightquery = µ;

if(typeof window !== "undefined"){
	Object.assign(window, {
		µ,
		lq,
		lightquery,
		$,
	});
}

export {
	µ,
	$,
	lq,
	lightquery,
}