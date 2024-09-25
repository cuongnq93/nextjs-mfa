'use server';

import { FormState, VerifyFormSchema } from '@/app/lib/definitions';
import { verifyTwoFactorAuthenticationCode } from '@/app/services/authentication';


export async function verify(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = VerifyFormSchema.safeParse({
    base32: formData.get('base32'),
    code: formData.get('code'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { base32, code } = validatedFields.data
  // Call the provider or db to create a user...
  const verified = await verifyTwoFactorAuthenticationCode(base32, code);
  if (!verified) {
    return {
      errors: {
        code: ['Invalid code'],
      }
    }
  }

  return {
    message: 'Code verified',
  }
}
