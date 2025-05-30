const express = require("express");
const { register_user, login_user, logout_user, get_current_user, send_otp, verify_otp } = require("../controller/auth_controller");
const authMiddleware = require("../middleware/auth_middleware");


const authRouter = express.Router();

authRouter.post("/register", register_user);
authRouter.post("/login", login_user);
authRouter.post("/logout", logout_user);
authRouter.get("/me", authMiddleware, get_current_user);
authRouter.post("/send-otp", send_otp);
authRouter.post("/verify-otp", verify_otp);

module.exports = authRouter;