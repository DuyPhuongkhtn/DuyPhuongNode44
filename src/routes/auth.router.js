import express from "express";
import { register, login } from "../controllers/auth.controller.js";
const authRouter = express.Router();
// register
authRouter.post("/register", register);
authRouter.post("/login", login);
export default authRouter;