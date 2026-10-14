import test, { before, after } from "node:test"
import assert from "node:assert/strict"

Object.assign(process.env, {
  NODE_ENV: "test",
  FRONTEND_URL: "https://frontend.example",
  MONGODB_URI: "mongodb://127.0.0.1:27017/keval-test",
  RAZORPAY_KEY_ID: "rzp_test_placeholder",
  RAZORPAY_KEY_SECRET: "test-key-secret",
  RAZORPAY_WEBHOOK_SECRET: "test-webhook-secret",
  SMTP_HOST: "smtp.example",
  SMTP_PORT: "587",
  SMTP_USER: "test-user",
  SMTP_PASS: "test-pass",
  NOTIFY_EMAIL: "owner@example.com",
  MAIL_FROM: "KEVAL <no-reply@example.com>",
  ADMIN_AUTH_SECRET: "12345678901234567890123456789012",
})

let server
let baseUrl

before(async () => {
  const { app } = await import("../src/app.js")
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`
      resolve()
    })
  })
})

after(() => new Promise((resolve) => server.close(resolve)))

test("health reports a disconnected database without exposing configuration", async () => {
  const response = await fetch(`${baseUrl}/api/health`)
  const body = await response.json()
  assert.equal(response.status, 503)
  assert.equal(body.database.state, "disconnected")
  assert.equal(JSON.stringify(body).includes("mongodb://"), false)
})

test("CORS allows the configured frontend and rejects an unknown origin", async () => {
  const allowed = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://frontend.example" } })
  assert.equal(allowed.headers.get("access-control-allow-origin"), "https://frontend.example")
  const denied = await fetch(`${baseUrl}/api/health`, { headers: { Origin: "https://attacker.example" } })
  assert.equal(denied.headers.get("access-control-allow-origin"), null)
})

test("private CSV export rejects requests without admin authorization", async () => {
  const response = await fetch(`${baseUrl}/api/admin/contacts.csv`)
  assert.equal(response.status, 401)
})
