import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import { userService } from "@/services/api/userService";

const ProjectGrid = ({ onCreateProject }) => {
  const [projects, setProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [projectsData, usersData] = await Promise.all([
        projectService.getAll(),
        userService.getAll()
      ]);

      setProjects(projectsData);
      setUsers(usersData);

      // Load project statistics
      const stats = {};
      for (const project of projectsData) {
        const tasks = await taskService.getByProject(project.Id);
        const completedTasks = tasks.filter(task => task.status === "done").length;
        const overdueTasks = tasks.filter(task => 
          task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done"
        ).length;
        
        stats[project.Id] = {
          totalTasks: tasks.length,
          completedTasks,
          overdueTasks,
          progress: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0
        };
      }
      setProjectStats(stats);

    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "active": return "success";
      case "completed": return "primary";
      case "archived": return "default";
      case "inactive": return "warning";
      default: return "default";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "success";
    if (progress >= 50) return "primary";
    if (progress >= 20) return "warning";
    return "error";
  };

  if (loading) {
    return <Loading type="cards" count={6} />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProjects} />;
  }

  if (!projects.length) {
    return (
      <Empty
        title="No projects yet"
        description="Create your first project to start organizing your team's work with powerful Kanban boards and timeline views."
        icon="FolderPlus"
        action={onCreateProject}
        actionLabel="Create Project"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {projects.map((project, index) => {
        const stats = projectStats[project.Id] || {};
        const progressColor = getProgressColor(stats.progress || 0);
        
        return (
          <motion.div
            key={project.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-surface border rounded-xl p-6 task-card-hover glassmorphism h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-secondary line-clamp-3 mb-3">
                    {project.description || "No description provided"}
                  </p>
                </div>
                <Badge variant={getStatusVariant(project.status)} size="sm">
                  {project.status}
                </Badge>
              </div>

              {/* Project Statistics */}
              <div className="flex-1 space-y-4 mb-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r h-2 rounded-full transition-all duration-300 ${
                        progressColor === "success" ? "from-success to-success/80" :
                        progressColor === "primary" ? "from-primary to-primary/80" :
                        progressColor === "warning" ? "from-warning to-warning/80" :
                        "from-error to-error/80"
                      }`}
                      style={{ width: `${stats.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Task Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-primary/5 rounded-md">
                    <div className="text-lg font-semibold text-primary">
                      {stats.totalTasks || 0}
                    </div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="p-2 bg-success/5 rounded-md">
                    <div className="text-lg font-semibold text-success">
                      {stats.completedTasks || 0}
                    </div>
                    <div className="text-xs text-gray-600">Done</div>
                  </div>
                  <div className="p-2 bg-error/5 rounded-md">
                    <div className="text-lg font-semibold text-error">
                      {stats.overdueTasks || 0}
                    </div>
                    <div className="text-xs text-gray-600">Overdue</div>
                  </div>
                </div>
              </div>

              {/* Project Members */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Users" size={14} className="text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {project.members?.length || 0} members
                  </span>
                </div>
                <div className="flex -space-x-1">
                  {project.members?.slice(0, 3).map((memberId) => {
                    const user = users.find(u => u.Id === memberId);
                    if (!user) return null;
                    return (
                      <Avatar
                        key={user.Id}
                        src={user.avatar}
                        name={user.name}
                        size="sm"
                        className="border-2 border-white"
                      />
                    );
                  })}
                  {project.members?.length > 3 && (
                    <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        +{project.members.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-gray-500">
                  Created {format(new Date(project.createdAt), "MMM d, yyyy")}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/timeline/${project.Id}`)}
                    className="gap-1"
                  >
                    <ApperIcon name="Calendar" size={14} />
                    Timeline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/board/${project.Id}`)}
                    className="gap-1 bg-gradient-to-r from-primary to-accent"
                  >
                    <ApperIcon name="Kanban" size={14} />
                    Board
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProjectGrid;