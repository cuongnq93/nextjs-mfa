import { verifyTwoFactorAuthenticationCode } from '@/app/services/authentication';

export const revalidate = 0;

export async function POST({ body }: { body: { base32: string; code: string } }) {
  return Response.json({
    verified: verifyTwoFactorAuthenticationCode(body.base32, body.code),
  });
}
