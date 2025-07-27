import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    media: {
      type: [String], // videos or images
      required: true,
    },
    likes: {
      type: [String], // userIds
      default: [],
    },
    views: {
      type: [String], // userIds
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Reel = mongoose.model("Reel", reelSchema);
export default Reel;
