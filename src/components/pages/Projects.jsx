import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "@/components/molecules/Modal";
import CreateProjectForm from "@/components/molecules/CreateProjectForm";
import ProjectGrid from "@/components/organisms/ProjectGrid";
import { projectService } from "@/services/api/projectService";

const Projects = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const navigate = useNavigate();

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

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text">Projects</h1>
              <p className="text-secondary mt-2">
                Manage all your projects and track their progress
              </p>
            </div>
            
            <ProjectGrid onCreateProject={() => setShowCreateProject(true)} />
          </div>
        </div>
      </div>

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

export default Projects;