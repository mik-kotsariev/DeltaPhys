const Priority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3
};

class TaskManager {
  constructor() {
    this.tasks = [];
  }

  addTask(title, priorityValue = Priority.LOW) {
    const newTask = {
      id: Date.now() + Math.random(),
      title: title,
      priority: priorityValue,
      createdAt: new Date()
    };
    
    this.tasks.push(newTask);
    this.sortTasks();
    return newTask;
  }

  removeTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  updatePriority(id, newPriority) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.priority = newPriority;
      this.sortTasks();
    }
  }
}