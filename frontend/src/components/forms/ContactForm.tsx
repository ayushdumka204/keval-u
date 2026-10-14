import { FormEvent, useState } from "react"
import { api } from "../../services/api"
import type { Contact } from "../../types"
export default function ContactForm({ done }: { done: (contact: Contact) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "" })
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent) {
    event.preventDefault(); setError("")
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !/^[+\d][\d\s()-]{7,17}$/.test(form.phone)) return setError("Enter a valid name, email, and phone number.")
    setLoading(true)
    try { done((await api.contact(form)).contact) } catch (e) { setError(e instanceof Error ? e.message : "Submission failed.") } finally { setLoading(false) }
  }
  return <form onSubmit={submit} className="space-y-5" noValidate>
    {([
      ["name", "Full name", "text", "Your name"], ["email", "Email address", "email", "you@example.com"], ["phone", "Phone number", "tel", "+91 98765 43210"],
    ] as const).map(([key, label, type, placeholder]) => <label className="block" key={key}>
      <span className="mb-2 block text-sm text-stone-300">{label}</span>
      <input required type={type} placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none placeholder:text-stone-600 focus:border-amber-300" />
    </label>)}
    <input aria-hidden tabIndex={-1} autoComplete="off" className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
    {error && <p role="alert" className="rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}
    <button disabled={loading} className="w-full rounded-xl bg-amber-300 px-5 py-4 font-semibold text-stone-950 hover:bg-amber-200 disabled:opacity-60">{loading ? "Saving securely…" : "Continue to payment"}</button>
  </form>
}
