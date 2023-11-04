import { jest } from "@jest/globals";


import {
	createUser
} from "../user.service.js";


jest.mock("../../models/user.model.js", () => ({
	__esModule: true,
	default: {
		findOne: jest.fn(),
		create: jest.fn(() => ({ _id: "12345" }))
	}
}));


describe("Create User service", () => {

	it("Should return created user given a username and a password", async () => {
		//Arrange
		const username = "myUsername";
		const password = "myPassword";

		//Act
		const newUser = await createUser(username, password);

		//Assert
		expect(newUser._id).toBeDefined();

	});

});
