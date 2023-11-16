import jwt from "jsonwebtoken";

export const issueToken = async (userId, secret = process.env.AUTH_SECRET) =>
	new Promise((resolve, reject) => {
		jwt.sign({ sub: userId }, secret, {
			algorithm: "HS256",
			expiresIn: "7d"
		}, (err, token) => {
			if (err)
				return reject(err);
			resolve(token);
		});
	});

export const verifyToken = async (token, secret = process.env.AUTH_SECRET) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err)
				return reject(err);
			resolve(decoded);
		});
	});
