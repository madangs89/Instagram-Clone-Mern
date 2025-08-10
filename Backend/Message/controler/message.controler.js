import Conversation from "../models/Conversation.model.js";
import Message from "../models/Message.js";
import { uploadToCloudinarySingle } from "../utils/cloudinary.js";

import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.USER_BACKEND}`,
  withCredentials: true,
});

export const createMessage = async (req, res) => {
  try {
    const { conversationId, text, media, status } = req.body;
    const sender = req.user._id;
    if (!conversationId || !sender)
      return res
        .status(400)
        .json({ message: "Missing fields", success: false });
    if (!text && !media)
      return res
        .status(400)
        .json({ message: "Media Or Text is required", success: false });
    status.forEach((item) => {
      if (item.state == "sending") {
        item.state = "sent";
      }
    });
    const messageData = await Message.create({
      conversationId,
      sender,
      text,
      media,
      status,
    });
    let conversation = await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text ? text : "A message has been sent",
      lastMessageTime: new Date(),
    });
    await conversation.save();
    if (!messageData)
      return res
        .status(500)
        .json({ message: "Problem creating message", success: false });
    return res
      .status(201)
      .json({ message: "Message created", success: true, messageData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });

    if (!messages || messages.length === 0)
      return res
        .status(200)
        .json({ message: "Messages not found", success: true, messages });
    return res
      .status(200)
      .json({ message: "Messages fetched", success: true, messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllConversationAndGroup = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    }).sort({ updatedAt: -1 });
    let data = [];
    for (const conversation of conversations) {
      if (conversation.isGroup == true) {
        data.push({
          conversationId: conversation._id,
          isGroup: true,
          groupName: conversation.groupName,
          groupAvatar: conversation.groupAvatar,
          members: conversation.members,
          lastMessage: conversation.lastMessage,
          lastMessageTime: conversation.lastMessageTime,
          unreadCount: conversation.unreadCount,
        });
      } else {
        // 1-to-1 chat: fetch the other user's data
        const otherMember = conversation.members.find(
          (member) => member != userId
        );
        if (otherMember) {
          const userDataRes = await api.get(`/user/details/${otherMember}`);
          // console.log(userDataRes, "userDataRes");
          const userData = userDataRes.data.user;
          data.push({
            isGroup: false,
            userId: userData._id,
            unreadCount: conversation.unreadCount,
            name: userData.name,
            userName: userData.userName,
            avatar: userData.avatar,
            conversationId: conversation._id,
            lastMessage: conversation.lastMessage,
            lastMessageTime: conversation.lastMessageTime,
          });
        }
      }
    }
    if (data.length < 10) {
      const existingUserIds = data
        .filter((d) => !d.isGroup && d.userId)
        .map((d) => d.userId);
      const userFollowers = await api.get(`/user/details/${userId}`);

      const filteredFollowers = userFollowers.data.user.following.filter(
        (f) => !existingUserIds.includes(f) // keep only users NOT in existingUserIds
      );
      const token =
        req.cookies?.token || req.headers.authorization?.split(" ")[1];

      const remainingUsersRes = await api.get("/user/get/in-array/users", {
        params: {
          userIdsArray: filteredFollowers,
        },
        paramsSerializer: (params) => {
          return new URLSearchParams(params).toString();
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      data = [...data, ...remainingUsersRes.data.users];
    }

    return res.status(200).json({
      message: "Conversations fetched",
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getAllConversationAndGroup:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
export const createConversation = async (req, res) => {
  try {
    let { members } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(members) || typeof userIdsArray === "string") {
      members = [members];
    }
    if (!members || members.length == 0 || !Array.isArray(members))
      return res.status(400).json({ message: "Missing fields" });

    const conversation = await Conversation.create({
      members: [userId, ...members],
    });
    return res.status(200).json({
      message: "Conversation created",
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error in createConversation:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};
export const addReactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { emoji, messageId } = req.body;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    const alreadyThere = message.reactions.some((id) => id.userId == userId);
    if (alreadyThere) {
      message.reactions.forEach((data) => {
        if (data.userId == userId) {
          data.emoji = emoji;
        }
      });
    } else {
      message.reactions.push({ userId, emoji });
    }
    await message.save();
    return res.status(200).json({ message: "Reaction added", success: true });
  } catch (error) {
    console.error("Error in addReactions:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getAllMessageReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user;
    const message = await Message.findById(messageId);
    if (!message)
      return res
        .status(404)
        .json({ message: "Message not found", success: false });

    const responseReaction = [];
    const reactions = message.reactions;
    if (reactions && reactions.length != 0) {
      for (let react of reactions) {
        if (react.userId == userId._id) {
          responseReaction.unshift({
            emoji: react.emoji,
            userId: react.userId,
            name: userId.name,
            userName: userId.userName,
            avatar: userId.avatar,
          });
        } else {
          const userDataRes = await api.get(`/user/details/${react.userId}`);
          const userData = userDataRes.data.user;
          responseReaction.unshift({
            emoji: react.emoji,
            userId: react.userId,
            name: userData.name,
            userName: userData.userName,
            avatar: userData.avatar,
          });
        }
      }
    }
    return res.status(200).json({
      message: "Reactions fetched",
      success: true,
      data: responseReaction,
    });
  } catch (error) {
    console.error("Error in addReactions:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const removeMessageReaction = async (req, res) => {
  try {
    const { messageId, user } = req.body;
    const userId = req.user._id;
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    if (user != userId)
      return res
        .status(401)
        .json({ message: "You Are Not Authorized To Delete the reaction" });

    message.reactions = message.reactions.filter(
      (reaction) => reaction.userId != userId
    );
    await message.save();
    return res.status(200).json({
      message: "Reaction deleted",
      success: true,
      data: { messageId, userId },
    });
  } catch (error) {
    console.error("Error in addReactions:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

export const getConversationByUserIds = async (req, res) => {
  try {
    const userId = req.user._id;
    const { otherUserId, isGroup } = req.body;
    const conversation = await Conversation.find({
      members: {
        $all: [userId, ...otherUserId],
      },
      isGroup,
    });
    console.log(conversation, "conversation");

    if (!conversation || conversation.length == 0) {
      const newConversation = await Conversation.create({
        members: [userId, ...otherUserId],
        isGroup,
      });
      console.log(newConversation, "newConversation");
      return res.status(200).json({
        message: "Fetched conversation",
        success: true,
        conversation: newConversation,
      });
    }

    return res.status(200).json({
      message: "Fetched conversation",
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Error in getConverationByUserIds:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
      error: error.message,
    });
  }
};

//not handled

export const deleteMessage = async (req, res) => {
  try {
    const { messageId, conversationId } = req.params;
    const senderId = req.user._id;
    // 1. Find message
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    // 2. Ensure only sender can delete
    if (message.sender.toString() !== senderId.toString())
      return res.status(401).json({ message: "Unauthorized" });

    // 3. Soft delete the message
    message.isDeleted = true;
    await message.save();

    // 4. Update conversation last message ONLY if this was the last message
    const conversation = await Conversation.findById(conversationId);
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    const lastMsg = await Message.findOne({ conversationId }).sort({
      createdAt: -1,
    }); // latest message

    if (lastMsg && lastMsg._id.toString() === messageId.toString()) {
      conversation.lastMessage = "A message has been deleted";
      conversation.lastMessageTime = new Date();
      await conversation.save();
    }

    // 5. Emit socket event to other conversation members
    const socketIds = {}; // { userId: { socketId, conversationId } } - replace with your real map
    const receivers = conversation.members.filter((id) => id != senderId);

    // receivers.forEach((receiverId) => {
    //   const userSocket = socketIds[receiverId];
    //   if (userSocket) {
    //     io.to(userSocket.socketId).emit("messageDeleted", {
    //       conversationId,
    //       messageId,
    //       deletedBy: senderId,
    //       isLastMessage: lastMsg && lastMsg._id.toString() === messageId.toString()
    //     });
    //   }
    // });

    return res.status(200).json({
      message: "Message deleted",
      success: true,
      deletedMessage: message,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createGroup = async (req, res) => {};

export const addMembersToGroup = async (req, res) => {};
export const deleteGroup = async (req, res) => {};
export const leaveGroup = async (req, res) => {};
export const getGroupMembers = async (req, res) => {};
export const updateAdmin = async (req, res) => {};
