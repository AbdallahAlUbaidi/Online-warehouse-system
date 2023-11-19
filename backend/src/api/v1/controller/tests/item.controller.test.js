import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";



import {
	createItemController
} from "../item.controller.js";

import {
	Request,
	Response
} from "../../../../__mocks__/express.js";

import {
	findItemByNameAndUserId,
	createItem
} from "../../services/item.service.js";
import ValidationError from "../../../../errors/ApiErrors/ValidationError.js";

vi.mock("../../services/item.service.js");



describe("Item controllers", () => {
	describe("Create item controller", () => {

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

		it("Should respond with http status 201 given item name, category, price", async () => {
			//Arrange
			req.body = {
				name: "Logitech Mouse",
				category: "Computer accessories",
				price: 25000,
			};
			createItem.mockImplementation(() => {
				return Promise.resolve({
					_id: "123456",
					name: "Logitech Mouse",
					category: "Computer accessories",
					price: 25000,
					stock: 1,
				});
			});

			//Act
			await createItemController(req, res, next);

			//Assert
			expect(res.statusCode).toBe(201);
		});

		it("Should pass a validation error to next if the item already exists", async () => {
			//Arrange
			req.body = {
				name: "Logitech Mouse",
				category: "Computer accessories",
				price: 25000,
			};
			createItem.mockImplementation(() => {
				return Promise.resolve({
					_id: "123456",
					name: "Logitech Mouse",
					category: "Computer accessories",
					price: 25000,
					stock: 1,
				});
			});
			findItemByNameAndUserId.mockImplementation(() =>
				Promise.resolve({ _id: "12345" }));

			//Act
			await createItemController(req, res, next);

			//Assert
			expect(next).toHaveBeenCalledOnce();
			expect(next.mock.calls[0][0])
				.toBeInstanceOf(ValidationError);

		});
	});
});