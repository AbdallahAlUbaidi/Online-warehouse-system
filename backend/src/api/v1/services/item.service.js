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

export const findItemByName = async itemName =>
	itemModel.findOne({ name: itemName });