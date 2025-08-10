import Likes from "../models/likes.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import Reel from "../models/reel.model.js";
import Userdetails from "../models/user.model.js";

export const likePost = async (req, res) => {
  try {
    const { targetId, targetType } = req.body;
    const existing = await Likes.findOne({ userId: req.user._id, targetId });
    if (existing) {
      await Likes.findOneAndDelete({ userId: req.user._id, targetId });
      return res
        .status(200)
        .json({ message: "Post unliked", success: true, like: existing });
    }
    const like = new Likes({
      userId: req.user._id,
      targetId,
      targetType,
    });
    await like.save();

    if (targetType == "post" || targetType == "Post") {
      const Data = await Post.findById(targetId);
      if (Data) {
        await Notification.create({
          receiver: Data.userId,
          sender: req.user._id,
          type: "like",
          post: targetId,
          for: "post",
        });
      }
    }
    if (targetType == "reel" || targetType == "Reel") {
      const Data = await Reel.findById(targetId);
      if (Data) {
        await Notification.create({
          receiver: Data.userId,
          sender: req.user._id,
          type: "like",
          reel: targetId,
          for: "reel",
        });
      }
    }

    const data = await Userdetails.findById(req.user._id);
    if (!data) {
      await Userdetails.create({
        _id: req.user._id,
        name: req.user.name,
        userName: req.user.userName,
        avatar: req.user.avatar,
      });
    }
    return res.status(201).json({ success: true, like, message: "Post liked" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error", error: err.message, success: false });
  }
};

export const getLikesByPost = async (req, res) => {
  try {
    const targetId = req.params.targetId;
    const likes = await Likes.find({ targetId }).populate("userId");
    res.json({ count: likes.length, likes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all posts liked by a user
export const getLikesByUser = async (req, res) => {
  try {
    const likes = await Likes.find({ userId: req.params.userId }).populate(
      "targetId"
    );
    res.json({ count: likes.length, likes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const isPostLiked = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.targetId;
    const like = await Likes.findOne({ userId, targetId });
    if (like) {
      return res.status(200).json({ liked: true });
    } else {
      return res.status(200).json({ liked: false });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
