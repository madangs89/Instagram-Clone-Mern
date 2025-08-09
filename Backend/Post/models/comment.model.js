import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  mediaId: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Userdetails",
    required: true,
  },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
