import express from "express";
import {
  createUser,
  followUser,
  getAlluser,
  getuser,
  unfollowUser,
  updateUser,
} from "../controllers/user.controler.js";
import { authMiddleware } from "../middleware/auth.middelware.js";
export const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/all", getAlluser);
userRouter.get("/:username/:email", getuser);
userRouter.patch("/:id", updateUser);
userRouter.post("/follow/:id", authMiddleware, followUser);
userRouter.post("/unfollow/:id", authMiddleware, unfollowUser);
