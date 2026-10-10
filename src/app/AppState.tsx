import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { emptyContactDetails, type ContactDetails } from "./types"

type AppStateValue = {
  contact: ContactDetails
  setContact: (details: ContactDetails) => void
}

const STORAGE_KEY = "keval-contact-details"
const AppStateContext = createContext<AppStateValue | null>(null)

function readStoredContact() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored
      ? { ...emptyContactDetails, ...JSON.parse(stored) } as ContactDetails
      : emptyContactDetails
  } catch {
    return emptyContactDetails
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [contact, setContact] = useState<ContactDetails>(readStoredContact)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contact))
  }, [contact])

  const value = useMemo(() => ({ contact, setContact }), [contact])

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const value = useContext(AppStateContext)
  if (!value) {
    throw new Error("useAppState must be used within AppStateProvider")
  }
  return value
}
