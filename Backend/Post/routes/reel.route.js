import express from "express";
import { authMiddleware } from "../middelwares/auth.middelware.js";
import { upload } from "../../Message/utils/cloudinary.js";
import {
  createReel,
  deleteReel,
  getAllReel,
  getAllReelsByIdForProfileVisit,
  getReelById,
  gettingAllUnSeenReels,
  updateReel,
} from "../controllers/reel.controller.js";
import { createView } from "../controllers/views.contrler.js";

const reelRouter = express.Router();
reelRouter.post("/", authMiddleware, upload.single("reel"), createReel);
reelRouter.post("/view/create", authMiddleware, createView);
reelRouter.get("/", authMiddleware, gettingAllUnSeenReels);
reelRouter.get("/all", getAllReel);
reelRouter.get("/get/reel/:reelId", getReelById);
reelRouter.get("/reels/:userId", getAllReelsByIdForProfileVisit);
reelRouter.patch("/:reelId", authMiddleware, updateReel);
reelRouter.delete("/:reelId", authMiddleware, deleteReel);
export default reelRouter;
