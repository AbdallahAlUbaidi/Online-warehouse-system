import UserModel from "../models/user.model.js";

export const createUser = async (username, hashedPassword) => {
	return UserModel.create({
		username,
		hashedPassword
	});
};