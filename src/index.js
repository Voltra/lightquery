import LightqueryFactory from "./LightqueryFactory"
import LightqueryCollection from "./LightqueryCollection"

const µ = new LightqueryFactory(LightqueryCollection, true);
const $ = µ;
const lq = µ;
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