import express from "express";
import { authMiddleware } from "../middelwares/auth.middelware.js";
import { upload } from "../../Message/utils/cloudinary.js";
import {
  createPost,
  deletePost,
  getAllPostByIdForProfileVisit,
  getAllUnlikedPosts,
  getPostById,
  updatePost,
} from "../controllers/post.controler.js";

const postRouter = express.Router();

postRouter.post("/", authMiddleware, upload.array("media"), createPost);
postRouter.get("/", authMiddleware, getAllUnlikedPosts);
postRouter.get("/get/post/:postId", authMiddleware, getPostById);
postRouter.get("/posts/:id", authMiddleware, getAllPostByIdForProfileVisit);
postRouter.patch("/:postId", authMiddleware, updatePost);
postRouter.delete("/:postId", authMiddleware, deletePost);

export default postRouter;
