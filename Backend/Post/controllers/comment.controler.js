import Comment from "../models/comment.model.js";
import Userdetails from "../models/user.model.js";

export const addComment = async (req, res) => {
  try {
    const { mediaId, comment } = req.body;
    const userId = req.user._id;

    const user = await Userdetails.findById(userId);
    if (!user) {
      await Userdetails.create({
        _id: userId,
        name: req.user.name,
        userName: req.user.userName,
        avatar: req.user.avatar,
      });
    }
    const newComment = await Comment.create({
      mediaId,
      userId,
      comment,
    });

    const commentWithUser = await Comment.findById(newComment._id).populate(
      "userId"
    );
    return res.status(201).json({ success: true, comment: commentWithUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    //Delete root comment
    const deleted = await Comment.findByIdAndDelete(commentId);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }
    return res.json({ success: true, message: "Comment deleted", commentId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllComments = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const comments = await Comment.find({ mediaId }).populate("userId");
    return res.json({ success: true, comments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
