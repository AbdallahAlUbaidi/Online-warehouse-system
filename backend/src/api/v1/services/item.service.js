import itemModel from "../models/item.model.js";

export const createItem = ({
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

export const findItemByName = itemName =>
	itemModel.findOne({ name: itemName });