export default class UnimplementedError extends Error{
	/**
	 * @param {string} [message = "Unimplemented method"] The error message
	 */
	constructor(message = "Unimplemented method"){
		super(message);
	}
}