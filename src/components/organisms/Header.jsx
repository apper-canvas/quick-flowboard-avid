import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProjectSelector from "@/components/molecules/ProjectSelector";
import UserMenu from "@/components/molecules/UserMenu";
import Modal from "@/components/molecules/Modal";
import CreateProjectForm from "@/components/molecules/CreateProjectForm";
import { projectService } from "@/services/api/projectService";
import { notificationService } from "@/services/api/notificationService";
const Header = () => {
  const location = useLocation();
const navigate = useNavigate();
  const { projectId } = useParams();
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const notifications = await notificationService.getAll();
        const unread = notifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Failed to load notification count:', error);
      }
    };

    loadUnreadCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);
  const navigationItems = [
    { name: "Dashboard", href: "/", icon: "Home" },
    { name: "Projects", href: "/projects", icon: "FolderOpen" },
    { name: "Board", href: projectId ? `/board/${projectId}` : "/board", icon: "Kanban" },
    { name: "Timeline", href: projectId ? `/timeline/${projectId}` : "/timeline", icon: "Calendar" },
    { name: "Team", href: "/team", icon: "Users" }
  ];

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setShowCreateProject(false);
      navigate(`/board/${newProject.Id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      throw error;
    }
  };

  const handleProjectSelect = (selectedProjectId) => {
    // Navigation will be handled by ProjectSelector
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 glassmorphism">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl gradient-text">FlowBoard</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href.includes("/board") && location.pathname.includes("/board")) ||
                  (item.href.includes("/timeline") && location.pathname.includes("/timeline"));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <ApperIcon name={item.icon} size={16} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Center - Project Selector */}
            <div className="hidden md:flex items-center">
              <ProjectSelector 
                currentProjectId={projectId}
                onProjectSelect={handleProjectSelect}
              />
            </div>

            {/* Right Side */}
<div className="flex items-center gap-4">
              {/* Notification Bell */}
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-200"
                aria-label="Notifications"
              >
                <ApperIcon name="Bell" size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <Button
                onClick={() => setShowCreateProject(true)}
                className="hidden sm:flex gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <ApperIcon name="Plus" size={16} />
                New Project
              </Button>

              <UserMenu />
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {/* Mobile Project Selector */}
                <div className="mb-4">
                  <ProjectSelector 
                    currentProjectId={projectId}
                    onProjectSelect={(id) => {
                      handleProjectSelect(id);
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>

                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.href || 
                    (item.href.includes("/board") && location.pathname.includes("/board")) ||
                    (item.href.includes("/timeline") && location.pathname.includes("/timeline"));
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <ApperIcon name={item.icon} size={16} />
                      {item.name}
                    </Link>
                  );
                })}

                <Button
                  onClick={() => {
                    setShowCreateProject(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full gap-2 mt-4 bg-gradient-to-r from-primary to-accent"
                >
                  <ApperIcon name="Plus" size={16} />
                  New Project
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <Modal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        title="Create New Project"
        size="lg"
      >
        <CreateProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowCreateProject(false)}
        />
      </Modal>
    </>
  );
};

export default Header;