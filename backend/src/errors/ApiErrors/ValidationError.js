import ApiError from "./ApiError"; "./ApiError.js";

export default class ValidationError extends ApiError {
	constructor(issues) {
		super("Invalid Input", 400);
		this.issues = issues;
	}

	handle(resObj) {
		resObj
			.status(this.httpStatusCode)
			.json({
				message: this.message,
				issues: this.issues
			});
	}
}