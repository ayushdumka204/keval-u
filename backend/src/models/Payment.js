import mongoose from "mongoose"

const schema = new mongoose.Schema({
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true, index: true },
  razorpayOrderId: { type: String, required: true, unique: true, index: true },
  razorpayPaymentId: {type: String,default: undefined},
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, required: true, uppercase: true, minlength: 3, maxlength: 3 },
  status: { type: String, enum: ["pending", "paid", "failed"], default: "pending", index: true },
  confirmationEmailSentAt: { type: Date, default: null },
}, { timestamps: true })

export const Payment = mongoose.model("Payment", schema)
