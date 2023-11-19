import { z, object } from "zod";

export const createCategorySchema = object({
	body: object({
		categoryName: z
			.string({ required_error: "Category name is required" })
			.max(64, "Category name is at most 64 characters long")
			.min(1 , "Category name cannot be empty")
	})
});
