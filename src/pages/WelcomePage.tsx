import { useNavigate } from "react-router"
import Button from "../components/Button"
import Footer from "../components/Footer"
import Logo from "../components/Logo"

const welcomePoints = [
  {
    number: "01",
    title: "Personal attention",
    description: "Share what you need, and we'll take it from there.",
  },
  {
    number: "02",
    title: "A clear process",
    description: "Straightforward steps with no unnecessary complexity.",
  },
  {
    number: "03",
    title: "Secure by design",
    description: "Your information and payments are handled responsibly.",
  },
]

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <main className="page-shell">
      <header className="fade-in mx-auto flex w-full max-w-6xl items-center justify-between border-b border-slate-200/80 pb-5">
        <Logo />
        <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:block">
          Your Ascent — Our Priority
        </p>
      </header>

      <section className="fade-in mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 py-14 sm:py-20 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20 lg:py-24">
        <div>
          <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--teal-dark)]">
            <span className="h-px w-8 bg-[var(--teal)]" aria-hidden="true" />
            Welcome to KEVAL
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-bold leading-[1.02] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
            Your next step,
            <span className="block text-[var(--purple)]">made simpler.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
            Let&apos;s connect and get started with a clear, thoughtful process
            built around your needs.
          </p>
          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button
              className="w-full sm:w-auto sm:min-w-56"
              onClick={() => navigate("/contact")}
            >
              Connect &amp; Continue
              <span aria-hidden="true">→</span>
            </Button>
            <p className="text-xs leading-5 text-slate-400">
              Simple. Private. Secure.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-2 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
          <p className="py-5 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            What to expect
          </p>
          <div className="divide-y divide-slate-200">
            {welcomePoints.map((point) => (
              <div
                key={point.number}
                className="grid grid-cols-[2.5rem_1fr] gap-3 py-6"
              >
                <span className="pt-0.5 text-sm font-bold text-[var(--teal)]">
                  {point.number}
                </span>
                <div>
                  <h2 className="font-semibold text-slate-900">
                    {point.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
