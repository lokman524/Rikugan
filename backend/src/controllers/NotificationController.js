const NotificationService = require('../services/NotificationService');

class NotificationController {
  async getUserNotifications(req, res, next) {
    try {
      const unreadOnly = req.query.unread === 'true';
      const notifications = await NotificationService.getUserNotifications(
        req.user.id,
        unreadOnly
      );

      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const count = await NotificationService.getUnreadCount(req.user.id);

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const notification = await NotificationService.markAsRead(
        req.params.id,
        req.user.id
      );

      res.json({
        success: true,
        message: 'Notification marked as read',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      await NotificationService.markAllAsRead(req.user.id);

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      await NotificationService.deleteNotification(req.params.id, req.user.id);

      res.json({
        success: true,
        message: 'Notification deleted'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
