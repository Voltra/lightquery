import LightqueryFactory from "./LightqueryFactory"
import LightqueryCollection from "./LightqueryCollection"

const µ = new LightqueryFactory(LightqueryCollection, true);
const $ = µ;
const lq = µ;
const lightquery = µ;

export {
	µ,
	$,
	lq,
	lightquery,
}