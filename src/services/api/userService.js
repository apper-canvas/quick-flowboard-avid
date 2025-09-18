import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(250);
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async create(userData) {
    await delay(400);
    const maxId = Math.max(...this.users.map(u => u.Id), 0);
    const newUser = {
      Id: maxId + 1,
      ...userData
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await delay(350);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users[index] = { 
      ...this.users[index], 
      ...userData,
      Id: parseInt(id)
    };
    return { ...this.users[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) {
      throw new Error("User not found");
    }
    
    this.users.splice(index, 1);
    return true;
  }
}

export const userService = new UserService();