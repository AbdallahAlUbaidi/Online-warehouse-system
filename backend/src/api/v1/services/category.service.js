import categoryModel from "../models/category.model.js";

import AggregationPipeline, {
	parsePipelineResult
} from "../../../helpers/AggregationPipeline.js";

export const createCategory = async (categoryName, user) =>
	categoryModel.create({ name: categoryName, user });

export const findCategoryByNameAndUserId = async (categoryName, userId) =>
	categoryModel.findOne({ user: userId, name: categoryName });

export const findCategoriesByUserId = async (userId, { page, categoriesPerPage, searchQuery }) => {

	const aggregationPipeline =
		new AggregationPipeline()
			.match({ name: searchQuery })
			.matchExact({ user: userId })
			.project(["_id", "name"])
			.paginate(categoriesPerPage, page)
			.getPipeline();

	const aggregationResult = await categoryModel.aggregate(aggregationPipeline);

	const {
		documents: categories,
		documentsCount: categoriesCount,
		totalPages
	} = parsePipelineResult(aggregationResult, categoriesPerPage);

	return {
		categories,
		categoriesCount,
		totalPages
	};
};

export const findCategoryById = async categoryId =>
	categoryModel.findById(categoryId);

export const deleteCategoryById = async categoryId =>
	categoryModel.deleteOne({ _id: categoryId });

export const updateCategoryById = async (categoryId, {
	newName
}) => categoryModel.findOneAndUpdate({
	_id: categoryId
}, {
	name: newName
}, { new: true });