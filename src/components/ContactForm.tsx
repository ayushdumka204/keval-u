import { useState, type FormEvent } from "react"
import type { ContactDetails } from "../app/types"
import { saveContactDetails } from "../services/api"
import Button from "./Button"
import FormInput from "./FormInput"

type ContactFormProps = {
  initialValues: ContactDetails
  onSave: (details: ContactDetails) => void
  onBack: () => void
}

type Errors = Partial<Record<keyof ContactDetails | "form", string>>

function validate(values: ContactDetails): Errors {
  const errors: Errors = {}
  if (!values.fullName.trim()) errors.fullName = "Please enter your full name."
  if (!values.email.trim()) {
    errors.email = "Please enter your email address."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address."
  }
  if (!values.mobile.trim()) {
    errors.mobile = "Please enter your mobile number."
  } else if (!/^[+\d][\d\s()-]{7,17}$/.test(values.mobile)) {
    errors.mobile = "Enter a valid mobile number."
  }
  if (!values.purpose) errors.purpose = "Please select a purpose."
  return errors
}

export default function ContactForm({
  initialValues,
  onSave,
  onBack,
}: ContactFormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<Errors>({})
  const [saving, setSaving] = useState(false)

  const update = (field: keyof ContactDetails, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setSaving(true)
    try {
      await saveContactDetails(values)
      onSave(values)
    } catch (error) {
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_60px_rgba(30,41,59,0.08)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput
          label="Full Name"
          name="fullName"
          autoComplete="name"
          value={values.fullName}
          onChange={(event) => update("fullName", event.target.value)}
          error={errors.fullName}
          required
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          error={errors.email}
          required
        />
        <FormInput
          label="Mobile Number"
          name="mobile"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={values.mobile}
          onChange={(event) => update("mobile", event.target.value)}
          error={errors.mobile}
          required
        />
        <FormInput
          kind="select"
          label="Purpose of Contact"
          name="purpose"
          value={values.purpose}
          onChange={(event) => update("purpose", event.target.value)}
          error={errors.purpose}
          required
          options={[
            { value: "", label: "Select a purpose" },
            { value: "consultation", label: "Consultation" },
            { value: "service", label: "Service enquiry" },
            { value: "partnership", label: "Partnership" },
            { value: "other", label: "Other" },
          ]}
        />
        <div className="sm:col-span-2">
          <FormInput
            kind="textarea"
            label="Message"
            name="message"
            placeholder="Tell us how we can help (optional)"
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
          />
        </div>
      </div>

      {errors.form && (
        <div
          role="alert"
          className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.form}
        </div>
      )}

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" loading={saving}>
          Save &amp; Next
          <span aria-hidden="true">→</span>
        </Button>
      </div>
    </form>
  )
}
