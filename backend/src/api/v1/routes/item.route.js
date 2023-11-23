import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate.js";

import validateResource from "../../../middleware/validateResource.js";

import {
	createItemController,
	getItemsController,
	getItemController,
} from "../controller/item.controller.js";


import {
	createItemSchema,
	getItemSchema
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

export default router;