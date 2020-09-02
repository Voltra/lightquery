import { cssEngine } from "./CssEngine"
import UnsupportedError from "./errors/UnsupportedError"
import { strategies } from "./strategies/init"

//TODO: Use sequency to allow lazy sequence evaluation

export default class LightqueryCollection{
	static ready(callback){
		return (new this(document)).ready(callback);
	}
	
	constructor(selector, context = undefined, previousResults = []){		
		this.__ = {
			lightquery: this.constructor.lightquery,
			selector,
			previousResults,
		};
		
		const previousResultSet = [...previousResults];
		
		const initStrategy = strategies.find(strategy => strategy.shouldProcess(selector, context, previousResultSet));
		if(initStrategy)
			this.__.elements = initStrategy.process(selector, context, previousResultSet);
		else{
			if(this.__.lightquery.strictMode)
				throw new InvalidArgumentError(`Invalid selector "${selector}"`);
			else
				this.__.elements = previousResultSet;
		}
		
		this[Symbol.iterator] = this.__.elements[Symbol.iterator];
	}
	
	ready(callback){
		if(this.selector === document){
			if(["complete", "interactive"].includes(document.readyState))
				callback.call(document);
			
			if(typeof document.addEventListener == "function"){
				document.addEventListener("DOMContentLoaded", callback, false);
			}else if(typeof window.addEventListener == "function"){
				window.addEventListener("load", callback, false);
			}else if(typeof document.attachEvent == "function"){
				document.attachEvent("onreadystatechange", callback);
			}else if(typeof window.attachEvent == "function"){
				window.attachEvent("onload", callback);
			}else
				throw new UnsupportedError("Cannot attach document ready event handler");
		}
		
		return this;
	}
}