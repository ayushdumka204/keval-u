import { Router } from "express"
import { getStatus, postOrder, postVerify } from "../controllers/payment.controller.js"
import { asyncRoute } from "../middleware/async-route.js"

export const paymentRouter = Router()
paymentRouter.post("/create-order", asyncRoute(postOrder))
paymentRouter.post("/verify", asyncRoute(postVerify))
paymentRouter.get("/status/:orderId", asyncRoute(getStatus))
