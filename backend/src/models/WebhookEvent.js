import mongoose from "mongoose"

const schema = new mongoose.Schema({
  eventKey: { type: String, required: true, unique: true, index: true },
  eventType: { type: String, required: true },
  status: { type: String, enum: ["processing", "processed", "failed"], default: "processing" },
  attempts: { type: Number, default: 1, min: 1 },
  lastError: { type: String, default: null, maxlength: 200 },
  processedAt: { type: Date, default: null },
}, { timestamps: true })

export const WebhookEvent = mongoose.model("WebhookEvent", schema)
