import { uploadToCloudinarySingle } from "../utils/cloudinary.js";
import fs from "fs";
import { deleteCloudinaryImage } from "../utils/cloudinary.js";
import Userdetails from "../models/user.model.js";
import Likes from "../models/likes.model.js";
import Reel from "../models/reel.model.js";
import Views from "../models/views.model.js";
export const createReel = async (req, res) => {
  try {
    const { caption } = req.body;
    if (!caption) {
      return res
        .status(400)
        .json({ message: "Missing fields", success: false });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "No media file uploaded", success: false });
    }

    const result = await uploadToCloudinarySingle(req.file.path);
    const publicId = result.public_id;
    const media = result.secure_url;
    fs.unlinkSync(req.file.path);
    const data = await Userdetails.findById(req.user._id);
    if (!data) {
      await Userdetails.create({
        _id: req.user._id,
        name: req.user.name,
        userName: req.user.userName,
        avatar: req.user.avatar,
      });
    }
    const newPost = await Reel.create({
      userId: req.user._id,
      caption,
      media,
      publicId,
    });
    return res
      .status(201)
      .json({ success: true, message: "Reel created", post: newPost });
  } catch (error) {
    console.error("Create Reel Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const gettingAllUnSeenReels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Get all liked post IDs by this user
    const veiwedReels = await Views.find({ userId: req.user._id }).select(
      "reelId"
    );

    const viewedReelIds = veiwedReels.map((view) => view.reelId);
    // Fetch ONLY unliked posts from OTHER users (not uploaded by logged-in user)
    const reels = await Reel.find({
      _id: { $nin: viewedReelIds },
      userId: { $ne: req.user._id },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId");
    const reelsWithLikeCounts = await Promise.all(
      reels.map(async (reel) => {
        const likeCount = await Likes.countDocuments({ targetId: reel._id });
        const viewCount = await Views.countDocuments({ reelId: reel._id });
        return {
          ...reel._doc,
          likeCount,
          viewCount,
        };
      })
    );
    // Count total unliked posts for pagination, same filter as above
    const totalUnlikedReels = await Reel.countDocuments({
      _id: { $nin: viewedReelIds },
      userId: { $ne: req.user._id },
    });

    return res.status(200).json({
      success: true,
      reels: reelsWithLikeCounts,
      totalReels: totalUnlikedReels,
      currentPage: page,
      totalPages: Math.ceil(totalUnlikedReels / limit),
    });
  } catch (error) {
    console.error("Get Unliked Reels Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllReelsByIdForProfileVisit = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reels = await Reel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId");
    if (!reels) {
      return res
        .status(404)
        .json({ message: "No reels found", success: false });
    }
    // For each reel, count how many likes it has
    const reelsWithLikeCounts = await Promise.all(
      reels.map(async (reel) => {
        const likeCount = await Likes.countDocuments({ targetId: reel._id });
        return {
          ...reel._doc,
          likeCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      reels: reelsWithLikeCounts,
      totalReels: reels.length,
    });
  } catch (error) {
    console.error("Profile Visit Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const updateReel = async (req, res) => {
  try {
    const { reelId } = req.params;
    const reel = await Reel.findById(reelId);
    if (!reel || reel.userId != req.user._id) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }
    const { caption } = req.body;
    if (caption) reel.caption = caption;
    await reel.save();
    return res
      .status(200)
      .json({ success: true, message: "Reel updated", reel });
  } catch (error) {
    console.error("Update Reel Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const deleteReel = async (req, res) => {
  try {
    const { reelId } = req.params;
    const reel = await Reel.findById(reelId);

    if (!reel || reel.userId != req.user._id) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    await deleteCloudinaryImage(reel.publicId);

    await Reel.findByIdAndDelete(reelId);

    return res.status(200).json({ success: true, message: "Reel deleted" });
  } catch (error) {
    console.error("Delete Reel Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getAllReel = async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 }).populate("userId");
    return res.status(200).json({ success: true, reels });
  } catch (error) {
    console.error("Get All Reels Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
