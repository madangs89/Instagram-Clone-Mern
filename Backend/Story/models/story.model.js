import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    userSnapshot: {
      name: String,
      userName: String,
      avatar: String,
    },
    caption: {
      type: String,
      default: "",
    },
    viewers: {
      type: [
        {
          userId: String,
          avatar: String,
          userName: String,
        },
      ],
      default: [],
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// TTL Index for auto-deletion after 24 hours
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", storySchema);
export default Story;
