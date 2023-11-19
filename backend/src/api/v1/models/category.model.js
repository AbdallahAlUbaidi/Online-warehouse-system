import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
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
});


export default mongoose.model("Category", categorySchema);