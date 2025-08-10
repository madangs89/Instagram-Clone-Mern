import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userdetails", // User who receives the notification
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userdetails", // User who triggered the notification
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "comment", "follow", "mention", "message"],
      required: true,
    },
    for: {
      type: String,
      enum: ["post", "reel"],
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Optional: for like/comment/mention
    },
    reel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel", // Optional: for like/comment/mention
    },
    isRead: {
      type: Boolean,
      default: false, // Marks whether user has seen it
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
