import { appConfig } from "../app/config"
import type { ContactDetails } from "../app/types"

export async function saveContactDetails(details: ContactDetails) {
  if (!appConfig.contactEndpoint) return

  const response = await fetch(appConfig.contactEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  })

  if (!response.ok) {
    throw new Error("We couldn't save your details. Please try again.")
  }
}

type RazorpayOrder = {
  orderId: string
  amount: number
  currency: string
  keyId: string
}

type RazorpayResult = {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

declare global {
  interface Window {
    Razorpay?: new (
      options: Record<string, unknown>,
    ) => {
      open: () => void
      on: (event: string, handler: (response: unknown) => void) => void
    }
  }
}

async function loadRazorpay() {
  if (window.Razorpay) return

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve()
    script.onerror = () => reject(new Error("Razorpay could not be loaded."))
    document.head.appendChild(script)
  })
}

export async function payWithRazorpay(
  details: ContactDetails,
): Promise<boolean> {
  const orderResponse = await fetch(
    `${appConfig.paymentApiBase}/razorpay/order`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: details,
        service: appConfig.serviceDescription,
        amount: appConfig.amountInPaise,
        currency: appConfig.currency,
      }),
    },
  )

  if (!orderResponse.ok) {
    throw new Error("Unable to start payment. Please try again.")
  }

  const order = (await orderResponse.json()) as RazorpayOrder
  await loadRazorpay()

  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Razorpay could not be loaded."))
      return
    }

    const checkout = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "KEVAL",
      description: appConfig.serviceDescription,
      prefill: {
        name: details.fullName,
        email: details.email,
        contact: details.mobile,
      },
      theme: { color: "#48249A" },
      modal: {
        ondismiss: () => {
          reject(new Error("Payment was cancelled. You can try again."))
        },
      },
      handler: async (result: RazorpayResult) => {
        try {
          const verification = await fetch(
            `${appConfig.paymentApiBase}/razorpay/verify`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(result),
            },
          )
          if (!verification.ok) {
            resolve(false)
            return
          }
          const verificationResult = (await verification.json()) as {
            verified?: boolean
          }
          resolve(verificationResult.verified === true)
        } catch {
          reject(new Error("Payment verification failed. Contact support."))
        }
      },
    })

    checkout.on("payment.failed", () => {
      reject(new Error("Payment was not completed. Please try again."))
    })
    checkout.open()
  })
}

export async function verifyUpiPayment(
  details: ContactDetails,
): Promise<boolean> {
  const response = await fetch(`${appConfig.paymentApiBase}/upi/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      upiId: appConfig.upiId,
      amount: appConfig.amountInPaise,
      currency: appConfig.currency,
      customer: {
        name: details.fullName,
        email: details.email,
        mobile: details.mobile,
      },
    }),
  })

  return response.ok && Boolean((await response.json()).verified)
}
