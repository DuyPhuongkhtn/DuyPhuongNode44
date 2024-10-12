import express from "express";
import { register, login, loginFacebook, extendToken } from "../controllers/auth.controller.js";
const authRouter = express.Router();
// register
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/login-face", loginFacebook);
authRouter.post("/extend-token", extendToken);
export default authRouter;