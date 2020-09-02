import CssSelectorStrategy from "./CssSelectorStrategy"
import SingleElementStrategy from "./SingleElementStrategy"
import IterableStrategy from "./IterableStrategy"

export const strategies = [
	new CssSelectorStrategy(),
	new SingleElementStrategy(),
	new IterableStrategy(),
];