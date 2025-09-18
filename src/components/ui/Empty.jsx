import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No items found",
  description = "Get started by creating your first item",
  icon = "Inbox",
  action,
  actionLabel = "Create New"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/5 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={36} className="text-primary" />
      </div>
      <h3 className="text-xl font-semibold gradient-text mb-2">{title}</h3>
      <p className="text-secondary mb-8 max-w-md">{description}</p>
      {action && (
        <Button onClick={action} className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;