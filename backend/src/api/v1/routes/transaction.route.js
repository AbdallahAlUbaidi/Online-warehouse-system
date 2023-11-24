import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate";
import validateResource from "../../../middleware/validateResource";

import {
	createTransactionSchema
} from "../schemas/transaction.schema.js";

import {
	createTransactionController
} from "../controller/transaction.controller.js";


router.post("/",
	authenticate,
	validateResource(createTransactionSchema),
	createTransactionController
);

export default router;