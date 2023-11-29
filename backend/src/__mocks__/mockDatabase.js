import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";


let mongodb;
export const startMockMongoSever = async () => {
	mongodb = await MongoMemoryServer.create();
	const uri = mongodb.getUri();

	mongoose.connect(uri);

};


export const stopMockMongoServer = async () => {
	await mongoose.disconnect();
	await mongodb.stop();
};
