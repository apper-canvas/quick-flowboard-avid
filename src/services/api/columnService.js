import columnsData from "@/services/mockData/columns.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ColumnService {
  constructor() {
    this.columns = [...columnsData];
  }

  async getAll() {
    await delay(300);
    return [...this.columns];
  }

  async getByProject(projectId) {
    await delay(350);
    return this.columns.filter(c => c.projectId === parseInt(projectId));
  }

  async create(columnData) {
    await delay(400);
    const newColumn = {
      ...columnData,
      position: this.columns.filter(c => c.projectId === columnData.projectId).length + 1
    };
    this.columns.push(newColumn);
    return { ...newColumn };
  }

  async update(id, columnData) {
    await delay(350);
    const index = this.columns.findIndex(c => c.id === id && c.projectId === columnData.projectId);
    if (index === -1) {
      throw new Error("Column not found");
    }
    
    this.columns[index] = { 
      ...this.columns[index], 
      ...columnData
    };
    return { ...this.columns[index] };
  }

  async delete(id, projectId) {
    await delay(300);
    const index = this.columns.findIndex(c => c.id === id && c.projectId === parseInt(projectId));
    if (index === -1) {
      throw new Error("Column not found");
    }
    
    this.columns.splice(index, 1);
    return true;
  }
}

export const columnService = new ColumnService();