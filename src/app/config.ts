export const appConfig = {
  logoUrl: import.meta.env.VITE_KEVAL_LOGO_URL || "/keval-logo.png",
  contactEndpoint: import.meta.env.VITE_CONTACT_ENDPOINT || "",
  paymentApiBase: import.meta.env.VITE_PAYMENT_API_BASE || "/api/payments",
  serviceDescription:
    import.meta.env.VITE_SERVICE_DESCRIPTION || "Professional consultation",
  amountInPaise: Number(import.meta.env.VITE_PAYMENT_AMOUNT_PAISE || 250000),
  currency: "INR",
  upiId: import.meta.env.VITE_UPI_ID || "",
  upiQrUrl: import.meta.env.VITE_UPI_QR_URL || "",
  footer: {
    email: import.meta.env.VITE_CONTACT_EMAIL || "hello@keval.example",
    address: import.meta.env.VITE_CONTACT_ADDRESS || "Your business address",
    copyright:
      import.meta.env.VITE_COPYRIGHT ||
      `© ${new Date().getFullYear()} KEVAL. All rights reserved.`,
  },
}
