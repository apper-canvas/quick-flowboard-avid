import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { userService } from "@/services/api/userService";

const CreateTaskForm = ({ projectId, columnId, onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium",
    dueDate: "",
    ...initialData
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        const userData = await userService.getAll();
        setUsers(userData);
      } catch (error) {
        console.error("Failed to load users:", error);
        toast.error("Failed to load team members");
      } finally {
        setUsersLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Task title is required");
      return;
    }

    try {
      setLoading(true);
      
      const taskData = {
        ...formData,
        projectId: parseInt(projectId),
        status: columnId || "todo",
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
        assigneeId: formData.assigneeId ? parseInt(formData.assigneeId) : null
      };

      await onSubmit(taskData);
      toast.success(initialData ? "Task updated successfully" : "Task created successfully");
    } catch (error) {
      console.error("Failed to save task:", error);
      toast.error("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Task Title"
        value={formData.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Enter task title..."
        required
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Describe the task..."
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Assignee"
          value={formData.assigneeId}
          onChange={(e) => handleChange("assigneeId", e.target.value)}
          disabled={usersLoading}
        >
          <option value="">Select assignee</option>
          {users.map((user) => (
            <option key={user.Id} value={user.Id}>
              {user.name} ({user.role})
            </option>
          ))}
        </Select>

        <Select
          label="Priority"
          value={formData.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>

      <Input
        label="Due Date"
        type="date"
        value={formData.dueDate}
        onChange={(e) => handleChange("dueDate", e.target.value)}
      />

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
          {initialData ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default CreateTaskForm;