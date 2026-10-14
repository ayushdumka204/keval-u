import { z } from "zod"

export const orderSchema = z.object({ contactId: z.string().regex(/^[a-f\d]{24}$/i) }).strict()
export const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().regex(/^[a-f\d]{64}$/i),
}).strict()
