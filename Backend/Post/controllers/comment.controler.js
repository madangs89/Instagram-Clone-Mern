import Comment from "../models/comment.model.js";
import Userdetails from "../models/user.model.js";
import Reel from "../models/reel.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

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

    if (!newComment) {
      return res
        .status(400)
        .json({ success: false, message: "Comment not created" });
    }

    let isValue = false;

    const reelData = await Reel.findById(mediaId);
    if (reelData) {
      await Notification.create({
        receiver: reelData.userId,
        sender: req.user._id,
        type: "comment",
        reel: mediaId,
        for: "reel",
      });
      isValue = true;
    }
    if (!isValue) {
      const postData = await Post.findById(mediaId);
      await Notification.create({
        receiver: postData.userId,
        sender: req.user._id,
        type: "comment",
        post: mediaId,
        for: "post",
      });
    }
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
