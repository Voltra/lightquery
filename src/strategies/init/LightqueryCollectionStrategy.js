import AbstractStrategy from "./AbstractStrategy";
import LightqueryCollection from "../../LightqueryCollection";

export default class LightqueryCollectionStrategy extends AbstractStrategy{
	shouldProcess(selector, context = undefined, previousResults = []){
		return selector instanceof LightqueryCollection;
	}

	process(selector, context = undefined, previousResults = []) {
		return selector;
	}
}
