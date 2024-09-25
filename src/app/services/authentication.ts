import OTP from '@/app/lib/otp';

export async function getTwoFactorAuthenticationCode() {
  const secret = OTP.generateSecret();
  const otp = new OTP(secret);
  const otpauthUrl = otp.generateAuthUrl('user', 'issuer');

  return {
    otpauthUrl : otpauthUrl,
    base32: otp.getSecret(),
  };
}

export async function verifyTwoFactorAuthenticationCode(secret: string, code: string) {
  return OTP.verifyCode(secret, code);
}
