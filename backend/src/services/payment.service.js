import mongoose from "mongoose"
import Razorpay from "razorpay"
import { env } from "../config/env.js"
import { Contact } from "../models/Contact.js"
import { Payment } from "../models/Payment.js"
import { WebhookEvent } from "../models/WebhookEvent.js"
import { hmac, verifyCheckoutSignature, verifyWebhookSignature } from "../utils/signatures.js"
import { sendPaymentConfirmation } from "./email.service.js"

const razorpay = new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })

export async function createPaymentOrder(contactId) {
  if (!(await Contact.exists({ _id: contactId }))) throw Object.assign(new Error("Contact not found"), { status: 404 })
  const order = await razorpay.orders.create({
    amount: env.PAYMENT_AMOUNT_PAISE,
    currency: env.PAYMENT_CURRENCY,
    receipt: `keval_${contactId}_${Date.now()}`.slice(0, 40),
  })
  await Payment.create({ contactId, razorpayOrderId: order.id, amount: env.PAYMENT_AMOUNT_PAISE, currency: env.PAYMENT_CURRENCY })
  return order
}

async function notifyPaymentOnce(payment) {
  const claimed = await Payment.findOneAndUpdate(
    { _id: payment._id, confirmationEmailSentAt: null },
    { $set: { confirmationEmailSentAt: new Date() } },
    { new: true },
  ).populate("contactId")
  if (!claimed) return
  try {
    await sendPaymentConfirmation(claimed, claimed.contactId)
  } catch (error) {
    await Payment.updateOne({ _id: payment._id }, { $set: { confirmationEmailSentAt: null } })
    console.error("Payment email delivery failed:", error.message)
  }
}

async function confirmCapturedPayment(localPayment, paymentId) {
  const providerPayment = await razorpay.payments.fetch(paymentId)
  const authoritative = providerPayment.order_id === localPayment.razorpayOrderId
    && providerPayment.amount === localPayment.amount
    && providerPayment.currency === localPayment.currency
    && providerPayment.status === "captured"
  if (!authoritative) return localPayment

  const paid = await Payment.findOneAndUpdate(
    {
      _id: localPayment._id,
      status: mongoose.trusted({ $ne: "paid" }),
    },
    {
      $set: {
        status: "paid",
        razorpayPaymentId: paymentId,
      },
    },
    { new: true },
  ) || await Payment.findById(localPayment._id)
  await notifyPaymentOnce(paid)
  return paid
}

export async function verifyCheckout(input) {
  const local = await Payment.findOne({ razorpayOrderId: input.razorpay_order_id })
  if (!local) throw Object.assign(new Error("Payment order not found"), { status: 404 })
  if (!verifyCheckoutSignature(local.razorpayOrderId, input.razorpay_payment_id, input.razorpay_signature, env.RAZORPAY_KEY_SECRET)) {
    throw Object.assign(new Error("Invalid payment signature"), { status: 400 })
  }
  return confirmCapturedPayment(local, input.razorpay_payment_id)
}

export async function getPaymentStatus(orderId) {
  const payment = await Payment.findOne({ razorpayOrderId: orderId })
  if (!payment) throw Object.assign(new Error("Payment order not found"), { status: 404 })
  if (payment.status === "paid" && !payment.confirmationEmailSentAt) await notifyPaymentOnce(payment)
  return payment
}

export async function processWebhook(rawBody, signature, providerEventId) {
  if (!verifyWebhookSignature(rawBody, signature, env.RAZORPAY_WEBHOOK_SECRET)) {
    throw Object.assign(new Error("Invalid webhook signature"), { status: 400 })
  }
  const payload = JSON.parse(rawBody.toString("utf8"))
  const entity = payload.payload?.payment?.entity
  const eventKey = providerEventId || payload.id || hmac(rawBody, env.RAZORPAY_WEBHOOK_SECRET)

  try {
    await WebhookEvent.create({ eventKey, eventType: payload.event })
  } catch (error) {
    if (error.code !== 11000) throw error
    const retry = await WebhookEvent.findOneAndUpdate(
      { eventKey, status: "failed" },
      { $set: { status: "processing", lastError: null }, $inc: { attempts: 1 } },
      { new: true },
    )
    if (!retry) return
  }

  try {
    if (entity?.order_id && payload.event === "payment.captured") {
      const local = await Payment.findOne({ razorpayOrderId: entity.order_id })
      if (local) await confirmCapturedPayment(local, entity.id)
    }
    if (entity?.order_id && payload.event === "payment.failed") {
      await Payment.updateOne(
        { razorpayOrderId: entity.order_id, status: "pending" },
        { $set: { status: "failed", razorpayPaymentId: entity.id } },
      )
    }
    await WebhookEvent.updateOne({ eventKey }, { $set: { status: "processed", processedAt: new Date() } })
  } catch (error) {
    await WebhookEvent.updateOne(
      { eventKey },
      { $set: { status: "failed", lastError: String(error.message).slice(0, 200) } },
    ).catch(() => {})
    throw error
  }
}
