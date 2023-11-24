import { z, object } from "zod";

export const createTransactionSchema = object({
	body: object({
		buyerName: z
			.string({ required_error: "Must specify the buyer name" })
			.min(5, "Buyer name cannot be shorter than 5 characters")
			.max(64, "Buyer name cannot be longer than 64 characters"),
		payment: object({
			type: z
				.string({ required_error: "Must specify the payment type" })
				.enum(["cash", "debt", "installment"], "Invalid payment type"),
			details: object({
				remainingPrice: z
					.number({ required_error: "You must include the remaining price" }),
				dueDate: z
					.date({ required_error: "Must include the due date for payment" })
					.refine(dueDate => dueDate <= Date.now(), "Due date cannot be earlier than now"),
				installmentPeriodInMonths: z
					.number()
					.optional(),
				installmentAmount: z
					.number()
					.optional(),
				upfrontAmount: z
					.number()
					.optional()
			})
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
			})
	})
});