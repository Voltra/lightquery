class InvalidArgumentError extends Error{
	constructor(message = "Invalid argument"){
		super(message);
	}
}

export default InvalidArgumentError