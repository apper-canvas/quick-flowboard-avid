import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";

const TaskCard = ({ 
  task, 
  user,
  onEdit, 
  isDragging = false,
  dragHandleProps,
  ...props 
}) => {
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-surface border rounded-lg p-4 cursor-pointer transition-all duration-200
        ${isDragging ? "dragging shadow-2xl" : "task-card-hover shadow-sm hover:shadow-lg"}
        ${task.priority ? `priority-${task.priority.toLowerCase()}` : ""}
      `}
      onClick={() => onEdit?.(task)}
      {...props}
    >
      <div 
        className="drag-handle relative w-full h-2 -mx-4 -mt-4 mb-3 cursor-grab active:cursor-grabbing"
        {...dragHandleProps}
      />
      
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-gray-900 line-clamp-2 flex-1">
            {task.title}
          </h4>
          {task.priority && (
            <Badge variant={getPriorityColor(task.priority)} size="sm">
              {task.priority}
            </Badge>
          )}
        </div>

        {task.description && (
          <p className="text-sm text-secondary line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {user && (
              <Avatar 
                src={user.avatar} 
                name={user.name} 
                size="sm"
                title={user.name}
              />
            )}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${
                isOverdue ? "text-error" : "text-secondary"
              }`}>
                <ApperIcon name="Calendar" size={12} />
                <span>{format(new Date(task.dueDate), "MMM d")}</span>
                {isOverdue && <ApperIcon name="AlertCircle" size={12} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;