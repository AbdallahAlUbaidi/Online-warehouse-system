import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

	hashedIdentifier: {
		type: String,
		index: { type: "hashed" },
		unique: true,
		required: true,
	},

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
		item: {
			itemId: {
				type: mongoose.Types.ObjectId,
				ref: "Item",
				required: true
			},
			name: {
				type: String,
				required: true,
			},
			price: Number,
			stock: Number
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
		required: true
	},

});

transactionSchema.index({ "payment.type": 1 });
transactionSchema.index({ buyerName: -1 });
transactionSchema.index({ "payment.details.dueDate": 1 });

transactionSchema.virtual("isPaid").get(function () {
	return this.payment.type === "cash" || this.payment.details.remainingPrice === 0;
});

export default mongoose.model("Transaction", transactionSchema);