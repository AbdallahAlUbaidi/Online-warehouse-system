import ValidationError from "../../../errors/ApiErrors/ValidationError.js";
import NotFoundError from "../../../errors/ApiErrors/NorFoundError.js";
import ForbiddenAccessError from "../../../errors/ApiErrors/ForbiddenAccessError.js";

import {
	createCategory,
	findCategoryByNameAndUserId,
	findCategoriesByUserId,
	findCategoryById
} from "../services/category.service.js";

export const createCategoryController = async (req, res, next) => {
	const { categoryName } = req.body;

	try {
		const category = await findCategoryByNameAndUserId(categoryName, req.user._id);

		if (category)
			throw new ValidationError([{
				path: ["body", "categoryName"],
				message: "Category already exists"
			}]);

		await createCategory(categoryName, req.user._id);

		res.sendStatus(201);

	} catch (err) {
		next(err);
	}
};

export const getCategoriesController = async (req, res, next) => {
	const {
		page,
		categoriesPerPage,
		searchQuery
	} = req.query;

	try {
		const { categories,
			categoriesCount,
			totalPages
		} = await findCategoriesByUserId(
			req.user._id,
			{
				page: page >= 1 ? page : 1,
				categoriesPerPage: categoriesPerPage || 15,
				searchQuery
			}
		);

		res.status(200).json({
			categories,
			categoriesCount,
			page: Number(page) || 1,
			totalPages
		});
	} catch (err) {
		next(err);
	}

};

export const getCategoryController = async (req, res, next) => {
	const { categoryId } = req.params;

	try {
		const category = await findCategoryById(categoryId);

		if (!category)
			throw new NotFoundError("Category not found");

		if (String(category.user) !== String(req.user._id))
			throw new ForbiddenAccessError();

		const {
			_id,
			name
		} = category;

		res.status(200)
			.json({
				category: { _id, name }
			});

	} catch (err) {
		next(err);
	}
};