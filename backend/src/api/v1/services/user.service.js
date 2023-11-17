import UserModel from "../models/user.model.js";

export const createUser = async (username, hashedPassword) => {
	return UserModel.create({
		username,
		hashedPassword
	});
};

export const findUserByName = async username =>
	UserModel.findOne({ username });

export const findUserById = async userId =>
	UserModel.findById(userId);