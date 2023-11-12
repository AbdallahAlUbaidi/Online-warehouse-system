import ApiError from "./ApiError"; "./ApiError.js";

export default class InvalidInputError extends ApiError {
	constructor(message) {
		super(message, 400);
	}
}