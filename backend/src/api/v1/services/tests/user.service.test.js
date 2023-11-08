import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import {
	createUser
} from "../user.service.js";

import UserModel from "../../models/user.model.js";



describe("Create User service", () => {
	let create;
	beforeEach(() => {
		create = vi.spyOn(UserModel, "create");
	});

	afterEach(() => {
		vi.clearAllMocks();
	});


	it("Should return created user given a username and a password", async () => {
		//Arrange
		const username = "myUsername";
		const password = "myPassword";
		create.mockImplementation(() => ({ _id: "12341" }));

		//Act
		const newUser = await createUser(username, password);

		//Assert
		expect(newUser._id).toBeDefined();

	});

});
