import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { notificationService } from '@/services/api/notificationService';
import { toast } from 'react-toastify';

function NotificationPreferences() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getPreferences();
      setPreferences(data);
    } catch (err) {
      setError('Failed to load notification preferences');
      console.error('Preferences loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      await notificationService.updatePreferences(preferences);
      toast.success('Notification preferences saved successfully');
    } catch (err) {
      toast.error('Failed to save notification preferences');
      console.error('Save preferences error:', err);
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (category, type, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const toggleGlobalSetting = (setting) => {
    setPreferences(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadPreferences} />;

  const notificationCategories = [
    {
      id: 'tasks',
      title: 'Task Notifications',
      description: 'Notifications about task assignments, updates, and due dates',
      icon: 'CheckSquare'
    },
    {
      id: 'projects',
      title: 'Project Updates',
      description: 'Updates about project progress, milestones, and changes',
      icon: 'FolderOpen'
    },
    {
      id: 'team',
      title: 'Team Activity',
      description: 'Mentions, comments, and team collaboration updates',
      icon: 'Users'
    },
    {
      id: 'deadlines',
      title: 'Deadline Reminders',
      description: 'Reminders about upcoming due dates and deadlines',
      icon: 'Clock'
    },
    {
      id: 'system',
      title: 'System Updates',
      description: 'Important system announcements and maintenance updates',
      icon: 'Settings'
    }
  ];

  const deliveryMethods = [
    { id: 'email', label: 'Email', icon: 'Mail' },
    { id: 'push', label: 'Push Notifications', icon: 'Bell' },
    { id: 'inApp', label: 'In-App Notifications', icon: 'Monitor' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate('/notifications')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </button>
          
          <div>
            <h1 className="text-3xl font-bold gradient-text">Notification Preferences</h1>
            <p className="text-gray-600 mt-1">
              Customize how and when you receive notifications
            </p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Global Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Global Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Enable All Notifications</h3>
                  <p className="text-sm text-gray-600">Turn all notifications on or off</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.enabled || false}
                    onChange={() => toggleGlobalSetting('enabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Do Not Disturb Mode</h3>
                  <p className="text-sm text-gray-600">Pause notifications during your focus time</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.doNotDisturb || false}
                    onChange={() => toggleGlobalSetting('doNotDisturb')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sound Notifications</h3>
                  <p className="text-sm text-gray-600">Play sounds for new notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences?.soundEnabled || false}
                    onChange={() => toggleGlobalSetting('soundEnabled')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Notification Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Notification Categories</h2>
            
            <div className="space-y-6">
              {notificationCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ApperIcon name={category.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {deliveryMethods.map((method) => (
                      <label key={method.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences?.[category.id]?.[method.id] || false}
                          onChange={(e) => updatePreference(category.id, method.id, e.target.checked)}
                          className="rounded border-gray-300 text-primary focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                        <ApperIcon name={method.icon} size={16} className="text-gray-500" />
                        <span className="text-sm">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Delivery Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Delivery Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiet Hours Start
                </label>
                <input
                  type="time"
                  value={preferences?.quietHoursStart || '22:00'}
                  onChange={(e) => setPreferences(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiet Hours End
                </label>
                <input
                  type="time"
                  value={preferences?.quietHoursEnd || '08:00'}
                  onChange={(e) => setPreferences(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Digest Frequency
              </label>
              <select
                value={preferences?.emailDigestFrequency || 'daily'}
                onChange={(e) => setPreferences(prev => ({ ...prev, emailDigestFrequency: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </select>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end gap-4"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/notifications')}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleSavePreferences}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  Save Preferences
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default NotificationPreferences;