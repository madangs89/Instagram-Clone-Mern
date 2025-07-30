import mongoose from "mongoose";

const viewsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Userdetails",
      required: true,
    },
    reelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reel",
      required: true,
    },
  },
  { timestamps: true }
);

const Views = mongoose.model("Views", viewsSchema);
export default Views;
