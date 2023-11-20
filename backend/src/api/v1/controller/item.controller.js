
import ValidationError from "../../../errors/ApiErrors/ValidationError.js";

import {
	createItem,
	findItemByNameAndUserId,
	findItemsByUserId
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
	const { page, item_per_page } = req.query;

	try {
		const { items, totalPages, itemsCount } = await findItemsByUserId(
			req.user._id,
			page >= 1 ? page : 1,
			item_per_page || 30
		);

		res.status(200).json({
			items,
			itemsCount,
			page: Number(page),
			totalPages
		});
	} catch (err) {
		next(err);
	}
};