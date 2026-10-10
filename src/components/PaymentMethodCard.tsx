import type { ReactNode } from "react"
import type { PaymentMethod } from "../app/types"

type PaymentMethodCardProps = {
  value: PaymentMethod
  selected: boolean
  onSelect: (value: PaymentMethod) => void
  title: string
  description: string
  disabled?: boolean
  badge?: string
  children?: ReactNode
}

export default function PaymentMethodCard({
  value,
  selected,
  onSelect,
  title,
  description,
  disabled = false,
  badge,
  children,
}: PaymentMethodCardProps) {
  return (
    <label
      className={`block rounded-2xl border p-5 transition ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-65"
          : selected
            ? "cursor-pointer border-[var(--teal)] bg-[var(--teal-soft)] shadow-[0_8px_24px_rgba(66,165,173,0.12)]"
            : "cursor-pointer border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="radio"
          name="payment-method"
          value={value}
          checked={selected}
          disabled={disabled}
          onChange={() => onSelect(value)}
          className="mt-1 size-4 accent-[var(--purple)]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-slate-900">{title}</span>
            {badge && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-slate-500">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          {children}
        </div>
      </div>
    </label>
  )
}
