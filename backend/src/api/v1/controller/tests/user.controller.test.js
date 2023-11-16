import { vi, beforeEach, afterEach, describe, it, expect } from "vitest";



import {
	createUserController
} from "../user.controller.js";

import {
	Request,
	Response
} from "../../../../__mocks__/express.js";

import {
	createUser,
	findUserByName
} from "../../services/user.service.js";
import ValidationError from "../../../../errors/ApiErrors/ValidationError.js";

vi.mock("../../services/user.service.js");



describe("User controllers", () => {
	describe("Create user controller", () => {

		let req, res, next;

		beforeEach(() => {
			req = new Request();
			res = new Response();
			next = vi.fn();
		});

		afterEach(() => {
			vi.clearAllMocks();
		});

		it("Should respond with http status 201 given username and password", async () => {
			//Arrange
			req.body = {
				username: "myUsername",
				password: "myPassword"
			};
			createUser.mockImplementation(() => {
				return Promise.resolve({ _id: "12345", username: "myUsername" });
			});

			//Act
			await createUserController(req, res, next);

			//Assert
			expect(res.statusCode).toBe(201);
		});

		it("Should not contain the hashed password with the new user object passed in the response", async () => {
			//Arrange
			req.body = {
				username: "myUsername",
				password: "myPassword"
			};
			createUser.mockImplementation(() => ({
				_id: "12345",
				username: "myUsername",
				hashedPassword: "$hash$myPassword"
			}));

			//Act
			await createUserController(req, res, next);

			//Assert
			expect(res.body.hashedPassword).not.toBeDefined();
		});

		it("Should pass a validation error to next if the username already exists", async () => {
			//Arrange
			req.body = {
				username: "myUsername",
				password: "myPassword"
			};
			createUser.mockImplementation(() => ({
				_id: "12345",
				username: "myUsername",
				hashedPassword: "$hash$myPassword"
			}));
			findUserByName.mockImplementation(() =>
				Promise.resolve({ _id: "12345" }));

			//Act
			await createUserController(req, res, next);

			//Assert
			expect(next).toHaveBeenCalledOnce();
			expect(next.mock.calls[0][0])
				.toBeInstanceOf(ValidationError);

		});
	});
});