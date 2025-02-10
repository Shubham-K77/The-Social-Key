import mongoose from "mongoose";
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
      required: [true, "Credit Must Be Specified!"],
      min: 0,
    },
    transactionId: {
      type: String,
      unique: true,
      required: [true, "Transaction ID Must Be Specified!"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment Method Must Be Specified!"],
      enum: ["debit_card", "bank_transfer", "cash", "online"],
      default: "online",
    },
    status: {
      type: String,
      required: [true, "Status Must Be Specified"],
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    pidx: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model("payment", paymentSchema);
export default paymentModel;
