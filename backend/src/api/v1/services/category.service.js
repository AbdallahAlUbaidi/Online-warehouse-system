import categoryModel from "../models/category.model";

export const createCategory = async (categoryName, user) =>
	categoryModel.create({ name: categoryName, user });

export const findCategoryByName = async (categoryName, user) =>
	categoryModel.findOne({ user, name: categoryName });