import * as QRCode from 'qrcode';
import { getTwoFactorAuthenticationCode } from '@/app/services/authentication';

export const revalidate = 0;

export async function GET() {
  const authCode = await getTwoFactorAuthenticationCode();
  const qrCode = await QRCode.toDataURL(authCode.otpauthUrl as string);

  return Response.json({
    qrCode,
    base32: authCode.base32,
  });
}
