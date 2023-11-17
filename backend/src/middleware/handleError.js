import ApiError from "../errors/ApiErrors/ApiError.js";
import logger from "../config/logger.js";

export default (err, req, res, next) => {
	if (err instanceof ApiError) {
		err.handle(res);
		return next();
	}
	res.sendStatus(500);
	logger.error(err.message);
};