import express from "express";
import {
  createConversation,
  createMessage,
  getAllConversationAndGroup,
  getAllMessages,
} from "../controler/message.controler.js";
import { authMiddleware } from "../middelware/auth.middleware.message.js";

export const messageRouter = express.Router();

messageRouter.get("/all", authMiddleware, getAllConversationAndGroup);
messageRouter.post("/create/message", authMiddleware, createMessage);
messageRouter.post("/conversation/create", authMiddleware, createConversation);
messageRouter.get(
  "/all/messages/:conversationId",
  authMiddleware,
  getAllMessages
);
