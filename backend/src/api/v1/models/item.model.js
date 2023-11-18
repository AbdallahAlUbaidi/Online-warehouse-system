import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true
	},
	category: {
		type: mongoose.Types.ObjectId,
		ref: "Category",
		required: true
	},
	price: Number,
	stock: Number
});

export default mongoose.model("Item", itemSchema);