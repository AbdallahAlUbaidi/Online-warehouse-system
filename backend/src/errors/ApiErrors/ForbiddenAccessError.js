import ApiError from "./ApiError.js";

export default class ForbiddenAccessError extends ApiError {
	constructor(message = "You are forbidden from accessing this resource") {
		super(message, 403);
	}

	handle(resObj) {
		resObj
			.status(this.httpStatusCode)
			.json({ message: this.message });
	}
}