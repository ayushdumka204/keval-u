export function escapeCsv(value) {
  let text = String(value ?? "").replace(/\r?\n/g, " ")
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}
