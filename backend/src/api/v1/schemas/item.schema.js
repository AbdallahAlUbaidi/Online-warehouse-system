import { object, z } from "zod";
import mongoose from "mongoose";


export const createItemSchema = object({
	body: object({
		name: z
			.string({ required_error: "Item name is required" })
			.min(1, "Item name cannot be empty")
			.max(64, "Item name must be at most 64 characters long"),
		category: z
			.string({ required_error: "Item category is required" }),
		price: z
			.number({ required_error: "Item must have a price" })
			.min(0, "Item price cannot be in negative")
	}),
});

export const getItemSchema = object({
	params: object({
		itemId: z
			.string({ required_error: "Must specify item id" })
			.refine(mongoose.isValidObjectId, "The Id provided is invalid")
	})
});