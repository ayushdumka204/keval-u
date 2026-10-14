import mongoose from "mongoose"
import { env } from "./env.js"

export async function connectDatabase() {
  mongoose.set("sanitizeFilter", true)
  await mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
}

export function databaseHealth() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"]
  const state = states[mongoose.connection.readyState] || "unknown"
  return { status: state === "connected" ? "up" : "down", state }
}
