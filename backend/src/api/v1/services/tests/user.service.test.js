import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

import {
	createUser,
	findUserByName
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

describe("Find user by name service", () => {
	let findOne;

	beforeEach(() => {
		findOne = vi.spyOn(UserModel, "findOne");
	});

	afterEach(() => vi.clearAllMocks());

	it("Should return the user with the given username if it exists", async () => {
		//Arrange
		const username = "myUsername";
		findOne.mockImplementation(() => Promise.resolve({
			_id: "12345",
			username: "myUsername"
		}));

		//Act
		const user = await findUserByName(username);

		//Assert
		expect(user._id).toBeDefined();
		expect(user.username).toBe("myUsername");
	});

	it("Should return null if no user is with given username is found", async () => {
		//Arrange
		const username = "user";
		findOne.mockImplementation(() => Promise.resolve(null));

		//Act
		const user = await findUserByName(username);

		//Assert
		expect(user).toBeNull();
	});
});
