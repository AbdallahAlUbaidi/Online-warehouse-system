import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate.js";
import validateResource from "../../../middleware/validateResource.js";

import {
	createTransactionSchema
} from "../schemas/transaction.schema.js";

import {
	createTransactionController,
	getTransactionController,
	getTransactionsController
} from "../controller/transaction.controller.js";


router.post("/",
	authenticate,
	validateResource(createTransactionSchema),
	createTransactionController
);

router.get("/",
	authenticate,
	getTransactionsController
);

router.get("/:transactionId",
	authenticate,
	getTransactionController
);

export default router;