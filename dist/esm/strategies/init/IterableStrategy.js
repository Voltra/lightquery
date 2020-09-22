function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import AbstractStrategy from "./AbstractStrategy";
import SingleElementStrategy from "./SingleElementStrategy";
import LightqueryCollection from "../../LightqueryCollection";
export default class IterableStrategy extends AbstractStrategy {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "allowedClasses", IterableStrategy.allowedClasses);

    _defineProperty(this, "allowedItemClasses", SingleElementStrategy.allowedClasses);
  }

  static get allowedClasses() {
    //TODO: Add sequency sequences to the list
    return [//			Iterator,
    Array, NodeList];
  }

  shouldProcess(selector, context = undefined, previousResults = []) {
    if (!selector) return false;
    const anyClass = this.allowedClasses.some(clazz => selector instanceof clazz);
    if (!anyClass) return false; //TODO: Check if we really want item consistency

    /*for(const item of selector){
    	if(!this.allowedItemClasses.some(clazz => item instanceof clazz))
    		return false;
    }*/

    return true;
  }

  process(selector, context = undefined, previousResults = []) {
    return [...previousResults, ...selector];
  }

}
//# sourceMappingURL=IterableStrategy.js.map