import test from "node:test"
import assert from "node:assert/strict"
import { escapeCsv } from "../src/utils/csv.js"
import { hmac, verifyCheckoutSignature, verifyWebhookSignature } from "../src/utils/signatures.js"

test("valid checkout HMAC is accepted and tampering is rejected", () => {
  const signature = hmac("order_1|pay_1", "test-secret")
  assert.equal(verifyCheckoutSignature("order_1", "pay_1", signature, "test-secret"), true)
  assert.equal(verifyCheckoutSignature("order_1", "pay_2", signature, "test-secret"), false)
})

test("webhook verification uses the exact raw body", () => {
  const raw = Buffer.from('{"event":"payment.captured"}')
  const signature = hmac(raw, "webhook-secret")
  assert.equal(verifyWebhookSignature(raw, signature, "webhook-secret"), true)
  assert.equal(verifyWebhookSignature(Buffer.from('{"event": "payment.captured"}'), signature, "webhook-secret"), false)
})

test("CSV escaping handles quotes, commas and formula injection", () => {
  assert.equal(escapeCsv('Doe, "Jane"'), '"Doe, ""Jane"""')
  assert.equal(escapeCsv("=1+1"), "\"'=1+1\"")
})
