import {
	createUser,
	findUserByName
} from "../services/user.service.js";

import {
	hashPassword,
	comparePassword
} from "../../../helpers/passwordUtils.js";

import {
	issueToken
} from "../../../helpers/JsonWebToken.js";

import ValidationError from "../../../errors/ApiErrors/ValidationError.js";



export const createUserController = async (req, res, next) => {

	try {
		const { username, password } = req.body;

		const user = await findUserByName(username);

		if (user)
			throw new ValidationError([{
				path: ["body", "username"],
				message: "Username already exists"
			}]);


		const hashedPassword = await hashPassword(password);
		await createUser(username, hashedPassword);

		res.sendStatus(201);

	} catch (err) {

		next(err);
	}
};


export const authenticateUser = async (req, res, next) => {
	const { username, password } = req.body;

	try {

		const user = await findUserByName(username);
		const isPassCorrect = await comparePassword(
			password,
			user?.hashedPassword || "");

		if (!user || !isPassCorrect)
			return res
				.status(400)
				.json({ message: "Invalid credentials" });

		const token = await issueToken(user.id);

		res.status(200).json({token});
	} catch (err) {
		next(err);
	}
};