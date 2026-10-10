import { useNavigate } from "react-router"
import Button from "./Button"
import Logo from "./Logo"

type HeaderProps = {
  backTo: string
  backLabel?: string
}

export default function Header({ backTo, backLabel = "Back" }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex w-full items-center justify-between gap-4">
      <Button
        variant="text"
        onClick={() => navigate(backTo)}
        aria-label={backLabel}
        className="-ml-3"
      >
        <span aria-hidden="true">←</span>
        {backLabel}
      </Button>
      <Logo />
    </header>
  )
}
