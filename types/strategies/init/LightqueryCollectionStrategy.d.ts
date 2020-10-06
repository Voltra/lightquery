import AbstractStrategy from "./AbstractStrategy";
import {DomElementType} from "../../utils/typedefs";

declare class LightqueryCollectionStrategy implements AbstractStrategy{
    public process(selector: string, context: DomElementType | undefined, previousResults: Iterable<DomElementType> | undefined): Iterable<DomElementType>;
    public shouldProcess(selector: string, context: DomElementType | undefined, previousResults: Iterable<DomElementType> | undefined): boolean;
}

export default LightqueryCollectionStrategy
