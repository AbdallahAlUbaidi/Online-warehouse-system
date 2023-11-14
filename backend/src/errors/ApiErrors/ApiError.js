export default class ApiError extends Error {
	constructor(message, httpStatusCode) {
		super(message);
		this.httpStatusCode = httpStatusCode;
	}

	handle(resObj) {
		resObj
			.status(this.httpStatusCode)
			.json({ message: this.message });
	}
}