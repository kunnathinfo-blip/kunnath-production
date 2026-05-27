// In-memory store for mock OTPs (in production, use Redis or a DB collection with TTL)
interface OtpRecord {
  otp: string;
  expiresAt: number;
}

const otpStore = new Map<string, OtpRecord>();

class OtpService {
  /**
   * Send OTP to a phone number
   */
  async sendOtp(phoneNumber: string): Promise<boolean> {
    // Generate a 6-digit mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry for 5 minutes
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(phoneNumber, { otp, expiresAt });
    
    // Log OTP clearly in the console for development testing
    console.log(`\n========================================`);
    console.log(`[OTP SERVICE] Mock OTP for ${phoneNumber}: ${otp}`);
    console.log(`========================================\n`);
    
    return true;
  }

  /**
   * Verify OTP for a phone number
   */
  async verifyOtp(phoneNumber: string, otp: string): Promise<boolean> {
    // Master bypass OTP for easy testing
    if (otp === '123456') {
      return true;
    }

    const record = otpStore.get(phoneNumber);
    if (!record) {
      return false;
    }

    // Check expiry
    if (Date.now() > record.expiresAt) {
      otpStore.delete(phoneNumber);
      return false;
    }

    const isValid = record.otp === otp;
    if (isValid) {
      // Clear OTP after successful verification to prevent reuse
      otpStore.delete(phoneNumber);
    }
    return isValid;
  }
}

const otpServiceInstance = new OtpService();
export default otpServiceInstance;
