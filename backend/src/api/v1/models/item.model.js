import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: "User"
	},
	category: {
		type: mongoose.Types.ObjectId,
		ref: "Category"
	},
	price: Number,
	stock: Number
});

export default mongoose.model("Item", itemSchema);