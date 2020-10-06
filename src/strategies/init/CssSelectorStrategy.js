import AbstractStrategy from "./AbstractStrategy"
import { cssEngine } from "../../CssEngine"

export default class CssSelectorStrategy extends AbstractStrategy{
	shouldProcess(selector, context = undefined, previousResults = []){
		return typeof selector === "string";
	}
	
	process(selector, context = undefined, previousResults = []){
		return cssEngine.findAll(selector, context, previousResults);
	}
}