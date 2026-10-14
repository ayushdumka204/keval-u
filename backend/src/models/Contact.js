import mongoose from "mongoose"

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
}, { timestamps: true })

schema.index({ email: 1, createdAt: -1 })
export const Contact = mongoose.model("Contact", schema)
