import AbstractStrategy from "./AbstractStrategy"

export default class SingleElementStrategy extends AbstractStrategy{
	static get allowedClasses(){
		return [
			Element,
			Document,
			DocumentFragment,
			ShadowRoot,
			Window,
		];
	}
	
	constructor(){
		this.allowedClasses = SingleElementStrategy.allowedClasses;
	}
	
	shouldProcess(selector, context = undefined, previousResults = []){
		return selector && this.allowedClasses.some(clazz => selector instanceof clazz);
	}
	
	process(selector, context = undefined, previousResults = []){
		return [...previousResults, selector];
	}
}