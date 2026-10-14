import { contactSchema } from "../validators/contact.validator.js"
import { createContact } from "../services/contact.service.js"

export async function postContact(req, res) {
  const contact = await createContact(contactSchema.parse(req.body))
  res.status(201).json({ contact: { id: contact.id, name: contact.name, email: contact.email, phone: contact.phone } })
}
