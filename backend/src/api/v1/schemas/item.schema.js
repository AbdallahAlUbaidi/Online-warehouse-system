import { object, z } from "zod";


export const createItemSchema = object({
	body: object({
		name: z
			.string({ required_error: "Item name is required" })
			.max(1, "Item name cannot be empty")
			.max(64, "Item name must be at most 64 characters long"),
		category: z
			.string({ required_error: "Item category is required" }),
		price: z
			.number({ required_error: "Item must have a price" })
			.min(0, "Item price cannot be in negative")
	}),
});