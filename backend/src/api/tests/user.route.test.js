import { describe, it, beforeAll, afterAll, afterEach, expect } from "vitest";
import {
	startMockMongoSever,
	stopMockMongoServer
} from "./mockDatabase.js";

import supertest from "supertest";

import app from "../../config/app.js";
import mongoose from "mongoose";
import { createUser } from "../v1/services/user.service.js";

const request = supertest(app);

describe("Auth routes", () => {

	beforeAll(() => startMockMongoSever());

	afterAll(() => stopMockMongoServer());

	afterEach(() => mongoose.connection.dropDatabase());

	describe("Create user route", () => {

		let route = "/api/v1/auth/signup";

		it(`Should respond with 201 status code 
		given a valid username,password and matching password confirmation
		when no user with similar name exists`, async () => {
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

		it(`Should respond with 400 status and a "Username already exists" message
		when attempting to create user with already existing username`, async () => {
			//Arrange
			const username = "Abdullah";
			const password = "123123AaBb";
			const confirmPassword = "123123AaBb";
			createUser("Abdullah", "$2b$10$8hT3e3EBwJ1lX9mjouaLuu4D7kQYfwskCUZWXV3JlUkikNEF/cxxy");

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

		it(`Should respond with 400 status code and a 
		"Username must be at least 5 characters long" message
		if the username is too short` , async () => {
			//Arrange
			const username = "abdu";
			const password = "123123AaBb";
			const confirmPassword = "123123AaBb";

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
					"message": "Username must be at least 5 characters long"
				}]
			});
		});

		it(`Should respond with 400 status code and a 
		"Username must be at most 32 characters long" message
		if the username is too long` , async () => {
			//Arrange
			const username = "Lorem ipsum dolor sit amet orci aliquam.";
			const password = "123123AaBb";
			const confirmPassword = "123123AaBb";

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
					"message": "Username must be at most 32 characters long"
				}]
			});
		});

		it(`Should respond with 400 status code and a 
		"Username is required" message
		if no username is included` , async () => {
			//Arrange
			const password = "123123AaBb";
			const confirmPassword = "123123AaBb";

			//Act
			const response = await request
				.post(route)
				.send({ password, confirmPassword });

			//Assert
			expect(response.status).toBe(400);
			expect(response.body).toStrictEqual({
				message: "Invalid Input",
				issues: [{
					path: [
						"body",
						"username"
					],
					message: "Username is required"
				}]
			});
		});

		it(`Should respond with 400 status code and a 
		"Password is required" message if no password is included` , async () => {
			//Arrange
			const username = "Abdullah";
			const confirmPassword = "123456789";

			//Act
			const response = await request
				.post(route)
				.send({ username, confirmPassword });

			//Assert
			expect(response.status).toBe(400);
			expect(response.body).toStrictEqual({
				message: "Invalid Input",
				issues: [{
					message: "Password is required",
					path: ["body", "password"]
				}]
			});
		});

		it(`Should respond with 400 status code and a
		"Password must be at least 8 characters long" message
		if password is too short` , async () => {
			//Arrange
			const username = "Abdullah";
			const password = "123456";
			const confirmPassword = "123456";

			///Act
			const response = await request
				.post(route)
				.send({ username, password, confirmPassword });

			//Assert
			expect(response.status).toBe(400);
			expect(response.body).toStrictEqual({
				message: "Invalid Input",
				issues: [{
					message: "Password must be at least 8 characters long",
					path: ["body", "password"]
				}]
			});
		});

		it(`Should respond with 400 status code and a
		"You need to confirm your password" message
		if no confirmPassword is included`, async () => {
			//Arrange
			const username = "Abdullah";
			const password = "123456AaBb";

			//Act
			const response = await request
				.post(route)
				.send({ username, password });

			//Assert
			expect(response.status).toBe(400);
			expect(response.body).toStrictEqual({
				message: "Invalid Input",
				issues: [{
					message: "You need to confirm your password",
					path: ["body", "confirmPassword"]
				}]
			});
		});

		it(`Should respond with 400 status code and a
		"Passwords do no match" message
		if password and confirm password does no match` , async () => {
			//Arrange
			const username = "Abdullah";
			const password = "123123AaBb";
			const confirmPassword = "123123Aabb";

			//Act
			const response = await request
				.post(route)
				.send({ username, password, confirmPassword });

			//Assert
			expect(response.status).toBe(400);
			expect(response.body).toStrictEqual({
				message: "Invalid Input",
				issues: [{
					message: "Passwords do not match",
					path: ["body", "confirmPassword"]
				}]
			});
		});

	});
});