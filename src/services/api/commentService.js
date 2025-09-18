import commentsData from "@/services/mockData/comments.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommentService {
  constructor() {
    this.comments = [...commentsData];
  }

  async getAll() {
    await delay(300);
    return [...this.comments];
  }

  async getById(id) {
    await delay(250);
    const comment = this.comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  }

  async getByTask(taskId) {
    await delay(350);
    return this.comments.filter(c => c.taskId === parseInt(taskId));
  }

  async create(commentData) {
    await delay(400);
    const maxId = Math.max(...this.comments.map(c => c.Id), 0);
    const newComment = {
      Id: maxId + 1,
      ...commentData,
      createdAt: new Date().toISOString()
    };
    this.comments.push(newComment);
    return { ...newComment };
  }

  async update(id, commentData) {
    await delay(350);
    const index = this.comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    this.comments[index] = { 
      ...this.comments[index], 
      ...commentData,
      Id: parseInt(id)
    };
    return { ...this.comments[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.comments.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Comment not found");
    }
    
    this.comments.splice(index, 1);
    return true;
  }
}

export const commentService = new CommentService();