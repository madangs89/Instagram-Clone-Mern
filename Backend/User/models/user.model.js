import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "User name is required"],
    minlength: 1,
    maxlength: 20,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  postCount: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: "https://www.gravatar.com/avatar/?d=mp",
  },
  publicId: {
    type: String,
    default: "",
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  bio: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "none",
    enum: ["none", "Male", "Female", "Other"],
  },
  highlights: [
    {
      name: {
        type: String,
        required: true,
      },
      videoUrl: {
        type: [
          {
            url: {
              type: String,
              required: true,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        default: [],
      },
    },
  ],
});
const User = mongoose.model("User", userSchema);
export default User;
