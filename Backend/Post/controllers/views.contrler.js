import Userdetails from "../models/user.model.js";
import Views from "../models/views.model.js";

export const createView = async (req, res) => {
  try {
    const { reelId } = req.body;
    const userId = req.user._id;
    
    let userDetails = await Userdetails.findOne({ _id: userId });
    if (!userDetails) {
      userDetails = await Userdetails.create({
        _id: userId,
        name: req.user.name,
        userName: req.user.userName,
        avatar: req.user.avatar,
      });
    }
    const existingView = await Views.findOne({ userId, reelId });
    if (existingView) {
      return res
        .status(400)
        .json({ success: false, message: "View already exists" });
    }
    const views = await Views.create({ userId, reelId });
    return res
      .status(201)
      .json({ success: true, views, message: "View created" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
