import { z } from 'zod'

export const VerifyFormSchema = z.object({
  base32: z.string().trim(),
  code: z.string().trim(),
})

export type FormState =
  | {
  errors?: {
    base32?: string[]
    code?: string[]
  }
  message?: string
}
  | undefined