import dbConnect from "./config/db.js";
import app from "./config/app.js";
import log from "./config/logger.js";

import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production")
	dotenv.config();


const port = process.env.PORT || 3000;

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const dbHost = process.env.DB_HOSTNAME;
const dbName = process.env.DB_NAME;

dbConnect({
	username: dbUsername,
	password: dbPassword,
	hostname: dbHost,
	dbName
})	
	.then(() => app.listen(port, () =>
		log.info(`Api is listening on port : ${port}`)
	));
