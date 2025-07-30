import express from "express";
import {
  createUser,
  followUser,
  getAlluser,
  getuser,
  getUserById,
  unfollowUser,
  updateUser,
} from "../controllers/user.controler.js";
import { authMiddleware } from "../middleware/auth.middelware.js";
import { upload } from "../utils/cloudinary.js";
export const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.get("/details/:id", getUserById);
userRouter.get("/all", getAlluser);
userRouter.get("/:username/:email", getuser);
userRouter.patch("/", authMiddleware, upload.single("avatar"), updateUser);
userRouter.post("/follow/:id", authMiddleware, followUser);
userRouter.post("/unfollow/:id", authMiddleware, unfollowUser);
