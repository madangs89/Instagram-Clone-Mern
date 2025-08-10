import Notification from "../models/notification.model.js";

export const createNotification = async (req, res) => {
  try {
    const { receiver, sender, type, post } = req.body;

    // Avoid self-notifications (optional)
    if (receiver === sender) {
      return res.status(400).json({ message: "You cannot notify yourself" });
    }

    const notification = await Notification.create({
      receiver,
      sender,
      type,
      post: post || undefined,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const notifications = await Notification.find({ receiver: userId })
      .populate("sender", "username profilePic")
      .populate("post", "image caption")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.params.userId;

    await Notification.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const deleted = await Notification.findByIdAndDelete(notificationId);

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
