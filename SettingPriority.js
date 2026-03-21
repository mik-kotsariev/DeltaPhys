function setPriority(tasks, taskId, newPriority) {
  const updatedTasks = tasks.map(task => {
    if (task.id === taskId) {
      return { ...task, priority: parseInt(newPriority) };
    }
    return task;
  });

  return updatedTasks.sort((a, b) => b.priority - a.priority);
}