import LightqueryFactory from "./LightqueryFactory"
import LightqueryCollection from "./LightqueryCollection"

/**
 * @var {LightqueryFactory} µ - Global lightquery factory function
 */
const µ = new LightqueryFactory(LightqueryCollection, true);

/**
 * @alias µ
 */
const $ = µ;

/**
 * @alias µ
 */
const lq = µ;

/**
 * @alias µ
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