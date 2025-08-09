import express from "express";
import { authMiddleware } from "../middelwares/auth.middelware.js";
import {
  addComment,
  deleteComment,
  getAllComments,
} from "../controllers/comment.controler.js";
// assuming you have auth middleware

const commentRouter = express.Router();

commentRouter.post("/", authMiddleware, addComment);

commentRouter.get("/:mediaId", getAllComments);

commentRouter.delete("/:commentId", authMiddleware, deleteComment);

export default commentRouter;
