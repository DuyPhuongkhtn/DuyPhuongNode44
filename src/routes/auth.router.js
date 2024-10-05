import express from "express";
import { extendToken, login, loginAsyncKey, loginFacebook, register, verifyAsyncKey } from "../controllers/auth.controller.js";
const authRouter = express.Router();
// register
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/login-face", loginFacebook);
authRouter.post("/extend-token", extendToken);
authRouter.post("/login-async-key", loginAsyncKey);
authRouter.get("/verify-async-token", verifyAsyncKey);
export default authRouter;