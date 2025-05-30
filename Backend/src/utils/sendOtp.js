const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID } = process.env;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Send OTP using Twilio Verify
async function sendOtp(mobile) {
    return client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID)
        .verifications
        .create({ to: `+91${mobile}`, channel: 'sms' });
}

// Verify OTP using Twilio Verify
async function verifyOtp(mobile, otp) {
    return client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks
        .create({ to: `+91${mobile}`, code: otp });
}

module.exports = { sendOtp, verifyOtp };