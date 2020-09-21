import {AbstractStrategy} from "./AbstractStrategy";

declare class CssSelectorStrategy implements AbstractStrategy{
    public process(selector: string, context: DomElementType | undefined, previousResults: Iterable<DomElementType> | undefined): Iterable<DomElementType>;
    public shouldProcess(selector: string, context: DomElementType | undefined, previousResults: Iterable<DomElementType> | undefined): boolean;
}

export default CssSelectorStrategy
