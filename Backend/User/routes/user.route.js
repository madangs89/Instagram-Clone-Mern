import express from "express";
import {
  createUser,
  followUser,
  getAllFollowerAndFollowing,
  getAlluser,
  getSugestedusers,
  gettingArrayOfUsers,
  gettingUsersInArray,
  getuser,
  getUserById,
  getUsersNotInArray,
  searchQueryForUser,
  unfollowUser,
  updateUser,
} from "../controllers/user.controler.js";
import { upload } from "../utils/cloudinary.js";
export const userRouter = express.Router();
import { authMiddleware } from "../middleware/auth.middelware.js";

userRouter.post("/", createUser);
userRouter.get("/details/:id", getUserById);
userRouter.get("/all", authMiddleware, getAlluser);
userRouter.get("/:username/:email", getuser);
userRouter.patch("/", authMiddleware, upload.single("avatar"), updateUser);
userRouter.post("/follow/:id", authMiddleware, followUser);
userRouter.post("/unfollow/:id", authMiddleware, unfollowUser);
userRouter.get("/get/not-array/users", authMiddleware, getUsersNotInArray); 
userRouter.get("/get/in-array/users", authMiddleware, gettingUsersInArray); 
userRouter.get("/sugested/users/data", authMiddleware, getSugestedusers);
userRouter.get("/get/array/users", gettingArrayOfUsers);
userRouter.get("/get/search/users/data", authMiddleware, searchQueryForUser);
userRouter.get("/get/user/data/followers/following/:id", authMiddleware, getAllFollowerAndFollowing);
