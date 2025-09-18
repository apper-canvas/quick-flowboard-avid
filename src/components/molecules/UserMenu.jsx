import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Badge from "@/components/atoms/Badge";
import { userService } from "@/services/api/userService";

const UserMenu = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        setLoading(true);
        // Simulate getting current user (ID: 1)
        const user = await userService.getById(1);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to load current user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  if (loading || !currentUser) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="hidden sm:block w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/80 transition-colors"
      >
        <Avatar src={currentUser.avatar} name={currentUser.name} />
        <div className="hidden sm:block text-left">
          <div className="font-medium text-gray-900">{currentUser.name}</div>
          <div className="text-xs text-secondary">{currentUser.role}</div>
        </div>
        <ApperIcon name="ChevronDown" size={14} className="text-gray-500" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border glassmorphism z-20">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{currentUser.name}</div>
                  <div className="text-sm text-secondary">{currentUser.email}</div>
                  <Badge 
                    variant={currentUser.role === "admin" ? "primary" : "default"} 
                    size="sm" 
                    className="mt-1"
                  >
                    {currentUser.role}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left">
                <ApperIcon name="Settings" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Settings</span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors text-left">
                <ApperIcon name="HelpCircle" size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">Help & Support</span>
              </button>
              <hr className="my-2" />
              <button className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-red-50 transition-colors text-left text-red-600">
                <ApperIcon name="LogOut" size={16} />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;