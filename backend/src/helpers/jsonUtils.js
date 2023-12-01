import crypto from "node:crypto";

export const generateHashedIdentifier = async data => {
	const serializedData = JSON.stringify(data);
	return crypto
		.createHash("sha256")
		.update(serializedData)
		.digest("hex");
};