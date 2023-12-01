import ApiError from "./ApiError.js";

export default class ConflictingRequestError extends ApiError {
	constructor(message = "The request conflicts with the server state") {
		super(message, 409);
	}

	handle(resObj) {
		resObj
			.status(this.httpStatusCode)
			.json({ message: this.message });
	}

}