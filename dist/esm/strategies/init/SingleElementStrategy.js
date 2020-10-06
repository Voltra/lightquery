function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import AbstractStrategy from "./AbstractStrategy";
export default class SingleElementStrategy extends AbstractStrategy {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "allowedClasses", SingleElementStrategy.allowedClasses);
  }

  static get allowedClasses() {
    return [Element, Document, DocumentFragment, ShadowRoot, Window];
  }

  shouldProcess(selector, context = undefined, previousResults = []) {
    return selector && this.allowedClasses.some(clazz => selector instanceof clazz);
  }

  process(selector, context = undefined, previousResults = []) {
    return [...previousResults, selector];
  }

}
//# sourceMappingURL=SingleElementStrategy.js.map