import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react"

type CommonProps = {
  label: string
  error?: string
  required?: boolean
}

type FormInputProps = CommonProps & InputHTMLAttributes<HTMLInputElement> & {
  kind?: "input"
} | CommonProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
  kind: "textarea"
} | CommonProps & SelectHTMLAttributes<HTMLSelectElement> & {
  kind: "select"
  options: { value: string label: string }[]
}

const controlClass =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[var(--teal)] focus:ring-4 focus:ring-[rgba(66,165,173,0.12)]"

export default function FormInput(props: FormInputProps) {
  const { label, error, required, id, kind = "input", ...controlProps } = props
  const inputId = id || controlProps.name
  const errorId = error ? `${inputId}-error` : undefined
  const className = `${controlClass} ${
    error ? "border-red-400" : "border-slate-200"
  }`

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-[var(--purple)]">*</span>}
      </label>
      {kind === "textarea" ? (
        <textarea
          {...controlProps as TextareaHTMLAttributes<HTMLTextAreaElement>}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={`${className} min-h-28 resize-y`}
        />
      ) : kind === "select" ? (
        <select
          {...controlProps as SelectHTMLAttributes<HTMLSelectElement>}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={className}
        >
          {(props as Extract<FormInputProps, { kind: "select" }>).options.map(
            (option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ),
          )}
        </select>
      ) : (
        <input
          {...controlProps as InputHTMLAttributes<HTMLInputElement>}
          id={inputId}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          className={className}
        />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
