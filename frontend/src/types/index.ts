export type Contact = { id: string; name: string; email: string; phone: string }
export type PaymentStatus = "pending" | "paid" | "failed"
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: "payment.failed", callback: () => void) => void
    }
  }
}
