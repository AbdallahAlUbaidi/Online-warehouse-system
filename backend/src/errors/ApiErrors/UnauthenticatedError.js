import ApiError from "./ApiError.js";

export default class UnauthenticatedError extends ApiError {
	constructor(message = "Unauthenticated") {
		super(message, 401);
	}

	handle(resObj) {
		resObj
			.status(this.httpStatusCode)
			.json({ message: this.message });
	}

}