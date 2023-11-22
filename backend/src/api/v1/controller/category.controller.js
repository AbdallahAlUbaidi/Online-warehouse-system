import ValidationError from "../../../errors/ApiErrors/ValidationError.js";
import {
	createCategory,
	findCategoryByNameAndUserId,
	findCategoriesByUserId
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