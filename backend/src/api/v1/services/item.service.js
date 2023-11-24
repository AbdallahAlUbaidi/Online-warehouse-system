import itemModel from "../models/item.model.js";

import AggregationPipeline, {
	parsePipelineResult
} from "../../../helpers/AggregationPipeline.js";

export const createItem = async ({
	name,
	user,
	price,
	stock,
	category
}) => itemModel.create({
	name,
	user,
	price,
	stock,
	category
});

export const findItemByNameAndUserId = async (itemName, userId) =>
	itemModel.findOne({ name: itemName, user: userId });

export const findItemsByUserId = async (userId, {
	page,
	itemsPerPage,
	minPrice,
	maxPrice,
	name,
	inStock,
	sortBy,
	sortOrder,
	categoryId
}) => {
	const categoryFilter = categoryId ? { category: categoryId } : {};

	const aggregationPipeline =
		new AggregationPipeline()
			.matchExact({ user: userId, ...categoryFilter })
			.matchHigherThanZero("stock", !!inStock)
			.matchRange(minPrice, maxPrice, "price")
			.match({ name })
			.populate("category", "categories")
			.project(["_id", "name", "price", "stock",
				"category._id", "category.name"])
			.sort(sortBy || "name", sortOrder)
			.paginate(itemsPerPage, page)
			.getPipeline();

	const aggregationResult = await itemModel.aggregate(aggregationPipeline);

	const {
		documents: items,
		documentsCount: itemsCount,
		totalPages
	} = parsePipelineResult(aggregationResult, itemsPerPage);

	return {
		items,
		totalPages,
		itemsCount
	};

};

export const findItemById = async itemId =>
	itemModel
		.findById(itemId)
		.populate("category");
