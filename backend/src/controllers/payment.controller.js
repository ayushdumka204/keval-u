import { env } from "../config/env.js"
import { createPaymentOrder, getPaymentStatus, processWebhook, verifyCheckout } from "../services/payment.service.js"
import { orderSchema, verifySchema } from "../validators/payment.validator.js"

export async function postOrder(req, res) {
  const order = await createPaymentOrder(orderSchema.parse(req.body).contactId)
  res.status(201).json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: env.RAZORPAY_KEY_ID })
}

export async function postVerify(req, res) {
  const payment = await verifyCheckout(verifySchema.parse(req.body))
  res.json({ status: payment.status, paymentReference: payment.status === "paid" ? payment.razorpayPaymentId : undefined })
}

export async function getStatus(req, res) {
  const payment = await getPaymentStatus(req.params.orderId)
  res.json({ status: payment.status, paymentReference: payment.status === "paid" ? payment.razorpayPaymentId : undefined })
}

export async function postWebhook(req, res) {
  await processWebhook(req.body, req.get("x-razorpay-signature"), req.get("x-razorpay-event-id"))
  res.json({ received: true })
}
