import express from "express";
import { middlewareTokenAsyncKey } from "../config/jwt.js";
import {
    register,
    login,
    loginFacebook,
    extendToken,
    loginAsyncKey,
    verifyAccessTokenAsyncKey,
    forgotPass,
    changePassword,
    verify2FA,
} from "../controllers/auth.controller.js";
const authRouter = express.Router();

// register
authRouter.post("/register", register);
authRouter.post("/login", login); // login bằng khóa đối xứng
authRouter.post("/login-face", loginFacebook);
authRouter.post("/extend-token", extendToken);
authRouter.post("/login-async-key", loginAsyncKey) // login bằng khóa bất đối xứng
authRouter.get("/verify-token-async-key", verifyAccessTokenAsyncKey);
authRouter.post("/forgot-password", forgotPass) // API quên mật khẩu: gửi code qua mail
authRouter.post("/change-password", changePassword) // API change password
// Xác thực mã 2FA
authRouter.post('/verify-2fa', middlewareTokenAsyncKey, verify2FA);

export default authRouter;