import { useState } from "react"
import { api } from "../../services/api"
import type { Contact, PaymentStatus } from "../../types"
function loadCheckout() { return new Promise<void>((resolve, reject) => {
  if (window.Razorpay) return resolve()
  const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"
  script.onload = () => resolve(); script.onerror = () => reject(new Error("Payment service could not be loaded.")); document.head.appendChild(script)
})}
export default function PaymentPanel({ contact, result, processing, back }: { contact: Contact; result: (s: PaymentStatus, r?: string) => void; processing: (orderId: string) => void; back: () => void }) {
  const [loading, setLoading] = useState(false); const [error, setError] = useState("")
  async function pay() {
    setLoading(true); setError("")
    try {
      const order = await api.order(contact.id)
      await loadCheckout()
      const checkout = new window.Razorpay({ key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId, name: "KEVAL", description: "KEVAL consultation",
        prefill: { name: contact.name, email: contact.email, contact: contact.phone }, theme: { color: "#fcd34d" }, modal: { ondismiss: () => setLoading(false) },
        handler: async (response: Record<string, string>) => { try { const p = await api.verify(response); p.status === "pending" ? processing(order.orderId) : result(p.status, p.paymentReference) } catch { processing(order.orderId) } },
      })
      checkout.on("payment.failed", () => processing(order.orderId))
      checkout.open()
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to start payment."); setLoading(false) }
  }
  return <div><p className="mb-2 text-sm text-amber-300">Details received</p><h2 className="text-2xl font-semibold">Complete your booking</h2>
    <p className="mt-3 text-stone-400">The final amount appears in secure Razorpay Checkout. KEVAL never receives card or UPI credentials.</p>
    <div className="my-7 rounded-xl border border-white/10 bg-white/5 p-4 text-sm"><p className="font-medium">{contact.name}</p><p className="mt-1 text-stone-400">{contact.email} · {contact.phone}</p></div>
    {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
    <button onClick={pay} disabled={loading} className="w-full rounded-xl bg-amber-300 px-5 py-4 font-semibold text-stone-950 disabled:opacity-60">{loading ? "Opening secure checkout…" : "Pay securely"}</button>
    <button onClick={back} className="mt-3 w-full py-2 text-sm text-stone-500">Edit contact details</button>
  </div>
}
