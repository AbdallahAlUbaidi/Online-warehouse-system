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