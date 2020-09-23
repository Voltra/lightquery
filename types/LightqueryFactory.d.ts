import Callable from "./utils/Callable";
import LightqueryCollection from "./LightqueryCollection";
import {Callback, DomElements, DomElementType, GenericCallback, PluginType, Selector} from "./utils/typedefs";

export type LightqueryFactory_selectCallback = GenericCallback<string, LightqueryCollection>;

export interface LightqueryFactorySelectObject{
    select: LightqueryFactory_selectCallback;
}

export declare class LightqueryFactoryImplDetails {
    public readonly collectionClass: typeof LightqueryCollection;
    public readonly strictMode: boolean;
    public readonly plugins: {
        instance: Set<string>,
        global: Set<string>,
    };

    constructor(self: LightqueryFactory, collectionClass: typeof LightqueryCollection, strictMode: boolean);

    public ifStrict<R>(callback: Callback<R>): void;

    public factory(...args: any[]): LightqueryCollection;

    public emptySelection(): LightqueryCollection;
}

declare const defaultType: PluginType;

declare class LightqueryFactory extends Callable {
    protected readonly __: LightqueryFactoryImplDetails;

    protected __call<R = LightqueryCollection>(selector: Selector, context?: DomElementType, previousResults?: Iterable<DomElementType>): R;

    public constructor(collectionClass: typeof LightqueryCollection, strictMode: boolean);

    public hasPlugin(pluginName: string, pluginType?: PluginType, nameForStrict?: string);
    public registerPlugin(pluginName: string, plugin: Function|any, pluginType?: PluginType);
    public removePlugin(pluginName: string, pluginType?: PluginType);

    public cloneLightquery(): LightqueryFactory;

    public isStrictModeOn(): boolean;
    public setStrictMode(strict: boolean): this;
    public turnStrictModeOn(): this;
    public turnStrictModeOff(): this;
    public doWithoutStrictMode<R>(callback: Callback<R>): this;

    public ready<R>(callback: Callback<R>);
    public resize(listener: EventListener);

    public from(context: DomElementType): LightqueryFactorySelectObject;
    public extend(target: Object, ...objects: Object[]): Object;
    public cssVar(variable: string, value: string|number|undefined): this|string|number|null;
    public create(htmlString: string): LightqueryCollection;
}

export default LightqueryFactory
