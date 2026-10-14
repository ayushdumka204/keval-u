export function notFound(_req, res) {
  res.status(404).json({ message: "Not found" })
}

export function errorHandler(error, _req, res, _next) {
  const duplicate = error?.code === 11000
  const status = error.status || (error.name === "ZodError" || duplicate ? 400 : 500)
  if (status >= 500) console.error("Request failed:", error.name, error.message)
  const message = duplicate ? "A conflicting record already exists." : error.message
  res.status(status).json({ message: status >= 500 ? "An unexpected error occurred." : message })
}
