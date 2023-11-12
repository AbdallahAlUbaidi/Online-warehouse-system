export default class ApiError extends Error {
	constructor(message, httpStatusCode) {
		super(message);
		this.httpStatusCode = httpStatusCode;
	}
}