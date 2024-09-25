'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className={`w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm ${
        pending ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      disabled={pending}
    >
      {pending ? 'Verifying...' : 'Verify'}
    </button>
  )
}