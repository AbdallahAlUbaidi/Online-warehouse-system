
import ValidationError from "../../../errors/ApiErrors/ValidationError.js";
import NotFoundError from "../../../errors/ApiErrors/NorFoundError.js";
import ForbiddenAccessError from "../../../errors/ApiErrors/ForbiddenAccessError.js";

import {
	createItem,
	findItemByNameAndUserId,
	findItemsByUserId,
	findItemById
} from "../services/item.service.js";

export const createItemController = async (req, res, next) => {
	const { name, price, category } = req.body;

	try {
		const item = await findItemByNameAndUserId(name, req.user._id,);

		if (item)
			throw new ValidationError([{
				path: ["body", "name"],
				message: "item already exists"
			}]);

		await createItem({
			name,
			price,
			category,
			user: req.user._id,
			stock: req.body.stock || 1
		});
		res.sendStatus(201);

	} catch (err) {
		next(err);
	}
};

export const getItemsController = async (req, res, next) => {
	const {
		page,
		itemsPerPage,
		minPrice,
		maxPrice,
		name,
		inStock,
		sortBy,
		sortOrder
	} = req.query;


	try {
		const { items, totalPages, itemsCount } = await findItemsByUserId(
			req.user._id,
			{
				page: page >= 1 ? page : 1,
				itemsPerPage: itemsPerPage || 30,
				minPrice,
				maxPrice,
				name,
				inStock,
				sortBy,
				sortOrder
			}
		);

		res.status(200).json({
			items,
			itemsCount,
			page: Number(page) || 1,
			totalPages
		});
	} catch (err) {
		next(err);
	}
};

export const getItemController = async (req, res, next) => {
	const { itemId } = req.params;

	try {
		const item = await findItemById(itemId);

		if (!item)
			throw new NotFoundError("Item not found");

		if (String(item.user) !== String(req.user._id))
			throw new ForbiddenAccessError();

		const {
			_id,
			name,
			price,
			stock,
			category
		} = item;


		res.status(200)
			.json({
				item: {
					_id, name, price, stock,
					category: {
						_id: category._id,
						name: category.name
					}
				}
			});

	} catch (err) {
		next(err);
	}
};