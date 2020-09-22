import { asSequence, generateSequence, extendSequence } from "sequency"; //TODO: Use this for a future plugin

const extensionFactory = lq => class LightqueryExtension {
  toLightquery() {
    return lq(this.iterator);
  }

};

const registerLightqueryExtensions = lq => {
  const Extension = extensionFactory(lq);
  extendSequence(Extension);
};

export { asSequence, generateSequence, registerLightqueryExtensions };
//# sourceMappingURL=lazy.js.map