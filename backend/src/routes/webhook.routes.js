import { Router } from "express"
import { postWebhook } from "../controllers/payment.controller.js"
import { asyncRoute } from "../middleware/async-route.js"

export const webhookRouter = Router()
webhookRouter.post("/", asyncRoute(postWebhook))
