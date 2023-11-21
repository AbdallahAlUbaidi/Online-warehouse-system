import itemModel from "../models/item.model.js";

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

export const findItemsByUserId = async (userId, page, itemsPerPage, {
	minPrice,
	maxPrice,
	name,
	inStock,
	sort_by,
	sort_order
}) => {

	const aggregationPipeline = [
		{
			$match: {
				user: userId,
				price: {
					$gte: parseFloat(minPrice) || 0,
					$lte: parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER
				},
				name: { $regex: new RegExp(name || "", "i") },
				stock: !!inStock ? { $gt: 0 } : { $gte: 0 }
			}
		},
		{
			$lookup: {
				from: "categories",
				localField: "category",
				foreignField: "_id",
				as: "category"
			}
		},
		{ $unwind: "$category" },
		{
			$project: {
				_id: true,
				name: true,
				category: {
					_id: true,
					name: true
				}
				, price: true,
				stock: true
			}
		},

		{
			$sort: {
				[sort_by]: sort_order === "desc" ? -1 : 1
			}
		},

		{
			$facet: {
				items: [
					{ $skip: (page - 1) * itemsPerPage },
					{ $limit: Number(itemsPerPage) },
				],
				totalCount: [{ $count: "itemsCount" }],
			}
		}
	];

	const result = await itemModel.aggregate(aggregationPipeline);
	const { items } = result[0];
	const itemsCount = result[0]
		.totalCount[0]?.itemsCount || 0;

	const totalPages = Math.ceil(itemsCount / itemsPerPage);

	return {
		items,
		totalPages,
		itemsCount
	};

};