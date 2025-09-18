import tasksData from "@/services/mockData/tasks.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(250);
    const task = this.tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async getByProject(projectId) {
    await delay(350);
    return this.tasks.filter(t => t.projectId === parseInt(projectId));
  }

  async create(taskData) {
    await delay(400);
    const maxId = Math.max(...this.tasks.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      position: this.tasks.filter(t => t.projectId === taskData.projectId && t.status === taskData.status).length + 1
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, taskData) {
    await delay(350);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks[index] = { 
      ...this.tasks[index], 
      ...taskData,
      Id: parseInt(id)
    };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    this.tasks.splice(index, 1);
    return true;
  }
}

export const taskService = new TaskService();