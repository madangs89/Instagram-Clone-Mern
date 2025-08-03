import Conversation from "../models/Conversation.model";
import Message from "../models/Message";
import { uploadToCloudinarySingle } from "../utils/cloudinary";

export const createMessage = async (req, res) => {
  try {
    let { conversationId, text, receiversId, otherMedia } = req.body;
    const senderId = req.user._id;
    if (
      (!conversationId && !receiversId) ||
      (!text && !req.files && !otherMedia)
    )
      return res.status(400).json({ message: "Missing fields" });

    if (!conversationId) {
      const newConversation = await Conversation.create({
        members: [senderId, receiversId],
        unreadCount: [
          { userId: senderId, count: 0 },
          { userId: receiversId, count: 0 },
        ],
      });
      receiversId = newConversation.members.filter((id) => id != senderId);
      conversationId = newConversation._id;
    } else {
      const conversation = await Conversation.findById(conversationId);
      receiversId = conversation.members.filter((id) => id != senderId);
    }
    let media = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinarySingle(file.path);
        media.push({
          publicId: result.public_id,
          url: result.secure_url,
          type: file.mimetype.startsWith("image") ? "image" : "video",
        });
        fs.unlinkSync(file.path);
      }
    }
    if (otherMedia && otherMedia.length > 0) {
      for (const file of otherMedia) {
        media.push(file);
      }
    }

    // Example placeholder for active sockets (replace with your map)
    let socketIds = {}; // { userId: { socketId, conversationId } }

    let updatingConversation = await Conversation.findById(conversationId);
    const status = receiversId.map((id) => {
      const userSocket = socketIds[id];
      if (userSocket && userSocket.conversationId == conversationId) {
        // Receiver is in chat -> read
        updatingConversation.unreadCount.forEach((user) => {
          if (user.userId == id) user.count = 0;
        });
        return {
          userId: id,
          state: "read",
          readAt: new Date(),
          receivedAt: new Date(),
        };
      } else if (userSocket) {
        updatingConversation.unreadCount.forEach((user) => {
          if (user.userId == id) user.count += 1;
        });
        return {
          userId: id,
          state: "delivered",
          readAt: null,
          receivedAt: new Date(),
        };
      } else {
        // Offline -> sent
        updatingConversation.unreadCount.forEach((user) => {
          if (user.userId == id) user.count += 1;
        });
        return {
          userId: id,
          state: "sent",
          readAt: null,
          receivedAt: null,
        };
      }
    });

    const message = await Message.create({
      conversationId,
      sender: senderId,
      text,
      media,
      status,
    });

    updatingConversation.lastMessage = message.text || "New Attachment Sent";
    updatingConversation.lastMessageTime = new Date();

    await updatingConversation.save();

    return res
      .status(200)
      .json({ message: "Message sent", success: true, message });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

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

export const getAllMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    return res
      .status(200)
      .json({ message: "Messages fetched", success: true, messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getAllConversationAndGroup = async (req, res) => {};
export const createGroup = async (req, res) => {};
export const addMembersToGroup = async (req, res) => {};
export const deleteGroup = async (req, res) => {};
export const leaveGroup = async (req, res) => {};
export const getGroupMembers = async (req, res) => {};
export const updateAdmin = async (req, res) => {};
