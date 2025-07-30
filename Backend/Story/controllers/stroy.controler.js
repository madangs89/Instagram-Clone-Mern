import Story from "../models/story.model.js";
import {
  deleteCloudinaryImage,
  uploadToCloudinarySingle,
} from "../utils/cloudinaary.js";
import axios from "axios";

export const createStory = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;
    if (!caption || !req.file || !mediaType) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const storyData = {
      userId: req.user._id,
      mediaUrl: null,
      publicId: null,
      mediaType,
      caption,
      userSnapshot: {
        name: req.user.name,
        userName: req.user.userName,
        avatar: req.user.avatar,
      },
    };

    if (req.file && req.file.path) {
      const result = await uploadToCloudinarySingle(req.file.path);
      if (!result || !result.secure_url || !result.public_id) {
        return res
          .status(500)
          .json({ message: "Failed to upload media", success: false });
      }
      const { secure_url, public_id } = result;
      storyData.mediaUrl = secure_url;
      storyData.publicId = public_id;
    }
    const newStory = await Story.create(storyData);

    if (!newStory) {
      return res
        .status(500)
        .json({ message: "Failed to create story", success: false });
    }
    return res.status(200).json({
      message: "Story created successfully",
      success: true,
      data: newStory,
    });
  } catch (error) {
    console.error("Error creating story:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const getStoriesForUserToSee = async (req, res) => {
  try {
    const userFollowingList = await axios.get(
      `${process.env.USER_BACKEND}/user/details/${req.user._id}`
    );
    if (!userFollowingList || !userFollowingList.data) {
      return res
        .status(404)
        .json({ message: "User following list not found", success: false });
    }

    const following = Array.isArray(userFollowingList.data.following)
      ? userFollowingList.data.following
      : [];

    const stories = await Story.find({
      userId: { $in: [...following, req.user._id] },
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Stories fetched successfully",
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("Error fetching user following list:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const deleteStory = async (req, res) => {
  try {
    const { storyId } = req.params;
    if (!storyId) {
      return res
        .status(400)
        .json({ message: "Story ID is required", success: false });
    }
    const story = await Story.findById(storyId);
    if (!story) {
      return res
        .status(404)
        .json({ message: "Story not found", success: false });
    }
    if (story.userId.toString() != req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this story",
        success: false,
      });
    }
    const publicId = story.publicId;
    const mediaType = story.mediaType;
    await Story.deleteOne({ _id: storyId });

    if (publicId && mediaType) {
      await deleteCloudinaryImage(publicId, mediaType);
    }
    return res.status(200).json({
      message: "Story deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting story:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getStoryById = async (req, res) => {
  try {
    const { storyId } = req.params;
    if (!storyId) {
      return res
        .status(400)
        .json({ message: "Story ID is required", success: false });
    }
    const story = await Story.findById(storyId);
    if (!story) {
      return res
        .status(404)
        .json({ message: "Story not found", success: false });
    }
    return res.status(200).json({
      message: "Story fetched successfully",
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("Error fetching story:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const updateStoryViewers = async (req, res) => {
  try {
    const { storyId } = req.params;
    if (!storyId) {
      return res
        .status(400)
        .json({ message: "Story ID is required", success: false });
    }
    const story = await Story.findById(storyId);
    if (!story) {
      return res
        .status(404)
        .json({ message: "Story not found", success: false });
    }
    if (story.viewers.some((viewer) => viewer.userId == req.user._id)) {
      return res.status(200).json({
        message: "You have already viewed this story",
        success: true,
      });
    }
    story.viewers.push({
      userId: req.user._id,
      userName: req.user.userName,
      avatar: req.user.avatar,
    });
    await story.save();
    return res.status(200).json({
      message: "Story viewers updated successfully",
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("Error updating story viewers:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "All stories fetched successfully",
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("Error fetching all stories:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
export const deleteAllStoriesWithExpiry = async (req, res) => {
  try {
    // 1. Find all expired stories
    const expiredStories = await Story.find({ expiresAt: { $lt: new Date() } });

    // 2. Delete each media from Cloudinary
    for (const story of expiredStories) {
      if (story.publicId && story.mediaType) {
        await deleteCloudinaryImage(story.publicId, story.mediaType);
      }
    }

    // 3. Delete the story documents from MongoDB
    await Story.deleteMany({ _id: { $in: expiredStories.map((s) => s._id) } });

    return res.status(200).json({
      message: "All expired stories and media deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting expired stories:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};
