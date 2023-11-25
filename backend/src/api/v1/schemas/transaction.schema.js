import { z, object } from "zod";
import mongoose from "mongoose";

export const createTransactionSchema = object({
	body: object({
		buyerName: z
			.string({ required_error: "Must specify the buyer name" })
			.min(5, "Buyer name cannot be shorter than 5 characters")
			.max(64, "Buyer name cannot be longer than 64 characters"),
		payment: object({
			type: z
				.enum(["cash", "debt", "installment"], "Invalid payment type"),
			details: object({
				dueDate: z
					.date()
					.refine(dueDate => dueDate <= Date.now(), "Due date cannot be earlier than now")
					.optional(),
				installmentPeriodInMonths: z
					.number()
					.optional(),
				installmentAmount: z
					.number()
					.optional(),
				upfrontAmount: z
					.number()
					.optional()
			}).optional()
		})
			.refine(({ type, details }) =>
				type === "cash" || !!details, {
				message: "If payment type is not cash more details is required",
				path: ["details"]
			})
			.refine(({ type, details }) =>
				type !== "installment" || !!details?.installmentAmount, {
				message: "If the payment type is installment you need to specify the installment amount",
				path: ["details", "installmentAmount"]
			}),
		items: object({
			itemId: z
				.string({ required_error: "You need to specify the item id" })
				.refine(mongoose.isValidObjectId)
		})
			.array()
			.refine(items => items.length > 0, "You cannot make a transaction with no items")
	})
});