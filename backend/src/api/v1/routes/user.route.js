import validateResource from "../../../middleware/validateResource.js";

import {
	createUserController
} from "../controller/user.controller.js";


import {
	createUserSchema
} from "../schemas/user.schema.js";

import express from "express";

const router = express.Router();

router.post("/signup", validateResource(createUserSchema), createUserController);


export default router;