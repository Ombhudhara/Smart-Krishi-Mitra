import Notification from "../models/Notification.js";

/**
 * Get all notifications for the logged-in user.
 * GET /api/notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error in getNotifications controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving notifications." });
  }
};

/**
 * Mark a single notification as read.
 * PUT /api/notifications/:id/read
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({ success: true, message: "Notification marked as read.", notification });
  } catch (error) {
    console.error("Error in markAsRead controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error marking notification as read." });
  }
};

/**
 * Mark all notifications as read for current user.
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    console.error("Error in markAllAsRead controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error marking notifications as read." });
  }
};

/**
 * Delete a notification.
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    await Notification.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Notification deleted successfully." });
  } catch (error) {
    console.error("Error in deleteNotification controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error deleting notification." });
  }
};
