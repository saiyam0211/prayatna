const { cookieOptions } = require("../config");
const { registerUser, loginUser } = require("../services/auth_service");
const wrapAsync = require("../utils/tryCatchWrapper");
const { sendOtp, verifyOtp } = require('../utils/sendOtp');

const register_user = wrapAsync(async(req, res) => {
    const {name, email, password, dob, gender, mobile, admissionNumber} = req.body;
    const {token, newUser} = await registerUser({name, password, dob, gender, mobile, admissionNumber});
    req.user = newUser;
    // Send OTP after successful registration using Twilio Verify
    await sendOtp(mobile);
    res.cookie("accessToken", token, cookieOptions);
    res.status(200).json({message:"register success, OTP sent to mobile"});
});

const login_user = wrapAsync(async(req, res) => {
    let { identifier, email, admissionNumber, password } = req.body;
    // Support both old and new login payloads
    if (!identifier) {
        if (email) {
            identifier = email;
        } else if (admissionNumber !== undefined && admissionNumber !== null && admissionNumber !== "") {
            identifier = admissionNumber;
        } else {
            return res.status(400).json({ message: "Please provide email or admission number as identifier." });
        }
    }
    const { token, user } = await loginUser(identifier, password);
    req.user = user;
    res.cookie("accessToken", token, cookieOptions);
    res.status(200).json({ user, message: "login success" });
});

const logout_user = wrapAsync(async(req, res) => {
    res.clearCookie("accessToken", cookieOptions);
    res.status(200).json({message:"logout success"})
});

const get_current_user = wrapAsync(async(req, res) => {
    res.status(200).json({user:req.user});
});

const send_otp = wrapAsync(async (req, res) => {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile number required' });
    await sendOtp(mobile);
    res.status(200).json({ message: 'OTP sent successfully' });
});

const verify_otp = wrapAsync(async (req, res) => {
    const { mobile, otp } = req.body;
    if (!mobile || !otp) return res.status(400).json({ message: 'Mobile and OTP required' });
    const result = await verifyOtp(mobile, otp);
    if (result.status !== 'approved') {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.status(200).json({ message: 'OTP verified successfully' });
});

module.exports = {
    register_user,
    login_user,
    logout_user,
    get_current_user,
    send_otp,
    verify_otp
}