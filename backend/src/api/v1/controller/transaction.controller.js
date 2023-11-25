import {
	createTransaction
} from "../services/transaction.service.js";

import {
	findItemById
} from "../services/item.service.js";
import NotFoundError from "../../../errors/ApiErrors/NorFoundError.js";
import ForbiddenAccessError from "../../../errors/ApiErrors/ForbiddenAccessError.js";
import { MONTH } from "../../../constants/timeConstants.js";


const populateItemsInItemList = async (itemList, findItemById) => {

	const populatedItemsPromises = itemList
		.map(({ itemId, quantity }) =>
			new Promise(resolve =>
				findItemById(itemId)
					.then(item => resolve({ item, quantity }))
			));
	const resultArr = await Promise
		.allSettled(populatedItemsPromises);


	return resultArr
		.map(p => p.value);
};

const checkIfAnyItemIsUnavailable = itemList =>
	itemList.some(({ item }) => !item);

const checkIfAnyItemIsUnaccessible = (itemList, userId) =>
	itemList.some(({ item }) =>
		String(item.user) !== String(userId));

const checkIfThereIsSufficientStockOfItems = itemList => itemList
	.some((({ item: { stock }, quantity }) => quantity > stock));

const getItemsWithInsufficientStock = itemList =>
	itemList
		.filter(({ item: { stock }, quantity }) => quantity > stock)
		.map(({ item: { _id, name, stock, price }, quantity }) => ({
			item: {
				_id,
				name,
				price
			},
			requestedQuantity: quantity,
			availableStock: stock
		}));

const calculateItemsTotalPrice = itemList => itemList
	.reduce((totalPrice, { item: { price }, quantity }) =>
		totalPrice += price * quantity, 0);

const sanitizeItemList = itemList => itemList
	.map(({ item: { _id, name, price, category }, quantity }) => ({
		_id,
		name,
		price,
		category: {
			_id: category._id,
			name: category.name
		},
		quantity
	}));

const paymentObjectConstructor = {
	cash: () => ({ type: "cash", details: {} }),
	installment: ({
		installmentAmount,
		upfrontAmount,
		installmentPeriodInMonths,
		totalPrice }) => {
		installmentPeriodInMonths = installmentPeriodInMonths || 1;
		upfrontAmount = upfrontAmount || installmentAmount;
		return {
			type: "installment",
			details: {
				upfrontAmount,
				installmentPeriodInMonths,
				dueDate: Date.now() + (installmentPeriodInMonths * MONTH),
				remainingPrice: totalPrice - upfrontAmount,
				installmentAmount,
			}
		};
	},
	debt: ({ dueDate, totalPrice }) => ({
		type: "debt",
		details: {
			remainingPrice: totalPrice,
			dueDate
		}
	})
};

export const createTransactionController = async (req, res, next) => {
	const {
		buyerName,
		items,
		payment: {
			type,
			details,
		} } = req.body;

	const userId = req.user._id;
	try {
		const populatedItemList = await populateItemsInItemList(items, findItemById);

		if (checkIfAnyItemIsUnavailable(populatedItemList))
			throw new NotFoundError("One or more item in the item list was not found");

		if (checkIfAnyItemIsUnaccessible(populatedItemList, userId))
			throw new ForbiddenAccessError("You do not have access to one or more item in the item list");

		if (checkIfThereIsSufficientStockOfItems(populatedItemList))
			return res.status(422).json({
				message: "There is not enough stock to complete the transaction",
				itemsWithInsufficientStock:
					getItemsWithInsufficientStock(populatedItemList)
			});

		const totalPrice = calculateItemsTotalPrice(populatedItemList);

		const {
			_id,
			payment,
		} = await createTransaction({
			payment: paymentObjectConstructor[type]({ ...details, totalPrice }),
			buyerName,
			items,
			user: userId,
		});

		res.status(201).json({
			items: sanitizeItemList(populatedItemList),
			_id,
			buyerName,
			totalPrice,
			payment,
		});

	} catch (err) {
		next(err);
	}
};
