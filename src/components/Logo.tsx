import { useState } from "react"
import { appConfig } from "../app/config"

type LogoProps = {
  size?: "large" | "small"
}

export default function Logo({ size = "small" }: LogoProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-center text-xs font-medium text-slate-500"
        role="img"
        aria-label="KEVAL logo asset is not configured"
      >
        Original KEVAL logo required
      </div>
    )
  }

  return (
    <div
      className={
        size === "large"
          ? "relative h-28 w-full max-w-sm overflow-hidden sm:h-32"
          : "relative h-12 w-36 overflow-hidden"
      }
    >
      <img
        src={appConfig.logoUrl}
        alt="KEVAL — Your Ascent, Our Priority"
        onError={() => setFailed(true)}
        className="absolute left-1/2 top-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 object-contain"
      />
    </div>
  )
}
