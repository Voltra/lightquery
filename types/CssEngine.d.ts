import {DomElementType} from "./utils/typedefs";


export declare interface AbstractCssEngine{
    findAll(selector: string, context?: DomElementType, previousResults?: Iterable<DomElementType>): Iterable<DomElementType>;
    matchesSelector(selector: string, element: DomElementType): boolean;
    filterMatches(selector: string, elements: Iterable<DomElementType>): Iterable<DomElementType>;
}

export declare class SizzleEngine implements AbstractCssEngine{
    public filterMatches(selector: string, elements: Iterable<DomElementType>): Iterable<DomElementType>;
    public findAll(selector: string, context?: DomElementType, previousResults?: Iterable<DomElementType>): Iterable<DomElementType>;
    public matchesSelector(selector: string, element?: DomElementType): boolean;
}

export declare const cssEngine: SizzleEngine;
