import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  deleteCloudinaryImage,
  uploadToCloudinarySingle,
} from "../utils/cloudinary.js";
import fs from "fs";
import mongoose from "mongoose";
import axios from "axios";
const api = axios.create({
  baseURL: `${process.env.POST_BACKEND}`,
  withCredentials: true,
});
export const createUser = async (req, res) => {
  try {
    const {
      userName,
      password,
      avatar,
      email,
      name,
      publicKey,
      encryptedPrivateKey,
    } = req.body;
    if (!userName || !password || !email) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    console.log(publicKey, encryptedPrivateKey);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName,
      password: hashedPassword,
      avatar,
      publicKey,
      encryptedPrivateKey,
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
    console.log("getting the request for login");

    const user = await User.findOne({
      $or: [{ userName: req.params.username }, { email: req.params.email }],
    }).select("-__v -encryptedPrivateKey");
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    }
    console.log(user);

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
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    const notification = await api.post(
      `/notification`,
      {
        sender: followerId,
        receiver: follwingId,
        type: "follow",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
    console.log("user fecthed successfully", user);

    return res
      .status(200)
      .json({ message: "User fetched successfully", success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getSugestedusers = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    // getting the curr3ct user follwing id
    const followingIds = user.following.map((following) =>
      following.toString()
    );

    const frinedsFollwingList = await User.find({
      _id: { $in: followingIds },
    }).select("following");

    let suggestionsSet = new Set();
    frinedsFollwingList.forEach((friend) => {
      friend.following.forEach((id) => {
        const idStr = id.toString();
        if (idStr !== userId.toString() && !followingIds.includes(idStr)) {
          suggestionsSet.add(idStr);
        }
      });
    });
    const suggestedId = Array.from(suggestionsSet);
    const sugesteduser = await User.find({ _id: { $in: suggestedId } }).select(
      "-__v -password"
    );

    const finalResutl = [...sugesteduser];
    if (sugesteduser.length < 10) {
      const notFollwingUSerrByFreidsAndOwn = await User.find({
        _id: { $nin: [...suggestedId, ...followingIds, userId] },
      })
        .limit(10 - sugesteduser.length)
        .select("-__v -password");
      finalResutl.push(...notFollwingUSerrByFreidsAndOwn);
    }

    console.log("finalResutl", finalResutl);

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      suggestedUsers: finalResutl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const gettingArrayOfUsers = async (req, res) => {
  try {
    let { userIdsArray } = req.query;

    // Handle if sent as a single ID (e.g., string not array)
    if (!userIdsArray) {
      return res.status(400).json({
        message: "Bad request: userIdsArray is required",
        success: false,
      });
    }

    // If only one ID is sent, it comes as a string — convert to array
    if (!Array.isArray(userIdsArray)) {
      userIdsArray = [userIdsArray];
    }

    if (userIdsArray.length === 0) {
      return res.status(400).json({
        message: "Bad request: userIdsArray is empty",
        success: false,
      });
    }
    const users = await User.find({ _id: { $in: userIdsArray } }).select(
      "-__v -password"
    );
    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
export const getUsersNotInArray = async (req, res) => {
  try {
    let { userIdsArray } = req.query;
    console.log("userIdsArray", userIdsArray);
    console.log(req.query, "req.query");

    const userId = req.user._id;
    if (!userIdsArray) {
      userIdsArray = [];
    } else if (!Array.isArray(userIdsArray)) {
      const data = userIdsArray.split(",");
      userIdsArray = [...data];
    }
    console.log("gettin the request for users not in array");

    console.log("userIdsArray", userIdsArray);
    if (!userIdsArray) {
      return res.status(400).json({
        message: "Bad request: userIdsArray is required",
        success: false,
      });
    }
    // Convert string to array if necessary
    if (typeof userIdsArray === "string") {
      userIdsArray = [userIdsArray];
    }

    // Convert string IDs to ObjectId
    userIdsArray = userIdsArray.map((id) => new mongoose.Types.ObjectId(id));

    const users = await User.find({
      _id: { $nin: [...userIdsArray, userId] },
    }).select("userName name avatar");

    // Format result to include only required fields
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      userName: user.userName,
      name: user.name,
      avatar: user.avatar,
    }));

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
export const gettingUsersInArray = async (req, res) => {
  try {
    let { userIdsArray } = req.query;
    console.log("userIdsArray", userIdsArray);
    console.log(req.query, "req.query");

    const userId = req.user._id;
    if (!userIdsArray) {
      userIdsArray = [];
    } else if (!Array.isArray(userIdsArray)) {
      const data = userIdsArray.split(",");
      userIdsArray = [...data];
    }
    console.log("gettin the request for users not in array");

    console.log("userIdsArray", userIdsArray);
    if (!userIdsArray) {
      return res.status(400).json({
        message: "Bad request: userIdsArray is required",
        success: false,
      });
    }
    // Convert string to array if necessary
    if (typeof userIdsArray === "string") {
      userIdsArray = [userIdsArray];
    }

    // Convert string IDs to ObjectId
    userIdsArray = userIdsArray.map((id) => new mongoose.Types.ObjectId(id));

    const users = await User.find({
      _id: { $in: [...userIdsArray] },
    }).select("userName name avatar");

    // Format result to include only required fields
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      userName: user.userName,
      name: user.name,
      avatar: user.avatar,
    }));

    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const searchQueryForUser = async (req, res) => {
  try {
    const { userName } = req.query;
    const userId = req.user._id;
    const users = await User.find({
      $or: [
        { userName: { $regex: userName, $options: "i" } },
        { name: { $regex: userName, $options: "i" } },
      ],
      _id: { $ne: userId },
    }).select("-__v -password");
    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      users: [...users],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAllFollowerAndFollowing = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .select("-__v -password")
      .populate({
        path: "followers",
        select: "-__v -password",
        options: { sort: { _id: -1 } },
      })
      .populate({
        path: "following",
        select: "-__v -password",
        options: { sort: { _id: -1 } },
      });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
