import {
    Callback,
    DomElementType,
    ElementCallback,
    ElementOrLightquery,
    ElementsCallback,
    ElementsOrLightquery,
    GenericCallback,
    LightqueryCollectionCallback,
    PluginType,
} from "./typedefs"

import LightqueryCollection from "../LightqueryCollection"

export declare interface Helpers {
    string: {
        capitalizeFirst: (str: string) => string;
    };

    spacedListString: {
        regex: RegExp;
        replacement: string;
        splitter: string;
        toArray: (str: string) => string[];
    };

    css_variables: {
        regex: {
            no_trailing: RegExp;
            trailing: RegExp;
        };
    };

    functions: {
        valid_name_regex: RegExp;
        valid_firstChar_regex: RegExp;
        invalid_otherChar_regex: RegExp;
        newName: (str: string) => string;
    };

    plugin: {
        isValidPluginType: (str: string) => str is PluginType;
        doForPluginType: <R>(args: { pluginType: string, onGlobal: Callback<R>, onInstance: Callback<R>, onUnknown: Callback<R> }) => R;
    };

    constructorLQ: {
        baseName: string;
        nameRegex: RegExp;
    };

    arrayLike: {
        toArray: <T>(it: Iterable<T> | any) => T[];
    };

    array: {
        isEmpty: <T>(arr: Array<T>) => boolean;
    };

    elements: {
        getElement: (domEl: DomElementType) => Element;
        isElement: (el: any) => el is DomElementType; /*ts won't let me write:   <T>(el: T) => el is DomElementType;*/
        forElements: (args: { elements: ElementsOrLightquery, onElement: ElementCallback, onElements: ElementsCallback, nameForStrict: string, LightqueryCollection: typeof LightqueryCollection }) => void;
        forElement: (args: { element: ElementOrLightquery, onLq: LightqueryCollectionCallback, onElement: ElementCallback, onString: GenericCallback<string>, nameForStrict: string, LightqueryCollection: typeof LightqueryCollection }) => void;
    };
}

declare const helpers: Helpers;
export default helpers;
