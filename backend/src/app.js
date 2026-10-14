import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { env } from "./config/env.js"
import { databaseHealth } from "./config/database.js"
import { adminRouter } from "./routes/admin.routes.js"
import { contactRouter } from "./routes/contact.routes.js"
import { paymentRouter } from "./routes/payment.routes.js"
import { webhookRouter } from "./routes/webhook.routes.js"
import { errorHandler, notFound } from "./middleware/error-handler.js"

export const app = express()
app.set("trust proxy", 1)
app.use(helmet())
app.use(cors({ origin: env.FRONTEND_URL.split(",").map((value) => value.trim()), methods: ["GET", "POST"], allowedHeaders: ["Content-Type", "Authorization"] }))
app.use("/api/payment/webhook", express.raw({ type: "application/json", limit: "256kb" }), webhookRouter)
app.use(express.json({ limit: "32kb" }))
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }))
app.get("/api/health", (_req, res) => {
  const database = databaseHealth()
  res.status(database.status === "up" ? 200 : 503).json({ status: database.status === "up" ? "ok" : "degraded", database })
})
app.use("/api/contacts", contactRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/admin", adminRouter)
app.use(notFound)
app.use(errorHandler)
