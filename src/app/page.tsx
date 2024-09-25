'use client';

import useSWR from 'swr';
import React from 'react';
import { useFormState } from 'react-dom';
import { verify } from '@/app/actions/auth';
import { SubmitButton } from '@/app/submit-button';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function VerifyForm() {
  const [state, action] = useFormState(verify, undefined);
  const { data, error } = useSWR('/api/auth', fetcher, {
    revalidateOnFocus: false,
  });
  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div className="max-w-[400px] mx-auto rounded-lg shadow-md">
      {/* QR Code */}
      <div className="mb-6">
        <img
          src={data.qrCode}
          alt="QR Code"
          className="w-full h-auto"
        />
      </div>

      {/* Form */}
      <form action={action}>
        <div className="mb-4">
          <label htmlFor="base32" className="block text-sm font-medium text-gray-200">
            Base32
          </label>
          <input
            type="text"
            id="base32"
            name="base32"
            value={data.base32}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            required
            readOnly={true}
          />
        </div>
        {state?.errors?.base32 && (
          <div className="text-red-500">{state.errors.base32.join(', ')}</div>
        )}

        <div className="mb-4">
          <label htmlFor="code" className="block text-sm font-medium text-gray-200">
            Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            required
          />
        </div>
        {state?.errors?.code && (
          <div className="text-red-500">{state.errors.code.join(', ')}</div>
        )}

        {state?.message && (
          <div className="text-green-500">{state.message}</div>
        )}
        <SubmitButton />
      </form>
    </div>
  );
}