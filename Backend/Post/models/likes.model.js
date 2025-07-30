import mongoose from "mongoose";

const likesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userdetails",
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      enum: ["Post", "Reel"],
      required: true,
    },
  },
  { timestamps: true }
);

// Optional compound index to ensure uniqueness (a user can like a reel/post only once)
likesSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

const Likes = mongoose.model("Likes", likesSchema);
export default Likes;