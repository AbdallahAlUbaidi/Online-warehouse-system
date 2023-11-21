import categoryModel from "../models/category.model.js";

export const createCategory = async (categoryName, user) =>
	categoryModel.create({ name: categoryName, user });

export const findCategoryByNameAndUserId = async (categoryName, userId) =>
	categoryModel.findOne({ user: userId, name: categoryName });

export const findCategoriesByUserId = async (userId, page, categoriesPerPage, searchQuery) => {
	const aggregationPipeline = [
		{
			$match: {
				user: userId,
				name: { $regex: new RegExp(searchQuery, "i") }
			}
		},
		{ $project: { _id: true, name: true } },
		{
			$facet: {
				categories: [
					{ $skip: (page - 1) * categoriesPerPage },
					{ $limit: Number(categoriesPerPage) }
				],
				totalCount: [{ $count: "categoriesCount" }]
			}
		}
	];

	const result = await categoryModel.aggregate(aggregationPipeline);

	const { categories } = result[0];
	const categoriesCount = result[0]
		.totalCount[0]?.categoriesCount || 0;

	const totalPages = Math.ceil(categoriesCount / categoriesPerPage);

	return {
		categories,
		categoriesCount,
		totalPages
	};
};
export const findCategoriesById = async categoryId =>
	categoryModel.findById(categoryId);