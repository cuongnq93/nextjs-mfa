import * as crypto from 'crypto';

class OTP {
  protected secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  public static generateSecret(length: number = 16): string {
    const randomBuffer = crypto.randomBytes(length);
    return this.base32Encode(randomBuffer.toString('hex')).slice(0, length).toUpperCase();
  }

  public generateAuthUrl(user: string, issuer: string): string {
    return `otpauth://totp/${issuer}:${user}?secret=${this.secret}&issuer=${issuer}`;
  }

  public static verifyCode(secret: string, code: string): boolean {
    const generatedCode = this.hOtp(secret);
    return generatedCode === code;
  }

  public getSecret(): string {
    return this.secret;
  }

  private static hOtp(keyBase32: string, timestamp: number = Date.now(), totpPeriodSeconds: number = 30): string {
    const timeCounter = this.decToHex(Math.floor(timestamp / 1000 / totpPeriodSeconds)).padStart(16, '0');
    const decodedKey = this.base32ToHex(keyBase32);

    // get hmac hex
    const hmac = crypto.createHmac('sha1', Buffer.from(decodedKey, 'hex'));
    hmac.update(Buffer.from(timeCounter, 'hex'));
    const hmacHex = hmac.digest('hex');
    const hOtpOffset = (parseInt(hmacHex.slice(-1), 16)) * 2;
    const hOtpCode = (parseInt(hmacHex.slice(hOtpOffset, hOtpOffset + 8), 16) & 0x7fffffff) % 1000000;
    return hOtpCode.toString().padStart(6, '0');
  }

  private static decToHex(s: number): string {
    return (s < 15.5 ? '0' : '') + Math.round(s).toString(16);
  }

  private static base32ToHex(base32: string): string {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";

    for (const char of base32) {
      const val = base32chars.indexOf(char.toUpperCase());
      if (val === -1) {
        throw new Error(`Invalid character found in Base32 string: ${char}`);
      }
      bits += val.toString(2).padStart(5, '0');
    }

    return bits.match(/.{1,4}/g)?.map(chunk => parseInt(chunk, 2).toString(16)).join('') || '';
  }

  private static base32Encode(s: string): string {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = s.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    let base32 = '';

    while (bits.length > 0) {
      const chunk = bits.slice(0, 5);
      bits = bits.slice(5);
      base32 += base32chars[parseInt(chunk, 2)];
    }

    return base32;
  }
}

export default OTP;