import { verifyEmailConnection } from "./services/email.service.js"
import { app } from "./app.js"
import { connectDatabase } from "./config/database.js"
import { env } from "./config/env.js"

try {
  await connectDatabase()
  app.listen(env.PORT, () => console.log(`KEVAL API listening on port ${env.PORT}`))
} catch (error) {
  console.error("Database connection failed:", error.message)
  process.exit(1)
}

void verifyEmailConnection()
