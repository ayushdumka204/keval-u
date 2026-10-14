import crypto from "node:crypto"
import { env } from "../config/env.js"

export function requireAdmin(req, res, next) {
  const supplied = Buffer.from((req.get("authorization") || "").replace(/^Bearer /, ""))
  const expected = Buffer.from(env.ADMIN_AUTH_SECRET)
  if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  next()
}
