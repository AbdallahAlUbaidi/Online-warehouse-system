import { describe, it, beforeAll, afterAll, afterEach, expect } from "vitest";
import {
	startMockMongoSever,
	stopMockMongoServer
} from "../../../../__mocks__/mockDatabase.js";

import supertest from "supertest";

import app from "../../../../config/app.js";
import mongoose from "mongoose";
import { createUser } from "../../services/user.service.js";

const request = supertest(app);


describe("Auth Routes", () => {

	beforeAll(() => startMockMongoSever());

	afterAll(() => stopMockMongoServer());

	afterEach(() => mongoose.connection.dropDatabase());

	describe("Create user route", () => {

		let route = "/api/v1/auth/signup";

		describe("Given a valid username,password and matching password confirmation when no user with similar name exists", () => {

			it("Should respond with 201 status code ", async () => {
				//Arrange
				const username = "Abdullah";
				const password = "123123AaBb";
				const confirmPassword = "123123AaBb";

				//Act
				const response = await request
					.post(route)
					.send({ username, password, confirmPassword });

				//Assert
				expect(response.status).toBe(201);
			});

		});

		describe("Given a username that already exists", () => {

			it("Should respond with 400 status and a \"Username already exists\" message", async () => {
				//Arrange
				const username = "Abdullah";
				const password = "123123AaBb";
				const confirmPassword = "123123AaBb";
				const passwordHash = "$2b$10$8hT3e3EBwJ1lX9mjouaLuu4D7kQYfwskCUZWXV3JlUkikNEF/cxxy";
				createUser("Abdullah", passwordHash);

				//Act
				const response = await request
					.post(route)
					.send({ username, password, confirmPassword });

				//Assert
				expect(response.status).toBe(400);
				expect(response.body).toStrictEqual({
					message: "Invalid Input",
					issues: [{
						path: [
							"body",
							"username"
						],
						"message": "Username already exists"
					}]
				});
			});

		});
	});
});