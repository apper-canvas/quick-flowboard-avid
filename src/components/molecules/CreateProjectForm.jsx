import React, { useState } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CreateProjectForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
    ...initialData
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      toast.success(initialData ? "Project updated successfully" : "Project created successfully");
    } catch (error) {
      console.error("Failed to save project:", error);
      toast.error("Failed to save project");
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
        label="Project Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Enter project name..."
        required
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        placeholder="Describe your project..."
        rows={3}
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => handleChange("status", e.target.value)}
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="completed">Completed</option>
        <option value="archived">Archived</option>
      </Select>

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
          {initialData ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};

export default CreateProjectForm;