import mongoose from "mongoose";
//Create A Schema:
const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      required: [true, "Username Must Be Specified!"],
    },
    amount: {
      type: Number,
      required: [true, "Amount Must Be Specified!"],
      min: 0,
    },
    credit: {
      type: Number,
      required: [true, "Amount Must Be Specified!"],
      min: 0,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment Method Must Be Specified!"],
      enum: ["debit_card", "bank_transfer", "cash", "online"],
      default: "online", //Khalti
    },
    status: {
      type: String,
      required: [true, "Status Must Be Specified"],
      enum: ["pending", "completed", "failed", "refunded"], // Payment status
      default: "pending",
    },
    pidx: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);
//Export Schema:
const paymentModel = mongoose.model("payment", paymentSchema);
export default paymentModel;
