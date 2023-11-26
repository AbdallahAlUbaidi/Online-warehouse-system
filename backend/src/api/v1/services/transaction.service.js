import transactionModel from "../models/transaction.model.js";
import mongoose from "mongoose";
import {
	updateItemStock
} from "./item.service.js";
import AggregationPipeline, {
	parsePipelineResult
} from "../../../helpers/AggregationPipeline.js";


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

export const findTransactionsByUserId = async ({
	userId,
	buyerName,
	paymentType,
	minRemainingPrice,
	maxRemainingPrice,
	page,
	transactionsPerPage,
	sortBy,
	sortOrder
}) => {
	const aggregationPipeline =
		new AggregationPipeline()
			.matchExact({ user: userId })
			.match({ buyerName, "payment.type": paymentType })
			.matchRange(minRemainingPrice, maxRemainingPrice, "payment.details.remainingPrice")
			.populateArrObjects("items", "itemId", "items", "item")
			.projectArrObject("items", ["_id", "name", "price", "quantity"],
				["_id", "buyerName", "payment", "items", "purchaseDate"])
			.sort(sortBy || "buyerName", sortOrder)
			.paginate(transactionsPerPage, page)
			.getPipeline();
	const result = await transactionModel.aggregate(aggregationPipeline);
	const {
		documents: transactions,
		documentsCount: transactionsCount,
		totalPages
	} = parsePipelineResult(result, transactionsPerPage);
	return {
		transactions,
		transactionsCount,
		totalPages
	};
};