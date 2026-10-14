import { Router } from "express"
import rateLimit from "express-rate-limit"
import { postContact } from "../controllers/contact.controller.js"
import { asyncRoute } from "../middleware/async-route.js"

export const contactRouter = Router()
contactRouter.post("/", rateLimit({ windowMs: 60 * 60 * 1000, limit: 10 }), asyncRoute(postContact))
