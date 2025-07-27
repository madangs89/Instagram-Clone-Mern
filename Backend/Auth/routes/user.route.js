import express from "express";
import { isAuth, login, logout, register } from "../controllers/auth.controler.js";
import { authMiddleware } from "../middelwares/auth.middelware.js";

export const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/logout", logout);
authRouter.get("/isAuth",authMiddleware ,isAuth);
