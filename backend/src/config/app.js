import express from "express";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));


app.use("/health-check", (req, res) =>
	res.status(200).send("API is up")
);

import userRouter from "../api/v1/routes/user.route.js";

app.use("/api/v1/auth", userRouter);

import handleError from "../middleware/handleError.js";

app.use(handleError);


export default app;
