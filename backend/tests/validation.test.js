import test from "node:test"
import assert from "node:assert/strict"
import { contactSchema } from "../src/validators/contact.validator.js"
import { verifySchema } from "../src/validators/payment.validator.js"

test("valid contacts are normalized", () => {
  const value = contactSchema.parse({ name: "Keval Shah", email: "USER@example.com", phone: "+91 98765 43210" })
  assert.equal(value.email, "user@example.com")
})

test("invalid contacts and honeypot spam are rejected", () => {
  assert.throws(() => contactSchema.parse({ name: "K", email: "bad", phone: "1", website: "spam" }))
})

test("malformed checkout signatures are rejected before service processing", () => {
  assert.throws(() => verifySchema.parse({ razorpay_order_id: "order", razorpay_payment_id: "payment", razorpay_signature: "bad" }))
})
