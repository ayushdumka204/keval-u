import { useEffect, useState } from "react"
import ContactForm from "./components/forms/ContactForm"
import PaymentPanel from "./components/payment/PaymentPanel"
import { api } from "./services/api"
import type { Contact, PaymentStatus } from "./types"

type Step = "contact" | "payment" | PaymentStatus

function navigate(path: string) {
  window.history.pushState({}, "", path)
  window.dispatchEvent(new PopStateEvent("popstate"))
  window.scrollTo({ top: 0, behavior: "smooth" })
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const updatePath = () => setPath(window.location.pathname)
    window.addEventListener("popstate", updatePath)
    return () => window.removeEventListener("popstate", updatePath)
  }, [])

  return path === "/contact" ? <ContactPage /> : <HomePage />
}

function Header({ showAction = true }: { showAction?: boolean }) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-10">
      <button onClick={() => navigate("/")} className="text-xl font-bold tracking-[.28em]">KEVAL</button>
      {showAction && (
        <button
          onClick={() => navigate("/contact")}
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm transition hover:border-amber-300 hover:bg-amber-300 hover:text-stone-950"
        >
          Get started
        </button>
      )}
    </header>
  )
}

function HomePage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Header />
      <main className="mx-auto flex min-h-[calc(100vh-81px)] max-w-5xl flex-col items-center justify-center px-5 py-20 text-center">
        <p className="mb-6 text-sm font-medium uppercase tracking-[.22em] text-amber-300">Personal. Clear. Considered.</p>
        <h1 className="max-w-4xl text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl lg:text-8xl">
          Make your next move with confidence.
        </h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-400">
          A focused KEVAL consultation gives you practical direction, thoughtful guidance, and a clear way forward.
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="mt-10 rounded-xl bg-amber-300 px-8 py-4 font-semibold text-stone-950 transition hover:bg-amber-200"
        >
          Get started
        </button>
        <div className="mt-16 flex flex-wrap justify-center gap-x-10 gap-y-3 border-t border-white/10 pt-7 text-sm text-stone-500">
          <span>Secure checkout</span>
          <span>Personal response</span>
          <span>Simple process</span>
        </div>
      </main>
    </div>
  )
}

function ContactPage() {
  const [step, setStep] = useState<Step>("contact")
  const [contact, setContact] = useState<Contact>()
  const [reference, setReference] = useState("")
  const [orderId, setOrderId] = useState("")
  const result = (status: PaymentStatus, ref?: string) => {
    setReference(ref || "")
    setStep(status)
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <Header showAction={false} />
      <main className="mx-auto max-w-xl px-5 py-12 sm:px-8 sm:py-20">
        <button onClick={() => navigate("/")} className="mb-7 text-sm text-stone-500 transition hover:text-white">
          ← Back to home
        </button>
        <section className="rounded-3xl border border-white/10 bg-stone-900 p-6 shadow-2xl shadow-black/30 sm:p-9">
          {step === "contact" && (
            <>
              <p className="mb-2 text-sm text-amber-300">Let’s begin</p>
              <h1 className="text-3xl font-semibold">Start a conversation</h1>
              <p className="mb-8 mt-3 text-stone-400">Tell us where to reach you, then continue to secure payment.</p>
              <ContactForm done={(value) => { setContact(value); setStep("payment") }} />
            </>
          )}
          {step === "payment" && contact && (
            <PaymentPanel
              contact={contact}
              back={() => setStep("contact")}
              result={result}
              processing={(value) => { setOrderId(value); setStep("pending") }}
            />
          )}
          {step === "pending" && orderId && <ProcessingResult orderId={orderId} result={result} />}
          {step === "paid" && <Result title="Thank you." copy="Your payment is verified and your KEVAL booking is confirmed." reference={reference} />}
          {step === "failed" && <Result title="Payment wasn’t completed" copy="No booking was confirmed. You can safely try again." action={() => setStep("payment")} />}
        </section>
      </main>
    </div>
  )
}

function ProcessingResult({ orderId, result }: { orderId: string; result: (status: PaymentStatus, reference?: string) => void }) {
  const [message, setMessage] = useState("This normally takes only a few seconds. Keep this page open while we check the verified status.")

  useEffect(() => {
    let active = true
    async function checkStatus() {
      try {
        const payment = await api.status(orderId)
        if (active && payment.status !== "pending") result(payment.status, payment.paymentReference)
      } catch {
        if (active) setMessage("We could not refresh the status just now. We’ll keep trying automatically.")
      }
    }
    checkStatus()
    const interval = window.setInterval(checkStatus, 3000)
    const timeout = window.setTimeout(() => {
      window.clearInterval(interval)
      if (active) setMessage("Confirmation is taking longer than expected. Your status is still safely recorded; refresh this page or contact KEVAL with your order reference.")
    }, 60000)
    return () => {
      active = false
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [orderId, result])

  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 size-12 animate-spin rounded-full border-2 border-white/15 border-t-amber-300" />
      <h2 className="text-3xl font-semibold">We’re confirming your payment</h2>
      <p className="mx-auto mt-4 max-w-sm leading-7 text-stone-400">{message}</p>
      <p className="mt-6 break-all rounded-lg bg-white/5 p-3 font-mono text-xs text-stone-500">Order: {orderId}</p>
    </div>
  )
}

function Result({ title, copy, reference, action }: { title: string; copy: string; reference?: string; action?: () => void }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-6 grid size-14 place-items-center rounded-full bg-amber-300 text-2xl text-stone-950">✓</div>
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="mx-auto mt-4 max-w-sm leading-7 text-stone-400">{copy}</p>
      {reference && <p className="mt-6 rounded-lg bg-white/5 p-3 font-mono text-sm">Reference: {reference}</p>}
      {action && <button onClick={action} className="mt-7 rounded-xl bg-amber-300 px-6 py-3 font-semibold text-stone-950">Try again</button>}
    </div>
  )
}
