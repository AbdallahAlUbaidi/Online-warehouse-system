import {
	verifyToken
} from "../helpers/JsonWebToken.js";

import {
	findUserById
} from "../api/v1/services/user.service.js";

import UnauthenticatedError from "../errors/ApiErrors/UnauthenticatedError.js";

export default async (req, res, next) => {
	try {

		const authHeader = req.headers["authorization"];
		const token = authHeader?.split(" ")[1];

		if (!token)
			throw new UnauthenticatedError();
		const decoded = await verifyToken(token);
		const user = await findUserById(decoded.sub);

		req.user = user;
		next();

	} catch (err) {
		if (err.name === "JsonWebTokenError")
			return next(new UnauthenticatedError("Invalid Token"));
		else if (err.name === "TokenExpiredError")
			return next(new UnauthenticatedError("Token Expired"));
		next(err);
	}
};