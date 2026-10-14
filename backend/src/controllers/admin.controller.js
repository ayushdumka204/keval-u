import { Contact } from "../models/Contact.js"
import { escapeCsv } from "../utils/csv.js"

export async function exportContacts(req, res) {
  const contacts = await Contact.find().sort({ createdAt: -1 }).lean()
  const rows = [["id", "name", "email", "phone", "createdAt"], ...contacts.map((item) => [item._id, item.name, item.email, item.phone, item.createdAt])]
  res.set({
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="keval-contacts.csv"',
    "Cache-Control": "no-store",
  })
  res.send(`\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`)
}
