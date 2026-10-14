import nodemailer from "nodemailer"
import { env } from "../config/env.js"

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
})

export async function verifyEmailConnection() {
  try {
    await transporter.verify()
    console.log("SMTP connection verified successfully")
  } catch (error) {
    console.error("SMTP verification failed:", {
      code: error.code,
      command: error.command,
      message: error.message,
    })
  }
}

export function sendContactNotification(contact) {
  return transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.NOTIFY_EMAIL,
    subject: "New KEVAL enquiry",
    text: `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nReference: ${contact.id}`,
  })
}

export function sendPaymentConfirmation(payment, contact) {
  return transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.NOTIFY_EMAIL,
    subject: "Verified KEVAL payment",
    text: `Payment ${payment.razorpayPaymentId} was verified for ${contact.name} (${contact.email}).`,
  })
}
