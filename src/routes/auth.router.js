import express from "express";
import {
    register,
    login,
    loginFacebook,
    extendToken,
    loginAsyncKey,
    verifyAccessTokenAsyncKey,
    forgetCheckEmail,
    changePass,
} from "../controllers/auth.controller.js";
const authRouter = express.Router();

// register
authRouter.post("/register", register);
authRouter.post("/login", login); // login bằng khóa đối xứng
authRouter.post("/login-face", loginFacebook);
authRouter.post("/extend-token", extendToken);
authRouter.post("/login-async-key", loginAsyncKey) // login bằng khóa bất đối xứng
authRouter.get("/verify-token-async-key", verifyAccessTokenAsyncKey);
// kiểm tra quên mật khẩu
authRouter.post("/forget-check-email", forgetCheckEmail);
// change pass
authRouter.post("/change-password", changePass)

export default authRouter;