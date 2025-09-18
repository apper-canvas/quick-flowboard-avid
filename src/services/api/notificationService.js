import mockNotifications from '../mockData/notifications.json';
import mockPreferences from '../mockData/notificationPreferences.json';

class NotificationService {
  constructor() {
    // Initialize with mock data if not exists in localStorage
    if (!localStorage.getItem('notifications')) {
      localStorage.setItem('notifications', JSON.stringify(mockNotifications));
    }
    if (!localStorage.getItem('notificationPreferences')) {
      localStorage.setItem('notificationPreferences', JSON.stringify(mockPreferences));
    }
  }

  // Simulate API delay
  delay(ms = 800) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get all notifications
  async getAll() {
    await this.delay();
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return [...notifications].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Get notification by ID
  async getById(id) {
    await this.delay();
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const notification = notifications.find(n => n.Id === parseInt(id));
    if (!notification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    return { ...notification };
  }

  // Create new notification
  async create(notificationData) {
    await this.delay();
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newId = Math.max(0, ...notifications.map(n => n.Id)) + 1;
    
    const newNotification = {
      Id: newId,
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'system',
      priority: notificationData.priority || 'medium',
      isRead: false,
      timestamp: new Date().toISOString(),
      project: notificationData.project || null,
      assignee: notificationData.assignee || null
    };

    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    return { ...newNotification };
  }

  // Mark notification as read
  async markAsRead(id) {
    await this.delay();
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const index = notifications.findIndex(n => n.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Notification with ID ${id} not found`);
    }

    notifications[index].isRead = true;
    localStorage.setItem('notifications', JSON.stringify(notifications));
    return { ...notifications[index] };
  }

  // Mark all notifications as read
  async markAllAsRead() {
    await this.delay();
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    return updatedNotifications;
  }

  // Delete notification
  async delete(id) {
    await this.delay();
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const index = notifications.findIndex(n => n.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error(`Notification with ID ${id} not found`);
    }

    notifications.splice(index, 1);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    return true;
  }

  // Get notification preferences
  async getPreferences() {
    await this.delay();
    const preferences = JSON.parse(localStorage.getItem('notificationPreferences') || '{}');
    return { ...preferences };
  }

  // Update notification preferences
  async updatePreferences(preferences) {
    await this.delay();
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
    return { ...preferences };
  }

  // Get unread count
  async getUnreadCount() {
    await this.delay();
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications.filter(n => !n.isRead).length;
  }

  // Clear all notifications
  async clearAll() {
    await this.delay();
    localStorage.setItem('notifications', JSON.stringify([]));
    return true;
  }
}

export const notificationService = new NotificationService();