import transactionModel from "../models/transaction.model.js";


export const createTransaction = async ({
	buyerName,
	user,
	items,
	payment,
}) => transactionModel.create({
	buyerName,
	user,
	payment,
	items,
});