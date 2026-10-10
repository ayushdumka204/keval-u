import { useNavigate } from "react-router"
import { useAppState } from "../app/AppState"
import ContactForm from "../components/ContactForm"
import Header from "../components/Header"

export default function ContactPage() {
  const navigate = useNavigate()
  const { contact, setContact } = useAppState()

  return (
    <main className="page-shell">
      <Header backTo="/" />
      <section className="fade-in mx-auto w-full max-w-3xl py-10 sm:py-14">
        <div className="mb-7">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--teal-dark)]">
            Step 1 of 2
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-4xl">
            Your Details
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Share a few details so we can personalise your KEVAL experience.
          </p>
        </div>
        <ContactForm
          initialValues={contact}
          onBack={() => navigate("/")}
          onSave={(details) => {
            setContact(details)
            navigate("/payment")
          }}
        />
      </section>
    </main>
  )
}
