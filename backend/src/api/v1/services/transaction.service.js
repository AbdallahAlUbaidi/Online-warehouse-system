import transactionModel from "../models/transaction.model.js";
import mongoose from "mongoose";
import {
	updateItemStock
} from "./item.service.js";


export const createTransaction = async ({
	buyerName,
	user,
	items,
	payment,
}) => {
	const session = await mongoose.startSession();

	try {
		let transactionObj;
		await session.withTransaction(async () => {

			const updateStockPromises = items
				.map(({ itemId, quantity }) =>
					updateItemStock(itemId, quantity));

			const transactionPromise = transactionModel.create({
				buyerName,
				user,
				payment,
				items,
			});

			const result = await Promise.all([transactionPromise, ...updateStockPromises]);
			transactionObj = result[0];
		});

		return transactionObj;

	} finally {
		session.endSession();
	}
};