import categoryModel from "../models/category.model.js";

export const createCategory = async (categoryName, user) =>
	categoryModel.create({ name: categoryName, user });

export const findCategoryByNameAndUserId = async (categoryName, userId) =>
	categoryModel.findOne({ user: userId, name: categoryName });

export const findCategoriesByUserId = async (userId, page, categoriesPerPage) =>
	categoryModel
		.find({ user: userId })
		.skip(page - 1 * categoriesPerPage)
		.limit(categoriesPerPage);

export const findCategoriesById = async categoryId =>
	categoryModel.findById(categoryId);