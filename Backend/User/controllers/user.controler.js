import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  deleteCloudinaryImage,
  uploadToCloudinarySingle,
} from "../utils/cloudinary.js";
import fs from "fs";
export const createUser = async (req, res) => {
  try {
    const { userName, password, avatar, email, name } = req.body;
    if (!userName || !password || !email) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      password: hashedPassword,
      avatar,
      email,
      name,
    });
    if (user) {
      return res
        .status(201)
        .json({ message: "User created successfully", success: true, user });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
export const getuser = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ userName: req.params.username }, { email: req.params.email }],
    });
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", success: true, user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
export const updateUser = async (req, res) => {
  try {
    const updateData = { ...(req.body || {}) };
    // Find the user first to get the old avatar's publicId
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // If file uploaded, upload to Cloudinary
    if (req.file) {
      try {
        // Upload to cloudinary
        const cloudinaryResult = await uploadToCloudinarySingle(req.file.path);

        // Delete local file
        fs.unlinkSync(req.file.path);

        // Delete old avatar from Cloudinary if exists
        if (user.publicId) {
          await deleteCloudinaryImage(user.publicId);
        }

        // Update avatar and publicId
        updateData.avatar = cloudinaryResult.secure_url;
        updateData.publicId = cloudinaryResult.public_id;
      } catch (error) {
        return res.status(500).json({
          message: "Failed to upload avatar",
          success: false,
        });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });
    return res.status(200).json({
      message: "User updated",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const followUser = async (req, res) => {
  try {
    console.log(req.params.id, req.user._id);

    const follwingId = req.params.id;
    const followerId = req.user._id;
    if (followerId === follwingId) {
      return res
        .status(400)
        .json({ message: "You cannot follow yourself", success: false });
    }
    const followingUser = await User.findById(follwingId);
    const followerUser = await User.findById(followerId);
    if (!followingUser || !followerUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if (
      followingUser.followers.includes(followerId) &&
      followerUser.following.includes(follwingId)
    ) {
      return res.status(400).json({
        message: "You are already following this user",
        success: false,
      });
    }
    if (!followingUser.followers.includes(followerId)) {
      followingUser.followers.push(followerId);
    }
    if (!followerUser.following.includes(follwingId)) {
      followerUser.following.push(follwingId);
    }
    await followingUser.save();
    await followerUser.save();
    return res.status(200).json({ message: "User followed", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const getAlluser = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res
        .status(404)
        .json({ message: "Users not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Users fetched successfully", success: true, users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};
export const unfollowUser = async (req, res) => {
  try {
    const followingId = req.params.id;
    const followerId = req.user._id;

    if (followerId === followingId) {
      return res
        .status(400)
        .json({ message: "You cannot unfollow yourself", success: false });
    }
    const [followingUser, followerUser] = await Promise.all([
      User.findById(followingId),
      User.findById(followerId),
    ]);
    if (!followingUser || !followerUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    if (
      !followingUser.followers.includes(followerId) ||
      !followerUser.following.includes(followingId)
    ) {
      return res.status(400).json({
        message: "You are not following this user",
        success: false,
      });
    }

    // Filter out the IDs from arrays
    followingUser.followers = followingUser.followers.filter(
      (id) => id.toString() !== followerId.toString()
    );
    followerUser.following = followerUser.following.filter(
      (id) => id.toString() !== followingId.toString()
    );

    await Promise.all([followingUser.save(), followerUser.save()]);

    return res.status(200).json({ message: "User unfollowed", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v ");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "User fetched successfully", success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
