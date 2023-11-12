import {
	createUser
} from "../services/user.service.js";

import {
	hashPassword
} from "../../../helpers/passwordUtils.js";



export const createUserController = async (req, res, next) => {

	try {
		const { username, password } = req.body;

		const hashedPassword = await hashPassword(password);
		const newUser = await createUser(username, hashedPassword);

		newUser.hashedPassword = undefined;

		res.status(201).json(newUser);

	} catch (err) {
		next(err);
	}
};