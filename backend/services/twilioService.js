const twilio = require('twilio');

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class TwilioService {
  constructor() {
    this.verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber) {
    try {
      // Format phone number to include country code if not present
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const verification = await client.verify.v2
        .services(this.verifyServiceSid)
        .verifications
        .create({
          to: formattedPhone,
          channel: 'sms'
        });

      return {
        success: true,
        status: verification.status,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Twilio send OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
      };
    }
  }

  // Verify OTP
  async verifyOTP(phoneNumber, otpCode) {
    try {
      // Format phone number to include country code if not present
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const verificationCheck = await client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks
        .create({
          to: formattedPhone,
          code: otpCode
        });

      return {
        success: verificationCheck.status === 'approved',
        status: verificationCheck.status,
        message: verificationCheck.status === 'approved' ? 'OTP verified successfully' : 'Invalid OTP'
      };
    } catch (error) {
      console.error('Twilio verify OTP error:', error);
      return {
        success: false,
        message: error.message || 'Failed to verify OTP'
      };
    }
  }

  // Send SMS notification
  async sendSMS(phoneNumber, message) {
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      
      const sms = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
      });

      return {
        success: true,
        messageSid: sms.sid,
        message: 'SMS sent successfully'
      };
    } catch (error) {
      console.error('Twilio send SMS error:', error);
      return {
        success: false,
        message: error.message || 'Failed to send SMS'
      };
    }
  }
}

module.exports = new TwilioService(); 