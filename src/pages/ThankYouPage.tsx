import { Navigate, useNavigate } from "react-router"
import Button from "../components/Button"
import Logo from "../components/Logo"

export default function ThankYouPage() {
  const navigate = useNavigate()
  const verified = sessionStorage.getItem("keval-payment-verified") === "true"

  if (!verified) return <Navigate to="/payment" replace />

  const goHome = () => {
    sessionStorage.removeItem("keval-payment-verified")
    navigate("/")
  }

  return (
    <main className="page-shell">
      <section className="fade-in flex flex-1 flex-col items-center justify-center py-12 text-center">
        <Logo />
        <div
          className="success-mark mt-10"
          aria-label="Payment verified successfully"
          role="img"
        />
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal-dark)]">
          Payment confirmed
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl">
          Thank You!
        </h1>
        <p className="mt-5 max-w-md text-base leading-7 text-slate-500">
          Your payment has been securely verified. We&apos;ve received your
          details and will be in touch shortly.
        </p>
        <Button className="mt-9 min-w-48" onClick={goHome}>
          Back to Home
        </Button>
      </section>
    </main>
  )
}
