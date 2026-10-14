import "dotenv/config"
import { z } from "zod"

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  FRONTEND_URL: z.string().url(),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  RAZORPAY_KEY_ID: z.string().min(1, "RAZORPAY_KEY_ID is required"),
  RAZORPAY_KEY_SECRET: z.string().min(1, "RAZORPAY_KEY_SECRET is required"),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1, "RAZORPAY_WEBHOOK_SECRET is required"),
  PAYMENT_AMOUNT_PAISE: z.coerce.number().int().positive().default(50000),
  PAYMENT_CURRENCY: z.string().length(3).default("INR"),
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().int().positive(),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASS: z.string().min(1, "SMTP_PASS is required"),
  SMTP_SECURE: z.string().default("false").transform((value) => value === "true"),
  NOTIFY_EMAIL: z.string().email(),
  MAIL_FROM: z.string().min(1),
  ADMIN_AUTH_SECRET: z.string().min(32, "ADMIN_AUTH_SECRET must contain at least 32 characters"),
})

const parsed = schema.safeParse(process.env)
if (!parsed.success) {
  const message = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ")
  throw new Error(`Invalid backend environment: ${message}`)
}

export const env = parsed.data
