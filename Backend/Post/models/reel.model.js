import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userdetails",
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    media: {
      type: String,
      required: true,
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
