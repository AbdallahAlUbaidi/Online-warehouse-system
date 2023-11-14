import { object, z } from "zod";


export const createUserSchema = object({
	body: object({
		username: z
			.string({ required_error: "Username is required" })
			.min(5, "Username must be at least 5 characters long")
			.max(32, "Username must be at most 32 characters long"),
		password: z
			.string({ required_error: "Password is required" })
			.min(8, "Password must be at least 8 characters long"),
		confirmPassword: z
			.string({ required_error: "You need to confirm your password" })
	}).refine(data =>
		data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"]
	}),

});