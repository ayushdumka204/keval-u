import type { Contact, PaymentStatus } from "../types"
const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!base) throw new Error("Online booking is not configured yet. Please contact KEVAL.")
  let response: Response
  try {
    response = await fetch(`${base}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } })
  } catch {
    throw new Error("The service is currently unavailable. Please try again shortly.")
  }
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.message || "Something went wrong. Please try again.")
  return body
}
export const api = {
  contact: (input: Omit<Contact, "id"> & { website: string }) =>
    request<{ contact: Contact }>("/api/contacts", { method: "POST", body: JSON.stringify(input) }),
  order: (contactId: string) =>
    request<{ orderId: string; amount: number; currency: string; keyId: string }>("/api/payment/create-order", {
      method: "POST",
      body: JSON.stringify({ contactId }),
    }),
  verify: (payload: Record<string, string>) => request<{ status: PaymentStatus; paymentReference?: string }>("/api/payment/verify", { method: "POST", body: JSON.stringify(payload) }),
  status: (orderId: string) => request<{ status: PaymentStatus; paymentReference?: string }>(`/api/payment/status/${encodeURIComponent(orderId)}`),
}
