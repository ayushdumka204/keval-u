import { Router } from "express"
import rateLimit from "express-rate-limit"
import { exportContacts } from "../controllers/admin.controller.js"
import { requireAdmin } from "../middleware/admin-auth.js"
import { asyncRoute } from "../middleware/async-route.js"

export const adminRouter = Router()
adminRouter.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 10 }), requireAdmin)
adminRouter.get("/contacts.csv", asyncRoute(exportContacts))
