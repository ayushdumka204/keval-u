import crypto from "node:crypto"

export function hmac(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex")
}

export function timingSafeEqual(left = "", right = "") {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function verifyCheckoutSignature(orderId, paymentId, signature, secret) {
  return timingSafeEqual(hmac(`${orderId}|${paymentId}`, secret), signature)
}

export function verifyWebhookSignature(rawBody, signature, secret) {
  return timingSafeEqual(hmac(rawBody, secret), signature)
}
