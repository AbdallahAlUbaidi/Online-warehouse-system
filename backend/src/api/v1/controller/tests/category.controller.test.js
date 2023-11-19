import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";



import {
	createCategoryController
} from "../category.controller.js";

import {
	Request,
	Response
} from "../../../../__mocks__/express.js";

import {
	findCategoryByNameAndUserId,
	createCategory
} from "../../services/category.service.js";
import ValidationError from "../../../../errors/ApiErrors/ValidationError.js";

vi.mock("../../services/category.service.js");



describe("Category controllers", () => {
	describe("Create category controller", () => {

		let req, res, next;

		beforeEach(() => {
			req = new Request();
			res = new Response();
			next = vi.fn();

			req.user = {
				_id: "12345",
				username: "Abdullah"
			};
		});

		afterEach(() => {
			vi.clearAllMocks();
		});

		it("Should respond with http status 201 given category name", async () => {
			//Arrange
			req.body = {
				name: "Computer accessories",
			};
			createCategory.mockImplementation(() => {
				return Promise.resolve({
					_id: "1234567",
					name: "Computer accessories",
					user: "12345"
				});
			});

			//Act
			await createCategoryController(req, res, next);

			//Assert
			expect(res.statusCode).toBe(201);
		});

		it("Should pass a validation error to next if the category already exists", async () => {
			//Arrange
			req.body = {
				name: "Computer accessories",
			};
			createCategory.mockImplementation(() => {
				return Promise.resolve({
					_id: "1234567",
					name: "Computer accessories",
					user: "12345"
				});
			});
			findCategoryByNameAndUserId.mockImplementation(() =>
				Promise.resolve({ _id: "12345" }));

			//Act
			await createCategoryController(req, res, next);

			//Assert
			expect(next).toHaveBeenCalledOnce();
			expect(next.mock.calls[0][0])
				.toBeInstanceOf(ValidationError);

		});
	});
});