import Callable from "./utils/Callable"
import LightqueryCollection from "./LightqueryCollection"
import InvalidArgumentError from "./errors/InvalidArgumentError"

export default class LightqueryFactory extends Callable{
	
	//TODO: Check if there is a need for constructor stuff
	constructor(collectionClass = LightqueryCollection, strictMode = true){
		collectionClass.lightquery = this;
		
		this.__ = {
			factory: (...args) => new collectionClass(...args),
			collectionClass,
			emptySelection(){
				return this.factory("");
			},
		};
		
		this.strictMode = strictMode;
	}
	
	__call(selector){
		switch(typeof selector){
			case "function":
				return this.ready(selector);
				
			case "string":
				return this.__.factory(selector);
				
			default:
				break;
		}
		
		try{
			return this.__.factory(selector);
		}catch(e){
			if(this.strictMode)
				throw e;
			else
				return this.__.emptySelection();
		}
	}
	
	
	ready(callback){
		return this(document).ready(callback);
	}
}