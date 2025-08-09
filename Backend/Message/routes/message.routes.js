import express from "express";
import {
  addReactions,
  createConversation,
  createMessage,
  getAllConversationAndGroup,
  getAllMessageReaction,
  getAllMessages,
  removeMessageReaction,
} from "../controler/message.controler.js";
import { authMiddleware } from "../middelware/auth.middleware.message.js";

export const messageRouter = express.Router();

messageRouter.get("/all", authMiddleware, getAllConversationAndGroup);
messageRouter.post("/create/message", authMiddleware, createMessage);
messageRouter.post("/add/reactions", authMiddleware, addReactions);
messageRouter.get(
  "/all/reactions/:messageId",
  authMiddleware,
  getAllMessageReaction
);
messageRouter.delete(
  "/delete/reactions",
  authMiddleware,
  removeMessageReaction
);
messageRouter.post("/conversation/create", authMiddleware, createConversation);
messageRouter.get(
  "/all/messages/:conversationId",
  authMiddleware,
  getAllMessages
);
