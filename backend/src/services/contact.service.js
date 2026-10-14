import { Contact } from "../models/Contact.js"
import { sendContactNotification } from "./email.service.js"

export async function createContact(input) {
  const contact = await Contact.create(input)
  sendContactNotification(contact).catch((error) => console.error("Contact email delivery failed:", error.message))
  return contact
}
