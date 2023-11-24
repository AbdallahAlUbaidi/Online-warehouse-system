import express from "express";
const router = express.Router();

import authenticate from "../../../middleware/authenticate.js";

import validateResource from "../../../middleware/validateResource.js";

import {
	createCategoryController,
	deleteCategoryController,
	getCategoriesController,
	getCategoryController,
	getCategoryItemsController,
	updateCategoryController
} from "../controller/category.controller.js";

import {
	createCategorySchema,
	getCategorySchema,
	updateCategorySchema
} from "../schemas/category.schema.js";

router.post("/",
	authenticate,
	validateResource(createCategorySchema),
	createCategoryController
);

router.get("/",
	authenticate,
	getCategoriesController
);

router.get("/:categoryId",
	authenticate,
	validateResource(getCategorySchema),
	getCategoryController
);

router.get("/:categoryId/items",
	authenticate,
	validateResource(getCategorySchema),
	getCategoryItemsController
);

router.delete("/:categoryId",
	authenticate,
	validateResource(getCategorySchema),
	deleteCategoryController
);

router.put("/:categoryId",
	authenticate,
	validateResource(updateCategorySchema),
	updateCategoryController
);

export default router;