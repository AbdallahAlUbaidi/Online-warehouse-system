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
import itemRouter from "../api/v1/routes/item.route.js";
import categoryRouter from "../api/v1/routes/category.route.js";
import transactionRouter from "../api/v1/routes/transaction.route.js";

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/transactions", transactionRouter);

import handleError from "../middleware/handleError.js";

app.use(handleError);


export default app;
