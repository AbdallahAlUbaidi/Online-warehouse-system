import validateResource from "../../../middleware/validateResource.js";
import authenticate from "../../../middleware/authenticate.js";

import {
	createUserController,
	authenticateUser
} from "../controller/user.controller.js";


import {
	createUserSchema,
	authenticateUserSchema
} from "../schemas/user.schema.js";

import express from "express";

const router = express.Router();

router.post("/signup", validateResource(createUserSchema), createUserController);
router.post("/login", validateResource(authenticateUserSchema), authenticateUser);

router.get("/test-auth", authenticate, (req, res) =>
	res.status(200).send("Successful"));

export default router;