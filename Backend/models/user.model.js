import mongoose from "mongoose";

const userModel = new mongoose.Schema({});

const User = mongoose.model("User", userModel);

export default User;
