import projectsData from "@/services/mockData/projects.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    await delay(300);
    return [...this.projects];
  }

  async getById(id) {
    await delay(250);
    const project = this.projects.find(p => p.Id === parseInt(id));
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  }

  async create(projectData) {
    await delay(400);
    const maxId = Math.max(...this.projects.map(p => p.Id), 0);
    const newProject = {
      Id: maxId + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      members: projectData.members || [1] // Default to current user
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, projectData) {
    await delay(350);
    const index = this.projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    this.projects[index] = { 
      ...this.projects[index], 
      ...projectData,
      Id: parseInt(id)
    };
    return { ...this.projects[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.projects.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Project not found");
    }
    
    this.projects.splice(index, 1);
    return true;
  }
}

export const projectService = new ProjectService();