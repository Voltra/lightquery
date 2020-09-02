export default class UnsupportedError extends Error{
	constructor(message = ""){
		super(message);
	}
}