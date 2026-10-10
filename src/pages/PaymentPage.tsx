import { useState } from "react"
import { Navigate, useNavigate } from "react-router"
import { appConfig } from "../app/config"
import { useAppState } from "../app/AppState"
import type { PaymentMethod } from "../app/types"
import Button from "../components/Button"
import Header from "../components/Header"
import PaymentMethodCard from "../components/PaymentMethodCard"
import PaymentSummary from "../components/PaymentSummary"
import { payWithRazorpay, verifyUpiPayment } from "../services/api"

export default function PaymentPage() {
  const navigate = useNavigate()
  const { contact } = useAppState()
  const [method, setMethod] = useState<PaymentMethod>("razorpay")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const upiConfigured = Boolean(appConfig.upiId && appConfig.upiQrUrl)

  if (!contact.fullName || !contact.email) {
    return <Navigate to="/contact" replace />
  }

  const handlePayment = async () => {
    setLoading(true)
    setError("")

    try {
      const verified =
        method === "razorpay"
          ? await payWithRazorpay(contact)
          : await verifyUpiPayment(contact)

      if (!verified) {
        throw new Error(
          "We could not verify this payment. No success has been recorded.",
        )
      }

      sessionStorage.setItem("keval-payment-verified", "true")
      navigate("/thank-you")
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Payment could not be completed. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-shell">
      <Header backTo="/contact" />
      <section className="fade-in mx-auto w-full max-w-3xl py-10 sm:py-14">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal-dark)]">
            Step 2 of 2
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
            Complete Your Payment
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Choose your preferred secure payment method.
          </p>
        </div>

        <PaymentSummary customerName={contact.fullName} />

        <fieldset className="mt-6 space-y-3">
          <legend className="mb-3 text-sm font-semibold text-slate-800">
            Payment method
          </legend>
          <PaymentMethodCard
            value="razorpay"
            selected={method === "razorpay"}
            onSelect={setMethod}
            title="Pay with Razorpay"
            description="Use cards, UPI, netbanking, or supported wallets through secure Razorpay Checkout."
            badge="Secure checkout"
          />
          <PaymentMethodCard
            value="upi"
            selected={method === "upi"}
            onSelect={setMethod}
            title="Pay using UPI QR Code"
            description={
              upiConfigured
                ? "Scan the genuine KEVAL QR code with your preferred UPI app."
                : "UPI will be available when a genuine QR code and UPI ID are configured."
            }
            disabled={!upiConfigured}
            badge={upiConfigured ? "UPI" : "Not configured"}
          >
            {upiConfigured && method === "upi" && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-center">
                <img
                  src={appConfig.upiQrUrl}
                  alt={`UPI QR code for ${appConfig.upiId}`}
                  className="mx-auto size-48 object-contain"
                />
                <p className="mt-3 text-xs text-slate-500">
                  UPI ID:{" "}
                  <span className="font-semibold text-slate-700">
                    {appConfig.upiId}
                  </span>
                </p>
              </div>
            )}
          </PaymentMethodCard>
        </fieldset>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
          >
            {error}
          </div>
        )}

        <Button
          fullWidth
          loading={loading}
          onClick={handlePayment}
          className="mt-6"
        >
          {method === "razorpay"
            ? "Proceed to secure payment"
            : "I’ve paid — verify payment"}
        </Button>
        <p className="mt-4 text-center text-xs leading-5 text-slate-400">
          Payment success is shown only after verification by the server.
        </p>
      </section>
    </main>
  )
}
