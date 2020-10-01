import {
    Callback,
    DomElementType, ElementCallback,
    ElementMapper, ElementOrLightquery, ElementReducer,
    GenericCallback,
    MapperFunction,
    Predicate,
    Selector
} from "./utils/typedefs";
import LightqueryFactory from "./LightqueryFactory";

export type LightqueryCollection_onFirst<R = any> = GenericCallback<Element, R>;
export type LightqueryCollection_setterRoot<X = any> = GenericCallback<Element, X>;
export type LightqueryCollection_setValueFactory<T = any, U = any, V = any> = (oldValue: T, destObject: U, key: string) => V;
export type LightqueryCollection_classManipHandler<R = any> = (classList: DOMTokenList, clazz: string, element: Element, $element: LightqueryCollection) => R;
export type LightquerySetValueFactory = LightqueryCollection_setValueFactory<string, DomElementType, string>;

export declare class LightqueryCollectionImplDetails{
    public readonly self: LightqueryCollection;
    public readonly selector: Selector;
    public readonly previousResults: Iterable<DomElementType>;
    public readonly elements: DomElementType[];
    public readonly lightquery: LightqueryFactory;
    public readonly $: LightqueryFactory;

    public constructor(self: LightqueryCollection, selector: Selector, context?: DomElementType, previousResults?: Iterable<DomElementType>);

    protected __cleanElements(elements: any[]): DomElementType[];
    public makeIterable(): void;

    public getSetMethod<T = any, U = any, V = any, X = any>(options: { value: T|LightqueryCollection_setValueFactory<any, X, T>, key: string, strictDefault?: U, looseDefault?: V, setterRoot?: LightqueryCollection_setterRoot<X>}): T|U|V;
    public defaultValue<T = any, U = any>(options: { strict: T, loose: U }): T|U;
    public ifStrict<R = any>(callback: Callback<R>): void;
    public doOnFirst<R = any, U = any>(options: { onFirst: LightqueryCollection_onFirst<R>, nameForStrict: string, defaultValue?: U }): R|U;
    public arrayMethodDelegate<T = any>(options: { method: string, func: string|ElementMapper<T>, args?: any[] }): T[]|any[];
    public classManip(options: { classNames: string, nameForStrict: string, ifHasClass?: LightqueryCollection_classManipHandler, ifDoesNotHaveClass?: LightqueryCollection_classManipHandler, anyCase?: LightqueryCollection_classManipHandler }): void;
    public eventShorthand(options: { eventName: string, listener?: EventListener, nameForStrict: string }): LightqueryCollection;
    public getCssProperty(element: DomElementType, property: string): string;
    public setCssProperty(element: DomElementType, property: string, value: number|string): string;
    public getElement(element: DomElementType): Element;
    public selectorFiltering(ret: Element[], selector?: string): LightqueryCollection;
    public dimensionShorthand(args: { value: string|number|undefined, nameForStrict: string, onFirst: LightqueryCollection_onFirst<number>, cssProperty: "width"|"height" }): LightqueryCollection|number|null;
}

declare class LightqueryCollection implements Iterable<DomElementType>{
    protected readonly __: LightqueryCollectionImplDetails;
    public [Symbol.iterator]();
    public readonly length: number;

    public constructor(selector: Selector, context?: DomElementType, previousResults?: Iterable<DomElementType>);

    public ready(callback: Callback): this;
    public resize(listener: EventListener): this;

    public forEach(callback: ElementCallback): this;
    public map<U = any>(mapper: string|ElementMapper<U>, ...args: any[]): U[]|any[];
    public filter(predicate: string|Predicate<DomElementType>, ...args: any[]): LightqueryCollection;
    public reduce<Acc = any>(reducer: ElementReducer<Acc>, acc?: Acc): Acc|undefined;
    public all(predicate: string|Predicate<DomElementType>, ...args: any[]): boolean;
    public any(predicate: string|Predicate<DomElementType>, ...args: any[]): boolean;
    public none(predicate: string|Predicate<DomElementType>, ...args: any[]): boolean;
    public notAll(predicate: string|Predicate<DomElementType>, ...args: any[]): boolean;
    public toArray(): DomElementType[];

    public eq(index: number): LightqueryCollection|null;
    public first(): LightqueryCollection|null;
    public last(): LightqueryCollection|null;
    public text(value?: LightquerySetValueFactory|string|number|null): this|string|null;
    public val(value?: LightquerySetValueFactory|string|number|null): this|string|null;
    public html(value?: LightquerySetValueFactory|string|number|null): this|string|null;
    public attr(name: string, value?: LightqueryCollection_setValueFactory<string, NamedNodeMap, string>|string|number|null): this|string|null;
    public prop(name: string, value?: LightqueryCollection_setValueFactory<string, DOMStringMap, string>|string|number|null): this|string|number|null;
    public data(name: string, value?: LightquerySetValueFactory|string|number|null): this|string|null;
    public hasAttr(attr: string): boolean;
    public hasProp(prop: string): boolean;
    public hasData(data: string): boolean;
    public hasClass(className: string): boolean;
    public matches(selector: string): boolean

    public addClass(classNames: string): this;
    public removeClass(classNames: string): this;
    public toggleClass(classNames: string): this;
    public removeAttr(attr: string): this;
    public removeProp(prop: string): this;
    public removeData(data: string): this;
    public on(eventNames: string, listener: EventListener): this;
    public off(eventNames: string, listener: EventListener): this;
    public trigger(eventNames: string, options?: Object): this;
    public closest(selector: string): LightqueryCollection;
    public children(selector?: string): LightqueryCollection;
    public parent(selector?: string): LightqueryCollection;
    public parents(selector?: string): LightqueryCollection;
    public find(selector?: string): LightqueryCollection;
    public has(selector: string): LightqueryCollection;
    public prevAll(selector?: string): LightqueryCollection;
    public nextAll(selector?: string): LightqueryCollection;
    public siblings(selector?: string): LightqueryCollection;
    public prev(): LightqueryCollection;
    public next(): LightqueryCollection;

    public append(elements: ElementOrLightquery): this;
    public appendTo(elements: ElementOrLightquery|string): this;
    public prepend(elements: ElementOrLightquery): this;
    public prependTo(elements: ElementOrLightquery|string): this;
    public before(elements: ElementOrLightquery): this;
    public insertBefore(elements: ElementOrLightquery|string): this;
    public after(elements: ElementOrLightquery): this;
    public insertAfter(elements: ElementOrLightquery|string): this;
    public remove(): LightqueryCollection;
    public empty(): this;

    public add(selector: Selector, context?: DomElementType): LightqueryCollection;
    public css(properties: string|string[]|Record<string, string|number>, value?: string|number): this|string|number|null;
    public cssVar(variable: string, value?: string|number): this|string|number|null;

    public click(listener?: EventListener): this;
    public doubleClick(listener?: EventListener): this;
    public mouseUp(listener?: EventListener): this;
    public mouseDown(listener?: EventListener): this;
    public mouseEnter(listener?: EventListener): this;
    public mouseLeave(listener?: EventListener): this;
    public hover(onEnter: EventListener, onLeave: EventListener): this;
    public focus(listener?: EventListener): this;
    public blur(listener?: EventListener): this;
    public change(listener?: EventListener): this;
    public input(listener?: EventListener): this;
    public submit(listener?: EventListener): this;

    public width(value?: string|number): this|number|null;
    public height(value?: string|number): this|number|null;
    public borderBoxWidth(): number|null;
    public borderBoxHeight(): number|null;
    public marginBoxWidth(): number|null;
    public marginBoxHeight(): number|null;
}

export default LightqueryCollection;
