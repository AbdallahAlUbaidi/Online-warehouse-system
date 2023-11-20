import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate.js";

import validateResource from "../../../middleware/validateResource.js";

import {
	createItemController,
	getItemsController
} from "../controller/item.controller.js";


import {
	createItemSchema
} from "../schemas/item.schema.js";



router.post("/", authenticate,
	validateResource(createItemSchema),
	createItemController);

router.get("/", authenticate,
	getItemsController);

export default router;