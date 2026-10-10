import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: "primary" | "secondary" | "text"
  loading?: boolean
  fullWidth?: boolean
}

const variants = {
  primary:
    "bg-[var(--purple)] text-white shadow-[0_10px_28px_rgba(72,36,154,0.2)] hover:-translate-y-0.5 hover:bg-[var(--purple-dark)] focus-visible:ring-[var(--purple)]",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-slate-400",
  text: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400",
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-55 ${variants[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {loading ? "Please wait" : children}
    </button>
  )
}
