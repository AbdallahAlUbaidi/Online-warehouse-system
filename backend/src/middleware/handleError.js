import ApiError from "../errors/ApiErrors/ApiError.js";

export default (err, req, res, next) => {
	if (err instanceof ApiError)
		err.handle(res);
	next();
};