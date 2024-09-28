import express from "express";
import { login, loginFacebook, register } from "../controllers/auth.controller.js";
const authRouter = express.Router();
// register
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/login-face", loginFacebook)
export default authRouter;