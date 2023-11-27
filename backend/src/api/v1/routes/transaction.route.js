import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate.js";
import validateResource from "../../../middleware/validateResource.js";

import {
	createTransactionSchema
} from "../schemas/transaction.schema.js";

import {
	createTransactionController,
	deleteTransactionController,
	getTransactionController,
	getTransactionItemsController,
	getTransactionsController,
	updateTransactionController
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

router.get("/:transactionId/items",
	authenticate,
	getTransactionItemsController);

router.delete("/:transactionId",
	authenticate,
	deleteTransactionController
);

router.put("/:transactionId",
	authenticate,
	updateTransactionController
);

export default router;