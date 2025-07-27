import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
      enum: ["image", "video"],
    },
    media: {
      type: [String],
      required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [
        {
          userId: { type: String, required: true },
          comment: { type: String, required: true },
          reply: [
            {
              userId: { type: String, required: true },
              comment: { type: String, required: true },
              createdAt: { type: Date, default: Date.now },
            },
          ],
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
