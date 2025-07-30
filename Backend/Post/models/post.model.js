import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
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
    mediaType: {
      type: String,
      required: true,
      enum: ["image", "video"],
    },
    media: {
      type: [
        {
          publicId: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      required: true,
    },
    // comments: {
    //   type: [
    //     {
    //       userId: { type: String, required: true },
    //       comment: { type: String, required: true },
    //       reply: [
    //         {
    //           userId: { type: String, required: true },
    //           comment: { type: String, required: true },
    //           createdAt: { type: Date, default: Date.now },
    //         },
    //       ],
    //       createdAt: { type: Date, default: Date.now },
    //     },
    //   ],
    //   default: [],
    // },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
