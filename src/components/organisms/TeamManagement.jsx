import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { userService } from "@/services/api/userService";
import { taskService } from "@/services/api/taskService";

const TeamManagement = () => {
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const usersData = await userService.getAll();
      setUsers(usersData);

      // Load user statistics
      const stats = {};
      for (const user of usersData) {
        try {
          const allTasks = await taskService.getAll();
          const userTasks = allTasks.filter(task => task.assigneeId === user.Id);
          const completedTasks = userTasks.filter(task => task.status === "done");
          const overdueTasks = userTasks.filter(task => 
            task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done"
          );
          
          stats[user.Id] = {
            totalTasks: userTasks.length,
            completedTasks: completedTasks.length,
            overdueTasks: overdueTasks.length,
            completionRate: userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0
          };
        } catch (err) {
          console.error(`Failed to load stats for user ${user.Id}:`, err);
          stats[user.Id] = {
            totalTasks: 0,
            completedTasks: 0,
            overdueTasks: 0,
            completionRate: 0
          };
        }
      }
      setUserStats(stats);

    } catch (err) {
      console.error("Failed to load team data:", err);
      setError("Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await userService.create(userData);
      setUsers(prev => [...prev, newUser]);
      setUserStats(prev => ({
        ...prev,
        [newUser.Id]: {
          totalTasks: 0,
          completedTasks: 0,
          overdueTasks: 0,
          completionRate: 0
        }
      }));
      setShowCreateUser(false);
      toast.success("Team member added successfully");
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const updatedUser = await userService.update(selectedUser.Id, userData);
      setUsers(prev => prev.map(u => u.Id === selectedUser.Id ? updatedUser : u));
      setSelectedUser(null);
      toast.success("Team member updated successfully");
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) {
      return;
    }

    try {
      await userService.delete(userId);
      setUsers(prev => prev.filter(u => u.Id !== userId));
      setUserStats(prev => {
        const newStats = { ...prev };
        delete newStats[userId];
        return newStats;
      });
      toast.success("Team member removed successfully");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to remove team member");
    }
  };

  const getRoleVariant = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "primary";
      case "member": return "default";
      case "viewer": return "warning";
      default: return "default";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "Shield";
      case "member": return "User";
      case "viewer": return "Eye";
      default: return "User";
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadTeamData} />;
  }

  if (!users.length) {
    return (
      <Empty
        title="No team members"
        description="Add team members to start collaborating on projects and assigning tasks."
        icon="UserPlus"
        action={() => setShowCreateUser(true)}
        actionLabel="Add Team Member"
      />
    );
  }

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold gradient-text">Team Management</h2>
            <p className="text-secondary mt-1">Manage your team members and their roles</p>
          </div>
          <Button 
            onClick={() => setShowCreateUser(true)}
            className="gap-2 bg-gradient-to-r from-primary to-accent"
          >
            <ApperIcon name="UserPlus" size={16} />
            Add Member
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <ApperIcon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </Select>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => {
            const stats = userStats[user.Id] || {};
            
            return (
              <motion.div
                key={user.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-surface border rounded-xl p-6 glassmorphism task-card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={user.avatar} 
                      name={user.name} 
                      size="lg" 
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-secondary">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={getRoleVariant(user.role)} className="gap-1">
                    <ApperIcon name={getRoleIcon(user.role)} size={12} />
                    {user.role}
                  </Badge>
                </div>

                {/* User Statistics */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-primary/5 rounded-md">
                    <div className="text-lg font-semibold text-primary">
                      {stats.totalTasks || 0}
                    </div>
                    <div className="text-xs text-gray-600">Tasks</div>
                  </div>
                  <div className="text-center p-2 bg-success/5 rounded-md">
                    <div className="text-lg font-semibold text-success">
                      {stats.completedTasks || 0}
                    </div>
                    <div className="text-xs text-gray-600">Done</div>
                  </div>
                  <div className="text-center p-2 bg-error/5 rounded-md">
                    <div className="text-lg font-semibold text-error">
                      {stats.overdueTasks || 0}
                    </div>
                    <div className="text-xs text-gray-600">Overdue</div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats.completionRate || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.completionRate || 0}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(user)}
                    className="flex-1 gap-1"
                  >
                    <ApperIcon name="Edit" size={14} />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.Id)}
                    className="gap-1 text-error hover:text-error"
                  >
                    <ApperIcon name="Trash2" size={14} />
                    Remove
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateUser}
        onClose={() => setShowCreateUser(false)}
        title="Add Team Member"
        size="lg"
      >
        <CreateUserForm
          onSubmit={handleCreateUser}
          onCancel={() => setShowCreateUser(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Edit Team Member"
        size="lg"
      >
        {selectedUser && (
          <CreateUserForm
            initialData={selectedUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setSelectedUser(null)}
          />
        )}
      </Modal>
    </>
  );
};

// Create User Form Component
const CreateUserForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "member",
    avatar: "",
    ...initialData
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error("Failed to save team member");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Enter full name..."
          required
        />
        <Input
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="Enter email address..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Role"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
          <option value="viewer">Viewer</option>
        </Select>
        <Input
          label="Avatar URL (Optional)"
          value={formData.avatar}
          onChange={(e) => handleChange("avatar", e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="gap-2"
        >
          {loading && <ApperIcon name="Loader" size={16} className="animate-spin" />}
          {initialData ? "Update Member" : "Add Member"}
        </Button>
      </div>
    </form>
  );
};

export default TeamManagement;