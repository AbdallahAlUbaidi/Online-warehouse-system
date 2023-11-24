import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
	buyerName: {
		type: String,
		minLength: 5,
		maxLength: 64,
		required: true
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true
	},
	items: [{
		itemId: {
			type: mongoose.Types.ObjectId,
			ref: "Item",
			required: true
		},
		quantity: {
			type: Number,
			default: 1
		}
	}],

	payment: {
		type: {
			type: String,
			lowercase: true,
			enum: ["cash", "debt", "installment"],
			default: "cash"
		},

		details: {
			remainingPrice: Number,
			dueDate: Date,
			installmentPeriodInMonths: Number,
			installmentAmount: Number,
			upfrontAmount: Number
		}
	},

	purchaseDate: {
		type: Date,
		default: Date.now()
	},

});

transactionSchema.index({ "payment.type": 1 });
transactionSchema.index({ buyerName: -1 });
transactionSchema.index({ "payment.details.dueDate": 1 });

transactionSchema.virtual("isPaid").get(function () {
	return this.payment.type === "cash" || this.payment.details.remainingPrice === 0;
});

export default mongoose.model("Transaction", transactionSchema);