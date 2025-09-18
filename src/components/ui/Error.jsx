import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry, showRetry = true }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" size={32} className="text-error" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-secondary mb-8 max-w-md">{message}</p>
      {showRetry && onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;