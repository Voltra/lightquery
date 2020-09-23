///<reference path="../LightqueryCollection.d.ts"/>

import LightqueryCollection from "../LightqueryCollection";

export type DomElementType = Element|DocumentFragment|Document|Window;
export type DomElements = DomElementType|NodeList|HTMLCollection|Iterable<DomElementType>;


export type ElementOrLightquery = DomElementType|LightqueryCollection;
export type ElementsOrLightquery = DomElements|LightqueryCollection;

export type Callback<R = any> = () => R;
export type GenericCallback<T = any, R = any> = (arg: T) => R;
export type GenericReducer<Acc = any, El = any> = (acc: Acc, el: El) => Acc;

// export type EventListener<R> = GenericCallback<Event|undefined, R>;
export type ElementCallback<R = any> = GenericCallback<Element, R>;
export type ElementsCallback<R = any> = GenericCallback<Iterable<Element>, R>;
export type LightqueryCollectionCallback<R = any> = GenericCallback<LightqueryCollection, R>;

export type MapperFunction<T = any, U = any> = GenericCallback<T, U>;
export type Predicate<T = any> = GenericCallback<T, boolean>;
export type ElementMapper<R = any> = MapperFunction<Element, R>;
export type ElementReducer<R = any> = GenericReducer<R, Element>;

export type Selector<R = any> = string|DomElements|Callback<R>;

export type PluginType = "global"|"instance";
