import AbstractStrategy from "./AbstractStrategy";
import {DomElementType} from "../../utils/typedefs";

declare class SingleElementStrategy implements AbstractStrategy{
    public static readonly allowedClasses: Class<any>[];

    public process(selector: string, context: DomElementType | undefined, previousResults: Iterable<DomElementType> | undefined): Iterable<DomElementType>;
    public shouldProcess(selector: string, context: DomElementType | undefined, previousResults: Iterable<DomElementType> | undefined): boolean;
}
