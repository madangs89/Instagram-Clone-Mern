import express from "express";
import {
  createNotification,
  deleteNotification,
  getUserNotifications,
  markAllAsRead,
  markNotificationAsRead,
} from "../controllers/notification.contrler.js";
import { authMiddleware } from "../middelwares/auth.middelware.js";

const notificationRouter = express.Router();

// Create a new notification
notificationRouter.post("/", authMiddleware, createNotification);

// Get all notifications for a user
notificationRouter.get("/", authMiddleware, getUserNotifications);
notificationRouter.patch("/read/:id", markNotificationAsRead);

// Mark all notifications for a user as read
notificationRouter.patch("/read-all/:userId", markAllAsRead);

// Delete a notification
notificationRouter.delete("/:id", deleteNotification);

export default notificationRouter;
