import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [String],
      required: true,
      validate: [arrayLimit, "Minimum 2 members required"],
    },
    lastMessage: {
      type: String,
    },
    admins: {
      type: [String],
      default: [],
      validate: {
        validator: function (admins) {
          return admins.every((admin) => this.members.includes(admin));
        },
      },
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    lastMessageTime: {
      type: Date,
    },
    groupName: {
      type: String,
      default: "",
    },
    groupAvatar: {
      type: String, // URL or file path of the group image
      default: "",
    },
    unreadCount: [{ userId: String, count: { type: Number, default: 0 } }],
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length >= 2;
}

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
