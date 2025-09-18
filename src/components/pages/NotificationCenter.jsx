import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Avatar from '@/components/atoms/Avatar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { notificationService } from '@/services/api/notificationService';
import { toast } from 'react-toastify';

function NotificationCenter() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Notification loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.Id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
      toast.success('Notification marked as read');
    } catch (err) {
      toast.error('Failed to mark notification as read');
      console.error('Mark as read error:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all notifications as read');
      console.error('Mark all as read error:', err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      setNotifications(prev =>
        prev.filter(notification => notification.Id !== notificationId)
      );
      toast.success('Notification deleted');
    } catch (err) {
      toast.error('Failed to delete notification');
      console.error('Delete notification error:', err);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task_assignment':
        return 'UserPlus';
      case 'task_due':
        return 'Clock';
      case 'project_update':
        return 'FolderOpen';
      case 'team_mention':
        return 'AtSign';
      case 'deadline_reminder':
        return 'AlertTriangle';
      default:
        return 'Bell';
    }
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-error';
    switch (type) {
      case 'task_assignment':
        return 'text-primary';
      case 'task_due':
        return 'text-warning';
      case 'project_update':
        return 'text-info';
      case 'team_mention':
        return 'text-accent';
      case 'deadline_reminder':
        return 'text-error';
      default:
        return 'text-gray-500';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return time.toLocaleDateString();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadNotifications} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/notifications/preferences')}
              className="gap-2"
            >
              <ApperIcon name="Settings" size={16} />
              Preferences
            </Button>
            
            {unreadCount > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="gap-2"
              >
                <ApperIcon name="CheckCheck" size={16} />
                Mark All Read
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit"
        >
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'read', label: 'Read', count: notifications.length - unreadCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  filter === tab.key 
                    ? 'bg-primary/10 text-primary'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <ApperIcon name="Bell" size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' : 
                 filter === 'read' ? 'No read notifications' : 'No notifications yet'}
              </h3>
              <p className="text-gray-500">
                {filter === 'unread' 
                  ? 'All caught up! Check back later for new updates.'
                  : 'New notifications will appear here when you have activity.'}
              </p>
            </motion.div>
          ) : (
            filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white border rounded-xl p-4 hover:shadow-md transition-all duration-200 ${
                  !notification.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${
                    !notification.isRead ? 'bg-primary/10' : ''
                  }`}>
                    <ApperIcon 
                      name={getNotificationIcon(notification.type)}
                      size={20}
                      className={getNotificationColor(notification.type, notification.priority)}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <p className="text-gray-600 mt-1 text-sm">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          
                          {notification.project && (
                            <Badge variant="default" size="sm">
                              {notification.project}
                            </Badge>
                          )}
                          
                          {notification.priority === 'high' && (
                            <Badge variant="error" size="sm">
                              High Priority
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.Id)}
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <ApperIcon name="Check" size={16} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteNotification(notification.Id)}
                          className="p-1.5 text-gray-400 hover:text-error hover:bg-error/10 rounded-full transition-colors"
                          title="Delete notification"
                        >
                          <ApperIcon name="X" size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Assignee/User info */}
                    {notification.assignee && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <Avatar
                          src={notification.assignee.avatar}
                          name={notification.assignee.name}
                          size="sm"
                        />
                        <span className="text-sm text-gray-600">
                          Assigned by {notification.assignee.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationCenter;