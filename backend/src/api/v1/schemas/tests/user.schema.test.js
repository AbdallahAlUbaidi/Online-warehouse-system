import { describe, expect, it } from "vitest";

import {
	authenticateUserSchema,
	createUserSchema
} from "../user.schema.js";


describe("User Schema", () => {
	describe("Create User Schema", () => {
		describe("Given a valid username,password and matching password confirmation", () => {

			it("Should not throw any errors", async () => {
				//Arrange
				const payload = {
					body: {
						username: "Abdullah",
						password: "123123AaBb",
						confirmPassword: "123123AaBb"
					},
				};

				//Act
				expect(() => createUserSchema.parse(payload))
					//Assert
					.not.throw();
			});

		});

		describe("given a payload with no username", () => {
			it("Should throw a Zod Error with message \"Username is required\" and path [\"body\",\"username\"]", async () => {
				//Arrange
				const payload = {
					body: {
						password: "123123AaBb",
						confirmPassword: "123123AaBb"
					},
				};

				//Act
				expect(() =>
					createUserSchema.parse(payload))

					//Assert
					.toThrowError(new RegExp("Username is required"));
			});

		});

		describe("Given a username that is less than 5 characters long", () => {

			it("Should throw a Zod Error with message \"Username must be at least 5 characters long\"", async () => {
				//Arrange
				const payload = {
					body: {
						username: "a",
						password: "123123123AaBb",
						confirmPassword: "123123123AaBb"
					}
				};

				//Act
				expect(() =>
					createUserSchema.parse(payload))

					//Assert
					.toThrowError(new RegExp("Username must be at least 5 characters long"));

			});

		});

		describe("Given a username that is longer than 32 characters", () => {

			it("Should throw a Zod Error with message \"Username must be at most 32 characters long\"", async () => {
				//Arrange
				const payload = {
					body: {
						username: "12142hdh12u8asdhas213njadskasfasfasd",
						password: "123123AbBa",
						confirmPassword: "123123AbBa"
					}
				};
				//Act
				expect(() => createUserSchema.parse(payload))

					//Assert
					.toThrow(new RegExp("Username must be at most 32 characters long"));
			});

		});

		describe("Given a payload with no password", () => {

			it("Should throw a Zod Error with message \"Password is required\"", async () => {
				//Arrange
				const payload = {
					body: {
						username: "Abdullah"
					}
				};
				//Act
				expect(() => createUserSchema.parse(payload))

					//Assert
					.toThrow(new RegExp("Password is required"));
			});

		});

		describe("Given a password that is less than 8 characters long", () => {

			it("Should throw a Zod Error with message \"Password must be at least 8 characters long\"", async () => {
				//Arrange
				const payload = {
					body: {
						username: "Abdullah",
						password: "123123",
						confirmPassword: "123123"
					}
				};

				//Act
				expect(() => createUserSchema.parse(payload))

					//Assert
					.toThrow(new RegExp("Password must be at least 8 characters long"));
			});

		});

		describe("Given a payload with no password confirmation", () => {

			it("Should throw a Zod Error with message \"You need to confirm your password\"", async () => {
				//Arrange
				const payload = {
					body: {
						username: "Abdullah",
						password: "123123AaBb"
					}
				};
				//Act
				expect(() => createUserSchema.parse(payload))

					//Assert
					.toThrow(new RegExp("You need to confirm your password"));
			});

		});

		describe("Given a payload where the password and the confirmation do no match", () => {

			it("Should throw a Zod Error with message \"Passwords do not match", async () => {
				//Arrange
				const payload = {
					body: {
						username: "Abdullah",
						password: "123456ABC",
						confirmPassword: "123456AbC"
					}
				};

				//Act
				expect(() => createUserSchema.parse(payload))

					//Assert
					.toThrow(new RegExp("Passwords do not match"));
			});

		});
	});

	describe("Authenticate User Schema", () => {
		describe("Given a valid username,password", () => {
			it("Should not throw an error", async () => {
				//Arrange
				const payload = {
					body: {
						username: "Abdullah",
						password: "123123AaBb"
					}
				};

				//Act
				expect(() => authenticateUserSchema.parse(payload))

					//Assert
					.to.not.throw();
			});

		});

		describe("Given a payload without a username", () => {

			it("Should throw a Zod Error with a message \"Please enter you username\"", async () => {
				//Arrange
				const payload = {
					body: {
						password: "123123"
					}
				};

				//Act
				expect(() => authenticateUserSchema.parse(payload))

					//Assert
					.toThrow(new RegExp("Please enter you username"));
			});

		});

		describe("Given a payload without a password", () => {

			it("Should throw a Zod Error with a message \"please enter you password\"", async () => {
				//Arrange
				const payload = {
					body: {
						username: "Abdullah"
					}
				};

				//Act
				expect(() => authenticateUserSchema.parse(payload))

					//Assert
					.toThrow(new RegExp("please enter you password"));
			});

		});
	});
});
