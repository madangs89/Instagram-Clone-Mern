import Post from "../models/post.model.js";

import fs from "fs";

import Userdetails from "../models/user.model.js";

import {
  deleteCloudinaryImage,
  uploadToCloudinarySingle,
} from "../utils/cloudinary.js";
import Likes from "../models/likes.model.js";
export const createPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;

    if (!caption || !mediaType) {
      return res
        .status(400)
        .json({ message: "Missing fields", success: false });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "No media file uploaded", success: false });
    }

    const mediaArray = [];
    for (const file of req.files) {
      const result = await uploadToCloudinarySingle(file.path);
      mediaArray.push({ publicId: result.public_id, url: result.secure_url });
      fs.unlinkSync(file.path);
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
    const newPost = await Post.create({
      userId: req.user._id,
      caption,
      mediaType,
      media: mediaArray,
    });

    return res
      .status(201)
      .json({ success: true, message: "Post created", post: newPost });
  } catch (error) {
    console.error("Create Post Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getAllUnlikedPosts = async (req, res) => {
  try {
    console.log("Getting the requesti");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // Get all liked post IDs by this user
    const likedPosts = await Likes.find({
      userId: req.user._id,
      targetType: "Post",
    }).select("targetId");
    const likedPostIds = likedPosts.map((like) => like.targetId);
    // Fetch ONLY unliked posts from OTHER users (not uploaded by logged-in user)
    const posts = await Post.find({
      _id: { $nin: likedPostIds },
      userId: { $ne: req.user._id }, // exclude user's own posts
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId");
    const postsWithLikeCounts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await Likes.countDocuments({ targetId: post._id });
        return {
          ...post._doc,
          likeCount,
        };
      })
    );
    // Count total unliked posts for pagination, same filter as above
    const totalUnlikedPosts = await Post.countDocuments({
      _id: { $nin: likedPostIds },
      userId: { $ne: req.user._id },
    });

    return res.status(200).json({
      success: true,
      posts: postsWithLikeCounts,
      totalPosts: totalUnlikedPosts,
      currentPage: page,
      totalPages: Math.ceil(totalUnlikedPosts / limit),
    });
  } catch (error) {
    console.error("Get Unliked Posts Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const getAllPostByIdForProfileVisit = async (req, res) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId");
    if (!posts) {
      return res
        .status(404)
        .json({ message: "No posts found", success: false });
    }
    // For each post, count how many likes it has
    const postsWithLikeCounts = await Promise.all(
      posts.map(async (post) => {
        const likeCount = await Likes.countDocuments({ targetId: post._id });
        return {
          ...post._doc,
          likeCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      posts: postsWithLikeCounts,
      totalPosts: posts.length,
    });
  } catch (error) {
    console.error("Profile Visit Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post || post.userId !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }
    const { caption } = req.body;
    if (caption) post.caption = caption;
    await post.save();
    return res
      .status(200)
      .json({ success: true, message: "Post updated", post });
  } catch (error) {
    console.error("Update Post Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    console.log(post.userId, req.user._id, post.userId == req.user._id);

    if (!post || post.userId != req.user._id) {
      return res.status(403).json({ message: "Unauthorized", success: false });
    }

    for (const mediaItem of post.media) {
      await deleteCloudinaryImage(mediaItem.publicId, mediaItem.mediaType);
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Delete Post Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
