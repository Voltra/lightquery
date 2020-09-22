import AbstractStrategy from "./AbstractStrategy";
import LightqueryCollection from "../../LightqueryCollection";
export default class LightqueryCollectionStrategy extends AbstractStrategy {
  // Makes them monads
  shouldProcess(selector, context = undefined, previousResults = []) {
    return selector instanceof LightqueryCollection;
  }

  process(selector, context = undefined, previousResults = []) {
    return selector;
  }

}
//# sourceMappingURL=LightqueryCollectionStrategy.js.map