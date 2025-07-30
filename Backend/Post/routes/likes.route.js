import express from "express";
import {
  getLikesByPost,
  getLikesByUser,
  isPostLiked,
  likePost,
} from "../controllers/likes.controler.js";
import { authMiddleware } from "../middelwares/auth.middelware.js";
const likesRouter = express.Router();

likesRouter.post("/like", authMiddleware, likePost);
// likesRouter.post("/unlike", authMiddleware, unlikePost);
likesRouter.get("/all/:targetId", getLikesByPost);
likesRouter.get("/users/:userId", authMiddleware, getLikesByUser);
likesRouter.get("/isLiked/:targetId", authMiddleware, isPostLiked);
export default likesRouter;
