import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate.js";

import validateResource from "../../../middleware/validateResource.js";

import {
	createCategoryController,
} from "../controller/category.controller.js";

import {
	createCategorySchema
} from "../schemas/category.schema.js";

router.post("/", authenticate,
	validateResource(createCategorySchema),
	createCategoryController);

export default router;