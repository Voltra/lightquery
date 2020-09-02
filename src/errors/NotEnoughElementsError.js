export default class NotEnoughElementsError extends Error{
	constructor(message = "Not enough elements"){
		super(message);
	}
}