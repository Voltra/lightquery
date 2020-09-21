import AbstractStrategy from "./AbstractStrategy";
import {DomElementType} from "../../utils/typedefs";

declare class IterableStrategy implements AbstractStrategy{
    public static readonly allowedClasses: Class<any>[];
    public readonly allowedClasses: Class<any>[];
    public readonly allowedItemClasses: Class<any>[];

    public process(selector: string, context: DomElementType | undefined, previousResults: Iterable<DomElementType> | undefined): Iterable<DomElementType>;
    public shouldProcess(selector: string, context: DomElementType | undefined, previousResults: Iterable<DomElementType> | undefined): boolean;
}
