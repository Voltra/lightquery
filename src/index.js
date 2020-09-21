import "./utils/polyfills"
import LightqueryFactory from "./LightqueryFactory"
import LightqueryCollection from "./LightqueryCollection"

//TODO: Make a lightquery plugin for sequency

/**
 * Construct an instance of lightquery that derives from a plugin-free source
 * @param {boolean} [strict = true] - Whether or not to enable strict mode
 * @returns {LightqueryFactory}
 */
const makePureLightquery = (strict = true) => new LightqueryFactory(LightqueryCollection, strict);

/**
 * @constant {LightqueryFactory} µ - Global lightquery factory function
 */
const µ = makePureLightquery(true);

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
        makePureLightquery,
	});
}

export {
	µ,
	$,
	lq,
	lightquery,
    makePureLightquery,
}
