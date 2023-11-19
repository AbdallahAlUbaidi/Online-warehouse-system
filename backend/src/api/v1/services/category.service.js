import categoryModel from "../models/category.model";

export const createCategory = async (categoryName, user) =>
	categoryModel.create({ name: categoryName, user });