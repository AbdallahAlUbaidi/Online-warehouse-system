
import ValidationError from "../../../errors/ApiErrors/ValidationError";

import {
	createItem,
	findItemByName
} from "../services/item.service.js";

export const createItemController = async (req, res, next) => {
	const { name, price, category } = req.body;

	try {
		const item = await findItemByName(name);

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