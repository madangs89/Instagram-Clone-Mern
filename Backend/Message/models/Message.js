import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
    media: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String },
          type: {
            type: [String],
            required: true,
            enum: ["image", "video", "reel", "post"],
          },
        },
      ],
      default: [],
    },
    status: [
      {
        userId: { type: String, required: true },
        state: {
          type: String,
          enum: ["sent", "delivered", "read"],
          default: "sent",
        },
        receivedAt: { type: Date },
        readAt: { type: Date },
      },
    ],
    reactions: {
      type: [
        {
          userId: { type: String, required: true },
          emoji: {
            type: String,
          },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
