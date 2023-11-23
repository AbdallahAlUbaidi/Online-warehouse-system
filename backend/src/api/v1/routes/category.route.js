import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate.js";

import validateResource from "../../../middleware/validateResource.js";

import {
	createCategoryController,
	getCategoriesController,
	getCategoryController
} from "../controller/category.controller.js";

import {
	createCategorySchema
} from "../schemas/category.schema.js";

router.post("/", authenticate,
	validateResource(createCategorySchema),
	createCategoryController);

router.get("/",
	authenticate,
	getCategoriesController
);

router.get("/:categoryId",
	authenticate,
	getCategoryController
);

export default router;