import express from "express";
import { chat } from "../controllers/bot.controler.js";

const botRouter = express.Router();

botRouter.post("/chat", chat);

export default botRouter;
