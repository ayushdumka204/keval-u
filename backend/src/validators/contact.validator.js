import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{7,17}$/, "Enter a valid phone number"),
  website: z.string().max(0).optional(),
}).strict()
