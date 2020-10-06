import {DomElementType} from "../../utils/typedefs";

interface AbstractStrategy{
    shouldProcess: (selector: string, context?: DomElementType, previousResults?: Iterable<DomElementType>) => boolean;
    process: (selector: string, context?: DomElementType, previousResults?: Iterable<DomElementType>) => Iterable<DomElementType>;
}

export default AbstractStrategy
