import AbstractStrategy from "./AbstractStrategy"
import SingleElementStrategy from "./SingleElementStrategy"
import LightqueryCollection from "../../LightqueryCollection"

export default class IterableStrategy extends AbstractStrategy{
	static get allowedClasses(){
		//TODO: Add sequency sequences to the list
		return [
//			Iterator,
			Array,
			NodeList,
			HTMLCollection,
		];
	}

	allowedClasses = IterableStrategy.allowedClasses;
	allowedItemClasses = SingleElementStrategy.allowedClasses;

	shouldProcess(selector, context = undefined, previousResults = []){
		if(!selector)
			return false;


		const anyClass = this.allowedClasses.some(clazz => selector instanceof clazz);
		if(!anyClass)
			return false;

		//TODO: Check if we really want item consistency
		/*for(const item of selector){
			if(!this.allowedItemClasses.some(clazz => item instanceof clazz))
				return false;
		}*/

		return true;
	}

	process(selector, context = undefined, previousResults = []){
		return [...previousResults, ...selector];
	}
}
