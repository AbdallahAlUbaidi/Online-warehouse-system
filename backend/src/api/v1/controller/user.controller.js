import {
	createUser,
	findUserByName
} from "../services/user.service.js";

import {
	hashPassword
} from "../../../helpers/passwordUtils.js";

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
		const newUser = await createUser(username, hashedPassword);

		newUser.hashedPassword = undefined;

		res.status(201).json(newUser);

	} catch (err) {
		next(err);
	}
};