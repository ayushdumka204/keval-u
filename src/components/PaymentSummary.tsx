import { appConfig } from "../app/config"

export default function PaymentSummary({
  customerName,
}: {
  customerName: string
}) {
  const amount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: appConfig.currency,
    maximumFractionDigits: 2,
  }).format(appConfig.amountInPaise / 100)

  return (
    <section
      aria-label="Payment summary"
      className="rounded-2xl bg-[var(--purple)] p-5 text-white shadow-[0_16px_42px_rgba(72,36,154,0.2)] sm:p-6"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
        Payment summary
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-sm text-white/70">For</p>
          <p className="mt-1 font-semibold">{customerName}</p>
          <p className="mt-3 text-sm text-white/70">
            {appConfig.serviceDescription}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-white/70">Total</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{amount}</p>
        </div>
      </div>
    </section>
  )
}
