import { appConfig } from "../app/config"

export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-slate-200/80 pt-6 text-center text-xs leading-5 text-slate-500">
      <div className="flex flex-col items-center justify-center gap-x-5 gap-y-1 sm:flex-row">
        <a
          className="transition hover:text-[var(--purple)]"
          href={`mailto:${appConfig.footer.email}`}
        >
          {appConfig.footer.email}
        </a>
        <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
          •
        </span>
        <span>{appConfig.footer.address}</span>
      </div>
      <p className="mt-2">{appConfig.footer.copyright}</p>
    </footer>
  )
}
