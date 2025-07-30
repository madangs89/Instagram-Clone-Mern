import express from "express";
import {
  createStory,
  deleteAllStoriesWithExpiry,
  deleteStory,
  getAllStories,
  getStoriesForUserToSee,
  getStoryById,
  updateStoryViewers,
} from "../controllers/stroy.controler.js";
import { authMiddleware } from "../middelwares/auth.middelware.js";
import { upload } from "../utils/cloudinaary.js";

export const storyRouter = express.Router();

storyRouter.get("/", authMiddleware, getStoriesForUserToSee);
storyRouter.get("/:storyId", getStoryById);
storyRouter.get("/stories/all", getAllStories);
storyRouter.patch("/update/:storyId", authMiddleware, updateStoryViewers);
storyRouter.post(
  "/create",
  upload.single("media"),
  authMiddleware,
  createStory
);

storyRouter.delete("/:storyId", authMiddleware, deleteStory);
storyRouter.delete("/delete/many", deleteAllStoriesWithExpiry);
