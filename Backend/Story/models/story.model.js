import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Since you're using microservices
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    viewers: {
      type: [String], // array of userIds who saw this story
      default: [],
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from creation
    },
  },
  { timestamps: true }
);

// TTL Index for auto-deletion after 24 hours
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story = mongoose.model("Story", storySchema);
export default Story;
