import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate.js";

import validateResource from "../../../middleware/validateResource.js";

import {
	createItemController,
	getItemsController,
	getItemController,
	deleteItemController,
	updateItemController,
} from "../controller/item.controller.js";


import {
	createItemSchema,
	getItemSchema,
	updateItemSchema
} from "../schemas/item.schema.js";



router.post("/", authenticate,
	validateResource(createItemSchema),
	createItemController);

router.get("/", authenticate,
	getItemsController);

router.get("/:itemId",
	authenticate,
	validateResource(getItemSchema),
	getItemController);

router.delete("/:itemId",
	authenticate,
	validateResource(getItemSchema),
	deleteItemController);

router.put("/:itemId",
	authenticate,
	validateResource(updateItemSchema),
	updateItemController);

export default router;