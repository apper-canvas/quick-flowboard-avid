import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { projectService } from "@/services/api/projectService";

const ProjectSelector = ({ currentProjectId, onProjectSelect }) => {
  const [projects, setProjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentProject = projects.find(p => p.Id === parseInt(currentProjectId));

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAll();
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectSelect = (projectId) => {
    onProjectSelect?.(projectId);
    setIsOpen(false);
    navigate(`/board/${projectId}`);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="gap-2 bg-white/80 backdrop-blur-sm hover:bg-white"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        <ApperIcon name="Folder" size={16} />
        <span className="hidden sm:inline">
          {loading ? "Loading..." : currentProject?.name || "Select Project"}
        </span>
        <ApperIcon name="ChevronDown" size={14} />
      </Button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border glassmorphism z-20">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Projects</span>
                <Badge variant="default" size="sm">
                  {projects.length}
                </Badge>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.Id}
                  onClick={() => handleProjectSelect(project.Id)}
                  className={`w-full p-3 text-left hover:bg-primary/5 transition-colors flex items-center justify-between ${
                    currentProject?.Id === project.Id ? "bg-primary/10 border-r-2 border-primary" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-secondary line-clamp-1">
                      {project.description}
                    </div>
                  </div>
                  <Badge 
                    variant={project.status === "active" ? "success" : "default"} 
                    size="sm"
                  >
                    {project.status}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSelector;