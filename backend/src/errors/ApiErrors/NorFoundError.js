import ApiError from "./ApiError.js";

export default class NotFoundError extends ApiError {
	constructor(message = "Resource not found") {
		super(message, 404);
	}

	handle(resObj) {
		resObj
			.status(this.httpStatusCode)
			.json({ message: this.message });
	}
}