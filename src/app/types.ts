export type ContactDetails = {
  fullName: string
  email: string
  mobile: string
  purpose: string
  message: string
}

export type PaymentMethod = "razorpay" | "upi"

export const emptyContactDetails: ContactDetails = {
  fullName: "",
  email: "",
  mobile: "",
  purpose: "",
  message: "",
}
