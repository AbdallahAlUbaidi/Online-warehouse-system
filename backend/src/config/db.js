import mongoose from "mongoose";
import log from "./logger.js";


export default async ({ username, password, hostname = "db", dbName = "", port = 27017 }) => {

	const connectionUrl = (!username || !password)
		? `mongodb://${hostname}:${port}/${dbName}?authSource=admin`
		: `mongodb://${username}:${password}@${hostname}:${port}/${dbName}?authSource=admin`;


	return mongoose
		.connect(connectionUrl)
		.then(() => log.info(`Connected to ${dbName}@${hostname}:${port} database as ${username || "anonymous"}`))
		.catch(err =>
			log.error(`An error occurred while connecting to the database - ${err.message}`)
		);
};